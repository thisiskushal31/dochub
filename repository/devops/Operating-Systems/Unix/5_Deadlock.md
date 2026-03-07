# Deadlock (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Deadlock](../Fundamentals/7_Deadlock.md). Here: how **deadlock** appears on Unix and how to detect or prevent it in your code (lock ordering, timeouts).

---

## How the system handles deadlock (deep level)

The kernel does **not** detect or break user-level deadlocks. When a thread **blocks** on a lock (e.g. **sem_wait**, **pthread_mutex_lock**, or **flock**), it is put in a **sleep** state on a wait queue; the kernel has no notion of a wait cycle. So **deadlock avoidance** is the application's responsibility: **lock ordering**, **trylock** with timeout, or design that avoids circular wait. As an admin you can **observe** (e.g. `ps` for state **D**, or **kdump**/kernel debugger) and **recover** by terminating a process.

---

## Deadlock on Unix (concepts and commands)

Deadlock occurs when two or more processes (or threads) wait for each other’s resources. On Unix, this can involve **file locks** (flock, fcntl), **semaphores**, **mutexes** (pthreads), or **kernel locks**. Prevention: **lock ordering**, **trylock** with timeout, avoid holding multiple locks.

![Deadlock: conditions, prevention, and recovery](../../Assets/Operating-Systems/bytebytego-deadlock.png)

*Image: [ByteByteGo – What is a Deadlock?](https://bytebytego.com/guides/what-is-a-deadlock/).*

---

## Finding blocked processes

```bash
# Processes in wait state (e.g. D or S)
ps aux | awk '$8 ~ /D/'

# Stack trace (if debugger or /proc available)
# On BSD: kdump, or kernel debugger
```

---

## Summary

- **Deadlock** = circular wait; prevent with lock ordering and timeouts.
- On Unix: **file locks**, **pthread mutexes**, **semaphores**; use **trylock** and consistent ordering.

---

## Further reading

- [GeeksforGeeks: Deadlock](https://www.geeksforgeeks.org/operating-systems/introduction-of-deadlock-in-operating-system/)
- [ByteByteGo – What is a Deadlock?](https://bytebytego.com/guides/what-is-a-deadlock/)
