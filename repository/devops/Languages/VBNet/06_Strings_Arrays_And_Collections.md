# Strings, arrays, and collections

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET handles **text and in-memory collections**—with a bias toward the **BCL**. By the end you should be able to:

1. Use everyday **`String`** methods and **interpolation** safely.
2. Work with **arrays** (`Length`, bounds, multidimensional literacy).
3. Prefer **`List(Of T)`** and **`Dictionary(Of TKey, TValue)`** for most app code.
4. Treat **`Microsoft.VisualBasic`** helpers as **literacy**, not the default modern style.
5. Review allocation, culture, and mutability smells in hot paths.

Chapter **[05](./05_Procedures_Parameters_Properties_And_Overloads.md)** covered procedures. Types/Options were **[03](./03_Types_Variables_And_Option_Directives.md)**. For Office-string folklore, contrast [VBA strings/collections](../VBA/06_Strings_Dates_Collections_And_Dictionary.md)—different runtime.

Handbook default: **BCL-first** (`String`, `List(Of T)`, `Dictionary(Of K, V)`); VB runtime helpers only when maintaining idiomatic brownfield.

---

## 1. Concepts

### 1. Strings are immutable reference types

```vb
Dim greeting As String = "Hello"
greeting &= ", world"   ' allocates a new string
```

| Habit | Why |
|-------|-----|
| Prefer interpolation for readability | Clearer than nested concatenations |
| Use `StringBuilder` for many appends | Fewer allocations in loops |
| Compare with explicit rules | Culture vs ordinal matters for security |

Interpolation:

```vb
Dim name As String = "Ada"
Dim line As String = $"User={name}; count={42}"
```

Useful BCL methods:

```vb
Dim s As String = "  alpha,beta  "
s = s.Trim()
Dim parts = s.Split(","c)
Dim ok As Boolean = s.StartsWith("alpha", StringComparison.Ordinal)
Dim upper As String = s.ToUpperInvariant()
```

| Situation | Prefer |
|-----------|--------|
| File paths | `Path.Combine` / `Path` APIs—not string glue alone |
| Case-insensitive identifiers | `StringComparison.OrdinalIgnoreCase` (usually) |
| Display to users | Culture-aware APIs when intentional |
| Security tokens / keys | Ordinal; never rely on `Option Compare Text` accidents |

### 2. Arrays

```vb
Dim ids(2) As Integer          ' length 3: indices 0..2
ids(0) = 10
Dim names As String() = {"a", "b"}
```

| API / idea | Note |
|------------|------|
| `Length` | Element count |
| `GetLowerBound` / `GetUpperBound` | Non-zero lower bounds possible in COM-ish arrays—rare but real |
| `ReDim` / `ReDim Preserve` | Classic resize—prefer `List(Of T)` for growing data |
| Multidimensional / jagged | `(",",)` vs arrays-of-arrays—know which you have |

```vb
For i As Integer = 0 To names.Length - 1
    Console.WriteLine(names(i))
Next
```

### 3. `List(Of T)`

```vb
Dim items As New List(Of String)()
items.Add("one")
items.AddRange({"two", "three"})
If items.Contains("two") Then
    items.Remove("two")
End If
```

| Why lists beat raw arrays for most apps | |
|-----------------------------------------|---|
| Grow without manual `ReDim` | |
| Richer API (`Find`, `Sort`, …) | |
| Play well with LINQ later | |

Still arrays at boundaries when APIs demand `T()`.

### 4. `Dictionary(Of TKey, TValue)`

```vb
Dim map As New Dictionary(Of String, Integer)(StringComparer.OrdinalIgnoreCase)
map("cpu") = 4

Dim cores As Integer
If map.TryGetValue("cpu", cores) Then
    Console.WriteLine(cores)
End If
```

`TryGetValue` takes a **ByRef** out variable for the value. Pass a real local (as above)—not `Nothing` as a stand-in for “ignore the value.”

| Habit | Why |
|-------|-----|
| `TryGetValue` | Avoid KeyNotFoundException at edges |
| Explicit comparer | Don’t surprise on casing |
| Don’t mutate keys’ identity | Hashing assumptions break |

### 5. Other BCL collections (literacy)

| Type | Role |
|------|------|
| `HashSet(Of T)` | Unique membership |
| `Queue(Of T)` / `Stack(Of T)` | Scheduling / undo shapes |
| `IEnumerable(Of T)` | Read sequences without committing to list |
| Concurrent collections | Multi-thread literacy door |

