# C# — Delegates, events, and generics

[← C# README](./README.md)

**Delegates** are types that represent references to methods with a specific signature. They enable callbacks and pluggable behavior. **Events** are a pattern built on delegates: a type exposes an event, and subscribers attach handlers that are invoked when the event is raised. **Generics** let you define types and methods parameterized by type (e.g. `List<T>`, `Dictionary<K,V>`) so you get type safety and reuse without duplication. Delegates and events are used for callbacks and loose coupling; generics are used throughout the library and your own APIs.

**Why delegates?** They allow passing behavior as a value (e.g. to sort, filter, or callback). **Why events?** They implement the publish-subscribe pattern: the publisher raises an event without knowing the subscribers. **Why generics?** They give you one implementation that works for any type (e.g. `List<int>`, `List<string>`) with full type checking.

---

## Delegates

Declare a **delegate** type with a signature; then create instances that refer to methods matching that signature. Invoke the delegate like a method. **Func&lt;T&gt;** and **Action** are built-in delegate types for common signatures.

```csharp
delegate int BinaryOp(int a, int b);

int Add(int a, int b) => a + b;
BinaryOp op = Add;
int result = op(1, 2);

Func<int, int, int> add = Add;
```

---

## Events

An **event** is declared with **event** and a delegate type. Only the declaring type can raise the event (invoke the delegate); others can add or remove handlers with **+=** and **-=**. Use **EventHandler** or **EventHandler&lt;TEventArgs&gt;** for the standard pattern.

```csharp
class Publisher
{
    public event EventHandler? OnDone;
    public void Run()
    {
        // ...
        OnDone?.Invoke(this, EventArgs.Empty);
    }
}

publisher.OnDone += (s, e) => Console.WriteLine("Done");
```

---

## Generics

**Generic** types and methods have **type parameters** (e.g. **T**). The same code works for any type; the compiler enforces consistency. **Constraints** (e.g. **where T : IComparable**) restrict the type parameter.

```csharp
class Box<T>
{
    public T Value { get; set; }
}

int GetMax<T>(T a, T b) where T : IComparable<T> =>
    a.CompareTo(b) >= 0 ? a : b;
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Delegates](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/)
- [C# documentation: Generics](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics)
