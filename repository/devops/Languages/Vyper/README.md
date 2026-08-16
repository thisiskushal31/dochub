# Vyper

[← Back to Languages](../README.md)

**Vyper** is a **contract-oriented, Pythonic** language for the **Ethereum Virtual Machine (EVM)**. You write `.vy` sources; the **Vyper** compiler emits EVM bytecode and an ABI. Like Solidity, the result lives at an **address** on a chain: no server to SSH into, no private log file, and a shipped bug is usually permanent unless you deploy something new.

Vyper’s design bias is different from Solidity’s: **security, simplicity, and auditability** first. Bounds and overflow checks are built in. The language deliberately **omits** features that make contracts hard to read or gas-unbounded—modifiers, inheritance, inline assembly, overloading, recursion, and unbounded loops. Composition and explicit interfaces replace “clever” reuse.

This track teaches **Vyper language + compiler/toolchain literacy + testing + security review habits** for people who deploy, operate, or audit Vyper contracts. It is **not** a DeFi product manual, an L2 encyclopedia, or a wallet UI course. Shared EVM material (calls, storage mental model, Foundry-heavy workflows) lives primarily in the [Solidity](../Solidity/README.md) track—cross-link there when the question is “how the machine works,” and stay here when the question is “what this `.vy` file means.”

Vyper is a **first-class Web3 track** beside [Solidity](../Solidity/README.md), [Move](../Move/README.md), and [Cairo](../Cairo/README.md)—same track weight, different VMs and niches.

---

## Why Vyper (vs other Web3 languages)

### Why choose Vyper vs Solidity

| Dimension | Vyper bias | Practical effect |
|-----------|------------|------------------|
| **Auditability** | Control flow stays in the function; fewer “jump elsewhere” features | Reviewers spend less time reconstructing behavior from modifiers and inheritance trees |
| **Intentional non-features** | No modifiers, inheritance, inline assembly, overloading, recursion, unbounded loops | Some Solidity patterns simply do not exist—by design (chapter **01**) |
| **Decidable gas bias** | Boundable loops; no recursion | Easier to reason about worst-case gas for a call |
| **Composition vs inheritance** | Interfaces + **0.4 modules** (`initializes` / `uses` / `exports`) | Reuse is explicit; public ABI is opt-in |
| **Ecosystem niches** | Strong historical fit for high-assurance DeFi cores (pools, vaults, modular protocol pieces) | Often appears beside Solidity adapters in the same product |

Pick Vyper when the module’s job is “money path that humans must finish reading,” and the team can staff Vyper readers.

### When Solidity is still the better default

| Situation | Why Solidity often wins |
|-----------|-------------------------|
| **Hiring and ramp** | Larger candidate pool; more interview folklore |
| **Foundry samples and tutorials** | Most EVM learning material and forge recipes are Solidity-first |
| **Library density** | OpenZeppelin-style and community libraries skew Solidity |
| **Expressiveness needs** | Inheritance, modifiers, inline assembly, richer patterns when the product truly requires them |
| **Org-standard toolchain** | One Solidity/Foundry monorepo is cheaper than a polyglot estate |

Vyper and Solidity both target the **EVM**. Choosing one language for a module is a staffing and auditability decision—not a claim that the other is “unsafe.”

### Why not Move / Cairo / Solana Rust when the job is EVM

| Language / stack | VM / chain family | Relation to Vyper |
|------------------|-------------------|-------------------|
| **Vyper / Solidity** | EVM | Peers on the same machine family |
| **Move** (Aptos / Sui, …) | Move VM + resource model | Different execution and asset model—[Move](../Move/README.md) track |
| **Cairo** (Starknet) | Cairo / STARK-oriented stack | Different proving and account model—[Cairo](../Cairo/README.md) track |
| **Solana Rust** (and similar) | Non-EVM L1 runtimes | Different accounts, parallelism, and tooling |

These are **complements**, not substitutes. If the deployment target is an EVM chain (or an EVM-equivalent L2), learn Vyper or Solidity. If the target is Move/Cairo/Solana, open that track—do not expect `.vy` habits to transfer as syntax sugar.

### Where this track fits

This track treats **Vyper** as a full Web3 path: install → language → modules → ship/test → review → adjacent doors. Use [Solidity](../Solidity/README.md) for shared EVM material and Foundry culture; use [Move](../Move/README.md) / [Cairo](../Cairo/README.md) when the chain is not EVM.

Staff hire Vyper fluency for five practical pillars:

