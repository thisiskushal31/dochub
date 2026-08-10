# Portable POSIX `sh` scripting

[← Back to Shell](./README.md)

## What this chapter covers

How to write scripts that survive **`#!/bin/sh`** across Debian/Ubuntu **dash**, Alpine **BusyBox ash**, and other POSIX-oriented shells—without Bashisms. You will learn portable tests, safe parameter use, what to avoid, and how minimal userlands differ from GNU/Bash hosts. Bash remains first-class elsewhere in this track; this chapter is the deliberate **portability lane**.

---

## 1. Concepts

### 1. What “portable `sh`” means

**POSIX Shell Command Language** defines a baseline: grammar, special parameters, redirection, pipelines, and a core utility set. A portable script aims to run whenever the interpreter is a POSIX `sh`—not whenever “someone’s Bash accepts it.”

Reality check: `/bin/sh` is a **symlink or binary choice** per OS image:

| Platform | Typical `/bin/sh` | Implication |
|----------|-------------------|-------------|
| Debian / Ubuntu | **dash** | Strict; rejects Bash arrays/`[[` |
| Alpine / many containers | **BusyBox ash** | POSIX-ish + BusyBox applet limits |
| Some RHEL/Fedora setups | Bash in POSIX mode | More permissive—**do not depend on that** |
| macOS | Bash 3.2 as `/bin/sh` historically; verify per release | Still not a license for Bashisms in committed `sh` |

Portable means: stick to the baseline so the strictest common target wins.

### 2. Shebang and invocation

```sh
#!/bin/sh
set -eu
```

Prefer `#!/bin/sh` when the contract is portability. Use `#!/usr/bin/env bash` only when you need Bash (chapter 09). Invoking `sh script.sh` ignores a Bash shebang’s intent if someone rewrites it—CI should call the intended interpreter explicitly.

### 3. Portable tests with `[` / `test`

Use `[` (or `test`), not `[[`:

```sh
if [ -f "$file" ] && [ -n "$name" ]; then
  printf '%s\n' "ok"
fi

if [ "$count" -gt 0 ]; then
  printf '%s\n' "nonzero"
fi
```

Rules of thumb:

- Quote variables: `[ -n "$x" ]`, not `[ -n $x ]`.
- Prefer `=` for string equality in portable `[` (some shells accept `==`; do not rely on it).
- Numeric compares: `-eq`, `-ne`, `-gt`, `-lt`, `-ge`, `-le`.
- Combine with `&&` / `||` of separate `[` commands, or use `-a` / `-o` carefully (portability and precedence footguns—many style guides prefer separate brackets).

### 4. Parameters and quoting (portable core)

Special parameters you will use constantly: `$0`, `$1`…, `$#`, `$@`, `$*`, `$?`, `$$`.

```sh
# Iterate arguments safely
for arg in "$@"; do
  printf '%s\n' "$arg"
done
```

Prefer `"$@"` over unquoted `$@`. Prefer `printf` over `echo` when escaping or portability of flags matters (`echo -n` / `echo -e` are historically messy).

### 5. Functions and `return`

POSIX allows functions. Prefer `return` for function exit status; avoid Bash `local` if you need maximum portability—`local` is **not** in POSIX (though widely present). Patterns:

| Need | Portable approach |
|------|-------------------|
| Function-scoped vars | Prefix names (`_tmp_…`) or accept shell-specific `local` only when pinned |
| Early exit from script | `exit` |
| Early return from function | `return` |

### 6. What “exists / missing” feels like day to day

| Construct | Portable `sh` | Bash | Notes |
|-----------|---------------|------|-------|
| `[` / `test` | Yes | Yes | Baseline |
| `[[` | **No** | Yes | Chapter 09 |
| Arrays | **No** | Yes | |
| Process substitution | **No** | Yes | |
| `source` keyword | **No** (use `.`) | Yes | `. ./lib.sh` |
| `function name {` | Avoid | Allowed | Use `name() {` |
| `declare` / `typeset` | **No** | Yes | |
| `local` | **Not POSIX** | Yes | Common extension—know your policy |
| `pipefail` | **No** (dash) | Yes | Check failures differently |
| Brace expansion `{1..3}` | **No** | Yes | Use loops |

