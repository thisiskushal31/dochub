# Legacy timelines and security engineering

[← Back to Shell](./README.md)

## What this chapter covers

How shell **defaults and versions moved** over roughly two decades—and what that means for people who still support brownfield images, mid-migration macOS fleets, and air-gapped scripts—plus a **security engineering / pentest** lens: inventory interpreters, understand Shellshock-class patch posture without CVE tourism, treat Bashisms under `#!/bin/sh` as reliability **and** confusion risk, and know which rc files and PowerShell controls matter by OS era.

If you know nothing yet: read Concepts first as a timeline story; Advanced is for IR, recon, and policy; Applications maps the story onto real estates.

---

## 1. Concepts (if you know nothing → progressive)

### 1. Why timelines matter more than trivia

Scripts outlive the laptop that wrote them. A shebang, a login hook, or a golden AMI can freeze an interpreter from **2012** inside a **2026** pipeline. Version landmarks tell you:

- What syntax was reasonable **then**
- What the OS **defaulted** humans to
- What defenders and attackers still find on disk

This is not a museum of every micro-release. Only pivots that change behavior or security assumptions.

### 2. Bash landmark timeline (2 → 5)

| Landmark | Era signal | Why operators still care |
|----------|------------|--------------------------|
| **Bash 2.x** | Late 1990s–early 2000s appliances / ancient embeds | Archaeology; assume missing modern features; patch status often hopeless—isolate |
| **Bash 3.0–3.1** | Pre-macOS-pin lineage | Rare as a deliberate pin |
| **Bash 3.2** | Stock **macOS `/bin/bash`** for a long span; some old Linux | **Brownfield pin**—no Bash 4+ associative arrays, `|&`, etc. |
| **Bash 4.0–4.4** | Typical “modern Linux scripting” arrival | Associative arrays, `globstar`, namerefs (later 4.x), richer scripting |
| **Bash 5.0–5.2** | Current Linux/CI narrative band | Default for **new** Unix automation in this handbook |
| **Bash 5.3** | Newest NEWS line | Verify before depending on brand-new options |

```bash
bash --version | head -n1
# Shapes you will see: 3.2.57… (macOS stock) vs 5.2.x… (Linux CI)
```

Security note (preview): major version alone is not a vulnerability ID. **Unpatched** Bash on internet-facing or multi-user hosts is the operational issue—inventory, then patch or isolate.

### 3. macOS interactive default: pre-Catalina → Catalina+

| Period | Default interactive shell | What did **not** necessarily change |
|--------|---------------------------|-------------------------------------|
| **Pre-Catalina** | **Bash** for new accounts (typical) | Scripts with `#!/bin/bash` still hit whatever `/bin/bash` is |
| **Catalina+** | **zsh** default for new accounts / Terminal | Stock **`/bin/bash` remains Bash 3.2** for compatibility |

Apple documented the zsh default change for users and admins. The operational split:

| Concern | Pre-Catalina habit | Catalina+ habit |
|---------|--------------------|-----------------|
| Human login customization | `~/.bash_profile`, `~/.bashrc` | `~/.zprofile`, `~/.zshrc` (and friends) |
| “Put PATH in profile” | Bash profile stack | zsh profile stack—**migrate or dual-maintain** |
| Automation shebang | Often `/bin/bash` | Still often `/bin/bash` → **still 3.2** unless Homebrew Bash |
| Fleet mid-migration | All Bash interactive | Mix of Bash holdouts and zsh defaults |

```zsh
echo $SHELL
zsh --version
/bin/bash --version | head -n1
```

Staff rule: fixing someone’s interactive shell to zsh does **not** upgrade script Bash.

### 4. Windows PowerShell timeline (2 / 5.1 → 7)

| Landmark | Binary / edition | Why it matters |
|----------|------------------|----------------|
| **PowerShell 2.0** | Legacy Windows era | Ancient; remove from estates when found; different security story |
| **Windows PowerShell 5.1** | `powershell.exe` — ships with Windows | Still everywhere; Windows-oriented modules; **Desktop** edition |
| **PowerShell 7.x** | `pwsh` — cross-platform | Handbook default for **new** automation; not a silent replace of 5.1 |

