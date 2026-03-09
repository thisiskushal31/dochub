# Functions

[← Back to Dart](./README.md)

**Functions** are reusable blocks of code that take **parameters** (inputs) and optionally **return** a value. In Dart, functions are **objects**: they have type **`Function`**, can be stored in variables, and passed to or returned from other functions. This topic covers how to **define** and **call** functions, **parameters** (required, optional positional, named, defaults), **arrow** syntax, **main()**, and **first-class** use (e.g. callbacks). After this you will be able to structure programs into clear, testable pieces.

---

## Defining functions

Specify the return type (or omit it and use inference), the name, and the parameter list. Use **arrow syntax** (`=> expr`) for a single expression:

```dart
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}

bool isNobleShort(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

Only **expressions** can appear after **`=>`** (something that produces a value); **statements** (e.g. a bare **`if`** or **`print`**) are not allowed there. For **public** APIs (libraries, classes), use explicit **return** and **parameter** types so callers and tools know the contract. **When to use arrow:** Use **`=> expr`** for one-liners that compute and return a value; use a **block** **`{ ... }`** when you have multiple statements or need **`return`** explicitly.

---

## Parameters

**Required positional** parameters come first. Then you can have either **optional positional** parameters in `[]` or **named** parameters in `{}`, but not both after the same required parameters.

**Named parameters** are optional unless marked **`required`**. When calling, use `name: value`. Omitted named parameters default to `null` unless you give a default:

```dart
void enableFlags({bool? bold, bool? hidden}) {}

enableFlags(bold: true, hidden: false);

void greet({String name = 'Guest'}) {}
greet(name: 'Alice');
```

**Optional positional** parameters use square brackets. Defaults must be compile-time constants:

```dart
String join([String sep = ', ', String? suffix]) {
  // ...
}
```

---

## main()

The entry point is **`main()`**. It can take an optional **`List<String>`** argument for command-line arguments:

```dart
void main(List<String> arguments) {
  print(arguments);
}
```

---

## Functions as first-class objects

You can pass a function as an argument or assign it to a variable:

```dart
void printElement(int element) {
  print(element);
}

var list = [1, 2, 3];
list.forEach(printElement);
```

Anonymous functions (lambdas) use `(params) { body }` or `(params) => expression`:

```dart
list.forEach((item) => print(item));
list.forEach((item) {
  print(item);
});
```

---

## Lexical scope and closures

Dart is lexically scoped: variables are resolved at the point of definition. Functions close over variables in scope and retain access to them (closures). Closures capture variables by value at the time of the closure creation where the language specifies it (e.g. loop variables in for loops).

---

## Return values

If no return type is specified, the function is inferred or treated as returning **`dynamic`**. A function that does not **return** a value (or uses **`return;`**) effectively returns **`null`**; you can declare that as **`void`**. Use **`Never`** as the return type for functions that **never** return normally (e.g. always throw or exit).

---

## Summary for beginners

- **Define** a function with a name, parameters in **`( )`**, and a body in **`{ }`** or **`=> expr`**.
- **Required** parameters come first; **optional** ones go in **`[ ]`** (positional) or **`{ }`** (named). Use **named** parameters when there are several optional args or the call site is clearer with names.
- **Call** with **`name(args)`** or **`name(name: value)`** for named args. **main()** is the entry point and can take **`List<String> arguments`**.
- Functions are **values**: you can pass them (e.g. **`list.forEach(print)`**) or use **anonymous** functions **`(x) => x * 2`**. Use this for callbacks and higher-order logic.

---

## Further reading

- [Dart language — Functions](https://dart.dev/language/functions)
