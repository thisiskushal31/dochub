# OCaml

[← Back to Languages](../README.md)

OCaml is a statically typed language in the ML family. Programs are built from expressions, not statements: almost everything evaluates to a value, and the type checker infers most types for you while rejecting ill-typed programs before they run. It combines functional idioms (immutable data, higher-order functions, algebraic data types) with a module system strong enough to structure compilers and proof tools, plus imperative features when you need them. The reference implementation compiles to fast native code or portable bytecode and includes a read-eval-print loop for experimentation.

People use it to build language implementations and developer tools, unikernel-style system images, verification and formal-methods software, and long-lived services or CLIs where predictable behavior and maintainable structure matter. In engineering and security work, you encounter OCaml when you ship or audit binaries produced by those stacks, when you depend on opam-packaged libraries in CI, or when you review supply-chain and FFI boundaries the same way you would for C or Rust artifacts.

This handbook is written to stand on its own: each chapter explains what a concept is, why it matters in practice, and how to use it, from first principles through advanced topics and whole-engineering angles (software engineering, operations, security). Explanations are text-first; code appears only where it clarifies syntax or behavior. Optional diagrams belong under `../../Assets/Languages/OCaml/` per the handbook Assets convention—not added unless they teach something text cannot.

### Supplementary reading index ([ocaml.org/docs](https://ocaml.org/docs))

The list below mirrors the tutorial layout on the OCaml documentation site. Use it when you want a second pass or browser-based exercises; it is not required to understand the chapters. All paths are under `https://ocaml.org/docs/`.

**First steps**

