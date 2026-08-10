# What is a shell — Bash, POSIX sh, and the family

[← Back to Shell](./README.md)

## What this chapter covers

What a **shell** is as a category of program, how that differs from **Bash** specifically, where **POSIX `sh`**, **zsh**, **PowerShell**, and **cmd** sit in the same family tree (or beside it), and why DevOps and whole-engineering work depends on naming the dialect and the OS—not saying “the shell” as if there were one. Later chapters teach quoting, control flow, and production idioms; here you learn the map so you stop writing Bashisms under `#!/bin/sh` or assuming macOS `/bin/bash` is modern Bash.

**Shell vs scripting (crystal clear):**

| Term | Meaning |
|------|---------|
| **Shell** | The **bigger set**: the program (and the family of dialects) that reads command lines—interactively **or** from a file—plus all the **modes, surfaces, and hosts** that wrap that program |
| **Scripting** | **One** important **subset**: saving those commands in a **file** (or CI string) so the shell can run them later without retyping |

Interactive typing and scripts use the **same** shell language. Scripts are not a different product—they are saved recipes.

**Shell has many subsets—not only scripting.** Modes (interactive, login, restricted), dialects (Bash, `sh`, zsh, PowerShell, cmd, …), surfaces (builtins, aliases, functions, externals), composition (pipelines, subshells), configuration (profiles/rc), and hosting (SSH, CI, containers, cron) are all subsets of “shell.” Chapter **22** inventories them in extreme depth; this chapter gives the family map so those subsets have somewhere to hang.

---

## If you are brand new

Today you will **type commands** at a prompt and press Enter. That is already using a shell.

Later you will **save** the same commands in a file (a script) and run the file. That is scripting—still the shell, just reused.

Tiny progressive path for this chapter:

1. Type one command → see output.
2. Type two commands in a row → see that order matters.
3. Put those two commands in a file → run the file.
4. Notice that the **dialect name** (Bash vs `sh` vs PowerShell) still matters.

If chapter **00** is available in this track, start there for terminal basics (`pwd`, `ls`, first script). This chapter zooms out to the **family map**.

```bash
# Step 1 — one command (interactive)
pwd

# Step 2 — two commands in a row
pwd
ls

# Step 3 — same idea as a tiny script (save as hello.sh, then run it)
# #!/usr/bin/env bash
# set -eu
# pwd
# ls
```

```powershell
# PowerShell parallel — interactive first
Get-Location
Get-ChildItem
```

You do not need to memorize every dialect today. You need one habit: **name which shell you mean**.

---

## 1. Concepts (basic)

### 1. Shell as a category

A **shell** is a program that reads command lines (interactively or from a script), parses them, expands words, runs **builtins** or **external programs**, and reports exit status. It is the operator’s primary bridge between intent (“list files,” “deploy,” “collect logs”) and the operating system’s process model.

Shells share a job description, not one language:

| Role | What the shell does |
|------|---------------------|
| **Parse** | Split input into commands, pipelines, redirections, and control structures |
| **Expand** | Substitute variables, globs, command substitutions (dialect rules differ) |
| **Execute** | Run builtins in-process or spawn child processes |
| **Compose** | Chain commands with pipelines, lists (`&&` / `||`), and scripts |
| **Report** | Leave an **exit status** (conventionally 0 = success) for the next decision |

When people say “shell script,” they often mean a Bash file on Linux. That shorthand fails on macOS (zsh interactive, Bash 3.2 stock), on Windows (PowerShell / cmd), and in minimal containers (BusyBox `ash`). This track treats **shell** as the category and always names the **dialect**.

### 2. Interactive use vs scripts (same shell, two modes)

| Mode | What you do | Typical home |
|------|-------------|--------------|
| **Interactive** | Type a line, press Enter, read the reply | Your terminal app all day |
| **Script** | Save lines in a file; the shell reads the file | CI jobs, installers, ops runbooks |

```bash
# Interactive: you type this once
echo "hello"

# Script: the shell reads the file and runs the same language
# File: greet.sh
#!/usr/bin/env bash
echo "hello"
```

