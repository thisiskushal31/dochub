# What Zig is (and is not)

[← Back to Zig](./README.md)

## What this chapter covers

The decision map before the syntax chapters: **what** Zig is, **why** teams pick it, how it compares to **C** and **Rust**, what it deliberately refuses to hide, and when another language is the better default. Chapter **[00](./00_First_Steps_Install_And_Hello.md)** is install + hello. This chapter is design intent and product choice.

Default narrative: **Zig 0.16.x** (pin **0.16.0**). Sibling systems tracks: [C/C++](../C-C++/README.md), [Rust](../Rust/README.md), [Assembly](../Assembly/README.md).

**Lens:** what you see as a user of the language → what Zig is → what it’s for → where you’ll use it.

---

## 1. Concepts

### 1. What Zig is (plain language)

**What you see.** `.zig` source files, a pinned `zig` compiler, and native binaries or libraries—not a garbage-collected app runtime.

**What it is.** A **systems programming language**: you control memory layout and lifetimes; you talk to the OS and to C; you ship **native** artifacts.

**Where you use it.** CLIs, C-ABI libraries, performance-sensitive components, cross-compiled fleet tools—anywhere C-shaped control is the job.

Zig’s design pitch is easy to memorize and worth taking literally:

| Promise | Plain meaning |
|---------|----------------|
| **No hidden control flow** | The language does not throw exceptions that unwind past you as a surprise. Failures show up as **error values** you propagate or handle. |
| **No hidden allocations** | The heap is not a secret side effect of “just calling a convenience API.” When you need dynamic memory, you typically **pass an allocator**. |
| **Comptime** | Zig can run code and compute types **at compile time**—generics and specialization without a separate macro language. |
| **C as a peer** | Import C headers and export C ABI functions as a normal workflow, not a bolted-on FFI dialect. |
| **One toolchain** | Build, test, format, and cross-compile live around the same `zig` binary and `build.zig` culture. |

Hold this picture:

> `.zig` → pinned `zig` (+ comptime analysis) → machine code / libraries → process you run or something else links

Zig is **not** “a scripting language that feels like C.” It is closer to **C with modern packaging and sharper defaults**—and it is **not** the same safety model as Rust.

### 2. Why Zig exists

C still runs the world, but C’s everyday pain is familiar: undefined behavior culture, ad hoc build systems, weak packaging, and error handling that is easy to ignore. Rust answered many of those pains with a **borrow checker** and a large ecosystem—at the cost of a steep model shift and more ceremony at the C boundary for some teams.

Zig aims at a different sweet spot: **keep the C mental model** (pointers, explicit memory, simple control flow), but make errors and allocations **visible**, make cross-compilation **ordinary**, and make compile-time code **first-class**. Teams that already think in allocators and ABIs often ramp faster in Zig than in Rust. Teams that need the compiler to *prove* memory safety in safe code often still want Rust.

### 3. What Zig is good at

| Fit | Why teams pick it |
|-----|-------------------|
| **CLIs and systems utilities** | Native performance, small operational surface, clear control |
| **Libraries that must speak C** | Export a stable C ABI while implementing in Zig |
| **Tooling and performance-sensitive components** | Low-level control without giving up a modern build story |
| **Cross-compilation** | Target triples are a normal part of `zig build`, not a weekend project |
| **Teaching / enforcing systems discipline** | Allocators and error sets make “who owns this memory?” a compile-time conversation |

Notable products (for example **Bun**) show Zig used at serious scale. Treat them as existence proofs—not as “copy this architecture into your repo.”

### 4. What Zig is not

| Not this | Better mental model |
|----------|---------------------|
| A garbage-collected application language | You own allocation and freeing |
| “Rust with different braces” | Different safety model; no borrow checker |
| A guarantee of memory safety in all build modes | **Debug** / **ReleaseSafe** check more; **ReleaseFast** checks less (chapters **02**, **15**) |
| A finished never-breaking std forever | Minors still move—**pin the toolchain** |
| Bun (or any one runtime) | Bun is a **product that uses Zig**; this track teaches the **language** |
| A substitute for knowing C UB / ABI | Interop still requires systems literacy ([C/C++](../C-C++/README.md)) |

### 5. Mental model for the rest of the track

You will learn Zig in layers:

1. Values, control flow, types (**03–06**)
2. Errors and pointers (**07–08**)
3. Allocators and comptime (**09–10**)
4. Packages, build, test (**11–13**)
5. C boundary and safety review (**14–15**)

