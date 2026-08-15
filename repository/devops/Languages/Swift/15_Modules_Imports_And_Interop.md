# Modules, imports, and interop

[← Back to Swift](./README.md)

## What this chapter covers

**Module vs target vs product**, **`import` / `@_exported`**, **bridging headers**, **ObjC `@objc` / dynamic dispatch**, **C interop** overview, **C++ interop** official direction literacy, and an **unsafe bridging review checklist**. Default is **Swift 6.3.x** / Swift 6 language mode.

Interop is how Swift sits on Apple’s existing stacks and native libraries. This chapter teaches you to *read and review* bridging — not to become a Clang expert. Deep C++ interop evolves quickly; prefer official hubs for details.

Picture modules as **rooms with doors**. `import` is a key. SPM targets build rooms; products decide which doors outsiders may use. Bridging headers are **side doors into an older wing** of the building — useful, easy to leave unlocked.

---

## 1. Concepts

### 1. Module vs target vs product

| Noun | Meaning |
|------|---------|
| **Target** | Build unit (sources + dependencies) — usually one **module** |
| **Module** | The compiled unit clients `import` by name |
| **Product** | Package surface (library / executable / plugin) that *exposes* one or more targets |

```swift
// Package: product "ExampleKit" → target "ExampleKit" → module ExampleKit
import ExampleKit
```

**What just happened.** In SPM, “I added a target” does not mean “clients can import it.” Only **products** (plus access control on symbols) define the public package surface. Inside one package, targets may depend on each other without every target becoming a product (chapter **14**). Xcode app targets are also modules — same import rules, different project UI.

### 2. Access control meets modules

`public` / `open` / `package` are how APIs cross module edges (chapter **11**). `internal` stops at the module. If you “cannot see” a symbol from another target, you likely need a product dependency *and* a public (or package) attribute — not a wildcard import trick.

```swift
// Module ExampleKit
public struct Client {
    public init() {}
    public func ping() -> String { "ok" }
}
```

### 3. Import kinds literacy

| Form | Meaning |
|------|---------|
| `import Module` | Whole module |
| `import struct Module.Type` | Narrow import (occasional clarity) |
| `@_exported import` | Re-export (library authors only; deliberate) |
| `@testable import` | Expose `internal` to tests in the same package/module setup |

```swift
@testable import ExampleKit   // tests only — not for production targets

// Caution: @_exported import Foundation
// Clients of *your* module suddenly see Foundation symbols as if they imported it.
// Use only when re-export is an intentional umbrella API.
```

**What just happened.** `@testable` is for unit tests, not a way to avoid designing a public API. `@_exported` widens your API surface by surprise — reviewers should treat it like adding a public dependency to every client.

### 4. Bridging header literacy (Apple)

Mixed apps often have:

1. an **Objective-C bridging header** — Swift consuming ObjC,
2. a generated **Swift header** (`Product-Swift.h`) — ObjC consuming Swift.

Prefer modular frameworks / SPM over a single ever-growing bridging header when you can.

```objc
// Example-Bridging-Header.h (literacy)
#import "LegacyController.h"
```

```swift
// Swift calling an ObjC type imported via bridging / module:
let obj = LegacyController()
obj.doThing()
```

Nullability annotations in ObjC (`nullable` / `nonnull` / audited regions) become optionals — audit poorly annotated headers; they produce dangerous Implicitly Unwrapped Optionals or wrong optionality.

**What just happened.** Every `#import` in the bridging header is visible to *all* Swift in that target. Treat the bridging header as a curated allowlist, not a junk drawer.

### 5. C interop overview

C headers import as Clang modules or via bridging. Swift maps C types to Swift types where it can (`Int32`, pointers as `UnsafePointer`). You own memory rules at the boundary.

```swift
import Darwin

let fd = open("/tmp/x", O_RDONLY)
defer { if fd >= 0 { close(fd) } }
```

Prefer higher-level Foundation/Swift APIs until you must drop to C. When you must: isolate C in one module, never leak raw pointers into app feature code.

### 6. Lab — reading the three nouns on one package

```text
swift package describe
# products: ExampleKit (library)
# targets: ExampleKit, ExampleInternals, ExampleKitTests

# App Package.swift depends on product ExampleKit
# App source: import ExampleKit        ✅
# App source: import ExampleInternals  ❌ (not a product)
```

**What just happened.** `describe` is the map. If a teammate “cannot import” a symbol, ask: missing product dependency, missing `public`/`package`, or wrong module name? Those are three different bugs.

---

## 2. Advanced concepts

### 1. Objective-C `@objc` and dynamic dispatch

Swift classes marked `@objc` / inheriting `NSObject` participate in ObjC runtime features (selectors, KVO, IB, `#selector`, message sends). Pure Swift classes do not. Dynamic dispatch through the ObjC runtime is what those features need — and what you pay for.

```swift
// Legacy (exposing everything to ObjC “just in case”) — do not use in new code.
// @objc public class Everything: NSObject { … }

@objc(EXLegacyBridge)
final class LegacyBridge: NSObject {
    @objc func doThing() { /* called from ObjC or #selector */ }
}
```

**When you need `@objc`.** Selectors for targets/actions, ObjC protocols, exposed API for ObjC callers, certain runtime tricks. When you do not: pure Swift models, new libraries with no ObjC clients. Over-annotating enlarges binary and API surface.

