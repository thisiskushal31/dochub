# ARC, memory safety, and access control

[← Back to Swift](./README.md)

## What this chapter covers

**Automatic Reference Counting (ARC)** for class instances, **`weak` / `unowned` / `unowned(unsafe)`**, retain **cycles**, the **law of exclusivity**, **unsafe pointer** escape hatches (review posture), **autoreleasepool** at the ObjC bridge, and **access control** — including **`package`** with SPM and the **`open` vs `public final`** decision. Default is **Swift 6.3.x** / Swift 6 language mode.

Swift is memory-safe by default for ordinary code: no manual `free`, no unchecked pointer arithmetic in the happy path. ARC still means *you* manage ownership graphs for classes. Access control is how libraries keep invariants private. Think of ARC as a guestbook of sticky name tags on class instances — when the last tag peels off, the object is gone. Cycles are two people each holding the other’s tag forever.

---

## 1. Concepts

### 1. ARC tracks strong references

Class instances live while at least one **strong** reference remains. When the count hits zero, `deinit` runs and the object is reclaimed. Structs and enums are values — they are not ARC-managed as objects (nested class references inside them still are).

```swift
final class Node {
    var name: String
    init(_ name: String) { self.name = name }
    deinit { print("bye \(name)") }
}

var a: Node? = Node("a")
var b = a          // strong; count ≥ 2
a = nil            // still alive via b
b = nil            // deinit
```

Prefer `final` on classes you do not intend to subclass — clearer optimization and intent.

### 2. `weak` and `unowned`

| Modifier | Storage | When deallocated | Use when |
|----------|---------|------------------|----------|
| (strong) | Non-optional reference | Keeps object alive | Default ownership |
| `weak` | Optional; zeroed to `nil` | Safe to observe absence | Cycles, delegates, caches |
| `unowned` | Non-optional | **Crash** if used after free | Lifetime strictly shorter and proven |

```swift
final class Owner {
    var pet: Pet?
    deinit { print("owner gone") }
}

final class Pet {
    weak var owner: Owner?   // break cycle: Owner → Pet → Owner
    init(owner: Owner) { self.owner = owner }
}
```

Prefer `weak` unless the relationship is documented as permanently shorter-lived. Closures capturing `self` use capture lists (chapter **05**); the same cycle patterns apply.

### 3. Lab — retain cycle you can feel

```swift
final class Pump {
    var onTick: (() -> Void)?
    deinit { print("pump deinit") }

    func armStrong() {
        // Legacy-shaped strong capture — do not use in new code when self is a class.
        onTick = {
            print("tick \(self)")  // Pump → closure → Pump
        }
    }

    func armWeak() {
        onTick = { [weak self] in
            guard let self else { return }
            print("tick \(self)")
        }
    }
}

func demoCycle() {
    var p: Pump? = Pump()
    p?.armStrong()
    p = nil
    // "pump deinit" may NEVER print — cycle keeps Pump alive
}

func demoBrokenCycle() {
    var p: Pump? = Pump()
    p?.armWeak()
    p = nil
    // "pump deinit" prints — weak broke the loop
}
```

**What just happened.** Escaping closures that strongly capture class `self` are the everyday cycle. The fix is a capture list (`[weak self]`), clearer ownership (value types), or restructuring so one side does not own the other. Classic shapes also include parent↔child and strong delegate both ways.

### 4. Law of exclusivity (overlapping access)

Swift’s memory safety includes **exclusive access to memory**: you must not read and write the same storage in overlapping ways that the compiler cannot prove safe. Think of a whiteboard: two people cannot erase and read the same square at once.

**Lab — exclusive access fails conceptually**

```swift
func bump(_ x: inout Int, also y: Int) {
    x += y
}

var score = 10

// Conceptual failure — overlapping access to `score`:
// bump(&score, also: score)
// Simultaneous inout write and read of the same variable.

// Prefer a stable snapshot:
let delta = score
bump(&score, also: delta)
```

Another common shape: mutating a struct while simultaneously passing one of its properties `inout` into a method that also touches `self`.

```swift
struct Box {
    var value = 0
    mutating func add(_ n: Int) { value += n }
}

var box = Box()
// Conceptual failure when a mutating method takes inout to a field of self
// while also using self — exclusivity rejects overlapping access.
box.add(1)   // OK: single exclusive borrow of `box`
```

**What just happened.** Exclusivity bugs are not “ARC forgot.” They are simultaneous conflicting uses of the same memory. The compiler increasingly rejects them statically; dynamic enforcement remains for some cases. When you see exclusivity diagnostics, redraw the borrow — copy first, then mutate.

### 5. Memory safety (default story) and unsafe escape hatches

Safe Swift prevents dangling pointer use and buffer overruns in ordinary array/string APIs. Escape hatches exist — they are **explicit** and **reviewable**. Unsafe code is not “faster by default”; it is a contract you must uphold.

**Review posture (not an exploit kit):** know the names so you can audit them.

| Hatch | Meaning |
|-------|---------|
| `UnsafePointer` / `UnsafeMutablePointer` | Raw typed address; you own lifetime |
| `UnsafeBufferPointer` / `UnsafeMutableBufferPointer` | Pointer + count; bounds are *your* job |
| `withUnsafeBytes` / `withUnsafeMutableBytes` | Temporary borrow of a value’s bytes |

```swift
let values = [1, 2, 3]
print(values[1])   // bounds-checked

values.withUnsafeBufferPointer { buf in
    // buf.baseAddress / buf.count — valid only inside this closure
    print(buf.count)
}

// Prefer stdlib APIs over manual pointer walks unless profiling demands it.
```

