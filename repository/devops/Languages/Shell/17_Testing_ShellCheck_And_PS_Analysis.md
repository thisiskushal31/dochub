# Testing, ShellCheck, and PowerShell analysis

[← Back to Shell](./README.md)

## What this chapter covers

**Static analysis and tests** for shell automation: **ShellCheck** in CI, light literacy for **bats** / **shunit**-style harnesses, and **PSScriptAnalyzer** for PowerShell. Stick to documented tools and flags—do not invent APIs. Pair with robust-script habits (chapter 16) and security review (chapter 18).

---

## 1. Concepts

### 1. Why shell needs gates

Shell fails **quietly** (missing `pipefail`, unquoted expansions) and **loudly in production**. Unlike compiled languages, many bugs are style + quoting + portability. Static analysis catches a large class before merge; runtime tests catch behavior.

| Layer | Bash/POSIX | PowerShell |
|-------|------------|------------|
| Lint / static | ShellCheck | PSScriptAnalyzer |
| Unit / functional | bats, shunit2, plain assert scripts | Pester (common) |
| Smoke | Run script in disposable dir | Run `-WhatIf` / dry-run switches you own |
| Format | shfmt (optional community) | PS formatting tooling as org adopts |

### 2. ShellCheck — first-class gate

ShellCheck analyzes shell scripts for common pitfalls (quoting, `set` usage, useless cats, etc.).

```bash
shellcheck --version
shellcheck -x scripts/*.sh
```

| Habit | Detail |
|-------|--------|
| CI required | Non-zero exit fails the job |
| Dialect | `# shellcheck shell=bash` or `sh` directives when needed |
| External sources | `-x` to follow `source`d files carefully |
| Severity | Prefer fixing; use directed disables sparingly |

```bash
# Narrow disable with justification (example pattern — use real codes from ShellCheck docs)
# shellcheck disable=SC2086  # intentional: …
```

Never blanket-disable at file top without review.

### 3. Cross-OS availability

| Platform | ShellCheck | PSScriptAnalyzer | Notes |
|----------|------------|------------------|-------|
| Linux CI | packages / binary | via PowerShell Gallery | Pin versions |
| macOS | brew / CI image | Gallery | Don’t rely on laptop-only install |
| Windows native | binary / scoop-style installs | native in PS ecosystem | Run in `pwsh` |
| WSL | Linux package | optional | Good for Bash lint on Windows hosts |
| BusyBox images | often **missing** | N/A | Lint in CI side-job, not on Alpine prod image |
| cmd/batch | no ShellCheck | N/A | Prefer migrate; minimal characterization tests |

### 4. bats and shunit — literacy (light)

**bats** (Bash Automated Testing System) and **shunit2** are common unit-style harnesses. Literacy means knowing they exist and how CI invokes them—not memorizing every assertion helper.

Conceptual bats shape (verify current syntax in bats docs when adopting):

```bash
#!/usr/bin/env bats

@test "greets" {
  run ./hello.sh world
  [ "$status" -eq 0 ]
  [ "$output" = "hello world" ]
}
```

shunit2-style tests are shell functions with asserts, loaded via a runner. **Do not invent** assertion names—copy from the project’s official documentation when you add a harness.

Minimum viable testing without a framework:

```bash
#!/usr/bin/env bash
set -euo pipefail
tmp="$(mktemp -d)"
trap 'rm -rf -- "$tmp"' EXIT
./scripts/tool.sh --out "$tmp/out.txt"
grep -F 'expected' "$tmp/out.txt"
```

### 5. PSScriptAnalyzer

```powershell
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser
Invoke-ScriptAnalyzer -Path .\scripts\*.ps1 -Recurse
```

| Habit | Detail |
|-------|--------|
| CI | Fail on severity Error (and Warning when ready) |
| Settings | Checked-in settings file / explicit `-Settings` per official docs |
| 5.1 vs 7 | Analyze with the **edition you ship**; rules can differ by engine |
| Suppressions | Per-line / attribute suppressions as documented—never silent global off |

Pester is the usual PowerShell test framework; adopt with official Pester docs when you need behavioral tests beyond analyzer rules.

### 6. What “good” CI looks like

```text
lint (shellcheck) → lint (psscriptanalyzer if *.ps1) → unit/smoke → (optional) integration on target OS matrix
```

Matrix ideas: `ubuntu` Bash 5, `macos` Bash (Homebrew or stock—**name which**), `windows-latest` `pwsh`. Do not claim portability you do not test.

