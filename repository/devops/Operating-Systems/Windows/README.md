# Windows (implementation)

**How Windows implements OS fundamentals.** Assume you have read [Fundamentals](../Fundamentals/README.md). Windows is not only PowerShell: beneath the shell are the **NT kernel**, **file system layout**, **boot process**, **registry**, and **structure** (Executive, HAL, drivers, services). We cover that foundation first, then **commands and tools** for DevOps.

## Where Windows implements OS fundamentals

| Concept | How Windows does it | Topic |
|--------|----------------------|-------|
| **CPU scheduling** | Thread-based; priority classes (Idle → Realtime), base priority 0–31, quantum; Task Manager Set priority | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#cpu-scheduling-windows) |
| **Process synchronization** | Mutex, semaphore, event, critical section (kernel/user-mode); kernel enforces wait/signal | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#process-synchronization-windows) |
| **Deadlock management** | No automatic detection; observe with Resource Monitor, Analyze wait chain; recover by terminating process | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#deadlock-management-windows) |
| **Multi-threading** | Thread = unit of scheduling; thread pool API; view with Get-Process Threads, Task Manager, Resource Monitor | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#multi-threading-windows) |
| **Memory management** | Virtual memory, working set, page file, commit charge; page file config; Get-CimInstance, Get-Process WorkingSet64 | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#memory-management-windows) |
| **Storage / storage scripting** | Volumes, partitions, Format-Volume, Get-Volume; Storage Spaces (RAID-like); scripting with PowerShell | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#storage-scripting-powershell), [Virtualization and storage advanced](./4_Virtualization_And_Storage_Advanced.md) |
| **User management** | Local: net user, Get-LocalUser, New-LocalUser, Add-LocalGroupMember; lusrmgr.msc | [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md#user-management-local) |
| **Networking and firewall** | ipconfig, Test-NetConnection, Get-NetTCPConnection; Windows Defender Firewall (Get-NetFirewallRule, New-NetFirewallRule) | [Services and networking](./2_Services_And_Networking.md) |
| **Virtualization** | Hyper-V (Type 1), VirtualBox (Type 2); New-VM, New-VHD; Storage Spaces for software RAID-like | [Virtualization and storage advanced](./4_Virtualization_And_Storage_Advanced.md) |
| **Logging (how to check)** | Windows Event Log; Get-WinEvent, wevtutil; System, Application, Security logs; filter by time, level, ID | [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md#windows-event-log) |
| **Kernel optimization** | Power plans (powercfg), virtual memory, Performance options (visual effects, processor scheduling), registry/policy | [Process, memory, and storage](./3_Process_Memory_And_Storage.md#kernel-optimization-and-performance-windows) |
| **Security** | Group Policy, Windows Defender, audit policy (Security log); gpresult, auditpol, Get-MpComputerStatus | [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md#security-from-the-os-view-windows) |

**Factual basis:** The “How the system does it (deep level)” content in the Windows topic files is drawn from **official Microsoft documentation** (e.g. [Scheduling Priorities](https://learn.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities), [Priority Boosts](https://learn.microsoft.com/en-us/windows/win32/procthread/priority-boosts), [Kernel Dispatcher Objects](https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-kernel-dispatcher-objects), [Page State](https://learn.microsoft.com/en-us/windows/win32/memory/page-state), [Working Set](https://learn.microsoft.com/en-us/windows/win32/memory/working-set)). Topic files cite these in the text and in **Further reading**.

## Topics

| # | Topic | Description |
|---|--------|-------------|
| 0 | [**Windows architecture and structure**](./0_Windows_Architecture_And_Structure.md) | **Foundation:** NT kernel, user vs kernel mode, Executive, HAL, drivers; NTFS and directory layout (C:\Windows, Program Files, Users); boot (BOOTMGR, BCD, winload, ntoskrnl, smss); registry hives; client vs server editions |
| 1 | [Windows commands and PowerShell](./1_Windows_Commands_And_PowerShell.md) | cmd vs PowerShell, essential commands, pipeline, scripting, WSL, PowerShell 7 |
| 2 | [Services and networking](./2_Services_And_Networking.md) | Windows services (sc, Get-Service), networking (ipconfig, Test-NetConnection), firewall, cross-platform |
| 3 | [Process, memory, and storage](./3_Process_Memory_And_Storage.md) | Processes (tasklist, Get-Process), memory, volumes and storage |
| 4 | [Virtualization and storage advanced](./4_Virtualization_And_Storage_Advanced.md) | Hyper-V and VirtualBox on Windows; Storage Spaces (software RAID-like) |
| 5 | [Event logs, security, and WSL](./5_Event_Logs_Security_And_WSL.md) | Windows Event Log (Get-WinEvent, wevtutil); Group Policy, Defender, audit; WSL 2 in depth for DevOps |

---

## Adding topics

New Windows topics can be added as numbered files and linked from this README. Community-maintained.
