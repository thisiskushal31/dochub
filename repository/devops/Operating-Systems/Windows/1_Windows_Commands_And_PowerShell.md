# Windows commands and PowerShell

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

Windows offers two main command-line environments: **Command Prompt (cmd)** and **PowerShell**. For automation and DevOps (scripts, CI agents, configuration), PowerShell is the standard. This topic covers essential commands in both, then focuses on PowerShell basics and scripting. For how Windows is structured beneath the shell (kernel, file system, boot, registry), see [Windows architecture and structure](./0_Windows_Architecture_And_Structure.md).

---

## Command Prompt (cmd) vs PowerShell

| Aspect | Command Prompt (cmd) | PowerShell |
|--------|----------------------|------------|
| **Shell** | Legacy; simple batch (.bat, .cmd). | Modern; object-based; .ps1 scripts. |
| **Output** | Text only. | Objects (pipeline of objects). |
| **Scripting** | Batch syntax; limited. | Full language; cmdlets, modules, .NET. |
| **Use in DevOps** | Legacy scripts, minimal new use. | Preferred for automation, Desired State Configuration, Azure, etc. |

For new automation on Windows, use **PowerShell** (Windows PowerShell 5.1 or PowerShell 7+).

---

## Essential Command Prompt (cmd) commands

Useful for quick checks or legacy scripts:

```cmd
REM System and info
hostname
systeminfo
ver
wmic os get caption,version
wmic cpu get name

REM Directory and files
dir
dir /b /s
cd /d C:\Path
mkdir dirname
copy src dest
move src dest
del file
type file
xcopy src dest /E /I
robocopy src dest /MIR

REM Processes and services
tasklist
tasklist /v
taskkill /PID <pid> /F
taskkill /im notepad.exe /F

REM Network
ipconfig
ipconfig /all
ping hostname
tracert hostname
nslookup domain
netstat -an
netstat -ano

REM Environment
set
echo %VAR%
set VAR=value
setx VAR value
path
```

---

## PowerShell: basics

PowerShell uses **cmdlets** (verb-noun, e.g. `Get-Process`, `Set-Location`) and **objects** in the pipeline.

```powershell
# Get help
Get-Help Get-Process
Get-Command *Process*

# Navigation and files
Get-Location
Set-Location C:\Path
Get-ChildItem
New-Item -ItemType Directory -Path C:\NewDir
Copy-Item src dest
Remove-Item path -Recurse -Force

# Aliases (shortcuts)
Get-Alias
# Common: dir -> Get-ChildItem, cd -> Set-Location, cat -> Get-Content
```

---

## PowerShell: pipeline and objects

The pipeline passes **objects**, not just text. You filter and format with cmdlets:

```powershell
# Objects in pipeline
Get-Process | Where-Object { $_.CPU -gt 100 }
Get-Process | Select-Object Name, Id, CPU
Get-Service | Format-Table Name, Status -AutoSize

# Sort and group
Get-Process | Sort-Object CPU -Descending
Get-ChildItem | Group-Object Extension
```

---

## PowerShell: variables, conditionals, loops

```powershell
# Variables (prefix $)
$name = "value"
$list = 1, 2, 3
$env:PATH

# Conditionals
if ($condition) { } elseif ($other) { } else { }

# Loops
foreach ($item in $collection) { }
while ($condition) { }
1..10 | ForEach-Object { $_ }
```

---

## PowerShell: scripting for DevOps

- **Execution policy** — Scripts may be restricted; for your account: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Script file** — Save as `.ps1`; run with `.\script.ps1` or `pwsh -File script.ps1`.
- **Parameters** — Use `param()` at the top; pass with `-ParamName value`.
- **Error handling** — `$ErrorActionPreference`; `try { } catch { }`.
- **Idempotency** — Check state before changing (e.g. `Test-Path`, `Get-Service`).

```powershell
# Example script skeleton
param(
    [string]$TargetPath = "C:\Data"
)
if (-not (Test-Path $TargetPath)) {
    New-Item -ItemType Directory -Path $TargetPath -Force
}
Get-ChildItem $TargetPath
```

---

## PowerShell: modules and remoting

**Modules** — PowerShell extends via **modules** (cmdlets and functions). List and load with `Get-Module`, `Import-Module`. Built-in: `Microsoft.PowerShell.Management`, `Microsoft.PowerShell.Utility`, `NetTCPIP`, `NetSecurity` (firewall). Install extra from [PowerShell Gallery](https://www.powershellgallery.com/) with **Install-Module** (e.g. `Install-Module -Name Az -Scope CurrentUser` for Azure).

```powershell
# List loaded and available modules
Get-Module -ListAvailable
Import-Module NetTCPIP

# Install from gallery (requires NuGet; one-time: Install-PackageProvider NuGet)
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser
```

**Remoting (WinRM)** — Run commands on remote Windows machines with **Enter-PSSession** (interactive) or **Invoke-Command** (one-off or script block). Requires WinRM enabled on the target (`Enable-PSRemoting` on the target, firewall rules for HTTP/5985 or HTTPS/5986).

```powershell
# One-off command on remote machine
Invoke-Command -ComputerName Server01 -ScriptBlock { Get-Service } -Credential (Get-Credential)

# Run script file on remote machine
Invoke-Command -ComputerName Server01 -FilePath C:\Scripts\deploy.ps1

# Interactive session
Enter-PSSession -ComputerName Server01
# ... run commands on Server01 ...
Exit-PSSession
```

## PowerShell: error handling and scripting depth

**Error action:** `$ErrorActionPreference` controls behavior when a cmdlet fails (`Stop`, `Continue`, `SilentlyContinue`, `Inquire`). Use `-ErrorAction Stop` on a single command to throw on failure.

```powershell
# Throw on any error in script
$ErrorActionPreference = 'Stop'
try {
    Get-Content C:\Nonexistent.txt
} catch {
    Write-Warning "Failed: $_"
    # $_.Exception.Message, $_.ScriptStackTrace
}
```

**Parameters and validation:** Use `param()` with types and attributes; **ValidateSet**, **ValidateNotNullOrEmpty**, **ValidateScript** for input checks.

```powershell
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('Start','Stop','Restart')]
    [string]$Action,
    [ValidateNotNullOrEmpty()]
    [string]$ServiceName = 'W3SVC'
)
```

**Profile** — Script that runs at startup: `$PROFILE` (path); create with `New-Item -Path $PROFILE -ItemType File -Force` and edit to add aliases, functions, or modules you want in every session.

## Cross-platform: WSL and PowerShell Core

- **WSL** (Windows Subsystem for Linux) — Run a Linux environment (e.g. Ubuntu) and use Bash and Linux tools from Windows. See [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md) for install, `wsl -l -v`, running commands, and DevOps use.
- **PowerShell 7** (PowerShell Core) — Runs on Windows, Linux, and macOS. Use it for consistent automation across platforms.

```powershell
# Check PowerShell version
$PSVersionTable.PSVersion

# WSL from PowerShell
wsl ls -la
wsl bash -c "echo hello"
```

---

## Summary

- **cmd** = legacy text shell; **PowerShell** = modern, object-based shell and scripting — use PowerShell for DevOps on Windows.
- **PowerShell**: cmdlets (Get-*, Set-*), pipeline of objects, variables (`$x`), conditionals and loops, `.ps1` scripts.
- **DevOps**: execution policy, parameters, error handling, idempotency; consider **PowerShell 7** and **WSL** for cross-platform and Linux parity.

---

## Further reading

- [Microsoft: PowerShell documentation](https://docs.microsoft.com/en-us/powershell/)
- [PowerShell 7 installation](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell)
- [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/)
