# macOS: CPU scheduling

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: CPU scheduling](../Fundamentals/4_CPU_Scheduling.md). Here: **how macOS (XNU) does scheduling** — **Mach** scheduler, **threads and tasks**, **priority**, and **nice**.

---

## How the system does it (deep level)

**Schedulable unit:** The **thread** (Mach thread). A **task** (Mach) is the address space; a task has one or more threads. The kernel schedules **threads**, not processes. The BSD **process** is the “personality” (PID, signals, etc.) associated with a task; typically one process = one task with one or more threads.

**Scheduler:** XNU uses a **priority-based**, **preemptive** scheduler. Threads have **scheduling priorities**; higher-priority threads run before lower-priority ones. The scheduler supports **real-time** threads (for low-latency audio, etc.) and **normal** (timesharing) threads. Preemption: a higher-priority thread can preempt a lower-priority one; the kernel also uses **time quanta** (time slices) for fair sharing among same-priority threads.

**Priority:** Priorities are numeric; the exact range and meaning are kernel-internal. **Nice** values (user-facing, typically -20 to 20) influence the scheduling priority of a process: lower nice = higher priority (more CPU). **`nice`** and **`renice`** set or change the nice value of a process.

**References:** [Mach Scheduling and Thread Interfaces (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/scheduler/scheduler.html), [XNU scheduling (Wikipedia)](https://en.wikipedia.org/wiki/XNU#Scheduling).

---

## Commands

- **`nice -n <value> command`** — Run `command` with given nice value (e.g. `nice -n 10 make`).
- **`renice -n <value> -p <pid>`** — Change nice value of process `<pid>` (e.g. `renice -n 5 -p 12345`). May require elevated privileges to lower nice (increase priority).
- **`top`** — Shows CPU usage per process; sort by CPU with **`o cpu`**.
- **`ps -o pid,ni,comm`** — Show PID, nice value (NI), and command name.

---

## Summary

- **Schedulable unit:** **Thread** (Mach); **process** (BSD) = task + PIDs/signals.
- **Scheduler:** **Priority-based**, **preemptive**; supports real-time and timesharing.
- **Nice:** **`nice`**, **`renice`** set process nice; lower nice = higher priority.

---

## Further reading

- [Mach Scheduling and Thread Interfaces (Apple Kernel Programming Guide)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/scheduler/scheduler.html)
- [nice(1), renice(8) — man pages](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/)
