# Assembly — Basics: registers, instructions, and addressing

[← Assembly README](./README.md)

Assembly language is a family of **low-level languages** that map closely to a CPU’s **machine code**. In **cybersecurity** you read or write it (disassembler output, shellcode, exploits); in **general engineering** (embedded, firmware, kernels, compilers, DSP) you read or write it for timing, size, or correctness. This topic covers **x86/x64** and **ARM** basics: what assembly is, registers, common instructions, and addressing. All of this is standard, documented material; see **Further reading** for official references.

---

## What assembly is

Assembly languages produce **object code** for a specific processor family. Each **instruction** is a **mnemonic** (e.g. `mov`, `add`) that corresponds to one or more **opcodes** (bytes the CPU executes). There is no single “Assembly” language: **x86/x64** (Intel/AMD), **ARM** (including AArch64), and **MIPS** each have their own instruction set and syntax. Compilers often emit assembly as an intermediate step; disassemblers show you that same level when analyzing binaries.

---

## x86/x64: registers

x86 processors have **general-purpose registers**, **segment registers**, the **instruction pointer (IP/RIP)**, and the **FLAGS** register. Usage is convention-based; the CPU does not enforce roles.

**General-purpose (32-bit names / 64-bit names):**

- **AX / RAX** — Accumulator; arithmetic, multiply/divide, string load/store.
- **BX / RBX** — Base; indexing.
- **CX / RCX** — Count; loops, string and shift count.
- **DX / RDX** — Data; extended arithmetic, I/O port address.
- **SI / RSI** — Source index for string operations.
- **DI / RDI** — Destination index for string operations.
- **BP / RBP** — Base pointer; frame pointer (stack frame).
- **SP / RSP** — Stack pointer; top of stack.

In 64-bit mode, R8–R15 add eight more general-purpose registers. Sub-registers (e.g. **AL**, **AH**, **AX**, **EAX**, **RAX**) refer to the low 8, high 8, low 16, low 32, and full 64 bits. **Segment registers** (CS, DS, SS, ES, FS, GS) are used in segmentation and in 64-bit for OS-defined purposes (e.g. FS/GS for thread-local or kernel structures). **RIP** is the 64-bit instruction pointer; **RFLAGS** holds status and control flags (zero, carry, sign, etc.).

**Example (Intel syntax):** copy immediate value into a register, then copy register to register.

```asm
mov  eax, 1234h    ; 32-bit: value 0x1234 into EAX
mov  rbx, rax      ; 64-bit: copy RAX into RBX
```

---

## x86/x64: syntax (Intel vs AT&T)

Two common syntaxes:

- **Intel syntax** — Destination first, no sigils. Dominant in Windows/DOS and in Intel’s own manuals. Used by NASM, MASM, FASM, TASM, YASM; GAS can use it with `.intel_syntax`.
- **AT&T syntax** — Source first, immediates prefixed with `$`, registers with `%`. Dominant on Unix; used by GNU Assembler (GAS) by default.

**Same operation in both:**

| Intel                      | AT&T                           |
| -------------------------- | ------------------------------ |
| `mov eax, 5`               | `movl $5, %eax`                |
| `add esp, 24h`             | `addl $0x24, %esp`             |
| `mov eax, [ebx+ecx*4+off]` | `movl off(%ebx,%ecx,4), %eax`  |

Size in AT&T is often in the mnemonic (`movl` = long/32-bit). In Intel syntax, size can be inferred from the register (e.g. `eax` = 32-bit) or specified (e.g. `byte ptr [esi]`).

---

## x86/x64: common instructions

Concepts here are from the Intel® 64 and IA-32 Architectures Software Developer Manuals and common assembly references.

- **Data movement:** `mov`, `movzx`/`movsx` (zero/sign extend), `lea` (load effective address).
- **Arithmetic:** `add`, `sub`, `inc`, `dec`, `neg`; `mul`/`imul`, `div`/`idiv`.
- **Logic:** `and`, `or`, `xor`, `not`; `shl`/`shr`, `sal`/`sar`; `rol`/`ror`, `rcl`/`rcr`.
- **Comparison / tests:** `cmp`, `test` (set flags without storing result).
- **Control flow:** `jmp`, `jcc` (conditional jumps), `call`, `ret`; `loop` (uses ECX/RCX).
- **Stack:** `push`, `pop`; `enter`/`leave` (frame setup/teardown).
- **Misc:** `nop`, `int` (software interrupt), `syscall` (64-bit Linux/Windows system call).

**Example:** add two registers and store result; compare and jump.

```asm
add   eax, ebx      ; eax = eax + ebx
cmp   eax, 0
jz    label_zero    ; jump if zero (ZF set)
```

---

## x86/x64: addressing modes

Memory operands are often in square brackets. Common forms (Intel syntax):

- **Immediate:** `mov eax, 42`
- **Register:** `mov eax, ebx`
- **Direct:** `mov eax, [addr]` — address is a constant or label.
- **Register indirect:** `mov eax, [rbx]`
- **Base + offset:** `mov eax, [rbx+8]`
- **Base + index × scale + offset:** `mov eax, [rbx + rcx*4 + 16]` — typical for arrays.

NASM uses the same idea; it requires square brackets for memory references and does not store variable types (you must indicate size when it’s not clear from the register). See the NASM manual for exact syntax and directives.

---

## Execution modes (x86/x64)

x86 supports several execution modes; which instructions and addressing you see depends on the mode:

- **Real mode (16-bit)** — 20-bit segmented addressing, 1 MiB addressable; BIOS/boot loaders.
- **Protected mode (16/32-bit)** — Memory protection, privilege levels; 32-bit flat model common.
- **Long mode (64-bit)** — 64-bit linear address space, more GPRs (R8–R15), different calling conventions; standard for modern Windows/Linux 64-bit.
- **Virtual 8086 mode** — Run real-mode code under a protected-mode OS.
- **System Management Mode (SMM)** — Firmware/power management; not used in normal user/kernel code.

Disassembly is usually **long mode** (64-bit) or **32-bit protected mode** on desktop/Server; embedded and boot code may be real or protected mode.

---

## ARM (AArch32 / AArch64) in brief

ARM is a different architecture: **load-store**, **fixed-width instructions** (32-bit in AArch32/AArch64 base), **general-purpose registers** R0–R15 (AArch32) or X0–X30/W0–W30 (AArch64). **PC** is the program counter; **SP** is stack pointer; **LR** (link register) holds return address. Conditional execution (e.g. `ADDNE`) and barrel shifter in operands are typical. ARM has its own calling conventions (e.g. R0–R3 / X0–X7 for first arguments). For full instruction set and assembly syntax, ARM’s official documentation is the reference.

**Example (ARM AArch64-style):** add two registers and store.

```asm
add   x0, x1, x2    ; x0 = x1 + x2
cmp   x0, #0
b.eq  label_zero    ; branch if equal (zero)
```

---

## Further reading

- [x86 assembly language (Wikipedia)](https://en.wikipedia.org/wiki/X86_assembly_language) — Registers, syntax, execution modes, instruction overview.
- [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Volume 1: Basic Architecture; Volume 2: Instruction Set Reference.
- [NASM Manual](https://www.nasm.us/doc/) — Syntax, directives, and usage for x86/x64 assembly with NASM.
- [ARM Documentation](https://developer.arm.com/documentation/) — Instruction set and assembly guides for AArch32 and AArch64.
