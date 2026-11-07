# HabitFlow - Backlog de Engenharia: Mapeamento das 15 Issues

Este documento detalha o conjunto obrigatório de **15 Issues** do HabitFlow, incluindo título formal, corpo da issue, rótulos (*labels*), vinculação de requisitos/user stories e critérios de aceite explícitos para execução no GitHub Issues.

---

## Tabela de Resumo das 15 Issues

| # | Tipo | Título da Issue | Labels | Requisitos / US |
| :-: | :--- | :--- | :--- | :--- |
| **01** | `docs` | [DOC] Elaborar Project Charter e Termo de Abertura do Projeto | `documentation` | Objetivos SMART |
| **02** | `docs` | [DOC] Especificar Requisitos Funcionais (RF) e Não Funcionais (RNF) | `documentation` | `RF01-RF10`, `RNF01-RNF08` |
| **03** | `docs` | [DOC] Modelar Casos de Uso com Fluxos Principais, Alternativos e Exceção | `documentation` | `UC01-UC06` |
| **04** | `docs` | [DOC] Detalhar Histórias de Usuário com Critérios de Aceite BDD/Gherkin | `documentation` | `US01-US08` |
| **05** | `docs` | [DOC] Criar Diagramas Complementares de Engenharia (C4, DER, Classes, Estados) | `documentation`, `enhancement` | Arquitetura |
| **06** | `chore` | [CHORE] Configurar Estrutura de Pastas do Repositório, .gitignore e Package.json | `chore`, `setup` | `RNF05`, `RNF06` |
| **07** | `feat` | [FEAT] Implementar Entidades de Domínio Habit e CheckIn com Validações | `feature`, `domain` | `RF01`, `RF05`, `RNF07` |
| **08** | `feat` | [FEAT] Implementar Repositório com Persistência Atômica Durável em JSON | `feature`, `infrastructure` | `RNF02`, `RF10` |
| **09** | `feat` | [FEAT] Implementar Algoritmo de Cálculo de Streaks e Consistência Temporal | `feature`, `domain` | `RF07`, `US03` |
| **10** | `test` | [TEST] Desenvolver Suíte de Testes Unitários para StreakCalculator e HabitService | `test` | `RNF04` |
| **11** | `feat` | [FEAT] Implementar Serviços de Aplicação (HabitService - CRUD e Filtros) | `feature`, `application` | `RF01-RF04`, `RF08` |
| **12** | `feat` | [FEAT] Implementar Registro de Check-in Diário e Operação de Desfazer Check-in | `feature`, `application` | `RF05`, `RF06`, `US02`, `US07` |
| **13** | `feat` | [FEAT] Desenvolver Interface de Linha de Comando (CLI) e Demonstração | `feature`, `ui` | `RF02`, `RNF03`, `US04` |
| **14** | `feat` | [FEAT] Desenvolver Geração de Relatórios Estatísticos e Métricas Semanais | `feature`, `analytics` | `RF09`, `US04` |
| **15** | `release`| [RELEASE] Consolidar README.md, Versionamento SemVer v0.1.0 e Documentação Final | `documentation`, `release` | `RNF08` |

---

## Especificação Completa de Cada Issue

### Issue #01: [DOC] Elaborar Project Charter e Termo de Abertura do Projeto
- **Labels**: `documentation`
- **Descrição**:
  ```markdown
  ### Descrição
  Elaborar o Termo de Abertura do Projeto (Project Charter) do HabitFlow para fundamentar formalmente a concepção do produto de software.

  ### Tarefas
  - [x] Redigir justificativa comportamental e técnica para o desenvolvimento da ferramenta.
  - [x] Definir objetivos SMART (Específicos, Mensuráveis, Atingíveis, Relevantes e Temporais).
  - [x] Delimitar claramente o escopo do projeto (In-Scope e Out-of-Scope para o ciclo atual).
  - [x] Identificar os principais stakeholders e perfis de público-alvo.
  - [x] Armazenar o artefato no caminho `docs/project-charter.md`.

  ### Critérios de Aceite
  - [x] O documento deve conter todas as seções descritas em formato Markdown legível.
  - [x] Os objetivos devem cobrir metas numéricas e de prazo para o ciclo de desenvolvimento.
  ```

