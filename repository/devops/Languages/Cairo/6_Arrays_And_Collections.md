# Cairo — Arrays and collections

[← Cairo README](./README.md)

The **Array** type from the core library is a collection of elements of the same type. You create and use arrays via the **ArrayTrait**. Because Cairo memory is immutable, array elements cannot be changed after they are written. Arrays behave like **queues**: you can only **append** at the end and **remove** from the front; these operations update pointers rather than overwriting memory cells. This topic covers creating arrays, reading elements, and the **Span** and **array!** macro.

---

## Creating an array

Create an array with `ArrayTrait::new()`. You can optionally specify the element type. Append elements with `append()`.

```cairo
#[executable]
fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);
    a.append(2);
}
```

With an explicit type:

```cairo
let mut arr = ArrayTrait::<u128>::new();
// or
let mut arr: Array<u128> = ArrayTrait::new();
```

---

## Adding and removing elements

**Adding:** Use `append(value)` to add an element at the end.

**Removing:** Use `pop_front()` to remove the first element. It returns an `Option`; use `.unwrap()` to get the value or handle `None` when the array is empty.

```cairo
#[executable]
fn main() {
    let mut a = ArrayTrait::new();
    a.append(10);
    a.append(1);
    a.append(2);

    let first_value = a.pop_front().unwrap();
    println!("The first value is {}", first_value);
}
```

---

## Reading elements

**`get(index)`** returns an `Option<Box<@T>>`: an option to a Box containing a snapshot of the element at that index if it exists, or `None` if the index is out of bounds. Use it when you want to handle out-of-bounds without panicking (e.g. match on the result and use `.unbox()` to get the value).

**`at(index)`** (and the subscript `arr[index]`) return a snapshot of the element; they **panic** if the index is out of bounds. Use them when you expect a valid index. Using `arr.at(index)` is equivalent to `arr[index]`.

```cairo
#[executable]
fn main() {
    let mut a = ArrayTrait::new();
    a.append(0);
    a.append(1);

    let first = *a.at(0);
    assert!(first == 0);
    let second = *a[1];
    assert!(second == 1);
}
```

For `get()`, you typically match on the result and use `.unbox()` to get the value from the box.

---

## Size

Use **`len()`** for the number of elements (returns `usize`). Use **`is_empty()`** to check if the array has no elements.

---

## array! macro

When the values are known at compile time, use the **array!** macro instead of creating an array and appending each value.

```cairo
let arr = array![1, 2, 3, 4, 5];
```

---

## Storing multiple types with enums

To hold elements of different types in one array, use an enum whose variants wrap each type. The array type is then `Array<YourEnum>`.

```cairo
#[derive(Copy, Drop)]
enum Data {
    Integer: u128,
    Felt: felt252,
    Tuple: (u32, u32),
}

#[executable]
fn main() {
    let mut messages: Array<Data> = array![];
    messages.append(Data::Integer(100));
    messages.append(Data::Felt('hello world'));
    messages.append(Data::Tuple((10, 30)));
}
```

---

## Span

**Span** is a read-only view of an **Array**. It provides safe access to elements without modifying the array. All array methods except `append()` are available on `Span`. Call **`span()`** on an array to get its span.

```cairo
#[executable]
fn main() {
    let mut array: Array<u8> = ArrayTrait::new();
    array.append(1);
    array.append(2);
    let s = array.span();
}
```

Use spans when passing arrays to functions for read-only access so ownership stays with the caller (see **Ownership and references**).

---

## Further reading

- [The Cairo Book — Arrays](https://www.starknet.io/cairo-book/ch03-01-arrays.html)
- [The Cairo Book — Common Collections](https://www.starknet.io/cairo-book/ch03-00-common-collections.html)
- [Cairo README](./README.md) — Topic index.
