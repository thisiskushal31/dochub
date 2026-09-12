# What is Swift?

[← Back to Swift](./README.md)

## What this chapter covers

What **Swift** is as a language—its goals, its open-source home, the platforms it runs on—and how that differs from **Apple SDKs**, **Xcode**, and “the iOS stack.” You will leave with a clean separation: language vs toolchain vs frameworks vs product surface. Handbook default narrative: **Swift 6.3.x**.

This is orientation with a story, not a brochure and not a WWDC highlight reel. If someone asks “do we write Swift?”, your answer should name *which layer* they mean. You will also leave with the **runtime story**—why Swift *feels* different from Objective-C, Java, or Go—and what **staff interviews** actually probe when they say “Swift experience.”

---

## 1. Concepts

### 1. A one-sentence job description

**Swift** is a general-purpose language designed to be **safe by default**, **expressive**, and **fast enough for systems and apps**—with a modern type system, optionals instead of ambient null, and a toolchain that spans Apple platforms, Linux, and Windows.

It is not “a synonym for UIKit,” not “whatever Xcode opened,” and not “only for phones.”

### 2. The story in one breath

Apple needed a successor language that could talk to decades of Cocoa without forcing every team to rewrite the world on day one. Swift shipped in **2014** with optionals, type inference, and playgrounds—then spent a decade arguing (in public) about how much checking is enough. **Swift 3** broke sources to settle naming. **Swift 5** stabilized the Apple ABI story. **Swift 5.5** made `async`/`await` real. **Swift 6** language mode makes data races a compiler problem when you opt in.

That arc is why staff care about **pins**: the word “Swift” in a resume can mean “I write UIKit” or “I ship Linux packages under complete concurrency checking.” This track teaches the second kind of literacy *and* enough Apple ship surface to review the first.

### 3. Why Swift feels different — runtime, ARC, and value types

If you come from Java, Go, or classic Objective-C, the first week of Swift feels oddly *opinionated*. That is not fashion. It is the runtime contract:

```text
Your values and references
        │
        ├── Structs / enums / tuples  →  value semantics (independent copies; often COW under the hood)
        ├── Classes / actors          →  shared identity; ARC retains/releases
        └── Optionals / throws        →  absence and failure are in the type story
```

| Idea | What you feel day one | Deeper home |
|------|------------------------|-------------|
| **`let` by default** | Immutability is the habit, not an annotation tax | This chapter + **04** |
| **Optionals** | `nil` is not ambient; the compiler nags until you unwrap | **04** |
| **Value types first** | Models are usually `struct` / `enum`; sharing is deliberate | **06** |
| **ARC for classes** | No `malloc`/`free` ritual; cycles still possible with closures | **11** |
| **No GC pause story** | Reference counting, not a tracing collector (different tradeoffs than JVM/Go) | **11** |
| **Concurrency checking** | Swift 6 mode treats data races as compile errors | **02**, **10** |

```swift
// Swift 6.x — the “feels different” starter kit in one file
struct Money {
    var cents: Int                         // Value type: assignment copies the value
}

final class Wallet {
    var balance: Money                     // Class: many names can share one Wallet
    init(balance: Money) { self.balance = balance }
}

var a = Money(cents: 100)
var b = a
b.cents = 200
// a.cents is still 100 — values do not silently alias

let w1 = Wallet(balance: Money(cents: 50))
let w2 = w1                                // Same object identity
w2.balance.cents = 75
// w1.balance.cents is 75 — references share

let maybe: String? = nil
if let name = maybe {
    print(name)
} else {
    print("absence is explicit")           // Not a NullPointerException surprise
}
```

**What just happened**

- **Value types** make “defensive copy” the default mental model for data.
- **Classes** exist when you *want* shared identity (UIKit objects, long-lived services)—not as the default bag of fields.
- **ARC** frees class instances when the last strong reference drops; you still design ownership (especially with escaping closures—chapters **05**, **11**).
- Compared to a tracing GC language, you reason more about **retain cycles** and less about pause times; compared to manual retain/release Objective-C, the compiler inserts the bookkeeping.

Hold this until it is boring: *Swift’s safety brand is “make illegal states hard to type,” not “hide all costs.”*

### 4. Compiler + runtime picture

Hold this sketch until it is boring:

