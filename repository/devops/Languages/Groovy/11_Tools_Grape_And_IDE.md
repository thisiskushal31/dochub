# Tools, Grape, and IDE

[← Back to Groovy](./README.md)

This topic covers the Groovy toolchain (groovyc, groovydoc, groovysh, groovyConsole), the Grape dependency manager for scripts, and IDE integration. These tools support compiling, documenting, experimenting, and scripting with Groovy from the command line and from your editor.

---

## 1. groovyc – the Groovy compiler

**groovyc** compiles Groovy sources to JVM bytecode. It plays the same role as **javac** for Java. By default it writes **.class** files next to the source (or in the current directory). Common options:

**Classpath:** **-cp** or **--classpath** must usually come first when you need dependencies.

**Output directory:** **-d** sends generated classes to a given directory.

**Encoding:** **--encoding** sets the source file encoding (e.g. **utf-8**).

**Joint compilation:** **-j** or **--jointCompilation** compiles Groovy and Java together: Groovy stubs are generated, then **javac** compiles Java and stubs, then Groovy finishes. Use when the project mixes **.groovy** and **.java** files.

**Script base class:** **--basescript** sets the base class for scripts (must extend **Script**).

**Help and version:** **--help**, **-v** or **--version**.

**Exception display:** **-e** or **--exception** prints the stack trace on compilation error.

```bash
groovyc MyClass.groovy
groovyc -d target -cp lib/dep.jar Person.groovy
groovyc --encoding utf-8 script.groovy
groovyc -j A.groovy B.java
```

---

## 2. groovydoc – documentation generator

**groovydoc** generates HTML documentation from Groovy (and Java) source, similar to Javadoc. Invocation:

```bash
groovydoc [options] [packagenames] [sourcefiles]
```

Common options: **-d** or **--destdir** (output directory), **-sourcepath** (where to find sources), **-windowtitle**, **-doctitle**, **-charset** / **-fileEncoding**, **-private** / **-protected** / **-public** / **-package** (visibility), **-noscripts** (skip scripts), **-nomainforscripts** (omit generated main from script docs), **--help**.

```bash
groovydoc -d build/docs -sourcepath src/main/groovy -windowtitle "My API" org.example.*
```

Gradle and Maven have plugins that wrap groovydoc; use them in larger projects so documentation is part of the build.

---

## 3. groovysh – REPL-like shell

**groovysh** is an interactive shell where you type Groovy statements and see results. Useful for trying expressions, checking syntax, or quick experiments. No file is required.

```bash
groovysh
```

Inside the shell you can run statements, define variables and closures, and inspect values. For script-like dependency resolution you can use **Grape.grab(...)** from **groovy.grape.Grape** (e.g. **Grape.grab(group:'org.springframework', module:'spring-orm', version:'5.2.8.RELEASE')**).

---

## 4. groovyConsole – Swing console

**groovyConsole** opens a graphical window with an editor pane and an output pane. You type or paste Groovy code and run it. Handy for snippets and for debugging without the command line.

```bash
groovyConsole
```

---

## 5. Grape – dependency manager for scripts

Grape (Groovy Adaptable Packaging Engine) pulls Maven-style dependencies at runtime so a script can depend on libraries without a full build. Dependencies are cached under **~/.groovy/grapes** (or the path set by **-Dgrape.root**).

**@Grab.** The usual way is to annotate the script (or a class) with **@Grab** so the dependency is added before the script runs. Use the shorthand **group:module:version** or the long form with **group**, **module**, **version**.

```groovy
@Grab('org.springframework:spring-orm:5.2.8.RELEASE')
import org.springframework.jdbc.core.JdbcTemplate
```

Multiple dependencies use multiple **@Grab** annotations (or **@Grapes([@Grab(...), @Grab(...)])** in older style). **@GrabExclude** excludes transitive dependencies. **@GrabResolver** adds a repository. **@GrabConfig(systemClassLoader=true)** is sometimes needed for JDBC drivers so the driver is on the system class loader.

**Command line.** To preinstall or inspect the cache:

```bash
grape install <group> <module> [<version>]
grape list
grape resolve <groupId> <artifactId> <version>
grape uninstall <group> <module> <version>
```

**Proxy.** When behind a proxy, set **-Dhttp.proxyHost** and **-Dhttp.proxyPort** (or **JAVA_OPTS**) so Grape can download.

**Logging.** **-Dgroovy.grape.report.downloads=true** prints resolve and download activity.

---

## 6. IDE integration

Groovy is supported by common IDEs via plugins (e.g. Groovy-Eclipse, IntelliJ Groovy plugin). Features typically include syntax highlighting, completion, refactoring, run/debug of scripts and classes, and Gradle/Maven integration. Install the plugin for your IDE and point it at your JDK and Groovy (or use the Gradle/Maven plugin to supply Groovy). This gives you a consistent experience when editing Jenkinsfiles, **build.gradle**, or standalone Groovy projects.

---

## Further reading

- [groovyc](https://groovy-lang.org/groovyc.html)
- [groovydoc](https://groovy-lang.org/groovydoc.html)
- [groovysh](https://groovy-lang.org/groovysh.html)
- [groovyConsole](https://groovy-lang.org/groovyconsole.html)
- [The Grape dependency manager](https://groovy-lang.org/grape.html)
- [IDE integration](https://groovy-lang.org/ides.html)
