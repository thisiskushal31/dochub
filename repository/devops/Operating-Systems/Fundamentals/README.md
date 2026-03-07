# OS fundamentals

[← Back to Operating Systems](../README.md)

**Operating system concepts that apply to any OS** — not Linux, not Windows, but **how the operating system works**. This section is theory and architecture only; no platform-specific commands or APIs. Those appear in [Linux](../Linux/README.md) and [Windows](../Windows/README.md).

**Study order:** Work through the sections below in order (1. OS Basics → 2. Process Management → 3. Process Synchronization → 4. Deadlock → 5. Multithreading → 6. Memory Management → 7. Disk/I/O → 8. Additional topics). Use the **concept index** to find where a specific topic (e.g. context switch, RAG, page replacement) is covered.

---

## Study path

### 1. OS Basics

| Order | Topic | File |
|-------|--------|------|
| 1.1 | Introduction to Operating System; Types of OS; Kernel; System Call | [1_Kernel_And_OS_Architecture](./1_Kernel_And_OS_Architecture.md) |
| 1.2 | What happens when we turn on computer? | [15_Boot_Process_Detailed](./15_Boot_Process_Detailed.md) |

### 2. Process Management

| Order | Topic | File |
|-------|--------|------|
| 2.1 | Introduction to Process Management; Process; PCB; Process Table; States of a Process | [2_Process_And_PCB](./2_Process_And_PCB.md) |
| 2.2 | Process Schedulers; CPU Scheduling; Preemptive vs Non-Preemptive; Dispatcher vs Scheduler; Starvation and Aging | [4_CPU_Scheduling](./4_CPU_Scheduling.md) |

### 3. Process Synchronization

| Order | Topic | File |
|-------|--------|------|
| 3.1 | Introduction; Race condition; Critical section; Solutions; Semaphores; Mutex vs Semaphore; Monitors; Classical IPC | [6_Process_Synchronization](./6_Process_Synchronization.md) |

### 4. Deadlock

| Order | Topic | File |
|-------|--------|------|
| 4.1 | Introduction; Handling; Prevention; Banker's Algorithm; Detection and Recovery; RAG; Starvation and Livelock | [7_Deadlock](./7_Deadlock.md) |

### 5. Multithreading

| Order | Topic | File |
|-------|--------|------|
| 5.1 | Thread; User vs Kernel level threads; Multitasking models; Multithreading Models; Benefits | [8_Threads_And_Concurrency](./8_Threads_And_Concurrency.md) |

### 6. Memory Management

| Order | Topic | File |
|-------|--------|------|
| 6.1 | Basics (memory units, logical/physical address); Contiguous allocation; Non-contiguous (Paging, Segmentation); Virtual memory; Page replacement; Thrashing | [9_Memory_Management](./9_Memory_Management.md) |

### 7. Disk / I/O Management

| Order | Topic | File |
|-------|--------|------|
| 7.1 | File systems; Directory structures; File allocation and access; Secondary memory; Disk scheduling; Spooling vs Buffering; Free space management | [10_Storage_And_IO](./10_Storage_And_IO.md) |
| 7.2 | File system interface (files, directories, operations, links, mounting) | [17_File_System_Interface](./17_File_System_Interface.md) |

### 8. Additional topics

These topics are part of a full OS course. Study them after the sections above or slot them in where your curriculum needs them.

