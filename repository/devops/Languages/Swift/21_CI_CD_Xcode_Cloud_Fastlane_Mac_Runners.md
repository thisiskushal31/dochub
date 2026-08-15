# CI/CD — Xcode Cloud, fastlane, and Mac runners

[← Back to Swift](./README.md)

## What this chapter covers

How Swift **apps and packages** get built, tested, and released in automation: roles of **Xcode Cloud**, **GitHub Actions macOS runners** (and cousins), and **fastlane**. Caching SPM, **TestFlight** gates, **notarization** glance for macOS, and **image/toolchain pins**. Not a YAML encyclopedia for every vendor. Default language story: **Swift 6.3.x**; **pin the Xcode version** on every Apple CI lane.

Chapter **18** named schemes; chapter **20** named secrets. This chapter connects them into a train that can move without a laptop babysitter.

---

## 1. Concepts

### 1. Three roles — do not collapse them

| Piece | Role |
|-------|------|
| **Xcode Cloud** | Apple-hosted CI/CD integrated with Xcode / App Store Connect workflows |
| **Mac runners** (e.g. GitHub-hosted `macos-*`) | General CI agents that can run `xcodebuild`, `swift test`, fastlane |
| **fastlane** | Automation **toolkit** (lanes for build/test/sign/upload) — runs *on* a Mac (cloud or self-hosted) |

```text
Trigger (PR / tag / schedule)
    → Mac environment with pinned Xcode
        → xcodebuild and/or fastlane lane
            → tests → archive → export → upload (TestFlight / store APIs)
```

Xcode Cloud can replace parts of that graph; fastlane can orchestrate it on Actions; Actions alone can call `xcodebuild` with no fastlane. **Choose deliberately**; document the primary path.

### 2. What every Apple app pipeline must pin

| Pin | Why |
|-----|-----|
| **Xcode version** (and thus SDK) | Silent Xcode upgrades break or “fix” builds mysteriously |
| **Scheme + configuration** | Chapter **18** contract |
| **Destination** (sim OS / device) | Flaky “random simulator” matrices |
| **Swift language mode** | Compiler vs mode (chapter **02**) |
| **Signing secrets** | Chapter **20** — injected, not committed |

```bash
xcodebuild -version
swift --version
# Print both at the start of every CI job — logs become your audit trail.
```

### 3. Package CI vs app CI

| Kind | Typical command | Runner |
|------|-----------------|--------|
| **SPM package** (portable) | `swift test` | Linux often enough; Mac if Apple-only APIs |
| **App / Xcode project** | `xcodebuild test` / archive | **macOS** with Xcode |
| **Mixed** | Package tests on Linux + app tests on Mac | Two jobs, clear names |

Do not pay for macOS minutes to compile pure portable packages unless you must.

### 4. Gates (what “green” means)

Staff-quality trains separate:

1. **PR gate** — compile + unit (and maybe thin UI) tests.
2. **Merge / main gate** — broader tests; maybe beta upload.
3. **Release gate** — archive, signed export, upload, manual or automated promote.
4. **TestFlight gate** — build processed; assigned to a group; smoke on device before store.

A green PR job that never archives can still hide signing breakage until release day — schedule a periodic **archive dry-run**.

---

## 2. Advanced concepts

### 1. Xcode Cloud workflow shapes

Think in **workflow shapes**, not vendor mythology:

| Shape | Typical trigger | Actions |
|-------|-----------------|---------|
| **PR validation** | Pull request | Build + test on pinned Xcode; no store upload |
| **Branch build** | Push to `main` | Broader tests; optional TestFlight internal |
| **Tag / release** | Version tag | Archive → export → upload → promote |
| **Nightly** | Schedule | Archive dry-run; wider simulator matrix |

