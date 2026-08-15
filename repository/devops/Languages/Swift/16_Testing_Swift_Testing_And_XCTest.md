# Testing: Swift Testing and XCTest

[← Back to Swift](./README.md)

## What this chapter covers

**Swift Testing** as the default for **new** tests (`@Test`, `#expect`, `#require`, traits, parameterized and async tests), **parallel vs serialized** execution, **XCTest** coexistence and migration, **test plans / `swift test` filters**, **flaky test hygiene**, and **coverage as signal not goal**. Default language narrative: **Swift 6.3.x** / Swift 6 language mode.

Tests are executable documentation of behavior. Prefer clear assertions and deterministic setup over clever frameworks. New suites should start on Swift Testing unless a platform gap forces XCTest.

Picture tests as **fire drills**: you pull the alarm on purpose to prove the door locks. If you cannot make the computer fail on purpose, you do not yet know the door is locked.

---

## 1. Concepts

### 1. Swift Testing — default for new work

Swift Testing uses macros such as `@Test`, `#expect`, and `#require`. Traits express runtime conditions; suites group related tests.

```swift
import Testing

@Test("sum adds two numbers")
func sumAdds() {
    #expect(2 + 2 == 4)
}

@Test
func asyncFetch() async throws {
    let value = try await fetchToken()
    #expect(!value.isEmpty)
}

func fetchToken() async throws -> String { "token" }
```

| Tool | Role |
|------|------|
| `@Test` | Marks a test function (optional display name) |
| `#expect` | Soft assertion — failure records, test continues when possible |
| `#require` | Hard gate — unwrap/condition must hold or the test stops |

```swift
@Test
func requireShape() throws {
    let row = try #require(loadRow())
    #expect(row.id > 0)
}

func loadRow() -> (id: Int)? { (id: 1) }
```

**What just happened.** `#expect` is “check this.” `#require` is “without this, the rest is nonsense” — ideal for optionals and preconditions. Run with `swift test` in packages; Xcode discovers Swift Testing tests when the toolchain supports them.

### 2. Traits and parameterization

```swift
import Testing

@Test(.enabled(if: FeatureFlags.networking))
func talksToNetwork() async throws {
    #expect(try await ping())
}

@Test(arguments: [1, 2, 3])
func doubles(_ n: Int) {
    #expect(n * 2 == n + n)
}

@Test(arguments: zip(["a", "b"], [1, 2]))
func pairs(_ name: String, _ id: Int) {
    #expect(!name.isEmpty && id > 0)
}

func ping() async throws -> Bool { true }
enum FeatureFlags { static let networking = true }
```

**What just happened.** Traits gate runtime conditions (OS, flags, time limits — see framework docs for the full set). Parameterized tests reduce copy-paste. Keep cartesian products readable — giant grids belong in property/fuzz tools, not default unit tests.

### 3. Async tests and actors

Prefer `async` test functions over expectations/semaphores.

```swift
import Testing

@Test
func actorCounter() async {
    let c = Counter()
    #expect(await c.increment() == 1)
}

actor Counter {
    private var value = 0
    func increment() -> Int {
        value += 1
        return value
    }
}
```

```swift
// Legacy (XCTest expectations for simple async) — prefer async tests instead.
// let exp = expectation(description: "done")
// … exp.fulfill(); wait(for: [exp], timeout: 1.0)
```

Still use timeouts at integration edges; flaky network tests need fakes, not longer sleeps.

### 4. XCTest coexistence and migration

Brownfield codebases often have large XCTest targets. **Do not rewrite everything on day one.** Add Swift Testing for new modules/features; migrate hotspots when touching files.

```swift
import XCTest

// Legacy (XCTest-only for brand-new suites) — do not use as the default for new code.
final class SumTests: XCTestCase {
    func testSum() {
        XCTAssertEqual(2 + 2, 4)
    }
}

// Prefer Swift Testing @Test / #expect for new tests when available.
```

| Habit | Why |
|-------|-----|
| New logic → Swift Testing | Modern assertions, traits, parameterization |
| Existing XCTest → leave until touched | Avoid big-bang churn |
| UI / XCUITest → often XCTest-hosted | Separate layer (literacy) |

Both can live in the same package/app. Know which runner CI invokes (`xcodebuild test`, `swift test`).

### 5. What good tests assert

Assert **behavior at boundaries**: encoding, parsing, state transitions, error cases. Avoid asserting private implementation details that make refactors noisy. Use `@testable import` carefully (chapter **15**) — it is not a license to test every `private` helper.

### 6. Lab — `#expect` vs `#require` side by side

```swift
import Testing

struct User { var id: Int; var name: String }

func maybeUser() -> User? { User(id: 1, name: "Ada") }

@Test
func softThenHard() throws {
    let user = try #require(maybeUser())   // stop if nil
    #expect(user.name == "Ada")           // continue recording if wrong
    #expect(user.id > 0)
}
```

**What just happened.** One failed `#expect` can leave later expects still useful in the report. A failed `#require` ends the test — use it for setup that must exist. Mixing them poorly (requiring trivia, expecting preconditions) makes failures noisy.

---

## 2. Advanced concepts

### 1. Parallel vs serialized

