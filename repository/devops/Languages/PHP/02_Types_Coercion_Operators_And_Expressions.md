# Types, coercion, operators, and expressions

[← Back to PHP](./README.md)

## What this chapter covers

How values are categorized at compile time vs runtime, when the engine coerces scalars, how `declare(strict_types=1)` redraws boundaries between your code and the rest of the world, how comparisons and bitwise/string operators behave with user input, and where static analyzers must compensate for runtime permissiveness. Later chapters assume you never confuse **type declarations** with **validation** of HTTP or JSON.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Type system: static hints vs runtime reality

PHP combines dynamic typing with optional static hints on parameters, returns, properties, and constants. Categories you will read in modern code include `int`, `float`, `bool`, `string`, `array`, `object`, iterable and callable pseudo-types, `void`, `never`, `null`, `false`/`true` stand-alone types (in unions), `mixed`, union types (`A|B`), and intersection object types (`Countable&Iterator`). Enumerations are separate nominal types (chapter 5).

Hints are enforced at runtime at boundaries (with nuances below), but many internal operations still coerce. A parameter typed `int` can receive a numeric string from another file without `strict_types`; with `strict_types` in the **caller** compilation unit, the same call may throw `TypeError`.

---

### 2. `strict_types`: caller file, not callee magic

`declare(strict_types=1);` applies to **calls that originate in that file** to user-defined functions and methods. It does not retroactively change every vendor function you call. Internal functions have their own ZEND argument parsing tables—some coerce aggressively regardless of your strict file.

```php
<?php
declare(strict_types=1);

function takes_int(int $x): void {
    var_dump($x);
}

// takes_int('5'); // TypeError in this file
takes_int(5);
```

Crossing from strict application code into a legacy package that expects coercions is a recurring integration pain: wrap at the boundary with explicit casts only after validation.

---

### 3. Comparisons: `==`, `===`, `<=>`, and `match`

Loose equality applies type juggling rules that have surprised generations of developers. Strict equality compares both type and value. The spaceship operator `<=>` returns `-1`, `0`, or `1` for ordering sorts.

`match` uses **strict** comparison (`===`) and is expression-oriented without fall-through—prefer it for discrete discriminants when exhaustiveness helps readability.

```php
<?php
declare(strict_types=1);

$token = 'deadbeef';
var_dump($token == 0);   // loose numeric context — dangerous for auth comparisons
var_dump($token === 0);  // strict — false
```

For secrets, nonces, and MACs, use `hash_equals` for timing-safe equality of strings, not `===` on raw timing-sensitive compares you built ad hoc.

---

### 4. Integers, floats, and precision policy

Integers are fixed-width per platform (`PHP_INT_MAX`). Overflow wraps for `int` math. BCMath and GMP extensions provide decimal and big-integer arithmetic—use them for money and large counters, not floats.

Floats follow IEEE 754; never compare floats with `==` for business thresholds—use epsilon comparisons or integer minor units (cents).

---

### 5. Strings, encoding, and the byte model

Strings are byte sequences. `strlen` counts bytes; multibyte-aware functions live in `mbstring`. HTTP parameters are bytes labeled by `Content-Type` and charset—treat decoding as an explicit step (chapter 4).

---

### 6. Arrays: lists, maps, packing, unpacking

Arrays are ordered hash tables: keys coerce between int and string under numeric-string rules. Copy-on-write means many “pass array by value” operations are cheap until mutation. Spread operator `...` and destructuring `[$a,$b] = $pair` appear constantly in modern code.

```php
<?php
declare(strict_types=1);

$row = ['id' => 1, 'name' => 'edge'];
foreach ($row as $k => $v) {
    echo $k, ': ', $v, PHP_EOL;
}
```

Large nested arrays as untyped DTOs create audit blind spots—typed value objects document shape.

---

### 7. Operators: null coalesce, Elvis, nullsafe, precedence

`??` returns the first defined, non-null operand; it does not warn on undefined indices combined with null coalesce patterns. `?:` treats `0` and `''` as falsy—wrong default for legitimate zero values.

`?->` short-circuits property/method access on null—chains reduce boilerplate but can hide unexpected null states if overused.

Bitwise operators appear in flags and packed protocols—sign extension on `>>` with negative ints surprises readers from other languages.

---

### 8. `readonly`, `const`, and immutability surface

`readonly` properties cannot be reassigned after construction. Class `const` and enum cases give named immutable values. These patterns matter when services are reused in FPM workers—mutable service fields leak cross-request state if misused.

---

### 9. Array keys: numeric strings, order, and `list`

Array keys are either integers or strings. A string key that looks like an integer in decimal form (e.g. `"42"`) is stored and accessed as the integer `42`—serialization and JSON round-trips can surprise you when keys flip representation. Iteration order follows insertion order for the mixed list/map structure; `ksort` / `krsort` and friends reorder for display or deterministic processing—never assume database `ORDER BY` without applying it in SQL.

