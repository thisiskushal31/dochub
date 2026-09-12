# Windows architecture and structure

[← Back to Windows](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals](../Fundamentals/README.md). Here: **how Windows is structured beneath the surface** — the NT kernel, user and kernel mode, file system layout, boot process, registry, and how Windows differs by edition and machine type. This is the foundation; for commands and tools see [Windows commands and PowerShell](./1_Windows_Commands_And_PowerShell.md) and the other Windows topics.

---

## Why this topic

Windows is not only PowerShell and commands. Like Linux, it has a **kernel**, a **file system layout**, a **boot process**, and a **structure** (registry, drivers, services) that runs beneath every application. Understanding that structure helps you troubleshoot, secure, and automate Windows in DevOps. This topic describes how Windows works at the OS level; the rest of the Windows section covers what you do from the shell and tools.

---

## For complete beginners: terms you’ll see

If you’re new to operating systems, these definitions may help. You can return to them anytime.

- **File system** — The way an operating system organizes and stores files and folders on a disk (or disc). It defines where data lives, how it’s named, and how the OS finds it. Different kinds of storage (hard drive, USB stick, CD) often use different file systems.
- **Drive letter** — A letter plus a colon (e.g. **C:**, **D:**) that Windows uses as a shortcut for a **volume**. Your main Windows disk is usually **C:**. A USB drive or DVD might be **D:** or **E:**. “Open C:\” means “open the root of the drive that Windows calls C.”
- **Volume** — One logical “disk” that has a file system and (in Windows) usually a drive letter. One physical disk can be split into several volumes (partitions); each volume typically has one file system (e.g. NTFS or FAT32).
- **Partition** — A region of a physical disk that is used as one unit. A partition is usually formatted with a file system and then used as a volume (e.g. “drive C:”).
- **Kernel** — The core of the operating system that talks directly to the hardware (CPU, memory, disks). Applications don’t talk to the hardware themselves; they ask the kernel to do it. “Kernel mode” means code running inside this core, with full access; “user mode” means applications and some OS components that run with limited access and must go through the kernel.

- **32-bit and 64-bit** — These refer to how the processor and operating system handle data and memory. A **64-bit** Windows can use more memory (RAM) and run both 64-bit and 32-bit programs. A **32-bit** Windows can only run 32-bit programs and is limited to a few GB of RAM. When you see “System32” and “SysWOW64” on a 64-bit Windows, the names are historical: **System32** holds 64-bit system files, and **SysWOW64** holds 32-bit system files so older 32-bit apps keep working.

Acronyms and product names (e.g. **NTFS**, **CDFS**, **PowerShell**) are explained in the sections where they appear.

---

## NT kernel: user mode and kernel mode

Windows is built on the **Windows NT** architecture. The system is split into two **privilege levels**:

- **User mode (ring 3)** — Applications and some OS components run here. They have no direct access to hardware or kernel memory and must ask the kernel to perform privileged operations.
- **Kernel mode (ring 0)** — The kernel, drivers, and core OS services run here with full access to hardware and memory.

So: **user mode** is where your apps and many subsystems live; **kernel mode** is where the NT kernel, the **Executive**, the **Hardware Abstraction Layer (HAL)**, and **kernel-mode drivers** run. User-mode code cannot touch hardware or kernel data structures directly; it calls into kernel mode via **system calls** (implemented in the Executive and exposed through the Windows API).

---

## Kernel mode: Executive, kernel, HAL, drivers

**Executive** — The main kernel-mode component is often referred to as the **Executive**. It is implemented in **ntoskrnl.exe** (and on some builds **ntkrnlmp.exe** for multiprocessor). It provides:

