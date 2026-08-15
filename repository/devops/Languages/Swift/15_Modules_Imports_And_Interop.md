# Modules, imports, and interop

[← Back to Swift](./README.md)

## What this chapter covers

**Module vs target vs product**, **`import` / `@_exported`**, **module selectors** (`Module::Name`, Swift **6.3+**), **bridging headers vs module maps**, **ObjC `@objc` / dynamic vs Swift dispatch**, **C interop** overview, **C++ interop** (including move-only glance), and an **expanded unsafe bridging review checklist**. Default is **Swift 6.3.x** / Swift 6 language mode.

Interop is how Swift sits on Apple’s existing stacks and native libraries. This chapter teaches you to *read and review* bridging — not to become a Clang expert. Deep C++ interop evolves quickly; prefer official hubs for details.

Picture modules as **rooms with doors**. `import` is a key. SPM targets build rooms; products decide which doors outsiders may use. Bridging headers are **side doors into an older wing** of the building — useful, easy to leave unlocked. Module selectors (`::`) are name badges that say “I meant *that* room’s `View`.”

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

### 1. Module selectors — name collision literacy (Swift 6.3+)

When two imported modules declare the same name (or a module name collides with a type name), ordinary `Module.Type` qualification can fail — Swift may prefer a **type** named `Module` over the **module**. **SE-0491** adds **module selectors** with `::`:

```swift
// Swift 6.3+ — module selector: left side is ALWAYS a module name
struct MyView: SwiftUI::View {
    var body: some SwiftUI::View { Text("ok") }
}

// Disambiguate a member added by a specific module's extension:
let data = "text".Foundation::data(using: .utf8)

// Classic collision: module Rocket and type Rocket in that module —
// Rocket.SaturnV might look inside the *type* Rocket.
// Rocket::SaturnV looks in the *module* Rocket.
```

| Habit | Detail |
|-------|--------|
| Use for unavoidable collisions | Two deps you do not control; module/type same name |
| Not an access-control bypass | `::` does not reveal `internal` symbols |
| Prefer rename for *your* APIs | Do not design public APIs that force clients to write `::` |
| Toolchain gate | Needs Swift **6.3+**; older compilers cannot parse `::` |

```swift
#if compiler(>=6.3)
typealias UIViewProtocol = SwiftUI::View
#endif
```

**What just happened.** `Module.Name` was overloaded and sometimes wrong; `Module::Name` is explicit. Most codebases rarely need it — when you do, it beats renaming vendored SDKs. Guard or avoid in libraries that still build on older compilers.

### 2. Objective-C `@objc` — dynamic vs Swift dispatch

Swift classes marked `@objc` / inheriting `NSObject` participate in ObjC runtime features (selectors, KVO, IB, `#selector`, message sends). Pure Swift classes use **Swift** method dispatch (and optimization). Dynamic dispatch through the ObjC runtime is what those features need — and what you pay for.

| World | Dispatch story | You need it when |
|-------|----------------|------------------|
| Pure Swift | Static / witness / vtable-style Swift rules | Default models, packages, servers |
| `@objc` / `NSObject` | ObjC message send (dynamic) | Selectors, IBActions, ObjC protocols, runtime swizzling literacy |

```swift
// Legacy (exposing everything to ObjC “just in case”) — do not use in new code.
// @objc public class Everything: NSObject { … }

@objc(EXLegacyBridge)
final class LegacyBridge: NSObject {
    @objc func doThing() { /* called from ObjC or #selector */ }
}

final class Controller {
    @objc func tapped() {
        // #selector(Controller.tapped) needs @objc
    }
}

let action = #selector(Controller.tapped)
```

**What just happened.** `#selector` is a compile-time check that the method is visible to the ObjC runtime. Without `@objc`, you get a compile error — that is the language protecting you from a runtime “unrecognized selector” crash later. Over-annotating enlarges binary and API surface. Prefer pure Swift until a runtime feature forces `@objc`.

`dynamic` (in the ObjC sense) is about **runtime** replacement / KVO — not a synonym for “Swift virtual.” Do not sprinkle `@objc dynamic` to “make it flexible.”

### 3. Bridging header vs module maps

| Mechanism | Role |
|-----------|------|
| **ObjC bridging header** | Per-app/target allowlist of `#import`s into Swift (Apple mixed targets) |
| **Clang module / module map** | Modular import of C/ObjC headers (`import Foo`) — preferred for frameworks & SPM |
| **Generated `*-Swift.h`** | ObjC consuming annotated Swift |

