# Structs, classes, enums — value and reference

[← Back to Swift](./README.md)

## What this chapter covers

**Structures**, **classes** (including **inheritance**, **`override`**, **`final`**, **`super`**, required-init literacy), and **enumerations** (associated values + pattern-switch labs), plus **Equatable / Hashable** synthesis literacy, a **copy-on-write (COW)** lab you can feel, **nested types**, **`~Copyable` / noncopyable types** (borrow vs consume mental model, when move-only types appear), and an expanded **class vs struct** decision table. Default is **Swift 6.3.x** / Swift 6 language mode.

Most model data in modern Swift is a struct or an enum. Classes exist for identity, inheritance, and Objective-C/UIKit-shaped lifetimes — not as the default “bag of fields.” Noncopyable types exist for **unique resources**; they are not a new default for app DTOs.

---

## 1. Concepts

### 1. Structures (value types)

A `struct` is a value type: assignment and argument passing give you an independent value (semantically a copy). Mutating a copy does not mutate the original.

```swift
struct Point {
    var x: Double
    var y: Double

    mutating func move(by dx: Double, dy: Double) {
        x += dx
        y += dy
    }
}

var a = Point(x: 0, y: 0)
var b = a
b.move(by: 1, dy: 0)
// a is still (0, 0); b is (1, 0)
```

Methods that change stored properties on a struct/enum must be marked `mutating`. `let` bindings of structs are immutable end-to-end (you cannot call `mutating` methods on them).

Memberwise initializers are synthesized for structs when you do not define your own custom `init` that blocks them — details in chapter **07**.

### 2. Classes (reference types)

A `class` is a reference type: multiple variables can refer to the **same** instance. Mutation through one name is visible through the others. Classes support inheritance; structs and enums do not.

```swift
final class Counter {
    var value = 0
    func bump() { value += 1 }
}

let c1 = Counter()
let c2 = c1
c2.bump()
// c1.value == 1 — shared identity
```

Prefer `final` when you do not intend subclassing: clearer intent, and it helps the optimizer. Identity comparison uses `===` / `!==` for class instances.

### 3. Lab — inheritance, `override`, `final`, `super`

```swift
class Vehicle {
    var speed = 0.0
    func description() -> String { "moving at \(speed)" }

    required init(speed: Double) {
        self.speed = speed
    }
}

class Bike: Vehicle {
    var hasBell = true

    override func description() -> String {
        super.description() + (hasBell ? " (bell)" : "")
    }

    required init(speed: Double) {
        super.init(speed: speed)
    }

    init(speed: Double, hasBell: Bool) {
        self.hasBell = hasBell
        super.init(speed: speed)
    }
}

final class CargoBike: Bike {
    // final — no further subclassing; overrides stop here for this type
    override func description() -> String {
        "cargo " + super.description()
    }
}
```

**What just happened**

- `override` marks intentional replacement of an inherited method; the compiler catches typos.
- `super` reaches the superclass implementation—call it when you are extending, not replacing, behavior.
- `required init` forces every subclass to implement that initializer (common with factories / `NSCoding`-shaped APIs). Literacy here; full init rules in chapter **07**.
- Mark leaf types `final` when subclassing is not part of the API contract.

### 4. Enumerations and associated values

Enums define a closed set of cases. Cases may carry **associated values**.

```swift
enum NetworkResult {
    case ok(Data)
    case httpError(code: Int, body: Data?)
    case offline
}

func describe(_ r: NetworkResult) -> String {
    switch r {
    case .ok(let data):
        return "bytes=\(data.count)"
    case .httpError(let code, nil):
        return "http \(code) (empty body)"
    case .httpError(let code, let body?):
        return "http \(code) body=\(body.count)"
    case .offline:
        return "offline"
    }
}
```

Raw-value enums (`String`, `Int`, …) are useful for stable wire/config tags. Recursive enums use `indirect` when a case nests the same enum type.

### 5. Value vs reference — expanded decision table

| Need | Prefer | Why |
|------|--------|-----|
| Independent snapshots, DTOs, pure data | `struct` / `enum` | Assignment does not share mutation |
| Mutually exclusive states | `enum` | Exhaustive `switch`; no flag soup |
| Shared mutable identity (session, live connection) | `class` or `actor` | One object, many observers |
| Framework base class (UIKit, etc.) | `class` | Inheritance required by the SDK |
| Deterministic teardown of a resource tied to lifetime | `class` + `deinit` **or** noncopyable + `deinit` | Unique ownership stories differ—see §2.1 |
| ObjC / `@objc` dynamic dispatch | `class` | Interop (chapter **15**) |
| Isolated shared mutable state | `actor` (ch **10**) | Prefer over ad-hoc locks on a class |
| Unique OS resource (fd, exclusive token) | `struct: ~Copyable` (when API exists) | One owner; borrow/consume at calls |

