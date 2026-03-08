# Cairo — Testing

[← Cairo README](./README.md)

Tests verify that code behaves as expected. A test typically (1) sets up data or state, (2) runs the code under test, and (3) asserts the results. Cairo supports unit tests (next to the code under test) and integration tests (in a **tests/** directory or via Starknet Foundry). This topic covers writing tests, **assert!**, assertion macros, and test attributes.

---

## Test functions and assert!

Mark a function as a test with **#[test]**. Use **assert!(condition, message)** to check conditions; on failure the test panics with the message. You can also use **assert_eq!**, **assert_ne!**, **assert_lt!**, **assert_le!**, **assert_gt!**, and **assert_ge!** (add `assert_macros = "2.8.2"` as a dev dependency in Scarb.toml to use them). Tests run with **scarb test** or, for Starknet contracts, **snforge test**.

```cairo
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_felt252_to_u8() {
        let number: felt252 = 5;
        let res = parse_u8(number).unwrap();
        assert!(res == 5, "expected 5");
    }

    #[test]
    #[should_panic]
    fn test_felt252_to_u8_panic() {
        let number: felt252 = 256;
        let _res = parse_u8(number).unwrap();
    }
}
```

---

## Test organization

**#[cfg(test)]** ensures the test module is only compiled when running tests. **use super::*;** brings the parent module’s items into scope. Group related tests in modules. For contract tests, use Starknet Foundry’s **#[test]** and utilities from **snforge_std**.

---

## should_panic

**#[should_panic]** on a test means the test **passes** if the test body panics. Use it to check that invalid inputs or error paths cause a panic.

---

## Further reading

- [The Cairo Book — How To Write Tests](https://www.starknet.io/cairo-book/ch10-01-how-to-write-tests.html)
- [The Cairo Book — Test Organization](https://www.starknet.io/cairo-book/ch10-02-test-organization.html)
- [Cairo README](./README.md) — Topic index.
