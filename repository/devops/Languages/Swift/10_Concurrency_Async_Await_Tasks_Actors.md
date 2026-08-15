# Concurrency: async/await, tasks, and actors

[← Back to Swift](./README.md)

## What this chapter covers

**`async` / `await`**, **`Task` / `TaskGroup`**, **actors**, **`@MainActor`**, **`nonisolated`**, **`Sendable`**, **cancellation**, **AsyncSequence**, **clocks**, **Observation** literacy, and **Swift 6 complete checking** migration. Default is **Swift 6.3.x** / Swift 6 language mode.

Picture a restaurant kitchen with one pass window. `async` is a cook who may step away from the stove while the oven finishes. `await` is “I am willing to suspend here.” An **actor** is a locked pantry: only one cook at a time may rearrange the jars. **`@MainActor`** is the front-of-house counter where the UI lives — you hop there to talk to customers. Concurrency is not “run everything in parallel.” It is a model for *when* work suspends, *who* owns mutable state, and *how* failures and cancellation propagate.

Treat warnings under complete checking as design signals, not noise to silence.

---

## 1. Concepts

### 1. `async` functions and `await`

An `async` function may suspend. Call sites mark suspension points with `await`. Errors compose as `async throws` with `try await`.

```swift
func fetchToken() async throws -> String {
    // suspends while waiting; caller must await
    try await Task.sleep(for: .milliseconds(10))
    return "token"
}

func use() async throws {
    let token = try await fetchToken()
    print(token)
}
```

**What just happened.** Suspension is cooperative: the runtime may resume on a different executor. Do not assume “same thread after `await`” unless isolation guarantees it. That single fact explains half of the “why did my UI update crash?” bugs from the GCD era.

### 2. Structured vs unstructured concurrency

| Shape | Mental model | Prefer when |
|-------|--------------|-------------|
| **Structured** (`async let`, `TaskGroup`, child tasks of an async function) | Nested scopes: children die with the parent | Fan-out work whose lifetime should nest |
| **Unstructured** (`Task { }`) | A new ticket you tore off the pad | Bridging from sync UI / fire-and-forget you still own |
| **`Task.detached`** | A ticket that forgets the restaurant | Rare; justify breaking inheritance |

```swift
func loadBoth() async throws -> (String, String) {
    async let a = fetchToken()
    async let b = fetchToken()
    return try await (a, b)   // both run; both awaited before return
}
```

**Lab — unstructured ownership**

```swift
Task {
    // unstructured — document who cancels / who observes failure
    do {
        print(try await fetchToken())
    } catch {
        print("failed: \(error)")
    }
}
```

**What just happened.** `async let` is structured: leaving the scope awaits (or cancels) the children. Bare `Task { }` is not. If the view goes away and nobody cancels that task, work keeps cooking in an empty kitchen.

### 3. Lab — `TaskGroup` fan-out

```swift
func fetchMany(_ ids: [String]) async throws -> [String] {
    try await withThrowingTaskGroup(of: String.self) { group in
        for id in ids {
            group.addTask {
                try await Task.sleep(for: .milliseconds(5))
                return "row-\(id)"
            }
        }
        var rows: [String] = []
        for try await row in group {
            rows.append(row)
        }
        return rows
    }
}
```

**What just happened.** The group is a structured parent. If one child throws (throwing group), siblings cancel. You collect results with `for try await`. Bounded fan-out (limit how many `addTask` calls are in flight) is the systems habit; unbounded groups are how you accidentally DDoS yourself.

### 4. Actors isolate mutable state

An `actor` serializes access to its stored state. Calls into an actor from outside are `await`ed; inside the actor, synchronous access to `self` is isolated.

```swift
actor Counter {
    private var value = 0

    func increment() -> Int {
        value += 1
        return value
    }
}

func bump(_ c: Counter) async {
    print(await c.increment())
}
```

Actors are reference types with isolation, not a free pass to share arbitrary classes. Prefer actors (or immutable values) over “class + lock” for new shared mutable state.

### 5. `@MainActor` vs your own actor

```swift
@MainActor
final class ScreenModel {
    var title = ""

    func refresh() async {
        // Network work may hop off the main actor while awaiting.
        let text = try? await fetchToken()
        title = text ?? ""   // assignment happens back on MainActor
    }
}

actor Ledger {
    private var balance = 0
    func credit(_ n: Int) { balance += n }
}
```

