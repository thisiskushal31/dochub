# Foundation and core libraries

[← Back to Swift](./README.md)

## What this chapter covers

**Foundation** for everyday work: **`URL`**, **`Data`**, **JSON**, **dates/calendars**, **FileManager**, **URLSession** async, **Dispatch** literacy, **Combine** one-screen literacy, **NotificationCenter** caution, and the **Darwin vs swift-corelibs-Foundation** split for Linux CI. Default is **Swift 6.3.x** / Swift 6 language mode.

Foundation is not the standard library. On Apple platforms it is deep and battle-tested; on Linux you depend on **corelibs** with intentional gaps. Always know which platform your package claims to support. Picture Foundation as the city’s utilities — water, power, roads — while the stdlib is the grammar you speak at home.

---

## 1. Concepts

### 1. `URL`, files, and FileManager

`URL` models file and network locations. Prefer URL APIs over raw path string concatenation.

```swift
import Foundation

let file = URL(fileURLWithPath: "/tmp/example.txt")
let remote = URL(string: "https://example.com/api")!

let dir = FileManager.default.temporaryDirectory
let out = dir.appendingPathComponent("out.json")

let fm = FileManager.default
if !fm.fileExists(atPath: dir.path) {
    try fm.createDirectory(at: dir, withIntermediateDirectories: true)
}
```

**What just happened.** `FileManager` handles existence, directories, and copies. Check return values / thrown errors; do not assume success. Temp directories + UUID names keep parallel tests from colliding (chapter **16**).

### 2. `Data`

`Data` is a byte buffer. Bridge to strings with explicit encodings.

```swift
let text = "hello"
guard let bytes = text.data(using: .utf8) else { fatalError("utf8") }
let back = String(data: bytes, encoding: .utf8)
```

Reading files: `Data(contentsOf:)` is fine for small local files; large or remote payloads need streaming / URLSession.

### 3. Lab — URLSession async/await

```swift
func fetch(_ url: URL) async throws -> Data {
    let (data, response) = try await URLSession.shared.data(from: url)
    guard let http = response as? HTTPURLResponse,
          (200..<300).contains(http.statusCode) else {
        throw URLError(.badServerResponse)
    }
    return data
}

func fetchJSON<T: Decodable>(_ url: URL, as type: T.Type) async throws -> T {
    let data = try await fetch(url)
    return try JSONDecoder().decode(T.self, from: data)
}
```

```swift
// Legacy (completion-handler URLSession) — do not use in new code.
// URLSession.shared.dataTask(with: url) { data, response, error in ... }.resume()
// Prefer: try await URLSession.shared.data(from:)
```

**What just happened.** Modern URL loading is `async throws`. Separate **transport failures** (thrown by URLSession) from **HTTP status** (your guard) from **decode failures** (JSONDecoder) — callers need those distinctions.

### 4. Lab — JSONDecoder strategies

```swift
struct Payload: Codable {
    var id: Int
    var createdAt: Date
    var displayName: String
}

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
decoder.dateDecodingStrategy = .iso8601

let encoder = JSONEncoder()
encoder.keyEncodingStrategy = .convertToSnakeCase
encoder.dateEncodingStrategy = .iso8601
encoder.outputFormatting = [.sortedKeys]

// Explicit beats folklore — teams fight when one side uses seconds-since-1970
// and the other uses iso8601 without saying so.
```

**What just happened.** Defaults differ across codebases and break clients. Configure date strategies, key strategies, and fractional seconds explicitly. Snapshot-test golden JSON for public wire formats.

### 5. Dates, calendars, and timezone pitfalls

`Date` is an instant (absolute point in time). Display and calendar math go through `Calendar`, formatters, or `FormatStyle` on modern Apple SDKs.

