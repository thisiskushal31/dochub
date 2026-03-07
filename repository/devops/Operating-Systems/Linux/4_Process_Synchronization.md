# Process synchronization (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process synchronization](../Fundamentals/6_Process_Synchronization.md). Here: **how Linux** provides synchronization (futex, POSIX semaphores, file locks, pipes, IPC) and **commands** (e.g. FIFOs, lsof).

---

## Race condition and critical section

- **Critical section** — Code that uses shared data or resources; only one process (or thread) should be in it at a time.
- **Race condition** — Two or more processes in (or entering) the critical section at once; outcome is non-deterministic and often wrong.

Synchronization aims to ensure **mutual exclusion**: at most one process in the critical section.

---

## Requirements for a solution

A good solution to the critical-section problem usually provides:

1. **Mutual exclusion** — Only one process in the critical section at a time.
2. **Progress** — If no process is in the critical section and some want to enter, one of them eventually gets in.
3. **Bounded waiting** — A process that wants to enter will eventually do so after a bounded number of others have entered (no starvation).

---

## Synchronization primitives (concepts)

| Primitive | Idea | Typical use |
|-----------|------|-------------|
| **Mutex (lock)** | Binary lock: acquire before entering critical section, release after. Only one holder. | Protect shared data structures. |
| **Semaphore** | Counter (or binary); wait (P) decrements, signal (V) increments. Block if counter would go negative. | Mutual exclusion, resource counting, signaling. |
| **Monitor** | Higher-level construct: procedures that run with mutual exclusion; condition variables for waiting/signaling. | Language-level (e.g. Java synchronized). |

Classic algorithms (Peterson’s, Dekker’s, Bakery) show that mutual exclusion can be done in software, but real systems use hardware support (e.g. atomic instructions) and OS primitives (mutex, semaphore).

---

## Mutex vs semaphore (brief)

- **Mutex** — One owner; often used for mutual exclusion only; the same thread must lock and unlock.
- **Semaphore** — No “owner”; any process can do V; can be used for counting (e.g. number of free slots) or signaling between processes.

So: use a **mutex** for simple “one at a time” critical sections; use a **semaphore** when you need counting or cross-process signaling.

---

## Classical IPC problems

These are textbook examples of synchronization:

| Problem | Idea |
|---------|------|
| **Producer–consumer** | Producers add to a buffer; consumers take from it. Bounded buffer needs empty/full signaling (e.g. semaphores). |
| **Readers–writers** | Many readers OK at once; writers need exclusive access. Variants: reader-preference, writer-preference, or fair. |
| **Dining philosophers** | N philosophers, N forks; need two forks to eat. Risk of deadlock if everyone takes one fork; solutions use ordering or extra synchronization. |

They illustrate design choices (fairness, starvation, deadlock) when coordinating processes.

---

## Inter-Process Communication (IPC)

Processes can coordinate or pass data via:

- **Shared memory** — A region mapped into multiple processes; fast but needs synchronization (mutex, semaphore).
- **Message passing** — Send/receive messages (e.g. pipes, sockets, message queues); no shared memory, but copying and system-call overhead.
- **Signals** — Simple notifications (e.g. kill, SIGTERM); not for bulk data.
- **Pipes and FIFOs** — Unidirectional byte streams (e.g. shell `|`).
- **Sockets** — Network or Unix domain; used for services and RPC.

Linux provides all of these; choice depends on latency, throughput, and complexity.

---

## Linux: mutexes, semaphores, and IPC

In user space you usually use:

- **Pthread mutex** — `pthread_mutex_lock` / `unlock` for threads.
- **POSIX semaphores** — `sem_init`, `sem_wait`, `sem_post` (named or unnamed).
- **File locking** — `flock`, `fcntl` F_SETLK for cross-process locking on files.
- **Pipes / FIFOs** — `pipe()`, `mkfifo()`; shell `|` and redirection.
- **Shared memory** — `shm_open`, `mmap` with MAP_SHARED.
- **Message queues** — POSIX or System V message queues.

**Named pipe (FIFO)** — One-way byte stream; one writer, one reader; kernel buffers. Good for simple producer–consumer between two processes.

```bash
# Named pipe (FIFO) example
mkfifo myfifo
echo "hello" > myfifo &   # writer (blocks until reader opens)
cat myfifo                # reader; receives "hello"
```

**File locking with flock** — Advisory lock on a file so only one process holds it at a time (e.g. cron jobs that must not overlap).

```bash
# In a script: acquire lock on /var/lock/myscript.lock; run only one instance
(
  flock -n 9 || exit 1
  # ... critical section: do work ...
) 9>/var/lock/myscript.lock
```

**How Linux implements mutex in kernel: futex** — User-space mutexes (e.g. pthread mutex) often use **futex** (fast userspace mutex): a shared integer in user memory plus the **futex** system call. When the lock is contended, the kernel blocks the thread and wakes it when the lock is released. This keeps the fast path in user space and only involves the kernel when blocking is needed.

---

## Summary

- **Critical section** = code using shared data; **race condition** = unsynchronized concurrent access.
- Solutions must provide **mutual exclusion**, **progress**, and **bounded waiting**.
- **Mutex** = single-owner lock; **semaphore** = counter for exclusion or signaling.
- Classical problems: producer–consumer, readers–writers, dining philosophers.
- **IPC**: shared memory + locks, message passing (pipes, sockets), signals.
- On Linux: pthread mutex, POSIX semaphores, `flock`, pipes, FIFOs, shared memory, message queues.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Locking](https://docs.kernel.org/locking/index.html) — Kernel locking (mutex, spinlock, etc.).
- [Linux man pages: sem_overview(7)](https://man7.org/linux/man-pages/man7/sem_overview.7.html), [pipe(7)](https://man7.org/linux/man-pages/man7/pipe.7.html), [pthreads(7)](https://man7.org/linux/man-pages/man7/pthreads.7.html) — POSIX semaphores, pipes, threads.

**Concepts and tutorials**

- [Introduction to Process Synchronization (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/introduction-of-process-synchronization/)
- [Race Condition](https://www.geeksforgeeks.org/operating-systems/race-condition-in-operating-systems/)
- [Critical Section](https://www.geeksforgeeks.org/operating-systems/critical-section-in-synchronization/)
- [Solutions to Critical Section Problem](https://www.geeksforgeeks.org/operating-systems/solutions-to-critical-section-problem/)
- [Semaphores](https://www.geeksforgeeks.org/operating-systems/semaphores-in-process-synchronization/)
- [Mutex vs Semaphore](https://www.geeksforgeeks.org/operating-systems/mutex-vs-semaphore/)
- [Classical IPC Problems](https://www.geeksforgeeks.org/operating-systems/classical-ipc-problems/)
- [Inter Process Communication (IPC)](https://www.geeksforgeeks.org/operating-systems/inter-process-communication-ipc/)
