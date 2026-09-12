# macOS: memory management

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Memory management](../Fundamentals/9_Memory_Management.md). Here: **how macOS implements** memory — **Mach virtual memory**, **address spaces**, **VM objects**, and **tools** (`vm_stat`, Activity Monitor).

---

## How the system does it (deep level)

**Virtual memory:** XNU’s VM system comes from **Mach**. Physical memory is treated as a **cache** for virtual memory. Each **task** (address space) has a **map** of **virtual memory regions**; each region is backed by a **VM object** (or **memory object**). VM objects can be backed by:
- **Anonymous** memory (swap/pager) — for heap, stack.
- **File** (vnode pager) — for mapped files.
- **Device** — for device memory.

**Key structures:** **Address space** = map of regions. **VM object** = machine-independent description of a range of virtual pages (backing store, copy-on-write, etc.). **Pmap** = machine-dependent layer: page tables, TLB, virtual-to-physical mapping. The kernel uses **page faults** to populate physical pages on demand (**demand paging**); when memory is tight, a **pager** (e.g. default pager) writes pages to **swap** (e.g. `/private/var/vm/swapfile*` on macOS).

**Protection and inheritance:** Map entries have **protection** (read/write/execute) and **inheritance** (shared, copy-on-write, none for child). This is how `fork()` gets copy-on-write semantics for the child’s address space.

**References:** [Memory and Virtual Memory (Apple Kernel Programming Guide)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/vm/vm.html), [Mach VM (Wikipedia)](https://en.wikipedia.org/wiki/Mach_(kernel)#Memory_management).

---

## Commands and tools

- **`vm_stat`** — Summary of VM statistics: page size, free/active/inactive/wired/pageouts, etc. Run **`vm_stat 2`** for a 2-second sample to see rate of paging.
- **`memory_pressure`** — Reports current memory pressure state (e.g. normal, warning, critical); useful for scripts.
- **Activity Monitor** — **Memory** tab: physical memory, memory used, swap used, compressed memory, and per-process memory (e.g. “Real Mem”, “Virtual Memory”).
- **`vmmap <pid>`** — (Xcode command-line tools) Virtual memory regions of process; good for understanding address space layout and shared libraries.
- **`top -l 1 -stats pid,command,mem`** — One snapshot of processes with memory stats.

**Example:**

```bash
# VM summary
vm_stat

# Memory pressure
memory_pressure

# Per-process memory (top)
top -l 1 -o mem
```

---

## Summary

- **Model:** **Mach VM** — address spaces, VM objects, pmap; demand paging, swap.
- **Tools:** **`vm_stat`**, **`memory_pressure`**, **Activity Monitor**, **`vmmap`**, **`top`**.

---

## Further reading

- [Memory and Virtual Memory (Apple Kernel Programming Guide)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/vm/vm.html)
- [Mach (kernel) - Wikipedia](https://en.wikipedia.org/wiki/Mach_(kernel)#Memory_management)
- `man vm_stat`, `man memory_pressure`, `man vmmap`
