# Event logs, security, and WSL (Windows)

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Windows commands and PowerShell](./1_Windows_Commands_And_PowerShell.md), [Services and networking](./2_Services_And_Networking.md). Here: **Windows Event Log**, **user management (local)**, **security from the OS view** (Group Policy, Windows Defender, audit), and **WSL (Windows Subsystem for Linux)** in depth for DevOps and cross-platform workflows.

---

## User management (local)

Windows **local users and groups** live on the machine (not in Active Directory). Used for local logins, service accounts, and admin access. **Domain** users are managed in AD; here we cover **local** only.

**Command Prompt (net):**

```cmd
REM List local users
net user

REM Create / delete / modify local user
net user NewUser Password123 /add
net user NewUser /delete
net user NewUser NewPassword
net user NewUser /active:no

REM Local groups
net localgroup
net localgroup Administrators
net localgroup Administrators NewUser /add
net localgroup Administrators NewUser /remove
```

**PowerShell (preferred for scripts):**

```powershell
# List local users
Get-LocalUser
Get-LocalUser | Where-Object { $_.Enabled -eq $true }

# Create local user (admin required)
$Password = Read-Host -AsSecureString "Password"
New-LocalUser -Name "DeployUser" -Password $Password -FullName "Deploy Account" -Description "CI/CD" -PasswordNeverExpires

# Modify / disable / remove
Set-LocalUser -Name "DeployUser" -Password (Read-Host -AsSecureString)
Disable-LocalUser -Name "DeployUser"
Remove-LocalUser -Name "DeployUser"

# Local groups
Get-LocalGroup
Get-LocalGroupMember -Group "Administrators"

# Add / remove user from group
Add-LocalGroupMember -Group "Administrators" -Member "DeployUser"
Remove-LocalGroupMember -Group "Administrators" -Member "DeployUser"
```

**GUI:** **lusrmgr.msc** (Local Users and Groups) — create users, add to groups, set password policy. On **Home** editions this snap-in may be missing; use **net user** or PowerShell instead.

So **how Windows does user management (local)**: **net user** / **net localgroup** (cmd), **Get-LocalUser**, **New-LocalUser**, **Add-LocalGroupMember** (PowerShell), and **lusrmgr.msc** (GUI). For **domain** users and Group Policy, see “Security” below and [Services and networking](./2_Services_And_Networking.md).

---

## Windows Event Log

Windows records system, application, and security events in the **Windows Event Log**. Logs are stored in `.evtx` files and can be read with **Event Viewer** (GUI), **wevtutil** (cmd), or **Get-WinEvent** / **Get-EventLog** (PowerShell). For automation and DevOps, PowerShell is the standard.

### Log types and locations

| Log / channel | Typical content |
|---------------|------------------|
| **System** | Kernel, drivers, service start/stop, hardware. |
| **Application** | Applications and services (e.g. SQL Server, IIS). |
| **Security** | Logon, audit, object access (if auditing enabled). |
| **Setup** | Install and setup events. |
| **ForwardedEvents** | Events collected from other machines (if configured). |

Custom channels live under **Applications and Services Logs**. Paths: `C:\Windows\System32\winevt\Logs\` (evtx files).

### Querying with PowerShell

```powershell
# List available logs
Get-WinEvent -ListLog *

# Recent system log (last 50)
Get-WinEvent -LogName System -MaxEvents 50

# Filter by time and level
Get-WinEvent -LogName System -MaxEvents 100 | Where-Object { $_.TimeCreated -gt (Get-Date).AddHours(-1) }
Get-WinEvent -LogName System -MaxEvents 50 | Where-Object { $_.Level -eq 2 }   # 2 = Error

# Filter by provider (source) and ID
Get-WinEvent -FilterHashtable @{ LogName='System'; Id=7000,7001 } -MaxEvents 20
Get-WinEvent -FilterHashtable @{ LogName='Application'; ProviderName='.NET Runtime' } -MaxEvents 10

# Security log (requires admin; often restricted)
Get-WinEvent -LogName Security -MaxEvents 20

# Export to file (for analysis or forwarding)
Get-WinEvent -LogName System -MaxEvents 1000 | Export-Csv -Path C:\temp\system_events.csv -NoTypeInformation
```

### wevtutil (command line)

```cmd
REM List logs
wevtutil el

REM Query (XML output)
wevtutil qe System /c:10 /f:text

REM Export a log
wevtutil epl System C:\temp\system_backup.evtx

REM Clear a log (use with care)
wevtutil cl System
```

### Common use cases

- **Service failures:** Query **System** log for source **Service Control Manager** (ID 7000, 7001, 7031, 7034).
- **Logons:** **Security** log, IDs 4624 (success), 4625 (failure); parse for account and source IP.
- **Application crashes:** **Application** log by provider (e.g. Application Error, .NET Runtime).
- **Boot and shutdown:** **System** log for kernel and service start/stop around the time of reboot.

---

## Security from the OS view (Windows)

### Group Policy (GPO)

**Group Policy** configures user and computer settings (security, software, network, scripts). Settings are stored in **GPOs** and applied to OUs/sites/domains in Active Directory, or locally via **Local Group Policy** (gpedit.msc on Pro/Enterprise).

**Relevant for single machines and DevOps:**

```powershell
# Resultant policy (what actually applies)
gpresult /r
gpresult /h C:\temp\gpresult.html

# Force policy update
gpupdate /force

