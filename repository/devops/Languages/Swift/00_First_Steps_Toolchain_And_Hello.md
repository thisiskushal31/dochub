# First steps: toolchain and hello

[← Back to Swift](./README.md)

## What this chapter covers

Your first honest contact with Swift on a real machine. By the end you should know how to ask “which Swift am I running?”, run **three hellos** (REPL, script, package executable), and tell apart a **playground**, a **package**, and an **app target**. You are not diving into Xcode project settings yet—that comes later. Handbook default: **Swift 6.3.x** language mode for new work.

Today’s job is one working picture: *language + toolchain + something that prints*. If that picture is fuzzy, every later chapter will feel like someone else’s laptop.

---

## 1. Concepts

### 1. Three surfaces, one language

Swift shows up in three everyday shapes. Same grammar; different jobs.

| Surface | What it is | When you reach for it |
|---------|------------|------------------------|
| **Playground / REPL** | Scratch pad: type, see results, throw away | Learning a type, poking Foundation, teaching |
| **Package** (`Package.swift` + sources) | Library or executable built by Swift Package Manager | Tools, shared modules, Linux CI, most open-source Swift |
| **App target** (Xcode project / workspace) | App or extension wired to Apple SDKs, signing, schemes | iOS / macOS / watchOS / tvOS / visionOS products |

Staff habit: when someone says “the Swift project,” ask which of these three they mean. CI for a package and CI for a signed app are not the same pipeline.

### 2. Discover what you actually have

Before you trust a tutorial screenshot, print the toolchain:

```bash
swift --version
# Prints compiler identity and Swift version — the ground truth for this shell.

which swift
# Where that binary lives (Xcode toolchain, swift.org install, Docker PATH, …).

type -a swift
# Shows *every* swift on PATH, in order — useful when “wrong Swift” ghosts appear.
```

On a Mac with Xcode installed you will often also want:

```bash
xcodebuild -version
# Xcode app version + build — the Apple SDK story is larger than `swift` alone.

xcode-select -p
# Which developer directory is active (Xcode.app vs leftover CLT / beta).
```

`swift --version` and `xcodebuild -version` can disagree with tribal memory (“we’re on six”). Record what the shell says, not what Slack said last quarter.

### 3. Swiftly literacy (installer without folklore)

**Swiftly** is the Swift project’s toolchain manager: install, list, and switch **swift.org** toolchains without tribal unzip scripts. It does **not** replace Xcode for Apple SDK app shipping—and it does not magically set language mode to 6. It answers: *which compiler binary is active for package/CLI work?*

```bash
# After installing Swiftly from the official install docs (swift.org / getting-started):
swiftly --version          # Confirm the manager itself is present
swiftly list               # Toolchains Swiftly knows about
swiftly use 6.3            # Activate a installed release line (exact syntax may vary by Swiftly version)
swift --version            # Re-check: PATH should now resolve the chosen toolchain
```

| Habit | Why |
|-------|-----|
| Prefer **release** toolchains for day work | Snapshots move; products should not |
| Record `swiftly list` + `swift --version` in onboarding | New hires stop guessing |
| Keep Xcode’s toolchain for **app** builds | SDK + signing live there |
| Name the channel in README | “App = Xcode N; Linux CI = `swift:6.3` / Swiftly 6.3.x” |

Chapter **03** deepens channels (Docker, Windows, SourceKit-LSP). For first steps: install *something official*, run `swift --version`, print hello, then stop rearranging PATH.

### 4. Hello A — REPL one-liner (fastest feedback)

The REPL is the “is this machine alive?” check.

```bash
swift
# Drops into the interactive REPL. Prompt looks like: 1>
```

Inside the REPL:

```swift
print("Hello, Swift")
// What you should see: Hello, Swift
// Then the REPL shows the return type of the expression (often () for print).

"Hello".count
// Int = 5 — great for “what is the type of this?” questions.

:quit
// Leaves the REPL. (Some builds also accept Control-D.)
```

One-liner form (no interactive session):

```bash
swift -e 'print("Hello, Swift")'
# Compiles and runs a tiny program from the command line argument.
```

**What just happened**

- You exercised the **driver** (`swift`) without creating files.
- No module graph, no `Package.swift`, no signing.
- Useful for type questions and smoke checks; **not** how you ship or CI a product.
- If this fails, fix toolchain/PATH before debugging “Swift the language.”

### 5. Hello B — `swift` script (one file, full comments)

Save this as `hello.swift`:

