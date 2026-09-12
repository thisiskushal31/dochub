# Versions, legacy pins, and compatibility

[← Back to Shell](./README.md)

## What this chapter covers

Which shell **versions** matter for real scripts, how to read **added-in / works-through** constraints, and how to **detect** what is running on Linux, macOS, Windows, WSL, and minimal containers. Default narrative: **Bash 5.x**, POSIX `sh`, **zsh 5.x** (macOS interactive), **PowerShell 7.x**, with brownfield **Bash 3.2** (stock macOS), **dash**/BusyBox as `/bin/sh`, **Windows PowerShell 5.1**, and **cmd**. This is not a museum of every micro-release—only landmarks that change what you may write.

---

## 1. Concepts (basic)

### 1. An era story for absolute beginners (Bourne → Bash → today’s pins)

If you are new to shells, versions feel like trivia. They are not. Think in **eras**—each era still shows up in fleets:

| Era | What operators meant by “the shell” | What you inherit today |
|-----|-------------------------------------|------------------------|
| **Bourne (`sh`)** | Classic Unix scripting language; portable baseline | The *ideas* behind POSIX `sh`; not a modern binary you install by name on every laptop |
| **Bash 2.x–3.x** | “Bourne-Again”: Bash became the everyday Linux scripting dialect | Brownfield appliances, old AMI/golden images, **stock macOS `/bin/bash` = 3.2** |
| **Bash 4.x–5.x** | Associative arrays, richer job control, modern CI default | **Default pin** for new Linux automation |
| **dash / BusyBox as `/bin/sh`** | Distros split “interactive comfort” from “portable `sh`” | `#!/bin/sh` may **reject** Bashisms—see the distro snapshot below and chapter **20** for depth |
| **zsh interactive (macOS Catalina+)** | Human terminal default moved; scripting defaults did not | Interactive ≠ committed dialect (chapter **11**) |
| **PowerShell 5.1 → 7.x** | Windows automation grew up; Core/`pwsh` went cross-platform | Pin **edition**, not “PowerShell” as one word |

**Staff translation:** when someone says “our shell scripts,” ask *which era’s interpreter* still runs them. A script written in the Bash 5 era will fail or misbehave on a Bash 3.2 pin; a “POSIX” script written casually will fail on Debian’s dash. Version literacy is how you refuse unsafe syntax in review and how you choose a **pin** for CI images.

### 2. Why versions break scripts

Shell features arrive in specific releases. A construct that works on Ubuntu’s Bash 5.2 can fail on a Mac’s `/bin/bash` (often **3.2**), on Debian’s `dash` as `/bin/sh`, or on Windows PowerShell **5.1** when you assumed **7.x** cmdlets.

Three labels used in this track:

| Label | Meaning |
|-------|---------|
| **Added in** | Do not use on older interpreters |
| **Works through** | Safe on that line and earlier peers you care about |
| **Do not use after / unsafe after** | Removed, changed, or too risky on newer defaults |

### 3. Bash landmark arc (2 → 5.3)

Bash grew from Bourne compatibility into today’s Linux default. Landmarks that change day-to-day scripting:

| Landmark | Why it matters |
|----------|----------------|
| **Bash 2.x** | Historical Bourne-compat era; rare outside archaeology |
| **Bash 3.0–3.1** | Pre-macOS-pin lineage |
| **Bash 3.2** | Stock macOS `/bin/bash` on many releases—**brownfield pin** |
| **Bash 4.0–4.4** | Associative arrays, `|&`, `**` glob, coprocs, namerefs (later 4.x), richer `mapfile` |
| **Bash 5.0–5.2** | Current Linux/CI narrative band |
| **Bash 5.3** | Newest NEWS line—verify before depending on brand-new builtins/options |

```bash
bash --version | head -n1
# Example shapes: "GNU bash, version 5.2.21(1)-release" or "3.2.57(1)-release"
```

### 4. Bash 3.2 on macOS (the trap)

Apple ships an older Bash under `/bin/bash` for licensing and compatibility reasons. Interactive users often run **zsh**; scripts that call `/bin/bash` still hit **3.2** unless Homebrew (or another prefix) provides Bash 5.x and the shebang points there.

**Missing or unsafe on Bash 3.2** (non-exhaustive; deepen in the Bash extensions chapter):

