# Protocols, extensions, generics, opaque types, macros, and builders

[← Back to Swift](./README.md)

## What this chapter covers

**Protocols**, **extensions** (including access control), **generics** (where clauses, primary associated types literacy), **opaque** (`some`) vs **existential** (`any`), light **operator overloading**, **result builders** (`@resultBuilder`), and **macros literacy** (Swift 5.9+: freestanding vs attached roles, expanding in Xcode, trust/supply-chain notes)—without a full macro-plugin tutorial. Default is **Swift 6.3.x** / Swift 6 language mode.

Swift’s abstraction style is often “protocol + extension + generic constraint,” not deep class hierarchies. Macros and result builders are *compiler-time* sugar you must still be able to expand mentally in review.

---

## 1. Concepts

### 1. Protocols as contracts

A protocol declares requirements: methods, properties, initializers, associated types. Types **conform** by implementing those requirements (or inheriting a conformance).

```swift
protocol Describable {
    var summary: String { get }
}

struct Job: Describable {
    var id: String
    var summary: String { "job \(id)" }
}
```

Protocols can inherit other protocols. Class-only protocols use `AnyObject` when reference semantics are required.

### 2. Extensions

Extensions add methods, computed properties, nested types, and protocol conformances to existing types — including types you do not own (with care).

```swift
extension Describable {
    var boxedSummary: String { "[\(summary)]" }
}

extension Array where Element: Describable {
    func joinedSummaries() -> String {
        map(\.summary).joined(separator: ", ")
    }
}
```

Constrained extensions (`where`) keep helpers on the types that can use them. Do not use extensions to smuggle stored properties (not allowed on ordinary types).

### 3. Generics

Generics parameterize functions and types over unknown types, optionally constrained.

```swift
func firstIndex<C: Collection>(
    of value: C.Element,
    in collection: C
) -> C.Index? where C.Element: Equatable {
    collection.firstIndex(of: value)
}

struct Pair<A, B> {
    var first: A
    var second: B
}
```

Prefer generic parameters when you need to **preserve** the concrete type across an API.

### 4. Opaque types: `some`

`some Protocol` means “one specific conforming type, chosen by the implementation, hidden from the caller.”

```swift
protocol Shape {
    func area() -> Double
}

struct Square: Shape {
    var side: Double
    func area() -> Double { side * side }
}

func makeUnitShape() -> some Shape {
    Square(side: 1)
}
```

Opaque result types are common in SwiftUI (`some View`) and in libraries that hide implementation types without losing “one concrete type” identity.

### 5. Existentials: `any` — and `some` vs `any` deep comparison

`any Protocol` is an **existential**: a box that can hold any conforming type, and may change which concrete type it holds over time.

```swift
func printAll(_ items: [any Describable]) {
    for item in items {
        print(item.summary)
    }
}
```

| Spelling | Meaning | Caller sees | Can the concrete type vary? | Typical cost |
|----------|---------|-------------|-----------------------------|--------------|
| `some P` | Opaque type | “Conforms to P”; identity fixed per API | No (one type per return site) | Static; often inlinable |
| `any P` | Existential box | Protocol interface only | Yes | Witness table / boxing |
| Generics `<T: P>` | Open to caller’s type | Full `T` | Caller chooses | Usually best when you can |
| `P` alone (older style) | Often meant existential | Ambiguous in review | Yes | Prefer explicit `any` |

**Staff rule:** use generics or `some` when you can preserve type identity; use `any` when you truly need a heterogeneous bag. Protocols with `Self` or associated types often cannot be plain `any P` without primary associated types or type erasers.

---

## 2. Advanced concepts

### 1. Associated types, PATs, and primary associated types

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
}

// Primary associated type literacy (e.g. Collection):
func sumInts(_ items: some Collection<Int>) -> Int {
    items.reduce(0, +)
}

func sumAny(_ items: any Collection<Int>) -> Int {
    items.reduce(0, +)
}
```

Protocols with associated types (PATs) are powerful inside generic constraints (`where C.Item == Int`) but awkward as bare existentials. Primary associated types (e.g. `any Collection<Int>`) narrow existentials; still prefer generics when you can.

### 2. Generic where clauses and conditional conformance

```swift
extension Pair: Equatable where A: Equatable, B: Equatable {
    static func == (lhs: Pair, rhs: Pair) -> Bool {
        lhs.first == rhs.first && lhs.second == rhs.second
    }
}
```

Conditional conformance is how `Array` becomes `Equatable` when its elements are. Design public protocols so useful conditional conformances remain possible.

### 3. Extensions and access control

```swift
public struct Meter: Sendable {
    public var value: Double
    public init(_ value: Double) { self.value = value }
}

extension Meter {
    // Default access matches the extended type's members unless marked
    public func doubled() -> Meter { Meter(value * 2) }
}

internal extension Meter {
    // File/module helpers — not part of the public API surface
    func debugLabel() -> String { "m=\(value)" }
}
```

Mark extension members explicitly when the extension is `public`—reviewers should see the API surface, not invent it. Do not use extensions in another module to poke `private` state (you cannot).

### 4. Operator overloading (lightly) and custom `Equatable`

```swift
struct Vector2: Equatable {
    var x: Double
    var y: Double
}

