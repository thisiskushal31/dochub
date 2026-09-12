# Bash extensions in depth (version-gated)

[← Back to Shell](./README.md)

## What this chapter covers

Bash features that go **beyond** POSIX `sh`: `[[ … ]]`, indexed and associative arrays, process substitution, namerefs, `|&`, `mapfile`/`readarray`, case-modifying expansions, and related helpers. Every construct is marked **added in**, **present on Bash 3.2**, or **missing on 3.2 / POSIX**. Default narrative is **Bash 5.x**; stock macOS **Bash 3.2** and `#!/bin/sh` (dash/BusyBox) are brownfield traps. After this chapter you should choose Bash deliberately—or refuse extensions under portable `sh`.

---

## 1. Concepts

### 1. Why Bash extensions exist

POSIX `sh` is intentionally small. Bash adds structured tests, arrays, richer redirection sugar, and parameter transforms so operators can write clearer automation on Linux and modern CI images. Extensions are **not** free portability: each one is a compatibility debt against dash, BusyBox, and Bash 3.2.

Rule of thumb:

| Goal | Shebang / pin |
|------|----------------|
| Linux/CI automation with Bash features | `#!/usr/bin/env bash` + document **minimum major** (prefer 4+ or 5+) |
| Portable scripts | `#!/bin/sh` and **no** Bashisms (chapter 10) |
| macOS stock `/bin/bash` | Assume **3.2** unless Homebrew Bash is required |

### 2. `[[ … ]]` vs `[` / `test`

`[[ … ]]` is a Bash (and ksh/zsh) **conditional command**, not an external `test`. It enables safer string compares, regex (`=~`), and cleaner logic without as much quoting gymnastics.

```bash
if [[ -f $file && $name == *.txt ]]; then
  printf '%s\n' "text file"
fi

if [[ $version =~ ^[0-9]+\.[0-9]+$ ]]; then
  printf '%s\n' "semver-ish: $version"
fi
```

| Form | Bash | POSIX `sh` | Notes |
|------|------|------------|-------|
| `[` / `test` | Yes | Yes | Portable baseline |
| `[[ … ]]` | Yes (incl. 3.2) | **No** | Prefer for Bash scripts; never under `#!/bin/sh` |

### 3. Indexed arrays

Indexed arrays exist in Bash **including 3.2**:

```bash
files=(a.txt b.txt c.txt)
files+=(d.txt)
printf '%s\n' "${files[0]}"
printf '%s\n' "${files[@]}"     # all elements
printf '%s\n' "${#files[@]}"    # length
```

Quoting `"${array[@]}"` preserves elements; unquoted expansion reopens word-splitting hazards (chapter 04).

### 4. Associative arrays (Bash 4.0+)

Key/value maps require Bash **4.0+** (`declare -A`). **Missing on Bash 3.2** (stock macOS).

```bash
declare -A ports
ports[http]=80
ports[https]=443
printf '%s\n' "${ports[https]}"
printf '%s\n' "${!ports[@]}"    # keys
```

### 5. Process substitution

`<(list)` and `>(list)` present command output/input as a file path (typically `/dev/fd/…`). Available in **Bash 3.2 and later**; **not** POSIX; **not** dash.

```bash
diff -u <(sort left.txt) <(sort right.txt)
```

Do not put process substitution in `#!/bin/sh` scripts.

### 6. When **not** to use these under `#!/bin/sh`

If the shebang is `sh`, treat the following as forbidden unless you have proven every target `/bin/sh` is Bash (you usually have not):

- `[[ … ]]`
- Arrays (`a=(…)`, `${a[@]}`)
- `declare`/`local` nuances beyond portable subset
- Process substitution
- `|&`, `&>>`, `&>>`
- `mapfile` / `readarray`
- Namerefs (`declare -n`)
- `${var,,}` / `${var^^}` and friends
- `{1..10}` brace expansion (not POSIX)
- `source` as a synonym (use `.` for portability)
- Bash-only `echo` flags—prefer `printf`

ShellCheck with `shell=sh` is the mechanical enforcer; chapter 17 covers tooling.

---

## 2. Advanced concepts

### 1. Master version gate table

