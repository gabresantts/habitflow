/**
 * @file cli.js
 * @description Interface de Linha de Comando (CLI) interativa e formatada para o HabitFlow.
 */

import { JSONHabitRepository } from '../infrastructure/storage/JSONHabitRepository.js';
import { HabitService } from '../application/services/HabitService.js';
import { MetricsService } from '../application/services/MetricsService.js';
import { StreakCalculator } from '../domain/services/StreakCalculator.js';

export class CLI {
  constructor(dbPath) {
    this.repository = new JSONHabitRepository(dbPath);
    this.habitService = new HabitService({ repository: this.repository });
    this.metricsService = new MetricsService({ repository: this.repository });
  }

  printHeader() {
    console.log(`\n======================================================`);
    console.log(`  🌊 HabitFlow - Gerenciador Inteligente de Hábitos`);
    console.log(`  SDLC & Engenharia de Software no GitHub | SemVer v0.1.0`);
    console.log(`======================================================\n`);
  }

  printHelp() {
    console.log(`Comandos Disponíveis:\n`);
    console.log(`  npm run cli -- add "<título>" [categoria] [dias/semana]`);
    console.log(`      Exemplo: npm run cli -- add "Ler 20 páginas" Estudos 7\n`);
    console.log(`  npm run cli -- list [categoria]`);
    console.log(`      Exemplo: npm run cli -- list`);
    console.log(`      Exemplo: npm run cli -- list Saúde\n`);
    console.log(`  npm run cli -- check <id-do-hábito> [data: AAAA-MM-DD]`);
    console.log(`      Exemplo: npm run cli -- check h-12345\n`);
    console.log(`  npm run cli -- uncheck <id-do-hábito> [data: AAAA-MM-DD]`);
    console.log(`      Exemplo: npm run cli -- uncheck h-12345\n`);
    console.log(`  npm run cli -- archive <id-do-hábito>`);
    console.log(`      Exemplo: npm run cli -- archive h-12345\n`);
    console.log(`  npm run cli -- stats`);
    console.log(`      Exibe o relatório executivo e métricas de consistência.\n`);
    console.log(`  npm run cli -- demo`);
    console.log(`      Popula a base com hábitos de exemplo e 7 dias de histórico.\n`);
    console.log(`  npm run cli -- export`);
    console.log(`      Exporta a base de dados em JSON formatado no console.\n`);
  }