| Topic | File | Key concepts covered |
|--------|------|----------------------|
| **Process anatomy: address space** | [3_Process_Anatomy_Address_Space](./3_Process_Anatomy_Address_Space.md) | Program vs process; layout (text, data, BSS, heap, stack); execution with stack and heap |
| **Inside the CPU** | [5_Inside_The_CPU](./5_Inside_The_CPU.md) | CPU components, instruction life cycle, pipelining, parallelism; why this matters for the OS and scheduling |
| **User interface and the shell** | [11_User_Interface_And_Shell](./11_User_Interface_And_Shell.md) | CLI vs GUI, role of shell, pipes, redirection, kernel–user boundary |
| **Sockets and network I/O** | [12_Sockets_And_Network_IO](./12_Sockets_And_Network_IO.md) | Sockets, connections, kernel queues, sending/receiving data, socket patterns, async I/O |
| **Compilers, linkers, mode switch, virtualization** | [13_OS_Concepts_Compilers_Linkers_Virtualization](./13_OS_Concepts_Compilers_Linkers_Virtualization.md) | How programs become executables; kernel vs user mode switching; virtualization and containerization |
| **Interrupts, exceptions, and traps** | [14_Interrupts_Exceptions_And_Traps](./14_Interrupts_Exceptions_And_Traps.md) | Traps (system calls), exceptions (page fault), hardware interrupts (IRQ, IDT); how CPU hands control to kernel |
| **Device drivers and I/O subsystem** | [16_Device_Drivers_And_IO_Subsystem](./16_Device_Drivers_And_IO_Subsystem.md) | Device drivers, block vs character devices, I/O layers, DMA |
| **Protection and security** | [18_Protection_And_Security](./18_Protection_And_Security.md) | Protection vs security; access control (DAC, MAC); authentication, authorization; security threats |
| **Request flow and system architecture** | [19_Request_Flow_And_System_Architecture](./19_Request_Flow_And_System_Architecture.md) | How a request flows in **any** system (x86, x64, ARM): user → trap → kernel → subsystem → driver → hardware; architecture layers; I/O and interrupt path |
| **Virtualization, hypervisors, and datacenter** | [20_Virtualization_Hypervisors_And_Datacenter](./20_Virtualization_Hypervisors_And_Datacenter.md) | Type 1 vs Type 2 hypervisors; CPU and memory virtualization; how the datacenter shares and divides CPU and memory; I/O and storage (concepts only; platform config in Linux/Windows) |

---

## Concept index

Use this list to find where a concept is explained.

| Concept / question | Covered in |
|--------------------|------------|
| Context switch, dispatch latency | [2_Process_And_PCB](./2_Process_And_PCB.md), [4_CPU_Scheduling](./4_CPU_Scheduling.md) |
| Short-term / medium-term / long-term scheduler | [4_CPU_Scheduling](./4_CPU_Scheduling.md) (scheduler vs dispatcher); see Further reading for scheduler types |
| Process creation and termination, zombie, reaping | [2_Process_And_PCB](./2_Process_And_PCB.md) |
| Multiprogramming vs multitasking vs time-sharing | [1_Kernel_And_OS_Architecture](./1_Kernel_And_OS_Architecture.md) (types of OS); see Further reading for comparison |
| Address space layout (text, data, BSS, heap, stack) | [3_Process_Anatomy_Address_Space](./3_Process_Anatomy_Address_Space.md) |
| Preemptive vs non-preemptive, starvation, aging | [4_CPU_Scheduling](./4_CPU_Scheduling.md) |
| FCFS, SJF, SRTN, Round Robin, priority, multilevel queues | [4_CPU_Scheduling](./4_CPU_Scheduling.md) |
| Critical section, race condition, mutual exclusion | [6_Process_Synchronization](./6_Process_Synchronization.md) |
| Semaphores, mutex, monitors, classical IPC (producer–consumer, reader–writer) | [6_Process_Synchronization](./6_Process_Synchronization.md) |
| Four conditions of deadlock, RAG, Banker's algorithm | [7_Deadlock](./7_Deadlock.md) |
| Deadlock prevention, avoidance, detection, recovery | [7_Deadlock](./7_Deadlock.md) |
| User-level vs kernel-level threads, multithreading models (many-to-one, one-to-one, many-to-many) | [8_Threads_And_Concurrency](./8_Threads_And_Concurrency.md) |
| Logical vs physical address, MMU, page table, TLB | [9_Memory_Management](./9_Memory_Management.md) |
| Paging, segmentation, virtual memory, demand paging | [9_Memory_Management](./9_Memory_Management.md) |
| Paging vs swapping, paging vs segmentation | [9_Memory_Management](./9_Memory_Management.md); see Further reading for “difference” articles |
| Page replacement algorithms, thrashing, Belady's anomaly, swap | [9_Memory_Management](./9_Memory_Management.md) |
| Contiguous vs non-contiguous allocation, internal/external fragmentation | [9_Memory_Management](./9_Memory_Management.md) |
| Buddy system, overlays | [9_Memory_Management](./9_Memory_Management.md) |
| DMA (Direct Memory Access) | [9_Memory_Management](./9_Memory_Management.md), [16_Device_Drivers_And_IO_Subsystem](./16_Device_Drivers_And_IO_Subsystem.md) |
| File systems, file allocation methods, disk scheduling (FCFS, SSTF, SCAN, etc.) | [10_Storage_And_IO](./10_Storage_And_IO.md) |
| Seek time, rotational latency, disk access time | [10_Storage_And_IO](./10_Storage_And_IO.md) (seek time); see Further reading for full disk timing |
| Buffering vs spooling | [10_Storage_And_IO](./10_Storage_And_IO.md) |
| Loading vs linking, static vs dynamic loading | [13_OS_Concepts_Compilers_Linkers_Virtualization](./13_OS_Concepts_Compilers_Linkers_Virtualization.md) (loader, linkers); see Further reading |
| File operations (open, read, write, seek, close), links, mounting | [17_File_System_Interface](./17_File_System_Interface.md) |
| System call flow, privilege levels (rings), trap instruction | [1_Kernel_And_OS_Architecture](./1_Kernel_And_OS_Architecture.md), [19_Request_Flow_And_System_Architecture](./19_Request_Flow_And_System_Architecture.md) |
| Boot: firmware → boot loader → kernel → init | [15_Boot_Process_Detailed](./15_Boot_Process_Detailed.md) |
| Interrupts, exceptions, traps (IDT, IRQ, ISR) | [14_Interrupts_Exceptions_And_Traps](./14_Interrupts_Exceptions_And_Traps.md) |
| Block vs character devices, device drivers | [16_Device_Drivers_And_IO_Subsystem](./16_Device_Drivers_And_IO_Subsystem.md) |
| Protection, access control, authentication, authorization | [18_Protection_And_Security](./18_Protection_And_Security.md) |
| Request flow (user → kernel → driver → hardware), x86/x64/ARM | [19_Request_Flow_And_System_Architecture](./19_Request_Flow_And_System_Architecture.md) |

