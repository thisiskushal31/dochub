# Concurrency: domains, effects, and async libraries

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml runs **parallel** CPU work with **domains** (OCaml 5+), what **effect handlers** add for advanced control flow, and how **cooperative** I/O libraries (**Lwt**, **Async**) structure network and disk code. This aligns with the **manual’s “Parallel programming”** part: shared-memory speedups, synchronization, and interaction with the **memory model**. You need to know which model a project uses: they compose differently, show up differently in stack traces, and interact differently with FFI and the GC.

```ocaml
(* OCaml 5+: domains are explicit; shared mutable state needs sync primitives. *)
let d = Domain.spawn (fun () -> 1 + 1) in
Domain.join d
```

---

## 1. Domains (shared-memory parallelism)

Domains are OS threads that execute OCaml code on multiple CPU cores in parallel. Any **shared mutable state** must use explicit synchronization: mutexes, atomics, or message passing—the same rules as other multithreaded native languages.

Much older OCaml code assumed only one thread ran OCaml at a time. Parallel domains can expose **data races** that were previously latent. Before scaling CPU-bound work, audit global mutable caches, singletons, and long-lived refs.

**Synchronization toolkit:** `Mutex` and `Condition` protect **mutable** structures shared across domains; **atomics** (`Atomic`) suit simple counters and flags when contention is understood. **`Domain.DLS`** (domain-local storage) holds **per-domain** bindings without locking when each domain keeps its own **cell**—useful for **request** context or **RNG** state. Prefer **message passing** when ownership boundaries are clearer than shared memory.

**Domain-local** state reduces cross-domain contention; **global** refs shared across domains need explicit locks or immutable persistent updates.

```ocaml
let m = Mutex.create ()
let shared = ref 0

let () =
  let d =
    Domain.spawn (fun () ->
        Mutex.lock m;
        shared := !shared + 1;
        Mutex.unlock m)
  in
  Domain.join d
```

---

## 2. Effect handlers (overview)

Effect handlers add structured, user-defined control effects (e.g. suspending computations, custom async). They change how **stacking** and **debugging** behave compared to plain functions. Library support and best practices vary by compiler version; treat effect-heavy code as **advanced** and pin toolchains until your team agrees on patterns.

```ocaml
(* Effect handlers: install with [match … with effect …] and resume continuations.
   Names and modules differ by OCaml version — follow the manual for your compiler pin. *)
```

---

## 3. Cooperative I/O: Lwt and Async

**Lwt** and **Jane Street Async** model non-blocking I/O with deferred computations. Blocking system calls must **not** run on the cooperative scheduler thread without wrapping them in a thread pool or using non-blocking APIs—otherwise the whole service stalls.

Composition is typically **monadic**: you chain steps with `bind`-style operators. Errors are often carried inside the deferred type or combined with `result`.

**Lwt**-style code often uses **yield points** implicitly; **Async** has its own scheduling and **throttle**/**defer** idioms. In both, **blocking** a worker thread starves unrelated work—wrap CPU-heavy or blocking C calls in **thread pools** or **offload** processes.

**Timeouts**, **cancellation**, and **backpressure** are not automatic: explicit **timeouts** on I/O and bounded **queues** prevent unbounded deferred chains under attack or slow clients.

Pick **one** ecosystem per service. Mixing Lwt and Async without a bridge creates two event loops and hard-to-debug failures.

```ocaml
(* Cooperative I/O stacks are library-specific: monadic [bind] / [let*], never block
   the scheduler thread on synchronous OS calls without a thread pool. *)
```

---

## 4. FFI and threads

C libraries may spawn threads or take internal locks. You must know whether callbacks **into** OCaml are allowed from those threads and whether the OCaml runtime lock rules are satisfied. Violations produce deadlocks or heap corruption—document the contract next to the binding.

```c
/* Pseudocode: C must not call into OCaml without the runtime lock unless your
   binding explicitly allows it — see the FFI chapter. */
void worker(void (*cb)(void)) { /* ... */ }
```

---

## 5. Concurrency architecture patterns

Reliable services usually standardize on one of these shapes:

- **Domain pool + immutable work items** for CPU-heavy tasks.
- **Single event loop + bounded queues** for I/O-heavy workloads.
- **Hybrid** with explicit handoff points between CPU and I/O stages.

Whichever model you choose, enforce bounded queues and explicit cancellation semantics. Most outages come from unbounded backlog growth and cancellation leaks, not from raw CPU saturation.

```ocaml
(* Fork-join sketch: split work, spawn, join *)
let sum_pair (a, b) =
  let da = Domain.spawn (fun () -> List.fold_left ( + ) 0 a) in
  let rb = List.fold_left ( + ) 0 b in
  Domain.join da + rb
```

---

## 6. Detecting data races (Thread Sanitizer and discipline)

Parallel **domains** can introduce **data races** on shared **mutable** fields that looked “fine” on a single core. A dedicated **compiler switch** with **Thread Sanitizer** enabled can flag unsynchronized reads and writes with **stack traces** for both threads—useful in CI for regression tests of parallel code.

**Operational note:** TSan builds are a **different** toolchain variant; keep them on a **separate** opam switch and run them where policy allows sanitizer overhead. Fixing races usually means **`Mutex`**, **`Atomic`**, **message passing**, or **immutable** structures—not “try again until the crash disappears.”

The **manual** parallel programming chapter matches the compiler version you pin; pair it with release notes when upgrading **domains** or the runtime.

```bash
# Example: TSan / sanitizer builds are a separate compiler configuration — not drop-in.
# opam switch create . --packages=ocaml-variants.5.x.0+options,...
```

---

## 7. Parallel programming patterns (fork-join and pools)

**Fork-join:** split immutable work into chunks, **`Domain.spawn`** workers, **`Domain.join`** to merge results—good for **CPU-bound** maps/reductions over large arrays or trees when **allocation** and **contention** stay under control.

**Pools:** fixed **worker** domains reading from a **bounded** queue of jobs avoid unbounded **parallelism** and protect the **GC** from pathological allocation spikes.

**Atomics vs locks:** **`Atomic.t`** for simple counters and flags; **`Mutex`** for invariants spanning multiple fields. Never “optimise” races away without measurement—use **TSan** builds where policy allows (see prior section).

**Interaction with chapter 5:** parallel **reads** of **immutable** data are free; parallel **writes** to the **same** mutable location without coordination are **undefined** behaviour at the language level—treat like C.

```ocaml
let counter = Atomic.make 0

let () =
  let d =
    Domain.spawn (fun () ->
        for _ = 1 to 1000 do
          ignore (Atomic.fetch_and_add counter 1)
        done)
  in
  for _ = 1 to 1000 do
    ignore (Atomic.fetch_and_add counter 1)
  done;
  Domain.join d
```

---

## Advanced use cases and implementation

**Observability:** Carry correlation IDs through async chains so logs match upstream requests or job IDs.

**Load testing:** Cooperative schedulers behave differently under overload than thread pools—measure tail latency and queue depth, not only average throughput.

```ocaml
(* Correlate logs: pass request id through async / domain boundaries *)
let log_ctx req_id msg =
  Printf.printf "[%s] %s\n%!" req_id msg
```

---

## References

### Primary — manual

- [Parallel programming](https://ocaml.org/manual/5.4/parallelism.html)
- [Memory model: The hard bits](https://ocaml.org/manual/5.4/memorymodel.html)

### Community

- [Lwt](https://ocsigen.org/lwt/)
- [Async](https://opensource.janestreet.com/async/)
