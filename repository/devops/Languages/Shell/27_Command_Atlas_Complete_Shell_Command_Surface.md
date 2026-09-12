# Command atlas — complete shell command surface

[← Back to Shell](./README.md)

## What this chapter covers

The **Master Command Atlas**: every DevOps-relevant command you fire through a shell—**Bash/POSIX builtins**, **GNU coreutils**, **find/grep/sed/awk** and companions, **ops extras** (`tar`, `curl`, `ssh`, `ss`, `jq`, …), **PowerShell high-traffic cmdlets**, and **cmd.exe builtins**.

This chapter answers: **what is on the list?** Depth chapters answer **how does each command work?** Chapter **32** answers **terminal vs shell**, **basic→advanced ladder**, and **command eras** from early Unix/Linux brownfield through modern Debian/RHEL/Alpine/macOS/Windows. Specialty chapters (**23–25**) teach flag decode, JSON, and recon—they are **not** the whole command surface.

**Read with:** **00** (first keystrokes) → **27** (this atlas) → **32** (eras/distros/terminal) → family depth chapters.

**Glyph legend (cross-OS):**

| Glyph | Meaning |
|-------|---------|
| **Y** | Present and usable in automation with usual caveats |
| **P** | Partial / different flags / subset (BSD, BusyBox, alias) |
| **N** | Absent natively — use substitute, WSL, or Git Bash |

Columns: **G** = Linux GNU · **B** = macOS BSD · **BB** = BusyBox · **PS** = PowerShell analog exists · **C** = cmd analog · **Depth** = chapter for extreme coverage.

---

## If you are brand new

1. The shell **runs commands**. Some are **builtins** (inside Bash); others are **external programs** on `PATH`.
2. Open this atlas when you wonder “is there a command for X?”
3. Jump to the **Depth** chapter; expand flags with chapter **23**.

```bash
# Ask the shell *how* a name will run (builtin? alias? file?)
type -a ls                  # -a: show all matches in order
type -a cd                  # cd is almost always a shell builtin
command -v jq               # Print path/name if jq exists; empty if not
# Breakdown:
#   type     = "explain this command name"
#   -a       = all resolutions (alias then function then builtin then file)
#   command -v = portable "does it exist?" for scripts
```

```powershell
# Same discovery habit on Windows / pwsh
Get-Command ls, Get-ChildItem |
  Format-Table Name, CommandType, Source
# Breakdown:
#   If ls is Alias -> Get-ChildItem, you are NOT running Unix /bin/ls
#   Prefer full cmdlet names in scripts (chapter 31)
```

---

## 1. Concepts

### 1. Shell = interpreter + command surface

| Layer | What you fire | Where depth lives |
|-------|---------------|-------------------|
| Builtins | `cd`, `export`, `set`, … | **28** |
| File / path / process userland | `ls`, `cp`, `find`, `ps`, … | **14** |
| Text / data shaping | `grep`, `sed`, `awk`, `sort`, … | **15** |
| Identity / time / env / disks / system | `id`, `date`, `env`, `df`, … | **29** |
| Archives / checksums / transfer | `tar`, `sha256sum`, `curl`, … | **30** |
| Network / process recon extras | `ss`, `lsof`, … | **25** |
| Structured data | `jq`, `ConvertFrom-Json` | **24** |
| PowerShell / cmd | cmdlets + batch builtins | **31** |
| Flag decode habit | any clustered flags | **23** |

### 2. How to use this atlas

1. Find the command by name (tables below are grouped; skim the family).
2. Note **builtin vs external vs cmdlet**.
3. Open **Depth**.
4. Check glyphs before assuming macOS/BusyBox/Windows parity.

### 3. What is deliberately not listed as primary depth

Full Microsoft Learn Windows commands hub (~750 admin utilities), GUI tools, every package manager subcommand encyclopedia (`apt`/`yum`/`dnf`/`apk`/`brew`/`winget` as **light** cross-links only), vendor appliance CLIs. Those belong in OS/admin tracks; this atlas marks the **shell DevOps surface**.

### 4. Progressive “first commands” (absolute beginner)

Do these in order on **your** OS, then again on one foreign OS (chapter **32** ladder):