| Feature | Added in | Bash 3.2 (macOS stock) | Bash 4.x / 5.x | Under `#!/bin/sh` |
|---------|----------|------------------------|----------------|-------------------|
| `[[ … ]]` | Early Bash | Present | Present | **Avoid** |
| Indexed arrays | Early Bash | Present | Present | **Avoid** |
| Associative arrays `declare -A` | **4.0** | **Missing** | Present | **Avoid** |
| Process substitution `<( )` | Early Bash | Present | Present | **Avoid** |
| `|&` | **4.0** | **Missing** | Present | **Avoid** |
| `mapfile` / `readarray` | **4.0** | **Missing** | Present | **Avoid** |
| Case modifiers `${var,,}` `${var^^}` `${var,}` `${var^}` | **4.0** | **Missing** | Present | **Avoid** |
| Namerefs `declare -n` | **4.3** | **Missing** | Present (4.3+) | **Avoid** |
| `coproc` | **4.0** | **Missing** | Present | **Avoid** |
| `**` globstar (needs `shopt -s globstar`) | **4.0** | **Missing** | Present | **Avoid** |
| `${var:offset:length}` substrings | Early Bash | Present | Present | **Avoid** (use `printf`/POSIX tools) |
| Here-string `<<<` | Early Bash | Present | Present | **Avoid** |
| `&>>` append both streams | **4.0** | **Missing** | Present | Use `>>f 2>&1` |
| `@Q` / parameter transformations (selected) | **4.4+** (family grows in 5.x) | **Missing** | Check version | **Avoid** |

Discover reality before coding:

```bash
bash --version | head -n1
# On macOS, /bin/bash is often 3.2.x even when Homebrew bash exists elsewhere
command -v bash; type bash
```

### 2. `mapfile` / `readarray`

Populate an array from lines (Bash **4.0+**):

```bash
mapfile -t lines < file.txt
# synonym:
readarray -t lines < file.txt
```

`-d` delimiter options appear in later 4.x/5.x—verify against your pinned Bash before relying on them. On Bash 3.2, use a `while IFS= read -r` loop instead.

### 3. Namerefs (`declare -n`) — Bash 4.3+

Namerefs alias one variable name to another—useful for passing array/name indirection into functions without `eval`:

```bash
deref() {
  declare -n ref=$1
  ref+=("extra")
}
arr=(a b)
deref arr
printf '%s\n' "${arr[@]}"
```

**Missing on 3.2.** Misused namerefs create confusing circular resolutions; keep them local and short-lived. Prefer explicit array passing patterns when teammates are Bash-casual.

### 4. Case-modifying expansions — Bash 4.0+

```bash
name="BaSh"
printf '%s\n' "${name,,}"   # bash
printf '%s\n' "${name^^}"   # BASH
printf '%s\n' "${name,}"    # baSh (first char lower)
printf '%s\n' "${name^}"    # BaSh (first char upper)
```

**Missing on 3.2.** Portable alternative: `tr` or `awk` for case folds when you must support 3.2 or POSIX `sh`.

### 5. `|&` and related sugar

`|&` is Bash **4.0+** shorthand for `2>&1 |`. On 3.2 write the long form. Prefer the long form in shared examples when readers include macOS stock Bash.

### 6. Associative array pitfalls

- Always `declare -A` before first assignment in scripts that may run under `set -u`.
- Keys are strings; numeric-looking keys are still keys, not indices.
- Iterating `"${assoc[@]}"` yields values; `"${!assoc[@]}"` yields keys.
- Serialization across process boundaries needs an explicit format (JSON, `key=value` lines)—arrays do not survive as environment variables cleanly.

### 7. Interactive vs scripted extension use

Brace expansion, extended globs (`shopt -s extglob`), and `globstar` often appear in interactive zsh/Bash power-user setups. Committed scripts should enable `shopt` explicitly and document Bash ≥ 4 when `globstar` is required.

### 8. Cross-shell existence (not “same syntax”)

| Feature | Bash 5 | Bash 3.2 | zsh | dash | PowerShell | cmd |
|---------|--------|----------|-----|------|------------|-----|
| `[[ ]]` | Yes | Yes | Yes (own rules) | No | N/A | N/A |
| Assoc arrays | 4+ | No | Yes (`typeset -A`) | No | Hashtables | No |
| Process subst | Yes | Yes | Yes | No | Different | No |
| Namerefs | 4.3+ | No | Different | No | Different | No |

zsh is not a drop-in for Bash extensions—chapter 11. PowerShell has its own collections—chapter 12.

### 9. `coproc` (Bash 4.0+) — rare but real

