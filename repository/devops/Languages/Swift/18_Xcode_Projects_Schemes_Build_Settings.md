# Xcode projects, schemes, and build settings

[← Back to Swift](./README.md)

## What this chapter covers

How Apple **app** builds are organized: **projects**, **targets**, **schemes**, **configurations**, and **xcconfig** — enough that you can name what CI must invoke and spot settings drift. This is not a full Xcode UI tour. Handbook default: **Swift 6.3.x** language mode on new targets; record the **Xcode / SDK** pin your Mac runners actually use.

Packages (chapter **14**) can live without an `.xcodeproj`. The moment you ship a signed iOS/macOS app, you live in this chapter’s nouns.

You finish when you can draw an xcconfig include tree, explain Debug vs Release behavior that bites reviews, read a build timeline for “what actually rebuilt,” and paste the exact shared-scheme contract CI must run.

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

```text
MyApp.xcworkspace
├── MyApp.xcodeproj
│     ├── target MyApp          → MyApp.app
│     ├── target MyAppTests     → unit test bundle
│     └── target MyAppUITests   → UI test bundle
└── (SPM packages resolved into the workspace)
```

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

**Shared schemes checklist (print this):**

- Scheme file lives under `xcshareddata/xcschemes/` and is committed.
- **Build** action includes the app (+ any required extensions).
- **Test** action includes unit (and UI, if you claim UI coverage) targets.
- **Run** uses Debug (or a documented Dev config).
- **Archive** uses Release (or AppStore/Beta config)—not Debug.
- Test plan name (if any) matches README / CI YAML.
- No dependence on personal env vars that only exist on one laptop.
- `xcodebuild -list` shows this scheme on a clean checkout.

```bash
xcodebuild -list -project MyApp.xcodeproj
# Lists targets, configurations, and schemes — ground truth for humans and CI.

xcodebuild -list -workspace MyApp.xcworkspace
# Prefer -workspace when SPM/CocoaPods live beside the project.
```

If CI uses a scheme that only exists on one laptop, you do not have CI—you have a rumor.

### 3. Debug vs Release — behavioral differences that matter

Default pair: **Debug** and **Release**. Teams often add Staging, Beta, AppStore. Each configuration can flip different **build settings** (optimization, `SWIFT_ACTIVE_COMPILATION_CONDITIONS`, bundle ids, signing style).

| Dimension | **Debug** (typical) | **Release** (typical) |
|-----------|---------------------|------------------------|
| Optimization | Off / minimal — fast rebuild story | On — ship-shaped codegen |
| `#if DEBUG` / `DEBUG` flag | Active via `SWIFT_ACTIVE_COMPILATION_CONDITIONS` | Usually absent |
| Assertions / precondition noise | Louder developer feedback | Leaner; don’t rely on Debug-only checks for security |
| Bundle ID / entitlements | Sometimes `.dev` flavor | Production id |
| Signing | Development identity | Distribution identity (ch **20**) |
| Logging | Verbose OK | Must not leak secrets/PII (ch **20**) |
| Test action in CI | Often Debug for speed | Archive dry-run should still prove Release compiles |

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

**Review smell:** `#if DEBUG` hiding the only path that validates auth, or Release-only bugs because a feature is compiled out of Debug. Treat compilation conditions as **product forks**—document them.

Archive / export for store delivery is a different action than simulator test — do not assume “green unit tests” equals “signed IPA exists.”

### 4. xcconfig inheritance tree lab

| Layer | What it is |
|-------|------------|
| **Target / project Build Settings UI** | Editable bag of keys (`PRODUCT_BUNDLE_IDENTIFIER`, `SWIFT_VERSION`, …) |
| **`.xcconfig` files** | Text overlays you can review in PRs; `#include` for inheritance |
| **Resolved settings** | What `xcodebuild` actually used after layers merge |

Staff preference for anything non-trivial: **settings in xcconfig**, checked in, with a clear include graph. Mystery checkbox-only settings are how Debug and CI Release diverge for six months.

**Inheritance tree lab** (map this to your repo):

```text
Configs/
  Shared.xcconfig              # SWIFT_VERSION, warnings, common flags
  Shared-Signed.xcconfig       # #include Shared + team / signing style keys
  Debug.xcconfig               # #include Shared-Signed + DEBUG conditions
  Release.xcconfig             # #include Shared-Signed + release optimization
  Beta.xcconfig                # #include Release + different bundle id / flags
```

```xcconfig
// Shared.xcconfig — illustrative
SWIFT_VERSION = 6.0
// Keep the handbook narrative (6.3.x toolchain) aligned with the language mode you intend.
SWIFT_STRICT_CONCURRENCY = complete
// complete | targeted | minimal — know which you set; do not leave accidental UI defaults.
WARNING_CFLAGS = -Wall

// Shared-Signed.xcconfig
#include "Shared.xcconfig"
CODE_SIGN_STYLE = Automatic
// DEVELOPMENT_TEAM = YOURTEAMID   // prefer CI/xcconfig injection over committing if policy requires

// Debug.xcconfig
#include "Shared-Signed.xcconfig"
SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG
SWIFT_OPTIMIZATION_LEVEL = -Onone
DEBUG_INFORMATION_FORMAT = dwarf

// Release.xcconfig
#include "Shared-Signed.xcconfig"
SWIFT_OPTIMIZATION_LEVEL = -O
SWIFT_COMPILATION_MODE = wholemodule
DEBUG_INFORMATION_FORMAT = dwarf-with-dsym
```

