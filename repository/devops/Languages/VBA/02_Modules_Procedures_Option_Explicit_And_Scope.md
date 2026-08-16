# Modules, procedures, Option Explicit, and scope

[← Back to VBA](./README.md)

## What this chapter covers

How VBA **code is organized** and **who can call what**. By the end you should be able to:

1. Tell **standard modules**, **document modules** (`ThisWorkbook` / `ThisDocument`), and **class modules** apart.
2. Choose **`Sub` vs `Function`** with intent.
3. Use **`Public` / `Private` / `Static`** without cargo-culting.
4. Treat **`Option Explicit`** as non-negotiable staff culture.
5. Predict **`ByRef` vs `ByVal`** behavior (including the default).
6. Read **`Optional`** and **`ParamArray`** signatures with literacy.
7. Apply a boring, reviewable **naming** style.

Chapter **00** got you into the VBE. Chapter **01** explained where VBA lives. This chapter is the **language packaging** layer. Types follow in **03**; errors in **05**.

Handbook default: **Microsoft 365 Apps VBA on Windows**, every module starts with **`Option Explicit`**.

---

## 1. Concepts

### 1. Where code can live

| Container | What it is for |
|-----------|----------------|
| **Standard module** (`Module1`, …) | Reusable procedures; most entry macros; shared helpers |
| **Document module** | Excel: `ThisWorkbook`, `Sheet1`, … — Word: `ThisDocument` — **events** and document-tied behavior |
| **Class module** | Custom objects you `New`; encapsulation—see Advanced below and chapter **07** |
| **UserForm module** | UI code-behind (chapter **10** door) |

Rule of thumb for LOB work:

- Put **callable macros and shared logic** in **standard modules**.
- Put **event handlers** in the document/sheet modules that own those events (chapter **12**).
- Do not dump everything into `ThisWorkbook` “because it is already there.”

### 2. `Sub` vs `Function`

| Kind | Returns a value? | Typical use |
|------|------------------|-------------|
| **`Sub`** | No | Actions, macros started from the UI, event handlers |
| **`Function`** | Yes (assign to the function name) | Calculations, predicates, reusable queries of state |

```vb
Option Explicit

Public Sub RefreshReport()
    Dim n As Long
    n = CountVisibleRows()
    MsgBox n
End Sub

Private Function CountVisibleRows() As Long
    CountVisibleRows = 0  ' real logic later
End Function
```

Excel also allows **user-defined functions (UDFs)** callable from worksheet cells—powerful and easy to abuse. Treat sheet-callable `Function`s as a public API: pure-ish, fast, no sneaky UI.

### 3. `Public`, `Private`, and default visibility

| Keyword | Meaning (modules) |
|---------|-------------------|
| **`Public`** | Visible to other modules (and often to the Macros dialog if a parameterless `Sub`) |
| **`Private`** | Visible only inside this module |
| (omitted) | For procedures in standard modules, historically **Public** by default—**spell Public/Private anyway** |

Staff habit: **default to `Private` helpers**; mark entry points `Public` deliberately. The Macros dialog listing every helper `Sub` is a usability and review smell.

### 4. `Option Explicit`

At the top of every module:

```vb
Option Explicit
```

Without it, a typo creates a **new `Variant` variable** at runtime—often with a default Empty value—and your bug looks like “wrong answer,” not “undeclared identifier.”

| With `Option Explicit` | Without |
|------------------------|---------|
| Compile/runtime forces declarations | Silent `Variant`s for typos |
| Intent visible at `Dim` | Scope and type become archaeology |

You can set **Require Variable Declaration** in VBE Tools → Options so new modules insert `Option Explicit` automatically. Do that on every staff machine.

### 5. Declaring variables (preview)

```vb
Dim total As Long
Dim name As String
Dim rng As Range
```

Chapter **03** covers types deeply. Here, the scope rule matters:

| Declaration site | Lifetime / visibility |
|------------------|------------------------|
| Inside a procedure | Local to that procedure |
| `Private` at module level | Shared by procedures in the module; lives while the project is loaded (nuance with re-entry) |
| `Public` at module level | Cross-module shared state—use sparingly |

### 6. Naming that survives review

