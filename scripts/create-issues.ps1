<#
.SYNOPSIS
  Script de automação para criação das 15 Issues no GitHub via GitHub CLI (gh).
.DESCRIPTION
  Cadastra todas as 15 issues especificadas na atividade com títulos padronizados,
  labels correspondentes e descrições com critérios de aceite BDD.
#>

Write-Host "Verificando autenticação no GitHub CLI (gh)..." -ForegroundColor Cyan
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Por favor, realize login no GitHub CLI primeiro executando: gh auth login" -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando criação de labels necessárias..." -ForegroundColor Cyan
gh label create "documentation" --description "Melhorias ou inclusões na documentação" --color "0075ca" --force
gh label create "feature" --description "Nova funcionalidade do sistema" --color "a2eeef" --force
gh label create "test" --description "Inclusão ou refatoração de testes automatizados" --color "d73a4a" --force
gh label create "chore" --description "Tarefas de build, configuração ou infraestrutura" --color "cfd3d7" --force
gh label create "domain" --description "Entidades e regras de negócio puras" --color "5319e7" --force
gh label create "application" --description "Casos de uso e serviços orquestradores" --color "1d76db" --force
gh label create "release" --description "Marcos de lançamento e versionamento" --color "0e8a16" --force

Write-Host "`nCadastrando as 15 Issues no repositório..." -ForegroundColor Green

# 1
gh issue create --title "[DOC] Elaborar Project Charter e Termo de Abertura do Projeto" `
  --body "### Descricao`nElaborar o Termo de Abertura do Projeto com justificativa, objetivos SMART, escopo in/out e stakeholders.`n`n### Criterios de Aceite`n- [x] Artefato em docs/project-charter.md.`n- [x] Objetivos SMART quantificados." `
  --label "documentation"

# 2
gh issue create --title "[DOC] Especificar Requisitos Funcionais (RF) e Nao Funcionais (RNF)" `
  --body "### Descricao`nEspecificar formalmente a lista rastreavel de requisitos [RF01-RF10] e [RNF01-RNF08], alem da Matriz de Rastreabilidade.`n`n### Criterios de Aceite`n- [x] Todos os 10 RFs e 8 RNFs mapeados em docs/requisitos.md." `
  --label "documentation"

# 3
gh issue create --title "[DOC] Modelar Casos de Uso com Fluxos Principais e de Excecao" `
  --body "### Descricao`nModelar casos de uso detalhando atores, fluxos principais, alternativos e de excecao com diagrama Mermaid.`n`n### Criterios de Aceite`n- [x] Diagrama Mermaid de casos de uso e especificacoes em docs/casos-de-uso.md." `
  --label "documentation"

# 4
gh issue create --title "[DOC] Detalhar Historias de Usuario com Criterios de Aceite BDD/Gherkin" `
  --body "### Descricao`nRedigir as historias de usuario no padrao canonico com cenarios de aceite em BDD (Gherkin Dado/Quando/Entao).`n`n### Criterios de Aceite`n- [x] Documento docs/user-stories.md com pelo menos 8 US e criterios Gherkin." `
  --label "documentation"

# 5
gh issue create --title "[DOC] Criar Diagramas Complementares de Engenharia (C4, DER, Classes)" `
  --body "### Descricao`nElaborar diagramas arquiteturais complementares: C4 Model (Contexto e Conteiner), DER, Diagrama de Classes e Maquina de Estados.`n`n### Criterios de Aceite`n- [x] Arquivo docs/arquitetura.md com diagramas Mermaid validos." `
  --label "documentation"

# 6
gh issue create --title "[CHORE] Configurar Estrutura de Pastas do Repositorio, .gitignore e Package.json" `
  --body "### Descricao`nConfigurar layout de pastas docs/, src/, tests/, scripts/, alem de .gitignore rigoroso e package.json modular.`n`n### Criterios de Aceite`n- [x] Projeto estruturado e executavel out-of-the-box." `
  --label "chore"

