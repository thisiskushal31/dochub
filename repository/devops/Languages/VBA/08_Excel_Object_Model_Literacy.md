# Excel object model literacy

[← Back to VBA](./README.md)

## What this chapter covers

Enough of the **Excel object model** to write and review staff macros: `Application`, `Workbooks`, `Worksheets`, `Range`, `Cells`, `ActiveCell`, `Value` vs `Formula`, performance toggles used carefully, range loops, and why `Select` / `Activate` are usually the wrong tool. Default: **Microsoft 365 Apps Excel VBA on Windows**. File format literacy (`.xlsx` vs `.xlsm`) closes the chapter.

You leave able to navigate the hierarchy without recorder folklore, mutate cells by reference, and flag macros that thrash the UI or hide calculation side effects. Deeper security policy lives in chapter **15**; object/`Set` mechanics in chapter **07**.

---

## 1. Concepts

### 1. The hierarchy in one glance

```
Application
  └── Workbooks
        └── Workbook
              └── Worksheets / Sheets
                    └── Worksheet
                          └── Range / Cells
```

Almost every useful Excel macro is: get the right **Workbook** → right **Worksheet** → right **Range** → read/write properties. Ambiguity about *which* book or sheet is active is the root of flaky macros.

### 2. `Application`

`Application` is Excel itself: settings, calculation mode, screen updating, file dialogs, and global entry points. Inside Excel VBA you usually omit it (`Workbooks` means `Application.Workbooks`). From another host via Automation (chapter **07** / **09**), you hold an `Excel.Application` reference explicitly.

Staff-relevant toggles (use sparingly—see Advanced):

| Property | Intent |
|----------|--------|
| `ScreenUpdating` | Suppress flicker during bulk writes |
| `Calculation` | Pause automatic recalc while writing many cells |
| `EnableEvents` | Temporarily suppress workbook/sheet events (ch **12**) |
| `DisplayAlerts` | Suppress confirm dialogs (dangerous if misused) |

Always restore toggles in cleanup—even on error (chapter **05**).

### 3. Workbooks and worksheets

```vb
Dim wb As Workbook
Dim ws As Worksheet
Set wb = ThisWorkbook
Set ws = wb.Worksheets("Data")
```

| Handle | Meaning |
|--------|---------|
| `ThisWorkbook` | The workbook that **contains** the running VBA |
| `ActiveWorkbook` | Whatever workbook happens to be active—fragile |
| `Workbooks("Name.xlsx")` | Open book by name |
| `Worksheets("Data")` | Sheet by tab name |
| `Sheets(1)` | Includes charts; prefer `Worksheets` when you mean grids |

Prefer `ThisWorkbook` for LOB logic that ships inside the file. Prefer named sheets over index numbers that break when users reorder tabs.

### 4. `Range`, `Cells`, and `ActiveCell`

```vb
ws.Range("A1").Value = 10
ws.Cells(1, 1).Value = 10          ' row, column
ws.Range("A1:B10").ClearContents
```

| Member | Use |
|--------|-----|
| `Range("A1")` | Address string (A1 notation) |
| `Cells(r, c)` | Numeric indexing—friendly in loops |
| `ActiveCell` | User’s current cell—UI macros only |
| `Selection` | Whatever is selected—usually avoid |

Qualified ranges (`ws.Range`) beat unqualified `Range` (which binds to `ActiveSheet`).

### 5. `Value` vs `Formula`

| Property | Stores |
|----------|--------|
| `.Value` | Computed value (what you usually read/write as data) |
| `.Value2` | Value without currency/date wrapper quirks—often preferred for bulk data |
| `.Formula` / `.FormulaR1C1` | The formula text |

Writing `.Value = "=A1+1"` stores a **string**, not a formula. Writing `.Formula = "=A1+1"` stores a formula. Know which you mean.

### 6. Avoid `Select` / `Activate` when possible

The macro recorder emits:

```vb
Range("A1").Select
Selection.Value = 1
```

Staff style:

```vb
ws.Range("A1").Value = 1
```

Selecting is slow, breaks when the sheet is hidden, fights the user focus, and fails in some Automation contexts. Activate/Select belong in rare UI demos—not in ETL-style macros.

### 7. Looping ranges

```vb
Dim cell As Range
For Each cell In ws.Range("A1:A100")
    If Len(cell.Value2) > 0 Then
        ' process
    End If
Next cell
```

For large grids, reading into a **Variant array** (`vals = rng.Value2`), processing in memory, then writing back once is far faster than per-cell COM calls. That pattern is still “Range literacy,” not a separate library.

### 8. Lab — qualified write

```vb
Sub WriteHello()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Worksheets("Data")
    ws.Range("A1").Value = "hello"
End Sub
```

**What just happened:** no Activate, no Select—direct write on a named sheet in `ThisWorkbook`.

---

## 2. Advanced concepts

### 1. Performance toggles — restore or regret

```vb
Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
On Error GoTo CleanFail
' ... bulk work ...
CleanFail:
Application.Calculation = xlCalculationAutomatic
Application.ScreenUpdating = True
```

