# PowerShell as a scripting language

[← Back to Shell](./README.md)

## What this chapter covers

PowerShell as a **first-class scripting language** for Windows and cross-platform agents: cmdlets, **object** pipelines, providers, modules, error action preferences, and the practical differences between **Windows PowerShell 5.1** and **PowerShell 7.x** (`pwsh`). This is not a full .NET course—only the scripting surface DevOps and whole-engineering teams need to automate safely beside Bash.

---

## 1. Concepts

### 1. What PowerShell is (and is not)

PowerShell is a command shell **and** a scripting language built around **cmdlets** (command-lets) that usually emit **objects**, not plain text. It is **not** a Bash dialect: quoting, expansion, errors, and composition differ.

| Edition | Binary | Typical host | Handbook default |
|---------|--------|--------------|------------------|
| **PowerShell 7.x** | `pwsh` | Windows, Linux, macOS | **Prefer for new work** |
| **Windows PowerShell 5.1** | `powershell.exe` | Built into Windows | Brownfield / Windows-only modules |

```powershell
$PSVersionTable
$PSVersionTable.PSEdition   # Core (7+) vs Desktop (5.1)
```

### 2. Cmdlets and naming

Cmdlets follow **Verb-Noun** names (`Get-Process`, `Set-Content`, `Invoke-RestMethod`). Discoverability:

```powershell
Get-Command -Verb Get
Get-Help Get-ChildItem -Full
Get-Alias
```

Approved verbs (`Get`, `Set`, `New`, `Remove`, …) keep modules readable. Prefer full cmdlet names in scripts; aliases (`gci`, `%`, `?`) are fine interactively.

### 3. Object pipeline (the core mental model)

In Bash, `ps | grep` moves **text**. In PowerShell, `Get-Process | Where-Object … | Select-Object …` moves **objects** with properties:

```powershell
Get-Process |
  Where-Object { $_.CPU -gt 10 } |
  Select-Object Name, Id, CPU |
  Sort-Object CPU -Descending
```

You usually filter on **properties**, not column positions. When you call native executables, output may become **strings** again—know which side of the fence you are on.

### 4. Providers and paths

Providers expose hierarchical data as drive-like namespaces: filesystem, registry, environment, certificate store (Windows), variables, functions.

```powershell
Get-PSProvider
Set-Location HKLM:\SOFTWARE   # Windows registry provider
Get-ChildItem Env: | Select-Object -First 5
```

Path separators: PowerShell accepts `\` and often `/`; still prefer idioms appropriate to the provider and OS.

### 5. Scripts, parameters, and modules (sketch)

A script is a `.ps1` file. Parameters use `param(…)`. Modules (`.psm1` + manifest) package reusable commands.

```powershell
param(
  [Parameter(Mandatory = $true)]
  [string] $Name
)
Write-Output "Hello, $Name"
```

```powershell
Import-Module Az -ErrorAction Stop   # example module import
Get-Module -ListAvailable
```

Execution policy on Windows can block unsigned local scripts—ops concern; use appropriate policy in CI images and document it (do not “fix” with indiscriminate bypass in production without review).

### 6. Where it exists / does not

| Surface | Windows 5.1 | PowerShell 7 (`pwsh`) | Linux / macOS | cmd.exe | Bash |
|---------|-------------|------------------------|---------------|---------|------|
| Object pipeline | Yes | Yes | Yes (7+) | No | Text pipes |
| Registry provider | Yes | Yes on Windows | N/A | Limited `reg` | N/A |
| Cross-OS scripts | Limited | **Yes** | **Yes** | No | Unix |
| Built into Windows | Yes | Install/winget/MSI | Install | Yes | WSL/Git Bash |

---

## 2. Advanced concepts

### 1. Windows PowerShell 5.1 vs PowerShell 7.x

| Topic | Windows PowerShell 5.1 | PowerShell 7.x |
|-------|------------------------|----------------|
| Runtime | .NET Framework | .NET (Core/5+) |
| Platforms | Windows only | Windows, Linux, macOS |
| Binary | `powershell.exe` | `pwsh` |
| New language features | Baseline | Ternary, null-coalescing, pipeline chain operators, … (version-gated) |
| Modules | Some Windows-only | Prefer modules that support Core; check compatibility |
| Default encoding / BOM habits | Legacy pitfalls | Improved defaults—still test file IO |
| Remoting / Jobs | Mature Windows story | Cross-platform with differences |

Brownfield: enterprise GPO images may only guarantee 5.1. New cross-OS automation should target **7.x** and fail fast if `$PSVersionTable.PSVersion.Major -lt 7`.

### 2. Error action and terminating vs non-terminating errors

PowerShell distinguishes errors that terminate execution from those that write to the error stream and continue.

| Mechanism | Role |
|-----------|------|
| `-ErrorAction` / `$ErrorActionPreference` | Per-command or session preference (`Stop`, `Continue`, `SilentlyContinue`, …) |
| `try` / `catch` / `finally` | Catch **terminating** errors |
| `-ErrorVariable` | Capture error records |
| `$Error` | Automatic history of errors |

```powershell
$ErrorActionPreference = 'Stop'
try {
  Get-Content -Path ./missing.txt
} catch {
  Write-Error "failed: $($_.Exception.Message)"
  exit 1
}
```

Native executables set `$LASTEXITCODE`; check it explicitly—do not assume a failed `git` becomes a terminating PowerShell error.

### 3. Pipeline vs redirection

Redirection operators (`>`, `>>`, `2>`, `*>`) manage **streams** (success, error, warning, verbose, debug, information). This differs from Bash FD numbers even when symbols look familiar.

```powershell
Get-ChildItem *> all-streams.log
Get-ChildItem 2> errors.log
```

Prefer object pipelines for PowerShell-native data; redirect when interfacing with files or native tools.

### 4. Modules and discovery

```powershell
Find-Module -Name PSScriptAnalyzer   # from PSGallery when configured
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser
Import-Module PSScriptAnalyzer
```

Pin module versions in automation. Treat PSGallery like any package feed: trust, pinning, and vulnerability review matter (chapter 18 themes).

### 5. Remoting and agents (awareness only)

PowerShell remoting, WinRM, and SSH remoting in 7.x appear in ops designs. This handbook chapter stops at language literacy; treat remoting endpoints as security boundaries (authn, authz, logging).

### 6. Interop with Bash and cmd

| Direction | Pattern |
|-----------|---------|
| PS → native Unix in WSL | `wsl.exe -- …` |
| PS → cmd builtin | `cmd /c …` sparingly |
| PS → Bash on Windows | Git Bash / WSL paths; watch encoding |
| Bash CI → Windows host | Prefer `pwsh -File script.ps1` |

Avoid rewriting everything into one language on mixed estates; use a thin dispatcher.

### 7. What this chapter deliberately skips

Deep .NET type system, C# interop design, custom binary modules, and GUI hosting. You can call .NET types from PowerShell when needed; staff should not require C# expertise to review ordinary ops scripts.

### 8. Splatting and structured parameters

Splatting passes a hashtable of parameters cleanly—prefer it over building giant command strings:

```powershell
$params = @{
  Path        = './out'
  Recurse     = $true
  Filter      = '*.log'
  ErrorAction = 'Stop'
}
Get-ChildItem @params
```

### 9. Output streams for humans vs machines

`Write-Host` writes to the information stream for host display and is awkward to capture. Prefer `Write-Output` / pipeline output for data, `Write-Verbose` / `Write-Warning` for diagnostics. Automation that must be scraped should emit objects or JSON:

```powershell
Get-Service |
  Select-Object Name, Status |
  ConvertTo-Json -Compress
