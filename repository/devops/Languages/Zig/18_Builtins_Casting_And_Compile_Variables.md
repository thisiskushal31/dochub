# Builtins, casting, and compile variables

[← Back to Zig](./README.md)

## What this chapter covers

The `@` vocabulary you will see in real Zig: **builtin functions**, **casting / result types**, and **compile variables** via `@import("builtin")`. Literacy for reading stranger code—not an encyclopedia of every builtin.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Builtins are compiler-provided

**What you see:**

```zig
const std = @import("std");
const T = @TypeOf(std);
_ = T;
```

**What it is.** Names prefixed with `@` are **compiler operations**, not normal package functions. Many parameters must be comptime-known.

**Where you use it.** When you do not recognize a builtin, look it up in the **0.16 language reference**—do not guess.

### 2. Casting and result types

**What you see:**

```zig
const n: i64 = 42;
const as_u32: u32 = @intCast(n); // destination from result type — claim: fits
const labeled: u32 = @as(u32, 7); // explicit result type when context is thin

const p: *align(1) u8 = @ptrCast(@as(*u8, @ptrFromInt(0x1000))); // sharp — localize
_ = p;
```

**What it is.** Casts often infer the destination from **where the result must go**. `@as(T, value)` supplies an explicit result type when needed.

**Where you use it.** Prefer the mildest cast that works. Localize `@ptrCast`. Document sharp casts at protocol edges.

### 3. Compile variables: `@import("builtin")`

**What you see:**

```zig
const builtin = @import("builtin");

test "this file is under zig test" {
    try std.testing.expect(builtin.is_test);
}

fn logOs() void {
    switch (builtin.target.os.tag) {
        .linux => std.log.info("linux", .{}),
        .macos => std.log.info("macos", .{}),
        else => std.log.info("other", .{}),
    }
}
```

**What it is.** Compile-time facts about **this build**: OS/CPU, `is_test`, `single_threaded`, and more as your pin documents.

**Where you use it.** Portable specialization without `#ifdef` soup—keep switches readable (chapter **10**).

### 4. Size, alignment, and type reflection

**What you see:**

```zig
const Point = struct { x: i32, y: i32 };

comptime {
    if (@sizeOf(Point) != 8) @compileError("unexpected Point size");
    if (@alignOf(Point) < 4) @compileError("unexpected Point align");
}
```

**What it is.** Builtins that answer size/align/sameness/field info so you do not invent magic `sizeof` constants—especially next to C ABI (chapter **14**).

**Where you use it.** Layout assertions at compile time; packing checks for wire formats.

### 5. Overflow-aware builtins

**What you see:**

```zig
const result = @addWithOverflow(@as(u8, 200), @as(u8, 100));
// result[0] = wrapped sum, result[1] = overflow bit (exact shape per pin)
_ = result;
```

**What it is.** Detect overflow without trapping—then handle the bit explicitly. Ordinary `+` traps in safe modes; `+%` wraps silently (chapter **03**).

**Where you use it.** Protocols that must report overflow to the caller.

---

## 2. Advanced concepts

### 1. You do not need every builtin

Staff literacy: (1) `@` = compiler surface, (2) cast family, (3) `builtin` module, (4) look up the rest.

On **0.16**, the old `@Type(...)` type-constructor is **gone**—replaced by focused builtins such as `@Int`, `@Struct`, `@Union`, `@Enum`, `@Pointer`, `@Fn`, `@Tuple`, `@EnumLiteral`. If stranger code still shows `@Type`, you are reading a pre-0.16 tree (or need a port).

### 2. `@setRuntimeSafety`

```zig
fn hot(xs: []u8) void {
    @setRuntimeSafety(false);
    for (xs) |*x| x.* +%= 1;
}
```

Document why; compensate with tests (chapter **15**).

### 3. Embed compile-time bytes

```zig
const banner = @embedFile("banner.txt");
```

Often paired with a `build.zig` step that generates the file (chapter **12**). Great for small assets; bad for secrets.

---

## 3. Applications and use cases

| Angle | Builtin / builtin-module role |
|-------|-------------------------------|
| **Application** | `@as` / mild casts at API edges |
| **Systems** | `builtin.target` switches for portable code |
| **Security** | Avoid casual `@ptrCast`; keep safety on unless justified |
| **Ops** | Test-only code gated with `builtin.is_test` |
| **SE** | Style: look up unknown `@` in the pin’s reference |

**Whole-engineering picture:** builtins are how Zig talks to the compiler—read them like operators, not like random library calls.

---

## 4. Staff-level review checklist

- Unknown `@` builtins were looked up for the project’s Zig pin—not guessed.
- `@ptrCast` / alignment / address-space casts are localized and justified.
- `builtin.target` / `is_test` / `single_threaded` branches are readable.
- Overflow either traps (ordinary ops), wraps (`+%`), or is handled (`@addWithOverflow`)—intentionally.
- `@setRuntimeSafety(false)` has a written reason when used.

---

## References

- [Zig 0.16.0 language reference — builtin functions / compile variables](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