```text
// Prefer for libraries:
// - umbrella header + module map / Clang module
// - SPM clang targets / systemLibrary

// Bridging header — fine for app targets migrating ObjC → Swift
// Smell: megabyte bridging header imported by every Swift file
```

**What just happened.** Module maps scale; bridging headers are pragmatic glue. Broken module maps produce inscrutable compile errors — fix the map, do not randomly re-add headers to the bridging file. System libraries via SPM `systemLibrary` targets are the structured approach for C deps.

### 4. Generated Swift header (ObjC → Swift)

ObjC can call Swift types that are `@objc` and exposed. Xcode generates `ProductModuleName-Swift.h`. Name collisions, Swift generics, and pure Swift value types often **do not** bridge cleanly — design a narrow `@objc` façade instead of exposing your whole model layer.

```objc
#import "MyApp-Swift.h"
// EXLegacyBridge *bridge = [EXLegacyBridge new];
// [bridge doThing];
```

### 5. C++ interop — official direction + move-only glance

Swift can interoperate with C++ at supported toolchain levels (Clang importer / C++ interop mode). Expect:

- **explicit enablement** in the build / package settings,
- a **subset** of C++ features mapped cleanly,
- **ownership** and **exception** boundaries as review hotspots,
- **move-only / noncopyable** C++ types mapping toward Swift ownership / `~Copyable` stories (toolchain-dependent — verify on your pin),
- rapid Evolution — pin toolchain and read the official C++ interoperability docs for *your* version.

```swift
// Literacy only — enable C++ interop in target settings / Package.swift when required.
// Prefer wrapping volatile C++ in a thin C or ObjC++ façade if the surface churns.
// Move-only C++ values: treat like unique resources — do not assume copyable Swift APIs.
```

**Staff habit.** Prefer official direction over blog archaeology. If the C++ API is unstable, a narrow C façade is often cheaper than teaching every Swift caller the importer’s edge cases. Span / annotated pointers (chapter **11**) improve some C++ buffer boundaries when annotations exist.

### 6. Lab — thin C façade shape

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

**What just happened.** Swift talks to a boring C surface; C++ stays behind that wall. Ownership is obvious in `deinit`. This pattern survives toolchain upgrades better than exposing every C++ template to the importer. Pair with `~Copyable` wrappers (chapter **11**) when the resource must not be duplicated.

### 7. Name collisions (pre-6.3 and general)

Overlapping type names across modules need qualification. Before 6.3, `Module.Type` and import aliases were the tools; with 6.3+, prefer `Module::Type` when the dotted form is ambiguous. Vendor module maps carefully.

### 8. Stable ABI vs library evolution (awareness)

Apple platforms have library-evolution / ABI stability stories for Swift in the OS. Your own packages are **not** automatically ABI-stable across compilers. For shipped binary frameworks, follow Apple’s library evolution guidance; for source packages, semver and source compatibility dominate.

### 9. Linux interop reality

No ObjC runtime on typical Linux Swift. C interop and corelibs Foundation are the path. Code that `#if canImport(ObjectiveC)` keeps Apple-only bridges off Linux CI.

```swift
#if canImport(ObjectiveC)
import ObjectiveC
#endif
```

### 10. Unsafe bridging — expanded review checklist

Use this at PR time when a change touches C / ObjC / C++ / unsafe pointers / `Span` boundaries:

1. **Who owns the memory?** Caller, callee, or “borrowed for this call only”?
2. **Pointer lifetime?** Is any pointer stored past the bridging call?
3. **Nullability?** Annotated correctly, or IUO landmines?
4. **Length / bounds?** Buffer sizes paired with pointers? Prefer Span-shaped APIs when available.
5. **Thread / isolation?** Callbacks on which queue / actor? (chapter **10**)
6. **Errors?** C errno / ObjC NSError mapped to `throws`? (chapter **09**)
7. **Escape hatch scope?** Can unsafe stay inside one wrapper module?
8. **Copy vs move?** Especially C++ move-only / noncopyable — no silent copies.
9. **Autorelease?** Tight ObjC loops need pool literacy? (chapter **11**)
10. **Tests?** Negative tests for nil, empty buffers, failure codes, and cancel?

This is a **review posture**, not a kit for inventing new undefined behavior.

### 11. Lab — bridging header allowlist vs module map

```objc
// App-Bridging-Header.h — curated allowlist
#import "LegacyLogin.h"
#import "LegacyAnalytics.h"
// Do NOT #import every header in the tree “for convenience”
```

```text
// Framework / SPM-shaped C library (literacy):
// include/Foo/Foo.h          umbrella
// include/Foo/module.modulemap
//   module Foo { umbrella header "Foo.h" export * }
//
// Swift: import Foo
```

