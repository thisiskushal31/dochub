# Whole-engineering wrap and staff checklist

[← Back to Swift](./README.md)

## What this chapter covers

A **competency map**, **chapter-arc master checklist**, **false-confidence traps**, **interview / hire bar**, and **definition of done** for a Swift change in an org. Use it after **00–22**, not instead of them. Default pin: **Swift 6.3.x** language mode for new work; record the **Xcode / SDK** (and Linux toolchain) your CI actually runs.

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

## 2. Advanced concepts — brownfield, traps, hire bar, definition of done

### 1. Brownfield you must still survive

You will open Swift 5-mode modules, UIKit-only apps, CocoaPods workspaces, XCTest-only suites, and manual signing. Treat them as **translation problems**:

- map completion handlers toward `async` when you touch the code,
- introduce SPM modules at boundaries instead of pasting,
- turn on stricter concurrency in slices with a migration plan,
- document Xcode pins before blaming application code,
- do not copy fossil patterns into new targets.

### 2. Formulas / facts you should be able to say out loud

```text
swift --version          → compiler identity (not always the language mode)
SWIFT_VERSION / mode     → language rules (5 vs 6 concurrency checking)
SWIFT_STRICT_CONCURRENCY → how hard checking runs under that mode
xcodebuild -scheme S     → CI contract for apps (shared scheme)
Package.resolved         → what SPM actually pinned
@MainActor UI updates    → UI frameworks expect main-actor application of state
@Observable vs ObservableObject → modern Observation vs legacy-common Combine models
codesign / profiles      → attest the app; secrets stay out of git
PrivacyInfo.xcprivacy    → declare certain APIs / tracking realities for deps + app
ASC API key / match      → CI signing auth patterns (ch 20–21)
DocC generate            → docs are a build artifact (ch 17)
```

**Also say out loud:** value types copy; classes share identity; ownership/`~Copyable` is an advanced performance door (ch **11** / **24**); `weak` breaks ARC cycles; `Task {}` unstructured concurrency needs a reason; ATS exceptions are waivers; macOS CI minutes are not free; DerivedData is not a release procedure.

### 3. Track arc in one glance

| Phase | Chapters | You should be able to… |
|-------|----------|------------------------|
| Doorway / orientation | **00–03** | Reproduce three hellos; name the pin; find the toolchain |
| Language core | **04–09** | Read production Swift without guessing (incl. macros literacy in **08**) |
| Systems | **10–13** | Review races, Observation glance, memory, stdlib/Foundation use |
| Engineering surface | **14–17** | Ship libraries with tests and docs |
| Apple ship | **18–21** | Schemes, UI literacy, signing, CI trains |
| Gallery + wrap | **22–23** | Pick shapes; sign this checklist |
| Compass | **24** | Name adjacent doors without fake coverage |

If you cannot defend the formulas above, revisit **02**, **06**, **10–11**, **14**, **18–21** — not another UI tutorial.

### 4. Expanded master checklist by chapter arc

Work top to bottom. Skip rows that do not apply to *your* artifact class (pure Linux package teams still own **00–17** + **22–24**; app teams own the Apple ship lane too).

#### Doorway and orientation (**00–03**)

- Three hellos reproducible (REPL/script/package) on the target OS — ch **00**.
- Team distinguishes language / toolchain / SDK / product — ch **01**.
- Language mode vs compiler vs tools version vs Xcode explained — ch **02**.
- CI can answer “which `swift` is on PATH?” with evidence — ch **03**.
- Swiftly / Docker / Windows channels named when the team uses them — ch **03**.

#### Language core (**04–09**)

- Bindings, optionals, control flow, functions/closures reviewed without folklore — ch **04–05**.
- Value vs reference choices intentional; enums/structs preferred for data — ch **06**.
- Properties, init, access control understood at PR depth — ch **07**, **11**.
- Protocols, generics, opaque types, **macros literacy** — ch **08**.
- Errors: `throws` / typed throws literacy; empty `catch` justified — ch **09**.

