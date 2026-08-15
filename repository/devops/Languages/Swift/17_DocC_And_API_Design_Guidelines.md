# DocC and API Design Guidelines

[← Back to Swift](./README.md)

## What this chapter covers

**DocC** for documentation catalogs, the Swift **API Design Guidelines**, and why **undocumented public API** is a staff-level smell. Default is **Swift 6.3.x** / Swift 6 language mode.

Public API is a promise. Names, argument labels, and doc comments are how that promise is taught. DocC turns comments and articles into browsable docs you can ship with a package or framework. Documentation is also a **review gate**—not a rainy-day chore.

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

Rewrite these call sites until a new teammate can guess behavior without jumping to definitions:

```swift
// Before (smells) — do not ship as public API style
func getUserData(_ i: String, f: Bool) -> User?
func performFetchOfUser(withIdentifier id: String) -> User
func toggle(_ x: inout Bool)
xs.remove(at: i)  // fine actually — contrast with:
xs.rm(i)          // cryptic
```

```swift
// After (direction) — clarity at the point of use
func user(id: String) async throws -> User
func user(id: String, includeInactive: Bool) async throws -> User?
// Prefer returning new values over mysterious inout flags when practical:
func toggled(_ value: Bool) -> Bool { !value }
```

| Guideline check | Passes when… |
|-----------------|--------------|
| Read the call aloud | It sounds like a sentence fragment that means something |
| Boolean argument | Label reads as a clause (`includeInactive:`), not `flag:` |
| Mutation | `sort` mutates; `sorted` returns — names tell you |
| Weak types | `Any` / untyped IDs are justified or gone |

### 3. Documentation comments

Use `///` (or `/** */`) on public declarations. Triple-slash comments feed DocC and Quick Help.

```swift
/// A network client for the Example service.
///
/// Create one client per session and reuse it for connection pooling.
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

### 4. DocC catalog structure

A **DocC catalog** is usually a folder ending in `.docc` that holds:

| Piece | Role |
|-------|------|
| **Symbol docs** | From `///` in source — the API reference backbone |
| **Articles** | Conceptual pages (`.md` in the catalog) — how to think / how to start |
| **Extensions / topic files** | Curate landing pages and topic groups |
| **Assets** | Images/diagrams for articles (keep them light) |
| **Tutorials** (optional) | Guided, step-oriented teaching — heavier lift |

Typical mental layout:

```text
Sources/MyLibrary/
  MyLibrary.docc/
    MyLibrary.md              # landing / catalog root article
    GettingStarted.md        # article
    NetworkingOverview.md    # article
    Resources/               # optional images
  ExampleClient.swift        # /// comments → symbols
```

```bash
# Package with DocC plugin / Swift-DocC — typical package flow:
swift package generate-documentation
# Exact flags depend on plugin version — pin the plugin in Package.swift.
```

Xcode can **preview** docs for frameworks and packages. CI can build docs to catch broken links and missing symbols.

### 5. Articles vs symbols

| Kind | Answers | Failure mode if missing |
|------|---------|-------------------------|
| **Symbol pages** | “What is this type/method?” | Callers guess; misuse spreads |
| **Articles** | “How do these pieces fit?” | Reference soup with no map |
| **Tutorials** | “Walk me through a task” | Optional; don’t fake them empty |

Staff rule: libraries need **both** a curated landing article and symbol coverage for `public` API. An alphabetical dump of symbols is not a product.

### 6. Linking literacy

In DocC markdown, link symbols with double backticks (DocC resolves them into the catalog):

```markdown
Use ``ExampleClient/get(_:)`` after you configure credentials.
See <doc:GettingStarted> for the first run.
```

| Habit | Why |
|-------|-----|
| Link symbols from articles | Keeps concepts tied to real API |
| Build docs in CI | Broken links fail loudly |
| Prefer stable symbol names | Renames break links — deprecate first (below) |

