# Testing, debugging, and quality

[← Back to Ruby](./README.md)

## What this chapter covers

How teams **verify** Ruby code: unit and integration tests, test doubles, the **`debug`** debugger, logging for diagnosis, and quality gates in review and CI. The goal is reliable automation and cookbooks—not achieving 100% coverage for its own sake.

---

## 1. Concepts

### 1. Why testing matters in Ruby

Ruby is dynamically typed: many errors surface at **runtime**, not in an IDE. Tests document behavior, guard refactors, and catch regressions in **gems**, **cookbooks**, and **CLI tools**. Infrastructure Ruby often lacks a UI—tests and idempotent convergence are your proof.

### 2. Minitest — stdlib-oriented framework

**Minitest** ships as a gem/default library pattern:

```ruby
require 'minitest/autorun'

class GreeterTest < Minitest::Test
  def test_greets
    assert_equal 'Hello, ops', Greeter.new('ops').call
  end
end
```

**`assert`**, **`refute`**, **`assert_raises`**, **`assert_output`** cover most unit cases. **`spec` style** (`describe`/`it`) via `minitest/spec` reads like RSpec-lite.

Run with:

```bash
bundle exec ruby -Itest test/greeter_test.rb
bundle exec rake test   # if Rakefile wires test task
```

### 3. RSpec — expressive BDD style

**RSpec** is the dominant gem for Rails and many libraries:

```ruby
RSpec.describe Greeter do
  it 'greets by name' do
    expect(Greeter.new('ops').call).to eq('Hello, ops')
  end
end
```

**`bundle exec rspec`** loads `.rspec` options and `spec/` layout. Prefer **one primary framework** per repo to avoid duplicate harnesses.

### 4. Test layout and naming

Conventions:

- **`test/`** or **`spec/`** mirroring `lib/`.
- One class under test per file, many cases per file.
- **`_test.rb`** or **`*_spec.rb`** suffixes.

Load path: **`$LOAD_PATH.unshift 'lib'`** or Bundler **`require: false`** + explicit requires in helper.

### 5. Test doubles: stubs and mocks

**Minitest::Mock** and RSpec **doubles** isolate units from network, filesystem, and time.

Rules:

- Mock **boundaries** you do not own (HTTP, cloud APIs).
- Do not mock the class under test into meaninglessness.
- Prefer **dependency injection** (pass client in constructor) over global stubs.

### 6. Integration and acceptance tests

Higher level tests hit real **filesystem**, **subprocess**, or **HTTP** (with test server). Slower but catch wiring bugs. Chef uses **Test Kitchen** + InSpec; Ruby apps use Capybara for web—framework-specific but pattern is “full stack slice.”

### 7. Debugging with `debug` gem

Modern MRI includes **`debug`** (successor to `debugger`/`byebug`):

```bash
bundle add debug
bundle exec ruby -r debug/gdb-like script.rb
# or insert in code:
# binding.break
```

Commands resemble gdb: step, next, continue, backtrace, inspect locals.

For quick prints, **`p`**, **`pp`**, **`puts caller`** remain valid—remove before merge.

### 8. IRB and `binding.irb`

Drop into REPL at a point:

```ruby
binding.irb   # needs irb gem in some setups
```

Useful in development; never leave in production code paths.

### 9. TracePoint for advanced tracing

**`TracePoint`** hooks `:call`, `:return`, `:raise` events—used by coverage tools and deep diagnostics. Rare in application code; know it exists when reading gem internals.

### 10. Warnings and `-w`

Run tests with warnings enabled:

```bash
RUBYOPT='-w' bundle exec rake test
```

Or treat warnings as errors in CI with **`Warning[:deprecated] = :raise`** patterns where appropriate.

### 11. Coverage

**SimpleCov** gem wraps tests to report line coverage. Coverage guides gaps; high percentage does not imply good tests.

---

## 2. Advanced concepts

### 1. Flaky tests and time

Freeze time with gems (**`timecop`**, ActiveSupport helpers) when testing expirations. Avoid `sleep` in unit tests.

### 2. Parallel test processes

**`parallel_tests`** spins processes—each needs isolated DB and Redis. MRI + DB often use transactional fixtures per process.

### 3. VCR and HTTP recording

Record HTTP fixtures to cassettes; pin API versions. Rotate cassettes when external API changes.

### 4. Chef/Ruby testing note

Cookbook unit tests (ChefSpec) mock the resource collection; integration uses Test Kitchen. Ruby language tests still apply to **libraries** extracted from cookbooks (`libraries/*.rb`).

### 5. Debugging production

Avoid interactive debuggers in prod. Use structured logs, request ids, and sampled traces. Reproduce with same Ruby minor and lockfile locally.

### 6. Static analysis and gradual typing

| Tool | Role |
|------|------|
| **RuboCop** | Style, lint, some security cops |
| **Standard** | Opinionated RuboCop wrapper |
| **Sorbet** (`sorbet-runtime`, `tapioca`) | Gradual types; `sig` blocks |
| **Steep** | Types via RBS signature files |
| **Brakeman** | Rails security static analysis |

Static typing does not replace tests—it catches whole classes of nil and arity errors before runtime. Adopt incrementally in large codebases.

### 7. Test pyramid and contract tests

- **Unit** — fast, no I/O; majority of count.
- **Integration** — DB, HTTP with test containers or VCR.
- **End-to-end** — few, slow, high confidence.

**Contract tests** (Pact-style) between services prevent API drift. **Consumer-driven** contracts matter when Ruby microservices call Java or Go backends.

### 8. Property-based and mutation testing (selective)

**rantly** / **Hypothesis-style** generators find edge cases in pure functions. **Mutation testing** (mutant gem) verifies tests actually assert behavior—expensive; run on critical billing/auth modules.

---

## 3. Applications and use cases

### Software engineering and quality gates

- CI runs `bundle exec rspec` (or minitest) + RuboCop + `bundle audit` on every PR.
- **Definition of done** includes tests, docs for public APIs, and changelog entry for gems.
- Flaky test policy: fix root cause; quarantine only with owner and expiry date.
- **Coverage** thresholds on critical paths, not global 90% vanity metrics.

### Security

- Tests must not embed production secrets; use env or CI secret stores.
- Sanitize VCR cassettes for tokens.

### Operations

```yaml
# GitHub Actions sketch
- run: bundle install --deployment
- run: bundle exec rspec --format documentation
  env:
    RUBY_VERSION: '3.4'
```

Fail build on warnings if team policy requires.

### Staff-level review checklist

- Tests assert behavior, not implementation details that break on refactor.
- External I/O mocked or isolated in unit tier.
- No `binding.irb` / `debugger` left in merged code.
- CI uses `bundle exec` and committed lockfile.
- Integration tier exists for critical paths (deploy script, gem CLI).

---

## References

- [class TracePoint](https://docs.ruby-lang.org/en/3.4/TracePoint.html)
- [module Marshal](https://docs.ruby-lang.org/en/3.4/Marshal.html)
- [debug gem (GitHub)](https://github.com/ruby/debug)
- [minitest (GitHub)](https://github.com/minitest/minitest)
- [RSpec](https://rspec.info/)
- [SimpleCov](https://github.com/simplecov-ruby/simplecov)