Tests may run in **parallel**. Shared mutable files, static globals, and fixed ports without isolation cause flakes.

```swift
import Testing

@Suite(.serialized)
struct DatabaseSuite {
    @Test func migrate() async throws { /* exclusive DB */ }
    @Test func query() async throws { /* exclusive DB */ }
}
```

**What just happened.** Prefer per-test temp directories (`FileManager` temporary + UUID) and isolated state so most suites stay parallel. Serialize only the narrow suites that truly share a process-global resource — serialization is a scalpel, not a blanket.

### 2. Runners, filters, and test plans

| Context | Common command |
|---------|----------------|
| SPM package | `swift test` |
| Filter (SPM) | `swift test --filter ActorCounter` (pattern varies by toolchain — check `swift test --help`) |
| Xcode app | `xcodebuild test -scheme … -destination …` |
| Xcode test plan | Selects targets, configurations, parallelization for CI vs smoke |

Document the **test plan name** (or exact `swift test` invocation) in the runbook (chapter **21**). Local “click diamond” and CI must mean the same suite.

```bash
# Package literacy — discover exact flags on your pin:
swift test --help

# Typical shapes (names evolve — verify on 6.3.x):
swift test --filter ExampleKitTests
swift test --filter doubles
```

**What just happened.** Filters let smoke jobs run a tagged subset while nightly runs everything. Without a documented filter/plan, “CI is red” becomes “which suite did we mean?”

### 3. Error and cancellation tests

```swift
import Testing

enum Boom: Error { case no }

@Test
func failurePath() async {
    await #expect(throws: Boom.self) {
        throw Boom.no
    }
}
```

For cancellation, cancel a `Task` and expect `CancellationError` as designed (chapter **10**). Do not treat cancellation as “whatever happened after a sleep.”

```swift
@Test
func cancelsSleep() async {
    let handle = Task {
        try await Task.sleep(for: .seconds(60))
    }
    handle.cancel()
    let result = await handle.result
    #expect(throws: CancellationError.self) {
        try result.get()
    }
}
```

### 4. Snapshot and UI tests (literacy)

UI tests and snapshot tests often remain XCTest-hosted. Treat them as a separate layer: slower, more brittle, still valuable for smoke. Unit/logic tests should not require a simulator when a pure Swift test suffices.

### 5. Flaky test hygiene

| Smell | Fix |
|-------|-----|
| Sleeps as synchronization | Await conditions / async APIs / fakes |
| Shared files / ports | UUID temp dirs, ephemeral ports |
| Live network in unit tests | Fake URLProtocol / injected clients |
| Order-dependent tests | Reset state in setup; avoid static mutation |
| Timezones / locale | Pin calendar/timezone in tests (chapter **13**) |

**Policy.** Quarantine with a ticket and owner — do not `#if false` silently. Flaky tests train the team to ignore red CI.

### 6. Coverage as signal, not goal

Coverage numbers highlight *untested paths*; they do not prove correctness. Chasing 100% creates noisy tests that assert implementation trivia. Prefer:

- critical path + failure path coverage,
- fuzz/property tests for parsers and math,
- fewer, sharper tests over line-count vanity.

### 7. Migration checklist — XCTest → Swift Testing

1. Leave green XCTest alone until you touch the file.
2. New types / modules: Swift Testing only.
3. When editing an XCTest case, prefer porting that case over adding a second copy.
4. Map `XCTAssertEqual` → `#expect(==)`; `XCTUnwrap` → `#require`.
5. Map expectations/timeouts → `async` tests + fakes.
6. Keep UI / snapshot hosts on XCTest until your toolchain story says otherwise.
7. Update CI filters/plans so both runners stay visible in the same job matrix if mixed.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | View-model logic under Swift Testing; UI tests thin |
| **Systems** | Package CI: `swift test` on Linux + Apple where supported |
| **Security** | Negative tests for authz/validation; never commit live secrets for fixtures |
| **Operations** | CI pins Xcode/Swift; publishes failure logs; separates smoke vs full via test plans/filters |
| **Software engineering** | New tests in Swift Testing; XCTest left for legacy/UI; flake PRs reviewed seriously; coverage is a flashlight |

---

## 4. Staff-level review checklist

- [ ] New unit tests default to Swift Testing when the toolchain supports it.
- [ ] `#expect` vs `#require` used intentionally; parameterized tests stay readable.
- [ ] Traits/gates match real runtime conditions — not permanent skips without tickets.
- [ ] XCTest remains for legacy/UI without forcing a big-bang rewrite.
- [ ] Async APIs tested with `async` tests, not ad-hoc sleeps.
- [ ] Parallel-safe isolation; `.serialized` only where justified.
- [ ] CI command/scheme/test plan/filter is documented and pinned to a toolchain.
- [ ] Fixtures contain no secrets; failure messages are log-safe.
- [ ] Flaky tests are fixed or quarantined with ownership — not ignored.
- [ ] Coverage used as a signal for gaps, not a merge gate vanity metric.

---

## References

- [Swift Testing](https://developer.apple.com/documentation/testing)
- [XCTest](https://developer.apple.com/documentation/xctest)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
- [Xcode](https://developer.apple.com/documentation/xcode)