```text
Your .swift sources
        │
        ▼
   swift / swiftc          ← frontend: parse, type-check, SIL optimization story
        │
        ▼
   object code + Swift runtime / stdlib
        │
        ├── Apple app: link against SDK frameworks (UIKit, SwiftUI, …) + sign
        ├── Package executable: link stdlib (+ Foundation/corelibs as needed)
        └── Tests: same compiler, different product (test bundle / `swift test`)
```

| Piece | Job |
|-------|-----|
| **Compiler (`swiftc`)** | Turns source into binaries under a **language mode** |
| **Driver (`swift`)** | UX around compile/run/REPL/package commands |
| **Standard library** | `Optional`, `Array`, `String`, concurrency primitives, … |
| **Runtime** | Dynamic cast, refcounting support, concurrency runtime pieces, … |
| **Platform SDKs** | Apple (or other) frameworks—not “Swift itself” |

You can write substantial Swift that never imports UIKit. You can also write an iOS app where 90% of review comments are about SwiftUI state—not about the language grammar. This track owns **language + engineering around it**; UI frameworks appear later as **surface literacy**.

```swift
// Swift 6.x — safe defaults show up immediately
let name = "Ada"           // Immutable binding; type inferred as String
var count = 0              // Mutable binding; still typed
let maybe: String? = nil   // Optional: absence is explicit, not a crash waiting in silence

if let name = maybe {
    print(name)            // Only enters when a real String exists
} else {
    print("no name yet")   // nil is a value in the type system, not a surprise segfault
}
```

**What just happened**

- Immutability is the default habit (`let`), not an afterthought.
- `nil` lives inside `Optional`, not as an untyped landmine.
- The compiler is a collaborator: it refuses whole classes of “forgot to check” bugs.

### 5. Language goals you can feel in day-one code

| Goal | What it looks like in practice |
|------|--------------------------------|
| **Safe by default** | Optionals, definite initialization, bounds-checked arrays, ARC instead of manual retain/release rituals |
| **Clear intent** | `let` vs `var`, named parameters, progressive disclosure (simple code stays simple) |
| **Interoperability** | First-class story with Objective-C/Cocoa historically; C and growing C++ interop for systems edges |
| **Approachable power** | Generics, protocols, macros, modern concurrency—without forcing every file to be expert mode |
| **Performance enough** | Value types + ARC + optimization pipeline aimed at app and systems work—not a scripting toy |

### 6. Fair neighbor table — Objective-C, Java, Go

Orientation only—not a language war. Fair means naming tradeoffs both ways:

| Dimension | **Swift** | **Objective-C** | **Java** | **Go** |
|-----------|-----------|-----------------|----------|--------|
| **Null / absence** | `Optional` in the type system | Historically ambient `nil` messaging; nullability annotations later | `null` references; Optional types exist but culture varies | Nil interfaces / pointers with different rules |
| **Memory** | ARC for classes; value types elsewhere | ARC (modern) or manual retain/release history | Tracing GC | Tracing GC + escape analysis |
| **Default data modeling** | Struct/enum first | Classes + categories historically | Classes first; records later | Structs + interfaces; no classes |
| **Concurrency story** | `async`/`await`, actors; Swift 6 checking | Queues / GCD / callbacks historically | Threads, executors, structured libs | Goroutines + channels |
| **Generics** | First-class, evolving (PATs, `some`/`any`) | Very limited historically | Long-standing, erasure-based | Generics since 1.18 |
| **Binary / ABI** | Apple ABI stability since Swift 5 era | Stable ObjC runtime long ago | JVM bytecode portability | Static binaries common |
| **Interop gravity** | Designed to call Cocoa; C/C++ growing | The Cocoa host | Huge JVM ecosystem | C FFI, cloud-native niche |
| **Where teams feel pain** | Language-mode migrations; signing/ship lane | Dynamic runtime surprises; selector soup | GC tuning; null; classpath | Error-value verbosity; generics late |

Staff takeaway: pick neighbors by **boundary**, not by Twitter. Interop is a reviewed seam. “We should rewrite in Go” is rarely a language argument—it is a deployment and hiring argument wearing a syntax costume.

### 7. Open source and governance glance

Swift is developed in the open. **swift.org** is the project’s public hub: downloads, documentation, forums, evolution, server workgroup, and getting-started guides. Language changes go through **Swift Evolution** proposals (SE-NNNN). Apple remains a major steward and the primary ship path for Apple OS SDKs—but the language is not a private dialect that only ships inside Xcode.

