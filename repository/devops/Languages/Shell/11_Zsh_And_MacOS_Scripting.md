# zsh and macOS scripting realities

[← Back to Shell](./README.md)

## What this chapter covers

How **zsh** became the default **interactive** shell on macOS (Catalina onward), why stock **`/bin/bash` remains Bash 3.2**, how **BSD userland** flags differ from GNU/Linux, and when to install **Homebrew Bash** for modern scripting. This is not a zsh configuration cookbook—it is the macOS scripting reality check so shared automation does not silently depend on your laptop’s interactive shell.

---

## 1. Concepts

### 1. Two different questions on a Mac

| Question | Typical answer |
|----------|----------------|
| What runs when I open Terminal? | **zsh** (Catalina+) |
| What should CI/shared scripts use? | **Bash 5.x** (Homebrew or Linux) or portable **`sh`**—not “whatever my interactive shell is” |

Interactive comfort and committed automation are separate contracts. Dotfiles (`~/.zshrc`) must not be dependencies for production scripts.

### 2. Before zsh: Bash as the macOS interactive default

For years before **macOS 10.15 Catalina**, Apple’s default **interactive** shell for many accounts was **Bash**. That shaped muscle memory and documentation:

| Concern | Pre-Catalina habit | Why it still matters |
|---------|--------------------|----------------------|
| Login vs interactive config | `~/.bash_profile` (login) and `~/.bashrc` (interactive non-login); often one `source`d the other | Migrating to zsh means deciding which aliases/functions move—and which were never meant for scripts |
| “Put it in my profile” | Engineers stacked `PATH`, `alias`, and helper functions into Bash rc files | CI and `launchd` never loaded those files—bugs looked like “Mac is weird” when they were “interactive-only” |
| Scripts vs Terminal | Docs said “open Terminal and run…” assuming Bash syntax and Bash history | Copy-pasted snippets mixed interactive Bash with committed `#!/bin/bash` files |
| Teaching materials | Countless tutorials targeted Bash on Mac | Readers on Catalina+ hit zsh first; syntax that “worked yesterday” may be a pasted Bashism under zsh—or the reverse |

**Beginner takeaway:** before Catalina, “my Mac shell” usually meant **Bash interactive + Bash-looking scripts**. After Catalina, “my Mac shell” usually means **zsh interactive**, while **scripts with `#!/bin/bash` still hit stock Bash 3.2** unless you change the shebang or install another Bash. The interactive default changed; the stock Bash pin did not modernize.

### 3. Catalina switch to zsh: what users see

Apple moved the default login/interactive shell to **zsh** starting with Catalina (10.15). What humans notice:

- New accounts get **zsh** unless changed in Users & Groups / `chsh`.
- First-login messaging / migration nudges pointed people at zsh (wording varied by release).
- Examples online may be zsh-specific (globbing, arrays, `emulate`).
- Many Bash scripts still run under zsh with caveats—**do not rely on that** for shared code.

**Migrating aliases and functions:** copy deliberately from `~/.bash_profile` / `~/.bashrc` into `~/.zshrc` (or a file you `source` from it). Do not `source` your entire Bash profile from zsh forever—option defaults and array rules differ. Prefer small, reviewed function files that both shells can share only when written portably—or keep interactive helpers zsh-only and keep automation in committed Bash/`sh` scripts.

**`$SHELL` vs script shebang (do not confuse them):**

| Signal | What it tells you | What it does *not* tell you |
|--------|-------------------|-----------------------------|
| `echo $SHELL` | Preferred **login** shell path (often `/bin/zsh` now) | Which binary runs a script file |
| Terminal tab | Interactive zsh (or whatever you launched) | Whether `./tool.sh` uses Bash 3.2, Homebrew Bash, or `sh` |
| Script shebang (`#!/bin/bash`, `#!/usr/bin/env bash`, `#!/bin/zsh`) | Interpreter for **that file** when executed | Your interactive theme, plugins, or aliases |

```zsh
echo $ZSH_VERSION
echo $SHELL          # login shell preference; not proof of script runtime
head -n1 ./deploy.sh # read the shebang — that is the contract
```

### 4. Stock Bash 3.2 still present—why security and ops still care

