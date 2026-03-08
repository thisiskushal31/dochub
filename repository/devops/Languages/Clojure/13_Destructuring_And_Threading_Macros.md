# Clojure — Destructuring and threading macros

[← Clojure README](./README.md)

**Destructuring** binds names to parts of a data structure by describing its shape (e.g. “first element”, “key :a”). **Threading macros** rewrite nested calls into a linear pipeline so each step passes its result into the next. Both make code shorter and easier to read.

---

## Sequential destructuring

In **let**, **defn** parameters, or **for**, you can use a **vector** on the left side that mirrors the **shape** of the value. Elements are bound by position. **&** plus a name binds the rest to a sequence.

```clojure
(let [[x y z] [1 2 3]]
  (+ x y z))
;; => 6

(let [[first & rest] [1 2 3 4]]
  [first rest])
;; => [1 (2 3 4)]
```

Nested structures can be destructured recursively:

```clojure
(let [[[x1 y1] [x2 y2]] [[5 10] [10 20]]]
  [x1 y1 x2 y2])
;; => [5 10 10 20]
```

---

## Associative destructuring

For **maps** you use a **map** on the left: keys are the pattern, symbols are the bindings. **:keys** pulls keyword keys into locals; **:as** binds the whole map; **:or** gives defaults when a key is missing.

```clojure
(let [{:keys [name age] :as person} {:name "Alex" :age 30}]
  [name age person])
;; => ["Alex" 30 {:name "Alex" :age 30}]

(let [{:keys [a b] :or {a 0 b 0}} {}]
  [a b])
;; => [0 0]
```

**:strs** and **:syms** work for string and symbol keys.

---

## Thread-first (->) and thread-last (->>)

**->** (thread-first) inserts the previous result as the **first** argument of the next form. **->>** (thread-last) inserts it as the **last** argument. Both take an initial value and one or more forms.

```clojure
(-> {:a 1}
    (assoc :b 2)
    (update :a inc))
;; => {:a 2 :b 2}

(->> [1 2 3 4]
     (filter even?)
     (map inc))
;; => (3 5)
```

Use **->** for data (maps, “subject” as first arg); use **->>** for sequences (collection as last arg to map/filter etc.).

---

## as->

**as->** binds a name for the threaded value so you can place it explicitly in the next form (e.g. not first or last).

```clojure
(as-> [1 2 3] x
  (map inc x)
  (reduce + x))
;; => 9
```

---

## Further reading

- [Clojure — Destructuring](https://clojure.org/guides/destructuring)
- [Clojure — Threading macros](https://clojure.org/guides/threading_macros)
- [Clojure README](./README.md) — Topic index.