Practical meaning for engineers:

- You can install toolchains without opening the App Store.
- You can read *why* a feature exists (proposal + review) instead of treating syntax as magic.
- Linux and Windows are first-class enough for packages, servers, and CI—not second-class cosplay.
- Workgroups (e.g. server) steer ecosystem directions without replacing your pin discipline.

Chapter **02** / **24** teach how to read Evolution without drowning. Here you only need: *governance is public; pins are still your job.*

### 8. Platforms: Apple-first history, multi-platform present

| Platform family | Role |
|-----------------|------|
| **Apple OSes** | Where most commercial Swift apps ship; SDKs, signing, store rules |
| **Linux** | Packages, server services, Docker CI, many open-source libraries |
| **Windows** | Tooling, packages, learning, growing production niches |
| **Adjacent** | Server initiatives, Wasm, Embedded Swift, Android SDK literacy (compass—chapter **24**) |

“Swift runs here” ≠ “UIKit runs here.” Always name **language runtime/toolchain** separately from **framework availability**.

### 9. Swift the language vs Apple SDKs

Hold this table until it is boring:

| Layer | Examples | Who defines it |
|-------|----------|----------------|
| **Language + stdlib** | `String`, `Array`, optionals, concurrency primitives | Swift project |
| **Core libraries** | Foundation (with platform differences), Dispatch, etc. | Platform + Swift ecosystem |
| **Apple SDKs** | SwiftUI, UIKit, AppKit, WidgetKit, … | Apple per OS |
| **Your product** | App, package, CLI, service | You |

### 10. What this track owns vs hands off

| Owns (bullseye) | Hands off (doors / siblings) |
|-----------------|------------------------------|
| Language + toolchain + SPM + testing + DocC/API style | Pixel-perfect UI/UX design systems |
| Concurrency / ARC / stdlib / Foundation literacy | Full server-framework encyclopedias (Vapor deep dives) |
| Xcode schemes, signing/privacy **review** literacy, Mac CI shapes | App Store marketing / ASO |
| Use-case shape selection (script/package/app) | Shell/CI YAML depth (see [Shell](../Shell/README.md)) |
| Compass to Wasm / Embedded / Android SDK / server | Pretending those are covered because “we finished Swift” |

Chapter **24** is the compass. Scope honesty is how this track stays usable.

### 11. Relationship to Objective-C (orientation only)

Swift arrived to make Apple-platform development safer and more modern while **interoperating** with decades of Objective-C and Cocoa APIs. Early Swift sold “you can call UIKit today.” That interop remains a brownfield superpower and a complexity tax (nullability annotations, selector-era APIs, bridging costs). Chapter **15** owns interop depth; here you only need: *Swift was designed to live next to ObjC, not to pretend the past never existed.*

---

## 2. Advanced concepts

### 1. One language, many products

The same `.swift` files might compile into:

- an iOS app binary,
- a Mac CLI via SPM,
- a Linux daemon,
- a test bundle,
- a library consumed by all of the above.

Pins matter: toolchain version, language mode, platform SDK, and dependency graph. Treating “Swift” as one blob in an architecture diagram hides those seams.

### 2. Source compatibility vs ABI stability vs SDK

Three phrases people mash together:

| Phrase | Plain meaning |
|--------|---------------|
| **Source compatibility** | Does my code still compile after a language bump? |
| **ABI stability** (Apple platforms, Swift 5 era landmark) | Can binaries talk across compiler versions more sanely? |
| **SDK / OS version** | Which Apple APIs exist at runtime? |

A language-mode migration can break **source** while the OS ABI story stays fine. An OS bump can require new SDK usage while language mode stays put. Chapter **02** expands version literacy.

### 3. What Swift is optimized for—and what it refuses

Swift wants:

- explicit failure (`Optional`, `throws`, typed errors literacy),
- value types for modeling data,
- progressive concurrency checking (destination: Swift 6 complete checking),
- APIs that read clearly at the call site (chapter **17**).

Swift does **not** want to be:

- a dynamic “everything is AnyObject and nil” scripting mush,
- a substitute for understanding memory and isolation when you cross concurrency domains,
- a guarantee that Apple review, signing, or privacy manifests will be easy (those are ship-lane concerns).

