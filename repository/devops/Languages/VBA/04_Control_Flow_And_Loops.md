# Control flow and loops

[← Back to VBA](./README.md)

## What this chapter covers

How VBA **chooses paths** and **repeats work**. By the end you should be able to:

1. Write clear **`If` / `ElseIf` / `Else`** blocks.
2. Use **`Select Case`** for multi-branch value dispatch.
3. Loop with **`For`…`Next`** and **`For Each`…`Next`**.
4. Loop with **`Do While` / `Do Until`** (and know pre-test vs post-test shapes).
5. Exit early with **`Exit For` / `Exit Do`** (and when that is honesty vs smell).
6. Treat **`GoTo`** as **legacy literacy**—not a style to spread.
7. Preview **`With`** for object-heavy blocks (deepened in **07**).

Chapters **02–03** gave you procedures and types. Errors that interrupt flow are **05**. Collections you iterate are **06**.

Handbook default: **structured control flow**, readable conditions, no clever `GoTo` graphs in new LOB code.

---

## 1. Concepts

### 1. `If` / `ElseIf` / `Else`

```vb
Option Explicit

If rowCount = 0 Then
    MsgBox "Nothing to export"
ElseIf rowCount > MAX_ROWS Then
    MsgBox "Too many rows"
Else
    RunExport
End If
```

| Habit | Why |
|-------|-----|
| Compare explicitly (`= 0`, `Len(s) = 0`) | Avoid relying on undocumented truthiness habits |
| Keep conditions boring | Nested `If` pyramids hide bugs |
| Prefer `ElseIf` chains over deep nesting | Flatter review surface |

**Note:** VBA’s `And` and `Or` evaluate **both** sides—there is no `AndAlso`/`OrElse` short-circuit. Structure nested `If`s when the second test is unsafe:

```vb
If Not obj Is Nothing Then
    If obj.Name = "Target" Then
        ' safe
    End If
End If
```

### 2. `Select Case`

```vb
Select Case statusCode
    Case 0
        HandleOk
    Case 1, 2
        HandleRetry
    Case 3 To 5
        HandleFail
    Case Else
        HandleUnknown
End Select
```

Use `Select Case` when branching on **one expression** with several discrete outcomes. Prefer it over a long `ElseIf` chain on the same variable.

`Select Case True` with case conditions appears in the wild; keep it rare and readable—or use plain `If`.

### 3. `For`…`Next`

```vb
Dim i As Long
For i = 1 To lastRow
    ProcessRow i
Next i
```

| Feature | Use |
|---------|-----|
| `To` | Inclusive bounds |
| `Step` | Stride, including negative |
| `Next i` | Naming the counter aids nested loops |

```vb
For i = lastRow To 1 Step -1
    ' deleting rows bottom-up — Excel literacy in **08**
Next i
```

### 4. `For Each`…`Next`

```vb
Dim ws As Worksheet
For Each ws In ThisWorkbook.Worksheets
    Debug.Print ws.Name
Next ws
```

Prefer `For Each` when you want every element of a collection and do not need the index. Prefer indexed `For` when you need positions, parallel arrays, or reverse deletion patterns.

### 5. `Do While` / `Do Until`

Pre-test forms:

```vb
Do While cur Is Not Nothing
    ' walk a chain
    Set cur = cur.NextItem
Loop

Do Until finished
    finished = TryStep()
Loop
```

Post-test forms run the body at least once:

```vb
Do
    chunk = ReadChunk()
Loop While Len(chunk) > 0
```

| Form | Meaning |
|------|---------|
| `Do While cond … Loop` | Continue while cond is True |
| `Do Until cond … Loop` | Continue until cond is True |
| `Do … Loop While/Until` | Test after body |

Pick the English that matches the invariant. Infinite loops need a clear exit—and often belong behind a max-iteration guard in LOB code.

### 6. `Exit For` / `Exit Do`

