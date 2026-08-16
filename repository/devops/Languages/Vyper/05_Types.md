# Types

[← Back to Vyper](./README.md)

## What this chapter covers

The type vocabulary for honest Vyper on **0.4.x** (**0.4.3**): value types, reference types, flags, initial values, conversions, and decimal literacy. Goal: pick types that match the domain and the ABI—not “whatever compiles.”

Solidity’s value/reference story is a useful parallel in [Solidity](../Solidity/README.md); names and defaults differ—do not copy-paste assumptions.

---

## 1. Concepts

### 1. Why types are a security control

Vyper is **statically typed**. Each variable’s type is known at compile time. On the EVM, values are words and calldata; types tell the compiler how to **check, encode, and store**. Wrong width or signedness is how balances and permissions silently skew.

Vyper leans toward **checked** arithmetic and explicitness. Still: the type system cannot know your economic invariant. It can only refuse some nonsense.

### 2. Value types vs reference types

| Family | Behavior | Examples |
|--------|----------|----------|
| **Value types** | Copied on assignment and as arguments | `bool`, `intN`, `uintN`, `decimal`, `address`, `bytesM`, flags |
| **Reference types** | More structure; assignment/alias rules matter | Fixed lists, DynArrays, structs, `HashMap` |

Practical rule: **know whether an assignment copies or aliases** before mutating in a loop.

### 3. Booleans

**Keyword:** `bool`. Values: `True` / `False`. Operators: `not`, `and`, `or`, `==`, `!=`. Short-circuiting matches Python for `and` / `or`.

Unlike Python, `if` conditions must be actual booleans—`if 1:` does not compile (chapter **07**).

### 4. Signed and unsigned integers

| Form | Rule |
|------|------|
| `intN` | Signed; `N` multiple of 8, **8…256** |
| `uintN` | Unsigned; same width rule |

Habits:

| Habit | Why |
|-------|-----|
| Prefer **unsigned** for balances/amounts unless negative is meaningful | Matches most token math |
| Name the unit (`amount_wei`) | Prevents ether/wei confusion |
| Expect **checked** overflow/underflow by default | Do not assume silent wrap; `unsafe_*` is intentional escape (chapter **09**) |
| Integer literals have **no** decimal point | `2.0` is not an integer literal |
| Default literal typing leans `int256` | Cast explicitly when assigning narrow unsigned widths |

**Division note:** integer `//` toward **zero** for negatives (differs from Python’s floor division). Keep the identity `(x // y) * y + (x % y) == x` in mind when porting Python math.

**Shifts:** available on 256-bit widths (`int256` / `uint256`). Compile-time rejects some out-of-bounds shifts that runtime would wrap—write clear shift amounts.

### 5. Decimals (fixed point)

**Keyword:** `decimal` — decimal fixed point (not binary FP; see chapter **01** non-features).

| Fact | Staff habit |
|------|-------------|
| As of **0.4.0**, decimals need `--enable-decimals` on the compiler CLI | Record the flag in CI if you use them |
| Literals must include a decimal point | `1.0` not `1` |
| ABI type is `int168` | Clients must know the encoding |
| Division uses `/` (decimal), not only `//` | Rounding policy is a product decision |

| Approach | When |
|----------|------|
| **Integer base units** (wei, token smallest unit) | Settlements, balances, allowances—industry default |
| **Decimals** | Domain truly wants fixed-point and the team owns rounding |

Mixing decimals and integers without an explicit conversion policy is a defect.

### 6. Addresses

**Keyword:** `address` (20 bytes). Literals: `0x…` **checksummed**.

Useful members (query the account):

| Member | Meaning |
|--------|---------|
| `balance` | Wei balance |
| `codehash` / `codesize` / `code` | Code presence and bytes (`code` needs `slice`) |
| `is_contract` | Whether code is deployed |

Never assume code at an address is permanent—creation/`CREATE2` and destructive ops can change what lives there over time. Treat `is_contract` as a snapshot, not a forever credential.

### 7. Fixed bytes, `Bytes[N]`, and `String[N]`

| Type | Role |
|------|------|
| `bytesM` (e.g. `bytes32`, `bytes4`) | Hashes, selectors, tight ABI |
| `Bytes[maxLen]` | Dynamic bytes with a **max** in the type |
| `String[maxLen]` | Text with a **max** in the type |

`Bytes` / `String` maxima are part of gas and griefing review: who pays for large inputs? Prefer the smallest honest bound.

