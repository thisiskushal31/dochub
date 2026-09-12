# Testing with Foundry and Hardhat

[← Back to Solidity](./README.md)

## What this chapter covers

How to **prove** contract behavior: Foundry **unit / fuzz / fork / invariant** tests, Hardhat **JS/TS** tests, cheatcodes vs fixtures, and what “tested” must mean before a review. Assumes **0.8.x** / **0.8.36**.

Clicking Remix until it “looks right” is how you learn. A test file is how you *keep* the learning. If you cannot make the computer fail on purpose (`expectRevert`), you do not yet know the door is locked.

---

## 1. Concepts

### 1. A contract without tests is a draft

On a chain, you cannot hotfix a slot the way you hotfix a pod. Tests are how you gain the right to deploy. Minimum bar:

- unit tests for each external path (success + revert),
- at least one **fuzz** or property test on math/accounting,
- deploy script smoke-tested on a local node.

### 2. Foundry tests are Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter internal c;

    function setUp() public {
        c = new Counter();
    }

    function test_Inc() public {
        c.inc();
        assertEq(c.n(), 1);
    }

    function test_RevertWhen_NotOwner() public {
        vm.prank(address(0xBEEF));
        vm.expectRevert(Counter.NotOwner.selector);
        c.reset();
    }

    function testFuzz_Set(uint256 x) public {
        c.set(x);
        assertEq(c.n(), x);
    }
}
```

| Piece | Role |
|-------|------|
| `setUp()` | Fresh state each test |
| `test_*` / `testFuzz_*` | Discoverable entry points |
| `vm.prank` | Next call’s `msg.sender` |
| `vm.expectRevert` | Assert a typed error |
| `assertEq` | From `forge-std` |

```bash
forge test
forge test -vvv --match-test test_Inc
forge coverage
```

### 3. Cheatcodes you will use weekly

| Cheat | Job |
|-------|-----|
| `vm.prank` / `startPrank` | Identity |
| `vm.deal` | Give ETH |
| `vm.warp` / `roll` | Time / block |
| `vm.expectRevert` / `expectEmit` | Negative and log paths |
| `vm.assume` / `bound` | Fuzz constraints |
| `vm.mockCall` | Stub an external |
| `vm.store` / `load` | Slot surgery (use sparingly) |
| `vm.createSelectFork` | Fork a live chain |

Cheatcodes are test-only. They do not exist in production bytecode.

### 4. Fuzz and invariants

**Fuzz:** Foundry throws random inputs at `testFuzz_*`. Constrain with `bound(x, 0, 1e18)` so you test the domain you mean.

**Invariants:** a separate contract whose `invariant_*` functions must hold after random sequences of permissioned calls. This is how you catch “accounting drifted after 200 random ops,” not with one happy-path unit test.

### 5. Hardhat tests are JS/TS

```javascript
const { expect } = require("chai");

describe("Counter", function () {
  it("increments", async function () {
    const C = await ethers.getContractFactory("Counter");
    const c = await C.deploy();
    await c.inc();
    expect(await c.n()).to.equal(1n);
  });
});
```

```bash
npx hardhat test
```

Hardhat shines when the assertion is about **ethers/viem + wallets + a dapp helper**. Foundry shines when the assertion is about **Solidity state**. Running both is normal: Foundry for the protocol, Hardhat for the app repo.

### 6. Fork tests

`vm.createSelectFork(rpc)` runs against a copy of mainnet/testnet state. Use them to check integration with a **specific** token or pool you did not write. Pin a **block number** so CI is reproducible. Do not treat a fork test as a license to poke live systems.

---

## 2. Advanced concepts

### 1. Coverage is a flashlight, not a score

100% line coverage can miss a permission hole. Use coverage to find **untested revert paths**, then write the test that names the error.

### 2. Cheatcodes are a different EVM

Foundry’s `vm.*` (and Hardhat’s `hardhat_setStorageAt`, `evm_increaseTime`, …) are **test-host** powers, not opcodes your users have:

| Cheat | What it does | Review habit |
|-------|----------------|--------------|
| `prank` / `startPrank` | next `msg.sender` | test auth as *not* the deployer |
| `deal` | set ERC-20 / ETH balance | does not run `transfer` hooks |
| `warp` / `roll` | timestamp / height | test `start - 1` and `start` |
| `store` / `load` | raw slot | bypasses constructors — label the slot |
| `expectRevert` / `expectEmit` | assertions on revert/log | match selector, not only “any revert” |
| `mockCall` | fake a callee’s return | can hide integration bugs |
| `snapshot` / `revertTo` | state savepoints | |
| `createSelectFork` | fork RPC at a block | pin the block number |

A test that only ever calls as the deployer has not tested access control.

### 3. `vm.store` can lie

Writing a slot to “set owner” bypasses the constructor. Fine for a focused unit test; dangerous if it becomes how you *only* set up state. Prefer real constructors and public setters. If you `store`, comment the **slot formula** (chapter **12**) and assert `owner() == expected` through the public getter.

### 4. Fuzz and invariants

**Fuzz** (`function testFuzz_deposit(uint256 amt)`): Foundry mutates inputs. Bound them (`amt = bound(amt, 1, 1e24)`) or you spend the campaign in revert-on-zero.

**Invariants** (`contract Handler is Test` + `targetContract` + `invariant_supply()`): a sequence of random handler calls, then a global assert (`sum(balances) == totalSupply`). This is how you catch “one function desynced accounting,” not a single-tx unit test.

When Foundry prints a failing seed, add a **unit** test with that input. Do not “rerun until green.”

### 5. Fork tests

`vm.createSelectFork(rpc, blockNumber)` runs against mainnet (or testnet) state. Pin the **block**. Put the RPC URL in CI secrets. Fork tests are for “this live token really returns nothing” and “this pool’s slot is where we think.” They are not a substitute for a hermetic unit suite (flaky RPC, state moves).

### 6. Time-dependent tests

`vm.warp` is required for vesting. Also test the boundary (`start - 1` reverts, `start` succeeds). `skip` / `rewind` are wrappers. Do not `warp` to `0`.

### 7. Gas snapshots

`forge snapshot` / gas reports catch accidental complexity. Fail CI on huge regressions for hot functions — not on every 10-gas wiggle. Optimizer settings in test must match **release** or the snapshot is a different program (chapter **16**).

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Tests read like the spec (names, errors) |
| **Systems** | Fork tests pin block + RPC secret in CI vault |
| **Security** | Negative tests for auth; fuzz balances |
| **Operations** | `forge test` / `hardhat test` is the merge gate |
| **Software engineering** | One command in README; no “run these 9 files in Remix” |

---

## 4. Staff-level review checklist

- Every external function has a success test and at least one **revert** test.
- Auth is tested with `prank`, not only as the deployer.
- Math/accounting has **fuzz** or invariant coverage.
- Fork tests (if any) pin a block and do not need mainnet keys.
- CI runs the same commands as the README.
- Foundry vs Hardhat responsibilities are written down if both exist.

---

## References

- [Foundry Book — tests](https://book.getfoundry.sh/forge/tests)
- [Foundry Book — fuzz testing](https://book.getfoundry.sh/forge/fuzz-testing)
- [Foundry Book — invariant testing](https://book.getfoundry.sh/forge/invariant-testing)
- [Foundry Book — cheatcodes](https://book.getfoundry.sh/cheatcodes/)
- [Hardhat: testing](https://hardhat.org/tutorial/testing-contracts)
- [Hardhat: network helpers](https://hardhat.org/hardhat-network-helpers/docs/overview)
- [forge-std](https://github.com/foundry-rs/forge-std)
