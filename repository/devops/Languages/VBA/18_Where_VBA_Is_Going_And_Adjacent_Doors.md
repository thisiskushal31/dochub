# Where VBA is going and adjacent doors

[← Back to VBA](./README.md)

## What this chapter covers

The **compass** for this track: what **00–17** already make you fluent in, which topics this handbook **owns** versus **directs elsewhere**, and the adjacent doors—**Office Scripts**, **Office Add-ins**, **Power Automate**, **PowerShell**, **VB.NET**, and **Open XML SDK**—with official Microsoft links. Includes a text **learning-path diagram**, what is **unlikely to change**, and the **VBScript deprecation** reminder (**14**).

You came here for VBA inside Office. You should leave able to **write, review, and govern** macros—and able to say where the next deep topic lives without turning every problem into another `.xlsm`.

---

## 1. Concepts

### 1. What this track already owns

After chapters **00–17** you should be able to:

| You can… | Chapters that built it |
|----------|------------------------|
| Open VBE, run a hello macro safely | **00** |
| Explain VBA vs VBScript vs VB.NET doors | **01**, **14**, this chapter |
| Use modules, `Option Explicit`, scope | **02** |
| Reason about types and Variants | **03** |
| Control flow and loops | **04** |
| Handle `On Error` / `Err` honestly | **05** |
| Work strings, dates, collections | **06** |
| Use objects, `With`, `CreateObject`/`GetObject` | **07** |
| Navigate Excel OM literacy | **08** |
| Touch Word and other hosts carefully | **09** |
| Know the UserForms door | **10** |
| Handle files, FSO, `Environ`, `Shell` risks | **11** |
| Reason about events and auto-macros | **12** |
| Treat `Declare`/Win32 as rare literacy | **13** |
| Read WSH/VBScript; plan PowerShell migration | **14** |
| Name MotW, Trusted Locations, ASR, AMSI | **15** |
| Read hostile macros safely in a lab mindset | **16** |
| Map roles, domains, and wrong-hammer cases | **17** |

Bullseye: **language + VBE + host OM + I/O/Automation surface + security/defense literacy**. Not Excel financial modeling encyclopedia, not TypeScript, not malware engineering.

### 2. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| VBA language + VBE habits | **Yes** | Office VBA language reference |
| Excel/Word OM literacy | **Yes** (**08–09**) | Host API docs under Office VBA |
| Macro security / MotW / Trusted Locations / ASR / AMSI | **Yes** (**15–16**) | Microsoft 365 Apps security + Defender docs |
| VBScript / WSH brownfield | **Yes** (**14**) | Deprecated-features + PowerShell |
| Office Scripts (TypeScript-flavored) | **Door** | Office Scripts docs |
| Office Add-ins | **Door** | Office Add-ins overview |
| Power Automate / RPA-style flows | **Door** | Power Automate docs |
| PowerShell automation | **Door** (**14** bridge) | PowerShell docs |
| VB.NET desktop / stronger typing | **Door** | Visual Basic .NET docs |
| Open XML SDK document generation | **Door** | Open XML SDK / Office file-format docs |
| Full Access DB design | **No** | Access product docs |
| Exploit / lure / bypass recipes | **No** | Forbidden |

### 3. The orientation sentence

> **Same Automation idea, different hosts and trust boundaries.**

Desktop VBA, Office Scripts in the cloud, Add-ins in a web runtime, and Power Automate flows all move Office work along—but they do not share one security story. Your MotW/ASR literacy from **15** does not automatically transfer; re-read the door’s official security model.

### 4. How to use this chapter

Read after **17** (or skim early so you know the bullseye). Revisit when:

- someone proposes “rewrite all macros in X,”
- internet-macro blocking breaks an email distribution habit,
- VBScript FoD / deprecation shows up on image builds,
- cloud Excel users outnumber Windows desktop VBA users.

---

## 2. Advanced concepts

### 1. Adjacent doors (routing table)

#### Office Scripts

| Item | Literacy |
|------|----------|
| What | Cloud-oriented scripting for Excel on the web (TypeScript-flavored), not the VBA runtime |
| Choose when | Cross-platform Excel automation, Microsoft 365 cloud workflows |
| Bring from this track | OM thinking; skepticism toward unbounded trust |
| Official start | Office Scripts overview + VBA differences doc (References) |

#### Office Add-ins

| Item | Literacy |
|------|----------|
| What | Web-tech extensibility across Office hosts |
| Choose when | Modern UX, store/IT-managed deployment, cross-platform |
| Bring from this track | Host boundary awareness; least privilege |
| Official start | Office Add-ins overview |

#### Power Automate

| Item | Literacy |
|------|----------|
| What | Flow-based automation across Microsoft 365 and connectors; desktop flows for RPA-like needs |
| Choose when | Cross-app business process without embedding logic in a workbook |
| Bring from this track | Knowing when VBA is the wrong hammer (**17**) |
| Official start | Power Automate documentation |

#### PowerShell

| Item | Literacy |
|------|----------|
| What | First-line Windows/automation replacement for WSH/VBScript and many out-of-Office tasks |
| Choose when | Ops automation, migration off `.vbs`, scheduled admin work |
| Bring from this track | Chapter **14** object literacy; trust-boundary habits |
| Official start | PowerShell documentation |

