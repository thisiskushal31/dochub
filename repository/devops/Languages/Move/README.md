# Move

[← Back to Languages](../README.md)

This section is a **deep dive** into **Move**: factually correct, standalone, and written so you can go from **basic to advanced to implementation**. It answers four things: **What is Move?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized in three parts: **core** (language concepts, modules, structs, abilities, storage, references, functions, generics, VM, security); **Move on Aptos** (active) and **Move on Sui** (active), each with their own in-depth topics; and a **comparison** of when to use which. Each topic is self-contained. For more depth, use the links in the Further reading section at the end of each file.

| Block | Topics | What it covers |
|-------|--------|----------------|
| **Core** | **1–12** | Language-agnostic concepts (modules, structs, abilities, storage, references, functions, generics, VM, security, engineering perspectives). Core syntax and semantics follow the **original Move language specification** (legacy reference); where chains differ, **Aptos** (account + global storage, scripts) vs **Sui** (objects, entry functions, PTBs) is called out—especially in storage (6), modules/scripts (3), and functions (8). |
| **Move on Aptos** | **13–19** | Active Aptos stack: overview, account model, toolchain, Block-STM, framework, verification, use cases. |
| **Move on Sui** | **20–27** | Active Sui stack: overview, object model, toolchain, PTBs, dynamic fields, entry/init, gas/security, use cases. |
| **Wrap-up** | **28** | Aptos vs Sui and how to choose a platform. |

**Where you use it:** Move is used to write and audit smart contracts and dapps on Aptos and Sui—from application design and systems (VM, toolchains) to security (verification, auditing) and operations (deploy, run). The use-cases and comparison topics cover when to choose which platform.

---

## How to read this section

Read in **number order** for a single path: **basics first**, then **language core**, then **advanced and implementation**, then **Aptos and Sui in depth**, then **comparison**.

- **Core (1–12):** What Move is (including built-in types), environment packages and **unit tests**, modules and scripts, structs and resources, abilities, global storage, references and tuples, **control flow and functions** (variables, loops, abort, visibility, `use`, constants), generics, VM and bytecode, security patterns, use cases and stdlib orientation.
- **Move on Aptos (13–19):** Overview and when to use, account model and storage, toolchain, Block-STM and parallel execution, framework and stdlib, security and formal verification, Aptos use cases and patterns.
- **Move on Sui (20–27):** Overview and when to use, object model, toolchain, Programmable Transaction Blocks, dynamic fields, entry functions and module initializers, security and gas model, Sui use cases and patterns.
- **Wrap-up (28):** Comparison and choosing a platform.

---

## Topic index

