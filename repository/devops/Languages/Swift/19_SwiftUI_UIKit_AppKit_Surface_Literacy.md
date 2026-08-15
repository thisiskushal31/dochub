# SwiftUI, UIKit, and AppKit — surface literacy

[← Back to Swift](./README.md)

## What this chapter covers

Enough **UI framework literacy** to read app PRs, know which stack you are looking at, and wire **previews / simulators / CI** without turning this handbook into a design system course. **Not** layout craft, animation recipes, or App Store marketing. Default language mode for new app code: **Swift 6.3.x**.

If you need pixel-perfect SwiftUI, open Apple’s SwiftUI docs. This chapter teaches **when each surface appears**, **who owns state**, and **enough navigation/stack literacy to review PRs**.

---

## 1. Concepts

### 1. Three surfaces, three jobs

| Framework | Typical home | Mental model |
|-----------|--------------|--------------|
| **SwiftUI** | New Apple UI; multi-platform declarative views | Describe UI as a function of state |
| **UIKit** | iOS / iPadOS / tvOS / visionOS (UIKit scenes) imperative UI | View controllers + view hierarchy |
| **AppKit** | macOS desktop windows, menus, responders | `NSWindow` / `NSViewController` world |

Same **Swift** language underneath. Different modules, lifecycles, and CI destinations. Staff habit: name the framework in the PR title when the change is UI-heavy (“SwiftUI settings screen” vs “UIKit brownfield fix”).

### 2. When each one shows up in real repos

| Situation | What you usually see |
|-----------|----------------------|
| Greenfield iOS/macOS app (recent) | SwiftUI app lifecycle (`@main` + `App` protocol) |
| Long-lived iOS product | UIKit root + SwiftUI islands (`UIHostingController`) |
| macOS tool with complex windows | AppKit, sometimes SwiftUI panels hosted inside |
| Widget / Watch / vision slices | Often SwiftUI-first |
| Shared non-UI logic | Plain Swift package — **keep it out of view files** |
| System settings / document-heavy Mac | AppKit patterns still common |

Do not rewrite a stable UIKit screen “because SwiftUI exists.” Do not invent AppKit on iOS. Choose the stack the **platform and brownfield** already imply, then isolate logic.

### 3. State ownership map (SwiftUI)

SwiftUI bugs are usually **state ownership** bugs, not missing paddings.

| Tool | Owns / means | Review question |
|------|--------------|-----------------|
| `@State` | Local view-owned value | Should this survive beyond the view? If yes, lift it. |
| `@Binding` | Read/write into parent/owner state | Who creates the source of truth? |
| `@Observable` (Observation) | Modern model observation | Prefer for new reference models when deployment allows |
| `@State` + `@Observable` instance | View owns the observable object instance | Creation site still matters |
| `ObservableObject` + `@Published` | **Legacy-common** Combine-era pattern | Literacy + migration — see below |
| `@StateObject` / `@ObservedObject` | Classic wrappers for `ObservableObject` | Who **creates** vs who **observes**? |
| `@Environment` | Dependency from the environment | Is the dependency set at a sensible root? |
| `@EnvironmentObject` | Legacy-common shared object in environment | Easy to overuse; prefer explicit injection when clarity wins |

