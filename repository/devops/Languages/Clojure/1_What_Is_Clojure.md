# Clojure — What is Clojure?

[← Clojure README](./README.md)

Clojure is a **high-level, dynamic, functional programming language** that runs on the **JVM** (and the .NET runtime via ClojureCLR). It is designed around **Lisp** ideas: a small language core, minimal syntax, and powerful macros so you can shape the language to your design. Code is expressed as **data structures** (lists, vectors, maps) that are then evaluated; this **homoiconicity** makes metaprogramming and tooling natural.

Clojure emphasizes **immutability**: data structures are persistent and immutable by default, so you avoid in-place mutation and many classes of bugs. The language also provides **managed state** and **concurrency** primitives (atoms, refs, agents, vars) so you can handle mutable state safely when needed. It **embraces the host**: on the JVM you get full access to the Java ecosystem and libraries while writing idiomatic Clojure.

---

## Why Clojure in practice

- **Functional style:** Functions are first-class; you compose and pass them. Recursion and higher-order functions are central.
- **Data-oriented:** Represent domain logic as data (maps, vectors, keywords). Transform data with pure functions.
- **Concurrency:** Immutable data makes sharing safe. Reference types (atoms, refs, agents) coordinate change with clear semantics.
- **JVM interop:** Call Java from Clojure and use existing JVM libraries and deployment (JARs, containers, ops tooling).
- **REPL-driven development:** Run and evaluate code interactively; grow programs incrementally with immediate feedback.

---

## Where Clojure is used

Clojure appears in **data pipelines**, **backend services**, **APIs**, and **internal tooling** in JVM-heavy environments. It is less common in mainstream DevOps than Python or Go but is relevant when you operate, debug, or audit systems written in Clojure—or when you choose it for data processing and services where immutability and expressiveness matter.

---

## Further reading

- [Clojure documentation](https://clojure.org/documentation)
- [Clojure README](./README.md) — Topic index.
