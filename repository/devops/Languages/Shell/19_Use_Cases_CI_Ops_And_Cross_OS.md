# Use cases: CI, ops glue, and cross-OS automation

[← Back to Shell](./README.md)

## What this chapter covers

Where shell earns its keep in **whole-engineering** work: GitHub Actions (and similar) shell steps, install/bootstrap scripts, ops glue jobs, and the decision of **Bash vs PowerShell vs WSL**. This chapter synthesizes dialects and commands from earlier chapters into placement guidance—not a full CI product manual.

---

## 1. Concepts

### 1. Shell as glue, not the product

Shell shines at:

- Orchestrating compiled tools and package managers  
- Thin CI steps and agent bootstraps  
- Idempotent “make the machine ready” scripts  
- Bridging OS boundaries carefully  

Shell is a poor home for large business logic, complex data transforms, or long-lived services (see chapter 26).

### 2. Decision table: Bash vs pwsh vs WSL

| Situation | Prefer | Avoid |
|-----------|--------|-------|
| Linux/macOS CI job | Bash 5 / POSIX `sh` as claimed | Copy-pasting Windows-only PowerShell |
| Windows-native services, ACL, registry | PowerShell 7 | Fragile `cmd` growth |
| Reuse of existing Linux scripts on Windows agents | **WSL** *or* port to `pwsh` | Assuming Git Bash ≡ Linux |
| Cross-OS one script | Dual scripts + thin dispatcher; or `pwsh` everywhere if team fluency allows | Pretending Bash runs identically on stock Windows |
| Alpine container entrypoint | BusyBox-aware `sh` | Bashisms without Bash |
| Brownfield Mac agents | Homebrew Bash 5 or strict `sh` | Stock Bash 3.2 + Bash 4+ syntax |
| Enterprise locked Windows | `pwsh` tested under CLM/policy | Download cradles |

### 3. Cross-OS runner map

| Runner | Default shell flavor | Typical userland | Notes |
|--------|---------------------|------------------|-------|
| Linux | `bash` | GNU | Handbook default for Unix automation |
| macOS | `bash`/`zsh` varies by CI | BSD | Pin Bash version; BSD flags |
| Windows | `pwsh` / `powershell` / `cmd` | Win32 + optional Coreutils | Prefer `pwsh` |
| WSL on Windows host | Linux distro Bash | GNU inside distro | Path and performance bridges |
| Container Alpine | `sh` | BusyBox | Test explicitly |

### 4. GitHub Actions shell steps (pattern literacy)

Conceptual shapes (always verify current Actions syntax in official docs when editing workflows):

```yaml
# Linux / macOS style
- name: Build
  shell: bash
  run: |
    set -euo pipefail
    ./scripts/ci/build.sh
```

```yaml
# Windows style
- name: Build
  shell: pwsh
  run: |
    $ErrorActionPreference = 'Stop'
    ./scripts/ci/build.ps1
```

Habits:

- Explicit `shell:` when the default would surprise you  
- `bash` on Windows GitHub runners is often Git Bash—**not** a full Linux userland; prefer `pwsh` or `wsl` for Linux-shaped work  
- Keep logic in versioned scripts; workflows stay thin  

### 5. Install and bootstrap scripts

| Goal | Good shape | Bad shape |
|------|------------|-----------|
| Devcontainer / laptop bootstrap | Idempotent; pinned versions; checksums | `curl \| sh` to floating `latest` |
| Product install | Signed artifacts; clear OS matrix | Hidden `eval` |
| CI image bake | Deterministic Dockerfile/packer | Interactive prompts |

Cross-link dialect chapters: Unix installers → Bash/POSIX; Windows → `pwsh`; Mac → Bash 5 pin (chapter 11).

### 6. Ops glue jobs

Examples: rotate local caches, drain queues via CLI, wrap cloud CLIs, gather diagnostics into a tarball.

Rules:

1. Strict mode / `$ErrorActionPreference = 'Stop'`  
2. Quoting and allowlists (chapter 18)  
3. Timeouts and idempotency  
4. Emit machine-readable summaries for humans and bots  

---

## 2. Advanced concepts

### 1. One repo, three entrypoints

```text
scripts/
  ci/build.sh          # Linux/macOS
  ci/build.ps1         # Windows
  ci/doctor.sh         # interpreter discovery
  lib/common.sh        # shared Bash only where both Unix OSes run
```

