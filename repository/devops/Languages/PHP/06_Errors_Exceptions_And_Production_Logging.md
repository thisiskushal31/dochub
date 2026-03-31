# Errors, exceptions, and production logging

[← Back to PHP](./README.md)

## What this chapter covers

The split between recoverable diagnostics (`warnings`, `notices`, `deprecations`) and throwables (`Exception`, `Error`), how handlers and shutdown functions interact with fatal errors, how `display_errors` vs `log_errors` affects incident response, and how to structure logs for SRE workflows without leaking secrets or PII. Later chapters connect this to FPM slowlogs, HTTP error pages, and security disclosure.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Errors, warnings, and throwables

PHP historically emitted many conditions as errors; modern versions increasingly use `Error` throwables (`TypeError`, `ValueError`, `ArgumentCountError`, `ParseError`) for situations that should abort the current flow. Both `Exception` and `Error` implement `Throwable`. Catching `Throwable` at the outer edge swallows almost everything—use sparingly and always log context.

---

### 2. `error_reporting`, `display_errors`, `log_errors`

`error_reporting` selects which categories are emitted. In production, `display_errors=Off` prevents stack traces in HTML/JSON responses while `log_errors=On` routes diagnostics to the SAPI error log (often stderr in containers or the FPM pool log). `E_ALL` in production is compatible with hidden display if logs are curated and sampled.

---

### 3. Exceptions: stack, previous, finally

`throw` unwinds until a matching `catch`. `finally` runs on all paths, but fatal errors and some kills may bypass normal teardown—do not rely on `finally` alone for distributed transaction commit/abort without idempotent compensating actions.

```php
<?php
declare(strict_types=1);

function risky(): int
{
    throw new RuntimeException('boom');
}

try {
    echo risky();
} catch (RuntimeException $e) {
    fwrite(STDERR, 'handled: ' . $e->getMessage() . PHP_EOL);
}
```

---

### 4. Global handlers

`set_exception_handler` and `set_error_handler` let frameworks normalize HTTP 500 JSON bodies and centralize logging. Custom handlers must redact secrets and avoid recursion when logging itself fails.

---

### 5. Deprecations as policy signals

`E_DEPRECATED` warns about future removals. Libraries should treat deprecations as CI failures; applications may need phased upgrades when vendors lag—pin PHP minor until upstream catches up.

---

### 6. Assertions

`assert()` behavior depends on `zend.assertions` and `assert.active`. Assertions are not a security control—never gate authorization on `assert` expecting it to run in production.

---

### 7. `error_reporting` as a bitmask

`E_ALL` includes notices, strict, deprecations, and user-triggerable categories depending on version. Combining with bitwise `&` and `~` in `php.ini` or `ini_set` is error-prone—teams often standardize on `E_ALL` with `display_errors=Off` in production and filter noise at the log shipper (drop known vendor deprecations) rather than silencing broad categories in PHP and hiding real bugs.

---

### 8. Converting errors to exceptions

Some frameworks register `set_error_handler` to throw `ErrorException` for `E_*` levels they consider exceptional. Side effects: **trigger_error** in vendor code becomes an exception; `@` suppression interacts with the handler. Understand your framework’s policy before blaming “random 500s” on deploys.

---

## 2. Advanced concepts

**Shutdown function and fatals:** `register_shutdown_function` can detect fatal errors via `error_get_last`, but OOM and SIGKILL may leave partial state—design workers to be restart-safe.

**Buffered output and headers:** Warnings emitted after partial output corrupt JSON/HTML—use disciplined output buffering or fail before sending headers when diagnostics are noisy.

**Structured logging:** JSON lines to stdout integrate with Kubernetes agents; include `request_id`, `trace_id`, `service`, `version`, and `pool` name—not only free text.

**Exception arguments and `zend.exception_ignore_args`:** Newer versions can hide function arguments from stack traces to reduce credential leakage—balance with debuggability.

**Custom error handlers and `@`:** Suppression still invokes error handlers in some configurations—avoid `@` except in tightly controlled legacy bridges.

---

## 3. Applications and use cases

- **On-call:** Alert on spikes of fatal patterns (`Allowed memory size`, `Maximum execution time`, `Uncaught TypeError`) correlated with deploy markers.
- **Privacy:** Strip Authorization headers, cookies, and DB connection strings from error reports; scrub `$_SERVER` dumps in debug tooling.
- **Multi-tenant SaaS:** Attribute error rates per tenant to detect noisy neighbors without exposing other tenants’ data in shared logs.
- **PCI / regulated envs:** Separate log sinks for security events vs application debug; enforce retention and access controls.
- **Customer-facing errors:** Generic 500 messages externally, rich structured logs internally—attackers mine verbose errors for version and path data.

---

## References

- [Errors](https://www.php.net/manual/en/language.errors.php)
- [Exceptions](https://www.php.net/manual/en/language.exceptions.php)
- [Error reporting](https://www.php.net/manual/en/errorfunc.configuration.php)
- [Throwable](https://www.php.net/manual/en/class.throwable.php)
- [assert](https://www.php.net/manual/en/function.assert.php)
- [register_shutdown_function](https://www.php.net/manual/en/function.register-shutdown-function.php)
- [ErrorException](https://www.php.net/manual/en/class.errorexception.php)
- [set_error_handler](https://www.php.net/manual/en/function.set-error-handler.php)
