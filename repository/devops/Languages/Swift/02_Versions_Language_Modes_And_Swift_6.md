# Versions, language modes, and Swift 6

[← Back to Swift](./README.md)

## What this chapter covers

How Swift **versions** evolved from **1.0 (2014)** through the **Swift 3** source break, **Swift 5 ABI stability**, **async/await**, and **Swift 6** complete concurrency checking—plus what a **language mode** is, how migration actually works, how to read **Swift Evolution** without drowning, **`#available` / `@available` literacy**, and how to read deprecated syntax without shipping it again. Handbook default: write and review as **Swift 6.3.x** in modern language mode unless a module is explicitly brownfield.

**Legacy = literacy for brownfield maintenance. Legacy is not a template for new work.**

---

## 1. Concepts

### 1. Two dials: compiler version vs language mode

| Dial | What it answers |
|------|-----------------|
| **Compiler / toolchain version** (e.g. Swift 6.3.x) | Which `swiftc` features, diagnostics, and stdlib you have |
| **Language mode** (`-swift-version 5` or `6`, Xcode `SWIFT_VERSION`) | Which *language rules* the compiler enforces for this module |

A **6.3** toolchain can still compile a target in **Swift 5** language mode. That is normal during migration. It is also how teams fool themselves into saying “we’re on six” when only the Xcode version moved.

```bash
swift --version
# Toolchain identity — necessary, not sufficient.
```

In Xcode, check **Swift Language Version** per target. In SPM, language mode settings live with the tools version / target settings you actually commit. Record both dials in CI docs.

### 2. Language mode vs tools version (matrix literacy)

| Concept | Lives in | Controls |
|---------|----------|----------|
| **Swift tools version** | `// swift-tools-version: …` in `Package.swift` | Which PackageDescription API / manifest features you may use |
| **Toolchain / compiler** | What `swift --version` prints | Which compiler binary runs |
| **Language mode** | `SWIFT_VERSION` / `-swift-version` / target setting | Which language rules apply to *that* target |
| **Xcode version** | `xcodebuild -version` | Apple SDKs + bundled Swift for app builds |

```text
Can be true at once:
  tools-version 6.0 package
  + Swift 6.3.x compiler
  + one library target in language mode 6
  + one brownfield target still in language mode 5
```

Staff habit: when CI is green and a laptop is red (or the reverse), ask which of the **four** drifted—not “is Swift broken?”

### 3. Swift 1.0 (2014): expanded feature set

Swift **1.0** shipped as a safe-by-default alternative to everyday Objective-C app code. The brand was already visible:

| 1.0 pillar | What authors got |
|------------|------------------|
| **Optionals** | Absence in the type system (`T?`) instead of ambient `nil` messaging |
| **Type inference** | `let x = 3` without ceremony, still statically typed |
| **`let` / `var`** | Immutability as a first-class habit |
| **Generics** | Type-safe collections and reusable algorithms early |
| **Closures** | First-class function values for callbacks and collection ops |
| **Tuples** | Lightweight ad-hoc grouping (with later splat drama—see museum) |
| **Enums with associated values** | Richer than C enums for app models |
| **Structs + classes** | Value and reference in one language (story refined for years) |
| **Protocols** | Interface-oriented design without requiring class inheritance |
| **Extensions** | Retroactive modeling on types you do not own |
| **Pattern matching** | `switch` as a real tool, not a C toy |
| **Playgrounds** | Immediate feedback loop for learning and exploration |
| **Cocoa interop** | Call existing Apple frameworks instead of waiting for a rewrite |
| **ARC** | Automatic reference counting as the memory story for classes |
| **Safe defaults** | Bounds checks, definite initialization direction, less unchecked UB lifestyle |

Early Swift still had sharp edges and rapid source churn. The *direction*—safety, clarity, interop—was already the brand. Everything after 1.x is an argument about how far checking and concurrency should go.

### 4. Landmark table (read this until it sticks)

