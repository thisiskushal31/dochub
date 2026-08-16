# Toolchains: swift.org, Xcode, Linux, and Windows

[← Back to Swift](./README.md)

## What this chapter covers

Where a working **`swift`** comes from: **swift.org** downloads and **Swiftly**, **Xcode-bundled** toolchains, **Linux** (including **official Docker images** with hands-on lab commands), **Windows** installs, and editor literacy with **VS Code + SourceKit-LSP**. You will practice diagnosing **two Swifts** with `type -a` / `xcrun --find swift`, and keep an **Xcode ↔ Swift version table** as a living habit. The staff question this chapter answers is always: **which `swift` is on PATH in CI?** Handbook pin: develop and ship against **Swift 6.3.x**-class toolchains unless a waiver says otherwise.

---

## 1. Concepts

### 1. A toolchain is a product, not a vibe

A **Swift toolchain** is a coherent set of binaries and libraries: `swift`, `swiftc`, package manager pieces, stdlib, and supporting tools. Your shell’s `PATH`, Xcode’s selected developer directory, container images, and CI macros all pick *one* of those products at build time.

```bash
swift --version
which swift
type -a swift
# On macOS, also know what Xcode is selected:
xcode-select -p
xcodebuild -version
xcrun --find swift
```

If those disagree across laptops and CI, you do not have “a Swift shop”—you have a lottery.

### 2. Channel map (how people actually install)

| Channel | Best at | Watch-outs |
|---------|---------|------------|
| **Xcode** (Mac) | Apple SDK apps, Interface Builder, signing workflows | Bundled Swift version tied to Xcode; language mode still per target |
| **swift.org downloads** | Explicit toolchain picks; matching docs to a known build | You must manage PATH / `TOOLCHAINS` deliberately |
| **Swiftly** | Installing and switching swift.org toolchains with less pain | Still record the active version in onboarding |
| **Linux packages / Docker** | Server packages, reproducible CI | Foundation differences vs Darwin; image tags must be pinned |
| **Windows installer** | Packages, tools, learning on Windows hosts | Validate the exact scenarios you claim to support |

Apple app shipping almost always implies **Xcode + SDK** on a Mac (cloud or metal). Package-only products can live on Linux runners with a swift.org or container toolchain.

### 3. Swiftly (day-to-day toolchain manager)

**Swiftly** is how many teams install and switch **swift.org** toolchains without folklore zip scripts.

```bash
swiftly --version
swiftly list                 # What is installed
swiftly install 6.3          # Install a release line (exact args follow current docs)
swiftly use 6.3              # Select active toolchain for this environment
swift --version              # Prove PATH now matches intent
```

| Do | Don’t |
|----|-------|
| Use release toolchains for products | Point prod CI at snapshots silently |
| Document `swiftly use` expectation | Assume every laptop auto-matches CI |
| Pair with Docker for Linux parity | Pretend Swiftly replaces Xcode SDKs |

App builds still need **Xcode** for Apple SDKs, simulators, and signing. Swiftly shines for packages, CLIs, and “I need Swift 6.3.x even if Xcode’s default feels older/newer.”

### 4. Matching Xcode ↔ Swift versions (habit)

Xcode ships with a **bundled** Swift. Teams get hurt when:

- README says “Swift 6.3,”
- CI image has Xcode N whose bundled Swift is different,
- a developer’s `swiftly use` points somewhere else entirely.

**Habit:** maintain a tiny compatibility card in-repo (update on every bump). Do not memorize a global internet matrix—**print versions in CI** and treat mismatches as failed jobs.

Example card shape (fill with *your* numbers; placeholders below are illustrative only):

| Workflow | Xcode (if any) | How you print Swift | Expected `swift --version` family | Language mode |
|----------|----------------|---------------------|-----------------------------------|---------------|
| iOS app CI | e.g. 16.x | `xcrun swift --version` in job log | Must match allow-list | 6 (new targets) |
| Laptop app work | same major as CI | `xcrun --find swift` + version | same as CI | per target |
| Linux package CI | — | `docker run … swift --version` | `swift:6.3` (or digest) | 6 |
| Package work on Mac via Swiftly | optional | `swiftly list` + `swift --version` | 6.3.x release | 6 |

