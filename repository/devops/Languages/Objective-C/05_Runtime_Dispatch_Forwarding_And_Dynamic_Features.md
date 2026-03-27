# Runtime: dispatch, forwarding, swizzling, load order

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** How message dispatch, **dynamic method resolution**, **forwarding**, and **swizzling** work, and when **`+load`** vs **`+initialize`** run. **Why:** These mechanisms explain crash stacks, **SDK** hooks, and why third-party code can change **global** behavior—central for security review and **SRE** triage. **How:** Use the patterns below sparingly; prefer explicit APIs in hardened binaries.

```objc
#import <objc/runtime.h>
#import <objc/message.h>
/* objc_msgSend(receiver, _cmd, …) — see Apple libobjc */
```

---

## 1. Dispatch path (conceptual)

1. Message send → cache lookup for **(class, SEL)**.
2. Cache miss → search method lists, update cache.
3. Still missing → **dynamic resolution**, then **forwarding**, then **`doesNotRecognizeSelector:`** / exception path.

Stacks often show **`objc_msgSend`** at the top; the **next** frames show the real work. Treat **`objc_msgSend`** as context, not automatic proof of a “messaging performance” bug.

```objc
NSString *obj = @"hi";
id r = ((id (*)(id, SEL))objc_msgSend)(obj, @selector(description));
```

---

## 2. Dynamic resolution

You can install a method at runtime when a selector is first missing—powerful and easy to misuse in review.

```objc
+ (BOOL)resolveInstanceMethod:(SEL)sel {
  if (sel == @selector(dynamicSecret)) {
    class_addMethod(self, sel, (IMP)my_c_function, "v@:");
    return YES;
  }
  return [super resolveInstanceMethod:sel];
}
```

Any dynamically installed **IMP** must be accounted for in security and maintenance reviews.

---

## 3. Forwarding

**Fast forwarding** redirects to another object (cheaper):

```objc
- (id)forwardingTargetForSelector:(SEL)aSelector {
  if (aSelector == @selector(maybeOptional)) {
    return self.helper;
  }
  return [super forwardingTargetForSelector:aSelector];
}
```

**Full forwarding** uses **`forwardInvocation:`** and **`NSInvocation`** (slower, flexible). Do not forward arbitrary **selectors** toward **untrusted** targets.

---

## 4. Method swizzling (illustrative)

```objc
#import <objc/runtime.h>

static void Swizzle(Class cls, SEL orig, SEL alt) {
  Method m1 = class_getInstanceMethod(cls, orig);
  Method m2 = class_getInstanceMethod(cls, alt);
  method_exchangeImplementations(m1, m2);
}
```

Swizzling affects the **whole class**; order relative to other libraries and **reentrancy** inside swapped methods must be designed. Prefer explicit instrumentation hooks in **security-sensitive** products.

---

## 5. `+load` vs `+initialize`

- **`+load`** runs during image load (per class and category), before **`main`**—order is not fully under your control; avoid heavy work and fragile dependencies.
- **`+initialize`** runs lazily before the first message to the class—better for one-time setup when you control side effects.

```objc
+ (void)load { /* runs at image load — keep minimal */ }
+ (void)initialize { /* first use of class — prefer for setup */ }
```

---

## Advanced use cases and implementation

**Tagged pointers and small objects:** The runtime may pack certain **small** **`NSNumber`**, **`NSString`**, or **`NSDate`** values **inline** in the pointer (no heap object). **Debugging** and **swizzling** assumptions that “every **id** is a heap object” can fail—use **`objc_msgSend`** and **ivar** access patterns that respect the platform model.

**`imp_implementationWithBlock`:** Builds an **IMP** from a **block**—useful for **dynamic** method attachment and **testing** doubles. Treat like any dynamic **IMP**: ownership, **reentrancy**, and **exceptions** must be explicit.

**Where swizzling appears in the wild:** **A/B** and **analytics** SDKs, **method profiling** hooks, and **legacy** bug workarounds. **Supply-chain** review asks: *which* classes are swapped, at **what** load order, and can two vendors fight over the same **selector**? Prefer **explicit** instrumentation APIs for **security**-sensitive binaries.

**`+load` ordering:** **Categories** and **classes** in different **dylibs** run **`+load`** in **image** load order—**not** your source file order. Anything that **depends** on another class being “ready” in **`+load`** is fragile; move to **`+initialize`** or **lazy** singletons with **locks**.

**Forwarding in proxies:** **Core Data** fault objects and some **network** layers use **forwarding** to stand in for real implementations—understand **memory** and **threading** of the **real** target after the fault fires.

```objc
IMP imp = imp_implementationWithBlock(^id(id self, SEL _cmd) {
  return @42;
});
```

---

## References

### Primary

- [Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html)
- [Objective-C](https://developer.apple.com/documentation/objectivec) (Apple Developer)

### Supplemental tutorial

- [Dynamic Binding](https://www.tutorialspoint.com/objective_c/objective_c_dynamic_binding.htm)
- [Categories](https://www.tutorialspoint.com/objective_c/objective_c_categories.htm)

