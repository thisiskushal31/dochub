# ARC, memory safety, and access control

[← Back to Swift](./README.md)

## What this chapter covers

**Automatic Reference Counting (ARC)** for class instances, **`weak` / `unowned` / `unowned(unsafe)`**, retain **cycles**, the **law of exclusivity**, **ownership** (`~Copyable`, borrowing / consuming), **unsafe pointer** escape hatches and review rules, **`Span`** literacy (borrowed contiguous memory), **autoreleasepool** at the ObjC bridge, and **access control** — including **`package`** with SPM and the **`open` vs `public final`** decision. Default is **Swift 6.3.x** / Swift 6 language mode.

Swift is memory-safe by default for ordinary code: no manual `free`, no unchecked pointer arithmetic in the happy path. ARC still means *you* manage ownership graphs for classes. Ownership features extend that story to **non-copyable** values. Access control is how libraries keep invariants private. Think of ARC as a guestbook of sticky name tags on class instances — when the last tag peels off, the object is gone. Cycles are two people each holding the other’s tag forever. `~Copyable` is a jar labeled “only one cook may hold this” — no photocopies.

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

### 4. Lab — exclusivity overlapping access

Swift’s memory safety includes **exclusive access to memory**: you must not read and write the same storage in overlapping ways that the compiler cannot prove safe. Think of a whiteboard: two people cannot erase and read the same square at once.

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

**Lab — struct field exclusivity**

```swift
struct Box {
    var value = 0
    mutating func add(_ n: Int) { value += n }
    mutating func addFromSelf() {
        // Conceptual failure shapes: passing &value into something that also uses self
        // while value is borrowed inout.
        add(1)   // OK: single exclusive borrow of `self`
    }
}

var box = Box()
box.add(1)

struct Pair {
    var a = 0
    var b = 0
    mutating func swapAb() {
        // swap(&a, &b) can trip exclusivity depending on how swap is written —
        // use a temporary:
        let tmp = a
        a = b
        b = tmp
    }
}
```

**What just happened.** Exclusivity bugs are not “ARC forgot.” They are simultaneous conflicting uses of the same memory. The compiler increasingly rejects them statically; dynamic enforcement remains for some cases. When you see exclusivity diagnostics, redraw the borrow — copy first, then mutate. Chapter **06** covers value semantics; this chapter is the memory-law half.

### 5. Memory safety (default story) and unsafe escape hatches

Safe Swift prevents dangling pointer use and buffer overruns in ordinary array/string APIs. Escape hatches exist — they are **explicit** and **reviewable**. Unsafe code is not “faster by default”; it is a contract you must uphold.

**Review posture (not an exploit kit):** know the names so you can audit them.

| Hatch | Meaning |
|-------|---------|
| `UnsafePointer` / `UnsafeMutablePointer` | Raw typed address; you own lifetime |
| `UnsafeBufferPointer` / `UnsafeMutableBufferPointer` | Pointer + count; bounds are *your* job |
| `withUnsafeBytes` / `withUnsafeMutableBytes` | Temporary borrow of a value’s bytes |
| `assumingMemoryBound` | Promise about layout / type — easy to lie |

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

### 1. Ownership chapter — `~Copyable`, borrowing, consuming

Ordinary structs are **copyable**: assignment and pass-by-value may duplicate. Some resources must not be duplicated — file descriptors, unique buffers, single-owner tokens. Swift models that with **noncopyable** types (`~Copyable`) and explicit **ownership** conventions: **borrowing** (temporary shared use without taking ownership) and **consuming** (caller gives up the value).

Chapter **06** may introduce the idea; this is the systems-depth home.

```swift
struct FileDescriptor: ~Copyable {
    private let fd: Int32
    init(fd: Int32) { self.fd = fd }
    deinit {
        // Unique resource — runs once when the owning value ends
        if fd >= 0 { close(fd) }
    }
    borrowing func handle() -> Int32 { fd }
    consuming func take() -> Int32 {
        let out = fd
        // After consume, this value is gone — do not use fd again
        discard self
        return out
    }
}
```

**Mental model**

| Word | Picture |
|------|---------|
| **Copyable (default)** | Photocopy allowed |
| **`~Copyable`** | No photocopy — one owner |
| **`borrowing`** | Look at the jar; do not take it home |
| **`consuming` / `consume`** | Take the jar; previous name is done |
| **`inout` / mutating** | Exclusive temporary mutability of a binding |

```swift
func peek(_ f: borrowing FileDescriptor) {
    _ = f.handle()
}

func closeNow(_ f: consuming FileDescriptor) {
    _ = f.take()
}

func ownershipSketch() {
    let f = FileDescriptor(fd: -1)
    peek(f)              // borrow — f still owned here
    // closeNow(f)       // consume — after this, do not use f
}
```

