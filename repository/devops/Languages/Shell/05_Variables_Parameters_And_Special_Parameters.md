# Variables, parameters, and special parameters

[← Back to Shell](./README.md)

## What this chapter covers

How **shell variables** and **parameters** work in Bash and POSIX `sh`: assignment, expansion, `export`, `readonly`, positional parameters (`$1`, `$@`, `$#`), and status (`$?`). Brief **PowerShell** contrast (`$var`, `$env:`) so Windows automation is not forced into Bash metaphors. You leave able to pass arguments safely, export environment to child processes, and read exit status without cargo-culting snippets.

---

## 1. Concepts (basic)

### 1. Variables vs environment

In Bourne-family shells, a **shell variable** lives in the shell process. **`export`** marks it for the **environment** inherited by child processes. Children cannot change the parent’s variables; they inherit a copy of exported names.

```bash
name=world          # shell variable (no spaces around =)
echo "$name"

export name         # now in the environment for children
export OTHER=value  # assign + export
```

| Context | Bash / POSIX | PowerShell |
|---------|--------------|------------|
| Script-local style var | `name=value` | `$name = "value"` |
| Process environment | `export NAME=value` / `NAME=value` cmd | `$env:NAME = "value"` |
| Read env | `"$NAME"` (if exported or set) | `$env:NAME` |

```powershell
$greeting = "world"          # variable
$env:GREETING = "world"      # environment entry
Write-Output $greeting
Write-Output $env:GREETING
```

cmd uses `set NAME=value` and `%NAME%`—separate dialect.

### 2. Naming and assignment rules

- Assignment is `name=value` with **no spaces** around `=` in `sh`/Bash.
- Names are typically `[A-Za-z_][A-Za-z0-9_]*`.
- Unquoted `value` still undergoes expansion; quote when the value has spaces or special characters.

```bash
# Wrong: command "name" with args = and value
# name = value

path="/tmp/My Files"
export path
```

### 3. Parameter expansion basics

```bash
: "${region:=us-east-1}"    # default assign if unset/null
echo "${region}"

file="archive.tar.gz"
echo "${file%.gz}"          # strip shortest suffix
echo "${#file}"             # length
```

| Form | Meaning (POSIX-friendly core) |
|------|-------------------------------|
| `${var}` | Value of `var` |
| `${var:-default}` | Default if unset or null |
| `${var:=default}` | Assign default if unset or null |
| `${var:?message}` | Error/exit if unset or null |
| `${var:+alt}` | Expand `alt` if set and non-null |
| `${#var}` | Length |
| `${var%pat}` / `${var%%pat}` | Remove suffix |
| `${var#pat}` / `${var##pat}` | Remove prefix |

Bash-only case modifiers (`${var,,}`, `${var^^}`) need Bash **4.0+**—not on macOS stock Bash **3.2**, not in dash.

### 4. Positional parameters

| Parameter | Meaning |
|-----------|---------|
| `$0` | Script/shell name (invocation-dependent) |
| `$1` … `$n` | Positional arguments |
| `$#` | Argument count |
| `"$@"` | All positionals as **separate** words (when quoted) |
| `"$*"` | All positionals joined (see IFS) |
| `$$` | Shell PID |
| `$?` | Exit status of the last command |
| `$!` | PID of last background job |

```bash
#!/usr/bin/env bash
set -euo pipefail
usage() { echo "usage: $0 <src> <dst>" >&2; exit 2; }
[ "$#" -eq 2 ] || usage
src=$1
dst=$2
cp -- "$src" "$dst"
```

Always prefer `"$@"` when forwarding:

```bash
helper() {
  printf '<%s>\n' "$@"
}
helper "a b" c
```

### 5. `readonly` and `unset`

```bash
readonly PI=3.14
# PI=3  → error

unset name          # remove variable (cannot unset readonly)
```

Bash `declare`/`typeset` add attributes (`-i`, `-a`, `-A`, `-r`, `-x`). Associative arrays (`declare -A`) need Bash **4.0+**.

### 6. Special parameters for status and options

```bash
true
echo "$?"           # 0

false
echo "$?"           # non-zero

# $-  → current option flags (interactive debugging literacy)
```

PowerShell: `$LASTEXITCODE` for native programs; error records / `$?` boolean behave differently from Bash’s `$?` integer—do not mix the models in one mental slot.

```powershell
Get-Command pwsh > $null
Write-Output $LASTEXITCODE
Write-Output $?
```

### 7. Scope preview

By default, variables in Bash functions are **global** to the shell unless declared `local` (Bash/ksh-family; not all POSIX `sh`). Details belong with functions; the rule for this chapter: **export only what children need**, keep secrets out of `export` when possible, and prefer locals inside functions.

---

## 2. Advanced concepts

### 1. Environment size and child visibility

Exported variables appear in `/proc/<pid>/environ` on Linux and in process listings on some systems—**secrets in the environment leak**. Prefer short-lived env for children (`VAR=value command`) or secret stores.

```bash
# Env only for this child
API_TOKEN="$token" somecli push
```

### 2. `set -u` / `nounset`

With `set -u`, expanding unset variables is an error. Combine with `${var:?}` and defaults. Good for CI scripts; requires discipline around optional arguments.

```bash
set -u
: "${REQUIRED:?REQUIRED must be set}"
```

### 3. Arrays (Bash)

```bash
# Indexed arrays — Bash (not POSIX sh); OK on Bash 3.2
files=("a b.txt" "c.txt")
printf '<%s>\n' "${files[@]}"

# Associative — Bash 4.0+ only
# declare -A map=([host]=db [port]=5432)
```

