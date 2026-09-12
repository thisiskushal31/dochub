# Variables and null safety

[← Back to Dart](./README.md)

Variables are how you **store and refer to data** in your program. This topic explains how to declare and use variables in Dart and what **null safety** means in practice—so you can write clear, safe code from the start and avoid a whole class of runtime crashes.

---

## What is a variable?

A **variable** is a **named container** for a value. You give it a **name** (e.g. **`name`**, **`count`**) and optionally a **type** (e.g. **`String`**, **`int`**). Once you put a value in it, you can use the name later to read or update that value (unless the variable is **`final`** or **`const`**). In Dart, variables hold **references** to **objects** (including numbers and booleans); they do not hold “raw” bytes. So when we say “the variable holds a string,” we mean it holds a reference to a **`String`** object.

---

## Declaring variables: var and explicit types

The simplest way to create a variable is to use **`var`** and an **initial value**. Dart then **infers** the type from that value. You do not have to write the type yourself.

```dart
var name = 'Bob';
var count = 0;
var done = false;
```

Here **`name`** is inferred as **`String`**, **`count`** as **`int`**, and **`done`** as **`bool`**. You can use them like this:

```dart
print(name);   // Bob
count = count + 1;
```

You can also write the **type explicitly**. That is useful when you want the variable to accept a **wider** type (e.g. **`Object`**) or when you want to make the type obvious to readers (e.g. in public APIs).

```dart
String name = 'Bob';
Object value = 42;   // Can hold any object.
```

**When to use `var`:** For **local** variables, when the type is obvious from the right-hand side (e.g. **`var list = [1, 2, 3];`** → **`List<int>`**). **When to use an explicit type:** For **public** APIs (function parameters, return types, class fields) or when you want to document the type clearly. Effective Dart recommends **`var`** for local variables when the type is clear.

---

## Null safety: why it matters

In many languages, “no value” is represented by **`null`**. If you forget to check for null and use the value anyway (e.g. call a method on it), the program **crashes** with a “null dereference” error. Dart’s **null safety** is designed to prevent that: the **compiler** and **analyzer** force you to be explicit about where **`null`** is allowed and to **check** or **handle** null before using a value. So:

- If a variable is **non-nullable** (e.g. **`String`**), the compiler guarantees it will **never** hold **`null`** at runtime. You can use it without null checks.
- If a variable is **nullable** (e.g. **`String?`**), it *can* be **`null`**. Before you call methods or use properties on it, you must either **check** that it is not null, **provide a default** (e.g. with **`??`**), or **assert** non-null (e.g. **`!`**) when you are sure.

So **null safety** moves many possible **runtime** crashes to **compile time**: you fix them before you run or ship.

---

## Nullable vs non-nullable types

You make a type **nullable** by adding **`?`** after it. Without **`?`**, the type is **non-nullable**.

```dart
String name = 'Bob';    // Never null.
String? nickname;       // Can be null; defaults to null.
```

- **`String`** — Must always hold a **`String`**. You must give it a value before you read it (e.g. in the initializer or in every branch that uses it).
- **`String?`** — Can hold a **`String`** or **`null`**. If you do not initialize it, it starts as **`null`**.

The compiler will report an error if you assign **`null`** to a non-nullable variable or pass a **`String?`** where a **`String`** is required without handling the null case. So you are forced to decide: “Can this be null or not?” and then write the code accordingly.

---

## Default value and initialization

- **Nullable** variables (**`int?`**, **`String?`**) that you do not initialize have the default value **`null`**.
- **Non-nullable** variables (**`int`**, **`String`**) have **no** default. You **must** assign a value before the first time they are **read**. For **local** variables, the compiler uses **flow analysis**: if every path to a read has an assignment, the code is valid.

Example: assign in different branches, but every path that reaches **`print(lineCount)`** has assigned **`lineCount`**:

```dart
int lineCount;

if (weLikeToCount) {
  lineCount = countLines();
} else {
  lineCount = 0;
}

print(lineCount);   // OK: lineCount is assigned on every path.
```

If the compiler cannot prove that a non-nullable variable is assigned before use (e.g. a **top-level** or **instance** variable that is set later), you will get an error. In those cases you use **`late`** (see below).

---

## Late variables

**`late`** means: “This variable will be initialized before it is used, but the compiler cannot prove it.” You promise to set it before the first read. Use **`late`** when:

- You have a non-nullable **top-level** or **instance** variable that you assign in a function or constructor body (or from outside) before anyone reads it.
- You want **lazy** initialization: the initializer runs only the **first time** the variable is read.

Example: variable set before use, but the compiler does not track that:

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

Example: lazy initialization—**`readThermometer()`** is called only the first time **`temperature`** is read:

```dart
late String temperature = readThermometer();
```

Use **`late`** only when you are sure the variable will be set (or initialized) before access; otherwise you get a runtime error.

---

## Final and const

- **`final`** — The variable can be set **once** (at declaration or later). After that, it cannot be changed. Use it for values that never change after initialization.

```dart
final name = 'Bob';
final String nickname = 'Bobby';
```

- **`const`** — The value is a **compile-time constant**. The variable is implicitly **final**. Use it for values that are known at compile time and never change (e.g. configuration, fixed lists or maps).

```dart
const bar = 1000000;
const double atm = 1.01325 * bar;
```

You can also use **`const`** for **values** and **constructors** (e.g. **`const []`**, **`const Point(0, 0)`**). Const values are canonical: **`const [1,2]`** and another **`const [1,2]`** are the same object. Use **`const`** when you can to improve performance and express intent.

---

## Wildcard variables

A variable named **`_`** (underscore) is a **non-binding** placeholder: you do not use its value. It is useful in **patterns**, **catch** clauses, or **callbacks** when you must write a variable but do not care about it. Multiple **`_`** in the same scope are allowed; they are independent placeholders.

---

## Summary for beginners

- **Variables** store references to values. Use **`var`** with an initial value for locals when the type is obvious; use explicit types when you want clarity or a wider type.
- **Null safety:** **`Type?`** means “can be null”; **`Type`** means “never null.” The compiler enforces this so you handle null where it is allowed.
- **Non-nullable** variables must be **assigned before first read**; use **`late`** when the compiler cannot prove that.
- Use **`final`** for “set once”; use **`const`** for compile-time constants. Use **`_`** when you need a name but do not use the value.

Next, **Topic 5 (Types)** goes into the built-in types (numbers, strings, lists, maps, etc.) and how they work with variables and null safety.

---

## Further reading

- [Dart language — Variables](https://dart.dev/language/variables)
- [Sound null safety](https://dart.dev/null-safety)
