# SwiftUI, UIKit, and AppKit — surface literacy

[← Back to Swift](./README.md)

## What this chapter covers

Enough **UI framework literacy** to read app PRs, know which stack you are looking at, and wire **previews / simulators / CI** without turning this handbook into a design system course. **Not** layout craft, animation recipes, or App Store marketing. Default language mode for new app code: **Swift 6.3.x**.

If you need pixel-perfect SwiftUI, open Apple’s SwiftUI docs. This chapter teaches **when each surface appears**, **who owns state**, **NavigationStack path typing**, **hosting bridges**, **previews vs CI**, a **Dynamic Type glance**, and a concrete **“how to review a SwiftUI PR”** checklist.

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

### 3. Complete state ownership map

SwiftUI bugs are usually **state ownership** bugs, not missing paddings. Use this table in review:

| Tool | Owns / means | Creates source of truth? | Survives view recreate? | Review question |
|------|--------------|--------------------------|-------------------------|-----------------|
| `@State` | Local view-owned value | Yes (in this view) | Yes (SwiftUI-managed) | Should this live higher? |
| `@Binding` | Read/write into owner’s storage | No — projects inward | Depends on owner | Who creates the source? |
| `@Observable` (Observation) | Modern observable model | At creation site | If owner retains it | Prefer for new reference models when deployment allows |
| `@State` + `@Observable` instance | View owns the observable object | Yes | Yes | Creation site still matters |
| `ObservableObject` + `@Published` | **Legacy-common** Combine-era pattern | At creation site | Via `@StateObject` | Literacy + migration |
| `@StateObject` | Creates & owns an `ObservableObject` | Yes | Yes | Don’t recreate in `body` |
| `@ObservedObject` | Observes object owned elsewhere | No | No (owner must retain) | Easy to drop ownership |
| `@Environment` | Value from environment | Set at ancestor | Scoped | Is the key set at a sensible root? |
| `@EnvironmentObject` | Legacy-common shared object in environment | Set at ancestor | Scoped | Easy to overuse; prefer explicit injection when clarity wins |
| `@Bindable` (with Observation) | Bindings into `@Observable` fields | No | N/A | Child edits without owning |
| Plain `let` / value props | Immutable inputs | Parent | No | Prefer for pure display |

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

struct LegacyCounterView: View {
    @StateObject private var model = LegacyCounterModel()  // ownership wrapper

    var body: some View {
        Button("Count: \(model.count)") { model.count += 1 }
    }
}
```

### 4. `@Observable` migration from `ObservableObject` — step-by-step literacy

Migrate when you **touch** a module—not a company-wide big bang. Deployment must include Observation.

| Step | Do this | Avoid |
|------|---------|-------|
| 1. Inventory | List types that are `ObservableObject` with `@Published` | Rewriting unrelated UIKit screens |
| 2. New types first | Write new models as `@Observable` | Mixing both styles in one tiny type without reason |
| 3. Strip Combine conformance | Remove `ObservableObject`; drop `@Published` on stored props | Leaving unused `import Combine` as cargo cult |
| 4. Creation sites | `@StateObject private var m = Model()` → `@State private var m = Model()` for `@Observable` | Keeping `@StateObject` on non-`ObservableObject` types |
| 5. Child observation | `@ObservedObject var m` → pass the model (or `@Bindable`) | Recreating models inside child `body` |
| 6. Environment | Prefer explicit injection; migrate `@EnvironmentObject` carefully | Silent global objects with unclear lifetime |
| 7. Tests | Assert on model fields; drop publisher-only tests unless needed | Requiring Combine Test schedulers for simple state |
| 8. Main actor | Annotate UI models `@MainActor` when they feed views | Updating UI from unstructured background tasks |

```swift
// Before (legacy-common)
final class ProfileModel: ObservableObject {
    @Published var name: String = ""
}

struct ProfileView: View {
    @StateObject private var model = ProfileModel()
    var body: some View { TextField("Name", text: $model.name) }
}

// After (Observation direction)
@Observable @MainActor
final class ProfileModel {
    var name: String = ""
}

struct ProfileView: View {
    @State private var model = ProfileModel()
    var body: some View {
        @Bindable var model = model
        TextField("Name", text: $model.name)
    }
}
```

**What just happened:** ownership rules did not disappear—wrappers changed. Creation site is still the review question.

### 5. NavigationStack path typing

Enough to read PRs—not a navigation design course.

| Stack | What you look for |
|-------|-------------------|
| **SwiftUI `NavigationStack`** | Value-based paths / `navigationDestination`; single source of path state |
| **Typed path** (`[Route]` or `NavigationPath`) | `Hashable` routes; destinations registered once |
| **Legacy `NavigationView`** | Still in brownfield — prefer `NavigationStack` for new iOS work when deployment allows |
| **UIKit `UINavigationController`** | Push/pop ownership; avoid double navigation bars when hosting SwiftUI |
| **Hybrid** | Who owns the stack—UIKit nav or SwiftUI path? Pick one per flow |

```swift
// Literacy sketch — typed value-driven navigation
enum Route: Hashable {
    case detail(id: String)
    case settings
}

