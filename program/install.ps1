# Open Source Barware - Windows installer
# ASCII-only on purpose: Windows PowerShell 5.1 misreads UTF-8 em-dashes
# without a BOM as a string terminator (Install.bat dies at Read-Host).
# Usage: powershell -ExecutionPolicy Bypass -File install.ps1
#   -Silent          CI / no prompts
#   -SkipBrowser     Do not open Chrome/Edge after install

param(
    [switch]$Silent,
    [switch]$SkipBrowser,
    [string]$InstallDir = "",
    [string]$SourceDir = ""
)

$ErrorActionPreference = "Stop"
$PORT = 5052
$TASK_NAME = "OpenSourceBarwareProgram"

if (-not $InstallDir) {
    $InstallDir = Join-Path $env:USERPROFILE "osb-program"
}
if (-not $SourceDir) {
    $SourceDir = $PSScriptRoot
}

function Write-Step([string]$msg) {
    Write-Host "  $msg"
}

function Show-ServerLogs([string]$logPath, [string]$logErr) {
    foreach ($path in @($logErr, $logPath)) {
        if (Test-Path $path) {
            Write-Host "  --- $path ---"
            Get-Content $path -ErrorAction SilentlyContinue | Select-Object -Last 40 | ForEach-Object { Write-Host "  $_" }
        }
    }
}

function Test-PingOk([string]$base) {
    $uri = "$base/ping"
    try {
        $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -eq 200) { return $true }
    } catch {}
    try {
        $code = (curl.exe -s -o NUL -w "%{http_code}" $uri 2>$null)
        if ($code -eq "200") { return $true }
    } catch {}
    return $false
}

function Wait-ForPing([int]$seconds = 20) {
    $bases = @("http://127.0.0.1:$PORT", "http://localhost:$PORT")
    $deadline = (Get-Date).AddSeconds($seconds)
    while ((Get-Date) -lt $deadline) {
        foreach ($base in $bases) {
            if (Test-PingOk $base) { return $true }
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Find-Python {
    $candidates = @(
        @{ Cmd = "py"; Args = @("-3") },
        @{ Cmd = "python"; Args = @() },
        @{ Cmd = "python3"; Args = @() }
    )
    foreach ($c in $candidates) {
        try {
            $exe = Get-Command $c.Cmd -ErrorAction Stop
            $verArgs = $c.Args + @("-c", "import sys; print(sys.version_info.major)")
            $major = & $exe.Source @verArgs 2>$null
            if ($major -eq "3") {
                return @{ Exe = $exe.Source; Args = $c.Args }
            }
        } catch {}
    }
    return $null
}

function Stop-PortListener([int]$port) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($c in $conns) {
            if ($c.OwningProcess) {
                Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {}
}

if (-not $Silent) { Clear-Host }
Write-Host ""
Write-Host "  Open Source Barware - Windows Install"
Write-Host "  -------------------------------------"
Write-Host ""

Write-Step "[1/7] Checking Python 3..."
$py = Find-Python
if (-not $py) {
    Write-Host ""
    Write-Host "  ERROR: Python 3 not found."
    Write-Host "  Install from https://www.python.org/downloads/"
    Write-Host "  Check 'Add python.exe to PATH' during setup, then re-run Install.bat"
    if (-not $Silent) { Read-Host "  Press Enter to exit" }
    exit 1
}
$pyLaunch = $py.Exe
$pyPrefix = $py.Args
$verLine = & $pyLaunch @($pyPrefix + @("--version"))
Write-Step "OK $verLine"

Write-Step "[2/7] Preparing $InstallDir..."
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallDir "data") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallDir "static\css") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $InstallDir "static\js") | Out-Null

$copyList = @(
    "server.py",
    "invoice_parse.py",
    "requirements.txt",
    "osb_config.example.json",
    "install.ps1",
    "Install.bat",
    "Start.bat",
    "Stop.bat",
    "start-server.ps1",
    "README-INSTALL.txt",
    "LICENSE.txt",
    "VERSION.txt"
)
$staticFiles = @(
    "static\setup.html",
    "static\home.html",
    "static\api-guide.html",
    "static\standard-setups.html",
    "static\css\app.css",
    "static\js\osb-app.js",
    "static\downloads\Bar-Inventory-Master.xlsx"
)

foreach ($rel in $copyList) {
    $src = Join-Path $SourceDir $rel
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $InstallDir $rel) -Force
    }
}
foreach ($rel in $staticFiles) {
    $src = Join-Path $SourceDir $rel
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $InstallDir $rel) -Force
    }
}
# Bottle weight seed for optional weight mode (do not overwrite customer edits)
$weightsSrc = Join-Path $SourceDir "data\bottle-weights.json"
$weightsDst = Join-Path $InstallDir "data\bottle-weights.json"
if ((Test-Path $weightsSrc) -and -not (Test-Path $weightsDst)) {
    Copy-Item -Path $weightsSrc -Destination $weightsDst -Force
}
$scriptsDir = Join-Path $SourceDir "scripts"
if (Test-Path $scriptsDir) {
    $destScripts = Join-Path $InstallDir "scripts"
    New-Item -ItemType Directory -Force -Path $destScripts | Out-Null
    Get-ChildItem -Path $scriptsDir -Filter "*.ps1" -File | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination (Join-Path $destScripts $_.Name) -Force
    }
}
Write-Step "OK Program files copied"