Choose **value** unless you need shared mutable identity, inheritance, or a framework that requires a class. Choose **noncopyable** only when copying would be meaningless or dangerous.

---

## 2. Advanced concepts

### 1. `~Copyable` / noncopyable types — full literacy

By default, Swift structs are **Copyable**: assignment duplicates the value (cheaply for COW collections). A type declared **`~Copyable`** suppresses that—**move-only** / noncopyable. There is exactly one owner at a time. You **borrow** for temporary use or **consume** to transfer ownership (chapter **05** introduced the parameter keywords).

#### Borrow vs consume mental model

```text
Copyable (ordinary struct):
  var a = Value()
  var b = a          // both usable — independent values (semantically)

~Copyable (move-only):
  var a = Resource()
  // var b = a       // not allowed — would duplicate a unique resource
  inspect(a)         // borrowing — a still owned here afterward
  take(a)            // consuming — a is gone; callee owns it
```

| Operation | Meaning | Afterward |
|-----------|---------|-----------|
| **Borrow** (`borrowing` param / temporary access) | Look without taking | Caller still owns the value |
| **Consume** (`consuming` param / `consume` / move) | Hand off ownership | Caller’s binding ends |
| **Copy** | Duplicate | **Not available** on `~Copyable` |

#### Lab — a unique resource wrapper

```swift
/// Sketch of a unique file-handle wrapper (Swift 6.x literacy).
/// Real projects may use stdlib / system types; the ownership shape is the lesson.
struct FileHandle: ~Copyable {
    private let fd: Int32

    init(fd: Int32) {
        self.fd = fd
    }

    borrowing func descriptor() -> Int32 {
        fd                                   // Read without giving away the handle
    }

    deinit {
        // Runs when the unique owner goes away — close exactly once.
        // (_close is illustrative — use the real close API for your platform.)
        _ = fd
    }
}

func readHeader(_ handle: borrowing FileHandle) -> Int32 {
    handle.descriptor()                      // Borrow for the call
}

func closeByMoving(_ handle: consuming FileHandle) {
    // Takes ownership; when this function ends, handle’s deinit runs (unless moved again).
    _ = handle.descriptor()
}

func demo() {
    let handle = FileHandle(fd: 3)
    print(readHeader(handle))                // still usable
    closeByMoving(handle)                    // moved — cannot use handle here after
}
```

**What just happened**

- `~Copyable` makes “two variables, one fd” a **compile error** instead of a double-close bug.
- `borrowing` keeps ownership with the caller; `consuming` transfers it.
- `deinit` on a noncopyable struct still runs when the unique owner ends—pair with chapter **07**’s class `deinit` literacy (same *cleanup* idea, different *identity* story).

#### When move-only types appear

| Situation | Why noncopyable helps |
|-----------|------------------------|
| File descriptors / sockets | Copying would alias a unique OS resource |
| Exclusive locks / tokens | Two owners ⇒ broken exclusivity |
| One-shot capabilities | “Use once” enforced by the type system |
| Systems APIs wrapping C resources | Matches “this pointer is mine” |

| Situation | Prefer ordinary Copyable |
|-----------|---------------------------|
| User profiles, money, DTOs, view state | Copying is correct and convenient |
| Most app models | COW collections + structs already scale |
| Anything crossing casual `async` without ownership design | Noncopyable adds friction you must design for |

**Staff rule:** still prefer ordinary **Copyable** for app models. Reach for `~Copyable` when the domain is *uniquely owned resources*, not when you want to look cutting-edge.

#### Lab — `consume`, discard, and method ownership marks

```swift
struct Ticket: ~Copyable {
    private var id: String

    init(id: String) { self.id = id }

    borrowing func label() -> String { id }

    consuming func retire() -> String {
        // Ends this Ticket's lifetime; returns a Copyable leftover if useful.
        let gone = id
        // After return, self is consumed — no second close.
        return gone
    }
}

func stash(_ t: consuming Ticket) {
    // Ownership moved in; when stash returns without moving out, deinit runs.
    _ = t.label()
}

func labConsume() {
    let a = Ticket(id: "T-1")
    print(a.label())                 // borrow via method — a still alive

    let leftover = a.retire()        // consume via method — a is gone
    print(leftover)

    let b = Ticket(id: "T-2")
    stash(b)                         // move into stash
    // b cannot be used here

    let c = Ticket(id: "T-3")
    let moved = consume c            // explicit move into a new binding
    stash(moved)
}
```

