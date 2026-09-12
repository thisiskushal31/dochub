# Introduction: PHP runtime, SAPIs, toolchain, and first script

[← Back to PHP](./README.md)

## What this chapter covers

What PHP is as a language and runtime, how the Zend Engine turns source into executing opcodes, how different SAPIs change lifetime and globals, how Opcache and JIT sit on top of compilation, how extensions and `php.ini` layers actually control behavior, and how to run a minimal strict script you can repeat in CI or on a server. Later chapters assume you reason about worker reuse, shared memory, INI changeability modes, and why “the same code” differs across binaries.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. What PHP is (language + runtime + deployment unit)

PHP is a high-level language whose dominant use remains server-side HTTP work: routing, templates, JSON APIs, and integration with databases and queues. Surface syntax mixes C-like punctuation with sigil-prefixed variables (`$x`), arrays that act as ordered maps, and a very large core library surfaced as functions and classes.

Under the hood, reference implementations compile source to **Zend opcodes** executed by the **Zend Engine**. Values are represented internally with reference counting and copy-on-write semantics for common operations: assigning an array variable does not immediately duplicate the whole structure until a mutation requires it. That model matters when you profile memory: accidental copying of large arrays in hot paths shows up as allocation churn long before you “optimize algorithms” in userland.

A **JIT** (when enabled) may translate hot regions of opcode into native code. For typical I/O-bound web requests, **Opcache** (shared bytecode) usually dominates wins; JIT helps more on CPU-bound userland loops. Treat any performance story as measurement-first.

For engineering, separate three layers mentally: the **repository** (PHP source + Composer packages), the **binary** (`php`, `php-fpm`, Apache-embedded build), and the **stack** (`php.ini` + FPM pool + web server + OS packages). Production “PHP bugs” often sit in the stack layer.

---

### 2. SAPIs: where the same `.php` file runs differently

The **Server API** names how the interpreter is hosted:

- **CLI** — discrete processes (unless you fork explicitly). No HTTP superglobals unless you synthesize them. Used for cron, migrations, queue consumers, Composer scripts, and batch tools. Long-running CLI daemons are a distinct operational class (supervisors, memory leaks, graceful shutdown).
- **php-fpm** — FastCGI workers behind nginx, Apache (`proxy_fcgi`), Caddy, or similar. Each worker handles **one request at a time** but **reuses the process** across requests. This is the default production picture for greenfield PHP.
- **Apache module (`mod_php`)** — PHP linked into httpd workers. Process accounting, reload semantics, and memory sharing differ from FPM; upgrades touch httpd lifecycle.
- **Built-in server (`php -S`)** — single-threaded, development-only convenience.
- **Other hosts** — CGI-style setups, LiteSpeed/LSAPI-style integrations, or application servers that keep workers warm longer than classic FPM. The invariant to verify is always: **how long does this process live**, and **what survives across requests**.

```bash
php -r 'echo PHP_SAPI, PHP_EOL;'
```

`PHP_SAPI` identifies the active interface for that invocation.

---

### 3. Compilation lifecycle: parse, compile, optimize, execute

For a cold file, the engine roughly: tokenize and parse into an AST, compile to opcodes (an **op_array** per function/file), run optimization passes, then execute. `include`, `require`, and autoloaders trigger additional compile steps on demand.

Opcache stores **shared** bytecode so workers avoid recompiling unchanged files. When `opcache.validate_timestamps` is enabled, the engine re-checks file mtimes on a schedule controlled by `opcache.revalidate_freq`. When disabled (common in immutable containers), **you** must reload FPM or explicitly invalidate opcache for changes to take effect. Misunderstanding this produces “I deployed but old code still runs” incidents.

**Interned strings** live in Opcache shared memory (`opcache.interned_strings_buffer`): identical string literals across many files deduplicate, reducing per-request allocations. Trimming this buffer too aggressively increases heap churn.

The **maximum accelerated files** setting maps to an internal prime-sized hash table bucket count; setting it too low causes unnecessary evictions and recompilation storms under large codebases.

---

### 4. Extensions: native code on the critical path

Capabilities such as OpenSSL, PDO drivers, cURL, intl, mbstring, and sodium are implemented as **extensions**—shared objects loaded at startup or compiled statically into the binary. Composer delivers **PHP code**; it cannot conjure a missing `pdo_mysql.so`. Image drift where CI installs `php8.2-cli` but production FPM lacks `php8.2-mysql` still happens in mature orgs.

