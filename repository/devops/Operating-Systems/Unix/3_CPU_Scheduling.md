# CPU scheduling (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: CPU scheduling](../Fundamentals/4_CPU_Scheduling.md). Here: how **Unix** and Unix-like systems schedule threads or processes — at the **system level** — and which commands to use.

---

## How the system does it (deep level)

Unix and Unix-like kernels use **priority-based**, **preemptive** scheduling. There is no single “Unix scheduler”: each OS has its own implementation (e.g. **FreeBSD ULE**, **Solaris** dispatcher, **4.3BSD**-derived). The following describes the **common ideas** and, where useful, **FreeBSD** as a concrete reference (see [ULE: A Modern Scheduler for FreeBSD](https://www.usenix.org/legacy/event/bsdcon03/tech/full_papers/roberson/roberson.pdf) and [FreeBSD runqueue(9)](https://man.freebsd.org/cgi/man.cgi?query=runqueue)).

**Run queues:** The kernel maintains **run queues** (or equivalent) — one or more per priority level (or per CPU). A thread or process that is **runnable** is placed on the queue for its current **scheduling priority**. The scheduler selects a runnable entity (usually the highest priority); when it blocks (I/O, wait on a lock) or exhausts its **time slice**, it is demoted or re-queued and another is chosen. So at a deep level: **priority** determines which queue the thread is on; the kernel **dispatcher** picks from the highest-priority non-empty queue; **preemption** happens when a higher-priority thread becomes runnable or when the current thread’s quantum expires.

**Nice vs scheduling priority:** Many Unix systems expose two notions: (1) **Nice value** — a user-facing adjustment (e.g. -20 to +19 on Linux; 0–39 on some BSDs). Lower nice = “nicer” to others = lower priority in the time-sharing class. (2) **Scheduling priority (pri)** — the actual kernel priority used by the run queue. The kernel **maps** nice (and optionally recent CPU usage) to the internal priority. For example, on **FreeBSD ULE**, threads have an **estcpu** (estimated CPU usage); the scheduler uses this and the nice value to compute the effective priority so that interactive or I/O-bound threads get better treatment. So: **nice** and **renice** change the input to that mapping; they do not directly set the kernel priority number.

**Real-time priority:** Some Unix systems support **real-time** or **fixed** priority classes (e.g. **rtprio** on BSD, **chrt** on Linux). Threads in the real-time class are scheduled above normal time-sharing threads and are not subject to the same nice-based adjustments. Use with care — they can starve the rest of the system.

**References:** [FreeBSD: Scheduling Priorities (EuroBSDCon 2024)](https://papers.freebsd.org/2024/eurobsdcon/certner-scheduling_priorities_and_freebsd/), [runqueue(9)](https://man.freebsd.org/cgi/man.cgi?query=runqueue), [ULE scheduler paper (USENIX)](https://www.usenix.org/legacy/event/bsdcon03/tech/full_papers/roberson/roberson.pdf).

---

## Scheduling on Unix (commands and concepts)

Unix and Unix-like kernels use **priority-based** scheduling. Lower **nice** value (in the time-sharing class) typically means higher priority (more CPU). **nice** and **renice** change the nice value. Real-time priorities (e.g. **rtprio** on BSD, **chrt** on Linux) are available and sit above the time-sharing class.

---

## Commands

```bash
# Run with lower priority (higher nice)
nice -n 10 command

# Change existing process
renice -n 5 -p <pid>

# Priority (Linux)
chrt -p <pid>
chrt -f 50 command
```

---

## Summary

- **Nice** values influence CPU share; **renice** adjusts running processes.
- Real-time scheduling: **chrt** (Linux), **rtprio** (BSD).

---

## Further reading

- [FreeBSD: Scheduling Priorities and FreeBSD (EuroBSDCon 2024)](https://papers.freebsd.org/2024/eurobsdcon/certner-scheduling_priorities_and_freebsd/) — Nice vs scheduling priority vs real-time.
- [FreeBSD runqueue(9)](https://man.freebsd.org/cgi/man.cgi?query=runqueue) — Run queue and scheduler interfaces.
- [ULE: A Modern Scheduler for FreeBSD (USENIX)](https://www.usenix.org/legacy/event/bsdcon03/tech/full_papers/roberson/roberson.pdf) — ULE design and SMP.
- [GeeksforGeeks: CPU scheduling](https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/)