**What just happened.** Noncopyable types force you to think about **who ends the lifetime**. That pairs with exclusivity: you cannot have two overlapping exclusive borrows of the same storage. Prefer ordinary copyable values until a resource truly must be unique — then `~Copyable` beats “class with a warning comment.” Exact syntax and advanced operators (`consume`, `discard`) evolve with the toolchain — read TSPL / ownership docs for your **6.3.x** pin when writing production APIs.

**Staff habits**

- Do not mark everyday model structs `~Copyable` for fashion — copyable values are the Swift default for a reason.
- Keep noncopyable surfaces small and documented.
- When bridging C resources, prefer a noncopyable wrapper with `deinit` over scattering `close` calls.

### 2. `withUnsafeBytes` / `assumingMemoryBound` — review rules

```swift
struct Header {
    var magic: UInt32
    var length: UInt32
}

func reviewRules(_ header: Header) {
    header.withUnsafeBytes { raw in
        // 1. Pointer valid ONLY for this closure
        // 2. Do not escape raw.baseAddress to storage / globals
        // 3. Do not mutate the value that vended bytes while borrowed
        _ = raw.count
    }
}

func bindSketch(_ raw: UnsafeRawBufferPointer) {
    // assumingMemoryBound is a PROMISE about layout and lifetime —
    // wrong type, wrong alignment, or dangling base = undefined behavior.
    // Prefer typed APIs / Span (below) when available.
    // raw.assumingMemoryBound(to: UInt8.self)  // review: who owns raw?
}
```

| Rule | Why |
|------|-----|
| Scope the unsafe | Pointer dies with the closure / documented lifetime |
| No escape | Stored addresses outlive borrows → use-after-free |
| No concurrent mutation of the source | Exclusivity / TOCTOU on bytes |
| Justify `assumingMemoryBound` | Layout, alignment, initialized memory — write the invariant |
| Prefer higher APIs | `Data`, arrays, `Span` before raw binds |

**What just happened.** `assumingMemoryBound` does not “convert safely”; it **asserts**. Reviewers should find a one-line invariant comment or reject the PR. Pair with chapter **15**’s interop checklist when the bytes come from C.

### 3. Span literacy — borrowed contiguous memory (direction)

**Swift 6.2+** introduces **`Span`** (and related views) as a safer way to talk about contiguous memory without teaching every caller `UnsafeBufferPointer`. Direction for this handbook’s **6.3.x** snapshot:

- A `Span` is a **borrowed**, **bounds-checked** view of contiguous elements.
- It is tied to the lifetime of the container that vended it (**non-escapable** / lifetime dependence) — you should not stash it past the owner.
- Prefer Span-shaped APIs for “read this buffer” over escaping unsafe pointers when the toolchain and libraries you depend on expose them.
- This is **literacy, not an API dump** — see stdlib / SE docs for exact members on your pin.

```swift
let values = [10, 20, 30]
// Directional literacy (API names evolve — verify on your 6.3.x pin):
// let span = values.span
// _ = span[1]   // bounds-checked borrow; do not escape past `values`

values.withUnsafeBufferPointer { buf in
    // Older scoped pattern — still correct; Span aims to replace many of these
    _ = buf[1]
}
```

**What just happened.** Span is the language’s answer to “I need contiguous access without dangling pointers.” It does not replace every C interop case (chapter **15**). Use it when you want performance *and* a compiler-checked borrow story; keep unsafe for the remaining edges.

### 4. ARC vs garbage collection literacy

ARC inserts retain/release at compile time. There is no GC pause for ordinary objects, but there is also no cycle collector — **you** break cycles. That is the trade: predictable reclaim, manual cycle hygiene.

### 5. Autoreleasepool at the ObjC bridge

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