| Feature | Bash 3.2 | Bash 4+ / 5.x |
|---------|----------|----------------|
| Associative arrays (`declare -A`) | No | Yes (4.0+) |
| `|&` (pipe stderr+stdout) | No | Yes (4.0+) |
| `**` recursive glob | No | Yes (4.0+, needs `globstar`) |
| `${var,,}` / `${var^^}` case mods | No | Yes (4.0+) |
| Namerefs (`declare -n`) | No | Yes (4.3+) |
| `mapfile` / `readarray` | Limited / prefer 4+ habits | Prefer modern Bash |

Policy: treat **Bash 5.x** as the default for new Linux automation; when Macs must run the same file, either require Homebrew Bash or stick to a 3.2-safe subset / POSIX `sh`.

### 5. macOS timeline: pre-Catalina vs Catalina+ (version lens)

macOS shell *defaults* changed even though stock Bash did not “catch up”:

| Period | Interactive default | Stock `/bin/bash` | Scripting implication |
|--------|---------------------|-------------------|------------------------|
| **Pre-Catalina** (before 10.15) | Often **Bash** (login/interactive habits centered on `.bash_profile` / `.bashrc`) | Still **3.2.x** on Apple’s binary | Docs and blogs assumed Bash interactive + Bash scripts; still not Bash 4+ |
| **Catalina+** (10.15 onward) | **zsh** for new accounts | Still **3.2.x** | Humans migrate rc files to zsh; `#!/bin/bash` scripts remain on the old pin unless redirected |
| **Current fleets** | zsh interactive; mixed Homebrew Bash 5 on engineer laptops | `/bin/bash` still 3.2 | CI must name the pin; never infer modern Bash from “Mac user runs Terminal” |

One paragraph to memorize: **before Catalina**, opening Terminal usually meant a Bash session and Bash-centric personal config; **from Catalina onward**, Apple steered interactive users to zsh, but left `/bin/bash` at 3.2 for compatibility. Security and ops still care about that 3.2 binary because shebangs, MDM payloads, and decade-old installers invoke it by path. Depth on migration and `$SHELL` vs shebang lives in chapter **11**; this chapter only pins the version story.

### 6. Distro `/bin/sh` snapshot (what `#!/bin/sh` actually is)

`#!/bin/sh` means “portable shell language,” not “whatever Bash accepts.” Distros disagree on the binary behind that path. Use this **snapshot** in review; chapter **20** covers distro `/bin/sh` depth (packages, policy history, and how to prove portability in CI).

| Distro / base | Typical `/bin/sh` | Bashisms under `sh`? | Operator note |
|---------------|-------------------|----------------------|---------------|
| **Debian / Ubuntu** | **dash** | Most rejected | Fast POSIX; CI “works on my Bash” lies die here |
| **RHEL / CentOS / many Fedora-ish server images** | Often **Bash** linked or used as `sh` (verify!) | May *accept* Bashisms even under `sh` | Passing on RHEL does **not** prove Debian/Alpine portability |
| **Alpine** | **BusyBox** `ash` | Small subset; tiny userland | Container entrypoints break on GNU assumptions and Bash arrays |
| **Minimal / embedded** | BusyBox or vendor ash | Strictly limited | Inventory the exact BusyBox build when claiming support |

```bash
# Always resolve the symlink / provider — do not assume
ls -l /bin/sh
sh -c 'echo interpreter=$0'
# On many Debian systems: dash. On Alpine: busybox. On some RHEL: bash.
```

Staff rule: a green test under “Bash pretending to be `sh`” is weaker evidence than a green test under **real dash** and **real BusyBox**.

### 7. zsh versions

**zsh 5.x** is the practical macOS interactive line. Version skew between laptops is usually less painful than Bash 3.2 vs 5.x for *committed* scripts—because teams should not standardize fleet automation on zsh without an explicit decision. Still record `zsh --version` when debugging interactive-only failures.

### 8. PowerShell editions: 2.0 (legacy-only), 5.1, and 7.x

| Edition | Binary | Scope | Handbook stance |
|---------|--------|--------|-----------------|
| Windows PowerShell **2.0** | Historical `powershell` on ancient Windows | Legacy estates only | **Do not write new automation.** Treat as archaeology / incident scope: weak crypto defaults in era tooling, unsupported OS often underneath, and module assumptions that lie about modern hosts |
| Windows PowerShell **5.1** | `powershell` | Built into supported Windows; Windows-oriented modules | Brownfield pin—document when required; prefer migrating to 7 |
| PowerShell **7.x** | `pwsh` | Cross-platform; preferred for new automation | Default for new Windows and cross-OS glue |

