# Assembly — Procedures, stack, and macros

[← Assembly README](./README.md)

This topic covers **procedures** (subroutines) with **CALL** and **RET**, the **stack** and **PUSH**/ **POP**, and **macros** in NASM. Same format: text first, then code. See **Further reading** for sources.

---

## Procedures (subroutines)

A **procedure** is a named block of code that can be **called** from elsewhere and then **return** to the caller. In NASM you use a **label** for the procedure name, and end with **RET** (which pops the return address from the stack and jumps to it).

**Defining a procedure:**

```asm
proc_name:
   ; procedure body
   ; ...
   ret
```

**Calling a procedure:** Use **CALL** with the procedure label. CALL pushes the address of the next instruction (return address) onto the stack and jumps to the procedure. RET pops that address and jumps back.

```asm
call proc_name
; execution continues here after ret
```

**Example (procedure that “adds” two digit characters and returns result in EAX):**

```asm
section .text
   global _start

_start:
   mov  ecx, '4'
   sub  ecx, '0'
   mov  edx, '5'
   sub  edx, '0'
   call sum
   mov  [res], eax
   ; ... print res and exit ...

sum:
   mov  eax, ecx
   add  eax, edx
   add  eax, '0'
   ret

section .data
; ...
segment .bss
res resb 1
```

Conventions for **which registers** hold parameters and return values are not enforced by the CPU; the programmer (or ABI) defines them. In the example above, ECX and EDX are inputs, EAX is the result.

---

## The stack

The **stack** is a LIFO region of memory. It grows toward **lower** addresses. **SS** points to the stack segment; **ESP** (or SP) points to the **top** of the stack (the last pushed item).

**PUSH** — Decrements ESP and stores the operand (word or doubleword) at [ESP].  
**POP** — Loads from [ESP] into the operand and increments ESP.

```asm
push eax
push ebx
; use eax, ebx for something else
; ...
pop  ebx
pop  eax
```

**Uses:**

- Saving and restoring registers across a CALL (caller-saved or callee-saved).
- Passing arguments (in some calling conventions).
- Allocating local variables (e.g. `sub esp, 16` then use [ESP+offset]).

**Rules (typical for 32-bit):** Only word or dword are pushed/popped; stack must stay aligned (e.g. 4-byte aligned for 32-bit). The top of stack points to the **lowest byte** of the last pushed value.

---

## Stack example: save registers before syscall

System calls (e.g. int 0x80) use EAX, EBX, ECX, EDX, etc. If you need to preserve them, save on stack before the call and restore after:

```asm
push ecx
push edx
mov  eax, 4
mov  ebx, 1
mov  ecx, msg
mov  edx, len
int  0x80
pop  edx
pop  ecx
```

---

## Macros

A **macro** is a named sequence of instructions (or text) that the assembler **expands** at assembly time wherever you use the macro name. Unlike a procedure, no CALL/RET; the code is inlined.

In NASM, macros are defined with **%macro** and **%endmacro**. Parameters are referred to as **%1**, **%2**, etc.

**Syntax:**

```asm
%macro macro_name  number_of_params
   ; body: use %1, %2, ...
%endmacro
```

**Example (macro that prints a string using sys_write):**

```asm
%macro write_string 2
   mov  eax, 4
   mov  ebx, 1
   mov  ecx, %1
   mov  edx, %2
   int  80h
%endmacro

section .text
   global _start

_start:
   write_string msg1, len1
   write_string msg2, len2
   write_string msg3, len3
   mov  eax, 1
   int  0x80

section .data
msg1 db 'Hello, programmers!', 0xa, 0xd
len1 equ $ - msg1
msg2 db 'Welcome to the world of,', 0xa, 0xd
len2 equ $ - msg2
msg3 db 'Linux assembly programming! '
len3 equ $ - msg3
```

When you invoke `write_string msg1, len1`, the assembler replaces it with the four mov instructions and int 80h, with %1 → msg1 and %2 → len1.

**When to use macros:** Repeated short sequences (e.g. “print string”, “save/restore registers”). For longer or complex logic, procedures are often clearer and avoid code bloat.

---

## Further reading

- [Assembly Programming — Procedures (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_procedures.htm)
- [Assembly Programming — Macros (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_macros.htm)
- [NASM Manual](https://www.nasm.us/doc/) — Macros and stack usage.
- [Assembly README](./README.md) — Topic index.
