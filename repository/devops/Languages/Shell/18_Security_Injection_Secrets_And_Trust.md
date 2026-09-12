# Security: injection, secrets, and trust boundaries

[← Back to Shell](./README.md)

## What this chapter covers

Shell-specific **trust boundaries**: unquoted expansions, `eval`, `curl | sh`, PowerShell `Invoke-Expression`, secrets in environment and process lists, and **Constrained Language Mode** literacy. Goal: staff-level instincts to reject dangerous patterns in review—not a full red-team curriculum.

---

## 1. Concepts

### 1. The shell is a command constructor

Most shell vulnerabilities are **injection**: untrusted data becomes syntax. Quoting (chapter 04) is a security control, not style.

```bash
# Dangerous sketch — do not ship
rm -rf $TARGET          # spaces/globs/empty → catastrophe
eval "$USER_SCRIPT"     # remote code execution by design
bash -c "$UNTRUSTED"    # same class
```

```powershell
# Dangerous sketch — do not ship
Invoke-Expression $Untrusted
Invoke-Expression "Get-Process $Name"  # if $Name crafted
```

### 2. Cross-OS hazard map

| Hazard | Linux Bash | macOS | PowerShell | cmd | WSL | BusyBox |
|--------|------------|-------|------------|-----|-----|---------|
| Unquoted `$var` | critical | critical | different expansion model | `%VAR%` injection | critical in Bash | critical |
| `eval` | critical | critical | `Invoke-Expression` | rare patterns | critical | critical |
| `curl \| sh` | supply chain | same | `irm \| iex` culture | download+run | same | same |
| Secrets in `ps` | argv visible | same | process cmdline | `tasklist` limited | visible in Linux | visible |
| Secrets in env | `/proc`/`environ` | same class | env providers | `set` | both worlds | yes |
| Constrained language | N/A | N/A | CLM / AppLocker/WDAC | N/A | N/A | N/A |

### 3. Unquoted expansion and word splitting

```bash
file=$1
grep -F -- "$pattern" "$file"    # good
# grep $pattern $file            # bad: splitting + globbing
```

Prefer `grep -F` for literal needles. Never pass user filenames to interpreters without `--` and quoting.

Filenames with newlines defeat line-based loops—use `find -print0` / `read -d ''` (chapter 14–15).

### 4. `eval` and dynamic code

`eval` concatenates strings into shell syntax. If any fragment is attacker-controlled, they own the process.

| Instead of | Prefer |
|------------|--------|
| `eval "$cmd"` | arrays: `"${cmd[@]}"` in Bash 3.2+ for simple argv |
| Building scripts from HTTP | verified files on disk + explicit interpreter |
| Dynamic `bash -c` with user bits | validated enums / allowlists |

Bash arrays for argv (Bash; not POSIX `sh`):

```bash
args=(--region "$REGION" --name "$NAME")
mytool "${args[@]}"
```

### 5. `curl | sh` and `irm | iex`

Piping remote content into a shell trusts **transport, CDN, DNS, and the author** at the moment of download.

```bash
# Anti-pattern
curl -fsSL https://example.invalid/install.sh | sh
```

```powershell
# Anti-pattern (community shorthand)
# Invoke-RestMethod ... | Invoke-Expression
```

**Safer pattern:** download, verify checksum/signature against a **pinned** expected value, then run from disk. Prefer OS packages or language package managers with integrity features.

### 6. Secrets: env, argv, logs, history

| Location | Risk | Mitigation |
|----------|------|------------|
| Environment variables | Readable by same-user processes; leaked in dumps | Short-lived env; scrub; prefer files with modes / secret stores |
| Process argv | Visible in `ps` | Pass via stdin, fd, or encrypted agent—not `--password secret` |
| Shell history | Laptop theft / shared homes | Hist controls; never paste tokens into interactive shells |
| CI logs | `set -x`, `echo`, verbose curls | Masking + no trace around secrets |
| Temp files | World-readable umask | `mktemp`, mode `0600`, traps |

PowerShell: `ConvertFrom-SecureString` patterns and SecretManagement modules exist—use **current** Microsoft docs; do not invent crypto wrappers.

