# Properties, methods, init, and deinit

[← Back to Swift](./README.md)

## What this chapter covers

**Stored** and **computed** properties, **`willSet` / `didSet`**, **`lazy`** pitfalls, **methods** and **subscripts**, **key paths**, **property wrappers** (mechanics + a tiny custom wrapper lab), **initializers** (failable, throwing, convenience vs designated), and **`deinit`**. Default is **Swift 6.3.x** / Swift 6 language mode.

Types are not only fields: how values are created, derived, and torn down is where many production bugs hide — half-initialized objects, lazy side effects, and wrapper magic that reviewers cannot see.

---

## 1. Concepts

### 1. Stored vs computed properties

Stored properties hold values. Computed properties calculate `get` (and optionally `set`) without their own storage.

```swift
struct Temperature {
    var celsius: Double

    var fahrenheit: Double {
        get { celsius * 9 / 5 + 32 }
        set { celsius = (newValue - 32) * 5 / 9 }
    }
}
```

Read-only computed properties omit `set`.

### 2. Lab — `willSet` / `didSet`

Property observers run on stored properties when the value changes (not during most `init` assignments on the designated path).

```swift
struct Thermostat {
    var celsius: Double {
        willSet {
            print("will change to \(newValue)")
        }
        didSet {
            print("was \(oldValue), now \(celsius)")
        }
    }
}

var t = Thermostat(celsius: 20)
t.celsius = 22
// will change to 22
// was 20, now 22
```

**What just happened**

- `willSet` sees `newValue` before the store; `didSet` sees `oldValue` after.
- Observers are for lightweight reactions (clamp, notify)—not for heavy IO. Prefer explicit methods when side effects grow.
- Setting the property inside `didSet` can re-enter observers—keep that intentional and bounded.

### 3. Methods and subscripts

Instance methods use instance state. `static` methods belong to the type. On value types, methods that mutate storage need `mutating` (chapter **06**).

```swift
struct Grid {
    var cells: [[Int]]

    subscript(row: Int, column: Int) -> Int {
        get { cells[row][column] }
        set { cells[row][column] = newValue }
    }
}
```

Subscripts are APIs for keyed or indexed access — keep bounds behavior explicit (trap vs optional) and document it.

### 4. Lab — key paths (`\Type.property`)

A **key path** is a typed, first-class reference to a property (or nested chain). Use it to abstract “which field” without writing a closure every time.

```swift
struct Person {
    var name: String
    var age: Int
}

let people = [
    Person(name: "Ada", age: 36),
    Person(name: "Grace", age: 85)
]

let names = people.map(\.name)           // Key path as a function (WritableKeyPath / KeyPath)
let ages = people.map(\Person.age)

let namePath = \Person.name
print(people[0][keyPath: namePath])      // "Ada"

func sortedBy<T, V: Comparable>(_ values: [T], _ path: KeyPath<T, V>) -> [T] {
    values.sorted { $0[keyPath: path] < $1[keyPath: path] }
}

let byAge = sortedBy(people, \.age)
```

**What just happened**

- `\Person.name` is a value of type `KeyPath<Person, String>` (writable variants exist for `var`).
- Many stdlib APIs accept key paths; they read like columns in a table.
- Prefer key paths over stringly-typed `"name"` selectors—typos become compile errors.

### 5. Initialization basics

Initializers ensure every stored property has a value before the instance is used. Structs get a memberwise initializer when rules allow.

```swift
struct User {
    let id: String
    var name: String

    init(id: String, name: String = "anonymous") {
        self.id = id
        self.name = name
    }
}
```

### 6. Failable and throwing initializers

`init?` returns an optional instance; throwing `init` propagates failure as an error. Prefer these over trapping constructors.

```swift
struct Port {
    let number: Int

    init?(number: Int) {
        guard (1...65535).contains(number) else { return nil }
        self.number = number
    }

    init(parsing text: String) throws {
        guard let n = Int(text), (1...65535).contains(n) else {
            throw PortError.invalid(text)
        }
        self.number = n
    }
}

enum PortError: Error {
    case invalid(String)
}

let ok = Port(number: 8080)
let bad = Port(number: 0)                 // nil
let parsed = try? Port(parsing: "443")
```

```swift
// Legacy / crash-oriented — do not use in new library APIs.
// init!(number: Int) { ... }   // IUO failable — prefer init? or throws
```

### 7. `deinit` (classes only)

```swift
final class FileWatch {
    deinit {
        stopWatching()
    }
}
```

`deinit` runs when the last strong reference goes away. It cannot take parameters and is not called manually. Do not do heavy async work in `deinit`; cancel tasks and release resources. Structs and enums have no `deinit`.

---

## 2. Advanced concepts

### 1. Lazy pitfalls

