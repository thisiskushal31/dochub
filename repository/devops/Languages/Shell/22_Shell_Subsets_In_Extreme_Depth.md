# Shell subsets in extreme depth

[← Back to Shell](./README.md)

## What this chapter covers

**Shell** is not one flat skill. It is a **category** with many **subsets**—modes, dialects, language surfaces, composition mechanisms, configuration layers, and hosting contexts. Chapter **01** introduced the family map and the idea that **scripting is one subset**. This chapter inventories **every major subset** you must be able to name, so you never confuse “I use the shell” with “I wrote a portable CI script,” or “I typed in zsh” with “Bash ran this file.”

If a piece of the shell world is missing from your mental model, treat that as a bug. After this chapter you should be able to point at any real-world shell encounter and say: **which subset am I in?**

**One picture (memorize this):**

```text
                         SHELL (the bigger set)
  ┌──────────────────────────┬──────────────────────────┐
  │  Modes of invocation     │  Dialect / language lane │
  │  interactive, login,     │  Bash, POSIX sh, dash,   │
  │  script, -c, restricted… │  zsh, ksh, ash, PS, cmd  │
  ├──────────────────────────┼──────────────────────────┤
  │  Language surfaces       │  Composition mechanisms  │
  │  builtins, aliases,      │  pipes, lists, jobs,     │
  │  functions, externals…   │  subshells, here-docs…   │
  ├──────────────────────────┼──────────────────────────┤
  │  Configuration layers    │  Hosting contexts        │
  │  profiles, options, ENV  │  terminal, SSH, CI,      │
  │                          │  container, cron, embed  │
  └──────────────────────────┴──────────────────────────┘
         Scripting = recipes saved as files (one important subset)
```

---

## If you are brand new

Do not memorize every row today. Learn the **questions**:

1. Am I **typing** or running a **file**?
2. Which **program** is interpreting me (`bash`, `sh`, `zsh`, `pwsh`, `cmd`)?
3. Is this a **login** shell? Does it load my **dotfiles**?
4. Am I using a **builtin**, an **alias**, a **function**, or an **external** program?
5. Is this running on my laptop, in **CI**, in a **container**, or over **SSH**?

```bash
# Five identity checks — run them when confused
echo "shell binary: $0"
echo "$- flags: $-"          # see interactive/restricted letters
echo "login preference: $SHELL"
ps -p $$ -o args=            # what argv started this process (Unix)
type pwd; type ls; type cd   # builtin vs external vs alias
```

---

## 1. Concepts (basic) — the subset map

### 1. Why “subsets” matter more than slogans

Saying “I know shell” without naming a subset is like saying “I know databases” without naming SQL vs Redis. Staff reviews fail when people:

| Vague claim | Missing subset |
|-------------|----------------|
| “It works in my terminal” | Interactive + personal startup files |
| “It’s a shell script” | Dialect + shebang + non-interactive contract |
| “sh is fine” | Which `/bin/sh` (dash vs Bash-as-sh vs BusyBox) |
| “Same as Linux” | macOS BSD userland / PowerShell object pipeline |
| “Just run the command” | Builtin vs external; PATH; alias expansion |

### 2. Master inventory of shell subsets

Use this as a checklist. Later sections deepen each row.

| # | Subset family | Examples | Typical mistake |
|---|---------------|----------|-----------------|
| A | **Invocation mode** | Interactive, non-interactive, login, restricted, `-c`, stdin | Script depends on `.bashrc` aliases |
| B | **Dialect / product** | Bash, POSIX `sh`, dash, ash, zsh, ksh, csh/tcsh, fish*, PowerShell, cmd | Bashism under `#!/bin/sh` |
| C | **Language surface** | Builtin, keyword, alias, function, external, completion widget | Assuming `cd` is `/bin/cd` — full command list in **27**–**31** |
| D | **Composition** | Simple command, pipeline, `&&`/`\|\|`, subshell, group, job, here-doc | Ignoring `pipefail` |
| E | **Execution vs source** | `./script`, `bash script`, `. script` / `source` | Expecting `export` in a child to change parent |
| F | **Configuration** | `/etc/profile`, `~/.bashrc`, `~/.zshrc`, `set -o`, `shopt`, `$ENV` | CI inherits laptop cosmetics |
| G | **Hosting context** | Local TTY, SSH, container entrypoint, CI step, cron/systemd/launchd, embedded `system()` | Cron has tiny `PATH` |
| H | **Purpose lane** | Exploration REPL, automation, glue, recon literacy, user restricted shell | Using interactive job control as “orchestration” |
| I | **Privilege / posture** | User shell, root shell, `rbash`, constrained PATH | Treating rbash as a full security boundary alone |
| J | **Bridge / host OS** | Native Unix, WSL, Git Bash, MSYS, Microsoft Coreutils beside PowerShell | Writing Bash that only exists inside WSL while claiming “Windows native” |

