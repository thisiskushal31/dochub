# Control structures and statements

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper expresses **branching**, **bounded loops**, **assertions**, and related **statements**—and why **unbounded loops** and **recursion** are out of bounds by design. After this chapter you should write control flow that a reviewer can gas-bound and that fails closed when invariants break.

Pin: **Vyper 0.4.x** (**0.4.3**). Shared EVM revert mindset overlaps [Solidity](../Solidity/README.md); Vyper’s missing `while (true)` culture is intentional (chapter **01**). Gas-bound literacy: chapter **18**. Function decorators in depth: chapter **08**.

---

## 1. Concepts

### 1. `if` / `elif` / `else`

```vyper
if amount == 0:
    return
elif amount > self.limit:
    raise "too large"
else:
    self.total += amount
```

Conditions must be **booleans**—no Python-style truthiness of integers. Prefer **early exits** for authorization and trivial cases so the happy path stays readable. Without modifiers, the top of an `@external` function is where guards live—make them boring and visible.

### 2. Assertions and `raise`

Vyper uses **state-reverting** exceptions (`REVERT`). On failure, state for the call reverts; remaining gas is returned to the sender (normal `REVERT` path). Exceptions in sub-calls bubble up.

```vyper
assert x > 5, "value too low"
raise "something went wrong"
```

| Form | Use |
|------|-----|
| `assert cond, "reason"` | Equivalent to `if not cond: raise "reason"` |
| `raise "reason"` | Unconditional failure |
| Reason string | Optional; max **1024** bytes if present |
| Reason `UNREACHABLE` | Uses `INVALID` instead of `REVERT` (no gas refund)—interoperability/analysis niche; **not** general practice |

Staff habit: messages help operators and tests—not jokes, not secrets.

### 3. `for` loops — array iteration

```vyper
foo: int128[3] = [4, 23, 42]
for i: int128 in foo:
    ...
```

You may iterate fixed lists, dynamic arrays (within their max), or literals with a consistent element type.

Restrictions:

- Do not iterate multi-dimensional arrays as a single “base type” loop.
- Do not modify the array under iteration (or call something that might).

### 4. `for` loops — `range` (boundable)

| Form | Meaning |
|------|---------|
| `range(STOP)` | `STOP` literal > 0; `i` from 0 to `STOP-1` |
| `range(START, STOP)` | Literals; `START < STOP` |
| `range(stop, bound=N)` | Runtime `stop`; compile-time constant `N`; reverts if `stop > N` |
| `range(start, end, bound=N)` | Runtime start/end; runtime checks `end - start <= bound` |

```vyper
for i: uint256 in range(8):
    self.buckets[i] = 0

for i: uint256 in range(n, bound=64):
    ...
```

To avoid revert when `stop` might exceed `N`, use patterns like `range(min(stop, N), bound=N)` for chunked work across transactions.

If `N` can be user-supplied without a cap, you reinvented unbounded work—the language and reviewers will push back.

### 5. Loop control statements

| Statement | Effect |
|-----------|--------|
| `break` | Leave the nearest `for` |
| `continue` | Next iteration of the nearest `for` |
| `pass` | No-op placeholder—must not ship as empty security-sensitive externals |
| `return` | Leave the function with optional value; no unreachable code after |

Functions with a return type must end in `return` or another terminator such as `raise`.

### 6. `log` (events beside control flow)

```vyper
log MyEvent(...)
```

Evaluation order of `log` arguments is **undefined**—compute side-effecting args in separate statements first (chapter **10**). When a branch changes security-critical state, emit an event on that path.

### 7. What you will not write

| Non-feature | Review implication |
|-------------|-------------------|
| **No recursion** | No recursive helpers; use bounded loops or redesign |
| **No unbounded `while`** | No “until storage says stop” without a hard cap |
| **No modifier sugar** | Guards are inline—easy to see, easy to forget if undisciplined |

These keep **gas and control flow** in the auditable set (chapter **18**).

