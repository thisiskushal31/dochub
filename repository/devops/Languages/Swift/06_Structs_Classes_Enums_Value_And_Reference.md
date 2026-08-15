# Structs, classes, enums — value and reference

[← Back to Swift](./README.md)

## What this chapter covers

**Structures**, **classes** (including **inheritance**, **`override`**, **`final`**, **`super`**, required-init literacy), and **enumerations** (associated values + pattern-switch labs), plus **Equatable / Hashable** synthesis literacy, a **copy-on-write (COW)** lab you can feel, **nested types**, and an expanded **class vs struct** decision table. Default is **Swift 6.3.x** / Swift 6 language mode.

Most model data in modern Swift is a struct or an enum. Classes exist for identity, inheritance, and Objective-C/UIKit-shaped lifetimes — not as the default “bag of fields.”

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
| Deterministic teardown of a resource tied to lifetime | `class` + `deinit` | Structs have no `deinit` |
| ObjC / `@objc` dynamic dispatch | `class` | Interop (chapter **15**) |
| Isolated shared mutable state | `actor` (ch **10**) | Prefer over ad-hoc locks on a class |

Choose **value** unless you need shared mutable identity, inheritance, or a framework that requires a class.

---

## 2. Advanced concepts

### 1. Lab — COW you can feel

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

### 2. Equatable / Hashable synthesis literacy

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

Write custom `==` / `hash(into:)` only when equality is not “all fields.” Never implement `==` without a matching hash story for `Hashable` types used in sets/dictionaries. Classes do **not** get automatic `Equatable` by identity—`===` is separate from `==`.

### 3. Nested types and organization

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

### 4. Enums as data models

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

### 5. `mutating` and value semantics in APIs

Returning a new value (`func moved(...) -> Point`) keeps call sites pure. In-place `mutating` methods are fine for local performance and clarity — document which style your module uses. Mixing both without convention confuses reviewers.

### 6. Inheritance review hazards

- Do not call overridable methods from `init` expecting subclass overrides to see a finished object (chapter **07**).
- Prefer composition (`struct` holding collaborators) over deep class trees.
- `open` vs `public` matters for cross-module subclassing (chapter **11**)—default to `final` / `public` until you need `open`.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | View models and DTOs as structs; UIKit controllers remain classes where the framework requires it; screen state as enums |
| **Systems** | Prefer value types for message payloads and config snapshots — no accidental sharing across threads; COW collections for large buffers |
| **Security** | Secrets in structs still need careful lifetime; copying does not encrypt. Avoid logging whole model dumps; Hashable IDs should not embed secrets |
| **Operations** | Status enums for CLI exit/state machines; associated values carry structured context for runbooks |
| **Software engineering** | Default to `struct` + `enum`; justify every new `class` in the PR; synthesize Equatable/Hashable when field equality is the truth |

In concurrent code, value types composed of `Sendable` pieces cross task boundaries more easily than open classes with mutable stored properties (chapter **10**).

---

## 4. Staff-level review checklist

- [ ] New model types default to `struct` or `enum` unless identity/inheritance is required.
- [ ] Shared mutable class state is intentional, documented, and concurrency-safe (or isolated).
- [ ] Mutually exclusive states use enums, not parallel optionals/flags.
- [ ] `===` is not confused with `==`; `Equatable`/`Hashable` synthesis or custom impl is coherent.
- [ ] Inheritance uses `override` / `final` deliberately; `required init` is understood when present.
- [ ] Large “god classes” are split; `final` is used when subclassing is not part of the API.
- [ ] No accidental sharing: assigning a class reference was not mistaken for a defensive copy.
- [ ] Nested types stay shallow and documented.

---

## References

- [Structures and Classes (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/structuresandclasses/)
- [Inheritance (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [Enumerations (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/)
- [Methods (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [Protocols — Equatable / Hashable (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
