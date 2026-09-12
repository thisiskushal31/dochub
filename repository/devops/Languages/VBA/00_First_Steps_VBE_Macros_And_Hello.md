# First steps: VBE, macros, and hello

[← Back to VBA](./README.md)

## What this chapter covers

Your first **honest contact** with VBA inside a real Office host. By the end you should be able to:

1. Show the **Developer** tab in Excel or Word.
2. Open the **Visual Basic Editor** (`Alt+F11` on Windows).
3. Insert a **standard module**, write a hello `Sub` with `MsgBox`, and run it.
4. Use the **Immediate Window** (`?`) for a one-line smoke check.
5. Save as a **macro-enabled** workbook/document (`.xlsm` / `.docm`).
6. Treat **untrusted macros** as hostile by default—and know where Trust Center lives.
7. Discover roughly **which Office build** you are on.

If you do not yet know **what VBA is for**, skim chapter **01**, then come back and *touch* the editor.

Handbook default for new work: **Microsoft 365 Apps VBA on Windows**, with **`Option Explicit`** as culture from chapter **02** onward. Discover your host; do not assume a perpetual SKU matches the handbook narrative.

Today’s picture: *one host + one module + something that shows a dialog*. Fuzzy Trust Center settings here make every later chapter feel cursed.

---

## 1. Concepts

### 1. What you are about to start

VBA is not a separate install you run from a terminal. Starting VBA means:

- opening **Excel** or **Word** (or another Office host),
- enabling a way to open the **Visual Basic Editor (VBE)**,
- writing procedures in a **module** that lives *inside* the document, template, or add-in,
- running those procedures as **macros** under the host’s security policy.

| Surface | Role |
|---------|------|
| **Host app** (Excel/Word/…) | Owns the document and the object model |
| **VBE** | Where you edit modules, set breakpoints, use Immediate |
| **Macro** | A public procedure the UI can start (or an event can fire) |
| **Trust Center** | Policy gate: what is allowed to run |

Same language. Different hosts. Most labs in this track use **Excel** first; Word is the same doorway with a different object model (chapter **09**).

### 2. Enable the Developer tab

On Windows Microsoft 365 Apps:

1. Open Excel (or Word).
2. **File → Options → Customize Ribbon**.
3. On the right, check **Developer**.
4. OK.

You should now see a **Developer** ribbon tab with buttons such as **Visual Basic**, **Macros**, and **Macro Security**.

If your org locks Options via policy, ask IT for the Developer tab or use `Alt+F11` once macros are allowed in a trusted test file.

### 3. Open the Visual Basic Editor

| Action | Typical result |
|--------|----------------|
| **Developer → Visual Basic** | Opens VBE |
| **`Alt+F11`** (Windows) | Toggle VBE |
| Project Explorer (`Ctrl+R`) | Tree of workbooks/documents and modules |
| Properties (`F4`) | Selected item’s properties |

VBE layout varies by version, but you always need: **Project Explorer**, a **code pane**, and later the **Immediate Window**.

### 4. Insert a standard module and write hello

In VBE:

1. Select your workbook/document project (e.g. `VBAProject (Book1)`).
2. **Insert → Module**.
3. In the new module, type:

```vb
Option Explicit

Sub HelloMacro()
    MsgBox "Hello, VBA", vbInformation, "First steps"
End Sub
```

`Option Explicit` forces you to declare variables. Chapter **02** explains why staff treat missing `Option Explicit` as a review smell. Put it at the top of every module from day one.

### 5. Run the macro

Three common ways:

| How | When |
|-----|------|
| Place the cursor in the `Sub` → **F5** | Fastest while editing |
| **Developer → Macros** → select `HelloMacro` → **Run** | From the host UI |
| Assign to a button / shape (later) | User-facing entry points |

You should see a message box. Close it. That is a successful smoke check: host loaded VBA, your module compiled enough to run, UI automation (`MsgBox`) worked.

### 6. Immediate Window — the `?` habit

In VBE: **View → Immediate Window** (or `Ctrl+G`).

Type:

```vb
? 2 + 2
```

Press Enter. You should see `4`.

