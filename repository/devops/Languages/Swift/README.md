# Swift

[← Back to Languages](../README.md)

If you have shipped a script, a library, or an iOS build, you already know half the story: source goes in, a toolchain turns it into something a machine can run, and somebody has to **pin** what “the toolchain” meant. **Swift** is Apple’s modern language for that job—and, increasingly, a multi-platform one for packages and servers too.

You write clear, typed code. The compiler (`swift` / Xcode) checks optionals, errors, and—under **Swift 6** language mode—data races harder than early Swift ever did. On Apple platforms you also inherit **signing, privacy manifests, and Mac CI** as part of “done,” not as a separate hobby.

This track teaches the **language + toolchain + Package Manager + Apple ship literacy**: how to read Swift, how SPM and Xcode fit together, how concurrency and memory actually behave, how to test and document, and how to review CI that produces a signed artifact. It is **not** a UI/UX design course, an App Store marketing guide, a WWDC video dump, or a full server-framework encyclopedia. Chapter **24** is the **compass** for Evolution and adjacent doors (server, Wasm, Android SDK, Embedded, C++ interop, ownership) so finishing here still *directs* you.

Start at chapter **00**. The first goal is not “ship to the App Store.” It is: know which `swift` is on your PATH, run a hello, and feel the difference between a script, a package, and an app target.

---

## Versions and brownfield (default narrative)

**Default for new work: Swift 6.x language mode** on the current stable toolchain your team ships. This handbook’s language snapshot is the **Swift 6.3.x** line—**pin the exact patch CI actually uses** (`swift --version` / Xcode’s Swift). Swift evolved in public; major versions changed both *syntax* and *meaning* (especially **3**’s source break and **6**’s concurrency checking).

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| **Swift 6.x** / **6.3.x** snapshot | New packages & app targets | Default narrative; complete concurrency checking as destination |
| **Swift 5.x** + async (5.5+) | Migrating apps | Concurrency exists; checking may still be off — literacy |
| **Pre-async** completion handlers / heavy GCD | Older trees | Recognize and migrate; not templates for new code |
| **Swift 3-era** APIs / removed syntax (`++`, C-style `for`) | Very old samples, blog archaeology | **Legacy literacy only** — see chapter **02** |
| **XCTest-only** suites | Brownfield | Coexist; prefer **Swift Testing** for new suites |
| Xcode-only projects (no `Package.swift`) | Many apps | Common; still learn SPM for libraries and tools |

**Legacy vs default:** chapters show **deprecated → removed → modern alternative** with comments like `// Legacy (…) — do not use in new code`. That material is for **maintaining and migrating** old trees. It is not permission to paste museum syntax into new work.

