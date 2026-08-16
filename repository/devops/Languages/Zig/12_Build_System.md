# Build system (build.zig)

[← Back to Zig](./README.md)

## What this chapter covers

**`build.zig`**—Zig’s build system expressed as Zig code. This is how real projects compile artifacts, wire modules, run tests, and cross-compile without a pile of unrelated Make dialects. Chapter **02** covered modes and targets; this chapter covers the **project entrypoint**.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. When you need `build.zig` (and when you do not)

**What you see for tiny experiments:**

```bash
zig build-exe hello.zig
zig test math.zig
```

**What you see for a real project:**

```bash
zig build
zig build test
zig build run
```

**What it is.** Single-file commands are enough for experiments. You reach for the **Zig Build System** when the command line gets long, you have many artifacts/steps, options, targets, dependencies, or you publish a package.

**Where you use it.** Any repo you expect a second human (or CI) to build without tribal knowledge.

### 2. Build is part of the language culture

**What you see in the repo root:**

```zig
// build.zig — illustrative shape (exact APIs follow your 0.16 pin)
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "tool",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
        }),
    });

    b.installArtifact(exe);

    const run_step = b.step("run", "Run the tool");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);
}
```

**What it is.** A Zig program that describes artifacts and steps. Humans and CI share one entrypoint—removing “works with my personal compile script” failures.

**Where you use it.** Default onboarding path: README says `zig build` / `zig build test`.

### 3. Artifacts, steps, and the install DAG

**What you see:**

```zig
b.installArtifact(exe); // if you forget this, zig build may “succeed” at doing nothing useful

const test_step = b.step("test", "Run unit tests");
const unit_tests = b.addTest(.{
    .root_module = exe.root_module,
});
const run_unit_tests = b.addRunArtifact(unit_tests);
test_step.dependOn(&run_unit_tests.step);
```

**What it is.** A **DAG** of steps. Default main step is **Install**. Name steps so CI is readable.

| Concept | Meaning |
|---------|---------|
| **Artifacts** | Executables, libraries, objects you produce |
| **Steps** | Named actions (`install`, `test`, `run`, custom tools) |
| **Options** | `-Dkey=value` flags that specialize the build |
| **Modules** | How Zig files depend on each other / packages |

**Where you use it.** Every merge gate and release recipe.

### 4. Build options are product knobs

**What you see:**

```bash
zig build -Doptimize=ReleaseSafe
zig build -Denable_foo=true   # project-specific option you define
```

```zig
const enable_foo = b.option(bool, "enable_foo", "Enable foo feature") orelse false;
_ = enable_foo; // often passed into a module as a compile-time option
```

**What it is.** `-D` options specialize the build—often driving comptime (chapter **10**).

**Where you use it.** Release vs debug feature sets. Document every option used in production: meaning, default, who may change it.

---

## 2. Advanced concepts

### 1. Dependency and module wiring

```zig
// Illustrative: attach a module so @import("mylib") resolves
const mylib = b.addModule("mylib", .{
    .root_source_file = b.path("lib/root.zig"),
});
exe.root_module.addImport("mylib", mylib);
```

Hidden include paths recreate C pain. If a file can import something, it should be obvious why the build allows it (chapter **11**).

### 2. Packages on 0.16: `build.zig.zon`, `zig-pkg/`, fingerprint

**What you see:**

```bash
zig fetch --save=foo "https://example.com/foo/archive.tar.gz"
ls zig-pkg/   # project-local fetched packages (usually gitignored)
zig build --fork=/path/to/local/foo   # ephemeral override by name+fingerprint
```

**What it is.** Dependencies declare `fingerprint` and enum-literal `name` in `build.zig.zon`. Fetches land next to the project in **`zig-pkg/`** so humans and IDEs can read them. `--fork` overrides a matching package across the tree without editing the zon file—useful for offline work and testing upstream patches.

**Where you use it.** Any multi-package repo. Document “ignore `zig-pkg/` unless your org vendors it.”

### 3. Generating files and `@embedFile`

```zig
// In application code (after a build step writes assets/version.txt):
const version = @embedFile("version.txt");
```

Keep generation in the build graph as explicit steps—deterministic when you can.

### 4. Mixed C, translate-c, and system libraries

```zig
// Preferred on 0.16: translate headers via b.addTranslateC, then import the module (chapter **14**).
// Also compile C objects / link system libs here — not via undocumented CFLAGS.
```

CI should fail loudly when a required system lib is missing.

### 5. Reproducible releases

A release recipe includes: Zig version, `build.zig` options, target, dependency set (hashes + fingerprints), mode. If you cannot recreate the binary from those, you have folklore—not release engineering.

---

## 3. Applications and use cases

| Angle | Build-system role |
|-------|-------------------|
| **Application** | One-command local build and run |
| **Systems** | Cross-compile matrix for fleet architectures |
| **Security** | Controlled options; no mystery flags in prod builds |
| **Ops** | CI calls documented `zig build` steps only |
| **SE** | New hire builds from README alone |

**Whole-engineering picture:** `build.zig` is the **ops interface** to the language.

---

## 4. Staff-level review checklist

- README documents canonical `zig build` invocations (including test).
- Release options and targets are explicit in CI—not laptop defaults.
- Dependencies and modules are wired visibly (`build.zig.zon` fingerprints; `zig-pkg/` policy known).
- Custom steps have names humans use.
- Pin bump process includes cleaning/rebuilding caches (and re-fetching packages).
- New C headers enter via `addTranslateC` (or documented equivalent), not ad-hoc `@cImport`.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Zig Build System (official learn guide)](https://ziglang.org/learn/build-system/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
- [Zig downloads](https://ziglang.org/download/)
