# UserForms and the Microsoft Forms door

[← Back to VBA](./README.md)

## What this chapter covers

**UserForms** as a VBA door: when a modal form is the right tool, a basic control mental model, how forms relate to modules/events, and security honesty—**forms are not authentication**. This is **not** a UI design course, accessibility encyclopedia, or Microsoft Forms (the web survey product) tutorial. Default: **Microsoft 365 Apps VBA on Windows**.

You leave able to decide form vs worksheet UI vs external app, read a simple form + code-behind shape, and reject “password UserForm” as a security control. Language structure still rests on chapter **02**; host data still rests on **08–09**.

---

## 1. Concepts

### 1. What a UserForm is

A **UserForm** is a designer surface in the VBE plus a class module code-behind. At runtime VBA shows a window with controls (text boxes, labels, buttons, list boxes, …). Users submit or cancel; your code reads control properties and then writes to sheets, documents, or calls procedures.

Mental model:

> **Layout in the designer → logic in the form module → data in the host document.**

UserForms are for **structured input** inside Office—not for rebuilding a full desktop app. If you need modern web UX, cross-platform clients, or enterprise identity, look at Office Add-ins / Power Apps doors (chapter **18**), not more controls on a 1990s-era form.

### 2. When to use a UserForm

| Prefer a UserForm when… | Prefer something else when… |
|--------------------------|-----------------------------|
| You need a short modal dialog with validation | Data entry is naturally tabular → use worksheet cells / Excel Table (ch **08**) |
| Multiple fields must be confirmed together | Long wizard UX → consider a proper app or Power Automate |
| Operators must pick from a constrained list | Cloud users on Excel for the web → VBA forms may not exist there |
| You are enhancing a desktop LOB workbook | You need SSO / MFA → not VBA |

Staff question: “Can a sheet + data validation solve this?” If yes, skip the form.

### 3. Control mental model (literacy, not gallery)

| Control idea | Role |
|--------------|------|
| **Label** | Static text |
| **TextBox** | Free text / numbers as strings—validate in code |
| **CommandButton** | OK / Cancel / Browse actions |
| **ComboBox / ListBox** | Constrained choices |
| **CheckBox / OptionButton** | Booleans / exclusive choices |
| **Frame** | Grouping (visual + option groups) |

You configure properties in the designer (`Name`, `Caption`, `Enabled`, …) and handle events like `CommandButton1_Click` in the form module. Naming controls (`txtName`, `btnOk`) matters for review—default `TextBox1` farms are unreadable.

### 4. Show, Hide, and unload

```vb
' From a standard module
UserForm1.Show vbModal
```

| Action | Meaning |
|--------|---------|
| `.Show` | Display (modal default in classic patterns) |
| `Me.Hide` | Close UI but keep instance state |
| `Unload Me` | Destroy the instance |

Modal forms block Excel/Word until dismissed—good for “must confirm,” bad if you accidentally nest long Automation underneath. Modeless forms exist but complicate focus and lifetime; treat as advanced and rare in LOB macros.

### 5. Code-behind vs standard modules

Keep UI event thin: validate → call a standard module procedure that does the real work (`Option Explicit`, clear errors—chapters **02**, **05**). Fat forms that also format thirty sheets are untestable.

### 6. Lab — OK reads a box

```vb
' Inside UserForm code-behind — shape only
Private Sub btnOk_Click()
    If Len(Trim$(txtName.Text)) = 0 Then
        MsgBox "Name is required.", vbExclamation
        Exit Sub
    End If
    ' Call a standard module to write to the sheet
    ApplyName txtName.Text
    Unload Me
End Sub
```

**What just happened:** validation stays near the UI; persistence is delegated.

### 7. Not Microsoft Forms (web)

**Microsoft Forms** (forms.office.com / M365 surveys) is a different product. VBA **UserForms** are desktop VBE objects. Do not conflate them in architecture docs. Web Forms + Power Automate may replace many “collect input” macros—chapter **18**.

### 8. `MsgBox` / `InputBox` vs UserForm

| Tool | Fits |
|------|------|
| `MsgBox` | Alerts, Yes/No confirms |
| `InputBox` | One string/number prompt |
| **UserForm** | Multi-field entry, lists, validation UX |

Jumping to a UserForm for a single Yes/No is noise. Stacking ten nested `InputBox` calls is worse UX than one small form. Pick the smallest UI that keeps validation honest.

### 9. Data flow contract

