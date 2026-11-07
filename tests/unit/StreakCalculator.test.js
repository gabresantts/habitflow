/**
 * @file StreakCalculator.test.js
 * @description Suíte de testes unitários para o calculador de sequências e consistência temporal (RNF04).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StreakCalculator } from '../../src/domain/services/StreakCalculator.js';

describe('StreakCalculator', () => {
  const refToday = '2026-11-07';
  const refYesterday = '2026-11-06';
  const refTwoDaysAgo = '2026-11-05';
  const refThreeDaysAgo = '2026-11-04';

  it('deve retornar zeros quando não houver check-ins', () => {
    const result = StreakCalculator.calculateStreaks([], refToday);

    assert.equal(result.currentStreak, 0);
    assert.equal(result.longestStreak, 0);
    assert.equal(result.completedToday, false);
    assert.equal(result.lastCompletedDate, null);
  });

  it('deve calcular streak de 1 quando o check-in for apenas hoje', () => {
    const result = StreakCalculator.calculateStreaks([refToday], refToday);

    assert.equal(result.currentStreak, 1);
    assert.equal(result.longestStreak, 1);
    assert.equal(result.completedToday, true);
    assert.equal(result.lastCompletedDate, refToday);
  });

  it('deve manter o streak ativo quando o último check-in foi ontem e hoje ainda está em aberto', () => {
    const dates = [refThreeDaysAgo, refTwoDaysAgo, refYesterday];
    const result = StreakCalculator.calculateStreaks(dates, refToday);

    assert.equal(result.currentStreak, 3);
    assert.equal(result.longestStreak, 3);
    assert.equal(result.completedToday, false);
    assert.equal(result.lastCompletedDate, refYesterday);
  });

  it('deve incrementar o streak para 4 quando registrar check-in hoje após sequência de 3 dias', () => {
    const dates = [refThreeDaysAgo, refTwoDaysAgo, refYesterday, refToday];
    const result = StreakCalculator.calculateStreaks(dates, refToday);

    assert.equal(result.currentStreak, 4);
    assert.equal(result.longestStreak, 4);
    assert.equal(result.completedToday, true);
  });

  it('deve zerar o currentStreak quando a sequência foi quebrada há 2 dias, mas preservar o longestStreak', () => {
    const dates = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', refTwoDaysAgo];
    const result = StreakCalculator.calculateStreaks(dates, refToday);

    assert.equal(result.currentStreak, 0);
    assert.equal(result.longestStreak, 4);
    assert.equal(result.completedToday, false);
  });

  it('deve deduplicar datas e ordenar cronologicamente de forma transparente', () => {
    const dates = [refToday, refYesterday, refToday, refYesterday];
    const result = StreakCalculator.calculateStreaks(dates, refToday);

    assert.equal(result.currentStreak, 2);
    assert.equal(result.longestStreak, 2);
  });

  it('deve calcular taxa de consistência percentual corretamente em janela de 7 dias', () => {
    // 3 dias concluídos na janela de 7 dias = (3 / 7) * 100 ≈ 42.9%
    const dates = [refThreeDaysAgo, refYesterday, refToday];
    const consistency = StreakCalculator.calculateConsistency(dates, 7, refToday);

    assert.equal(consistency, 42.9);
  });

  it('deve retornar 100% de consistência quando todos os dias da janela forem cumpridos', () => {
    const dates = [];
    const todayUtc = StreakCalculator.parseDateToUtc(refToday);
    const ONE_DAY = 24 * 60 * 60 * 1000;

    for (let i = 0; i < 7; i++) {
      dates.push(StreakCalculator.formatUtcToDateStr(todayUtc - i * ONE_DAY));
    }

    const consistency = StreakCalculator.calculateConsistency(dates, 7, refToday);
    assert.equal(consistency, 100.0);
  });
});