**Mental model.** `@MainActor` is “this state belongs to the UI counter.” A custom actor is “this state belongs to the ledger pantry.” Both serialize; they are different domains. Hopping domains requires `await`. Capturing non-`Sendable` mutable state across a hop is a race — Swift 6 aims to reject it at compile time.

### 6. `Sendable` — why value types help

Types that safely cross concurrency domains conform to **`Sendable`**. Value types with `Sendable` stored properties often synthesize conformance. Classes need careful design (`final`, immutable state, or an explicit unchecked story you can defend).

```swift
struct UserID: Sendable {
    let raw: String
}

final class MutableBag {
    var name: String
    init(_ name: String) { self.name = name }
}

func schedule(_ work: @escaping @Sendable () -> Void) {
    Task { work() }
}

let id = UserID(raw: "ada")
schedule { print(id.raw) }   // value: copy crosses the domain safely

// let bag = MutableBag("x")
// schedule { print(bag.name) }  // Swift 6: not Sendable — shared mutable class
```

**What just happened.** A `struct` with `let` fields is a photocopy you can hand to another cook. A class is one jar two cooks might both grab. That is why value types and complete checking feel like they were designed together.

Do not `@unchecked Sendable` to quiet the compiler without an ownership and mutation story.

### 7. Cancellation and clocks

Tasks can be cancelled. Cooperative APIs check `Task.isCancelled` or call `Task.checkCancellation()` / cancellable waits. Cancellation typically surfaces as `CancellationError`. Prefer clock-based sleeps over busy loops.

```swift
func workUntilCancelled() async throws {
    while !Task.isCancelled {
        try await Task.sleep(for: .milliseconds(50))  // cancellable
    }
    try Task.checkCancellation()
}

func timedWork() async throws {
    try await Task.sleep(until: .now + .seconds(1), clock: ContinuousClock())
}
```

**Lab — cancel a sleeper**

```swift
let handle = Task {
    try await Task.sleep(for: .seconds(30))
    return "done"
}
handle.cancel()
let outcome = await handle.result   // failure: CancellationError
```

**What just happened.** Parent cancellation cascades to children in structured concurrency. Unstructured tasks you spawn must be cancelled or awaited when the owner goes away. Sleep that ignores cancellation is a hang waiting for a review comment.

### 8. AsyncSequence and `for await`

Anything that produces values over time can be an `AsyncSequence`. You consume it like a loop that may suspend.

```swift
struct Countdown: AsyncSequence {
    typealias Element = Int
    let start: Int

    struct AsyncIterator: AsyncIteratorProtocol {
        var current: Int
        mutating func next() async -> Int? {
            guard current >= 0 else { return nil }
            let value = current
            current -= 1
            return value
        }
    }

    func makeAsyncIterator() -> AsyncIterator {
        AsyncIterator(current: start)
    }
}

func runCountdown() async {
    for await n in Countdown(start: 3) {
        print(n)
    }
}
```

**What just happened.** `for await` is the async cousin of `for-in`. Combine it with task cancellation: breaking out of the loop (or cancelling the task) should stop producers that respect cooperative cancellation.

---

## 2. Advanced concepts

### 1. Timeline literacy: 5.5 intro → Swift 6 checking

| Era | What you get |
|-----|----------------|
| **Pre-5.5** | Completion handlers, GCD queues, locks — still in brownfield |
| **Swift 5.5+** | `async`/`await`, `Task`, actors available; checking often partial |
| **Swift 6 language mode** | **Complete concurrency checking** — isolation and `Sendable` enforced harder |

### 2. Lab — completion-handler → async legacy pair

```swift
// Legacy (completion-handler shaped API) — do not use in new code.
func loadLegacy(completion: @escaping (Result<String, Error>) -> Void) {
    DispatchQueue.global().async {
        completion(.success("ok"))
    }
}

func load() async throws -> String {
    try await withCheckedThrowingContinuation { cont in
        loadLegacy { result in
            cont.resume(with: result)
        }
    }
}
```

**What just happened.** Continuations wrap callback APIs once. Prefer official `async` overloads when they exist. Never resume a continuation twice; never leak it without resuming. `withChecked…` traps misuse in debug; `withUnsafe…` is for experts who already proved the contract.

### 3. `nonisolated` — stepping outside the actor

Sometimes a method on an actor (or `@MainActor` type) does not touch isolated state and should be callable without `await`.

```swift
actor Vault {
    private var secret = "🤫"
    let label: String

    init(label: String) { self.label = label }

    nonisolated var displayName: String { label }

    func reveal() -> String { secret }
}

func printName(_ v: Vault) {
    print(v.displayName)       // no await — nonisolated
    // print(await v.reveal()) // needs await
}
```