---

## Quick reference: all topic files by number

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Kernel and OS architecture](./1_Kernel_And_OS_Architecture.md) | Introduction, Types of OS, Kernel, System Call |
| 2 | [Process and PCB](./2_Process_And_PCB.md) | Process, PCB, Process Table, States |
| 3 | [Process anatomy: address space](./3_Process_Anatomy_Address_Space.md) | Address space layout (text, data, BSS, heap, stack) |
| 4 | [CPU scheduling](./4_CPU_Scheduling.md) | Schedulers, CPU Scheduling, Preemptive, Dispatcher, Starvation |
| 5 | [Inside the CPU](./5_Inside_The_CPU.md) | CPU components, instruction cycle, pipelining |
| 6 | [Process synchronization](./6_Process_Synchronization.md) | Race condition, Critical section, Semaphores, Mutex, Monitors, IPC |
| 7 | [Deadlock](./7_Deadlock.md) | Introduction, RAG, Prevention, Avoidance, Detection |
| 8 | [Threads and concurrency](./8_Threads_And_Concurrency.md) | Thread, User vs Kernel threads, Models, Benefits |
| 9 | [Memory management](./9_Memory_Management.md) | Basics, Contiguous, Paging, Segmentation, Virtual memory, Page replacement |
| 10 | [Storage and I/O](./10_Storage_And_IO.md) | File systems, Disk scheduling, Spooling vs Buffering |
| 11 | [User interface and the shell](./11_User_Interface_And_Shell.md) | CLI, shell, pipes, redirection |
| 12 | [Sockets and network I/O](./12_Sockets_And_Network_IO.md) | Sockets, network from OS view |
| 13 | [OS concepts: compilers, virtualization](./13_OS_Concepts_Compilers_Linkers_Virtualization.md) | Compilers, linkers, mode switch, virtualization |
| 14 | [Interrupts, exceptions, and traps](./14_Interrupts_Exceptions_And_Traps.md) | Traps, exceptions, hardware interrupts |
| 15 | [Boot process (detailed)](./15_Boot_Process_Detailed.md) | What happens when we turn on computer? |
| 16 | [Device drivers and I/O subsystem](./16_Device_Drivers_And_IO_Subsystem.md) | Device drivers, block/character, DMA |
| 17 | [File system interface](./17_File_System_Interface.md) | Files, directories, operations, links, mounting |
| 18 | [Protection and security](./18_Protection_And_Security.md) | Protection vs security, access control, threats |
| 19 | [Request flow and system architecture](./19_Request_Flow_And_System_Architecture.md) | Request flow (any system); architecture layers |
| 20 | [Virtualization, hypervisors, and datacenter](./20_Virtualization_Hypervisors_And_Datacenter.md) | Hypervisors; CPU/memory virtualization; datacenter shared CPU and memory |

---

## Topics comparison: what’s covered vs common syllabi

Below is a checklist of topics that often appear in OS fundamentals courses and in “difference between” lists. Use it to see what’s in the handbook and what is only in references.

