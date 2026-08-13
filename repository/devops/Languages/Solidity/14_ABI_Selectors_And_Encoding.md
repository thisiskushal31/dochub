# ABI, selectors, and encoding

[← Back to Solidity](./README.md)

## What this chapter covers

The **Application Binary Interface**: how names become **4-byte selectors**, how arguments are **encoded**, and how wallets and other contracts call you after `solc` strips identifiers. Assumes **0.8.x** / ABI coder **v2** (default) / snapshot **0.8.36**.

After compile, the EVM does not know your function is called `transfer`. It knows a **4-byte number** and a blob of 32-byte words. The ABI is the shared dictionary between your Solidity names and that blob.

---

## 1. Concepts

### 1. After compile, names are gone

The EVM sees **calldata**: bytes. The ABI is the convention that says:

1. first 4 bytes = **function selector**,
2. the rest = **encoded arguments**.

The **ABI JSON** artifact (`Hello.abi`) is what ethers/viem/cast use to encode and decode. Without it (or equivalent), humans guess.

### 2. Selectors

```text
selector = first 4 bytes of keccak256("transfer(address,uint256)")
```

No spaces. `uint` in a signature is spelled **`uint256`**. Wrong spelling = wrong selector = `fallback` or revert.

```solidity
bytes4 sel = bytes4(keccak256("transfer(address,uint256)"));
// or: IERC20.transfer.selector
```

Prefer `.selector` on an interface function over hand-typed strings.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

interface IERC20Lite {
    function transfer(address to, uint256 amt) external returns (bool);
}

contract SelectorLab {
    function transferSelector() external pure returns (bytes4) {
        return IERC20Lite.transfer.selector;
        // same idea as bytes4(keccak256("transfer(address,uint256)"))
    }

    function makeCalldata(address to, uint256 amt) external pure returns (bytes memory) {
        // Typed: if you pass a bool by mistake, this will not compile.
        return abi.encodeCall(IERC20Lite.transfer, (to, amt));
    }
}
```

**What just happened**

- `transferSelector()` is four bytes. That is what wallets put at the front of calldata.
- `makeCalldata` builds the full payload: selector + encoded `to` + encoded `amt`.
- You can print it in Foundry with `cast calldata "transfer(address,uint256)" 0x… 1ether` and compare.

### 3. `abi.encode` vs `encodePacked` vs `encodeWithSelector`

```solidity
bytes memory a = abi.encode(x, y);           // 32-byte slots, unambiguous
bytes memory b = abi.encodePacked(x, y);     // tight pack — collisions possible
bytes memory c = abi.encodeWithSelector(sel, x, y);
bytes memory d = abi.encodeCall(IERC20.transfer, (to, amt)); // typed, preferred
```

| Helper | Use |
|--------|-----|
| `abi.encode` | Hashing structured data, generic blobs |
| `abi.encodeCall` | **Best** for building calls — types checked |
| `abi.encodeWithSelector` | When you only have a `bytes4` |
| `abi.encodePacked` | Tight packing; **do not** use as a general hash preimage for untrusted fields |
| `abi.decode` | Reverse of `encode` |

**Packed-hash collisions:** `encodePacked(string, string)` of `"ab","c"` vs `"a","bc"` can collide. If you hash packed dynamic types, you invited that class of bug. Use `abi.encode` or a length prefix.

### 4. Return data

Functions return ABI-encoded values. Low-level `call` gives you `bytes memory data` you must `abi.decode`. High-level `token.transfer(...)` decodes for you and reverts on failure (for Solidity calls that bubble).

### 5. Events and errors have ABIs too

Event topic0 is `keccak256("Transfer(address,address,uint256)")` (indexed flags do not change the signature string). Error selectors are 4 bytes like functions. Clients need the ABI to decode logs and reverts.

### 6. What wallets actually send

A MetaMask “write” is: your dapp builds calldata from the ABI + args, the user signs a tx to the contract address with that data (and maybe `value`). If the ABI is wrong, they sign the wrong thing. **Treat ABI JSON as a release artifact.**

---

## 2. Advanced concepts

### 1. How a word is laid out (head / tail)

ABI coder v2 (0.8 default) encodes arguments as a **head** of 32-byte words, with **dynamic** values pointed at by offsets into a **tail**.

**Static types** (head only): `uint*`, `int*`, `address`, `bool`, `bytesN` (N≤32), fixed arrays of static types, tuples of static types.

**Dynamic types** (offset in the head, payload in the tail): `bytes`, `string`, `T[]`, tuples/arrays that contain a dynamic type.

Worked `transfer(address,uint256)` — both args static, so no tail:

```text
calldata =
  a9059cbb                                                          // selector
  000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  // to, left-padded
  0000000000000000000000000000000000000000000000000de0b6b3a7640000  // 1e18
