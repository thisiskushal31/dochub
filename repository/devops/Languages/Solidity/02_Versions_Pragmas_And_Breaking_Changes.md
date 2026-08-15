# Versions, pragmas, and breaking changes

[← Back to Solidity](./README.md)

## What this chapter covers

How Solidity versions work (`0.y.z`), what a **`pragma`** actually constrains, why **0.8** is the default writing line, what **pre-0.8** still means in audits, and why **`solc` + EVM version + via-IR** are three different pins. Handbook snapshot: **0.8.36**. Ship the latest patch you can defend.

The short version: the first line of almost every file is a promise about *which language* you wrote. The config file is a promise about *which compiler binary* you ran. Those are not the same promise.

---

## 1. Concepts

### 1. Why the version is `0.y.z`

Solidity is still in `0.y.z` because the team treats **breaking language changes** as normal between minor numbers. That is a warning, not a fashion statement: code written for 0.7 can fail to compile as 0.8; 0.8 checked math changes the *meaning* of `+` for auditors of old code.

**Only the latest released compiler is guaranteed security fixes.** An old `solc` may still compile; it may also contain known compiler bugs. Staying on “the version the first tutorial used” is a risk decision.

### 2. The pragma is a constraint, not a pin

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;
```

| Form | Meaning |
|------|---------|
| `pragma solidity ^0.8.36;` | 0.8.36 ≤ version < 0.9.0 |
| `pragma solidity >=0.8.36 <0.9.0;` | Same idea, explicit |
| `pragma solidity 0.8.36;` | **Exactly** 0.8.36 |

The pragma tells `solc` which sources it is allowed to compile. It does **not** download a compiler. Foundry’s `solc_version` / `auto_detect_solc`, Hardhat’s `solidity.version`, and Remix’s dropdown do that.

Staff habit: **pragma names the family; CI pins the exact compiler.**

See it in a file:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract VersionDemo {
    // This `+` is *checked*. On 0.7 it would have wrapped.
    function add(uint256 a, uint256 b) external pure returns (uint256) {
        return a + b;
    }
}
```

**What just happened**

- `^0.8.36` means “I was written for the 0.8 line, starting at .36.”
- If someone opens this in Remix on `0.7.6`, the compiler should refuse. Good.
- If CI silently uses `0.8.19` while you tested `0.8.36`, it may still compile — and still be a *different* compiler. That is why Foundry/Hardhat pin an exact version next to the pragma.

```toml
# foundry.toml — this is the pin, not the pragma
solc_version = "0.8.36"
evm_version = "cancun"
```

### 3. What 0.8 changed that you must feel

Since **0.8.0**, for new code:

| Topic | 0.8 default | Pre-0.8 habit you will still see |
|-------|-------------|----------------------------------|
| Arithmetic | **Checked** — overflow reverts | Silent wrap; SafeMath libraries |
| Escape hatch | `unchecked { ... }` | Everywhere unchecked |
| ABI coder | **v2** default | coder v1; `pragma abicoder v2` |
| `byte` | Gone — use `bytes1` | `byte` alias |
| Constructor | `constructor()` | Sometimes a function named after the contract (very old) |

Write new contracts as if checked math is the air. Use `unchecked` only when you can prove why (chapter **09**).

Feel the difference with one function. On **0.8** this reverts. On **0.7** the same `+` would wrap to a tiny number — and that used to drain people.

```solidity
function oneMore(uint256 x) external pure returns (uint256) {
    // If x is type(uint256).max, 0.8 reverts. That is a feature.
    return x + 1;
}
```

### 4. Landmarks inside 0.8 you will meet

You do not need every patch note. You need these staff-visible steps:

| Landmark | What changed for authors |
|----------|--------------------------|
| **0.8.4+** | Custom errors become everyday (`error Unauthorized()`) |
| **0.8.8+** | User-defined value types |
| **0.8.13+** | `using {fn} for Type global`; via-IR more common |
| **0.8.18+** | `block.prevrandao` instead of `block.difficulty` |
| **0.8.20+** | Shanghai / `PUSH0` — **evmVersion** starts biting harder |
| **0.8.24+** | **Transient storage** (`tstore`/`tload`) as a language story |
| **0.8.29+** | Custom storage layouts (upgrade-adjacent) |
| **0.8.35–0.8.36** | Compiler-pipeline experiments; EOF backend **removed** after EOF missed its fork — pipeline literacy, not a new app style |

This handbook’s examples assume **0.8.36** unless a snippet is labeled brownfield.

### 5. EVM version is a second pin

`solc --evm-version cancun` (or `prague`, `shanghai`, …) chooses which **opcodes and gas schedule** the compiler may use. A contract that emits `PUSH0` will not deploy on a chain that never activated Shanghai. A contract that uses transient storage needs **Cancun**.

Wrong `evmVersion` looks like “it compiled on my laptop and failed on the network.” Record it next to `solc`.

### 6. via-IR is a third pin

The compiler can codegen through **Yul IR** (`--via-ir` / `viaIR: true`). It can change gas and, historically, a few edge semantics. Two builds with the same `solc` and different via-IR settings are **different artifacts**. Verification and incident response need to know which one you shipped (chapter **16**).

---

## 2. Advanced concepts

### 1. Three pins that must agree