struct RootView: View {
    @State private var path: [Route] = []  // typed path — easy to test & deep-link

    var body: some View {
        NavigationStack(path: $path) {
            List {
                Button("Open") { path.append(.detail(id: "42")) }
                Button("Settings") { path.append(.settings) }
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .detail(let id): Text("Detail \(id)")
                case .settings: Text("Settings")
                }
            }
        }
    }
}
```

| Path style | Pros | Cons |
|------------|------|------|
| `[Route]` | Typed, testable, explicit | Must keep `Route` enum honest |
| `NavigationPath` | Heterogeneous values | Harder to inspect/debug |

Review smells: duplicated sources of path state; pushing UIKit and SwiftUI stacks for the same flow; navigation logic buried in deep child views with no owner; `NavigationView` in new code without deployment reason.

### 6. UIKit hosting SwiftUI — and the reverse

**UIKit → SwiftUI (common brownfield):**

```swift
// Literacy sketch — host a SwiftUI view in UIKit
let model = FeatureModel()
let root = FeatureView(model: model)
let host = UIHostingController(rootView: root)
navigationController.pushViewController(host, animated: true)
```

**SwiftUI → UIKit (wrap a UIKit control):**

```swift
// Literacy sketch — UIViewRepresentable / UIViewControllerRepresentable
struct LegacyChartView: UIViewRepresentable {
    var values: [Double]
    func makeUIView(context: Context) -> LegacyChartUIView { LegacyChartUIView() }
    func updateUIView(_ uiView: LegacyChartUIView, context: Context) {
        uiView.values = values
    }
}
```

| Direction | Bridge | Review focus |
|-----------|--------|--------------|
| UIKit shell → SwiftUI feature | `UIHostingController` / `NSHostingController` | Lifetime of model; nav bar double-stack |
| SwiftUI → UIKit leaf | `UIViewRepresentable` | `updateUIView` idempotency; no retain cycles in coordinator |
| SwiftUI → UIKit VC | `UIViewControllerRepresentable` | Who owns presentation |

Pass plain models across the bridge; avoid leaking UIKit types deep into SwiftUI feature packages unless necessary.

### 7. UIKit / AppKit markers when they still appear

| Marker in a PR | Meaning |
|----------------|---------|
| `UIViewController` / `UIView` | UIKit hierarchy |
| `viewDidLoad` / `viewWillAppear` | Lifecycle hooks — side effects go here carefully |
| `NSViewController` / `NSWindow` | AppKit |
| Storyboards / XIBs | Interface Builder — still common brownfield |
| `UINavigationController` / `NSSplitViewController` | Imperative navigation containers |

Why they remain: decades of screens, specialized controls, Mac windowing, hybrid migration.

### 8. Previews vs simulator vs device vs CI

| Surface | Good for | Not proof of |
|---------|----------|--------------|
| **SwiftUI Preview** | Fast visual iteration; Dynamic Type smoke in canvas | Signing, push, performance, real sensors, merge gate |
| **Simulator** | Most functional UI tests | Exact GPU/perf, some hardware APIs |
| **Device** | Hardware, performance, TestFlight truth | — |
| **CI (`xcodebuild test`)** | Regression gate on pinned simulators | “Looks good in canvas” |

| Preview habit | CI habit |
|---------------|----------|
| `#Preview { … }` for local iteration | Shared scheme **Test** action |
| Multiple size classes / Dynamic Type in canvas | Pinned simulator destination |
| Preview-only mock data | Real test doubles in test targets |

CI usually runs **simulator** destinations (chapter **18** / **21**). Previews are a developer accelerant — do not make “preview compiles” the only gate.

### 9. Accessibility — Dynamic Type literacy glance

This is **not** an a11y craft course. Review glance only:

| Habit | Why reviewers care |
|-------|--------------------|
| Prefer system fonts / text styles | Dynamic Type scales with user settings |
| Avoid fixed-height text traps | Truncation / clipping when content size scales up |
| Check a large content size in Preview or simulator | Catches layout that only works at default size |
| Labels on icon-only controls | VoiceOver needs a name |

Use Apple’s accessibility docs for the craft. In this track: **fail a PR that clearly clips at accessibility sizes** when the change touched that layout—or require a follow-up issue with an owner.

---

## 2. Advanced concepts

### 1. Hybrid apps are normal

```text
UIKit (or AppKit) app delegate / scene delegate
  └─ root navigation
       ├─ legacy UIViewController screens
       └─ UIHostingController → SwiftUI feature modules
```

