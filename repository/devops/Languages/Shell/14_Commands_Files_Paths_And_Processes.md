# Commands in depth: files, paths, and processes (cross-OS)

[← Back to Shell](./README.md)

## What this chapter covers

Everyday **file**, **path**, and **process** commands as first-class Bash/coreutils literacy, with **cross-OS analogs** on macOS (zsh + BSD userland), PowerShell, cmd, WSL, and BusyBox. This is command depth for automation—not a tour of every Windows GUI tool. Pair with OS companions when you need host administration context beyond the dialect.

**Full command index:** chapter **27** (Master Command Atlas). Builtins: **28**. Identity/disks/env: **29**. Archives/transfer: **30**. PowerShell/cmd atlases: **31**. **Terminal + eras + distros (basic→advanced ladder):** **32**.

If a flag cluster still looks like alphabet soup, chapter **23** teaches a general decode habit; here we expand the file/process classics letter by letter.

```bash
# --- File classic with letter-by-letter comments ---
mkdir -p "$HOME/file-lab/nested"   # -p: create parents; no error if exists
printf 'x\n' > "$HOME/file-lab/nested/a.txt"
cp -r -- "$HOME/file-lab/nested" "$HOME/file-lab/nested.bak"
# cp -r  = copy recursively (directory trees)
# --     = end of options (safe with odd names)
ls -la "$HOME/file-lab"
# ls -l  = long listing; ls -a = all (including .* )
find "$HOME/file-lab" -type f -name '*.txt' -print
# find PATH -type f = only files; -name glob; -print paths
```

---

## 1. Concepts

### 1. Mental model: shell vs userland

The shell parses words and runs **builtins** or **external programs**. `cd` is usually a builtin; `ls`, `cp`, `find`, and `ps` are typically **external** (or BusyBox applets). PowerShell’s `Get-ChildItem` is a **cmdlet**. Same job, different process model:

| Job | Linux Bash (GNU) | macOS (BSD + zsh/Bash) | PowerShell 7 / 5.1 | cmd | BusyBox |
|-----|------------------|------------------------|--------------------|-----|---------|
| List directory | `ls` | `ls` (BSD flags) | `Get-ChildItem` | `dir` | `ls` (subset) |
| Copy | `cp` | `cp` | `Copy-Item` | `copy` / `xcopy` | `cp` |
| Move/rename | `mv` | `mv` | `Move-Item` | `move` / `ren` | `mv` |
| Remove | `rm` | `rm` | `Remove-Item` | `del` / `rd` | `rm` |
| Make dir | `mkdir -p` | `mkdir -p` | `New-Item -ItemType Directory` | `mkdir` | `mkdir` |
| Permissions | `chmod` / `chown` | `chmod` / `chown` | ACL cmdlets (Windows); limited on Unix PS | `icacls` (external) | `chmod` (limited) |
| Find files | `find` | `find` (BSD) | `Get-ChildItem -Recurse` | `dir /s` | `find` (gaps) |
| Metadata | `stat` | `stat` (different format) | `Get-Item` / `Get-Acl` | `dir` | `stat` (often limited) |
| Processes | `ps` / `kill` | `ps` / `kill` | `Get-Process` / `Stop-Process` | `tasklist` / `taskkill` | `ps` / `kill` |

### 2. Listing and navigating — decode `ls -la` and `ls -lh`

```bash
ls -la                  # long + hidden (GNU/BSD both accept -l -a)
ls -lh                  # long + human-readable sizes
pwd
cd -- "$target"         # -- guards paths starting with -
```

**Decode `ls -la` — each letter**

| Piece | Meaning |
|-------|---------|
| `ls` | List directory contents (external command) |
| `-l` | **l**ong format: mode, links, owner, group, size, time, name |
| `-a` | **a**ll: include names starting with `.` (hidden on Unix) |

Combined short flags `-la` mean the same as `-l -a`.

**Decode `ls -lh` — each letter**

| Piece | Meaning |
|-------|---------|
| `-l` | **l**ong format (same as above) |
| `-h` | **h**uman-readable sizes (`1.2K`, `3M`) instead of raw bytes |