Extensions are built for a specific PHP **API version** and thread-safety flavor (**NTS** vs **ZTS**). Mixing modules across hand-built PHP trees is a common source of startup failures.

```bash
php -m | sort
php --ri opcache
```

`php --ri <ext>` prints extension-specific `php.ini` directives and build metadata.

---

### 5. `php.ini`: layers, modes, and who can override what

Directives are classified by **where** they may be changed: some only at system startup (`INI_SYSTEM`), some per-directory (`.user.ini` in supported SAPIs), some via `ini_set` at runtime (`INI_USER` / `INI_ALL`). The matrix is easy to get wrong: you add `ini_set('opcache.enable','1')` in user code and nothing happens because Opcache cannot be enabled that way.

FPM pool files use `php_value` vs `php_admin_value`. **Admin** values cannot be overridden from userland—use them for security posture (`disable_functions`, `open_basedir`) so application code cannot relax them.

```bash
php --ini
```

Lists the loaded `php.ini` and scanned `.d` snippets for **this** binary. Remember: **`php` CLI** and **`php-fpm`** may load **different** files on the same host.

**.user.ini** files (where supported) apply to PHP under CGI/FPM-style setups with a **`user_ini.filename`** and **`user_ini.cache_ttl`** delay—changes are not always immediate, which confuses debugging.

---

### 6. Toolchain pieces (extended)

| Piece | Role |
|-------|------|
| `php` | CLI entry; `-d` for per-invocation INI overrides; `-n` to skip default `php.ini` (isolation tests). |
| `php-fpm` | Master + workers; pools; slowlog; listen queues; optional systemd integration. |
| `php.ini`, `conf.d/*.ini`, pool `.conf` | Cross-product of behavior; audit all three for production. |
| Composer | Resolver, autoload generator, script runner; not an extension installer. |
| PECL / distro packages | Native modules; track with image scanners, not only `composer audit`. |
| PHPUnit, PHPStan, Psalm, Rector | Quality and migration tooling in CI. |

Pin **minor** PHP versions deliberately: deprecations become errors across majors; extension ABIs move with minors.

---

### 7. Strict baseline and first script

`declare(strict_types=1);` tightens scalar boundaries at user-defined function **calls** originating from that compilation unit. It does not replace validation of external input; it makes internal contracts honest.

```php
<?php
declare(strict_types=1);

function greet(string $name): string {
    return 'Hello, ' . $name;
}

echo greet('PHP'), PHP_EOL;
```

Omit the closing `?>` in files that contain only PHP to prevent accidental whitespace in HTTP output.

---

### 8. Shebang, permissions, invocation

`#!/usr/bin/env php` respects `PATH`; pinned containers may use absolute interpreter paths. Prefer `php script.php` in automation so logs show the interpreter explicitly.

---

### 9. CLI switches (operations-oriented)

| Switch | Meaning |
|--------|---------|
| `-v` | Version. |
| `-m` | Loaded modules. |
| `-i` | `phpinfo()`-style dump (sensitive; avoid pasting publicly). |
| `-d foo=bar` | Set INI for this process. |
| `-n` | No `php.ini` (diagnostics). |
| `-S host:port` | Built-in server. |
| `-r 'code'` | Inline code (shell quoting pitfalls). |
| `-z ext.so` | Load Zend extension (rare in ops; debugging). |

---

### 10. One HTTP request through FPM (end-to-end mental model)

Tracing a single request builds staff intuition for where time and memory go:

