# Web request lifecycle, sessions, and input handling

[← Back to PHP](./README.md)

## What this chapter covers

How SAPIs populate superglobals, how `Content-Type` drives body parsing, file upload mechanics and temporary storage, session save handlers and locking, cookie security attributes, CSRF mitigations for browser sessions, and threat-model notes for SSRF via outbound fetches triggered by user URLs. Later chapters assume authorization never depends on client-supplied identifiers alone.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Superglobals and trust boundaries

`$_GET`, `$_POST`, `$_COOKIE`, `$_SERVER`, `$_FILES`, and (after `session_start`) `$_SESSION` are populated by the engine from the HTTP envelope. `$_REQUEST` merges sources with an `variables_order` / `request_order` dependency—avoid it for security decisions.

`$_SERVER` headers appear as `HTTP_*` keys; reverse proxies may append `X-Forwarded-For`—treat as spoofable unless the edge strips untrusted values and you read only the trusted hop.

**`$_SERVER` entries staff actually use** (names vary slightly by SAPI; always `var_export` in a dev environment to verify):

| Key / pattern | Role | Ops note |
|---------------|------|----------|
| `REQUEST_METHOD` | Verb | Idempotency and CSRF policy differ by method. |
| `REQUEST_URI`, `QUERY_STRING` | Path and raw query | Log for IR; may exceed log line limits—truncate safely. |
| `HTTP_HOST`, `SERVER_NAME` | Host header vs config | Host-header attacks if app builds URLs from untrusted host. |
| `HTTPS`, `SERVER_PORT` | TLS signal | Behind TLS-terminating proxy, trust **configured** forward headers, not these alone. |
| `REMOTE_ADDR` | Direct client IP | Often proxy IP; use trusted `X-Forwarded-For` parsing at **edge** only. |
| `CONTENT_TYPE`, `CONTENT_LENGTH` | Body metadata | Mismatch with actual body → truncated input or parser errors. |
| `HTTP_AUTHORIZATION` | Bearer/basic | Some stacks strip unless `fastcgi_pass` / `SetEnvIf` adjusted—classic “works in CLI test, empty in FPM”. |
| `SCRIPT_FILENAME`, `DOCUMENT_ROOT` | FS mapping | Wrong mapping → wrong `include` roots or accidental path exposure. |

**`variables_order` and `request_order`:** These `php.ini` directives control whether `ENV`, `GET`, `POST`, `COOKIE`, `SERVER` populate `$_REQUEST` and in what precedence. Relying on `$_REQUEST` for authentication or authorization is fragile—different hosts merge differently.

---

### 2. Body parsing and `php://input`

`application/json` bodies are not automatically parsed into superglobals—frameworks read raw input once. `php://input` is not always rewindable for POST in all configurations—design single-pass readers.

**`application/x-www-form-urlencoded` vs `multipart/form-data`:** The engine parses the former into `$_POST` (subject to `max_input_vars`—hitting the limit silently drops later fields, a subtle auth-bypass and data-loss class). Multipart carries files plus fields; each part has its own headers (`Content-Disposition`, optional `filename`). **Staff check:** log `max_input_vars` in prod and load-test forms with many fields.

---

### 3. File uploads

`$_FILES` includes error codes (`UPLOAD_ERR_*`). Validate with `is_uploaded_file`, inspect content with `finfo`, store outside webroot, and never `include` uploaded paths. Align `upload_max_filesize`, `post_max_size`, `max_file_uploads`, nginx `client_max_body_size`, and load balancer limits—misaligned caps produce confusing client errors.

```php
<?php
declare(strict_types=1);

if (!isset($_FILES['doc']) || $_FILES['doc']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    exit;
}
$tmp = $_FILES['doc']['tmp_name'];
$dest = '/var/app/private/uploads/' . bin2hex(random_bytes(16));
if (!move_uploaded_file($tmp, $dest)) {
    http_response_code(500);
    exit;
}
```

---

### 4. Sessions: fixation, hijack, storage

`session_start` loads state keyed by session ID (cookie by default). Regenerate ID on privilege elevation. Session files on NFS, Redis, or databases change locking and scalability—file sessions can serialize all requests for a user on a single worker if locking is strict.

