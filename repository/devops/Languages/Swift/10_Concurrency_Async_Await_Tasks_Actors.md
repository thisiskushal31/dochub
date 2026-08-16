# Concurrency: async/await, tasks, and actors

[← Back to Swift](./README.md)

## What this chapter covers

**`async` / `await`**, **`Task` / `TaskGroup`**, **actors**, **executor / isolation regions**, **`@MainActor`**, **`nonisolated`**, **`Sendable`**, **reentrancy**, **Task priority**, **`TaskLocal`**, **cancellation + clocks**, **AsyncSequence**, **Observation** (`@Observable` / `Observations`), and **Swift 6 diagnostic families**. Default is **Swift 6.3.x** / Swift 6 language mode.

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

**Lab — clock sleep cancel**

```swift
let handle = Task {
    try await Task.sleep(for: .seconds(30), clock: ContinuousClock())
    return "done"
}
handle.cancel()
let outcome = await handle.result   // failure: CancellationError

// Contrast — a busy loop that never checks cancellation will ignore cancel:
// while true { }  // hang — review smell
```

**What just happened.** Parent cancellation cascades to children in structured concurrency. Unstructured tasks you spawn must be cancelled or awaited when the owner goes away. Sleep that ignores cancellation is a hang waiting for a review comment. Prefer `Task.sleep(for:clock:)` / `ContinuousClock` over legacy `DispatchQueue` sleeps for cancellable waits.

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

### 3. Executor and isolation regions (deeper)

Isolation answers: **which executor serializes this state?** Mental regions:

| Region | Typical home | Cross with |
|--------|--------------|------------|
| **MainActor** | UI models, views | `await` hop off for IO, back for mutation |
| **Custom actor** | Services, caches, ledgers | `await` into the actor |
| **Nonisolated / synchronous** | Pure functions, value transforms | No hop if truly sync and Sendable |
| **Task executor preference** | Where a task prefers to run | Inherited unless detached / specified |

```swift
@MainActor
func paint(_ title: String) {
    // Must run on the main actor's executor
    _ = title
}

actor Vault {
    private var secret = "x"
    func read() -> String { secret }
}

func demoHops(_ vault: Vault) async {
    let s = await vault.read()     // hop into Vault's isolation
    await paint(s)                 // hop to MainActor
}
```

**What just happened.** After `await`, you re-enter an isolation region — possibly a different one than before the suspension. Code between awaits on an actor is exclusive; code across an await is **not** a critical section that excludes reentrancy (next lab). Global actors (`@MainActor`) and instance actors are both isolation domains; treating them as “threads” will mislead you.

### 4. Lab — actor reentrancy (await, then state changed)

Actors serialize *synchronous* work, but **`await` inside an actor method suspends and may let other work on that actor run**.

```swift
actor Bank {
    private var balance = 100
    private(set) var log: [String] = []

    func withdraw(_ amount: Int) async -> Bool {
        let snapshot = balance
        log.append("begin \(amount) saw \(snapshot)")

        // Suspending point — another call may interleave on this actor!
        try? await Task.sleep(for: .milliseconds(10))

        // balance may have changed since snapshot
        guard balance >= amount else {
            log.append("fail \(amount) now \(balance)")
            return false
        }
        balance -= amount
        log.append("ok \(amount) left \(balance)")
        return true
    }
}

func reentrancyDemo() async {
    let bank = Bank()
    async let a = bank.withdraw(80)
    async let b = bank.withdraw(80)
    let (okA, okB) = await (a, b)
    print(okA, okB, await bank.log)
    // One should fail if both try to take 80 from 100 —
    // *if* you re-check balance after await. A naive use of `snapshot`
    // alone would double-spend.
}
```

**What just happened.** Reentrancy is not a data race (the actor still serializes), but it **is** a logic race if you cache actor state across `await` and assume it is still true. Habit: after every `await` inside an actor, re-read state you depend on, or structure the method so mutations finish before the first suspension. This lab is the staff interview question for “actors make everything safe.”

### 5. `nonisolated` — stepping outside the actor

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

### 6. Task priority literacy

Tasks carry a **priority** (`high`, `medium`, `low`, `background`, …). Child tasks inherit priority unless you say otherwise. Priority is a **scheduler hint**, not a correctness tool.

```swift
Task(priority: .high) {
    // user-initiated path — keep short awaits
    _ = try? await fetchToken()
}

Task(priority: .utility) {
    // housekeeping — do not starve interactive work with huge CPU here either
}

// Escalation literacy: awaiting a higher-priority child can boost the waiter.
// Do not spam .high to “fix” latency from wrong isolation or blocking work.
```

**What just happened.** Raise priority for truly interactive work. Detached tasks do **not** inherit actor context or priority the same way — another reason they need a written justification. Priority will not fix a main-actor bottleneck or a missing `Sendable` boundary.

