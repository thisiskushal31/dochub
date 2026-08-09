# Concurrency: threads, sync, `Send` / `Sync`

[← Back to Rust](./README.md)

## What this chapter covers

How **OS threads**, **shared-state synchronization**, and **message passing** work in the standard library; what **`Send`** and **`Sync`** mean; how **interior mutability** (`Cell`, `RefCell`) fits; and why **safe Rust prevents data races** without making deadlocks or logic bugs impossible. After this chapter you should choose between channels and locks deliberately and review concurrent code for ownership across thread boundaries.

---

## 1. Concepts

### 1. Threads are OS threads

**`std::thread::spawn`** starts a new thread running a closure. The handle is **`JoinHandle<T>`**; **`join`** waits for completion and propagates the return value (or a panic payload if the thread panicked).

```rust
use std::thread;

let handle = thread::spawn(|| {
    42
});
let value = handle.join().expect("thread panicked");
```

Closures that capture the environment often need **`move`** so the child owns captured data for its lifetime. Without `move`, the borrow checker rejects captures that might outlive the parent frame.

### 2. Sharing state: why bare `&mut` across threads fails

Rust’s borrowing rules forbid simultaneous mutable aliasing. Two threads cannot each hold `&mut T` to the same value. To share, you typically combine:

- **`Arc<T>`** — atomic reference-counted shared ownership across threads
- A synchronization primitive (**`Mutex`**, **`RwLock`**, channels) so mutation is coordinated

`Arc` alone gives shared **immutable** access. Shared mutation needs interior synchronization.

### 3. `Mutex` and `RwLock`

**`Mutex<T>`** allows one lock holder at a time. **`lock()`** returns a **guard** that dereferences to `T` and unlocks on drop (RAII). Prefer scoped blocks so guards do not live longer than needed.

**`RwLock<T>`** allows many readers or one writer. Readers can starve writers (or the reverse) depending on implementation and load—measure under contention; do not assume “read-heavy” automatically means `RwLock` wins.

Poisoning: if a thread panics while holding a `Mutex`, subsequent `lock()` returns **`PoisonError`**. Recovery policy is spelled out in Advanced concepts below—do not ignore `Err` with a silent `.unwrap()` without a documented stance.

### 4. Message passing: `mpsc`

**`std::sync::mpsc`** provides multi-producer, single-consumer channels: **`channel()`** yields `(Sender, Receiver)`. Clone senders for multiple producers. Sending moves values to the consumer—often clearer than shared mutable state for pipelines and worker pools.

```rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();
thread::spawn(move || {
    tx.send("ping").unwrap();
});
let msg = rx.recv().unwrap();
```

Bounded patterns and backpressure usually need crates or careful design; unbounded channels can grow memory without limit under a slow consumer.

### 5. `Send` and `Sync` (marker traits)

| Trait | Meaning (intuitive) |
|-------|---------------------|
| **`Send`** | Ownership of this type may be transferred to another thread |
| **`Sync`** | Shared references (`&T`) may be used from multiple threads |

Roughly: `T: Sync` if `&T: Send`. Most owned values are `Send` unless they contain thread-local or non-thread-safe handles. **`Rc`** is not `Send`/`Sync`; use **`Arc`** for cross-thread sharing. **`RefCell`** is not `Sync`; **`Mutex`** is. The compiler uses these traits to reject unsafe sharing patterns in safe code.

You rarely implement `Send`/`Sync` manually; they are auto-implemented when fields allow. Incorrect `unsafe impl` is a serious soundness bug.

### 6. Interior mutability: `Cell` / `RefCell` versus `Mutex`

**Interior mutability** lets you mutate through a shared reference when the type enforces rules itself. Choose by **thread model**, not by habit:

| Tool | Threading | Enforcement | Typical use |
|------|-----------|-------------|-------------|
| **`Cell<T>`** | Single-threaded | Compile-time (no borrow flag); get/set/replace | Small `Copy` flags/counters behind `&self` |
| **`RefCell<T>`** | Single-threaded | Runtime borrow flags; panics on conflicting borrows | Graphs, caches, UI-like trees on one thread |
| **`Mutex<T>`** / **`RwLock<T>`** | Multi-threaded | OS/userspace lock; poison on panic-while-locked | Shared state across `spawn` / thread pools |

Decision guide:

- Same thread, need `&self` mutation → `Cell` or `RefCell` (prefer `Cell` when replace/`Copy` suffices).
- Multiple threads share mutable state → `Arc<Mutex<T>>` (or `RwLock` / channels), **not** `RefCell`.
- `RefCell` is **not** `Sync`; putting it in `Arc` without a mutex will not compile—that rejection is the feature.
- Holding a `Mutex` across slow I/O recreates contention; `RefCell` panics are still logic bugs—neither replaces clear ownership.

Cross-thread interior mutability without a full mutex is the domain of **atomics** (simple flags/counters) or channels (move ownership). Ecosystem lock crates exist; this handbook sticks to **`std`** primitives unless a codebase already standardized otherwise (see advanced notes).

### 7. Data race prevention in safe Rust

A **data race** is concurrent conflicting access to memory without synchronization, where at least one access is a write. Safe Rust’s type system is designed so you cannot express data races without `unsafe` (or unsound `unsafe` in a dependency). That is the core of “fearless concurrency.”

Safe Rust does **not** prevent:

- Deadlocks (lock ordering bugs)
- Race conditions on program logic (check-then-act on wrong abstraction)
- Lost updates at the business level
- Starvation, livelock, or priority inversion

### 8. One-time init: `OnceLock` and `LazyLock`

Prefer **`std::sync::OnceLock`** and **`std::sync::LazyLock`** for process-wide one-time initialization instead of **`static mut`** or ad hoc double-checked locking.

- **`OnceLock<T>`** — write once (via `get_or_init` / `set`), then shared immutable access; safe and `Sync` when `T: Send`.
- **`LazyLock<T>`** — lazy static initialized on first use with a closure; good for expensive read-only tables and clients constructed once.

```rust
use std::sync::OnceLock;

static CONFIG: OnceLock<String> = OnceLock::new();

fn config() -> &'static str {
    CONFIG.get_or_init(|| std::env::var("APP_MODE").unwrap_or_else(|_| "default".into()))
}
```

These types encode “initialize at most once” in the type system. **`static mut`** requires `unsafe` on every access, races easily under concurrency, and is almost never the right teaching default. If initialization can fail, surface `Result` from an explicit init function rather than panicking inside a hidden lazy path without a policy.

---

## 2. Advanced concepts

### 1. Scoped threads and lifetimes

**`std::thread::scope`** (stabilized in recent toolchains) allows non-`'static` borrows into threads that are joined before the scope ends. Prefer scopes when workers only need stack data for a parallel section; prefer `Arc` + channels for fire-and-forget or long-lived pools.

### 2. Parking, yielding, and builder options

**`thread::Builder`** sets name, stack size, and spawn error handling—useful for ops agents with many threads. **`yield_now`** hints the scheduler; use sparingly in spin-adjacent code.

**`park` / `unpark` awareness:** each thread has a park token. **`thread::park`** blocks until an **`unpark`** (or a spurious wake—always re-check your condition). **`unpark`** is directed at a specific `Thread` handle. This is a low-level primitive underneath some sync types; application code that hand-rolls park/unpark protocols is easy to get wrong (lost wakeups, wrong thread). Prefer **`mpsc` channels** or **`Condvar`** for “wait until state changes.” Know park/unpark exists so stack traces and runtime internals are not mysterious—not as a default concurrency API.

### 3. Atomics and `Ordering` intuition

**`std::sync::atomic`** provides lock-free flags and counters—commonly **`AtomicBool`**, **`AtomicUsize`**, and related integer atomics—with an explicit **`Ordering`** on every load/store/RMW. Intuition (not a formal model tutorial):

| Ordering | Rough role |
|----------|------------|
| **`Relaxed`** | Atomicity of that location only; no cross-variable happens-before story. Fine for independent counters/metrics. |
| **`Acquire`** (load) / **`Release`** (store) | Pair for “publish a flag/pointer, then see the writes that preceded the release.” Classic handoff pattern. |
| **`AcqRel`** | Combined acquire+release on read-modify-write ops that both publish and observe. |
| **`SeqCst`** | Strongest; total order across SeqCst ops. Default instinct when unsure—but still not a substitute for a clear invariant. |

**When not to invent lock-free algorithms:** if the invariant spans multiple locations, needs waiting, or you cannot state the memory-ordering proof in review, use **`Mutex` / channels**. Wrong `Ordering` is silent UB-class thinking even when the type system accepts the call. Prefer atomics for simple flags, once-set shut-down bits, and contended counters after measurement—not as a first design for complex state machines.

### 4. `thread_local!` for per-thread state

