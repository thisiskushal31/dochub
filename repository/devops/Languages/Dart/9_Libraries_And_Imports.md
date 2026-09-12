# Libraries and imports

[← Back to Dart](./README.md)

As your program grows, you split it into **multiple files** and **libraries**. Every Dart file is a **library**; you **import** other libraries to use their APIs. Libraries also define **privacy**: names starting with **`_`** are visible only inside that library (there are no **public**/ **private** keywords). This topic explains **import**, **prefixes**, **show**/ **hide**, **deferred** loading, and when to use each—so you can organize code clearly and avoid name clashes.

---

## Using libraries

Use **`import`** with a URI that points to the library. Built-in libraries use the **`dart:`** scheme. Package libraries use the **`package:`** scheme (managed by pub).

```dart
import 'dart:html';
import 'package:test/test.dart';
```

File paths can also be used for relative imports (e.g. `import 'lib/utils.dart';`).

---

## Library prefix

If two libraries define the same identifier, use **`as`** to add a prefix to one (or both):

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

Element e1 = Element();
lib2.Element e2 = lib2.Element();
```

---

## Selective import

Use **`show`** to import only certain members, or **`hide`** to import everything except certain members:

```dart
import 'dart:math' show Random, sqrt;
import 'dart:io' hide File;
```

---

## Deferred loading

Use **`deferred as`** to load a library lazily (e.g. to reduce initial load). Load it with **`await identifier.loadLibrary()`** before using its APIs. Deferred loading is common in web apps.

```dart
import 'package:greetings/hello.dart' deferred as hello;

Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

---

## library directive

The **`library`** directive names the library and can attach metadata. It is optional; the file URI is the default identity. **`part`** and **`part of`** split a library across files; **`export`** re-exports another library’s public API. Prefer small, focused libraries and explicit imports over large `part`/`export` graphs.

---

## Further reading

- [Dart language — Libraries & imports](https://dart.dev/language/libraries)