```powershell
$PSVersionTable
Get-Command powershell, pwsh -ErrorAction SilentlyContinue
```

Login scripts, GPO hooks, and scheduled tasks may still call `powershell.exe` explicitly years after `pwsh` is installed. Dual presence is normal; dual **untested** presence is an incident waiting.

### 5. What worked then vs now: login scripts

| Era / OS | Common login customization | Failure mode today |
|----------|----------------------------|--------------------|
| Linux Bash login | `/etc/profile`, `~/.bash_profile` → often sources `~/.bashrc` | GUI terminals may be non-login → only `bashrc`; SSH login differs |
| Linux dash `/bin/sh` scripts | Must be POSIX | Old Bashy “profile helpers” copied into `sh` scripts break on Debian |
| macOS Bash era | `.bash_profile` for PATH and managers | After zsh default, PATH “disappears” for new accounts until migrated |
| macOS zsh era | `.zprofile` / `.zshrc` | Engineers copy Bash snippets; subtle option differences |
| Windows classic | Logon scripts `.bat` / `.cmd` | Still fire; encoding and `PATH` quoting landmines |
| Windows PS | Logon PowerShell scripts under 5.1 | Break under `pwsh` if 5.1-only modules assumed |

**Login scripts are not CI.** They load interactive comfort. Production entrypoints (systemd, launchd, scheduled tasks, containers) must not depend on them.

### 6. What worked then vs now: shebangs

| Then (common) | Now (safer habit) |
|---------------|-------------------|
| `#!/bin/sh` meaning “Bash on my RHEL” | `#!/bin/sh` means dash/ash/Bash-by-distro—**test** |
| `#!/bin/bash` on Mac meaning “modern enough” | Means **3.2** on stock macOS |
| No shebang + `source script` in profile | Explicit shebang + non-interactive contract |
| `powershell -File` assumed 5.1 | State **5.1 vs 7** in the task definition |
| `curl \| sh` bootstrap on appliances | Pin, verify on disk, or vendor package—especially on old Bash |

### 7. Progressive security awareness (beginner layer)

Three ideas before Advanced:

1. **Old interpreters on reachable hosts** are patch and isolation problems.  
2. **Wrong dialect under the wrong shebang** causes outages that look like “random CI flakes” and also confuse incident responders.  
3. **Download-and-pipe** installers on legacy appliances combine old crypto/TLS, old Bash, and root—highest caution.

You do not need a CVE encyclopedia to act: inventory → patch/replace image → stop piping untrusted scripts to root shells.

---

## 2. Advanced concepts

### 1. Shellshock-class awareness (without CVE laundry lists)

In 2014 the industry learned—loudly—that **Bash parsing of environment functions** could become remote/local code execution in CGI and similar contexts. The durable engineering lessons:

| Lesson | Practice |
|--------|----------|
| Inventory Bash where it faces untrusted input or shared hosting patterns | `bash --version`; package versions in images |
| Prefer current vendor-supported Bash on maintained bases | Do not run decade-old Bash on internet-facing CGI-like surfaces |
| Understand *your* exposure model | Not every host with Bash is “Shellshock vulnerable today”—but unpatched ancient Bash is a red flag in reviews |
| Official posture | Follow distro/vendor security advisories and Bash project security practices; keep patched |

Point to official Bash / vendor security channels in References—not blog CVE lists in the body. For handbook purposes: **Shellshock-class bugs are why Bash version inventory is a security control**, not only a syntax concern.

### 2. Bashisms under `#!/bin/sh`: reliability and attack-surface confusion

