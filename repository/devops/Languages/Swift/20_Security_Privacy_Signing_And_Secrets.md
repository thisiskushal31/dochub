# Security, privacy, signing, and secrets

[← Back to Swift](./README.md)

## What this chapter covers

**Defense and review** literacy for shipping Apple-platform Swift: the full **provisioning and codesign chain**, **certificate taxonomy**, **profile inspection**, **debug vs distribution vs Developer ID**, **entitlements / App Groups / sandbox**, **Keychain + LocalAuthentication**, **CryptoKit / Secure Enclave**, **privacy manifests** and **required-reason APIs**, **App Privacy** consistency, **ATS** and **trust evaluation / pinning literacy**, **TCC** permissions, **Mac notarization + staple**, **SPM / SDK supply chain**, a **secrets matrix** (local · CI · ASC), **incident rotation**, extension attack-surface review, and **App Attest / DeviceCheck** as doors only.

This chapter will **not** teach jailbreaks, DRM circumvention, Keychain theft, Attest spoofing, phishing Apple IDs, pinning bypasses, or how to smuggle policy past App Review. Handbook language pin: **Swift 6.3.x**; signing pins follow your Apple Developer Program and the **Xcode** your CI actually runs.

If chapter **18** asked “what does CI build?”, this chapter asks “what *attests* that artifact, what data does it touch, and who can rotate the keys at 2 a.m.?”

---

## 1. Concepts

### 1. Threat model in one breath (why this chapter exists)

On Apple platforms your **binary is public to a motivated user**. Assume:

| Assumption | Consequence for design |
|------------|------------------------|
| The device owner can inspect the IPA / app bundle | Do not put **real secrets** in the client |
| Network observers exist on hostile networks | Prefer TLS; treat ATS exceptions as incidents |
| Dependencies execute in your process | SDK privacy + signing supply chain is *your* problem |
| CI logs are semi-public inside the company | Scrub tokens; never echo `.p8` or match passphrases |
| A stolen laptop is a signing incident | Identities and ASC keys live in vaults, not “the intern’s Downloads folder” |

Security for Swift apps is mostly **configuration, entitlements, manifests, and secrets hygiene**—not clever cipher code in a ViewModel.

### 2. Provisioning mental model (diagram-in-prose)

Apple platforms require **signed** apps for real-device install and distribution. Read the chain left-to-right:

```text
Apple Developer Team  (TEAMID)
  └─ App IDs  (bundle id + capability toggles in the portal)
       └─ Certificates / identities
            ├─ Apple Development ……… local debug devices
            └─ Apple Distribution …… App Store / TestFlight / some release paths
                 └─ Provisioning Profile stitches:
                      • App ID (bundle id)
                      • Which certificate(s) may sign
                      • Entitlements *allowance* (capabilities)
                      • Device UDIDs (dev / ad hoc) OR distribution style
                           └─ codesign stamps the .app / .ipa
                                └─ OS still enforces entitlements + TCC prompts at runtime
```

| Noun | Job |
|------|-----|
| **Team** | Owns apps, certs, profiles |
| **App ID** | Bundle id + portal capabilities |
| **Signing identity** | Development vs Distribution class |
| **Provisioning profile** | Ties App ID + certs + devices/distribution + entitlement allowance |
| **Entitlements file** | What *this* binary claims (must be ⊆ profile) |
| **codesign** | Cryptographic stamp on the artifact |
| **TCC / privacy prompts** | User-facing permission dialogs (camera, etc.) — separate from codesign |

Mismatch symptoms: install failures, “capability not entitled,” CI archive errors, missing Keychain items on one target only. Usually **configuration**, not “Swift is broken.”

```bash
# Inspect what you actually built (paths vary)
codesign -dv --verbose=4 path/to/MyApp.app
# Authority, team identifier, sealed resources — start here when CI and laptop disagree.

codesign -d --entitlements :- path/to/MyApp.app
# Entitlements *embedded* in the artifact — compare to the PR’s .entitlements XML.

security find-identity -v -p codesigning
# Identities visible on this Mac / runner — empty list ⇒ signing cannot succeed.
```

**What just happened**

- `codesign -dv` answers “who signed this and with what team?”
- `--entitlements` answers “what powers did we claim?” — the profile must have allowed them.
- `find-identity` answers “does this machine even have a usable identity?” before you debug fastlane poetry.

**Automatic signing** in Xcode is fine when CI uses the same team and a real secrets store. **Manual signing** appears in enterprise and tightly controlled pipelines — document which, and never leave it tribal.

### 3. Debug vs distribution signing

| Path | Identity class | Typical profile | Artifact destiny |
|------|----------------|-----------------|------------------|
| Local Debug on device | Development | Development (device list) | Engineer’s phone |
| Simulator | Often relaxed | N/A for many flows | Unit / UI tests |
| Ad hoc | Distribution | Ad hoc device list | Bounded internal install |
| TestFlight / App Store | Distribution | App Store | ASC processing |
| Enterprise (org program) | Enterprise distribution | Enterprise rules | Internal fleet |
| Mac Developer ID (outside Mac App Store) | Developer ID Application | Notarization story | Direct distribution |

