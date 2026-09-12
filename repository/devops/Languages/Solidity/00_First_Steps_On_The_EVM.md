# First steps on the EVM

[← Back to Solidity](./README.md)

## What this chapter covers

Your first honest contact with an Ethereum-style contract. By the end you should be able to say, in plain language: what an **account** is, what a **transaction** does, why **gas** exists, and why a contract is not a web server. You will compile a tiny contract, change a stored value, and read it back.

Assumes **Solidity 0.8.x** (handbook snapshot **0.8.36**). Later chapters explain the compiler and the EVM. Today you only need one working picture and one successful hello.

---

## 1. Concepts (basic)

### 1. Picture this before any jargon

Imagine a vending machine bolted to the town square. Everyone can walk up and press buttons. Everyone can see what is inside the glass. Nobody can sneak around the back and “just restart it.” If the coin slot is wired wrong, it stays wired wrong until someone hauls in a *new* machine.

That is closer to a **smart contract** than “a Node server in the cloud.”

A typical backend is a process on a machine you control. You deploy, restart, patch, and read private logs.

A contract is **bytecode plus storage** at an **address** on a chain. Every honest node executes the same code the same way. You do not SSH in. You do not `kill -9` a hung request. If the code is wrong, the wrongness is public and durable.

| Everyday software | EVM contract |
|-------------------|--------------|
| Process + database you operate | Code + storage at an address |
| You can patch the binary in place | You deploy **new** code (or a planned upgrade system) |
| Failures can be retried quietly | Failed calls **revert**; successful ones land on a ledger |
| Secrets can live on the server | Bytecode and storage are inspectable |

Hold this from day one: **deploy is closer to publishing a constitution than to shipping a container.**

### 2. Two kinds of account (who is pressing the buttons)

| Kind | What it is | How it acts |
|------|------------|-------------|
| **Externally owned account (EOA)** | Address controlled by a private key (your wallet) | Starts transactions; pays gas |
| **Contract account** | Address whose code the EVM runs | Runs when called; cannot wake itself up |

Your wallet is an EOA. The thing you deploy is a contract account. Inside a function, `msg.sender` means “who called me *this time*”—often a wallet, sometimes another contract.

### 3. A transaction is a signed “please change the world”

A **transaction** is a signed message that can send ETH, create a contract, or call a function (or combine those).

It has a **nonce** (so your txs stay in order), a **gas limit**, and a **fee**. A block producer includes it. After that, every node agrees on the new state.

A **read** is different. A `view` or `pure` function (Remix’s *call*, or `eth_call`) asks “what is the value *right now*?” It does not need a signature and does not spend ETH as a state-changing fee. Beginners mix these up constantly:

- **Transact / send** → write → costs gas → changes storage.
- **Call** on a `view` function → read → usually free on a node → storage unchanged.

If you remember only one click-rule from Remix: *did I change a number, or only look at it?*

### 4. Gas is the meter, not a tip jar

The EVM charges **gas** for each step so a program cannot loop forever for free. You set a **limit**. You pay a **price** (the market). Unused gas comes back. Gas spent on work that **reverted** does *not* come back—you paid for the attempt.

You do not need the opcode table yet. Three intuitions are enough:

1. **Writes cost more than reads.**
2. **Storage is the expensive part.**
3. **Out of gas → the call reverts.**

### 5. Ether units you will see on day one

Wallets show **ether**. The EVM counts **wei**. Solidity lets you write the human names:

```solidity
uint256 tip = 1 ether;   // 1000000000000000000 wei  (18 zeros)
uint256 fee = 5 gwei;    // 5000000000 wei
uint256 dust = 1 wei;    // 1
```

| Name | Meaning |
|------|---------|
| **wei** | Smallest unit |
| **gwei** | `1e9` wei (often how people quote gas price) |
| **ether** | `1e18` wei (the unit on the price sticker) |

### 6. Remix is the doorway; Foundry/Hardhat are the workshop

**Remix** is a browser IDE: editor, compiler, and a fake chain (Remix VM) so you can deploy without a wallet. Use it to *see* compile → deploy → call. It is not production CI.

**Foundry** (`forge`) and **Hardhat** are what you test and ship with. This chapter shows Remix first, then a Foundry hello so both exist in your head. Chapter **03** compares them properly.

### 7. Your first contract — read it like a short story

Here is a complete file. Read the comments; they are the lesson.

