# Classes, objects, OOP, and modern features

[← Back to PHP](./README.md)

## What this chapter covers

Property and method visibility, inheritance contracts, traits and conflict resolution, late static binding, readonly properties, backed and pure enums, attributes consumed via reflection, magic methods as an audit surface, and serialization hooks that interact with deserialization gadgets. Later chapters tie these ideas to dependency injection containers, ORMs, and security reviews.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Classes, objects, handles

Objects are handles to structured state; assignment copies the handle, not deep object state. `public`, `protected`, and `private` gate visibility. `final` prevents subclassing when invariants must not be widened.

```php
<?php
declare(strict_types=1);

final class Counter
{
    public function __construct(private int $value = 0) {}

    public function inc(): void
    {
        $this->value++;
    }

    public function value(): int
    {
        return $this->value;
    }
}
```

Constructor property promotion reduces boilerplate but embeds defaults in signatures—migration tooling must see them.

---

### 2. Inheritance, abstraction, interfaces

Single inheritance with `extends`; interfaces define contracts frameworks depend on (`Iterator`, PSR interfaces). Abstract classes share partial implementation.

---

### 3. Traits

Traits copy methods into classes; `insteadof` and `as` resolve conflicts. Deep trait stacks obscure control flow—prefer explicit composition for security-sensitive code paths.

---

### 4. Static, late static binding, singletons

`self::` refers lexically; `static::` respects the runtime called class (late static binding). Singletons and service locators complicate testing and can retain mutable state across FPM requests if mis-scoped.

---

### 5. Readonly and immutability

`readonly` properties are set once; cloning requires explicit patterns (`clone` with `__clone`) if immutability must be preserved through duplication.

---

### 6. Enumerations

Backed enums carry scalar values; pure enums are symbolic. `Enum::tryFrom` validates external strings better than unchecked casts.

```php
<?php
declare(strict_types=1);

enum Env: string
{
    case Dev = 'dev';
    case Prod = 'prod';
}

$raw = getenv('APP_ENV') ?: 'dev';
$e = Env::tryFrom($raw) ?? Env::Dev;
```

---

### 7. Attributes

Attributes attach metadata read via reflection at boot (routes, validation, serialization). Attribute parsing cost is paid during warmup—large attribute graphs affect cold start.

---

### 8. Magic methods

`__call`, `__get`, `__set`, `__isset`, `__unset`, `__sleep`, `__wakeup`, `__serialize`, `__unserialize`, `__destruct`, and `__toString` create implicit behavior static analysis and grep miss. Pair magic with tests and code review checklists, especially near deserialization.

---

### 9. Interfaces, `Iterator`, and `Countable`

Frameworks type-hint `Iterator`, `Traversable`, `ArrayAccess`, `JsonSerializable`, and domain-specific interfaces constantly. Implementing these incorrectly (`offsetExists` without matching `offsetGet` semantics, non-rewindable iterators) produces subtle bugs in `foreach` and JSON encoding—test edge cases (empty, single element, large sets) rather than only happy paths.

---

## 2. Advanced concepts

**Property hooks (language evolution):** Newer versions may add syntax around properties—pin CI images to the minor you deploy when adopting bleeding-edge features.

**Variance rules:** Method overrides must respect parameter contravariance and return covariance—framework upgrades can surface fatal incompatibilities in subclasses.

**Object cloning and resources:** `__clone` must duplicate or rebind resources carefully to avoid double-close bugs.

**ORM identity maps:** Some ORMs cache entities per request; long-lived async workers break assumptions—verify unit-of-work scope.

**Serialization gadgets:** Magic methods plus autoloadable classes form deserialization gadget graphs—inventory dangerous classes during threat modeling.

**Anonymous classes:** `new class {}` captures scope; useful for tests and one-off adapters—grep-unfriendly in reviews, easy to hide privileged logic.

**Object comparison:** Two object instances with `==` compares property values for same class in older mental models but prefer explicit equality methods for domain objects—`===` is identity only.

---

## 3. Applications and use cases

- **DI containers:** Bind interfaces to env-specific implementations (mailers, caches); document container build time vs request scope.
- **API DTOs:** Readonly promoted properties stabilize OpenAPI generation and response mapping.
- **Security:** Review `__destruct` side effects, `__toString` exceptions breaking logs, and dynamic `__call` dispatch on attacker-influenced method names.
- **Performance:** Avoid heavy reflection in hot loops; cache metadata where frameworks allow.
- **Migrations:** Attribute-based routing/config replaces docblock annotations—plan codemods and analyzer rules when upgrading frameworks.

---

## References

- [Classes and Objects](https://www.php.net/manual/en/language.oop5.php)
- [Enumerations](https://www.php.net/manual/en/language.enumerations.php)
- [Attributes](https://www.php.net/manual/en/language.attributes.php)
- [Magic Methods](https://www.php.net/manual/en/language.oop5.magic.php)
- [Object cloning](https://www.php.net/manual/en/language.oop5.cloning.php)
- [Traits](https://www.php.net/manual/en/language.oop5.traits.php)