### 4. Where organizations actually use it

Beyond consumer apps: internal Mac tools, security agents, build utilities, shared business-logic packages, server-side Swift services, and automation that prefers typed code over sprawling shell. The language track exists so staff can review *all* of those without confusing them with App Store marketing.

### 5. What staff interviews for (literacy, not trivia)

When a senior interview says “tell me about Swift,” they are rarely hunting for trivia about obscure stdlib methods. They are probing whether you can *operate* the language in a team:

| Probe | Strong signal | Weak signal |
|-------|---------------|-------------|
| **Value vs reference** | Chooses struct/enum by default; justifies class/actor | “Everything is a class like UIKit samples” |
| **Optionals / errors** | `guard` / `throws` / boundary validation | Culture of `!` and `try!` |
| **Concurrency** | Can sketch `async`/`await` + isolation; knows mode 5 vs 6 | “We use Dispatch everywhere and hope” |
| **Toolchain pins** | Names Xcode vs swift.org vs Docker; language mode dial | “Whatever Xcode downloaded” |
| **Package vs app** | SPM for shared logic; app target for SDK/signing | One giant target with no modules |
| **Interop** | Treats ObjC/C as a seam with nullability cost | Pretends bridging is free |
| **Ship literacy** | Knows signing/privacy/CI are part of “done” on Apple | “I only write features” |
| **Migration judgment** | Per-module Swift 6 plan; reads Evolution by status | Rewrites from a forum pitch |

```text
Interview lab (practice aloud, 90 seconds each):
1. Why does assigning a struct feel different from assigning a class?
2. What does Swift 6 language mode change that swift --version alone does not?
3. When would you put domain logic in a package instead of the app target?
4. What breaks if CI’s swift and your laptop’s swift disagree?
```

**What just happened**

- Staff hiring is a **systems literacy** test wearing a language costume.
- Memorizing protocol witness vocabulary without PATH/CI/optional discipline does not pass.
- This handbook’s chapter order mirrors what good interviews reward: toolchain → types → concurrency → ship.

### 6. Lab — name the layers on a real ticket

Pick one ticket from your backlog and fill this card:

```text
Ticket: ____________________
Language surface:     [ ] pure Swift  [ ] + Foundation  [ ] + UI framework
Artifact:             [ ] script  [ ] package  [ ] app target  [ ] test-only
Toolchain channel:    [ ] Xcode  [ ] Swiftly/swift.org  [ ] Docker  [ ] Windows
Memory story in play: [ ] value types  [ ] class + ARC  [ ] actor isolation  [ ] mixed
CI runner:            [ ] Linux  [ ] macOS  [ ] both
Hands-off if needed:  ________________ (design / server framework / Shell YAML / …)
```

If two engineers fill different cards for the same ticket, your nouns are not shared yet—fix the vocabulary before arguing about architecture.

### 7. Lab — language mode vs `swift --version` (the classic trap)

These two questions are not the same:

| Question | What answers it | Common wrong answer |
|----------|-----------------|---------------------|
| Which **compiler** built this? | `swift --version` / Xcode bundle | “We’re on Swift 6 because the Mac is new” |
| Which **language mode** did this target use? | Target / package Swift language mode settings | “Whatever the compiler default is” |

```text
Walkthrough card (fill with a real module):
Module / target: ____________________
swift --version on the builder: ____________________
Language mode dial (5 / 5.x / 6): ____________________
Complete concurrency checking on?  [ ] yes  [ ] no  [ ] unknown
Evidence location (build setting / Package.swift / CI log line): ____________________
```

**What just happened**

- A **Swift 6.3.x** toolchain can still compile a target in **Swift 5** language mode.
- Race-condition diagnostics you expect from “Swift 6” only appear when the **mode** (and related checking) is on.
- Staff reviews that only check `swift --version` miss half the pin story—chapter **02** owns the dial; this chapter owns the *vocabulary split*.

### 8. Lab — read one Evolution proposal without drowning

