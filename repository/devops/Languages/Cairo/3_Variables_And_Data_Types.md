# Cairo — Variables and data types

[← Cairo README](./README.md)

Cairo uses an **immutable memory model**: once a memory cell is written, it is not overwritten, only read. Variables are **immutable by default**. You can make a variable mutable with `mut`. This topic covers variables, constants, shadowing, and the main data types: scalars (felt, integers, bool, strings) and compounds (tuples, fixed-size arrays). Cairo is **statically typed**: the types of all variables must be known at compile time; the compiler often infers them, and you can use conversion methods (e.g. `try_into()`) when you need to specify the target type.

---

## Variables and mutability

When a variable is immutable, once a value is bound to a name you cannot change that value. Assigning again to the same name causes a compile error. The compiler message will be something like "Cannot assign to an immutable variable." Getting compile-time errors for immutability helps prevent bugs where one part of the code assumes a value never changes while another part changes it.

```cairo
#[executable]
fn main() {
    let x = 5;
    println!("The value of x is: {}", x);
    x = 6;  // Error: Cannot assign to an immutable variable.
    println!("The value of x is: {}", x);
}
```

Cairo has immutable memory: values in memory do not change. That makes a whole class of bugs impossible and makes code easier to reason about. To allow reassignment, declare the variable with `mut`:

```cairo
#[executable]
fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}
```

Under the hood, the *value* in a cell is immutable, but the *variable* can be bound to a different cell. Assigning to a mutable variable is equivalent to redeclaring it to refer to another value in another memory cell; the compiler handles that and the keyword `mut` makes the intent clear. At the Cairo level the variable is not redeclared, so its type cannot change when using `mut`.

---

## Constants

Constants are always immutable: you cannot use `mut` with them. Declare them with `const` instead of `let`, and the type of the value must be annotated. They may only be set to a constant expression, not to something computed at runtime. Constants can only be declared in the global scope, so they are useful for values that many parts of the program need. By convention, names are uppercase with underscores.

```cairo
const ONE_HOUR_IN_SECONDS: u32 = 3600;
const ONE_HOUR_IN_SECONDS_2: u32 = 60 * 60;
```

Constants can use structs, enums, and fixed-size arrays when the value is a constant expression:

```cairo
const STRUCT_INSTANCE: SomeStruct = SomeStruct { a: 0, b: 1 };
const BOOL_FIXED_SIZE_ARRAY: [bool; 2] = [true, false];
```

Constants are valid for the entire time a program runs within their scope. Naming hardcoded values as constants conveys meaning and gives a single place to update if the value changes.

---

## Shadowing

You can declare a new variable with the same name as an existing one (shadowing). The new variable hides the previous one until the scope ends or it is shadowed again. Shadowing uses `let` again and can change the type.

```cairo
#[executable]
fn main() {
    let x = 5;
    let x = x + 1;
    {
        let x = x * 2;
        println!("Inner scope x value is: {}", x);
    }
    println!("Outer scope x value is: {}", x);
}
```

Inner scope prints 12; outer scope prints 6. Shadowing is different from `mut`: you get a compile-time error if you reassign without using `let`. With shadowing you are creating a new variable, so you can change the type while reusing the same name (e.g. from `u64` to `felt252` via `.into()`). With `mut` the type cannot change; assigning a value of a different type causes a type error.

```cairo
#[executable]
fn main() {
    let x: u64 = 2;
    println!("The value of x is {} of type u64", x);
    let x: felt252 = x.into();
    println!("The value of x is {} of type felt252", x);
}
```

If you used `mut` and then assigned e.g. `x = 5_u8`, the compiler would report that it expected `u64` but found `u8`.

---

## Scalar types

### Felt (field element)

If you do not specify a type, the default is **felt252** (a field element). A field element is an integer in the range 0 to P−1 for a large prime P. Arithmetic is modulo P: if a result goes outside that range, an appropriate multiple of P is added or subtracted so the result stays in range. Division in Cairo is defined so that (x / y) * y == x always. If y does not divide x as integers, the result is not truncating integer division: e.g. 1/2 in Cairo is the value that satisfies 2 * (1/2) ≡ 1 (mod P), not 0. For general-purpose code, prefer integer types (they have overflow and underflow checks).

