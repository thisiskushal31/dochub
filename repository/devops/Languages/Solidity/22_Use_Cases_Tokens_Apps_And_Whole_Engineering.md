# Use cases: tokens, apps, and whole engineering

[← Back to Solidity](./README.md)

## What this chapter covers

Where Solidity **shows up** in real systems: **token and interface literacy** (ERC-20 / 721 / 1155 / 165 / 2612), typical application shapes, and the same idea through **application, systems, security, ops, and SE** lenses. This is not a token-factory cookbook or a DeFi product manual. Assumes **0.8.x** / **0.8.36**.

Most useful contracts are boring on purpose: a vault, a registry, a token that only mints when *your* rule says so. The ERC numbers are shared menus so wallets do not need a custom UI for every address. Your job is the rule, not another `balanceOf` from memory.

---

## 1. Concepts

### 1. Standards are interfaces plus social contract

An **ERC** is a documented ABI and set of events/rules. Compiling `transfer` is not the same as **behaving** like ERC-20 (return values, `Transfer` events, allowance races). Integrate against the **standard + the actual token**, not a classroom diagram.

| Standard | Job | Review focus |
|----------|-----|----------------|
| **ERC-20** | Fungible balances + allowances | `transfer`/`transferFrom` return, fees, rebase |
| **ERC-721** | Unique IDs, owner-of, approvals | Safe transfer callbacks, enumeration optional |
| **ERC-1155** | Multi-token | Batch semantics, receiver hooks |
| **ERC-165** | Interface detection | Not a honesty oracle |
| **ERC-2612** | `permit` (signature allowance) | EIP-712 domain, nonce, deadline |

Prefer **OpenZeppelin** (or equally maintained) implementations over writing ERC-20 from a tutorial. Your job is usually **the product rule** (when can mint happen), not another `balanceOf`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

interface IERC20 {
    function transfer(address to, uint256 amt) external returns (bool);
    function transferFrom(address from, address to, uint256 amt) external returns (bool);
    function balanceOf(address a) external view returns (uint256);
}

