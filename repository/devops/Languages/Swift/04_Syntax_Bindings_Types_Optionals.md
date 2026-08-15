# Syntax: bindings, types, and optionals

[← Back to Swift](./README.md)

## What this chapter covers

Everyday Swift surface area: **`let` / `var`**, type annotations vs **type inference**, **Strings & Characters** (Unicode, **Character vs Unicode scalar**, **multiline** and **raw** strings, **Substring vs String ownership**), **optionals** (binding, chaining, nil-coalescing), **tuples** and **typealiases**, **type casting** (`as` / `as?` / `as!`), and why **implicitly unwrapped optionals** (`Type!`) are brownfield literacy—not a modern default. Examples assume **Swift 6.3.x** / modern Swift 6 language mode habits.

If chapter **00** got you printing hello, this chapter makes the next hundred lines readable—and makes `nil` feel like a type, not a crash waiting to happen.

---

## 1. Concepts

### 1. Bindings: `let` vs `var`

| Binding | Meaning | Default instinct |
|---------|---------|------------------|
| `let` | Immutable name for a value (the binding cannot be reassigned) | Prefer this |
| `var` | Mutable binding | When mutation is intentional and local |

```swift
let host = "api.example.com"  // Binding fixed; readers trust it stays put
var retryCount = 0            // Mutation is part of the algorithm
retryCount += 1               // Current style — not ++ (removed in Swift 3)
```

**What just happened**

- `let` documents intent: this name should not wander.
- Mutation uses `+=`, not legacy `++` / `--` (see chapter **02**).
- Value types (structs, enums, collections with copy-on-write) make `let` even more powerful later—chapter **06**.

### 2. Types you meet immediately

Swift is statically typed. Common starter types:

| Type | Role |
|------|------|
| `Int`, `Double`, `Bool` | Numbers and flags |
| `String`, `Character` | Text (Unicode-aware) |
| `Array<Element>`, `Dictionary<Key, Value>`, `Set<Element>` | Collections |
| `Optional<Wrapped>` written `Wrapped?` | Presence or absence |
| `(A, B)` | Tuples — lightweight product types |

```swift
let answer: Int = 42              // Explicit annotation
let ratio = 0.5                   // Inferred as Double
let enabled = true                // Inferred as Bool
let tags: [String] = ["ci", "ios"]
let headers = ["Accept": "application/json"]  // [String: String]
```

### 3. Type inference (friend, not magic)

The compiler fills in types when the right-hand side makes them obvious. Inference does **not** make Swift dynamic.

```swift
let title = "Handbook"     // String
var scores = [10, 9, 8]    // [Int]
// scores.append("nope")   // Would be a compile-time error — still strictly typed
```

Annotate when:

- the expression is ambiguous or weakly typed at a boundary (`nil` alone, empty collection literals in some positions),
- the annotation documents an API contract,
- you are decoding or bridging and want the type visible in review.

```swift
let emptyStrings: [String] = []   // Annotation disambiguates the element type
let missing: String? = nil        // nil needs a contextual type
```

### 4. Lab — Strings, Characters, and why `string[i]` fails

A `String` is a collection of **extended grapheme clusters** (what humans call “characters”), not a random-access array of bytes or UTF-16 code units. That is why Swift refuses `s[0]` with an `Int`.

```swift
let flag = "🏳️‍🌈"                 // One Character to the eye; many scalars under the hood
print(flag.count)                // 1 — Character count, not byte count
print(flag.utf8.count)           // Larger — UTF-8 code units
print(flag.unicodeScalars.count) // Larger still — scalar view

let greeting = "Hello"
// let bad = greeting[0]         // Does not compile — String.Index required, not Int

let first = greeting[greeting.startIndex]
let second = greeting[greeting.index(after: greeting.startIndex)]

// Safe slice by Character offset (O(n) — indices are not random-access Ints)
if let i = greeting.index(greeting.startIndex, offsetBy: 1, limitedBy: greeting.endIndex) {
    print(greeting[i])           // "e"
}

for (offset, ch) in greeting.enumerated() {
    print(offset, ch)            // Offset is for humans; Index is for String APIs
}
```

**What just happened**

