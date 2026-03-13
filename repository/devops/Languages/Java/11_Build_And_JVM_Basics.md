# Build (Maven, Gradle) and JVM basics

Building a Java project involves compiling sources, running tests, and packaging artifacts. Maven and Gradle are the dominant build tools; they manage dependencies and lifecycle. The JVM is the runtime that executes bytecode. This topic covers Maven basics (POM, directory layout, lifecycle phases, dependency management), a brief note on Gradle, and JVM architecture (class loading, runtime data areas, execution engine, garbage collection) so you can run and troubleshoot Java applications and understand how they are built and executed.

---

## Why use a build tool?

Without a build tool, you run javac and java by hand, manage JARs and classpaths, and repeat the same steps across machines. A build tool automates **compile → test → package → install/deploy**, uses a **declarative** model (what you need, not how to run each command), and manages **dependencies** (libraries and their versions) from a repository. Maven and Gradle also provide a standard project layout so any developer can navigate the project and the tool can find sources and resources. In DevOps and CI/CD, the build tool is what the pipeline invokes (e.g. `mvn package` or `gradle build`) to produce artifacts.

---

## Maven: project structure and POM

A Maven project has a standard layout. Source code goes under **src/main/java** (and optionally **src/main/resources**); tests under **src/test/java** (and **src/test/resources**). The **pom.xml** (Project Object Model) at the root describes the project: **groupId** (e.g. com.mycompany.app), **artifactId** (e.g. my-app), **version** (e.g. 1.0-SNAPSHOT), **packaging** (jar, war, etc.), **dependencies**, and **build** configuration (plugins, compiler version). The combination groupId + artifactId + version uniquely identifies an artifact. Maven uses a **local repository** (e.g. ~/.m2/repository) to cache dependencies and a **remote repository** (e.g. Maven Central) to download them.

**Parent POM and inheritance.** A project can declare a **parent** POM via `<parent>`. It inherits dependency versions, plugin configuration, and properties from the parent; child POMs can override them. Multi-module projects use a parent POM with `<modules>` listing subdirectories; from the parent directory, `mvn install` builds all modules. This keeps versions and plugin settings consistent across modules. **BOM** (Bill of Materials) is a POM with dependencyManagement only (packaging pom), often used with import scope to centralize dependency versions.

```text
my-app
|-- pom.xml
`-- src
    |-- main
    |   `-- java
    |       `-- com/mycompany/app/App.java
    `-- test
        `-- java
            `-- com/mycompany/app/AppTest.java
```

---

## Maven lifecycle and phases

Maven runs a **lifecycle** made of **phases**. Common phases in order: **validate** → **compile** → **test** → **package** → **verify** → **install** → **deploy**. When you run a phase (e.g. `mvn package`), Maven runs every phase up to and including that one. So `mvn package` runs validate, compile, test, and package; it compiles code, runs tests, and produces the artifact (e.g. target/my-app-1.0-SNAPSHOT.jar). **compile** compiles main sources; **test** compiles test sources and runs tests; **install** copies the artifact into the local repository for use by other projects; **deploy** publishes to a remote repository. You can also run **clean** (removes target) and **site** (generates documentation). Plugins bind goals to phases; for example the compiler plugin’s compile goal runs in the compile phase.

**Skipping tests and phases.** Use `-DskipTests` to skip running tests (code is still compiled) or `-Dmaven.test.skip=true` to skip test compilation and execution. Useful in CI when you run tests in a separate step or for a quick package. You can invoke a specific goal without running the full lifecycle (e.g. `mvn compiler:compile`) or run phases in sequence (e.g. `mvn clean package`). Order of execution is deterministic: all goals bound to a phase run before the next phase starts.

---

## Maven dependencies and scope

