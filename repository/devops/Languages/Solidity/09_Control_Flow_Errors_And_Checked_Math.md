# Control flow, errors, and checked math

[← Back to Solidity](./README.md)

## What this chapter covers

`if` / loops, **`require` / `revert` / `assert`**, **custom errors**, **`try` / `catch`**, and **checked arithmetic** vs **`unchecked`**. Assumes **0.8.x** / **0.8.36**.

When something is not allowed, Solidity does not throw an exception you catch three frames up and log. It **reverts**: the storage changes from *this call* are undone, and the caller sees a typed error (if you wrote one). That is the language’s idea of “no.”

---

## 1. Concepts

### 0. A tiny cashier that says no clearly

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Cashier {
    address public owner;
    mapping(address => uint256) public credit;

    error NotOwner(address caller);
    error ZeroAmount();
    error TooMuch(uint256 have, uint256 want);

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        if (msg.value == 0) revert ZeroAmount();
        credit[msg.sender] += msg.value; // 0.8: overflow would revert (you will not hit it with wei)
    }

    function withdraw(uint256 amt) external {
        uint256 have = credit[msg.sender];
        if (amt == 0) revert ZeroAmount();
        if (amt > have) revert TooMuch(have, amt);

        credit[msg.sender] = have - amt; // effect first
        (bool ok, ) = msg.sender.call{value: amt}("");
        if (!ok) revert TooMuch(have, amt); // prefer a dedicated SendFailed — see ch 15
    }
}
```

**What just happened**

- `ZeroAmount` and `TooMuch` are part of the **API**. Tests and wallets can decode them.
- `if (...) revert Error(...)` is the 0.8 style. `require(cond, "string")` still works; strings cost more gas.
- `credit[msg.sender] = have - amt` happens **before** the ETH leaves. If the send fails, we still need to handle it — chapter **15** / **18**. The point here is: **failures are data**, not a shrug.

### 1. Ordinary control flow

```solidity
if (x > 1) {
    // ...
} else if (x == 1) {
    // ...
} else {
    // ...
}

for (uint256 i = 0; i < xs.length; ++i) {
    // bound this loop — unbounded user-grown arrays DoS themselves
}

while (pending && gasleft() > 30_000) {
    // still not a security boundary; just a batching sketch
}
```

There is no `goto`. `break` / `continue` work in loops. Ternary `a ? b : c` exists.

**Unbounded loops over storage arrays** are a classic denial-of-service: one user grows the list until no one can pay the gas to process it. Design pull patterns or pagination instead.

### 2. Three revert styles (plus custom errors)

| Tool | Typical use | Gas / style |
|------|-------------|-------------|
| `revert CustomError()` | **Default in new 0.8** | Cheap, typed |
| `revert("reason")` / `require(cond, "reason")` | Quick checks, legacy | String costs gas |
| `require(cond)` | Same as revert if false | No message |
| `assert(cond)` | **Internal invariants** (true bugs) | Should never fire in correct code |

```solidity
error Unauthorized(address caller);
error BadAmount(uint256 got);

