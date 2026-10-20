# Adds a YouTube video to the Videos page.
# Usage: double-click add-video.bat, or run:  .\add-video.ps1 "https://youtu.be/XXXXXXXXXXX"
param([string]$Url)

Set-Location $PSScriptRoot

if (-not $Url) { $Url = Read-Host "Paste the YouTube link" }
if ($Url -notmatch '(?:youtu\.be/|[?&]v=)([\w-]{11})') { Write-Host "That doesn't look like a YouTube link." -ForegroundColor Red; exit 1 }
$id = $Matches[1]

$dir = "src\content\videos"
$n = 1
while (Test-Path "$dir\vid$n.md") { $n++ }

@"
---
title: '$id'
pubDate: '$(Get-Date -Format 'yyyy-MM-dd')'
videoUrl: 'https://youtu.be/$id'
---
"@ | Set-Content -Encoding utf8 "$dir\vid$n.md"

Write-Host "Added $dir\vid$n.md. Run publish.bat to put it live." -ForegroundColor Green
