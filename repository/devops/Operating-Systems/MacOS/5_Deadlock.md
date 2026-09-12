# macOS: deadlock

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Deadlock](../Fundamentals/7_Deadlock.md). Here: **how macOS handles** (or does not handle) **deadlock** — no kernel-level deadlock detection; avoidance and observation are up to the developer and admin.

---

## How the system handles deadlock (deep level)

The **XNU kernel does not detect or resolve user-level deadlocks**. If two or more threads (in one process or across processes) hold locks and wait for each other, the kernel will not break the cycle. **Deadlock avoidance** is the programmer’s responsibility: use **lock ordering**, **trylock** with backoff, or **timeouts** so that cycles cannot form or can be broken by aborting and retrying.

**Observation:** If a process or app appears hung, **sample** or **pause** it to see where threads are blocked:

- **`sample <pid>`** — Samples the process and shows where threads are in the call stack; repeated runs can show threads stuck in the same lock.
- **Activity Monitor** — View threads; if many threads are in “Waiting” or similar, possible deadlock.
- **lldb / Xcode** — Attach and inspect thread backtraces; look for lock acquisition order (e.g. Thread 1 holds A, wants B; Thread 2 holds B, wants A).

**Recovery:** There is no automatic recovery. Options: **kill** the process (`kill -9 <pid>`), restart the app, or fix the code (lock ordering, timeouts, or lock-free design).

**References:** Standard OS/deadlock material; Apple does not document “deadlock detection” as a kernel feature because it is not provided.

---

## Summary

- **Detection:** None at kernel level.
- **Avoidance:** Lock ordering, trylock, timeouts in application code.
- **Observation:** **`sample`**, Activity Monitor threads, **lldb** backtraces.
- **Recovery:** Kill process or fix program.

---

## Further reading

- [Fundamentals: Deadlock](../Fundamentals/7_Deadlock.md) — Conditions, prevention, avoidance, detection.
- `man sample`, `man lldb`
