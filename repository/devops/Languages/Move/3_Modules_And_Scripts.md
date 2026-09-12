# Modules and scripts

[← Back to Move](./README.md)

## What are modules and scripts?

**Modules** are the durable unit of on-chain code: they define **structs** and **functions** and are **published** under an address. **Scripts** (where supported) are **not** stored on chain; they are sent as **transaction payload** and run once, typically calling into published modules. Together they answer “where does my logic live?” vs “how do I trigger a one-off flow?”

On **Sui**, there is no separate script workflow for normal apps: **modules** plus **entry functions** and **programmable transaction blocks** replace scripts.

## Why separate modules from scripts?

Modules encapsulate **invariants**: only the defining module can pack and unpack its structs, so asset rules stay centralized. Scripts stay thin—**orchestration** without new types—so each transaction’s attack surface stays bounded. Security reviews often start by listing **published modules** and **script entrypoints** (or **entry** functions on Sui).

## How are they structured?

A **module** is tied to an address and a name. Inside: imports, optional friends, types, constants, functions.

```text
module <address>::<name> {
    (use | friend | struct | const | fun)*
}
```

Example of a tiny published module (illustrates address, name, and visibility hook):

```move
module 0x42::counter {
    struct State has key { n: u64 }
    public fun placeholder() {}
}
```

Named addresses from the package manifest replace literals in real projects.

A **script** wraps a single function with no type parameters, unit return, and no direct global storage in the script itself—it calls module APIs.

```move
script {
    use 0x42::counter;

    fun main(account: &signer) {
        counter::bump(account);
    }
}
```

The transaction supplies **`&signer`**; the script forwards it into module functions that require it. A script’s **main** can take **multiple signers** as long as all **signer** parameters come **first** (e.g. `main(s1: signer, s2: signer, x: u64)`); the VM injects one signer per transaction signer. That pattern supports **multi-signer** scripts (e.g. atomic swaps or governance). Use **`signer::address_of(&s)`** to obtain an address from a signer.

On **Aptos**, scripts remain common for composing several module calls in one tx. On **Sui**, the same composition happens at the **PTB** layer calling **public entry** functions.

## What are the engineering angles?

- **Application:** Modules are your contracts; scripts or PTBs are how users run them.
- **Systems:** The VM loads module bytecode once per cache lifetime; scripts/PTBs are per-transaction input.
- **Security:** Visibility (`public`, `public(friend)`, internal) and module boundaries limit who can touch state.
- **Operations:** Publish modules once; scripts or client-built PTBs change frequently without republishing.

---

## Further reading

- [The Move Book — Modules and Scripts](https://move-language.github.io/move/modules-and-scripts.html)
- [Move Book (Sui) — Modules](https://move-book.com/)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
