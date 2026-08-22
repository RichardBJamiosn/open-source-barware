# Start Open Source Barware server (manual or login startup)
param([switch]$Background)

$InstallDir = if ($PSScriptRoot) { $PSScriptRoot } else { Join-Path $env:USERPROFILE "osb-program" }
$PORT = 5052
$venvPython = Join-Path $InstallDir ".venv\Scripts\python.exe"
$serverPy = Join-Path $InstallDir "server.py"
$logPath = Join-Path $InstallDir "data\osb_server.log"
$logErr = Join-Path $InstallDir "data\osb_server.err"

if (-not (Test-Path $serverPy)) {
    Write-Host "ERROR: Run Install.bat first."
    if (-not $Background) { Read-Host "Press Enter" }
    exit 1
}

try {
    $conns = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        if ($c.OwningProcess) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
} catch {}

New-Item -ItemType Directory -Force -Path (Join-Path $InstallDir "data") | Out-Null

if (-not (Test-Path $venvPython)) {
    Write-Host "ERROR: Python venv missing. Re-run Install.bat."
    if (-not $Background) { Read-Host "Press Enter" }
    exit 1
}

if ($Background) {
    Start-Process -FilePath $venvPython -ArgumentList "`"$serverPy`"" -WorkingDirectory $InstallDir `
        -WindowStyle Hidden -RedirectStandardOutput $logPath -RedirectStandardError $logErr
    exit 0
}

Write-Host "Starting Open Source Barware..."
Start-Process -FilePath $venvPython -ArgumentList "`"$serverPy`"" -WorkingDirectory $InstallDir `
    -NoNewWindow -RedirectStandardOutput $logPath -RedirectStandardError $logErr

$ok = $false
for ($i = 0; $i -lt 20; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$PORT/ping" -UseBasicParsing -TimeoutSec 2
        if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}

if ($ok) {
    Write-Host "OK http://localhost:$PORT/"
    Start-Process "http://localhost:$PORT/"
} else {
    Write-Host "ERROR: Server did not start. See $logPath"
}
if (-not $Background) { Read-Host "Press Enter" }
