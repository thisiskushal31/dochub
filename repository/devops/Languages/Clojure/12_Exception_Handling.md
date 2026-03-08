# Clojure — Exception handling

[← Clojure README](./README.md)

Clojure runs on the JVM and uses **Java’s exception system**. You can **throw** exceptions and **catch** them with **try** and **catch**. Prefer **ex-info** and **ex-data** for structured errors: throw a map with details and catch by type or data so callers can handle failures without parsing messages.

---

## try, catch, finally

**try** wraps one or more expressions. **catch** clauses specify an exception type and a binding; the body runs when that type is thrown. **finally** runs after the try (and any catch), for cleanup. The value of the try is the last expression in the try body or in the matching catch.

```clojure
(try
  (/ 1 0)
  (catch ArithmeticException e
    (println "Division error")
    :error)
  (finally
    (println "cleanup")))
```

---

## throw and ex-info

**throw** throws any Throwable. **ex-info** builds an **IExceptionInfo** (a message, a map of data, and an optional cause). **ex-data** returns that map from an exception. This gives a consistent way to attach and read structured error data.

```clojure
(throw (ex-info "Invalid input" {:value 42 :reason :out-of-range}))
```

In a catch:

```clojure
(try
  (some-fn that-might-throw)
  (catch Exception e
    (when (ex-data e)
      (println "Data:" (ex-data e)))
    (throw e)))
```

---

## Avoid swallowing exceptions

Catch only what you can handle; rethrow or wrap otherwise. Log or record before rethrowing so failures are visible. In libraries, prefer **ex-info** and document the keys in **ex-data** so callers can react programmatically.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
