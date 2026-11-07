param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    [string]$RepoName = "habitflow",
    [string]$Description = "Sistema de Gestao de Habitos e Produtividade Pessoal com SDLC profissional no GitHub"
)

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/vnd.github+json"
    "User-Agent"    = "HabitFlow-AutoSync"
}

Write-Host "1. Verificando usuario autenticado..." -ForegroundColor Cyan
$user = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -Method Get
$owner = $user.login
Write-Host "Autenticado como: $owner" -ForegroundColor Green

Write-Host "`n2. Criando repositorio '$RepoName' no GitHub..." -ForegroundColor Cyan
$repoBody = @{
    name        = $RepoName
    description = $Description
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $repo = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $repoBody
    Write-Host "Repositorio criado com sucesso: $($repo.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Repositorio ja existe ou erro: $($_.Exception.Message). Prosseguindo..." -ForegroundColor Yellow
}

$baseDir = "C:\Users\gabri\.gemini\antigravity\scratch\habitflow"

Write-Host "`n3. Enviando arquivos para o repositorio via GitHub API..." -ForegroundColor Cyan
$files = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object {
    $_.FullName -notmatch "node_modules|\.git|habitflow-data|\.tmp"
}

foreach ($f in $files) {
    $relativePath = $f.FullName.Substring($baseDir.Length + 1).Replace("\", "/")
    $contentBytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $contentBase64 = [System.Convert]::ToBase64String($contentBytes)

    $putBody = @{
        message = "chore: add $relativePath"
        content = $contentBase64
    } | ConvertTo-Json

    $uploadUri = "https://api.github.com/repos/$owner/$RepoName/contents/$relativePath"
    
    # Verifica se ja existe para pegar o SHA
    try {
        $existing = Invoke-RestMethod -Uri $uploadUri -Headers $headers -Method Get -ErrorAction SilentlyContinue
        if ($existing -and $existing.sha) {
            $putBody = @{
                message = "chore: update $relativePath"
                content = $contentBase64
                sha     = $existing.sha
            } | ConvertTo-Json
        }
    } catch {}

    try {
        $null = Invoke-RestMethod -Uri $uploadUri -Headers $headers -Method Put -Body $putBody
        Write-Host "  -> Enviado: $relativePath" -ForegroundColor Gray
    } catch {
        Write-Host "  Falha ao enviar: $relativePath - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n4. Cadastrando as 15 Issues no GitHub..." -ForegroundColor Cyan

$issuesData = @(
    @{ title = "[DOC] Elaborar Project Charter e Termo de Abertura do Projeto"; labels = @("documentation"); body = "Elaborar o Termo de Abertura do Projeto com justificativa, objetivos SMART e escopo in/out." },
    @{ title = "[DOC] Especificar Requisitos Funcionais (RF) e Nao Funcionais (RNF)"; labels = @("documentation"); body = "Especificar lista de [RF01-RF10] e [RNF01-RNF08] com matriz de rastreabilidade." },
    @{ title = "[DOC] Modelar Casos de Uso com Fluxos Principais e de Excecao"; labels = @("documentation"); body = "Modelar casos de uso centrais (UC01-UC06) com fluxos e diagrama Mermaid." },
    @{ title = "[DOC] Detalhar Historias de Usuario com Criterios de Aceite BDD/Gherkin"; labels = @("documentation"); body = "Redigir 8 historias de usuario com criterios Dado/Quando/Entao." },
    @{ title = "[DOC] Criar Diagramas Complementares de Engenharia (C4, DER, Classes)"; labels = @("documentation"); body = "Criar diagramas C4 Contexto/Conteiner, DER, Classes UML e Estados." },
    @{ title = "[CHORE] Configurar Estrutura de Pastas do Repositorio, .gitignore e Package.json"; labels = @("chore"); body = "Configurar estrutura docs, src, tests e arquivos de configuracao." },
    @{ title = "[FEAT] Implementar Entidades de Dominio Habit e CheckIn com Validacoes"; labels = @("feature"); body = "Criar entidades de dominio com regras de validacao." },
    @{ title = "[FEAT] Implementar Repositorio com Persistencia Atomica Duravel em JSON"; labels = @("feature"); body = "Criar JSONHabitRepository com garantia de atomic write (RNF02)." },
    @{ title = "[FEAT] Implementar Algoritmo de Calculo de Streaks e Consistencia Temporal"; labels = @("feature"); body = "Implementar StreakCalculator puro para dias consecutivos e consistencia." },
    @{ title = "[TEST] Desenvolver Suite de Testes Unitarios para StreakCalculator e HabitService"; labels = @("test"); body = "Criar testes automatizados com 100% de sucesso." },
    @{ title = "[FEAT] Implementar Servicos de Aplicacao (HabitService - CRUD e Filtros)"; labels = @("feature"); body = "Criar operacoes de cadastro, listagem, atualizacao e arquivamento." },
    @{ title = "[FEAT] Implementar Registro de Check-in Diario e Operacao de Desfazer Check-in"; labels = @("feature"); body = "Implementar check-in com anti-duplicidade e uncheck." },
    @{ title = "[FEAT] Desenvolver Interface de Linha de Comando (CLI) e Demonstracao"; labels = @("feature"); body = "Interface CLI interativa com tabelas e comando demo." },
    @{ title = "[FEAT] Desenvolver Geracao de Relatorios Estatisticos e Metricas Semanais"; labels = @("feature"); body = "Gerar relatorio de adesao e estatisticas consolidadas (RF09)." },
    @{ title = "[RELEASE] Consolidar README.md, Versionamento SemVer v0.1.0 e Documentacao Final"; labels = @("release"); body = "Finalizar documentacao, README e tag v0.1.0." }
)

foreach ($iss in $issuesData) {
    $issueBody = @{
        title  = $iss.title
        body   = $iss.body
        labels = $iss.labels
    } | ConvertTo-Json

    try {
        $createdIssue = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$RepoName/issues" -Headers $headers -Method Post -Body $issueBody
        Write-Host "  -> Issue criada: $($iss.title) (#$($createdIssue.number))" -ForegroundColor Gray
    } catch {
        Write-Host "  Falha ao criar issue: $($iss.title) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nSUCESSO TOTAL! Repositorio disponivel em: https://github.com/$owner/$RepoName" -ForegroundColor Green
