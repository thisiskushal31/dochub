# Clojure — Recursion

[← Clojure README](./README.md)

Recursion in Clojure is either **natural recursion** (a function calling itself) or **tail recursion** via **loop** and **recur**. **recur** must appear in **tail position** (as the last evaluated form) so the compiler can replace the call with a jump and avoid stack growth. Use **recur** for iterative loops and **loop** when you need a recursion point with bindings.

---

## loop and recur

**loop** binds locals like **let** and defines a recursion point. **recur** jumps back to that **loop** (or to the enclosing **fn**) with new argument values. The JVM does not optimize general tail calls, so **recur** is the way to write constant-space loops.

```clojure
(loop [i 0]
  (when (< i 5)
    (println i)
    (recur (inc i))))
```

**recur** must be in tail position: the last expression evaluated in that branch. You cannot nest **recur** inside other forms (e.g. inside **if** only in the branch that is the tail).

---

## Tail-recursive factorial

A typical pattern is to accumulate a result and pass it through **recur** so the recursive call is in tail position.

```clojure
(loop [n 5 acc 1]
  (if (zero? n)
    acc
    (recur (dec n) (* n acc))))
;; => 120
```

---

## Function recursion with recur

Inside a **fn** or **defn**, **recur** jumps back to the function with new arguments. The arity must match. Use this for recursive functions that would otherwise blow the stack.

```clojure
(defn count-down [n]
  (when (pos? n)
    (println n)
    (recur (dec n))))
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