macOS continues to ship **`/bin/bash` at 3.2.x** for legacy reasons. That binary **missing** Bash 4+/5 features (associative arrays, `|&`, `mapfile`, namerefs, `${var,,}`, `globstar`, …)—see chapter 09.

```bash
/bin/bash --version | head -n1
```

If a script’s shebang is `#!/bin/bash` on a Mac, it may be 3.2 even when the engineer also installed Homebrew Bash elsewhere.

Why **security/ops** still inventory this binary:

- **Shebang gravity:** installers, MDM payloads, and old internal tools hard-code `/bin/bash` and never see Homebrew.
- **Feature false confidence:** a reviewer on Linux Bash 5 approves syntax that **cannot run** on stock Mac agents—or worse, partially runs with subtle bugs.
- **Attack surface literacy:** decade-old scripts on that pin often predate modern quoting habits (chapter **18**); the interpreter age correlates with **script age**, not just syntax tables.
- **Dual-stack persistence:** interactive zsh rc files *and* leftover Bash profiles both exist on long-lived Macs—incident responders must know which era’s files load (chapter **18**).

### 5. Timeline table: pre-10.15 / 10.15+ / current

| Era | macOS | Interactive default | Stock `/bin/bash` | Typical personal config | Automation contract to write down |
|-----|-------|---------------------|-------------------|-------------------------|-----------------------------------|
| **Pre-10.15** | Mojave and earlier | Bash (common default) | **3.2.x** | `.bash_profile` / `.bashrc` | Scripts may assume Bash interactive habits; still not Bash 4+ |
| **10.15+** | Catalina → recent | **zsh** for new accounts | **3.2.x** | `.zshrc` (+ maybe leftover Bash files) | Migrate aliases; keep shebangs honest; do not treat zsh as fleet dialect |
| **Current** | Supported releases today | zsh interactive; optional `chsh` | **3.2.x** remains | Homebrew Bash 5 on many eng laptops; zsh plugins common | Pin Homebrew Bash or `sh` for shared scripts; test BSD userland; no plugin `PATH` in CI |

### 6. Homebrew Bash (and friends)

Common practice: install modern Bash via Homebrew and pin scripts to it.

```bash
# Illustrative paths — verify on your host
command -v bash
brew --prefix bash 2>/dev/null
```

| Approach | Pros | Cons |
|----------|------|------|
| Require Homebrew Bash in docs/CI | Real Bash 5.x features | Extra install step on Mac agents |
| Stay Bash 3.2-safe | Works with stock `/bin/bash` | Lose modern syntax |
| Portable `#!/bin/sh` | Broad Unix portability | Least expressive |
| Write zsh scripts | Matches interactive default | Rare on Linux CI; team splits |

### 7. BSD userland vs GNU

Even with Bash 5 from Homebrew, **external commands** on macOS are often **BSD** variants unless GNU tools are installed (`coreutils`, `findutils`, `gnu-sed`, …).

| Area | Linux (GNU) habit | macOS (BSD) reality |
|------|-------------------|---------------------|
| `sed -i` | `sed -i` | `sed -i ''` (empty backup suffix) |
| `date` | `date -d` / `--iso` | Different; often `date -j -f` |
| `find` | `-printf`, many GNU predicates | Subset; no `-printf` |
| `grep` | `-P` (PCRE) common on GNU | `-P` often absent |
| `ls`/`ps` flags | GNU long options | BSD flags |

Shell language ≠ userland. Chapter 14–15 expand commands; here the rule is: test Mac scripts on a Mac (or Mac CI), not only on Ubuntu.

### 8. Existence matrix (macOS focus)

| Capability | macOS zsh interactive | macOS `/bin/bash` 3.2 | Homebrew Bash 5 | Linux Bash 5 | PowerShell 7 on Mac |
|------------|----------------------|------------------------|-----------------|--------------|---------------------|
| Default Terminal shell | Yes | No | No | N/A | Optional install |
| Assoc arrays | Yes (zsh syntax) | **No** | Yes | Yes | Hashtables |
| `[[` | Yes | Yes | Yes | Yes | N/A |
| GNU `sed -i` | Only if GNU sed installed | Same | Same | Yes | N/A |
| Bash 4+ `mapfile` | Emulation ≠ same | **No** | Yes | Yes | N/A |

