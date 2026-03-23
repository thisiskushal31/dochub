# Build: clang, modules, linking, rpath, dSYM, and packaging

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** **clang** flags, **modules**, dynamic linking, **`@rpath`**, **`install_name`**, embedding frameworks, **dSYM**, and release artifacts. **Why:** CI/CD and security audits depend on reproducible binaries, correct load paths, and symbolication; misconfigured **`rpath`** and ad hoc **`DYLD_*`** use are classic injection surfaces on developer machines (see chapter **11** for hardened runtime). **How:** Prefer **`@import`**, verify **`otool -L`**, and ship **dSYM** UUIDs with crashes.

---

## 1. Modules vs textual includes

Prefer framework **modules**:

```objc
@import Foundation;
```

This reduces compile time and macro fragility compared to unbounded **`#import`** graphs.

---

## 2. Linking and `@rpath`

Dynamic libraries resolve at load time via **dyld**. Runpath entries tell the loader where to search for **`@rpath`**-relative install names:

- **`@executable_path`** — relative to the main binary.
- **`@loader_path`** — relative to the binary that loaded the library (common inside **`.app`** bundles).
- **`@rpath`** — expands against embedded **rpath** lists.

Misconfigured **rpath** plus **`DYLD_*`** variables (where allowed) increase injection risk on dev machines; production targets use hardened runtime constraints.

---

## 3. Example link line (illustrative)

```bash
xcrun clang -fobjc-arc -framework Foundation -framework UIKit main.m -o MyTool
```

Inspect install names with **`otool -L`** on built binaries.

---

## 4. dSYM and symbolication

Release builds should emit **dSYM** bundles with UUIDs matching the executable. Crash pipelines map addresses to source lines using **atos** or hosted symbolication.

---

## 5. App bundle layout (mental model)

```
MyApp.app/
  MyApp                 # Mach-O executable
  Info.plist
  Frameworks/           # embedded dylibs / frameworks
  Resources/
```

Code signing covers the bundle tree according to your distribution channel.

---

## References

### Primary

- [Xcode](https://developer.apple.com/xcode/) (Apple Developer)
- [Clang documentation](https://clang.llvm.org/docs/)
- [Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html) (Apple Archive)
- [Notarizing macOS software](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) (Apple Developer)

### Supplemental tutorial

- [Preprocessors](https://www.tutorialspoint.com/objective_c/objective_c_preprocessors.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