CI must use the **identity class** that matches the artifact’s destination. A Debug development-signed build is not your Release store candidate.

| Review question | Fail if… |
|-----------------|----------|
| Does Archive use distribution signing? | Archive still on development identity |
| Does TestFlight upload match App Store profile? | Export method / profile mismatch |
| Are Debug and Release team IDs consistent on purpose? | Accidental personal team in one config |
| For Mac outside MAS: notarization planned? | “It runs on my Mac” ≠ customers’ Gatekeeper |

### 4. Entitlements literacy (read like IAM)

Entitlements are not “more permissions = better.” Each capability widens attack surface and App Review questions.

Common families you will review (not exhaustive):

| Family | Examples of what you are claiming | Review instinct |
|--------|-----------------------------------|-----------------|
| App Groups | Shared container between app + extension | Both targets entitled; group id exact |
| Keychain Sharing | Access groups across apps/extensions | `TEAMID.` prefix; logout story |
| Associated Domains | Universal Links / webcredentials | Domain file + portal capability |
| Push Notifications | APS environment | Dev vs prod environment mismatch |
| iCloud / CloudKit | Containers | Container ids match portal |
| Personal VPN / Network Extensions | Powerful networking | Justify hard; rare in normal apps |
| Hardened Runtime (Mac) | Exception entitlements for JIT, etc. | Prefer fewer exceptions |

Treat entitlement **diffs** like IAM policy diffs: why this PR, why this target, why now.

### 5. App Groups vs Keychain access groups

People conflate these. Do not.

| Mechanism | What it shares | Typical use |
|-----------|----------------|-------------|
| **App Group** (`group.TEAMID…`) | File container / `UserDefaults(suiteName:)` | Shared files, widgets, extensions |
| **Keychain access group** | Keychain items | Tokens, passwords, keys |

A widget that needs the session token usually needs **both** a clear Keychain group strategy *and* correct entitlements on **app + extension**. Shared `UserDefaults` is not a secrets vault.

### 6. Keychain — class, accessibility, groups, logout

The Keychain stores small secrets on-device with access control. You need **literacy**, not exploit demos.

| Concept | Review meaning |
|---------|----------------|
| **Item class** | generic password, internet password, key, certificate, … |
| **Accessibility** | When readable (unlocked, after first unlock, …) — background behavior |
| **Access control / biometry** | User presence / biometrics — product decision |
| **Access groups** | Sharing with extensions — must match entitlements |
| **Synchronizable** | iCloud Keychain implications — justify |
| **Ownership on logout** | Delete items you own; uninstall may not clear multi-app groups |

```swift
import Security
import Foundation

enum SessionStore {
    static let service = "com.example.app.session"
    static let account = "accessToken"

    /// Illustrative shape — prefer a reviewed wrapper your org standardizes.
    static func saveToken(_ token: String) throws {
        let data = Data(token.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: data,
            // Accessibility choice is a product+security decision — document it.
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        SecItemDelete(query as CFDictionary) // replace existing
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw NSError(domain: NSOSStatusErrorDomain, code: Int(status))
        }
    }

    static func deleteToken() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        SecItemDelete(query as CFDictionary)
    }
}
```

**What just happened**

- Item is a **generic password** with a stable service/account pair — searchable later.
- Accessibility limits when the OS will hand the bytes back — pick deliberately for background refresh.
- Logout must call **delete**, not “set empty string and hope.”
- Access-group keys are omitted here for a single-app case; the moment an extension joins, entitlements + `kSecAttrAccessGroup` must agree.

Staff posture:

- Prefer system APIs / maintained wrappers — do not invent crypto.
- Document which access group holds session tokens vs one-off secrets.
- This handbook will not walk through attacks against Keychain.

### 7. CryptoKit / Secure Enclave — literacy, not a crypto course

| Tool | What it is for | Staff rule |
|------|----------------|------------|
| **CryptoKit** | High-level crypto primitives (hash, AEAD, keys) in Swift | Prefer over home-rolled AES |
| **Secure Enclave** (when available) | Hardware-backed key holding | Use for keys that must not be exportable as raw bytes in process memory casually |
| **Custom “encrypt the token with a hardcoded key”** | Theater | Do not |

If a PR invents a new protocol “because AES is cool,” send them to a cryptographer and CryptoKit docs—not merge.

### 8. Secrets matrix — local, CI, ASC

