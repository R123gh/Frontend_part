$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runDir = Join-Path $root ".run"
$pidFile = Join-Path $runDir "services.json"

if (!(Test-Path $pidFile)) {
  Write-Host "No PID file found: $pidFile"
  exit 0
}

$data = Get-Content -Path $pidFile -Raw | ConvertFrom-Json
if (-not $data.services) {
  Write-Host "No services in PID file."
  Remove-Item $pidFile -ErrorAction SilentlyContinue
  exit 0
}

foreach ($svc in $data.services) {
  $procId = [int]$svc.pid
  try {
    $null = Get-Process -Id $procId -ErrorAction Stop
    Stop-Process -Id $procId -Force -ErrorAction Stop
    Write-Host "$($svc.name): stopped (PID $procId)"
  } catch {
    Write-Host "$($svc.name): not running (PID $procId)"
  }
}

Remove-Item $pidFile -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Stopped services listed in PID file."
