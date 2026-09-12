# Coroutines and async

[← Back to Kotlin](./README.md)

Coroutines are Kotlin’s way of writing asynchronous, non-blocking code in a sequential style. They are lightweight compared with threads and are built on suspending functions: code can pause and resume without blocking a thread. The main APIs live in the kotlinx.coroutines library. This topic introduces coroutines, suspending functions, builders, and structured concurrency so you can run concurrent work and integrate with async APIs.

## Why coroutines

Applications often need to do several things at once: handle user input, call networks or databases, and update the UI. Threads work but are relatively heavy; many threads can hurt performance. Coroutines let you express “wait for this result” without blocking a thread: the coroutine suspends, and the thread can run other work. Many coroutines can run on a small number of threads, which is efficient for I/O and short tasks.

## Suspending functions

A **suspending function** is marked with **`suspend`**. It can call other suspending functions and can suspend execution until a result is available. From regular code you cannot call a suspending function directly; you must call it from a coroutine (inside a coroutine builder or another suspending function).

```kotlin
suspend fun fetchUser(id: Int): User { ... }
suspend fun loadData(): String = withContext(Dispatchers.IO) { ... }
```

Suspending functions are the building blocks of async logic: they describe what to do when resumed, and the runtime handles when and where they run.

## Coroutine builders and scope

To start a coroutine, you use a **coroutine builder**. The main ones are **`launch`** (fire-and-forget, returns a `Job`) and **`async`** (returns a `Deferred` for a result). Both are extension functions on **`CoroutineScope`**. The scope defines the lifecycle of the coroutine and provides a **coroutine context** (dispatcher, job, optional exception handler).

```kotlin
scope.launch { doWork() }
val result = scope.async { compute() }.await()
```

Structured concurrency means child coroutines are bound to the scope: if the scope is cancelled or fails, its children are cancelled. That keeps concurrency predictable and avoids leaking work.

## Coroutine context and dispatchers

The **coroutine context** includes a **dispatcher**, which decides which thread (or thread pool) runs the coroutine. Common dispatchers: **`Dispatchers.Main`** (UI thread, Android/JVM UI), **`Dispatchers.Default`** (CPU-bound work), **`Dispatchers.IO`** (I/O-bound work). You can switch context inside a coroutine with **`withContext(Dispatchers.IO) { ... }`** so that only the block runs on the given dispatcher.

## Cancellation and timeouts

Coroutines support cancellation. Cancelling a job cancels its children. Suspending functions in kotlinx.coroutines check for cancellation and throw when the coroutine is cancelled, so long-running work should either use those functions or check `isActive` / `ensureActive()`. Timeouts can be expressed with **`withTimeout`** or **`withTimeoutOrNull`**, which cancel the block if it exceeds the duration.

## Flow, Channel, and shared state

When you need streams of values or communication between coroutines:

- **Flow** is a cold stream: collection runs when someone collects. It is used for one-shot or repeated async streams (e.g. database or API results).
- **Channel** lets coroutines send and receive values; each value is consumed by one receiver.
- **StateFlow** and **SharedFlow** are hot streams for sharing the latest state or events among multiple collectors.

For shared mutable state, prefer confining updates to a single coroutine or using thread-safe structures (e.g. atomic types, or StateFlow as the single source of truth) to avoid race conditions.

## Using coroutines in practice

On the JVM you need a scope to start coroutines. In application code you often use **`CoroutineScope(Dispatchers.Main).launch { }`** or a scope provided by a framework (e.g. Android’s `viewModelScope` or `lifecycleScope`). For one-off execution from a non-suspend context, **`runBlocking`** blocks the current thread until the block completes—use it for tests or main functions, not in production UI or server code, because it blocks the thread and can cause deadlocks or poor responsiveness if used on a main or shared dispatcher.

Coroutines integrate with callback-based APIs via **`suspendCoroutine`** or **`suspendCancellableCoroutine`**, and with futures via **`Future.await()`** in kotlinx.coroutines. The next topic covers exceptions and error handling, including how uncaught exceptions in coroutines are handled.

---

## Further reading

- [Coroutines overview](https://kotlinlang.org/docs/coroutines-overview.html)
- [Coroutine basics](https://kotlinlang.org/docs/coroutines-basics.html)
- [Coroutine context and dispatchers](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)
- [Asynchronous flow](https://kotlinlang.org/docs/flow.html)
- [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html)
