# Clojure — Variables and bindings

[← Clojure README](./README.md)

Clojure has **global bindings** (vars, created with `def`) and **local bindings** (e.g. `let`, function parameters). **Vars** hold a root value and can be dynamically rebound for a scope; **let** creates immutable locals. There is no “assign to variable” in the traditional sense; you bind names to values in a scope.

---

## def — global vars

**def** creates or updates a **var** in the current namespace. The var has a **root binding** visible to all code. By convention, vars are not reassigned; they hold constant or configuration values.

```clojure
(def app-name "MyApp")
(def max-retries 3)
```

After evaluation, `app-name` refers to the string `"MyApp"` and `max-retries` to `3`. Using `def` for mutable state is possible but discouraged; use atoms or other reference types instead (topic 15).

---

## let — local bindings

**let** introduces one or more **local bindings** and a body. Each binding is a name and a value; the body is evaluated with those names in scope. Bindings are immutable within the let.

```clojure
(let [x 10
      y 20]
  (+ x y))
;; => 30
```

You can nest `let` or use a later binding to refer to an earlier one in the same binding vector.

```clojure
(let [a 1
      b (inc a)]
  (+ a b))
;; => 3
```

---

## Function parameters

Function parameters are **local bindings** for the duration of the call. They are defined in the parameter vector of `defn` (or `fn`).

```clojure
(defn add [x y]
  (+ x y))
```

Here `x` and `y` are bound to the arguments when `add` is called.

---

## Scope and shadowing

Bindings are **lexically scoped**. A inner `let` can **shadow** an outer binding by reusing the same name; the inner binding is visible only inside that let. Vars are visible in the namespace unless shadowed by a local.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
