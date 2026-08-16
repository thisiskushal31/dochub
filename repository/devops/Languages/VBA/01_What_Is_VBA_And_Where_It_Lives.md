# What VBA is and where it lives

[← Back to VBA](./README.md)

## What this chapter covers

If you are **new to VBA**, start here—even before you memorize syntax. This chapter answers the questions that make every later lab click:

1. **What** VBA is (in plain language).
2. **Where** it lives—hosts, documents, templates, add-ins.
3. **Macros vs add-ins** as delivery shapes.
4. **Doors** to related worlds: VBScript, VB.NET, Office Scripts (and why they are not interchangeable).
5. **Windows vs Mac** literacy without pretending they are identical.
6. **Why teams still use it**—and the **security reality** without fear-mongering.

Chapter **00** is the hands-on smoke check (VBE, hello, `.xlsm`). This chapter is the **map of the territory**. After this, chapter **02** drills modules, procedures, and `Option Explicit`.

Handbook default for *new* work: **Microsoft 365 Apps VBA on Windows**.

---

## 1. Concepts

### 1. What VBA is (plain language)

**VBA** means **Visual Basic for Applications**. It is a programming language **hosted inside Microsoft Office applications**. You write procedures that call the host’s **object model**—workbooks, ranges, documents, paragraphs, mail items—and the host runs that code when a macro, button, or event starts it.

Hold this picture:

> Office document / add-in → VBA project → procedures → host object model → cells, files, UI

At runtime there is no separate “VBA.exe” you launch for Excel work. There is **Excel** (or Word, Outlook, …) with a VBA project loaded, subject to **macro security policy**.

```vb
Option Explicit

Sub SayHost()
    MsgBox Application.Name
End Sub
```

You do not need the full object-model map yet. Hold: **VBA is automation *inside* Office, powered by the host’s objects.**

### 2. What you can do with VBA

| You can… | Typical shape |
|----------|----------------|
| **Automate Excel** | Format, transform ranges, build reports, refresh known workflows |
| **Automate Word** | Assemble documents from templates, mail-merge-adjacent tasks |
| **Glue Office apps** | Automation across Excel/Word/Outlook (chapter **07**, **09**) |
| **Ship internal tools** | Macro-enabled templates, signed add-ins, controlled Trusted Locations |
| **Respond to events** | Workbook open, sheet change, document events (chapter **12**) |

What VBA is *usually not* hired to do today:

| Not the usual VBA job | Better mental model |
|-----------------------|---------------------|
| Cross-platform cloud-first Excel logic for every client | **Office Scripts** / web add-ins (chapter **18**) |
| Greenfield Windows desktop product | **VB.NET** / C# / other app stacks |
| General OS scripting on modern Windows | **PowerShell** (VBScript is brownfield—chapter **14**) |
| “Bypass security so the macro always runs” | Policy and architecture problem—not a language feature |

Staff reality: you often **inherit** critical Excel/Word automation. The job is to **read, harden, review, and sometimes migrate**—not to pretend VBA never existed.

### 3. Where it lives (hosts and containers)

**Hosts.** Common VBA hosts in this track’s narrative:

| Host | Code “lives” in… |
|------|-------------------|
| **Excel** | Workbooks (`.xlsm`), templates (`.xltm`), Excel add-ins (`.xlam`) |
| **Word** | Documents (`.docm`), templates (`.dotm`) |
| **Outlook / PowerPoint / Access** | Host-specific projects and add-in shapes (literacy doors in **09**) |

**Two ways VBA “lives” on a machine:**

1. **Document- or template-bound** — the project travels with the file users open.
2. **Add-in-bound** — loaded for the application session; shared across documents.

Wrong mental model: “VBA is installed globally like Python.” Right model: **each project is a guest of a host process**, gated by trust settings.

### 4. Macros vs add-ins (delivery shapes)

| Shape | What users experience | Review focus |
|-------|----------------------|--------------|
| **Macro in a workbook/doc** | Open file → maybe enable → run | File distribution, MotW, signing |
| **Template with macros** | New files inherit behavior | Template provenance and updates |
| **Add-in** (e.g. `.xlam`) | Features appear across workbooks | Install path, versioning, trust |

“Macro” in casual speech often means *any VBA entry point*. In design conversations, separate **where the code is stored** from **how the user starts it**.

### 5. Why teams still use it

Honest reasons—none of which require nostalgia:

- **Object-model fit.** Deep Excel/Word automation is still fastest in-host for many LOB tasks.
- **User adjacency.** Business owners already live in the workbook; a reviewed macro can beat a six-month app project.
- **Brownfield mass.** Decades of process logic sit in `.xlsm` trees; rewriting everything is rarely the first move.
- **Offline / desktop constraints.** Some regulated or air-gapped desks still center Microsoft 365 desktop apps.

The complementary truth: **new cross-platform or cloud-first work** should evaluate Office Scripts, Office Add-ins, Power Automate, or a real service—chapter **18** is the compass.

