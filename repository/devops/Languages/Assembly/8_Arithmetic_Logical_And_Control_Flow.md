# Assembly — Arithmetic, logical, and control-flow instructions

[← Assembly README](./README.md)

This topic covers **arithmetic** (INC, DEC, ADD, SUB, MUL, DIV), **logical** (AND, OR, XOR, TEST, NOT), and **control flow** (CMP, JMP, conditional jumps, loops). Same format: explanation first, then examples. See **Further reading** for sources.

---

## Arithmetic: INC and DEC

**INC** adds 1 to the operand; **DEC** subtracts 1. Operand can be register or memory. Size can be byte, word, or doubleword.

```asm
inc  eax
dec  byte [count]
inc  word [bx]
```

---

## ADD and SUB

**ADD** and **SUB** perform addition and subtraction. Both set flags (CF, OF, ZF, SF, etc.). Operands: register, memory, or immediate; at least one operand is often a register. Memory-to-memory is not allowed.

```asm
add  eax, ebx
sub  eax, 10
add  [sum], eax
```

**Example (add two digits, then print):** Convert ASCII digit to number by subtracting `'0'`; add; convert result back to ASCII for output.

```asm
mov  eax, [num1]
sub  eax, '0'
mov  ebx, [num2]
sub  ebx, '0'
add  eax, ebx
add  eax, '0'
mov  [res], eax
; then sys_write to print res
```

---

## MUL and IMUL (multiplication)

**MUL** — Unsigned multiply. One operand (multiplier) is given; the other (multiplicand) is implicit in AL, AX, or EAX. Product goes to AX (byte × byte), DX:AX (word × word), or EDX:EAX (dword × dword).

**IMUL** — Signed multiply; same size rules.

```asm
mov  al, 10
mov  dl, 25
mul  dl        ; product in AX
```

---

## DIV and IDIV (division)

**DIV** — Unsigned divide. Dividend is in AX (16-bit), DX:AX (32-bit), or EDX:EAX (64-bit). Divisor is the operand. Quotient and remainder go to fixed registers (e.g. 16-bit: quotient AL, remainder AH).

**IDIV** — Signed division; same layout.

```asm
mov  ax, 8
sub  ax, '0'
mov  bl, 2
sub  bl, '0'
div  bl        ; quotient in AL, remainder in AH
add  al, '0'
mov  [res], al
```

---

## Logical: AND, OR, XOR, TEST, NOT

**AND** — Bitwise AND; often used to clear bits (e.g. mask).

```asm
and  bl, 0fh   ; clear high nibble
and  al, 01h   ; test LSB (odd/even)
jz   even_label
```

**OR** — Bitwise OR; used to set bits.

```asm
or   bl, 0fh   ; set low four bits
```

**XOR** — Bitwise XOR; same bit → 0, different → 1. XORing a value with itself clears it (e.g. `xor eax, eax`).

```asm
xor  eax, eax  ; zero EAX
```

**TEST** — Like AND but does not write the result; only updates flags. Used for testing bits (e.g. zero, sign).

```asm
test al, 01h
jz   even_number
```

**NOT** — Bitwise complement (invert all bits).

```asm
not  eax
```

---

## Comparisons and conditional execution: CMP

**CMP** subtracts the second operand from the first and sets flags; it does **not** store the result. Use it before conditional jumps.

```asm
cmp  dx, 0
je   label_l7
cmp  edx, 10
jle  loop_body
```

---

## Unconditional jump: JMP

**JMP** transfers control to a label. No condition.

```asm
jmp  target_label
```

---

## Conditional jumps (overview)

Conditional jumps test **flags** set by a previous instruction (usually CMP or TEST). Common ones:

**Signed comparisons (after CMP):**

| Instruction | Meaning | Typical use |
| --- | --- | --- |
| JE / JZ | Jump if equal / zero | ZF = 1 |
| JNE / JNZ | Jump if not equal / not zero | ZF = 0 |
| JG / JNLE | Jump if greater (signed) | ZF=0 and SF=OF |
| JGE / JNL | Jump if greater or equal | SF = OF |
| JL / JNGE | Jump if less | SF ≠ OF |
| JLE / JNG | Jump if less or equal | ZF=1 or SF≠OF |

**Unsigned:** JA, JAE, JB, JBE (above/below).

**Flag-based:** JC (carry), JNC, JO, JNO, JS, JNS, JP, JNP.

**Example (largest of three):**

```asm
mov  ecx, [num1]
cmp  ecx, [num2]
jg   check_third
mov  ecx, [num2]
check_third:
cmp  ecx, [num3]
jg   done
mov  ecx, [num3]
done:
mov  [largest], ecx
```

---

## Loops

**LOOP** decrements **ECX** (or CX in 16-bit) and jumps to the label if the result is not zero. So ECX acts as loop count.

```asm
mov  ecx, 10
l1:
   ; loop body
   loop l1
```

**Manual loop with JNZ:**

```asm
mov  cl, 10
l1:
   ; loop body
   dec  cl
   jnz  l1
```

---

## Further reading

- [Assembly Programming — Arithmetic Instructions (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_arithmetic_instructions.htm)
- [Assembly Programming — Logical Instructions (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_logical_instructions.htm)
- [Assembly Programming — Conditions (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_conditions.htm)
- [Assembly Programming — Loops (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_loops.htm)
- [Intel® 64 and IA-32 Architectures Software Developer Manual, Volume 2](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Instruction reference.
- [Assembly README](./README.md) — Topic index.