### 9. What operators get wrong (short list)

1. “macOS uses zsh, so our scripts should be zsh.” — Interactive default ≠ fleet dialect.
2. “`#!/bin/bash` means modern Bash.” — On Apple’s `/bin/bash`, it often means **3.2**.
3. “Bash is Bash; flags are flags.” — BSD `sed`/`date`/`find` disagree with GNU habits.
4. “CI Mac runners match my laptop.” — Images differ; still not Ubuntu GNU.
5. “Homebrew is always on `PATH` for launchd/agents.” — Service PATH is frequently minimal.
6. “`$SHELL` is zsh, so my deploy script runs under zsh.” — Shebang decides; `$SHELL` is preference only.
7. “We migrated to zsh, so Bash profiles are gone.” — Leftover `.bash_profile` files still appear in IR and confusing dual configs.

Memorize those; they explain most Mac scripting incidents.

---

## 2. Advanced concepts

### 1. zsh vs Bash script differences that bite

Even when syntax looks similar:

| Topic | Bash habit | zsh habit / risk |
|-------|------------|------------------|
| Arrays | `arr[0]` first element | Arrays are **1-indexed** by default |
| Globbing | Unmatched glob may stay literal (depends on options) | Often errors on no match (`NOMATCH`) |
| Word splitting | Split unquoted `$var` | Different defaults; `SH_WORD_SPLIT` off by default |
| `echo` | Portability issues | Still prefer `print`/`printf` carefully |
| Emulation | N/A | `emulate -L sh` / `bash` modes help but are not identity |

```zsh
# zsh array indexing surprise for Bash readers
arr=(a b c)
print -r -- $arr[1]    # a  (not b)
```

Committed cross-platform automation should not require readers to remember zsh index rules—prefer Bash-or-`sh` for repo scripts unless the team standardizes on zsh everywhere (unusual for Linux fleets).

### 2. Startup files and non-interactive runs

zsh loads different files for login vs interactive vs script contexts. CI `run:` steps should not assume `~/.zshrc` aliases, `compinit`, or PATH mutations from oh-my-zsh plugins.

Staff rule: **scripts must run with empty user dotfiles.** Test with `zsh -f` / `bash --noprofile --norc` during review when Mac-specific bugs appear.

### 3. Shebang pitfalls on macOS

```bash
#!/usr/bin/env bash   # resolves whatever `bash` is first on PATH
#!/bin/bash           # often 3.2 on macOS
#!/bin/zsh           # fine for zsh-only utilities; rare for shared CI
#!/bin/sh            # portable intent; still verify userland flags
```

GitHub Actions `macos-*` runners include a richer toolset than a stock laptop—but still not identical to Ubuntu GNU userland. Pin tools or write flag-portable commands.

### 4. BSD `sed -i` pattern

```bash
# GNU/Linux
sed -i 's/foo/bar/' file.txt

# macOS BSD sed
sed -i '' 's/foo/bar/' file.txt
```

Portable approaches: use a temp file + `mv`, or install GNU `gsed` and call it explicitly, or detect OS (ugly—prefer temp file for simplicity).

### 5. Path, quarantine, and execution

macOS Gatekeeper/quarantine attributes can block downloaded scripts until cleared—ops issue more than language issue. Executable bits (`chmod +x`) still matter. Prefer `bash script.sh` in CI over relying on execute bits when agents differ.

### 6. WSL and dual-boot teammates

Teams mixed with Windows WSL (Linux GNU userland) and Mac BSD userland will disagree about `sed` and `date` constantly. Encode the lowest common flag set or generate platform-specific snippets from a higher-level tool.

### 7. When zsh *is* the right committed language

- Internal Mac-only admin tooling owned by a desktop team
- Interactive widgets that truly need zsh completion/association features
- Migration helpers that already standardize on zsh across Mac estate

Otherwise: Bash 5+ or POSIX `sh` for anything that also runs on Linux agents.

### 8. `path_helper` and `/etc/paths`

macOS may reshape `PATH` via `path_helper` and files under `/etc/paths` / `/etc/paths.d`. Non-interactive scripts can see different `PATH` than an interactive zsh session with Homebrew’s shellenv hook. Print `command -v` results in CI logs when diagnosing “works on my Mac.”

