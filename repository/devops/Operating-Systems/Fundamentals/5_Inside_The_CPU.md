# Inside the CPU

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

The **CPU** is the hardware that executes instructions. Understanding its components and how instructions flow (fetch, decode, execute) and how **pipelining** and **parallelism** work helps explain why **context switches** are costly and how the OS interacts with the CPU (interrupts, traps). This topic is **OS-agnostic**: generic CPU architecture and instruction life cycle.

---

## Why this matters for the OS

The OS **schedules** processes on the CPU. It does not execute instructions itself; the CPU does. So:

- **Context switch cost** — Saving and restoring registers, flushing or invalidating caches and TLB, and pipeline stalls all add up. The OS tries to avoid switching too often.
- **Interrupts and exceptions** — The CPU responds to interrupts (timer, I/O) and exceptions (page fault, illegal instruction) by switching to kernel code. The OS’s handlers are the entry points for scheduling, I/O completion, and fault handling.
- **Atomicity and ordering** — The OS relies on **atomic** instructions (e.g. test-and-set, compare-and-swap) and memory ordering for synchronization. These are defined by the CPU architecture.

So “inside the CPU” is not just computer architecture; it sets the rules for how the OS can use the hardware.

---

## CPU components (simplified)

A typical CPU includes:

| Component | Role |
|------------|------|
| **Control unit** | Fetches instructions, decodes them, and issues control signals to the rest of the CPU. Coordinates the datapath. |
| **ALU (Arithmetic Logic Unit)** | Performs arithmetic (add, subtract, etc.) and logic (and, or, shift). Operands come from registers or from memory. |
| **Registers** | Small, very fast storage inside the CPU: **general-purpose** (e.g. for operands and results), **PC** (program counter), **SP** (stack pointer), **status** (flags: zero, carry, etc.). The kernel saves and restores these on a context switch. |
| **Cache** | Small, fast memory (L1, L2, L3) holding copies of recently used code and data. Reduces latency to main memory. When the OS switches processes, the cache may still hold the old process’s data (cache “pollution”) until it is replaced; that can hurt the new process’s performance. |
| **MMU (Memory Management Unit)** | Translates **virtual** addresses to **physical** addresses using the page tables the kernel sets up. On a context switch, the kernel switches the page-table base (and possibly flushes the TLB), so the same virtual address in the new process maps to different physical memory. |

The CPU executes instructions one (or several, in a pipeline) at a time, using these components. The OS sees the CPU as the thing that runs user code until an **interrupt**, **exception**, or **system-call** trap occurs; then the CPU runs kernel code.

---

## Instruction life cycle

A single instruction typically goes through:

1. **Fetch** — The CPU reads the instruction at the address in the **PC** from memory (or from the instruction cache). The PC is then advanced (e.g. PC += 4 for the next instruction, or the target for a branch).
2. **Decode** — The control unit decodes the instruction: what operation (add, load, branch, etc.) and which registers or memory addresses are involved.
3. **Execute** — The ALU or other unit performs the operation (e.g. add two registers, compute a memory address). For a load or store, the CPU may translate the virtual address (MMU) and access the data cache or main memory.
4. **Memory access** (if needed) — For load/store, read or write data to/from cache or memory.
5. **Write-back** (if needed) — Write the result to a register (or memory).

This is the **instruction life cycle**. In a simple CPU, one instruction completes before the next starts. In a **pipelined** CPU, multiple instructions are in flight at once (one in fetch, one in decode, one in execute, etc.), so throughput is higher even though each instruction still takes several cycles.

```
  Instruction life cycle (single instruction):
  PC → [ Fetch ] → [ Decode ] → [ Execute ] → [ Mem access ] → [ Write-back ] → done

  Pipelined (simplified): multiple instructions in flight
  Time ─────────────────────────────────────────────────────────────►
  Instr 1   [Fetch][Decode][Exec][Mem ][WB  ]
  Instr 2        [Fetch][Decode][Exec][Mem ][WB  ]
  Instr 3             [Fetch][Decode][Exec][Mem ][WB  ]
  Instr 4                  [Fetch][Decode][Exec][Mem ]...
  → Throughput: one instruction completes per cycle (after pipeline is full).
  → Context switch: pipeline may be flushed; cost is many cycles.
```

---

## Pipelining and parallelism

**Pipelining** — Overlap the stages of different instructions. While instruction N is in “execute,” instruction N+1 is in “decode” and N+2 is in “fetch.” So the CPU can complete (in the best case) one instruction per cycle, even though each instruction takes several cycles from start to finish. **Hazards** (data dependency, control flow) can cause stalls or require forwarding; the CPU and compiler try to minimize them.

**Parallelism** — Modern systems have **multiple cores** (or hardware threads). Each core can run a different process (or thread) at the same time. The OS **scheduler** assigns runnable processes to cores. So “inside the CPU” from the OS perspective also means: there are several CPUs (cores), each with its own pipeline and caches; the OS must use them effectively and respect **cache coherence** and **memory ordering** when processes share data (via synchronization primitives).

**Why this matters for the OS:** Context switching causes **pipeline flushes** and **cache effects**. The OS tries to keep processes on the same core when beneficial (affinity) and to avoid switching too frequently. Interrupts and exceptions are the hardware mechanism that hands control to the kernel; the kernel’s handlers are part of “how the OS works” with the CPU.

---

## Summary

- The **CPU** fetches, decodes, and executes instructions; it has a control unit, ALU, registers, caches, and an MMU. The OS schedules processes on the CPU and relies on traps (system calls, interrupts, exceptions) to run kernel code.
- **Instruction life cycle:** Fetch → Decode → Execute → (Memory) → Write-back. Pipelining overlaps these stages across instructions to improve throughput.
- **Parallelism:** Multiple cores run multiple threads/processes concurrently. The OS scheduler assigns work to cores; context switches have a cost (registers, TLB, cache, pipeline).
- This is **how the operating system’s world interacts with the CPU** — not Linux or Windows specific. For how the OS decides *which* process runs next, see [CPU scheduling](./3_CPU_Scheduling.md).

---

## Further reading

- Computer architecture references (e.g. Hennessy & Patterson) for detailed CPU design.
- OS texts (e.g. Silberschatz, Tanenbaum) for context switch cost and interrupt handling.
