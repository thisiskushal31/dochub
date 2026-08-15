# What is Swift?

[← Back to Swift](./README.md)

## What this chapter covers

What **Swift** is as a language—its goals, its open-source home, the platforms it runs on—and how that differs from **Apple SDKs**, **Xcode**, and “the iOS stack.” You will leave with a clean separation: language vs toolchain vs frameworks vs product surface. Handbook default narrative: **Swift 6.3.x**.

This is orientation with a story, not a brochure and not a WWDC highlight reel. If someone asks “do we write Swift?”, your answer should name *which layer* they mean.

---

## 1. Concepts

### 1. A one-sentence job description

**Swift** is a general-purpose language designed to be **safe by default**, **expressive**, and **fast enough for systems and apps**—with a modern type system, optionals instead of ambient null, and a toolchain that spans Apple platforms, Linux, and Windows.

It is not “a synonym for UIKit,” not “whatever Xcode opened,” and not “only for phones.”

### 2. The story in one breath

Apple needed a successor language that could talk to decades of Cocoa without forcing every team to rewrite the world on day one. Swift shipped in **2014** with optionals, type inference, and playgrounds—then spent a decade arguing (in public) about how much checking is enough. **Swift 3** broke sources to settle naming. **Swift 5** stabilized the Apple ABI story. **Swift 5.5** made `async`/`await` real. **Swift 6** language mode makes data races a compiler problem when you opt in.

That arc is why staff care about **pins**: the word “Swift” in a resume can mean “I write UIKit” or “I ship Linux packages under complete concurrency checking.” This track teaches the second kind of literacy *and* enough Apple ship surface to review the first.

### 3. Compiler + runtime picture

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

### 4. Language goals you can feel in day-one code

| Goal | What it looks like in practice |
|------|--------------------------------|
| **Safe by default** | Optionals, definite initialization, bounds-checked arrays, ARC instead of manual retain/release rituals |
| **Clear intent** | `let` vs `var`, named parameters, progressive disclosure (simple code stays simple) |
| **Interoperability** | First-class story with Objective-C/Cocoa historically; C and growing C++ interop for systems edges |
| **Approachable power** | Generics, protocols, macros, modern concurrency—without forcing every file to be expert mode |
| **Performance enough** | Value types + ARC + optimization pipeline aimed at app and systems work—not a scripting toy |

### 5. Where Swift sits vs Objective-C, C++, Kotlin

Orientation only—not a language war:

