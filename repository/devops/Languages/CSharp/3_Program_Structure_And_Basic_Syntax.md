# C# — Program structure and basic syntax

[← C# README](./README.md)

A C# program is organized into **namespaces**, **types** (classes, structs, interfaces, enums), and **members** (methods, properties, fields). Execution starts at the **Main** method or with **top-level statements**. Statements end with a semicolon; blocks use curly braces. Understanding this structure is essential to read and write any C# file.

**Why this structure?** Namespaces group types and avoid name clashes. Types hold data and behavior. The entry point (Main or top-level statements) is where the runtime begins execution. This layout keeps code organized and predictable.

---

## Namespace and type

Types are declared inside a **namespace**. The **using** directive imports namespaces so you can refer to types without the full name.

```csharp
using System;

namespace MyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

---

## Top-level statements

In modern C#, you can omit the explicit namespace, class, and Main and write **top-level statements** in the entry file. The compiler generates the Main wrapper.

```csharp
using System;

Console.WriteLine("Hello, World!");
```

---

## Comments and output

**Single-line comments** use `//`. **Multi-line comments** use `/* ... */`. **XML documentation** uses `///` for API docs. To write to the console, use **Console.WriteLine** (with newline) or **Console.Write**.

```csharp
// Single-line comment
Console.WriteLine("Output with newline");
Console.Write("Output without newline");
```

---

## User input

**Console.ReadLine()** reads a line of text from the keyboard and returns it as a **string**. For numeric input, parse the string with **int.Parse** or **Convert.ToInt32** (or the appropriate type). If the input is not valid, these throw; use **int.TryParse** for safe parsing.

```csharp
Console.WriteLine("Enter your name:");
string name = Console.ReadLine();

Console.WriteLine("Enter your age:");
int age = Convert.ToInt32(Console.ReadLine());
```

---

## Basic syntax rules

Identifiers (names) start with a letter or underscore. Statements end with `;`. Blocks use `{ }`. C# is **case-sensitive**. Keywords (e.g. `class`, `if`, `return`) cannot be used as identifiers unless prefixed with `@`.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Program structure](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/)