| Habit | Why |
|-------|-----|
| `? expression` | Evaluate without writing a temp `Sub` |
| `Debug.Print "x=", x` in code | Print to Immediate while stepping |
| Keep Immediate open during labs | Faster than MsgBox spam |

Immediate is not a full REPL for designing architecture—but it is the fastest way to ask “does this expression even evaluate?”

### 7. Save as macro-enabled

Ordinary `.xlsx` / `.docx` **strip VBA** on save. You must choose a macro-enabled format:

| Host | Extension | Meaning |
|------|-----------|---------|
| Excel | `.xlsm` | Macro-enabled workbook |
| Excel | `.xltm` | Macro-enabled template |
| Word | `.docm` | Macro-enabled document |
| Word | `.dotm` | Macro-enabled template |

**File → Save As →** pick the macro-enabled type. If Excel warns that VBA will be lost, you picked the wrong format.

Close and reopen. You may see a security banner—that is expected for files that are not in a Trusted Location and not signed. Chapter **15** covers enterprise policy; for a **lab file you created yourself**, enabling macros on *your* trusted local file is normal. Enabling macros on a file from email or the internet is a different decision.

### 8. Do not enable macros on untrusted files

Hold this rule for the whole track:

> **Never enable macros on a workbook or document you do not trust.** Curiosity is not a security control.

Malware still arrives as “invoice” workbooks. Chapters **15** and **16** teach defense and *safe reading* habits. This chapter only plants the habit: **your lab files ≠ random attachments**.

If you need to inspect a suspicious file later, use a disposable VM or org-approved sandbox—not your daily profile with macros set to “Enable all.”

---

## 2. Advanced concepts

### 1. Discover Office version roughly

Staff care about *what actually runs*, not the marketing name on the splash screen.

Useful checks (Excel Immediate or a tiny `Sub`):

```vb
? Application.Version
? Application.Build
? Application.OperatingSystem
```

| Property | Rough meaning |
|----------|----------------|
| `Application.Version` | Major version string (e.g. `"16.0"` for modern Office) |
| `Application.Build` | Build number—compare within a channel |
| Channel / About | Microsoft 365 Current / Monthly Enterprise / LTSC, etc. |

**File → Account → About Excel/Word** shows the human-readable build. Pin the channel your org ships when documenting LOB macros.

### 2. Trust Center preview (literacy, not policy rewrite)

**Developer → Macro Security** (or **File → Options → Trust Center → Trust Center Settings**).

You will see settings such as:

| Area | Staff literacy |
|------|----------------|
| Macro Settings | Disable with notification vs disable without vs enable (dangerous) |
| Trusted Locations | Folders where files may run with fewer prompts |
| Trusted Documents | Per-file trust decisions users make |
| Internet macros | Modern Microsoft 365 defaults often **block macros from the internet** |

Do not “fix” a blocked internet macro by turning on Enable all macros. That is a security incident waiting to happen. Prefer Trusted Locations for *known* LOB paths, signing, or Office Scripts / Add-ins when the platform fits (chapter **18**).

### 3. Project Explorer shapes you will see later

Even in hello, notice names like:

- `ThisWorkbook` / `ThisDocument` — document-class code-behind
- `Sheet1` / `Sheet2` — worksheet modules (Excel)
- `Module1` — standard modules (where hello lives)

Chapter **02** explains which procedures belong where. For now: put reusable entry macros in a **standard module**.

### 4. Mac vs Windows (door)

This track’s default is **Windows**. Office for Mac has a VBE and VBA, but keyboard shortcuts, some Windows-only APIs (`Declare`, certain ActiveX controls), and policy surfaces differ. If you are on Mac, still do hello—and treat later chapters on `Shell` / Win32 as literacy doors, not copy-paste labs.

### 5. Compile before you share

In VBE: **Debug → Compile VBAProject**. Fix compile errors before handing a workbook to testers. Runtime `On Error` (chapter **05**) does not catch “forgot `Option Explicit` and misspelled a name” the way you want in LOB code.

### 6. Object Browser — browse host libraries

