# Whole-engineering wrap and staff checklist

[← Back to Shell](./README.md)

## What this chapter covers

A **competency map** for chapters **00–25** and the **command catalog 27–32**, **role lenses**, guidance on **when not to use shell**, brownfield reading habits, and a **consolidated staff checklist** (this chapter **26**). Use this as sign-off aid after completing the track—not as a substitute for earlier chapters.

**Beginner path starts at 00.** Absolute first-timers open chapter **00** (terminal, shell vs scripting, first commands) before **01**. After **01**, read **22** (shell subsets) so “shell” is never mistaken for only “scripting.” Complete **27–32** (command encyclopedia + terminal/eras/distros) **before** final sign-off here—command fluency across OS eras is not optional. Do not skip **00** because the track “looks advanced.”

---

## 1. Concepts

### 1. Competency map (chapters → outcomes)

| Block | Chapters | You can… |
|-------|----------|----------|
| Doorway | **00** | Open a terminal; tell terminal vs shell vs script apart; run first commands; write a tiny script; avoid paste-and-pray installers |
| Foundations | 01–07 | Separate shell (bigger set) vs scripting (one subset); pin versions; choose shebangs/environments; quote and expand safely; use variables/parameters; control flow and exit status; structure functions/scripts |
| I/O and dialects | 08–11 | Redirect and pipeline correctly; use Bash extensions with version gates; write portable `sh`; operate under zsh/macOS BSD realities |
| Windows scripting | 12–13 | Write PowerShell 7-first automation; maintain cmd/batch only as thin legacy |
| Commands & production | 14–18 | Drive files/processes/text tools cross-OS; harden with `set -euo pipefail`/traps and PS error handling; gate with ShellCheck/PSScriptAnalyzer; threat-model injection and secrets |
| Strategy | 19 | Place Bash vs `pwsh` vs WSL in CI/ops; keep workflows thin |
| Distros & legacy security | 20–21 | Prove `/bin/sh` and userland per Linux distro/image; inventory legacy timelines (Bash eras, macOS Catalina shift, PS 2/5.1/7) and apply security-engineering lenses without turning literacy into an exploit kit |
| Shell anatomy | **22** | Name every major shell **subset**: invocation modes, dialects, builtins/aliases/functions/externals, composition, execute vs source, config layers, hosting contexts, restricted shell, interactive-only features |
| Flag & data specialty | **23–25** | Decode opaque flag clusters letter-by-letter (**23**); shape JSON with `jq` / `ConvertFrom-Json` (**24**); run ops/security recon with `ss`/`netstat`/`lsof`/process tools and PowerShell analogs as literacy—not an exploit kit (**25**) |
| Command catalog | **27–32** | Use Master Command Atlas (**27**); own every Bash builtin (**28**); identity/time/env/disks/system (**29**); archives/checksums/transfer (**30**); PowerShell cmdlet families + cmd builtins (**31**); terminal vs TTY vs shell + basic→advanced ladder + Linux/macOS/Windows/distro **eras** (**32**) |
| Wrap | **26** | Sign a consolidated checklist across language, OS, security, delivery, **and command surface** |