---

### Issue #02: [DOC] Especificar Requisitos Funcionais (RF) e Não Funcionais (RNF)
- **Labels**: `documentation`
- **Descrição**:
  ```markdown
  ### Descrição
  Definir a especificação formal e rastreável de Requisitos Funcionais e Não Funcionais do sistema HabitFlow.

  ### Tarefas
  - [x] Especificar no mínimo 10 Requisitos Funcionais com numeração `[RF01]` a `[RF10]` e prioridade MoSCoW.
  - [x] Especificar no mínimo 8 Requisitos Não Funcionais `[RNF01]` a `[RNF08]` cobrindo desempenho, persistência, usabilidade, confiabilidade, portabilidade e manutenibilidade.
  - [x] Construir a Matriz de Rastreabilidade cruzando requisitos com Use Cases e User Stories.
  - [x] Armazenar o documento em `docs/requisitos.md`.

  ### Critérios de Aceite
  - [x] Cada requisito deve possuir identificador único e descrição unívoca.
  - [x] Os RNFs devem conter métricas quantitativas ou critérios objetivos de verificação.
  ```

---

### Issue #03: [DOC] Modelar Casos de Uso com Fluxos Principais, Alternativos e Exceção
- **Labels**: `documentation`
- **Descrição**:
  ```markdown
  ### Descrição
  Modelar os Casos de Uso (Use Cases) do sistema para documentar as interações entre os atores e a aplicação.

  ### Tarefas
  - [x] Mapear atores humanos e automatizados envolvidos.
  - [x] Detalhar os fluxos principais, alternativos e de exceção para operações de cadastro, check-in, consulta e arquivamento.
  - [x] Criar diagrama de casos de uso em Mermaid.
  - [x] Salvar em `docs/casos-de-uso.md`.

  ### Critérios de Aceite
  - [x] Todos os casos de uso centrais possuem tratamento de fluxos de erro/exceção.
  - [x] O diagrama Mermaid renderiza sem erros de sintaxe.
  ```

---

### Issue #04: [DOC] Detalhar Histórias de Usuário com Critérios de Aceite BDD/Gherkin
- **Labels**: `documentation`
- **Descrição**:
  ```markdown
  ### Descrição
  Redigir as Histórias de Usuário no padrão ágil canônico e definir critérios de aceitação em BDD (Gherkin).

  ### Tarefas
  - [x] Escrever User Stories no padrão "Como [ator], quero [ação] para que [valor]".
  - [x] Elaborar múltiplos cenários de aceite em Gherkin (`Dado... Quando... Então...`) para cada história.
  - [x] Mapear cenários felizes e de borda (dados inválidos, duplicações).
  - [x] Salvar em `docs/user-stories.md`.

  ### Critérios de Aceite
  - [x] Pelo menos 8 Histórias de Usuário completas com critérios de aceite BDD.
  ```

---

### Issue #05: [DOC] Criar Diagramas Complementares de Engenharia (C4, DER, Classes, Estados)
- **Labels**: `documentation`, `enhancement`
- **Descrição**:
  ```markdown
  ### Descrição
  Enriquecer a documentação técnica com diagramas arquiteturais e de engenharia estruturados.

  ### Tarefas
  - [x] Elaborar Diagrama C4 Model Nível 1 (Contexto) e Nível 2 (Contêiner).
  - [x] Projetar Modelo Entidade-Relacionamento (DER) para entidades Habit e CheckIn.
  - [x] Desenhar Diagrama de Classes UML demonstrando desacoplamento de camadas.
  - [x] Representar a Máquina de Estados do ciclo de vida de um hábito.
  - [x] Persistir o artefato em `docs/arquitetura.md`.

  ### Critérios de Aceite
  - [x] Todos os diagramas devem estar formatados em blocos Mermaid válidos.
  ```

---

