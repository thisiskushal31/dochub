# Bash and POSIX builtins in extreme depth

[← Back to Shell](./README.md)

## What this chapter covers

Every **Bash builtin** you fire without leaving the shell process—plus POSIX **special builtin** callouts. External twins (`/bin/echo`, `/usr/bin/kill`, `/usr/bin/test`) may exist; resolution rules decide which runs. Pair with the atlas (**27**) and language chapters (**04–08**, **16**, **18**).

**Why builtins matter:** `cd`, `export`, and `read` **must** be builtins to change the current shell. Scripts that accidentally run an external or an alias behave differently.

---

## If you are brand new

```bash
# Discover what a name *is* before you trust its flags
type cd                 # expect: cd is a shell builtin
type ls                 # expect: ls is .../ls  OR an alias
help cd | head          # Bash: short builtin help (not on dash)
builtin pwd             # Force the builtin even if a function shadows pwd
command -v jq || echo "jq not on PATH"
# Breakdown:
#   type/help/builtin/command  = resolution tools (full depth: chapter 28)
```

| Result of `type` | Meaning |
|------------------|---------|
| `builtin` | Inside Bash |
| `alias` | Text expansion (avoid in scripts) |
| `function` | Shell function |
| `file` / hashed path | External on `PATH` |

---

## 1. Concepts — resolution order and special builtins

### 1. How Bash finds a command name

Typical order (simplified): **aliases** (interactive) → **functions** → **builtins** → **hashed PATH** → **PATH search**. Override deliberately:

| Tool | Effect |
|------|--------|
| `builtin NAME` | Force builtin |
| `command NAME` | Skip functions/aliases (find builtin or external) |
| `enable -n NAME` | Disable a builtin (rare; restricted shells care) |
| `\NAME` / `command NAME` | Bypass alias |

### 2. POSIX special builtins (portability literacy)

POSIX marks some builtins **special** (assignment persistence and error behavior differ in strict modes)—including `.`, `:`, `break`, `continue`, `eval`, `exec`, `exit`, `export`, `readonly`, `return`, `set`, `shift`, `times`, `trap`, `unset`. When writing `#!/bin/sh` for dash, verify behavior; do not assume Bash niceties.

### 3. Builtin catalog by job

| Job | Builtins |
|-----|----------|
| Navigate | `cd`, `pwd`, `pushd`, `popd`, `dirs` |
| Variables / env | `export`, `readonly`, `unset`, `declare`/`typeset`, `local`, `set`, `shift`, `getopts`, `read`, `mapfile`/`readarray` |
| Control flow | `break`, `continue`, `return`, `exit`, `:`, `true`, `false`, `test`/`[` |
| Execute / meta | `.`/`source`, `eval`, `exec`, `command`, `builtin`, `type`, `hash`, `enable`, `wait`, `trap`, `times`, `ulimit`, `umask` |
| Jobs | `jobs`, `fg`, `bg`, `kill`, `disown`, `suspend` |
| Interactive | `alias`/`unalias`, `bind`, `complete`, `compgen`, `history`, `fc`, `help`, `logout` |
| Print / arith | `echo`, `printf`, `let`, `caller` |

---

## 2. Builtins in depth (A–Z)

For each: **what**, **baby step**, **key options**, **script rule**, **exists notes**.

### `.` and `source`

Run commands from a file **in the current shell** (exports and `cd` stick).

```bash
# shellcheck source=lib.sh
. ./lib.sh
source ./lib.sh   # Bash synonym
```

| Pitfall | Rule |
|---------|------|
| Relative path depends on cwd | Prefer explicit paths or `${BASH_SOURCE[0]}` patterns (chapter **07**) |
| Failure modes | Special builtin on POSIX—errors can abort the shell in strict contexts |

**PowerShell:** `. .\lib.ps1` · **cmd:** `CALL`

### `:` (colon)

Always-successful no-op. Useful as a placeholder or for parameter expansion side effects:

```bash
: "${REQUIRED:?must set REQUIRED}"
```

### `alias` / `unalias`

```bash
alias ll='ls -la'
unalias ll
```

**Script rule:** do not depend on aliases in automation (`shopt -s expand_aliases` is a smell in CI). Prefer functions.

