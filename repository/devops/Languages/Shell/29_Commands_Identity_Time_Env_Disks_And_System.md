# Commands: identity, time, env, disks, and system

[← Back to Shell](./README.md)

## What this chapter covers

Extreme depth for the **identity / time / environment / disk / system** command family from the atlas (**27**): who you are, what time it is, what environment you inherited, how much disk you have, and how the host identifies itself. File CRUD and text tools live in **14**/**15**; archives/transfer in **30**.

---

## If you are brand new

```bash
# --- Machine identity in one glance ---
whoami                  # Account name
id                      # UIDs/GIDs in detail (uid=... gid=... groups=...)
date                    # Local time string (format varies by OS)
uname -a                # Kernel name/release/machine in one line
hostname                # This host's name
df -h                   # -h human-readable sizes (GiB/MiB style)
du -sh .                # -s summary, -h human — disk used by current dir
env | head              # Environment variables (never paste secrets into tickets)
# Breakdown: whoami/id = identity; date/uname/hostname = when/where;
#            df/du = disk; env = inherited configuration for child processes
```

```powershell
whoami
Get-Date
$env:COMPUTERNAME
Get-PSDrive
Get-ChildItem Env: | Select-Object -First 10
# Breakdown: Get-Date is a cmdlet; Env: is a PowerShell drive of environment vars
```

---

## 1. Concepts

### 1. Why this family matters in DevOps

CI failures that look like “logic bugs” are often:

| Symptom | Likely command/family miss |
|---------|----------------------------|
| Permission denied | `id` / wrong user in container |
| Wrong timestamp in artifacts | `date` format / TZ |
| Command not found | `env` / `PATH` via `printenv` |
| Disk full mid-build | `df` / `du` |
| Script assumes Linux | `uname` |

### 2. Cross-OS map (quick)

| Job | GNU/Linux | macOS | BusyBox | PowerShell | cmd |
|-----|-----------|-------|---------|------------|-----|
| Who am I | `whoami`/`id` | same | same | `whoami` / identity APIs | `whoami` |
| Time | `date` | BSD `date` | subset | `Get-Date` | `DATE`/`TIME` |
| Env | `env`/`printenv` | same | same | `$env:` / `Env:` drive | `SET` |
| OS id | `uname` | same | same | `$PSVersionTable` | `VER` |
| Disk | `df`/`du` | BSD flags | subset | `Get-PSDrive`/`Get-Volume` | limited |

---

## 2. Identity commands in depth

### `whoami`

Print effective user name.

```bash
whoami
```

| G | B | BB | PS | C |
|---|---|----|----|---|
| Y | Y | Y | `whoami.exe` / `$env:USERNAME` | `whoami` |

### `id`

```bash
id
id -u
id -gn
id -un
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `-u` | Effective UID | POSIX |
| `-g` | Effective GID | POSIX |
| `-G` | All group IDs | POSIX |
| `-n` | Names with above | POSIX |
| `-un` | User name | Common |
| `-Z` | SELinux context | Linux |

**Decode:** `id -un` → user **n**ame for **u**id selector.

```powershell
[System.Security.Principal.WindowsIdentity]::GetCurrent().Name
```

### `groups` / `logname` / `who` / `users` / `pinky`

```bash
groups
logname
who
users
```

Literacy for shared hosts and bastions. Automation usually needs `id`, not `pinky`. BusyBox may omit some.

**Windows:** `whoami /groups`, `query user`.

---

## 3. Time — `date` in depth

### Baby steps

```bash
date
date -u
date '+%Y-%m-%dT%H:%M:%SZ'
```

### GNU vs BSD (staff trap)

| Task | GNU `date` | BSD `date` (macOS) |
|------|------------|--------------------|
| Epoch now | `date +%s` | `date +%s` |
| Format time T | `date -d @T +…` | `date -r T +…` |
| Parse string | `date -d '…'` | `date -j -f '…'` |

```bash
# Portable-ish: prefer generating formats you control in the app;
# when scripting both OS, branch on uname.
case "$(uname -s)" in
  Linux) date -u -d @1700000000 '+%Y-%m-%d' ;;
  Darwin) date -u -r 1700000000 '+%Y-%m-%d' ;;
esac
```

| Flag | GNU meaning | BSD notes |
|------|-------------|-----------|
| `-u` | UTC | Same idea |
| `-d STRING` | Parse STRING | **GNU**; BSD uses `-j -f` |
| `-r FILE` | mtime of file (GNU) | BSD `-r` = seconds since epoch |
| `+FORMAT` | Output format | Same idea; directives mostly shared |

```powershell
Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ'
(Get-Date).ToUniversalTime()
```

```bat
DATE /T
TIME /T
```

**Pitfalls:** locale affects month names; set `LC_ALL=C` for stable parseable output in logs. Timezones in containers often default to UTC—document that.

---

## 4. Environment — `env` / `printenv`

### `printenv`

```bash
printenv PATH
printenv
```

### `env`

```bash
env                           # print
env -i PATH=/usr/bin /bin/sh  # clean env then run
env VAR=value command
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `-i` | Ignore inherited env | Common |
| `-u NAME` | Unset NAME | GNU; verify elsewhere |
| `-0` | NUL records | GNU |

**Shebang cousin:** `#!/usr/bin/env bash` uses `env` to find `bash` on `PATH` (chapter **03**).

```powershell
Get-ChildItem Env:PATH
$env:PATH
Remove-Item Env:TEMP_VAR -ErrorAction SilentlyContinue
```

```bat
SET
SET PATH
SET LOCALVAR=value
```

**Staff:** never dump full `env` to public CI logs (secrets). Prefer named `printenv VAR`.

---

## 5. System identity — `uname` / `hostname` / `nproc` / `tty` / `uptime`

### `uname`

```bash
uname -s    # kernel name: Linux, Darwin, …
uname -m    # machine: x86_64, arm64, …
uname -a    # all
uname -r    # release
```

| Flag | Meaning |
|------|---------|
| `-s` | System / kernel name |
| `-n` | Nodename |
| `-r` | Release |
| `-v` | Version |
| `-m` | Machine |
| `-a` | All |
| `-o` | OS (GNU) | Often missing on BSD |

### `hostname`

```bash
hostname
hostname -f    # FQDN when configured (Linux behavior varies)
```

```powershell
$env:COMPUTERNAME
[System.Net.Dns]::GetHostByName($env:COMPUTERNAME).HostName
```

### `nproc`

```bash
nproc              # GNU
getconf _NPROCESSORS_ONLN   # more portable often
sysctl -n hw.ncpu  # macOS
```

| G | B | BB | PS |
|---|---|----|----|
| Y | P (use `sysctl`/`getconf`) | P | `$env:NUMBER_OF_PROCESSORS` |

### `tty` / `uptime` / `hostid`

```bash
tty
uptime
```

`tty` fails non-interactively (no TTY)—expected in CI. `hostid` is historic; do not use for security identity.

---

## 6. Disks — `df` / `du` in depth

### `df` — filesystem free space

```bash
df -h
df -h /var
df -i          # inodes (Linux; critical when “disk not full” but creates fail)
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `-h` | Human sizes | Common |
| `-k` | KiB | POSIX-ish |
| `-i` | Inodes | Linux; macOS has `-i` differently check man |
| `-T` | FS type | GNU |
| `-P` | POSIX output format | Useful for scripts |

**Do not parse `df` casually** for automation—prefer dedicated monitoring APIs; when scripting, `df -P` and careful field cuts help.

```powershell
Get-PSDrive -PSProvider FileSystem
Get-Volume   # Windows
```

### `du` — space used by directory trees

```bash
du -sh /var/log
du -h --max-depth=1 /var   # GNU
du -h -d 1 /var            # macOS BSD
```

| Flag | GNU | BSD macOS |
|------|-----|-----------|
| Summarize | `-s` | `-s` |
| Human | `-h` | `-h` |
| Depth | `--max-depth=N` | `-d N` |
| Apparent size | `--apparent-size` | different |

```powershell
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum
```

**BusyBox:** fewer long options; prove on Alpine images.

---

## 7. Process helpers — `sleep` / `timeout` / `nice` / `nohup` / `true` / `false` / `yes` / `seq` / `expr`

### `sleep`

```bash
sleep 5
sleep 0.5          # fractional: may require GNU or modern systems
```

```powershell
Start-Sleep -Seconds 5
```

```bat
TIMEOUT /T 5
```

### `timeout` (GNU coreutils; macOS often needs Homebrew)

```bash
timeout 10s ./flaky.sh
timeout -k 5 30 ./flaky.sh
```

| Flag | Meaning |
|------|---------|
| `DURATION` | First operand: max runtime |
| `-k DURATION` | Kill signal after grace |
| `-s SIGNAL` | Signal to send |

| G | B | BB | PS |
|---|---|----|----|
| Y | P* | P | Jobs / `Wait-Process` patterns |

### `nice` / `nohup`

```bash
nice -n 10 ./batch.sh
nohup ./long.sh >long.out 2>&1 &
```

| Command | Job |
|---------|-----|
| `nice` | Lower scheduling priority |
| `nohup` | Ignore SIGHUP when terminal closes |

Prefer systemd/`launchd`/Windows services for real daemons.

### `true` / `false` / `yes`

```bash
true
false
yes | head -n 3
yes n | command_that_prompts   # careful automation only
```

### `seq`

```bash
seq 1 5
seq -w 1 10       # equal width
```

| G | B | Portable alt |
|---|---|--------------|
| Y | P* | Bash `{1..5}` or `i=1; while …` |

### `expr` / `factor` / `numfmt` / `stdbuf` / `stty`

- **`expr`:** legacy arithmetic/strings; prefer `$((…))` in Bash or `test`.
- **`numfmt`:** GNU human-readable number formatting for scripts.
- **`stdbuf`:** line-buffer pipelines (GNU)—debugging stuck pipes.
- **`stty`:** terminal modes; rare in CI; do not assume TTY.

---

## 8. Advanced concepts

### 1. Container identity surprises

```bash
id
# uid=0(root) often in poorly configured images
# uid=1000 in distroless/nonroot — paths and ports <1024 differ
```

### 2. `env -i` for hermetic tests

```bash
env -i PATH="/usr/bin:/bin" HOME="$HOME" bash --noprofile --norc -c 'command -v sort'
```

### 3. Exists / missing summary

| Command | Linux GNU | macOS | BusyBox | Notes |
|---------|-----------|-------|---------|-------|
| `date -d` | Y | N | P | Branch or avoid |
| `timeout` | Y | often N | P | Install or redesign |
| `nproc` | Y | often N | P | `getconf` fallback |
| `df -i` | Y | check | P | Inode monitoring |
| `du --max-depth` | Y | use `-d` | P | |

### 4. Security

- `env` dumps can leak tokens.
- `who`/`pinky` on shared hosts is recon literacy (chapter **25**), not an exploit kit.
- Do not use `hostid` as a crypto secret.

### 5. Era and distro substitutes (leave no stone)

| Need | Modern GNU Linux | Older Linux / BusyBox | macOS BSD | Windows |
|------|------------------|------------------------|-----------|---------|
| CPU count | `nproc` | `getconf _NPROCESSORS_ONLN` | `sysctl -n hw.ncpu` | `$env:NUMBER_OF_PROCESSORS` |
| Bound a command | `timeout 30s cmd` | `perl`/`python` watchdog or redesign | Homebrew `timeout` or redesign | jobs / `Wait-Process` |
| Human `df` | `df -h` | `df -h` (columns differ) | `df -h` | `Get-PSDrive` / `Get-Volume` |
| Inodes | `df -i` | may exist | check man | NTFS limits differ—monitor free space APIs |
| UTC stamp | `date -u +%Y-%m-%dT%H:%M:%SZ` | same if `date` present | same `+` formats; parsing differs | `Get-Date` UTC |
| Env print | `printenv VAR` | `printenv` / `echo "$VAR"` | same | `$env:VAR` |
| Kernel name | `uname -s` | same | `Darwin` | not `uname` natively—use PS/`VER` |

**Early Linux note:** very old distributions may lack `nproc`/`timeout` entirely—use `getconf` and process supervisors. **Latest Linux note:** prefer these GNU tools, but container images may still be BusyBox—glyphs matter more than “year of kernel.”

### 6. Baby → advanced drills

| Level | Commands |
|-------|----------|
| Baby | `whoami`, `date`, `uname -a`, `df -h` |
| Intermediate | `id -un`, `printenv PATH`, `du -sh`, `sleep` |
| Advanced | `env -i`, GNU vs BSD `date`, `df -i`, `timeout` |
| Staff | Hermetic CI preflight on Debian + Alpine + macOS + Windows |

---

## 9. Applications

### CI preflight snippet

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "host=$(hostname) os=$(uname -s)/$(uname -m) user=$(id -un) cwd=$(pwd)"
df -Ph . | tail -n 1
```

### Disk full triage

```bash
df -h
df -i
du -x -h --max-depth=1 /var 2>/dev/null | sort -h
```

### Whole-engineering

| Domain | Use |
|--------|-----|
| App | Non-root `id` in runtime images |
| Systems | `df`/`du` alerts before builds |
| Security | Avoid logging full `env` |
| Ops | `uname` in support bundles |
| Delivery | Document TZ=UTC in pipelines |

### Staff-level review checklist

- Scripts that format dates are GNU/BSD branched or use UTC epoch math carefully.
- `timeout`/`nproc` not assumed on stock macOS agents without pins.
- CI does not print full environment.
- Disk checks consider **inodes** (`df -i`) on Linux builders.
- Container user (`id`) matches volume permissions story.
- `sleep` in CI is intentional (flaky retries reviewed).

---

## References

- [GNU coreutils — date, df, du, env, uname, timeout, …](https://www.gnu.org/software/coreutils/manual/)
- [POSIX date / df / id / uname](https://pubs.opengroup.org/onlinepubs/9699919799/)
- [PowerShell Get-Date / about_Environment_Variables](https://learn.microsoft.com/powershell/)

---

[← Back to Shell](./README.md)
