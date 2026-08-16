# C interop

[← Back to Zig](./README.md)

## What this chapter covers

Zig’s systems superpower: **talk to C without a separate FFI language**. How to import C (the **0.16 build-system path**), export C ABI entrypoints, keep ownership clear, and review mixed trees. Deep C language material lives in [C/C++](../C-C++/README.md); this chapter is the Zig boundary.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Why C interop is first-class

**What you see in brownfield plans:** call existing C, implement new pieces in Zig, export a C-callable API so the rest of the world does not need Zig.

**What it is.** C libraries and ABIs are enormous. Zig treats the boundary as a normal workflow—not a bolted-on FFI dialect.

**Where you use it.** Wrap → replace gradually, without a big-bang rewrite.

### 2. Importing C into Zig (0.16: translate in `build.zig`)

**What you see on Zig 0.16 (preferred):** a small C header aggregated for translation, a `b.addTranslateC` step in `build.zig`, and Zig code that `@import`s the resulting module—not `@cImport` sprinkled through business logic.

```c
/* src/c.h — aggregate what you need translated */
#include <sqlite3.h>
```

```zig
// build.zig — illustrative shape from the 0.16 upgrade guide
const translate_c = b.addTranslateC(.{
    .root_source_file = b.path("src/c.h"),
    .target = target,
    .optimize = optimize,
});
// linkSystemLibrary / include paths as needed on translate_c / the exe

const exe = b.addExecutable(.{
    .name = "tool",
    .root_module = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
        .imports = &.{
            .{ .name = "c", .module = translate_c.createModule() },
        },
    }),
});
```

```zig
// main.zig / thin wrapper
const c = @import("c");

pub fn open(path: [:0]const u8) !*c.sqlite3 {
    var db: ?*c.sqlite3 = null;
    if (c.sqlite3_open(path.ptr, &db) != c.SQLITE_OK) return error.OpenFailed;
    return db.?;
}
```

**What it is.** C translation is moving into the **build system**. On **0.16**, `@cImport` / `@cInclude` still exist but are **deprecated**—new work should use `addTranslateC` (or the official translate-c package for more customization). Translation still has limits (macros, hostile headers).

**Where you use it.** Isolate the C surface in one module graph edge; expose a smaller, safer Zig API to the rest of the tree.

**Brownfield note:** Older trees may still show:

```zig
const c = @cImport({
    @cInclude("sqlite3.h");
});
```

Treat that as legacy to migrate when you bump to 0.16—not as the pattern to copy into new code.

### 3. Exporting Zig to C

**What you see:**

```zig
export fn tool_version() u32 {
    return 1;
}

export fn tool_hash(ptr: [*]const u8, len: usize) u64 {
    const bytes = ptr[0..len];
    _ = bytes;
    return 0;
}
```

**What it is.** With `export` and the right calling convention, Zig becomes callable from C—the gradual rewrite valve.

**Where you use it.** Keep a `.so` / `.a` contract stable while the implementation becomes Zig. Verify critical symbols (`nm` and friends) in CI when ABI is a product.

### 4. ABI honesty at the edge

**What you see that stays honest:**

```zig
/// Caller must free with `tool_free`.
export fn tool_dup(ptr: [*]const u8, len: usize) ?[*]u8 {
    _ = ptr;
    _ = len;
    return null; // illustrative
}

export fn tool_free(ptr: ?[*]u8) void {
    _ = ptr;
}
```

| Concern | Habit |
|---------|-------|
| **Struct layout** | Explicit `extern` / layout—don’t guess |
| **Pointers vs slices** | Convert at the boundary; slices inside Zig |
| **Strings** | Sentinel C strings at the edge; `[]const u8` inside |
| **Errors** | Map to errno/return codes at the edge |
| **Ownership** | Document who allocates and who frees—every time |

### 5. `zig cc` and mixed builds

**What you see in `build.zig`:** C sources, include paths, link libraries, and (on 0.16) **translate-c** steps declared next to Zig artifacts (chapter **12**).

**What it is.** One toolchain for mixed trees.

**Where you use it.** Put flags in the build file—tribal `CFLAGS` in a shell profile are not a build system.

---

## 2. Advanced concepts

### 1. Trust boundaries

```zig
// Safe Zig modes do NOT sanitize this C call:
const rc = c.dangerous_parse(user_buf.ptr, user_buf.len);
_ = rc;
```

A buggy C library can corrupt memory regardless of careful Zig. State trust: internal / vendor / audited / sandboxed.

### 2. libc vs freestanding

Linking libc vs freestanding changes available APIs (chapter **02**). Assuming POSIX everywhere is a classic cross-compile footgun.

### 3. Gradual rewrite that works

1. Wrap C behind a Zig module (via translate-c / thin `extern`s).
2. Add tests at the ABI.
3. Reimplement behind the same exports.
4. Shrink C surface over time.

### 4. Security review at the boundary

Focus on buffer lengths, ownership of returned pointers, error mapping, and whether ReleaseFast Zig + unsafe C is acceptable for the threat model (chapter **15**).

---

## 3. Applications and use cases

| Angle | Interop role |
|-------|--------------|
| **Application** | Use mature C libraries without leaving Zig |
| **Systems** | Ship a `.so` with a stable C ABI implemented in Zig |
| **Security** | Shrink unsafe C over time; audit what remains |
| **Ops** | Symbol stability checks in release pipelines |
| **SE** | One wrapper-module + `addTranslateC` pattern for the org |

**Whole-engineering picture:** interop is how Zig joins the existing world instead of demanding a greenfield planet.

---

## 4. Staff-level review checklist

- New 0.16 code uses `addTranslateC` (or documented equivalent)—not new `@cImport` islands.
- C surface is isolated to wrapper modules / one import name.
- Ownership and free rules are written at every boundary function.
- Extern layouts for shared structs are explicit and tested.
- Exported symbols that are product API are smoke-tested from C or another FFI caller.
- Trust level of C dependencies is stated (internal / vendor / untrusted).

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [0.16.0 release notes — @cImport → build system](https://ziglang.org/download/0.16.0/release-notes.html)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
- [C/C++ track](../C-C++/README.md)
