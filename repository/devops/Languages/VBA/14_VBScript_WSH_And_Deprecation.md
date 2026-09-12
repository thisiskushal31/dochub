# VBScript, WSH, and deprecation

[← Back to VBA](./README.md)

## What this chapter covers

**VBScript** literacy for brownfield and incident response: how it differs from **VBA**, how **Windows Script Host (WSH)** runs `.vbs` via **`wscript`** / **`cscript`**, the core COM objects (**`WScript`**, **`WScript.Shell`**, **`FileSystemObject`**), and the **deprecation** / Feature on Demand path on modern Windows. Migration default: **PowerShell**. Historical doors (classic ASP, IE scripting) are named only so you recognize them—not so you build on them.

Pair with **07** (`CreateObject`), **11** (FSO / `Shell` from VBA), and **15–16** (defense and safe reading). This chapter is **not** a greenfield VBScript course.

---

## 1. Concepts

### 1. VBA vs VBScript (one table)

| Dimension | VBA | VBScript |
|-----------|-----|----------|
| Host | Office applications (Excel, Word, …) | WSH, classic ASP, legacy IE (historical) |
| Typical file | Inside `.xlsm` / `.docm` / add-in | `.vbs` (sometimes `.vbe`) |
| Types | Richer typing available; `Option Explicit` culture | Variants everywhere; looser |
| Object model | Host OM is the point | COM Automation via `CreateObject` |
| Staff default for new work | Microsoft 365 Apps VBA when Office-bound | **No**—migrate to PowerShell |

Shared DNA: Basic-like syntax, late-bound COM, easy `CreateObject`. Different jobs and different futures.

### 2. Windows Script Host runners

| Host | Typical use |
|------|-------------|
| **`wscript.exe`** | Windowed / UI-oriented script host (dialogs, less console focus) |
| **`cscript.exe`** | Console host—preferred for logs, CI-like automation, `echo` style output |

Staff habit: when reading runbooks or IR notes, note **which** host launched the script; behavior and output channels differ.

```text
cscript //nologo C:\Scripts\report.vbs
wscript C:\Scripts\notify.vbs
```

### 3. Core objects you must recognize

| Object | Obtained how | Literacy job |
|--------|--------------|--------------|
| **`WScript`** | Intrinsic in WSH | Arguments, Echo, Quit, Sleep, Std\* streams, script name/path |
| **`WScript.Shell`** (`WshShell`) | `CreateObject("WScript.Shell")` | Env expand, `Run` / `Exec`, special folders, legacy registry helpers, shortcuts |
| **`WScript.Network`** (`WshNetwork`) | `CreateObject("WScript.Network")` | User/computer/domain identity literacy; drive/printer mapping in brownfield |
| **`Scripting.FileSystemObject`** | `CreateObject("Scripting.FileSystemObject")` | Files/folders/text streams |

#### `WScript` members staff actually meet

| Member | Role |
|--------|------|
| `Arguments` | Command-line args collection (`WScript.Arguments`, `.Count`, index / named) |
| `Echo` | Output to console (`cscript`) or dialog (`wscript`) |
| `Sleep` | Pause in milliseconds |
| `Quit` | Exit with optional code |
| `StdOut` / `StdIn` / `StdErr` | Standard streams—**meaningful under `cscript`**; not a console pipe under `wscript` |

```vb
' Literacy shape — recognize, do not treat as a modern template
Dim sh, fso, net
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
Set net = CreateObject("WScript.Network")
WScript.Echo "args=" & WScript.Arguments.Count & " user=" & net.UserName
WScript.Sleep 100
WScript.Quit 0
```

In **VBA**, you meet the same COM ProgIDs via `CreateObject` (**07**, **11**). In **VBScript**, they are the primary OS surface because there is no Excel `Range` to hide behind. Deepen Shell/Network only enough to **read** scripts—prefer PowerShell for new work (Concepts §6).

### 4. `CreateObject` as the shared trust boundary

Whether the caller is a macro or a `.vbs` file, **`CreateObject`** loads a COM server into the process trust story. Review smells overlap with VBA:

- `WScript.Shell` + download-or-run patterns in hostile samples (**16**)
- Broad file enumeration via FSO
- Spawning additional script engines or Office apps

Defense chapters cover **what policies block**; this chapter covers **what the objects are**.

### 5. Deprecation — Feature on Demand path

Microsoft documents **VBScript** among **deprecated** Windows features. On recent Windows releases, the practical story is: VBScript moves toward optional / Feature on Demand presence rather than “forever inbox default for new automation.”

Staff implications:

| Implication | Action |
|-------------|--------|
| New automation in VBScript | **Reject** for greenfield |
| Existing `.vbs` estate | Inventory → migrate to PowerShell (or another supported host) |
| IR / malware literacy | Still required—attackers and legacy ops keep shipping `.vbs` |
| Image builds | Know whether VBScript FoD is present; do not assume eternal availability |

Re-check the official Windows deprecated-features documentation when you pin OS images—the exact packaging steps evolve by release.

### 6. Migrate to PowerShell

Default replacement for WSH/VBScript glue:

| VBScript habit | PowerShell direction |
|----------------|----------------------|
| `WScript.Echo` | `Write-Output` / logging frameworks |
| `WScript.Shell.Run` | `Start-Process` with explicit args |
| FSO file loops | `Get-ChildItem`, `Get-Content`, providers |
| Ad-hoc COM | Prefer native cmdlets; COM only when unavoidable |

