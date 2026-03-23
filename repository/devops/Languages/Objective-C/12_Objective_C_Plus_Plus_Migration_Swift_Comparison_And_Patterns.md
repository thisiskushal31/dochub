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
