# Where this is going and how to stay oriented

[← Back to Solidity](./README.md)

## What this chapter covers

The **compass** for this track: what **00–23** already make you fluent in, **brief intros** to adjacent Web3 topics we do not deep-dive (with **exact next doors**), and **where Solidity + the EVM are moving**. Snapshot: **Solidity 0.8.x / 0.8.36**; EVM literacy through **Cancun** and **Pectra / Prague**-era features (especially **EIP-7702**). Fork names and dates move — re-check official hubs when you pin a deploy.

You came here for Solidity. You should leave able to **write, test, review, and ship** contracts on an EVM chain — and able to say, without panic, “that next topic lives *there*, and this track already gave me the machine model I need to learn it.”

---

## 1. Concepts

### 1. What “all-in-one” means here

This track is the all-in-one for **language + EVM machine + the engineering job around a contract**. After **00–23** you should be able to:

| You can… | Chapters that built it |
|----------|-------------------------|
| Explain language vs EVM vs chain vs account | **00–01** |
| Pin `solc` + `evmVersion` + via-IR and survive brownfield | **02** |
| Compile/test in Remix and Foundry/Hardhat | **03**, **17** |
| Read every source/layout/type/control construct you meet in 0.8 | **04–09** |
| Own events, errors, locations, collections, inheritance | **10–13** |
| Decode ABI, calls, CREATE2, gas, metadata | **14–16** |
| Review CEI, auth, signatures, weird tokens — without exploit kits | **18–19**, **22** |
| Ship: CI, verify, keys, upgrade literacy | **20** |
| Read justified Yul / slot math | **21** |
| Sign a staff checklist honestly | **23** |

That is the center of the bullseye. It is **not** “every Web3 product manual on Earth.” Scope honesty is how this stays usable.

### 2. The map: owned here vs directed elsewhere