Official Observation hub: [Observation](https://developer.apple.com/documentation/observation).

```swift
// Modern direction (literacy sketch) — Observation
import SwiftUI
import Observation

@Observable
@MainActor
final class CounterModel {
    var count = 0  // Views depending on count refresh when it changes
}

@MainActor
struct CounterView: View {
    @State private var model = CounterModel()  // View owns the model instance

    var body: some View {
        Button("Count: \(model.count)") {
            model.count += 1
        }
    }
}
```

```swift
// Legacy-common (still everywhere) — ObservableObject / @Published
// Prefer migrating toward @Observable for new modules when your OS deployment allows.
import Combine

final class LegacyCounterModel: ObservableObject {
    @Published var count = 0
}
```

**Migration literacy (`ObservableObject` → `@Observable`)**

| Step | Habit |
|------|-------|
| New types | Prefer `@Observable` when minimum OS supports Observation |
| Existing types | Migrate when you touch the module—not a big-bang rewrite |
| `@StateObject` creation sites | Become `@State` holding an `@Observable` instance (typical pattern) |
| `@ObservedObject` children | Become plain properties / bindings into the observable graph |
| Tests | Observe state as data; don’t rely on Combine publisher gymnastics unless needed |

### 4. UIKit / AppKit when they still appear

| Marker in a PR | Meaning |
|----------------|---------|
| `UIViewController` / `UIView` | UIKit hierarchy |
| `viewDidLoad` / `viewWillAppear` | Lifecycle hooks — side effects go here carefully |
| `NSViewController` / `NSWindow` | AppKit |
| `UIHostingController` / `NSHostingController` | Bridge: UIKit/AppKit shell hosting SwiftUI |
| Storyboards / XIBs | Interface Builder — still common brownfield |
| `UINavigationController` / `NSSplitViewController` | Imperative navigation containers |

You do not need to memorize every API. You need to recognize **imperative lifecycle** vs **declarative `body`**, and where side effects belong.

Why they remain:

- decades of battle-tested screens,
- specialized controls not worth rewriting,
- Mac windowing/menu complexity,
- hybrid migration in progress.

### 5. Navigation stack literacy (review depth, not a design course)

Enough to read PRs:

| Stack | What you look for |
|-------|-------------------|
| **SwiftUI `NavigationStack`** | Value-based paths / `navigationDestination`; single source of path state |
| **Legacy `NavigationView`** | Still in brownfield — prefer `NavigationStack` for new iOS work when deployment allows |
| **UIKit `UINavigationController`** | Push/pop ownership; avoid double navigation bars when hosting SwiftUI |
| **Hybrid** | Who owns the stack—UIKit nav or SwiftUI path? Pick one per flow |

```swift
// Literacy sketch — value-driven navigation
enum Route: Hashable { case detail(id: String) }

struct RootView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                Button("Open") { path.append(Route.detail(id: "42")) }
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .detail(let id): Text("Detail \(id)")
                }
            }
        }
    }
}
```

Review smells: duplicated sources of path state; pushing UIKit and SwiftUI stacks for the same flow; navigation logic buried in deep child views with no owner.

### 6. Preview vs simulator vs device vs CI

| Surface | Good for | Not proof of |
|---------|----------|--------------|
| **SwiftUI Preview** | Fast visual iteration | Signing, push, performance, real sensors |
| **Simulator** | Most functional UI tests | Exact GPU/perf, some hardware APIs |
| **Device** | Hardware, performance, TestFlight truth | — |
| **CI (`xcodebuild test`)** | Regression gate on pinned simulators | “Looks good in canvas” |

CI usually runs **simulator** destinations (chapter **18** / **21**). Previews are a developer accelerant — do not make “preview compiles” the only gate.

---

## 2. Advanced concepts

### 1. Hybrid apps are normal

Brownfield pattern:

```text
UIKit (or AppKit) app delegate / scene delegate
  └─ root navigation
       ├─ legacy UIViewController screens
       └─ UIHostingController → SwiftUI feature modules
```

Review focus: **boundaries**. Pass plain models across the host bridge; avoid leaking UIKit types deep into SwiftUI feature packages unless necessary.

### 2. Main actor and UI updates

UI frameworks expect UI work on the **main actor**. Under Swift 6 checking, crossing into UI from a background task without isolation is a compiler/review issue (chapter **10**). Staff rule: data loading may be async; **applying** results to UI state is main-actor work.

### 3. Legacy literacy — UIKit-only and “Massive View Controller”

| You see | Translate |
|---------|-----------|
| Everything in one `UIViewController` | Extract models/services; UI stays thin |
| Storyboard segues as architecture | Document flow; migrate edges when touched |
| Target-Action / delegates everywhere | Fine in UIKit; don’t force Combine/SwiftUI mid-fix without a plan |
| “We’ll rewrite in SwiftUI next quarter” with no boundary | Prefer incremental hosting + shared packages |
| `@Published` spam for local view state | Prefer `@State` / `@Observable` appropriately |

**Legacy:** completion-handler networking shoved into `viewDidLoad` with no cancellation. **Modern:** `async` tasks tied to lifecycle / `.task` in SwiftUI, cancellation respected.

### 4. What this chapter refuses to teach

- Color systems, typography scales, marketing landing layouts.
- Animation choreography and custom layout engines.
- Accessibility deep-dives beyond “PRs that ship UI should not ignore a11y labels” as a review nudge — use Apple a11y docs for the craft.
- App Store screenshot and ASO playbooks.

Those are real jobs. They are **not** this language track.

### 5. Enough to wire CI

For UI-bearing apps, CI needs:

1. Shared scheme with a **Test** action (chapter **18**).
2. Pinned simulator destination.
3. Clarity whether UI tests exist (`XCUIApplication`) vs unit tests only.
4. No dependency on personal Preview canvas state.

SwiftUI Previews do not replace `xcodebuild test`.

### 6. Lab — state ownership review card

For a UI PR, fill before approve:

```text
Framework:     [ ] SwiftUI  [ ] UIKit  [ ] AppKit  [ ] bridge
Source of truth created in: _______________
Children use:  [ ] Binding  [ ] observe only  [ ] environment
Model style:   [ ] @Observable  [ ] ObservableObject  [ ] plain value
Navigation owner: _______________
MainActor:     [ ] clear  [ ] needs fix
CI proof:      [ ] xcodebuild test on pinned sim  [ ] preview only (insufficient)
```

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | New screen: SwiftUI if the app is SwiftUI-first; otherwise host a SwiftUI island or stay UIKit consistently |
| **Systems** | Keep networking, persistence, and parsing in testable packages — UI imports them, not vice versa |
| **Security** | Secrets and tokens never in view literals; auth state owned by a service, not `@State` strings in git |
| **Operations** | Document “UI test job” vs “unit-only job” so on-call knows what a red build means |
| **Software engineering** | PR checklist: framework named, state ownership clear, main-actor boundaries respected |

---

## 4. Staff-level review checklist

- [ ] Reviewers can name whether the change is **SwiftUI**, **UIKit**, **AppKit**, or a **bridge**.
- [ ] Source of truth for state is singular and documented in the PR when non-obvious.
- [ ] New work prefers **`@Observable`** when deployment allows; `ObservableObject` treated as brownfield literacy.
- [ ] Navigation ownership is clear (`NavigationStack` path vs UIKit nav)—no double stacks by accident.
- [ ] New shared logic did **not** land only inside a view file if another target needs it.
- [ ] UI updates are main-actor-safe under the team’s Swift 6 checking posture.
- [ ] CI runs real test actions on a **pinned** simulator — previews alone are insufficient.
- [ ] Hybrid hosting boundaries are intentional, not accidental framework soup.
- [ ] Nobody treats this handbook chapter as a substitute for Apple’s SwiftUI/UIKit design docs.
- [ ] Brownfield UIKit is improved at the edges — not big-bang rewritten without a migration plan.

---

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Observation](https://developer.apple.com/documentation/observation)
- [UIKit](https://developer.apple.com/documentation/uikit)
- [AppKit](https://developer.apple.com/documentation/appkit)
- [Migrating to the SwiftUI life cycle](https://developer.apple.com/documentation/swiftui/migrating-to-the-swiftui-life-cycle)
- [Using SwiftUI with UIKit](https://developer.apple.com/documentation/uikit/using-swiftui-with-uikit)
- [Xcode previews](https://developer.apple.com/documentation/xcode/previewing-your-apps-interface-in-xcode)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