```vb
For i = 1 To lastRow
    If Found(i) Then
        hit = i
        Exit For
    End If
Next i
```

Early exit is fine for **search**. Multiple exits scattered through mutation-heavy loops become hard to prove correct—consider restructuring.

Also exist: `Exit Sub`, `Exit Function`—pair with error-handling discipline in **05**.

---

## 2. Advanced concepts

### 1. `GoTo` — legacy literacy, modern avoidance

VBA supports `GoTo label`. You will see it in:

- old recorded macros,
- centralized error handlers (`On Error GoTo CleanFail` — **legitimate** pattern in **05**),
- tangled 1990s business logic.

| Use | Verdict |
|-----|---------|
| `On Error GoTo Handler` | Standard, expected |
| `GoTo` to skip nested spaghetti | Prefer restructure |
| `GoTo` as a general loop tool | Smell |

Learn to **read** `GoTo`. Do not **author** new business flow with it.

### 2. `With` preview

```vb
With Range("A1")
    .Value = 1
    .Font.Bold = True
End With
```

`With` reduces repetition and can clarify a block’s target object. Nested `With` is easy to misread—keep one level deep when possible. Full object habits live in chapter **07**.

### 3. Boolean expressions and `Not`

```vb
If Not IsEmpty(v) And IsNumeric(v) Then
```

Because both sides of `And` run, guard object access with nested `If`s as shown earlier. Prefer positive names (`isReady`) over double negatives when you control the API.

### 4. Looping worksheets / ranges carefully

Excel beginners write `For Each cell In Range("A:A")` and wait forever. Bound your ranges (chapter **08**). Control-flow skill includes **choosing a finite set**.

### 5. Recursion

VBA allows recursive procedures. Prefer explicit stacks/queues for deep trees unless the depth is known-small. Recursion plus `On Error` plus UI events is a debugging trap.

### 6. Recorded macro residue

The recorder emits `Select` / `Activate` / `GoTo`-ish navigation soup. Staff rewrite toward:

- direct object references,
- `With` blocks,
- bounded `For` loops,

without selecting cells for every operation (chapter **08**).

---

## 3. Applications and use cases

| Angle | Control flow in practice |
|-------|--------------------------|
| **Application** | Validate → branch → bounded loop over rows → summarize. |
| **Systems** | Finite loops over host collections; max-iteration guards on “until empty” readers. |
| **Security** | Never loop “all files in Downloads” without provenance checks (**11**, **15**). |
| **Operations** | Idempotent branches: safe to re-run; clear Case Else logging. |
| **Software engineering** | Flat conditionals; Select Case for status codes; GoTo only for error labels. |

**Whole-engineering picture:** control flow is where macros become trustworthy processes—or endless recorders. Bounds and branches are part of the contract.

---

## Staff-level review checklist

- Conditions are explicit and readable; unsafe second tests nested, not `And`-chained.
- `Select Case` used when dispatching on one expression with many outcomes.
- Loops have obvious finite bounds or a hard safety counter.
- `For Each` vs indexed `For` chosen deliberately (especially for deletions).
- `Exit For`/`Exit Do` used for clear search/guard exits—not spaghetti.
- No new business-logic `GoTo` webs; error `GoTo` labels follow chapter **05** patterns.
- `With` blocks shallow and unambiguous.
- Recorded `Select`/`Activate` noise rewritten toward direct references where practical.
- Case Else / Else paths handle unknowns—no silent fall-through in LOB paths.
- Nested loop counters named on `Next` for clarity.

---

## References

- [Decision structures](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/using-ifthenelse-statements)
- [Using Select Case](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/using-select-case-statements)
- [Looping through code](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/looping-through-code)
- [For...Next statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/fornext-statement)
- [For Each...Next statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/for-eachnext-statement)
- [Do...Loop statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/doloop-statement)
- [With statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/with-statement)
- [GoTo statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/goto-statement)