| # | Unix/Linux/macOS | PowerShell | Job |
|---|------------------|------------|-----|
| 1 | `pwd` | `Get-Location` | Where am I? |
| 2 | `ls -la` | `Get-ChildItem -Force` | What is here? |
| 3 | `cd` / `cd -- "$dir"` | `Set-Location -LiteralPath` | Move |
| 4 | `mkdir -p` | `New-Item -ItemType Directory` | Create folder |
| 5 | `printf` / `cat` | `Set-Content` / `Get-Content` | Write/read file |
| 6 | `cp` / `mv` / `rm` | `Copy/Move/Remove-Item` | File ops |
| 7 | `whoami` / `id` | `whoami` | Identity |
| 8 | `uname -a` / `df -h` | `$PSVersionTable` / `Get-PSDrive` | Host/disk |
| 9 | `grep` / `find` | `Select-String` / `Get-ChildItem -Recurse` | Search |
| 10 | `ps` / `kill` | `Get-Process` / `Stop-Process` | Processes |

```bash
# --- First-10 lab (Unix): run line by line; read the comment above each ---
pwd                              # 1) working directory
ls -la                           # 2) -l long format, -a include dotfiles
mkdir -p ./atlas-lab             # 4) create nested path if needed
cd -- ./atlas-lab                # 3) -- guards odd path names
printf 'line1\nline2\n' > demo.txt   # 5) write two lines portably
cat demo.txt                     # 5) show file
cp demo.txt demo.copy            # 6) copy
mv demo.copy demo.moved          # 6) rename/move
whoami; id -un                   # 7) account name two ways
uname -s; df -h . | tail -n 1    # 8) OS family + disk for this filesystem
grep -n 'line' demo.txt          # 9) -n print line numbers
ps -p $$ -o pid,comm=            # 10) look at *this* shell process
rm -f -- demo.moved              # 6) remove one file safely (-- ends options)
```

```powershell
# --- First-10 lab (PowerShell) ---
Get-Location                                        # 1
Get-ChildItem -Force                                # 2 include hidden
New-Item -ItemType Directory -Force ./atlas-lab | Out-Null  # 4
Set-Location -LiteralPath ./atlas-lab               # 3
Set-Content -Path demo.txt -Value "line1","line2"   # 5
Get-Content demo.txt                                # 5
Copy-Item demo.txt demo.copy                        # 6
Move-Item demo.copy demo.moved                      # 6
whoami                                              # 7
$PSVersionTable.PSVersion
Get-PSDrive -PSProvider FileSystem | Select-Object -First 3  # 8
Select-String -Path demo.txt -Pattern 'line'        # 9
Get-Process -Id $PID | Format-List Id, ProcessName  # 10
Remove-Item -LiteralPath demo.moved -Force          # 6
```

### 5. Distro glyph extender (use with G/B/BB columns)

