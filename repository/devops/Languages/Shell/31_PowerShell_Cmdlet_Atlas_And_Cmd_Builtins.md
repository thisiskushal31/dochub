# PowerShell cmdlet atlas and cmd.exe builtins

[← Back to Shell](./README.md)

## What this chapter covers

The **Windows-native command surface** for this track: **high-traffic PowerShell cmdlet families** (with named-parameter decode) and **every cmd.exe builtin** used in batch. The Master Atlas (**27**) indexes names; language shape is in **12**/**13**. Unix twins are in **14–15**, **28–30**.

**Out of primary depth:** the full Microsoft Learn Windows commands hub (~750 admin utilities). Those are Windows OS administration—link to Learn / OS track when needed; they are not “missing shell chapters.”

---

## If you are brand new

```powershell
# --- Discover before you memorize ---
Get-Command Get-ChildItem
# Shows CommandType=Cmdlet and the module that owns it

Get-Help Get-ChildItem -Parameter Force
# Named-parameter decode: -Force includes hidden/system items (rough ls -a)

Get-Alias ls
# If ls -> Get-ChildItem, scripts should call Get-ChildItem explicitly

Get-ChildItem -Force
# Actually list; -Force is the parameter, not a magic blob
```

```bat
REM cmd builtins are uppercase by convention; case usually does not matter
DIR /A
REM /A = show entries with attributes (including hidden, depending on filters)
CD /D C:\Temp
REM /D allows changing drive letter and directory together
ECHO %CD%
REM %CD% expands to the current directory string
```

Discover first; then memorize families—not opaque one-liners.

---

## 1. Concepts

### 1. Cmdlet vs external vs alias

| Kind | Example | How to see |
|------|---------|------------|
| Cmdlet | `Get-ChildItem` | `Get-Command` → Cmdlet |
| Function | profile helpers | CommandType Function |
| Alias | `ls` → `Get-ChildItem` | `Get-Alias ls` |
| Application | `curl.exe`, `git.exe` | CommandType Application |

**Staff rule:** scripts use **full cmdlet names**; aliases are interactive sugar (same rule as Bash aliases in **28**).

### 2. Named parameters = flag decode for PowerShell

Unix: expand `-tulpn`. PowerShell: expand each `-Parameter`:

```powershell
Get-Help Get-ChildItem -Parameter Recurse
```

Chapter **23** habit still applies—read help text, do not treat the line as a blob.

### 3. Object pipeline vs text

Bash pipes **bytes**. PowerShell pipes **objects**. Text/JSON depth: **15**, **24**.

---

## 2. PowerShell high-traffic families in depth

### Family A — location / navigation

| Cmdlet | Job | Unix cousin |
|--------|-----|-------------|
| `Get-Location` | Print location | `pwd` |
| `Set-Location` | Change location | `cd` |
| `Push-Location` / `Pop-Location` | Stack | `pushd`/`popd` |

```powershell
Set-Location -LiteralPath $target
Get-Location
```

| Parameter | Meaning |
|-----------|---------|
| `-LiteralPath` | No wildcard magic |
| `-Path` | May interpret wildcards |

### Family B — items (files/dirs and providers)

| Cmdlet | Job | Unix cousin |
|--------|-----|-------------|
| `Get-ChildItem` | List | `ls`/`find` (lite) |
| `Get-Item` | One item | `stat` lite |
| `New-Item` | Create | `mkdir`/`touch`/`ln` |
| `Remove-Item` | Delete | `rm`/`rmdir` |
| `Copy-Item` | Copy | `cp` |
| `Move-Item` | Move | `mv` |
| `Rename-Item` | Rename | `mv` |
| `Clear-Item` | Clear content/value | varies |

```powershell
Get-ChildItem -Path . -Force -Recurse -File -Filter *.log
New-Item -ItemType Directory -Path .\out -Force
Copy-Item -LiteralPath $src -Destination $dst -Recurse
Remove-Item -LiteralPath $tmp -Recurse -Force
```

| Parameter | Meaning |
|-----------|---------|
| `-Force` | Hidden/system; overwrite behaviors |
| `-Recurse` | Descend |
| `-File` / `-Directory` | Restrict kind |
| `-Filter` | Provider filter (fast) |
| `-Include`/`-Exclude` | Additional filters (with recurse caveats) |
| `-WhatIf` | Dry run |
| `-Confirm` | Prompt |

### Family C — content

| Cmdlet | Job | Unix cousin |
|--------|-----|-------------|
| `Get-Content` | Read lines | `cat`/`tail` |
| `Set-Content` | Write | redirect |
| `Add-Content` | Append | `>>` |
| `Clear-Content` | Empty file | `: >file` |

```powershell
Get-Content -Path .\app.log -Tail 100 -Wait
Set-Content -Path .\out.txt -Value $text -Encoding utf8
```

| Parameter | Meaning |
|-----------|---------|
| `-Tail` | Last N lines |
| `-Wait` | Follow (like `tail -f`) |
| `-Raw` | Single string |
| `-Encoding` | Encoding (be explicit in CI) |
| `-TotalCount` | First N |

### Family D — path

| Cmdlet | Job |
|--------|-----|
| `Join-Path` | Combine safely |
| `Split-Path` | Parent/leaf |
| `Test-Path` | Exists? |
| `Resolve-Path` | Canonical / glob resolve |
| `Convert-Path` | Provider path → native |

```powershell
$p = Join-Path $root 'logs'
Test-Path -LiteralPath $p
```

### Family E — process

| Cmdlet | Job | Unix cousin |
|--------|-----|-------------|
| `Get-Process` | List | `ps` |
| `Start-Process` | Spawn | `&` / execve |
| `Stop-Process` | Kill | `kill` |
| `Wait-Process` | Wait | `wait` |

```powershell
Get-Process -Name pwsh
Stop-Process -Id $pid -Force
Start-Process -FilePath pwsh -ArgumentList '-File','./task.ps1' -Wait -NoNewWindow
```

### Family F — jobs

| Cmdlet | Job |
|--------|-----|
| `Start-Job` | Background job |
| `Get-Job` | List |
| `Receive-Job` | Read output |
| `Wait-Job` | Wait |
| `Remove-Job` | Cleanup |
| `Stop-Job` | Cancel |

Prefer for local async; remoting/jobs differ by edition (5.1 vs 7).

### Family G — object shaping

| Cmdlet | Job | Unix cousin (loose) |
|--------|-----|---------------------|
| `Where-Object` | Filter | `grep`/`awk` |
| `ForEach-Object` | Map | `xargs`/loops |
| `Select-Object` | Project/limit | `cut`/`head` |
| `Sort-Object` | Sort | `sort` |
| `Group-Object` | Group | `uniq -c` lite |
| `Measure-Object` | Count/sum | `wc` |
| `Compare-Object` | Diff collections | `diff`/`comm` |
| `Tee-Object` | Tee | `tee` |

```powershell
Get-ChildItem |
  Where-Object { $_.Length -gt 1MB } |
  Select-Object -First 20 FullName, Length |
  Sort-Object Length -Descending
```

Aliases `%` = `ForEach-Object`, `?` = `Where-Object`—**interactive only** in staff style.

### Family H — output and host

| Cmdlet | Job |
|--------|-----|
| `Write-Output` | Pipeline output |
| `Write-Host` | Host display (not data) |
| `Write-Error` / `Write-Warning` / `Write-Verbose` / `Write-Debug` | Streams |
| `Out-Null` | Discard |
| `Out-File` | Write file |
| `Out-String` | Render as string |
| `Format-Table` / `Format-List` | **Formatting** (end of pipeline) |

Staff: do not `Format-*` then expect objects downstream.

### Family I — JSON / CSV / XML

| Cmdlet | Job | Depth |
|--------|-----|-------|
| `ConvertFrom-Json` / `ConvertTo-Json` | JSON | **24** |
| `Import-Csv` / `Export-Csv` | CSV | here + **15** |
| `ConvertTo-Xml` / `Select-Xml` | XML | as needed |

```powershell
Get-Content .\app.json -Raw | ConvertFrom-Json |
  Select-Object -ExpandProperty items
```

### Family J — web

| Cmdlet | Job | Unix cousin |
|--------|-----|-------------|
| `Invoke-WebRequest` | HTTP response object | `curl` |
| `Invoke-RestMethod` | Deserialize JSON/XML | `curl`+`jq` |

```powershell
Invoke-WebRequest -Uri $url -OutFile .\f.bin
Invoke-RestMethod -Uri $url -Method Get
```

| Parameter | Meaning |
|-----------|---------|
| `-Uri` | URL |
| `-OutFile` | Save body |
| `-Method` | Verb |
| `-Headers` | Headers hashtable |
| `-SkipCertificateCheck` | **Danger** — lab only (PS 7+) |

### Family K — discovery / help / modules

| Cmdlet | Job |
|--------|-----|
| `Get-Command` | Resolve names |
| `Get-Help` | Help |
| `Get-Alias` | Aliases |
| `Get-Member` | Inspect object members |
| `Import-Module` / `Get-Module` | Modules |
| `Update-Help` | Help content |

### Family L — dangerous

| Cmdlet | Risk | Prefer |
|--------|------|--------|
| `Invoke-Expression` | Code injection twin of `eval` | Structured calls, argv |
| downloading + `iex` | Supply-chain classic | Checksums + signed modules |

Threat model: chapter **18**.

### Edition notes

| Topic | Windows PowerShell 5.1 | PowerShell 7.x |
|-------|------------------------|----------------|
| Cross-platform | N | Y |
| `curl` alias → IWR | Common | Still watch aliases |
| New HTTP opts | Older | Richer |
| Remoting defaults | WinRM-centric | Cross-plat evolves |

Pin `$PSVersionTable.PSVersion` in CI (chapter **02**, **12**).

---

## 3. cmd.exe builtins in depth

Complete **builtin** set for DevOps batch literacy (chapter **13** for language). External Windows admin tools (`diskpart`, `bcdedit`, …) → Learn / OS track—not duplicated here.

### Catalog with depth notes

| Builtin | Job | High-traffic switches / notes |
|---------|-----|-------------------------------|
| `ASSOC` | File extension association | `ASSOC .ext=Type` |
| `FTYPE` | Open command for type | Pairs with `ASSOC` |
| `CALL` | Call subroutine / other bat | Required for labels with return |
| `CD` / `CHDIR` | Directory | `CD /D D:\path` changes drive too |
| `CLS` | Clear screen | Interactive |
| `COLOR` | Console colors | Interactive |
| `COPY` | Copy files | `COPY /Y` overwrite without prompt |
| `DATE` | Date | Restricted on some locked systems |
| `TIME` | Time | Same |
| `DEL` / `ERASE` | Delete files | `DEL /F /Q`; no recycle |
| `DIR` | List | `DIR /A /B /S` — bare recursive names |
| `ECHO` | Print / echo on\|off | `ECHO.` blank line idiom |
| `SETLOCAL` | Localize env + extensions | Prefer top of modern bats |
| `ENDLOCAL` | End local scope | Loses set vars unless careful |
| `EXIT` | Exit | `EXIT /B code` from bat without closing `cmd` |
| `FOR` | Iterate | `FOR %f IN (…) DO …` — use `%%f` inside `.bat` |
| `GOTO` | Jump to `:label` | Prefer structured `CALL` where possible |
| `IF` | Conditional | `IF EXIST`, `IF /I`, `IF ERRORLEVEL` |
| `MD` / `MKDIR` | Make directory | Creates one level unless extensions |
| `MOVE` | Move | |
| `PATH` | Show/set PATH | `PATH` vs `SET PATH=` |
| `PAUSE` | Press any key | Interactive runbooks only |
| `POPD` / `PUSHD` | Dir stack | Also can map UNC temporarily |
| `PROMPT` | Prompt string | Interactive |
| `RD` / `RMDIR` | Remove directory | `RD /S /Q` destructive |
| `REM` | Comment | Prefer `::` carefully; `REM` safest |
| `REN` / `RENAME` | Rename | Same directory semantics |
| `SET` | Env / vars | `SET VAR=value`; `SET /A` math; `SET /P` prompt |
| `SHIFT` | Shift `%1` | |
| `START` | Start process/window | `START /WAIT`; quoting rules painful |
| `TITLE` | Window title | |
| `TYPE` | Print file | Like `cat` |
| `VER` | OS version | |
| `VERIFY` | Verify writes | Rare |
| `VOL` | Volume label | |

### Decode examples

**`DIR /A /B /S`**

| Piece | Meaning |
|-------|---------|
| `/A` | All attributes (include hidden/system per rules) |
| `/B` | Bare names |
| `/S` | Recurse subdirectories |

**`CD /D "%~dp0"`** — change to the drive/directory of the batch file (common bootstrap).

**`IF ERRORLEVEL 1`** — true if exit code ≥ 1 (classic gotcha vs `NEQ 0` styles).

### cmd vs PowerShell staff policy

| New automation | Prefer |
|----------------|--------|
| Windows servers/agents | PowerShell 7 (`pwsh`) |
| Legacy installer constraints | Thin `cmd` / `.bat` calling `pwsh -File` |
| Parsing JSON / HTTP | PowerShell, not `cmd` |

---

## 4. Advanced concepts

### 1. Alias collision table (Windows)

| Typed name | May actually be | Prefer |
|------------|-----------------|--------|
| `ls` | `Get-ChildItem` | `Get-ChildItem` |
| `curl` | `Invoke-WebRequest` (historical) | `curl.exe` / IWR explicit |
| `wget` | may be missing | IWR |
| `sort` | may be OS `sort.exe` vs thoughts of GNU | Qualify path |

### 2. Execution policy vs builtins

Execution policy blocks **scripts**, not interactive cmdlets. Literacy: chapter **12**, **18**. Do not “fix” policy with `iex` downloads.

### 3. JEA / constrained endpoints

Analogous in spirit to restricted shells (**22**)—not the same mechanism. Know they exist for locked-down admin.

### 4. Exists / missing vs Unix atlas

Every family above has Unix cousins in **27**. Perfect flag parity is false; perfect **job** parity is the goal.

### 5. Windows command eras (cmd → PS → Terminal)

| Era | What you fire | Still seen when… |
|-----|---------------|------------------|
| `cmd.exe` batch | Builtins in this chapter | Installers, legacy scheduled tasks |
| PowerShell **2.0** | Limited cmdlets; old remoting | Forgotten agents—replace (**21**) |
| Windows PowerShell **5.1** | Full Windows module surface | Default on many servers |
| PowerShell **7+** | Cross-plat cmdlets; different hosting | New automation standard |
| Windows Terminal | Profiles hosting all of the above | Emulator only (**32**) |
| WSL | Real Linux atlas inside Windows | Hybrid estates |

### 6. Baby → advanced Windows drills

| Level | Drill |
|-------|-------|
| Baby | `DIR`, `CD /D`, `ECHO`, `TYPE` |
| Intermediate | `Get-ChildItem -Force`, `Set-Content`, `Get-Process` |
| Advanced | Object pipelines, `Invoke-RestMethod`, `Get-FileHash` |
| Staff | Disambiguate aliases; pin `$PSVersionTable`; thin `cmd` → `pwsh -File` |

---

## 5. Applications

### Bootstrap pattern

```bat
@ECHO OFF
SETLOCAL ENABLEEXTENSIONS
pwsh -NoProfile -File "%~dp0tasks\run.ps1" %*
EXIT /B %ERRORLEVEL%
```

### Inventory snippet

```powershell
$PSVersionTable
Get-Command Get-ChildItem, Invoke-WebRequest, Get-FileHash |
  Format-Table Name, CommandType, Source
```

### Staff-level review checklist

- [ ] Scripts use full cmdlet names; aliases banned in committed code.
- [ ] `-LiteralPath` used for untrusted/odd paths.
- [ ] `-WhatIf` considered for destructive `Remove-Item` reviews.
- [ ] `Invoke-Expression` absent or threat-modeled.
- [ ] `$PSVersionTable` pinned for 5.1 vs 7 divergence.
- [ ] `curl`/`ls` disambiguated on Windows agents.
- [ ] New batch is thin; logic lives in `pwsh`.
- [ ] `FOR`/`IF ERRORLEVEL` quirks reviewed in legacy bats.
- [ ] Full Windows commands hub not mistaken for missing handbook gaps.

---

## References

- [PowerShell documentation](https://learn.microsoft.com/powershell/)
- [Approved verbs](https://learn.microsoft.com/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands)
- [about_Aliases / about_Command_Precedence](https://learn.microsoft.com/powershell/)
- [Windows Commands reference](https://learn.microsoft.com/windows-server/administration/windows-commands/windows-commands)
- [cmd reference topics](https://learn.microsoft.com/windows-server/administration/windows-commands/cmd)

---

[← Back to Shell](./README.md)
