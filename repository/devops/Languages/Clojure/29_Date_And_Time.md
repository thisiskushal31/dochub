# Clojure — Date and time

[← Clojure README](./README.md)

Clojure uses **Java’s** date and time APIs. **java.util.Date** represents an instant; **java.text.SimpleDateFormat** formats and parses strings. For more modern APIs, use **java.time** (Java 8+): **Instant**, **LocalDate**, **LocalDateTime**, **ZonedDateTime**, and **DateTimeFormatter**. Prefer **java.time** for new code.

---

## java.util.Date and SimpleDateFormat

**java.util.Date.** creates a **Date** for the current instant. **.toString** gives a default string. **SimpleDateFormat** formats a **Date** with a pattern string (e.g. **"yyyy-MM-dd"**, **"MM/dd/yyyy"**).

```clojure
(def dt (java.util.Date.))
(.toString dt)
;; => "Tue Mar 01 06:11:17 UTC 2016" (example)

(def fmt (java.text.SimpleDateFormat. "yyyy-MM-dd HH:mm"))
(.format fmt (java.util.Date.))
;; => "2016-03-01 06:11" (example)
```

**.parse** on a **SimpleDateFormat** parses a string into a **Date**. **SimpleDateFormat** is not thread-safe; create a new instance per use or synchronize.

---

## java.time (Java 8+)

**java.time.Instant/now** returns the current instant. **LocalDate**, **LocalDateTime**, **ZonedDateTime** represent date and time without or with zone. **DateTimeFormatter** formats and parses; use **.format** and **.parse** with the appropriate type.

```clojure
(java.time.Instant/now)
(java.time.LocalDate/now)
(java.time.LocalDateTime/now)
(def f (java.time.format.DateTimeFormatter/ofPattern "yyyy-MM-dd"))
(java.time.LocalDate/parse "2024-01-15" f)
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