**Why mention 2.0 at all?** Security and ops still discover it on forgotten jump hosts, industrial images, and “never rebuilt” VMs. Finding `$PSVersionTable` major `2` is a **fleet hygiene signal**, not a target dialect. Inventory it, isolate it, plan retirement—do not add features to it.

Differences that bite between **5.1 and 7**: available modules, remoting defaults, some operator/cmdlet behavior, and whether Linux/macOS agents can run the script at all. Pin the edition in CI the same way you pin Bash.

```powershell
$PSVersionTable
# PSVersion, PSEdition (Desktop vs Core), OS, etc.
# Major 2 → escalate as legacy; Major 5 → Windows-only assumptions; Major 7+ → preferred pin
```

### 9. How to detect versions (first kit)

```bash
# Unix-like
bash --version 2>/dev/null | head -n1
zsh --version 2>/dev/null
sh -c 'echo interpreter=$0'
command -v bash; command -v sh; ls -l "$(command -v sh)" 2>/dev/null
```

```powershell
$PSVersionTable
Get-Host
Get-Command pwsh, powershell -ErrorAction SilentlyContinue |
  Select-Object Name, Source, Version
```

```bat
REM cmd
ver
where powershell
where pwsh
```

On WSL, run the Unix kit **inside** the distro; on Git Bash, trust that environment’s Bash build, not Windows PowerShell’s version table.

---

## 2. Advanced concepts

### 1. Added-in / works-through tables (Bash)

Use these as review heuristics (confirm against your pinned minor before relying on edge cases):

| Construct | Added in (approx.) | Works through brownfield? |
|-----------|--------------------|---------------------------|
| `[[ … ]]` | Long-standing Bash | Yes on 3.2+ Bash; **not** POSIX `sh` |
| Arrays `arr=(a b)` | Long-standing Bash | Yes on 3.2; not POSIX `sh` |
| Associative arrays | **4.0** | No on macOS stock 3.2 |
| `|&` | **4.0** | No on 3.2 |
| `**` + `globstar` | **4.0** | No on 3.2 |
| `${var,,}` `${var^^}` | **4.0** | No on 3.2 |
| `declare -n` nameref | **4.3** | No on 3.2 / early 4.x |
| `wait -n` improvements | **5.x** line | Do not assume on 4.x without check |

| Policy target | Minimum interpreter |
|---------------|---------------------|
| Portable Unix script | POSIX `sh` (dash/BusyBox safe) |
| Linux CI default | Bash **5.x** |
| Must run on stock macOS `/bin/bash` | Bash **3.2**-safe subset |
| Cross-OS Windows+Linux | PowerShell **7.x** (`pwsh`) or separate scripts |

### 2. Compatibility modes and `BASH_ENV`

Bash can behave closer to POSIX with options and invocation modes. That helps testing portability but does **not** turn Bash into dash: some extensions still exist, and `/bin/sh` on the target may be a different binary entirely. Prefer running under real `dash` or BusyBox in CI when claiming POSIX portability.

### 3. Feature detection vs version sniffing

Sniffing `BASH_VERSINFO` is useful for clear errors; feature tests are sometimes kinder:

```bash
# Version gate with a clear message
if [ -z "${BASH_VERSINFO:-}" ] || [ "${BASH_VERSINFO[0]}" -lt 4 ]; then
  echo "This script needs Bash 4+ (associative arrays)." >&2
  exit 1
fi
```

```bash
# Soft detect: is this Bash at all?
if [ -n "${BASH_VERSION:-}" ]; then
  echo "running under Bash $BASH_VERSION"
fi
```

PowerShell:

```powershell
if ($PSVersionTable.PSVersion.Major -lt 7) {
  throw "This script requires PowerShell 7+."
}
```

### 4. Image and package pins

CI should pin **OS image** + **shell package**, not only a language version string. “Bash 5” on Alpine vs Debian still differs in userland (`sed`, `grep`, `find`). Version tables for the shell are necessary but not sufficient.

### 5. cmd and batch “versions”

cmd evolves slowly with Windows releases; treat **OS build** and **enabled features** as the pin more than a cmd version string. Prefer migrating new work to PowerShell 7; keep batch for frozen installers.

### 6. What changed in the Bash 4 and 5 eras (operator view)

You do not need every NEWS bullet. You do need the clusters that rewrite scripts:

**Bash 4.x cluster (relative to 3.2):** associative arrays, `|&`, `**` with `globstar`, case-modifying expansions, wider `mapfile`/`readarray` use, namerefs mid-4.x.

**Bash 5.x cluster:** refinements around waiting on jobs, epoch-time helpers, and ongoing builtin polish—safe to treat “Linux CI Bash” as 5.x, but still pin the image minor when you depend on a brand-new flag.