| Topic or “difference” | Status | Where |
|------------------------|--------|--------|
| **Introduction:** What is OS, types of OS, kernel, system call, boot | Covered | 1, 15 |
| **Process vs program** | Covered | 2, 3 |
| **Process vs thread** | Covered | 8 |
| **Process:** PCB, states, context switch, creation/termination, zombie | Covered | 2 |
| **Short-term / medium-term / long-term scheduler** | Covered | 4 |
| **CPU scheduling:** FCFS, SJF, RR, priority, preemptive vs non-preemptive, starvation, aging | Covered | 4 |
| **Dispatcher vs scheduler** | Covered | 4 |
| **Multiprogramming vs multitasking vs time-sharing** | Covered | 1 |
| **Synchronization:** critical section, race condition, semaphores, mutex, monitors, classical problems | Covered | 6 |
| **Binary vs counting semaphore; mutex vs semaphore; spinlock** | Covered | 6 (binary/counting, mutex vs semaphore; spinlock in hardware section) |
| **IPC:** shared memory, message passing, pipes, signals, sockets | Covered | 6 (shared memory, message passing, pipes, signals); 12 (sockets) |
| **Deadlock:** four conditions, RAG, prevention, avoidance (Banker’s), detection, recovery; deadlock vs starvation vs livelock | Covered | 7 |
| **Threads:** user vs kernel, multithreading models | Covered | 8 |
| **Memory:** logical vs physical address, MMU, paging, segmentation, virtual memory, demand paging, page replacement, thrashing, fragmentation | Covered | 9 |
| **Paging vs segmentation; paging vs swapping** | Covered | 9 (explicit comparison subsections) |
| **Contiguous vs non-contiguous allocation** | Covered | 9 |
| **Buddy system, overlays** | Covered | 9 |
| **File systems, file allocation, directory, disk scheduling, buffering vs spooling** | Covered | 10, 17 |
| **Seek time, rotational latency, disk access time** | Covered | 10 |
| **Loading vs linking; static vs dynamic loading** | Covered | 13 |
| **Interrupts, exceptions, traps; IDT, IRQ** | Covered | 14 |
| **Device drivers, block vs character, DMA** | Covered | 16 |
| **Protection and security** | Covered | 18 |
| **Request flow (user → kernel → driver → hardware)** | Covered | 19 |
| **Kernel:** monolithic vs microkernel vs hybrid | Covered | 1 |
| **OS vs kernel; application software vs system software vs OS** | Covered | 1 |
| **Real-time (hard vs soft)** | Covered | 1 |
| **Network OS vs distributed OS** | Covered | 1 |
| **Virtualization (OS-level)** | Covered | 13 |
| **Virtualization (hypervisors, datacenter, CPU/memory division)** | Covered | 20 |

**Summary:** All topics in the table above are **covered** in the numbered Fundamentals files. Content is **OS-agnostic**. For extra reading or alternative explanations, see **Further reading** below.

---

## Further reading

Content in this handbook is drawn from multiple sources. For more detail or alternative explanations, see:

- [GeeksforGeeks — Operating System Tutorial](https://www.geeksforgeeks.org/operating-systems/operating-systems/) — OS basics, process management, memory, I/O, deadlock, file systems. Individual topic files link to relevant articles where applicable.
- [GeeksforGeeks — Last Minute Notes – Operating Systems](https://www.geeksforgeeks.org/operating-systems/last-minute-notes-operating-systems/)
- [GeeksforGeeks — Operating System Interview Questions](https://www.geeksforgeeks.org/operating-systems/operating-systems-interview-questions/)
- [ByteByteGo — Computer Fundamentals](https://bytebytego.com/guides/computer-fundamentals/) — Visual guides on process vs thread, deadlock, paging, memory, boot.
- [ByteByteGo — Process vs Thread](https://bytebytego.com/guides/what-is-the-difference-between-process-and-thread/), [Deadlock](https://bytebytego.com/guides/what-is-a-deadlock/), [Paging vs Segmentation](https://bytebytego.com/guides/what-are-the-differences-between-paging-and-segmentation/), [Linux Boot Process](https://bytebytego.com/guides/linux-boot-process-explained/), [Types of Memory and Storage](https://bytebytego.com/guides/types-of-memory-and-storage/)

Images used in topic files are stored in `Assets/Operating-Systems/` and credited in place. Flow in each topic: text → image (where used) → code block if needed.