Exact syntax can vary slightly by DocC version—treat the [DocC](https://developer.apple.com/documentation/docc) docs as ground truth when something fails to resolve.

### 7. Preview and ship

| Surface | Use |
|---------|-----|
| **Xcode doc preview** | Fast feedback while writing `///` and articles |
| **`swift package generate-documentation`** | Reproducible package docs |
| **CI job on release tags** | Gate: docs build + link check |
| **Hosted docs** (SPI, Pages, internal site) | Pick one pipeline; pin tool versions |

Preview is a developer accelerant. **CI build** is the review gate.

### 8. Public API without docs is a smell

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

### 9. Versioning and API change

Renaming public symbols is breaking. Use deprecation attributes before removal.

```swift
@available(*, deprecated, renamed: "nextWireID")
public func magic(_ x: Int) -> Int { nextWireID(x) }
```

Document migration notes in DocC articles for major shifts (concurrency adoption, error model changes).

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

```swift
// Legacy (ObjC-flavored verbosity in new Swift APIs) — do not use in new code.
// func performFetchOfUser(withIdentifier id: String) -> User
// Prefer:
// func user(id: String) async throws -> User
```

### 2. Documentation as a review gate

Treat docs like tests for public surface:

| PR touches… | Required gate |
|-------------|---------------|
| New `public` / `open` symbol | `///` summary + throws/isolation notes if non-obvious |
| Rename / behavior change | Deprecation or article migration note |
| New module topic | Landing article updated |
| DocC catalog only | Still build in CI — broken links fail |

“Docs follow in a follow-up” is how follow-ups never happen. Prefer: **API not merged until documented**, or an explicit waiver with an issue link.

### 3. DocC for packages vs apps

Libraries benefit most: DocC is part of the product. Apps may document modules for internal engineers. Host docs with your release (GitHub Pages, Swift Package Index integration, Apple’s developer tools) — pick one pipeline and pin tool versions.

### 4. API design under Swift 6

Isolation annotations and `Sendable` requirements are part of the API. Document `@MainActor` types and async requirements so callers do not discover rules only via compiler errors. Prefer designs that compile cleanly under complete checking over “escape hatches” in the public surface.

### 5. Examples in docs

Small DocC snippets should compile mentally (or as sample targets). Prefer realistic names over `foo`/`bar`. Mark assumptions (MainActor, requires network). Never paste live secrets into samples.

### 6. Lab — document one public type end-to-end

1. Pick a small `public` type in a package.
2. Write `///` on the type and each public method.
3. Add a one-screen **GettingStarted** article that links two symbols.
4. Preview in Xcode **or** generate documentation on the CLI.
5. Break a link on purpose; confirm CI/local generate fails; fix it.

**What just happened:** you proved docs are buildable artifacts—not wiki wishes.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Shared kits documented; app targets keep `internal` by default |
| **Systems** | CLI `--help` can align with DocC summaries for commands |
| **Security** | Docs never include live secrets; warn about sensitive parameters |
| **Operations** | CI builds DocC on release tags; broken docs fail the job |
| **Software engineering** | PR review includes naming + docs for new `public` API |

---

## 4. Staff-level review checklist

- [ ] New `public`/`open` symbols include meaningful `///` documentation.
- [ ] Call-site clarity matches API Design Guidelines (labels, Boolean names, `sort`/`sorted`).
- [ ] Deprecations use `@available` with rename/message before breaking removals.
- [ ] DocC catalog (if present) distinguishes **articles** vs **symbols**; landing page is curated.
- [ ] Symbol links resolve; docs **build in CI** (preview alone is insufficient).
- [ ] Isolation/`async`/`throws` behavior is documented where non-obvious.
- [ ] No unnecessary `public` surface — prefer `internal`/`package` when possible.
- [ ] Examples in docs are realistic and log-safe.
- [ ] “Docs later” waivers have owners and issues — not vibes.

---

## References

- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- [DocC](https://developer.apple.com/documentation/docc)
- [DocC on swift.org](https://www.swift.org/documentation/docc/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Swift.org — documentation](https://www.swift.org/documentation/)