| Secret class | Local (engineer laptop) | CI (Actions / Xcode Cloud / …) | App Store Connect (ASC) |
|--------------|-------------------------|--------------------------------|-------------------------|
| **ASC API key** (`.p8` + Key ID + Issuer ID) | Never in repo; vault / keychain for release engineers | **CI secret store** (preferred automation auth) | Created/rotated in ASC |
| **Signing certs & profiles** | Xcode automatic or documented manual | CI secrets, match, or signing service | Portal issues profiles |
| **match passphrase** (brownfield) | Engineer vault — not Slack | CI secret | N/A |
| **Third-party API tokens** (server) | `.env` / vault — gitignored | CI secrets / runtime inject | N/A |
| **Client “API keys” in the app binary** | Assume **extractable** | Same — not a secret store | Design backend auth |
| **Push / APNs keys** | Vault | CI secret for upload lanes | ASC / developer portal |
| **Apple ID + app-specific password** | Avoid for CI | Prefer ASC API key | Account security |

```swift
// Legacy / crash-oriented habit — do not use in new code.
enum Secrets {
    static let apiKey = "sk_live_do_not_ship"  // Mined from binary + git history
}

// Prefer: non-secret config may be compiled in; secrets stay out of the client.
enum Config {
    static let apiBaseURL = URL(string: "https://api.example.com")!
}
```

Staff rule: if rotating the value requires a **git revert**, it was stored wrong.

### 9. Secrets in CI — ASC API key and match literacy

```text
Preferred shape for new pipelines:
  ASC API key in CI secrets  (.p8 never logged)
    → xcodebuild / fastlane lane
      → signed artifact
        → TestFlight / store upload

Brownfield you will still see:
  match git repo + passphrase in CI secrets
    → gym / build_app
```

Never commit the `.p8` or match passphrase. Rotate with a **named owner**. Lane shapes: chapter **21**.

**ASC API key review card:**

```text
Key name / id: _______________
Issuer ID: _______________
Role (enough to upload?): _______________
Stored in: [ ] Xcode Cloud secrets  [ ] Actions secrets  [ ] other vault
Who can rotate: _______________
Last rotated: _______________
Break-glass owner: _______________
```

### 10. Privacy manifests and required-reason APIs

**Privacy manifests** (`PrivacyInfo.xcprivacy`) declare tracking posture, collected data categories, and **required reason API** usages for the app and for **third-party SDKs**. Apple’s static checks can reject uploads when binaries call covered APIs without declarations (historically surfaced as missing API declaration / ITMS-style mail).

**Categories you must recognize in review** (catalog evolves — re-read Apple docs on Xcode bumps):

| Category shape (conceptual) | Typical APIs / data | Why Apple cares |
|----------------------------|---------------------|-----------------|
| User Defaults | `UserDefaults` / `NSUserDefaults` | Fingerprinting / cross-app signals |
| File timestamp | creation/modification dates, `stat`-family | Device fingerprinting |
| System boot time | uptime / mach time families | Fingerprinting |
| Disk space | free/total volume capacity | Fingerprinting |
| Active keyboards | installed input modes | Sensitive configuration |

**List shape literacy** inside the manifest:

| Key / shape | Meaning |
|-------------|---------|
| `NSPrivacyTracking` | Whether you engage in tracking (Apple’s definition) |
| `NSPrivacyTrackingDomains` | Domains used for tracking (may be empty) |
| `NSPrivacyCollectedDataTypes` | Nutrition-label-adjacent collected data declarations |
| `NSPrivacyAccessedAPITypes` | Required-reason API categories + **reason codes** |

```xml
<!-- Illustrative shape only — reason codes MUST match Apple’s current approved list
     and your real product behavior. Re-check TN3183 / “Describing use of required reason API”. -->
<key>NSPrivacyAccessedAPITypes</key>
<array>
  <dict>
    <key>NSPrivacyAccessedAPIType</key>
    <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
    <key>NSPrivacyAccessedAPITypeReasons</key>
    <array>
      <!-- Example code shape — verify against current Apple docs before shipping -->
      <string>CA92.1</string>
    </array>
  </dict>
</array>
```

**What just happened**

- You declared *which* sensitive API family you touch and *why* with an Apple reason code.
- Wrong reason code to “make upload green” is a **policy lie** — redesign the call or pick the honest reason.
- SDK manifests do **not** excuse *your* app code’s undeclared uses; Xcode aggregates, you remain responsible.

Staff habits:

- New SPM/binary dependency → check for `PrivacyInfo` + (for listed SDKs) signature requirements.
- Aggregate privacy story must still hold for the **app**.
- “We don’t track” ≠ free pass on required-reason APIs.
- Treat missing reasons as **release blockers** under current App Store Connect enforcement.

### 11. App Privacy questionnaire vs privacy manifest

| Surface | Audience | Job |
|---------|----------|-----|
| **PrivacyInfo.xcprivacy** | Apple tooling + binary checks | Machine-readable practices + required reasons |
| **App Store Connect App Privacy** (“Nutrition Label”) | Humans on the store | Answers you (or your compliance owner) maintain |

They must be **consistent in spirit**. A GDPR subject-access request is **not** solved by the plist alone. Keep a human owner for the questionnaire; keep engineers owning manifests that match code.