Forgetting restore leaves Excel “broken” for the user (no recalc, frozen UI feel). `EnableEvents = False` can skip security-relevant or business-critical handlers—document why, restore always. Pair with chapter **12**.

### 2. Used range traps

`Worksheet.UsedRange` can be larger than the real data if formats linger. Prefer explicit tables, named ranges, or detecting last row with a disciplined method your team standardizes—do not invent five conflicting last-row idioms in one repo.

### 3. Structured tables (`ListObject`)

Excel Tables are first-class: `ListObjects("Table1")`, columns by name. Prefer them over magic `A:A` scans when the business data is already tabular. Full Table API depth is an Excel product topic; literacy is: they exist, they resize, they play better with Power Query doors (chapter **18**).

### 4. `.xlsx` vs `.xlsm` vs add-ins

| Extension | Macros? | Notes |
|-----------|---------|-------|
| `.xlsx` | No VBA project | Safe default for data-only exchange |
| `.xlsm` | Yes | Macro-enabled workbook; policy/MotW apply (ch **15**) |
| `.xlsb` | Can hold VBA | Binary; still macro-capable—do not treat as “safe zip” |
| `.xlam` | Add-in | Shared code deployment pattern |

Saving a macro workbook as `.xlsx` **strips** the VBA project—confirm dialogs exist for a reason. Distributing logic: prefer signed workbooks/add-ins per org policy (chapter **15**), not email `.xlsm` folklore.

### 5. 32-bit vs 64-bit Excel

Declare statements differ (chapter **13**). Object-model code is mostly the same; file paths and memory ceilings differ. Pin bitness in ops docs for LOB add-ins.

### 6. Calculation and volatility

Writing many formulas triggers recalc chains. Manual calculation during write + single `Calculate` at the end is a staff pattern. Volatile formulas (`NOW`, `INDIRECT`, …) amplify cost—design sheet logic, do not only “optimize VBA.”

### 7. Hidden and very hidden sheets

Sheets can be hidden from the UI yet reachable from VBA. Review macros that unhide sheets to dump data or reveal UI. Legitimate use: staging sheets; hostile samples sometimes park payloads—chapter **16** reading habits.

### 8. `Offset` / `Resize` mental model

Think of a `Range` as an **anchor** plus a **shape**. Navigation and sizing stay on that object—no Select required:

| Member | Mental model |
|--------|----------------|
| `rng.Offset(r, c)` | Same size, moved by `r` rows / `c` columns from the anchor |
| `rng.Resize(rows, cols)` | Same top-left, new height/width |

```vb
Dim anchor As Range, block As Range
Set anchor = ws.Range("B2")
Set block = anchor.Offset(1, 0).Resize(10, 3)  ' B3:D12
```

Staff habit: compute the target `Range`, then read/write once. Chaining `Offset`/`Resize` in loops is fine; selecting each step is not (see Concepts §6).

### 9. `SpecialCells` literacy (and the empty-result trap)

`Range.SpecialCells` returns a sub-range matching a cell type (constants, formulas, blanks, visible cells, last cell, …). Constants such as `xlCellTypeConstants` / `xlCellTypeFormulas` exist on the Excel OM—use them when you mean “only constants” or “only formulas.”

**Trap:** if **no** cells match, Excel raises a runtime error (commonly 1004)—it does not return an empty range quietly. Staff pattern:

```vb
Dim consts As Range
On Error Resume Next
Set consts = ws.UsedRange.SpecialCells(xlCellTypeConstants)
On Error GoTo 0
If consts Is Nothing Then
    ' no constants — branch, do not assume a Range
Else
    ' process consts
End If
```

Review smell: bare `SpecialCells` with no empty-result handling. Prefer Tables / named blocks when the business shape is known (Advanced §3).

### 10. `WorksheetFunction` vs VBA

`Application.WorksheetFunction` exposes many worksheet functions to VBA (`Sum`, `VLookup`, `Match`, …). Example shape: `Application.WorksheetFunction.Sum(rng)`.

| Choice | When |
|--------|------|
| **WorksheetFunction** | You want Excel’s calc semantics (and errors that raise into VBA) |
| **VBA arithmetic / loops** | Simple math, no need for Excel function parity |
| **Write a formula into a cell** | User-visible calc that recalc should own (`.Formula`) |

`WorksheetFunction` failures often surface as VBA errors (unlike worksheet `#N/A` in a cell). Decide whether that is desired. Prefer OM bulk patterns over per-cell WorksheetFunction chatter on large grids.

### 11. `Workbooks.Open` / `SaveAs` and `FileFormat`

Opening and saving are where **macro-enabled reality** meets disk:

| Surface | Literacy |
|---------|----------|
| `Workbooks.Open` | Path, update-links, read-only, password args—document why each non-default is set |
| `Workbook.SaveAs` | Name **and** `FileFormat` (e.g. `xlOpenXMLWorkbookMacroEnabled` for `.xlsm`) |
| Format mismatch | Saving macro code as `.xlsx` strips the VBA project—confirm dialogs exist for a reason |