```bash
# Make the habit mechanical — run in CI and on boarding day
{
  echo "xcodebuild: $(xcodebuild -version 2>/dev/null | tr '\n' ' ' || echo n/a)"
  echo "xcrun swift: $(xcrun swift --version 2>/dev/null | head -1 || echo n/a)"
  echo "PATH swift:  $(swift --version 2>/dev/null | head -1 || echo n/a)"
  echo "which:       $(which swift 2>/dev/null || echo n/a)"
  echo "xcrun find:  $(xcrun --find swift 2>/dev/null || echo n/a)"
} 
```

**What just happened**

- The card is a **living artifact**, not a wiki fossil.
- Every bump of Xcode or Docker tag updates one row—reviewers can see drift.
- “Swift 6” in a Slack channel is not a pin; the printed triple (Xcode, `swift --version`, language mode) is.

### 5. Xcode-bundled Swift

On macOS, installing Xcode (or CLT + selected Xcode) puts a Swift toolchain behind `xcrun` / `swift` depending on `xcode-select`.

Staff habits:

- Know **which Xcode.app** is selected on build agents.
- Know that upgrading Xcode upgrades the *bundled compiler*—schedule it like a platform change.
- Remember: new Xcode ≠ automatic Swift **6** language mode on every target (chapter **02**).

```bash
sudo xcode-select -s /Applications/Xcode.app
# Point at the Xcode you intend (path may vary: Xcode-beta.app, etc.)
xcodebuild -version
xcrun swift --version
```

### 6. Lab — Docker `swift:` image (commands you actually run)

Linux is where many packages and server components prove they are portable. Prefer **official Swift images** over hand-rolled “we apt installed something once.”

```bash
# 1) Pull a pinned tag (prefer digest in production CI)
docker pull swift:6.3

# 2) Identity check — what compiler is inside?
docker run --rm swift:6.3 swift --version
docker run --rm swift:6.3 which swift
docker run --rm swift:6.3 swift package --version

# 3) One-shot compile/run without mounting anything
docker run --rm swift:6.3 swift -e 'print("Hello from container")'

# 4) Mount a package and test it with the container toolchain
#    (run from a directory that contains Package.swift)
docker run --rm -v "$PWD":/src -w /src swift:6.3 swift test

# 5) Build only (compile gate)
docker run --rm -v "$PWD":/src -w /src swift:6.3 swift build

# 6) Interactive shell for debugging PATH / Foundation surprises
docker run --rm -it -v "$PWD":/src -w /src swift:6.3 bash
# inside: swift --version; ls; swift test
```

| Practice | Why |
|----------|-----|
| Pin image tag / digest | `latest` drifts under you |
| Run tests in-container | Catch Darwin-only assumptions early |
| Cache build folders carefully | Speed without leaking stale artifacts across versions |
| Separate app CI from package CI | UIKit will not compile on Linux—don’t pretend |
| Print `swift --version` in the job | Evidence beats memory |

**What just happened**

- The container is a **portable toolchain product**, not a mysterious cloud.
- Mounting `$PWD` makes your package the unit under test—same as CI.
- If host Mac tests pass and container tests fail, you found a portability bug early (Foundation/corelibs, path case, etc.).

### 7. Windows notes (literacy that saves tickets)

Windows is a supported install channel for packages, tools, and learning. It is **not** a substitute for Apple SDK app builds.

