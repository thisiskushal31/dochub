# Memory: ARC, MRC literacy, and Core Foundation bridging

[← Back to Objective-C](./README.md)

## What this chapter covers

**ARC** ownership rules, **retain cycles**, **`@autoreleasepool`**, **`__bridge`** casts for **Core Foundation**, **associated objects**, and enough **manual retain/release** vocabulary to read legacy code. **Use-after-free** and **leaks** in long-lived graphs are **security** concerns when they touch secrets or trust boundaries.

---

## 1. ARC in practice

The compiler inserts **`retain`**, **`release`**, and **`autorelease`** according to ownership. Ordinary locals default to **strong**:

```objc
{
  NSString *s = @"example";
} // s released at end of scope
```

**`__weak`** breaks cycles but needs care when you pass references into APIs that expect non-null objects:

```objc
__weak typeof(self) weakSelf = self;
void (^block)(void) = ^{
  __strong typeof(weakSelf) strongSelf = weakSelf;
  if (!strongSelf) return;
  [strongSelf doWork];
};
```

---

## 2. Retain cycles (blocks and delegates)

A block that captures **`self`** strongly while **`self`** holds the block creates a cycle:

```objc
self.completionHandler = ^{
  [self finish];
};
```

Break the cycle with **`__weak`** capture, restructuring ownership, or shortening the block’s lifetime. **Delegate** properties toward external objects should almost always be **`weak`** unless a documented parent/child lifetime guarantees otherwise.

---

## 3. Autorelease pools

Nested **`@autoreleasepool`** scopes bound temporary **Foundation** objects in tight loops:

```objc
for (NSString *line in hugeLines) {
  @autoreleasepool {
    NSData *d = [line dataUsingEncoding:NSUTF8StringEncoding];
    (void)[self processData:d];
  }
}
```

Without nested pools, peak RSS can spike even when there is no “leak” in the classic sense.

---

## 4. Core Foundation bridging

Three bridge casts express ownership transfer between **CF** and **ARC**-managed objects:

```objc
CFStringRef cf = CFStringCreateWithCString(NULL, "x", kCFStringEncodingUTF8);
NSString *ns = (__bridge_transfer NSString *)cf;
// Ownership moves to ARC; do not CFRelease(cf)

NSString *ns2 = @"hello";
CFStringRef cf2 = (__bridge_retained CFStringRef)ns2;
// Caller must CFRelease(cf2) when done

CFStringRef cf3 = (__bridge CFStringRef)ns2;
// No transfer; ns2 must outlive uses of cf3
```

Wrong casts produce **double free** or **leaks**.

---

## 5. Associated objects

```objc
#import <objc/runtime.h>

static char kKey;
objc_setAssociatedObject(self, &kKey, value, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```

Association policy must match intended lifetime; misuse creates hidden cycles or dangling peers.

---

## 6. MRC reading notes

Older code still uses explicit **`retain`**, **`release`**, **`autorelease`**, and **`dealloc`**. Read for balanced ownership across boundaries and watch for nib and **`initWithCoder:`** edge cases.

---

## Advanced use cases and implementation

**Weak and non-retaining collections:** **`NSMapTable`**, **`NSHashTable`**, and **`NSPointerArray`** model **weak** keys/values or **C** pointers—useful for **caches**, **observers**, and **delegate** maps where **`NSArray`** / **`NSDictionary`** would retain too strongly. Wrong options → **leaks** or **use-after-free** when the storage outlives referents.

**`__unsafe_unretained`:** Faster than **`__weak`** but **not** zeroed on deallocation—use only when you can **prove** lifetime (e.g. parent always outlives child). Security-sensitive code avoids this unless benchmarks demand it and invariants are documented.

**Toll-free bridging:** Many **Foundation** classes interchange with **Core Foundation** types (**`NSString`** / **`CFStringRef`**, **`NSArray`** / **`CFArray`**) without copying in common cases—still get bridging casts right at **boundaries** (chapter sections above); wrong ownership at a **CF** API boundary is a classic **double free**.

**ARC and multithreading:** ARC is **not** a substitute for **thread-safe** data structures. Concurrent mutation of **`NSMutableArray`** without external synchronization is undefined behavior—use **serial queues**, **locks**, or **immutable snapshots** (chapter **7**).

---

## References

### Primary

- [Automatic Reference Counting](https://clang.llvm.org/docs/AutomaticReferenceCounting.html)
- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)

### Supplemental tutorial

- [Memory Management](https://www.tutorialspoint.com/objective_c/objective_c_memory_management.htm)
- [Blocks](https://www.tutorialspoint.com/objective_c/objective_c_blocks.htm)
- [Type Casting](https://www.tutorialspoint.com/objective_c/objective_c_type_casting.htm)