\*fish is an interactive-focused shell; this track does not make it a default automation dialect.

### 3. Subset A — invocation modes (the same binary, different worlds)

One `bash` binary can behave very differently depending on **how it was started**.

| Mode | How you get it | Loads typical personal interactive RC? | Automation-safe default? |
|------|----------------|----------------------------------------|---------------------------|
| **Interactive** | Terminal opens a shell; or `bash -i` | Usually yes (for Bash: `.bashrc` path) | No—human session |
| **Non-interactive** | `bash script.sh`, most CI steps | Usually **no** | **Yes**—target for scripts |
| **Login** | `bash -l`, SSH often, console login | Profile files (`/etc/profile`, `~/.bash_profile` / `.profile` …) | Only if you **intend** profile side effects |
| **Non-login interactive** | Many GUI terminals | Often `.bashrc` only (distro-dependent) | Still not CI |
| **Command string** | `bash -c '…'` | Usually non-interactive rules | Yes if self-contained |
| **Stdin script** | `bash < file` or piped script | Non-interactive | Yes if self-contained |
| **Restricted** | `bash -r`, `rbash` | Startup files still read; then restrictions apply | Special-purpose only |
| **POSIX mode** | `bash --posix`, or Bash as `sh` with posix behavior | Changes language semantics | Use when matching POSIX deliberately |

```bash
# Detect interactive-ish flags in Bash (letter meanings vary by shell)
# Common letters in $- : i=interactive, r=restricted, e=errexit, u=nounset, x=xtrace, …
printf '%s\n' "$-"

# Force non-interactive script semantics even when testing by hand:
bash ./deploy.sh
# Not:   source ./deploy.sh   (unless you mean "run in current shell")
```

**Login vs interactive is a 2×2**, not a single switch:

| | Login | Non-login |
|--|-------|-----------|
| **Interactive** | Console/SSH login shells; may load profile **and** rc | Typical nested terminal tabs; often rc only |
| **Non-interactive** | `bash -l -c '…'` / some cron-with-login hacks | Normal `bash script.sh` / CI |

Staff rule: **never** require login/interactive startup files for production entrypoints.

### 4. Subset B — dialect lanes (languages that all get called “shell”)

| Lane | Role in this handbook | Scripting default? |
|------|----------------------|--------------------|
| **Bash** | First-class Unix automation dialect | Yes (Linux-heavy estates) |
| **POSIX `sh`** | Portability floor / policy `#!/bin/sh` | When contract demands it |
| **dash** | Common Debian/Ubuntu `/bin/sh` | Via `sh`, not as interactive home |
| **BusyBox ash** | Minimal containers/embedded | Via BusyBox `sh` |
| **zsh** | macOS interactive default; powerful interactive features | Prefer Bash/`sh` for committed cross-OS automation unless team standardizes zsh |
| **ksh / mksh** | Still seen on some Unix estates | Literacy; pin if brownfield requires |
| **csh / tcsh** | Historic interactive / some niches | **Not** a modern automation default |
| **fish** | Friendly interactive UX | Not this track’s automation standard |
| **PowerShell** | Windows-native (and cross-platform `pwsh`) automation | Yes on Windows-first estates |
| **cmd.exe** | Legacy Windows batch host | Thin compatibility only |

Dialect is a subset of “shell.” Changing dialect changes **grammar**, **builtins**, **startup files**, and often **which external tools you assume**.

### 5. Subset C — language surfaces (what a “command word” can be)

When you type `foo`, the shell resolves `foo` through layers. Those layers are subsets of shell capability.