#### Systems Swift (**10–13**)

- async/await, tasks, actors, isolation, Sendable — ch **10**.
- Observation literacy linked to UI models — ch **10**, **19**.
- ARC, exclusivity, weak/unowned capture reviewed — ch **11**.
- Stdlib / Foundation use with portability caution — ch **12–13**.

#### Engineering surface (**14–17**)

- SPM products/targets/pins; plugins/binary targets as trust boundaries — ch **14**.
- Modules/imports/interop (ObjC/C/C++ doors) — ch **15**.
- New tests prefer Swift Testing; XCTest coexistence — ch **16**.
- Public API: Guidelines naming + DocC build in CI — ch **17**.

#### Apple ship lane (**18–21**)

- Shared scheme + xcconfig tree + `SWIFT_VERSION` / concurrency settings — ch **18**.
- UI PRs: framework named, state map, NavigationStack, hosting, previews≠CI — ch **19**.
- Signing, entitlements, Keychain groups, privacy manifests, ATS, secrets matrix — ch **20**.
- Xcode Cloud stages and/or Mac runners + fastlane; TestFlight groups; triage order — ch **21**.

#### Gallery, wrap, compass (**22–24**)

- Use-case shape chosen with pins/risks — ch **22**.
- This wrap checklist signed for *your* system — ch **23**.
- Adjacent doors named without fake coverage — ch **24**.

### 5. Common false-confidence traps

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
| “Clean DerivedData fixed CI” | Symptom suppression | Fix pins/cache keys (ch **18**, **21**) |
| “ATS exception is temporary” (18 months later) | Urgency without expiry | Waiver + owner + revisit date (ch **20**) |
| “Observation migration = rename types” | Ownership wrappers differ | Step-by-step migration (ch **19**) |
| “Server/Wasm/Android is just Swift” | Same grammar, different pins/SDKs | Use chapter **24** doors |
| “macos-latest is fine forever” | Image drift | Pin `macos-14`/`15` + Xcode (ch **21**) |
| “Green unit tests mean shippable IPA” | Test ≠ archive ≠ signing | Archive dry-run + TestFlight gate |

### 6. Brownfield fossils

| You see | You translate |
|---------|----------------|
| Swift 5 language mode everywhere forever | Plan Swift 6 mode per target (ch **02**, **10**) |
| Force-unwrap culture | `guard` / `throws` / honest optionals (ch **04**, **09**) |
| All logic in view controllers / `body` | Domain packages (ch **19**, **22**) |
| XCTest only for new packages | Prefer Swift Testing for new suites (ch **16**) |
| Personal Xcode schemes in CI | Shared schemes (ch **18**) |
| Secrets in `Constants.swift` | CI secret store (ch **20**) |
| Unpinned `macos-latest` + mystery Xcode | Pin image + Xcode (ch **21**) |
| Silent public API | Document or narrow access (ch **17**) |

### 7. Interview / hire bar (shared vocabulary)

Use this track as a **shared vocabulary** in interviews and PR templates—not a hazing quiz.

| Level | Expect |
|-------|--------|
| **Junior** | Optionals/errors; value vs class; can run tests; knows secrets don’t belong in git |
| **Mid** | Explains language mode vs compiler; sketches SPM graph; reviews a SwiftUI state ownership PR; names shared scheme |
| **Senior / staff** | Concurrency isolation story; xcconfig/CI pin contract; signing/privacy/TestFlight gates; DocC as merge gate; refuses false-confidence traps |
| **Hire signal (any level)** | Argues with the **same nouns** as the team; asks which pin before debugging |

### Interview prompts that map to this track:

- Explain language mode vs `swift --version`.
- Sketch the CI command for *our* scheme (or admit you need the README).
- Where do ASC API keys live? What must never be committed?
- `@Observable` vs `ObservableObject`—what changes at creation sites?
- Name one false-confidence trap you’ve seen in mobile/CI work.
- What does “docs as a merge gate” mean for a new `public` API (ch **17**)?
- Debug vs distribution signing—when is each correct (ch **20**)?