| Topic | Practice on Windows | Why it bites teams |
|-------|---------------------|--------------------|
| Install | Use the **official** Windows toolchain installer from swift.org | Random mirrors = supply-chain risk |
| Shell | Pick **one** documented shell for CI (PowerShell is common) | Mixed cmd/PowerShell snippets rot docs |
| Paths | Prefer `FilePath` / URL APIs over handmade `\` strings | Escaping and separators lie across OSes |
| Case sensitivity | Windows FS often case-insensitive; Linux is not | “Works on Windows laptop, fails in Linux CI” |
| Line endings | Watch CRLF in scripts, fixtures, heredocs | Checksums and shell scripts break mysteriously |
| Apple SDKs | Unavailable—say so in README | Stops false expectations for UIKit/SwiftUI |
| PATH | Confirm `swift` resolves after install; reopen the terminal | Installer PATH updates need a new session |
| CI claim | Add an explicit matrix row if you support Windows | Support is a promise; silence is a trap |

```powershell
# Windows-shaped smoke (PowerShell) — adjust if your docs standardize elsewhere
swift --version
Get-Command swift | Format-List *
swift -e 'print("Hello from Windows Swift")'
```

Staff rule: if you claim portable packages, **Linux CI is the truth serum**. Windows support is a matrix row you document—not a surprise for the intern’s laptop.

### 8. Editors: VS Code + SourceKit-LSP

You do not need Xcode to *edit* Swift packages. **SourceKit-LSP** provides language services (completion, jump-to-definition, diagnostics) to editors such as VS Code via the Swift extension ecosystem. Upstream: [SourceKit-LSP](https://github.com/swiftlang/sourcekit-lsp) (project home); install guidance lives on [swift.org documentation](https://www.swift.org/documentation/) / getting started.

Literacy points:

- LSP talks to a toolchain—wrong PATH means wrong diagnostics.
- Formatting/linting tools should use the same Swift version as CI.
- Xcode remains the center of gravity for Interface Builder, Instruments, and many signing flows—even if you edit packages in VS Code.

```bash
# Sanity: the Swift your editor’s LSP sees should match CI’s story
which swift
swift --version
```

---

## 2. Advanced concepts

### 1. Release vs snapshot

| Kind | Use |
|------|-----|
| **Release** | Default for products and CI |
| **Snapshot / development** | Experimentation, contributing to Swift, early feature access |

Snapshots move fast and break. Do not silently point production CI at a snapshot because someone wanted a blog-post feature.

### 2. Diagnosing “two Swifts” — `type -a` and `xcrun --find`

It is common to have:

- Xcode’s toolchain,
- one or more swift.org toolchains via Swiftly,
- Docker’s Linux toolchain for parity.

Name the active one in the README for each workflow (“app builds use Xcode N.x; package Linux CI uses `swift:6.3`”).

```bash
# Lab — prove whether you have one Swift or a committee
echo "=== all swifts on PATH (order matters) ==="
type -a swift

echo "=== first hit vs Xcode resolution ==="
which swift
xcrun --find swift

echo "=== versions ==="
swift --version
xcrun swift --version

echo "=== Swiftly (if present) ==="
command -v swiftly >/dev/null && swiftly list || echo "(no swiftly)"

