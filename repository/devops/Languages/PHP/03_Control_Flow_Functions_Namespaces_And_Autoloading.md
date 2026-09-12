# Control flow, functions, namespaces, and autoloading

[← Back to PHP](./README.md)

## What this chapter covers

Control structures, first-class functions and closures, namespaces and name resolution, how autoloading maps class names to paths, how Composer’s generated autoloaders differ from hand-rolled `require` trees, and failure modes that show up in bootstrap order, monorepos, and Opcache-heavy deploys. Later chapters assume you can trace where `vendor/autoload.php` runs relative to environment bootstrapping.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Control flow

`if` / `elseif` / `else`, `while`, `for`, `foreach`, `break`, `continue`, and `switch` behave like C-family languages with PHP-specific rules. `foreach` iterates by value by default; `foreach ($a as &$v)` binds by reference—forgetting to `unset($v)` after the loop causes classic “last element aliasing” bugs.

`match` is strict, expression-based, and avoids switch fall-through—use it when comparing discrete values without needing C-style fall-through semantics.

---

### 2. Functions: signatures, defaults, variadics, named args

Functions support default values, variadic `...$rest`, union/intersection types, and (PHP 8+) named arguments that reorder call sites safely. Arrow functions `fn($x) => $x + 1` auto-capture variables by value from the parent scope; long-form closures `function () use ($y)` allow reference captures—mind mutability across calls.

---

### 3. Namespaces and resolution rules

Namespaces segment symbols to avoid collisions (`Vendor\Package\Class`). Unqualified class names resolve relative to the current namespace; leading `\` forces global fallback. `use` imports classes/functions/constants with optional aliasing.

Function and constant resolution has a fallback nuance: inside a namespace, unqualified function calls first look for a namespaced function and then may fall back to global if none exists. This is convenient for test doubles but dangerous when a namespaced helper shadows a global unexpectedly.

`namespace` declarations must be the first statement after `declare`—bootstrap files must be ordered correctly.

---

### 4. Autoloading: PSR-4, classmap, files

`spl_autoload_register` chains callables that map class names to files. Composer generates optimized maps:

- **PSR-4** — prefix to base directory with case-sensitive paths on Linux containers.
- **Classmap** — scans directories; faster resolution, requires `composer dump-autoload` when files move.
- **Files** — eager `require` on every request—keep tiny (global helpers); heavy files here tax every worker.

```php
<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';
```

Always anchor paths with `__DIR__`; cron and FPM may have unexpected working directories.

---

### 5. `include` vs `require` and `_once`

`require` fatals on missing files; `include` warns and continues—almost never appropriate for bootstraps. `_once` guards against double-definition fatals in legacy procedural trees; namespaced autoloading reduces the need.

---

### 6. Constants, enums, and `define`

Prefer `const` in classes for compile-time visibility. Global `define` persists process-wide—problematic in long-lived workers if abused for mutable configuration.

---

### 7. Autoloader chain order and `spl_autoload_call`

Multiple autoloaders register in a FIFO stack. When a class is missing, each callable runs in registration order until one succeeds (class exists) or the chain exhausts (fatal). **Composer’s autoloader is usually registered first or last depending on bootstrap**—if your code registers a custom autoloader after `vendor/autoload.php`, understand whether it shadows or supplements vendor resolution.

Calling `spl_autoload_call('Fully\\Qualified\\Name')` explicitly exercises the chain—useful in rare metaprogramming, dangerous if class names are user-influenced.

---

### 8. Static variables in functions

`static $x` inside a function retains value across invocations **within the same process**. In FPM, that means across HTTP requests in one worker—treat statics as a cache with explicit eviction or TTL, not as request-local storage.

---

## 2. Advanced concepts

**Autoload + Opcache:** With `opcache.validate_timestamps=0`, new classes from deploys require reload or explicit invalidation; autoload classmap changes without reload yield “class not found” or stale class errors.

**Preloading interaction:** Preloaded files must align with PSR-4 paths and deployment layout; mismatched preload scripts can pin obsolete classes in shared memory.

**Circular class dependencies:** Mutual `use` types or constants can force reordering or interfaces; fatal errors at load time are design smells.

**Composer platform config:** `config.platform.php` pins fake runtime versions for resolution—document it or CI resolves packages developers cannot run locally.

**Monorepos and path repos:** Symlinked packages accelerate dev; Docker builds must copy the right subtree or autoload resolution fails opaquely.

**Dynamic `require`:** Including files based on user input is remote-include territory—block in review guidelines.

**Composer `autoload-dev`:** Dev-only namespaces must not appear in production entrypoints; misconfigured deploys that include dev autoload in prod enlarge attack surface and Opcache footprint.

**Case sensitivity on Linux:** PSR-4 paths are case-sensitive; macOS default case-insensitive disks hide bugs until CI or production Linux fails `Class not found`.

---

## 3. Applications and use cases

- **CI:** Cache Composer dirs keyed by lock hash; run `composer validate` and `composer install --no-interaction`; fail builds on autoload dump drift.
- **Deploy:** After vendor updates, reload FPM when using authoritative classmaps and timestamp validation disabled.
- **Security:** Scan for `eval`, `assert` used as execution, `create_function`, and dynamic `require` of paths influenced by input.
- **Operations:** Keep `vendor/` out of writable mount points in containers—integrity checks and read-only rootfs reduce post-exploitation tampering.
- **Framework boots:** Front controllers should remain thin: autoload → env → kernel; large procedural includes hide dependency graphs from static analysis.
- **Debugging “class not found”:** Verify Composer dump, Opcache reset, **and** Linux path case; diff `composer.lock` when vendor subtree is vendored into a monorepo.

---

## References

- [Control structures](https://www.php.net/manual/en/language.control-structures.php)
- [Functions](https://www.php.net/manual/en/language.functions.php)
- [Namespaces](https://www.php.net/manual/en/language.namespaces.php)
- [Composer — Basic usage (autoloading)](https://getcomposer.org/doc/01-basic-usage.md#autoloading)
- [`spl_autoload_register`](https://www.php.net/manual/en/function.spl-autoload-register.php)
- [Class Constants](https://www.php.net/manual/en/language.oop5.constants.php)
- [`spl_autoload_call`](https://www.php.net/manual/en/function.spl-autoload-call.php)
