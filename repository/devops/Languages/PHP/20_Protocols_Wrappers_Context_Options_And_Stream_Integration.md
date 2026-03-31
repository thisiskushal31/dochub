# Protocols, wrappers, context options, and stream integration

[← Back to PHP](./README.md)

## What this chapter covers

How PHP stream wrappers and context options unify filesystem, network, and process I/O; how protocol behaviors differ (`http`, `https`, `ftp`, `php://`, `phar://`); and how to set secure defaults for TLS and timeouts. This chapter fills a practical gap: teams often secure curl but forget stream-context-based calls in legacy code.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases**.

## 1. Concepts

### 1. Wrapper model

PHP uses wrapper schemes to route operations:

- local files (`file://`, implicit paths),
- network (`http://`, `https://`, `ftp://`),
- memory/temp (`php://memory`, `php://temp`),
- compressed/archive (`zip://`, `phar://`),
- filters (`php://filter`).

The same APIs (`fopen`, `file_get_contents`, `copy`) can target many schemes.

---

### 2. Context options

`stream_context_create()` attaches per-request options:

- HTTP method, headers, timeout,
- TLS verification flags and CA path,
- proxy settings,
- socket options.

Centralize context construction to enforce secure defaults once.

```php
<?php
declare(strict_types=1);

$ctx = stream_context_create([
    'http' => ['timeout' => 5],
    'ssl'  => ['verify_peer' => true, 'verify_peer_name' => true],
]);
$body = file_get_contents('https://example.com/health', false, $ctx);
```

---

### 3. Filters and transformation

Filters can transform data streams (encode/decode/compress). They are useful for controlled pipelines but dangerous when filter chains include user input.

---

### 4. Wrapper-aware threat model

Any user-controlled path or URL consumed by wrapper-capable functions can become:

- SSRF (`http://169.254...` metadata),
- local file read (`file:///etc/passwd`),
- archive gadget path (`phar://`),
- filter abuse (`php://filter`).

Validate scheme and destination, not only “looks like URL.”

---

## 2. Advanced concepts

**TLS verification drift:** Legacy code often sets `verify_peer=false` to “fix cert issues.” This should be treated like plain HTTP in production risk terms.

**Timeout layering:** Wrapper timeout + socket timeout + FPM timeout + proxy timeout must align to avoid hung workers.

**Large response handling:** `file_get_contents` buffers whole payload; use stream reads for large bodies.

**Header parsing:** HTTP wrapper metadata comes through `$http_response_header`; parsing must handle repeated header names and folded values carefully.

**`allow_url_fopen`:** If enabled globally, many legacy functions become network-capable unexpectedly. Restrict by policy where possible.

---

## 3. Applications and use cases

- **Legacy modernization:** Replace ad hoc URL fetches with a shared HTTP client wrapper that enforces TLS/timeouts.
- **Security hardening:** Ban non-allowlisted schemes for user-provided resource identifiers.
- **Data ingestion:** Use stream reads for large feeds to avoid memory spikes.
- **Compliance:** Ensure outbound calls log destination class (internal vs external) without leaking sensitive query params.
- **Incident response:** Search for wrapper schemes in code and logs to triage SSRF blast radius quickly.

---

## References

- [Supported Protocols and Wrappers](https://www.php.net/manual/en/wrappers.php)
- [Context options and parameters](https://www.php.net/manual/en/context.php)
- [Filesystem functions](https://www.php.net/manual/en/ref.filesystem.php)
- [Stream functions](https://www.php.net/manual/en/ref.stream.php)
