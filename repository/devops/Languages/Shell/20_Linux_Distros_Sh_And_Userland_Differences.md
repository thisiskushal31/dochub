# Linux distros, `/bin/sh`, and userland differences

[← Back to Shell](./README.md)

## What this chapter covers

Why “Linux” is **not one shell environment**: the **interactive** shell, the **`/bin/sh`** contract, and the **userland** (GNU coreutils vs BusyBox vs distro packaging) are three different axes. A Debian Bookworm host, an Alpine container, and a RHEL UBI image can all say “Linux” while rejecting each other’s scripts. This chapter is the distro matrix and detection kit so DevOps and security engineers stop treating Ubuntu CI as a universal truth.

OS companion for Linux admin context (not a duplicate of this curriculum): [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md).

---

## 1. Concepts

### 1. Three axes people collapse into “the shell”

| Axis | Question it answers | Typical mistake |
|------|---------------------|-----------------|
| **Interactive shell** | What greets humans in a TTY? | Assuming scripts inherit that shell’s features |
| **`/bin/sh`** | What runs `#!/bin/sh` and many system scripts? | Assuming Bash (or “Linux Bash”) |
| **Userland** | What do `sed`, `find`, `date`, `grep`, `awk` actually implement? | Assuming GNU flags everywhere |

A script fails when **any** axis mismatches. Fixing Bash version alone does not fix BusyBox `sed`. Installing Bash on Alpine does not make `find -printf` appear unless you also install GNU findutils (or accept BusyBox limits).

### 2. Interactive vs non-interactive vs system shell

| Mode | Who chooses the interpreter | Config files that matter |
|------|----------------------------|---------------------------|
| Interactive login | Account’s login shell (`chsh`, `/etc/passwd`) | Profile stack (`/etc/profile`, `~/.profile`, Bash/zsh rc files) |
| Interactive non-login | Often the terminal emulator’s default or `$SHELL` | `~/.bashrc` / `~/.zshrc` patterns |
| Script with shebang | The shebang path (or `env`) | Usually **none**—inherited environment only |
| `#!/bin/sh` | Whatever `/bin/sh` resolves to on **that** image | System scripts and “portable” entrypoints |

Staff rule: **never** treat “I opened a terminal and Bash worked” as proof that `#!/bin/sh` is Bash.

### 3. Why `/bin/sh` exists as a separate contract

POSIX defines a **shell command language**. Distributions pick an implementation and point `/bin/sh` at it. That symlink is a **policy** decision:

- Faster, smaller shells for boot and package scripts (dash, BusyBox ash)
- Familiar Bash in POSIX mode on some enterprise lines
- Historical inertia (“it has always been Bash here”)

Debian Policy and packaging culture treat `/bin/sh` as the system shell for scripts that claim portability. If your maintainer scripts or CI jobs use Bashisms under `#!/bin/sh`, you are fighting the distro’s contract—not a random bug.

### 4. GNU userland vs BusyBox (and friends)

| Family | Where you meet it | Character |
|--------|-------------------|-----------|
| **GNU coreutils + GNU findutils + GNU sed** | Debian/Ubuntu, Fedora, RHEL family, SUSE, Arch (typical full installs) | Rich flags, long options, many GNU extensions |
| **BusyBox** | Alpine, many embedded/IoT images, some initramfs, recovery | One multicall binary; **subset** of flags; ash as `sh` |
| **Toybox / other minimal** | Some Android-adjacent and minimal systems | Different subset again—do not assume BusyBox either |

“Linux commands” in blog snippets are usually **GNU** habits. Alpine is Linux and still breaks those habits.

### 5. Distro matrix (landmarks, not every release)

