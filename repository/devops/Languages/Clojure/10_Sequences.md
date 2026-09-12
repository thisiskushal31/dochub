# Clojure — Sequences

[← Clojure README](./README.md)

The **sequence** abstraction is a uniform way to traverse and transform collections. Many Clojure functions produce or consume **seqs**: a logical list of elements with **first** and **rest**. Collections can be turned into a seq with **seq**; **lazy sequences** defer computation until the values are needed.

---

## seq

**seq** returns a sequence view over a collection, or **nil** if the collection is empty. **first** returns the first element; **rest** (or **next**) returns the rest. So you can walk any collection with **first** and **rest**.

```clojure
(seq [1 2 3])
;; => (1 2 3)
(first (seq [1 2 3]))
;; => 1
(rest (seq [1 2 3]))
;; => (2 3)
(seq [])
;; => nil
```

---

## map, filter, reduce

**map** applies a function to each element and returns a lazy sequence of results. **filter** keeps elements for which a predicate is true. **reduce** combines elements with a function and an optional initial value.

```clojure
(map inc [1 2 3])
;; => (2 3 4)
(filter even? [1 2 3 4])
;; => (2 4)
(reduce + [1 2 3 4])
;; => 10
(reduce conj [] [1 2 3])
;; => [1 2 3]
```

---

## Lazy sequences

Many sequence functions (e.g. **map**, **filter**, **range**) return **lazy sequences**: elements are computed only when consumed. That allows infinite or large sequences without building them all in memory. **take** and **take-while** limit how much is realized.

```clojure
(take 5 (range))
;; => (0 1 2 3 4)
(take-while #(< % 5) (range))
;; => (0 1 2 3 4)
```

---

## Other sequence functions

**concat** concatenates sequences. **distinct** removes duplicates. **cons** adds an element to the front of a seq. **into** pours a sequence into a concrete collection (e.g. **into []** to get a vector). **apply** spreads a sequence as arguments to a function. **mapv** and **filterv** return vectors instead of lazy seqs when you need a concrete result.

```clojure
(concat [1 2] [3 4])
;; => (1 2 3 4)
(distinct [1 2 1 3 2])
;; => (1 2 3)
(into [] (map inc [1 2 3]))
;; => [2 3 4]
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