| OS | Notes |
|----|-------|
| Bash/zsh | First-class interactive |
| dash | Limited/no interactive alias culture |
| PowerShell | `Set-Alias` / `Get-Alias` — still avoid in scripts |

### `bg` / `fg` / `jobs` / `disown` / `suspend`

Job-control builtins (chapter **08**). Primarily **interactive**.

```bash
jobs -l
fg %1
bg %1
disown %1
```

| Flag | Meaning |
|------|---------|
| `jobs -l` | Include PIDs |
| `jobs -p` | PIDs only |

**Script rule:** prefer foreground pipelines or real supervisors over job tables in CI.

### `bind`

Readline key bindings (Bash). Interactive-only subset (chapter **22**).

### `break` / `continue`

Leave or skip loop iterations (chapter **06**). Optional numeric level: `break 2`.

### `builtin`

```bash
builtin cd /tmp    # ignore function named cd
```

### `caller`

Bash debugging: print call stack frames. Rare in production glue; useful with `set -x` / ERR traps.

### `cd`

Change the **current shell’s** working directory. Must be a builtin—an external `cd` cannot move *your* session.

```bash
cd -- "$dir"            # -- stops option parsing so dirs named -odd still work
cd -                    # Jump to $OLDPWD (previous directory)
pwd -P                  # Show physical path (resolve symlinks) after cd -P habit
# Breakdown:
#   cd     = change directory (builtin)
#   --     = end of options
#   "$dir" = quote to survive spaces
#   cd -   = special operand meaning "previous"
```

| Option | Meaning |
|--------|---------|
| `-L` | Follow logical path (default often) |
| `-P` | Physical path (resolve symlinks) |
| `-` | `$OLDPWD` |

**Must be builtin.** External `cd` cannot change your shell’s cwd.

| G | B | BB | PS | C |
|---|---|----|----|---|
| Y | Y | Y | `Set-Location` | `CD /D` |

### `command`

```bash
command ls         # not a function named ls
command -v jq      # print path or name
command -V cd      # verbose type-like
```

| Flag | Meaning |
|------|---------|
| `-v` | Path/name if found |
| `-V` | More verbose |
| `-p` | Use default PATH (Bash; restricted shells interact) |

Staff: prefer `command -v` over `which` in scripts (portability).

### `compgen` / `complete`

Completion generation and specs. Interactive. Do not require in CI.

### `declare` / `typeset` / `local`

```bash
declare -i n=0          # integer
declare -a arr=(a b)    # indexed array
declare -A map=([k]=v)  # assoc — Bash 4+
declare -r CONST=1      # readonly
declare -x VISIBLE=1    # export
local x=1               # function scope (Bash)
```

| Flag | Meaning | Version gate |
|------|---------|--------------|
| `-a` | Indexed array | Bash |
| `-A` | Associative | **Bash 4+** (not 3.2) |
| `-i` | Integer | Bash |
| `-r` | Readonly | Bash |
| `-x` | Export | Bash |
| `-f` | Functions | Bash |
| `-p` | Print attributes | Bash |

`typeset` ≈ `declare`. `local` only inside functions.

### `dirs` / `pushd` / `popd`

Directory stack:

```bash
pushd /var/log
popd
dirs -v
```

| PS | C |
|----|---|
| `Push-Location` / `Pop-Location` | `PUSHD` / `POPD` |

### `echo`

```bash
echo "hello"
echo -n "no newline"     # not portable everywhere
```

**Portability:** prefer `printf '%s\n' "$msg"`. `-e` escapes are **not** POSIX and differ across shells/builtins.

| G builtin | `/bin/echo` | PS | C |
|-----------|-------------|----|---|
| Y | Y (flags differ) | `Write-Output` | `ECHO` |

### `enable`

```bash
enable -a           # list
enable -n echo      # disable builtin echo (advanced)
```

Restricted shells limit `enable` (chapter **22**).

### `eval`

```bash
# DANGEROUS with untrusted input — chapter 18
eval "$compiled_string"
```

Expands then executes a string as shell code. Prefer arrays and direct calls. PowerShell twin: `Invoke-Expression`.

### `exec`

```bash
exec >"$logfile" 2>&1     # redirect shell FDs permanently
exec /usr/bin/app "$@"    # replace process image
```

No return after replacing the process. Used in container entrypoints: `exec` the main binary so signals hit the app.

### `exit`

