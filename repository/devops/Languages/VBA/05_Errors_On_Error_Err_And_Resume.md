# Errors: On Error, Err, and Resume

[← Back to VBA](./README.md)

## What this chapter covers

How VBA **signals failure**—and how staff code should respond. By the end you should be able to:

1. Distinguish **trappable runtime errors** from **macro security prompts** (different worlds).
2. Use **`On Error GoTo`**, **`On Error Resume Next`**, and **`On Error GoTo 0`** with intent.
3. Read and clear the **`Err`** object (`Number`, `Description`, `Source`, …).
4. Apply a **central error-handler** pattern (`GoTo CleanFail` / cleanup / re-raise).
5. Explain why **`On Error Resume Next` is a smell** in LOB business logic—and the few places it is a tool.
6. Avoid confusing “enable macros” dialogs with application errors.

Chapter **04** covered normal control flow. This chapter is what happens when the host says **no**. Strings/collections continue in **06**; Automation failures deepen in **07**.

Handbook default: **structured handlers**, visible failures, no silent `Resume Next` blankets.

---

## 1. Concepts

### 1. What an “error” means here

| Kind | What the user/dev sees | Your lever |
|------|------------------------|------------|
| **VBA runtime error** | Error dialog or your handler | `On Error`, `Err` |
| **Compile error** | Won’t run until fixed | `Option Explicit`, Compile VBAProject |
| **Macro security / blocked macros** | Trust Center / banner / policy block | Not `On Error`—policy & provenance (**15**) |

`On Error` does **not** bypass Mark of the Web, ASR, or “macros from the internet blocked.” If the project never runs, there is no handler to enter.

### 2. The `Err` object

After a trappable error (and in a handler), inspect:

| Member | Meaning |
|--------|---------|
| `Err.Number` | Error number (`0` means no error) |
| `Err.Description` | Human-readable text |
| `Err.Source` | Source string when set |
| `Err.Clear` | Reset Err |
| `Err.Raise` | Throw / re-throw |

```vb
MsgBox Err.Number & ": " & Err.Description
```

Always **Clear** when you handle and continue, or you risk stale numbers confusing later checks.

### 3. `On Error GoTo Label`

```vb
Option Explicit

Public Sub ExportSafe()
    On Error GoTo CleanFail

    DoWork

CleanExit:
    ' release objects, restore ScreenUpdating, etc.
    Exit Sub

CleanFail:
    MsgBox "Export failed: " & Err.Description, vbExclamation
    Err.Clear
    Resume CleanExit
End Sub
```

This is the **staff-shaped** pattern:

1. Arm a handler at the top of the entry procedure.
2. Jump to a labeled failure section on error.
3. Log/report using `Err`.
4. **`Resume`** to a shared cleanup label (or `Exit Sub` carefully).
5. Keep cleanup in one place.

### 4. `On Error Resume Next`

```vb
On Error Resume Next
riskyOperation
If Err.Number <> 0 Then
    ' handle
    Err.Clear
End If
On Error GoTo 0   ' restore normal stopping / outer handler policy
```

`Resume Next` means: **ignore the failure and continue at the next statement**. That is occasionally correct for “probe if exists” checks. As a blanket at the top of a 200-line macro, it converts bugs into corrupt workbooks.

### 5. `Resume`, `Resume Next`, `Resume Label`

Inside a handler:

| Statement | Effect |
|-----------|--------|
| `Resume` | Retry the statement that failed |
| `Resume Next` | Continue after the failing statement |
| `Resume Label` | Continue at a label |

Retry only when the failure is transient *and* you understand side effects. Blind `Resume` loops are outages.

### 6. `On Error GoTo 0`

Disables the current procedure’s error handler (restores default halt behavior for that procedure). Use it after a tight `Resume Next` probe to avoid leaving the procedure in “ignore everything” mode.

---

## 2. Advanced concepts

### 1. Central handler pattern (expand)

A fuller LOB sketch:

```vb
Public Sub EntryPoint()
    Dim previousUpdating As Boolean
    On Error GoTo CleanFail

    previousUpdating = Application.ScreenUpdating
    Application.ScreenUpdating = False

    CoreLogic

CleanExit:
    Application.ScreenUpdating = previousUpdating
    Exit Sub

CleanFail:
    ' log Err.Number, Err.Description, context
    MsgBox "Failed: " & Err.Description, vbExclamation
    Err.Clear
    Resume CleanExit
End Sub
```

| Concern | Habit |
|---------|-------|
| Host UI state | Restore `ScreenUpdating`, `Calculation`, `EnableEvents` in cleanup |
| Object references | `Set … = Nothing` in cleanup if needed |
| User message | Useful, not a stack dump of secrets |
| Logging | Where your org logs—not `Debug.Print` alone for production |

