# Control flow, defer, and unreachable

[← Back to Zig](./README.md)

## What this chapter covers

How Zig runs in order: `if`, loops, `switch`, **`defer` / `errdefer`**, and **`unreachable`**. No hidden exceptions—what you read is what runs, including cleanup.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. `if` / loops: ordinary, visible branches

**What you see:**

```zig
fn classify(n: i32) []const u8 {
    if (n < 0) return "neg";
    if (n == 0) return "zero";
    return "pos";
}

fn sumTo(n: u32) u32 {
    var i: u32 = 0;
    var total: u32 = 0;
    while (i < n) : (i += 1) {
        total += i;
    }
    return total;
}

fn sumSlice(xs: []const u32) u32 {
    var total: u32 = 0;
    for (xs) |x| {
        total += x;
    }
    return total;
}
```

**What it is.** Normal control flow. The `while (cond) : (continue_expr)` form runs `continue_expr` each iteration—handy for index bumps.

**Where you use it.** Parsers, retries, batch jobs. Keep bounds obvious on untrusted input (chapter **15**).

### 2. `switch`: state machines you can exhaust

**What you see:**

```zig
const Phase = enum { init, work, done };

fn step(p: Phase) Phase {
    return switch (p) {
        .init => .work,
        .work => .done,
        .done => .done,
    };
}
```

**What it is.** Branch on enums/integers with exhaustiveness checks when the compiler can require them.

**Where you use it.** Protocols, job states, “kind” fields—prefer this over boolean soup (chapter **06**).

### 3. `defer`: cleanup next to acquisition

**What you see:**

```zig
fn withFile(io: std.Io, path: []const u8) !void {
    // Zig 0.16: filesystem APIs live under std.Io (confirm open/close on your pin).
    const file = try std.Io.Dir.cwd().openFile(io, path, .{});
    defer file.close(io); // runs when the function returns—success or error
    // use file ...
}
```

**What it is.** Schedule cleanup for scope exit. Reviewers see open/close together—better than a cleanup call fifty lines below that someone forgot on a new `return`.

**Where you use it.** Files, locks, temporary buffers, anything acquired in a scope.

### 4. `errdefer`: cleanup only on failure

**What you see:**

```zig
fn allocTwo(allocator: std.mem.Allocator) !struct { a: []u8, b: []u8 } {
    const a = try allocator.alloc(u8, 32);
    errdefer allocator.free(a);

    const b = try allocator.alloc(u8, 32);
    errdefer allocator.free(b);

    return .{ .a = a, .b = b };
}
```

**What it is.** Like `defer`, but only if the scope returns an **error**. Success keeps the allocations; failure frees partial work.

**Where you use it.** Constructors and multi-step setup (chapters **07**, **09**).

### 5. `unreachable`: a claim about reality

**What you see:**

```zig
fn digitName(d: u8) []const u8 {
    return switch (d) {
        0 => "zero",
        1 => "one",
        // ...
        9 => "nine",
        else => unreachable, // only legal if d is always 0..9
    };
}
```

**What it is.** “This path cannot happen.” In Debug/ReleaseSafe, hitting it traps. In ReleaseFast, the compiler may optimize as if it never happens—so **lying** is dangerous (chapter **15**).

**Where you use it.** After you’ve truly handled all cases—not to silence the compiler in a hurry.

---

## 2. Advanced concepts

### 1. Defer order (LIFO)

```zig
fn ordered() void {
    defer std.debug.print("second\n", .{});
    defer std.debug.print("first\n", .{});
    // prints: first, then second
}
```

**What it is.** Defers run in reverse registration order—matters for lock/file hierarchies.

### 2. Labeled blocks

```zig
const value: i32 = blk: {
    const x = 10;
    const y = 20;
    break :blk x + y;
};
```

**What it is.** A block that yields a value—useful without inventing a one-off function.

**Where you use it.** Local clarity; avoid puzzles.

### 3. `noreturn`

```zig
fn die() noreturn {
    @panic("fatal");
}
```

**What it is.** Function never returns. Keep it honest.

---

## 3. Applications and use cases

| Angle | What you write |
|-------|----------------|
| **Application** | Clear success/fail paths users can follow |
| **Systems** | Resource cleanup that survives new returns |
| **Security** | Honest `unreachable`; no swallowed auth failures |
| **Ops** | Loud Debug failures while developing |
| **SE** | Exhaustive switches on public enums |

**Whole-engineering picture:** `defer` makes cleanup reviewable; `unreachable` must stay true.

---

## 4. Staff-level review checklist

- Acquired resources have `defer` / `errdefer` in the same scope.
- `unreachable` is truly impossible—or replaced with an error.
- Enum switches at boundaries are exhaustive.
- Defer order is correct for nested resources.
- No empty `catch` hiding failures (chapter **07**).

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
