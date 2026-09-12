# Cairo — Functions

[← Cairo README](./README.md)

Functions are the main way to structure Cairo code. The `main` function is the entry point of many programs. You declare functions with `fn`, a name, optional parameters, and an optional return type. This topic covers defining functions, parameters, return values, the difference between statements and expressions, named parameters, and const functions.

---

## Defining and calling functions

Use `fn` followed by the function name and parentheses. The body goes in curly braces. By convention, function and variable names use **snake_case**.

```cairo
fn another_function() {
    println!("Another function.");
}

#[executable]
fn main() {
    println!("Hello, world!");
    another_function();
}
```

Functions can be defined in any order; the compiler only needs to see the definition in a visible scope when you call them.

---

## Parameters

Parameters are declared in the function signature with a name and type. You must declare the type of each parameter (the compiler uses this to give better error messages and rarely needs type hints elsewhere). When you call the function, you pass arguments that match those types; the terms "parameter" and "argument" are often used interchangeably for the variables in the definition or the values passed in.

```cairo
#[executable]
fn main() {
    another_function(5);
}

fn another_function(x: felt252) {
    println!("The value of x is: {}", x);
}
```

Multiple parameters are separated by commas:

```cairo
#[executable]
fn main() {
    print_labeled_measurement(5, "h");
}

fn print_labeled_measurement(value: u128, unit_label: ByteArray) {
    println!("The measurement is: {value}{unit_label}");
}
```

### Named parameters

You can pass arguments by name: `parameter_name: value`. If a variable has the same name as the parameter, you can write `:parameter_name`.

```cairo
fn foo(x: u8, y: u8) {}

#[executable]
fn main() {
    let first_arg = 3;
    let second_arg = 4;
    foo(x: first_arg, y: second_arg);
    let x = 1;
    let y = 2;
    foo(:x, :y);
}
```

---

## Statements and expressions

Function bodies are made of **statements** and optionally end with an **expression**. **Statements** perform an action and do not return a value (e.g. `let y = 6;`). **Expressions** evaluate to a value (e.g. `5 + 6`, or a block in braces). If you put a semicolon after an expression, it becomes a statement and no value is returned.

A block in curly braces is an expression; its value is the value of the last expression inside it (with no semicolon).

```cairo
#[executable]
fn main() {
    let y = {
        let x = 3;
        x + 1
    };
    println!("The value of y is: {}", y);
}
```

Here `y` is 4. The `x + 1` line has no semicolon, so it is the value of the block.

---

## Return values

Declare the return type with `-> Type`. The return value is the value of the last expression in the function body (no semicolon). You can return early with `return value;`.

```cairo
fn five() -> u32 {
    5
}

#[executable]
fn main() {
    let x = five();
    println!("The value of x is: {}", x);
}
```

If you add a semicolon to the last expression, it becomes a statement and the function effectively returns `()`, which causes a type error if you declared a different return type:

```cairo
fn plus_one(x: u32) -> u32 {
    x + 1   // correct: expression, value returned
}

// fn plus_one_bad(x: u32) -> u32 {
//     x + 1;  // wrong: statement, returns ()
// }
```

---

## Const functions

Functions that can be evaluated at compile time can be marked with `const fn`. They can be used in constant contexts (e.g. constant expressions). The arguments and return type, and the body, are restricted to what can be computed at compile time.

```cairo
use core::num::traits::Pow;

const BYTE_MASK: u16 = 2_u16.pow(8) - 1;

#[executable]
fn main() {
    let my_value = 12345;
    let first_byte = my_value & BYTE_MASK;
    println!("first_byte: {}", first_byte);
}
```

Here `pow` is a const function from the core library, so it can be used to define `BYTE_MASK` at compile time.

---

## Further reading

- [The Cairo Book — Functions](https://www.starknet.io/cairo-book/ch02-03-functions.html)
- [Cairo README](./README.md) — Topic index.
