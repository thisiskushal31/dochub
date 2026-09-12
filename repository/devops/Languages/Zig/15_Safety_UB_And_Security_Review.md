# Safety, illegal behavior, and security review

[← Back to Zig](./README.md)

## What this chapter covers

What Zig actually promises about safety—and what it does not. **Illegal behavior**, build modes, `undefined`, bounds, FFI trust, and a practical **security review** habit. Defense and review only: no exploit recipes.

**Lens:** what you see → what it means → where you use it.

---

## 1. Concepts

### 1. Illegal behavior is real—and comes in two flavors

**What you see that is illegal if it happens at runtime:**

```zig
var xs = [_]u8{ 1, 2, 3 };
// xs[3] = 9; // out-of-bounds — illegal behavior

const a: u8 = 200;
const b: u8 = 100;
// const c = a + b; // overflow on ordinary + — illegal behavior

fn digit(d: u8) u8 {
    return switch (d) {
        0...9 => d,
        else => unreachable, // illegal if reached
    };
}
_ = digit;
```

**What it is.** **Illegal behavior (IB)** catalogued in the language reference. Detected at compile time → compile error. Otherwise:

| Kind | Meaning |
|------|---------|
| **Safety-checked IB** | Runtime checks in safe modes; failure → panic/trap |
| **Unchecked IB** | No inserted check; anything may happen if invoked |

**ReleaseFast** / **ReleaseSmall** disable safety checks by default—so safety-checked IB then behaves like unchecked IB.

> Safety is partly a **build mode**, not only a type system slogan.

**Where you use it.** Choose Debug/ReleaseSafe for development and high-risk surfaces; treat Fast as a product decision with tests (chapter **02**).

### 2. Zig is not “safe Rust by default”

**What you see in marketing vs code review:** Rust’s safe subset aims to reject whole bug classes via ownership. Zig aims for **explicit, toolable** systems code with runtime checks you can keep on.

**Where you use it.** Set expectations in design docs so nobody ships Fast parsers “because Zig is safe.”

### 3. Review pillars (use on every serious PR)

| Pillar | What you look for in the diff |
|--------|-------------------------------|
| **Mode** | What mode ships? Why? |
| **Memory** | Who allocates/frees? Any `undefined` reads? |
| **Pointers/slices** | Bounds and lifetimes clear? |
| **Errors** | Failures swallowed? Fail closed on auth? |
| **FFI** | What C do we trust? Ownership at the edge? |
| **Panic** | Bug path vs expected failure misclassified? |

**Example of a review smell:**

```zig
const user = loadUser(id) catch null; // smell if null means “deny” was lost
// empty catch {} or wrong catch that hides auth failure is a defect
_ = user;
```

Prefer fail-closed:

```zig
const user = try loadUser(id);
```

### 4. Secrets and toolchain supply chain

Native binaries still leak secrets if you embed them. Pin Zig; verify official downloads per policy.

---

## 2. Advanced concepts

### 1. Mode policy by surface

```bash
# Illustrative CI matrix
zig build test -Doptimize=Debug
zig build test -Doptimize=ReleaseSafe
# Production Fast only with named owner + fuzz/tests on parsers
```

| Surface | Practical policy |
|---------|------------------|
| Internal developer CLI | ReleaseSafe or Fast with strong tests |
| Parsers of untrusted input | Prefer Safe + tests/fuzz |
| Size-critical firmware | ReleaseSmall + extra device tests |

### 2. `undefined` and data exposure

```zig
var buf: [64]u8 = undefined;
@memset(&buf, 0); // define before any path that sends buf off-box
```

Debug poison helps catch bugs; ReleaseFast may leave stale bytes (chapter **04**).

### 3. `@setRuntimeSafety` (sharp tool)

```zig
fn hotLoop(xs: []u8) void {
    @setRuntimeSafety(false); // document why; compensate with tests
    for (xs) |*x| x.* +%= 1;
}
```

Use sparingly.

### 4. How Zig safety interacts with C

Safe modes in Zig do not sanitize C (chapter **14**). Review the combined system.

---

## 3. Applications and use cases

| Angle | Safety role |
|-------|-------------|
| **Application** | Modes that match the threat model |
| **Systems** | Harden parsers and FFI edges first |
| **Security** | Illegal-behavior literacy in code review |
| **Ops** | Staging with Safe builds; crash telemetry that means something |
| **SE** | Written mode + pin + test policy |

**Whole-engineering picture:** Zig safety is **mode + discipline + tests + boundary trust**—not a sticker on the README.

---

## 4. Staff-level review checklist

- Release mode is named and justified for the component.
- No empty `catch` on security-critical errors.
- Pointer/slice lifetimes reviewed; no undefined reads on sensitive paths.
- C imports have an explicit trust story.
- Toolchain and deps are pinned and verified.
- Tests cover failure paths for parsers and allocation failure where relevant.
- Untrusted input paths have a testing/fuzz story appropriate to risk.

---

## References

- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [Zig downloads](https://ziglang.org/download/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [C/C++ track](../C-C++/README.md)
- [Rust track](../Rust/README.md)
