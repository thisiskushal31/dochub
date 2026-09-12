# Standard library data structures and idioms

[← Back to OCaml](./README.md)

## What this chapter covers

Practical use of standard-library containers: when to pick `option`, arrays, functor-based maps and sets, hash tables, queues and stacks, lazy sequences, Bigarray-backed buffers, weak and ephemeron-based caches; how memoization trades memory for time; and how monadic and applicative composition appears in async code and error handling. The goal is to match structure choice to algorithm, concurrency, and security constraints.

```ocaml
open Option

let doubled o = bind o (fun n -> Some (n * 2))
```

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

```ocaml
let a = [| 1; 2; 3 |] in
a.(1) <- 99
```

---

## 3. Bigarray (buffers and FFI)

**Bigarray** provides multi-dimensional arrays and **views** over **memory** with **kind** and **layout** control (`float32`, `int8`, etc.). They are the standard way to hold **binary** payloads that **cross** the C boundary or map **mmap**’d files. Lifetime rules follow **chapter 5**: if C **frees** memory, OCaml must not keep a Bigarray view pointing at it.

```ocaml
open Bigarray

let m = Array2.create float32 c_layout 10 10
```

---

## 4. Maps and sets

`Map.Make` and `Set.Make` are functors: you provide a key module with comparison. Maps give ordered iteration and logarithmic lookup for totally ordered keys. Sets store unique elements with the same complexity profile.

If you change comparison semantics after inserting values, you break internal invariants—treat the ordering module as fixed for the lifetime of the structure.

```ocaml
module M = Map.Make (String)

let m = M.singleton "k" 1 |> M.add "j" 2
```

---

## 5. Hash tables

`Hashtbl` provides amortized constant-time lookup with a user-supplied hash and equality. The table resizes as it grows.

Sharing one hashtable across parallel domains or OS threads without synchronization is unsafe. Use a lock, partition data per thread, or pick immutable structures.

**Hashtbl** is not a **drop-in** for **cryptographic** deduplication of attacker-controlled keys under timing attacks—pair with a threat model; for **password** or **token** comparison use **constant-time** primitives from **vetted** crypto libraries, not generic container lookups.

```ocaml
let h = Hashtbl.create 16 in
Hashtbl.add h "a" 1;
Hashtbl.find_opt h "a"
```

---

## 6. Queues, stacks, and worklists

**Queue** and **Stack** modules provide **mutable** amortized structures for **FIFO** and **LIFO** worklists. They are ideal for **BFS**, **scheduler** queues, and **parser** stacks when you need **O(1)** push/pop at known ends. For **parallel** access, wrap in a **mutex** or use **domain-local** instances; do not share a bare `Queue.t` across domains.

```ocaml
let q = Queue.create () in
Queue.push 1 q;
Queue.pop q
```

---

## 7. Sequences

`Seq` represents lazy streams: elements compute on demand. Useful for large inputs where building a full list would spike memory.

```ocaml
let naturals = Seq.unfold (fun n -> Some (n, n + 1)) 0
let first10 = naturals |> Seq.take 10 |> List.of_seq
```

---

## 8. Memoization

Memoization caches pure function results keyed by arguments. It trades memory for time. Unbounded caches keyed by external strings or large values can grow the heap without limit—use caps, eviction, or explicit cache sizes in long-running services.

**Idiomatic pattern:** a fixed **hashtable** or **map** at module scope, guarded by a **`Mutex`** if domains can call the memoised function in parallel. For **keys** that should not pin memory forever (e.g. large user inputs), pair caches with **maximum size** or **weak**/**ephemeron** tables as in section 10.

```ocaml
let memo =
  let cache = Hashtbl.create 32 in
  fun k ->
    match Hashtbl.find_opt cache k with
    | Some v -> v
    | None ->
        let v = String.length k in
        Hashtbl.replace cache k v;
        v
```

---

## 9. Monads in practice

Types with `return` and `bind` sequence computations that carry extra context: errors (`result`, `Option`), or deferred I/O (Lwt, Async). Recognizing the pattern simplifies reading service code built from chained binds rather than nested callbacks.

**Applicative** style (`let+` / `and+` where available, or `map` + `product` combinators) helps when steps are **independent** and you want to avoid unnecessary sequential **bind**—fewer artificial data dependencies, clearer parallel structure in some libraries.

```ocaml
let ( let* ) = Result.bind

let pipeline x =
  let* a = Ok (x + 1) in
  let* b = Ok (a * 2) in
  Ok b
```

---

## 10. Weak, ephemerons, and GC-aware caches

**Weak** pointers do not keep values alive; **ephemeron** tables pair keys and values with **GC**-aware semantics so **values** can be collected when keys disappear—useful for **memoization** that must not retain **unbounded** memory. Still cap **size** for **DoS** resistance: an attacker can force distinct keys and exhaust memory if the cache grows without **eviction**.

```ocaml
(* Weak arrays: slots do not keep values alive unless set elsewhere *)
let w = Weak.create 1 in
Weak.set w 0 (Some (ref 42))
```

---

## 11. Container choice by workload shape

Choose structures from access patterns and failure modes, not habit:

- **Read-mostly + ordered traversal**: `Map`/`Set`.
- **Hot random access**: arrays or Bigarray-backed buffers.
- **High-churn key/value cache**: `Hashtbl` plus explicit bounds and eviction.
- **Streaming transforms**: `Seq` or iterator pipelines with bounded buffering.

For services under adversarial input, include worst-case behavior in the choice: memory growth caps, hash-collision risk, and contention under parallel access matter as much as average complexity.

```ocaml
(* Ordered map + bounded hashtable + Seq pipeline — pick by access pattern *)
let sum_seq xs = Seq.fold_left ( + ) 0 xs
```

---

## 12. Monad pattern: signature, laws, and concrete schedulers

A **monad** in code (as used on tutorials for OCaml) is usually a type constructor **`'a t`** with **`return : 'a -> 'a t`** and **`bind : 'a t -> ('a -> 'b t) -> 'b t`** (often written **`>>=`**). **`return`** lifts a pure value into the effectful world; **`bind`** runs a second computation **after** the first, threading the **effect** (failure, deferred I/O, logging) through.

Concrete instances you already use:

- **`Option`** / **`Result`**: **bind** short-circuits on **`None`** / **`Error`**; this replaces deep nesting of pattern matches.
- **Promise-like** libraries (**Lwt**, **Async**): **bind** sequences asynchronous steps; mixing them in one program usually requires explicit **bridges**.

**Laws** (identity and associativity of `bind` relative to `return`) are what let you refactor monadic code without changing observable order of effects—libraries that violate them are buggy, not merely “creative.”

```ocaml
module type Monad = sig
  type 'a t
  val return : 'a -> 'a t
  val bind : 'a t -> ('a -> 'b t) -> 'b t
end
```

---

## Advanced use cases and implementation

Do not build cryptographic protocols on top of generic maps or hashtables without constant-time discipline where the threat model requires it—use vetted crypto libraries.

Profile before replacing lists with arrays everywhere; allocation patterns and GC interact with container choice.

```ocaml
(* Security-sensitive compare: use crypto libs, not Hashtbl for secrets *)
let ok a b = if String.equal a b then Ok () else Error `mismatch
```

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