### 7. Constrained Language Mode (literacy)

On Windows, **Constrained Language Mode** (often via application control policies) restricts PowerShell language features usable in locked-down sessions.

Staff literacy:

- Know that full-language scripts may **fail** under CLM  
- Prefer approved cmdlets and avoid dynamic code (`iex`, Add-Type abuse patterns) in enterprise-locked estates  
- Test under the policy your fleet actually uses—not only on open developer laptops  

Exact allowlists are environment-specific; consult Microsoft Learn for Constrained Language and application control—do not assume a single global matrix.

### 8. Trust boundaries checklist (mental model)

1. Who controls each argument and file content?  
2. Does data cross from web/ticket/user → shell syntax?  
3. Does the script run elevated?  
4. Are secrets present in argv/env/logs?  
5. Is remote code execution an intentional feature (`eval`/`iex`)?  

### 9. Engagement recon: interpreters and `/bin/sh` (literacy)

On assessments and brownfield reviews, **name the interpreter before you name the bug class**. Shell injection advice that assumes Bash 5 on Ubuntu is wrong on Alpine ash, wrong on macOS stock Bash 3.2, and wrong on PowerShell 5.1.

| Recon question | Why it changes findings |
|----------------|-------------------------|
| What is `bash --version` / `$PSVersionTable` / `zsh --version` on the target class? | Feature availability, quoting lore age, and which “modern” mitigations even exist |
| What does `ls -l /bin/sh` resolve to? | dash vs Bash-as-sh vs BusyBox—Bashism-based payloads and portability claims diverge (chapter **02**, depth in **20**) |
| Is automation invoked via shebang, `bash script.sh`, scheduled task, or interactive paste? | Persistence and injection land differently |
| macOS era of the host? | Bash vs zsh rc files for interactive persistence (below); stock `/bin/bash` still 3.2 |
| Is Windows PowerShell **2.0 / 5.1 / 7** in play? | 2.0 = legacy estate signal; 5.1 vs 7 changes modules and cross-OS reach (chapter **02**) |

Staff habit: open every shell-heavy finding with one line—“Interpreter: …; `/bin/sh`: …”—so AppSec and ops argue about the same host.

### 10. Legacy risk surfaces (still literacy, not an exploit kit)

Decade-old glue fails closed less often than modern templates. Reviewers should expect:

| Surface | Why it is risky | Review instinct |
|---------|-----------------|-----------------|
| **Old Bash on appliances / golden images** | Unmaintained userland; scripts from an era before `set -u`, arrays-for-argv, and ShellCheck gates | Inventory Bash major; treat “works” as unproven on dash/BusyBox |
| **Unquoted expansion in old scripts** | `$FILE`, `rm -rf $DIR`, `ssh host $CMD` from copy-paste culture | Same injection class as today—often denser in legacy trees |
| **`curl \| bash` / `wget \| sh` installers** | Trust CDN+DNS+author at fetch time; common in “quickstart” READMEs from prior decades | Demand pin+verify-on-disk or OS packages; flag as supply chain in pentest reports |
| **Interactive-only fixes** | “We aliased that away in `.bashrc`” never protected CI or MDM | Require non-interactive reproduction |

Do not turn this chapter into payload recipes. Do turn every legacy tree into a **quoting + trust + interpreter pin** review.

---

## 2. Advanced concepts

### 1. Injection beyond `$var`

- Finding: `-exec` with unsanitized args  
- `ssh` remote commands built from strings  
- `find … -name $user` with metacharacters  
- SQL/HTTP still matter when shell glues them—escape at the right layer  

### 2. PowerShell-specific pitfalls

| Pattern | Issue |
|---------|-------|
| `Invoke-Expression` | Code injection |
| `Invoke-Command` with crafted scriptblocks from strings | Same class if built from untrusted text |
| Expanding into `powershell -Command "…$x…"` | Nested quoting hell → injection |
| Download cradles | Supply chain + AV/EDR noise; still a trust problem |

Prefer `pwsh -File script.ps1 -Param value` with bound parameters.

