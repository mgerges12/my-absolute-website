# Publishes everything you've changed to the live site.
# Usage: double-click publish.bat, or run:  .\publish.ps1 "what I changed"
param([string]$Message)

Set-Location $PSScriptRoot

# Grab any changes made elsewhere (e.g. edits on github.com) first
git pull --rebase --autostash
if ($LASTEXITCODE -ne 0) { Write-Host "Couldn't pull the latest version. Fix the problem above, then try again." -ForegroundColor Red; exit 1 }

git add -A
$changed = git status --porcelain
$unpushed = git log --oneline '@{u}..HEAD'
if (-not $changed -and -not $unpushed) { Write-Host "Nothing new to publish." -ForegroundColor Yellow; exit 0 }

if ($changed) {
    Write-Host "`nChanges to publish:" -ForegroundColor Cyan
    git status --short

    if (-not $Message) { $Message = Read-Host "`nDescribe your change (or press Enter)" }
    if (-not $Message) { $Message = "Update site $(Get-Date -Format 'yyyy-MM-dd')" }

    git commit -q -m $Message
}
git push
if ($LASTEXITCODE -ne 0) { Write-Host "Push failed. See the message above." -ForegroundColor Red; exit 1 }

Write-Host "`nPublished! Vercel is rebuilding. Your site will update in about a minute:" -ForegroundColor Green
Write-Host "https://my-absolute-website.vercel.app/"
