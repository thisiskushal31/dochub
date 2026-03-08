# Cairo — Smart contracts on Starknet

[← Cairo README](./README.md)

Starknet contracts are written in Cairo. They have storage, external and internal functions, and events. Contracts are deployed as classes and invoked via their ABI. This topic covers introduction and classes, building (types, storage, functions, events), interactions (ABI, cross-contract calls, serialization), advanced patterns (storage, components, upgradeability, L1–L2, oracles, examples), and security and testing. From a **cybersecurity engineering** perspective, the security, testing, and static analysis sections here are the main entry points; topic 21 expands on secure SDLC, threat modeling, and audits. From a **DevOps** perspective, building and testing here integrate with CI/CD (topic 21).

**Prerequisites:** This topic assumes you are comfortable with the core language: variables, types, functions, structs, enums, modules, and traits (topics 1–14). Ownership (topic 7) and error handling (topic 15) matter for contract patterns. If you have not read those yet, the sections below will still introduce each idea, but you will get more out of them after the basics.

---

## Writing your first contract (minimal walkthrough)

To go from “I have Cairo installed” to “I wrote a Starknet contract,” follow these steps. You will create a project, define one storage value, and expose a getter and setter.

1. **Create a Starknet package.** From a terminal: `scarb new my_contract --name my_contract`. When prompted for the test runner, choose **Starknet Foundry**. This gives you a `Scarb.toml` with a `[starknet-contract]` target and a `src/` directory.

2. **Add the contract module.** In `src/lib.cairo`, declare a module (e.g. `mod my_contract;`) and create `src/my_contract.cairo`. In that file, define a **contract module**: a `mod` annotated with **#[starknet::contract]**.

3. **Declare storage.** Inside the contract module, add a struct annotated with **#[storage]** and one field, e.g. a **StorageMap** or a single value (using the Starknet storage types). This is the persistent state of your contract.

4. **Define the interface and implementation.** Define a **trait** with **#[starknet::interface]** that takes `TContractState` and declares `fn get_value(...)` and `fn set_value(...)`. Then write an **impl** of that trait for **ContractState** with **#[abi(embed)]**, and implement each function: in the setter, write to storage; in the getter, read from storage and return.

5. **Build and test.** Run `scarb build` to compile the contract and generate the ABI. Use **Starknet Foundry** (`snforge test`) to write a test that deploys the contract (or a test contract), calls `set_value`, then `get_value`, and asserts the result. Once this works, you have a minimal contract; the rest of this topic expands on storage patterns, events, cross-contract calls, and security.

The exact syntax for the interface, storage struct, and impl is shown in the **Contract storage** section below. Topic **21** (Use cases and case studies) then shows how the same ideas apply to voting contracts, ERC20-style tokens, and other applications.

---

## Introduction: contract classes and instances

A **contract class** defines the code and interface of a contract. Deploying a class creates an **instance**: a contract at a specific address with its own storage. The same class can be deployed many times; each instance has independent state. The **ABI** (Application Binary Interface) describes the class’s external functions and events so that clients and other contracts can call and decode them.

---

## Starknet types

Starknet contracts use types from the **starknet** crate: **ContractAddress**, **ClassHash**, **StorageAddress**, and system types for low-level access. Storage is key–value; keys and values are constrained by the Starknet storage model. Use the documented Starknet types for addresses, hashes, and storage layout so your contract is compatible with the network.

---

## Contract storage

Storage is declared in a struct annotated with **#[storage]** and lives in the contract instance. **StorageMap** (and similar abstractions) map keys to values; **StorageVec** provides an append-only sequence. All keys are effectively felt252-based; value types must be serializable and respect storage costs. Reading and writing storage is done through the storage struct; the compiler and runtime handle persistence.

```cairo
#[starknet::interface]
trait IMyContract<TContractState> {
    fn get_value(ref self: TContractState, key: u256) -> u128;
    fn set_value(ref self: TContractState, key: u256, value: u128);
}

#[starknet::contract]
mod MyContract {
    use starknet::StorageMapReadAccess;
    use starknet::StorageMapWriteAccess;

    #[storage]
    struct Storage {
        map: StorageMap<u256, u128>,
    }

    #[abi(embed)]
    impl MyContractImpl of super::IMyContract<ContractState> {
        fn get_value(ref self: ContractState, key: u256) -> u128 {
            self.map.read(key)
        }
        fn set_value(ref self: ContractState, key: u256, value: u128) {
            self.map.write(key, value);
        }
    }
}
```

---

## Contract functions

**External** functions are callable from outside the contract (users, other contracts). They are marked with **#[external(v0)]** (or the current version) and must use the **ContractState** or the trait’s state type. **Internal** functions are for use only inside the contract. Constructor logic runs at deployment. Use **#[abi(embed)]** so the ABI is generated from the trait implementation.

---

## Contract events

**Events** are declared with **#[event]** and emitted with **emit**. They allow off-chain indexers and UIs to react to state changes. Event data is stored in the Starknet log; keep payloads small and structured so they can be decoded from the ABI.

---

## Contract class ABI

The ABI is a JSON description of the contract’s external interface: function names, parameters, return types, and events. Tools use it to encode calls and decode results. Scarb (or the Starknet plugin) generates the ABI when building a contract; it is required for deployment and for other contracts to call yours.