- **Object Manager** — Manages named objects (files, processes, threads, events, etc.) and a global **object namespace**. Other subsystems use it to create and reference resources.
- **Process and thread management** — Process and thread creation/termination, **jobs** (groups of processes with shared limits).
- **Memory Manager** — Virtual memory, paging, address space layout; works with the **Cache Manager** for file caching.
- **I/O Manager** — Builds **I/O Request Packets (IRPs)** and passes them to device and file system drivers. Handles synchronous and **asynchronous I/O**.
- **Cache Manager** — Caches file data in memory; coordinates with the Memory Manager and file system drivers.
- **Configuration Manager** — Implements the **registry** (read/write of hives and keys).
- **Security Reference Monitor (SRM)** — Enforces security: checks **access control lists (ACLs)** and **security identifiers (SIDs)** before allowing access to objects.
- **Plug and Play (PnP) Manager** — Detects and loads drivers for hardware; supports hot-plug (e.g. USB).
- **Power Manager** — Handles power events (sleep, hibernate, shutdown) and notifies drivers.

**Kernel** — A layer below the Executive (still in kernel mode) that handles **scheduling**, **interrupt and exception dispatching**, **multiprocessor synchronization**, and **trap handling**. It initializes boot-time device drivers. The Executive calls into the kernel for these low-level operations.

**Hardware Abstraction Layer (HAL)** — **hal.dll** (or merged into ntoskrnl on newer Windows) abstracts hardware differences (e.g. interrupt controllers, timers, buses). Drivers and the kernel use the HAL so the same OS can run on different hardware without changing high-level code.

**Kernel-mode drivers** — Layered: **highest** (e.g. file system drivers like **NTFS.sys**), **intermediate** (e.g. **Windows Driver Model (WDM)** function and filter drivers), **lowest** (bus drivers, legacy drivers that talk to hardware). All see devices as **device objects**; the I/O Manager routes IRPs through this stack.

```
  User mode:  Applications  →  Environment subsystems (e.g. Win32 / csrss.exe)  →  ntdll.dll (system call stub)
       │
       ▼  (system call / trap)
  Kernel mode:  Executive (ntoskrnl.exe)  →  Kernel  →  HAL  →  Hardware
                     │
                     ├── Object Manager, Memory Manager, I/O Manager, Cache Manager
                     ├── Configuration Manager (registry), SRM, PnP, Power
                     └── Kernel-mode drivers (file systems, devices)
```

---

## User mode: environment subsystems and integral subsystems

**Environment subsystems** — They expose an **API** to applications (e.g. Win32, historically OS/2, POSIX). Applications call into these APIs; the subsystem translates requests and either calls **ntdll.dll** to trap into kernel mode or talks to other user-mode components. The main one in modern Windows is the **Win32** subsystem, implemented by **Client/Server Runtime Subsystem (csrss.exe)** and supporting DLLs.

**Integral subsystems** — They perform system-wide functions. The **Local Security Authority (LSA)**, for example, handles **authentication**, **logon**, and **security tokens**. The **Service Control Manager (SCM)** starts and manages **Windows services**. These run in user mode but have privileges and work closely with the kernel (e.g. SRM).

So: **applications** run in user mode and call the **Win32 API** (or another subsystem); the **Executive** and **kernel** run in kernel mode and do the real work; the **registry**, **services**, and **security** are part of this layered design.

---

## File system: what it is and what Windows uses

**What is a file system?**  
A **file system** is the set of rules and structures the OS uses to store and find files and folders on a disk. It answers: where is this file stored? what can it be named? who can read or change it? Windows supports several file systems; which one is used depends on the type of storage (internal disk, USB stick, CD, DVD) and whether the disk is shared with other devices (e.g. cameras, game consoles).

**File systems you’ll see on Windows** — Brief overview (full names and where you see them):