### 8. Flags

```vyper
flag Roles:
    ADMIN
    USER

role: Roles = Roles.ADMIN
```

Flags are custom enums-as-bit-members (up to 256 members). Combine with `|` / `&` / `^` / `~`; test membership with `in` / `not in`. Use for roles and permission sets that should stay searchable—not as a dumping ground for unrelated booleans.

### 9. Fixed-size lists and dynamic arrays

```vyper
fixed: uint256[3]
growing: DynArray[uint256, 10]   # max length 10
```

| Kind | Bound story |
|------|-------------|
| `T[N]` | Length fixed at compile time |
| `DynArray[T, N]` | Length varies up to **N** |

Loop chapter (**07**) wants these bounds. Unbounded growth of storage lists is an ops smell even when the type allows a large `N`.

Restrictions you will hit: no iterating multi-dimensional arrays as nested “base” iteration in the simple `for` form; do not mutate an array while iterating it.

### 10. Structs

```vyper
struct Position:
    owner: address
    amount: uint256
    open: bool
```

Group fields that change together. Avoid kitchen-sink structs that force unnecessary storage writes on every touch.

### 11. `HashMap` (mappings)

```vyper
balances: HashMap[address, uint256]
```

Properties reviewers rely on:

- default empty values for missing keys,
- **no** cheap enumeration of all keys on-chain,
- values may be structs for richer records.

If product needs “list all users,” store an explicit index.

### 12. Initial values

Empty / zero defaults (`0`, `False`, `empty(...)`, zero address) are normal. Authorization bugs appear when “unset” is treated as “open.” Initialization and `assert` patterns must treat zero as a **domain** question.

---

## 2. Advanced concepts

### 1. ABI types vs storage types

Declarations shape:

- **ABI** encoding for external calls,
- **storage** layout,
- **event** payloads.

Changing a type is an **interface break** for clients even if “the math still fits.” Version the ABI intentionally (chapter **12**).

### 2. Conversions are product decisions

Use explicit `convert(...)` (and documented helpers) for width changes, signedness changes, and decimal↔integer bridges. Truncation and rounding deserve named helpers and tests. Silent mental casts are review findings.

### 3. Units are not types

The chain settles in wei-sized integers. `uint256` does not know “ether.” Naming and constants (chapter **06**) carry unit discipline.

### 4. Flags vs booleans vs roles mapping

| Need | Prefer |
|------|--------|
| Single bit | `bool` |
| Small fixed set of roles with combinations | `flag` |
| Per-address roles in storage | `HashMap[address, Roles]` or similar |

### 5. Decimal enablement is a toolchain flag

Because decimals may require `--enable-decimals`, treat that flag like part of the **compiler pin**. Two engineers compiling the same file with different flags is a “works on my machine” incident.

### 6. Generics / advanced typing doors

Prefer boring types auditors have seen when value at risk is high. Adopt newer typing features when they clarify interfaces—not to impress.

---

## 3. Applications and use cases

| Angle | Type discipline |
|-------|-----------------|
| **Application** | Domain structs and precise amounts make APIs self-describing. |
| **Systems** | ABI types are the contract with indexers, UIs, and sibling contracts. |
| **Security** | Width, signedness, decimal scale, maxima on `Bytes`/`String`, and zero-defaults are finding factories when ignored. |
| **Ops** | Monitoring parsers depend on stable event/ABI types—coordinate changes. |
| **SE** | Code review checklists include “unit + type + conversion + bound” as one item. |

**Whole-engineering picture:** types are how intent becomes **machine-checkable agreement** across app, chain, and clients.

---

## 4. Staff-level review checklist

- Amounts use integer base units unless decimals are justified with rounding rules and `--enable-decimals` recorded.
- `intN` / `uintN` widths match domain; conversions are explicit.
- `HashMap` usage does not assume key enumeration.
- `DynArray` / `Bytes` / `String` maxima are product-honest, not “max int.”
- Structs match change-together boundaries.
- Flags used for real sets/roles—not obfuscation.
- Address member checks are not treated as permanent security properties.
- ABI-breaking type changes are versioned for consumers.
- Zero/default values are interpreted deliberately in auth and config paths.
- Team can explain decimal vs wei choice in one sentence for each money field.

---

## References

- [Types (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/types.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Ethereum ABI](https://ethereum.org/en/developers/docs/smart-contracts/abi/)
- [Solidity track](../Solidity/README.md)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
