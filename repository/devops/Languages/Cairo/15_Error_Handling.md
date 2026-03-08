# Cairo — Error handling

[← Cairo README](./README.md)

Cairo distinguishes **unrecoverable** errors (panic) from **recoverable** errors (**Result**). Panic stops execution; **Result** lets the caller handle success or failure. This topic covers **panic**, **panic!**, **nopanic**, **Result**, and the **?** operator.

---

## Unrecoverable errors: panic

**panic** takes an array as the reason and terminates the program, dropping variables and squashing dictionaries. **panic_with_felt252(message)** is a one-argument helper for short messages (felt252). The **panic!** macro takes a string (can be longer than 31 characters) and is often the most convenient when you need a descriptive error message.

```cairo
use core::panic_with_felt252;

#[executable]
fn main() {
    if true {
        panic!("the error message can be longer than 31 characters");
    }
}
```

---

## nopanic and panic_with

A function that is guaranteed not to panic can be marked **nopanic**. Only **nopanic** functions can be called from another **nopanic** function. **#[panic_with('reason', wrap_name)]** on a function that returns **Option** or **Result** creates a wrapper that panics with the given reason when the result is **None** or **Err**.

```cairo
fn function_never_panic() -> felt252 nopanic {
    42
}
```

---

## Recoverable errors: Result

**Result&lt;T, E&gt;** has two variants: **Ok: T** (success) and **Err: E** (error). Use it for operations that can fail in a way the caller can handle.

```cairo
fn parse_u8(s: felt252) -> Result<u8, felt252> {
    match s.try_into() {
        Some(value) => Ok(value),
        None => Err('Invalid integer'),
    }
}
```

**ResultTrait** provides **unwrap()**, **expect(err)**, **is_ok()**, **is_err()**, **unwrap_err()**, and **expect_err(err)**. Use **match** to handle both cases or **unwrap**/ **expect** when you want to panic on error.

---

## Propagating errors with ?

The **?** operator on a **Result** (or **Option**) unwraps the value if **Ok** (or **Some**) and returns early with the error if **Err** (or **None**). It can only be used in a function whose return type is **Result** or **Option**.

```cairo
fn mutate_byte(input: felt252) -> Result<u8, felt252> {
    let input_to_u8: u8 = parse_u8(input)?;
    let res = input_to_u8 - 1;
    Ok(res)
}
```

---

## Further reading

- [The Cairo Book — Unrecoverable Errors with panic](https://www.starknet.io/cairo-book/ch09-01-unrecoverable-errors-with-panic.html)
- [The Cairo Book — Recoverable Errors with Result](https://www.starknet.io/cairo-book/ch09-02-recoverable-errors.html)
- [Cairo README](./README.md) — Topic index.
