# D — Structs, classes, and interfaces

[← D README](./README.md)

**Structs** are value types: they hold data (and optionally methods) and are copied by value. **Classes** are reference types: they support inheritance, virtual methods, and are allocated on the heap (or with custom allocators). **Interfaces** define a contract of methods that classes implement; a class can implement multiple interfaces. Choosing struct vs class affects semantics, performance, and interop.

**Why structs?** They avoid heap allocation and are suitable for small, copyable data (e.g. points, ranges). **Why classes?** They support polymorphism and shared state; the object hierarchy is rooted at **Object**. **Why interfaces?** They enable abstraction and testing without multiple inheritance of implementation.

---

## Structs

A **struct** groups fields and can have constructors, destructors, and methods. Structs are value types: assignment copies the whole object. No inheritance; they can implement interfaces.

```d
struct Point
{
    int x, y;
    this(int x, int y) { this.x = x; this.y = y; }
    double distance() { return (x*x + y*y); }
}
Point p = Point(3, 4);
```

---

## Classes

**Classes** are declared with **class**; they have **constructors**, **destructors**, **virtual** methods, and single inheritance. Class references are the default; **new** allocates (GC by default). The root of the hierarchy is **Object**. **abstract** and **final** constrain inheritance.

```d
class Animal
{
    void speak() { writeln("..."); }
}
class Dog : Animal
{
    override void speak() { writeln("Woof"); }
}
Animal a = new Dog();
a.speak();
```

---

## Interfaces

An **interface** declares method signatures without implementation. A class **implements** one or more interfaces and must provide all methods. Variables of interface type can hold any implementing class instance.

```d
interface ILogger
{
    void log(string msg);
}
class ConsoleLogger : ILogger
{
    void log(string msg) { writeln(msg); }
}
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Structs and Unions](https://dlang.org/spec/struct.html)
- [D spec: Classes](https://dlang.org/spec/class.html)
- [D spec: Interfaces](https://dlang.org/spec/interface.html)