| Surface | Runs where? | Survives to child scripts? | Good for automation? |
|---------|-------------|----------------------------|----------------------|
| **Keyword** | Shell grammar (`if`, `for`, `[[` in Bash) | N/A (syntax) | Yes—part of language |
| **Builtin** | Inside the shell process (`cd`, `export`, `read`) | N/A | Yes |
| **Alias** | Text replacement before execution (interactive-heavy) | **No** (not inherited) | **Avoid** in scripts |
| **Function** | Shell function in current shell | Only if defined/sourced in that shell | Yes—inside scripts |
| **External** | Separate executable on `PATH` | Yes (new process) | Yes |
| **Completion** | Interactive tab-completion widgets | No | Interactive only |
| **Reserved / special builtins** | POSIX special rules (e.g. some assignment edge cases) | — | Know for portability |

```bash
type -a ls
type -a cd
type -a pwd
command -v jq
# PowerShell:
# Get-Command ls | Format-List *
```

**Decision matrix (staff):**

| Need | Prefer |
|------|--------|
| Change directory / variables of **this** shell | Builtin / function in-process |
| Reusable logic inside one script | Function |
| Shared logic across many scripts | Sourced library **or** external script with clear contract |
| One-off human shortcut | Alias (interactive only) |
| Portable tooling others install | External on `PATH` with pinned version |

### 6. Subset D — composition mechanisms

| Mechanism | Idea | Chapter depth |
|-----------|------|----------------|
| Simple command | One argv + redirections | 04–06 |
| Pipeline `\|` | Connect stdout→stdin (text on Unix; objects in PowerShell) | 08 |
| Lists `;` `&&` `\|\|` | Sequence / short-circuit | 06 |
| Subshell `( … )` | Child shell; variable changes discarded | This chapter + 07 |
| Group `{ …; }` | Current shell; syntax needs spaces/semicolons | This chapter |
| Background `&` / jobs | Concurrent process; interactive job control | 08 |
| Here-doc / here-string | Feed stdin from script text | 08 |
| Process substitution | `<(…)` Bash/zsh/ksh-ish | 08–09 |
| Coprocess `coproc` | Bidirectional pipe to background command (Bash) | Advanced below |

Composition is still “the shell”—not a separate product—but each mechanism is a subset with different status and side-effect rules.

### 7. Subset E — execute vs source (two ways to “run a file”)

| Action | What happens | Variables/functions affect caller? |
|--------|--------------|-------------------------------------|
| `./script.sh` or `bash script.sh` | New shell process (usually) | **No** |
| `. script.sh` or `source script.sh` | Commands run **in current** shell | **Yes** |
| `bash -c '…'` | Non-interactive child interpreting a string | No (unless you export cleverly—don’t) |
| PowerShell dot-sourcing `. .\script.ps1` | Runs in current scope | **Yes** |
| `pwsh -File script.ps1` | Separate process/session patterns | Typically isolated |

```bash
# demo_export.sh
export DEMO_FROM_SCRIPT=1

# Child execution — parent unchanged after:
bash ./demo_export.sh
echo "${DEMO_FROM_SCRIPT-unset}"   # unset

# Source — parent changed:
# shellcheck source=demo_export.sh
. ./demo_export.sh
echo "${DEMO_FROM_SCRIPT-unset}"   # 1
```

This subset boundary is where beginners permanently confuse “I ran the script” with “I loaded a library.”

### 8. Subset F — configuration layers

| Layer | Examples | Belongs in CI scripts? |
|-------|----------|------------------------|
| System profile | `/etc/profile`, `/etc/bash.bashrc` | No dependency |
| User profile / rc | `~/.bash_profile`, `~/.bashrc`, `~/.zshrc`, `~/.profile` | **No** |
| Shell options | `set -euo pipefail`, `set -o posix`, `shopt -s …` | **Yes**—set inside the script |
| Environment | `PATH`, `LANG`, secrets via vault—not hard-coded | Explicitly pass what you need |
| Completion systems | bash-completion, zsh compsys | Interactive only |
| Prompt themes / plugins | oh-my-zsh, starship, etc. | Interactive only |

```bash
# Script-owned options (good)
set -euo pipefail

# Script that assumes alias ll=… from your laptop (bad)
ll /var/log
```

### 9. Subset G — hosting contexts (same language, different world)

