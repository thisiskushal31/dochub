# Types, variables, and Option directives

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET **names values** and how **`Option` directives** change what the compiler allows. By the end you should be able to:

1. Declare variables with **`Dim` … `As`** and pick everyday CLR types.
2. Explain **`Option Explicit`**, **`Option Strict`**, **`Option Infer`**, and **`Option Compare`**.
3. Use **`Nothing`**, nullable value types, and honest inference.
4. Spot late-binding and silent conversion hazards under weak Options.
5. Set staff defaults: **Explicit On**, **Strict On**, Infer as a deliberate choice.

Chapter **[02](./02_Projects_Modules_Namespaces_And_Entry_Points.md)** placed code in projects. Control flow is **[04](./04_Operators_Control_Flow_And_Loops.md)**; procedures deepen in **[05](./05_Procedures_Parameters_Properties_And_Overloads.md)**.

Handbook default: **`Option Explicit On`**, **`Option Strict On`**, modern nullable awareness; do not rely on classic VB forgiveness.

---

## 1. Concepts

### 1. Types describe storage and operations

VB.NET types map to the CLR. You declare intent with `As`:

```vb
Dim count As Integer = 0
Dim label As String = "runbook"
Dim enabled As Boolean = True
Dim price As Decimal = 19.99D
```

| Family | Examples | Notes |
|--------|----------|-------|
| Integers | `Byte`, `Short`, `Integer`, `Long` | Prefer sizes that match domain + BCL APIs |
| Floating / decimal | `Single`, `Double`, `Decimal` | Money → `Decimal` awareness |
| Text / logic | `String`, `Boolean` | Strings are reference types |
| Date/time | `Date` | Maps to `DateTime` |
| Objects | Your classes, `Object` | `Object` is the escape hatch—use sparingly under Strict |

### 2. `Dim`, scope, and assignment

```vb
Dim total As Integer
total = 10
```

| Keyword / idea | Role |
|----------------|------|
| `Dim` | Local / member declaration (context matters) |
| `Const` | Compile-time constant |
| `ReadOnly` | Runtime-settable once (fields) |
| `Static` (locals) | Persist across calls—rare; review carefully |

Declare close to first use. Huge blocks of `Dim` at the top of a 200-line `Sub` recreate classic VB fog.

### 3. The four Options you must recognize

Directives can appear at the top of a file; projects can set defaults.

| Directive | Staff-friendly meaning |
|-----------|-------------------------|
| **`Option Explicit On`** | Variables must be declared—typos don’t become silent names |
| **`Option Strict On`** | Disallows narrowing/late-binding conversions without `CType` / explicit casts |
| **`Option Infer On`** | Compiler may infer types from initialization (`Dim x = 3` → `Integer`) |
| **`Option Compare Binary/Text`** | String comparison rules (binary vs text) |

```vb
Option Explicit On
Option Strict On
Option Infer On
```

Under **Strict Off**, this kind of hazard compiles more easily:

```vb
' Dangerous culture under Strict Off — avoid
Dim o As Object = "42"
Dim n As Integer = o   ' implicit conversions / late binding territory
```

Staff default for new modules: **Explicit On + Strict On**. Turn Infer **On** when it improves clarity; turn it **Off** if your team wants every `As` visible.

### 4. `Nothing` and nullability

`Nothing` is the unset reference (and the default for some value patterns). Reference types can be `Nothing`; dereferencing is a runtime failure.

```vb
Dim name As String = Nothing
If name Is Nothing Then
    name = ""
End If
```

Nullable value types:

```vb
Dim maybe As Integer? = Nothing
If maybe.HasValue Then
    Console.WriteLine(maybe.Value)
End If
```

Modern .NET nullable reference-type annotations are language/tooling sensitive—know whether your project enables nullable contexts and do not assume VBA-like `Variant` emptiness.

### 5. Inference vs annotation

With `Option Infer On`:

```vb
Dim title = "handbook"   ' inferred String
Dim items = New List(Of Integer)()
```

Prefer inference when the right-hand side is obvious; annotate **public APIs**, ambiguous `Nothing`, and empty collections where inference would widen to `Object` or fail under Strict.

### 6. Conversions you should name

Under Strict On, be explicit:

```vb
Dim text As String = "42"
Dim n As Integer = Integer.Parse(text)
Dim m As Integer = CInt(text)      ' VB conversion helper
Dim o As Object = n
Dim back As Integer = CType(o, Integer)
```