Staff habit: pin `FileFormat` explicitly when SaveAs is automated; do not rely on extension folklore alone. Pair with Advanced §4 and chapter **15** for MotW / internet-macro policy on opened files.

### 12. Named ranges (`Names`) — staff habit

`Workbook.Names` / sheet-scoped names are stable contracts for LOB code: `Range("ReportBlock")` or `Names("ReportBlock").RefersToRange` beats hard-coded `A1:G50` that drifts when users insert rows.

| Habit | Why |
|-------|-----|
| Prefer named ranges or Tables for “the data block” | Survives layout edits better than magic addresses |
| Document workbook- vs sheet-scope | Same name can collide; be explicit |
| Review hidden / odd `RefersTo` | Legitimate staging vs surprise external refs |

Do not treat Names as a secret store (chapter **11** / **15**).

### 13. `Application.Run` and `Application.OnTime` (schedule + cancel)

**`Application.Run`** invokes a procedure by name (optionally in another open workbook): useful for add-in entry points and late-bound macro dispatch. Prefer direct `Call` when the procedure is in the same project and known at compile time—`Run` is a stringly contract.

**`Application.OnTime`** schedules a **public** procedure (no arguments; not in a custom class/form) for a future time. LOB use: deferred refresh, “run after UI settles,” simple timers. This is **scheduling literacy**, not evasion instruction.

```vb
' Schedule (store EarliestTime if you must cancel later)
gRunAt = Now + TimeValue("00:00:30")
Application.OnTime EarliestTime:=gRunAt, Procedure:="RefreshLobCache"

' Cancel — same Procedure + same EarliestTime, Schedule:=False
Application.OnTime EarliestTime:=gRunAt, Procedure:="RefreshLobCache", Schedule:=False
```

Staff rules:

- Always document the **cancel path** (`Schedule:=False` with the **same** `EarliestTime` and `Procedure` strings).
- Store the scheduled time in a module-level variable when cancel is required.
- Tear down pending `OnTime` on workbook close / add-in unload so Excel does not call into a closed project.
- Do not use `OnTime` to dodge policy, MotW, or user consent—chapter **15** wins.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Named sheets + qualified `Range`/`Cells`; Variant array bulk I/O for large blocks |
| **Systems** | `ThisWorkbook` for shipped logic; explicit workbook paths for imports; format (`.xlsm`) matches intent |
| **Security** | No silent `DisplayAlerts` dismissal of overwrite warnings; toggles restored; macro-enabled files go through policy (ch **15**) |
| **Operations** | Jobs log sheet name + address mutated; fail closed if expected sheet missing |
| **Software engineering** | Kill Select/Activate in review; centralize last-row/table helpers; `Option Explicit` (ch **02**) |

Excel-only tasks should stay in Excel. Spawning Word or Outlook from a sheet belongs in chapter **09** with a clear product reason.

---

## Staff-level review checklist

- Ranges are qualified (`ws.Range` / `wb.Worksheets`)—not ambient Active*.
- No Select/Activate in non-UI paths.
- `Value` vs `Formula` vs `Value2` choices are intentional.
- ScreenUpdating / Calculation / EnableEvents / DisplayAlerts always restored.
- Bulk writes prefer arrays or contiguous ranges over per-cell chatter.
- Sheet names (or Tables) are stable contracts—not fragile indices alone.
- `Offset` / `Resize` used to build ranges—not Select chains.
- `SpecialCells` calls handle the “no cells found” error; result is tested before use.
- `WorksheetFunction` vs VBA vs cell `.Formula` choice is intentional (including error behavior).
- Automated `Open` / `SaveAs` pins `FileFormat` when macro-enabled output is required.
- Named ranges / Tables preferred over magic addresses for LOB blocks; scope documented.
- `Application.OnTime` schedules have a documented cancel path (`Schedule:=False`) and teardown on close.
- `Application.Run` string targets are allowlisted/owned—not built from untrusted sheet text.
- File format matches macro reality (`.xlsm` / add-in vs `.xlsx`).
- Errors do not leave Application toggles wrong (ch **05**).
- External Automation uses chapter **07** discipline if Excel is created from outside.
- Macro-enabled distribution follows org signing/policy (ch **15**).

---

## References

- [Excel VBA reference](https://learn.microsoft.com/en-us/office/vba/api/overview/excel)
- [Application object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.application(object))
- [Workbook object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.workbook)
- [Worksheet object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.worksheet)
- [Range object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.range(object))
- [Range.Offset method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.range.offset)
- [Range.Resize property (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.range.resize)
- [Range.SpecialCells method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.range.specialcells)
- [WorksheetFunction object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.worksheetfunction)
- [Workbooks.Open method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.workbooks.open)
- [Workbook.SaveAs method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.workbook.saveas)
- [XlFileFormat enumeration (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.xlfileformat)
- [Names object (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.names)
- [Application.Run method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.application.run)
- [Application.OnTime method (Excel)](https://learn.microsoft.com/en-us/office/vba/api/excel.application.ontime)
- [Getting started with VBA in Office](https://learn.microsoft.com/en-us/office/vba/library-reference/concepts/getting-started-with-vba-in-office)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
