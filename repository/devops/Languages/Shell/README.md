# Shell (Bash, POSIX sh, zsh, PowerShell, cmd)

[← Back to Languages](../README.md)

**Shell** is the family of **command interpreters** used to run commands and scripts. **Bash** is the most common Unix/Linux scripting dialect in that family (POSIX `sh` plus Bash extensions). This track also covers **zsh** (macOS default interactive, including **pre-Catalina bash** history), **PowerShell** and **cmd** (Windows), **Linux distro differences** (Debian/Ubuntu `dash`, RHEL-family, Alpine BusyBox, …), and the bridges (**WSL**, Git Bash, Microsoft Coreutils)—so a beginner can become confident **on any OS and any brownfield estate**, including security/legacy work.

This is the **Languages** deep track for shell scripting. Operating-Systems chapters remain useful OS-context companions (they are not duplicates of this curriculum):

- [Fundamentals: UI and the shell](../../Operating-Systems/Fundamentals/11_User_Interface_And_Shell.md)
- [Linux: Shell and scripting](../../Operating-Systems/Linux/9_Shell_And_Scripting.md)
- [Unix: Shell and scripting](../../Operating-Systems/Unix/9_Shell_And_Scripting.md)
- [macOS: Shell and scripting](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md)
- [Windows: Commands and PowerShell](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md)

---

## Shell vs scripting (read this once)

| Term | Meaning |
|------|---------|
| **Shell** | The **bigger set**: interpreters + **many subsets** (modes, dialects, builtins/aliases/functions, pipelines, profiles, SSH/CI/containers, …)—see chapter **22** |
| **Scripting** | **One subset**: saving recipes (`.sh`, `.ps1`, `.bat`) for non-interactive/repeatable runs—automation, CI, glue |
| **POSIX `sh`** | Portable Unix scripting baseline (`#!/bin/sh`) |
| **Bash** | GNU Bourne-Again SHell — implements POSIX `sh` **and** Bash-only features |
| **zsh** | Another Unix shell (default interactive on modern macOS) |
| **PowerShell** | Different language (object pipelines); not a Bash dialect |
| **cmd** | Windows batch shell; legacy automation |

People say “shell script” when they often mean Bash. This track always names the **dialect** and the **OS**. Start at chapter **00** if you have never used a terminal.

---

## Versions and brownfield (default narrative)

**Defaults for new automation:** Bash **5.x** (or portable `sh` when required), zsh for macOS-interactive notes, PowerShell **7.x** (`pwsh`) on Windows/cross-platform agents.

**Brownfield you will meet:**

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| Bash **3.2** | Stock macOS `/bin/bash` | Avoid Bash 4+ features unless Homebrew Bash or Linux |
| Bash **4.x / 5.x** | Linux, containers, CI | Default Unix scripting depth |
| Windows PowerShell **5.1** | Built into Windows | Windows-only modules; note 7.x differences |
| PowerShell **7.x** | Cross-platform | Prefer for new cross-OS automation |
| `dash` as `/bin/sh` | Debian/Ubuntu | No Bashisms under `#!/bin/sh` (see ch **20**) |
| BusyBox `ash` | Alpine/embedded | Smaller command set (see ch **20**) |
| Pre-Catalina macOS | Older Mac fleets | Default interactive was **bash**; profiles differ (ch **11**, **21**) |
| PowerShell **2.0** / old agents | Legacy Windows estates | Inventory and replace; do not design new automation on it |

When a feature is version-bound, chapters mark **added in**, **works through**, or **do not use after**.

```bash
# Discover what you actually have
bash --version 2>/dev/null || true
zsh --version 2>/dev/null || true
sh -c 'echo $0' 
command -v pwsh; command -v powershell
```

```powershell
$PSVersionTable
Get-Host
```

---

## Chapter structure

