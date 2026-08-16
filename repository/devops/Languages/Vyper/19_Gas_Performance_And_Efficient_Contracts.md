# Gas performance and efficient contracts

[← Back to Vyper](./README.md)

## What this chapter covers

How to write Vyper so execution **does not choke users, block producers, or your own entrypoints**: **gas** is the meter on the EVM. “Faster” here almost never means CPU on your laptop—it means **cheaper, boundable, predictable work on-chain**.

By the end you should be able to:

1. Name the **expensive families** of work (storage writes, external calls, unbounded growth).
2. Prefer **patterns that stay cheap under load**.
3. Use **`#pragma optimize`**, measurement, and pins without unmeasured “optimizations.”
4. Separate **performance** (this chapter) from **decidability / exceptions / Venom** (chapter **[18](./18_Gas_Bounds_Compiler_Exceptions_And_Venom.md)**).

Pin: **Vyper 0.4.x** (**0.4.3**). Security still wins over micro-optimizations that obscure intent (chapter **14**).

---

## 1. Concepts

### 1. What “performance” means on the EVM

| In ordinary apps | In Vyper / EVM contracts |
|------------------|---------------------------|
| CPU time, RAM, disk on *your* server | **Gas** paid by the caller (and block gas limits) |
| Scale with more machines | Scale with **boundable work per call** and careful state growth |
| Profile with a sampler | Profile with **gas reports**, traces, and worst-case inputs |

If a function “works in tests” but costs so much gas that users cannot call it—or an attacker can force you into a too-heavy path—the contract is **operationally broken**.

### 2. Cost intuition (order of magnitude)

Exact gas changes by EVM version and compiler settings. Hold relative costs:

| Cheaper (usually) | More expensive (usually) |
|-------------------|---------------------------|
| Pure computation in memory | **Storage** reads/writes (`SLOAD` / `SSTORE` class work) |
| Reading `immutable` / `constant` | Writing storage every call |
| Events (logs) for history | Writing the same history into storage “just in case” |
| One focused external call | Many external calls in a loop |
| Fixed-size loops with small `N` | Loops over ever-growing on-chain lists |

Staff rule: **touch storage and other contracts deliberately**—not in every helper “for neatness.”

### 3. The four levers you actually control

1. **How much state you write** — each durable write is paid for, forever in the product sense.
2. **How much you iterate** — bounds must be real (chapter **07**, **18**).
3. **How many external interactions** — each call has base cost and failure modes.
4. **What the compiler emits** — optimize mode (`gas` / `codesize` / `none`), EVM target, optional Venom (**12**, **18**).

### 4. Measure before you rearrange for speed

```text
1. Pin vyper + EVM + optimize mode
2. Write Titanoboa (or peer) tests with realistic sizes
3. Record gas for happy path + worst allowed N
4. Only then change code for cost
5. Re-measure; keep a golden gas note in CI when regressions matter
```

Optimizing without a number produces folklore. Titanoboa and related tooling can expose gas for calls—use that habit (chapter **13**).

### 5. `#pragma optimize` is a product pin, not a vibe

In source (and/or CLI / Standard JSON):

| Mode | Intent |
|------|--------|
| **`gas`** (common default) | Prefer cheaper execution |
| **`codesize`** | Prefer smaller deploy bytecode (create cost / size limits) |
| **`none`** | Predictable / debuggable emission; compare baselines |

```vyper
#pragma version ^0.4.0
#pragma optimize gas
```

CI, verify-on-explorer, and audit bytecode must use the **same** optimize mode. Switching `gas` → `codesize` can change both deploy cost and runtime cost—re-benchmark.

---

## 2. Advanced concepts

### 1. Storage: the usual choke point

Patterns that keep storage honest:

| Prefer | Avoid |
|--------|--------|
| Update **one** slot that summarizes state | Rewrite large structs “field by field” every call when one write would do |
| Pack related small values when the layout is intentional | Random layout thrash that forces extra slots |
| `immutable` for set-once constructor config | Re-reading constructor config from storage every time when immutable fits |
| Events for append-only history | Growing unbounded storage arrays as a log |

Clearing a storage slot can be cheaper later than leaving dirt forever—but **do not** invent “refund farming” as a product strategy. Design for clear ownership of slots; measure on your EVM target (cold/warm access rules change by hard fork).

### 2. Memory and calldata discipline

