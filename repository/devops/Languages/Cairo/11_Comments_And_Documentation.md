# Cairo — Comments and documentation

[← Cairo README](./README.md)

Comments are ignored by the compiler and help readers of the code. Cairo uses line comments and supports item-level and module-level documentation comments for generating or reading docs.

---

## Line comments

Start a comment with **//**. The rest of the line is a comment. For multiple lines, start each line with `//`.

```cairo
// So we're doing something complicated here, long enough that we need
// multiple lines of comments to do it!

#[executable]
fn main() -> felt252 {
    // this function performs a simple addition
    1 + 4
}
```

You can put a comment at the end of a line of code:

```cairo
1 + 4  // return the sum of 1 and 4
```

---

## Item-level documentation (///)

Use **///** before an item (function, struct, trait, etc.) to document it. You can describe parameters, return value, panics, and include usage examples in code blocks.

```cairo
/// Returns the sum of `arg1` and `arg2`.
/// `arg1` cannot be zero.
///
/// # Panics
///
/// This function will panic if `arg1` is `0`.
///
/// # Examples
///
/// ```
/// let a: felt252 = 2;
/// let b: felt252 = 3;
/// let c: felt252 = add(a, b);
/// assert!(c == a + b, "Should equal a + b");
/// ```
fn add(arg1: felt252, arg2: felt252) -> felt252 {
    assert!(arg1 != 0, "Cannot be zero");
    arg1 + arg2
}
```

---

## Module documentation (//!)

Use **//!** to document the module that follows. Place these comments above the module (e.g. above `mod my_module { ... }`) to describe the module’s purpose and usage.

```cairo
//! # my_module and implementation
//!
//! This is an example description of my_module and some of its features.
mod my_module {
    // ...
}
```

---

## Further reading

- [The Cairo Book — Comments](https://www.starknet.io/cairo-book/ch02-04-comments.html)
- [Cairo README](./README.md) — Topic index.
