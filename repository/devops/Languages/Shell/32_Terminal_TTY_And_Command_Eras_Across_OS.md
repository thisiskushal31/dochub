# Terminal, TTY, and command eras across OS and distros

[← Back to Shell](./README.md)

## What this chapter covers

How to go from **opening a terminal for the first time** to **running the right commands on any era of host**—early Unix habits still seen in brownfield, classic GNU/Linux desktops and servers, Debian/`dash`, RHEL Bash-as-`sh`, Alpine/BusyBox, modern containers, macOS (pre-Catalina Bash → Catalina+ zsh), and Windows (`cmd` → Windows PowerShell 5.1 → PowerShell 7 + Windows Terminal).

Pair with the **Master Command Atlas** (**27**) for *which* command, depth chapters (**14–15**, **28–31**) for *how*, and distro `/bin/sh` detail (**20**). This chapter is the **timeline + terminal stack + progressive curriculum** so nothing between “hello world” and “staff review on a 2008 box / 2026 image” is a mystery.

Every major idea below ends with a **commented command** and a **breakdown** of what you just ran.

---

## If you are brand new (do this today)

1. Open a **terminal app** (not “the internet”).
2. Notice a **prompt** — that means a **shell** is waiting.
3. Type a **command**, press Enter, read the reply.
4. Learn the stack names below so tickets stop saying “terminal is broken” when `PATH` is wrong.

```bash
# --- Stage 0 identity kit (Unix / macOS / WSL / Git Bash) ---
pwd                 # Print Working Directory — where am I?
whoami              # Print the account name this shell is using
uname -s            # Print the kernel/OS family name (Linux, Darwin, …)
echo "$SHELL"       # Preferred login shell path (may differ from *this* process)
```

**Breakdown**

| Command | What it does | What you learn |
|---------|--------------|----------------|
| `pwd` | Asks the shell for the current directory | Your “place” on disk |
| `whoami` | Prints the effective user name | Who the OS thinks you are |
| `uname -s` | Prints the system name | Linux vs Darwin (macOS) vs others |
| `echo "$SHELL"` | Expands and prints `$SHELL` | Preferred login shell—not always the running binary |

```powershell
# --- Stage 0 identity kit (PowerShell 7 or Windows PowerShell 5.1) ---
Get-Location                    # Analog of pwd — current location object
whoami                          # Windows whoami.exe (or alias) — account
$PSVersionTable.PSVersion       # Exact PowerShell version (5.1 vs 7.x)
$Host.Name                      # Which host is running PS (ConsoleHost, etc.)
```

**Breakdown:** `Get-Location` is a **cmdlet** (PowerShell command). `$PSVersionTable` is a built-in variable. `$Host.Name` tells you the **host application**, not the OS—Windows Terminal can host several shells.

```bat
REM --- Stage 0 identity kit (cmd.exe) ---
CD
whoami
VER
ECHO %ComSpec%
```

**Breakdown:** `CD` with no args prints the current directory in cmd. `%ComSpec%` is usually `C:\Windows\system32\cmd.exe`—the cmd interpreter path.

---

## 1. Concepts — the stack you must never confuse

### 1. Terminal emulator ≠ shell ≠ commands ≠ kernel

| Layer | What it is | Examples | If this breaks… |
|-------|------------|----------|-----------------|
| **Hardware / console** | Keyboard + display path into the OS | Laptop keyboard, serial console, hypervisor console | No input at all |
| **TTY / PTY** | Kernel terminal device | `/dev/tty`, `/dev/pts/N` | `tty` fails; job control odd |
| **Terminal emulator** | GUI/app that draws a PTY | GNOME Terminal, iTerm2, Windows Terminal, `conhost`, tmux pane | Fonts/keys/scrollback; shell may still be fine over SSH |
| **Shell** | Command interpreter | Bash, dash, zsh, `pwsh`, `cmd` | Syntax, builtins, startup files |
| **Commands** | Builtins + externals on `PATH` | `ls`, `Get-ChildItem`, `curl` | “command not found”; wrong userland |
| **Kernel / OS** | Process, files, network | Linux, Darwin, Windows NT | Permissions, drivers, networking |

**Staff sentence:** “Fix the **command/userland**,” not “fix the terminal,” unless the emulator or TTY is actually broken.

```bash
# --- Prove which layer you are looking at ---
tty                                 # Print the TTY device for this session (fails in some CI)
ps -p $$ -o args=                   # Show argv of *this* shell process ($$ = shell PID)
# On Linux, also:
# ls -l /proc/$$/exe                # Symlink to the real shell binary (bash, dash, busybox, …)
```

