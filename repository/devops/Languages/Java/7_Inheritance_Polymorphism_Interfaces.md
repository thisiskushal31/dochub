# Inheritance, polymorphism, and interfaces

Inheritance lets you reuse and extend behavior from a superclass; polymorphism lets you treat subtypes through a common type and dispatch to the right implementation at run time. Interfaces define contracts without implementation and support multiple “types” for a class. This topic goes deep into single and multilevel inheritance, the super keyword, method overriding and its rules, compile-time vs run-time polymorphism, abstract classes and methods, and declaring, implementing, and extending interfaces.

---

## Inheritance: concept and syntax

**Inheritance** is a relationship between a superclass (base, parent) and a subclass (derived, child). The subclass gains the non-private members of the superclass (fields, methods); constructors are not inherited but can be invoked from the subclass. In Java a class has exactly one direct superclass (single inheritance of implementation); the keyword is `extends`. Reuse and extension: the subclass can add new fields and methods and can override inherited methods to change behavior.

Syntax: `class SubClass extends SuperClass { ... }`. The subclass has access to public and protected members of the superclass and to package-private members if in the same package; private members are not accessible by name in the subclass but the object still has that state (e.g. via public getters). If you don’t write `extends`, the class implicitly extends **Object**; so every class has at least one superclass. A subclass cannot extend a final class; final prevents extension.

```java
class Calculation {
    int z;
    public void addition(int x, int y) { z = x + y; System.out.println("The sum: " + z); }
    public void subtraction(int x, int y) { z = x - y; System.out.println("The difference: " + z); }
}
public class My_Calculation extends Calculation {
    public void multiplication(int x, int y) { z = x * y; System.out.println("The product: " + z); }
    public static void main(String args[]) {
        int a = 20, b = 10;
        My_Calculation demo = new My_Calculation();
        demo.addition(a, b);
        demo.subtraction(a, b);
        demo.multiplication(a, b);
    }
}
```

---

## Superclass and subclass references

A variable of superclass type can hold a reference to a subclass object: `SuperClass ref = new SubClass();`. The compile-time type of `ref` is SuperClass, so only members declared in SuperClass (and visible) are callable by the compiler. At run time, the object is a SubClass; if a method is overridden, the subclass version runs (dynamic dispatch). You cannot call subclass-specific methods through a superclass reference without a cast; the compiler does not know they exist.

```java
Calculation cal = new My_Calculation();
cal.addition(a, b);
cal.subtraction(a, b);
// cal.multiplication(a, b);  // compile error: type Calculation has no multiplication
```

---

## The super keyword

**super** refers to the superclass part of the current object (or the current subclass in a static context it is not allowed). Uses:

- **super.member** — Access a superclass field or method that is hidden or overridden. Useful when the subclass has a member with the same name and you need the superclass version.
- **super(args)** — Call a superclass constructor; must be the first statement in a constructor. If you don’t write `super(...)` or `this(...)`, the compiler inserts `super()` (no-arg). So the superclass must have an accessible no-arg constructor if you don’t call a specific one. If the superclass only has parameterized constructors, the subclass must explicitly call one of them with `super(args)`; otherwise you get a compile error. You cannot use both `this(...)` and `super(...)` in the same constructor—exactly one constructor invocation is allowed as the first statement.

```java
class Super_class {
    int num = 20;
    public void display() { System.out.println("display of superclass"); }
}
public class Sub_class extends Super_class {
    int num = 10;
    public void display() { System.out.println("display of subclass"); }
    public void my_method() {
        Sub_class sub = new Sub_class();
        sub.display();
        super.display();
        System.out.println("sub num: " + sub.num);
        System.out.println("super num: " + super.num);
    }
}
```

Invoking superclass constructor from subclass:

```java
class Superclass {
    int age;
    Superclass(int age) { this.age = age; }
}
public class Subclass extends Superclass {
    Subclass(int age) { super(age); }
}
```

---

## IS-A and HAS-A

**IS-A** is the inheritance relationship: “Subclass IS-A Superclass.” It is expressed with `extends` (and `implements` for interfaces). Example: `Dog extends Mammal`, so a Dog is a Mammal and also an Animal if Mammal extends Animal. The **instanceof** operator checks IS-A: `obj instanceof Type` is true if the object referred to is non-null and of that type or a subtype. For interfaces, it is true if the object’s class (or any superclass) implements that interface. So `obj instanceof Object` is true for any non-null reference. If `obj` is null, `obj instanceof AnyType` is false (no exception). After a successful instanceof check, you can safely cast: `if (obj instanceof String) { String s = (String) obj; ... }`. Java 16+ allows pattern matching: `if (obj instanceof String s) { ... }` both checks and binds `s` in one step.

**HAS-A** is composition: one class has a reference to another as a field. It does not use extends; the contained object is used by the class. Example: `Van extends Vehicle` and has a `Speed sp` field — Van HAS-A Speed. Use HAS-A when you need a component, IS-A when you are specializing a more general type.

---

## Types of inheritance in Java

Java allows:

