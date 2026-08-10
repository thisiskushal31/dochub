# Network and process recon commands for ops and security

[← Back to Shell](./README.md)

## What this chapter covers

Ops and security **recon literacy** with beginner-clear explanations: how `ss` / `netstat` (from chapter **23**) fit real workflows; `lsof -i` flag meanings; `ps` / `pgrep` / `kill`; common `curl -v` / `-I` flags; PowerShell `Get-NetTCPConnection`, `Get-Process`, `Test-NetConnection` with parameters explained; living-off-the-land awareness (what defenders and attackers both look for—**literacy, not exploits**); WSL host-vs-guest port views; and BusyBox gaps. Expand every flag cluster before you run it.

---

## 1. Concepts (basic)

### 1. Recon as a workflow, not a meme

**Recon** here means answering inventory questions on a machine you are allowed to inspect:

- What is listening on the network?  
- Which process owns that socket?  
- Is the process expected?  
- Can this host reach a dependency?  
- What does an HTTP endpoint return at a high level?

Ops uses the same commands during incidents. Security uses them during investigations and hardening reviews. The commands are dual-use; **authorization and intent** separate roles. This chapter teaches reading and using the tools—not building attack chains.

### 2. `ss` / `netstat` in recon workflows

From chapter **23**, expand clusters before running:

```bash
ss -tulpn
```

| Flag | Meaning |
|------|---------|
| `-t` | TCP |
| `-u` | UDP |
| `-l` | Listening only |
| `-p` | Process |
| `-n` | Numeric |

Workflow:

1. List listening sockets.  
2. Note address (`127.0.0.1` vs `0.0.0.0` vs `::`).  
3. Map port → process (`-p`).  
4. Compare to expected services.  
5. For established connections, drop `-l` or use additional `ss` filters as documented in `ss` help.

```bash
ss -tulpn
```

```bash
# TCP listeners only, numeric, with process
ss -ntlp
```

If `ss` is missing, try `netstat` with the same letter discipline—or switch OS toolkit (PowerShell below).

| Binding | Recon reading |
|---------|----------------|
| `127.0.0.1:PORT` | Local only—less internet exposure; still relevant on multi-user hosts |
| `0.0.0.0:PORT` | All IPv4 interfaces—internet-facing if security groups allow |
| `[::]:PORT` | IPv6 all interfaces—do not ignore |

### 3. `lsof -i` — list open files that are network sockets

**`lsof`** means **list open files**. On Unix, sockets are files. `-i` selects Internet sockets.

```bash
lsof -i
```

Common flags:

| Flag | Meaning |
|------|---------|
| `-i` | Internet sockets (network) |
| `-iTCP` | Only TCP |
| `-iUDP` | Only UDP |
| `-i :443` | Something using port 443 |
| `-i TCP:22` | TCP port 22 |
| `-n` | No host name DNS resolution (numeric hosts) |
| `-P` | No port name resolution (numeric ports) |
| `-p PID` | Only this process ID |
| `-u user` | Only this user |

```bash
lsof -nP -iTCP -sTCP:LISTEN
```

Mental expansion:

| Piece | Meaning |
|-------|---------|
| `-n` | Numeric hosts |
| `-P` | Numeric ports |
| `-iTCP` | TCP only |
| `-sTCP:LISTEN` | TCP state LISTEN |

```bash
lsof -nP -i :8080
```

Cross-OS:

| Environment | `lsof` |
|-------------|--------|
| Linux | Often present; install package if missing |
| macOS | Present |
| BusyBox | Often **missing** |
| Windows | Not native—use PowerShell / Resource Monitor ideas |
| WSL | Linux `lsof` sees **WSL’s** network namespace (see WSL note) |

### 4. Processes: `ps`, `pgrep`, `kill`

**List**

```bash
ps aux
```

| Letter (`ps aux`) | Meaning |
|-------------------|---------|
| `a` | Broad set of processes |
| `u` | User-oriented columns |
| `x` | Include daemons without TTY |

```bash
ps -ef
```

| Flag | Meaning (UNIX style) |
|------|----------------------|
| `-e` | Every process |
| `-f` | Full format |

**Find by name**