Dispatcher sketch:

```bash
#!/usr/bin/env bash
set -euo pipefail
case "$(uname -s)" in
  Linux*|Darwin*) exec bash "$(dirname "$0")/build_unix.sh" "$@" ;;
  *) echo "use build.ps1 on Windows agents" >&2; exit 2 ;;
esac
```

### 2. WSL bridging patterns

```powershell
wsl.exe -e bash -lc './scripts/ci/build.sh'
```

| Concern | Habit |
|---------|-------|
| Which distro? | Pin `-d` when multiple installed |
| CRLF | Keep scripts LF |
| `/mnt/c` IO | Heavy builds on Linux filesystem |
| Auth | Separate Linux credentials from Windows vaults intentionally |

### 3. Microsoft Coreutils vs Git Bash vs WSL

Three different “Unix-ish on Windows” stories (chapter 14). CI docs must name **which** one workflows assume. Mixing `find` from Coreutils with Bash from Git and paths from WSL is a support nightmare.

### 4. Version gates in CI

| Pin | Workflow habit |
|-----|----------------|
| Bash 5 | Install or use image that provides it; don’t assume macOS `/bin/bash` |
| PS 7 | `shell: pwsh`; avoid 5.1-only modules in cross-OS jobs |
| Actions runner images | Read changelogs when userland tools move |

### 5. Secrets and CI shells

OIDC to cloud > long-lived keys in `env`. Masking does not excuse `echo $SECRET`. Debug logging (`ACTIONS_STEP_DEBUG` class features) can leak—treat as incident-prone (chapter 18).

### 6. Matrices and false confidence

A green `ubuntu-latest` job does not prove macOS BSD `sed` or Windows `pwsh` paths. Claim only what the matrix runs.

### 7. Packaging shell with apps

Ship scripts with shebags that match **customer** OS policy. Container images: match entrypoint shell to base image (distroless → no shell).

### 8. Orchestrators beyond GHA

Jenkins, GitLab CI, Azure Pipelines, Buildkite—all have “run this shell” steps. The **dialect decision table** is portable; YAML keywords are not. Learn each product’s official “script step” docs when you touch them.

### 9. Timeouts, retries, and partial failure

Shell loops with `sleep` are crude. Prefer orchestrator retries for network flakes; use shell for **local** remediation. `pipefail` and explicit checks avoid green builds with failed mid-pipes (chapter 16).

### 10. Observability of glue

Write status lines to stderr; emit GitHub `NOTICE`/`ERROR` style annotations only via documented workflow commands—do not invent annotation APIs from memory. Prefer attaching artifacts (logs, junit) over giant inline prints.

### 11. When glue becomes a service

If a “script” gains HTTP listeners, multi-day schedules with complex state, or team-specific DSLs, graduate to a maintained language service with tests—and keep shell as a deploy wrapper.

### 12. Compliance evidence

For audited pipelines: pinned script SHAs, analyzer gates (chapter 17), and change review for anything that runs privileged on agents.

### 13. Choosing among Windows Unix-ish options

| Option | Best for | Weak for |
|--------|----------|----------|
| PowerShell 7 | Native Windows automation; cross-OS PS | Expecting GNU userland |
| WSL | Reusing Linux scripts/toolchains | GUI-adjacent Windows admin; extra moving parts |
| Git Bash | Light developer familiarity | Production-grade Linux parity |
| Microsoft Coreutils | Individual GNU-like tools on PATH | Being your full scripting platform |
| cmd | Legacy hooks only | New logic |

Staff rule: **one primary story per pipeline family**, documented in the repo README.

### 14. Example: same CI intent, two shells

```bash
#!/usr/bin/env bash
set -euo pipefail
: "${ARTIFACT_DIR:?}"
mkdir -p -- "$ARTIFACT_DIR"
./build.sh
cp -a dist/. "$ARTIFACT_DIR/"
```

```powershell
$ErrorActionPreference = 'Stop'
if (-not $env:ARTIFACT_DIR) { throw 'ARTIFACT_DIR required' }
New-Item -ItemType Directory -Force -Path $env:ARTIFACT_DIR | Out-Null
./build.ps1
Copy-Item -Path .\dist\* -Destination $env:ARTIFACT_DIR -Recurse -Force
```

