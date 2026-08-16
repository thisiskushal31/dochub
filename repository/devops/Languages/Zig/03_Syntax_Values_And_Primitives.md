# Syntax, values, and primitives

[← Back to Zig](./README.md)

## What this chapter covers

How Zig text looks when you open a stranger’s file: comments, imports, identifiers, literals, and the **primitive type** vocabulary. This is the “read the leaves of the language” chapter. Variables and `undefined` deepen in **04**; structs and optionals in **06**.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Comments are for humans (and docs tooling)

**What you see:**

```zig
//! Module: parses a tiny config format.

const std = @import("std");

/// Returns true if `c` is an ASCII digit.
pub fn isDigit(c: u8) bool {
    return c >= '0' and c <= '9';
}

// Temporary note for humans — not attached to a declaration
```

**What it is.** `//` is an ordinary line comment. `///` documents the **next** declaration. `//!` documents the **module** (file).

**Where you use it.** Every `pub` API you expect teammates to call. In review, a `pub` function with no `///` is incomplete—not “self-documenting.”

### 2. Files, namespaces, and `@import`

**What you see at the top of almost every file:**

```zig
const std = @import("std");
const builtin = @import("builtin");
const root = @import("root"); // sometimes — depends on project wiring
```

**What it is.** A `.zig` file is a module. `@import("std")` pulls in the standard library. Your own modules come through the build system’s module graph (chapters **11–12**)—not by hoping relative paths behave like every other language.

**Where you use it.** When you open unfamiliar Zig, **list the `@import` lines first**. That list is the file’s dependency story.

### 3. Values and primitive types

**What you see:**

```zig
const signed: i32 = -1;
const bits: u64 = 0xffff_ffff;
const flag: bool = true;
const nothing: void = {};
const tiny: u7 = 127; // arbitrary bit-width — legal Zig
```

**What it is.** Zig is explicit about **width** and **signedness**. Arbitrary bit-widths (`u7`, `i3`, `u1`, …) are first-class—useful for packed formats and hardware, not only “use i32 everywhere.” Floats are IEEE families (`f32`, `f64`, …). Some values start as **comptime** (e.g. integer literals as `comptime_int`) until coerced—chapter **10**.

**Where you use it.** Protocol fields, file formats, C ABI edges. Ask: *is this width part of an external contract?* Chapter **[18](./18_Builtins_Casting_And_Compile_Variables.md)** covers `@as` and casts.

### 4. Literals, strings, and arithmetic that can trap

**What you see:**

```zig
const million = 1_000_000;
const greeting: []const u8 = "hello";
const poem =
    \\line one
    \\line two
;

// Ordinary ops: overflow is illegal behavior (traps in Debug/ReleaseSafe)
const a: u8 = 200;
const b: u8 = 100;
// const bad = a + b; // overflow → panic in safe modes

const wrapped: u8 = a +% b; // wrapping
const sat: u8 = a +| b; // saturating
```

**What it is.** Underscores are visual separators. Strings are bytes (`[]const u8` in real APIs—chapter **08**). Ordinary `+`/`-`/`*` treat overflow as **illegal**; `+%` wraps; `+|` saturates.

**Where you use it.** Checksums and modular math → wrapping. “This must not wrap” → ordinary ops and treat overflow as a bug. Money → not floats without a deliberate design.

### 5. Expressions and operators

**What you see:**

```zig
fn maskReady(flags: u32, bit: u5) bool {
    return (flags & (@as(u32, 1) << bit)) != 0;
}
```

**What it is.** Arithmetic, bitwise, comparison, and boolean operators will feel familiar if you know C. Prefer clarity over clever chains.

**Where you use it.** At ABI/protocol boundaries, prefer **named casts** and explicit widths over “it compiled, ship it.”

---

## 2. Advanced concepts

### 1. Why explicit widths matter

```zig
// Wire protocol: length is always 32-bit little-endian
fn readLen(buf: *const [4]u8) u32 {
    return std.mem.readInt(u32, buf, .little);
}
```

`int` folklore from other languages does not travel. Staff review: **is this width part of an external contract?**

### 2. Casting is intentional

```zig
const n: i64 = 42;
const as_u32: u32 = @intCast(n); // claim: n fits in u32
const forced: u32 = @as(u32, 7);
```

Friction is useful. Document sharp casts near parsers (chapter **18**).

### 3. Vectors (SIMD literacy)

```zig
const V = @Vector(4, f32);
const a: V = .{ 1, 2, 3, 4 };
const b: V = @splat(2);
const c = a * b; // element-wise when the target supports it
_ = c;
```

**What it is.** Parallel numeric kernels—not everyday business structs. Prefer clarity first; measure before vectorizing (chapter **19**).

### 4. `zig fmt` and reading a stranger file

```bash
zig fmt .
```

Before debating architecture: read `//!`, list imports, skim `pub`, note integer widths and wrapping ops, *then* dive into bodies.

---

## 3. Applications and use cases

| Angle | Why primitives matter |
|-------|----------------------|
| **Application** | Clear types in APIs so callers know what they pass |
| **Systems** | Wire and ABI widths that match the real protocol |
| **Security** | Truncation, sign bugs, silent wrap—pick overflow ops deliberately |
| **Ops** | Formatted trees make diffs reviewable |
| **SE** | Doc comments on `pub` as the minimum documentation bar |

**Whole-engineering picture:** primitive honesty prevents a large class of FFI and protocol bugs before pointers enter the chat.

---

## 4. Staff-level review checklist

- Public APIs use clear widths at boundaries (`u32`/`u64`/…), not vague habits.
- Overflow intent is explicit: ordinary ops vs `+%` / `+|` families.
- `pub` declarations have doc comments when they are product API.
- `zig fmt` is clean in CI.
- Casts at protocol edges are explicit and intentional.
- Imports are minimal and understandable.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [ziglang/zig on GitHub](https://github.com/ziglang/zig)
