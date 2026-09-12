# macOS: multithreading

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Threads and concurrency](../Fundamentals/8_Threads_And_Concurrency.md). Here: **how macOS implements** threads — **pthreads**, **1:1 model**, and **Mach threads**.

---

## How the system does it (deep level)

**Model:** **1:1 (kernel-level) threading.** Each **pthread** (POSIX thread) is backed by one **Mach thread** (kernel schedulable entity). There is no many-to-one user-level thread package in the standard stack; the kernel schedules each pthread directly. So: **one user thread = one kernel thread**; creating many pthreads means many kernel threads (scheduling and context-switch overhead).

**APIs:** **POSIX threads (pthreads)** — `pthread_create`, `pthread_join`, `pthread_mutex_*`, `pthread_cond_*`, etc. — are the standard C API. **Grand Central Dispatch (GCD)** and **NSOperation** (Objective-C/Swift) are higher-level abstractions that use threads (and thread pools) underneath; they are the preferred way to do concurrency in Apple’s ecosystem.

**Kernel view:** The **Mach** layer has **threads** and **tasks**. A **task** is the address space; **threads** within a task share that address space and are scheduled by the Mach scheduler. The BSD **process** corresponds to one task; the **threads** of that task are the process’s threads (pthreads map to these).

**References:** [Mach Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Mach/Mach.html), [BSD Overview: pthreads (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/BSD/BSD.html), [Concurrency Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/).

---

## Commands

- **`ps -M -p <pid>`** — List threads (Mach threads) of process `<pid>`.
- **Activity Monitor** — Select a process, then “Threads” (or similar) to see thread count and CPU per thread.
- **`sample <pid>`** — Sample process; output includes per-thread call stacks.

---

## Summary

- **Model:** **1:1** — one pthread = one Mach (kernel) thread.
- **APIs:** **pthreads** (C), **GCD** and **NSOperation** (Objective-C/Swift, preferred).
- **Inspect:** **`ps -M`**, Activity Monitor, **`sample`**.

---

## Further reading

- [Concurrency Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/General/Conceptual/ConcurrencyProgrammingGuide/)
- [Mach Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Mach/Mach.html)
- `man pthread_create`, `man pthread_join`
