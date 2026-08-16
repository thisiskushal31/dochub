# Control flow, functions, and closures

[← Back to Swift](./README.md)

## What this chapter covers

`if` / `switch` / `guard`, loops (including **labeled** `break` / `continue`), **`defer`**, deep **pattern matching** and **`where`**, **functions** (`inout`, function types, **`borrowing` / `consuming`** parameter ownership intro, **`consume` operator** literacy), and **closures** — trailing syntax, **`@autoclosure`** with a real API shape, capture lists, **`@escaping`**, and **`@Sendable`**. Default is **Swift 6.3.x** / Swift 6 language mode. Legacy literacy: C-style `for`, `++` / `--`. Ownership depth continues in chapters **06** (`~Copyable`) and **11** (ARC / exclusivity).

Control flow shapes how failure exits early; functions and closures shape how work is named and passed around. Closures that capture `self` are a primary source of retain cycles in Apple app trees — treat them as a review concern, not sugar.

---

## 1. Concepts

### 1. Conditionals: `if`, `guard`, early exit

Prefer **`guard`** when a precondition must hold for the rest of the scope: on failure you leave (`return`, `throw`, `continue`, `break`).

```swift
func process(_ path: String?) -> String {
    guard let path, !path.isEmpty else {
        return "missing"
    }
    // path is non-optional here — happy path stays flat
    return path.uppercased()
}
```

`if let` / `guard let` bind optionals. Swift allows optional binding without a second name when the names match (`guard let path`).

### 2. `switch` is exhaustive — pattern matching depth

`switch` must cover every possibility (or include `default`). Cases do not fall through unless you write `fallthrough`. Patterns work on enums, ranges, tuples, and values refined with `where`.

```swift
func label(for code: Int) -> String {
    switch code {
    case 200..<300:
        return "ok"
    case 404:
        return "missing"
    case let n where n >= 500:
        return "server \(n)"
    default:
        return "other"
    }
}

func describe(point: (Int, Int)) -> String {
    switch point {
    case (0, 0):
        return "origin"
    case (_, 0):
        return "on x-axis"
    case (0, _):
        return "on y-axis"
    case let (x, y) where x == y:
        return "diagonal"
    case let (x, y):
        return "(\(x), \(y))"
    }
}
```

**What just happened**

- Ranges and `where` refine cases without nested `if`.
- Tuple patterns bind parts; `_` ignores what you do not need.
- Exhaustiveness on enums (chapter **06**) is a compiler-backed checklist—do not hide unfinished cases behind a lazy `default` when the enum is yours.

### 3. Lab — more pattern matching (enums, bindings, `where`)

```swift
enum Route {
    case home
    case profile(userID: String, tab: Int)
    case search(query: String)
}

func title(for route: Route) -> String {
    switch route {
    case .home:
        return "Home"
    case .profile(let id, tab: 0):
        return "Profile \(id) (overview)"
    case .profile(let id, let tab) where tab > 0:
        return "Profile \(id) tab \(tab)"
    case .search(let q) where q.count >= 3:
        return "Search: \(q)"
    case .search:
        return "Search (too short)"
    }
}

// Pattern matching in `if case` / `guard case` — short peeks without a full switch
func isHome(_ route: Route) -> Bool {
    if case .home = route { return true }
    return false
}

func requireUserID(_ route: Route) -> String? {
    guard case .profile(let id, _) = route else { return nil }
    return id
}

// `for case` — filter while iterating
let routes: [Route] = [.home, .search(query: "ada"), .profile(userID: "42", tab: 1)]
for case .search(let q) in routes {
    print("query:", q)
}
```

**What just happened**

- Associated values bind with `let` inside the pattern; refine with `where`.
- `if case` / `guard case` / `for case` keep matching local when a full `switch` would be noise.
- Prefer exhaustive `switch` on your own enums; use `if case` for one-branch peeks.

### 4. Loops and labeled breaks

