# Swift Package Manager

[← Back to Swift](./README.md)

## What this chapter covers

**`Package.swift`** walkthrough (executable + library + tests), **products vs targets**, **tools-version**, **version requirements / Exact pins**, **dependency resolution conflicts**, **binary targets & checksum verification**, **plugins + macros** trust, **package traits** enablement, **`Package.resolved` as lockfile literacy**, **mirrors/registries** caution, and **Xcode vs CLI** on the same package. Default toolchain narrative: **Swift 6.3.x** / Swift 6 language mode for new packages.

SPM is the standard way to build libraries and tools outside (and inside) Xcode. App projects may still be `.xcodeproj`-first (chapter **18**); libraries and CLI tools should be fluent in packages. Think of a package as a **shipping crate**: targets are compartments, products are the labeled goods customers can buy, and `Package.resolved` is the packing list of exact versions that went in this shipment.

---

## 1. Concepts

### 1. Lab — full `Package.swift` (executable + library + tests)

```swift
// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "ExampleKit",
    platforms: [
        .macOS(.v14),
        .iOS(.v17),
    ],
    // traits: [ ... ],   // Swift 6.1+ — see Advanced
    products: [
        .library(name: "ExampleKit", targets: ["ExampleKit"]),
        .executable(name: "examplectl", targets: ["ExampleCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-log.git", from: "1.6.0"),
        // .package(url: "…", exact: "1.2.3"),
    ],
    targets: [
        .target(
            name: "ExampleKit",
            dependencies: [
                .product(name: "Logging", package: "swift-log"),
            ],
            path: "Sources/ExampleKit"
        ),
        .executableTarget(
            name: "ExampleCLI",
            dependencies: ["ExampleKit"],
            path: "Sources/ExampleCLI"
        ),
        .testTarget(
            name: "ExampleKitTests",
            dependencies: [
                "ExampleKit",
                // .product(name: "…", package: "…") for test-only deps
            ],
            path: "Tests/ExampleKitTests"
        ),
    ]
)
```

| Piece | Job |
|-------|-----|
| `swift-tools-version` | Gates which **manifest APIs** you may use |
| `platforms` | Minimum OS versions you claim |
| `products` | What clients depend on / run |
| `dependencies` | Other packages (URL + version requirement) |
| `targets` | Build units / modules — library, executable, tests |

**What just happened.** One manifest ships a **library product** (importable), an **executable product** (runnable CLI), and a **test target** (not a product). The tools version at the top is not decorative — older SwiftPM rejects manifests that use newer APIs. Pin it deliberately when you adopt traits, new settings, or plugin APIs.

### 2. Products vs targets

| Noun | Role |
|------|------|
| **Target** | Build unit / module (sources + deps) |
| **Product** | What clients import/link (library, executable, plugin) |
| **Test target** | Test module; not a shipped product |

A library product exposes one or more targets. Executables are products with `@main` / `main.swift`. Do not confuse “I have a target” with “clients can depend on it” — only products are the public package surface (plus whatever you mark `public`/`package` in code — chapter **11**).

**Mental model.** Targets can depend on other targets inside the package without exposing them as products. That is how you keep helpers internal while shipping a thin `ExampleKit` product.

### 3. Local workflow commands

```bash
swift package describe          # show package graph summary
swift build                     # build
swift test                      # test
swift run examplectl            # run named executable product
swift package resolve           # resolve versions without full build
swift package show-dependencies # inspect graph
swift package update            # bump within allowed ranges; refresh pins
```

**What just happened.** CI should invoke the same `swift` / Xcode toolchain pin humans use. `describe` and `show-dependencies` are your first stop when “it builds on my machine” means a different graph.

### 4. Version requirements and Exact pins

```swift
dependencies: [
    .package(url: "https://github.com/apple/swift-log.git", from: "1.6.0"),
    .package(url: "https://github.com/example/Critical.git", exact: "2.0.1"),
    // .package(url: "…", branch: "main"),  // Legacy for shipped code — avoid
    // .package(url: "…", revision: "abc123"), // emergency / fork pin — document why
],
```

| Requirement | Meaning |
|-------------|---------|
| `from:` | Semi-open range upward within semver policy |
| `exact:` | One version only — strongest pin in the manifest |
| closed range | Bounded upgrade window |
| branch / revision | Moving or fixed git identity — exceptional |