### Issue #06: [CHORE] Configurar Estrutura de Pastas do Repositório, .gitignore e Package.json
- **Labels**: `chore`, `setup`
- **Descrição**:
  ```markdown
  ### Descrição
  Inicializar a estrutura de arquivos e diretórios do projeto HabitFlow respeitando o layout padrão exigido.

  ### Tarefas
  - [x] Criar diretórios `docs/`, `src/`, `tests/` e `scripts/`.
  - [x] Configurar `.gitignore` completo para ambiente Node.js.
  - [x] Configurar `package.json` com scripts de execução (`start`, `test`, `demo`).

  ### Critérios de Aceite
  - [x] Repositório estruturado conforme layout oficial.
  - [x] Nenhum arquivo gerado ou dependência desnecessária no versionamento.
  ```

---

### Issue #07: [FEAT] Implementar Entidades de Domínio Habit e CheckIn com Validações
- **Labels**: `feature`, `domain`
- **Descrição**:
  ```markdown
  ### Descrição
  Implementar as entidades fundamentais do modelo de domínio: `Habit` e `CheckIn`.

  ### Tarefas
  - [x] Criar classe `Habit` com validações de título, categorias e frequência.
  - [x] Criar classe `CheckIn` associada ao identificador do hábito com data e notas.
  - [x] Implementar métodos de mutação controlada e serialização `toJSON()`.

  ### Critérios de Aceite
  - [x] Rejeitar criação de hábitos com títulos com menos de 3 caracteres.
  - [x] Garantir imutabilidade de IDs após instanciação.
  ```

---

### Issue #08: [FEAT] Implementar Repositório com Persistência Atômica Durável em JSON
- **Labels**: `feature`, `infrastructure`
- **Descrição**:
  ```markdown
  ### Descrição
  Criar a camada de persistência `JSONHabitRepository` com mecanismo de escrita atômica para evitar corrupção de dados.

  ### Tarefas
  - [x] Implementar métodos `findAll()`, `findById()`, `save()`, `saveCheckIn()` e `removeCheckIn()`.
  - [x] Aplicar escrita atômica (gravação em arquivo temporário com `fs.renameSync`).
  - [x] Tratar inicialização automática caso o arquivo de banco não exista.

  ### Critérios de Aceite
  - [x] Operações de escrita não devem deixar arquivos corrompidos em caso de interrupção.
  ```

---

### Issue #09: [FEAT] Implementar Algoritmo de Cálculo de Streaks e Consistência Temporal
- **Labels**: `feature`, `domain`
- **Descrição**:
  ```markdown
  ### Descrição
  Desenvolver a classe pura `StreakCalculator` para processar sequências ininterruptas de conclusões e taxas de adesão.

  ### Tarefas
  - [x] Implementar ordenação e remoção de datas duplicadas.
  - [x] Calcular `currentStreak` considerando se a conclusão ocorreu hoje ou ontem.
  - [x] Calcular `longestStreak` histórico ininterrupto.
  - [x] Calcular taxa percentual de consistência em janelas de tempo arbitrárias (7 e 30 dias).

  ### Critérios de Aceite
  - [x] Streaks devem computar corretamente dias contíguos sem falhas.
  - [x] Tolerância ao dia de hoje pendente sem zerar a sequência anterior válida de ontem.
  ```

---

### Issue #10: [TEST] Desenvolver Suíte de Testes Unitários para StreakCalculator e HabitService
- **Labels**: `test`
- **Descrição**:
  ```markdown
  ### Descrição
  Construir bateria abrangente de testes automatizados utilizando o test runner nativo do Node.js (`node:test`).

  ### Tarefas
  - [x] Criar testes unitários para todos os cenários de `StreakCalculator` (sequências ativas, recordes, quebras, dias vazios).
  - [x] Criar testes unitários para `HabitService` (criação, duplicidade de check-in, arquivamento e uncheck).
  - [x] Garantir execução rápida com zero dependências externas instaladas.

  ### Critérios de Aceite
  - [x] 100% dos testes devem passar com sucesso (`npm test`).
  - [x] Cobertura superior a 80% das regras críticas.
  ```

