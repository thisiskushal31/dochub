# Clojure — Namespaces and project structure

[← Clojure README](./README.md)

**Namespaces** group **vars** (functions and global bindings) and provide a logical boundary between parts of a program. Each file typically declares one namespace with **ns**; the namespace name usually matches the **file path** (e.g. `myapp.core` in `src/myapp/core.clj`). You **require** or **use** other namespaces to refer to their symbols.

---

## Declaring a namespace

**ns** is at the top of a file. It sets the current namespace and can load other namespaces or refer Java classes.

```clojure
(ns myapp.core
  (:require [clojure.string :as str])
  (:require [myapp.utils :refer [helper-fn]]))
```

**:require** loads a namespace; **:as** gives an alias (e.g. **str/join**). **:refer** pulls in specific symbols so you can call them without a prefix. **:gen-class** is used when you need to generate a Java class (e.g. for an entry point).

---

## require and use

**require** loads a namespace if not already loaded; **use** loads and refers all public vars (use sparingly to avoid name clashes). In code you can **require** with alias or refer at runtime:

```clojure
(require '[clojure.string :as str])
(str/join ", " ["a" "b" "c"])
;; => "a, b, c"
```

---

## Current namespace and *ns*

The **var** **\*ns\*** holds the current namespace. In the REPL the prompt often shows it. **in-ns** switches the current namespace; **create-ns** creates one without switching.

---

## Project layout

A typical project has **src/** with one directory per namespace segment. Example: `src/myapp/core.clj` and `src/myapp/utils.clj` for `myapp.core` and `myapp.utils`. A **deps.edn** at the root lists **:paths** (e.g. `["src"]`) and **:deps** (library coordinates). The Clojure CLI uses **deps.edn** to resolve and run code. **Leiningen** uses **project.clj** and a similar layout. Topic 19 covers Deps and CLI and tools.build in detail.

---

## Further reading

- [Clojure — Deps and CLI](https://clojure.org/guides/deps_and_cli)
- [Clojure README](./README.md) — Topic index.