```swift
// hello.swift — run with: swift hello.swift
//
// This file is a *script-shaped* program: one compilation unit, no Package.swift.
// The `swift` driver compiles it ephemerally and runs it. Great for glue and teaching.
// Graduate to a package when you need a second file, a dependency, tests, or CI caching.

// print(_:separator:terminator:) writes to standard output.
// Default terminator is a newline — so this becomes one log line.
print("Hello, Swift")

// Demonstrates a typed binding so you see inference in a real file, not only in REPL.
let audience = "toolchain"
print("Hello from a \(audience) script")  // String interpolation; still one process, then exit.
```

```bash
swift hello.swift
# Expected output:
# Hello, Swift
# Hello from a toolchain script
```

**What just happened**

- You did **not** need an Xcode project.
- The driver compiled and executed the file; exit code 0 means success.
- There is still no reproducible product name, test target, or dependency lock.
- This is a doorway. Packages and apps get reproducible builds.

### 6. Hello C — `swift package init` executable (the real default feel)

For anything you will keep, prefer a package:

```bash
mkdir HelloTool && cd HelloTool
swift package init --type executable --name HelloTool
# Creates Package.swift, Sources/, Tests/ (layout can vary slightly by tools version),
# and a starter main suitable for `swift run`.

swift run
# Resolves (if needed), builds the executable product, and runs it.
```

Open the main source (often `Sources/HelloTool/HelloTool.swift` or a `@main` entry—layout can vary by toolchain) and keep the idea this clear:

```swift
// Sources/HelloTool/HelloTool.swift — modern Swift 6.x style executable entry
//
// This is no longer a loose script. It is a *product* described by Package.swift:
//   - name / platforms / products / targets
//   - `swift build` / `swift run` / `swift test` become daily verbs
//
// Same language as hello.swift; different engineering contract (graph + CI portability).

/// Program entry for the HelloTool executable product.
@main
struct HelloTool {
    static func main() {
        // @main marks the type whose static main() is the process entry point.
        print("Hello from a package")  // Same print as the script; now it is a named product.
    }
}
```

If your toolchain scaffolded a top-level `print` without `@main`, that is fine for first steps—read what `swift package init` actually wrote, then evolve toward an explicit entry as you grow the tool.

```bash
swift build
# Builds without necessarily running — useful in CI “compile gate” jobs.

swift test
# Runs test targets if present — empty or scaffolded; still proves the graph works.

swift package describe
# Human-readable summary of products and targets — paste into onboarding docs.
```

**What just happened**

- `Package.swift` describes products and targets (chapter **14** owns depth).
- `swift build` / `swift run` / `swift test` become your daily verbs.
- This shape ports to Linux CI more cleanly than “open my `.xcodeproj`.”
- You now have something you can **name** in a README: “run `swift run` in HelloTool.”

### 7. Playground vs package vs app (expanded decision table)

| Question | Playground / REPL | Package (SPM) | App target (Xcode) |
|----------|-------------------|---------------|---------------------|
| Needs Apple UI frameworks heavily? | Sometimes (Mac playgrounds) | Rarely the whole story | Yes |
| Runs on Linux CI easily? | No | Yes (with care) | Needs macOS runners / Xcode |
| Good for shared libraries? | No | Yes | Possible, but SPM is clearer |
| Signing / store delivery? | No | Usually no | Yes |
| Reproducible dependency graph? | No | Yes (`Package.resolved`) | Via SPM/CocoaPods + project |
| Best first learning loop? | Yes (REPL/playground) | Yes (after hello) | After you need UI/SDK |
| Staff “what is the project?” answer | Scratch | Library or CLI product | Shippable Apple binary |
| Typical CI verb | — | `swift test` | `xcodebuild` / fastlane / Xcode Cloud |

**Rule of thumb**

- Learning syntax → REPL or script.
- Keeping code → package.
- Shipping to phones/desktops with Apple UI + signing → app target (still import packages for logic).

### 8. Mental model for install (without drowning)

You get a working `swift` one of these ways:

| Channel | Typical home | First-steps smoke |
|---------|----------------|-------------------|
| **Xcode** (Mac) | Bundled toolchain; `xcode-select` | `xcodebuild -version` + `swift --version` |
| **swift.org** / **Swiftly** | Explicit toolchains on Mac/Linux | `swiftly list` + `swift --version` |
| **Docker** images | Linux CI and local Linux parity | `docker run --rm swift:6.3 swift --version` |
| **Windows** installer | Packages and learning on Windows | `swift --version` in the documented shell |

For first steps: install *something official*, run `swift --version`, print hello three ways, then stop rearranging PATH. Chapter **03** is the full map.

---

## 2. Advanced concepts