When the table says **G** (Linux GNU), refine with chapter **20**/**32**:

| Code | Meaning |
|------|---------|
| **G-deb** | Debian/Ubuntu GNU + **dash** as `/bin/sh` |
| **G-rhel** | RHEL-family GNU + often **Bash** as `/bin/sh` |
| **BB-alp** | Alpine BusyBox applets + ash |
| **legacy** | Old enterprise images: prefer `netstat`/`ifconfig`/`service` fallbacks |

---

## 2. Atlas — Bash / POSIX builtins

| Command | Job (one line) | G | B | BB | PS | C | Depth |
|---------|----------------|---|---|----|----|---|-------|
| `.` | Source a file in current shell | Y | Y | Y | `.` / `Import-Module` | `CALL` | **28** |
| `:` | No-op true builtin | Y | Y | Y | N | N | **28** |
| `[` | Synonym of `test` | Y | Y | Y | `-eq` etc. | `IF` | **28** |
| `alias` | Define alias (interactive-heavy) | Y | Y | P | `Set-Alias` | `doskey` | **28** |
| `bg` | Resume job in background | Y | Y | P | `Start-Job` | `START` | **28**, **08** |
| `bind` | Readline key bindings | Y | P | N | PSReadLine | N | **28** |
| `break` | Leave loop | Y | Y | Y | `break` | N | **28**, **06** |
| `builtin` | Run shell builtin, skip functions | Y | Y | P | N | N | **28** |
| `caller` | Stack frame (Bash) | Y | P | N | N | N | **28** |
| `cd` | Change directory | Y | Y | Y | `Set-Location` | `CD` | **28**, **14** |
| `command` | Skip aliases/functions; find cmd | Y | Y | Y | `Get-Command` | N | **28** |
| `compgen` | Generate completions (Bash) | Y | P | N | N | N | **28** |
| `complete` | Specify completions (Bash) | Y | P | N | Register-ArgumentCompleter | N | **28** |
| `continue` | Next loop iteration | Y | Y | Y | `continue` | N | **28**, **06** |
| `declare` | Attributes / types (Bash) | Y | P | N | `[type]` / scopes | `SET` | **28**, **05** |
| `dirs` | Directory stack list | Y | Y | P | N | N | **28** |
| `disown` | Remove job from table | Y | Y | P | N | N | **28**, **08** |
| `echo` | Print arguments (builtin form) | Y | Y | Y | `Write-Output` | `ECHO` | **28**, **29** |
| `enable` | Enable/disable builtins | Y | P | N | N | N | **28** |
| `eval` | Evaluate string as code (**danger**) | Y | Y | Y | `Invoke-Expression` | N | **28**, **18** |
| `exec` | Replace shell with command | Y | Y | Y | N | N | **28** |
| `exit` | Exit shell/script | Y | Y | Y | `exit` | `EXIT` | **28** |
| `export` | Mark variables for environment | Y | Y | Y | `$env:` | `SET` | **28**, **05** |
| `false` | Return failure status | Y | Y | Y | N | N | **28**, **29** |
| `fc` | Fix command / history editor | Y | Y | P | N | N | **28** |
| `fg` | Foreground job | Y | Y | P | N | N | **28**, **08** |
| `getopts` | Parse short options | Y | Y | Y | `param()` | N | **28** |
| `hash` | Remember command paths | Y | Y | P | N | N | **28** |
| `help` | Builtin help (Bash) | Y | P | N | `Get-Help` | `HELP` | **28** |
| `history` | Command history | Y | Y | P | `Get-History` | `doskey /history` | **28** |
| `jobs` | List jobs | Y | Y | P | `Get-Job` | N | **28**, **08** |
| `kill` | Signal jobs/PIDs (builtin form) | Y | Y | Y | `Stop-Process` | `taskkill` | **28**, **14** |
| `let` | Arithmetic (Bash) | Y | P | N | `[int]` ops | `SET /A` | **28** |
| `local` | Function-local vars (Bash) | Y | P | P | scope | N | **28**, **07** |
| `logout` | Exit login shell | Y | Y | P | N | N | **28** |
| `mapfile` / `readarray` | Read lines into array (Bash) | Y | N* | N | `Get-Content` | N | **28** |
| `popd` | Pop directory stack | Y | Y | P | `Pop-Location` | `POPD` | **28** |
| `printf` | Formatted print (builtin) | Y | Y | Y | `{0}` / `-f` | `ECHO` | **28**, **29** |
| `pushd` | Push directory stack | Y | Y | P | `Push-Location` | `PUSHD` | **28** |
| `pwd` | Print working directory | Y | Y | Y | `Get-Location` | `CD` (print) | **28**, **14** |
| `read` | Read line into vars | Y | Y | Y | `Read-Host` | `SET /P` | **28** |
| `readonly` | Immutable variables | Y | Y | Y | N | N | **28**, **05** |
| `return` | Return from function/source | Y | Y | Y | `return` | N | **28**, **07** |
| `set` | Options and positional params | Y | Y | Y | preference vars | `SET` | **28**, **16** |
| `shift` | Shift `$1`… | Y | Y | Y | N | `SHIFT` | **28** |
| `shopt` | Bash shell options | Y | N | N | N | N | **28** |
| `source` | Same family as `.` | Y | Y | P | `.` | `CALL` | **28** |
| `suspend` | Suspend shell | Y | Y | P | N | N | **28** |
| `test` | Conditional expressions | Y | Y | Y | `-eq` / `Test-*` | `IF` | **28**, **06** |
| `times` | Shell/process times | Y | Y | P | `Measure-Command` | N | **28** |
| `trap` | Signal/EXIT handlers | Y | Y | Y | `try/finally` | N | **28**, **16** |
| `true` | Return success | Y | Y | Y | N | N | **28**, **29** |
| `type` | Describe how name resolves | Y | Y | P | `Get-Command` | N | **28** |
| `typeset` | Synonym of `declare` (Bash) | Y | P | N | N | N | **28** |
| `ulimit` | Resource limits | Y | Y | P | N | N | **28** |
| `umask` | Default file mode mask | Y | Y | Y | N | N | **28** |
| `unalias` | Remove alias | Y | Y | P | `Remove-Alias` | N | **28** |
| `unset` | Unset vars/functions | Y | Y | Y | `Remove-Variable` | `SET VAR=` | **28** |
| `wait` | Wait for jobs/PIDs | Y | Y | Y | `Wait-Job` / `Wait-Process` | N | **28**, **08** |

\*macOS stock Bash 3.2: no `mapfile`; use loops. Homebrew Bash 5: Y.

---

## 3. Atlas — files, paths, processes (coreutils + findutils)

| Command | Job | G | B | BB | PS | C | Depth |
|---------|-----|---|---|----|----|---|-------|
| `ls` | List directory | Y | P | P | `Get-ChildItem` | `DIR` | **14**, **23** |
| `cp` | Copy | Y | P | P | `Copy-Item` | `COPY` | **14** |
| `mv` | Move/rename | Y | Y | Y | `Move-Item` | `MOVE`/`REN` | **14** |
| `rm` | Remove | Y | Y | Y | `Remove-Item` | `DEL`/`RD` | **14** |
| `mkdir` | Make directories | Y | Y | Y | `New-Item` | `MD` | **14** |
| `rmdir` | Remove empty dirs | Y | Y | Y | `Remove-Item` | `RD` | **14** |
| `ln` | Links (hard/symlink) | Y | Y | P | `New-Item -ItemType SymbolicLink` | `mklink` | **14** |
| `touch` | Create/update timestamps | Y | Y | Y | `(Get-Item).LastWriteTime=` | N | **14** |
| `chmod` | Mode bits | Y | Y | P | ACL cmdlets (Win) | `icacls` | **14** |
| `chown` | Owner | Y | Y | P | ACL | `icacls` / `takeown` | **14** |
| `chgrp` | Group | Y | Y | P | N | N | **14** |
| `stat` | Metadata | Y | P | P | `Get-Item`/`Get-Acl` | `DIR` | **14** |
| `readlink` | Resolve symlink text | Y | P | P | `(Get-Item).Target` | N | **14** |
| `realpath` | Canonical path | Y | P* | P | `Resolve-Path` | N | **14** |
| `basename` | Strip directory | Y | Y | Y | `Split-Path -Leaf` | N | **14** |
| `dirname` | Strip leaf | Y | Y | Y | `Split-Path -Parent` | N | **14** |
| `mktemp` | Safe temp path | Y | Y | P | `[IO.Path]::GetTempFileName()` | N | **14** |
| `install` | Copy with mode | Y | P | P | `Copy-Item`+ACL | N | **14** |
| `dd` | Block copy / devices | Y | Y | P | N | N | **14** |
| `truncate` | Set file size | Y | P | P | N | N | **14** |
| `shred` | Overwrite file data | Y | N | P | N | N | **14** |
| `sync` | Flush filesystem buffers | Y | Y | Y | N | N | **14** |
| `mkfifo` | Named pipe | Y | Y | Y | N | N | **14** |
| `mknod` | Special files | Y | Y | P | N | N | **14** |
| `pathchk` | Check pathname portability | Y | P | P | N | N | **14** |
| `find` | Walk tree by predicates | Y | P | P | `Get-ChildItem -Recurse` | `DIR /S` | **14**, **15** |
| `xargs` | Build argv from stdin | Y | P | P | `ForEach-Object` | N | **15** |
| `locate` | DB filename search | Y | P | P | N | N | **15** |
| `ps` | Process list | Y | P | P | `Get-Process` | `tasklist` | **14**, **25** |
| `kill` | Signal (external too) | Y | Y | Y | `Stop-Process` | `taskkill` | **14** |
| `pgrep` / `pkill` | Find/signal by name | Y | Y | P | `Get-Process -Name` | N | **14**, **25** |
| `top` / `htop` | Interactive process view | Y | Y | P | `Get-Process` | `taskmgr` | **25** |
| `lsof` | Open files / ports | Y | Y | N | `Get-NetTCPConnection` etc. | N | **25** |

\*macOS: `realpath` may need coreutils/Homebrew; `readlink -f` is GNU-leaning.

---

## 4. Atlas — text and data shaping

| Command | Job | G | B | BB | PS | C | Depth |
|---------|-----|---|---|----|----|---|-------|
| `cat` | Concatenate / print | Y | Y | Y | `Get-Content` | `TYPE` | **15** |
| `head` | First lines | Y | Y | Y | `Select-Object -First` | `more` | **15** |
| `tail` | Last lines / follow | Y | Y | Y | `Get-Content -Tail/-Wait` | N | **15** |
| `tee` | Copy stdout to files | Y | Y | Y | `Tee-Object` | N | **15** |
| `wc` | Count lines/words/bytes | Y | Y | Y | `Measure-Object` | N | **15** |
| `nl` | Number lines | Y | Y | P | N | N | **15** |
| `od` | Dump bytes | Y | Y | P | `Format-Hex` | N | **15** |
| `cut` | Columns by bytes/fields | Y | Y | Y | `-split` / `ConvertFrom-Csv` | N | **15** |
| `paste` | Merge lines | Y | Y | Y | N | N | **15** |
| `tr` | Translate/delete chars | Y | Y | Y | `-replace` | N | **15** |
| `sort` | Sort lines | Y | P | P | `Sort-Object` | `SORT` | **15** |
| `uniq` | Deduplicate adjacent | Y | Y | Y | `Select-Object -Unique` | N | **15** |
| `comm` | Compare sorted files | Y | Y | P | `Compare-Object` | `FC` | **15** |
| `expand` / `unexpand` | Tabs ↔ spaces | Y | Y | P | N | N | **15** |
| `fmt` / `fold` | Reflow / wrap | Y | Y | P | N | N | **15** |
| `pr` | Paginate for print | Y | Y | P | N | N | **15** |
| `split` / `csplit` | Split files | Y | P | P | N | N | **15** |
| `tac` | Reverse line order | Y | N | P | N | N | **15** |
| `rev` | Reverse characters | Y | Y | P | N | N | **15** |
| `grep` | Match lines | Y | P | P | `Select-String` | `findstr` | **15**, **23** |
| `egrep` / `fgrep` | Historic grep modes | Y | P | P | `Select-String` | N | **15** |
| `sed` | Stream edit | Y | P | P | `-replace` | N | **15** |
| `awk` | Field language | Y | Y | P | objects | N | **15** |
| `diff` / `patch` | Diff / apply | Y | Y | P | `Compare-Object` | `FC` | **15** |
| `less` / `more` | Pagers | Y | Y | P | `Out-Host -Paging` | `MORE` | **15** |
| `jq` | JSON query/filter | Y* | Y* | N* | `ConvertFrom-Json` | N | **24** |

\*Often package-installed, not base image.

---

## 5. Atlas — identity, time, environment, disks, system

| Command | Job | G | B | BB | PS | C | Depth |
|---------|-----|---|---|----|----|---|-------|
| `id` | UIDs/GIDs | Y | Y | Y | `[Security.Principal.WindowsIdentity]` | `whoami` | **29** |
| `whoami` | Current user name | Y | Y | Y | `$env:USERNAME` / `whoami.exe` | `whoami` | **29** |
| `groups` | Group membership | Y | Y | Y | N | `whoami /groups` | **29** |
| `logname` | Login name | Y | Y | P | N | N | **29** |
| `who` / `users` / `pinky` | Logged-in users | Y | Y | P | `query user` | `query user` | **29** |
| `date` | Date/time format | Y | P | P | `Get-Date` | `DATE`/`TIME` | **29** |
| `env` | Run with env / print | Y | Y | Y | `$env:` / `Get-ChildItem Env:` | `SET` | **29** |
| `printenv` | Print environment | Y | Y | Y | `Get-ChildItem Env:` | `SET` | **29** |
| `uname` | Kernel/OS identity | Y | Y | Y | `$PSVersionTable` / `winver` | `VER` | **29** |
| `hostname` | Host name | Y | Y | Y | `$env:COMPUTERNAME` | `HOSTNAME` | **29** |
| `hostid` | Host id (historic) | Y | P | P | N | N | **29** |
| `nproc` | CPU count | Y | P* | P | `$env:NUMBER_OF_PROCESSORS` | N | **29** |
| `tty` | Terminal device | Y | Y | Y | N | N | **29** |
| `df` | Filesystem free space | Y | P | P | `Get-PSDrive` / `Get-Volume` | N | **29** |
| `du` | Directory disk usage | Y | P | P | similar scripts | N | **29** |
| `sleep` | Delay | Y | Y | Y | `Start-Sleep` | `TIMEOUT` | **29** |
| `timeout` | Bound command runtime | Y | P* | P | jobs / `Wait-Process` | `TIMEOUT` | **29** |
| `nice` | Adjust niceness | Y | Y | P | N | `START /LOW` | **29** |
| `nohup` | Ignore hangup | Y | Y | Y | jobs / services | `START` | **29** |
| `true` / `false` | Status constants | Y | Y | Y | N | N | **29** |
| `yes` | Repeat string | Y | Y | Y | N | N | **29** |
| `seq` | Number sequences | Y | P* | P | `1..n` | N | **29** |
| `expr` | Legacy expression eval | Y | Y | Y | expressions | `SET /A` | **29** |
| `factor` / `numfmt` | Math / number format | Y | P | P | .NET format | N | **29** |
| `stdbuf` | Stdio buffering control | Y | N | P | N | N | **29** |
| `stty` | Terminal settings | Y | Y | P | N | N | **29** |
| `uptime` | Load / uptime | Y | Y | Y | `(Get-CimInstance Win32_OperatingSystem)` | N | **29** |

\*Often GNU coreutils / Homebrew on macOS.

---

## 6. Atlas — archives, checksums, transfer, remote shell

| Command | Job | G | B | BB | PS | C | Depth |
|---------|-----|---|---|----|----|---|-------|
| `tar` | Archives | Y | P | P | `Compress-Archive` (zip) | N | **30**, **23** |
| `gzip` / `gunzip` | Compress | Y | Y | P | `Compress-Archive` | N | **30** |
| `bzip2` / `xz` / `zstd` | Compressors | Y* | Y* | P | N | N | **30** |
| `zip` / `unzip` | Zip archives | Y* | Y* | P | `Compress/Expand-Archive` | N | **30** |
| `cksum` / `sum` | Checksums | Y | Y | P | `Get-FileHash` | `certutil -hashfile` | **30** |
| `md5sum` | MD5 digest | Y | P* | P | `Get-FileHash -Algorithm MD5` | `certutil` | **30** |
| `sha1sum` / `sha256sum` / `sha512sum` | SHA digests | Y | P* | P | `Get-FileHash` | `certutil` | **30** |
| `base64` / `basenc` | Encode/decode | Y | P | P | `[Convert]::ToBase64String` | `certutil -encode` | **30** |
| `curl` | HTTP/URL transfer | Y | Y | P | `Invoke-WebRequest` | N | **30**, **25** |
| `wget` | HTTP download | Y* | Y* | P | `Invoke-WebRequest` | N | **30** |
| `ssh` | Remote shell | Y | Y | P | `ssh` (Win OpenSSH) | N | **30** |
| `scp` / `sftp` | Remote copy | Y | Y | P | `scp` / WinSCP | N | **30** |
| `rsync` | Efficient sync | Y* | Y* | N | N | N | **30** |

---

## 7. Atlas — network / process recon (ops + security literacy)

| Command | Job | Depth |
|---------|-----|-------|
| `ss` | Socket statistics (Linux) | **25**, **23** |
| `netstat` | Legacy sockets | **25**, **23** |
| `ip` / `ifconfig` | Interfaces | **25** |
| `ping` / `traceroute`/`tracert` | Reachability | **25** |
| `dig` / `nslookup` / `host` | DNS | **25** |
| `nmap` | Port scan (install; policy-bound) | **25** (literacy only) |
| `tcpdump` / `Wireshark` | Capture (privilege) | OS/security tracks |
| `Get-NetTCPConnection` | PS socket view | **25**, **31** |

---

## 8. Atlas — PowerShell high-traffic cmdlets (summary)

Full named-parameter depth: chapter **31**. Families:

| Family | Examples | Depth |
|--------|----------|-------|
| Navigation / location | `Get-Location`, `Set-Location`, `Push-Location` | **31**, **14** |
| Items | `Get/Set/New/Remove/Copy/Move-Item` | **31**, **14** |
| Content | `Get-Content`, `Set-Content`, `Add-Content` | **31**, **15** |
| Path | `Join-Path`, `Split-Path`, `Test-Path`, `Resolve-Path` | **31** |
| Process | `Get-Process`, `Start-Process`, `Stop-Process`, `Wait-Process` | **31**, **14** |
| Job | `Start-Job`, `Receive-Job`, `Wait-Job`, `Remove-Job` | **31**, **08** |
| Object shaping | `Where-Object`, `ForEach-Object`, `Select-Object`, `Sort-Object`, `Group-Object`, `Measure-Object` | **31**, **15** |
| Output | `Write-Output`, `Write-Host`, `Out-Null`, `Out-File`, `Tee-Object` | **31** |
| JSON/CSV | `ConvertFrom-Json`, `ConvertTo-Json`, `Import-Csv`, `Export-Csv` | **31**, **24** |
| Web | `Invoke-WebRequest`, `Invoke-RestMethod` | **31**, **30** |
| Command discovery | `Get-Command`, `Get-Help`, `Get-Alias` | **31**, **28** |
| Modules | `Import-Module`, `Get-Module` | **31** |
| Dangerous | `Invoke-Expression` | **31**, **18** |

---

## 9. Atlas — cmd.exe builtins

| Builtin | Job | Depth |
|---------|-----|-------|
| `ASSOC` / `FTYPE` | File associations | **31**, **13** |
| `CALL` | Call batch / labels | **31**, **13** |
| `CD` / `CHDIR` | Directory | **31**, **14** |
| `CLS` | Clear screen | **31** |
| `COLOR` | Console colors | **31** |
| `COPY` | Copy files | **31**, **14** |
| `DATE` / `TIME` | Date/time | **31**, **29** |
| `DEL` / `ERASE` | Delete files | **31**, **14** |
| `DIR` | List | **31**, **14** |
| `ECHO` | Print / echo mode | **31** |
| `ENDLOCAL` / `SETLOCAL` | Localize environment | **31**, **13** |
| `EXIT` | Exit | **31** |
| `FOR` | Iterate | **31**, **13** |
| `GOTO` | Jump | **31**, **13** |
| `IF` | Conditional | **31**, **13** |
| `MD` / `MKDIR` | Make dir | **31**, **14** |
| `MOVE` | Move | **31**, **14** |
| `PATH` | Show/set PATH | **31** |
| `PAUSE` | Wait for key | **31** |
| `POPD` / `PUSHD` | Dir stack | **31** |
| `PROMPT` | Prompt string | **31** |
| `RD` / `RMDIR` | Remove dir | **31**, **14** |
| `REM` | Comment | **31** |
| `REN` / `RENAME` | Rename | **31**, **14** |
| `SET` | Environment / vars | **31** |
| `SHIFT` | Shift args | **31** |
| `START` | Start process/window | **31** |
| `TITLE` | Window title | **31** |
| `TYPE` | Print file | **31**, **15** |
| `VER` / `VERIFY` / `VOL` | Version / verify / volume | **31** |

---

## 10. Advanced concepts

### 1. Same name, different program

| Name | Trap |
|------|------|
| `ls` in `pwsh` | Often alias → `Get-ChildItem` |
| `curl` on Windows | May be `Invoke-WebRequest` alias historically |
| `find` in cmd | Completely different from Unix `find` |
| `sort` | GNU vs BSD flags; locale order |
| `echo` | Builtin vs `/bin/echo`; `-e` not portable |

Always `type` / `Get-Command` before trusting flags from memory.

### 2. BusyBox collapses many names into one binary

Alpine images may provide `ls`, `cp`, `grep` as **applets** with reduced flags. Atlas glyph **P** means: prove on the image, do not assume GNU long options.

### 3. Atlas vs man pages

This atlas is the **inventory and routing table**. Official manuals remain authoritative for rare flags. Chapter **23** teaches how to read them. Chapter **32** teaches which **era/distro** of manual you are on.

### 4. Remaining GNU coreutils (complete the stone-turning)

Already covered in family tables above: primary file/text/identity tools. These additional coreutils still appear in scripts—depth notes here; treat BusyBox as **P** unless proven.

| Command | Job | Depth / notes |
|---------|-----|---------------|
| `arch` | Print machine arch (often `uname -m`) | **29** |
| `b2sum` / `basenc` | Checksums / encodings | **30** |
| `chcon` / `runcon` | SELinux context | Linux only; OS security track |
| `chroot` | Run with new root | Privileged; containers usually better |
| `cksum` / `sum` | POSIX checksums | **30** |
| `comm` | Compare sorted files | **15** |
| `csplit` | Split by context | **15** |
| `dir` / `vdir` | `ls`-like (GNU) | Prefer `ls` |
| `dircolors` | LS_COLORS helper | Interactive |
| `expand` / `unexpand` | Tabs ↔ spaces | **15** |
| `factor` | Factorize integers | Niche |
| `fmt` / `fold` / `pr` / `ptx` | Text formatting | **15** |
| `join` | Join sorted files on field | **15** |
| `link` / `unlink` | Hard link / unlink syscall helpers | Prefer `ln`/`rm` |
| `logname` | Login name | **29** |
| `nice` / `nohup` / `stdbuf` | Scheduling / hangup / buffering | **29** |
| `numfmt` | Format numbers | GNU; **29** |
| `od` | Dump bytes | **15** |
| `pathchk` | Check path portability | **14** |
| `pinky` / `users` / `who` | User listing | **29** |
| `seq` | Number sequences | **29** |
| `shuf` | Shuffle lines | GNU; useful in tests |
| `stat` | Metadata | **14** |
| `stty` | Terminal modes | **29** / **32** |
| `sync` | Flush FS | **14** |
| `tac` | Reverse lines | GNU; macOS often N |
| `timeout` | Bound runtime | **29** |
| `truncate` / `shred` | Size / overwrite | **14** |
| `tsort` | Topological sort | Niche build graphs |
| `tty` | Print tty name | **29** |
| `uptime` | Uptime/load | **29** |
| `yes` | Repeat string | **29** |

### 5. Package managers (recognition only — not full encyclopedias)

| OS family | Common CLI | Shell track stance |
|-----------|------------|--------------------|
| Debian/Ubuntu | `apt` / `apt-get` / `dpkg` | Recognize; pin in Dockerfiles; deep OS track |
| RHEL family | `dnf` / `yum` / `rpm` | Same |
| Alpine | `apk` | Same |
| SUSE | `zypper` | Same |
| macOS | `brew` | Same |
| Windows | `winget` / `choco` / `msiexec` | Same |
| Language | `pip`/`npm`/`gem` | Not shell builtins—call as externals |

### 6. Editors / pagers / multiplexers (surface literacy)

| Tool | Job | Automation? |
|------|-----|-------------|
| `less` / `more` | Page output | Interactive |
| `vi` / `vim` / `nano` | Edit files | Prefer non-interactive `sed`/`Set-Content` in CI |
| `tmux` / `screen` | Multiplex terminals | Host layer (**32**)—not a dialect |

---

## 11. Applications

- **Onboarding:** Print this chapter’s family list; tick commands the team actually uses in CI.
- **Incident:** Name the command + OS glyph before blaming “the shell.”
- **ADR:** Team default dialect + forbidden interactive-only commands in automation.
- **Security review:** Flag `eval`, `iex`, `curl|sh`, and recon tools used in scripts (chapters **18**, **25**).

### Staff-level review checklist

- Engineers know atlas **27** is the command index; depth is in **14–15**, **28–31**, **23–25**; eras/terminal ladder in **32**.
- Absolute beginners complete the Stage 0–2 progressive list before advanced chapters.
- CI images’ BusyBox/GNU/dash mix is proven for listed commands (**20**, **32**).
- PowerShell aliases are not confused with Unix binaries.
- cmd builtins are used only for legacy batch; new Windows work prefers `pwsh` (**31**).
- No automation depends on interactive-only builtins (`bind`, completion) without fallback.
- Brownfield estates have legacy networking/service command fallbacks documented.

---

## References

- [GNU coreutils documentation](https://www.gnu.org/software/coreutils/manual/)
- [GNU Bash manual — Bourne Shell Builtins / Bash Builtins](https://www.gnu.org/software/bash/manual/)
- [POSIX utilities](https://pubs.opengroup.org/onlinepubs/9699919799/idx/utilities.html)
- [PowerShell documentation](https://learn.microsoft.com/powershell/)
- [Windows Commands](https://learn.microsoft.com/windows-server/administration/windows-commands/windows-commands)
- [jq manual](https://jqlang.github.io/jq/manual/)
- [BusyBox](https://busybox.net/)
- [Debian Policy](https://www.debian.org/doc/debian-policy/)

---

[← Back to Shell](./README.md)
