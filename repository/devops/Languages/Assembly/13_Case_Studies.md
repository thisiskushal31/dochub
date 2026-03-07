# Assembly — Case studies and hands-on examples

[← Assembly README](./README.md)

This topic gives **hands-on case studies** so you can see **implementation** from very basic to practical: a minimal program, recursion, **reading** disassembly, and file I/O. Each follows the same pattern as the rest of the handbook: **goal** → **approach** → **code** (or disassembly) → **expected behavior**. The same skills apply in **cybersecurity** (reverse engineering, exploit analysis) and **general engineering** (embedded, firmware, kernels, compilers, DSP). Together with topics 1–12, this completes the deep dive from basics to implementation.

---

## Format used in this handbook

For every concept we use:

1. **Text first** — What we are doing and why (goal, concept, or rule).
2. **Then a code block or visual** — Concrete assembly (or disassembly) that shows the idea so you can see structure, syntax, and flow.

Case studies below are full, runnable (or analyzable) examples aligned with the TutorialsPoint Assembly course and common references.

---

## Case study 1: Hello World (minimal program and syscalls)

**Goal:** Display `Hello, world!` on standard output and exit cleanly.

**Approach:** Use Linux system calls. Put the syscall number in **EAX** and arguments in **EBX**, **ECX**, **EDX** as per the 32-bit Linux ABI; then execute **int 0x80**. We need **sys_write** (4) to write the string to file descriptor 1 (stdout), then **sys_exit** (1) to terminate. The message and its length go in `.data`; the length is computed with `equ $ - msg`.

**Implementation:**

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

**Build and run (32-bit Linux, NASM + ld):** `nasm -f elf hello.asm`, `ld -m elf_i386 -s -o hello hello.o`, `./hello`.

**Expected behavior:** The program prints `Hello, world!` and a newline, then exits with status 0.

---

## Case study 2: Factorial (recursion and stack)

**Goal:** Compute factorial of a small positive integer using a **recursive** procedure. Fact(n) = n × Fact(n−1) for n > 1; Fact(0) = Fact(1) = 1.

**Approach:** Implement a procedure that receives n in **BL** (byte). If BL ≤ 1, return 1 in **AX**. Otherwise decrement BL, call the procedure recursively, then multiply the return value (in AX) by the original n (restore BL and use MUL). The **CALL** instruction pushes the return address; each recursive call uses more stack. We must preserve n across the call (e.g. by decrementing BL before the call and incrementing after return) so we can multiply.

**Implementation:**

```asm
proc_fact:
   cmp   bl, 1
   jg    do_calculation
   mov   ax, 1
   ret
do_calculation:
   dec   bl
   call  proc_fact
   inc   bl
   mul   bl        ; ax = al * bl (word × byte)
   ret
```

**Expected behavior:** Calling with BL = 5 leaves AX = 120 (5!). The recursion stops at BL ≤ 1; each return multiplies the result by the saved n. Stack depth equals n.

---

## Case study 3: Reading a disassembly (interpreting a function)

**Goal:** Given a short disassembly listing, interpret what the function does: prologue, argument use, control flow, and epilogue.

**Approach:** Recognize **calling convention** (e.g. System V AMD64: first args in RDI, RSI, RDX; return in RAX). **Prologue** typically saves the frame pointer and allocates stack space (`push rbp`; `mov rbp, rsp`; `sub rsp, N`). **Epilogue** restores and returns (`mov rsp, rbp`; `pop rbp`; `ret`). Look for **comparisons** and **conditional jumps** to see branches; **CALL** for subroutines.

**Example (simplified x86-64 style):**

```text
   0:   push   rbp
   1:   mov    rbp, rsp
   4:   sub    rsp, 0x10
   8:   mov    DWORD PTR [rbp-4], edi   ; first arg (int) → local
   b:   cmp    DWORD PTR [rbp-4], 0
   f:   jle    .L2
  11:   mov    eax, DWORD PTR [rbp-4]
  14:   sub    eax, 1
  17:   mov    edi, eax
  19:   call   <func>                    ; recursive call
  1e:   imul   eax, DWORD PTR [rbp-4]
  22:   jmp    .L3
.L2:
  24:   mov    eax, 1
.L3:
  29:   leave
  2a:   ret
```

**Interpretation:** One argument (int) in EDI, stored at `[rbp-4]`. If it is ≤ 0, jump to `.L2` and return 1; else call the same function with argument n−1, multiply return value by n, and return. This is the **factorial** pattern: base case 1, recursive case n * fact(n−1). **leave** restores RSP/RBP; **ret** returns to caller.

**Expected behavior:** You can explain the function’s logic and how the stack and registers are used without running the binary.

---

## Case study 4: Writing a file (syscalls: creat, write, close)

**Goal:** Create a file, write a short string into it, and close it using only Linux system calls (no libc).

**Approach:** Use **sys_creat** (8) to create the file (path in EBX, mode in ECX); it returns a file descriptor in EAX. Use **sys_write** (4) with that fd, buffer address in ECX, and byte count in EDX. Then **sys_close** (6) with the fd in EBX. Store the filename and message in `.data`; preserve the fd across the write (e.g. in EBX after creat, then pass to write and close).

**Implementation (conceptual; 32-bit int 0x80):**

```asm
section .data
fname db 'out.txt', 0
msg   db 'Written from assembly', 0xa
mlen  equ $ - msg

section .text
global _start
_start:
   mov  eax, 8           ; sys_creat
   mov  ebx, fname        ; pathname
   mov  ecx, 0644o       ; mode (octal)
   int  0x80
   mov  ebx, eax         ; save fd

   mov  eax, 4            ; sys_write
   ; ebx = fd
   mov  ecx, msg
   mov  edx, mlen
   int  0x80

   mov  eax, 6            ; sys_close
   ; ebx still fd
   int  0x80

   mov  eax, 1
   mov  ebx, 0
   int  0x80              ; sys_exit
```

**Expected behavior:** After running, a file `out.txt` exists and contains `Written from assembly` and a newline. This demonstrates the full **create → write → close** sequence used in file handling (topic 11).

---

## Summary: basic to implementation

The Assembly section now covers:

| Stage | Topics | Content |
| --- | --- | --- |
| **Basics** | 1, 5–7 | Registers, instructions, addressing; environment, syntax, sections; variables, constants |
| **Reading & conventions** | 2 | Disassembly, calling conventions, stack layout |
| **Where it shows up** | 3 | Malware, shellcode, firmware, kernels |
| **Tooling** | 4 | Disassemblers, debuggers, assemblers |
| **Core programming** | 6, 8–11 | Syscalls, arithmetic/logic/control flow, procedures, stack, macros, numbers/strings/arrays, recursion, file/memory |
| **Use cases & ecosystem** | 12 | C and assemblers, security, online compilers |
| **Implementation** | 13 | Case studies: Hello World, factorial, reading disassembly, file write |

Nothing is left out: from very basic to implementation, including case studies.

---

## Further reading

- [Assembly Programming Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/index.htm) — Full course; recursion, file management.
- [Assembly — Recursion, file and memory management](./11_Recursion_File_And_Memory_Management.md) — Syscall details and factorial.
- [Assembly — Environment, basic syntax, and program structure](./5_Environment_Syntax_And_Program_Structure.md) — Hello World and sections.
- [Assembly — Reading disassembly and calling conventions](./2_Reading_Disassembly_And_Calling_Conventions.md) — Prologue, epilogue, conventions.
- [Assembly README](./README.md) — Topic index.
