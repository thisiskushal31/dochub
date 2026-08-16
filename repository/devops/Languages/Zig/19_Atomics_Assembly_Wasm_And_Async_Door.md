# Atomics, assembly, Wasm, and the async door

[← Back to Zig](./README.md)

## What this chapter covers

Systems doors beyond the single-threaded happy path: **atomics**, **inline assembly**, **WebAssembly** as a target, and the honest status of **async** in modern Zig. Literacy and judgment—not a concurrency textbook.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Atomics: shared memory with rules

**What you see:**

```zig
var counter: std.atomic.Value(u64) = .init(0); // or atomic builtins on your pin

fn bump() void {
    _ = counter.fetchAdd(1, .monotonic);
}

// Builtin-shaped form you will also see in stranger code:
fn loadFlag(flag: *const u32) u32 {
    return @atomicLoad(u32, flag, .acquire);
}
```

**What it is.** Tools for intentional concurrent protocols. Ordinary loads/stores are not enough when threads share memory. `volatile` is **not** an atomic (chapter **08**).

**Where you use it.** Small, tested protocols—or prefer message passing / one writer. Data races remain a human problem.

### 2. Inline assembly: escape hatch with a contract

**What you see:**

```zig
fn readTs() u64 {
    // Shape only — exact asm is target-specific; isolate and review like FFI
    return asm volatile ("rdtsc" : [ret] "={rax}" (-> u64));
}
```

**What it is.** Speak machine instructions when you must. Incomplete **clobbers** are unchecked illegal behavior—lying to the compiler about what you smashed.

**Where you use it.** Privileged ops, precise fences, tiny hot kernels. Prefer std/OS APIs when they exist. Isolate asm in tiny functions.

### 3. WebAssembly as a target

**What you see:**

```bash
zig build -Dtarget=wasm32-wasi
# or your pin’s wasm triple — record it beside the artifact
```

**What it is.** A **target triple decision** (chapter **02**), with different I/O, host ABI, and size constraints than native Linux.

**Where you use it.** Ship Wasm as a first-class `build.zig` artifact; test the triple you deploy. Host capabilities (browser, wasmtime, …) are not “Linux by default.”

### 4. Async / I/O on 0.16: language async vs `std.Io`

**What you might still see in old blog posts:** language-level `async` / `await` as everyday Zig (pre-0.11 style).

**What the language reference still says:** language **async functions regressed** with 0.11; the plan is lower-level primitives that power I/O—not a return of the old colored-function model as tutorials once taught.

**What you see in Zig 0.16 std instead:** **I/O as an interface**—`std.Io`—threaded through apps (often from `main` / `std.process.Init`). File, network, sleep, and sync primitives increasingly take an `Io`. Task-level work uses `io.async` / `io.concurrent` + `Future` await/cancel (and `Group` for shared lifetimes)—see the **0.16 release notes**, not pre-0.11 language-async posts.

```zig
// Shape only — exact APIs follow your pin's std docs
const Io = std.Io;

fn example(io: Io) !void {
    var fut = io.async(work, .{io});
    defer _ = fut.cancel(io) catch {};
    try fut.await(io);
}

fn work(io: Io) !void {
    _ = io;
}
```

**Where you use it today:**

> Do **not** design new systems from old language-`async` tutorials. On **0.16**, learn **`std.Io`** (and pass `io` like you pass allocators). Keep language-level async as “regressed / tracking upstream,” and verify every I/O call against your pin’s std docs—filesystem helpers moved heavily in this release.

### 5. How this chapter fits the track

Most Zig CLIs never need asm or atomics. You still need to **recognize** them—and recognize **`std.Io`**—when reading systems tools, runtimes, and embedded work.

---

## 2. Advanced concepts

### 1. Single-threaded builds vs atomics

```zig
const builtin = @import("builtin");

comptime {
    if (builtin.single_threaded) {
        // some locks become no-ops — do not assume real threads
    }
}
```

Mixing “I assumed threads” libraries into a single-threaded artifact is a configuration bug (chapter **02**).

### 2. Memory order

If you are unsure what acquire/release means, you are not ready to invent lock-free structures—use `std` mutexes / higher-level tools for your pin.

### 3. Vectors and asm together

SIMD (chapter **03**) and asm are both performance escapes. Measure first.

### 4. Security notes (defense)

- Race bugs can become security bugs; keep concurrent mutable state minimal.
- Inline asm + `@ptrCast` combinations deserve senior review.
- Wasm still needs supply-chain discipline for the module you load.

No race-exploitation recipes—only pressure to keep concurrency boring.

---

## 3. Applications and use cases

| Angle | Role |
|-------|------|
| **Application** | Most apps: avoid shared mutability |
| **Systems** | Atomics/asm when the problem truly needs them |
| **Security** | Review concurrent state and asm islands |
| **Ops** | Record wasm/native targets you actually ship |
| **SE** | Ban old async tutorials as architecture guides until the pin restores a documented model |

**Whole-engineering picture:** these doors are real—enter them with pin docs and tests, not with nostalgia.

---

## 4. Staff-level review checklist

- Atomics have a named protocol and tests; races are not “temporary.”
- Inline asm is isolated; clobbers/constraints reviewed.
- Wasm/native targets in CI match what you deploy.
- No new design depends on pre-0.11 language-async tutorials; I/O uses `std.Io` for the pin.
- Single-threaded builds are documented when used.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [0.16.0 release notes](https://ziglang.org/download/0.16.0/release-notes.html)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