```

### 10. Strict mode

```powershell
Set-StrictMode -Version Latest
```

Strict mode catches uninitialized variables and some invalid references—use it in shared modules after fixing latent issues. Pair with `$ErrorActionPreference = 'Stop'` in entrypoint scripts.

### 11. Profiles are not production

`$PROFILE` scripts customize interactive sessions. CI and services should use `-NoProfile` unless a deliberate shared profile is part of the hardened image. Profile-dependent automation is the PowerShell cousin of relying on `.zshrc`.

---

## 3. Applications and use cases

### Windows server and workstation automation

Inventory, service control, registry/configuration, certificate stores, and Active Directory modules are natural PowerShell territory—especially when objects beat text scraping.

### Cross-platform CI

Use `pwsh` on Windows, Linux, and macOS agents for one script family when the task is naturally object-oriented (JSON APIs, structured configs). Keep Bash for GNU/POSIX userland-heavy Linux tasks.

### Cloud CLIs

Many cloud modules and CLIs integrate cleanly with PowerShell objects (`ConvertFrom-Json`, pipeline filters). Still check exit codes for native CLIs.

### Security / cybersecurity

Prefer parameterized cmdlets over string-built commands. Treat `Invoke-Expression` and unconstrained remoting as high risk. Secret handling: avoid printing credentials; use secret stores / pipeline-safe secure strings carefully (know OS limitations of “secure” strings).

### Software engineering

- `param` blocks and comment-based help for public scripts
- PSScriptAnalyzer in CI (chapter 17)
- Explicit `$ErrorActionPreference = 'Stop'` in automation entrypoints
- Version gates for 5.1 vs 7

### Ops

Scheduled tasks and services should call `pwsh -File` with absolute paths and pinned editions. Document 5.1-only dependencies.

Example task registration mindset (illustrative):

- Absolute path to `pwsh.exe`
- `-NoLogo -NoProfile -NonInteractive -File C:\automation\job.ps1`
- Separate service account with least privilege
- Transcript or structured logging to a secured directory

### Identity and cloud operations

Graph/Azure/AWS modules are common. Pin major versions; treat breaking module upgrades like application dependency bumps. Never embed client secrets in `.ps1` files—use the platform secret store or CI secret injection.

### Incident response on Windows

Object pipelines shine when filtering event logs and process lists quickly. Keep a vetted “break glass” module signed and hashed; avoid ad-hoc `Invoke-Expression` from chat threads during incidents.

### OS companion

Windows command landscape: [`../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md`](../../Operating-Systems/Windows/1_Windows_Commands_And_PowerShell.md).

### Staff-level review checklist

- Edition declared: **5.1** vs **7.x** (`pwsh`)?
- Scripts use cmdlet+object pipelines on purpose—not unnecessary text parsing?
- `$ErrorActionPreference` / `-ErrorAction` intentional; `try/catch` around critical sections?
- Native tool exit codes checked via `$LASTEXITCODE` where needed?
- Modules pinned; no silent `Install-Module` from untrusted sources in prod?
- Aliases avoided in committed scripts?
- `Invoke-Expression` absent unless extraordinarily justified?
- Execution policy and signing story documented for Windows hosts?

---

## References

- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [PowerShell 7.x overview](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-7)
- [Differences between Windows PowerShell 5.1 and PowerShell 7.x](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell)
- [about_Pipelines](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines)
- [about_Providers](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_providers)
- [about_Modules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules)
- [about_Preference_Variables](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)
- [Windows commands](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)
