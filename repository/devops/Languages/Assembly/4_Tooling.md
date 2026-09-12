# Assembly — Tooling: disassemblers, debuggers, and how they present assembly

[← Assembly README](./README.md)

Analysis of binaries and shellcode relies on **disassemblers** and **debuggers** that present **assembly** (and often **decompiled** code). This topic summarizes common tools and how they show assembly; see each project’s or vendor’s documentation for details.

---

## Disassemblers

A **disassembler** turns **machine code** (bytes) into **assembly** (mnemonics and operands). It does not run the program; it interprets the instruction set (x86, ARM, etc.) and, optionally, applies **symbols** and **control-flow analysis**.

- **IDA Pro** — Commercial; interactive disassembly, graph view, plugins, debugger. Dominant in reverse engineering; supports many architectures. [Hex-Rays](https://hex-rays.com/ida-pro/).
- **Ghidra** — Free (NSA); decompiler, graph view, scripting, collaborative reverse engineering. Supports x86/x64, ARM, MIPS, and others. [Ghidra](https://ghidra-sre.org/).
- **Binary Ninja** — Commercial (with limited free tier); API-rich, intermediate language (IL), scripting. [Binary Ninja](https://binary.ninja/).
- **radare2 (r2)** — Free, CLI and Cutter GUI; disassembly, debugging, scripting. [radare2](https://rada.re/n/).
- **objdump** — Free (GNU binutils); `objdump -d` for disassembly. No GUI; useful in scripts and pipelines.
- **llvm-objdump** — LLVM tool; similar to objdump, supports many targets.

**Presentation:** Disassembly is usually shown as a **listing** (address, bytes, mnemonic, operands) and/or a **control-flow graph** (basic blocks and edges). Some tools show **pseudocode** (decompiled C) alongside assembly; the assembly view remains the ground truth for instruction-level analysis.

---

## Debuggers

A **debugger** runs the program and shows **assembly** at the current instruction pointer (and elsewhere). You can set breakpoints, step, inspect registers and memory; essential for **dynamic analysis** and **exploit development**.

- **GDB** — Free (GNU); scriptable, supports x86, ARM, etc. Default on Linux. [GDB](https://www.gnu.org/software/gdb/).
- **x64dbg** — Free, Windows; user-friendly GUI, breakpoints, trace. [x64dbg](https://x64dbg.com/).
- **WinDbg** — Microsoft; kernel and user-mode debugging on Windows. [WinDbg](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/).
- **LLDB** — Free (LLVM); used on macOS and elsewhere; GDB-like interface. [LLDB](https://lldb.llvm.org/).
- **IDA / Ghidra / Binary Ninja** — Include or integrate debugging; same disassembly view while stepping.

**Presentation:** The **current instruction** is highlighted; **registers** and **stack** are shown in panels. You can switch between **Intel** and **AT&T** syntax in many tools (e.g. GDB `set disassembly-flavor`). Stepping “into” a `call` or “over” it changes how you follow control flow.

---

## Assemblers (when you write assembly)

When you **write** assembly (e.g. shellcode, patches, or small utilities), you use an **assembler**:

- **NASM** — Netwide Assembler; Intel syntax; x86/x64; cross-platform. [NASM](https://www.nasm.us/), [NASM Manual](https://www.nasm.us/doc/).
- **GAS (GNU as)** — Part of binutils; AT&T syntax by default; many architectures. [GNU as](https://sourceware.org/binutils/docs/as/).
- **MASM** — Microsoft Macro Assembler; Windows; Intel-style. [MASM](https://docs.microsoft.com/en-us/cpp/assembler/masm/masm-for-x64-ml64-exe).
- **ARM assembler** — armasm (Keil), GAS for ARM; syntax and directives depend on the toolchain. [ARM Documentation](https://developer.arm.com/documentation/).

The **syntax** (Intel vs AT&T, directive names) is specific to each assembler; the **instruction set** is defined by the CPU vendor (Intel/AMD, ARM).

---

## How tools present assembly

- **Address** — Virtual address or file offset of the instruction.
- **Bytes** — Raw machine code (hex).
- **Mnemonic** — Instruction name (e.g. `mov`, `call`, `jz`).
- **Operands** — Registers, immediates, memory references (often with **symbols** or **labels** if available).
- **Comments** — Auto-generated (e.g. “string reference”, “cross-reference to …”) or user-added.
- **Graph view** — Basic blocks as nodes, jumps/calls as edges; helps see branches and loops.

Choosing **Intel** vs **AT&T** is preference and target (Windows/tutorials often Intel; GNU/Unix often AT&T). For **x86/x64**, Intel syntax matches the processor manuals; for **ARM**, toolchain docs define the syntax.

---

## Further reading

- [Ghidra](https://ghidra-sre.org/) — Documentation and support.
- [IDA Pro](https://hex-rays.com/ida-pro/) — Hex-Rays product and docs.
- [radare2](https://rada.re/n/) — Book and documentation.
- [NASM Manual](https://www.nasm.us/doc/) — Syntax and directives.
- [GDB Manual](https://sourceware.org/gdb/current/onlinedocs/gdb/) — Disassembly and debugging.
- [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) — Instruction reference for interpreting disassembly.
