# Classes and constructors

[← Back to Dart](./README.md)

**Classes** are blueprints for **objects**: they define **state** (instance variables) and **behavior** (methods). In Dart, every object is an instance of a class, and all classes (except **Null**) inherit from **Object**. You create instances with **constructors**. This topic covers the main constructor kinds—**generative**, **named**, **constant**, **factory**, and **redirecting**—and when to use each so you can model data and behavior in a clear, reusable way.

---

## Declaring a class

Define a class with **`class`**, instance variables, and methods. Use **`.`** to access members; use **`?.`** when the receiver might be null.

```dart
class Point {
  double x;
  double y;

  Point(this.x, this.y);

  double distanceTo(Point other) {
    var dx = x - other.x;
    var dy = y - other.y;
    return (dx * dx + dy * dy);
  }
}

var p = Point(2, 2);
double d = p.distanceTo(Point(4, 4));
```

---

## Constructors

**Generative constructors** create and initialize a new instance. **Initializing formals** (`this.x`, `this.y`) assign parameters directly to instance variables. If you do not declare a constructor, Dart provides a **default** generative constructor with no arguments.

```dart
class Point {
  double x;
  double y;
  Point(this.x, this.y);
}
```

**Named constructors** clarify intent or provide multiple ways to build an object. They do not inherit; subclasses must implement their own if needed.

```dart
class Point {
  final double x;
  final double y;
  Point(this.x, this.y);
  Point.origin() : x = 0, y = 0;
}
```

**Constant constructors** produce compile-time constants. All instance variables must be **`final`**, and the constructor is marked **`const`**. Use **`const`** at the call site: `const ImmutablePoint(0, 0)`.

**Factory constructors** return an instance that might be a subtype or a cached object. Use **`return`** to return the instance; they do not use **`this`** for initialization.

```dart
class Logger {
  final String name;
  static final Map<String, Logger> _cache = {};
  factory Logger(String name) {
    return _cache.putIfAbsent(name, () => Logger._internal(name));
  }
  Logger._internal(this.name);
}
```

**Redirecting constructors** delegate to another constructor in the same class using **`: this(...)`** in the initializer list.

---

## Instance variables

Instance variables can be **final** (set once, often by the constructor). They are **nullable** or non-nullable like any other variable. If not initialized, non-nullable instance variables must be set in the constructor initializer list or body before the constructor completes.

---

## Further reading

- [Dart language — Classes](https://dart.dev/language/classes)
- [Dart language — Constructors](https://dart.dev/language/constructors)
