# Core types: strings, collections, symbols, and time

[← Back to Ruby](./README.md)

## What this chapter covers

The built-in types you touch in every script: **String**, **Symbol**, **Array**, **Hash**, **Range**, **Regexp**, numeric types, and **Time**. How they behave (mutable vs frozen, key equality, encoding), how indexing and slicing work, and how mistakes at these boundaries cause production bugs in automation, APIs, and cookbooks.

---

## 1. Concepts

### 1. Strings: mutable text with encoding

A **String** is a sequence of bytes interpreted through an **encoding** (usually UTF-8). Strings are **mutable** unless frozen:

```ruby
s = 'hello'
s << ' world'   # mutates s
s.freeze        # subsequent mutation raises FrozenError
```

**Indexing** uses zero-based integers; negative indices count from the end. **Slices** `s[0, 3]` or `s[0..2]` return substrings or `nil` when out of range.

Common operations:

| Need | Typical methods |
|------|-----------------|
| Trim whitespace | `strip`, `lstrip`, `rstrip` |
| Case | `upcase`, `downcase`, `capitalize` |
| Split/join | `split`, `join` |
| Replace | `sub`, `gsub`, `tr` |
| Prefix/suffix | `start_with?`, `end_with?` |
| Encoding | `encoding`, `force_encoding`, `encode` |

Double-quoted strings support **interpolation** `"#{expr}"` and escapes; single-quoted strings only allow limited escapes.

### 2. Encoding discipline

Every string has an encoding object. **Binary** strings (`ASCII-8BIT`) often hold raw bytes (network, files). Converting without care produces mojibake or `Encoding::InvalidByteSequenceError`.

Rules of thumb:

- Standardize **UTF-8** for source, logs, and JSON.
- Read files with explicit encoding when not UTF-8.
- Never call `force_encoding` to “fix” bad data—transcode with `encode` and valid error handling.

### 3. Symbols: immutable names

**Symbols** (`:name`) are interned, immutable identifiers. They are used for hash keys, method names, and DSL attributes. Symbols are not strings; convert deliberately with `to_s` / `to_sym`.

Two hashes that compare equal as data may differ if one uses string keys and the other symbols:

```ruby
{ 'port' => 443 } == { port: 443 }   # => false
```

Pick one key style per boundary (config in, API out) and stick to it.

### 4. Arrays: ordered sequences

**Arrays** are ordered, integer-indexed, mutable collections. Literals `[1, 2, 3]`; negative indices count from end.

| Operation | Method |
|-----------|--------|
| Append | `<<`, `push` |
| Pop/shift | `pop`, `shift`, `unshift` |
| Length | `length`, `size`, `empty?` |
| Membership | `include?` |
| Set-like | `|`, `&`, `-` (union, intersection, difference) |

**`%w` and `%i`** build word/symbol arrays from a single quoted chunk (chapter 02).

### 5. Hashes: key-value maps

**Hashes** preserve **insertion order** (since Ruby 1.9+). Keys use `hash` and `eql?` for buckets; `Hash` with mutable keys is possible but discouraged.

Modern literal syntax:

```ruby
config = { host: 'db.internal', port: 5432 }
config[:port]          # => 5432
config.fetch(:timeout, 30)
```

`fetch` raises `KeyError` or returns default—prefer it over `[]` when missing keys are exceptional.

**Default procs** (`Hash.new { |h, k| h[k] = [] }`) auto-vivify nested structures; powerful and easy to leak memory if keys are unbounded.

### 6. Ranges

**Ranges** represent intervals: `1..10` inclusive end, `1...10` exclusive end. Useful for slicing and `case` with `===`. Ranges are objects; they can be iterated with `each`.

### 7. Regexp and MatchData

**Regexp** objects match patterns; `=~` returns index or `nil`; `match` returns **MatchData** with captures:

```ruby
m = 'error: disk full'.match(/(\w+):\s*(.+)/)
m[1]  # => "error"
m[2]  # => "disk full"
```

Use **anchored** patterns when validating whole strings (`\A`, `\z`). Escape user input with `Regexp.escape` when building patterns dynamically.

### 8. Numbers: Integer and Float

**Integer** is arbitrary precision. **Float** is IEEE binary floating point—same rounding surprises as other languages. Use **Rational** (`1/3r`) or **BigDecimal** (stdlib gem) for decimal semantics that matter financially.

### 9. Time and timezone

**`Time`** represents a moment with timezone offset. **`Time.now`** is local wall clock; **`Time.utc`** is UTC. For serious calendar math and zones, use the **`time`** library’s `Date` / `DateTime` or community gems—but many ops scripts use `Time` with explicit `utc`.

Always log **UTC** in distributed systems; convert for display only.

### 10. `nil`, `true`, `false`

**`nil`** is the absence of an object reference. **`true`** and **`false`** are the only falsey values in conditionals. Methods like `nil?`, `empty?`, and `zero?` make intent explicit.