| Pin | Where | What it controls |
|-----|--------|------------------|
| `pragma solidity` | every `.sol` | language / breaking changes the *source* accepts |
| `solc` version | `foundry.toml` / Hardhat / CI | **which binary** emits bytecode |
| `evmVersion` | same config | **which opcodes** that binary may emit |

A file can say `^0.8.20` while CI compiles with 0.8.36 and `evmVersion = cancun`. That is fine if intentional. It is a bug if Remix used 0.8.19 + `paris` and you verify with 0.8.36 + `cancun` — metadata and `PUSH0`/`TSTORE` will not match.

### 2. Floating pragmas in libraries

`^0.8.0` on a library means “any 0.8.” Friendly for consumers, hostile to reproducibility if the *application* also floats. Application lock: exact `solc` in Foundry/Hardhat. Library authors: the widest range they actually test.

### 3. Multiple compilers in one repo

Hardhat can compile different files with different versions (legacy dependency + new module). Valid and easy to get wrong: two ABIs, two metadata blobs, two bug surfaces. Document *why* a second compiler exists.

### 4. Landmark breaking changes (so brownfield reviews have a map)

| Era | What changed (selected) |
|-----|-------------------------|
| 0.5 | explicit visibility; `address payable`; no `var` |
| 0.6 | `virtual`/`override`; `try/catch`; `receive` |
| 0.7 | `now` removed; constructors no longer named after the contract |
| 0.8.0 | **checked arithmetic**; ABI coder v2 default; `Error`/`Panic` |
| 0.8.4 | custom errors |
| 0.8.8 | user-defined value types |
| 0.8.13 | `using {f} for T` |
| 0.8.18 | `block.prevrandao`; `PUSH0` era approaching |
| 0.8.24+ | transient storage (`transient` keyword / Cancun) |
| 0.8.29+ | custom storage layouts |

You do not memorize every changelog row. You know **0.8.0 math** and **custom errors** are not optional literacy.

### 4b. Language version ≠ EVM version (two dials)

| You set | Controls | Wrong match failure |
|---------|----------|---------------------|
| `pragma` / `solc` 0.8.z | Syntax, checked math, which language features exist | Won’t compile / different semantics |
| `evmVersion` | Which opcodes `solc` may emit | Deploy succeeds, runtime **invalid opcode** on older forks |

Examples: `transient` keyword needs a new enough **language** *and* `cancun`+ **evmVersion** *and* a Cancun chain. `PUSH0` needs `shanghai`+ evmVersion. You can compile 0.8.36 with `evmVersion = paris` to target an older fork — then you must not use Cancun-only features.

### 5. Pre-0.8 review hazards (not templates)

When you open an old file:

- `+` / `-` / `*` may wrap. Look for SafeMath or comments that assume wrap.
- `transfer` / `send` used as a “reentrancy fix” (2300-gas stipend) — insufficient (chapters **15**, **18**).
- `now`; constructor named like the contract; `throw`.

Rewrite toward 0.8 rather than adding more SafeMath.

### 6. Compiler bugs list

The project publishes known compiler bugs by version. Pinning latest is how you leave those rows. If you must freeze an old `solc`, you own that list in the risk doc.

### 7. Remix vs CI mismatch

Remix may offer “latest” while `foundry.toml` says `0.8.24`. Bytecode will differ. Explorer verification will fail. Onboarding should say **the repo pin wins**.

---

## 3. Applications and use cases

| Lens | Practice |
|------|----------|
| **Application** | Pragma on every source; no “whatever Remix had open” |
| **Systems** | `evmVersion` matches the target chain’s hard fork |
| **Security** | Latest `solc` unless a written waiver; no abandoned 0.4/0.5 for new value |
| **Operations** | Same solc/via-IR/evmVersion in CI, scripts, and verify |
| **Software engineering** | Changelog when bumping 0.8.z; tests re-run on the new compiler |

---

## 4. Staff-level review checklist

- [ ] Application sources use a **0.8.x** pragma; CI installs an **exact** `solc`.
- [ ] `evmVersion` and via-IR are **named** in config, not left as tribal knowledge.
- [ ] Remix (if used) is set to the **same** compiler family as CI.
- [ ] Pre-0.8 files are labeled brownfield; new modules are not added in 0.7 style.
- [ ] A compiler bump is a reviewable change (lockfile / config diff), not a silent Remix click.
- [ ] Someone can answer “which known-bug list applies to our pin?”

---

## References

- [Installing the Solidity compiler](https://docs.soliditylang.org/en/v0.8.36/installing-solidity.html)
- [Layout of a Solidity source file (pragma)](https://docs.soliditylang.org/en/v0.8.36/layout-of-source-files.html)
- [Solidity 0.8 breaking changes](https://docs.soliditylang.org/en/v0.8.36/080-breaking-changes.html)
- [List of known bugs](https://docs.soliditylang.org/en/v0.8.36/bugs.html)
- [Using the compiler](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [Compiler security policy](https://github.com/argotorg/solidity/security/policy)
- [Solidity blog (releases)](https://blog.soliditylang.org/)
- [Foundry: compiler config](https://book.getfoundry.sh/config/)
- [Hardhat: Solidity configuration](https://hardhat.org/hardhat-runner/docs/config#solidity-configuration)
