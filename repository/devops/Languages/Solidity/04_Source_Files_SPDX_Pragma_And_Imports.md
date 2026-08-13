# Source files: SPDX, pragma, and imports

[← Back to Solidity](./README.md)

## What this chapter covers

What belongs in a **`.sol` file**, why **SPDX** and **`pragma`** come first, how **imports** and **remappings** work, and how **NatSpec** at file level differs from per-function docs. Assumes **Solidity 0.8.x** (snapshot **0.8.36**).

A `.sol` file is a compilation unit, not “the thing you deploy.” Think of it as a chapter in a book: header, imports, then one main character (the contract) unless you have a good reason for a crowd.

---

## 1. Concepts

### 1. A source file is a compilation unit, not a deployable

One `.sol` file may contain:

- a license comment and pragma,
- `import` directives,
- zero or more **contracts**, **interfaces**, **libraries**,
- file-level **user-defined types**, **errors**, **constants**, `using … for`.

You deploy a **contract**, not a file. Several contracts in one file compile together; only the ones you ask to create become addresses.

### 2. Canonical header

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.36;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
```

| Line | Job |
|------|-----|
| SPDX | Machine-readable license; compiler **warns** if missing |
| `pragma solidity` | Which language versions may compile this file |
| `import` | Pull in other sources (symbols or whole file) |

Put SPDX and pragma at the top. Do not hide them under a wall of comments.

### 3. SPDX is not decoration

Explorers, lawyers, and `solc` all read `SPDX-License-Identifier`. Common values: `MIT`, `Apache-2.0`, `GPL-3.0-only`, `UNLICENSED` (you are *not* granting a license—different from “I forgot”).

Pick one license **per project** and keep files consistent. Mixing GPL and MIT in one artifact is a legal review, not a style nit.

### 4. Imports: named, path, and “star”

```solidity
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MathLib.sol";
```

| Style | Use |
|-------|-----|
| `import {A, B} from "…"` | Preferred — you see the symbols |
| `import "…"` | Pulls the file; aliases with `as` if needed |
| `import * as Foo from "…"` | Namespace the file |

Paths are either:

- **relative** (`./`, `../`),
- or **remapped** (`@openzeppelin/…` → a directory on disk).

The compiler does not search the internet. Remappings live in Foundry/Hardhat/`solc` settings (chapter **03**).

### 5. Path resolution in one sentence

`solc` resolves imports using **base path**, **include paths**, and **remappings**. Two repos that “both import `@foo/bar.sol`” can compile different files if remaps differ. Lock the remap next to the dependency version.

### 6. File-level constants and types

```solidity
uint256 constant BPS = 10_000; // 100% in basis points — not stored per contract

type UserId is uint256; // user-defined value type (0.8.8+)

error NotReady(); // reusable custom error
```

File-level `constant` is inlined. It is not contract storage. That is how you share a number without paying a slot.

---

## 2. Advanced concepts

### 1. SPDX in generated and flattened files

Verification sometimes wants a **flattened** source. Flattening must preserve SPDX (or produce a valid combined header). Do not strip licenses to “make the explorer happy.” Multiple SPDX identifiers in one file use `AND` / `OR` syntax — explorers are picky.

### 2. How imports actually resolve

```solidity
import "foo.sol";                          // remapping / include path
import {IERC20} from "oz/.../IERC20.sol";  // named — preferred
import * as OZ from "...";                 // module-like alias
```

`solc` does **not** search the web. It joins the import string with `--include-path` / remappings (`prefix=path`). The first match wins. Two remaps that can both satisfy `@oz/` are a supply-chain bug.

`import {A as B}` only imports the **symbol** `A`. It does not run a package’s constructors. Inheritance still needs the base source compiled into the same unit.

### 3. Cyclic imports

Two files that import each other can compile if you only need **types/interfaces** and you structure interfaces in a third file. If the compiler complains about cycles, extract an `IFoo.sol`. That is also better design.

### 4. `import` is source inclusion, not a package lock

Solidity has no crates.io inside the language. **git submodules**, **npm**, and **Foundry forge-std/OZ** are the package stories. The `.sol` import is just a path after remap. The **lockfile / submodule SHA** is what you review.

### 5. Source unit names and metadata

The compiler identifies files by **source unit name** (often the path as given). Those names appear in metadata JSON. Changing a path without a remapping alias changes metadata → changes bytecode tail (chapter **16**) even if the text is identical.

### 6. Style that reviewers actually notice

- One public contract per file named like the file (`Vault.sol` → `contract Vault`).
- Interfaces in `IVault.sol`.
- No unused imports (Solhint / compiler warnings).
- Underscore-prefixed internals only if the team already does that.

Official style guide is the tie-breaker for naming and layout nits.

### 7. Experimental pragmas

Older files may show `pragma experimental ABIEncoderV2;` or SMT pragmas. On 0.8, ABI coder v2 is default. Do not copy experimental pragmas from blog posts without knowing what they enable (SMT is chapter **19**).

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Clear file = clear API surface; interfaces imported by callers |
| **Systems** | Remaps identical in CI and on laptops |
| **Security** | Dependency path points at the **locked** OZ, not a random clone |
| **Operations** | Flatten/verify pipeline keeps SPDX |
| **Software engineering** | License chosen once; imports named; no junk files in `src/` |

---

## 4. Staff-level review checklist

- [ ] Every shipped `.sol` has **SPDX** and a **0.8.x pragma**.
- [ ] Application pragma and CI `solc` pin **agree** (chapter **02**).
- [ ] Remappings resolve to **vendored / locked** directories.
- [ ] Public types used across packages live in **interface files**, not hidden inside a fat contract file.
- [ ] No file relies on Remix “auto import” that CI cannot see.

---

## References

- [Layout of a Solidity source file](https://docs.soliditylang.org/en/v0.8.36/layout-of-source-files.html)
- [Import path resolution](https://docs.soliditylang.org/en/v0.8.36/path-resolution.html)
- [Style guide](https://docs.soliditylang.org/en/v0.8.36/style-guide.html)
- [Using the compiler (remappings)](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [Foundry: project layout / remappings](https://book.getfoundry.sh/projects/working-on-an-existing-project)
