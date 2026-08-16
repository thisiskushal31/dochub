# Async and Task literacy

[← Back to VB.NET](./README.md)

## What this chapter covers

**`Async Function` / `Async Sub`**, **`Await`**, **`Task` / `Task(Of T)`**, and **`CancellationToken`** literacy for VB.NET on modern .NET (with Framework 4.x brownfield notes). Goal: keep I/O non-blocking without inventing deadlocks via sync-over-async. Parallel depth for the CLR story sits in [C# LINQ and async](../CSharp/17_LINQ_And_Async_Await.md); exceptions still follow chapter **08**.

You leave able to read async call chains, propagate cancellation, and reject `.Result` / `.Wait()` anti-patterns in UI and ASP.NET-style hosts.

---

## 1. Concepts

### 1. Why async exists

I/O (HTTP, files, database) spends time waiting. **Async** frees the thread to do other work until the operation completes, improving scalability and UI responsiveness. CPU-bound work still needs careful offloading (`Task.Run`)—async is not magic parallelism.

### 2. `Async` and `Await`

Mark methods `Async`. Prefer **`Async Function … As Task`** or **`Async Function … As Task(Of T)`**. Inside, `Await` an awaitable (usually a `Task`).

```vb
Public Async Function LoadTextAsync(path As String) As Task(Of String)
    Return Await File.ReadAllTextAsync(path)
End Function
```

`Await` unwraps the result or throws into the method’s exception flow (catch with `Try` as in sync code).

### 3. `Async Sub` is a special case

`Async Sub` exists primarily for **event handlers** that cannot return `Task`. Exceptions from `Async Sub` are harder to observe and can fault the process unexpectedly. Prefer `Async Function` returning `Task` everywhere else—including entry points you can hook.

```vb
Private Async Sub Button_Click(sender As Object, e As EventArgs) Handles Button1.Click
    Try
        Await SaveAsync()
    Catch ex As Exception
        ShowError(ex)
    End Try
End Sub
```

Always catch inside `Async Sub` handlers.

### 4. Tasks represent ongoing work

`Task` = work with no result; `Task(Of T)` = work producing `T`. Status includes RanToCompletion, Faulted, Canceled. Combinators: `Task.WhenAll`, `Task.WhenAny`, `Task.Delay`.

```vb
Await Task.WhenAll(LoadAAsync(), LoadBAsync())
```

### 5. CancellationToken literacy

Cooperative cancel: pass a `CancellationToken` into APIs that accept it; throw `OperationCanceledException` when canceled. Link tokens with `CancellationTokenSource`.

```vb
Public Async Function DownloadAsync(url As String, ct As CancellationToken) As Task(Of Byte())
    Using client As New HttpClient()
        Return Await client.GetByteArrayAsync(url, ct)
    End Using
End Function
```

Do not ignore tokens on public async APIs that can run long. Treat cancel as **control flow**, not a generic business failure (map separately in logs/UI).

### 6. ConfigureAwait literacy

In library code that does not need the original SynchronizationContext (classic ASP.NET on Framework / UI apps), `Await someTask.ConfigureAwait(False)` avoids forcing resumption on the captured context and reduces deadlock risk. **ASP.NET Core** typically does not use that classic sync-context model the same way—still avoid `.Result` / `.Wait()` on thread-pool code. App-level UI code often **wants** the context so you can touch controls after await. Know which layer you are in.

---

## 2. Advanced concepts

### 1. Sync-over-async pitfalls

```vb
' Smell — can deadlock on UI / classic ASP.NET sync context
Dim s = LoadTextAsync(path).Result
LoadTextAsync(path).Wait()
```

Blocking on async work while the awaited continuation needs the same thread/context is a classic hang. Staff rule: **async all the way** from the entry point, or use proven bridge patterns at a single boundary—not `.Result` sprinkled through the stack.

### 2. Exception propagation

Exceptions from awaited tasks throw at the `Await` site. `Task.WhenAll` faults with `AggregateException` containing inner failures—unwrap for logging. Do not fire-and-forget `Async Function` calls without observing the task (`Await`, or explicit exception logging continuation).

### 3. Framework 4.x brownfield

Async/await exists on .NET Framework 4.5+. Many older VB WinForms apps still block on the UI thread. HttpClient, ADO.NET async methods, and EF6 async APIs may be available—verify the target. Some older libraries are sync-only; wrap carefully with `Task.Run` only for **CPU** or truly blocking calls, and document thread-pool pressure.

### 4. ValueTask door

Modern APIs sometimes return `ValueTask` / `ValueTask(Of T)` to reduce allocations when results are often synchronous. Literacy: consume with `Await`; do not await the same `ValueTask` twice. New VB app code can return `Task` unless you are writing high-churn library APIs.

### 5. Concurrency vs parallelism

`Await` sequentializes dependent steps. Independent I/O: start tasks, then `WhenAll`. True parallel CPU work: `Parallel` / `Task.Run` with care—not every `Async` method.

### 6. Timeouts

Prefer `CancellationToken` with `CancelAfter` or API-native timeouts over orphaned tasks. Always dispose `CancellationTokenSource` when you own it.

### 7. Async streams door

Modern .NET supports `IAsyncEnumerable(Of T)` and `Await Each` patterns in supporting language versions. Treat as a door when consuming modern BCL/EF APIs; brownfield Framework code often lacks them.

### 8. Observing background work

If you must start work without awaiting immediately (rare), store the `Task`, and attach error logging:

```vb
Dim t = RunJobAsync(ct)
t.ContinueWith(
    Sub(task)
        If task.IsFaulted Then LogError(task.Exception)
    End Sub,
    TaskContinuationOptions.OnlyOnFaulted)
```

Prefer structured ownership (`Await` in the request scope, hosted service loops) over orphaned continuations. Hosted services should honor stop tokens so shutdown does not tear down mid-write without cleanup.

### 9. Testing async VB

Test async methods with async test methods and `Await`—do not `.Result` in tests either (same deadlock class on some runners). Assert cancellation by canceling a token and expecting `OperationCanceledException` / `TaskCanceledException` as appropriate.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | UI event handlers `Await` service calls; show busy state; catch inside `Async Sub` |
| **Systems** | Propagate `CancellationToken` from request abort / host shutdown |
| **Security** | Cancel abandoned requests; do not leave authenticated work running after client disconnect without policy |
| **Operations** | Log cancels separately from faults; avoid thread-pool starvation from sync-over-async |
| **Software engineering** | Public APIs return `Task`/`Task(Of T)`; ban `.Result` in new code reviews |

---

## 4. Staff-level review checklist

- `Async Function` returning `Task`/`Task(Of T)` preferred; `Async Sub` limited to event handlers with local `Try`/`Catch`.
- No `.Result` / `.Wait()` / `.GetAwaiter().GetResult()` on paths that can capture a sync context.
- `CancellationToken` accepted and passed through long I/O chains.
- `OperationCanceledException` not misreported as unexpected failure.
- Fire-and-forget tasks are observed or explicitly justified with exception logging.
- `ConfigureAwait(False)` used appropriately in libraries; UI code resumes on needed context.
- `WhenAll` exception aggregation understood and logged.
- Timeouts implemented via cancellation or API settings, not abandoned awaits.
- CPU-bound work not marked async without real awaits or explicit offload rationale.
- Host shutdown cancels in-flight work where supported.
- Background tasks are observed; faults logged; stop tokens honored in loops.
- Async tests `Await` results instead of blocking on tasks.

---

## References

- [Async and Await (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/concepts/async/)
- [Asynchronous programming with Async and Await](https://learn.microsoft.com/en-us/dotnet/standard/async/)
- [Task class](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task)
- [CancellationToken](https://learn.microsoft.com/en-us/dotnet/api/system.threading.cancellationtoken)
- [Task.ConfigureAwait](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.configureawait)
- [Async return types (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/concepts/async/async-return-types)
- [Cancellation in managed threads](https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads)