| Name | Full name / meaning | Where you see it | Read-only? | Notes |
|------|---------------------|------------------|------------|-------|
| **NTFS** | NT File System | Internal hard drives, main Windows drive (usually C:) | No | Default for Windows; supports permissions, encryption, large files. |
| **FAT32** | File Allocation Table 32 | Old USB sticks, some memory cards, older external drives | No | Simple; works on many devices; single file cannot exceed 4 GB. |
| **exFAT** | Extended FAT | Newer USB drives, large memory cards, flash drives | No | Like FAT32 but without the 4 GB file limit; good for big files and cross‑device use. |
| **CDFS** | Compact Disc File System | CD-ROM discs | Yes | Used when you insert a **CD**; based on **ISO 9660**. Windows reads it via **Cdfs.sys**. Read-only in normal use. |
| **UDF** | Universal Disk Format | DVDs, some CDs | Read/write on writable discs | Common on **DVDs**; supports larger capacity and longer filenames than classic CDFS. |
| **ReFS** | Resilient File System | Some Server and high-end Windows setups | No | Newer Microsoft file system for large, reliable storage; automatic checks and repair; not used as the main Windows drive on typical PCs. |

**CDFS in a bit more detail** — **CDFS** stands for **Compact Disc File System**. It is the file system Windows uses to read **CD-ROM** discs. When you put a CD in the drive, Windows uses **Cdfs.sys** (the CDFS driver) to show you the files and folders on the disc. The format is based on **ISO 9660**, an international standard for how data is laid out on a CD. CDFS is **read-only**: you can copy files from the CD to your hard drive, but you don’t “save” back to the CD through CDFS in normal use. For **DVDs**, Windows often uses **UDF** instead. CDFS is legacy now (optical discs are less common), but you may still see it when working with CDs or old documentation.

**NTFS (default on your main disk)** — On the drive where Windows is installed (usually **C:**), the file system is almost always **NTFS**. It supports:

- **Journaling** — A log of metadata changes so the OS can recover consistency after a crash.
- **ACLs (access control lists)** — Permissions per file and folder (who can read, change, or run).
- **Encryption** — Per-file **Encrypting File System (EFS)**.
- **Compression** — Per-file or per-directory transparent compression.
- **Reparse points** — Used for symbolic links, junction points, and other special behavior.
- **Alternate data streams (ADS)** — Extra named streams attached to a file. Each file has at least one stream (`$DATA`); ADS lets a file hold additional streams. Windows Explorer does not show ADS; PowerShell and other tools can. Legitimately used (e.g. to mark files downloaded from the Internet); malware has also used ADS to hide data.
- **Volume Shadow Copy** — Snapshots for backup and “previous versions.”
- **Large volumes and files** — Modern NTFS supports very large volumes and file sizes (limits depend on Windows version).

**NTFS permissions (basic)** — On NTFS volumes you can grant or deny access per file or folder. The standard permissions are: **Full control**, **Modify**, **Read & execute**, **List folder contents** (folders), **Read**, **Write**. To view them: right‑click the file or folder → **Properties** → **Security** tab → select the user or group in “Group or user names” to see their permissions. Special permissions and inheritance can be configured from the same tab.

**Directory layout (typical)** — Windows uses **drive letters** (e.g. **C:**) as the root of a volume. Under **C:\** you typically see:

| Path | Purpose |
|------|---------|
| **C:\Windows** | Operating system files: kernel, drivers, system DLLs, fonts, drivers store. |
| **C:\Windows\System32** | 64-bit system binaries and libraries (on 64-bit Windows). |
| **C:\Windows\SysWOW64** | 32-bit system binaries and libraries (on 64-bit Windows). “WOW64” = **W**indows **32**-bit **o**n **W**indows **64**-bit — this folder holds the 32-bit versions so older 32-bit programs still work. On a 32-bit Windows there is no SysWOW64. |
| **C:\Program Files** | 64-bit installed applications (on 64-bit Windows). |
| **C:\Program Files (x86)** | 32-bit installed applications (on 64-bit Windows). |
| **C:\Users\<username>** | User profile: Desktop, Documents, AppData (roaming, local, LocalLow), etc. |
| **C:\ProgramData** | Machine-wide application data (all users). |
| **C:\PerfLogs** | Performance logs (optional). |
| **C:\Windows\Temp** | System temporary files. |

