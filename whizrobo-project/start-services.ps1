param(
  [switch]$Clean
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runDir = Join-Path $root ".run"
$logDir = Join-Path $runDir "logs"
$pidFile = Join-Path $runDir "services.json"

if (!(Test-Path $runDir)) { New-Item -ItemType Directory -Path $runDir | Out-Null }
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

if ($Clean -and (Test-Path $pidFile)) {
  try {
    & (Join-Path $root "stop-services.ps1") | Out-Null
  } catch {
    Write-Host "Warning: cleanup failed: $($_.Exception.Message)"
  }
}

$flaskExe = Join-Path $root "project-rag-python\backend\venv\Scripts\python.exe"
if (!(Test-Path $flaskExe)) {
  throw "Flask venv python not found at: $flaskExe"
}

$services = @(
  @{
    Name = "flask"
    FilePath = $flaskExe
    Args = @("run.py")
    WorkDir = Join-Path $root "project-rag-python\backend"
    Url = "http://127.0.0.1:5000/health"
    HealthRetries = 180
    HealthIntervalMs = 500
    OutLog = Join-Path $logDir "flask.out.log"
    ErrLog = Join-Path $logDir "flask.err.log"
  },
  @{
    Name = "backend"
    FilePath = "npm.cmd"
    Args = @("run", "dev")
    WorkDir = Join-Path $root "project-backend"
    Url = "http://127.0.0.1:5001/"
    HealthRetries = 30
    HealthIntervalMs = 500
    OutLog = Join-Path $logDir "backend.out.log"
    ErrLog = Join-Path $logDir "backend.err.log"
  },
  @{
    Name = "frontend"
    FilePath = "npm.cmd"
    Args = @("run", "dev", "--", "--host", "127.0.0.1", "--port", "5173")
    WorkDir = Join-Path $root "project-frontend"
    Url = "http://127.0.0.1:5173/"
    HealthRetries = 30
    HealthIntervalMs = 500
    OutLog = Join-Path $logDir "frontend.out.log"
    ErrLog = Join-Path $logDir "frontend.err.log"
  }
)

$started = @()

foreach ($svc in $services) {
  Remove-Item $svc.OutLog, $svc.ErrLog -ErrorAction SilentlyContinue
  $p = Start-Process -FilePath $svc.FilePath `
    -ArgumentList $svc.Args `
    -WorkingDirectory $svc.WorkDir `
    -RedirectStandardOutput $svc.OutLog `
    -RedirectStandardError $svc.ErrLog `
    -PassThru

  $started += [PSCustomObject]@{
    name = $svc.Name
    pid = $p.Id
    url = $svc.Url
    out_log = $svc.OutLog
    err_log = $svc.ErrLog
  }
}

$payload = [PSCustomObject]@{
  started_at = (Get-Date).ToString("s")
  root = $root
  services = $started
}
$payload | ConvertTo-Json -Depth 5 | Set-Content -Path $pidFile

foreach ($svc in $started) {
  $ok = $false
  $config = $services | Where-Object { $_.Name -eq $svc.name } | Select-Object -First 1
  $retries = if ($config -and $config.HealthRetries) { [int]$config.HealthRetries } else { 25 }
  $intervalMs = if ($config -and $config.HealthIntervalMs) { [int]$config.HealthIntervalMs } else { 600 }

  1..$retries | ForEach-Object {
    if ($ok) { return }
    Start-Sleep -Milliseconds $intervalMs
    try {
      $null = Invoke-WebRequest -UseBasicParsing -Uri $svc.url -TimeoutSec 2
      $ok = $true
    } catch {}
  }

  if ($ok) {
    Write-Host "$($svc.name): running (PID $($svc.pid))"
  } else {
    Write-Host "$($svc.name): started but not healthy yet (PID $($svc.pid))"
  }
}

Write-Host ""
Write-Host "PID file: $pidFile"
Write-Host "Logs: $logDir"
