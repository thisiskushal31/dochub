# Structure of a contract

[← Back to Vyper](./README.md)

## What this chapter covers

How a Vyper contract is laid out on the page: pragma, declarations, state variables, functions, and the visibility story readers use in review. After this you should open a `.vy` file and know where state lives, what is ABI-visible, and what is internal glue.

Pin: **Vyper 0.4.x** (**0.4.3**). For Solidity’s parallel “contract anatomy,” see [Solidity](../Solidity/README.md)—similar EVM object, different layout rules (no inheritance trees here). Modules and interfaces are covered in chapter **[11](./11_Interfaces_And_Modules.md)**; this chapter is the **single-file reading order** and the habits that survive multi-file composition.

---

## 1. Concepts

### 1. Top-to-bottom reading order

A typical small contract reads like this:

1. **Version pragma** (and optional EVM / optimize pragmas)
2. **Interfaces / imports / modules** (when used)
3. **Events / structs / flags** (as needed)
4. **Constants / immutables / state variables**
5. **`__init__` / `@deploy`** (constructor)
6. **External functions** (ABI)
7. **Internal functions** (helpers)

Exact ordering conventions vary by team; **consistency** beats art. Reviewers should not hunt for state between unrelated helpers without a house style.

### 2. Minimal shape

```vyper
#pragma version ^0.4.0

owner: public(address)
count: uint256

event Bumped:
    by: indexed(address)
    new_count: uint256

@deploy
def __init__():
    self.owner = msg.sender

@external
def bump():
    assert msg.sender == self.owner, "not owner"
    self.count += 1
    log Bumped(msg.sender, self.count)

@internal
def _ok() -> bool:
    return self.count < 1000
```

Hold: **state at the top**, **entry points obvious**, **helpers marked `@internal`**, **guards inline** (no modifiers).

### 3. State variables

State variables are **storage**. They persist across transactions at the contract address.

| Declaration habit | Meaning |
|-------------------|---------|
| `x: uint256` | Storage; no automatic external getter |
| `x: public(uint256)` | Storage + compiler-generated external getter |
| Typed precisely | Width and signedness are part of the ABI/storage story |

`public(...)` is convenience and documentation: “this value is meant to be read.” It is not access control for writers—you still gate `set` functions yourself.

Constants and immutables are not “just more state”—they freeze policy (chapter **[06](./06_Environment_Constants_And_Immutables.md)**). Put them near other declarations so readers can inventory frozen vs mutable config in one pass.

### 4. Visibility of functions (preview)

| Decorator | Who calls it |
|-----------|----------------|
| `@external` | Outside world (EOAs, other contracts) via ABI |
| `@internal` | This contract’s code (helpers) |

Chapter **[08](./08_Functions_Visibility_And_Mutability.md)** deepens mutability (`@view`, `@pure`, `@payable`). Here: **structure first**—don’t mix “who can call” with “does it write.”

### 5. Constructor / deploy hook

Initialization runs **once** at deployment (`@deploy` / `__init__` in modern Vyper). Typical jobs: set owner, immutable-friendly config, initial parameters. Anything that must never change silently belongs in a deliberate pattern (immutables in chapter **06**, or explicit governance later)—not “we’ll fix storage in a random setter.”

Module `initializes` graphs in **0.4+** extend this story: deploy-time wiring can span files. Structure reviews still ask: **what is set once, and who can change the rest?**

### 6. What is not in the file (on purpose)

Unlike many Solidity codebases, you will **not** find:

- modifier blocks wrapping functions,
- `contract Child is Parent` inheritance,
- inline assembly sections,
- overloaded function names.

Reuse shows up as **interfaces**, **modules** (0.4+), and clear internal functions. Structure stays flatter; that is intentional (chapter **[01](./01_What_Vyper_Is_And_Is_Not.md)**).

---

## 2. Advanced concepts

### 1. Modules and multi-file shape (0.4+)

Larger systems split logic across **modules** and import interfaces. Staff review questions:

- where does authoritative state live,
- which module’s external functions are the product API,
- are there duplicate “owner” concepts across files,
- what does `exports` actually expose?

Composition without a single inheritance graph still needs an **ownership map**. Draw it once; attach it to the PR.

