# Security: signing, sandbox, hardened runtime, and reverse engineering

[← Back to Objective-C](./README.md)

## What this chapter covers

**Code signing**, **notarization** (macOS distribution), **sandbox** and **entitlements**, **hardened runtime**, **library validation**, and what reverse engineers see in **Objective-C** binaries (class names, selectors, strings).

```bash
codesign -s "Developer ID Application: …" -f --timestamp --options runtime MyTool
```

---

## 1. Signing and distribution

Binaries are signed with identities tied to teams and provisioning. **Developer ID** distribution outside the Mac App Store often requires **notarization** and **stapled** tickets. Objective-C and Swift share the same pipeline—language does not relax signing policy.

```bash
xcrun notarytool submit MyTool.zip --wait --keychain-profile AC_NOTARY
```

---

## 2. Sandbox and entitlements

**Entitlements** declare capabilities (filesystem, network, keychain, etc.). Over-broad entitlements increase blast radius when an app is compromised.

**IPC** (XPC, sockets, custom protocols) must authenticate peers and validate messages—Objective-C type names in interface stubs are not proof of trust.

```xml
<!-- Excerpt: entitlements.plist — justify each key in threat-model terms -->
<key>com.apple.security.app-sandbox</key>
<true/>
```

---

## 3. Hardened runtime

**Hardened Runtime** restricts JIT, unsigned executable memory, and certain **dyld** behaviors unless explicitly entitled. Debug and CI profiles sometimes need different flags than production—document the delta so support builds do not ship relaxed settings accidentally.

```bash
codesign -dv --entitlements :- MyApp.app
```

---

## 4. Objective-C metadata and RE

**Mach-O** images expose Objective-C class lists, method lists, and strings useful for symbol recovery. Do not rely on obscuring class names to protect secrets—use Keychain, server policy, and proper crypto.

```bash
otool -ov MyBinary | head -80
class-dump MyBinary 2>/dev/null | head
```

---

## Advanced use cases and implementation

**Entitlements in review:** Treat **each** **entitlement** as **attack** **surface**: **keychain** **access** **groups**, **network** **client** / **server**, **file** **bookmarks**, **sandbox** **exceptions**. **Over-scoped** **profiles** are a **recurring** **finding** in **App Store** and **enterprise** audits—justify **every** **capability** in **threat** **model** **terms**.

**Library validation and dylib loading:** Hardened runtime and library validation reduce unsigned code injection; malware and pentests still probe plugin paths, **`DYLD_INSERT_LIBRARIES`** (where applicable), and misconfigured **`rpath`**. Developer machines are softer than customer installs—reproduce production hardening in staging.

**IR and malware:** **Objective-C** **metadata** speeds **labeling** **behaviors** in **samples** (**URL** **handlers**, **swizzled** **methods**, **dynamic** **loading**). **SRE** / **IR** uses the same **symbols** to map **telemetry** to **vendor** **SDK** **versions**.

**SIP and system policy:** **System Integrity Protection** and **MDM** **profiles** constrain **what** **even** **root** can **modify**—relevant when **debugging** **system** **extensions** or **custom** **agents** on **managed** **Macs**.

```bash
csrutil status
```

---

## References

### Primary

- [Security](https://developer.apple.com/documentation/security) (Apple Developer)
- [App Sandbox](https://developer.apple.com/documentation/security/app_sandbox) (Apple Developer)
- [Hardened Runtime](https://developer.apple.com/documentation/security/hardened_runtime) (Apple Developer)
- [Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html) (Apple Archive)
- [Notarizing macOS software](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) (Apple Developer)
- [Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html)

### Supplemental tutorial

- [Categories](https://www.tutorialspoint.com/objective_c/objective_c_categories.htm)
- [Dynamic Binding](https://www.tutorialspoint.com/objective_c/objective_c_dynamic_binding.htm)

