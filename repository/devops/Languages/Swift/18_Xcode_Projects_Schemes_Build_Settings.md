# Xcode projects, schemes, and build settings

[← Back to Swift](./README.md)

## What this chapter covers

How Apple **app** builds are organized: **projects**, **targets**, **schemes**, **configurations**, and **xcconfig** — enough that you can name what CI must invoke and spot settings drift. This is not a full Xcode UI tour. Handbook default: **Swift 6.3.x** language mode on new targets; record the **Xcode / SDK** pin your Mac runners actually use.

Packages (chapter **14**) can live without an `.xcodeproj`. The moment you ship a signed iOS/macOS app, you live in this chapter’s nouns.

---

## 1. Concepts

### 1. Project → target → product

| Noun | Job |
|------|-----|
| **Project** (`.xcodeproj`) | Container: file refs, targets, shared build settings |
| **Workspace** (`.xcworkspace`) | Groups projects + SPM packages (CocoaPods often forces one) |
| **Target** | One buildable product: app, framework, test bundle, extension, … |
| **Product** | What the target emits (`.app`, `.framework`, test runner, …) |

One project can own many targets (app + unit tests + widget). Staff habit: when someone says “the build failed,” ask **which target** and **which scheme**.

### 2. Shared schemes are the CI contract

A **scheme** names:

- which targets to **build** / **test** / **run** / **archive**,
- which **configuration** each action uses (Debug vs Release, or custom),
- optional test plans / environment.

**Shared vs personal schemes**

| Kind | Location | Role |
|------|----------|------|
| **Shared** | `xcshareddata/xcschemes/` | Reviewed; what CI and teammates use |
| **Personal** | `xcuserdata/…` | Local convenience — **not** a release contract |

```bash
xcodebuild -list -project MyApp.xcodeproj
# Lists targets, configurations, and schemes — ground truth for humans and CI.

xcodebuild -list -workspace MyApp.xcworkspace
# Prefer -workspace when SPM/CocoaPods live beside the project.
```

If CI uses a scheme that only exists on one laptop, you do not have CI—you have a rumor.

### 3. Debug vs Release (and friends)

Default pair: **Debug** and **Release**. Teams often add Staging, Beta, AppStore. Each configuration can flip different **build settings** (optimization, `SWIFT_ACTIVE_COMPILATION_CONDITIONS`, bundle ids, signing style).

| Configuration | Typical intent |
|---------------|----------------|
| **Debug** | Fast iterate; less optimization; richer diagnostics |
| **Release** | Ship-shaped optimization; strip inappropriate debug-only code paths |
| **Custom** (Beta/Staging) | Different bundle ids, endpoints, or feature flags — still reviewed settings |

```bash
# Typical CI verbs (names are examples — use *your* shared scheme)
xcodebuild \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  test
# Builds + runs tests for that scheme’s Test action.
```

Archive / export for store delivery is a different action than simulator test — do not assume “green unit tests” equals “signed IPA exists.”

### 4. Build settings vs xcconfig inheritance

| Layer | What it is |
|-------|------------|
| **Target / project Build Settings UI** | Editable bag of keys (`PRODUCT_BUNDLE_IDENTIFIER`, `SWIFT_VERSION`, …) |
| **`.xcconfig` files** | Text overlays you can review in PRs; `#include` for inheritance |
| **Resolved settings** | What `xcodebuild` actually used after layers merge |

Staff preference for anything non-trivial: **settings in xcconfig**, checked in, with a clear include graph. Mystery checkbox-only settings are how Debug and CI Release diverge for six months.

Common inheritance shape:

```text
Configs/
  Shared.xcconfig          # warnings, SWIFT_VERSION, common flags
  Debug.xcconfig           # #include "Shared.xcconfig" + debug-only
  Release.xcconfig         # #include "Shared.xcconfig" + release-only
```

```xcconfig
// Shared.xcconfig — illustrative
SWIFT_VERSION = 6.0
// Keep the handbook narrative (6.3.x toolchain) aligned with the language mode you intend.
WARNING_CFLAGS = -Wall

// Debug.xcconfig
#include "Shared.xcconfig"
SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG
```

Map each Xcode configuration to a file. Avoid duplicating `SWIFT_VERSION` in five UI panes.

```bash
# Inspect a resolved key (scheme + config matter)
xcodebuild -showBuildSettings \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  | grep -E 'SWIFT_VERSION|PRODUCT_BUNDLE_IDENTIFIER|CODE_SIGN|SWIFT_ACTIVE_COMPILATION'
# Grep for the pins you care about; full dump is large.
```

### 5. `SWIFT_VERSION` build setting

`SWIFT_VERSION` is the Xcode-facing dial for **language mode** (chapter **02**). A newer Xcode can still compile a target in an older language mode.

| Habit | Why |
|-------|-----|
| Set once in Shared.xcconfig | Stops per-target drift |
| Print in CI via `-showBuildSettings` | Prove mode, don’t trust Slack |
| Change in a dedicated PR | Language mode flips are migrations |

### 6. SPM inside Xcode projects

Modern apps often depend on packages resolved into the workspace:

```text
MyApp.xcworkspace
  MyApp.xcodeproj
  MyDomain (SPM)          ← File → Add Package Dependencies…
  Package.resolved        ← review like a lockfile
```

| Truth | Implication |
|-------|-------------|
| Resolution needs network or cache on clean agents | CI must not assume “already resolved on my Mac” |
| Scheme builds the **app target** that links packages | Chapter **14** owns graph depth; here own the scheme |
| Binary targets / plugins are trust boundaries | Review like CI scripts (chapter **20**) |

