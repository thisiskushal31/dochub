# Memory: GC, representation, mutability, FFI edges

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml manages heap memory with a **garbage collector**, how **values** and **blocks** look at runtime (tagged immediates vs heap pointers), where **mutation** fits in a mostly functional style, how **Bigarray** relates to C buffers, and why **FFI** erases memory-safety guarantees for the code that crosses the boundary. This chapter connects language behavior to **performance** tuning and **security** review of native code.

```ocaml
let _ = Gc.minor ()
(* Force a minor collection — use profiling, not production control flow *)
```

---

## 1. Garbage collection and allocation

OCaml allocates **heap** objects for most structured values. **Short-lived** allocations are cheap in typical functional style: many small objects die young and are reclaimed quickly. **Long-lived** graphs (caches, large ASTs) increase GC work and **pause** times.

For **services** with latency SLOs, profile before optimizing: hot loops that allocate per iteration can dominate. Mitigations include **reusing** buffers, **reducing** closure allocation, or moving hot numeric work into **Bigarray** or C where appropriate.

**Multicore** OCaml changes GC **architecture** compared to single-threaded runtimes; behavior under **parallel** **domains** is a moving target worth checking against your **compiler** version.

**Generational** intuition: most allocations die young; the GC **promotes** survivors to older generations. Long-lived caches shift the **age** profile of the heap and can increase **major** collection work. **Incremental** / **concurrent** aspects of the runtime reduce pause times compared to naive stop-the-world collectors but do not remove the need to profile **allocation rate** and **live** set size.

**Weak pointers** and **ephemerons** (library support) model **cache-like** associations without keeping keys alive forever—important when wrapping **foreign** objects or building **memo** tables that must not leak memory.

```ocaml
(* Hot loop: avoid fresh closures per iteration when profiling says so *)
let rec sum acc = function [] -> acc | x :: xs -> sum (acc + x) xs
```

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

```ocaml
open Bigarray

let buf = Array1.create char c_layout 4096
```

---

## 4. FFI and memory safety

Inside OCaml, the type checker and GC cooperate. At the **FFI** boundary you **marshal** values to C representations:

- **Wrong** **types** or **sizes** → **corruption** or **crash**.
- **Double** **free** or **use-after-free** if ownership rules differ across the boundary.
- **Threads** in C libraries interacting badly with the OCaml **runtime** → **deadlocks** or **heap** **corruption**.

**Security** review of an OCaml service must include **C** **stubs** and **linked** **native** **libraries** (OpenSSL, SQLite, image codecs), not only `.ml` files.

```c
/* Stub side: wrong [value] layout → heap corruption */
value stub_example(value v);
```

---

## 5. Finalizers, resource ownership, and leaks

GC frees OCaml heap objects, but it does not automatically close every external resource at the right time. File descriptors, sockets, and foreign handles still need explicit ownership rules:

- Prefer explicit `close`/`dispose` APIs for deterministic release.
- Treat finalizers as a safety net, not primary control flow.
- Document whether ownership is transferred or borrowed at each function boundary.

Most production leaks in mixed OCaml/C systems come from ambiguous ownership, not from GC itself.

```ocaml
let with_in path f =
  let ic = open_in path in
  Fun.protect ~finally:(fun () -> close_in ic) ~f:(fun () -> f ic)
```

---

## 6. How values look at runtime (and why it matters for FFI and tooling)

After **type checking**, most **type information is dropped**: the running program works with a small runtime model of **values**. A **value** is either:

- an **immediate** (a tagged integer in one machine word): used for **`int`**, **`char`**, **`bool`**, **`unit`**, many **constant** variant constructors without payloads, the **empty list**, and similar **unboxed** cases; or
- a **pointer** to a **block** on the **OCaml-managed heap**: tuples, records, strings, ordinary arrays, lists, closures, many variants with payloads, and so on.

The low bit of a word distinguishes **immediate** from **pointer**; valid heap pointers are **word-aligned**, so that tagging scheme stays sound.

A **block** has a **header** word (tag, size, and fields used by the **GC**) and a payload. Tags mark whether payload **fields** are more **values** the GC must follow, or **opaque bytes** (e.g. **`string`** bodies) that are **not** scanned as pointers. **`Bigarray`** and **custom** blocks participate in their own lifetimes—exactly where FFI mistakes become **use-after-free** or **buffer** errors.

The runtime treats pointers **inside** the OCaml heap as **followable**; pointers **outside** that region are treated as **opaque** (e.g. raw **C** handles). That boundary is what makes **stub** code security-sensitive: a forged pointer or wrong layout breaks the GC’s graph.

### Generational collection (minor vs major)

The **minor heap** is a small **nursery**: most allocations land there with very cheap bump-pointer cost. When it fills, a **minor collection** typically **copies** surviving young objects into the **major heap**—work scales with **live** nursery data, not total memory.

The **major heap** holds older and larger data; it is collected with **mark**–**sweep** (and occasionally **compact**) strategies that scan or reorder blocks. **Major** work can pause the mutator longer than **minor** work; long-lived caches and huge graphs shift tuning pressure here.

### Tuning and signals

The **`Gc`** module and **`OCAMLRUNPARAM`** expose heap sizes, verbosity, and related **runtime** knobs—useful for benchmarking and capacity planning without recompiling. The native compiler emits **poll points** so **signals** and **collections** can preempt very tight loops that rarely allocate; ultra-hot loops should still be profiled in realistic workloads.

```ocaml
Gc.set { (Gc.get ()) with minor_heap_size = 256 * 1024 }
```

---

## 7. Memory model and domains (the “hard bits”, operationally)

With **multiple** **domains**, the intuitive **sequential** story for **refs**, **mutable fields**, and **arrays** breaks unless you add **synchronization**. Informally:

- **Unsynchronized** concurrent **writes** (or **read/write** races) on the **same** mutable location are **forbidden**—the program has a **data race**, and behaviour is not the sequential interleaving you might imagine.
- **`Atomic`** operations give **well-defined** atomic read/update on supported widths; **`Mutex`**/**`Condition`** establish **happens-before** edges for larger invariants.
- **Immutable** values are **safe** to share by **reference** across domains because no writer exists.

**FFI:** if C code mutates memory **visible** to OCaml without **locking** or a documented **happens-before** story, you have the same class of bugs as in C—chapter 7.

This is the operational core of the **manual’s “Memory model: The hard bits”** material: reason about **visibility** and **ordering** explicitly when you parallelise.

```ocaml
let x = ref 0

let safe_bump m =
  Mutex.lock m;
  x := !x + 1;
  Mutex.unlock m
```

---

## Advanced use cases and implementation

**Profiling:** Use allocation and time profilers when optimizing; GC noise can dominate microbenchmarks—run longer scenarios or production-like inputs.

**Supply chain:** **Vendored** C inherits **CVEs** from that ecosystem—track versions like any other native dependency.

```ocaml
let s = Gc.quick_stat () in
Printf.printf "minor_collections=%d major_collections=%d\n" s.minor_collections
  s.major_collections
```

---

## References

### Primary — runtime (tutorials)

- [Memory Representation of Values](https://ocaml.org/docs/memory-representation)
- [Understanding the Garbage Collector](https://ocaml.org/docs/garbage-collector)
- [Mutability and Imperative Control Flow](https://ocaml.org/docs/mutability-imperative-control-flow)

### Primary — manual and API

- [Runtime](https://ocaml.org/manual/runtime.html)
- [Bigarray](https://ocaml.org/api/Bigarray.html)
