# First steps: install and hello

[← Back to Zig](./README.md)

## What this chapter covers

Your first honest contact with Zig: install a **pinned** toolchain, confirm the version, write a minimal program, and compile it. By the end you should be able to say what a `.zig` file becomes, why the version string matters on day one, and how Zig’s promises (“no hidden control flow,” “no hidden allocations”) start with the toolchain—not with slogans.

Default for new work: **Zig 0.16.x** (pin **0.16.0** in these chapters). Prefer the [language reference for your pin](https://ziglang.org/documentation/0.16.0/), not only `master`. Chapter **[01](./01_What_Zig_Is_And_Is_Not.md)** is design intent; this chapter is toolchain smoke.

Today’s win is simple: a pinned `zig` answers you. Allocators, error sets, C interop, and `build.zig` come next.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. What you are installing

**What you see after install:** a `zig` binary on your `PATH`, not a language daemon you leave running in production.

**What it is.** Zig is both a language and a **toolchain**. That binary compiles Zig (and can drive C), runs the build system, formats code, and runs tests. You compile → get a native binary (or library) → run or link that artifact.

| Artifact | Role |
|----------|------|
| **Executable** | Something you run (`zig build-exe` or a `zig build` step) |
| **Library / object** | Something you link into a larger system |
| **Tests** | `test` blocks executed by `zig test` |

Hold the picture:

> `.zig` → pinned `zig` → native code (plus optional C objects) → binary or library

That is the same *shape* as C or Rust toolchains: source in, machine code out. What differs is Zig’s defaults and its “one binary does build + test + cross-compile” culture (chapter **02**, **12**).

### 2. Install and version check

Install from the [official download page](https://ziglang.org/download/) for your OS and architecture, or from a package source your organization has already vetted. Then confirm:

```bash
zig version
zig env
```

`zig version` is not a nicety. Zig still moves between minors. If Alice’s laptop has **0.16.0** and CI silently floats to something else, language and standard-library behavior can diverge for the “same” source. Staff habit on day one: write the pin into the builder image, `README`, or lock notes **before** the first real module—not after the first mystery compile error.

### 3. Minimal program

**What you see:**

```zig
const std = @import("std");

pub fn main() void {
    std.debug.print("hello\n", .{});
}
```

**What it is.** `@import("std")` brings the standard library into this file; `pub fn main` is the process entry; `std.debug.print` writes a formatted line. No heap yet, no error sets yet—that is fine.

On **0.16**, the language reference also shows a `main(init: std.process.Init)` form that receives an **`Io`** for streaming stdout—useful once you leave “print and exit” (chapter **19**). Day-one smoke can stay on `std.debug.print`.

**Where you use it.** Day-one smoke: prove the pin works before designing modules.

### 4. Compile and run

**What you see:**

```bash
zig build-exe hello.zig
./hello
```

**What it is.** Source in → native binary out. You should see `hello` on stdout.

**Where you use it.** Alternatively start with `build.zig` early (chapter **12**). Either path is valid; the day-one requirement is that **compilation is reproducible on a clean machine with the same pin**.

### 5. What “hello” proved—and what it did not

| Proved | Not yet proved |
|--------|----------------|
| The pin installs and runs | Allocator discipline (chapter **09**) |
| `@import("std")` resolves | Error sets and `try` (chapter **07**) |
| A native binary executes | Cross-target release story (chapter **02**) |
| You can iterate locally | C ABI / translate-c (chapter **14**) |

### 6. Where this sits in the track

If you skipped **01**, read it next so “why Zig” is not only “it compiled.” Then **02** before you optimize anything: build modes change what “safe” means at runtime.

---

## 2. Advanced concepts

### 1. `zig` is more than `cc` with a new flag set

The same binary hosts formatting (`zig fmt`), testing (`zig test`), and the build system (`zig build`). Treat it as the **project toolchain**, not a single-purpose compiler driver. When onboarding fails, the failure is often “nobody documented which of those commands is canonical,” not “Zig is impossible.”

### 2. Local `native` is not the deploy target

Zig makes cross-compilation ordinary (chapter **02**). A binary that works on your Mac does not prove the Linux musl or embedded triple you ship. Record the **target** with the artifact the same way you record the Zig version.

### 3. Editors and language servers must track the pin

Language servers help a lot—and they create a new failure mode: the editor speaks a different Zig than CI. When “editor says OK, CI dies,” compare versions first.

### 4. Provenance of the toolchain

Download Zig from official channels your security policy allows. Official artifacts are signed (see the download page’s signing notes). In regulated environments, treat the Zig tarball like any other compiler: inventory it, pin it, and do not curl random mirrors without policy.

### 5. What not to optimize on day one

Do not begin in **ReleaseFast**. Learn how the program behaves in **Debug** (and understand **ReleaseSafe**) before you turn checks down (chapters **02**, **15**). Speed flags are a product decision, not a badge.

### 6. Multiple installs

Developers often keep several Zig versions. Shell PATH mistakes are common. `zig env` and `which zig` belong in the “it works on my machine” debug script.

---

## 3. Applications and use cases

| Angle | What day one is for |
|-------|---------------------|
| **Application** | Prove the machine can build Zig at all before designing modules |
| **Systems** | Same compiler family you will eventually cross-compile with |
| **Security** | Know where the compiler binary came from; pin it |
| **Ops** | Builder image contains the exact pin; CI prints `zig version` |
| **SE** | Onboarding script: install → version → hello → read chapter **01** |

**Whole-engineering picture:** toolchain smoke is how language adoption becomes an engineering fact instead of a slide.

---

## 4. Staff-level review checklist

- `zig version` in CI matches the project pin (and is logged on every build).
- A new contributor can produce hello (or the repo’s canonical `zig build`) on a clean machine from written docs.
- No “install whatever Zig” instructions without a version.
- Editor/language-server pin is documented beside the CI pin.
- Release artifacts will eventually record version **and** target—not only “Linux binary.”

---

## References

- [Zig downloads](https://ziglang.org/download/)
- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
