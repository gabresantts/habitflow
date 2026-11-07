/**
 * @file HabitService.test.js
 * @description Testes unitários para as regras de negócio e casos de uso do HabitService (RNF04).
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSONHabitRepository } from '../../src/infrastructure/storage/JSONHabitRepository.js';
import { HabitService } from '../../src/application/services/HabitService.js';

describe('HabitService', () => {
  const testDbPath = path.resolve(process.cwd(), 'habitflow-test-data.json');
  let repository;
  let service;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    repository = new JSONHabitRepository(testDbPath);
    service = new HabitService({ repository });
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
      } catch {
        // Ignora eventual lock de arquivo
      }
    }
  });

  it('deve criar um novo hábito com sucesso quando os dados forem válidos', () => {
    const habit = service.createHabit({
      title: 'Beber 2L de água',
      category: 'Saúde',
      targetDaysPerWeek: 7
    });

    assert.ok(habit.id);
    assert.equal(habit.title, 'Beber 2L de água');
    assert.equal(habit.category, 'Saúde');
    assert.equal(habit.targetDaysPerWeek, 7);
    assert.equal(habit.isArchived, false);
  });

  it('deve lançar erro ao tentar cadastrar hábito com título vazio ou com menos de 3 caracteres', () => {
    assert.throws(() => {
      service.createHabit({ title: '   ' });
    }, /Validação de Domínio/);

    assert.throws(() => {
      service.createHabit({ title: 'AB' });
    }, /Validação de Domínio/);
  });

  it('deve rejeitar meta semanal fora do intervalo entre 1 e 7 dias', () => {
    assert.throws(() => {
      service.createHabit({ title: 'Estudar', targetDaysPerWeek: 0 });
    }, /A meta de dias por semana deve estar entre 1 e 7/);

    assert.throws(() => {
      service.createHabit({ title: 'Estudar', targetDaysPerWeek: 8 });
    }, /A meta de dias por semana deve estar entre 1 e 7/);
  });

  it('deve registrar check-in e impedir duplicação na mesma data para o mesmo hábito', () => {
    const habit = service.createHabit({ title: 'Correr no parque' });
    const targetDate = '2026-11-07';

    const checkInResult = service.checkIn(habit.id, targetDate, 'Treino de 5km');
    assert.equal(checkInResult.checkIn.date, targetDate);
    assert.equal(checkInResult.streaks.currentStreak, 1);

    // Tentativa duplicada
    assert.throws(() => {
      service.checkIn(habit.id, targetDate);
    }, /Check-in já registrado/);
  });

  it('deve permitir desfazer um check-in registrado (uncheck)', () => {
    const habit = service.createHabit({ title: 'Dormir 8 horas' });
    const targetDate = '2026-11-07';

    service.checkIn(habit.id, targetDate);
    const uncheckResult = service.undoCheckIn(habit.id, targetDate);

    assert.equal(uncheckResult, true);

    const active = service.listActiveHabits(undefined, targetDate);
    const found = active.find((h) => h.id === habit.id);
    assert.equal(found.completedToday, false);
    assert.equal(found.currentStreak, 0);
  });

  it('deve arquivar um hábito (soft delete) e ocultá-lo da listagem de hábitos ativos', () => {
    const habit = service.createHabit({ title: 'Tocar violão' });

    const activeBefore = service.listActiveHabits();
    assert.equal(activeBefore.length, 1);

    service.archiveHabit(habit.id);

    const activeAfter = service.listActiveHabits();
    assert.equal(activeAfter.length, 0);

    // Tentativa de check-in em hábito arquivado deve falhar
    assert.throws(() => {
      service.checkIn(habit.id, '2026-11-07');
    }, /Não é permitido registrar check-in em um hábito arquivado/);
  });

  it('deve filtrar hábitos ativos por categoria temática', () => {
    service.createHabit({ title: 'Ler artigo', category: 'Estudos' });
    service.createHabit({ title: 'Revisar notas', category: 'Estudos' });
    service.createHabit({ title: 'Caminhar 30min', category: 'Saúde' });

    const estudos = service.listActiveHabits('Estudos');
    const saude = service.listActiveHabits('Saúde');
    const financas = service.listActiveHabits('Finanças');

    assert.equal(estudos.length, 2);
    assert.equal(saude.length, 1);
    assert.equal(financas.length, 0);
  });
});
