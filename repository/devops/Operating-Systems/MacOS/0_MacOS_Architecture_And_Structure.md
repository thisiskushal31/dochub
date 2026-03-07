# macOS architecture and structure

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals](../Fundamentals/README.md). Here: **what macOS is built on**, **what language it's written in**, **how it works** (kernel, scheduling, memory), and **how it integrates with hardware** — so you understand the system at a deep level.

---

## What macOS is built on: Darwin and XNU

**macOS** (and iOS, iPadOS, tvOS, watchOS) sits on top of **Darwin**, the open-source core operating system. **Darwin** includes the kernel, BSD userland, and core libraries; it does **not** include Apple’s proprietary GUI (Quartz, Aqua), application frameworks (Cocoa, SwiftUI), or most bundled apps. So: **Darwin** = kernel + core OS; **macOS** = Darwin + Apple’s graphics, frameworks, and apps.

The kernel is **XNU** (“X is Not Unix”). XNU is a **hybrid kernel** that combines:

1. **Mach** — A microkernel developed at Carnegie Mellon (1980s–1990s). Mach provides **virtual memory**, **CPU scheduling** (threads and tasks), **interprocess communication (IPC)** via message passing, and **pagers** for backing store. In XNU, Mach is the foundation: memory management, scheduling, and IPC are Mach-based.
2. **BSD** — A BSD (primarily **FreeBSD**) layer integrated **on top of** Mach. BSD provides the **process model** (process IDs, signals, fork/exec), **file systems**, **networking** (TCP/IP stack, sockets), **UNIX security model**, **syscall** interface, and **pthreads** support. Most POSIX and Unix APIs are implemented in the BSD layer.
3. **IOKit** — Apple’s **object-oriented driver framework**, implemented in a subset of **C++**. IOKit provides **plug and play**, **dynamic device loading**, **power management**, and **driver stacking**. It is how macOS (and the kernel) **integrate with hardware**: device drivers are IOKit drivers (or legacy KEXTs). IOKit runs in the kernel and talks to hardware via families (USB, SATA, network, etc.).

So **how macOS exactly works** at the kernel level: **Mach** handles processor and memory resources (scheduling, VM, IPC); **BSD** provides the Unix “personality” (processes, files, network, syscalls); **IOKit** handles devices and hardware. There is no single “scheduler” or “memory manager” in isolation — Mach provides the core abstractions; BSD and IOKit use them.

