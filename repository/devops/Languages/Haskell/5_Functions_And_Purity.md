# Functions and purity

Functions are the main way to structure computation in Haskell. They are defined by equations, often with pattern matching, and are first-class: they can be passed as arguments, returned as results, and stored in data structures. Purity means that the result of a function depends only on its arguments; there are no hidden inputs or side effects in the pure fragment.

**Equations and pattern matching.** A function is defined by one or more equations of the form `funlhs = exp` or `funlhs | guard1 = exp1 | guard2 = exp2 ...`. The left-hand side consists of the function name and patterns (and possibly a type signature elsewhere). The compiler tries the equations in order; the first matching one is used. So the order of equations can affect both meaning and termination. In patterns, no variable may appear more than once (linearity); as-patterns (`v@pat`) name the whole value being matched; wild-cards `_` match anything and bind nothing.

**Currying and application.** Function application is written `e1 e2` and associates to the left, so `f x y` is `(f x) y`. A type `a -> b -> c` is read as `a -> (b -> c)`: given an `a`, the result is a function `b -> c`. So `add x y = x + y` is the same as `add = \x -> \y -> x + y`. Partial application is normal: `add 1` is a function that adds one. Data constructors can also be partially applied.

**Lambda abstractions.** The form `\ p1 ... pn -> e` defines an anonymous function. The pi are patterns; the set must be linear. Semantically, `\ p1 ... pn -> e` is equivalent to `\ x1 ... xn -> case (x1,...,xn) of (p1,...,pn) -> e` where the xi are fresh. If the pattern match fails, the result is ⊥ (bottom).

**Infix operators and sections.** An operator is either a symbol (e.g. `+`, `++`) or an identifier in backticks (e.g. `` `elem` ``). Infix application: `e1 op e2` is the same as `(op) e1 e2`. Sections: `(op e)` = `\ x -> x op e` and `(e op)` = `\ x -> e op x` (with x not free in e). So `(1+)` and `(+1)` both mean “add one” for numbers; `(+)` is the two-argument function. The form `(- e)` is *not* a section; it is prefix negation. For “subtract e” use `subtract e`.

**Fixity.** Fixity declarations set precedence (0–9, 9 highest) and associativity: `infixl`, `infixr`, or `infix`. Normal function application has precedence 10. If no fixity is given for an operator, it defaults to `infixl 9`. Example: `infixr 5 ++`; `infixr 9 .`. Consecutive unparenthesised operators with the same precedence must have the same associativity.

**Non-strict (lazy) evaluation.** Haskell is non-strict: an argument need not be evaluated before the function is called. If the function never uses the argument, a non-terminating or erroneous argument does not affect the result. Errors and non-termination are identified with ⊥ (bottom); all types include ⊥. The Prelude provides `error :: String -> a` and `undefined :: a` to produce bottom. Non-strictness allows infinite and circular structures and separates the order of definition from the order of evaluation. Data constructors are non-strict unless a field is marked with `!` in the data declaration.

**Infinite and circular structures.** Because constructors are lazy, you can define infinite lists (e.g. `ones = 1 : ones` or `[1,3..]`) and then take a finite prefix with `take`. Circular definitions (e.g. the Fibonacci list in terms of itself) are valid when consumption is incremental.

**List comprehensions and arithmetic sequences.** A list comprehension `[ e | q1, ..., qn ]` is sugar for nested `concatMap` and filtering. Generators are of the form `pat <- exp`; guards are boolean expressions. Arithmetic sequences use the `Enum` class: `[e1..]`, `[e1,e2..]`, `[e1..e3]`, `[e1,e2..e3]` (e.g. `[1..10]`, `['a'..'z']`).

**Purity and reasoning.** In pure code there are no assignments or hidden state. Equational reasoning holds: you can replace a call with its definition (accounting for pattern matching and guards). That makes refactoring and testing easier and avoids whole classes of bugs tied to shared mutable state.

```haskell
-- Curried addition and partial application
add :: Integer -> Integer -> Integer
add x y = x + y
inc = add 1

-- map is higher-order; (.) is composition
map (add 1) [1,2,3]  -- [2,3,4]
map (1+) [1,2,3]     -- same

-- Infinite list and take
ones = 1 : ones
take 5 (map (^2) [0..])  -- [0,1,4,9,16]

-- List comprehension
[ (x,y) | x <- [1,2], y <- [3,4], x < y ]
```

---

## Further reading

- [Haskell 2010 report – Expressions](https://haskell.org/onlinereport/haskell2010/haskellch3.html)
- [Haskell 2010 report – Declarations (function bindings, fixity)](https://haskell.org/onlinereport/haskell2010/haskellch4.html)
- [A Gentle Introduction to Haskell – Functions](https://www.haskell.org/tutorial/functions.html)
- [A Gentle Introduction to Haskell – Patterns](https://www.haskell.org/tutorial/patterns.html)
