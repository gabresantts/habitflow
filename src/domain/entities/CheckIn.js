/**
 * @file CheckIn.js
 * @description Entidade de domínio CheckIn representando a conclusão diária de um hábito.
 */

export class CheckIn {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.habitId
   * @param {string} params.date - Formato ISO de data YYYY-MM-DD
   * @param {string} [params.completedAt]
   * @param {string} [params.notes]
   */
  constructor({ id, habitId, date, completedAt, notes = '' }) {
    if (!habitId || typeof habitId !== 'string') {
      throw new Error('Validação de Domínio: habitId é obrigatório para registrar um check-in.');
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Validação de Domínio: A data do check-in deve seguir o formato YYYY-MM-DD.');
    }

    this.id = id || `c-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.habitId = habitId;
    this.date = date;
    this.completedAt = completedAt || new Date().toISOString();
    this.notes = (notes || '').trim();
  }

  toJSON() {
    return {
      id: this.id,
      habitId: this.habitId,
      date: this.date,
      completedAt: this.completedAt,
      notes: this.notes
    };
  }
}