Suggested mastery: **00 → 01 → 22 → 02→11 → 12→13 → 14→18 → 19 → 20→21 → 23→25 → 27→32 → 26**. Revisit **27**/**32** whenever “which command?” or “which era/distro?” is unclear; **22** whenever someone says “the shell” without naming a mode/dialect/host; **02** before pinning images; **04**/**18** before untrusted input; **10**/**20** before `#!/bin/sh` portability claims; **11**/**21** before macOS era assumptions; **16**/**17** before production glue; **15** then **24** when JSON depth is required; **14**/**23**/**25** before claiming process/network recon fluency.

### 2. Role lenses

| Role | Must be solid on | Can defer initially |
|------|------------------|---------------------|
| Absolute beginner | **00**, then 01, **22**, **27**, **32** (atlas + ladder), 02–03 | Production hardening and recon specialty |
| Application / backend | 00, 01, **22**, **27–28**, **32**, 03–07, 14–16, 18, 24, **30** | Deep Windows batch archaeology; full **25** recon |
| DevOps / platform / SRE | 00, 01, **22**, **27–32**, 02–03, 11–21, 23–25 | zsh plugin ecosystems |
| Security / DevSecOps | 00, 01, **22**, **27–28**, **30**, **32**, 04, 16–18, 20–21, **23–25** | Fancy awk golf |
| Windows-focused SE | 00, 01, **22**, **27**, **31–32**, 12–14, 16–19, 21, 23–25 | Deep BusyBox |
| Linux distro / container SE | 00, 01, **22**, **27–30**, **32**, 02, 10, 14–16, 20, 23–25 | Deep macOS TCC policy |
| Staff / tech lead | Full map **00–25** + catalog **27–32** + wrap **26**; ADRs for dialect defaults, subset policy, **command atlas**, **era/distro matrix**, and OS matrix | Memorizing every rare GNU flag by rote (use **27** instead) |

### 3. Whole-engineering domains

1. **Doorway literacy** — terminal vs shell vs script; interactive vs saved recipes (chapter **00**)  
2. **Subset literacy** — modes, dialects, surfaces, composition, config, hosts (chapter **22**; preview in **01**)  
3. **Command surface literacy** — Master Atlas **27**; builtins **28**; userland families **14–15**, **29–30**; Windows **31**; eras/terminal ladder **32**; decode habit **23**  
4. **Dialect literacy** — Bash, POSIX `sh`, zsh notes, PowerShell, cmd  
5. **Version & userland pins** — Bash 3.2 vs 5; PS 2.0 (legacy-only) / 5.1 vs 7; GNU vs BSD vs BusyBox; distro `/bin/sh` provider  
6. **Language mechanics** — words, quoting, expansions, status  
7. **Command depth** — files, processes, text shaping with OS substitutes  
8. **Flag decode habit** — expand opaque clusters letter-by-letter (chapter **23**)  
9. **Structured data in scripts** — `jq` and object pipelines (chapter **24**)  
10. **Ops/security recon literacy** — listening ports, process ownership, LOL contrast without exploit recipes (chapter **25**)  
11. **Robustness** — errexit, pipefail, traps, try/catch  
12. **Quality gates** — ShellCheck, PSScriptAnalyzer, smoke tests  
13. **Security** — injection, secrets, trust, constrained language literacy; legacy script density; LOL dialect contrast; chapters **23–25** for decode/JSON/recon  
14. **Delivery** — CI shells, installers, WSL bridges  
15. **Distro honesty** — Debian dash vs RHEL Bash-as-sh vs Alpine BusyBox (chapter **20**)  
16. **Legacy timelines** — Bourne→Bash eras; macOS pre-Catalina vs Catalina+; estate inventory (chapter **21**)  
17. **OS companionship** — when to read Operating-Systems chapters vs this track

### 4. When not to use shell

Prefer another tool when:

- Business logic exceeds a few hundred lines or needs real data structures  
- You parse untrusted rich input (HTML, complex CSV, protobuf)  
- You need concurrent services, memory safety guarantees, or strong typing at scale  
- The team cannot review shell safely and a maintained language is already standard  
- Windows automation needs deep .NET/ACL models better expressed in PowerShell modules—or the reverse: Linux-native CGO/tools better called from Bash wrappers only  
- You are about to invent a DSL in Bash  

Shell remains appropriate for **glue**, **bootstraps**, and **thin CI**.

### 5. Invariants notebook (staff habit)

Per product, record: supported OS matrix; Bash major; `sh` provider (`dash`?); PowerShell edition; whether Alpine/BusyBox is in scope; CI `shell:` defaults; secret injection path; analyzer pins; WSL/Git Bash/Coreutils policy on Windows.

---

## 2. Advanced concepts

### 1. Brownfield reading path

1. Identify shebang / workflow `shell:` / scheduled-task host  
2. Print versions on an agent (`bash --version`, `$PSVersionTable`)  
3. Scan for `eval`, `iex`, `curl | sh`, unquoted `rm -rf`  
4. Check `set -e` / `pipefail` / `$ErrorActionPreference`  
5. Run ShellCheck / PSScriptAnalyzer; triage Errors first  
6. Classify: launcher vs logic—plan extraction  
7. Add smoke tests before refactors  

### 2. Failure modes spanning chapters

| Symptom | Likely chapters |
|---------|-----------------|
| Works in terminal, fails in CI | 03, 11, 19 |
| Broken on Mac only | 02, 11, 15 (`sed -i`) |
| Pipeline masks errors | 08, 16 |
| Alpine-only breakages | 02, 14, 15, 20, 23 |
| Secret in logs/`ps` | 18, 21, 24, 25 |
| Windows path/`PATH` chaos | 12, 14, 19 |
| “POSIX” script with Bashisms | 09, 10, 20 |
| Policy-blocked PowerShell | 12, 18 (CLM) |
| macOS era / wrong rc assumptions | 11, 21 |
| Legacy PS 2.0 / ancient Bash on appliance | 02, 21 |
| Opaque `ss -tulpn` / flag soup | 23, 25 |
| Brittle JSON via `sed` | 15, 24 |
| Beginner lost at prompt | **00**, 01 |

### 3. Myths to reject

- “It’s just a script—skip review.”  
- “Execution Policy makes PowerShell safe.”  
- “Git Bash means we can ignore Windows.”  
- “ShellCheck green means BusyBox-safe.”  
- “`curl | sh` is fine with HTTPS.”  
- “Batch is OK for new production logic.”  

### 4. Dialect default ADR seed

```text
Unix CI and containers: Bash 5 with set -euo pipefail; Alpine paths audited for BusyBox.
macOS: Homebrew Bash 5 or POSIX sh only — never stock 3.2 for Bash 4+ syntax.
Windows: PowerShell 7; cmd launchers only when forced; no new batch logic.
Cross-OS: separate scripts + thin dispatcher; WSL only when Linux userland is required.
Analyzers: ShellCheck + PSScriptAnalyzer required in CI; suppressions owned.
```

### 5. What this track integrates vs defers

**You should leave knowing:** how to choose and pin dialects; write safe Bash/POSIX and PS7 glue; navigate GNU/BSD/BusyBox/Windows command substitutes; harden and analyze scripts; place automation in CI without lying about the OS matrix.

**This track does not replace:** full cloud CLI product manuals; Kubernetes operators courses; deep .NET; comprehensive jq/awk books; or your org secure-coding standard. Official References in each chapter remain authoritative for flags and APIs.

### 6. OS companion map (placeholders)

When you need host-level shell context beyond language depth:

- [`../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md`](../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md)  
- [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md)  
- [`../../Operating-Systems/Unix/9_Shell_And_Scripting.md`](../../Operating-Systems/Unix/9_Shell_And_Scripting.md)  
- [`../../Operating-Systems/MacOS/9_Shell_And_Scripting.md`](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md)  
- [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md)  

### 7. Sign-off narrative

Walk the competency map for the owning role, then tick the consolidated checklist. Gaps become tickets with owners. Cross-OS claims without matrix evidence fail sign-off.

### 8. Annotated mini-incident (reading practice)

```bash
#!/bin/sh
# Brownfield fragment — spot the issues
BRANCH=$1
curl -fsSL https://example.invalid/install.sh | sh
rm -rf $WORK/build
grep -P 'ERROR' logs/*.log | mail -s fail ops@example.invalid
```

| Signal | Chapters | Response |
|--------|----------|----------|
| `#!/bin/sh` + later Bashisms risk | 10 | Confirm `dash` behavior |
| Unquoted `$1` / `$WORK` | 04, 18 | Quote; `${WORK:?}` |
| `curl \| sh` | 18, 19 | Pin+verify or package |
| `grep -P` | 15, 11 | Not portable to macOS stock |
| No `set -e`/`pipefail` | 16 | Strict mode under Bash if Bash required |

### 9. Competency self-score (optional)

Rate 1–5 per block (doorway **00**, foundations, dialects, Windows, production, strategy, distros/legacy, specialty **23–25**). Any block ≤2 blocks staff sign-off for owning that lane until remediated with paired review. Security owners must score **23–25** honestly—not only **18**.

### 10. Relationship to other language tracks

Shell glue often calls Python/Go/Java tools. This track owns the **wrapper contract** (status, quoting, OS matrix). It does not own those languages’ internals—hand off deliberately rather than reimplementing business logic in Bash.

---

## 3. Applications and use cases

Use this section for hiring bars, promotion conversations, and release readiness of shell-heavy surfaces.

### Staff-level review checklist

**Shell subsets (chapter 22)**

- Incidents name mode + dialect + host (not “the shell failed”).
- Scripting is treated as one subset; interactive/login/restricted/config/host subsets are not collapsed into it.
- Aliases/completions/prompt plugins are interactive-only; automation is self-contained.
- Execute vs `source` / dot-source is an explicit library contract.
- `$SHELL` / account login shell is not used as the script interpreter identity.
- `BASH_ENV` / `ENV` are not load-bearing in CI images.
- Restricted shell (`rbash`) is not mistaken for a complete sandbox.
- Terminal emulator / tmux / sshd are not confused with dialect choice.

**Command catalog (chapters 27–32)**

- Engineers can open atlas **27** and find any DevOps shell command by name.
- Builtin vs external vs cmdlet resolution is deliberate (`type` / `Get-Command`) — chapter **28**/**31**.
- Identity/time/env/disk commands are OS-gated where GNU≠BSD (**29**).
- Downloads use fail-modes + checksums; no `curl|sh` / `iex` installers (**30**, **18**).
- PowerShell scripts use full cmdlet names; cmd is thin legacy (**31**).
- Specialty tools (`jq`, `ss`) are not mistaken for the whole command surface.
- Beginners can climb Stage 0→10 on **32**; tickets name emulator vs shell vs command vs OS.
- Estate inventory includes Debian dash, RHEL Bash-as-`sh`, Alpine BusyBox, macOS BSD, Windows PS edition, and legacy net-tools/systemd fallbacks where needed.

