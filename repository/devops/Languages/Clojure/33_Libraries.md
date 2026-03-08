# Clojure — Libraries

[← Clojure README](./README.md)

Clojure code is distributed as **libraries** (JARs) identified by **group/artifact** and version. You declare dependencies in **deps.edn** (**:deps**) or **Leiningen** (**project.clj**); the tool resolves and downloads them. **require** or **use** loads a library’s namespaces. The Clojure ecosystem includes data formats (JSON, XML, CSV), HTTP clients, database drivers, and many domain-specific libraries.

---

## Adding dependencies

In **deps.edn**, add a map under **:deps**. The key is a symbol **org.clojure/clojure** or **com.example/lib**; the value is **{:mvn/version "1.0.0"}** for Maven Central (or **:git/url** and **:sha** for Git deps).

```clojure
{:deps {org.clojure/clojure {:mvn/version "1.12.0"}
        org.clojure/data.json {:mvn/version "2.4.0"}
        clj-http {:mvn/version "3.12.2"}}}
```

The CLI (and Leiningen) resolve and download artifacts. **:aliases** can add **:extra-deps** for dev or test only.

---

## Requiring namespaces

**require** loads a namespace; **:as** gives an alias; **:refer** brings in symbols. Use **require** in **ns** or at the REPL. After that, call **alias/symbol** or **referred-symbol** as needed.

```clojure
(require '[clojure.data.json :as json])
(json/read-str "{\"a\":1}")
;; => {"a" 1}

(require '[clojure.string :refer [split join]])
(split "a,b,c" #",")
;; => ["a" "b" "c"]
```

---

## Common libraries

**clojure.data.json** — JSON read/write. **clojure.data.xml** — XML parse/emit. **clojure.data.csv** — CSV. **clojure.java.jdbc** / **next.jdbc** — JDBC. **clj-http**, **hato** — HTTP client. **ring**, **compojure**, **reitit** — web. **integrant**, **mount** — component/state lifecycle. Check **clojars.org** and **github.com/clojure** for official and community libraries.

---

## Further reading

- [Clojure — Deps and CLI](https://clojure.org/guides/deps_and_cli)
- [Clojars](https://clojars.org)
- [Clojure README](./README.md) — Topic index.
