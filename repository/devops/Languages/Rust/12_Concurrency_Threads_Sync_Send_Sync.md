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

Poisoning: if a thread panics while holding a `Mutex`, subsequent `lock()` returns **`PoisonError`**. Decide whether to recover with `into_inner()` or treat poison as fatal.

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

### 6. Interior mutability: `Cell` and `RefCell`

**Interior mutability** lets you mutate through a shared reference when the type enforces rules itself:

- **`Cell<T>`** — `Copy` or replace-style mutation; single-threaded; no runtime borrow flag
- **`RefCell<T>`** — dynamic borrow checking; panics on conflicting borrows at runtime; single-threaded

These are tools for single-threaded APIs (graphs, caches) that need mutation behind `&self`. They are **not** substitutes for `Mutex` across threads. Cross-thread interior mutability uses atomics, `Mutex`, lock-free structures, or channels.

### 7. Data race prevention in safe Rust

A **data race** is concurrent conflicting access to memory without synchronization, where at least one access is a write. Safe Rust’s type system is designed so you cannot express data races without `unsafe` (or unsound `unsafe` in a dependency). That is the core of “fearless concurrency.”

Safe Rust does **not** prevent:

- Deadlocks (lock ordering bugs)
- Race conditions on program logic (check-then-act on wrong abstraction)
- Lost updates at the business level
- Starvation, livelock, or priority inversion

---

## 2. Advanced concepts

### 1. Scoped threads and lifetimes

**`std::thread::scope`** (stabilized in recent toolchains) allows non-`'static` borrows into threads that are joined before the scope ends. Prefer scopes when workers only need stack data for a parallel section; prefer `Arc` + channels for fire-and-forget or long-lived pools.

### 2. Parking, yielding, and builder options

**`thread::Builder`** sets name, stack size, and spawn error handling—useful for ops agents with many threads. **`park`/`unpark`** and **`yield_now`** are low-level; prefer channels and condition variables (`Condvar`) for readable wakeups.

### 3. Atomics (high level)

**`std::sync::atomic`** provides lock-free flags and counters (`AtomicBool`, `AtomicUsize`, …) with explicit **memory orderings**. Easy to misuse; reach for atomics when profiling shows lock contention on simple flags/counters, not as a first design choice for complex invariants.

### 4. `Arc` cycles and leaks

`Arc` cycles leak memory unless you break them with **`Weak`**. Less common than in GC graphs, but long-lived graphs of services/handlers can create cycles—know the escape hatch.

### 5. Mixing threads and async

Blocking `mutex` or `recv` on an async runtime’s worker thread stalls other tasks. Thread-pool concurrency and async concurrency are different schedulers; chapter 13 covers the async pitfalls. Staff review asks which model owns each wait.

### 6. Edition notes

Thread and sync APIs are stable across editions. Prefer `thread::scope` when available on your MSRV instead of `'static` + `Arc` boilerplate for short parallel sections. Channel APIs in `std::sync::mpsc` remain the teaching default; ecosystems also offer alternate channel crates—choose one model per codebase.

### 7. Panic across threads

An uncaught panic in a spawned thread does not unwind the parent. `join` surfaces it as `Err`. Define a policy: abort the process, restart the worker, or escalate. Silent dropped `JoinHandle`s can hide failures.

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
- Poison, panic-on-worker, and queue bounds have explicit policies.
- Data-race freedom is not confused with deadlock freedom.

---

## References

- [`std::thread`](https://doc.rust-lang.org/stable/std/thread/)
- [`std::sync::Mutex`](https://doc.rust-lang.org/stable/std/sync/struct.Mutex.html)
- [`std::sync::RwLock`](https://doc.rust-lang.org/stable/std/sync/struct.RwLock.html)
- [`std::sync::Arc`](https://doc.rust-lang.org/stable/std/sync/struct.Arc.html)
- [`std::sync::mpsc`](https://doc.rust-lang.org/stable/std/sync/mpsc/)
- [`std::marker::Send`](https://doc.rust-lang.org/stable/std/marker/trait.Send.html)
- [`std::marker::Sync`](https://doc.rust-lang.org/stable/std/marker/trait.Sync.html)
- [`std::cell::Cell`](https://doc.rust-lang.org/stable/std/cell/struct.Cell.html)
- [`std::cell::RefCell`](https://doc.rust-lang.org/stable/std/cell/struct.RefCell.html)
- [The Book — Fearless Concurrency](https://doc.rust-lang.org/stable/book/ch16-00-concurrency.html)
- [The Book — Shared-State Concurrency](https://doc.rust-lang.org/stable/book/ch16-03-shared-state.html)
- [The Book — Sync and Send](https://doc.rust-lang.org/stable/book/ch16-04-extensible-concurrency-sync-and-send.html)
- [Rust Standard Library — sync](https://doc.rust-lang.org/stable/std/sync/)
