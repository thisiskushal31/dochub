# Calls, value transfer, and creating contracts

[← Back to Solidity](./README.md)

## What this chapter covers

How contracts **call** each other (`call`, `staticcall`, `delegatecall`), how **ETH** should move (**pull over push**), and how **`new` / CREATE / CREATE2** work. Defense-oriented: no attack recipes. Assumes **0.8.x** / **0.8.36**.

Calling another contract is not `fetch`. It is “pause my code, run theirs, maybe send coins, then continue — or undo me if they explode.” The three verbs (`call`, `staticcall`, `delegatecall`) differ in *whose storage* and *who `msg.sender` is*. Mix them up and you either brick a proxy or hand someone your filing cabinet.

---

## 1. Concepts

### 1. A Solidity call is not HTTP

When `A` calls `B.f()`:

- execution jumps into `B`’s code,
- `msg.sender` in `B` is `A` (unless `delegatecall`),
- `msg.value` is whatever `A` forwarded,
- gas is capped (63/64 rule—chapter **16**),
- if `B` reverts and `A` used a high-level call, `A` reverts too.

High-level:

```solidity
IERC20(token).transfer(to, amt); // bubbles revert; decodes bool
```

Low-level:

```solidity
(bool ok, bytes memory data) = target.call{value: amt}(payload);
if (!ok) revert CallFailed();
```

Use high-level calls unless you need custom gas, to swallow a revert (rare), or to talk to an unknown ABI.

### 2. Three call opcodes (mental model)

| Form | Code used | Storage used | `msg.sender` |
|------|-----------|--------------|--------------|
| `call` | Callee | Callee | Caller |
| `staticcall` | Callee | Callee **read-only** | Caller |
| `delegatecall` | Callee | **Caller** | Original caller |

**`delegatecall` is how proxies work** and how storage collisions destroy systems. Implementation code must match the caller’s layout. Untrusted `delegatecall` is giving someone your storage.

`staticcall` is what `view` external calls compile to. A callee that tries to write reverts.

### 3. Sending ETH: `transfer` / `send` / `call`

```solidity
// Historical — 2300 gas stipend, reverts on failure
payable(to).transfer(amt);

// Historical — 2300 stipend, returns bool
bool ok = payable(to).send(amt);

// Current default — forwards gas, YOU must check ok
(bool ok, ) = to.call{value: amt}("");
if (!ok) revert SendFailed();
```

`transfer`/`send` were sold as reentrancy protection because 2300 gas is too little to do much. That is **no longer a sound strategy**: gas costs change; some recipients need more gas to receive; stipend “safety” is not checks-effects-interactions.

**New code:** `call` + **check the bool** + **checks-effects-interactions** (and a reentrancy lock if you accept callbacks) — chapter **18**.