1. **Edge** terminates TLS, may buffer the body, forwards to origin (nginx → unix socket or TCP to FPM).
2. **Listen queue** — if all workers are busy, the connection waits here; sustained backlog shows up as tail latency before PHP runs at all.
3. **Worker accept** — an idle FPM child accepts the FastCGI request; the process already holds Opcache-mapped opcodes and any **static**/**global** state from prior requests.
4. **Bootstrap** — web server sets `SCRIPT_FILENAME`, `DOCUMENT_ROOT`, `REQUEST_URI`, etc.; PHP populates superglobals (chapter 9).
5. **Autoload + compile (cold path)** — first touch of a class may hit Composer autoload and, without Opcache or after invalidation, compile work.
6. **Execute** — userland runs until completion, fatal, or external kill.
7. **Teardown** — output flushed; **unless** you use aggressive shutdown handlers, some resources close implicitly; DB connections return to pool or close per driver settings.

Staff questions this model answers: “Why did deploy not pick up code?” (Opcache + no reload). “Why 502 only under load?” (workers saturated or DB pool). “Why memory grows?” (static caches in workers, not `$_GET`).

---

### 11. Executor state (light touch)

You do not need C internals to operate PHP, but one idea explains many extensions and errors: each request runs in an **executor** context with an **active symbol table**, **current scope**, and **return value** slot. Extensions that manipulate “EG” (executor globals) or override handlers can change how errors surface. When debugging obscure extension crashes, knowing that **core** and **ext** share one process helps you escalate to **valgrind**, **ASan**, or vendor core dumps rather than chasing PHP syntax.

---

## 2. Advanced concepts

**Memory, cycles, and long-lived workers:** Reference counting handles most lifetimes; a cycle collector reclaims circular structures. Long-running workers (queue consumers, async hosts) can retain graphs until collection runs—global caches and forgotten listeners amplify retained memory across iterations.

**Preloading (`opcache.preload`):** A startup script can load a curated set of files into shared memory so every worker starts with classes resident. Downsides: preload scripts run in a special context; errors there fail the whole pool; deployment must coordinate invalidation with releases.

**JIT buffer and modes:** JIT shares configuration with Opcache (`opcache.jit`, `opcache.jit_buffer_size`). Defaults and recommended modes evolved across PHP 8.x; upgrades require re-benchmarking, not assumptions from blog posts written on older minors.

**FFI:** Calling arbitrary C from userland is powerful and difficult to sandbox—many hardened baselines disable it.

**Hard timeouts vs `max_execution_time`:** Wall-clock kills (FPM `request_terminate_timeout`, nginx `fastcgi_read_timeout`, load balancer idle timeouts) can abort PHP while external side effects (DB transactions, HTTP calls) continue unless code handles cancellation—chapter 11 ties this together.

**Signals:** CLI scripts under systemd should handle `SIGTERM` for graceful drain; PHP’s signal integration interacts with extensions and ticks—test shutdown paths, not only happy paths.

**Multiple FPM pools:** Separate pools isolate `open_basedir`, `pm.max_children`, and `slowlog` per application tier—prefer this over one giant pool with divergent `php_admin_value` needs.

---

## 3. Applications and use cases

- **On-call templates:** Capture `php -v`, `php --ini`, `php -m`, active pool name, Opcache `validate_timestamps`, and container image digest. Most “language” incidents are binary or INI drift, not business logic.
- **CI parity:** Install the same extension set and `php.ini` production flags (where safe) before `composer install` and tests; missing `intl` or `sodium` hides fatals until deploy.
- **Immutable deploys:** `opcache.validate_timestamps=0` plus automated `reload`/`restart` after rollout; verify with a canary endpoint that includes build metadata.
- **Security baselines:** Split dev vs prod INI; forbid `display_errors` and `expose_php` on edge pools; use `php_admin_value` for `disable_functions` where policy allows.
- **Capacity:** Measure RSS per worker under mixed traffic before setting `pm.max_children`; Opcache shared memory reduces compile cost but not peak request heap.
- **Audits:** Inventory `dl()`, `shell_exec`, `exec`, `passthru`, `proc_open`, `popen`, `assert` usage, and any `eval` (chapter 8).

---

## References

- [PHP Manual — Introduction](https://www.php.net/manual/en/introduction.php)
- [Installation and Configuration](https://www.php.net/manual/en/install.php)
- [Command line usage](https://www.php.net/manual/en/features.commandline.php)
- [Where a configuration setting may be set](https://www.php.net/manual/en/configuration.changes.modes.php)
- [List of `php.ini` directives](https://www.php.net/manual/en/ini.list.php)
- [Opcache configuration](https://www.php.net/manual/en/opcache.configuration.php)
- [Preloading](https://www.php.net/manual/en/opcache.preloading.php)
- [PHP-FPM installation](https://www.php.net/manual/en/install.fpm.php)
- [FPM pool configuration](https://www.php.net/manual/en/install.fpm.configuration.php)
- [Garbage Collection](https://www.php.net/manual/en/features.gc.php)
