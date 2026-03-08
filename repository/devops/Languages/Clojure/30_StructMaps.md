# Clojure — StructMaps

[← Clojure README](./README.md)

**StructMaps** (structure maps) are a way to define a fixed set of keys and create map-like values with those keys. **defstruct** defines the key set; **struct** and **struct-map** build instances. StructMaps are **immutable**; “updates” produce new maps. They are a lightweight alternative to **defrecord** when you want a known shape without protocol methods.

---

## defstruct and struct

**defstruct** takes a name and a vector of keys. **struct** creates a map with those keys and the given values in order. Omitted keys get **nil** unless you use **struct-map** and supply defaults.

```clojure
(defstruct person :name :age :role)
(struct person "Alice" 30 :engineer)
;; => {:name "Alice", :age 30, :role :engineer}
(struct person "Bob")
;; => {:name "Bob", :age nil, :role nil}
```

---

## struct-map

**struct-map** builds a struct by explicitly naming keys and values. Use it when you want to set only some fields or use a different order.

```clojure
(struct-map person :age 25 :name "Charlie" :role :designer)
;; => {:name "Charlie", :age 25, :role :designer}
```

---

## Access and immutability

Access fields with **:key** or **get**. StructMaps are immutable; use **assoc** to produce a new map with updated keys. To “add” a key you must create a new struct or a plain map; the struct definition does not change.

```clojure
(def p (struct person "Dana" 28 :analyst))
(:name p)
;; => "Dana"
(assoc p :age 29)
;; => {:name "Dana", :age 29, :role :analyst}
```

---

## When to use StructMaps

StructMaps are less common than **defrecord** for domain types (records support protocols and types). Use StructMaps when you need a fixed key set and simple construction; use **defrecord** when you need type identity or protocol dispatch.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
