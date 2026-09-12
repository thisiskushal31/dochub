# Cairo — Enums and pattern matching

[← Cairo README](./README.md)

**Enums** define a type by listing its possible **variants**. Each variant can optionally carry data. Enums are used for fixed sets of related values and for optional or result types. This topic covers defining enums, variants with and without data, and using them with the **match** construct.

---

## Defining enums

Use `enum` and name the type; list variants inside braces. By convention, the enum and its variants use PascalCase.

```cairo
#[derive(Drop)]
enum Direction {
    North,
    East,
    South,
    West,
}

#[executable]
fn main() {
    let direction = Direction::North;
}
```

---

## Variants with data

Variants can hold a single type. Each variant can have a different type.

```cairo
#[derive(Drop)]
enum Direction {
    North: u128,
    East: u128,
    South: u128,
    West: u128,
}

#[executable]
fn main() {
    let direction = Direction::North(10);
}
```

```cairo
#[derive(Drop)]
enum Message {
    Quit,
    Echo: felt252,
    Move: (u128, u128),
}
```

---

## Option

The standard **Option** type represents an optional value: either **Some: T** (a value of type T) or **None**.

```cairo
enum Option<T> {
    Some: T,
    None,
}
```

Use it for computations that might not produce a value (e.g. searching an array). **Result** is used for fallible operations and is covered in error handling.

---

## Match

Use **match** to run different code depending on the variant. Match is **exhaustive**: every possible value must be covered. You can bind the inner value to a variable in the pattern. The first matching arm runs; arms are separated by commas.

```cairo
#[derive(Drop)]
enum Message {
    Quit,
    Echo: felt252,
    Move: (u128, u128),
}

trait Processing {
    fn process(self: Message);
}

impl ProcessingImpl of Processing {
    fn process(self: Message) {
        match self {
            Message::Quit => { println!("quitting") },
            Message::Echo(value) => { println!("echoing {}", value) },
            Message::Move((x, y)) => { println!("moving from {} to {}", x, y) },
        }
    }
}

#[executable]
fn main() {
    let msg: Message = Message::Quit;
    msg.process();
}
```

Use **_** as a catch-all pattern that matches anything and does not bind. Use **|** to match multiple patterns in one arm: `Coin::Dime | Coin::Quarter => true`. You can match tuples and integers (with restrictions: arms must cover contiguous segments; the first arm must start at 0).

---

## if let and while let

**if let** matches one pattern and ignores the rest, so you avoid a full `match` when you only care about one case. You can add **else** for the non-matching case.

```cairo
#[executable]
fn main() {
    let number = Some(5);
    if let Some(max) = number {
        println!("The maximum is configured to be {}", max);
    }
}
```

**while let** loops while a pattern matches (e.g. `while let Some(value) = arr.pop_front() { sum += value; }`). **let else** does refutable pattern matching in a `let`; the **else** block must diverge (e.g. `return`, `panic!`) when the pattern does not match.

---

## Traits for enums

You can implement traits for your enums (e.g. **Drop**, **Copy** when all variant data is Copy) and define methods that work on the enum. The **match** inside the implementation chooses behavior per variant.

---

## Further reading

- [The Cairo Book — Enums](https://www.starknet.io/cairo-book/ch06-01-enums.html)
- [The Cairo Book — The Match Control Flow Construct](https://www.starknet.io/cairo-book/ch06-02-the-match-control-flow-construct.html)
- [Cairo README](./README.md) — Topic index.
