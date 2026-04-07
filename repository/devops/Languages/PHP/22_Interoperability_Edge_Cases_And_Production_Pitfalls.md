# Interoperability, edge cases, and production pitfalls

[← Back to PHP](./README.md)

## What this chapter covers

Topics that sit *between* earlier chapters and day-to-day staff work: **PHP-FIG PSR** contracts for HTTP, middleware, and shared libraries; **Composer** supply-chain controls that evolve after your first `composer install`; **async and application-server** stacks (pure PHP event loops, extension-based coroutines, Go-backed workers); **OpenTelemetry** as the default way to get traces, metrics, and log correlation in modern observability stacks; **intl/ICU** mismatches that break dates and locales in production; and a **tight FPM hardening checklist** beyond generic pool sizing. Use this chapter after **07**, **11**, **14**, **15**, **16**, **18**, **20**, and **21** so the references land on already-built mental models.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases**.

## 1. Concepts

### 1. PSR interoperability (why it matters)

The PHP Framework Interoperability Group publishes **PSRs**: small interface contracts so libraries and frameworks can compose without sharing a single vendor’s concrete classes. In practice, staff engineers see the same IDs repeatedly:

- **PSR-4** — class autoloading layout (covered in depth in chapter 03/07; assumed here).
- **PSR-3** — `LoggerInterface` so log sinks and frameworks swap cleanly.
- **PSR-6 / PSR-16** — cache interfaces for cross-library caching.
- **PSR-7** — immutable HTTP message objects (`Request`/`Response`, streams, uploaded files).
- **PSR-11** — container interface (`ContainerInterface`) for DI without binding to Symfony or Laravel’s container.
- **PSR-15** — HTTP server request handlers and middleware (single-pass middleware model).
- **PSR-17** — factories for PSR-7 objects (so middleware stays implementation-agnostic).
- **PSR-18** — HTTP client interface (outbound calls with consistent surface for tests and instrumentation).

Adopting these at boundaries (HTTP in/out, outbound HTTP, logging, cache) reduces lock-in and makes **test doubles** and **OpenTelemetry auto-instrumentation** easier, because many instrumentations hook PSR-shaped APIs.

---

### 2. Composer security beyond the lockfile

Modern Composer adds **audit** behavior and **repository-level** controls: advisory databases, optional blocking of known-bad versions, and **plugin allow-lists** so install-time code execution is explicit. Custom **Composer repositories** can advertise **filter lists** used during resolution and auditing. Treat **`allow-plugins`** as a security control: empty or deny-by-default, then explicitly approve trusted plugin packages. **`--no-plugins`** remains a valid escape hatch in compromised or untrusted trees.

---

### 3. Async and long-lived runtimes (landscape, not one true stack)

PHP’s core **fibers** (chapter 18) are a low-level suspend/resume primitive; they do not by themselves replace blocking `file_get_contents` or PDO without an **event loop** or **runtime** that schedules I/O.

Rough categories:

- **Pure PHP event loops** — mature ecosystems built around non-blocking I/O and promises/futures; usable under FPM for *in-request* fan-out if you accept loop boot cost per request, or in CLI/long-lived processes.
- **Extension coroutine runtimes** — C/C++ extensions that replace or wrap I/O with cooperative scheduling; highest raw throughput potential, strongest deployment constraints (extension build, ZTS/NTS, crash domain).
- **Go-backed application servers** — external process supervises PHP workers, often keeps application bootstrap in memory (Octane-style patterns, RoadRunner, FrankenPHP-style embedding). Throughput and tail latency can improve dramatically; failure modes shift to **worker state**, **memory leaks**, and **graceful reload** semantics.

Choosing among them is an **architecture and operations** decision: FPM remains the default for stateless web; long-lived stacks demand explicit reset hooks, health checks, and observability parity.

---

### 4. OpenTelemetry for PHP services

OpenTelemetry is the cross-language standard for **traces**, **metrics**, and **logs** correlation. PHP support typically combines:

- A **PHP extension** (optional but common for automatic hooks),
- **Composer packages** implementing the API/SDK and exporters (often OTLP to a collector),
- **Environment variables** (`OTEL_*`) to enable exporters, service name, and endpoints without recompiling.

Automatic instrumentation attaches to framework and library entry points (where available); manual spans remain necessary for domain logic. The goal in production is **consistent trace context** across inbound HTTP, outbound HTTP (PSR-18), database calls, and queue work so incidents show *which* layer dominated latency.

---

### 5. intl/ICU versus `DateTime` / `date`

PHP’s **`ext/date`** uses **timelib** for `DateTime`, `DateTimeZone`, and the canonical timezone database exposed under `timezone_identifiers_list()`.

**`ext/intl`** uses **ICU**, which ships its **own** timezone resource data and locale rules. Formatting with `IntlDateFormatter` or locale-sensitive APIs can disagree with `DateTime::format()` when:

- ICU’s bundled **tzdata** lags OS **tzdata** on conservative distros,
- **locale IDs** are non-canonical or mixed (`C` vs `en_US_POSIX`, legacy zone aliases),
- **DST or political zone** changes land in one layer before the other.

