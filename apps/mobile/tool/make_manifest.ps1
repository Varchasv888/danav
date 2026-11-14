# Writes installed_files.sha256 inside the given release folder: one "hexhash *relative\path" line per file already there, in the same format
# `sha256sum` writes (and the app's lib/core/integrity_io.dart reads). Run this AFTER the release build and BEFORE handing the folder to Inno Setup,
# so the installer ships the manifest as one more file and the app can tell, after install, whether anything placed beside it has since changed.
param(
    [Parameter(Mandatory = $true)][string]$ReleaseDir
)
$ErrorActionPreference = "Stop"
$root = (Resolve-Path $ReleaseDir).Path
$manifestPath = Join-Path $root "installed_files.sha256"
if (Test-Path $manifestPath) { Remove-Item $manifestPath -Force }

$lines = @()
Get-ChildItem -Path $root -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($root.Length).TrimStart('\')
    $hash = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash.ToLower()
    $lines += "$hash *$rel"
}
Set-Content -Path $manifestPath -Value $lines -Encoding ascii
Write-Host "Wrote $($lines.Count) file hashes to $manifestPath"