```bash
# GNU-leaning extra (may be missing on macOS):
ls -lh --time-style=long-iso
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `--time-style=long-iso` | ISO-ish timestamps | GNU; often absent on BSD `ls` |

```powershell
# Named parameters — PowerShell analog of ls -la
Get-ChildItem -Force
Get-Location
Set-Location -LiteralPath $target
```

| Parameter | Meaning |
|-----------|---------|
| `-Force` | Include hidden/system items (rough analog of `ls -a`) |
| `-LiteralPath` | Treat the path literally—no wildcard magic |
| `Get-Location` | Analog of `pwd` |
| `Set-Location` | Analog of `cd` |

```bat
DIR /A
CD /D "%target%"
```

**Depth notes:** Prefer `-LiteralPath` / `--` when paths may start with `-` or contain wildcards. On PowerShell, `*` is shell-expanded by the cmdlet’s path resolution rules—not Bash globs.

### 3. Copy, move, remove, mkdir — flag tables and safety

```bash
mkdir -p "$out/nested"
cp -r "$src_dir" "$dst_dir"
cp -a "$src" "$dst"          # archive: preserve mode/times (GNU); macOS cp -a ≈ -pPR
mv -- "$old" "$new"
rm -f -- "$tmp"
rm -rf -- "$build_dir"       # irreversible; never unquoted $var here
```

**Decode `mkdir -p`**

| Piece | Meaning |
|-------|---------|
| `mkdir` | Make directories |
| `-p` | **p**arents: create missing parents; do not error if the directory already exists |

```bash
# Without -p, missing parents fail:
# mkdir /tmp/a/b/c     # fails if /tmp/a missing
mkdir -p /tmp/a/b/c    # creates the chain
```

**Decode `cp -r`**

| Piece | Meaning |
|-------|---------|
| `cp` | Copy files or directories |
| `-r` / `-R` | **r**ecursive: copy directory trees |

```bash
cp -r "$src_dir" "$dst_dir"
```

| Concern | Habit |
|---------|-------|
| File vs directory | For a single file, omit `-r` |
| Trailing slash | GNU/BSD can disagree on `cp dir/` semantics—test or avoid ambiguity |
| Large trees | Prefer `rsync` in ops when available |

**Decode `rm -rf` — stern safety**

| Piece | Meaning |
|-------|---------|
| `rm` | Remove (unlink) files |
| `-r` | **r**ecursive: delete directory contents |
| `-f` | **f**orce: do not prompt; ignore nonexistent files |

```bash
# DANGER PATTERN — empty variable can widen the path
# Bad:  rm -rf $BUILD/          # if BUILD is empty → may target /
# Good:
rm -rf -- "${BUILD:?BUILD must be set}/"
```

| Safety rule | Why |
|-------------|-----|
| Always quote | Spaces and empty values |
| Use `--` | Stops option parsing if a name starts with `-` |
| Use `${VAR:?}` | Fail closed if the root path is unset |
| Never run as root “to be sure” | Privilege multiplies blast radius |
| Prefer dry runs in new scripts | `echo rm -rf -- "$path"` first while learning |

PowerShell analogs with named parameters:

```powershell
New-Item -ItemType Directory -Force -Path $out\nested
Copy-Item -Path $src -Destination $dst -Recurse -Force
Move-Item -LiteralPath $old -Destination $new
Remove-Item -LiteralPath $tmp -Force
Remove-Item -LiteralPath $buildDir -Recurse -Force
```

| Parameter | Closest Unix idea |
|-----------|-------------------|
| `-ItemType Directory` | “Make a folder” |
| `-Force` on `New-Item` | Create parents / overwrite carefully—verify |
| `-Recurse` | Like `cp -r` / `rm -r` |
| `-Force` on `Remove-Item` | Closer to `rm -f` (still think before using) |
| `-WhatIf` | Print what would happen—use while drafting |

```bat
MKDIR "%out%\nested" 2>NUL
COPY /Y "%src%" "%dst%"
MOVE /Y "%old%" "%new%"
DEL /F /Q "%tmp%"
RMDIR /S /Q "%build_dir%"
```

| Concern | Bash habit | PowerShell habit |
|---------|------------|------------------|
| Missing parent dirs | `mkdir -p` | `New-Item -Force` creates parents for files/dirs carefully—verify |
| Overwrite | `cp` overwrites by default | `-Force` often required |
| Trailing slash on dirs | GNU/BSD differ on `cp dir/` semantics | Prefer explicit `-Recurse` on containers |
| Soft delete | Trash tools are **not** portable automation | Don’t rely on Recycle Bin in scripts |

### 4. Permissions — `chmod` symbolic AND octal (baby steps)

Unix permission bits answer three questions for three roles:

| Who | Letter (symbolic) | Digit place (octal) |
|-----|-------------------|---------------------|
| **u**ser (owner) | `u` | hundreds digit |
| **g**roup | `g` | tens digit |
| **o**thers | `o` | ones digit |

Each role gets a mix of:

| Permission | Letter | Value |
|------------|--------|-------|
| **r**ead | `r` | 4 |
| **w**rite | `w` | 2 |
| e**x**ecute | `x` | 1 |

**Octal baby math:** add the values you want per role.

| Want | Math | Digit |
|------|------|-------|
| read+write+execute | 4+2+1 | **7** |
| read+execute | 4+1 | **5** |
| read+write | 4+2 | **6** |
| read only | 4 | **4** |

So `chmod 755 file` means:

| Digit | Who | Bits |
|-------|-----|------|
| `7` | owner | rwx |
| `5` | group | r-x |
| `5` | others | r-x |

```bash
chmod 0755 scripts/run.sh     # octal form (leading 0 optional in practice)
chmod u+x scripts/run.sh      # symbolic: add execute for owner only
chmod go-w secrets.txt        # symbolic: remove write from group and others
chown root:root /etc/myapp.conf    # needs privileges
chgrp deploy /var/app
```

**Decode symbolic pieces**

| Piece | Meaning |
|-------|---------|
| `u+x` | For **u**ser, **add** e**x**ecute |
| `go-w` | For **g**roup and **o**thers, **remove** **w**rite |
| `a=r` | For **a**ll, set exactly read (advanced form) |

On **Windows**, POSIX mode bits are not the security model—**ACLs** are. PowerShell:

```powershell
Get-Acl $path | Format-List
# Set-Acl after constructing a security descriptor — prefer documented patterns
icacls $path   # still common from cmd-era tooling
```

| Platform | Exists | Missing / weak | Substitute |
|----------|--------|----------------|------------|
| Linux Bash | `chmod`/`chown` full | — | — |
| macOS | `chmod`/`chown`; SIP may block system paths | Same flags, different FS (APFS) | `chflags` for some Mac flags |
| PowerShell on Windows | ACL cmdlets + `icacls` | Unix `chmod` meaning | ACL APIs |
| PowerShell on Unix | Limited file mode via .NET/chmod | Full Windows ACL story | Native `chmod` |
| cmd | `attrib`, `icacls` | No POSIX chmod | `icacls` |
| BusyBox | `chmod`/`chown` applets | Often no ACL tools | Keep modes simple |
| WSL | Linux chmod inside distro | Windows ACL ≠ Linux mode on `/mnt/c` | Prefer Linux FS for Linux perms |

### 5. Finding files — decode `find . -name '*.log' -type f`

```bash
find . -name '*.log' -type f
find "$root" -type f -name '*.log' -print
find "$root" -type d -name node_modules -prune -o -type f -print

