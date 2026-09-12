# Classes and objects

[← Back to Kotlin](./README.md)

Classes in Kotlin encapsulate data (properties) and behavior (functions). You create instances by calling constructors; the primary constructor is declared in the class header, and you can add initializer blocks and secondary constructors for more complex setup. Kotlin also supports object declarations (singletons) and companion objects (class-level members). This topic covers class declaration, constructors, properties, and objects so you can model domain data and structure your code.

## Declaring classes

A class is declared with the `class` keyword followed by the name. The class can have a header (including a primary constructor) and an optional body. If there is no body, the curly braces can be omitted.

```kotlin
class Person { /* ... */ }

// Primary constructor in the header, no body
class Person(val name: String, var age: Int)
```

The primary constructor is the main way to create an instance. Parameters in the primary constructor can be declared as properties with `val` or `var`; they are then stored on the instance and accessible from outside. Parameters without `val` or `var` are constructor parameters only: they are available in initializer blocks and property initializers in the class body but are not properties themselves.

```kotlin
class Person(val name: String, var age: Int) {
    val description: String = "Name: $name, Age: $age"
}
fun main() {
    val p = Person("Alice", 30)
    println(p.name)
    p.age = 31
}
```

## Creating instances

To create an instance, call the class name as if it were a function, with arguments for the constructor. You can use default parameter values in the primary constructor; if all parameters have defaults, you can call `Person()` with no arguments.

```kotlin
class Person(val name: String = "Unknown", var age: Int = 0)
val anonymous = Person()
val named = Person("Bob", 25)
```

Instances can be created anywhere: in `main`, in other functions, or inside other classes. The variable that holds the instance can be `val` or `var`; `val` means the reference does not change, but the object’s mutable properties (if any) can still be modified.

## Primary constructor and initializer blocks

The primary constructor cannot contain executable code beyond the parameter list. For validation or other logic during construction, use **initializer blocks** (`init { ... }`). Initializer blocks run in order when the primary constructor runs; they can use primary constructor parameters and can call `require()` or other functions to validate state.

```kotlin
class Person(val name: String, var age: Int) {
    init {
        require(age >= 0) { "age must be non-negative" }
    }
}
```

You can have multiple `init` blocks; they and property initializers run in the order they appear in the class body. Primary constructor parameters are in scope in all of them.

## Secondary constructors

A class can define **secondary constructors** with the `constructor` keyword inside the class body. Each secondary constructor must delegate to the primary constructor (via `this(...)`) or to another secondary that eventually delegates to the primary. Delegation ensures that all primary constructor logic and initializer blocks run first.

```kotlin
class Person(val name: String, var age: Int) {
    constructor(name: String, ageStr: String) : this(name, ageStr.toIntOrNull() ?: 0) {
        println("Created from string age: $age")
    }
}
```

Secondary constructors are useful for alternative ways to construct an instance (e.g. from a string or from another type) or for Java interop when Java code calls constructors with different signatures. If the class has no primary constructor, secondary constructors still delegate implicitly; initializer blocks then act as part of that implicit primary construction.

## Properties

Properties are declared in the class body (or in the primary constructor with `val`/`var`). They can have custom getters and setters. By default, a property has an implicit getter and, if it is `var`, an implicit setter. You can define your own accessors when you need validation or computed values:

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height
}
```

A custom setter can use the `field` identifier to read or write the backing field. You can also change the visibility of an accessor (e.g. `private set`) so that the property is read-only outside the class but writable inside. Properties are covered in more detail in the topic on properties; here the focus is that classes hold state via properties and expose or constrain it through getters and setters.

## Object declarations (singletons)

An **object declaration** defines a type and creates a single instance of it. You use it when you need exactly one instance (a singleton). The object is created the first time it is accessed; you refer to it by its name.

```kotlin
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()
    fun register(provider: DataProvider) { providers.add(provider) }
    val all: Collection<DataProvider> get() = providers
}
// Usage: DataProviderManager.register(myProvider)
```

Object declarations can implement interfaces or extend a class. They cannot be local (inside a function); they can be nested inside another class or object.

## Companion objects

A **companion object** is an object declaration inside a class marked with `companion`. Its members can be called using only the class name as the qualifier, without an instance. Companion objects are often used for factory methods, constants, or other class-level utilities.

```kotlin
class Person(val name: String) {
    companion object {
        fun anonymous() = Person("Anonymous")
    }
}
val anon = Person.anonymous()
```

The companion object can have a name; if omitted, its default name is `Companion`. Companion object members are not static in the Java sense—they are members of the companion object instance—but on the JVM you can expose them as static methods with the `@JvmStatic` annotation for Java interop. A class can have only one companion object.

## Classes without explicit constructors

If you do not declare any constructor, the class has an implicit primary constructor with no parameters. So `class Person { }` can be instantiated with `Person()`. To make the (no-arg) constructor private, use `class Person private constructor() { }`.

## Abstract classes

An **abstract class** cannot be instantiated directly; it is meant to be subclassed. Declare it with the `abstract` keyword. It can have abstract members (functions or properties without implementation) that subclasses must override. Abstract classes can have constructors, initializer blocks, and non-abstract members. Abstract members are implicitly “open”; you do not need to mark them `open`. Abstract classes are covered further in the next topic alongside interfaces.

**Data classes and nested classes:** For types that mainly hold data, Kotlin offers **data classes** (`data class User(val name: String, val id: Int)`), which generate `equals()`, `hashCode()`, `toString()`, `copy()`, and component functions from the primary constructor properties. You can nest classes inside other classes; an **inner** class holds a reference to the outer instance and can access its members. These are covered in later topics (data classes, nested classes).

Understanding classes, constructors, and objects is the basis for object-oriented structure in Kotlin. The next topic covers inheritance, interfaces, and abstract classes; after that, null safety and then collections and functional style.

---

## Further reading

- [Classes](https://kotlinlang.org/docs/classes.html)
- [Object declarations](https://kotlinlang.org/docs/object-declarations.html)
- [Properties](https://kotlinlang.org/docs/properties.html)
- [Inheritance](https://kotlinlang.org/docs/inheritance.html)
