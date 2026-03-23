# Foundation: collections, serialization, errors, and logging

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** **`NSString`** and mutability, **Foundation** collections, **JSON** and **plist** parsing, **`NSError`**, **`os_log`**, and **fast enumeration**. **Why:** Unvalidated parsed graphs and sloppy error handling are common **appsec** failure modes; logging mistakes leak secrets into analytics. **How:** Validate types after **`NSJSONSerialization`**, branch on **domain** and **code**, and keep production logs structured and privacy-aware.

---

## 1. Strings and mutability

```objc
NSString *immutable = @"x";
NSMutableString *mutable = [NSMutableString stringWithString:immutable];
[mutable appendString:@"y"];
```

Use **`copy`** on **`NSString *`** properties so callers cannot pass **`NSMutableString`** and mutate the backing storage later.

---

## 2. Collections

```objc
NSArray<NSString *> *a = @[ @"a", @"b" ];
NSDictionary<NSString *, NSNumber *> *d = @{ @"k": @1 };
```

After **JSON** → **Foundation** (below), validate **types** before use:

```objc
id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:&err];
if (![obj isKindOfClass:[NSDictionary class]]) { /* reject */ }
```

---

## 3. JSON serialization

```objc
NSError *err = nil;
NSData *data = [NSJSONSerialization dataWithJSONObject:payload
                                                 options:NSJSONWritingPrettyPrinted
                                                   error:&err];
```

**Reading** options control mutability of containers and number strictness—mismatches cause silent coercion bugs.

---

## 4. NSError

```objc
NSError *err = nil;
BOOL ok = [self doThingWithError:&err];
if (!ok) {
  NSLog(@"domain=%@ code=%ld", err.domain, (long)err.code);
  return;
}
```

Do not base authorization solely on **localized** strings—use **domains** and **codes** for program logic.

---

## 5. Fast enumeration

```objc
for (NSString *line in lines) {
  @autoreleasepool {
    (void)[self handleLine:line];
  }
}
```

Never mutate a container while fast-enumerating it.

---

## 6. Logging (production)

```objc
#import <os/log.h>
static os_log_t log = OS_LOG_DEFAULT;
os_log(log, "processed %{public}zu items", (size_t)count);
```

Use **public** / **private** markers correctly—never log raw tokens or secrets.

---

## References

### Primary

- [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html)
- [Foundation](https://developer.apple.com/documentation/foundation) (Apple Developer)
- [Error Handling Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ErrorHandlingCocoa/ErrorHandling/ErrorHandling.html) (Apple Archive)

### Supplemental tutorial

- [Foundation Framework](https://www.tutorialspoint.com/objective_c/objective_c_foundation_framework.htm)
- [Error Handling](https://www.tutorialspoint.com/objective_c/objective_c_error_handling.htm)
- [Log Handling](https://www.tutorialspoint.com/objective_c/objective_c_log_handling.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