| Neighbor | Relationship to Swift |
|----------|------------------------|
| **Objective-C** | Historical host ecosystem on Apple platforms; Swift was designed to **call and be called** across the bridge. Brownfield superpower + nullability/selector complexity tax (chapter **15**). |
| **C / C++** | Systems edges: C always; **C++ interop** is a growing first-class story for mixed codebases ([cxx-interop](https://www.swift.org/documentation/cxx-interop/)). |
| **Kotlin** | Peer “modern mobile/systems” language in Android-first shops. Swift’s Android SDK door (chapter **24**) is **not** “Kotlin literacy transferred.” Different stdlibs, packaging, and UI stacks. |
| **Scripting languages** | Swift can feel script-like (`swift file.swift`) but stays statically typed; do not treat it as untyped glue forever. |

Staff takeaway: pick neighbors by **boundary**, not by Twitter. Interop is a reviewed seam.

### 6. Open source and governance glance

Swift is developed in the open. **swift.org** is the project’s public hub: downloads, documentation, forums, evolution, server workgroup, and getting-started guides. Language changes go through **Swift Evolution** proposals (SE-NNNN). Apple remains a major steward and the primary ship path for Apple OS SDKs—but the language is not a private dialect that only ships inside Xcode.

Practical meaning for engineers:

- You can install toolchains without opening the App Store.
- You can read *why* a feature exists (proposal + review) instead of treating syntax as magic.
- Linux and Windows are first-class enough for packages, servers, and CI—not second-class cosplay.
- Workgroups (e.g. server) steer ecosystem directions without replacing your pin discipline.

Chapter **02** / **24** teach how to read Evolution without drowning. Here you only need: *governance is public; pins are still your job.*

### 7. Platforms: Apple-first history, multi-platform present

| Platform family | Role |
|-----------------|------|
| **Apple OSes** | Where most commercial Swift apps ship; SDKs, signing, store rules |
| **Linux** | Packages, server services, Docker CI, many open-source libraries |
| **Windows** | Tooling, packages, learning, growing production niches |
| **Adjacent** | Server initiatives, Wasm, Embedded Swift, Android SDK literacy (compass—chapter **24**) |

“Swift runs here” ≠ “UIKit runs here.” Always name **language runtime/toolchain** separately from **framework availability**.

### 8. Swift the language vs Apple SDKs

Hold this table until it is boring:

| Layer | Examples | Who defines it |
|-------|----------|----------------|
| **Language + stdlib** | `String`, `Array`, optionals, concurrency primitives | Swift project |
| **Core libraries** | Foundation (with platform differences), Dispatch, etc. | Platform + Swift ecosystem |
| **Apple SDKs** | SwiftUI, UIKit, AppKit, WidgetKit, … | Apple per OS |
| **Your product** | App, package, CLI, service | You |

### 9. What this track owns vs hands off

| Owns (bullseye) | Hands off (doors / siblings) |
|-----------------|------------------------------|
| Language + toolchain + SPM + testing + DocC/API style | Pixel-perfect UI/UX design systems |
| Concurrency / ARC / stdlib / Foundation literacy | Full server-framework encyclopedias (Vapor deep dives) |
| Xcode schemes, signing/privacy **review** literacy, Mac CI shapes | App Store marketing / ASO |
| Use-case shape selection (script/package/app) | Shell/CI YAML depth (see [Shell](../Shell/README.md)) |
| Compass to Wasm / Embedded / Android SDK / server | Pretending those are covered because “we finished Swift” |

Chapter **24** is the compass. Scope honesty is how this track stays usable.

### 10. Relationship to Objective-C (orientation only)

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

### 5. Lab — name the layers on a real ticket

Pick one ticket from your backlog and fill this card:

```text
Ticket: ____________________
Language surface:     [ ] pure Swift  [ ] + Foundation  [ ] + UI framework
Artifact:             [ ] script  [ ] package  [ ] app target  [ ] test-only
Toolchain channel:    [ ] Xcode  [ ] Swiftly/swift.org  [ ] Docker  [ ] Windows
CI runner:            [ ] Linux  [ ] macOS  [ ] both
Hands-off if needed:  ________________ (design / server framework / Shell YAML / …)
```

If two engineers fill different cards for the same ticket, your nouns are not shared yet—fix the vocabulary before arguing about architecture.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Product features in SwiftUI/UIKit *and* shared domain packages in pure Swift |
| **Systems** | CLIs and daemons on macOS/Linux with SPM; careful Foundation assumptions across Darwin vs corelibs |
| **Security** | Prefer Swift’s explicit optionals/errors at trust boundaries; do not smuggle nil through ObjC-imported APIs unreviewed |
| **Operations** | Standardize on swift.org / Xcode / container images as *named* channels; document which one CI uses |
| **Software engineering** | Separate “language style guide” from “UI framework guide”; hire and review against both deliberately |

---

## 4. Staff-level review checklist

- [ ] Docs and diagrams distinguish **Swift language**, **toolchain**, **Apple SDK**, and **app target**.
- [ ] New shared logic defaults to a **package** boundary, not “dump in the app target.”
- [ ] Platform claims are accurate (Linux package ≠ iOS framework availability).
- [ ] Interop with Objective-C/C/C++ is treated as a **boundary**, not invisible magic.
- [ ] Team default narrative matches handbook pin: **Swift 6.3.x** for new modules unless waived.
- [ ] “We write Swift” is never used as a substitute for naming CI image, language mode, and SDK.
- [ ] Engineers can state what this track **owns** vs **hands off** (see §1.9 / chapter **24**).
- [ ] Kotlin/Android or server ambitions are named as **doors**, not assumed covered by iOS experience.

---

## References

- [Swift.org](https://www.swift.org/)
- [About Swift](https://www.swift.org/about/)
- [Swift documentation hub](https://www.swift.org/documentation/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [Swift on Apple Developer](https://developer.apple.com/swift/)
- [Swift on Server](https://www.swift.org/server/)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
