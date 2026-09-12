# C# — Interfaces, structs, and enums

[← C# README](./README.md)

**Interfaces** define a contract: a set of members (methods, properties) that implementing types must provide. A class can implement multiple interfaces. **Structs** are value types that can hold data and behavior but do not support inheritance (except from System.ValueType). **Enums** are value types that define a set of named constants. Interfaces enable polymorphism without inheritance; structs are for small, copyable data; enums make intent clear for fixed sets of values.

**Why interfaces?** They allow multiple unrelated types to share a contract (e.g. IComparable, IDisposable) and support dependency injection and testing. **Why structs?** They avoid heap allocation for small data (e.g. Point, Range) and are copied by value. **Why enums?** They replace magic numbers with named values (e.g. Status.Pending).

---

## Interfaces

An **interface** declares members without implementation. A class **implements** an interface by providing implementations for all its members. A variable of the interface type can hold any implementing instance.

```csharp
interface ILogger
{
    void Log(string message);
}

class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
}

ILogger logger = new ConsoleLogger();
```

---

## Structs

**struct** defines a value type. Structs are copied on assignment and when passed by value. They can have constructors, properties, and methods but cannot inherit from another struct (only from ValueType). Use structs for small, immutable or short-lived data.

```csharp
struct Point
{
    public int X, Y;
    public Point(int x, int y) { X = x; Y = y; }
}
```

---

## Enums

**enum** defines a set of named integral constants. The underlying type is int by default but can be specified. Use enums for fixed sets of related values.

```csharp
enum Status { Pending, Active, Completed }
Status s = Status.Active;
int value = (int)Status.Completed;
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Interfaces](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces)
- [C# documentation: Structs](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/struct)