**What just happened.** `nonisolated` is a promise: this member does not read or write isolated mutable state. Lying about that (touching isolated storage from `nonisolated`) is what complete checking exists to catch.

### 4. Isolation domains and priorities

Isolation answers “who may touch this state?” Main-actor UI state, custom actors, and global/executor isolation are different domains. Tasks inherit priority and actor context unless detached. Raise priority only with cause (user-initiated work). Do not use priority as a substitute for correct isolation.

### 5. Observation literacy (`@Observable` + `Observations`)

The Observation library lets you mark model classes with the **`@Observable`** macro so UI (and other consumers) can track property access. As a consumer, you usually *read* properties in a tracking context (SwiftUI does this for you) — you do not hand-roll willSet observers.

```swift
import Observation

@Observable
final class Player {
    var score = 0
    var item = "sword"
}
```

**Swift 6.2+ literacy — `Observations` as `AsyncSequence`.** You can stream consistent snapshots of observable state:

```swift
import Observation

@Observable
final class Player {
    var score = 0
    var item = "sword"
}

func watch(_ player: Player) async {
    let stream = Observations {
        "score=\(player.score) item=\(player.item)"
    }
    for await line in stream {
        print(line)
        if player.score > 10 { break }
    }
}
```

**What just happened.** The closure *computes* the value you want; Observation tracks which `@Observable` properties were read. Updates are **transactional**: synchronous bursts of property changes collapse into one consistent emission (transaction ends at the next suspending `await`). Treat this as concurrency-native observation — not a second Combine. Availability is tied to recent OS / toolchain pins; verify before promising it in a deployment target older than your handbook’s 6.2+ literacy note.

`ObservableObject` + `@Published` + Combine remains **legacy literacy** for brownfield SwiftUI (chapter **19**). New models prefer `@Observable`.

### 6. Data races vs logic races

Complete checking targets **data races** (unsynchronized mutable sharing). Logic races (ordering bugs, stale UI) still need tests and clear ownership. Actors serialize; they do not invent correct product behavior.

### 7. Swift 6 complete checking — migration steps

1. **Inventory** targets still on Swift 5 language mode / minimal checking.
2. **Enable warnings** as errors for concurrency diagnostics on one module at a time.
3. **Draw isolation boundaries** — `@MainActor` for UI models, actors for shared mutable services, `Sendable` value types at edges.
4. **Fix or wrap** non-Sendable classes (immutability, actors, or a defended `@unchecked Sendable`).
5. **Bridge** completion handlers with checked continuations; delete double-resume bugs.
6. **Turn on Swift 6 language mode** for that target; pin the mode in CI.
7. **Repeat** outward through the package graph; do not “fix” the whole monorepo in one PR.

See the concurrency migration guide in References.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | UI models on `@MainActor`; network/IO as `async throws`; Observation for modern UI state |
| **Systems** | CLI/server: structured `TaskGroup` fan-out; cancel on shutdown; clocks not `Date()` sprinkles |
| **Security** | Do not pass secrets through unconstrained `@Sendable` closures logged elsewhere; cancel abandoned auth flows |
| **Operations** | Timeouts via racing `Task` + cancellation; measure hangs after await, not only CPU |
| **Software engineering** | Public APIs prefer `async` over completion handlers; document isolation; migrate to complete checking module-by-module |

---

## 4. Staff-level review checklist

- [ ] New async work uses `async`/`await`; completion handlers appear only as bridges or legacy.
- [ ] Shared mutable state has an isolation story (actor / main actor / immutable values).
- [ ] Structured concurrency preferred; unstructured `Task` / `Task.detached` ownership and cancellation are explicit.
- [ ] No casual `@unchecked Sendable` or force-casts to silence Swift 6 checking.
- [ ] Cancellation is cooperative on long loops, sleeps, and IO wrappers.
- [ ] Continuations resume exactly once; prefer native async APIs when available.
- [ ] `nonisolated` members do not touch isolated mutable state.
- [ ] `@Observable` / `Observations` used with availability literacy; not mixed carelessly with Combine `@Published` for new code.
- [ ] Language mode / checking level for the target is intentional and pinned in CI.

---

## References

- [Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
- [Sendable](https://developer.apple.com/documentation/swift/sendable)
- [MainActor](https://developer.apple.com/documentation/swift/mainactor)
- [Observation](https://developer.apple.com/documentation/observation)
- [TaskGroup](https://developer.apple.com/documentation/swift/taskgroup)