| Effect | Reliability | Security / IR confusion |
|--------|-------------|-------------------------|
| Script works on RHEL `sh`→bash, fails on Debian dash | Outage / failed package scripts | “Tampering?” false positives during change windows |
| Feature detection wrong | Partial runs | Incomplete remediation scripts in IR |
| Copy-paste reverse shells / one-liners assume Bash | Fail on BusyBox ash | Operator thinks host is “broken” |
| Auditors see `sh` and assume POSIX | False compliance story | Real dialect is Bash—unexpected builtins available |

Fix: dialect honesty (`bash` shebang when Bash-required) + CI under dash/BusyBox when `sh` is claimed. ShellCheck helps; runtime matrix proves.

### 3. `curl | sh` on old appliances

Why legacy devices make this worse:

- TLS libraries and CA stores may be outdated.  
- The embedded shell may be BusyBox or ancient Bash.  
- Often runs as root with no second person review.  
- Offline/air-gapped variants become “USB + pipe” with the same trust problem.

Safer pattern (conceptual): download to a file → verify checksum/signature against a **pinned** value from an out-of-band channel → run with an explicit interpreter. Prefer vendor packages when they exist. Chapter 18 deepens injection; here the timeline angle is **old + privileged + pipe**.

### 4. Living-off-the-land: bash / PowerShell / cmd

Attackers and some legitimate admin tools use what is already installed:

| Interpreter | LOTL signal | Defender note |
|-------------|-------------|----------------|
| `bash` / `sh` | Ubiquitous on Linux/macOS agents | Watch unusual `-c` from web apps, CI, backups |
| `powershell` / `pwsh` | Windows automation native | Encoded commands, download cradles—EDR territory |
| `cmd.exe` | Still present | Older GPO and installer chains |

Recon that identifies **which** interpreters exist (and versions) scopes both offense assumptions and defense detections. Absence of `pwsh` does not mean absence of `powershell`.

### 5. IR: which rc / profile files to check by OS era

| OS / era | Interactive / login artifacts to review | Script automation artifacts |
|----------|-------------------------------------------|-----------------------------|
| Linux Bash-centric | `/etc/profile`, `/etc/profile.d/*`, `~/.bash_profile`, `~/.bashrc`, `~/.profile` | cron, systemd units, `/etc/crontab` |
| Debian/Ubuntu with dash `/bin/sh` | Same interactive Bash/zsh files **plus** any `#!/bin/sh` system scripts modified | `dpkg` diversions on `/bin/sh` (rare/manual) |
| macOS Bash default era | `~/.bash_profile`, `~/.bashrc`, `/etc/profile` | `launchd` plists, MDM scripts |
| macOS zsh default era | `~/.zprofile`, `~/.zshrc`, `~/.zshenv`; leftover Bash profiles still loaded by Bash scripts | Same `launchd`/MDM; Homebrew hooks |
| Windows | Logon scripts, Scheduled Tasks, Run keys (broader IR) | `.ps1` under 5.1 vs 7 paths; profiles (`$PROFILE`) |

IR habit: list **effective** files for the **account that ran the payload**, not only the current interactive user. Service accounts often have empty or minimal rc files—and that is good.

### 6. Constrained Language Mode and execution policy literacy

| Control | What it is | What it is **not** |
|---------|------------|--------------------|
| **Execution Policy** | Friction against casual script runs; zone/path rules | A security boundary against a determined user with other tools |
| **Constrained Language Mode (CLM)** | Restricts language elements; used with application control stories | Something you “turn on” casually without testing automation |
| **WDAC / AppLocker** (org-dependent) | Real allowlisting when designed well | Guaranteed by setting ExecutionPolicy alone |

```powershell
$ExecutionContext.SessionState.LanguageMode
Get-ExecutionPolicy -List
```

Staff literacy: do not claim “Execution Policy protects production.” Do claim “CLM + application control change what PowerShell automation may do—test under the same mode as the fleet.”

### 7. Pentest / recon checklist (shell estate)

Run or request (with authorization) on each host class:

