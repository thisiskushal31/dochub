# C# — Methods

[← C# README](./README.md)

**Methods** are members that perform an action or compute a value. They have a name, optional parameters, and a return type (or **void**). Parameters can have default values and can be passed by value, **ref**, or **out**. **Overloading** allows multiple methods with the same name but different parameter lists. Methods are the main unit of reusable logic.

**Why methods?** They encapsulate behavior, avoid duplication, and make the call site readable. Overloading lets you provide the same logical operation for different parameter types or counts without inventing new names.

---

## Defining and calling methods

Define a method with a return type, name, and parameter list. The body is a block of statements. **return** exits the method and optionally returns a value. Call a method by name with arguments; the same method can be called multiple times from different places. For methods that do not use instance data, **static** allows calling them without an object (e.g. **Main** and helper methods in the same class).

```csharp
static int Add(int a, int b)
{
    return a + b;
}

static void Greet(string name)
{
    Console.WriteLine($"Hello, {name}");
}

static void Main(string[] args)
{
    int sum = Add(1, 2);
    Greet("World");
    Greet("C#");
}
```

---

## Parameters and return values

Parameters are passed by value by default (a copy of the value). Use **ref** to pass by reference so the method can modify the variable. Use **out** when the method must assign a value to the parameter. **params** allows a variable number of arguments.

```csharp
bool TryParse(string s, out int result)
{
    return int.TryParse(s, out result);
}
```

---

## Default and named arguments

Parameters can have default values. Callers can omit those arguments or use **named arguments** to specify parameters by name.

```csharp
void Log(string message, bool toFile = false) { }

Log("Hi");
Log("Hi", toFile: true);
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/methods)