**AppData (application data)** — Per-user application data lives under **C:\Users\<username>\AppData**. This folder is often **hidden**; use Folder Options to show hidden files. It has three subfolders: **Local** (machine-specific, not roamed), **LocalLow** (low-integrity apps), and **Roaming** (roamed with the user profile in domain environments). On Windows XP the equivalent was `C:\Documents and Settings\<user>\Application Data` and `Local Settings\Application Data`. The **\[User]** segment is usually the account name (e.g. Owner or your login name).

Paths are case-insensitive by default. The system environment variable for the Windows folder is **%windir%** (or **%SystemRoot%**); both usually expand to **C:\Windows**. Environment variables store information about the OS environment (paths, number of processors, temp folders, etc.) and are used in scripts and configs. **C:\Windows\System32** holds critical OS files; many built-in and admin tools live here. Deleting or changing files in System32 can make Windows unbootable or unstable — use extreme caution.

---

## Desktop (GUI) and where to change settings

**Common Windows terms** — The **desktop** is the background of your screen on which programs run (think of it as your electronic desktop). **Icons** are the small pictures on the desktop and in folders that represent programs, folders, or files. **Folders** are containers for files and other folders (sub-folders). The **title bar** is the bar at the top of an open window; it shows the window’s purpose and has minimize, maximize, and close buttons — you can drag it to move the window. The **cursor** is the on-screen pointer that changes shape with context (arrow, I-beam for text, double-arrow for resizing). The **taskbar** is usually at the bottom and contains the **Start** button (Windows logo), open apps, and the **notification area** (clock, network, volume). A **scroll bar** appears when content doesn’t fit in the window (vertical or horizontal); Windows 10/11 often hide scroll bars until you hover. The **address bar** in File Explorer shows your location and can show a **breadcrumb** path (e.g. `Owner > Documents > Backups`); clicking behind it can switch to the full path (e.g. `C:\Users\Owner\Documents\Backups`). Other operating systems (e.g. Mac, Linux) use much of the same terminology.

**Desktop and taskbar** — After you log in, you see the **desktop** (shortcuts, icons, wallpaper) and the **taskbar** (usually at the bottom). The **Start** button opens the **Start Menu**: apps, settings, power options, and user account shortcuts. The **notification area** (system tray), typically bottom-right, shows the clock, network, volume, and other icons. You can right‑click the desktop or taskbar to change display settings, personalize the desktop, or show/hide items (e.g. Search box, Task View). These pieces together form the **graphical user interface (GUI)**.

**Right-click and context menus** — **Left-click** selects items and is used most of the time. **Right-click** opens a **context-sensitive menu** of actions for that item (the list varies by what you clicked). Useful shortcuts: right‑click **Desktop** → **Personalize** (icons, background, sounds, screen saver), **Screen resolution** (display settings); right‑click **This PC / Computer** → **Properties** (system info, device manager, remote settings), **Manage** (Computer Management, including Device Manager); right‑click **Task bar** → **Taskbar and Start Menu** settings, **Task Manager** (to close hung programs). On **Windows 10/11**, right‑clicking the **Start** button gives quick access to **Settings**, **Device Manager**, **Event Viewer**, **Disk Management**, **Computer Management**, **PowerShell**, **Task Manager**, **Run**, and **Shut down or sign out**. Only change options here if you understand the consequences — misconfiguring can damage the installation.

**Window elements (File Explorer)** — A typical folder window includes a **navigation pane** (quick links to locations), **title bar**, **address bar** (with breadcrumbs or full path), and in Windows 10 the **Ribbon** (toolbar with View, etc.). Many system and app data folders are **hidden by default**. To show them: **Control Panel** → **Folder Options** (or **File Explorer Options** in Windows 10) → **View** tab → select “Show hidden files, folders and drives.” Unhidden items often appear slightly translucent. Be careful when changing system files or folders — you can damage data or settings.