**`thread_local!`** defines storage unique to each OS thread (initialized on first access in that thread). Use it for per-thread caches, scratch buffers, or metrics that must not be shared—without paying for `Mutex` on every hit.

Caveats:

- Values are **not** `Send` across threads by construction; do not try to “share” them.
- Destructors run when the thread exits (with platform/runtime subtleties)—do not stash process-wide resources that outlive the thread without a clear policy.
- Prefer `thread_local!` over `static mut` for thread-scoped mutable state.

### 5. `Condvar` with `Mutex`

**`std::sync::Condvar`** waits for a condition while releasing a **`Mutex`**, then re-acquires on wake. Pattern: lock → check predicate in a **loop** (spurious wakes) → `wait` / `notify_one` / `notify_all`. Prefer this (or channels) over busy-spinning on a flag. Keep the predicate and the data it observes under the same mutex; documenting “what we wait for” is part of the API.

### 6. Deadlock patterns (lock order)

Safe Rust prevents data races; it does **not** prevent deadlocks. Classic failure modes:

- **Lock-order inversion:** thread A holds `M1` waits for `M2`; thread B holds `M2` waits for `M1`. Fix: a **global lock order** (always acquire in the same sequence), or collapse to one lock / channels.
- **Self-deadlock:** same thread tries to lock a non-reentrant `Mutex` it already holds (including via helper calls).
- **Hold across join/channel:** waiting on a thread/channel that needs the lock you still hold.

Staff practice: document ordered lock sets for multi-mutex modules; keep critical sections short; prefer channels when ownership transfer avoids nested locks.

### 7. `Arc` cycles and leaks

`Arc` cycles leak memory unless you break them with **`Weak`**. Less common than in GC graphs, but long-lived graphs of services/handlers can create cycles—know the escape hatch.

### 8. Mixing threads and async

Blocking `mutex` or `recv` on an async runtime’s worker thread stalls other tasks. Thread-pool concurrency and async concurrency are different schedulers; chapter 13 covers the async pitfalls. Staff review asks which model owns each wait.

### 9. Edition notes

Thread and sync APIs are stable across editions. Prefer `thread::scope` when available on your MSRV instead of `'static` + `Arc` boilerplate for short parallel sections. Channel APIs in `std::sync::mpsc` remain the teaching default; ecosystems also offer alternate channel crates—choose one model per codebase.

### 10. Panic across threads

An uncaught panic in a spawned thread does not unwind the parent. `join` surfaces it as `Err`. Define a policy: abort the process, restart the worker, or escalate. Silent dropped `JoinHandle`s can hide failures.

### 11. Stick to `std` sync; ecosystem locks are optional

Third-party lock crates (for example **parking_lot**-class libraries) exist in the ecosystem and sometimes appear in high-contention codebases. They are **not required** to write correct concurrent Rust. Prefer **`std::sync::{Mutex, RwLock, Condvar, OnceLock, LazyLock}`** and channels unless your team has already measured a need and standardized on an alternative. Mixing multiple lock implementations in one process without a reason increases review surface. This track teaches the standard library model first.

### 12. Poisoned mutex recovery policy (`lock()` `Err`)

If a thread **panics while holding** a `Mutex` (or `RwLock` write guard), Rust **poisons** the lock: the shared data may be inconsistent. Later **`lock()`** / **`read()`** / **`write()`** returns **`Err(PoisonError<_>)`** instead of a plain guard.

Staff policy choices (pick one per subsystem and document it):

| Stance | When |
|--------|------|
| **Fatal** | Treat poison as process-level failure: log, metrics, abort or restart the worker/process. Default for agents where invariants matter more than uptime of a corrupted cache. |
| **Recover with eyes open** | Call **`into_inner()`** (or `into_inner` on the `PoisonError`) to take the guard anyway, then **validate or reset** the protected state before continuing. |
| **Clear poison** | Some APIs expose ways to clear poisoning after repair—only after you know the data is consistent again. |

Do **not** habitually `.unwrap()` poison as “it will never happen,” and do not silently `into_inner()` without repair. Poison is a signal that a concurrent panic already violated an invariant; recovery without validation is hoping. Pair poison policy with the panic-across-threads policy in §10.

---

## 3. Applications and use cases

### Software engineering

- Prefer **channels** for ownership transfer and pipelines; prefer **locks** for short critical sections on shared structure.
- Keep critical sections tiny; do not hold a `Mutex` across network or disk I/O.
- Name threads in servers and agents for clearer dumps and metrics.

