# Error handling

[← Back to Swift](./README.md)

## What this chapter covers

**`throws` / `try` / `try?` / `try!`**, the **`Error`** protocol, **typed throws** (modern literacy), **error propagation chains**, **`Result` vs `async throws`**, **`defer`**, bridging **`NSError`** legacy, and labs that replace force-try with production-safe alternatives. Cancellation errors point forward to chapter **10**. Default is **Swift 6.3.x** / Swift 6 language mode.

Swift treats recoverable failure as part of the type signature. Do not make force-try (`try!`) a habit — it converts failure into a crash.

---

## 1. Concepts

### 1. Errors are values that conform to `Error`

```swift
enum ConfigError: Error {
    case missingKey(String)
    case invalidValue(String)
}
```

Throwing functions declare `throws`. Call sites must use `try` inside `do` / `catch`, or propagate with `throws`.

```swift
func port(from env: [String: String]) throws -> Int {
    guard let raw = env["PORT"] else {
        throw ConfigError.missingKey("PORT")
    }
    guard let value = Int(raw), (1...65535).contains(value) else {
        throw ConfigError.invalidValue(raw)
    }
    return value
}

do {
    let p = try port(from: ProcessInfo.processInfo.environment)
    print(p)
} catch let ConfigError.missingKey(key) {
    print("missing \(key)")
} catch {
    print("failed: \(error)")
}
```

`catch` patterns can bind associated values. A final `catch` covers remaining errors.

### 2. Lab — never force-try in production (alternatives)

| Form | Behavior | Production habit |
|------|----------|------------------|
| `try` | Propagates or must be caught | Default |
| `try?` | Failure → `nil` (drops error payload) | When absence is enough |
| `try!` | Crashes on failure | Tests / true impossibilities only |

```swift
enum LoadError: Error {
    case missingFile
    case unreadable
}

func loadConfig(at path: String) throws -> String {
    guard FileManager.default.fileExists(atPath: path) else {
        throw LoadError.missingFile
    }
    do {
        return try String(contentsOfFile: path, encoding: .utf8)
    } catch {
        throw LoadError.unreadable
    }
}

// Legacy / crash-oriented habit — do not use in new production code.
// let text = try! loadConfig(at: "/etc/app.json")

// Alternative A — propagate to a boundary that can report
func boot() throws {
    let text = try loadConfig(at: "/etc/app.json")
    print(text.count)
}

// Alternative B — optional when the error detail is unimportant
func softBoot() {
    guard let text = try? loadConfig(at: "/etc/app.json") else {
        print("using defaults")
        return
    }
    print(text.count)
}

// Alternative C — keep the error as data
func bootResult() -> Result<String, LoadError> {
    Result { try loadConfig(at: "/etc/app.json") }
        .mapError { ($0 as? LoadError) ?? .unreadable }
}

// Alternative D — do/catch at the edge with logging
func bootLogged() {
    do {
        let text = try loadConfig(at: "/etc/app.json")
        print(text.count)
    } catch {
        // Log error type — never log secrets that might ride along
        print("boot failed:", error)
    }
}
```

**What just happened**

- Four replacements cover almost every “I used `try!` to silence the compiler” urge.
- `try?` is convenient but **throws away** why it failed—use `Result` or typed catch when ops need a runbook signal.
- Reserve `try!` for fixtures in tests or states you are willing to crash on—and comment why.

### 3. `Result`

`Result<Success, Failure: Error>` is a value representing success or failure — useful when you store an outcome, return it from a non-throwing API surface, or bridge completion handlers.

```swift
func load() -> Result<String, ConfigError> {
    Result { try String(contentsOfFile: "config.json", encoding: .utf8) }
        .mapError { _ in ConfigError.missingKey("config.json") }
}

switch load() {
case .success(let text):
    print(text)
case .failure(let err):
    print(err)
}
```

Throwing and `Result` interoperate: `get()` throws; `Result(catching:)` builds from a throwing closure. Prefer `throws` for most synchronous APIs; use `Result` when the error must be a first-class stored value.

### 4. `defer` with errors

`defer` runs when the scope exits, including after `throw`. Pair cleanup with throwing functions so unlocks and closes still happen.

```swift
func withLock(_ body: () throws -> Void) rethrows {
    lock()
    defer { unlock() }
    try body()
}
```

`rethrows` marks functions that only throw when a closure argument throws — common in `map`-shaped helpers.

---

## 2. Advanced concepts

### 1. Typed throws (modern literacy)

Swift 6 supports **typed throws**: `throws(ConfigError)` so the thrown type is part of the signature. Untyped `throws` remains the common default and means `throws(any Error)`.

```swift
func parseLine(_ line: String) throws(ConfigError) -> Int {
    guard let value = Int(line) else {
        throw .invalidValue(line)
    }
    return value
}

func parseAll(_ lines: [String]) throws(ConfigError) -> [Int] {
    try lines.map { try parseLine($0) }   // Failure type flows through
}
```

Use typed throws when callers must handle a **closed** error set and the API is stable. Do not type every throw on day one — migrating error hierarchies becomes painful. Catch sites and generics must agree on the failure type.

### 2. Error propagation chains

Failure should travel **out** to a boundary that can decide (UI alert, CLI exit code, retry policy)—not get swallowed mid-layer.

