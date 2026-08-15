# Whole-engineering wrap and staff checklist

[← Back to Swift](./README.md)

## What this chapter covers

A **competency map** and **sign-off list** for the Swift track. Use it after **00–22**, not instead of them. Default pin: **Swift 6.3.x** language mode for new work; record the **Xcode / SDK** (and Linux toolchain) your CI actually runs.

If chapter **00** was “hello prints,” this page is “I could explain that hello — and a package pin, a race, a scheme, and a signing secret — to the person who has to live with it.”

---

## 1. Concepts — you are fluent when…

You are fluent when you can walk a new hire through this story without notes:

> We pin a **toolchain** and a **language mode**. We write **Swift** that treats optionals and errors as real, prefers **value types** for data, and takes **concurrency checking** seriously under Swift 6. Shared logic lives in **packages**. Apps are **schemes** that link those packages, with **signing**, **privacy manifests**, and **Mac CI** as part of done. UI frameworks are a **surface**; design systems are a different job. Server, Wasm, Android SDK, and Embedded are **doors**—same language, different pins.

You are fluent when you can:

1. Explain **language vs toolchain vs SDK vs scheme** to a new hire.
2. Pin **Swift language mode** and show `swift --version` / `xcodebuild -version` for the environment.
3. Read production Swift: optionals, value vs reference, errors, protocols/generics at review depth.
4. Reason about **async/await, actors, Sendable**, and what Swift 6 checking is trying to prevent.
5. Own **SPM** graphs: products, targets, pins, and supply-chain caution.
6. Run and interpret **Swift Testing** (and XCTest coexistence) in CI.
7. Name the **Xcode scheme** CI invokes and where signing secrets live.
8. Say **no** to secrets in git, unsigned “release” folklore, and UI rewrites that ignore brownfield.
9. Point to chapter **24** for adjacent doors without pretending this track covered them.

REPL-only fluency is chapter **00**. Staff fluency is this list.

---

## 2. Advanced concepts — brownfield you must still survive

You will open Swift 5-mode modules, UIKit-only apps, CocoaPods workspaces, XCTest-only suites, and manual signing. Treat them as **translation problems**:

- map completion handlers toward `async` when you touch the code,
- introduce SPM modules at boundaries instead of pasting,
- turn on stricter concurrency in slices with a migration plan,
- document Xcode pins before blaming application code,
- do not copy fossil patterns into new targets.

### Formulas / facts you should be able to say out loud

```text
swift --version          → compiler identity (not always the language mode)
SWIFT_VERSION / mode     → language rules (5 vs 6 concurrency checking)
xcodebuild -scheme S     → CI contract for apps (shared scheme)
Package.resolved         → what SPM actually pinned
@MainActor UI updates    → UI frameworks expect main-actor application of state
@Observable vs ObservableObject → modern Observation vs legacy-common Combine models
codesign / profiles      → attest the app; secrets stay out of git
PrivacyInfo.xcprivacy    → declare certain APIs / tracking realities for deps + app
ASC API key / match      → CI signing auth patterns (ch 20–21)
```

**Also say out loud:** value types copy; classes share identity; `weak` breaks ARC cycles; `Task {}` unstructured concurrency needs a reason; ATS exceptions are waivers; macOS CI minutes are not free; DerivedData is not a release procedure.

### Track arc in one glance

| Phase | Chapters | You should be able to… |
|-------|----------|------------------------|
| Doorway / orientation | **00–03** | Reproduce three hellos; name the pin; find the toolchain |
| Language core | **04–09** | Read production Swift without guessing |
| Systems | **10–13** | Review races, memory, stdlib/Foundation use |
| Engineering surface | **14–17** | Ship libraries with tests and docs |
| Apple ship | **18–21** | Schemes, UI literacy, signing, CI trains |
| Gallery + wrap | **22–23** | Pick shapes; sign this checklist |
| Compass | **24** | Name adjacent doors without fake coverage |

If you cannot defend the formulas above, revisit **02**, **06**, **10–11**, **14**, **18–21** — not another UI tutorial.

### Common false-confidence traps

| Trap | Why it feels true | What fluent engineers do |
|------|-------------------|--------------------------|
| “We’re on Swift 6” because Xcode is new | Toolchain ≠ language mode | Print `SWIFT_VERSION` / mode per target |
| “It builds on my Mac” | Personal schemes, local DerivedData, cached SPM | Reproduce with shared scheme + clean CI image |
| “Previews passed” | Canvas ≠ signed artifact | Require `xcodebuild test` / archive gates |
| “UIKit is obsolete” | Marketing timeline ≠ brownfield | Host SwiftUI islands; migrate with boundaries |
| “SPM lockfiles are noise” | Resolution drift is real | Review `Package.resolved` like deps |
| “Secrets in the app are fine if obfuscated” | Extractable is extractable | Backend auth; Keychain for session tokens |
| “Linux CI covers the iOS app” | Wrong artifact class | Separate package vs app jobs |
| “I’ll document public API later” | Later never comes | DocC / `///` as merge gate (ch **17**) |
| “Server/Wasm/Android is just Swift” | Same grammar, different pins/SDKs | Use chapter **24** doors |

