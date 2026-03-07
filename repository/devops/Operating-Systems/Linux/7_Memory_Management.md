# Memory management (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Memory management](../Fundamentals/9_Memory_Management.md). Here: **how Linux** manages memory (VM subsystem, page cache, swap, OOM killer) and **commands** (free, /proc/meminfo, pmap, vmstat).

---

## Memory hierarchy and units

Typical hierarchy (fast and small to slow and large):

- **Registers** → **Cache** (L1, L2, L3) → **Main memory (RAM)** → **Secondary storage (disk, SSD)**

Memory is measured in bytes; larger units: KB, MB, GB, TB. The OS manages **main memory** (RAM) and the use of **secondary storage** for swapping and paging.

![Types of memory and storage](../../Assets/Operating-Systems/bytebytego-memory-storage.png)

*Image: [ByteByteGo – Types of Memory and Storage](https://bytebytego.com/guides/types-of-memory-and-storage/).*

---

## Logical vs physical address

| Type | Meaning | Who uses it |
|------|--------|-------------|
| **Logical (virtual)** | Address used by the program (e.g. in instructions). | CPU in user mode; each process has its own address space. |
| **Physical** | Address in actual RAM (or frame). | Hardware (MMU) and kernel. |

The **Memory Management Unit (MMU)** translates logical to physical using per-process page tables (or segment tables). This gives isolation (one process cannot touch another’s memory unless shared) and enables virtual memory (more virtual address space than physical RAM).

---

## Contiguous allocation

Memory is given to a process as one contiguous block (or a few large blocks). Problems:

- **Fragmentation** — Free memory is scattered into small holes (external fragmentation) or wasted inside an allocation (internal fragmentation).
- **Compaction** can reduce external fragmentation by moving processes to coalesce free space, but it is expensive.

Partitioning schemes (e.g. first-fit, best-fit, worst-fit) decide which hole to use; they do not eliminate fragmentation.

---

## Paging

**Paging** divides memory into fixed-size **pages** (e.g. 4 KB). Process address space is split into pages; physical memory is split into **frames** of the same size. Each (logical) page is mapped to a frame (or marked invalid / on disk). There is **no external fragmentation**; **internal fragmentation** is at most one page per region.

- **Page table** — Per process; maps virtual page number → frame number (and flags: present, writable, etc.).
- **TLB** (Translation Lookaside Buffer) — Hardware cache of page-table entries to speed up translation.

---

## Segmentation

**Segmentation** divides the address space into **segments** (e.g. code, data, stack) of variable size. Each segment has a base and limit. It matches program structure but causes **external fragmentation**. **Segmentation with paging** combines both: segments are themselves paged (e.g. some modern systems).

![Paging vs segmentation](../../Assets/Operating-Systems/bytebytego-paging-vs-segmentation.png)

*Image: [ByteByteGo – Paging vs Segmentation](https://bytebytego.com/guides/what-are-the-differences-between-paging-and-segmentation/).*

---

## Virtual memory

**Virtual memory** allows the total virtual address space of all processes to be larger than physical RAM. Some pages reside in RAM; others are on **disk** (swap). When a process accesses a page that is not in RAM, the hardware raises a **page fault**; the OS loads the page (and may evict another), then resumes the process.

Benefits: large address spaces, less RAM needed per process, and process isolation.

---

## Page replacement

When a page fault occurs and no free frame exists, the OS must **replace** a page: choose a victim, write it back if dirty, and free its frame. Algorithms differ in how they choose the victim:

| Algorithm | Idea |
|-----------|------|
| **FIFO** | Evict the oldest page. Simple; can suffer Belady’s anomaly (more frames → more faults). |
| **LRU** (Least Recently Used) | Evict the least recently used page. Good in practice; expensive to implement exactly. |
| **Optimal** | Evict the page that will be used farthest in the future. Not implementable in practice; used as a benchmark. |
| **Clock / Second chance** | Approximate LRU with a reference bit and a circular list. |

Linux uses variants of LRU-like (e.g. active/inactive lists) in its page cache and swap.

---

## Swapping

**Swapping** means moving a whole process (or large parts of it) between memory and disk. When the OS **swaps out** a process, it frees its frames; when it **swaps in**, it loads it back. This is coarser than paging (which moves page by page). Linux uses **paging** and **swap partitions/files** for evicted pages rather than whole-process swapping in the classic sense.

---

## Linux: inspecting memory

```bash
# Physical memory and usage
free -h
cat /proc/meminfo

# Process memory (RSS, VMSZ)
ps -o pid,rss,vsz,comm -p <PID>
# Or detailed
cat /proc/<PID>/status | grep -E 'VmRSS|VmSize|VmPeak'

# Memory map of a process
cat /proc/<PID>/maps
pmap -x <PID>

# Swap
swapon --show
cat /proc/swaps

# System-wide memory and swap summary
vmstat 1 5
```

---

## Summary

- **Logical** addresses are per process; **physical** addresses are in RAM; the **MMU** translates using page tables.
- **Paging** (fixed-size pages) avoids external fragmentation; **segmentation** (variable-size segments) matches program structure.
- **Virtual memory** uses disk to extend address space; **page faults** trigger loading (and possibly **page replacement**).
- **Page replacement**: FIFO, LRU, Optimal, Clock; Linux uses LRU-like schemes.
- **Swapping** (whole process or large chunks) is the older idea; Linux relies on paging and swap for pages.
- On Linux: `free`, `/proc/meminfo`, `ps`, `/proc/<PID>/maps`, `pmap`, `swapon`, `vmstat`.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Memory Management](https://docs.kernel.org/mm/index.html) — Kernel MM subsystem (virtual memory, paging, swap).
- [Linux man pages: free(1)](https://man7.org/linux/man-pages/man1/free.1.html), [proc(5) meminfo](https://man7.org/linux/man-pages/man5/proc.5.html) — Inspecting memory usage.

**Concepts and tutorials**

- [Introduction to memory and memory units](https://www.geeksforgeeks.org/computer-organization-architecture/introduction-to-memory-and-memory-units/)
- [Memory Management in Operating System](https://www.geeksforgeeks.org/operating-systems/memory-management-in-operating-system/)
- [Logical and Physical Address](https://www.geeksforgeeks.org/operating-systems/logical-and-physical-address-in-operating-system/)
- [Paging in Operating System](https://www.geeksforgeeks.org/operating-systems/paging-in-operating-system/)
- [Virtual Memory](https://www.geeksforgeeks.org/operating-systems/virtual-memory-in-operating-system/)
- [Page Replacement Algorithms](https://www.geeksforgeeks.org/operating-systems/page-replacement-algorithms-in-operating-systems/)
- [Swapping in Operating System](https://www.geeksforgeeks.org/operating-systems/swapping-in-operating-system/)
- [Fragmentation](https://www.geeksforgeeks.org/operating-systems/what-is-fragmentation-in-operating-system/)