### 3. `set -u` is not a security boundary

Nounset catches bugs; it does not stop injection of metacharacters inside set variables. Quoting and allowlists still required.

### 4. Sudo and setuid scripts

Shell scripts as setuid are a historical footgun. Prefer least privilege, `sudoers` with explicit argv, or compiled helpers. Never combine setuid with `eval` or unquoted env.

### 5. Temporary privilege and WSL

WSL bridges Windows and Linux identities. Secrets copied into `/mnt/c` may have different ACL semantics. Keep secret material on the side that owns the trust policy.

### 6. Version notes

| Edition | Security-relevant note |
|---------|------------------------|
| Bash 3.2 vs 5 | Prefer arrays for argv; still quote everything |
| PS 5.1 | Older hosts; execution policy ≠ security boundary |
| PS 7 | Cross-platform; still subject to CLM on Windows when policy says so |
| BusyBox | Smaller tools ≠ safer scripts |

**Execution Policy** in PowerShell is not a security boundary against a determined user—it is a safety interlock. Real control is signing + application allowlisting + CLM as designed by platform security.

### 7. CI supply chain

- Third-party actions that run `bash -c` with unpinned scripts  
- World-writable workspaces on self-hosted runners  
- Logging secrets from `env:` dumps  

Pin actions by commit SHA per your org standard; treat install scripts like production code review.

### 8. Multi-tenant and shared agents

Shared build agents: any job can often read env of poorly isolated siblings. Assume compromise → rotate secrets; prefer OIDC short-lived tokens over long-lived PATs in env.

### 9. Logging redaction

Central log pipelines should redact token shapes. Scripts must still avoid emitting secrets—defense in depth.

### 10. Safe “dynamic” configuration

Allowlist enums:

```bash
case "$ENV_NAME" in
  dev|stage|prod) ;;
  *) echo "invalid ENV_NAME" >&2; exit 2 ;;
esac
```

Do not map free-form user strings to file paths without resolving under a fixed root and rejecting `..`.

### 11. cmd injection leftovers

`& \| <>` in batch make untrusted input lethal (chapter 13). Reject new batch that interpolates web input.

### 12. Defense patterns that scale

1. No `eval`/`iex` in production paths  
2. Quoting + `--` + literal matchers  
3. Parameterization / arrays  
4. Verification before execute for remote bits  
5. Secret stores + masking  
6. Least privilege + policy (CLM/WDAC where applicable)  

### 13. Dangerous vs safer expansions (cheatsheet)

| Pattern | Risk | Prefer |
|---------|------|--------|
| `rm -rf $dir` | empty/split | `rm -rf -- "${dir:?}/"` |
| `ssh host $cmd` | remote injection | allowlisted remote scripts; separate argv |
| `find . -name $pat` | metacharacters | `-name` with validated literal / `-path` carefully |
| `bash -c "…$x…"` | syntax injection | functions + `"$x"` as data argv |
| `iex $download` | RCE | file + signature + `-File` |
| `powershell -Command "…$u…"` | nested quotes | `-File` + `param()` |

### 14. Secure tempfile habits

```bash
umask 077
tmp="$(mktemp)" || exit 1
chmod 600 "$tmp"
# write secret material
# use it
rm -f -- "$tmp"
```

World-readable `/tmp` files with tokens are a classic multi-user host failure. On Windows, prefer user temp via .NET/`$env:TEMP` with restrictive ACLs when handling secrets—and still minimize disk lifetime.

### 15. ChatOps and webhook → shell

Any path from chat/webhook payload into a shell is a trust boundary. Parse into typed fields in a safer language when possible; if shell must run, map to allowlisted operations only (deploy env X, restart service Y)—never free-form command strings.

### 16. Supply-chain for script dependencies

Helper scripts vendored from the internet, `source` of remote raw URLs, and unpinned Git submodules of “useful Bash libs” inherit the same review bar as application dependencies. Prefer modules you own; pin commits; run ShellCheck on vendored copies.

### 17. Double interpretation (YAML → shell)

CI YAML inserts expressions into shell:

