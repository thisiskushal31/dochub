# Assembly — Where it shows up: cybersecurity and engineering

[← Assembly README](./README.md)

Assembly appears across **cybersecurity** (reverse engineering, malware, exploits) and **general engineering** (embedded, aerospace, automotive, industrial, compilers, DSP). You encounter it in **disassembler and debugger output**, in **shellcode** and **firmware**, in **boot and kernel code**, and in **safety-critical or performance-critical** systems. This topic summarizes those contexts; see **Further reading** for authoritative sources.

---

## Cybersecurity: disassembly and debuggers

When you open a binary in a **disassembler** (IDA, Ghidra, Binary Ninja, objdump) or **debugger** (x64dbg, GDB, WinDbg), you see **assembly** (and often decompiled C-like code). The disassembler maps **machine code** back to **mnemonics and operands** using the CPU’s instruction set. That view is your primary way to reason about:

- What a function does (control flow, arithmetic, memory access).
- Where arguments and return values are (calling convention).
- Suspicious patterns (anti-debug, unpacking, shellcode).

You don’t need to write assembly daily, but **reading** it is essential for reverse engineering and malware analysis.

---

## Cybersecurity: malware and implants

Many **malware families** and **implants** are written in C/C++ and compiled to native code; when you analyze them you see **x86/x64** or **ARM** assembly. Packed or obfuscated samples may contain:

- **Decryption/unpacking loops** — Arithmetic and memory operations in assembly.
- **API resolution** — Loading libraries and resolving function pointers (often via PEB/TEB on Windows).
- **Shellcode** — Small, position-independent assembly payloads (injected, in documents, or staged).

Understanding **calling conventions** and **common instruction sequences** helps you follow the logic and identify what the sample does without executing it.

---

## Cybersecurity: shellcode and exploit payloads

**Shellcode** is typically **position-independent code** (PIC) in raw machine code (or assembly that assembles to it), often injected into a process or sent over the network. It is used in:

- **Exploit development** — Payload that runs after a buffer overflow or similar bug (e.g. open shell, add user).
- **Red-team tools** — In-memory execution, process injection, reflective loaders.

Shellcode is usually **small** and **avoids** null bytes (or other bad bytes) so it can be embedded in strings or packets. It often uses **system calls** (e.g. Linux `syscall`, Windows API via stack or shellcode-resolved pointers) rather than libc, so you see **direct syscall** or **API call** patterns in the assembly. References: exploit-db, OS-specific syscall/ABI docs, and security research papers.

---

## Engineering: firmware and boot code

**BIOS**, **UEFI**, **boot loaders**, and **embedded firmware** often contain hand-written or compiler-generated assembly for:

- **Early bootstrap** — CPU in real mode or early protected/long mode; no OS yet.
- **Low-level hardware** — Registers, interrupts, DMA.
- **Critical paths** — Where every cycle counts.

You may see **16-bit real mode** (segment:offset), **32-bit protected mode**, or **64-bit long mode** depending on the stage. Intel and AMD manuals describe the modes; UEFI and firmware specs describe the environment.

---

## Engineering: embedded and real-time systems

**Microcontrollers**, **bare-metal** firmware, and **real-time operating systems (RTOS)** often use hand-written or compiler-generated assembly for:

- **Startup and reset** — Initialize stack, BSS, and C runtime before `main`.
- **Interrupt service routines (ISRs)** — Minimal latency; save/restore only what’s needed.
- **Critical timing** — Loops or sequences where cycle count is fixed (sensors, actuators, communication).
- **Low-level drivers** — GPIO, UART, SPI, I2C, PWM, DMA setup.

Architectures include **ARM Cortex-M**, **AVR**, **PIC**, **RISC-V**, and **MSP430**. Assembly is used when C cannot guarantee timing or code size, or when you are debugging compiler output in safety-critical or certified environments.

---

## Engineering: aerospace, automotive, and industrial

**Aerospace** (flight control, avionics, DO-178C), **automotive** (engine/brake/steering ECUs, ISO 26262), and **industrial** (robotics, PLCs, motor control, IEC 61508) rely on deterministic, auditable low-level code. Assembly appears in:

- **Boot and safety monitors** — Power-on self-test, watchdog, secure boot.
- **Hot paths** — Control loops, filtering, or protocol handling where every cycle counts.
- **Legacy or certified code** — Systems where the toolchain (including assembly) is part of the qualification.

Reading assembly is necessary to **review**, **trace**, and **verify** behavior in these domains; writing it (or inline assembly in C) is common in startup code and performance-critical sections.

---

## Engineering: kernels and drivers

**OS kernels** and **device drivers** mix C with **assembly** for:

- **Trap/interrupt handlers** — Save/restore state, dispatch to C.
- **Context switch** — Save/restore registers and stack.
- **Atomic operations** — Compare-and-swap, barriers (often inline assembly in C).
- **CPU-specific** — CR0/CR4, MSRs, VMX/SVM.

When analyzing a kernel or driver binary, you will see these patterns in disassembly; the OS vendor’s source (e.g. Linux kernel, Windows WRK docs) and processor manuals are the references.

---

## Engineering: compilers, runtimes, and signal processing

**Compilers and runtimes** generate or use assembly for **code generation**, **trampolines**, **JIT stubs**, and **OS-specific sequences** (e.g. syscall wrappers, context switch). Understanding assembly helps when debugging codegen, optimizing hot paths, or maintaining a runtime.

**Signal processing and DSP** (audio, video, radio, control) often use **SIMD** (SSE, AVX, NEON) or **fixed-point** arithmetic; the inner loops are sometimes hand-tuned in assembly or inspected in disassembly to verify performance and correctness.

---

## Summary

| Context | Typical architecture | What you see |
| --- | --- | --- |
| **Cybersecurity** | | |
| Desktop/server binary | x86-64 | Long mode; OS ABI (System V / MS x64) |
| Malware / shellcode | x86-64, ARM | PIC, syscalls, API calls |
| **Engineering** | | |
| Mobile / embedded / IoT | ARM, AArch64, RISC-V | AAPCS; Thumb; bare-metal; RTOS |
| Boot / firmware / aerospace | x86, ARM | Real/protected mode; no OS ABI |
| Kernels / drivers | x86-64, ARM | Handlers, atomics, CPU-specific |
| Compilers / DSP / SIMD | x86-64, ARM | Codegen; SIMD/fixed-point loops |

---

## Further reading

- [Intel® 64 and IA-32 Architectures Software Developer Manual, Vol. 3](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — System programming (modes, interrupts, VMX).
- [ARM Documentation](https://developer.arm.com/documentation/) — Exception handling, boot, secure state.
- OS and ABI docs (Linux, Windows, macOS) for syscall numbers and calling conventions used in shellcode and malware analysis.
