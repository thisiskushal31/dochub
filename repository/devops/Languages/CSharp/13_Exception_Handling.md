# C# — Exception handling

[← C# README](./README.md)

**Exceptions** represent errors or exceptional conditions. You **throw** an exception to signal failure and **catch** it in a **try/catch** block to handle it. **finally** runs whether or not an exception occurred (e.g. to release resources). Unhandled exceptions terminate the program or propagate to the caller. Using exceptions for error paths keeps normal logic clear and centralizes handling.

**Why exceptions?** They separate “what went wrong” from “what to do about it.” You can throw from deep in the call stack and handle at a higher level, or let the program fail with a clear message. For expected cases (e.g. “not found”), returning null or a result type is often better; reserve exceptions for unexpected or unrecoverable failures.

---

## try, catch, and finally

**try** wraps code that might throw. **catch** catches exceptions by type; you can have multiple catch blocks. **finally** runs after try (and catch if present), whether or not an exception was thrown. Use **throw** to rethrow the same exception or throw a new one.

```csharp
try
{
    DoWork();
}
catch (ArgumentException ex)
{
    Log(ex.Message);
}
catch (Exception ex)
{
    Log(ex.ToString());
    throw;
}
finally
{
    Cleanup();
}
```

---

## Exception types

**Exception** is the base type. Common derived types include **ArgumentException**, **InvalidOperationException**, **IOException**, **UnauthorizedAccessException**. Catch specific types first, then more general ones. Avoid catching **Exception** unless you log and rethrow or handle appropriately.

---

## Throwing exceptions

Throw with **throw new SomeException("message")**. Include a meaningful message and, when useful, the inner exception. Use **throw;** (no operand) inside catch to rethrow and preserve the stack trace.

```csharp
if (value < 0)
    throw new ArgumentOutOfRangeException(nameof(value), value, "Must be non-negative");
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Exceptions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/)