**Dialect & pins**

- Shebang / workflow `shell:` matches dialect actually used.
- Bash 3.2 / 5.x and PS 5.1 / 7.x constraints documented for each supported agent.
- PowerShell **2.0** (if found) treated as legacy estate risk—not a supported dialect for new work.
- POSIX `sh` scripts free of Bashisms **or** shebang corrected.
- BusyBox/Alpine in scope ⇒ runtime evidence, not only Ubuntu CI.
- Distro `/bin/sh` provider recorded (dash / Bash-as-sh / BusyBox) for each Linux class claimed (chapter **20**).
- macOS BSD vs GNU flag differences handled for shipped scripts.
- zsh interactive config not load-bearing for automation.
- macOS era noted (pre-Catalina Bash interactive vs Catalina+ zsh) when personal configs or IR matter (chapter **21**).
- Legacy fleet inventory exists: interpreter majors, scheduled-task absolute paths, installer shebangs.

**Language & robustness**

- Quoting correct; `--` / `-LiteralPath` used where needed.
- Bash production scripts use `set -euo pipefail` (or documented exception); `pipefail` not claimed under `dash`.
- Traps/`finally` clean temps and preserve status.
- PowerShell sets `$ErrorActionPreference` intentionally; checks `$LASTEXITCODE` after natives.
- Background processes have wait/kill policy when used.

