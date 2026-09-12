# macOS: storage advanced and virtualization

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **APFS snapshots** and **advanced storage** usage, and **virtualization** on macOS: **Hypervisor.framework** (low-level) and **Virtualization.framework** (high-level, Apple Silicon–friendly).

---

## APFS snapshots and advanced storage

**Snapshots** — APFS supports **read-only snapshots** of a volume at a point in time. Used by **Time Machine** (local snapshots) and **tmutil**. List snapshots: **`tmutil listlocalsnapshots /`** (or **`diskutil apfs listSnapshots /`** on supported versions). Delete local snapshot: **`tmutil deletelocalsnapshots <date>`**. Snapshots share space with the volume (copy-on-write); deleting data may not free space until snapshots that reference it are removed.

**diskutil (advanced)** — **`diskutil apfs list`** — Containers and volumes. **`diskutil apfs resizeVolume`** — Resize a volume within its container (e.g. shrink Data to add a new volume). **`diskutil apfs addVolume`** — Add a volume to an existing container. **`diskutil eraseDisk`** — Erase a disk (destructive). **`diskutil secureErase`** — Secure erase. Always backup before resize/erase.

**Encryption** — APFS supports **per-volume encryption**. **FileVault** encrypts the whole boot volume (or volume group). **`diskutil apfs list`** shows encryption status. **`diskutil apfs unlockVolume`** — Unlock an encrypted volume (e.g. external).

**References:** [APFS (Apple)](https://developer.apple.com/documentation/foundation/file_system), [tmutil(8)], [diskutil(8)].

---

## Virtualization on macOS

macOS provides two frameworks for running **virtual machines**:

### Hypervisor.framework (low-level)

**Hypervisor.framework** is a **C API** that lets an app create and run **VMs** using **hardware virtualization** (Intel VT-x, AMD-V, or **Apple Silicon Virtualization Extensions**). The hypervisor code runs in **user space**; the kernel provides the interface. No third-party **kernel extensions** are required. On **Apple Silicon**, the framework uses the built-in virtualization support; VMs can run **ARM64** guests (e.g. Linux, other macOS).

**Concepts:**

- **VM** — Created with **`hv_vm_create()`**, destroyed with **`hv_vm_destroy()`**.
- **vCPUs** — Virtual CPUs are **POSIX threads**; you map guest memory, set up registers, and run the vCPU loop.
- **Memory** — **`hv_vm_map()`** maps host memory into the guest physical address space.
- **Nested virtualization** — On newer Apple Silicon, **EL2** (Exception Level 2) and **GIC** support can allow nested VMs (documentation and support vary by OS version).

**Entitlement:** Apps using Hypervisor.framework need the **`com.apple.security.hypervisor`** entitlement. **`sysctl kern.hv_support`** — Check if the hardware supports the hypervisor (1 = yes).

**References:** [Hypervisor framework (Apple)](https://developer.apple.com/documentation/hypervisor), [Apple Silicon and Hypervisor (Apple)](https://developer.apple.com/documentation/hypervisor/apple-silicon), [Create macOS or Linux VMs (WWDC22)](https://developer.apple.com/videos/play/wwdc2022/10002/).

### Virtualization.framework (high-level)

**Virtualization.framework** is a **higher-level** API (Swift/ObjC) that builds on **Hypervisor.framework**. It provides **full VM** management: **virtualization of CPU and memory**, **device emulation** (disk, network, graphics), and **Linux** or **macOS** guest support. **Apple Silicon** is well supported; you can run **ARM64 Linux** or **macOS** in a VM. This is what **UTM** and other modern Mac VM apps use; **Docker Desktop** and **Parallels** use it (or their own stack) on Apple Silicon.

**Use cases:** Run **Linux** or **macOS** guests for development, testing, or isolation. No need to write low-level **hv_*** calls unless you are building a custom hypervisor.

**References:** [Virtualization framework (Apple)](https://developer.apple.com/documentation/virtualization), [Creating a Linux VM (Apple)](https://developer.apple.com/documentation/virtualization/creating_a_linux_virtual_machine).

---

## Summary

- **APFS advanced:** **Snapshots** (tmutil, Time Machine), **resize/add volume** (diskutil), **encryption** (FileVault, per-volume).
- **Virtualization:** **Hypervisor.framework** — low-level C API, **hv_vm_***, vCPUs as threads; **Virtualization.framework** — high-level VM and device emulation (Linux/macOS guests on Apple Silicon).

---

## Further reading

- [Hypervisor framework (Apple)](https://developer.apple.com/documentation/hypervisor)
- [Virtualization framework (Apple)](https://developer.apple.com/documentation/virtualization)
- [Create macOS or Linux virtual machines (WWDC22)](https://developer.apple.com/videos/play/wwdc2022/10002/)
- [APFS (Apple)](https://developer.apple.com/documentation/foundation/file_system)
- `man diskutil`, `man tmutil`
