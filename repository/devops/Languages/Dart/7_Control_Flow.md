# Control flow

[← Back to Dart](./README.md)

**Control flow** is how your program decides **what to do next**: run one block of code or another (branches), repeat a block (loops), or handle errors (exceptions). This topic covers **if/else**, **switch**, **for**, **for-in**, **while**, **do-while**, **break/continue**, **try/catch/throw**, and **assert**. In Dart, every **condition** must be a **boolean** expression (**`true`** or **`false`**); there is no automatic conversion from numbers or strings to bool.

---

## If and else

`if` and optional `else if` / `else` run one branch based on a condition:

```dart
if (isRaining()) {
  you.bringRainCoat();
} else if (isSnowing()) {
  you.wearJacket();
} else {
  car.putTopDown();
}
```

**When to use if/else:** Use **`if`** when you have one or a few conditions (e.g. “is it null?”, “is count > 0?”). Use **`else if`** for a chain of mutually exclusive checks. Use **`else`** for the default case. Keep conditions simple and readable; if you have many distinct values to compare, consider **switch** (see below).

**If-case** (Dart 3+) matches a **single pattern** and binds variables when the pattern matches. Use it when you want to “if this value has this shape, then use these parts” without a full **switch**:

```dart
if (pair case [int x, int y]) {
  print('Was coordinate array $x,$y');
} else {
  throw FormatException('Invalid coordinates.');
}
```

---

## Switch

`switch` evaluates a value against several **patterns**. Each `case` is a pattern; when one matches, its body runs. Non-empty cases do not fall through; no `break` is needed. Use `default` or a wildcard pattern for the fallback.

```dart
switch (command) {
  case 'exit':
    exit(0);
  case 'help':
    printHelp();
  case _:
    print('Unknown: $command');
}
```

**When to use switch:** Use **switch** when you are choosing among **many** possible values or patterns (e.g. command names, enum values, or shapes of data). Each **case** is a pattern; the first match runs and then exits (no fall-through). Use **`case _:`** or **`default`** for the fallback. Switch can also be used as an **expression** when every case produces a value (e.g. **`var x = switch (v) { ... };`**).

---

## For loops

**C-style for:** init, condition, update. Closures capture the **value** of the loop variable at each iteration.

```dart
for (var i = 0; i < 5; i++) {
  message.write('!');
}
```

**For-in** iterates over an `Iterable` (e.g. list, set):

```dart
for (final item in collection) {
  process(item);
}
```

**When to use for vs for-in:** Use **C-style for** when you need the **index** (e.g. **`for (var i = 0; i < list.length; i++)`**) or a custom start/step/end. Use **for-in** when you only need **each element** and not the index—it is simpler and less error-prone (e.g. **`for (final item in list)`**). You can use **patterns** in for-in to destructure elements (e.g. **`for (final (k, v) in map.entries)`**).

---

## While and do-while

`while` tests the condition before each iteration; `do-while` runs the body once then tests the condition:

```dart
while (!done) {
  doWork();
}

do {
  doWork();
} while (!done);
```

---

## Break and continue

**`break`** exits the innermost loop or switch. **`continue`** skips the rest of the current iteration and continues the loop.

---

## Exceptions

**Throw** any non-null object; conventionally use types that implement `Exception` or `Error`:

```dart
throw FormatException('Expected at least 1 section');
throw 'Out of llamas!';
```

**Catch** with `on Type` to match by type, and `catch (e, s)` to get the exception and stack trace. You can have multiple clauses; the first matching one runs. Use **`rethrow`** to rethrow the same exception after handling.

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  buyMoreLlamas();
} on Exception catch (e) {
  print('Unknown exception: $e');
} catch (e, s) {
  print('Exception: $e');
  print('Stack trace: $s');
}
```

**`finally`** runs after the try and any catch, whether or not an exception was thrown. Use it for cleanup (e.g. closing a file or connection). **When to throw:** Prefer types that implement **`Exception`** or **`Error`** so callers can catch by type. Use **`rethrow`** when you log or handle an exception but want the caller to handle it as well.

---

## Assert

**`assert(condition)`** throws if the condition is false. Assertions are **enabled only in debug mode**; production builds ignore them. Use asserts for **invariants** during development (e.g. “this list is never empty here”); do **not** use them for runtime error handling that users might hit—use **exceptions** and **checks** instead.

---

## Summary for beginners

- **Branches:** **if/else** for a few conditions; **switch** for many values or patterns. Conditions must be **bool**.
- **Loops:** **for** when you need an index; **for-in** when you only need each element; **while** when you do not know the count in advance; **do-while** when the body must run at least once.
- **break** exits the loop or switch; **continue** skips to the next iteration.
- **Exceptions:** **try/catch** to handle errors; **throw** to signal errors; **finally** for cleanup. Use **assert** only for development-time checks.

---

## Further reading

- [Dart language — Loops](https://dart.dev/language/loops)
- [Dart language — Branches](https://dart.dev/language/branches)
- [Dart language — Error handling](https://dart.dev/language/error-handling)
