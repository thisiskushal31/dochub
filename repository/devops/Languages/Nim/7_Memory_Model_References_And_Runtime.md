# Memory model, references, and runtime behavior

[← Back to Nim](./README.md)

## What this topic covers

This chapter explains **values vs references**, how **`--mm`** (memory management mode) changes **lifetimes and leaks**, and why **FFI** and **async** interact with **cycles** and **ORC/ARC** choices. It is **not** a full runtime specification: exact **hook** semantics and ** destructor** rules live in the dedicated guides linked at the end.

## Why memory model literacy matters

Nim combines **value** and **reference** semantics, **deterministic teardown** in common configurations, and **optional strategies** for legacy or specialized runtimes. Misunderstanding **who owns** an object, when **cycles** form, or which **`--mm`** mode CI uses leads to **leaks**, **use-after-free risk at FFI**, and **non-reproducible** performance.

## References, objects, and lifetimes

**`ref`** types behave like traced references: allocation and reclamation depend on the active **memory management** mode. **`object`** values without **`ref`** follow scope and move rules closer to stack/value reasoning, though they may still contain **pointers** or **refs** that participate in sharing.

Text first:

```nim
type Node = ref object
  value: int

var n = Node(value: 42)
echo n.value
```

APIs should make **mutation** and **sharing** obvious at boundaries—especially when C code holds a pointer into Nim data.

## Memory management modes (`--mm`)

Nim selects strategy with **`--mm:`**. Current guidance for **new code** favors **`orc`** (the **default** in recent lines): **reference counting** plus a **cycle collector** based on trial deletion, without whole-heap tracing that depends on stack/heap sizes in the same way as classic stop-the-world collectors.

**`arc`** uses the same RC core but **omits** the cycle collector—simpler reasoning when the graph is **acyclic**, but **reference cycles leak**. The **async** story is illustrative: common async patterns may **cycle**; teams often need **`orc`** there even if **`arc`** seemed attractive for code size.

**`atomicArc`** variants exist when **atomic** RC operations are required across threads (trade-offs differ from plain **`arc`/`orc`**).

**Older or specialized modes** include **`refc`** (deferred RC + mark/sweep backup, **thread-local** heaps), **markAndSweep**, **boehm**, **go** (for Go interop), and **`none`** (effectively no automatic free—prefer **`arc`** over **`none`** for almost all applications). **JavaScript** targets use the **host** garbage collector; **NimScript** uses the compiler VM’s strategy.

## Inspection and optimization hooks

For hard **latency** work, Nim can **eliminate** redundant RC operations and exploit **move semantics** and **destructors**. Developers can inspect ARC expansion for hot symbols or whole modules with **`--expandArc:`** flags described in the memory-management documentation—useful when profiling shows unexpected retain traffic.

## Engineering perspective

- Declare **`--mm`** explicitly in **build scripts** and **CI** so local machines and servers match.
- If you choose **`arc`**, **audit** for **cycles** (graphs, closures, async) before production.
- At **FFI**, assume **C** does not participate in Nim’s RC—use documented **pinning**, **copies**, or **owned** contracts.
- **Benchmark** allocation-heavy paths under the **same** mode you ship; **`refc`** vs **`orc`** can change tail latency profiles.
- **Profile** realistic workloads, not only microbenchmarks.

---

## Further reading

- [Nim memory management](https://nim-lang.org/docs/mm.html)
- [Destructors and move semantics](https://nim-lang.org/docs/destructors.html)
- [refc GC details](https://nim-lang.org/docs/refc.html)
- [Language manual](https://nim-lang.org/docs/manual.html)
- [Backend integration](https://nim-lang.org/docs/backends.html)
