# Toolchain, build modes, and targets

[← Back to Zig](./README.md)

## What this chapter covers

How the `zig` toolchain behaves as a **product**: build modes (where safety actually lives), targets and cross-compilation, and what CI must record so a binary is identifiable. Pin: **0.16.x**. Install/hello remains chapter **00**; `build.zig` project structure deepens in chapter **12**.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. One toolchain, several jobs

**What you see day to day:**

```bash
zig build-exe main.zig
zig build
zig build test
zig fmt .
zig version
zig env
```

**What it is.** The same `zig` binary is the hub for compile, project build, test, format, and environment inspection—not only “compile a file.”

| Job | Typical command family |
|-----|------------------------|
| Compile a single file quickly | `zig build-exe`, `zig build-lib`, `zig build-obj` |
| Build a real project | `zig build` (driven by `build.zig`) |
| Run tests | `zig test` / `zig build test` |
| Format | `zig fmt` |
| Inspect environment | `zig version`, `zig env` |

**Where you use it.** Document **one canonical entrypoint** for humans and CI (usually `zig build` + named steps). A repo where everyone invents their own flags becomes unreviewable.

### 2. Build modes: safety is a dial

**What you see:**

```bash
zig build -Doptimize=Debug
zig build -Doptimize=ReleaseSafe
zig build -Doptimize=ReleaseFast
zig build -Doptimize=ReleaseSmall
```

**What it is.** Modes change both **optimization** and **runtime checking**—which bugs explode in CI versus which become silent corruption in production.

| Mode | Intent (plain language) |
|------|-------------------------|
| **Debug** | Fast iteration, more runtime checks, better debugging experience |
| **ReleaseSafe** | Optimizations **with** safety checks still on |
| **ReleaseFast** | Favor speed; many checks off—incorrect code may not trap |
| **ReleaseSmall** | Favor binary size; similar “less checking” reality to reason about carefully |

**Where you use it.** Develop in Debug (or ReleaseSafe when you need representative performance with checks). Treat ReleaseFast as a **conscious product decision** with tests and review (chapter **15**)—not as the default “we’re serious now” switch.

### 3. Targets and cross-compilation

**What you see:**

```bash
zig build -Dtarget=x86_64-linux-gnu
zig build -Dtarget=aarch64-linux-musl
# freestanding / wasm triples exist too — record what you ship
```

**What it is.** A **target** answers: which CPU architecture, OS, and ABI should this binary run on? Zig treats cross-compilation as ordinary.

**Where you use it.** Artifact identity is:

> **Zig version + build mode + target (+ build options)**

Same source with a different target is a different binary. CI that only builds `native` has not proven the release triple.

### 4. Why this chapter exists before “advanced syntax”

People try to learn Zig by memorizing pointers first, then wonder why production faults “don’t reproduce locally.” Often the answer is mode and target—not a missing semicolon. Get the toolchain contract straight early.

---

## 2. Advanced concepts

### 1. Debug vs ReleaseFast is a bug-class story

Many mistakes (out-of-bounds, bad unwraps, hitting a false `unreachable`) are **detected in safe modes** and may become **silent wrong behavior** in fast modes. That is not Zig being hostile; it is systems economics: checks cost cycles.

Policy pattern that works:

- PR CI: Debug or ReleaseSafe
- Staging: ReleaseSafe (or Fast with heavy tests)
- Production Fast: only with fuzzing/tests and a named owner

### 2. Single-threaded builds

Zig can produce **single-threaded** builds. When single-threaded, compile variables such as `@import("builtin").single_threaded` become true, and some userland APIs become cheaper no-ops (for example mutexes that empty out). That is great for constrained targets—and a footgun if a dependency assumed real threads. Document the choice (chapter **18** for compile variables; chapter **19** for atomics/threads).

### 3. Caches

Zig caches build work for speed. Shared CI caches are fine when keyed by version/options/target; they are dangerous when a pin bump still hits stale objects. After upgrading Zig, expect and accept full rebuilds.

### 4. `zig cc` and mixed C

Zig can drive C compilation for mixed trees (chapter **14**). That is powerful and easy to underspecify. Put include paths and flags in `build.zig`, not in a half-documented shell alias.

### 5. Freestanding and embedded

`freestanding` and embedded targets change what parts of `std` and OS APIs exist. Do not assume “full Linux std” on a bare-metal triple. The language works; the available library surface shrinks.

### 6. WebAssembly and other targets

Zig can target **WebAssembly** and many other triples (chapter **19**). Treat WASM as a target choice with its own I/O and ABI story—not as “the same binary in a browser.”

### 7. Artifact logging for ops

A release that cannot answer “which Zig, which mode, which target?” is not a release—it is a mystery blob. Print those three lines in CI logs and keep them beside checksums.

---

## 3. Applications and use cases

| Angle | Toolchain role |
|-------|----------------|
| **Application** | Local Debug loops that fail loudly while you learn |
| **Systems** | Cross-build matrix for every architecture you actually deploy |
| **Security** | Mode choice as a control; Fast requires justification on parsers |
| **Ops** | Reproducible builder images; cache hygiene; logged pin/mode/target |
| **SE** | One documented build entrypoint; no tribal compile flags |

**Whole-engineering picture:** mode and target are part of the **contract** with production, not convenience knobs.

---

## 4. Staff-level review checklist

- Dev and release modes are written down (not “whatever the engineer exported”).
- CI prints `zig version`, mode, and target on every artifact build.
- ReleaseFast (or equivalent) on security-sensitive code has an explicit reason and test story.
- Cross targets used in production are built and tested in CI—not only native laptop builds.
- Cache invalidation after pin bumps is understood.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Zig downloads](https://ziglang.org/download/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