1. **Language honesty** — types, visibility/mutability decorators, intentional non-features (chapters **04–11**, **17**).
2. **Compiler and ABI surface** — version pragmas, compile/deploy, gas-bound and exception literacy (chapters **00**, **02**, **12**, **18**).
3. **Testing** — Titanoboa as the modern default; Brownie as brownfield (chapter **13**).
4. **Security and review** — design-as-defense, assert style, advisory habits (chapter **14**).
5. **On-chain performance** — gas-efficient patterns so entrypoints stay affordable and boundable (chapter **19**; woven through **07**, **09**, **12**).

**New to Vyper?** Start at chapter **01** (what it is / when to pick it), then **00** (install + hello), then **02** onward.

---

## After this track — what you can write

| You can write / do… | What “done” looks like | Spine chapters |
|---------------------|------------------------|----------------|
| A **small Vyper contract** on 0.4.x | `#pragma version`, types honest, compiles clean | **00–08**, **17** |
| **Read a Curve-style / DeFi Vyper module** | Interfaces/modules recognized; no Solidity-modifier assumptions | **01**, **11**, **15** |
| A **compile + ABI + deploy story** | Pinned compiler; artifact ownership clear | **02**, **12**, **18** |
| A **Titanoboa test** for a state change | Asserts on storage/events; CI-friendly | **13** |
| A **security review conversation** | Non-features and assert style named correctly | **14** |
| A **keep Vyper vs use Solidity** decision | Host and team skill named | **01**, **16** |
| A **gas-sensible hot path** | Measured gas; bound loops; storage/calls deliberate | **19**, **07**, **12** |

---

## What to learn next (complement paths)

Vyper usually lands in **EVM smart contracts** that value auditability—often DeFi pools, vaults, and governance-adjacent code—beside Solidity in the same ecosystem. After this track, pick the next skill by the *job*, not by “more Python syntax.”

| If your goal is… | Learn next | Start with |
|------------------|------------|------------|
| Shared EVM / Solidity material | [Solidity](../Solidity/README.md) track | Chapter **01** EVM picture; then calls/storage as needed |
| Foundry-heavy Solidity pipelines | Solidity toolchain + Foundry chapters | When the repo is Solidity-first |
| Client / dapp wiring | [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) + ethers/viem | ABI from chapter **12** |
| Formal / analysis tooling | Official Vyper security notes + analyzer docs | After **14** |
| Move / Cairo / other L1s | [Move](../Move/README.md) / [Cairo](../Cairo/README.md) tracks | Different VMs—don’t assume Vyper transfers |

**Suggested order by role**

| Role | After this track |
|------|------------------|
| **Contract engineer** | **01 → 00 → 02–08 → 11 → 17 → 12–13 → 19 → 14 → 18** |
| **Security reviewer** | **01 → 05 → 08 → 14 → 18 → 19** (+ Solidity security chapters for shared EVM bugs) |
| **Ops / release** | **00 → 02 → 12 → 13 → 18 → 19** |

Chapter **[16](./16_Where_Vyper_Is_Going_And_Adjacent_Doors.md)** covers where Vyper is headed and how to choose what follows.

---

## Versions and brownfield (default narrative)

**Default for new work: Vyper 0.4.x**, pinned to the patch your CI ships (**0.4.3** in these chapters). Use a version pragma (for example `#pragma version ^0.4.0`). Record **compiler version** and **EVM target** together. **0.3.x** contracts are brownfield literacy—module system and syntax differ.

| Pin | Where it shows up | Habit |
|-----|-------------------|----------------|
| **0.4.3** / **0.4.x** | New contracts | Default narrative; modules; modern testing |
| **0.3.x** | Older production | Literacy; check release notes before porting |
| Venom / experimental codegen | Opt-in compiler path | Advanced door—not default CI without policy (**18**) |
| Brownie-only repos | Older tutorials | Door; prefer Titanoboa for new tests |