- `count` answers “how many Characters?” — not “how many bytes on the wire?”
- Indexing needs `String.Index` because advancing past combining marks and emoji ZWJ sequences is not constant-time with an `Int`.
- For wire formats and hashing, use `.utf8` / `.utf16` / `Data` deliberately—do not pretend `String` is C’s `char*`.

### 5. Character vs Unicode scalar (see both)

Humans think in **Characters** (extended grapheme clusters). Unicode itself is built from **scalars**. Swift exposes both—pick the view that matches the problem.

```swift
let family = "👨‍👩‍👧‍👦"           // One Character to most UIs
print(family.count)                    // 1 — grapheme cluster
print(family.unicodeScalars.count)     // Many scalars joined with ZWJ

let eAcute: Character = "é"            // May be one precomposed scalar *or* e + combining accent
for scalar in eAcute.unicodeScalars {
    print(scalar, String(scalar.value, radix: 16))
}

// When you need scalar-level work (normalization, parsers, protocols):
let scalars = "café".unicodeScalars
print(scalars.count)

// When you need human-facing length / iteration:
for ch in "café" {
    print(ch)                          // Character walk
}
```

| View | Type you iterate | Use when |
|------|------------------|----------|
| Default `String` / `Character` | Grapheme clusters | UI text, “user-perceived” length |
| `unicodeScalars` | `Unicode.Scalar` | Protocol-level Unicode processing |
| `utf8` / `utf16` | Code units | Wire formats, C interop, hashing bytes |

**What just happened**

- “How long is this string?” is an incomplete question—**which view?**
- Emoji families and flags are the teaching tools that break Int-index intuition forever.
- Staff review smell: mixing Character counts with UTF-8 buffer sizes without naming the unit.

### 6. Multiline strings and raw strings

```swift
// Multiline — leading indentation stripped to the closing quotes’ column
let manifesto = """
    Title: Swift handbook
    Pin: 6.3.x
    Rule: playground ≠ CI
    """

print(manifesto)
// Lines keep internal newlines; common indent before content is removed.

// Interpolation still works inside multiline
let tool = "swift"
let hint = """
    Run `\(tool) --version` before debugging the language.
    """

// Raw strings — backslashes are literal unless you add extra # delimiters for interpolation
let regexIsh = #"\d+\.\d+\.\d+"#          // Backslash is real, not an escape
let pathy = #"C:\temp\swift"#             // Windows-path teaching example — prefer APIs in real code

// Raw + interpolation: close the rawness around the interpolating parens
let version = "6.3.0"
let pattern = #"^Swift \#(version)$"#     // \#(…) interpolates inside raw strings
```

**What just happened**

- `"""` is for readable multi-line content (JSON fixtures, help text, SQL)—indent relative to the closing `"""`.
- `#"…"#` (and more `#` if needed) disables escape processing so regexes and Windows paths stop looking like noise.
- Prefer `FilePath` / URL types for real paths (chapter **13**); raw strings are literacy for literals, not a path API.

### 7. Lab — Substring vs String ownership pitfalls

Slicing a `String` yields a **`Substring`**: a view that shares storage with the original. That is fast—and a footgun if you stash substrings longer than the parent string’s useful lifetime.

```swift
func firstWord(in text: String) -> Substring {
    if let space = text.firstIndex(of: " ") {
        return text[..<space]              // Substring — borrows text’s storage
    }
    return text[...]
}

func firstWordOwned(in text: String) -> String {
    String(firstWord(in: text))            // Copy into a new String — independent ownership
}

var source = "Ada Lovelace"
let borrowed = firstWord(in: source)       // Substring tied to source
let owned = firstWordOwned(in: source)     // String you can keep safely

source = "Grace Hopper"                    // Mutating/reassigning source can invalidate assumptions
print(owned)                               // Still "Ada" — owned is independent
// print(borrowed)                         // Do not casually keep Substring across mutations / long storage

// API boundary habit: accept String, return String unless you are in a tight hot loop
func normalize(_ word: String) -> String {
    word.lowercased()
}
print(normalize(String(borrowed)))
```

| Type | Ownership | Prefer when |
|------|-----------|-------------|
| `String` | Owns its storage (value semantics) | Properties, async boundaries, long-lived model fields |
| `Substring` | View into a base `String` | Local parsing loops; convert with `String(...)` before storing |

**What just happened**