Prefer the narrowest interface on public APIs (`IReadOnlyList(Of T)`, `IEnumerable(Of T)`).

### 6. `Microsoft.VisualBasic` helpers — literacy, not default

The VB runtime library offers familiar names (`Left`, `Right`, `Mid`, `InStr`, `UCase`, `Split`, `Join`, …) under `Microsoft.VisualBasic` / `Strings`.

```vb
' Brownfield literacy — understand when you see it
Dim left3 As String = Microsoft.VisualBasic.Left(text, 3)
```

| Prefer BCL for new code | VB helper often seen as |
|-------------------------|-------------------------|
| `Substring` / ranges | `Left` / `Mid` / `Right` |
| `ToUpperInvariant` | `UCase` |
| `String.Split` | `Split` |
| `String.Join` | `Join` |

Reasons to prefer BCL: cross-language readability in mixed C#/VB solutions, clearer culture control, fewer surprises for new hires. Keep VB helpers when maintaining idiomatic legacy modules—don’t rewrite mid-incident for aesthetics.

---

## 2. Advanced concepts

### 1. Culture, casing, and security

`ToUpper()` without culture can be dangerous for identifiers (legacy Turkish-I stories). Prefer **invariant / ordinal** for machine-facing strings. User-facing display is the opposite conversation.

### 2. Interpolation and formatting

`$"{value:yyyy-MM-dd}"` uses formatting rules—be explicit about culture for serialized exchanges (`CultureInfo.InvariantCulture`) vs UI.

### 3. Arrays from COM / Office interop

Interops may hand you `Object` arrays or 1-based bounds. Check bounds before assuming `0..Length-1`. This is a common bridge from [VBA](../VBA/README.md)-adjacent automation into VB.NET.

### 4. Performance literacy (not micro-myths)

| Pattern | Note |
|---------|------|
| Repeated `&=` in tight loops | Consider `StringBuilder` |
| Huge `List` copies | Pass by shared reference carefully; don’t clone casually |
| Dictionary lookups in hot paths | Fine—profile before inventing caches |

### 5. Mutability and sharing

Returning an internal `List(Of T)` from a property lets callers mutate your private state. Return a copy, `AsReadOnly`, or expose `IReadOnlyList(Of T)`.

### 6. LINQ door

`Where` / `Select` on `IEnumerable(Of T)` is shared .NET literacy (often documented first in [C# LINQ chapters](../CSharp/17_LINQ_And_Async_Await.md)). VB query syntax exists (`From … Where … Select`). Prefer clarity; avoid multiple enumeration of expensive sequences.

---

## 3. Applications and use cases

| Angle | How strings/collections show up |
|-------|----------------------------------|
| **Application** | DTOs and domain lists use `List(Of T)` / dictionaries with clear comparers. |
| **Systems** | Large in-memory collections need caps—unbounded maps become OOM tickets. |
| **Security** | Ordinal compares for secrets; no culture-sensitive authZ string checks. |
| **Ops** | Log formatting should be culture-stable for machine parsing. |
| **SE** | Style guide: BCL-first; VB runtime string helpers allowed in legacy folders only. |

**Whole-engineering picture:** collections are memory policy; string compares are sometimes authZ policy—treat both as design, not syntax.

---

## 4. Staff-level review checklist

- New code prefers **BCL** string APIs over `Microsoft.VisualBasic` helpers unless file is legacy-idiomatic.
- Machine-facing compares specify **`StringComparison`** (usually ordinal).
- Growing data uses **`List(Of T)`** (or better structures)—not repeated `ReDim Preserve`.
- Dictionary access uses **`TryGetValue`** at uncertain edges; comparers are intentional.
- Public APIs don’t leak mutable internal collections casually.
- Path construction uses **`Path`** APIs.
- Hot-loop string building considers **`StringBuilder`** when allocations matter.
- Interop arrays are bounds-checked before indexing.

---

## References

- [Strings in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/strings/)
- [Arrays in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/arrays/)
- [Collections (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/concepts/collections)
- [`List(Of T)`](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1)
- [`Dictionary(Of TKey, TValue)`](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2)
- [Microsoft.VisualBasic.Strings](https://learn.microsoft.com/en-us/dotnet/api/microsoft.visualbasic.strings)
- [String comparison guidance](https://learn.microsoft.com/en-us/dotnet/standard/base-types/best-practices-strings)
