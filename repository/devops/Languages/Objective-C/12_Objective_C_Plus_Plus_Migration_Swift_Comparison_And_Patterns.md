# Objective-C++, migration, Swift comparison, and patterns

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** **Objective-C++** (`.mm`), **C** / **C++** interop, incremental migration, **Swift** vs **Objective-C** tradeoffs, and production patterns (XPC splits, plugins, SDK wrappers). **Why:** Mixed runtimes need clear exception and destructor boundaries; migration without telemetry repeats old failure modes. **How:** Use **strangler** facades, tighten headers before large Swift moves, and prefer explicit APIs over global runtime mutation in hardened code.

---

## 1. Objective-C++ translation unit

```objc
#import "Engine.h"
#import <Foundation/Foundation.h>
#include <vector>

@implementation Engine {
  std::vector<int> _values;
}

- (void)addValue:(int)v {
  _values.push_back(v);
}

@end
```

**Exception safety:** do not let C++ exceptions propagate through Objective-C frames you do not control. Destructors in mixed code paths need explicit boundaries.

---

## 2. `extern "C"` for C headers in C++

```cpp
extern "C" {
#include "legacy_c_api.h"
}
```

Prevents C++ name mangling mismatches when linking C static libraries.

---

## 3. Migration strategy (incremental)

**Strangler fig:** keep stable Objective-C (or thin C) facades; migrate implementation to Swift module by module. Use feature flags and telemetry to compare error rates on old vs new paths.

**Mechanical wins before large Swift adoption:** ARC everywhere, nullability and lightweight generics on headers, replace unbounded **`performSelector:`** with typed APIs or blocks.

---

## 4. Swift vs Objective-C

| Concern | Objective-C | Swift |
|--------|-------------|--------|
| Static safety | Dynamic **`id`** by default | Stronger defaults in idiomatic code |
| C interop | Native | Via bridging headers |
| C++ interop | Objective-C (`.mm`) | Limited / evolving surface |
| Runtime hooks | Categories, swizzling | Prefer explicit APIs over global mutation |

**Rule of thumb:** Swift for new features where constraints allow; Objective-C literacy remains mandatory for maintenance, debugging, and incident response.

---

## 5. Production patterns

- **XPC** to split UI from privileged workers.
- **Plugin bundles** with pinned versions and integrity checks.
- **SDK wrappers** that validate untrusted input before building Foundation graphs.

---

## Advanced use cases and implementation

**Where `.mm` is used:** Game engines, audio DSP, computer vision, and cross-platform C++ stacks exposed to UIKit usually use **Objective-C++**—thin `.mm` adapters around C++ with exceptions stopped at boundaries and mapped to **`NSError`**.

**XPC services (macOS):** Privileged work (install helpers, network filters) runs out-of-process behind a narrow protocol. **`NSXPCConnection`** Objective-C plumbing must validate every message; type names in headers are not authentication.

**App extensions:** Share, Today, Notification Service, and Intents extensions are separate binaries with tight RAM and lifecycle rules. Shared Objective-C code must avoid app-wide singleton assumptions; legacy Objective-C often lingers here after the main app moves to Swift.

**Migration sequencing (strangler):** (1) Facades and tests. (2) Swift behind feature flags. (3) Migrate leaf modules first (models, parsing). (4) Defer heavy UIKit paths until boundaries stabilize. (5) Measure crash-free sessions and latency per cohort.

**Static vs dynamic libraries:** Static archives resolve symbols at link time; dynamic frameworks trade load time and signing surface for flexibility. The **`-ObjC`** linker flag forces-load Objective-C categories from static archives when they would otherwise be dead-stripped.

---

## References

### Primary

- [Importing Objective-C into Swift](https://developer.apple.com/documentation/swift/importing-objective-c-into-swift)
- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Clang documentation](https://clang.llvm.org/docs/)
- [Swift.org](https://www.swift.org/)

### Supplemental tutorial

- [Pointers](https://www.tutorialspoint.com/objective_c/objective_c_pointers.htm)
- [Structures](https://www.tutorialspoint.com/objective_c/objective_c_structures.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