**References:** [Kernel Architecture Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Architecture/Architecture.html), [XNU (Wikipedia)](https://en.wikipedia.org/wiki/XNU), [Darwin (Apple)](https://opensource.apple.com/).

---

## What language it's built on

- **XNU kernel:** Primarily **C** and **C++**. The **Mach** and **BSD** code is mostly **C**; **IOKit** and many drivers are **C++**. The open-source XNU repository is approximately **C (~79%)**, **C++ (~9%)**, **Objective-C (~6%)**, plus Assembly and other languages. **IOKit** is the main C++ component (object-oriented driver API).
- **User space:** **C** (BSD utilities, many daemons), **Objective-C** (Cocoa, system frameworks), **Swift** (modern Apple frameworks and apps). The **shell** default is **zsh**; scripting uses **sh**, **bash**, or **zsh**.
- **Kernel extensions (KEXTs):** Historically C/C++; Apple is moving to **system extensions** (user space) and **DriverKit** (user-space drivers) on Apple Silicon, reducing in-kernel code.

So: the **kernel** is **C and C++**; the **rest of the system** uses C, Objective-C, and Swift. When we say "how to integrate with its systems," we mean: use **Mach APIs** (e.g. for VM or IPC), **BSD/POSIX APIs** (files, network, processes), or **IOKit** (for kernel or driver work); from user space, use **system frameworks** and **syscalls** (which go through the BSD layer and down to Mach where needed).

**References:** [apple-oss-distributions/xnu (GitHub)](https://github.com/apple-oss-distributions/xnu), [XNU - Wikipedia](https://en.wikipedia.org/wiki/XNU).

---

## Kernel extensions vs system extensions and DriverKit

**Kernel extensions (KEXTs)** are legacy: loadable kernel modules that run in **kernel space**. Apple is deprecating them in favor of **system extensions** and **DriverKit**.

**System extensions** (macOS 10.15+) run in **user space** as part of an app. They extend the OS without kernel code. Types: **Network Extensions** (VPN, content filter, etc.), **Driver Extensions** (via DriverKit), **Endpoint Security Extensions** (antivirus, EDR). They are shipped inside an app bundle (`Contents/Library/SystemExtensions`) and are code-signed and entitlement-checked. If they crash, the kernel is unaffected.

**DriverKit** is the modern way to write **device drivers** in user space. It replaces many IOKit use cases for USB, Serial, NIC, and HID. DriverKit drivers use a restricted IOKit API and do not run in the kernel. On Apple Silicon, new drivers are expected to use DriverKit where possible.

**FSEvents** is a separate API for **monitoring file system changes** (directory-level events). It is used by Spotlight, Time Machine, and backup tools. It does not replace kernel file system code; it is a notification mechanism. For low-level file system behavior, see the VFS and APFS documentation.

**Observability and tracing:** **DTrace** is available on macOS but **restricted** (e.g. some probes require SIP disabled or are unavailable for security reasons). **Instruments** (Xcode) and **log**, **sample**, **fs_usage**, **dtruss** are the usual tools. **Kernel panic** logs appear in `/Library/Logs/DiagnosticReports/` (and sometimes on screen). The kernel uses a **zone allocator** (`kalloc`, `kmem_alloc`) for kernel memory; this is internal to XNU.

**References:** [System Extensions (Apple)](https://developer.apple.com/system-extensions/), [Installing System Extensions and Drivers (Apple)](https://developer.apple.com/documentation/systemextensions/installing-system-extensions-and-drivers), [FSEvents Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_ProgGuide/TechnologyOverview/TechnologyOverview.html).


## How it works: preemption, memory protection, and kernel environment

- **Preemptive multitasking:** The **Mach** scheduler preempts threads; the kernel assigns time slices and switches between threads. No process can monopolize the CPU without the kernel taking it back. This supports **real-time** and responsive behavior.
- **Memory protection:** Each process has its own **address space**. The kernel (via **Mach VM**) controls access; user processes cannot read or write kernel memory or other processes’ memory unless explicitly allowed (e.g. shared memory, Mach IPC). So: **user space** = all user process address spaces; **kernel space** = the kernel’s own address space; no user process can directly modify kernel memory.
- **Kernel environment:** The “kernel” in practice is the whole **kernel environment**: Mach + BSD + IOKit + file systems + networking. These run in **kernel space** and can be extended by **kernel extensions (KEXTs)** or, on Apple Silicon, **system extensions** and **DriverKit** (user-space drivers).

**References:** [Kernel Architecture Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Architecture/Architecture.html).

---

## How integrated with hardware

- **IOKit** is the main framework for **hardware integration**. Drivers are **IOKit** drivers (or legacy KEXTs): they discover devices (plug and play), handle power management, and expose device interfaces to the rest of the kernel or user space. **DriverKit** (macOS 10.15+) allows some drivers to run in **user space** with restricted IOKit APIs, improving stability and security.
- **Mach** and **BSD** do not talk to hardware directly; they use **IOKit** (and the **platform expert**, etc.) for device I/O. So: **application or BSD layer** → **syscall or API** → **Mach or BSD** → **IOKit** → **device**. Hardware-specific code (CPU features, interrupts, DMA) is abstracted by IOKit and the platform code.
- **Apple Silicon (M1, M2, etc.):** The same XNU kernel runs on **ARM64**. Virtualization uses the **Hypervisor.framework**, which uses hardware **virtualization extensions**; no third-party kernel extensions are required for VMs. Security (e.g. **System Integrity Protection**, **SIP**) and **Secure Enclave** are part of the hardware–OS integration.

**References:** [I/O Kit Fundamentals (Apple)](https://developer.apple.com/library/archive/documentation/DeviceDrivers/Conceptual/IOKitFundamentals/), [Hypervisor framework (Apple)](https://developer.apple.com/documentation/hypervisor).

---

## File system and directory layout (overview)

- **Default file system:** **APFS** (Apple File System). Legacy systems may still use **HFS+**. APFS uses **containers** and **volumes**; a single container can hold multiple volumes (e.g. System, Data, VM, Preboot, Recovery). See [Storage and I/O](./8_Storage_And_IO.md).
- **Directory layout:** macOS uses **domains** (User, Local, Network, System). Key paths:
  - **/System** — Apple system software (read-only on sealed volumes).
  - **/Library** — System-wide resources and support files.
  - **/Applications** — Applications for all users.
  - **/Users** — Home directories.
  - **~/Library** — Per-user application support, caches, preferences (hidden by default).

**References:** [File System Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/), [APFS (Apple)](https://developer.apple.com/documentation/foundation/file_system).

---

## Summary

- **What it's built on:** **Darwin** (open-source core) and **XNU** (hybrid kernel: **Mach** + **BSD** + **IOKit**).
- **What language:** Kernel = **C** and **C++** (Mach, BSD, IOKit); user space = C, **Objective-C**, **Swift**; shell = **zsh** (default).
- **How it works:** **Preemptive** multitasking and **memory protection**; Mach handles VM and scheduling; BSD provides processes, files, network, syscalls; IOKit handles drivers and hardware.
- **How integrated with hardware:** **IOKit** (and DriverKit) for drivers; Mach/BSD use IOKit for device I/O; **Apple Silicon** uses Hypervisor.framework for virtualization and hardware security features.

---

## Further reading

- [Kernel Architecture Overview (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Architecture/Architecture.html) — Mach, BSD, IOKit, Darwin.
- [XNU (Wikipedia)](https://en.wikipedia.org/wiki/XNU) — History and structure.
- [apple-oss-distributions/xnu (GitHub)](https://github.com/apple-oss-distributions/xnu) — XNU source.
- [Darwin (Apple Open Source)](https://opensource.apple.com/) — Darwin and XNU.
- [Apple’s Darwin OS and XNU Kernel Deep Dive](https://tansanrao.com/blog/2025/04/xnu-kernel-and-darwin-evolution-and-architecture/) — Evolution and architecture.
