# Use cases — scripts, packages, apps, and server glance

[← Back to Swift](./README.md)

## What this chapter covers

A **gallery** of where Swift shows up as an engineering job: map the work to **scripts**, **packages**, **apps**, or **tools**, with mini architecture sketches and a **glance** at Server Swift (NIO/Vapor as doors only). Not a Vapor encyclopedia, not App Store marketing, not a UI design book. Default for new code: **Swift 6.3.x**.

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

### 2. Richer job → shape matrix

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

### 3. Mini architecture sketches

#### A. Script glue

```text
human / cron / CI step
    → swift rewrite.swift < input.json > output.json
         (no Package.swift yet)

Graduate when: second consumer, tests, or Linux CI.
```

#### B. CLI tool (SPM executable)

```text
Package.swift
  product: executable Myctl
  target: Myctl → depends on MyDomain
  target: MyDomain (library)
  tests: MyDomainTests

CI (Linux): swift test && swift run Myctl --help
```

#### C. Shared package

```text
MyDomain/          ← versioned, DocC, Swift Testing
  Models, validation, clients
Apps / CLIs import MyDomain
No SwiftUI / UIKit types leak into MyDomain
```

#### D. iOS app module

```text
MyApp.xcodeproj
  App target (SwiftUI/UIKit — ch 19)
  Unit / UI tests
Packages/
  MyDomain/        ← models, validation, API client
  MyFeatureUI/     ← optional SwiftUI views as a package if reused
```

UI stays thin. Domain bugs get fixed once.

#### E. Server glance (doors only)

```text
Linux container (pinned swift image)
  → executable Service
       → MyDomain (same models as mobile when justified)
       → HTTP framework layer (Vapor / Hummingbird / …)
            → SwiftNIO under many stacks (event-loop literacy)

This track: pin + package discipline.
Deep framework manuals: Swift on Server door (ch 24).
```

### 4. Whole-engineering lenses on the same idea

Take “validate a config file” as an example:

| Lens | Manifestation |
|------|----------------|
| **Application** | Menu item in a Mac app calls the validator |
| **Systems** | Same package runs on Linux CI as a gate |
| **Security** | Reject secrets patterns; do not log sensitive fields |
| **Operations** | Exit codes + metrics for the gate |
| **Software engineering** | Swift Testing suite; DocC for the public API |

One package; five honest homes. That is the point of SPM discipline (chapter **14**).

---

## 2. Advanced concepts

### 1. Script → package graduation criteria

Graduate when any of these hit:

- second consumer,
- need for tests in CI,
- need for versioning,
- PATH distribution to teammates,
- Linux runner must run it.

Leaving a 400-line `misc.swift` in a wiki is how tools rot.

### 2. Server Swift — glance / compass only

Swift on the server is real: Linux toolchains, HTTP stacks, and cloud deploy patterns live under [Swift on Server](https://www.swift.org/server/).

| Name you will hear | Treat as |
|--------------------|----------|
| **SwiftNIO** | Low-level event-driven networking — foundation under many servers |
| **Vapor** / **Hummingbird** / others | Application frameworks — pick via server docs, not this chapter |
| **Static Linux SDK** / container images | Pin story (chapters **02** / **03**) |

Framework names move; the **questions** stay:

| Question | Why it matters |
|----------|----------------|
| Which **Swift** / Linux image is pinned? | Same pin literacy as chapter **02** / **03** |
| How do you **test** and **observe**? | Health checks, structured logs |
| How do you ship? | Containers / services — ops track adjacent |
| What stays in a portable package? | Domain logic shared with apps when justified |

**Handoff:** this track ends at “you can read and pin Server Swift.” Building production microservices is a **door** (chapter **24**), not a missing chapter here.

### 3. Security and ops use cases (in scope)

| Use case | Swift’s job |
|----------|-------------|
| Internal Mac admin helper | Signed CLI; Keychain for tokens (ch **20**) |
| Policy checker in CI | Package + `swift test` / executable exit codes |
| Privacy-sensitive mobile feature | Entitlements + privacy manifest literacy; logic in reviewable modules |
| Supply-chain review aid | Pin audits of `Package.resolved` — process, not a magic app |

### 4. Legacy shapes to recognize

| Fossil | Move toward |
|--------|-------------|
| All logic in the app target | Extract packages |
| CocoaPods-only for reusable code when SPM fits | SPM for new modules (brownfield Pods: migrate edges) |
| “Server” as a single untested Mac CGI | Linux package + real framework docs |
| Copy-pasted networking in every view | One client module |

### 5. Lab — pick a shape for three tickets

Write the shape + sketch in one line each:

1. “Normalize CSV for finance” → ?
2. “Login screen + token storage” → ?
3. “HTTP JSON API shared with iOS” → ?

Compare with a teammate. Disagreement means the nouns aren’t shared yet—fix vocabulary before coding.

---

## 3. Applications and use cases

### Gallery (short)

1. **DTO + JSON decode package** shared by app and CLI importer.
2. **macOS menu-bar tool** (AppKit/SwiftUI) calling a local package for file ops.
3. **iOS feature module** as SwiftUI + domain package; UIKit host in brownfield.
4. **CI gate executable** failing PRs on schema violations.
5. **DocC** for the internal package used by three squads (chapter **17**).
6. **Server glance:** Linux `swift build` of an HTTP service skeleton — then leave for server docs.
7. **Release engineering:** fastlane lane owns upload; Swift owns product code.

| Lens | Anti-pattern |
|------|--------------|
| **Application** | Rewriting domain rules in the view for “speed” |
| **Systems** | Assuming Mac-only Foundation APIs in a “portable” package |
| **Security** | Shipping prod secrets inside the app binary “for convenience” |
| **Operations** | One red CI job that mixes unit, UI, and deploy with no labels |
| **Software engineering** | No tests because “it’s just glue” |

---

## 4. Staff-level review checklist

- [ ] New work picked **script / package / app / tool lane** on purpose.
- [ ] Shared logic lives in a package when a second consumer exists (or clearly will).
- [ ] App PRs do not grow unbounded business rules inside views.
- [ ] Portable packages are not silently Apple-only without declaring it.
- [ ] Server Swift work has an explicit handoff owner and pin story — not pretend coverage from this chapter.
- [ ] NIO/Vapor mentions are treated as **doors**, not invented deep dives here.
- [ ] CI shape matches the artifact (Linux vs Mac) — chapter **21**.
- [ ] Security-sensitive use cases cite signing/privacy habits from chapter **20**.
- [ ] Team can explain why *this* ticket was not a Bash one-liner — or admit it should have been Shell track work.

---

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift on Server](https://www.swift.org/server/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
- [SwiftUI](https://developer.apple.com/documentation/swiftui) (app surface — literacy)
- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [fastlane docs](https://docs.fastlane.tools/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