| Topic | In this track? | Where you go next |
|-------|----------------|-------------------|
| Solidity 0.8 syntax & semantics | **Yes** (default) | Solidity docs latest + this track |
| `solc`, Remix, Foundry, Hardhat | **Yes** | Official books/docs in References |
| ABI, storage, calls, gas | **Yes** (deep) | Yellow-paper / opcode pages for edge cases |
| Tests, analyzers, audits-as-process | **Yes** | Specialist FV (Certora-class) only when needed |
| ERC-20/721/1155/165/2612 **literacy** | **Yes** (interfaces + threats) | OZ docs for implementation details |
| Proxies / CREATE2 / verify / keys | **Yes** (staff literacy) | OZ Upgrades when you actually ship one |
| ethers.js / viem / wallet UI | **No** — handoff | [JavaScript](../JavaScript/README.md) / [TypeScript](../TypeScript/README.md) |
| Vyper | **No** — sibling | [Vyper](../Vyper/README.md) |
| Move / Cairo / non-EVM | **No** — siblings | Those language tracks |
| L2 product encyclopedias (sequencers, fraud proofs, …) | **No** | ethereum.org scaling + that L2’s docs — **same Solidity**, different pins |
| DeFi strategy / MEV extraction manuals | **No** | Out of scope (we teach user-protecting bounds, ch **18**) |
| Consensus / staking / beacon | **No** | ethereum.org consensus docs |
| Full account-abstraction wallet engineering | **Literacy only** (§2) | ERC-4337 + ethereum.org AA + wallet vendors |
| Protocol / hard-fork design | **Literacy only** (§2) | [EIPs](https://eips.ethereum.org/) + ethereum.org roadmap |

If someone asks “do you cover X?” and X is in the handoff column: this track taught the **machine**; §2.7 below gives a **brief intro + exact link** so you know what X is and where to open it.

### 3. The one sentence that keeps you oriented

> **Same language, different pins.**

New chains, L2s, and hard forks rarely invent a new Solidity. They change **gas**, **precompiles**, **`evmVersion`**, **blob/DA economics**, and sometimes **account behavior** (7702). Your deploy checklist from **02** / **16** / **20** is how you absorb the future without rewriting your brain.

### 4. How to use this chapter

Read it **after 23** (or skim after **01** so you know the bullseye). Revisit when:

- a hard fork activates on your target chain,
- you bump `solc`,
- someone says “we’re moving to an L2” or “we need AA,”
- a release note mentions experimental codegen / EOF / Core Solidity.

---

## 2. Advanced concepts — where the platform is moving

### 1. The compiler line (Solidity itself)

**Habit that does not change:** ship the **latest 0.8.z patch** you can defend; only the latest release is guaranteed security fixes (chapter **02**). Rough cadence historically: frequent non-breaking releases, rarer breaking jumps.

**Pipeline direction (literacy, not a prod flip):**

- **via-IR** is already first-class for many teams (chapter **16**).
- Experimental **SSA / stack-to-memory** paths exist to kill stack-too-deep — try in CI if the team opts in; do **not** flip experimental codegen on a release pin because a blog sounded exciting.
- **EOF (EVM Object Format)** was anticipated, then **rejected** for the Fusaka-era upgrade path; **0.8.36 removed** the experimental EOF backend. Do not write application contracts “for EOF.” Treat EOF mentions in old notes as history.

**Language design:** the Solidity project discusses longer-term direction publicly (blog + forum — “Road to Core Solidity” and surveys). Your job as an engineer is: **read the release notes on every bump**, not to implement tomorrow’s syntax today.

### 2. The EVM / fork line (the machine under you)

Hard forks change the **schedule** you compile for. Staff literacy through this handbook’s era:

| Era (names move) | Contract-author impact |
|------------------|-------------------------|
| **Shanghai** | `PUSH0`; cheaper zeros in codegen |
| **Cancun / Dencun** | `TSTORE`/`TLOAD` (transient), `MCOPY`, **blobs** (`blobhash`, point-eval precompile `0x0a`), EIP-6780 `SELFDESTRUCT` neutering |
| **Pectra (Prague + Electra)** | **EIP-7702** (EOA can set delegation code), calldata cost changes (EIP-7623), more blob throughput, new precompiles (e.g. BLS12-381), historical-hash / EL request machinery — most of it is **pin + wallet** work, not new Solidity syntax |
| **Later (`osaka`, `amsterdam`, … in `solc`)** | Whatever your `solc --help` / docs list — **match the chain**, never a meme |

`solc --evm-version` must match the **activation** on the chain you deploy to. Compiling for `prague` and deploying on a pre-Pectra fork is an invalid-opcode incident waiting to happen.

### 3. Accounts are moving (EOA ≠ forever “dumb key”)

Two waves contract authors must name:

| Wave | What it is | What you change in *your* contracts |
|------|------------|-------------------------------------|
| **ERC-4337** (account abstraction via EntryPoint / UserOperations) | Smart accounts as first-class users; bundlers; paymasters | Do not assume `msg.sender` is a person with MetaMask habits; never `tx.origin` auth; hooks and batch calls look like reentrancy surfaces (ch **18**) |
| **EIP-7702** (Pectra) | An EOA can **delegate** to contract code via a set-code tx (type `0x04`); code designator `0xef0100 \|\| address` | `EXTCODE*` vs execution follow different rules; “is this an EOA?” via `extcodesize == 0` was already weak — now weaker. Auth still `msg.sender`. Wallet/delegation security is mostly **off your app’s critical path** unless you write delegation contracts |

**Direction for app authors:** keep using `msg.sender`, CEI, and typed interfaces. Stop writing “only EOAs may call” checks. Support contract wallets as normal users.

### 4. Data availability and L2s (same Solidity, different bill)

**Blobs (EIP-4844)** made L2 data cheaper without putting blob bytes in EVM storage. Contracts see `blobhash` / the point-evaluation precompile — not a filesystem (chapter **07**).

When someone says “we’re deploying to an L2”:

1. Same Solidity source (usually).
2. New **chain id** (signatures! EIP-712!).
3. Confirm **`evmVersion`**, precompiles, and gas schedule for *that* chain.
4. Confirm explorer verify + RPC + blob/DA assumptions if you care about posting data.
5. Do **not** treat “EVM compatible” as “identical to mainnet.”

This track will not become an Optimism/Arbitrum/zkSync encyclopedia. It already taught the **questions** those docs answer.

### 5. What is *not* the future of new app code

| Idea | Status for *you* |
|------|------------------|
| Pre-0.8 default math / SafeMath everywhere | Brownfield only |
| `transfer`/`send` as reentrancy defense | Dead strategy |
| EOF-targeted application bytecode | Backend removed; do not target |
| Experimental `solc` flags on mainnet | No — pin stable |
| Upgradeability for every vault | Literacy yes; default no (ch **20**) |
| DIY ERC-20 from a tutorial | Prefer maintained implementations (ch **22**) |

### 6. How to stay oriented (a weekly / per-release ritual)

1. **On every `solc` bump:** read the [release post](https://blog.soliditylang.org/), skim [known bugs](https://docs.soliditylang.org/en/latest/bugs.html), re-run tests + gas snapshot, re-verify a canary contract.
2. **On every target-chain fork:** read ethereum.org roadmap / that chain’s fork notes; set `evmVersion`; check 7702 / blob / precompile impact on *your* assumptions.
3. **On every new dependency major (OZ, forge-std):** changelog + storage layout diff if upgradeable.
4. **When a headline says “Solidity is changing forever”:** find the **official** blog/EIP; ignore Twitter summaries until you can name the pin it affects.

### 7. Brief introductions — what we do not deep-dive (and where it lives)

These topics are **part of the Web3 picture**. This track does not teach them end-to-end. Below is enough to know **what they are** and **exactly where to open next**. You already have the Solidity/EVM machine from **00–23**.

#### Dapp clients and wallet UI

**What it is:** The browser/mobile app that builds ABI calldata, asks a wallet to sign, and shows receipts. Libraries like **ethers.js** and **viem** talk JSON-RPC to a node; the wallet holds keys (or AA). Your contract’s ABI is the contract; the UI is a client of that ABI.

**Where exactly:** [JavaScript track](../JavaScript/README.md) and [TypeScript track](../TypeScript/README.md); [ethers.js docs](https://docs.ethers.org/); [viem](https://viem.sh/). This Solidity track stops at “publish the ABI + events” (chapters **10**, **14**, **20**).

#### Sibling languages (same job, different syntax or machine)

| Language | One-line idea | Where exactly |
|----------|---------------|---------------|
| **Vyper** | Another **EVM** contract language (Pythonic); same chain, different compiler | [Vyper track](../Vyper/README.md) + [vyperlang.org](https://docs.vyperlang.org/) |
| **Move** | Resource-oriented language (Aptos/Sui family) — **not** the EVM | [Move track](../Move/README.md) |
| **Cairo** | Language for Starknet / ZK-oriented execution — **not** the EVM | [Cairo track](../Cairo/README.md) |

If the chain is EVM, Solidity (this track) or Vyper. If it is not EVM, do not force these chapters onto it.

#### Layer 2 (rollups) and “EVM compatible” chains

**What it is:** Execution that posts data/proofs to L1 (optimistic fraud proofs or validity/ZK proofs). Users get cheaper txs; you usually still write **Solidity**. A **sequencer** orders txs; bridges move assets; each L2 has its own chain id, gas quirks, and explorer.

**Where exactly:** [ethereum.org — scaling](https://ethereum.org/developers/docs/scaling/) and that L2’s official docs (Optimism, Arbitrum, Base, zkSync, …). **In this track:** pins and blobs — chapters **02**, **07**, **16**, **20**, and §2.4 above. Same source, different `chainid` / `evmVersion` / verify URL.

#### Consensus, staking, and the beacon chain

**What it is:** How Ethereum **agrees on blocks** (proof-of-stake, validators, attestations). Separate from “my contract’s `transfer` worked.” Contract authors rarely edit consensus code; node operators and stakers live here.

**Where exactly:** [ethereum.org — consensus](https://ethereum.org/developers/docs/consensus-mechanisms/) and [ethereum.org — staking](https://ethereum.org/staking/). This track only needs blocks/timestamps/gas as **globals** (chapter **07**).

#### Account abstraction wallets (beyond literacy)

**What it is:** Smart accounts that can batch calls, sponsor gas, and use custom signature rules. **ERC-4337** uses an `EntryPoint` and UserOperations (bundlers/paymasters). **EIP-7702** lets an EOA temporarily/permanently act through delegated code (Pectra). Building a wallet or bundler is a product; calling *from* one is normal for your contract.

**Where exactly:** [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337); [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702); [Pectra 7702 guidelines](https://ethereum.org/roadmap/pectra/7702/); wallet/vendor docs. **In this track:** §2.3 above and chapter **18** (`msg.sender`, no `tx.origin`).

#### DeFi products, oracles, and MEV

**What it is:** Markets, AMMs, lending, liquidations — **product and economic** design on top of ERC-20/721 and the call model you already know. **Oracles** push off-chain prices on-chain (trust boundary). **MEV** is transaction ordering value; we teach **user-protecting** slippage/bounds, not extraction playbooks.

**Where exactly:** Protocol docs for the product you integrate; oracle vendor docs; ethereum.org for high-level DeFi vocabulary. **In this track:** token threats + CEI + bounds — chapters **18** and **22**. No strategy manual here.

#### Hard-fork / EIP design and deep formal verification

**What it is:** Writing the next EIP or proving a billion-dollar AMM with specialist FV tools is a different profession from shipping a vault in Solidity.

**Where exactly:** [eips.ethereum.org](https://eips.ethereum.org/); [ethereum.org roadmap](https://ethereum.org/roadmap/); FV tool docs (e.g. Certora) when your risk model demands them. **In this track:** SMTChecker literacy — chapter **19**; fork pins — **02** / **24**.

Finishing **00–24** means you are fluent in the **contract layer** and you can **name the door** for everything above. That is intentional, not unfinished.

---

## 3. Applications and use cases

| Lens | How “direction” shows up |
|------|---------------------------|
| **Application** | New wallet types (4337/7702) call you like any other `msg.sender`; keep the ABI stable; document chain ids |
| **Systems** | Fork pins (`evmVersion`, blobs, calldata prices) are capacity planning, not folklore |
| **Security** | Auth models that assume EOAs-only rot; review delegation and EntryPoint trust if you integrate AA |
| **Operations** | Fork day runbook: bump clients, re-verify, smoke `cast call`, watch basefee/blobfee |
| **Software engineering** | Changelog PR template: solc / evmVersion / OZ / “EOF or experimental? no” |

Use §2.7 as the **directory** when a teammate names an adjacent topic: one short paragraph of meaning, then the path.

---

## 4. Staff-level review checklist

- Team can state in one paragraph what this track **owns** vs **hands off**, and can point to §2.7 for each handoff.
- Deploy pins include **`solc` + `evmVersion` + via-IR** for the *current* target fork (Cancun / Prague / …).
- No production dependency on **EOF** or other **experimental** codegen.
- Auth paths do **not** assume callers are simple EOAs (`tx.origin` banned; AA/7702 named in the threat model if relevant).
- “We’re going to L2” tickets include chain id, pin, verify, and signature-domain updates — not a rewrite of Solidity.
- Someone is assigned to read **Solidity blog + chain fork notes** on bumps (not “whoever noticed Twitter”).
- Chapter **23** checklist is signed for the system you actually ship; this chapter is the **compass**, not a substitute.
- Adjacent work (UI, L2 ops, AA wallet, DeFi product) has a named owner and a link from §2.7 — not a pretend Solidity chapter.

---

## References

- [Solidity documentation (latest)](https://docs.soliditylang.org/)
- [Solidity 0.8.36 docs (handbook snapshot)](https://docs.soliditylang.org/en/v0.8.36/)
- [Solidity blog (releases & direction)](https://blog.soliditylang.org/)
- [Solidity 0.8.36 release (EOF backend removal)](https://soliditylang.org/blog/2026/07/09/solidity-0.8.36-release-announcement/)
- [Known compiler bugs](https://docs.soliditylang.org/en/latest/bugs.html)
- [Compiler security policy](https://github.com/argotorg/solidity/security/policy)
- [Ethereum developer docs](https://ethereum.org/developers/)
- [Ethereum accounts](https://ethereum.org/developers/docs/accounts/)
- [Ethereum roadmap](https://ethereum.org/roadmap/)
- [Pectra overview](https://ethereum.org/roadmap/pectra/)
- [EIP-7702 guidelines (ethereum.org)](https://ethereum.org/roadmap/pectra/7702/)
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
- [EIP-4844 (blobs)](https://eips.ethereum.org/EIPS/eip-4844)
- [EIP-1153 (transient storage)](https://eips.ethereum.org/EIPS/eip-1153)
- [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)
- [Ethereum EIPs](https://eips.ethereum.org/)
- [Ethereum: scaling](https://ethereum.org/developers/docs/scaling/)
- [Ethereum: consensus mechanisms](https://ethereum.org/developers/docs/consensus-mechanisms/)
- [JavaScript track](../JavaScript/README.md)
- [TypeScript track](../TypeScript/README.md)
- [Vyper track](../Vyper/README.md)
- [Move track](../Move/README.md)
- [Cairo track](../Cairo/README.md)
- [Track wrap — chapter 23](./23_Whole_Engineering_Wrap_And_Staff_Checklist.md)
