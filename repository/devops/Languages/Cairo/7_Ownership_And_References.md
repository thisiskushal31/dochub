# Cairo — Ownership and references

[← Cairo README](./README.md)

Cairo uses a **linear type system**: every value must be used exactly once. "Used" means either **moved** (e.g. passed to a function) or **destroyed**. Destruction can happen when a variable goes out of scope, when a struct is destructured, or explicitly with `destruct()`. This ensures that memory is never written twice and that execution is provable. Ownership in Cairo applies to **variables** (not values): a value can be referred to by many variables because the value itself is immutable; the compiler ensures that constant variables are not accidentally modified. This topic covers variable scope, moving, the **Copy** and **Drop** traits, and **snapshots** and **references** so you can pass values without giving up ownership.

---

## Variable scope and moving

A variable is valid from its declaration until the end of its scope. Passing a value to a function **moves** it: the original variable is no longer valid. Passing the same variable again is a compile error unless the type implements **Copy**.

```cairo
fn foo(mut arr: Array<u128>) {
    arr.pop_front();
}

#[executable]
fn main() {
    let arr: Array<u128> = array![];
    foo(arr);
    // foo(arr);  // Error: variable was previously moved
}
```

---

## Copy trait

Types that implement **Copy** are duplicated by copying felts; no new memory segments are allocated. When you pass a Copy value to a function, a copy is made and the original remains valid. Basic types (integers, felt252, bool, etc.) implement Copy. **Array** and **Felt252Dict** do not; they are moved.

For custom types (e.g. structs) that only contain Copy types, you can derive Copy:

```cairo
#[derive(Copy, Drop)]
struct Point {
    x: u128,
    y: u128,
}

#[executable]
fn main() {
    let p1 = Point { x: 5, y: 10 };
    foo(p1);
    foo(p1);
}

fn foo(p: Point) {}
```

---

## Drop and Destruct

Values must be destroyed when they go out of scope. **Drop** is a no-op destruction: the type can be discarded without special handling. Most types can derive Drop. **Destruct** is used when destruction has a side effect (e.g. **Felt252Dict** must be "squashed" for provability). Types that contain a dictionary cannot derive Drop and must implement or derive Destruct so that when they go out of scope, the dictionary is squashed.

```cairo
#[derive(Drop)]
struct A {}

#[executable]
fn main() {
    A {};
}
```

---

## Snapshots (@)

A **snapshot** is an immutable view of a value at a point in time. You create one with `@value`. The caller keeps ownership; the function only reads. Snapshots implement Drop (they are never Destruct). Use the **desnap** operator `*` to turn a snapshot of a Copy type back into a value.

```cairo
#[derive(Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[executable]
fn main() {
    let rec = Rectangle { height: 3, width: 10 };
    let area = calculate_area(@rec);
    println!("Area: {}", area);
}

fn calculate_area(rec: @Rectangle) -> u64 {
    *rec.height * *rec.width
}
```

You cannot assign through a snapshot; the compiler rejects modifications to snapshot values.

---

## Mutable references (ref)

To let a function mutate a value while the caller keeps ownership, pass a **mutable reference** with **ref**. The parameter is written `ref name: Type`. The variable must be declared with `mut`. The value is effectively passed in and returned implicitly so the caller still owns it.

```cairo
#[derive(Drop)]
struct Rectangle {
    height: u64,
    width: u64,
}

#[executable]
fn main() {
    let mut rec = Rectangle { height: 3, width: 10 };
    flip(ref rec);
    println!("height: {}, width: {}", rec.height, rec.width);
}

fn flip(ref rec: Rectangle) {
    let temp = rec.height;
    rec.height = rec.width;
    rec.width = temp;
}
```

---

## Returning multiple values

You can return several values as a tuple to give ownership back to the caller (e.g. return the same array plus a computed value):

```cairo
#[executable]
fn main() {
    let arr1: Array<u128> = array![];
    let (arr2, len) = calculate_length(arr1);
}

fn calculate_length(arr: Array<u128>) -> (Array<u128>, usize) {
    let length = arr.len();
    (arr, length)
}
```

For read-only or in-place mutation, prefer snapshots and `ref` instead of passing and returning by value.

---

## clone

To duplicate an **Array** (or other non-Copy type), use **clone()**. This allocates and copies data.

```cairo
#[executable]
fn main() {
    let arr1: Array<u128> = array![];
    let arr2 = arr1.clone();
}
```

---

## Further reading

- [The Cairo Book — What is Ownership?](https://www.starknet.io/cairo-book/ch04-01-what-is-ownership.html)
- [The Cairo Book — References and Snapshots](https://www.starknet.io/cairo-book/ch04-02-references-and-snapshots.html)
- [Cairo README](./README.md) — Topic index.
