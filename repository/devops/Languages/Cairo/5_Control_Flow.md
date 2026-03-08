# Cairo — Control flow

[← Cairo README](./README.md)

Control flow lets you run different code depending on conditions and repeat code with loops. Cairo provides **if** expressions and three loop forms: **loop**, **while**, and **for**. Conditions in `if` and `while` must be of type **bool**. This topic covers branching, loops, break and continue, and using `if` in a `let` expression.

---

## if expressions

An `if` expression runs one block when the condition is true and optionally an `else` block when it is false. The condition must be a `bool`. Cairo does not convert numbers to booleans: you cannot use `if number` with a numeric `number`; use an explicit comparison (e.g. `if number != 0`). If you write `if number` the compiler may infer `number` as bool and then reject a numeric literal.

```cairo
#[executable]
fn main() {
    let number = 3;

    if number == 5 {
        println!("condition was true and number = {}", number);
    } else {
        println!("condition was false and number = {}", number);
    }
}
```

Use `else if` for multiple conditions. The first condition that is true runs; the rest are not evaluated.

```cairo
#[executable]
fn main() {
    let number = 3;

    if number == 12 {
        println!("number is 12");
    } else if number == 3 {
        println!("number is 3");
    } else if number - 2 == 1 {
        println!("number minus 2 is 1");
    } else {
        println!("number not found");
    }
}
```

Because `if` is an expression, you can use it on the right side of `let` to assign the result. Both branches must produce a value of the same type.

```cairo
#[executable]
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    if number == 5 {
        println!("condition was true and number is {}", number);
    }
}
```

---

## loop

The `loop` keyword runs a block of code repeatedly until you break out. Use `break` to stop and optionally return a value; use `continue` to skip to the next iteration. Cairo uses a **gas meter** to limit execution: gas is a unit of computation cost, and when it runs out the program stops. For executables with loops you run with `--available-gas=<value>` (e.g. `scarb execute --available-gas=20000000`). This is especially important for Starknet contracts, where infinite loops must be prevented.

```cairo
#[executable]
fn main() {
    let mut i: usize = 0;
    loop {
        if i > 10 {
            break;
        }
        if i == 5 {
            i += 1;
            continue;
        }
        println!("i = {}", i);
        i += 1;
    }
}
```

You can return a value from a loop by giving that value to `break`; the loop expression then evaluates to that value.

```cairo
#[executable]
fn main() {
    let mut counter = 0;

    let result = loop {
        if counter == 10 {
            break counter * 2;
        }
        counter += 1;
    };

    println!("The result is {}", result);
}
```

---

## while

A `while` loop runs while its condition is true. The condition must be `bool`.

```cairo
#[executable]
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");
        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

---

## for

A `for` loop iterates over a collection (e.g. a span of an array). It is safer and clearer than indexing with `while` when you want to visit every element.

```cairo
#[executable]
fn main() {
    let a = [10, 20, 30, 40, 50].span();

    for element in a {
        println!("the value is: {element}");
    }
}
```

You can use a **Range** from the core library to run code a fixed number of times:

```cairo
#[executable]
fn main() {
    for number in 1..4_u8 {
        println!("{number}!");
    }
    println!("Go!!!");
}
```

---

## Loops and recursion

In Cairo, loops and recursive functions are closely related: loops are compiled in a similar way to recursion. Both can express repetition; choose based on readability. For example, a loop that breaks when a condition is met can be written as a recursive function that calls itself until the condition holds.

---

## Further reading

- [The Cairo Book — Control Flow](https://www.starknet.io/cairo-book/ch02-05-control-flow.html)
- [Cairo README](./README.md) — Topic index.
