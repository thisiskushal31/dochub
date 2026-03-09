# Enums, extension methods, and extension types

[← Back to Dart](./README.md)

**Enums** define a fixed set of constant values. **Extension methods** add new methods to existing types without modifying them. **Extension types** (Dart 3+) wrap an existing type to provide a different interface or guarantees at compile time. Together they keep APIs clear and type-safe without subclassing.

---

## Enums

Declare an **enum** with **`enum`**. Each value is a constant instance. Enums can have fields, constructors, and methods. They are useful for a fixed set of options (e.g. state, mode).

```dart
enum Color { red, green, blue }

void main() {
  Color c = Color.red;
  print(c.name);
  print(Color.values);
}
```

Enhanced enums (Dart 2.17+) can hold state and implement methods:

```dart
enum Vehicle { car(4), bike(2);
  final int wheels;
  const Vehicle(this.wheels);
}
```

---

## Extension methods

**Extensions** add members to existing types. Define one with **`extension ... on Type`**. The methods are available on that type as if they were declared on it. Extensions are statically resolved; they do not change the type at runtime.

```dart
extension NumberParsing on String {
  int? tryParseInt() => int.tryParse(this);
}

void main() {
  var s = '42';
  var n = s.tryParseInt();
}
```

You can name the extension or make it unnamed. Use **`show`** or **`hide`** in the extension’s import to avoid name clashes.

---

## Extension types

**Extension types** (Dart 3+) wrap a **representation type** and expose a different API. They are zero-cost at runtime: the representation type is what runs. Use them to give a type a more specific interface or to enforce invariants.

```dart
extension type Id(int id) {
  Id get next => Id(id + 1);
}
```

The constructor **`Id(int id)`** stores the representation. You can define constructors, getters, setters, and methods. Extension types do not support inheritance; they are a way to wrap and refine a single type.

---

## When to use which

Use **enums** for a fixed set of named constants. Use **extension methods** to add convenience methods to existing types (including from other packages). Use **extension types** when you need a distinct type that is backed by an existing type and you want no runtime overhead.

---

## Further reading

- [Dart language — Enums](https://dart.dev/language/enums)
- [Dart language — Extension methods](https://dart.dev/language/extension-methods)
- [Dart language — Extension types](https://dart.dev/language/extension-types)
