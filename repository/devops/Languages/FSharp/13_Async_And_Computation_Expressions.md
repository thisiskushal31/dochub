# Async and computation expressions

[← Back to F#](./README.md)

**Async** expressions let you write asynchronous code in a sequential style: you **let!** bind the result of an async operation and **do!** for async operations that return unit. Under the hood, the compiler builds a state machine so that I/O and other async work do not block the thread. **Computation expressions** are a general mechanism that provides this kind of “custom” syntax (async, task, seq, and others). This section covers async and the idea of computation expressions so you can write and read asynchronous F# code.

**Why async and computation expressions matter.** Modern services and clients do I/O asynchronously; blocking threads would limit scalability. F# **async** and .NET **Task** are the main ways to express that. Computation expressions appear in async blocks, task blocks, sequences, and query builders; recognizing the **let!** / **do!** pattern helps you read and write non-blocking code.

**Async workflow.** An **async** block is a computation expression: `async { ... }`. Inside it, **let!** binds the result of another async (e.g. `let! data = httpClient.GetStringAsync url`), and **do!** runs an async that returns unit. The block itself has type `Async<'T>`. Run it with **Async.RunSynchronously** (for tests or console) or **Async.Start** (fire-and-forget), or compose it with other asyncs and run at the top level. Prefer **Async** for F#-centric code; use **task** when interoperating with .NET APIs that use **Task**.

```fsharp
open System.Net.Http
let fetch url = async {
    use client = new HttpClient()
    let! html = client.GetStringAsync url |> Async.AwaitTask
    return html.Length
}
let length = fetch "https://example.com" |> Async.RunSynchronously
```

**Task expressions.** **task { ... }** is similar but produces a **System.Threading.Tasks.Task&lt;'T&gt;**. Use **let!** and **do!** with task-returning methods. Task is the standard in .NET for async; use task when you are in a C#-style or ASP.NET context and need to return or accept **Task**. Both **async** and **task** support **use!** for disposable resources so that cleanup runs when the block completes.

**Running multiple async operations.** **Async.Parallel** takes a sequence of **Async&lt;'T&gt;** and returns an **Async&lt;'T[]&gt;** that runs them concurrently and waits for all. Use it when you have several independent I/O operations (e.g. multiple HTTP requests) and want to run them in parallel. For **task**, use **Task.WhenAll** or equivalent. Avoid starting many unbounded concurrent operations; use throttling or batching if needed.

**Cancellation.** Both **async** and **task** support cancellation. **Async** workflows accept an optional **CancellationToken** (e.g. **Async.RunSynchronously(work, cancellationToken = token)**). Inside **task { }**, **let!** and **do!** respect the ambient cancellation token. In web and long-running jobs, pass the request or job cancellation token so that work can be cancelled when the request is aborted or the job is stopped.

**Computation expressions in general.** A computation expression is defined by a **builder** type with methods like **Bind**, **Return**, **Combine**. The **async** and **task** builders implement these so that **let!** and **return** have the right semantics (e.g. **let!** awaits without blocking the thread). Other builders (e.g. **seq**, **query**) provide different semantics. You do not need to implement a builder to use async or task; understanding that they are computation expressions helps when reading code.

**Why this matters.** Async and task are how F# and .NET handle concurrency for I/O. Using them correctly avoids blocking and improves throughput. In DevOps and services, async HTTP calls, file I/O, and database access are common; this pattern is the standard way to express them in F#.

---

## Further reading

- [Async Expressions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/async-expressions)
- [Task Expressions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/task-expressions)
- [Computation Expressions (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/computation-expressions)
