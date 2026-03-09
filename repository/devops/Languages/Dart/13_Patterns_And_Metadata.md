# Patterns and metadata

[← Back to Dart](./README.md)

**Patterns** (Dart 3+) match and destructure values in assignments, switch cases, for-in loops, and if-case. They reduce boilerplate and make intent clear. **Metadata** (annotations) attach metadata to declarations; tools and frameworks use them for configuration, code generation, or reflection.

---

## What patterns do

Patterns **match** a value against a shape (e.g. record, list, map, object) and **destructure** it by binding variables to parts of the value. They appear in:

- **Variable declarations:** `var (x, y) = point;`
- **Switch cases:** `case [int x, int y]:`
- **If-case:** `if (pair case [int x, int y]) { ... }`
- **For-in:** `for (final (name, count) in pairs) { ... }`

---

## Pattern categories

**Literal patterns** match a specific value: `1`, `'a'`, `true`, `null`. **Variable patterns** bind a variable: `x`, `_`. **Object patterns** match an object and destructure its fields: `Point(x: 0, y: y)`. **Record patterns** match records: `(0, y)`, `(x: 0, y: y)`. **List and map patterns** match list/map shapes and bind elements: `[a, b]`, `{'k': v}`. **Logical patterns** combine patterns: `a && b`, `a || b`, `!a`. **Cast patterns** match and cast: `foo as String`.

---

## Example: destructuring a record

```dart
var record = (1, 2, name: 'first');
var (a, b, name: n) = record;
print('$a $b $n');
```

---

## Example: switch with patterns

```dart
Object value = ...;
switch (value) {
  case int n:
    print('int: $n');
  case (int x, int y):
    print('point: $x, $y');
  case {'name': String name}:
    print('name: $name');
  default:
    print('other');
}
```

---

## Metadata

**Metadata** are annotations prefixed with **`@`**. Common ones: **`@override`** (overriding a superclass member), **`@deprecated`** (marking something deprecated), **`@pragma`** (hints for the compiler). Custom annotations are classes (often with a `const` constructor).

```dart
@override
void dispose() {}

@Deprecated('Use newApi() instead')
void oldApi() {}
```

Frameworks (e.g. Flutter, testing, code generation) define their own annotations. Metadata is read by the analyzer and by tools; it does not change behavior by itself.

---

## Further reading

- [Dart language — Patterns](https://dart.dev/language/patterns)
- [Dart language — Pattern types](https://dart.dev/language/pattern-types)
- [Dart language — Metadata](https://dart.dev/language/metadata)
