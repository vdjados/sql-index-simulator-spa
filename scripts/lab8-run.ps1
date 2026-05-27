# Lab8: env files + gh-pages build. Start backend separately.
param(
  [string]$GitHubRepoName = 'sql-index-simulator-spa',
  [switch]$PreviewGhPages,
  [switch]$BuildTauri
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host '=== 1. .env.github ===' -ForegroundColor Cyan
$ghLines = @(
  '# GitHub Pages mock'
  "VITE_BASE_PATH=/${GitHubRepoName}/"
  'VITE_USE_MOCK=true'
  'VITE_API_BASE_URL='
)
Set-Content -Path (Join-Path $root '.env.github') -Value $ghLines -Encoding ascii
Write-Host "  VITE_BASE_PATH=/${GitHubRepoName}/"

Write-Host '=== 2. .env.tauri IP ===' -ForegroundColor Cyan
& (Join-Path $PSScriptRoot 'lab8-set-tauri-ip.ps1')

Write-Host '=== 3. npm install ===' -ForegroundColor Cyan
npm install

Write-Host '=== 4. build:gh-pages ===' -ForegroundColor Cyan
npm run build:gh-pages
Write-Host "  dist: $root\dist"

if ($PreviewGhPages) {
  npm run preview:gh-pages
}

if ($BuildTauri) {
  & (Join-Path $PSScriptRoot 'lab8-tauri-icon.ps1')
  npm run tauri:build
}

Write-Host ''
Write-Host 'Next (manual):' -ForegroundColor Yellow
Write-Host '  Backend: cd sql-index-simulator; docker compose up -d; go run .\cmd\main\main.go'
Write-Host '  Web+API: npm run dev'
Write-Host '  HTTPS:   npm run dev:https'
Write-Host '  GitHub:  push repo, Settings -> Pages -> GitHub Actions'
