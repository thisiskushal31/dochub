# Deadlock (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Deadlock](../Fundamentals/7_Deadlock.md). Here: how deadlock shows up on Linux (D state, lockdep), and commands to find blocked processes and apply prevention (lock ordering, timeouts) in your code.

A **deadlock** occurs when two or more processes (or threads) are each waiting for a resource held by another, so none can make progress. This topic defines deadlock, explains how to prevent or detect it, and briefly covers recovery and the Banker’s algorithm.

---

## What is deadlock?

**Deadlock** — A set of processes is deadlocked if every process in the set is waiting for an event or resource that only another process in the set can provide. None of them can proceed.

Example: Process A holds resource 1 and wants resource 2; Process B holds resource 2 and wants resource 1. Both wait forever.

![Deadlock: conditions, prevention, and recovery](../../Assets/Operating-Systems/bytebytego-deadlock.png)

*Image: [ByteByteGo – What is a Deadlock?](https://bytebytego.com/guides/what-is-a-deadlock/).*

---

## Necessary conditions for deadlock

All four must hold for a deadlock to be possible (Coffman conditions):

| Condition | Meaning |
|-----------|--------|
| **Mutual exclusion** | Resources cannot be shared; only one process can hold a resource at a time. |
| **Hold and wait** | A process holds some resources and waits for more. |
| **No preemption** | Resources cannot be forcibly taken away; the process must release them. |
| **Circular wait** | There is a cycle in the “wait-for” graph (e.g. A waits for B, B waits for C, C waits for A). |

If we break any one of these, deadlock can be prevented (in theory). In practice, prevention is often hard; detection and recovery or avoidance (e.g. Banker’s) are used.

---

## Deadlock vs starvation vs livelock

| Term | Meaning |
|------|--------|
| **Deadlock** | Processes block forever, each waiting for another in the set. |
| **Starvation** | A process is repeatedly denied resources (e.g. CPU) so it never (or rarely) runs; others keep getting preference. |
| **Livelock** | Processes keep changing state but make no real progress (e.g. two processes repeatedly yielding to each other). |

---

## Handling deadlocks: overview

| Approach | Idea |
|----------|------|
| **Prevention** | Design so that one of the four necessary conditions never holds (e.g. request all resources upfront, impose ordering). |
| **Avoidance** | Before granting a resource, check if that could lead to an unsafe state; grant only if safe (e.g. Banker’s algorithm). |
| **Detection** | Let deadlocks occur, then detect them (e.g. via a wait-for graph) and trigger recovery. |
| **Recovery** | After detection: abort one or more processes, or preempt resources and roll back. |

Many systems use a mix: prevention where easy (e.g. lock ordering), detection and recovery where prevention is too costly.

---

## Resource Allocation Graph (RAG)

The **resource allocation graph** has:

- **Process** nodes and **resource** nodes (often with one dot per instance).
- **Request** edge: process → resource (process wants it).
- **Assignment** edge: resource → process (process holds it).

A **cycle** in the graph is a necessary condition for deadlock (assuming single-instance resources). For multi-instance resources, cycle + no way to satisfy all requests implies deadlock.

---

## Banker’s algorithm (avoidance)

The **Banker’s algorithm** is a deadlock-**avoidance** method:

- Each process declares its **maximum** need for each resource type.
- Before granting a request, the system checks whether the resulting state would be **safe** (i.e. there exists a sequence in which all processes can finish).
- A request is granted only if it leaves the system in a safe state.

It avoids deadlock but requires known max needs and can be conservative (denies some requests that would not actually deadlock).

---

## Deadlock detection and recovery

**Detection:** Build the wait-for graph (who is waiting for whom). If there is a cycle, there is a deadlock. Run this periodically or on each request.

**Recovery options:**

- **Abort** one or more deadlocked processes (simplest; may need restart).
- **Preempt** resources: take a resource from a process (rollback or retry) and give it to another so the system can progress.

---

## Linux: finding and dealing with deadlocks

Kernel and user-space deadlocks show up as processes or threads stuck in “D” (uninterruptible sleep) or blocked in locks. Tools help inspect state:

```bash
# Processes in uninterruptible sleep (often I/O or kernel wait)
ps aux | awk '$8 ~ /D/'

# Kernel lock dependency and lockdep (kernel config)
# CONFIG_LOCKDEP=y for lock dependency checker

# User-space: strace to see where a process is blocked
strace -p <PID>

# List open files and sockets (see what resource might be held)
lsof -p <PID>
```

Prevention in your own code: use a **consistent lock ordering**, avoid holding multiple locks when possible, use timeouts (e.g. trylock) where appropriate.

---

## Summary

- **Deadlock** = set of processes each waiting for another in the set; no one can proceed.
- **Four conditions**: mutual exclusion, hold and wait, no preemption, circular wait.
- **Handling**: prevention (break one condition), avoidance (Banker’s), detection + recovery.
- **RAG** models who holds and who wants what; cycles indicate possible deadlock.
- On Linux: look for “D” state, use `strace`, `lsof`; in code, use lock ordering and trylock/timeouts.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Locking](https://docs.kernel.org/locking/index.html) — Kernel locking and deadlock avoidance.

**Concepts and tutorials**

- [Introduction of Deadlock (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/introduction-of-deadlock-in-operating-system/)
- [Handling Deadlocks](https://www.geeksforgeeks.org/operating-systems/handling-deadlocks/)
- [Deadlock Prevention](https://www.geeksforgeeks.org/operating-systems/deadlock-prevention/)
- [Banker’s Algorithm](https://www.geeksforgeeks.org/operating-systems/bankers-algorithm-in-operating-system-2/)
- [Deadlock Detection and Recovery](https://www.geeksforgeeks.org/operating-systems/deadlock-detection-recovery/)
- [Deadlock, Starvation, Livelock](https://www.geeksforgeeks.org/operating-systems/deadlock-starvation-and-livelock/)
- [Resource Allocation Graph (RAG)](https://www.geeksforgeeks.org/operating-systems/resource-allocation-graph-rag-in-operating-system/)