- [Installing OCaml](https://ocaml.org/docs/installing-ocaml)
- [A Tour of OCaml](https://ocaml.org/docs/tour-of-ocaml)
- [Your First OCaml Program](https://ocaml.org/docs/your-first-program)

**Tooling**

- [Configuring Your Editor](https://ocaml.org/docs/set-up-editor)
- [Introduction to the OCaml Toplevel](https://ocaml.org/docs/toplevel-introduction)
- [Introduction to opam Switches](https://ocaml.org/docs/opam-switch-introduction)

**Resources**

- [OCaml on Windows](https://ocaml.org/docs/ocaml-on-windows)
- [Fix Homebrew Errors on Apple M1](https://ocaml.org/docs/arm64-fix)
- [The OCaml Playground](https://ocaml.org/docs/ocaml-playground)

**Language (introduction)**

- [Values and Functions](https://ocaml.org/docs/values-and-functions)
- [Basic Data Types](https://ocaml.org/docs/basic-data-types)
- [Loops and Recursions](https://ocaml.org/docs/loops-recursion)
- [Lists](https://ocaml.org/docs/lists)
- [Higher Order Functions](https://ocaml.org/docs/higher-order-functions)
- [Labels](https://ocaml.org/docs/labels)
- [Mutability and Imperative Control Flow](https://ocaml.org/docs/mutability-imperative-control-flow)

**Module system**

- [Modules](https://ocaml.org/docs/modules)
- [Functors](https://ocaml.org/docs/functors)
- [First-Class Modules](https://ocaml.org/docs/first-class-modules)
- [Libraries With Dune](https://ocaml.org/docs/libraries-dune)

**Data structures**

- [Options](https://ocaml.org/docs/options)
- [Arrays](https://ocaml.org/docs/arrays)
- [Maps](https://ocaml.org/docs/maps)
- [Sets](https://ocaml.org/docs/sets)
- [Hash Tables](https://ocaml.org/docs/hash-tables)
- [Sequences](https://ocaml.org/docs/sequences)
- [Memoization](https://ocaml.org/docs/memoization)
- [Monads](https://ocaml.org/docs/monads)

**Advanced language**

- [Metaprogramming](https://ocaml.org/docs/metaprogramming)
- [Operators](https://ocaml.org/docs/operators)
- [Objects](https://ocaml.org/docs/objects)

**Runtime and compiler**

- [Memory Representation of Values](https://ocaml.org/docs/memory-representation)
- [Understanding the Garbage Collector](https://ocaml.org/docs/garbage-collector)
- [Compiler Frontend](https://ocaml.org/docs/compiler-frontend)
- [Compiler Backend](https://ocaml.org/docs/compiler-backend)

**Platform / guides (tooling in depth)**

- [Managing Dependencies](https://ocaml.org/docs/managing-dependencies)
- [Bootstrapping a Dune Project](https://ocaml.org/docs/bootstrapping-a-dune-project)
- [Install a Specific OCaml Compiler Version](https://ocaml.org/docs/install-a-specific-ocaml-compiler-version)
- [Debugging](https://ocaml.org/docs/debugging)
- [Profiling](https://ocaml.org/docs/profiling)
- [Error Handling](https://ocaml.org/docs/error-handling)
- [Formatting and Wrapping Text](https://ocaml.org/docs/formatting-text)

### Advanced depth and use cases

Later chapters include **where** OCaml appears in production (**unikernels**, **compilers**, **verification**), **advanced** tooling (**FFI**, **domains**), and **implementation** notes for **review** and **pipelines**. Read chapters **1 → 12** in order unless you jump to a topic.

### Deep-study workflow (body-first)

Use this sequence for a deep pass without relying on external links:

1. Read each chapter body once for concepts and terminology.
2. Re-read and extract invariants, failure modes, and operational constraints.
3. Cross-link chapters: syntax -> modules -> build -> runtime -> concurrency -> security.
4. Only then use references for edge cases, API details, or version-specific checks.

This keeps the handbook itself as the primary source while preserving references as optional validation.

---

## Chapters

Each row lists where the **supplementary docs index** (blocks under [ocaml.org/docs](https://ocaml.org/docs)) and the OCaml **5.4 manual** language reference (starting from [core language](https://ocaml.org/manual/5.4/coreexamples.html)) are covered in the chapter body—not as separate tables elsewhere.

| # | Topic | File | Docs index (supplementary) | Manual 5.4 (language reference) |
|---|--------|------|---------------------------|--------------------------------|
| 1 | Introduction: platform, artifacts, toolchain, first program | [01_Introduction_Platform_And_First_Program.md](./01_Introduction_Platform_And_First_Program.md) | First steps, tooling, resources (install, editor, toplevel, switches, Windows, M1, playground) | Core language (basics, batch programs, `Sys.argv`); entry point for the manual tutorial thread |
| 2 | Core syntax: expressions, types, pattern matching, control flow | [02_Core_Syntax_Types_And_Pattern_Matching.md](./02_Core_Syntax_Types_And_Pattern_Matching.md) | Language introduction (values through mutability); error handling | Core language: labels, polymorphic variants, polymorphism limits, GADTs |
| 3 | Modules, signatures, functors, first-class modules, Dune libraries | [03_Modules_Signatures_Functors_And_Encapsulation.md](./03_Modules_Signatures_Functors_And_Encapsulation.md) | Module system | Module system; advanced classes and modules (with ch.12) |
| 4 | opam, dune, reproducible builds, and CI | [04_Opam_Dune_Reproducible_Builds_And_CI.md](./04_Opam_Dune_Reproducible_Builds_And_CI.md) | First steps, tooling, platform guides (deps, bootstrap, compiler version) | Module system (libraries, build layout); ties to installing OCaml |
| 5 | Memory: GC, representation, mutability, FFI edges | [05_Memory_Gc_Mutability_And_FFI_Edges.md](./05_Memory_Gc_Mutability_And_FFI_Edges.md) | Runtime and compiler (memory, GC) | Memory representation, GC, **memory model (hard bits)** |
| 6 | Concurrency: domains, effects, and async libraries | [06_Concurrency_Domains_Effects_And_Async.md](./06_Concurrency_Domains_Effects_And_Async.md) | (Engineering track; not in tutorial index alone) | **Parallel programming**; **memory model** with domains |
| 7 | C interop: Ctypes, stubs, and linking | [07_C_Interop_Ctypes_Stubs_And_Linking.md](./07_C_Interop_Ctypes_Stubs_And_Linking.md) | — | Interop (manual elsewhere); complements ch.5 |
| 8 | Testing, debugging, profiling, and observability | [08_Testing_Debugging_And_Observability.md](./08_Testing_Debugging_And_Observability.md) | Platform guides (debugging, profiling, errors, formatting) | Pretty-printing, `Printf`; operational debugging |
| 9 | Security: supply chain, binaries, and assurance context | [09_Security_Supply_Chain_Binaries_And_Assurance.md](./09_Security_Supply_Chain_Binaries_And_Assurance.md) | — | Assurance posture (not a manual tutorial chapter) |
| 10 | Use cases: MirageOS, compilers, verification, ecosystem | [10_Use_Cases_Mirage_Compilers_Verification.md](./10_Use_Cases_Mirage_Compilers_Verification.md) | — | Industrial context (not a manual tutorial chapter) |
| 11 | Standard library data structures and idioms | [11_Standard_Library_Data_Structures_And_Idioms.md](./11_Standard_Library_Data_Structures_And_Idioms.md) | Data structures, monads | Containers and idioms (manual stdlib) |
| 12 | Metaprogramming, operators, objects, compiler pipeline | [12_Metaprogramming_Operators_Objects_And_Compiler.md](./12_Metaprogramming_Operators_Objects_And_Compiler.md) | Advanced language (PPX, operators, objects); runtime and compiler (front/back) | **Objects in OCaml**; compiler front/back; with ch.3 for classes+modules |

Each chapter ends with a **References** section. The supplementary link list earlier in this README is for bookmarking only; the **Coverage** columns above are the canonical map to chapter bodies.

---

## References hub (optional)

[OCaml documentation](https://ocaml.org/docs) · [opam](https://opam.ocaml.org/) · [Dune](https://dune.build/) · [MirageOS](https://mirage.io/)
