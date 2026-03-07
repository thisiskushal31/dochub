# Multithreading (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Threads and concurrency](../Fundamentals/8_Threads_And_Concurrency.md). Here: **threads** on Unix — **pthreads** (POSIX threads), 1:1 model, and commands to inspect threads.

---

## How the system does it (deep level)

On most Unix and Unix-like systems, the **unit of scheduling** is the same as the unit of execution the kernel sees: each **pthread** is typically one **kernel schedulable entity** (e.g. one thread in the kernel’s run queues). This is the **1:1** (kernel-thread) model: when you call **pthread_create**, the kernel allocates a new thread structure (e.g. a **thread** or **proc**-like entity depending on OS), gives it its own stack and register context, and puts it on the **run queue**. The kernel **scheduler** then chooses among all runnable threads (across all processes) by **priority** and **run queue** (see [CPU scheduling](./3_CPU_Scheduling.md)). So: **multithreading on Unix** = multiple kernel-level threads per process, each scheduled independently; **pthreads** is the standard API that creates and synchronizes these threads.

---

## Threads on Unix (commands and API)

Unix standardized **POSIX threads (pthreads)**. Each thread shares the process address space but has its own stack and register state. Most Unix-like systems use a **1:1** model (one user thread = one kernel schedulable entity). **pthread_create**, **pthread_join**, **pthread_mutex_lock** are the standard API.

![Program, process, and thread relationship](../../Assets/Operating-Systems/bytebytego-process-vs-thread.png)

*Image: [ByteByteGo – Process vs Thread: Key Differences](https://bytebytego.com/guides/what-is-the-difference-between-process-and-thread/).*

---

## Inspecting threads

```bash
# Threads of a process (Linux-style; similar on Solaris)
ps -eLf | head -20

# On BSD: top -H, or ps -H
# Solaris: prstat -L -p <pid>
```

---

## Summary

- **pthreads** = POSIX thread API; **1:1** model common on Unix/Linux.
- Inspect with **ps -L** (Linux), **top -H**, or OS-specific tools.

---

## Further reading

- [GeeksforGeeks: Threads](https://www.geeksforgeeks.org/operating-systems/thread-in-operating-system/)
- [ByteByteGo – Process vs Thread](https://bytebytego.com/guides/what-is-the-difference-between-process-and-thread/)
- [POSIX threads](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/pthread.h.html)
