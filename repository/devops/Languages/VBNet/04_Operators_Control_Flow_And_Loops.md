# Operators, control flow, and loops

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET **makes decisions and repeats work**—including the operators that hide bugs. By the end you should be able to:

1. Write **`If` / `ElseIf` / `Else`** and **`Select Case`** cleanly.
2. Use **`For`**, **`For Each`**, **`Do`**, and **`While`** with clear exit conditions.
3. Choose **`AndAlso` / `OrElse`** over **`And` / `Or`** for Boolean short-circuiting.
4. Read arithmetic, comparison, and string-adjacent operators without classic-VB surprises.
5. Review loops for off-by-one, mutation-while-enumerating, and busy-wait smells.

Chapter **[03](./03_Types_Variables_And_Option_Directives.md)** gave types and Options. Procedures and parameters are **[05](./05_Procedures_Parameters_Properties_And_Overloads.md)**.

Handbook default: **Strict On**; Boolean logic uses **short-circuit** operators unless you have a rare, documented reason.

---

## 1. Concepts

### 1. `If` blocks

```vb
If count > 0 Then
    Console.WriteLine("has items")
ElseIf count = 0 Then
    Console.WriteLine("empty")
Else
    Console.WriteLine("unexpected negative")
End If
```

Single-line `If` exists; prefer block form for anything reviewed in PRs.

| Habit | Why |
|-------|-----|
| Cover impossible cases explicitly | Future readers see intent |
| Avoid deep nesting | Extract helpers (chapter **05**) |
| Compare with `=` for equality | `==` is not the VB equality operator |

### 2. `Select Case`

```vb
Select Case status
    Case "Ready"
        Start()
    Case "Blocked", "Failed"
        Alert()
    Case Else
        Throw New InvalidOperationException($"Unknown status: {status}")
End Select
```

| Use `Select Case` when… | Prefer `If` when… |
|-------------------------|-------------------|
| Discrete values / ranges | Complex compound predicates |
| Clarity over many equals checks | Early-return guard clauses |

Ranges: `Case 1 To 10`. Keep `Case Else` honest—silent ignore is a production footgun.

### 3. Loops

**`For`** — counted loops:

```vb
For i As Integer = 0 To items.Length - 1
    Console.WriteLine(items(i))
Next
```

**`For Each`** — enumerate:

```vb
For Each item As String In names
    Console.WriteLine(item)
Next
```

**`Do` / `While`** — condition-driven:

```vb
Dim n As Integer = 0
Do While n < 3
    n += 1
Loop

Do
    n -= 1
Loop While n > 0
```

| Loop | Fit |
|------|-----|
| `For` | Known bounds / indices |
| `For Each` | Collections; no index needed |
| `Do While` / `While` | Unknown iteration count |
| `Do…Loop Until` | Readability variant of exit condition |

`Exit For` / `Exit Do` / `Continue For` exist—use sparingly; nested exits are review magnets.

### 4. Operators you will actually use

| Kind | Examples | Notes |
|------|----------|-------|
| Arithmetic | `+ - * / \ Mod ^` | `\` is integer division; `/` is floating |
| Assignment | `=` | Also equality in expressions—context matters |
| Compound | `+= -=` | Prefer for clarity |
| Comparison | `= <> < > <= >=` | |
| Logical (Boolean) | `AndAlso OrElse Not` | **Prefer these** |
| Bitwise / non-short-circuit | `And Or Xor` | Different rules—see advanced |
| String concat | `&` or `+` | Prefer `&` for strings under Strict culture |

```vb
Dim a As Integer = 7 \ 2   ' 3
Dim b As Double = 7 / 2    ' 3.5
Dim label As String = "id-" & a.ToString()
```

### 5. Short-circuit Boolean operators

**`AndAlso`** and **`OrElse`** evaluate the right side only if needed:

```vb
If customer IsNot Nothing AndAlso customer.IsActive Then
    Bill(customer)