- Slicing is cheap because it **shares**; storing slices in structs can extend the lifetime of huge base strings (memory “leak” shape).
- Crossing APIs, tasks, or stored properties: **promote to `String`**.
- Review smell: `var cache: [Substring]` on a long-lived type.

### 8. Optionals: absence is a type

An optional either holds a wrapped value or `nil`.

```swift
var username: String? = nil   // No username yet
username = "ada"              // Now it holds a String
username = nil                // Absence again — still a valid state
```

You do **not** call methods on a `String?` as if it were a `String`. You unwrap safely first.

### 9. Lab — optional binding, chaining, and nil-coalescing

```swift
struct Profile {
    var displayName: String?
    var settings: Settings?
}

struct Settings {
    var theme: String?
}

func greet(_ name: String?) -> String {
    if let name {                 // Shorthand: bind same name when non-nil
        return "Hello, \(name)"
    }
    return "Hello, guest"
}

func greetGuard(_ name: String?) -> String {
    guard let name, !name.isEmpty else {
        return "Hello, guest"
    }
    return "Hello, \(name)"       // name is String for the rest of the function
}

let profile = Profile(displayName: "Ada", settings: Settings(theme: "dark"))
let theme = profile.settings?.theme ?? "system"
// Optional chaining: if settings is nil, the whole chain is nil — no crash
// Nil-coalescing: ?? supplies a default when the left side is nil

let forced = username!            // Crashes if nil — only when you can prove it cannot be
```

**What just happened**

- `if let` / `guard let` turn `T?` into `T` in a checked scope.
- `?.` stops a chain safely instead of crashing mid-property walk.
- `??` supplies defaults at boundaries (config, UI placeholders).
- `!` is a conscious hazard, not a typing convenience.

### 10. Tuples and typealiases

Tuples bundle a few values without inventing a named type. Typealiases give readable names to existing types.

```swift
typealias HTTPStatus = Int
typealias Headers = [String: String]

func lookup(user id: String) -> (found: Bool, name: String?) {
    if id == "ada" {
        return (true, "Ada")
    }
    return (false, nil)
}

let result = lookup(user: "ada")
print(result.found, result.name ?? "—")

let (ok, name) = lookup(user: "grace")  // Destructure
```

Prefer a `struct` once the tuple grows labels you care about across APIs, needs methods, or appears in many signatures. Tuples shine for short returns and temporary grouping.

### 11. Type casting: `as`, `as?`, `as!`

| Operator | Meaning |
|----------|---------|
| `as` | Guaranteed upcast / bridging the compiler can prove |
| `as?` | Conditional cast → optional; `nil` on failure |
| `as!` | Forced cast → crashes on failure |

```swift
class Animal {}
class Dog: Animal { var bark = "woof" }

let pet: Animal = Dog()
if let dog = pet as? Dog {
    print(dog.bark)
}

let definitely = pet as! Dog      // Only when the type is proven
let up: Animal = definitely as Animal
```

Staff habit: prefer `as?` + binding at runtime boundaries (`Any`, heterogeneous collections, ObjC import). Reserve `as!` for tests and impossible-to-fail bridges you are willing to crash on.

---

## 2. Advanced concepts

### 1. IUO — implicitly unwrapped optionals (`Type!`)

```swift
// Legacy / brownfield (storyboard outlets, late init) — do not use in new code as a shortcut.
var storyboardLabel: String!  // Behaves like String at use sites but may still be nil
```

**Implicitly unwrapped optionals** exist largely because of Interface Builder outlets, late initialization patterns, and Objective-C import history. They postpone safety checks to runtime.

Staff rule for **Swift 6.x** new code:

- Prefer `Type?` + binding, or non-optional properties initialized properly.
- Treat `Type!` in review as “why is this not safe yet?”
- When touching a file for other reasons, tighten IUOs if the migration is cheap and tested.

Modern alternative for “set once after construction”:

```swift
final class Screen {
    private(set) var title: String = ""   // Non-optional once wired
    func configure(title: String) { self.title = title }
}
```

### 2. Optionals at API boundaries

| Boundary | Prefer |
|----------|--------|
| Validated config | Non-optional fields after parse |
| Partial JSON | `Optional` or `Result` / `throws` (chapter **09**) |
| ObjC imported APIs | Read nullability annotations; do not invent force unwraps |

```swift
struct ServerConfig {
    let host: String          // Required after successful parse
    let port: Int
    let token: String?        // Truly optional feature flag / secret
}
```