**Breakdown**

| Piece | Meaning |
|-------|---------|
| `tty` | “Which terminal device am I attached to?” — emulator/SSH layer |
| `$$` | Special parameter: PID of the current shell |
| `ps -p $$` | Ask `ps` about that PID only |
| `-o args=` | Print the command line (no header) |
| `/proc/$$/exe` | Linux-only: canonical executable for this process |

```powershell
# PowerShell: process identity (not a Unix TTY model)
$PID                                # This PowerShell process ID
(Get-Process -Id $PID).ProcessName  # pwsh vs powershell
$Host.UI.RawUI                      # Host UI capabilities (emulator-ish)
```

### 2. Progressive curriculum (basic → advanced)

Use this as a **ladder**. Do not skip rungs on a new OS.

| Stage | Goal | Commands / skills to own | Chapters |
|-------|------|--------------------------|----------|
| **0 — Doorway** | Survive the prompt | `pwd`, `ls`/`Get-ChildItem`, `cd`, `echo`/`Write-Output`, `clear`/`CLS`, `exit` | **00**, **27** |
| **1 — Files** | Move data safely | `cp`/`mv`/`rm`/`mkdir`, `cat`/`Get-Content`, `chmod` basics | **14** |
| **2 — See the machine** | Identity + disk + OS | `whoami`/`id`, `uname`/`hostname`, `df`/`du`, `date`, `env` | **29** |
| **3 — Find & filter** | Search without panic | `find`, `grep`/`Select-String`, `head`/`tail`, `wc` | **15** |
| **4 — Shape text** | Pipelines | `\|`, `>`, `cut`/`sort`/`uniq`, `tee`, `sed` lite | **08**, **15** |
| **5 — Processes** | What is running | `ps`/`Get-Process`, `kill`/`Stop-Process`, `top` literacy | **14**, **25** |
| **6 — Package & fetch** | Move bytes | `tar`/`gzip`, `sha256sum`/`Get-FileHash`, `curl`/`IWR` | **30** |
| **7 — Script the recipe** | Non-interactive | shebang, `set -euo pipefail`, `param()`, exit codes | **03**, **06**, **16**, **12** |
| **8 — Dialect honesty** | Portability | dash vs Bash vs BusyBox; PS 5.1 vs 7; BSD vs GNU flags | **10**, **20**, **02** |
| **9 — Builtins mastery** | Current-shell effects | `export`, `read`, `trap`, `type`, `getopts` | **28** |
| **10 — Staff** | Review & eras | Atlas **27**, eras below, security **18**, wrap **26** | **22**, **21**, **32** (this ch) |

```bash
# --- Stage 0→1 mini-lab (safe scratch dir) ---
mkdir -p "$HOME/shell-lab/out"   # -p: create parents; OK if exists
cd -- "$HOME/shell-lab"          # -- : protect paths that start with -
printf 'hello\n' > out/a.txt     # Write bytes to a file (prefer printf over echo)
cat out/a.txt                    # Print file contents to the terminal
ls -la out                       # Long listing (-l) including hidden (-a) of out/
```

**Breakdown:** `mkdir -p` creates nested dirs. `cd --` is the safe form of change-directory. `printf` is portable printing. `cat` streams a file to stdout. `ls -la` is **l**ong + **a**ll (decode habit: chapter **23**).

```powershell
# --- Same Stage 0→1 lab in PowerShell ---
New-Item -ItemType Directory -Force -Path "$HOME/shell-lab/out" | Out-Null
Set-Location -LiteralPath "$HOME/shell-lab"
Set-Content -Path .\out\a.txt -Value 'hello' -Encoding utf8
Get-Content -Path .\out\a.txt
Get-ChildItem -Force .\out
```

**Breakdown:** `-LiteralPath` avoids wildcard surprises. `-Force` on `New-Item` creates parents as needed. `Out-Null` discards the directory object so the lab stays quiet.

### 3. One lab that works on every OS family

| Task | Linux/macOS Bash | PowerShell 7 | cmd (legacy) |
|------|------------------|--------------|--------------|
| Where am I? | `pwd` | `Get-Location` | `CD` |
| Who am I? | `id -un` | `whoami` | `whoami` |
| List files | `ls -la` | `Get-ChildItem -Force` | `DIR /A` |
| Make folder | `mkdir -p out` | `New-Item -ItemType Directory out -Force` | `MD out` |
| Write file | `printf 'hi\n' > out/a.txt` | `Set-Content out\a.txt hi` | `ECHO hi> out\a.txt` |
| Show file | `cat out/a.txt` | `Get-Content out\a.txt` | `TYPE out\a.txt` |
| OS name | `uname -s` | `$PSVersionTable` / `[Environment]::OSVersion` | `VER` |