You do not need every checkbox for a junior hire. You do need the vocabulary so seniors and juniors argue about the **same nouns**.

### Sample scorecard (optional)

| Prompt | Junior bar | Mid bar | Staff bar |
|--------|------------|---------|-----------|
| Language mode vs compiler | Knows they differ | Prints both for a target | Migrates modes with a plan |
| CI scheme | Can follow README | Can fix unshared scheme | Designs PR vs release gates |
| Secrets | Won’t commit keys | Names CI/ASC homes | Owns rotation runbook |
| State ownership | Knows `@State` | Maps `@Observable` migration | Catches double navigation / hybrid bugs |

### 8. Definition of done — a Swift change in an org

A change is **done** when the applicable rows are true—not when the PR is green on one laptop.

| Dimension | Done means… |
|-----------|-------------|
| **Intent** | Ticket names script / package / app / CI lane shape (ch **22**) |
| **Language** | New code matches team language mode (**Swift 6.3.x** narrative or waiver) |
| **Correctness** | Tests added/updated; Swift Testing preferred for new suites |
| **API** | New `public`/`open` has `///` + Guidelines naming; DocC builds if catalog exists |
| **Concurrency** | Isolation/`Sendable` story holds under team checking posture |
| **UI** (if any) | State ownership + navigation owner clear; CI test ≠ preview-only |
| **Build** | Shared scheme; settings in reviewable xcconfig when touched |
| **Security / privacy** | No secrets in git; entitlements/privacy/ATS reviewed if touched |
| **CI** | Pipeline that matches the artifact is green on **pinned** image/Xcode |
| **Ship** (if releasing) | Archive/sign path exercised; TestFlight group / notarize as required |
| **Ops** | On-call can see which job failed; rotation owners exist for secrets touched |
| **Docs** | README/onboarding updated if pins or schemes changed |
| **Scope honesty** | No pretend coverage of Server/Wasm/Android—link ch **24** if adjacent |

**Not done:** “Works on my Mac,” “docs follow-up,” “we’ll add tests after merge,” “temporary ATS forever,” “preview looks good.”

### 9. Definition of done — PR template snippet

Paste (or adapt) into your org’s PR template:

```markdown
## Swift DoD
- Shape named (script / package / app / CI lane)
- Language mode / SWIFT_VERSION matches team pin (or waiver linked)
- Tests updated; new suites prefer Swift Testing
- New public API: /// + Guidelines naming; DocC builds if catalog exists
- UI (if any): state owner + navigation owner; CI test not preview-only
- Secrets / entitlements / PrivacyInfo / ATS touched? reviewed per ch 20
- CI green on pinned Xcode / runner image
- Release path (if shipping): archive + TestFlight group / notarize as required
```

### 10. Capstone lab — walk one change end-to-end

Pick a real (or staged) ticket and write a one-page walkthrough:

1. **Shape** (ch **22**) and why not the next-smaller shape.
2. **Pins:** `swift --version`, `xcodebuild -version`, scheme, `Package.resolved` hash if relevant.
3. **Language risks:** optionals/errors, isolation, Observation vs Combine if UI.
4. **Ship risks:** signing destination, privacy, ATS, secrets matrix homes.
5. **CI command** a stranger can paste.
6. **DoD rows** that apply — check them honestly.
7. **Door** if anything smells like server/Wasm/Android/Embedded (ch **24**).

**What just happened:** fluency is the ability to narrate the train, not recite APIs.

### 11. Revisit cadence

| Trigger | Re-open |
|---------|---------|
| Toolchain / Xcode bump | **02**, **03**, **21**, skim **24** |
| Concurrency incident / data race | **10**, **11** |
| New public module | **14**, **17** |
| UI framework migration | **19** |
| Release train / signing change | **20**, **21** |
| “Let’s put Swift on X” proposal | **24** |
| New hire onboarding | This chapter + **00** |

---

## 3. Applications — sign-off by lens

