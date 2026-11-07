#!/usr/bin/env bash
# Script de automação Git Flow e Versionamento SemVer para o HabitFlow

set -e

GITHUB_REPO_URL="${1:-}"

echo "🌊 Inicializando Workflow Git Flow para o HabitFlow..."

# 1. Inicializar Git
git init
git checkout -b main

# 2. Commit inicial na main
git add .gitignore README.md
git commit -m "chore: initial commit on main with base configuration and README"

# 3. Criar e mudar para develop
git checkout -b develop

# 4. Criar branch temática e commit para Docs
git checkout -b feature/issue-01-05-planning-docs
git add docs/
git commit -m "docs(planning): add project-charter, requisitos, casos-de-uso, user-stories and arquitetura (Closes #1, #2, #3, #4, #5)"
git checkout develop
git merge --no-ff feature/issue-01-05-planning-docs -m "merge: incorporate planning documentation into develop"
git branch -d feature/issue-01-05-planning-docs

# 5. Criar branch temática e commit para Estrutura e Domain
git checkout -b feature/issue-06-09-domain-and-storage
git add package.json .github/ scripts/ src/domain/ src/infrastructure/
git commit -m "feat(domain): implement Habit, CheckIn, StreakCalculator and JSONHabitRepository (Closes #6, #7, #8, #9)"
git checkout develop
git merge --no-ff feature/issue-06-09-domain-and-storage -m "merge: incorporate domain and persistence into develop"
git branch -d feature/issue-06-09-domain-and-storage

# 6. Criar branch temática e commit para Testes
git checkout -b feature/issue-10-unit-tests
git add tests/
git commit -m "test(unit): add automated test suites for StreakCalculator and HabitService (Closes #10)"
git checkout develop
git merge --no-ff feature/issue-10-unit-tests -m "merge: incorporate test suite into develop"
git branch -d feature/issue-10-unit-tests

# 7. Criar branch temática e commit para Aplicação e CLI
git checkout -b feature/issue-11-14-application-and-cli
git add src/application/ src/presentation/ src/index.js
git commit -m "feat(app): implement HabitService, MetricsService and interactive CLI with demo (Closes #11, #12, #13, #14)"
git checkout develop
git merge --no-ff feature/issue-11-14-application-and-cli -m "merge: incorporate application services and CLI into develop"
git branch -d feature/issue-11-14-application-and-cli

# 8. Release v0.1.0: merge de develop para main e tag anotada
git checkout main
git merge --no-ff develop -m "release: merge develop into main for MVP v0.1.0 (Closes #15)"
git tag -a v0.1.0 -m "Release v0.1.0 - MVP HabitFlow: Especificação formal, 15 issues e SDLC"
git checkout develop

echo ""
echo "✅ Workflow Git Flow concluído com sucesso!"
echo "   Branch 'main' e 'develop' criadas."
echo "   Commits atômicos realizados no padrão Conventional Commits."
echo "   Tag 'v0.1.0' gerada com sucesso."

if [ -n "$GITHUB_REPO_URL" ]; then
    echo "Vinculando repositório remoto: $GITHUB_REPO_URL"
    git remote add origin "$GITHUB_REPO_URL"
    git push -u origin main
    git push -u origin develop
    git push --tags
    echo "🚀 Push de todas as branches e tags concluído com sucesso no GitHub!"
fi