**Settings vs Control Panel** — Windows has two main places to change system options. **Settings** (Windows 10/11) is the primary, modern place: open it from the Start Menu (gear icon) or search for “Settings.” Use it for display, network, accounts, updates, and most day‑to‑day changes. The **Control Panel** is the older, more advanced location: uninstall programs (**Programs and Features**), manage network adapters (“Change adapter options”), and access some legacy and power-user options. You can open Control Panel from Start (search “Control Panel”) or by running **control**. In some flows, Settings links through to Control Panel for specific tasks. If you’re unsure where a setting lives, search for it from the Start Menu.

**Task Manager** — **Task Manager** shows running applications and processes, and resource use (CPU, RAM). Open it with **Ctrl+Shift+Esc** or right‑click the taskbar → **Task Manager**. The default “Simple” view lists apps; click **More details** for the full view (Processes, Performance, App history, Startup, Users, Details). Use it to end unresponsive programs, check which process is using CPU or memory, or manage startup items.

**Legacy menus and keyboard** — In older or classic apps, menus often follow **File** (open, close, print), **Edit** (copy, paste), **View** (toolbars, display), **Help** (About for version). **Keyboard shortcuts** work in many apps: **Ctrl+P** (print), **Ctrl+N** (new window), **Ctrl+B** / **Ctrl+I** / **Ctrl+U** (bold, italic, underline). Many modern apps hide menus and use a **hamburger** (≡) or **ellipsis** (⋮ or …) icon for options.

---

## Boot process (Windows NT, Vista and later)

On modern Windows (Vista and later), the boot sequence is roughly:

1. **Firmware (UEFI or BIOS)** — POST, load firmware settings, find the boot device. On UEFI systems, the **EFI System Partition** holds boot loaders.
2. **Windows Boot Manager (BOOTMGR)** — The firmware runs the Windows Boot Manager, which reads **Boot Configuration Data (BCD)** from the **BCD store** (e.g. **\Boot\BCD**). BCD lists boot entries (Windows loader, optional other OSes).
3. **Windows OS Loader (winload.efi / winload.exe)** — Boot Manager loads the OS loader. The loader reads the registry (from disk), loads **ntoskrnl.exe** and **hal.dll**, and loads **boot-start** drivers. Control is then transferred to the kernel.
4. **Kernel and Executive** — **ntoskrnl.exe** initializes the kernel and Executive, loads the **system registry hive** and remaining drivers, and starts the **Session Manager**.
5. **Session Manager (smss.exe)** — Creates the system session, starts **csrss.exe** (Win32 subsystem) and **wininit.exe**. **wininit** starts **services.exe** (Service Control Manager), **lsass.exe** (LSA), and **lsm.exe** (Local Session Manager).
6. **Logon** — **winlogon.exe** presents the logon UI. After a user logs on, **User and Computer Group Policy** are applied and **startup** programs (from registry and Startup folders) run.

So: **firmware → Boot Manager → BCD → winload → ntoskrnl + boot drivers → smss → csrss, wininit → services, lsass → winlogon → logon and startup**. Understanding this helps when diagnosing boot failures (e.g. BCD corruption, driver failure, or service hang).

---

## Registry

The **registry** is a hierarchical database that holds configuration for the system, hardware, services, and applications. It is implemented in kernel mode (Configuration Manager) and exposed via the Windows API. User mode and drivers read/write it through the API; there is no “registry shell” the way there is a file system.

**Main hives (logical roots)**:

| Hive | Abbreviation | Purpose |
|------|--------------|---------|
| **HKEY_LOCAL_MACHINE** | HKLM | Machine-wide: hardware, system, software, security, SAM. Same for all users. |
| **HKEY_CURRENT_USER** | HKCU | Current user’s settings (profile). Loaded from **Ntuser.dat** when the user logs on. |
| **HKEY_USERS** | HKU | All loaded user profile hives; **.DEFAULT** is the default user. |
| **HKEY_CLASSES_ROOT** | HKCR | File associations and COM class info; typically a merged view of HKLM and HKCU. |
| **HKEY_CURRENT_CONFIG** | HKCC | Current hardware profile (runtime; built from HKLM\System\CurrentControlSet\Hardware Profiles). |

