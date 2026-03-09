# Types

[← Back to Dart](./README.md)

Dart is **type safe**: every variable has a type, and the type system ensures values match. Type annotations are **optional** for local variables because of **type inference**. This topic walks through the **built-in types** you will use every day—numbers, strings, booleans, lists, sets, maps, and records—and when to use each. It also briefly explains the roles of **Object**, **dynamic**, **void**, and **Never** so you can read APIs and error messages confidently.

---

## Why types matter

Types tell the **compiler** and **you** what kind of data a variable holds. That lets the compiler catch mistakes (e.g. passing a string where a number is expected) and enables **autocomplete** and **refactoring** in editors. In Dart, once a variable has a type (by inference or annotation), you cannot assign a value of a different type unless it is a **subtype** (e.g. **`int`** is a subtype of **`num`**). So types are both a safety net and documentation.

---

## Numbers

Dart has two numeric types: **`int`** (integers) and **`double`** (64-bit floating point). Both are subtypes of **`num`**, which provides `+`, `-`, `*`, `/`, `abs()`, `ceil()`, `floor()`, etc. Integer literals have no decimal point; literals with a decimal point are doubles.

```dart
var x = 1;
var hex = 0xDEADBEEF;
var y = 1.1;
var exponents = 1.42e5;

num n = 1;
n += 2.5;  // num can hold both int and double.
```

**When to use which:** Use **`int`** for whole numbers (counts, indices, IDs). Use **`double`** for decimals (prices, coordinates, ratios). Use **`num`** when a variable might hold either (e.g. a generic “number” from user input or an API). Convert between strings and numbers with **`int.parse()`**, **`double.parse()`**, and **`toString()`** when you read or display data.

---

## Strings

Strings are **`String`** values. You can use single or double quotes. Interpolation: `$variable` or `${expression}`. Multiline strings use triple quotes.

```dart
var s1 = 'Single quotes';
var s2 = "Double quotes";
var s3 = 'Result: ${3 + 4}';
var s4 = '''
Multiline
string
''';
```

Strings are **immutable**: methods like **`toUpperCase()`** return a *new* string; they do not change the original. **When to use:** Single or double quotes are equivalent; pick one style and stick to it. Use **`$variable`** or **`${expression}`** for interpolation. Use **triple quotes** for multiline text. Use the **`r`** prefix when you need a **raw** string (e.g. **`r'Raw \n'`** keeps the backslash and **n** literal).

---

## Booleans

Only **`bool`** values **`true`** and **`false`** are allowed in **conditions** (e.g. **`if (done)`**). Unlike in some other languages, there is **no** automatic conversion from numbers or strings to bool—so **`if (1)`** is not valid; you must write something like **`if (count > 0)`**.

---

## Lists

**`List`** is an ordered collection. Literals use square brackets. Dart infers the element type (e.g. `List<int>`).

```dart
var list = [1, 2, 3];
assert(list.length == 3);
assert(list[1] == 2);
list[1] = 1;
```

**When to use:** Lists are **ordered** and allow **duplicates**; use them for sequences (e.g. a list of names, a queue of tasks). Access by **index** with **`list[i]`**; indices start at **0**. Use **`const [1, 2, 3]`** when the list never changes so the compiler can optimize.

---

## Sets

**`Set`** is an unordered collection of unique elements. Literals use curly braces. Empty sets need a type: `<String>{}` (plain `{}` is a map).

**When to use:** Sets are **unordered** and store **unique** values; use them when you care about “is this item in the collection?” and not order or duplicates (e.g. tags, unique IDs). For an **empty** set you must give a type: **`<String>{}`**—plain **`{}`** is a map, not a set.

```dart
var halogens = {'fluorine', 'chlorine', 'bromine'};
var names = <String>{};
```

---

## Maps

**`Map`** associates keys with values. Literals use `key: value` inside `{}`. Keys and values can be any type.

```dart
var gifts = {'first': 'partridge', 'second': 'turtledoves'};
var nobleGases = {2: 'helium', 10: 'neon'};
```

**When to use:** Maps associate **keys** with **values**; use them for lookups (e.g. **id → user**, **key → config**). Keys and values can be any type. Empty map: **`{}`** or **`<String, int>{}`** when you need a typed empty map.

---

## Records

**Records** (Dart 3+) are anonymous, immutable aggregates of named or positional fields. They are useful for returning multiple values or grouping data without defining a class.

```dart
var record = (1, 2);
var named = (x: 1, y: 2);
int first = record.$1;
int x = named.x;
```

**When to use:** Records (Dart 3+) are for **grouping a few values** without defining a class—e.g. returning **multiple** values from a function or holding a **pair** of (key, value). Use a **class** when you need methods, a name, or many fields; use a **record** when you need a small, anonymous bundle of values.

---

## Type system roles

- **`Object`** — supertype of all classes except `Null`.
- **`Object?`** — supertype of all types (including nullable).
- **`dynamic`** — disables static checking; use sparingly; prefer `Object?` when you need “any value”.
- **`void`** — indicates a value is never used; common as return type.
- **`Never`** — indicates an expression never completes (e.g. always throws).

**Generics** let you parameterize types: **`List<int>`** (list of integers), **`Map<String, int>`** (map from string to int). That way the compiler and tools know what is inside the collection. **Typedefs** and the full type system (subtyping, inference) are in the language specification; for daily use, stick to the built-in types and **`List<T>`** / **`Map<K,V>`** and you will be set.

---

## Further reading

- [Dart language — Built-in types](https://dart.dev/language/built-in-types)
- [Dart language — Records](https://dart.dev/language/records)
- [Dart language — Collections](https://dart.dev/language/collections)
- [Dart language — Generics](https://dart.dev/language/generics)
- [Dart language — Type system](https://dart.dev/language/type-system)