End If
```

**`And` / `Or`** on Boolean operands do **not** short-circuit the same way people expect from C# `&&` / `||`. Using them for null guards causes **NullReferenceException**:

```vb
' Bad pattern — right side may still be evaluated
If customer IsNot Nothing And customer.IsActive Then
End If
```

Staff rule: **Boolean conditions → `AndAlso` / `OrElse`.** Reserve `And` / `Or` for documented bitwise needs.

### 6. Ternary-style choice

```vb
Dim path As String = If(useBackup, backupPath, primaryPath)
```

The `If` **operator** (two- or three-argument forms) is not the `If` **statement**. Prefer it for small expressions; don’t nest into unreadability.

---

## 2. Advanced concepts

### 1. Integer division and overflow

`\` truncates toward zero for typical integer cases—confirm domain expectations. Overflow behavior depends on compiler checks / project settings; financial and index math deserve tests, not vibes.

### 2. Floating comparisons

`Double` equality is brittle. Prefer epsilon comparisons or better: use `Decimal` for money and discrete integers for counters.

### 3. Mutation during `For Each`

Modifying a collection while enumerating it often throws. Materialize (`ToList`) when you must mutate, or iterate indices / copies deliberately.

### 4. Busy waits and UI threads

`Do While Not done` without awaits/blocking waits can burn CPU or freeze WinForms UI. Ops and desktop LOB reviews should look for **sleep loops** and “pump messages” hacks—prefer async patterns later, or proper events/timers.

### 5. `GoTo` and legacy control

`GoTo` still exists. Treat non-local `GoTo` as brownfield scar tissue. Structured `Try`/`Catch` (later error chapters) and well-named procedures beat spaghetti labels.

### 6. Operator overloading literacy

Custom types may overload operators (`Operator +`, `=`, and friends). In reviews, jump to the type definition before assuming numeric meaning. Especially dangerous for domain types that overload `=` / `<>`.

### 7. Iterators and `Yield`

An **`Iterator`** function (or property getter) returns a sequence one element at a time with **`Yield`**. Callers consume it with `For Each` or LINQ—useful when building a full list up front would be expensive or awkward:

```vb
Private Iterator Function Evens(fromInclusive As Integer, toInclusive As Integer) As IEnumerable(Of Integer)
    For n = fromInclusive To toInclusive
        If n Mod 2 = 0 Then Yield n
    Next
End Function
```

Staff notes:

| Habit | Why |
|-------|-----|
| Prefer `IEnumerable(Of T)` return | Matches LINQ and `For Each` |
| Keep iterator bodies side-effect light | Side effects run during enumeration |
| End with `Exit Function` / `Return` when needed | Stops the sequence cleanly |
| Do not `Yield` from `Catch`/`Finally` | Language rule—cleanup stays in `Finally` |

Async streaming (`IAsyncEnumerable`) is a later door in chapter **11**—ordinary iterators are the everyday VB specialty here.

### 8. Comparison with VBA habits

VBA developers moving here should re-learn **short-circuit operators** and Strict conversions. VBA `And`/`Or` folklore does not transfer safely—see [VBA control flow](../VBA/04_Control_Flow_And_Loops.md) for the other dialect’s rules.

---

## 3. Applications and use cases

| Angle | How control flow shows up |
|-------|---------------------------|
| **Application** | State machines via `Select Case`; guards at boundaries. |
| **Systems** | Retry loops need backoff and caps—not infinite `Do`. |
| **Security** | Branching on authZ must fail closed (`Case Else` deny). |
| **Ops** | Watchdog loops and service polls need jitter, logging, and cancellation. |
| **SE** | Complexity limits on cyclomatic nests; extract procedures early. |

**Whole-engineering picture:** control flow is where policy becomes bits—fail-open `Case Else` is an incident waiting for a new enum value.

---

## 4. Staff-level review checklist

- Boolean logic uses **`AndAlso` / `OrElse`** for short-circuit safety.
- `Select Case` has an intentional **`Case Else`** (throw, log, or documented ignore).
- Loops have clear termination; no unbounded `Do` without a kill switch.
- No collection mutation during live `For Each` without a plan.
- Integer `/` vs `\` is intentional where used.
- String concatenation prefers **`&`** in VB-heavy code under Strict culture.
- Desktop/service code avoids busy-wait CPU spin.
- Nested control flow deeper than team limit is extracted to named procedures.
- Custom `Iterator`/`Yield` sequences are intentional; side effects during enumeration are reviewed.

---

## References

- [Visual Basic — Decision structures](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/control-flow/decision-structures)
- [Loop structures](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/control-flow/loop-structures)
- [Logical and bitwise operators](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/logical-and-bitwise-operators)
- [AndAlso operator](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/andalso-operator)
- [OrElse operator](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/orelse-operator)
- [Operator precedence](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/operator-precedence)
- [Iterators (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/concepts/iterators)
- [Yield statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/yield-statement)