```bash
# Discover what you actually have
swift --version
xcodebuild -version 2>/dev/null || true
swift package describe 2>/dev/null || true
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, platform nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## How to read a chapter

Each chapter talks first, then shows a small program. Comments in the code are part of the lesson—read them. Legacy blocks are labeled on purpose: learn to *recognize* them, then use the modern form. After a snippet, look for **what just happened**. Then **Advanced** deepens (language modes, isolation, SPM edges). Then where this shows up at work, then a checklist.

You do not need to memorize every stdlib method. You need a picture you can hold:

## Semantic model (the ideas that make Swift click)

- **Language + toolchain family.** The same ideas ship via swift.org toolchains, Xcode, or Linux/Windows installs—**which binary** you invoked is part of the truth.
- **Value vs reference (and ownership).** Structs and enums are values; classes are shared identity. Collections often use copy-on-write. Accidental sharing is a common bug class. Advanced APIs increasingly expose **ownership** controls (`~Copyable`, borrow/consume, Span-style views)—optional sixth idea for systems work; most app code stays with ordinary values + ARC (chapters **06**, **11**, **24**).
- **Optionals and errors are explicit.** `nil` and `throws` are in the type story—force-unwrap and force-try are review smells, not shortcuts.
- **Concurrency is increasingly checked.** `async`/`await`, tasks, and actors are the modern model; Swift 6 makes data races a compiler concern when you opt into the language mode.
- **Macros and Observation are part of the modern surface.** Macros generate boilerplate at compile time (see TSPL); **Observation** (`@Observable`) is the modern model-observation path for UI and shared state—prefer it over legacy-only `ObservableObject`/`@Published` for new work when deployment allows (chapters **08**, **10**, **19**).
- **Ship is part of the job on Apple.** Schemes, signing, privacy manifests, and CI image pins are not “ops extras” bolted on after “real” Swift.

**Depth topics** this track treats as first-class literacy (not keynote tourism): **macros** (roles, expand-in-Xcode), **Observation** (`@Observable` vs Combine-era models), and **ownership** direction (`~Copyable` / Span as doors). Deep craft still lives in TSPL + official framework docs; chapters teach review-ready mental models.

### How the six ideas show up at work

| Idea | Review smell if missing | Home chapters |
|------|-------------------------|---------------|
| Toolchain family | “Works on my Mac” with unknown `swift` | **00**, **03**, **21** |
| Value / reference / ownership | Accidental shared mutation; cargo-cult `~Copyable` | **06**, **11**, **24** |
| Optionals / errors | Force-unwrap culture; empty `catch` | **04**, **09** |
| Checked concurrency | UI updates off isolation; unbounded `Task {}` | **10**, **19** |
| Macros / Observation | Silent Combine-only new models; unexpanded macro mystery | **08**, **10**, **19** |
| Ship literacy | Personal schemes; secrets in git; unpinned Xcode | **17–21** |

### Suggested first week (new hire)

1. Run chapter **00** hellos on the team’s pinned toolchain.
2. Print `SWIFT_VERSION` for the app’s Release config (ch **18**).
3. Find the shared scheme and the CI command that invokes it (ch **21**).
4. Skim Observation vs `ObservableObject` (ch **19**) on one real screen.
5. Confirm where ASC / signing secrets live—and that they are **not** in git (ch **20**).
6. Read this README’s semantic model aloud once; keep chapter **24** as the compass, not a detour.

### What “done” means in this track

Finishing **00–23** means you can ship scripts, packages, and Apple-platform apps with staff-review habits. Finishing **24** means you can **name the door** for Embedded, Wasm, Android SDK, server NIO, C++ interop, and ownership/`~Copyable` without expanding this folder into those encyclopedias.

Official Further reading below stays the hub list—TSPL, Observation, Macros, SPM, DocC, signing, Xcode Cloud—not tutorial blogs.

Pin the **Swift 6.3.x** patch your CI actually runs; the chapter text is literacy, not a substitute for `swift --version`.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Doorway | **00** | Toolchain hello; script vs package vs app; first successful run |
| Orientation | **01–03** | What Swift is; version history & language modes; where toolchains live |
| Language core | **04–09** | Bindings & optionals; control/functions/closures; types; properties/init; protocols/generics/macros; errors |
| Systems Swift | **10–13** | Concurrency (+ Observation literacy); ARC & access; stdlib; Foundation |
| Engineering surface | **14–17** | SPM; interop; Swift Testing / XCTest; DocC & API guidelines |
| Apple ship lane | **18–21** | Xcode projects; UI surface literacy; security/privacy; CI/CD |
| Applications + wrap | **22–23** | Use-case gallery; whole-engineering master checklist |
| Compass | **24** | Evolution + adjacent doors (server, Wasm, Android SDK, Embedded, ownership, …) |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 00 | First steps: toolchain and hello | [00_First_Steps_Toolchain_And_Hello.md](./00_First_Steps_Toolchain_And_Hello.md) |
| 01 | What is Swift | [01_What_Is_Swift.md](./01_What_Is_Swift.md) |
| 02 | Versions, language modes, and Swift 6 | [02_Versions_Language_Modes_And_Swift_6.md](./02_Versions_Language_Modes_And_Swift_6.md) |
| 03 | Toolchains: swift.org, Xcode, Linux, Windows | [03_Toolchains_Swift_Org_Xcode_Linux_Windows.md](./03_Toolchains_Swift_Org_Xcode_Linux_Windows.md) |
| 04 | Syntax: bindings, types, optionals | [04_Syntax_Bindings_Types_Optionals.md](./04_Syntax_Bindings_Types_Optionals.md) |
| 05 | Control flow, functions, closures | [05_Control_Flow_Functions_Closures.md](./05_Control_Flow_Functions_Closures.md) |
| 06 | Structs, classes, enums, value and reference | [06_Structs_Classes_Enums_Value_And_Reference.md](./06_Structs_Classes_Enums_Value_And_Reference.md) |
| 07 | Properties, methods, init, deinit | [07_Properties_Methods_Init_Deinit.md](./07_Properties_Methods_Init_Deinit.md) |
| 08 | Protocols, extensions, generics, opaque types | [08_Protocols_Extensions_Generics_Opaque_Types.md](./08_Protocols_Extensions_Generics_Opaque_Types.md) |
| 09 | Error handling | [09_Error_Handling.md](./09_Error_Handling.md) |
| 10 | Concurrency: async/await, tasks, actors | [10_Concurrency_Async_Await_Tasks_Actors.md](./10_Concurrency_Async_Await_Tasks_Actors.md) |
| 11 | ARC, memory safety, access control | [11_ARC_Memory_Safety_Access_Control.md](./11_ARC_Memory_Safety_Access_Control.md) |
| 12 | Standard library literacy | [12_Standard_Library_Literacy.md](./12_Standard_Library_Literacy.md) |
| 13 | Foundation and core libraries | [13_Foundation_And_Core_Libraries.md](./13_Foundation_And_Core_Libraries.md) |
| 14 | Swift Package Manager | [14_Swift_Package_Manager.md](./14_Swift_Package_Manager.md) |
| 15 | Modules, imports, and interop | [15_Modules_Imports_And_Interop.md](./15_Modules_Imports_And_Interop.md) |
| 16 | Testing: Swift Testing and XCTest | [16_Testing_Swift_Testing_And_XCTest.md](./16_Testing_Swift_Testing_And_XCTest.md) |
| 17 | DocC and API Design Guidelines | [17_DocC_And_API_Design_Guidelines.md](./17_DocC_And_API_Design_Guidelines.md) |
| 18 | Xcode projects, schemes, build settings | [18_Xcode_Projects_Schemes_Build_Settings.md](./18_Xcode_Projects_Schemes_Build_Settings.md) |
| 19 | SwiftUI / UIKit / AppKit surface literacy | [19_SwiftUI_UIKit_AppKit_Surface_Literacy.md](./19_SwiftUI_UIKit_AppKit_Surface_Literacy.md) |
| 20 | Security, privacy, signing, and secrets | [20_Security_Privacy_Signing_And_Secrets.md](./20_Security_Privacy_Signing_And_Secrets.md) |
| 21 | CI/CD: Xcode Cloud, fastlane, Mac runners | [21_CI_CD_Xcode_Cloud_Fastlane_Mac_Runners.md](./21_CI_CD_Xcode_Cloud_Fastlane_Mac_Runners.md) |
| 22 | Use cases: scripts, packages, apps, server glance | [22_Use_Cases_Scripts_Packages_Apps_Server_Glance.md](./22_Use_Cases_Scripts_Packages_Apps_Server_Glance.md) |
| 23 | Whole-engineering wrap and staff checklist | [23_Whole_Engineering_Wrap_And_Staff_Checklist.md](./23_Whole_Engineering_Wrap_And_Staff_Checklist.md) |
| 24 | Where Swift is going and adjacent doors | [24_Where_Swift_Is_Going_And_Adjacent_Doors.md](./24_Where_Swift_Is_Going_And_Adjacent_Doors.md) |

---

## Further reading

### Language and toolchain

- [Swift.org](https://www.swift.org/)
- [Swift documentation hub](https://www.swift.org/documentation/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Getting started](https://www.swift.org/getting-started/)
- [Install / downloads](https://www.swift.org/install/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [Swift.org blog](https://www.swift.org/blog/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Macros (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)

### Package Manager, stdlib, docs

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Package Manager Docs](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- [PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription)
- [Swift standard library](https://developer.apple.com/documentation/swift)
- [DocC](https://developer.apple.com/documentation/docc)
- [Swift Testing](https://developer.apple.com/documentation/testing)

### Apple platforms and tooling

- [Swift on Apple Developer](https://developer.apple.com/swift/)
- [Foundation](https://developer.apple.com/documentation/foundation)
- [SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Observation](https://developer.apple.com/documentation/observation)
- [Xcode](https://developer.apple.com/documentation/xcode)
- [Xcode Cloud](https://developer.apple.com/xcode-cloud/)
- [XCTest](https://developer.apple.com/documentation/xctest)
- [Code signing](https://developer.apple.com/support/code-signing/)
- [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)

### CI / release automation

- [fastlane docs](https://docs.fastlane.tools/)
- [GitHub Actions — hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners)

### Server / adjacent (literacy hubs)

- [Swift on Server](https://www.swift.org/server/)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
