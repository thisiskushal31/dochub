# Objects, With, CreateObject, and GetObject

[← Back to VBA](./README.md)

## What this chapter covers

How VBA treats **objects**: object variables, `Set`, `Nothing`, `With`, early vs late binding, `CreateObject` / `GetObject`, ProgIDs, and releasing references. Default narrative: **Microsoft 365 Apps VBA on Windows**. This is the Automation surface that powers Excel/Word work (chapters **08–09**) and the same surface defenders review when macros reach outside the host (chapters **11**, **15–16**).

You leave able to declare and assign object variables correctly, choose early vs late binding with eyes open, explain `New` vs `CreateObject`, and treat external Automation as a trust boundary—not a convenience API.

---

## 1. Concepts

### 1. Objects are references

Scalars (`Long`, `String`, `Boolean`) hold values. Object variables hold **references** to instances (a `Workbook`, a `Range`, a COM server). You assign them with **`Set`**, not `=`:

```vb
Dim wb As Workbook
Set wb = ThisWorkbook
```

Without `Set`, VBA treats the right-hand side as a default property (often `.Value`) and you get a type mismatch or a silent wrong value. Staff habit: any object assignment → `Set`.

### 2. `Nothing` and releasing references

`Nothing` means “no object.” Compare with `Is`:

```vb
If wb Is Nothing Then Exit Sub
Set wb = Nothing   ' drop the reference when done
```

Releasing matters when you opened **another** application or held large object graphs. Leaving orphaned Excel/Word instances is a classic ops smell (zombie processes after Automation). Inside the host, dropping locals is often enough; still clear module-level object variables on teardown.

### 3. `With` blocks

`With` binds a temporary object so you avoid repeating a long qualifier:

```vb
With Worksheets("Data").Range("A1")
    .Value = 1
    .Font.Bold = True
End With
```

Nested `With` is legal but hard to review—prefer shallow blocks. `With` does not create a new variable you can pass around; it is syntactic sugar for member access.

### 4. Early binding vs late binding

| Style | How | Pros | Cons |
|-------|-----|------|------|
| **Early** | `Dim x As Excel.Application` + Tools → References | IntelliSense, compile-time checks, constants | Broken if library GUID/version missing on target PC |
| **Late** | `Dim x As Object` + `CreateObject("Excel.Application")` | Fewer deploy reference fights | No IntelliSense; typos fail at runtime; constants are magic numbers |

Staff LOB macros often early-bind the **host** they already run in (`Workbook`, `Range`) and late-bind **optional** external servers so machines without that product still open the file.

### 5. `CreateObject` and ProgIDs

`CreateObject(progID)` asks COM to create an instance by ProgID string:

```vb
Dim xl As Object
Set xl = CreateObject("Excel.Application")
```

Common ProgIDs you will **recognize in review** (legitimate LOB and hostile samples alike): `Excel.Application`, `Word.Application`, `Outlook.Application`, `Scripting.FileSystemObject`, `WScript.Shell`. Naming them here is literacy—not a recipe list for abuse. Chapter **11** deepens FSO/`Shell`; chapter **15** places them in defense policy.

### 6. `GetObject` — attach to what is already there

`GetObject` retrieves an existing instance or opens a document via moniker forms (host-dependent). Typical literacy:

- Attach to a running Office app instead of starting a second copy.
- Open a file through Automation when the document path is the entry point.

Wrong assumptions about “one Excel process” cause double instances, file locks, and user-visible flicker. Prefer explicit workbook/document handles over hoping Active* is correct (chapter **08**).

### 7. `New` vs `CreateObject`

| Form | Meaning |
|------|---------|
| `Set x = New SomeClass` | Creates via early-bound class (needs reference / host class) |
| `Dim x As New SomeClass` | Auto-create on first use (hides when construction happens—avoid in staff code) |
| `CreateObject("Prog.Id")` | Late-bound COM creation by ProgID |

Prefer explicit `Set x = New …` or explicit `CreateObject` at a clear line. Auto-instanced `As New` makes `Is Nothing` checks unreliable and obscures construction errors.

### 8. Lab — Set vs default property

```vb
Dim rng As Range
Set rng = Range("A1")      ' object
' rng = Range("A1")        ' wrong: assigns .Value into a Range variable
rng.Value = 42
Set rng = Nothing
```

**What just happened:** `Set` binds the cell object; assignment without `Set` fights the default property.

---

## 2. Advanced concepts

### 1. Object lifetime and the host

VBA object lifetime is tied to COM reference counts and the host’s object model. Quitting an Application you created (`app.Quit`) without releasing variables leaves dangling references. Pattern for external Automation:

