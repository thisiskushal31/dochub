# Where Swift is going and adjacent doors

[← Back to Swift](./README.md)

## What this chapter covers

The **compass** for this track: what **00–23** already make you fluent in, **richer doors** to adjacent topics we do not deep-dive (Embedded, Wasm, Android SDK, server NIO, C++ interop, ownership/`~Copyable`/Span, Observation/macros future), **how to read SE proposals**, and a **handoff table** to other Languages tracks. Snapshot habit: **Swift 6.3.x** as the handbook default; re-check [swift.org](https://www.swift.org/) and Apple release notes when you pin toolchains.

You came here for Swift. You should leave able to **write, test, review, and ship** scripts, packages, and Apple-platform apps — and able to say, without panic, “that next topic lives *there*, and this track already gave me the mental model I need to learn it.”

---

## 1. Concepts

### 1. What “all-in-one” means here

This track is the all-in-one for **language + toolchain + Apple ship literacy + engineering habits**. After **00–23** you should be able to:

| You can… | Chapters that built it |
|----------|-------------------------|
| Explain language vs toolchain vs SDK vs scheme | **00–03**, **18** |
| Pin language mode and survive brownfield modes | **02** |
| Read/write core Swift (types through errors, macros literacy) | **04–09** |
| Review concurrency, Observation glance, and ARC at staff depth | **10–11** |
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
| Ownership / `~Copyable` / Span | **Door + systems glance** (§2) | TSPL + Evolution + release notes |
| Server HTTP frameworks / NIO | **Glance + door** (ch **22**, §2) | [Swift on Server](https://www.swift.org/server/) |
| WebAssembly | **Door** (§2) | swift.org Wasm notes / blog |
| Swift on Android SDK | **Door** (§2) | swift.org / project announcements |
| Embedded Swift | **Door** (§2) | swift.org Embedded docs |
| C++ interop depth | **Literacy + door** (ch **15**, §2) | [C++ interop](https://www.swift.org/documentation/cxx-interop/) |
| FilePath / stdlib expansion | **Door / systems follow** | TSPL + stdlib release notes |
| Deep Shell / generic CI YAML | **No** — sibling | [Shell](../Shell/README.md) track |
| Other handbook languages | **Handoff** (§2.9) | [Languages](../README.md) index |
| App Store Marketing / ASO | **No** | Out of scope |
| Exploit / bypass material | **No** | Forbidden |

### 3. The one sentence that keeps you oriented

> **Same language, different pins and SDKs.**

New Apple OS releases, Linux server images, Wasm targets, and experimental SDKs rarely invent a new human language. They change **toolchains**, **availability**, **concurrency checking defaults**, and **shipping attestation**. Your pin checklist from **02** / **03** / **21** is how you absorb the future without rewriting your brain.

### 4. How to use this chapter

Read it **after 23** (or skim after **01** so you know the bullseye). Revisit when:

- you bump Xcode or Swift,
- someone says “let’s run Swift on Android / Wasm / the server / embedded,”
- a release note mentions language mode, macros, Observation, ownership, or concurrency defaults,
- Evolution proposals your team cares about get accepted.

---

## 2. Advanced concepts — direction and richer doors

### 1. How Swift evolves — reading SE proposals

Swift changes in the open via **Swift Evolution**: proposals (SE-NNNN), review, acceptance, then toolchain shipping.

**How to read an SE without drowning:**

| Pass | What you extract |
|------|------------------|
| **1. Title + status** | Proposed / review / accepted / implemented — ignore rumor |
| **2. Motivation** | What pain exists today (map to your codebase) |
| **3. Proposed solution + examples** | The *shape* of the change — enough to teach |
| **4. Source compatibility** | Does this need a language mode bump? Migration? |
| **5. Alternatives / future directions** | What was rejected — stops bike-shedding |
| **6. Ship toolchain** | Which Swift/Xcode actually contains it |

Staff habits:

1. Read **release notes** on every bump you adopt.
2. Separate **language mode** changes from “we installed a newer compiler.”
3. Treat preview/snapshot toolchains as **opt-in CI experiments**, not silent prod pins.
4. Triage Evolution: motivation → examples → **status** → ship toolchain (chapter **02**).

Hub: [Swift Evolution](https://www.swift.org/swift-evolution/) and the [Swift.org blog](https://www.swift.org/blog/).

### 2. Language direction — concurrency, macros, Observation

| Theme | Why engineers care | Handbook home |
|-------|--------------------|---------------|
| **Complete concurrency checking** | Data races as compile-time / migration work | **10**, migration guides |
| **Macros** | Generate boilerplate (Observation, testing helpers, APIs) — expand-in-Xcode literacy | **08**; [TSPL Macros](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/) |
| **Observation (`@Observable`)** | Modern UI/model observation without Combine boilerplate | **19**; [Observation](https://developer.apple.com/documentation/observation) |
| **Testing & packaging** | Swift Testing and SPM features continue to land | **16**, **14** |

**Macros / Observation future posture:** expect more stdlib and Apple frameworks to lean on macros and Observation. Adopt when **deployment + review** allow—not when a keynote demo looks short. Expand macros in Xcode when debugging generated code; treat macro plugins as trust boundaries (ch **14**, **20**).

**Habit that does not change:** ship a **pinned, supported** toolchain you can defend; do not chase nightly syntax in production apps.

### 3. Ownership, `~Copyable`, and Span — direction door

Swift’s default is **copyable** values with ARC for references. Advanced performance and systems APIs increasingly talk about **ownership**: when a value is consumed, borrowed, or uniquely held.

| Idea | Literacy meaning | Not this track’s job |
|------|------------------|----------------------|
| **Ownership** | Explicit control over consuming vs borrowing values | Full ownership manifesto course |
| **`~Copyable`** | Types that cannot be implicitly copied — unique resources | Inventing unsafe patterns |
| **Span / non-escaping buffer views** | Safe-ish views into contiguous memory without full unsafe sprawl | Replacing all `Array` use |

Staff posture:

- Most app code stays with ordinary values and ARC (ch **06**, **11**).
- When stdlib or a dependency shows `~Copyable` / Span in a public API, **read the SE + release notes** before copying samples.
- Treat this as a **systems performance door**, not a reason to rewrite DTOs.

Follow TSPL and Evolution when your team touches these APIs.

### 4. Stdlib expansion and FilePath

The standard library and adjacent core libraries keep growing portable primitives. **`FilePath`** (and related path APIs) matter because stringly paths (`"/tmp/" + name`) hide Windows/Linux/Apple differences.

Staff posture: prefer typed path APIs in portable tools; test on Linux CI if you claim portability; track stdlib release notes on bumps.

### 5. C++ interop (richer door)

C interop was always part of the story; **C++ interoperability** is a first-class expanding bridge for mixed systems codebases.

| Constraint to expect | Why it matters |
|----------------------|----------------|
| Ownership / lifetime across the boundary | Who frees what |
| Exceptions vs Swift errors | Mapping policy must be deliberate |
| Header / module maps | Build settings become part of the API |
| Not all C++ features map 1:1 | Subset literacy — read official docs |

Literacy lives in chapter **15**; deep adoption means [C++ interop docs](https://www.swift.org/documentation/cxx-interop/) and treating the boundary as a reviewed seam.

### 6. Apple platform line (SDK under you)

New iOS/macOS/visionOS SDKs arrive with Xcode. Contract authors mostly feel API availability, privacy/signing updates, simulator destination churn. Re-read Apple “what’s new” for **your** frameworks when bumping Xcode in CI (chapter **21**).

### 7. What is *not* the future of new app code

| Idea | Status for *you* |
|------|------------------|
| Ignoring Swift 6 concurrency forever | Migration plan required for new targets |
| Secrets in the repo “temporarily” | Never — ch **20** |
| UIKit→SwiftUI big-bang rewrite as default | Incremental hosting — ch **19** |
| Unpinned CI Xcode | Incident factory — ch **21** |
| Treating Server/Wasm/Android/Embedded as “already covered” | Use doors below |
| Ignoring Distributed actors / SwiftData when the ticket needs them | Name the door + official docs; do not invent here |

### 8. Richer doors we do not deep-dive

#### Distributed actors

**What it is:** Actor isolation across process/network boundaries (`Distributed` module).

**Door literacy:** local actors first (ch **10**); Distributed only with an explicit multi-node design and official docs. Not a free RPC layer.

#### SwiftData

**What it is:** Macro-friendly Apple persistence beside SwiftUI (`@Model`).

**Door literacy:** ch **19** points here; Core Data remains common brownfield. Require migration/backup/test story when adopting.

#### Mutex / Synchronization

**What it is:** Synchronous mutual exclusion that coexists with Swift Concurrency (ch **10**).

**Door literacy:** prefer actors for async services; use `Mutex` for short sync critical sections — never block the cooperative pool with semaphores.

#### Embedded Swift — constraints

**What it is:** Swift subsets and toolchains aimed at constrained / embedded systems.

**Constraints literacy (doors, not drivers):**

| Constraint | Implication |
|------------|-------------|
| Smaller / specialized stdlib surface | Do not assume full Foundation-on-iPhone |
| Allocation and runtime limits | Patterns from app Swift may be unavailable |
| Toolchain and boards are explicit pins | Same “pins differ” rule as Wasm/server |
| Debugging and flash story differ | Not Xcode iOS Run |

**Where exactly:** Embedded documentation linked from [swift.org documentation](https://www.swift.org/documentation/). **In this track:** know the door exists; do not invent embedded drivers here.

#### WebAssembly (Wasm)

**What it is:** Compile Swift toward Wasm for sandboxed / web-adjacent runtimes.

**Door literacy:** tooling and supported subsets move quickly — treat as an explicit target triple + CI pin, not “it works on iOS so it works on Wasm.” Watch [swift.org documentation](https://www.swift.org/documentation/) and the [blog](https://www.swift.org/blog/); verify the **exact** toolchain your team pins.

#### Swift SDK for Android

**What it is:** Expanding ability to build Swift for Android as a target — interop and packaging differ from Apple app delivery.

**Door literacy:** not a substitute for Kotlin/Java ecosystem literacy overnight; packaging, JNI/interop, and distribution are separate jobs. Official swift.org / project announcements and SDK docs as published. Chapter **19** UIKit skills do **not** transfer.

#### Server Swift / NIO

**What it is:** Swift toolchains and web frameworks on Linux (and cloud) for APIs and services.

| Name | Treat as |
|------|----------|
| **SwiftNIO** | Low-level event-driven networking — foundation under many servers |
| **Vapor** / **Hummingbird** / others | Application frameworks — pick via server docs |
| **Static Linux SDK** / containers | Pin story (ch **02** / **03**) |

**Where exactly:** [Swift on Server](https://www.swift.org/server/). **In this track:** glance in chapter **22**; pins in **02** / **03**. Event-loop concurrency is *related* to but not identical to Swift concurrency actors—read server docs before assuming `@MainActor` habits apply.

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

### 9. Handoff table — other Languages tracks and ambitions

| Ambition | Stay in this track? | Next concrete door |
|----------|---------------------|--------------------|
| Ship iOS/macOS app with SPM + CI | **Yes** | ch **18–21** + Apple docs |
| Design system / animation craft | No | Apple SwiftUI/UIKit design docs |
| Production HTTP microservices | Glance only | Swift on Server + chosen framework + NIO literacy |
| Wasm module in prod | Door | swift.org Wasm + pinned toolchain CI |
| Android with Swift | Door | Official Android SDK announcements/docs |
| Embedded firmware in Swift | Door | Embedded docs on swift.org (constraints above) |
| Heavy C++ mixed binary | Literacy → door | C++ interop docs + ch **15** |
| Ownership / Span performance APIs | Door | TSPL + SE proposals + release notes |
| Bash-heavy release scripts | Sibling | [Shell](../Shell/README.md) track |
| Compare to another language’s model | Sibling | [Languages](../README.md) — e.g. concurrency story vs other tracks |
| IaC / cloud config languages | Sibling | e.g. [HCL](../HCL/README.md) when that is the job |
| Smart-contract languages | Sibling | e.g. [Solidity](../Solidity/README.md) when that is the job |
| Exploit / bypass | Forbidden | — |

Finishing **00–24** means you are fluent in the **Swift engineering layer** and you can **name the door** for everything above. That is intentional, not unfinished.

### 10. How to stay oriented (per-release ritual)

1. **On every Swift/Xcode bump:** read swift.org / Apple notes; re-run package + app CI; refresh concurrency warnings; skim accepted SEs that shipped.
2. **On every dependency major:** changelog + privacy manifest + binary target review.
3. **On every new platform experiment (Wasm/Android/server/embedded):** name the **toolchain pin** and the **owner**; do not smuggle it into the iOS release lane unmarked.
4. **When a headline says “Swift replaces X”:** find the **official** post; ignore hype until you can name the pin and the unsupported edges.
5. **When ownership/`~Copyable`/Span appears in a dependency:** assign one engineer to read the SE; don’t cargo-cult into app DTOs.

### 11. Door one-pagers — questions before you start

Use these as intake forms. If you cannot answer them, you are not ready to staff the experiment.

#### Embedded intake

```text
Board / constraint class: _______________
Toolchain pin (exact): _______________
Allowed library surface (what is *out*): _______________
Owner: _______________  Success metric: _______________
Why not C/C++ for this slice: _______________
```

#### Wasm intake

```text
Target triple / runtime: _______________
Toolchain pin: _______________
Hosted vs local CI: _______________
Unsupported language/stdlib edges we accept: _______________
Owner: _______________
```

#### Android SDK intake

```text
Swift pieces vs Kotlin/Java pieces: _______________
Interop boundary owner: _______________
Packaging/distribution story: _______________
Toolchain pin: _______________
What chapter 19 skills do *not* transfer: UIKit/AppKit assumptions
```

#### Server / NIO intake

```text
Framework (Vapor/Hummingbird/…): _______________
Swift/Linux image pin: _______________
Domain package shared with mobile? [ ] yes [ ] no — why
Observability (logs/metrics/health): _______________
Who owns on-call: _______________
```

#### C++ interop intake

```text
Headers / modules in play: _______________
Ownership/lifetime rules at boundary: _______________
Exception ↔ Error mapping: _______________
CI builds the mixed target on which OS: _______________
```

#### Ownership / Span intake

```text
Which SE / release note authorizes this API use: _______________
Why ordinary Array/Data is insufficient: _______________
Unsafe escape hatch needed? [ ] no [ ] yes + justification
Reviewer who has read the SE: _______________
```

### 12. Lab — triage three headlines

For each headline, write: **status of claim**, **pin you would demand**, **door from §2.9**.

1. “Swift on Android replaces Kotlin.”
2. “Just enable complete concurrency; it’s free.”
3. “Wasm means we can delete our iOS CI.”

**Sane direction:** (1) door + dual-ecosystem literacy; (2) migration plan per target; (3) different pins—iOS CI stays.

---

## 3. Applications and use cases

| Lens | How “direction” shows up |
|------|--------------------------|
| **Application** | New OS SDKs: availability checks; keep domain logic in packages; Observation migration when touching UI models |
| **Systems** | Server/Wasm/Android/Embedded/C++ experiments get their **own** toolchain pins and CI jobs; FilePath over stringly paths; ownership APIs only with SE literacy |
| **Security** | Privacy/signing requirements tighten over time — revisit manifests on bumps |
| **Operations** | Release notes → CI pin PR → canary → fleet |
| **Software engineering** | Changelog template: Swift mode, Xcode, SPM locks, macros/Observation adoption notes, SE links for ownership APIs, “experimental target? named owner” |

### Changelog template (copy)

```markdown
## Toolchain
- Swift language mode: …
- Xcode / SDK (app): …
- Linux image (packages/server): …

## Language surface
- Macros / Observation notes: …
- Concurrency checking posture: …
- Ownership/Span APIs touched: … (SE links)

## Experimental targets
- none
- server / Wasm / Android / Embedded / C++ — owner: … — pin: …
```

Use §2.8–2.9 as the **directory** when a teammate names an adjacent topic: one short paragraph of meaning, then the path. Door intake forms in §2.11 stop “science projects” from silently boarding the iOS release train.

---

## 4. Staff-level review checklist

- Team can state what this track **owns** vs **hands off**, and can point to §2.9 for each handoff.
- Production pins include **Swift language mode + Xcode/SDK** (and Linux toolchain if used).
- No production dependency on **unpinned snapshot** toolchains without an explicit experiment label.
- Concurrency migration is planned for targets still stuck on forever-Swift-5 mode.
- Macros / Observation adoption is intentional (deployment + review), not copy-paste from keynotes.
- Ownership / `~Copyable` / Span usage (if any) cites SE/release-note literacy — not random attrs.
- Embedded / Wasm / Android / server NIO / C++ tickets name **constraints**, owners, and docs links.
- Someone can triage an SE: status → motivation → examples → ship toolchain.
- Someone is assigned to read **swift.org blog + Apple release notes** on bumps.
- Chapter **23** checklist is signed for the system you actually ship; this chapter is the **compass**, not a substitute.
- Adjacent work (deep SwiftUI design, server product, Shell-heavy CI, other Languages tracks) has a named owner and a door from §2.9.

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
- [Languages index](../README.md)
- [Shell track](../Shell/README.md)
