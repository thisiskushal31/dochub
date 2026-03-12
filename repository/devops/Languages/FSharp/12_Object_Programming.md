# Object programming

[← Back to F#](./README.md)

F# has full support for **object-oriented** features: **classes**, **interfaces**, **inheritance**, and **members**. You use them when you need to implement .NET interfaces, extend base classes, or model stateful objects. In F# you often keep OOP at the boundaries (e.g. implementing an interface or wrapping a C# type) and use modules and functions for core logic. This section covers classes and interfaces so you can read and write F# that interoperates with .NET and uses OOP where it fits.

**Why object programming matters.** The .NET ecosystem is object-oriented; many APIs expect classes and interfaces. F# types (records, DUs) are compiled to .NET types; when you need mutable state, inheritance, or to implement a specific interface, you use classes and members. Understanding F# OOP helps you consume and expose .NET APIs and work in mixed F#/C# codebases.

**Classes.** A **class** is defined with **type** and a primary constructor (arguments after the type name). You can add **member** methods and properties. Use **new** to construct (or omit it if there is a constructor). Classes are reference types; they can be mutable. Use them when you need identity, inheritance, or to satisfy a .NET API.

```fsharp
type Counter(initial: int) =
    let mutable count = initial
    member _.Increment() = count <- count + 1
    member _.Value = count
let c = Counter(0)
c.Increment()
printfn "%d" c.Value
```

**Interfaces.** An **interface** declares a set of members; a class **implements** it with **interface** *InterfaceName* **with** ... . F# can implement .NET interfaces so F# types work with C# and libraries that depend on those interfaces. Use interfaces for abstraction and for interop.

**Object expressions.** When you need a one-off implementation of an interface without defining a named class, use an **object expression**: `{ new IInterface with member ... }`. That is useful for callbacks, adapters, and test doubles.

**Why this matters.** F# code that calls C# or implements plugins often uses classes and interfaces. Keeping OOP at the edges and using functional types and modules in the core keeps F# code maintainable. In security and DevOps, understanding how F# types map to .NET helps when auditing or serializing objects.

---

## Further reading

- [Classes (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/classes)
- [Interfaces (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/interfaces)
- [Object Expressions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/object-expressions)
- [Inheritance (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/inheritance)