### Integer types

Cairo provides unsigned integer types: `u8`, `u16`, `u32`, `u64`, `u128`, `u256`, and `usize` (currently an alias for `u32`). Each has an explicit size in bits. Use them instead of raw felt when you want bounds and overflow behavior; they help avoid vulnerabilities from overflow and underflow. Unsigned types cannot hold negative numbers; subtracting so that the result would be negative (e.g. `1_u8 - 3_u8`) will panic. All of these except `u256` fit in a felt252; `u256` is stored as a struct with `low: u128` and `high: u128`. Signed types use the `i` prefix (e.g. `i8` … `i128`) and can represent negative values. Integer literals can be decimal, hex (`0xff`), octal (`0o77`), or binary (`0b11`); use a type suffix when needed (e.g. `57_u8`) and underscores for readability (e.g. `98_222`).

```cairo
#[executable]
fn main() {
    let sum = 5_u128 + 10_u128;
    let difference = 95_u128 - 4_u128;
    let product = 4_u128 * 30_u128;
    let quotient = 56_u128 / 32_u128;
    let remainder = 43_u128 % 5_u128;
}
```

Literals can be decimal, hex (`0xff`), octal (`0o77`), or binary (`0b11`). Suffix with type when needed (e.g. `57_u8`).

### Boolean type

The type `bool` has values `true` and `false`. Conditions (e.g. in `if`) must be `bool`. You must use `true` or `false` literals for bool values; you cannot use integer literals (e.g. 0 for false) for bool declarations.

```cairo
#[executable]
fn main() {
    let t = true;
    let f: bool = false;
}
```

### Short strings and ByteArray

Short strings use single quotes and fit in a `felt252` (up to 31 ASCII characters). Longer text uses **ByteArray** (double quotes).

```cairo
#[executable]
fn main() {
    let my_first_char = 'C';
    let my_first_string = 'Hello world';
    let long_string: ByteArray = "this is a string with more than 31 characters";
}
```

---

## Compound types

### Tuples

A tuple groups values of possibly different types. Length is fixed. Use pattern matching to destructure.

```cairo
#[executable]
fn main() {
    let tup: (u32, u64, bool) = (10, 20, true);
    let (x, y, z) = tup;
    if y == 6 {
        println!("y is 6!");
    }
}
```

The unit type `()` is a tuple with no elements; it represents “no value” and is used for functions that return nothing.

### Fixed-size arrays

Every element has the same type. Type syntax is `[element_type; length]`.

```cairo
#[executable]
fn main() {
    let arr1: [u64; 5] = [1, 2, 3, 4, 5];
    let a = [3; 5];  // five elements, each 3
}
```

Access by destructuring or via `.span()` and indexing:

```cairo
#[executable]
fn main() {
    let my_arr = [1, 2, 3, 4, 5];
    let [a, b, c, _, _] = my_arr;
    let my_span = my_arr.span();
    println!("c: {}", c);
    println!("my_span[2]: {}", my_span[2]);
}
```

---

## Type conversion

Use the **Into** and **TryInto** traits. When the conversion cannot fail (e.g. smaller to larger integer), use `.into()` and annotate the target type. When it can fail (e.g. larger to smaller), use `.try_into().unwrap()`.

```cairo
#[executable]
fn main() {
    let my_u8: u8 = 10;
    let my_u16: u16 = my_u8.into();
    let my_felt252: felt252 = 3;
    let my_u32: u32 = my_felt252.try_into().unwrap();
}
```

---

## Further reading

- [The Cairo Book — Variables and Mutability](https://www.starknet.io/cairo-book/ch02-01-variables-and-mutability.html)
- [The Cairo Book — Data Types](https://www.starknet.io/cairo-book/ch02-02-data-types.html)
- [Cairo README](./README.md) — Topic index.