| # | Check | Example |
|---|-------|---------|
| 1 | Identify interactive vs available shells | `command -v bash zsh sh pwsh powershell`; `$SHELL` |
| 2 | Resolve `/bin/sh` | `ls -l /bin/sh`; `readlink -f /bin/sh` |
| 3 | Bash version | `bash --version` |
| 4 | BusyBox? | `command -v busybox`; applet banner |
| 5 | PowerShell editions | `$PSVersionTable` under `powershell` and `pwsh` |
| 6 | macOS stock Bash | `/bin/bash --version` vs Homebrew bash |
| 7 | Userland family | `sed --version` / BusyBox behavior |
| 8 | Privileged bootstraps | Search for `curl\|sh`, `irm\|iex` in images and docs |
| 9 | Profile persistence | rc files by era table above |
| 10 | Policy mode (Windows) | LanguageMode + ExecutionPolicy list |

Deliverable: a one-page interpreter pin per host class—not a screenshot dump.

### 8. Air-gapped and OT-ish scripts

| Constraint | Shell implication |
|------------|-------------------|
| No outbound HTTPS | Cannot “curl install”; must vendor wheels/scripts |
| Old BusyBox | POSIX subset; no Bashisms; limited userland |
| Change windows rare | Dual-maintain: tiny `sh` entrypoint + richer offline tooling elsewhere |
| Auditors want reproducibility | Pin interpreter versions in the software bill for the appliance image |

Do not “modernize” OT scripts to Bash 5 syntax without a lab device that matches production BusyBox/ash.

### 9. Mid-migration macOS fleets

Symptoms:

- Half the org has PATH in `.bash_profile`, half in `.zprofile`.  
- CI `macos` runners differ from employee laptops.  
- MDM pushes Bash-era scripts into zsh-default accounts.

Mitigations:

1. Standardize **automation** on Homebrew Bash 5.x or portable `sh`—not interactive default.  
2. Provide a documented profile migration snippet for humans.  
3. Test `launchd` under the service account, not Terminal.app.

### 10. Cross-OS optional: WSL in legacy estates

WSL adds Linux distro shells **inside** Windows. A “Windows host” may still have Ubuntu-dash `/bin/sh` in WSL and Windows PowerShell 5.1 on the Win32 side. Inventory both planes when scoping. Prefer explicit `wsl.exe` contracts over assuming teammates share one universe.

### 11. “What worked then vs now” — compact decision table

| Task | Old default that still appears | Prefer now |
|------|--------------------------------|------------|
| Mac interactive setup | Edit `~/.bash_profile` only | zsh files for humans; separate automation pin |
| Mac script shebang | `#!/bin/bash` casually | Homebrew Bash 5 **or** 3.2-safe / `sh` |
| Linux portable script | Developed under RHEL `sh`→bash | Prove under dash + BusyBox |
| Windows automation | Expand 5.1 scripts forever | `pwsh` 7 for new; freeze 5.1 |
| Bootstrap install | `curl \| sh` as root | Verify-on-disk; packages; signed artifacts |
| IR first shell assumption | “Everyone has bash” | Fingerprint first (recon checklist) |

### 12. Persistence and supply chain in interactive configs

Legacy eras normalized “curl a random rc framework into `.bashrc`/`.zshrc`.” That is an interactive supply-chain risk:

| Signal | Why IR cares |
|--------|--------------|
| Unpinned `source <(curl …)` in rc files | Remote code on every shell start |
| Oh-my-* style plugin managers without pin | Plugin repos become trust roots |
| Duplicate Bash **and** zsh plugin stacks mid-migration | Twice the persistence surface |

Automation servers and CI service accounts should load **no** interactive plugin frameworks. Engineer laptops are in scope for IR sampling precisely because of this culture.

### 13. Encoded PowerShell and “version shopping”

Attackers and some installers select `powershell` vs `pwsh` based on what exists. Defenders should:

- Alert on unusual `-enc` / `-EncodedCommand` usage per org policy.  
- Know which binary scheduled tasks call.  
- Test detections on **both** 5.1 and 7 where both are present.

