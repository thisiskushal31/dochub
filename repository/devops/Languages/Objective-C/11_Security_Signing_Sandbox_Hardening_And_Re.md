# Security: signing, sandbox, hardened runtime, and reverse engineering

[← Back to Objective-C](./README.md)

## What this chapter covers

**Code signing**, **notarization** (macOS distribution), **sandbox** and **entitlements**, **hardened runtime**, **library validation**, and what reverse engineers see in **Objective-C** binaries (class names, selectors, strings).

---

## 1. Signing and distribution

Binaries are signed with identities tied to teams and provisioning. **Developer ID** distribution outside the Mac App Store often requires **notarization** and **stapled** tickets. Objective-C and Swift share the same pipeline—language does not relax signing policy.

---

## 2. Sandbox and entitlements

**Entitlements** declare capabilities (filesystem, network, keychain, etc.). Over-broad entitlements increase blast radius when an app is compromised.

**IPC** (XPC, sockets, custom protocols) must authenticate peers and validate messages—Objective-C type names in interface stubs are not proof of trust.

---

## 3. Hardened runtime

**Hardened Runtime** restricts JIT, unsigned executable memory, and certain **dyld** behaviors unless explicitly entitled. Debug and CI profiles sometimes need different flags than production—document the delta so support builds do not ship relaxed settings accidentally.

---

## 4. Objective-C metadata and RE

**Mach-O** images expose Objective-C class lists, method lists, and strings useful for symbol recovery. Do not rely on obscuring class names to protect secrets—use Keychain, server policy, and proper crypto.

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

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
