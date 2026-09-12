# Interfaces and modules

[← Back to Vyper](./README.md)

## What this chapter covers

How Vyper **composes** systems without inheritance on **0.4.x** (pin **0.4.3**): **interfaces** for typed external calls, and **modules** for reusable state and functions via explicit `import` / `initializes` / `uses` / `exports`.

Solidity developers often reach for base contracts and modifiers. Vyper’s answer is **composition with opt-in surfaces**. If you skip this chapter, 0.4 codebases will look like “missing OOP,” not like a deliberate design.

Shared EVM call semantics: [Solidity](../Solidity/README.md). Interface *files* and module *storage layout* are Vyper-specific—stay here.

---

## 1. Concepts

### 1. Composition, not inheritance

Official stance: reuse through **composition**. A module encapsulates types, functions, and optionally **state**. Any `.vy` contract file is a valid module. Functions that touch module state must be **initialized** into a compilation target; pure helpers need not.

Unused module code is not dragged into the compilation target—good for size and for audit focus.

### 2. Interfaces: typed doors to other contracts

An interface is a set of external function signatures. Define inline, import a `.vyi`, or bring JSON ABI. Then call through an address:

```vyper
# pragma version ^0.4.0

interface IERC20:
    def transfer(_to: address, _value: uint256) -> bool: nonpayable
    def balanceOf(_owner: address) -> uint256: view

@external
def pull(token: address, amount: uint256):
    ok: bool = extcall IERC20(token).transfer(msg.sender, amount)
    assert ok
```

(Use the call form your pin documents—`extcall` / interface call style as in current 0.4.x docs.)

Mutability on the interface (`view` / `nonpayable` / `payable`) must match how you call. Staff habit: **pass token addresses as untrusted unless allowlisted**—the interface types the call; it does not authenticate the code at that address.

### 3. Where interfaces live

| Form | Use |
|------|-----|
| Inline `interface Name:` | Small, local dependencies |
| `.vyi` file | Shared project interfaces |
| JSON ABI import | Brownfield / cross-language artifacts |
| `implements: SomeInterface` | Declare that *this* contract fulfills a surface |

Import paths follow `import` / `from ... import` with optional aliases. Search path: relative to the file, then configured `-p` / `search_paths`—pin dependencies deliberately in CI (chapter **12**).

### 4. Importing a module

```vyper
import ownable
import ownable as ow
from . import ownable as ow
```

After `as`, use the alias everywhere. Pure helpers can be called immediately:

```vyper
import ownable as helper

@external
def my_function(x: uint256) -> uint256:
    return helper._times_two(x)
```

State-touching functions need `initializes` or a valid `uses` chain first.

### 5. `initializes` and `__init__`

```vyper
import ownable

initializes: ownable

@deploy
def __init__():
    ownable.__init__()

@external
def admin_only_action():
    ownable._check_owner()
```

`initializes`:

- reserves the module’s place in **storage layout**,
- requires invoking the module’s `__init__` when it exists,
- makes “touch state without init” a well-formedness error.

Invoking a module `__init__` more than once is a **compile-time** error. Call dependency inits in dependency order (dependencies first)—unexpected behavior if reversed; compilers may tighten this further over time.

Access module state with the module prefix: `ownable.owner`.

### 6. `uses` — library authors defer init

`uses: ownable` lets a module read/write another module’s state **without** claiming initialization. The leaf contract that produces bytecode must still `initializes` the dependency exactly once.

```vyper
# ownable_2step.vy
import ownable
uses: ownable

pending_owner: address

@deploy
def __init__():
    self.pending_owner = empty(address)

@external
def begin_transfer(new_owner: address):
    ownable._check_owner()
    self.pending_owner = new_owner
```

`ownable_2step` alone may be a valid **module** but not a valid **bytecode contract** until something initializes `ownable`.

Design intuition (optional depth): init is an affine/linear constraint—use many times, initialize exactly once if state is touched. See official modules docs for the theory note.

### 7. Initializing with dependencies (walrus)

```vyper
import ownable
import ownable_2step

initializes: ownable
initializes: ownable_2step[ownable := ownable]

@deploy
def __init__():
    ownable.__init__()
    ownable_2step.__init__()

exports: ownable_2step.__interface__
```