Version shopping is why the recon checklist records both editions.

### 14. CGI, force-command, and “Bash as a service”

Historical Shellshock-class impact concentrated where Bash evaluated attacker-influenced environment data (classic CGI patterns, some forced-command designs). Modern guidance:

- Do not put untrusted request data into the environment of a Bash child carelessly.  
- Prefer non-shell application runtimes for request handling.  
- If a shell must wrap a gateway, keep Bash patched and minimize env pass-through.

This is architecture, not a CVE bingo card.

### 15. Lab progression (hire → staff)

| Stage | Exercise | Pass criteria |
|-------|----------|---------------|
| 1 | List Bash/zsh/PS versions on your three machines | Written pin table |
| 2 | Run a Bashy script under `dash -x` | Can explain each failure |
| 3 | Migrate one PATH export Bash→zsh profile | New account simulation works |
| 4 | Compare `powershell` vs `pwsh` `$PSVersionTable` | Edition differences named |
| 5 | Find one `curl\|sh` in org docs/images | Ticket or signed exception |
| 6 | Write IR notes for a fake Mac + Linux alert | Era-correct rc file list |

### 16. Mapping to the Linux distros chapter

Dialect lies often come from **distro `/bin/sh`**, not from Bash major alone. Use the distros/userland chapter for dash vs BusyBox vs RHEL false friends; use **this** chapter for era defaults, login migration, and security/IR framing. Together they answer: *what was normal when this was written, and what does the target actually run?*

---

## 3. Applications and use cases

### Supporting 10-year-old images

| Move | Do | Do not |
|------|----|--------|
| Inventory | Record Bash/BusyBox/`sh` on the image | Assume “Linux = Ubuntu CI” |
| Patch | Vendor updates or rebuild from maintained base | Leave ancient Bash on exposed services “because app works” |
| Script changes | Stay within proven dialect; add tests on a clone | Drop Bash 5-only syntax into the image “while you’re there” |
| Compensating controls | Network isolate; wrap with newer jump hosts | Pipe GitHub raw scripts into the appliance |

### Air-gapped OT-ish / industrial glue

Ship a **blessed tarball**: interpreter requirements, scripts, checksums, and a runbook that never requires internet. Validate on hardware twin. Prefer `sh` + BusyBox-safe commands when the PLC-adjacent Linux is minimal.

### macOS fleet mid-migration

Platform team owns:

- Interactive default documentation (zsh)  
- Automation pin (Homebrew Bash or `sh`)  
- Dual-profile deprecation timeline for Bash-era dotfiles  

Security team samples engineer persistence locations on both Bash- and zsh-era accounts during laptop IR.

### Enterprise Windows dual-stack

New modules: PowerShell **7**. Freeze new features on 5.1. Keep a 5.1 compatibility job until GPO/logon scripts are migrated. Teach helpdesk that `powershell` ≠ `pwsh`.

### CI for brownfield claims

If README says “supports Bash 3.2 / dash / PS 5.1,” CI must include those cells. Legacy support without matrix cells is marketing.

### Incident response playbook stub

1. Identify host class and OS era.  
2. Run recon checklist (section 2.7).  
3. Collect rc/profile and scheduled task lists for the **service** identity.  
4. Prefer remediation scripts matching `/bin/sh` reality.  
5. Preserve interpreter binaries/versions in evidence notes.

### Security engineering program controls

| Control | Evidence |
|---------|----------|
| Interpreter inventory | CMDB / image SBOM fields |
| No unsupported `curl\|sh` | CI grep + packaging review |
| Dialect honesty | ShellCheck + dash/BusyBox jobs |
| PS policy literacy | Docs state ExecutionPolicy ≠ boundary; CLM tested where claimed |
| Patch SLAs for shells | Same as other critical runtimes on multi-user hosts |

### Training: progressive path for new hires

