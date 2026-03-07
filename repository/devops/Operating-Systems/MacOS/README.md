# macOS (implementation)

**How macOS implements OS fundamentals.** Assume you have read [Fundamentals](../Fundamentals/README.md). macOS is built on **Darwin** (open-source core) and the **XNU kernel** (Mach + BSD + IOKit). Here we cover **architecture** (what it's built on, languages, hardware integration), **file system** (APFS), **services** (launchd), **processes**, **memory**, **storage**, **virtualization** (Hypervisor.framework), **event logging** (Unified Logging), **security**, and **advanced** topics — with commands and references to official Apple and cybersecurity documentation.

---

## Where macOS implements OS fundamentals

Same format as [Linux](../Linux/README.md), [Windows](../Windows/README.md), and [Unix](../Unix/README.md). Each row maps a **concept** to **how macOS does it** and the **topic** where it is covered.

| Concept | How macOS does it | Topic |
|--------|-------------------|-------|
| **Architecture / how it works** | Darwin, XNU (Mach + BSD + IOKit); C/C++/Objective-C; preemptive multitasking, memory protection; hardware via IOKit; **system extensions** vs KEXTs, **DriverKit**, **FSEvents**; DTrace, kernel panic | [Architecture and structure](./0_MacOS_Architecture_And_Structure.md) |
| **File system** | APFS (containers, volumes), HFS+ legacy; hierarchy: /System, /Library, /Applications, domains | [Storage and I/O](./8_Storage_And_IO.md), [Architecture](./0_MacOS_Architecture_And_Structure.md) |
| **Services** | **launchd** (PID 1); Launch Daemons and Launch Agents; **launchctl**; .plist config | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) |
| **Processes** | BSD process model; **ps**, **top**, Activity Monitor; **kill**, signals | [Process management](./2_Process_Management.md) |
| **CPU scheduling** | Mach scheduler; threads and tasks; priority, preemption | [CPU scheduling](./3_CPU_Scheduling.md) |
| **Process synchronization** | Mach IPC, BSD pipes/semaphores, pthreads | [Process synchronization](./4_Process_Synchronization.md) |
| **Deadlock** | No kernel detection; lock ordering in code; observe with sample, lldb | [Deadlock](./5_Deadlock.md) |
| **Multi-threading** | pthreads (BSD); 1:1 model; Mach threads | [Multithreading](./6_Multithreading.md) |
| **Memory management** | Mach virtual memory; address spaces, VM objects, pmap; **vm_stat**, Activity Monitor | [Memory management](./7_Memory_Management.md) |
| **Storage** | APFS containers/volumes; **diskutil**; snapshots; HFS+ (legacy) | [Storage and I/O](./8_Storage_And_IO.md), [Storage advanced and virtualization](./11_Storage_Advanced_And_Virtualization.md) |
| **Networking** | BSD TCP/IP stack; **ifconfig**, **networksetup**, **netstat**; firewall (pf, Application Firewall) | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) |
| **Event logging** | **Unified Logging**; **log stream**, **log show**; tracev3; os_log API | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) |
| **Security** | Gatekeeper, SIP, code signing, entitlements, sandbox, TCC, **Keychain**/certificates; **MDM**; references to security research | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) |
| **Virtualization** | **Hypervisor.framework** (low-level), **Virtualization.framework** (high-level); Apple Silicon | [Storage advanced and virtualization](./11_Storage_Advanced_And_Virtualization.md) |
| **Kernel optimization** | **sysctl**; kernel tuning; XNU open source | [Memory management](./7_Memory_Management.md), [Architecture](./0_MacOS_Architecture_And_Structure.md) |

**Factual basis:** Content is drawn from **Apple Developer Documentation** (Kernel Programming Guide, File System Programming Guide, launchd, Hypervisor, Unified Logging), **XNU open source** ([apple-oss-distributions/xnu](https://github.com/apple-oss-distributions/xnu)), and **security/forensics** sources (e.g. HackTricks macOS, CyberArk, Eclectic Light, forensic APFS references) where they document internals. Links are cited in topic files and **Further reading**.

---

## Topics

| # | Topic | Description |
|---|--------|-------------|
| 0 | [**macOS architecture and structure**](./0_MacOS_Architecture_And_Structure.md) | **What it's built on:** Darwin, XNU (Mach, BSD, IOKit), languages (C/C++/Objective-C), how it works; **system extensions** vs KEXTs, **DriverKit**, **FSEvents**; DTrace, kernel panic |
| 1 | [Introduction and basics](./1_Introduction_And_Basics.md) | Boot process, **boot modes** (Recovery, Safe Mode, NVRAM, SMC), system calls, file system hierarchy (/System, /Library, /Volumes, domains), **system_profiler**, **xcode-select**, essential commands |
| 2 | [Process management](./2_Process_Management.md) | BSD process model, ps, top, Activity Monitor, kill, signals |
| 3 | [CPU scheduling](./3_CPU_Scheduling.md) | Mach scheduler, threads/tasks, priority, nice |
| 4 | [Process synchronization](./4_Process_Synchronization.md) | Mach IPC, BSD pipes/semaphores, pthreads |
| 5 | [Deadlock](./5_Deadlock.md) | Deadlock on macOS, detection, prevention |
| 6 | [Multithreading](./6_Multithreading.md) | pthreads, 1:1 model, Mach threads |
| 7 | [Memory management](./7_Memory_Management.md) | Mach VM, address spaces, vm_stat, Activity Monitor |
| 8 | [Storage and I/O](./8_Storage_And_IO.md) | APFS (containers, volumes), file system hierarchy, diskutil, df |
| 9 | [Shell and scripting](./9_Shell_And_Scripting.md) | zsh (default), bash, sh, scripting |
| 10 | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) | launchd/launchctl, networking, **Unified Logging** (log stream, log show), security (SIP, Gatekeeper, **Keychain**, certificates, MDM), **package management** (Homebrew, pkgutil, installer), **defaults** and **xattr**; references to cybersecurity docs |
| 11 | [Storage advanced and virtualization](./11_Storage_Advanced_And_Virtualization.md) | APFS snapshots, diskutil advanced; **Hypervisor.framework**, **Virtualization.framework** (Apple Silicon) |

---

## Adding topics

Add new numbered files under `Operating-Systems/MacOS/` and link from this README. Community-maintained.
