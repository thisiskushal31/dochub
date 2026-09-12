# Functions and script structure

[← Back to Shell](./README.md)

## What this chapter covers

How to structure Bash and POSIX-oriented scripts with **functions**, **`local`**, **`return`**, and a readable file layout (usage, mains, helpers). Brief **PowerShell** function notes keep cross-OS teams aligned. You leave able to write scripts that are reviewable modules—not one long unindented blob—and to know which function features are Bash-only versus portable.

---

## 1. Concepts (basic)

### 1. What a shell function is

A **function** is a named compound command stored in the shell. Calling it runs those commands in the current shell (unless you force a subshell). Functions organize scripts the way procedures organize other languages—with important differences: parameters are positional (`$1`…), and output is often via **stdout** plus an **exit/return status**, not a typed return value.

```bash
greet() {
  name=${1:-world}
  printf 'hello, %s\n' "$name"
}

greet "Ada"
```

POSIX-friendly definition forms:

```sh
name() { …; }

# Also commonly seen (Bash / some shells):
# function name { …; }    # not portable — avoid in #!/bin/sh
```

Prefer `name() { …; }` for portability.

### 2. Parameters and `"$@"` inside functions

Functions receive their own positional parameters for the duration of the call. `"$@"` inside a function refers to **the function’s** arguments, not the script’s—unless you forwarded them.

```bash
run_with_args() {
  printf 'count=%s\n' "$#"
  printf '<%s>\n' "$@"
}

run_with_args "a b" c
```

Forwarding:

```bash
wrapper() {
  helper "$@"
}
```

### 3. `return` vs `exit`

| Builtin | Effect |
|---------|--------|
| `return [n]` | Ends the **function** with status `n` (default: status of last command) |
| `exit [n]` | Ends the **shell process** (the whole script) |

```bash
need_cmd() {
  command -v "$1" >/dev/null 2>&1 || return 127
}

if ! need_cmd jq; then
  echo "jq required" >&2
  exit 127
fi
```

Using `exit` deep inside a library function surprises callers—prefer `return` and let the main decide process exit.

### 4. `local` (Bash and friends)

Bash provides **`local`** to scope variables to a function. POSIX `sh` does **not** require `local`; dash historically lacked it (newer versions may vary—do not assume). For portable `sh`, use careful naming prefixes or run helpers in subshells when isolation matters.

```bash
# Bash (works on 3.2 and 5.x)
sum_files() {
  local f
  local count=0
  for f in "$@"; do
    count=$((count + 1))
  done
  printf '%s\n' "$count"
}
```

Without `local`, assignments inside functions clobber globals—classic bug source.

### 5. Script layout that scales

A durable Bash script shape:

1. Shebang + version comment  
2. Safety options (`set -euo pipefail` when Bash policy allows)  
3. Constants / defaults  
4. Helper functions (`usage`, logging, checks)  
5. `main` (or top-level orchestration)  
6. Invoke `main "$@"` guarded so sourcing does not run main  

```bash
#!/usr/bin/env bash
# Requires Bash 4+ for mapfile — adjust if supporting 3.2.
set -euo pipefail

usage() {
  echo "usage: $0 <dir>" >&2
  exit 2
}

log() { printf '%s\n' "$*" >&2; }

main() {
  [ "$#" -eq 1 ] || usage
  local dir=$1
  [ -d "$dir" ] || { log "not a directory: $dir"; exit 1; }
  log "ok: $dir"
}

main "$@"
```

Sourcing guard pattern (Bash):

```bash
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
```

`BASH_SOURCE` is Bash-specific—fine under `#!/usr/bin/env bash`; not for strict `sh`.

### 6. PowerShell functions (brief)

```powershell
function Get-Greeting {
  param(
    [Parameter(Mandatory = $false)]
    [string] $Name = "world"
  )
  "hello, $Name"
}

Get-Greeting -Name "Ada"
```

PowerShell functions use **param blocks**, advanced functions with `[CmdletBinding()]`, and pipeline `process` blocks. Scopes differ from Bash `local`. Prefer `pwsh` **7.x** for new cross-platform modules; Windows PowerShell **5.1** remains common for built-in Windows-only modules—state the edition in the script header.

---

## 2. Advanced concepts

### 1. Subshell functions and isolation

```bash
isolated() (
  # parentheses: body runs in a subshell
  cd /tmp || exit 1
  pwd
)
isolated
pwd   # unchanged in parent
```

Use subshells when you must `cd` or alter IFS temporarily without `local` support.

### 2. Name conflicts and builtins

Do not name functions after common builtins (`test`, `[`, `cd`) unless you intend to override. `command` and `builtin` help escape overrides when needed.

### 3. Recursion and depth

Shell recursion is limited by stack and readability. Prefer loops for iteration over directory trees unless the problem is naturally recursive and depth-bounded.

### 4. Bash `declare -f` and introspection

```bash
declare -f greet     # print function body (Bash)
```

Useful in debugging; do not rely on dumping functions as a substitute for version control.

### 5. `local -n` namerefs (Bash 4.3+)

Namerefs inside functions enable pass-by-name patterns. They are powerful, easy to confuse with globals, and unavailable on Bash **3.2**. Prefer explicit outputs (stdout / globals you document) on brownfield pins.