echo "=== env that steers resolution ==="
env | grep -Ei '^(TOOLCHAINS|DEVELOPER_DIR|SWIFT_)' || true
```

**What just happened when you interpret results**

| Observation | Meaning | Fix direction |
|-------------|---------|---------------|
| One `type -a` line; `which` == `xcrun --find` | Healthy single story | Still pin CI |
| Multiple `type -a` lines | PATH lottery; first wins | Reorder PATH or remove ghosts |
| `which` ≠ `xcrun --find` | Terminal vs Xcode split brain | Align `xcode-select` / shell init / document intentional split |
| Swiftly version ≠ `xcrun` version | Expected if workflows differ | **Name** which workflow uses which |
| Docker version ≠ host | Fine if intentional | Disaster if README collapses them |

```bash
swiftly list          # if you use Swiftly
xcrun --find swift    # what Xcode currently resolves
docker run --rm swift:6.3 which swift
```

### 3. PATH is a production dependency

CI failures that look like language bugs are often:

- `swift` resolving to an old Homebrew experiment,
- `xcode-select` pointing at leftover Xcode beta,
- container layer caching an ancient compiler.

Mitigations: print `swift --version` at the start of every job; fail if it mismatches an allow-list; prefer official images over hand-rolled PATH mutations.

### 4. Apple SDK builds need Mac infrastructure

Linux Swift will not magically compile UIKit apps. Architecture diagrams that say “Swift CI on Linux” must specify **packages/server** vs **iOS/macOS apps** (Xcode Cloud, macOS GitHub runners, self-hosted Macs, etc.). Chapter **21** owns delivery pipelines; here you only refuse category errors.

### 5. Homogeneous vs mixed fleets

| Fleet style | Pros | Cons |
|-------------|------|------|
| **Homogeneous** (everyone + CI on same Xcode/image) | Fewer “works here” bugs | Forced lockstep upgrades |
| **Mixed** (dev on newest, CI on LTS image) | Safer rollouts | Must test upgrade branches deliberately |

Mixed fleets are fine when intentional. Accidental mixed fleets are outages with extra steps.

### 6. Lab — “which swift in CI?” forensics

Run this on a failing agent (or locally pretending to be CI) and paste the transcript into the incident doc:

```bash
echo "=== identity ==="
date
uname -a
echo "=== PATH ==="
echo "$PATH" | tr ':' '\n'
echo "=== swift resolution ==="
type -a swift 2>/dev/null || where swift 2>/dev/null || true
which swift 2>/dev/null || true
swift --version || true
echo "=== Xcode (macOS) ==="
xcode-select -p 2>/dev/null || echo "(no xcode-select)"
xcodebuild -version 2>/dev/null || echo "(no xcodebuild)"
xcrun --find swift 2>/dev/null || true
echo "=== Swiftly ==="
command -v swiftly >/dev/null && swiftly list || echo "(no swiftly)"
echo "=== Docker swift (if Docker available) ==="
docker run --rm swift:6.3 swift --version 2>/dev/null || echo "(skip docker)"
echo "=== env hints ==="
env | grep -Ei '^(TOOLCHAINS|DEVELOPER_DIR|SWIFT_)' || true
```

Fail the job if `swift --version` is not in the allow-list. Debugging “flaky concurrency” on the wrong compiler is how weekends die.

### 7. Lab — `TOOLCHAINS`, `DEVELOPER_DIR`, and Homebrew ghosts

macOS resolution is steered by environment as much as by installers:

| Knob | What it steers | Failure mode |
|------|----------------|--------------|
| **`PATH`** | Which `swift` binary wins first | Old Homebrew / leftover zip ahead of Xcode |
| **`DEVELOPER_DIR`** | Which Xcode tree `xcrun` uses | CI job inherits a beta path from a previous step |
| **`TOOLCHAINS`** | Selected swift.org / custom toolchain id | Silent switch after a Swiftly install |
| **`xcode-select -p`** | System default developer directory | Laptop points at deleted `Xcode-beta.app` |

```bash
# Lab — name every steerer, then break and fix deliberately (local sandbox)
echo "=== before ==="
type -a swift
which swift
xcrun --find swift
echo "DEVELOPER_DIR=${DEVELOPER_DIR:-<unset>}"
echo "TOOLCHAINS=${TOOLCHAINS:-<unset>}"

# Ghost pattern: a Homebrew or ~/toolchains swift earlier on PATH than xcrun
# Fix pattern (pick one, document it):
#   - reorder PATH in shell profile for the team
#   - unset TOOLCHAINS when you intend Xcode’s bundled compiler
#   - export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer for a job

# Prove Xcode’s answer without trusting PATH:
xcrun --sdk macosx swift --version
```

**What just happened**

- “Wrong Swift” is usually **resolution**, not a corrupt download.
- App jobs should prefer `xcrun swift` (or an explicit Xcode path) so PATH folklore cannot win.
- Package jobs on Linux should prefer a **pinned image**, not a mutated agent PATH.

### 8. Multi-Xcode side-by-side (common on Mac fleets)

Teams often keep `Xcode.app` and `Xcode-beta.app` installed. That is fine when intentional:

```bash
# List what is selectable
ls /Applications/Xcode*.app 2>/dev/null

# Point the system select (requires admin; prefer per-job DEVELOPER_DIR in CI)
# sudo xcode-select -s /Applications/Xcode.app

# Per-command without changing the system default:
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcrun swift --version
DEVELOPER_DIR=/Applications/Xcode-beta.app/Contents/Developer xcrun swift --version
```

| Habit | Why |
|-------|-----|
| CI sets `DEVELOPER_DIR` (or image) explicitly | Agents stop inheriting laptop folklore |
| Beta Xcode only on labeled jobs | Prevents “surprise SDK” in release |
| Compatibility card lists **both** if you allow beta | Reviewers see the fork |

### 9. CI allow-list pattern (paste-ready shape)

Do not only *print* the version—**fail** on mismatch:

```bash
# Shape only — adjust the allow-list strings to your pin
allowed='Swift version 6.3'
actual="$(swift --version 2>&1 | head -1)"
echo "swift: $actual"
case "$actual" in
  *"$allowed"*) echo "toolchain OK" ;;
  *)
    echo "ERROR: expected family containing: $allowed" >&2
    exit 1
    ;;
