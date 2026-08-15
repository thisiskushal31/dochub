# Security, privacy, signing, and secrets

[← Back to Swift](./README.md)

## What this chapter covers

**Defense and review** literacy for shipping Apple-platform Swift: **code signing**, **entitlements**, **Keychain** item-class literacy, **privacy manifests** (required-reason APIs), **App Transport Security (ATS)**, and **secrets in CI** (including ASC API keys and match-era flows). No exploit kits, jailbreak guides, or bypass recipes. Default new work: **Swift 6.3.x**; signing pins follow your org’s Apple Developer Program and Xcode version.

If chapter **18** asked “what does CI build?”, this chapter asks “what attests that artifact, and what data does it touch?”

---

## 1. Concepts

### 1. Signing mental model: identity + permission to run

Apple platforms require **signed** apps for device install and distribution. At review level, know these nouns:

| Noun | Job |
|------|-----|
| **Team** | Apple Developer team that owns apps |
| **Signing certificate / identity** | Who signed (development vs distribution classes) |
| **Provisioning profile** | Ties app id + entitlements + devices/distribution style |
| **Bundle ID** | App identity string — must match profile |
| **Entitlements** | Declared capabilities (iCloud, push, associated domains, …) |

```text
Team
  └─ Certificate (identity)
       └─ Profile (app id + devices/distribution + entitlements allowance)
            └─ .app you stamp with codesign
```

Mismatch symptoms: install failures, missing capability at runtime, CI signing errors — usually configuration, not “Swift is broken.”

```bash
# Local/CI literacy — inspect what you built (paths vary)
codesign -dv --verbose=4 path/to/MyApp.app
# Shows signing authority and related metadata.

security find-identity -v -p codesigning
# Lists codesigning identities visible on this Mac — useful on runners.
```

**Automatic signing** in Xcode is fine for many teams when CI uses the same team and secrets store. **Manual signing** appears in enterprise and tightly controlled pipelines — document which.

### 2. Development vs distribution identities

| Path | Typical use |
|------|-------------|
| Development signing | Engineers’ devices, local debug |
| Ad hoc / TestFlight-style distribution | Internal / beta audiences |
| App Store distribution | Public store submission |
| Enterprise (org program) | Internal distribution under enterprise rules |

CI must use the **identity class** that matches the artifact’s destination. A Debug development-signed build is not your Release store candidate.

### 3. Entitlements literacy (read, don’t invent)

Entitlements are not “more permissions = better.” Each capability widens the attack and review surface.

Review questions:

- Does this PR add an entitlement? Why?
- Does the provisioning profile / App ID capability actually allow it?
- Are associated domains / keychain access groups spelled correctly?

Treat entitlement diffs like IAM policy diffs.

### 4. Keychain item classes — review literacy

The Keychain stores small secrets on-device (tokens, passwords) with access control. You do not need exploit demos; you need **class and accessibility literacy** so reviews catch foot-guns.

| Concept | Review meaning |
|---------|----------------|
| **Item class** (password, generic password, key, certificate, …) | What kind of secret; APIs differ |
| **Accessibility** (when readable: unlocked, after first unlock, …) | Background/lock-screen behavior |
| **Access groups** | Sharing with extensions / app groups |
| **Synchronizable** (when used) | iCloud Keychain implications — justify |
| **Ownership on logout** | Delete items you own; don’t assume uninstall clears multi-app groups |

Staff posture:

- Prefer system APIs / maintained wrappers your team standardizes — do not DIY crypto.
- On logout, **delete** items you own.
- This handbook will not walk through attacks against Keychain. Defenders: least privilege, clear ownership, tested logout.