Pick any **Accepted** or **Implemented** proposal from [Swift Evolution](https://www.swift.org/swift-evolution/) that touched something your team already ships (`async`/`await`, `any`/`some`, macros, ownership). Spend fifteen minutes and fill:

```text
SE-____ : ________________________________
Status:  [ ] Accepted  [ ] Implemented  [ ] Returned  [ ] Rejected
One-sentence problem it solved: ________________________________
What changed for call sites: ________________________________
What did *not* change (myth to kill): ________________________________
Pin impact for us (toolchain floor / language mode / SDK): ________________________________
```

**What just happened**

- Evolution is how you replace folklore (“Swift just decided…”) with a dated decision.
- You do not need to memorize proposal numbers—you need the habit of opening one when someone proposes a rewrite from a blog title.
- Rejected / returned proposals are also literacy: they explain why a tempting design did not ship.

### 9. What Swift is *not* (ticket-shaped traps)

| Someone says… | What they often mean | What you should ask |
|---------------|----------------------|---------------------|
| “Rewrite it in Swift” | Safer types / hiring / Apple ship path | Which **artifact**? Package? App? Script? |
| “Swift is slow” | Debug build / bridging / allocation pattern | Measured what? Release? Instruments? |
| “Swift can’t do servers” | Their last look was 2016 | Which Linux CI image and Foundation assumptions? |
| “We’re a Swift shop” | iOS app team | Do packages run on Linux? Who pins the toolchain? |
| “Just use actors everywhere” | Fear of races | Is the shared state even necessary? (chapter **10**) |

Hold this: *Swift is a language with a toolchain story.* Product claims need an OS, an SDK, a CI image, and a language mode—or they are marketing.

### 10. Memory model in one coffee (compare aloud)

Practice saying this out loud until it is boring:

```text
1. Most of my data is structs/enums → independent values (often COW under the hood).
2. Shared identity is a class or actor → ARC tracks strong references.
3. Absence is Optional; failure is throws (or Result at boundaries).
4. There is no tracing GC pause story like the JVM—tradeoffs move to cycles and exclusivity.
5. Swift 6 mode adds: data races become compile-time problems when you opt the module in.
```

**What just happened**

- Neighbor languages in §1.6 differ on *where* costs show up—not on whether costs exist.
- Staff who can give this coffee pitch review PRs faster than staff who only recite syntax trivia.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Product features in SwiftUI/UIKit *and* shared domain packages in pure Swift; prefer value-typed models at the UI boundary when you can |
| **Systems** | CLIs and daemons on macOS/Linux with SPM; careful Foundation assumptions across Darwin vs corelibs; ARC cycles reviewed in long-lived services |
| **Security** | Prefer Swift’s explicit optionals/errors at trust boundaries; do not smuggle nil through ObjC-imported APIs unreviewed |
| **Operations** | Standardize on swift.org / Xcode / container images as *named* channels; document which one CI uses |
| **Software engineering** | Separate “language style guide” from “UI framework guide”; hire against the interview probes above, not against trivia quizzes |

---

## 4. Staff-level review checklist

- Docs and diagrams distinguish **Swift language**, **toolchain**, **Apple SDK**, and **app target**.
- New shared logic defaults to a **package** boundary, not “dump in the app target.”
- Platform claims are accurate (Linux package ≠ iOS framework availability).
- Interop with Objective-C/C/C++ is treated as a **boundary**, not invisible magic.
- Team default narrative matches handbook pin: **Swift 6.3.x** for new modules unless waived.
- “We write Swift” is never used as a substitute for naming CI image, language mode, and SDK.
- Engineers can state what this track **owns** vs **hands off** (see §1.10 / chapter **24**).
- Kotlin/Android or server ambitions are named as **doors**, not assumed covered by iOS experience.
- Value vs reference / ARC story is common vocabulary—not “the compiler just handles memory.”
- Interview rubrics test operational literacy (pins, optionals, concurrency mode), not SE trivia alone.
- Engineers can separate **compiler version** from **language mode** on a real target with evidence.
- At least one teammate has filled an Evolution reading card this quarter (habit, not trivia).
- Architecture talk uses the layer table (language / SDK / product)—not “Swift” as a single noun.

---

## References

- [Swift.org](https://www.swift.org/)
- [About Swift](https://www.swift.org/about/)
- [Swift documentation hub](https://www.swift.org/documentation/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Automatic Reference Counting (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [Structures and Classes (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/structuresandclasses/)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [Swift on Apple Developer](https://developer.apple.com/swift/)
- [Swift on Server](https://www.swift.org/server/)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
