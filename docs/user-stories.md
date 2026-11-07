# HabitFlow - Histórias de Usuário (User Stories) e Critérios de Aceite (BDD)

Este documento contém as Histórias de Usuário do **HabitFlow**, estruturadas no padrão canônico ágil e acompanhadas de seus respectivos Critérios de Aceite em formato BDD / Gherkin (*Given / When / Then*).

---

## Índice das Histórias de Usuário

| Código | Título da História | Requisito Relacionado | Prioridade |
| :--- | :--- | :--- | :--- |
| **US01** | Cadastro de Novo Hábito | `[RF01]`, `[RF03]` | Alta |
| **US02** | Registro de Check-in Diário | `[RF05]` | Alta |
| **US03** | Cálculo Automático de Sequências (Streaks) | `[RF07]` | Alta |
| **US04** | Visualização de Dashboard e Consistência | `[RF02]`, `[RF09]` | Alta |
| **US05** | Arquivamento de Hábito | `[RF04]` | Média |
| **US06** | Filtragem de Hábitos por Categoria | `[RF08]` | Média |
| **US07** | Cancelamento/Reversão de Check-in | `[RF06]` | Média |
| **US08** | Backup e Exportação de Histórico | `[RF10]` | Baixa |

---

## Especificação das User Stories

### US01: Cadastro de Novo Hábito
> **Como** uma pessoa comprometida com meu desenvolvimento pessoal,  
> **Quero** cadastrar novos hábitos com título, categoria e frequência semanal,  
> **Para que** eu possa estabelecer compromissos claros e organizar minha rotina diária.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Cadastro realizado com sucesso com todos os campos válidos
  Dado que estou na interface do HabitFlow
  Quando eu solicitar o cadastro de um hábito com o título "Ler 15 páginas", categoria "Estudos" e meta semanal de 5 dias
  Então o sistema deve criar o hábito com um identificador único
  E o status inicial deve ser "ativo"
  E a contagem inicial de streak deve ser 0
  E uma mensagem de confirmação de cadastro deve ser exibida.

Cenário 2: Tentativa de cadastro com título inválido (em branco)
  Dado que desejo cadastrar um novo hábito
  Quando eu tentar submeter um hábito com título vazio ou contendo apenas espaços
  Então o sistema deve rejeitar o cadastro com a mensagem "Erro: O título deve conter no mínimo 3 caracteres"
  E nenhum registro deve ser persistido no banco de dados.

Cenário 3: Cadastro com valores padrão para campos opcionais
  Dado que informo apenas o título "Meditar 10 minutos"
  Quando eu concluir a submissão
  Então o sistema deve atribuir a categoria padrão "Outros"
  E a meta semanal padrão deve ser definida como 7 dias.
```

---

### US02: Registro de Conclusão Diária (Check-in)
> **Como** usuário praticante de novos hábitos,  
> **Quero** marcar o cumprimento de um hábito na data de hoje,  
> **Para que** meu progresso seja registrado imediatamente e eu mantenha meu engajamento.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Check-in realizado com sucesso no dia corrente
  Dado que existe um hábito ativo intitulado "Beber 2L de água"
  E não há check-in registrado para a data de hoje
  Quando eu registrar o check-in para este hábito
  Então o sistema deve criar um registro de conclusão com o timestamp atual
  E o status de hoje do hábito deve mudar para "Concluído"
  E a sequência atual (streak) deve ser incrementada em 1 dia.

Cenário 2: Tentativa de check-in duplicado no mesmo dia
  Dado que já realizei o check-in do hábito "Beber 2L de água" hoje
  Quando eu tentar registrar um novo check-in para o mesmo hábito na mesma data
  Então o sistema deve impedir a duplicação
  E deve informar que "O check-in já foi realizado para hoje".

Cenário 3: Tentativa de check-in em hábito arquivado
  Dado que o hábito "Academia" foi arquivado anteriormente
  Quando eu tentar registrar um check-in para ele
  Então o sistema deve recusar a operação informando que "Hábitos arquivados não aceitam novos check-ins".
```

---

### US03: Cálculo Automático de Sequências (Streaks)
> **Como** usuário focado em metas de longo prazo,  
> **Quero** que o sistema calcule automaticamente meus dias consecutivos de sucesso,  
> **Para que** eu sinta orgulho da minha sequência ativa e me sinta motivado a não quebrá-la.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Manutenção de sequência contínua
  Dado que um hábito possui check-in ontem e a sequência anterior era de 4 dias
  Quando eu registrar o check-in na data de hoje
  Então o streak atual deve ser atualizado para 5 dias
  E se 5 for maior que o recorde histórico, o longest streak deve se tornar 5 dias.

Cenário 2: Quebra de sequência por ausência de check-in
  Dado que o último check-in de um hábito ocorreu há 2 dias atrás
  E hoje ainda não houve check-in
  Quando o sistema calcular as métricas do hábito
  Então o streak atual deve ser avaliado como 0 dias
  E o recorde histórico anterior deve ser preservado intacto.

