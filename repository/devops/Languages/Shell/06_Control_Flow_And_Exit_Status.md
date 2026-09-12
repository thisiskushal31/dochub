# Control flow and exit status

[← Back to Shell](./README.md)

## What this chapter covers

How Bash and POSIX `sh` make decisions: **`if`**, **`case`**, **`for`**, **`while`**, the difference between **`[` / `test`** and Bash **`[[`**, and how **exit status** drives `&&` / `||` and CI failure. A short **PowerShell** `if` / `switch` sketch keeps Windows automation in view. You leave able to write conditionals that mean what reviewers think they mean—and to avoid `[[` under `#!/bin/sh`.

---

## 1. Concepts (basic)

### 1. Exit status is the boolean system

In Bourne-family shells, commands return an **integer exit status**. By convention **0 means success**; any non-zero means failure (with some tools using specific codes). There is no separate boolean type in portable `sh`. `if` tests status, not “truthy strings” the way some languages do.

```bash
if cp -- "$src" "$dst"; then
  echo "copied"
else
  echo "copy failed" >&2
  exit 1
fi
```

| Status | Meaning |
|--------|---------|
| `0` | Success |
| `1`–`255` | Failure / categories (tool-defined) |
| `"$?"` | Status of the **last** foreground command |

```bash
grep -q pattern file.txt
echo "$?"     # 0 match, 1 no match, 2 error (typical grep)
```

PowerShell: cmdlets often use **error records** and a boolean `$?`; native executables set `$LASTEXITCODE`. Do not assume Bash’s integer `$?` model.

### 2. `if` / `then` / `else` / `fi`

```sh
if command; then
  …
elif other_command; then
  …
else
  …
fi
```

The condition is a **command list**. Common conditions: `test` / `[`, Bash `[[`, `grep -q`, `command -v`, or any program.

### 3. `[` vs `test` vs `[[`

| Form | Portability | Notes |
|------|-------------|-------|
| `test expr` / `[ expr ]` | POSIX | Builtin or external; quote operands; `=` for string equal |
| `[[ expr ]]` | **Bash** (also zsh/ksh) | No word-splitting surprises the same way; `==`, `=~`, `&&` inside; **not** POSIX `sh` |

```bash
# Portable
if [ -f "$file" ]; then
  echo "regular file"
fi

if [ "$name" = "prod" ]; then
  echo "prod"
fi

# Bash-only — do not use under #!/bin/sh on dash
if [[ $name == prod && -f $file ]]; then
  echo "bash conditional"
fi
```

**BusyBox / dash:** use `[`. **macOS Bash 3.2:** `[[` works (Bash); `=~` regex exists in Bash but details evolved—test on your pin. Prefer `[` for portable scripts.

File-test sketch (POSIX `[`):

```sh
[ -e "$p" ]   # exists
[ -f "$p" ]   # regular file
[ -d "$p" ]   # directory
[ -L "$p" ]   # symlink (where supported)
[ -r "$p" ]   # readable
[ -z "$s" ]   # string empty
[ -n "$s" ]   # string non-empty
```

### 4. `&&` and `||`

```bash
mkdir -p -- "$dir" && cp -- "$src" "$dir/"
command -v jq >/dev/null || { echo "jq missing" >&2; exit 127; }
```

Short-circuit lists are clear for simple control flow; deep chains become unreadable—prefer `if` for multi-branch logic. With `set -e`, some list contexts are subtle (robustness chapter); write obvious `if` when failure handling matters.

### 5. `case` for pattern branches

```sh
case $1 in
  start)  echo starting ;;
  stop)   echo stopping ;;
  restart) echo restarting ;;
  *)      echo "usage: $0 start|stop|restart" >&2; exit 2 ;;
esac
```

Patterns are globs, not regex. Quote the subject when it may be empty or special. Portable and appropriate for `#!/bin/sh`.

### 6. Loops: `for`, `while`, `until`

```bash
# Iterate words — quote when expanding lists of files
for f in "$@"
do
  printf 'file=%s\n' "$f"
done

# C-style for — Bash (not POSIX sh)
for ((i = 0; i < 3; i++)); do
  echo "$i"
done

while read -r line; do
  printf 'line=%s\n' "$line"
done < file.txt
```

| Loop form | Bash 3.2 | POSIX `sh` | Notes |
|-----------|----------|------------|-------|
| `for w in …` | Yes | Yes | Classic |
| `for ((…))` | Yes | **No** | Bash arithmetic for |
| `while` / `until` | Yes | Yes | Status-based |
| `select` | Yes | **No** | Bash interactive menus |

Reading lines: prefer `read -r` and watch the last line without newline. Pipelines may run the loop in a subshell—status and variable updates may not propagate (Bash `lastpipe` / process substitution are advanced topics).

### 7. PowerShell sketch: `if` and `switch`

```powershell
if (Test-Path -LiteralPath $Path) {
  "exists"
} elseif ($Force) {
  "missing but forced"
} else {
  throw "path missing: $Path"
}

switch -Regex ($Name) {
  '^prod' { "production"; break }
  '^dev'  { "development"; break }
  default { "other" }
}
```

Conditions are PowerShell expressions (booleans, objects), not exit statuses. To branch on a native program:

```powershell
& $cmd @args
if ($LASTEXITCODE -ne 0) { throw "failed: $LASTEXITCODE" }
```

Windows PowerShell **5.1** and PowerShell **7** share this shape; differences show up more in modules and operators than in basic `if`.

---

## 2. Advanced concepts

### 1. `[` is not magic syntax alone

`[` is a command; the closing `]` is an argument. Spaces matter:

```sh
# Wrong
#if [$x=1]; then

# Right
if [ "$x" = 1 ]; then
```

