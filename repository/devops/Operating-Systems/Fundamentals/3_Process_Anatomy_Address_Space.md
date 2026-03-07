# Process anatomy: address space and execution

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Process and PCB](./2_Process_And_PCB.md). Here we focus on **what a process looks like in memory**: the layout of its address space (text, data, heap, stack) and how **execution** uses the stack and heap. This is **OS-agnostic** — the same ideas apply to any OS that gives each process a virtual address space.

---

## Program vs process (recap)

- **Program** — Static: the executable file on disk (code and data as specified by the format, e.g. ELF, PE). It is not running; it is just a recipe.
- **Process** — Dynamic: an **instance** of that program **in execution**. The OS has created a PCB, allocated an address space, loaded (or mapped) the program’s code and data into that space, set the program counter and stack pointer, and is scheduling the process. So: one program, many possible processes (many instances).

When we say “anatomy of a process,” we mean the **layout of the process’s address space** and how the CPU uses it during execution.

---

## Address space layout (typical)

Each process has its **own** virtual address space. The OS and MMU ensure that one process cannot read or write another’s addresses. Within that space, a typical layout (conceptually; exact order and addresses are OS/ABI-specific) looks like:

```
  High addresses
  +------------------+
  |  Kernel (mapped   |  ← Often in every process’s address space for syscall entry; not accessible in user mode
  |  in each process) |
  +------------------+
  |  Stack            |  ← Grows downward. Local variables, return addresses, saved frame pointers.
  |  (grows down)     |
  |  ...              |
  +------------------+
  |  (free)           |
  +------------------+
  |  Heap             |  ← Grows upward. Dynamic allocation (malloc, new). Managed by process + OS (sbrk, mmap).
  |  (grows up)       |
  +------------------+
  |  BSS              |  ← Uninitialized static / global data (zero-initialized).
  +------------------+
  |  Data             |  ← Initialized static / global data (from executable).
  +------------------+
  |  Text (code)      |  ← Read-only program instructions (from executable).
  Low addresses
  +------------------+
```

- **Text** — The machine code. Read-only; shared across processes if the same program is run multiple times (same file mapped read-only).
- **Data** — Initialized global and static variables. Loaded from the executable.
- **BSS** — Uninitialized global/static (or zero-initialized). The OS zeros this at load time; it is not stored in the file.
- **Heap** — Dynamically allocated memory (malloc, free; or new/delete). Grows upward. The process requests more from the kernel (e.g. sbrk or mmap); the kernel allocates virtual pages and backs them with physical pages (or swap).
- **Stack** — One per thread. Used for local variables, return addresses, and saved registers during function calls. Grows **downward**. The OS sets a limit (stack size); exceeding it causes a fault (stack overflow).

The **kernel** sets up this layout when it **loads** the program (or when it creates a process via fork and then the child does exec). The exact regions and permissions (read/write/execute) are defined by the executable format and the OS loader.

---

## Process execution and the stack

When the CPU executes a process, the **program counter (PC)** points into the **text** region. When the process calls a function:

1. Arguments and return address are pushed onto the **stack** (or passed in registers with spill to stack).
2. The stack pointer (SP) moves (down on typical architectures).
3. Local variables of the function live on the stack (or in registers).
4. When the function returns, the return address is popped and the PC is set to it; the stack frame is discarded.

So **process execution** is: fetch instruction from **text**, decode, execute (possibly read/write **data**, **heap**, or **stack**), update PC (and SP when calling/returning). The OS does not interpret instructions; it just gives the process an address space and CPU time. The **stack** is central to procedure calls and to the kernel when it needs to save/restore the process’s context (context switch).

---

## The heap

The **heap** is for **dynamic** allocation: the program asks for a block of memory at runtime (malloc, new) and frees it later (free, delete). The **runtime** (libc, language runtime) maintains free lists or similar structures inside the heap and requests more memory from the OS when needed (e.g. sbrk or mmap). The **kernel** allocates **virtual pages** to the process; the process’s heap manager subdivides those pages into smaller objects. So: **heap** = region of the address space; **allocation** = cooperation between process code (malloc) and kernel (give more pages).

---

## Data section

The **data** section holds **initialized** global and static variables. Their initial values are stored in the executable and loaded into memory when the process is created. The **BSS** section holds **uninitialized** (or zero-initialized) globals/statics; the loader just zeros that region. Both are fixed in size at load time (unlike heap and stack, which grow).

---

## Summary

- **Program** = static executable. **Process** = running instance with its own address space and PCB.
- **Address space layout:** Text (code) → Data → BSS → Heap (grows up) → … → Stack (grows down). Exact layout is OS/ABI-specific.
- **Execution:** PC in text; stack used for calls, returns, and locals; heap used for dynamic allocation. The kernel provides the pages; the process uses them according to this layout.
- This **anatomy** is how the OS and the hardware together give each process an isolated, structured environment in which to run. For PCB, states, and context switch see [Process and PCB](./2_Process_And_PCB.md).

---

## Further reading

- [Process in Operating System](https://www.geeksforgeeks.org/operating-systems/process-in-operating-system/)
- [Process Control Block](https://www.geeksforgeeks.org/operating-systems/process-control-block-in-os/)