---

## 2. Advanced concepts

### 1. VBA vs VBScript vs VB.NET vs Office Scripts

These names rhyme. The runtimes do not.

| Technology | Where it runs | Staff takeaway |
|------------|---------------|----------------|
| **VBA** | Inside Office hosts | This track’s spine |
| **VBScript** | Historically WSH (`.vbs`), ASP classic, etc. | **Deprecated** on modern Windows; literacy + migrate (chapter **14**) |
| **VB.NET** | .NET runtime | Similar *syntax flavor*, different platform, libraries, deployment |
| **Office Scripts** | Excel on the web / curated desktop paths; TypeScript-flavored | Cloud automation door—not a VBA dialect |

Do not “port” by renaming file extensions. Decide **host**, **trust boundary**, and **support story** first.

### 2. Windows vs Mac

| Topic | Windows (default pin) | Mac literacy |
|-------|------------------------|--------------|
| VBE + core language | Full LOB path | Present; shortcuts/UI differ |
| ActiveX / many COM patterns | Common in legacy | Often missing or different |
| `Declare` / Win32 | Literacy in chapter **13** | Not the same API surface |
| Enterprise macro controls | MotW, ASR, AMSI conversations | Different management story—verify locally |

Write portable *logic* when you can; never assume a Windows-only Automation sample is Mac-safe.

### 3. Security reality (calm and precise)

VBA is powerful because it can touch documents, files, and sometimes other processes. Attackers abuse that power. Defenders and engineers respond with **controls**, not superstition:

| Control theme | Why it exists |
|---------------|---------------|
| Disable / notify / block internet macros | Stops casual execution of untrusted projects |
| Mark of the Web / internet zone | Files from the network are not local-trusted by default |
| Trusted Locations / signing | Enable *known* LOB code without training users to enable everything |
| ASR / AMSI (enterprise) | Runtime and behavioral layers beyond the VBA editor |

Chapter **15** names these properly. Chapter **16** covers reading hostile samples **safely**. This chapter only needs the stance:

> VBA is a **trust-sensitive automation surface**. Treat untrusted projects as untrusted code—because they are.

Fear-mongering (“all macros are malware”) is as unhelpful as recklessness (“just enable macros”). Staff language is: **provenance, policy, least privilege, review**.

### 4. What this track is and is not

This handbook teaches **language + VBE + host literacy + I/O/Automation surfaces + security/defense literacy**.

It is **not**: a full financial modeling course, an Access schema design book, a complete Outlook rules product, a malware-construction guide, or a substitute for your org’s macro policy.

### 5. The five ideas (preview of the track spine)

From the track README—keep them visible:

1. VBA runs **inside a host**; power is the object model.
2. **`Option Explicit`** is non-negotiable for staff code (**02**).
3. **Variants** forgive and hide bugs (**03**).
4. Automation APIs are a **trust boundary** (**07**, **11**, **15**).
5. Security is **policy + runtime**, not vibes (**15–16**).

---

## 3. Applications and use cases

| Angle | VBA’s place in practice |
|-------|-------------------------|
| **Application** | Desktop LOB automation where Excel/Word *is* the UI and datastore adjacent. |
| **Systems** | Host process, build/channel, add-in load paths, and COM Automation boundaries. |
| **Security** | Macro provenance, MotW, Trusted Locations, signing, ASR/AMSI literacy. |
| **Operations** | Template/add-in release, version pins, “who can enable what” runbooks. |
| **Software engineering** | Modules with explicit contracts, error handling, reviews—same discipline as other LOB code. |

**Whole-engineering picture:** choose VBA when the **host is the right platform**. Choose another door when cloud, cross-platform, or OS-wide automation is the real requirement.

---

## Staff-level review checklist

- Problem statement names the **host** (Excel/Word/…) and delivery shape (doc vs template vs add-in).
- Stakeholders understand VBA ≠ VBScript ≠ VB.NET ≠ Office Scripts.
- New work defaults to Microsoft 365 Apps on Windows unless Mac/LTSC constraints are documented.
- Security conversation uses policy controls—not “macros bad” / “enable all.”
- Untrusted files are out of scope for casual enable-on-analyst-laptop workflows.
- Migration or adjacent doors (Scripts, Add-ins, Power Automate, PowerShell) considered when VBA is a poor fit.
- Brownfield retention has an owner, review path, and update story—not eternal orphan macros.
- Object-model dependency acknowledged (this is not portable “pure VB” code).
- Chapter **00** doorway completed before deep syntax investment.
- Track pillars (language, host surface, I/O, security) reflected in the project’s Definition of Done.

---

## References

- [Office VBA reference overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Differences between Office Scripts and VBA](https://learn.microsoft.com/en-us/office/dev/scripts/resources/vba-differences)
- [Office Add-ins overview](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)
- [Macros from the internet are blocked by default in Office](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Deprecated features in the Windows client](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features)
- [Visual Basic language reference for VBA](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/visual-basic-language-reference)
