# Clojure — Numbers

[← Clojure README](./README.md)

Clojure’s numeric types are built on the JVM: integers are **Long** or **BigInt**, decimals are **Double** or **BigDecimal**. Literals and conversion rules determine which type you get. Use the right type and predicates when you care about precision or integer vs floating-point behavior.

---

## Integer and floating-point

Integer literals are **Long** by default. Suffix with **N** for **BigInt** (arbitrary precision). Floating-point literals are **Double**; suffix with **M** for **BigDecimal**. Division of two integers yields a **ratio** (e.g. **3/2**) when the result is not whole; use **quot** for integer division or **float** for a double.

```clojure
(def x 5)
(def y 5.25)
(type x)
;; => java.lang.Long
(type y)
;; => java.lang.Double
(/ 3 2)
;; => 3/2
(quot 7 2)
;; => 3
(float (/ 3 2))
;; => 1.5
```

---

## Number predicates and tests

**zero?**, **pos?**, **neg?** test sign. **even?** and **odd?** require integers. **number?** and **integer?** check type. Use these in conditionals and **filter** instead of manual comparisons when they match your intent.

```clojure
(zero? 0)
;; => true
(pos? 1)
;; => true
(neg? -1)
;; => true
(even? 4)
;; => true
(odd? 3)
;; => true
```

---

## Coercion and conversion

**int**, **long**, **float**, **double**, **bigint**, **bigdec** convert values to the corresponding type. **rationalize** turns a double into an exact ratio when possible. Use **BigDecimal** for money or other exact decimal work to avoid float rounding errors.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
