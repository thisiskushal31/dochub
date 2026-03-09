# D — Enums and type qualifiers

[← D README](./README.md)

**Enums** define a set of named constants (or a distinct type with named values). **Type qualifiers** (**const**, **immutable**, **shared**) restrict how data may be modified and are important for correctness and concurrency. **inout** propagates qualifiers in generic code.

**Why enums?** They replace magic numbers with readable names and can be strongly typed. **Why qualifiers?** They express immutability and thread sharing so the compiler can enforce safety.

---

## Enums

A **enum** can be a list of named constants (traditional C-style) or a **enum** type with a base type and explicit values. The underlying type defaults to **int** but can be specified.

```d
enum Color { red, green, blue }
enum int Flag { a = 1, b = 2, c = 4 }
Color c = Color.red;
```

---

## const and immutable

**const** means the referenced data is not modified through this reference; **immutable** means the data is never modified after creation. **immutable** data can be shared across threads without synchronization for reading. Parameters and members are often marked **const** or **immutable** to document and enforce non-mutation.

```d
immutable string appName = "MyApp";
void print(const int[] data) { /* cannot modify data */ }
```

---

## shared

**shared** indicates data that may be accessed by multiple threads. Correct use requires synchronization; the type system helps mark shared state. **shared** is used with **synchronized** classes or explicit locking in concurrent code.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Enums](https://dlang.org/spec/enum.html)
- [D spec: Type Qualifiers](https://dlang.org/spec/const3.html)
