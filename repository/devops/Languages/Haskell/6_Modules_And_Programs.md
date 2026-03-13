# Modules and programs

A Haskell program is a collection of modules. Modules control namespaces and support abstract data types by hiding implementation details. The program value is the value of `main` in the module `Main`, which must have type `IO τ` for some τ; when the program is run, that computation is performed and its result is discarded.

**Module structure.** A module has the form `module modid [exports] where body`. The *body* is a sequence of import declarations followed by top-level declarations. The *modid* is a dot-separated sequence of constructor identifiers (e.g. `Data.List`, `Main`). If the module header is omitted, the body is treated as `module Main(main) where`. Module names are in a flat namespace; the dot hierarchy is a convention only.

**Export list.** An *export* can be: a value or type/class entity `qvar` or `qtycon`; a type with constructors `qtycon (..)` or `qtycon (cname1, ...)`; a class with methods `qtycls (..)` or `qtycls (var1, ...)`; or `module modid` (re-export everything that is in scope as both unqualified and as `modid.e`). For a datatype T: `T(..)` exports T and all its constructors and field names in scope; `T(c1,...,cn)` exports T and the listed constructors/fields; `T` alone exports the type but not its constructors (abstract type). For a class C: `C(..)` exports the class and all its methods in scope; `C(f1,...)` exports the class and the listed methods; `C` alone exports the class but not its methods. The export list is the union of all listed exports. If the export list is omitted, all entities defined in the module are exported, but not those only imported. An entity may only be exported if it is defined in the module or imported (and re-exporting with `module M` requires M to be imported or to be the current module).

**Import declarations.** The form is `import [qualified] modid [as modid] [impspec]`. *impspec* can be: a list of imports `( import1, ... )`; or `hiding ( import1, ... )` (import everything except the listed ones). Omission of impspec means import all exports. With `qualified`, only the qualified names are brought into scope (using the module name or the name after `as` as the qualifier). Without `qualified`, both qualified and unqualified names are in scope. Example: `import A(x)` brings in `x` and `A.x`; `import qualified A as B(x)` brings in `B.x` only. Instance declarations are never named in import/export; any import from a module brings all instances from that module into scope. There can be at most one instance per (type, class) pair in the whole program.

**Qualified names.** Qualified names are written `modid.name` (no space between modid and the dot). They are single lexemes. Using `qualified` and `as` gives you control over the qualifier and avoids clashes when two modules export the same name.

**Abstract data types.** Export the type name but not its constructors (e.g. `Tree` without `Leaf` or `Branch`). The module provides functions to build and observe values; clients cannot pattern-match on constructors or construct invalid values directly.

**Prelude.** The Prelude is implicitly imported into every module. An explicit `import Prelude` or `import Prelude hiding (...)` overrides the implicit import, so you can hide or redefine Prelude names.

**Entry point.** The executable entry point is `main` in the module `Main`. It must have type `IO τ` for some τ (commonly `IO ()`). The runtime loads the program and executes the `main` action.

```haskell
-- Tree.hs: export type and constructors and a function
module Tree (Tree(Leaf,Branch), fringe) where

data Tree a = Leaf a | Branch (Tree a) (Tree a)

fringe :: Tree a -> [a]
fringe (Leaf x)     = [x]
fringe (Branch l r) = fringe l ++ fringe r
```

```haskell
-- Main module using Tree
module Main (main) where
import Tree (Tree(Leaf,Branch), fringe)

main = print (fringe (Branch (Leaf 1) (Leaf 2)))
```

```haskell
-- Abstract type: export Tree but not Leaf/Branch
module TreeADT (Tree, leaf, branch, cell, left, right, isLeaf) where
data Tree a = Leaf a | Branch (Tree a) (Tree a)
leaf = Leaf
branch = Branch
cell (Leaf a) = a
left (Branch l _) = l
right (Branch _ r) = r
isLeaf (Leaf _) = True
isLeaf _ = False
```

---

## Further reading

- [Haskell 2010 report – Chapter 5 Modules](https://haskell.org/onlinereport/haskell2010/haskellch5.html)
- [A Gentle Introduction to Haskell – Modules](https://www.haskell.org/tutorial/modules.html)
- [GHC User's Guide – Module system](https://www.haskell.org/ghc/docs/latest/html/users_guide/)
