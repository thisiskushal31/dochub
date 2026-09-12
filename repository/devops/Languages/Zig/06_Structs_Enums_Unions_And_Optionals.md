# Structs, enums, unions, and optionals

[← Back to Zig](./README.md)

## What this chapter covers

How Zig models **data you can see in source**: structs, enums, unions, opaque types, and optionals (`?T`). Goal: illegal states get harder to represent, and “missing” is a type—not a null-pointer rumor.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Structs

**What you see.** A named bundle of fields—often with methods:

```zig
const std = @import("std");

const User = struct {
    id: u64,
    name: []const u8,
    active: bool = true,

    pub fn deactivate(self: *User) void {
        self.active = false;
    }
};

test "user" {
    var u: User = .{ .id = 1, .name = "ada" };
    try std.testing.expect(u.active);
    u.deactivate();
    try std.testing.expect(!u.active);
}
```

**What it is.** Product data with a clear shape. Defaults (`active: bool = true`) show up as “field may be omitted in `\.{}` init.”

**Where you use it.** Config objects, protocol messages, handles that own resources (add `deinit` when heap is involved—chapter **09**).

### 2. Enums

**What you see.** A closed list of names:

```zig
const State = enum {
    idle,
    running,
    failed,
};

fn label(s: State) []const u8 {
    return switch (s) {
        .idle => "idle",
        .running => "running",
        .failed => "failed",
    };
}
```

**What it is.** A state/mode/kind vocabulary. Exhaustive `switch` turns a new tag into a compile error instead of a silent miss (chapter **05**).

**Where you use it.** Job states, parse phases, feature modes—anywhere booleans would allow nonsense combinations.

### 3. Tagged unions (preferred over bare unions)

**What you see.** “This value is one of several shapes,” with a tag you can switch on:

```zig
const Event = union(enum) {
    ping: void,
    message: []const u8,
    code: i32,
};

fn handle(ev: Event) void {
    switch (ev) {
        .ping => {},
        .message => |text| std.debug.print("{s}\n", .{text}),
        .code => |c| std.debug.print("{d}\n", .{c}),
    }
}
```

**What it is.** One active payload at a time, **discriminated** so you do not read the wrong field. Bare (untagged) unions exist but are sharp—accessing the wrong field is illegal behavior.

**Where you use it.** Parsers, message protocols, “result is A or B” designs. Keep C-layout unions at the FFI edge (chapter **14**).

### 4. Optionals (`?T`)

**What you see.** A `?` on a type, and unwrap sites:

```zig
fn findName(id: u64) ?[]const u8 {
    if (id == 0) return null;
    return "known";
}

test "optional" {
    const maybe = findName(1);
    if (maybe) |name| {
        try std.testing.expect(name.len > 0);
    } else {
        try std.testing.expect(false);
    }

    const fallback = findName(0) orelse "anonymous";
    try std.testing.expectEqualStrings("anonymous", fallback);
}
```

**What it is.** Absence as a type: either a `T` or `null`. Call sites must confront missing data—that confrontation is the feature.

**Where you use it.** Lookups, optional config, “not set yet.” Do not use optionals for failures that should be errors (chapter **07**).

### 5. `opaque`

**What you see.** A type you cannot look inside—often behind a pointer:

```zig
const DbConn = opaque {};

extern fn db_open() *DbConn;
extern fn db_close(c: *DbConn) void;
```

**What it is.** Hidden representation—common for C handles.

**Where you use it.** FFI wrappers: expose `*DbConn` safely without letting Zig code poke struct fields that belong to C.

---

## 2. Advanced concepts

### 1. `extern struct` for C layout

**What you see:**

```zig
const CPoint = extern struct {
    x: i32,
    y: i32,
};
```

**What it is.** Layout compatible with C’s expectations (for that target ABI). Default Zig structs are for Zig; `extern` is intentional ABI.

**Where you use it.** Shared headers / C interop (chapter **14**). Guessing layout is how “works on my machine” ships.

### 2. Optional pointers vs slices (read the type aloud)

```zig
const a: ?u32 = null; // maybe a number
const b: ?*u32 = null; // maybe a pointer to a number
const c: []u8 = &[_]u8{}; // pointer + length (chapter 08)
const d: ?[]u8 = null; // maybe a slice
```

**Where you use it.** API boundaries. “Optional buffer” should look like `?[]u8` (or a struct), not a raw nullable pointer with a forgotten length.

### 3. Encode illegal states away

**What you see that is fragile:**

```zig
const Flags = struct {
    is_file: bool,
    is_dir: bool, // both true is nonsense
};
```

**What you want instead:**

```zig
const EntryKind = enum { file, dir, symlink };
```

**Where you use it.** Any domain where only some combinations are real.

---

## 3. Applications and use cases

| Angle | What you build |
|-------|----------------|
| **Application** | Config structs + optional fields users leave blank |
| **Systems** | Protocol state enums + tagged message unions |
| **Security** | No sentinel null deciding authorization |
| **Ops** | `extern` structs for stable shared ABI objects |
| **SE** | Exhaustive switches required on public enums |

**Whole-engineering picture:** data modeling is how Zig stays readable under audit—types carry the story.

---

## 4. Staff-level review checklist

- You can point at each `?T` and say why absence is normal (not an error).
- Unions are tagged (or carefully justified) at use sites.
- C-facing structs use `extern` / documented layout.
- Public enums are switched exhaustively at boundaries.
- Structs that own heap memory have an obvious `deinit` or arena story.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig language](https://ziglang.org/)
