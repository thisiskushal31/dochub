# CPU scheduling (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: CPU scheduling](../Fundamentals/4_CPU_Scheduling.md). Here: **how Linux** schedules (CFS — Completely Fair Scheduler, nice, real-time classes) and the **commands** to inspect and influence priority.

---

## Why CPU scheduling?

With one or a few CPUs and many processes, the OS must:

- Choose which process to run (**scheduling**).
- Switch the CPU to that process (**dispatching**; part of context switch).

The **scheduler** implements the policy; the **dispatcher** does the actual switch.

---

## Preemptive vs non-preemptive scheduling

| Type | Idea | When the OS can switch |
|------|------|-------------------------|
| **Non-preemptive** | Process keeps CPU until it blocks or finishes. | Only when the running process gives up the CPU. |
| **Preemptive** | Kernel can take CPU away from a running process. | On timer interrupt, I/O completion, or higher-priority wake-up. |

Most general-purpose systems (including Linux) use **preemptive** scheduling so that one process cannot monopolize the CPU.

---

## Scheduling criteria

Typical goals:

- **Throughput** — Number of processes completed per unit time.
- **Turnaround time** — Time from submission to completion.
- **Waiting time** — Time spent in the ready queue.
- **Response time** — Time until first response (important for interactive use).
- **Fairness** — No process is starved.

Different algorithms trade off these goals (e.g. batch vs interactive).

---

## Common scheduling algorithms (concepts)

| Algorithm | Idea | Pros / cons |
|-----------|------|-------------|
| **FCFS** (First-Come, First-Served) | Run in arrival order. | Simple; convoy effect, poor for short jobs. |
| **SJF** (Shortest Job First) | Run the one with smallest burst next. | Good for throughput; long jobs can starve; burst often unknown. |
| **SRTN** (Shortest Remaining Time Next) | Preemptive SJF. | Good average waiting time; needs burst estimates. |
| **Round Robin (RR)** | Each process gets a small **time slice** (quantum); rotate. | Fair, good response; context-switch overhead if quantum is small. |
| **Priority** | Each process has a priority; higher priority runs first. | Flexible; low-priority can starve unless aging is used. |
| **Multilevel queues** | Several queues (e.g. foreground vs background); each may use a different policy. | Used in real OSs (e.g. interactive vs batch). |

Linux uses **priority-based**, **multiqueue** schedulers (CFS — Completely Fair Scheduler — in the default kernel) with time slices and nice values.

---

## Dispatcher vs scheduler

- **Scheduler** — Decides *which* process runs next (policy).
- **Dispatcher** — Does the actual switch: save current context, load next process’s context, switch to user mode.

The work the dispatcher does is part of the **context switch** cost.

---

## Starvation and aging

- **Starvation** — A process never (or rarely) gets the CPU because others are always preferred (e.g. in pure priority scheduling).
- **Aging** — Increase priority of waiting processes over time so that long-waiting jobs eventually get a chance. Many OSs use something like this to avoid starvation.

---

## Linux: priorities, nice, and policies

Linux exposes scheduling via:

- **Priority** — Numeric priority; kernel may use different ranges per scheduler class.
- **Nice value** — User-facing -20 (highest priority) to 19 (lowest). Default 0.
- **Scheduling class/policy** — e.g. normal (CFS), real-time (FIFO, RR), batch.

```bash
# Run with lower priority (higher nice = lower priority)
nice -n 19 ./heavy_script.sh

# Change nice of existing process
renice -n 10 -p <PID>

# View scheduling policy and priority
chrt -p <PID>
ps -o pid,ni,cls,comm -p <PID>
```

---

## Summary

- The **scheduler** picks the next process to run; the **dispatcher** performs the context switch.
- **Preemptive** scheduling allows the kernel to take the CPU back (e.g. after a time slice).
- Classic algorithms: FCFS, SJF, Round Robin, Priority; real systems use **multilevel** and **priority-based** schemes (e.g. Linux CFS).
- **Starvation** = a process rarely runs; **aging** helps prevent it.
- On Linux: **nice** and **renice** adjust priority; **chrt** and **ps** show policy and priority.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Process Scheduler](https://docs.kernel.org/scheduler/index.html) — CFS and scheduling in the kernel.
- [Linux man pages: nice(1)](https://man7.org/linux/man-pages/man1/nice.1.html), [chrt(1)](https://man7.org/linux/man-pages/man1/chrt.1.html) — Priority and scheduling policy.

**Concepts and tutorials**

- [CPU Scheduling in Operating Systems (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/)
- [Preemptive and Non-Preemptive Scheduling](https://www.geeksforgeeks.org/operating-systems/preemptive-and-non-preemptive-scheduling/)
- [Difference between Dispatcher and Scheduler](https://www.geeksforgeeks.org/operating-systems/difference-between-dispatcher-and-scheduler/)
- [Starvation and Aging](https://www.geeksforgeeks.org/operating-systems/starvation-and-aging-in-operating-systems/)
