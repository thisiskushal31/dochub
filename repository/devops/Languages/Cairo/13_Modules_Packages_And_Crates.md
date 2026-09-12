# Cairo — Modules, packages, and crates

[← Cairo README](./README.md)

A **crate** is the unit of compilation; the crate root is **src/lib.cairo**, which forms the root module. A **package** is a directory with a **Scarb.toml** manifest and can contain one or more crates. **Modules** organize code inside a crate and control visibility: **mod** defines a module, **pub** makes items visible outside the module. This topic covers packages, crates, declaring modules, paths, and **use**.

---

## Packages and crates

Create a package with **scarb new my_package**. The crate root is **src/lib.cairo**. The compiler starts there and builds the module tree. Scarb.toml defines the package name, version, edition, and dependencies.

```bash
scarb new my_package
```

```
my_package/
├── Scarb.toml
└── src
    └── lib.cairo
```

---

## Declaring modules

In the crate root (or any file that is part of the crate), declare a module with **mod name;**. The compiler looks for the module either inline (e.g. `mod garden { ... }`) or in **src/name.cairo** (for `mod garden;`). Submodules of `garden` go in **src/garden/vegetables.cairo** if you declare `mod vegetables;` in **src/garden.cairo**.

```cairo
// src/lib.cairo
pub mod garden;
use crate::garden::vegetables::Asparagus;

#[executable]
fn main() {
    let plant = Asparagus {};
    println!("I'm growing {:?}!", plant);
}
```

```cairo
// src/garden.cairo
pub mod vegetables;
```

```cairo
// src/garden/vegetables.cairo
#[derive(Drop, Debug)]
pub struct Asparagus {}
```

---

## Paths for referring to an item in the module tree

A **path** identifies an item (function, struct, enum, constant, etc.) in the module tree. Paths can be absolute or relative.

- **Absolute path** starts with **crate::** (from the crate root), e.g. **crate::garden::vegetables::Asparagus**.
- **Relative path** starts from the current module and uses **self::** or **super::** (parent module).

Items are **private** to their parent module by default. To refer to an item from another module, that item (and any module in the path) must be **pub**. Use **pub(crate)** to make an item visible everywhere in the current crate but not to external crates.

```cairo
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

#[executable]
fn main() {
    crate::front_of_house::hosting::add_to_waitlist();
}
```

---

## Bringing paths into scope with the use keyword

**use** brings a path into the current scope so you can refer to the item by a short name instead of the full path. You can **use** functions, structs, enums, traits, and submodules. **pub use** re-exports the item so callers of your module can use the short path too.

```cairo
use crate::garden::vegetables::Asparagus;

#[executable]
fn main() {
    let plant = Asparagus {};
    println!("I'm growing {:?}!", plant);
}
```

Nested paths and globs (e.g. **use crate::garden::vegetables::***) let you bring multiple items from the same module into scope in one line.

---

## Separating modules into different files

Modules can be declared **inline** (with **mod name { ... }**) or in a **separate file**. When you write **mod garden;**, the compiler looks for **src/garden.cairo**. Submodules of **garden** are declared inside **garden.cairo** (e.g. **mod vegetables;**) and the compiler looks for **src/garden/vegetables.cairo**. The directory structure mirrors the module tree.

```
my_package/
├── Scarb.toml
└── src
    ├── lib.cairo          // crate root, declares mod garden;
    ├── garden.cairo       // declares mod vegetables;
    └── garden
        └── vegetables.cairo
```

Keeping one module per file (or per directory for a module and its children) keeps the codebase navigable. The crate root **lib.cairo** stays small and only declares top-level modules; implementation lives in the corresponding files.

---

## Further reading

- [The Cairo Book — Packages and Crates](https://www.starknet.io/cairo-book/ch07-01-packages-and-crates.html)
- [The Cairo Book — Defining Modules to Control Scope](https://www.starknet.io/cairo-book/ch07-02-defining-modules-to-control-scope.html)
- [The Cairo Book — Paths for Referring to an Item in the Module Tree](https://www.starknet.io/cairo-book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html)
- [The Cairo Book — Bringing Paths into Scope with the use Keyword](https://www.starknet.io/cairo-book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html)
- [The Cairo Book — Separating Modules into Different Files](https://www.starknet.io/cairo-book/ch07-05-separating-modules-into-different-files.html)
- [Cairo README](./README.md) — Topic index.