### 12. ATS exception review

**ATS (App Transport Security)** defaults toward TLS. Exceptions in `Info.plist` are **review magnets**. Prefer fixing servers; treat exceptions as temporary, documented waivers.

| Smell | Better |
|-------|--------|
| `NSAllowsArbitraryLoads` = true | Narrow domain exception + owner + expiry |
| Exception for one QA host forever | Fix staging TLS; remove exception |
| Silent `Info.plist` edit in a giant PR | Dedicated PR with justification |
| “Android allows cleartext” | Apple rules are separate |

```text
ATS waiver card
Exception domain: _______________
Why HTTPS impossible today: _______________
Owner: _______________  Expiry: _______________
Scope: [ ] single domain  [ ] arbitrary loads (justify harder)
Tracking issue: _______________
```

### 13. Permission prompts (TCC) — literacy

Codesign does not replace **user consent**. Common keys in `Info.plist` (usage descriptions) must be honest English, or the OS will not grant access—and App Review will notice nonsense copy.

| Area | Staff habit |
|------|-------------|
| Camera / mic / photos / contacts / location / local network / Bluetooth / tracking | Usage string explains **real** feature |
| “Precise” vs reduced accuracy location | Product decision + UI |
| Tracking / ATT | Separate from privacy manifest tracking flags — know both exist |

Do not paste “needed for app functionality” for every permission. Reviewers (human and OS) can tell.

### 14. App Attest / DeviceCheck — doors only

| Door | One sentence | This track’s job |
|------|--------------|------------------|
| **DeviceCheck** | Limited per-device signals via Apple services | Know the name; design with Apple docs |
| **App Attest** | Stronger app/device integrity attestation for **server** decisions | Door — architecture note required |

If a PR adds either: require what the **server** does on failure/timeout, official API links, and no “bypass research” in the ticket.

---

## 2. Advanced concepts

### 1. Certificate taxonomy — pick the right plastic

| Certificate / identity class | Typical use | Wrong use smell |
|------------------------------|-------------|-----------------|
| **Apple Development** | Debug devices, day-to-day | Archiving for TestFlight |
| **Apple Distribution** | App Store / TestFlight iOS (and related) | Signing a Mac Developer ID drop |
| **Mac App Distribution / Mac Installer Distribution** | Mac App Store path | Confusing with Developer ID |
| **Developer ID Application** | Mac outside MAS (apps, tools, dmg contents) | Using Development cert “because it signed locally” |
| **Developer ID Installer** | `.pkg` installers for notarized Mac installs | Signing Mach-O with Installer cert |
| **Apple Push Services** (and friends) | Push — separate from app codesign | Checking push certs into the app target as “signing” |

Staff habit: when CI fails, read the **certificate common name** in `security find-identity` / Xcode’s signing log before rewriting lanes.

### 2. Inside codesign — hashes, deep verify, nested code

Apple’s technotes describe how signing seals Mach-O slices and resources.

| Idea | Why you care |
|------|--------------|
| **Hash tree / sealed resources** | Tampering with a bundled file breaks the seal |
| **Team ID in signature** | Must match portal expectations for capabilities |
| **Nested / deep code** | Frameworks, appex, helpers — CI must sign the **graph** |
| **Requirements** | Designated requirement (DR) ties identity over time |

```bash
# Strict verification — closer to what notarization / Gatekeeper expect
codesign -vvv --deep --strict path/to/MyApp.app
# “valid on disk” / “satisfies its Designated Requirement” — or a precise failure.

codesign -d --entitlements :- path/to/MyApp.app
# Embedded entitlements vs the XML you think you shipped.

# Decode a .mobileprovision (CMS) to see App ID, entitlements allowance, devices
security cms -D -i path/to/profile.mobileprovision | plutil -p -
# Look for application-identifier, keychain-access-groups, ProvisionedDevices / ProvisionsAllDevices.
```

**What just happened**

- `--deep --strict` catches “outer app signed, inner framework ad-hoc” failures that shallow checks miss.
- Profile decode answers “did the portal ever allow this entitlement?” before you blame Swift.
- Compare **CI artifact** dumps to **local Archive** dumps when only one environment breaks.

### 3. Mac notarization + staple (ops literacy)

Notarization is **not** App Review. Apple’s notary service scans Developer ID–signed software for malware signals and signing issues, then issues a **ticket**. Gatekeeper can fetch tickets online; **stapling** attaches the ticket so offline first launches still work.

```text
Developer ID Application sign (Hardened Runtime on)
  → notarytool submit  (ASC API key)
    → wait for Accepted
      → stapler staple  (app / pkg / dmg as appropriate)
        → distribute
```

