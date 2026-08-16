# Use cases — scripts, packages, apps, and server glance

[← Back to Swift](./README.md)

## What this chapter covers

A **gallery** of where Swift shows up as an engineering job: map the work to **scripts**, **packages**, **apps**, or **tools**, with **worked use-case sketches** (pins and risks). Server Swift (NIO/Vapor) remains a **glance / door**. Not a Vapor encyclopedia, not App Store marketing, not a UI design book. Default for new code: **Swift 6.3.x**.

Chapters **00–21** taught the machine. This chapter answers: *which shape should this ticket become?*

---

## 1. Concepts

### 1. Pick the smallest honest shape

| Shape | Use when | Avoid when |
|-------|----------|------------|
| **Script** (`swift file.swift` or tiny executable) | One-off transforms, glue, teaching | Shared libraries, long-lived products |
| **Package** (SPM library / executable) | Reuse, tests, Linux CI, clear modules | You need App Store packaging as the *primary* artifact |
| **Xcode app target** | UI + Apple SDK product to devices/store | Pure logic that should be a package |
| **Tooling lane** (fastlane, `xcodebuild` wrappers) | Build/release automation | Business logic living only in Ruby/Bash when Swift packages fit |

Staff habit: if three apps need the same validation code, it wants a **package**, not a fourth paste.

### 2. Job → shape matrix (quick map)

| Job | Prefer | Mini architecture sketch |
|-----|--------|--------------------------|
| Parse logs / rewrite JSON on a Mac | Script → graduate to executable package | `tools/rewrite.swift` → later `Package.swift` executable |
| Shared networking models for iOS + Mac | SPM library | `MyDomain` ← imported by app + CLI |
| CLI for internal operators | SPM executable (`swift run`) | `Sources/Myctl` + `Tests` + Linux CI |
| Customer iOS/macOS product | App target + packages for domain logic | App shell → feature UI → domain packages |
| Widget / extension | App target family; shared package for models | Extension target links `MyDomain` only |
| CI release train | fastlane / Xcode Cloud / `xcodebuild` | Lane owns upload; Swift owns product |
| HTTP API on Linux | Server Swift frameworks | Domain package + thin HTTP layer (doors below) |
| Policy / schema gate in CI | SPM executable | Exit codes + `swift test` |
| Brownfield ObjC + Swift | Mixed target; boundaries reviewed | Swift packages at edges; ObjC stays until migrated |

### 3. Whole-engineering lenses on one idea

Take “validate a config file”:

| Lens | Manifestation |
|------|----------------|
| **Application** | Menu item in a Mac app calls the validator |
| **Systems** | Same package runs on Linux CI as a gate |
| **Security** | Reject secrets patterns; do not log sensitive fields |
| **Operations** | Exit codes + metrics for the gate |
| **Software engineering** | Swift Testing suite; DocC for the public API |

One package; five honest homes. That is the point of SPM discipline (chapter **14**).

---

## 2. Advanced concepts — worked use-case sketches

Each sketch lists **pins** (what you must record) and **risks** (what usually bites).

### 1. Script glue — one-file transform

```text
human / cron / CI step
    → swift rewrite.swift < input.json > output.json
         (no Package.swift yet)
```

| Pins | Risks |
|------|-------|
| `swift --version` on the machine that runs it | PATH picks a different Swift than CI |
| Input/output contract (stdin/argv) | Silent format drift; no tests |
| Shebang / wrapper if distributed | “Works in my cwd” absolute paths |

**Graduate when:** second consumer, need for tests, Linux CI, or PATH distribution. Leaving a 400-line `misc.swift` in a wiki is how tools rot.

### 2. CLI tool — SPM executable

```text
Package.swift
  product: executable Myctl
  target: Myctl → depends on MyDomain
  target: MyDomain (library)
  tests: MyDomainTests

CI (Linux): swift test && swift run Myctl --help
```

| Pins | Risks |
|------|-------|
| Swift **6.3.x** (or documented mode) in CI image | Language mode drift vs laptop Xcode |
| `Package.resolved` reviewed | Dependency surprise on clean agents |
| Exit codes documented | Ops treats every failure as “crash” |

**Staff habit:** put parsing/validation in `MyDomain`; keep `Myctl` as a thin argv shell.

### 3. Shared kit — SPM library for multiple apps

```text
MyDomain/          ← versioned, DocC, Swift Testing
  Models, validation, clients
Apps / CLIs import MyDomain
No SwiftUI / UIKit types leak into MyDomain
```

| Pins | Risks |
|------|-------|
| Semantic version + DocC for public API (ch **17**) | Silent `public` surface explosion |
| Platforms declared in `Package.swift` | Accidental UIKit import breaks Linux CI |
| Swift Testing for new suites (ch **16**) | “We’ll test in the app” never happens |

**Anti-pattern:** copying DTOs into each app “temporarily.”

### 4. iOS feature module — app shell + domain + UI package

