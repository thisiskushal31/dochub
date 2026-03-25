# Introduction: platform, artifacts, toolchain, first program

[← Back to OCaml](./README.md)

## What this chapter covers

What OCaml is as a language and runtime, why teams adopt it, how the pieces fit together on disk, and how to run a minimal build you can repeat in CI. After this chapter you should know what native and bytecode outputs mean, what opam and dune do, and how to interpret a small project layout.

---

## 1. What OCaml is

OCaml belongs to the ML family of languages. Computation is expressed as **values** and **expressions** that evaluate to values. The compiler performs **static type checking**: types are known at compile time, and the implementation infers most types so you do not repeat them everywhere. That combination catches many mistakes before execution and keeps refactors safer than in untyped scripting languages.

The language is **mostly functional** by default: immutable bindings and persistent data structures are normal. It also includes **modules** (separate compilation units with interfaces), **functors** (functions that take modules and return modules), and **imperative** features (refs, mutable fields, arrays, loops) when algorithms or interop are clearer that way.

---

## 2. Why it is used

OCaml is a strong fit when you want:

- **Correctness-oriented tooling**—compilers, analyzers, and proof-adjacent systems where rich types and pattern matching reduce whole classes of bugs.
- **Long-lived infrastructure**—libraries and services where explicit module boundaries and reproducible builds matter.
- **Native performance** without a C++-scale language—single executables suitable for CLIs and servers, with predictable garbage collection for typical workloads.

In security and operations, you meet OCaml when you maintain or audit **native binaries** from those domains, when you **depend on opam packages** in a pipeline, or when you **review FFI** to C libraries. None of that requires application-level fluency on day one, but understanding the toolchain prevents false assumptions during triage and supply-chain review.

---

## 3. How compilation works (two targets)

The reference OCaml implementation can produce:

- **Native code** via `ocamlopt`: machine code for the host ABI, linked like a C program. This is the usual choice for production binaries and performance-sensitive tools.
- **Bytecode** via `ocamlc`: portable `.cmo` object files and `.cma` archives, or a bytecode executable that runs on the OCaml virtual machine. Bytecode starts faster to iterate and is easier to move across similar OS/architecture pairs, but runs slower than native.

Both paths share the same **front-end** (parsing, type checking). The **back-end** differs. In practice **dune** drives `ocamlopt` or `ocamlc` according to rules in your project.

**Linking:** native builds produce **object** files that the **system linker** combines with **C** runtime and **foreign** libraries (`-cclib`, `-ccopt`, or dune’s `foreign_stubs`). The result is a normal **ELF**/**Mach-O** binary with **dynamic** dependencies you can inspect with `ldd`/`otool` like any other native artifact—important for **SBOM**-style inventory and **incident** triage.

---

## 4. Artifacts you will see on disk

| Suffix | Meaning |
|--------|---------|
| `.ml` | Source file (implementation). |
| `.mli` | Source file (interface, optional). |
| `.cmi` | Compiled interface: **types** exported by a unit. Other units depend on this for separate compilation. |
| `.cmo` | Bytecode object file. |
| `.cmx` | Native object file. |
| `.cma` | Bytecode library archive. |
| `.cmxa` | Native static library archive. |

If you see a build failure mentioning a missing `.cmi`, the dependency order or visibility of module interfaces is wrong—often a missing `open`, a wrong library name in dune, or a stale incremental build.

---

## 5. Toolchain roles

**opam** is the package manager. It installs **compiler versions** and **libraries** into a **switch** (an isolated prefix). You can have multiple switches on one machine: one per project or one per team policy. That is how you pin OCaml 5.1 versus 4.14 for different codebases.

**dune** is the build system most new projects use. You declare **libraries**, **executables**, and **tests** in `dune` files; dune computes dependencies, calls the compiler, and runs tests. It replaces hand-written Makefiles for most workflows.

**The toplevel** (`ocaml` or `utop`) is a REPL: you type expressions and see types and values. It is for learning and small experiments, not for production deployment.

**ocamlopt** and **ocamlc** are the compilers. You rarely invoke them directly when using dune.

---

## 6. Minimal project layout and first build

A minimal executable project has a `dune-project` file at the root and a `dune` file next to the source. The `dune-project` names the project and language version; the `dune` file declares an **executable** (name and list of modules).

Example `dune-project`:

```scheme
(lang dune 3.0)
(name hello)
```

Example `dune` beside `bin/main.ml`:

```scheme
(executable
 (name main)
 (public_name hello))
```

Example `bin/main.ml`:

```ocaml
let () = print_endline "Hello, OCaml"
```

After creating an opam switch and installing dependencies (including dune), you build from the project root:

```bash
dune build
dune exec hello
```

The public name controls the installed binary name; the internal name `main` matches `main.ml`. Exact names depend on your layout; the important idea is that **one** dune graph builds **all** local units and links them.

---

## 7. Reproducibility and CI

To make CI match developer machines:

- Record the **compiler** version (e.g. `ocaml-base-compiler` with a concrete version in opam).
- Record **dune** and **opam** versions in the environment or in lockfiles.
- Run **clean** builds in release pipelines when diagnosing mysterious linker errors; incremental caches speed development but can hide stale `.cmi` issues.

For security review, the same metadata identifies **which** dependency graph produced a **release** binary.

---

## Advanced use cases and implementation

Container images for CI often preinstall opam and a compiler. Mount the project, run `opam install . --deps-only` (or your project’s documented install path), then `dune build` and `dune runtest`. Cache the opam switch directory only when the lockfile and base image tag are part of the cache key; otherwise you get flaky failures.

---

## References

### Primary — first steps

- [Installing OCaml](https://ocaml.org/docs/installing-ocaml)
- [A Tour of OCaml](https://ocaml.org/docs/tour-of-ocaml)
- [Your First OCaml Program](https://ocaml.org/docs/your-first-program)

### Primary — tooling

- [Configuring Your Editor](https://ocaml.org/docs/set-up-editor)
- [Introduction to the OCaml Toplevel](https://ocaml.org/docs/toplevel-introduction)
- [Introduction to opam Switches](https://ocaml.org/docs/opam-switch-introduction)

### Primary — resources

- [OCaml on Windows](https://ocaml.org/docs/ocaml-on-windows)
- [Fix Homebrew Errors on Apple M1](https://ocaml.org/docs/arm64-fix)
- [The OCaml Playground](https://ocaml.org/docs/ocaml-playground)

### Hub

- [Learn OCaml](https://ocaml.org/docs)