  handleAdd(args) {
    const title = args[0];
    const category = args[1] || 'Geral';
    const targetDays = args[2] ? Number(args[2]) : 7;

    if (!title) {
      console.error(`❌ Erro: Informe o título do hábito. Exemplo: npm run cli -- add "Exercício Físico" Saúde 5`);
      return;
    }

    try {
      const habit = this.habitService.createHabit({
        title,
        category,
        targetDaysPerWeek: targetDays
      });
      console.log(`✅ Hábito cadastrado com sucesso!`);
      console.log(`   ID:         ${habit.id}`);
      console.log(`   Título:     ${habit.title}`);
      console.log(`   Categoria:  ${habit.category}`);
      console.log(`   Meta:       ${habit.targetDaysPerWeek} dias/semana`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  }

  handleList(args) {
    const category = args[0];
    const habits = this.habitService.listActiveHabits(category);

    if (habits.length === 0) {
      console.log(`ℹ️  Nenhum hábito ativo encontrado${category ? ` na categoria "${category}"` : ''}.`);
      console.log(`   Use o comando 'add' para criar seu primeiro hábito ou 'demo' para popular dados de teste.`);
      return;
    }

    console.log(`📋 Hábitos Ativos${category ? ` [Categoria: ${category}]` : ''} (${habits.length} no total):\n`);
    console.log(
      ` ${'ID'.padEnd(20)} | ${'Hoje'.padEnd(10)} | ${'Streak'.padEnd(8)} | ${'Recorde'.padEnd(8)} | ${'Consist. 7d'.padEnd(12)} | ${'Título (Categoria)'}`
    );
    console.log(`-`.repeat(95));

    for (const h of habits) {
      const todayStatus = h.completedToday ? '✅ Concluído' : '⏳ Pendente ';
      const streakStr = `🔥 ${h.currentStreak}d`.padEnd(8);
      const longestStr = `🏆 ${h.longestStreak}d`.padEnd(8);
      const consistencyStr = `${h.consistency7d}%`.padEnd(12);

      console.log(
        ` ${h.id.padEnd(20)} | ${todayStatus} | ${streakStr} | ${longestStr} | ${consistencyStr} | ${h.title} [${h.category}]`
      );
    }
    console.log(`\n💡 Dica: Registre o progresso de hoje com: npm run cli -- check <ID>`);
  }

  handleCheck(args) {
    const habitId = args[0];
    const dateStr = args[1];

    if (!habitId) {
      console.error(`❌ Erro: Informe o ID do hábito. Exemplo: npm run cli -- check h-12345`);
      return;
    }

    try {
      const result = this.habitService.checkIn(habitId, dateStr);
      console.log(`🎉 Check-in registrado com sucesso!`);
      console.log(`   Data:           ${result.checkIn.date}`);
      console.log(`   Streak Atual:   🔥 ${result.streaks.currentStreak} dias consecutivos`);
      console.log(`   Maior Recorde:  🏆 ${result.streaks.longestStreak} dias`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  }

  handleUncheck(args) {
    const habitId = args[0];
    const dateStr = args[1];

    if (!habitId) {
      console.error(`❌ Erro: Informe o ID do hábito. Exemplo: npm run cli -- uncheck h-12345`);
      return;
    }

    try {
      this.habitService.undoCheckIn(habitId, dateStr);
      console.log(`↩️  Check-in desfeito com sucesso para o hábito [${habitId}] na data selecionada.`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  }

  handleArchive(args) {
    const habitId = args[0];
    if (!habitId) {
      console.error(`❌ Erro: Informe o ID do hábito a ser arquivado.`);
      return;
    }

    try {
      const habit = this.habitService.archiveHabit(habitId);
      console.log(`📦 Hábito "${habit.title}" arquivado com sucesso (soft delete).`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  }

  handleStats() {
    const report = this.metricsService.generateExecutiveReport();
    console.log(`📊 Relatório Executivo de Produtividade & Métricas\n`);
    console.log(`  • Total de Hábitos Cadastrados:  ${report.summary.totalHabits}`);
    console.log(`  • Hábitos Ativos:                 ${report.summary.activeHabits}`);
    console.log(`  • Hábitos Arquivados:             ${report.summary.archivedHabits}`);
    console.log(`  • Total de Check-ins Registrados: ${report.summary.totalCheckInsRecorded}`);
    console.log(`  • Check-ins Concluídos Hoje:      ${report.summary.checkInsToday}`);
    console.log(`  • Taxa de Conclusão de Hoje:      ${report.summary.todayCompletionRate}`);
    console.log(`  • Maior Streak Geral:             ${report.summary.highestStreakOverall}\n`);

    console.log(`📁 Distribuição por Categoria:`);
    for (const [cat, data] of Object.entries(report.categoriesBreakdown)) {
      console.log(`   - ${cat.padEnd(16)}: ${data.count} hábito(s) | ${data.checkIns} check-in(s)`);
    }
  }

  handleDemo() {
    console.log(`🚀 Populando base de demonstração do HabitFlow...\n`);

    this.repository.clear();

    const h1 = this.habitService.createHabit({
      title: 'Beber 2.5L de água',
      category: 'Saúde',
      targetDaysPerWeek: 7
    });

    const h2 = this.habitService.createHabit({
      title: 'Estudo de Engenharia de Software (SDLC)',
      category: 'Estudos',
      targetDaysPerWeek: 5
    });

    const h3 = this.habitService.createHabit({
      title: 'Prática de Exercício Físico (Musculação/Caminhada)',
      category: 'Saúde',
      targetDaysPerWeek: 5
    });

    const h4 = this.habitService.createHabit({
      title: 'Leitura de 15 páginas de Livro Técnico',
      category: 'Desenvolvimento Pessoal',
      targetDaysPerWeek: 7
    });

    // Simula histórico de check-ins nos últimos 6 dias e hoje
    const todayUtc = StreakCalculator.parseDateToUtc(StreakCalculator.getTodayStr());
    const ONE_DAY = 24 * 60 * 60 * 1000;

    for (let i = 6; i >= 0; i--) {
      const dStr = StreakCalculator.formatUtcToDateStr(todayUtc - i * ONE_DAY);

      // Hábito 1: sequência perfeita de 7 dias
      this.habitService.checkIn(h1.id, dStr, 'Hidratação completa');

      // Hábito 2: sequência de 5 dias
      if (i <= 4) {
        this.habitService.checkIn(h2.id, dStr, 'Requisitos e Git Flow');
      }

      // Hábito 3: concluiu nos dias passados, hoje pendente
      if (i >= 1 && i <= 3) {
        this.habitService.checkIn(h3.id, dStr, 'Treino funcional');
      }

      // Hábito 4: hoje concluído
      if (i === 0) {
        this.habitService.checkIn(h4.id, dStr, 'Clean Code capítulo 3');
      }
    }

    console.log(`✅ Base populada com sucesso com 4 hábitos e histórico simulado!`);
    this.handleList([]);
  }

  handleExport() {
    const raw = this.repository.readRaw();
    console.log(JSON.stringify(raw, null, 2));
  }

  run(args) {
    this.printHeader();
    const command = args[0] || 'list';
    const commandArgs = args.slice(1);

    switch (command.toLowerCase()) {
      case 'add':
        this.handleAdd(commandArgs);
        break;
      case 'list':
      case 'ls':
        this.handleList(commandArgs);
        break;
      case 'check':
      case 'done':
        this.handleCheck(commandArgs);
        break;
      case 'uncheck':
      case 'undo':
        this.handleUncheck(commandArgs);
        break;
      case 'archive':
        this.handleArchive(commandArgs);
        break;
      case 'stats':
        this.handleStats();
        break;
      case 'demo':
        this.handleDemo();
        break;
      case 'export':
        this.handleExport();
        break;
      case 'help':
      case '--help':
      case '-h':
      default:
        this.printHelp();
        break;
    }
  }
}
