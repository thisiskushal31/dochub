# Testing

[← Back to Zig](./README.md)

## What this chapter covers

How Zig expects you to **prove** code: `test` blocks, `zig test`, testing allocators and leak reports, and CI habits that make Debug/ReleaseSafe worth something.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Tests live in the language

**What you see:**

```zig
const std = @import("std");

fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "addition works" {
    try std.testing.expect(add(1, 1) == 2);
}
```

```bash
zig test math.zig
# or, in a real project:
zig build test
```

**What it is.** Tests are ordinary declarations next to code. `zig test` / a `test` build step compiles and runs them.

**Where you use it.** Every module that can regress. Keeping tests beside code reduces “we’ll test later” drift.

### 2. Assert what you mean

**What you see:**

```zig
test "parse ok" {
    const n = try std.fmt.parseInt(u32, "42", 10);
    try std.testing.expectEqual(@as(u32, 42), n);
}

test "parse fails" {
    try std.testing.expectError(error.InvalidCharacter, std.fmt.parseInt(u32, "x", 10));
}
```

**What it is.** Standard helpers for equality, errors, and optionals. A failing test should tell a human what was expected—not an opaque `expect(false)` pyramid.

**Where you use it.** Unit tests for parsers, config, and any `!T` API (chapter **07**).

### 3. Include failure paths

**What you see that is incomplete:**

```zig
test "only happy path" {
    const n = try parsePort("8080");
    try std.testing.expect(n == 8080);
    // never forces bad input → incomplete
}
```

**What you should also see:**

```zig
test "reject empty" {
    try std.testing.expectError(error.InvalidPort, parsePort(""));
}
```

**Where you use it.** Any fallible function. Happy-path-only CI makes production the test environment.

### 4. Testing allocator and leaks

**What you see:**

```zig
test "dupe frees" {
    const allocator = std.testing.allocator;
    const copy = try allocator.dupe(u8, "zig");
    defer allocator.free(copy);
    try std.testing.expectEqualStrings("zig", copy);
}
```

**What it is.** The testing allocator fails the run if you leak (chapter **09**).

**Where you use it.** Default for unit tests that touch the heap.

### 5. What “done” means for a change

| Layer | Question |
|-------|----------|
| Unit | Does this function behave—including errors? |
| Build | Does `zig build test` gate merges? |
| Target | Do we test the triple we ship? |
| Integration | Real filesystem/network behind explicit flags? |

---

## 2. Advanced concepts

### 1. Tests under different modes

```bash
zig build test -Doptimize=Debug
zig build test -Doptimize=ReleaseSafe
# Critical paths: also exercise the mode you ship (ReleaseFast if that is prod)
```

A bug that traps in Debug may misbehave in ReleaseFast (chapters **02**, **15**).

### 2. Skipping vs lying

```zig
const builtin = @import("builtin");

test "linux only" {
    if (builtin.target.os.tag != .linux) return error.SkipZigTest;
    // ...
}
```

Skip unsupported targets deliberately. Do not skip the target you actually deploy.

### 3. Determinism

Inject clocks, seeds, and fake I/O. “Sometimes fails on CI” is a defect—own it.

---

## 3. Applications and use cases

| Angle | Testing role |
|-------|--------------|
| **Application** | Regressions blocked before users see them |
| **Systems** | Matrix tests across release targets |
| **Security** | Error-path and alloc-fail tests on parsers |
| **Ops** | CI red means stop—not “retry until green” |
| **SE** | Tests as onboarding documents for behavior |

**Whole-engineering picture:** tests make Zig’s safe modes useful—bugs die in CI instead of in production telemetry.

---

## 4. Staff-level review checklist

- New fallible logic includes failure-path tests, not only success.
- CI runs tests on the target set you ship.
- Leak reports are treated as failures, not noise.
- Flaky tests have owners and timelines.
- Release mode policy is reflected in at least some CI configurations for critical paths.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
