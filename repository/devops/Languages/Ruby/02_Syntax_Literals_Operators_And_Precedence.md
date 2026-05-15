# Syntax, literals, operators, and precedence

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby source is built from **literals**, **operators**, and **assignment**; how **truthiness** works; how **precedence** and **parentheses** change meaning; and how **symbols**, **strings**, and **percent literals** show up in real automation and DSL code. This is the vocabulary layer: without it, recipes, Vagrantfiles, and gem code look like opaque punctuation.

---

## 1. Concepts

### 1. Comments and readability

Line comments start with `#` and run to end of line. Ruby has no block comment syntax; teams use `#` per line or extract code into methods/modules when a section needs explanation.

Executable code and comments can share a line only when the comment follows code. Style guides often require a space after `#` for readability in reviews.

### 2. Truthiness and conditional tests

Only **`nil`** and **`false`** are false in conditionals. **Everything else is true**, including `0`, empty strings `""`, and empty arrays `[]`. This differs from languages that treat zero or empty collections as false.

Implications:

- Use **explicit** comparisons when the type matters: `if x.nil?`, `if s.empty?`, `if n.zero?`.
- Do not assume `if user_input` means “user provided a non-empty string.”

### 3. Numeric literals

**Integers** may use underscores for readability: `1_000_000` equals `1000000`. Bases are written with prefixes:

| Prefix | Base |
|--------|------|
| `0d` or none (decimal style) | Decimal |
| `0x` / `0X` | Hexadecimal |
| `0`, `0o`, `0O` | Octal |
| `0b`, `0B` | Binary |

**Floats** use `.` and optional exponent: `12.34`, `1.234e-2`. Underscores are allowed in floats as well.

**Rational** literals end with `r`: `2/3r` → `Rational(2, 3)`. The fraction is reduced when possible. Mixing float and rational without care changes type: `1.2/3r` is float division, not a rational result.

**Complex** literals use `i` (after any `r` suffix if present): `1i`, `2+3i`, `12.3ri`.

### 4. String literals and encoding

Single-quoted strings `'like this'` do minimal processing: `\'` and `\\` are the main escapes.

Double-quoted strings `"like this"` support **interpolation** `#{}` and more escapes (`\n`, `\t`, Unicode escapes in modern Ruby).

**Frozen string** pragma at file top:

```ruby
# frozen_string_literal: true
```

makes string literals in that file frozen (immutable), which reduces accidental mutation and can help performance in long-running processes.

**Heredocs** delimit multiline strings:

```ruby
message = <<~EOF
  line one
  line two
EOF
```

`<<~` strips leading whitespace common in indented source. Heredocs are common in embedded templates and test fixtures.

### 5. Symbols

A **symbol** is an immutable, interned name, written `:name` or `:"dynamic#{id}"`. Symbols are used heavily for **hash keys**, **method names**, and **DSL attributes** (Chef property names, metadata keys).

`"string".to_sym` and `:sym.to_s` convert between string and symbol. Prefer symbols for fixed internal keys; use strings for user-facing or serialized data unless your API standardizes symbols.

### 6. Array, hash, and range literals

**Arrays:** `[1, 2, 3]`, trailing commas allowed.

**Hashes:** `{ a: 1, b: 2 }` is shorthand for `{ :a => 1, :b => 2 }` when keys are symbols. Mixed key types are allowed but confuse readers.

**Ranges:** `1..10` is inclusive; `1...10` excludes the end value. Ranges are objects; they often appear in slicing and iteration.

### 7. Regexp literals

`/pattern/` and `/pattern/i` create **Regexp** objects. `%r{...}` avoids escaping slashes in paths. Match data `$~` and `Regexp.last_match` are global-adjacent; prefer explicit match objects in new code.

### 8. Percent literals (`%q`, `%w`, `%i`, …)

Percent notation builds strings, arrays, symbols, regexps, or backtick strings without heavy quoting:

| Form | Meaning |
|------|---------|
| `%q(...)` | Non-interpolating string (like single quotes) |
| `%Q(...)` or `%(...)` | Interpolating string |
| `%w(...)` | Whitespace-separated word array |
| `%i(...)` | Whitespace-separated symbol array |
| `%r(...)` | Regexp |
| `%x(...)` | Backtick command (use with extreme care in production) |

Example for flag lists in automation:

```ruby
FLAGS = %w[--verbose --dry-run]
```

### 9. Operators you will see daily

**Arithmetic:** `+ - * / ** %`

**Comparison:** `== != < > <= >=` — `==` calls `==` method; structural equality may differ from identity.

**Identity:** `equal?` is same object id; `eql?` is hash/equality contract; `==` is usually what humans mean for value.

**Spaceship:** `<=>` returns `-1`, `0`, `1`, or `nil` if incomparable; powers `Comparable` and sorting.

**Boolean logic:** `&&`, `||`, `!` — both operands are evaluated unless short-circuit skips the right side.

**Assignment:** `=`, combined `+=`, `-=`, etc., and parallel assignment `a, b = 1, 2`.

**Match operators:** `=~` and `!~` for regex; Ruby 2.7+ also has **pattern matching** `in` (chapter 06).

### 10. Precedence and parentheses

Ruby parses expressions by **operator precedence**. When in doubt, use parentheses—especially for:

- mixing `&&` and `||`
- string interpolation with ternary: `"#{cond ? a : b}"`
- ranges with logical operators

