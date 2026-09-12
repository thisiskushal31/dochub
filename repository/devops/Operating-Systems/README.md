# Operating Systems

This folder covers **how operating systems work** and **how Linux, Windows, Unix, and macOS implement them** — from kernel and process model through memory, storage, and shell, with commands and tools. The goal is **in-depth** coverage so that after studying it you understand OS design and can work confidently across these platforms.

---

## Scope and prerequisites

**What this folder covers:** OS concepts (kernel, processes, scheduling, memory, I/O, file systems, shell) and their implementation on Linux, Windows, Unix, and macOS — including commands, system calls, and distro-specific topics (Fedora, CentOS, Ubuntu, etc.).

**What sits below the OS (not covered here):** To *design* or *implement* an OS from scratch you also need foundations that sit **under** the operating system:

- **Digital logic** — Boolean algebra, **K-maps (Karnaugh maps)**, gates, flip-flops, combinational and sequential circuits. This is how hardware is built and simplified.
- **Computer organization** — CPU datapath, instruction set (ISA), registers, caches, memory hierarchy, how the processor executes instructions. The OS assumes this layer exists.
- **Hardware–OS interface** — Interrupts (IRQ, IDT), traps, exceptions, and how the CPU hands control to the kernel are covered in **Fundamentals**: [Interrupts, exceptions, and traps](./Fundamentals/14_Interrupts_Exceptions_And_Traps.md), [Boot process (detailed)](./Fundamentals/15_Boot_Process_Detailed.md), and [Device drivers and I/O subsystem](./Fundamentals/16_Device_Drivers_And_IO_Subsystem.md).

So: **K-maps and digital logic** belong to **computer organization / digital logic** courses or a "Computer Fundamentals" resource (e.g. [ByteByteGo — Computer Fundamentals](https://bytebytego.com/guides/computer-fundamentals/)). This handbook starts at the **OS layer** and explains how the OS uses the hardware (interrupts, privilege levels, system calls) and how it manages processes, memory, and I/O. For "from the very base" (gates → CPU → OS), treat digital logic and computer org as **prerequisites**; we point to them where relevant.

---

## Two layers of content

1. **Fundamentals** — **OS-agnostic** theory: what the kernel is, how processes and scheduling work, synchronization, deadlock, threads, memory management, storage, and the role of the shell. No Linux or Windows specifics. **Start here.** This is operating system basics that apply to any OS.
2. **Implementation** — **How a specific OS does it:** Linux, Windows, Unix, and macOS. Commands, APIs, kernel behavior, and DevOps-relevant tools.

So: **Linux is not “everything.”** The kernel and process/memory/scheduling/sync concepts are **universal**. Linux, Windows, Unix, and macOS are **implementations** of those ideas.

---

## Structure

| Folder | Description |
|--------|-------------|
| [**Fundamentals**](./Fundamentals/README.md) | **OS basics:** kernel, process, PCB, CPU scheduling, synchronization, deadlock, threads, memory, storage, shell, process anatomy, inside the CPU, interrupts/traps, boot, device drivers, file system interface, protection/security, request flow (x86/x64/ARM). Includes a **concept index** to find any topic. Theory only; study this first. |
| [**Linux**](./Linux/README.md) | **How Linux does it:** kernel (monolithic, syscalls), process model, scheduler (CFS), memory (VM, swap), storage (VFS, FHS, file systems), Docker filesystem (overlay2), RAID (mdadm), virtualization (KVM, VirtualBox), shell and scripting. Commands and tools for DevOps. |
| [**Windows**](./Windows/README.md) | **How Windows does it:** NT kernel, processes and services, PowerShell, networking, virtualization (Hyper-V, VirtualBox), Storage Spaces (RAID-like). Deep coverage with commands and tools for DevOps. |
| [**Unix**](./Unix/README.md) | **How Unix does it:** Unix kernel, POSIX, process model, file hierarchy (FHS), shell. BSD, Solaris, Unix-like; commands and tools for DevOps. |
| [**MacOS**](./MacOS/README.md) | **How macOS does it:** Darwin, XNU (Mach + BSD + IOKit), APFS, launchd, Unified Logging, Hypervisor/Virtualization frameworks. Architecture, file system, services, processes, memory, storage, virtualization, security. Commands and references to Apple and cybersecurity docs. |

---

## Learning path

1. **[Fundamentals](./Fundamentals/README.md)** — Read all topics (1–20): OS basics (kernel, types, system call, boot), process management (process, PCB, states, CPU scheduling), process synchronization, deadlock, multithreading, memory management, disk/I/O, RAID, and additional topics (process anatomy, inside the CPU, shell, sockets, compilers/linkers/virtualization, interrupts/traps, boot in detail, device drivers, file system interface, protection/security, request flow and system architecture, **virtualization and datacenter**). Use the **concept index** in the Fundamentals README to find where a concept (e.g. context switch, RAG, Banker's algorithm, page replacement) is covered. No platform-specific commands yet.
2. **[Linux](./Linux/README.md)** — For each topic, see how the **Linux kernel** implements it (syscalls, /proc, scheduler, VM, VFS) and which **commands** to use. Includes **Docker filesystem** (overlay2, volumes), **virtualization** (KVM, libvirt, VirtualBox), **RAID** (mdadm), and **FHS/system files**. Primary for servers and DevOps.
3. **[Windows](./Windows/README.md)** — When you need Windows: how the **Windows kernel** and services work, and which **commands** (cmd, PowerShell) to use. Covered in depth.
4. **[Unix](./Unix/README.md)** — When you work with Unix or Unix-like systems (BSD, Solaris): kernel, POSIX, and **commands** in depth.
5. **[MacOS](./MacOS/README.md)** — When you need macOS: **Darwin/XNU** (Mach + BSD + IOKit), **APFS**, **launchd**, **Unified Logging**, **Hypervisor/Virtualization** frameworks. Architecture (what it's built on, languages, hardware integration), file system, services, processes, memory, storage, virtualization, event logging, security. References to Apple docs and cybersecurity sources.

---

## Adding topics

- **Fundamentals:** Add a new numbered file under `Operating-Systems/Fundamentals/` and link it from [Fundamentals/README.md](./Fundamentals/README.md). Keep content OS-agnostic.
- **Linux / Windows / Unix / MacOS:** Add a new numbered file under the right folder and link it from that folder’s README.

This repo is community-maintained. Images from references (e.g. ByteByteGo, GeeksforGeeks) are stored under `Assets/Operating-Systems/` and linked in topic files with credit. Flow in each topic: text → image → code block if needed.

---

## Cross-references

- **Automation:** [Automation/](../Automation/README.md) — Scripting and orchestration often run on Linux or Windows.
- **CiCd:** [CiCd/](../CiCd/README.md) — Pipelines and agents typically run on Linux; some use Windows agents.