Prefer `from:` / closed ranges for ordinary deps. Use **`exact:`** when a bug or license forces a single known build. Revision pins are for forks and emergencies — write the reason next to them.

### 5. `Package.resolved` as lockfile literacy

Resolution writes **`Package.resolved`** — the lockfile-style record of **exact** package identities and versions chosen for this workspace.

| Habit | Why |
|-------|-----|
| Commit for apps / shipped tools | CI and humans share the same graph |
| Review diffs in PRs | Surprise majors show up as resolved churn |
| Libraries: team policy explicit | Some omit it; some commit it for examples/CI |
| Do not hand-edit casually | Regenerate via `swift package resolve` / update |

**What just happened.** Manifest ranges say what is *allowed*; `Package.resolved` says what was *chosen*. Deleting resolved to “fix CI” without understanding the new graph is how Monday incidents start. Treat it like any other lockfile: intentional updates, reviewed diffs.

### 6. Xcode vs CLI — same package

Xcode can open `Package.swift` directly (File → Open) or add the package to a workspace. The **same** manifest, sources, and ideally the **same** toolchain pin drive both GUI and `swift build`. Drift happens when Xcode’s selected Swift / SDK differs from CI’s command-line toolchain — pin both and document which Xcode version owns the truth for iOS apps (chapter **18** / **21**).

### 7. Lab — products hide helper targets

```text
Package ExampleKit
├── product ExampleKit  → target ExampleKit
├── target ExampleKit   → depends on ExampleInternals
├── target ExampleInternals   (NO product — not importable by apps)
└── testTarget ExampleKitTests → depends on ExampleKit
```

```swift
// ExampleInternals — package or internal helpers
package func scrub(_ s: String) -> String { s.trimmingCharacters(in: .whitespaces) }

// ExampleKit — public façade
public func normalize(_ s: String) -> String { scrub(s) }
```

**What just happened.** Clients `import ExampleKit` and never see `ExampleInternals`. That is how you keep the crate labeled while the packing foam stays inside. Pair with `package` access (chapter **11**) so helpers are not forced `public`.

---

## 2. Advanced concepts

### 1. Dependency resolution conflicts

SPM solves a graph. Conflicts appear when two packages demand incompatible versions of a shared dependency.

```text
App → LibA → Logging 1.5.x
App → LibB → Logging from: 1.6.0   // may still unify
App → LibC → Logging exact: 1.4.0  // often unsatisfiable with from: 1.6
```

**What to do**

1. `swift package show-dependencies` / resolve error text — find the diamond.
2. Widen or align requirements upstream (prefer fixing the strictest `exact:` / closed range).
3. Avoid stacking `branch:` deps that drift nightly.
4. As a last resort, fork + pin with a written reason — not silent URL swaps.

**What just happened.** Resolution is not “newest wins.” It is “find one version set everyone accepts.” Conflict errors are a design signal: your supply chain has incompatible contracts.

### 2. Binary targets and checksum verification habit

```swift
.binaryTarget(
    name: "SomeSDK",
    url: "https://example.com/SomeSDK.xcframework.zip",
    checksum: "a1b2c3…sha256…"
)
```

```bash
# Habit — compute checksum yourself before pasting vendor claims:
swift package compute-checksum SomeSDK.xcframework.zip
```

Treat binary targets as supply-chain surface: HTTPS, **checksum** verification, vendor identity, update cadence. A mismatched checksum fails the fetch — that is a feature. Vend local XCFrameworks when policy forbids remote blobs. **Never** “fix” a checksum mismatch by pasting a new hash without verifying the artifact bytes you intended.

### 3. Plugins and macros — trust surface

- **Build tool / command plugins** run during build or as invoked tools — powerful and sensitive (they execute code).
- **Macros** often ship as separate targets/packages your library depends on; clients inherit the macro plugin dependency graph.

```swift
dependencies: [
    .package(url: "https://github.com/apple/swift-syntax.git", from: "600.0.0"),
],
targets: [
    .macro(
        name: "ExampleMacros",
        dependencies: [
            .product(name: "SwiftSyntaxMacros", package: "swift-syntax"),
            .product(name: "SwiftCompilerPlugin", package: "swift-syntax"),
        ]
    ),
    .target(name: "ExampleKit", dependencies: ["ExampleMacros"]),
]
```

