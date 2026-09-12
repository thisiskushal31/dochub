# Classes and objects

Java is object-oriented: behavior and state are organized into classes and their instances (objects). This topic covers what classes and objects are, how to declare and use them, instance vs class (static) members, constructors (default, no-arg, parameterized, overloading), methods (signature, return, parameters, overloading, var-args, this), access modifiers and encapsulation, and source-file and declaration rules so you can read and write Java code with precision.

---

## Class and object in brief

A **class** is a type and a blueprint: it defines fields (data) and methods (behavior). A class does not consume memory for its definition; only when you create an **object** (an instance of that class) is memory allocated for that instance’s fields. An **object** is a value of a reference type: it has identity (you can have multiple distinct instances), state (values of its fields), and behavior (methods that operate on that state). Objects are created with `new` and live on the heap; variables hold references to them.

---

## What a class contains

A class is declared with an optional access modifier, the keyword `class`, the class name, an optional `extends` clause, an optional `implements` clause, and a body in braces. The body can contain in any order (convention groups them): fields (class and instance variables), constructors, and methods. Nested types (inner classes, interfaces, enums) are also allowed.

- **Instance variables (fields)** — One copy per object; define object state. They can have access modifiers (public, private, protected, or package-private). They get default values (0, false, '\u0000', null) if not explicitly initialized.
- **Class variables (static fields)** — Declared with `static`; one copy per class, shared by all instances. Often used for constants (`public static final`) or shared caches.
- **Constructors** — Same name as the class, no return type; used to initialize new instances. If you don’t write any, the compiler provides a default no-arg constructor (only if no other constructor is declared).
- **Instance methods** — Operate on a specific instance; can access instance and static members. Called via `objectRef.methodName(...)`.
- **Static methods** — Declared with `static`; belong to the class. They cannot access instance fields or call instance methods without an object reference; they are typically used for utilities or factory methods.

**Static vs instance — when each runs:** Static fields are initialized when the class is first loaded by the JVM (e.g. first time the class is referenced or instantiated). Instance fields are initialized when each object is created, before the constructor body runs. So the order is: class load (static field initializers and static blocks, in order) → then for each `new`: instance field initializers and instance initializer blocks, then the constructor body. In a static method there is no `this`; referencing an instance field or calling an instance method without an explicit object reference is a compile error. Conversely, instance methods can access both instance and static members; if a static field is visible, the instance method can read or write it (and that change is visible to all instances).

```java
class Dog {
    // Instance attributes (fields)
    String breed;
    int age;
    String color;

    void barking() { }
    void hungry() { }
    void sleeping() { }

    public void setBreed(String breed) { this.breed = breed; }
    public void setAge(int age) { this.age = age; }
    public void setColor(String color) { this.color = color; }
    public void printDetails() {
        System.out.println(this.breed + " " + this.age + " " + this.color);
    }
}
```

---

## Declaring and creating objects

Object creation has three conceptual steps: **declaration** (a variable of the class type), **instantiation** (`new`), and **initialization** (a constructor call). The variable holds a reference; the object lives on the heap.

Syntax: `ClassName objectRef = new ClassName(args);` — args are optional and depend on the constructor. If the variable is declared but not assigned (or assigned `null`), invoking instance methods or accessing instance fields on it throws `NullPointerException` at run time.

```java
Dog obj = new Dog();
obj.setBreed("Golden Retriever");
obj.setAge(2);
obj.setColor("Golden");
obj.printDetails();
```

A superclass reference can hold a subclass object (e.g. `Animal a = new Dog();`). The compile-time type of `a` is Animal, so only Animal’s members are visible to the compiler; at run time, overridden methods execute the subclass version (polymorphism).

---

## Accessing instance members

Use the dot operator: `objectRef.fieldName` and `objectRef.methodName(args)`. From inside an instance method or constructor of the same class, you can use `this.fieldName` and `this.methodName(args)`, or omit `this` when there is no name clash. Instance methods see the instance’s own fields; each object has its own copy of instance fields.

```java
public class Puppy {
    int puppyAge;

    public Puppy(String name) {
        System.out.println("Name chosen is :" + name);
    }

    public void setAge(int age) { puppyAge = age; }
    public int getAge() {
        System.out.println("Puppy's age is :" + puppyAge);
        return puppyAge;
    }

    public static void main(String[] args) {
        Puppy myPuppy = new Puppy("tommy");
        myPuppy.setAge(2);
        myPuppy.getAge();
        System.out.println("Variable Value :" + myPuppy.puppyAge);
    }
}
```

---

## Class attributes (fields): declaration, access, modification