**Backing files** — Hive data is stored in files. Machine hives live under **%SystemRoot%\System32\Config\** (e.g. **SAM**, **Security**, **Software**, **System**; **Default**, **DRIVERS**). User hive is **Ntuser.dat** in the user’s profile directory. Supporting **.log** files are transaction logs; **.sav** are backups from setup. Editing the registry incorrectly can make the system unbootable; use **Group Policy** or documented APIs where possible.

---

## Editions and machine types

Windows comes in **client** and **server** editions. What you can do (e.g. Hyper-V, Group Policy, domain join, maximum RAM) depends on the **SKU** and **edition**.

**Client (workstation)** — **Home** (consumer), **Pro** (domain join, Group Policy, BitLocker, Hyper-V, RDP host), **Pro for Workstations** (high-end hardware), **Enterprise** (volume license; advanced security, longer support), **Enterprise LTSC** (long-term servicing; minimal feature updates), **Education**. On a **client** machine you typically run apps and connect to servers; server roles (e.g. Active Directory, full Hyper-V clustering) are limited or absent.

**Server** — **Windows Server Standard** and **Datacenter** (and **Datacenter: Azure Edition** for Azure). **Datacenter** includes features such as **Storage Spaces Direct**, **Host Guardian**, and **unlimited virtual instances** (under license). **Standard** has a more limited feature set and virtualization rights. Server is used for file, DNS, AD, Hyper-V, and other roles.

So: **how Windows works on each type of machine** depends on **edition** (client vs server, Home vs Pro vs Enterprise, Standard vs Datacenter). The **kernel and structure** (Executive, NTFS, registry, boot) are the same; the **features and licensing** differ.

---

## User accounts, UAC, and Safe Mode (beginners)

**User accounts** — Windows distinguishes between users. An **Administrator** account can install software, change system settings, and manage other users. A **standard user** has limited rights (e.g. can’t install for all users or change security settings). This separation protects the system: most of the time you run as a standard user; when you need to do something that affects the whole machine, you either log in as an administrator or elevate (see UAC). To view or manage local users and groups, open **Local User and Group Management** by pressing **Win+R**, typing **lusrmgr.msc**, and pressing Enter. There you see **Users** and **Groups**; users can be assigned to groups and inherit that group’s permissions.

**User profiles** — When a user account is created, a **profile** is created for that user. The profile folder is **C:\Users\<username>** (e.g. **C:\Users\Max**). It is created on the user’s **first logon** (you may see “User Profile Service” or similar during that process). Each profile contains standard folders such as **Desktop**, **Documents**, **Downloads**, **Music**, **Pictures**, and **AppData** (roaming, local, LocalLow) for application data.

**UAC (User Account Control)** — When a program needs to do something that requires administrator rights (e.g. install an app, change a firewall rule), Windows shows a prompt: “Do you want to allow this app to make changes to your device?” That’s **UAC**. It’s the boundary between normal (user) and elevated (administrator) actions. You can accept or cancel. For automation (e.g. scripts that change system settings), you often run PowerShell or the script “as Administrator” (right‑click → Run as administrator) so that the process is already elevated and UAC doesn’t prompt again for that window.

**Safe Mode** — If Windows won’t start normally (e.g. after a bad driver or update), you can boot into **Safe Mode**: a minimal mode that loads only essential drivers and services. From there you can uninstall a driver, undo a change, or run troubleshooting tools. How you get there depends on the Windows version (e.g. hold Shift while clicking Restart, then Troubleshoot → Advanced options → Startup Settings → Safe Mode, or use installation media). See Microsoft’s troubleshooting docs for your Windows version.

