# Enumerable, iteration, and pattern matching

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby traverses and transforms collections: the **Enumerable** protocol, **enumerators**, **lazy** pipelines, and **pattern matching** (`case/in`, hash/array patterns). This is the idiomatic core of data processing in scripts, tests, and cookbook helpers—and the foundation of many stdlib and gem APIs.

---

## 1. Concepts

### 1. The Enumerable contract

**Enumerable** is a module mixed into classes that implement **`each`**. Once `each` exists, you gain dozens of methods: `map`, `select`, `reject`, `grep`, `reduce` (also `inject`), `any?`, `all?`, `none?`, `find`, `group_by`, `sort_by`, `flat_map`, `zip`, and more.

```ruby
[1, 2, 3].map { |n| n * 2 }           # => [2, 4, 6]
(1..5).select(&:odd?)                 # => [1, 3, 5]
%w[a b c].grep(/[ab]/)                # => ["a", "b"]
```

**`&:` shorthand** (`&:sym`) passes `symbol` as a block that calls that method on each element—clear for simple transforms, opaque when chained deeply.

### 2. `each` with index

`each_with_index` yields element and index. For hashes, `each` yields key-value pairs; `each_key`, `each_value` specialize.

### 3. Reduction and accumulation

`reduce(initial) { |memo, x| ... }` folds a collection. Omit the initial value to use the first element as seed (empty collection then raises).

```ruby
[10, 20, 30].reduce(0) { |sum, n| sum + n }  # => 60
```

### 4. `Enumerator` and external iteration

Calling `enum = arr.each` without a block returns an **Enumerator**. Enumerators support **external** control:

```ruby
e = [1, 2, 3].each
e.next    # => 1
e.next    # => 2
```

Useful for paginated APIs, coroutine-style consumption, and chaining via `Enumerator::Chain`.

### 5. Lazy enumerables

**`lazy`** defers work until values are pulled—essential for large or infinite sequences:

```ruby
(1..Float::INFINITY).lazy
  .select(&:odd?)
  .map { |n| n * 3 }
  .first(5)
```

Without `lazy`, a huge intermediate array might be allocated.

### 6. `grep` and `all?` / `any?`

`grep(pattern)` filters with `===` (regex, range, class). Predicate methods short-circuit when possible.

### 7. Sorting

`sort` requires `<=>` or a block. `sort_by { |x| x.cost }` is Schwartzian-style sort key extraction—clear and often faster than heavy `<=>` on complex objects.

### 8. Pattern matching overview (Ruby 2.7+)

Pattern matching finds structure in values. **`case value; in pattern; ...`** binds variables when the pattern matches.

**Array patterns:**

```ruby
case [1, 2, 3]
in [first, second, third]
  "#{first}, #{second}, #{third}"
end
```

**Hash patterns:**

```ruby
case { status: 200, body: 'ok' }
in { status: 200, body: }
  body
end
```

**Pinning** uses `^` to match against existing variables:

```ruby
x = 1
case [1, 2]
in [^x, _]
  'x was 1'
end
```

**Alternation** and **guards** (`if condition` after pattern) add expressiveness for parsers and routers.

### 9. One-line pattern matching: `=>`

Rightward assignment can destructure in one line:

```ruby
{ status:, body: } => response
```

Use when it improves clarity; avoid obscuring control flow in large methods.

---

## 2. Advanced concepts

### 1. Custom Enumerable objects

Implement `each` and `include Enumerable` to gain the whole toolkit. Yield via `yield` or return an Enumerator when no block given (Enumerator.from_method in modern Ruby).

### 2. `flat_map`

Maps then flattens one level—ideal when each element expands to zero or more items. Deeper nesting needs another `flat_map` or explicit flatten with depth.

### 3. `chunk` and `slice_when`

`chunk` splits by criterion changes (runs). `slice_when` groups adjacent elements by a binary predicate—useful for log sessionization.

### 4. Pattern matching exhaustiveness

Ruby does not enforce exhaustiveness at compile time. Unhandled shapes fall through or hit `else`. In critical parsers, add explicit `else` that raises or logs.

### 5. `in` vs `===` in `case when`

Classic `when` uses `===`; pattern `in` uses separate rules. Do not mix mental models in one `case` without care.

### 6. Performance notes

Chained `map` + `select` allocates intermediate arrays; one loop or `filter_map` (if available via ActiveSupport or manual loop) may win on huge data. Profile before micro-optimizing; clarity first.

### 7. Pattern matching on arrays and hashes (deeper)

```ruby
case event
in { type: 'order', id:, items: [{ sku:, qty: }] }
  process_line(sku, qty)
in { type: 'cancel', id: }
  cancel(id)
else
  raise UnknownEvent, event.inspect
end
```

**Pinning** (`^existing`) prevents rebinding outer variables. **Guards** (`in x if x.valid?`) filter after shape match.

### 8. `grep` and `chunk_by` analytics

`grep(/^ERROR/)` uses `===`—Regexp matches line. `chunk`/`slice_when` build session windows for metrics (“burst of errors after deploy”).

### 9. `each_with_object` for reducers

```ruby
counts = items.each_with_object(Hash.new(0)) { |i, h| h[i.category] += 1 }
```

Clearer than manual `inject` for hash aggregation in many cases.

### 10. External iterators and backpressure

`Enumerator` + `yielder` patterns implement pipelines; pair with **`lazy`** so consumers pull work—important for memory when producer is infinite (Kafka-style loops).

---

## 3. Applications and use cases

### Software engineering and data pipelines

- Prefer **`each`** return values consciously—`map` builds arrays; `each` returns the original collection.
- Use **`lazy`** for log tailing, CSV streaming, and large DB `find_each` batches (ActiveRecord).
- Replace nested `if` + `is_a?` with **`case/in`** for wire-format parsing at boundaries.
- **ETL:** `group_by` then transform values—document key stability for downstream joins.

### Web and API layers

- Serialize ActiveRecord relations with `map` only after scope limits columns—avoid accidental full table load.
- Pagination: never `map` million rows—SQL `LIMIT` first.

### Reliability and observability

### Security

- Pattern match on **allowed** structures, not only “known bad”—whitelist shapes for webhooks and agent messages.
- Do not pattern-match on secrets; bind and compare with constant-time helpers separately.

### DevOps data processing

```ruby
lines = File.foreach('/var/log/app.log').lazy
lines.grep(/ERROR/)
     .take(100)
     .force
     .each { |line| warn line }
```

Group metrics by host:

```ruby
events.group_by { |e| e[:host] }.transform_values(&:size)
```

### Staff-level review checklist

- Enumerable chains have bounded memory (lazy or early `break`).
- Pattern matching branches cover failure/`else` paths.
- `&:method` chains stay readable or are refactored to named blocks.
- Hash pattern keys document required vs optional fields for API versions.

---

## References

- [module Enumerable](https://docs.ruby-lang.org/en/3.4/Enumerable.html)
- [class Enumerator](https://docs.ruby-lang.org/en/3.4/Enumerator.html)
- [class Array](https://docs.ruby-lang.org/en/3.4/Array.html)
- [Syntax: Pattern Matching](https://docs.ruby-lang.org/en/3.4/syntax/pattern_matching_rdoc.html)
- [class Range](https://docs.ruby-lang.org/en/3.4/Range.html)