/// A toy locker: pull tokens in, owner can release them.
/// Real lockers need more (pause, rescue, fees). This shows the *menu*.
contract Locker {
    IERC20 public immutable token;
    address public immutable owner;

    error NotOwner();
    error TransferFailed();

    constructor(IERC20 t) {
        token = t;
        owner = msg.sender;
    }

    function lock(uint256 amt) external {
        // The token runs *its* code here. Treat that as an external call (ch 15, 18).
        bool ok = token.transferFrom(msg.sender, address(this), amt);
        if (!ok) revert TransferFailed();
    }

    function release(address to, uint256 amt) external {
        if (msg.sender != owner) revert NotOwner();
        bool ok = token.transfer(to, amt);
        if (!ok) revert TransferFailed();
    }
}
```

**What just happened:** you did not invent `balanceOf`. You spoke the ERC-20 menu. `lock` is an external call into a token you may not control — fee-on-transfer tokens will make `amt` and `balanceOf(this)` disagree. That is the “weird token” problem below, not a reason to hand-roll ERC-20.

### 2. Application shapes that stay in scope

| Shape | Solidity’s role | Not this track |
|-------|-----------------|----------------|
| **Vault / escrow** | Credits, pull withdraw, roles | Full exchange UI |
| **Allowlist / registry** | On-chain config others call | General database design |
| **Minimal token** | Interface + mint policy | Meme-coin launch playbook |
| **NFT that gates access** | `ownerOf` check | Marketplace clone |
| **Multisig / timelock** | Spend rules | Hardware wallet UX |
| **Factory** | CREATE2 + init | Every L2 factory idiom |

If the honest design is a Postgres row and a job queue, do not put it on-chain to “be Web3.”

### 3. Client boundary

Wallets and dapps speak **ABI** via **ethers.js** or **viem** (JS/TS track). Solidity engineers still own:

- stable events and errors,
- no surprise `delegatecall`,
- verified source,
- chain ids in signatures.

Do not grow this folder into a React course.

---

## 2. Advanced concepts

### 1. ERC-20, mechanically

The interface is small; the bugs are in the **edges**:

| Piece | What staff checks |
|-------|-------------------|
| `transfer` / `transferFrom` | return `bool`; update allowances; emit `Transfer` |
| `approve` | front-runable N→M; prefer `increaseAllowance` or `permit` |
| `decimals` | **display** only — never assume 18 in math without reading it |
| `totalSupply` vs `sum(balances)` | invariant; fee-on-transfer breaks naive vault accounting |
| `permit` (ERC-2612) | EIP-712 domain + nonce + deadline (chapter **18**) |

A vault that assumes `balanceOf(this)` increases by exactly `amt` after `transferFrom` desyncs on fee-on-transfer / rebasing / tax tokens. **Balance-diff accounting** or an allowlist of boring tokens.

Missing `returns (bool)` is still in the wild — `SafeERC20` (chapter **15**).

### 2. ERC-721 / 1155 hooks

`safeTransferFrom` on 721 calls `onERC721Received` on a contract recipient. 1155 calls `onERC1155Received` / `BatchReceived`. That is an **external call in the middle of your flow** — CEI + lock (chapter **18**). `_mint` that is “safe” has the same hook. `transferFrom` (unsafe) skips the hook and can land tokens in a contract that cannot send them back — a product choice, not a free lunch.

ERC-1155 batches are loops. Unbounded `ids[]` is a gas/DoS review like any other array.

### 3. Weird tokens (checklist)

Fee-on-transfer, rebasing, missing return values, pause, blacklist, upgradeable tokens, callbacks (`ERC777`/`ERC1363`), `decimals() == 0`, huge `decimals`. Each one breaks a different assumption. Write down which class you accept.

### 4. Permits and phishing

`permit` is a UX win and a signature-phishing surface. Domain separator must bind `name`, `version`, `chainId`, `verifyingContract`. Users should see **what** they sign. Your contract still must reject bad domains, bad nonces, expired deadlines, and `address(0)` signers.

### 5. Composability is a threat model

Your `view` share price may be called by someone else **in the same transaction** as your state changes (read-only reentrancy). If that view is used as an oracle, you inherited their risk (and they inherited yours). Vaults that update balances *then* update a cached price — or that lock views that read mid-update state — need an explicit story.

### 6. Proxies, clones, and “one implementation, many stores”

Minimal proxies (EIP-1167) `delegatecall` a singleton implementation. Each clone has its own storage and its own `initialize`. Same review as chapter **20**, multiplied by N addresses. Factories must record implementation + salt + init args.

---

## 3. Applications and use cases

### Application

Ship the smallest contract that encodes the **shared rule**. Put catalogs, images, and chat off-chain. Emit events so indexers can rebuild views.

### Systems

Account for gas (who pays mint?), storage (do not store images), and call depth (hooks). Pin `evmVersion` to the chain you actually use.

### Security (including cybersecurity)

Threat-model: admin keys, minters, oracles, hooks, allowances, upgradeability. Key compromise is a **cyber** incident with on-chain blast radius—custody belongs in chapter **20**.

### Operations

Monitor `Transfer`, pause, and admin events. Verify source. Keep a runbook for “admin key rotation” and “pause.” Testnet dress rehearsal before mainnet.

### Software engineering

Interfaces in their own files, OZ version pinned, tests for the **policy** (who can mint), NatSpec on external functions, CI from chapter **17**–**19**.

| Role | What “done” looks like |
|------|------------------------|
| Protocol engineer | Invariants hold under fuzz |
| App engineer | ABI + events stable; clients typed |
| SRE / ops | Verify + monitors + keys |
| Security | Review checklist **18** signed |
| Auditor | Frozen commit + spec |

---

## 4. Staff-level review checklist

- Token integrations name the **standard** and the **weirdness** they assume away (or handle).
- OZ (or equivalent) version is pinned; no hand-rolled ERC-20 without a reason.
- Hooks treated as untrusted external calls.
- Off-chain data is not faked as on-chain truth.
- JS/TS client work is linked, not duplicated here.
- “Use case” PRs still passed chapters **17**–**20**, not only a demo UI.

---

## References

- [Ethereum: token standards](https://ethereum.org/developers/docs/standards/tokens/)
- [EIP-20](https://eips.ethereum.org/EIPS/eip-20)
- [EIP-721](https://eips.ethereum.org/EIPS/eip-721)
- [EIP-1155](https://eips.ethereum.org/EIPS/eip-1155)
- [EIP-165](https://eips.ethereum.org/EIPS/eip-165)
- [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612)
- [EIP-1167 (minimal proxy)](https://eips.ethereum.org/EIPS/eip-1167)
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [ethers.js](https://docs.ethers.org/)
- [viem](https://viem.sh/)
- [JavaScript track](../JavaScript/README.md)
- [TypeScript track](../TypeScript/README.md)
- [Vyper track](../Vyper/README.md)
