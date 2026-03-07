# Process, memory, and storage (Windows)

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process and PCB](../Fundamentals/2_Process_And_PCB.md), [CPU scheduling](../Fundamentals/4_CPU_Scheduling.md), [Process synchronization](../Fundamentals/6_Process_Synchronization.md), [Deadlock](../Fundamentals/7_Deadlock.md), [Memory management](../Fundamentals/9_Memory_Management.md), [Storage and I/O](../Fundamentals/10_Storage_And_IO.md). Here: how **Windows** implements processes, **CPU scheduling**, **synchronization**, **deadlock**, **multithreading**, **memory**, **storage**, and **kernel-related tuning** — with commands and tools for DevOps.

---

## Windows process model

Windows uses **processes** and **threads** as the main execution units. Each process has an address space, handles to resources (files, registry keys), and one or more threads. The kernel (NT kernel) **schedules threads**, not processes; the process is the container for address space and handles.

---

## CPU scheduling (Windows)

### How the system does it (deep level)

The Windows kernel does **not** use a single “scheduler” routine. Instead, **dispatcher** logic runs when certain events occur: a thread becomes **ready**, a thread leaves the **running** state (blocks or quantum expires), a thread’s priority changes, or processor affinity changes. The **unit of scheduling is the thread**. Each thread is represented in the kernel by a **KTHREAD**-style structure that includes a **DISPATCHER_HEADER** (it is a **dispatcher object**) and holds priority, quantum, and state. Threads exist in three main states: **Running** (executing on a logical processor), **Ready** (waiting for CPU time, on a per-priority **ready queue**), and **Waiting** (blocked on a dispatcher object such as a mutex or event until it is **signaled**).

**Priority (0–31):** The kernel uses **32 priority levels**, 0–31. **Priority 0** is reserved for the **zero-page thread** (a system thread that zeros free pages when nothing else needs to run). **Levels 1–15** are the **dynamic** range: the scheduler can **boost** and **decay** the thread’s **dynamic priority** (see below). **Levels 16–31** are **real-time**: assigned statically and never adjusted by the scheduler. The **base priority** of a thread is computed from the **process priority class** (Idle, Below Normal, Normal, Above Normal, High, Realtime) and the **thread priority level** (Idle, Lowest, Below Normal, Normal, Above Normal, Highest, Time Critical). The Win32 API (`SetPriorityClass`, `SetThreadPriority`) maps these to a single base priority; for example, NORMAL_PRIORITY_CLASS + THREAD_PRIORITY_NORMAL → base 8; REALTIME_PRIORITY_CLASS + THREAD_PRIORITY_TIME_CRITICAL → base 31.

**Selection and time slice:** Among threads at the same priority, the kernel assigns CPU time in **round-robin** fashion. Each thread receives a **quantum** (time slice); when the quantum expires, the dispatcher can switch to another ready thread of the same (or higher) priority. If a **higher-priority** thread becomes ready, the kernel **preempts** the current thread immediately (without waiting for the quantum to finish) and gives a **full** new quantum to the higher-priority thread. So: the dispatcher always chooses the highest-priority **ready** thread; within that priority, round-robin; preemption is strict by priority.

**Dynamic priority (boosts and decay):** The **dynamic priority** is what the dispatcher actually uses. It starts equal to the base priority. Only threads with **base priority 1–15** receive **boosts**. The system boosts dynamic priority in these cases: (1) when a **NORMAL_PRIORITY_CLASS** process is in the **foreground**, its priority class is boosted so it is at least as high as background processes; (2) when a **window receives input** (timer, mouse, keyboard), the thread that owns the window is boosted; (3) when a **wait is satisfied** (e.g. disk or keyboard I/O completes), the blocked thread is boosted. After a boost, the scheduler **reduces** the dynamic priority by **one level** each time the thread **completes a time slice**, until it reaches the base priority again. Dynamic priority is never set below base priority. Foreground processes can also receive a **longer quantum** (e.g. tripled) so they feel more responsive. Real-time (16–31) threads are never boosted or decayed.