| Era | What authors felt |
|-----|-------------------|
| **1.x (2014–)** | Birth: optionals, inference, playgrounds, Cocoa interop; syntax still settling |
| **2.0** | **`do` / `try` / `catch`** error model; availability improvements; stronger “errors are values in control flow” |
| **2.2** | Deprecation wave preparing the big break (`++`/`--`, C-style `for`, etc. marked to die) |
| **3.0** | **Major source break**: API naming guidelines applied widely; remove `++`/`--`; remove C-style `for`; first argument labels settle toward modern style |
| **4 / 4.2** | Source stability push; stronger `String` and collections story; bridging refinements |
| **5.0** | **ABI stability** on Apple platforms—binary ecosystem matures |
| **5.5** | **`async` / `await`**, structured concurrency beginnings, actors enter the mainstream story |
| **5.7–5.10** | Existential `any`, sharper generics/`some`, **macros** era begins; **complete concurrency checking** available as opt-in rehearsal |
| **6.0+** | **Swift 6 language mode**: complete concurrency checking as the destination default for that mode |
| **6.3.x** | Current handbook pin: same destination, sharper diagnostics and tooling maturity |

You do not memorize every point release. You *do* know: **3 broke sources**, **5 stabilized ABI**, **5.5 made async real**, **6 makes data races a compiler problem in language mode 6**.

### 5. Deprecated → alternative museum (richer)

Pattern for every brownfield snag: label the old form, show the modern form, move on.

#### Increment operators

```swift
// Legacy (Swift ≤2.2) — removed in Swift 3. Do not use in new code.
// var n = 0
// n++
// ++n
```

```swift
// Current (Swift 6.x)
var n = 0
n += 1        // Explicit mutation; reads clearly in review
n -= 1
```

#### C-style for loops

```swift
// Legacy (Swift ≤2.2) — removed in Swift 3. Do not use in new code.
// for var i = 0; i < items.count; i++ {
//     print(items[i])
// }
```

```swift
// Current (Swift 6.x)
for item in items {
    print(item)           // Prefer element iteration
}
for i in items.indices {
    print(items[i])       // When you truly need indices
}
for i in 0..<items.count {
    print(items[i])       // Range-based when index arithmetic is intentional
}
```

#### Tuple splat (era note)

Early Swift allowed “splatting” a tuple into a function’s argument list in ways that looked clever and reviewed poorly. That convenience was curtailed as the language tightened call-site clarity.

```swift
// Legacy idea (do not revive) — tuple splat into argument lists
// let pair = (1, 2)
// takesTwo(pair)   // once worked in some forms; modern Swift wants explicit labels/args
```

```swift
// Current (Swift 6.x) — be explicit at the call site
func takesTwo(_ a: Int, _ b: Int) { print(a + b) }
let pair = (1, 2)
takesTwo(pair.0, pair.1)  // Or better: a named struct / two bindings
```

#### Swift 3 API renaming literacy

Swift 3 applied the **API Design Guidelines** broadly across the SDK surface. Call sites learned to read like English; first-argument labels and verb styles shifted. Staff reading 2015 blogs must translate mentally—do not reintroduce pre-Swift-3 naming because a gist still ranks.

```swift
// Legacy-flavored (pre-guidelines / ObjC-ish verbosity in *new* Swift) — avoid in new code
// func performFetchOfUser(withIdentifier id: String) -> User

// Current direction
// func user(id: String) async throws -> User
```

#### `String` indexing redesign literacy (museum + modern)

Early Swift taught people to treat strings like random-access arrays. The redesign made **Unicode correctness** the default: indices are `String.Index`, not `Int`; grapheme clusters are not bytes; slicing yields `Substring` views that borrow storage.

```swift
// Fossil smell — “fix” Unicode with Int subscripts (does not compile on modern String)
// let s = "café"
// let c = s[0]
```

```swift
// Current (Swift 6.x) literacy — indices are not Int
let s = "café"
let idx = s.startIndex
let first = s[idx]                    // Character (extended grapheme cluster)
let rest = s[s.index(after: idx)...]  // Substring — often convert with String(rest) when you need ownership

// Walking by Character offset is O(n); that cost is intentional honesty
if let i = s.index(s.startIndex, offsetBy: 1, limitedBy: s.endIndex) {
    print(s[i])
}
```

