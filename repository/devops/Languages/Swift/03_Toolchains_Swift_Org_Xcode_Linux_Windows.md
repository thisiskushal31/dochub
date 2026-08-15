# Toolchains: swift.org, Xcode, Linux, and Windows

[← Back to Swift](./README.md)

## What this chapter covers

Where a working **`swift`** comes from: **swift.org** downloads and **Swiftly**, **Xcode-bundled** toolchains, **Linux** (including **official Docker images**), **Windows** installs, and editor literacy with **VS Code + SourceKit-LSP**. The staff question this chapter answers is always: **which `swift` is on PATH in CI?** Handbook pin: develop and ship against **Swift 6.3.x**-class toolchains unless a waiver says otherwise.

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

**Habit:** maintain a tiny compatibility card in-repo (update on every bump):

| Workflow | Xcode (if any) | Swift (`swift --version`) | Language mode |
|----------|----------------|---------------------------|---------------|
| iOS app CI | e.g. 16.x (example—use yours) | print in job log | 6 (new targets) |
| Linux package CI | — | `swift:6.3` image / Swiftly 6.3.x | 6 |
| Laptop app work | same major as CI | `xcrun --find swift` | per target |

Do not memorize a global matrix from memory—**print versions in CI** and treat mismatches as failed jobs.

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

### 6. Linux and official Docker images

Linux is where many packages and server components prove they are portable. Prefer **official Swift images** over hand-rolled “we apt installed something once.”

```bash
# Pin the tag your team agrees on (digest even better in production CI).
docker pull swift:6.3
docker run --rm swift:6.3 swift --version

docker run --rm -v "$PWD":/src -w /src swift:6.3 swift test
# Mount the package; run tests inside the pinned toolchain.
```

| Practice | Why |
|----------|-----|
| Pin image tag / digest | `latest` drifts under you |
| Run tests in-container | Catch Darwin-only assumptions early |
| Cache build folders carefully | Speed without leaking stale artifacts across versions |
| Separate app CI from package CI | UIKit will not compile on Linux—don’t pretend |

### 7. Windows vs Linux path differences (literacy)

| Topic | Linux | Windows |
|-------|-------|---------|
| Install channel | Docker / packages / Swiftly | Official Windows toolchain installer |
| Path separators in scripts | `/` | Prefer APIs (`FilePath` / URL) over handmade `\` strings |
| Shell for CI | bash | PowerShell or documented shell—**pick one** in docs |
| Case sensitivity | Usually case-sensitive filesystems | Often case-insensitive — hide bugs until Linux CI |
| Apple SDKs | Unavailable | Unavailable |
| Line endings | LF | Watch CRLF in scripts and fixtures |

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

### 2. Multiple Swifts on one Mac

It is common to have:

- Xcode’s toolchain,
- one or more swift.org toolchains via Swiftly,
- Docker’s Linux toolchain for parity.

Name the active one in the README for each workflow (“app builds use Xcode N.x; package Linux CI uses `swift:6.3`”).

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

**What just happened when you interpret results**

- Multiple `type -a swift` lines → PATH lottery.
- `xcrun --find swift` ≠ `which swift` → Xcode vs PATH split brain.
- Docker version ≠ host version → fine if **intentional**; disaster if README collapses them.
- Empty `SWIFT_VERSION` in project while humans claim mode 6 → chapter **02** problem, not Docker.

Fail the job if `swift --version` is not in the allow-list. Debugging “flaky concurrency” on the wrong compiler is how weekends die.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | App targets: pin Xcode version for local + CI; package deps may still build on Linux for logic tests |
| **Systems** | Server Swift services: Docker/swift.org pins; health-check the compiler version in deploy docs |
| **Security** | Obtain toolchains from official channels; verify checksums/digests; treat random mirrored tarballs as supply-chain risk |
| **Operations** | Inventory: every pipeline prints toolchain identity; rotate images on a calendar |
| **Software engineering** | Editor setup guide includes SourceKit-LSP + expected `swift --version`; onboarding is incomplete without it |

---

## 4. Staff-level review checklist

- [ ] Every CI job logs `swift --version` (and `xcodebuild -version` on Mac app jobs).
- [ ] The README names the **channel** (Xcode / Swiftly / swift.org / Docker / Windows) per workflow.
- [ ] Container tags are **pinned**; `latest` is not a strategy.
- [ ] Xcode↔Swift compatibility card exists and matches job logs.
- [ ] Snapshots are labeled experimental and kept out of release pipelines.
- [ ] VS Code/LSP users resolve the **same** toolchain family as CI for package work.
- [ ] Windows/Linux path and case-sensitivity issues are acknowledged for portable packages.
- [ ] Someone on-call can answer: **which `swift` is on PATH in CI?** in one sentence with evidence.
- [ ] Forensic lab commands are known (or linked) for toolchain incidents.

---

## References

- [Swift.org downloads](https://www.swift.org/download/)
- [Install](https://www.swift.org/install/)
- [Getting started](https://www.swift.org/getting-started/)
- [Swift.org documentation hub](https://www.swift.org/documentation/)
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/)
- [Xcode](https://developer.apple.com/documentation/xcode)
- [Swift on Server](https://www.swift.org/server/)
- [SourceKit-LSP repository](https://github.com/swiftlang/sourcekit-lsp)
