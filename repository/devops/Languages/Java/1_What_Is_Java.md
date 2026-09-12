# What is Java?

Java is a high-level, object-oriented programming language. When you compile Java source code, the compiler produces platform-independent bytecode, not machine-specific instructions. That bytecode runs on a Java Virtual Machine (JVM), so the same compiled program can run on any platform that has a compatible JVM. This is often summarized as **Write Once, Run Anywhere (WORA)**. Java is used for desktop and server applications, Android (via a related toolchain), enterprise systems, and many DevOps and CI/CD tools (including Jenkins).

**What it is.** Java was originally developed at Sun Microsystems (initiated by James Gosling) and first released in 1995 as part of the Java platform. The language and platform have since evolved through many versions; the Standard Edition is called Java SE, with separate editions for enterprise (Java EE, now Jakarta EE) and embedded/mobile (Java ME). In Java, nearly everything is expressed in terms of objects and classes: you define classes, create objects from them, and invoke methods. The runtime provides automatic memory management (garbage collection), strong type checking at compile time, and exception handling.

**Why it is used.** Java is used where portability, a large ecosystem, and a stable runtime matter: enterprise backends, microservices (e.g. Spring Boot), Android development, and infrastructure tooling. In DevOps, Jenkins and many other tools are written in Java; Maven and Gradle are the standard build systems for Java projects. The JVM’s performance (with JIT compilation), security model, and multithreading support make it a common choice for long-running services and automation.

**How you use it.** You install a JDK (Java Development Kit), which includes the compiler (`javac`), the runtime (JVM), and libraries. You write source in `.java` files, compile with `javac`, and run the resulting bytecode with `java`. The JDK includes the JRE (Java Runtime Environment); the JRE is the implementation of the JVM plus the class libraries needed to run Java applications.

**JVM, JRE, and JDK.** The **JVM** is an abstract specification: it describes a runtime that executes bytecode. Different vendors can provide different JVM implementations (e.g. HotSpot, Eclipse OpenJ9) as long as they conform to the specification. The **JRE** is an implementation of that specification: it includes the JVM and the standard class libraries, so you can run Java applications but not necessarily compile or develop them. The **JDK** includes the JRE plus development tools (compiler, debugger, documentation tools). For development you need a JDK; for only running Java applications a JRE (or the runtime bundled with the JDK) is enough.

**Main characteristics.** Java is object-oriented, platform-independent (bytecode + JVM), and designed to be simple to learn while avoiding certain error-prone features (e.g. no direct pointer arithmetic). It is strongly typed, with compile-time checks and runtime verification. The runtime is secure by design: the JVM enforces memory and access rules. Java supports multithreading at the language and API level. Performance is achieved through just-in-time (JIT) compilation of bytecode to native code. The language is dynamic in the sense that the runtime carries type information and can verify and resolve references at execution time.

**Use cases.** Java is used for enterprise and web applications, Android apps, microservices, and DevOps tooling (Jenkins, Maven, Gradle, and many other JVM-based tools). Use cases from software engineering, DevOps/SRE, and security perspectives are covered in later topics in this section.

---

## Further reading

- [TutorialsPoint Java Tutorial](https://www.tutorialspoint.com/java/index.htm)
- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [Dev.java – Learn Java](https://dev.java/learn/)
- [The Java™ Tutorials](https://docs.oracle.com/javase/tutorial/index.html)
- [Java SE Specifications (JLS, JVM)](https://docs.oracle.com/javase/specs/)