| Distro family | Typical interactive | Typical `/bin/sh` | Userland baseline | Landmark notes |
|---------------|---------------------|-------------------|-------------------|----------------|
| **Debian / Ubuntu** | Bash | **dash** (since Debian **Squeeze**; Ubuntu followed) | GNU | Bookworm+: switching `/bin/sh` to bash via `dpkg-reconfigure dash` is **no longer supported**—treat dash as fixed |
| **RHEL / CentOS / Rocky / Alma** | Bash | Often **Bash** (symlink or equivalent bash-centric `/bin/sh`) | GNU | Bashisms under `sh` may “work” here and **fail** on Debian—false confidence |
| **Fedora** | Bash | Bash-oriented `/bin/sh` in common images | GNU | Bleeding packages; still not Alpine |
| **SUSE / openSUSE** | Bash | Bash-centric in many setups | GNU | Enterprise images still need explicit pins |
| **Alpine** | ash / optional bash | **BusyBox ash** | **BusyBox** | Install `bash` and/or `coreutils` when you need them—do not assume |
| **Amazon Linux** | Bash | Bash-centric lineage (AL2 / AL2023 differ in package world) | GNU-ish | Treat as its own pin; do not equate to Ubuntu runners |
| **Arch** | Bash (user choice common) | Often Bash; **verify** | GNU | Rolling; document what *your* image ships |
| **Gentoo** | User-selected | **Varies** with PROFILE/USE | GNU typical | Highest “verify on host” tax |

Read the matrix as **priors**, not guarantees. Golden images, containers, and chroots override family defaults. Always resolve `/bin/sh` on the target.

### 6. Debian/Ubuntu detail: Squeeze → Bookworm

| Era | `/bin/sh` reality | Operator implication |
|-----|-------------------|----------------------|
| Pre-Squeeze | Bash commonly as `/bin/sh` | Old docs assume Bashisms “are POSIX” |
| Squeeze through Bullseye | **dash** default; `dpkg-reconfigure dash` could select bash | Temporary escape hatch existed |
| **Bookworm+** | dash default; bash-as-`/bin/sh` **unsupported** via that reconfigure path | Escape hatch is gone as a supported story—**fix scripts** or divert at your own risk |

Interactive shells on Ubuntu desktop remain Bash for many users. That comfort hides the dash contract for every `#!/bin/sh` maintainer script and for CI jobs that call `sh script.sh`.

### 7. RHEL-family false friend

On many RHEL-line systems, `/bin/sh` is Bash (often in POSIX mode or close enough that Bashisms sneak through). Scripts written and tested only there pass CI on UBI, then explode on Ubuntu’s dash or Alpine’s ash. The failure mode is **environment-specific success**, the worst kind for shared libraries of shell glue.

### 8. Alpine and “install bash”

```sh
# Alpine sketch — package names can vary by release; verify in docs
apk add --no-cache bash
# Optional when GNU behavior is required:
# apk add --no-cache coreutils findutils grep sed gawk
```

Installing Bash fixes the **language**. It does **not** automatically replace BusyBox applets for `sed`/`date`/`find` unless you install GNU packages and ensure `PATH` prefers them. Be explicit in image Dockerfiles and in script comments.

### 9. If you know nothing: one mental model

1. Ask what **`/bin/sh`** is.  
2. Ask whether commands are **GNU or BusyBox**.  
3. Ask whether the **interactive** shell is irrelevant to the script (usually yes).  
4. Only then talk about Bash **version**.

That order prevents 80% of “but it works on my Linux” arguments.

---

## 2. Advanced concepts

### 1. How commands differ: GNU habits vs BusyBox gaps