```text
MyApp.xcodeproj / .xcworkspace
  App target (SwiftUI/UIKit — ch 19)
  Unit / UI tests
Packages/
  MyDomain/        ← models, validation, API client
  MyFeatureUI/     ← optional SwiftUI views as a package if reused
```

| Pins | Risks |
|------|-------|
| Shared scheme + `SWIFT_VERSION` (ch **18**) | Personal scheme CI folklore |
| Simulator destination in CI (ch **21**) | Preview-only “green” |
| Observation / state ownership (ch **19**) | Logic trapped in `body` |
| Signing / privacy for the **app** (ch **20**) | Feature package forgets PrivacyInfo impact of new APIs |

UI stays thin. Domain bugs get fixed once.

### 5. macOS utility — menu bar / small AppKit or SwiftUI tool

```text
MyMacUtil.app (Xcode target)
  → links MyDomain for file ops / parsing
  → AppKit or SwiftUI surface (ch 19)
  → optional Developer ID + notarize/staple if distributed outside MAS (ch 21)
```

| Pins | Risks |
|------|-------|
| Xcode + macOS SDK on CI | “Built on my Mac” release |
| Notarization story if outside Mac App Store | Gatekeeper failures for customers |
| Keychain for tokens (ch **20**) | Hard-coded API keys in the binary |
| Sandbox / hardened runtime entitlements | Missing entitlement = mysterious runtime deny |

### 6. Server glance — Linux HTTP service (door, not encyclopedia)

```text
Linux container (pinned swift image)
  → executable Service
       → MyDomain (same models as mobile when justified)
       → HTTP framework layer (Vapor / Hummingbird / …)
            → SwiftNIO under many stacks (event-loop literacy)

This track: pin + package discipline.
Deep framework manuals: Swift on Server door (ch 24).
```

| Pins | Risks |
|------|-------|
| Container image tag / Swift version | Floating `latest` |
| Linux CI `swift test` | Assuming Foundation Mac-only APIs are portable |
| Health check + structured logs | “It’s up” folklore |
| Framework choice documented | Rewriting this chapter as a Vapor book |

