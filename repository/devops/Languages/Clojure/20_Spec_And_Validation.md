# Clojure — spec and validation

[← Clojure README](./README.md)

**clojure.spec** (or **spec.alpha**) describes the **shape** of data and functions. **Specs** can validate values, generate test data, and document APIs. You define specs with **s/def** (for names) and **s/fdef** (for functions); **s/valid?** checks a value against a spec; **s/explain** reports why a value failed. Use spec at boundaries (inputs, outputs, storage) to catch invalid data early.

---

## Defining specs

**s/def** associates a name with a spec. Specs can be **predicates** (e.g. **string?**, **int?**), **sets** of valid values, **s/keys** for maps (with **:req** and **:opt** keys), **s/coll-of** for collections, **s/map-of** for key–value maps, and **s/or** / **s/and** for alternatives and composition.

```clojure
(require '[clojure.spec.alpha :as s])

(s/def ::name string?)
(s/def ::age int?)
(s/def ::person (s/keys :req-un [::name ::age]))

(s/valid? ::person {:name "Alex" :age 30})
;; => true
(s/valid? ::person {:name "Alex"})
;; => false
(s/explain ::person {:name "Alex"})
;; reports missing :age
```

---

## Function specs

**s/fdef** specifies a function’s **:args**, **:ret**, and optional **:fn** (relation between args and ret). **instrument** (from **clojure.spec.test.alpha**) wraps functions to check args and ret at call time. **check** runs the function with generated args and validates the return value (property-based testing).

---

## When to use spec

Use spec for **API contracts** (inputs and outputs), **configuration** validation, and **generative testing**. Avoid over-specifying internal implementation details; focus on boundaries and critical invariants.

---

## Further reading

- [Clojure — spec Guide](https://clojure.org/guides/spec)
- [Clojure README](./README.md) — Topic index.