`lazy var` initializes on first access. It must be a `var`. Useful for expensive setup that may never run — dangerous when first access has surprising side effects or thread races.

```swift
final class Report {
    lazy var rendered: String = {
        print("building PDF…")          // Side effect on first read — easy to miss
        return buildPDF()
    }()
}

let report = Report()
// rendered not built yet
_ = report.rendered                     // builds once
_ = report.rendered                     // reused
```

Under concurrency, lazy initialization is **not** a substitute for an actor or lock. Prefer explicit setup methods when access can race (chapter **10**). Also: `lazy` properties cannot be observed with `willSet`/`didSet` in the usual way—another reason to keep them rare.

### 2. Property wrappers — mechanics + DIY lab

A property wrapper is a type marked `@propertyWrapper` with a `wrappedValue`. Applying `@Wrapper` rewrites storage through that type. Optional `projectedValue` becomes `$property`.

```swift
@propertyWrapper
struct Clamped {
    private var value: Int
    private let range: ClosedRange<Int>

    var wrappedValue: Int {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }

    var projectedValue: ClosedRange<Int> { range }  // exposed as $volume

    init(wrappedValue: Int, _ range: ClosedRange<Int>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct Settings {
    @Clamped(0...100) var volume = 50
}

var s = Settings()
s.volume = 200
print(s.volume)       // 100 — clamped
print(s.$volume)      // 0...100 — projectedValue
```

**What just happened**

- `@Clamped` is storage policy, not magic syntax.
- `wrappedValue` is what you read/write as `volume`.
- `projectedValue` is what `$volume` means—SwiftUI’s `$binding` uses the same mechanism (chapter **19**).
- Read wrappers as **policies** in review; expand them mentally to “extra stored property of wrapper type.”

### 3. Convenience vs designated (classes)

Designated initializers fully initialize the instance. Convenience initializers call another initializer on `self` (`self.init(...)`). Subclass rules enforce that initialization cannot skip a layer.

```swift
class Document {
    var title: String
    var body: String

    // Designated
    init(title: String, body: String) {
        self.title = title
        self.body = body
    }

    // Convenience — must call a designated on self
    convenience init(title: String) {
        self.init(title: title, body: "")
    }
}

class Memo: Document {
    var tagged: Bool

    init(title: String, body: String, tagged: Bool) {
        self.tagged = tagged
        super.init(title: title, body: body)  // Then customize
    }

    convenience init(tagged: Bool) {
        self.init(title: "untitled", body: "", tagged: tagged)
    }
}
```

Two-phase initialization for classes: all stored properties set (down the chain via `super.init`), then customization. Do not call overridable methods from `init` expecting subclass overrides to see a finished object — classic hazard.

Prefer fewer designated paths; convenience wrappers for defaults.

### 4. Required and factory-style inits

`required init` forces subclasses to implement an initializer — common with framework patterns. Factory `static` methods are often clearer for parsing (“return optional or throw”) than a zoo of failable designated inits.

### 5. Type properties

`static` (and `class` for overridable class properties) store or compute per-type state. Global mutable type properties are shared state — treat them like singletons in review.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Config with validated `init?` / throwing inits; computed properties for derived UI strings; key paths for table columns and form fields |
| **Systems** | Avoid `lazy` for thread-shared state; prefer explicit warm-up in `main` or a Task; wrappers for clamping/metrics at the property edge |
| **Security** | Do not put secrets in `static` properties that live for process lifetime without a wipe story; observers must not log secret `newValue`s |
| **Operations** | CLI option structs: failable or throwing init from argv; fail fast before side effects; `deinit` as safety net, not the only close path |
| **Software engineering** | Keep `init` boring; side effects belong in named methods; document every custom property wrapper’s policy |

Resource ownership: if a class opens a handle in `init`, close it in `deinit` *or* (better) use a scope that closes explicitly and make `deinit` a safety net.

---

## 4. Staff-level review checklist

- [ ] Every stored property is initialized on all paths; no half-built instances escape.
- [ ] Failable/throwing inits used for invalid input; no trapping “assert inits” in library APIs.
- [ ] `willSet`/`didSet` stay light; no hidden network/disk work in observers.
- [ ] `lazy` side effects are intentional and concurrency-safe.
- [ ] Property wrappers are understood (wrapped vs projected); not cargo-culted.
- [ ] Key paths preferred over stringly property names where they fit.
- [ ] Class initializer chains are minimal; convenience vs designated is correct; no careless overridable calls from `init`.
- [ ] `deinit` is light; no async fire-and-forget as the cleanup strategy.

---

## References

- [Properties (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [Methods (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [Subscripts (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
- [Initialization (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Deinitialization (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/deinitialization/)
- [Key-Path Expressions (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/expressions#Key-Path-Expression)
- [Swift standard library — KeyPath](https://developer.apple.com/documentation/swift/keypath)
