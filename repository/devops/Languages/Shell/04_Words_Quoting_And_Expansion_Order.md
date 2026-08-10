# Words, quoting, and expansion order

[← Back to Shell](./README.md)

## What this chapter covers

How a Unix shell turns a command line into **words**, why **quoting** exists, and the **order of expansions** that makes `$var`, globs, and command substitution behave the way they do. Bash and POSIX `sh` share the core model; zsh differs in places; PowerShell uses a different quoting and expansion story—sketched here so you do not paste Bash habits into `pwsh` blindly. Master this chapter and you prevent the most common injection and “it split my filename” bugs before variables and control flow deepen.

---

## 1. Concepts (basic)

### 1. What a “word” is

In Bourne-family shells (POSIX `sh`, Bash, dash, BusyBox ash), a command line is split into **words** (fields) that become the command name and its arguments. Spaces and tabs are default **IFS** separators. Unquoted expansions are split again after substitution—this is the root of most quoting bugs.

```bash
# Three words: command + two arguments
printf '%s\n' one two

# One argument that contains a space — needs quotes
printf '%s\n' "one two"
```

| OS / shell | Word model |
|------------|------------|
| Linux Bash / dash / BusyBox | POSIX-style words + IFS splitting |
| macOS Bash 3.2 / zsh | Same family; zsh globbing/splitting defaults can differ |
| PowerShell | **Token** parsing; pipelines pass objects; quoting rules differ |
| cmd | `%VAR%` expansion and its own parsing— unrelated |

### 2. Why quoting exists

Quoting controls which characters stay literal and whether expansion/splitting happens.

| Form | Typical effect (Bash / POSIX) |
|------|--------------------------------|
| **Double quotes** `"…"` | Group into one word; `$`, `` ` ``, `$(( ))`, and `\` still special |
| **Single quotes** `'…'` | Everything literal; no expansion |
| **Unquoted** | Expansion + **word splitting** + **globbing** |
| **Backslash** `\` | Escape one character outside single quotes |

```bash
name="Ada Lovelace"
echo $name          # two words after split — often wrong
echo "$name"        # one word — usually right
echo '$name'        # literal $name
```

### 3. Expansion order (mental model)

Exact lists live in the manuals; the operational order you must remember for Bash/POSIX:

1. **Brace expansion** (Bash; not POSIX `sh`)
2. **Tilde expansion**
3. **Parameter, variable, arithmetic, and command substitution** (left-to-right)
4. **Word splitting** (unquoted results; uses `IFS`)
5. **Pathname expansion** (globs: `*`, `?`, `[…]`)
6. **Quote removal**

```bash
# Brace expansion (Bash) happens early — not in strict POSIX sh
echo file.{txt,md}

# Unquoted glob expands to matching names
echo *.sh

# Quoted glob stays literal
echo "*.sh"
```

**BusyBox / dash:** no Bash brace expansion. **Bash 3.2 vs 5.x:** brace expansion and globs exist on both; recursive `**` needs Bash **4+** and `shopt -s globstar`.

### 4. Command substitution

```bash
# Modern form (POSIX)
today=$(date +%F)
echo "$today"

# Nested — quote the outer use
echo "build-$(git rev-parse --short HEAD)"
```

Unquoted `$(…)` is split on IFS. Always quote unless you **intentionally** want splitting.

### 5. IFS and word splitting

`IFS` (Internal Field Separator) defaults to space/tab/newline. Changing it changes splitting:

```bash
IFS=:
entry="a:b:c"
# intentional split into words
set -f              # optional: disable glob during experiment
set -- $entry
printf '<%s>\n' "$@"
```

Restoring `IFS` and `set +f` matters in real scripts—prefer local changes in functions (later chapter) or `read` with explicit delimiters.

### 6. PowerShell quoting (brief contrast)

PowerShell is **not** IFS-splitting Bash:

| Syntax | Role |
|--------|------|
| `"…"` | Expand `$variables` and subexpressions `$(…)` |
| `'…'` | Mostly literal |
| `` ` `` | Escape character (backtick), not command substitution |
| `&` | Call operator for strings that name commands |

```powershell
$name = "Ada Lovelace"
Write-Output $name          # one string object — not IFS-split
Write-Output "$name"
Write-Output '$name'        # literal
```

Passing arguments to external programs still needs care (native argument marshalling), but the Bash “unquoted `$file` became two arguments” failure mode is a different language bug.

---

## 2. Advanced concepts

### 1. Globbing vs regex

Globs (`*`, `?`, `[abc]`) are expanded by the shell **before** the command runs. `grep` regex is inside the tool. Quote patterns you mean as literal data for `grep`/`find`.

```bash
# Shell expands *.log first — grep may never see the pattern
# Usually you want:
grep -E 'error|warn' *.log
```

### 2. `set -f` / `noglob`

Disable pathname expansion when you must process raw `*` characters. Rare in apps; useful in path-processing utilities. zsh uses `noglob` / different glob qualifiers—do not assume Bash `set -f` in zsh without checking.

### 3. Arrays and `"$@"` (preview)

Lists of words are safely passed with `"$@"` (all positional parameters, separately quoted). `"$*"` joins differently. Full treatment lives in the variables chapter; the quoting rule starts here: **quote the expansion that should remain one argument or one array of arguments**.

```bash
set -- "a b" c
printf '<%s>\n' "$@"   # <a b> then <c>
printf '<%s>\n' "$*"   # <a b c> as one word (IFS first char joins)
```

### 4. Bashisms that look like quoting

- `$'...'`: ANSI-C quoting (escapes like `\n`) — **Bash** (and some others); not portable `sh`.
- `$"..."`: locale translation — Bash; avoid in portability-critical scripts.
- `<<EOF` vs `<<"EOF"`: here-docs expand or not based on quoting the delimiter.

