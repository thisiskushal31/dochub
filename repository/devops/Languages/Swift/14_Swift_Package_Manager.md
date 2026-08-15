# Swift Package Manager

[← Back to Swift](./README.md)

## What this chapter covers

**`Package.swift`** walkthrough, **products vs targets**, **tools-version**, **version requirements / Exact pins**, **binary targets & checksums**, **plugins + macros** as package deps, **package traits** literacy, **`swift build` / `test` / `run`**, **mirrors/registries** high-level, and **Xcode vs CLI** on the same package. Default toolchain narrative: **Swift 6.3.x** / Swift 6 language mode for new packages.

SPM is the standard way to build libraries and tools outside (and inside) Xcode. App projects may still be `.xcodeproj`-first (chapter **18**); libraries and CLI tools should be fluent in packages. Think of a package as a **shipping crate**: targets are compartments, products are the labeled goods customers can buy, and `Package.resolved` is the packing list of exact versions that went in this shipment.

---

## 1. Concepts

### 1. Lab — full `Package.swift` walkthrough

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
            dependencies: ["ExampleKit"]
        ),
        .testTarget(
            name: "ExampleKitTests",
            dependencies: ["ExampleKit"]
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
| `targets` | Build units / modules |

**What just happened.** The tools version at the top is not decorative — older SwiftPM rejects manifests that use newer APIs. Pin it deliberately when you adopt traits, new settings, or plugin APIs.

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

### 5. Pin files and reproducible builds

Resolution writes **`Package.resolved`** (lock-style pins). Commit it for apps and shipped tools so CI and developers share the same graph. Libraries sometimes omit it — team policy should be explicit either way.

**What just happened.** Manifest ranges say what is *allowed*; `Package.resolved` says what was *chosen*. Reviewing resolved diffs is how you catch surprise major bumps before they hit production.

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

### 1. Binary targets and checksum supply-chain

```swift
.binaryTarget(
    name: "SomeSDK",
    url: "https://example.com/SomeSDK.xcframework.zip",
    checksum: "a1b2c3…sha256…"
)
```

Treat binary targets as supply-chain surface: HTTPS, **checksum** verification, vendor identity, update cadence. A mismatched checksum fails the fetch — that is a feature. Vend local XCFrameworks when policy forbids remote blobs.

### 2. Plugins and macros as package dependencies

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

**What just happened.** Macros are ordinary package deps from SPM’s point of view — plus a compile-time plugin. Review macro packages like you review build plugins: trust, pin, minimize.

### 3. Package traits literacy (Swift 6.1+)

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

**What just happened.** Consumers opt into traits when they depend on you (or via CLI flags). Traits need a tools-version that understands them. CI matrices should cover default and “all traits” if you ship optional surfaces.

### 4. Tools version vs language mode

`swift-tools-version` ≠ Swift language mode. You can build Swift 6 code with a tools version that understands the manifest APIs you need. Record both in README/CI: tools version, Swift compiler version, language mode (`swiftSettings` / Xcode build setting).

### 5. Mirrors and registries (high-level)

Organizations sometimes **mirror** dependencies or use a **package registry** so resolution does not depend solely on public Git hosts. Literacy: mirrors rewrite where a package URL is fetched; registries provide identity and version metadata. Policy for mirrors/registries belongs next to supply-chain review — not as a substitute for checksums on binaries.

### 6. Resources, settings, unsafeFlags

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

### 7. Editable / local path dependencies (literacy)

```swift
.package(path: "../SiblingKit"),
```

Path deps are excellent for monorepos and forking work. They are terrible as unspoken production pins — CI must still resolve a graph everyone can fetch. Prefer URL + version for published packages; path for workspace-local development.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | App workspace consumes packages; commit `Package.resolved` with the app |
| **Systems** | CLI tools as executable products; version the tools-version and CI Swift |
| **Security** | Audit new deps, binary checksums, and plugins; least privilege for build tools |
| **Operations** | Cache SPM artifacts carefully; invalidate on toolchain bump; trait matrix in CI |
| **Software engineering** | Thin public products; internal targets + `package` access; Xcode and CLI share pins |

---

## 4. Staff-level review checklist

- [ ] `swift-tools-version` matches required manifest APIs; CI uses a compatible toolchain.
- [ ] Products expose only intended modules; test targets are not products.
- [ ] Dependencies use semver ranges/`from:`; `exact:` and revisions have a written reason; branches only with exception.
- [ ] `Package.resolved` policy is clear and followed (especially for apps).
- [ ] Binary targets carry checksums and a trust story.
- [ ] Plugins / macros are justified, pinned, and reviewed like executable supply chain.
- [ ] Traits (if used) are additive; CI covers meaningful trait combinations.
- [ ] Platforms declared in the manifest match what you actually test.
- [ ] Xcode and CLI builds share an intentional toolchain pin.
- [ ] No unexplained `unsafeFlags` on library products.

---

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Package Manager Docs](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)
- [PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription)
- [Trait](https://docs.swift.org/swiftpm/documentation/packagedescription/trait/)
- [Swift.org — getting started](https://www.swift.org/getting-started/)
- [Swift.org — install](https://www.swift.org/install/)
