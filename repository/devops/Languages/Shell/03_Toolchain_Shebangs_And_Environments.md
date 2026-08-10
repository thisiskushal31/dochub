# Toolchain: shebangs, environments, and discovery

[← Back to Shell](./README.md)

## What this chapter covers

How to **find** which shell will run your commands, how **shebang** lines select an interpreter, how **login / interactive / non-interactive** modes change startup files and `PATH`, and how **WSL**, **Git Bash**, and native Windows shells coexist. You leave knowing how to make a script’s interpreter explicit and how to debug “command not found” across OSes—before quoting and control-flow chapters deepen the language itself.

---

## 1. Concepts (basic)

### 1. Discovering the shell you have

Before writing automation, record **binary path**, **version**, and **what `/bin/sh` points to**.

```bash
# Linux / macOS / WSL / Git Bash
command -v bash zsh sh pwsh powershell 2>/dev/null
type bash 2>/dev/null
ls -l /bin/sh /usr/bin/sh 2>/dev/null
echo "PATH=$PATH"
bash --version 2>/dev/null | head -n1
```

```powershell
Get-Command bash, sh, pwsh, powershell, cmd -ErrorAction SilentlyContinue |
  Format-Table Name, Source -AutoSize
$PSVersionTable
$env:PATH -split [IO.Path]::PathSeparator
```

```bat
where bash
where sh
where pwsh
where powershell
echo %COMSPEC%
```

Cross-OS cheat sheet:

| Environment | Typical interactive shell | Typical scripting default |
|-------------|---------------------------|---------------------------|
| Linux server / CI | Bash | Bash 5.x or `sh` |
| macOS | zsh | Prefer explicit Bash pin or `sh`; stock `/bin/bash` may be 3.2 |
| Windows native | PowerShell | `pwsh` (7.x) for new work; 5.1 still present |
| WSL | Bash/zsh inside Linux | Linux rules apply inside the distro |
| Git Bash | Bash (MSYS) | Bash-like; not full Linux |
| Alpine container | ash/BusyBox | `sh` unless bash installed |
| cmd session | cmd | Batch / call out to `pwsh` |

### 2. Shebangs on Unix-like systems

A **shebang** is the first line of a script: `#!` plus an interpreter path. The kernel uses it when the script is executed as a program (`./tool.sh`).

Common forms:

```bash
#!/bin/sh
#!/bin/bash
#!/usr/bin/env bash
#!/usr/bin/env pwsh
```

| Form | Intent | Tradeoff |
|------|--------|----------|
| `#!/bin/sh` | Portable POSIX shell | Must avoid Bashisms; `/bin/sh` may be dash/ash |
| `#!/bin/bash` | Exact path to Bash | Fails if Bash lives elsewhere (Homebrew, Nix, some containers) |
| `#!/usr/bin/env bash` | Resolve `bash` via `PATH` | Depends on `PATH` at exec time; usually best for portable Bash scripts |
| `#!/usr/bin/env pwsh` | PowerShell 7 via `PATH` | Needs `pwsh` installed; execute bit + Unix host |

**Windows native** execution often ignores Unix shebangs: you associate `.ps1` with PowerShell or invoke `pwsh -File`. WSL and Git Bash honor shebangs for scripts run inside those environments.

### 3. `env bash` vs hard-coded `/bin/bash`

`#!/usr/bin/env bash` asks `env` to find `bash` on `PATH`. That helps when Bash is `/usr/local/bin/bash` or `/opt/homebrew/bin/bash`. It can surprise you if `PATH` is minimal (cron, systemd, containers) and the first `bash` is not the one you tested.

Hard-coded `#!/bin/bash` is predictable on many Linux distros and wrong on some Macs if you needed Bash 5 from Homebrew. Staff habit: pick one policy per repo and document the minimum version next to the shebang.

```bash
#!/usr/bin/env bash
# Requires Bash 4+ (associative arrays).
set -euo pipefail
```

### 4. Login vs interactive vs script

| Mode | Typical trigger | Startup files (Bash sketch) |
|------|-----------------|------------------------------|
| **Login** | SSH login, `bash -l`, console login | profile chain (`/etc/profile`, `~/.bash_profile` / `~/.profile`) |
| **Interactive non-login** | Opening a terminal that starts Bash | Often `~/.bashrc` |
| **Non-interactive script** | `bash script.sh`, CI `run:` | Usually **skips** interactive rc; do not rely on aliases |