**Lab steps:**

1. Draw your include tree on paper (or in the PR).
2. Map each Xcode **configuration** name → one leaf xcconfig.
3. Run `-showBuildSettings` for Debug **and** Release; diff `SWIFT_VERSION`, `SWIFT_STRICT_CONCURRENCY`, `SWIFT_ACTIVE_COMPILATION_CONDITIONS`, `PRODUCT_BUNDLE_IDENTIFIER`.
4. Fix any key that only exists in the UI for one configuration.

```bash
# Inspect resolved keys (scheme + config matter)
xcodebuild -showBuildSettings \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  | grep -E 'SWIFT_VERSION|SWIFT_STRICT_CONCURRENCY|PRODUCT_BUNDLE_IDENTIFIER|CODE_SIGN|SWIFT_ACTIVE_COMPILATION|SWIFT_OPTIMIZATION'
# Grep for the pins you care about; full dump is large.
```

### 5. `SWIFT_VERSION` and `SWIFT_STRICT_CONCURRENCY`

`SWIFT_VERSION` is the Xcode-facing dial for **language mode** (chapter **02**). A newer Xcode can still compile a target in an older language mode.

`SWIFT_STRICT_CONCURRENCY` controls how hard the compiler checks concurrency under your language mode (values such as `minimal`, `targeted`, `complete`—confirm against your Xcode’s setting help). Handbook direction for **new** targets: Swift 6 language mode with **complete** checking when the migration allows.

| Habit | Why |
|-------|-----|
| Set `SWIFT_VERSION` once in Shared.xcconfig | Stops per-target drift |
| Set concurrency strictness deliberately | Silent UI defaults ≠ team policy |
| Print both in CI via `-showBuildSettings` | Prove mode, don’t trust Slack |
| Change in a dedicated PR | Language mode / concurrency flips are migrations |

```bash
xcodebuild -showBuildSettings -workspace MyApp.xcworkspace -scheme MyApp -configuration Release \
  | grep -E 'SWIFT_VERSION|SWIFT_STRICT_CONCURRENCY'
```

### 6. SPM packages inside `.xcodeproj` / workspace

Modern apps often depend on packages resolved into the workspace:

```text
MyApp.xcworkspace
  MyApp.xcodeproj
  MyDomain (SPM)          ← File → Add Package Dependencies…
  Package.resolved        ← review like a lockfile (often under project/workspace xcshareddata)
```

| Truth | Implication |
|-------|-------------|
| Resolution needs network or cache on clean agents | CI must not assume “already resolved on my Mac” |
| Scheme builds the **app target** that links packages | Chapter **14** owns graph depth; here own the scheme |
| Binary targets / plugins are trust boundaries | Review like CI scripts (chapter **20**) |
| Local path packages | Great for monorepos; document relative paths for CI checkout layout |
| Xcode “Update to Latest Package Versions” | Is a deliberate PR, not a quiet local click |

**Staff literacy:** opening the `.xcodeproj` alone can hide SPM wiring that only appears in the `.xcworkspace`. Onboarding docs should say which file to open—and CI should use the same (`-workspace` vs `-project`).

### 7. Clean vs incremental myths

| Idea | Reality |
|------|---------|
| **Incremental build** | Normal day loop; rebuilds what changed |
| **Clean build** | Forces more work; useful after toolchain/settings shocks |
| **Delete DerivedData** | Local troubleshooting hammer — **not** a release procedure |
| “CI must wipe DerivedData always” | Often slow and unnecessary if image + keys are pinned |
| “DerivedData is source of truth” | Never — checked-in project + pins are |
| “Clean fixes flaky tests” | Usually hides nondeterminism; fix the test or the cache key |
| “Incremental is unsafe” | Incremental is correct when inputs are tracked; broken when settings/toolchains drift under you |

**DerivedData** holds intermediate build products. Cleaning it can fix local weirdness. CI should start from a known image + checked-in project, with **cache keys** that include Xcode version + dependency locks (chapter **21**).

When to clean deliberately:

1. After Xcode major upgrades,
2. After suspicious “impossible” linker errors following settings edits,
3. When cache poisoning is suspected (then **fix the cache key**, don’t only clean once).

### 8. Build timeline reading literacy

Xcode’s build report / timeline answers: *what took time, and did we rebuild the world?*

