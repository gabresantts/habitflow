# HabitFlow - Especificação de Requisitos (RF e RNF)

Este documento estabelece os Requisitos Funcionais e Não Funcionais do **HabitFlow**, garantindo a rastreabilidade bidirecional entre a concepção do produto, as Histórias de Usuário, os Casos de Uso e o Backlog de Engenharia (Issues).

---

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais definem as ações, comportamentos e serviços específicos que o software HabitFlow deve prover aos usuários.

| Identificador | Título do Requisito | Descrição Detalhada | Prioridade (MoSCoW) |
| :--- | :--- | :--- | :--- |
| **[RF01]** | **Cadastrar Hábito** | O sistema deve permitir ao usuário cadastrar um novo hábito informando título obrigatório (ex.: "Ler 20 páginas"), descrição opcional, categoria (Saúde, Estudos, Produtividade, Finanças ou Outros) e meta de frequência semanal (dias por semana de 1 a 7). | Must Have |
| **[RF02]** | **Listar Hábitos Ativos** | O sistema deve exibir a listagem de todos os hábitos ativos, apresentando seu identificador único, título, categoria, status de conclusão no dia corrente (Pendente ou Concluído) e a sequência atual (*current streak*). | Must Have |
| **[RF03]** | **Atualizar Hábito** | O sistema deve permitir a alteração das informações cadastrais de um hábito existente (título, descrição, categoria e frequência alvo), preservando o histórico de conclusões preexistentes. | Should Have |
| **[RF04]** | **Arquivar Hábito (Soft Delete)** | O sistema deve possibilitar o arquivamento de um hábito sem apagar fisicamente seus dados e histórico de conclusões, ocultando-o da listagem principal de acompanhamento diário. | Must Have |
| **[RF05]** | **Registrar Conclusão Diária (Check-in)** | O sistema deve permitir que o usuário registre o cumprimento de um hábito para uma data específica (por padrão a data corrente), com horário registrado e notas opcionais (ex.: "Capítulo 4 concluído"). Não deve permitir duplicidade de check-in para a mesma data. | Must Have |
| **[RF06]** | **Desfazer Conclusão (Check-out)** | O sistema deve permitir ao usuário revogar o check-in realizado em uma determinada data, recalculando imediatamente a sequência (*streak*) e a taxa de adesão. | Should Have |
| **[RF07]** | **Calcular Streaks (Sequências)** | O sistema deve calcular automaticamente para cada hábito: (a) a sequência ininterrupta atual de dias concluídos (*current streak*); (b) o maior recorde histórico de dias consecutivos (*longest streak*). | Must Have |
| **[RF08]** | **Filtrar por Categoria** | O sistema deve permitir a filtragem e agrupamento da visualização dos hábitos por sua categoria temática. | Should Have |
| **[RF09]** | **Gerar Relatório de Desempenho** | O sistema deve computar e exibir métricas consolidadas: taxa percentual de adesão nos últimos 7 e 30 dias, total de check-ins acumulados e hábito mais consistente. | Should Have |
| **[RF10]** | **Exportar e Importar Dados (Backup)** | O sistema deve permitir exportar todos os dados cadastrados e o histórico de check-ins para um arquivo no formato JSON padronizado, bem como restaurá-los. | Could Have |

---

## 2. Requisitos Não Funcionais (RNF)

Os requisitos não funcionais especificam restrições arquiteturais, critérios de qualidade, segurança e conformidade do sistema.

| Identificador | Categoria | Descrição Detalhada | Métrica / Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **[RNF01]** | **Desempenho** | O tempo de processamento de qualquer operação de leitura, escrita ou cálculo de streaks em memória local não deve exceder 100 milissegundos. | Latência média < 100 ms em execuções de testes de carga com até 500 hábitos e 10.000 check-ins. |
| **[RNF02]** | **Persistência e Integridade** | Os dados devem ser persistidos em arquivo JSON durável utilizando escrita atômica (*atomic write via arquivo temporário seguido de rename*), prevenindo corrupção de dados em caso de encerramento abrupto. | Zero corrupção de dados comprovada em testes de interrupção de I/O. |
| **[RNF03]** | **Usabilidade** | A interface em linha de comando (CLI) e os comandos do sistema devem fornecer mensagens claras, legíveis, com códigos de saída (*exit codes*) corretos e indicação visual de sucesso/erro. | Feedback imediato no terminal com mensagens descritivas para todas as operações. |
| **[RNF04]** | **Confiabilidade e Testabilidade** | As regras de negócio críticas (cálculo de sequências ininterruptas, regras de transição de status e validações) devem ser cobertas por suíte de testes unitários automatizados. | Cobertura mínima de 80% das classes e métodos das camadas de domínio e serviço. |
| **[RNF05]** | **Portabilidade** | A aplicação deve executar de forma transparente em sistemas operacionais Windows, Linux e macOS sem necessidade de alterações no código-fonte. | Suporte nativo em qualquer ambiente com Node.js versão 18 LTS ou superior. |
| **[RNF06]** | **Manutenibilidade** | A arquitetura deve seguir o padrão em camadas e princípios SOLID, mantendo desacoplamento estrito entre domínio, persistência e interfaces de apresentação. | Zero acoplamento entre regras de domínio e mecanismo de I/O em disco. |
| **[RNF07]** | **Segurança e Validação** | O sistema deve validar e sanitizar todas as entradas de dados (títulos em branco, caracteres de escape, limites de tamanho) antes de processá-los no domínio. | Rejeição graciosa de strings vazias, nulas ou formatos de data inválidos com exceções tipadas. |
| **[RNF08]** | **Versionamento e Rastreabilidade** | O desenvolvimento deve seguir rigorosamente o padrão Git Flow, commits atômicos segundo a especificação Conventional Commits e controle de versão SemVer 2.0.0. | 100% dos commits no formato convencional e branches vinculadas às issues do backlog. |

---

## 3. Matriz de Rastreabilidade

A matriz abaixo estabelece a relação direta entre os Requisitos Funcionais, Casos de Uso, Histórias de Usuário e as Issues do repositório:

| Requisito Funcional | Caso de Uso | História de Usuário | Issue Vinculada |
| :--- | :--- | :--- | :--- |
| **[RF01]** Cadastrar Hábito | `UC01` | `US01` | Issue #07, #11 |
| **[RF02]** Listar Hábitos Ativos | `UC02` | `US01`, `US03` | Issue #11, #13 |
| **[RF03]** Atualizar Hábito | `UC01` | `US01` | Issue #11 |
| **[RF04]** Arquivar Hábito | `UC04` | `US05` | Issue #11, #13 |
| **[RF05]** Registrar Conclusão | `UC02` | `US02` | Issue #07, #12 |
| **[RF06]** Desfazer Conclusão | `UC05` | `US07` | Issue #12 |
| **[RF07]** Calcular Streaks | `UC03` | `US03` | Issue #09, #10 |
| **[RF08]** Filtrar por Categoria | `UC02` | `US06` | Issue #11, #13 |
| **[RF09]** Relatório de Desempenho | `UC03` | `US04` | Issue #14 |
| **[RF10]** Exportar/Importar Dados | `UC06` | `US08` | Issue #08, #13 |
