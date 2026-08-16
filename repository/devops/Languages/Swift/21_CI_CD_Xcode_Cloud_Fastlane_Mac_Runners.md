# CI/CD — Xcode Cloud, fastlane, and Mac runners

[← Back to Swift](./README.md)

## What this chapter covers

How Swift **apps and packages** get built, tested, and released in automation: roles of **Xcode Cloud** (including **`ci_scripts`** and env injection), **GitHub Actions macOS runners** (and cousins), and **fastlane** (`setup_ci`, **ASC API key**, **match readonly**, build-number discipline, dSYMs). Also: raw **`xcodebuild archive` / `exportArchive`**, **ExportOptions.plist**, **test plans / parallel / `.xcresult`**, Actions **concurrency** + UTF-8 locale + Bundler pins, SPM caching, **TestFlight** groups, **notarization + staple**, **split build vs upload jobs**, **image/toolchain pins**, and a **failure triage order**. Not a YAML encyclopedia for every vendor. Default language story: **Swift 6.3.x**; **pin the Xcode version** on every Apple lane.

Chapter **18** named schemes; chapter **20** is the deep **signing / privacy / secrets** spine. This chapter is the train that moves without a laptop babysitter—still inject secrets, never commit them.

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
| **Runner image** (`macos-14` / `macos-15` / …) | Image drift changes available Xcodes |

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
4. **TestFlight gate** — build processed; assigned to a **group**; smoke on device before store.

A green PR job that never archives can still hide signing breakage until release day — schedule a periodic **archive dry-run**.

---

## 2. Advanced concepts

### 1. Concrete Xcode Cloud workflow stages

Think in **stages**, not vendor mythology. A typical app workflow:

| Stage | What happens | Staff question |
|-------|--------------|----------------|
| **1. Trigger** | PR opened, branch push, tag, or schedule | Which git event starts *this* workflow? |
| **2. Environment** | Xcode version + macOS image selected in workflow | Is the Xcode pin explicit and printed in logs? |
| **3. Resolve / fetch** | Clone, SPM resolve, resource fetch | Cache miss or network flake? |
| **4. Build** | Compile scheme actions | Shared scheme? Debug vs Release config? |
| **5. Test** | Test action / test plan | Pinned simulator? Which plan? |
| **6. Archive** (release shapes) | Create archive | Distribution signing available? |
| **7. Export** | IPA / app export with method | Export method matches destination? |
| **8. Distribute** | TestFlight / App Store Connect upload | ASC API auth via secrets? |
| **9. Post** | Notifications, artifact retention | Who is paged on red? |

| Shape | Typical trigger | Stages emphasized |
|-------|-----------------|-------------------|
| **PR validation** | Pull request | 1–5; no store upload |
| **Branch build** | Push to `main` | Broader tests; optional 6–8 internal |
| **Tag / release** | Version tag | Full 1–9 |
| **Nightly** | Schedule | Archive dry-run; wider simulator matrix |