**Dependencies** are declared in pom.xml with groupId, artifactId, and version. Maven resolves transitive dependencies (dependencies of your dependencies) and builds the classpath. **Scope** controls when the dependency is available: **compile** (default; main and test), **test** (test only), **provided** (compile and test but not packaged; e.g. servlet API), **runtime** (packaged, not compile). Use **dependencyManagement** in a parent POM or BOM to centralize versions; **dependencies** in a module inherit versions from dependencyManagement. Running `mvn dependency:tree` shows the dependency tree and helps diagnose version conflicts.

**Exclusions and conflict resolution.** A dependency can bring in transitive dependencies you do not want (wrong version or unwanted artifact). Use `<exclusions>` inside that dependency to exclude specific groupId/artifactId. Maven’s “nearest definition” rule: the version closest to the root in the tree wins. To force a version project-wide, declare it in dependencyManagement (and optionally in the dependency itself). **Optional** dependencies are not propagated to dependents; they are used when you want to document that a library is used only in certain configurations.

---

## Gradle in brief

**Gradle** is another build tool; it uses a **Groovy or Kotlin DSL** (build.gradle or build.gradle.kts) instead of XML. You define tasks and dependencies; Gradle has a rich plugin ecosystem (Java, war, application, etc.). Common commands: **gradle build** (compile, test, package), **gradle clean**, **gradle run**. Dependencies are declared in a dependencies block; repositories (e.g. mavenCentral()) are declared separately. Gradle is often used with Android and in polyglot projects; Maven remains very common in enterprise Java. Both integrate with CI/CD (Jenkins, GitHub Actions, etc.) by invoking the corresponding command in the project root.

---

## JVM: what it is and why it matters

The **Java Virtual Machine** is an abstract machine specified by the JVM Specification. It executes **bytecode** (the .class format produced by javac). Different vendors can implement the JVM (e.g. HotSpot from Oracle/OpenJDK, Eclipse Temurin, Amazon Corretto). The JVM provides **platform independence**: the same bytecode runs on any platform that has a JVM. For DevOps and SREs, understanding the JVM helps with tuning (heap size, GC choice), diagnosing crashes (heap dumps, thread dumps), and understanding process memory and CPU usage.

---

## Class loading, linking, and initialization

The JVM **loads** classes when they are first used (by name). **Loading** finds the binary form (e.g. from a .class file or JAR) and creates a Class object. **Linking** includes **verification** (bytecode checks), **preparation** (static field memory and default values), and **resolution** (symbolic references to concrete references). **Initialization** runs static initializers and static blocks. Class loaders form a hierarchy: **bootstrap** (core JDK classes), **platform/extension** (extension modules), **application** (classpath, module path). Understanding this helps with “class not found” or “wrong version” issues and with custom class loaders (e.g. in containers or application servers).

**Delegation and visibility.** Class loaders typically **delegate** to the parent before loading a class themselves. So the bootstrap loader loads core JDK classes; the application loader loads from the classpath. A class is uniquely identified by its binary name and the loader that loaded it; the same class name loaded by two different loaders are different types. That can cause LinkageError or ClassCastException when the same class is loaded from different loaders (e.g. in some app-server or plugin setups).

---

## Runtime data areas

The JVM spec defines runtime data areas. **Per-thread:** **PC register** (current instruction address), **Java stack** (frames for method calls: local variables, operands, return address). Stack overflow (e.g. unbounded recursion) causes StackOverflowError. **Shared:** **Heap** — where object instances and arrays live; shared by all threads; managed by the garbage collector. **Method area** (or **metaspace** in modern JVMs) — class metadata, constants, method data. **Native method stacks** — used when native code runs. The heap is usually the largest consumer of memory; you configure its size with options like **-Xmx** (max heap) and **-Xms** (initial heap). OutOfMemoryError often indicates heap exhaustion or metaspace exhaustion.

**Heap vs metaspace.** The heap holds object instances; its size is controlled by -Xms/-Xmx. Metaspace (since Java 8) holds class metadata (replacing the old “permanent generation”); it uses native memory and grows by default. If you load many classes (e.g. many JARs or dynamic generation), metaspace can grow large; limit it with -XX:MaxMetaspaceSize. A StackOverflowError means the thread’s stack is full (often deep recursion or very large local allocations); -Xss sets the per-thread stack size.