Run the column for **your** host first; then run a second column on a foreign agent (WSL, cloud image, or teammate’s OS).

```bash
# --- Copy-paste: full Unix column as one script ---
set -e                                   # Stop on first failing command (Bash)
echo "cwd=$(pwd)"
echo "user=$(id -un)"                    # -u UID selector, -n print name
echo "os=$(uname -s)/$(uname -m)"        # system + machine arch
mkdir -p out
printf 'hi\n' > out/a.txt
ls -la out
cat out/a.txt
```

```powershell
# --- Copy-paste: full PowerShell column ---
Write-Output "cwd=$((Get-Location).Path)"
Write-Output "user=$(whoami)"
Write-Output "ps=$($PSVersionTable.PSVersion)"
New-Item -ItemType Directory -Force -Path .\out | Out-Null
Set-Content -Path .\out\a.txt -Value 'hi'
Get-ChildItem -Force .\out
Get-Content .\out\a.txt
```

---

## 2. Command eras — Unix/Linux (landmarks, not every micro-release)

### 1. Timeline of the command surface

| Era | Rough landmark | What operators inherit today |
|-----|----------------|------------------------------|
| **Classic Unix / early Linux** | Bourne `sh`, early GNU tools arriving | `#!/bin/sh` culture; simple pipelines; `ps`/`kill` literacy |
| **GNU userland dominance** | GNU coreutils + Bash as everyday Linux scripting | Long options (`--help`); rich `ls`/`cp`/`find`; Bashisms everywhere |
| **Dash as Debian/Ubuntu `/bin/sh`** | Ubuntu 6.10 era efficiency; Debian later default dash | `#!/bin/sh` **must** be POSIX; Bash still interactive default often |
| **BusyBox / embedded / Alpine** | Tiny multicall applets | Same **names**, fewer **flags**; ash as `sh` |
| **net-tools → iproute2** | `ifconfig`/`netstat` aging; `ip`/`ss` modern Linux | Brownfield still has `ifconfig`; new Linux docs prefer `ip`/`ss` (**25**) |
| **Containers as default servers** | Docker/K8s images | Minimal `PATH`; often no `man`; prove tools in **this** image |
| **Modern Bash 5 / PS 7 coexistence** | Mixed estates | Pin versions (**02**); never assume laptop = CI |

### 2. Distro command-routing matrix (prove, don’t assume)

| Distro / image class | Typical interactive shell | `/bin/sh` | Userland | Command habit |
|----------------------|---------------------------|-----------|----------|---------------|
| **Debian / Ubuntu** | Bash | **dash** | GNU | Write portable `sh` for maintainer scripts; Bash for app automation with `#!/usr/bin/env bash` |
| **RHEL / Fedora / Alma / Rocky / Amazon Linux** | Bash | Often **Bash** (POSIX-ish) | GNU | Bashisms may “work under `sh`” here and **fail** on Debian CI |
| **SUSE / openSUSE** | Bash | Check `readlink -f /bin/sh` | GNU | Same honesty as RHEL |
| **Arch** | Bash (user choice varies) | Usually Bash | GNU | Rolling packages—pin in CI images |
| **Alpine** | ash / optional Bash | **BusyBox ash** | **BusyBox** | Install `bash` **and** `coreutils`/`findutils`/`grep`/`sed` if you need GNU |
| **Distroless / scratch+static** | Often **no shell** | N/A | Almost none | Debug with a sidecar or temporary shell image |
| **Old RHEL 5/6 / CentOS 6 estates** | Bash 3/4-era | Bash | Older GNU | Avoid Bash 4+ / modern `ss`-only runbooks without fallbacks (**21**) |
| **WSL2 Ubuntu** | Bash | dash | GNU **inside** Linux | Paths/`/mnt/c` traps; not “Windows native” |

