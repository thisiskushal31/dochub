# Sui Programmable Transaction Blocks (PTBs)

[← Back to Move](./README.md)

## What is a PTB?

A **Programmable Transaction Block (PTB)** is a single transaction that can execute multiple ordered commands. PTBs are a core Sui concept for composing complex user actions without publishing one-off helper packages.

In practice, PTBs let you:

- chain multiple operations atomically
- pass outputs from one command to another
- perform richer UX flows in one signed transaction

## Why PTBs matter for engineering

PTBs change how you design both smart contracts and clients:

- **Application teams:** design command pipelines (split, call, transfer, merge).
- **Systems teams:** reduce round trips and improve end-to-end latency.
- **Security teams:** reason about whole-transaction invariants and failure atomicity.
- **Ops teams:** monitor gas and failure patterns for multi-step flows.

## PTB mental model

A PTB has two major parts:

- **Inputs:** objects and pure values.
- **Commands:** ordered operations that consume/produce values.

Execution is atomic: if one command fails, the full PTB aborts and state effects are reverted.

## Common commands and flow shape

Typical PTB command categories include:

- coin management (split/merge)
- Move calls (`moveCall`)
- object transfers
- package operations (publish/upgrade)

The key design advantage is output-to-input chaining inside one transaction.

## Illustrative PTB-friendly contract API

Text first: a PTB-friendly module exposes small composable entry functions with clear object and value arguments.

```move
module demo::vault {
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};

    public struct Vault has key, store {
        id: object::UID,
        total: u64,
    }

    public entry fun create(ctx: &mut TxContext) {
        let v = Vault { id: object::new(ctx), total: 0 };
        transfer::transfer(v, tx_context::sender(ctx));
    }

    public entry fun deposit(v: &mut Vault, amount: u64) {
        v.total = v.total + amount;
    }

    public entry fun withdraw(v: &mut Vault, amount: u64): u64 {
        assert!(v.total >= amount, 0);
        v.total = v.total - amount;
        amount
    }
}
```

Client PTBs can chain calls like "split coin -> deposit -> transfer resulting object/value" as one atomic operation.

## PTB limits and design constraints

- PTBs can contain many commands (large cap), but complexity still impacts gas and debuggability.
- Object borrowing/usage rules apply across the whole PTB, not just one function call.
- Entry-function constraints and return-type constraints matter in composed flows.

## Security checklist for PTB-heavy apps

- Validate each intermediate state transition, not just final output.
- Keep command sequences explicit and deterministic.
- Use capability-gated entry points for privileged steps.
- Fuzz or scenario-test multi-command failure permutations.

---

## Further reading

- [Sui — Programmable Transaction Blocks](https://docs.sui.io/guides/developer/transactions/ptbs/prog-txn-blocks)
- [Building PTBs](https://docs.sui.io/guides/developer/transactions/building-ptb)
- [PTB CLI commands](https://docs.sui.io/references/cli/ptb)
