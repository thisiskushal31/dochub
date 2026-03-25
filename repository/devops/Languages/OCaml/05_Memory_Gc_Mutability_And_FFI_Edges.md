# Memory: GC, representation, mutability, FFI edges

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml manages heap memory with a **garbage collector**, where **mutation** fits in a mostly functional style, how **Bigarray** relates to C buffers, and why **FFI** erases memory-safety guarantees for the code that crosses the boundary. This chapter connects language behavior to **performance** tuning and **security** review of native code.

---

## 1. Garbage collection and allocation

OCaml allocates **heap** objects for most structured values. **Short-lived** allocations are cheap in typical functional style: many small objects die young and are reclaimed quickly. **Long-lived** graphs (caches, large ASTs) increase GC work and **pause** times.

For **services** with latency SLOs, profile before optimizing: hot loops that allocate per iteration can dominate. Mitigations include **reusing** buffers, **reducing** closure allocation, or moving hot numeric work into **Bigarray** or C where appropriate.

**Multicore** OCaml changes GC **architecture** compared to single-threaded runtimes; behavior under **parallel** **domains** is a moving target worth checking against your **compiler** version.

**Generational** intuition: most allocations die young; the GC **promotes** survivors to older generations. Long-lived caches shift the **age** profile of the heap and can increase **major** collection work. **Incremental** / **concurrent** aspects of the runtime reduce pause times compared to naive stop-the-world collectors but do not remove the need to profile **allocation rate** and **live** set size.

**Weak pointers** and **ephemerons** (library support) model **cache-like** associations without keeping keys alive forever—important when wrapping **foreign** objects or building **memo** tables that must not leak memory.

---

## 2. Mutability: refs, records, arrays

Immutability is the default: `let` binds a name to a value; **rebinding** with another `let` **shadows** the name in inner scopes only.

**Refs** are explicit mutable cells—use them when a single piece of state must change over time:

```ocaml
let counter = ref 0 in
counter := !counter + 1;
!counter
```

**Mutable record fields** and **arrays** support algorithms that need in-place update. **Arrays** are fixed-length and zero-indexed; **bounds errors** raise exceptions unless you guard indices—important when handling **untrusted** input.

---

## 3. Bigarray and C memory

**Bigarray** exposes **flat** memory with **layouts** compatible with **numeric** C APIs and **binary** protocols. Unlike ordinary OCaml arrays, Bigarrays are the usual bridge for **bulk** data to **FFI**. Wrong **length** or **lifetime** assumptions at the boundary are **use-after-free** or **overflow** bugs—**treat** FFI like C.

---

## 4. FFI and memory safety

Inside OCaml, the type checker and GC cooperate. At the **FFI** boundary you **marshal** values to C representations:

- **Wrong** **types** or **sizes** → **corruption** or **crash**.
- **Double** **free** or **use-after-free** if ownership rules differ across the boundary.
- **Threads** in C libraries interacting badly with the OCaml **runtime** → **deadlocks** or **heap** **corruption**.

**Security** review of an OCaml service must include **C** **stubs** and **linked** **native** **libraries** (OpenSSL, SQLite, image codecs), not only `.ml` files.

---

## Advanced use cases and implementation

**Profiling:** Use allocation and time profilers when optimizing; GC noise can dominate microbenchmarks—run longer scenarios or production-like inputs.

**Supply chain:** **Vendored** C inherits **CVEs** from that ecosystem—track versions like any other native dependency.

---

## References

### Primary — runtime (tutorials)

- [Memory Representation of Values](https://ocaml.org/docs/memory-representation)
- [Understanding the Garbage Collector](https://ocaml.org/docs/garbage-collector)
- [Mutability and Imperative Control Flow](https://ocaml.org/docs/mutability-imperative-control-flow)

### Primary — manual and API

- [Runtime](https://ocaml.org/manual/runtime.html)
- [Bigarray](https://ocaml.org/api/Bigarray.html)
