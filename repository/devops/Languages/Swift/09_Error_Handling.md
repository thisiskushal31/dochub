# Error handling

[← Back to Swift](./README.md)

## What this chapter covers

**`throws` / `try` / `try?` / `try!`**, the **`Error`** protocol, **typed throws** (modern literacy) and **erasure**, **error taxonomy design** (domain vs transport), **propagation chains**, **`Result` vs `async throws`**, **`defer`**, **`Never` / `fatalError` vs throw culture**, bridging **`NSError`** legacy, and labs that replace force-try with production-safe alternatives. Cancellation errors connect to chapter **10**. Default is **Swift 6.3.x** / Swift 6 language mode.

Swift treats recoverable failure as part of the type signature. Do not make force-try (`try!`) a habit — it converts failure into a crash. Picture errors as **labeled packages** on a conveyor: the type on the label tells the next station what to do; an unlabeled crash is a fire alarm, not a delivery.

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

### 5. Lab — error taxonomy: domain vs transport

Staff APIs fail in **layers**. Collapsing them into one string is how on-call archaeology begins.

| Layer | Owns | Example | Caller should |
|-------|------|---------|---------------|
| **Domain** | Business / product rules | `OrderError.insufficientStock` | Show product message; rarely retry blindly |
| **Transport** | Network / disk / process | `URLError`, `POSIXError`, cancelled task | Retry, backoff, or surface connectivity |
| **Contract** | Decode / schema | `DecodingError` | Fix client/server contract; version tolerate |
| **Boundary map** | Your façade | `ClientError.unauthorized` wrapping HTTP 401 | One vocabulary for the rest of the app |

```swift
enum OrderError: Error, Sendable {
    case insufficientStock(sku: String)
    case invalidQuantity(Int)
}

enum ClientError: Error, Sendable {
    case unauthorized
    case offline
    case cancelled
    case decodeFailed
    case domain(OrderError)
    case unexpected(String)   // last resort — prefer closed cases
}

struct OrderService {
    func place(sku: String, qty: Int) async throws(ClientError) {
        guard qty > 0 else { throw .domain(.invalidQuantity(qty)) }

        let data: Data
        do {
            data = try await fetchReceipt(sku: sku, qty: qty)
        } catch is CancellationError {
            throw .cancelled
        } catch let url as URLError where url.code == .notConnectedToInternet {
            throw .offline
        } catch {
            // Do not smuggle raw URLError into UI — map or unexpected
            throw .unexpected(String(describing: type(of: error)))
        }

        do {
            _ = try decodeReceipt(data)
        } catch is DecodingError {
            throw .decodeFailed
        }

        // Domain rule after successful transport+decode
        if sku == "OUT" { throw .domain(.insufficientStock(sku: sku)) }
    }

    private func fetchReceipt(sku: String, qty: Int) async throws -> Data {
        // stand-in for URLSession
        Data()
    }
    private func decodeReceipt(_ data: Data) throws -> String { "ok" }
}

func uiPlace() async {
    do {
        try await OrderService().place(sku: "SKU-1", qty: 1)
    } catch .cancelled {
        // Preserve cancel — do not toast "order failed"
    } catch .offline {
        print("check network")
    } catch .domain(.insufficientStock(let sku)) {
        print("no stock for \(sku)")
    } catch {
        print("order failed:", error)
    }
}
```

**What just happened**

- Transport failures and domain failures are **different runbooks**.
- Cancellation is its own case — chapter **10** owns the full task story; here you learn not to lie about it.
- Typed throws on the façade (`throws(ClientError)`) give the UI a closed set without leaking `URLError` / `DecodingError` everywhere.

### 6. `Never` / `fatalError` vs throw culture

| Tool | Meaning | Culture |
|------|---------|---------|
| `throw` / `Result.failure` | Recoverable failure | Default for IO, decode, validation |
| `precondition` / `assert` | Programmer invariant | Debug/assert — not user input |
| `fatalError` → often `Never` | Process must die | True impossibilities / aborted boot |

```swift
func valueOrThrow(_ n: Int?) throws -> Int {
    guard let n else { throw ConfigError.missingKey("n") }
    return n
}

// Legacy-shaped crash on missing config — do not use for user input.
// fatalError("missing required config")
```

**What just happened.** Crashing is correct when continuing would corrupt unrecoverable state. Crashing because a JSON field was missing trains force-quit culture. Prefer `throw` for anything an operator or client might fix.

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

### 2. Typed throws + erasure

Real graphs mix typed leaves with untyped edges (`any Error`, libraries, ObjC bridges).

```swift
func leaf(_ s: String) throws(ConfigError) -> Int {
    try parseLine(s)
}

// Erase to any Error — common at module edges and older protocols
func erased(_ s: String) throws -> Int {
    try leaf(s)
}

// Reify when you know the closed set
func reified(_ s: String) throws(ConfigError) -> Int {
    do {
        return try erased(s)
    } catch let e as ConfigError {
        throw e
    } catch {
        // Unexpected erasure victim — map or unexpected
        throw .invalidValue(String(describing: error))
    }
}

func asResult(_ s: String) -> Result<Int, ConfigError> {
    Result { try leaf(s) }
}
```

**What just happened.** Typed throws are a **contract**, not a religion. Erase at boundaries that must speak `any Error` (protocol witnesses, mixed packages). Reify at façades that want closed `catch` for UI/ops. Blind `as!` casts of errors are the same smell as force-try.

### 3. Error propagation chains

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

