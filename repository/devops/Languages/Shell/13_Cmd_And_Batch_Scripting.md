# cmd.exe and batch scripting

[← Back to Shell](./README.md)

## What this chapter covers

**cmd.exe** builtins, **`.bat` / `.cmd`** script mechanics, and the control-flow you still meet in brownfield Windows estates: `IF`, `FOR`, `SETLOCAL` / `ENDLOCAL`, `CALL`, and delayed expansion. The handbook stance is clear: **prefer PowerShell 7** (`pwsh`) for new automation; keep batch literacy for maintenance, installers, and legacy hooks that have not moved yet.

---

## 1. Concepts

### 1. What cmd is

**cmd.exe** is the traditional Windows command interpreter. Batch files (`.bat`, `.cmd`) are scripts interpreted by cmd. The language is older than PowerShell, with different expansion rules, error handling, and quoting hazards.

| Artifact | Role |
|----------|------|
| `cmd.exe` | Interactive shell and script host |
| `.bat` | Classic batch extension |
| `.cmd` | Batch for Windows NT-era; preferred when distinguishing from DOS-era associations |
| `powershell.exe` / `pwsh` | Separate languages—do not mix syntax blindly |

```bat
REM Identity
ver
echo %COMSPEC%
```

### 2. Why batch still appears

- Old installers and product hooks ship `.cmd` entrypoints
- Group Policy / login scripts in long-lived domains
- Tiny wrappers that only set environment variables then `call` another tool
- Vendors who still document cmd examples first
- Nested calls from MSBuild / older CI windows agents

Literacy prevents outages; nostalgia is not a strategy for greenfield work.

### 3. Core builtins you will read constantly

| Builtin | Purpose |
|---------|---------|
| `ECHO` | Print / toggle command echo (`ECHO ON`/`OFF`) |
| `REM` / `::` | Comments (`REM` safer in some contexts) |
| `SET` | Environment variables |
| `SETLOCAL` / `ENDLOCAL` | Localize environment changes |
| `IF` | Conditional execution |
| `FOR` | Iteration |
| `CALL` | Invoke another batch and return |
| `GOTO` / labels | Jump control |
| `EXIT` / `EXIT /B` | Exit cmd or return from batch |
| `CD` / `PUSHD` / `POPD` | Directories |
| `DIR` `COPY` `MOVE` `DEL` `MKDIR` | File ops (also external-like builtins) |
| `TYPE` | Print file |
| `START` | Launch process / new window |

Exact flags live in Windows command reference; learn patterns here, look up switches when editing production scripts.

### 4. Variables and expansion basics

```bat
SET name=world
ECHO Hello, %name%
```

Percent expansion (`%var%`) is parsed in ways that surprise Bash users—especially inside blocks and loops. **Delayed expansion** (`!var!` with `SETLOCAL ENABLEDELAYEDEXPANSION`) exists to address loop-time updates:

```bat
SETLOCAL ENABLEDELAYEDEXPANSION
SET count=0
FOR %%I IN (a b c) DO (
  SET /A count+=1
  ECHO !count! %%I
)
ENDLOCAL
```

### 5. `IF` and `FOR` at a glance

```bat
IF NOT EXIST "%~dp0config.txt" (
  ECHO missing config >&2
  EXIT /B 1
)

IF /I "%1"=="start" GOTO do_start

FOR %%F IN (*.txt) DO ECHO %%F
FOR /L %%N IN (1,1,5) DO ECHO %%N
```

`%~dp0` expands to the drive+path of the running script—common in wrappers. Quote paths with spaces religiously.

### 6. Existence / preference matrix

| Task | cmd/batch | PowerShell 7 | Bash (WSL/Git Bash) |
|------|-----------|--------------|---------------------|
| New Windows automation | Avoid | **Prefer** | Optional via WSL |
| Legacy installer hooks | Common | Replace when touching | Rare |
| Structured objects / JSON | Painful | Natural | Tools-based |
| Registry deep edits | `reg` | Providers/cmdlets | N/A |
| Cross-OS CI | Poor | Strong with `pwsh` | Strong on Linux agents |