```bash
# Make runnable and run (Unix)
chmod +x greet.sh
./greet.sh
# Or without execute bit:
bash greet.sh
```

```powershell
# Interactive
Write-Output "hello"

# Script file greet.ps1
# Write-Output "hello"
pwsh -File ./greet.ps1
```

Staff habit: interactive aliases and cute prompts must **not** be required for scripts. CI and teammates run files, not your personal terminal cosmetics.

### 2b. The shell is a set of subsets (preview of chapter 22)

Scripting is the subset beginners hear first. Staff engineers name **all** of these:

| Subset family | Quick examples | Why it bites |
|---------------|----------------|--------------|
| **Invocation mode** | Interactive vs script vs `bash -c` vs login vs `rbash` | “Works in my terminal” ≠ CI |
| **Dialect** | Bash, POSIX `sh`/dash/ash, zsh, ksh, PowerShell, cmd | Grammar and builtins differ |
| **Language surface** | Builtin, alias, function, external, completion | `cd` is not `/bin/cd`; aliases do not travel |
| **Composition** | Pipes, `&&`, subshells `( )`, groups `{ }`, jobs | Side effects and exit status change |
| **Execute vs source** | `./x.sh` vs `. x.sh` / `source` | Child process vs current shell |
| **Configuration** | Profiles, rc files, `set -o`, `shopt` | Dotfiles are not part of the script contract |
| **Hosting** | Local TTY, SSH, container, CI, cron, embedded `system()` | `PATH` and cwd surprise you |
| **Purpose** | Exploration, automation, glue, recon literacy, restricted user shell | Wrong tool for the job |

```text
Shell (bigger set)
├── Modes: interactive | non-interactive | login | restricted | -c | stdin
├── Dialects: Bash | sh/dash/ash | zsh | ksh… | PowerShell | cmd
├── Surfaces: keywords | builtins | aliases | functions | externals | completions
├── Composition: commands | pipes | lists | subshells | jobs | here-docs
├── Config: profiles | rc | options | environment
└── Hosts: terminal | SSH | CI | container | scheduler | embed | WSL/Git Bash
         └── Scripting (saved recipes) lives mainly under non-interactive + files
```

If any row is fuzzy, read chapter **22** before claiming shell fluency. For the **list of commands** you fire (builtins, coreutils, PowerShell, cmd), open chapter **27**.

### 3. Bash: Bourne-Again SHell

**Bash** is the GNU **Bourne-Again SHell**. It implements a large POSIX `sh` surface **and** a rich set of Bash-only extensions: `[[ … ]]`, arrays, associative arrays (Bash 4+), brace expansion, process substitution, and more. On most Linux servers and CI images, `/bin/bash` is Bash 4.x or 5.x and is the default language for Unix automation.

Bash is **first-class** in this handbook: not “vague scripting,” but a real language with versions, compatibility modes, and review norms. Portable `sh` is a deliberate subset; Bash is the everyday dialect for Linux-heavy estates.

```bash
# Identity check — path and version both matter
command -v bash
bash --version | head -n1
```

| Piece | Meaning |
|-------|---------|
| `command -v bash` | Print how this shell finds `bash` (path or function) |
| `bash --version` | Ask that binary who it is |
| `head -n1` | Keep only the first line of version noise |

```bash
# Flag table for the tiny pipeline above
# head -n1
```

| Flag | Letter | Meaning |
|------|--------|---------|
| `-n` | **n** | Number of lines to print |
| `1` | (operand) | Exactly one line |

### 4. POSIX `sh`: the portable baseline

**POSIX Shell Command Language** defines the portable scripting baseline. A script that starts with `#!/bin/sh` (or is run as `sh script.sh`) should stick to that baseline unless you have proven what `/bin/sh` actually is on every target.

On Debian and Ubuntu, `/bin/sh` is often **dash**—a fast POSIX shell that rejects many Bashisms. On Alpine and many containers, **BusyBox `ash`** is the `sh`. On some systems `/bin/sh` is Bash in POSIX mode. The shebang does not guarantee Bash.