---

## 2. Advanced concepts

### 1. ShellCheck directives and sourced files

Projects using `source lib.sh` need either:

- `shellcheck -x` with safe include paths, or  
- `# shellcheck source=lib.sh` style directives as documented  

Wrong excludes hide real bugs. Prefer small libraries and explicit paths.

### 2. Dialect mismatches

ShellCheck can warn about Bashisms under `sh`. If shebang says `#!/bin/sh`, fix Bashisms (chapter 10) or change shebang—do not disable the warning casually.

| Claimed dialect | Analyzer expectation |
|-----------------|----------------------|
| `bash` | Bash features OK |
| `sh` | POSIX profile |
| `dash` | Still POSIX-oriented; test under dash |

### 3. Version pinning

```bash
# CI pin example (conceptual)
SHELLCHECK_VERSION=0.10.0
# download verified artifact per ShellCheck project release process
```

Pin PSScriptAnalyzer module version in CI image build or `Install-Module -RequiredVersion`. Drift causes “clean on laptop, red on CI.”

### 4. Exit codes and test harnesses

bats/`run` capture status separately from `set -e` behavior—read harness docs. For homemade tests, keep `set -euo pipefail` and make negative tests expect non-zero with explicit handling:

```bash
if ./tool.sh --bad; then
  echo "expected failure" >&2
  exit 1
fi
```

### 5. Testing destructive scripts

Always run under temp dirs; inject roots via env/flags; refuse default production paths in test mode. PowerShell: prefer parameters with validation over editing globals.

### 6. What not to invent

- Do not invent ShellCheck rule IDs  
- Do not invent PSScriptAnalyzer rule names—enumerate via official cmdlets (`Get-ScriptAnalyzerRule`)  
- Do not invent bats `@test` extensions  
- Do not claim “ShellCheck for PowerShell”—use PSScriptAnalyzer  

### 7. Formatting vs analysis

`shfmt` (when used) is orthogonal to ShellCheck. Formatting fights are secondary to correctness gates. Pick one format policy per repo.

### 8. Windows path / CRLF interactions

ShellCheck on scripts with CRLF may behave differently; keep `*.sh` as LF (chapter 03). Analyze `.ps1` with the line-ending policy your agents use.

### 9. BusyBox and “lint green, runtime red”

ShellCheck will not fully model BusyBox applet gaps. Add a **runtime** job on Alpine for scripts that ship there.

### 10. Coverage expectations (staff realism)

Shell rarely has line coverage culture. Prefer:

1. Static gates on all scripts  
2. Smoke tests for entrypoints  
3. Characterization tests for failure modes (`set -e`, missing args)  
4. Deep unit tests only for non-trivial parsers/functions  

### 11. Pre-commit vs CI

Pre-commit ShellCheck is UX; **CI is law**. Do not allow skipping CI analysis with local hooks alone.

### 12. PowerShell `Using` / modules

Analyze modules as shipped (`Import-Module` path). Rules about cmdlet aliases encourage full names—align with chapter 12 guidance.

### 13. Cross-OS CI sketch (conceptual)

```yaml
# Conceptual — verify current product syntax in official docs
jobs:
  shellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@PINNED
      - name: ShellCheck
        run: |
          set -euo pipefail
          shellcheck -x scripts/**/*.sh
  pssa:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@PINNED
      - name: Analyze
        shell: pwsh
        run: |
          $ErrorActionPreference = 'Stop'
          Invoke-ScriptAnalyzer -Path .\scripts -Recurse | Tee-Object -Variable r
          if ($r | Where-Object Severity -eq 'Error') { exit 1 }
  smoke-unix:
    runs-on: ubuntu-latest
    steps:
      - run: bash scripts/ci/smoke.sh
  smoke-windows:
    runs-on: windows-latest
    steps:
      - shell: pwsh
        run: ./scripts/ci/smoke.ps1
```

Pin action SHAs and tool versions per your org standard. The point is **job separation**: lint ≠ OS smoke.

### 14. Testing `set -e` and negative paths

Happy-path-only tests miss the point of chapter 16. Add:

| Case | Assert |
|------|--------|
| Missing required env | non-zero exit; message on stderr |
| Bad args | non-zero; no partial write to prod paths |
| Downstream CLI failure | failure surfaces with `pipefail` |
| Interrupt during work | temp dir removed (`trap`/`finally`) |