# Backup/restore GPO (Group Policy Management; domain)
Backup-GPO -Name "Default Domain Policy" -Path C:\GPO_Backup
Import-GPO -BackupId <id> -TargetName "Restored GPO" -CreateIfNeeded
```

**Common security-related areas:** Account policies (password, lockout), audit policy, user rights assignment, Windows Defender, firewall, software restriction. For domain GPO management, use **Group Policy Management Console (GPMC)** and [Microsoft docs](https://docs.microsoft.com/en-us/windows-server/identity/group-policy/group-policy-overview).

### Windows Defender (antivirus and firewall)

**Windows Defender** includes antivirus (real-time protection, scans) and **Windows Defender Firewall**. Managed via GUI (Windows Security), **Set-MpPreference** (PowerShell), or **Defender** cmdlets.

```powershell
# Defender status
Get-MpComputerStatus
Get-MpThreatDetection

# Firewall (see also topic 2)
Get-NetFirewallProfile
Get-NetFirewallRule | Where-Object { $_.Enabled -eq 'True' }
New-NetFirewallRule -DisplayName "Allow App" -Direction Inbound -Program "C:\App\app.exe" -Action Allow
```

**Exclusions** (e.g. for build or backup paths): `Add-MpPreference -ExclusionPath "C:\Build"`. Use sparingly and document.

### Auditing (security events)

**Audit policy** controls what is written to the **Security** log (logon, object access, privilege use, etc.). Configure via **Local Security Policy** (secpol.msc) or Group Policy: **Computer Configuration → Windows Settings → Security Settings → Advanced Audit Policy**.

```powershell
# Audit policy (view; setting often via GPO or secpol)
auditpol /get /category:*
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
```

**Event IDs** (examples): 4624/4625 (logon), 4648 (explicit credentials), 4663 (object access), 4672 (admin logon). Use **Get-WinEvent** with filters to query Security log; forward to SIEM or central logging for compliance.

---

## WSL (Windows Subsystem for Linux) in depth

**WSL** lets you run a Linux environment (kernel interface + userland) on Windows. **WSL 2** uses a lightweight VM and a real Linux kernel; **WSL 1** used a translation layer. For DevOps, WSL 2 is preferred (full Linux compatibility, system calls, Docker Desktop integration).

### Install and manage (PowerShell, admin)

```powershell
# List distros and version
wsl -l -v

# Set default WSL version (2 recommended)
wsl --set-default-version 2

# Install a distro (e.g. Ubuntu from Store or command)
wsl --install
wsl --install -d Ubuntu
wsl --install -d Debian

# Set default distro
wsl --set-default Ubuntu

# Shutdown WSL (all distros)
wsl --shutdown

# Unregister (remove) a distro
wsl --unregister Ubuntu
```

### Running Linux commands and scripts

```powershell
# Run a single command (default distro)
wsl ls -la
wsl bash -c "echo $HOME"

# Run in a specific distro
wsl -d Debian -- cat /etc/os-release

# Run a script
wsl bash -c "cd /home/user && ./script.sh"

# Enter default distro shell
wsl
```

From **inside WSL** you have a normal Linux shell (bash, etc.): `apt`/`dnf`, `systemd` (in WSL 2 with recent builds), SSH, Docker (if Docker Desktop uses WSL 2 backend). The Linux filesystem is separate; Windows drives are mounted under `/mnt/c`, `/mnt/d`, etc.

### File system and networking

- **Linux files** are stored in the distro’s virtual disk (e.g. `%LOCALAPPDATA%\Packages\...\LocalState\ext4.vhdx`). Access from Windows: `\\wsl$\Ubuntu\home\user`.
- **Windows files** from Linux: `/mnt/c/Users/...`. Performance for heavy I/O is often better when project files live in the WSL filesystem and you run tools (git, build) inside WSL.
- **Networking:** WSL 2 has a virtual NIC; localhost forwarding is supported so you can reach Windows services from WSL and WSL services from Windows (localhost). With **mirrored networking** (newer builds), Windows and WSL share the same network identity.

### WSL and DevOps

- **Same shell and tools as Linux:** Use Bash, Python, Node, Docker (via Docker Desktop WSL 2 backend), kubectl, Terraform inside WSL so scripts match Linux CI and servers.
- **Git:** Run git inside WSL for consistent line endings and behavior; clone repos under the WSL filesystem (e.g. `~/projects`) for best performance.
- **SSH:** Use the Linux OpenSSH inside WSL; agent and keys in `~/.ssh` work as on Linux.
- **Containers:** Docker Desktop can use the WSL 2 engine; build and run Linux containers without a separate Linux VM.

---

## Summary

- **User management (local):** **net user**, **net localgroup** (cmd); **Get-LocalUser**, **New-LocalUser**, **Set-LocalUser**, **Add-LocalGroupMember**, **Get-LocalGroupMember** (PowerShell); **lusrmgr.msc** (GUI). Domain users are in Active Directory; local users are per-machine.
- **Event Log:** **Get-WinEvent** and **Get-EventLog** (PowerShell), **wevtutil** (cmd); System, Application, Security logs; filter by time, level, provider, ID for troubleshooting and audit.
- **Security:** **Group Policy** (gpresult, gpupdate; GPO for domain); **Windows Defender** and firewall; **Audit policy** for Security log; use with central logging/SIEM for compliance.
- **WSL:** **WSL 2** for full Linux; install and manage with `wsl --install`, `wsl -l -v`, `wsl --shutdown`; run Linux commands and scripts from PowerShell; use for Bash, Docker, git, and parity with Linux DevOps.

---

## Further reading

- [Microsoft: Get-WinEvent](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent), [wevtutil](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil)
- [Microsoft: Group Policy](https://docs.microsoft.com/en-us/windows-server/identity/group-policy/group-policy-overview)
- [Microsoft: Windows Defender](https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/)
- [Microsoft: WSL](https://docs.microsoft.com/en-us/windows/wsl/), [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/compare-versions)
