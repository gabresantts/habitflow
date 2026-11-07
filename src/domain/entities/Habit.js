/**
 * @file Habit.js
 * @description Entidade de domínio Habit representando um hábito a ser cultivado.
 */

export class Habit {
  /**
   * @param {Object} params
   * @param {string} [params.id]
   * @param {string} params.title
   * @param {string} [params.description]
   * @param {string} [params.category]
   * @param {number} [params.targetDaysPerWeek]
   * @param {boolean} [params.isArchived]
   * @param {string} [params.createdAt]
   * @param {string} [params.updatedAt]
   */
  constructor({
    id,
    title,
    description = '',
    category = 'Outros',
    targetDaysPerWeek = 7,
    isArchived = false,
    createdAt,
    updatedAt
  }) {
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      throw new Error('Validação de Domínio: O título do hábito deve ter no mínimo 3 caracteres.');
    }

    if (targetDaysPerWeek < 1 || targetDaysPerWeek > 7) {
      throw new Error('Validação de Domínio: A meta de dias por semana deve estar entre 1 e 7.');
    }

    const now = new Date().toISOString();

    this.id = id || `h-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.title = title.trim();
    this.description = (description || '').trim();
    this.category = (category || 'Outros').trim();
    this.targetDaysPerWeek = Number(targetDaysPerWeek);
    this.isArchived = Boolean(isArchived);
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }

  /**
   * Arquiva o hábito (soft delete)
   */
  archive() {
    this.isArchived = true;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Desarquiva / reativa o hábito
   */
  unarchive() {
    this.isArchived = false;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Atualiza informações cadastrais
   * @param {Object} updates
   */
  update({ title, description, category, targetDaysPerWeek }) {
    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length < 3) {
        throw new Error('Validação de Domínio: O título do hábito deve ter no mínimo 3 caracteres.');
      }
      this.title = title.trim();
    }

    if (description !== undefined) {
      this.description = description.trim();
    }

    if (category !== undefined) {
      this.category = category.trim() || 'Outros';
    }

    if (targetDaysPerWeek !== undefined) {
      const parsedDays = Number(targetDaysPerWeek);
      if (parsedDays < 1 || parsedDays > 7) {
        throw new Error('Validação de Domínio: A meta de dias por semana deve estar entre 1 e 7.');
      }
      this.targetDaysPerWeek = parsedDays;
    }

    this.updatedAt = new Date().toISOString();
  }

  /**
   * Retorna representação em objeto simples serializável
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      targetDaysPerWeek: this.targetDaysPerWeek,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