Review focus: **boundaries**. One navigation owner per flow.

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
- Full accessibility audits (beyond Dynamic Type / label glance).
- App Store screenshot and ASO playbooks.
- Full **SwiftData** / Core Data modeling courses (door only — next section).

### 4b. SwiftData — door (persistence adjacent to SwiftUI)

**SwiftData** is Apple’s modern persistence stack that pairs naturally with SwiftUI and macros (`@Model`). Staff literacy:

| Know | Do not pretend |
|------|----------------|
| It exists as the modern Apple persistence path next to SwiftUI | This chapter is a SwiftData book |
| Migration from Core Data is a project | “We use SwiftUI” implies SwiftData |
| Models and CloudKit sync have their own review surface | Persistence secrets belong in ch **20**/backend |

When a PR introduces SwiftData, require Apple’s SwiftData docs, a migration/backup story, and test strategy — not a UI-only review. Core Data remains brownfield literacy in many codebases.

### 5. Enough to wire CI

1. Shared scheme with a **Test** action (chapter **18**).
2. Pinned simulator destination.
3. Clarity whether UI tests exist (`XCUIApplication`) vs unit tests only.
4. No dependency on personal Preview canvas state.

### 6. How to review a SwiftUI PR — checklist

Use this as a PR template section:

```text
## SwiftUI review
- [ ] Framework named (SwiftUI / UIKit / AppKit / bridge)
- [ ] Source of truth: one owner; table role identified (@State / @Observable / Binding / …)
- [ ] New models prefer @Observable when deployment allows
- [ ] Navigation: single stack owner; path typed or NavigationPath justified
- [ ] Hosting bridges: model lifetime + no double nav bars
- [ ] @MainActor / isolation clear under team Swift 6 posture
- [ ] No domain logic that belongs in a package trapped in `body`
- [ ] Dynamic Type / text style: no obvious clip at large sizes (glance)
- [ ] Accessibility label on new icon-only controls
- [ ] CI: xcodebuild test on pinned sim — not “preview looks fine”
- [ ] Secrets/tokens not in view literals
```

### 7. Lab — state ownership review card

```text
Framework:     [ ] SwiftUI  [ ] UIKit  [ ] AppKit  [ ] bridge
Source of truth created in: _______________
Children use:  [ ] Binding  [ ] Bindable  [ ] observe only  [ ] environment
Model style:   [ ] @Observable  [ ] ObservableObject  [ ] plain value
Navigation owner: _______________  path type: _______________
MainActor:     [ ] clear  [ ] needs fix
Dynamic Type glance: [ ] ok  [ ] issue filed
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
| **Software engineering** | PR checklist above; Observation migration when touching models |

---

## 4. Staff-level review checklist

- [ ] Reviewers can name whether the change is **SwiftUI**, **UIKit**, **AppKit**, or a **bridge**.
- [ ] State ownership map is applied: singular source of truth; wrappers match Observation vs Combine era.
- [ ] New work prefers **`@Observable`** when deployment allows; `ObservableObject` treated as brownfield literacy with a step-by-step migration path when touched.
- [ ] `NavigationStack` path typing is intentional; navigation ownership is clear—no double stacks.
- [ ] UIKit↔SwiftUI hosting boundaries are intentional (host or representable), not accidental framework soup.
- [ ] New shared logic did **not** land only inside a view file if another target needs it.
- [ ] UI updates are main-actor-safe under the team’s Swift 6 checking posture.
- [ ] CI runs real test actions on a **pinned** simulator — previews alone are insufficient.
- [ ] Dynamic Type glance done for layout-touching PRs; icon-only controls have labels.
- [ ] “How to review a SwiftUI PR” checklist is used (or an org equivalent).
- [ ] Nobody treats this handbook chapter as a substitute for Apple’s SwiftUI/UIKit design docs.
- [ ] Brownfield UIKit is improved at the edges — not big-bang rewritten without a migration plan.

---

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Observation](https://developer.apple.com/documentation/observation)
- [SwiftData](https://developer.apple.com/documentation/swiftdata)
- [UIKit](https://developer.apple.com/documentation/uikit)
- [AppKit](https://developer.apple.com/documentation/appkit)
- [Migrating to the SwiftUI life cycle](https://developer.apple.com/documentation/swiftui/migrating-to-the-swiftui-life-cycle)
- [Using SwiftUI with UIKit](https://developer.apple.com/documentation/uikit/using-swiftui-with-uikit)
- [Xcode previews](https://developer.apple.com/documentation/xcode/previewing-your-apps-interface-in-xcode)
- [Applying Dynamic Type](https://developer.apple.com/documentation/uikit/uifont/scaling_fonts_automatically)
- [Accessibility](https://developer.apple.com/documentation/accessibility)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
