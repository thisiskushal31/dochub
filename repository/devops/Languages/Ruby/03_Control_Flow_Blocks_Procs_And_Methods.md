# Control flow, blocks, procs, and methods

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby chooses what runs next: **if/unless**, **case**, loops, **iterators**, and **blocks**; how **methods** are defined and called; how **procs** and **lambdas** differ; and how **method lookup** behaves at a level you need for DSLs and libraries. Control flow in Ruby is expression-oriented—almost every construct returns a value.

---

## 1. Concepts

### 1. `if`, `elsif`, `else`

An `if` evaluates a **test** expression. If the test is truthy, the **then** branch runs. `elsif` adds more tests in order; the first match wins. `else` runs when no test matched.

The entire `if` expression’s value is the **last evaluated** expression in the branch that ran. Assignments in tests are idiomatic for caching:

```ruby
if (data = fetch_data)
  process(data)
end
```

The optional `then` keyword after the condition is allowed but usually omitted.

**Ternary** `condition ? a : b` is the same shape in one line. Reserve it for simple cases; nested ternaries harm reviewability.

### 2. `unless`

`unless` runs its body when the test is **false**. `else` on `unless` is legal but easy to misread; many teams prefer `if !condition` with clear naming instead of `unless` with `else`.

There is no `elsif` for `unless`.

### 3. `case` and `when`

`case` compares `value` to each `when` using **`===`** (case equality), not only `==`:

```ruby
case line
when /^ERROR/
  :error
when /^WARN/
  :warn
else
  :info
end
```

A `when` with multiple values is equivalent to multiple `when` lines. `case` with no argument is a cleaner multi-branch boolean style:

```ruby
case
when disk.full?
  alert_ops
when memory.low?
  scale_out
end
```

### 4. Loops: `while`, `until`, `for`

`while` repeats while the condition is true; `until` repeats while false. Both support `break` (exit loop) and `next` (skip to next iteration).

`for x in collection` desugars to calling `collection.each` with a block. Idiomatic Ruby prefers **explicit** `.each` or enumerator methods over `for`, but you will still see `for` in older scripts.

### 5. Iterators and blocks

Methods like `each`, `map`, `select` take a **block** — a chunk of code delimited by `do ... end` or `{ ... }`:

```ruby
[1, 2, 3].each do |n|
  puts n * 2
end
```

Braces `{ }` bind tighter than method argument lists; style guides often use `{ }` for single-line blocks and `do..end` for multi-line.

Blocks are not objects until converted (see procs below). They can receive block parameters `|x, y|`.

### 6. Calling methods

`receiver.method(arg1, arg2)` sends a message. Parentheses are optional in many cases; omitting them can make parsers treat the next expression as an argument. When in doubt, parenthesize.

**Splat** `*` expands arrays into arguments; **double splat** `**` expands hashes into keyword arguments (Ruby 2.7+ keyword separation rules apply—be explicit in public APIs).

**Safe navigation:** `obj&.method` — no call if `obj` is `nil`.

**Chaining:** methods return `self` or a new object; fluent interfaces rely on that contract.

### 7. Defining methods

```ruby
def greet(name)
  "Hello, #{name}"
end
```

**Default arguments** are evaluated at call time (each call), not at definition time—important when defaults are mutable objects.

**Keyword arguments** (preferred for options):

```ruby
def connect(host:, port: 443, timeout: 30)
  # ...
end
connect(host: 'example.com', port: 8443)
```

**Variable arity:** `*args` collects extra positional args; `**kw` collects extra keywords; bare `*` in signature can delegate.

**Return value:** Ruby returns the last expression unless `return` is used. Early `return` exits the method.

### 8. Procs, lambdas, and `&`

A **proc** is a reified block (`Proc.new` or `proc { }`). A **lambda** (`lambda { }` or `-> { }`) is a proc with stricter arity checking and `return` semantics (returns from the lambda, not the enclosing method).

Convert block to proc at call site with `&`:

```ruby
def twice(&block)
  block.call(21)
  block.call(21)
end
```

**`&` in definition** means “capture the block passed by caller.” **`&` in call** means “pass this proc as the block.”

Chef resources and Rake tasks are built from blocks evaluated in a specific `self` context—understanding blocks is prerequisite for reading those files.

### 9. `yield` without a proc parameter

A method can `yield` to the caller’s block without naming a proc. `block_given?` tests presence. Library code often uses `yield` for iterators.

### 10. Exception flow (syntax level)

`begin ... rescue ... ensure ... end` handles errors. `raise` throws. `ensure` runs always (cleanup). Full exception design is in chapter 07; at control-flow level remember:

- `rescue` without class catches `StandardError` and subclasses (not `Exception` root in general).
- Bare `rescue` swallows too much in production—rescue specific types and re-raise or log.

---

## 2. Advanced concepts

### 1. Short-circuit evaluation

`&&` and `||` skip the right operand when the result is determined. Patterns like `user && user.admin?` are common; prefer `user&.admin?` when `nil` is the only concern.

### 2. Modifier forms

```ruby
puts x if debug?
exit 1 unless success?
```

Modifier `if/unless` attach to a single statement. They read well for guards; avoid when the statement is long.

### 3. `break`, `next`, and `redo` in blocks

`break` exits the block and returns a value to the method that invoked the iterator. `next` skips to the next iteration. `redo` restarts the current iteration (rare).

