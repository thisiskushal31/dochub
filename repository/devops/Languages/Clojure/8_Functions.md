# Clojure — Functions

[← Clojure README](./README.md)

Clojure is a **functional** language: functions are first-class values, and you define, compose, and pass them. **defn** defines a named function; **fn** defines an anonymous function. Functions can take zero or more arguments, support **variadic** parameters, and can return other functions (**higher-order** functions).

---

## Defining a function with defn

**defn** takes a name, an optional docstring, a **parameter vector**, and a **body**. The body can be multiple expressions; the last value is returned.

```clojure
(defn greet [name]
  (str "Hello, " name))

(greet "World")
;; => "Hello, World"
```

Parameters are positional. Multiple arities are supported by listing additional parameter–body pairs after the first.

```clojure
(defn add
  ([x] x)
  ([x y] (+ x y))
  ([x y & more] (reduce + (cons x (cons y more)))))
```

---

## Anonymous functions with fn

**fn** creates an anonymous function. It has the same shape as defn (without the name): parameter vector and body. You can assign it to a var or pass it directly.

```clojure
((fn [x y] (+ x y)) 2 3)
;; => 5
```

The shorthand **#(...)** is a reader macro for a simple anonymous function: **%** is the first argument, **%1**, **%2** the first and second, **%&** the rest.

```clojure
(map #(* % 2) [1 2 3])
;; => (2 4 6)
```

---

## Variadic functions

A parameter name prefixed with **&** collects the remaining arguments into a sequence. That parameter is the last in the vector.

```clojure
(defn sum [& nums]
  (apply + nums))

(sum 1 2 3 4)
;; => 10
```

---

## Higher-order functions

Functions that take or return functions are **higher-order**. **map**, **filter**, **reduce**, and **apply** are common. You pass a function and one or more collections; they produce or consume values.

```clojure
(map inc [1 2 3])
;; => (2 3 4)
(filter even? [1 2 3 4])
;; => (2 4)
(reduce + [1 2 3 4])
;; => 10
```

**apply** invokes a function with a sequence of arguments “spread” as individual args:

```clojure
(apply str ["a" "b" "c"])
;; => "abc"
```

---

## Further reading

- [Clojure — Higher-order functions](https://clojure.org/guides/higher_order_functions)
- [Clojure README](./README.md) — Topic index.