- **Single** — One subclass, one superclass. `class B extends A { }`
- **Multilevel** — Chain: A → B → C. C has both B and A as ancestors.
- **Hierarchical** — One superclass, many subclasses. B extends A, C extends A.

Java does **not** allow multiple inheritance of implementation: a class cannot `extends` more than one class. So `class D extends A, B` is illegal. Multiple “behavior” is achieved via **interfaces**: a class can `implements` several interfaces.

---

## Method overriding

**Overriding** is when a subclass provides its own implementation of an instance method that is already defined in the superclass (same signature: name and parameter types). The overridden method runs when the method is invoked on a subclass object, even when the reference type is the superclass (run-time polymorphism). The subclass method must obey the override rules (same or covariant return type, same or more accessible, exception rules).

Rules:

- Same method name and parameter list (signature) as in the superclass.
- Return type must be the same or a subtype (covariant return, e.g. superclass returns Object, subclass returns String).
- Access cannot be more restrictive than the overridden method (public in superclass → cannot be protected or private in subclass).
- Instance methods only; static methods are hidden, not overridden (re-declaring a static method with the same signature in the subclass is allowed but not polymorphic).
- Cannot override `final` or private methods (private are not inherited).
- Checked exceptions: the overriding method must not throw new or broader checked exceptions than the overridden method; it may throw fewer or narrower. Unchecked exceptions are not constrained.
- Constructors are not overridden (they are not inherited).

**Field hiding vs method overriding:** If the subclass declares a field with the same name as a superclass field, the subclass field **hides** the superclass field (it does not override it—fields are not polymorphic). Depending on the reference type used, either the superclass or subclass field is accessed. Use `super.fieldName` to refer to the superclass field from the subclass. Method overriding, by contrast, is polymorphic: the actual object type decides which method runs.

**Covariant return types:** The overriding method’s return type can be a **subtype** of the overridden method’s return type. For example, if the superclass returns `Object`, the subclass can return `String`. The compiler and JVM support this; the caller’s compile-time type sees the superclass return type, but at run time the returned object is the subtype.

**@Override:** Use the `@Override` annotation on methods you intend to override. If the signature doesn’t match any superclass method, the compiler reports an error (e.g. typo in name or parameter types). That catches mistakes early and makes intent clear.

```java
class Animal {
    public void move() { System.out.println("Animals can move"); }
}
class Dog extends Animal {
    public void move() { System.out.println("Dogs can walk and run"); }
}
Animal b = new Dog();
b.move();  // "Dogs can walk and run" — Dog's version runs
// b.bark();  // compile error if bark() is only in Dog
```

Calling the superclass implementation from the overriding method:

```java
class Dog extends Animal {
    public void move() {
        super.move();
        System.out.println("Dogs can walk and run");
    }
}
```

---

## Run-time polymorphism (dynamic dispatch)

When you call an instance method through a reference, the **actual** type of the object (at run time) determines which method body runs, not the type of the reference. So `Animal a = new Dog(); a.move();` runs Dog’s `move()`. This is virtual method invocation: the overridden method in the subclass is invoked. The compiler only checks that the method exists on the declared type; the JVM selects the implementation from the object’s class. That’s why you can write code against a superclass or interface type and pass different implementations.

```java
Salary s = new Salary("Mohd", "UP", 3, 3600.00);
Employee e = new Salary("John", "MA", 2, 2400.00);
s.mailCheck();  // Salary's mailCheck
e.mailCheck();  // Still Salary's mailCheck — same object type
```

---

## Compile-time polymorphism (overloading)

Overloading is multiple methods in the same class (or between a class and its subclass) with the same name but different parameter lists. The choice is made at **compile time** from the static types of the arguments. It is unrelated to overriding; overloading does not require inheritance and is not polymorphic in the run-time sense. **Overload resolution with inheritance:** If the subclass declares a method with the same name but different parameters than the superclass, both are overloads; the compiler picks based on the argument types. If the subclass has a method with the **same signature** as the superclass, that is overriding (and must obey override rules), not overloading. When you call through a superclass reference, the compiler chooses the overload based on the **reference** type’s methods only; the actual object type does not affect which overload is selected, but it does determine which override runs.

---

## Abstract classes and methods

An **abstract class** is declared with `abstract`; it may have abstract methods (no body, semicolon after signature) and concrete methods. It cannot be instantiated: `new AbstractClass()` is a compile error. To use it, you extend it and either implement all abstract methods or declare the subclass abstract too.

An **abstract method** has no body; subclasses must override it (or the subclass must be abstract). Abstract methods can exist only in abstract classes (or in interfaces, which are different). Abstract classes can have constructors (invoked by subclass constructors via super) and fields. They can also have **concrete** methods that subclasses inherit. So you use an abstract class when you want to share code (common fields and methods) and still force subclasses to implement certain behavior. You use an **interface** when you only want a contract (method signatures) and possibly default implementations (Java 8+ default methods); a class can implement many interfaces but extend only one class. Choosing abstract class vs interface: use an abstract class for “is-a” with shared implementation; use an interface for “can-do” or when multiple unrelated types need the same contract.