```bash
# Shape only — wire credentials via CI secrets, never argv history you paste into Slack
xcrun notarytool submit MyApp.zip --key api.p8 --key-id KEYID --issuer ISSUER --wait
# Prefer storing key material as files/env from the secret store, not long-lived shell history.

xcrun stapler staple MyApp.app
# Attaches the ticket when the container type supports stapling.

spctl --assess --type execute -vv MyApp.app
# Gatekeeper-oriented assessment literacy — interpret with Apple’s current docs.
```

| Rule | Why |
|------|-----|
| Notarize with **Developer ID**, not Development / Mac App Store distribution certs | Wrong cert → notary rejects |
| Enable **Hardened Runtime** for notarization-shaped apps | Common rejection otherwise |
| Staple when the format allows; ZIP of already-stapled items if needed | Offline Gatekeeper |
| Installer packages: payload and pkg may need **two** notarization rounds | Nested distribution |
| Notarization ≠ Mac App Store receipt story | Different distribution channel |

Deep lane wiring: chapter **21**. This chapter’s job is knowing **why** staple exists and which cert class feeds the notary.

### 4. Hardened Runtime and Mac sandbox

| Control | Job | Review instinct |
|---------|-----|-----------------|
| **Hardened Runtime** | Restricts dangerous capabilities unless exception entitlements grant them | Prefer fewer exceptions (JIT, unsigned memory, …) |
| **App Sandbox** (Mac) | Entitlement-gated access to files, network, hardware | Capabilities map to user-visible powers |

Each Hardened Runtime exception is an incident question: “why does this binary need to punch that hole?”

### 5. LocalAuthentication + Keychain access control

Biometrics are **not** encryption by themselves—they gate **user presence**. Pair thoughtfully with Keychain access-control lists.

```swift
import LocalAuthentication
import Security

func protectWithBiometry(service: String, account: String, secret: Data) throws {
    let ctx = LAContext()
    var error: NSError?
    guard ctx.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        throw error ?? NSError(domain: "auth", code: 1)
    }

    // Access control: user presence required to read — exact flags are a product decision.
    var acError: Unmanaged<CFError>?
    guard let access = SecAccessControlCreateWithFlags(
        nil,
        kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
        .biometryCurrentSet, // review: currentSet vs any biometry — UX + security tradeoff
        &acError
    ) else {
        throw acError!.takeRetainedValue() as Error
    }

    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: service,
        kSecAttrAccount as String: account,
        kSecValueData as String: secret,
        kSecAttrAccessControl as String: access
    ]
    SecItemDelete(query as CFDictionary)
    let status = SecItemAdd(query as CFDictionary, nil)
    guard status == errSecSuccess else {
        throw NSError(domain: NSOSStatusErrorDomain, code: Int(status))
    }
}
```

**What just happened**

- `SecAccessControl` binds Keychain readability to biometry / user presence — stronger than accessibility alone.
- `.biometryCurrentSet` invalidates when the enrolled set changes — sometimes what you want (shared device), sometimes painful UX.
- Still delete on logout; biometry does not replace session lifecycle.

### 6. Secure Enclave + CryptoKit (deeper literacy)

| Idea | Staff meaning |
|------|----------------|
| Keys can be created **non-extractable** in the Secure Enclave (when hardware allows) | Private key material stays out of ordinary process dumps |
| CryptoKit wraps modern primitives | Prefer over OpenSSL-in-the-app folklore |
| Not every device / simulator has the same Enclave story | Feature-detect; have a fallback policy |
| Enclave ≠ “hide my API key from the IPA” | Client binaries remain hostile |

Review questions for a PR that “adds Secure Enclave”:

1. What key is created, and what operation is authorized?
2. What happens on device without Enclave / after restore?
3. Is there a recovery / re-auth path that is not “email us the private key”?

### 7. Trust evaluation and certificate pinning literacy

ATS gets you a baseline. Some apps add **pinning** (SPKI / certificate pins) for high-threat APIs.

| Stance | Guidance |
|--------|----------|
| Default | System trust store + ATS — usually enough |
| Pinning | Only with a **rotation runbook** (backup pins, emergency unpin via config) |
| Custom `URLSession` delegates that blindly accept any trust | Review smell — often worse than no pinning |

Staff rule: a pin without a rotation story is a **self-DoS** waiting for the next cert renew. This handbook will not teach bypasses; it will demand ops ownership.

### 8. SPM / third-party SDK supply chain (security lens)

| Risk | Habit |
|------|--------|
| Floating versions | Review `Package.resolved`; pin intentionally |
| Binary targets / XCFrameworks | Checksums, provenance, who built them |
| Build plugins / macros | Execute at build time — treat like CI scripts |
| SDKs on Apple’s “privacy manifest + signature” lists | Must ship compliant manifests/signatures when required |
| Transitive SDKs | Xcode privacy report — read it before release |
| Session replay / crash tools | Default PII fields off; manifests + Nutrition Label |

You are responsible for code you link, even if “marketing bought the SDK.”

### 9. Required-reason review walk (practical)

