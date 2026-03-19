# Move VM and bytecode

[← Back to Move](./README.md)

## What is the Move VM?

The **Move VM** executes **verified bytecode**. Source compiles to a compact binary form; before execution, bytecode passes checks for **types**, **references**, **resources**, **acquires**, and more. Execution runs in a **session** against a **snapshot** of storage; effects are returned to the host (chain adapter) to commit or discard.

## Why bytecode and verification?

**Ahead-of-time verification** means many bug classes never reach production: you cannot deploy a module that violates reference safety or resource discipline in the standard model. **Systems engineers** care because execution paths are known after load—**eager loading** of callees avoids mid-tx link surprises.

## How does loading and execution work?

1. **Load:** fetch serialized module bytes from the data store → deserialize → **verify** → load dependencies recursively → link → cache in the VM **loader**.
2. **Execute:** **Session** provides a consistent data view; **Runtime** runs instructions until completion or abort.
3. **Publish:** new modules are verified before acceptance; module address must match publisher; duplicate names rejected under immutability rules.

**Aptos** and **Sui** attach different **storage adapters**, **natives**, and **transaction entry** mechanisms; the **loader / verify / session** pattern is shared at a high level. Chain documentation describes gas metering, limits, and fork-specific instructions.

Source like the following compiles to bytecode that the VM **verifies** before it can be stored or executed: resource types without **copy**/**drop** cannot be duplicated or discarded on stack; **`acquires`** must match global borrows; references cannot escape past the end of a function.

```move
module 0x1::asset {
    use std::signer;

    struct Holding has key {
        units: u64
    }

    public fun init(account: &signer) {
        move_to(account, Holding { units: 0 });
    }

    public fun add(account: &signer, more: u64) acquires Holding {
        let h = borrow_global_mut<Holding>(signer::address_of(account));
        h.units = h.units + more;
    }
}
```

If **`Holding`** were given **drop** incorrectly while still used as a **key** resource, or if **`add`** borrowed global state without **`acquires Holding`**, verification would **reject** the module.

## Cybersecurity and operations

- **Bytecode review:** teams sometimes diff compiled output across releases.
- **VM upgrades:** hard forks or restarts may invalidate caches; ops must coordinate node and tooling versions.
- **Determinism:** same tx + same state view → reproducible outcome—important for debugging and audits.

---

## Further reading

- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos — Blockchain Move](https://aptos.dev/network/blockchain/move)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