```bash
# Bash ANSI-C quoting
printf '%s\n' $'line\none'
```

Works on Bash 3.2+; still avoid under `#!/bin/sh` on dash.

### 5. zsh splitting differences

zsh often does **not** perform word splitting on unquoted parameter expansions the same way Bash does (depending on options). A script tested only in interactive zsh can hide Bash splitting bugs—or the reverse. Test committed Unix automation under the claimed interpreter (Bash or `sh`).

### 6. cmd contrast (one glance)

```bat
set NAME=Ada Lovelace
echo %NAME%
```

Percent expansion and quoting rules are unrelated to Bash. Do not mix examples across dialects in one file without a dispatcher.

### 7. Security: injection via expansion

Unquoted expansions feed word splitting and globbing—attackers who control environment values or filenames reshape your command line.

```bash
# Dangerous pattern sketch — do not use with untrusted input
# rm -rf $TARGET
# If TARGET='a b /important', splitting widens the blast radius.

target=${1:?}
rm -rf -- "$target"
```

PowerShell analogue risk is often **`Invoke-Expression`** on unsanitized strings, not IFS splitting—different mechanism, same “string became code” class.

### 8. Here-documents and quoting the delimiter

```bash
# Expands variables
cat <<EOF
home=$HOME
EOF

# No expansion
cat <<'EOF'
home=$HOME
EOF
```

Use quoted delimiters for policies, SQL, or manifests where `$` must stay literal. Unquoted delimiters are convenient for templating—and easy to leak secrets if `set -x` prints them.

### 9. Process substitution (Bash) is not quoting—but couples to it

```bash
# Bash — not POSIX sh; fine on Bash 3.2+ where /dev/fd works
diff <(sort a.txt) <(sort b.txt)
```

Still quote ordinary expansions nearby. Process substitution is a Bash extension; dash/BusyBox will not accept it.

### 10. Common failure gallery

| Broken habit | What happens | Fix |
|--------------|--------------|-----|
| `for f in $(ls)` | Splits on spaces; breaks on odd names | `for f in *; do` or `find -print0` patterns |
| `args=$1 $2` | Word split / wrong assignment | `args="$1 $2"` or keep `"$@"` |
| `ssh host rm -rf $dir` | Remote sees split words | Pass carefully quoted remote command |
| `curl $url` | Query `&` / spaces break | `"$url"` and prefer arg arrays |

```bash
# Safer iteration sketch
for f in *.txt; do
  [ -e "$f" ] || continue   # handle no-match depending on nullglob
  process "$f"
done
```

Bash `shopt -s nullglob` changes unmatched-glob behavior (Bash); do not assume it under `sh`.

---

## 3. Applications and use cases

### CI scripts and paths with spaces

macOS and Windows paths commonly contain spaces. Quote every expansion that carries a path. Prefer `"$1"` / `"${var}"` / `"${array[@]}"` habits by default.

```bash
src=$1
dst=$2
cp -- "$src" "$dst"
```

### Wrappers around cloud CLIs

CLIs that take many flags break when unquoted JSON or URLs split. Build argument arrays in Bash 3.2+ compatible form:

```bash
args=(-o "json" --id "$id")
somecli "${args[@]}"
```

Associative arrays for option maps need Bash **4+**—version-gate or avoid.

### JSON and nested quotes

Prefer tools that accept files or stdin over mega-quoted one-liners:

```bash
payload=$(jq -n --arg id "$id" '{id:$id}')
printf '%s\n' "$payload" | somecli create --body-file -
```

When you must nest quotes, build from arrays or heredocs—readable beats clever.

### Cross-OS notes

| Situation | Habit |
|-----------|--------|
| Bash on Linux CI | Quote; ShellCheck in CI |
| Bash 3.2 on Mac | Same quoting rules; avoid 4+ only features |
| BusyBox `sh` | Quote; no Bash brace/`$''` |
| PowerShell 5.1 / 7 | Use PS quoting; avoid `Invoke-Expression` |
| Calling `bash` from `pwsh` | Pass arguments as separate args, not one giant expanded string |

```powershell
# Prefer argument arrays over string eval
& bash ./task.sh --id $Id
# Not: Invoke-Expression "bash ./task.sh --id $Id"
```

Filename and path tooling across OSes is expanded in later command chapters; quoting discipline starts here. For OS-context shell overview see [`../../Operating-Systems/Unix/9_Shell_And_Scripting.md`](../../Operating-Systems/Unix/9_Shell_And_Scripting.md).

### Logging and privacy

Quoted expansions still print secrets if you `echo "$PASSWORD"`. Quoting is not redaction—combine with secret hygiene (later security chapter).

```bash
log_info() { printf '%s\n' "$*" >&2; }
# never: log_info "$token"
```

### Staff-level review checklist

- Paths and user-influenced strings are **quoted** at use sites.
- Unquoted expansions are intentional and commented (rare).
- No reliance on interactive zsh splitting behavior for committed Bash/`sh` scripts.
- Bash-only `$''` / brace expansion absent from `#!/bin/sh` scripts.
- ShellCheck (or equivalent review) runs in CI for shell sources.
- PowerShell scripts avoid string-eval patterns for untrusted input.
- Tests include a path containing spaces on at least one OS you support.
- Heredocs that must stay literal use a quoted delimiter.
- No `for f in $(ls)` patterns in new code.

---

## References

- [GNU Bash manual — Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html)
- [GNU Bash manual — Quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html)
- [POSIX Shell Command Language — Token Recognition](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [about_Quoting (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules)
- [about_Parsing](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing)
- [ShellCheck](https://www.shellcheck.net/)