Chapters follow:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, OS deltas, edge cases)
3. **Applications and use cases** (CI, ops, security, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Doorway | **00** | Terminal vs shell vs script; first commands; first tiny script |
| Foundations | 01–07 | Shell vs Bash; versions; toolchain; quoting/expansions; variables; control flow; functions |
| I/O and dialects | 08–11 | Redirection/pipelines; Bash extensions; portable POSIX; zsh/macOS |
| Windows scripting | 12–13 | PowerShell language; cmd/batch |
| Commands & production | 14–18 | Cross-OS command depth; robustness; testing; security |
| Strategy | 19–21 | DevOps/CI use cases; Linux distro `/bin/sh` & userland; legacy timelines & security engineering |
| Shell anatomy | **22** | Every major **subset** inside shell (modes, dialects, surfaces, composition, config, hosts)—extreme depth |
| Specialty | **23–25** | Flag decode; jq/structured data; network/process recon for ops & security |
| Command catalog | **27–32** | Master Command Atlas + builtins + identity/env/disks + archives/transfer + PowerShell/cmd + **terminal/TTY/eras/distros ladder** |
| Wrap | **26** | Whole-engineering wrap and staff checklist (read **after** **27–32** for command fluency sign-off) |

Suggested order: **00 → 01 → 22** (subsets), then **02–11**, then **12 → 13**, then **14 → 18**, then **19 → 21**, then **23 → 25**, then **27 → 32** (command encyclopedia + eras), then **26**. Revisit **02** before pinning CI images; **10**/**20** before `#!/bin/sh` portability; **18**/**21** before untrusted input / legacy estates; **15**/**24** for JSON depth; **22** whenever “it works in my shell” is ambiguous; **27**/**32** whenever you need the full list of commands **or** which era/distro you are on.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 0 | First steps in the terminal | [00](./00_First_Steps_In_The_Terminal.md) |
| 1 | What is a shell — Bash, POSIX sh, and the family | [01](./01_What_Is_A_Shell_Bash_POSIX_And_The_Family.md) |
| 2 | Versions, legacy pins, and compatibility | [02](./02_Versions_Legacy_Pins_And_Compatibility.md) |
| 3 | Toolchain: discovering shells, shebangs, and environments | [03](./03_Toolchain_Shebangs_And_Environments.md) |
| 4 | Words, quoting, and expansion order | [04](./04_Words_Quoting_And_Expansion_Order.md) |
| 5 | Variables, parameters, and special parameters | [05](./05_Variables_Parameters_And_Special_Parameters.md) |
| 6 | Control flow and exit status | [06](./06_Control_Flow_And_Exit_Status.md) |
| 7 | Functions and script structure | [07](./07_Functions_And_Script_Structure.md) |
| 8 | Redirection, pipelines, and job control | [08](./08_Redirection_Pipelines_And_Job_Control.md) |
| 9 | Bash extensions in depth (version-gated) | [09](./09_Bash_Extensions_In_Depth.md) |
| 10 | Portable POSIX `sh` scripting | [10](./10_Portable_POSIX_Sh_Scripting.md) |
| 11 | zsh and macOS scripting realities | [11](./11_Zsh_And_MacOS_Scripting.md) |
| 12 | PowerShell as a scripting language | [12](./12_PowerShell_As_A_Scripting_Language.md) |
| 13 | cmd.exe and batch scripting | [13](./13_Cmd_And_Batch_Scripting.md) |
| 14 | Commands in depth: files, paths, and processes (cross-OS) | [14](./14_Commands_Files_Paths_And_Processes.md) |
| 15 | Commands in depth: text, search, and data shaping (cross-OS) | [15](./15_Commands_Text_Search_And_Data_Shaping.md) |
| 16 | Robust scripts: errors, traps, and idioms | [16](./16_Robust_Scripts_Errors_Traps_And_Idioms.md) |
| 17 | Testing, ShellCheck, and PowerShell analysis | [17](./17_Testing_ShellCheck_And_PS_Analysis.md) |
| 18 | Security: injection, secrets, and trust boundaries | [18](./18_Security_Injection_Secrets_And_Trust.md) |
| 19 | Use cases: CI, ops glue, and cross-OS automation | [19](./19_Use_Cases_CI_Ops_And_Cross_OS.md) |
| 20 | Linux distros: `sh` and userland differences | [20](./20_Linux_Distros_Sh_And_Userland_Differences.md) |
| 21 | Legacy timelines and security engineering | [21](./21_Legacy_Timelines_And_Security_Engineering.md) |
| 22 | Shell subsets in extreme depth | [22](./22_Shell_Subsets_In_Extreme_Depth.md) |
| 23 | How to read any command: flags letter by letter | [23](./23_How_To_Read_Any_Command_Flags_Letter_By_Letter.md) |
| 24 | jq and structured data in scripts | [24](./24_Jq_And_Structured_Data_In_Scripts.md) |
| 25 | Network/process recon commands for ops and security | [25](./25_Network_Process_Recon_Commands_For_Ops_And_Security.md) |
| 26 | Whole-engineering wrap and staff checklist | [26](./26_Whole_Engineering_Wrap_And_Staff_Checklist.md) |
| 27 | Command atlas — complete shell command surface | [27](./27_Command_Atlas_Complete_Shell_Command_Surface.md) |
| 28 | Bash and POSIX builtins in extreme depth | [28](./28_Bash_And_POSIX_Builtins_In_Extreme_Depth.md) |
| 29 | Commands: identity, time, env, disks, and system | [29](./29_Commands_Identity_Time_Env_Disks_And_System.md) |
| 30 | Commands: archives, checksums, and transfer | [30](./30_Commands_Archives_Checksums_And_Transfer.md) |
| 31 | PowerShell cmdlet atlas and cmd.exe builtins | [31](./31_PowerShell_Cmdlet_Atlas_And_Cmd_Builtins.md) |
| 32 | Terminal, TTY, and command eras across OS and distros | [32](./32_Terminal_TTY_And_Command_Eras_Across_OS.md) |

---

## Deep-study workflow

1. Start at **00**, then after **01–03**, on each OS you use, record shell path + version in a one-page lab note.
2. After **04–10**, rewrite one Bashy script to POSIX `sh` and list what broke.
3. After **12–13**, write the same “check disk / list processes” task in PowerShell and in Bash.
4. After **14–18**, add ShellCheck (and PSScriptAnalyzer where relevant) to CI for one real repo.
5. After **19–21**, prove distro `/bin/sh` claims and inventory legacy pins for one estate.
6. After **23–25**, decode one opaque flag cluster, one `jq` transform, and one recon checklist for your OS.
7. After **27–32**, pick ten atlas commands you use weekly and expand each flag/parameter table from the depth chapter; prove BusyBox/BSD/Windows glyphs on a real agent; run the Stage 0–2 lab from **32** on one foreign OS/distro.
8. After **26**, sign the wrap checklist for your primary OS *and* one foreign OS—including command-catalog and era/distro items.

---

## Further reading

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [zsh documentation](https://zsh.sourceforge.io/Doc/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
- [ShellCheck](https://www.shellcheck.net/)
- [GNU coreutils manual](https://www.gnu.org/software/coreutils/manual/)
- [Apple — Use zsh as the default shell on your Mac](https://support.apple.com/en-us/HT208050)
- [Debian Policy — Files (incl. `/bin/sh` expectations)](https://www.debian.org/doc/debian-policy/ch-files.html)
- [jq manual](https://jqlang.github.io/jq/manual/)
- [ss(8) — Linux man page](https://man7.org/linux/man-pages/man8/ss.8.html)

---

## References (hub links)

- [GNU Bash](https://www.gnu.org/software/bash/)
- [Chet Ramey Bash page](https://tiswww.case.edu/php/chet/bash/bashtop.html)
- [Microsoft Learn — PowerShell](https://learn.microsoft.com/en-us/powershell/)
- [Microsoft Coreutils for Windows](https://learn.microsoft.com/en-us/windows/core-utils/overview)