### 3. Inference edges that bite in review

- Passing `nil` into overloaded functions can pick the wrong overload—annotate.
- Large chained expressions with mixed optionals become unreadable; bind intermediate names.
- `Any` / `AnyObject` erase safety; they are interop and dynamic edges, not a modeling style.
- Empty `[:]` or `[]` without context needs an annotation: `[String: Int]()` or `as [String: Int]`.

### 4. Shadowing in `if let` and multiple bindings

```swift
if let username {
    // Inner username is String; outer remains String?
    print(username)
}

if let settings = profile.settings, let theme = settings.theme {
    print(theme)
}
```

Reusing the name is idiomatic. In denser code, a distinct name (`unwrappedName`) can help newcomers—consistency inside a module matters more than purity.

### 5. Legacy syntax echo (do not resurrect)

```swift
// Legacy (Swift ≤2.2) — removed in Swift 3. Do not use in new code.
// for var i = 0; i < values.count; i++ { ... }
```

```swift
// Current (Swift 6.x)
for value in values {
    print(value)
}
```

### 6. Lab — optional map / flatMap literacy

```swift
let raw: String? = "42"
let number = raw.flatMap { Int($0) }   // String? → Int? without nested optionals
let label = number.map { "port \($0)" } // Int? → String?
```

`map` transforms a present value; `flatMap` flattens one layer of optionality when the transform itself returns an optional. Prefer this over nested `if let` pyramids for short pipelines—use `guard` when the failure path needs a named exit.

### 7. Lab — string views checklist (wire vs UI)

```swift
let payload = "café🎉"
print("characters:", payload.count)
print("utf8 bytes:", payload.utf8.count)
print("utf16 units:", payload.utf16.count)
print("scalars:", payload.unicodeScalars.count)

// Persist / send: be explicit about encoding
let bytes = Array(payload.utf8)
let roundTrip = String(bytes: bytes, encoding: .utf8)
```

**What just happened**

- Four numbers, four meanings—pick the one your protocol documents.
- Round-tripping through UTF-8 is the common network habit; Character count is not a wire length.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | View state: distinguish “loading / missing / value” with optionals or enums—not sentinel empty strings alone; keep display strings Unicode-safe; store `String` not `Substring` in models |
| **Systems** | CLI flags and env vars: parse to non-optional structs early; fail fast on required missing values; treat path strings as UTF-8 deliberately; raw strings for regex fixtures |
| **Security** | Secrets and tokens as `String?` until validated; never log force-unwrapped credential paths that crash into noisy dumps |
| **Operations** | Config DTOs: required vs optional fields documented; `??` defaults explicitly chosen, not accidental; multiline help text in `"""` |
| **Software engineering** | Ban casual `!` and `as!` in style guides; allowlist IUO for known UIKit outlet patterns only; prefer `as?` at `Any` boundaries; Substring stays local |

---

## 4. Staff-level review checklist

- [ ] New code prefers `let` unless mutation is required.
- [ ] Optionals are unwrapped with `if let` / `guard let` / `??` / `?.`—not a culture of `!`.
- [ ] `Type!` appears only with a brownfield or framework reason, not as a typing shortcut.
- [ ] String indexing uses `String.Index` / views (`utf8`, …)—no `Int`-subscript myths from other languages.
- [ ] Character vs scalar vs UTF-8 units are named correctly for the problem.
- [ ] Stored properties and async boundaries use `String`, not lingering `Substring`.
- [ ] Multiline / raw strings used where they clarify literals—not as a path API substitute.
- [ ] Casts at runtime boundaries use `as?`; `as!` has a crash rationale.
- [ ] Empty collections and `nil` sites have enough annotation to be unambiguous.
- [ ] Parsed configs expose non-optional fields for required data.
- [ ] No revived Swift 2-era `++` / C-style `for` in new contributions.

---

## References

- [The Basics (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics)
- [Constants and Variables (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics#Constants-and-Variables)
- [Optionals (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics#Optionals)
- [Optional Chaining (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/optionalchaining)
- [Strings and Characters (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters)
- [Type Casting (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [String (Swift stdlib)](https://developer.apple.com/documentation/swift/string)
- [Substring (Swift stdlib)](https://developer.apple.com/documentation/swift/substring)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
