# macOS: process synchronization

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process synchronization](../Fundamentals/6_Process_Synchronization.md). Here: **how macOS provides** synchronization — **Mach IPC**, **BSD pipes/semaphores**, and **pthreads**.

---

## How the system does it (deep level)

**Mach IPC:** Mach provides **message passing** between tasks: send/receive on **ports**. The kernel manages **port rights** (send, receive, send-once); messages can carry **out-of-line memory** (shared memory handoff). This is the low-level IPC used by many system frameworks. Synchronization is implicit: sending blocks until the message is received (or a timeout); receiving blocks until a message arrives. **Semaphores** and **lock sets** are also Mach primitives (kernel-managed); they can be used from user space via Mach APIs.

**BSD layer:** The **pipe** (`pipe()` syscall) is a unidirectional byte stream between two processes; the kernel buffers data and blocks reader when empty, writer when full. **POSIX semaphores** (`sem_open`, `sem_wait`, `sem_post`) are counting semaphores; the kernel maintains the count and wait queues. **POSIX shared memory** (`shm_open`, `mmap`) gives shared memory; synchronization between processes using that memory is done with semaphores or other primitives (not provided by the mapping itself).

**pthreads:** **Mutexes** (`pthread_mutex_*`), **condition variables** (`pthread_cond_*`), and **read-write locks** (`pthread_rwlock_*`) are the standard in-process synchronization. They are implemented in the **BSD** layer (kernel support for contention); they only work **within** one process (same address space). For **inter-process** synchronization, use Mach ports, pipes, or POSIX semaphores.

**References:** [Mach Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Mach/Mach.html), [BSD Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/BSD/BSD.html), POSIX semaphore and pthreads man pages.

---

## Commands and APIs (conceptual)

- **Pipes (shell):** `cmd1 | cmd2` — Shell creates a pipe; `cmd1` writes to stdout (pipe), `cmd2` reads from stdin (pipe). Blocking is kernel-managed.
- **Named pipe (FIFO):** `mkfifo myfifo` then `cat myfifo` (reader) and `echo hi > myfifo` (writer) — Same semantics as pipe; useful for shell scripts or ad-hoc IPC.
- **Programming:** Use **Mach** APIs (e.g. `mach_msg_*`) for ports; **POSIX** `sem_*` for semaphores; **pthread_mutex_***, **pthread_cond_*** for in-process locks and conditions.

---

## Summary

- **Mach:** **Message passing** (ports), **semaphores**, **lock sets**; kernel-managed blocking.
- **BSD:** **Pipes** (byte stream), **POSIX semaphores** (counting), **POSIX shared memory** (sync via other primitives).
- **pthreads:** **Mutexes**, **condition variables**, **rwlocks** — in-process only.

---

## Further reading

- [Mach Overview (Apple Kernel Programming Guide)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Mach/Mach.html)
- [BSD Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/BSD/BSD.html)
- `man sem_overview`, `man pthread_mutex_lock`, `man pipe`