**Commands & data**

- No `ls`-parsing; portable `find`/`stat`/`sed` strategies (or OS-gated).
- JSON via `jq` / `ConvertFrom-Json`, not brittle `sed`.
- PATH/Coreutils/Git Bash/WSL identity known on Windows agents.
- Destructive paths validated (`${VAR:?}`) before `rm`/`Remove-Item -Recurse`.

**Quality**

- ShellCheck CI gate on shell scripts; disables rare and justified.
- PSScriptAnalyzer on PowerShell trees when present.
- Smoke tests for entrypoints; destructive tests use temps.
- Negative-path coverage for allowlists/required env.

**Security**

- No `eval`/`Invoke-Expression` on untrusted/remote strings.
- No unverified `curl | sh` / `irm | iex` in supported paths.
- Secrets not on argv; not logged; CI masking on.
- Allowlists for env/region-like inputs; path traversal rejected.
- CLM/application-control tested where Windows fleet requires it.
- Execution Policy not treated as a security boundary.
- Webhook/chatops cannot pass free-form shell.
- Engagement / AppSec notes record interpreter version and `/bin/sh` provider per OS class.
- Legacy trees reviewed for unquoted expansion density—not only new PRs.
- Persistence hypotheses consider macOS Bash vs zsh rc by era and Linux `/etc/profile.d`.
- Living-off-the-land dialects present on the estate (Bash/`sh`, PowerShell, cmd) named for logging/controls.

