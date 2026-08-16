# Functions, visibility, and mutability

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper marks **who can call** a function and **what the function is allowed to do** to state and ETH. Decorators are not optional flavor—they are the ABI and security surface. Includes literacy for **default / receive-style** entry points.

Pin: **Vyper 0.4.x** (**0.4.3**). Solidity’s visibility/payable story in [Solidity](../Solidity/README.md) is a useful comparison; Vyper has **no modifiers** and **no overloading**—one name, one behavior, guards inline. Structure and reading order: chapter **[04](./04_Structure_Of_A_Contract.md)**. Environment values those functions read: chapter **[06](./06_Environment_Constants_And_Immutables.md)**.

---

## 1. Concepts

### 1. Two axes (keep them separate)

| Axis | Decorators (core set) | Question |
|------|------------------------|----------|
| **Visibility** | `@external`, `@internal` | Who may call this? |
| **Mutability** | `@view`, `@pure`, `@payable`, or plain state-changing | Does it read/write state or accept ETH? |

Mixing the axes in conversation (“it’s a view so it’s internal”) creates review bugs. Say both: “external view” or “internal pure,” etc.

### 2. `@external` vs `@internal`

```vyper
@external
def set_value(v: uint256):
    self._set(v)

@internal
def _set(v: uint256):
    self.value = v
```

| Decorator | ABI | Purpose |
|-----------|-----|---------|
| `@external` | Yes | Product and integration API |
| `@internal` | No | Helpers; not directly callable from outside |

Marking a helper `@external` by mistake permanently expands attack surface and ABI. Prefer `_` naming plus `@internal` for non-API routines.

In **0.4+** module systems, what is ABI-visible also depends on **`exports`**—composition can hide or surface functions deliberately (chapter **[11](./11_Interfaces_And_Modules.md)**). Staff still start with “is this marked external?” before “is it exported?”

### 3. Mutability decorators

| Decorator | May read state | May write state | May receive ETH |
|-----------|----------------|-----------------|-----------------|
| `@pure` | No | No | No |
| `@view` | Yes | No | No |
| (none / default state-changing) | Yes | Yes | No unless also payable |
| `@payable` | Yes | Yes (typically) | Yes |

Exact combinations follow the language rules for your pin—don’t invent hybrids. Honesty matters: a function labeled `@view` that writes is a **compiler/error** or a catastrophic misunderstanding; treat mutability mismatches as release blockers.

### 4. Why mutability honesty is ops-critical

Wallets and indexers decide **call vs send** from ABI state mutability. Lying (or confusing) mutability causes:

- clients that never send a transaction when they must,
- or worse UX that prompts signatures for pure reads.

Chapter **[12](./12_Compiling_Deploying_And_ABI.md)**’s ABI artifact must match reality.

### 5. `@payable` literacy

Payable functions may accept `msg.value`. Non-payable functions should reject unexpected ETH (language/runtime behavior—don’t rely on “we’ll ignore it”). Pair payable with accounting: who is credited, and what event fires?

Zero-value calls to payable functions are a product decision—test both zero and nonzero if both are allowed.

### 6. Default / fallback-style functions (literacy)

Contracts may define special functions that run when:

- ETH is sent with **empty / default** calldata, or
- a call matches no function selector (fallback-shaped behavior).

Exact declarations depend on version—read the **0.4.x** docs before copying folklore. Engineering rules that do **not** depend on trivia:

1. If the contract should **not** accept random ETH, make that obvious and tested.
2. If it **should**, accounting and events must be first-class—not an accidental piggy bank.
3. Fallback paths that execute complex logic are high-severity review magnets.

### 7. No overloading, no modifiers

- **One function name → one signature story** for humans.
- Preconditions live in the body (`assert`), not in a modifier library stacked out of sight.

That verbosity is the audit feature. When Solidity-trained engineers ask “where is the modifier?”, point at the first lines of the function body.

---

## 2. Advanced concepts

### 1. Constructor / `@deploy` is not an everyday external

Initialization runs at deploy. It sets owners and immutables (chapter **06**). It should not leave the contract in an “anyone can finish setup” state unless that is an explicit, time-bounded pattern with tests.

### 2. Public state vs explicit getters