func + (lhs: Vector2, rhs: Vector2) -> Vector2 {
    Vector2(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
}

infix operator ••: MultiplicationPrecedence
func •• (lhs: Vector2, rhs: Vector2) -> Double {
    lhs.x * rhs.x + lhs.y * rhs.y
}
```

Overload operators when the algebra is obvious to readers of the domain. Prefer named methods when the symbol would surprise. Keep `==` consistent with `Hashable` when both exist (chapter **06**).

### 5. Result builders — mental model + tiny DIY

A **result builder** transforms a block of statements into a single nested value via static methods (`buildBlock`, `buildOptional`, …). SwiftUI’s `@ViewBuilder` is the famous case; you can define your own for DSLs.

```swift
@resultBuilder
enum StringLinesBuilder {
    static func buildExpression(_ expression: String) -> String { expression }

    static func buildBlock(_ parts: String...) -> String {
        parts.joined(separator: "\n")
    }

    static func buildOptional(_ component: String?) -> String {
        component ?? ""
    }

    static func buildEither(first component: String) -> String { component }
    static func buildEither(second component: String) -> String { component }
}

func manifesto(@StringLinesBuilder _ body: () -> String) -> String {
    body()
}

let text = manifesto {
    "Title"
    if true {
        "Enabled feature"
    }
    "Footer"
}
// → "Title\nEnabled feature\nFooter"
```

**What just happened**

- The closure *looks* like a list of statements; the builder folds them into one `String`.
- SwiftUI connection: `var body: some View` often uses `@ViewBuilder` so you can write `if` / `ForEach` inside a view body without manual `TupleView` wiring (chapter **19**).
- In review: expand “builder sugar” to the `build*` calls—do not treat the block as ordinary imperative code with side effects everywhere.

### 6. Macros literacy (Swift 5.9+) — freestanding vs attached

Macros generate code at compile time. You **use** them long before you **author** a macro plugin.

| Role | Spelling shape | Job (review-level) | Examples you will see |
|------|----------------|--------------------|------------------------|
| **Freestanding** | `#name(...)` or `#name` | Produce an expression/declaration at the use site | `#expect(...)` (Swift Testing), `#stringify` samples |
| **Attached** | `@Name` on a decl | Peer / member / accessor / extension / conforming generation | `@Observable`, `@Previewable`, memberwise helpers |

```swift
// Freestanding — reads like a function call but expands to generated code
// #expect(score == 10)   // Swift Testing (chapter 16) — assertion sugar

// Attached — annotates a type/property; peers/members may appear after expansion
// @Observable
// final class Model { var title = "" }
```

**What they are (and are not):**

- They are **compiler plugins** that rewrite syntax trees—not runtime reflection magic.
- Expanding in Xcode: place the cursor on the macro, use **Expand Macro** (Editor / contextual menu) to see generated code before you trust behavior.
- Writing a full macro package (SwiftSyntax, `Macro` protocols, peer macros) is out of scope here; treat authoring as an advanced toolchain topic (chapter **14** / Evolution).

**Trust / supply-chain note:** third-party macros execute at **compile time** with the privileges of your build. Pin macro package versions, prefer source you can audit, review Expanded output in PRs that adopt new macros, and treat unknown macros like unknown build plugins—not like innocent attributes.

### 7. Protocol evolution and over-abstraction

Protocol requirements can be marked optional only in `@objc` protocols. For pure Swift, provide default implementations in a protocol extension. Adding a new requirement to a public protocol is a breaking change unless you ship a default (and even then, semantics may surprise conformers).

Prefer: concrete types → generics with light constraints → protocols when you have **two or more** real conformers or a deliberate test seam. Premature `any Service` layers cost readability without buying flexibility.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Feature boundaries as protocols for test doubles; `some` for view/builder returns; `@Observable` / ViewBuilder literacy without cargo-cult |
| **Systems** | Generics for parsers/codecs that preserve element types; avoid existential soup on hot paths; pin macro dependencies in CI |
| **Security** | Audit protocol surfaces at trust boundaries; treat third-party macros as compile-time supply chain; do not hide auth behind clever operators |
| **Operations** | Plugin-shaped tools: small protocols with clear associated types; expand macros in review when diagnosing weird compile errors |
| **Software engineering** | Extension methods for shared behavior; minimal public protocol surfaces; `some` vs `any` chosen deliberately in signatures |

SPM module boundaries often expose protocols as the stable API and keep structs internal — still publish the fewest requirements you can defend.

---

## 4. Staff-level review checklist

- [ ] New protocols have at least one real second conformer (or a deliberate test seam) — not speculation.
- [ ] `some` vs `any` vs generics is intentional; new code does not omit `any` on existentials.
- [ ] PATs are used with generics / constraints; bare existential use was reviewed against associated-type limits.
- [ ] Public protocol additions include defaults or are treated as breaking.
- [ ] Extensions declare access control consciously; they are not a junk drawer.
- [ ] Result-builder blocks are reviewed as data construction, not arbitrary side-effect scripts.
- [ ] Macros in the tree are understood (role + Expanded output); third-party macros are version-pinned and trusted.
- [ ] Performance-sensitive paths prefer generics over existentials unless measured otherwise.

---

## References

- [Protocols (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [Extensions (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions/)
- [Generics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/)
- [Opaque and Boxed Types (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/opaquetypes/)
- [Macros (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
- [Result Builders (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators#Result-Builders)
- [Advanced Operators (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [Access Control (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Observation (Apple)](https://developer.apple.com/documentation/observation) (`@Observable` literacy)
- [Swift Testing — Expectations](https://developer.apple.com/documentation/testing/expectations) (`#expect` literacy)
