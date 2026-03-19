# Security and audit patterns

[← Back to Move](./README.md)

## What is Move’s security baseline?

Move shifts many errors to **compile time** and **verification**: resources are not silently copied or dropped; references cannot dangle into global storage; module boundaries control struct construction. That **baseline** does not remove the need for **secure design**: wrong **`public`** APIs, weak **`signer`** checks, or bad upgrade policy still create incidents.

## Why audit beyond the compiler?

Real systems compose **many modules**, **oracles**, **multisig**, and **off-chain** signers. Threat models include **privileged abuse**, **key compromise**, **dependency substitution**, and **economic** attacks (gas griefing, MEV-adjacent ordering). **Cybersecurity** work maps assets and trust boundaries; Move’s guarantees narrow but do not eliminate that work.

## How do auditors typically review Move code?

**Signer and authority:** Any path that mints, upgrades, or moves critical state should require **`&signer`** or an unforgeable **capability** derived from one. Passing raw **`address`** where **`signer`** was required is a red flag.

Prefer tying privileged logic to the transaction sender (or to a stored cap minted once from a signer):

```move
const E_NOT_OWNER: u64 = 1;

fun assert_owner(account: &signer, expected: address) {
    assert!(std::signer::address_of(account) == expected, E_NOT_OWNER);
}
```

A common **mint** pattern gates creation behind a type only the defining module can construct (**witness**), so other packages cannot mint arbitrary amounts:

```move
struct Coin<phantom T> has store { value: u64 }
struct Balance<phantom T> has key { coin: Coin<T> }

public fun mint<T: drop>(to: address, amount: u64, _witness: T) acquires Balance {
    let b = borrow_global_mut<Balance<T>>(to);
    b.coin.value = b.coin.value + amount;
}
```

Only modules that can obtain a **`T`** value (often impossible outside the defining module) can call **`mint`**.

**Naming and readability:** Consistent naming helps auditors and tooling: for example, error constants often use a single letter prefix (e.g. **E** for errors) and descriptive names for non-error constants. Module and function names in lower snake case keep the surface easy to scan.

**Surface area:** List every **`public`** and **`entry`** function. For each, ask: what can an arbitrary caller do?

**Friends:** **`public(friend)`** should be minimal; friends are trusted as much as the module itself.

**Storage:** Trace **`move_to`**, **`move_from`**, **`borrow_global*`** for cross-address confusion and missing **`exists`** checks.

```move
struct Vault has key { amount: u64 }

public fun safe_read(addr: address): u64 acquires Vault {
    assert!(exists<Vault>(addr), 0);
    borrow_global<Vault>(addr).amount
}
```

Blind **`borrow_global`** without **`exists`** aborts when the resource is missing—sometimes intentional, sometimes a footgun for integrators.

**Upgrades:** Who can publish new bytecode? Is immutability assumed where it is not true?

**Dependencies:** Pin versions; review third-party package types that appear in your storage.

**Composability:** **`abort`** codes and ordering with other modules in the same transaction still matter for user experience and downstream integrators.

Formal verification stacks exist on Aptos-oriented workflows; this topic stays **pattern-based**. Deeper tooling appears in Aptos security topics.

## Operations alignment

Run **`move test`** in CI, record compiler versions in release notes, and segment **admin keys** from **deploy keys** where policy allows.

---

## Further reading

- [The Move Book — Signer](https://move-language.github.io/move/signer.html)
- [Coding conventions](https://move-language.github.io/move/coding-conventions.html)
- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos — Smart contracts](https://aptos.dev/build/smart-contracts)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
