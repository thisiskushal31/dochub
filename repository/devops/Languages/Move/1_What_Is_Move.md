# What is Move?

[← Back to Move](./README.md)

Move is a programming language designed for secure, sandboxed, and formally verifiable programs. Its main use is writing smart contracts and asset logic on blockchains: programs run in a constrained environment and manage digital assets with strong guarantees. Move draws from Rust by treating assets as **resources** with move semantics—values that cannot be copied or discarded by default and must be explicitly moved or destroyed. That design helps prevent double-spending, accidental duplication, and many classes of smart-contract bugs at the language level.

## Core idea: resource-oriented programming

In Move, **resources** are data types that represent digital assets with strict rules:

- The compiler enforces ownership and usage rules.
- Resources are not copied; they are moved between accounts or storage.
- When no longer referenced, they are destroyed (no silent duplication).
- The type system and runtime work together to preserve scarcity and access control.

This resource-oriented model gives you a single, consistent way to express “this value is the unique representation of an asset” and to rely on the language and VM to protect it.

## Who Move is for

Move targets developers who need to write or reason about asset-heavy, security-sensitive code—typically on a blockchain. That includes:

- **Smart contract developers** building modules and scripts (or entry points) on Move-based chains.
- **Auditors and security engineers** who need to understand Move’s guarantees and where platform-specific behavior matters.
- **Platform and operations engineers** who deploy, operate, or integrate tooling (build, test, deploy on Aptos or Sui)—alongside application, systems, and security roles.

A practical understanding of at least one programming language (e.g. Rust, TypeScript, or Python) is helpful; the Move Book and chain-specific docs are the main references for syntax and semantics.

## The three Move flavors: which one, and why

Move exists in three forms. The handbook covers all of them from basic concepts through implementation and use cases.

### 1. Original Move (no new development)

The **move-language/move** repository (language, VM, Move Book) is **archived** (May 2024) and no longer actively developed. It remains the **canonical source for core language concepts**: modules and scripts, structs and resources, abilities, global storage, references, functions, generics. The hosted Move Book and the book source in that repo are the shared foundation that Aptos and Sui extend. Use it to learn the language and semantics that apply across Move; do not use it for new chain deployment.

### 2. Move on Aptos (active)

**Move on Aptos** is the active implementation used by the Aptos blockchain. It is **transaction-centric** and **account-based**: traditional global storage, account addresses, and a focus on strong consistency and formal verification. Choose Aptos when you need:

- Traditional account-based model and global storage operators.
- Formal verification and enterprise- or finance-oriented tooling.
- Block-STM–style optimistic parallel execution with fallback to sequential execution when needed.

### 3. Move on Sui (active)

**Move on Sui** is the active implementation used by the Sui blockchain. It is **object-centric**: there is no traditional global storage; state is made of **objects** with unique IDs and explicit ownership (owned, shared, immutable). Choose Sui when you need:

- Dynamic asset management and complex object relationships.
- Low latency and high throughput (e.g. gaming, real-time apps).
- Programmable Transaction Blocks (PTBs), dynamic fields, and a multi-token gas model.

Both Aptos and Sui keep Move’s core security advantages (resource semantics, linear types, no reentrancy from the type system) while differing in storage model, execution, and tooling.

## Why Move in engineering (whole perspective)

Move matters across engineering—not only for operations:

- **Application:** Smart contracts and dapps on Aptos and Sui are written in Move; product and contract engineers need the language to design, implement, and review.
- **Systems:** The Move VM, bytecode, and chain-specific runtimes (e.g. Block-STM vs Sui’s object-based parallelism) matter for performance, capacity, and how the stack behaves under load.
- **Security:** Resource safety, access control, and signer usage are central to threat modeling, formal methods, and auditing.
- **Operations:** Build, test, deploy, and run Move packages using Move CLI, Aptos CLI, and Sui CLI; the environment and toolchain topic supports this lens alongside the others.

## Where to go next

- **Concepts:** Start with [Modules and scripts](./3_Modules_And_Scripts.md), then [Structs and resources](./4_Structs_And_Resources.md) and [Abilities](./5_Abilities.md). For storage: [Global storage](./6_Global_Storage.md) (core/Aptos) and Sui’s object model (covered where relevant).
- **Practice:** Set up your environment with [Environment and toolchains](./2_Environment_And_Toolchains.md) (Move package layout, Aptos CLI, Sui CLI, build and test).

---

## Further reading

- [The Move Book — Introduction](https://move-language.github.io/move/)
- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
