# C# — Variables and constants

[← C# README](./README.md)

**Variables** hold values that can change; they must be declared with a type (or **var**) and optionally initialized. **Constants** are declared with **const** and must be initialized with a compile-time constant value; they cannot change. **Readonly** fields are set once (e.g. in a constructor) and then cannot be reassigned. Using constants and readonly where appropriate makes intent clear and prevents accidental modification.

**Why constants and readonly?** Constants (e.g. max size, fixed message) document that a value never changes and allow the compiler to optimize. Readonly fields are for values that are set once per instance (e.g. dependency-injected services) and should not be reassigned later.

---

## Declaring and initializing variables

Declare a variable with its type and an optional initializer. Local variables must be assigned before use (the compiler checks definite assignment). You can declare multiple variables of the same type in one statement, optionally with initializers.

```csharp
int x;
x = 5;

string greeting = "Hello";
var number = 10;

int a = 1, b = 2, c = 3;
```

---

## Constants

**const** is used for values that are known at compile time and never change. Const fields are implicitly static.

```csharp
const int MaxSize = 100;
const string AppName = "MyApp";
```

---

## Readonly

**readonly** fields can be set in the constructor or at declaration; after that they cannot be reassigned. Used for instance-level values that should not change after construction.

```csharp
class Service
{
    private readonly ILogger _logger;
    public Service(ILogger logger) => _logger = logger;
}
```

---

## Further reading

- [C# README](./README.md) — Topic index.