Cenário 3: Tolerância ao dia corrente ainda em andamento
  Dado que o último check-in ocorreu ontem e a sequência era de 3 dias
  E hoje o dia ainda está em curso sem check-in
  Quando eu visualizar a lista de hábitos
  Então o streak atual ainda deve exibir 3 dias (pendente de conclusão hoje para virar 4).
```

---

### US04: Visualização de Dashboard e Consistência
> **Como** praticante de autoaperfeiçoamento,  
> **Quero** consultar um resumo visual com meus hábitos, streaks e porcentagem de consistência,  
> **Para que** eu identifique claramente quais áreas da minha rotina estão consolidadas e quais demandam atenção.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Exibição completa do dashboard com hábitos cadastrados
  Dado que possuo 3 hábitos ativos cadastrados com diferentes históricos de check-in
  Quando eu solicitar a exibição do resumo geral
  Então o sistema deve listar cada hábito com ID, Nome, Categoria, Streak Atual, Recorde e Status de Hoje
  E deve exibir a taxa percentual de conclusão dos últimos 7 dias
  E deve indicar o total consolidado de check-ins realizados no sistema.

Cenário 2: Visualização inicial sem hábitos cadastrados
  Dado que o sistema acabou de ser inicializado e não possui hábitos
  Quando eu solicitar a listagem
  Então o sistema deve exibir uma mensagem indicativa "Nenhum hábito cadastrado ainda. Use o comando 'add' para começar!".
```

---

### US05: Arquivamento de Hábito (Soft Delete)
> **Como** usuário cuja rotina se transformou,  
> **Quero** arquivar hábitos que não pratico mais,  
> **Para que** minha lista diária permaneça limpa sem que eu perca meu histórico de conquistas passadas.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Arquivamento com sucesso
  Dado que existe um hábito ativo com ID "h-01"
  Quando eu solicitar o arquivamento do hábito "h-01"
  Então o sistema deve marcar o atributo "isArchived" como verdadeiro
  E o hábito não deve mais aparecer na listagem padrão de acompanhamento diário
  E o histórico de check-ins correspondente deve continuar preservado para relatórios.

Cenário 2: Tentativa de arquivar ID inexistente
  Dado que não existe nenhum hábito com o ID "invalido-999"
  Quando eu solicitar o arquivamento deste ID
  Então o sistema deve retornar a mensagem "Erro: Hábito com identificador informado não existe".
```

---

### US06: Filtragem de Hábitos por Categoria
> **Como** usuário com múltiplos hábitos em diferentes esferas da vida,  
> **Quero** filtrar meus hábitos por categoria temática (ex: Estudos, Saúde, Finanças),  
> **Para que** eu possa focar em um contexto específico da minha rotina por vez.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Filtro com resultados existentes
  Dado que possuo 2 hábitos na categoria "Estudos" e 3 hábitos na categoria "Saúde"
  Quando eu solicitar a listagem filtrando por "Estudos"
  Então o sistema deve retornar exclusivamente os 2 hábitos pertencentes à categoria "Estudos".

Cenário 2: Filtro por categoria sem hábitos associados
  Dado que não possuo nenhum hábito na categoria "Finanças"
  Quando eu filtrar por "Finanças"
  Então o sistema deve informar que "Nenhum hábito ativo encontrado para a categoria Finanças".
```

---

### US07: Cancelamento / Reversão de Check-in (Check-out)
> **Como** usuário sujeito a equívocos operacionais,  
> **Quero** desfazer um check-in marcado acidentalmente para o dia de hoje,  
> **Para que** meus dados reflitam com precisão a realidade do meu comportamento.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Reversão de check-in existente
  Dado que registrei acidentalmente o check-in do hábito "Corrida" para a data de hoje
  Quando eu executar a ação de desfazer check-in para este hábito
  Então o registro de conclusão de hoje deve ser removido do armazenamento
  E o status de hoje do hábito deve retornar para "Pendente"
  E a sequência atual de streak deve ser recalculada sem a inclusão de hoje.

Cenário 2: Tentativa de desfazer check-in não existente
  Dado que o hábito "Corrida" está com status "Pendente" hoje
  Quando eu tentar desfazer o check-in de hoje
  Então o sistema deve informar "Aviso: Não há check-in registrado para este hábito hoje".
```

---

### US08: Backup e Exportação de Histórico
> **Como** usuário cauteloso com meus dados,  
> **Quero** exportar todos os meus hábitos e registros em formato JSON padronizado,  
> **Para que** eu possa manter cópias de segurança locais e garantir a posse dos meus dados.

#### Critérios de Aceite (BDD / Gherkin)

```gherkin
Cenário 1: Exportação bem-sucedida de dados
  Dado que o sistema possui hábitos e check-ins cadastrados
  Quando eu acionar o comando de exportação
  Então o sistema deve gerar um arquivo JSON estruturado contendo a versão do schema, timestamp e todas as coleções
  E o arquivo gerado deve ser sintaticamente válido.
```