| Helper | Habit |
|--------|-------|
| `CInt`, `CLng`, `CStr`, … | VB idioms—know overflow/rounding behavior |
| `CType` / `DirectCast` | `DirectCast` is stricter when you know the runtime type |
| `Parse` / `TryParse` | Prefer `TryParse` at trust boundaries |

---

## 2. Advanced concepts

### 1. Why Strict Off still exists in the wild

Brownfield code often shipped with Strict Off for speed of porting from classic VB. That is **debt**, not a style to copy. When you must touch Strict Off modules: add tests before tightening; enable Strict file-by-file when possible.

### 2. Late binding

Late binding (`Option Strict Off` + `Object` / dynamic COM) resolves members at runtime. It powers some interop and also **hides breakages** until a production path hits them. Prefer early-bound interfaces and generated interop assemblies when you can.

### 3. `Object` vs generics vs `Variant` memories

VB.NET has **no VBA `Variant` as the default local**. `Object` is the weakly typed bucket. Prefer `List(Of T)`, `Dictionary(Of K, V)`, and real DTOs—see **[06](./06_Strings_Arrays_And_Collections.md)**.

### 4. Default values

Value types default to zeroed bits; reference types default to `Nothing`. Relying on defaults instead of initializing domain-required fields causes “works until it doesn’t” bugs in serializers and ORMs.

### 5. `Option Compare` and cultural surprises

`Option Compare Text` makes string comparisons culture/text oriented; `Binary` is ordinal/binary oriented. Mixing file-level Compare settings across a codebase creates **heisenbugs** in filters and security checks (usernames, paths, tokens). Pick a team rule and keep security-sensitive compares explicit (`StringComparison`) in BCL calls.

### 6. Project defaults vs file directives

File-level `Option` overrides project defaults. Review tools should print **effective** Strict/Explicit settings, not only the `.vbproj` property group.

### 7. Tuples (literacy)

Modern VB uses **tuples** for small anonymous groups of values—common at C#/VB API seams:

```vb
Dim pair As (Name As String, Count As Integer) = ("jobs", 3)
Console.WriteLine($"{pair.Name}: {pair.Count}")

Dim (n, c) = pair
```

Unnamed elements appear as `Item1`, `Item2`, …. Prefer named elements at public boundaries. Tuples are **value** shapes for short-lived returns—not a replacement for real DTOs when the shape is stable or serialized.

### 8. Current language features you may see in libraries

On current Visual Basic (**17.13** / Visual Studio **2026**-era compilers), the compiler also recognizes the **`unmanaged`** generic constraint and **`OverloadResolutionPriorityAttribute`** for method resolution—mainly for **interop and library APIs** authored across languages. If a call “should resolve” and does not, check **language version** and the library’s target—not only your syntax.

---

## 3. Applications and use cases

| Angle | How types and Options show up |
|-------|-------------------------------|
| **Application** | Strict On catches bad conversions before users do. |
| **Systems** | Mixed Strict settings across projects complicate shared libraries. |
| **Security** | Implicit conversions and late binding obscure validation; Compare settings affect authZ string checks. |
| **Ops** | Config parsing should use `TryParse`, not hope. |
| **SE** | PR templates require Explicit/Strict On for new VB files. |

**Whole-engineering picture:** Options are compiler policy. Weak policy in a LOB module becomes production incident policy.

---

## 4. Staff-level review checklist

- New VB files show **`Option Explicit On`** and **`Option Strict On`** (or equivalent project defaults verified).
- Locals use **`As`** or safe Infer—not undeclared names.
- `Object` and late binding appear only with a written interop reason.
- `Nothing` checks exist before dereference on uncertain references.
- Boundary input uses **`TryParse`** / validated converters.
- `Option Compare` is consistent; security compares don’t rely on accidental Text mode.
- Tightening Strict is paired with tests—not a drive-by on Friday.
- Reviewers can state nullable/`Nothing` expectations for public APIs.
- Tuple returns at public APIs are named (or replaced with DTOs) when the shape is shared or serialized.

---

## References

- [Visual Basic — Option Explicit](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/option-explicit-statement)
- [Option Strict Statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/option-strict-statement)
- [Option Infer Statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/option-infer-statement)
- [Option Compare Statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/option-compare-statement)
- [Data types in Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/data-types/)
- [Nothing keyword](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/nothing)
- [Tuples (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/data-types/tuples)
- [What's new for Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/)
- [Configure language version](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/configure-language-version)
