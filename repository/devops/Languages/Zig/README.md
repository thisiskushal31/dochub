# Zig

[← Back to Languages](../README.md)

**Zig** is a **systems programming language** aimed at robustness, optimality, and maintainability—often described as a modern alternative to C. You write `.zig` sources; the **Zig** toolchain compiles to native code (and can cross-compile). There is **no hidden control flow**, **no hidden allocations**, and **first-class C interop**. Memory is managed explicitly with **allocators**. Compile-time execution (**comptime**) is a core language feature, not an afterthought.

This track teaches **Zig language + toolchain + build + testing + C interop + safety review** for people who build, operate, or audit systems tooling written in Zig (CLIs, libraries, infrastructure components, and Zig-built runtimes such as Bun). It is **not** a Bun product manual, an embedded RTOS course, or a substitute for the full language reference. Sibling systems languages: [C/C++](../C-C++/README.md), [Rust](../Rust/README.md), [Assembly](../Assembly/README.md).

Staff hire Zig fluency for six practical pillars:

1. **Language honesty** — values, `const`/`var`, optionals, errors, pointers/slices (chapters **03–08**).
2. **Memory honesty** — allocators, `undefined`, no hidden allocs (chapters **04**, **09**).
3. **Comptime and packages** — compile-time code, modules, `build.zig` (chapters **10–12**).
4. **Toolchain** — install pin, build modes, targets, `zig test` (chapters **00**, **02**, **13**).
5. **C boundary** — translate-c / export / ABI discipline (chapter **14**).
6. **Safety review** — illegal behavior, Debug vs ReleaseFast, UB literacy (chapter **15**).

Also cover **builtins / casting / `builtin`** (**18**) and **atomics / asm / Wasm / `std.Io` async status** (**19**) so stranger systems code stays readable.

**New to Zig?** Start at chapter **01**, then **00** (install + hello), then **02** onward. Finish with **[17](./17_Where_Zig_Is_Going_And_Adjacent_Doors.md)** for what to learn next.

---

## After this track — what you can write

| You can write / do… | What “done” looks like | Spine chapters |
|---------------------|------------------------|----------------|
| A **hello / small CLI** | Pinned `zig`; compiles; runs | **00–03** |
| **Error-aware** functions | Error sets + `try` / `catch` honest | **07** |
| **Slice/pointer** code without silent UB | Lifetimes clear; no wild `undefined` use | **08–09**, **15** |
| An **allocator-backed** structure | Allocator passed in; free/deinit paths exist | **09** |
| A **`build.zig` project** | Build steps clear; cross-target understood | **12** |
| **`zig test`** in CI | Tests green; leak reporting understood | **13** |
| A **C call or export** | ABI and headers intentional | **14** |
| A **keep Zig vs C/Rust** decision | Host and team skill named | **01**, **16–17** |
| **Read systems Zig** with `@` / atomics / Wasm | Builtins and doors recognized | **18–19** |

---

## What to learn next (complement paths)

Zig usually lands in **systems tooling**, **performance-sensitive libraries**, and **C-replacement** niches. After this track, pick the next skill by the *job*.

| If your goal is… | Learn next | Start with |
|------------------|------------|------------|
| Same problem space, different safety model | [Rust](../Rust/README.md) | Ownership vs allocators |
| Legacy / ubiquitous systems C | [C/C++](../C-C++/README.md) | ABI + undefined behavior contrast |
| Machine-level | [Assembly](../Assembly/README.md) | After pointers chapter **08** |
| Zig-built JS runtime (Bun) | Bun docs + this track’s C/build chapters | Treat Bun as product, Zig as language |
| Cross-compile / embedded | Official targets + `build.zig` | Chapters **02**, **12** |
| Containerized delivery | Your org’s image pin + `zig build` | **00**, **12**, **15** |

**Suggested order by role**

| Role | Path |
|------|------|
| **Systems engineer** | **01 → 00 → 02–09 → 12–15 → 18–19** |
| **Security reviewer** | **01 → 04 → 08–09 → 14–15 → 18–19** |
| **Ops / release** | **00 → 02 → 12–13 → 15** |
| **Interop / FFI** | **08 → 14 → 15** (+ C track) |

---

## Versions and brownfield (default narrative)

**Default for new work: Zig 0.16.x**, pinned to the patch your CI ships (**0.16.0** in these chapters). Zig still moves quickly between minors—**pin the toolchain** the way you pin a compiler. Prefer the language reference for **your pin**, not only `master`. Older **0.14 / 0.15** trees are brownfield literacy.

| Pin | Where it shows up | Habit |
|-----|-------------------|-------|
| **0.16.0** / **0.16.x** | New projects | Default narrative |
| **0.14 / 0.15** | Existing repos | Read that pin’s docs before porting |
| **master** | Cutting-edge only | Not default CI without policy |
| Cross targets | `zig build -Dtarget=…` | Record target triple with artifacts |

