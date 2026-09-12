# Where Zig is going and adjacent doors

[← Back to Zig](./README.md)

## What this chapter covers

Why Zig **persists**, how it sits beside **C** and **Rust**, what you should already be able to do after chapters **00–16**, and **what to learn next**—so you leave this track with a direction, not a cliff.

**Lens:** what you’ve seen → what the language is → where you go next.

---

## 1. Concepts

### 1. What this track already owns

| You should be able to… | Chapters |
|------------------------|----------|
| Explain Zig vs C vs Rust honestly | **01** |
| Install, pin, and hello | **00** |
| Choose modes and targets deliberately | **02** |
| Read and write core language forms | **03–08** |
| Pass allocators and design lifetimes | **09** |
| Use comptime without turning code into puzzles | **10** |
| Structure modules and packages | **11** |
| Drive `build.zig` and tests | **12–13** |
| Interop with C carefully | **14** |
| Review safety with mode literacy | **15** |
| Read builtins / casts / `builtin` | **18** |
| Recognize atomics, asm, Wasm, `std.Io` / async status | **19** |
| Place Zig in a real engineering org | **16** |

If those lines are still fuzzy, revisit the chapter—don’t “finish” by scrolling.

### 2. Why Zig persists

Teams keep choosing Zig because **explicit control**, **cross-compilation**, **comptime**, and **C interop** solve real systems pain. The language still evolves across minors—so persistence also requires **pin professionalism**. Zig’s future is less about hype cycles and more about whether teams can ship reliable native tools with a sane toolchain story.

### 3. Orientation sentence

> **Zig is C-shaped control with visible errors, visible allocations, and a single toolchain—safety depends on build mode and discipline, not on a borrow checker.**

Carry that sentence into design reviews. It prevents both overselling and underselling.

### 4. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| Zig language, build, tests, modes | **Yes** | Official reference for your pin |
| Deep C/C++ | Door | [C/C++](../C-C++/README.md) |
| Ownership / borrow safety model | Door | [Rust](../Rust/README.md) |
| Machine-level detail | Door | [Assembly](../Assembly/README.md) |
| Bun (or other product) behavior | **No** | That product’s own documentation |
| Deep `std.Io` / evented backends | Door | [0.16 release notes — I/O as an Interface](https://ziglang.org/download/0.16.0/release-notes.html) + your pin’s std docs |

### 5. When to stay on Zig

Stay when C ABI + allocator-explicit design + cross-build are the job, and the team can maintain pins and mode policy. Move toward Rust when compile-time memory-safety proofs are non-negotiable. Stay with C when rewrite cost dominates and Zig would only be a thin wrapper you never invest in.

---

## 2. Advanced concepts

### 1. How to choose what to learn next

Pick by **job to be done**, not by “more Zig syntax.”

#### A. C/C++ track

ABI, headers, UB culture—makes Zig interop sharper and reviews faster.

#### B. Rust track

Contrast safety models. Bilingual systems teams are common; knowing both prevents religious arguments.

#### C. Assembly

When performance or ABI mysteries demand reading what the compiler emitted.

#### D. OS / networking / security operations

Sockets, privileges, sandboxing—language-agnostic skills that make Zig tools meaningful in production.

#### E. Supply chain engineering

Signing, SBOMs, reproducible builds for native tooling—especially if you distribute binaries widely.

### 2. Role paths after this track

| Role | Sensible next move |
|------|--------------------|
| **Systems engineer** | Ship one real cross-target artifact end-to-end |
| **Security reviewer** | Add parser fuzzing + enforce mode policy |
| **Ops** | Harden builder images and release provenance |
| **SE** | Publish an org language radar: when Zig vs Rust vs C |

### 3. Common wrong turns

| Wrong turn | Better move |
|------------|-------------|
| Tracking `master` in production | Pin **0.16.x** (or your org’s chosen pin) |
| ReleaseFast everywhere by default | Mode by threat model |
| Ignoring allocator parameters | Pass them; design lifetimes |
| Rewriting all C in a month | Wrap → test → replace gradually |
| Confusing Bun skill with Zig skill | Learn the language chapters |

---

## 3. Applications and use cases

| Angle | What “next” looks like |
|-------|------------------------|
| **Application** | One CLI in production with pin + tests |
| **Systems** | One C library wrapped or replaced behind ABI |
| **Security** | Safe-mode parsers with failure-path tests |
| **Ops** | CI matrix of targets you actually run |
| **SE** | Documented decision and training plan |

**Whole-engineering picture:** finish Zig literacy, then go deep on **one adjacent systems skill**—C, Rust, or shipping discipline.

---

## 4. Staff-level review checklist

- Learner can explain Zig vs C vs Rust in one clear minute.
- Next door is chosen deliberately (not infinite syntax wandering).
- Pin/mode/test habits will travel with the team into the next project.
- C or Rust follow-on is scheduled if the estate needs it.
- No confusion between Zig-the-language and Zig-built products.

---

## References

- [Zig language](https://ziglang.org/)
- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
- [C/C++ track](../C-C++/README.md)
- [Rust track](../Rust/README.md)
- [Assembly track](../Assembly/README.md)
