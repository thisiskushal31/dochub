# Assembly — Reading disassembly and calling conventions

[← Assembly README](./README.md)

When you reverse engineer a binary, the disassembler shows **control flow**, **function boundaries**, and **how arguments and return values are passed**. This topic summarizes **how to read disassembly** (prologue/epilogue, stack frame) and **calling conventions** (x86-64 and ARM). Details come from common ABI documents and processor manuals; see **Further reading**.

---

## Why calling conventions matter

A **calling convention** defines how the caller passes arguments (registers and/or stack), who cleans the stack, which registers are **caller-saved** vs **callee-saved**, and where the return value goes. Without this, you cannot reliably identify parameters and locals in disassembly or write correct shellcode/patches.

---

## x86-64: typical prologue and epilogue

A function often starts with a **prologue** that sets up a **stack frame**:

1. **Push frame pointer** — `push rbp` (save caller’s RBP).
2. **Set new frame** — `mov rbp, rsp` (RBP = current stack top).
3. **Allocate locals** — `sub rsp, N` (reserve N bytes for local variables).

The **epilogue** reverses this before returning:

1. **Restore stack** — `mov rsp, rbp` (or `add rsp, N`).
2. **Restore RBP** — `pop rbp`.
3. **Return** — `ret`.

**Example (x86-64, Intel syntax):**

```asm
; Prologue
push  rbp
mov   rbp, rsp
sub   rsp, 20h       ; 32 bytes for locals

; ... function body ...

; Epilogue
mov   rsp, rbp
pop   rbp
ret
```

`leave` (equivalent to `mov rsp, rbp`; `pop rbp`) is often used in the epilogue. **Tail calls** or optimizations may omit a full frame (no RBP save); the compiler may use RSP-relative addressing only.

---

## x86-64: common calling conventions (Linux/Windows)

**System V AMD64 ABI (Linux, macOS):**

- **Integer/pointer arguments:** RDI, RSI, RDX, RCX, R8, R9 (first six); rest on stack (right-to-left).
- **Return value:** RAX (and RDX for a second 64-bit value).
- **Caller-saved:** RAX, RCX, RDX, RSI, RDI, R8–R11 — caller must save if it needs them after the call.
- **Callee-saved:** RBX, RBP, R12–R15 — callee must preserve them.
- **Stack alignment:** 16-byte aligned before `call` (e.g. `sub rsp, 8` before call if needed for alignment).

**Microsoft x64 (Windows):**

- **Arguments:** RCX, RDX, R8, R9 (first four); rest on stack.
- **Return:** RAX (and RDX when needed).
- **Caller-saved:** RAX, RCX, RDX, R8–R11.
- **Callee-saved:** RBX, RBP, RDI, RSI, RSP, R12–R15.
- **Shadow space:** Caller reserves 32 bytes (four 8-byte slots) above return address for the callee to spill register arguments.

When reading disassembly, look for **mov** into RDI/RSI/… or RCX/RDX/… before `call` to see arguments; **mov** into RAX before `ret` (or after the call) for return value.

---

## Control flow in disassembly

- **Unconditional jump:** `jmp` — next instruction is at the target.
- **Conditional jumps:** `jz`/`je`, `jnz`/`jne`, `jg`/`jnle`, `jl`/`jnge`, etc. — depend on FLAGS (e.g. from a preceding `cmp` or `test`).
- **Call:** `call` — pushes return address (next instruction), then jumps. **Return:** `ret` — pops address and jumps there.
- **Loop:** `loop` (decrements RCX/ECX, jumps if non-zero) or a sequence of `dec`/`cmp` + `jcc`.

Identifying **basic blocks** (single entry, single exit) and **edges** (jumps/calls/returns) gives you the **control-flow graph** that tools like IDA or Ghidra show.

---

## Stack layout (conceptual)

After a `call`, the stack (growing down) typically looks like:

- **Higher addresses** — Caller’s frame (locals, saved registers).
- **Return address** — Pushed by `call`.
- **Arguments (if on stack)** — Right-to-left in System V; then callee’s frame pointer and locals.

RBP (if used) points to the saved RBP; locals are at negative offset from RBP (e.g. `[rbp-8]`), arguments (when passed on stack) at positive offset above the return address. This layout is defined by the ABI and used by debuggers and reverse-engineering tools.

---

## ARM: brief convention note

On **ARM64 (AArch64)**:

- **Arguments:** X0–X7 (first eight); rest on stack.
- **Return:** X0 (and X1 if needed).
- **Caller-saved:** X0–X18, LR (X30).
- **Callee-saved:** X19–X28, FP (X29), SP.

LR holds the return address; a function that calls others typically saves LR (and callee-saved regs) in the prologue and restores them in the epilogue. ARM’s official documentation and the ARM64 ABI documents define this precisely.

---

## Further reading

- [System V AMD64 ABI](https://refspecs.linuxfoundation.org/elf/x86_64-abi-0.99.pdf) — Calling convention, stack frame, register usage (Linux/macOS).
- [Microsoft x64 Software Conventions](https://docs.microsoft.com/en-us/cpp/build/x64-calling-convention) — Windows x64 calling convention and shadow space.
- [Intel® 64 and IA-32 Architectures Software Developer Manual, Volume 1](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Basic architecture, stack, calls/returns.
- [ARM Architecture Procedure Call Standard](https://developer.arm.com/documentation/) — AAPCS for AArch32 and AArch64.
