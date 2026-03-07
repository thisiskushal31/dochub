# Assembly

[← Back to Languages](../README.md)

**Why in security:** **Reverse engineering**, **malware analysis**, and **exploit development** often require reading or writing assembly. Disassemblers and debuggers (IDA, Ghidra, x64dbg, radare2) show code as assembly; shellcode and payloads are written in it. You don’t need to be fluent, but recognizing instructions, calling conventions, and structure is essential.

**Relevance:** x86/x64 (Intel/AMD), ARM (including ARM64), and sometimes MIPS appear in malware and embedded targets. Understanding stack layout, registers, and common patterns helps with binary analysis and vulnerability research.

**Planned topics:** (add numbered `.md` files and link below)

- Basics: registers, instructions, addressing; x86/x64 vs ARM
- Reading disassembly: control flow, function prologue/epilogue, calling conventions
- Where it shows up: malware, shellcode, firmware, exploit payloads
- Tooling: disassemblers, debuggers, and how they present assembly

---

## Topics

| # | Topic | File |
|---|--------|------|
| _TBD_ | _Add topic files and link here_ | |

---

## Further reading

- [x86 Assembly (Wikipedia)](https://en.wikipedia.org/wiki/X86_assembly_language)
- [ARM architecture](https://developer.arm.com/documentation/)
- [Ghidra](https://ghidra-sre.org/), [IDA](https://hex-rays.com/ida-pro/), [radare2](https://rada.re/n/)
