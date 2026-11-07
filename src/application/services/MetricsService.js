/**
 * @file MetricsService.js
 * @description Serviço analítico para consolidação de métricas globais, relatórios e taxas de adesão (RF09).
 */

import { StreakCalculator } from '../../domain/services/StreakCalculator.js';

export class MetricsService {
  /**
   * @param {Object} dependencies
   * @param {import('../../infrastructure/storage/JSONHabitRepository.js').JSONHabitRepository} dependencies.repository
   */
  constructor({ repository }) {
    this.repository = repository;
  }

  /**
   * Gera relatório executivo consolidado com métricas globais
   * @returns {Object}
   */
  generateExecutiveReport() {
    const allHabits = this.repository.findAllHabits();
    const activeHabits = allHabits.filter((h) => !h.isArchived);
    const archivedHabits = allHabits.filter((h) => h.isArchived);
    const allCheckIns = this.repository.findAllCheckIns();

    const todayStr = StreakCalculator.getTodayStr();

    let checkInsToday = 0;
    let highestStreakOverall = 0;
    let topHabitName = 'Nenhum';

    const categoriesMap = {};

    for (const habit of activeHabits) {
      const checkIns = this.repository.findCheckInsByHabitId(habit.id);
      const dates = checkIns.map((c) => c.date);
      const streaks = StreakCalculator.calculateStreaks(dates, todayStr);

      if (streaks.completedToday) {
        checkInsToday++;
      }

      if (streaks.longestStreak > highestStreakOverall) {
        highestStreakOverall = streaks.longestStreak;
        topHabitName = habit.title;
      }

      // Agrupamento por categoria
      if (!categoriesMap[habit.category]) {
        categoriesMap[habit.category] = { count: 0, checkIns: 0 };
      }
      categoriesMap[habit.category].count++;
      categoriesMap[habit.category].checkIns += checkIns.length;
    }

    const todayCompletionRate =
      activeHabits.length > 0
        ? Number(((checkInsToday / activeHabits.length) * 100).toFixed(1))
        : 0;

    return {
      summary: {
        totalHabits: allHabits.length,
        activeHabits: activeHabits.length,
        archivedHabits: archivedHabits.length,
        totalCheckInsRecorded: allCheckIns.length,
        checkInsToday,
        todayCompletionRate: `${todayCompletionRate}%`,
        highestStreakOverall: `${highestStreakOverall} dias (${topHabitName})`
      },
      categoriesBreakdown: categoriesMap
    };
  }
}
