# Boot process (detailed)

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic goes deeper into **how a machine goes from power-on to a running OS** — firmware, bootloader, and kernel load. It is OS-agnostic but uses common PC terminology (BIOS, UEFI, MBR, GPT). Understanding this is essential for how the OS integrates with the hardware at startup.

---

## High-level sequence

1. **Power on** → CPU starts at a fixed address; **firmware** runs.
2. **Firmware** (BIOS or UEFI) initializes hardware, runs POST, finds a **bootable device**.
3. **Firmware** loads the **boot loader** (first sector(s) of the disk or from a partition) and jumps to it.
4. **Boot loader** loads the **kernel** (and often an initial RAM disk) into memory, sets up parameters, and jumps to the kernel entry point.
5. **Kernel** runs: sets up MMU, interrupts, drivers, mounts root filesystem, starts **init** (PID 1).
6. **Init** starts services and user space; the system is up.

---

## Firmware: BIOS vs UEFI

- **BIOS (Basic Input/Output System)** — Legacy. Runs in 16-bit mode; reads the **first sector** of the boot disk (512 bytes — the **MBR**, Master Boot Record), which contains a small **boot loader** (or its first stage). Limited to 2 TB disks and simple partition layout.
- **UEFI (Unified Extensible Firmware Interface)** — Modern. Runs in 32/64-bit; looks for a **EFI System Partition** (ESP) and loads a **EFI application** (e.g. `bootx64.efi`). Supports GPT disks, secure boot, and larger code.

The firmware’s job is to **find and run the next stage** (boot loader or EFI app); it does not load the OS kernel itself.

---

## Boot loader

The **boot loader** is a small program (often in the first sector or in a file on ESP) that:

- Lives in a **very small** space (e.g. 512 bytes for MBR stage 1).
- Loads a **second stage** (or the kernel) from disk into memory. Multi-stage loaders (e.g. GRUB) do this: stage 1 loads stage 2, which understands file systems and can load the kernel and initrd.
- **Sets up parameters** for the kernel: command line, memory map (e.g. E820 on x86), initrd address.
- **Jumps** to the kernel’s entry point (e.g. physical address where the kernel expects to be).

So the boot loader bridges **firmware** and **kernel**; it is not part of the kernel. It is often OS-specific (e.g. GRUB for Linux, bootmgr for Windows).

---

## Kernel startup

Once the kernel gets control:

- It may still be in **physical** addressing; it sets up **paging** and the **MMU**, then switches to **virtual** addresses.
- It sets up **interrupt tables** (e.g. IDT) and enables **interrupts**.
- It detects **hardware** (CPU, memory, devices), initializes **subsystems** (memory, process, scheduler), and loads **drivers** (or uses initrd for early root).
- It **mounts the root file system** (from initrd first, then from real disk after drivers load).
- It starts the **first user process** (init, systemd, etc.) with PID 1. From then on, the kernel is **event-driven** (system calls, interrupts, exceptions).

---

## Summary

- **Firmware** (BIOS/UEFI) → **boot loader** (MBR/ESP) → **kernel** → **init**. Each stage loads and passes control to the next.
- **Boot loader** is tiny and OS-specific; it loads the kernel and initrd and jumps to the kernel.
- **Kernel** initializes hardware and software subsystems, mounts root, and starts init. After that, the OS runs in response to events.

---

## Further reading

- [Booting an Operating System (Rutgers)](https://people.cs.rutgers.edu/~pxk/416/notes/02-boot.html)
- [OSDev Wiki: Boot sequence](https://wiki.osdev.org/Boot_Sequence)
- [GeeksforGeeks: What happens when we turn on computer?](https://www.geeksforgeeks.org/operating-systems/what-happens-when-we-turn-on-computer/)
