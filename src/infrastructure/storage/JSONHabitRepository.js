/**
 * @file JSONHabitRepository.js
 * @description Repositório durável em arquivo JSON com suporte à gravação atômica para integridade de dados (RNF02).
 */

import fs from 'node:fs';
import path from 'node:path';
import { Habit } from '../../domain/entities/Habit.js';
import { CheckIn } from '../../domain/entities/CheckIn.js';

export class JSONHabitRepository {
  /**
   * @param {string} [filePath] - Caminho do arquivo JSON de persistência
   */
  constructor(filePath) {
    this.filePath = filePath || path.resolve(process.cwd(), 'habitflow-data.json');
    this.ensureInitialized();
  }

  /**
   * Garante que o arquivo e diretório existam com o schema inicial
   */
  ensureInitialized() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      const initialSchema = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        habits: [],
        checkIns: []
      };
      this.atomicWrite(initialSchema);
    }
  }

  /**
   * Grava dados atomicamente usando arquivo temporário + renomeação síncrona
   * Previne corrupção de dados caso o processo seja interrompido durante a escrita (RNF02)
   * @param {Object} data
   */
  atomicWrite(data) {
    const tempFile = `${this.filePath}.tmp.${Date.now()}`;
    const serialized = JSON.stringify(data, null, 2);

    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, this.filePath);
  }

  /**
   * Carrega os dados brutos do arquivo JSON
   * @returns {{ version: string, habits: Object[], checkIns: Object[] }}
   */
  readRaw() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { version: '1.0.0', habits: [], checkIns: [] };
    }
  }

  /**
   * Retorna todas as entidades Habit
   * @returns {Habit[]}
   */
  findAllHabits() {
    const raw = this.readRaw();
    return (raw.habits || []).map((h) => new Habit(h));
  }

  /**
   * Busca um hábito por ID
   * @param {string} id
   * @returns {Habit|null}
   */
  findHabitById(id) {
    const habits = this.findAllHabits();
    return habits.find((h) => h.id === id) || null;
  }

  /**
   * Salva ou atualiza um hábito
   * @param {Habit} habit
   */
  saveHabit(habit) {
    const raw = this.readRaw();
    const index = raw.habits.findIndex((h) => h.id === habit.id);

    if (index >= 0) {
      raw.habits[index] = habit.toJSON();
    } else {
      raw.habits.push(habit.toJSON());
    }

    this.atomicWrite(raw);
  }

  /**
   * Retorna todos os check-ins cadastrados
   * @returns {CheckIn[]}
   */
  findAllCheckIns() {
    const raw = this.readRaw();
    return (raw.checkIns || []).map((c) => new CheckIn(c));
  }

  /**
   * Retorna todos os check-ins associados a um hábito específico
   * @param {string} habitId
   * @returns {CheckIn[]}
   */
  findCheckInsByHabitId(habitId) {
    const all = this.findAllCheckIns();
    return all.filter((c) => c.habitId === habitId);
  }

  /**
   * Salva um novo check-in
   * @param {CheckIn} checkIn
   */
  saveCheckIn(checkIn) {
    const raw = this.readRaw();
    const exists = raw.checkIns.some(
      (c) => c.habitId === checkIn.habitId && c.date === checkIn.date
    );

    if (exists) {
      throw new Error(`Conflito: Check-in já registrado para o hábito nesta data (${checkIn.date}).`);
    }

    raw.checkIns.push(checkIn.toJSON());
    this.atomicWrite(raw);
  }

  /**
   * Remove o check-in de um hábito em determinada data (uncheck)
   * @param {string} habitId
   * @param {string} date
   * @returns {boolean} Retorna true se removeu, false se não existia
   */
  removeCheckIn(habitId, date) {
    const raw = this.readRaw();
    const initialLen = raw.checkIns.length;
    raw.checkIns = raw.checkIns.filter(
      (c) => !(c.habitId === habitId && c.date === date)
    );

    if (raw.checkIns.length !== initialLen) {
      this.atomicWrite(raw);
      return true;
    }
    return false;
  }

  /**
   * Limpa todos os dados (útil para testes isolados)
   */
  clear() {
    this.atomicWrite({
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      habits: [],
      checkIns: []
    });
  }
}