### 2. Events as part of structure

Events are not decoration. They are the **ops and indexer surface** (chapter **[10](./10_Events_And_NatSpec.md)**). Place event definitions where readers expect them (near top or near the domain they describe) and emit them beside the state change they explain. Structure reviews ask: “can support reconstruct what happened from logs?”

### 3. NatSpec / comments

Doc comments help ABI consumers and auditors. Prefer short purpose notes on external functions over essays. Structure rule: **documentation follows the external API**, not every internal line.

### 4. Storage layout awareness

You do not need the full slot map on day one. You do need:

- packing/order can matter for upgrades and for mental gas models,
- changing declaration order in an upgradeable system is a **migration** event,
- `public` getters reflect current types—ABI breaks if types change,
- module `initializes` order is part of layout in 0.4+ systems.

Treat layout changes like schema migrations in databases. Export layout JSON when upgrade or audit work requires it (chapter **12**).

### 5. Default / fallback-style entry points

Some contracts expose receive/fallback-style behavior for plain ETH transfers or unmatched calls. Literacy belongs with functions (chapter **08**). Structurally: if present, they must be **obvious**—hidden money paths are review findings.

### 6. Naming as architecture

`_internal_helper` vs `doThing` vs `set_owner` conventions prevent accidental ABI sprawl. SE wins: one glossary for “admin,” “user,” and “keeper” entry points.

Prefer product language on `@external` names: the ABI is the public API, not a dump of internal verbs.

### 7. File size and reviewability

Vyper’s bet is auditability. A multi-thousand-line file with dense `raw_call` is not “safe by brand.” Split modules when domains diverge (math vs auth vs adapters). Structure is a **security control** when it keeps control flow narratable.

### 8. Import search paths

Interfaces and modules depend on compiler search paths (`-p`, project layout). Structure on disk should match what CI compiles—no “works only if you stand in this directory” folklore. Hermetic inputs belong in chapter **12**; house-style paths belong here.

### 9. Reading a stranger’s contract (first pass)

Staff first pass, in order:

1. Pragma / EVM notes,
2. State + immutables inventory,
3. External function list (the real API),
4. Auth asserts on writers,
5. Events on money/admin paths,
6. Any `raw_call` / `send` / create helpers,
7. Module/init graph if multi-file.

That pass answers “what is this?” before “is the math right?”

### 10. Anti-patterns that look like structure

- Giant “utils” externals that are really product API without NatSpec,
- State variables scattered between helpers so nobody can inventory storage,
- Comments that describe a modifier stack that does not exist,
- Duplicate owner/pause concepts across modules with different names.

Fix structure before optimizing gas.

---

## 3. Applications and use cases

| Angle | Structure habit |
|-------|-----------------|
| **Application** | External functions *are* the product API—design them like a public interface. |
| **Systems** | State variables define the on-chain schema other systems index and cache. |
| **Security** | Flat layout + explicit asserts beat hidden modifier stacks—still verify every write path. |
| **Ops** | Events and public getters feed monitoring; missing logs mean blind incidents. |
| **SE** | House style for file order and naming reduces review time more than micro-optimizations. |

**Whole-engineering picture:** contract structure is **API + schema + audit surface** in one file (or module set).

**PR template add-on:** “External surface added/changed: …” and “State ownership: …” — two sentences that save an hour of archaeology.

---

## 4. Staff-level review checklist

- Pragma present; file order follows a documented house style.
- State variables are easy to list at a glance; `public` used deliberately.
- Constants / immutables / mutable storage are visually separable.
- External vs internal boundaries are clear; helpers are not accidentally `@external`.
- Constructor/`__init__` sets the security-critical initials (owner, keys, limits).
- No expectation of modifiers/inheritance—composition paths are named.
- Events sit next to the state changes they explain.
- Multi-module ownership of state is diagrammed or documented.
- ABI-facing names are stable and glossary-consistent.
- Default/receive-style paths are obvious or absent.
- Import/module paths match CI; no laptop-only layout.

---

## References

- [Structure of a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/structure-of-a-contract.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper by Example](https://docs.vyperlang.org/en/v0.4.3/vyper-by-example.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
