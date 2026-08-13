# Solidity

[← Back to Languages](../README.md)

If you have written a web API, you already know half the story: a caller sends a request, your code runs, something is stored. Solidity is that idea moved onto a shared machine nobody fully owns.

**Solidity** is the main language for **Ethereum smart contracts**. You write ordinary-looking functions. A compiler (`solc`) turns them into **EVM bytecode**. That bytecode, plus a small pile of permanent storage, lives at an **address** on a chain. Every honest node runs the same code the same way. There is no server to SSH into, no “restart the pod,” and no private log file. A bug that ships is public, and undoing it usually means deploying *something new*.

People reach for Solidity when mutually distrusting parties need **one rule set** they can all execute—not when they need a normal app with logins and a database. This track teaches the **language + the machine + the job around it**: how to read a contract, how `solc` / Remix / Foundry / Hardhat fit together, how calls and storage actually work, how to test, how to review, and how to ship without losing the keys.

It is **not** an L2 encyclopedia, a DeFi product manual, or a wallet UI course. Client libraries (**ethers.js**, **viem**) live with [JavaScript](../JavaScript/README.md) / [TypeScript](../TypeScript/README.md). [Vyper](../Vyper/README.md) is a sibling EVM language, not a Solidity dialect.

Start at chapter **00**. The first goal is not “become an auditor.” It is: compile a tiny contract, change a number, and *feel* the difference between a read and a write.

---

## Versions and brownfield (default narrative)

**Default for new contracts: Solidity 0.8.x.** This handbook’s language snapshot is **0.8.36**. Pin the **latest patch your team actually ships**. Solidity uses a `0.y.z` scheme because breaking changes are normal. **Only the latest compiler release is guaranteed security fixes**—do not leave production deploys on an abandoned `solc` without an explicit waiver.

Record **three pins** together: **`solc` version**, **EVM version** (`shanghai`, `cancun`, `prague`, …), and whether you compile **via IR**. Remix-in-the-browser is not automatically the same compiler as CI.

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| Solidity **0.8.x** (latest patch) | New work | Default narrative; checked math; ABI coder v2 |
| **0.8.4+** custom errors | Modern 0.8 | Prefer custom errors over long revert strings |
| **0.8.24+** transient storage | Cancun-capable chains | Teach `transient` as a first-class location |
| **Pre-0.8** | Forks, old audits | Unchecked overflow, `byte`, coder v1 — **review literacy**, not templates |
| `transfer` / `send` stipend habits | Brownfield | Not a reentrancy strategy (see chapters **15**, **18**) |
| Truffle / Ganache-only repos | Older tutorials | Inventory; prefer **Foundry** or **Hardhat** for new pipelines |