---

## Interacting with another contract

To call another contract, use a **dispatcher**: a type generated from the target contract’s ABI. You instantiate the dispatcher with the contract address and then call its methods. Calls are synchronous from the caller’s perspective; the callee’s state changes are applied before your contract continues. Use **library_call** or the appropriate syscall when executing code from another **class** without deploying an instance.

---

## Executing code from another class

**Library calls** execute code from a class (e.g. a shared library or implementation contract) in the context of the current contract. This supports patterns like proxies and shared logic. The caller specifies the class hash and the function selector; the executed code runs with the **caller’s** storage and context.

---

## Serialization of Cairo types

Cross-contract calls and storage require serialization. The Starknet and core libraries provide serialization for common types and for ABI-defined structs. Use the standard serialization APIs so that data is encoded and decoded consistently and gas costs are predictable.

---

## Optimizing storage costs

Storage writes are expensive. Use packing, single-field updates, and appropriate key sizes to reduce cost. Avoid redundant storage and prefer storage maps over large single values when access is sparse. Benchmark and profile on testnets to validate gas usage.

---

## Composability and components

**Components** are reusable contract modules: storage and logic that can be composed into multiple contracts. They support dependency injection and shared behavior (e.g. access control, upgradeability). Testing components in isolation and then in a full contract reduces bugs and speeds development.

---

## Upgradeability

Upgradeability can be implemented with a **proxy** contract that delegates calls to an implementation contract. The proxy holds the implementation class hash; upgrading means changing that hash so that future calls use new code. Storage layout must remain compatible across upgrades, or use namespaced storage / component patterns to isolate state.

---

## L1–L2 messaging

Starknet supports message passing to and from L1 (Ethereum). Contracts can send messages to L1 and receive and consume messages from L1. Use the system calls and follow the documented patterns so that message ordering and finality are respected. Typical use cases include deposits, withdrawals, and cross-layer coordination.

---

## Oracle interactions

Contracts can consume **oracle** data (e.g. price feeds, randomness) by calling oracle contracts or by receiving data through L1–L2 messaging. Price feeds are often provided by dedicated contracts; randomness may use a commit–reveal or VRF-style design. Validate oracle data and handle staleness and failure in your logic.

---

## Example: voting contract

A voting contract might store proposals, votes per option, and voter eligibility. Use **StorageMap** for proposal and vote state; emit events on proposal creation and vote cast. Restrict voting to an allowed set (e.g. NFT holders or a snapshot) and enforce one vote per voter. Testing should cover edge cases (double vote, unknown proposal, etc.).

---

## Example: ERC20-style token

An ERC20 contract stores balances (e.g. **StorageMap&lt;ContractAddress, u256&gt;**), allowances, and total supply. **transfer**, **approve**, and **transfer_from** update storage and emit events. Use standard event signatures and checks (balance, allowance) so that wallets and other contracts can integrate. Consider reentrancy and rounding when dividing amounts.

---

## Security: general recommendations

Validate all inputs and assume that callers and other contracts can be malicious. Use access control (e.g. an owner or role-based checks) for sensitive functions. Avoid reentrancy by following checks–effects–interactions and by using reentrancy guards where appropriate. Prefer pull over push for payments. Document invariants and test them.

---

## Testing smart contracts

**Unit tests** exercise contract logic in isolation (often with a test runner and mock state). **Integration tests** deploy one or more contracts and run full transactions. **Property-based tests** generate random inputs to find edge cases. **Fork testing** runs tests against a snapshot of mainnet or testnet state. Combine these so that security-critical paths are well covered.

---

## Static analysis tools

Static analyzers and linters can find common bugs (e.g. unchecked arithmetic, unsafe patterns) before deployment. Use them in CI and fix or justify any findings. Keep tool versions and rules updated so that new language and contract patterns are supported.

---

## Appendix (Starknet): system calls and Sierra

**System calls** are the low-level interface between a contract and the Starknet OS: storage, calls, L1 messaging, etc. Most development uses the higher-level starknet crate; system calls matter when optimizing or auditing. **Sierra** is the intermediate representation of Cairo used by the Starknet runtime; understanding it helps when debugging or analyzing deployed bytecode.

---

## Further reading

- [The Cairo Book — Introduction to Smart Contracts](https://www.starknet.io/cairo-book/ch100-00-introduction-to-smart-contracts.html)
- [The Cairo Book — Building Starknet Smart Contracts](https://www.starknet.io/cairo-book/ch101-00-building-starknet-smart-contracts.html)
- [The Cairo Book — Starknet Contract Interactions](https://www.starknet.io/cairo-book/ch102-00-starknet-contract-interactions.html)
- [The Cairo Book — Building Advanced Starknet Smart Contracts](https://www.starknet.io/cairo-book/ch103-00-building-advanced-starknet-smart-contracts.html)
- [The Cairo Book — Starknet Smart Contracts Security](https://www.starknet.io/cairo-book/ch104-00-starknet-smart-contracts-security.html)
- [The Cairo Book — Appendix (Starknet)](https://www.starknet.io/cairo-book/appendix-000.html)
- [Cairo README](./README.md) — Topic index.
