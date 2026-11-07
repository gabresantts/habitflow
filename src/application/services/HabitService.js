/**
 * @file HabitService.js
 * @description Serviço de aplicação orquestrando os casos de uso de gestão de hábitos e check-ins.
 */

import { Habit } from '../../domain/entities/Habit.js';
import { CheckIn } from '../../domain/entities/CheckIn.js';
import { StreakCalculator } from '../../domain/services/StreakCalculator.js';

export class HabitService {
  /**
   * @param {Object} dependencies
   * @param {import('../../infrastructure/storage/JSONHabitRepository.js').JSONHabitRepository} dependencies.repository
   */
  constructor({ repository }) {
    this.repository = repository;
  }

  /**
   * Cria um novo hábito
   * @param {Object} input
   * @param {string} input.title
   * @param {string} [input.description]
   * @param {string} [input.category]
   * @param {number} [input.targetDaysPerWeek]
   * @returns {Habit}
   */
  createHabit({ title, description, category, targetDaysPerWeek }) {
    const habit = new Habit({
      title,
      description,
      category,
      targetDaysPerWeek
    });

    this.repository.saveHabit(habit);
    return habit;
  }

  /**
   * Lista todos os hábitos ativos enriquecidos com estatísticas de streak
   * @param {string} [categoryFilter]
   * @param {string} [referenceDateStr]
   * @returns {Array<Object>}
   */
  listActiveHabits(categoryFilter, referenceDateStr) {
    const habits = this.repository.findAllHabits().filter((h) => !h.isArchived);

    const filtered = categoryFilter
      ? habits.filter(
          (h) => h.category.toLowerCase() === categoryFilter.trim().toLowerCase()
        )
      : habits;

    return filtered.map((habit) => {
      const checkIns = this.repository.findCheckInsByHabitId(habit.id);
      const dates = checkIns.map((c) => c.date);
      const streaks = StreakCalculator.calculateStreaks(dates, referenceDateStr);
      const consistency7d = StreakCalculator.calculateConsistency(dates, 7, referenceDateStr);

      return {
        ...habit.toJSON(),
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        completedToday: streaks.completedToday,
        lastCompletedDate: streaks.lastCompletedDate,
        consistency7d,
        totalCheckIns: checkIns.length
      };
    });
  }

  /**
   * Atualiza informações cadastrais de um hábito
   * @param {string} habitId
   * @param {Object} updates
   * @returns {Habit}
   */
  updateHabit(habitId, updates) {
    const habit = this.repository.findHabitById(habitId);
    if (!habit) {
      throw new Error(`Erro: Hábito com ID "${habitId}" não foi encontrado.`);
    }

    habit.update(updates);
    this.repository.saveHabit(habit);
    return habit;
  }

  /**
   * Arquiva um hábito (soft delete)
   * @param {string} habitId
   * @returns {Habit}
   */
  archiveHabit(habitId) {
    const habit = this.repository.findHabitById(habitId);
    if (!habit) {
      throw new Error(`Erro: Hábito com ID "${habitId}" não foi encontrado.`);
    }

    if (habit.isArchived) {
      throw new Error(`Aviso: O hábito "${habit.title}" já se encontra arquivado.`);
    }

    habit.archive();
    this.repository.saveHabit(habit);
    return habit;
  }

  /**
   * Registra a conclusão diária de um hábito
   * @param {string} habitId
   * @param {string} [dateStr] - Formato YYYY-MM-DD (default: hoje)
   * @param {string} [notes]
   * @returns {{ checkIn: CheckIn, streaks: Object }}
   */
  checkIn(habitId, dateStr, notes = '') {
    const habit = this.repository.findHabitById(habitId);
    if (!habit) {
      throw new Error(`Erro: Hábito com ID "${habitId}" não foi encontrado.`);
    }

    if (habit.isArchived) {
      throw new Error(`Erro: Não é permitido registrar check-in em um hábito arquivado.`);
    }

    const targetDate = dateStr || StreakCalculator.getTodayStr();
    const checkIn = new CheckIn({
      habitId,
      date: targetDate,
      notes
    });

    this.repository.saveCheckIn(checkIn);

    const allCheckIns = this.repository.findCheckInsByHabitId(habitId);
    const dates = allCheckIns.map((c) => c.date);
    const streaks = StreakCalculator.calculateStreaks(dates, targetDate);

    return {
      checkIn,
      streaks
    };
  }

  /**
   * Desfaz a conclusão diária de um hábito para uma data (default: hoje)
   * @param {string} habitId
   * @param {string} [dateStr]
   * @returns {boolean}
   */
  undoCheckIn(habitId, dateStr) {
    const habit = this.repository.findHabitById(habitId);
    if (!habit) {
      throw new Error(`Erro: Hábito com ID "${habitId}" não foi encontrado.`);
    }

    const targetDate = dateStr || StreakCalculator.getTodayStr();
    const removed = this.repository.removeCheckIn(habitId, targetDate);

    if (!removed) {
      throw new Error(`Aviso: Não há check-in registrado para "${habit.title}" na data ${targetDate}.`);
    }

    return true;
  }

  /**
   * Retorna os detalhes e métricas de um hábito específico
   * @param {string} habitId
   * @returns {Object}
   */
  getHabitDetails(habitId) {
    const habit = this.repository.findHabitById(habitId);
    if (!habit) {
      throw new Error(`Erro: Hábito com ID "${habitId}" não foi encontrado.`);
    }

    const checkIns = this.repository.findCheckInsByHabitId(habitId);
    const dates = checkIns.map((c) => c.date);
    const streaks = StreakCalculator.calculateStreaks(dates);
    const consistency7d = StreakCalculator.calculateConsistency(dates, 7);
    const consistency30d = StreakCalculator.calculateConsistency(dates, 30);

    return {
      ...habit.toJSON(),
      streaks,
      consistency7d,
      consistency30d,
      checkIns: checkIns.map((c) => c.toJSON())
    };
  }
}