| Shape | Best when |
|-------|-----------|
| `throws` / `async throws` | Call stacks, structured concurrency |
| `Result` | Stored outcomes, completion-handler bridges |

```swift
func fetchTitle() async throws -> String { "ok" }
func fetchTitleResult() async -> Result<String, Error> {
    await Result { try await fetchTitle() }
}
```

New Apple APIs lean **`async throws`**. Keep `Result` for values you stash or for adapting old `(Value?, Error?)` callbacks.

### 4. Lab — `async throws` and cancellation interaction

Cooperative cancellation surfaces as `CancellationError` when a task checks cancellation or an API throws on cancel. Treat it as a **control signal**, not a business failure.

```swift
enum WorkError: Error {
    case boom
}

func flakyWork(shouldFail: Bool) async throws -> String {
    try await Task.sleep(for: .milliseconds(20))
    try Task.checkCancellation()
    if shouldFail { throw WorkError.boom }
    return "done"
}

func runWork() async {
    let handle = Task {
        try await flakyWork(shouldFail: false)
    }
    handle.cancel()

    do {
        _ = try await handle.value
    } catch is CancellationError {
        // Correct: unwind quietly or surface "cancelled"
        print("cancelled")
    } catch {
        print("business failure:", error)
    }
}

func preserveCancel<T>(
    _ body: () async throws -> T
) async throws -> T {
    do {
        return try await body()
    } catch is CancellationError {
        throw CancellationError()   // rethrow — do not map to domain
    } catch {
        throw error
    }
}
```

**What just happened**

- `Task.checkCancellation()` / cancellable `Task.sleep` make cancel observable as `throws`.
- Mapping cancel into `ClientError.offline` (or a generic “failed”) lies to retry logic and UI.
- Full structured-concurrency story: chapter **10** (`withTaskCancellationHandler`, task trees).

### 6. Bridging `NSError` legacy

Bridging still maps many Objective-C `NSError **` methods into `throws`. `NSError` remains an `Error` at interop edges.

```swift
// Legacy (NSError out-parameter thinking) — do not use in new Swift APIs.
// func read(path: String, error: NSErrorPointer) -> String?

import Foundation
func bridgeExample() {
    do {
        _ = try String(contentsOfFile: "missing.txt", encoding: .utf8)
    } catch let error as NSError {
        print(error.domain, error.code)
    } catch {
        print(error)
    }
}
```

Do not re-expose manual `NSError` out-params on new Swift surfaces. Construct `NSError` deliberately only for ObjC callers at the boundary.

### 7. Error design

Good errors are:

- **Specific** enough to act on (`missingKey("PORT")` beats `failed`)
- **Safe to log** (no secrets/tokens in associated values)
- **Stable** at API boundaries (renaming cases is breaking for clients that pattern-match)
- **Layered** so domain and transport stay separable (taxonomy lab above)

Avoid using errors for ordinary control flow that is not failure (e.g. end-of-stream may be a `nil` or an enum case instead of `throw`).

### 8. `LocalizedError` glance

Presentation via `LocalizedError.errorDescription` is for humans at the edge — never put tokens in those strings. Prefer closed error cases for logic; localize at the UI boundary.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Decode / load paths use `throws`; UI maps **domain** errors to messages; preserve **cancellation** separately from “load failed” |
| **Systems** | CLI tools: catch at `main`, print, `exit` with nonzero status; keep error types small; prefer typed throws only on stable closed sets |
| **Security** | Errors must not leak credentials; distinguish auth failure from network failure carefully; never `try!` around keychain/crypto; never `fatalError` on untrusted input |
| **Operations** | Prefer structured error cases for alerts and runbooks; log `NSError` domain/code when bridging Cocoa; taxonomy matches paging policy |
| **Software engineering** | Public APIs document thrown error types; tests assert cases, not only “threw something”; ban empty `catch` without justification; document when `fatalError` is intentional |

Completion-handler APIs often surface `(Value?, Error?)`. Prefer migrating to `async throws` or a single `Result` rather than the ambiguous both-non-nil / both-nil cases.

---

## 4. Staff-level review checklist

- [ ] Failures propagate with `throws` or `Result`; not silently ignored.
- [ ] No `try!` on IO/network/decode without documented crash rationale.
- [ ] Labs’ alternatives used instead of force-try culture.
- [ ] Domain vs transport vs decode failures distinguishable at façades.
- [ ] `catch` blocks do something useful; empty `catch` justified rarely.
- [ ] Error payloads are log-safe (no secrets).
- [ ] Typed throws match a stable closed set — erasure/reify at edges is deliberate.
- [ ] Bridged `NSError` not re-exposed as out-parameters in new Swift.
- [ ] Cancellation rethrown or mapped to an explicit cancel case (see chapter **10**).
- [ ] `fatalError` / `Never` for true impossibilities; user/input failures use `throw`.
- [ ] `defer` cleans up on throwing paths.

---

## References

- [Error Handling (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [The Basics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Closures (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/) (`rethrows` / trailing `try` call sites)
- [Concurrency (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) (async throws / cancellation literacy)
- [Swift standard library — Result](https://developer.apple.com/documentation/swift/result)
- [Swift standard library — Never](https://developer.apple.com/documentation/swift/never)
- [Swift standard library — CancellationError](https://developer.apple.com/documentation/swift/cancellationerror)
- [Foundation — NSError](https://developer.apple.com/documentation/foundation/nserror)
- [Foundation — LocalizedError](https://developer.apple.com/documentation/foundation/localizederror)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