Staff need a **single policy**: store **UTC** in databases, convert at display boundaries, and document whether user-facing strings come from **ICU** or **strftime-style** formatting. Operations may need to refresh ICU data or set documented environment hooks when legal zones change mid-cycle.

---

### 6. PHP-FPM hardening (security-adjacent directives)

Beyond `pm.*` tuning (chapter 11), several pool directives reduce entire classes of misconfiguration and abuse:

- **`security.limit_extensions`** — restricts which script extensions FPM will execute as the primary script; narrows the window where a bad nginx/apache mapping executes unexpected file types.
- **`clear_env`** — when yes, strips inherited environment before applying pool-specific variables; reduces surprise `$_ENV`/`getenv()` leakage from process managers.
- **`chroot`** — optional root jail for the worker; powerful but breaks paths unless the tree is complete (sessions, uploads, unix sockets).
- **`listen.allowed_clients`** — for TCP listeners, ties which IPs may connect (localhost-only for local reverse proxies).
- **`chdir`** — consistent working directory for relative includes.

Remember: **pools are not full multi-tenant isolation**; shared opcode caches and kernel resources still apply. Combine with OS-level controls (AppArmor/SELinux, namespaces) for strong isolation.

---

## 2. Advanced concepts

**PSR-7 vs framework Request objects:** Frameworks often wrap or bridge PSR-7. Converting back and forth has small but non-zero cost; more importantly, **uploaded file streams** and **large bodies** behave differently if you buffer blindly. Prefer streaming APIs for large payloads.

**Middleware ordering:** PSR-15 stacks are ordered; security headers, authentication, and trace propagation must run in deliberate positions. “Global middleware” in long-lived workers persists across requests—ordering bugs become **stateful** bugs.

**Composer audit and CI gates:** Treat `composer audit` (and failing policy on known-vulnerable or blocked versions) as a **release gate**, not only a developer convenience. Align `audit.ignore` entries with ticket IDs and expiry; silent ignores rot.

**Long-lived PHP and memory:** Opcache and static caches are wins; **static** properties and singletons that accrue per-request data are losses. Combine **max requests per worker**, **periodic graceful restarts**, and **memory watchdogs** in supervisors.

**OpenTelemetry sampling and cost:** Full trace sampling on high-QPS endpoints can dominate overhead. Use **parent-based sampling**, **tail sampling** at the collector, or **route-based** rules for health checks vs business routes.

**ICU timezone updates:** When legal zones change, systems with stale ICU data mis-format “today” in affected regions. Mitigations include OS/package updates, shipping updated ICU resource bundles where supported, and monitoring **ICU tzdata version** alongside PHP version in environment dashboards.

---

## 3. Applications and use cases

- **Architecture reviews:** Require PSR-7/15/17 at HTTP boundaries for public packages; document which framework bridge is canonical.
- **Platform baselines:** Publish allowed Composer plugin patterns and run `composer install` with plugin restrictions in CI mirroring production.
- **Performance programs:** Compare FPM vs worker-mode only with **identical** code paths and **warm** Opcache; measure p95/p99 and error rates, not peak RPS alone.
- **Security:** Block `clear_env=no` on edge pools unless every env var is accounted for; pair `security.limit_extensions` with web server `location`/`FilesMatch` discipline.
- **SRE / observability:** Standardize `OTEL_SERVICE_NAME`, deployment environment, and trace propagation headers; link logs to traces via trace/span IDs in structured logs.
- **International products:** Add integration tests for **locale + timezone** formatting when `intl` is enabled; fail builds when ICU reports outdated tzdata in staging.
- **Incidents:** When “wrong time” or “wrong offset” appears only in formatted output, compare **system tzdata**, **PHP date**, and **ICU** versions before chasing application logic.

---

Minimal examples below anchor behaviors that are otherwise easy to misconfigure.

```bash
# OpenTelemetry (illustrative; names vary by vendor images)
export OTEL_PHP_AUTOLOAD_ENABLED=true
export OTEL_SERVICE_NAME=my-php-service
export OTEL_TRACES_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
```

```ini
; PHP-FPM pool: illustrative hardening fragment (adjust paths and policies)
security.limit_extensions = .php
clear_env = yes
; listen = 127.0.0.1:9000
; listen.allowed_clients = 127.0.0.1
```

```json
{
  "config": {
    "allow-plugins": {
      "trusted-vendor/composer-plugin": true
    },
    "audit": {
      "block-insecure": "report"
    }
  }
}
```

The JSON fragment shows the *shape* of root-only `config` entries; exact keys and defaults change with Composer versions—validate against your installed Composer and lock policy.

---

## References

- [PHP-FIG — PSR index](https://www.php-fig.org/psr/)
- [Composer schema and config](https://getcomposer.org/doc/04-schema.md)
- [Composer config (audit, allow-plugins)](https://getcomposer.org/doc/06-config.md)
- [PHP-FPM configuration](https://www.php.net/manual/en/install.fpm.configuration.php)
- [OpenTelemetry PHP instrumentation](https://opentelemetry.io/docs/languages/php/)
- [intl extension](https://www.php.net/manual/en/book.intl.php)
- [Date/Time](https://www.php.net/manual/en/book.datetime.php)