**Handoff:** you can read and pin Server Swift; production microservices live behind [Swift on Server](https://www.swift.org/server/).

### 7. Linux CI package — portable gate in the pipeline

```text
PR opened
  → Linux job: swift test (and/or swift run PolicyGate)
  → Mac job (separate): xcodebuild test for the app
```

| Pins | Risks |
|------|-------|
| `swift:6.3` (or org image) digest/tag | Image drift |
| No Apple-only imports in portable targets | “Green on Mac, red on Linux” surprise |
| Cache keyed by toolchain + `Package.resolved` (ch **21**) | Poisoned `.build` after bump |
| Exit codes for gates | CI marks red without actionable message |

Use Linux minutes for portable packages; reserve macOS for SDK/app work.

### 8. Brownfield ObjC mix — incremental Swift at the edges

```text
Existing ObjC app target
  → bridging header / modules (ch 15)
  → new feature as Swift files or Swift package linked in
  → UIKit host + optional SwiftUI island (ch 19)
  → do not big-bang rewrite
```

| Pins | Risks |
|------|-------|
| Module map / bridging header ownership | Circular imports; unclear nullability |
| Nullability annotations on ObjC boundary | Implicitly unwrapped traps in Swift |
| Language mode per target | Swift 6 checking only on new targets first |
| Test plan includes both ObjC and Swift suites | “Swift is tested” while ObjC paths rot |

**Staff rule:** Swift packages for new domain logic; ObjC stays until a touch-point justifies migration. Interop literacy is chapter **15**—this sketch only picks the shape.

### 9. Script → package graduation criteria

Graduate when any of these hit: second consumer, need for tests in CI, need for versioning, PATH distribution, Linux runner must run it.

### 10. Legacy shapes to recognize

| Fossil | Move toward |
|--------|-------------|
| All logic in the app target | Extract packages |
| CocoaPods-only for reusable code when SPM fits | SPM for new modules (brownfield Pods: migrate edges) |
| “Server” as a single untested Mac CGI | Linux package + real framework docs |
| Copy-pasted networking in every view | One client module |
| ObjC/Swift soup with no boundary | Explicit modules + nullability |

### 11. Comparing sketches — decision card

When two engineers disagree on shape, fill this before coding:

```text
Ticket: ________________________________
Consumers today / in 90 days: __________
Needs Apple SDK UI?     [ ] yes  [ ] no
Needs store signing?    [ ] yes  [ ] no
Must run on Linux CI?   [ ] yes  [ ] no
Shared with 2nd app?    [ ] yes  [ ] soon  [ ] no
ObjC boundary involved? [ ] yes  [ ] no

Chosen shape: [ ] script [ ] SPM lib [ ] SPM exe [ ] app target [ ] hybrid
Pins to record: ________________________________
Top risk: _____________________________________
Handoff door (if server/Wasm/…): ch 24 / ________
```

### 12. Lab — pick a shape for three tickets

Write the shape + sketch + one pin + one risk in one line each:

1. “Normalize CSV for finance” → ?
2. “Login screen + token storage” → ?
3. “HTTP JSON API shared with iOS” → ?

**Example answers (not dogma):**

| Ticket | Shape | Pin | Risk |
|--------|-------|-----|------|
| Normalize CSV | Script → graduate to SPM exe when second team uses it | `swift --version` on CI | Untested one-off bit-rots |
| Login + token | App feature + Keychain service module | Scheme + privacy/signing | Tokens in `@State` / git |
| Shared HTTP JSON API | SPM `MyDomain` + thin app client | `Package.resolved` + Linux `swift test` | UIKit types leaking into “portable” kit |

Compare with a teammate. Disagreement means the nouns aren’t shared yet—fix vocabulary before coding.

### 13. Security and ops use cases (in scope)

| Use case | Swift’s job |
|----------|-------------|
| Internal Mac admin helper | Signed CLI; Keychain for tokens (ch **20**) |
| Policy checker in CI | Package + `swift test` / executable exit codes |
| Privacy-sensitive mobile feature | Entitlements + privacy manifest literacy; logic in reviewable modules |
| Supply-chain review aid | Pin audits of `Package.resolved` — process, not a magic app |
| Release engineering | fastlane/Xcode Cloud owns upload; product code stays in Swift packages |

---

## 3. Applications and use cases

### Gallery (short)

1. **DTO + JSON decode package** shared by app and CLI importer.
2. **macOS menu-bar tool** calling a local package for file ops (+ notarize if needed).
3. **iOS feature module** as SwiftUI + domain package; UIKit host in brownfield.
4. **CI gate executable** failing PRs on schema violations (Linux).
5. **DocC** for the internal package used by three squads (chapter **17**).
6. **Server glance:** Linux `swift build` of an HTTP service skeleton — then leave for server docs.
7. **Release engineering:** fastlane lane owns upload; Swift owns product code.
8. **ObjC mix:** Swift package at the edge; bridging reviewed.

### Anti-patterns by lens

| Lens | Anti-pattern | Prefer |
|------|--------------|--------|
| **Application** | Rewriting domain rules in the view for “speed” | Domain package + thin UI |
| **Systems** | Assuming Mac-only Foundation APIs in a “portable” package | Declare platforms; Linux CI |
| **Security** | Shipping prod secrets inside the app binary “for convenience” | Backend auth + Keychain session |
| **Operations** | One red CI job that mixes unit, UI, and deploy with no labels | Named gates (ch **21**) |
| **Software engineering** | No tests because “it’s just glue” | Graduate to package + Swift Testing |

### When *not* to use Swift

| Better elsewhere | Why |
|------------------|-----|
| One-line `jq` / shell pipe | Shell track — don’t invent a package for pride |
| Pure IaC (Terraform/HCL) | HCL track — Swift is not your cloud DSL |
| Smart-contract on-chain logic | Solidity (or relevant) track |
| Deep server product with existing Go/Java shop | Server Swift only with an owner + pin story |

**Staff closing line:** shape first, pins second, risks third—then code. Chapter **24** catches anything that is “Swift grammar on a different planet.”

### Worked answer key for the lab (expand in discussion)

Do not treat these as the only correct answers—treat them as **shared nouns**:

- Finance CSV → start **script**; graduate to **SPM executable** when Finance asks for a second format or Linux CI.
- Login + token → **app feature module** + Keychain-backed session type in a package; never `Constants.token`.
- Shared HTTP JSON → **SPM library** with Codable models; app and server (if any) import it; UI stays out.

---

## 4. Staff-level review checklist

- New work picked **script / package / app / tool lane** on purpose.
- Worked sketch (or equivalent) names **pins** and **risks**, not only a folder tree.
- Shared logic lives in a package when a second consumer exists (or clearly will).
- App PRs do not grow unbounded business rules inside views.
- Portable packages are not silently Apple-only without declaring it.
- Server Swift work has an explicit handoff owner and pin story — not pretend coverage from this chapter.
- NIO/Vapor mentions are treated as **doors**, not invented deep dives here.
- Linux CI package jobs stay separate from Mac app jobs when both exist.
- Brownfield ObjC mixes have a boundary plan (nullability, modules)—not random `@objc` sprinkles.
- macOS utilities distributed outside MAS have signing/notarize literacy when required.
- CI shape matches the artifact (Linux vs Mac) — chapter **21**.
- Security-sensitive use cases cite signing/privacy habits from chapter **20**.
- Team can explain why *this* ticket was not a Bash one-liner — or admit it should have been Shell track work.

---

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift on Server](https://www.swift.org/server/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
- [SwiftUI](https://developer.apple.com/documentation/swiftui) (app surface — literacy)
- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [fastlane docs](https://docs.fastlane.tools/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Importing Objective-C into Swift](https://developer.apple.com/documentation/swift/importing-objective-c-into-swift)
- [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
