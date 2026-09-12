# Threads and concurrency (Multithreading)

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **threads**: thread vs process, user-level vs kernel-level threads, multithreading models, and benefits — **OS-agnostic** (no platform-specific APIs).


---

## 1. Thread in Operating System / Process vs thread

| Aspect | Process | Thread |
|--------|---------|--------|
| **Definition** | Program in execution; unit of resource ownership and protection. | Unit of execution **within** a process; shares the process’s address space. |
| **Address space** | Has its **own** (isolated). | **Shares** with other threads of the same process (code, data, heap); typically has its **own stack**. |
| **Resources** | Own file descriptors, PID, etc. | Shares process resources; has its own thread ID, stack, and register state. |
| **Creation / context switch** | Heavier (new address space, kernel structures). | Lighter (same address space; only stack and registers). |
| **Communication** | IPC (pipes, shared memory, messages). | **Shared memory** (same address space); requires synchronization (mutex, etc.). |
| **Failure** | One process crashing does not directly kill others. | A bug in one thread (e.g. wild write) can corrupt shared memory and crash the whole process. |

So: a **process** is a container for resources and protection; a **thread** is a schedulable flow of execution inside that container. One process can have many threads; the kernel (or a runtime) schedules threads (or processes that are “thread-like”) on the CPU(s).

---

## 2. Benefits of Multithreading / Why threads?

- **Responsiveness** — One thread can block (e.g. on I/O) while others keep the program responsive (e.g. GUI stays active).
- **Resource sharing** — Threads share memory by default; no need for explicit IPC for in-process data (but need synchronization).
- **Economy** — Creating and switching threads is cheaper than creating and switching processes (no new address space, no new kernel “process” in the heavy sense, depending on the model).
- **Scalability** — On a multi-CPU system, threads of the same process can run on different CPUs in parallel.

---

## 3. User-level vs Kernel-level threads

**Kernel-level threads** (kernel-supported threads):

- The **kernel** is aware of each thread. Each thread is a schedulable entity (the kernel has a structure for it, it can be in ready/blocked state, it can be scheduled on a CPU).
- **Pros:** When one thread blocks (e.g. on I/O), the kernel can run another thread of the same process. Threads can run in parallel on multiple CPUs. The kernel can schedule threads fairly with other processes.
- **Cons:** Every thread operation (create, switch, sync) may involve a **system call** or kernel intervention; context switch between threads has kernel overhead.

**User-level threads** (user-space threads, green threads):

- The **kernel** sees only one process (one schedulable entity). A **user-level runtime** (library) multiplexes many “threads” onto that one kernel entity. The runtime maintains its own thread table, stacks, and scheduler; it switches between threads in user space (no kernel call for the switch).
- **Pros:** Very fast create and switch (no system call); the runtime can tailor the scheduler to the application; portability (same library on different OSs).
- **Cons:** **Blocking:** If one user-level thread makes a **blocking system call** (e.g. read()), the **whole process** blocks — the kernel does not know there are other runnable user-level threads. So either (1) all system calls must be non-blocking or wrapped (e.g. async I/O), or (2) the runtime must use multiple kernel entities (e.g. a pool of kernel threads) to run user-level threads. **Parallelism:** On a multi-CPU system, user-level threads alone cannot run in parallel unless the runtime maps them to multiple kernel entities.

**Hybrid:** Many systems use **kernel-level** threads as the only schedulable unit but expose a **user-level** API (e.g. “thread” = one kernel thread, or many user threads mapped to a pool of kernel threads). The 1:1 model (one user thread = one kernel thread) is common in modern OSs: simple, good parallelism and blocking behavior.

---

## 4. Multithreading Models

How many **user-level** threads map to how many **kernel-level** threads?

| Model | Mapping | Pros | Cons |
|-------|--------|------|------|
| **Many-to-one** | Many user threads → one kernel thread | Fast switching in user space. | One blocking call blocks all; no parallelism. |
| **One-to-one** | One user thread → one kernel thread | Blocking and parallelism as expected. | More kernel overhead (one kernel structure per thread). |
| **Many-to-many** | Many user threads → many (fewer) kernel threads | Flexibility: many user threads, moderate kernel cost; scheduler can multiplex. | More complex; blocking still requires care (which user thread is running on which kernel thread). |

**Two-level:** Like many-to-many, but some user threads can be **bound** to a dedicated kernel thread (so they get true parallelism and no multiplexing). Combines flexibility with the ability to give important threads their own kernel entity.

---

## Summary

- A **thread** is a flow of execution within a process; it shares the process’s address space and resources but has its own PC, registers, and stack.
- **Process** = resource container; **thread** = schedulable execution unit inside it. Threads allow concurrency and parallelism with less overhead than multiple processes but require synchronization for shared data.
- **Kernel-level threads:** Kernel schedules them; blocking and multi-CPU work well; more kernel overhead. **User-level threads:** Runtime in user space multiplexes them; fast switch, but blocking and parallelism require care (wrapped calls or mapping to kernel threads).
- **Models:** Many-to-one (one kernel thread); one-to-one (each user thread = one kernel thread); many-to-many (multiplexed). Modern OSs often use **1:1**.

This is **operating system basics**. How a particular OS implements threads (e.g. clone() in Linux, Windows threads) is covered in the [Linux](../Linux/README.md) and [Windows](../Windows/README.md) sections.

---

## Further reading

- [Thread in Operating System](https://www.geeksforgeeks.org/operating-systems/thread-in-operating-system/)
- [User-level vs Kernel-level threads](https://www.geeksforgeeks.org/operating-systems/difference-between-user-level-thread-and-kernel-level-thread/)
- [Process-based vs Thread-based Multitasking](https://www.geeksforgeeks.org/operating-systems/process-based-and-thread-based-multitasking/)
- [Multithreading Models](https://www.geeksforgeeks.org/operating-systems/multi-threading-models-in-process-management/)
- [Benefits of Multithreading](https://www.geeksforgeeks.org/operating-systems/benefits-of-multithreading-in-operating-system/)
- [Multithreading in OS](https://www.geeksforgeeks.org/operating-systems/multithreading-in-operating-system/)
