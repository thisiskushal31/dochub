# macOS: introduction and basics

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Architecture and structure](./0_MacOS_Architecture_And_Structure.md). This topic covers **boot process**, **system calls**, **file system hierarchy** (domains and key directories), and **essential commands** for day-to-day use and scripting.

---

## Boot process (high level)

1. **Firmware** — UEFI (Intel) or iBoot/Apple firmware (Apple Silicon) runs from ROM. It initializes hardware and selects the boot volume.
2. **Bootloader** — On Intel: **Boot Camp** or **EFI** loads the kernel. On Apple Silicon: **iBoot** (or similar) loads the kernel from the **Preboot** volume. **Secure Boot** and **System Integrity Protection (SIP)** can restrict what can load.
3. **Kernel** — **XNU** (Mach + BSD + IOKit) loads. Mach initializes VM and scheduling; BSD brings up the process model and file systems; IOKit probes and starts drivers.
4. **launchd** — The first user-space process (**PID 1**). It reads **LaunchDaemons** and **LaunchAgents** plists and starts system and login-window services. No traditional `/etc/inittab`; **launchd** is the single point for service management.
5. **Login** — **loginwindow** (or similar) presents the login screen; after authentication, the user’s session and **Launch Agents** start.

Details (e.g. **BootX**, **kernelcache**, **kext** loading) depend on architecture (Intel vs Apple Silicon) and security settings.

### Boot modes and key combinations

- **Recovery:** **Command (⌘)-R** (Intel) or hold Power until “Options” (Apple Silicon) — reinstall macOS, Disk Utility, Terminal, restore from Time Machine.
- **Internet Recovery:** **Option-⌘-R** or **Shift-Option-⌘-R** (Intel) — recover when the local Recovery partition is missing.
- **Safe Mode:** Hold **Shift** at startup (Intel) or choose “Continue in Safe Mode” (Apple Silicon). Disables third-party kexts and login items, clears caches, can run disk repair.
- **Startup Manager (choose disk):** Hold **Option** at startup — pick boot volume.
- **Verbose:** **⌘-V** — kernel and boot messages. **⌘-S** (single-user mode) is disabled on recent macOS.
- **NVRAM (or PRAM) reset (Intel only):** Hold **Option-⌘-P-R** for ~20 seconds at startup — resets volume, resolution, time zone, etc. Apple Silicon has no NVRAM reset; use **System Settings**.
- **SMC (System Management Controller) reset (Intel only):** Affects power, thermal, lights. Shut down, then follow Apple’s key combo (e.g. Shift-Control-Option + Power). Apple Silicon Macs have no SMC.

**References:** [Mac startup key combinations (Apple)](https://support.apple.com/en-lamr/102603), [Reset NVRAM (Apple)](https://support.apple.com/en-us/102539).

---

## System calls

User programs interact with the kernel via **system calls**. On macOS, the **BSD layer** exposes the **POSIX/BSD syscall** interface (e.g. `open`, `read`, `fork`, `execve`, `mach_*` for Mach APIs). Many higher-level APIs (Cocoa, Foundation) ultimately use these syscalls. The **Mach** layer also exposes **Mach traps** (e.g. for VM or IPC) used by the system libraries. So: **syscalls** → **BSD** (and sometimes **Mach**) → **kernel**.

**Useful commands:**

- **`dtruss`** (or **`sudo dtruss`**) — Trace syscalls of a process (similar to `strace` on Linux). Example: `sudo dtruss -f -p <pid>`.
- **`fs_usage`**, **`opensnoop`** — Observe file system and file open activity (for debugging and understanding what an app does).

---

## File system hierarchy and domains

macOS organizes files into **domains** (search order when resolving paths):

| Domain       | Purpose                                      | Typical path(s)                    |
|-------------|-----------------------------------------------|------------------------------------|
| **User**    | Per-user resources                            | `/Users/<username>/`, `~/`         |
| **Local**   | Shared local apps and support                  | `/Library/`, `/Applications/`        |
| **Network** | Network-mounted resources                     | (configured per network)            |
| **System**  | Apple system software (read-only when sealed) | `/System/`, `/usr/` (often read-only) |

**Important directories:**

```
/                    Root (often read-only on system volume)
/Applications        Applications for all users
/Library             System-wide support, preferences, LaunchDaemons/Agents
/System              macOS system files (read-only; sealed on newer macOS)
/System/Library      System frameworks, extensions, LaunchDaemons
/Users               Home directories
/usr                 BSD userland (bin, lib, bin); often part of read-only system
/var                 Variable data (logs, caches, run state)
/private             Symlinks: /tmp → /private/tmp, /var → /private/var
/Volumes             Mount points for other volumes (external disks, APFS Data, etc.)
~/Library            Per-user app support, Caches, Preferences (hidden in Finder)
```

**Commands:**

- **`ls`**, **`ls -la`** — List directory contents.
- **`df -h`** — Disk space per volume (APFS volumes share a container).
- **`diskutil list`** — List disks and partitions (APFS containers show as a single “container” with multiple volumes).
- **`system_profiler SPSoftwareDataType`** — macOS version, kernel, boot volume; **`SPHardwareDataType`** for hardware. **`sw_vers`** — short OS version.
- **`xcode-select --install`** — Install Xcode Command Line Tools (compilers, git); required for Homebrew and many dev tools.

**References:** [File System Programming Guide: File System Domains (Apple)](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html), [MacOSX Directories (Apple)](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html).

---

## Essential commands (quick reference)

| Task           | Command / tool                               |
|----------------|------------------------------------------------|
| List processes | `ps aux`, `top`, Activity Monitor              |
| Kill process   | `kill <pid>`, `kill -9 <pid>`, `pkill <name>`  |
| Services       | `launchctl list`, `launchctl start/stop <label>` |
| Disk usage     | `df -h`, `du -sh <dir>`                        |
| Network        | `ifconfig`, `netstat -an`, `networksetup`      |
| Logs           | `log stream`, `log show` (Unified Logging)      |
| System info    | `uname -a`, `sw_vers`, `system_profiler SPSoftwareDataType` |
| Shell          | Default: **zsh** (`echo $SHELL`)               |

See [Process management](./2_Process_Management.md), [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md), and [Storage and I/O](./8_Storage_And_IO.md) for details.

---

## Summary

- **Boot:** Firmware → bootloader → XNU → **launchd** (PID 1) → services and login.
- **Syscalls:** BSD/POSIX (and Mach) interface; trace with **dtruss**, **fs_usage**, **opensnoop**.
- **File hierarchy:** **Domains** (User, Local, Network, System); key paths: `/System`, `/Library`, `/Applications`, `/Users`, `~/Library`.
- **Essentials:** `ps`, `top`, `kill`, `launchctl`, `df`, `diskutil`, `ifconfig`, `log stream` / `log show`, `uname`, `sw_vers`.

---

## Further reading

- [Kernel Programming Guide: Booting (Apple)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/booting/booting.html)
- [File System Programming Guide (Apple)](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/)