- Keep hot temporary data in **memory**, not storage.
- Prefer tight ABI types at boundaries—oversized dynamic blobs cost call and copy work.
- Bound `Bytes[N]` / `String[N]` / arrays with an **`N` you can defend** in a review (griefing + gas).

### 3. Loops that do not choke the chain

```vyper
# Good shape: N is a constant upper bound known at compile/review time
for i: uint256 in range(8):
    ...
```

| Habit | Why |
|-------|-----|
| Bound `N` to what one transaction should do | Users and validators share a block gas limit |
| Paginate or pull-payment across txs for big work | One mega-loop is a DoS against yourself |
| Do not loop external calls over user-controlled length | Gas and reentrancy review explode together |
| Fail fast with `assert` before expensive work | Cheap rejection beats late failure after storage writes |

Chapter **18** covers decidability; this chapter covers **not choosing a huge legal N**.

### 4. External calls and value transfer

| Cheaper / clearer | Heavier / sharper |
|-------------------|-------------------|
| `send` when a plain transfer is enough | `raw_call` with fat returndata when you do not need it |
| One callback to a known adapter | Fan-out to many untrusted addresses in one tx |
| Pull pattern (user withdraws) | Push loops paying many parties |

Every external call can consume gas you forward and can revert your frame—budget it. See built-ins literacy in chapter **09** (review posture, not clever tricks).

### 5. Events vs storage for “remembering”

If indexers and clients need history, **emit an event**. If the contract must branch on past data next call, you need **storage** (or a proven off-chain+challenge design—product territory).

Logging is not free, but it is the usual right tool for audit trails that should not bloat contract state.

### 6. Modules and composition (0.4)

Modules improve auditability; they do not erase gas. Watch for:

- repeated cross-module storage touches that could be one local update,
- exported surfaces that invite chatty multi-call patterns from clients,
- initializing more module state than the product needs.

Composition should reduce *human* complexity without multiplying *on-chain* round trips.

### 7. What not to do for “performance”

| Anti-pattern | Why it fails |
|--------------|--------------|
| Remove checks to save gas | Security regression; often tiny savings |
| Unbounded growth “we’ll fix later” | Later is mainnet |
| Enable Venom in prod because a thread said so | Pipeline/bytecode drift (**18**) |
| Micro-optimize names while leaving O(n) external calls | Wrong bottleneck |
| Copy Solidity assembly tricks into mental design | Vyper has no inline assembly—by design |

---

## 3. Applications and use cases

| Angle | Performance habit |
|-------|-------------------|
| **Application** | UX: users can afford the happy path; admin paths may cost more but stay boundable |
| **Systems** | Block gas limits and L2 fee markets punish fat loops equally—design for the chain you ship |
| **Security** | Gas griefing and stuck entrypoints are availability bugs; treat max `N` as part of the threat model (**14**) |
| **Ops** | Alert on sudden gas regressions after compiler bumps; store gas snapshots with releases |
| **SE** | PR template: “worst-case gas story + measured number” for hot entrypoints |

**Example staff story:** a vault `harvest` that loops over every strategy ever added will eventually brick. Fix shape: bound per-tx work, or checkpoint/paginate—not “buy more gas.”

---

## 4. Staff-level review checklist

- Hot paths have a **measured** gas number under pinned compiler + EVM + optimize mode.
- Storage writes on the happy path are justified; no accidental “write everything every time.”
- Loops have a **defensible** maximum; growth is paginated or pull-based when large.
- External calls are minimized and not nested in user-sized loops.
- History uses **events** unless on-chain branching requires storage.
- `#pragma optimize` / CLI optimize mode matches CI and verification.
- Immutables/constants used for set-once config where appropriate.
- Security checks were not deleted “for gas.”
- After Vyper or EVM bumps, gas for top entrypoints is re-checked.
- Venom / experimental codegen only with explicit policy (**18**).

---

## References

- [Compiling a contract — optimize modes (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Principles and goals — decidability (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/)
- [Control structures (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/control-structures.html)
- [Types (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/types.html)
- [Built-in functions (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/built-in-functions.html)
- [Testing with Titanoboa (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-titanoboa.html)
- [Gas and fees (ethereum.org)](https://ethereum.org/en/developers/docs/gas/)
- [Vyper track — gas bounds and Venom](./18_Gas_Bounds_Compiler_Exceptions_And_Venom.md)
- [Vyper track — security review](./14_Security_Design_And_Review.md)
- [Solidity track](../Solidity/README.md) — shared EVM call/storage intuition