| Pattern | GNU (typical full distro) | BusyBox / minimal | Portable habit |
|---------|---------------------------|-------------------|----------------|
| In-place sed | `sed -i` | Often works with limits; behavior/flags differ | Prefer rewrite via temp file, or document GNU sed |
| `find -printf` | Yes | Often **missing** | `-exec` / `stat` carefully; or require GNU findutils |
| `date -d` / `--date` | Yes | Often **missing** or reduced | Epoch math; or require GNU date |
| `grep -P` | Common on GNU | Often **missing** | POSIX BRE/ERE; or require PCRE-capable grep |
| `ls --color=auto` | GNU long opts | May lack long options | Short flags; avoid parsing `ls` |
| `head -n` / `tail -n` | Both usually | Usually | Prefer `-n` form over obsolete syntax |
| `xargs -0` / `find -print0` | Common | Often present but verify | Document null-delimited requirement |
| `readlink -f` | GNU | BusyBox may implement; macOS differs (other chapter) | On Linux, still verify BusyBox |

ShellCheck and “POSIX sh” discipline help the **language**. They do not lint every GNU flag. Userland is a second portability layer.

### 2. Detecting interpreters and userland

```sh
# What is /bin/sh?
ls -l /bin/sh
readlink -f /bin/sh 2>/dev/null || readlink /bin/sh

# Bash present?
command -v bash
bash --version 2>/dev/null | head -n1

# BusyBox fingerprint
command -v busybox
busybox 2>&1 | head -n2
# Many applets report via:
# busybox | head
# or: ls -l "$(command -v sed)" 

# Rough GNU vs BusyBox sed
sed --version 2>&1 | head -n1
# GNU prints "GNU sed"; BusyBox often errors or prints BusyBox banner
```

```sh
# CI smoke: fail closed on wrong sh when you claim POSIX
sh -c 'echo sh=$0'
# Under dash you typically see sh=sh or dash paths depending on invocation
```

Record outputs in image SBOMs and CI logs. Detection without recording is theater.

### 3. Package installs: getting Bash and GNU tools

| Need | Debian/Ubuntu | RHEL family | Alpine | SUSE (sketch) |
|------|---------------|-------------|--------|---------------|
| Bash | usually present; `bash` package | usually present | `apk add bash` | `bash` package |
| GNU coreutils | `coreutils` | `coreutils` | `apk add coreutils` | `coreutils` |
| GNU find/sed | `findutils`, `sed` | same idea | `findutils`, `sed` (GNU) | same idea |
| ShellCheck | distro or upstream pin | same | same | same |

Prefer **documenting required packages** in the image definition over hoping the base AMI is “full.” Distroless/scratch images may have **no** shell—detection returns nothing; that is a feature, not a missing install.

### 4. Shebang strategies on multi-distro estates

| Shebang | Meaning on Linux estates | Risk |
|---------|--------------------------|------|
| `#!/bin/sh` | dash / Bash / BusyBox ash depending on image | Bashisms |
| `#!/bin/bash` | Requires Bash package/path | Missing on minimal Alpine until installed |
| `#!/usr/bin/env bash` | PATH-dependent Bash | Good for flexibility; bad if PATH is hostile |
| Absolute Homebrew paths | Rare on Linux servers | Wrong OS copy-paste |

Policy sketch:

- Shared portable modules: `#!/bin/sh` + dash/BusyBox CI cells.  
- Internal Linux automation that needs Bash: `#!/bin/bash` + image guarantee.  
- Never rely on interactive login shell for cron/systemd `ExecStart`.

### 5. systemd, cron, and “who is sh?”

Unit files and crontab entries often invoke `sh -c '…'` or scripts with `#!/bin/sh`. The service manager’s environment is **not** your interactive Bash with aliases. Test under:

```sh
env -i PATH=/usr/bin:/bin HOME=/tmp /bin/sh ./script.sh
```

That approximates a hostile minimal environment closer to some agents than a developer laptop.

### 6. Multi-stage containers and the “build shell ≠ runtime shell”

Common pattern: build stage is `ubuntu` or `golang` (GNU + Bash); runtime is `alpine` or distroless. Scripts copied into runtime fail even though CI “built fine.” Split contracts:

| Stage | Shell contract |
|-------|----------------|
| Build | May use Bash 5 + GNU freely if discarded |
| Runtime entrypoint | Must match runtime image (`sh`, or installed bash) |
| Debug sidecar | Optional richer shell—never required for prod start |