zsh has its own files (`.zprofile`, `.zshrc`, …). PowerShell uses profiles (`$PROFILE`) for interactive convenience—same rule: **automation must not depend on a human profile**.

```bash
# Prove script mode does not see your alias
bash -c 'alias ll >/dev/null 2>&1 && echo aliases_leaked || echo clean'
```

### 5. PATH is part of the toolchain

The shell finds external commands through **`PATH`** (Unix) or **`$env:PATH`** (PowerShell). Order matters: Git Bash, WSL, and Windows native directories can shadow each other.

Symptoms of PATH confusion:

- `python` vs `python3` differs by environment
- `find` / `sort` resolve to Windows binaries from a Bash session unexpectedly
- CI image lacks a tool your laptop has via Homebrew

```bash
command -v find
type find
```

```powershell
Get-Command find -All | Format-Table Name, Source
```

### 6. Making scripts executable

Unix-like:

```bash
chmod +x deploy.sh
./deploy.sh          # uses shebang
bash deploy.sh       # ignores shebang; forces bash
sh deploy.sh         # forces sh — Bashisms may die here
```

PowerShell:

```powershell
pwsh -NoProfile -File .\deploy.ps1
# -NoProfile: ignore interactive profile for CI-like behavior
```

cmd:

```bat
cmd /c package.bat
```

---

## 2. Advanced concepts

### 1. Shebang length and portable interpreters

Some kernels limit shebang length; exotic wrapper paths break. Prefer `/usr/bin/env` plus a short interpreter name, or a stable absolute path in controlled images. For Nix/Guix-style absolute store paths, pin in the image and accept non-portable shebangs inside that image only.

### 2. `set -euo pipefail` belongs after the shebang

Bash robustness options are language policy, not a substitute for choosing the interpreter. Place them after comments that state version requirements. They are Bash/ksh-family oriented—**do not** paste Bash-only options into strict POSIX `sh` without checking (especially `pipefail`).

```bash
#!/usr/bin/env bash
set -euo pipefail
```

### 3. Cron, systemd, agents: minimal environments

Schedulers often provide a thin `PATH` (`/usr/bin:/bin`). Scripts that assume Homebrew or nvm locations fail. Patterns that work:

- Absolute paths to critical tools in production scripts, **or**
- Explicit `PATH=` export at the top of the unit/script, **or**
- Wrapper installed by your config management into a known path

### 4. WSL path translation

From PowerShell you can run `wsl.exe -- …`. Inside WSL, Windows drives appear under `/mnt/…` (typical). Line endings (`CRLF` vs `LF`) break shebangs (`bash\r: bad interpreter`). Keep shell scripts **LF** in git (`core.autocrlf` / `.gitattributes`).

### 5. Git Bash / MSYS vs “real Linux”

Git Bash provides Bash and many Unix-like tools on Windows. It is excellent for lightweight scripting and git hooks; it is not a substitute for testing Alpine/`dash` portability or systemd behavior. Note where binaries come from when debugging.

### 6. PowerShell execution policy

On Windows, **execution policy** can block `.ps1` files. CI images and servers need an explicit policy or invocation style (`pwsh -File`, signed scripts, or bypass in controlled agents). This is a toolchain concern, not a language syntax concern—handle it in onboarding and golden images.

### 7. BusyBox: one binary, many applets

`/bin/sh` may be BusyBox; `ls`, `grep`, and `sed` may be applets with fewer flags. Discover with:

```sh
sh -c 'command -v sh; ls -l "$(command -v sh)"'
busybox 2>/dev/null | head -n1 || true
```

### 8. Diagnosing “wrong shell” incidents

Typical failure signatures:

| Symptom | Likely cause |
|---------|----------------|
| `[[: not found` | Bashism under `dash`/`ash` |
| `declare: not found` / `mapfile: not found` | Bash-only under `sh`, or ancient Bash |
| `bad interpreter: No such file or directory` | Missing binary in shebang **or** CRLF (`bash\r`) |
| `pwsh: command not found` | PowerShell 7 not installed; only 5.1 present |
| Command works in terminal, fails in CI | Profile/`PATH` dependency |

