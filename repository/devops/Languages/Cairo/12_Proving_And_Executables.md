# Cairo — Proving and executables

[← Cairo README](./README.md)

Cairo programs can be run as **executables** and their execution can be **proved** so that anyone can verify the result without re-running the program. This topic summarizes executable targets in Scarb, running with inputs, and generating and verifying proofs (e.g. with the Stwo prover).

---

## Executable target in Scarb

In **Scarb.toml**, an executable is declared with **[[target.executable]]**. You give it a name and the function that serves as the entry point (e.g. `package_name::module_name::main`). The entry point in code is marked with **#[executable]**.

```toml
[package]
name = "prime_prover"
version = "0.1.0"
edition = "2024_07"

[cairo]
enable-gas = false

[dependencies]
cairo_execute = "2.13.1"

[[target.executable]]
name = "main"
function = "prime_prover::main"
```

```cairo
/// Checks if a number is prime.
fn is_prime(n: u32) -> bool {
    if n <= 1 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3;
    loop {
        if i * i > n { return true; }
        if n % i == 0 { return false; }
        i += 2;
    }
}

#[executable]
fn main(input: u32) -> bool {
    is_prime(input)
}
```

---

## Running an executable

Use **scarb execute** and pass inputs with **--arguments**. The program runs and produces an execution trace; artifacts (e.g. public/private inputs, trace, memory) are written under the target directory.

```bash
scarb execute -p prime_prover --print-program-output --arguments 17
```

Output reflects the program result (e.g. 1 for true). For invalid or out-of-range inputs you can **panic** so that no valid proof is produced for that run.

---

## Generating a proof

After execution, you can generate a zero-knowledge proof that the run was correct. The exact command depends on the prover integrated with your toolchain (e.g. Stwo via Scarb). Typically you point at an execution ID so the prover uses the right trace and inputs.

```bash
scarb prove --execution-id 1
```

This produces a proof file that can be verified off-chain or on-chain.

---

## Verifying a proof

Verification checks that the proof matches the claimed execution (e.g. public inputs and output) without re-running the program.

```bash
scarb verify --execution-id 1
```

Successful verification confirms that the computation was performed correctly for the given inputs.

---

## Summary

Executable targets and **#[executable]** define the entry point for running and proving. **scarb execute** runs the program with given arguments; **scarb prove** and **scarb verify** generate and verify proofs. Panicking on invalid input prevents generating a proof for that execution.

---

## Further reading

- [The Cairo Book — Proving That A Number Is Prime](https://www.starknet.io/cairo-book/ch01-03-proving-a-prime-number.html)
- [Cairo README](./README.md) — Topic index.