```swift
final class Controller {
    @objc func tapped() {
        // #selector(Controller.tapped) needs @objc
    }
}

let action = #selector(Controller.tapped)
```

**What just happened.** `#selector` is a compile-time check that the method is visible to the ObjC runtime. Without `@objc`, you get a compile error — that is the language protecting you from a runtime “unrecognized selector” crash later.

### 2. Generated Swift header (ObjC → Swift)

ObjC can call Swift types that are `@objc` and exposed. Xcode generates `ProductModuleName-Swift.h`. Name collisions, Swift generics, and pure Swift value types often **do not** bridge cleanly — design a narrow `@objc` façade instead of exposing your whole model layer.

```objc
#import "MyApp-Swift.h"
// EXLegacyBridge *bridge = [EXLegacyBridge new];
// [bridge doThing];
```

### 3. C++ interop — official direction literacy

Swift can interoperate with C++ at supported toolchain levels (Clang importer / C++ interop mode). Expect:

- **explicit enablement** in the build / package settings,
- a **subset** of C++ features mapped cleanly,
- **ownership** and **exception** boundaries as review hotspots,
- rapid Evolution — pin toolchain and read the official C++ interoperability docs for *your* version.

```swift
// Literacy only — enable C++ interop in target settings / Package.swift when required.
// Prefer wrapping volatile C++ in a thin C or ObjC++ façade if the surface churns.
```

**Staff habit.** Prefer official direction over blog archaeology. If the C++ API is unstable, a narrow C façade is often cheaper than teaching every Swift caller the importer’s edge cases.

### 4. Lab — thin C façade shape

```c
/* bridge.h — C ABI, stable for Swift importer */
typedef struct EXHandle EXHandle;
EXHandle *ex_create(void);
void ex_destroy(EXHandle *);
int ex_work(EXHandle *, const char *input, char *out, size_t out_len);
```

```swift
// Swift wrapper owns the handle lifetime
final class Engine {
    private let handle: OpaquePointer
    init() { handle = ex_create() }
    deinit { ex_destroy(handle) }
}
```

**What just happened.** Swift talks to a boring C surface; C++ stays behind that wall. Ownership is obvious in `deinit`. This pattern survives toolchain upgrades better than exposing every C++ template to the importer.

### 5. Name collisions and module maps

Overlapping type names across modules need qualification (`Module.Type`). Vendor module maps for C libraries carefully; broken module maps produce inscrutable compile errors. System libraries via SPM `systemLibrary` targets are the structured approach.

### 6. Stable ABI vs library evolution (awareness)

Apple platforms have library-evolution / ABI stability stories for Swift in the OS. Your own packages are **not** automatically ABI-stable across compilers. For shipped binary frameworks, follow Apple’s library evolution guidance; for source packages, semver and source compatibility dominate.

### 7. Linux interop reality

No ObjC runtime on typical Linux Swift. C interop and corelibs Foundation are the path. Code that `#if canImport(ObjectiveC)` keeps Apple-only bridges off Linux CI.

```swift
#if canImport(ObjectiveC)
import ObjectiveC
#endif
```

### 8. Unsafe bridging — review checklist (posture)

Use this at PR time when a change touches C / ObjC / C++ / unsafe pointers:

1. **Who owns the memory?** Caller, callee, or “borrowed for this call only”?
2. **Lifetime lifetime?** Is any pointer stored past the bridging call?
3. **Nullability?** Annotated correctly, or IUO landmines?
4. **Length / bounds?** Buffer sizes paired with pointers?
5. **Thread / isolation?** Callbacks on which queue / actor?
6. **Errors?** C errno / ObjC NSError mapped to `throws`?
7. **Escape hatch scope?** Can unsafe stay inside one wrapper module?
8. **Tests?** Negative tests for nil, empty buffers, and failure codes?

This is a **review posture**, not a kit for inventing new undefined behavior.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Thin ObjC bridges; migrate call sites to Swift APIs over time |
| **Systems** | C boundaries isolated in one module; unsafe pointers do not leak into app code |
| **Security** | Audit bridged APIs for nullability and buffer lengths; distrust raw pointers from C |
| **Operations** | Toolchain pin must match C++ interop expectations; document required flags |
| **Software engineering** | Module graph acyclic; `@testable` only in tests; minimal `@_exported`; products match import story |

---

## 4. Staff-level review checklist

- [ ] Dependency and import graph matches intended modules; no cycles.
- [ ] Team can explain module vs target vs product for the package under review.
- [ ] Symbols crossing modules are deliberately `public`/`open`/`package`.
- [ ] `@testable import` confined to test targets.
- [ ] `@_exported import` is intentional umbrella design — not convenience.
- [ ] Bridging headers are curated allowlists; ObjC nullability audited at edges.
- [ ] `@objc` / `NSObject` only where a runtime feature or ObjC caller requires it.
- [ ] C/C++ unsafe surfaces wrapped; ownership documented; checklist above applied.
- [ ] Linux CI does not assume Darwin/ObjC-only modules without guards.
- [ ] C++ interop enablement is explicit and version-pinned.

---

## References

- [The Swift Programming Language — Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Imported C and Objective-C APIs](https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