```bash
exit 0
exit "$?" 
```

Ends the shell (or script). In a subshell, only the subshell exits.

### `export`

```bash
export PATH="/usr/local/bin:$PATH"   # Prepend a directory for child processes
export -p | head                     # Print export list (avoid in CI if secrets present)
# Breakdown:
#   export NAME=value  marks NAME for the environment inherited by children
#   Changing PATH here affects commands you run *after* this line in *this* shell
printenv PATH | tr ':' '\n' | head   # Show PATH entries one per line (tr: chapter 15)
```

Marks names for child environments. Does not print secrets safely to logs—avoid `export -p` in CI artifacts with secrets.

### `false` / `true`

Return status 1 / 0. Also exist as `/bin/true` `/bin/false`. Used in `while true; do …; done` and `\|\| true` patterns (use sparingly with `set -e`).

### `fc`

History editing (`fc -l`, `fc -e`). Interactive literacy.

### `getopts`

```bash
while getopts ':u:f:h' opt; do
  case "$opt" in
    u) user=$OPTARG ;;
    f) file=$OPTARG ;;
    h) usage; exit 0 ;;
    :) echo "missing -$OPTARG" >&2; exit 2 ;;
    \?) echo "bad -$OPTARG" >&2; exit 2 ;;
  esac
done
shift $((OPTIND - 1))
```

| Variable | Role |
|----------|------|
| `OPTARG` | Option argument |
| `OPTIND` | Next operand index |

POSIX-friendly option parsing for short flags. Long options need manual loops or external `getopt` (GNU vs BSD traps).

### `hash`

```bash
hash -r          # forget cached paths after install
hash -t python   # show remembered path
```

After upgrading tools mid-session, `hash -r` avoids stale paths.

### `help`

```bash
help set
help -d cd
```

Bash-only convenience; dash has no `help`. Use `man bash` / POSIX docs for portability work.

### `history`

```bash
history
history -c
```

Interactive. Scripts should not depend on history expansion (`!!`)—disable with `set +H` when needed.

### `kill` (builtin)

```bash
kill -TERM "$pid"
kill -9 %1          # job spec
```

Builtin understands **job specs**; external `/bin/kill` is PID-oriented. Prefer explicit `-TERM` over bare `-9` first.

| PS | C |
|----|---|
| `Stop-Process` | `taskkill` |

### `let`

```bash
let "n = n + 1"     # Bash arithmetic; prefer ((n++)) or $((…))
```

### `logout`

Exit a **login** shell. Non-login scripts use `exit`.

### `mapfile` / `readarray` (Bash 4+)

```bash
mapfile -t lines < file.txt
readarray -t lines < file.txt
```

| Flag | Meaning |
|------|---------|
| `-t` | Strip trailing delimiter |
| `-n N` | Copy at most N lines |
| `-s N` | Skip first N |

**Missing on Bash 3.2** (macOS stock). Portable fallback: `while IFS= read -r line; do …; done`.

### `printf`

```bash
printf '%s\n' "$value"
printf '%q\n' "$value"    # Bash: shell-escape (not POSIX)
```

Preferred over `echo` for portable formatting.

### `pwd`

```bash
pwd -P    # physical
pwd -L    # logical
```

Often builtin; `/bin/pwd` exists too.

### `read`

```bash
IFS= read -r line
read -r -p "Name: " name          # -p Bash prompt
read -r -a fields <<< "$line"     # Bash array
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `-r` | Raw (no backslash escape) | Prefer always |
| `-p` | Prompt | Bash |
| `-a` | Array | Bash |
| `-t` | Timeout | Bash |
| `-s` | Silent (password) | Bash |
| `-d D` | Delimiter | Bash |
| `-n N` | N chars | Bash |
| `-u FD` | Read from FD | Bash |

### `readonly`

```bash
readonly API_URL="https://example.invalid"
```

Prevents later assignment; combine with `export` carefully.

### `return`

Exit a **function** or **sourced** script with a status. Do not use `exit` inside sourced libraries unless you mean to kill the caller shell.

### `set`

Controls shell options and positional parameters—the most important “meta” builtin for production scripts.

```bash
set -euo pipefail       # Bash strict-mode habit (chapter 16) — NOT portable to dash
# -e  errexit: exit if a command fails (with important exceptions)
# -u  nounset: error on expanding unset variables
# -o pipefail: pipeline status is failure if any stage fails (Bash)