### 7. Minimal batch anatomy (read-only literacy)

```bat
@ECHO OFF
SETLOCAL ENABLEEXTENSIONS
SET "ROOT=%~dp0"
IF NOT EXIST "%ROOT%tools\pwsh-stub.txt" (
  ECHO setup incomplete >&2
  EXIT /B 1
)
CALL "%ROOT%tools\run.cmd" %*
SET "RC=%ERRORLEVEL%"
ENDLOCAL & EXIT /B %RC%
```

Patterns to notice: `@ECHO OFF`, quoting `SET "VAR=value"`, `%~dp0`, `CALL`, and propagating `%ERRORLEVEL%` across `ENDLOCAL`.

---

## 2. Advanced concepts

### 1. `SETLOCAL`, error levels, and `EXIT /B`

```bat
@ECHO OFF
SETLOCAL
SET RC=0

CALL :work || SET RC=1

ENDLOCAL & EXIT /B %RC%

:work
DIR "%~dp0." >NUL || EXIT /B 1
EXIT /B 0
```

Notes:

- `ERRORLEVEL` testing has awkward syntax (`IF ERRORLEVEL 1` means “≥ 1”).
- `ENDLOCAL` discards localized env vars—capture return values carefully (`ENDLOCAL & SET …` patterns).
- `EXIT /B` returns from a batch; bare `EXIT` can kill the calling interactive cmd session—dangerous in shared terminals.

### 2. `CALL` vs running a script

Running `other.bat` transfers control and does **not** return unless you `CALL other.bat`. Missing `CALL` is a classic bug when chaining wrappers.

### 3. Argument parsing and quoting hazards

Batch argument rules interact poorly with nested quotes and `&()<>|`. Prefer minimal arguments; move complexity to PowerShell. When maintaining batch, quote `"%~1"` and test paths with spaces, ampersands, and parentheses.

### 4. `.bat` vs `.cmd`

For modern Windows, `.cmd` avoids some legacy PATHEXT association quirks with 16-bit-era `.bat` handling. Functionally similar for most NT scripts; follow team convention and keep extensions consistent in docs.

### 5. Delayed expansion side effects

Enabling delayed expansion makes `!` special. Passwords or URLs containing `!` can corrupt. Disable when not needed; prefer PowerShell if string handling is non-trivial.

### 6. Mixing cmd and PowerShell

Common bridge:

```bat
@ECHO OFF
SETLOCAL
pwsh -NoProfile -File "%~dp0tools\task.ps1" %*
EXIT /B %ERRORLEVEL%
```

Keep the `.cmd` file as a **thin launcher**. Do not duplicate business logic in both languages.

### 7. Security footguns

- Writing batch that concatenates untrusted input into commands → injection via `&`, `|`, `()`.
- World-writable script directories used by elevated installers.
- Logging secrets via `ECHO`.
- Downloading remote `.bat` and executing (supply chain).

PowerShell is not automatically safe—but batch’s expansion rules make careful quoting harder. Prefer higher-level languages for anything touching untrusted input.

### 8. When batch is still the least-bad choice

- You must ship a zero-dependency wrapper on stock Windows without guaranteeing `pwsh`
- You are patching a vendor `.cmd` and the blast radius of a rewrite is too high **this** change
- Firmware / OEM hooks that only document cmd

Even then: keep the file short; escape to `pwsh` or a signed binary when logic grows.

### 9. Environment persistence myths

`SET` changes die with the process unless the parent captures them. `SETX` writes permanent user/machine env vars—slow, racy, and easy to abuse in scripts. Prefer PowerShell/`[Environment]::SetEnvironmentVariable` with clear scope when permanence is required, and document reboots/new sessions.

### 10. Code pages and encoding

