# Cairo

[← Back to Languages](../README.md)

**Why in DevOps and security:** **Cairo** is the language for **StarkNet** (StarkWare) and general **STARK** provable programs. Web3 DevOps and security for StarkNet and validity rollups involves writing, testing, and auditing Cairo contracts and programs.

**Coverage from every engineering perspective:** This section is written for **software engineers** (applications, libraries, tooling), **DevOps / platform engineers** (build, CI/CD, testing, proving, deployment), **cybersecurity engineers** (secure development, audits, threat modeling, static analysis, formal methods), **smart contract and protocol engineers** (Starknet contracts, DeFi, NFTs, L2), and **research / verifiable-systems engineers** (provable programs, ZK, oracles). The same language and topics support all of these; the learning path and topic 21 (use cases) show how each perspective applies.

This section covers Cairo from beginner to advanced: getting started (installation, Hello World, proving a prime), common concepts (variables, data types, functions, comments, control flow), collections (arrays, dictionaries), ownership and references, structs (including an example program and method syntax), enums and pattern matching (match, if let, while let), modules (packages, crates, paths, use, separating files), generic types and traits, error handling, testing, closures, advanced features (custom data structures, smart pointers, deref, associated items, operator overloading, hashes, macros, inlining, printing, arithmetic circuits, oracles), smart contracts on Starknet (types, storage, functions, events, ABI, interactions, serialization, advanced patterns, security, testing, static analysis, appendix), and the Cairo VM plus appendix (architecture, memory, execution, builtins, hints, runner, tracer, keywords, operators, derivable traits, prelude, error messages, development tools). Topic 21 covers **use cases** (verifiable computation, Starknet apps, DevOps, security) and **case studies** (prime prover, voting contract, ERC20-style token).

---

## Learning path: from basics to smart contracts and applications

If you are new to Cairo and want to **write smart contracts or other Cairo applications**, follow the topics in order. The section is structured so you build understanding step by step:

| Stage | Topics | What you’ll be able to do |
|-------|--------|---------------------------|
| **Basics** | 1 → 2 → 3 → 4 → 5 → 6 | Understand what Cairo is, install the toolchain, run a program, and use variables, types, functions, control flow, and arrays. |
| **Core language** | 7 → 8 → 9 → 10 → 13 → 14 → 15 → 16 | Use ownership, structs, enums, dictionaries, modules, traits, error handling, and tests—the building blocks of real programs and contracts. |
| **Proving & advanced** | 12, 17, 18 | Run provable programs (topic 12), use closures and advanced features (17, 18) when you need them. |
| **Smart contracts** | **19** | Write Starknet contracts: storage, external/internal functions, events, ABI, and interactions. Topic 19 includes a minimal “first contract” walkthrough. |
| **Use cases & examples** | **21** | See how everything fits together: verifiable computation, Starknet apps (DeFi, NFTs, gaming), DevOps, security, and case studies (prime prover, voting contract, ERC20). |

**Provable programs only (no contracts):** Read 1 → 2 → 3 → 4 → 5 → 12, then 21 (prime prover case study). Add 6–11 and 13–18 as needed.

**Already know another contract language or Rust:** Skim 1–2, then go to 7 (ownership), 8 (structs), 9 (enums), 13 (modules), 14 (traits), and **19** (smart contracts). Use the rest as reference.

**By engineering role:**

| Role | Focus topics | Outcome |
|------|--------------|---------|
| **Software / application engineer** | 1–18, 21 | Build provable programs, libraries, and tooling; understand language and VM (20) for debugging. |
| **DevOps / platform engineer** | 1–2, 12–13, 16, 19–21 | Integrate Scarb, tests, and proof generation into CI/CD; deploy and operate Starknet contracts. |
| **Cybersecurity / security engineer** | 1–2, 7–8, 15–16, **19** (security, testing, static analysis), **21** (security use cases) | Audit contracts, run static analysis, design secure patterns, and apply secure SDLC to Cairo. |
| **Smart contract / protocol engineer** | 1–19, 21 | Ship and maintain Starknet contracts (DeFi, NFTs, governance); use components, upgradeability, L1–L2. |
| **Research / verifiable-systems engineer** | 1–12, 18, 20–21 | Design provable programs, understand VM and builtins (20), and apply oracles and circuits (18). |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is Cairo? | [1_What_Is_Cairo.md](./1_What_Is_Cairo.md) |
| 2 | Getting started | [2_Getting_Started.md](./2_Getting_Started.md) |
| 3 | Variables and data types | [3_Variables_And_Data_Types.md](./3_Variables_And_Data_Types.md) |
| 4 | Functions | [4_Functions.md](./4_Functions.md) |
| 5 | Control flow | [5_Control_Flow.md](./5_Control_Flow.md) |
| 6 | Arrays and collections | [6_Arrays_And_Collections.md](./6_Arrays_And_Collections.md) |
| 7 | Ownership and references | [7_Ownership_And_References.md](./7_Ownership_And_References.md) |
| 8 | Structs | [8_Structs.md](./8_Structs.md) |
| 9 | Enums and pattern matching | [9_Enums_And_Pattern_Matching.md](./9_Enums_And_Pattern_Matching.md) |
| 10 | Dictionaries | [10_Dictionaries.md](./10_Dictionaries.md) |
| 11 | Comments and documentation | [11_Comments_And_Documentation.md](./11_Comments_And_Documentation.md) |
| 12 | Proving and executables | [12_Proving_And_Executables.md](./12_Proving_And_Executables.md) |
| 13 | Modules, packages, and crates | [13_Modules_Packages_And_Crates.md](./13_Modules_Packages_And_Crates.md) |
| 14 | Generic types and traits | [14_Generic_Types_And_Traits.md](./14_Generic_Types_And_Traits.md) |
| 15 | Error handling | [15_Error_Handling.md](./15_Error_Handling.md) |
| 16 | Testing | [16_Testing.md](./16_Testing.md) |
| 17 | Closures | [17_Closures.md](./17_Closures.md) |
| 18 | Advanced Cairo features | [18_Advanced_Cairo_Features.md](./18_Advanced_Cairo_Features.md) |
| 19 | Smart contracts on Starknet | [19_Smart_Contracts_On_Starknet.md](./19_Smart_Contracts_On_Starknet.md) |
| 20 | Cairo VM and appendix | [20_Cairo_VM_And_Appendix.md](./20_Cairo_VM_And_Appendix.md) |
| 21 | Use cases and case studies | [21_Use_Cases_And_Case_Studies.md](./21_Use_Cases_And_Case_Studies.md) |

---

## Further reading

- [The Cairo Book](https://www.starknet.io/cairo-book/) — The Cairo programming language: getting started, common concepts, ownership, structs, enums, modules, generics and traits, error handling, testing, closures, advanced features; smart contracts (Starknet); Cairo VM.
- [Cairo documentation (StarkNet)](https://www.cairo-lang.org/docs/)
- [StarkNet docs](https://docs.starknet.io/)
- [Scarb (package manager)](https://docs.swmansion.com/scarb/)