**What just happened**

- `borrowing` methods inspect without ending ownership; `consuming` methods take `self`.
- `consume x` makes the move **visible at the call site**—prefer it when a silent move would confuse reviewers.
- After a consume/move, using the old name is a compile error—that is the bug class you bought `~Copyable` to catch.

#### Lab — why “just use a class” is a different bug fix

```swift
final class ClassHandle {
    let fd: Int32
    init(fd: Int32) { self.fd = fd }
    deinit { _ = fd /* close once when last strong ref dies */ }
}

func aliasingProblem() {
    let h1 = ClassHandle(fd: 7)
    let h2 = h1                      // Shared identity — both names are valid
    // Double-close risk appears if *each* name thinks it owns cleanup
    // without a single-owner protocol (or noncopyable design).
}
```

| Approach | What the type system enforces | Best when |
|----------|-------------------------------|-----------|
| **Class + ARC** | Lifetime follows strong refs; sharing is easy | Framework identity, many observers |
| **`~Copyable` struct** | Exactly one owner; sharing is hard | Unique OS resources, one-shot tokens |
| **Copyable struct** | Independent values | DTOs, money, most app state |

**What just happened**

- Classes fix “I need shared identity.” Noncopyable fixes “copying this would be wrong.”
- Picking the wrong tool leaves the original bug class open while adding ceremony.

#### Pairing with chapter **05** / **11**

- Parameter ownership: `borrowing` / `consuming` / `consume` (chapter **05**).
- Exclusivity, ARC for classes, access control: chapter **11**.
- Do not mix “I’ll just use a class” and “I’ll just use ~Copyable” without stating which ownership bug you are fixing.

### 2. Lab — COW you can feel

`Array`, `Dictionary`, `String`, and similar standard-library types are structs, but copying is cheap until mutation: under the hood they share storage and copy when a unique buffer is needed. You reason in **value semantics**; the runtime avoids needless deep copies.

```swift
func addressOf(_ value: [Int]) -> String {
    value.withUnsafeBufferPointer { buf in
        String(describing: buf.baseAddress)
    }
}

var xs = Array(0..<1_000)
var ys = xs
print(addressOf(xs) == addressOf(ys))  // Often true — shared storage after assignment

ys.append(1_000)                       // Mutation unique-ifies ys
print(addressOf(xs) == addressOf(ys))  // False — ys got its own buffer; xs unchanged
print(xs.count, ys.count)              // 1000 vs 1001
```

**What just happened**

- Logical copy ≠ eager deep copy. Mutation of `ys` left `xs` alone—value semantics held.
- Do not rely on “I mutated through an alias” for arrays the way you would with a class.
- Your own COW types are possible but advanced; prefer stdlib collections unless you measure a need.
- COW is still **Copyable**—different from `~Copyable` move-only types.

### 3. Equatable / Hashable synthesis literacy

For structs and enums whose stored properties / associated values are themselves `Equatable` / `Hashable`, Swift can **synthesize** conformance:

```swift
struct UserID: Hashable {
    var raw: String
    // == and hash(into:) synthesized
}

enum Route: Equatable {
    case home
    case profile(UserID)
    // Equatable synthesized from cases + associated values
}

let a = UserID(raw: "ada")
let b = UserID(raw: "ada")
print(a == b)                          // true — value equality
print(Set([a, UserID(raw: "grace")]).count)
```

Write custom `==` / `hash(into:)` only when equality is not “all fields.” Never implement `==` without a matching hash story for `Hashable` types used in sets/dictionaries. Classes do **not** get automatic `Equatable` by identity—`===` is separate from `==`. Noncopyable types often need a careful story for equality—do not assume synthesis always applies the way it does for Copyable DTOs.

### 4. Nested types and organization

```swift
struct HTTP {
    enum Method: String {
        case get = "GET"
        case post = "POST"
    }

    struct Request {
        var method: Method
        var path: String
    }
}

let req = HTTP.Request(method: .get, path: "/health")
```

Nesting scopes related types without polluting the module namespace. Keep nesting shallow enough for DocC and reviews.

### 5. Enums as data models

Prefer enums over boolean pairs and optional soup when states are mutually exclusive:

```swift
// Prefer:
enum LoadState {
    case idle
    case loading
    case ready(String)
    case failed(Error)
}

// Legacy-shaped optional soup — do not use in new code.
// var isLoading: Bool
// var value: String?
// var error: Error?
```