$configPath = Join-Path $InstallDir "osb_config.json"
if (-not (Test-Path $configPath)) {
    Copy-Item (Join-Path $InstallDir "osb_config.example.json") $configPath
}

Write-Step "[3/7] Creating virtual environment..."
$venvDir = Join-Path $InstallDir ".venv"
if (Test-Path $venvDir) {
    Remove-Item -Recurse -Force $venvDir
}
& $pyLaunch @($pyPrefix + @("-m", "venv", $venvDir))
$venvPython = Join-Path $venvDir "Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "  ERROR: Could not create venv at $venvDir"
    if (-not $Silent) { Read-Host "  Press Enter to exit" }
    exit 1
}
Write-Step "OK venv ready"

Write-Step "[4/7] Installing dependencies..."
& $venvPython -m pip install --upgrade pip --quiet
& $venvPython -m pip install -r (Join-Path $InstallDir "requirements.txt") --quiet
& $venvPython -c "import flask, openpyxl" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Flask/openpyxl failed to install."
    if (-not $Silent) { Read-Host "  Press Enter to exit" }
    exit 1
}
Write-Step "OK dependencies installed"

Write-Step "[5/7] Registering login startup..."
$startScript = Join-Path $InstallDir "start-server.ps1"
$startup = [Environment]::GetFolderPath("Startup")
$shortcutPath = Join-Path $startup "Open Source Barware.lnk"
try {
    $wsh = New-Object -ComObject WScript.Shell
    $lnk = $wsh.CreateShortcut($shortcutPath)
    $lnk.TargetPath = "powershell.exe"
    $lnk.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`" -Background"
    $lnk.WorkingDirectory = $InstallDir
    $lnk.Description = "Open Source Barware local program"
    $lnk.Save()
    Write-Step "OK Startup shortcut in shell:startup"
} catch {
    Write-Step "WARN Could not create startup shortcut ($($_.Exception.Message))"
}

Write-Step "[6/7] Starting server..."
if ($Silent) {
    try {
        netsh advfirewall firewall add rule name="OSB-Program-$PORT" dir=in action=allow protocol=TCP localport=$PORT | Out-Null
    } catch {}
}
Stop-PortListener -port $PORT
$logPath = Join-Path $InstallDir "data\osb_server.log"
$logErr = Join-Path $InstallDir "data\osb_server.err"
$serverPy = Join-Path $InstallDir "server.py"
$serverProc = Start-Process -FilePath $venvPython -ArgumentList @($serverPy) -WorkingDirectory $InstallDir `
    -WindowStyle Hidden -RedirectStandardOutput $logPath -RedirectStandardError $logErr -PassThru

$pingWait = if ($Silent) { 45 } else { 25 }
Start-Sleep -Seconds 2
if ($serverProc.HasExited) {
    Write-Host "  ERROR: Server process exited immediately (code $($serverProc.ExitCode))"
    Show-ServerLogs -logPath $logPath -logErr $logErr
    if (-not $Silent) { Read-Host "  Press Enter to exit" }
    exit 1
}

if (-not (Wait-ForPing $pingWait)) {
    Write-Host "  ERROR: Server did not respond on http://localhost:$PORT/ping"
    Write-Host "  Log: $logPath"
    Show-ServerLogs -logPath $logPath -logErr $logErr
    if (-not $Silent) { Read-Host "  Press Enter to exit" }
    exit 1
}
Write-Step "OK Server running on port $PORT"

Write-Step "[7/7] Opening browser..."
$url = "http://localhost:$PORT/"
if (-not $SkipBrowser) {
    Start-Process $url
}

Write-Host ""
Write-Host "  Setup complete!"
Write-Host "  Program:  $url"
Write-Host "  Bookmark that URL in Chrome."
Write-Host "  Restarts automatically when you log in (Startup folder)."
Write-Host "  Log:      $logPath"
Write-Host ""

if (-not $Silent) {
    Read-Host "  Press Enter to close this window"
}
