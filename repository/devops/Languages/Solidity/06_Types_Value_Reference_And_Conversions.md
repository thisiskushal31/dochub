# Types: value, reference, and conversions

[← Back to Solidity](./README.md)

## What this chapter covers

Solidity’s **type system**: value types vs reference types, default zeros, conversions, and the casts that **quietly change meaning**. Assumes **0.8.x** / snapshot **0.8.36**. Collections in depth are chapter **12**; locations are chapter **11**.

There is no `null` and no `undefined`. An unset address is not “missing” — it is the **zero address**, a real value, and a famous source of “we forgot to set the owner.”

---

## 1. Concepts

### 1. Everything is typed; zeros are real values

Solidity is **statically typed**. Uninitialized values are **zero-state**: `0`, `false`, `address(0)`, empty `bytes`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

contract Zeros {
    uint256 public n;       // 0
    bool public flag;       // false
    address public admin;   // 0x0000…0000
    string public label;    // ""

    function isAdminUnset() external view returns (bool) {
        // This is the check you actually want after deploy.
        return admin == address(0);
    }
}
```

**What just happened:** you deployed a contract that *looks* like it has an admin field. It does not have an admin. `admin` is the zero account until a function sets it. If a `onlyAdmin` modifier compares `msg.sender == admin` before that, **nobody** matches — or, worse, some designs treat `address(0)` as a special burn address. Always decide what zero means.

### 2. Value types (copied)

| Family | Examples | Notes |
|--------|----------|-------|
| Boolean | `bool` | `true` / `false` |
| Integer | `uint8`…`uint256`, `int8`…`int256` | Default `uint` / `int` = 256-bit |
| Address | `address`, `address payable` | 20 bytes; payable can receive via `.transfer`/`.send` (prefer `call` — ch **15**) |
| Fixed bytes | `bytes1`…`bytes32` | `byte` is gone; use `bytes1` |
| Enums | `enum Status { Off, On }` | Underlying uint; see ch **12** |
| Contract types | `Hello` | Convertible to `address` |
| Function types | `function (uint) external returns (uint)` | Advanced |
| User-defined value types | `type Qty is uint256` | 0.8.8+; no implicit mix-up with raw uint |

Assignment **copies**. Two `uint256` variables do not alias.

```solidity
function copies() external pure returns (uint256, uint256) {
    uint256 a = 1;
    uint256 b = a; // copy the number
    b = 2;         // a is still 1
    return (a, b); // 1, 2
}
```

### 3. Reference types (need a location)

| Family | Examples |
|--------|----------|
| Arrays | `uint256[]`, `uint256[3]`, `bytes`, `string` |
| Structs | `struct Foo { uint256 x; }` |
| Mappings | `mapping(address => uint256)` |

These require **`storage`**, **`memory`**, or **`calldata`** (mappings only in storage). Two references can alias the same data—chapter **11**.

`string` and `bytes` are dynamic byte arrays with different APIs, not UTF-8-smart string objects.

### 4. Address vs address payable vs contract type

```solidity
address a = address(token);          // lose the typed API
IERC20 t = IERC20(a);                // regain an interface view
address payable p = payable(a);      // needed for some value-send APIs
```

Prefer keeping the **contract/interface type** until you truly need a raw address. It is documentation the compiler enforces.

### 5. Conversions: implicit vs explicit

**Implicit** (safe widening, roughly): `uint8` → `uint256`, `bytes2` → `bytes4` (right-padded).

**Explicit** (you take responsibility):

```solidity
uint8 small = uint8(large256); // truncates high bits — review this
int256 s = int256(u);          // reinterpret; huge uint becomes negative
address a = address(uint160(x));
```

0.8 removed many foot-gun implicit conversions. If you write a cast, write *why*.

Padding direction is part of the type, not a vibe:

```text
uint8(0x12)  → uint256     left-pad  → 0x0000…0012
bytes2(0x12) → bytes4      right-pad → 0x12000000
bytes4 → uint32            reinterpret the 4 bytes as an integer
uint256 → uint8            truncate the *high* bits (keep the low byte)
```

`address(uint160(uint256(b32)))` is how people pull an address out of a `bytes32` topic — and how they accidentally keep the wrong end. Draw the 32 bytes when you cast.

### 6. `bytes` vs `bytes32` vs `string`

| Type | Use |
|------|-----|
| `bytes32` | Hashes, fixed keys, cheap |
| `bytes` | Dynamic binary |
| `string` | Dynamic text (no real Unicode ops in-language) |

Do not store long strings in storage because a tutorial used `string public name`. Hashes or off-chain metadata are often the honest design.

### 7. User-defined value types

```solidity
type Wad is uint256; // 18-decimal fixed point, not “just a uint”