Do not merge these into one polyglot file. Duplicate thin wrappers; share policy (pins, analyzers), not syntax.

### 15. Self-hosted runners

Self-hosted agents amplify chapter 18 concerns: leftover workspaces, shared caches, and long-lived credentials. Hygiene jobs should wipe workspaces; prefer ephemeral VMs/containers when the org can afford them. Shell scripts that assume a pristine machine must create that pristine state explicitly.

### 16. Make, task runners, and shell

`make` recipes are still shell. Exporting `SHELL := /bin/bash` and using `.SHELLFLAGS := -euo pipefail -c` (GNU make) is a known pattern—confirm GNU make availability on Mac agents before requiring it. Task runners (various) ultimately call a shell; apply the same quoting rules.

### 17. Feature flags for dialects

When migrating batch → PowerShell or Bash 3.2 → 5, use explicit paths (`scripts/legacy` vs `scripts/ci`) rather than runtime dialect sniffing buried in deep call stacks. Sniffing at the top-level dispatcher is enough.

### 18. Cost and speed

Spinning WSL for every tiny Windows job is slow. Prefer native `pwsh` when the task is Windows-shaped. Prefer Linux runners for Linux-shaped builds instead of “Windows + WSL” as a default.

---

## 3. Applications and use cases

### Platform engineering

Golden CI templates: `shell: bash` + `set -euo pipefail` header; Windows template with `pwsh` + `$ErrorActionPreference = 'Stop'`; doctor script for contributor machines.

Template checklist for new repos:

1. Explicit `shell:` on non-default jobs  
2. Script directory layout (`ci/`, `lib/`)  
3. Analyzer workflow stubs  
4. Documented OS matrix  

### Application teams

Keep app logic out of YAML. Call `make test` / `./gradlew` / `npm test` from thin wrappers. OS-specifics live under `scripts/ci/`.

### SRE / ops

Diagnostic bundles: Bash on Linux nodes; PowerShell on Windows nodes; never require operators to memorize both for the same alert unless the fleet is mixed—and then document both.

Collectors should honor timeouts and write to a known artifact directory for ticket attachment.

### Security engineering

Review install scripts and workflow `run:` blocks as code. Ban floating `curl | sh` in org templates.

### Multi-OS product delivery

Ship matrix:

| Artifact consumer | Automation dialect |
|-------------------|--------------------|
| Linux package | Bash/`sh` |
| Mac pkg/helper | Bash 5-aware or `sh` |
| Windows MSI/companion | `pwsh` |
| Devcontainer | Linux Bash |

### Migration playbooks

**Batch → PowerShell:** keep `.cmd` as `pwsh -File` launcher; move logic; delete when callers update.  
**Git Bash CI → pwsh or WSL:** inventory GNU assumptions; retest.  
**Ubuntu-only scripts → Alpine:** BusyBox audit (chapters 14–15).

### Whole-engineering OS companions

Linux scripting context: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md). Windows automation landscape: [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md). macOS agents: [`../../Operating-Systems/MacOS/9_Shell_And_Scripting.md`](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md).

### Staff-level review checklist

- Workflow `run:` blocks are thin; logic lives in reviewed scripts.
- `shell:` dialect matches script shebang and userland assumptions.
- Windows jobs use `pwsh` unless a documented exception.
- WSL/Git Bash/Coreutils choice is named—not implied.
- Matrix covers every OS claimed in README.
- Bash 3.2 / BusyBox constraints respected where those platforms matter.
- Secrets via short-lived credentials; no trace leakage.
- Install/bootstrap scripts pin versions and verify integrity.
- Analyzer gates from chapter 17 enabled on script paths.
- Exit criteria exist for “graduate this glue out of shell.”
- Self-hosted runner hygiene addressed when applicable.
- Make/task-runner recipes inherit strict shell flags where used.
- Polyglot one-files avoided; dual wrappers preferred.
---

## References

- [GitHub Actions — Workflow syntax / run / shell](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions — Using scripts / runners](https://docs.github.com/en/actions)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [Microsoft Coreutils for Windows](https://learn.microsoft.com/en-us/windows/core-utils/overview)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [ShellCheck](https://www.shellcheck.net/)
