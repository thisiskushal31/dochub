# What is Solidity and the EVM

[← Back to Solidity](./README.md)

## What this chapter covers

Four words people mash together — **Solidity**, **solc**, the **EVM**, the **chain** — and what a **smart contract** actually is. Why the language looks a bit like JavaScript but refuses to behave like a server. Where this work sits in application, systems, security, and ops.

Assumes **Solidity 0.8.x** (snapshot **0.8.36**).

---

## 1. Concepts

### 1. Four layers (keep them separate and life gets easier)

Think of a kitchen:

| Layer | Kitchen picture | In this world |
|-------|-----------------|---------------|
| **Solidity** | The recipe you write | High-level language |
| **solc** | Translating the recipe into station cards | Compiler → bytecode + ABI |
| **EVM** | The kitchen equipment every restaurant in the franchise uses | Virtual machine that runs bytecode |
| **Chain / client** | The franchise agreeing on what was cooked today | Nodes + blocks (geth and friends) |

You write Solidity. `solc` emits **bytecode** (what the machine runs) and an **ABI** (the menu of function names and types). A node’s EVM executes that bytecode when a transaction or call hits the address.

Other languages (Vyper, Yul, Huff) can target the same kitchen. Solidity is the common one. It is not the chain, and it is not the only EVM language.

### 2. A contract you can hold in your head

This is the whole idea in one file. We will keep meeting this shape.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