When a PR touches filesystem timestamps, disk free space, boot time, or broad UserDefaults “fingerprint-ish” patterns:

1. Identify the **API family** against Apple’s current catalog.
2. Confirm the **actual product reason** (not cargo-cult from another app).
3. Update `PrivacyInfo.xcprivacy` in the **app** (and verify third-party manifests).
4. Link the Apple doc / TN in the PR so reviewers do not argue from memory.
5. Re-check on the next **Xcode bump**—catalog and enforcement move.
6. Confirm App Privacy answers still match reality.

```text
PR adds: FileManager attributesOfItem (timestamp for “Documents UI”)
  → PrivacyInfo: File timestamp category + honest reason code
  → If real motive is device fingerprinting → redesign; do not launder via a wrong reason
  → Upload rejection / ITMS mail about missing API declaration → fix manifest, don’t disable checks
```

### 10. Entitlements + Keychain + Groups + extensions joint review

| Change | Also verify |
|--------|-------------|
| New app group | Portal capability + **both** targets’ entitlements + suite name spelling |
| New keychain-access-groups entry | Exact `TEAMID.` prefix; extension targets included |
| Push / associated domains | Portal capability before CI archive; `apple-app-site-association` for links |
| Removed capability | Clean entitlements file; refresh profile; Keychain migration notes |
| New widget / App Clip / share extension | **Separate** signing + privacy + Keychain story |
| Background modes | Justify each mode; they widen runtime surface |

Extensions multiply the attack and privacy surface: more processes, more entitlements, more ways to leave a token behind after “logout.”

### 11. Pasteboard, screenshots, and “sensitive UI”

| Risk | Habit |
|------|--------|
| Auth codes / passwords on general pasteboard | Prefer system secure entry; clear when done where APIs allow |
| Screen recording / screenshots of secrets | Avoid putting secrets in long-lived UI; use secure text fields |
| Share sheet exporting tokens | Review activity items |

Not glamorous—still how tokens leak in support tickets.

### 12. Logging, analytics, and crash reporters

| Log class | Debug OK? | Release OK? |
|-----------|-----------|-------------|
| Request IDs / non-PII correlation | Yes | Yes (sampled) |
| Auth headers / bearer tokens | Never in samples | Never |
| Email / phone in analytics | Justify + minimize | Usually no |
| Full request/response bodies | Local only | No |
| Keychain / biometric errors | Codes OK; secret material never | Same |
| Push device tokens | Treat as sensitive identifiers | Minimize |

### 13. Data at rest on device (mental model)

| Store | Good for | Bad for |
|-------|----------|---------|
| Keychain | Tokens, small secrets | Large blobs |
| App Group container | Shared files | Assuming other apps cannot be entitled wrongly |
| `UserDefaults` | Preferences | Session tokens (common foot-gun) |
| Files with Data Protection | User documents | Secrets without access control story |
| In-memory only | Ephemeral secrets | Assuming process memory is invisible |

Prefer Keychain for auth material; prefer deleting on logout; prefer not inventing a second vault in Documents.

### 14. “Jailbreak detection” and client integrity theater

Client-side “isJailbroken” checks are **not** a security boundary. Motivated users bypass them. Prefer:

- server authority for sensitive actions,
- App Attest / DeviceCheck **doors** with honest failure policy,
- least privilege on device.

Do not ship a false sense of safety—or ask this handbook for detection recipes.

### 15. Export compliance and encryption — door

App Store Connect asks encryption / export questions. Staff habit: know **who** in the company answers them (often legal/compliance). Enabling CryptoKit does not mean engineering invents the answer alone. This handbook is not legal advice.

### 16. Common failure triage (signing / privacy / upload)

| Symptom | First checks |
|---------|--------------|
| “No signing certificate” / empty identity list | `security find-identity`; CI secret import; keychain unlock on runner |
| Entitlement not allowed | Portal capability + profile decode vs embedded entitlements |
| Wrong Team ID | xcconfig / automatic vs manual; personal vs company team |
| Archive OK, TestFlight reject | Export method / profile type; bitcode folklore (historical); processing mail |
| Missing API declaration / privacy mail | Required-reason catalog vs `PrivacyInfo`; third-party SDK manifests |
| Gatekeeper blocks Mac app | Developer ID? Hardened Runtime? Notarized? Stapled? `codesign --deep --strict` |
| Stapler errors | Ticket/container mismatch; writable package; tool/Xcode vintage per Apple’s notarization issues doc |
| Keychain item missing in extension | Access group entitlement on **both** targets; accessibility vs background |
| 401 uploading to ASC | API key role/expiry/issuer — before rewriting codesign |

### 17. Incident and rotation playbook (minimum viable)

When a `.p8`, match passphrase, or distribution cert may have leaked:

1. **Revoke / rotate** in ASC / portal (owner named).
2. Update CI secrets; redeploy lanes; invalidate old keys everywhere.
3. Re-sign / re-upload as needed; notify release managers.
4. Audit git history and chat; treat committed secrets as compromised forever in that history.
5. Postmortem: leak path, detection gap, secret-scan gate if missing.
6. If customer tokens may be affected, follow your org’s disclosure policy (security + legal).

Do not “rotate later after the release.” The release *is* the incident window.

### 18. Legacy literacy — manual signing chaos

| You see | Modern posture |
|---------|----------------|
| Each Mac has different certs; “it signs for me” | Centralize in CI secrets or a signing lane |
| Profiles committed as binary blobs with no rotation | Documented automation (ch **21**) + short-lived credentials where possible |
| Team ID inconsistent across targets | One xcconfig / shared setting |
| Secrets in `Info.plist` checked in | CI injection or runtime config service |
| Interactive Apple ID + 2FA hacks in CI | ASC API keys |
| Tokens in `UserDefaults` “temporary” for three years | Keychain + logout delete |
| Pinning with no backup pin | Rotation runbook or remove pinning |
| `NSAllowsArbitraryLoads` forever | Narrow waiver + expiry |

### 19. What we refuse to provide

- Jailbreak, sideload bypass, DRM circumvention, or “hook the Keychain” tutorials
- How to smuggle ATS exceptions or false privacy reasons past App Review
- Phishing or social-engineering playbooks for Apple IDs
- Attest / DeviceCheck spoofing; pinning / TLS bypass recipes
- Exploit PoCs against Apple platforms

Ask for secure design and CI hygiene instead.

### 20. Lab — forensic compare (laptop vs CI)

```bash
# On both artifacts (local Archive export vs CI .app/.ipa expanded)
codesign -dv --verbose=4 MyApp.app | tee /tmp/sign-$HOST.txt
codesign -d --entitlements :- MyApp.app | tee /tmp/ent-$HOST.txt
codesign -vvv --deep --strict MyApp.app | tee /tmp/verify-$HOST.txt
# Diff the three pairs. Most “CI only” bugs are identity, entitlement, or nested-sign deltas.
```

**What just happened**

- You stopped arguing about environments and started comparing **sealed facts**.
- Nested-sign failures show up under `--deep`; entitlement drift shows up in the dump; Team ID drift shows up in `-dv`.

### 21. Lab — full security review card (ship gate)

```text
Artifact destination:  [ ] dev device  [ ] TestFlight  [ ] App Store  [ ] enterprise  [ ] Mac Developer ID
Certificate class matches destination: [ ] yes
codesign -vvv --deep --strict on CI artifact: [ ] clean
Profile decoded / entitlement allowance checked: [ ] yes
Entitlements / App Group / Keychain group: justified [ ] portal [ ] both targets [ ]
Keychain: accessibility [ ] access control/biometry [ ] logout deletes [ ]
Secure Enclave / CryptoKit: [ ] n/a  [ ] recovery policy written
PrivacyInfo + required reasons honest: [ ] yes
App Privacy questionnaire consistent: [ ] yes
Third-party SDK manifests/signatures/pins: [ ] yes
ATS / pinning: [ ] default trust  [ ] waiver/pin runbook linked
Permission usage strings honest: [ ] yes
Mac: Hardened Runtime [ ] notarized [ ] stapled [ ] n/a
Secrets matrix + rotation owner: [ ] yes
Release logging / analytics scrubbed: [ ] yes
Extensions reviewed as separate surfaces: [ ] n/a  [ ] yes
App Attest/DeviceCheck: [ ] n/a  [ ] server policy linked
Jailbreak-detection theater avoided: [ ] yes
```

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Auth token in Keychain with named access group; biometry only when UX supports it; logout clears; extensions entitled deliberately |
| **Systems** | Separate Debug/Release endpoints without shipping prod secrets in committed xcconfig; Enclave feature detection |
| **Security** | Entitlement diffs like IAM; required-reason APIs declared honestly; ATS/pinning have owners; client assumed hostile |
| **Operations** | Rotation runbook for ASC key, certs, profiles; notarize+staple for Developer ID; break-glass owner; CI never logs `.p8` |
| **Software engineering** | Secret scanning in CI; privacy report read before release; SDK adds are security reviews; forensic `codesign` diffs in incidents |

**Worked scenarios:**