Xcode Cloud integrates with App Store Connect and Xcode’s UI for workflows. Staff still document: **which workflow**, **which scheme**, **which Xcode**, **which secrets**. Official: [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud), [workflow reference](https://developer.apple.com/documentation/xcode/xcode-cloud-workflow-reference).

### 2. Xcode Cloud vs Actions macOS vs fastlane

| Need | Lean toward |
|------|-------------|
| Tight App Store Connect integration, Xcode-native workflows | **Xcode Cloud** |
| Multi-language monorepo, custom matrices, non-Apple jobs beside iOS | **GitHub Actions** (or similar) + macOS runners |
| Reusable Ruby lanes shared across CI vendors; store upload glue | **fastlane** on top of either |
| Linux SPM-only open source | Linux runners + `swift test` — skip Mac |

Hybrid is common: Actions for PR package tests; Xcode Cloud or Mac Actions for app archive.

### 3. fastlane lanes literacy (build / beta / submit)

Common actions teams still name in PRs:

| Action | Job |
|--------|-----|
| `scan` | Run tests |
| `gym` / `build_app` | Build/archive |
| `match` | Cert/profile sync (legacy-common signing model) |
| `pilot` / `upload_to_testflight` | TestFlight upload |
| `deliver` / `upload_to_app_store` | Store / metadata flows |

```ruby
# Fastfile sketch — illustrative; follow current fastlane docs for APIs
lane :pr do
  scan(scheme: "MyApp", device: "iPhone 16")  # Test gate for pull requests
end

lane :beta do
  # Signing via CI secrets / match / API keys — never hardcode
  gym(scheme: "MyApp", export_method: "app-store")
  upload_to_testflight(skip_waiting_for_build_processing: true)
end

lane :submit do
  # Promote or upload for App Review — require human confirmation in many orgs
  upload_to_app_store(submit_for_review: false)
end
```

| Lane | Meaning in staff language |
|------|---------------------------|
| **pr / test** | Cheap gate; no signing drama required beyond what tests need |
| **beta** | Signed ship to TestFlight; ASC API key / match involved |
| **submit** | Store submission — higher blast radius; often manual approve |

Prefer **App Store Connect API keys** in CI secrets over interactive Apple ID passwords. Match-era git-encrypted certs: literacy for brownfield; evaluate modern secret stores when redesigning (chapter **20**).

### 4. GitHub Actions macos runners + image pins

Hosted runner labels (`macos-14`, `macos-15`, …) move over time. Staff habits:

- Pin the **runner image** label intentionally (`macos-15`, not eternal `macos-latest` without a decision).
- Select **Xcode** via the image’s documented versions (or `xcode-select`) and print `xcodebuild -version`.
- Re-read [GitHub’s runner OS/image notes](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners) when builds break “without a code change.”

Self-hosted Mac fleets need the same pins plus patch/reboot discipline.

```yaml
# Sketch — illustrative only
jobs:
  ios:
    runs-on: macos-15
    steps:
      - uses: actions/checkout@v4
      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_16.4.app
      - name: Versions
        run: xcodebuild -version && swift --version
```

(Exact Xcode app paths vary by image—read the image docs; fail if missing.)

### 5. Caching SPM without lying to yourself

Useful caches:

- SPM checkouts / build artifacts **keyed by** Xcode version + `Package.resolved` hash,
- Ruby gems for fastlane (version-pinned Gemfile),
- tool downloads you control.

Dangerous caches:

- stale DerivedData across Xcode upgrades,
- sharing DerivedData across unrelated schemes without keying,
- caching signed artifacts as if they were source.

When builds go weird after an Xcode bump: **invalidate caches** before debugging application code for an hour.

### 6. TestFlight as a gate

TestFlight is not “upload and forget.” Staff gate:

1. Build processed in App Store Connect (wait or poll).
2. Assigned to the right group (internal/external).
3. Smoke checklist on a real device (push, login, critical path).
4. Only then promote toward store submission.

Automate upload; keep **human smoke** for high-blast releases unless you have strong UI automation coverage.

### 7. Notarization (macOS) glance

macOS software distributed outside the Mac App Store often needs **notarization** (Apple malware scan attestation) in addition to signing. Literacy only:

| Step | Meaning |
|------|---------|
| Sign with Developer ID (typical) | Identity for distribution outside MAS |
| Notarize | Submit to Apple; staple ticket to the bundle |
| Gate in CI | Fail release if notarization fails |

Follow Apple’s current notarization docs when you ship Mac apps outside the store. iOS TestFlight/App Store paths are a different train—do not mash the nouns.

### 8. Legacy literacy

| Fossil | Modern note |
|--------|-------------|
| “Build on the intern’s Mac” as release | Replace with pinned CI + signed artifacts |
| fastlane + fragile Apple ID 2FA hacks | ASC API keys |
| Unpinned `macos-latest` forever | Pin major image; upgrade deliberately |
| Only Debug simulator tests | Add Release archive job |
| Secrets in repo “just for CI” | Vault / Actions secrets / Xcode Cloud secrets |
| Skip TestFlight smoke | Device gate before store |

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Tag `v*` → beta lane → TestFlight group → smoke → submit |
| **Systems** | SPM package Linux CI + Mac app CI as separate workflows |
| **Security** | OIDC/short-lived tokens where the vendor supports them; least-privilege ASC keys |
| **Operations** | Dashboard: which lane is red; Xcode pin in the failure Slack message |
| **Software engineering** | Same lane locally: `bundle exec fastlane pr` documented for reproduction |

---

## 4. Staff-level review checklist

- [ ] Primary pipeline documented: Xcode Cloud, Actions+`xcodebuild`, and/or fastlane — not folklore.
- [ ] Xcode version printed and **pinned** on every Apple job; runner image label intentional.
- [ ] Shared scheme + configuration match chapter **18** contract.
- [ ] Secrets injected from a secret store; nothing signing-related committed.
- [ ] PR / main / release / TestFlight gates are distinct and known to the team.
- [ ] Archive dry-run exists if PRs only simulator-test.
- [ ] SPM / DerivedData cache keys include Xcode + dependency lock hashes.
- [ ] fastlane `pr` / `beta` / `submit` responsibilities are named (even if Actions calls `xcodebuild` directly).
- [ ] macOS outside-store shipping has a **notarization** story when required.
- [ ] Package-only projects are not wasting macOS minutes without reason.

---

## References

- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Xcode Cloud workflow reference](https://developer.apple.com/documentation/xcode/xcode-cloud-workflow-reference)
- [Building your project with xcodebuild](https://developer.apple.com/documentation/xcode/building-your-project-with-xcodebuild)
- [fastlane docs](https://docs.fastlane.tools/)
- [fastlane — continuous integration](https://docs.fastlane.tools/best-practices/continuous-integration/)
- [fastlane + GitHub Actions](https://docs.fastlane.tools/best-practices/continuous-integration/github/)
- [fastlane match](https://docs.fastlane.tools/actions/match/)
- [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners)
- [Swift.org getting started / CI-friendly installs](https://www.swift.org/getting-started/)
- [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
