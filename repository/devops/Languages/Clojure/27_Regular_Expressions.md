# Clojure — Regular expressions

[← Clojure README](./README.md)

Clojure uses **Java’s** regular expressions. Literal regex patterns are written with **#"..."** (e.g. **#"\d+"**). **re-pattern** builds a pattern from a string; **re-find**, **re-matches**, and **re-seq** perform matching; **clojure.string/replace** and **replace-first** take patterns. Escape in **#"..."** with backslash; in strings, double the backslash for the regex engine.

---

## Literal patterns and re-pattern

**#"pattern"** is a **java.util.regex.Pattern**. **re-pattern** builds a pattern from a string (useful when the pattern is dynamic).

```clojure
#"\d+"
;; digits, one or more
(re-pattern "\\d+")
;; same, from string (backslash escaped in string)
```

---

## re-find, re-matches, re-seq

**re-find** returns the first match (string or groups) or **nil**. **re-matches** returns the full match if the whole string matches, else **nil**. **re-seq** returns a lazy sequence of all matches (each match is the full match or a vector of groups).

```clojure
(re-find #"\d+" "abc123def")
;; => "123"
(re-matches #"\\d+" "123")
;; => "123"
(re-seq #"\d+" "a1b22c333")
;; => ("1" "22" "333")
```

---

## replace and replace-first

**clojure.string/replace** replaces every match; **replace-first** replaces only the first. The replacement can be a string (use **$1**, **$2** for groups) or a function that receives the match and groups.

```clojure
(require '[clojure.string :as s])
(s/replace "hello world" #"\w+" "X")
;; => "X X"
(s/replace-first "hello world" #"hello" "Hi")
;; => "Hi world"
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