| Prefer | Avoid |
|--------|-------|
| `RefreshQuarterlyReport` | `DoIt`, `Macro1`, `Button1_Click` logic with no name |
| `GetCustomerId` / `TryParseDate` | `x`, `temp`, `data2` as public API |
| `m_` or clear module-level prefixes *if* your team standard says so | Mixing three conventions in one project |

Match host events’ required names (`Workbook_Open`, etc.)—those are fixed. Everything else should read like an intentional API.

---

## 2. Advanced concepts

### 1. `ByRef` vs `ByVal`

In VBA, arguments are **`ByRef` by default** unless you write `ByVal`.

| Mode | Meaning |
|------|---------|
| **`ByRef`** | Callee can modify the caller’s variable |
| **`ByVal`** | Callee gets a copy of the value (objects: the *pointer* semantics still matter—see below) |

```vb
Private Sub Bump(ByRef n As Long)
    n = n + 1
End Sub

Private Sub Demo()
    Dim x As Long
    x = 1
    Bump x
    ' x is 2
End Sub
```

**Objects:** `ByVal` still passes a reference to the same object; it prevents the callee from making the caller’s *variable* point at a different object, but property changes on the object remain visible. Staff review: know whether you meant to mutate.

**Prefer `ByVal` for scalars** on public APIs unless you intentionally mutate out-parameters. Explicit `ByRef` documents the mutation contract.

### 2. `Optional` and `ParamArray`

```vb
Public Sub ExportSheet( _
    ByVal sheetName As String, _
    Optional ByVal includeHeader As Boolean = True)

Public Function MaxOf(ParamArray values() As Variant) As Variant
```

| Feature | Literacy |
|---------|----------|
| **`Optional`** | May be omitted; use `IsMissing` only for `Variant` Optionals without defaults; prefer typed Optionals with defaults |
| **`ParamArray`** | Must be `Variant` array; last parameter; absorbs a variable argument list |

Do not invent baroque Optional pyramids. If you need five modes, use a small options type or separate procedures.

### 3. `Static` variables

```vb
Private Sub CounterDemo()
    Static hits As Long
    hits = hits + 1
End Sub
```

`Static` locals retain values between calls. Useful for rare caches; dangerous as hidden global state. Prefer module-level `Private` with a clear reset story if the state is real.

### 4. Procedure-level vs module-level coupling

Smell: every `Sub` reads and writes a dozen `Public` module variables. Prefer **parameters in, result out** (or a dedicated class later). Shared mutable module state makes testing and concurrency-of-reentry (events firing mid-macro) painful.

### 5. Early binding literacy door

`Dim rng As Range` requires the host’s type library (normal inside Excel). Cross-application Automation may use early-bound references or late-bound `Object` / `CreateObject` (chapter **07**). Organization of modules should keep **host-specific** code obvious—do not hide Excel types inside falsely “generic” modules without a plan.

### 6. What shows in the Macros dialog

Roughly: **`Public` parameterless `Sub`s in standard modules** appear. `Private` procedures and `Function`s do not show as macros in the same way. Design entry points on purpose; keep helpers `Private`.

### 7. Class modules — custom objects

**Insert → Class Module** creates a type you instantiate with `New`. The class module’s name (set in Properties, e.g. `Customer`) becomes the type name.

| Standard module | Class module |
|-----------------|--------------|
| Shared procedures; no instance state | Each `New` gets its own fields/properties |
| Good default for macros and helpers | Good when you need encapsulated state + behavior |
| Cannot be `New`’d as an object | Designed to be created, used, released |

Lifecycle hooks (place in the class module):

```vb
Option Explicit

Private mName As String

Private Sub Class_Initialize()
    mName = ""   ' runs when the instance is created
End Sub

Private Sub Class_Terminate()
    ' runs when the last reference is released — keep thin; no UI spam
End Sub
```

**Property procedures** expose state without making every field `Public`:

| Procedure | Role |
|-----------|------|
| **`Property Get`** | Read the property |
| **`Property Let`** | Write a *value* (String, Long, …) |
| **`Property Set`** | Write an *object* reference |

```vb
Public Property Get Name() As String
    Name = mName
End Property

Public Property Let Name(ByVal value As String)
    mName = Trim$(value)
End Property
```

Caller sketch:

```vb
Dim c As Customer
Set c = New Customer
c.Name = "Ada"
Debug.Print c.Name
Set c = Nothing   ' last release → Class_Terminate
```

