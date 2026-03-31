# Testing, debugging, and profiling

[← Back to PHP](./README.md)

## What this chapter covers

Test pyramid tradeoffs for PHP services, PHPUnit configuration and bootstrap order, parallel test execution pitfalls, static analysis level ramps, Xdebug modes (debug vs profile vs coverage) and why they must stay off production pools, lightweight profilers, and OpenTelemetry-style tracing concerns. Later chapters tie CI gates to Composer scripts and deploy hygiene.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. PHPUnit and test types

Unit tests isolate classes with doubles; integration tests hit databases, queues, or HTTP kernels; end-to-end tests exercise browsers or black-box APIs. `phpunit.xml` controls bootstrap files, environment variables, suites, and coverage drivers.

```bash
php vendor/bin/phpunit --testsuite unit
```

---

### 2. Static analysis

PHPStan and Psalm infer types beyond runtime checks. Baseline files track legacy debt intentionally; raising levels without fixing noise hides regressions. Run analyzers on the same PHP minor as production.

---

### 3. Xdebug

Xdebug provides step debugging, profiling (cachegrind), and coverage collection. Enabling it in FPM multiplies latency and memory—use separate debug images or toggleable builds. Never ship Xdebug-enabled pools to customer-facing tiers.

---

### 4. Profiling alternatives

Sampling profilers (SPX, Excimer-based tools) reduce overhead for staging mirrors. Always profile with Opcache settings similar to production—debug settings distort results.

---

### 5. Observability

Logs, metrics, and traces complement tests. Propagate trace context through nginx, PHP, and outbound HTTP clients; align span names with route names for SLO dashboards.

---

### 6. Contract and integration tests

HTTP-layer contract tests (Pact-style) and schema-driven API tests catch mismatches between PHP services and consumers without booting browsers. They complement PHPUnit: use them when multiple teams ship independently.

---

## 2. Advanced concepts

**ParaTest / parallel suites:** Parallel runs multiply database fixtures—use transactions per test or ephemeral schemas; avoid shared global state.

**pcov vs Xdebug for coverage:** `pcov` is lighter for CI coverage collection on large repos.

**Flaky tests:** Freeze time (`Clock` interfaces), seed randomness, and stub network I/O—non-determinism hides real failures.

**Memory limits in CI:** Test kernels may need higher `memory_limit` than production—document why to avoid masking leaks.

**Debugging long-running workers:** Attach debuggers to queue consumers carefully—breakpoints stall processing and backlog grows.

**Mutation testing:** Tools like Infection mutate source and expect tests to fail—measures suite strength beyond line coverage; expensive in CI, run nightly or on critical modules.

**Environment isolation:** Tests must not read real `.env` from disk accidentally—use `phpunit.xml` `env` entries and fail CI if `APP_ENV=production` slips into test bootstrap.

---

## 3. Applications and use cases

- **CI gates:** Require unit + static analysis + `composer audit` on default branch merges.
- **Staging fidelity:** Match extensions, `php.ini`, and pool settings—tests green locally but fatals in staging waste cycles.
- **On-call:** Reproduce with same env vars and feature flags; avoid copying production secrets into laptops—use synthetic data.
- **Performance budgets:** Synthetic checks for p95 route latency catch ORM regressions early.
- **Security:** Redact Authorization headers and cookies from debug dumps shared in tickets.

---

## References

- [PHPUnit documentation](https://docs.phpunit.de/)
- [Xdebug documentation](https://xdebug.org/docs/)
- [PHPStan](https://phpstan.org/user-guide/getting-started)
- [Debugging in PHP](https://www.php.net/manual/en/debugger-about.php)
- [Garbage Collection](https://www.php.net/manual/en/features.gc.php)