If you only memorize syntax, you will miss the point. Zig’s “human readability” comes from **making the dangerous parts look dangerous**.

---

## 2. Advanced concepts

### 1. Zig vs C

| Dimension | Zig | C |
|-----------|-----|---|
| **Errors** | Error sets, `try` / `catch` | Return codes, errno culture, easy to ignore |
| **Safety defaults** | Runtime checks in Debug/ReleaseSafe | Mostly unchecked unless you add tooling |
| **Build** | `build.zig`, cross-compile built into the culture | Make/CMake + assorted toolchains |
| **Packages** | Zig package story on your pin | Headers, link lines, tribal knowledge |
| **Undefined / illegal** | Named illegal behavior + mode-dependent detection | Classic UB landscape |

**Pick Zig** when you want C-class control with better defaults for errors, tooling, and cross-builds. **Keep C** when the estate is already C, the ABI surface is huge, and rewrite cost dominates—or when Zig is only a wrapper around C you are not ready to replace.

### 2. Zig vs Rust

| Dimension | Zig | Rust |
|-----------|-----|------|
| **Safety model** | Discipline + mode checks + tests | Ownership and borrowing in safe Rust |
| **Allocations** | Pass an `Allocator` explicitly | Often encoded in types (`Box`, collections) |
| **Learning curve** | Familiar if you know C | Ownership is the mountain |
| **Ecosystem** | Younger, growing | Large crate ecosystem |
| **C FFI** | Extremely direct | Excellent, usually more ceremony |

**Pick Rust** when compile-time memory safety is a hard product requirement and the team will invest in the model. **Pick Zig** when allocator-explicit design, comptime, and C replacement speed matter more than borrow-checker proofs.

### 3. Decision tree: when to pick Zig for a module

Walk the questions in order:

1. **Must the module export or consume a C ABI day one?** If yes, Zig is a strong candidate.
2. **Does the team already think in pointers and allocators?** If yes, ramp is usually faster than Rust.
3. **Do you need the compiler to reject use-after-free classes in safe code by construction?** If yes, prefer Rust.
4. **Is hiring the binding constraint?** C and Rust still win on headcount in many markets—plan training time honestly.
5. **Is the job a greenfield CLI/tool with a small team that values a single toolchain?** Zig is a contender.

Write the answer in the design doc. “It was trending” is not an answer.

### 4. Interview and SE literacy

Correct the slogan “Zig is safe like Rust.” A better sentence:

> Zig makes unsafe states **harder to ignore** and **easier to catch in Debug/ReleaseSafe**, while still requiring human discipline around pointers, `undefined`, allocators, and ReleaseFast.

Also correct “Zig has no undefined behavior.” Zig has **illegal behavior**; whether it traps or goes wrong silently depends heavily on **build mode** (chapter **15**).

### 5. Brownfield and version reality

Zig **0.16.x** is the default narrative here. Older trees (**0.14**, **0.15**) appear in the wild. Before you “just upgrade,” read release notes for your pin and re-run tests. Tracking `master` in production without policy is a process failure, not a flex.

---

## 3. Applications and use cases

| Angle | How this chapter shows up at work |
|-------|----------------------------------|
| **Application** | Choosing Zig for a new systems component instead of defaulting to Go/Rust/C by habit |
| **Systems** | Replacing a C utility while keeping a C-callable surface |
| **Security** | Setting expectations: what Zig does *not* prove compared to safe Rust |
| **Ops** | Demanding a toolchain pin before adoption spreads across repos |
| **SE** | Running an honest Zig vs C vs Rust trade study with staffing included |

**Whole-engineering picture:** language choice is **safety model + interop + staffing + pin discipline**—not fashion.

---

## 4. Staff-level review checklist

- The adoption reason is named (C interop, comptime, cross-compile, team skill)—not “trending.”
- Safety expectations match Zig’s model, not Rust’s marketing language.
- Toolchain pin policy exists before nontrivial code lands.
- Bun or other Zig-built products are not confused with “we know Zig.”
- A one-paragraph comparison to C and Rust exists for the project.

---

## References

- [Zig language](https://ziglang.org/)
- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [C/C++ track](../C-C++/README.md)
- [Rust track](../Rust/README.md)
- [Assembly track](../Assembly/README.md)