```sh
#!/bin/sh
# Portable intent: no arrays, no [[ ]], no process substitution
set -eu
echo "ok"
```

| Piece | Meaning for beginners |
|-------|----------------------|
| `#!/bin/sh` | “Run me with the system’s `sh`” |
| `set -eu` | Exit on error (`-e`); treat unset variables as errors (`-u`) |
| `echo "ok"` | Print a short success message |

If you need Bash features, say so explicitly: `#!/usr/bin/env bash` (or a pinned path) and document the minimum Bash major.

### 5. zsh: macOS interactive default

**zsh** is another Unix shell with its own language extensions, completion system, and interactive features. Since macOS Catalina, **zsh** is the default **login/interactive** shell for new user accounts. That does **not** mean deployment scripts should be written in zsh by default.

| Context | Typical choice |
|---------|----------------|
| Developer interactive terminal on macOS | zsh |
| Shared CI / Linux servers | Bash 5.x or portable `sh` |
| Cross-macOS automation committed to the repo | Prefer Bash (Homebrew or documented pin) or strict `sh`—not “whatever my `.zshrc` does” |

zsh can run many Bourne-like scripts, but startup files, globbing defaults, and arrays differ. Treat interactive comfort and committed automation as separate concerns.

```bash
# On a Mac, these often disagree — that is normal
echo "$SHELL"          # your login/interactive preference
command -v bash
bash --version | head -n1
command -v zsh
zsh --version
```

### 6. PowerShell: a different language

**PowerShell** is not a Bash dialect. It is an object-oriented command shell and scripting language from Microsoft. Pipelines pass **.NET objects** (not only text). Expansion, quoting, error handling, and modules follow different rules.

Two important lines:

| Edition | Typical binary | Where |
|---------|----------------|-------|
| **Windows PowerShell 5.1** | `powershell.exe` | Built into Windows |
| **PowerShell 7.x** | `pwsh` | Cross-platform (Windows, Linux, macOS) |

```powershell
$PSVersionTable.PSVersion
Get-Command pwsh, powershell -ErrorAction SilentlyContinue
```

| Piece | Meaning |
|-------|---------|
| `$PSVersionTable.PSVersion` | Print the edition/version you are in |
| `Get-Command` | Resolve which binary/cmdlet a name points to |
| `-ErrorAction SilentlyContinue` | Named parameter: do not scream if one name is missing |

DevOps work on Windows agents, Azure automation, and cross-platform `pwsh` scripts belongs in this track—not as an afterthought “Windows note.”

### 7. cmd.exe and batch

**cmd.exe** runs **batch** scripts (`.bat` / `.cmd`). It remains common in brownfield Windows installers, scheduled tasks, and legacy ops glue. Syntax (`%VAR%`, `if errorlevel`, `for %%i`) is unrelated to Bash. Prefer PowerShell 7 for new Windows automation; keep cmd literacy for what already ships.

```bat
ECHO hello
WHERE powershell
WHERE pwsh
```

### 8. Bridges: WSL, Git Bash, BusyBox

| Bridge | What you get | Trap |
|--------|--------------|------|
| **WSL** | Real Linux userland + Bash/zsh inside Windows | Mixing Windows and Linux paths; wrong line endings |
| **Git Bash / MSYS** | Bash-like environment on Windows | Not a full Linux distro; some tools differ |
| **BusyBox** | Tiny `ash` + applet suite in containers/IoT | Missing Bashisms and many GNU flags |

These bridges explain why “it worked on my laptop” fails in CI: the shell binary and the userland commands both changed.

```bash
# Inside WSL — Linux view
uname -a
command -v bash
```

```powershell
# From Windows — ask WSL for a Linux identity check
wsl.exe -e bash -lc 'bash --version | head -n1'
```

### 9. Why DevOps (and whole engineering) cares

Shell is the glue language of:

- **CI/CD** steps (`run:` blocks, agents, release hooks)
- **Ops** runbooks, health probes, packaging scripts
- **Security** incident triage, log collection, least-privilege wrappers
- **Application** lifecycle: migrate, seed, smoke-test, rotate secrets
- **Systems** bootstrapping: cloud-init, container entrypoints, image build steps

Misnaming the shell causes real incidents: a Bash array under `#!/bin/sh` on Ubuntu; a Bash 4 associative array on stock macOS Bash 3.2; a PowerShell 7 cmdlet assumed present on Windows PowerShell 5.1. Category literacy is incident prevention.

### 10. Baby-step “which shell am I in?” checklist

Run these once on every machine you use and keep the answers in a lab note:

```bash
# Unix / macOS / WSL / Git Bash
echo "SHELL=$SHELL"
ps -p $$ -o comm= 2>/dev/null || true
command -v bash; bash --version 2>/dev/null | head -n1
command -v sh; sh -c 'echo sh_is_$0'
command -v zsh; zsh --version 2>/dev/null
command -v pwsh; command -v powershell
```

```powershell
# PowerShell
$PSVersionTable
Get-Process -Id $PID | Select-Object ProcessName
```

| Symbol / piece | Beginner meaning |
|----------------|------------------|
| `$SHELL` | Preferred login shell path (may differ from the shell running *this* script) |
| `$$` | Process ID of the current shell |
| `$0` inside `sh -c` | Often shows as `sh`—useful identity hint |
| `$PID` (PowerShell) | Current process id |

---

## 2. Advanced concepts

### 1. Dialect vs userland

The shell language and the **external commands** are separate. Bash on macOS still sees **BSD** `sed`/`find`/`date` unless GNU tools are installed. Bash in Alpine may sit next to BusyBox applets. PowerShell can call `bash` inside WSL or invoke `cmd`. When debugging, ask two questions: *which interpreter?* and *which command implementations?*

```bash
type ls
ls --version 2>/dev/null || ls -@ 2>/dev/null || true
```

If `ls --version` works, you likely have GNU `ls`. If not, you may be on BSD/macOS or BusyBox—flag assumptions change (chapters **14**–**15**).

### 2. Interactive vs non-interactive vs login

Shells load different startup files depending on **login**, **interactive**, and **script** modes. A CI step usually runs **non-interactive** and should not depend on your laptop’s `.bashrc` aliases. Login shells on Linux/macOS may load profile files that mutate `PATH`. Staff reviews reject scripts that only work after a human’s dotfiles load.

| Kind | Loads your cute aliases? | Safe for CI? |
|------|--------------------------|--------------|
| Interactive login | Often yes | No—do not depend on them |
| Interactive non-login | Often partial | No |
| Non-interactive script | Usually no | Yes—this is the target |

### 3. “Bash compatible” is not a contract

Marketing phrases like “Bash compatible” vary. BusyBox ash accepts a subset. zsh can emulate sh/bash modes with caveats. dash rejects Bash arrays and `[[`. Verify with the actual binary and a minimal repro—not with a slogan.

### 4. Family tree (mental model)

```text
POSIX sh  ──► dash / BusyBox ash / Bash (POSIX mode)
                │
                └──► Bash (full) ── extensions, versions 3.2 → 5.x

zsh  (sibling Unix shell; macOS interactive default)

PowerShell 5.1 / 7.x  (separate language; object pipelines)

cmd.exe  (Windows batch; legacy)
```

Bash is the Bourne-family workhorse for Linux automation. POSIX `sh` is the portability floor. zsh is the common macOS interactive host. PowerShell and cmd cover Windows-native work. Bridges connect the worlds without erasing differences.

### 5. Whole-engineering placement

| Discipline | Shell’s role |
|------------|--------------|
| **Application** | Entrypoints, migrations, local task runners |
| **Systems** | Init, provisioning, container `CMD`/`ENTRYPOINT` |
| **Security** | Controlled wrappers; avoid injection via unquoted expansion / unsafe `Invoke-Expression` |
| **Operations** | Runbooks, paging glue, backup/rotate scripts |
| **Software engineering** | Reviewed, tested scripts—not one-off pastebins in the wiki |