cmd inherits OEM/ANSI code page quirks. Non-ASCII paths and messages corrupt easily. Prefer PowerShell 7 with explicit UTF-8 for new tooling; when stuck in batch, minimize non-ASCII and test on the target locale.

### 11. `FOR /F` parsing

```bat
FOR /F "tokens=1,2 delims=," %%A IN (data.csv) DO (
  ECHO field1=%%A field2=%%B
)
```

Tokenizers break on real CSV (quotes, commas in fields). For data processing, move to PowerShell/`Import-Csv` immediately rather than hardening `FOR /F`.

### 12. Parallelism

Batch has no clean fan-out model. `START /WAIT` chains processes; real parallel work belongs in PowerShell jobs/workflows, orchestrators, or make-like tools—not nested `START` jungles.

### 13. Labels, `GOTO`, and spaghetti

Labels (`:section`) plus `GOTO` are the historical control-flow style. Prefer `CALL :function` with `EXIT /B` for reusable blocks. Deep `GOTO` webs are unreviewable—another reason to migrate logic out of batch.

### 14. Interop with MSI / setup APIs

Installers often expect a `.cmd` working directory and environment. Keep side effects localized with `SETLOCAL`, restore directories with `PUSHD`/`POPD`, and never assume the user’s interactive `cd` state.

---

## 3. Applications and use cases

### Application installers

Many Windows installers still invoke `postinstall.cmd`. Treat them as glue: validate `ERRORLEVEL`, quote paths, avoid delayed-expansion traps, and migrate logic to PowerShell when the installer toolchain allows.

### Operations brownfield

Login scripts and scheduled tasks may still point at `.cmd`. Inventory them; schedule retirement toward `pwsh -File`.

### CI on Windows agents

Prefer `pwsh` tasks. If a repo still uses `cmd:`, isolate them and forbid growth. Gate new features on PowerShell scripts.

### Security / compliance

Batch in elevated contexts needs code review equal to any admin script. Ban dynamic construction from web input. Prefer signed PowerShell where policy supports it.

### Software engineering

- New automation: **PowerShell 7** (chapter 12)
- Unix-like agents: Bash / POSIX (chapters 08–11)
- Batch: maintenance mode only

Repository policy example:

| Path | Allowed |
|------|---------|
| `scripts/windows/*.ps1` | New work |
| `scripts/windows/legacy/*.cmd` | Frozen; bugfix only |
| Root `*.bat` | Disallowed in CI for new files |

### Testing batch (pragmatic)

There is no pleasant unit-test culture around cmd. Prefer characterization tests: run the wrapper in a disposable directory and assert exit codes/files. Better: wrap logic in PowerShell and test that; leave `.cmd` as a one-liner launcher.

### Migration playbook

1. Inventory `.bat`/`.cmd` in production scheduled tasks.
2. Classify: launcher vs logic.
3. Move logic to `pwsh`; keep `.cmd` only if something refuses to call `pwsh` directly.
4. Delete dead batch after the last consumer switches.

### Whole-engineering OS companion

[`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md) for Windows command landscape; this chapter stays on batch language mechanics.

### Staff-level review checklist

- Is this new work? If yes, **reject batch** unless a hard dependency is documented.
- Are `CALL`, `SETLOCAL`/`ENDLOCAL`, and `EXIT /B` used correctly?
- Are paths quoted? Does `%~dp0` usage assume stable location?
- Is delayed expansion on only when required—and safe with `!` data?
- Is business logic thinner than a launcher into `pwsh`?
- Are `ERRORLEVEL` checks correct (remember `IF ERRORLEVEL` semantics)?
- Any untrusted input interpolated into the command line?
- Migration plan recorded for lingering `.cmd` in production paths?

---

## References

- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
- [cmd](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd)
- [if](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/if)
- [for](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/for)
- [setlocal](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setlocal)
- [call](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/call)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Differences between Windows PowerShell 5.1 and PowerShell 7.x](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell)
