# VBA and VBScript

[← Back to Languages](../README.md)

**VBA** (Visual Basic for Applications) is the automation language **inside Microsoft Office** applications—especially Excel and Word on Windows, with literacy for Outlook, PowerPoint, and Access. You write procedures that drive the host’s **object model**: workbooks, ranges, documents, mail items. Code usually lives in a document, template, or add-in and runs when a user (or event) starts a macro.

**VBScript** is a related, lighter scripting dialect historically used with **Windows Script Host** (`.vbs` files via `wscript` / `cscript`). It remains important for **brownfield** and incident response, but it is **deprecated** on modern Windows—treat it as literacy plus a migrate-to-PowerShell story, not a greenfield default.

This track teaches **language + Visual Basic Editor + host object-model literacy + file/Automation surfaces + macro security/defense literacy**. It is **not** a full Excel modeling course, an Access database design book, an Office Scripts/TypeScript curriculum, or a malware-construction guide. Chapter **18** is the **compass** for those doors.

Staff hire VBA fluency for four practical pillars:

1. **Language honesty** — `Option Explicit`, procedures, Variants, `On Error` / `Err` (chapters **02–06**).
2. **Host and Automation surface** — what Excel/Word (and `CreateObject` / `Shell`) can actually touch (chapters **07–09**, **11–13**).
3. **File and environment I/O** — FileSystemObject, classic file I/O, `Environ` (chapter **11**).
4. **Security and defense** — Mark of the Web, macro policies, Trusted Locations, ASR, AMSI, safe reading of hostile samples (chapters **15–16**).

**New to VBA?** Start at chapter **01** (what it is), then **00** (touch the VBE and a hello macro), then **02** onward.

---

## After this track — what you can write

| You can write / do… | What “done” looks like | Spine chapters |
|---------------------|------------------------|----------------|
| A **signed, reviewed Excel/Word macro** for a known business task | `Option Explicit`, clear errors, no casual `Shell`/`CreateObject` | **02–08**, **15** |
| A **small cross-app Automation** helper | Early/late binding understood; objects released | **07–09** |
| A **file/config helper** inside Office | FSO or controlled paths; no secret-in-code | **11**, **15** |
| A **policy/review conversation** about macros | MotW, Trusted Locations, ASR named correctly | **15** |
| **Read a suspicious macro safely** | Static habits; no “enable all macros” on the analyst laptop | **16** |
| **Read legacy `.vbs`** | WSH objects recognized; migration path named | **14** |

---

## What to learn next (complement paths)

