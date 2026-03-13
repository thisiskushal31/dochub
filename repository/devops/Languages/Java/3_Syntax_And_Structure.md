# Syntax and structure

A Java program is organized as one or more classes. Each class has a name, optional modifiers, and a body that can contain fields (variables), methods, constructors, and nested types. The structure of a minimal program, naming rules, identifiers, modifiers, and comments are described below.

**Case sensitivity.** Java is case-sensitive. The identifiers `Hello` and `hello` are different. Class names, method names, and variable names must be used consistently with the same capitalization.

**Class names.** By convention, class names use PascalCase: the first letter of each word is uppercase (e.g. `MyFirstJavaProgram`, `FreshJuice`). The name of the source file must match the name of the public class in that file, with the extension `.java`. If a file has no public class, the file name can differ from the class names inside it.

**Method names.** By convention, method names use camelCase: the first letter is lowercase and the first letter of each subsequent word is uppercase (e.g. `main`, `myMethodName`). The entry point for execution is the method named `main` with signature `public static void main(String[] args)` (or `String args[]`). The JVM invokes this method when the class is run.

**Program file name.** For a public class `MyFirstJavaProgram`, the file must be saved as `MyFirstJavaProgram.java`. If the file name and the public class name do not match, the compiler will report an error. A file can contain at most one public class.

**Identifiers.** Identifiers name classes, methods, variables, and other program elements. They must start with a letter (A–Z, a–z), a dollar sign (`$`), or an underscore (`_`). After the first character, they can contain letters, digits, `$`, or `_`. Reserved keywords (e.g. `class`, `public`, `static`, `void`) cannot be used as identifiers. Examples of valid identifiers: `age`, `_value`, `$salary`. Invalid: `123abc`, `-salary`.

**Modifiers.** Classes and members can be modified by access modifiers (`public`, `protected`, private, or default when none is specified) and other modifiers (e.g. `static`, `final`, `abstract`). Access modifiers control visibility; `static` indicates class-level rather than instance-level members. Details are covered in the topic on classes and objects.

**Variables.** Variables can be instance variables (per object), class variables (static, shared), or local variables (inside a method or block). Types and variable declarations are covered in the next topic.

**Comments.** Java supports single-line and multi-line comments. The compiler ignores comment text. Single-line comments start with `//` and continue to the end of the line. Multi-line comments start with `/*` and end with `*/`. All characters inside a comment are ignored.

```java
public class MyFirstJavaProgram {

   /* This is a multi-line comment.
    * It can span several lines.
    */

   public static void main(String[] args) {
      // This is a single-line comment.
      System.out.println("Hello World");
   }
}
```

**A minimal program.** The smallest runnable program has one class and a `main` method. The `public` modifier allows the JVM to call `main`. The `static` modifier means the method belongs to the class and can be invoked without creating an instance. The `void` return type means the method returns nothing. The parameter `String[] args` (or `String args[]`) holds command-line arguments passed when the program is started.

```java
public class MyFirstJavaProgram {

   public static void main(String[] args) {
      System.out.println("Hello World");
   }
}
```

`System` is a class in the standard library; `out` is a static field of type `PrintStream` representing the standard output stream; `println` is a method that prints the given string and then a newline.

**Enums.** Enums restrict a variable to a fixed set of named values. They can be declared as a separate type or as a member of a class. Each enum constant is an instance of the enum type.

```java
class FreshJuice {
   enum FreshJuiceSize { SMALL, MEDIUM, LARGE }
   FreshJuiceSize size;
}

public class FreshJuiceTest {
   public static void main(String[] args) {
      FreshJuice juice = new FreshJuice();
      juice.size = FreshJuice.FreshJuiceSize.MEDIUM;
      System.out.println("Size: " + juice.size);
   }
}
```

**Reserved keywords.** Keywords such as `class`, `public`, `static`, `void`, `if`, `for`, `return`, `try`, `catch`, `new`, and others are reserved and cannot be used as identifiers. A full list is available in the language specification; the topic on data types and operators will refer to type-related keywords (`int`, `boolean`, etc.).

---

## Further reading

- [TutorialsPoint Java – Basic Syntax](https://www.tutorialspoint.com/java/java_basic_syntax.htm)
- [TutorialsPoint Java – Hello World Program](https://www.tutorialspoint.com/java/java_hello_world.htm)
- [The Java™ Tutorials – Learning the Java Language](https://docs.oracle.com/javase/tutorial/java/)
- [Java Language Specification](https://docs.oracle.com/javase/specs/jls/se25/html/index.html)
