# Robust scripts: errors, traps, and idioms

[← Back to Shell](./README.md)

## What this chapter covers

Making shell automation **fail closed**: Bash `set -euo pipefail`, exit-status discipline, **traps** for cleanup, and PowerShell **`$ErrorActionPreference`** / **try-catch**. Includes what is Bash-only vs POSIX, and version gates (Bash 3.2 vs 4+/5, Windows PowerShell 5.1 vs PowerShell 7).

---

## 1. Concepts

### 1. Exit status is the contract

Every command returns a status (`0` success by convention; non-zero failure). Scripts compose that contract:

```bash
command
echo "$?"    # last status
```

```powershell
command
$LASTEXITCODE   # native exe; also inspect $? for cmdlets (boolean-ish in PS)
```

| Shell | Success signal | Notes |
|-------|----------------|-------|
| Bash/POSIX | `0` | Special statuses for signals (e.g. 128+n) |
| PowerShell cmdlets | non-terminating vs terminating errors | Not only exit codes |
| cmd | `ERRORLEVEL` | Sticky quirks (chapter 13) |

### 2. The Bash “strict mode” idiom

```bash
#!/usr/bin/env bash
set -euo pipefail
```

| Option | Meaning | POSIX? | Notes |
|--------|---------|--------|-------|
| `set -e` (`errexit`) | Exit when a command fails | yes (semantics subtle) | Many exceptions (see Advanced) |
| `set -u` (`nounset`) | Error on unset variable expansion | yes | Use `${VAR:-}` defaults deliberately |
| `set -o pipefail` | Pipeline status = last **failed** command (or zero if all OK) | **no — Bash/ksh/zsh** | **Not** in POSIX `sh` / `dash` |
| `set -x` | Trace | yes | Debug only; may leak secrets |

**Version gate:** `pipefail` is a **Bash** (and zsh/ksh) feature—available in Bash **3.x** as well as 4+/5. It is **not** “Bash 4 only.” It is simply **non-POSIX**: do not expect it under `#!/bin/sh` on Debian where `sh` is `dash`.

```bash
# Demonstrates pipefail (Bash)
set -o pipefail
false | true     # pipeline status non-zero with pipefail
echo $?
```

zsh: similar `setopt errexit nounset pipefail` (names differ)—keep zsh-specific scripts explicit (chapter 11).

### 3. PowerShell error preferences

```powershell
$ErrorActionPreference = 'Stop'   # common in scripts: escalate to terminating
try {
  Get-Content -LiteralPath $path
  & $nativeExe @args
  if ($LASTEXITCODE -ne 0) { throw "native failed: $LASTEXITCODE" }
}
catch {
  Write-Error $_
  exit 1
}
```

| Preference | Behavior |
|------------|----------|
| `Continue` (default interactive-ish) | Non-terminating errors print; script continues |
| `Stop` | Many errors become terminating → catchable |
| `SilentlyContinue` | Hide and continue—dangerous without checks |
| `Inquire` | Prompt—never in CI |

**5.1 vs 7:** Preference names are stable; native executable exit-code habits and some cmdlet error details differ—always check `$LASTEXITCODE` after externals in both editions.

### 4. Traps and cleanup (Bash)

```bash
#!/usr/bin/env bash
set -euo pipefail

workdir=
cleanup() {
  local ec=$?
  [[ -n "${workdir}" && -d "${workdir}" ]] && rm -rf -- "${workdir}"
  exit "$ec"
}
trap cleanup EXIT

workdir="$(mktemp -d)"
# … work …
```

| Signal/event | Typical use |
|--------------|-------------|
| `EXIT` | Always-run cleanup |
| `INT`/`TERM` | Graceful stop + cleanup |
| `ERR` | Bash-only: run handler on error (with caveats) |

```bash
trap 'echo "interrupted" >&2; exit 130' INT
```

PowerShell cleanup:

```powershell
try {
  $workdir = New-Item -ItemType Directory -Path ([IO.Path]::GetTempPath()) -Name ([guid]::NewGuid())
  # work
}
finally {
  if ($workdir -and (Test-Path -LiteralPath $workdir)) {
    Remove-Item -LiteralPath $workdir -Recurse -Force
  }
}
```

### 5. Cross-OS robustness map

| Concern | Linux Bash | macOS Bash 3.2 / zsh | PowerShell 7 | PS 5.1 | cmd | BusyBox `sh` |
|---------|------------|----------------------|--------------|--------|-----|--------------|
| `set -euo pipefail` | yes | Bash yes; zsh analogs | N/A | N/A | N/A | no `pipefail` |
| `trap EXIT` | yes | yes | use `try/finally` | `try/finally` | limited | yes (ash) |
| Strict unset | `set -u` | yes | param validation | same | weak | `set -u` ok |
| Native exit codes | `$?` | `$?` | `$LASTEXITCODE` | same | `ERRORLEVEL` | `$?` |

### 6. Idioms worth memorizing

```bash
# Require vars
: "${CONFIG:?CONFIG must be set}"

# Default
: "${REGION:=us-east-1}"

# Run in subshell to localize set options (careful with vars)
(
  set -euo pipefail
  do_unit_of_work
)

# Explicit status
if ! deploy; then
  echo "deploy failed" >&2
  exit 1
fi
```

```powershell
param(
  [Parameter(Mandatory)]
  [string] $Config
)
```

---

## 2. Advanced concepts

### 1. `set -e` is subtle (read before preaching)

Under Bash, `set -e` does **not** always exit on failure inside:

- `if cmd; then …; fi` tests  
- `cmd \|\| true` / `cmd && …` short-circuit chains  
- Some contexts in pipelines without `pipefail`  
- Commands in `!` negation depending on version/options  

Staff habit: treat `set -e` as **necessary but insufficient**. Critical paths still check statuses explicitly.

POSIX `set -e` semantics have historically varied across shells—another reason CI should run under the **claimed** interpreter.

### 2. `pipefail` details

Without `pipefail`, `cmd_fail | cmd_ok` returns success from `cmd_ok`, masking failure. With `pipefail`, the pipeline returns failure. Mid-pipe failures still need attention for partial output (broken JSON, truncated logs).

**Not POSIX:** portable `sh` scripts cannot rely on `pipefail`. Options:

1. Require Bash (`#!/usr/bin/env bash`) for production automation  
2. Avoid pipelines where early failure must abort—use temps and explicit checks  
3. Use a non-shell language for complex graphs  

### 3. `ERR` trap and inheritance

```bash
trap 'echo "ERR at line $LINENO" >&2' ERR
```

Bash `ERR` is not POSIX. Behavior with functions, conditionals, and inherited traps differs by version—test on Bash 3.2 **and** 5.x if you support both.

### 4. Cleanup vs error status

Save `$?` at the start of `EXIT` traps before running cleanup commands that might clobber status. Re-`exit` with the original code.

### 5. PowerShell terminating vs non-terminating

Many cmdlets write **non-terminating** errors and continue unless `$ErrorActionPreference = 'Stop'` or `-ErrorAction Stop` on the call. Native executables often do **not** throw—check `$LASTEXITCODE`.

```powershell
$ErrorActionPreference = 'Stop'
try {
  cmdlet -ErrorAction Stop
}
catch [System.IO.FileNotFoundException] {
  # typed catch when useful
  throw
}
```

### 6. Version gates summary

| Feature | Bash 3.2 | Bash 4+/5 | POSIX sh | PS 5.1 | PS 7 |
|---------|----------|-----------|----------|--------|------|
| `pipefail` | yes | yes | **no** | N/A | N/A |
| `ERR` trap | yes (Bash) | yes | no | N/A | N/A |
| `${var:?}` | yes | yes | yes | N/A | N/A |
| Associative arrays in handlers | no | yes | no | N/A | N/A |
| `try/catch/finally` | N/A | N/A | N/A | yes | yes |
| `$LASTEXITCODE` discipline | N/A | N/A | N/A | required | required |

