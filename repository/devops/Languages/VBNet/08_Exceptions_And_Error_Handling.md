# Exceptions and error handling

[← Back to VB.NET](./README.md)

## What this chapter covers

How VB.NET signals and handles failure: **`Try` / `Catch` / `Finally`**, **`Throw`**, exception types, **`Catch … When`** filters, and deterministic cleanup with **`Using`** (`IDisposable`). Default: **fail visibly**, log with context, dispose resources, and do **not** swallow exceptions. Contrast with VBA’s `On Error` model in [VBA errors](../VBA/05_Errors_On_Error_Err_And_Resume.md). Shared CLR patterns also appear in [C# exception handling](../CSharp/13_Exception_Handling.md).

You leave able to place handlers at the right boundary, choose specific catch types, and review cleanup and logging for production readiness.

---

## 1. Concepts

### 1. Exceptions are control flow for failure

An **exception** aborts the normal path until a matching `Catch` handles it or the process/domain boundary fails the operation. Prefer return values or result types for **expected** “not found” cases; reserve exceptions for contract violations, IO failures, and states the caller cannot sensibly continue from without a policy.

```vb
Try
    DoWork()
Catch ex As ArgumentException
    LogWarning(ex)
    Throw
Finally
    Cleanup()
End Try
```

### 2. `Try`, `Catch`, `Finally`

- **`Try`**: code that may throw.
- **`Catch`**: handle by type; list **specific** types before broader ones.
- **`Finally`**: always runs (success, catch, or pending throw)—use for unlocks and non-`Using` cleanup.

`Catch ex As Exception` at a process edge (API middleware, Windows service loop, UI top-level) is sometimes justified **if** you log and convert to a safe response. Mid-layer empty catches are not.

### 3. Throwing and rethrowing

`Throw New SomeException("message")` creates failure. Inside `Catch`, prefer bare **`Throw`** to rethrow and **preserve the stack trace**. `Throw ex` resets the stack and harms ops triage.

```vb
If path Is Nothing Then
    Throw New ArgumentNullException(NameOf(path))
End If
```

Include an **inner exception** when wrapping: callers see your boundary type; operators still see the root cause.

### 4. Common exception types

| Type | Typical meaning |
|------|-----------------|
| `ArgumentException` / `ArgumentNullException` / `ArgumentOutOfRangeException` | Bad caller input |
| `InvalidOperationException` | Wrong state for this call |
| `IOException` / `UnauthorizedAccessException` | File/OS failures |
| `TimeoutException` | Deadline exceeded |
| `OperationCanceledException` | Cancellation (see async chapter) |

Catch what you can **act on**. Catching `Exception` only to ignore it hides outages.

### 5. `Using` and `IDisposable`

Anything that holds unmanaged or scarce resources (streams, connections, handles) should implement **`IDisposable`**. Prefer:

```vb
Using stream = File.OpenRead(path)
    ' read
End Using
```

`Using` compiles to `Try`/`Finally` with `Dispose`. Nested `Using` blocks dispose in reverse order. Do not rely on finalizers for timely cleanup.

### 6. `SyncLock` (mutual exclusion literacy)

When multiple threads touch the **same mutable state**, VB’s **`SyncLock`** statement serializes a critical section (same idea as C# `lock`):

```vb
Private ReadOnly _gate As New Object()

Public Sub Increment()
    SyncLock _gate
        _count += 1
    End SyncLock
End Sub
```

| Habit | Why |
|-------|-----|
| Lock a **private** dedicated object | Locking `Me` or a publicly visible object invites deadlock from outside |
| Keep the locked region tiny | Long locks stall throughput and invite nested-lock bugs |
| Never `Await` inside `SyncLock` | Holding a monitor across async continuations is a classic deadlock class |
| Prefer concurrent collections when they fit | Less custom locking to get wrong |

Shared mutable `Shared` fields and WinForms “background worker updates UI state” are review hotspots. Prefer higher-level designs (immutable snapshots, channels, concurrent collections) when you can.

### 7. Do not swallow exceptions

```vb
' Smell — failure becomes silent success
Try
    Save()
Catch
End Try
```

If you catch, you must **log, translate, retry with policy, or rethrow**. “We’ll look at it later” is how production incidents go unexplained.

---

## 2. Advanced concepts

### 1. `Catch … When` filters

VB supports exception filters:

```vb
Catch ex As IOException When IsTransient(ex)
    Retry()
```

Filters run **before** the catch block is entered. Keep filter expressions side-effect free and fast. Use them to distinguish transient IO from permanent failure without nesting.

### 2. Domain vs infrastructure failures

Map failures at façades:

| Layer | Example | Caller action |
|-------|---------|---------------|
| **Domain** | Insufficient balance | User-facing message; rarely retry |
| **Infrastructure** | SQL timeout, disk full | Retry/backoff or page ops |
| **Contract** | Bad JSON / schema | Fix producer/consumer; version tolerate |

Do not leak raw SQL or filesystem paths to untrusted clients. Log detail server-side; return safe codes outward.

### 3. Logging and PII

Log **type**, message, stack (or correlation id), and safe properties. Never log passwords, tokens, or full card numbers. Prefer structured logging over string-concat secrets.

### 4. Framework 4.x vs modern .NET

The keywords are the same. Differences show up in **default exception behavior** of libraries (HttpClient, EF), async exception marshaling, and whether `AggregateException` appears from parallel APIs. On brownfield Framework services, still ban sync-over-async as a “fix”—it can deadlock and surface confusing exceptions (async chapter).

### 5. First-chance and unhandled hooks

Debuggers see first-chance exceptions; production should use process-level handlers (`AppDomain.UnhandledException` on older hosts, `AppDomain`/`TaskScheduler` hooks, ASP.NET middleware) to **log and exit or return 500**—not to continue in a corrupt state.

### 6. Custom exceptions

Derive from `Exception` (or a suitable base) when callers must `Catch` a closed set. Stable names and messages matter for runbooks. Avoid huge exception hierarchies for every minor branch.

### 7. `When` vs nested try

Prefer a filter or helper method over deep nested `Try` blocks that obscure the happy path. Nested try is fine for translating at a boundary once.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Validate early with argument exceptions; UI/service edge maps to user-safe errors |
| **Systems** | Transient catches retry with limits; circuit breakers at integration edges |
| **Security** | No stack traces to anonymous clients; no secret material in messages; fail closed on authZ errors |
| **Operations** | Bare `Throw` preserves stacks; correlation ids in logs; distinguish cancel from fault |
| **Software engineering** | Tests assert exception types for contracts; ban empty `Catch`; `Using` on every disposable |

VBA macros often `Resume Next`; VB.NET staff code should not import that culture into services.

---

## 4. Staff-level review checklist

- Specific `Catch` types precede broad ones; empty `Catch` absent or justified in writing.
- Rethrow uses bare `Throw`, not `Throw ex`.
- `Finally` / `Using` dispose resources on all paths.
- `SyncLock` uses a private gate object; locked regions stay small; no `Await` inside the lock.
- Exceptions are not used for ordinary expected control flow without documented reason.
- Messages and logs are free of secrets and unsafe client leakage.
- `Catch … When` filters are pure and intentional.
- Boundary layers map domain vs infrastructure failures for runbooks.
- Unhandled-exception logging exists at the host edge.
- Cancellation (`OperationCanceledException`) not mislabeled as hard failure when appropriate.
- Custom exception types are stable and catchable where needed.

---

## References

- [How to: Catch an exception (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/try-catch-finally-statement)
- [Throwing exceptions](https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/error-types/)
- [Using statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/using-statement)
- [Exception class](https://learn.microsoft.com/en-us/dotnet/api/system.exception)
- [Best practices for exceptions](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)
- [IDisposable](https://learn.microsoft.com/en-us/dotnet/api/system.idisposable)
- [SyncLock statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/synclock-statement)