```bash
vyper --version
python -c "import vyper; print(vyper.__version__)"
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, EVM nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (six ideas)

1. **Vyper targets the EVM.** Same machine family as Solidity; different language rules.
2. **Auditability beats cleverness.** Missing Solidity features are often intentional.
3. **Mutability is marked.** `@view` / `@pure` / `@payable` / state-changing externals must match reality.
4. **Gas should be boundable—and affordable.** No recursion or unbounded loops by design; hot paths still need measurement (chapters **18–19**).
5. **Composition over inheritance.** Interfaces and modules (0.4+) replace class trees.
6. **Pins are part of the contract job.** Compiler version, EVM target, and optimize mode belong in CI.

| Idea | Review smell if missing | Chapters |
|------|-------------------------|---------------|
| EVM identity | Treated as “Python on a server” | **01**, **00** |
| Intentional non-features | Looking for modifiers/inheritance | **01**, **14** |
| Mutability honesty | `@view` that writes | **08** |
| Version pin | Untagged `vyper` in CI | **02**, **12**, **18** |
| Modules/interfaces | Copy-paste instead of composition | **11** |
| Gas performance | Hot path unmeasured; storage/calls in user-sized loops | **19** |

---

## How to read this section

**Absolute beginners:** **01 → 00 → 02 → …**  
If you already know Solidity: **01** (non-features + decision) → **00** → **05–08** → **11** → **14**—do not skip the design differences.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation** | 01 | Explain Vyper vs Solidity / Move / Cairo and when to pick Vyper |
| **Doorway** | 00 | Install, compile hello |
| **Language core** | 02 → 10, **17** | Pragmas, structure, types, control, functions, events, scoping/style |
| **Composition** | 11 | Interfaces and modules |
| **Ship / test** | 12 → 13, **18–19** | Compile, deploy, Titanoboa, gas bounds, **efficient gas patterns** |
| **Security / synthesis** | 14 → 16 | Review habits, roles, next skills |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: install, compile hello | [00_First_Steps_Install_And_Hello.md](./00_First_Steps_Install_And_Hello.md) |
| 01 | What Vyper is (and is not) | [01_What_Vyper_Is_And_Is_Not.md](./01_What_Vyper_Is_And_Is_Not.md) |
| 02 | Versions, pragmas, and pins | [02_Versions_Pragmas_And_Pins.md](./02_Versions_Pragmas_And_Pins.md) |
| 03 | Toolchain: vyper, Titanoboa, Brownie door | [03_Toolchain_Vyper_Titanoboa_Brownie.md](./03_Toolchain_Vyper_Titanoboa_Brownie.md) |
| 04 | Structure of a contract | [04_Structure_Of_A_Contract.md](./04_Structure_Of_A_Contract.md) |
| 05 | Types | [05_Types.md](./05_Types.md) |
| 06 | Environment variables, constants, immutables | [06_Environment_Constants_And_Immutables.md](./06_Environment_Constants_And_Immutables.md) |
| 07 | Control structures and statements | [07_Control_Structures_And_Statements.md](./07_Control_Structures_And_Statements.md) |
| 08 | Functions, visibility, and mutability | [08_Functions_Visibility_And_Mutability.md](./08_Functions_Visibility_And_Mutability.md) |
| 09 | Built-in functions | [09_Built_In_Functions.md](./09_Built_In_Functions.md) |
| 10 | Events and NatSpec | [10_Events_And_NatSpec.md](./10_Events_And_NatSpec.md) |
| 11 | Interfaces and modules | [11_Interfaces_And_Modules.md](./11_Interfaces_And_Modules.md) |
| 12 | Compiling, deploying, and ABI literacy | [12_Compiling_Deploying_And_ABI.md](./12_Compiling_Deploying_And_ABI.md) |
| 13 | Testing contracts | [13_Testing_Contracts.md](./13_Testing_Contracts.md) |
| 14 | Security design and review | [14_Security_Design_And_Review.md](./14_Security_Design_And_Review.md) |
| 15 | Use cases and engineering perspectives | [15_Use_Cases_And_Engineering_Perspectives.md](./15_Use_Cases_And_Engineering_Perspectives.md) |
| 16 | Where Vyper is going and adjacent doors | [16_Where_Vyper_Is_Going_And_Adjacent_Doors.md](./16_Where_Vyper_Is_Going_And_Adjacent_Doors.md) |
| 17 | Scoping, declarations, and style | [17_Scoping_Declarations_And_Style.md](./17_Scoping_Declarations_And_Style.md) |
| 18 | Gas bounds, compiler exceptions, and Venom | [18_Gas_Bounds_Compiler_Exceptions_And_Venom.md](./18_Gas_Bounds_Compiler_Exceptions_And_Venom.md) |
| 19 | Gas performance and efficient contracts | [19_Gas_Performance_And_Efficient_Contracts.md](./19_Gas_Performance_And_Efficient_Contracts.md) |

---

## Further reading

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [Vyper versioning guideline](https://docs.vyperlang.org/en/stable/versioning.html)
- [Gas and fees (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)
- [Solidity track](../Solidity/README.md) — sibling EVM language
- [Move track](../Move/README.md) — different VM
- [Cairo track](../Cairo/README.md) — different VM