**Why this design:** Boosting makes the system feel responsive (e.g. the window you’re typing in gets CPU quickly) and reduces **starvation** of threads that just became ready after I/O. Decay prevents a single thread from staying boosted forever and starving others.

**References:** [Scheduling Priorities (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities), [Priority Boosts (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/procthread/priority-boosts), [Introduction to Kernel Dispatcher Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-kernel-dispatcher-objects).

**Viewing and changing priority:**

```powershell
# Process priority (BasePriority; Normal=8, High=13, etc.)
Get-Process -Name notepad | Select-Object Name, Id, BasePriority

# Change priority: Task Manager → Details → right-click process → Set priority (e.g. Below normal, High)
# WMI (admin): (Get-WmiObject Win32_Process -Filter "ProcessId=<pid>").SetPriority(<value>)
# 64=Idle, 16384=Below Normal, 32=Normal, 32768=Above Normal, 128=High, 256=Realtime
```

**Task Manager** (Details tab) shows base priority; right‑click a process → **Set priority** to change it. Use **Realtime** only with care — it can starve system threads (mouse, keyboard, disk) and make the system unresponsive.

---

## Process synchronization (Windows)

### How the system does it (deep level)

The kernel defines a set of **dispatcher objects** (synchronization primitives): **timer**, **event**, **semaphore**, **mutex**, and the **thread** object itself. Each has a **state**: **Signaled** or **Not-Signaled**. The kernel does not run one central “synchronization” routine; instead, **wait** and **signal** are part of the same **dispatcher** that handles scheduling. When a thread calls a **wait** function (e.g. `WaitForSingleObject`, or in kernel mode `KeWaitForSingleObject`, `KeWaitForMutexObject`, `KeWaitForMultipleObjects`) on a dispatcher object, the kernel:

1. Puts the thread into the **Waiting** state (it is no longer on the ready queue).
2. Attaches the thread to a **wait queue** associated with that object. Internally, the object’s structure (e.g. **DISPATCHER_HEADER**) has a **WaitListHead** — a linked list of **KWAIT_BLOCK** structures representing threads waiting on it.

When some other thread (or the kernel, e.g. on a timer expiry or I/O completion) **sets the object to Signaled** (e.g. `ReleaseMutex`, `SetEvent`, `KeReleaseSemaphore`), the kernel:

1. Walks the wait queue and moves one or more waiting threads to the **Ready** state. For most objects (e.g. mutex, event in “auto-reset” mode), only **one** waiter is released; for **manual-reset events** or **semaphores**, the kernel can release multiple waiters depending on the object type and count.
2. Those threads are then scheduled according to their **dynamic priority** and the ready queues.

So synchronization is **enforced by the kernel**: a thread cannot “skip” the wait; it stays in Waiting until the object is signaled. **Mutex**: ownership is tracked; only the owning thread can release it; one owner at a time. **Semaphore**: has a **count** and optional **limit**; each release increments the count; each successful wait decrements it; if count is 0, waiters block. **Event**: binary or manual-reset; “set” makes it Signaled; synchronization (auto-reset) events release exactly one waiter and then return to Not-Signaled. **Critical section**: a **user-mode** primitive (not a kernel dispatcher object); when there is no contention, the thread does not enter the kernel; when it blocks, it eventually uses a kernel mutex (or similar) under the hood. Critical sections are faster for in-process, low-contention cases but do not work across processes.

**Kernel mutex level (optional):** In kernel mode, mutexes can have an optional **acquisition order** (level); the kernel can enforce that a thread must not acquire a mutex with a lower level while holding one with a higher level, which helps avoid **deadlock** in driver code; violations can lead to a bug check. User-mode code does not have this; deadlock avoidance is entirely up to the application (lock ordering, timeouts).

**References:** [Introduction to Kernel Dispatcher Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-kernel-dispatcher-objects), [Semaphore Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/semaphore-objects), [Event Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/event-objects).

| Primitive | Type | How the kernel uses it |
|-----------|------|-------------------------|
| **Mutex** | Dispatcher object | One owner; wait queue; release sets object Signaled and one waiter (the one that acquires ownership) becomes Ready. |
| **Semaphore** | Dispatcher object | Count; wait until count &gt; 0 then decrement; release increments count and can wake one or more waiters. |
| **Event** | Dispatcher object | Signaled/Not-Signaled; set → Signaled; synchronization (auto-reset) event wakes one waiter then resets. |
| **Critical section** | User-mode | In-process only; fast path without kernel; when blocking, may use a kernel object internally. |

---

## Deadlock management (Windows)

At the **system level**, the kernel does **not** track lock-acquisition order across user-mode mutexes/semaphores or infer cycles. When a thread waits on a dispatcher object, it simply enters the **Waiting** state on that object’s queue; the kernel does not know whether another thread will eventually signal it or whether that other thread is itself waiting (forming a cycle). So Windows does **not** automatically detect or break user-mode deadlocks. Avoiding deadlock is the responsibility of the application (lock ordering, timeouts, etc.). As an admin you can:

- **Observe** — **Resource Monitor** (resmon.exe) → **CPU** tab → **Associated Handles** to see which process has which handles; **Wait Chain** (right‑click process in Task Manager → **Analyze wait chain**) can show threads waiting on other threads (wait chains that form a cycle indicate possible deadlock).
- **Terminate** — If a process is deadlocked and unresponsive, **Task Manager** → **End task** or `Stop-Process -Id <pid> -Force` to kill it and release its resources.
- **Handles** — **Sysinternals Handle** can list open handles (files, mutexes, events) per process; useful to see what a stuck process is holding.

So: **deadlock management on Windows** is mainly **observability** (wait chains, handles) and **recovery** (terminate the process); prevention is in application design.

---

## Multi-threading (Windows)

The **unit of scheduling** is the **thread**. In the kernel, each thread is represented by a **KTHREAD**-style structure (with a **DISPATCHER_HEADER**); the **dispatcher** maintains **ready queues** per priority and moves threads between **Running**, **Ready**, and **Waiting** (see [CPU scheduling](#cpu-scheduling-windows) above). A process has one or more threads; each thread has its own stack, context (registers), and priority. The **thread pool** (Windows API) lets applications queue work and reuse threads instead of creating many threads per task; the pool’s worker threads are normal kernel threads and are scheduled the same way.

**Viewing threads:**

```powershell
# Process and thread count (number of threads per process)
Get-Process | Select-Object Name, Id, @{N='Threads';E={$_.Threads.Count}}

# Detailed thread list for a process (thread IDs, start time)
Get-Process -Id <pid> | Select-Object -ExpandProperty Threads
```

**Task Manager** → **Details** tab shows a **Threads** column (enable via **View** → **Select columns**). **Performance** tab → **CPU** → **Open Resource Monitor** → **CPU** tab shows threads per process. So **how Windows does multithreading**: one process, many threads; kernel schedules threads by priority and quantum; applications use **CreateThread** or the **thread pool**; you observe with Get-Process, Task Manager, and Resource Monitor.

---

## Inspecting and managing processes

**Command Prompt:**

```cmd
tasklist
tasklist /v
tasklist /fi "imagename eq notepad.exe"
taskkill /PID <pid> /F
taskkill /im notepad.exe /F
```

**PowerShell:**

```powershell
# List processes
Get-Process
Get-Process | Where-Object { $_.CPU -gt 100 } | Sort-Object CPU -Descending

# Process details (threads, modules, handles)
Get-Process -Id <pid> | Format-List *

# Kill process
Stop-Process -Id <pid> -Force
Stop-Process -Name notepad -Force
```

---

## Memory management (Windows)

### How the system does it (deep level)

Each process has a **virtual address space**. The kernel’s **Memory Manager** does not allocate physical RAM to every virtual address immediately. Instead, each **page** of the virtual address space is in one of three **states** (see [Page State - Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/memory/page-state)):

- **Free** — Not reserved or committed; not accessible; any access causes an access violation. The process can reserve or commit it via `VirtualAlloc` / `VirtualAllocEx`.
- **Reserved** — The range is set aside for future use and cannot be used by other allocations, but there is **no physical storage** (no RAM, no page file) backing it yet. Access is still invalid. Reserved pages do not count toward **commit charge** until they are committed.
- **Committed** — The kernel has **charged** the allocation against the system’s **commit limit** (physical RAM + page file). The page is **backed** by either RAM or the page file. It is accessible (subject to protection flags). The important distinction: **commit** happens when the application (or heap) calls `VirtualAlloc` to commit (or reserve+commit); **physical memory** is only used when the page is **first accessed** and the Memory Manager **faults it in**.

**Commit charge and commit limit:** **Commit charge** is the total amount of virtual memory that has been **committed** across all processes — i.e. that the kernel has promised to back with RAM or page file. It is **potential** usage: committing increases commit charge immediately, but the corresponding physical memory (or page file space) is consumed when pages are actually **touched** and brought into a **working set**. The **commit limit** is the sum of the size of physical RAM available for pageable content plus the current **page file** size(s). If commit charge approaches the commit limit, the system may deny new commits or expand the page file if configured to do so.

**Working set:** The **working set** of a process is the set of **committed, pageable** pages in its virtual address space that are **currently resident in physical memory** (see [Working Set - Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/memory/working-set)). Nonpageable allocations (e.g. AWE, large pages) are not part of the working set. When a process **references** a committed page that is **not** in its working set, a **page fault** occurs. The kernel’s page-fault handler then:

- **Soft page fault** — The page might be already in RAM (e.g. in a **transition** list, or in another process’s working set, or demand-zero). The handler can resolve the fault without reading from disk and adds the page to the process’s working set.
- **Hard page fault** — The page must be read from a **backing store**: the **page file** or a **memory-mapped file**. The handler reads it (possibly writing out another page first), then adds it to the working set.

So: **working set** is “what is in RAM right now” for that process; **commit charge** is “what has been promised to be backable.” Pages enter the working set on first access (or when prefetched); they leave when the Memory Manager **trims** the working set (to free RAM for other processes or the system), when the process unmaps or decommits, or when the process calls `SetProcessWorkingSetSizeEx` / `EmptyWorkingSet`. When a page is removed from all working sets that were using it, it can become a **transition** page (cached in RAM until reused or repurposed); if it was modified (“dirty”), it must be written to the backing store before the frame can be reused. Each process has configurable **minimum and maximum working set sizes** that influence how aggressively the Memory Manager trims.

**Page file:** The **page file** (e.g. `C:\pagefile.sys`) is the on-disk backing store for committed private memory that is not backed by a memory-mapped file. When RAM is under pressure, the Memory Manager can **page out** pages from working sets to the page file; later, a hard page fault brings them back. So at a deep level: **virtual address** → **page table** → either **physical frame** (in working set) or **invalid** (not present); on access to an invalid but committed page, the fault handler loads from backing store (page file or mapped file) into a frame and updates the page table.

**References:** [Page State (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/memory/page-state), [Working Set (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/memory/working-set), [Commit charge (Wikipedia)](https://en.wikipedia.org/wiki/Commit_charge).

**Inspect memory:**

```powershell
# System: total visible RAM (KB), free physical (KB)
Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory

# Page file usage (each page file: path, alloc base size, current size)
Get-CimInstance Win32_PageFileUsage | Format-List *

# Process working set (pages currently resident in RAM for that process)
Get-Process | Select-Object Name, Id, WorkingSet64 | Sort-Object WorkingSet64 -Descending

# Top 10 by working set (MB)
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, Id, @{N='WS(MB)';E={[math]::Round($_.WorkingSet64/1MB,2)}}
```

**Configure page file:** **System** → **Advanced system settings** → **Performance** → **Settings** → **Advanced** → **Virtual memory** → **Change**. Set custom initial/maximum size or “System managed.” Scripting: WMI `Win32_PageFileSetting`; some changes require reboot.

---

## Storage and volumes

**Command Prompt:**

```cmd
diskpart
wmic logicaldisk get name,size,freespace
dir C:\
```

**PowerShell:**

```powershell
# Drives and free space
Get-PSDrive -PSProvider FileSystem
Get-Volume
Get-Volume | Format-Table DriveLetter, FileSystemLabel, Size, SizeRemaining -AutoSize

# Disk usage (folder)
Get-ChildItem -Path C:\Data -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
```

### Disks and partitions (PowerShell)

Use **Get-Disk**, **Get-Partition**, **Get-Volume** to inspect; **Disk Management** (diskmgmt.msc) or **diskpart** for GUI/scripted partitioning. For scripting new disks:

```powershell
# List disks and partition style (GPT/MBR)
Get-Disk
Get-Disk -Number 1 | Get-Partition
Get-Partition -DiskNumber 1

# Initialize disk and create partition (example; destructive)
# Initialize-Disk -Number 1 -PartitionStyle GPT
# New-Partition -DiskNumber 1 -UseMaximumSize -DriveLetter E
# Format-Volume -DriveLetter E -FileSystem NTFS -NewFileSystemLabel "Data"
```

**Storage Spaces** (software RAID-like) and **Hyper-V** virtual disks are covered in [Virtualization and storage advanced](./4_Virtualization_And_Storage_Advanced.md).

### Performance: counters and process memory

**Performance counters** — CPU, memory, disk, and network metrics via **Get-Counter** or **Performance Monitor** (perfmon.msc).

```powershell
# One-off sample
Get-Counter '\Processor(_Total)\% Processor Time', '\Memory\Available MBytes' -SampleInterval 1 -MaxSamples 3

# Process memory (working set)
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, Id, @{N='WS(MB)';E={[math]::Round($_.WorkingSet64/1MB,2)}}
```

**Task Manager** (taskmgr) and **Resource Monitor** (resmon) give a GUI view of processes, memory, disk I/O, and network. For scripting, **Get-Process** and **Get-Counter** are the main tools.

---

## Kernel optimization and performance (Windows)

Windows does not expose a single “sysctl-style” interface. Tuning is done via **power plans**, **virtual memory**, **performance options**, and (advanced) **registry** or **group policy**.

**Power plans** — Control CPU frequency, display, sleep. **High performance** keeps CPU from throttling; **Balanced** is default. Use **powercfg** to list and set:

```powershell
# List power plans and active one
powercfg /list
powercfg /getactivescheme

# Set high performance (GUID from list)
powercfg /setactive <scheme-guid>
# Common: powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c  (High performance)
```

**Virtual memory** — See “Memory management” above. Increasing page file size (or enabling system-managed) can reduce “out of memory” when commit is high; placing the page file on a fast disk can help under memory pressure.

**Performance options** — **System** → **Advanced system settings** → **Performance** → **Settings**. Options include: **Adjust for best performance** (fewer visual effects), **Processor scheduling** (e.g. favor programs vs background services), **Virtual memory** (page file). For servers, “Adjust for best performance” and “Programs” for processor scheduling are common.

**Registry / policy** — Some behaviors are tunable only via registry or Group Policy (e.g. **LargeSystemCache** under `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management` for file server behavior, **IoPriority** for I/O priority). Use only from documented sources (e.g. Microsoft, performance guides); wrong values can destabilize the system.

So **kernel optimization on Windows**: power plan, virtual memory, performance options, and selective registry/policy; no single command like Linux **sysctl**.

---

## Storage scripting (PowerShell)

Scripting storage tasks for automation and DevOps:

```powershell
# List volumes and free space (for monitoring/scripts)
Get-Volume | Where-Object { $_.DriveLetter } | Select-Object DriveLetter, FileSystemLabel, @{N='SizeGB';E={[math]::Round($_.Size/1GB,2)}}, @{N='FreeGB';E={[math]::Round($_.SizeRemaining/1GB,2)}}

# Disk usage of a folder (recursive size)
$path = "C:\Data"
(Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB

# Initialize disk, new partition, format (destructive; example)
# Initialize-Disk -Number 1 -PartitionStyle GPT
# New-Partition -DiskNumber 1 -UseMaximumSize -DriveLetter E
# Format-Volume -DriveLetter E -FileSystem NTFS -NewFileSystemLabel "Data"

# Resize partition (expand into free space; requires admin)
# Get-Partition -DiskNumber 1 -PartitionNumber 2 | Resize-Partition -Size (Get-PartitionSupportedSize -DiskNumber 1 -PartitionNumber 2).SizeMax

# Check volume health (basic)
Get-Volume | Format-Table DriveLetter, HealthStatus, FileSystemLabel -AutoSize
```

**Storage Spaces** (pool, virtual disk, format) are scripted in [Virtualization and storage advanced](./4_Virtualization_And_Storage_Advanced.md). For **backup/restore** and **robocopy** scripts, see [Windows commands and PowerShell](./1_Windows_Commands_And_PowerShell.md) and automation docs.

---

## Summary

- **CPU scheduling (deep):** Dispatcher runs on events (thread ready/block/quantum/priority change). Thread states: Running, Ready, Waiting. **Base priority** 0–31 (process class + thread level); **dynamic priority** boosted (foreground, input, I/O completion) and decayed (one level per time slice) for base 1–15; round-robin within priority; strict preemption. **Quantum** = time slice.
- **Process synchronization (deep):** **Dispatcher objects** (event, mutex, semaphore, timer, thread) have Signaled/Not-Signaled state. Wait → thread in Waiting, on object’s wait queue; signal → kernel moves waiter(s) to Ready. Mutex: one owner; semaphore: count; event: one or many waiters depending on type. Critical section: user-mode, in-process.
- **Deadlock:** No automatic detection; observe with Resource Monitor, **Analyze wait chain**, Sysinternals Handle; recover by terminating process.
- **Multithreading:** Thread = unit of scheduling (KTHREAD, ready queue); **Get-Process** Threads, Task Manager, Resource Monitor; thread pool in apps.
- **Memory management (deep):** Page states **Free / Reserved / Committed**. **Commit charge** = promised backing (RAM + page file); **working set** = pages resident in RAM. Page fault (soft: already in RAM/transition; hard: load from page file/mapped file) adds page to working set. Trimming, transition pages, min/max working set.
- **Kernel optimization:** Power plans (powercfg), virtual memory, Performance options, registry/policy.
- **Storage scripting:** Get-Volume, Get-Disk, Get-Partition, Format-Volume, Resize-Partition; Storage Spaces in topic 4.
- **Processes:** tasklist, Get-Process, Stop-Process; **Storage:** Get-Volume, Get-Counter.

---

## Further reading

**Scheduling and synchronization (system level):**

- [Scheduling Priorities (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities) — Base priority, priority class, thread priority level, round-robin, preemption.
- [Priority Boosts (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/procthread/priority-boosts) — Dynamic priority, when the system boosts and how it decays.
- [Introduction to Kernel Dispatcher Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-kernel-dispatcher-objects) — Dispatcher object states (Signaled/Not-Signaled), wait and ready behavior.
- [Semaphore Objects](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/semaphore-objects), [Event Objects](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/event-objects) — Kernel semaphore and event semantics.
- [Process and Thread Objects (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/process-and-thread-objects) — Kernel process and thread structures.

**Memory (system level):**

- [Page State (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/memory/page-state) — Free, Reserved, Committed page states.
- [Working Set (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/memory/working-set) — Working set definition, page faults (hard/soft), trimming, min/max working set.
- [Commit charge (Wikipedia)](https://en.wikipedia.org/wiki/Commit_charge) — Commit charge vs commit limit.

**Commands and tools:**

- [PowerShell: Get-Process](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process)
