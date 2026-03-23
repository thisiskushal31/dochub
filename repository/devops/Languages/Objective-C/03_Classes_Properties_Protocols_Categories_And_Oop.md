# Classes, properties, protocols, categories, and OOP

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** How interfaces and implementations map to runtime behavior, how **`@property`** changes ownership and threading semantics, and how **protocols**, **categories**, and **extensions** shape APIs. **Why:** Wrong **delegate** ownership, **category** collisions, and unclear **init** contracts cause production bugs and widen review surface for security. **How:** Patterns below are what you enforce in code review and tests.

---

## 1. Interface and implementation

Headers declare the contract; implementation files define behavior. **Designated initializers** and **`NS_UNAVAILABLE`** on the base **`init`** help subclasses and Swift see a single supported construction path.

```objc
// Person.h
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Person : NSObject
@property (copy) NSString *name;
- (instancetype)initWithName:(NSString *)name NS_DESIGNATED_INITIALIZER;
- (instancetype)init NS_UNAVAILABLE;
@end

NS_ASSUME_NONNULL_END
```

```objc
// Person.m
#import "Person.h"

@implementation Person

- (instancetype)initWithName:(NSString *)name {
  self = [super init];
  if (self) {
    _name = [name copy];
  }
  return self;
}

@end
```

**Nullability** macros (`NS_ASSUME_NONNULL_BEGIN`, pointer qualifiers) strongly affect generated Swift interfaces—treat public headers as API you are willing to support long term.

---

## 2. Property attributes

| Attribute | Typical use |
|-----------|----------------|
| `strong` | Default object ownership under ARC. |
| `copy` | **`NSString`** and **`block`** properties—avoids callers holding **`NSMutableString`** and mutating later. |
| `weak` | Delegates and back-references—avoids retain cycles. |
| `assign` | Scalars; unsafe for objects in legacy MRC. |
| `atomic` / `nonatomic` | Accessor synthesis locking; **`atomic`** does not make multi-step operations thread-safe. |

Dot syntax calls accessors; direct ivar access bypasses **KVO** unless you coordinate manually.

---

## 3. Protocols

Protocols describe messages without fixing a class hierarchy. **`@optional`** methods require **`respondsToSelector:`** at runtime unless your code guarantees adoption.

```objc
@protocol DataFetcher <NSObject>
- (void)fetchWithCompletion:(void (^)(NSData * _Nullable data, NSError * _Nullable err))completion;
@optional
- (void)cancel;
@end
```

---

## 4. Categories

Categories add methods to existing classes at link time. Two categories defining the same **selector** without coordination yields undefined which implementation wins—treat third-party categories on framework types as **supply-chain** risk.

```objc
@interface NSString (MyHelpers)
- (NSString *)my_trimmed;
@end
```

---

## 5. Class extensions (private interface)

Extensions in the **`.m`** file hide implementation detail from public headers. They are not a security boundary against memory attackers; they are for **API hygiene** and **encapsulation**.

```objc
@interface MyObject ()
@property (nonatomic) NSMutableArray *internalBuffer;
@end
```

---

## 6. Posing (legacy)

**Posing** (substituting one class for another globally) is obsolete for new design. Know the term when reading old libraries or incident write-ups.

---

## Advanced use cases and implementation

**KVC / KVO in real code:** **Key–value coding** powers **bindings**, **Core Data**, and **IB**–driven paths; **key–value observing** wires model changes to UI. Advanced pitfalls: **dependent keys** (`+keyPathsForValuesAffectingValueForKey:`), **observation** lifetime (remove observers before deallocation), and **KVC** on **collections** (mutations must trigger the right notifications). Treat KVO-heavy objects as **hard to reason about** in concurrent code—prefer explicit callbacks or **Combine** on Swift side when migrating.

**Facade and coordinator patterns:** Large Objective-C apps often isolate **UIKit** / **AppKit** from **network** and **persistence** with **facade** objects and **coordinators** (explicit **protocols**, **dependency injection** via initializers). That is where you enforce **authorization** and **thread** rules before they touch **Foundation** collections shared with Swift.

**Subclass hooks:** **`NS_REQUIRES_SUPER`** documents methods where subclasses must call **`super`**—common in **view** and **controller** lifecycles. Missing **`super`** calls are a frequent source of “works on one OS version” bugs.

---

## References

### Primary

- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html)

### Supplemental tutorial

- [Classes & Objects](https://www.tutorialspoint.com/objective_c/objective_c_classes_objects.htm)
- [Protocols](https://www.tutorialspoint.com/objective_c/objective_c_protocols.htm)
- [Categories](https://www.tutorialspoint.com/objective_c/objective_c_categories.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