```bash
zig version
zig env
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (modes, edge cases, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (six ideas)

1. **No hidden control flow**—what you write is what runs (errors are values; no exceptions).
2. **No hidden allocations**—pass an allocator when you need the heap.
3. **Comptime is first-class**—types and code can run at compile time.
4. **Optionals and errors are explicit**—`?T` and error sets replace null/errno folklore.
5. **C is a peer**—import and export without a separate FFI sub-language.
6. **Build modes change safety**—Debug/ReleaseSafe vs ReleaseFast/ReleaseSmall are product choices.

| Idea | Review smell if missing | Chapters |
|------|-------------------------|----------|
| Explicit alloc | Mystery heap growth | **09** |
| Error sets | Ignored errors / bare `catch {}` | **07** |
| `undefined` abuse | Untouched poison used as data | **04**, **15** |
| Pointer/slice honesty | Dangling or unbounded access | **08**, **15** |
| Toolchain pin | Untagged `zig` in CI | **00**, **02** |
| C boundary | Unreviewed C import surface / leftover `@cImport` in new 0.16 code | **14** |

---

## How to read this section

**Absolute beginners:** **01 → 00 → 02 → 03 → …**  
If you know C already: **01** (Zig differences) → **00** → **07–09** → **14–15**—do not skip allocators and error sets.  
If you know Rust: **01** (allocators vs ownership) → **09** → **10** → **14**.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation** | 01 | Explain Zig vs C / Rust and when to pick Zig |
| **Doorway** | 00, 02 | Install, hello, build modes, targets |
| **Language core** | 03 → 08 | Syntax, control, types, errors, pointers |
| **Systems core** | 09 → 11 | Allocators, comptime, packages |
| **Ship** | 12 → 14 | `build.zig`, tests, C interop |
| **Safety / synthesis** | 15 → 17 | Review habits, roles, next skills |
| **Systems doors** | **18 → 19** | Builtins/casts/`builtin`; atomics, asm, Wasm, `std.Io` / async status |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: install and hello | [00_First_Steps_Install_And_Hello.md](./00_First_Steps_Install_And_Hello.md) |
| 01 | What Zig is (and is not) | [01_What_Zig_Is_And_Is_Not.md](./01_What_Zig_Is_And_Is_Not.md) |
| 02 | Toolchain, build modes, and targets | [02_Toolchain_Build_Modes_And_Targets.md](./02_Toolchain_Build_Modes_And_Targets.md) |
| 03 | Syntax, values, and primitives | [03_Syntax_Values_And_Primitives.md](./03_Syntax_Values_And_Primitives.md) |
| 04 | Variables, const, and undefined | [04_Variables_Const_And_Undefined.md](./04_Variables_Const_And_Undefined.md) |
| 05 | Control flow, defer, and unreachable | [05_Control_Flow_Defer_And_Unreachable.md](./05_Control_Flow_Defer_And_Unreachable.md) |
| 06 | Structs, enums, unions, and optionals | [06_Structs_Enums_Unions_And_Optionals.md](./06_Structs_Enums_Unions_And_Optionals.md) |
| 07 | Error sets and error handling | [07_Error_Sets_And_Error_Handling.md](./07_Error_Sets_And_Error_Handling.md) |
| 08 | Pointers, slices, and arrays | [08_Pointers_Slices_And_Arrays.md](./08_Pointers_Slices_And_Arrays.md) |
| 09 | Memory and allocators | [09_Memory_And_Allocators.md](./09_Memory_And_Allocators.md) |
| 10 | Comptime | [10_Comptime.md](./10_Comptime.md) |
| 11 | Functions, packages, and modules | [11_Functions_Packages_And_Modules.md](./11_Functions_Packages_And_Modules.md) |
| 12 | Build system (`build.zig`) | [12_Build_System.md](./12_Build_System.md) |
| 13 | Testing | [13_Testing.md](./13_Testing.md) |
| 14 | C interop | [14_C_Interop.md](./14_C_Interop.md) |
| 15 | Safety, illegal behavior, and security review | [15_Safety_UB_And_Security_Review.md](./15_Safety_UB_And_Security_Review.md) |
| 16 | Use cases and engineering perspectives | [16_Use_Cases_And_Engineering_Perspectives.md](./16_Use_Cases_And_Engineering_Perspectives.md) |
| 17 | Where Zig is going and adjacent doors | [17_Where_Zig_Is_Going_And_Adjacent_Doors.md](./17_Where_Zig_Is_Going_And_Adjacent_Doors.md) |
| 18 | Builtins, casting, and compile variables | [18_Builtins_Casting_And_Compile_Variables.md](./18_Builtins_Casting_And_Compile_Variables.md) |
| 19 | Atomics, assembly, Wasm, and the `std.Io` / async door | [19_Atomics_Assembly_Wasm_And_Async_Door.md](./19_Atomics_Assembly_Wasm_And_Async_Door.md) |

---

## Further reading

- [Zig language](https://ziglang.org/)
- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Zig downloads](https://ziglang.org/download/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig Build System guide](https://ziglang.org/learn/build-system/)
- [0.16.0 release notes](https://ziglang.org/download/0.16.0/release-notes.html)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
- [C/C++ track](../C-C++/README.md)
- [Rust track](../Rust/README.md)
- [Assembly track](../Assembly/README.md)
