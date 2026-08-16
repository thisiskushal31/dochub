# Classes, structures, inheritance, and interfaces

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET shapes types: **`Class`**, **`Structure`**, inheritance (`Inherits`, `MustInherit` / `MustOverride`, `Overrides`, `NotInheritable` / `NotOverridable`), **`Implements`**, **`Shared`**, and **`Partial`**. Default mental model: **modern .NET** (reference types, BCL contracts, composition over deep trees). Framework 4.x brownfield still uses the same keywords—watch value-type copies and legacy WinForms partial designers.

You leave able to read a type hierarchy, choose class vs structure honestly, and review shared state and interface seams without confusing VB.NET with [Office VBA](../VBA/README.md). Parallel OOP depth for the same CLR lives in [C# classes](../CSharp/10_Classes_And_Objects.md) and [inheritance](../CSharp/11_Inheritance_And_Polymorphism.md).

---

## 1. Concepts

### 1. Class vs Structure

A **`Class`** is a **reference type**: instances live on the heap; assignment copies a reference. A **`Structure`** is a **value type**: assignment and argument passing copy fields (unless boxed). Prefer classes for identity, lifecycle, and most domain models. Prefer structures for small, immutable data that behaves like a number or coordinate—not as a “lightweight class.”

```vb
Public Class Customer
    Public Property Id As Integer
    Public Property Name As String
End Class

Public Structure Point2D
    Public ReadOnly Property X As Double
    Public ReadOnly Property Y As Double
    Public Sub New(x As Double, y As Double)
        Me.X = x
        Me.Y = y
    End Sub
End Structure
```

Mutable structures that you pass around and mutate in place are a classic review smell: callers often mutate a **copy**.

### 2. Fields, properties, and constructors

Properties (`Property` / `ReadOnly Property`) are the usual public surface. Constructors are `Sub New(...)`. Use overloads for alternate construction; keep validation near the constructor or a factory method so invalid objects do not escape.

```vb
Public Class Account
    Public ReadOnly Property Id As Guid
    Public Property Balance As Decimal

    Public Sub New(id As Guid, openingBalance As Decimal)
        If openingBalance < 0D Then
            Throw New ArgumentOutOfRangeException(NameOf(openingBalance))
        End If
        Me.Id = id
        Me.Balance = openingBalance
    End Sub
End Class
```

### 3. Inheritance basics

`Inherits` selects a single base class. Methods you intend to override must be `Overridable` (or `MustOverride` on an abstract base). Overrides use `Overrides`. Seal a class with `NotInheritable`; seal a method with `NotOverridable` after overriding.

```vb
Public MustInherit Class Shape
    Public MustOverride Function Area() As Double
End Class

Public Class Circle
    Inherits Shape
    Public Property Radius As Double
    Public Overrides Function Area() As Double
        Return Math.PI * Radius * Radius
    End Function
End Class
```

Deep inheritance for “reuse” ages poorly in ops and security reviews. Prefer shallow trees and composition (hold a collaborator) when behavior is optional.

### 4. Interfaces and `Implements`

An **`Interface`** is a contract without implementation (aside from default interface members on newer runtimes—treat those as literacy, not everyday VB style). Classes and structures **`Implements`** one or more interfaces. Every member must be implemented; the compiler enforces the match.

```vb
Public Interface IClock
    Function UtcNow() As DateTimeOffset
End Interface

Public Class SystemClock
    Implements IClock
    Public Function UtcNow() As DateTimeOffset Implements IClock.UtcNow
        Return DateTimeOffset.UtcNow
    End Function
End Class
```

Program against interfaces at module boundaries (repositories, clocks, message senders). That keeps tests and ops substitutes honest.

### 5. `Shared` members

`Shared` is VB’s static: one member shared by the type, not per instance. Use for pure helpers, constants, and factories. Avoid mutable `Shared` state for request/session data—it becomes a concurrency and security hazard under ASP.NET, services, and tests.

```vb
Public Class PathRules
    Public Shared Function IsAbsolute(path As String) As Boolean
        Return System.IO.Path.IsPathRooted(path)
    End Function
End Class
```

### 6. `Partial` types

`Partial Class` / `Partial Structure` / `Partial Interface` (where supported) split one type across files. WinForms / designer code often lives in a generated partial; your logic stays in the other. Do not put secrets or policy in generated partials you cannot review in PRs.

---

## 2. Advanced concepts

### 1. Overloads, shadows, and name resolution

`Overloads` marks intentional overload sets. `Shadows` hides a base member by name—useful rarely, dangerous often, because polymorphic calls through the base type may miss the shadowed member. Prefer `Overrides` when you mean substitutable behavior.

### 2. Access levels and API surface

`Public`, `Friend` (assembly), `Protected`, `Private`, and `Protected Friend` define who can see what. Staff default: smallest useful surface. Leaking `Friend` internals across assemblies couples deployables.

### 3. Structures and interfaces (boxing)

When a structure implements an interface and you pass it as that interface, the value is **boxed**. Repeated boxing in hot loops costs allocations; more importantly, mutating through the interface may not update the original copy you think you hold. Prefer immutable structures or classes when identity matters.

### 4. Default interface members and Framework 4.x

Modern .NET allows default interface methods in C#; VB consumers and implementers must match the runtime and language version. On **.NET Framework 4.x** brownfield, assume classic “all members explicit” interfaces. Do not invent default-member designs that break down-level targets.

### 5. `MyBase`, `MyClass`, and `Me`

`Me` is the current instance. `MyBase` calls the base implementation. `MyClass` binds to the declaring class’s implementation even if overridden—rare and surprising; treat as a review flag unless there is a documented reason.

### 6. Composition over inheritance

Optional capabilities (`IDisposable`, logging, metrics) are usually better as injected dependencies than as base-class baggage. Inheritance for shared fields across unrelated domains creates god-bases that every service change must touch.

### 7. Equality literacy

Reference types default to reference equality unless you override `Equals` / `GetHashCode` (or use records-style patterns elsewhere). Structures get value-ish field equality by default but custom equality still needs care for collections and dictionaries. Do not use mutable structures as dictionary keys.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Domain entities as classes; DTOs as simple classes or immutable structures; UI code-behind partials stay thin |
| **Systems** | Ports as interfaces (`IFileStore`, `IClock`); adapters implement them; avoid shared mutable caches without locks or concurrent collections |
| **Security** | No secrets in `Shared` fields or partial designer files; seal types that must not be subclassed for security-sensitive logic |
| **Operations** | Health/check components as small classes with clear lifetimes; log type names that match runbooks |
| **Software engineering** | Shallow `Inherits`; prefer `Implements` for contracts; review `Shadows` and mutable `Structure` as smells |

When modernizing toward C#, the same CLR types map closely—see [C# interfaces, structs, and enums](../CSharp/12_Interfaces_Structs_And_Enums.md). VBA’s `Class` modules are a different host model ([VBA objects](../VBA/07_Objects_With_CreateObject_And_GetObject.md)).

---

## 4. Staff-level review checklist

- Class vs Structure choice matches identity and copy semantics; no mutable struct footguns.
- `Overridable` / `Overrides` / `MustOverride` used deliberately; `Shadows` justified or removed.
- Inheritance depth stays shallow; composition preferred for optional behavior.
- Interfaces define real boundaries; every `Implements` member is intentional.
- Mutable `Shared` state reviewed for concurrency and test isolation.
- `Partial` splits keep generated code separate from business logic and secrets.
- Access modifiers minimize public/Friend surface across assemblies.
- Constructors validate invariants; invalid objects do not escape.
- Boxing of structures through interfaces understood on hot or mutable paths.
- Target framework (modern .NET vs Framework 4.x) matches interface/language features used.

---

## References

- [Objects and classes (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/objects-and-classes/)
- [Inheritance basics (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/objects-and-classes/inheritance-basics)
- [Interfaces (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/interfaces/)
- [Structures and other value types](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/data-types/structures-and-other-value-types)
- [Shared members](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/objects-and-classes/shared-members)
- [Partial classes and methods](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/objects-and-classes/partial-classes-and-methods)
- [.NET guide — Object-oriented programming](https://learn.microsoft.com/en-us/dotnet/standard/object-oriented-programming)