```bash
# CRLF check (Unix tools)
file script.sh
# Expect "ASCII text" / "UTF-8 text", not "with CRLF line terminators"
```

### 9. Choosing invocation style

| Goal | Prefer |
|------|--------|
| Production Unix script | Shebang + `chmod +x` + quoted `"$@"` |
| Debug under another dialect | `dash script.sh` / `bash script.sh` (shebang ignored) |
| CI PowerShell | `pwsh -NoProfile -File ./task.ps1` |
| One-off Windows | `pwsh -NoProfile -Command '…'` sparingly; prefer files in repos |
| Call Linux from Windows | `wsl.exe -e bash -lc '…'` with explicit distro when needed |

---

## 3. Applications and use cases

### Repository conventions

Pick one shebang policy per language lane (`env bash` + Bash 5 minimum, or strict `sh`). Enforce with CI: run `shellcheck` and execute under the claimed interpreter. Add `.gitattributes` for `*.sh text eol=lf` and `*.ps1` as your team standards require.

```gitattributes
*.sh text eol=lf
*.bash text eol=lf
*.ps1 text eol=crlf
```

(Adjust `ps1` line-ending policy to your Windows agents; the point is **conscious** policy.)

### Multi-OS dispatch

A thin launcher can detect OS and call the right script—without pretending one dialect fits all:

```bash
#!/usr/bin/env bash
set -euo pipefail
case "$(uname -s)" in
  Linux*)  exec bash "$(dirname "$0")/linux_task.sh" "$@" ;;
  Darwin*) exec bash "$(dirname "$0")/mac_task.sh" "$@" ;;
  *) echo "unsupported: $(uname -s)" >&2; exit 1 ;;
esac
```

Windows agents often start in `pwsh` and call WSL only when the task is Linux-shaped.

```powershell
# Dispatch sketch
if (Get-Command wsl.exe -ErrorAction SilentlyContinue) {
  wsl.exe -e bash -lc './linux_task.sh'
} else {
  ./windows_task.ps1
}
```

### Container entrypoints

Prefer `EXEC` form in Dockerfiles and an explicit interpreter. If the image has no Bash, do not shebang Bash. Scratch images may use a compiled entrypoint with **no** shell—debug with a sidecar or temporary shell image.

### Developer onboarding

Publish a “first hour” toolchain note:

1. Install Bash 5.x on Mac if you will run Bash 4+ scripts locally.  
2. Install PowerShell 7 on Windows (and on Linux if you maintain `pwsh` scripts).  
3. Disable reliance on oh-my-zsh aliases for anything committed.  
4. Clone, run `./scripts/doctor.sh` that prints interpreters and exits non-zero on drift.

### Security

- World-writable script directories invite binary planting ahead on `PATH`.
- `curl | sh` installers inherit the caller’s shell environment—prefer verified artifacts.
- Profiles that auto-`eval` remote content are a workstation risk; keep them out of servers.

Toolchain and OS defaults also appear in Operating-Systems material such as [`../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md`](../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md); this chapter stays on interpreter selection and environment hygiene for scripts.

### Staff-level review checklist

- Shebang matches the dialect actually used (no Bashisms under `#!/bin/sh`).
- Scripts run under `bash script` **and** `./script` in CI when executable bit is claimed.
- CI uses `-NoProfile` / non-interactive modes; no dependency on developer rc files.
- `PATH` assumptions documented; cron/systemd units set PATH explicitly when needed.
- LF line endings for Unix shell scripts in the repo.
- WSL/Git Bash/native Windows roles are named in the runbook for mixed teams.
- PowerShell execution policy is solved on agents, not left as “works on my laptop.”
- A doctor/preflight script exists for interpreter discovery on contributor machines.
- Absolute paths or explicit PATH exports are used in scheduled jobs.

---

## References

- [GNU Bash manual — Invoking Bash](https://www.gnu.org/software/bash/manual/html_node/Invoking-Bash.html)
- [GNU Bash manual — Bash Startup Files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [about_Profiles (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles)
- [about_Pwsh](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pwsh)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [ShellCheck](https://www.shellcheck.net/)