### 7. `TaskLocal` literacy

`TaskLocal` values propagate down a task tree — request IDs, trace context, test fixtures — without threading every parameter.

```swift
enum RequestContext {
    @TaskLocal static var requestID: String?
}

func handle() async {
    await RequestContext.$requestID.withValue("req-42") {
        await nested()
    }
}

func nested() async {
    print(RequestContext.requestID ?? "none")  // "req-42" in this task tree
}
```

**What just happened.** Locals are for **ambient context**, not for smuggling huge mutable objects past isolation. Values should be `Sendable`. Detached tasks may **not** see the same locals — check docs for inheritance rules when you `Task.detached`. Prefer explicit parameters when the dependency is part of the API contract.

### 8. Observation literacy (`@Observable` + `Observations`)

The Observation library lets you mark model classes with the **`@Observable`** macro so UI (and other consumers) can track property access.

```swift
import Observation

@Observable
final class Player {
    var score = 0
    var item = "sword"
}
```

**Lab — `Observations` as `AsyncSequence` (Swift 6.2+ literacy)**

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

func bumpAndWatch() async {
    let player = Player()
    let watcher = Task { await watch(player) }
    player.score = 1
    player.item = "shield"
    player.score = 11          // transactional collapse of sync bursts
    watcher.cancel()
}
```

**What just happened.** The closure *computes* the value you want; Observation tracks which `@Observable` properties were read. Updates are **transactional**: synchronous bursts of property changes collapse into one consistent emission (transaction ends at the next suspending `await`). Treat this as concurrency-native observation — not a second Combine. Verify OS / toolchain availability before promising it on older deployment targets.

`ObservableObject` + `@Published` + Combine remains **legacy literacy** for brownfield SwiftUI (chapter **19**). New models prefer `@Observable`.

### 9. Data races vs logic races

Complete checking targets **data races** (unsynchronized mutable sharing). Logic races (ordering bugs, stale UI, actor reentrancy mistakes) still need tests and clear ownership. Actors serialize; they do not invent correct product behavior.

### 10. Common Swift 6 diagnostic families — and how to fix

| Family (read the diagnostic text) | Typical cause | Fix direction |
|-----------------------------------|---------------|---------------|
| **Sendable / crossing isolation** | Class or mutable state captured in `@Sendable` / Task | Value types, actors, isolate the class, or defended `@unchecked` with a story |
| **Actor-isolated property access** | Touching actor/`@MainActor` state from outside without `await` | `await` the hop; or mark truly safe members `nonisolated` |
| **Main actor isolation** | UI update or model off the main actor | Annotate type/`Task { @MainActor in }`; move heavy work off, mutate on-main |
| **Passing non-Sendable across actors** | Sharing a reference type between domains | Copy values; wrap in actor; make immutable `final` + `Sendable` if justified |
| **Capture of mutable `var` in concurrent code** | Loop variable / local mutated across tasks | Snapshot with `let` before spawn; structured concurrency |
| **Global shared mutable state** | `nonisolated(unsafe)` globals, classic singletons | Actor, main actor, or remove the global |

```swift
// Smell → fix sketch
final class Cache {
    var items: [String] = []
}

// Bad under complete checking: Task { cache.items.append("x") }

actor SafeCache {
    private var items: [String] = []
    func append(_ s: String) { items.append(s) }
}

let cache = SafeCache()
Task { await cache.append("x") }
```

**What just happened.** Most Swift 6 concurrency errors are the compiler asking “who owns this mutation?” Fix isolation first; `@unchecked Sendable` last. Migration guide in References walks module-by-module enablement.

### 11. Swift 6 complete checking — migration steps

1. **Inventory** targets still on Swift 5 language mode / minimal checking.
2. **Enable warnings** as errors for concurrency diagnostics on one module at a time.
3. **Draw isolation boundaries** — `@MainActor` for UI models, actors for shared mutable services, `Sendable` value types at edges.
4. **Fix or wrap** non-Sendable classes (immutability, actors, or a defended `@unchecked Sendable`).
5. **Bridge** completion handlers with checked continuations; delete double-resume bugs.
6. **Turn on Swift 6 language mode** for that target; pin the mode in CI.
7. **Repeat** outward through the package graph; do not “fix” the whole monorepo in one PR.

See the concurrency migration guide in References.

### 12. `AsyncStream` — turn callbacks into `for await`

When an API yields **many** values over time (not one completion), wrap it as an `AsyncStream` / `AsyncThrowingStream` and consume with `for await`.

```swift
func ticks(every nanoseconds: UInt64) -> AsyncStream<Int> {
    AsyncStream { continuation in
        let task = Task {
            var n = 0
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: nanoseconds)
                continuation.yield(n)
                n += 1
            }
            continuation.finish()
        }
        continuation.onTermination = { _ in task.cancel() }
    }
}
```

Prefer official `AsyncSequence` APIs when the platform already provides them. Finish/cancel cleanly — leaked continuations are review smells (same rule as single-shot `withCheckedContinuation`).

### 13. `DiscardingTaskGroup` — fire-and-forget fan-out

Ordinary `TaskGroup` **collects** child results (memory grows with outstanding children). For long-running “accept forever / spawn workers” shapes where you do **not** need each result, use **`withDiscardingTaskGroup`** / throwing variant (Swift 5.9+). Staff habit: pick the group type that matches whether results matter; do not accumulate unused `Void` results forever.

### 14. Actors vs `Mutex` (Synchronization) — pick deliberately

| Tool | Shape | Prefer when… |
|------|-------|----------------|
| **Actor** | Async isolation; hop with `await` | Shared mutable service fits async model |
| **`Mutex`** (Synchronization framework) | Synchronous critical section | You need **immediate** sync access without suspension; protecting a non-Sendable value briefly |

Do **not** block async tasks with old `DispatchSemaphore` “wait on the cooperative pool” patterns — deadlock risk. Prefer actors first; reach for `Mutex` when the sync requirement is real and scoped. Availability depends on platform/SDK — gate with `#available` when needed.

