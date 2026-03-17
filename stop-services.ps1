$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$innerRoot = Join-Path $root "whizrobo-project"
$scriptPath = Join-Path $innerRoot "stop-services.ps1"

if (!(Test-Path $scriptPath)) {
  throw "stop-services.ps1 not found at: $scriptPath"
}

& $scriptPath @args
