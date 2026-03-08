# Clojure — Operators and expressions

[← Clojure README](./README.md)

In Clojure there are no special infix operators; **operations are function calls**. Arithmetic, comparison, and logical operations use the same form: `(operator operand1 operand2 ...)`. The “operator” is just a function name. Expressions are evaluated from the inside out; the result of one form can be passed as an argument to another.

---

## Arithmetic

**+**, **-**, **\***, and **/** are functions. They take one or more operands. Division of integers yields a fraction (ratio) when the result is not whole; use `quot` for integer division or cast for a float.

```clojure
(+ 1 2)
;; => 3
(- 10 3)
;; => 7
(* 2 3)
;; => 6
(/ 6 2)
;; => 3
(/ 3 2)
;; => 3/2
(inc 5)
;; => 6
(dec 5)
;; => 4
```

**mod** returns the remainder; **rem** is remainder with sign of the dividend.

---

## Comparison and equality

**=** tests value equality (numbers, collections, etc.). **==** is numeric equality. **&lt;**, **&lt;=**, **&gt;**, **&gt;=** compare numbers. **not=** is logical negation of `=`.

```clojure
(= 1 1)
;; => true
(= [1 2] [1 2])
;; => true
(< 1 2)
;; => true
(>= 5 5)
;; => true
```

---

## Logical

**not** returns the logical negation of its argument (false and nil are false; anything else is true). **and** and **or** are macros: they short-circuit and return the last value they need to evaluate.

```clojure
(not false)
;; => true
(and true true)
;; => true
(or false true)
;; => true
```

---

## Bitwise

**bit-and**, **bit-or**, **bit-xor**, **bit-not**, and **bit-shift-left** / **bit-shift-right** perform bitwise operations on integers.

---

## Expressions and nesting

Any form can appear as an argument to another. The inner forms are evaluated first. So you can nest arithmetic and function calls:

```clojure
(+ (* 2 3) (/ 10 2))
;; => 11
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