| Signal | Read it as… |
|--------|-------------|
| Long **Compile Swift** on one target | That target’s dependency or content changed—or whole-module / concurrency checking tax |
| Many targets compiling after a one-line edit | Header/module boundary or settings change invalidated a wide fan-out |
| **Link** dominates | Codegen done; watch for duplicate symbols / large binary deps |
| **Copy Bundle Resources** spikes | Asset catalogs, localization, or accidental resource churn |
| **Resolve Package Graph** at start | Network/cache miss — pin/cache story (ch **21**) |
| Clean build much slower than incremental | Expected; only panic if *incremental* is always clean-speed |

Staff habits:

- On CI duration regressions, compare timelines before blaming “Swift is slow.”
- After flipping `SWIFT_STRICT_CONCURRENCY` or `SWIFT_VERSION`, expect a one-time wide rebuild—not a forever tax if incremental works.
- Teach juniors: the timeline is evidence; “feels slow” is not a ticket.

---

## 2. Advanced concepts

### 1. What CI must invoke (minimum contract)

Document one primary path:

1. **Workspace or project** path.
2. **Shared scheme** name.
3. **Configuration** for test vs archive.
4. **Destination** (simulator OS/device, or generic iOS device for archive).
5. **Language / toolchain pins** (`SWIFT_VERSION`, `SWIFT_STRICT_CONCURRENCY`, Xcode version on the image).

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
| `SWIFT_VERSION` 5.0 on a “Swift 6” team | Mode migration PR — don’t lie in README |

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

# 2) Show Swift language + concurrency settings for Release
xcodebuild -showBuildSettings \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  | grep -E 'SWIFT_VERSION|SWIFT_STRICT_CONCURRENCY'

# 3) Diff Debug vs Release compilation conditions
xcodebuild -showBuildSettings -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug \
  | grep SWIFT_ACTIVE_COMPILATION
xcodebuild -showBuildSettings -workspace MyApp.xcworkspace -scheme MyApp -configuration Release \
  | grep SWIFT_ACTIVE_COMPILATION

# 4) Run the same test invocation CI claims to run
xcodebuild \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  test
```

**What just happened:** if step 1’s scheme list disagrees with README, fix docs or share the scheme before debugging “flaky tests.”

### 5. Configuration matrix (review literacy)

| Config | Bundle / flags | Who consumes it |
|--------|----------------|-----------------|
| Debug | Dev endpoints, `DEBUG` | Local Run + most unit CI |
| Staging/Beta | `.beta` bundle id, staging API | Internal TestFlight |
| Release / AppStore | Prod id, no DEBUG | Archive + store |

If Staging only exists on one engineer’s scheme, it does not exist.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | One shared `MyApp` scheme: Run = Debug, Test = Debug (or Test config), Archive = Release |
| **Systems** | Matrix of destinations as capacity planning — pin OS versions like you pin compilers |
| **Security** | Treat build settings that inject API endpoints / keys as **secrets** (ch **20**), not clever xcconfig |
| **Operations** | Onboarding: `xcodebuild -list` expected schemes + the exact CI command pasted in README |
| **Software engineering** | PR review: scheme shared? `SWIFT_VERSION` / concurrency consistent? Release not accidentally Debug flags? |

---

## 4. Staff-level review checklist

- CI invokes a **shared** scheme (checked in), not a personal scheme — shared schemes checklist above is green.
- `xcodebuild -list` output matches what README / pipeline claims.
- Configurations for **test** vs **archive** are named and intentional; Debug vs Release behavioral differences are understood.
- Critical settings live in **xcconfig** with a clear `#include` **inheritance tree**, not only UI folklore.
- `SWIFT_VERSION` and `SWIFT_STRICT_CONCURRENCY` match the handbook pin story (**Swift 6.3.x** / complete checking direction for new work).
- Destinations are **pinned** (device + OS), not “whatever the agent had yesterday.”
- SPM packages in the workspace have a reviewed `Package.resolved` story for clean CI; open **workspace** when required.
- DerivedData tips are troubleshooting, not the release procedure; clean vs incremental myths are not policy.
- Reviewers can read a **build timeline** enough to spot wide invalidation vs expected incremental work.
- Workspace vs project choice matches how SPM / CocoaPods are actually wired.
- Nobody ships from a scheme that skips the test action “to save time” without a documented waiver.
- `#if DEBUG` / compilation conditions are not hiding security-critical checks.

---

## References

- [Xcode](https://developer.apple.com/documentation/xcode)
- [Building your project with xcodebuild](https://developer.apple.com/documentation/xcode/building-your-project-with-xcodebuild)
- [Customizing the build schemes for a project](https://developer.apple.com/documentation/xcode/customizing-the-build-schemes-for-a-project)
- [Adding a build configuration file to your project](https://developer.apple.com/documentation/xcode/adding-a-build-configuration-file-to-your-project)
- [Configuring the build settings of a target](https://developer.apple.com/documentation/xcode/configuring-the-build-settings-of-a-target)
- [Build settings reference](https://developer.apple.com/documentation/xcode/build-settings-reference)
- [Swift.org — downloads / toolchains](https://www.swift.org/download/)
- [Swift 6 concurrency migration guide](https://www.swift.org/migration/documentation/swift-6-concurrency-migration-guide/)