| Host | What is often true |
|------|--------------------|
| Local terminal app | Interactive; full personal rc; human `PATH` |
| SSH session | Often login shell; remote `PATH`/OS; latency |
| Container `ENTRYPOINT`/`CMD` | Minimal image; BusyBox or slim Bash; **no** your dotfiles |
| CI job step | Non-interactive; clean env; pinned image |
| cron / systemd timer / launchd / Scheduled Task | Sparse env; cwd surprises; user identity matters |
| Embedded from Python/Go/Java `system`/`exec` | Inherited env of parent process; quoting hell if stringly |
| WSL | Linux dialect inside Windows host; path translation traps |
| Git Bash / MSYS | Bash-like on Windows with Unix-ish tools—not PowerShell |

Hosting is a subset of “how shell shows up at work.” Language skill without host skill still fails production.

### 10. Scripting as a subset (place it correctly)

**Scripting** = using the shell language via **saved recipes** (files or checked-in strings) intended for **repeatable**, usually **non-interactive** runs.

Scripting is **not**:

- the whole of shell
- interactive aliases
- prompt configuration
- one-off typed recon (though recon tools appear *in* scripts later)

Scripting **does** include: Bash/POSIX/`pwsh`/cmd files, CI run snippets that are effectively scripts, container entrypoint scripts, and sourced libraries used by those scripts.

---

## 2. Advanced concepts — deepen every subset

### 1. Invocation flags that select subsets (Bash literacy)

| Flag / form | Subset effect |
|-------------|---------------|
| `-i` | Force interactive |
| `-l` / `--login` | Login shell startup |
| `-r` / `--restricted` / argv0 `rbash` | Restricted shell |
| `-c 'cmd'` | Run command string |
| `-s` | Read commands from stdin |
| `--posix` | POSIX mode behavior |
| `--norc` / `--noprofile` | Skip rc / profile |
| `-x` / `-v` | xtrace / verbose (debug subset) |
| `-e` / `-u` / `-o pipefail` | Strict mode options (often set in-script) |

```bash
bash --noprofile --norc -c 'echo clean; type ls'
```

PowerShell analogs (different flags): `-NoProfile`, `-File`, `-Command`, `-NonInteractive`.

### 2. Restricted shell (`rbash`) — real subset, limited boundary

**Restricted Bash** is a deliberate subset used to constrain interactive users. Typical restrictions (see Bash manual “Restricted Shell”): no `cd`, cannot change `PATH`/`SHELL`/`ENV`/`BASH_ENV`, no commands with `/` in the name, no output redirection, no `exec` to replace the shell, cannot turn restrictions off, and more.

Important staff truths:

1. Restrictions apply **after** startup files are read—misconfigured profiles can still do damage before lockdown.
2. When `rbash` runs a **shell script**, restrictions are **lifted** for that script’s shell—do not confuse “user is in rbash” with “scripts cannot escape.”
3. Restricted shell is **one control**, not a complete sandbox. Pair with OS permissions, forced commands (SSH), and application allowlists.

```bash
# How restricted mode may appear
# $- contains r   OR   shopt restricted_shell
```

Security engineering uses this literacy for **hardening and IR**—not as a party trick.

### 3. Subshells vs groups vs sourcing (side-effect subsets)

```bash
x=1
( x=2; echo "subshell x=$x" )   # x=2 inside only
echo "parent x=$x"              # still 1

x=1
{ x=2; echo "group x=$x"; }     # x=2 in current shell
echo "parent x=$x"              # 2

# Pipeline stages may run in subshells (implementation historically varied;
# Bash can run the last stage in the current shell depending on version/options).
```

| Construct | Side effects on current shell |
|-----------|-------------------------------|
| `( … )` | Isolated |
| `{ …; }` | Shared |
| `cmd \| while read …` | `while` often in subshell → lost variables |
| `source` / `.` | Shared |

### 4. Aliases vs functions vs scripts (discipline subset)

| | Alias | Function | Script file |
|--|-------|----------|-------------|
| Expansion timing | Early, interactive-friendly | Call-time | New process (usually) |
| Arguments | Awkward / limited | Natural `"$@"` | Natural |
| Nesting / logic | Poor | Good | Good |
| CI | **Ban** as dependency | OK if defined in script | OK |
| Discoverability | Easy to forget | `type` | Path + shebang |

