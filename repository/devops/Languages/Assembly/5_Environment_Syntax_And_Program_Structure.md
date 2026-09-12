# Assembly — Environment, basic syntax, and program structure

[← Assembly README](./README.md)

This topic covers **what assembly language is**, **setting up a Linux/NASM environment**, and the **basic structure** of an assembly program: sections, statements, and a minimal **Hello World** example. The material follows the same pattern as the rest of the handbook: text first, then code. Content is drawn from standard assembly tutorials and the NASM manual; see **Further reading**.

---

## What is assembly language?

A **processor** only executes **machine language**: binary instructions (ones and zeros). **Assembly language** is a human-readable form of those instructions: each **mnemonic** (e.g. `mov`, `add`) corresponds to one or more **opcodes**. An **assembler** (e.g. NASM, GAS, MASM) translates assembly source into object or executable code.

Assembly is **tied to a specific processor family** (e.g. Intel 32-bit, x86-64, ARM). It is used when you need direct control over hardware, small code size, or maximum performance; it also appears in reverse engineering when you read disassembler output.

**Why learn it (in a DevOps/security context):**

- How programs access devices, memory, and the OS.
- How instructions are executed and how data is represented.
- Writing or analyzing low-level code (shellcode, drivers, boot code).

---

## Basic hardware concepts

The main internal hardware of a PC includes the **processor**, **memory**, and **registers**. Registers hold data and addresses; the processor fetches instructions from memory, decodes them, and executes them. Data sizes you will see:

- **Word** — 2 bytes  
- **Doubleword** — 4 bytes  
- **Quadword** — 8 bytes  

Numbers are often in **binary** or **hexadecimal**; negative integers are usually in **two’s complement** form.

---

## Environment setup (NASM on Linux)

This section assumes **Linux** and the **NASM** assembler. You can use other assemblers (GAS, MASM) with different syntax.

**Check if NASM is installed:**

```text
whereis nasm
```

If you see a path (e.g. `/usr/bin/nasm`), NASM is installed. Otherwise install it from your distribution or from the NASM website.

**What you need:**

- NASM assembler
- A linker (e.g. `ld` from binutils) to produce an executable
- A text editor and terminal

On many systems, installing “development tools” or “build-essential” provides NASM and `ld`.

---

## Program structure: sections

An assembly program is usually divided into **sections** (NASM: `section` or `segment`).

**`.data`** — Declares **initialized data** and constants (e.g. strings, numbers). This data does not change at runtime.

```asm
section .data
msg db 'Hello, world!', 0xa
len equ $ - msg
```

**`.bss`** — Declares **uninitialized** (reserved) space for variables (e.g. buffers). The program loader zero-fills it.

```asm
section .bss
buf resb 64
```

**`.text`** — Holds the **executable code**. The entry point is often declared with `global _start` and the label `_start:` for the linker.

```asm
section .text
   global _start
_start:
   ; instructions here
```

---

## Statement format and comments

A typical assembly **statement** has the form:

```text
[label]   mnemonic   [operands]   [;comment]
```

- **Label** — Optional; defines a symbol (e.g. for jumps or data).
- **Mnemonic** — Instruction name (e.g. `mov`, `add`) or an assembler **directive** (e.g. `db`, `equ`).
- **Operands** — Depends on the instruction (registers, immediates, memory).
- **Comment** — From a semicolon to end of line.

**Comments:**

```asm
; This is a full-line comment
mov eax, 1    ; comment after instruction
```

---

## Hello World example

The following program writes the string `Hello, world!` to standard output and then exits. It uses **Linux system call** `sys_write` (4) and `sys_exit` (1) via `int 0x80`. This is 32-bit Linux syntax; 64-bit uses different calling convention and syscall instruction.

**Concept:** Put the system call number in `EAX`, arguments in `EBX`, `ECX`, `EDX` (as required), then execute `int 0x80`. Result is typically returned in `EAX`.

```asm
section .text
   global _start

_start:
   mov  edx, len      ; message length
   mov  ecx, msg      ; message to write
   mov  ebx, 1        ; file descriptor (stdout)
   mov  eax, 4        ; system call number (sys_write)
   int  0x80          ; call kernel

   mov  eax, 1        ; system call number (sys_exit)
   int  0x80          ; call kernel

section .data
msg db 'Hello, world!', 0xa
len equ $ - msg
```

**Build and run (32-bit Linux, NASM + ld):**

```text
nasm -f elf hello.asm
ld -m elf_i386 -s -o hello hello.o
./hello
```

Output: `Hello, world!`

---

## Memory segments (overview)

A **segmented** view of memory (typical in 32-bit tutorials) divides the program into:

- **Code segment** — Holds instructions (your `.text` section).
- **Data segment** — Initialized data (`.data`) and reserved space (`.bss`).
- **Stack segment** — Stack for local data and return addresses; grows downward; `SS` and `ESP` (or `SP`) point into it.

The assembler and linker place sections into appropriate segments; the OS sets up segment registers when loading the program.

---

## Further reading

- [Assembly Programming Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/index.htm) — Introduction, environment setup, basic syntax.
- [NASM Manual](https://www.nasm.us/doc/) — Sections, directives, and syntax.
- [Assembly README](./README.md) — Topic index.