```bash
# Discover what you actually have
solc --version
forge --version
npx hardhat --version
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

## How to read a chapter

Each chapter talks first, then shows a small program. Comments in the code are part of the lesson—read them. After a snippet, look for **what just happened** (a short walkthrough). Then **Advanced** is the machine-level pass: slot formulas, ABI head/tail, opcodes, gas schedules, C3, CREATE2 — still in the same voice, not a second book. Then where this shows up at work, then a checklist.

You do not need to memorize the EVM. You need a picture you can hold:

## Semantic model (the five ideas that make Solidity click)

- **Contract ≠ process.** State lives in **storage** at an address. There is no “restart the pod.”
- **Call ≠ HTTP.** A call runs in the EVM with a gas limit, a `msg.sender`, and optional `msg.value`. Failures **revert** (state undone) unless you deliberately catch them.
- **Four data locations.** **Storage** persists. **Memory** lasts one call. **Calldata** is read-only input. **Transient** lasts one transaction (Cancun / 0.8.24+).
- **ABI is the public API.** Compiling strips names; selectors and encoding are how wallets and other contracts talk to you.
- **Trust is inverted.** Users often trust bytecode more than authors. Tests, reviews, pins, and verification are part of the language job—not extras.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Doorway | **00** | Accounts, transactions, gas intuition; first Remix and Foundry hello; contract ≠ server |
| Foundations | 01–07 | Language vs chain vs EVM; versions/pragmas; toolchain; source layout; types; globals; control, errors, checked math |
| Contract core | 08–13 | Functions/modifiers/payable; events/errors/NatSpec; data locations; collections; inheritance/libraries |
| Machine + ABI | 14–16 | ABI/selectors; calls/value/create; gas, optimizer, via-IR, metadata |
| Quality | 17–19 | Foundry/Hardhat tests; security review; analyzers and SMT |
| Delivery | **20** | CI, verify, keys, environments, upgrade literacy |
| Internals | **21** | Yul/assembly/storage packing — when it is justified |
| Placement | **22** | Token/standard literacy + whole-engineering use cases |
| Wrap | **23** | Competency map and staff sign-off |

Suggested order: **00 → 07**, then **08 → 13**, then **14 → 16**, then **17 → 20**, then **21 → 23**. Revisit **02** before pinning CI; **11** before any storage layout debate; **15**/**18** before shipping value transfer; **17** before claiming “tested”; **20** before a mainnet key ever exists.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 0 | First steps on the EVM | [00](./00_First_Steps_On_The_EVM.md) |
| 1 | What is Solidity and the EVM | [01](./01_What_Is_Solidity_And_The_EVM.md) |
| 2 | Versions, pragmas, and breaking changes | [02](./02_Versions_Pragmas_And_Breaking_Changes.md) |
| 3 | Toolchain: solc, Remix, Foundry, Hardhat | [03](./03_Toolchain_Solc_Remix_Foundry_Hardhat.md) |
| 4 | Source files: SPDX, pragma, and imports | [04](./04_Source_Files_SPDX_Pragma_And_Imports.md) |
| 5 | Structure of a contract | [05](./05_Structure_Of_A_Contract.md) |
| 6 | Types: value, reference, and conversions | [06](./06_Types_Value_Reference_And_Conversions.md) |
| 7 | Units, globals, and blockchain context | [07](./07_Units_Globals_And_Blockchain_Context.md) |
| 8 | Functions, visibility, modifiers, and payable | [08](./08_Functions_Visibility_Modifiers_And_Payable.md) |
| 9 | Control flow, errors, and checked math | [09](./09_Control_Flow_Errors_And_Checked_Math.md) |
| 10 | Events, custom errors, and NatSpec | [10](./10_Events_Custom_Errors_And_NatSpec.md) |
| 11 | Data locations: storage, memory, calldata, transient | [11](./11_Data_Locations_Storage_Memory_Calldata_Transient.md) |
| 12 | Mappings, arrays, structs, and enums | [12](./12_Mappings_Arrays_Structs_And_Enums.md) |
| 13 | Inheritance, interfaces, and libraries | [13](./13_Inheritance_Interfaces_And_Libraries.md) |
| 14 | ABI, selectors, and encoding | [14](./14_ABI_Selectors_And_Encoding.md) |
| 15 | Calls, value transfer, and creating contracts | [15](./15_Calls_Value_Transfer_And_Creating_Contracts.md) |
| 16 | Gas, optimizer, via-IR, and metadata | [16](./16_Gas_Optimizer_ViaIR_And_Metadata.md) |
| 17 | Testing with Foundry and Hardhat | [17](./17_Testing_With_Foundry_And_Hardhat.md) |
| 18 | Security review: reentrancy, access, and trust | [18](./18_Security_Review_Reentrancy_Access_And_Trust.md) |
| 19 | Static analysis, SMTChecker, and audits | [19](./19_Static_Analysis_SMTChecker_And_Audits.md) |
| 20 | DevOps: CI, verify, keys, and upgrades | [20](./20_DevOps_CI_Verify_Keys_And_Upgrades.md) |
| 21 | Yul, assembly, and EVM internals literacy | [21](./21_Yul_Assembly_And_EVM_Internals_Literacy.md) |
| 22 | Use cases: tokens, apps, and whole engineering | [22](./22_Use_Cases_Tokens_Apps_And_Whole_Engineering.md) |
| 23 | Whole-engineering wrap and staff checklist | [23](./23_Whole_Engineering_Wrap_And_Staff_Checklist.md) |

---

## Deep-study workflow

1. After **00–03**, compile the same tiny contract in Remix **and** with Foundry (or Hardhat) and write down both `solc` versions.
2. After **04–09**, add SPDX, a locked pragma, a custom error, and a failing `forge test` that you then fix.
3. After **10–13**, emit one event, store one mapping, and split an interface from an implementation.
4. After **14–16**, decode a calldata blob with `cast` (or Hardhat console) and record gas for one write path.
5. After **17–19**, put unit + fuzz tests and one analyzer in CI; triage findings instead of silencing them.
6. After **20–23**, verify a testnet deploy, inventory keys, and sign the wrap checklist—including “we did not need a proxy.”

---

## Further reading

- [Solidity documentation (latest)](https://docs.soliditylang.org/)
- [Solidity 0.8.36 docs (handbook snapshot)](https://docs.soliditylang.org/en/v0.8.36/)
- [Introduction to smart contracts](https://docs.soliditylang.org/en/v0.8.36/introduction-to-smart-contracts.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Installing the compiler](https://docs.soliditylang.org/en/v0.8.36/installing-solidity.html)
- [Ethereum developer docs](https://ethereum.org/developers/)
- [Smart contracts (ethereum.org)](https://ethereum.org/developers/docs/smart-contracts/)
- [EVM (ethereum.org)](https://ethereum.org/developers/docs/evm/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Hardhat documentation](https://hardhat.org/docs)
- [Remix IDE documentation](https://remix-ide.readthedocs.io/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity compiler security policy](https://github.com/argotorg/solidity/security/policy)

---

## References (hub links)

- [Solidity language home](https://soliditylang.org/)
- [Solidity blog (releases)](https://blog.soliditylang.org/)
- [Ethereum.org developers](https://ethereum.org/developers/)
- [Ethereum EIPs](https://eips.ethereum.org/)
- [Foundry](https://getfoundry.sh/)
- [Hardhat](https://hardhat.org/)
- [Remix IDE](https://remix.ethereum.org/)
