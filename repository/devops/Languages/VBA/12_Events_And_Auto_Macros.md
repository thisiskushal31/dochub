# Events and auto-macros

[← Back to VBA](./README.md)

## What this chapter covers

Workbook and document **events**, classic **Auto_Open / Auto_Close** literacy, **ThisWorkbook** (or **ThisDocument**) vs standard modules, why events need **macros enabled**, template vs document behavior, and how defenders **view auto-run**—without teaching evasion. Default: **Microsoft 365 Apps VBA on Windows**.

You leave able to place open/close logic in the right module, inventory auto-run entry points in review, and explain why “just open it” is not a safe analysis plan (chapter **16**). Security policy names live in chapter **15**; Excel/Word OM context in **08–09**.

---

## 1. Concepts

### 1. Events are callbacks from the host

An **event** is code the host runs when something happens: workbook open, sheet change, document close, before save, etc. You do not call these like normal procedures from a button—though you can share logic by calling a standard module from the handler.

Mental model:

> **Host detects lifecycle → looks for a matching handler in the right class module → runs it if macros are allowed.**

No macros enabled → handlers do not run (user may still edit cells). That is by design and by policy.

### 2. Excel: `ThisWorkbook` vs standard modules

| Location | What belongs there |
|----------|-------------------|
| **ThisWorkbook** class module | `Workbook_Open`, `Workbook_BeforeClose`, `Workbook_BeforeSave`, … |
| **Sheet class modules** | `Worksheet_Change`, `Worksheet_SelectionChange`, … |
| **Standard modules** | Shared procedures, `Auto_Open` / `Auto_Close` (legacy), button macros |

Signature shape (Excel):

```vb
' ThisWorkbook
Private Sub Workbook_Open()
    ' initialize LOB state — keep thin
End Sub
```

Handlers are typically `Private Sub` with host-defined names. Renaming breaks the wire-up.

### 3. Word: `ThisDocument` and `Document_Open`

```vb
' ThisDocument
Private Sub Document_Open()
    ' thin init — ch 09
End Sub
```

Same idea: class module of the document/template project, not a random standard module. Word also exposes other document events (close, save)—look them up when you need them; literacy is knowing **where** they must live.

### 4. Classic `Auto_Open` / `Auto_Close`

Older Excel macros use public procedures named **`Auto_Open`** and **`Auto_Close`** in a **standard module**. Excel may run them on open/close when macros are enabled, alongside or instead of modern events depending on context and history.

Staff guidance:

- Prefer **`Workbook_Open` / `Workbook_BeforeClose`** in `ThisWorkbook` for new Excel work.
- Still **recognize** `Auto_*` in brownfield and hostile samples.
- Do not assume only one open entry point—inventory all of them.

Word’s auto macros family is a related legacy story; modern code prefers document events. Reviewers grep for both styles.

### 5. Macros must be enabled

Events and auto-macros are inert when:

- Macro settings block them,
- The file is in Protected View without editing,
- Internet macros are blocked by policy (chapter **15**),
- The user disables macros for the session.

Product feature and control plane are the same switch. LOB designers must plan a **non-macro degraded mode** (sheet instructions) when policy denies run.

### 6. Template vs document

| Artifact | Event tendency |
|----------|----------------|
| **Excel template** (`.xltm`) | Code may ship in template; new workbooks inherit depending on how they were created |
| **Word template** (`.dotm`) | Often the right home for shared `Document_Open` logic |
| **Document / workbook** | Instance-specific handlers; watch for duplicated logic across copies |

Opening a template for edit vs creating a document from a template changes which project runs—test both paths. Chapter **09** flags Word templates; treat Excel templates with the same care.

### 7. Lab — thin open handler

```vb
' ThisWorkbook
Private Sub Workbook_Open()
    On Error GoTo Fail
    InitLobSession   ' standard module — ch 02
    Exit Sub
Fail:
    MsgBox "LOB init failed. Contact support.", vbExclamation
End Sub
```

**What just happened:** open event delegates to shared code and surfaces failure without pretending to be a security boundary.

---

## 2. Advanced concepts

### 1. `EnableEvents` and re-entrancy

Excel `Application.EnableEvents = False` suppresses workbook/sheet events during bulk writes (chapter **08**). Forgotten restore means Change handlers never fire—or the opposite: a `Worksheet_Change` that writes cells retriggers itself until stack overflow. Pattern: disable → mutate → restore in cleanup (chapter **05**).

### 2. `Workbook_Open` vs `Auto_Open` ordering literacy

Both may exist. Do not rely on folklore order without testing on your Office pin. Prefer consolidating to one open path in staff code. In review of unknown files, **list every entry point** rather than assuming a single `Open` handler.

### 3. Application-level events (workable literacy)

Workbook/sheet modules catch events for **that** document. **Application-level** events catch the same kinds of signals **across** open workbooks—typical for add-ins and Personal macros.

**Shape:** a class module holds `WithEvents` against `Application`; a durable instance variable keeps the class alive.

```vb
' Class module: clsAppEvents
Public WithEvents App As Application

Private Sub App_SheetChange(ByVal Sh As Object, ByVal Target As Range)
    ' cross-workbook change literacy — keep thin; filter Sh.Parent.Name
End Sub
```

```vb
' Standard module — keep the instance alive
Public gAppEvents As clsAppEvents

Public Sub WireAppEvents()
    Set gAppEvents = New clsAppEvents
    Set gAppEvents.App = Application
End Sub

Public Sub UnwireAppEvents()
    If Not gAppEvents Is Nothing Then
        Set gAppEvents.App = Nothing
        Set gAppEvents = Nothing
    End If
End Sub
```

