# DocC and API Design Guidelines

[← Back to Swift](./README.md)

## What this chapter covers

**DocC** for documentation catalogs, the Swift **API Design Guidelines**, and why **undocumented public API** is a staff-level smell. Default is **Swift 6.3.x** / Swift 6 language mode.

Public API is a promise. Names, argument labels, and doc comments are how that promise is taught. DocC turns comments and articles into browsable docs you can ship with a package or framework. Documentation is also a **review gate**—not a rainy-day chore.

You finish this chapter when you can: name a call site that violates the Guidelines, sketch a `.docc` catalog layout, link a symbol from an article, and describe how CI fails a PR that ships silent `public` API.

---

## 1. Concepts

### 1. API Design Guidelines — core taste

Swift APIs aim to read like clear English at the call site. Habit summary:

- **Clarity at the point of use** over brevity at the declaration.
- **Omit needless words**; keep words that disambiguate.
- Use **argument labels** to make roles obvious.
- Prefer **methods** for behavior involving `self`; prefer **initializers** for created values.
- Follow established patterns (`min`/`max`, `push`/`pop`) so users transfer learning.

```swift
// Call sites teach the rule:
xs.insert(element, at: index)
view.draw(rectangle, in: context)

// Weak:
xs.insert(element, index)          // roles unclear
draw(r: rectangle, c: context)     // cryptic labels
```

Name booleans like assertions (`isEmpty`, `hasSuffix`), not `flag`/`enabled` without a subject.

### 2. Lab — naming before/after (API Design Guidelines)

Three worked rewrites. Read each **before** aloud. If a new teammate cannot guess behavior, the name failed.

#### Example A — fetch / identity

```swift
// Before (smells) — do not ship as public API style
func getUserData(_ i: String, f: Bool) -> User?
func performFetchOfUser(withIdentifier id: String) -> User
```

```swift
// After — clarity at the point of use; async/throws are part of the contract
func user(id: String) async throws -> User
func user(id: String, includeInactive: Bool) async throws -> User?
```

| Check | Before fails because… | After passes because… |
|-------|------------------------|------------------------|
| Call aloud | “get user data eye eff” | “user id … include inactive” |
| Boolean | `f:` is noise | `includeInactive:` is a clause |
| Needless words | `performFetchOf…` | Verb lives in the type/context |

#### Example B — mutation vs copy

```swift
// Before — ambiguous about whether self changes
func sortInPlace(_ a: inout [Int]) { a.sort() }
func makeSortedVersion(_ a: [Int]) -> [Int] { a.sorted() }
```

```swift
// After — stdlib taste: mutating bare name vs -ed/-ing copy
extension Array where Element: Comparable {
    mutating func sort() { /* … */ }
    func sorted() -> [Element] { /* … */ }
}
```

| Guideline | Habit |
|-----------|-------|
| Mutating | `sort`, `reverse`, `toggle` |
| Non-mutating | `sorted`, `reversed`, `toggled` |
| Review smell | `sortInPlace` / `makeSortedVersion` when the pair already exists |

#### Example C — labels that teach roles

```swift
// Before
func draw(r: CGRect, c: CGContext) { }
func move(_ p: CGPoint, _ v: CGVector) { }
func convert(_ s: String, _ b: Bool) -> Data?
```

```swift
// After
func draw(_ rectangle: CGRect, in context: CGContext) { }
func move(from point: CGPoint, by vector: CGVector) { }
func data(from string: String, usingUTF8: Bool) -> Data?
```

```swift
// Bonus — Prefer returning new values over mysterious inout flags when practical:
func toggled(_ value: Bool) -> Bool { !value }
// Weak: func toggle(_ x: inout Bool)
```

| Guideline check | Passes when… |
|-----------------|--------------|
| Read the call aloud | It sounds like a sentence fragment that means something |
| Boolean argument | Label reads as a clause (`includeInactive:`), not `flag:` |
| Mutation | `sort` mutates; `sorted` returns — names tell you |
| Weak types | `Any` / untyped IDs are justified or gone |
| First parameter | Often unlabeled when the type + method name carry the role |

**What just happened:** Guidelines are enforced at the **call site**, not by counting characters at the declaration.

### 3. Documentation comments

Use `///` (or `/** */`) on public declarations. Triple-slash comments feed DocC and Quick Help.