1. Concepts timelines (this chapter §1).  
2. Distro `/bin/sh` matrix (Linux distros chapter).  
3. Injection chapter for quoting/`iex`.  
4. Lab: break a Bashy script under dash; migrate a Mac profile to zsh; read `$PSVersionTable` on 5.1 and 7.

### Merger / acquisition shell due diligence

When absorbing another company’s images and laptops:

| Ask | Why |
|-----|-----|
| Default interactive shells by OS vintage | Profile persistence and PATH folklore |
| `/bin/sh` on production AMIs | Packaging and IR script compatibility |
| PowerShell 2 leftovers / 5.1-only modules | Migration cost |
| Appliance bootstrap method | `curl\|sh` debt |
| CI matrix honesty | Whether “portable” was ever tested |

Output a 90-day plan: inventory → isolate worst images → dual-run new pins → decommission.

### Vendor questionnaire (buyers)

Send to SaaS/appliance vendors who ship shell installers:

1. Which interpreter and minimum version does the installer require?  
2. Is BusyBox/`dash` supported, or only Bash 4+?  
3. Do you require `curl|sh`, or provide checksum-verified packages?  
4. On macOS, do you require Homebrew Bash or support stock 3.2?  
5. On Windows, is the automation `pwsh` 7, Windows PowerShell 5.1, or cmd?

Refuse vague “runs on Linux/Mac/Windows” answers.

### Tabletop: legacy CGI + old Bash

Scenario: internet-facing appliance, Bash from a prior decade, shell wrappers around request handling.

Discuss:

- Immediate network containment  
- Interpreter version evidence collection  
- Whether remediation can use BusyBox `sh` if Bash is untrusted  
- Rebuild vs hotfix under change control  

Goal: practice **fingerprint → contain → replace image**, not debate CVE numbers in the war room.

### Documentation debt patterns

| Smell | Rewrite |
|-------|---------|
| “Open Terminal and paste” with Bash arrays on Mac | State interpreter pin; offer Homebrew Bash path |
| “Run as Administrator” PowerShell without edition | Name `powershell` vs `pwsh` |
| Ubuntu-only screenshots for “Linux install” | Add Alpine/RHEL notes or narrow the claim |
| Profile instructions only for `.bashrc` on modern Mac fleet | Add zsh twin |

### Staff-level review checklist

- Bash / `sh` / BusyBox / PowerShell versions inventoried for each support tier.  
- Shellshock-class posture handled via **patch + inventory**, not folklore.  
- No Bashisms under `#!/bin/sh` without dash/BusyBox proof.  
- macOS: Catalina+ zsh default acknowledged; stock Bash 3.2 still assumed for `/bin/bash`.  
- Profile migration (`.bash_*` → `.z*`) documented for human fleets.  
- Windows: 5.1 vs 7 explicit; PS 2.0 retirement tracked if found.  
- Execution Policy not cited as a security boundary; CLM understood where used.  
- `curl|sh` / `irm|iex` banned or exception-signed on appliances.  
- IR runbooks list era-correct rc files and automation hooks.  
- Pentest recon checklist produces a pin table, not anecdotes.  
- 10-year images: isolate/patch plan exists; syntax modernization gated on twins.  
- Air-gapped bundles include checksums and dialect pins.  
- WSL dual-plane inventoried when Windows + Linux scripts coexist.  
- ShellCheck (and PSScriptAnalyzer where relevant) gate shared repos.  
- Login/profile customization never required by production entrypoints.

---

## References

- [Apple Support — Use zsh as the default shell on your Mac (HT208050)](https://support.apple.com/HT208050)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [GNU Bash home](https://www.gnu.org/software/bash/)
- [Chet Ramey Bash page](https://tiswww.case.edu/php/chet/bash/bashtop.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Migrating from Windows PowerShell 5.1 to PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7)
- [PowerShell support lifecycle](https://learn.microsoft.com/en-us/powershell/scripting/install/powershell-support-lifecycle)
- [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [about_Language_Modes](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes)
- [ShellCheck](https://www.shellcheck.net/)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [BusyBox](https://busybox.net/)