---

## File extensions and safety

**What is a file extension?** — The **extension** is the part of the filename **after the last dot** (e.g. **readme.txt** → **txt**). It tells Windows the **type** of file so it can associate a default program (double‑click to open). Old DOS used **8.3** names (eight characters before the dot, three after; no spaces). Current Windows allows long names (e.g. up to 256 characters before the dot, several after) and spaces, but very long paths with many nested folders can cause copy/backup issues.

**Common extensions** — **.txt** (text), **.doc** / **.docx** (Word), **.xls** / **.xlsx** (Excel), **.ppt** / **.pptx** (PowerPoint), **.pdf** (Portable Document), **.html** (web page), **.jpg** (JPEG image), **.mp3** (audio), **.iso** (disc image). Many programs can open the same extension (e.g. LibreOffice for Office files; browsers for PDFs). To open a file with a different program: right‑click → **Open with** → choose program.

**Dangerous extensions** — Be careful with **.exe** (executable), **.bat** (batch script), **.scr** (script — often mistaken for screen saver), **.pif** (program information). These can run code and install malware. Don’t open them from untrusted email or downloads. Office documents (e.g. .docx) can also contain scripts; scan or avoid unexpected attachments.

**Hidden extensions (security)** — Windows **hides “known” extensions** by default. A file named **phonelist.txt.scr** may appear as **phonelist.txt**; opening it could run the .scr script. **Unhide extensions** so you see the real type: **Windows 10** — search “File Explorer Options” (or Control Panel → File Explorer Options) → **View** tab → clear “Hide extensions for known file types”; or in File Explorer open the **View** tab and check **File name extensions**. **Windows 11** — File Explorer → **View** → **Show** → **File name extensions**. Then you can see .scr, .exe, etc. and avoid opening dangerous files by mistake.

---

## System and hardware information

**Where to find it** — **Control Panel** → **System**, or right‑click **This PC / Computer** → **Properties**, or (Windows 10/11) right‑click **Start** → **System**. In Windows 10 the **build number** is under **Settings** → **Update & Security** → **OS build info**.

**What is shown** — **Windows edition** and version/service pack; **System** (processor, installed RAM, system type 32- or 64‑bit, pen/touch); **Computer name, domain, and workgroup**; **Windows activation** and Product ID. This is useful for support, licensing, and driver compatibility.

**RAM** — 32‑bit Windows typically cannot use more than about **2.5 GB** of RAM (the exact usable amount varies). 64‑bit can use much more. If the system is slow and the disk is constantly busy (**thrashing**), adding RAM often helps. Minimums are published per Windows version; meeting only the minimum may make the system sluggish — aim for more for normal use.

**Drivers** — For missing or updated drivers, use the **manufacturer’s site** (e.g. support.hp.com for HP). Avoid generic “driver update” tools and third‑party driver sites; stick to official sources to reduce malware and bad drivers.

---

## Summary