### 7. Amazon Linux, cloud images, and “close enough”

Amazon Linux is its own pin (AL2 vs AL2023 package ecosystems differ). Cloud vendor images may look RHEL-like or Debian-like without matching `/bin/sh` folklore from either. Treat marketplace AMIs as **unknown until fingerprinted**.

### 8. Arch/Gentoo “varies” is a process, not a shrug

On DIY distros, the handbook answer is process:

1. Fingerprint `/bin/sh` and userland in the golden image.  
2. Pin packages in the image build (not “what I emerged last month”).  
3. Add the same fingerprint step to CI that consumes the image.

“Varies” without a pin table is how rolling systems become un-debuggable.

### 9. Security recon angle (preview)

Attackers and defenders both ask: what can I execute with minimal assumptions? BusyBox ash on an appliance, dash on Debian, Bash on RHEL—each changes which one-liners work. Inventory `/bin/sh` before you claim “standard Bash reverse shell” (or before you write a “standard” remediationscript). Deeper timeline and IR notes live in the legacy/security chapter; here the lesson is **distro truth before payload or patch script**.

### 10. Cross-OS reminder (without leaving Linux depth)

macOS is not in the distro matrix above—BSD userland and Bash 3.2 pins are a different chapter. Windows runners are PowerShell/cmd. The CI implication below is still cross-OS: **Ubuntu GitHub-hosted ≠ Alpine service image ≠ RHEL UBI ≠ macOS ≠ Windows**.

### 11. Common Bashisms that die under dash / ash

| Bashism | Why it fails under `#!/bin/sh` on Debian/Alpine | Portable direction |
|---------|--------------------------------------------------|--------------------|
| `[[ … ]]` | Non-POSIX compound command | `[ ]` / `test` carefully |
| `function name {` | Non-POSIX function keyword form | `name() {` |
| `source file` | Bash/ksh habit | `. file` |
| `echo -e` / `echo -n` | Non-portable | `printf` |
| Arrays (`a=(…)`) | Not in POSIX sh | Multiple vars, files, or require Bash |
| Process substitution `<(…)` | Bash/ksh | Temp files or FIFOs |
| `local` (often accepted in dash, not strictly POSIX) | Portability debates | Document; or avoid in strict POSIX claims |
| `pipefail` / Bash `set` options | Bash-only | Redesign error handling for `sh` |

```sh
# Fail closed sketch when a module must stay POSIX
if command -v shellcheck >/dev/null 2>&1; then
  shellcheck -s sh ./module.sh
fi
# Still run under real dash/ash — ShellCheck is necessary, not sufficient
```

### 12. PATH, alternatives, and “which sed am I calling?”

On Alpine after `apk add coreutils`, you may have **both** BusyBox applets and GNU tools. Order of `PATH`, busybox symlinks, and package triggers decide which binary wins.

```sh
type sed
type find
type date
ls -l "$(command -v sed)"
```

Staff habit: after installing GNU packages on minimal images, assert in CI that `sed --version` reports GNU (or that scripts call explicit paths). Silent mixed userland is worse than pure BusyBox.

### 13. Initramfs, recovery, and “rescue Linux”

Recovery shells and initramfs environments are often BusyBox even when the installed root filesystem is full GNU Debian/RHEL. Break-glass docs that assume `bash` and `systemctl` completion in the initramfs lie. Test recovery procedures in the **actual** rescue environment your installer ships.

### 14. Container `ENTRYPOINT` shells vs Kubernetes probes

Kubernetes `exec` probes and `command:` overrides inherit the container’s filesystem. A probe that runs `bash -c '…'` fails on Alpine without Bash even if the app is healthy. Prefer:

- Probe logic in the application protocol (HTTP/TCP) when possible.  
- Or `/bin/sh -c` with POSIX-only snippets tested on that image.  
- Or a dedicated tiny probe binary.

