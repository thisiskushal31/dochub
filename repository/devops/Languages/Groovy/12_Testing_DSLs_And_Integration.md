# Testing, DSLs, and integrating Groovy

[← Back to Groovy](./README.md)

This topic summarizes testing support (power assertions, mocking, JUnit, Spock), domain-specific languages (DSLs) in Groovy, and how to integrate Groovy into Java or Groovy applications (Eval, GroovyShell, Binding, GroovyClassLoader, JSR 223). It supports the goals of understanding the language and its use cases from a software-engineering perspective.

---

## 1. Testing

**Power assertions.** Groovy’s **assert** is always enabled (unlike Java’s **-ea**). When an assertion fails, the error message shows the value of subexpressions, which helps debugging. Use **assert condition** or **assert condition : "message"** (the second form uses a custom message and does not show power-assert expansion).

**Mocking and stubbing.** You can use maps and closures to mock interfaces: **def service = [convert: { String key -> 'some text' }] as TranslationService**. Closure coercion to SAM types lets you pass a closure where an interface with one method is expected. **MockFor** and **StubFor** (groovy.mock.interceptor) support ordered or unordered expectations and **verify**; they do not work with **@CompileStatic** or Java classes—use Spock or a Java mocking library there. **ExpandoMetaClass** allows adding methods or behavior dynamically for tests.

**JUnit.** Groovy integrates with JUnit; you can write test classes in Groovy and run them with JUnit runners. Many teams use JUnit 4 or 5 with Groovy for unit tests.

**Spock.** Spock is a testing framework for the JVM with a Groovy-based DSL. Specifications extend **spock.lang.Specification** and use blocks like **given**, **when**, **then**, **expect**, **where**. It supports data-driven tests, mocking, and clear failure messages. Spock is widely used for testing Groovy and Java code.

**Geb.** Geb is a browser automation and page-object framework built on Groovy and Selenium, useful for functional and UI tests.

---

## 2. Domain-specific languages (DSLs)

Groovy’s syntax and runtime make it well suited for internal DSLs: closures, optional parentheses, **delegate** and **resolveStrategy**, and **with**/ **tap** allow API design that reads like a custom language. Build scripts (Gradle) and pipeline definitions (Jenkins) are examples: **dependencies { implementation 'x:y:z' }** and **stage('Build') { sh 'make' }** are Groovy with the closure’s **delegate** set to a context object. Command-chain expressions and **methodMissing**/ **propertyMissing** can extend the syntax further. AST transformations and compilation customizers support compile-time DSLs. When writing or reading such code, remember that the block is a closure and the “keywords” are methods on the delegate.

---

## 3. Integrating Groovy into applications

**Eval.** **Eval.me('expression')** evaluates a Groovy expression string and returns the result. **Eval.x(4, '2*x')**, **Eval.xy(4, 5, 'x*y')**, and similar variants bind variables. Simple and useful for one-off expressions; no caching or reuse of compiled script.

**GroovyShell.** **new GroovyShell()** and **shell.evaluate('code')** run script code. **shell.parse('code')** returns a **Script** instance you can run multiple times. Pass a **Binding** to the constructor to share variables: **def binding = new Binding(); binding.setProperty('x', 1); def shell = new GroovyShell(binding)**. Scripts can read and write binding variables (use undeclared variables to write). For thread safety, use a separate **Binding** (or **Script** instance) per execution. **CompilerConfiguration** and **scriptBaseClass** let you use a custom script base class with extra methods or properties.

**GroovyClassLoader.** **gcl.parseClass('class Foo { ... }')** compiles a string or file and returns a **Class**; you can instantiate it and call methods. Use for dynamic classes, not only scripts. Parsing the same string twice yields two different classes; parsing the same **File** is cached. Be aware of classloader and memory when compiling many dynamic classes.

**GroovyScriptEngine.** **GroovyScriptEngine** takes a set of URLs (e.g. script directories), runs scripts by name, and supports reloading when sources change and dependencies between scripts. Useful for plugin or script-reload scenarios.

**JSR 223.** **ScriptEngineManager** and **engine = manager.getEngineByName("groovy")** provide the standard Java scripting API. **engine.eval("code")** and **engine.put**/ **get** for bindings work with Groovy. For Groovy-only integration, **GroovyShell** and **Binding** are more flexible; use JSR 223 when you need a language-agnostic API.

---

## 4. Why this matters

Testing ensures that pipeline and build logic behave as expected; power assertions and Spock are common in Groovy projects. DSLs are how Jenkins and Gradle expose their configuration; integration APIs (GroovyShell, Binding) are how embedding and scripting work. Understanding these areas completes the picture from basics to advanced use and from software engineering to DevOps and automation.

---

## Further reading

- [Testing guide](https://groovy-lang.org/testing.html)
- [Domain-Specific Languages](https://groovy-lang.org/dsls.html)
- [Integrating Groovy into applications](https://groovy-lang.org/integrating.html)