### 7. Temporary files and signal races

`mktemp` + `trap EXIT` is the baseline. On BusyBox, confirm `mktemp` exists and supports your flags. Prefer directory temps for multi-file work.

### 8. Job control and background cleanup

Background processes (`cmd &`) need explicit `wait` and kill-on-exit strategies. `kill $(jobs -p)` patterns must be empty-safe. PowerShell jobs/workflows are a different API—don’t mix metaphors.

### 9. Idempotent scripts

Robust ops scripts tolerate re-run: `mkdir -p`, conditional create, lock files with `flock` where available (Linux; not portable to all macOS without install). Document non-idempotent steps.

### 10. Logging without wrecking status

```bash
log() { printf '%s\n' "$*" >&2; }
```

Keep logs on stderr; leave stdout for data. In PowerShell, `Write-Host` vs `Write-Output` vs `Write-Error` matter for pipeline consumers—prefer `Write-Verbose` / structured logging in shared modules.

### 11. `set -x` secret leakage

Tracing expands commands with secrets in argv/env. Disable trace around sensitive sections; prefer secret managers (chapter 18).

### 12. WSL and mixed callers

A Bash script with strict mode invoked from `pwsh` still uses Bash rules—ensure the caller checks the process exit code (`$LASTEXITCODE`) after `wsl.exe` / `bash`.

### 13. cmd has no real substitute

Batch `IF ERRORLEVEL` is not equivalent to Bash strict mode. Keep `.cmd` as launchers; put robustness in `pwsh` or Bash (chapter 13).

---

## 3. Applications and use cases

### CI scripts

Standard header for Bash jobs:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

Enable `pipefail` only under Bash—not under `dash`. Fail the job on first error; upload logs from `EXIT` traps if needed.

### Installers and glue

Traps must remove partial installs on `INT`/`TERM`. On Windows, `try/finally` deletes staging directories even when `Stop` throws.

### Kubernetes / container entrypoints

PID1 signal behavior: use a true init or ensure your script forwards `TERM` to children. Strict mode alone does not drain subprocesses.

### Security

Fail closed on missing credentials (`${TOKEN:?}`). Do not `|| true` away auth failures. PowerShell: never set `SilentlyContinue` globally in privileged scripts.

### Software engineering

Shared libraries: document whether functions assume `set -e` and whether they are safe under `nounset`. Test failure paths, not only happy paths (chapter 17).

### Whole-engineering OS companion

Signal and process session context on Linux: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md).

### Staff-level review checklist

- Bash production scripts use `set -euo pipefail` **or** document why not.
- `pipefail` never claimed under POSIX `#!/bin/sh` / `dash`.
- Critical commands still have explicit failure handling where `set -e` is ambiguous.
- `EXIT`/`finally` cleanup preserves original exit status.
- Temps created with `mktemp` (or OS equivalent) and removed safely.
- PowerShell scripts set `$ErrorActionPreference` intentionally; check `$LASTEXITCODE` after natives.
- No CI use of `Inquire`; no blanket `SilentlyContinue`.
- `set -x` / verbose modes scrubbed of secrets.
- Background work has `wait`/kill policy.
- Failure-path tests or at least dry-run characterization exist.

---

## References

- [GNU Bash manual — The Set Builtin](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html)
- [GNU Bash manual — Signals](https://www.gnu.org/software/bash/manual/html_node/Signals.html)
- [POSIX Shell Command Language — special built-ins / set](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [about_Preference_Variables (ErrorActionPreference)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)
- [about_Try_Catch_Finally](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally)
- [about_CommonParameters (−ErrorAction)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_commonparameters)
- [Differences between Windows PowerShell 5.1 and PowerShell 7.x](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell)
- [ShellCheck](https://www.shellcheck.net/)
