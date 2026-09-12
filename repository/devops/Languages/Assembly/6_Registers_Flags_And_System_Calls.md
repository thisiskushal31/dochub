# Assembly — Registers, flags, and Linux system calls

[← Assembly README](./README.md)

This topic summarizes **processor registers** and **flags** in the IA-32 (32-bit x86) model, and how **Linux system calls** are made with `int 0x80`. You will see these in disassembly and when writing or reading low-level code. Content is aligned with common assembly references; see **Further reading**.

---

## Why registers matter

Processor **registers** are small, fast storage on the CPU. Operations on registers are faster than on memory. Registers hold operands for arithmetic and logic, addresses for memory access, and status (e.g. flags). In IA-32 there are **general-purpose**, **segment**, **pointer**, **index**, and **control** registers.

---

## Data registers (32-bit and sub-parts)

Four 32-bit **data registers** are used for arithmetic, logic, and data movement:

- **EAX** — Accumulator; used in many arithmetic and I/O operations; product of MUL, quotient of DIV.
- **EBX** — Base; often used in addressing.
- **ECX** — Count; used as loop counter (e.g. with LOOP).
- **EDX** — Data; extended arithmetic (e.g. high part of product); I/O port address.

You can use the **lower 16 bits** as AX, BX, CX, DX, and the **lower 8 bits** as AL, AH, BL, BH, CL, CH, DL, DH.

---

## Pointer and index registers

**Pointer registers:**

- **EIP** (IP) — Instruction pointer; address of the next instruction (not directly modified like GPRs).
- **ESP** (SP) — Stack pointer; top of stack.
- **EBP** (BP) — Base pointer; often used as frame pointer for parameters and locals.

**Index registers:**

- **ESI** (SI) — Source index; e.g. source for string operations.
- **EDI** (DI) — Destination index; e.g. destination for string operations.

---

## Flags register

The **flags** (EFLAGS) record results of arithmetic and comparisons and control some behavior (e.g. direction for string ops). Common flags:

| Flag | Meaning |
| --- | --- |
| **CF** | Carry (unsigned overflow/carry) |
| **ZF** | Zero (result is zero) |
| **SF** | Sign (result is negative) |
| **OF** | Overflow (signed overflow) |
| **PF** | Parity (low 8 bits: even parity) |
| **AF** | Auxiliary carry |
| **DF** | Direction (string ops: 0 = forward, 1 = backward) |
| **IF** | Interrupt enable |
| **TF** | Trap (single-step) |

Instructions like `add`, `sub`, `cmp` set these; conditional jumps (e.g. `je`, `jz`, `jg`) test them.

---

## Segment registers

In 32-bit protected mode, **segment registers** (CS, DS, SS, ES, FS, GS) select segments. Typically:

- **CS** — Code segment.
- **DS** — Data segment (default for data references).
- **SS** — Stack segment (stack operations).
- **ES, FS, GS** — Extra segments (e.g. for string destination or OS-specific data).

The OS and linker set these; application code often does not change them explicitly.

---

## Linux system calls (int 0x80)

On 32-bit Linux, **system calls** are invoked by placing the **syscall number** in **EAX**, arguments in **EBX, ECX, EDX, ESI, EDI, EBP** (in that order), and executing **int 0x80**. The return value is usually in **EAX**.

**Common syscalls:**

| EAX | Name | Typical use |
| --- | --- | --- |
| 1 | sys_exit | Exit process (status in EBX) |
| 3 | sys_read | Read from file descriptor (fd=EBX, buf=ECX, count=EDX) |
| 4 | sys_write | Write to file descriptor (fd=EBX, buf=ECX, count=EDX) |
| 5 | sys_open | Open file |
| 6 | sys_close | Close file descriptor |

**Example: write a message then exit.**

```asm
mov  edx, len       ; message length
mov  ecx, msg      ; message address
mov  ebx, 1        ; stdout
mov  eax, 4        ; sys_write
int  0x80          ; call kernel

mov  ebx, 0        ; exit status
mov  eax, 1        ; sys_exit
int  0x80          ; call kernel
```

**Example: read from stdin then echo.** Read uses sys_read (3); fd 0 is stdin.

```asm
mov  edx, 5        ; max bytes to read
mov  ecx, buf      ; buffer address
mov  ebx, 0        ; stdin
mov  eax, 3        ; sys_read
int  0x80          ; call kernel
; then use sys_write to print buf
```

Syscall numbers and argument layout are defined in the kernel (e.g. unistd_32.h); they are part of the Linux ABI.

---

## Further reading

- [Assembly Programming Tutorial — Registers (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_registers.htm)
- [Assembly Programming Tutorial — System Calls (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_system_calls.htm)
- [Intel® 64 and IA-32 Architectures Software Developer Manual, Volume 1](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Registers and flags.
- [Assembly README](./README.md) — Topic index.
