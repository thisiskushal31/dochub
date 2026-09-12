# Clojure — Control flow: decision making and loops

[← Clojure README](./README.md)

Clojure uses **expressions** for control flow: **if**, **when**, **cond**, and **case** choose between branches; **loop** and **recur** provide recursion; **doseq** and **dotimes** iterate for side effects. There is no imperative “for” or “while” in the traditional sense; iteration is expressed with recursion or sequence functions.

---

## if

**if** takes a condition and two branches. If the condition is truthy (not `false` or `nil`), the first branch is evaluated; otherwise the second. The result of the chosen branch is the value of the `if` form.

```clojure
(if (> 3 2)
  "yes"
  "no")
;; => "yes"
```

Only one branch is evaluated. For multiple expressions in a branch, wrap them in **do**; the last value is returned.

```clojure
(if (pos? x)
  (do
    (println "positive")
    x)
  (do
    (println "non-positive")
    -1))
```

---

## when and when-not

**when** is like `if` with one branch: if the condition is truthy, the body (can be multiple forms in a `do`-like block) is evaluated; otherwise `nil`. **when-not** is the opposite.

```clojure
(when (even? n)
  (println "even")
  (quot n 2))
```

---

## cond

**cond** takes a series of test–expression pairs. The first test that is truthy is chosen; its corresponding expression is evaluated and returned. Use **:else** as a final test that is always true.

```clojure
(cond
  (< n 0) "negative"
  (zero? n) "zero"
  :else "positive")
```

---

## case

**case** dispatches on a single value; each clause is a value (or a list of values) and an expression. If the value matches, that expression is evaluated. Often used for constants or keywords.

```clojure
(case x
  1 "one"
  2 "two"
  "other")
```

---

## doseq and dotimes

**doseq** runs a body for side effects over one or more sequences. **dotimes** runs a body a fixed number of times, binding the index.

```clojure
(doseq [x [1 2 3]]
  (println x))

(dotimes [i 3]
  (println i))
```

These are for **side effects**; for producing a sequence from another, use **for** or sequence functions (topic 10).

---

## loop and recur

**loop** binds locals like **let** and establishes a **recursion point**. **recur** jumps back to the nearest loop or function with new arguments. This is how you write iterative loops in Clojure without stack growth.

```clojure
(loop [n 5 acc 1]
  (if (zero? n)
    acc
    (recur (dec n) (* acc n))))
;; => 120  (5!)
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