```java
public abstract class Employee {
    private String name;
    private String address;
    private int number;

    public Employee(String name, String address, int number) {
        this.name = name;
        this.address = address;
        this.number = number;
    }
    public abstract double computePay();
    public void mailCheck() { System.out.println("Mailing a check to " + name + " " + address); }
    public String getName() { return name; }
}
// Employee e = new Employee(...);  // illegal
public class Salary extends Employee {
    private double salary;
    public Salary(String name, String address, int number, double salary) {
        super(name, address, number);
        setSalary(salary);
    }
    public double computePay() { return salary / 52; }
    public double getSalary() { return salary; }
    public void setSalary(double s) { if (s >= 0.0) salary = s; }
}
```

Abstraction (hiding implementation details, exposing only behavior) is achieved with abstract classes and interfaces; the caller depends on the type/contract, not the concrete implementation.

---

## Interfaces: declaration and semantics

An **interface** is a reference type that defines a contract: typically abstract methods (no body), and optionally constants (public static final), default methods (Java 8+), and static methods. A class **implements** an interface with `implements InterfaceName`; it must provide implementations for all abstract methods of the interface (or be abstract). A class can implement multiple interfaces (e.g. `class C extends B implements I1, I2`). Interfaces are not classes: no constructors, no instance fields, no direct instantiation.

- Methods in an interface are implicitly public and abstract (before Java 8); you can omit those keywords.
- Fields are implicitly public static final.
- An interface can extend other interfaces (`extends I1, I2`); multiple inheritance of interfaces is allowed.

**Default and static methods (Java 8+):** An interface can declare **default** methods with a body; implementing classes inherit them and can override them. That allows evolving an interface without breaking existing implementations. **Static** methods in an interface are called as `InterfaceName.staticMethod()`; they are not inherited by implementing classes. Both default and static methods are useful for backward compatibility and for putting helper behavior next to the contract.

```java
interface Animal {
    void eat();
    void travel();
}
public class MammalInt implements Animal {
    public void eat() { System.out.println("Mammal eats"); }
    public void travel() { System.out.println("Mammal travels"); }
    public static void main(String args[]) {
        MammalInt m = new MammalInt();
        m.eat();
        m.travel();
    }
}
```

---

## Implementing multiple interfaces and extending interfaces

A class can implement several interfaces: `class C implements I1, I2, I3`. It must implement every abstract method from each interface (or be abstract). An interface can extend one or more interfaces: `interface Hockey extends Sports, Event`. The implementing class then must implement all methods from the interface and its super-interfaces.

```java
interface Sports {
    void setHomeTeam(String name);
    void setVisitingTeam(String name);
}
interface Football extends Sports {
    void homeTeamScored(int points);
    void visitingTeamScored(int points);
    void endOfQuarter(int quarter);
}
interface Event {
    void organize();
}
public class HockeyDemo implements Hockey, Event {
    public void setHomeTeam(String name) { System.out.println("Home team: " + name); }
    public void setVisitingTeam(String name) { }
    public void homeGoalScored() { }
    public void visitingGoalScored() { }
    public void endOfPeriod(int period) { }
    public void overtimePeriod(int ot) { }
    public void organize() { System.out.println("Match organized."); }
}
```

---

## Tagging (marker) interfaces

An interface with no methods is a **marker** or **tagging** interface. It adds a type: the class is considered to be of that type for polymorphism and type checks (e.g. Serializable, Cloneable). The JVM or APIs may use it (e.g. serialization). Modern code often uses annotations for similar purposes, but marker interfaces are still present in the platform.

---

## Polymorphism and reference types

Any Java object is polymorphic in that it is an instance of its own class and of every superclass and implemented interface. So you can assign the same object to different reference types:

```java
Deer d = new Deer();
Animal a = d;
Vegetarian v = d;
Object o = d;
```

d, a, v, o all refer to the same Deer object. The type of the reference limits which members you can call; the actual object type determines which overridden implementation runs.

---

## Summary

Inheritance is single (one superclass) via `extends`; the subclass gets non-private members and can override methods and call super with `super` or `super(args)`. Overriding follows strict rules (signature, return type, access, exceptions). Run-time polymorphism is dynamic dispatch on overridden instance methods; compile-time polymorphism is overloading. Abstract classes and methods force subclasses to provide implementations. Interfaces define contracts; a class can implement multiple interfaces and an interface can extend multiple interfaces. Together, inheritance, abstraction, and interfaces support reusable, extensible design while keeping contracts clear.

---

## Further reading

- [TutorialsPoint Java – Inheritance](https://www.tutorialspoint.com/java/java_inheritance.htm)
- [TutorialsPoint Java – Polymorphism](https://www.tutorialspoint.com/java/java_polymorphism.htm)
- [TutorialsPoint Java – Overriding](https://www.tutorialspoint.com/java/java_overriding.htm)
- [TutorialsPoint Java – Abstraction](https://www.tutorialspoint.com/java/java_abstraction.htm)
- [TutorialsPoint Java – Interfaces](https://www.tutorialspoint.com/java/java_interfaces.htm)
- [The Java™ Tutorials – Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)
- [The Java™ Tutorials – Interfaces](https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html)
- [Java Language Specification – Interfaces](https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html)
