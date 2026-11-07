# HabitFlow - Project Charter (Termo de Abertura do Projeto)

| Versão | Data | Autor | Status |
| :--- | :--- | :--- | :--- |
| 1.0.0 | 07/11/2026 | Gabriel (Engenharia de Software) | Aprovado |

---

## 1. Justificativa do Projeto
A manutenção de rotinas saudáveis e hábitos consistentes de estudo, saúde física e produtividade é um dos principais desafios comportamentais enfrentados por estudantes universitários e profissionais. Estudos em ciências comportamentais demonstram que a visualização contínua do progresso diário e a manutenção de sequências ininterruptas (*streaks*) aumentam significativamente a adesão a metas de longo prazo.

Atualmente, muitas ferramentas existentes no mercado pecam por dois extremos: ou são excessivamente complexas e repletas de publicidade, ou não fornecem rastreabilidade clara e feedback analítico imediato. O **HabitFlow** nasce como uma solução enxuta, confiável e centrada no usuário para permitir o registro, categorização e cálculo automatizado de consistência diária de hábitos.

---

## 2. Visão Geral do Produto
O **HabitFlow** é um sistema moderno de gestão de hábitos diários e produtividade pessoal. A aplicação permite a definição de metas diárias, registro de conclusões (*check-ins*), cálculo automático de sequências ativas (*streaks* vigentes e recordes históricos), controle de categorias temáticas e relatórios consolidados de consistência semanal e mensal.

---

## 3. Objetivos SMART

| Critério | Definição no HabitFlow |
| :--- | :--- |
| **S (Specific)** | Desenvolver e documentar um sistema completo de gestão de hábitos diários com arquitetura em camadas, cobertura de testes unitários e rastreabilidade total via Git Flow e GitHub Issues. |
| **M (Measurable)** | Implementar 100% dos 10 Requisitos Funcionais essenciais (`RF01` a `RF10`), alcançar cobertura mínima de 85% de testes unitários nas regras de negócio e estruturar 15 issues fechadas via commits atômicos. |
| **A (Achievable)** | Escopo dimensionado de forma modular e realista para ciclo de desenvolvimento ágil semanal, utilizando tecnologias leves (Node.js LTS, ESM nativo e persistência estruturada). |
| **R (Relevant)** | Fornecer uma ferramenta funcional de alto valor prático para organização pessoal, além de servir como modelo acadêmico de excelência em engenharia de software e SDLC no GitHub. |
| **T (Time-bound)** | Entrega do planejamento, backlog, código-fonte, testes e repositório com tag `v0.1.0` dentro do prazo estabelecido para feedback antecipado. |

---

## 4. Escopo do Projeto

### 4.1. No Escopo (In-Scope - Ciclo Atual)
- [x] Cadastro, edição, listagem e arquivamento (*soft delete*) de hábitos.
- [x] Agrupamento por categorias padronizadas (Saúde, Estudos, Produtividade, Finanças, Bem-estar).
- [x] Registro de conclusão diária (*check-in*) com data/hora e notas opcionais.
- [x] Funcionalidade de desfazer check-in (*uncheck*) para correção de lançamentos acidentais.
- [x] Algoritmo matemático para cálculo de *current streak* (sequência atual) e *longest streak* (recorde histórico).
- [x] Cálculo de taxa percentual de adesão e consistência temporal (últimos 7 e 30 dias).
- [x] Persistência local em formato JSON durável com garantia de escrita atômica (*atomic write*).
- [x] Interface CLI intuitiva com menus interativos, comandos diretos e modo demonstração rápida.
- [x] Suíte de testes unitários automatizados cobrindo cálculo de streaks e serviços de domínio.
- [x] Documentação formal completa (`docs/`) e repositório organizado sob Git Flow e SemVer.

### 4.2. Fora do Escopo (Out-of-Scope - Versões Futuras)
- [ ] Autenticação multi-usuário com OAuth2 / Google Login (planejado para v0.3.0).
- [ ] Aplicativo mobile nativo em React Native / Flutter (planejado para v1.0.0).
- [ ] Notificações push via WebSockets ou push notifications no celular.
- [ ] Sincronização em tempo real com bancos de dados distribuídos em nuvem.
- [ ] Integração com smartwatches ou dispositivos IoT (ex.: Apple Watch, Garmin).

---

## 5. Stakeholders e Público-Alvo

| Papel | Representante / Perfil | Responsabilidade / Interesse |
| :--- | :--- | :--- |
| **Professor / Avaliador** | Corpo docente da disciplina | Avaliar a qualidade da documentação, rastreabilidade dos requisitos, aderência ao Git Flow e execução das 15 issues no GitHub. |
| **Tech Lead / Engenheiro** | Estudante desenvolvedor | Concepção da arquitetura, escrita dos requisitos, desenvolvimento do código, testes e gestão do backlog. |
| **Público-Alvo Primário** | Estudantes universitários | Usuários que necessitam construir rotinas de estudo diárias, leitura e controle de horários. |
| **Público-Alvo Secundário** | Profissionais em home office | Usuários em busca de equilíbrio de vida, exercícios regulares, pausas ativas e hidratação. |

---

## 6. Premissas e Restrições

### Premissas
- O ambiente do usuário possui Node.js instalado na versão LTS (v18.0.0 ou superior).
- A persistência dos dados deve ocorrer localmente sem demandar servidores externos de banco de dados.
- O versionamento seguirá estritamente a especificação Conventional Commits e Semantic Versioning (SemVer 2.0.0).

### Restrições
- **Tecnológica**: Não utilizar frameworks ou bibliotecas externas pesadas que impeçam a execução out-of-the-box por novos colaboradores.
- **Temporal**: Finalização da documentação, código e esteira de issues para submissão prévia da disciplina.
- **Processual**: Proibição de commits diretos na branch `main`. Todo código deve transitar por `develop` e branches temáticas `feature/issue-XX`.

---

## 7. Critérios de Sucesso do Projeto
1. Repositório público no GitHub com estrutura completa de pastas e documentação sincronizada.
2. 100% dos testes unitários passando sem erros.
3. Mínimo de 15 issues criadas, devidamente rotuladas com labels e associadas a critérios de aceite.
4. Histórico de commits limpo e atômico demonstrando o fluxo Git Flow e tags SemVer (`v0.1.0`).