```bash
# --- Distro / userland detection kit (run on every class you support) ---
# 1) What is /bin/sh really?
readlink -f /bin/sh 2>/dev/null || ls -l /bin/sh
#    Debian/Ubuntu often -> .../dash
#    RHEL-family often -> .../bash
#    Alpine often -> .../busybox

# 2) Interactive Bash version (may be absent on tiny images)
bash --version 2>/dev/null | head -n1

# 3) What does plain `sh` think it is?
sh -c 'echo "sh_is_$0"'          # Often prints sh_is_sh; still useful with readlink above

# 4) GNU coreutils vs BusyBox fingerprint for `ls`
ls --version 2>&1 | head -n1     # GNU ls prints "ls (GNU coreutils) ..."
# BusyBox typically mentions BusyBox in --help / error text instead

# 5) date flavor (GNU long options vs BSD/BusyBox)
date --version 2>&1 | head -n1 || echo "no GNU date --version here"

# 6) Networking command era available on this image
command -v ss; command -v netstat; command -v ip; command -v ifconfig
```

**Breakdown**

| Line | Why it matters |
|------|----------------|
| `readlink -f /bin/sh` | Resolves symlinks to the real interpreter behind `sh` |
| `bash --version` | Pins Bash major/minor for feature gates (**02**, **09**) |
| `sh -c '…'` | Runs under `/bin/sh`, not your interactive Bash |
| `ls --version` | GNU prints a version banner; BusyBox often does not the same way |
| `command -v NAME` | Portable “does this exist on PATH?” (prefer over `which`) |

```bash
# --- Linux-only: is *this* shell process BusyBox? ---
# $$ = current shell PID; /proc/$$/exe points at the binary
if command -v readlink >/dev/null 2>&1; then
  exe="$(readlink "/proc/$$/exe" 2>/dev/null || true)"
  case "$exe" in
    *busybox*) echo "running_shell=busybox ($exe)" ;;
    *dash*)    echo "running_shell=dash ($exe)" ;;
    *bash*)    echo "running_shell=bash ($exe)" ;;
    *)         echo "running_shell=other ($exe)" ;;
  esac
fi
```

**Breakdown:** BusyBox is one multicall binary; applets like `ls`/`sh` are usually symlinks to `busybox`. Checking `/proc/$$/exe` identifies the **running** shell, which `$SHELL` may not.

### 3. Early vs modern Linux networking commands

| Job | Older / wide brownfield | Modern Linux default | Windows |
|-----|-------------------------|----------------------|---------|
| Interfaces | `ifconfig` | `ip addr` | `Get-NetIPAddress` / `ipconfig` |
| Routes | `route` | `ip route` | `Get-NetRoute` / `route print` |
| Sockets | `netstat -tulpn` | `ss -tulpn` | `Get-NetTCPConnection` / `netstat` |
| Firewall | `iptables` (legacy scripts) | `nft` / firewalld wrappers | Windows Firewall cmdlets |

Staff: teach **both** names; prefer modern on new Linux; keep legacy in IR runbooks (**25**, **23**).

```bash
# --- Modern Linux sockets (decode every letter: chapter 23) ---
# ss -tulpn  ==  -t -u -l -p -n
ss -tulpn
# -t  TCP
# -u  UDP
# -l  listening sockets only
# -p  show owning process (may need privileges)
# -n  numeric ports/hosts (no DNS delay)

# --- Legacy fallback when ss is missing ---
if ! command -v ss >/dev/null 2>&1; then
  netstat -tulpn 2>/dev/null || netstat -an
fi
```

```powershell
# --- Windows analog: listening TCP ---
Get-NetTCPConnection -State Listen |
  Select-Object -First 20 LocalAddress, LocalPort, OwningProcess
```

### 4. Init / service command eras (literacy only)

| Era | How you “restart a service” from a shell | Notes |
|-----|------------------------------------------|-------|
| SysV | `service foo restart` / `/etc/init.d/foo` | Still on old images |
| Upstart | `initctl` (historic Ubuntu) | Rare now |
| systemd | `systemctl restart foo` | Dominant on modern server Linux |
| OpenRC | `rc-service` (Alpine option) | Alpine-ish |
| Windows | `Restart-Service` / `sc.exe` | Different model |

```bash
# --- Recognize which service tool exists (do not restart blindly in prod) ---
command -v systemctl && echo "era=systemd"
command -v service   && echo "era=sysv-or-wrapper"
command -v rc-service && echo "era=openrc"
# Example shape only — replace foo with a real unit you own:
# systemctl status foo
# service foo status
```

**Breakdown:** These commands are **recognition** literacy for scripts and IR. Privilege and blast radius belong in OS/service runbooks—not casual paste into shared hosts.

---

## 3. Command eras — macOS

