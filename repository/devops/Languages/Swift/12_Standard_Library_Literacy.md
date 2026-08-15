# Standard library literacy

[← Back to Swift](./README.md)

## What this chapter covers

Enough of the **Swift standard library** to read and write real code: **Sequence / Collection / RandomAccessCollection**, algorithms (`map` / `filter` / `reduce` / `compactMap` / `flatMap`), **lazy** sequences, **Codable** with **CodingKeys**, **Regex / RegexBuilder** literacy (5.7+), **Comparable / Hasher** pitfalls, **slicing vs copy**, and **FilePath** era notes. Default is **Swift 6.3.x** / Swift 6 language mode.

You do not need every method on `Array`. You need a picture: collections are protocols layered by capability; algorithms are vocabulary; Foundation still owns much of “talk to the OS.” Think of `Sequence` as a conveyor you can walk once, `Collection` as a shelf you can revisit by index, and `RandomAccessCollection` as a shelf with constant-time jumps.

---

## 1. Concepts

### 1. Numbers, strings, and optionals as stdlib citizens

`Int`, `Double`, `Bool`, `String`, `Character`, and `Optional` are stdlib types with rich APIs. Strings are Unicode-correct; indices are not integers.

```swift
let n = Int("42")           // Optional
let s = "café"
print(s.count)              // characters, not UTF-8 bytes
print(s.utf8.count)         // byte length when you need it

if let value = n {
    print(value * 2)
}
```

Prefer `String` APIs (`hasPrefix`, `split`, `replacing`) over manual index arithmetic until you must optimize.

### 2. Collections: `Array`, `Dictionary`, `Set`

| Type | Order | Keys / uniqueness | Typical use |
|------|-------|-------------------|-------------|
| `Array` | Ordered | Indices | Sequences, stacks (as arrays) |
| `Dictionary` | Unordered (iteration order not a contract for identity) | Unique keys | Lookups, maps |
| `Set` | Unordered | Unique `Hashable` elements | Membership, dedup |

```swift
var xs = [3, 1, 2]
xs.append(4)
xs.sort()

var ages = ["Ada": 36]
ages["Grace"] = 109

let tags: Set = ["ci", "swift", "ci"]
print(tags.contains("swift"))
```

Value semantics + copy-on-write: assigning a collection shares storage until mutation. Mutating through one variable does not surprise another after copy — unless you stuffed reference types inside.

### 3. Mental model — Sequence → Collection → RandomAccessCollection

| Protocol | Capability | Picture |
|----------|------------|---------|
| `Sequence` | Single-pass iteration | Conveyor belt |
| `Collection` | Multi-pass + indices | Labeled shelf |
| `BidirectionalCollection` | Walk backward | Shelf with a rear aisle |
| `RandomAccessCollection` | O(1) distance / jumps | Shelf with numbered bins (`Array`) |

```swift
func firstTwo<S: Sequence>(_ s: S) -> [S.Element] {
    var it = s.makeIterator()
    return [it.next(), it.next()].compactMap { $0 }
}

func middle<C: Collection>(_ c: C) -> C.Element? {
    guard !c.isEmpty else { return nil }
    let i = c.index(c.startIndex, offsetBy: c.count / 2)
    return c[i]
}
```

**What just happened.** Generic helpers should ask for the *weakest* protocol they need. Requiring `RandomAccessCollection` when you only `for-in` once overconstrains callers. Requiring only `Sequence` when you call `count` repeatedly may accidentally force single-pass types into expensive paths.

### 4. Lab — map / filter / reduce / compactMap / flatMap

```swift
let nums = [1, 2, 3, 4, 5]

let squares = nums.map { $0 * $0 }                    // [1, 4, 9, 16, 25]
let evens = nums.filter { $0.isMultiple(of: 2) }      // [2, 4]
let sum = nums.reduce(0, +)                           // 15

let raw = ["10", "x", "20"]
let parsed = raw.compactMap { Int($0) }               // [10, 20] — drops nil

let nested = [[1, 2], [3], [4, 5]]
let flat = nested.flatMap { $0 }                      // [1, 2, 3, 4, 5]

struct Row { var id: Int; var name: String? }
let rows = [Row(id: 1, name: "a"), Row(id: 2, name: nil)]
let names = rows.compactMap(\.name)                   // ["a"]
```