```swift
for name in ["a", "b"] {
    print(name)
}

for i in 0..<3 {          // 0, 1, 2
    print(i)
}

outer: for row in 0..<3 {
    for col in 0..<3 {
        if row == 1 && col == 1 {
            break outer     // Leaves the outer loop, not only the inner
        }
    }
}

var n = 3
while n > 0 { n -= 1 }

repeat {
    n += 1
} while n < 2
```

Labels are for nested control that would otherwise need flags. Prefer flattening when you can; use labels when the algorithm is truly nested.

### 5. `defer` — cleanup that always runs

`defer` schedules work for when the **current scope** exits — success, `return`, or `throw`. Multiple `defer`s run in reverse order (stack discipline).

```swift
func readTemp() {
    let fd = openHandle()
    defer { closeHandle(fd) }   // Runs on every exit path from this scope
    // use fd …
}

func stacked() {
    defer { print("second") }
    defer { print("first") }    // Prints "first" then "second"
}
```

Pair `defer` with locks, file handles, and “restore previous state” (chapter **09** for throwing paths).

### 6. Functions: labels, `inout`, and function types

Argument labels are part of the API. `_` hides the external label. Default values and variadics exist. **`inout`** passes a mutable binding that the callee can write back.

```swift
func greet(_ name: String, excitedly: Bool = false) -> String {
    excitedly ? "Hello, \(name)!" : "Hello, \(name)"
}

func bump(_ value: inout Int) {
    value += 1
}

var count = 0
bump(&count)                  // & required at the call site
print(count)                  // 1

func chooseSorter(ascending: Bool) -> (Int, Int) -> Bool {
    ascending ? { $0 < $1 } : { $0 > $1 }
}

let cmp: (Int, Int) -> Bool = chooseSorter(ascending: true)
```

**What just happened**

- Functions are first-class values: assign, pass, return.
- `inout` is not “pass by reference forever”—it copies in/out for value types; exclusivity rules still apply (chapter **11**).
- The type `(Int, Int) -> Bool` is a function type you can name in APIs.

### 7. Closures and trailing syntax

A closure is an unnamed function value. Trailing-closure syntax is idiomatic when the last parameter is a closure.

```swift
let nums = [3, 1, 2]
let sorted = nums.sorted { $0 < $1 }
let doubled = nums.map { $0 * 2 }

let same = nums.map { (value: Int) -> Int in
    value * 2
}

// Multiple trailing closures (Swift 5.3+) — readability for begin/success/failure shapes
func load(from url: String, onStart: () -> Void, onDone: (String) -> Void) {
    onStart()
    onDone("payload")
}

load(from: "https://example.com") {
    print("start")
} onDone: { body in
    print(body)
}
```

---

## 2. Advanced concepts

### 1. Ownership intro — `borrowing` / `consuming` parameters

Ordinary Copyable values can be passed freely. As Swift grows **noncopyable** / move-only types (chapter **06**), function parameters need an explicit **ownership** story: does the callee *borrow* the value for the duration of the call, or *consume* it (take it over so the caller cannot use it again)?

| Spelling | Mental model | Pair with |
|----------|--------------|-----------|
| *(default for Copyable)* | Callee may use a copy / shared access per normal rules | Everyday app models |
| **`borrowing`** | Callee uses the value **without taking ownership**; caller keeps it | Read-only access to unique resources |
| **`consuming`** | Callee **takes** the value; caller’s binding is ended (moved) | Hand-off of file handles, tokens, unique wrappers |
| **`inout`** | Temporary exclusive mutation; returned to caller | Update-in-place of Copyable (and some advanced cases) |

```swift
// Literacy sketch — signatures you will see as ~Copyable spreads (Swift 6.x)
// Exact types often appear in systems APIs; app models should stay Copyable when they can.

struct Token: ~Copyable {
    let id: Int
    // noncopyable: cannot be casually assigned twice — chapter 06
}

func inspect(_ token: borrowing Token) {
    // May read token for the call; does not take it away from the caller.
    print(token.id)
}

func retire(_ token: consuming Token) {
    // Takes ownership; caller must not use token afterward.
    print("retiring", token.id)
}

// Usage shape (illustrative):
// var t = Token(id: 1)
// inspect(t)          // borrow — t still usable
// retire(t)           // consume — t is gone (moved)
```

