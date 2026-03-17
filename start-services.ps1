param(
  [switch]$Clean
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$innerRoot = Join-Path $root "whizrobo-project"
$scriptPath = Join-Path $innerRoot "start-services.ps1"

if (!(Test-Path $scriptPath)) {
  throw "start-services.ps1 not found at: $scriptPath"
}

# Pass through any supported parameters to the real script.
& $scriptPath @PSBoundParameters
