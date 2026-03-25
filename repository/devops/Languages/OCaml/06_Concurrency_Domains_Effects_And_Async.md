# Concurrency: domains, effects, and async libraries

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml runs **parallel** CPU work with **domains** (OCaml 5+), what **effect handlers** add for advanced control flow, and how **cooperative** I/O libraries (**Lwt**, **Async**) structure network and disk code. You need to know which model a project uses: they compose differently, show up differently in stack traces, and interact differently with FFI and the GC.

---

## 1. Domains (shared-memory parallelism)

Domains are OS threads that execute OCaml code on multiple CPU cores in parallel. Any **shared mutable state** must use explicit synchronization: mutexes, atomics, or message passing—the same rules as other multithreaded native languages.

Much older OCaml code assumed only one thread ran OCaml at a time. Parallel domains can expose **data races** that were previously latent. Before scaling CPU-bound work, audit global mutable caches, singletons, and long-lived refs.

**Synchronization toolkit:** `Mutex` and `Condition` protect **mutable** structures shared across domains; **atomics** (`Atomic`) suit simple counters and flags when contention is understood. **`Domain.DLS`** (domain-local storage) holds **per-domain** bindings without locking when each domain keeps its own **cell**—useful for **request** context or **RNG** state. Prefer **message passing** when ownership boundaries are clearer than shared memory.

**Domain-local** state reduces cross-domain contention; **global** refs shared across domains need explicit locks or immutable persistent updates.

---

## 2. Effect handlers (overview)

Effect handlers add structured, user-defined control effects (e.g. suspending computations, custom async). They change how **stacking** and **debugging** behave compared to plain functions. Library support and best practices vary by compiler version; treat effect-heavy code as **advanced** and pin toolchains until your team agrees on patterns.

---

## 3. Cooperative I/O: Lwt and Async

**Lwt** and **Jane Street Async** model non-blocking I/O with deferred computations. Blocking system calls must **not** run on the cooperative scheduler thread without wrapping them in a thread pool or using non-blocking APIs—otherwise the whole service stalls.

Composition is typically **monadic**: you chain steps with `bind`-style operators. Errors are often carried inside the deferred type or combined with `result`.

**Lwt**-style code often uses **yield points** implicitly; **Async** has its own scheduling and **throttle**/**defer** idioms. In both, **blocking** a worker thread starves unrelated work—wrap CPU-heavy or blocking C calls in **thread pools** or **offload** processes.

**Timeouts**, **cancellation**, and **backpressure** are not automatic: explicit **timeouts** on I/O and bounded **queues** prevent unbounded deferred chains under attack or slow clients.

Pick **one** ecosystem per service. Mixing Lwt and Async without a bridge creates two event loops and hard-to-debug failures.

---

## 4. FFI and threads

C libraries may spawn threads or take internal locks. You must know whether callbacks **into** OCaml are allowed from those threads and whether the OCaml runtime lock rules are satisfied. Violations produce deadlocks or heap corruption—document the contract next to the binding.

---

## Advanced use cases and implementation

**Observability:** Carry correlation IDs through async chains so logs match upstream requests or job IDs.

**Load testing:** Cooperative schedulers behave differently under overload than thread pools—measure tail latency and queue depth, not only average throughput.

---

## References

### Primary

- [Parallelism](https://ocaml.org/docs/parallelism)

### Community

- [Lwt](https://ocsigen.org/lwt/)
- [Async](https://opensource.janestreet.com/async/)