### 2. Numeric vs string comparison

```sh
[ "$a" -eq "$b" ]    # integers
[ "$a" = "$b" ]      # strings (POSIX)
```

Bash `[[` allows `==` and locale-dependent number rules with care. Unvalidated numeric tests on non-integers fail—validate before `-eq`.

### 3. `set -e` interaction (preview)

`set -e` aborts on failing commands with exceptions for some contexts (`if` tests, `&&`/`||` left-hand sides, etc.). Relying on tribal memory is fragile; prefer explicit status checks for critical paths and read the robustness chapter before enabling `errexit` everywhere.

### 4. Pipelines and status

By default, `"$?"` after a pipeline is the status of the **last** command. Bash `set -o pipefail` makes the pipeline fail if any stage fails—**Bash** (not portable `sh` / dash unless supported). Use it in Bash CI scripts; do not assume it under BusyBox.

```bash
set -o pipefail
printf 'a\nb\n' | grep -q z | cat
echo "$?"
```

### 5. `[[ =~ ]]` and version notes

Bash regular-expression matching inside `[[` is powerful and easy to get wrong with quoting. Available in Bash (including many 3.2 builds) but **not** POSIX. Prefer external `grep -E` for portable scripts.

### 6. zsh conditionals

zsh supports `[[` and its own `[` quirks. Interactive zsh options can change globbing inside loops. Committed automation should still be validated under Bash or `sh` as declared.

### 7. cmd `if errorlevel`

```bat
cmd /c some.exe
if errorlevel 1 echo failed
```

Different language; keep batch conditionals in `.bat` files, not copy-pasted into Bash.

### 8. Arithmetic decisions

```bash
# POSIX arithmetic command
if [ "$((x + 1))" -gt 10 ]; then
  echo "big"
fi

# Bash arithmetic compound — not POSIX sh
if (( x > 10 )); then
  echo "big"
fi
```

Use `((…))` only under Bash shebangs. For portable scripts, prefer `$((…))` inside `[` carefully with validated integers.

### 9. Selecting on availability, not hope

```bash
fetch() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO- "$1"
  else
    echo "need curl or wget" >&2
    return 127
  fi
}
```

Branching on tooling is control flow plus dependency policy—record the preference in the script header.

### 10. Status capture patterns

```bash
status=0
grep -q pattern file.txt || status=$?
case $status in
  0) echo match ;;
  1) echo no_match ;;
  *) echo error >&2; exit "$status" ;;
esac
```

This pattern keeps failure categories explicit—know whether your script enables `errexit` before copying list-heavy idioms.

---

## 3. Applications and use cases

### CI gate scripts

Use explicit exit codes: `0` success, `2` usage, non-zero for tool failure. Print actionable errors to stderr. Prefer `if ! cmd; then …; fi` over opaque one-liners when on-call must read logs at 3am.

```bash
if ! npm test; then
  echo "unit tests failed" >&2
  exit 1
fi
```

### Feature detection

```sh
if command -v docker >/dev/null 2>&1; then
  docker version
else
  echo "docker not installed" >&2
  exit 127
fi
```

`command -v` is the portable “is this on PATH?” check (prefer over `which`).

### Safe destructive operations

Branch on confirmation and existence before `rm`, `drop`, or cloud deletes. Default deny in `case` `*)` arms.

```bash
case ${CONFIRM:-} in
  yes|YES) ;;
  *) echo "set CONFIRM=yes to proceed" >&2; exit 2 ;;
esac
```

### Health checks and loops

```bash
attempts=0
until curl -fsS "$URL" >/dev/null; do
  attempts=$((attempts + 1))
  [ "$attempts" -ge 30 ] && exit 1
  sleep 2
done
```

Bound every retry loop; unbounded `while true` without a breaker is an outage pattern.

### Cross-OS control flow

| Lane | Habit |
|------|--------|
| Linux Bash 5 CI | `[[` OK if shebang is bash; `pipefail` OK |
| POSIX entrypoint | `[`, `case`, no `[[`, no `for ((` |
| macOS stock Bash 3.2 | `[[` OK; avoid 4+ only features elsewhere |
| PowerShell 7 agents | `if` / `switch`; check `$LASTEXITCODE` for natives |
| BusyBox | POSIX subset; test on Alpine |

Linux shell context companion: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md).

```powershell
$attempts = 0
do {
  try {
    Invoke-WebRequest -Uri $Url -UseBasicParsing | Out-Null
    $ok = $true
  } catch {
    $ok = $false
    Start-Sleep -Seconds 2
    $attempts++
  }
} while (-not $ok -and $attempts -lt 30)
if (-not $ok) { exit 1 }
```

### Staff-level review checklist

- No `[[` or `for ((` in `#!/bin/sh` scripts.
- Operands to `[` are quoted; spaces around operators present.
- Exit codes are intentional and documented for CI.
- `pipefail` only where Bash is guaranteed.
- Loops over files use proper quoting / `"$@"`.
- PowerShell native failures check `$LASTEXITCODE`, not only boolean `$?`.
- Default `case` / `switch` branches fail closed for unknown input.
- Retry loops are bounded and log why they stopped.
- Destructive paths require an explicit confirmation gate.

---

## References

- [GNU Bash manual — Conditional Constructs](https://www.gnu.org/software/bash/manual/html_node/Conditional-Constructs.html)
- [GNU Bash manual — Looping Constructs](https://www.gnu.org/software/bash/manual/html_node/Looping-Constructs.html)
- [GNU Bash manual — Bourne Shell Builtins (`test`)](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html)
- [POSIX `test`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/test.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [about_If (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_if)
- [about_Switch](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_switch)
- [ShellCheck](https://www.shellcheck.net/)