Bring from this track: recognition of COM ProgIDs and why “just run this `.vbs`” is a trust decision (**15**). Depth lives in the PowerShell docs (References / chapter **18**).

---

## 2. Advanced concepts

### 1. Encoding, obfuscation literacy (defense only)

Incident samples may ship as `.vbe` or heavily string-encoded `.vbs`. Analysts need **recognition** that obfuscation exists; this handbook does **not** teach encoding recipes or evasion. Safe handling belongs in lab workflows analogous to **16**.

### 2. Historical doors — ASP and classic IE

| Door | What it was | Staff posture |
|------|-------------|---------------|
| **Classic ASP** | Server-side VBScript in IIS | Brownfield apps only; not a learning path |
| **IE / legacy web scripting** | Client script era | Historical; do not revive |

Name them so “VBScript” in an old architecture diagram does not surprise you. Do not start new work there.

### 3. Overlap with Office macros

Attack chains and LOB mistakes both blur boundaries:

- Macro calls `CreateObject("WScript.Shell")` (**11**, **15**)
- `.vbs` automates Excel via COM
- Droppers hand off between Office and WSH

Policy and ASR (chapter **15**) address classes of behavior; literacy here is naming the engines.

### 4. Signing, execution policy, and “who can run scripts”

PowerShell migration brings its own controls (execution policy, signing, Constrained Language, AppLocker/WDAC). Do not assume “leave VBScript enabled forever because migration is hard”—track FoD and inventory instead.

### 5. What “done” looks like for this chapter

You can:

- Explain VBA vs VBScript in one minute.
- Read a small `.vbs` and identify WSH / Shell / Network / FSO / Std\* / Arguments usage.
- Say “deprecated—migrate to PowerShell” without hand-waving.
- Hand hostile `.vbs` to the same safe-analysis discipline as macros (**16**).

### 6. WSH object table — review depth (still migrate)

When inventorying brownfield scripts, expand recognition beyond “has a Shell”:

| Surface | What to note in review |
|---------|------------------------|
| `WScript.Shell` (`WshShell`) | `Run`/`Exec`, env expand, special folders—same trust class as VBA `Shell` (**11**) |
| `WScript.Network` (`WshNetwork`) | Identity echoes vs drive/printer mapping—mapping changes are ops-owned |
| `StdOut` / `StdIn` / `StdErr` | Expect `cscript`; dialog-host runs will not behave like a pipe |
| `Sleep` / `Quit` / `Arguments` | Scheduling pauses, exit codes, CLI contracts—map to PowerShell equivalents on migrate |

Deprecation posture stays primary: recognize → inventory → **PowerShell** (or other supported host). Do not grow new WSH surface area.

---

## 3. Applications and use cases

### Application

- Legacy installers and line-of-business launchers still calling `.vbs`—schedule replacement.
- Office solutions that shell out to VBScript: collapse into OM or approved automation (**18**).

### Systems

- Golden images: document whether VBScript FoD is installed; monitor deprecation timelines.
- Prefer `cscript` for anything that should leave console logs during migration.

### Security

- Detection literacy: `.vbs` / `wscript` / `cscript` / `WScript.Shell` as signals—not a construction guide.
- Reduce dual stacks (VBA + VBScript) that complicate ASR and allowlisting (**15**).

### Operations

- Runbook conversion: each `.vbs` gets an owner, a PowerShell successor, and a retirement date.
- Logging: replace `MsgBox`-style WSH UI with auditable transcripts.

### Software engineering

- Treat VBScript as tech debt with tests around behavior, not syntax nostalgia.
- Code review: reject new `.vbs` unless IR/test fixture with explicit waiver.

| Role | Failure that hurts |
|------|--------------------|
| SE | Copy-paste new `.vbs` “because it works” |
| Ops | Silent FoD removal breaks change weekend |
| Security | No inventory of script hosts on endpoints |
| App owner | Undocumented COM automation nobody can migrate |

---

## Staff-level review checklist

- New automation is **not** VBScript unless a time-boxed waiver exists; PowerShell (or other supported host) is the default.
- Existing `.vbs` files have owners, inventory entries, and migration targets.
- Reviewers recognize `WScript`, `WScript.Shell` (`WshShell`), `WScript.Network` (`WshNetwork`), and `FileSystemObject` at a glance.
- `Arguments`, `Sleep`, `Quit`, and `StdOut`/`StdIn`/`StdErr` usage is understood (including `cscript` vs `wscript` stream limits).
- Call sites that use `wscript` vs `cscript` match the intended output channel.
- Overlap with Office `CreateObject("WScript.Shell")` is treated as the same trust boundary (**11**, **15**).
- OS image documentation states VBScript FoD / deprecation posture for the pinned Windows release.
- Hostile or unknown `.vbs` is handled with isolated analysis habits (**16**)—not “open on the analyst laptop and double-click.”
- Classic ASP / IE VBScript appears only as historical context, not as a proposed architecture.
- No obfuscation or evasion techniques are documented as how-to material in team wikis sourced from this chapter.
- References for migration point at official Microsoft PowerShell and deprecated-features hubs.

---

## References

- [Windows deprecated features](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [WScript object](https://learn.microsoft.com/en-us/previous-versions/at5ydy31(v=vs.85))
- [WshShell object](https://learn.microsoft.com/en-us/previous-versions/aew9yb99(v=vs.85))
- [WshNetwork object](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/s6wt333f(v=vs.84))
- [cscript](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cscript)
- [Office VBA API overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
