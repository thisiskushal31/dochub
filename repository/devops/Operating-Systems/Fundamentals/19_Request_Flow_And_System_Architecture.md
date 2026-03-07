# Request flow and system architecture

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic explains **how a request flows inside any system** — whether the CPU is **x86**, **x64**, **ARM**, or another architecture — and how the **system architecture** (user space, kernel, hardware) is designed so that every request follows a well-defined path. The ideas are **architecture-agnostic**; where the mechanism differs (e.g. trap instruction, privilege levels), we note it.

---

## What “request” and “flow” mean

A **request** is any demand for work that crosses the boundary from **user space** (application) into the **kernel** (OS) or that involves **hardware** (e.g. read from disk, send a packet). The **flow** is the path that request takes: from the moment the application invokes a service (e.g. system call) until the result is back in user space (or the operation is in progress and the process is blocked). Understanding this flow is the same on an ARM server, an x86 laptop, or an x64 data-center machine — only the **mechanisms** (instruction names, registers, exception levels) differ.

---

## System architecture: the layers

Every general-purpose OS is built in **layers**. The CPU runs in at least two **privilege modes**; the kernel runs in the privileged mode and sits between applications and hardware.

```
┌─────────────────────────────────────────────────────────────────┐
│  USER SPACE (unprivileged)                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Application │  │ Application │  │   Library   │  (e.g. libc)  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                       │
│         └────────────────┼────────────────┘                       │
│                          │  system call (trap)                     │
└──────────────────────────┼───────────────────────────────────────┘
                           ▼
┌──────────────────────────┼───────────────────────────────────────┐
│  KERNEL (privileged)      │                                         │
│  ┌───────────────────────▼───────────────────────┐               │
│  │  System-call entry / trap handler               │               │
│  └───────────────────────┬───────────────────────┘               │
│                          │  dispatch by call number                │
│  ┌───────────────────────▼───────────────────────┐               │
│  │  Subsystems: VFS, process, memory, network, …  │               │
│  └───────────────────────┬───────────────────────┘               │
│                          │  driver / block layer / etc.            │
│  ┌───────────────────────▼───────────────────────┐               │
│  │  Device drivers, interrupt handlers            │               │
│  └───────────────────────┬───────────────────────┘               │
└──────────────────────────┼───────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  HARDWARE (CPU, MMU, devices: disk, NIC, …)                       │
└─────────────────────────────────────────────────────────────────┘
```

- **User space:** Applications and libraries. They **cannot** access hardware or other processes’ memory directly. They can only issue **system calls** (traps).
- **Kernel:** Single privileged layer. Handles **system-call entry**, **subsystems** (file, process, memory, network), and **drivers / interrupt handlers**. All requests that touch hardware or cross processes go through here.
- **Hardware:** CPU (with privilege mode and MMU), devices. The kernel programs devices and responds to **interrupts**.

The **architecture** is designed so that **every request** from user space goes through the kernel; there is no “back door.” On x86/x64 this is enforced by **ring 0 (kernel) vs ring 3 (user)**; on ARM by **exception levels (EL0 user, EL1 kernel)**; the principle is the same.

---

## Request flow: system call (synchronous path)

When an application asks the kernel to do something (e.g. read from a file, create a process), it goes through a **trap**. The flow is the same conceptually on any architecture; the CPU just uses different instructions and registers.

![System call: user to kernel](../../Assets/Operating-Systems/gfg-system-call-intro.webp)