Shell skill is not “DevOps-only.” Every engineer who ships on Linux, macOS, or Windows agents hits these interpreters.

### 6. Builtins versus external programs

A shell **builtin** runs inside the shell process (`cd`, `export`, `[` in many shells, Bash `[[`). An **external** program is a separate binary found on `PATH` (`grep`, `curl`, `kubectl`). Scripts fail for two different reasons: wrong dialect (Bashism under `sh`) or missing userland (no `jq` in the image). When you say “the shell can do X,” ask whether X is language syntax or a dependency you must install and pin.

```bash
type cd
type grep
command -v grep
```

```powershell
Get-Command cd, Select-Object, curl |
  Select-Object Name, CommandType, Source
```

On BusyBox, many “commands” are applets linked to one binary—still externals from the script’s point of view, but with a smaller flag set than GNU coreutils.

### 7. What “writing Bash” actually means

First-class Bash literacy includes:

- Knowing when you are on Bash **3.2**, **4.x**, or **5.x**
- Distinguishing POSIX-portable constructs from Bash extensions
- Quoting and expansion order (next foundations chapters)
- Exit status, `set` options, and review habits (later production chapters)

It does **not** mean pasting interactive one-liners into repos, treating zsh as “close enough,” or assuming PowerShell is “Windows Bash.”

Quick dialect smell test:

```bash
# If any of these appear, the file is not portable sh
# [[ ... ]], arrays=(...), $'...', <(...), &>, declare -A
```

### 8. Progressive mini-labs (do these once)

**Lab A — interactive only**

```bash
echo "I typed this"
pwd
```

**Lab B — save and run**

```bash
cat > /tmp/lab-b.sh <<'EOF'
#!/usr/bin/env bash
set -eu
echo "I saved this"
pwd
EOF
chmod +x /tmp/lab-b.sh
/tmp/lab-b.sh
```

| Flag | Letter | Meaning on `chmod` |
|------|--------|--------------------|
| `+x` | **x** | Add execute permission (symbolic form) |

**Lab C — prove `sh` is not always Bash**

```bash
# Deliberately ask for sh
sh -c 'echo "0=$0"'
# On Debian/Ubuntu this is often dash — arrays will fail later under #!/bin/sh
```

**Lab D — PowerShell edition**

```powershell
$PSVersionTable.PSVersion
if ($PSVersionTable.PSEdition) { $PSVersionTable.PSEdition }
```

### 9. Security note at the category level

Shell is powerful because it runs whatever you ask. Beginner safety rules that scale to staff review:

- Do not paste unknown `curl … | bash` (or `irm | iex`) from chat into a privileged shell.
- Prefer reviewed scripts in a repo over “mystery one-liners.”
- Name the interpreter so reviewers know which language threat model applies.

Deeper injection and secrets work lives in later security chapters; the category lesson is: **trust the file and the dialect, not the hype**.

---

## 3. Applications and use cases

### CI and release pipelines

Name the shell in the pipeline config. Linux runners: Bash 5.x or explicit `sh`. macOS runners: do not assume Bash 4+ from `/bin/bash`. Windows runners: choose `pwsh` vs Windows PowerShell 5.1 deliberately. Fail the job if `bash --version` or `$PSVersionTable` drifts from the pin.

```yaml
# Shape only — show the decision, not a vendor tutorial
# jobs:
#   linux:
#     runs-on: ubuntu-latest   # Bash 5.x typical
#   macos:
#     runs-on: macos-latest    # zsh interactive; /bin/bash often 3.2
#   windows:
#     runs-on: windows-latest  # prefer pwsh for new scripts
```

### Container entrypoints

Alpine images often provide BusyBox `sh`, not Bash. Either install Bash and pin it, or write portable `sh`. Document the choice next to the Dockerfile `ENTRYPOINT`.

```dockerfile
# Portable intent
# ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Bash intent — image must contain bash
# ENTRYPOINT ["/usr/bin/env", "bash", "/app/entrypoint.sh"]
```