**Session `php.ini` staff should know:**

| Directive | Why it matters |
|-----------|----------------|
| `session.save_handler` / `session.save_path` | File vs `redis` vs custom—wrong path fills disks or loses sessions on multi-node. |
| `session.gc_probability` / `session.gc_divisor` | GC frequency for file sessions—can cause latency spikes on busy dirs. |
| `session.use_strict_mode` | Rejects uninitialized session IDs—mitigates fixation. |
| `session.sid_length` / `session.sid_bits_per_character` | Entropy of ID—balance security vs log/header size. |
| `session.cookie_lifetime`, `path`, `domain`, `secure`, `httponly`, `samesite` | Match your cookie model to product (SPA + API vs classic MVC). |

**Locking:** Custom handlers must define read/write semantics; Redis handlers differ on whether concurrent requests for one session block—this shapes perceived “hangs” under parallel XHR.

---

### 5. Cookies: flags and prefixes

`HttpOnly`, `Secure`, `SameSite`, path/domain scope, and `__Host-` prefix rules reduce theft and CSRF. Short-lived access tokens plus refresh flows reduce window of abuse.

---

### 6. CSRF for cookie-backed sessions

Synchronizer tokens or double-submit cookies protect state-changing browser forms. Bearer-token APIs are not subject to the same browser-driven CSRF model—threat models differ; still validate origin where relevant.

---

### 7. Output buffering, headers, and `header()`

`header()` must run before any body bytes are sent. Warning output, BOM-prefixed includes, or accidental whitespace before `<?php` in required files cause “headers already sent” fatals—common when debugging with `var_dump` left in templates. `output_buffering` in `php.ini` masks some mistakes in development but should not be relied on as a production strategy.

Staff should know whether the app sets **`Content-Type`** explicitly for JSON APIs, whether **`Cache-Control`** on authenticated routes prevents CDN caching of private data, and whether **`Set-Cookie`** attributes are duplicated by both PHP and the reverse proxy (misconfiguration doubles cookies or drops flags).

---

## 2. Advanced concepts

**FPM worker globals:** Superglobals reset per request, but static caches and singletons persist—risk of cross-tenant bleed if keys are not scoped.

**Session upload progress and naming:** Native upload progress uses separate session keys—ensure naming does not collide with app keys.

**Content Security Policy:** Reduces XSS impact; must align with inline scripts and nonce strategies chosen by front-end builds.

**HTTP/2 and multiplexing:** Head-of-line blocking differs from HTTP/1.1—timeouts and cancellation semantics change at the edge.

---

## 3. Applications and use cases

- **AppSec testing:** IDOR on every resource id; mass assignment on JSON bodies; open redirect on `next` parameters.
- **Ops:** Tune upload and body limits coherently; log 413/400 with correlation IDs.
- **Multi-region:** Sticky sessions vs shared Redis—document failover behavior.
- **Compliance:** Session lifetime policies, re-auth for sensitive actions, rotation logging.
- **API hardening:** Rate limits at edge; JSON schema validation; unexpected field rejection.

---

## References

- [Handling file uploads](https://www.php.net/manual/en/features.file-upload.php)
- [Sessions](https://www.php.net/manual/en/book.session.php)
- [Session security](https://www.php.net/manual/en/security.sessions.php)
- [Cookies](https://www.php.net/manual/en/features.cookies.php)
- [User Submitted Data](https://www.php.net/manual/en/security.variables.php)
- [Connection handling](https://www.php.net/manual/en/features.connection-handling.php)
- [Predefined variables — $_SERVER](https://www.php.net/manual/en/reserved.variables.server.php)
- [max_input_vars](https://www.php.net/manual/en/info.configuration.php#ini.max-input-vars)
- [variables_order](https://www.php.net/manual/en/ini.core.php#ini.variables-order)
- [request_order](https://www.php.net/manual/en/ini.core.php#ini.request-order)
- [header](https://www.php.net/manual/en/function.header.php)
- [output_buffering](https://www.php.net/manual/en/outcontrol.configuration.php#ini.output-buffering)