Fields are declared with optional modifier, type, and name; they can be initialized at declaration. Access: `objectRef.attributeName` from outside (if visible), or by name (or `this.name`) inside the class. To make a field read-only after construction, declare it `final`; it must be assigned exactly once (in declaration or in every constructor). A `final` field cannot be reassigned; the compiler will report an error if you try. A **blank final** is a final field not initialized at declaration; the compiler then requires that every constructor (and every path through it) assign that field exactly once before any use. This is useful when the value depends on constructor parameters. Final instance fields are useful for immutable objects and for safe publication in concurrent code (once the constructor finishes, the field is visible to other threads without additional synchronization for that reference).

```java
class Dog {
    String breed = "German Shepherd";
    int age = 2;
    String color = "Black";
    final String name = "Tommy";  // read-only; cannot assign again
}
// obj.name = "other";  // compile error: final field
```

---

## Constructors: purpose and rules

Constructors initialize new objects. They have the same name as the class and no return type (not even `void`). If you don’t define any constructor, the compiler inserts a default constructor that takes no arguments and does nothing beyond default field initialization. If you define any constructor, the default no-arg constructor is not generated; if you need it, you must write it explicitly.

Rules: name must match the class; no return type; access modifiers are allowed (public, protected, package-private, private); a constructor can call another overloaded constructor in the same class via `this(args)` as the first statement, or the superclass constructor via `super(args)` as the first statement (otherwise the compiler inserts `super()`). So the **first line** of every constructor body is either `this(...)` or `super(...)` (explicit or implicit). You cannot have code before that call—e.g. a field access or print statement before `super()` is a compile error. The reason is that the superclass must be fully initialized before the subclass does anything. If the superclass has no no-arg constructor and you don’t call `super(args)` explicitly, the compiler will report an error because the implicit `super()` would have nothing to call.

```java
Main() {
    System.out.println("Hello, World!");
}
public static void main(String[] args) {
    Main obj_x = new Main();  // constructor runs
}
```

---

## Types of constructors

- **Default (compiler-supplied)** — No-arg, only present when you don’t define any constructor. It simply runs and allows superclass initialization.
- **No-arg (explicit)** — You write `ClassName() { ... }` to run custom logic when no arguments are provided.
- **Parameterized** — One or more parameters; used to set initial state from arguments.

Constructor overloading: multiple constructors with different parameter lists. The compiler chooses by the number and types of the arguments at the call site.

```java
class Student {
    String name;
    int age;

    Student() {
        this.name = "Unknown";
        this.age = 0;
    }
    Student(String name) {
        this.name = name;
        this.age = 0;
    }
    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
Student std1 = new Student();
Student std2 = new Student("Jordan");
Student std3 = new Student("Paxton", 25);
```

---

## Methods: signature, body, return, parameters

A method has a signature: name plus the ordered list of parameter types. Return type and throws clause are not part of the signature but must be consistent for overriding. Method declaration: modifiers, return type, name, parameter list, optional `throws`, and body (or semicolon for abstract). Parameters are passed **by value**: the method receives a copy of the primitive or a copy of the reference. Reassigning the parameter (e.g. `param = new Foo()`) does not change the caller’s variable. For reference types, the copy still points to the same object, so mutating that object (e.g. calling a method that changes its state, or assigning to a field) is visible to the caller. So “Java is pass-by-value” means the reference itself is copied, not that the object is copied. There is no pass-by-reference for variables (you cannot write a method that reassigns the caller’s reference or primitive variable).

- **Return type** — Any type or `void`. If not void, every path must return a value of that type (or throw). `return;` is valid only in void methods.
- **Parameters** — Type and name; multiple parameters comma-separated. Caller’s arguments must match in order and type (assignment-compatible).

```java
public static int minFunction(int n1, int n2) {
    int min = (n1 > n2) ? n2 : n1;
    return min;
}
int c = minFunction(a, b);
```

Void methods are called for their side effects; the call is a statement. Methods that return a value can be used in expressions or assigned.

---

## Method overloading

Overloading is multiple methods in the same class with the same name but different parameter lists (number or types). The compiler selects the method by the arguments at the call site. Return type alone does not distinguish overloads; you cannot have two methods that differ only by return type. Overloading is resolved at **compile time** (static polymorphism): the chosen overload is determined by the **declared types** of the arguments, not their run-time types. The compiler picks the most specific applicable overload (the one whose parameter types are the most specific subtypes of the argument types). If there is no single most specific method (ambiguity), the call is a compile error—e.g. `m(null)` when both `m(String s)` and `m(Integer i)` exist is ambiguous. Widening (e.g. int to long) and boxing (int to Integer) can make overload resolution non-obvious; when in doubt, use explicit casts or avoid overloading with similar parameter types.

```java
public int addition(int x, int y) { return x + y; }
public int addition(int x, int y, int z) { return x + y + z; }
public double addition(double x, double y) { return x + y; }
```

---

## The this keyword

Inside an instance method or constructor, `this` refers to the current object. Uses: disambiguate instance fields from parameters or locals (`this.age = age`); call another constructor (`this(args)` must be the first statement); pass the current object to another method or return it. In static methods there is no current object, so `this` is not allowed.