### 15. Distro release upgrades as silent shell contracts

Major upgrades (Ubuntu LTS → next LTS, RHEL 8 → 9, Debian Bullseye → Bookworm) can change:

- Bash minor/major  
- Whether bash-as-`/bin/sh` was ever supported  
- BusyBox applet versions on Alpine upgrades  
- Whether `/bin` is merged with `/usr/bin` (usrmerge)—path assumptions in ancient scripts

Treat distro upgrades as **runtime upgrades** for shell glue: re-fingerprint `/bin/sh` and re-run the portable matrix before declaring the upgrade done.

### 16. Worked fingerprint card (copy into runbooks)

```text
Host/image: _______________________
Date: _____________________________
ls -l /bin/sh: ____________________
readlink -f /bin/sh: ______________
bash --version: ___________________
busybox present? Y/N ______________
sed --version (first line): _______
find --version (first line): ______
date --version or BusyBox?: _______
Package pins (bash/coreutils): ____
CI cells covering this pin: _______
```

Fill one card per base image. Attach to the service ADR.

---

## 3. Applications and use cases

### DevOps: CI matrix honesty

| Runner / image | What you proved | What you did **not** prove |
|----------------|-----------------|----------------------------|
| Ubuntu GitHub-hosted | GNU + Bash 5-ish + often dash as `sh` | Alpine ash, RHEL quirks |
| `alpine:3` job | BusyBox reality | Full GNU flags |
| RHEL UBI | Enterprise Bash-centric `sh` habits | Debian dash rejection of Bashisms |
| Custom AMI | Only that AMI | Next year’s AMI refresh |

Minimum honest matrix for “portable Linux scripts”:

1. Debian/Ubuntu with **dash** executing `#!/bin/sh`.  
2. Alpine with BusyBox.  
3. One RHEL-line image if you ship to enterprises.

```yaml
# Conceptual matrix — adapt to your CI product
# jobs:
#   sh-debian: image debian:bookworm → sh -n && sh script.sh
#   sh-alpine: image alpine → sh script.sh
#   bash-ubi:  image ubi → bash script.bash
```

### Platform engineering: base image contracts

Publish a one-pager per base image:

```text
Image: registry.example/runtime-alpine:2026.08
/bin/sh: BusyBox ash
bash: not installed
userland: BusyBox (no find -printf, limited date)
Allowed entrypoint: posix-sh only
```

Consumers stop inventing GNU pipelines against Alpine.

### Application shipping: installers and postinst

Debian `postinst` scripts are expected to work with `/bin/sh` = dash. Bashisms in packaging scripts are release blockers. Upstream projects that develop only on Fedora/RHEL often discover this on Ubuntu buildds—not “CI flakiness.”

### Security engineering / recon

| Recon step | Command / artifact | Why |
|------------|--------------------|-----|
| Resolve system shell | `ls -l /bin/sh`; `readlink -f /bin/sh` | Know dialect for scripts and live-off-the-land |
| Bash inventory | `bash --version`; package manager query | Patch posture; feature assumptions |
| BusyBox | `busybox`; applet list | Embedded/OT and Alpine attack/defense surface |
| Userland family | `sed --version`, `find --version` | Predict which one-liners work |
| CI vs prod drift | Compare fingerprints from build logs vs prod debug | Spot “works in Actions, fails in cluster” |

Defenders writing containment scripts must target the **compromised host’s** `/bin/sh`, not the analyst’s Ubuntu laptop.

### Ops: break-glass on mixed fleets

Keep two break-glass bundles:

- **POSIX/`sh`** bundle tested under dash and BusyBox.  
- **Bash** bundle for hosts guaranteed to have Bash 5.x.

Label them. Mixing them under stress causes outages.

### Data / ML platforms on mixed nodes