**What just happened**

- **Borrow** = “look, don’t take.” **Consume** = “this is yours now.”
- Most application DTOs should remain ordinary **Copyable** structs—do not sprinkle ownership keywords for fashion.
- When you see these on APIs that wrap OS resources, read them as **lifetime contracts**. Full noncopyable story: chapter **06**; exclusivity / ARC: chapter **11**.

### 2. `consume` operator literacy

The **`consume`** operator explicitly ends the lifetime of a binding by moving its value—useful with noncopyable types and sometimes with Copyable values when you want the compiler to enforce “do not use after hand-off.”

```swift
struct Box: ~Copyable {
    var label: String
    init(_ label: String) { self.label = label }
}

func take(_ box: consuming Box) {
    print("took", box.label)
}

func handOff() {
    let box = Box("letters")
    take(consume box)          // Explicit move into the callee
    // print(box.label)        // Error — box was consumed
}
```

**What just happened**

- `consume` makes the move **visible at the call site**—good for review.
- Prefer explicit `consume` when ownership transfer is the point of the line.
- Do not “consume” ordinary Copyable models just to look advanced; you will only confuse readers.

### 3. Escaping vs non-escaping

By default, function parameters that are closures are **non-escaping**: they must be called before the function returns. Mark **`@escaping`** when the closure is stored or called later (completion handlers, Dispatch, Task wrappers).

```swift
var handlers: [() -> Void] = []

func onReady(_ body: @escaping () -> Void) {
    handlers.append(body)     // Stored past return → must be @escaping
}

func immediately(_ body: () -> Void) {
    body()                    // Non-escaping — default
}
```

Escaping closures cannot capture `inout` parameters. They are also the ones that most often capture `self` and extend object lifetime.

### 4. Lab — capture lists (`weak` / `unowned` / value capture)

Closures capture enclosing bindings. For classes, capturing `self` strongly can create a **retain cycle** (object → closure → object).

```swift
final class Loader {
    var onDone: (() -> Void)?
    var name = "loader"
    var ticks = 0

    func armWeak() {
        onDone = { [weak self] in
            guard let self else { return }
            print(self.name)
        }
    }

    func armSnapshot() {
        // Capture a *copy* of the Int now — later mutations to ticks are invisible
        onDone = { [ticks] in
            print("ticks at arm time:", ticks)
        }
    }

    func armUnowned() {
        // Legacy-risk pattern — only when self outlives the closure for sure.
        // Prefer [weak self] in new code unless lifetimes are proven.
        onDone = { [unowned self] in
            print(self.name)
        }
    }
}
```

| Capture | Meaning |
|---------|---------|
| (default) | Strong capture |
| `[weak self]` | Optional; becomes `nil` if the object dies |
| `[unowned self]` | Non-optional; crashes if used after deallocation |
| `[ticks]` / `[name = self.name]` | Capture values by copy at creation time |

Prefer `weak` unless the relationship is strictly shorter-lived and documented. Chapter **11** deepens ARC; chapter **10** deepens concurrency.

### 5. `@autoclosure` — real API shape (not just a toy)

`@autoclosure` lets callers write an expression that becomes a closure automatically—handy for lazy arguments (`assert`, precondition helpers, logging).

```swift
// Real shape: short-circuiting debug / assert helpers
func require(
    _ condition: @autoclosure () -> Bool,
    _ message: @autoclosure () -> String = "requirement failed",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    if !condition() {
        // message() runs only on failure — expensive interpolation stays cheap on success
        fatalError(message(), file: file, line: line)
    }
}

func heavyDescription() -> String {
    // Pretend this walks a big graph
    "state dump…"
}

let ready = true
require(ready, "not ready: \(heavyDescription())")
// When ready == true, heavyDescription() never runs.

// Stdlib-shaped cousin you already use:
// assert(ready, "not ready: \(heavyDescription())")
```