```swift
let now = Date()
let iso = ISO8601DateFormatter()
iso.timeZone = TimeZone(secondsFromGMT: 0)
print(iso.string(from: now))

var cal = Calendar(identifier: .gregorian)
cal.timeZone = TimeZone(identifier: "America/Los_Angeles")!

// Pitfall: "start of day" depends on the calendar's time zone.
let startLA = cal.startOfDay(for: now)

cal.timeZone = TimeZone(secondsFromGMT: 0)!
let startUTC = cal.startOfDay(for: now)
// startLA and startUTC are different instants for the same "now"
```

**What just happened.** Store UTC instants (or timezone-aware wire formats you document). Format in the user’s locale at the edge. Never serialize `DateFormatter` strings without documenting the format and timezone. “Midnight” without a timezone is a bug factory.

### 6. Dispatch literacy (not the modern default)

Grand Central Dispatch (`DispatchQueue`) still underlies much of the stack. New application concurrency prefers `async`/`await` (chapter **10**). You still read GCD in older code and some system callbacks.

```swift
import Dispatch

// Legacy (GCD as primary app concurrency) — do not use in new code.
// DispatchQueue.global().async { ... DispatchQueue.main.async { ... } }
//
// Prefer: async functions, actors, @MainActor (chapter 10).

let q = DispatchQueue(label: "example.serial")
q.sync {
    // serial critical section — literacy when bridging
}
```

**When GCD still appears.** Vendor SDKs that callback on arbitrary queues; low-level synchronization you have not yet migrated; Instruments stacks that name queues. Bridge into async with checked continuations (chapter **10**), then stop building new pyramids.

### 7. Lab — FileManager round-trip

```swift
func writeTempJSON(_ data: Data) throws -> URL {
    let dir = FileManager.default.temporaryDirectory
        .appendingPathComponent(UUID().uuidString, isDirectory: true)
    try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    let file = dir.appendingPathComponent("payload.json")
    try data.write(to: file, options: .atomic)
    defer {
        // Callers may keep the URL; clean in tests with removeItem when done.
    }
    return file
}

func readTempJSON(at url: URL) throws -> Data {
    try Data(contentsOf: url)
}
```

**What just happened.** Atomic writes reduce torn files. UUID directories keep parallel tests honest. Always plan cleanup (`removeItem`) for temp trees in tests and CLIs — disks fill quietly in CI.

---

## 2. Advanced concepts

### 1. Darwin Foundation vs swift-corelibs-Foundation

| Environment | Foundation story |
|-------------|------------------|
| **Apple (Darwin)** | Full Foundation / Darwin; URLSession, formatters, etc. mature |
| **Linux** | **swift-corelibs-Foundation** — large subset; not identical |
| **Windows** | Improving; verify APIs you need before promising support |

```swift
#if canImport(Darwin)
import Darwin
#else
import Glibc   // or platform libc — depends on toolchain
#endif

#if os(Linux)
// Prefer APIs you have actually run under corelibs in CI
#endif
```

**What just happened.** Linux CI that “compiles” is not the same as “URLSession + formatter behavior matches macOS.” Write portable packages against APIs you have tested on each OS. `#if os(Linux)` and availability checks beat assumptions.

### 2. Combine literacy — one screen, not a book

Combine is Apple’s reactive pipeline framework. New Swift concurrency + Observation cover many app needs; Combine remains in brownfield and some Apple APIs.

```swift
import Combine

// Literacy shape — one pipeline:
let ticks = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
var bag = Set<AnyCancellable>()

ticks
    .map { _ in Date() }
    .sink { date in
        print("tick \(date)")
    }
    .store(in: &bag)

// Publisher → operators → sink/assign; cancel via AnyCancellable.
// Legacy for new feature work when async sequences / Observation suffice —
// still read it when maintaining existing trees.
```

**What just happened.** A Combine pipeline is a publisher, zero or more operators, and a subscriber held in a bag so it stays alive. Prefer `AsyncSequence` / `Observations` (chapter **10**) for new designs unless an API forces Combine.

### 3. NotificationCenter caution