```bash
# Interactive convenience (OK in your rc — not in repos)
# alias ll='ls -la'

# Script-safe equivalent
ll() { ls -la -- "$@"; }   # or just call ls -la explicitly
```

PowerShell: prefer full cmdlet names in scripts; aliases (`%`, `?`, `ls`) are interactive sugar.

### 5. Coprocesses and advanced composition (Bash)

`coproc` starts a background command with pipe FDs you can read/write—useful for long-lived helpers. It is a **Bash** subset, not POSIX, not dash. Most DevOps glue never needs it; prefer explicit tools or a small service when bidirectional protocol appears.

### 6. ksh / csh / fish — literacy subsets (not handbook defaults)

| Shell | Why it still appears | Handbook stance |
|-------|----------------------|-----------------|
| **ksh93 / mksh** | Legacy Unix automation, some appliances | Read when estate requires; do not invent new ksh standards here |
| **csh/tcsh** | Historic academic/interactive | Do not write new production automation in csh |
| **fish** | Excellent interactive UX, non-POSIX syntax | Keep interactive; do not drop fish syntax into Bash CI |

Staff skill: **recognize** these dialects on a host (`echo $0`, `/etc/shells`, `dscl`/`getent`) without adopting them as defaults.

### 7. Completion, readline, and ZLE — interactive-only subsets

| System | Shell | Purpose |
|--------|-------|---------|
| GNU Readline | Bash (typical builds) | Line editing, history search |
| bash-completion | Bash | Tab completion for commands |
| ZLE + compsys | zsh | Editing + rich completion |
| PSReadLine | PowerShell | Editing/predictions |

These subsets make humans fast. They are **not** part of the scripting contract. Never require a completion plugin for automation to succeed.

### 8. Debug and tracing subsets

| Tool | Subset role |
|------|-------------|
| `set -x` / `bash -x` | xtrace of expansions |
| `set -v` | verbose input echo |
| `PS4` | Customize xtrace prefix |
| `trap '…' DEBUG` / `RETURN` | Advanced Bash tracing |
| PowerShell `-Debug` / tracing | Different model |
| ShellCheck | Static subset—catches dialect mistakes before runtime |

Tracing is how you inspect which subset semantics actually fired (alias? function? external?).

### 9. Embedded shell — the dangerous subset

Calling a shell from another language with a **string** (`os.system`, `subprocess` with `shell=True`, `Runtime.exec` of `cmd.exe /c …`) creates a nested shell subset with **injection** risk. Prefer argv arrays without a shell; when a shell is unavoidable, treat input as hostile (chapter **18**).

### 10. Remote shell transport vs local dialect

**SSH** is not a shell dialect. It is a **transport** that often **starts** a login shell on the remote side. Subsets stack: `local pwsh` → `ssh` → `remote bash login` → `remote script`. Failures can be in any layer (keys, forced command, remote `PATH`, remote `/bin/sh`).

### 11. Exists / missing matrix for subset features

| Feature subset | Bash 5 | Bash 3.2 | dash | BusyBox ash | zsh | PowerShell 7 | cmd |
|----------------|--------|----------|------|-------------|-----|--------------|-----|
| Interactive + scripting | Yes | Yes | Thin interactive | Thin | Yes | Yes | Yes (batch) |
| Arrays | Yes | Yes (1D) | No | Limited/No | Yes | Objects/collections | Weak |
| `[[ … ]]` | Yes | Yes | No | No | Yes | Different | N/A |
| Process substitution | Yes | Yes | No | No | Yes | Different | N/A |
| `coproc` | Yes | Yes* | No | No | Different | Jobs/runspaces | N/A |
| Restricted shell | `rbash` | `rbash` | Not the same | Variants vary | Limited analogs | JEA/Constrained endpoints (different model) | Limited |
| Object pipeline | No | No | No | No | No | **Yes** | No |
| Dot-source libraries | `.` / `source` | Yes | `.` | `.` | `source` | `.` | `call` quirks |

\*Prefer verifying on the exact binary for obscure features; pin versions in CI.

### 12. Version gates inside one dialect (subset of Bash itself)