- **Windows is not only PowerShell** — Beneath the UI and shell are the **NT kernel**, **Executive** (object, memory, I/O, cache, registry, security, PnP, power), **kernel** (scheduling, interrupts), **HAL**, and **kernel-mode drivers**.
- **User mode** runs applications and subsystems (e.g. Win32); **kernel mode** runs the Executive and drivers. Applications use the **Windows API** and **system calls** to access kernel services.
- **File system** — **NTFS** is the default on the main disk (permissions: Full control, Modify, Read & execute, List folder contents, Read, Write; view via Properties → Security); **FAT32**, **exFAT**, **CDFS**, **UDF**, **ReFS** elsewhere. **%windir%** / **%SystemRoot%** = Windows folder; **System32** = critical OS files (use caution). Directory layout: **C:\Windows**, **System32**, **SysWOW64**, **Program Files**, **Users**, **ProgramData**, etc.
- **Desktop and settings** — **Common terms:** desktop, icons, folders, title bar, cursor, taskbar, scroll bar, address bar (breadcrumbs). **Right-click** context menus: Desktop (Personalize, Screen resolution), Computer (Properties, Manage), Task bar (Task Manager), Start (Windows 10/11: Device Manager, Event Viewer, Disk Management, PowerShell, etc.). **Hidden folders:** Folder Options → Show hidden files; **AppData** (Local, LocalLow, Roaming) under `C:\Users\<user>\AppData`. **Settings** is the main place to change options in Windows 10/11; **Control Panel** for advanced tasks. **Task Manager** (Ctrl+Shift+Esc) shows processes and resource use. **Legacy menus** (File/Edit/View/Help) and **keyboard shortcuts** (Ctrl+P, Ctrl+N); **hamburger**/ellipsis in modern apps.
- **File extensions** — Extension = part after the last dot; tells Windows file type and default program. **Unhide** extensions (File Explorer Options → View) to avoid opening dangerous files (e.g. .scr shown as .txt). **Dangerous:** .exe, .bat, .scr, .pif — don’t open from untrusted sources.
- **System and hardware** — **System** info: Control Panel → System or right‑click Computer/Start → System. Shows edition, CPU, RAM, 32/64‑bit, activation. **RAM:** 32‑bit ~2.5 GB limit; add RAM if thrashing. **Drivers:** use manufacturer site.
- **Boot** — Firmware → **BOOTMGR** → **BCD** → **winload** → **ntoskrnl** + boot drivers → **smss** → **csrss**, **wininit** → **services**, **lsass** → **winlogon** → logon and startup.
- **Registry** — **HKLM**, **HKCU**, **HKU**, **HKCR**, **HKCC**; backing files in **System32\Config** and **Ntuser.dat**.
- **User accounts and profiles** — **Administrator** vs **standard user**; **UAC** for elevation; **lusrmgr.msc** for local users and groups; profiles under **C:\Users\<username>** (created on first logon).
- **Editions** — **Client** (Home, Pro, Enterprise, etc.) vs **Server** (Standard, Datacenter); features and licensing vary by SKU.

---

## Further reading

- [Architecture of Windows NT (Wikipedia)](https://en.wikipedia.org/wiki/Architecture_of_Windows_NT) — User/kernel mode, Executive, kernel, HAL, drivers, environment subsystems.
- [Booting process of Windows (Wikipedia)](https://en.wikipedia.org/wiki/Booting_process_of_Windows) — NTLDR vs BOOTMGR, winload, ntoskrnl, smss, winlogon.
- [Registry Hives (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry-hives) — Hives, backing files, extensions.
- [NTFS (Wikipedia)](https://en.wikipedia.org/wiki/NTFS) — NTFS features, versions, limits.
- [Compact Disc File System (Wikipedia)](https://en.wikipedia.org/wiki/Compact_Disc_File_System) — CDFS, ISO 9660, read-only CD support on Windows.
- [Windows Server editions comparison (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/get-started/editions-comparison) — Standard vs Datacenter, features.
- [Examine Windows client editions and capabilities (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/examine-windows-client-editions-requirements/2-examine-windows-client-editions-capabilities) — Home, Pro, Enterprise, Education.
- [Windows Internals (Microsoft Press)](https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals) — In-depth book and Sysinternals resources.
- [User Account Control (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/security/identity-protection/user-account-control/user-account-control-overview) — What UAC is and how it works.
- [Start your PC in safe mode (Microsoft Support)](https://support.microsoft.com/en-us/windows/start-your-pc-in-safe-mode-in-windows-62718eee-0c84-6d4e-2c2a-99742f9724c4) — How to boot into Safe Mode.
- [Windows basics: concepts and terminology (Russ Harvey Consulting)](https://www.russharvey.bc.ca/resources/windowsbasics.html) — Desktop terminology, files and folders, hidden folders and AppData, mouse and context menus, file extensions (including dangerous ones and how to unhide), hardware and system information.