```yaml
# Conceptual hazard — values become shell text
run: ./tool.sh ${{ inputs.name }}
```

If `inputs.name` can contain spaces or metacharacters, you inherit injection. Prefer environment variables with proper quoting inside the script, and validate inputs in the workflow expression layer per the CI product’s official guidance.

### 18. Audit questions for privileged scripts

1. What identity does it run as (root, SYSTEM, deploy user)?  
2. Can a low-priv user influence argv, env, cwd, or files it reads?  
3. Does it write to directories on another user’s `PATH`?  
4. Are outputs (logs, artifacts) free of secrets?  

### 19. Persistence and IR: rc files by macOS era; `profile.d` on Linux

Shell **startup files** are both operator convenience and an IR/persistence lens. Literacy only—know *where to look* and *what era implies*.

**macOS interactive era → files to expect:**

| Estate era | Interactive default | Files responders commonly inventory | Scripting note |
|------------|---------------------|--------------------------------------|----------------|
| **Pre-Catalina** | Bash-centric | `~/.bash_profile`, `~/.bashrc`, `/etc/profile`, `/etc/bashrc` | Leftover Bash rc still appears after zsh migration |
| **Catalina+** | zsh default | `~/.zshrc`, `~/.zprofile`, `~/.zshenv`, system zsh files | `$SHELL` may be zsh while cron still calls `/bin/bash` |
| **Long-lived Macs** | Mixed | **Both** Bash and zsh trees | Dual configs confuse “what ran?”—record login shell *and* shebang |

**Linux distro hooks:**

| Location | Role |
|----------|------|
| `/etc/profile`, `~/.bash_profile`, `~/.bashrc` | Login / interactive Bash traditions |
| `/etc/profile.d/*.sh` | Drop-in snippets for login shells—ops loves them; IR must list them |
| systemd/`cron` unit `ExecStart=` | Often **non-interactive**—bypasses user rc entirely |

Staff rule for investigations: classify the launch as **interactive login**, **interactive non-login**, **non-interactive script**, or **scheduled/service**. Only then interpret which rc files could have mattered.

### 20. Living-off-the-land contrast (Bash / PowerShell / cmd)

Attackers and emergency admins alike use **built-in interpreters**. Defenders need contrast literacy—not a cookbook:

| Lens | Bash / POSIX `sh` | PowerShell | cmd / batch |
|------|-------------------|------------|-------------|
| Native on | Linux/macOS agents, containers (when present) | Windows (5.1); 7 via install | Windows always |
| Common LOL feel | Pipes, `curl`, `ssh`, cron, `bash -c` | cmdlets, remoting, `iex` culture historically | `.bat` launchers, `cmd /c` nesting |
| Logging / IR | History files, auditd/`execve` where configured | Script block logging / transcription *when enabled* | Weaker narrative; still process cmdline |
| Review focus | Quoting, `eval`, shebang pin | `Invoke-Expression`, CLM, execution policy myths | Metacharacters `& \| <>`, delayed expansion |

Whole-engineering takeaway: **detect and review the dialect that the estate actually runs**. A Bash-hardened Linux fleet can still lose through a forgotten `powershell -Command` bridge on a jump host—and the reverse.

### 21. AppSec / DevSecOps / pentest checklist rows (shell surfaces)

Add these rows to security review templates (pair with the staff checklist in §3):

| Role lens | Row |
|-----------|-----|
| **AppSec** | Entrypoints that build shell from HTTP/queue/ticket input—allowlist or reject |
| **AppSec** | Install/bootstrap docs: no unverified `curl \| bash`; checksums pinned |
| **DevSecOps** | CI `run:` YAML→shell interpolation validated; secrets masked; no debug around tokens |
| **DevSecOps** | Self-hosted runners: who can write scripts that become root/`SYSTEM` glue? |
| **Pentest / adversary sim** | Interpreter versions and `/bin/sh` provider recorded per host class before reporting “injection” |
| **Pentest** | Legacy trees scanned for unquoted `rm`/`ssh`/`eval` density—not only new PRs |
| **Pentest / IR** | macOS era → Bash vs zsh rc inventory; Linux `/etc/profile.d` listed for persistence hypotheses |
| **All** | Living-off-the-land paths named (Bash vs `pwsh` vs cmd) for the OS under test |