```bash
#!/usr/bin/env bash
set -euo pipefail
# negative: must fail
if ENV_NAME=bogus ./scripts/deploy.sh; then
  echo "expected allowlist failure" >&2
  exit 1
fi
```

### 15. bats vs homemade vs Pester (selection)

| Need | Lean toward |
|------|-------------|
| Few Bash entrypoints | Homemade smoke with `mktemp` |
| Growing Bash function library | bats (or shunit2) per official docs |
| PowerShell modules | Pester + PSScriptAnalyzer |
| Mixed repo | Separate jobs; do not force one harness |

Do not port bats idioms into PowerShell or invent hybrid frameworks.

### 16. Golden files and flakiness

Snapshotting entire command traces (`set -x` logs) is brittle across OS. Prefer asserting exit codes, key substrings, and output files. Pin `LC_ALL=C` in tests that compare sort/grep output (chapter 15).

### 17. Containerized lint

Running ShellCheck inside the same Alpine image you ship can catch shebang/`ash` issues earlier—but ShellCheck itself may need a fuller image. Common pattern: lint on `ubuntu-latest`, runtime smoke on `alpine:…`.

### 18. Rule baselines and debt budgets

Brownfield: generate a one-time baseline of open findings, file tickets for Warning-level debt, and forbid new Errors. Track suppression count as a metric; rising disables without fixes is a smell.

---

## 3. Applications and use cases

### Repository bootstrap

1. Add ShellCheck CI step for `scripts/**/*.sh`.  
2. Add PSScriptAnalyzer if PowerShell exists.  
3. Add one smoke test job per supported OS.  
4. Document how to run linters locally in CONTRIBUTING (commands only—no random blogs).

Local quick loop (Unix):

```bash
shellcheck -x scripts/**/*.sh
bash scripts/ci/smoke.sh
```

Local quick loop (Windows):

```powershell
Invoke-ScriptAnalyzer -Path .\scripts -Recurse
pwsh -NoProfile -File .\scripts\ci\smoke.ps1
```

### Monorepo scale

Path-filter jobs so unrelated packages do not pay full matrix cost—but never skip lint on changed shell files. Own a `CODEOWNERS` entry for `scripts/**` so analyzer debt cannot merge silently.

### Regulated / secure pipelines

Keep analyzer versions and rule sets auditable (pinned). Treat suppressions as reviewable debt with owners. Store the settings file next to scripts so auditors see the same rules CI used.

### Migrating brownfield

Enable ShellCheck with a baseline: fix Errors first, then Warnings. Avoid mass `# shellcheck disable` PRs. Pair each disable with a ticket or an inline reason that cites the code.

### Release engineering

Treat installers and `postinstall` scripts as first-class: same ShellCheck/PSSA gates as app code. Block release if smoke fails on any claimed OS.

### Incident follow-up

After a glue-script outage, add a regression smoke that reproduces the failed precondition (missing tool, empty env, non-zero CLI). Static analysis alone rarely catches “tool X not on PATH in prod image.”

### Teaching / onboarding

New hires run `scripts/doctor` + linters before touching CI YAML. Pair chapter 17 with chapter 03 toolchain habits.

### Whole-engineering OS companion

Shell as part of OS operator tooling: [`../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md`](../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md).

### Staff-level review checklist

- ShellCheck runs in CI on all shipped `*.sh` / `*.bash` with non-zero fail.
- Shebang dialect matches ShellCheck profile.
- Disables are scoped, justified, and rare.
- PowerShell trees run PSScriptAnalyzer with pinned module/settings.
- `$LASTEXITCODE` / error-action issues covered by analyzer + review.
- At least smoke tests for public entrypoints; destructive paths use temps.
- Negative-path tests exist for allowlists and required env.
- Alpine/BusyBox runtime job exists if those images are support targets.
- macOS/Windows claims matched by matrix runners.
- No invented linter APIs or rule IDs in docs.
- Pre-commit optional; CI mandatory.
- Analyzer versions pinned and visible in image/SBOM notes.
- bats/shunit/Pester adopted only with official docs—no homemade APIs claimed as upstream.

---

## References

- [ShellCheck](https://www.shellcheck.net/)
- [ShellCheck on GitHub (project / wiki / directives)](https://github.com/koalaman/shellcheck)
- [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/utility-modules/psscriptanalyzer/overview)
- [Invoke-ScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/module/psscriptanalyzer/invoke-scriptanalyzer)
- [Pester documentation](https://pester.dev/docs/quick-start)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
