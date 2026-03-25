# Modules, signatures, functors, first-class modules, Dune libraries

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml scales programs beyond single files: **modules** bundle code, **signatures** describe what clients may use, **functors** parameterize whole modules, and **first-class modules** let you pass modules as values. You will also see how **dune** names libraries and maps them to the filesystem. This is the same structuring mechanism used in large compilers and verification tools.

---

## 1. The problem modules solve

As code grows, you need **boundaries**: what is public, what is private, and how to swap implementations without changing every call site. OCaml modules are not an afterthought—they are the primary unit of **compilation** and **abstraction**. You can type-check a module against an **interface** (signature) before linking it with the rest of the program.

---

## 2. Structures and signatures

A **structure** is a named collection of types, values, and nested modules. A **signature** lists the names and types that **export** to the outside world.

Here a signature `COUNTER` exposes an abstract type `t` and operations on it:

```ocaml
module type COUNTER = sig
  type t
  val make : int -> t
  val bump : t -> t
  val read : t -> int
end

module IntCounter : COUNTER = struct
  type t = int
  let make n = n
  let bump n = n + 1
  let read n = n
end
```

Clients of `IntCounter` can use `make`, `bump`, and `read`, but they **cannot** treat `t` as `int` unless the signature exposes it. That is **representation hiding**: you can enforce invariants (e.g. “counter is never negative”) inside the module.

---

## 3. Functors

A **functor** is a function at the module level: it takes one or more **modules** (matching input signatures) and **produces** a new module. Typical uses:

- **Generic containers** parameterized by a comparison or hash function.
- **Pluggable backends** (e.g. in-memory vs on-disk storage) that share one algorithm module.

Conceptually:

```ocaml
module type ORD = sig
  type t
  val compare : t -> t -> int
end

(* Functor: given ORD, build a module that can work with sets of t *)
(* The real Stdlib uses similar functors for Map.Make and Set.Make *)
```

Functors are resolved at **compile time**: the whole instantiation is checked. The cost is sometimes more complex build graphs and steeper learning for newcomers; the benefit is strong guarantees about **which** operations exist on abstract types.

---

## 4. First-class modules

Sometimes you need to **choose** a module implementation at **runtime** (for example a plugin or a configuration-driven backend). **First-class modules** pack a module together with its signature into a value you can pass around. You unpack them with `match` and use the operations inside.

Use cases:

- Plugin systems where each plugin implements the same signature.
- Serializing or dispatching over a small closed set of implementations.

This is advanced; most services get far with **static** functors and ordinary modules.

---

## 5. Encapsulation and security review

Small signatures with **explicit** I/O and network operations are easier to audit than “god modules” that export everything. **Private** types mean callers cannot forge values that violate your rules—important for **configuration**, **credentials**, or **capabilities** represented as abstract types.

---

## 6. Libraries and dune

In dune, a **library** is a named unit of compilation with a **public name** used by other packages and a **modules** field (or default module list). Executables **depend** on libraries by name. The **filesystem layout** usually mirrors module names: `lib/foo.ml` for module `Foo`, or `lib/foo/` with multiple `*.ml` files.

Splitting code into **libraries** matters for:

- **Testability** (link tests against the same libs as production).
- **Reuse** across multiple binaries in one repo.
- **Clearer** dependency graphs for **supply-chain** review.

---

## 7. `include`, module aliases, and sharing constraints

**`include`** copies the contents of a module or signature into the current one—useful for extending APIs without duplicating every declaration. Overuse can bloat interfaces and make “where did this value come from?” harder during review; prefer explicit re-exports when clarity matters.

**Module aliases** (`module M = N`) keep a single implementation but allow multiple names for clarity or layering. **Sharing constraints** (in advanced signatures) force two abstract types to be the same—needed when functor outputs must agree on a shared key type for maps and sets.

When two compilation units must expose the **same** abstract `t`, the neutral “types-only” or **handshake** module pattern avoids cycles: define `Types` with the abstract type, have `A` and `B` depend on `Types`, not on each other.

---

## 8. Functor example: `Map.Make` and `Set.Make`

The standard library functors `Map.Make` and `Set.Make` take a module describing **ordered keys** (`type t` and `compare`). The output module has **abstract** map/set types and operations that are **correct by construction** with respect to that order. **Wrong** compare functions (e.g. inconsistent with `=`) break internal invariants—treat `compare` as part of your **security** and **correctness** contract, especially for keys derived from user input.

Choosing **string** vs **bytes** vs structured keys affects allocation and comparison cost; for large keys, ensure hashing/equality match your threat model (see chapter 11 on hashtables and timing).

---

## Advanced use cases and implementation

**Compiler-style projects** split lexing, parsing, typing, and codegen into modules with explicit dependencies. **Dependency cycles** between modules are errors; fixing them often means introducing a **smaller** shared signature or moving types to a neutral module.

**Testing functors** instantiates them with **fake** modules that satisfy the input signature—**mocks** checked by the type checker, not stringly dynamic dispatch.

**CI** builds every library and executable in the workspace; a missing `libraries` declaration in `dune` shows up as an **unbound module** error, not at runtime.

---

## References

### Primary — module system

- [Modules](https://ocaml.org/docs/modules)
- [Functors](https://ocaml.org/docs/functors)
- [First-Class Modules](https://ocaml.org/docs/first-class-modules)
- [Libraries With Dune](https://ocaml.org/docs/libraries-dune)

### Primary — manual

- [Module system](https://ocaml.org/manual/moduleexamples.html)
