# Services and networking

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

On Windows, **services** are long-running programs that run in the background (often before a user logs in). **Networking** is configured and inspected via GUI, cmd, or PowerShell. This topic covers managing services and common networking tasks from the command line for DevOps and automation.

---

## Windows services

A **Windows service** runs in the background under the Service Control Manager (SCM). Services start at boot (or on demand), run under a specific account, and have no interactive desktop.

---

## Managing services: Command Prompt and PowerShell

**Command Prompt (sc):**

```cmd
REM List services
sc query state= all

REM Start / stop / query one service
sc start ServiceName
sc stop ServiceName
sc query ServiceName

REM Configuration (start type: auto, demand, disabled)
sc config ServiceName start= auto
```

**PowerShell (preferred for scripts):**

```powershell
# List services
Get-Service
Get-Service | Where-Object { $_.Status -eq 'Running' }

# Start, stop, restart
Start-Service -Name "ServiceName"
Stop-Service -Name "ServiceName" -Force
Restart-Service -Name "ServiceName" -Force

# Service details and dependencies
Get-Service -Name "ServiceName" | Format-List *
Get-Service -Name "ServiceName" -DependentServices

# Set start type (Automatic, Manual, Disabled)
Set-Service -Name "ServiceName" -StartupType Automatic
```

---

## Networking: essential commands

**Command Prompt:**

```cmd
ipconfig
ipconfig /all
ipconfig /release
ipconfig /renew
ping hostname
tracert hostname
nslookup domain
netstat -an
```

**PowerShell:**

```powershell
# IP configuration
Get-NetIPConfiguration
Get-NetIPAddress

# Test connectivity
Test-NetConnection -ComputerName hostname -Port 443
Test-Connection hostname

# DNS
Resolve-DnsName domain.com
nslookup domain.com

# Listening ports and connections
Get-NetTCPConnection -State Listen
netstat -an
```

---

## Firewall (Windows Defender Firewall)

From PowerShell (admin):

```powershell
# Profile status (Domain, Private, Public)
Get-NetFirewallProfile
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True

# List enabled rules
Get-NetFirewallRule | Where-Object { $_.Enabled -eq 'True' } | Format-Table DisplayName, Direction, Action

# Allow inbound port
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# Allow by program path
New-NetFirewallRule -DisplayName "Allow MyApp" -Direction Inbound -Program "C:\App\myapp.exe" -Action Allow

# Allow WinRM (remoting)
Enable-NetFirewallRule -DisplayGroup "Windows Remote Management"

# Remove rule
Remove-NetFirewallRule -DisplayName "Allow HTTP"
```

---

## Cross-platform workflows (Linux + Windows)

In mixed environments (e.g. CI/CD, hybrid cloud):

- **Same scripts** — Use PowerShell 7 on both Windows and Linux where possible, or Bash in WSL on Windows to match Linux agents.
- **Agents** — Windows build/agent machines run PowerShell or batch; Linux runners run Bash. Keep scripts in one language per pipeline or use a cross-platform runtime (e.g. Python, Node) if needed.
- **SSH** — Windows has OpenSSH server/client; use SSH for remote execution and file copy (e.g. from Linux to Windows) so one workflow works both ways.
- **Containers** — Windows Server containers or Linux containers on Windows (via WSL2/Docker) can align app and tooling with Linux-based production.

```powershell
# Check SSH (Windows)
Get-Service sshd
# From Linux: ssh user@windows-host "powershell -Command \"Get-Service\""
```

---

## Summary

- **Services**: managed with `sc` (cmd) or `Get-Service`, `Start-Service`, `Stop-Service`, `Set-Service` (PowerShell).
- **Networking**: `ipconfig`, `ping`, `nslookup`, `netstat` (cmd); `Get-NetIPConfiguration`, `Test-NetConnection`, `Resolve-DnsName`, `Get-NetTCPConnection` (PowerShell).
- **Firewall**: `Get-NetFirewallProfile`, `Get-NetFirewallRule`, `New-NetFirewallRule` (PowerShell, admin).
- **Cross-platform**: Use PowerShell 7, WSL, SSH, or containers to align Windows with Linux-based DevOps workflows.

---

## More Windows administration (reference)

For deeper administration, use these in PowerShell (often require admin):

- **Access control (ACL):** `Get-Acl`, `Set-Acl` on files and registry keys; `icacls` from cmd for inheritance and reset.
- **BitLocker:** `Enable-BitLocker`, `Get-BitLockerVolume`, `Suspend-BitLocker`.
- **Certificates:** `Get-ChildItem Cert:\CurrentUser\My`, `Cert:\LocalMachine\My`; `Export-Certificate`, `Import-Certificate`.
- **Group Policy:** `gpresult /r`, `gpupdate /force`; backup with `Backup-GPO` (GPMC).
- **Event log:** See [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md) for **Get-WinEvent**, **wevtutil**, and Security/System/Application logs.

See [PowerShell documentation](https://docs.microsoft.com/en-us/powershell/) and [SS64 PowerShell](https://ss64.com/ps/) for a full A–Z command reference.

---

## Further reading

- [Microsoft: Service Control Manager](https://docs.microsoft.com/en-us/windows/win32/services/service-control-manager)
- [PowerShell: Get-Service, Start-Service, Stop-Service](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/)
- [Windows networking cmdlets](https://docs.microsoft.com/en-us/powershell/module/nettcpip/)
- [Windows Firewall with PowerShell](https://docs.microsoft.com/en-us/powershell/module/netsecurity/)