---

## 2. Advanced concepts

### 1. Gas bounding as a design requirement

Ask of every loop:

1. What is the **maximum** iterations in production?
2. Who controls that maximum?
3. What happens at the cap—revert, partial fill, or queue elsewhere?

If the answer is “depends on how big the array grew,” storage growth is part of the threat model. Off-chain pagination or keeper patterns often beat on-chain “process everything.”

For practical “keep the call affordable” patterns—storage vs events, call fan-out, optimize pragma, measurement—see chapter **[19](./19_Gas_Performance_And_Efficient_Contracts.md)**.

### 2. Assert vs branch return

| Pattern | Use |
|---------|-----|
| **`assert` / `raise`** | Hard invariant; caller must not proceed |
| **`return` early** | Soft path; valid no-op |
| **Error codes in return data** | Rare for entrypoints; prefer revert for failure on funds paths |

Do not return `false` for failed auth on a funds-moving function unless the ABI and clients explicitly expect that style—and even then, question it.

### 3. Reentrancy-shaped thinking (defense)

**Checks → effects → interactions** remains good hygiene when calling out. Control flow that updates storage after external calls deserves extra review. Language support includes `@nonreentrant` and (from **0.4.2**) `#pragma nonreentrancy on` with opt-out `@reentrant` / `reentrant()` for getters—details in chapter **08**. This chapter’s job: make the *order of statements* honest.

### 4. Integer loops and off-by-one

`range` bounds are a classic defect source. Tests should include `0`, `1`, `max`, and `max+1` (expect revert) for user-facing limits. Property tests for bounds beat only-happy-path demos.

### 5. Default / fallback path

`__default__` runs when no selector matches (or plain ETH send). Payable defaults must respect the **2300 gas stipend** if they must succeed via `send`-style transfers—logging may fit; storage writes often do not. Generated default is revert if you omit one—funds via bare send then fail. Chapter **08** owns the decorator table; here: treat default as **control-flow surface**, not an afterthought.

### 6. Compiling away vs readability

Extremely clever boolean nesting rarely pays for audit time. Prefer readable `if` chains for ACL. The language already removed darker obfuscation tools—don’t rebuild them with puzzles.

### 7. Version-specific statement forms

Match `for` syntax (`for i: T in ...`) and exception styles to **0.4.x** docs. Brownfield **0.3.x** may differ; don’t mix dialects in one file during a port.

---

## 3. Applications and use cases

| Angle | Control-flow habit |
|-------|--------------------|
| **Application** | Feature flags and state machines as explicit `if`s, not hidden wrappers. |
| **Systems** | Batch sizes and caps become on-chain parameters ops can monitor. |
| **Security** | Bounds + asserts are the first reading pass after types and visibility. |
| **Ops** | Revert reasons and events explain failed user actions in support. |
| **SE** | PR template asks “loop bound?” on any new `for`. |

**Whole-engineering picture:** control flow is where **product rules become gas and safety**.

---

## 4. Staff-level review checklist

- Every loop has a documented, enforceable bound (`range` bound=, fixed `N`, or DynArray max).
- No recursive patterns; redesigns preferred over clever stacks.
- Auth and invariant checks sit at the top of external functions.
- User-controlled sizes cannot force unbounded work.
- Hot loops have a measured gas story when they touch storage or external calls (chapter **19**).
- `if` conditions are real booleans—no truthiness assumptions.
- Failure modes revert on funds/auth paths unless ABI explicitly says otherwise.
- `log` args without side effects at the call site; critical branches emit events.
- State updates prefer checks-effects-interactions when external calls exist.
- Boundary tests cover zero, one, max, and over-max.
- `__default__` behavior (payable vs revert) matches product intent for plain ETH transfers.
- Silent branches that change authority or balances also log events.

---

## References

- [Control structures (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/control-structures.html)
- [Statements (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/statements.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Solidity track](../Solidity/README.md)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
