# Comptime

[← Back to Zig](./README.md)

## What this chapter covers

**Comptime**—Zig’s ability to execute code and manipulate **types** during compilation. This is how Zig does generics, specialization, and “fail before runtime” checks without a separate macro language.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. What “comptime” means in plain language

**What you see:**

```zig
fn max(comptime T: type, a: T, b: T) T {
    return if (a > b) a else b;
}

test "max" {
    try std.testing.expect(max(i32, 3, 7) == 7);
    try std.testing.expect(max(u8, 9, 2) == 9);
}
```

**What it is.** Some values (and **types**) are known while the compiler is still building your program. Zig can **run Zig code** on those values at compile time and specialize/monomorphize as needed.

**Where you use it.** Generic containers, algorithms parameterized by type, and “this config is illegal—fail the build” checks.

### 2. Why teams care

**What you see in stranger code:**

```zig
fn ArrayList(comptime T: type) type {
    return struct {
        items: []T,
        // ...
    };
}
```

**What it is.** A function that **returns a type**—the building block of Zig generics. One language for runtime and compile-time work (unlike C macros or a wholly separate generics dialect).

**Where you use it.** Shared data structures and parsers. Keep type functions **named and boring**, not private puzzles.

### 3. Comptime-known values and branches

**What you see:**

```zig
const builtin = @import("builtin");

fn pageSize() usize {
    return switch (builtin.target.os.tag) {
        .linux => 4096,
        .macos => 16384, // illustrative — verify for your pin/target
        else => 4096,
    };
}
```

**What it is.** Branches on comptime-known facts eliminate dead code at compile time—portable specialization without `#ifdef` soup (chapter **18** for `builtin`).

**Where you use it.** OS/arch differences, feature flags from `zig build -D` (chapter **12**).

### 4. Mental model

> If a question must be answered before the program runs, try to answer it at comptime.

You do not need every reflection builtin on day one—you need that boundary.

---

## 2. Advanced concepts

### 1. Compile-time control flow with build options

```zig
// Conceptual: option wired in build.zig, then:
const enable_metrics = true; // often from @import("config") generated/option

fn tick() void {
    if (comptime enable_metrics) {
        // compiled in only when enabled
    }
}
```

Document every `-D` that changes shipped behavior.

### 2. What cannot be comptime

```zig
fn parseUserInput(input: []const u8) !u32 {
    // input arrives at runtime — cannot be comptime-known
    return std.fmt.parseInt(u32, input, 10);
}
```

Fighting that produces painful compiler errors. Listen: the compiler is naming the boundary.

### 3. Cost: compile time and binary size

Heavy specialization duplicates machine code and can slow CI. Measure when size or minutes matter. Comptime is not free magic.

### 4. Debugging comptime

When comptime fails, read the error carefully—type mismatch or “not comptime-known.” Resist quick fixes that push work to runtime and lose the static guarantee you wanted.

---

## 3. Applications and use cases

| Angle | Comptime role |
|-------|---------------|
| **Application** | Feature flags and config validated at build |
| **Systems** | Target-specific implementations without `#ifdef` spaghetti |
| **Security** | Illegal configurations rejected before deploy |
| **Ops** | Same repo → different artifacts via documented `-D` options |
| **SE** | Clear comptime helpers over copy-paste modules |

**Whole-engineering picture:** comptime moves checks **left**—into `zig build`—where failures are cheap.

---

## 4. Staff-level review checklist

- Comptime code is readable and named; not a puzzle contest.
- Runtime vs comptime boundaries are intentional and documented where non-obvious.
- Build options driving comptime specialization are listed for operators.
- Heavy specialization has a reason (perf, safety, target)—not novelty.
- Public APIs do not require callers to understand private type magic.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
