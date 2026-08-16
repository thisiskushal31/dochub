# Scoping, declarations, and style

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper **declares** variables, how **scopes** work (module, function, block), how **public** and **immutable** storage behave, when **storage layout overrides** matter, and **style habits** that keep `.vy` readable for reviewers. Pin: **Vyper 0.4.x** (**0.4.3**).

Assumes chapters **04** (structure) and **05** (types). Modules that import state: chapter **11**. Layout dumps and compile flags: chapter **12**.

---

## 1. Concepts

### 1. First reference declares the type

The first time a name is introduced, its type must be known:

```vyper
data: int128
```

Initialization rules depend on **where** the name lives:

| Location | Initial value |
|----------|----------------|
| **Storage** (module scope) | Must **not** be assigned an initial value at declaration |
| **Memory** (inside a function) | Must be assigned an initial value |
| **Calldata** (function inputs) | May have a default value |

Staff smell: treating Vyper like Python where “first assignment invents a name” without a type—or copying Solidity’s `uint256 x;` habits without learning memory init rules.

### 2. Public storage and getters

```vyper
data: public(int128)
```

The compiler generates a **getter** with the same name. For a plain value, the getter takes no arguments and returns the type. For **public arrays**, the getter returns **one element** and takes an index—returning whole arrays would be gas-hostile by default.

Review habit: public does not mean “safe to mutate from outside.” It means “readable via a generated external view.” Writes still go through your functions (and ACL).

### 3. Immutables

```vyper
DATA: immutable(uint256)

@deploy
def __init__(_data: uint256):
    DATA = _data
```

Immutables are set **once in the constructor** and never again. They behave like constants for readers, but the value is chosen at deploy. Creation code appends immutable values into the returned runtime bytecode—important when you compare compiler output to on-chain runtime code (verify story in chapter **12**).

### 4. Tuple assignment (not tuple types)

You cannot declare a tuple type as a first-class storage type, but you can unpack multiple returns:

```vyper
@internal
def foo() -> (int128, int128):
    return 2, 3

@external
def bar():
    a: int128 = 0
    b: int128 = 0
    a, b = self.foo()
```

### 5. Scoping rules (C99-shaped)

Variables are visible from just after their declaration until the end of the **smallest block** that contains them.

#### Module scope

Items declared outside functions (storage, constants, events, structs, functions, …) are visible even **before** their textual declaration in the file—you can use module-scoped names “early.”

Access storage and module functions from function bodies via **`self`** (and via module aliases when importing—chapter **11**):

```vyper
a: int128

@internal
def _answer() -> int128:
    return 42

@external
def foo() -> int128:
    return self.a + self._answer()
```

#### Name shadowing

Memory or calldata names **must not** shadow a **constant** or **immutable**. Those collisions fail to compile—by design, so readers are not misled.

#### Function scope

Arguments and locals live in that function only. The same name `a` in two different functions is fine. Redeclaring an argument as a local inside the same function is not. Using a name never declared in that function is not.

#### Block scopes (`if` / `for`)

`if` branches and `for` bodies introduce block scopes. A name declared only inside a branch is not visible outside. Loop targets exist for the loop body; after the loop ends you may declare a new name that reuses the identifier.

```vyper
@external
def foo(flag: bool) -> int128:
    if flag:
        x: int128 = 3
    else:
        x: bool = False   # different branch, different block scope
    # x is not available here
```

### 6. Style for contract authors (readable `.vy`)

Official style guidance for the **Vyper compiler codebase** is PEP 8–oriented (Python). For **contracts**, staff still win by borrowing the same clarity rules:

| Habit | Practice |
|-------|----------|
| **Names** | `snake_case` for functions and variables; `CapWords` for structs/events/interfaces; `UPPER_SNAKE` for constants/immutables |
| **Booleans** | Prefer `is_` / clear positive names; avoid double-negative flags (`is_not_paused`) |
| **Leading underscore** | `_helper` for internal helpers that should not look like product API |
| **One job per function** | Auth check, then effects—visible without modifiers |
| **Imports** | Explicit module aliases; avoid mystery one-letter imports in money paths |
| **Comments** | Explain *why* and units; do not restate the type annotation |
| **NatSpec** | User-facing `@notice` / `@dev` honesty (chapter **10**) |