**What just happened.** `withUnsafeBytes` is a *scoped* borrow: the pointer is valid for the closure. Returning that pointer or storing it past the closure is a dangling-pointer bug. Staff review: unsafe blocks should be tiny, commented with the invariant, and preferably wrapped so callers never see pointers.

### 6. Access control

| Level | Visible to |
|-------|------------|
| `open` | Other modules; subclassable/overridable outside (classes/members) |
| `public` | Other modules; not subclassable outside unless also `open` |
| `package` | Modules in the same package (SPM package identity) |
| `internal` (default) | Same module |
| `fileprivate` | Same source file |
| `private` | Same declaration scope (extensions in the same file included for `private` in modern Swift) |

```swift
public struct Config {
    public let host: String
    private let secret: String   // not part of the exported surface

    public init(host: String, secret: String) {
        self.host = host
        self.secret = secret
    }
}
```

Default `internal` keeps app targets tidy; libraries must mark `public`/`open`/`package` deliberately.

---

## 2. Advanced concepts

### 1. ARC vs garbage collection literacy

ARC inserts retain/release at compile time. There is no GC pause for ordinary objects, but there is also no cycle collector — **you** break cycles. That is the trade: predictable reclaim, manual cycle hygiene.

### 2. Autoreleasepool at the ObjC bridge

Objective-C APIs often return **autoreleased** objects. On Apple platforms, draining an autorelease pool bounds temporary peaks when you loop over bridging APIs.

```swift
import Foundation

func touchManyBridges(_ urls: [URL]) {
    for url in urls {
        autoreleasepool {
            // Legacy-heavy ObjC-bridged work in a tight loop —
            // pool drains each iteration so temporaries do not pile up.
            _ = (url as NSURL).path
        }
    }
}
```

**What just happened.** Pure Swift value-heavy loops rarely need this. Tight loops that thrash Foundation/ObjC bridges might. Treat `autoreleasepool` as bridge literacy, not a Swift-everywhere habit. Linux / corelibs paths differ — do not assume Darwin pool behavior on every CI image.

### 3. `unowned` vs `unowned(unsafe)`

`unowned` is safer than historical unchecked variants: misuse tends to trap rather than silently corrupt. Still treat `unowned` as a proof obligation.

```swift
// Warning: unowned(unsafe) skips even that safety net — do not use in new code.
// Prefer weak, or unowned only with a written lifetime proof.
```

**Staff rule.** If you cannot state why the referent outlives the reference in one sentence, use `weak`. If you see `unowned(unsafe)` in a PR, demand removal or an extraordinary, documented reason.

### 4. Copy-on-write and “why didn’t my class deinit?”

Collections and many value types share storage until mutation. Holding a large `Data`/`Array` in multiple values is not the same as multiple class references — but wrapping reference types inside structs reintroduces sharing. Review identity vs value carefully (chapter **06**).

### 5. `package` access deep with SPM

Each SPM **target** is typically its own **module**. `internal` stops at the target boundary. Use `package` when several targets in one package share API that must not ship as public product API.

```swift
// Package.swift literacy (chapter 14): targets Helper + Feature, product only Feature.

// In Helper:
package func normalize(_ path: String) -> String { path }

// In Feature (same package): can call normalize(_:) —
// package symbols are visible across modules that share the package identity.

// App that imports the Feature *product* cannot call normalize(_:) —
// package is not public API.
```

**What just happened.** `package` is the missing rung between `internal` (one module) and `public` (the world). Multi-target packages that overuse `public` for cross-target helpers permanently expand their semver surface. Prefer `package` for “family only.”

### 6. `open` vs `public final` — the decision

| Choice | Promise |
|--------|---------|
| `public final class` | Clients may *use*, not subclass |
| `public class` (not open) | Clients may use; subclassing outside the module is blocked |
| `open class` | Clients may subclass and override `open` members |

```swift
// Prefer for most library types:
public final class SessionClient {
    public init() {}
}

// Only when subclassing is an intentional, tested extension point:
open class PluginBase {
    open func start() {}
}
```

**What just happened.** `open` is a **compatibility promise**. Undocumented `open` hierarchies become forever APIs. Default to `public` + `final` unless extension by subclassing is a designed contract with tests.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Delegates `weak`; view models watch cycles with closures; prefer structs for state bags |
| **Systems** | Long-lived caches: weak vending or explicit eviction; no unbounded strong graphs |
| **Security** | Secrets not in `public` fields; avoid lingering strong refs to credential objects; audit unsafe blocks |
| **Operations** | Leaks show as memory growth — Instruments / `deinit` logs for suspects; autoreleasepool only at measured ObjC peaks |
| **Software engineering** | Library surface minimal `public`; `package` for multi-target packages; document `unowned`; refuse casual `open` |

---

## 4. Staff-level review checklist

- [ ] Class graphs have a clear owner; cycles broken with `weak`/`unowned` or redesign.
- [ ] Escaping closures that capture class `self` use explicit capture lists when needed.
- [ ] `unowned` appears only with a stated lifetime proof; `unowned(unsafe)` is absent or extraordinary.
- [ ] Exclusivity diagnostics are fixed by redrawing borrows — not silenced.
- [ ] Unsafe pointer / buffer / `withUnsafeBytes` blocks are localized, scoped, and reviewed.
- [ ] Autorelease pools appear only with a bridge/peak rationale.
- [ ] Library APIs mark `public`/`open`/`package` intentionally; default stay `internal`.
- [ ] `open` subclassing surface is deliberate; prefer `public final` otherwise.
- [ ] SPM targets use `package` for cross-target helpers instead of accidental `public`.

---

## References

- [Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