# 7
gh issue create --title "[FEAT] Implementar Entidades de Dominio Habit e CheckIn com Validacoes" `
  --body "### Descricao`nConstruir entidades puras de dominio com validacoes de atributos e mutacoes controladas.`n`n### Criterios de Aceite`n- [x] Habit com validacao de titulo e frequencia semanal.`n- [x] CheckIn com validacao de formato de data ISO." `
  --label "feature,domain"

# 8
gh issue create --title "[FEAT] Implementar Repositorio com Persistencia Atomica Duravel em JSON" `
  --body "### Descricao`nCriar JSONHabitRepository com escrita atomica (RNF02) para evitar corrupcao de arquivos em falhas de processo.`n`n### Criterios de Aceite`n- [x] Atomic write via arquivo temporario + rename síncrono." `
  --label "feature"

# 9
gh issue create --title "[FEAT] Implementar Algoritmo de Calculo de Streaks e Consistencia Temporal" `
  --body "### Descricao`nImplementar StreakCalculator puro para processar sequencias ininterruptas (current streak, longest streak) e consistencia temporal.`n`n### Criterios de Aceite`n- [x] Calculo exato de dias contiguos e tolerancia ao dia corrente em aberto." `
  --label "feature,domain"

# 10
gh issue create --title "[TEST] Desenvolver Suite de Testes Unitarios para StreakCalculator e HabitService" `
  --body "### Descricao`nConstruir bateria automatizada de testes com node:test nativo cobrindo calculo de streaks e regras de servico.`n`n### Criterios de Aceite`n- [x] 100% dos testes passando via 'npm test' sem dependencias externas." `
  --label "test"

# 11
gh issue create --title "[FEAT] Implementar Servicos de Aplicacao (HabitService - CRUD e Filtros)" `
  --body "### Descricao`nDesenvolver HabitService coordenando persistencia, regras de dominio, arquivamento (soft delete) e filtros.`n`n### Criterios de Aceite`n- [x] Metodos createHabit, listActiveHabits, updateHabit e archiveHabit." `
  --label "feature,application"

# 12
gh issue create --title "[FEAT] Implementar Registro de Check-in Diario e Operacao de Desfazer Check-in" `
  --body "### Descricao`nImplementar metodos de conclusao diaria (check-in) e cancelamento (uncheck) com deteccao de duplicidade.`n`n### Criterios de Aceite`n- [x] Bloqueio de check-in duplicado na mesma data.`n- [x] Desfazer check-in com recalculacao imediata de streaks." `
  --label "feature,application"

# 13
gh issue create --title "[FEAT] Desenvolver Interface de Linha de Comando (CLI) e Demonstracao" `
  --body "### Descricao`nConstruir interface CLI interativa com comandos add, list, check, uncheck, stats e modo demo.`n`n### Criterios de Aceite`n- [x] CLI amigavel formatada com tabelas e suporte ao comando demo." `
  --label "feature"

# 14
gh issue create --title "[FEAT] Desenvolver Geracao de Relatorios Estatisticos e Metricas Semanais" `
  --body "### Descricao`nConstruir MetricsService para consolidar taxas de adesao semanal, consolidado de check-ins e recordes gerais.`n`n### Criterios de Aceite`n- [x] Relatorio executivo sintético gerado com 'npm run cli -- stats'." `
  --label "feature"

# 15
gh issue create --title "[RELEASE] Consolidar README.md, Versionamento SemVer v0.1.0 e Documentacao Final" `
  --body "### Descricao`nFinalizar README.md completo com badges, guia de instalacao, sumario de features e tag SemVer v0.1.0.`n`n### Criterios de Aceite`n- [x] README.md sincronizado e tag v0.1.0 criada." `
  --label "documentation,release"

Write-Host "`nTodas as 15 issues foram criadas com sucesso no GitHub!" -ForegroundColor Green