zsh arrays are 1-indexed by default and differ in splitting—another reason not to develop Bash scripts only under zsh.

### 4. Namerefs (Bash 4.3+)

`declare -n ref=other` makes `ref` an alias to another variable name. Powerful and easy to misuse; avoid on Bash 3.2 targets; review carefully when used.

### 5. PowerShell scopes and env

PowerShell variables have scopes (`$script:`, `$global:`, …). Environment is a separate drive-like namespace `$env:`. Setting `$env:PATH` changes what native commands resolve—same operational importance as Unix `PATH`, different syntax.

```powershell
$env:PATH = "/usr/local/bin:" + $env:PATH   # Unix-like pwsh example
```

Windows PowerShell **5.1** vs **7**: profile and module paths differ; env var names for tooling may differ across editions—pin edition when documenting required env.

### 6. BusyBox / dash limits

No arrays, no `declare -A`, no Bash `${var,,}`. Stick to POSIX parameter expansions listed above for `#!/bin/sh` portability.

### 7. Indirect expansion and `eval` temptation

Bash can expand “the variable named in another variable” with `${!name}` (Bash). It is easy to turn into `eval`—and `eval` is where untrusted input becomes code.

```bash
# Bash indirect expansion — not POSIX sh
var=PROD_URL
PROD_URL="https://example.internal"
printf '%s\n' "${!var}"
```

Prefer explicit case/dispatch over dynamic name tables when reading config. On Bash **3.2**, `${!name}` exists for indirect expansion; associative arrays for maps still need **4.0+**.

### 8. Positional parameter surgery

```bash
# Shift consumes $1
shift || true

# Bash: assign new positionals
set -- "$@" "$extra"
```

`set --` replaces the list; know whether you are in the script or inside a function (function positionals are separate). Portable scripts use `shift` carefully and check `$#`.

### 9. Exporting for one child only

```bash
# Does not pollute the parent shell's environment permanently
ENV=prod API_TOKEN="$token" ./run_job.sh
```

PowerShell analogue—process-scoped env mutation should be restored if you alter `$env:` for a session-wide effect; prefer `Start-Process`/`pwsh -Command` patterns that pass env explicitly when isolation matters.

---

## 3. Applications and use cases

### CLI wrappers and DevOps glue

Parse flags with clear positionals or a small loop; export configuration into child CLIs without dumping secrets into the parent’s long-lived environment. Prefer `"$@"` forwarding for wrappers.

```bash
#!/usr/bin/env bash
set -euo pipefail
cmd=$1; shift
case $cmd in
  sync)  exec ./sync.sh "$@" ;;
  plan)  exec ./plan.sh "$@" ;;
  *) echo "unknown: $cmd" >&2; exit 2 ;;
esac
```

### Twelve-factor style config

Read config from environment in containers (`"$PORT"`, `"$DATABASE_URL"`), fail fast with `${VAR:?}`, and keep defaults for local-only non-secrets.

```bash
: "${PORT:?PORT is required}"
: "${LOG_LEVEL:=info}"
```

### Cross-OS agent variables

| Agent | Common pattern |
|-------|----------------|
| Linux CI | `export` in bash step; mask secrets in CI UI |
| macOS | Same Bash/`sh` rules; watch Bash 3.2 if using `/bin/bash` |
| Windows | `$env:` in PowerShell; careful with machine vs user env |
| WSL | Linux env inside distro; Windows env separate unless bridged |

Windows-oriented env and command context: [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md).

```powershell
if (-not $env:PORT) { throw "PORT is required" }
$logLevel = if ($env:LOG_LEVEL) { $env:LOG_LEVEL } else { "info" }
```

### Software engineering hygiene

Name exported variables with prefixes (`MYAPP_`) to avoid collisions. Document required env in the README next to version pins. Avoid mutating IFS globally when parsing CSV-like strings—use `read` carefully or external tools.

```bash
# Prefix sketch
export MYAPP_REGION="${MYAPP_REGION:-us-east-1}"
export MYAPP_LOG_LEVEL="${MYAPP_LOG_LEVEL:-info}"
```

### Debugging expansions safely

```bash
# Prefer printing lengths / redacted shapes over raw secrets
printf 'token_len=%s\n' "${#API_TOKEN}" >&2

# set -x will leak — disable around secret regions
```

### Staff-level review checklist

- Assignments use `name=value` form; expansions that must stay one word are quoted.
- Argument forwarding uses `"$@"` (or Bash arrays), not unquoted `$@` / `$*`.
- `export` surface is minimal; secrets not left exported longer than needed.
- Bash 4+ parameter features gated or avoided for 3.2 / `sh` targets.
- `set -u` scripts handle optional args deliberately.
- PowerShell code uses `$env:` for environment, not accidental shell-only vars when spawning children.
- ShellCheck clean for unused/unquoted parameter issues.
- No `eval`-based indirection for untrusted names.
- Required environment variables are listed and fail fast with clear errors.

---

## References

- [GNU Bash manual — Shell Parameters](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html)
- [GNU Bash manual — Shell Variables](https://www.gnu.org/software/bash/manual/html_node/Shell-Variables.html)
- [GNU Bash manual — Special Parameters](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html)
- [POSIX Shell Command Language — Parameters](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [about_Variables (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_variables)
- [about_Environment_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)
- [ShellCheck](https://www.shellcheck.net/)