```bash
pgrep -a sshd
```

| Flag | Meaning |
|------|---------|
| `-a` | Show full command line (where supported) |
| `-l` | Show process name (variant behavior—check help) |
| `-u user` | Only this user’s processes |
| `-f` | Match against full command line |

```bash
pgrep -u "$USER" -af nginx
```

**Signal a process**

```bash
kill PID
```

```bash
kill -TERM PID
```

```bash
kill -KILL PID
```

| Signal | Meaning |
|--------|---------|
| `TERM` (15) | Politely ask to exit (default for `kill`) |
| `HUP` (1) | Often “reload config” for daemons—confirm per service |
| `KILL` (9) | Force kill; cannot be caught—last resort |

```bash
kill -TERM "$(pgrep -f 'my-service')"
```

Prefer precise PIDs from `pgrep`/`ss -p` over wild killing. On systemd hosts, prefer service unit restarts when managing owned services—`kill` is the sharp tool.

Security: on shared hosts, killing others’ processes requires privilege and authorization. Unauthorized disruption is an incident, not “recon.”

### 5. `curl` for HTTP recon: `-v` and `-I`

**`curl`** transfers URLs. For recon literacy, two habits matter: headers-only and verbose.

```bash
curl -I https://example.com
```

| Flag | Meaning |
|------|---------|
| `-I` | Fetch **headers only** (HTTP HEAD by default for HTTP(S)) |
| `-v` | **Verbose**: shows request/response headers and connection details on stderr |
| `-s` | Silent progress meter |
| `-S` | Show errors even when `-s` |
| `-f` | Fail on HTTP error statuses |
| `-L` | Follow redirects |
| `-o file` | Write body to file |
| `-w` | Write-out format after completion (advanced) |
| `-k` | Insecure TLS (skip verify)—**dangerous**; lab only with eyes open |

```bash
curl -vI https://example.com
```

Read: TLS handshake notes, HTTP status, server headers, redirects. Do not dump verbose output with auth headers into public tickets.

```bash
curl -fsSL -o /dev/null -w '%{http_code}\n' https://example.com
```

| Write-out | Meaning |
|-----------|---------|
| `%{http_code}` | Numeric HTTP status |

Illustrative only—use hosts you are allowed to probe. Port scanning and aggressive probing of systems without authorization is out of scope and often illegal.

### 6. PowerShell: `Get-NetTCPConnection`

```powershell
Get-NetTCPConnection
```

Useful parameters:

| Parameter | Meaning |
|-----------|---------|
| `-State Listen` | Listening sockets only |
| `-LocalPort 443` | Filter local port |
| `-RemoteAddress x.x.x.x` | Filter remote peer |
| `-OwningProcess PID` | Filter by process ID |

```powershell
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort, OwningProcess
```

Map process ID to name:

```powershell
Get-NetTCPConnection -State Listen |
  Select-Object LocalPort, OwningProcess,
    @{n='Name';e={ (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName }}
```

| Environment | Availability |
|-------------|--------------|
| Windows PowerShell 5.1 / PS 7 on Windows | `Get-NetTCPConnection` (NetTCPIP module) |
| `pwsh` on Linux/macOS | **Not the same**—use `ss`/`lsof` on Unix |
| Restricted sessions | Module may be limited by policy |

### 7. PowerShell: `Get-Process`

```powershell
Get-Process
```

```powershell
Get-Process -Name nginx -ErrorAction SilentlyContinue
```

| Parameter | Meaning |
|-----------|---------|
| `-Name` | Process name (without `.exe` often) |
| `-Id` | PID |
| `-IncludeUserName` | Show user (may need elevation) |

Stop (analogous to kill—authorized use only):

```powershell
Stop-Process -Id 1234 -WhatIf
```

| Parameter | Meaning |
|-----------|---------|
| `-Id` | PID |
| `-Force` | Force termination |
| `-WhatIf` | Show what would happen without doing it |

### 8. PowerShell: `Test-NetConnection`

```powershell
Test-NetConnection example.com -Port 443
```

| Parameter | Meaning |
|-----------|---------|
| `-ComputerName` / positional host | Target host |
| `-Port` | TCP port to test |
| `-InformationLevel Detailed` | More detail |
| `-DiagnoseRouting` | Routing diagnostics (heavier) |

