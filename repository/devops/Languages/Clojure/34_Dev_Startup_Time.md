# Clojure — Dev startup time

[← Clojure README](./README.md)

Clojure loads and compiles namespaces at startup. Large dependency sets or many **require**s can make REPL and process startup slow. **Precompiling** namespaces with **compile** writes **.class** files so that the next **require** loads them from disk instead of compiling from source. Use a **:dev** alias that includes the **classes** directory and run **compile** on the namespaces you load at startup to improve development startup time.

---

## compile

**compile** takes a namespace symbol and compiles that namespace and every namespace it **require**s into **\*compile-path\*** (default **classes**). The **classes** directory must exist and be on the classpath. After that, **require** of those namespaces will load the **.class** files instead of compiling **.clj** source (unless the source is newer).

```clojure
(compile 'myapp.core)
;; writes .class files to classes/
```

Recompile when you add dependencies or change code. Compilation is a side effect of loading; already-loaded namespaces are not recompiled by **compile** until they are reloaded.

---

## deps.edn dev alias

Add **classes** to **:extra-paths** in a development alias so the JVM can load the compiled classes. Create the **classes** directory (e.g. in the project root) and keep it in version control as an empty directory; do not commit **.class** files.

```clojure
{:paths ["src"]
 :aliases {:dev {:extra-paths ["classes"]}}}
```

Start the REPL with **clj -A:dev** and run **(compile 'myapp.core)** (or your main entry namespace) once. Subsequent REPL starts will be faster if you precompile before exiting or in a script.

---

## user.clj and reload

If you use **user.clj** (loaded automatically), you can force recompilation by reloading with **\*compile-files\*** bound to true.

```clojure
(binding [*compile-files* true]
  (require 'user :reload-all))
```

This recompiles **user** and all namespaces it requires, writing updated **.class** files. Use it when you want to refresh compiled code without restarting the process.

---

## Further reading

- [Clojure — Improving dev startup time](https://clojure.org/guides/dev_startup_time)
- [Clojure README](./README.md) — Topic index.
