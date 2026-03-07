# OS concepts: compilers, linkers, mode switching, virtualization

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic ties together a few **OS-level** ideas: how **compilers and linkers** produce executables that the OS can load and run, how **kernel vs user mode** switching works (recap and emphasis), and what **virtualization** and **containerization** mean from the OS perspective. All **OS-agnostic**.

---

## Compilers and linkers (how they relate to the OS)

**Compiler** — Translates **source code** (e.g. C, C++) into **object code** (machine code for a target CPU, plus data and metadata). The output is typically **relocatable**: addresses are not yet fixed to a final load address.

**Linker** — Takes one or more **object files** and (optionally) **libraries** and produces a single **executable** (or shared library). It **resolves** symbols (e.g. “function X is in object file Y at offset Z”), assigns **final addresses** (or layout for position-independent code), and writes an **executable file** in a format the OS understands (e.g. ELF, PE). The executable describes: **code** (text), **data**, **BSS**, **entry point**, and what **libraries** (e.g. libc) it depends on.

**Why the OS cares:** The OS **loader** (part of the kernel or of a user-space program that the kernel runs, e.g. the dynamic linker) **reads** this executable format, **allocates** an address space for the process, **maps** the code and data segments into that space (or sets up demand loading), and **jumps** to the entry point. So compilers and linkers produce the **artifact** (the executable) that the OS **loads** and **runs**. The OS does not compile or link; it assumes the executable is valid and follows the ABI (calling convention, system-call interface). Understanding “compilers and linkers” explains **what the process’s address space initially looks like** (see [Process anatomy](./3_Process_Anatomy_Address_Space.md)) and how the OS gets from “file on disk” to “process in memory.”

---

## Loading vs linking

- **Linking** — Done by the **linker** (before or at load time). It **combines** one or more object files and libraries into a single **executable** (or shared library). It **resolves** symbols (e.g. function and variable references), assigns **addresses** (or layout for position-independent code), and produces a file the OS can load. **Static linking** bakes library code into the executable; **dynamic linking** leaves references to shared libraries that are resolved when the program is **loaded** or at **first use**.
- **Loading** — Done by the **loader** (OS or dynamic linker). It **reads** the executable file, **allocates** an address space for the process, **maps** code and data (and possibly shared libraries) into memory (or sets up demand paging so they are loaded on first access), and **transfers control** to the entry point. So: **linking** produces the executable; **loading** brings it into memory and starts it.

Both are **OS-level concepts**: the executable is the result of linking; the running process is the result of loading (and execution).

```
  Build time:                    Run time:
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ Source  │───►│Compiler │───►│ Object  │
  │ (.c etc)│    │         │    │ files   │
  └─────────┘    └─────────┘    └────┬────┘
                                     │
                                     ▼
  ┌─────────┐                   ┌─────────┐     ┌──────────┐
  │ Running │◄──────────────────│ Loader  │◄───►│Executable│
  │ process │   (map into       │ (OS or  │     │ (file    │
  │ in RAM  │    memory,        │  dyn.   │     │  on      │
  └─────────┘    jump to entry) │ linker) │     │  disk)   │
                                └────┬────┘     └──────────┘
                                     ▲
  LINKING: object files + libraries ─┘  (resolve symbols, layout)
  LOADING: executable ─► address space, run.
```

---

## Static vs dynamic loading

- **Static loading** — The **entire program** (and statically linked libraries) is **loaded into memory** before execution starts. All code and data are brought in at load time. Simple; can increase startup time and memory use if the program is large or uses many libraries.
- **Dynamic loading** — **Parts of the program** (e.g. a **module** or **library**) are **loaded only when needed** (e.g. when a function in that module is first called). The rest of the program can start with only the main executable (and perhaps a small set of libraries) in memory. Reduces initial load time and memory use; allows **lazy** loading of optional or rarely used code. **Demand paging** (loading pages on first access) is a form of dynamic loading at the **page** level.

So: **static loading** = load everything before run; **dynamic loading** = load some parts on demand. Both are **fundamental** options the OS and runtime support (e.g. via loader behavior and shared-library interfaces).