```powershell
Test-NetConnection example.com -Port 443 -InformationLevel Detailed
```

Beginner reading: `TcpTestSucceeded : True/False` answers “can I open TCP to that port from here?” DNS and ICMP ping behavior can differ by environment—read the fields you care about; do not assume ping failure means TCP failure.

### 9. Living-off-the-land (LOL) literacy

**Living-off-the-land** means using tools **already present** on a system (shells, `curl`, PowerShell, `ss`, `wmic` legacy, etc.) instead of dropping new malware binaries. Defenders hunt for unusual use of these tools. Attackers prefer them to blend in.

| Shared interest | Defender question | Attacker interest (awareness only) |
|-----------------|-------------------|--------------------------------------|
| Listening ports | Unexpected exposure? | Find services |
| Process list | Unknown binary path? | Find security tools / soft targets |
| `curl` / `Invoke-WebRequest` | Unexpected egress? | Fetch payloads |
| PowerShell | Encoded commands / odd parent process? | Automation without new EXE |

Staff habit: inventory **normal** use of these commands in your environment so abnormal use stands out. Do not practice exploit tradecraft on systems you do not own.

### 10. WSL note: Windows host vs Linux view of ports

WSL (especially WSL2) has a distinct network namespace from the Windows host.

| View | What you see |
|------|----------------|
| Inside WSL (`ss`, `lsof`) | Listeners inside the **Linux** distro |
| Windows (`Get-NetTCPConnection`) | Listeners on the **Windows** host |
| Published container ports | Yet another namespace (Docker/Podman) |

A service listening in WSL may be reachable from Windows via localhost forwarding rules that change across WSL versions. A Windows service is invisible to `ss` inside WSL. **Recon both sides** when debugging “port already in use” or “cannot connect” on developer machines.

```bash
# Inside WSL
ss -ntlp
```

```powershell
# On Windows host
Get-NetTCPConnection -State Listen | Where-Object LocalPort -eq 8080
```

### 11. BusyBox gaps

| Tool | BusyBox / minimal Alpine reality |
|------|----------------------------------|
| `ss` | Often **missing** unless `iproute2` installed |
| `lsof` | Often **missing** |
| `pgrep` | Sometimes present as applet; flags limited |
| `netstat` | Limited applet |
| `curl` | May be missing; `wget` applet may exist instead |
| `ps` | Present; fewer columns/flags |
| `kill` | Present |

Recon runbooks for IoT/edge must list the **actual** applet set. Chapter **20** deepens distro/userland honesty.

### 12. Security notes (recon-specific)

- `-p` / process columns disclose service inventory—scrub for public posts.  
- Verbose `curl -v` can leak `Authorization` headers if you sent them—redact.  
- `kill -KILL` on production without change control causes outages.  
- Unauthorized scanning and exploitation are out of scope; obtain written permission.  
- Shared jump hosts: your recon output may be visible in shell history—prefer careful hygiene (later security chapter).

---

## 2. Advanced concepts

### 1. Connecting the toolkit end-to-end

Typical authorized host checklist:

1. `ss -tulpn` or `Get-NetTCPConnection -State Listen`  
2. PID → `ps` / `Get-Process`  
3. Binary path confirmation (`readlink` / `Get-Process` path fields)  
4. Config location per service knowledge  
5. Egress smoke: `curl -I` or `Test-NetConnection` to a known dependency  

Automate only after the manual expand-and-read habit is solid.

### 2. Established connections vs listeners

Listeners answer “what do we offer?” Established connections answer “who are we talking to?” Both matter in incident response. `ss` without `-l` (or with state filters) shows connections; learn filters from `ss` help when you need them.

```bash
ss -tnp
```

| Flag | Meaning |
|------|---------|
| `-t` | TCP |
| `-n` | Numeric |
| `-p` | Process |

### 3. Name resolution noise

`-n` / `-P` / `-nP` reduce DNS and `/etc/services` lookups. During incidents, numeric output is faster and avoids DNS delays or misleading names. Resolve deliberately afterward if needed.

### 4. Containers and PID namespaces