Unary operators, method calls, and blocks bind in ways that surprise newcomers; if a line has more than two operator types, split it or parenthesize.

### 11. Assignment and variables

Local variables: `name`. Instance variables: `@name`. Class variables: `@@name` (discouraged in new code). Global variables: `$name` (avoid except framework globals like `$LOAD_PATH`).

**Parallel assignment** unpacks arrays and swaps without temporaries:

```ruby
a, b = b, a
first, *rest = [1, 2, 3]
```

**Safe navigation** `&.` calls a method only if the receiver is not `nil`: `user&.email`.

---

## 2. Advanced concepts

### 1. `===` (case equality)

`===` is not “three equals.” It is used implicitly in `case` expressions: each `when` clause tests `when_clause === value`. Classes often define `===` for pattern-style matching (e.g., `Range`, `Regexp`, `Class`).

### 2. Operator methods

Many operators are **methods**: `a + b` invokes `a.+(b)`. You can define them on your classes. Custom semantics must not surprise maintainers—follow domain meaning.

### 3. String mutation vs frozen strings

Without frozen pragma, string literals may be mutable unless frozen explicitly. Mutating a shared literal corrupts other references. In multi-threaded MRI code, unexpected mutation causes rare heisenbugs.

### 4. Integer unification

Ruby 2.4+ unifies `Fixnum` and `Bignum` into **Integer** with arbitrary precision until memory limits. Bitwise ops work on integers; they are not floating point.

### 5. `defined?` and parse-time vs run-time

`defined?(expr)` returns a string describing whether `expr` is defined, without evaluating `expr` in many cases. Useful in metaprogramming; avoid overuse in application logic.

### 6. Flip-flops (legacy)

`if x..y` with literal endpoints is a **flip-flop**, rarely seen in modern code. Prefer explicit state variables.

### 7. Immediate values and identity

Small integers and some symbols may be **immediate** (not heap objects)—do not rely on `object_id` stability across versions for logic. Floats and bignums are heap allocated.

### 8. `dup` vs `clone`

**`dup`** copies object without singleton class; **`clone`** copies singleton methods and frozen state. Neither is deep copy—nested mutable structures still alias.

### 9. Heredoc indentation and SQL/JSON embedding

`<<~SQL` strips indentation for readable embedded SQL in source. Still escape user data in SQL via placeholders—heredoc does not sanitize.

### 10. Regexp flags and performance

`/pat/i` case insensitive; `/pat/m` multiline; `/pat/x` free-spacing. Complex regex on hot paths can dominate CPU—profile and simplify; consider dedicated parsers for logs.

---

## 3. Applications and use cases

### Software engineering and API contracts

- Standardize **symbol vs string** keys at HTTP/JSON boundaries; document OpenAPI or schema.
- Enforce **frozen_string_literal** in libraries and long-running services.
- **Money:** never `Float`—use integer cents or `BigDecimal` with explicit rounding policy.
- **Enums:** symbols (`:pending`) or strings in DB—pick one layer and convert once.

### Data modeling and persistence

- DB decimal columns map to `BigDecimal` in Ruby—configure gem conversion; avoid float serialization in JSON for money.
- Version fields as strings (`"3.4.1"`) preserve semver semantics; floats lose trailing zeros.

### Security engineering

### Security

- Never build `%x` or backtick strings from untrusted input (command injection).
- Interpolation in double-quoted strings is evaluation: `"#{user}"` is safe for display only when `user` is trusted or escaped for context.
- Prefer **literal** regex or `Regexp.escape` when incorporating user fragments.

### Operations and DevOps (Chef, Vagrant, YAML)

- Cookbook attributes often use **symbols** internally; YAML may load strings—normalize at boundaries.
- Version strings in metadata are strings, not floats: `"3.4"` not `3.4` if you need exact text.

```ruby
node.default['package']['version'] = '3.4.1'   # typical pattern (Chef)
Vagrant.configure('2') do |config|             # string API version
  config.vm.box = 'ubuntu/jammy64'
end
```

### Staff-level review checklist

- Conditionals use explicit nil/empty checks where types vary.
- No command execution via `%x` or backticks with untrusted data.
- Operator precedence in one-liners is obvious or parenthesized.
- Hash rockets vs label syntax is consistent within a file.
- Rational/complex literals are intentional, not accidental float noise.

---

## References

- [Syntax: Literals](https://docs.ruby-lang.org/en/3.4/syntax/literals_rdoc.html)
- [Syntax: Operators](https://docs.ruby-lang.org/en/3.4/syntax/operators_rdoc.html)
- [Syntax: Precedence](https://docs.ruby-lang.org/en/3.4/syntax/precedence_rdoc.html)
- [Syntax: Assignment](https://docs.ruby-lang.org/en/3.4/syntax/assignment_rdoc.html)
- [Syntax: Comments](https://docs.ruby-lang.org/en/3.4/syntax/comments_rdoc.html)
- [Syntax: Miscellaneous](https://docs.ruby-lang.org/en/3.4/syntax/miscellaneous_rdoc.html)
- [class String](https://docs.ruby-lang.org/en/3.4/String.html)
- [class Symbol](https://docs.ruby-lang.org/en/3.4/Symbol.html)
- [class Integer](https://docs.ruby-lang.org/en/3.4/Integer.html)
- [class Rational](https://docs.ruby-lang.org/en/3.4/Rational.html)
