# Generics, delegates, events, and lambdas

[← Back to VB.NET](./README.md)

## What this chapter covers

**Generics (`Of T`)**, **delegates**, **`AddressOf`**, **events** (`Event`, `WithEvents` / `Handles`, `RaiseEvent`), and **lambda** `Function` / `Sub` expressions. These are how VB.NET expresses callbacks, publish/subscribe, and type-safe collections on the same CLR as [C# delegates, events, and generics](../CSharp/16_Delegates_Events_And_Generics.md). WinForms-era `WithEvents` still appears in brownfield UI; modern libraries lean on lambdas and `Func`/`Action`.

You leave able to read generic APIs, wire events without leaking subscriptions, and choose between named methods and lambdas deliberately.

---

## 1. Concepts

### 1. Generics `Of T`

Generics parameterize types and methods so one implementation works for many type arguments with compile-time safety—no boxing tax for value types in `List(Of Integer)` the way a non-generic `ArrayList` imposed.

```vb
Dim names As New List(Of String) From {"ann", "bo"}
Dim map As New Dictionary(Of String, Integer)
```

Declare your own:

```vb
Public Class Box(Of T)
    Public Property Value As T
End Class

Public Function FirstOrFallback(Of T)(items As IList(Of T), fallback As T) As T
    If items Is Nothing OrElse items.Count = 0 Then Return fallback
    Return items(0)
End Function
```

Constraints (`Of T As {Class, New, IComparable(Of T)}`) document what `T` must provide. Prefer constraints over runtime casts.

### 2. Delegates

A **delegate** is a type-safe method reference. Built-ins cover most cases:

| Delegate | Shape |
|----------|--------|
| `Action` / `Action(Of T)` | Sub-like, returns nothing |
| `Func(Of TResult)` / `Func(Of T, TResult)` | Function-like |
| `Predicate(Of T)` | `Function(T) As Boolean` |
| `EventHandler` / `EventHandler(Of TEventArgs)` | Sender + args |

```vb
Dim add As Func(Of Integer, Integer, Integer) =
    Function(a, b) a + b
Console.WriteLine(add(2, 3))
```

Custom `Delegate` declarations still appear in older APIs; prefer `Func`/`Action` for new code unless you need a distinct nominal type.

### 3. `AddressOf`

`AddressOf MethodName` creates a delegate to a named method. Required when the handler must match an event signature and you want a stable, testable method rather than an inline lambda.

```vb
AddHandler button.Click, AddressOf OnClick
```

### 4. Events

Declare with `Event`, raise with `RaiseEvent`. Subscribers use `AddHandler` / `RemoveHandler`, or the WinForms pattern `WithEvents` + `Handles`.

```vb
Public Class Worker
    Public Event Progress As EventHandler(Of ProgressEventArgs)

    Public Sub Run()
        RaiseEvent Progress(Me, New ProgressEventArgs(50))
    End Sub
End Class
```

Only the declaring type should raise its own events. Handlers must be **removed** when the subscriber dies, or you leak memory (especially forms and long-lived publishers).

### 5. Lambdas: `Function` and `Sub`

Inline expressions:

```vb
Dim evens = numbers.Where(Function(n) n Mod 2 = 0)
items.ForEach(Sub(x) Console.WriteLine(x))
```

Multi-line lambdas use `Function`/`Sub` … `End Function`/`End Sub`. Capture variables carefully—loops capturing the loop variable by reference historically surprised people; prefer clear locals.

---

## 2. Advanced concepts

### 1. Covariance and constraints literacy

`IEnumerable(Of Out T)` is covariant: you can treat `IEnumerable(Of Dog)` as `IEnumerable(Of Animal)` when safe. Contravariance appears on input positions (`Action(Of In T)`). You do not need to invent variance daily; you need to understand why some assignments compile and others do not.

### 2. `WithEvents` / `Handles` vs `AddHandler`

| Pattern | Where it shines | Risk |
|---------|-----------------|------|
| `WithEvents` + `Handles` | WinForms designers, single field lifetime | Hidden wiring; harder to unsubscribe selectively |
| `AddHandler` / `RemoveHandler` | Explicit lifetimes, dynamic subscribe | Easy to forget `RemoveHandler` |

Staff review: every `AddHandler` has a matching remove on dispose/unload, or the publisher is short-lived by design.

### 3. Thread affinity and events

UI events expect handlers on the UI thread. Raising from background threads without marshaling causes cross-thread exceptions in WinForms/WPF. Document which thread raises the event.

### 4. Generics and nullable / reference constraints

On modern .NET with nullable reference types enabled for VB where supported, constraints interact with nullability annotations. Brownfield Framework 4.x projects often lack NRT—do not assume `T` is non-null without checks.

### 5. Multicast delegates

Delegates combine with `+`/`Combine`; events are multicast. One failing handler can prevent later handlers unless you invoke carefully. For critical fan-out, iterate `GetInvocationList` and isolate faults.

### 6. Lambdas vs named methods

Prefer **named methods** when logic is non-trivial, needs tests, or must be removed from an event. Prefer **lambdas** for short predicates in LINQ and local adapters. Capturing `Me` in long-lived callbacks extends object lifetime.

### 7. Generic variance at API boundaries

Expose `IEnumerable(Of T)` for outputs you do not want mutated; expose `IReadOnlyList(Of T)` when indexing matters. Avoid returning `List(Of T)` if callers must not mutate your internals.

### 8. Extension methods (authoring)

LINQ’s method syntax is mostly **extension methods**. You can author your own in a `Module` with `<Extension()>`:

```vb
Imports System.Runtime.CompilerServices

Module StringExtensions
    <Extension()>
    Public Function Truncate(text As String, maxLen As Integer) As String
        If text Is Nothing OrElse text.Length <= maxLen Then Return text
        Return text.Substring(0, maxLen)
    End Function
End Module
```

After `Imports` of the module’s namespace, callers write `s.Truncate(10)`. Staff review:

| Habit | Why |
|-------|-----|
| Keep extensions pure and cheap | Hidden cost in `For Each` looks like field access |
| Do not mutate unexpectedly | Callers assume fluent helpers are safe |
| Prefer instance methods on types you own | Extensions are for types you cannot change |
| Discoverability needs `Imports` | Missing import = “method not found” noise |

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | UI events thin; business work in services; lambdas for query filters |
| **Systems** | Callbacks for completion; avoid event storms without backpressure |
| **Security** | Do not attach handlers that run under elevated privileges without checks; validate event args |
| **Operations** | Unsubscribe on shutdown; log handler exceptions so one bad subscriber does not fail silently forever |
| **Software engineering** | Generic repositories/helpers constrained honestly; ban non-generic collections in new code |

Office VBA “events” are host Application events—not CLR delegates ([VBA events](../VBA/12_Events_And_Auto_Macros.md)). Keep the models separate when modernizing macros toward .NET.

---

## 4. Staff-level review checklist

- New collections and APIs use generics; no needless `ArrayList` / `Hashtable`.
- Constraints on `Of T` match actual member usage.
- Events have clear raise ownership; subscribers unsubscribe appropriately.
- `WithEvents`/`Handles` vs `AddHandler` chosen deliberately for lifetime.
- Lambdas stay short or are extracted to named methods.
- Captures do not extend lifetimes of expensive or disposable objects unexpectedly.
- Cross-thread event raises marshaled for UI frameworks.
- `Func`/`Action` preferred over custom delegates unless a nominal type is required.
- Handler failures isolated or logged on multicast critical paths.
- Public APIs prefer read-only sequence types over leaking mutable lists.
- Custom extension methods are pure, discoverable via `Imports`, and justified vs instance methods.

---

## References

- [Generics (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/data-types/generic-types)
- [Delegates (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/delegates/)
- [Events (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/events/)
- [Lambda expressions](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/lambda-expressions)
- [AddressOf operator](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/operators/addressof-operator)
- [Extension methods](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/procedures/extension-methods)
- [Generic collections in .NET](https://learn.microsoft.com/en-us/dotnet/standard/collections/)
