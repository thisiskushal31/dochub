# Methods, inheritance, and mixins

[← Back to Dart](./README.md)

Classes do not only hold data—they define **methods** (instance and static) and can **extend** one superclass and **implement** multiple interfaces. **Mixins** let you reuse a chunk of behavior in many class hierarchies without the limits of single inheritance. **Abstract** classes and methods define a **contract** that concrete subclasses must fulfill. This topic explains **when** to use each so you can structure and reuse behavior clearly from intermediate to advanced level.

---

## Instance and static methods

**Instance methods** operate on the current instance and can access `this`. **Static methods** (and static variables) belong to the class and do not have access to `this`. Call static members on the class: `ClassName.staticMethod()`.

```dart
class Counter {
  int count = 0;
  void increment() => count++;
  static int maxCount = 100;
}
```

---

## Extending a class

Use **`extends`** for single inheritance. A subclass inherits instance members (unless overridden) and can override methods with **`@override`**. Use **`super`** to call the superclass constructor or overridden methods.

```dart
class Animal {
  void speak() => print('?');
}
class Dog extends Animal {
  @override
  void speak() => print('Woof');
}
```

Constructors are not inherited. Subclass constructors must call a superclass constructor (e.g. `super()` or `super.named()`) in the initializer list or implicitly if the superclass has a default constructor.

---

## Abstract classes

**Abstract classes** cannot be instantiated. They can declare **abstract methods** (no body); subclasses must implement them. Abstract classes can still have concrete methods and fields.

```dart
abstract class Shape {
  double area();
}
class Circle extends Shape {
  final double r;
  Circle(this.r);
  @override
  double area() => 3.14159 * r * r;
}
```

---

## Interfaces

Every class implicitly defines an **interface**. Use **`implements`** to implement one or more interfaces (classes). You must then provide implementations for every member of those interfaces. Use `implements` when you want to fulfill a contract without inheriting implementation.

---

## Mixins

**Mixins** are a way to reuse a body of code in multiple class hierarchies. A class can use **`with`** followed by one or more mixin names. Mixins cannot use `extends` and cannot declare generative constructors. Define a mixin with **`mixin`**:

```dart
mixin Musical {
  bool canPlayPiano = false;
  void entertainMe() {
    if (canPlayPiano) print('Playing piano');
  }
}
class Musician extends Performer with Musical {}
```

If a mixin needs members that the using class must provide, declare **abstract** methods in the mixin; any class that uses the mixin must implement them. You can restrict which types can use a mixin with **`on`** (e.g. `mixin A on B { }`).

---

## Further reading

- [Dart language — Methods](https://dart.dev/language/methods)
- [Dart language — Extend a class](https://dart.dev/language/extend)
- [Dart language — Mixins](https://dart.dev/language/mixins)
