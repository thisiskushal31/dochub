# Cairo — What is Cairo?

[← Cairo README](./README.md)

Cairo is a programming language built for **computational integrity** using mathematical proofs. Programs written in Cairo can prove that they performed a given computation correctly, even when run on untrusted machines—so you can trust the result without re-executing the program. The language is based on **STARK** technology (a modern form of probabilistically checkable proofs): computational claims are turned into constraint systems and then into proofs that can be verified efficiently and with high assurance.

---

## What you can do with Cairo

Cairo enables **verifiable computation**. The main use today is **Starknet**, a Layer 2 scaling solution for Ethereum. In a typical blockchain, every node must re-execute every transaction. Starknet changes this: computations run off-chain, a **prover** produces a STARK proof, and an Ethereum contract **verifies** that proof. Verifying a proof is much cheaper than re-running the computation, so the network can scale while staying secure.

Cairo is not limited to blockchain. Any setting where you need to **prove that a computation was done correctly**—without re-running it—can use Cairo’s verifiable computation.

---

## Cairo from every engineering perspective

The same language and this handbook support multiple engineering roles and applications:

| Perspective | What Cairo is used for | Where in this section |
|-------------|------------------------|------------------------|
| **Software engineering** | Applications, libraries, provable programs, tooling; design patterns, testing, maintainability. | Basics and core language (2–18); proving (12); use cases (21). |
| **DevOps / platform engineering** | Build, test, and prove in CI/CD; package and deploy contracts; run tests and proof pipelines. | Getting started (2), modules and Scarb (13), testing (16), proving (12), use cases (21). |
| **Cybersecurity engineering** | Secure development, threat modeling, audits, static analysis, formal verification, secure contract patterns, incident response. | Ownership and safety (7), error handling (15), testing (16), smart contracts and security (19), use cases (21). |
| **Smart contract / protocol engineering** | Starknet contracts: DeFi, NFTs, gaming, governance, L1–L2 messaging, upgradeability, composability. | Smart contracts (19), use cases and case studies (21). |
| **Research / verifiable-systems** | Provable programs, ZK applications, oracles, circuits, VM and proof-system internals. | Proving (12), advanced features (18), Cairo VM (20), use cases (21). |

Whether you ship contracts, run pipelines, audit code, or build provable systems, the topics in this section are ordered so you can go from basics to the depth you need for your role.

---

## How to use this section

The topics in this section are ordered so you can learn **from basics to smart contracts and other applications**. If you start at topic 1 and work through in order, you will see how to install Cairo, write and run programs, use the core language (variables, functions, structs, enums, modules, traits, errors, tests), then move on to **smart contracts on Starknet** (topic 19) and **use cases and case studies** (topic 21). The **Cairo README** (topic list) has a short **learning path** table that maps “what to read” to “what you’ll be able to do.” Use it to plan your path (e.g. “I want to write a contract” → follow basics and core language, then topic 19, then 21 for examples).

---

## Who this is for

- **General-purpose developers** interested in verifiable computation: focus on the core language (getting started, variables, data types, functions, control flow, structs, enums, modules, traits, error handling, testing, closures, advanced features).
- **DevOps and platform engineers**: use getting started (2), modules and Scarb (13), testing (16), and proving (12); topic 21 covers CI/CD and tooling. Topic 19 for contract deployment and operations.
- **Cybersecurity and security engineers**: core language for reading code; topic 7 (ownership) and 15 (errors) for safety; topic 19 for contract security, testing, and static analysis; topic 21 for audits and secure SDLC.
- **New smart contract developers**: go through the language first, then smart contracts (Starknet types, storage, functions, events, interactions, security).
- **Experienced smart contract or Rust developers**: you can jump to smart contract chapters and refer back to traits, generics, and basics as needed.
- **Research and verifiable-systems engineers**: core language and proving (12), advanced features (18), Cairo VM (20), and use cases (21) for provable programs and ZK applications.

The material assumes basic programming (variables, functions, data structures). Experience with Rust helps because Cairo is similar in style, but it is not required.

---

## Further reading

- [The Cairo Book — Introduction](https://www.starknet.io/cairo-book/ch00-00-introduction.html)
- [Cairo documentation](https://www.cairo-lang.org/docs/)
- [StarkNet docs](https://docs.starknet.io/)
- [Cairo README](./README.md) — Topic index.