| Lens | You can show |
|------|----------------|
| **Application** | A small feature with clear state ownership and tested domain logic |
| **Systems** | A package that builds on the team’s Linux and/or Mac pins |
| **Security** | Threat-aware review: Keychain/session, entitlements, privacy manifests, no secrets in git |
| **Operations** | Documented CI command, artifact signing path, TestFlight/notarize literacy, rotation owners |
| **Software engineering** | Tests + formatting/lint policy + DocC or equivalent API notes for public modules |

### Sign-off scenarios (prove it)

| Scenario | Evidence |
|----------|----------|
| “We ship an iOS app” | Shared scheme listed; ASC secrets in CI; TestFlight group named; archive dry-run exists |
| “We ship a portable package” | Linux `swift test`; DocC generate on release; no silent Apple-only imports |
| “We are mid Swift 6 migration” | Per-target mode table; concurrency waiver list with owners |
| “We still have UIKit + SwiftUI” | Hosting boundaries documented; Observation migration policy when touching models |
| “We distribute a Mac utility outside MAS” | Developer ID + notarize/staple gate in CI |

Deep-study leftovers from earlier chapters: finish them before signing this page.

---

## 4. Staff-level review checklist (track sign-off)

Use §2.4 as the detailed arc list. This section is the **sign-off rollup**:

### Rollup

- Doorway (**00–03**) pins and hellos are real on the team’s machines/CI.
- Language + systems (**04–13**) review bar is reachable without guessing.
- Packages, tests, DocC (**14–17**) exist for shared modules.
- Apple ship (**18–21**) scheme/signing/CI/TestFlight story is documented.
- Use cases (**22**) match how the team actually builds.
- False-confidence traps (§2.5) are discussed in onboarding—not only after incidents.
- Hire/interview bar (§2.7) uses shared nouns from this track.
- **Definition of done** (§2.8–2.9) is linked from the PR template or team handbook.
- Capstone lab (§2.10) completed once per engineer (or equivalent mentorship walkthrough).
- Adjacent doors point at chapter **24**, not fake coverage.
- Shell/CI YAML depth defers to the Shell track except Swift-on-runner specifics.
- This repo is not pretending to be a full SwiftUI design course or Server Swift encyclopedia.

### Quick “are we lying to ourselves?” probes

- Can a new hire find the **exact** CI `xcodebuild` / fastlane command in README without Slack?
- Does `xcodebuild -showBuildSettings` for Release print the `SWIFT_VERSION` we claim?
- Is there at least one public module with DocC that **builds in CI**?
- Has anyone rotated an ASC API key using the written runbook (not tribal memory)?
- Do we still say “we’re on Swift 6” while targets remain in language mode 5?

### Org adoption notes

| Team size | Practical bar |
|-----------|----------------|
| Solo / tiny | Pins + DoD snippet + one shared scheme; skip interview theater |
| Squad | PR template DoD; DocC gate on shared kits; TestFlight group owner |
| Multi-squad | Hire vocabulary; rotation drills; per-target language-mode table; ch **24** intake for experiments |

### Closing sentence

Fluency is not “I watched WWDC.” Fluency is: you can pin a toolchain, refuse a secret in git, name the shared scheme, and hand off Server/Wasm/Android without pretending this track already shipped them.

Print this page for onboarding day one; re-check it on every toolchain bump.

Keep a dated sign-off in the team wiki when the rollup goes green.

When the boxes that apply to *your* system are checked, the track has done its job for **shipping Swift**. For **where the language and adjacent platforms are moving**, sign chapter **24** as well. Revisit on the cadence in §2.11.

---

## References

- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Swift Testing](https://developer.apple.com/documentation/testing)
- [Observation](https://developer.apple.com/documentation/observation)
- [Macros (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [DocC](https://developer.apple.com/documentation/docc)
- [Code signing](https://developer.apple.com/support/code-signing/)
- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Track README](./README.md)
- [Where Swift is going — chapter 24](./24_Where_Swift_Is_Going_And_Adjacent_Doors.md)