Coprocesses open a bidirectional channel to a background command. They are powerful and easy to misuse (deadlocks, leftover FDs). Most DevOps scripts should prefer simpler pipes or an external supervisor. If you need `coproc`, document Bash ≥ 4 and add timeouts.

### 10. Extended tests inside `[[`

```bash
[[ -e $path && -r $path ]]
[[ $host == prod-* ]]          # pattern match (not regex)
[[ $host =~ ^prod-[0-9]+$ ]]  # regex; captures in BASH_REMATCH
```

`=~` behavior and locale interactions deserve tests. Prefer anchoring regexes. On Bash 3.2, `=~` exists but some later niceties differ—still never use `[[` under `#!/bin/sh`.

### 11. Indirect expansion vs namerefs

`${!name}` expands the variable whose name is stored in `name`. It predates namerefs and appears on Bash 3.2. Prefer namerefs (4.3+) for clearer intent when you control the Bash version; avoid either form when the name string is untrusted.

```bash
var=payload
name=var
printf '%s\n' "${!name}"   # payload
```

### 12. Compatibility shims (use sparingly)

Teams sometimes detect version and branch:

```bash
if ((BASH_VERSINFO[0] < 4)); then
  printf '%s\n' "Bash 4+ required" >&2
  exit 1
fi
```

Failing fast beats half-working shims that hide assoc-array usage behind slow temp files—unless you intentionally maintain a 3.2-compatible path for macOS stock Bash.

---

## 3. Applications and use cases

### Linux CI and servers (Bash 5.x)

Use arrays, `mapfile`, and `[[ ]]` freely when the image pins Bash 5.x. Record the pin next to the workflow file so macOS contributors do not “fix” scripts against `/bin/bash` 3.2 and ship breakage.

### macOS developer laptops

Stock `/bin/bash` is **3.2**. Options:

1. Require **Homebrew** `bash` and shebang to that path / `env bash` with PATH set in CI.
2. Stay within 3.2-safe Bash (no assoc arrays, no `|&`, no `mapfile`, no namerefs, no `${var,,}`).
3. Write POSIX `sh` for the shared core.

### Containers

Debian/Ubuntu entrypoints with `#!/bin/sh` → **dash**: Bash extensions fail loudly. Alpine → BusyBox ash: same story. Install `bash` explicitly if you need chapter-09 features.

### Application packaging

Install scripts that claim “works on Mac and Linux” must either avoid Bash 4+ features or install/pin Bash 4+. “Works on my Ubuntu” is not a matrix.

### Security

Arrays and `mapfile` reduce some `eval` temptations—good. Namerefs and indirect `${!name}` can reintroduce injection if names come from untrusted input. Never let attackers choose the nameref target.

### Software engineering

Encode the dialect in the filename or directory (`scripts/bash/`, `scripts/posix/`) and fail CI if Bashisms appear under `sh`. Prefer one rich Bash toolkit over a mix of accidental extensions.

Library layout example:

```text
scripts/
  lib/
    log.sh          # POSIX-safe helpers
    maps.bash       # Bash 4+ associative helpers — sourced only from bash entrypoints
  ci-run.bash
  container-entry.sh
```

### Data shaping

`mapfile` plus `"${lines[@]}"` beats brittle `for line in $(cat …)` (which reopens splitting/globbing). Combine with `IFS=$'\n'` carefully; prefer `read -r` loops when targeting 3.2.

### Incident response

Break-glass scripts on unknown appliances should avoid Bash 4+ features unless you first print `bash --version`. Associative arrays that never run on the jump host waste minutes during an outage.

### Staff-level review checklist

- Shebang matches features (`bash` vs `sh`).
- Any associative array / `mapfile` / `|&` / `${var,,}` / `declare -n` justified with **Bash ≥ 4** (or ≥ 4.3 for namerefs)?
- Stock macOS 3.2 called out or eliminated via Homebrew pin?
- ShellCheck run with appropriate `shell=` directive?
- No Bashisms in container `#!/bin/sh` entrypoints?
- Untrusted input never becomes a nameref or `eval` target?
- Process substitution not assumed available under `sh` or exotic `/dev/fd`-less environments?

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [Bash man page (reference)](https://www.gnu.org/software/bash/manual/html_node/index.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [ShellCheck](https://www.shellcheck.net/)
- [Chet Ramey Bash page](https://tiswww.case.edu/php/chet/bash/bashtop.html)