```java
Student(int age) {
    this.age = age;
}
Student() {
    this(20);  // calls the constructor above
}
```

---

## Var-args (variable arity)

A method can accept a variable number of arguments of the same type with the last parameter declared as `Type... name`. It is treated as `Type[]` inside the method. Only one var-args parameter is allowed, and it must be last. Callers can pass multiple arguments (which are gathered into an array) or a single array.

```java
public static void printMax(double... numbers) {
    if (numbers.length == 0) { System.out.println("No argument passed"); return; }
    double result = numbers[0];
    for (int i = 1; i < numbers.length; i++)
        if (numbers[i] > result) result = numbers[i];
    System.out.println("The max value is " + result);
}
printMax(34, 3, 3, 2, 56.5);
printMax(new double[]{1, 2, 3});
```

---

## Access modifiers

Access modifiers constrain who can see a class, constructor, method, or field.

- **private** — Only the declaring class. Subclasses cannot access private members; they are not inherited. Used to encapsulate internal state.
- **Package-private (default)** — No modifier. Visible only within the same package. Subclasses in the same package can access; subclasses in another package cannot.
- **protected** — Same package, plus subclasses in any package. Allows subclasses to use the member while still hiding it from unrelated code.
- **public** — Visible everywhere the class is visible. Required for `main` so the launcher can invoke it.

Inheritance and overriding: a subclass cannot override a method to make it more restrictive (e.g. override public with private is not allowed). Protected or public in superclass can remain protected or become public in subclass; they cannot become private.

```java
public class Logger {
    private String format;
    public String getFormat() { return this.format; }
    public void setFormat(String format) { this.format = format; }
}
```

---

## Encapsulation and data hiding

Encapsulation means bundling state (fields) and behavior (methods) and controlling access. Typical approach: make fields `private` and expose them only through public (or protected) getters and setters. That gives a single place to validate or transform values, change representation later, or make fields read-only (only getters) or write-only (only setters). A fully encapsulated class has no public fields; all external access goes through methods.

```java
public class EncapTest {
    private String name;
    private String idNum;
    private int age;

    public int getAge() { return age; }
    public String getName() { return name; }
    public String getIdNum() { return idNum; }
    public void setAge(int newAge) { age = newAge; }
    public void setName(String newName) { name = newName; }
    public void setIdNum(String newId) { idNum = newId; }
}
```

---

## Source file and declaration rules

- One **public** class per source file; the file name must match that class name (e.g. `Employee.java` for `public class Employee`).
- A file can have additional package-private classes; they remain in the same file.
- **package** (if present) must be the first statement; then **import**s; then type declarations. Package and imports apply to the whole file.
- Classes can be in the unnamed package (no package statement) or in a named package; the directory structure should match the package name for the compiler and JVM to resolve them.

**Initialization order (recap):** For a class that is first used: (1) static field initializers and static blocks run in order; (2) then when `new` is executed: superclass construction (recursively), then instance field initializers and instance initializer blocks in order, then the constructor body. So the full object (including superclass state) is built before the constructor body runs; that’s why you can pass `this` to another method only after the constructor has started (and the object is allocated), but you must avoid leaking `this` before the constructor finishes (other code might see half-initialized state).

---

## finalize (deprecated)

A method with signature `protected void finalize()` was historically invoked by the garbage collector before reclaiming an object. It is deprecated and unreliable (timing and even invocation are not guaranteed). Do not use it for critical cleanup; use try-with-resources or explicit close methods instead.

---

## Summary

Classes define types and blueprints (fields, constructors, methods); objects are instances created with `new`. Instance members belong to each object; static members belong to the class. Constructors initialize objects; they can be overloaded and can delegate via `this(...)` or `super(...)`. Methods are selected by overload at compile time; parameters are passed by value. Access modifiers and encapsulation (private fields, public getters/setters) control visibility and maintainability. Adhering to one public class per file and package/import order keeps the codebase consistent and compilable.

---

## Further reading

- [TutorialsPoint Java – OOPs Concepts](https://www.tutorialspoint.com/java/java_oops_concepts.htm)
- [TutorialsPoint Java – Object & Classes](https://www.tutorialspoint.com/java/java_object_classes.htm)
- [TutorialsPoint Java – Class Attributes](https://www.tutorialspoint.com/java/java_class_attributes.htm)
- [TutorialsPoint Java – Constructors](https://www.tutorialspoint.com/java/java_constructors.htm)
- [TutorialsPoint Java – Methods](https://www.tutorialspoint.com/java/java_methods.htm)
- [TutorialsPoint Java – Access Modifiers](https://www.tutorialspoint.com/java/java_access_modifiers.htm)
- [TutorialsPoint Java – Encapsulation](https://www.tutorialspoint.com/java/java_encapsulation.htm)
- [The Java™ Tutorials – Classes and Objects](https://docs.oracle.com/javase/tutorial/java/concepts/)
- [Java Language Specification – Classes](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html)