| Period | Interactive default | Scripting reality | Userland |
|--------|---------------------|-------------------|----------|
| **Pre-Catalina** | Bash (often 3.2) | Stock Bash **3.2** lacks Bash 4+ | BSD `*`; no GNU by default |
| **Catalina+** | **zsh** | Stock `/bin/bash` still 3.2 if present | BSD; Homebrew GNU as `g` prefix often |
| **Any era** | — | Prefer Homebrew Bash 5 **or** Linux CI for Bash 5 scripts | Document which `sed`/`date` |

```bash
# --- macOS era fingerprint ---
echo "SHELL=$SHELL"                 # Often /bin/zsh on Catalina+
bash --version 2>/dev/null | head -n1   # Stock may still be 3.2.x
zsh --version 2>/dev/null
sw_vers                             # ProductName / ProductVersion / BuildVersion

# date parsing trap (GNU vs BSD)
# GNU:   date -d @1700000000 '+%Y-%m-%d'
# BSD:   date -r 1700000000 '+%Y-%m-%d'
date -r 1700000000 '+%Y-%m-%d' 2>/dev/null || echo "use BSD -r or install GNU date"
```

**Breakdown:** `sw_vers` is macOS-specific system info. Bash **3.2** means no `declare -A` / `mapfile` (**28**). Prefer `shasum -a 256` when `sha256sum` is missing (**30**).

---

## 4. Command eras — Windows

| Era | Primary shell surface | What still appears in 2026 estates |
|-----|----------------------|-------------------------------------|
| **DOS / classic cmd** | `COMMAND.COM` / `cmd.exe` | Batch installers, `FOR`/`IF ERRORLEVEL` |
| **Windows PowerShell 1.0–2.0** | `powershell.exe` early | Legacy agents—inventory and replace (**02**, **21**) |
| **Windows PowerShell 5.1** | Built into Windows | Default on many servers; Windows-only modules |
| **PowerShell 7+ (`pwsh`)** | Cross-platform | Prefer for new automation |
| **Windows Terminal** | Emulator host | Hosts `cmd`, PS 5.1, `pwsh`, WSL profiles—not a dialect |
| **OpenSSH on Windows** | `ssh`/`scp` | Remote Unix-like workflows from Windows |
| **WSL / Git Bash / MS Coreutils** | Linux or GNU-ish tools on Windows | Alias collisions (`curl`, `ls`)—**31**, **14** |

```powershell
# --- Windows shell-era fingerprint ---
$PSVersionTable                              # PSVersion, PSEdition, OS, …
Get-Command pwsh, powershell, curl, ls -ErrorAction SilentlyContinue |
  Format-Table Name, CommandType, Source
# If CommandType=Alias for curl/ls, you are NOT talking to Unix curl/ls binaries.
# Prefer: curl.exe   and   Get-ChildItem
```

```bat
REM --- cmd era fingerprint ---
VER
ECHO %ComSpec%
WHERE curl
WHERE pwsh
```

**Breakdown:** `Get-Command` shows **Alias vs Application**. `WHERE` in cmd searches `PATH`. Windows Terminal is only the **emulator**—open a profile, then identify the shell inside it.

---

## 4b. Terminal emulator cheat-sheet (keys & habits)

| Habit | Unix terminal | Windows Terminal / console |
|-------|---------------|----------------------------|
| Interrupt | Ctrl-C | Ctrl-C |
| EOF | Ctrl-D | Ctrl-Z then Enter (cmd); PS differs |
| Clear screen | `clear` / Ctrl-L | `Clear-Host` / `CLS` |
| History search | Ctrl-R (readline/zsh) | PSReadLine; cmd F7 legacy overlay |
| Copy/paste | Emulator-dependent | WT: mark/copy; don’t assume middle-click |

```bash
# Clear the visible screen (emulator/TTY); does not erase shell history
clear
# Or: printf '\033c'   # full reset — use carefully
```

```powershell
Clear-Host    # Clear the host UI; history cmdlets still have session history
Get-History | Select-Object -Last 5
```

Interactive-only: do not put these in CI scripts.

---

## 5. Advanced — “works on my distro” failure modes

| Symptom | Likely era/distro miss |
|---------|------------------------|
| `[[` fails under `#!/bin/sh` | Debian dash / Alpine ash |
| `pipefail` ignored | dash |
| `date -d` fails | macOS BSD or BusyBox |
| `ss: not found` | Old image; use `netstat` fallback |
| `systemctl: not found` | Container without systemd / Alpine / old SysV |
| `Get-FileHash` missing | Ancient PowerShell—upgrade or `certutil` |
| `curl` is IWR alias | Windows PowerShell |
| Script OK on RHEL `sh`, dies on Ubuntu | Bashisms under Bash-as-`sh` |