#### Visual Basic .NET

| Item | Literacy |
|------|----------|
| What | .NET language with familiar Basic syntax—**not** the VBA runtime |
| Choose when | Real Windows apps, stronger typing, Visual Studio tooling |
| Bring from this track | Syntax familiarity only; relearn framework and security |
| Official start | Visual Basic .NET docs |

#### Open XML SDK

| Item | Literacy |
|------|----------|
| What | Build/edit Office files as structured XML packages without launching Office COM |
| Choose when | Server-side document generation, high-volume file shaping |
| Bring from this track | Document structure intuition—not `Range.Select` habits |
| Official start | Open XML / Office file format developer docs on Learn |

### 2. Learning path diagram (text)

```text
                    ┌─ Excel automator ─► 00–08 → 11 → 15 → (Office Scripts / Add-ins)
Begin here (01/00) ─┼─ Defender/IR ─────► 11–14 → 15–16 → ASR/AMSI deep dive
                    ├─ Ops/packager ────► 13–15 → image baselines → PowerShell for .vbs
                    └─ SE estate owner ─► 02–07 → 15 gate → extract to Scripts/Automate/.NET
                                              │
                                              ▼
                                         Chapter 18 doors
```

### 3. Unlikely to change (stable truths)

Hold these even as product names shift:

| Stable idea | Why it survives |
|-------------|-----------------|
| **Host object model is the point** | VBA without Application/Range is the wrong subject |
| **`Option Explicit` culture** | Typos still become silent Variants |
| **Automation APIs are a trust boundary** | `CreateObject` / `Shell` / `Declare` remain review hotspots |
| **Security is policy + runtime** | MotW, macro settings, Trusted Locations, ASR, AMSI—not vibes |
| **VBScript is not the future** | Deprecated path; migrate (**14**) |

### 4. VBScript deprecation (compass reminder)

Do not plan greenfield WSH estates. Inventory, migrate to PowerShell, keep IR literacy. Re-check Windows deprecated-features documentation when pinning OS images.

### 5. What “done” looks like for a staff engineer

You are done with the VBA track when you can:

- Ship or review an OM-first macro under enterprise policy.
- Refuse casual Win32 Declares and unexplained `Shell`.
- Explain MotW / internet macros / Trusted Locations / ASR / AMSI at conversation level (**15**).
- Handle suspicious files without enabling macros on the endpoint of record (**16**).
- Point teammates to Scripts, Add-ins, Automate, PowerShell, VB.NET, or Open XML **by name** instead of improvising a third framework inside Excel.

### 6. Keeping the compass fresh

When you adopt a door:

1. Add it to the team’s architecture README.
2. Link official Learn docs—not random tutorial dumps.
3. Re-run security questions for the new host’s trust model.
4. Retire dual sources of truth (same process in VBA **and** an unmaintained flow).

---

## 3. Applications and use cases

### Application

- Use the door checklist in design reviews: “Is this still desktop VBA, or Scripts/Add-ins?”
- Budget migration off email-distributed `.xlsm` when internet macros stay blocked.

### Systems

- Track Office channel, bitness, VBScript FoD, and macro baselines as one estate story.
- Prefer Open XML or services for server-side document generation instead of automating desktop Excel in a server session.

### Security

- New doors still need allowlisting, DLP, and identity models—revisit **15** analogies carefully.
- Keep **16** habits for any active-content format, not only VBA.

### Operations

- Replace `.vbs` runbooks on a clock (**14**).
- Test LOB macros whenever ASR or macro policy moves audit → block.

### Software engineering

- Teach newcomers the bullseye table before any Declare folklore.
- Extract logic early when tests and CI matter more than cell binding.

### Cross-track engineering

- Combine intentionally: OM macro for interactive desktop residue, Power Automate for cross-SaaS, PowerShell for OS, Scripts for cloud Excel.
- Avoid duplicate ownership of one business process in three tools with no source of truth.

---

## Staff-level review checklist

- Team agrees a change stays in-bullseye or explicitly opens a named door (Scripts, Add-ins, Automate, PowerShell, VB.NET, Open XML).
- VBA pin/channel/bitness stated and matched to Declares and baselines (**13**, **15**).
- Security posture rechecked for MotW, Trusted Locations, ASR, AMSI when distribution changes.
- VBScript usage is debt with a PowerShell target—not expanded (**14**).
- Wrong-hammer cases from **17** considered before adding macro surface.
- Docs point at official Microsoft Learn hubs—not third-party tutorial sprawl.
- Compass/README updated when a door becomes a real dependency.
- No attempt to make this PR a full TypeScript, .NET, or RPA textbook.
- Hostile-content handling still follows **16** if samples are involved.
- Owner can name the next official index after merge.

---

## References

- [Office VBA API overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Office Scripts vs VBA](https://learn.microsoft.com/en-us/office/dev/scripts/resources/vba-differences)
- [Office Scripts overview](https://learn.microsoft.com/en-us/office/dev/scripts/overview/excel)
- [Office Add-ins overview](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)
- [Power Automate documentation](https://learn.microsoft.com/en-us/power-automate/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Visual Basic .NET documentation](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [Windows deprecated features](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
- [How AMSI helps](https://learn.microsoft.com/en-us/windows/win32/amsi/how-amsi-helps)
