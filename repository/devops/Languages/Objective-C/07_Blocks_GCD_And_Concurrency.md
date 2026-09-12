# Blocks, GCD, and concurrency

[← Back to Objective-C](./README.md)

## What this chapter covers

**What:** **Blocks** as async units, **Grand Central Dispatch**, **barriers**, **QoS**, and **`NSOperationQueue`**. **Why:** Deadlocks, races, and main-thread stalls show up in crash analytics and security reviews when ownership and queue discipline are wrong. **How:** Prefer explicit queues, weak **`self`** when appropriate, and cancellation checks in long work.

```objc
#import <dispatch/dispatch.h>
```

---

## 1. Block typedefs

```objc
typedef void (^VoidBlock)(void);
typedef void (^CompletionBlock)(NSData * _Nullable data, NSError * _Nullable err);
```

Under **ARC**, blocks are Objective-C objects—**`self`** is captured **strongly** unless you break the cycle (e.g. **`__weak`** + strong local inside the block).

---

## 2. Dispatch basics

```objc
dispatch_queue_t q = dispatch_queue_create("com.example.work", DISPATCH_QUEUE_SERIAL);

dispatch_async(q, ^{
  NSData *result = [self expensiveWork];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self applyResult:result];
  });
});
```

**`dispatch_sync`** to the **main** queue **from** the main queue **deadlocks**—avoid **`dispatch_sync`** on the UI queue unless you control reentrancy.

---

## 3. Barriers (concurrent queue)

```objc
dispatch_queue_t cq = dispatch_queue_create("com.example.rw", DISPATCH_QUEUE_CONCURRENT);

dispatch_async(cq, ^{ /* read */ });
dispatch_barrier_async(cq, ^{
  /* exclusive write */
});
```

---

## 4. Global queues and QoS

```objc
dispatch_queue_t bg = dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0);
dispatch_async(bg, ^{
  // CPU work
});
```

Pick **QoS** honestly—misclassification hurts latency and power.

---

## 5. NSOperationQueue

```objc
NSBlockOperation *op1 = [NSBlockOperation blockOperationWithBlock:^{ /* A */ }];
NSBlockOperation *op2 = [NSBlockOperation blockOperationWithBlock:^{ /* B */ }];
[op2 addDependency:op1];
[[NSOperationQueue mainQueue] addOperations:@[op1, op2] waitUntilFinished:NO];
```

Cancellation must be observed inside long-running **`NSOperation`** bodies.

---

## Advanced use cases and implementation

**Queue identity and reentrancy:** **`dispatch_queue_set_specific`** / **`dispatch_get_specific`** attach **per-queue** context—useful to assert “this **method** must run on **this** queue” without passing tokens everywhere. **`dispatch_sync`** back onto a queue you already hold → **deadlock**; design **async** completion chains instead.

**Reader–writer pattern:** A **concurrent** queue + **barrier** writes (section **3**) implements an **RW lock** without **`pthread_rwlock`**—common for **in-memory** caches. Still **one** writer; **read** scalability depends on **contention** and **QoS**.

**Run loop integration:** **`performSelector:onThread:withObject:waitUntilDone:`** and **`CFRunLoop`** sources integrate **Foundation** with **threads** that have **run loops** (e.g. **legacy** **network** or **audio**). Mixing that with **GCD** requires a clear **owner** for each **thread**—otherwise you get **ordering** bugs and **use-after-free** on teardown.

**`NSOperationQueue`:** **`maxConcurrentOperationCount`**, **dependencies**, and **QoS** map to **pipeline** stages (download → parse → persist). **Cancellation** must be **checked** between stages; **network** layers should **cooperate** with **NSURLSession** task cancellation.

**`@synchronized` and locks:** **`@synchronized`** is convenient but **coarse** and **order**-sensitive; **`NSLock`**, **`NSRecursiveLock`**, and **`os_unfair_lock`** give clearer **invariants**. **`OSSpinLock`** is **deprecated** for general use—prefer **unfair** locks or **queues**.

**UI and main thread:** **UIKit** / **AppKit** are **main-thread**–affine for most **mutation**. **Background** work that touches **views** must **`dispatch_async`** to **`dispatch_get_main_queue()`** (or **equivalent**). **Instruments** “Main Thread Checker” catches many violations early.

```objc
dispatch_async(dispatch_get_main_queue(), ^{
  /* UIKit / AppKit mutations */
});
```

---

## References

### Primary

- [Concurrency Programming Guide](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/Introduction/Introduction.html) (Apple Archive)
- [Dispatch](https://developer.apple.com/documentation/dispatch) (Apple Developer)

### Supplemental tutorial

- [Blocks](https://www.tutorialspoint.com/objective_c/objective_c_blocks.htm)
- [Fast Enumeration](https://www.tutorialspoint.com/objective_c/objective_c_fast_enumeration.htm)

