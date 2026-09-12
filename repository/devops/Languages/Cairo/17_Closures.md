# Cairo — Closures

[← Cairo README](./README.md)

**Closures** are anonymous functions that can capture variables from their enclosing scope. They are useful for one-off logic, callbacks, and passing behavior into iterators or other APIs. This topic covers closure syntax, capture modes, and using closures as values.

---

## Closure syntax

Closures use **\|args| body** or **\|args| { statements }**. They can be assigned to variables or passed to functions. The compiler infers parameter and return types when not specified.

```cairo
let add_one = |x| x + 1;
let add = |a, b| a + b;
let multi = |x: u32| -> u32 { x * 2 };
```

---

## Capturing the environment

Closures can use variables from the surrounding scope (they “capture” them). They can read (by snapshot or reference) or mutate (when the closure is **ref** and the variable is **mut**). Captured state is part of the closure’s type and lifetime.

---

## Using closures

Pass closures to functions that accept callables (e.g. iterator adapters). Closures that implement the right traits can be stored in structs or returned from functions. For Starknet and core library APIs that accept callbacks, closures are often used to define inline behavior.

---

## Further reading

- [The Cairo Book — Closures](https://www.starknet.io/cairo-book/ch11-01-closures.html)
- [Cairo README](./README.md) — Topic index.