---

## Execution engine and bytecode

The **execution engine** runs bytecode. It can use an **interpreter** (execute bytecode instruction by instruction) or a **JIT (just-in-time) compiler** that compiles hot methods to native code for speed. Modern JVMs (e.g. HotSpot) use both: interpret first, then JIT-compile hot paths. The **garbage collector** reclaims heap memory for objects that are no longer reachable. Different GC algorithms (e.g. G1, ZGC, Shenandoah) trade off throughput, latency, and pause times; you select them with JVM flags. Long or frequent “stop-the-world” pauses can affect latency-sensitive applications; tuning heap size and GC is part of production readiness.

**GC basics for operators.** Objects are reclaimed when no live thread can reach them. **Stop-the-world** means all application threads are paused during parts of collection. **Generational** collectors (e.g. G1) separate young and old objects; most objects die young, so focusing collection on the young generation reduces pause impact. **ZGC** and **Shenandoah** aim for very short pauses regardless of heap size. -XX:+UseG1GC enables G1 (default in many JDKs); -XX:+UseZGC or -XX:+UseShenandoahGC enable those. Match heap size to container or host memory; too small causes frequent GC, too large can increase pause times or cause thrashing.

---

## Common JVM options for operators

- **-Xms** and **-Xmx** — Initial and maximum heap size (e.g. -Xms512m -Xmx2g). Setting -Xms equal to -Xmx avoids heap resizing and can improve predictability.  
- **-XX:+UseG1GC** — Use G1 garbage collector (default in many recent JDKs).  
- **-XX:MaxMetaspaceSize** — Cap metaspace to avoid unbounded native memory use.  
- **-Dproperty=value** — System property (e.g. -Dconfig.path=/etc/app).  
- **-classpath** or **-cp** — Classpath for the application.  
- **-verbose:gc** or **-Xlog:gc*** — GC logging for diagnostics (format varies by JDK; JDK 9+ uses -Xlog).  
- **-XX:+HeapDumpOnOutOfMemoryError** and **-XX:HeapDumpPath** — Produce a heap dump on OOM for later analysis.

Containers and orchestration (e.g. Kubernetes) often set heap size based on memory limits; the JVM can respect cgroup limits when configured (e.g. -XX:+UseContainerSupport in recent JDKs). Leave headroom for metaspace, thread stacks, and native allocations; setting -Xmx to the full container limit can cause the process to be killed when non-heap memory is used. Monitoring heap usage, GC pauses, and thread counts is standard for Java services in production.

---

## Summary

Maven uses a POM (pom.xml) and a standard directory layout (src/main/java, src/test/java); lifecycle phases (compile, test, package, install, deploy) run in order; parent POMs and dependencyManagement centralize versions and plugin config; use exclusions and dependency:tree to resolve conflicts. Gradle offers a DSL and is an alternative for Java and polyglot builds. The JVM loads and links classes (with delegation and class loader identity), then executes bytecode via interpreter and JIT; the heap holds objects (controlled by -Xms/-Xmx), metaspace holds class metadata. Choose a GC (e.g. G1, ZGC) and size heap and metaspace for your workload and environment; in containers, leave headroom for non-heap memory and use HeapDumpOnOutOfMemoryError for diagnostics.

---

## Further reading

- [Maven – Getting Started](https://maven.apache.org/guides/getting-started/)
- [Maven – POM Reference](https://maven.apache.org/pom.html)
- [Maven – Introduction to the lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Gradle – User manual](https://docs.gradle.org/current/userguide/userguide.html)
- [TutorialsPoint Java – JVM](https://www.tutorialspoint.com/java/java_jvm.htm)
- [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se25/html/)
- [Oracle – Java SE Documentation](https://docs.oracle.com/en/java/javase/)
