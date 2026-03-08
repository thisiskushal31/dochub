# Clojure — Metadata and reader conditionals

[← Clojure README](./README.md)

**Metadata** is a map of information attached to a symbol or collection. It does not affect value equality and is used for documentation (**:doc**), type hints, and tooling. **Reader conditionals** allow different code to be read depending on the **platform** (Clojure vs ClojureScript) or **feature flags**, so one codebase can target multiple environments.

---

## Metadata

Metadata is a **map** attached to an object. Literal metadata is written with **^** before the form. **:doc** is the standard key for documentation; **:arglists** documents function parameters. **with-meta** and **meta** attach and read metadata at runtime.

```clojure
(defn greet
  "Returns a greeting string."
  [name]
  (str "Hello, " name))

(meta #'greet)
;; => {:doc "Returns a greeting string.", ...}
```

**^:key** is shorthand for **^{:key true}**. Type hints use **^Class** (e.g. **^String**) for performance.

---

## Reader conditionals

**#?** reads one of several expressions depending on the current **reader target**. **:clj** is Clojure (JVM), **:cljs** is ClojureScript. Only the matching branch is read; the rest are discarded.

```clojure
#?(:clj  (java.util.Date.)
   :cljs (js/Date.))
```

**#?@** splices a list: one of the following lists is read in place. Use it to include or exclude whole forms (e.g. requires or implementations) per platform.

```clojure
#?@(:clj  [(:require [clojure.java.io :as io])])
```

---

## Feature expressions

Reader conditionals can also key on **features** (e.g. **:default**). This supports optional or alternate code paths at read time without runtime conditionals.

---

## Further reading

- [Clojure — Reader conditionals](https://clojure.org/guides/reader_conditionals)
- [Clojure README](./README.md) — Topic index.
