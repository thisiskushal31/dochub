# Clojure — Tools: Deps and CLI, tools.build

[← Clojure README](./README.md)

The **Clojure CLI** (commands **clojure** and **clj**) uses **deps.edn** to resolve dependencies and run code. **deps.edn** lists **:paths** (source roots) and **:deps** (library coordinates). **tools.build** is a library for writing **build scripts** in Clojure: compile, run tests, and produce JARs or uberjars. Together they replace or complement Leiningen for many projects.

---

## deps.edn layout

A minimal **deps.edn** has **:paths** (e.g. **["src"]**) and optionally **:deps** (a map of lib name to version). **:aliases** define extra paths or deps (e.g. **:test** adds **test** path and test deps). **-M:alias** or **-X:alias** run with that alias.

```clojure
{:paths ["src"]
 :deps {org.clojure/clojure {:mvn/version "1.12.0"}}
 :aliases {:test {:extra-paths ["test"]
                  :extra-deps {}}}}
```

---

## Running code

**clj -M** runs the **:main** namespace from deps.edn, or **clj -M:alias** uses that alias. **clj -e "(expr)"** evaluates an expression. **clj -A:alias** adds alias deps and paths. The **-X** and **-T** modes run a function by name (e.g. **-X:build jar** for a build task).

---

## tools.build

**tools.build** provides tasks such as **compile**, **jar**, **uber**, **install**, and **deploy**. You write a **build.clj** that requires **clojure.tools.build** and defines a **-X** or **-T** function (e.g. **jar**, **uber**) that invokes the build API. Use it to produce an **uberjar** for deployment or to run tests in a controlled environment.

---

## Further reading

- [Clojure — Deps and CLI](https://clojure.org/guides/deps_and_cli)
- [Clojure — tools.build](https://clojure.org/guides/tools_build)
- [Clojure README](./README.md) — Topic index.
