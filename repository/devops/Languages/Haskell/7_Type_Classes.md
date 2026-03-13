# Type classes

Type classes provide structured overloading (ad hoc polymorphism): the same name can refer to different implementations depending on the type. They are not OOP classes: there is no mutable state or subtyping; types are declared to be instances of a class by supplying the required methods. The compiler resolves which implementation to use from the types.

**Class declaration.** A class is declared with `class [scontext =>] tycls tyvar [where cdecls]`. The *scontext* is the superclass context (e.g. `Eq a =>` for `Ord a`). The class introduces one or more method signatures; methods can have default definitions. So `class Eq a where (==), (/=) :: a -> a -> Bool; x /= y = not (x == y)` declares equality and inequality with a default for `(/=)`.

**Instance declaration.** The form is `instance [scontext =>] qtycls inst [where idecls]`. The *inst* is the type (or type application) that is an instance of the class (e.g. `Int`, `Tree a` with context `Eq a`). Methods can be defined in the instance or inherited from defaults. At most one instance per (type, class) pair is allowed in the program. Instances are not named in import/export; they are in scope whenever the module that defines them is imported.

**Contexts.** A type signature can have a context: `(Eq a, Ord a) => a -> a -> Bool`. The type variables in the context must appear in the rest of the type. A subclass implies its superclass: so `Ord a` implies `Eq a`, and a function that needs both can just require `Ord a`.

**Common standard classes.** *Eq*: `(==)`, `(/=)` (default: `/=` = `not . (==)`). *Ord*: comparison operators and `min`, `max`; often implemented via `compare :: Ord a => a -> a -> Ordering` (with `Ordering` = `LT | EQ | GT`). *Enum*: used for arithmetic sequences (`[e1..]`, `[e1,e2..e3]`); methods include `succ`, `pred`, `fromEnum`, `toEnum`. *Bounded*: `minBound`, `maxBound`. *Show*: convert to string (`show`, `shows`, `showsPrec`). *Read*: parse from string (`read`, `reads`, `readsPrec`). *Num*: `(+)`, `(-)`, `(*)`, `negate`, `abs`, etc.; subclasses include *Integral* (quot, rem, div, mod) and *Fractional* (`/`). *Functor*: `fmap :: (a -> b) -> f a -> f b` (for type constructors of kind `* -> *`). *Monad*: `(>>=)`, `return`, and `(>>)`; see topic 8 for I/O and do-notation.

**Derived instances.** The `deriving` clause on a `data` or `newtype` declaration can generate instances for `Eq`, `Ord`, `Enum`, `Bounded`, `Show`, and `Read`. For `Eq` and `Ord`, the derived implementation compares constructors in declaration order and then compares arguments left to right. For `Enum`, constructors are enumerated in order. For `Show` and `Read`, the representation matches the syntax of constructor application. You can derive multiple classes: `deriving (Eq, Ord, Show)`.

**Functor and kind * -> *.** The `Functor` class applies to type constructors of kind `* -> *` (e.g. `[]`, `Maybe`, `Tree`). You write `instance Functor Tree where ...`; the method `fmap` (or `(<$>)`) maps a function over the structure. Laws: `fmap id = id` and `fmap (f . g) = fmap f . fmap g`.

**Default methods and interlocking.** Classes can give default definitions that refer to other methods. For example, `Ord` can default `(<)` in terms of `(<=)` and `(/=)`. Some classes have “interlocking” defaults (e.g. both `show` and `showsPrec` have defaults in terms of each other); an instance must define at least one of them to avoid infinite recursion.

**Comparison with OOP.** Type classes are like interfaces: they specify a set of operations. Types are not objects; there is no hidden state or subtyping. Method resolution is at compile time from the type, so overloaded use is type-safe and predictable.

```haskell
-- Class with default method
class Eq a where
  (==), (/=) :: a -> a -> Bool
  x /= y = not (x == y)

-- Instance for a parameterized type
instance (Eq a) => Eq (Tree a) where
  Leaf a    == Leaf b    = a == b
  Branch l1 r1 == Branch l2 r2 = l1 == l2 && r1 == r2
  _         == _         = False

-- Derived instances
data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Eq, Ord, Enum, Show)

-- Functor for Tree
instance Functor Tree where
  fmap f (Leaf x)   = Leaf (f x)
  fmap f (Branch l r) = Branch (fmap f l) (fmap f r)
```

---

## Further reading

- [Haskell 2010 report – Type classes and instances](https://haskell.org/onlinereport/haskell2010/haskellch4.html)
- [Haskell 2010 report – Predefined types and classes](https://haskell.org/onlinereport/haskell2010/haskellch6.html)
- [The Typeclassopedia](https://wiki.haskell.org/Typeclassopedia)
- [A Gentle Introduction to Haskell – Type classes and overloading](https://www.haskell.org/tutorial/classes.html)
- [A Gentle Introduction to Haskell – Standard classes](https://www.haskell.org/tutorial/stdclasses.html)