**Trust habit.** Review plugin packages like executable supply chain: who publishes, what permissions, pinned versions, least privilege. Do not enable unknown command plugins in CI without ownership. Macros are ordinary package deps from SPM’s point of view — plus a compile-time plugin. Minimize and pin.

### 4. Package traits enablement (Swift 6.1+)

Traits are **additive feature flags** for packages: conditional compilation (`#if TraitName`) and optional dependencies. Enabling a trait must not remove API.

```swift
// swift-tools-version: 6.2
let package = Package(
    name: "ExampleKit",
    traits: [
        .default(enabledTraits: []),
        .trait(name: "Networking", description: "URLSession-based clients"),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-log.git", from: "1.6.0"),
    ],
    targets: [
        .target(
            name: "ExampleKit",
            dependencies: [
                .product(
                    name: "Logging",
                    package: "swift-log",
                    condition: .when(traits: ["Networking"])
                ),
            ]
        ),
    ]
)
```

```bash
swift build --traits Networking
swift build --disable-default-traits
swift build --enable-all-traits
```

Consumers also enable traits when declaring a dependency (see PackageDescription for your tools version). CI matrices should cover default and “all traits” if you ship optional surfaces.

**What just happened.** Traits need a tools-version that understands them. Additive means: turn Networking on → more API/deps; never “Networking off deletes symbols clients already called” without a major version story.

### 5. Tools version vs language mode

`swift-tools-version` ≠ Swift language mode. You can build Swift 6 code with a tools version that understands the manifest APIs you need. Record both in README/CI: tools version, Swift compiler version, language mode (`swiftSettings` / Xcode build setting).

### 6. Mirrors and registries — caution

Organizations sometimes **mirror** dependencies or use a **package registry** so resolution does not depend solely on public Git hosts.

| Mechanism | Literacy |
|-----------|----------|
| **Mirror** | Rewrites where a package URL is fetched |
| **Registry** | Identity + version metadata; publish/consume policies |

**Caution.** Mirrors and registries are **policy and supply-chain** tools — not a substitute for binary checksums, HTTPS, or reviewing new deps. A misconfigured mirror can silently redirect fetches; treat mirror config as production infrastructure. Document who owns registry credentials and how CI authenticates.

### 7. Resources, settings, unsafeFlags

Targets can declare `resources:` (copied/processed). Use `swiftSettings` / `cSettings` for conditional compilation — keep flags documented. `unsafeFlags` disable SPM’s safety rails for clients — packages that require them cannot be depended on as ordinary versioned products in many contexts. Treat `unsafeFlags` as a packaging smell for libraries.

```swift
.target(
    name: "ExampleKit",
    resources: [
        .process("Resources"),
    ],
    swiftSettings: [
        .enableUpcomingFeature("StrictConcurrency"),
        .swiftLanguageMode(.v6),
    ]
)

// Legacy (unpinned branch dependency for production) — do not use in new shipped code.
// .package(url: "…", branch: "main")
// Prefer: from: "X.Y.Z" or an exact revision with documented reason
```

**What just happened.** Processed resources land in the bundle your code reads at runtime. Language mode in `swiftSettings` is how a package opts into Swift 6 checking even when a developer’s global defaults differ — still pin the *compiler* in CI.

### 8. Editable / local path dependencies (literacy)

```swift
.package(path: "../SiblingKit"),
```

Path deps are excellent for monorepos and forking work. They are terrible as unspoken production pins — CI must still resolve a graph everyone can fetch. Prefer URL + version for published packages; path for workspace-local development.

### 9. Lab — reading a conflict like an incident

```bash
swift package resolve
# error: Dependencies could not be resolved because …
#   'LibC' depends on 'Logging' exact 1.4.0
#   'LibB' depends on 'Logging' from 1.6.0
```

**Playbook**

1. Identify the **strictest** constraint (`exact:`, closed upper bound, ancient `from:`).
2. Check whether upgrading the strict package is safe (changelog / semver).
3. Prefer fixing upstream manifests over forever-forking.
4. If you must pin a fork: URL + `revision:` / `exact:` **and** a comment with ticket + owner.
5. Re-resolve; commit the new `Package.resolved` with the PR that changed the graph.