Exhaustive `switch` then documents every state at the call site.

### 6. `mutating` and value semantics in APIs

Returning a new value (`func moved(...) -> Point`) keeps call sites pure. In-place `mutating` methods are fine for local performance and clarity — document which style your module uses. Mixing both without convention confuses reviewers. On noncopyable types, mutation and consuming methods interact with ownership—read the API’s `borrowing`/`consuming` marks before calling.

### 7. Inheritance review hazards

- Do not call overridable methods from `init` expecting subclass overrides to see a finished object (chapter **07**).
- Prefer composition (`struct` holding collaborators) over deep class trees.
- `open` vs `public` matters for cross-module subclassing (chapter **11**)—default to `final` / `public` until you need `open`.

### 8. Lab — identity (`===`) vs equality (`==`)

```swift
final class Node: Equatable {
    var value: Int
    init(_ value: Int) { self.value = value }

    static func == (lhs: Node, rhs: Node) -> Bool {
        lhs.value == rhs.value           // Value equality — your choice
    }
}

let a = Node(1)
let b = Node(1)
let c = a

print(a == b)     // true  — equal values
print(a === b)    // false — different instances
print(a === c)    // true  — same instance
```

**What just happened**

- `==` is a protocol story (`Equatable`); `===` is reference identity for classes.
- Synthesized `Equatable` on structs compares stored properties—no `===` involved.
- Never put a class in a `Set`/`Dictionary` key role with a custom `==` that disagrees with `hash(into:)`—sets will lie.

### 9. Recursive enums and `indirect`

```swift
indirect enum Expr {
    case number(Int)
    case add(Expr, Expr)
}

let tree: Expr = .add(.number(1), .add(.number(2), .number(3)))

func eval(_ e: Expr) -> Int {
    switch e {
    case .number(let n): return n
    case .add(let l, let r): return eval(l) + eval(r)
    }
}
```

**What just happened**

- `indirect` boxes the recursive case so the enum’s layout can be finite.
- Reach for this for ASTs and trees; do not invent recursive enums for flat DTOs.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | View models and DTOs as **Copyable** structs; UIKit controllers remain classes where the framework requires it; screen state as enums; avoid `~Copyable` in UI models |
| **Systems** | Prefer value types for message payloads and config snapshots; COW collections for large buffers; noncopyable wrappers for fds/sockets when the API surface supports them |
| **Security** | Secrets in structs still need careful lifetime; copying does not encrypt. Avoid logging whole model dumps; Hashable IDs should not embed secrets; unique tokens as noncopyable when “exactly one holder” matters |
| **Operations** | Status enums for CLI exit/state machines; associated values carry structured context for runbooks |
| **Software engineering** | Default to `struct` + `enum`; justify every new `class` in the PR; justify every `~Copyable` harder; synthesize Equatable/Hashable when field equality is the truth |

In concurrent code, value types composed of `Sendable` pieces cross task boundaries more easily than open classes with mutable stored properties (chapter **10**). Noncopyable + concurrency needs deliberate design—do not invent it casually in an app feature PR.

---

## 4. Staff-level review checklist

- New model types default to `struct` or `enum` unless identity/inheritance is required.
- Shared mutable class state is intentional, documented, and concurrency-safe (or isolated).
- Mutually exclusive states use enums, not parallel optionals/flags.
- `===` is not confused with `==`; `Equatable`/`Hashable` synthesis or custom impl is coherent.
- Inheritance uses `override` / `final` deliberately; `required init` is understood when present.
- Large “god classes” are split; `final` is used when subclassing is not part of the API.
- No accidental sharing: assigning a class reference was not mistaken for a defensive copy.
- Nested types stay shallow and documented.
- `~Copyable` appears only for unique resources; app DTOs stay Copyable.
- Borrow vs consume at call sites is reviewed; no use-after-consume.
- Noncopyable `deinit` / cleanup is understood vs class `deinit` (chapter **07**).
- `consume` / consuming methods are used deliberately; no use-after-move.
- `===` vs `==` is correct at call sites; Hashable/`==` pairs stay coherent.
- Recursive enums use `indirect` when needed; inheritance depth stays shallow.

---

## References

- [Structures and Classes (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/structuresandclasses/)
- [Inheritance (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [Enumerations (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/)
- [Methods (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [Protocols — Equatable / Hashable (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Copyable (Swift stdlib)](https://developer.apple.com/documentation/swift/copyable)
- [Swift Evolution — ownership / noncopyable](https://www.swift.org/swift-evolution/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