**What just happened.** Bridging headers are **target-local glue**. Module maps are **reusable import surfaces**. Growing apps that keep dumping ObjC into the bridging header make every Swift file compile against a larger, chattier surface — migrate hot modules to frameworks/SPM with maps when you can.

### 12. `@objc` dynamic vs Swift — decision table

| Need | Prefer |
|------|--------|
| Pure models, SPM libraries, server | Swift types — no `@objc` |
| `#selector` / target-action | Narrow `@objc` method |
| ObjC protocol conformance | `@objc` protocol + conforming class |
| KVO / IB outlet world | `NSObject` subclass literacy |
| “Maybe someone will swizzle” | **No** — not a design goal |

```swift
// Bad culture — entire model layer on NSObject for habit
// @objcMembers final class Everything: NSObject { var x = 1 }

// Better — façade at the boundary only
@objc final class LegacyFaçade: NSObject {
    private let core: PureSwiftCore
    @objc func ping() { core.ping() }
}
struct PureSwiftCore { func ping() {} }
```

**What just happened.** Dynamic ObjC dispatch is a **compatibility tax**. Pay it at the door to the old wing; do not renovate the whole house into ObjC just in case.

### 13. C++ move-only glance — ownership questions

When a C++ API returns or accepts move-only types (unique ownership):

| Question | Why it matters |
|----------|----------------|
| Does Swift import it as noncopyable / consuming? | Silent copies would be wrong |
| Who destroys the resource? | Double-free vs leak |
| Can you wrap it in a Swift `~Copyable` or class owner? | Clear `deinit` / consume story |
| Do exceptions cross the boundary? | Prefer `noexcept` / error codes at the façade |

```swift
// Literacy sketch — exact importer mapping depends on toolchain flags / annotations.
// Treat move-only C++ like FileDescriptor in chapter 11: one owner, no photocopy.
```

**What just happened.** Move-only interop is why “just import the header” fails staff review. Pin the toolchain, read the C++ interop guide for **your** version, and keep a thin façade.

### 14. Module selector — when *not* to use it

- Renaming **your** colliding type is better API design than forcing clients to write `Yours::Thing`.
- Do not use `::` to paper over missing `import` or wrong product dependency.
- Do not expect `::` to pierce `internal` / `private`.
- Libraries supporting compilers older than 6.3 cannot ship `::` in public headers without availability strategy.

```swift
// Prefer for *your* package:
public struct ExampleKitView { /* … */ }  // unambiguous name

// Reserve :: for:
// SwiftUI::View vs MyGame::View collisions you do not control
```

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Thin ObjC bridges; migrate call sites to Swift APIs over time; `@objc` only where required |
| **Systems** | C boundaries isolated in one module; unsafe pointers do not leak into app code; module maps over mega bridging headers |
| **Security** | Audit bridged APIs for nullability and buffer lengths; distrust raw pointers from C |
| **Operations** | Toolchain pin must match C++ interop and 6.3 `::` usage; document required flags |
| **Software engineering** | Module graph acyclic; `@testable` only in tests; minimal `@_exported`; products match import story; `::` for collisions you do not control |

---

## 4. Staff-level review checklist

- [ ] Dependency and import graph matches intended modules; no cycles.
- [ ] Team can explain module vs target vs product for the package under review.
- [ ] Symbols crossing modules are deliberately `public`/`open`/`package`.
- [ ] `@testable import` confined to test targets.
- [ ] `@_exported import` is intentional umbrella design — not convenience.
- [ ] Name collisions use `Module::Name` on Swift 6.3+ when dotted qualification fails; libraries do not force `::` as API design.
- [ ] Bridging headers are curated allowlists; prefer module maps for reusable C/ObjC surfaces.
- [ ] ObjC nullability audited at edges.
- [ ] `@objc` / `NSObject` / dynamic ObjC dispatch only where a runtime feature or ObjC caller requires it.
- [ ] C/C++ unsafe surfaces wrapped; ownership documented; expanded checklist applied; move-only C++ treated as unique.
- [ ] Linux CI does not assume Darwin/ObjC-only modules without guards.
- [ ] C++ interop enablement is explicit and version-pinned.

---

## References

- [The Swift Programming Language — Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Imported C and Objective-C APIs](https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
- [Swift Evolution — Module Selectors (SE-0491)](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0491-module-selectors.md)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
- [Swift.org changelog](https://github.com/swiftlang/swift/blob/main/CHANGELOG.md) (6.3 module selectors)
