# Extension landscape, interoperability, and production selection

[← Back to PHP](./README.md)

## What this chapter covers

How to choose, validate, and operate PHP extensions in production: core vs optional modules, ABI/version constraints, distro packaging realities, extension overlap (`curl` vs HTTP clients, `intl` vs custom locale logic), and runtime choices that affect architecture (`swoole`, `pcntl`, DB drivers). This chapter targets the part that breaks deploys most often: extension drift.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases**.

## 1. Concepts

### 1. Extension categories

Common categories:

- **core runtime/perf**: `opcache`, `mbstring`, `intl`,
- **crypto/security**: `openssl`, `sodium`,
- **database**: `pdo_mysql`, `pdo_pgsql`, `mysqli`, `redis` (PECL),
- **process/network**: `curl`, `pcntl`, `sockets`,
- **observability/debug**: `xdebug`, profilers.

Composer packages can require `ext-*`; CI and production images must satisfy those explicitly.

---

### 2. Version and ABI discipline

Extensions are compiled against specific PHP API builds. Mixing binaries from different sources (custom PHP + distro modules) causes startup failures or hard crashes. Keep one authoritative build chain per environment.

---

### 3. Environment parity checks

Minimum checks in CI and release validation:

- `php -v` and minor version,
- `php -m` module presence,
- `php --ri <ext>` critical directive values (`opcache`, `intl`, DB drivers),
- lockfile `ext-*` requirements satisfied.

---

### 4. Choosing between overlapping capabilities

Examples:

- `curl` extension vs wrapper-based HTTP calls: choose one hardened client surface.
- `openssl` + `hash` vs `sodium`: prefer modern primitives where feasible.
- `mysqli` vs `PDO`: standardize to reduce duplicate query abstractions.

---

## 2. Advanced concepts

**PECL lifecycle:** PECL modules may lag new PHP minors. Plan upgrade windows around extension availability, not only framework support.

**Thread safety builds:** ZTS/NTS mismatches matter when using non-default runtimes.

**Long-lived runtimes:** Extensions that assume per-request teardown can leak state in worker-mode servers; test with soak workloads.

**Crash forensics:** Segfaults in extension code require native-level triage (core dumps, symbols), not only PHP stack traces.

---

## 3. Applications and use cases

- **Platform standards:** Publish an extension baseline per PHP minor and enforce it in CI.
- **Security:** Track CVEs for OS-level extension packages separately from Composer advisories.
- **Upgrade planning:** Build a dependency matrix: PHP minor × required extensions × framework version.
- **Performance tuning:** Measure extension impact (e.g., `intl` heavy formatting, DB driver fetch mode behavior) under production-like traffic.
- **Governance:** Require architecture review before introducing new PECL/native dependencies.

---

## References

- [Function Reference](https://www.php.net/manual/en/funcref.php)
- [PECL installation](https://www.php.net/manual/en/install.pecl.php)
- [Opcache](https://www.php.net/manual/en/book.opcache.php)
- [PDO](https://www.php.net/manual/en/book.pdo.php)
- [OpenSSL](https://www.php.net/manual/en/book.openssl.php)
- [Sodium](https://www.php.net/manual/en/book.sodium.php)
