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

#### Key path composition (chains you can build)

Key paths **compose**: append a path to dig deeper without writing nested closures.

```swift
struct Address {
    var city: String
    var zip: String
}

struct Employee {
    var name: String
    var address: Address
}

let employees = [
    Employee(name: "Ada", address: Address(city: "London", zip: "E1")),
    Employee(name: "Grace", address: Address(city: "NYC", zip: "10001"))
]

let cityPath = \Employee.address.city          // Written as a chain
let cities = employees.map(\.address.city)     // Same idea via map

// Compose from pieces — useful when a library hands you a partial path
let toAddress = \Employee.address
let toCity = toAddress.appending(path: \.city) // KeyPath<Employee, String>
print(employees[0][keyPath: toCity])           // "London"

// Writable: mutate through a key path
var first = employees[0]
let writableCity: WritableKeyPath<Employee, String> = \.address.city
first[keyPath: writableCity] = "Cambridge"
print(first.address.city)                      // "Cambridge"
```

| Type (literacy) | Meaning |
|-----------------|---------|
| `KeyPath<Root, Value>` | Read-only path |
| `WritableKeyPath<Root, Value>` | Read/write on value types / stored vars |
| `ReferenceWritableKeyPath<Root, Value>` | Read/write through a class reference root |

```swift
final class Box {
    var label: String
    init(_ label: String) { self.label = label }
}

let labelPath: ReferenceWritableKeyPath<Box, String> = \.label
let box = Box("a")
box[keyPath: labelPath] = "b"                  // Mutates shared object
```

**What just happened**

- `\A.b.c` is composition sugar; `appending(path:)` builds the same idea from parts.
- Writable vs reference-writable matters when the root is a class—you are mutating shared identity.
- Use composition for form/table layers (“all rows, this nested field”) instead of ad-hoc closures that drift.

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

`deinit` runs when the last strong reference goes away. It cannot take parameters and is not called manually. Do not do heavy async work in `deinit`; cancel tasks and release resources. Structs and enums have no `deinit` **unless** they are noncopyable (`~Copyable`)—those can run cleanup when the unique owner ends (chapter **06**). Same *cleanup* idea; different *identity* story.

```swift
// Class deinit — last strong ref
final class SocketBox {
    deinit { print("socket box gone") }
}

// Noncopyable deinit — unique owner (sketch; see ch 06)
struct UniqueToken: ~Copyable {
    deinit { print("token retired") }
}
```

**What just happened**

- Class `deinit` pairs with ARC and possible cycles (chapter **11**).
- Noncopyable `deinit` pairs with move-only ownership—no reference graph, one owner.
- Prefer explicit `close()` / `cancel()` APIs; treat `deinit` as the safety net.

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

#### Property wrappers — composition and review depth

Wrappers can stack. Outer wrappers see the inner wrapper’s `wrappedValue` as *their* storage surface—order matters.

```swift
@propertyWrapper
struct Logged<Value> {
    private var value: Value
    var wrappedValue: Value {
        get { value }
        set {
            print("set \(newValue)")
            value = newValue
        }
    }
    init(wrappedValue: Value) { self.value = wrappedValue }
}

@propertyWrapper
struct NonEmpty {
    private var value: String
    var wrappedValue: String {
        get { value }
        set { value = newValue.isEmpty ? value : newValue }
    }
    var projectedValue: Bool { value.isEmpty }  // $name → is emptiness?
    init(wrappedValue: String) {
        self.value = wrappedValue.isEmpty ? "(unset)" : wrappedValue
    }
}

struct Form {
    // Order: outermost wrapper is written first (literacy — verify with Expand when unsure)
    @Logged @NonEmpty var title = "Draft"
}

var form = Form()
form.title = ""                  // NonEmpty rejects empty; Logged still observes attempts
form.title = "Ship"
print(form.title)                // "Ship"
print(form.$title)               // projectedValue from the outermost wrapper that exposes one
```

**What just happened**

- Stacking is powerful and easy to over-clever—prefer one clear policy per property in app code.
- `$property` means **projectedValue**—read the wrapper type; do not guess from SwiftUI muscle memory alone.
- In PR review: ask “what storage exists after desugaring?” If nobody can answer, expand or reject the mysticism.

Wrappers that touch global process state (`UserDefaults`, singletons) hide I/O in property syntax. Fine for tiny tools; dangerous in libraries and tests unless injectable. Prefer explicit methods when the side effect is the point.

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

### 6. Init rules that bite in review

| Rule | Why it matters |
|------|----------------|
| All stored props set before use | No half-built instances |
| Class: call `super.init` after own props, before using `self` freely | Two-phase init |
| Observers often skip init assignments | Do not rely on `didSet` for construction |
| Failable `init?` vs `throws` | Prefer clear failure channels over traps |
| Memberwise vs custom `init` on structs | Custom init can suppress memberwise—provide what callers need |

```swift
struct Config {
    var host: String
    var port: Int

    // Custom init — memberwise may no longer be synthesized the way you expect
    init?(host: String, port: Int) {
        guard !host.isEmpty, (1...65535).contains(port) else { return nil }
        self.host = host
        self.port = port
    }
}
```

**What just happened**

- Validation belongs in `init?` / `throws`, not in a later “hope someone called configure().”
- When you add a custom struct `init`, check call sites still have a ergonomic construction path.

### 7. Subscripts beyond grids

Named subscript parameters keep call sites readable—document trap-vs-optional behavior the same way you would for a method:

```swift
struct HeaderMap {
    private var storage: [String: String] = [:]
    subscript(header name: String) -> String? {
        get { storage[name.lowercased()] }
        set { storage[name.lowercased()] = newValue }
    }
}
```

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
- [ ] Key path **composition** (`appending` / nested `\a.b.c`) is used where it clarifies tables/forms.
- [ ] Writable vs reference-writable key paths match the root’s value/reference semantics.
- [ ] Stacked property wrappers are justified; reviewers can state wrapped vs projected meaning.
- [ ] Wrappers that touch globals (`UserDefaults`, singletons) are treated as hidden I/O.
- [ ] Class vs noncopyable `deinit` stories are not confused (chapter **06**).

---

## References

- [Properties (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [Methods (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
- [Subscripts (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
- [Initialization (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Deinitialization (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/deinitialization/)
- [Key-Path Expressions (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/expressions#Key-Path-Expression)
- [Swift standard library — KeyPath](https://developer.apple.com/documentation/swift/keypath)
- [Swift standard library — WritableKeyPath](https://developer.apple.com/documentation/swift/writablekeypath)
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