```swift
/// A network client for the Example service.
///
/// Create one client per session and reuse it for connection pooling.
///
/// - Important: All methods are `@MainActor`-free; callers choose isolation.
public struct ExampleClient {
    /// Fetches the resource at `path`.
    ///
    /// - Parameter path: Absolute path beginning with `/`.
    /// - Returns: UTF-8 response body.
    /// - Throws: Network and decoding failures.
    public func get(_ path: String) async throws -> String {
        "ok"
    }
}
```

Document what callers must know: invariants, threading/isolation, error cases, performance cliffs. Do not restate the type signature with no added meaning.

| Doc piece | When it earns its keep |
|-----------|------------------------|
| Summary sentence | Always for `public` / `open` |
| `- Parameters:` | Non-obvious roles, units, preconditions |
| `- Returns:` | When the return is not obvious from the type name |
| `- Throws:` | Error taxonomy callers must handle |
| `- Note:` / `- Warning:` | Isolation, Sendable, main-thread rules |

### 4. DocC catalog structure — full layout lab

A **DocC catalog** is usually a folder ending in `.docc` that holds:

| Piece | Role |
|-------|------|
| **Symbol docs** | From `///` in source — the API reference backbone |
| **Articles** | Conceptual pages (`.md` in the catalog) — how to think / how to start |
| **Extensions / topic files** | Curate landing pages and topic groups |
| **Assets** | Images/diagrams for articles (keep them light) |
| **Tutorials** (optional) | Guided, step-oriented teaching — heavier lift |

**Full catalog layout lab** (library named `MyLibrary`):

```text
Sources/MyLibrary/
  MyLibrary.swift                 # public API + /// comments
  Networking/
    ExampleClient.swift
  MyLibrary.docc/
    MyLibrary.md                  # catalog root / landing (curated topics)
    GettingStarted.md             # article — first successful call
    NetworkingOverview.md         # article — how clients fit together
    MigrationGuide.md             # article — breaking-change bridge
    ExampleClient.md              # optional symbol extension / topic curation
    Resources/
      architecture-overview.png   # optional; keep small
    Tutorials/                    # optional — skip until articles are solid
```

Landing page habits (`MyLibrary.md`):

```markdown
# ``MyLibrary``

Brief one-paragraph product promise.

## Topics

### Essentials
- <doc:GettingStarted>
- ``ExampleClient``

### Networking
- <doc:NetworkingOverview>
- ``ExampleClient/get(_:)``
```

| Rule | Why |
|------|-----|
| Landing is curated | Alphabetical dump ≠ product |
| Articles link symbols | Concepts stay tied to real API |
| One GettingStarted | New hires stop asking Slack |
| MigrationGuide when you break | Deprecations alone are not enough |

### 5. Articles vs symbols vs tutorials

| Kind | Answers | Failure mode if missing |
|------|---------|-------------------------|
| **Symbol pages** | “What is this type/method?” | Callers guess; misuse spreads |
| **Articles** | “How do these pieces fit?” | Reference soup with no map |
| **Tutorials** | “Walk me through a task” | Optional; don’t fake them empty |

Staff rule: libraries need **both** a curated landing article and symbol coverage for `public` API. Tutorials are optional polish—articles + symbols ship first.

**Article shape that reviews well:**

1. Problem in one sentence,
2. Minimal setup,
3. Two or three symbol links with ``double-backticks``,
4. Common failure (“forgot `/` prefix”) with the error shape,
5. Link to deeper article or MigrationGuide.

### 6. Linking literacy

In DocC markdown, link symbols with double backticks (DocC resolves them into the catalog):

```markdown
Use ``ExampleClient/get(_:)`` after you configure credentials.
See <doc:GettingStarted> for the first run.
See <doc:NetworkingOverview#Retries> for retry policy.
```

| Habit | Why |
|-------|-----|
| Link symbols from articles | Keeps concepts tied to real API |
| Prefer ``Type/method(_:)`` form | Ambiguous bare names fail resolution |
| Build docs in CI | Broken links fail loudly |
| Prefer stable symbol names | Renames break links — deprecate first (below) |
| Link articles with `<doc:Name>` | Human navigation, not raw file paths |