### 9. Case sensitivity and filesystems

APFS can be case-insensitive (common) or case-sensitive (rare, but used). Scripts that create `File` and `file` may work on a developer Mac and break on Linux CI. Do not rely on case-insensitive collisions.

### 10. Python/Ruby/Node shims on Mac

Homebrew and Xcode CLT interact with language shims. Shell scripts that call `python` or `sed` should prefer absolute paths or `command -v` checks after documenting the expected toolchain—not assume Apple Command Line Tools match Linux CI.

### 11. Rosetta and arch differences

On Apple silicon, some tools still run under Rosetta. Arch mismatches show up as “command not found” for the wrong slice or subtle performance issues—not usually shell syntax issues, but easy to misblame on zsh vs Bash.

### 12. Comparing the same task three ways

Listing listening TCP ports (conceptual—flags vary by OS version):

| Dialect | Sketch |
|---------|--------|
| Bash + BSD/`netstat` or `lsof` | `lsof -nP -iTCP -sTCP:LISTEN` |
| zsh interactive | Same userland; plus aliases from `.zshrc` (forbidden in CI) |
| PowerShell 7 on Mac | `Get-NetTCPConnection` is Windows-oriented—on Mac use native tools or cross-platform modules carefully |

The lesson: dialect choice does not erase userland differences. Pick shell and commands as a pair.

### 13. Script location and macOS privacy prompts

Automation that touches Documents/Desktop/camera-ish paths may trigger TCC privacy prompts for Terminal or `bash`. Headless agents need Full Disk Access (or narrower grants) configured by MDM—otherwise scripts “hang” waiting for a GUI click that never comes.

### 14. Migrating a human from Bash interactive to zsh (checklist)

When onboarding or upgrading a long-lived Mac account:

1. List aliases/functions actually used weekly—not the entire `.bashrc`.  
2. Recreate them in `~/.zshrc` (or a small `~/shell/interactive.zsh` you `source`).  
3. Leave automation in committed scripts with explicit shebangs—do not “fix” scripts by changing `$SHELL` alone.  
4. Keep a backup of Bash rc files for a release cycle; remove secrets from them while you are there.  
5. Verify `echo $SHELL` shows zsh **and** that `head -n1` on fleet scripts still names the intended Bash/`sh`.  
6. Re-test one MDM/`launchd` job—interactive migration does not validate agents.

### 15. `$SHELL`, `dscl`, and `chsh` (operator literacy)

Changing the login shell updates the account’s preferred shell (historically via `chsh` / directory services). That preference feeds new Terminal sessions. It does **not** rewrite shebangs in git, cron, or installer payloads. Staff reviewing “we switched the company to zsh” must ask: *interactive preference, committed scripts, or both?*

### 16. Why Bash 3.2 remains a security-adjacent pin

Security engineers care about stock `/bin/bash` even when nobody “writes for 3.2” on purpose:

| Reason | Detail |
|--------|--------|
| **Default gravity** | Unsigned tribal knowledge still ships `#!/bin/bash` |
| **Feature gap ≠ safety** | Missing associative arrays does not mean safer scripts—old trees often lack quoting discipline |
| **Mixed estate** | Engineer laptops (Homebrew Bash 5 + zsh) diverge from kiosk/build agents (stock only) |
| **Incident narratives** | “Ran under bash” is ambiguous until you print `--version` and the absolute path |