Even “Bash” is versioned subsets: 3.2 (macOS stock), 4.x, 5.x. Associative arrays, `&|`, `mapfile` behaviors, and some `shopt` defaults differ. Chapter **02** and **09** own the gates; here the point is: **version is a subset selector**.

### 13. Account login shell vs session shell (`nologin` / `false`)

Unix accounts store a **login shell** path (classically in `/etc/passwd` or directory services). That field is another subset selector:

| Login shell value | Meaning |
|-------------------|---------|
| `/bin/bash`, `/bin/zsh`, … | Interactive login allowed with that dialect |
| `/usr/sbin/nologin` or `/bin/false` | Account cannot take an interactive login shell (service accounts) |
| Restricted path (`rbash`, custom) | Constrained interactive subset |

```bash
# What the account prefers (may differ from the shell running a script)
getent passwd "$USER" 2>/dev/null || dscl . -read "/Users/$USER" UserShell 2>/dev/null
grep -E '^[a-z]' /etc/shells 2>/dev/null | head
```

`$SHELL` is the **preferred** login shell, not a guarantee that *this* process is that binary. CI scripts should not trust `$SHELL` as “the interpreter of this file.”

### 14. Non-interactive startup hooks (`ENV`, `BASH_ENV`)

Non-interactive shells usually skip `.bashrc`, but Bash may still read **`$BASH_ENV`** (and POSIX `sh` may use **`$ENV`**) when set. That is a footgun subset: a developer exports `BASH_ENV` pointing at a personal file, and suddenly “non-interactive” scripts inherit interactive habits.

Staff rule: unset or ignore `BASH_ENV`/`ENV` in CI images; never require them for production scripts.

### 15. Builtin control surfaces (`enable`, `hash`, `builtin`, `command`)

| Builtin | Subset role |
|---------|-------------|
| `enable -n cd` | Disable a builtin (rare; restricted shells interact with this) |
| `hash` | Remember paths of externals (performance; can confuse after installs) |
| `builtin cd` | Force the builtin, skip functions/aliases |
| `command ls` | Skip functions/aliases; find external/builtin per rules |
| `type` / `whence` / `Get-Command` | Explain which surface will run |

These are how you **inspect and steer** the language-surface subset deliberately.

### 16. Drop-in profiles (`/etc/profile.d`, vendor rc)

Many Linux distros run fragments from `/etc/profile.d/*.sh` during profile load. Containers and golden images sometimes ship PATH mutations there. That is still the **configuration** subset—inventory it when “clean” images behave oddly.

### 17. What is *not* a shell subset (boundaries)

| Thing | Relation to shell |
|-------|-------------------|
| **Terminal emulator** (Terminal.app, Windows Terminal, gnome-terminal) | Draws the TTY; hosts the shell process |
| **tmux / screen** | Multiplexers; still run shells inside panes |
| **sshd** | Remote transport; starts a shell or forced command |
| **coreutils / busybox applets** | Externals the shell *runs*, not the shell language |
| **Your IDE “Run Task”** | Often invokes a shell hosting subset underneath |

Confusing the emulator with the shell produces wrong tickets (“Terminal is broken” when `PATH` in Bash is wrong).

### 18. Shebang and interpreter-selection subset

The `#!/usr/bin/env bash` line selects which dialect binary runs an executable script—another subset gate. `env -S` (where supported) can pass multiple arguments; older Unix and BusyBox differ. Windows associations and PowerShell execution policy are the parallel gates on that OS. Chapter **03** deepens shebangs; here: **shebang chooses a dialect subset before your first line runs**.


### Application 1 — Classify any incident in 60 seconds

When something “works on my machine”:

1. Dialect? (`bash --version`, `$PSVersionTable`, `echo $ZSH_VERSION`)
2. Mode? (interactive? login? CI image?)
3. Surface? (`type` / `Get-Command`)
4. Host? (local / SSH / container / cron)
5. Execute vs source?

Write the five answers in the ticket before changing code.

### Application 2 — Design a team shell standard as subset policy

Example policy (adapt, don’t cargo-cult):

| Concern | Policy subset |
|---------|----------------|
| Interactive Mac laptops | zsh OK |
| Linux CI automation | `#!/usr/bin/env bash` with Bash 5.x pin |
| Portable package scripts | `#!/bin/sh` + ShellCheck against dash |
| Windows automation | PowerShell 7 (`pwsh`) |
| Legacy Windows | Isolated 5.1 folder; no new features |
| Aliases | Interactive rc only |
| Libraries | Explicit `source` from repo paths; no home-directory relies |

