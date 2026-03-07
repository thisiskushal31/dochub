# Assembly — Numbers, strings, and arrays

[← Assembly README](./README.md)

This topic covers **numeric representation** (ASCII and BCD), **string** layout and **string instructions** (MOVS, LODS, STOS, CMPS, SCAS), and **arrays** in assembly. Same format: text first, then code. See **Further reading** for sources.

---

## Numbers: binary, ASCII, and BCD

Arithmetic in the CPU works on **binary** data. When numbers are read from keyboard or shown on screen they are in **ASCII**. So input is often converted to binary (e.g. subtract `'0'` for a digit), you do the math, then convert the result back to ASCII for output.

**Decimal in two common forms:**

- **ASCII** — One character per digit (e.g. 1234 as bytes 31h, 32h, 33h, 34h). Instructions **AAA, AAS, AAM, AAD** adjust after/before arithmetic for ASCII digits (operand in AL).
- **BCD (Binary Coded Decimal)** — Unpacked: one digit per byte; packed: two digits per byte (4 bits each). **DAA** and **DAS** adjust after addition/subtraction for packed BCD. **AAM** and **AAD** are used for unpacked BCD multiply/divide.

---

## Arrays: definition and traversal

An **array** is a contiguous block of memory. Define it with **DW**, **DD**, etc., or **TIMES** for repeated values.

**Define and abbreviate:**

```asm
NUMBERS   DW  34, 45, 56, 67, 75, 89
INVENTORY TIMES 8 DW 0
```

The first element is at the label; the next at label+2 for words, label+4 for dwords, etc. Traverse by keeping a pointer in a register and incrementing it by the element size, or by using an index.

**Example: sum three bytes and print result:**

```asm
section .text
   global _start
_start:
   mov  eax, 3        ; number of elements
   mov  ebx, 0        ; sum
   mov  ecx, x        ; pointer to current element
top:
   add  ebx, [ecx]
   add  ecx, 1        ; next byte
   dec  eax
   jnz  top
   add  ebx, '0'
   mov  [sum], ebx
   ; ... sys_write sum, then sys_exit ...
section .data
x:   db 2, 4, 3
sum: db 0
```

---

## Strings: length and sentinel

Strings are byte sequences. You can represent length in two ways:

**Explicit length** — Use the **$** location counter so the assembler computes length:

```asm
msg  db  'Hello, world!', 0xa
len  equ  $ - msg
```

**Sentinel character** — End the string with a byte that does not appear in the text (e.g. 0):

```asm
message db  'I am loving it!', 0
```

---

## String instructions (overview)

String instructions use **ESI** (source) and **EDI** (destination); they advance ESI/EDI according to the **direction flag** (DF). **CLD** clears DF (forward); **STD** sets it (backward).

| Instruction | Byte | Word | Doubleword | Purpose |
| --- | --- | --- | --- | --- |
| MOVS | MOVSB | MOVSW | MOVSD | Copy from [ESI] to [EDI] |
| LODS | LODSB | LODSW | LODSD | Load from [ESI] into AL/AX/EAX |
| STOS | STOSB | STOSW | STOSD | Store AL/AX/EAX to [EDI] |
| CMPS | CMPSB | CMPSW | CMPSD | Compare [ESI] and [EDI], set flags |
| SCAS | SCASB | SCASW | SCASD | Compare AL/AX/EAX with [EDI], set flags |

**Repetition prefixes:** **REP** repeats until **ECX** is zero. **REPE/REPZ** and **REPNE/REPNZ** repeat while ZF matches (e.g. for compare-and-scan). ECX is decremented each iteration.

**Example (copy a string with REP MOVSB):** Set ESI to source, EDI to destination, ECX to length, then `cld` and `rep movsb`.

---

## Further reading

- [Assembly Programming — Numbers (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_numbers.htm)
- [Assembly Programming — Strings (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_strings.htm)
- [Assembly Programming — Arrays (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_arrays.htm)
- [Assembly README](./README.md) — Topic index.