`list()` / `[$a, $b] = ...` assigns by **position**; mismatched arity throws in PHP 7+ in strict unpacking scenarios—validate row shape before destructuring query results.

---

### 10. `callable`, `Closure`, and invokable objects

A value is “callable” if it is a function name string, `Class::method` array or string form, a `Closure`, or an object with `__invoke`. Userland type hints of `callable` accept all of these; static analysis struggles with callables built from strings—prefer typed interfaces for security-sensitive dispatch (no user-controlled function names).

First-class callable syntax `strlen(...)` produces a `Closure` wrapping the referenced callable—useful for arrays passed to `array_map`, still dangerous if the underlying function is attacker-chosen.

---

### 11. `void`, `never`, and control flow

`void` means no usable return value; `never` means the function **does not return** (it always throws or exits). Mis-hinting breaks static analysis and reader expectations for middleware stacks and early-exit guards.

---

## 2. Advanced concepts

**Internal vs userland `strict_types`:** Built-in functions use the engine’s argument parser. `strict_types` does **not** govern internal calls the same way it governs calls to your own PHP functions—a strict file can still hit coercion or `TypeError` behavior defined per internal API. For bugs involving only builtins (`strlen`, `array_push`, PDO), read the exact signature and test correct type, near-miss strings, and `null`.

**Numeric strings and `==`:** Loose equality plus numeric-string juggling is a recurring auth and sorting footgun. Security paths: ban `==`; ingest paths: normalize once with `filter_var` (e.g. `FILTER_VALIDATE_INT`) then use strict checks.

**Covariance and contravariance:** Return types may narrow on override; parameters may widen—framework interfaces rely on this; breaking hierarchies shows up as fatal errors at compile/load time.

**Typed properties uninitialized access:** Reading uninitialized typed properties throws `Error`—distinct from `null`able properties.

**Backed enums vs loose comparisons:** Mixing enums with scalars in legacy `switch`/`==` code is a migration hazard—standardize on `match` and explicit `tryFrom`.

**Static analysis levels:** PHPStan/Psalm treat `mixed` as an escape hatch; raising levels forces narrowing at boundaries. CI should match the level developers actually fix, or noise hides real issues.

**Attributes + reflection:** Runtime type hints do not include attributes; frameworks depend on reflection caches—cold start cost is real.

**Copy-on-write and large arrays:** Assigning an array duplicates lazily; the first mutating write to either copy materializes the full structure. Deep copies of huge trees (logging entire `$_POST`, caching decoded JSON verbatim per request) spike RSS in FPM workers—hold references to slices or normalize to DTOs early.

**String increment (`++`):** Alphanumeric string increment has alphabet rules unlike numeric increment—legacy code paths that relied on `"aa"++` for IDs are fragile and audit-worthy.

---

## 3. Applications and use cases

- **HTTP inputs:** Parse with `filter_input`, `filter_var`, dedicated validators—never `(int)$_GET['id']` as an authorization check.
- **JSON APIs:** `JSON_THROW_ON_ERROR`, validate schema, map to DTOs; distinguish JSON `null` from PHP missing keys.
- **Security review:** Ban `==` on password hashes, tokens, and HMAC outputs; require `hash_equals` where timing matters.
- **Sorting and authZ:** Never sort or compare capability strings with locale-sensitive collation unless the product spec explicitly requires it—use deterministic byte or normalized Unicode rules chosen deliberately.
- **Pagination cursors:** Opaque cursors should be signed or encrypted blobs, not `base64(serialize([...]))`—that reintroduces object gadgets if deserialization ever widens.
- **Performance:** Avoid accidental float contagion in tight loops; prefer integers for counters; profile before micro-optimizing.
- **Upgrades:** Run CI with `error_reporting=E_ALL` on staging images; fix deprecations around null, strings, and resource→object migrations early.
- **Code review grep:** `==` outside tests, `(array)` casts on objects, and `callable` parameters fed from `$_GET`/`$_POST` deserve extra scrutiny.

---

## References

- [Types](https://www.php.net/manual/en/language.types.php)
- [Type declarations](https://www.php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration)
- [Operators](https://www.php.net/manual/en/language.operators.php)
- [Comparison operators](https://www.php.net/manual/en/language.operators.comparison.php)
- [Arrays](https://www.php.net/manual/en/language.types.array.php)
- [Enumerations](https://www.php.net/manual/en/language.enumerations.php)
- [Errors — TypeError](https://www.php.net/manual/en/class.typeerror.php)
- [declare](https://www.php.net/manual/en/control-structures.declare.php)
- [Types — Callable](https://www.php.net/manual/en/language.types.callable.php)