**Wire-up homes (when macros are enabled):**

| Home | Typical hook |
|------|----------------|
| Workbook / add-in project | `Workbook_Open` → `WireAppEvents` |
| Classic add-in habit | `Auto_Open` → `WireAppEvents` (still recognize in brownfield) |
| **Personal.xlsb** | Per-user Application handlers that follow the Excel profile |
| **`.xlam` add-in** | Shared LOB Application handlers for many workbooks |

Unwire on close/unload (`Workbook_BeforeClose` / add-in teardown) so handlers do not outlive the project.

**`Application.SheetChange` vs worksheet `Worksheet_Change`:**

| Handler | Scope |
|---------|--------|
| `Worksheet_Change` in a sheet module | That sheet only |
| `App_SheetChange` (Application event) | Any sheet in any workbook the Application raises for—you must filter |

Prefer sheet-module handlers for workbook-local LOB. Prefer Application events when an add-in must observe many books. Same re-entrancy rules as Advanced §1 (`EnableEvents`).

**Lifetime caveat:** a VBA **reset** (End button, unhandled stop, project recompile habits that clear state) **drops** the class instance—Application events silently stop until `WireAppEvents` runs again. Staff habit: re-wire from a known open path; document “reset → re-open / re-run wire” in support notes. Dual instances (wired twice without unwind) double-fire handlers—guard with “already wired” checks.

This is LOB/add-in literacy—not a guide to hide auto-run from policy (chapter **15**).

### 4. Defender view of auto-run (no evasion)

From a defender’s perspective, auto-run macros are attractive because they execute on open when trust allows. Enterprise controls reduce that risk: MotW, internet macro blocking, Trusted Locations, ASR rules related to Office child processes, AMSI integration, and user education (chapter **15**).

Staff obligations:

- Inventory open/close handlers in every shipped `.xlsm` / `.docm` / template.
- Keep handlers thin; dangerous APIs (`CreateObject`, `Shell`—chapters **07**, **11**) inside open events demand heightened review.
- Never design “how to make it run despite policy.” Policy wins; LOB requests exceptions through governance.

Hostile-sample analysis uses static reading and controlled labs (chapter **16**)—not enabling macros on a production laptop to “see what happens.”

### 5. BeforeClose / BeforeSave cancel flags

Many events pass `Cancel` ByRef. Setting `Cancel = True` aborts close/save. Use for “unsaved LOB state” warnings—not to trap users. Abusive cancel loops are a UX and support incident.

### 6. Hidden entry points

Also inventory: ribbon/on-action macros, shape-assigned macros, `Worksheet_Activate`, ActiveX control events, UserForm `Initialize` (chapter **10**), and Application-level sinks living in **Personal.xlsb** / **`.xlam`**. Auto-run is broader than `*_Open` alone.

### 7. XLM / Excel 4.0 macros (literacy pointer)

Ancient sheets may use Excel 4.0 macro sheets as auto-run cousins. Out of scope for writing; in scope for security literacy in chapters **15–16**. Do not revive XLM for new work.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | `Workbook_Open` refreshes a dashboard cache; `BeforeClose` clears secrets from sheets |
| **Systems** | Templates own shared events; documents own data; add-ins own application events |
| **Security** | Open handlers inventoried; no unexplained Shell/CreateObject on open (ch **11**, **15**) |
| **Operations** | Degraded mode documented when macros disabled; support knows the policy story |
| **Software engineering** | Thin handlers; shared `Init*`/`Teardown*`; tests open files under macro-enabled and disabled pins |

Good open work: stamp a version cell, verify required sheets exist, set calculation mode with restore on close. Bad open work: silent network calls with secrets, process launches, or fake “decrypt” UX—reject in review.

---

## Staff-level review checklist

- All auto-run entry points listed: `Workbook_Open` / `Document_Open` / `Auto_*` / sheet/app events / UI hooks.
- Handlers live in the correct class module (`ThisWorkbook` / `ThisDocument`).
- New Excel code prefers Workbook events over new `Auto_Open` unless brownfield forces otherwise.
- Handlers are thin; shared logic is in standard modules with `Option Explicit` (ch **02**).
- `EnableEvents` toggles always restored (ch **08**, **05**).
- Application-level `WithEvents` instances are wired from Open/Auto_Open and unwired on close; home (`Personal.xlsb` / `.xlam` / workbook) is documented.
- Application `SheetChange` (or siblings) filter workbook/sheet intent—do not assume “this LOB file only.”
- Support notes cover VBA reset dropping Application event sinks until re-wire.
- Template vs document behavior tested on the real Office pin.
- Open-path uses of `CreateObject` / `Shell` / file deletes are justified or removed (ch **07**, **11**).
- No reliance on macros for authentication or confidentiality (ch **10**, **15**).
- Analysis of unknown files does not start with “enable macros” on a trusted workstation (ch **16**).
- Org policy (MotW, Trusted Locations, ASR) acknowledged—not worked around.

---

## References

- [Workbook.Open event (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.workbook.open)
- [Workbook.BeforeClose event (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.workbook.beforeclose)
- [Document.Open event (Word)](https://learn.microsoft.com/en-us/office/vba/api/word.document.open)
- [Application.EnableEvents property (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.application.enableevents)
- [Application.SheetChange event (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.application.sheetchange)
- [Worksheet.Change event (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.worksheet.change)
- [WithEvents keyword (VBA)](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/withevents-keyword)
- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