```

Worked `foo(string)` with `"hi"`:

```text
selector
000…020          // offset to tail = 32 (0x20) from start of args
000…002          // length = 2
6869000…         // 'h' 'i' right-padded to 32 bytes
```

That is why `abi.decode` of the wrong type yields garbage or reverts, and why a **return bomb** (chapter **15**) is “a huge dynamic `bytes` you try to copy.”

### 2. Coder v1 vs v2

0.8 defaults to **v2** (structs, nested arrays). Pre-0.8 needed `pragma abicoder v2`. v1 cannot express some types and encodes some edge cases differently. Do not mix assumptions when talking to very old contracts. `via-IR` still emits v2-shaped calldata for the public ABI.

### 3. `fallback` and `receive` have no selector

| Calldata | Dispatch |
|----------|----------|
| empty **and** `msg.value > 0` (typically) | `receive()` if it exists |
| empty, no `receive` | `fallback()` if payable |
| 4+ bytes, no matching function | `fallback(bytes calldata)` |

Router contracts that `switch (msg.sig)` are reimplementing the dispatcher — review like a compiler. `msg.sig` is `bytes4(msg.data)` (zero if `msg.data.length < 4`).

### 4. Function overloads

`foo(uint256)` and `foo(address)` are different selectors (`keccak` of different strings). UIs that show one name twice confuse users. Distinct external names are kinder.

### 5. `encodePacked` collisions (the actual bug class)

```solidity
keccak256(abi.encodePacked("ab", "c")); // same bytes as
keccak256(abi.encodePacked("a", "bc"));
```

Adjacent **dynamic** packed values have no length delimiter. Adjacent **static** values (`address`, `uint256`) are unambiguous. If you hash untrusted strings/bytes together, use `abi.encode` (32-byte slots + lengths) or EIP-712.

### 6. `encodeCall` vs raw `call`

```solidity
(bool ok, bytes memory ret) = addr.call(abi.encodeCall(IFoo.bar, (1, true)));
```

You still must handle `ok` and decode `ret`. High-level `IFoo(addr).bar(1, true)` does that and bubbles reverts — prefer it unless you need the low-level control (chapter **15**).

### 7. Metadata is not the ABI

Compiler **metadata** (CBOR tail on bytecode, chapter **16**) helps explorers match source. The ABI is the call convention. Verification needs both stories.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Interface + `encodeCall`; publish ABI with the release |
| **Systems** | Know calldata layout when debugging a failed tx |
| **Security** | No packed hashes of untrusted dynamic types; selector typos caught by interfaces |
| **Operations** | `cast calldata` / `cast 4byte` in the runbook |
| **Software engineering** | ABI committed or generated in CI, not edited by hand |

```bash
cast sig "transfer(address,uint256)"
cast calldata "transfer(address,uint256)" 0x... 1ether
```

---

## 4. Staff-level review checklist

- [ ] External calls use **interfaces** or `encodeCall`, not stringly selectors, unless justified.
- [ ] Hashes of multi-field data use `abi.encode` (or EIP-712), not naive `encodePacked` of strings.
- [ ] ABI JSON is an artifact of the **same** `solc` pin as bytecode.
- [ ] Overloads on the public ABI are rare and named clearly.
- [ ] Error and event signatures are covered by the same ABI discipline.

---

## References

- [Contract ABI specification](https://docs.soliditylang.org/en/v0.8.36/abi-spec.html)
- [Cheatsheet (`abi` encode helpers)](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [Using the compiler](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [Foundry Book — cast](https://book.getfoundry.sh/cast/)
- [ethers.js ABI](https://docs.ethers.org/)
- [viem ABI](https://viem.sh/)
