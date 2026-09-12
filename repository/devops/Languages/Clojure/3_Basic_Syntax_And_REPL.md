# Clojure — Basic syntax and the REPL

[← Clojure README](./README.md)

Clojure syntax is minimal. **Expressions** are written as **forms** inside parentheses (or other delimiters). The first element of a list form is treated as a **function or macro** and the rest as **arguments**. Evaluation is uniform: read an expression, evaluate it, produce a value. The **REPL** (Read Eval Print Loop) reads a form, evaluates it, prints the result, and repeats.

---

## Forms and parentheses

Any **list** written in parentheses is a form. The first element is the operator (function or macro); the rest are arguments. Numbers and strings evaluate to themselves. So addition is a list whose first element is `+`.

```clojure
(+ 1 2)
;; => 3
```

The result is `3`. The `+` function is applied to `1` and `2`. Similarly, `str` concatenates strings:

```clojure
(str "Hello" "World")
;; => "HelloWorld"
```

So the general shape is `(operator arg1 arg2 ...)`. This is **prefix notation**; operators are just functions.

---

## Namespace and defn

Code is organized in **namespaces**. At the top of a file you declare the namespace with `ns`. The `defn` macro defines a named function: name, optional docstring, parameter vector, and body.

```clojure
(ns myapp.example)

(defn greet []
  (println (str "Hello " "World")))

(greet)
```

Running or evaluating this prints `Hello World`. The `defn` form binds the name `greet` to a function that takes no arguments (`[]`) and executes the body.

---

## Delimiters and whitespace

**Parentheses** `()` denote lists (and function/macro calls). **Square brackets** `[]` denote vectors. **Braces** `{}` denote maps. **Commas** are whitespace; Clojure ignores them but they can improve readability in maps (e.g. `{:a 1, :b 2}`).

---

## Comments

**Single-line comments** start with `;;`. Everything after `;;` on that line is ignored.

```clojure
;; This is a comment.
(+ 1 2)  ;; result is 3
```

---

## Symbols

**Symbols** are names that refer to values (e.g. functions, vars). They can contain alphanumeric characters and `*`, `+`, `!`, `/`, `.`, `:`, `-`, `_`, `?`, but must not start with a digit or colon. Keywords (e.g. `:keyword`) are distinct and often used as map keys.

---

## REPL usage

In the REPL you type a form and press Enter. The form is read, evaluated, and the result is printed. You can define functions, call them, and inspect values without leaving the REPL. The **current namespace** is shown in the prompt; you can switch namespaces or load files to evaluate code from your project. Structural editing in your editor works on the same forms the REPL evaluates.

---

## Further reading

- [Clojure — REPL](https://clojure.org/guides/repl/introduction)
- [Clojure — Structural editing](https://clojure.org/guides/structural_editing)
- [Clojure README](./README.md) — Topic index.
