# C# — LINQ and async/await

[← C# README](./README.md)

**LINQ** (Language Integrated Query) provides a consistent syntax to query collections, databases, or other sources. You use **from**, **where**, **select**, and other clauses (query syntax) or extension methods like **Where**, **Select**, **OrderBy** (method syntax). **async** and **await** allow asynchronous code without blocking: an **async** method can **await** an operation that completes later, and control returns to the caller until the await completes. LINQ simplifies data shaping and filtering; async/await keeps responsiveness during I/O or other slow work.

**Why LINQ?** It expresses filtering, projection, and aggregation in a readable, composable way and works over in-memory collections, EF Core, and other providers. **Why async/await?** I/O-bound work (HTTP, file, database) can run without blocking threads; the async method returns a task and continues when the operation completes.

---

## LINQ query and method syntax

Query syntax looks like SQL; method syntax uses extension methods. Both produce the same result. Common operators: **Where**, **Select**, **OrderBy**, **GroupBy**, **Join**, **First**, **Single**, **Any**, **Count**, **Sum**.

```csharp
var numbers = new[] { 1, 2, 3, 4, 5 };
var evens = from n in numbers where n % 2 == 0 select n;
var evens2 = numbers.Where(n => n % 2 == 0);
var sum = numbers.Sum();
```

---

## async and await

Mark a method **async** and return **Task** or **Task&lt;T&gt;** (or **ValueTask**). **await** an asynchronous operation; the method pauses until the operation completes and then continues. Use **async** only when the method contains at least one **await** (or returns a task for consistency).

```csharp
async Task<string> FetchAsync()
{
    using var client = new HttpClient();
    return await client.GetStringAsync("https://example.com");
}

await FetchAsync();
```

---

## Async best practices

Avoid **async void** except for event handlers. Prefer **ConfigureAwait(false)** in library code when you do not need the original context. Do not block on tasks with **.Result** or **.Wait()** in async contexts; use **await** instead.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)
- [C# documentation: Async and await](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/)
