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

## Advanced use cases and implementation

**`install_name` and post-link fixes:** **`install_name_tool`** changes **dylib** **IDs** and **`rpath`** in a built binary when **packaging** **plugins** or **relocating** **frameworks**. Wrong **paths** → **load** failures at **launch** or **dlopen**—catch with **`otool -l`** and **test** on a **clean** machine.

**Verification:** **`codesign --verify --deep --strict`** on **`.app`** bundles catches **tampered** **resources** before **distribution**. CI should **fail** the **pipeline** if **signing** **identity** or **entitlements** drift from **expected** **profiles**.

**Fat binaries and slices:** **Universal** Mach-O files bundle **arm64**, **x86_64**, etc. **CI** must **archive** the **slice** that matches **crash** **reports** when **symbolicating**; **wrong** **architecture** in **dSYM** → **failed** **symbolication**.

**Stripping and privacy:** **Strip** **debug** **symbols** in **release** but **keep** **dSYM** **off**-machine. **Aggressive** **strip** of **Objective-C** **metadata** is rare in **apps** (breaks **some** **runtime** **features**); **security** tools may **strip** more in **hardened** **utilities**.

**XCFrameworks:** Vendor **SDKs** ship **multi-platform** **frameworks** with **headers** and **slices**—consume them with **consistent** **deployment** **targets** and **link** **flags** documented by the **vendor**.

---

## References

### Primary

- [Xcode](https://developer.apple.com/xcode/) (Apple Developer)
- [Clang documentation](https://clang.llvm.org/docs/)
- [Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html) (Apple Archive)
- [Notarizing macOS software](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution) (Apple Developer)

### Supplemental tutorial

- [Preprocessors](https://www.tutorialspoint.com/objective_c/objective_c_preprocessors.htm)