```bash
# Print major.minor for gating
printf '%s.%s\n' "${BASH_VERSINFO[0]}" "${BASH_VERSINFO[1]}"
```

### 7. zsh, dash, and “same script” myths

| Claim | Reality |
|-------|---------|
| “zsh runs my Bash scripts” | Often yes for simple scripts; options and arrays still diverge |
| “`/bin/sh` is Bash” | True on some systems, **false** on Debian/Ubuntu (dash) and Alpine (BusyBox) |
| “PowerShell 7 is a drop-in for 5.1” | Many scripts move; modules and Windows-only assumptions do not |

Prove portability with interpreters, not slogans:

```bash
# If you claim POSIX:
command -v dash >/dev/null && dash -n script.sh
command -v busybox >/dev/null && busybox sh -n script.sh
bash -n script.sh
```

`-n` only parses; still run behavioral tests under the real binary.

### 8. Recording a pin (template)

Keep a one-page “interpreter pin” next to the service:

```text
Unix scripts:  Bash >= 5.1 (CI image X) OR POSIX sh (dash-tested)
macOS note:    Do not use /bin/bash; use brew bash or sh subset
Windows:       PowerShell >= 7.4 (pwsh); 5.1 not supported
Containers:    alpine: entrypoint is ash — no Bashisms
/bin/sh proof: dash + BusyBox CI cells (see chapter 20)
PS legacy:     Major 2 → retire; Major 5.1 → Windows-only documented
```

### 9. Beginner decision tree (which pin do I write for?)

1. **Runs only on our Linux CI image with Bash 5?** → Bash 5.x features OK; still quote; still ShellCheck.  
2. **Must run as `#!/bin/sh` on Debian and Alpine?** → POSIX only; prove under dash **and** BusyBox (chapter **20**).  
3. **Must run on stock Mac `/bin/bash`?** → Bash 3.2-safe subset **or** refuse and require Homebrew Bash.  
4. **Windows + Linux agents, one language?** → PowerShell **7** (`pwsh`)—or two scripts. Never assume 5.1 modules on 7.  
5. **Found PowerShell 2.0 somewhere?** → Incident/hygiene ticket; do not extend that runtime.

### 10. Brownfield discovery script sketch (read-only inventory)

Operators often need a *safe* first pass across jump hosts. Keep it read-only and log to a ticket—not a mutating “fix everything” hammer:

```bash
# Conceptual inventory fragment — run under a known modern Bash on the auditor laptop,
# or adapt per host. Do not paste blindly into production.
printf 'host=%s\n' "$(hostname 2>/dev/null || echo unknown)"
command -v bash >/dev/null && bash --version | head -n1
command -v zsh >/dev/null && zsh --version
ls -l /bin/sh 2>/dev/null || true
sh -c 'echo sh0=$0' 2>/dev/null || true
```

```powershell
# Windows side
$PSVersionTable
Get-Command powershell, pwsh -ErrorAction SilentlyContinue |
  Select-Object Name, Version, Source
```

Feed results into the staff inventory table in §3—not into a wiki claim that “we standardized years ago.”

### 11. Compatibility debt interest

Every undeclared pin accrues interest:

| Debt | How it compounds |
|------|------------------|
| Undocumented Bash 4+ in “portable” scripts | Breaks the first Debian `sh` or Alpine entrypoint |
| Silent reliance on Mac Homebrew PATH | Breaks `launchd`/CI with minimal PATH |
| PS 5.1-only modules in “cross-platform” jobs | Breaks Linux `pwsh` agents overnight |
| Ignoring PS 2.0 / ancient Bash on appliances | Security review scope expands; new features land on unsupported runtimes |

Staff expectation: pay down debt with **matrix cells** and **shebang honesty**, not with more aliases.

---

## 3. Applications and use cases

### Pinning CI runners

Record expected outputs in the job log: `bash --version`, `pwsh -NoLogo -Command '$PSVersionTable.PSVersion'`. Fail closed on drift. macOS jobs that need Bash 4+ should install and invoke that Bash explicitly.

```bash
# CI gate sketch
need_major=5
have=${BASH_VERSINFO[0]:-0}
if [ "$have" -lt "$need_major" ]; then
  echo "Bash $need_major+ required; found ${BASH_VERSION:-not bash}" >&2
  exit 1
fi
```

```powershell
# CI gate sketch
$min = [version]"7.0"
if ($PSVersionTable.PSVersion -lt $min) {
  throw "PowerShell $min+ required; found $($PSVersionTable.PSVersion)"
}
```