**What just happened.** Conflict text is a map, not a brick wall. Deleting `Package.resolved` and hoping CI “picks something” is how you get unreproducible greens.

### 10. Consumer-side trait enablement sketch

```swift
// In an *app* or downstream package that depends on ExampleKit:
dependencies: [
    .package(
        url: "https://github.com/example/ExampleKit.git",
        from: "1.0.0"
        // traits: ["Networking"]  // enable when PackageDescription on your tools-version supports it
    ),
],
```

```bash
# CLI enablement when developing ExampleKit itself:
swift build --traits Networking
swift test --traits Networking
```

Document which traits your product **requires** vs **optional**. CI should fail if a required trait’s tests never run.

### 11. Plugin trust — review questions

Before merging a new build/command plugin dependency:

| Question | Fail closed if… |
|----------|-----------------|
| Who publishes it? | Unknown org / personal fork with no review |
| What does it execute? | Undocumented shell / network at build time |
| Is it pinned? | Floating `branch: main` |
| Do clients inherit it? | Macro/plugin graphs pull surprise compile plugins |
| Can CI disable it? | No escape hatch for offline / restricted builders |

**What just happened.** Plugins are code that runs **on developer and CI machines**. Treat them like installing a CLI — not like adding a pure Swift function.

### 12. `Package.resolved` anatomy literacy

You do not need to memorize JSON keys — you need the review habit:

- Identity (URL / registry id) + **state** (version / revision)
- Diff shows **what actually changed** when someone ran `update`
- Two PRs that both touch resolved without coordinating will conflict — rebase deliberately

```bash
# After intentional bumps:
swift package update
git diff Package.resolved   # review like lockfile churn
```

### 13. Registry / mirror caution — ops sketch

```text
Developer resolves github.com/org/pkg
     │
     ▼
CI might use a mirror: git.internal/mirrors/org-pkg.git
     │
     ▼
Wrong mirror config → wrong bytes with a familiar version string
```

**Habit.** Document mirror maps next to toolchain pins. Rotate registry credentials. Never treat “it resolved” as “it is the artifact security reviewed.” Binary checksums still apply when you fetch zips.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | App workspace consumes packages; commit `Package.resolved` with the app; review resolved diffs |
| **Systems** | CLI tools as executable products; version the tools-version and CI Swift |
| **Security** | Audit new deps, binary checksums (`compute-checksum`), and plugins; least privilege for build tools; mirror/registry ownership clear |
| **Operations** | Cache SPM artifacts carefully; invalidate on toolchain bump; trait matrix in CI; conflict resolution documented |
| **Software engineering** | Thin public products; internal targets + `package` access; Xcode and CLI share pins |

---

## 4. Staff-level review checklist

- `swift-tools-version` matches required manifest APIs; CI uses a compatible toolchain.
- Manifest includes intended library / executable / test layout; products expose only intended modules.
- Dependencies use semver ranges/`from:`; `exact:` and revisions have a written reason; branches only with exception.
- Resolution conflicts are fixed by aligning contracts — not by deleting locks blindly.
- `Package.resolved` policy is clear and followed (especially for apps); diffs reviewed.
- Binary targets carry checksums verified with `swift package compute-checksum`.
- Plugins / macros are justified, pinned, and reviewed like executable supply chain.
- Traits (if used) are additive; CI covers meaningful trait combinations.
- Mirrors/registries have owners and do not replace checksum/review habits.
- Platforms declared in the manifest match what you actually test.
- Xcode and CLI builds share an intentional toolchain pin.
- No unexplained `unsafeFlags` on library products.
- Plugin/macro trust questions answered before merge.
- Consumer trait requirements documented and covered in CI.

---

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Package Manager Docs](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- [PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription)
- [Trait](https://docs.swift.org/swiftpm/documentation/packagedescription/trait/)
- [Swift.org — getting started](https://www.swift.org/getting-started/)
- [Swift.org — install](https://www.swift.org/install/)
- [Swift.org blog](https://www.swift.org/blog/) (SPM / traits announcements)
