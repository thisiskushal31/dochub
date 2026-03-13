# Types and type system

In Haskell every value has a type. Types are checked statically; the compiler ensures that values are used consistently. The type system supports polymorphism and overloading via type classes (topic 7). The rules below summarise the syntax and semantics of types and of data/type declarations.

**Typings.** The association of a value with its type is written `e :: t` (e has type t). You can read `::` as “has type.”

**Type syntax.** A *type* is either a *btype* or `btype -> type` (function type; `->` associates to the right). A *btype* is a sequence of *atype*s (type application, associating to the left). An *atype* is: a type constructor (e.g. `Int`, `Maybe`, `IO`), a type variable (e.g. `a`), a tuple type `(t1, ..., tk)` (k ≥ 2), a list type `[t]`, or a parenthesised type `(t)`. Special syntax: `[t]` is `[] t`, `(t1,t2)` is `(,) t1 t2`, `t1 -> t2` is `(->) t1 t2`. Type variables are implicitly universally quantified; e.g. `a -> a` means “for all a, function from a to a”.

**Kinds.** Types are classified by *kinds*. The kind `*` is the kind of types of values (concrete types). If κ1 and κ2 are kinds, then κ1 -> κ2 is the kind of type constructors. So `Int` has kind `*`; `Maybe` and `[]` have kind `* -> *`; `(->)` has kind `* -> * -> *`. Kinds are inferred and are not written in programs except when the compiler reports a kind error.

**Basic types.** Common built-in types: `Integer` (unbounded), `Int` (fixed-width), `Float`, `Double`, `Bool`, `Char`. The unit type `()` has one value `()`. Lists and tuples are as in the type syntax above.

**Functions.** The type of a function is `a -> b`; application associates to the left and `->` associates to the right, so `a -> b -> c` means `a -> (b -> c)`. That matches curried definitions: `add x y = x + y` has type `Num a => a -> a -> a`.

**Polymorphic types.** Type variables (e.g. `a`, `b`) denote “any type.” So `[a]` is the family of list types. The compiler infers the *principal* (most general) type for each expression. A type like `length :: [a] -> Int` is polymorphic in the element type.

**Data declarations.** An algebraic datatype is introduced with `data [context =>] simpletype [= constrs] [deriving]`. The *simpletype* is a type constructor applied to type variables (e.g. `T a b`). Each constructor is either a name applied to types, or an infix constructor (e.g. `!atype conop !atype`), or a record form `con { fielddecl1, ... }`. Constructors can have *strictness flags* `!`: a field of the form `! atype` is evaluated when the constructor is applied; without `!` the field is lazy. The optional *deriving* clause generates instances for classes such as `Eq`, `Ord`, `Show`, `Read`, `Enum`.

**Newtype.** The form `newtype [context =>] simpletype = newconstr [deriving]` defines a new type that is representationally equal to a single existing type. There must be exactly one constructor with exactly one field. Unlike a type synonym, `newtype` creates a distinct type (so you can give it different class instances); unlike `data`, it has no runtime overhead.

**Type synonyms.** The form `type simpletype = type` introduces an alias. The type and its definition are interchangeable except in instance declarations. Type synonyms cannot be partially applied (you must give all arguments). Recursive type synonyms are not allowed unless they go through a datatype.

**Contexts and class assertions.** A *context* is a comma-separated list of *class assertions* of the form `C t` or `C (t1 ... tn)`. So `Eq a`, `Ord a`, `(Eq a, Show a)` are contexts. A type can be written `context => type` (e.g. `Eq a => a -> a -> Bool`). The context restricts the type variables that appear in the type.

**Semantics of types.** The type system assigns a type of the form ∀ u. cx => t to each expression. The *principal type* is the most general such type. The compiler can infer it for all expressions, including overloaded ones. So type signatures are usually optional; they document and can catch errors. *Generalisation*: a type ∀ u. cx1 => t1 is more general than ∀ w. cx2 => t2 if there is a substitution S on u such that whenever cx2 holds, S(cx1) holds, and t2 = S(t1).

**Numeric types and overloaded literals.** Integer literals are equivalent to `fromInteger` applied to an `Integer`; float literals to `fromRational` applied to a `Rational`. So `7` has type `Num a => a` and `7.3` has type `Fractional a => a`. The numeric class hierarchy includes `Num` (+, -, *, negate, abs, etc.), subclasses `Integral` (integer division, remainder) and `Fractional` (ordinary division `/`), and further `Floating`, `RealFrac`, `RealFloat` for floats and rationals. *Defaulting*: when an ambiguous type variable has only numeric (and standard) constraints, the compiler may pick a default type (e.g. `Integer` or `Double`) from the module’s `default` declaration; the default default is `(Integer, Double)`.

**Built-in types are not special.** Aside from special syntax, list, tuple, and numeric types behave like user-defined types: they have constructors and can be pattern-matched. For example, lists are like `data [a] = [] | a : [a]`; strings are `type String = [Char]`.

```haskell
-- Enumerated type
data Bool = False | True

-- Product type (single constructor)
data Point a = Pt a a

-- Recursive sum type with deriving
data Tree a = Leaf a | Branch (Tree a) (Tree a) deriving (Eq, Show)

-- Type synonym
type String = [Char]

-- Strictness: components evaluated when the constructor is applied
data StrictPair a b = SP !a !b

-- newtype: no extra indirection
newtype Natural = MakeNatural Integer
```

---

## Further reading

- [Haskell 2010 report – Chapter 4 Declarations and bindings](https://haskell.org/onlinereport/haskell2010/haskellch4.html)
- [Haskell 2010 report – Chapter 6 Predefined types and classes](https://haskell.org/onlinereport/haskell2010/haskellch6.html)
- [The Typeclassopedia](https://wiki.haskell.org/Typeclassopedia)
- [A Gentle Introduction to Haskell – Values and types](https://www.haskell.org/tutorial/goodies.html)
- [A Gentle Introduction to Haskell – Numbers](https://www.haskell.org/tutorial/numbers.html)
