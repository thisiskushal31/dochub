# Null safety in depth

[← Back to Dart](./README.md)

Dart’s **sound null safety** means the type system and runtime guarantee: if a type is non-nullable, it never holds `null`. That turns many possible null dereferences into **compile-time** errors and allows optimizations. You opt in per variable or type by using **`?`** for nullable types and by initializing or marking non-nullable variables correctly.

---

## Nullable vs non-nullable

**Non-nullable** types (`String`, `int`, custom classes) never include `null`. **Nullable** types (`String?`, `int?`) can be `null` or a value of the underlying type. The compiler enforces that you do not assign `null` to a non-nullable variable or use a nullable value where a non-nullable value is required without a check or promotion.

```dart
String name = 'Dart';
String? nickname = null;
name = nickname;  // Error: String? not assignable to String.
```

---

## Initialization and flow analysis

Non-nullable variables must be **definitely assigned** before use. The compiler uses **flow analysis** to track assignments and conditions. After a check like `if (x != null)`, the type is **promoted** to non-nullable in the then branch. Same for `if (x == null) return;` — after that, `x` is promoted.

```dart
int? x = maybeValue();
if (x == null) return;
print(x.isEven);  // x promoted to int.
```

---

## Late variables

When the compiler cannot prove that a non-nullable variable is set before use (e.g. a top-level or instance variable set later), mark it **`late`**. You promise it will be initialized before access. **`late`** is also used for **lazy** initialization: the initializer runs the first time the variable is read.

```dart
late String description;
void init() {
  description = 'Computed';
}
```

---

## Null-aware operators

Use **`?.`** to call a method or access a property only when the receiver is non-null; the expression result is nullable. Use **`??`** to provide a default when the left side is null. Use **`!`** to assert non-null (throws if the value is null). Prefer promotion and null checks over **`!`** where possible.

```dart
int? length = nullableString?.length;
String display = name ?? 'Guest';
String forced = nullableString!;
```

---

## Generics and null safety

Generic types respect null safety: `List<int>` has no nulls; `List<int?>` can. When defining APIs, prefer non-nullable type parameters by default and use **`T?`** or bounds when null is allowed. That keeps call sites and implementations clear.

---

## Migrating to null safety

Existing code can be migrated incrementally. The analyzer reports where nulls can flow into non-nullable types. Add `?`, defaults, null checks, or `late` as needed. Avoid **`dynamic`** and unnecessary casts when fixing; use the type system to document and enforce nullability.

---

## Further reading

- [Sound null safety](https://dart.dev/null-safety)
- [Understanding null safety](https://dart.dev/null-safety/understanding-null-safety)