---

## 2. Advanced concepts

### 1. String frozen literal pragma

`# frozen_string_literal: true` at file top freezes string literals in that file. Reduces allocation and accidental mutation; some gems rely on it in hot paths.

### 2. `String#b` and binary data

Calling `b` on a string re-tags it as ASCII-8BIT for binary I/O. Common when reading sockets or files before decoding.

### 3. Array copy semantics

Assignment copies **references**, not deep clones:

```ruby
a = [[]]
b = a.dup        # shallow: inner arrays shared
c = a.map(&:dup) # one level deeper if needed
```

For deep structures use `Marshal.load(Marshal.dump(obj))` only with trusted data (chapter 20)—not for arbitrary objects.

### 4. Hash equality and default values

`Hash#default` and `default_proc` run on missing keys—surprising when `key?` vs `[]` differ. Prefer `fetch` and explicit initialization in security-sensitive code.

### 5. `Comparable` and sorting

Objects including **Comparable** and defining `<=>` gain comparison methods. Sort blocks: `list.sort { |a, b| a.name <=> b.name }`. Stable sort is guaranteed in modern Ruby.

### 6. `object_id` and identity

Every object has an identity. `equal?` checks identity; `==` is usually value. Caching hashes must implement `hash` and `eql?` consistently with `==`.

### 7. Algorithmic cost (Big-O intuition)

| Operation | Array | Hash |
|-----------|-------|------|
| Index / key lookup | O(1) | O(1) average |
| Append / insert at end | O(1) amortized | — |
| Insert at front | O(n) | — |
| Membership scan | O(n) | O(1) average |

Large in-memory collections dominate RAM. Streaming (`each_line`, `CSV.foreach`, lazy enumerators in chapter 06) beats `read` + `split` for multi-gigabyte inputs.

### 8. Immutability patterns

- **`frozen_string_literal: true`** at file top freezes string literals in that compilation unit.
- **`#freeze`** on objects used as hash keys or shared constants.
- **`Data.define`** / frozen `Struct` for value objects—mutation bugs disappear when the type cannot change.

### 9. Time zones and bounded contexts

Wall-clock time without zone is a recurring production bug. Pick one rule per system:

- **Store UTC**, display in local zone at UI.
- Use **`Time.utc`** or `Time.zone` (ActiveSupport) consistently—never mix bare `Time.now` and UTC in the same persistence layer.

---

## 3. Applications and use cases

### Software engineering and data modeling

- Normalize **string keys** from JSON/YAML at the API boundary; pick `string` or `symbol` keys per layer and convert once.
- Use **`fetch`** for required configuration; `[]` only when absence is valid.
- **DTOs:** separate wire format (strings) from domain types (value objects, integers with units).
- **Pagination:** do not load unbounded `Array` of ORM rows—use `find_each` / cursors / `LIMIT`.

### Performance and cost

- Profile before micro-optimizing; replacing `Array` with custom C extensions is rarely step one.
- **Symbol table** growth in very long-running processes with dynamic `:"user_#{id}"`—prefer strings for unbounded dynamic labels.

### Security engineering

- Do not build regex from raw user input without escaping.
- Treat strings from external systems as **untrusted** for command construction.
- Compare secrets with `secure_compare` patterns (OpenSSL stdlib) when available—not raw `==` on tokens in timing-sensitive paths.

### DevOps and Chef

Node attributes are often **strings** after YAML/JSON round trips even when recipes used symbols. Defensive cookbooks normalize:

```ruby
port = node['app']['port'].to_i
enabled = ActiveModel::Type::Boolean.new.cast(node['app']['enabled'])
```

(Framework helpers vary; the lesson is: **coerce at the boundary**.)

### Staff-level review checklist

- Encoding is explicit for file and network I/O.
- Hash keys are consistent (string vs symbol policy).
- No silent `nil` from `[]` on required config—use `fetch` or validation.
- Time logged in UTC with zone documented for humans.
- Floats not used for money or version ordering without formatting rules.

---

## References

- [class String](https://docs.ruby-lang.org/en/3.4/String.html)
- [class Symbol](https://docs.ruby-lang.org/en/3.4/Symbol.html)
- [class Array](https://docs.ruby-lang.org/en/3.4/Array.html)
- [class Hash](https://docs.ruby-lang.org/en/3.4/Hash.html)
- [class Range](https://docs.ruby-lang.org/en/3.4/Range.html)
- [class Regexp](https://docs.ruby-lang.org/en/3.4/Regexp.html)
- [class MatchData](https://docs.ruby-lang.org/en/3.4/MatchData.html)
- [class Time](https://docs.ruby-lang.org/en/3.4/Time.html)
- [class Encoding](https://docs.ruby-lang.org/en/3.4/Encoding.html)
- [class Integer](https://docs.ruby-lang.org/en/3.4/Integer.html)
- [class Float](https://docs.ruby-lang.org/en/3.4/Float.html)