**When to use a class vs a standard module:** prefer a class when you have *several related pieces of state* that should travel together and validate on write. Prefer a standard module for stateless helpers and Public entry macros. Do not invent a class hierarchy for a three-line export—YAGNI applies.

Chapter **07** deepens objects, `WithEvents`, and Automation. Here the goal is: recognize class modules, Initialize/Terminate, and Get/Let/Set as the encapsulation toolkit.

### 8. `Implements` (door only)

`Implements SomeInterface` in a class module means “this class supplies every Public member of that interface.” Useful for plug-in-style LOB designs and rare COM contracts. Staff literacy: know the keyword exists and that missing members fail at compile. Full interface design is advanced product work—not default workbook style. See the Learn reference when you actually need it.

### 9. `Friend` visibility (door, rare)

In class modules, **`Friend`** sits between `Public` and `Private`: visible to other modules *inside the same project*, but not exposed to external controllers of the class (and not late-bound the same way). Most LOB code never needs it—`Public`/`Private` is enough. Note it when reading brownfield or add-in code that carefully hides cross-module helpers on classes.

### 10. Custom events and `AddressOf` (doors)

| Door | What it is | Staff habit |
|------|------------|-------------|
| **`Event` / `RaiseEvent`** | A class can declare events and raise them for `WithEvents` sinks | Rare in LOB sheets; more common in reusable class libraries—keep sinks obvious |
| **`AddressOf`** | Passes a procedure pointer into some Windows API callbacks | Almost always pairs with `Declare` (ch **13**); treat as elevated review |

Do not invent event buses inside workbooks for fashion. Prefer direct calls and host events (chapter **12**).

---

## 3. Applications and use cases

| Angle | Modules and procedures in practice |
|-------|-------------------------------------|
| **Application** | One Public entry `Sub` per user action; Private helpers for parse/validate/write. |
| **Systems** | Document modules only for events; avoid turning `ThisWorkbook` into a junk drawer. |
| **Security** | Minimize Public surface; no “utility” `Sub`s that shell out from a casually listed macro name (see **11**, **15**). |
| **Operations** | Stable Public names for scheduled/button entry points; version comments at module head—not secrets. |
| **Software engineering** | `Option Explicit` everywhere; explicit Public/Private; ByVal defaults for scalars; small ParamArray use. |

**Whole-engineering picture:** the module boundary *is* your API. Visibility and naming are security and maintainability controls, not cosmetics.

---

## Staff-level review checklist

- Every module begins with `Option Explicit` (VBE “Require Variable Declaration” enabled for authors).
- Entry macros are intentional `Public Sub`s; helpers are `Private`.
- Business logic not dumped into `ThisWorkbook` / sheet modules except event wiring.
- `ByRef`/`ByVal` explicit on non-trivial signatures; mutations documented.
- Optional parameters have defaults or clear `IsMissing` handling—typed when possible.
- `ParamArray` only where a true variable arity helps; not as a junk bag.
- Module-level `Public` data rare; justified when present.
- Naming readable at the Macros dialog and in call stacks.
- No reliance on undeclared variables or implicit Variants for “speed.”
- Compile VBAProject clean after refactors that move procedures between modules.
- Class modules used only when instance state + behavior justify them—not as a default for every helper.
- `Class_Initialize` / `Class_Terminate` stay thin; Terminate is not a dumping ground for UI or network work.
- Properties use `Property Get` / `Let` / `Set` with private backing fields; no casual Public fields for mutable LOB state.
- `Implements` / `Friend` appear only with a named design reason (or are flagged as brownfield literacy).

---

## References

- [Visual Basic naming rules](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/visual-basic-naming-rules)
- [Declaring variables](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/declaring-variables)
- [Understanding scope and visibility](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/understanding-scope-and-visibility)
- [Passing arguments by reference vs value](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/passing-arguments-by-reference-and-by-value)
- [Writing a Function procedure](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/writing-a-function-procedure)
- [Writing a Sub procedure](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/writing-a-sub-procedure)
- [Option Explicit statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/option-explicit-statement)
- [Writing a property procedure](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/writing-a-property-procedure)
- [Property Get statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/property-get-statement)
- [Implements statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/implements-statement)
