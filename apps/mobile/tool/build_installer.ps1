# Builds the obfuscated Windows release, stamps the tamper-check manifest, and compiles the installer, in order.
# Run from apps\mobile: powershell -ExecutionPolicy Bypass -File tool\build_installer.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "== flutter build windows (release, obfuscated) =="
flutter build windows --release --obfuscate --split-debug-info=build\debug-symbols
if ($LASTEXITCODE -ne 0) { throw "flutter build windows failed" }

$releaseDir = Join-Path $root "build\windows\x64\runner\Release"
if (-not (Test-Path $releaseDir)) { throw "Release folder not found at $releaseDir" }

Write-Host "== stamping installed_files.sha256 =="
powershell -ExecutionPolicy Bypass -File (Join-Path $root "tool\make_manifest.ps1") -ReleaseDir $releaseDir
if ($LASTEXITCODE -ne 0) { throw "make_manifest.ps1 failed" }

$iscc = Get-ChildItem -Path @(
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe"
) -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $iscc) { throw "ISCC.exe (Inno Setup) not found" }

Write-Host "== compiling the installer with $($iscc.FullName) =="
& $iscc.FullName (Join-Path $root "installer\varchasv.iss")
if ($LASTEXITCODE -ne 0) { throw "ISCC failed" }

Write-Host "== done: build\installer\VarchasvSetup.exe =="
Get-ChildItem (Join-Path $root "build\installer") | Format-Table Name, Length
