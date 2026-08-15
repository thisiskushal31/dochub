# Units, globals, and blockchain context

[← Back to Solidity](./README.md)

## What this chapter covers

**Ether and time units**, and the **globally available** objects (`msg`, `tx`, `block`, `abi`, cryptographic helpers). What they mean on **0.8.x** (snapshot **0.8.36**), including **`block.prevrandao`** and globals you should not treat as randomness or authorization.

These names look like magic globals in JavaScript. They are not “the environment.” They are **this call**, **this transaction**, and **this block** — filled in by the EVM for the duration of the execution.

---

## 1. Concepts

### 0. One contract that uses the globals you will actually type

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract ContextDemo {
    event Paid(address indexed caller, address indexed origin, uint256 value);

    function whoAmI() external payable returns (address caller, uint256 valueSent, uint256 time) {
        caller = msg.sender;       // who called *this* function
        valueSent = msg.value;     // wei attached to *this* call (0 if not payable / nothing sent)
        time = block.timestamp;    // producer-set clock, good to the day, not the millisecond
        emit Paid(msg.sender, tx.origin, msg.value);
        // tx.origin = the EOA that started the whole transaction.
        // Useful in a log. Dangerous as a lock (see below).
    }

    function onWhichChain() external view returns (uint256) {
        return block.chainid; // 1 mainnet, other numbers elsewhere — bind signatures to this
    }
}
```

**What just happened**

- You called `whoAmI` from your wallet and sent `0.01 ether`. `msg.sender` is your wallet. `msg.value` is `0.01 ether` in wei.
- If a *router contract* called `whoAmI` for you, `msg.sender` would be the **router**, not you. `tx.origin` would still be you. That is why auth uses `msg.sender`.
- `block.chainid` is how you stop a testnet signature from working on mainnet.

### 1. Ether units

```solidity
uint256 one = 1 ether;   // 10**18 wei
uint256 fee = 5 gwei;    // 10**9 wei
uint256 dust = 1 wei;    // 1
```

The EVM balances are **wei** (`uint256`). Suffixes are source sugar. Off-chain UIs show ether; your tests should assert wei (or named constants).

There is no built-in “USD.” Prices are an **oracle/trust** problem (chapter **18**).

### 2. Time units

```solidity
uint256 day = 1 days;    // 24 * 60 * 60 seconds
uint256 week = 1 weeks;
```

These are **multipliers**, not a calendar. `1 years` was removed because years are not 365.25-clean. Do not implement leap years in a contract unless you truly must.

`block.timestamp` is Unix time **as the block producer set it**, within protocol tolerance. It is fine for coarse vesting (“after 30 days”). It is not a stopwatch for sub-minute fairness.

### 3. `msg` — this call

| Member | Meaning |
|--------|---------|
| `msg.sender` | Address that **called this function** (EOA or contract) |
| `msg.value` | Wei sent **with this call** |
| `msg.data` | Full calldata |
| `msg.sig` | First four bytes (selector) |

**Authorization uses `msg.sender`**, not `tx.origin`. `msg.sender` changes on every internal hop: user → Router → YourVault means YourVault sees the Router.

`msg.value` is only non-zero if the function is `payable` (or `receive`/`fallback` payable) and the caller attached wei.

### 4. `tx` — the originating transaction

| Member | Meaning |
|--------|---------|
| `tx.origin` | EOA that **started** the transaction |
| `tx.gasprice` | Gas price of the tx (legacy-shaped; fee markets are richer off-chain) |

`tx.origin` looks like “the real user.” Using it for auth lets a victim be tricked into calling a hostile contract that then calls you—your check still sees the victim EOA. **Do not authenticate with `tx.origin`.**

### 5. `block` — this block’s context

| Member (0.8.18+) | Meaning |
|------------------|---------|
| `block.number` | Block height |
| `block.timestamp` | Producer-set timestamp |
| `block.chainid` | Chain id (replay separation) |
| `block.prevrandao` | Mix/prevrandao field after Paris — **not** secure RNG |
| `block.coinbase` | Fee recipient / proposer address |
| `block.gaslimit` | Block gas limit |
| `block.basefee` | EIP-1559 base fee |
| `block.blobbasefee` | Blob base fee (Dencun-era) |

`block.difficulty` still compiles on some versions as a deprecated alias; **new code uses `block.prevrandao`**. Neither is a randomness beacon you can bet funds on.

`blockhash(uint blockNumber)` only works for **recent** blocks (256). Older hashes are zero.

### 6. Other globals you will type weekly

| Helper | Role |
|--------|------|
| `gasleft()` | Remaining gas |
| `this` | Current contract (typed) |
| `super` | Next parent in inheritance |
| `abi.encode` / `encodePacked` / `decode` | ABI helpers (chapter **14**) |
| `keccak256`, `sha256`, `ripemd160`, `ecrecover` | Crypto builtins |
| `addmod` / `mulmod` | Modular math |

```solidity
bytes32 id = keccak256(abi.encode(msg.sender, n));
// encode (not encodePacked) when you need unambiguous field boundaries
```

---

## 2. Advanced concepts

### 1. The full global surface (so you stop guessing)

**`block.*`**

| Member | Meaning | Trust |
|--------|---------|--------|
| `block.chainid` | EIP-155 chain id | bind signatures to this |
| `block.number` | Height | coarse time; not a clock |
| `block.timestamp` | Unix seconds, producer-set | ±bound; not NTP |
| `block.prevrandao` | Mix / RANDAO (post-merge) | **not** a CSPRNG |
| `block.coinbase` | Fee recipient | not “the protocol” |
| `block.gaslimit` | Block gas limit | |
| `block.basefee` | EIP-1559 base fee | |
| `block.blobbasefee` | Cancun blob base fee | |
| `blockhash(n)` | Only for recent heights (last 256) | 0 otherwise |
| `blobhash(i)` | Versioned hash of tx blob `i` | 0 if none |

Removed / renamed: `now` (= timestamp), `block.difficulty` (use `prevrandao` post-merge).

**`msg.*` / `tx.*`**

| Member | Meaning |
|--------|---------|
| `msg.sender` | Immediate caller (EOA or contract) |
| `msg.value` | Wei attached to **this** call |
| `msg.data` | Full calldata |
| `msg.sig` | `bytes4(msg.data)` |
| `tx.origin` | EOA that started the tx — **not for auth** |
| `tx.gasprice` | Gas price of the tx |

**`msg.value` in a non-`payable` function is 0** at the Solidity level (the compiler rejects value on non-payable external functions). Internal functions can still see a leftover `msg.value` from an outer payable call — that is how people accidentally treat an internal helper as if it received new ETH.

### 1b. Type-3 blob transactions (Cancun literacy)

EIP-4844 introduces **blob-carrying** txs. Execution still sees:

- `blobhash(i)` — versioned hash of blob `i` (or zero),
- `block.blobbasefee` — blob fee market,

but **not** the blob data itself inside the EVM. Contracts that “verify a blob” use the point-evaluation precompile (`0x0a`) with commitments — they do not `SLOAD` blob bytes. If your product story is “store data in blobs,” the data availability is consensus-side; the contract only sees proofs/hashes.

### 2. `msg.sender` under `delegatecall`

Code runs in the *caller’s* storage; **`msg.sender` and `msg.value` stay the original call’s**. The implementation does **not** see the proxy as `msg.sender`. “I check `msg.sender == owner` in implementation code” is checking the *proxy’s* caller — correct for a proxy, disastrous if you thought `msg.sender` was the proxy.

### 3. `block.chainid` and forks

Signatures and replay protection must bind **chain id** (EIP-712 / EIP-155). Hardcoding `1` is how testnet signatures work on mainnet. Read `block.chainid` or pass a domain separator from config. After a rare hard-fork that *changes* chain id, old domain separators are a migration incident.

### 4. Timestamp and `blockhash` bounds

Producers can nudge timestamps within protocol bounds. Do not implement “first tx in this exact second wins a jackpot.” Do use timestamps for multi-day cliffs.

`blockhash(block.number)` is **0** (the current block’s hash is not known yet). `blockhash` older than 256 blocks is **0**. Using either as randomness is twice wrong.

### 5. `ecrecover` pitfalls (preview)

Precompile at `0x01`. Input: `hash || v || r || s` (32+32+32+32). Returns `address(0)` on failure — **check that**. It does not understand EIP-712; you hash the digest first. Malleable `s` values and missing domain separation are chapter **18**. Here: **never treat a raw `ecrecover` as login.**

**`v` trivia:** historically `27`/`28`; some pipelines use `0`/`1` and add `27` in contract. Wrong `v` → `address(0)`. Homestead+ rejects high-`s` signatures in tx validation, but **`ecrecover` itself still accepts malleable `s`** unless you check `s <= secp256k1n/2` (or use a library that does).

### 6. `gasleft()` is not a security boundary

Do not branch on “if lots of gas remain, do extra work” as a safety check. Callers choose gas. EIP-150 63/64 forwarding (chapter **15** / **16**) is not an access-control tool.

### 6b. `address(this).balance` vs `msg.value`

`address(this).balance` is the account’s wei **including** the current call’s `msg.value` (already credited before your code runs). Patterns like `require(msg.value == address(this).balance)` are almost always wrong for anything that already held ETH. Accounting belongs in your mappings (chapter **15**).

### 7. Units are just multipliers

`1 ether == 1e18`, `1 gwei == 1e9`, `1 days == 86400`. They do not convert ETH↔USD and they do not know your token’s decimals. `1 hours` after a leap-second debate is still 3600. Use them as literals, not as a price oracle.

### 8. Cryptographic helpers on `abi` / globals

| Helper | Role |
|--------|------|
| `keccak256` | General hash; selectors; storage slots; EIP-712 pieces |
| `sha256` / `ripemd160` | Precompile wrappers — different domains than keccak |
| `ecrecover` | See above |
| `addmod` / `mulmod` | Modular math with 512-bit intermediate |
| `abi.encode*` | Chapter **14** |

`keccak256` of empty bytes is a fixed constant (`c5d2…`); people accidentally use it as a “null” sentinel — document if you do.

---

## 3. Applications and use cases

| Lens | Use of globals |
|------|----------------|
| **Application** | `msg.sender` as the only default identity; `msg.value` on payable entry points |
| **Systems** | `chainid` in signatures; timestamps for coarse schedules |
| **Security** | Ban `tx.origin` auth; ban “random = keccak(prevrandao)” for money |
| **Operations** | Tests set time via cheatcodes (`vm.warp`)—chapter **17** |
| **Software engineering** | Named constants for ether/time; no magic `10**18` scattered 40 times |

---

## 4. Staff-level review checklist

- [ ] No `tx.origin` in authorization.
- [ ] No funds depend on `block.prevrandao` / `blockhash` as randomness.
- [ ] Time-based logic is coarse enough for producer timestamp wiggle.
- [ ] Signatures include **chain id** (or equivalent domain).
- [ ] `msg.value` only on functions that are intentionally `payable`.
- [ ] New code uses `block.prevrandao`, not `block.difficulty` / `now`.

---

## References

- [Units and globally available variables](https://docs.soliditylang.org/en/v0.8.36/units-and-global-variables.html)
- [Cheatsheet](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Ethereum: blocks](https://ethereum.org/developers/docs/blocks/)
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [EIP-4844 (blob txs)](https://eips.ethereum.org/EIPS/eip-4844)