1. Create / Get object.
2. Do work with error handling that still cleans up (chapter **05**).
3. Close documents/workbooks you opened.
4. `Quit` if you started the app.
5. `Set … = Nothing` on locals / module fields.

Do not `Quit` the user’s interactive Excel session from a macro that attached via `GetObject` unless that is an explicit, documented product behavior.

### 2. Library references and version skew

Early binding embeds a reference to a type library. A workbook saved with a newer Office library may warn or fail on older perpetual/LTSC pins. Mitigation habits:

- Develop against the **oldest** Office pin you must support, or
- Late-bind external apps and avoid version-specific constants, or
- Ship as an add-in with a clear Office prerequisite.

Document the pin in the README of the LOB workbook (channel **17** / ops notes).

### 3. Cross-process Automation cost

Talking to another EXE is not a local function call. Marshaling, focus changes, and security prompts appear. Prefer staying inside one host when possible (Excel-only job → Excel OM in chapter **08**). Cross-app sketches belong in chapter **09**.

### 4. Review hotspot: who created what?

In static review (chapter **16**), `CreateObject` / `GetObject` strings are first-class signals. Legitimate macros use them for FSO, scheduled LOB bridges, or Word mail-merge helpers. Hostile macros often chain them toward script hosts or download helpers. Your job in this chapter is to **recognize the API**, require justification in code review, and defer “is this malicious?” to **15–16**—not to invent evasion or payload steps.

### 5. Interfaces and `Object`

`As Object` is the late-bound top type: any COM dispatch. Prefer tighter types when early-bound (`Worksheet`, `Document`). Mixing—early-bound host types plus `Object` for optional servers—is normal staff style.

### 6. Collections are objects too

`Workbooks`, `Worksheets`, `Documents` are collection objects: `.Count`, `.Item`, `For Each`. `For Each` needs `Set` semantics under the hood—declare the loop variable as the element type when early-bound.

### 7. Mac vs Windows literacy

CreateObject ProgIDs and available servers differ on Office for Mac. Default handbook narrative is Windows M365 Apps; treat Mac Automation as a separate compatibility matrix, not a silent assumption.

### 8. `CallByName` (door)

`CallByName(object, "MemberName", vbMethod|vbGet|vbLet|vbSet, …)` invokes a member by **string name**. Useful for thin late-bound façades; easy to typo and hard to refactor. Prefer early-bound calls when the type is known. Pair with chapter **16** awareness: hostile macros sometimes build member names dynamically—justify every `CallByName` in LOB review.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Hold `Workbook` / `Worksheet` / `Range` with `Set`; use `With` for multi-property edits |
| **Systems** | Late-bind optional servers; early-bind the host; document ProgIDs and prerequisites |
| **Security** | Treat `CreateObject`/`GetObject` as trust boundary; no unexplained script-host ProgIDs in LOB code (ch **15**) |
| **Operations** | Always release external Application instances; watch for orphaned Excel/Word processes after jobs |
| **Software engineering** | Avoid `As New`; explicit construction; cleanup in error paths (ch **05**) |

Typical legitimate uses of `CreateObject` in reviewed LOB macros: `Scripting.FileSystemObject` for controlled path work (chapter **11**), starting Word from Excel for a controlled export (chapter **09**), or Dictionary when the reference is awkward (chapter **06**).

Anti-patterns: creating Excel from Excel “to be safe,” leaving `Visible = True` instances abandoned, and storing passwords or tokens in Automation calls (secrets never in code—chapter **11** / **15**).

---

## Staff-level review checklist

- Object assignments use `Set`; comparisons use `Is` / `Is Nothing`.
- No casual `Dim x As New …` auto-instancing in staff modules.
- Early vs late binding choice is intentional and documented for external servers.
- `CreateObject` / `GetObject` ProgIDs are named, justified, and necessary.
- External Application instances are quit/released on success and failure paths.
- `With` blocks stay shallow and do not obscure which object is mutated.
- Module-level object variables are cleared on workbook/document close when they hold external refs.
- No secrets passed through Automation arguments or hard-coded in ProgID wrapper helpers.
- Target Office pin / reference libraries match deployment reality.
- Cross-app Automation has an owner and a test plan (ch **09**), not a one-off paste.
- Dynamic late dispatch (`CallByName`) is rare, justified, and typed at the edges—not a substitute for known interfaces.

---

## References

- [CreateObject function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/createobject-function)
- [GetObject function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/getobject-function)
- [Set statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/set-statement)
- [With statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/with-statement)
- [Nothing keyword](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/nothing-keyword)
- [CallByName function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/callbyname-function)
- [Office VBA object library reference](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
