# Cairo — Advanced features

[← Cairo README](./README.md)

This topic covers advanced language and library features: custom data structures, smart pointers, deref coercion, associated items, operator overloading, hashes, macros, inlining, printing, arithmetic circuits, and oracles. Each section is standalone; use Further reading for deeper detail.

---

## Custom data structures

You can build custom data structures (e.g. trees, graphs, or wrappers) using structs, enums, and generics. When a struct contains a **Felt252Dict**, it cannot derive **Drop**; you must implement or derive **Destruct** so that when the struct goes out of scope, the dictionary is squashed. Recursive or large values are often held in a **Box&lt;T&gt;** to avoid unbounded copy size and to control layout.

---

## Smart pointers (Box)

**Box&lt;T&gt;** is a smart pointer that owns a value of type **T**. The value lives in a dedicated memory segment. Use **Box** when you need to pass or store a large value without copying, or when building recursive types (e.g. a struct that contains another of the same type). Creating a box allocates; dropping it frees the segment.

```cairo
#[derive(Drop)]
struct Node {
    value: u64,
    next: Option<Box<Node>>,
}
```

---

## Deref coercion

Types that implement the **Deref** trait can be **dereferenced** with the **\*** operator to access the inner value. **Deref coercion** lets the compiler automatically convert a type that implements **Deref** into the target type in function arguments or assignments, so you can pass a **Box&lt;T&gt;** where a **T** (or **@T**) is expected and the compiler inserts the dereference.

---

## Associated items

**Associated items** are items (functions, types, constants) declared inside a trait and then implemented per type. **Associated functions** are functions on a trait that do not take **self** (e.g. constructors). **Associated types** let a trait refer to a type that each implementation chooses. They keep the relationship between a trait and its implementors explicit and avoid extra type parameters where one type is uniquely determined by the implementing type.

---

## Operator overloading

Operators such as **+**, **-**, **==**, **&lt;** are defined by traits (e.g. **Add**, **Sub**, **PartialEq**, **PartialOrd**). Implement the corresponding trait for your type to use the operator. The compiler then desugars **a + b** into a call to the trait method.

```cairo
use core::traits::Add;

#[derive(Copy, Drop)]
struct Point { x: u64, y: u64 }

impl PointAdd of Add<Point> {
    fn add(lhs: Point, rhs: Point) -> Point {
        Point { x: lhs.x + rhs.x, y: lhs.y + rhs.y }
    }
}
```

---

## Working with hashes

Cairo and Starknet use several hash and crypto primitives: **Pedersen**, **Poseidon**, **Keccak**, and **ECDSA** (signature verification). These are exposed as **builtins** or via the core library. Use the documented APIs for hashing data, verifying signatures, or building commitments; the exact API depends on the Cairo/Starknet version and whether you are in a contract or a pure program.

---

## Macros

**Declarative macros** (e.g. **println!**, **array!**, **assert!**) are expanded at compile time. They are defined with **macro_rules!** and match on patterns of tokens. Macros can reduce boilerplate and generate repeated code. The **!** in the name indicates a macro invocation, not a normal function.

---

## Procedural macros

**Procedural macros** are written in a separate crate and consume token streams to produce new code. They are used for **derive** (e.g. **#[derive(Drop)]**), **attribute** macros, and **function-like** macros. They run during compilation and allow custom code generation that declarative macros cannot express.

---

## Inlining in Cairo

The **#[inline]** attribute hints that a function should be inlined at call sites. Inlining can improve performance by removing call overhead and enabling further optimizations. Use it for small, hot functions; overuse can increase code size. The compiler may ignore the hint depending on the context.

---

## Printing

**println!** and **format!** format output. Format strings use **{}** for display and **{:?}** for debug (requires the type to implement **Debug**). You can print values in contracts or executables subject to the execution environment; in proofs, printing may be reflected in the output builtin. See the prelude and core library for the full set of formatting traits.

---

## Arithmetic circuits

Cairo programs compile to an **arithmetic circuit** (constraint system) that the prover uses to generate a STARK proof. Understanding that all computation is expressed in field arithmetic helps when optimizing or debugging low-level behavior. Advanced use cases (custom gates, oracles) build on this model.

---

## Offloading computations with oracles

Some computations are expensive or not easily expressed in Cairo. **Oracles** allow the prover to supply non-deterministic inputs (hints) that are then constrained so that the execution is still verifiable. Use oracles when you need to integrate external data or expensive computation while keeping the program provable. Design the constraints so that the verifier does not need to trust the prover beyond the stated relation.

---

## Further reading

- [The Cairo Book — Advanced Cairo Features](https://www.starknet.io/cairo-book/ch12-00-advanced-features.html)
- [The Cairo Book — Custom Data Structures](https://www.starknet.io/cairo-book/ch12-01-custom-data-structures.html)
- [The Cairo Book — Smart Pointers](https://www.starknet.io/cairo-book/ch12-02-smart-pointers.html)
- [The Cairo Book — Operator Overloading](https://www.starknet.io/cairo-book/ch12-03-operator-overloading.html)
- [The Cairo Book — Working with Hashes](https://www.starknet.io/cairo-book/ch12-04-hash.html)
- [The Cairo Book — Macros](https://www.starknet.io/cairo-book/ch12-05-macros.html)
- [The Cairo Book — Inlining](https://www.starknet.io/cairo-book/ch12-06-inlining-in-cairo.html)
- [The Cairo Book — Printing](https://www.starknet.io/cairo-book/ch12-08-printing.html)
- [The Cairo Book — Offloading with Oracles](https://www.starknet.io/cairo-book/ch12-11-offloading-computations-with-oracles.html)
- [Cairo README](./README.md) — Topic index.
