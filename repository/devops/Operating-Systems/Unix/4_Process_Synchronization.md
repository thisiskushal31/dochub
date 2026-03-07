# Process synchronization (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process synchronization](../Fundamentals/6_Process_Synchronization.md). Here: **IPC** on Unix — at the **system level** — and the commands/APIs you use.

---

## How the system does it (deep level)

Unix offers several synchronization and IPC mechanisms; the **kernel** is involved in all of them so that blocking and waking are consistent with the scheduler.

**Pipes and FIFOs:** A **pipe** is a kernel-managed **buffer** with a read and a write end. When a process **writes** and the buffer is full, the writer **blocks** (sleeps on a kernel wait channel until space is available). When a process **reads** from an empty pipe, it **blocks** until data (or EOF) is available. The kernel tracks waiters and wakes them when the condition is satisfied. **FIFOs (named pipes)** are the same except they have a path in the file system so unrelated processes can open them. So at a deep level: the kernel holds the data and the wait queues; **blocking** = thread is put in a **sleep** state and removed from the run queue; **wakeup** = kernel puts the thread back on the run queue when data/space is available.

**POSIX semaphores:** A **semaphore** has an integer **count**. **sem_wait** (or equivalent) decrements the count; if it would go negative, the calling thread **blocks** (kernel puts it in a sleep state on a wait queue associated with the semaphore). **sem_post** increments the count and, if any thread is waiting, the kernel **wakes** one (or more, depending on implementation). **Named** semaphores (e.g. under `/dev/shm` on Linux) are kernel-persistent objects so multiple processes can attach by name. **Unnamed** (process-shared) semaphores live in **shared memory** (see below); the kernel still enforces the count and wait/wake when the semaphore is used across processes. So: the kernel enforces **mutual exclusion** or **counting** by blocking and waking threads; the process only sees the API (sem_wait / sem_post).

**Shared memory:** **POSIX** (`shm_open`, `mmap`) or **System V** (`shmget`, `shmat`) shared memory is a region of address space that multiple processes can map. The **kernel** allocates the backing (e.g. swap or a dedicated segment) and maps it into each process’s page tables. Synchronization **between** processes using that memory is not automatic — you use **semaphores** or **mutexes** in shared memory (process-shared) so that the kernel can block/wake waiters. So at a deep level: shared memory is **kernel-managed** mapping of the same physical (or swap-backed) pages into multiple address spaces; **synchronization** on that memory is done via other kernel objects (semaphores, etc.).

**Signals:** The kernel **delivers** signals to a process or thread; the target may be **blocked** in a syscall (e.g. read on a pipe). When a signal is delivered, the kernel can **interrupt** the blocked call (EINTR) or run a signal handler. Signals are a **notification** mechanism, not a full mutex/semaphore; they are used for simple coordination (e.g. “reload config”) or process control (SIGTERM, SIGKILL).

**References:** [POSIX sem_overview (semaphores)](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/semaphore.h.html), [shm_overview (Linux man)](https://man7.org/linux/man-pages/man7/shm_overview.7.html) — concepts apply across POSIX systems.

---

## IPC on Unix (commands and APIs)

Unix provides **pipes** (anonymous), **FIFOs** (named pipes), **System V** and **POSIX** semaphores and shared memory, **signals**, and **sockets**. **Pipes** and **FIFOs** are common for producer-consumer; **semaphores** and **shared memory** for structured synchronization.

---

## Pipes and FIFOs

```bash
# Anonymous pipe
cmd1 | cmd2

# Named pipe (FIFO)
mkfifo myfifo
echo "data" > myfifo &
cat myfifo
```

---

## Summary

- **Pipes** (|) and **FIFOs** (mkfifo) for byte streams.
- **Semaphores** and **shared memory** via POSIX or System V APIs (C).
- **Signals** for simple notifications.

---

## Further reading

- [POSIX semaphore.h (Open Group)](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/semaphore.h.html) — Semaphore semantics.
- [shm_overview(7) (Linux man)](https://man7.org/linux/man-pages/man7/shm_overview.7.html) — Shared memory; concepts apply to Unix/POSIX.
- [GeeksforGeeks: IPC](https://www.geeksforgeeks.org/inter-process-communication-ipc/)
- [POSIX semaphores and shared memory](https://pubs.opengroup.org/onlinepubs/9699919799/)
