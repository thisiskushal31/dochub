# Clojure — Equality and comparators

[← Clojure README](./README.md)

Clojure’s **=** tests value equality for immutable values and is consistent with **hash** for use in sets and as map keys. **==** is for numeric equality across number types. **identical?** tests object identity. **compare** and custom **comparators** define order for **sort**, **sorted-set**, and **sorted-map**.

---

## = and value equality

**=** returns true when two values represent the same value: same scalar (nil, boolean, character, string), same symbol or keyword, numerically equal numbers in the same category, or collections with **=** elements (order matters for sequences; ignored for sets and maps). For mutable refs (vars, atoms, refs, agents), **=** is true only when **identical?** is true.

```clojure
(= 1 1)
;; => true
(= [1 2] [1 2])
;; => true
(= {:a 1} {:a 1})
;; => true
(= 1 1.0)
;; => false  (different categories)
(== 1 1.0)
;; => true   (numeric equality)
```

---

## == and numeric equality

**==** compares numbers across types (e.g. **0** and **0.0**). If any argument is not a number, it throws. Use **==** for numeric comparison; use **=** for general value equality.

---

## identical? and hash

**identical?** is true only for the same object reference. **hash** is consistent with **=**: equal values have the same **hash**. Do not rely on **hash** of mutable objects across mutations.

---

## compare and comparators

**compare** returns a negative integer, zero, or positive integer if the first argument is less than, equal to, or greater than the second. It works for numbers, strings, keywords, symbols, and types that implement **Comparable**. **sort** and **sort-by** use **compare** by default. **sorted-set** and **sorted-map** order by **compare** unless you pass a comparator.

```clojure
(compare 1 2)
;; => -1
(compare "a" "b")
;; => -1
(sort [3 1 2])
;; => (1 2 3)
(sort-by count ["aaa" "b" "cc"])
;; => ("b" "cc" "aaa")
```

---

## Custom comparators

A **comparator** is a function of two arguments that returns a negative int, zero, or positive int. Pass it to **sort**, **sorted-set**, or **sorted-map**. The comparator must define a **total order** (consistent and transitive) to avoid undefined behavior. Prefer **compare** when it fits; otherwise implement a 3-way comparator that returns -1, 0, or 1.

---

## Further reading

- [Clojure — Equality](https://clojure.org/guides/equality)
- [Clojure — Comparators](https://clojure.org/guides/comparators)
- [Clojure README](./README.md) — Topic index.
