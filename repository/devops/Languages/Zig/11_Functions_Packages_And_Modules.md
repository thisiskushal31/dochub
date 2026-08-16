# Functions, packages, and modules

[← Back to Zig](./README.md)

## What this chapter covers

How Zig code is organized once you leave a single file: **functions**, **`pub` visibility**, **modules** (`@import`), and **packages**. After this chapter you should open a multi-file Zig repo and know what is public API, what is internal, and how files depend on each other.

**Reading lens for every section below:** what you see in the file → what the language means → where you use it at work.

---

## 1. Concepts

### 1. Functions: what you see, what they are

**What you see.** A named block with parameters and a return type—sometimes with `!` for errors:

```zig
const std = @import("std");

/// Adds two integers. Public so other modules can call it.
pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

fn helperOnly() void {
    // not pub → other modules cannot call this
}
```

**What it is.** Functions are the verbs of the program. `pub` is a **compatibility promise**: anything marked `pub` can be depended on by other modules. Without `pub`, the function stays private to this file/module.

**Where you use it.** Library boundaries, CLI entry helpers, and any API you expect teammates to call. Prefer small `pub` surfaces; keep helpers private.

### 2. Methods: functions attached to a type

**What you see.** A function whose first parameter is often named `self` and typed as the struct:

```zig
const Counter = struct {
    value: i32 = 0,

    pub fn incr(self: *Counter) void {
        self.value += 1;
    }

    pub fn get(self: Counter) i32 {
        return self.value;
    }
};

test "counter" {
    var c: Counter = .{};
    c.incr();
    try std.testing.expect(c.get() == 1);
}
```

**What it is.** Still a normal function—namespaced to the type for readability. `*Counter` means “I need to mutate”; `Counter` by value means “read-only copy / const access” depending on how you call it.

**Where you use it.** Types that own behavior (`File`, `Client`, `Buffer`). If a “method set” grows into a kitchen sink, split modules instead of stuffing more methods.

### 3. Modules and `@import`: the dependency graph you can see

**What you see** at the top of almost every file:

```zig
const std = @import("std");
const builtin = @import("builtin");
// your own module — name comes from build.zig wiring, not from guessing paths
const math = @import("math");
```

**What it is.** Each `.zig` file is a **module boundary**. `@import` brings another module into scope. Your own modules are wired by the **build system** (chapter **12**)—not by “relative path folklore” like some languages. If `@import("math")` fails, check `build.zig` first.

**Where you use it.** Split `math.zig`, `net.zig`, `main.zig` so each file has one job. Keep edges one-way: libraries at the bottom, apps at the top. Cycles hurt humans and compile times.

Minimal two-file shape (conceptually):

```zig
// math.zig
pub fn double(x: i32) i32 {
    return x * 2;
}

// main.zig
const std = @import("std");
const math = @import("math");

pub fn main() void {
    std.debug.print("{d}\n", .{math.double(21)});
}
```

(`build.zig` must expose `math` as a module root—chapter **12**.)

### 4. Packages: dependencies you did not write

**What you see.** A `build.zig.zon` next to `build.zig`, fetched sources under a project-local **`zig-pkg/`** directory (0.16+), and `@import("some_dep")` in application code.

```bash
zig fetch --save=example "https://example.com/example/archive.tar.gz"
# writes URL + hash into build.zig.zon — prefer this over hand-editing hashes
```

**What it is.** Packages are versioned dependencies—same supply-chain idea as Cargo crates or Go modules. On **0.16**, package metadata requires a **`fingerprint`**, and `name` is an enum literal (not a string). Fetches land in **`zig-pkg/`** (usually gitignored) so you can browse and IDE-index dependency source. Ephemeral local overrides use `zig build --fork=/path/to/checkout` (chapter **12**).

**Where you use it.** Shared HTTP parsers, compression, CLI flag libs—anything you should not reinvent. Treat a Zig dependency update like a code change: read the diff, run tests.

### 5. `std` is a module you import—not a free heap license

**What you see:**

```zig
const std = @import("std");

pub fn main() !void {
    var gpa: std.heap.DebugAllocator(.{}) = .init;
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const buf = try allocator.alloc(u8, 16);
    defer allocator.free(buf);
    @memset(buf, 0);
}
```

**What it is.** `std` is the standard library module. It still follows Zig’s allocator culture (chapter **09**). Importing `std` does not make allocations invisible.

**Where you use it.** Everyday I/O, formatting, data structures, testing—always check whether the API wants an allocator.

### 6. How to read a stranger repo (user walkthrough)

When you open an unfamiliar Zig project, do this in order:

1. Open `build.zig` — what executables/libs exist?
2. Open the root source — which `@import`s appear?
3. Grep/`pub` scan — what is the public surface?
4. Only then dive into private helpers.

You are mapping **contracts** before **cleverness**.

---

## 2. Advanced concepts

### 1. Public surface is a contract (with a bad example)

**What you see that should worry you:**

```zig
// everything pub — nothing is internal
pub fn parseInternalHack(buf: []const u8) !void {
    _ = buf;
}
```

**What it is.** Accidental API. Callers will depend on it; you can never rename it quietly.

**Where you use the lesson.** Libraries export the minimum. Applications can be looser internally but still keep a clear boundary for tests.

### 2. Exporting to C from a module

**What you see:**

```zig
export fn plugin_version() u32 {
    return 1;
}
```

**What it is.** `export` makes a C ABI symbol (chapter **14**). That is stronger than `pub` (Zig modules): it is a **binary** contract.

**Where you use it.** Plugins, `.so` surfaces, gradual C rewrites. Keep exports in a dedicated file when possible.

### 3. Multi-artifact repos

**What you see in CI:**

```bash
zig build
zig build test
zig build tools   # if you defined a tools step
```

**What it is.** One `build.zig` can define several artifacts. Named steps are the shared vocabulary for humans and automation.

**Where you use it.** Monorepos that ship a CLI + library + internal tools together.

### 4. Doc comments are part of the module

**What you see:**

```zig
/// Returns the user's display name, or null if missing.
pub fn displayName(user: User) ?[]const u8 {
    return user.name;
}
```

**What it is.** `///` attaches docs to the next declaration. Wrong docs are worse than none.

**Where you use it.** Every `pub` that is product API.

---

## 3. Applications and use cases

| Angle | What you do with modules |
|-------|---------------------------|
| **Application** | Feature folders as modules; `main` only wires them |
| **Systems** | Shared library module consumed by multiple binaries |
| **Security** | Minimal `pub` + pinned packages + review on upgrades |
| **Ops** | CI builds via named `zig build` steps; reproducible deps |
| **SE** | Onboarding map: “start at build.zig → root module → pub API” |

**Whole-engineering picture:** packaging is how Zig scales past a single heroic file—without losing the ability to read the graph.

---

## 4. Staff-level review checklist

- You can point to the `pub` surface in under a minute.
- Private helpers are not accidentally `pub`.
- `@import` names match `build.zig` wiring (no mystery modules).
- Dependencies are pinned and reviewed on bump.
- New public functions have `///` docs and tests.
- C `export`s (if any) live in an obvious boundary file.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Zig Build System guide](https://ziglang.org/learn/build-system/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