```swift
import Foundation

extension Notification.Name {
    static let didRefresh = Notification.Name("didRefresh")
}

// Caution: stringly typed, process-wide, easy to overuse as an event bus.
NotificationCenter.default.post(name: .didRefresh, object: nil)

let token = NotificationCenter.default.addObserver(
    forName: .didRefresh,
    object: nil,
    queue: .main
) { _ in
    print("refreshed")
}
// Remember to removeObserver / store the token — leaks and double-fires are common.
```

**Staff habit.** Prefer typed callbacks, delegates, async streams, or Observation for app architecture. NotificationCenter is fine for coarse system events; it is a poor substitute for a clear ownership graph.

### 4. Localization and formatters

Formatters are relatively expensive to create — reuse them. They are often not thread-safe historically; prefer creating per-use on modern FormatStyle paths or isolate carefully. Document locale assumptions in APIs that accept raw strings.

### 5. Property lists, bundles, and resources

`Bundle`, `PropertyListSerialization`, and Info.plist keys appear constantly in apps. Packages on Linux may lack AppKit/UIKit bundle patterns — keep “resources via SPM `resources:`” in the package design (chapter **14**).

### 6. Time and clocks

For tests and servers, prefer injectable clocks / `ContinuousClock` (Swift concurrency time APIs) over scattering `Date()` calls. Foundation dates remain the interchange format with many Apple APIs.

### 7. URLSession configuration literacy

`URLSession.shared` is convenient; production clients often need a configured session: timeouts, caching policy, delegate for auth challenges, and bounded concurrent connections.

```swift
func makeSession() -> URLSession {
    let config = URLSessionConfiguration.ephemeral
    config.timeoutIntervalForRequest = 30
    config.waitsForConnectivity = true
    return URLSession(configuration: config)
}
```

**What just happened.** Ephemeral sessions skip persistent cookie/cache disk — useful for CLIs and tests. App sessions may prefer `.default` with an explicit cache story. Do not disable ATS / TLS validation to “make CI green.”

### 8. Error taxonomy at the network edge

| Layer | Example | Caller should |
|-------|---------|---------------|
| Transport | DNS / offline / cancelled | Retry or surface connectivity |
| HTTP | 401 / 404 / 500 | Map to domain errors |
| Decode | wrong shape / date strategy | Fix contract or tolerate versioning |

Collapsing all three into one `Error` string is how support tickets become archaeology.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Codable models at boundaries; URLSession async; format dates for UI only; Observation over new Combine |
| **Systems** | Explicit JSON strategies; portable `#if` for corelibs gaps; FileManager errors handled |
| **Security** | ATS / TLS defaults matter on Apple; do not disable without review; no secrets in logs of `Data` |
| **Operations** | Timeouts on network; size limits on `Data(contentsOf:)`; temp files cleaned with `defer` |
| **Software engineering** | One shared encoder config; snapshot tests for JSON golden files; Linux CI proves claimed APIs |

---

## 4. Staff-level review checklist

- [ ] New concurrency uses async Foundation APIs, not fresh GCD pyramids.
- [ ] JSON date/key strategies are explicit and tested.
- [ ] Calendar/timezone behavior is documented at “start of day” and formatting edges.
- [ ] Linux/Windows support claims match corelibs reality for used APIs.
- [ ] Paths built with `URL` / `FileManager`, not ad-hoc string joins.
- [ ] Combine appears as brownfield literacy or forced API — not the default for new work.
- [ ] NotificationCenter is not the app-wide event bus without a clear reason.
- [ ] Network errors distinguished from HTTP status and decode errors for callers.
- [ ] Formatters/locale behavior documented at API edges.

---

## References

- [Foundation](https://developer.apple.com/documentation/foundation)
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession)
- [Dispatch](https://developer.apple.com/documentation/dispatch)
- [Combine](https://developer.apple.com/documentation/combine)
- [Swift.org — documentation](https://www.swift.org/documentation/)
- [Adopting Swift 6](https://developer.apple.com/documentation/swift/adoptingswift6)
