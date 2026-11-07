# HabitFlow - Especificação Arquitetural e Modelagem de Engenharia

Este documento consolida a arquitetura de software, diagramas conceituais (C4 Model), modelo de dados (DER), diagrama de classes e a máquina de estados do **HabitFlow**.

---

## 1. Visão Geral da Arquitetura (Clean Architecture & Layered Pattern)

O HabitFlow adota os princípios da Clean Architecture (Arquitetura Limpa), separando rigorosamente as preocupações em camadas concêntricas e unidirecionais:

```mermaid
flowchart TD
    subgraph Presentation["1. Camada de Apresentação (CLI / Runner)"]
        CLI["Interface CLI (Comandos & Argumentos)"]
    end
    
    subgraph Application["2. Camada de Aplicação (Casos de Uso)"]
        HabitService["HabitService (Orquestração de Regras)"]
        MetricsService["MetricsService (Estatísticas & Relatórios)"]
    end
    
    subgraph Domain["3. Camada de Domínio (Entidades & Lógica Pura)"]
        Habit["Entidade Habit"]
        CheckIn["Entidade CheckIn"]
        StreakCalc["StreakCalculator (Cálculo Puro de Streaks)"]
    end
    
    subgraph Infrastructure["4. Camada de Infraestrutura (Persistência & I/O)"]
        Repo["JSONHabitRepository (Persistência Atômica)"]
        FileSystem["File System (dados em JSON)"]
    end
    
    CLI --> HabitService
    CLI --> MetricsService
    HabitService --> Habit
    HabitService --> CheckIn
    HabitService --> StreakCalc
    HabitService --> Repo
    MetricsService --> StreakCalc
    MetricsService --> Repo
    Repo --> FileSystem
```

---

## 2. Diagramas C4 Model

### 2.1. C4 Nível 1 - Diagrama de Contexto de Sistema

```mermaid
flowchart TD
    User["👤 Usuário Regular<br/>(Estudante / Profissional)"]
    HabitFlowSystem["📦 Sistema HabitFlow<br/>[Software System]<br/>Gerencia hábitos, registra check-ins diários e calcula métricas de consistência."]
    LocalDisk["💾 Sistema de Arquivos Local<br/>[External Storage]<br/>Armazena dados em JSON estruturado com escrita atômica segura."]
    
    User -->|"Registra metas diárias, executa check-ins e visualiza relatórios"| HabitFlowSystem
    HabitFlowSystem -->|"Lê e persiste dados de hábitos e históricos de conclusão"| LocalDisk
```

### 2.2. C4 Nível 2 - Diagrama de Contêineres

```mermaid
flowchart TD
    User["👤 Usuário"]
    
    subgraph HabitFlow["Contêiner HabitFlow (Node.js ESM)"]
        CLIInterface["CLI Controller / Entrypoint<br/>[Component: JavaScript ESM]<br/>Interpreta argumentos da linha de comando e renderiza tabelas e mensagens."]
        AppCore["Application Core (Services & Domain)<br/>[Component: Pure JS/Logic]<br/>Regras de negócio, cálculo de sequências consecutivas e consistência temporal."]
        DataLayer["JSON Storage Engine<br/>[Component: Repository Pattern]<br/>Camada de serialização atômica, garantindo consistência contra quedas."]
    end
    
    DatabaseFile["📄 habitflow-data.json<br/>[Arquivo de Dados]<br/>JSON durável com coleções de hábitos e check-ins."]
    
    User -->|"Executa comandos (npm start / cli)"| CLIInterface
    CLIInterface -->|"Invoca casos de uso"| AppCore
    AppCore -->|"Solicita leitura e escrita de agregados"| DataLayer
    DataLayer -->|"Leitura / Escrita atômica em disco"| DatabaseFile
```

---

## 3. Modelo Entidade-Relacionamento (DER)

```mermaid
erDiagram
    HABIT ||--o{ CHECK_IN : "possui"
    
    HABIT {
        string id PK "Identificador único (ex: h-12345)"
        string title "Nome/Título do hábito"
        string description "Descrição complementar detalhada"
        string category "Categoria (Saúde, Estudos, etc.)"
        int targetDaysPerWeek "Meta de frequência semanal (1 a 7)"
        boolean isArchived "Flag de arquivamento (soft delete)"
        string createdAt "Timestamp ISO de criação"
        string updatedAt "Timestamp ISO da última modificação"
    }
    
    CHECK_IN {
        string id PK "Identificador único do check-in"
        string habitId FK "Referência ao hábito concluído"
        string date "Data da conclusão (formato AAAA-MM-DD)"
        string completedAt "Timestamp ISO do momento exato do registro"
        string notes "Notas ou observações da execução"
    }
```

---

## 4. Diagrama de Classes UML

```mermaid
classDiagram
    class Habit {
        +string id
        +string title
        +string description
        +string category
        +int targetDaysPerWeek
        +boolean isArchived
        +string createdAt
        +string updatedAt
        +archive() void
        +unarchive() void
        +update(data) void
        +toJSON() object
    }

    class CheckIn {
        +string id
        +string habitId
        +string date
        +string completedAt
        +string notes
        +toJSON() object
    }

    class StreakCalculator {
        +calculateStreaks(checkInDates, referenceDate) StreakResult
        +calculateConsistency(checkInDates, daysWindow, referenceDate) number
        -sortUniqueDates(dates) string[]
    }

    class StreakResult {
        +int currentStreak
        +int longestStreak
        +boolean completedToday
        +string lastCompletedDate
    }

    class HabitRepository {
        <<interface>>
        +findAll() Habit[]
        +findById(id) Habit
        +save(habit) void
        +saveCheckIn(checkIn) void
        +removeCheckIn(habitId, date) boolean
        +getCheckInsByHabit(habitId) CheckIn[]
        +getAllCheckIns() CheckIn[]
    }

    class JSONHabitRepository {
        -string filePath
        -loadData() object
        -persistData(data) void
    }

    class HabitService {
        -HabitRepository repo
        -StreakCalculator streakCalculator
        +createHabit(data) Habit
        +listActiveHabits() object[]
        +checkIn(habitId, date, notes) object
        +undoCheckIn(habitId, date) boolean
        +archiveHabit(habitId) boolean
        +getHabitStats(habitId) object
    }

    HabitRepository <|.. JSONHabitRepository
    HabitService --> HabitRepository
    HabitService --> StreakCalculator
    HabitService ..> Habit
    HabitService ..> CheckIn
    StreakCalculator ..> StreakResult
```

---

## 5. Máquina de Estados do Ciclo de Vida de um Hábito

```mermaid
stateDiagram-v2
    [*] --> Criado: Cadastro inicial (isArchived = false)
    
    state Criado {
        [*] --> PendenteNoDia: Início de um novo dia
        PendenteNoDia --> ConcluídoHoje: Check-in realizado com sucesso
        ConcluídoHoje --> PendenteNoDia: Desfazer check-in (reversão)
        ConcluídoHoje --> PendenteNoDia: Mudança de data (novo dia)
    }

    Criado --> Arquivado: Ação de Arquivamento (soft delete)
    Arquivado --> Criado: Reativação do Hábito
    Arquivado --> [*]: Eliminação permanente (se solicitado)
```