# NULL-safe delete (GNU find -print0 + xargs -0; BSD supports both commonly)
find "$root" -type f -name '*.tmp' -print0 | xargs -0 rm -f
```

**Decode `find . -name '*.log' -type f` — each part**

| Piece | Meaning |
|-------|---------|
| `find` | Walk a directory tree and select entries |
| `.` | Start here (current directory) |
| `-name '*.log'` | Basename matches the pattern `*.log` (quote so the shell does not expand `*`) |
| `-type f` | Only regular **f**iles (not directories, not symlinks as the match type) |

Other common predicates:

| Predicate | Meaning |
|-----------|---------|
| `-type d` | Directories only |
| `-print` | Print matching paths (often default) |
| `-print0` | Print with NUL separators—safe for weird filenames |
| `-prune` | Do not descend into this directory |

```powershell
Get-ChildItem -Path $root -Recurse -File -Filter *.log -ErrorAction SilentlyContinue
```

| Parameter | Meaning |
|-----------|---------|
| `-Path` | Where to start |
| `-Recurse` | Walk children |
| `-File` | Files only (like `-type f`) |
| `-Filter` | Name filter (provider-specific; often faster) |
| `-ErrorAction SilentlyContinue` | Skip inaccessible dirs without screaming |

```bat
DIR /S /B "%root%\*.log"
```

**GNU vs BSD:** GNU `find` has `-printf`; BSD `find` typically does **not**. GNU often has `-executable`; BSD uses `-perm` tests. Prefer portable predicates in shared scripts.

### 6. `stat` and metadata

```bash
# GNU
stat -c '%n %s %Y' "$f"
# BSD/macOS
stat -f '%N %z %m' "$f"
```

```powershell
Get-Item -LiteralPath $f | Select-Object FullName, Length, LastWriteTime
```

Cross-OS scripts should **not** parse `ls -l`. Use `stat` with an OS branch, or PowerShell properties, or a higher-level language.

### 7. Processes — decode `ps aux`, `ps -ef`, and `kill`

```bash
ps aux                    # BSD-style columns (works on Linux/macOS commonly)
ps -ef                    # System V style
pgrep -a mydaemon         # if available
kill -TERM "$pid"         # polite (SIGTERM) — same idea as kill -15
kill -KILL "$pid"         # last resort (SIGKILL) — same idea as kill -9
```

**Decode `ps aux` — each letter (BSD-style cluster)**

| Letter | Meaning (common reading) |
|--------|---------------------------|
| `a` | Show processes for **a**ll users (not only yours) |
| `u` | **u**ser-oriented columns (user, CPU%, MEM%, …) |
| `x` | Include processes without a controlling terminal |

You will see columns like `USER`, `PID`, `%CPU`, `%MEM`, `COMMAND`. Exact headers vary slightly by OS.

**Decode `ps -ef` — each letter (System V style)**

| Flag | Meaning |
|------|---------|
| `-e` | **e**very process |
| `-f` | **f**ull-format listing (UID, PID, PPID, CMD, …) |

**`kill -15` / `-TERM` vs `kill -9` / `-KILL`**

| Form | Signal | Beginner meaning |
|------|--------|------------------|
| `kill -15 PID` or `kill -TERM PID` | **SIGTERM** | “Please shut down.” Process can clean up (flush, close sockets). |
| `kill -9 PID` or `kill -KILL PID` | **SIGKILL** | “Die now.” Cannot be caught or ignored. Last resort. |

```bash
# Preferred ops pattern
kill -TERM "$pid"
# wait / poll with kill -0, then:
kill -KILL "$pid"
```

| Check | Meaning |
|-------|---------|
| `kill -0 "$pid"` | Ask “does this PID exist / can I signal it?” without killing |

```powershell
Get-Process
Get-Process -Name pwsh
Stop-Process -Id $pid            # attempt stop
Stop-Process -Id $pid -Force     # harder stop — closer to SIGKILL mindset
```

| Parameter | Meaning |
|-----------|---------|
| `-Name` | Match by process name |
| `-Id` | Match by PID |
| `-Force` | Do not ask; stronger termination |

```bat
TASKLIST
TASKKILL /PID %pid% /F
```

| Need | Linux/macOS | PowerShell | cmd | BusyBox |
|------|-------------|------------|-----|---------|
| List | `ps`/`pgrep` | `Get-Process` | `tasklist` | `ps` (columns vary) |
| Stop graceful | `kill -TERM` | `Stop-Process` (may be hard) | `taskkill` | `kill` |
| Tree | `pstree` (often separate pkg) | limited built-in | `tasklist` | often missing |
| Wait | `wait` (shell jobs) | `Wait-Process` | — | `wait` |

### 8. PATH and Microsoft Coreutils conflicts

Microsoft ships **Coreutils for Windows**—GNU-like `ls`, `cp`, etc. that can appear on `PATH` beside Git Bash, WSL, and native tools.

| Situation | Risk | Habit |
|-----------|------|-------|
| `ls` resolves to unexpected binary | Scripts assume GNU flags that another port lacks | `command -v ls`; prefer fully qualified or known toolchain |
| Order: WindowsDir vs Git `usr\bin` vs Coreutils | Different `find`/`sort` semantics | Pin toolchain in CI image docs |
| Calling Unix tools from `pwsh` | Still text tools; encoding/CRLF | Prefer cmdlets for PS-native data |
| WSL `ls` vs PowerShell `ls` alias | `ls` in `pwsh` is often `Get-ChildItem` | Use `Get-Command ls` |

```powershell
Get-Command ls, cp, find | Format-Table Name, Source, CommandType
```

```bash
type ls; command -v ls; ls --version 2>/dev/null || true
```

### 9. Decode-this-line exercises (answers in this section)

**Exercise A**

```bash
ls -lah
```

| Letter | Meaning |
|--------|---------|
| `-l` | long |
| `-a` | all (including `.` names) |
| `-h` | human-readable sizes |

**Answer:** long listing of all entries with readable sizes.

**Exercise B**

```bash
mkdir -p "$HOME/work/lab/out" && cp -r ./src "$HOME/work/lab/out/"
```

**Answer:** create the directory chain if needed, then recursively copy `./src` into `out/`. `&&` means “only copy if mkdir succeeded.”

**Exercise C**

```bash
find . -type f -name '*.log' -print0 | xargs -0 grep -n -- 'ERROR'
```

| Piece | Meaning |
|-------|---------|
| `find .` | start here |
| `-type f` | files only |
| `-name '*.log'` | basename pattern |
| `-print0` | NUL-safe path stream |
| `xargs -0` | read NUL-separated args |
| `grep -n` | show line **n**umbers |
| `--` | end of grep options |
| `'ERROR'` | fixed search text here (still regex engine unless `-F`) |

**Answer:** search ERROR in all `*.log` files under `.`, safely handling spaces in names.

**Exercise D**

```bash
kill -9 12345
```

**Answer:** send **SIGKILL** to PID 12345—immediate, non-catchable. Prefer `-TERM` / `-15` first in production stop hooks.

**Exercise E (PowerShell)**

```powershell
Remove-Item -LiteralPath $buildDir -Recurse -Force -WhatIf
```

**Answer:** show what a recursive forced delete would remove, without deleting yet (`-WhatIf`).

---

## 2. Advanced concepts

### 1. Version and userland gates

| Gate | Implication |
|------|-------------|
| Bash 3.2 on stock macOS | Script dialect pin ≠ modern `find`/`cp` flags from GNU manuals |
| GNU coreutils vs BSD | `cp -a`, `stat -c`, `find -printf` are portability traps |
| PowerShell 5.1 vs 7 | Prefer 7 for cross-OS path/`PATH` behavior; 5.1 Windows-only for many modules |
| BusyBox | Applets omit options; `-print0` / fancy `find` may be absent—test on Alpine |
| WSL1 vs WSL2 | File performance and metadata on `/mnt/c` differ; prefer Linux-native paths for heavy IO |

### 2. Destructive operations and confirmation

Never use unquoted expansions with `rm -rf`:

```bash
# Bad: rm -rf $BUILD/   # empty BUILD → rm -rf /
# Good:
rm -rf -- "${BUILD:?BUILD must be set}/"
```

PowerShell: prefer `-WhatIf` during development; require `-Force` consciously in CI.

### 3. Atomic replace patterns

```bash
umask 022
tmp="$(mktemp "${dest}.XXXXXX")"
cp -- "$src" "$tmp"
mv -f -- "$tmp" "$dest"
```

On Windows without Unix `mv` atomicity guarantees across volumes, stage then `Move-Item` on the same volume when possible.

### 4. Hard links, symlinks, junctions

| OS | Symlink create | Notes |
|----|----------------|-------|
| Linux | `ln -s target link` | Relative vs absolute targets matter |
| macOS | `ln -s` | SIP/TCC may affect some targets |
| Windows (admin/dev mode) | `New-Item -ItemType SymbolicLink` | Privilege historically required |
| cmd | `mklink` | Different for files/dirs/junctions |
| BusyBox | `ln -s` | Keep simple |

Scripts that copy trees must decide whether to **dereference** symlinks (`cp -L` / `Copy-Item` behaviors differ)—document the choice.

### 4b. More file tools — `ln`, `install`, `dd`, `truncate`, `shred`, `mkfifo`, path helpers

#### `ln`

```bash
ln -s ../target linkname     # symlink
ln target hardlink           # hard link (same filesystem)
```

| Flag | Meaning |
|------|---------|
| `-s` | Symbolic link |
| `-f` | Force replace link name |
| `-v` | Verbose |

Windows: `New-Item -ItemType SymbolicLink` / `mklink`. Hard links: `New-Item -ItemType HardLink` when supported.

#### `install`

```bash
install -d -m 0755 "$prefix/bin"
install -m 0755 ./tool "$prefix/bin/tool"
```

| Flag | Meaning |
|------|---------|
| `-d` | Make directories |
| `-m MODE` | Mode |
| `-o`/`-g` | Owner/group (privileged) |

Copies like `cp` but with explicit mode—common in Unix packaging. macOS/BusyBox: subset; verify flags.

#### `dd`

```bash
dd if=/dev/zero of=sparse.bin bs=1M count=10 status=progress
```

| Operand | Meaning |
|---------|---------|
| `if=` | Input file |
| `of=` | Output file |
| `bs=` | Block size |
| `count=` | Block count |
| `status=progress` | GNU progress |

**Staff:** `dd` of raw disks is destructive—double-check device paths. Not a casual copy tool when `cp` suffices.

#### `truncate` / `shred` / `mkfifo`

```bash
truncate -s 0 "$logfile"           # set size (GNU; BSD has truncate too)
shred -u -- "$secretfile"          # overwrite then remove (GNU; not secure against all storage tech)
mkfifo /tmp/my.pipe                # named pipe for IPC
```

| Command | G | B | BB | Notes |
|---------|---|---|----|-------|
| `truncate` | Y | P | P | |
| `shred` | Y | N | P | SSDs/COW FS limit guarantees |
| `mkfifo` | Y | Y | Y | |

#### Path helpers — `basename`, `dirname`, `readlink`, `realpath`

```bash
basename /a/b/c.txt .txt      # c
dirname /a/b/c.txt            # /a/b
readlink -f "$path"           # GNU canonical; macOS often lacks -f
realpath "$path"              # prefer when available
```

| Task | GNU | macOS portable habit | PowerShell |
|------|-----|----------------------|------------|
| Canonical path | `realpath` / `readlink -f` | `realpath` (if present) or Python/`pwd -P` patterns | `Resolve-Path` |
| Leaf name | `basename` | `basename` | `Split-Path -Leaf` |

### 5. Process groups and orphans

Unix automation often needs `kill` to a **process group** or careful `trap` cleanup (chapter 16). On Windows, stopping a console tree is a different model (`taskkill /T`). Do not assume POSIX job control in `pwsh` on Windows.

### 6. BusyBox gaps that break “Linux” assumptions

| Expectation | BusyBox reality |
|-------------|-----------------|
| GNU `cp -a` | May lack option parity |
| `find -printf` | Usually missing |
| `ps aux` columns | Non-standard / limited |
| `stat` format flags | Often incompatible with GNU `-c` |
| SELinux/`chcon` | Absent |

Alpine-based CI images need scripts tested **on BusyBox**, not only on Ubuntu.

### 7. Cross-OS decision table (files & processes)

| Task | Prefer on Linux CI | Prefer on Mac agent | Prefer on Windows agent |
|------|--------------------|---------------------|-------------------------|
| App file ops in Bash scripts | GNU coreutils | BSD tools or Homebrew GNU with `g` prefix | WSL Bash **or** rewrite in `pwsh` |
| Native Windows services | — | — | `Get-Process` / service cmdlets |
| Container entrypoint | BusyBox-aware `sh` | Rare | Windows containers: `pwsh` |
| Inventory disk usage | `du -sh` | `du -sh` (BSD) | `Get-ChildItem` measure / WSL `du` |

### 8. Encoding and path separators

- Bash scripts: treat paths as opaque strings; quote always.
- Windows: `\` vs `/`—PowerShell accepts both often; external Win32 tools may not.
- Never split paths on spaces; never build paths by string pasting untrusted input (chapter 18).

### 9. `mkdir -p` races and umask

Parallel CI jobs creating the same directory: `mkdir -p` is generally safe. File creation races need locking or unique temp names (`mktemp`). `umask` affects default modes—set explicitly in installers.

### 10. Signal literacy beyond `kill -9`

Prefer `TERM` then wait then `KILL`. Scripts should not escalate to `KILL` immediately in production stop hooks. PowerShell `Stop-Process -Force` is closer to hard kill—pair with service-aware stop when available.

### 11. WSL path bridging

```bash
# Inside WSL
wslpath -w "$PWD"     # if available: Linux → Windows path
```

```powershell
wsl.exe -e bash -lc 'ls -la /home'
```

File modes and executability on `/mnt/c` are leaky abstractions—keep build artifacts on the Linux filesystem when using Linux toolchains.

### 12. Discoverability habits

```bash
man ls
ls --help 2>/dev/null | head
type -a find
```

```powershell
Get-Help Get-ChildItem -Full
Get-Command Get-ChildItem -Syntax
```

Staff engineers look up flags in **official** manuals (References)—not random cheat sites. Chapter **23** drills the general “expand every letter” habit for clusters like `ss -tulpn`.

### 13. Baby-step lab: safe cleanup pattern

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:?usage: $0 /absolute/safe/root}"
case "$ROOT" in
  /tmp/*|/var/tmp/*) ;;
  *) echo "refusing unsafe root: $ROOT" >&2; exit 2 ;;
esac
find "$ROOT" -type f -name '*.tmp' -print0 | xargs -0 rm -f --
```

