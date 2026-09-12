# Error sets and error handling

[← Back to Zig](./README.md)

## What this chapter covers

How failure looks in Zig source: **error sets**, **`!T`**, **`try`**, **`catch`**, and when to **panic** instead. No hidden exceptions—failure is something you can see in the type and at the call site.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Errors are values you can see in the signature

**What you see.** A return type with `!`:

```zig
fn parseCount(text: []const u8) !u32 {
    return std.fmt.parseInt(u32, text, 10);
}
```

**What it is.** An **error union**: either a `u32` on success or an error. Callers must handle or propagate. Nothing unwinds the stack invisibly.

**Where you use it.** I/O, parsing, allocation, validation—any expected failure.

### 2. Named error sets (public contracts)

**What you see:**

```zig
const AuthError = error{
    InvalidToken,
    Expired,
    Forbidden,
};

fn checkToken(token: []const u8) AuthError!void {
    if (token.len == 0) return error.InvalidToken;
    // ...
}
```

**What it is.** A closed list of failure tags callers can `switch` on. For public APIs, intentional sets beat giant inferred soups.

**Where you use it.** Library boundaries and anything security-sensitive—callers need stable names.

### 3. `try`: keep the happy path straight

**What you see:**

```zig
fn loadConfig(io: std.Io, allocator: std.mem.Allocator, path: []const u8) ![]u8 {
    // Confirmed 0.16 shape from release notes; prefer this over old std.fs helpers.
    return try std.Io.Dir.cwd().readFileAlloc(io, path, allocator, .limited(1024 * 1024));
}
```

**What it is.** “If this is an error, return it now; otherwise unwrap.” Failure points stay visible in the straight-line code.

**Where you use it.** Most fallible call sites inside functions that already return `!T`.

### 4. `catch`: handle here

**What you see (good):**

```zig
const n = parseCount(user_text) catch |err| {
    std.log.err("bad count: {}", .{err});
    return error.InvalidInput;
};
```

**What you see (smell):**

```zig
_ = doAuth() catch {}; // swallowed — usually a defect on critical paths
```

**What it is.** Local recovery, logging, mapping, or defaulting. Empty catches erase information.

**Where you use it.** Boundaries where you can add context, or where a default is truly safe.

### 5. Panic ≠ error

**What you see:**

```zig
fn mustHave(x: ?i32) i32 {
    return x orelse @panic("programmer bug: missing x");
}
```

**What it is.** Panics are for bugs / unrecoverable situations. Missing files in a library should usually be **`error`**, not panic—so callers can recover.

**Where you use it.** Assertions about internal invariants—not expected I/O.

---

## 2. Advanced concepts

### 1. Switch on errors at the edge

```zig
fn run() !void {
    checkToken(token) catch |err| switch (err) {
        error.InvalidToken, error.Expired => return error.Unauthorized,
        error.Forbidden => return error.Forbidden,
    };
}
```

**Where you use it.** HTTP handlers, CLI exit codes, metrics labels—map domain errors once at the edge.

### 2. `errdefer` with fallible construction

```zig
fn makePair(allocator: std.mem.Allocator) !struct { a: []u8, b: []u8 } {
    const a = try allocator.alloc(u8, 8);
    errdefer allocator.free(a);
    const b = try allocator.alloc(u8, 8); // if this fails, a is freed
    errdefer allocator.free(b);
    return .{ .a = a, .b = b };
}
```

**What it is.** Cleanup that runs only when returning an error (chapter **05**, **09**).

**Where you use it.** Constructors that allocate more than once.

### 3. Errors vs optionals

```zig
fn lookup(id: u64) ?User // absence is normal
fn loadUser(id: u64) !User // failure to load is exceptional / I/O
```

Pick one convention per API family. Do not return both `error.NotFound` and `null` for the same idea next door.

### 4. Testing the failure path

```zig
test "parseCount rejects junk" {
    try std.testing.expectError(error.InvalidCharacter, parseCount("nope"));
}
```

If a function returns `!T`, a suite that never sees an error is incomplete (chapter **13**).

---

## 3. Applications and use cases

| Angle | What you do |
|-------|-------------|
| **Application** | Map error tags to user messages |
| **Systems** | Propagate I/O failures with context |
| **Security** | Fail closed; never empty-catch auth |
| **Ops** | Exit codes / metrics from stable tags |
| **SE** | Review error sets like public API |

**Whole-engineering picture:** visible errors replace “check errno if you remember.”

---

## 4. Staff-level review checklist

- Critical paths have no empty `catch`.
- Public `!T` functions use intentional error sets (or a documented broad type).
- Expected I/O failures are errors, not panics.
- Multi-allocate constructors use `errdefer`.
- Tests include at least one failure case for fallible public APIs.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
