# Predefined variables, interfaces/classes, and reflection

[← Back to PHP](./README.md)

## What this chapter covers

`$_SERVER` / `$_ENV` / `$_FILES` reliability boundaries, reserved interfaces/classes (`Throwable`, `Stringable`, enums, weak references), and reflection-driven framework mechanics. This chapter targets staff-level debugging: why behavior differs across SAPIs, why metadata-heavy boot phases get slow, and where implicit runtime contracts break.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases**.

## 1. Concepts

### 1. Predefined variable categories

The superglobal set includes:

- request-derived (`$_GET`, `$_POST`, `$_COOKIE`, `$_FILES`, `$_SERVER`),
- environment (`$_ENV`),
- session state (`$_SESSION` after `session_start`),
- process/runtime (`$argv`, `$argc` in CLI contexts).

Do not treat all keys as always present. SAPI, proxy, and config determine availability.

---

### 2. `$_SERVER` and trust

`$_SERVER` mixes transport facts, process details, and proxy-forwarded headers. Security-sensitive fields (client IP, host, scheme) must come from trusted edge policy, not arbitrary header pass-through.

---

### 3. Reserved interfaces and classes

Important runtime contracts:

- `Throwable` / `Exception` / `Error`,
- `Traversable`, `Iterator`, `Countable`, `ArrayAccess`,
- `Stringable`, `Closure`, `Generator`, `Fiber`,
- `UnitEnum`, `BackedEnum`,
- weak references/maps for cache-style structures without ownership.

Knowing these lets you read framework internals and extension docs faster than searching symbols ad hoc.

---

### 4. Reflection basics

Reflection provides runtime metadata for classes, methods, parameters, attributes, and types. Frameworks use it for routing, DI autowiring, serializers, and validators.

Reflection is powerful but expensive during cold start; production stacks often cache reflected metadata.

---

## 2. Advanced concepts

**`variables_order` and `request_order`:** These determine which sources populate superglobals and precedence in merged request data. Mismatched settings across environments create hard-to-reproduce bugs.

**Reflection + attributes + autoload:** Reflecting classes triggers autoload. If autoload maps drift or Opcache is stale, metadata scans fail before request handling starts.

**Weak references:** Useful for in-process caches in long-lived workers where you want GC to reclaim values under memory pressure.

**Type reflection nuance:** Union/intersection types appear as composite reflection objects; custom tooling must handle both or silently drop constraints.

---

## 3. Applications and use cases

- **Framework boot tuning:** Cache route/DI metadata produced via reflection.
- **Security audits:** Enumerate controller methods/attributes to verify auth middleware coverage.
- **Platform diagnostics:** Dump key `$_SERVER` entries in a sanitized diagnostics endpoint to resolve proxy/header confusion.
- **Codegen/tooling:** Build API docs or SDK stubs from reflected signatures and attributes.
- **Long-lived runtimes:** Prefer weak maps for ephemeral per-request attachments to shared service instances.

---

## References

- [Predefined variables](https://www.php.net/manual/en/language.variables.superglobals.php)
- [$_SERVER](https://www.php.net/manual/en/reserved.variables.server.php)
- [Predefined interfaces and classes](https://www.php.net/manual/en/reserved.interfaces.php)
- [Reflection](https://www.php.net/manual/en/book.reflection.php)
- [Attributes](https://www.php.net/manual/en/language.attributes.php)