### 4. Method visibility (preview)

`public`, `protected`, `private` control callable methods. `private` forbids explicit receiver (except `self`). Chapter 04 expands visibility and `self`.

### 5. `super` and ancestor chain

Inside a method, `super` calls the same method in the superclass. `super(args)` forwards arguments; bare `super` forwards the original argument list. Missing methods trigger `method_missing` (chapter 08).

### 6. Endless method definition (Ruby 3+)

```ruby
def double(x) = x * 2
```

Single-expression methods only; use for trivial helpers, not complex logic.

### 7. Numbered block parameters (Ruby 2.7+)

```ruby
[1, 2, 3].map { _1 * 2 }
```

Convenient in short blocks; named parameters are clearer in production code reviews.

### 8. Keyword argument separation (Ruby 2.7+)

Ruby distinguishes **positional** and **keyword** arguments strictly:

```ruby
def f(a, b: 1); end
f(1, 2)        # ArgumentError — 2 is not a keyword
f(1, b: 2)     # ok
```

Passing a **Hash** where keywords are expected (`f(**hash)`) requires symbol keys matching parameter names. APIs accepting “options hash” should document required keys and use `fetch` inside—avoid silent `nil` from typos (`host:` vs `hostname:`).

### 9. Method lookup order (detailed)

When `receiver.foo` is invoked:

1. Singleton methods on `receiver`’s eigenclass
2. Methods on `receiver`’s class, then `include`d modules (reverse include order), then superclass chain
3. `prepend`d modules run **before** the class body
4. If still missing: `method_missing` on class, then included `method_missing` hooks

`ancestors` lists the linearized chain—print it when debugging “wrong implementation called.”

### 10. Closures capture variables, not values

Blocks close over **variables** (`x`), not the value at block creation time:

```ruby
funcs = []
3.times { |i| funcs << proc { i } }
funcs.map(&:call)  # => [2, 2, 2] — same binding, final i
```

Loop variables in blocks are a classic bug source—use default block args `proc { |j=i| j }` or refactor to `each`.

### 11. Explicit blocks vs proc arguments

| Style | When |
|-------|------|
| `yield` | Internal iterators; optional block |
| `def m(&block)` | Store block for later/callbacks |
| Pass `&proc` to another method | Adapter pattern |

Framework code often stores blocks as procs and calls them later (callbacks, `after_commit`).

### 12. Result objects instead of exceptions for flow control

For expected failures (validation, 404), prefer returning a **result** struct or monad-style object rather than raising—exceptions are for exceptional paths. Raising in hot loops is slow and obscures control flow in metrics.

---

## 3. Applications and use cases

### Software engineering and API design

- Prefer **keyword options** for public APIs with more than two optional parameters; never rely on positional args after the third parameter.
- Extract complex `case` branches into methods named after outcomes (`classify_log_line`).
- Document whether blocks are **required** or optional; raise `ArgumentError` if `block_given?` is false when mandatory.
- **Fluent interfaces** return `self` from setters only when documented—otherwise return meaningful values.
- **Rack middleware** is a stack of `call(env)` methods—control flow as onion layers; same block/proc mental model.

### Data and integration

- Parse pipelines: `case` on message type or pattern `in` (chapter 06) at boundary; domain code receives typed objects, not raw hashes.
- Retry loops belong around **transient** I/O errors with jitter—cap attempts and log final exception.

### Reliability

- `ensure` closes DB connections and file handles even when `return` inside `begin`.
- Thread pools: uncaught exceptions in `Thread.new` kill the thread silently unless `join` or handler—Sidekiq middleware exists for a reason.

### Security and reliability

- Do not `rescue Exception` broadly in agents—it masks `SignalException` and memory failures in ways that leave processes half-dead.
- Timeouts belong around **I/O**, not around arbitrary `rescue` (chapter 10).
- Validate arity at boundaries when exposing DSLs to untrusted cookbook authors.

### DevOps and DSL reading (Chef / Rake / Vagrant)

```ruby
package 'nginx' do
  action :install
  version '1.24.0'
end
```

Read this as: call `package` with a string and a **block**; the framework defines `package` to evaluate the block in a resource context where `action` and `version` are methods.

```ruby
task :deploy do
  sh 'bundle exec cap production deploy'
end
```

The block is the task body; `sh` is provided by Rake.

### Staff-level review checklist

- Control flow returns meaningful values when used as expressions.
- Blocks do not leak large objects via closures in long-running daemons.
- `rescue` clauses are specific; `ensure` closes resources.
- Public methods document keyword vs positional contracts.
- No silent empty `rescue` in CI or Chef convergence code.

---

## References

- [Syntax: Control Expressions](https://docs.ruby-lang.org/en/3.4/syntax/control_expressions_rdoc.html)
- [Syntax: Calling Methods](https://docs.ruby-lang.org/en/3.4/syntax/calling_methods_rdoc.html)
- [Syntax: Methods](https://docs.ruby-lang.org/en/3.4/syntax/methods_rdoc.html)
- [Syntax: Exceptions](https://docs.ruby-lang.org/en/3.4/syntax/exceptions_rdoc.html)
- [class Proc](https://docs.ruby-lang.org/en/3.4/Proc.html)
- [class Method](https://docs.ruby-lang.org/en/3.4/Method.html)
- [module Kernel](https://docs.ruby-lang.org/en/3.4/Kernel.html)