func importBatch(_ items: [String]) {
    // When bridging many NSString/NSArray temporaries in a parser loop:
    autoreleasepool {
        for item in items {
            _ = (item as NSString).length
        }
    }
}
```

**What just happened.** Pure Swift value-heavy loops rarely need this. Tight loops that thrash Foundation/ObjC bridges might. Treat `autoreleasepool` as bridge literacy, not a Swift-everywhere habit. Linux / corelibs paths differ — do not assume Darwin pool behavior on every CI image. Measure with Instruments before sprinkling pools “just in case.”

### 6. `unowned` vs `unowned(unsafe)`

`unowned` is safer than historical unchecked variants: misuse tends to trap rather than silently corrupt. Still treat `unowned` as a proof obligation.

```swift
// Warning: unowned(unsafe) skips even that safety net — do not use in new code.
// Prefer weak, or unowned only with a written lifetime proof.
```

**Staff rule.** If you cannot state why the referent outlives the reference in one sentence, use `weak`. If you see `unowned(unsafe)` in a PR, demand removal or an extraordinary, documented reason.

### 7. Copy-on-write and “why didn’t my class deinit?”

Collections and many value types share storage until mutation. Holding a large `Data`/`Array` in multiple values is not the same as multiple class references — but wrapping reference types inside structs reintroduces sharing. Review identity vs value carefully (chapter **06**). Noncopyable types opt out of the copy story entirely — different tool, same theme: know what “assignment” costs.

### 8. `package` access deep with SPM

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

### 9. `open` vs `public final` — the decision

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

### 10. Putting the memory story together

| Concern | Tool |
|---------|------|
| Shared class graphs | ARC + `weak` / ownership redesign |
| Overlapping `inout` / mutation | Exclusivity — snapshot then mutate |
| Unique resources | `~Copyable` + borrow/consume |
| Contiguous read without unsafe | Prefer `Span` direction when available |
| Must touch bytes/C | Tiny `withUnsafe*` / documented binds |
| ObjC temp spikes | `autoreleasepool` in measured loops |
| Library surface | `public` / `package` / `open` deliberately |

### 11. Lab — `withUnsafeBytes` escape anti-pattern

```swift
func badEscape(_ values: [Int]) -> UnsafeRawPointer? {
    // Conceptual failure — do not ship:
    // return values.withUnsafeBytes { $0.baseAddress }
    // Pointer dies when the closure returns — dangling.
    return nil
}

func goodScopedSum(_ values: [Int]) -> Int {
    values.withUnsafeBufferPointer { buf in
        var total = 0
        for i in 0..<buf.count {
            total += buf[i]
        }
        return total   // return a *value*, not a pointer
    }
}
```

**What just happened.** The only safe thing to return from a `withUnsafe*` closure is data you **copied out** or a computed value. Returning or storing the pointer is the classic use-after-free. Span’s non-escapable design exists to make this class of bug a compile error when you adopt it.

### 12. Borrowing vs consuming — call-site intuition

```swift
struct Token: ~Copyable {
    var id: Int
    borrowing func peek() -> Int { id }
    consuming func burn() -> Int {
        let x = id
        discard self
        return x
    }
}

func show(_ t: borrowing Token) {
    _ = t.peek()
}

func finish(_ t: consuming Token) {
    _ = t.burn()
}

func flow() {
    let t = Token(id: 7)
    show(t)       // still own t
    finish(t)     // consumed — do not use t afterward
}
```

**What just happened.** After `consuming`, the binding is done — that is the point. APIs that both peek and take ownership should make the verb obvious in the name (`peek` vs `take` / `burn`). Exact `discard` / consume mechanics: confirm against TSPL for your **6.3.x** pin when writing library APIs.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Delegates `weak`; view models watch cycles with closures; prefer structs for state bags; MainActor models without retain loops |
| **Systems** | Long-lived caches: weak vending or explicit eviction; noncopyable wrappers for FDs / unique buffers; Span for parsers when available |
| **Security** | Secrets not in `public` fields; avoid lingering strong refs to credential objects; audit unsafe / `assumingMemoryBound` blocks |
| **Operations** | Leaks show as memory growth — Instruments / `deinit` logs for suspects; autoreleasepool only at measured ObjC peaks |
| **Software engineering** | Library surface minimal `public`; `package` for multi-target packages; document `unowned` and `~Copyable`; refuse casual `open` |

---

## 4. Staff-level review checklist

- Class graphs have a clear owner; cycles broken with `weak`/`unowned` or redesign.
- Escaping closures that capture class `self` use explicit capture lists when needed.
- `unowned` appears only with a stated lifetime proof; `unowned(unsafe)` is absent or extraordinary.
- Exclusivity diagnostics are fixed by redrawing borrows — not silenced (overlapping access lab).
- `~Copyable` / borrow / consume used for true unique resources — not cargo-culted onto ordinary models.
- Unsafe pointer / buffer / `withUnsafeBytes` blocks are localized, scoped, and reviewed.
- `assumingMemoryBound` carries a written layout/lifetime invariant.
- Span preferred over escaping unsafe buffers when the pin supports the API you need.
- Autorelease pools appear only with a bridge/peak rationale.
- Library APIs mark `public`/`open`/`package` intentionally; default stay `internal`.
- `open` subclassing surface is deliberate; prefer `public final` otherwise.
- SPM targets use `package` for cross-target helpers instead of accidental `public`.

---

## References

- [Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift standard library](https://developer.apple.com/documentation/swift) (Span / ownership-related types on your pin)
- [Swift Evolution — Span (SE-0447)](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0447-span-access-shared-contiguous-storage.md)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