### Application 3 — Container entrypoint (hosting subset)

```bash
#!/usr/bin/env bash
# entrypoint.sh — must be self-contained (no interactive rc)
set -euo pipefail
exec /app/bin/server "$@"
```

BusyBox images may only have `sh`. That is a **dialect + userland** subset change—test the real image.

### Application 4 — SSH forced command (restricted purpose subset)

Operators sometimes bind an SSH key to a single command. That is a **hosting/security** subset: the user still “has SSH,” but not an open interactive shell. Pair with OS permissions; do not assume forced command alone is enough.

### Application 5 — Security / IR literacy without an exploit kit

Know these as **subset recognition** tasks:

| Observation | Subset reading |
|-------------|----------------|
| Suspicious `bash -i` / reverse shells in logs | Interactive subset abuse over network |
| `curl … | bash` | Remote script hosted into a shell stdin subset |
| User stuck in `rbash` but scripts elevate freely | Restricted-shell boundary misunderstanding |
| Cron job fails `jq: not found` | Hosting env `PATH` subset |
| “LOLBIN” scripting via trusted Windows binaries | Living-off-the-land is adjacent; chapter **21** contrast—not a how-to |

### Application 6 — Whole-engineering checklist for one change

| Domain | Subset question |
|--------|-----------------|
| App | Does the service entrypoint use execute or source? |
| Systems | Which `/bin/sh` on this distro image? |
| Security | Any `eval` / stringly embedded shell? |
| Ops | Interactive-only assumptions in runbooks? |
| Delivery | CI shell pin matches Dockerfile shell? |

---

## 4. Staff engineer checklist

- [ ] Team can list **invocation modes** (interactive / non-interactive / login / restricted / `-c`) and knows CI is non-interactive.
- [ ] Dialect is named on every automation surface (Bash vs `sh` vs zsh vs `pwsh` vs cmd).
- [ ] Builtin / alias / function / external resolution is understood (`type` / `Get-Command`).
- [ ] Aliases and prompt plugins are forbidden as automation dependencies.
- [ ] Execute vs `source` / dot-source is an explicit design choice for libraries.
- [ ] Subshell vs group side effects are considered for pipelines and loops.
- [ ] Startup files are never load-bearing for containers, cron, or CI.
- [ ] Restricted shell (`rbash`) is understood as a partial control, not a sandbox myth.
- [ ] ksh/csh/fish appearances are handled as literacy/brownfield—not silent new standards.
- [ ] Completion/readline/ZLE/PSReadLine are classified interactive-only.
- [ ] Hosting context (SSH, container, CI, scheduler, embed, WSL/Git Bash) is identified in incident writeups.
- [ ] Embedded shell from other languages is minimized and threat-modeled (chapter **18**).
- [ ] `$SHELL` / account login shell is not confused with the interpreter of the current script.
- [ ] `BASH_ENV` / `ENV` are not load-bearing in CI or production images.
- [ ] Terminal emulator / tmux / sshd are not mislabeled as “the shell dialect.”
- [ ] Shebang (or `pwsh -File` / cmd association) is recognized as the first dialect-subset gate.
- [ ] Version pins select the correct Bash/PowerShell feature subset (chapters **02**, **09**, **12**).
- [ ] Distro `/bin/sh` provider is proven for portable scripts (chapter **20**).
- [ ] Security reviews speak in subset names (“interactive login over SSH”) not “the shell did a thing.”

---

## References

- [GNU Bash manual — Invoking Bash / Interactive shells / Restricted shell](https://www.gnu.org/software/bash/manual/)
- [POSIX shell command language](https://pubs.opengroup.org/onlinepubs/9699919799/)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [PowerShell — about_Pwsh / about_Scopes / about_Profiles](https://learn.microsoft.com/powershell/)
- [Windows Commands (cmd)](https://learn.microsoft.com/windows-server/administration/windows-commands/windows-commands)
- [Debian Policy — `/bin/sh`](https://www.debian.org/doc/debian-policy/)
- [ShellCheck](https://www.shellcheck.net/)

---

[← Back to Shell](./README.md)