```solidity
// SPDX-License-Identifier: MIT
// A license tag. The compiler warns if this line is missing.
// MIT is a common choice for examples; pick one license for a real repo.

pragma solidity ^0.8.36;
// “Only compile me with Solidity 0.8.36 or newer, but stay on the 0.8 line.”
// The caret (^) is a range. Your CI should still pin an *exact* solc.

contract Hello {
    // Everything you deploy is a contract: one address, one blob of code,
    // plus whatever storage you declare below.

    string public greeting = "hello";
    // A *state variable*. It lives in storage — it survives after the call.
    // `public` asks the compiler to invent a getter: greeting().
    // That getter is a read. It does not need a transaction.

    function setGreeting(string calldata next) external {
        // `external`  = meant to be called from outside (wallet or other contract).
        // `calldata`  = “read the argument from the input tape; don’t copy it yet.”
        // This function *writes* storage, so Remix will ask you to *transact*.
        greeting = next;
    }

    function greet() external view returns (string memory) {
        // `view` = I promise I only read. Nodes will usually run this as a call.
        // `memory` on the return = “hand back a temporary copy of the string.”
        return greeting;
    }
}
```

**What just happened (the plot):**

1. You defined a box named `Hello`.
2. Inside the box is one sticky note, `greeting`, starting as `"hello"`.
3. `greet()` / `greeting()` lets anyone *read* the note.
4. `setGreeting("hi")` *replaces* the note. That is a transaction.

| Piece | Role |
|-------|------|
| `SPDX-License-Identifier` | License; compiler warns if missing |
| `pragma solidity ^0.8.36` | Which language family |
| `contract Hello` | The deployable unit |
| `string public greeting` | Permanent state + free getter |
| `setGreeting` | Write path → transaction |
| `greet` | Read path → call |

### 8. First Remix lab (do this once — it makes the rest stick)

1. Open Remix IDE in the browser (hub link in References).
2. Create `Hello.sol` and paste the contract above.
3. Compiler plugin: pick **0.8.36** (or the latest 0.8.x). Click Compile. Green check = the language accepted your file.
4. Deploy & run: environment **Remix VM** (a toy chain in the tab). Click Deploy.
5. You should see a deployed `Hello` with orange/blue buttons.
6. Click `greet` (or `greeting`). You should see `hello`. That was a **read**.
7. Type `howdy` into `setGreeting`, confirm the transaction, then `greet` again. You should see `howdy`. That was a **write**.

If compile fails, read the *first* error—usually the wrong compiler version or a missing semicolon. If deploy fails, you are probably on a wallet environment with no test ETH; switch back to Remix VM.

Write down the compiler version Remix used. You will need that habit in chapter **02**.

### 9. A second tiny contract: a counter (same ideas, numbers instead of a string)

Once Hello feels obvious, this is the same shape with `uint256`. Numbers are how most real contracts think.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Counter {
    uint256 public n; // starts at 0. Public → automatic n() getter.

    // Runs *once*, when the create-transaction happens. Never again.
    constructor(uint256 start) {
        n = start;
    }

    function inc() external {
        n += 1; // Solidity 0.8: if this ever overflowed, it would revert.
    }

    function set(uint256 next) external {
        n = next;
    }
}
```

**What just happened:** deploy with `start = 7`, then `n()` returns `7`. Click `inc` (transact). `n()` returns `8`. You have now done constructor args, a write, and a read.

### 10. Same idea in Foundry (optional today, required soon)

```bash
# After installing Foundry (see getfoundry.sh / chapter 03):
forge init hello-evm
# Put Hello.sol in src/Hello.sol
forge build     # did the compiler accept it?
```

A first test can be this small. Comments say what each cheat/assert is doing:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

import {Test} from "forge-std/Test.sol";
import {Hello} from "../src/Hello.sol";

contract HelloTest is Test {
    Hello internal hello;

    function setUp() public {
        // Fresh contract before every test. Like a clean Remix VM deploy.
        hello = new Hello();
    }

    function test_DefaultGreeting() public view {
        assertEq(hello.greet(), "hello");
    }

    function test_SetGreeting() public {
        hello.setGreeting("howdy");
        assertEq(hello.greet(), "howdy");
    }
}
```

```bash
forge test -vv
```

Green tests mean: the story you clicked in Remix is now **repeatable**. Chapter **17** goes much further. Today, `forge build` (and this tiny test if you want) is enough.

### 11. One security rule before you go further