Inside a container, `ss` and `ps` see **that namespace**. Host recon needs host context (or orchestrator APIs). Do not conclude “nothing listens on 443” from inside an app container when the ingress listens on the host or load balancer.

### 5. macOS differences

| Linux habit | macOS note |
|-------------|------------|
| `ss -tulpn` | `ss` often **absent**—use `netstat`/`lsof` with macOS flags |
| `netstat -tulpn` | **Different** flag language—read local `man` |
| `lsof -i` | Strong option on macOS |
| `pgrep`/`kill` | Available |

### 6. Cross-OS matrix (recon)

| Question | Linux | macOS | Windows | BusyBox |
|----------|-------|-------|---------|---------|
| Listeners | `ss` / `netstat` | `lsof` / `netstat` | `Get-NetTCPConnection` | Limited `netstat`/`ps` |
| Process | `ps`/`pgrep` | `ps`/`pgrep` | `Get-Process` | `ps` |
| HTTP headers | `curl -I` | `curl -I` | `curl.exe` or `Invoke-WebRequest` | Maybe `wget` |
| TCP test | `curl`/`nc` variants | same | `Test-NetConnection` | Limited |

### 7. `Invoke-WebRequest` sketch (PowerShell)

```powershell
Invoke-WebRequest -Uri https://example.com -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue |
  Select-Object StatusCode, Headers
```

| Parameter | Meaning |
|-----------|---------|
| `-Uri` | Target URL |
| `-Method Head` | Headers-oriented probe |
| `-MaximumRedirection` | Limit follows |

Prefer official docs for auth and certificate parameters; never disable TLS validation in production scripts without an explicit risk acceptance.

---

## 3. Applications and use cases

### Incident: service down

1. Is the process up? (`pgrep` / `Get-Process`)  
2. Is it listening? (`ss -ntlp` / `Get-NetTCPConnection -State Listen`)  
3. Does local curl to `127.0.0.1:PORT` work?  
4. Does remote test from a peer work? (`Test-NetConnection` / `curl -I`)  
5. Firewall / security group / WSL namespace mismatch?

### Hardening review

- List all `0.0.0.0` / `[::]` listeners.  
- Demand owners for each port.  
- Remove or bind to localhost when public exposure is unnecessary.

### CI agent hygiene

- Agents should not expose random debug ports.  
- Smoke-test egress with allowlisted destinations only.

### Security engineering (defensive)

- Baseline normal `curl`/`pwsh` usage in telemetry.  
- Treat encoded PowerShell + unexpected network as high signal.  
- Teach juniors LOL **awareness** without a how-to-attack lab on production.

### Staff-level review checklist

- Engineers expand `ss`/`netstat`/`lsof`/`curl` flags before production use.  
- Runbooks include Linux **and** Windows commands where both estates exist.  
- WSL dual-view is documented for developer support.  
- BusyBox/edge images have a reduced recon cheat sheet proven on twin hardware.  
- Evidence scrubbing for process and auth headers is part of IR templates.  
- `kill` / `Stop-Process` usage follows change control on shared production.  
- LOL content stays literacy-focused; no exploit recipes in internal handbooks.  
- Authorization to probe is explicit for non-owned systems.

---

## References

- [ss(8)](https://man7.org/linux/man-pages/man8/ss.8.html)
- [netstat(8)](https://man7.org/linux/man-pages/man8/netstat.8.html)
- [lsof(8)](https://man7.org/linux/man-pages/man8/lsof.8.html)
- [ps(1)](https://man7.org/linux/man-pages/man1/ps.1.html)
- [pgrep(1)](https://man7.org/linux/man-pages/man1/pgrep.1.html)
- [kill(1)](https://man7.org/linux/man-pages/man1/kill.1.html)
- [curl(1)](https://man7.org/linux/man-pages/man1/curl.1.html)
- [Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
- [Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process)
- [Stop-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/stop-process)
- [Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)
- [Invoke-WebRequest](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest)
- [WSL networking](https://learn.microsoft.com/en-us/windows/wsl/networking)
- [BusyBox](https://busybox.net/)
- [iproute2](https://wiki.linuxfoundation.org/networking/iproute2)
