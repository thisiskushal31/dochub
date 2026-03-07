# Assembly — Addressing modes, variables, and constants

[← Assembly README](./README.md)

This topic covers **addressing modes** (where operands come from), **variables** (reserving and initializing memory), and **constants** in NASM-style assembly. Text first, then code. See **Further reading** for sources.

---

## Addressing modes (overview)

Instructions need **operands**. The way an operand is specified is the **addressing mode**.

- **Register addressing** — Operand is in a register (e.g. `mov eax, ebx`).
- **Immediate addressing** — Operand is a constant in the instruction (e.g. `mov eax, 42`).
- **Direct memory addressing** — Operand is at a fixed address, often given by a label (e.g. `mov eax, [count]`).
- **Register indirect** — Address is in a register (e.g. `mov eax, [ebx]`).
- **Direct-offset / indexed** — Address = base + offset or base + index (e.g. `mov al, [table+2]` or `[ebx+ecx*4]`).

Processing between registers is fastest; memory access is slower and uses the data segment (e.g. DS) and effective address.

---

## Register and immediate addressing

**Register:** Both operands in registers.

```asm
mov  eax, ebx
add  ecx, edx
```

**Immediate:** One operand is a constant. The other is usually a register or memory. Size can be inferred from the register or stated explicitly.

```asm
mov  eax, 45h
add  byte [value], 65
```

---

## Direct and direct-offset memory addressing

**Direct:** The effective address is the offset of a label (e.g. in the data segment).

```asm
add  byte [value], dl
mov  bx, [word_value]
```

**Direct-offset:** Base address plus an offset (e.g. for arrays or structures).

```asm
byte_table  db  14, 15, 22, 45
; ...
mov  cl, [byte_table + 2]    ; 3rd element
mov  cx, [word_table + 3]   ; 4th word (byte offset 3 for word array depends on layout)
```

---

## Indirect memory addressing

Address is in a register (e.g. EBX, EBP, ESI, EDI). Used for arrays and pointers: load base address, then use register to index.

```asm
my_table  times 10 dw 0
; ...
mov  ebx, [my_table]   ; or: lea ebx, [my_table]
mov  [ebx], 110        ; first word
add  ebx, 2
mov  [ebx], 123        ; second word
```

---

## The MOV instruction and type specifiers

**MOV** copies data from **source** to **destination**. It does not change the source. Both operands must match in size (or you must specify size).

**Forms:** register–register, register–immediate, memory–register, register–memory, memory–immediate. Memory–memory is not allowed.

When the size is ambiguous (e.g. immediate or memory), use a **type specifier**:

| Specifier | Size |
| --- | --- |
| BYTE | 1 byte |
| WORD | 2 bytes |
| DWORD | 4 bytes |
| QWORD | 8 bytes |

Example:

```asm
mov  dword [ebx], 110   ; store 32-bit 110 at [ebx]
```

---

## Variables: initialized data (define directives)

In the **.data** section, use **define** directives to reserve and optionally initialize storage:

| Directive | Meaning | Size |
| --- | --- | --- |
| DB | Define Byte | 1 byte |
| DW | Define Word | 2 bytes |
| DD | Define Doubleword | 4 bytes |
| DQ | Define Quadword | 8 bytes |
| DT | Define Ten Bytes | 10 bytes |

**Examples:**

```asm
section .data
choice    db  'y'
number    dw  12345
big       dq  123456789
real4     dd  1.234
```

Characters are stored as ASCII (or UTF-8); numbers in little-endian; negatives in two’s complement; floats in the format the assembler supports.

---

## Variables: uninitialized data (reserve directives)

In **.bss** (or .data), use **reserve** directives to allocate space without initial value (loader typically zero-fills):

| Directive | Reserves |
| --- | --- |
| RESB | Bytes |
| RESW | Words |
| RESD | Doublewords |
| RESQ | Quadwords |
| REST | Ten-byte units |

**Example:**

```asm
section .bss
buf   resb  64
count resd  1
```

---

## Multiple initializations: TIMES

**TIMES** repeats a definition or reservation.

```asm
stars  times 9 db '*'
marks  times 9 dw 0
```

---

## Constants: EQU, %assign, %define

**EQU** — Named constant (numeric or expression); not redefinable.

```asm
TOTAL_STUDENTS equ 50
LENGTH equ 20
WIDTH  equ 10
AREA   equ LENGTH * WIDTH
; ...
mov  ecx, TOTAL_STUDENTS
```

**%assign** — Numeric constant; can be redefined later; case-sensitive.

```asm
%assign TOTAL 10
; ...
%assign TOTAL 20
```

**%define** — Text substitution (like C’s #define); can define strings or expressions; case-sensitive.

```asm
%define PTR [ebp+4]
; ...
mov  eax, PTR    ; expands to [ebp+4]
```

---

## Further reading

- [Assembly Programming — Addressing Modes (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_addressing_modes.htm)
- [Assembly Programming — Variables (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_variables.htm)
- [Assembly Programming — Constants (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_constants.htm)
- [NASM Manual](https://www.nasm.us/doc/) — Directives and addressing.
- [Assembly README](./README.md) — Topic index.