`public` variables generate getters (typically external view). Explicit `@external` `@view` functions are for computed reads, access-controlled reads, or clearer naming. Don’t expose raw storage publicly if the product needs redaction—**there is no redaction on-chain**, but you can avoid convenient getters that encourage wrong client assumptions.

### 3. External calls out

When your external function calls another contract, mutability and reentrancy-shaped risks return. Visibility of *your* function does not constrain *their* code. Defense: minimize untrusted calls; update state first when appropriate (CEI in chapter **[14](./14_Security_Design_And_Review.md)**); test alternate callers.

Prefer typed interface calls over unexplained `raw_call` (chapter **[09](./09_Built_In_Functions.md)**).

### 4. Interface-shaped externals

Interfaces must match mutability and selectors. A `@view` in the interface with a state-changing implementation (or the reverse) is an integration defect waiting for production. ABI consumers in [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) will trust the published mutability—keep it honest.

### 5. Keepers and permissionless entry points

Some `@external` functions are meant to be called by anyone (liquidations, harvests). Label them in NatSpec and monitor them. Permissionless ≠ unchecked: still assert preconditions and bounds (chapter **[07](./07_Control_Structures_And_Statements.md)**).

### 6. SE: API surface budget

Every `@external` is:

- something to test,
- something to document,
- something to monitor,
- something an attacker will call in odd orders.

Prefer a small external surface with rich internals. New externals require a one-line ACL sentence in the PR.

### 7. Ordering inside the function body

Staff-readable shape for state-changing externals:

1. Auth / pause checks,
2. Input bounds,
3. Effects on storage,
4. Interactions (`send`, `raw_call`, token transfers),
5. Events.

Not every function needs all five; reviews ask why a step is missing or reordered.

### 8. Return values and client contracts

Return data is part of the ABI. Changing return types breaks clients as surely as renaming functions. Prefer additive new functions over silent signature edits when integrators already shipped.

### 9. Decorator cheat-sheet for PR review

| You see | Ask |
|---------|-----|
| New `@external` | Who may call? Tests for allow and deny? |
| `@view` / `@pure` | Does the body match? Clients will eth_call. |
| `@payable` | Accounting + events + zero-value policy? |
| Default/receive path | Intentional piggy bank or accident? |
| Many new externals | Can any move to `@internal`? |

Spend five minutes on this table before debating naming aesthetics.

### 10. Migration from Solidity mental models

| Solidity habit | Vyper habit |
|----------------|-------------|
| Modifier stacks | Inline `assert` at top of body |
| Overloads | Distinct names |
| `public` function sprawl | Small `@external` surface |
| Inheritance overrides | Modules / interfaces / explicit wiring |

Cross-link [Solidity](../Solidity/README.md) for shared call mechanics; do not import Solidity *style* into `.vy` reviews.

---

## 3. Applications and use cases

| Angle | Function-decorator habit |
|-------|--------------------------|
| **Application** | External functions *are* the user-facing API—name them for product language. |
| **Systems** | ABI mutability drives client codegen and account abstraction flows. |
| **Security** | Visibility + mutability + payable + default entry points are a fixed review pass. |
| **Ops** | Alert on unexpected payable hits and admin externals; verify ABI on deploy. |
| **SE** | PR checks: new `@external` requires tests, NatSpec, and an ACL sentence. |

**Whole-engineering picture:** decorators are how the contract **publishes its rules** to compilers, clients, and reviewers.

**Smell:** a large `@external` surface with half the functions unused by any client. Delete or `@internal` what the product does not need.

---

## 4. Staff-level review checklist

- Every function has correct `@external` / `@internal` marking; no accidental ABI exports.
- `@view` / `@pure` / payable / state-changing labels match actual behavior.
- Payable functions account for `msg.value` and emit useful events.
- Default/receive/fallback-style paths are intentional, tested, or absent.
- No reliance on modifiers; guards are visible at function tops.
- No overloaded names; renames preferred over clever reuse.
- Permissionless externals are documented and monitored.
- ABI published to clients matches the pinned compiler output.
- Module `exports` (if used) match the intended product API.
- New externals ship with Titanoboa happy-path and auth-failure tests.

---

## References

- [Structure of a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/structure-of-a-contract.html)
- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