Exact syntax can vary slightly by DocC version—treat the [DocC](https://developer.apple.com/documentation/docc) docs as ground truth when something fails to resolve.

**Broken-link lab:**

1. Rename a public method without updating article links.
2. Generate documentation.
3. Confirm the build reports unresolved symbols.
4. Fix with `@available(..., renamed:)` **or** update every ``link``.

### 7. DocC + SPM plugin commands

Packages typically generate docs via the **Swift-DocC plugin** (or Xcode’s documentation build). Pin the plugin version in `Package.swift` the same way you pin other build tools.

```swift
// Package.swift — illustrative literacy (exact package URL/version: pin what you adopt)
// .package(url: "https://github.com/apple/swift-docc-plugin", from: "…"),
```

```bash
# From the package root — typical plugin flows (flags evolve; --help is truth):
swift package generate-documentation
# Builds the DocC archive / site for the package’s documented targets.

swift package generate-documentation --target MyLibrary
# Scope to one target when the package has many.

swift package generate-documentation --transform-for-static-hosting --output-path .docs
# Shape suitable for static hosting (GitHub Pages, internal CDN) — confirm current flags.

swift package plugin --list
# See which plugins Package.swift actually resolved — avoid folklore plugin names.
```

| Surface | Use |
|---------|-----|
| **Xcode → Product → Build Documentation** / doc preview | Fast feedback while writing `///` and articles |
| **`swift package generate-documentation`** | Reproducible package docs on CI |
| **Plugin pin in `Package.swift`** | Same DocC behavior on every agent |
| **Hosted docs** (SPI, Pages, internal site) | One pipeline; pin tool versions |

Preview is a developer accelerant. **CI build** is the review gate.

### 8. Documentation coverage as a CI gate

Treat docs like tests for public surface. A practical gate shape:

| Gate | Idea |
|------|------|
| **Docs build** | `generate-documentation` must exit 0 |
| **Link check** | Unresolved ``symbols`` fail the job |
| **Coverage policy** | New `public`/`open` symbols require `///` (review + optional script) |
| **Release tag job** | Docs artifact published with the version |

```text
PR touches public API
  → require /// on new symbols (human checklist + optional lint)
  → swift package generate-documentation
  → fail on unresolved links / build errors
Release tag
  → same generate + publish static site / SPI refresh
```

Coverage need not mean “100% of internal helpers.” It means: **every shipped public entry point has a summary**, and the catalog builds. Teams sometimes add a simple script that greps `public ` / `open ` declarations without a preceding `///`—treat that as a **policy aid**, not a substitute for human review of *quality*.

“Docs follow in a follow-up” is how follow-ups never happen. Prefer: **API not merged until documented**, or an explicit waiver with an issue link.

### 9. Public API without docs is a smell

If a symbol is `public` / `open`, callers outside your module will use it. Undocumented public API forces tribal knowledge and incorrect use. Staff bar:

- every public type and method has a summary,
- non-obvious parameters and throws are documented,
- isolation/`Sendable` expectations appear when relevant (chapter **10**).

```swift
// Smell: public but silent
public func magic(_ x: Int) -> Int { x &+ 1 }

/// Returns `x` incremented with wraparound arithmetic.
public func nextWireID(_ x: Int) -> Int { x &+ 1 }
```

Prefer `internal` / `package` when only your module graph needs the symbol (chapters **11**, **14**). The cheapest doc is **not making it public**.

### 10. Versioning and API change

Renaming public symbols is breaking. Use deprecation attributes before removal.

```swift
@available(*, deprecated, renamed: "nextWireID")
public func magic(_ x: Int) -> Int { nextWireID(x) }
```

Document migration notes in DocC articles for major shifts (concurrency adoption, error model changes). Update `<doc:MigrationGuide>` in the same PR as the deprecation when the blast radius is team-wide.

---

## 2. Advanced concepts

### 1. Guidelines details worth enforcing in review

| Topic | Guideline habit |
|-------|-----------------|
| Mutating names | `sort` vs `sorted`; `reverse` vs `reversed` |
| Factory methods | `makeIterator()` style when not an initializer |
| Arguments | Default args instead of method explosions when clarity holds |
| Protocols | Name capabilities (`Collection`, `Hashable`); `…able` / `…ing` carefully |
| Weak types | Avoid `Any` in public surfaces without a strong reason |
| Boolean names | `is` / `has` / `includes` — subject clear at call site |

```swift
// Legacy (ObjC-flavored verbosity in new Swift APIs) — do not use in new code.
// func performFetchOfUser(withIdentifier id: String) -> User
// Prefer:
// func user(id: String) async throws -> User
```

### 2. Documentation as a review gate (PR matrix)

| PR touches… | Required gate |
|-------------|---------------|
| New `public` / `open` symbol | `///` summary + throws/isolation notes if non-obvious |
| Rename / behavior change | Deprecation or article migration note |
| New module topic | Landing article updated |
| DocC catalog only | Still build in CI — broken links fail |
| Access control widened to `public` | Instant documentation debt — treat as new API |

### 3. DocC for packages vs apps

Libraries benefit most: DocC is part of the product. Apps may document modules for internal engineers. Host docs with your release (GitHub Pages, Swift Package Index integration, Apple’s developer tools) — pick one pipeline and pin tool versions.

| Audience | Doc investment |
|----------|----------------|
| Open-source package | Landing + GettingStarted + full public symbols |
| Internal shared kit | Same bar if three squads import it |
| App-only `internal` types | Skip DocC theater; keep `///` where Quick Help helps |

### 4. API design under Swift 6

Isolation annotations and `Sendable` requirements are part of the API. Document `@MainActor` types and async requirements so callers do not discover rules only via compiler errors. Prefer designs that compile cleanly under complete checking over “escape hatches” in the public surface.

```swift
/// Calendar mutations for UI. Call only from the main actor.
@MainActor
public final class AgendaStore {
    public func add(_ item: Item) { /* … */ }
}
```

### 5. Examples in docs

Small DocC snippets should compile mentally (or as sample targets). Prefer realistic names over `foo`/`bar`. Mark assumptions (MainActor, requires network). Never paste live secrets into samples.

### 6. Lab — document one public type end-to-end

1. Pick a small `public` type in a package.
2. Write `///` on the type and each public method.
3. Add a one-screen **GettingStarted** article that links two symbols with ``Type/method``.
4. Curate `MyLibrary.md` Topics so the type is not lost in alphabet soup.
5. Preview in Xcode **or** `swift package generate-documentation`.
6. Break a link on purpose; confirm generate fails; fix it.
7. Optional: add a CI job that runs generate on every PR that touches `Sources/` or `*.docc`.

**What just happened:** you proved docs are buildable artifacts—not wiki wishes.

### 7. Naming lab — review card (print this)

```text
Call site under review: _______________________________
Reads aloud as: ______________________________________
Boolean labels are clauses?     [ ] yes  [ ] n/a  [ ] fix
Mutating vs copy naming OK?     [ ] yes  [ ] fix
Needless words stripped?        [ ] yes  [ ] fix
Public? If yes, /// present?    [ ] yes  [ ] make internal  [ ] fix docs
DocC link from article?         [ ] yes  [ ] n/a  [ ] add
```

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Shared kits documented; app targets keep `internal` by default |
| **Systems** | CLI `--help` can align with DocC summaries for commands |
| **Security** | Docs never include live secrets; warn about sensitive parameters |
| **Operations** | CI builds DocC on PRs/release tags; broken docs fail the job |
| **Software engineering** | PR review includes naming + docs for new `public` API |

**Use-case sketches:**

1. **Internal analytics kit** used by three apps → DocC landing + GettingStarted; coverage gate on `public`.
2. **CLI + library package** → DocC for library; `--help` text stays consistent with symbol summaries.
3. **Concurrency migration** → MigrationGuide article + `@available` renames in one release train.
4. **Brownfield silent `public`** → close access or document before the next consumer copies misuse.

---

## 4. Staff-level review checklist

- [ ] New `public`/`open` symbols include meaningful `///` documentation.
- [ ] Call-site clarity matches API Design Guidelines (labels, Boolean names, `sort`/`sorted`) — at least one before/after naming check in the PR when API is new.
- [ ] Deprecations use `@available` with rename/message before breaking removals.
- [ ] DocC catalog (if present) has a **full layout**: landing, articles, symbol backbone; Topics are curated.
- [ ] Symbol links (``Type/member``) resolve; articles use `<doc:…>` where appropriate.
- [ ] Docs **build in CI** via `swift package generate-documentation` (or Xcode doc build) — preview alone is insufficient.
- [ ] Documentation coverage policy is known: silent new public API fails review (waiver needs an issue).
- [ ] Isolation/`async`/`throws` behavior is documented where non-obvious.
- [ ] No unnecessary `public` surface — prefer `internal`/`package` when possible.
- [ ] Examples in docs are realistic and log-safe.
- [ ] SPM DocC plugin (if used) is **pinned** and discoverable via `swift package plugin --list`.
- [ ] “Docs later” waivers have owners and issues — not vibes.

---

## References

- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [DocC](https://developer.apple.com/documentation/docc)
- [DocC on swift.org](https://www.swift.org/documentation/docc/)
- [Documenting a Swift framework or package](https://developer.apple.com/documentation/xcode/documenting-a-swift-framework-or-package)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Swift.org — documentation](https://www.swift.org/documentation/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