Consistency across a repo beats clever micro-style. If a protocol already has a house style, match it.

---

## 2. Advanced concepts

### 1. Storage layout defaults and overrides

By default, the compiler allocates storage variables in declaration order starting at **slot 0**. Upgrades and proxy patterns sometimes need **custom slots** so old and new contracts agree on where a variable lives.

Compile with a layout file, for example:

```bash
vyper new_contract.vy --storage-layout-file new_contract_storage.json
```

A layout entry names the variable, its type, `slot`, and `n_slots`. Inserting a field without a layout plan silently shifts later slots—classic upgrade footgun. Treat layout JSON as a **release artifact** beside the compiler pin (chapter **12**).

### 2. Public getters vs hand-written views

Generated getters are convenient and cheap to audit for simple values. For derived data, pagination, or ACL-gated reads, write an explicit `@view` function. Do not assume “everything public” is a product API—clients will call whatever the ABI exposes.

### 3. Immutables vs constants vs storage

| Kind | Set when | Changes later? |
|------|----------|----------------|
| `constant` | Compile time | No |
| `immutable` | Constructor | No |
| storage | Anytime your code writes | Yes |

Wrong choice shows up as unnecessary SSTOREs (gas) or as “we thought this was fixed at deploy.”

### 4. Module scope and imported state

With 0.4 modules, “module scope” includes imported modules’ state **only** after `initializes` / `uses` wiring (chapter **11**). Access patterns become `ownable.owner` rather than only `self.owner`. Reviewers must know which module owns which slot.

### 5. Shadowing and searchability

The ban on shadowing constants/immutables is an auditability feature: searching for `OWNER_ROLE` should not hit a local that means something else. Extend the spirit: do not reuse critical domain names for temporaries.

### 6. Style vs security

Style does not replace asserts. A beautifully named `is_authorized` that is never called is still a finding. Pair naming discipline with the control-flow and security checklists (**07**, **14**).

### 7. Brownfield dialects

0.3.x trees may differ in declaration and decorator habits. When porting, re-check memory init rules, public getter shapes, and module introduction—do not assume a mechanical rename.

---

## 3. Applications and use cases

| Angle | Habit |
|-------|--------|
| **Application** | Domain names and immutables make deploy-time config obvious in review. |
| **Systems** | Storage layout files and public ABI getters are integration contracts with indexers and UIs. |
| **Security** | Shadowing bans and explicit scopes reduce “which `owner`?” confusion; layout mistakes are upgrade bugs. |
| **Ops** | Verify runtime matches expected immutables embedding; keep layout JSON with the pin. |
| **SE** | PR review asks: new storage slotted intentionally? public surface intentional? names match mutability? |

**Smell:** a constructor that writes “config” into ordinary storage that is never meant to change—should have been `immutable` (or constant).

---

## 4. Staff-level review checklist

- Storage vs memory vs calldata init rules respected.
- `public` variables understood as generated getters (arrays: element access).
- Immutables assigned only in `@deploy` `__init__` and never reassigned.
- No shadowing of constants/immutables by locals or args.
- Block-scoped names not used outside their block.
- Storage layout plan exists when upgrades/proxies require stable slots.
- Naming matches house style: snake_case, clear booleans, `_` for internals.
- Module-owned state accessed through the correct module alias after init wiring.
- ABI surface from `public` + `exports` matches the intended product API.
- Port from 0.3.x re-validated declarations—not assumed identical.

---

## References

- [Scoping and declarations (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/scoping-and-declarations.html)
- [Style guide (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/style-guide.html)
- [Structure of a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/structure-of-a-contract.html)
- [Compiling a contract — storage layout (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