1. **New widget extension** needs the session token → Keychain access group + entitlements on **both** targets; logout still deletes; App Group only if files are shared too.
2. **Third-party analytics SDK** via SPM → check `PrivacyInfo` + signature requirements if listed; pin version; update App Privacy; read Xcode privacy report; scrub PII defaults.
3. **QA wants HTTP to staging** → ATS exception with owner + expiry; ticket to move staging to HTTPS; never `AllowArbitraryLoads` “for convenience.”
4. **CI upload fails with 401** → triage ASC API key role/expiry before rewriting signing (ch **21**).
5. **Product wants “device integrity”** → App Attest/DeviceCheck door: server policy doc required; no spoofing or jailbreak-detection theater.
6. **Intern commits a `.p8`** → rotate immediately; purge per org policy; postmortem; add secret scan gate.
7. **Mac Developer ID build blocked by Gatekeeper** → Developer ID + Hardened Runtime + `notarytool` + `stapler`; verify with `codesign --deep --strict` and `spctl` literacy.
8. **“Temporary” token in UserDefaults** → migrate to Keychain; delete old defaults key; document accessibility / biometry.
9. **Banking-style API asks for pinning** → accept only with backup pins + remote kill-switch/config; schedule rotation drills.
10. **Share extension can read the session** → intentional? If yes, document; if no, remove access group from that appex.
11. **Notary accepts but stapler fails** → ticket/container mismatch checklist (Apple notarization issues doc); do not “ship unstapled and hope online fetch.”
12. **Privacy mail after adding a file-timestamp feature** → add honest required reason; do not copy a reason code from an unrelated SDK sample.

---

## 4. Staff-level review checklist

- [ ] Reviewer can narrate the **provisioning chain** (team → App ID → cert → profile → entitlements → codesign → TCC).
- [ ] **Certificate class** matches destination (Development / Distribution / Developer ID Application|Installer).
- [ ] CI artifact inspected with `codesign -vvv --deep --strict` and entitlements dump when signing is in doubt.
- [ ] Profiles decoded when entitlement allowance is disputed.
- [ ] No API keys, ASC keys, private certs, or match passphrases in git history of paths you ship.
- [ ] Entitlement / App Group / Keychain group additions justified and mirrored in the portal; extensions included.
- [ ] Keychain usage has clear **class / accessibility / access control** + logout deletion; tokens not in `UserDefaults`.
- [ ] LocalAuthentication / biometry choices documented (including `.biometryCurrentSet` UX impact).
- [ ] CryptoKit / Secure Enclave used thoughtfully; recovery policy written; no home-rolled protocols.
- [ ] Privacy manifests updated for SDKs / required-reason APIs; reason codes **honest**; App Privacy answers consistent.
- [ ] Third-party SDKs checked for manifest (and signature when required); pins reviewed; privacy report read.
- [ ] ATS exceptions are documented waivers; pinning (if any) has a rotation runbook.
- [ ] Permission usage descriptions match real features.
- [ ] Mac Developer ID path: Hardened Runtime, notarization, staple considered and verified.
- [ ] Secrets matrix is real: local / CI / ASC homes named; rotation + break-glass owners named.
- [ ] Logging / analytics / crash / pasteboard risks reviewed for secrets.
- [ ] Export compliance / encryption questions have a named non-engineering owner when needed.
- [ ] App Attest / DeviceCheck (if present) have server failure policy—not folklore; no jailbreak-detection theater as a “control.”
- [ ] On-call knows who can rotate signing secrets at 2 a.m.

---

## References

- [Code signing](https://developer.apple.com/support/code-signing/)
- [TN3125: Inside Code Signing](https://developer.apple.com/documentation/technotes/tn3125-inside-code-signing-hashes)
- [TN3126: Inside Code Signing — Certificates and Provision Profiles](https://developer.apple.com/documentation/technotes/tn3126-inside-code-signing-certificates-and-provision-profiles)
- [TN3127: Inside Code Signing — Requirements](https://developer.apple.com/documentation/technotes/tn3127-inside-code-signing-requirements)
- [TN3137: On Mac code signing](https://developer.apple.com/documentation/technotes/tn3137-on-mac-code-signing)
- [Creating distribution-signed code for macOS](https://developer.apple.com/documentation/security/creating_distribution_signed_code_for_macos)
- [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Customizing the notarization workflow](https://developer.apple.com/documentation/security/customizing_the_notarization_workflow)
- [Resolving common notarization issues](https://developer.apple.com/documentation/security/resolving_common_notarization_issues)
- [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
- [TN3183: Adding required reason API entries](https://developer.apple.com/documentation/technotes/tn3183-adding-required-reason-api-entries-to-your-privacy-manifest)
- [Third-party SDK requirements](https://developer.apple.com/support/third-party-SDK-requirements)
- [App Transport Security](https://developer.apple.com/documentation/security/preventing_insecure_network_connections)
- [Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [Local Authentication](https://developer.apple.com/documentation/localauthentication)
- [CryptoKit](https://developer.apple.com/documentation/cryptokit)
- [Storing keys in the Secure Enclave](https://developer.apple.com/documentation/security/certificate_key_and_trust_services/keys/storing_keys_in_the_secure_enclave)
- [DeviceCheck](https://developer.apple.com/documentation/devicecheck)
- [App Attest](https://developer.apple.com/documentation/devicecheck/establishing_your_app_s_integrity)
- [Xcode Cloud — environment variables and secrets](https://developer.apple.com/documentation/xcode/environment-variable-reference)
- [fastlane match](https://docs.fastlane.tools/actions/match/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
