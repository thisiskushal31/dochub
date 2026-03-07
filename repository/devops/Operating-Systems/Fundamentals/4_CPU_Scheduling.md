# CPU scheduling (Process Management)

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **process schedulers**, **CPU scheduling**, **preemptive and non-preemptive scheduling**, **dispatcher vs scheduler**, **starvation and aging**, and scheduling algorithms — **OS-agnostic** (no platform-specific commands).

---

## 1. Process Schedulers and CPU Scheduling

### Why scheduling?

With one or a few CPUs and many ready processes, the OS must repeatedly decide:

- **Which** process gets the CPU next (**scheduling** — the policy).
- **When** to take the CPU away from the current process (**preemption** — optional, depending on policy).
- **How** to actually switch the CPU to the chosen process (**dispatching** — the mechanism, i.e. context switch).

The **scheduler** implements the policy (e.g. “run the one with highest priority,” “run each for one time slice in turn”). The **dispatcher** is the code that saves the current process’s context and loads the next one. Both are part of the kernel.

---

## 2. Dispatcher vs Scheduler

| Component | Role |
|-----------|------|
| **Scheduler** | Selects, from the ready queue(s), the process that should run next. This is **policy**: algorithm, priorities, fairness. |
| **Dispatcher** | After the scheduler has chosen a process, the dispatcher does the **mechanism**: context switch (save current, restore chosen, switch address space, jump to user mode). |

### Short-term, medium-term, and long-term schedulers

In a multi-level scheduling model, the OS may use **three** kinds of schedulers (not every OS has all three; the names are conceptual):

| Scheduler | Role | When it runs | What it decides |
|-----------|------|----------------|------------------|
| **Long-term (admission)** | Controls **how many jobs** are allowed into the system (into main memory). | When a **new job** is submitted. | Whether to **admit** the job into the set of processes competing for the CPU (and possibly how many to admit to balance load and multiprogramming level). |
| **Medium-term** | Controls **which processes** stay in main memory vs are **swapped out** (moved to disk). | Periodically or when memory is tight. | Which process to **swap out** (suspend) to free memory, or which **swapped** process to bring back. Reduces multiprogramming when memory is low. |
| **Short-term (CPU scheduler)** | Chooses **which ready process** runs next on the CPU. | On a **timer interrupt**, when a process **blocks**, or when a process **exits**. | Which process from the **ready queue** gets the CPU (the policy we call "CPU scheduling"). |

So: **long-term** = admission into the system; **medium-term** = swap in/out (memory pressure); **short-term** = which ready process runs next (the usual "scheduler" in scheduling chapters). The **dispatcher** works with the **short-term scheduler**: once the short-term scheduler has chosen a process, the dispatcher performs the context switch to it.

Flow of a job through the three levels (conceptual):

```
  New job submitted
         │
         ▼
  ┌──────────────────┐
  │ LONG-TERM        │  "Admit into system?" → into main memory (ready to compete)
  │ (admission)      │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐      ┌──────────────────┐
  │ MAIN MEMORY      │◄───► │ MEDIUM-TERM      │  Swap in/out when memory tight
  │ (ready processes)│      │ (swap in/out)    │
  └────────┬─────────┘      └──────────────────┘
           │ 
           ▼
  ┌──────────────────┐
  │ READY QUEUE      │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐     ┌──────────────────┐
  │ SHORT-TERM       │────►│ DISPATCHER       │  Pick one → context switch → run
  │ (CPU scheduler)  │     │ (mechanism)      │
  └──────────────────┘     └────────┬─────────┘
                                    │
                                    ▼
                              CPU (running)
```

**Dispatch latency** is the time from “decision to switch” to “new process actually running.” It is part of the overhead of preemptive multitasking.

![CPU scheduling overview](../../Assets/Operating-Systems/gfg-cpu-scheduling.png)

*Image: [CPU Scheduling in Operating Systems](https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/).*

---

## 3. Preemptive and Non-Preemptive Scheduling

| Type | When can the CPU be taken away from the running process? |
|------|----------------------------------------------------------|
| **Non-preemptive** | Only when the process **voluntarily** gives up the CPU: it blocks (e.g. I/O wait), terminates, or explicitly yields. Once running, it keeps the CPU until one of these happens. |
| **Preemptive** | The kernel can **take** the CPU away (e.g. on a timer interrupt). The process is moved to Ready; the scheduler picks another. So a process can be stopped in the middle of execution. |

Most general-purpose OSs use **preemptive** scheduling so that one process cannot monopolize the CPU. Real-time systems may use either, depending on the policy (e.g. non-preemptive for simplicity, or preemptive with priority inheritance to avoid priority inversion).

---

## 4. Scheduling criteria (what we optimize for)

Common metrics:

- **Throughput** — Number of processes completed per unit time.
- **Turnaround time** — Time from submission (arrival) to completion.
- **Waiting time** — Time the process spends in the ready queue (not running, not blocked).
- **Response time** — Time from submission until the process **first** runs (important for interactive use).
- **Fairness** — No process is starved (waits forever or disproportionately long).
- **Predictability / deadlines** — In real-time systems, meeting deadlines.