Xcode Cloud integrates with App Store Connect and Xcode’s UI for workflows. Staff still document: **which workflow**, **which scheme**, **which Xcode**, **which secrets**. Official: [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud), [workflow reference](https://developer.apple.com/documentation/xcode/xcode-cloud-workflow-reference).

**Xcode Cloud–specific strengths (why teams pick it):**

| Strength | Meaning |
|----------|---------|
| Apple-hosted Mac + Xcode pins in the workflow UI | Less “which image has which Xcode?” archaeology |
| Signing / distribution often closer to ASC | Fewer home-grown cert import scripts — still *understand* ch **20** |
| Post-actions → TestFlight groups / Mac notarization paths | Distribution wired as workflow stages |
| Parallel test destinations | Matrix without babysitting a rack of Macs |

**Xcode Cloud–specific costs:**

| Cost | Habit |
|------|--------|
| Workflow config lives largely in ASC / Xcode UI | Screenshot or document workflows; treat them as prod config |
| Custom setup needs **`ci_scripts`** | See next section — do not hide required secrets by omission |
| Monorepo / non-Apple jobs | Often hybrid with Actions/Linux |

### 1b. Xcode Cloud `ci_scripts` — the extension point

When the GUI workflow is not enough (xcodegen, secret xcconfig assembly, CocoaPods, custom lint), Apple’s custom scripts live under **`ci_scripts/`** in the repo. Names you will meet:

| Script | When it runs | Typical job |
|--------|--------------|-------------|
| `ci_post_clone.sh` | After clone, before resolve/build | `xcodegen`, `pod install`, brew tools |
| `ci_pre_xcodebuild.sh` | Just before `xcodebuild` | Write xcconfig from **env vars**; fail if secrets missing |
| `ci_post_xcodebuild.sh` | After build | Extra artifact handling, notifications |

```bash
#!/bin/sh
# ci_scripts/ci_pre_xcodebuild.sh — illustrative literacy
set -euo pipefail

require_env() {
  eval "val=\${$1-}"
  if [ -z "$val" ]; then
    echo "error: missing required env: $1" >&2
    exit 64   # fail closed — empty config that "builds" is worse
  fi
}

require_env "MY_API_BASE_URL"
# Write non-secret or injected config your build settings expect.
# Never echo secret values into logs.
printf 'API_BASE_URL = %s\n' "$MY_API_BASE_URL" > Config/CI.xcconfig
```

**What just happened**

- Xcode Cloud injects **environment variables / secrets** you configured in the workflow; scripts consume them.
- **Fail closed** if a required secret is missing — a green build with empty Firebase/AdMob config is a production foot-gun.
- Keep scripts **idempotent** and boring; put product logic in the app, not in CI glue.

Register every required env in the workflow UI and in onboarding docs. Chapter **20** owns *what* may live in secrets; this chapter owns *when* they are assembled.

### 2. Xcode Cloud vs Actions macOS vs fastlane

| Need | Lean toward |
|------|-------------|
| Tight App Store Connect integration, Xcode-native workflows | **Xcode Cloud** |
| Multi-language monorepo, custom matrices, non-Apple jobs beside iOS | **GitHub Actions** (or similar) + macOS runners |
| Reusable Ruby lanes shared across CI vendors; store upload glue | **fastlane** on top of either |
| Linux SPM-only open source | Linux runners + `swift test` — skip Mac |

Hybrid is common: Actions for PR package tests; Xcode Cloud or Mac Actions for app archive.

### 3. fastlane — ASC API key, setup_ci, match readonly, build numbers

Common actions teams still name in PRs:

| Action | Job |
|--------|-----|
| `setup_ci` | CI keychain / temp paths — call early on bots |
| `app_store_connect_api_key` | JWT auth for ASC (preferred over Apple ID + 2FA) |
| `scan` | Run tests |
| `gym` / `build_app` | Build/archive |
| `match` | Cert/profile sync (brownfield-common); **`readonly: true` on CI** |
| `increment_build_number` / `latest_testflight_build_number` | Monotonic CI build numbers |
| `pilot` / `upload_to_testflight` | TestFlight upload |
| `deliver` / `upload_to_app_store` | Store / metadata flows |
| `upload_symbols_to_*` / dSYM lanes | Crash reporter symbolication |

```ruby
# Fastfile — illustrative literacy. Follow current fastlane docs for exact APIs.
# Secrets come from ENV / CI secret store — never hardcode .p8 contents in git.

default_platform(:ios)

platform :ios do
  before_all do
    setup_ci if ENV["CI"]
    # Preferred auth — sets lane context for pilot/deliver/match
    app_store_connect_api_key(
      key_id: ENV["APP_STORE_CONNECT_KEY_ID"],
      issuer_id: ENV["APP_STORE_CONNECT_ISSUER_ID"],
      key_content: ENV["APP_STORE_CONNECT_KEY_CONTENT"], # or key_filepath:
      duration: 1200,
      in_house: false
    )
  end

  desc "PR gate: compile + tests on a pinned simulator"
  lane :pr do
    scan(
      scheme: "MyApp",
      device: "iPhone 16", # pin; do not silently float
      clean: false
    )
  end

  desc "Build signed App Store export and upload to TestFlight"
  lane :beta do
    # CI must not mint new certs by accident
    match(type: "appstore", readonly: true) if ENV["USE_MATCH"] == "1"

    increment_build_number(
      build_number: latest_testflight_build_number(
        initial_build_number: 1,
        version: get_version_number(xcodeproj: "MyApp.xcodeproj")
      ) + 1
    )

    build_app(
      scheme: "MyApp",
      export_method: "app-store", # must match distribution signing (ch 20)
      clean: false
    )

    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      groups: ["Internal QA"],
      changelog: ENV["BETA_CHANGELOG"] || "CI build"
    )

    # If you use a crash reporter, upload dSYMs in the same release job (tool-specific action).
  end

  desc "Store submission — higher blast radius; often requires human approval"
  lane :submit do
    upload_to_app_store(submit_for_review: false)
  end
end
```

**What just happened**

- `setup_ci` prepares an ephemeral CI keychain story so signing does not fight the login keychain.
- `app_store_connect_api_key` is the modern ASC auth path — chapter **20** owns rotation of the `.p8`.
- `match(..., readonly: true)` on CI prevents “CI created a new cert at 3 a.m.” incidents.
- Build numbers must **increase** for TestFlight; deriving from `latest_testflight_build_number` avoids collisions across agents.

| Lane | Meaning in staff language |
|------|---------------------------|
| **pr / test** | Cheap gate; no store upload |
| **beta** | Signed ship to TestFlight; ASC API key / match involved |
| **submit** | Store submission — higher blast radius; often manual approve |

Official: [App Store Connect API in fastlane](https://docs.fastlane.tools/app-store-connect-api/), [match](https://docs.fastlane.tools/actions/match/), [CI best practices](https://docs.fastlane.tools/best-practices/continuous-integration/).

### 3b. Split build vs upload (least privilege)

| Job | Needs | Should not need |
|-----|-------|-----------------|
| **Build / test** | Checkout, Xcode, maybe match readonly | Permission to submit for App Review |
| **Upload / distribute** | ASC API key with upload role, artifact from build | Broad repo write, unrelated cloud keys |

Staff habit: produce the `.ipa` / `.xcarchive` in one job; upload in another with a narrower secret set. Same idea as separating deploy keys from developer laptops (ch **20**).

### 4. GitHub Actions — macos image pin + raw xcodebuild path

Hosted runner labels (`macos-14`, `macos-15`, …) move over time. Staff habits:

- Pin the **runner image** label intentionally (`macos-15`, not eternal `macos-latest` without a decision).
- Select **Xcode** via the image’s documented versions (or `xcode-select`) and print `xcodebuild -version`.
- Re-read [GitHub’s runner OS/image notes](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners) when builds break “without a code change.”

```yaml
# .github/workflows/ios.yml — illustrative literacy only
name: iOS

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    # Pin major image deliberately. Revisit when upgrading Xcode.
    runs-on: macos-15
    # Alternative pin you will still see: runs-on: macos-14
    steps:
      - uses: actions/checkout@v4

      - name: Select Xcode
        # Exact app path varies by image — read GitHub’s image docs; fail if missing.
        run: sudo xcode-select -s /Applications/Xcode_16.4.app

      - name: Versions
        run: |
          xcodebuild -version
          swift --version

      - name: SPM cache
        uses: actions/cache@v4
        with:
          path: |
            .build
            ~/Library/Caches/org.swift.swiftpm
          # Key must change when Xcode or lockfile changes — or you lie to yourself
          key: spm-${{ runner.os }}-xcode16.4-${{ hashFiles('**/Package.resolved') }}
          restore-keys: |
            spm-${{ runner.os }}-xcode16.4-

      - name: Test
        run: |
          xcodebuild \
            -workspace MyApp.xcworkspace \
            -scheme MyApp \
            -configuration Debug \
            -destination 'platform=iOS Simulator,name=iPhone 16' \
            test
```

Self-hosted Mac fleets need the same pins plus patch/reboot discipline, **keychain unlock** for signing identities, and capacity planning (one Mac cannot absorb unbounded parallel matrices).

### 4b. Archive + export without fastlane (Actions literacy)

Teams that skip fastlane still need the same nouns:

```bash
# 1) Archive
xcodebuild archive \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  -archivePath build/MyApp.xcarchive \
  -destination 'generic/platform=iOS'

# 2) Export IPA using an ExportOptions.plist produced once from Xcode Organizer
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist ExportOptions.plist

# 3) Upload via your chosen ASC API client / transporter / fastlane pilot
# Prefer App Store Connect API key auth (ch 20) — not long-lived Apple ID sessions.
```

| File / flag | Job |
|-------------|-----|
| **ExportOptions.plist** | `method` (`app-store`, `ad-hoc`, …), team, signing style |
| **archive** | Produces `.xcarchive` including dSYMs |
| **exportArchive** | Produces distributable `.ipa` / app |

Keep `ExportOptions.plist` reviewed like code. Wrong `method` is a chapter **20** mismatch wearing CI clothes.

### 5b. Test plans, parallel tests, and `.xcresult` artifacts

| Lever | Staff habit |
|-------|-------------|
| **Test plan** (`.xctestplan`) | Name the plan in CI (`-testPlan Unit` vs `Full`); do not rely on “whatever Xcode had open” |
| **Parallel testing** | Useful for large UI suites; often wasteful for tiny unit suites (clone startup cost). Set deliberately in the plan / `-parallel-testing-enabled` |
| **`-resultBundlePath`** | Unique per job (include job id); upload `.xcresult` as a CI artifact on failure |
| **`-derivedDataPath`** | Isolate concurrent jobs so they do not stomp each other |
| **Coverage** | Optional gate (`-enableCodeCoverage YES`); treat coverage as a **signal**, not a vanity merge blocker (ch **16**) |

```bash
JOB_ID="${GITHUB_RUN_ID:-local}-$(date +%s)"
xcodebuild test \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -testPlan Unit \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -parallel-testing-enabled NO \
  -resultBundlePath "ci/results-${JOB_ID}.xcresult" \
  -derivedDataPath "ci/derived-${JOB_ID}"
# On failure: retain ci/results-*.xcresult for local Xcode inspection.
```

**What just happened**

- The **test plan** is the contract for which targets and parallel settings run in CI.
- Unique result/DerivedData paths keep matrix jobs honest.
- `.xcresult` is how humans debug a red CI without re-running blind.

Xcode Cloud can run destinations in parallel — still pin *which* destinations belong on PR vs nightly (stage table above).

### 5c. Actions hygiene — concurrency, manual release, locale

```yaml
on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch: {}   # human-triggered release / dry-run

concurrency:
  group: ios-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true   # save Mac minutes when engineers push again

env:
  LANG: en_US.UTF-8
  LC_ALL: en_US.UTF-8      # fastlane requires a UTF-8 locale on many bots
```

| Habit | Why |
|-------|-----|
| `workflow_dispatch` (or tags) for store upload | Not every commit ships to App Review |
| `concurrency` + cancel | Mac runners are expensive; superseded PR builds should die |
| `LANG` / `LC_ALL` UTF-8 | fastlane CI docs — ASCII locales break Ruby tooling |
| **Gemfile + Bundler** for fastlane | Pin fastlane like you pin Xcode; `bundle exec fastlane` |
| List `/Applications/Xcode*.app` in logs | Proves which Xcodes the image actually has |

Community wrappers (`Apple-Actions/xcodebuild`, beautifiers) are optional — the nouns above still apply if you call `xcodebuild` raw.

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

### 6. TestFlight groups as a gate

TestFlight is not “upload and forget.” Staff gate:

1. Build processed in App Store Connect (wait or poll).
2. Assigned to the right **group** (internal vs external; named QA / dogfood / partners).
3. Smoke checklist on a real device (push, login, critical path).
4. Only then promote toward store submission.

| Group habit | Why |
|-------------|-----|
| Named groups in ASC | “Uploaded” ≠ “in the right hands” |
| Internal before external | External may trigger compliance / review edges |
| Automate upload; human smoke | High-blast releases need eyes unless UI automation is strong |
| Document who owns each group | On-call knows who to ping |
| “What to test” / changelog | Beta notes for humans — automate from PR titles if you can |

External groups can trigger additional App Store Connect / compliance edges — treat external as a **wider** gate than internal.

### 6b. dSYMs and crash symbolication

A Release archive that never uploads **dSYMs** (or equivalent symbol bundles) to your crash reporter produces unreadable stacks in production.

| Habit | Why |
|-------|-----|
| Retain `.xcarchive` / dSYMs as CI artifacts for N days | Forensics when upload fails |
| Upload symbols in the **same** release job that ships the binary | Version skew otherwise |
| Confirm bitcode folklore is dead for your SDK train | Do not cargo-cult obsolete steps |

Tool-specific upload actions change; the staff rule does not: **symbols travel with the build**.

### 7. Notarization + staple (macOS)

macOS software distributed **outside** the Mac App Store often needs **notarization** (Apple’s automated malware/signing scan) in addition to Developer ID signing. Deep signing detail: chapter **20**. CI literacy:

| Step | Meaning |
|------|---------|
| Sign with **Developer ID Application** (typical) | Identity for distribution outside MAS |
| Enable **Hardened Runtime** | Common notarization requirement |
| **`notarytool submit`** | Upload to Apple notary (prefer ASC API key) |
| **`stapler staple`** | Attach ticket for offline Gatekeeper |
| Gate in CI | Fail release if notarize **or** staple fails |

```bash
# Literacy shape — exact flags follow current Apple notarization docs
# xcrun notarytool submit MyApp.zip --key api.p8 --key-id … --issuer … --wait
# xcrun stapler staple MyApp.app
# codesign -vvv --deep --strict MyApp.app
```

| Platform path | Do not confuse with |
|---------------|---------------------|
| iOS → TestFlight / App Store | Mac Developer ID → notary |
| Xcode Cloud Mac notarization post-action | Hand-rolled Actions notary scripts (both valid; document which) |

ZIP containers: staple **inner** signed items, then re-pack — see Apple’s customizing notarization workflow. Full refusal list and forensic dumps: chapter **20**.

### 8. Failure triage order

When CI is red, walk this order before rewriting product code:

1. **Did the pin change?** Runner image, Xcode path, `macos-14`→`15`, silent `macos-latest` drift.
2. **Versions in the log** — `xcodebuild -version` / `swift --version` match the contract?
3. **Scheme / destination** — shared scheme present? Simulator name/OS still on the image?
4. **Secrets / signing** — expired cert, missing ASC key, wrong export method, match readonly failure?
5. **Build number** — TestFlight reject for non-increasing CFBundleVersion?
6. **Cache** — poison after Xcode bump? Invalidate keyed caches.
7. **SPM resolve** — `Package.resolved` drift or network?
8. **ci_scripts / env** — missing required Xcode Cloud env (exit 64)?
9. **Flaky test / missing xcresult** — quarantine with owner; attach result bundle; don’t disable the job.
10. **Product regression** — now debug application code.

| Anti-pattern | Replace with |
|--------------|--------------|
| “Clean DerivedData and rerun” as first step | Check pins and logs first |
| Blaming Swift for ASC upload 401 | Check ASC API key / role |
| Expanding simulator matrix while red | Stabilize one pinned destination |
| CI `match` without `readonly` | `readonly: true` on bots |
| Green build, empty secrets in xcconfig | Fail closed in `ci_pre_xcodebuild` |
| Parallel UI clones on a 10-second unit suite | Disable parallel in the PR test plan |
| No `.xcresult` on failure | Always set `-resultBundlePath` uniquely |

### 9. Legacy literacy

| Fossil | Modern note |
|--------|-------------|
| “Build on the intern’s Mac” as release | Replace with pinned CI + signed artifacts |
| fastlane + fragile Apple ID 2FA hacks | ASC API keys |
| Unpinned `macos-latest` forever | Pin major image; upgrade deliberately |
| Only Debug simulator tests | Add Release archive job |
| Secrets in repo “just for CI” | Vault / Actions secrets / Xcode Cloud secrets |
| Skip TestFlight smoke / ignore groups | Device gate + named groups before store |
| Upload binary without dSYMs | Symbols in the same release job |
| One job with every secret on Earth | Split build vs upload least privilege |
| Apple ID + app-specific password as default CI auth | ASC API key |
| Xcode Cloud with undocumented required env | Document + `require_env` fail-closed |
| Unpinned fastlane gem on the runner | Gemfile + `bundle exec` |
| ASCII locale on the bot | `LANG` / `LC_ALL` = UTF-8 |
| Every push uploads to TestFlight | Tags / `workflow_dispatch` for distribute |

---

### 10. Lab — reproduce the CI contract locally

```bash
# 1) Same pins CI claims
xcodebuild -version && swift --version

# 2) Same scheme list
xcodebuild -list -workspace MyApp.xcworkspace

# 3) Same test invocation (adjust destination to the pinned sim)
bundle exec fastlane pr
# or raw xcodebuild test … matching the YAML

# 4) Optional: archive dry-run on a release machine / nightly agent
# bundle exec fastlane beta   # only with secrets present — never paste keys into shell history casually
```

**What just happened:** if local green and CI red, you are looking at **pin / secret / cache** drift—not a heisenbug in `body`.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Tag `v*` → `beta` lane → TestFlight **group** → smoke → submit |
| **Systems** | SPM package Linux CI + Mac app CI as separate workflows; SPM cache keyed honestly |
| **Security** | OIDC/short-lived tokens where the vendor supports them; least-privilege ASC keys |
| **Operations** | Dashboard: which lane is red; Xcode pin in the failure Slack message; triage order posted |
| **Software engineering** | Same lane locally: `bundle exec fastlane pr` documented for reproduction |

---

## 4. Staff-level review checklist

- Primary pipeline documented: Xcode Cloud, Actions+`xcodebuild`, and/or fastlane — not folklore.
- Xcode Cloud (if used): workflow stages named; **`ci_scripts`** and required env vars documented; fail closed on missing secrets.
- Xcode version printed and **pinned** on every Apple job; runner image label intentional (`macos-14` / `macos-15`, not accidental latest).
- Shared scheme + configuration match chapter **18** contract; `ExportOptions.plist` reviewed when exporting without the Organizer.
- Secrets injected from a secret store; ASC API key preferred; nothing signing-related committed.
- fastlane: `setup_ci` on bots; `app_store_connect_api_key`; `match` **readonly** on CI; build numbers monotonic.
- Test **plan** named in CI; parallel testing intentional; unique `-resultBundlePath` / DerivedData per job; `.xcresult` retained on failure.
- Actions: `concurrency` cancel for PR noise; `workflow_dispatch` or tags for distribute; UTF-8 locale; Bundler-pinned fastlane when used.
- Build vs upload jobs separated when blast radius matters.
- PR / main / release / TestFlight gates are distinct; TestFlight **groups** + changelog intentional.
- dSYMs / symbols uploaded with the release binary when a crash reporter is in play.
- Archive dry-run exists if PRs only simulator-test.
- SPM / DerivedData cache keys include Xcode + dependency lock hashes.
- macOS outside-store shipping has a **notarization + staple** story when required (or Xcode Cloud notarize post-action documented).
- Failure triage order is known to on-call (pins before product archaeology).
- Package-only projects are not wasting macOS minutes without reason.

---

## References

- [Xcode Cloud](https://developer.apple.com/documentation/xcode/xcode-cloud)
- [Xcode Cloud workflow reference](https://developer.apple.com/documentation/xcode/xcode-cloud-workflow-reference)
- [Xcode Cloud — writing custom build scripts](https://developer.apple.com/documentation/xcode/writing-custom-build-scripts)
- [Xcode Cloud — environment variable reference](https://developer.apple.com/documentation/xcode/environment-variable-reference)
- [Building your project with xcodebuild](https://developer.apple.com/documentation/xcode/building-your-project-with-xcodebuild)
- [fastlane docs](https://docs.fastlane.tools/)
- [fastlane — continuous integration](https://docs.fastlane.tools/best-practices/continuous-integration/)
- [fastlane + GitHub Actions](https://docs.fastlane.tools/best-practices/continuous-integration/github/)
- [Using App Store Connect API (fastlane)](https://docs.fastlane.tools/app-store-connect-api/)
- [fastlane match](https://docs.fastlane.tools/actions/match/)
- [GitHub-hosted runners](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners)
- [Swift.org getting started / CI-friendly installs](https://www.swift.org/getting-started/)
- [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Customizing the notarization workflow](https://developer.apple.com/documentation/security/customizing_the_notarization_workflow)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
