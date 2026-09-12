# Inheritance, interfaces, and abstract classes

[← Back to Kotlin](./README.md)

Kotlin supports single inheritance for classes and implementation of one or more interfaces. By default, classes and their members are final; you mark a class or member as `open` to allow subclassing or overriding. Interfaces can declare abstract members and provide default implementations. Abstract classes sit between interfaces and concrete classes: they can hold state and define behavior that subclasses must or may override. This topic covers inheritance, the `open` and `override` modifiers, interfaces, and abstract classes so you can design clear type hierarchies.

## Inheritance and Any

Every Kotlin class has a supertype. If you do not declare one, the supertype is **`Any`**. `Any` has three methods: `equals()`, `hashCode()`, and `toString()`, so every Kotlin object supports these. To declare an explicit superclass, put a colon after the class header followed by the base class and its constructor arguments.

```kotlin
open class Base(p: Int)
class Derived(p: Int) : Base(p)
```

If the derived class has a primary constructor, the base class must be initialized in that header. If the derived class has no primary constructor, each secondary constructor must call `super(...)` (or delegate to another constructor that does) to initialize the base.

## Open and override

By default, Kotlin classes are **final**: they cannot be subclassed. To allow inheritance, mark the class with **`open`**. Similarly, functions and properties are final by default; mark them **`open`** in the base class if subclasses should be able to override them. In the derived class, use **`override`** for the overriding member. Overriding is explicit: if you forget `override`, the compiler reports an error; if the base member is not `open`, you cannot override it.

```kotlin
open class Shape {
    open fun draw() { /* ... */ }
    fun fill() { /* ... */ }  // not open, cannot override
}
class Circle() : Shape() {
    override fun draw() { /* ... */ }
}
```

An overridden member is itself open by default, so deeper subclasses can override it again. To prevent that, mark the override as **`final override`**.

## Overriding properties

Properties can be overridden in the same way as functions. The overriding property must be compatible in type and can be a property with an initializer or with a custom getter (and setter if the base allows). You can override a `val` with a `var` (the derived class adds a setter) but not a `var` with a `val`. You can use `override` in the primary constructor:

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}
class Rectangle : Shape() {
    override val vertexCount = 4
}
```

## Calling super

Inside a derived class, use **`super`** to call the superclass implementation of a function or to access a superclass property. Use **`super<BaseType>`** when the class inherits from multiple types (e.g. a class and an interface) that define the same member, so the compiler knows which implementation you mean.

```kotlin
class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling")
    }
}
```

Inside an inner class, to refer to the outer class’s supertype use the qualified form `super@OuterClass`.

## Derived class initialization order

When constructing a derived class instance, the base class is initialized first: base constructor and base initializer blocks run before the derived class’s own initializers. So when the base constructor or base `init` blocks run, the derived class’s overridden members may not yet be initialized. Avoid calling open members from constructors or from property initializers in the base class; otherwise you may observe uninitialized state and subtle bugs.

## Interfaces

Interfaces declare contracts: abstract members and optionally default implementations. They cannot hold state (no backing fields for properties). Define an interface with the `interface` keyword; a class implements one or more interfaces with a colon after the class header.

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
        println("default foo")
    }
}
class Child : MyInterface {
    override fun bar() { /* ... */ }
    // foo() can be overridden or left as default
}
```

Interface members that have a body are not abstract; those without a body are abstract. Properties in interfaces can be abstract or can provide accessor implementations (without backing fields).

## Properties in interfaces

An interface can declare properties. They can be abstract (implementing classes must override them) or have accessors that provide a default. Because interfaces have no backing fields, accessors in interfaces cannot reference `field`.

```kotlin
interface Named {
    val name: String
}
interface Person : Named {
    val firstName: String
    val lastName: String
    override val name: String get() = "$firstName $lastName"
}
```

## Interface inheritance

Interfaces can inherit from other interfaces. A class that implements a derived interface must implement all abstract members that are not already given a default in the hierarchy.

## Resolving overriding conflicts

If a class implements multiple interfaces (or extends a class and implements interfaces) and more than one of them defines the same member with an implementation, the class must override that member and provide its own implementation. Inside the override you can call one or more of the inherited implementations with `super<InterfaceName>.memberName()`.

```kotlin
interface A { fun foo() { println("A") } }
interface B { fun foo() { println("B") } }
class C : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }
}
```

## Abstract classes

An **abstract class** is declared with **`abstract`**. It cannot be instantiated; it is meant to be subclassed. It can have abstract members (no implementation) that subclasses must override, and non-abstract members with implementation. Abstract classes can have constructors, properties with backing fields, and initializer blocks, so they can hold state—unlike interfaces.

```kotlin
abstract class Person(val name: String, val age: Int) {
    abstract fun introduce(): String
    fun greet() {
        println("Hello, my name is $name.")
    }
}
class Student(name: String, age: Int, val school: String) : Person(name, age) {
    override fun introduce() = "I am $name, $age, and I study at $school."
}
```

Abstract members are implicitly open. You do not need to mark an abstract class or its abstract members with `open`.

## JVM default methods for interfaces

On the JVM, Kotlin compiles interface members with bodies to default methods. You can control this with the `-jvm-default` compiler option (e.g. in Gradle: `compilerOptions { jvmDefault = JvmDefaultMode.NO_COMPATIBILITY }`) for binary compatibility and smaller bytecode. This matters when you maintain libraries or care about how Kotlin interfaces are seen from Java.

**Delegation:** Kotlin allows implementing an interface by **delegating** to another object: `class Derived(b: Base) : Base by b`. The compiler generates implementations of `Base` that forward to `b`, so you can compose behavior without writing boilerplate. Delegation is useful for decorator-like patterns and for sharing a single implementation across multiple types.

Using inheritance and interfaces well keeps type hierarchies clear and avoids leaking uninitialized state. The next topic covers null safety, which affects how you design APIs and handle optional values across these types.

---

## Further reading

- [Inheritance](https://kotlinlang.org/docs/inheritance.html)
- [Interfaces](https://kotlinlang.org/docs/interfaces.html)
- [Classes](https://kotlinlang.org/docs/classes.html)
- [Delegation](https://kotlinlang.org/docs/delegation.html)