### 1. Driver vs language mode vs SDK

Three different dials:

| Dial | Controls |
|------|----------|
| **Toolchain / compiler binary** | Which `swiftc` you invoke |
| **Language mode** (`-swift-version` / `SWIFT_VERSION`) | Which *language rules* apply (5 vs 6 matters for concurrency) |
| **SDK** (Apple) | Which platform APIs you may link |

You can run a Swift **6.3** compiler in **Swift 5** language mode. `swift --version` alone does not prove “we are in Swift 6 mode.” Chapter **02** makes that pin literacy mandatory.

```bash
# Literacy only — exact flags vary; the point is: mode is a separate dial
swift -swift-version 6 -e 'print(1)'
# If this fails, your toolchain may not support that mode yet — read the error, don’t invent flags.
```

### 2. Script vs module boundaries

`swift hello.swift` is convenient and hides modules, products, and test targets. The moment you need a second file, a dependency, or CI caching, graduate to a package. Do not grow a pile of loose `.swift` scripts into a product by accident.

Graduation triggers (any one is enough):

- second consumer of the code,
- need for `swift test` in CI,
- need for a versioned dependency,
- PATH distribution to teammates,
- Linux runner must run it.

### 3. Legacy hello literacy (museum only)

Very old tutorials used patterns you should recognize, not copy:

```swift
// Legacy (Swift ≤2.x era habits) — removed or reshaped later. Do not use in new code.
// Example idea only: C-style for and ++ lived in early teaching material.
// for var i = 0; i < 3; i++ { print(i) }
```

```swift
// Current (Swift 6.x) — write this instead
for i in 0..<3 {
    print(i)  // Closed-open range: 0, 1, 2
}
```

Legacy examples exist so brownfield reviews do not freeze. They are **not** templates for new work. Full history spine: chapter **02**.

### 4. “It works in Xcode” is not a reproduction recipe

A playground that runs on your laptop does not prove a teammate’s Linux runner can build the package. First-steps success criteria:

1. Same `swift --version` (or documented equivalent image).
2. Same entry command (`swift -e …`, `swift hello.swift`, `swift run`, scheme name, etc.).
3. Output you can paste into a PR description.

### 5. Lab — three hellos, one onboarding card

Do this once and paste the results into your team’s onboarding doc:

```bash
echo "=== toolchain ==="
swift --version
which swift
xcodebuild -version 2>/dev/null || echo "(no xcodebuild on this OS)"

echo "=== hello A (REPL one-liner) ==="
swift -e 'print("Hello, Swift")'

echo "=== hello B (script) ==="
printf '%s\n' 'print("Hello, Swift")' > /tmp/hello_swift_lab.swift
swift /tmp/hello_swift_lab.swift

echo "=== hello C (package) ==="
# Use a throwaway directory; delete when done
```

If A works and C fails, you have a package/tools-version problem—not a “Swift is broken” problem. If only Xcode works and CLI `swift` is missing, fix `xcode-select` / PATH before reading chapter **04**.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Prototype a string transform or DTO decode in a script/REPL, then move logic into a package the app imports |
| **Systems** | Prefer packages for CLI tools that must run on Linux build agents, not only on developer Macs |
| **Security** | Treat “random gist as `swift script` in CI” as unreviewed code execution—pin sources and review like any binary build |
| **Operations** | Onboarding doc: install channel + expected `swift --version` + three hello commands |
| **Software engineering** | Default new shared code to SPM layout early; avoid “we’ll package it later” debt |

---

## 4. Staff-level review checklist

- [ ] A new engineer can reproduce **three hellos** (REPL/one-liner, script, package) with documented commands on the **target OS** (Mac and/or Linux).
- [ ] `swift --version` (and `xcodebuild -version` on Apple CI) is recorded for the environment.
- [ ] The team can say whether the thing under review is a **playground**, **package**, or **app target**.
- [ ] Swiftly / swift.org / Xcode / Docker channel is **named** per workflow—not “whatever is on PATH.”
- [ ] Scripts used in CI are checked in, pinned, and reviewed—not copied from chat.
- [ ] New work assumes **Swift 6.3.x** narrative; old syntax in samples is labeled legacy, not cargo-culted.
- [ ] Nobody confuses “compiler installed” with “language mode is 6.”
- [ ] Onboarding includes `which swift` / `type -a swift` so PATH ghosts are visible.

---

## References

- [Getting started](https://www.swift.org/getting-started/)
- [Install / downloads](https://www.swift.org/install/)
- [Swift.org downloads](https://www.swift.org/download/)
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Xcode](https://developer.apple.com/documentation/xcode)
