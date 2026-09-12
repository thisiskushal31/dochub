# What is Groovy?

[← Back to Groovy](./README.md)

This topic answers: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** so you can understand Groovy from zero and see where it fits across software engineering, DevOps, and security.

**What it is.** Groovy is a **JVM language**: it compiles to Java bytecode and runs on the Java platform. It is **dynamic** (optional static typing with **def** or **var**), **script-friendly** (you can run a file of statements without wrapping them in a class), and **Java-interop focused**—you can call Java from Groovy and Groovy from Java. The grammar builds on Java’s but adds closures, GStrings (interpolated strings), optional semicolons and parentheses, and a richer syntax for lists (**[]**) and maps (**[:]**). The Groovy Development Kit (GDK) adds methods to **Object**, **String**, **Collection**, **File**, and others (e.g. **each**, **collect**, **find**, **withReader**). Groovy is **Apache Groovy** (open source). **@Grab** (Grape) lets scripts declare dependencies for one-off runs.

**Why it is used.** Groovy reduces boilerplate compared to Java: optional types (**def**), native lists and maps (**[]**, **[:]**), string interpolation (**"${var}"**), and closures make scripts and DSLs short and readable. It is a first-class language on the JVM, so existing Java libraries and tools work without change. In **DevOps**, Groovy is the language of **Jenkins** scripted pipelines (Jenkinsfile) and of **Gradle** build scripts (build.gradle). If you maintain CI/CD or Java builds, you will read and write Groovy.

**How you use it.** You write Groovy in **.groovy** files. You can run a script with **groovy Script.groovy**, compile to bytecode with **groovyc**, or use the interactive shell **groovysh** or the Swing console **groovyConsole**. You can also embed Groovy in a Java app or use it only inside Jenkins or Gradle. No separate “runtime” beyond the JVM and the Groovy libraries.

```bash
groovy MyScript.groovy
groovyc MyScript.groovy
groovysh
groovyConsole
```

**Use cases.** Groovy is used for **CI/CD pipelines** (Jenkins Jenkinsfile), **build automation** (Gradle build.gradle), **scripts** on the JVM, **DSLs** (domain-specific languages), and **testing** (Spock, etc.). From a **software engineering** perspective you use it for scripts and glue code; from **DevOps** you use it daily in Jenkins and Gradle; from **security** you need to be aware of serialization risks and safe use of scripts (see topic 15).

**Relation to Java.** Groovy is designed to feel natural to Java developers. It uses multi-methods (dispatch at runtime by argument types), so the same code can behave differently from Java. **==** in Groovy is equality (**.equals**), not reference identity; use **is** or **===** for identity. Many Java idioms work as-is; topic 8 summarizes the main differences.

---

## Further reading

- [Groovy documentation](https://groovy-lang.org/documentation.html)
- [Differences with Java](https://groovy-lang.org/differences.html)