*Image: [Introduction of System Call](https://www.geeksforgeeks.org/operating-systems/introduction-of-system-call/).*

```
  USER SPACE                    KERNEL
  ──────────                    ──────

  1. Application
     read(fd, buf, size)
            │
  2. Library (e.g. libc)
     • put syscall number in register (e.g. RAX / X8)
     • put fd, buf, size in registers (e.g. RDI, RSI, RDX / X0, X1, X2)
     • execute trap instruction
            │
            │   ────────  TRAP  ────────►  3. CPU: switch to privileged mode
            │                              save user PC (and minimal state)
            │                              jump to kernel trap handler
            │                                        │
            │                              4. Kernel: read call number
            │                                  dispatch to sys_read()
            │                                        │
            │                              5. Subsystem (e.g. VFS)
            │                                  resolve fd → file, maybe
            │                                  copy from cache or queue I/O
            │                                        │
            │                              [ If I/O needed: block process;
            │                                continue when interrupt fires. ]
            │                                        │
            │   ◄──────  RETURN  ───────  6. Kernel: set return value
            │   (same trap return)                   restore user state
  7. Library returns to app              switch back to user mode
     with bytes read (or error)
```

**Steps in words:**

1. **Application** calls a wrapper (e.g. `read()`).
2. **Library** places **syscall number** and **arguments** in the ABI-defined registers and executes the **trap instruction**.
3. **CPU** switches to privileged mode, saves minimal state (e.g. program counter), and jumps to the **kernel trap handler** (set up at boot).
4. **Kernel** reads the call number, validates arguments, and calls the right **subsystem** (e.g. `sys_read` → VFS).
5. **Subsystem** does the work (e.g. resolve fd, read from page cache or issue I/O). If the request needs **I/O**, the process may **block** here until the device completes and raises an **interrupt** (see next section).
6. **Kernel** sets the return value (and errno if needed), then executes the **trap return** instruction. The CPU restores user state and switches back to user mode.
7. **Library** returns to the application with the result.

This path is **synchronous** from the application’s point of view: the thread does not continue until the kernel has finished the call (or blocked it on I/O).

---

## Request flow: I/O and interrupt (asynchronous from hardware)

When the request needs **hardware** (e.g. read from disk, receive a network packet), the kernel programs the **device** and then typically **blocks** the process. The device later signals completion via an **interrupt**. That interrupt is handled entirely in the kernel; the process is woken when data is ready.

```
  PROCESS (blocked)              KERNEL                     HARDWARE
  ─────────────────              ──────                     ────────

  read(fd, …)  ──►  sys_read()
                         │
                         ▼
                    VFS / block layer
                    • issue I/O to driver
                    • put process to sleep (wait queue)
                         │
                         ▼
                    Driver programs device  ──────────►  Disk / NIC
                    (e.g. DMA, command)                       does work
                                                                  │
                         ◄───────────────────────────────────────┘
                         │  INTERRUPT (I/O complete)
                         ▼
                    Interrupt handler
                    • acknowledge device
                    • copy data / update buffers
                    • wake process (wait queue)
                         │
                    Process is runnable again
                         │
  Process scheduled  ◄───  return from sys_read with data
  continues in user space
```

So the **full request flow** when I/O is involved is: **user → trap → kernel subsystem → driver → device → (process blocks) → interrupt → kernel handler → wake process → return from syscall → user**. The same design applies on any system; only the trap instruction, interrupt routing, and driver details are architecture- or OS-specific.

---

## How the architecture differs: x86, x64, ARM

The **flow** (user → trap → kernel → subsystem → driver → hardware, and back) is the same. The **mechanisms** differ by CPU.

| Aspect | x86 (32-bit) | x64 (AMD64/Intel 64) | ARM (e.g. ARMv8 AArch64) |
|--------|----------------|------------------------|---------------------------|
| **Privilege** | Ring 0 (kernel), Ring 3 (user) | Same | EL0 (user), EL1 (kernel), EL2 (hypervisor), EL3 (secure) |
| **Trap instruction** | `int 0x80` or `sysenter` | `syscall` (preferred) or `int 0x80` (compat) | `svc` (supervisor call) |
| **Syscall number** | e.g. in EAX | e.g. in RAX | e.g. in X8 (W8) |
| **Arguments** | e.g. EBX, ECX, EDX, … | e.g. RDI, RSI, RDX, R10, R8, R9 | X0–X5 |
| **Return** | `iret` / `sysexit` | `sysret` / `iret` | `eret` |
| **Exception table** | IDT (Interrupt Descriptor Table) | Same (IDT) | Exception vector table (VBAR_EL1) |

So on **any** system:

- User code runs **unprivileged** (ring 3 / EL0).
- To get kernel service, it runs **one** trap instruction (`syscall`, `svc`, `int 0x80`, etc.).
- The CPU **switches mode**, saves minimal state, and jumps to the **kernel entry** that the OS set up at boot.
- The kernel **dispatches** by call number, runs the right **subsystem**, and returns with a **trap-return** instruction that restores user mode.

The **architecture is designed** so that this single, controlled path is the only way for user code to access kernel or hardware. That is what makes the “request flow” consistent across x86, x64, ARM, and other architectures.

---

## Example: data transmission (network request flow)

When an application sends data over the network (e.g. a chat message), the request again flows **user → kernel → subsystems → driver → device**. The kernel adds **protocol layers** (TCP, IP, link) and **queues**; the device (NIC) eventually sends the packet and may raise an **interrupt** when done or when a packet is received.

```
  User space                    Kernel space                     Hardware
  ───────────                   ─────────────                    ────────

  Application
  send(message)
       │
       ▼
  Socket / send buffer  ───►  Copy to kernel send buffer
       │
       ▼
  (trap: sendto / write)  ──►  Network stack
                                • TCP layer (segment)
                                • IP layer (packet)
                                • Link layer (frame)
                                • qdisc (queue discipline)
       │
       ▼
  Ring buffer  ──────────────────────────────────────────────►  NIC
                                                                   │
  (process may block or return)                                    ▼
                                                              Wire / network
```

On the **receive** path: NIC receives a packet → **hard interrupt** → kernel copies from NIC ring buffer → **softirq**/ksoftirqd processes it → network stack unwraps (link → IP → TCP) → data copied to user-space receive buffer → application can read. So the **design** is again: request and data flow through the kernel; hardware notifies the kernel via **interrupts**; the kernel copies data between kernel and user space and wakes processes as needed.

The diagram below shows this path (user space → kernel buffers → network stack → NIC → network, and the reverse on receive).

![Data transmission: user space to kernel to NIC to network](../../Assets/Operating-Systems/bytebytego-data-transfer-between-apps.png)

*Image: [ByteByteGo – Data Transmission Between Applications](https://bytebytego.com/guides/how-is-data-transmitted-between-applications/).*

---

## Summary (flow and architecture)

- **Architecture:** All systems use **layers**: user space (unprivileged) → kernel (privileged) → hardware. The CPU enforces this with **privilege levels** (rings or exception levels).
- **Request flow (system call):** Application → library (sets up call number and args) → **trap instruction** → CPU switches to kernel → kernel entry dispatches to subsystem → subsystem (and possibly driver) does work → **trap return** → back to user. Same idea on **x86, x64, ARM**; only the trap instruction and registers differ.
- **Request flow (with I/O):** Same as above, but the kernel may **block** the process and wait for an **interrupt** from the device. The interrupt handler completes the I/O and **wakes** the process; then the syscall returns.
- **Design:** The OS is built so that **every** request from user space goes through this single, controlled path. There is no way for user code to touch hardware or other processes without going through the kernel. That is how “request flow” and “system architecture” work on **any** system — ARM, x86, x64, or others.

---

## Further reading

- [Interrupts, exceptions, and traps](./14_Interrupts_Exceptions_And_Traps.md) — How the CPU hands control to the kernel (traps, IDT, exception vectors).
- [Kernel and OS architecture](./1_Kernel_And_OS_Architecture.md) — Privilege levels, system calls, monolithic vs microkernel.
- [Device drivers and I/O subsystem](./16_Device_Drivers_And_IO_Subsystem.md) — How the kernel talks to devices and uses interrupts.
- [ByteByteGo – Data Transmission Between Applications](https://bytebytego.com/guides/how-is-data-transmitted-between-applications/) — Network path from application to NIC (with diagram).
- [LWN – Anatomy of a system call](https://lwn.net/Articles/604287/) — Linux x86-64 system-call path in detail.
- [Kernel.org – x86 entry_64](https://www.kernel.org/doc/Documentation/x86/entry_64.txt) — x86-64 kernel entry and syscall conventions.