Different algorithms optimize different metrics. For example: FCFS minimizes context switches but can hurt response time; Round Robin improves response time but may increase turnaround; SJF minimizes average waiting time but can starve long jobs.

---

## 5. Scheduling algorithms (theory)

We assume a **ready queue** of processes (or threads) that are ready to run. “Burst” means the CPU time a process uses before it blocks (e.g. for I/O) or is preempted.

### First-Come, First-Served (FCFS)

- **Rule:** The process that has been in the ready queue longest runs next. Non-preemptive: once running, it runs until it blocks or finishes.
- **Pros:** Simple; no starvation.
- **Cons:** **Convoy effect**: one long job can delay everyone behind it. Poor for interactive use (long response times). No notion of priority or “short job first.”

### Shortest Job First (SJF)

- **Rule:** Among ready processes, run the one with the **smallest** (estimated) CPU burst next. Non-preemptive.
- **Optimal** for minimum average waiting time (provably, under the assumption that bursts are known and processes arrive at once). In practice, bursts are not known; they are estimated (e.g. exponential average of past bursts).
- **Cons:** Long jobs can **starve** if short jobs keep arriving. Not preemptive.

### Shortest Remaining Time Next (SRTN)

- **Rule:** Preemptive version of SJF. When a new process arrives or a process becomes ready again, compare **remaining** burst time of the current process with the new one. Run the one with the smallest remaining time.
- **Pros:** Good for average waiting time; responsive when short jobs arrive.
- **Cons:** Requires burst (or remaining burst) estimates; long jobs can still be delayed a lot.

### Round Robin (RR)

- **Rule:** Each process gets a fixed **time quantum** (e.g. 10–100 ms). When the quantum expires (timer interrupt), the running process is **preempted** and put at the **back** of the ready queue; the next process at the front runs.
- **Pros:** Fair; every ready process gets a share. Good **response time** for interactive use. No starvation.
- **Cons:** Many context switches if the quantum is small (overhead); if the quantum is large, approach FCFS and response time suffers. Turnaround time can be worse than SJF for batch-like workloads.

### Priority scheduling

- **Rule:** Each process has a **priority**. The scheduler runs the ready process with the **highest** priority. Can be preemptive (when a higher-priority process becomes ready, preempt the current one) or non-preemptive.
- **Pros:** Flexible; can favor important or interactive processes.
- **Cons:** **Starvation**: low-priority processes may never run if higher-priority ones keep arriving. **Aging** is often used: gradually increase the priority of processes that have waited a long time.

### Multilevel queue

- **Idea:** Several **queues**, each with its own policy (e.g. one queue for interactive, one for batch). Each process is assigned to a queue (e.g. by type or by priority). The scheduler chooses **between** queues (e.g. strict priority: always run from the highest-priority non-empty queue) and **within** a queue (e.g. Round Robin in the interactive queue, FCFS in the batch queue).
- **Multilevel feedback queue:** Processes can **move between** queues (e.g. if a process uses a lot of CPU, demote it to a lower-priority queue; if it blocks often, promote it). This approximates “short interactive jobs get good service; long CPU-bound jobs don’t monopolize.”

Real OSs use variants of priority + time-slicing (Round Robin within priority) and often multilevel feedback.

---

## 6. Starvation and Aging

- **Starvation:** A process never (or rarely) gets the CPU because the scheduling policy always prefers others (e.g. in pure priority scheduling, low-priority jobs never run if higher-priority ones are always present).
- **Aging:** Increase the priority (or effective priority) of processes that have been waiting a long time, so that eventually every process gets a chance. This is a common way to prevent starvation in priority-based systems.

---

## Summary

- The **scheduler** chooses which process runs next; the **dispatcher** performs the context switch. Scheduling is **policy**; dispatching is **mechanism**.
- **Preemptive** scheduling allows the kernel to take the CPU away (e.g. on a timer); **non-preemptive** only switches when the process blocks or yields.
- **Criteria:** throughput, turnaround, waiting time, response time, fairness. Different algorithms trade these off.
- **Algorithms:** FCFS (simple, convoy effect); SJF/SRTN (good waiting time, need burst estimates, starvation risk); Round Robin (fair, good response, quantum choice matters); Priority (flexible, need aging to avoid starvation); Multilevel (and multilevel feedback) for mixing classes of jobs.
- **Starvation** = a process never runs; **aging** = increase priority over wait time to prevent it.

This is **operating system basics**. How a particular OS implements the scheduler (e.g. CFS in Linux, the Windows scheduler) is covered in the [Linux](../Linux/README.md) and [Windows](../Windows/README.md) sections.

---

## Further reading

- [CPU Scheduling in Operating Systems](https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/)
- [Preemptive and Non-Preemptive Scheduling](https://www.geeksforgeeks.org/operating-systems/preemptive-and-non-preemptive-scheduling/)
- [Difference between Dispatcher and Scheduler](https://www.geeksforgeeks.org/operating-systems/difference-between-dispatcher-and-scheduler/)
- [Starvation and Aging](https://www.geeksforgeeks.org/operating-systems/starvation-and-aging-in-operating-systems/)