Never paste a “helpful” contract or console snippet that asks you to **approve tokens**, **send ETH**, or **export a seed phrase**. Code you deploy can move whatever it is allowed to move. Seed phrases are not debugging tools.

If a stranger’s snippet includes `delegatecall`, `selfdestruct`, `tx.origin`, or an unverified “proxy,” stop and come back after chapters **15** and **18**.

---

## 2. Advanced concepts

### 1. Simulation vs a public network

| Environment | What it is | When to use it |
|-------------|------------|----------------|
| **Remix VM** | In-browser fake chain | Learning, clicking through buttons |
| **Anvil** / Hardhat Network | Local node on your machine | Tests and scripts |
| **Testnet** | Public practice chain | Wallets, explorers, “verify” rehearsal |
| **Mainnet** | Real value | Only after tests, review, and a key plan |

A successful Remix VM deploy proves you understand compile → create → call. It proves **nothing** about gas markets, wallets, or explorer verification.

### 2. What a transaction actually contains

An EIP-1559 tx (type 2) is roughly: `chainId`, `nonce`, `maxPriorityFeePerGas`, `maxFeePerGas`, `gasLimit`, `to` (empty = create), `value`, `data`, `accessList`, signature (`yParity`, `r`, `s`).

The node runs the EVM. The **receipt** records: status (success/revert), gas used, logs, and (for creates) the new address. Reverts still cost gas; the receipt status is `0` and state is unwound.

`data` for a call is ABI calldata (chapter **14**). `data` for a create is **init code** + ABI-encoded constructor args (chapter **05**).

### 3. What “create” actually does

The EVM runs your **constructor** (init code) once, keeps the leftover **runtime bytecode**, and assigns an address:

```text
CREATE  → last 20 bytes of keccak256(rlp([sender, nonce]))
```

Constructor arguments are baked into *that* transaction — they are not a `.env` on a server. After create, `eth_getCode(address)` is the runtime, not the constructor.

### 4. `public` is not privacy

`public` on a state variable is an API convenience. **All storage is readable** (`eth_getStorageAt`) if someone knows the slot. `private` only hides the *name* from other Solidity contracts. Chapter **11**. Do not store secrets.

### 5. The compiler in the browser is not automatically the compiler in CI

Remix downloads a JavaScript `solc`. Foundry and Hardhat pin a compiler in a config file. Shipping “what I clicked in Remix” and testing “what CI compiled” is how teams fail explorer verification. Write the version down now; chapter **02** makes it policy.

### 6. Accounts, in one picture

EOA: has a private key, empty code, sends txs. Contract: has code, no key; it only runs when *called*. Both have nonce, balance, storage root, code hash (chapter **01**). `msg.sender` for a wallet click is the EOA; `msg.sender` for a contract calling you is that contract.

---

## 3. Applications and use cases

| Lens | What “first steps” looks like |
|------|-------------------------------|
| **Application** | One write path, one read path — a tiny API |
| **Systems** | You felt gas, storage, and call vs transaction |
| **Security** | You refused unknown deploy/send snippets; you know state is public |
| **Operations** | Remix VM or a local node for learning; no funded mainnet wallet |
| **Software engineering** | Same source compiled in two tools; version written down |

Stay here for a lab counter or a greeting. Payroll, tokens, and wallets wait until you have tests and access control.

---

## 4. Staff-level review checklist

- Newcomers can explain **EOA vs contract**, **call vs transaction**, and **why gas exists** without slogans.
- First contract has **SPDX**, a **0.8.x pragma**, and a **view** read path separate from a write path.
- Learning deploys stay on **Remix VM** or a **local node**, not a funded mainnet wallet.
- Someone recorded **which solc** compiled the hello (Remix and/or Foundry).
- No seed phrases, private keys, or “approve this random token” steps appear in onboarding notes.

---

## References

- [Introduction to smart contracts](https://docs.soliditylang.org/en/v0.8.36/introduction-to-smart-contracts.html)
- [Solidity by example (official)](https://docs.soliditylang.org/en/v0.8.36/solidity-by-example.html)
- [Installing the Solidity compiler](https://docs.soliditylang.org/en/v0.8.36/installing-solidity.html)
- [Remix IDE documentation](https://remix-ide.readthedocs.io/)
- [Remix IDE](https://remix.ethereum.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Ethereum: intro to Ether](https://ethereum.org/developers/docs/intro-to-ether/)
- [Ethereum: transactions](https://ethereum.org/developers/docs/transactions/)
