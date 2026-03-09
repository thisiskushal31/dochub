# Interoperability

[← Back to Dart](./README.md)

Dart can interoperate with **C**, **Java/Kotlin**, **Objective-C/Swift**, and **JavaScript**. Use **C interop** (FFI) for native libraries and performance; **Java/Kotlin** and **Objective-C/Swift** for Android and iOS when using Flutter or embedding Dart; **JavaScript interop** for the web and Node. Each has a different API and tooling; choose based on platform and use case.

---

## C interop (FFI)

**Dart FFI** (Foreign Function Interface) lets you call **C** code from Dart. You declare C functions and types in Dart and use **`dart:ffi`** to load dynamic libraries and invoke them. Use for existing C libraries, performance-critical code, or system APIs. Memory and lifetime are your responsibility; avoid leaking or double-freeing.

```dart
import 'dart:ffi';

typedef NativeAdd = Int32 Function(Int32 a, Int32 b);
typedef Add = int Function(int a, int b);

void main() {
  final dylib = DynamicLibrary.open('libnative.so');
  final add = dylib.lookupFunction<NativeAdd, Add>('add');
  print(add(1, 2));
}
```

---

## Java and Kotlin (Android)

On **Android**, Flutter embeds the Dart engine and can call into **Java** or **Kotlin** via **platform channels** or **FFI**-style bindings where supported. Use **platform channels** for high-level messaging between Dart and the host; use generated or hand-written bindings when you need direct JNI-style calls. Follow Flutter’s Android interop docs and plugin guidelines.

---

## Objective-C and Swift (iOS/macOS)

On **iOS** and **macOS**, Dart can call **Objective-C** and **Swift** through the same embedding and channel mechanisms as on Android. Use **platform channels** for app-level integration; use **Objective-C/Swift interop** APIs when generating or writing bindings to system or third-party frameworks. Follow Flutter’s iOS/macOS interop documentation.

---

## JavaScript interop (web)

On the **web**, Dart compiles to JavaScript and must interoperate with the **DOM** and **JavaScript** APIs. **`dart:js_interop`** and **`package:web`** provide typed, safe interop: you expose Dart types to JS and use JS types and APIs from Dart. Avoid **`dart:html`** for new code; prefer **`dart:js_interop`** and **package:web**. Use for DOM manipulation, **fetch**, **Web Workers**, and third-party JS libraries.

---

## Choosing an approach

- **C:** Native libraries, performance, system APIs; use **dart:ffi** and possibly code generation.
- **Java/Kotlin:** Android plugins and host integration; use platform channels or official interop.
- **Objective-C/Swift:** iOS/macOS plugins and host integration; use platform channels or official interop.
- **JavaScript:** Web only; use **dart:js_interop** and **package:web** for type-safe, maintainable code.

---

## Further reading

- [C interop](https://dart.dev/interop/c-interop)
- [Java and Kotlin interop](https://dart.dev/interop/java-interop)
- [Objective-C and Swift interop](https://dart.dev/interop/objective-c-interop)
- [JavaScript interop](https://dart.dev/interop/js-interop)