### Security

- Shared caches of secrets need the same access control as single-threaded stores; concurrency does not relax confidentiality.
- Avoid sharing non-`Sync` types across threads via `unsafe` to “make it compile.”

### Reliability and operations

- Bound work queues; unbounded `mpsc` plus a stuck consumer is an OOM waiting to happen.
- Document lock ordering for multi-mutex code; treat deadlock as a reliability defect class.
- Surface worker panics; do not detach threads without a supervisor story.

### Performance

- Measure contention before switching `Mutex` to `RwLock` or atomics.
- Thread-per-connection is simple and can be fine; huge fan-out may need pools or async (next chapter).
- False sharing and oversized critical sections show up as CPU spin without clear “slow functions.”

### Staff-level review checklist

- Cross-thread shares use `Arc` + sync primitive or channels—not ad hoc raw pointers.
- Closures that spawn use `move` (or scoped borrows) intentionally; no accidental `clone` storms without reason.
- Lock guards have clear, short scopes; no await/blocking I/O while held (especially if async appears later).
- `Send`/`Sync` bounds on public APIs match the concurrency story.
- `RefCell`/`Cell` appear only in single-threaded contexts; `Mutex`/`RwLock` for multi-threaded mutation.
- One-time globals use `OnceLock`/`LazyLock`, not `static mut`.
- Atomics have a stated invariant and `Ordering` rationale; no home-grown lock-free protocols without review.
- Multi-mutex code documents **lock order**; no lock held across blocking waits that need the same locks.
- `thread_local!` used only for true per-thread state—not as hidden global sharing.
- Poison, panic-on-worker, and queue bounds have explicit policies (`Fatal` vs validate-then-`into_inner`).
- Application code does not hand-roll **`park`/`unpark`** protocols when channels or `Condvar` suffice.
- Data-race freedom is not confused with deadlock freedom.
- Sync primitives default to `std` unless a documented, measured exception exists.

---

## References

- [`std::thread`](https://doc.rust-lang.org/stable/std/thread/)
- [`std::thread::park`](https://doc.rust-lang.org/stable/std/thread/fn.park.html)
- [`std::thread::Thread::unpark`](https://doc.rust-lang.org/stable/std/thread/struct.Thread.html#method.unpark)
- [`std::sync::Mutex`](https://doc.rust-lang.org/stable/std/sync/struct.Mutex.html)
- [`std::sync::PoisonError`](https://doc.rust-lang.org/stable/std/sync/struct.PoisonError.html)
- [`std::sync::RwLock`](https://doc.rust-lang.org/stable/std/sync/struct.RwLock.html)
- [`std::sync::Arc`](https://doc.rust-lang.org/stable/std/sync/struct.Arc.html)
- [`std::sync::mpsc`](https://doc.rust-lang.org/stable/std/sync/mpsc/)
- [`std::sync::OnceLock`](https://doc.rust-lang.org/stable/std/sync/struct.OnceLock.html)
- [`std::sync::LazyLock`](https://doc.rust-lang.org/stable/std/sync/struct.LazyLock.html)
- [`std::sync::atomic`](https://doc.rust-lang.org/stable/std/sync/atomic/)
- [`std::sync::Condvar`](https://doc.rust-lang.org/stable/std/sync/struct.Condvar.html)
- [`std::thread_local`](https://doc.rust-lang.org/stable/std/macro.thread_local.html)
- [`std::marker::Send`](https://doc.rust-lang.org/stable/std/marker/trait.Send.html)
- [`std::marker::Sync`](https://doc.rust-lang.org/stable/std/marker/trait.Sync.html)
- [`std::cell::Cell`](https://doc.rust-lang.org/stable/std/cell/struct.Cell.html)
- [`std::cell::RefCell`](https://doc.rust-lang.org/stable/std/cell/struct.RefCell.html)
- [The Book — Fearless Concurrency](https://doc.rust-lang.org/stable/book/ch16-00-concurrency.html)
- [The Book — Shared-State Concurrency](https://doc.rust-lang.org/stable/book/ch16-03-shared-state.html)
- [The Book — Sync and Send](https://doc.rust-lang.org/stable/book/ch16-04-extensible-concurrency-sync-and-send.html)
- [Rust Standard Library — sync](https://doc.rust-lang.org/stable/std/sync/)
- [Rust By Example — Threads](https://doc.rust-lang.org/stable/rust-by-example/std_misc/threads.html)
