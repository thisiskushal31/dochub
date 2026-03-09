# Concurrency: async, futures, streams, isolates

[← Back to Dart](./README.md)

Real programs wait for **I/O** (network, disk, user input) and sometimes need **parallel** work (e.g. heavy computation without freezing the UI). Dart supports this with **asynchronous** APIs (**Futures**, **Streams**) and **isolates**. This topic explains **why** async exists, **when** to use **async/await**, **Futures**, **Streams**, and **isolates**, and how to avoid common mistakes—so you can write responsive apps and servers from beginner to advanced level.

---

## Why asynchronous code?

If you call a **blocking** function (e.g. “read from the network”), the **entire** program waits until it finishes. In a **single-threaded** environment like Dart’s main isolate, that means the UI freezes or the server cannot handle other requests. **Asynchronous** APIs instead return immediately with a **Future** (or similar) and do the work “in the background”; you **await** the result when you need it. The thread is not blocked, so other code can run (e.g. handling events or other requests). So: use **async** when you have **I/O** or **delayed** work so your program stays responsive.

---

## Async and await (the basics)

Any function that **waits** on asynchronous work should be marked **`async`**. Inside it you can use **`await`** on a **Future**; the function **pauses** at that line until the Future completes, then continues. The **caller** of your async function gets a **Future** and can in turn **await** it. So async/await lets you write **sequential-looking** code that does not block the isolate.

```dart
Future<void> checkVersion() async {
  var version = await lookUpVersion();
  print('Version: $version');
}

void main() async {
  await checkVersion();
}
```

**Rules:** **`await`** is allowed only inside an **`async`** function. If you need **`await`** in **`main()`**, make **`main`** **`async`** (as above). **Always** await (or explicitly handle) Futures when the rest of your logic depends on their result; otherwise you get “fire-and-forget” behavior and possible race conditions or missed errors. The **unawaited_futures** lint flags this.

**Errors:** Use **try/catch/finally** around **await** to handle failures (e.g. network errors, timeouts). If you do not catch, the error propagates to the caller’s Future and can terminate the isolate if unhandled.

---

## Futures in depth

A **`Future<T>`** represents a value (or error) that will be available **later**. You get Futures from: **async** functions, **`Future.value()`**, **`Future.error()`**, **`Future.delayed()`**, or library APIs (e.g. **`http.get()`**). You can **chain** work with **`.then()`**, **`.catchError()`**, **`.whenComplete()`**, but for readability **async/await** is usually better.

```dart
Future<int> fetchCount() async {
  await Future.delayed(Duration(seconds: 1));
  return 42;
}
```

**When to use:** Use **Futures** for **single** results (one request → one response). Use **async/await** to compose multiple async steps in order. For **multiple** values over time, use **Streams** (see below).

---

## Streams in depth

A **`Stream<T>`** is a **sequence** of asynchronous events (values or errors). Examples: reading a file in chunks, WebSocket messages, user events. You **listen** with **`await for`** in an async function (process one event at a time) or with **`.listen()`** (callbacks). Libraries like **dart:io** and **package:http** expose Stream-based APIs where appropriate.

```dart
Future<void> listenToStream(Stream<int> stream) async {
  await for (final value in stream) {
    print(value);
  }
}
```

**When to use:** Use **Streams** when you have **multiple** values over time or **continuous** data (e.g. logs, sensor data, event buses). Use **Futures** for a single delayed value. Creating and transforming streams (**StreamController**, **async\*** generators) is covered in the core libraries and async tutorials.

---

## Isolates (parallelism without shared memory)

Dart runs code in a **single thread** per **isolate**. To use **multiple cores** or to do **CPU-heavy** work without blocking the main isolate (e.g. UI), you **spawn** a new **isolate** with **`Isolate.spawn()`**. Isolates **do not share memory**; they communicate only by **passing messages** (serializable data). That avoids data races but means you cannot share mutable objects directly.

```dart
import 'dart:isolate';

void isolateEntry(SendPort sendPort) {
  sendPort.send('Hello from isolate');
}

void main() async {
  final receivePort = ReceivePort();
  await Isolate.spawn(isolateEntry, receivePort.sendPort);
  final msg = await receivePort.first;
  print(msg);
}
```

**When to use isolates:** Use them for **CPU-bound** work (parsing, image processing, crypto) or when you must keep the **main** isolate free for UI or request handling. For **I/O-bound** work (network, disk), **async/await** and **Futures** are usually enough; isolates do not add much and add complexity (message passing, serialization).

---

## Concurrency model: quick reference

| Need | Use |
|------|-----|
| One delayed result (e.g. HTTP response) | **Future** + **async/await** |
| Many values over time (e.g. events, chunks) | **Stream** + **await for** or **.listen()** |
| Heavy computation or use multiple cores | **Isolates** + **SendPort**/ **ReceivePort** |
| Don’t block the main thread | **async** for I/O; **isolates** for CPU |

---

## Common pitfalls

- **Forgetting `async`:** If you use **`await`** inside a function, that function must be **`async`**. Otherwise you get a compile error.
- **Unawaited Futures:** If you call an async function and do not **await** (or **.then()** / handle the Future), errors may be lost and order of execution may be wrong. Use the **unawaited_futures** lint.
- **Blocking in the main isolate:** Do not run long **synchronous** loops or heavy computation on the main isolate in a UI or server app; use an **isolate** for that.
- **Mixing sync and async:** Functions that return **Future** should not block. If you have sync work, do it before or after **await**, or offload to an isolate.

---

## Implementation note (by role)

- **App/Flutter:** Use **async/await** for API calls, file I/O, and timers. Use **Streams** for WebSockets or reactive state. Use **isolates** for heavy parsing or image work so the UI thread stays responsive.
- **Server/CLI:** Use **async/await** for HTTP and database I/O. Use **Streams** for request bodies or log processing. Use **isolates** for CPU-heavy handlers if needed.
- **DevOps:** CI scripts that run Dart typically use **async** when calling Dart tools or APIs; ensure scripts **await** completion before exiting or making decisions.

---

## Further reading

- [Dart language — Asynchronous programming](https://dart.dev/language/async)
- [Dart language — Concurrency](https://dart.dev/language/concurrency)
- [Dart language — Isolates](https://dart.dev/language/isolates)
- [Libraries: async](https://dart.dev/libraries/async/async-await)
