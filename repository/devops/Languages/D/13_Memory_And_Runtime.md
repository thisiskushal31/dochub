# D — Memory and runtime

[← D README](./README.md)

D supports **garbage collection** for heap-allocated memory and **manual memory** management when needed. **Floating-point** arithmetic follows IEEE 754. Understanding when the GC runs, how to reduce or avoid it, and how floating point behaves is important for performance and correctness.

**Why both GC and manual?** GC simplifies correctness for most code; manual control is used in low-level or real-time paths. **Why care about floating point?** Numeric code must account for precision, rounding, and special values (NaN, infinity).

---

## Garbage collection

The **GC** manages memory for **new** class instances and dynamic array growth by default. Allocations that are no longer reachable are collected. You can **disable** the GC for a scope, **collect** explicitly, or use **@nogc** to forbid GC allocations in a function. For predictable latency, use **malloc**/ **free**, custom allocators, or **scope**-based storage.

```d
@nogc void criticalPath() { /* no GC allocations */ }
// or
void useCustomAllocator() { auto buf = make!(int[])(myAllocator, 100); }
```

---

## Floating point

**float**, **double**, **real** follow IEEE 754. Operations can produce **NaN** and infinities; **isNaN**, **isInfinity** and similar functions detect them. **Floating-point** comparison should account for tolerance when appropriate. The **floating point** spec chapter details exception handling and rounding.

---

## Memory model recap

**Thread-local** memory is per-thread; **immutable** data is read-only and can be shared; **shared** data requires synchronization. Object lifetime runs from construction to destruction; **scope** and **scope(exit)** help manage resources.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Garbage Collection](https://dlang.org/spec/garbage.html)
- [D spec: Floating Point](https://dlang.org/spec/float.html)