| Habit shown | Why |
|-------------|-----|
| `${1:?…}` | Fail if caller forgot the root |
| `case` allowlist | Refuse surprising paths |
| `-print0` / `xargs -0` | Weird filenames |
| `rm -f --` | Force + end-of-options |

---

## 3. Applications and use cases

### CI workspace hygiene

Create outputs under `$RUNNER_TEMP` / `$GITHUB_WORKSPACE` with `mkdir -p`; clean with explicit paths; never `rm -rf` on weakly validated roots.

### Ops glue: rotate logs / drain processes

Use `find` + age predicates or platform log shippers. For process drains: send `TERM`, wait loop with `kill -0`, then escalate. Mirror with `Stop-Process` only when no service API exists.

### Application installers

Set ownership and mode after unpack (`chown`/`chmod`). On Windows installers, set ACLs deliberately—don’t “chmod 777 equivalents.”

### Security engineering

World-writable directories on `PATH`, setuid surprises, and deleting via untrusted filenames (newline in names → need `-print0`). Review `rm`/`Remove-Item` in privileged scripts. Process listings (`ps aux`) can expose command lines—avoid secrets on argv (chapter 18). Deeper recon command literacy continues in chapters **23** and **25**.

### Software engineering

Shared monorepos: document **which userland** scripts assume. Provide `scripts/doctor` that prints `ls`/`find` identity and OS.