### 15. Distributed actors — door only

**Distributed actors** (`Distributed` module) model actor-like isolation **across** process or network boundaries. This track’s job: know the door exists for multi-node / multi-process designs; do not invent an RPC framework here. Prefer local actors + explicit network APIs unless the team adopts Distributed deliberately with official docs.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | UI models on `@MainActor`; network/IO as `async throws`; Observation for modern UI state; re-check actor state after `await` |
| **Systems** | CLI/server: structured `TaskGroup` fan-out; cancel on shutdown; clocks not `Date()` sprinkles; TaskLocal for request IDs |
| **Security** | Do not pass secrets through unconstrained `@Sendable` closures logged elsewhere; cancel abandoned auth flows |
| **Operations** | Timeouts via racing `Task` + cancellation; measure hangs after await, not only CPU; priority for interactive paths only |
| **Software engineering** | Public APIs prefer `async` over completion handlers; document isolation; migrate diagnostics family-by-family, module-by-module |

---

## 4. Staff-level review checklist

- [ ] New async work uses `async`/`await`; completion handlers appear only as bridges or legacy.
- [ ] Continuations / `AsyncStream` bridges resume exactly once and cancel cleanly.
- [ ] Task groups chosen deliberately (`TaskGroup` vs discarding) for result lifetime.
- [ ] Shared mutable state uses actors (or scoped `Mutex`) — not ad-hoc locks on the cooperative pool.
- [ ] Shared mutable state has an isolation story (actor / main actor / immutable values).
- [ ] Structured concurrency preferred; unstructured `Task` / `Task.detached` ownership and cancellation are explicit.
- [ ] Actor methods that `await` re-validate state (reentrancy lab understood).
- [ ] No casual `@unchecked Sendable` or force-casts to silence Swift 6 checking.
- [ ] Cancellation is cooperative on long loops, sleeps, and IO wrappers; clock sleeps cancel cleanly.
- [ ] Continuations resume exactly once; prefer native async APIs when available.
- [ ] `AsyncStream` / discarding task groups chosen deliberately for multi-value and fire-and-forget fan-out.
- [ ] Shared mutable state uses actors (or scoped `Mutex`) — not ad-hoc locks on the cooperative pool.
- [ ] Distributed actors treated as a door with official docs — not accidental RPC.
- [ ] `nonisolated` members do not touch isolated mutable state.
- [ ] Task priority and TaskLocal use are intentional — not hidden global mutable state.
- [ ] `@Observable` / `Observations` used with availability literacy; not mixed carelessly with Combine `@Published` for new code.
- [ ] Swift 6 diagnostic families addressed by isolation design, not suppression.
- [ ] Language mode / checking level for the target is intentional and pinned in CI.

---

## References

- [Concurrency (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
- [Sendable](https://developer.apple.com/documentation/swift/sendable)
- [MainActor](https://developer.apple.com/documentation/swift/mainactor)
- [TaskLocal](https://developer.apple.com/documentation/swift/tasklocal)
- [Observation](https://developer.apple.com/documentation/observation)
- [TaskGroup](https://developer.apple.com/documentation/swift/taskgroup)
- [DiscardingTaskGroup](https://developer.apple.com/documentation/swift/discardingtaskgroup)
- [AsyncStream](https://developer.apple.com/documentation/swift/asyncstream)
- [Synchronization / Mutex](https://developer.apple.com/documentation/synchronization)
- [Distributed](https://developer.apple.com/documentation/distributed)
- [Clock](https://developer.apple.com/documentation/swift/clock)
