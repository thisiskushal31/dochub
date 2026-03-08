# Cairo — Cairo VM and appendix

[← Cairo README](./README.md)

This topic covers the **Cairo VM** (architecture, memory, execution, builtins, hints, runner, tracer, implementations, resources) and the **Cairo appendix** (keywords, operators and symbols, derivable traits, prelude, common error messages, development tools). Content is standalone; links for deeper detail are in Further reading. The VM is relevant across engineering perspectives: **software** (debugging, performance), **DevOps** (runners, proof pipelines), **cybersecurity** (trace analysis, understanding execution for audits), and **research** (proof system, builtins, constraints).

---

# Part I: Cairo VM

## Introduction to the Cairo VM

The **Cairo VM** is the execution environment for Cairo programs. It runs the compiled program instruction by instruction, maintains memory segments, and records a **trace** used by the prover to generate a STARK proof. Understanding the VM helps when optimizing programs, debugging low-level behavior, or integrating with tooling (e.g. runners, tracers).

---

## Architecture

The VM has a defined **architecture**: a set of registers, a memory model (segments), and a list of **builtins** (range check, Pedersen, ECDSA, etc.). Instructions read and write memory and update registers; builtins provide operations that would be expensive or impossible to express in pure Cairo. The architecture is designed so that execution can be converted into a constraint system for proving.

---

## Memory

Cairo memory is **segmented**. Each segment has a base address and a list of cells; once a cell is written, it is immutable. **Non-deterministic read-only memory** allows the prover to supply values for certain reads (e.g. for hints) under constraints. **Segments and relocation** determine how addresses are laid out and how the trace is structured for the prover. There is no arbitrary mutable RAM; all writes are append-only to segments.

---

## Execution model

The **execution model** defines how instructions are decoded and executed: which registers are read or written, how the program counter advances, and how builtins are invoked. Execution continues until the program halts (e.g. **ret** or similar). The resulting **trace** (register and memory state over time) is the input to the prover.

---

## Builtins

**Builtins** are special units that provide operations outside core arithmetic: e.g. **Output** (for program output), **Pedersen** (hash), **RangeCheck** (range verification), **ECDSA** (signature verification), **Bitwise**, **Keccak**, **Poseidon**, **Segment Arena**, **Mod**. Each builtin has a cost and a defined interface. The VM tracks builtin usage so that the prover can generate valid proofs; programs declare which builtins they use.

---

## Hints

**Hints** are instructions that provide **non-deterministic** input to the prover. The prover fills in values (e.g. for a square root or a lookup); the constraint system then checks that those values are consistent with the rest of the execution. Hints do not appear in the verified trace in the same way as normal instructions; they are used to make proving feasible. Use hints only through the documented APIs and ensure the resulting constraints are sound.

---

## Runner

The **Runner** compiles and executes a Cairo program. It handles **program** loading and parsing (e.g. from Sierra or Cairo artifacts), **runner mode** (e.g. execution vs proof mode), and **output** (e.g. Cairo PIE, memory file, trace file, AIR public/private inputs). These artifacts are what the prover and verifier consume. The exact formats and flags depend on the toolchain (e.g. Scarb, cairo-run).

---

## Tracer

The **Tracer** instruments execution so that you can inspect state step by step. It is used for debugging and for understanding how a program behaves at the VM level. Trace output can be fed into visualization or analysis tools.

---

## Implementations and resources

Multiple **implementations** of the Cairo VM and toolchain exist (e.g. the reference implementation, Rust-based tools). **Resources** (docs, papers, repos) describe the VM, the proof system, and Sierra. When integrating or extending tooling, refer to the official specs and the implementation you are using.

---

# Part II: Appendix (Cairo)

## Keywords

The language reserves a set of **keywords** (e.g. **fn**, **let**, **mut**, **struct**, **enum**, **trait**, **impl**, **mod**, **use**, **if**, **else**, **match**, **loop**, **while**, **for**, **return**, **break**, **continue**, **ref**, **true**, **false**). They cannot be used as identifiers. The full list is in the language reference.

