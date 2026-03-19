# Generics and type system

[← Back to Move](./README.md)

## What are generics?

**Generics** parameterize functions and structs over types chosen at call sites—**parametric polymorphism**. The same `vector` logic works for many element types; the same `Coin<Currency>` pattern can tag currencies at the type level. The **type checker** instantiates and checks each use separately.

## Why constraints and phantom parameters?

Without constraints, a type parameter **`T`** is assumed to have **no abilities**—you cannot copy, drop, or store **`T`** blindly. **Constraints** (`T: copy`, `T: store + drop`, etc.) tell the compiler what operations are legal.

**Phantom** parameters mark type parameters that exist only for **distinction** at the type level (e.g. different currencies) but should **not** force ability derivation on unused markers—otherwise empty marker structs would need spurious **store** and weaken safety.

## How do you write them?

Function:

```move
fun id<T>(x: T): T { x }
```

Struct with phantom (illustrates type-level tag without field use):

```move
struct Coin<phantom C> has store {
    value: u64
}
```

**Inference** fills many type arguments; when **`T`** appears only in return position you may need an explicit type argument:

```move
let v = vector::empty<u64>();
```

**Ability constraints** on **`T`** unlock operations that would otherwise be illegal—for example **copy**:

```move
fun pair<T: copy>(x: T): (T, T) {
    (copy x, copy x)
}
```

Without **`T: copy`**, **`copy x`** does not type-check.

**Recursion:** structs cannot embed themselves as fields (even with different type args)—keeps layouts finite and serializable.

Link to [Abilities](./5_Abilities.md) for conditional abilities on generic structs.

## Engineering angles

- **Application:** Generic libraries (containers, math) reusable across projects.
- **Systems:** Monomorphized or runtime-instantiated per chain implementation; still verified once per module graph.
- **Security:** Constraints prevent generic code from copying resources accidentally.

---

## Further reading

- [The Move Book — Generics](https://move-language.github.io/move/generics.html)
- [The Move Book — Abilities (generics)](https://move-language.github.io/move/abilities.html)
- [Tuples](https://move-language.github.io/move/tuples.html)
