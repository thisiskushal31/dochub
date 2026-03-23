# Testing, debugging, sanitizers, and observability

[← Back to Objective-C](./README.md)

## What this chapter covers

**XCTest** patterns, **lldb** recipes, **Address Sanitizer** / **Zombies** / **Thread Sanitizer**, **`os_log`**, and crash pipelines (**UUID**, **`dSYM`**, symbolication). Goal: reproducible triage in development and defensible telemetry in production.

---

## 1. XCTest skeleton

```objc
#import <XCTest/XCTest.h>
#import "MyParser.h"

@interface MyParserTests : XCTestCase
@end

@implementation MyParserTests

- (void)testParsesMinimalPayload {
  NSError *err = nil;
  id obj = [MyParser parse:@"{}" error:&err];
  XCTAssertNotNil(obj);
  XCTAssertNil(err);
}

@end
```

Prefer **hermetic** unit tests—no live network unless you use controlled record/replay.

---

## 2. lldb snippets

```
(lldb) po someObject
(lldb) expr (void)[someObject debugDump]
(lldb) breakpoint set -n "-[UIView layoutSubviews]"
```

Never paste production secrets into **lldb** expressions in shared screen shares or logged transcripts.

---

## 3. Sanitizers (test / nightly builds)

| Tool | Purpose |
|------|---------|
| **Address Sanitizer** | Heap buffer overflows, many use-after-frees in native memory |
| **Zombies** | Messages to freed Objective-C objects |
| **Thread Sanitizer** | Data races (when enabled for the target) |

ASan adds overhead—run on nightly or dedicated schemes if PR time budgets are tight.

---

## 4. Production logging

```objc
#import <os/log.h>
os_log_t log = os_log_create("com.example", "network");
os_log(log, "request id=%{public}@", requestId);
```

Correlate logs with crash reports using **build version** and **binary UUID**.

---

## Advanced use cases and implementation

**Instruments (typical workflows):** **Time Profiler** finds **hot** **Objective-C** **methods** and **objc_msgSend** overhead; **Allocations** / **Leaks** track **retain** **cycles** and **heap** growth; **System Trace** correlates **CPU** with **threads**. Use **same** **build** **configuration** as **production** when **optimizing**—**Debug** **inlines** and **asserts** skew results.

**Crash triage workflow:** (1) **Symbolicate** with **matching** **dSYM** **UUID**. (2) Classify: **signal** (SIGSEGV, etc.) vs **Objective-C** **exception** vs **abort**. (3) For **`objc_msgSend`**, read **next** frames for **real** **callee**. (4) Check **thread** **sanitizer** / **Zombie** **repro** if **heap** **corruption** suspected. (5) **Bisect** **releases** with **metadata** from chapter **1** / **9**.

**MetricKit and power:** **MXMetricManager** (Swift-first API; **Objective-C** **projects** call it from **mixed** targets) exposes **battery** and **performance** **histograms**—useful to tie **code** changes to **field** **regressions**.

**Stress and soak:** Long-running **UI** tests and **soak** **runs** expose **autorelease** **pool** **pressure**, **GCD** **queue** **depth**, and **memory** **warnings** that **unit** tests miss.

---

## References

### Primary

- [Testing with Xcode](https://developer.apple.com/documentation/xcode/testing) (Apple Developer)
- [Debugging with Xcode](https://developer.apple.com/documentation/xcode/debugging) (Apple Developer)
- [Instruments User Guide](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/Introduction/Introduction.html) (Apple Archive)
- [Improving your app’s performance](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance) (Apple Developer)
- [MetricKit](https://developer.apple.com/documentation/metrickit) (Apple Developer)

### Supplemental tutorial

- [Log Handling](https://www.tutorialspoint.com/objective_c/objective_c_log_handling.htm)
- [Error Handling](https://www.tutorialspoint.com/objective_c/objective_c_error_handling.htm)

**Optional:** [README — References hub](./README.md#references-hub) — bookmark entry points only; this chapter's **References** are authoritative for this topic.
