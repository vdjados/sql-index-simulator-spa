# Создаёт валидный PNG и иконки Tauri (placeholder-index.png в репо может быть битым).
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$png = Join-Path $root 'public\pwa-icon.png'

Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 512, 512
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(44, 62, 80))
$font = New-Object System.Drawing.Font('Arial', 48, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString('SQL', $font, $brush, 140, 220)
$g.Dispose()
$bmp.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Created $png"

Set-Location $root
npm run tauri icon $png
