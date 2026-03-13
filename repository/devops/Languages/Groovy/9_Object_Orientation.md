# Object orientation

[← Back to Groovy](./README.md)

Groovy is object-oriented: classes, interfaces, inheritance, and polymorphism work much like in Java, with added features such as properties, traits, and optional typing. This topic summarizes how types, properties, traits, and related constructs work so you can read and write Groovy classes and DSLs.

---

## 1. Classes and properties

A class is declared with **class Name { }**. Fields without a visibility modifier become **properties**: the compiler generates a private field plus getter and setter. So **String name** in a class gives you **getName()** and **setName(String)**; in Groovy you use **obj.name** and **obj.name = value**. From Java, the same getters and setters are visible. You can override them if you need custom behavior.

Constructors follow Java rules. You can use the default constructor and then set properties via the map-based named-argument syntax: **new Person(name: 'Jane', age: 30)**. The constructor runs first, then setters are called for each map entry.

---

## 2. Fields and visibility

**public**, **protected**, **private** work as in Java. Omitting the modifier on a **field** in a class makes it a property (private storage + getter/setter). For real package-private visibility (no property generation), use **@PackageScope** on the field.

---

## 3. Methods

Methods are defined with a return type (or **def**/ **void**), a name, and optional parameters. Parentheses can be omitted for top-level calls. The last expression is the return value; **return** is optional. **def** as return type means “object”; for public APIs, an explicit type is clearer.

---

## 4. Traits

**trait** declares a reusable set of methods and (possibly) state that can be mixed into classes. A class can implement multiple traits with **implements**. Traits can define abstract methods, default implementations, and fields. They are similar to Java default interface methods but can hold state and are more flexible for composition.

```groovy
trait Named {
    String name
}
class Person implements Named { }
def p = new Person(name: 'Alex')
assert p.name == 'Alex'
```

Traits help share behavior across classes without single-inheritance limits and are common in DSLs and libraries.

---

## 5. Interfaces and abstract classes

Interfaces and abstract classes work as in Java. A Groovy class can implement interfaces and extend abstract classes. With **@CompileStatic**, Groovy enforces contracts like Java; in dynamic mode, method resolution is runtime (multi-methods).

---

## 6. Inheritance and super

**extends** and **super** behave as in Java. **super** refers to the superclass. Method overriding follows the usual rules; Groovy’s runtime dispatch applies to method selection when types are dynamic.

---

## 7. Object orientation in scripts and DSLs

In scripts, top-level method definitions become methods on the script class. In DSLs, closure delegates (topic 5) and traits are often used to expose a fluent or domain-specific API. Jenkins and Gradle use this pattern: the **delegate** of a closure is set to an object that has methods like **implementation**, **stage**, or **sh**, so the block looks like configuration rather than generic Groovy. Understanding properties, traits, and delegation makes it easier to read and extend such APIs.

---

## Further reading

- [Object orientation](https://groovy-lang.org/objectorientation.html)
