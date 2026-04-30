# Testing, quality, and code review practices

[← Back to R](./README.md)

## What this chapter covers

Software engineering discipline for R: **testthat** (and friends), **continuous integration** expectations, **linting** (`lintr`), static patterns for common footguns, and code review checklists that include **statistical validity** (not just style). R codebases often mix analysis and software; the goal is to make **invariants** testable: schema, key uniqueness, monotonicity, monotonic time ordering, and model I/O contracts.

---

## 1. Concepts

### 1. What to test in analytics code

- **Data contracts:** column names, types, key uniqueness, null rates, bounds.
- **Transforms:** known input fixtures produce known outputs (within tolerances).
- **Model wrappers:** training produces an object with expected S3 class and required components.
- **Reports:** optional snapshot tests for stable outputs; guard against unbounded diffs.

### 2. `testthat` basics

Tests live under `tests/testthat` in packages. Even non-package projects can adopt the same structure for internal repositories. Use **descriptive `describe`/`it` style** to keep failures navigable.

### 3. Warnings as policy

`expect_warning()` is fine, but in pipelines you may prefer **`options(warn = 2)`** in CI to ensure warnings are treated as failures when your team defines warnings as contract breaks.

### 4. Property-based and generative testing (where justified)

For numeric utilities, **quickcheck**-style tests can find edge cases; they require maintenance and clear shrinking behavior—use when ROI is high.

### 5. Code review is not “R style”

Reviewers should ask:

- is the **metric definition** correct,
- is **leakage** possible,
- is the **join** correct,
- is the **time window** correct,
- are **NA** handled per policy?

---

## 2. Advanced concepts

### 1. Golden testing pitfalls

Snapshot tests of model outputs or plots can become noise machines. Use them for **stable** artifacts; for floating outputs prefer **tolerance** and **structured** assertions.

### 2. Flaky tests from randomness and parallelism

Set seeds in tests; isolate parallel tests from shared temp directories; mark slow integration tests explicitly.

### 3. `lintr` and org-wide rules

Standardize allowed patterns: no `T`/`F` literals, no `1:n` in certain contexts, etc.—but do not let lint rules become theology; align with real defect history.

### 4. `goodpractice` and `covr`

`goodpractice` aggregates checks; `covr` measures test coverage. Coverage is a signal, not a goal—**high coverage with bad assertions** is worse than moderate coverage with strong contract tests.

### 5. Package checks as org standard

Internal packages should run `R CMD check` in CI; it catches many cross-platform and documentation issues.

---

## 3. Applications and use cases

- **CI for analytics repos:** run tests on each PR; block merges.
- **Data quality gates:** contract tests on daily extracts before modeling.
- **Model release:** add tests for training time bounds and score distribution sanity.

```r
testthat::test_that("ids are unique", {
  id <- c("a", "b", "c")
  testthat::expect_equal(anyDuplicated(id), 0L)
})
```

### Staff-level review checklist

- Contract tests exist for every external data boundary.
- Randomized tests are seeded; parallel tests are isolated.
- Review rubric includes statistical and operational questions, not only code style.
- `R CMD check` (or agreed equivalent) runs for package-like code.

---

## References

- https://testthat.r-lib.org/
- https://lintr.r-lib.org/
- https://github.com/MangoTheCat/goodpractice
- https://covr.r-lib.org/
