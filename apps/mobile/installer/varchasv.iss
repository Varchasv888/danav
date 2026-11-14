; Varchasv ERP billing app — Windows installer.
; Build first: flutter build windows --release --obfuscate --split-debug-info=build\debug-symbols
; Then stamp the manifest: powershell -File tool\make_manifest.ps1 -ReleaseDir build\windows\x64\runner\Release
; Then compile this script: ISCC installer\varchasv.iss
; (tool\build_installer.ps1 runs all three in order.)

#define MyAppName "Varchasv"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Varchasv ERP"
#define MyAppExeName "varchasv_app.exe"
#define ReleaseDir "..\build\windows\x64\runner\Release"

[Setup]
AppId={{B6E3C9A0-6F1E-4C7E-9A52-7B0A1F3E9D21}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\build\installer
OutputBaseFilename=VarchasvSetup
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#MyAppExeName}
; The installer itself is not code-signed (no certificate is configured for this build); Windows SmartScreen may warn on first run
; until the exe has been seen enough times, or until it is signed with a purchased code-signing certificate.

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"

[Files]
; Everything flutter build windows produced, including the installed_files.sha256 manifest tool\make_manifest.ps1 wrote into it.
Source: "{#ReleaseDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Launch {#MyAppName}"; Flags: nowait postinstall skipifsilent