**Delivery & placement**

- CI workflows thin; logic in reviewed scripts.
- Bash vs `pwsh` vs WSL choice matches chapter 19 table.
- OS matrix matches README claims.
- New batch/cmd logic rejected unless hard dependency documented.
- Graduation criteria exist when glue outgrows shell.
- Invariants notebook updated for the product.
- OS companion chapters consulted when host policy (TCC, ACL, systemd) matters.
- Beginner onboarding starts at chapter **00** (not mid-track at 01).
- Flag-decode, jq, and recon specialty (**23–25**) covered for security/ops owners before wrap **26** sign-off.

### Use as a hiring / promotion rubric

- **Read/patch scripts:** chapters **00**–08 in practice.  
- **Own CI/ops glue:** through 14–21 for your OS/distro lane; add **23–25** when flags, JSON, or recon appear.  
- **Staff:** teach dialect/OS/distro tradeoffs, reject injection patterns on sight, and sign this checklist (chapter **26**) without hand-waving. Beginner onboarding always includes **00**; security lanes must cover **23–25**.

Probe separately: **POSIX portability**, **distro `/bin/sh`**, **macOS BSD traps**, and **PowerShell object pipelines**—fluency in one does not imply the others.

Hiring question seeds (behavioral):

1. Show a script you made stricter (`pipefail`, traps)—what broke?  
2. Explain a GNU vs BSD bug you hit in CI.  
3. How do you pass secrets to a CLI without argv exposure?  
4. When did you refuse shell and pick another language?

### Deep-study closeout

1. Lab note: versions on Linux, macOS, and Windows (or WSL) agents you use.  
2. One script rewritten from Bashy to POSIX **or** dual-maintained with justification.  
3. Same diagnostic task in Bash and PowerShell.  
4. ShellCheck (and PSScriptAnalyzer if applicable) green in CI.  
5. Checklist above signed for primary OS **and** one foreign OS.

### Portfolio evidence (optional)

Keep links (internal) to: dialect ADR, CI matrix screenshot/logs, analyzer config, and one security review of an install script. Evidence beats anecdote in promotion packets.

### Quarter-scale upgrade plan (example)

If a brownfield estate scores low on the checklist:

| Quarter | Focus | Exit |
|---------|-------|------|
| Q1 | Analyzer gates + kill `curl\|sh` / `iex` | CI red on new violations |
| Q2 | Strict mode + traps on entrypoints | Smoke on Linux + one foreign OS |
| Q3 | Split Windows to `pwsh`; freeze batch | No new `.cmd` logic |
| Q4 | Matrix honesty + BusyBox/Mac fixes | README claims = jobs |

Do not attempt all four lanes in one “cleanup week.”

### One-page staff card (copyable)

```text
Dialect default: Bash 5 (Unix) / pwsh 7 (Windows) / sh only when claimed
Strict: set -euo pipefail OR PS Stop + LASTEXITCODE
Lint: ShellCheck + PSScriptAnalyzer pinned
Security: no eval/iex; no curl|sh; secrets not on argv
OS truth: GNU ≠ BSD ≠ BusyBox ≠ Git Bash; matrix or silence
Graduate: business logic leaves shell
```

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [GNU coreutils manual](https://www.gnu.org/software/coreutils/manual/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [Microsoft Coreutils for Windows](https://learn.microsoft.com/en-us/windows/core-utils/overview)
- [ShellCheck](https://www.shellcheck.net/)
- [PSScriptAnalyzer](https://learn.microsoft.com/en-us/powershell/utility-modules/psscriptanalyzer/overview)