### Whole-engineering OS companions

Linux process/file admin context: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md). Windows command landscape: [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md). Fundamentals of shells as UI: [`../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md`](../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md).

### Staff-level review checklist

- Are paths quoted and guarded with `--` / `-LiteralPath`?
- Is `rm -rf` / `Remove-Item -Recurse` rooted on a validated variable (`${VAR:?}`)?
- GNU-only `find`/`stat`/`cp` flags avoided—or gated to Linux images?
- BusyBox/Alpine jobs tested if claimed?
- Microsoft Coreutils / Git Bash / WSL `PATH` conflicts checked on Windows agents?
- Permissions: Unix modes vs Windows ACLs chosen appropriately?
- Process stops use graceful signal (`TERM`/`-15`) first—not instant `-9`?
- Symlink dereference policy documented for copy/publish steps?
- No parsing of `ls` output in scripts?
- Can a beginner decode `ls -la`, `mkdir -p`, `cp -r`, `rm -rf`, `find … -type f`, and `ps aux` letter by letter?
- Are `ln`/`install`/`dd`/`truncate` uses justified and OS-gated where BusyBox/BSD differ?
- Is the team using atlas **27** so file commands are not reinvented ad hoc?

---

## References

- [GNU coreutils manual](https://www.gnu.org/software/coreutils/manual/)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [POSIX utilities](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/contents.html)
- [Findutils (GNU find)](https://www.gnu.org/software/findutils/)
- [PowerShell — Get-ChildItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem)
- [PowerShell — Copy-Item](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/copy-item)
- [PowerShell — Get-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process)
- [PowerShell — Stop-Process](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/stop-process)
- [Windows commands — dir, copy, tasklist](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
- [Microsoft Coreutils for Windows](https://learn.microsoft.com/en-us/windows/core-utils/overview)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