---

## Operators and symbols

**Operators** include arithmetic (**+**, **-**, **\***, **/**, **%**), comparison (**==**, **!=**, **&lt;**, **&gt;**, **&lt;=**, **&gt;=**), logical (**&amp;&amp;**; **||**), bitwise (**&amp;**; **|**; **^**; **&lt;&lt;**; **&gt;&gt;**), and assignment (**=**; **+=**; etc.). **Symbols** also cover dereference (**\***), snapshot (**@**), path (**::**), and so on. Precedence and associativity are defined in the language spec; use parentheses when in doubt.

---

## Derivable traits

Common **derivable** traits include **Drop** (no-op on drop), **Copy** (copy by value), **Destruct** (squash/cleanup on drop, e.g. for dicts), **PartialEq**, **Eq**, **Debug** (for **{:?}**), **Default**, **Serde** (serialization), and others. Use **#[derive(Trait)]** when the compiler can generate a correct implementation; otherwise implement the trait manually. Types that contain **Felt252Dict** cannot derive **Drop** and must use **Destruct**.

---

## The Cairo prelude

The **prelude** is the set of items that are automatically in scope in every module (e.g. common traits, **Option**, **Result**, **println!**). You do not need to **use** them explicitly. The exact list is in the appendix; it includes core types and macros used in everyday code.

---

## Common error messages

Compilation and runtime produce **error messages** for type mismatches, missing trait implementations, ownership violations, non-exhaustive match, and so on. Learning to read these messages speeds up debugging. The appendix documents frequent errors and how to fix them (e.g. “Variable was previously moved”, “Match is non-exhaustive”, “Trait has no implementation”).

---

## Useful development tools

**scarb** is the standard build and package tool: **scarb build**, **scarb test**, **scarb fmt** (format), **scarb execute**, **scarb prove**, **scarb verify**. The **Cairo language server** (e.g. via the VSCode extension) provides completion, go-to-definition, and diagnostics. **Starknet Foundry** (**snforge**) is used for contract testing and deployment. Use these tools for a consistent workflow from development to proof generation and verification.

---

## Further reading

- [The Cairo Book — Cairo VM Introduction](https://www.starknet.io/cairo-book/ch200-introduction.html)
- [The Cairo Book — Architecture](https://www.starknet.io/cairo-book/ch201-architecture.html)
- [The Cairo Book — Memory](https://www.starknet.io/cairo-book/ch202-00-memory.html)
- [The Cairo Book — Execution Model](https://www.starknet.io/cairo-book/ch203-00-execution-model.html)
- [The Cairo Book — Builtins](https://www.starknet.io/cairo-book/ch204-00-builtins.html)
- [The Cairo Book — Hints](https://www.starknet.io/cairo-book/ch205-00-hints.html)
- [The Cairo Book — Runner](https://www.starknet.io/cairo-book/ch206-00-runner.html)
- [The Cairo Book — Appendix (Cairo)](https://www.starknet.io/cairo-book/appendix-00.html)
- [The Cairo Book — Keywords](https://www.starknet.io/cairo-book/appendix-01-keywords.html)
- [The Cairo Book — Operators and Symbols](https://www.starknet.io/cairo-book/appendix-02-operators-and-symbols.html)
- [The Cairo Book — Derivable Traits](https://www.starknet.io/cairo-book/appendix-03-derivable-traits.html)
- [The Cairo Book — Cairo Prelude](https://www.starknet.io/cairo-book/appendix-04-cairo-prelude.html)
- [The Cairo Book — Common Error Messages](https://www.starknet.io/cairo-book/appendix-05-common-error-messages.html)
- [The Cairo Book — Development Tools](https://www.starknet.io/cairo-book/appendix-06-useful-development-tools.html)
- [Cairo README](./README.md) — Topic index.