Pair this section with chapter **02** (version gates) and **18**/**21** (injection and legacy timelines).

---

## 3. Applications and use cases

### Migration playbook (applications)

When a team still has pre-Catalina habits:

| Step | Action | Done when |
|------|--------|-----------|
| 1 | Inventory `.bash_profile` / `.bashrc` vs `.zshrc` on golden Mac images | Dual trees documented or consolidated |
| 2 | Move shared automation out of rc files into repo scripts | CI passes with `bash --noprofile --norc` / `zsh -f` |
| 3 | Set shebang policy (Homebrew Bash 5 vs `sh`) in the Mac agent README | New PRs cite the pin |
| 4 | Teach `$SHELL` ≠ runtime in onboarding | Reviewers catch “but Terminal is zsh” mistakes |

### Developer experience

zsh + completions is excellent for humans. Keep “human shell” config out of application repositories; put shared functions in versioned scripts with explicit shebangs.

### CI on `macos` runners

- Do not assume `/bin/bash` is modern.
- Prefer `bash` from the runner image documentation or install Bash 5 explicitly.
- Test GNU-flag assumptions; replace with portable invocations.

### Application shipping to Mac users

Installers that embed Bash 4+ syntax must ship or require a modern Bash—or rewrite for 3.2/`sh`. Document the requirement next to the installer.

If you distribute a `.command` double-click script for non-technical Mac users, remember Terminal may still be zsh while your shebang selects Bash—test both the double-click path and a clean `PATH`. Ship a one-line README next to the script stating the required Bash major.

### Security

Dotfile managers sometimes download remote zsh plugins—supply-chain risk for interactive environments. Automation servers should not load those plugins at all.

### Ops

Remote Mac fleets (MDM) often expose both zsh and old Bash. Choose one automation dialect for the fleet; document Homebrew dependencies as first-class packages.

Bootstrap checklist for a Mac build agent image:

1. Install Homebrew Bash 5.x and put it ahead of `/bin/bash` on automation `PATH` **or** shebang to the Homebrew path.
2. Install GNU coreutils/sed only if scripts require them—and call `gsed`/`gdate` explicitly.
3. Disable reliance on interactive zsh plugins in service accounts.
4. Record `bash --version`, `zsh --version`, and `sw_vers` in the image SBOM/notes.

### Release engineering

Notarized Mac apps sometimes ship helper scripts. Prefer `/usr/bin/env` patterns that resolve inside the bundle, or embed a known interpreter. Stock Bash 3.2 limitations still apply if you call `/bin/bash`.

### Security engineering

Audit `eval` in zshrc plugin frameworks on engineer laptops that hold cloud credentials. Interactive shell compromise is a common lateral-movement story; keep production secrets out of shell history and plugin-managed env files.

### Desktop vs headless Mac automation

GUI login sessions load different environments than SSH/`launchd` agents. Prefer absolute paths to Homebrew prefixes in agent plists. Test the exact service account—do not validate only in an interactive Terminal tab.

### Toolchain documentation snippet (commit beside scripts)

```text
Mac automation contract:
- Interpreter: Homebrew bash >= 5.2 (not /bin/bash)
- Userland: BSD defaults; GNU tools only via g-prefixed commands when listed
- Forbidden: zsh interactive plugins, unquoted find|xargs without -print0/-0
```

### Whole-engineering OS companion

macOS admin and shell context beyond dialect depth: [`../../Operating-Systems/MacOS/9_Shell_And_Scripting.md`](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md). Linux contrast: [`../../Operating-Systems/Linux/9_Shell_And_Scripting.md`](../../Operating-Systems/Linux/9_Shell_And_Scripting.md).

### Staff-level review checklist

- Scripts do not require interactive zsh settings or oh-my-zsh plugins.
- Bash 4+ features gated on Homebrew/CI Bash—not stock `/bin/bash`.
- BSD vs GNU flag differences handled (`sed -i`, `date`, `find`, `grep -P`).
- Shebang resolves to the intended binary on Mac agents.
- Arrays/indexing assumptions documented if any zsh-only script is committed.
- macOS CI job exists when packaging claims Mac support.
- PATH mutations from user dotfiles are not load-bearing.
- `launchd`/MDM agents tested with the service `PATH`, not only Terminal.
- TCC/privacy grants documented for headless file access where required.
- README states Mac interpreter pin (Homebrew Bash vs `sh` vs zsh-only).
- Dual-boot / WSL teammates: do not copy GNU-only snippets into Mac scripts without a BSD retest.
- Pre-Catalina Bash rc files inventoried if the host predates migration—or dual configs documented.
- Reviewers distinguish `$SHELL` (preference) from shebang (script runtime).
- Timeline pin stated for the Mac estate (pre-10.15 habits vs 10.15+ zsh default vs current Homebrew reality).

---

## References

- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [Apple Developer — Shell scripting overview (archive/tech notes as applicable)](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/)
- [Homebrew](https://docs.brew.sh/)
- [ShellCheck](https://www.shellcheck.net/)
