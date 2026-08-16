# Procedures, parameters, properties, and overloads

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET **packages behavior**—procedures, parameter passing, properties, and overloads. By the end you should be able to:

1. Write **`Sub`** vs **`Function`** with clear intent.
2. Use **`ByVal`** / **`ByRef`**, **`Optional`**, and **`ParamArray`** deliberately.
3. Design **Properties** (`Get` / `Set`) without pretending they are free.
4. Read and author **overloads** without ambiguous call sites.
5. Review API boundaries for ref-mutation surprises and optional-arg traps.

Chapter **[04](./04_Operators_Control_Flow_And_Loops.md)** covered flow. Strings and collections are **[06](./06_Strings_Arrays_And_Collections.md)**. Project/module placement was **[02](./02_Projects_Modules_Namespaces_And_Entry_Points.md)**.

Handbook default: **`ByVal` unless mutation of the caller’s variable is the point**; prefer overloads over boolean flag soup.

---

## 1. Concepts

### 1. `Sub` vs `Function`

| Kind | Returns | Use |
|------|---------|-----|
| **`Sub`** | Nothing | Commands, side effects, event-like work |
| **`Function`** | A value (`As T`) | Queries, calculations, pure-ish transforms |

```vb
Sub LogInfo(message As String)
    Console.WriteLine(message)
End Sub

Function Add(a As Integer, b As Integer) As Integer
    Return a + b
End Function
```

Prefer `Return` in functions. Assigning to the function name is older style—readable in brownfield, avoid in new code.

### 2. Parameters and `ByVal` / `ByRef`

**`ByVal`** (default in modern VB) passes arguments by value:

- For **value types**, the callee gets a copy.
- For **reference types**, the callee gets a copy of the *reference*—it can mutate the object, but reassigning the parameter does not rebind the caller’s variable.

**`ByRef`** lets the callee reassign the caller’s variable (and is required for some interop patterns).

```vb
Sub Rebind(ByRef slot As String)
    slot = "replaced"
End Sub

Sub MutateList(ByVal items As List(Of Integer))
    items.Add(42)   ' mutates shared list object
End Sub
```

| Choice | When |
|--------|------|
| `ByVal` | Default; document object mutation separately |
| `ByRef` | True out-parameters / rebinding—review carefully |

Staff smell: `ByRef` everywhere “for speed.” That is classic VB folklore—not a .NET performance plan.

### 3. `Optional` parameters

```vb
Sub Connect(host As String, Optional port As Integer = 443)
End Sub
```

Rules of thumb:

- Optional parameters need **compile-time constant** defaults.
- Adding an optional arg in the middle can break binary/source callers—prefer overloads for evolving APIs.
- Optional + overloads together can create **ambiguity**.

### 4. `ParamArray`

```vb
Function Sum(ParamArray values As Integer()) As Integer
    Dim total As Integer = 0
    For Each v As Integer In values
        total += v
    Next
    Return total
End Function

' Sum(1, 2, 3)
```

Use for true variable-length argument lists. For collections you already have, take `IEnumerable(Of T)` instead.

### 5. Properties

Properties expose field-like access with methods underneath:

```vb
Public Class TimerConfig
    Private _seconds As Integer

    Public Property Seconds As Integer
        Get
            Return _seconds
        End Get
        Set(value As Integer)
            If value < 0 Then Throw New ArgumentOutOfRangeException(NameOf(value))
            _seconds = value
        End Set
    End Property
End Class
```

Auto-properties:

```vb
Public Property Name As String
```

| Habit | Why |
|-------|-----|
| Validate in `Set` | Keep objects honest |
| Avoid heavy work in `Get` | Callers assume cheap reads |
| Prefer methods for side effects | `Save()` should not look like a field |

`NameOf(value)` (and `NameOf(Seconds)`, `NameOf(TimerConfig)`) yields the **compile-time name** as a string. Use it in exceptions and logs so renames stay honest—prefer it over hand-typed `"value"` literals.

### 6. Overloads

Same name, different signatures:

```vb
Overloads Function ParseId(text As String) As Guid
    Return Guid.Parse(text)
End Function

Overloads Function ParseId(bytes As Byte()) As Guid
    Return New Guid(bytes)
End Function
```

`Overloads` keyword clarifies intent when mixing with `Overrides` / shadows in inheritance hierarchies—use team conventions consistently.

---

## 2. Advanced concepts

### 1. Expression-bodied members literacy

Modern VB allows compact members in some forms; prefer clarity over golf. Match the surrounding codebase.

### 2. `ByRef` and async / lambdas

Capturing `ByRef` parameters in async methods or certain lambdas is restricted/illegal in common cases. If the compiler complains, redesign to return values or wrap in a small class—don’t fight it with unsafe tricks.

### 3. Optional arguments vs binary compatibility

Optional parameters are baked into **call sites** at compile time. Changing a default does not update already-compiled callers. For library authors: treat default changes as behavioral contracts; prefer new overloads.

### 4. Properties vs fields in serialization / binding

WinForms, serializers, and DI often bind to **properties**. Public fields may be skipped. Brownfield mixes both—know what your binder looks for.

### 5. `Function` returning `Task` / async literacy (door)

Async VB uses `Async Function` / `Async Sub` with `Await`. `Async Sub` is largely for event handlers—error handling differs from `Async Function`. Deep async belongs with later platform chapters and [C# async literacy](../CSharp/17_LINQ_And_Async_Await.md) for shared BCL patterns.

### 6. Shadows vs overrides (preview)

Name reuse across inheritance uses `Overrides` / `Overridable` / `Shadows`. Wrong choice causes **which method runs?** bugs. When reviewing inheritance, jump to the base member modifiers before trusting call sites.

### 7. VBA procedure habits that do not transfer

VBA `ByRef` defaults and `Variant` parameters are a different contract—see [VBA modules/procedures](../VBA/02_Modules_Procedures_Option_Explicit_And_Scope.md). In VB.NET, assume **`ByVal` default** and typed parameters under Strict.

---

## 3. Applications and use cases

| Angle | How procedures show up |
|-------|------------------------|
| **Application** | Small functions with intention-revealing names; properties for state, methods for behavior. |
| **Systems** | Stable public overloads across versions; avoid optional-arg landmines in shared libs. |
| **Security** | Setters validate; no “property” that writes files or opens network as a surprise. |
| **Ops** | CLI entry `Sub Main` parses args via clear helpers—not a 400-line Main. |
| **SE** | API reviews treat `ByRef` and `Optional` as design smells needing justification. |

**Whole-engineering picture:** procedure boundaries are your abstraction budget—`ByRef` and optional defaults silently couple callers across time.

---

## 4. Staff-level review checklist

- New APIs default to **`ByVal`**; `ByRef` has a one-line justification.
- `Sub` vs `Function` matches side-effect vs value intent.
- Optional parameters are at the **end**, defaults are stable, or overloads are preferred.
- `ParamArray` is not used where an `IEnumerable(Of T)` is clearer.
- Properties are cheap to `Get`; validation lives in `Set` or factory methods.
- Overloads are unambiguous at call sites under `Option Strict On`.
- `Async Sub` is limited to event-handler shapes when async appears.
- Public surface doesn’t expose mutable `Public` fields casually—properties or methods with intent.

---

## References

- [Procedures in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/)
- [Passing arguments ByVal and ByRef](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/passing-arguments-by-value-and-by-reference)
- [Optional parameters](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/optional-parameters)
- [Parameter arrays](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/parameter-arrays)
- [Properties](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/properties)
- [Procedure overloading](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/procedure-overloading)
- [NameOf operator](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/nameof)
