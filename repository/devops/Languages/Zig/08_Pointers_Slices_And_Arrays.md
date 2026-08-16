# Pointers, slices, and arrays

[← Back to Zig](./README.md)

## What this chapter covers

How Zig shows **addresses and contiguous bytes** in source: arrays, pointers, slices. Most serious bugs live here and in allocators (chapter **09**).

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Arrays: length in the type

**What you see:**

```zig
var buf: [4]u8 = .{ 1, 2, 3, 4 };
buf[0] = 9;
```

**What it is.** Fixed length `N` of type `T`. Length is part of the type (`[4]u8` ≠ `[8]u8`).

**Where you use it.** Small fixed buffers, headers, stack scratch space.

### 2. Slices: pointer + length (everyday API)

**What you see:**

```zig
fn sum(bytes: []const u8) u64 {
    var total: u64 = 0;
    for (bytes) |b| total += b;
    return total;
}

test "sum" {
    const data = [_]u8{ 1, 2, 3 };
    try std.testing.expect(sum(data[0..]) == 6);
}
```

**What it is.** A slice `[]T` is **pointer + length** (`bytes.len`). Prefer slices in APIs so bounds are visible.

**Where you use it.** Almost all “buffer in, buffer out” functions. `[]const u8` is the workhorse for read-only bytes/strings.

### 3. Pointers: say the kind aloud

**What you see:**

```zig
fn bump(p: *i32) void {
    p.* += 1;
}

test "bump" {
    var x: i32 = 10;
    bump(&x);
    try std.testing.expect(x == 11);
}
```

**What it is.** `*T` points to one `T`. Other pointer forms exist (many-item, optional, sentinel-terminated—see advanced). **Read the type aloud before dereferencing.**

**Where you use it.** Mutation in place, optional out-params, C interop (chapter **14**). Prefer slices when you have a length.

### 4. Strings as bytes

**What you see:**

```zig
const greeting: []const u8 = "hello";
// greeting.len == 5
```

**What it is.** Text is usually UTF-8 bytes in a slice—not a heavy built-in string class. C string sentinels appear at FFI edges.

**Where you use it.** All text handling inside Zig; convert to/from `[:0]const u8` style forms at C boundaries.

### 5. Bounds are your job (modes help)

**What you see that traps in Debug:**

```zig
test "oob traps in safe modes" {
    var xs = [_]u8{ 1, 2, 3 };
    // xs[3] is illegal — Debug/ReleaseSafe typically panic
    _ = xs;
}
```

**What it is.** Out-of-bounds is illegal behavior. Safe modes catch more; ReleaseFast may not babysit (chapters **02**, **15**).

**Where you use it.** Untrusted input parsers—test in the mode you ship.

---

## 2. Advanced concepts

### 1. Sentinel slices (C strings)

**What you see:**

```zig
fn needsCString(path: [:0]const u8) void {
    _ = path;
}

test "sentinel" {
    needsCString("tmp.txt"); // string literal can coerce to sentinel form
}
```

**What it is.** Length plus a guaranteed terminator. Slicing to a sentinel form **asserts** the sentinel is present—wrong data is safety-checked IB in safe modes.

**Where you use it.** libc calls; keep ordinary `[]const u8` inside Zig.

### 2. `volatile` for MMIO—not races

```zig
const mmio: *volatile u32 = @ptrFromInt(0x4000_0000); // illustrative
_ = mmio;
```

**What it is.** Loads/stores may have hardware side effects. **Not** a concurrency fix (chapter **19**).

### 3. `@ptrCast` is a sharp claim

```zig
fn asBytes(p: *u32) []u8 {
    // illustrative — prefer safer patterns; localize real casts
    return std.mem.asBytes(p);
}
```

**What it is.** Reinterpretation can create subtle illegal behavior if wrong. Prefer std helpers when they exist; localize casts; test them.

### 4. Lifetime: pointers do not extend life

```zig
fn bad() []const u8 {
    var local = [_]u8{ 'x', 'y' };
    return local[0..]; // dangling — do not do this
}
```

**What it is.** Same rule as C: stack dies when the frame dies. Tie buffers to callers’ allocators/arenas (chapter **09**).

---

## 3. Applications and use cases

| Angle | What you write |
|-------|----------------|
| **Application** | APIs take `[]const u8` / `[]u8`, not mystery pointers |
| **Systems** | Zero-copy parse with explicit lifetimes |
| **Security** | Bounds + lifetime review on untrusted bytes |
| **Ops** | Debug traps on OOB in CI |
| **SE** | Slice-first API guidelines |

**Whole-engineering picture:** slices make lengths visible—use that in every review.

---

## 4. Staff-level review checklist

- Public APIs prefer slices when length is known.
- No returning slices/pointers to stack memory.
- Const correctness matches read vs mutate.
- Sentinel conversions localized at FFI.
- `@ptrCast` / `volatile` justified and tested.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
