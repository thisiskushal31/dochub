# Security hardening, supply chain, and threat model

[← Back to PHP](./README.md)

## What this chapter covers

Defense-in-depth from `php.ini` through FPM pools to application patterns: injection families, deserialization and template engines, SSRF, mass assignment, upload abuse, Composer and extension supply chain, container hardening, and STRIDE-oriented review prompts. Later chapters are cumulative with HTTP input and PDO material.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Baseline hardening

Production-oriented starting points (tune per org):

- `expose_php=Off`, `display_errors=Off`, `log_errors=On`
- `allow_url_include=Off` (almost always); scrutinize `allow_url_fopen` if remote includes or wrappers are abused
- `session.cookie_httponly`, `session.cookie_secure`, `session.use_strict_mode`
- `open_basedir` where maintainable; test thoroughly—extensions may partially honor it
- `disable_functions` for unused shell primitives; verify bypass paths (`mail`, ImageMagick delegates, FFI)
- `zend.exception_ignore_args` where stack traces might leak secrets

---

### 2. Injection taxonomy

**SQL** — prepared statements + least privilege (chapter 10).

**Command** — argv arrays, no shell concatenation (chapter 8).

**Object** — `unserialize`, `phar` streams, unsafe template engines evaluating code.

**LDAP/XPath/SMTP** — enterprise integrations still vulnerable to injection with string concatenation.

**Server-side template injection** — mistaken embedding of user data in templates evaluated server-side.

**XXE** — XML parsers that resolve external entities or expand billion-laughs payloads. For untrusted XML, use parser flags that forbid external entities and network fetches; validate size before parse.

**Image and document pipelines** — ImageMagick, GD, and PDF libraries have had critical issues on malicious inputs; run converters in isolated workers with resource limits, not inline in web requests when possible.

---

### 3. XSS, CSRF, SSRF

Output encoding per context; CSP to limit blast radius. CSRF mitigations for cookie sessions (`SameSite`, tokens). SSRF via user-controlled URLs in HTTP clients and streams—block metadata IP ranges, enforce allowlists where feasible.

---

### 4. Uploads and traversal

Content sniffing, random storage names, no execution bit on upload volumes, path normalization to reject `../` sequences in any user-influenced path component.

---

### 5. Supply chain

Composer: `composer audit`, lockfile review, `allow-plugins` governance, private mirrors, reproducible installs. Extensions: track distro CVEs separately—`composer audit` does not cover `php-*` OS packages. WordPress plugins and themes are full code deployments—treat updates like application releases.

---

### 6. Secrets

Short-lived credentials, KMS-wrapped keys, rotation automation. Fail closed when secrets missing.

```php
<?php
declare(strict_types=1);

$dbUrl = getenv('DATABASE_URL');
if ($dbUrl === false || $dbUrl === '') {
    throw new RuntimeException('DATABASE_URL is required');
}
```

---

## 2. Advanced concepts

**Row-level security** — database-enforced filters as last line when app bugs bypass WHERE clauses.

**Timing attacks** — `hash_equals` for MACs/nonces; avoid short-circuit compares on secrets.

**SameSite + OIDC** — third-party cookie deprecation changes login flows—test continuously.

**Container escape class** — read-only rootfs, non-root user, seccomp/AppArmor profiles, no CAP_SYS_ADMIN—PHP is not the only layer.

---

## 3. Applications and use cases

- **Threat modeling:** STRIDE per surface (admin, webhook, upload, export, GraphQL).
- **Bug bounty:** Synthetic data staging; no raw prod exports on internet-facing envs.
- **Compliance:** Map controls to `php.ini`, pool files, container policies, WAF rules.
- **IR:** Preserve lockfile, image digest, access logs with correlation IDs; rotate credentials if RCE suspected.
- **Purple team:** Attempt `disable_functions` bypasses and unexpected stream wrappers.
- **Dependency confusion:** Internal package names must be pinned to private registries; verify `composer.lock` dist URLs in CI point to trusted hosts only.

---

## References

- [Security introduction](https://www.php.net/manual/en/security.php)
- [User Submitted Data](https://www.php.net/manual/en/security.variables.php)
- [Filesystem Security](https://www.php.net/manual/en/security.filesystem.php)
- [Database Security](https://www.php.net/manual/en/security.database.php)
- [Session Security](https://www.php.net/manual/en/security.sessions.php)
- [Composer — Authentication for private packages](https://getcomposer.org/doc/articles/authentication-for-private-packages.md)
- [Composer — Handling private packages](https://getcomposer.org/doc/articles/handling-private-packages.md)
- [Composer — Troubleshooting](https://getcomposer.org/doc/articles/troubleshooting.md)
