# Memory management (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Memory management](../Fundamentals/9_Memory_Management.md). Here: how **Unix** and Unix-like systems manage memory — at the **system level** — and which commands to use.

---

## How the system does it (deep level)

Unix and Unix-like kernels use **virtual memory**: each process has an address space; the kernel maps **pages** to physical RAM or to **swap** (a partition or file). Implementation details differ by OS; **FreeBSD** is a well-documented example (see [FreeBSD Architecture Handbook: Virtual Memory System](https://docs.freebsd.org/en/books/arch-handbook/vm/)).

**Physical pages and paging queues:** The kernel tracks physical memory in **page-sized** units. On **FreeBSD**, each such page is represented by a **vm_page_t** structure and placed on one of several **paging queues** according to its state: **wired** (locked in RAM, e.g. for kernel or DMA), **active**, **inactive**, **cache**, or **free**. Queues are managed in an **LRU-like** fashion: pages are aged (scanned and moved from more-active to less-active queues). When the kernel needs a free frame, it takes from the free list; if the free list is low, a **pageout daemon** (or equivalent) runs to **launder** dirty pages (write them to swap or to their backing store) and to move pages from cache/inactive to free. So at a deep level: **virtual** addresses are translated via **page tables** to **physical** frames; frames are tracked in queues; a **page fault** (access to a valid but not-present page) is resolved by the kernel — either by **reactivating** a page already in a queue (cheap) or by **reading** from swap or a mapped file (expensive).

**VM objects and unified buffer cache:** Many Unix systems use a **VM object** (or equivalent) abstraction: a **vm_object** can be backed by **swap**, a **file**, or a **device**. File-backed objects let the kernel use the same **vm_page_t** structures for both process mappings and the **buffer cache**, giving a **unified** cache. **Shadow** (stacked) objects implement **copy-on-write** (e.g. for fork) and private mappings. So: when you **mmap** a file, the kernel associates the mapping with a VM object; when you touch a page, the kernel may fault it in from the file or from a cached page already in memory.

**Swap:** **Swap** is backing store for anonymous (non-file-backed) memory. When memory pressure is high, the pageout daemon can **page out** pages from process address spaces to swap; later, a **page fault** on that address causes the kernel to **page in** from swap. So: **virtual memory** = address space; **resident** pages = in physical RAM (and typically on an “active” or “inactive” queue); **paged out** = contents on swap; **page fault** = kernel brings the page back into a frame and updates the page table.

**References:** [FreeBSD Architecture Handbook: Chapter 7 – Virtual Memory System](https://docs.freebsd.org/en/books/arch-handbook/vm/) — vm_page_t, paging queues, VM objects, pageout daemon, tuning.

---

## Memory on Unix (commands and concepts)

Unix uses **virtual memory**: each process has an address space; the kernel maps pages to physical RAM or **swap**. **Swap** is a partition or file used when RAM is full. **vmstat** shows memory, swap, and paging activity; **top** and **ps** show per-process usage.

![Types of memory and storage](../../Assets/Operating-Systems/bytebytego-memory-storage.png)

*Image: [ByteByteGo – Types of Memory and Storage](https://bytebytego.com/guides/types-of-memory-and-storage/).*

---

## Paging and segmentation

**Paging** (fixed-size pages) is used on modern Unix and Unix-like systems; **segmentation** is less common. **Page replacement** (e.g. LRU-like) is handled by the kernel. No user command directly controls the algorithm; you tune **swap** size and **sysctl** (BSD) or **/proc/sys/vm** (Linux) for behavior.

![Paging vs segmentation](../../Assets/Operating-Systems/bytebytego-paging-vs-segmentation.png)

*Image: [ByteByteGo – Paging vs Segmentation](https://bytebytego.com/guides/what-are-the-differences-between-paging-and-segmentation/).*

---

## Commands

```bash
# Memory and swap (BSD/Linux)
vmstat 1 5
top
free -h   # Linux

# Process memory
ps -o pid,rss,vsz,comm -p <pid>
```

---

## Summary

- **Virtual memory** and **swap**; **vmstat**, **top**, **free**, **ps** for inspection.
- **Paging** is standard; **segmentation** rare on modern Unix.

---

## Further reading

- [FreeBSD Architecture Handbook: Chapter 7 – Virtual Memory System](https://docs.freebsd.org/en/books/arch-handbook/vm/) — vm_page_t, paging queues (wired, active, inactive, cache, free), VM objects, unified buffer cache, pageout daemon, tuning.
- [Memory management in operating system](https://www.geeksforgeeks.org/operating-systems/memory-management-in-operating-system/)
- [ByteByteGo – Paging vs Segmentation](https://bytebytego.com/guides/what-are-the-differences-between-paging-and-segmentation/)