---

### Issue #11: [FEAT] Implementar Serviços de Aplicação (HabitService - CRUD e Filtros)
- **Labels**: `feature`, `application`
- **Descrição**:
  ```markdown
  ### Descrição
  Desenvolver o serviço orquestrador `HabitService` responsável por coordenar regras de negócio, persistência e métricas.

  ### Tarefas
  - [x] Implementar método de criação `createHabit()`.
  - [x] Implementar listagem ativa `listActiveHabits()` com enriquecimento de streak em tempo real.
  - [x] Implementar arquivamento `archiveHabit()`.
  - [x] Implementar filtragem por categoria temática.

  ### Critérios de Aceite
  - [x] Hábitos arquivados não devem ser retornados na listagem padrão.
  ```

---

### Issue #12: [FEAT] Implementar Registro de Check-in Diário e Operação de Desfazer Check-in
- **Labels**: `feature`, `application`
- **Descrição**:
  ```markdown
  ### Descrição
  Implementar as operações de marcação de cumprimento diário e cancelamento de check-in.

  ### Tarefas
  - [x] Implementar método `checkIn(habitId, date, notes)`.
  - [x] Implementar validação contra check-in repetido na mesma data.
  - [x] Implementar `undoCheckIn(habitId, date)` para desfazer marcação indevida.

  ### Critérios de Aceite
  - [x] Tentativa de check-in duplicado deve disparar erro controlado.
  - [x] Desfazer check-in deve remover o registro e recalcular métricas instantaneamente.
  ```

---

### Issue #13: [FEAT] Desenvolver Interface de Linha de Comando (CLI) e Demonstração
- **Labels**: `feature`, `ui`
- **Descrição**:
  ```markdown
  ### Descrição
  Construir a camada de apresentação em terminal com comandos intuitivos e visualização formatada em tabelas.

  ### Tarefas
  - [x] Implementar comandos `add`, `list`, `check`, `uncheck`, `archive`, `stats` e `demo`.
  - [x] Formatar saída amigável no terminal com cores ANSI e indicadores de status.
  - [x] Criar comando `demo` interativo para popular a base e simular uso de 7 dias em segundos.

  ### Critérios de Aceite
  - [x] Interface CLI deve fornecer instruções claras de uso via comando de ajuda.
  ```

---

### Issue #14: [FEAT] Desenvolver Geração de Relatórios Estatísticos e Métricas Semanais
- **Labels**: `feature`, `analytics`
- **Descrição**:
  ```markdown
  ### Descrição
  Desenvolver o serviço de consolidação analítica `MetricsService` e exibição de relatórios agregados.

  ### Tarefas
  - [x] Computar taxa de consistência dos últimos 7 e 30 dias para cada hábito.
  - [x] Identificar o hábito com maior recorde histórico de streak no sistema.
  - [x] Contabilizar total consolidado de check-ins e taxa global de adesão.

  ### Critérios de Aceite
  - [x] Relatório deve sintetizar percentuais matematicamente exatos.
  ```

---

### Issue #15: [RELEASE] Consolidar README.md, Versionamento SemVer v0.1.0 e Documentação Final
- **Labels**: `documentation`, `release`
- **Descrição**:
  ```markdown
  ### Descrição
  Finalizar a documentação raiz do repositório, aplicar a tag de versão SemVer `v0.1.0` e validar a entrega.

  ### Tarefas
  - [x] Redigir `README.md` com badges, visão geral, guia de instalação, sumário de funcionalidades e diagrama Git Flow.
  - [x] Mapear links diretos para todos os arquivos em `docs/`.
  - [x] Gerar tag Git anotada `v0.1.0` no marco de conclusão do MVP.
  - [x] Validar a integridade de todas as 15 issues e rastreabilidade total.

  ### Critérios de Aceite
  - [x] README.md totalmente sincronizado com o código e documentos.
  - [x] Tag `v0.1.0` criada marcando o release do MVP.
  ```