/// A public notebook: anyone can write a number, anyone can read it.
/// That is a *terrible* product and a *perfect* first mental model.
contract Notebook {
    uint256 public value; // one 256-bit word in *storage* (on-chain)

    // Anyone may call this. It changes storage → needs a transaction.
    function write(uint256 next) external {
        value = next;
    }

    // Optional: same as the auto-getter `value()`, written out so you see `view`.
    function read() external view returns (uint256) {
        return value;
    }
}
```

**What just happened**

- `Notebook` is a type you can **deploy**. After deploy it has an **address**.
- `value` is not a variable in RAM on your laptop. It is a slot in that address’s storage.
- `write` is the only way *this* contract changes that slot (unless you add more functions).
- `read` / `value()` do not change anything. Nodes will usually answer without a transaction.

That is an **application API** (two functions), a **systems object** (storage + gas), and a **security joke** (no access control). Chapter **08** and **18** put a lock on `write`. For this chapter, notice the layers: you wrote Solidity; `solc` will emit bytecode; the EVM will run `write` when someone sends a transaction to that address.

### 3. What Solidity is good at (and what it refuses to be)

Solidity is **statically typed** and **contract-oriented**. A file can hold contracts, interfaces, libraries, custom types, and errors. You will live in:

- state variables and functions with **visibility**
- **inheritance** and **interfaces**
- **events** (logs) and **custom errors**
- **modifiers**
- explicit **data locations** (storage / memory / calldata / transient)

It borrowed looks from C++, Python, and JavaScript (`function`, braces, `pragma`). It did **not** borrow a filesystem, threads, `null`, or “sleep for 200 ms.” There is no `fetch("https://…")`. If you need the price of ETH, some *other* system must send that number in. That is a **trust** problem, not a missing import.

### 4. What a smart contract is, operationally

On this track, a contract is:

1. **Code** (runtime bytecode) at an address,
2. **Storage** (persistent 32-byte slots),
3. A **balance** (wei the address holds),
4. Metadata explorers use to match source to bytecode.

It runs when called. It can call other contracts. It can emit logs. It cannot see your disk or the internet.

The 1990s phrase “smart contract” is historical color. Here it means **EVM program + state**.

### 5. What the EVM promises (and what it shrugs at)

The EVM is a **sandboxed stack machine**. Words are **256 bits**. Every step costs gas. Account state is isolated.

It *does* give you:

- no infinite loop for free,
- no “read the other contract’s RAM,”
- communication only through **calls** and **return data**.

It does *not* give you:

- fair business logic,
- an honest oracle,
- a correctly initialized proxy.

Consensus makes execution **consistent**, not **wise**.

### 6. Why teams still use it

- The EVM is the shared runtime for Ethereum and many compatible chains.
- Wallets, explorers, and libraries assume Solidity-shaped ABIs.
- Auditors and hiring markets cluster here.

Pick **Vyper** when you want a smaller language. Pick **not a chain** when a database and a service are the honest design.

### 7. Whole-engineering identity

| Lens | Solidity’s job |
|------|----------------|
| **Application** | A precise, permissioned API others can call |
| **Systems** | Fit gas, storage, and the call model |
| **Security** | Assume adversarial callers and public state |
| **Operations** | Pin compilers, verify source, custody keys |
| **Software engineering** | Tests, interfaces, NatSpec, reviewable diffs |

---

## 2. Advanced concepts

### 1. The account is four fields, not a “user”

At the protocol level an account is roughly:

| Field | Meaning |
|-------|---------|
| **nonce** | EOA: number of txs sent. Contract: number of `CREATE`s from this address |
| **balance** | Wei |
| **storageRoot** | Merkle root of the 2²⁵⁶-slot storage trie (empty if unused) |
| **codeHash** | `keccak256` of runtime bytecode; EOAs share the empty-code hash |

There is no `username`. `msg.sender` is 20 bytes. A contract with empty code and a balance is still an account — sending ETH to a typo can burn it.

### 2. The EVM is a stack machine with a 256-bit word

- **Stack:** 1024 slots, each 32 bytes. Most opcodes pop/push here (`ADD`, `SLOAD`, `CALL`).
- **Memory:** a byte array that expands; expansion costs gas (quadratic-ish). Cleared after the call.
- **Storage:** the account’s persistent map `uint256 → uint256`.
- **Calldata:** the input tape for *this* call (immutable).
- **Returndata:** what the last external call returned.
- **Transient storage (Cancun):** another `uint256 → uint256` map, discarded at end of the *transaction*, reverted if the writing call reverts (EIP-1153). Independent layout from persistent storage.

Program counter walks bytecode. There are no threads and no OS syscalls. **Precompiles** (addresses `0x01`–`0x0a` and later additions: ecrecover, SHA-256, modexp, pairing, point eval, …) are the blessed “native” functions.

### 3. Message call vs create (what a transaction actually is)

A top-level transaction is either:

- **Message call:** `to` is set. The EVM runs that account’s code (or transfers value to an EOA).
- **Create:** `to` is empty. Init code runs; leftover runtime code is stored; an address is assigned (chapter **15**).

Nested, the same two exist as opcodes: `CALL` / `STATICCALL` / `DELEGATECALL` / `CREATE` / `CREATE2`. Solidity’s `token.transfer(...)` is a `CALL`. `view` external calls are `STATICCALL`. Proxies are `DELEGATECALL`.

**Call stack depth** is capped (historically 1024). You will hit *gas* long before you hit depth in honest code; still, recursive patterns are a review smell.

### 4. Revert is a machine state, not an exception object

`REVERT` (and historic `INVALID`) unwind the current call’s **storage, transient, and log** changes, return a data blob, and keep the gas already used (except the unused remainder). A high-level Solidity call that sees a revert **bubbles** unless you used low-level `call` / `try`. A successful inner `CALL` that you then ignore can leave *their* state changed while *you* continue — that is a deliberate, dangerous choice (chapter **15**).

### 5. It is not “JavaScript on a blockchain”

```solidity
// Looks harmless. If `ids` can grow forever, one day nobody
// can afford to run this loop. Funds can get stuck behind gas.
function sumAll(uint256[] storage ids) internal view returns (uint256 s) {
    for (uint256 i = 0; i < ids.length; ++i) {
        s += ids[i]; // each SLOAD is a cold/warm storage read (ch 16)
    }
}
```

- A `string` is a dynamic byte array, not a UTF-8 object.
- Time is `block.timestamp` — producer-set within protocol bounds — not NTP.
- There is no IEEE float; money uses integer scaling (`1e18` “wei-style” decimals).

### 6. Determinism is a feature and a trap

Every node must get the same answer. Therefore: no filesystem, no `fetch`, no “ask the wall clock,” no secure RNG from `prevrandao` / `blockhash` alone. Off-chain facts enter through a **trust boundary** you write down (oracle, owner push, L2 message).

### 7. “EVM compatible” is a family, not a pin

Same bytecode ideas; different **gas schedules**, **precompiles**, and **hard-fork opcodes** (`PUSH0`, `TSTORE`, blobs). `solc --evm-version` must match the chain you deploy to (chapters **02**, **16**, **20**).

### 8. Execution context (what every opcode can see)

While code runs, the EVM exposes a fixed context. Solidity globals are thin wrappers over it:

| Context | Solidity | Notes |
|---------|----------|-------|
| Caller | `msg.sender` | Immediate caller; unchanged under `DELEGATECALL` |
| Call value | `msg.value` | Wei attached to *this* frame |
| Calldata | `msg.data` | Immutable input tape |
| Code | — | This account’s code (`DELEGATECALL`: *other* account’s code) |
| Storage | — | This account’s map (`DELEGATECALL`: *caller’s* map) |
| Gas remaining | `gasleft()` | After EIP-150, callees never get 100% |
| Returndata | — | Buffer from the last call; `returndatasize` / `returndatacopy` |
| Block / tx | `block.*` / `tx.*` | Chapter **07** |

There is no “thread local” beyond this frame. Nested calls push a new frame; revert pops it and undoes its journal.

### 9. Precompiles (the blessed native table)

Precompiles are special addresses with protocol-defined behavior. Common L1 set (addresses as decimal / hex):

| Addr | Name | Typical use |
|------|------|-------------|
| `0x01` | ecrecover | Recover signer from `(hash, v, r, s)` |
| `0x02` | SHA-256 | Bitcoin-style hash |
| `0x03` | RIPEMD-160 | |
| `0x04` | identity | Memcpy |
| `0x05` | modexp | Modular exponentiation |
| `0x06`–`0x08` | bn256 / pairing | ZK / pairing checks |
| `0x09` | blake2f | |
| `0x0a` | point evaluation | KZG / blobs (Cancun) |

Calling a precompile is still a `CALL` with calldata. Gas is schedule-specific. Chains that claim “EVM compatible” sometimes **omit or alter** precompiles — that is a delivery pin, not a slogan.

### 10. Dispatcher shape (why selectors matter)

Runtime bytecode usually starts with a **function dispatcher**:

```text
load first 4 bytes of calldata → compare to known selectors → JUMP to body
no match → fallback / revert
empty calldata → receive (if payable + empty) path
```

Every public/external function (and public getter) costs dispatcher comparisons. That is why “one giant contract with 80 external functions” is both an ABI and a **gas** problem. Internal functions are `JUMP`s inside a body — no selector.

### 11. Journal and refunds (mental model)

Successful writes and logs are journaled. On `REVERT`, the journal for that frame is discarded. On success, some schedules **refund** gas for clearing storage (nonzero→zero), capped (historically ≤ gas_used/2, then EIP-3529 tightened). Refunds are not income; they only reduce the gas you pay for *this* tx. Do not design “clear slots to mint ETH.”

---

## 3. Applications and use cases

| Domain | Why Solidity shows up | What this track will not become |
|--------|----------------------|----------------------------------|
| Tokens and allowances | A shared interface many wallets already know | A token-factory cookbook |
| Custody and spend rules | Multi-sig, vesting, escrow | Hardware-wallet UX |
| On-chain config | Shared, attributable state | A general database course |
| Settlement | Rules nobody can quietly edit | A full DeFi encyclopedia |
| Infra | Deploy, verify, monitor | A geth internals book |

If the problem is “our service should do X for logged-in users,” you want a server. If the problem is “we do not share an operator, but we must share a rule,” you are in this track.

For **what this track deliberately does not become** (L2 encyclopedias, wallet UI, consensus) and **where the EVM/compiler are moving** (forks, EIP-7702, AA, EOF’s removal), see chapter **24** — the compass after you have the machine model.

---

## 4. Staff-level review checklist

- [ ] Design docs name **language vs EVM vs chain vs account** without treating them as synonyms.
- [ ] The project can answer “why must this be a contract?” in one paragraph.
- [ ] Off-chain inputs (prices, randomness, identity) are listed as **trust assumptions**.
- [ ] Sibling languages (Vyper) and client stacks (JS/TS) are not pretended to be in scope here.
- [ ] New work targets **0.8.x**, not a pre-0.8 tutorial estate, unless the repo is explicitly brownfield.

---

## References

- [Introduction to smart contracts](https://docs.soliditylang.org/en/v0.8.36/introduction-to-smart-contracts.html)
- [Solidity language home](https://soliditylang.org/)
- [Ethereum: smart contracts](https://ethereum.org/developers/docs/smart-contracts/)
- [Ethereum: EVM](https://ethereum.org/developers/docs/evm/)
- [Ethereum: accounts](https://ethereum.org/developers/docs/accounts/)
- [Ethereum: EVM opcodes](https://ethereum.org/developers/docs/evm/opcodes/)
- [Ethereum: gas](https://ethereum.org/developers/docs/gas/)
- [Ethereum: blocks](https://ethereum.org/developers/docs/blocks/)
- [Layout in storage (incl. transient)](https://docs.soliditylang.org/en/v0.8.36/internals/layout_in_storage.html)