| # | Topic | File |
|---|--------|------|
| **Core** | | |
| 1 | What is Move? | [1_What_Is_Move.md](./1_What_Is_Move.md) |
| 2 | Environment and toolchains | [2_Environment_And_Toolchains.md](./2_Environment_And_Toolchains.md) |
| 3 | Modules and scripts | [3_Modules_And_Scripts.md](./3_Modules_And_Scripts.md) |
| 4 | Structs and resources | [4_Structs_And_Resources.md](./4_Structs_And_Resources.md) |
| 5 | Abilities | [5_Abilities.md](./5_Abilities.md) |
| 6 | Global storage | [6_Global_Storage.md](./6_Global_Storage.md) |
| 7 | References and ownership | [7_References_And_Ownership.md](./7_References_And_Ownership.md) |
| 8 | Functions and visibility | [8_Functions_And_Visibility.md](./8_Functions_And_Visibility.md) |
| 9 | Generics and type system | [9_Generics_And_Type_System.md](./9_Generics_And_Type_System.md) |
| 10 | Move VM and bytecode | [10_Move_VM_And_Bytecode.md](./10_Move_VM_And_Bytecode.md) |
| 11 | Security and audit patterns | [11_Security_And_Audit_Patterns.md](./11_Security_And_Audit_Patterns.md) |
| 12 | Use cases and engineering perspectives | [12_Use_Cases_And_Engineering_Perspectives.md](./12_Use_Cases_And_Engineering_Perspectives.md) |
| **Move on Aptos** | | |
| 13 | Move on Aptos: overview and when to use | [13_Move_On_Aptos_Overview.md](./13_Move_On_Aptos_Overview.md) |
| 14 | Aptos account model and global storage | [14_Aptos_Account_Model_And_Storage.md](./14_Aptos_Account_Model_And_Storage.md) |
| 15 | Aptos toolchain (CLI, build, test, deploy) | [15_Aptos_Toolchain.md](./15_Aptos_Toolchain.md) |
| 16 | Aptos Block-STM and parallel execution | [16_Aptos_Block_STM_And_Parallel_Execution.md](./16_Aptos_Block_STM_And_Parallel_Execution.md) |
| 17 | Aptos framework and standard library | [17_Aptos_Framework_And_Standard_Library.md](./17_Aptos_Framework_And_Standard_Library.md) |
| 18 | Aptos security and formal verification | [18_Aptos_Security_And_Formal_Verification.md](./18_Aptos_Security_And_Formal_Verification.md) |
| 19 | Aptos use cases and patterns | [19_Aptos_Use_Cases_And_Patterns.md](./19_Aptos_Use_Cases_And_Patterns.md) |
| **Move on Sui** | | |
| 20 | Move on Sui: overview and when to use | [20_Move_On_Sui_Overview.md](./20_Move_On_Sui_Overview.md) |
| 21 | Sui object model (ownership, UID, key and store) | [21_Sui_Object_Model.md](./21_Sui_Object_Model.md) |
| 22 | Sui toolchain (CLI, build, test, deploy) | [22_Sui_Toolchain.md](./22_Sui_Toolchain.md) |
| 23 | Programmable Transaction Blocks (PTBs) | [23_Sui_Programmable_Transaction_Blocks.md](./23_Sui_Programmable_Transaction_Blocks.md) |
| 24 | Sui dynamic fields and collections | [24_Sui_Dynamic_Fields_And_Collections.md](./24_Sui_Dynamic_Fields_And_Collections.md) |
| 25 | Sui entry functions and module initializers | [25_Sui_Entry_Functions_And_Module_Initializers.md](./25_Sui_Entry_Functions_And_Module_Initializers.md) |
| 26 | Sui security and gas model | [26_Sui_Security_And_Gas_Model.md](./26_Sui_Security_And_Gas_Model.md) |
| 27 | Sui use cases and patterns | [27_Sui_Use_Cases_And_Patterns.md](./27_Sui_Use_Cases_And_Patterns.md) |
| **Wrap-up** | | |
| 28 | Comparison and choosing a platform | [28_Comparison_And_Choosing_A_Platform.md](./28_Comparison_And_Choosing_A_Platform.md) |

---

## Learning path

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Core** | 1 → 12 | Understand what Move is, set up toolchains, write modules and scripts, use structs and abilities, global storage, references, functions, generics, VM and bytecode, security, and use cases overview. |
| **Move on Aptos** | 13 → 19 | Use Aptos in depth: account model and storage, toolchain, Block-STM, framework, security and verification, Aptos use cases and patterns. |
| **Move on Sui** | 20 → 27 | Use Sui in depth: object model, toolchain, PTBs, dynamic fields, entry and init, security and gas, Sui use cases and patterns. |
| **Wrap-up** | 28 | Compare Aptos vs Sui and choose a platform. |

---

## Further reading

- [The Move Book (language-agnostic)](https://move-language.github.io/move/)
- [The Move Book (Sui) / Move Reference](https://move-book.com/)
- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
- [move-language/move](https://github.com/move-language/move) · [move-on-aptos](https://github.com/move-language/move-on-aptos) · [move-sui](https://github.com/move-language/move-sui)