### Container baselines

Alpine: expect BusyBox `sh` unless you install bash. Distroless or scratch: often **no** shell—do not assume debugging via `sh` in production images. Document whether the runtime image even contains a shell.

Matrix idea for serious portability claims:

| Job | Interpreter under test |
|-----|------------------------|
| `bash5` | Ubuntu/Debian Bash 5.x |
| `posix` | `dash -n` + run under dash |
| `alpine` | `busybox sh` / Alpine image |
| `mac-legacy` | Bash 3.2 only if you claim support |
| `pwsh7` | PowerShell 7 on Windows or Linux agents |

### Laptop / fleet divergence

Developers on zsh + Homebrew Bash 5 writing scripts that CI runs under Bash 5 is fine. Developers testing only under zsh interactive options is not. Require a CI matrix cell for the brownfield pin you claim to support (for example Bash 3.2 or PowerShell 5.1). OS-level shell defaults are summarized in companions such as [`../../Operating-Systems/MacOS/9_Shell_And_Scripting.md`](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md); version gates for scripts live here.

### Security and compliance

Old shells receive fewer eyeballs in some enterprises; still, **unpatched images** matter more than micro-versions. Prefer current Bash 5.x / PowerShell 7.x on maintained base images. Avoid depending on undocumented quirks of ancient Bash 2.x.

Version pins also reduce “surprise interpreters” after golden-image refreshes—treat a silent Bash major bump like a runtime bump in any other language.

### Library and module compatibility (PowerShell)

Windows PowerShell 5.1 modules do not always load in PowerShell 7. State the edition in module manifests and README pins the same way JVM teams pin JDK majors.

```powershell
# At top of a script that must not run on 5.1
#Requires -Version 7.0
```

### Application rollout discipline

When introducing a Bash 4+ feature into a shared script:

1. Note **added in** Bash major in the file header.
2. Add a CI cell that fails on older Bash if that older Bash is still in scope—or remove the older OS from scope explicitly.
3. Announce the pin change like an API break.

### Staff-level review checklist

- Is the **minimum** Bash/PowerShell/`sh` version written next to the shebang or task definition?
- Are Bash 4+ features banned (or gated) when macOS stock Bash 3.2 is in scope?
- Are `#!/bin/sh` scripts free of Bashisms, with CI proof under dash or BusyBox where claimed?
- Is PowerShell **5.1 vs 7** explicit for every Windows script path?
- Do CI logs print interpreter versions for failing jobs?
- Are “works on my machine” claims mapped to a named pin, not vibes?
- Is BusyBox/Alpine called out for container entrypoints?
- Is there an allowlisted set of base images whose shell versions are known?
- Are `#Requires -Version` / Bash version gates used where silent fallback would be dangerous?
- Has the estate **inventoried** legacy interpreters (see below)—or is “we only run modern Bash” an unverified slogan?

### Staff checklist: inventorying legacy fleets

Use this when onboarding a brownfield org, after a merger, or before claiming a single dialect pin:

| Check | What to record | Fail closed if… |
|-------|----------------|------------------|
| Resolve `/bin/sh` on each Linux class | Path + provider (dash / bash / BusyBox) | Scripts assume Bash under `sh` without proof |
| macOS agents | `sw_vers`, interactive `$SHELL`, `/bin/bash --version`, Homebrew Bash if any | Automation uses Bash 4+ on stock 3.2 |
| Windows agents | `$PSVersionTable` for `powershell` and `pwsh` | Major **2** present without retirement plan; 5.1-only modules undocumented |
| Appliances / golden images | Bash major on AMI, OVA, and vendor shells | Decade-old Bash left as silent default for new scripts |
| CI matrix honesty | Cells for every claimed pin (dash, Alpine, Mac 3.2, PS 5.1) | Only Ubuntu Bash 5 is tested while README claims “portable” |
| Cron / MDM / scheduled tasks | Absolute interpreter path in the unit/plist | Relies on interactive `PATH` or user rc files |
| Installer surface | Shebangs in bootstrap scripts customers run | `curl \| bash` plus unknown host Bash major |

Output of the inventory should be a one-page pin table (section 2.8 template), not a slide saying “we use Bash.”

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [GNU Bash home](https://www.gnu.org/software/bash/)
- [Chet Ramey Bash page](https://tiswww.case.edu/php/chet/bash/bashtop.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Migrating from Windows PowerShell 5.1 to PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [ShellCheck](https://www.shellcheck.net/)
