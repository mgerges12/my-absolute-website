@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0add-video.ps1" %*
pause