```swift
func readPortFile(_ path: String) throws -> String {
    try String(contentsOfFile: path, encoding: .utf8)
}

func parsePort(_ text: String) throws -> Int {
    try port(from: ["PORT": text.trimmingCharacters(in: .whitespacesAndNewlines)])
}

func configuredPort(path: String) throws -> Int {
    let text = try readPortFile(path)     // IO failure propagates
    return try parsePort(text)            // Domain failure propagates
}

// Boundary — map to user/ops outcomes once
func mainLike() {
    do {
        let p = try configuredPort(path: "port.txt")
        print("listening on", p)
    } catch let ConfigError.missingKey(k) {
        print("config missing", k)
    } catch {
        print("fatal:", error)
    }
}
```

**What just happened**

- Middle layers declare `throws` and stay dumb about UI.
- The edge converts errors into **actions** (message, exit, retry).
- Remapping with `mapError` / new throws is fine when you add context—avoid empty `catch { }` that erases failure.

### 3. `Result` vs `async throws`

| Shape | Best when | Weak when |
|-------|-----------|-----------|
| `throws` / `async throws` | Call stacks, structured concurrency, happy-path code | You must store failure next to success for later |
| `Result` | Cached outcomes, mixed success/failure arrays, completion-handler bridges | Deep call stacks that only want to propagate |

```swift
// Modern async boundary (details in chapter 10)
func fetchTitle() async throws -> String {
    // … network …
    return "ok"
}

func fetchTitleResult() async -> Result<String, Error> {
    await Result { try await fetchTitle() }
}
```

New Apple APIs lean **`async throws`**. Keep `Result` for values you stash or for adapting old `(Value?, Error?)` callbacks into something saner.

### 4. Cancellation errors → chapter 10

Cooperative cancellation surfaces as errors (`CancellationError`) when a task checks cancellation or an API throws on cancel. Do not treat every error as “business failure”—learn to rethrow cancellation so structured concurrency can unwind. Full story: chapter **10** (tasks, `Task.checkCancellation()`, `withTaskCancellationHandler`).

```swift
// Literacy pointer — expand in ch 10
// try Task.checkCancellation()
// catch is CancellationError { throw error }  // preserve cancel
```

### 5. Bridging `NSError` legacy

Before Swift 2, many Cocoa APIs used `NSErrorPointer` (`NSError **`) out-parameters. Bridging still maps many Objective-C methods with `NSError **` into `throws`. `NSError` remains an `Error` you may catch or construct at interop edges.

```swift
// Legacy (ObjC-shaped NSError out-parameter thinking) — do not use in new Swift APIs.
// func read(path: String, error: NSErrorPointer) -> String?

// Prefer:
func read(path: String) throws -> String { /* … */ }

import Foundation

func bridgeExample() {
    do {
        _ = try String(contentsOfFile: "missing.txt", encoding: .utf8)
    } catch let error as NSError {
        // Domain / code literacy for Cocoa — still Error in Swift
        print(error.domain, error.code)
    } catch {
        print(error)
    }
}
```

When reviewing bridged APIs: a method that looks like optional + error may be imported as `throws`. Do not re-expose manual `NSError` out-params on new Swift surfaces. If you must produce an `NSError` for ObjC callers, construct it deliberately at the boundary.

### 6. Error design

Good errors are:

- **Specific** enough to act on (`missingKey("PORT")` beats `failed`)
- **Safe to log** (no secrets/tokens in associated values)
- **Stable** at API boundaries (renaming cases is breaking for clients that pattern-match)

Avoid using errors for ordinary control flow that is not failure (e.g. end-of-stream may be a `nil` or an enum case instead of `throw`).

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Decode / load paths use `throws`; UI maps errors to user-visible messages without swallowing; preserve cancellation separately from “load failed” |
| **Systems** | CLI tools: catch at `main`, print, `exit` with nonzero status; keep error types small; prefer typed throws only on stable closed sets |
| **Security** | Errors must not leak credentials; distinguish auth failure from network failure for clients carefully; never `try!` around keychain/crypto |
| **Operations** | Prefer structured error cases for alerts and runbooks over free-form strings alone; log `NSError` domain/code when bridging Cocoa |
| **Software engineering** | Public APIs document thrown error types; tests assert cases, not only “threw something”; ban empty `catch` without justification |

Completion-handler APIs often surface `(Value?, Error?)`. Prefer migrating to `async throws` or a single `Result` rather than the ambiguous both-non-nil / both-nil cases.

---

## 4. Staff-level review checklist

- [ ] Failures propagate with `throws` or `Result`; they are not silently ignored.
- [ ] No `try!` on IO, network, or decode paths without a documented crash rationale.
- [ ] Labs’ alternatives (`try?`, `Result`, edge `do/catch`, propagate) are used instead of force-try culture.
- [ ] `catch` blocks do something useful (log + handle / rethrow); empty `catch` is justified rarely.
- [ ] Error payloads are log-safe (no secrets).
- [ ] Typed throws, if used, match a stable closed set — not an experiment on a public surface.
- [ ] Bridged `NSError` APIs are not re-exposed as out-parameters in new Swift.
- [ ] Cancellation is not mis-handled as a generic business error (see chapter **10**).
- [ ] `defer` cleans up on throwing paths.

---

## References

- [Error Handling (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [The Basics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Closures (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/) (`rethrows` / trailing `try` call sites)
- [Concurrency (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) (async throws / cancellation literacy)
- [Swift standard library — Result](https://developer.apple.com/documentation/swift/result)
- [Swift standard library — CancellationError](https://developer.apple.com/documentation/swift/cancellationerror)
- [Foundation — NSError](https://developer.apple.com/documentation/foundation/nserror)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