Official hub: [Keychain Services](https://developer.apple.com/documentation/security/keychain_services).

### 5. Secrets never live in the repo

| Secret class | Where it belongs |
|--------------|------------------|
| **App Store Connect API key** | CI secret store / vault (preferred for automation) |
| Signing certs & profiles | CI secret store or signing service (**match**-era — ch **21**) |
| Third-party API tokens | Injected at build/runtime from secrets — not `Constants.swift` |
| Client “API keys” shipped in the app | Assume **extractable**; design backend auth accordingly |

```swift
// Bad — will be mined from the binary and git history
enum Secrets {
    static let apiKey = "sk_live_…"  // Do not do this
}

// Better shape — value comes from environment / XCConfig not checked in
enum Config {
    static var apiBaseURL: URL {
        // Non-secret configuration may be compiled in; secrets stay out.
        URL(string: "https://api.example.com")!
    }
}
```

Staff rule: if rotating the value requires a **git revert**, it was stored wrong.

### 6. Secrets in CI — ASC API key and match literacy

| Approach | Role |
|----------|------|
| **App Store Connect API key** (`.p8` + key id + issuer) | Modern automation auth for uploads / ASC APIs — store in CI secrets |
| **fastlane match** (encrypted cert/profile repo) | Common brownfield signing sync — literacy yes; evaluate against org vaults when redesigning |
| **Xcode Cloud secrets / Actions secrets** | Injection points — never echo into logs |

```text
Preferred shape for new pipelines:
  ASC API key in CI secrets
    → xcodebuild / fastlane lane
      → signed artifact
        → TestFlight / store upload

Brownfield you will still see:
  match git repo + passphrase in CI secrets
    → gym / build_app
```

Never commit the `.p8` key or match passphrase. Rotate with a named owner (chapter **21** for lane shapes).

### 7. Privacy manifests and required-reason APIs

**Privacy manifests** (`PrivacyInfo.xcprivacy`) declare certain data-collection and **required reason API** usages for the app and third-party SDKs. Apple requires reasons for sensitive APIs (file timestamp, disk space, user defaults “fingerprinting-ish” patterns, etc.—the exact list evolves; read current Apple docs when you bump Xcode).

Staff habits:

- When you add an SPM/binary dependency, check whether it ships a manifest.
- Aggregate privacy story must still hold for the **app**.
- “We don’t track” is not a substitute for a required reason when you call a covered API.

Official hub: [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files).

### 8. ATS exceptions as a review smell

**ATS (App Transport Security)** defaults toward TLS for network calls. Exceptions exist and are **review magnets**. Prefer fixing servers to use HTTPS; treat ATS exceptions as temporary, documented waivers — not a lifestyle.

| Smell | Better |
|-------|--------|
| Blanket ATS allow-arbitrary-loads | Narrow exception + owner + expiry |
| Exception added “to unblock QA” forever | Fix the endpoint; remove exception |
| Silent `Info.plist` edit in a giant PR | Dedicated PR with justification |

---

## 2. Advanced concepts

### 1. SPM supply chain (security lens)

Signing protects the Apple binary; **dependencies** still need pins and review (chapter **14**):

- Prefer version pins / resolved files reviewed in PRs.
- Binary targets and XCFrameworks are higher trust cost — verify provenance.
- Build plugins execute code at build time — treat like CI scripts.

### 2. Legacy literacy — manual signing chaos

| You see | Modern posture |
|---------|----------------|
| Each Mac has different certs; “it signs for me” | Centralize certs/profiles in CI secrets or a signing lane |
| Profiles committed as binary blobs with no rotation story | Prefer documented automation (chapter **21**) + short-lived credentials where possible |
| Team ID hardcoded inconsistently across targets | One xcconfig / shared setting |
| Secrets in `Info.plist` checked in | Move to CI injection or runtime config service |
| Interactive Apple ID + 2FA hacks in CI | ASC API keys |

### 3. Logging and privacy

Review PRs for:

- tokens / PII in `print` / logger output,
- analytics events that accidentally include secrets,
- debug builds that leave verbose networking logs on in Release.

Defense is boring: deny lists, scrubbers, and “Release = quiet.”

### 4. What we refuse to provide

- Jailbreak, sideload bypass, DRM circumvention, or “hook the Keychain” tutorials.
- How to smuggle ATS exceptions past App Review.
- Phishing or social-engineering playbooks for Apple IDs.

Ask for secure design and CI hygiene instead.

### 5. Lab — signing + secrets review card

```text
Artifact destination:  [ ] dev device  [ ] TestFlight  [ ] App Store  [ ] enterprise
Identity class matches destination: [ ] yes  [ ] no
Entitlements added this PR: ________  justified? [ ] yes
PrivacyInfo updated for new SDK/API: [ ] yes  [ ] n/a
ATS exceptions touched: [ ] none  [ ] waiver linked
ASC API key / match secrets: [ ] CI only  [ ] FOUND IN REPO (fail)
Keychain logout deletes our items: [ ] yes  [ ] unknown
```

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Auth token in Keychain; user-facing session logout clears it |
| **Systems** | Separate Debug/Release endpoints without shipping prod secrets in Debug xcconfig committed to git |
| **Security** | Entitlement diffs reviewed like IAM policy diffs; required-reason APIs declared |
| **Operations** | Rotation runbook: ASC API key, certs, profiles — owners named |
| **Software engineering** | Pre-commit / CI scan for high-entropy secrets; fail the build |

---

## 4. Staff-level review checklist

- [ ] No API keys, ASC keys, or private certs in git history of the paths you ship.
- [ ] CI signing identity matches the **distribution** goal (dev vs store vs enterprise).
- [ ] Entitlement additions are justified and mirrored in the Apple Developer capability config.
- [ ] Keychain usage has clear **item class / accessibility** + logout deletion behavior.
- [ ] Privacy manifests updated when adding SDKs or calling **required-reason** APIs.
- [ ] ATS exceptions are documented waivers with owners — not silent plist edits.
- [ ] ASC API key / match credentials live only in secret stores.
- [ ] Dependency pins / binary targets reviewed for provenance.
- [ ] Logging in Release cannot emit tokens or unnecessary PII.
- [ ] On-call knows who can rotate signing secrets at 2 a.m.

---

## References

- [Code signing](https://developer.apple.com/support/code-signing/)
- [TN3125: Inside Code Signing](https://developer.apple.com/documentation/technotes/tn3125-inside-code-signing-hashes)
- [TN3137: On Mac code signing](https://developer.apple.com/documentation/technotes/tn3137-on-mac-code-signing)
- [Creating distribution-signed code for macOS](https://developer.apple.com/documentation/security/creating_distribution-signed_code_for_macos)
- [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [App Transport Security](https://developer.apple.com/documentation/security/preventing_insecure_network_connections)
- [Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [Xcode Cloud — environment variables and secrets](https://developer.apple.com/documentation/xcode/environment-variable-reference)
- [fastlane match](https://docs.fastlane.tools/actions/match/)
