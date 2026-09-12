# Unix (implementation)

**How Unix and Unix-like systems implement OS fundamentals.** Assume you have read [Fundamentals](../Fundamentals/README.md). Here we cover the **Unix kernel**, process model, file hierarchy, shell, and **commands and tools** for DevOps — including **Unix flavors** (BSD, Solaris, AIX, HP-UX) in the [Flavors](./Flavors/README.md) folder. Linux is **Unix-like** (same philosophy, POSIX) but not derived from original Unix source; for Linux distros (Fedora, Ubuntu, etc.), see [Linux Distributions](../Linux/Distributions/README.md).

---

## Where Unix implements OS fundamentals

Same format as [Linux](../Linux/README.md) and [Windows](../Windows/README.md): each row maps a **concept** to **how Unix does it** and the **topic** where it is covered. Implementation details vary by flavor (BSD, Solaris, AIX, HP-UX); see [Flavors](./Flavors/README.md) for flavor-specific commands and tools.

| Concept | How Unix does it | Topic |
|--------|-------------------|-------|
| **CPU scheduling** | Priority-based; run queues; nice (user) and scheduling priority (kernel); ULE (FreeBSD) / per-flavor scheduler; real-time (rtprio, etc.) | [CPU scheduling](./3_CPU_Scheduling.md) |
| **Process synchronization** | Pipes, FIFOs; POSIX/System V semaphores and shared memory; kernel-managed wait/block; signals | [Process synchronization](./4_Process_Synchronization.md) |
| **Deadlock management** | No kernel detection; lock ordering and timeouts in code; observe with ps (state D), kdump, debugger | [Deadlock](./5_Deadlock.md) |
| **Multi-threading** | pthreads (POSIX); 1:1 model (one kernel schedulable entity per thread); ps -L, top -H, prstat per flavor | [Multithreading](./6_Multithreading.md) |
| **Memory management** | Virtual memory, paging queues (e.g. FreeBSD vm_page_t: active, inactive, cache, free); swap; pageout daemon; vmstat, top | [Memory management](./7_Memory_Management.md) |
| **Storage / storage scripting** | FHS-style hierarchy; file systems; disk and iostat; RAID on Unix (BSD GEOM gmirror/gstripe, Solaris ZFS raidz) | [Storage and I/O](./8_Storage_And_IO.md) |
| **User management** | adduser / pw (BSD), useradd (Solaris); cron; group and permission model; flavor-specific (see Flavors) | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) |
| **Networking and firewall** | ifconfig, netstat, route; pf (BSD), ipfilter (Solaris); flavor-specific — see Flavors | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md), [Flavors](./Flavors/README.md) |
| **Virtualization** | Jails (BSD), zones (Solaris), LPAR (AIX); flavor-specific | [Flavors](./Flavors/README.md) |
| **Logging (how to check)** | syslog; /var/log; logger; flavor-specific (rsyslog, syslog-ng, etc.) | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md), [Flavors](./Flavors/README.md) |
| **Kernel optimization** | sysctl (BSD), /proc/sys or ndd (Solaris); swap and VM tuning; flavor-specific | [Memory management](./7_Memory_Management.md), [Flavors](./Flavors/README.md) |
| **Security** | SSH, file permissions, firewall (pf, ipfilter); MAC (e.g. TrustedBSD); flavor-specific | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md), [Flavors](./Flavors/README.md) |

**Factual basis:** The “How the system does it (deep level)” sections in the topic files are drawn from **official or authoritative documentation**, not assumed or generic. Where possible, the text cites the source: e.g. **FreeBSD Architecture Handbook** ([Virtual Memory System](https://docs.freebsd.org/en/books/arch-handbook/vm/)), **FreeBSD** scheduler docs (runqueue(9), ULE), **POSIX** (semaphores, shared memory), **Microsoft Learn** (Windows scheduling and memory). Implementation details **vary by Unix flavor** (BSD vs Solaris vs AIX vs HP-UX); the handbook uses FreeBSD and POSIX as concrete references and points to [Flavors](./Flavors/README.md) for flavor-specific commands and paths.

---

## Topics

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Introduction and basics](./1_Introduction_And_Basics.md) | Unix history, kernel, POSIX, system calls, boot, essential commands |
| 2 | [Process management](./2_Process_Management.md) | Process model, ps, kill, signals, process states |
| 3 | [CPU scheduling](./3_CPU_Scheduling.md) | Scheduler, nice, renice, priority |
| 4 | [Process synchronization](./4_Process_Synchronization.md) | IPC, semaphores, shared memory, pipes |
| 5 | [Deadlock](./5_Deadlock.md) | Deadlock on Unix, detection, prevention |
| 6 | [Multithreading](./6_Multithreading.md) | Threads, pthreads, 1:1 model |
| 7 | [Memory management](./7_Memory_Management.md) | Virtual memory, swap, vmstat, top |
| 8 | [Storage and I/O](./8_Storage_And_IO.md) | FHS, file systems, disk, iostat; **RAID on Unix** (BSD GEOM gmirror/gstripe, Solaris ZFS raidz) |
| 9 | [Shell and scripting](./9_Shell_And_Scripting.md) | sh, ksh, csh, bash on Unix, scripting |
| 10 | [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md) | Local users (adduser, pw), cron; networking (ifconfig, firewall per flavor); syslog and /var/log; SSH and security; pointers to Flavors |
| — | [**Flavors**](./Flavors/README.md) | **FreeBSD, OpenBSD, NetBSD, Solaris/illumos, AIX, HP-UX** — package managers (pkg, IPS, installp, swinstall), service management (rc.d, smf), flavor-specific commands |

## Adding topics

Add new numbered files under `Operating-Systems/Unix/` and link from this README. **Flavor-specific** content (BSD, Solaris, AIX, HP-UX) goes under [Flavors](./Flavors/README.md). Community-maintained.