**What just happened.**

- `map` — one in, one out (same count).
- `filter` — keep or drop.
- `reduce` — crush to one value.
- `compactMap` — map + drop `nil` (optional transform).
- `flatMap` on sequences — map to sequences, concatenate (flatten).

Know whether your chain is single-pass: reading a **lazy** pipeline twice may recompute.

### 5. Lab — lazy sequences

```swift
let nums = Array(1...1_000)
let pipeline = nums.lazy
    .map { $0 * $0 }
    .filter { $0.isMultiple(of: 2) }
    .prefix(3)

print(Array(pipeline))   // forces work for three results — not a million intermediates
```

**What just happened.** Without `lazy`, `map` then `filter` builds full intermediate arrays. With `lazy`, work pulls on demand. Force with `Array(...)` when you need a stable multi-pass collection. Do not `lazy` by default — profile, then simplify.

### 6. Comparable, Equatable, Hashable

Sorting and sets/dictionaries depend on these protocols. Synthesized conformances cover many structs/enums; custom `Hashable` must agree with `Equatable`.

```swift
struct Point: Hashable {
    var x: Int
    var y: Int
}

let unique: Set = [Point(x: 1, y: 2), Point(x: 1, y: 2)]
print(unique.count)   // 1
```

### 7. Result and Never (literacy)

`Result` carries success/failure as a value (chapter **09**). `Never` is the bottom type for functions that do not return (`fatalError`, infinite park). Seeing `Never` in signatures signals “no success path.”

---

## 2. Advanced concepts

### 1. Slicing vs copy

Slicing (`xs[1..<3]`) yields a `Slice` (or `Substring` for strings) that still indexes into the base. Indices are not portable across mutations. Copy to `Array(...)` / `String(...)` when you need a stable independent buffer.

```swift
let base = [10, 20, 30, 40]
let mid = base[1...2]
print(Array(mid))     // [20, 30] — independent Array copy of the slice contents

var text = "hello"
let sub = text[text.startIndex..<text.index(text.startIndex, offsetBy: 2)]
let owned = String(sub)   // break sharing with the original string storage when needed
```

**What just happened.** Slices are views. Holding a huge `Substring` can keep the whole original `String` alive. Copy when you store long-lived pieces.

### 2. Lab — Codable encode/decode with CodingKeys

`Codable` is the stdlib contract; JSON encoding often uses Foundation (chapter **13**). CodingKeys rename fields without polluting your model names.

```swift
import Foundation

struct User: Codable {
    var id: Int
    var displayName: String

    enum CodingKeys: String, CodingKey {
        case id
        case displayName = "display_name"
    }
}

let json = Data(#"{"id":1,"display_name":"Ada"}"#.utf8)
let user = try JSONDecoder().decode(User.self, from: json)
let again = try JSONEncoder().encode(user)
```

**What just happened.** Without `CodingKeys`, `displayName` would expect `"displayName"` in JSON. Keys are the seam between Swift naming and wire naming. Prefer explicit keys (or a documented key strategy on the decoder) over surprise defaults.

### 3. Regex / RegexBuilder literacy (Swift 5.7+)

```swift
let emailish = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
if let match = "team@example.com".wholeMatch(of: emailish) {
    print(match.output)
}

import RegexBuilder

let atLeastThreeDigits = Regex {
    OneOrMore(.digit)
}
Capture { atLeastThreeDigits }
```

**What just happened.** Regex literals and RegexBuilder are stdlib-era tools for structured text. Prefer them over ad-hoc `NSRegularExpression` for new Swift-only code — but stay in Foundation when you must share patterns with ObjC or older deployment floors. Keep regexes reviewed: readability beats cleverness.

### 4. Comparable and Hasher pitfalls