---

## 2. Advanced concepts

### 1. Writing without Bash arrays

Replace arrays with:

- Multiple variables for tiny fixed sets
- Newline-delimited lists processed with `while IFS= read -r`
- External tools (`awk`, `sort`, `grep`) for bulk data
- Temporary files when lists are large (clean up with traps—chapter 16)

```sh
# Portable line loop
while IFS= read -r line || [ -n "$line" ]; do
  printf '%s\n' "$line"
done <file.txt
```

### 2. String surgery without Bash parameter fancy

Avoid `${var:0:3}`, `${var,,}`, `${!prefix*}`, etc. Portable toolkit:

| Need | Approach |
|------|----------|
| Length | `${#var}` (POSIX) |
| Prefix strip | `${var#pattern}` / `${var##pattern}` |
| Suffix strip | `${var%pattern}` / `${var%%pattern}` |
| Default values | `${var-default}` / `${var:-default}` / `${var=default}` … |
| Case fold | `tr '[:upper:]' '[:lower:]'` |
| Substring | `printf` + `cut` / `awk` / `sed` |

### 3. Conditionals and `case`

`case` is portable and often clearer than nested `[` chains:

```sh
case $mode in
  start|stop|restart) ;;
  *)
    printf '%s\n' "usage: $0 start|stop|restart" >&2
    exit 2
    ;;
esac
```

### 4. Debian dash specifics

dash is fast and strict. Failures you will see when Bash habits leak:

- `[[ … ]]` → syntax error
- `array=(a b)` → syntax error
- `function foo` → syntax error (use `foo()`)
- `echo -e` → not reliable; use `printf`
- Process substitution → syntax error
- `source` → usually missing; use `.`

Test with `dash -n script.sh` and run under `dash script.sh` on a Linux box before calling a script portable.

### 5. Alpine BusyBox notes

BusyBox provides a shell (**ash**) plus many applets (`grep`, `sed`, `find`, …) in one binary. Two traps:

1. **Language**: ash rejects Bashisms like dash.
2. **Userland**: applet flags are often **subset** of GNU. `grep -P`, GNU `find -printf`, long options, and some `sed` extensions may be missing.

```sh
# Prefer POSIX utility flags in portable scripts
grep -F 'literal' file.txt
sed 's/foo/bar/' file.txt
```

When an Alpine image needs Bash or GNU coreutils, install them explicitly—do not pretend BusyBox is GNU.

### 6. External utilities vs shell builtins

Portable scripts lean on POSIX utilities. Still verify presence in stripped images:

| Utility | Typical availability | Caution |
|---------|----------------------|---------|
| `posix` shell builtins | Required | Language only |
| `grep` `sed` `awk` `cut` `sort` | Common | Flag dialects differ (GNU vs BSD vs BusyBox) |
| `bash` | Optional | Must install on Alpine |
| GNU long options | Linux GNU | Missing on macOS BSD / BusyBox |

Path and userland depth continue in chapters 14–15; portability starts by not assuming GNU.

### 7. Error handling without `pipefail`

Without `pipefail`, inspect statuses explicitly or avoid masking:

```sh
set -eu
tmp=$(mktemp)
if grep -F pattern file.txt >"$tmp"; then
  sort "$tmp"
else
  status=$?
  rm -f "$tmp"
  exit "$status"
fi
rm -f "$tmp"
```

Or run critical stages as separate commands rather than long pipes when you need each status.

### 8. Windows bridges

Git Bash and WSL can run POSIX-like scripts, but committed “portable `sh`” for Unix agents should still be validated on dash/BusyBox—not only on Git Bash. PowerShell remains the native Windows lane (chapters 12–13).

### 9. Portable option parsing (lightweight)

`getopts` is the portable builtin for short options. Avoid Bash `getopt` assumptions and long-option libraries unless you vendor them.