The `[dep := dep]` form wires which initialized instance satisfies a `uses` dependency. Staff skill: draw the **init graph** before debating product logic.

### 8. `exports` — external surface is opt-in

Imported `@external` functions are **not** automatically part of your runtime ABI:

```vyper
exports: ownable.update_owner
exports: (
    ownable_2step.begin_transfer,
    ownable_2step.accept_transfer,
)
exports: ownable_2step.__interface__   # wholesale externals
exports: base_token.IERC20             # interface slice; module must implement it
```

The top-level compilation target owns the public API. Reviewers read **`exports`** as carefully as Solidity inheritance linearization—except here the list is explicit.

### 9. Modules as interfaces to other addresses

```vyper
import ownable

an_ownable: ownable.__interface__

def call_ownable(addr: address):
    self.an_ownable = ownable.__at__(addr)
    # typed remote calls...
```

Do not confuse **in-process module state** (composed into *this* deploy) with **another address’s storage**.

---

## 2. Advanced concepts

### 1. Interfaces vs modules (choose deliberately)

| Need | Prefer |
|------|--------|
| Call someone else’s deployed contract | **Interface** |
| Reuse logic/state inside *this* deploy | **Module** |
| Share only signatures across languages | `.vyi` / ABI JSON |
| Multi-contract product with one mental model | Modules for internals + interfaces at boundaries |

### 2. Storage layout is part of the API

`initializes` assigns layout. Changing module order or adding state is a storage-breaking change for upgrades and for tooling that freezes layout JSON (chapters **12**, **17**). Treat module graphs as release artifacts.

### 3. Export discipline and confused deputies

Accidentally exporting an admin function or omitting a needed one are both defects. Diff the **final ABI** against the product checklist. Wholesale `__interface__` exports are powerful—and easy to over-expose.

### 4. 0.3.x brownfield

Pre-0.4 codebases often duplicated logic or used different reuse patterns. When reading older Curve-era or tutorial contracts, do not assume `initializes` / `exports` exist. Porting to 0.4 modules is a **design** migration—storage layout and exported ABI must be re-verified.

### 5. Nonreentrancy and imported files

`#pragma nonreentrancy on` is **file-scoped**. Imported modules keep the reentrancy behavior their author marked unless you understand the lock interaction across the composition (chapter **08**). Do not assume the pragma “infects” the whole graph.

### 6. Default arguments and selectors

External functions with defaults generate multiple selectors. Interface definitions and clients must match the selector you intend—especially when calling into Solidity-authored ERC surfaces. See control-structures notes in official docs when debugging “wrong function hit.”

---

## 3. Applications and use cases

| Role | Practice |
|------|----------|
| **Protocol engineer** | Ownable/access, math, and ERC surfaces as modules; export only needed externals |
| **Integrator** | Depend on `.vyi` interfaces; never copy-paste ABIs by hand |
| **Security reviewer** | List `exports`; verify init order; treat interface addresses as trust boundaries |
| **Ops** | Record module graph + compiler pin with the deploy |
| **Solidity sibling teams** | Map “base contract” instincts to modules; map “IERC20” to interfaces |

**Smell:** huge contracts that paste the same ownership code five times because “Vyper has no inheritance.” 0.4 modules exist so you do not have to.

---

## 4. Staff-level review checklist

- External calls to known ABIs go through interfaces (or justified `raw_call`).
- Interface mutability matches actual call mode.
- Token/implementation addresses have an allowlist or explicit trust note.
- Stateful imports use `initializes` / `uses` correctly; `__init__` order is sound.
- Dependency wiring uses `[dep := dep]` where required—and matches the graph on paper.
- `exports` lists match the intended public ABI—no accidental surface.
- Module dependency graph is documented for the compilation target.
- Storage layout implications acknowledged for any upgrade story.
- Pure vs stateful module usage distinguished (no silent state touch).
- Brownfield 0.3 vs 0.4 differences named when reviewing older trees.
- Remote `__at__` usage not confused with local module storage.

---

## References

- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Interfaces (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/interfaces.html)
- [Structure of a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/structure-of-a-contract.html)
- [Control structures (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/control-structures.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Solidity track](../Solidity/README.md) — inheritance/interfaces contrast + call semantics
