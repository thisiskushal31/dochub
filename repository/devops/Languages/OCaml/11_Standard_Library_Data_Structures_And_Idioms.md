# Standard library data structures and idioms

[← Back to OCaml](./README.md)

## What this chapter covers

Practical use of standard-library containers: when to pick `option`, arrays, functor-based maps and sets, hash tables, queues and stacks, lazy sequences, Bigarray-backed buffers, weak and ephemeron-based caches; how memoization trades memory for time; and how monadic and applicative composition appears in async code and error handling. The goal is to match structure choice to algorithm, concurrency, and security constraints.

---

## 1. Options

`option` represents a value that may be missing (`None`) or present (`Some x`). It avoids sentinel values like `-1` or empty strings that hide errors.

Compose with pattern matching or `Option.bind` / `let*` (when opened) to avoid deeply nested conditionals:

```ocaml
let ( let* ) = Option.bind

let parse_int s =
  try Some (int_of_string s) with Failure _ -> None

let doubled s =
  let* n = parse_int s in
  Some (n * 2)
```

---

## 2. Arrays

Arrays are mutable, fixed-length, and offer constant-time indexing. Use them for random access or dense buffers (parsing into slots, image rows). Validate indices on untrusted input—out-of-range access raises an exception.

**Float arrays** (`float array` / `Array.Float`) use a compact representation; mixing **flat** float work with **ordinary** arrays avoids accidental boxing in numeric hot paths.

---

## 3. Bigarray (buffers and FFI)

**Bigarray** provides multi-dimensional arrays and **views** over **memory** with **kind** and **layout** control (`float32`, `int8`, etc.). They are the standard way to hold **binary** payloads that **cross** the C boundary or map **mmap**’d files. Lifetime rules follow **chapter 5**: if C **frees** memory, OCaml must not keep a Bigarray view pointing at it.

---

## 4. Maps and sets

`Map.Make` and `Set.Make` are functors: you provide a key module with comparison. Maps give ordered iteration and logarithmic lookup for totally ordered keys. Sets store unique elements with the same complexity profile.

If you change comparison semantics after inserting values, you break internal invariants—treat the ordering module as fixed for the lifetime of the structure.

---

## 5. Hash tables

`Hashtbl` provides amortized constant-time lookup with a user-supplied hash and equality. The table resizes as it grows.

Sharing one hashtable across parallel domains or OS threads without synchronization is unsafe. Use a lock, partition data per thread, or pick immutable structures.

**Hashtbl** is not a **drop-in** for **cryptographic** deduplication of attacker-controlled keys under timing attacks—pair with a threat model; for **password** or **token** comparison use **constant-time** primitives from **vetted** crypto libraries, not generic container lookups.

---

## 6. Queues, stacks, and worklists

**Queue** and **Stack** modules provide **mutable** amortized structures for **FIFO** and **LIFO** worklists. They are ideal for **BFS**, **scheduler** queues, and **parser** stacks when you need **O(1)** push/pop at known ends. For **parallel** access, wrap in a **mutex** or use **domain-local** instances; do not share a bare `Queue.t` across domains.

---

## 7. Sequences

`Seq` represents lazy streams: elements compute on demand. Useful for large inputs where building a full list would spike memory.

---

## 8. Memoization

Memoization caches pure function results keyed by arguments. It trades memory for time. Unbounded caches keyed by external strings or large values can grow the heap without limit—use caps, eviction, or explicit cache sizes in long-running services.

---

## 9. Monads in practice

Types with `return` and `bind` sequence computations that carry extra context: errors (`result`, `Option`), or deferred I/O (Lwt, Async). Recognizing the pattern simplifies reading service code built from chained binds rather than nested callbacks.

**Applicative** style (`let+` / `and+` where available, or `map` + `product` combinators) helps when steps are **independent** and you want to avoid unnecessary sequential **bind**—fewer artificial data dependencies, clearer parallel structure in some libraries.

---

## 10. Weak, ephemerons, and GC-aware caches

**Weak** pointers do not keep values alive; **ephemeron** tables pair keys and values with **GC**-aware semantics so **values** can be collected when keys disappear—useful for **memoization** that must not retain **unbounded** memory. Still cap **size** for **DoS** resistance: an attacker can force distinct keys and exhaust memory if the cache grows without **eviction**.

---

## Advanced use cases and implementation

Do not build cryptographic protocols on top of generic maps or hashtables without constant-time discipline where the threat model requires it—use vetted crypto libraries.

Profile before replacing lists with arrays everywhere; allocation patterns and GC interact with container choice.

---

## References

### Primary — data structures

- [Options](https://ocaml.org/docs/options)
- [Arrays](https://ocaml.org/docs/arrays)
- [Maps](https://ocaml.org/docs/maps)
- [Sets](https://ocaml.org/docs/sets)
- [Hash Tables](https://ocaml.org/docs/hash-tables)
- [Sequences](https://ocaml.org/docs/sequences)
- [Memoization](https://ocaml.org/docs/memoization)
- [Monads](https://ocaml.org/docs/monads)

### Primary — API

- [OCaml standard library API](https://ocaml.org/api/)