```swift
struct Ranked: Comparable, Hashable {
    var name: String
    var score: Int

    static func < (lhs: Ranked, rhs: Ranked) -> Bool {
        lhs.score < rhs.score
    }
    // Equatable/Hashable synthesize from all stored props by default —
    // or write them so they agree with your ordering story.
}

// Pitfall: mutating a property that participates in Hashable while the
// value sits in a Set/Dictionary key invalidates the bucket.
var set: Set = [Point(x: 1, y: 2)]
// Do not: pull-mutate-reinsert incorrectly; treat keys as immutable while stored.
```

**Comparable** must define a consistent total order for sorting. **Hasher** must match `==`: if `a == b`, then `hash(a) == hash(b)`. Combining only some fields in `hash(into:)` while comparing all fields (or the reverse) produces ghost bugs in dictionaries.

### 5. FilePath literacy (era / platform note)

`FilePath` is the modern path *currency type* from **Swift System** (`import System` on Apple / `SystemPackage` via SPM). Moving `FilePath` into the **standard library** is Evolution work aimed at newer toolchains (**6.4+** direction) — **not** something to assume on every **Swift 6.3.x** pin.

```swift
#if canImport(System)
import System
let path: FilePath = "/tmp/log"
print(path)
#endif

// Until FilePath is universally stdlib on your pinned toolchain,
// Foundation URL / FileManager remain the safe default for apps.
```

**When to stay in Foundation.** App file IO, security-scoped resources, ubiquitous `URL` APIs, and anything that already speaks `URL` / `Data(contentsOf:)`. Reach for `FilePath` in systems / server packages that already depend on Swift System — and pin the module (`System` vs `SystemPackage`) your platform actually provides. Chapter **13** covers Foundation file APIs; chapter **24** tracks stdlib migration doors.

### 6. What not to memorize

Every `String.Index` dance and obscure protocol witness belongs in docs when needed. Staff literacy is *choosing the right collection and algorithm*, then reading the doc comment for the edge case.

```swift
// Legacy (manual C-index habits) — do not use in new code.
// for var i = 0; i < xs.count; i++ { use xs[i] }
//
// Prefer:
for value in xs { print(value) }
for (i, value) in xs.enumerated() { print(i, value) }
```

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Model lists as `[Model]`; lookups as `Dictionary`/`Set`; Codable at boundaries |
| **Systems** | Weakest collection constraint; `lazy` when profiling shows intermediate pressure; FilePath via System when appropriate |
| **Security** | Constant-time comparison for secrets is *not* `==` on strings — use platform crypto helpers |
| **Operations** | Logging: summarize collections (`count`, prefixes), do not dump PII-heavy arrays |
| **Software engineering** | Generic helpers constrained to `Sequence`/`Collection`; golden JSON tests for CodingKeys |

---

## 4. Staff-level review checklist

- [ ] Collection choice matches access pattern (array vs dictionary vs set).
- [ ] Generic APIs require the weakest protocol that still works.
- [ ] Chains that only need one pass consider `lazy` or a single loop when profiling shows pressure.
- [ ] Slices / substrings are not treated as independent storage without copying when lifetime or mutation follows.
- [ ] `Hashable`/`Equatable`/`Comparable` agree; no mutable fields that change hash while in a `Set`.
- [ ] Codable wire names use `CodingKeys` or an explicit decoder strategy.
- [ ] Regex use is readable and reviewed; Foundation regex only when bridging demands it.
- [ ] FilePath assumptions match the toolchain pin (System package vs future stdlib); apps often stay on `URL`.
- [ ] String work respects Unicode; byte counts use `utf8` when talking wire size.
- [ ] No C-style index loops or `++` resurrected from old snippets.

---

## References

- [Swift standard library](https://developer.apple.com/documentation/swift)
- [Collection Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/)
- [Strings and Characters](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/)
- [Encoding, Decoding, and Serialization](https://developer.apple.com/documentation/foundation/encoding_decoding_and_serialization) (Codable + Foundation encoders)
- [Swift System](https://developer.apple.com/documentation/system)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
