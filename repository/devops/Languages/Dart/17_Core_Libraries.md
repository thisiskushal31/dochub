# Core libraries

[← Back to Dart](./README.md)

The Dart SDK includes **core libraries** that you use in almost every program: types and collections (**dart:core**), async (**dart:async**), math (**dart:math**), JSON and encoding (**dart:convert**), and I/O (**dart:io** on native/server). **dart:core** is always available; the rest you **import** when needed. This topic summarizes what each library provides and **when** to use it—so you can choose the right API for apps, servers, and CLI tools from beginner to advanced.

---

## dart:core

**`dart:core`** is always available. It provides:

- **Built-in types:** `num`, `int`, `double`, `String`, `bool`, `List`, `Set`, `Map`, `Object`, `Null`, `Never`, `dynamic`, `void`, `Function`.
- **Collections:** list/set/map literals and base APIs.
- **Dates and times:** `DateTime`, `Duration`.
- **Comparisons and hashing:** `Comparable`, `identical()`, `hashCode`.
- **Strings:** interpolation, `runes`, and string utilities.
- **Types and reflection:** `Type`, `runtimeType`, and (in supported contexts) reflection APIs.

You do not need to write `import 'dart:core';`; it is implicit.

---

## dart:async

**`dart:async`** provides **`Future`** and **`Stream`** for asynchronous programming, plus **`StreamController`**, **`Timer`**, **`Completer`**, and **`Zone`**. Use it whenever you use `async`/`await`, timeouts, or event streams. It is available on all platforms.

```dart
import 'dart:async';

Future<void> main() async {
  await Future.delayed(Duration(seconds: 1));
  print('Done');
}
```

---

## dart:math

**`dart:math`** provides constants (**`pi`**, **`e`**), functions (**`sqrt`**, **`sin`**, **`cos`**, **`max`**, **`min`**, **`log`**, etc.), and **`Random`** for random number generation.

```dart
import 'dart:math';

var n = sqrt(2);
var r = Random().nextDouble();
```

---

## dart:convert

**`dart:convert`** provides encoders and decoders for **JSON** (**`jsonEncode`**, **`jsonDecode`**) and **UTF-8** (**`utf8.encode`**, **`utf8.decode`**), plus other codecs. Essential for APIs and file I/O.

```dart
import 'dart:convert';

var json = jsonEncode({'name': 'Dart'});
var map = jsonDecode('{"name": "Dart"}');
```

---

## dart:io

**`dart:io`** is available only on **native** platforms (not web). It provides **`File`**, **`Directory`**, **`HttpServer`**, **`HttpClient`**, **`Process`**, **`Socket`**, **`Platform`**, and **`stdin`**/**`stdout`**/**`stderr`**. Use it for server apps, CLI tools, and Flutter (mobile/desktop) when you need files or network.

```dart
import 'dart:io';

void main() async {
  var file = File('data.txt');
  var contents = await file.readAsString();
}
```

---

## Web: dart:js_interop and package:web

On the **web**, **`dart:io`** is not available. Use **`dart:js_interop`** to call JavaScript and **`package:web`** (and related packages) for DOM and web APIs. The core libraries overview and web docs describe the mapping.

---

## Iterables and collections

**`dart:core`** defines **`Iterable`**; lists and sets implement it. The **iterable collections** guide covers `where`, `map`, `toList`, `expand`, and other operations. For more collection types and utilities, see **`dart:collection`** (e.g. **`Queue`**, **`HashMap`**, **`LinkedHashSet`**).

---

## Further reading

- [Dart libraries — Overview](https://dart.dev/libraries)
- [dart:core](https://api.dart.dev/stable/dart-core/dart-core-library.html)
- [dart:async](https://api.dart.dev/stable/dart-async/dart-async-library.html)
- [dart:convert](https://api.dart.dev/stable/dart-convert/dart-convert-library.html)
- [dart:io](https://api.dart.dev/stable/dart-io/dart-io-library.html)