set -- a b c            # Replace positional parameters $1 $2 $3 with a b c
printf '%s\n' "$1" "$2" "$3"
set -x                  # xtrace: print commands as they run (debug)
set +x                  # Turn xtrace off
# Breakdown: set is both "options" and "argv for this shell/script"
```

| Common flag | Meaning |
|-------------|---------|
| `-e` | Exit on error |
| `-u` | Error on unset | 
| `-x` | Trace |
| `-v` | Verbose input |
| `-o pipefail` | Pipeline status (Bash; **not** dash) |
| `-o posix` | POSIX mode |
| `-n` | Parse only (syntax check) |
| `--` | End of options |

`set --` clears or sets `"$@"`. Critical for safe argument handling.

### `shift`

```bash
shift       # drop $1
shift 2     # drop two
```

### `shopt` (Bash-only)

```bash
shopt -s nullglob
shopt -s globstar          # ** — Bash 4+
shopt -p
```

Not available in dash. Check before using in portable `sh`.

### `test` / `[`

```bash
test -f "$file" && echo yes
[ -n "$str" ] || exit 1
[[ $str == *.txt ]]          # Bash/zsh keyword — not POSIX test
```

| Expression | Meaning |
|------------|---------|
| `-f` | Regular file |
| `-d` | Directory |
| `-e` | Exists |
| `-L` / `-h` | Symlink |
| `-r`/`-w`/`-x` | Permissions |
| `-z` / `-n` | String empty / nonempty |
| `=` / `!=` | String equal (POSIX) |
| `-eq`/`-ne`/`-lt`/… | Integer compare |
| `-e` file | Exists |

Prefer `[[ … ]]` only under Bash/zsh shebangs (chapter **09**). End `[` with `]` as a separate argument.

### `times`

Print shell and child CPU times. Niche for profiling scripts.

### `trap`

Register handlers for signals and shell events (cleanup on EXIT is the #1 production use).

```bash
tmp="$(mktemp)"                 # Create a unique temp file path
cleanup() {
  rm -f -- "$tmp"               # Remove temp; -- guards odd names
}
trap cleanup EXIT               # Run cleanup when this shell/script exits
trap 'echo interrupted >&2' INT TERM
# Breakdown:
#   trap HANDLER SIGNAL...  = "when SIGNAL arrives, run HANDLER"
#   EXIT                    = not a kernel signal; Bash/sh event on exit
#   INT/TERM                = Ctrl-C / polite kill — cooperative cancel
printf 'work\n' >"$tmp"
# ... do work ...
# EXIT trap still runs even if you return early
```

| Signal / event | Use |
|----------------|-----|
| `EXIT` | Always cleanup |
| `ERR` | Bash: on error (with caveats) |
| `INT`/`TERM` | Cooperative cancel |
| `DEBUG`/`RETURN` | Advanced Bash tracing |

Depth with `set -e`: chapter **16**.

### `type`

```bash
type -a python
type -t cd          # builtin
```

| Flag | Meaning |
|------|---------|
| `-a` | All matches |
| `-t` | Single word kind |
| `-p` | Path only if file |

### `ulimit`

```bash
ulimit -n           # open files
ulimit -c 0         # no core dumps
```

Soft/hard limits; containers and systemd may impose their own.

### `umask`

```bash
umask 022
umask -S            # symbolic show (Bash)
```

Affects default mode of new files in this shell.

### `unset`

```bash
unset VAR
unset -f myfunc
unset -v VAR
```

### `wait`

```bash
long_job &
pid=$!
wait "$pid"
```

| Form | Meaning |
|------|---------|
| `wait` | All children |
| `wait $pid` | Specific |
| `wait -n` | Next (Bash 4.3+) |

---

## 3. Advanced concepts

### 1. Builtin vs external matrix (common twins)

| Name | Builtin? | External? | Prefer in scripts |
|------|----------|-----------|-------------------|
| `echo` | Often | `/bin/echo` | `printf` |
| `pwd` | Often | `/bin/pwd` | Builtin fine |
| `kill` | Yes (jobs) | `/bin/kill` | Builtin OK; know job specs |
| `test` / `[` | Yes | `/usr/bin/[` / `test` | Builtin/`[[` under Bash |
| `printf` | Yes | `/usr/bin/printf` | Builtin fine |
| `true`/`false` | Yes | `/bin/true` | Either |

### 2. Interactive-only discipline

Never require: `bind`, `complete`, `compgen`, `history` expansion, aliases, `fc`, fancy `PROMPT_COMMAND`.

### 3. Restricted shell interactions

`rbash` blocks changing `PATH`, `SHELL`, redirection, `exec`, and some `enable`/`command -p` uses (chapter **22**). Builtins still exist—with clipped powers.

### 4. PowerShell / cmd parallels (not builtins of Bash)

| Bash builtin | PowerShell | cmd |
|--------------|------------|-----|
| `cd` | `Set-Location` | `CD` |
| `export` | `$env:NAME=` | `SET` |
| `set -x` | `Set-PSDebug -Trace` | N |
| `trap` | `try/catch/finally` | limited |
| `type` | `Get-Command` | `WHERE` |
| `.` | `.` dot-source | `CALL` |

Chapter **31** deepens Windows side.

### 5. Version gates

| Builtin / flag | Gate |
|----------------|------|
| `mapfile` | Bash 4+ |
| `declare -A` | Bash 4+ |
| `wait -n` | Bash 4.3+ |
| `shopt globstar` | Bash 4+ |
| `pipefail` | Bash (not dash; Bash 3.2 has it) |

### 6. Builtins across distros and eras

| Environment | What builtins “feel like” | Staff habit |
|-------------|---------------------------|-------------|
| Debian/Ubuntu `#!/bin/sh` → **dash** | No `[[`, no arrays, no `shopt`, limited `echo -e` | Write POSIX; test under `dash -n` / ShellCheck |
| RHEL `/bin/sh` → often **Bash** | Many Bashisms accidentally work | Still forbid Bashisms in portable `sh` libraries |
| Alpine BusyBox **ash** | Small builtin set; `local` often present; not Bash | Prove every script on Alpine CI |
| macOS stock **Bash 3.2** | No `mapfile`, no `declare -A` | Homebrew Bash 5 or Linux CI for modern Bash |
| macOS **zsh** interactive | Different options/`setopt` | Do not load-bearing for automation |
| Ancient Bash 3.x servers | Same class as macOS 3.2 | Inventory (**21**, **32**) |

```bash
# Portable discovery that works from early Linux to modern
command -v bash >/dev/null && bash --version | head -n1
ls -l /bin/sh
sh -c 'echo interpreter=$0'
```

### 7. Baby → advanced builtin drills

| Level | Drill |
|-------|-------|
| Baby | `cd`, `pwd`, `echo`, `exit` |
| Intermediate | `export`, `read -r`, `test`/`[`, `set --`, `shift` |
| Advanced | `trap`, `getopts`, `declare`, `mapfile`, `eval` (avoid), `exec` redirects |
| Staff | Prove same script under dash **and** Bash; ban interactive builtins in CI |

---

## 4. Applications

### Application — safe script preamble (Bash)

```bash
#!/usr/bin/env bash
set -euo pipefail
# … functions …
```

### Application — portable option parse

Use `getopts` under `#!/bin/sh` when possible; document any Bash-only `read` flags.

### Application — library source contract

Document: “source this file; it uses `return`; do not `exec` it.”

### Application — forbid eval in review

Any `eval` / `iex` requires threat model (chapter **18**).

### Staff-level review checklist

- Scripts do not rely on aliases or completion builtins.
- `command -v` used for discovery; `type -a` in debugging.
- `cd`/`export`/`read` understood as current-shell effects.
- `[[` / `declare -A` / `mapfile` gated to Bash 4+/5 shebangs.
- `set -euo pipefail` not claimed under dash.
- `trap` cleanup on EXIT for temps.
- `eval` absent or justified.
- Sourced libs use `return`, not casual `exit`.
- Job-control builtins not used as CI orchestration.
- Scripts tested under the estate’s real `/bin/sh` (dash vs Bash vs ash)—chapter **20**/**32**.
- Bash 3.2 estates inventoried before using Bash 4+ builtins.

---

## References

- [GNU Bash manual — Shell Builtin Commands](https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html)
- [POSIX special built-in utilities](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [ShellCheck](https://www.shellcheck.net/)

---

[← Back to Shell](./README.md)
