# Clojure — Java interop and deployment

[← Clojure README](./README.md)

Clojure runs on the **JVM** and can call **Java** code and use **Java libraries** directly. You create instances with **ClassName.**, call methods with **(.method instance args)** or **(. instance method args)**, and access static members with **ClassName/field** or **ClassName/staticMethod**. Deployment is typically a **JAR** or **uberjar** (all deps included) run with `java -jar` or via a container.

---

## Calling Java

**(.method object arg1 arg2)** invokes an instance method. **(. object method arg1 arg2)** is equivalent. For static methods use **ClassName/staticMethod**. **new** creates an instance: **(ClassName. args)** or **(new ClassName args)**.

```clojure
(.toUpperCase "hello")
;; => "HELLO"
(Math/sqrt 16)
;; => 4.0
(new java.util.ArrayList 10)
(java.util.ArrayList. 10)
```

**doto** threads a value through several method calls (for side effects) and returns the same object. **..** is a macro for chained method calls (e.g. **(.. obj (method1) (method2))**).

---

## Type hints and performance

**Type hints** (e.g. **^String**, **^long**) help the compiler avoid reflection when calling Java. Use them on parameters and returns for hot paths. **set!** on a field of a Java object is possible for mutable Java objects; prefer Clojure’s reference types for Clojure-managed state.

---

## Deployment

**deps.edn** and the Clojure CLI support **:main** and **:exec-fn** to run a namespace or function. **pack** or **tools.build** can produce an **uberjar** that bundles Clojure and dependencies; run with `java -jar app.jar`. **Leiningen** has **lein uberjar** and **lein run**. In CI/CD, build the JAR in a repeatable environment and run it with a fixed JVM version; set **JVM_OPTS** or **JAVA_OPTS** for heap and other settings.

---

## Further reading

- [Clojure — Java interop](https://clojure.org/reference/java_interop)
- [Clojure — Deps and CLI](https://clojure.org/guides/deps_and_cli)
- [Clojure README](./README.md) — Topic index.
