# Synthetic Windows client - internal verification checklist (VC).
# No physical Windows PC required; run on GitHub windows-latest or after local install.
# Usage: pwsh -File scripts/windows-vc.ps1 [-InstallDir $env:USERPROFILE\osb-program] [-Port 5052]

param(
    [string]$InstallDir = "",
    [int]$Port = 5052
)

$ErrorActionPreference = "Stop"

if (-not $InstallDir) {
    $InstallDir = Join-Path $env:USERPROFILE "osb-program"
}

$checks = [System.Collections.Generic.List[object]]::new()

function Add-Check([string]$id, [string]$label, [scriptblock]$test) {
    try {
        $detail = & $test
        $checks.Add([pscustomobject]@{ Id = $id; Label = $label; Pass = $true; Detail = $detail })
    } catch {
        $checks.Add([pscustomobject]@{ Id = $id; Label = $label; Pass = $false; Detail = $_.Exception.Message })
    }
}

function Get-Http([string]$path) {
    $bases = @("http://127.0.0.1:$Port", "http://localhost:$Port")
    foreach ($base in $bases) {
        $uri = "$base$path"
        try {
            return Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 5
        } catch {}
        try {
            $tmp = [System.IO.Path]::GetTempFileName()
            $code = (curl.exe -s -o $tmp -w "%{http_code}" $uri 2>$null)
            if ($code -eq "200") {
                $content = Get-Content $tmp -Raw -ErrorAction Stop
                Remove-Item $tmp -Force -ErrorAction SilentlyContinue
                return [pscustomobject]@{ StatusCode = 200; Content = $content }
            }
            Remove-Item $tmp -Force -ErrorAction SilentlyContinue
        } catch {}
    }
    throw "request failed for $path"
}

Add-Check "VC-00" "Port listening on 127.0.0.1" {
    $t = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue
    if (-not $t.TcpTestSucceeded) { throw "port $Port closed" }
    "OK"
}

Write-Host ""
Write-Host "  OSB Windows VC - synthetic client"
Write-Host "  InstallDir: $InstallDir"
Write-Host "  -------------------------------------"

Add-Check "VC-01" "Install directory exists" {
    if (-not (Test-Path $InstallDir)) { throw "missing $InstallDir" }
    "OK"
}

Add-Check "VC-02" "Core program files present" {
    $required = @(
        "server.py",
        "requirements.txt",
        "osb_config.json",
        "start-server.ps1",
        "static\home.html",
        "static\setup.html",
        "static\js\osb-app.js"
    )
    $missing = $required | Where-Object { -not (Test-Path (Join-Path $InstallDir $_)) }
    if ($missing) { throw "missing: $($missing -join ', ')" }
    "OK ($($required.Count) files)"
}

Add-Check "VC-03" "Python venv executable" {
    $venvPy = Join-Path $InstallDir ".venv\Scripts\python.exe"
    if (-not (Test-Path $venvPy)) { throw "venv python missing" }
    $ver = & $venvPy --version
    $ver
}

Add-Check "VC-04" "Flask + openpyxl importable" {
    $venvPy = Join-Path $InstallDir ".venv\Scripts\python.exe"
    $out = & $venvPy -c "import flask, openpyxl; print(flask.__version__)" 2>&1
    if ($LASTEXITCODE -ne 0) { throw ($out -join " ") }
    "flask $out"
}

Add-Check "VC-05" "Server /ping returns ok" {
    $r = Get-Http "/ping"
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    $body = $r.Content | ConvertFrom-Json
    if ($body.status -ne "ok") { throw "body: $($r.Content)" }
    "version=$($body.version)"
}

Add-Check "VC-06" "Home route responds (phase-aware)" {
    $r = Get-Http "/home"
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    if ($r.Content -match "barSwitcher") { return "butterfly admin shell" }
    if ($r.Content -match "setup-shell") { return "gated to setup (pre-butterfly)" }
    throw "unexpected /home content"
}

Add-Check "VC-07" "Setup wizard entry loads" {
    $r = Get-Http "/setup"
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    if ($r.Content -notmatch "setup-shell") { throw "setup shell missing" }
    "OK"
}

Add-Check "VC-08" "State API readable" {
    $r = Get-Http "/api/state"
    if ($r.StatusCode -ne 200) { throw "status $($r.StatusCode)" }
    $body = $r.Content | ConvertFrom-Json
    if (-not $body.phase) { throw "phase missing" }
    "phase=$($body.phase)"
}

Add-Check "VC-09" "Login startup shortcut registered" {
    $startup = [Environment]::GetFolderPath("Startup")
    $lnk = Join-Path $startup "Open Source Barware.lnk"
    if (-not (Test-Path $lnk)) { throw "shortcut missing at $lnk" }
    "OK"
}

Add-Check "VC-10" "Server log files present" {
    $log = Join-Path $InstallDir "data\osb_server.log"
    $err = Join-Path $InstallDir "data\osb_server.err"
    if (-not (Test-Path $log)) { throw "stdout log missing" }
    $total = (Get-Item $log).Length + $(if (Test-Path $err) { (Get-Item $err).Length } else { 0 })
    if ($total -lt 1) { throw "logs empty" }
    "$total bytes"
}

$failed = @($checks | Where-Object { -not $_.Pass })
foreach ($c in $checks) {
    $mark = if ($c.Pass) { "PASS" } else { "FAIL" }
    Write-Host ("  [{0}] {1} - {2}" -f $mark, $c.Id, $c.Label)
    if ($c.Detail) { Write-Host ("         {0}" -f $c.Detail) }
}

Write-Host ""
if ($failed.Count -gt 0) {
    Write-Host "  VC RESULT: FAIL ($($failed.Count)/$($checks.Count))"
    exit 1
}

Write-Host "  VC RESULT: PASS ($($checks.Count)/$($checks.Count))"
exit 0
