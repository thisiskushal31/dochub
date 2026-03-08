# Clojure — Getting started

[← Clojure README](./README.md)

To use Clojure you need the **language and REPL** and an **editor** that supports evaluating code and **structural editing** (editing nested forms, not just characters). The standard way to run Clojure today is the **Clojure CLI** (commands `clojure` and `clj`), which can download the language and libraries. You create or open a file, connect a REPL, write code, and evaluate it in the editor; the cycle is create–connect–write–evaluate–repeat.

---

## Installing the Clojure CLI

Clojure is distributed as a JAR from Maven Central. The **Clojure CLI** is a separate tool (versioned like `1.12.0.1456`) that runs the language (e.g. `1.12.0`). The CLI can fetch Clojure and other deps; you need **Java** installed first.

**macOS (Homebrew):**

```bash
brew install clojure/tools/clojure
```

**Linux:** Install `bash`, `curl`, `rlwrap`, and Java, then run the official Linux install script to get `clj` and `clojure` in `/usr/local/bin`.

**Windows:** Use the Windows installer from the Clojure site or WSL and follow the Linux instructions.

After installation, run `clj` (or `clojure`) in a terminal to start a REPL.

---

## Editor and REPL

Use an editor that supports **Clojure** and **structural editing** (e.g. paredit-style operations on parentheses and forms). Connect the editor to a Clojure REPL so you can evaluate expressions from your source files. The REPL gives immediate feedback and lets you explore and debug without rerunning a full program.

---

## First program

A minimal Clojure program lives in a file with extension `.clj`. A namespace declaration and a function that prints a line are enough to get started.

```clojure
(ns myapp.hello
  (:gen-class))

(defn hello-world []
  (println "Hello World"))

(hello-world)
```

Save as `main.clj` (or any name). Run from the project directory with the Clojure CLI so the namespace is on the classpath, or evaluate the forms in your editor against a REPL. The program prints `Hello World`. The `defn` form defines a function; `println` prints to the console. Calling `(hello-world)` invokes that function.

---

## Project layout

A typical Clojure project has source under `src/`, with directory structure matching namespaces (e.g. `src/myapp/hello.clj` for `myapp.hello`). A `deps.edn` (or Leiningen `project.clj`) at the root declares dependencies and entry points. Topic 11 covers namespaces and project structure in detail; topic 19 covers the Deps and CLI and tools.build.

---

## Further reading

- [Clojure — Getting Started](https://clojure.org/guides/getting_started)
- [Clojure — Install Clojure](https://clojure.org/guides/install_clojure)
- [Clojure — Editors](https://clojure.org/guides/editors)
- [Clojure README](./README.md) — Topic index.