function add(Wad a, Wad b) internal pure returns (Wad) {
    return Wad.wrap(Wad.unwrap(a) + Wad.unwrap(b));
}
```

`wrap` / `unwrap` make accidental `Wad + rawUint` fail to compile. Use them for IDs and decimal conventions.

### 8. Fixed-point is a convention, not a type

Solidity has no `float`. “18 decimals” means: store `amount * 10**18` as `uint256` (or a `Wad` UDT). Multiplication of two wads needs a scale divide (`mulWad` / `mulDiv`) or you overflow / mis-scale. Division truncates — specify rounding. Libraries (OZ `Math.mulDiv`, solmate-style `FixedPointMathLib`) exist so you do not invent 512-bit intermediates wrong. Document the scale next to every money type.

---

## 2. Advanced concepts

### 1. Integer sizes, packing, and cleanup

`uint8` next to `uint8` can **pack** into one 32-byte slot (lower-order aligned — chapter **11**). That saves `SSTORE`s and creates upgrade/layout hazards. Do not pick `uint8` “to be small” unless you intend packing.

The compiler normally **cleans** unused high bits when a narrow type is used as a value (so a `bool` that somehow had `0x02` in the byte becomes `true`/`false` as specified). Inline assembly can skip cleanup and then a `bool` comparison or an external ABI encode will surprise you (chapter **21**).

### 2. `uint256` vs `uint96` in money

Narrow types **overflow sooner** even with checked math. `uint96` max is about `7.9e28` — fine for many token amounts at 18 decimals, fatal if you mix with raw wei of a high-supply token. Document the maximum representable amount next to the type.

### 3. Function types (the type system’s callback)

```solidity
// Internal function type: two words (code pointer + context for libraries).
// External function type: address + selector (24 bytes of ABI: address then bytes4, padded).
function (uint256) internal pure returns (uint256) fnInternal;
function (uint256) external returns (uint256) fnExternal;

function setExt(function (uint256) external returns (uint256) f) external {
    fnExternal = f; // stores target address + selector
}

function runExt(uint256 x) external returns (uint256) {
    return fnExternal(x); // a real CALL to whatever you stored
}
```

Storing a user-supplied `function` value is storing “call this address with this selector.” Review it like any other arbitrary call. Prefer an interface + explicit `IFoo(addr).bar(x)` until you have a reason.

### 4. Fixed bytes padding

`bytes2` → `bytes4` **right-pads** with zeros (`0x1234` → `0x12340000`). Integer widening **left-pads**. Mixing `bytes` casts with `uint` casts is how people shift data by accident. Write the direction down.

### 5. ABI-level types vs Solidity types

The ABI sees `uint256`, `address`, `bytes`, tuples — not your `Wad` name. User-defined value types encode as their underlying type. Off-chain code will not know your wrap convention unless you document it (NatSpec + a comment in the ABI repo).

Enums encode as `uint8` unless they need more (ABI). Out-of-range `enum` conversion in 0.8 **panics** (`0x21`).

### 6. `address(this)` and `address(0)`

`address(this)` is the account whose **code is running** — except under `delegatecall`, where code is theirs and storage/`address(this)` are **yours** (chapter **15**). `address(0)` is the zero account: default, sometimes a burn destination, and the classic unset-owner bug.

### 7. Contract types are not subclasses of `address`

`Hello h = Hello(addr)` does not check that `addr` has Hello’s code. It is a compile-time cast. The first call will do whatever lives there. ERC-165 / an allowlist is how you raise that confidence; the type system will not.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Domain types (`Wad`, `UserId`) at boundaries |
| **Systems** | `uint256` default; narrower types only with a packing plan |
| **Security** | Review every downcast; never treat `address` as authenticated identity by itself |
| **Operations** | ABI JSON is what clients generate from—keep it in artifacts |
| **Software engineering** | No silent `uint`/`int` mixes; name units in NatSpec |

---

## 4. Staff-level review checklist

- [ ] No unexplained downcasts (`uint256` → `uint8` / `uint128`).
- [ ] Money and IDs are not mixed as raw `uint256` if the team has wrapper types.
- [ ] `string` in storage is justified, not copied from a tutorial.
- [ ] `address(0)` checked where an address is configuration.
- [ ] Interface types used at call sites instead of everything being `address`.

---

## References

- [Types](https://docs.soliditylang.org/en/v0.8.36/types.html)
- [Cheatsheet](https://docs.soliditylang.org/en/v0.8.36/cheatsheet.html)
- [ABI specification](https://docs.soliditylang.org/en/v0.8.36/abi-spec.html)
- [0.8 breaking changes (conversions, `byte`)](https://docs.soliditylang.org/en/v0.8.36/080-breaking-changes.html)