### Developer laptops vs production

Interactive zsh on a Mac is fine. Committed automation should target the **fleet** shell (usually Bash 5.x on Linux CI, or PowerShell 7 on Windows). OS-context companions for admin depth live under Operating-Systems—for Linux scripting context see [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md); this Languages track stays on dialect depth.

Practical laptop checklist:

1. Record `echo $SHELL`, `bash --version`, `zsh --version`, and `pwsh -NoLogo -Command '$PSVersionTable.PSVersion'`.
2. Run each repo script once with the **same interpreter CI uses**, not only your interactive shell.
3. Keep personal aliases out of automation paths.

### Mixed estates

Enterprises routinely run Bash on Linux VMs, zsh on Mac build machines, PowerShell on Windows jump boxes, and WSL for developers. A “one script” strategy needs an explicit dialect matrix—or separate scripts per OS with a thin dispatcher.

| Fleet slice | Preferred automation dialect |
|-------------|------------------------------|
| Linux VMs / Kubernetes jobs | Bash 5.x or POSIX `sh` |
| macOS build agents | Documented Bash pin or strict `sh` |
| Windows servers | PowerShell 7 (`pwsh`) |
| Legacy Windows tasks | cmd/batch until retired |
| Minimal containers | BusyBox/`dash`-safe `sh` |

### Application and systems engineering

- **Application:** migration and smoke scripts are part of the release artifact—version them with the app.
- **Systems:** cloud-init, image bake scripts, and node bootstrap almost always start with a shell choice; wrong `/bin/sh` assumptions break first boot.
- **Operations:** paging runbooks that “only work if you paste into zsh with my plugins” are not runbooks.

### Security and compliance

Shell is a high-churn attack surface: unquoted expansions, world-writable script paths, secrets in process environments, and copy-pasted `curl | sh` installers. Naming the interpreter is step one of threat modeling the glue layer.

Control ideas that follow from dialect clarity:

- Deny unknown interpreters in CI (`bash`/`pwsh` allowlists).
- Require ShellCheck (and PSScriptAnalyzer for PowerShell) before merge.
- Treat `curl | sh` installers as supply-chain events—pin checksums or vendor packages instead.

### Decode this line (practice)

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "dialect-aware glue"
```

| Piece | Meaning |
|-------|---------|
| `#!/usr/bin/env bash` | Find `bash` on `PATH` and run this file with it |
| `set -e` | Exit if a command fails |
| `set -u` | Exit if you use an unset variable |
| `set -o pipefail` | Pipeline fails if any stage fails (Bash; not portable `dash`) |
| `echo "…"` | Print a message |

**Answer in one sentence:** this file claims **Bash**, enables strict failure modes, and prints a note—do not rename the shebang to `sh` without removing Bash-only options.

### Staff-level review checklist

- Does every script declare its interpreter (`#!/usr/bin/env bash`, `#!/bin/sh`, `pwsh`, etc.) honestly?
- Are Bash-only features absent from `#!/bin/sh` scripts?
- Is stock macOS Bash 3.2 considered when Bash 4+ syntax appears?
- Is PowerShell edition (5.1 vs 7) stated for Windows automation?
- Do CI jobs pin shell + OS image, not “whatever the runner has”?
- Are interactive aliases/dotfiles forbidden as dependencies for automation?
- Is cmd reserved for legacy paths, with new work preferring PowerShell 7 or Unix shells as appropriate?
- Is the dialect matrix for the team written down (even as a short table in the repo README)?
- Are container images checked for Bash vs BusyBox before entrypoints use Bashisms?
- Can a brand-new teammate tell **shell (category)** from **scripting (saved recipes)** after reading this chapter?
- Can they name at least the subset families in §2b (modes, dialects, surfaces, composition, execute vs source, config, hosts)—and know chapter **22** owns the full inventory?
- Do they know chapter **27** is the Master Command Atlas (commands ≠ only `jq`/`ss`)?

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [GNU Bash home](https://www.gnu.org/software/bash/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [ShellCheck](https://www.shellcheck.net/)