function withdraw(uint256 amt) external {
    if (msg.sender != owner) revert Unauthorized(msg.sender);
    if (amt == 0) revert BadAmount(amt);
    // ...
}
```

`require(cond, "msg")` is still valid. Prefer **custom errors** from **0.8.4** onward: smaller bytecode, easier to decode in tests (`vm.expectRevert`).

### 3. What a revert does

A revert **undoes state changes** of the current call (and subcalls that did not already succeed in a low-level `call` you chose to ignore). It consumes gas used so far. It returns an error selector + data (or a string).

Wallets show the error if they know the ABI. Tests should `expectRevert` on the **error type**, not a vague “it failed.”

### 4. Checked math (the 0.8 default)

```solidity
function demo(uint256 a, uint256 b) external pure returns (uint256 sum, uint256 diff) {
    sum = a + b; // reverts if a + b does not fit in uint256
    diff = a - b; // reverts if b > a
}
```

This is why SafeMath disappeared from new code. **Pre-0.8** `+` wrapped to a small number and kept going. When you audit old code, assume wrap until proven otherwise.

Under the hood the compiler still emits EVM `ADD` / `SUB` / `MUL` (which wrap). Then it **checks** the result (e.g. `LT` after `ADD` for unsigned overflow) and `revert`s with **`Panic(0x11)`** if the check fails. `unchecked` is “skip that check.” `addmod` / `mulmod` are different opcodes with a 512-bit intermediate — not checked `+`.

Try it in your head: `demo(1, 2)` → `(3, revert)`. `demo(5, 2)` → `(7, 3)`. `demo(type(uint256).max, 1)` → revert on `+`.

### 5. `unchecked` is a signed exception

```solidity
unchecked {
    ++i; // loop index that cannot overflow uint256 in practice
}
```

Use `unchecked` when:

- you have a **proof** overflow is impossible (tight loop index),
- you are implementing a specialized math library and tests cover the wrap,

not because “gas golf blog said so” on a user-supplied balance.

### 6. `try` / `catch` (external calls only)

```solidity
try token.transfer(to, amt) returns (bool ok) {
    if (!ok) revert TransferFailed();
} catch {
    revert TransferFailed();
}
```

`try` only wraps **external** calls (and `new`). It does not catch errors inside your own internal functions. Catching and *continuing* after a failed token transfer is how you silently lose user funds—usually you should revert.

---

## 2. Advanced concepts

### 1. Two revert families: `Error(string)` vs `Panic(uint256)` vs custom

| Blob | Selector (idea) | When |
|------|-----------------|------|
| Custom error | `bytes4(keccak256("TooMuch(uint256,uint256)"))` + args | **Your** API |
| `Error(string)` | `0x08c379a0` + ABI string | `require`/`revert("…")` |
| `Panic(uint256)` | `0x4e487b71` + code | `assert`, overflow, bounds, … |
| Empty | no data | `revert()` — hostile to operators |

**Panic codes you will actually see:**

| Code | Meaning |
|------|---------|
| `0x00` | Generic compiler panic |
| `0x01` | `assert` failed |
| `0x11` | Arithmetic overflow/underflow (checked math) |
| `0x12` | Division or modulo by zero |
| `0x21` | Enum converted from an out-of-range integer |
| `0x22` | Incorrectly encoded storage byte array |
| `0x31` | `pop()` on empty array |
| `0x32` | Array/bytes index out of bounds |
| `0x41` | Too much memory allocated |
| `0x51` | Called an uninitialized internal function |

Do not `assert` user input. `assert` means “if this fires, *our* invariant is broken.”

### 2. `try` / `catch` is a decoder, not a blanket

```solidity
try token.transfer(to, amt) returns (bool ok) {
    if (!ok) revert TransferFailed();
} catch Error(string memory reason) {
    // Error(string) — old-style require
    revert TransferFailed();
} catch Panic(uint256 code) {
    // Panic — decide if you really want to continue
    revert TransferFailed();
} catch (bytes memory lowLevel) {
    // custom error or empty revert — `lowLevel` starts with the selector
    revert TransferFailed();
}
```

`try` only wraps **external** calls and `new`. It does not catch your own internal `revert`. The `returns (...)` clause decodes **success** return data; a token that returns nothing may fail this decode.

### 2b. What each `catch` clause matches

| Clause | Matches when returndata… |
|--------|---------------------------|
| `catch Error(string memory r)` | starts with `Error(string)` selector `0x08c379a0` |
| `catch Panic(uint256 c)` | starts with `Panic(uint256)` `0x4e487b71` |
| `catch (bytes memory lowLevel)` | anything else (custom error, empty, corrupt) |
| `catch { }` | any failure; no data bound |

Order matters: put specific clauses before the generic. An empty revert hits the low-level / bare `catch`, not `Error(string)`. Custom errors are **not** `Error(string)` — decode them from `lowLevel` with `abi.decode` after slicing the selector, or re-revert.

### 3. Division, modulo, and rounding

Integer division **truncates toward zero**. `type(int256).min / -1` overflows (panic). `a / 0` panics. Protocols must specify **who keeps the dust** (round down for the user vs the protocol) in NatSpec *and* a test.

`addmod` / `mulmod` are wrapping modular ops on 512-bit intermediates — useful in crypto math, not a replacement for checked `+` on balances.

**Signed vs unsigned:** `SDIV` / `SLT` exist at the EVM layer; Solidity’s `/` on `int` uses signed division. Mixing `int` and `uint` without an explicit cast is mostly gone in 0.8 — when you cast, you own the reinterpretation.

### 4. `unchecked` is a proof obligation

```solidity
for (uint256 i = 0; i < xs.length; ) {
    // i < length ≤ 2^256-1, so ++i cannot overflow. OK.
    unchecked { ++i; }
}
```

`unchecked { balances[a] -= x; }` on a **user balance** is pre-0.8 underflow. Reviewers treat that as a finding unless a comment proves `balances[a] >= x` already.

### 4b. What `unchecked` does *not* disable

- User `require` / `revert` / custom errors still fire.
- Array bounds checks still panic (`0x32`) unless you are in assembly.
- Division by zero still panics.
- Only the **overflow/underflow checks** on `+ - *` (and related) are skipped inside the block.

### 5. Failed low-level `call` does not revert you

```solidity
(bool ok, bytes memory data) = target.call{value: amt}("");
if (!ok) revert SendFailed();
// `data` is returndata — decode only if you expected some
```

If you ignore `ok`, their state (if any) may have reverted while yours did not. That is the core of several chapter **15** / **18** bugs.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Errors as part of the API (clients decode them) |
| **Systems** | No unbounded `for` over a user-grown array in a single tx |
| **Security** | Checked math on; `unchecked` justified; user input never `assert` |
| **Operations** | Runbooks map error selectors to human meaning |
| **Software engineering** | Tests cover revert paths, not only happy paths |

---

## 4. Staff-level review checklist

- User-facing failures use **custom errors** (or short requires), not `assert`.
- Every `unchecked` block has a one-line **why**.
- Loops over storage collections are **bounded** or pulled per-user.
- `try/catch` does not swallow failures that should abort the tx.
- Tests use `expectRevert` with the **specific** error.
- Brownfield 0.7 files are not copied forward with silent wrap.

---

## References

- [Expressions and control structures](https://docs.soliditylang.org/en/v0.8.36/control-structures.html)
- [Error handling](https://docs.soliditylang.org/en/v0.8.36/control-structures.html#error-handling-assert-require-revert-and-exceptions)
- [0.8 breaking changes (checked arithmetic)](https://docs.soliditylang.org/en/v0.8.36/080-breaking-changes.html)
- [Cheatsheet](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [Security considerations](https://docs.soliditylang.org/en/v0.8.36/security-considerations.html)
