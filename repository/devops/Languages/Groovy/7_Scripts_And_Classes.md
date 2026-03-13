# Scripts and classes

[← Back to Groovy](./README.md)

Groovy supports both scripts (files of statements and optionally methods) and classes. This topic explains how scripts are compiled, how the **run** method and binding work, how variables and methods behave, and how JEP 445–style scripts differ, so you can reason about Jenkinsfiles and Gradle build scripts.

---

## 1. Motivation for scripts

In Java, executable code must live inside a class and a **public static void main(String[])** method. In Groovy you can write a file that is just statements; the compiler wraps them in a script class. So the following is valid and equivalent to a class with **main** calling **run**:

```groovy
println 'Groovy world!'
```

---

## 2. Script class compilation

A script is always compiled into a class that extends **groovy.lang.Script**. The compiler copies the script body into a **run** method and generates a **main(String[])** that delegates to **InvokerHelper.runScript(scriptClass, args)**. The name of the generated class is the base name of the file (e.g. **Main.groovy** → **Main**).

Conceptually the script:

```groovy
println 'Hello'
int power(int n) { 2**n }
println "2^6==${power(6)}"
```

is compiled as if it were:

```groovy
class Main extends Script {
    int power(int n) { 2**n }
    def run() {
        println 'Hello'
        println "2^6==${power(6)}"
    }
    static void main(String[] args) {
        InvokerHelper.runScript(Main, args)
    }
}
```

Statements not inside a method or class (“loose” statements) are assembled in order into **run**. Method definitions are copied onto the script class. Line numbers are preserved in bytecode so stack traces match the source.

---

## 3. Methods in scripts

You can define methods at the top level. They become methods of the generated script class. You can mix loose statements and method definitions; loose statements are still collected into **run** in order.

```groovy
int fib(int n) {
    n < 2 ? 1 : fib(n-1) + fib(n-2)
}
assert fib(10) == 89
```

---

## 4. Variables in scripts: local vs binding vs @Field

**Declared variables (type or def).** If you write **int x = 1** or **def y = 2**, **x** and **y** are **local variables** of the generated **run** method. They are not visible to other methods of the script or to the outside. They are not stored in the script binding.

**Undeclared variables.** If you write **x = 1** (no type, no **def**), **x** goes into the script’s **binding** (the object returned by **getBinding()**). The binding is shared: all methods of the script see the same binding, and when the script is run inside a host (e.g. Jenkins), the host can inject or read variables through the binding. So undeclared variables are the way to share state between the script and the pipeline or between “steps” that run in the same script context.

**@Field.** A variable annotated with **@Field** becomes a **field** of the generated script class (not a local of **run**, not in the binding). It is visible to all methods of the script. Access does not go through the binding. If you have both a local/binding variable and a **@Field** with the same name, avoid confusion; you can use **binding.varName** to access the binding variable explicitly.

```groovy
// local: only inside run
int a = 1
def b = 2

// binding: visible to methods and host
c = 3

// field: visible to methods, not in binding
@Field def d = 4
```

---

## 5. Convenience variations: custom main or run

Normally you must not define your own **main** or **run** because the compiler generates them. Exceptions (so you can add annotations or match a specific form):

- **Only** a **main** method and no loose statements: you can define **static main(args)** (untyped, **String[]**, or no-arg in Groovy 5). No loose statements are collected; your **main** is used.
- **Only** a no-arg **run** instance method and no loose statements (Groovy 5): your **run** is used, and the script can extend **Script** and use bindings. Useful for annotations (e.g. **@JsonIgnoreProperties**) or when you need script context.

Example with explicit **main**:

```groovy
@CompileStatic
static main(args) {
    println 'Groovy world!'
}
```

---

## 6. JEP 445 compatible scripts (Groovy 5)

Groovy 5 supports scripts that look like Java’s JEP 445 entry points: a class with a **main** method and no loose statements. Such scripts:

- Do **not** extend **Script** and have no binding or script context.
- Do **not** get an auto-generated **main**.
- Can define extra fields and methods in addition to **main**.
- Cannot have loose statements outside **main** (only field definitions and **main**/methods).

Example:

```groovy
void main(args) {
    println new Date()
}
```

With fields and helpers:

```groovy
def main() {
    assert upper(foo) + lower(bar) == 'FOObar'
}
def upper(s) { s.toUpperCase() }
def lower = String::toLowerCase
def (foo, bar) = ['Foo', 'Bar']
```

Multi-assignment at top level becomes separate field definitions. For script-like behavior with binding and **Script** base class, use the traditional script form or the no-arg **run** convenience form instead of JEP 445.

---

## 7. Classes in the same file

A **.groovy** file can contain one or more class (or trait, etc.) definitions. It can also contain a script body. Execution of the file runs the script body (the generated **run**); classes are available for use by the script or by other code. Scripts and classes in the same file follow the same package and import rules.

---

## 8. Why this matters for DevOps

In **Jenkins**, a Jenkinsfile is usually a script. Variables you set without **def** (e.g. **env.BRANCH_NAME**) or that the pipeline provides (e.g. **params**) are typically in the binding or provided by the pipeline context. Knowing that declared variables are local to **run** and undeclared ones are in the binding helps when sharing state between **stage** blocks or with the host.

In **Gradle**, **build.gradle** is evaluated as a script whose **delegate** is set to the **Project**. Top-level method calls (e.g. **apply**, **dependencies**) are invoked on the project. Closure blocks (e.g. **dependencies { }**) have their **delegate** set so that **implementation**, **testImplementation**, etc. resolve correctly. Script variables and the binding are less prominent than in Jenkins but the same rules apply.

---

## Further reading

- [Program structure – Scripts versus classes](https://groovy-lang.org/structure.html)