### Brownfield fossils

| You see | You translate |
|---------|----------------|
| Swift 5 language mode everywhere forever | Plan Swift 6 mode per target (ch **02**, **10**) |
| Force-unwrap culture | `guard` / `throws` / honest optionals (ch **04**, **09**) |
| All logic in view controllers / `body` | Domain packages (ch **19**, **22**) |
| XCTest only for new packages | Prefer Swift Testing for new suites (ch **16**) |
| Personal Xcode schemes in CI | Shared schemes (ch **18**) |
| Secrets in `Constants.swift` | CI secret store (ch **20**) |
| Unpinned `macos-latest` + mystery Xcode | Pin image + Xcode (ch **21**) |

---

## 3. Applications — sign-off by lens

| Lens | You can show |
|------|----------------|
| **Application** | A small feature with clear state ownership and tested domain logic |
| **Systems** | A package that builds on the team’s Linux and/or Mac pins |
| **Security** | Threat-aware review: Keychain/session, entitlements, privacy manifests, no secrets in git |
| **Operations** | Documented CI command, artifact signing path, TestFlight/notarize literacy, rotation owners |
| **Software engineering** | Tests + formatting/lint policy + DocC or equivalent API notes for public modules |

Deep-study leftovers from earlier chapters: finish them before signing this page.

---

## 4. Staff-level review checklist (track sign-off)

### Doorway and orientation

- [ ] Three hellos reproducible (REPL/script/package) on the target OS — ch **00**.
- [ ] Team distinguishes language / toolchain / SDK / product — ch **01**.
- [ ] Language mode vs compiler vs tools version vs Xcode explained — ch **02**.
- [ ] CI can answer “which `swift` is on PATH?” with evidence — ch **03**.

### Language and concurrency

- [ ] New code targets **Swift 6.3.x** narrative (or documented waiver + mode).
- [ ] Optionals and errors are handled; force-unwrap and empty `catch` need justification.
- [ ] Value vs reference choices are intentional; no accidental shared mutable state.
- [ ] Concurrency: actors/isolation/`Sendable` understood; unstructured tasks justified.
- [ ] ARC cycles (`strong` capture lists) reviewed on closures/delegates.
- [ ] Macros / Observation literacy known as modern tools (deep craft in **08** / **10** / **19**).

### Toolchain and packages

- [ ] `swift --version` / `xcodebuild -version` recorded for CI images.
- [ ] SPM pins reviewed; binary targets and plugins treated as trust boundaries.
- [ ] Public module surface is deliberate (`public` / `package` access) — ch **11**, **14**, **15**.
- [ ] DocC or equivalent exists for libraries other teams import — ch **17**.

### Quality

- [ ] New tests prefer **Swift Testing**; XCTest coexistence understood — ch **16**.
- [ ] CI runs the same test command developers can run locally.
- [ ] Flaky simulator/UI tests quarantined with owners — not ignored forever.

### Apple ship lane

- [ ] Shared scheme + xcconfig / `SWIFT_VERSION` match what humans and CI use — ch **18**.
- [ ] UI PRs name SwiftUI/UIKit/AppKit, state ownership, navigation owner — ch **19**.
- [ ] Signing, entitlements, privacy manifests, ATS waivers reviewed — ch **20**.
- [ ] Xcode Cloud and/or Mac runners + fastlane roles documented; Xcode **pinned**; TestFlight gate known — ch **21**.
- [ ] Secrets only in secret stores; rotation owners named.

### Use cases and scope honesty

- [ ] Use-case choices from chapter **22** match how the team actually builds (script vs package vs app).
- [ ] This repo is not pretending to be a full SwiftUI design course or Server Swift encyclopedia.
- [ ] Adjacent doors (server, Wasm, Android SDK, embedded, C++ interop, FilePath era) point at chapter **24**, not fake coverage.
- [ ] Shell/CI YAML depth defers to the Shell track except Swift-on-runner specifics.

### Hire / review bar (optional org standard)

Use this track as a **shared vocabulary** in interviews and PR templates:

- Can the candidate explain language mode vs compiler version?
- Can they sketch a CI command for *your* scheme?
- Can they refuse secrets-in-repo and unsigned “ship it from my laptop”?
- Can they name one false-confidence trap they’ve seen?

You do not need every checkbox for a junior hire. You do need the vocabulary so seniors and juniors argue about the **same nouns**.

When the boxes that apply to *your* system are checked, the track has done its job for **shipping Swift**. For **where the language and adjacent platforms are moving**, sign chapter **24** as well. Revisit **02** on every toolchain bump, **10** on concurrency incidents, **20–21** on every release train change, and **24** when someone proposes Wasm/Android/server as “just Swift.”

---

## References

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift Testing](https://developer.apple.com/documentation/testing)
- [Observation](https://developer.apple.com/documentation/observation)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Code signing](https://developer.apple.com/support/code-signing/)
- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Track README](./README.md)
- [Where Swift is going — chapter 24](./24_Where_Swift_Is_Going_And_Adjacent_Doors.md)
