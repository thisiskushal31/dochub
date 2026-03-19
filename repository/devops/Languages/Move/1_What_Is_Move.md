# What is Move?

[← Back to Move](./README.md)

## What is Move?

Move is a programming language for writing **on-chain programs** that manage **digital assets** safely. Programs run inside a **virtual machine**: they cannot open files, open sockets, or read the host OS directly. All persistent effects go through the chain’s rules for **storage** and **transactions**. The language is **statically typed** and built around **resources**—types whose values cannot be silently copied or thrown away unless the type explicitly allows it. That design targets bugs that show up in other smart-contract stacks: double spending, accidental duplication of tokens, and dangling references to storage.

Move is used today mainly on **Aptos** and **Sui**. Both inherit the same core ideas (modules, structs, abilities, references, generics, verified bytecode) but differ in **how state is laid out** (accounts and global storage vs objects), **how users start execution** (scripts vs entry functions and programmable transaction blocks), and **tooling**. A third line, **core Move**, is frozen as a language reference; new product work targets Aptos or Sui.

## What built-in types should you know first?

**Integers:** unsigned **`u8`** through **`u128`** everywhere; **`u256`** where the toolchain supports it. Literals use an optional suffix (**`1u8`**, **`2u64`**), hex (**`0xFF`**), or underscores (**`1_000_000`**); when the type is not specified, inference often assumes **`u64`**. **Booleans** **`bool`**. **Addresses** identify accounts or (on some chains) objects; in **expression** context you write **`@0x…`** or **`@named_addr`**—the **`@`** is required there. Named addresses are fixed at compile time (from the manifest), not at runtime. **`vector<T>`** is the growable sequence; you can write **`vector[]`** or **`vector[e1, e2, ...]`** (type inferred or explicit). For **`vector<u8>`**, byte strings **`b"hello"`** and hex strings **`x"48656C6C6F"`** are shorthand. Element abilities flow from **`T`**.

```move
let n = 100u64;
let hex = 0xCAFEu16;
let bytes = b"move";
let who = @0x1;
let xs = vector[1u64, 2u64];
```

**`signer`** represents an authenticated actor. Values are **only** created by the VM (e.g. as the transaction sender); you never construct a **`signer`** in source—only accept **`&signer`**. Use **`signer::address_of(&s)`** to get that signer’s address. In scripts, **multiple signers** are allowed as long as they form a **prefix** of the main function’s parameters (e.g. `main(s1: signer, s2: signer, amount: u64)`), which supports multi-signer flows. [Global storage](./6_Global_Storage.md) and [Security](./11_Security_And_Audit_Patterns.md) rely on this.

**Tuples** like **`(u64, bool)`** and the unit type **`()`** show up in multi-return and control flow; [Functions and visibility](./8_Functions_And_Visibility.md) ties this together with **`let`** and branching.

## Why is Move used?

Blockchains need programs that manipulate scarce value. General-purpose languages make it easy to copy values or leave them inconsistent; Move pushes those mistakes to **compile time** and **bytecode verification** so many flaws never reach mainnet. Teams choose Move when they want:

- **Strong asset semantics** — linear resources, explicit moves, ability-gated storage.
- **Predictable execution** — bytecode verified before deployment; no dynamic code loading mid-tx in the usual model.
- **Clear module boundaries** — types are created and destroyed only inside their defining module unless abilities say otherwise.

Security engineers and auditors get a smaller class of runtime surprises; application engineers get a language shaped for **tokens, caps, and permissions** rather than general scripting.

## How can I use it?

You write **packages**: a manifest, module source files, optional tests, and chain-specific publish commands. Workflows always include **edit → compile → test → publish** (exact CLI names depend on Aptos vs Sui). You do not “run Move” like a standalone script on your laptop for production state; you **compile** artifacts and **submit transactions** that invoke published modules (or scripts on Aptos-style flows).

Conceptually, you start from **modules** (types + functions) and, on Aptos, optionally **scripts** that call into those modules in one transaction. On Sui, clients call **entry functions** and batch them in **PTBs**. [Environment and toolchains](./2_Environment_And_Toolchains.md) covers layout and tooling; [Modules and scripts](./3_Modules_And_Scripts.md) covers modules vs scripts vs entry.

A minimal **Aptos-style** module ties a name to an address, defines a **`key`** resource, and exposes functions that only the defining module can use to change stored state:

```move
module my_package::counter {
    use std::signer;

    struct Counter has key { value: u64 }

    public fun publish(account: &signer) {
        move_to(account, Counter { value: 0 });
    }

    public fun bump(account: &signer) acquires Counter {
        let addr = signer::address_of(account);
        let c = borrow_global_mut<Counter>(addr);
        c.value = c.value + 1;
    }
}
```

Real packages resolve **`my_package`** via **`Move.toml`** named addresses. **`publish`** must run once per account before **`bump`**. On **Sui**, storage uses **objects** and **`public entry`** instead of this global-per-address pattern—see Sui topics. [Global storage](./6_Global_Storage.md) explains **`move_to`** / **`borrow_global_mut`** in depth.

## What are the use cases?

**Application engineering:** fungible and non-fungible assets, DeFi primitives, governance tokens, game inventory, identity or capability tokens.

**Systems engineering:** VM behavior, gas and limits, how parallel execution interacts with Move’s safety (Aptos Block-STM, Sui object-level concurrency).

**Security and cybersecurity:** formal verification on Aptos-flavored stacks, manual audit of `signer` and capability flows, upgrade and multisig policy, supply-chain review of dependencies.

**Operations:** CI that pins compiler versions, staged deploy to devnet/testnet/mainnet, monitoring failed transactions and invariant breaches.

Topics **2–12** build **basic → advanced** language concepts; **13–28** split Aptos and Sui in depth and finish with platform comparison.

---

## Further reading

- [The Move Book — Introduction](https://move-language.github.io/move/)
- [Integers](https://move-language.github.io/move/integers.html) · [Bool](https://move-language.github.io/move/bool.html) · [Address](https://move-language.github.io/move/address.html) · [Vector](https://move-language.github.io/move/vector.html) · [Signer](https://move-language.github.io/move/signer.html)
- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
