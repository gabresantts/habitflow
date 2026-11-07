#!/usr/bin/env bash
# Script de automação para criação das 15 Issues no GitHub via GitHub CLI (gh)

set -e

echo "Verificando autenticação no GitHub CLI (gh)..."
gh auth status

echo "Criando labels padronizadas..."
gh label create "documentation" --description "Melhorias ou inclusões na documentação" --color "0075ca" --force || true
gh label create "feature" --description "Nova funcionalidade do sistema" --color "a2eeef" --force || true
gh label create "test" --description "Inclusão ou refatoração de testes automatizados" --color "d73a4a" --force || true
gh label create "chore" --description "Tarefas de build, configuração ou infraestrutura" --color "cfd3d7" --force || true
gh label create "domain" --description "Entidades e regras de negócio puras" --color "5319e7" --force || true
gh label create "application" --description "Casos de uso e serviços orquestradores" --color "1d76db" --force || true
gh label create "release" --description "Marcos de lançamento e versionamento" --color "0e8a16" --force || true

echo "Cadastrando as 15 issues no repositório..."

gh issue create --title "[DOC] Elaborar Project Charter e Termo de Abertura do Projeto" \
  --body "### Descricao
Elaborar o Termo de Abertura do Projeto com justificativa, objetivos SMART, escopo in/out e stakeholders.

### Criterios de Aceite
- [x] Artefato em docs/project-charter.md.
- [x] Objetivos SMART quantificados." \
  --label "documentation"

gh issue create --title "[DOC] Especificar Requisitos Funcionais (RF) e Nao Funcionais (RNF)" \
  --body "### Descricao
Especificar formalmente a lista rastreavel de requisitos [RF01-RF10] e [RNF01-RNF08], alem da Matriz de Rastreabilidade.

### Criterios de Aceite
- [x] Todos os 10 RFs e 8 RNFs mapeados em docs/requisitos.md." \
  --label "documentation"

gh issue create --title "[DOC] Modelar Casos de Uso com Fluxos Principais e de Excecao" \
  --body "### Descricao
Modelar casos de uso detalhando atores, fluxos principais, alternativos e de excecao com diagrama Mermaid.

### Criterios de Aceite
- [x] Diagrama Mermaid de casos de uso e especificacoes em docs/casos-de-uso.md." \
  --label "documentation"

gh issue create --title "[DOC] Detalhar Historias de Usuario com Criterios de Aceite BDD/Gherkin" \
  --body "### Descricao
Redigir as historias de usuario no padrao canonico com cenarios de aceite em BDD (Gherkin Dado/Quando/Entao).

### Criterios de Aceite
- [x] Documento docs/user-stories.md com pelo menos 8 US e criterios Gherkin." \
  --label "documentation"

gh issue create --title "[DOC] Criar Diagramas Complementares de Engenharia (C4, DER, Classes)" \
  --body "### Descricao
Elaborar diagramas arquiteturais complementares: C4 Model (Contexto e Conteiner), DER, Diagrama de Classes e Maquina de Estados.

### Criterios de Aceite
- [x] Arquivo docs/arquitetura.md com diagramas Mermaid validos." \
  --label "documentation"

gh issue create --title "[CHORE] Configurar Estrutura de Pastas do Repositorio, .gitignore e Package.json" \
  --body "### Descricao
Configurar layout de pastas docs/, src/, tests/, scripts/, alem de .gitignore rigoroso e package.json modular.

### Criterios de Aceite
- [x] Projeto estruturado e executavel out-of-the-box." \
  --label "chore"

gh issue create --title "[FEAT] Implementar Entidades de Dominio Habit e CheckIn com Validacoes" \
  --body "### Descricao
Construir entidades puras de dominio com validacoes de atributos e mutacoes controladas.

### Criterios de Aceite
- [x] Habit com validacao de titulo e frequencia semanal.
- [x] CheckIn com validacao de formato de data ISO." \
  --label "feature,domain"

gh issue create --title "[FEAT] Implementar Repositorio com Persistencia Atomica Duravel em JSON" \
  --body "### Descricao
Criar JSONHabitRepository com escrita atomica (RNF02) para evitar corrupcao de arquivos em falhas de processo.

### Criterios de Aceite
- [x] Atomic write via arquivo temporario + rename sincrono." \
  --label "feature"

gh issue create --title "[FEAT] Implementar Algoritmo de Calculo de Streaks e Consistencia Temporal" \
  --body "### Descricao
Implementar StreakCalculator puro para processar sequencias ininterruptas (current streak, longest streak) e consistencia temporal.

### Criterios de Aceite
- [x] Calculo exato de dias contiguos e tolerancia ao dia corrente em aberto." \
  --label "feature,domain"

gh issue create --title "[TEST] Desenvolver Suite de Testes Unitarios para StreakCalculator e HabitService" \
  --body "### Descricao
Construir bateria automatizada de testes com node:test nativo cobrindo calculo de streaks e regras de servico.

### Criterios de Aceite
- [x] 100% dos testes passando via 'npm test' sem dependencias externas." \
  --label "test"

gh issue create --title "[FEAT] Implementar Servicos de Aplicacao (HabitService - CRUD e Filtros)" \
  --body "### Descricao
Desenvolver HabitService coordenando persistencia, regras de dominio, arquivamento (soft delete) e filtros.

### Criterios de Aceite
- [x] Metodos createHabit, listActiveHabits, updateHabit e archiveHabit." \
  --label "feature,application"

gh issue create --title "[FEAT] Implementar Registro de Check-in Diario e Operacao de Desfazer Check-in" \
  --body "### Descricao
Implementar metodos de conclusao diaria (check-in) e cancelamento (uncheck) com deteccao de duplicidade.

### Criterios de Aceite
- [x] Bloqueio de check-in duplicado na mesma data.
- [x] Desfazer check-in com recalculacao imediata de streaks." \
  --label "feature,application"

gh issue create --title "[FEAT] Desenvolver Interface de Linha de Comando (CLI) e Demonstracao" \
  --body "### Descricao
Construir interface CLI interativa com comandos add, list, check, uncheck, stats e modo demo.

### Criterios de Aceite
- [x] CLI amigavel formatada com tabelas e suporte ao comando demo." \
  --label "feature"

gh issue create --title "[FEAT] Desenvolver Geracao de Relatorios Estatisticos e Metricas Semanais" \
  --body "### Descricao
Construir MetricsService para consolidar taxas de adesao semanal, consolidado de check-ins e recordes gerais.

### Criterios de Aceite
- [x] Relatorio executivo sintetico gerado com 'npm run cli -- stats'." \
  --label "feature"

gh issue create --title "[RELEASE] Consolidar README.md, Versionamento SemVer v0.1.0 e Documentacao Final" \
  --body "### Descricao
Finalizar README.md completo com badges, guia de instalacao, sumario de features e tag SemVer v0.1.0.

### Criterios de Aceite
- [x] README.md sincronizado e tag v0.1.0 criada." \
  --label "documentation,release"

echo "Todas as 15 issues foram criadas com sucesso no GitHub!"
