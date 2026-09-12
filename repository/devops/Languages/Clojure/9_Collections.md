# Clojure — Collections: lists, vectors, sets, maps

[← Clojure README](./README.md)

Clojure’s **collections** are **immutable** and **persistent**: “updates” produce new values while sharing structure where possible. The main collection types are **lists**, **vectors**, **sets**, and **maps**. Each has literal syntax and a rich set of functions for access and transformation.

---

## Lists

A **list** is a sequential collection. Literal lists in parentheses are read as **calls** unless **quoted**. Use the **list** function or **quote** `'(1 2 3)` for data. Lists are **linked**; adding at the front is O(1). **first** and **rest** (or **next**) are the main accessors; **conj** adds at the front.

```clojure
'(1 2 3)
(list 1 2 3)
(first '(1 2 3))
;; => 1
(rest '(1 2 3))
;; => (2 3)
(conj '(2 3) 1)
;; => (1 2 3)
```

---

## Vectors

**Vectors** are ordered, indexed collections. Literal form: `[1 2 3]`. Indexed access with **nth** or **get** is efficient. **conj** adds at the **end**. Vectors are the usual choice when you need order and index-based access.

```clojure
[1 2 3]
(nth [10 20 30] 1)
;; => 20
(conj [1 2] 3)
;; => [1 2 3]
```

---

## Sets

**Sets** hold **unique** values. Literal form: `#{1 2 3}`. **get** or the set as function checks membership. **conj** adds an element (no duplicate). **clojure.set** provides union, intersection, difference.

```clojure
#{1 2 3}
(#{1 2 3} 2)
;; => 2
(#{1 2 3} 5)
;; => nil
(conj #{1 2} 2)
;; => #{1 2}
```

---

## Maps

**Maps** associate **keys** with **values**. Literal form: `{:a 1 :b 2}`. Keys are often **keywords**. Use **get**, or invoke the map as a function with a key, or use **:keyword** keys with the map: `(:key map)`. **assoc** adds or “updates” a key (returns a new map); **dissoc** removes keys; **merge** combines maps.

```clojure
{:a 1 :b 2}
(get {:a 1 :b 2} :a)
;; => 1
({:a 1 :b 2} :a)
;; => 1
(:a {:a 1 :b 2})
;; => 1
(assoc {:a 1} :b 2)
;; => {:a 1 :b 2}
(dissoc {:a 1 :b 2} :b)
;; => {:a 1}
```

**hash-map** and **sorted-map** construct maps; **sorted-map-by** takes a comparator.

---

## Shared abstraction

Many functions work across collection types: **seq**, **first**, **rest**, **conj**, **count**, **empty?**. The **sequence abstraction** (topic 10) unifies iteration. Prefer functions that work on the abstraction (e.g. **map**, **filter**, **reduce**) so code works with any sequence.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
