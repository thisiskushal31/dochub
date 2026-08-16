# Whole-engineering wrap and staff checklist

[← Back to Solidity](./README.md)

## What this chapter covers

A **competency map** and **sign-off list** for the Solidity track. Use it after **00–22**, not instead of them. Default pin: **Solidity 0.8.x** (handbook snapshot **0.8.36**); ship the latest patch you can defend.

If chapter **00** was “I changed a greeting,” this page is “I could explain that greeting — and a vault, a pin, a test, and a key — to the person who has to live with it.”

---

## 1. Concepts — what “fluent” means here

You are fluent when you can:

1. Explain **language vs EVM vs chain vs account** to a new hire.
2. Compile and test the **same** sources in the **repo toolchain** (Foundry and/or Hardhat), not only Remix.
3. Read a function and name its **visibility, mutability, location, and auth**.
4. Follow a wei from `msg.value` to storage to a **pull** withdraw.
5. Decode a calldata blob and a revert with **cast** or a client + ABI.
6. Review a PR for **CEI**, `tx.origin`, unchecked math, and untrusted `delegatecall` without writing an attack demo.
7. Describe the **release tuple** (solc, evmVersion, optimizer, viaIR, args, verify, keys).
8. Say **no** to a proxy, a custom ERC-20, or an assembly block that has no reason.

Remix-only fluency is chapter **00**. Staff fluency is this list.

---

## 2. Advanced concepts — brownfield you must still survive

You will open 0.6/0.7 files, Truffle repos, `transfer`-as-reentrancy-fix, SafeMath, and `now`. Treat them as **translation problems**:

- map to 0.8 checked math and custom errors,
- replace stipend folklore with CEI + `call` + tests,
- pin a modern `solc` or write a waiver,
- do not copy the old pattern into a new module.

You will also meet upgradeable systems. Literacy (layout, initializer, admin) is required; **making everything upgradeable** is not.

### Formulas you should be able to write on a whiteboard

```text
selector          = first4(keccak256("transfer(address,uint256)"))
mapping slot      = keccak256(h(key) . p)
array element i   = keccak256(p) + i          // then pack if narrow T
CREATE            = last20(keccak256(rlp([sender, nonce])))
CREATE2           = last20(keccak256(0xff . sender . salt . keccak256(init_code)))
ERC-1967 impl     = keccak256("eip1967.proxy.implementation") - 1
EIP-712 digest    = keccak256("\x19\x01" || domainSeparator || structHash)
Panic(uint256)    = 0x4e487b71 || code     (0x11 overflow, 0x32 OOB, …)
Error(string)     = 0x08c379a0 || ABI string
memory cost       ≈ 3*words + words²/512   (words = ceil(max_byte/32))
forward gas       ≤ gas - floor(gas/64)    (EIP-150)
```

**Also say out loud:** ABI does not pack (a `uint8` is still a 32-byte word on the wire); storage does. Memory structs do not pack like storage structs. `delegatecall` keeps `msg.sender` and uses the caller’s storage.

If you cannot derive those, re-read **11–16**, **18**, **20**, and **21** — not another token tutorial.

### Brownfield opcode / API fossils

| You see | You translate |
|---------|----------------|
| `now` | `block.timestamp` |
| `block.difficulty` (post-merge) | `block.prevrandao` |
| `throw` | `revert` / custom error |
| named constructor | `constructor(...)` |
| `SafeMath.add` | 0.8 checked `+` (or `unchecked` with a proof) |
| `token.transfer` as “no reentrancy” | 2300 stipend — not a strategy |
| `pragma experimental ABIEncoderV2` | default on 0.8 |
| `CALLCODE` | do not use; `DELEGATECALL` if you meant a proxy |

---

## 3. Applications — sign-off by lens

| Lens | You can show |
|------|----------------|
| **Application** | A small contract with NatSpec, events, typed errors, and a stable ABI |
| **Systems** | Gas report on a hot path; correct `evmVersion` for the target chain |
| **Security** | Threat model; analyzer in CI; chapter **18** checklist on the last PR |
| **Operations** | Scripted deploy, verified source, key custody, monitors on events |
| **Software engineering** | Tests (unit + fuzz or invariant), fmt, denied warnings, pinned deps |

Deep-study leftovers from the README: if you skipped the labs, do them before signing.

---

## 4. Staff-level review checklist (track sign-off)

### Language and compiler

- New code is **0.8.x** with SPDX and a pragma that matches CI’s **exact** `solc`.
- `evmVersion`, optimizer `runs`, and via-IR are **named** and used at verify time.
- Pre-0.8 habits are not introduced in new files.
- Latest compiler security-fix policy is understood (do not freeze abandoned `solc` silently).

### Toolchain

- README has **one** compile/test command that CI runs.
- Remix is not the release compiler of record.
- Foundry and Hardhat (if both exist) have distinct jobs.

### Contract quality

- Visibility and mutability are explicit; payable surface is intentional.
- Custom errors + events on value-moving paths; NatSpec on `external` functions.
- `calldata`/`memory`/`storage`/`transient` used on purpose.
- No unbounded loops over user-grown arrays in a single user tx.
- Inheritance/layout is drawable (C3 order); libraries are `internal` unless linked on purpose.
- Storage packing / mapping-slot / short-`bytes` rules are understood if anyone reads slots raw.

### Safety and delivery

- `msg.sender` auth; no `tx.origin`; no untrusted `delegatecall`.
- CEI (and locks where needed); pull payments when recipients are open.
- Signatures (if any) are domain-separated; no DIY packed-string hashes for money.
- Tests cover success, auth failure, and failed external calls; fuzz/invariants on accounting.
- Analyzer findings triaged; audits (if any) match the **deployed commit**.
- Keys: no raw mainnet secrets in git; admin custody named.
- Explorer **verification** succeeded.
- Upgradeability is either **absent** or fully specified (ERC-1967/7201 slots, initializer lock, timelock).
- ABI artifacts match the same Standard JSON as bytecode (optimizer, viaIR, evmVersion, metadata).

### Scope honesty

- This repo is not pretending to be an L2 or DeFi encyclopedia.
- Token work uses maintained implementations + a threat model for weird tokens.
- Assembly (if any) is justified, tested, and extra-reviewed.

When the boxes that apply to *your* system are checked, the track has done its job for **shipping contracts**. For **where the platform is moving** and what to hand off next, sign chapter **24** as well. Revisit **02** on every compiler bump, **18** on every value-moving PR, **20** on every mainnet push, and **24** on every hard-fork or L2/AA decision.

---

## References

- [Solidity 0.8.36 documentation](https://docs.soliditylang.org/en/v0.8.36/)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
- [Compiler security policy](https://github.com/argotorg/solidity/security/policy)
- [Ethereum developer docs](https://ethereum.org/developers/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Hardhat documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Track README](./README.md)
- [Where this is going — chapter 24](./24_Where_This_Is_Going_And_How_To_Stay_Oriented.md)
