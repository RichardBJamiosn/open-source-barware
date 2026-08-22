@echo off
title Open Source Barware Install
cd /d "%~dp0"
REM install.ps1 is ASCII + UTF-8 BOM so Windows PowerShell 5.1 can parse it.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
if errorlevel 1 pause