```bash
# --- Demonstrate the dash trap safely (syntax check / tiny probe) ---
# This uses Bash-only [[ ]] on purpose — under dash it must fail.
cat > /tmp/bashism-probe.sh <<'EOF'
#!/bin/sh
# Intentionally non-portable — for teaching, not for production
if [[ -n "$HOME" ]]; then
  echo ok
fi
EOF
chmod +x /tmp/bashism-probe.sh
# Run with the real /bin/sh (dash on Debian/Ubuntu):
/bin/sh /tmp/bashism-probe.sh || echo "expected_failure_under_strict_sh"
# Run with Bash explicitly:
bash /tmp/bashism-probe.sh && echo "works_under_bash"
rm -f /tmp/bashism-probe.sh
```

**Breakdown:** The shebang says `sh`, but the body uses Bash `[[`. On Ubuntu, `/bin/sh` → dash → syntax error. On some RHEL images, `/bin/sh` → Bash → false confidence. Always test portable scripts under **dash** or BusyBox ash when you claim `#!/bin/sh` (**10**, **20**).

---

## 6. Applications

### Application A — estate inventory one-pager

For each OS class (Debian, RHEL, Alpine, macOS, Win 5.1, Win `pwsh`):

1. Terminal emulator in use  
2. Interactive shell + version  
3. `/bin/sh` provider (or N/A)  
4. GNU vs BusyBox vs BSD vs PS  
5. Ten most-used atlas commands + proven glyphs  

```bash
# --- One-shot inventory snippet (paste into a ticket) ---
{
  echo "### shell inventory $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "uname=$(uname -srm 2>/dev/null)"
  echo "shell_process=$(ps -p $$ -o args= 2>/dev/null)"
  echo "SHELL=$SHELL"
  echo "bin_sh=$(readlink -f /bin/sh 2>/dev/null || ls -l /bin/sh 2>/dev/null)"
  bash --version 2>/dev/null | head -n1 || echo "bash=missing"
  command -v ss; command -v systemctl; command -v apk; command -v apt-get
} 
```

### Application B — beginner onboarding week

Days 1–2: Stage 0–2 lab on native OS.  
Days 3–4: Stage 3–6.  
Day 5: Same lab on a **foreign** OS (WSL or cloud).  
Day 6: Read atlas **27** A–Z for your team’s tools.  
Day 7: Sign wrap **26** command-catalog section.

### Application C — security / IR

Know which **era** of networking commands the host offers before pasting a runbook. Prefer read-only recon; no exploit recipes (**25**, **21**).

```bash
# --- Read-only recon shape (permissions permitting) ---
command -v ss >/dev/null && ss -tuln || netstat -tuln 2>/dev/null || true
ps -ef 2>/dev/null | head -n 5 || ps aux | head -n 5
```

### Staff-level review checklist

- Team curriculum follows Stage 0→10 (or documented equivalent).
- Tickets name layer: emulator vs shell vs command vs OS.
- Distro matrix includes Debian dash, RHEL Bash-as-`sh`, Alpine BusyBox, macOS BSD, Windows PS edition.
- Brownfield runbooks include legacy fallbacks (`netstat`/`ifconfig`/`service`) where estates require them.
- Containers are proven as their own “distro class,” not assumed equal to Ubuntu laptops.
- Windows Terminal / WSL not confused with “knowing PowerShell.”
- Progressive labs exist for absolute beginners—not only staff checklists.
- Teaching snippets use **commented code** and letter/parameter breakdowns (this chapter’s pattern).

---

## References

- [GNU coreutils documentation](https://www.gnu.org/software/coreutils/manual/)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [dash(1) — Linux man page](https://man7.org/linux/man-pages/man1/dash.1.html)
- [Debian Policy — interpreter `/bin/sh`](https://www.debian.org/doc/debian-policy/)
- [BusyBox](https://busybox.net/)
- [man7.org — ip / ss](https://man7.org/)
- [PowerShell documentation](https://learn.microsoft.com/powershell/)
- [Windows Terminal](https://learn.microsoft.com/windows/terminal/)
- [WSL documentation](https://learn.microsoft.com/windows/wsl/)
- [Apple — zsh as default shell](https://support.apple.com/kb/HT208050)

---

[← Back to Shell](./README.md)