**How to read this as an SE-shaped change**

| Question | Answer for String redesign |
|----------|----------------------------|
| What hurt? | Crashes and wrong lengths with emoji / combining marks |
| What shipped? | Index-based APIs, views (`utf8`, `unicodeScalars`, …) |
| What broke? | Intuition from C/`NSString` UTF-16 indexing habits |
| What do you do in review? | Reject `Int` subscripts; ask for Character vs UTF-8 intent |

Deep string mechanics: chapter **04**. Here: *do not “fix” Unicode by pretending characters are `UInt8` indices.*

#### Objective-C `id` bridging era notes

Early interop often surfaced as `AnyObject` / lightly typed objects crossing the bridge. Nullability annotations (`_Nullable` / `_Nonnull`) and tighter imports improved the story, but brownfield still shows:

| Smell | Modern posture |
|-------|----------------|
| Everything is `AnyObject` at boundaries | Map to real Swift types ASAP |
| Implicitly unwrapped optionals from imports | Treat as hazards; wrap at the edge |
| Selector strings `"foo:"` | `#selector` / stronger compile-time checks where applicable |
| Unchecked shared mutable state across queues | actors / `Sendable` / isolation (Swift 6 mode) |

#### `var` parameters and other early habits

Early Swift allowed patterns (such as `var` function parameters) that trained people to mutate copies in confusing ways. Modern style: mutate locals explicitly inside the function body, or design return values / `inout` deliberately when shared mutation is required.

#### Selectors and completion pyramids

```swift
// Current direction (sketch) — prefer async APIs when you control both sides
func loadTitle() async throws -> String {
    // Awaiting an async function suspends this task without blocking a thread by hand.
    try await fetchTitleFromNetwork()
}
```

Completion handlers still appear in Apple SDKs and brownfield modules. New code you own should prefer async when the ecosystem allows. Deep concurrency: chapter **10**.

#### Soft-removed / reshaped surface (quick museum cards)

| Old habit | Modern posture |
|-----------|----------------|
| `++` / `--` | `+= 1` / `-= 1` |
| C-style `for` | `for-in`, ranges, `enumerated()` |
| Tuple splat into args | Explicit arguments or a struct |
| `String` as random-access `Int` | `String.Index` + Unicode views |
| Implicit existential `P` spelling | Prefer explicit `any P` / generics / `some` |
| IUO everywhere (`Type!`) | `Type?` + binding; IUO only with a framework reason |
| Handler-only new APIs | `async throws` when you own both sides |

### 6. What “Swift 6” means day to day

**Swift 6 language mode** turns complete concurrency checking into hard errors for that module: data races are treated as compile-time problems via isolation and `Sendable` rules.

Migration shape successful teams use:

1. Stay on a modern toolchain (handbook: **6.3.x**).
2. Enable complete checking as **warnings** while still in language mode 5 (where your tooling supports that rehearsal).
3. Fix isolation module by module.
4. Flip **language mode 6** when the warning burn-down is honest—not when the keynote lands.

Official migration reading: [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/) and [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6).

### 7. Swift Evolution literacy — how to read an SE without drowning

You do not need to follow every SE proposal. You need a **triage habit**—the same habit that keeps String-redesign fossils out of new PRs:

| Step | Do this |
|------|---------|
| 1 | Skim the **title + motivation** — is this about your module’s pain? |
| 2 | Read **proposed solution** examples — can you picture a call site? |
| 3 | Check **status** (pitch / review / accepted / implemented) — do not design against a pitch |
| 4 | Note **toolchain version** where it shipped — pin before celebrating |
| 5 | Skim **source compatibility** notes — what breaks, what is deprecated |
| 6 | Ignore rabbit holes (huge bikesheds) until a release note says it landed |

```text
Good staff use of Evolution:
  “SE-NNNN is accepted; we’re on 6.3.x; here’s the migration note for our package.”

Bad use:
  “I saw a pitch on the forums; I rewrote production APIs this afternoon.”
```

