# Variables, const, and undefined

[← Back to Zig](./README.md)

## What this chapter covers

How Zig binds names to values: **`const` vs `var`**, initialization rules, and **`undefined`**—one of the most important practical safety topics in the language. If you only skim one early chapter after hello, make it this one and chapter **09** (allocators).

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. `const` by default, `var` by need

**What you see:**

```zig
const max_retries: u32 = 3; // binding cannot be reassigned
var attempt: u32 = 0; // binding may change

attempt += 1;
// max_retries = 5; // compile error
```

**What it is.** `const` = you cannot reassign the binding. `var` = you can. (Pointed-to data can still be mutable through a pointer even when the binding is `const`—read the type.)

**Where you use it.** Prefer `const` everywhere mutation is unnecessary. When you write `var`, say why in review.

### 2. Initialization is not optional theater

**What you see that the compiler rejects:**

```zig
// var x: i32; // not OK — must initialize or use undefined
var x: i32 = 0;
```

**What it is.** Zig pushes back on “declare now, maybe fill later” without being explicit—that prevents a family of C bugs where an uninitialized read happens on a rare path.

**Where you use it.** Everyday locals. When you truly need a buffer before you fill it, use the honest tool below.

### 3. What `undefined` means (read this twice)

**What you see:**

```zig
var buf: [64]u8 = undefined;
// You must write before any read:
@memset(&buf, 0);
buf[0] = 'A';
```

**What it is.** `undefined` means: **this is not a meaningful value yet**. Reading before overwrite is a bug. In **Debug** / **ReleaseSafe**, Zig may **poison** undefined memory (often described with patterns like `0xaa`) to help catch misuse—a debugging aid, **not** a ReleaseFast correctness guarantee.

English translation:

> “Not meaningful. Reading this would be a bug. I will overwrite it before use—or never read it.”

**Where you use it.** Stack scratch buffers you will fill immediately; never as a substitute for `null` or an error.

### 4. Destructuring

**What you see:**

```zig
const Point = struct { x: i32, y: i32 };

fn demo() void {
    const p: Point = .{ .x = 1, .y = 2 };
    const .{ .x, .y } = p;
    _ = x + y;
}
```

**What it is.** Unpack fields into bindings. Useful for clarity; heavy nesting hides data flow.

**Where you use it.** Simple multi-field unpacks. Prefer readable names over puzzle destructures in systems code.

### 5. How this connects to the rest of Zig

| Idea | Means |
|------|--------|
| `?T` (chapter **06**) | Maybe a value |
| `!T` (chapter **07**) | Failed |
| `undefined` | Not ready / not meaningful yet |

Do not mix those ideas.

---

## 2. Advanced concepts

### 1. Namespace-level (global) variables

```zig
var g_counter: u64 = 0; // smell in libraries — tests become order-dependent

const VERSION: []const u8 = "1.0.0"; // const globals are the less frightening kind
```

Prefer passing context / allocator-bearing structs over mutable globals.

### 2. `comptime var`

```zig
comptime {
    var n: usize = 0;
    n += 1; // compile-time mutation — not runtime var
    _ = n;
}
```

Confusing comptime `var` with runtime `var` produces confusing errors (chapter **10**).

### 3. Struct fields and partial fills

```zig
const Cfg = struct {
    host: []const u8,
    port: u16,
};

// Prefer complete init:
const ok: Cfg = .{ .host = "127.0.0.1", .port = 8080 };

// Leaving fields undefined and filling “most” is a classic footgun.
// Prefer optionals / enums so illegal states are unrepresentable.
```

### 4. Security angle: stale bytes

```zig
fn sendPassword(buf: []u8) void {
    // If only some of buf was written, ReleaseFast may leak stale stack data.
    @memset(buf, 0); // define before send when your threat model requires it
}
```

When you see `= undefined`, ask: **where is the first write, and where is the first read?**

---

## 3. Applications and use cases

| Angle | Why this chapter matters |
|-------|--------------------------|
| **Application** | Clear mutability; fewer accidental state bugs |
| **Systems** | Stack buffers filled before use in parsers |
| **Security** | No undefined reads on paths that influence auth or output |
| **Ops** | Prefer crashes in Debug CI over silent prod corruption |
| **SE** | `const` default; `undefined` requires a fill plan |

**Whole-engineering picture:** initialization discipline is a large fraction of Zig’s practical safety—before you debate allocators.

---

## 4. Staff-level review checklist

- New bindings prefer `const` unless mutation is required and obvious.
- Every `undefined` has a clear fill-before-use story on all paths.
- No reads from undefined buffers on success paths (and none on failure paths that still observe the data).
- Mutable globals are justified in writing or removed.
- Buffers that leave the process are fully defined (or scrubbed per policy).

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
