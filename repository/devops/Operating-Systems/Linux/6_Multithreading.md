# Multithreading (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Threads and concurrency](../Fundamentals/8_Threads_And_Concurrency.md). Here: how Linux implements threads (1:1 model, clone(), NPTL/pthreads), and commands to inspect threads (ps -T, /proc, top -H).

A **thread** is a flow of execution within a process. One process can have many threads that share the process’s memory and resources but have their own stack and register state. This topic covers thread concepts, user vs kernel threads, multithreading models, and how this shows up in Linux.

---

## Thread vs process

| Concept | Process | Thread |
|--------|---------|--------|
| **Definition** | Program in execution; own address space and resources. | Execution unit within a process; shares address space. |
| **Memory** | Isolated address space. | Shares code, data, heap; usually own stack. |
| **Creation / context switch** | Heavier (new address space, etc.). | Lighter (same address space). |
| **Communication** | IPC (pipes, sockets, shared memory). | Shared memory (same process). |

Threads allow concurrency inside one process (e.g. one thread for I/O, another for computation) with less overhead than multiple processes, but require synchronization (mutexes, etc.) for shared data.

![Program, process, and thread relationship](../../Assets/Operating-Systems/bytebytego-process-vs-thread.png)

*Image: [ByteByteGo – Process vs Thread: Key Differences](https://bytebytego.com/guides/what-is-the-difference-between-process-and-thread/).*

---

## User-level vs kernel-level threads

| Type | Managed by | Pros | Cons |
|------|------------|------|------|
| **User-level** | User-space library (e.g. pthreads before 1:1). | Fast create/switch; no kernel changes. | One blocking call blocks whole process; cannot use multiple CPUs without kernel support. |
| **Kernel-level** | Kernel (scheduler sees threads). | Blocking in one thread does not block others; can use multiple CPUs. | Heavier create/switch; kernel involvement. |

Many modern OSs (including Linux) use a **1:1 model**: each user thread is a kernel schedulable entity (kernel thread). So you get kernel-level benefits with a user API (e.g. pthreads).

---

## Multithreading models

| Model | Idea | Mapping |
|-------|------|--------|
| **Many-to-one** | Many user threads → one kernel thread. | One thread blocks → whole process blocks. |
| **One-to-one** | One user thread → one kernel thread. | Good concurrency and scalability; more kernel overhead. (Linux default.) |
| **Many-to-many** | Many user threads → many (fewer) kernel threads. | Flexibility; scheduler can multiplex. |

Linux exposes 1:1; other models are sometimes implemented in user-space libraries or runtimes.

---

## Benefits of multithreading

- **Responsiveness** — One thread can block on I/O while others keep the program responsive (e.g. GUI).
- **Resource sharing** — Threads share memory and files by default; no need for IPC for in-process data.
- **Economy** — Creating and switching threads is cheaper than processes.
- **Scalability** — On multi-CPU systems, threads can run in parallel and use more cores.

---

## Linux: threads and pthreads

Linux implements threads as processes that share the same virtual address space (same PID in the kernel’s view in some implementations; in practice you see threads as separate entries in `/proc` and in `ps` with the same PID or a thread group ID). The standard API is **POSIX threads (pthreads)**.

```bash
# Threads of a process (Linux: same TGID, different PIDs or shown as threads)
ps -T -p <PID>
ps -eLf | head -20

# Top with threads
top -H -p <PID>

# Number of threads of process
cat /proc/<PID>/status | grep Threads
```

Example (conceptual) in C: create threads with `pthread_create`, join with `pthread_join`, protect shared data with `pthread_mutex_lock`/`unlock`.

---

## Summary

- **Thread** = execution flow inside a process; shares process memory; has own stack and registers.
- **User-level** threads: managed in user space; **kernel-level**: OS schedules them. **1:1** (one user thread = one kernel thread) is common on Linux.
- **Models**: many-to-one, one-to-one, many-to-many; Linux uses 1:1.
- Benefits: responsiveness, sharing, economy, scalability.
- On Linux: threads are visible in `ps -T`, `top -H`, `/proc/<PID>/status`; programming via **pthreads**.

---

## Further reading

**Official Linux documentation**

- [Linux man pages: pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html) — POSIX threads on Linux.
- [Linux kernel: Process management](https://docs.kernel.org/scheduler/index.html) — Kernel view of tasks and threads.

**Concepts and tutorials**

- [Thread in Operating System](https://www.geeksforgeeks.org/operating-systems/thread-in-operating-system/)
- [User-level vs Kernel-level threads](https://www.geeksforgeeks.org/operating-systems/difference-between-user-level-thread-and-kernel-level-thread/)
- [Process-based vs Thread-based Multitasking](https://www.geeksforgeeks.org/operating-systems/process-based-and-thread-based-multitasking/)
- [Multithreading Models](https://www.geeksforgeeks.org/operating-systems/multi-threading-models-in-process-management/)
- [Benefits of Multithreading](https://www.geeksforgeeks.org/operating-systems/benefits-of-multithreading-in-operating-system/)
- [Multithreading in OS](https://www.geeksforgeeks.org/operating-systems/multithreading-in-operating-system/)