```
  STATIC LOADING:                    DYNAMIC LOADING:
  ┌─────────────────────────┐        ┌─────────────────────────┐
  │ Memory at process start │        │ Memory at process start │
  │ ┌─────┐ ┌─────┐ ┌─────┐ │        │ ┌─────┐ ┌─────┐         │
  │ │Main │ │Lib1 │ │Lib2 │ │        │ │Main │ │Lib1 │  ...    │
  │ │     │ │     │ │     │ │        │ │     │ │     │         │
  │ └─────┘ └─────┘ └─────┘ │        │ └─────┘ └─────┘         │
  │ All loaded before run   │        │ Lib2 loaded on first    │
  └─────────────────────────┘        │ use (e.g. first call)   │
                                     └─────────────────────────┘
  Demand paging = dynamic loading at page granularity (load page on fault).
```

---

## Kernel vs user mode switching (recap)

The CPU runs in one of (at least) two **modes**: **kernel mode** (privileged) or **user mode** (unprivileged). Only in kernel mode can the CPU use certain instructions and access all memory and devices.

**How does switching happen?**

- **User → Kernel:** The user program executes a **trap** instruction (e.g. system call, or an **exception** such as page fault, illegal instruction). The CPU saves the current PC (and possibly minimal state), switches to kernel mode, and jumps to a **trap handler** (kernel code). The kernel then does the work (e.g. perform the system call, handle the page fault) and eventually **returns** to user mode by restoring the saved PC and switching the mode bit. So **every** system call and **every** exception is a **kernel vs user mode switch**.
- **Kernel → User:** The kernel finishes its handler and executes a “return from trap” (or equivalent) instruction that restores the user PC and switches back to user mode.

**Why emphasize it here:** This is the **only** way the OS kernel runs. The kernel does not “run in the background” as a separate thread in the usual sense; it runs **in response to** traps and interrupts. So “kernel vs user mode switching” is the **mechanism** that makes the OS possible. (See [Kernel and OS architecture](./1_Kernel_And_OS_Architecture.md).)

---

## Virtualization and containerization (OS perspective)

**Virtualization** — Running one or more **guest** OS (or “virtual machines”) on top of a **host** OS (or hypervisor). From the **host** perspective: the host kernel (or hypervisor) allocates CPU time, memory, and devices to each VM. It may emulate or **virtualize** hardware so the guest OS thinks it has its own CPU, RAM, and disks. **Type 1 hypervisor:** runs directly on hardware; no host OS. **Type 2 hypervisor:** runs as an application on a host OS. In both cases, the **OS concept** is: a layer (hypervisor or host kernel) **multiplexes** physical resources and presents each guest with a **virtual** machine. The guest OS runs normally inside that VM; it does not “know” it is virtualized (unless it uses paravirtualization or CPU features that expose it).

**Containerization** — Running **containers** (isolated processes and their view of the file system and network) on a **single** host kernel. There is **one** OS kernel. Containers are **not** full VMs; they are **namespaced** and **resource-limited** processes (and their descendants). The kernel provides **namespaces** (so each container has its own view of PIDs, network, mounts, etc.) and **cgroups** (so resource limits can be applied). So “containerization” from the OS perspective is: **same kernel**, **multiple isolated process trees** with separate namespaces and limits. It is lighter than full virtualization because there is no second kernel or virtual hardware; the host kernel does everything.

**Summary:** **Virtualization** = one or more guest OSes (or VMs) on a host/hypervisor; the host multiplexes hardware. **Containerization** = one kernel, many isolated process trees (containers) with namespaces and cgroups. Both are **how the OS (or a layer above it)** provides isolation and resource control; the exact mechanisms (hypervisor type, namespace kinds) are implementation details.

---

## Summary

- **Compilers and linkers** produce the **executable** that the OS **loader** maps into a process’s address space. The OS does not compile; it loads and runs.
- **Kernel vs user mode switching** happens on **every** system call and exception: trap into kernel, kernel runs, return to user. This is the only way the kernel executes.
- **Virtualization** = VMs (guest OSes) on a host/hypervisor; **containerization** = one kernel, many isolated process trees (namespaces, cgroups). Both are OS-level (or hypervisor-level) ways to isolate and manage workloads.

These are **operating system concepts** that apply regardless of whether the concrete OS is Linux, Windows, or another. For Linux-specific details (ELF, namespaces, cgroups) see [Linux](../Linux/README.md).

---

## Further reading

- [Kernel and OS architecture](./1_Kernel_And_OS_Architecture.md) for privilege and system calls.
- [Process anatomy](./3_Process_Anatomy_Address_Space.md) for address space layout.
- OS and systems programming texts for compiler/linker details and virtualization internals.