| If your goal is… | Learn next (official home) | Bring from this track |
|------------------|----------------------------|------------------------|
| Cloud/cross-platform Excel automation | [Office Scripts](https://learn.microsoft.com/en-us/office/dev/scripts/overview/excel) | Object-model thinking; security posture |
| Modern Office extensibility | [Office Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins) | Host boundaries; least privilege |
| RPA / desktop flows | [Power Automate](https://learn.microsoft.com/en-us/power-automate/) | When *not* to put logic in macros |
| Replace VBScript automation | [PowerShell](https://learn.microsoft.com/en-us/powershell/) | WSH literacy from **14** |
| Stronger typed Windows apps | [Visual Basic .NET](https://learn.microsoft.com/en-us/dotnet/visual-basic/) | Syntax familiarity—not the same runtime |
| Typed web/Node tooling | [TypeScript](../TypeScript/README.md) track | Different world; Office Scripts is TS-flavored |

**Suggested order for a defender/analyst:** this track through **15–16** → Defender ASR/AMSI docs → org macro policy.  
**Suggested order for an Excel automator:** **00–08** → official Excel VBA concepts → Office Scripts door when cloud matters.

---

## Versions and brownfield (default narrative)

**Default for new work: VBA in Microsoft 365 Apps on Windows**, with macros governed by current enterprise defaults (internet macros blocked unless policy says otherwise). Pin the Office channel your org actually ships.

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| **Microsoft 365 Apps** VBA (Windows) | New macros / LOB workbooks | Default narrative |
| Office LTSC / perpetual | Long-lived desktops | Literacy; re-check policy names |
| Office for **Mac** VBA | Mac desktops | Literacy; not identical to Windows |
| **VBScript** + WSH | Legacy scripts, IR samples | Brownfield; deprecated—migrate |
| Excel 4.0 (**XLM**) | Malware / ancient sheets | Security literacy only (**15–16**) |

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, platform nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (five ideas)

1. **VBA runs inside a host.** The useful power is the Office **object model**, not “VB syntax” alone.
2. **`Option Explicit` is non-negotiable for staff code.** Typos become silent `Variant` bugs without it.
3. **Variants forgive—and hide bugs.** Prefer declared types; convert at edges.
4. **Automation APIs are a trust boundary.** `CreateObject`, `Shell`, `Declare`, and file I/O are review hotspots—for good macros and for malware.
5. **Security is policy + runtime, not vibes.** MotW, macro notification settings, Trusted Locations, ASR, and AMSI decide what runs.

| Idea | Review smell if missing | Home chapters |
|------|-------------------------|---------------|
| Host-centric | Pure “VB tutorial” with no Application/Range | **01**, **08–09** |
| Option Explicit | Modules without it in LOB code | **02** |
| Variant honesty | Everything `As Variant` “for speed” | **03** |
| Automation surface | Undocumented `Shell` / `WScript.Shell` | **07**, **11**, **15** |
| Policy literacy | “Just enable macros” as the fix | **15–16** |

---

## How to read this section

**Absolute beginners:** **01 → 00 → 02 → …**  
If you already open the VBE daily: **00 → 02…**, but do **not** skip **05**, **11**, and **15**.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation** | 01 | Explain VBA vs VBScript vs VB.NET; where code lives |
| **Doorway** | 00 | Open VBE, write hello, run a macro safely |
| **Language core** | 02 → 06 | Modules, types, flow, errors, strings/collections |
| **Automation / hosts** | 07 → 10 | Objects, Excel/Word literacy, UserForms door |
| **I/O / events / API** | 11 → 13 | Files, Shell, events, Declare literacy |
| **VBScript brownfield** | 14 | Read WSH scripts; plan PowerShell migration |
| **Security** | 15 → 16 | Defense controls; safe hostile-sample literacy |
| **Synthesis / compass** | 17 → 18 | Roles, what you can write, adjacent doors |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: VBE, macros, and hello | [00_First_Steps_VBE_Macros_And_Hello.md](./00_First_Steps_VBE_Macros_And_Hello.md) |
| 01 | What VBA is (and is not) | [01_What_Is_VBA_And_Where_It_Lives.md](./01_What_Is_VBA_And_Where_It_Lives.md) |
| 02 | Modules, procedures, Option Explicit, scope | [02_Modules_Procedures_Option_Explicit_And_Scope.md](./02_Modules_Procedures_Option_Explicit_And_Scope.md) |
| 03 | Types, variables, Variants, conversions | [03_Types_Variables_Variants_And_Conversions.md](./03_Types_Variables_Variants_And_Conversions.md) |
| 04 | Control flow and loops | [04_Control_Flow_And_Loops.md](./04_Control_Flow_And_Loops.md) |
| 05 | Errors: On Error, Err, and Resume | [05_Errors_On_Error_Err_And_Resume.md](./05_Errors_On_Error_Err_And_Resume.md) |
| 06 | Strings, dates, collections, Dictionary | [06_Strings_Dates_Collections_And_Dictionary.md](./06_Strings_Dates_Collections_And_Dictionary.md) |
| 07 | Objects, With, CreateObject, GetObject | [07_Objects_With_CreateObject_And_GetObject.md](./07_Objects_With_CreateObject_And_GetObject.md) |
| 08 | Excel object model literacy | [08_Excel_Object_Model_Literacy.md](./08_Excel_Object_Model_Literacy.md) |
| 09 | Word and other Office hosts | [09_Word_And_Other_Office_Hosts.md](./09_Word_And_Other_Office_Hosts.md) |
| 10 | UserForms door | [10_UserForms_And_Microsoft_Forms_Door.md](./10_UserForms_And_Microsoft_Forms_Door.md) |
| 11 | Files, FSO, Environ, and Shell | [11_Files_FSO_Environ_And_Shell.md](./11_Files_FSO_Environ_And_Shell.md) |
| 12 | Events and auto-macros | [12_Events_And_Auto_Macros.md](./12_Events_And_Auto_Macros.md) |
| 13 | Declare and Win32 API literacy | [13_Declare_And_Win32_API_Literacy.md](./13_Declare_And_Win32_API_Literacy.md) |
| 14 | VBScript, WSH, and deprecation | [14_VBScript_WSH_And_Deprecation.md](./14_VBScript_WSH_And_Deprecation.md) |
| 15 | Macro security and enterprise defense | [15_Macro_Security_And_Enterprise_Defense.md](./15_Macro_Security_And_Enterprise_Defense.md) |
| 16 | Reading malicious macros safely | [16_Reading_Malicious_Macros_Safely.md](./16_Reading_Malicious_Macros_Safely.md) |
| 17 | Use cases and engineering perspectives | [17_Use_Cases_And_Engineering_Perspectives.md](./17_Use_Cases_And_Engineering_Perspectives.md) |
| 18 | Where VBA is going and adjacent doors | [18_Where_VBA_Is_Going_And_Adjacent_Doors.md](./18_Where_VBA_Is_Going_And_Adjacent_Doors.md) |

---

## Further reading

- [Office VBA reference](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [VBA language reference](https://learn.microsoft.com/en-us/office/vba/api/overview/language-reference)
- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Attack surface reduction rules](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
- [Office Scripts vs VBA](https://learn.microsoft.com/en-us/office/dev/scripts/resources/vba-differences)
- [VBScript deprecation (Windows)](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features)
