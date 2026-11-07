<#
.SYNOPSIS
  Script de automação Git Flow e Versionamento SemVer para o HabitFlow.
.DESCRIPTION
  Inicializa o Git localmente, configura as branches main e develop, realiza os commits
  atômicos com Conventional Commits, cria a tag v0.1.0 e conecta ao GitHub.
#>

param(
    [string]$GitHubRepoUrl = ""
)

Write-Host "🌊 Inicializando Workflow Git Flow para o HabitFlow..." -ForegroundColor Cyan

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

Write-Host "`n✅ Workflow Git Flow concluído com sucesso!" -ForegroundColor Green
Write-Host "   Branch 'main' e 'develop' criadas."
Write-Host "   Commits atômicos realizados no padrão Conventional Commits."
Write-Host "   Tag 'v0.1.0' gerada com sucesso."

if ($GitHubRepoUrl -ne "") {
    Write-Host "`nVinculando repositório remoto: $GitHubRepoUrl" -ForegroundColor Cyan
    git remote add origin $GitHubRepoUrl
    git push -u origin main
    git push -u origin develop
    git push --tags
    Write-Host "🚀 Push de todas as branches e tags concluído com sucesso no GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n💡 Dica: Para enviar para o GitHub, crie o repositório e execute:" -ForegroundColor Yellow
    Write-Host "   gh repo create habitflow --public --source=. --remote=origin --push" -ForegroundColor White
    Write-Host "   ou adicione o remote manualmente:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git" -ForegroundColor White
    Write-Host "   git push -u origin main && git push -u origin develop --tags" -ForegroundColor White
}
