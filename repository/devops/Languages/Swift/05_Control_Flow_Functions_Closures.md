# Control flow, functions, and closures

[← Back to Swift](./README.md)

## What this chapter covers

`if` / `switch` / `guard`, loops (including **labeled** `break` / `continue`), **`defer`**, deep **pattern matching** and **`where`**, **functions** (`inout`, function types), and **closures** — trailing syntax, **`@autoclosure`**, capture lists, **`@escaping`**, and **`@Sendable`**. Default is **Swift 6.3.x** / Swift 6 language mode. Legacy literacy: C-style `for`, `++` / `--`.

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

### 3. Loops and labeled breaks

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

### 4. `defer` — cleanup that always runs

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

### 5. Functions: labels, `inout`, and function types

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

### 6. Closures and trailing syntax

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

### 1. Escaping vs non-escaping

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

### 2. Lab — capture lists (`weak` / `unowned` / value capture)

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

### 3. `@autoclosure` literacy

`@autoclosure` lets callers write an expression that becomes a closure automatically—handy for lazy arguments (`assert`, `??`-shaped helpers).

```swift
func logIfDebug(_ message: @autoclosure () -> String) {
    #if DEBUG
    print(message())          // Evaluated only if we call it
    #endif
}

logIfDebug("expensive \(heavyWork())")  // heavyWork runs only in DEBUG when logged
```

Do not sprinkle `@autoclosure` on every parameter—it hides evaluation order. Use it when laziness is the point (assertions, short-circuiting diagnostics).

### 4. `@Sendable` — why it exists

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

### 5. Legacy literacy: C-style `for` and `++`

```swift
// Legacy (Swift 2 era C-style for / increment operators) — do not use in new code.
// for var i = 0; i < 3; i++ { ... }
// Prefer:
for i in 0..<3 { }
var i = 0
i += 1   // not i++
```

C-style `for (;;)` and `++` / `--` were removed in **Swift 3**. Brownfield diffs still show them; rewrite on touch.

### 6. `rethrows` tease

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
| **Application** | `guard` at API edges; trailing closures for UI/event handlers with explicit capture lists; labeled breaks only when nested UI loops need them |
| **Systems** | Prefer `for-in` over manual indices; avoid unbounded loops over user-controlled collections without a bound; `defer` for fd/lock cleanup |
| **Security** | Do not use force paths (`try!`, force unwrap) to “simplify” control flow around auth or crypto; keep `@autoclosure` off secret-bearing expressions that might evaluate unexpectedly |
| **Operations** | CLI tools: `guard` + `return` / `throw` for missing flags; clear exit paths; `defer` restores terminal state |
| **Software engineering** | Named functions for reusable logic; closures for short adapters; document escaping callbacks and Sendable requirements |

Callbacks and completion handlers remain common in older Apple APIs. New code prefers `async`/`await` (chapter **10**); still read closures fluently to review and migrate.

---

## 4. Staff-level review checklist

- [ ] `guard` used for preconditions; deep nested `if let` pyramids are flattened.
- [ ] `switch` is exhaustive on enums; `default` is not hiding unfinished cases.
- [ ] `defer` covers cleanup on throw/return paths; order of multiple defers is understood.
- [ ] Escaping closures that capture class `self` use an explicit capture list when needed.
- [ ] `inout` call sites use `&`; exclusivity / overlapping access is not ignored.
- [ ] `@autoclosure` laziness is intentional, not decorative.
- [ ] No new `++` / C-style `for`; brownfield occurrences are migrated when the file is touched.
- [ ] `@Sendable` / concurrency warnings are not silenced without an ownership story.
- [ ] Closure-heavy APIs have a clear “who owns the callback?” answer.

---

## References

- [Control Flow (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
- [Functions (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)
- [Closures (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/)
- [The Basics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/)
- [Memory Safety (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/) (exclusivity / `inout`)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