```sh
while getopts "hf:v" opt; do
  case $opt in
    h) printf '%s\n' "usage: $0 [-v] -f file"; exit 0 ;;
    f) file=$OPTARG ;;
    v) verbose=1 ;;
    *) exit 2 ;;
  esac
done
shift $((OPTIND - 1))
```

For complex CLIs, a higher-level language may be clearer than heroic `sh` parsing.

### 10. Temporary files and cleanup (portable sketch)

```sh
set -eu
tmpdir=$(mktemp -d) || exit 1
trap 'rm -rf "$tmpdir"' EXIT INT TERM
# use "$tmpdir" …
```

`mktemp` availability and flags differ slightly; on strict embedded systems you may need a fallback. Never use predictable names like `/tmp/myapp.$$` for secrets on multi-user hosts.

### 11. Arithmetic

POSIX arithmetic via `$(( … ))` is fine. Avoid Bash `let` and `((…))` as a standalone command if you are aiming at the strictest readers—though many POSIX shells accept `((` as an extension. Prefer `$(( … ))` assignment forms that are widely documented for portable scripts.

### 12. Dotfiles and `.` vs PATH

`. ./lib.sh` requires a path. `. lib.sh` searches `PATH`—surprising and unsafe if `PATH` is attacker-influenced. Always dot-source with an explicit relative or absolute path.

---

## 3. Applications and use cases

### Container entrypoints

Minimal images favor `#!/bin/sh`. Keep entrypoints POSIX: no arrays, no `[[`, no Bash-only `echo`. If complexity grows, install Bash and change the shebang **on purpose**.

### Cross-distro packaging

Vendor install scripts that support Debian, Alpine, and RHEL should either be POSIX or ship separate branches. Document the matrix in the README next to the script.

### Embedded and IoT

BusyBox environments punish Bash assumptions. Portable `sh` plus careful applet flags is the difference between “boots” and “syntax error on device.”

### Security

Portable scripts still suffer injection via unquoted expansions. Quoting discipline is not Bash-specific. Avoid `eval`; prefer `case` dispatch over dynamic code.

### Software engineering

Enforce with CI:

```text
# Conceptual gate
dash -n scripts/*.sh
shellcheck -s sh scripts/*.sh
```

Reject PRs that add Bashisms to `sh` targets.

### Ops runbooks

When operators paste snippets into unknown appliances, POSIX-shaped snippets fail less often than Bash 5 snippets. Keep emergency one-liners conservative.

Multi-stage bootstrap example:

1. POSIX `sh` fetches and verifies an artifact (portable).
2. Artifact contains pinned Bash tooling for the heavy lift.
3. Never skip verification because “the second stage is Bash.”

### Application configuration renders

Template shells that emit nginx/HAProxy fragments should use quoted here-docs and POSIX `printf`. Bash brace expansion in generated paths causes “works on Ubuntu, breaks on Alpine” tickets.

### Compliance builds

Regulated pipelines sometimes mandate minimal base images (distroless/Alpine). Portable entrypoints reduce the need to install Bash solely for syntax comfort—smaller attack surface, fewer packages to patch.

### Staff-level review checklist

- Shebang is `#!/bin/sh` only if content is POSIX-clean.
- No `[[`, arrays, `|&`, process substitution, `source`, Bash case modifiers.
- `[` tests quote variables; string compare uses `=`.
- `printf` preferred where `echo` flags would matter.
- Validated under **dash** and, when relevant, **BusyBox ash**/Alpine.
- External tools use portable flags; GNU-only options gated or avoided.
- Pipeline failures considered without `pipefail`.
- Complexity that needs Bash upgraded to an explicit Bash shebang—not smuggled into `sh`.

---

## References

- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [POSIX `test` utility](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/test.html)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/) (for contrast—what *not* to use here)
- [ShellCheck](https://www.shellcheck.net/)
- [BusyBox](https://www.busybox.net/)
- [dash (Debian manpages portal)](https://manpages.debian.org/dash)
