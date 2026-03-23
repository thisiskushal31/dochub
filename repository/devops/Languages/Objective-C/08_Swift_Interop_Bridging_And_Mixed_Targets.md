# Swift interop, bridging headers, and mixed targets

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** How **Swift** imports **Objective-C**, **bridging headers**, generated **`*-Swift.h`** headers, and **nullability** / **generics** on Objective-C APIs. **Why:** Boundary mistakes create optionality bugs, stale generated headers break CI, and public headers are long-lived API. **How:** Keep bridging headers small, annotate headers for Swift, and pin toolchain settings in version control.

---

## 1. Bridging header (Swift consumes Objective-C)

Example **`MyApp-Bridging-Header.h`**:

```objc
#import <Foundation/Foundation.h>
#import "LegacyAuthenticator.h"
```

Keep this **minimal**—every import expands what Swift sees and adds compile cost.

---

## 2. Objective-C API surface for Swift

In **`LegacyAuthenticator.h`**:

```objc
NS_ASSUME_NONNULL_BEGIN
@interface LegacyAuthenticator : NSObject
- (BOOL)loginWithUser:(NSString *)user
             password:(NSString *)pass
                error:(NSError * _Nullable * _Nullable)error;
@end
NS_ASSUME_NONNULL_END
```

**Nullability** and **lightweight generics** on Objective-C headers directly shape Swift **optionals** and collection types.

---

## 3. Swift exposed to Objective-C (conceptual)

Swift types need **`@objc`** or **`@objcMembers`** where appropriate, and Objective-C–compatible method signatures at the boundary. The build emits **`ModuleName-Swift.h`** for **`.m`** files in the same target.

Pin **`SWIFT_VERSION`** and generated header settings in projects checked into VCS.

---

## 4. CI checklist for mixed targets

- Clean **DerivedData** when generated headers look wrong.
- Same **Xcode** major on developer laptops and CI.
- Archive **dSYM** and Swift metadata with release artifacts.

---

## References

### Primary

- [Importing Objective-C into Swift](https://developer.apple.com/documentation/swift/importing-objective-c-into-swift)
- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Clang documentation](https://clang.llvm.org/docs/)

### Supplemental tutorial

- [Protocols](https://www.tutorialspoint.com/objective_c/objective_c_protocols.htm)
- [Extensions](https://www.tutorialspoint.com/objective_c/objective_c_extensions.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
