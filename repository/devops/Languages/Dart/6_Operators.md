# Operators

[← Back to Dart](./README.md)

**Operators** are symbols that perform an operation on one or two values (e.g. **`+`**, **`==`**, **`&&`**). Dart supports arithmetic, comparison, logical, bitwise, assignment, and special operators (null-aware, cascade, spread). This topic summarizes the main operators and **when** to use them; **precedence** and **associativity** follow the language grammar—use parentheses when it makes intent clearer. Many operators can be **overridden** in classes (Topic 10–11).

---

## Arithmetic

`+`, `-`, `*`, `/`, `%`, and for integers `~/` (truncating division). Unary: `-expr`, `++expr`, `expr++`, `--expr`, `expr--`.

```dart
assert(5 / 2 == 2.5);
assert(5 ~/ 2 == 2);
var a = 1;
a++;
assert(a == 2);
```

---

## Equality and comparison

`==` and `!=` for equality. `==` can be overridden; use it for value equality. Comparison: `<`, `>`, `<=`, `>=`. Type test: `is`, `is!`, and cast with `as`.

```dart
assert(2 == 2);
assert(2 != 3);
assert(3 > 2);
if (o is String) {
  print(o.length);
}
var s = o as String;
```

---

## Logical

`!expr` (negation), `&&` (and), `||` (or). Conditions require boolean expressions; no implicit conversion from other types.

```dart
if (done && count > 0) {
  // ...
}
```

---

## Null-aware and conditional

**`??`** returns the left operand if not null, otherwise the right. **`??=`** assigns only when the variable is null. **`?.`** and **`?[]`** short-circuit to null if the receiver is null. **`!`** (postfix) asserts non-null and throws if the value is null.

```dart
String? name;
var display = name ?? 'Guest';
name ??= 'Unknown';

int? length = nullableString?.length;
var first = list?[0];
var len = nullableString!.length;  // Throws if null.
```

**Conditional expression:** `condition ? expr1 : expr2` evaluates one of the two expressions.

---

## Cascade

**`..`** and **`?..`** apply a sequence of operations on the same object without repeating the target. The result is the object itself (not the result of the last call).

```dart
var buffer = StringBuffer()
  ..write('Hello')
  ..write(' ')
  ..write('World');
```

---

## Assignment

`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `~/=`, and bitwise/compound assignments. Assignment is an expression; it evaluates to the assigned value.

---

## Spread

In list and map literals, **`...`** spreads the elements of an iterable; **`...?`** spreads only when the iterable is non-null.

```dart
var list = [1, 2, ...more];
var list2 = [1, 2, ...?nullableList];
```

---

## Precedence

Operator precedence (highest to lowest) is roughly: postfix (`!`, `++`, `[]`, `.`, `?.`), unary prefix (`-`, `!`, `~`, `++`, `--`, `await`), multiplicative (`*`, `/`, `%`, `~/`), additive (`+`, `-`), shift, bitwise, relational and type test, equality, logical AND, logical OR, if-null, conditional, cascade, assignment. Use parentheses when it improves readability or when in doubt. **Summary:** Use **`?.`** and **`??`** with nullable values; use **`..`** to chain operations on the same object; use **`...`** / **`...?`** in list/map literals to spread elements. For full precedence, see the language specification.

---

## Further reading

- [Dart language — Operators](https://dart.dev/language/operators)
