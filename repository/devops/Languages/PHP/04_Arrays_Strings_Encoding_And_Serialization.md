# Arrays, strings, encoding, and serialization

[← Back to PHP](./README.md)

## What this chapter covers

Byte-level string behavior vs UTF-8 policy, JSON as an API boundary, native serialization formats and their gadget risks, stream wrappers that turn URLs into code execution or SSRF, and operational concerns (logging charset, DB charsets, temporary file handling). Later chapters connect this material to sessions, uploads, and object injection reviews.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Strings as bytes

PHP strings are binary-safe byte sequences. `strlen` returns byte length. Correct Unicode handling requires `mbstring` (or ICU via intl) for grapheme-aware operations, case folding, and collation. Source file encoding, HTTP `Content-Type` charset, database connection charset, and filesystem normalization (NFC vs NFD on macOS clients hitting Linux servers) must be aligned or you get intermittent truncation and mojibake.

---

### 2. JSON: decode, encode, depth, and errors

`json_encode` / `json_decode` are the default interchange format. Always pair decode with explicit error handling: `json_decode` returns `null` both for JSON `null` and for failures unless `JSON_THROW_ON_ERROR` is used.

```php
<?php
declare(strict_types=1);

$payload = ['ok' => true, 'items' => [1, 2, 3]];
$json = json_encode($payload, JSON_THROW_ON_ERROR);
$data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
var_dump($data['ok']);
```

Set maximum depth and payload size at ingress (reverse proxy body limits + application guards) to mitigate resource exhaustion.

**Flags staff actually set:** `JSON_THROW_ON_ERROR` removes silent failure. `JSON_INVALID_UTF8_SUBSTITUTE` avoids hard failure on bad bytes but can hide data corruption—log when substitution happens. `JSON_UNESCAPED_UNICODE` shrinks escaped Chinese/CJK payloads but changes byte length vs escaped form—signatures over raw JSON must use the same encoding choice as the signer. `JSON_PARTIAL_OUTPUT_ON_ERROR` is almost never right for APIs—it emits truncated JSON on failure.

**Double encoding:** Calling `json_encode` on a string that already contains JSON produces a quoted string, not a merged object—a common bug in “helpful” logging wrappers that stringify arrays twice.

---

### 3. `serialize` / `unserialize` and gadget chains

Native PHP serialization can represent objects. `unserialize` on attacker-controlled data can invoke `__wakeup`, `__destruct`, and custom `__unserialize` paths, historically enabling critical RCE when gadget classes exist in vendor trees.

Policy: treat untrusted deserialization as forbidden. Prefer JSON across language boundaries. If PHP serialization is unavoidable, constrain with `allowed_classes` options where supported and strip user input from ever reaching `unserialize`.

---

### 4. Streams and wrappers

`php://filter`, `php://memory`, `data://`, `file://`, `http://`, `phar://`, and others participate in a uniform streams API. User-influenced URLs passed to `file_get_contents`, `include`, or HTTP clients enable SSRF and filter-chain tricks in vulnerable code.

---

### 5. Hashing, HMAC, random bytes

`hash`, `hash_hmac`, `random_bytes`, and `sodium_*` underpin integrity and confidentiality primitives. Use `hash_equals` for comparing secrets to reduce timing leaks.

---

### 5b. Binary payloads, Base64, and transport limits

Binary data in JSON or form fields is usually Base64-encoded. Base64 grows payload size by roughly one-third, so edge limits (`client_max_body_size`, `post_max_size`) that looked safe for raw files can fail for API uploads. For large objects, prefer pre-signed object storage uploads over sending binary blobs through PHP workers.

```php
<?php
declare(strict_types=1);

$raw = random_bytes(16);
$b64 = base64_encode($raw);
$decoded = base64_decode($b64, true);
if ($decoded === false) {
    throw new RuntimeException('invalid base64');
}
```

Strict decode mode (`true`) rejects malformed input instead of silently dropping invalid bytes.

---

### 6. XML, YAML, CSV

Each parser class has billion-laughs, entity expansion, and type confusion histories. Disable external entities in XML; cap sizes; avoid `yaml_parse` on untrusted blobs in security-sensitive paths; treat CSV as untrusted code for formula injection into spreadsheets downstream.

---

### 7. Arrays: reference semantics, `array_merge`, `+`

Assigning `$b = $a` on arrays is copy-on-write until either side mutates. **`$a + $b`** keeps left-hand keys and ignores collisions; **`array_merge`** overwrites numeric keys and reindexes in ways that differ from union—wrong choice corrupts config merges and feature-flag maps.

Passing arrays by reference (`function foo(&$a)`) creates alias bugs across callers—prefer returning new arrays or objects in new code; legacy frameworks still use references heavily.

---

## 2. Advanced concepts

**Opcache interned strings:** Identical string literals deduplicate in shared memory—large dynamic string churn in hot loops still allocates on the heap per worker.

**Session serializers:** Custom `session.serialize_handler` settings interact with how objects are written to Redis or files—changing handlers without migration corrupts sessions.

**Phar stream wrapper:** Phar archives expose stream URLs that interacted historically with deserialization bugs—keep archives out of untrusted upload directories.

**Temporary files:** `sys_get_temp_dir()` behavior differs across containers and macOS; race-safe temp file APIs matter when handling uploads concurrently.

**Unicode normalization policy:** User identifiers and file names can arrive in visually identical but byte-different forms (NFC vs NFD). Normalize once at ingress and store canonical form; otherwise deduplication and authorization checks diverge across code paths.

**`mbstring.func_overload` legacy:** Older deployments overloaded string functions—rare on modern PHP but if enabled, `strlen` semantics change catastrophically; treat as a critical env invariant in inherited hosts.

---

## 3. Applications and use cases

- **API gateways:** Enforce max body size, validate JSON schema, reject wrong `Content-Type`, strip unsupported encodings at the edge.
- **Logging:** Prefer UTF-8 structured logs; replacement characters in logs often point to double-encoding upstream.
- **Cache stores:** Sign or encrypt cached blobs if tampering is in threat model; never cache PHP-serialized user objects from anonymous input.
- **Forensics:** Correlate charset issues with specific clients/CDNs; fix at the boundary instead of patching symptoms in PHP.
- **Compliance:** Document where PII enters serialization boundaries (sessions, queues, exports) and how it is encrypted at rest.

---

## References

- [Strings](https://www.php.net/manual/en/language.types.string.php)
- [Arrays](https://www.php.net/manual/en/language.types.array.php)
- [JSON functions](https://www.php.net/manual/en/ref.json.php)
- [Serialization](https://www.php.net/manual/en/function.serialize.php)
- [Stream wrappers](https://www.php.net/manual/en/wrappers.php)
- [Multibyte string](https://www.php.net/manual/en/book.mbstring.php)
- [Sodium](https://www.php.net/manual/en/book.sodium.php)
- [json_encode options](https://www.php.net/manual/en/function.json-encode.php)
- [array_merge](https://www.php.net/manual/en/function.array-merge.php)
- [base64_decode](https://www.php.net/manual/en/function.base64-decode.php)
