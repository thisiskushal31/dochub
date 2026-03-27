# Messaging, selectors, types, and Objective-C grammar

[← Back to Objective-C](./README.md)

## What this chapter covers

How **message** sends work, the roles of **`id`**, **`Class`**, and **`SEL`**, **dot** syntax, messaging **`nil`**, **literals**, **`@encode`**, and safe patterns around **dynamic** dispatch (for example **`NSSelectorFromString`** on untrusted input). This is the mechanical core you step through in **lldb** and review during security work.

```objc
id o = @"x";
[o description]; /* always a message send, never a direct C call */
```

---

## 1. Messages are not C function calls

A message send looks like a call, but the runtime resolves **receiver + selector → implementation** at execution time (with caching):

```objc
NSString *s = @"abc";
NSUInteger len = [s length];
```

**`length`** is not a struct field; it is a message. Multi-argument APIs embed **keyword:** labels in the selector name:

```objc
NSString *t = [s stringByReplacingOccurrencesOfString:@"a"
                                         withString:@"x"
                                            options:0
                                              range:NSMakeRange(0, s.length)];
```

---

## 2. `id`, `Class`, `SEL`, `BOOL`

```objc
id anyObject = @"x";
Class cls = [NSString class];
SEL sel = @selector(length);
BOOL ok = [anyObject respondsToSelector:sel];
```

- **`id`** — any object pointer; add protocols or lightweight generics when you want static typing.
- **`Class`** — handle for a class object.
- **`SEL`** — opaque selector; compare with **`sel_isEqual`** or **`==`** for compile-time constants.
- **`BOOL`** — use **`YES`** / **`NO`**.

---

## 3. `super`

**`super`** starts lookup as if the message were sent starting from the superclass of the class that defines the current method—not by holding a second receiver:

```objc
@implementation MyView : UIView
- (void)layoutSubviews {
  [super layoutSubviews];
  // custom work
}
@end
```

Inside **categories**, **`super`** behavior is easy to get wrong and changes which implementation runs.

---

## 4. Messaging `nil`

Sending to **`nil`** yields zero-like results for scalar returns without crashing:

```objc
NSString *n = nil;
NSUInteger z = [n length]; // z == 0
```

That is not “safe” application logic: silent failures can hide broken invariants and authorization mistakes.

---

## 5. Literals

String, number, array, and dictionary literals compile to the usual runtime calls and autorelease patterns:

```objc
NSString *s = @"literal";
NSNumber *n = @42;
NSArray *a = @[ @1, @2, s ];
NSDictionary *d = @{ @"k": n, @"s": s };
```

Prefer immutable **Foundation** graphs where possible; mutable literal variants exist but are less common.

---

## 6. `@encode` and dynamic APIs

**`@encode`** yields a type-encoding string for runtime registration:

```objc
const char *enc = @encode(NSUInteger);
```

**`NSInvocation`** and some **KVC** paths depend on correct encodings; mismatches can corrupt memory or crash.

---

## 7. `NSSelectorFromString` and security

Do not pass untrusted strings into **`NSSelectorFromString`** without an allowlist:

```objc
SEL s = NSSelectorFromString(userString);
if ([obj respondsToSelector:s]) {
  [obj performSelector:s];
}
```

That pattern expands **what** arbitrary code can invoke. Prefer typed methods, **blocks**, or explicit dispatch tables.

---

## Advanced use cases and implementation

**`@dynamic`:** Declares that accessors are **not** synthesized by the compiler—they will exist at runtime (e.g. **Core Data** **NSManagedObject** properties, or runtime-generated methods). Misuse produces **unrecognized selector** crashes at first access if nothing supplies the implementation.

**Dispatch and ABI edges:** Small returns go through **`objc_msgSend`**; some **struct** return types historically used different entry points (family of **`objc_msgSend*_stret`** on older ABIs). When reading **assembly** or **crash** traces, “which stub” explains frame layout—rare in day-to-day app code, common in **performance** and **reverse-engineering** work.

**Typed APIs at boundaries:** Replace **`performSelector:`** / **`NSInvocation`** in public surfaces with **blocks**, **protocols**, or **explicit** methods so **refactoring** and **Swift** import stay safe. Reserve **fully dynamic** dispatch for **plug-in** architectures with a **versioned** protocol and **allowlisted** selectors.

```objc
@property (nonatomic, copy) void (^onComplete)(BOOL ok);
/* Prefer blocks + protocols at boundaries; reserve performSelector for plugins */
```

---

## References

### Primary

- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Objective-C literals](https://clang.llvm.org/docs/ObjectiveCLiterals.html)
- [Clang documentation](https://clang.llvm.org/docs/)

### Supplemental tutorial

- [Basic Syntax](https://www.tutorialspoint.com/objective_c/objective_c_basic_syntax.htm)
- [Data Types](https://www.tutorialspoint.com/objective_c/objective_c_data_types.htm)
- [Dynamic Binding](https://www.tutorialspoint.com/objective_c/objective_c_dynamic_binding.htm)

