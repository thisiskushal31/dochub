# Where Swift is going and adjacent doors

[← Back to Swift](./README.md)

## What this chapter covers

The **compass** for this track: what **00–23** already make you fluent in, **brief intros** to adjacent topics we do not deep-dive (with **exact next doors**), and **where Swift as a language + ecosystem is moving**. Snapshot habit: **Swift 6.3.x** as the handbook default; re-check [swift.org](https://www.swift.org/) and Apple release notes when you pin toolchains.

You came here for Swift. You should leave able to **write, test, review, and ship** scripts, packages, and Apple-platform apps — and able to say, without panic, “that next topic lives *there*, and this track already gave me the mental model I need to learn it.”

---

## 1. Concepts

### 1. What “all-in-one” means here

This track is the all-in-one for **language + toolchain + Apple ship literacy + engineering habits**. After **00–23** you should be able to:

| You can… | Chapters that built it |
|----------|-------------------------|
| Explain language vs toolchain vs SDK vs scheme | **00–03**, **18** |
| Pin language mode and survive brownfield modes | **02** |
| Read/write core Swift (types through errors) | **04–09** |
| Review concurrency and ARC at staff depth | **10–11** |
| Use stdlib / Foundation with portability caution | **12–13** |
| Own SPM, interop literacy, tests, DocC/API style | **14–17** |
| Operate Xcode schemes, UI surface literacy, signing, CI | **18–21** |
| Map jobs to scripts/packages/apps; server glance | **22** |
| Sign a staff checklist honestly | **23** |

That is the center of the bullseye. It is **not** “every Apple WWDC session” or “every server framework manual.” Scope honesty is how this stays usable.

### 2. The map: owned here vs directed elsewhere

| Topic | In this track? | Where you go next |
|-------|----------------|-------------------|
| Swift 6.x syntax & semantics | **Yes** (default **6.3.x**) | TSPL + swift.org |
| SPM, Testing, DocC | **Yes** | Official DocC / SPM / Testing hubs |
| Xcode schemes, signing, privacy, CI | **Yes** (literacy) | Apple + fastlane + runner docs |
| SwiftUI / UIKit / AppKit **craft** | **Literacy only** (ch **19**) | Apple framework docs |
| Observation / macros (roles) | **Literacy** (**08**, **10**, **19**) | TSPL Macros + Observation docs |
| Server HTTP frameworks | **Glance only** (ch **22**) | [Swift on Server](https://www.swift.org/server/) |
| WebAssembly | **Door** (§2) | swift.org Wasm notes / blog |
| Swift on Android SDK | **Door** (§2) | swift.org / project announcements |
| Embedded Swift | **Door** (§2) | swift.org Embedded docs |
| C++ interop depth | **Literacy + door** (ch **15**) | [C++ interop](https://www.swift.org/documentation/cxx-interop/) |
| FilePath / stdlib expansion | **Door / systems follow** | TSPL + stdlib release notes |
| Deep Shell / generic CI YAML | **No** — sibling | [Shell](../Shell/README.md) track |
| App Store Marketing / ASO | **No** | Out of scope |
| Exploit / bypass material | **No** | Forbidden |

If someone asks “do you cover X?” and X is in the handoff column: this track taught the **language machine**; §2 doors give a **brief intro + exact link**.

### 3. The one sentence that keeps you oriented

> **Same language, different pins and SDKs.**

New Apple OS releases, Linux server images, Wasm targets, and experimental SDKs rarely invent a new human language. They change **toolchains**, **availability**, **concurrency checking defaults**, and **shipping attestation**. Your pin checklist from **02** / **03** / **21** is how you absorb the future without rewriting your brain.

### 4. How to use this chapter

Read it **after 23** (or skim after **01** so you know the bullseye). Revisit when:

- you bump Xcode or Swift,
- someone says “let’s run Swift on Android / Wasm / the server,”
- a release note mentions language mode, macros, Observation, or concurrency defaults,
- Evolution proposals your team cares about get accepted.

---

## 2. Advanced concepts — where the platform is moving

### 1. How Swift evolves (process literacy)

Swift changes in the open via **Swift Evolution**: proposals (SE-NNNN), review, acceptance, then toolchain shipping. Staff habits:

1. Read **release notes** on every bump you adopt.
2. Separate **language mode** changes from “we installed a newer compiler.”
3. Treat preview/snapshot toolchains as **opt-in CI experiments**, not silent prod pins.
4. Triage Evolution: motivation → examples → **status** → ship toolchain (chapter **02**).

Hub: [Swift Evolution](https://www.swift.org/swift-evolution/) and the [Swift.org blog](https://www.swift.org/blog/).

### 2. Language direction — concurrency, macros, Observation

Direction that already affects day jobs:

| Theme | Why engineers care | Handbook home |
|-------|--------------------|---------------|
| **Complete concurrency checking** | Data races as compile-time / migration work | **10**, migration guides |
| **Macros** | Generate boilerplate (Observation, testing helpers, APIs) — expand-in-Xcode literacy | **08**; [TSPL Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/) |
| **Observation (`@Observable`)** | Modern UI/model observation without Combine boilerplate | **19**; [Observation](https://developer.apple.com/documentation/observation) |
| **Ownership / performance annotations** literacy | Advanced APIs and stdlib evolution | Follow TSPL/release notes when needed |
| **Testing & packaging** | Swift Testing and SPM features continue to land | **16**, **14** |

**Habit that does not change:** ship a **pinned, supported** toolchain you can defend; do not chase nightly syntax in production apps.

### 3. Stdlib expansion and FilePath

The standard library and adjacent core libraries keep growing portable primitives. **`FilePath`** (and related path APIs in the ecosystem) matter because stringly paths (`"/tmp/" + name`) hide Windows/Linux/Apple differences.

Staff posture:

- Prefer typed path APIs when you write portable tools,
- Test on Linux CI if you claim portability (chapter **03**),
- Track stdlib release notes on bumps—not every addition needs a handbook chapter.

### 4. C++ interop

C interop was always part of the story; **C++ interoperability** is a first-class expanding bridge for mixed systems codebases. Literacy lives in chapter **15**; deep adoption means reading [C++ interop docs](https://www.swift.org/documentation/cxx-interop/) and treating the boundary as a reviewed seam (ownership, exceptions, headers).

### 5. Apple platform line (SDK under you)

New iOS/macOS/visionOS SDKs arrive with Xcode. Contract authors (you) mostly feel:

- API availability and deprecations,
- privacy / signing requirement updates,
- simulator destination churn in CI.

Same Swift source often compiles across SDK bumps — until an API disappears or a privacy manifest rule tightens. Re-read Apple “what’s new” for **your** frameworks when bumping Xcode in CI (chapter **21**).

### 6. What is *not* the future of new app code

| Idea | Status for *you* |
|------|------------------|
| Ignoring Swift 6 concurrency forever | Migration plan required for new targets |
| Secrets in the repo “temporarily” | Never — ch **20** |
| UIKit→SwiftUI big-bang rewrite as default | Incremental hosting — ch **19** |
| Unpinned CI Xcode | Incident factory — ch **21** |
| Treating Server/Wasm/Android as “already covered” because this track exists | Use §2.7 doors |

### 7. Brief introductions — doors we do not deep-dive

#### Server Swift

**What it is:** Swift toolchains and web frameworks on Linux (and cloud) for APIs and services. Same language; different deploy and observability story than App Store apps. You will hear **SwiftNIO** under the hood and frameworks such as **Vapor** / **Hummingbird** at the app layer.

**Where exactly:** [Swift on Server](https://www.swift.org/server/); framework docs for the stack you choose. **In this track:** glance in chapter **22**; pins in **02** / **03**.

#### WebAssembly (Wasm)

**What it is:** Compile Swift toward Wasm for sandboxed / web-adjacent runtimes. Tooling and supported subsets move quickly — treat as an explicit target triple + CI pin, not “it works on iOS so it works on Wasm.”

**Where exactly:** Watch [swift.org documentation](https://www.swift.org/documentation/) and the [blog](https://www.swift.org/blog/) for Wasm; verify the **exact** toolchain your team pins. **In this track:** only the orientation that **pins and SDKs differ**.

#### Swift SDK for Android

**What it is:** Expanding ability to build Swift for Android as a target — interop and packaging differ from Apple app delivery. Not a substitute for Kotlin/Java ecosystem literacy overnight.

**Where exactly:** Official swift.org / project announcements and SDK docs as published. **In this track:** compass only — do not pretend chapter **19** UIKit skills transfer.

#### Embedded Swift

**What it is:** Swift subsets and toolchains aimed at constrained / embedded systems. Availability and library surface are special; not Foundation-on-iPhone assumptions.

**Where exactly:** Embedded documentation linked from [swift.org documentation](https://www.swift.org/documentation/). **In this track:** know the door exists; do not invent embedded drivers here.

#### Sibling handbook tracks and official hubs

| Need | Door |
|------|------|
| Shell glue, CI YAML depth, POSIX habits | [Shell](../Shell/README.md) |
| Other languages in the handbook | [Languages](../README.md) index |
| Language book | [TSPL](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) |
| Macros | [TSPL Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/) |
| Observation | [Observation](https://developer.apple.com/documentation/observation) |
| Swift Testing | [Swift Testing](https://developer.apple.com/documentation/testing) |
| C++ interop | [C++ interoperability](https://www.swift.org/documentation/cxx-interop/) |

### 8. Clear handoff table (print this)

| Ambition | Stay in this track? | Next concrete door |
|----------|---------------------|--------------------|
| Ship iOS/macOS app with SPM + CI | **Yes** | ch **18–21** + Apple docs |
| Design system / animation craft | No | Apple SwiftUI/UIKit design docs |
| Production HTTP microservices | Glance only | Swift on Server + chosen framework |
| Wasm module in prod | Door | swift.org Wasm + pinned toolchain CI |
| Android with Swift | Door | Official Android SDK announcements/docs |
| Embedded firmware in Swift | Door | Embedded docs on swift.org |
| Heavy C++ mixed binary | Literacy → door | C++ interop docs + ch **15** |
| Bash-heavy release scripts | Sibling | Shell track |
| Exploit / bypass | Forbidden | — |

Finishing **00–24** means you are fluent in the **Swift engineering layer** and you can **name the door** for everything above. That is intentional, not unfinished.

### 9. How to stay oriented (per-release ritual)

1. **On every Swift/Xcode bump:** read swift.org / Apple notes; re-run package + app CI; refresh concurrency warnings.
2. **On every dependency major:** changelog + privacy manifest + binary target review.
3. **On every new platform experiment (Wasm/Android/server/embedded):** name the **toolchain pin** and the **owner**; do not smuggle it into the iOS release lane unmarked.
4. **When a headline says “Swift replaces X”:** find the **official** post; ignore hype until you can name the pin and the unsupported edges.

---

## 3. Applications and use cases

| Lens | How “direction” shows up |
|------|--------------------------|
| **Application** | New OS SDKs: availability checks; keep domain logic in packages; Observation migration when touching UI models |
| **Systems** | Server/Wasm/Android/Embedded experiments get their **own** toolchain pins and CI jobs; FilePath over stringly paths |
| **Security** | Privacy/signing requirements tighten over time — revisit manifests on bumps |
| **Operations** | Release notes → CI pin PR → canary → fleet |
| **Software engineering** | Changelog template: Swift mode, Xcode, SPM locks, macros/Observation adoption notes, “experimental target? named owner” |

Use §2.7–2.8 as the **directory** when a teammate names an adjacent topic: one short paragraph of meaning, then the path.

---

## 4. Staff-level review checklist

- [ ] Team can state what this track **owns** vs **hands off**, and can point to §2.8 for each handoff.
- [ ] Production pins include **Swift language mode + Xcode/SDK** (and Linux toolchain if used).
- [ ] No production dependency on **unpinned snapshot** toolchains without an explicit experiment label.
- [ ] Concurrency migration is planned for targets still stuck on forever-Swift-5 mode.
- [ ] Macros / Observation adoption is intentional (deployment + review), not copy-paste from keynotes.
- [ ] “We’re doing Server/Wasm/Android/Embedded/C++” tickets name owners and docs links — not a rewrite of this handbook.
- [ ] Someone is assigned to read **swift.org blog + Apple release notes** on bumps.
- [ ] Chapter **23** checklist is signed for the system you actually ship; this chapter is the **compass**, not a substitute.
- [ ] Adjacent work (deep SwiftUI design, server product, Shell-heavy CI) has a named owner and a door from §2.8.

---

## References

- [Swift.org](https://www.swift.org/)
- [Swift documentation hub](https://www.swift.org/documentation/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Macros (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
- [Observation](https://developer.apple.com/documentation/observation)
- [Swift Testing](https://developer.apple.com/documentation/testing)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [Swift.org blog](https://www.swift.org/blog/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
- [Swift on Server](https://www.swift.org/server/)
- [C++ interoperability](https://www.swift.org/documentation/cxx-interop/)
- [Xcode](https://developer.apple.com/documentation/xcode)
- [Track wrap — chapter 23](./23_Whole_Engineering_Wrap_And_Staff_Checklist.md)