**Mini-lab — read one SE like a staff engineer**

Pick any accepted proposal that touched your stack (concurrency, `any`, macros, …) and fill:

```text
SE number / title: ____________________
Status + ship toolchain: ______________
Motivation in one sentence: ___________
Call-site before → after: _____________
What we will NOT do yet: ______________
```

Hub: [Swift Evolution](https://www.swift.org/swift-evolution/). Blog: [Swift.org blog](https://www.swift.org/blog/). Chapter **24** revisits process as compass.

### 8. `#available` / `@available` literacy

Language mode is not the same as **API availability**. You can be on Swift 6.3.x and still need to run on an older OS that lacks a symbol.

| Tool | Where it lives | Job |
|------|----------------|-----|
| **`@available`** | On declarations you write or import | Marks introduced / deprecated / obsolete platforms |
| **`#available`** | In control flow at runtime | Branches so older OSes do not call new symbols |
| **`#unavailable`** | Inverse checks (modern spelling) | Cleaner “only on older OS” branches when useful |
| **Deployment target** | Xcode / package platforms | The oldest OS you claim to support |

```swift
// Declaration-side — tell clients what you require
@available(iOS 17, macOS 14, *)
func modernFeature() { /* … */ }

@available(*, deprecated, renamed: "modernFeature()")
func legacyFeature() { /* … */ }

// Call-site — stay alive on older OS while using new APIs where present
func paint() {
    if #available(iOS 17, *) {
        modernFeature()
    } else {
        // Fallback path that exists on your deployment target
        legacyFeature()
    }
}
```

**What just happened**

- `@available` is a **contract on a declaration**; `#available` is a **runtime gate** in your code.
- Shipping “Swift 6” does not erase the need for availability checks against **OS SDK** symbols.
- Deprecation attributes are how you migrate callers without a silent break—pair them with a renamed modern API.

Staff rule: availability bugs are “works on my phone, crashes on last year’s phone.” Test the deployment target you claim.

---

## 2. Advanced concepts

### 1. Source break psychology (Swift 3)

Swift 3 taught the industry that “Apple languages can still break your weekend.” The win was consistent API naming and removal of C baggage. The cost was churn. Staff reading 2016-era blogs must translate mentally into modern APIs—do not reintroduce removed syntax because a gist still ranks in search.

### 2. ABI stability is not “no more migrations”

**Swift 5 ABI stability** (Apple platforms) improved binary distribution and ecosystem durability. It did **not** freeze source language design. Async/await and Swift 6 concurrency prove the point: the binary story and the source/concurrency story evolve on different clocks.

### 3. Language-mode migration war story (shape, not folklore)

Successful migrations look boring in the postmortem. Failed ones look like this:

```text
Week 0  — Keynote: “Swift 6!” Slack lights up. Someone flips the app target to mode 6 on Friday.
Week 1  — 4,000 concurrency errors. CI red. Feature train stops. Revert. Morale tax.
Week 2  — Quiet plan: toolchain already 6.3.x; enable complete checking as *warnings* on one library.
Week 4  — Library green under warnings; flip that library to language mode 6; leave UI target on 5.
Week 8  — Feature modules follow; actor boundaries appear at network and DB seams.
Week 12 — App target flips; remaining handler APIs wrapped once at the edge.
```

| Move that works | Move that burns weekends |
|-----------------|--------------------------|
| Library-first burn-down | Global flip of the app target |
| Warnings → errors deliberately | “We’ll fix it in the PR that flips the switch” |
| Wrap ObjC/handler edges once | Sprinkle `@unchecked Sendable` to silence |
| Pin CI image to the same compiler | Laptop on newest Xcode, CI on last year |
| Track error counts in the ticket | Argue about SE pitches instead of fixing isolation |

**What just happened**

- Mode 6 is a **destination**, not a weekend.
- The war story shape is always: *rehearse → fix boundaries → flip modules → then the app*.
- Unchecked suppressions are debt with interest—treat them like `// Legacy` comments.

### 4. Per-module migration is a feature

Large apps should not flip one global switch blindly. Migrate packages and targets intentionally:

| Strategy | Why |
|----------|-----|
| Library first | Catch `Sendable` / API boundary issues where reuse is highest |
| Feature modules next | Isolate pain; keep ship train moving |
| App target last | UI frameworks and legacy callbacks often dominate noise |

### 5. CI must pin both dials

Wrong mode / silent drift failure mode:

- Developer laptop: Xcode with language mode 6 on new files.
- CI image: older Xcode, mode 5 everywhere.
- Result: green CI, red local—or the reverse—plus “works on my machine” concurrency bugs.

Pin **Xcode or toolchain image**, and encode **language mode** in project settings that are reviewed like code.

### 6. Forward pointer: handlers → async

```swift
// Legacy style you will still read — literacy, not a goal for new modules you control
func load(completion: @escaping (Result<String, Error>) -> Void) {
    // Escaping closure crosses async boundaries; easy to forget thread hops.
    completion(.success("ok"))
}
```

```swift
// Current direction when you own the API
func load() async throws -> String {
    "ok"  // Call sites use try await; structured concurrency can supervise work
}
```

Treat remaining completion-handler APIs as bridges. Wrap at the boundary; do not proliferate new handler-only surfaces without a reason.

### 7. Lab — museum scavenger hunt

In a brownfield repo (or an old sample), find and label **one** of each if present:

1. `++` / C-style `for` (or a blog comment claiming them),
2. a pre-guidelines verbose API name,
3. `String` indexing that assumes `Int`,
4. a completion-handler pyramid,
5. a target still on language mode 5 while CI claims “Swift 6,”
6. a missing `#available` around a new OS API (crash-on-old-device risk).

Write the modern alternative in the PR description—even if you are not fixing all six today. Literacy is the deliverable; a reckless rewrite is not.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Migrate feature modules to mode 6 before the monolithic app target; keep UI responsive with async entry points; gate new OS APIs with `#available` |
| **Systems** | Linux CI packages should declare tools version and language mode explicitly in repo config |
| **Security** | Concurrency bugs are exploit-adjacent in parsers and network stacks—treat mode 6 checking as a control, not fashion |
| **Operations** | Image tags include Swift/Xcode version; changelog entries for language-mode flips; availability matrices for supported OS versions |
| **Software engineering** | Deprecation tables in the team wiki: removed syntax → replacement; ban `++` “for clarity” in review; SE triage checklist in onboarding |

---

## 4. Staff-level review checklist

- [ ] New modules target **Swift 6 language mode** on a **6.3.x** toolchain unless a written waiver exists.
- [ ] PRs that only bump Xcode without stating language-mode impact get a question, not a rubber stamp.
- [ ] Brownfield files with `++`, C-style `for`, tuple splat habits, or string selectors are labeled for migration—not copied into new targets.
- [ ] Engineers can explain **tools version vs compiler vs language mode vs Xcode** in one minute.
- [ ] Completion-handler APIs at boundaries have an async wrapper plan (or a justified exception).
- [ ] CI image version and `SWIFT_VERSION` / equivalent are discoverable in-repo.
- [ ] Someone can explain **1.0 → 3 break → 5 ABI → 5.5 async → 6 checking** in one minute.
- [ ] Evolution proposals are triaged (status + ship toolchain)—not cargo-culted from pitches.
- [ ] `String` / Unicode indexing fossils are recognized; not “fixed” with unsafe `Int` subscripts.
- [ ] `@available` / `#available` used correctly for OS API gates; deployment target matches claims.
- [ ] Migration follows library-first burn-down—not a Friday global flip with `@unchecked` wallpaper.

---

## References

- [Swift.org blog (releases)](https://www.swift.org/blog/)
- [Swift Evolution](https://www.swift.org/swift-evolution/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Attributes — availability (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/attributes/)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
- [Downloads / toolchains](https://www.swift.org/download/)
- [Macros (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/macros/)
- [Strings and Characters (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/)