---

## 3. Applications and use cases

### Code review (SE)

Reject PRs with `curl | sh`, unquoted `rm -rf $var`, or `Invoke-Expression` on non-constant strings. Demand allowlists for environment names and regions. Treat new `bash -c` with concatenation as requiring a security second look.

### DevOps / CI

Mask secrets; prefer OIDC; never echo tokens; disable debug traces on secret steps. Review composite actions for nested shells. Pin third-party actions by commit SHA per org policy.

### Security / DevSecOps

Threat-model shell glue on trust boundaries (webhooks → shell, chatops → shell). Add detection for download cradles where EDR supports it. Sample CI logs for accidental secret emission after enabling new verbose flags. On engagements, open with interpreter + `/bin/sh` recon (§1.9) before arguing payload classes.

### Pentest and legacy estate review

- Prefer **findings density** on unquoted expansion, `eval`/`iex`, and unverified pipe-to-shell over novel one-liners.
- Call out PowerShell **2.0** / ancient Bash majors as **estate risk** (unsupported platform correlates), not as a request to “upgrade syntax only.”
- Document macOS **era** when reporting interactive persistence hypotheses (Bash vs zsh rc).
- Contrast LOL dialects present on the box (Bash/`sh`, `pwsh`/`powershell`, cmd) so blue teams know which logging controls matter.

### Ops break-glass

Emergency scripts still obey quoting. Break-glass credentials go through vaults with TTL—not chat paste into history. Record who ran which script; prefer ticketed wrappers over ad-hoc root shells when possible.

### Application installers

Ship signatures and checksums. Avoid requiring customers to pipe vendor URLs into shells without verification instructions. Provide OS-specific packages as the primary path; scripts as advanced/debug only.

### Platform templates

Org-wide workflow templates should not include floating installers. Provide a approved “download + verify + run” helper maintained by platform security.

### Whole-engineering OS companion

Windows command and PowerShell security context: [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md).

### Staff-level review checklist

- No `eval` / `Invoke-Expression` on untrusted or remotely fetched strings.
- All expansions that form command words are quoted; arrays used for argv where Bash.
- No `curl | sh` / `irm | iex` without pin+verify-on-disk exception signed by security.
- Secrets not passed on argv; not logged; not left in world-readable temps.
- CI masking enabled; `set -x` kept off around secret regions.
- Paths from users constrained (root jail / resolve / reject `..`).
- PowerShell Execution Policy not mistaken for a security boundary.
- CLM / application control tested for locked-down Windows fleets when claimed supported.
- Self-hosted runners and multi-tenant agents reviewed for secret isolation.
- Batch/cmd interpolations banned for untrusted input.
- Webhook/chatops paths allowlist operations—no free-form shell strings.
- YAML→shell interpolations quoted/validated.
- Privileged scripts audited for cwd/`PATH`/output leakage.
- Engagement notes record interpreter versions and `/bin/sh` provider for each OS class under test.
- Legacy script trees reviewed for unquoted expansion and `curl \| sh` installers—not only greenfield PRs.
- macOS hosts: Bash **and** zsh rc paths considered per era; Linux: `/etc/profile.d` inventoried when persistence is in scope.
- LOL contrast (Bash vs PowerShell vs cmd) named for the estate—controls and logging matched to dialect.
- AppSec templates include shell-from-input and bootstrap/install trust rows (see §2.21).

---

## References

- [GNU Bash manual — Quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html)
- [POSIX Shell Command Language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [PowerShell Security features / Scripting security](https://learn.microsoft.com/en-us/powershell/scripting/security/overview)
- [about_PowerShell_Config / execution policy topics](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [Constrained Language Mode](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_modes)
- [Invoke-Expression](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-expression)
- [SecretManagement module docs](https://learn.microsoft.com/en-us/powershell/utility-modules/secretmanagement/overview)
- [ShellCheck](https://www.shellcheck.net/)
- [WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
