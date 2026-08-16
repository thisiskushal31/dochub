# Memory and allocators

[← Back to Zig](./README.md)

## What this chapter covers

How Zig makes the **heap visible in source**: pass an allocator, allocate, free, use arenas, catch leaks in tests. This is the daily practice behind “no hidden allocations.”

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Allocators appear in signatures

**What you see:**

```zig
fn copyName(allocator: std.mem.Allocator, name: []const u8) ![]u8 {
    return try allocator.dupe(u8, name);
}
```

**What it is.** A function that needs the heap **advertises** it. You choose which allocator; you own the lifetime strategy.

**Where you use it.** Any library API that returns owned memory or builds growable structures.

### 2. Allocate + `defer` free (success path)

**What you see:**

```zig
pub fn main() !void {
    // Zig 0.16: DebugAllocator replaced GeneralPurposeAllocator (old name is gone).
    var gpa: std.heap.DebugAllocator(.{}) = .init;
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const buf = try allocator.alloc(u8, 64);
    defer allocator.free(buf);

    @memset(buf, 0);
    buf[0] = 'Z';
}
```

**What it is.** Pair every successful allocate with a release. `defer` keeps free next to alloc (chapter **05**). `DebugAllocator` is the leak-checking everyday choice in Debug/ReleaseSafe. For multi-threaded **ReleaseFast**, many projects switch to `std.heap.smp_allocator` (no per-instance `deinit`—see your pin’s std docs).

**Where you use it.** Request handlers, CLI tools, short-lived buffers.

### 3. `errdefer` when construction can fail midway

**What you see:**

```zig
const Pair = struct {
    a: []u8,
    b: []u8,

    fn create(allocator: std.mem.Allocator) !Pair {
        const a = try allocator.alloc(u8, 8);
        errdefer allocator.free(a);
        const b = try allocator.alloc(u8, 8);
        errdefer allocator.free(b);
        return .{ .a = a, .b = b };
    }

    fn deinit(self: Pair, allocator: std.mem.Allocator) void {
        allocator.free(self.a);
        allocator.free(self.b);
    }
};
```

**What it is.** On error return, free what already succeeded; on success, caller calls `deinit`.

**Where you use it.** Structs that own multiple allocations.

### 4. Arenas: allocate many, free once

**What you see:**

```zig
fn parseAll(allocator: std.mem.Allocator, input: []const u8) !void {
    var arena = std.heap.ArenaAllocator.init(allocator);
    defer arena.deinit(); // frees everything from this arena
    const a = arena.allocator();

    _ = try a.dupe(u8, input);
    _ = try a.alloc(u8, 128);
    // no per-object free
}
```

**What it is.** Lifetime = the arena. Great for parsers and per-request work.

**Where you use it.** “This request’s temporary graph,” compile-like jobs, batch parsers.

### 5. Testing allocator catches leaks

**What you see:**

```zig
test "dupe frees" {
    const allocator = std.testing.allocator;
    const copy = try allocator.dupe(u8, "zig");
    defer allocator.free(copy);
    try std.testing.expectEqualStrings("zig", copy);
}
```

**What it is.** Tests fail if you forget to free (chapter **13**).

**Where you use it.** Default for unit tests that touch the heap.

---

## 2. Advanced concepts

### 1. Who owns a returned slice?

```zig
/// Caller owns the returned memory and must free with `allocator`.
pub fn copyUpper(allocator: std.mem.Allocator, name: []const u8) ![]u8 {
    return try allocator.dupe(u8, name);
}
```

**Document ownership in `///`.** Ambiguous returns are review defects.

### 2. Growable lists pass the allocator (0.16)

On **0.16**, `std.ArrayList` is typically allocator-less at rest: start from `.empty` and pass the allocator into methods that allocate (`append`, `deinit`, …). Older “managed” forms may still appear in brownfield—prefer the pin’s current docs over blog posts from earlier minors.

### 3. OutOfMemory is an error

```zig
const buf = allocator.alloc(u8, huge) catch return error.OutOfMemory;
```

Decide per program: propagate, fail the request, or abort. Document it.

### 4. Prefer parameters over secret globals

```zig
// smell in libraries
var global_allocator: std.mem.Allocator = undefined;

// better
fn work(allocator: std.mem.Allocator) !void {
    _ = allocator;
}
```

Globals make embedding and tests painful.

---

## 3. Applications and use cases

| Angle | What you do |
|-------|-------------|
| **Application** | Owned strings/buffers with clear `deinit` |
| **Systems** | Arena-per-request servers |
| **Security** | Leak/UAF review with testing allocator |
| **Ops** | Memory cliffs tied to known lifetimes |
| **SE** | PR question: “Who frees this?” always answered |

**Whole-engineering picture:** allocator parameters are compile-time documentation of heap policy.

---

## 4. Staff-level review checklist

- Heap APIs take an allocator (or documented arena/context).
- Every success alloc has free/deinit; error paths use `errdefer`.
- Tests use `std.testing.allocator` where practical.
- Returned owned memory documents who frees.
- No silent global allocators in reusable libraries.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