Here is a complete, boring, correct piggy bank. Read the order of lines in `withdraw`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract PiggyPull {
    mapping(address => uint256) public credit;
    error Zero();
    error SendFailed();

    function deposit() external payable {
        if (msg.value == 0) revert Zero();
        credit[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amt = credit[msg.sender];
        if (amt == 0) revert Zero();
        credit[msg.sender] = 0; // effect: forget the debt *first*
        (bool ok, ) = msg.sender.call{value: amt}(""); // interaction *second*
        if (!ok) revert SendFailed();
    }
}
```

**What just happened**

- `deposit` only updates *your* credit. It does not loop over users.
- `withdraw` zeros the credit **before** sending. If the receiver is a contract that calls back into `withdraw`, the credit is already `0`.
- If the send fails, the whole call reverts and the credit is restored (because the zeroing is undone). The user can try again.

That is **pull**: each person fetches their own money. **Push** (loop `call` to a list) fails if any recipient reverts, and invites callbacks in the middle of your loop.

### 4. Pull over push

Pushing ETH to a list of users in one tx fails if any recipient reverts (or is a hostile contract). The robust pattern: **record a credit; let them withdraw**.

```solidity
mapping(address => uint256) public pending;

function withdraw() external {
    uint256 amt = pending[msg.sender];
    pending[msg.sender] = 0;           // effect before interaction
    (bool ok, ) = msg.sender.call{value: amt}("");
    if (!ok) revert SendFailed();
}
```

Same idea for tokens: set state, then `transfer`.

### 5. Creating contracts

```solidity
Child c = new Child{value: 1 ether}(arg);
```

`new` uses **CREATE**: address depends on deployer + nonce. Constructor runs once.

**CREATE2** (`new Child{salt: s}(...)`) makes the address depend on deployer, salt, and init code hash—predictable before deploy. Useful for counterfactual wallets and factories. Also means **init code is part of the address**: change the constructor and the address changes (or you collide with a different bytecode at the same address if you are sloppy with salts—review literacy, chapter **20**).

---

## 2. Advanced concepts

### 1. The `CALL` family, precisely

Solidity’s `{value: v, gas: g}` options map onto EVM call opcodes. Literacy, not an exploit kit:

| Opcode | Writes callee storage? | Forwards value? | `msg.sender` in callee |
|--------|------------------------|-----------------|------------------------|
| `CALL` | yes | yes | caller |
| `STATICCALL` | no (writes revert) | no | caller |
| `DELEGATECALL` | **caller’s** storage | no (uses caller’s context) | **unchanged** |
| `CALLCODE` | caller’s storage (legacy) | yes | caller — **do not use** |

`addr.staticcall(data)` / `view` external calls → `STATICCALL`. `addr.delegatecall(data)` → `DELEGATECALL`. High-level `token.f()` → `CALL` (or `STATICCALL` if `view`/`pure`).

**63/64 rule (EIP-150):** a call can forward at most `gas - floor(gas/64)` of remaining gas. The caller always keeps ≥ 1/64 to finish. This is why “out of gas in the callee” does not always OOG the caller, and why `gasleft()` is not an access-control tool.

### 2. The 2300 stipend

`transfer` / `send` do `CALL` with **2300 gas**. That used to be enough for a log and not much else. Gas schedules change; some recipients need more than 2300 just to receive; stipend-as-reentrancy-defense is **not** a strategy. New code: `call` + check `ok` + CEI (+ lock if you accept callbacks).

### 3. Forced ETH

`selfdestruct` (deprecated; effects changing) and coinbase payments can put ETH on an address **without** running `receive`. Do not assume `address(this).balance == accounted`. Account with your own mappings. A `require(address(this).balance == x)` invariant is usually wrong.

### 4. CREATE vs CREATE2

```text
CREATE  address = last20(keccak256(rlp([sender, nonce])))
CREATE2 address = last20(keccak256(0xff . sender . salt . keccak256(init_code)))
```

`new Child(arg)` → CREATE. `new Child{salt: s}(arg)` → CREATE2. **Init code** includes constructor args encoding; change the constructor or the args and the CREATE2 address changes. Same salt + same init code + same deployer = same address. After a successful create, that address has code; a second CREATE2 with the same triple fails.

Nonce of a contract increments on each CREATE from it (not on calls). Address prediction for CREATE needs the current nonce.

### 5. `delegatecall` storage collision

If implementation slot 0 is `owner` and proxy slot 0 is `implementation`, the first write to `owner` **overwrites the implementation pointer**. ERC-1967 / ERC-7201 namespaced slots exist so you do not do this. If you are not writing a proxy, you should not be `delegatecall`ing user-supplied addresses.

### 6. Return bombs

A callee can return megabytes. `abi.decode` / high-level calls copy returndata into memory (expansion gas). Against untrusted contracts, bound what you copy (`returndatasize` + a cap in a reviewed helper). Know the hazard; do not invent a half-copy decoder in an incident.

### 7. Token `transfer` that returns nothing

Some old tokens omit `returns (bool)`. High-level `IERC20.transfer` may revert on empty returndata depending on the wrapper. Use a well-tested helper (OZ `SafeERC20`) rather than inventing one.

### 8. `selfdestruct`

Scheduled for severe restriction / removal of its useful effects. Do not design new systems around it. Treat remaining uses as brownfield.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | High-level interface calls; pull withdrawals |
| **Systems** | Know CREATE vs CREATE2 address formulas at a literacy level |
| **Security** | No untrusted `delegatecall`; check `call` success; CEI |
| **Operations** | Factories and salts recorded; no surprise CREATE2 |
| **Software engineering** | Value-moving paths have tests for revert-on-failed-send |

---

## 4. Staff-level review checklist

- [ ] ETH out uses `call` + success check + CEI (or a reviewed library), not stipend folklore.
- [ ] Withdrawals are **pull** if recipients can be contracts.
- [ ] No `delegatecall` to an address the user chooses.
- [ ] High-level calls preferred; low-level `call` always inspects `ok`.
- [ ] Accounting does not assume `balance == sum(credits)`.
- [ ] CREATE2 salts and init code are under change control.

---

## References

- [Contracts — creating contracts, functions](https://docs.soliditylang.org/en/v0.8.36/contracts.html)
- [Common patterns (withdrawal, access)](https://docs.soliditylang.org/en/v0.8.36/common-patterns.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Ethereum: smart contract security](https://ethereum.org/developers/docs/smart-contracts/security/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins)
- [EIP-150 (63/64 gas)](https://eips.ethereum.org/EIPS/eip-150)
- [EIP-1014 (CREATE2)](https://eips.ethereum.org/EIPS/eip-1014)
- [EIP-1167 (minimal proxy)](https://eips.ethereum.org/EIPS/eip-1167)
