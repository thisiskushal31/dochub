# Clojure — Strings

[← Clojure README](./README.md)

Strings in Clojure are **Java strings**: double-quoted literals, and the usual Java string API. **str** concatenates and coerces to string; **format** builds formatted strings; **clojure.string** provides split, join, trim, replace, and more. Prefer **clojure.string** and **str** for portability and clarity.

---

## Literals and str

String literals use double quotes. **str** takes any number of arguments, coerces each to string, and concatenates. **nil** becomes the empty string.

```clojure
(str "Hello" ", " "World")
;; => "Hello, World"
(str "x=" 42)
;; => "x=42"
(str nil)
;; => ""
```

---

## format

**format** uses **java.lang.String/format** (printf-style) to build strings. The first argument is a format string; the rest are values.

```clojure
(format "%.2f" 3.14159)
;; => "3.14"
(format "%s: %d" "count" 10)
;; => "count: 10"
```

---

## clojure.string

**clojure.string** provides **split**, **join**, **trim**, **triml**, **trimr**, **replace**, **replace-first**, **upper-case**, **lower-case**, **capitalize**, **reverse**, and **blank?**. Require it with an alias (e.g. **str** or **s**) to avoid shadowing **clojure.core/str**.

```clojure
(require '[clojure.string :as s])
(s/split "a,b,c" #",")
;; => ["a" "b" "c"]
(s/join " - " ["a" "b" "c"])
;; => "a - b - c"
(s/trim "  x  ")
;; => "x"
(s/replace "hello" #"l" "L")
;; => "heLLo"
```

---

## count and character access

**count** returns the number of characters. **nth** or **get** index into the string (zero-based). For character-by-character processing, **seq** on a string yields a sequence of characters.

```clojure
(count "hello")
;; => 5
(nth "hello" 1)
;; => \e
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