GPU AMIs, Databricks-style images, and HPC nodes often differ from the org’s “standard” Ubuntu. Fingerprint once per node class; do not assume the notebook’s shell matches the job’s launcher script.

### Compliance and SBOMs

Shell and coreutils versions belong next to library versions when you claim reproducible builds. “Linux” is not an SBOM entry.

### GitHub-hosted vs self-hosted vs product images

| Environment | Typical trap |
|-------------|--------------|
| Ubuntu-hosted CI | Teaches GNU + Bash; hides Alpine/RHEL |
| Self-hosted RHEL builders | Hides dash; teaches Bashisms under `sh` |
| Product runtime Alpine | Discovers truth too late in prod |
| “Debug” Ubuntu sidecar next to Alpine app | Engineers fix the sidecar, not the app image |

Wire the **product runtime** into CI. Sidecars are for humans, not for proving entrypoints.

### Library maintainers shipping “shell helpers”

If you publish a Bash helper library used on “Linux,” state:

1. Minimum Bash major **or** POSIX `sh` claim.  
2. GNU userland required: yes/no.  
3. Tested images list (Bookworm dash, Alpine ash, UBI).  

Without that triple, downstream DevOps will open issues that are actually distro-matrix bugs.

### Migrating a Bashy fleet script to survive Debian + Alpine

Practical sequence:

1. Run ShellCheck with `-s sh`.  
2. Replace `[[`, arrays, `source`, process substitution.  
3. Replace GNU-only flags (`date -d`, `find -printf`) with portable or documented GNU deps.  
4. Execute under `dash` and BusyBox `sh` in CI.  
5. Only then remove the “Ubuntu-only” label from the README.

### SE review question set (pull requests)

1. Which `/bin/sh` did you test?  
2. Which userland (GNU vs BusyBox)?  
3. Does the runtime image match the CI image for this path?  
4. Are GNU flags behind a package requirement in the Dockerfile/Helm values?  
5. Would this fail on Bookworm dash even if Bash is installed for humans?

### Whole-engineering OS companion

Linux admin and command context: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md). This Languages chapter owns the **distro × sh × userland** matrix for scripting contracts.

### Staff-level review checklist

- `/bin/sh` resolved and recorded for every base image in scope.  
- Debian/Ubuntu scripts under `#!/bin/sh` free of Bashisms (dash-tested).  
- Bookworm+ hosts not “fixed” by unsupported bash-as-sh reconfigure as a strategy.  
- Alpine images: Bash/GNU packages installed **only** when required and documented.  
- RHEL-only tested scripts not labeled “portable Linux.”  
- CI includes at least one non-Ubuntu Linux cell if portability is claimed.  
- Build-stage GNU/Bash not silently required at Alpine/distroless runtime.  
- `sed -i`, `date -d`, `find -printf`, `grep -P` gated on GNU userland or rewritten.  
- Cron/systemd entrypoints tested with minimal `env -i`/`PATH`.  
- Amazon Linux / marketplace AMIs fingerprinted as their own pins.  
- Arch/Gentoo (or any rolling) golden images pin shell/userland packages.  
- Security runbooks name target `/bin/sh`, not “bash on Linux.”  
- Distroless: absence of shell documented (debug via ephemeral containers).  
- OS companion consulted for Linux admin context when needed; dialect depth stays here.

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [GNU Bash home](https://www.gnu.org/software/bash/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [Debian Policy Manual — Files](https://www.debian.org/doc/debian-policy/ch-files.html)
- [Debian Wiki — Shell](https://wiki.debian.org/Shell)
- [BusyBox](https://busybox.net/)
- [BusyBox documentation](https://busybox.net/downloads/BusyBox.html)
- [GNU coreutils manual](https://www.gnu.org/software/coreutils/manual/)
- [GNU sed manual](https://www.gnu.org/software/sed/manual/sed.html)
- [GNU findutils](https://www.gnu.org/software/findutils/)
- [ShellCheck](https://www.shellcheck.net/)
