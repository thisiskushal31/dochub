# Interrupts, exceptions, and traps

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers how the **CPU hands control to the kernel** — via **interrupts** (hardware), **exceptions** (CPU-generated), and **traps** (e.g. system calls). All are OS-agnostic concepts. Understanding them is essential for how the OS integrates with hardware.

---

## Why the kernel needs to get control

The kernel does not "run" in a loop. It runs only when:

1. **A process issues a system call** — User code executes a special instruction (trap); the CPU switches to kernel mode and jumps to the kernel’s trap handler.
2. **Hardware needs attention** — A device (disk, network, timer) signals the CPU via an **interrupt**; the CPU suspends the current instruction stream and runs the kernel’s **interrupt handler**.
3. **The CPU detects an exception** — e.g. page fault, divide-by-zero, illegal instruction. The CPU transfers control to the kernel’s **exception handler**.

So **interrupts**, **exceptions**, and **traps** are the three ways the CPU gives control to the kernel. Without them, the OS could never run.

---

## Three classes

| Class | Source | Examples |
|-------|--------|----------|
| **Trap** | Deliberate from user code | **System call** (e.g. read, write, fork). Instruction like `syscall` or `int 0x80`; synchronous. |
| **Exception** | CPU while executing an instruction | **Page fault** (address not in RAM), **divide by zero**, **illegal instruction**, **privilege violation**. Synchronous. |
| **Interrupt** (hardware) | External device via IRQ | **Timer** (scheduler tick), **disk I/O complete**, **network packet arrived**. Asynchronous. |

**Synchronous** = caused directly by the current instruction stream (trap or fault). **Asynchronous** = can happen at any time (hardware interrupt).

---

## What the CPU does when it happens

1. **Save context** — The CPU saves enough state (e.g. program counter, status flags, possibly registers) so it can resume the interrupted code later.
2. **Switch to privileged mode** — If coming from user mode, the CPU switches to kernel (supervisor) mode.
3. **Jump to handler** — The CPU uses a **vector number** (e.g. interrupt number 0–255 on x86) to look up an entry in an **Interrupt Descriptor Table (IDT)** (or equivalent on other architectures). It jumps to the **handler** (interrupt service routine, ISR) that the kernel registered for that vector.
4. **Kernel runs** — The handler runs in kernel mode. It may mask further interrupts briefly, do work (e.g. copy data from device, update scheduler, fix page fault), then return.
5. **Return** — A special instruction (e.g. `iret` on x86) restores the saved context and returns to the interrupted code (user or kernel). The CPU switches back to the previous mode if returning to user space.

So the **hardware** (CPU) is responsible for saving minimal state and jumping to the kernel; the **kernel** is responsible for saving full process state (e.g. in the PCB) if it will switch to another process or block the current one.

---

## Traps: system calls

When a process executes a **system call**:

- It places a **call number** and **arguments** in agreed-upon places (registers and/or stack).
- It executes a **trap instruction** (e.g. `syscall`).
- The CPU traps into the kernel; the kernel’s **system-call handler** reads the call number and arguments, dispatches to the right service (e.g. file read, process create), and places the result (and errno) in the return location.
- The kernel returns to user mode; the process continues with the return value.

So **system calls are traps** — the only sanctioned way for user code to invoke the kernel.

---

## Exceptions: faults and errors

- **Page fault** — The process accessed a virtual address that is not mapped or not present in RAM. The kernel’s **page-fault handler** may load the page from disk (demand paging), grow the stack, or signal the process (e.g. SIGSEGV) if the access is invalid.
- **Other faults** — Divide by zero, illegal instruction, etc. The kernel typically signals the process (e.g. SIGFPE, SIGILL) or kills it.

The kernel’s exception handlers decide whether to fix the condition and resume or to deliver a signal to the process.

---

## Hardware interrupts (IRQs)

Devices (timer, disk controller, network card) are connected to an **interrupt controller** (e.g. APIC on x86). When a device needs attention, it raises an **IRQ**. The controller notifies the CPU; the CPU then runs the **interrupt handler** registered for that IRQ. Handlers must be **short** (do minimal work, often just acknowledge the device and schedule work for later) so that other interrupts are not delayed too long. The kernel may **disable interrupts** briefly around critical sections (e.g. when updating a shared data structure) and then re-enable them.

---

## Summary

- **Trap** = deliberate entry (e.g. system call); **exception** = CPU-detected fault (e.g. page fault); **interrupt** = hardware device (timer, I/O).
- The CPU saves minimal state, switches to kernel mode, and jumps to the handler via a **vector table** (e.g. IDT). The kernel does the work and returns with a special instruction.
- **System calls** are traps; **page faults** and other faults are exceptions; **timer and I/O** are hardware interrupts. Together they are how the OS integrates with the hardware.

---

## Further reading

- [OSDev Wiki: Interrupts](https://wiki.osdev.org/Interrupts)
- [GeeksforGeeks: Interrupts](https://www.geeksforgeeks.org/interrupts/)
- [Booting an Operating System (Rutgers)](https://people.cs.rutgers.edu/~pxk/416/notes/02-boot.html)