VBE: **View → Object Browser** (or **`F2`**).

The Object Browser is how staff *discover* what the host actually exposes—before guessing member names from memory or a blog.

| Move | What you get |
|------|----------------|
| Project/Library dropdown | Your project, VBA, the host library (Excel/Word/…), and any referenced libraries |
| Classes list | Types/classes in that library |
| Members list | Properties, methods, events, constants on the selected class |
| Search box | Find a member across libraries when you remember the name but not the parent |

Habit: pick the host library → find a class you care about (`Range`, `Worksheet`, `Document`) → read the member list and the details pane. F1 on a selected member often jumps to Help for that API. This is literacy for chapters **07–09**, not a substitute for reading the object-model shape.

### 7. Locals and Watch windows (door)

While stepping (**F8**):

| Window | Role |
|--------|------|
| **Locals** (**View → Locals Window**) | Auto-lists variables in the current procedure (and expandable module/`Me` context)—values update as you step |
| **Watch** (**Debug → Add Watch…**) | Pin specific expressions; optionally break when a value is true or changes |

Immediate (`?`) answers one-shot questions. Locals/Watch answer “what is this state *while* I step?” Do not treat open debug windows as a test plan—use them to understand a failing path, then fix and recompile.

---

## 3. Applications and use cases

| Angle | First-steps habits in practice |
|-------|--------------------------------|
| **Application** | Confirm the host can host your macro before writing Range/Document logic. |
| **Systems** | Know build/channel when “works on my PC” disputes appear. |
| **Security** | Separate *lab enable* from *untrusted enable*; never train users to click Enable All. |
| **Operations** | Macro-enabled templates (`.xltm` / `.dotm`) as the ship vehicle for known processes. |
| **Software engineering** | Hello proves the delivery path: module → save format → reopen → run under policy. |

**Whole-engineering picture:** the first failure mode of VBA projects is not syntax—it is **wrong file type**, **blocked macros**, or **editing the wrong project** in a multi-workbook VBE session. Nail the doorway.

### Lab — hello end-to-end

1. Create a new blank workbook.
2. Enable Developer; open VBE (`Alt+F11`).
3. Insert a module; paste the hello `Sub` with `Option Explicit`.
4. Run with **F5**; confirm the MsgBox.
5. In Immediate: `? Application.Version`.
6. Save as `.xlsm`, close, reopen, run again from **Developer → Macros**.
7. Note what the security banner said (if anything) and whether Trusted Locations apply in your org.

Stop here if anything fails—fix the doorway before chapter **02**.

---

## Staff-level review checklist

- Developer tab available (or documented alternate path) on the target desktops.
- Code lives in a standard module for entry macros—not pasted only into Immediate.
- `Option Explicit` present at module top.
- File saved as `.xlsm` / `.docm` (or appropriate macro-enabled template)—not `.xlsx` / `.docx`.
- Reopen test performed: macro still present and runnable under expected policy.
- No instruction to users to “enable all macros” for convenience.
- Untrusted / internet-sourced files never treated as lab fixtures on a daily workstation.
- Office version/build recorded when documenting LOB delivery.
- Compile VBAProject clean before handoff.
- Immediate Window used for smoke checks without leaving debug prints in production paths.
- Object Browser (`F2`) used to confirm host library members before inventing names.
- Locals / Watch known as break-mode inspection tools—not left as the only “test” of LOB behavior.

---

## References

- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Office VBA language reference](https://learn.microsoft.com/en-us/office/vba/api/overview/language-reference)
- [Excel VBA reference](https://learn.microsoft.com/en-us/office/vba/api/overview/excel)
- [Word VBA reference](https://learn.microsoft.com/en-us/office/vba/api/overview/word)
- [Use the Object Browser](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/use-the-object-browser)
- [Object Browser](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/object-browser)
- [Locals window](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/locals-window)
- [Watch window](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/watch-window)
- [Macros from the internet are blocked by default in Office](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Change macro security settings in Excel](https://support.microsoft.com/en-us/office/change-macro-security-settings-in-excel-a97c09d2-c082-46b8-b19f-e8621e8fe373)
