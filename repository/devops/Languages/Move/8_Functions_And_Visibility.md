# Functions and visibility

[← Back to Move](./README.md)

This topic covers **local control flow** (variables, branches, loops, failure) and **module-level API shape** (functions, visibility, **`use`**, constants, friends)—the same ground as the core Move language reference for executable structure.

## Local variables and scopes

**`let`** introduces a binding. Locals are **lexically scoped**; the same name can **shadow** an outer binding. You may declare **`let x;`** and assign **`x`** later (e.g. in **`if`** branches) when a single initializer is impossible.

```move
let sum = 0u64;
let i = 1u64;
while (i <= 10) {
    sum = sum + i;
    i = i + 1;
};
```

Variable names start with **`_`** or lowercase **`a`–`z`** (not uppercase—those are struct names). Type annotations are optional: **`let x: u64 = 0;`**.

## Equality

**`==`** and **`!=`** apply to comparable types. **`assert!(cond, code)`** aborts with **`code`** if **`cond`** is false—common for preconditions.

```move
assert!(from != to, 1);
```

## Conditionals and loops

**`if (e) { ... } else { ... }`**. **`while (cond) { ... }`**; **`loop { ... }`** with **`break`** and **`continue`**.

```move
fun smallest_factor(n: u64): u64 {
    let i = 2u64;
    while (i <= n) {
        if (n % i == 0) break;
        i = i + 1;
    };
    i
}
```

## Abort and assert

**`abort code`** ends the **whole transaction** with **`u64`** **`code`**; there is no catch. **`assert!`** is a convenience for conditional abort. Failed arithmetic can also abort (e.g. overflow). On-chain, storage updates commit only if the transaction succeeds—aborts roll back.

```move
if (len < 2) abort 42;
```

## What are Move functions?

**Functions** hold executable logic. **Module functions** live inside a module and can be called from the same module, from other modules (if visible), or from **scripts** (if **`public`**). **Script functions** are the single entry of a script transaction. **Native** functions have no Move body—the VM implements them (standard library, chain-specific hooks).

## Why visibility and entry matter?

**Default (internal)** functions cannot be called from outside the module—ideal for helpers that must not be invoked arbitrarily. **`public`** opens the API to any caller; **`public(friend)`** restricts callers to an explicit friend list—useful for **controlled collaboration** between a small set of modules. **`entry`** marks functions the runtime may use as **transaction starts**; on Sui, **`public entry`** is how wallets and PTBs invoke your module.

Auditors map **every public and entry surface** to abuse cases. Over-exposed **`public`** functions are a common finding.

## How do declaration, `acquires`, and scripts work?

Shape: **`fun`**, name, optional type parameters, parameters, return type, optional **`acquires`**, body. Type parameters may carry ability constraints (see [Generics](./9_Generics_And_Type_System.md)).

| Modifier | Callers |
|----------|---------|
| *(none)* | Same module only |
| `public` | Any module or script |
| `public(friend)` | Same module + declared friend modules (not scripts) |

**`entry`:** can serve as execution entry; may still be callable from Move unless kept internal.

**`acquires`:** if a function uses **`move_from`**, **`borrow_global`**, or **`borrow_global_mut`** on a resource type defined in the **same** module, it must list **`acquires ThatType`**. Internal callees that acquire propagate the annotation. Other modules never annotate acquires for types they cannot touch.

**Scripts (Aptos / core-style):** one function, no type parameters, **`()`** return, no **`acquires`**, typically calling **`public`** module functions.

**Visibility and `acquires` in one module:**

```move
module 0x2::vault {
    friend 0x2::admin;

    struct State has key { sealed: bool }

    fun internal_reset(s: &mut State) {
        s.sealed = false;
    }

    public(friend) fun friend_reset(addr: address) acquires State {
        internal_reset(borrow_global_mut<State>(addr));
    }

    public fun query(addr: address): bool acquires State {
        borrow_global<State>(addr).sealed
    }
}
```

Only **`0x2::admin`** may call **`friend_reset`**. Any module may call **`query`**.

## Uses, aliases, and constants

**`use`** brings modules or members into scope; **`as`** renames.

```move
use std::signer;
use std::vector::{Self as V, push_back};
```

**`const`** defines a module-scoped immutable value (must be compile-time known).

```move
const MAX_MINT: u64 = 1_000_000_000;
```

**Sui:** **`init`** runs once at publish for setup; **`public entry`** replaces much of what scripts do on Aptos. Details expand in Sui-specific topics.

Sui entry functions often take **`&mut TxContext`** (and object references) so the runtime can pass the sender and mint new object IDs:

```move
use sui::tx_context::{Self, TxContext};

public entry fun ping(ctx: &mut TxContext) {
    let _sender = tx_context::sender(ctx);
}
```

## Use cases across engineering

- **Application:** Shape your public API; hide dangerous helpers.
- **Systems:** Entry points determine what the VM dispatches per transaction.
- **Security:** Friend lists and minimal **`public`** surface reduce exploitability.
- **Operations:** Upgrades change module code; entry names stable across client SDKs matter for compatibility.

---

## Further reading

- [The Move Book — Variables](https://move-language.github.io/move/variables.html)
- [Equality](https://move-language.github.io/move/equality.html)
- [Abort and assert](https://move-language.github.io/move/abort-and-assert.html)
- [Conditionals](https://move-language.github.io/move/conditionals.html)
- [Loops](https://move-language.github.io/move/loops.html)
- [Functions](https://move-language.github.io/move/functions.html)
- [Uses](https://move-language.github.io/move/uses.html) · [Friends](https://move-language.github.io/move/friends.html) · [Constants](https://move-language.github.io/move/constants.html)
- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Sui — entry functions and conventions](https://docs.sui.io/concepts/sui-move-concepts/conventions#entry-functions)