```swift
// Another real shape: lazy default in a tiny config helper
func value(
    _ preferred: String?,
    fallback: @autoclosure () -> String
) -> String {
    preferred ?? fallback()
}

let host = value(nil, fallback: ProcessInfo.processInfo.hostName)
// fallback closure runs only when preferred is nil
```

**What just happened**

- `@autoclosure` turns `expr` into `{ expr }` at the call site—callers stay readable.
- Laziness is the point: **do not evaluate expensive messages until needed**.
- Do not sprinkle `@autoclosure` on every parameter—it hides evaluation order and surprises reviewers. Keep it for assert/log/default shapes.

### 6. `@Sendable` — why it exists

Under Swift 6 complete concurrency checking, closures that cross isolation domains often need to be **`@Sendable`**: safe to call from another concurrency domain without data races. You will see `@Sendable` on completion-style APIs and on `Task` / actor boundaries.

```swift
func runLater(_ work: @escaping @Sendable () -> Void) {
    // store / schedule work — details in chapter 10
    _ = work
}

// Capturing a non-Sendable class mutably inside @Sendable work is a design smell —
// the compiler will push back under Swift 6 language mode.
```

**Why:** Sendable means “no unprotected shared mutable state.” Do not “fix Sendable” by force-casting. Treat warnings as design signals.

### 7. Legacy literacy: C-style `for` and `++`

```swift
// Legacy (Swift 2 era C-style for / increment operators) — do not use in new code.
// for var i = 0; i < 3; i++ { ... }
// Prefer:
for i in 0..<3 { }
var i = 0
i += 1   // not i++
```

C-style `for (;;)` and `++` / `--` were removed in **Swift 3**. Brownfield diffs still show them; rewrite on touch.

### 8. `rethrows` tease

Functions that only throw when a closure argument throws use `rethrows`—common in `map`-shaped helpers. Full error story in chapter **09**.

```swift
func twice(_ body: () throws -> Void) rethrows {
    try body()
    try body()
}
```

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | `guard` at API edges; trailing closures for UI/event handlers with explicit capture lists; pattern-match screen routes with enums; labeled breaks only when nested UI loops need them |
| **Systems** | Prefer `for-in` over manual indices; `defer` for fd/lock cleanup; `borrowing`/`consuming` on unique resource APIs; avoid unbounded loops over user-controlled collections without a bound |
| **Security** | Do not use force paths (`try!`, force unwrap) to “simplify” control flow around auth or crypto; keep `@autoclosure` off secret-bearing expressions that might evaluate unexpectedly; do not consume tokens without a clear retire path |
| **Operations** | CLI tools: `guard` + `return` / `throw` for missing flags; clear exit paths; `defer` restores terminal state |
| **Software engineering** | Named functions for reusable logic; closures for short adapters; document escaping callbacks, Sendable, and ownership requirements |

Callbacks and completion handlers remain common in older Apple APIs. New code prefers `async`/`await` (chapter **10**); still read closures fluently to review and migrate.

---

## 4. Staff-level review checklist

- `guard` used for preconditions; deep nested `if let` pyramids are flattened.
- `switch` is exhaustive on enums; `default` is not hiding unfinished cases.
- Pattern matching (`if case` / `for case` / `where`) used where it clarifies—not as cleverness.
- `defer` covers cleanup on throw/return paths; order of multiple defers is understood.
- Escaping closures that capture class `self` use an explicit capture list when needed.
- `inout` call sites use `&`; exclusivity / overlapping access is not ignored.
- `borrowing` / `consuming` / `consume` appear only with a real ownership story (usually noncopyable resources).
- `@autoclosure` laziness is intentional (assert/log/default shapes), not decorative.
- No new `++` / C-style `for`; brownfield occurrences are migrated when the file is touched.
- `@Sendable` / concurrency warnings are not silenced without an ownership story.
- Closure-heavy APIs have a clear “who owns the callback?” answer.

---

## References

- [Control Flow (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
- [Functions (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)
- [Closures (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [The Basics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Memory Safety (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/) (exclusivity / `inout`)
- [Consuming and Nonconsuming Methods (TSPL / ownership)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Ownership manifesto / evolution hub](https://www.swift.org/swift-evolution/)