esac
```

For Apple app jobs, pair with `xcodebuild -version` allow-listing. For Docker jobs, pin by **digest** and still print `swift --version` inside the container so digests and human-readable versions stay linked in the log.

### 10. SourceKit-LSP depth (editor = toolchain client)

SourceKit-LSP is not a second compiler—it asks **your** toolchain for semantic info.

| Symptom | Likely cause | Fix direction |
|---------|--------------|---------------|
| Red squiggles that CLI `swift build` does not show | Editor’s Swift ≠ PATH/CI Swift | Point the Swift extension at the CI toolchain |
| “Cannot find module” in editor only | Wrong package root / unsaved `Package.swift` | Open the package folder; rebuild index |
| Stale diagnostics after toolchain switch | LSP server still on old binary | Restart LSP / reload window after `swiftly use` |
| Works in Xcode, broken in VS Code | Expected SDK gap for app targets | Use Xcode for SDK/signing; VS Code for packages |

```bash
# After switching toolchains, prove the editor’s world can match:
swift --version
swift package describe   # from the package root
# Then reload the editor LSP session — do not debug language bugs against a stale server
```

**What just happened**

- Editor intelligence is only as trustworthy as the toolchain it binds to.
- Onboarding that installs VS Code without naming the Swift binary creates false “language broken” tickets.

### 11. Linux Foundation / corelibs expectations (toolchain-adjacent)

A green `swift:6.3` compile does not prove Darwin-identical Foundation behavior. Staff habits:

- Run **package tests** in the Linux container, not only on Mac.
- Treat `import Foundation` as a **portability surface**—file paths, time zones, and some APIs differ on corelibs.
- Keep UIKit/SwiftUI out of packages you claim are Linux-portable (category error, not a toolchain bug).

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | App targets: pin Xcode version for local + CI; package deps may still build on Linux for logic tests |
| **Systems** | Server Swift services: Docker/swift.org pins; health-check the compiler version in deploy docs; run the Docker lab in PR CI |
| **Security** | Obtain toolchains from official channels; verify checksums/digests; treat random mirrored tarballs as supply-chain risk |
| **Operations** | Inventory: every pipeline prints toolchain identity; rotate images on a calendar; keep the Xcode↔Swift card current |
| **Software engineering** | Editor setup guide includes SourceKit-LSP + expected `swift --version`; onboarding is incomplete without two-Swift diagnosis skills |

---

## 4. Staff-level review checklist

- Every CI job logs `swift --version` (and `xcodebuild -version` on Mac app jobs).
- The README names the **channel** (Xcode / Swiftly / swift.org / Docker / Windows) per workflow.
- Container tags are **pinned**; `latest` is not a strategy.
- Xcode↔Swift compatibility card exists and matches job logs.
- Snapshots are labeled experimental and kept out of release pipelines.
- VS Code/LSP users resolve the **same** toolchain family as CI for package work.
- Windows/Linux path and case-sensitivity issues are acknowledged for portable packages.
- Someone on-call can answer: **which `swift` is on PATH in CI?** in one sentence with evidence.
- Forensic lab commands are known (or linked) for toolchain incidents.
- Engineers can diagnose `which` vs `xcrun --find` / `type -a` split brain without guessing.
- Docker `swift:` lab (`pull`, `run --version`, mount + `swift test`) has been run at least once by the team.
- CI **fails** on toolchain mismatch (allow-list), not only logs the version.
- `DEVELOPER_DIR` / `TOOLCHAINS` / PATH steerers are documented for Mac jobs.
- Multi-Xcode / beta usage is labeled; release jobs cannot silently pick beta.
- SourceKit-LSP users know how to restart/rebind after `swiftly use` or Xcode switches.

---

## References

- [Swift.org downloads](https://www.swift.org/download/)
- [Install](https://www.swift.org/install/)
- [Getting started](https://www.swift.org/getting-started/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Docker Hub — swift images](https://hub.docker.com/_/swift)
- [Xcode](https://developer.apple.com/documentation/xcode)
- [Swift on Server](https://www.swift.org/server/)
- [SourceKit-LSP repository](https://github.com/swiftlang/sourcekit-lsp)
- [Using the system shell / PATH literacy (related)](https://www.swift.org/documentation/)