### 7. Clean build vs incremental (and DerivedData myths)

| Idea | Reality |
|------|---------|
| **Incremental build** | Normal day loop; rebuilds what changed |
| **Clean build** | Forces more work; useful after toolchain/settings shocks |
| **Delete DerivedData** | Local troubleshooting hammer — **not** a release procedure |
| “CI must wipe DerivedData always” | Often slow and unnecessary if image + keys are pinned |
| “DerivedData is source of truth” | Never — checked-in project + pins are |

**DerivedData** holds intermediate build products. Cleaning it can fix local weirdness. CI should start from a known image + checked-in project, with **cache keys** that include Xcode version + dependency locks (chapter **21**).

When to clean deliberately:

1. After Xcode major upgrades,
2. After suspicious “impossible” linker errors following settings edits,
3. When cache poisoning is suspected (then **fix the cache key**, don’t only clean once).

---

## 2. Advanced concepts

### 1. What CI must invoke (minimum contract)

Document one primary path:

1. **Workspace or project** path.
2. **Shared scheme** name.
3. **Configuration** for test vs archive.
4. **Destination** (simulator OS/device, or generic iOS device for archive).
5. **Language / toolchain pins** (`SWIFT_VERSION`, Xcode version on the image).

```bash
# Discover destinations available on this Mac / image
xcodebuild -showdestinations \
  -workspace MyApp.xcworkspace \
  -scheme MyApp
# Pin a concrete destination in CI YAML — “any iPhone” drifts.
```

Prefer calling the same scheme humans use for “ship,” not a private scheme that only exists on one laptop.

### 2. Legacy literacy — old build settings and “works on my Mac”

| You see | Translate |
|---------|-----------|
| Settings only in UI, no xcconfig | Extract shared keys when you touch the target |
| Different bundle id only on one engineer’s machine | Move flavor into configurations / xcconfig |
| Unsigned local Debug assumed equal to CI Release | Separate test vs archive pipelines |
| Hard-coded absolute paths in build settings | Replace with `$(SRCROOT)` / relative refs |
| Scheme not shared; CI uses `-target` only | Prefer shared schemes for multi-action builds |
| Personal scheme checked in by accident | Move to shared; delete userdata from the PR |

**Manual signing chaos** (picking identities by hand per machine) belongs with chapter **20**. Here: note that **CODE_SIGN_STYLE** / team / provisioning interact with configuration — CI must use the same story as release engineers.

### 3. Test plans and selective CI

Schemes can point at **test plans** (which test targets/suites run). Staff teams often:

- PR CI: unit + a thin UI smoke on simulator,
- nightly: broader destinations / slower suites,
- release: archive + export + upload gates (chapter **21**).

Name the plan in docs so “CI is red” means a known surface.

### 4. Lab — prove the CI contract locally

```bash
# 1) List what exists
xcodebuild -list -workspace MyApp.xcworkspace

# 2) Show Swift language version for Release
xcodebuild -showBuildSettings \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  | grep SWIFT_VERSION

# 3) Run the same test invocation CI claims to run
xcodebuild \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  test
```

**What just happened:** if step 1’s scheme list disagrees with README, fix docs or share the scheme before debugging “flaky tests.”

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | One shared `MyApp` scheme: Run = Debug, Test = Debug (or Test config), Archive = Release |
| **Systems** | Matrix of destinations as capacity planning — pin OS versions like you pin compilers |
| **Security** | Treat build settings that inject API endpoints / keys as **secrets** (ch **20**), not clever xcconfig |
| **Operations** | Onboarding: `xcodebuild -list` expected schemes + the exact CI command pasted in README |
| **Software engineering** | PR review: scheme shared? `SWIFT_VERSION` consistent? Release config not accidentally Debug flags? |

---

## 4. Staff-level review checklist

- [ ] CI invokes a **shared** scheme (checked in), not a personal scheme.
- [ ] `xcodebuild -list` output matches what README / pipeline claims.
- [ ] Configurations for **test** vs **archive** are named and intentional (Debug/Release literacy).
- [ ] Critical settings live in **xcconfig** with a clear `#include` graph, not only UI folklore.
- [ ] `SWIFT_VERSION` / language mode matches the handbook pin story (**Swift 6.3.x** default for new work).
- [ ] Destinations are **pinned** (device + OS), not “whatever the agent had yesterday.”
- [ ] SPM packages in the workspace have a reviewed `Package.resolved` story for clean CI.
- [ ] DerivedData tips are troubleshooting, not the release procedure; cache keys are honest.
- [ ] Workspace vs project choice matches how SPM / CocoaPods are actually wired.
- [ ] Nobody ships from a scheme that skips the test action “to save time” without a documented waiver.

---

## References

- [Xcode](https://developer.apple.com/documentation/xcode)
- [Building your project with xcodebuild](https://developer.apple.com/documentation/xcode/building-your-project-with-xcodebuild)
- [Customizing the build schemes for a project](https://developer.apple.com/documentation/xcode/customizing-the-build-schemes-for-a-project)
- [Adding a build configuration file to your project](https://developer.apple.com/documentation/xcode/adding-a-build-configuration-file-to-your-project)
- [Configuring the build settings of a target](https://developer.apple.com/documentation/xcode/configuring-the-build-settings-of-a-target)
- [Swift.org — downloads / toolchains](https://www.swift.org/download/)
