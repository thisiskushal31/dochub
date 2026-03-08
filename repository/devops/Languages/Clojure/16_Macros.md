# Clojure — Macros and code as data

[← Clojure README](./README.md)

Clojure is **homoiconic**: code is data (lists, vectors, symbols). **Macros** are functions that run at **compile time** and transform **code** (data structures) into other code before evaluation. They let you add new constructs or remove boilerplate without changing the runtime. **defmacro** defines a macro; you typically use **syntax-quote** (**`**), **unquote** (**~**), and **unquote-splicing** (**~@**) to build the output form.

---

## Why macros

Macros receive **unevaluated** arguments (as data). So you can implement control flow (e.g. **when**, **cond**), domain-specific syntax, or code generators. Use macros when a **function cannot do the job** (e.g. you need to avoid evaluating an argument or to change evaluation order). Prefer functions when they suffice.

---

## defmacro and expansion

A macro takes arguments (often unevaluated forms) and returns a **form** that the compiler then compiles and evaluates. The **macroexpand** and **macroexpand-1** functions show the result of expansion; use them to debug macros.

```clojure
(defmacro my-when [test & body]
  (list 'if test (cons 'do body)))

(macroexpand-1 '(my-when (pos? x) (println x)))
;; => (if (pos? x) (do (println x)))
```

---

## Syntax quote and unquote

**`** (syntax-quote) quotes a form but resolves symbols in the current namespace and allows **~** (unquote) to insert values. **~@** splices a sequence into the surrounding list. This avoids manual list construction and preserves namespace context.

```clojure
(defmacro my-and [x y]
  `(let [x# ~x]
     (if x# ~y x#)))
```

**x#** is a **gensym** (unique symbol) to avoid name capture.

---

## Hygiene and gensym

Macros must avoid **capturing** names from the call site. Use **gensym** (or the **#** suffix in syntax-quote) to generate unique symbols so variables introduced by the macro do not clash with user code.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