Agree where form values land: named cells, a Table row, document variables, or a call into a pure procedure that returns a typed result. Avoid writing to `ActiveCell` from OK handlers—the active cell may not be where the operator thinks (chapter **08**). Prefer `ThisWorkbook` / `ThisDocument` anchors.

---

## 2. Advanced concepts

### 1. Initialization events

`UserForm_Initialize` runs when the instance is created—populate combo boxes, set defaults. `UserForm_Activate` runs on display. Heavy work in Initialize freezes show; prefer prep data before `.Show` when lists are large.

### 2. Controls collection and dynamic controls

Forms expose a `Controls` collection; advanced macros create controls at runtime. That is hard to review and usually unnecessary—prefer designer layout. Dynamic control creation also appears in hostile samples as obfuscation surface (chapter **16** literacy)—LOB code should stay boring.

### 3. Framing security correctly

A UserForm that asks for a “password” and compares to a string in VBA is **not** authentication. Anyone can:

- Read the VBA (even if locked—locks are not cryptography),
- Break into the VBE,
- Call the underlying `Apply*` routine directly,
- Or edit the sheet the form eventually writes.

Real auth is OS/M365 identity, file ACL, sensitivity labels, and server-side checks (chapter **15**). Forms may implement **UX gating** (“don’t click OK until fields are filled”) only.

### 4. Hiding sheets behind forms

Pattern: very hidden sheets + form as the only UI. Legitimate for guided entry; still not security. Reviewers should ask where data lands and who can unhide sheets (chapter **08**).

### 5. DPI, scaling, and Office for Mac

Layout that looks fine on one Windows DPI may clip elsewhere. Mac VBA UserForm support and control fidelity differ—pin platforms. Default narrative remains Windows M365 Apps.

### 6. Accessibility and localization (door)

Tab order, accelerator keys, and caption localization matter for real users. This handbook does not teach accessibility design; staff LOB owners should not ship unusable tab order. Treat as product ownership, not a VBA trivia quiz.

### 7. Replacement doors

| Need | Door |
|------|------|
| Cross-platform Excel | Office Scripts / Add-ins (ch **18**) |
| Approvals / workflows | Power Automate |
| Rich internal apps | Power Apps / proper desktop stack |
| Simple prompts | `InputBox` / `MsgBox` (limited) |

`InputBox` is fine for one value; multi-field validated entry is the UserForm niche—or a sheet.

### 8. Modeless forms and Excel focus

`Show vbModeless` lets users edit the sheet while the form stays open. That enables useful “palette” tools and also race conditions: the user changes sheet mid-entry, or closes the workbook under the form. Default staff pattern remains **modal** unless the product explicitly needs modeless and tests focus/teardown. Always `Unload` on workbook close paths when a form might still be alive (pair with chapter **12**).

### 9. Control values are strings until you say otherwise

TextBox content is text. Parse numbers/dates with explicit conversion and locale awareness (chapter **03** / **06**). Do not pass raw `.Text` into SQL-like constructions or Shell command lines (chapter **11**)—forms are an untrusted input edge even when the operator is friendly.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Modal form collects parameters → standard module mutates `ThisWorkbook` |
| **Systems** | Forms only on desktop pins where VBA UI exists; cloud path uses another tool |
| **Security** | No password-as-security; no secrets in control defaults or Tag properties (ch **11**, **15**) |
| **Operations** | Document form entry points like any other macro; same signing/policy |
| **Software engineering** | Thin events; named controls; reusable validators; `Option Explicit` (ch **02**) |

Good fit: “Export parameters” dialog, “pick fiscal period,” “confirm destructive cleanup.” Bad fit: fake login walls, entire CRUD apps, or exfil UX—review under **15–16**.

---

## Staff-level review checklist

- Form vs worksheet UI decision is justified.
- Control names are meaningful; tab order is sane.
- Event handlers are thin; business logic lives in standard modules (ch **02**).
- Validation happens before host mutation; errors are clear (ch **05**).
- No claim that UserForms provide authentication or confidentiality.
- No secrets in captions, defaults, or Tags.
- Show/Hide/Unload lifetime is understood; no orphaned modeless instances.
- Platform pin includes Windows desktop VBA (not Excel on the web).
- Alternative M365 doors considered when cloud/mobile matters (ch **18**).
- Macro security policy still applies—forms do not bypass MotW/ASR (ch **15**).

---

## References

- [UserForm object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/userform-object)
- [UserForm window](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/userform-window)
- [Overview of macros and VBA](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Office VBA reference](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Office Add-ins overview](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)