### 6. Trap and functions

`trap` handlers often call functions for cleanup. Keep handlers simple; remember they run in unusual states. Robust trap patterns belong with the errors/traps chapter—structure the script so cleanup functions exist and stay small.

### 7. cmd / batch “subroutines”

```bat
call :label
goto :eof
:label
echo hi
goto :eof
```

Different model; keep batch structure in batch files. From PowerShell, call `cmd /c` only at boundaries.

### 8. BusyBox ash functions

Functions exist in ash, but without Bash `local` / `declare`. Stick to simple helpers and unique variable names for Alpine entrypoints.

### 9. Logging helpers without leaking secrets

```bash
log()  { printf '%s\n' "$*" >&2; }
die()  { log "$*"; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "missing: $1"; }

redact() {
  # structural logging — lengths, not values
  local key=$1
  local val=$2
  printf '%s_len=%s\n' "$key" "${#val}" >&2
}
```

Centralize logging early so call sites stay quiet and consistent.

### 10. Argument parsing as a function

```bash
parse_args() {
  VERBOSE=0
  while [ "$#" -gt 0 ]; do
    case $1 in
      -v|--verbose) VERBOSE=1; shift ;;
      -h|--help) usage ;;
      --) shift; break ;;
      -*) die "unknown flag: $1" ;;
      *) break ;;
    esac
  done
  REMAINS=("$@")   # Bash array — Bash only; use shift loop for POSIX
}
```

For POSIX `sh`, keep remaining args in `"$@"` after `shift` instead of arrays.

### 11. Testing functions in isolation

```bash
# Source without running main (Bash guard), then call helpers
# bash -c 'source ./lib.sh; greet Ada'
```

Design libraries so unit-style checks can invoke one function without deploying the world.

---

## 3. Applications and use cases

### Shared library snippets

Teams often `source ./lib.sh` for shared helpers. Rules:

- Library files should **not** execute main on source  
- Document required Bash version at the top  
- Avoid silent `cd` or `PATH` mutation without restoring  

```bash
# lib.sh
# shellcheck shell=bash
# Requires Bash 4+

say() { printf '%s\n' "$*"; }

# no main invocation here
```

### CI task scripts

Split “parse args,” “validate env,” “do work,” “report” into functions so failure logs point to a stage. Return statuses from validators; `exit` only from main.

```bash
validate_env() {
  : "${DEPLOY_ENV:?}"
  case $DEPLOY_ENV in
    staging|prod) ;;
    *) return 2 ;;
  esac
}

main() {
  validate_env || die "DEPLOY_ENV must be staging|prod"
  deploy
  report
}
```

### Cross-OS structure

| Target | Structure habit |
|--------|-----------------|
| Linux Bash 5 | `local`, `main "$@"`, optional `BASH_SOURCE` guard |
| macOS Bash 3.2 | Same, but no 4.3 namerefs / 4+ only helpers |
| POSIX `sh` | `name() { }`; avoid `local` / `function` keyword |
| PowerShell 7 | `function` + `param`; modules for larger surface |
| WSL | Linux Bash layout inside the distro |

Application entrypoint patterns also show up in OS scripting companions such as [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md); keep dialect structure decisions in this Languages track.

```powershell
function Invoke-Deploy {
  [CmdletBinding()]
  param(
    [ValidateSet("staging","prod")]
    [string] $DeployEnv
  )
  Write-Verbose "deploying to $DeployEnv"
  # …
}

# Dot-source libraries; call explicitly
# . ./Lib.ps1
# Invoke-Deploy -DeployEnv staging
```

### Security

- Functions that build command lines must still quote expansions.  
- Do not `eval` assembled strings from untrusted input inside helpers.  
- PowerShell: prefer parameters over `Invoke-Expression` of user text.

### Software engineering

Treat scripts like code: small functions, names that state side effects (`delete_bucket` vs `helper2`), and tests that invoke functions via `bash -c` / bats / PS frameworks (later testing chapter). ShellCheck understands many function patterns—run it in CI.

File size heuristic: when a script exceeds ~200–300 lines without function boundaries, split before adding features.

### Staff-level review checklist

- Portable scripts use `name() { …; }`, not the `function` keyword.
- Bash functions that need isolation use `local` (or subshells); no accidental globals.
- Helpers `return`; process `exit` lives in main / top level.
- Scripts that may be sourced guard main execution.
- Version-gated features (namerefs, associative arrays) are documented at file head.
- PowerShell functions use `param` blocks and state 5.1 vs 7 requirements.
- ShellCheck (and PSScriptAnalyzer where relevant) is clean on new helpers.
- Logging helpers never print secret values by default.
- Libraries are side-effect free at source time.

---

## References

- [GNU Bash manual — Shell Functions](https://www.gnu.org/software/bash/manual/html_node/Shell-Functions.html)
- [GNU Bash manual — Bash Builtins (`local`, `return`)](https://www.gnu.org/software/bash/manual/html_node/Bash-Builtins.html)
- [POSIX Shell Command Language — Functions](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [about_Functions (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions)
- [about_Functions_Advanced](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced)
- [ShellCheck](https://www.shellcheck.net/)
