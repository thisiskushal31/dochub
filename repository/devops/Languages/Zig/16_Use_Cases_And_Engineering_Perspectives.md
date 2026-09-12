# Use cases and engineering perspectives

[← Back to Zig](./README.md)

## What this chapter covers

Where Zig shows up in real work, what “done” looks like by role, how to talk about adoption without confusing **Zig the language** with **products built in Zig**, and when another language is the better hammer.

**Lens:** what you see on the job → what Zig is for → where you’ll actually use it.

---

## 1. Concepts

### 1. Typical homes for Zig

**What you see in the wild:** CLIs, C-ABI `.so` wrappers, cross-compiled agents, performance-sensitive libs—work that used to default to C.

**What it is.** Zig thrives where C historically lived, with better defaults for errors, allocators, and tooling.

**Where you use it:**

| Domain | Why Zig fits |
|--------|--------------|
| **CLIs and developer tools** | Native speed, clear control, single toolchain |
| **Libraries with a C ABI** | Implement in Zig, export stable C for everyone else |
| **Performance-sensitive components** | Explicit allocators and low-level control |
| **Infra agents / utilities** | Cross-compile to fleet targets as a normal workflow |
| **Systems teaching & discipline** | Errors and allocators make ownership discussable |

If your problem is primarily “CRUD web app with a huge hiring pool,” Zig is usually the wrong first choice. If your problem is “replace this C tool without losing ABI,” Zig is often exactly the conversation to have.

### 2. Role lenses (same repo, different questions)

| Role | Primary questions |
|------|-------------------|
| **Engineer** | Can we express the system clearly? Are lifetimes obvious? |
| **Security** | Mode? FFI trust? Parser tests? |
| **Ops** | Pin, target, reproducible `zig build`? |
| **SE** | Ramp cost vs C/Rust? Who maintains the pin? |

A healthy Zig adoption answers all four—not only the engineer’s excitement.

### 3. Famous consumers are not the curriculum

Projects like **Bun** prove Zig can power large products. That is inspiring and sometimes educational. It is not a substitute for learning allocators, error sets, and build modes. “We use Bun” ≠ “we know Zig.”

### 4. What you can do after this track (honest “done”)

**What “done” looks like in the repo:**

```bash
zig version          # matches pin
zig build            # one documented entrypoint
zig build test       # gates merges
```

| Done means… | Evidence |
|-------------|----------|
| Ship a small tool | Pin + `build.zig` + tests |
| Handle failure visibly | Error sets + `try` / no empty catches |
| Own memory | Allocator parameters + deinit/arena story |
| Touch C safely | Wrapper module + ownership docs |
| Release consciously | Mode/target logged; Fast justified if used |

---

## 2. Advanced concepts

### 1. Polyglot estates are normal

Zig beside C, Rust, and Go is common. Success depends on **ABI boundaries** and **build ownership**, not on forcing one language everywhere.

### 2. Hiring and ramp

“Knows Zig” should mean: can explain modes, allocators, errors, and C interop—not only hello world. Budget training time. If hiring is the bottleneck, C/Rust may still win even when Zig is technically pleasant.

### 3. Migration patterns that don’t burn the team

Wrap C → test ABI → reimplement behind exports → shrink C. Big-bang rewrites are how Zig pilots die.

### 4. Cost of chasing `master`

Zig evolves. Product teams pin (0.16.x here). Libraries may track newer. Align explicitly or enjoy surprise breakage.

### 5. When Zig is the wrong hammer

| Situation | Prefer |
|-----------|--------|
| Need borrow-checker proofs in safe code | Rust |
| Soft enterprise app domain with GC culture | Higher-level stacks |
| Team has no systems background and no training plan | Ramp will dominate benefits |
| Ecosystem critical library only exists elsewhere | Call it via C ABI or use that language |

---

## 3. Applications and use cases

| Angle | Example of good Zig use |
|-------|-------------------------|
| **Application** | A CLI shipped with `zig build` and ReleaseSafe |
| **Systems** | Cross-compiled agent for multiple arches |
| **Security** | Parser in Safe mode with failure-path tests |
| **Ops** | Builder image with pinned Zig and logged targets |
| **SE** | Written Zig vs C vs Rust decision for the component |

**Whole-engineering picture:** Zig succeeds when the team wants **C-shaped control** with modern tooling—and commits to pins, modes, and tests.

---

## 4. Staff-level review checklist

- Use case matches systems strengths (not a random rewrite).
- Language skill is not confused with “we depend on a Zig-built product.”
- Adoption includes pin + mode + test policy from day one.
- Exit criteria versus C/Rust are written if this is a pilot.
- Ownership of `build.zig` and upgrades is assigned.

---

## References

- [Zig language](https://ziglang.org/)
- [Learn Zig (official)](https://ziglang.org/learn/)
- [Zig 0.16.0 language reference](https://ziglang.org/documentation/0.16.0/)
- [This track README](./README.md)
- [C/C++ track](../C-C++/README.md)
- [Rust track](../Rust/README.md)
