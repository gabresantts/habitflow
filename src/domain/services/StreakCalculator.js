/**
 * @file StreakCalculator.js
 * @description Lógica de domínio pura para cálculo de sequências consecutivas (streaks) e consistência temporal.
 */

export class StreakCalculator {
  /**
   * Converte uma data (YYYY-MM-DD) para timestamp em milissegundos UTC (início do dia)
   * @param {string} dateStr
   * @returns {number}
   */
  static parseDateToUtc(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  }

  /**
   * Formata timestamp UTC em string YYYY-MM-DD
   * @param {number} timestamp
   * @returns {string}
   */
  static formatUtcToDateStr(timestamp) {
    const d = new Date(timestamp);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Retorna a data de hoje no formato YYYY-MM-DD (usando fuso local do sistema)
   * @param {Date} [referenceDate]
   * @returns {string}
   */
  static getTodayStr(referenceDate = new Date()) {
    const year = referenceDate.getFullYear();
    const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
    const day = String(referenceDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Remove datas duplicadas e ordena de forma ascendente cronologicamente
   * @param {string[]} dates
   * @returns {string[]}
   */
  static sortUniqueDates(dates) {
    const unique = Array.from(new Set(dates.filter(Boolean)));
    return unique.sort();
  }

  /**
   * Calcula o streak atual, o maior streak e o status do dia corrente
   * @param {string[]} checkInDates - Array de strings YYYY-MM-DD
   * @param {string} [referenceDateStr] - Data de referência (default: hoje)
   * @returns {{
   *   currentStreak: number,
   *   longestStreak: number,
   *   completedToday: boolean,
   *   lastCompletedDate: string|null
   * }}
   */
  static calculateStreaks(checkInDates, referenceDateStr) {
    const sorted = this.sortUniqueDates(checkInDates);
    const todayStr = referenceDateStr || this.getTodayStr();

    if (sorted.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false,
        lastCompletedDate: null
      };
    }

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const todayUtc = this.parseDateToUtc(todayStr);
    const yesterdayStr = this.formatUtcToDateStr(todayUtc - ONE_DAY_MS);

    const completedToday = sorted.includes(todayStr);
    const lastCompletedDate = sorted[sorted.length - 1];

    // 1. Cálculo do Longest Streak (maior sequência histórica)
    let longestStreak = 1;
    let runningStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
      const prevUtc = this.parseDateToUtc(sorted[i - 1]);
      const currUtc = this.parseDateToUtc(sorted[i]);

      const diffDays = Math.round((currUtc - prevUtc) / ONE_DAY_MS);

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }

      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    }

    // 2. Cálculo do Current Streak
    // Se o último check-in não for hoje e nem ontem, a sequência atual foi quebrada (é 0)
    let currentStreak = 0;

    if (completedToday || sorted.includes(yesterdayStr)) {
      currentStreak = 1;
      let targetDateUtc = this.parseDateToUtc(completedToday ? todayStr : yesterdayStr);

      // Anda para trás dia a dia para contar a sequência contínua
      const dateSet = new Set(sorted);
      while (true) {
        targetDateUtc -= ONE_DAY_MS;
        const previousDateStr = this.formatUtcToDateStr(targetDateUtc);
        if (dateSet.has(previousDateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Garantir que longestStreak seja no mínimo igual ao currentStreak
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return {
      currentStreak,
      longestStreak,
      completedToday,
      lastCompletedDate
    };
  }

  /**
   * Calcula a taxa de consistência (%) dentro de uma janela temporal (ex: 7 ou 30 dias)
   * @param {string[]} checkInDates
   * @param {number} daysWindow
   * @param {string} [referenceDateStr]
   * @returns {number} Percentual entre 0 e 100 com 1 casa decimal
   */
  static calculateConsistency(checkInDates, daysWindow = 7, referenceDateStr) {
    if (daysWindow <= 0) return 0;

    const todayStr = referenceDateStr || this.getTodayStr();
    const todayUtc = this.parseDateToUtc(todayStr);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const windowStartUtc = todayUtc - (daysWindow - 1) * ONE_DAY_MS;
    const windowStartStr = this.formatUtcToDateStr(windowStartUtc);

    const validDates = this.sortUniqueDates(checkInDates);
    const countInWindow = validDates.filter(
      (d) => d >= windowStartStr && d <= todayStr
    ).length;

    const percentage = (countInWindow / daysWindow) * 100;
    return Number(Math.min(100, Math.max(0, percentage)).toFixed(1));
  }
}
