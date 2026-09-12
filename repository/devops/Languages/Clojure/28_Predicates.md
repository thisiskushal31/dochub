# Clojure — Predicates

[← Clojure README](./README.md)

**Predicates** are functions that return a logical value: **true** or **false**. By convention their names end with **?** (e.g. **even?**, **empty?**). Clojure provides predicates for types, collections, and numbers; you can combine them with **every-pred**, **some-fn**, and use them with **filter**, **some**, and **every?**.

---

## Common predicates

**nil?**, **true?**, **false?**, **string?**, **keyword?**, **symbol?**, **number?**, **integer?**, **coll?**, **seq?**, **map?**, **vector?**, **set?**, **list?**, **empty?** test types and structure. **zero?**, **pos?**, **neg?**, **even?**, **odd?** are for numbers.

```clojure
(nil? nil)
;; => true
(empty? [])
;; => true
(even? 4)
;; => true
(coll? [1 2 3])
;; => true
```

---

## every-pred and some-fn

**every-pred** takes predicates and returns a function that is **true** when **all** of them return true for the arguments. **some-fn** returns a function that is **true** when **any** of them returns true.

```clojure
((every-pred number? pos?) 3)
;; => true
((every-pred number? pos?) -1)
;; => false
((some-fn nil? string?) "x")
;; => true
```

---

## every? and some

**every?** returns true if the predicate is true for every element of the collection. **some** returns the first logical true value returned by the predicate on the collection, or **nil**.

```clojure
(every? even? [2 4 6])
;; => true
(some #(when (> % 3) %) [1 2 3 4 5])
;; => 4
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