### 2. Why `Resume Next` is a smell in LOB code

| What happens | Why it hurts |
|--------------|--------------|
| Failed assignment silently skipped | Later code uses stale values |
| Failed `Set` left as `Nothing` | Next use raises a *different* error far away |
| Partial writes succeed | Data integrity lies |
| Reviewers cannot see failure modes | Ops cannot alert |

Allowed narrow uses (still require immediate `Err` check + `GoTo 0`):

- Testing whether a sheet/name exists.
- Optional late-bound `CreateObject` when absence is a defined branch (**07**).
- Closing something that might already be closed—still prefer structured checks.

### 3. Raising errors intentionally

```vb
Err.Raise Number:=vbObjectError + 1001, _
          Source:="ExportSafe", _
          Description:="Output path is empty"
```

Use custom numbers in a reserved range for your app’s domain failures so callers can branch. Document the contract next to Public entry points.

### 4. Errors vs security prompts

Users conflate:

- “This file contains macros” / blocked internet macros,
- “Microsoft Visual Basic: Run-time error 1004”,
- permission / file-lock / network path failures.

Staff language:

> Security policy decides **whether VBA runs**. `On Error` decides **how running VBA handles failures**.

Training users to click Enable Content does not fix `Err 1004`. Chapter **15** owns policy literacy.

### 5. Error handling across procedure calls

An `On Error` handler applies to the **current procedure** (and can catch errors from callees if the callee does not handle them). If a callee uses `Resume Next` and clears `Err`, the caller may never see the failure. **Don’t swallow in shared helpers** without a defined contract.

### 6. Break mode vs production

VBE Tools → Options → General includes error trapping modes (Break on All Errors / in Class Module / unhandled). Developers may break earlier than production users. Test with handlers armed the way users will run.

### 7. Cell errors vs VBA errors (`CVErr`) — Excel literacy

Excel cells can hold **error values** (`#N/A`, `#VALUE!`, …). Those are not the same as a raised VBA run-time error. `CVErr(xlErrNA)` (and related `xlErr*` constants) builds a Variant that *is* a cell error for writing into ranges. Staff habit: detect with `IsError` before treating a cell as a number/string; do not assume `On Error` will catch a `#DIV/0!` sitting quietly in `Range.Value`.

### 8. `IIf` is not control flow

`IIf(condition, truePart, falsePart)` **evaluates both branches**. It is a tiny expression helper, not a safe substitute for `If…Then` when a branch has side effects or can raise. Prefer real `If` blocks in LOB code.

---

## 3. Applications and use cases

| Angle | Errors in practice |
|-------|---------------------|
| **Application** | Entry macros with CleanFail; user-visible message; no partial silent success. |
| **Systems** | Restore Application state in cleanup; treat file/network failures as expected classes. |
| **Security** | Do not use error handlers to “bypass” security prompts—impossible and out of scope. Log paths carefully (no secrets). |
| **Operations** | Stable `Err.Number` ranges for monitoring; distinguish policy blocks from app errors in runbooks. |
| **Software engineering** | `Resume Next` only in tight probes; Public APIs either succeed or raise/report clearly. |

**Whole-engineering picture:** error handling is product behavior. Silent continue is not resilience—it is undefined state.

---

## Staff-level review checklist

- Entry-point procedures have a structured `On Error GoTo` handler and shared cleanup.
- Application toggles (`ScreenUpdating`, events, calculation) restored on both success and failure.
- `Err.Description` / `Err.Number` surfaced to logs or user messages appropriately; then `Err.Clear` when continuing.
- No module-wide blanket `On Error Resume Next`.
- Any `Resume Next` is scoped, checked, and followed by `On Error GoTo 0` or re-arming the real handler.
- Custom `Err.Raise` numbers documented for Public contracts.
- Worksheet / cell error values (`CVErr`, `xlErr…`) not confused with VBA `On Error` (Excel OM literacy—ch **08**).
- Helpers do not swallow errors unless the function signature advertises that behavior.
- Macro security / MotW issues documented separately from runtime handlers (**15**).
- Compile-clean project; handlers not used as a substitute for `Option Explicit`.
- Break/trap settings considered when reproducing user-only failures.

---

## References

- [On Error statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/on-error-statement)
- [Err object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/err-object)
- [Resume statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/resume-statement)
- [Elements of run-time error handling](https://learn.microsoft.com/en-us/office/vba/access/concepts/error-codes/elements-of-run-time-error-handling)
- [Macros from the internet are blocked by default in Office](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Change macro security settings in Excel](https://support.microsoft.com/en-us/office/change-macro-security-settings-in-excel-a97c09d2-c082-46b8-b19f-e8621e8fe373)
