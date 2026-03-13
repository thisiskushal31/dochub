# Differences with Java

[← Back to Groovy](./README.md)

Groovy is designed to feel natural to Java developers but differs in several important ways. This topic summarizes those differences so you can avoid subtle bugs and understand behavior when reading or writing Groovy (e.g. in Jenkins or Gradle).

---

## 1. Default imports

The following are imported by default: **java.io.\***, **java.lang.\***, **java.math.BigDecimal**, **java.math.BigInteger**, **java.net.\***, **java.time.\***, **java.util.\***, **groovy.lang.\***, **groovy.util.\***. You do not need an explicit **import** for **Date**, **List**, **File**, **Map**, and similar.

---

## 2. Multi-methods (runtime dispatch)

In Groovy, the method to invoke is chosen at **runtime** based on the **actual** types of the arguments. In Java it is chosen at **compile time** based on **declared** types. So the same source can behave differently in Java vs Groovy:

```groovy
int method(String arg) { return 1 }
int method(Object arg) { return 2 }
Object o = "Object"
int result = method(o)
// In Java: result == 2 (o is declared Object)
// In Groovy: result == 1 (o is actually a String at runtime)
```

---

## 3. Array initializers

In Java, **int[] a = {1, 2, 3}** is valid. In Groovy **{ }** is reserved for closures, so that syntax is not used. Use **int[] a = [1, 2, 3]** or (Groovy 3+) **def a = new int[] {1, 2, 3}**.

---

## 4. Package scope visibility

In Java, a field with no modifier is package-private. In Groovy, a field with no modifier becomes a **property**: a private field plus getter and setter. For real package-private fields use **@PackageScope**:

```groovy
class Person {
    @PackageScope String name
}
```

---

## 5. ARM (try-with-resources)

Java 7+ try-with-resources is supported from Groovy 3+. Groovy also provides closure-based APIs that are often more idiomatic, e.g. **new File('/path/to/file').eachLine('UTF-8') { println it }** or **withReader('UTF-8') { reader -> reader.eachLine { println it } }**.

---

## 6. Inner classes

Static inner classes work as in Java. For non-static inner classes, before Groovy 3 you create the inner instance with **new X(outer)** instead of **outer.new X()**. Groovy 3+ supports **outer.new X()**. Note: Groovy allows calling constructors with one parameter without an argument (parameter becomes null), so **new X()** can accidentally be used instead of **new X(this)**; prefer static inner classes when possible.

---

## 7. Lambda expressions and method reference

Java 8+ lambdas (**() -> ...**) and **::** method references are supported in Groovy 3+ (Parrot parser). In older Groovy use closures: **Runnable run = { println 'run' }**, **list.each { println it }**.

---

## 8. GStrings

Double-quoted strings with **${...}** or **$var** are **GString**. When a method expects **String**, **toString()** is called automatically. But if a Java API takes **Object** and checks the runtime type, it might not treat GString as String. Also: **GString** and **String** have **different hashCode()**; do not use GString as map keys if you will look up with String.

---

## 9. String and character literals

Single-quoted literals are **String** in Groovy (no char type literal). So **'c'.class == String**. Double-quoted **"c"** is also **String**; **"c${1}"** is **GString**. Groovy auto-casts single-character **String** to **char** only when assigning to a **char** variable. For method arguments of type **char** you may need an explicit cast: **(char)'a'** or **'a' as char**. For multi-character strings, **as char** takes the first character; C-style **(char)** can throw.

---

## 10. Behaviour of ==

In Java **==** is primitive equality or reference identity for objects. In Groovy **==** is always logical equality: for **Comparable** it uses **compareTo** (result == 0), otherwise **equals**. For reference identity use **a.is(b)** or **a === b** / **a !== b** (Groovy 3+).

---

## 11. Primitives and wrappers

Groovy treats primitives and wrappers more uniformly: you can call methods on what looks like a primitive because it is boxed when needed. Overload resolution differs from Java: Groovy may choose **m(Integer)** over **m(long)** when you pass an **int**, because it tends to use the wrapper type; Java might choose **m(long)** (widening). So the same overload can be chosen differently in the two languages.

With **@CompileStatic**, numeric expressions that use only primitives can be compiled to the same bytecode as Java. For positive/negative zero: primitives follow IEEE 754 (0.0f == -0.0f); wrapper **Float.equals** distinguishes them. In Groovy, **==** can map to **equals**, so **Float** values may not be “equal” by **==** when you expect. Prefer **equals** or **equalsIgnoreZeroSign** when the sign of zero matters.

---

## 12. Conversions

Groovy supports more automatic conversions than Java (e.g. between numeric types, boxing, **BigInteger**/ **BigDecimal**). Truncation and coercion rules are defined for boolean, numeric, and character types. When converting to boolean, Groovy uses “Groovy truth”. When in doubt, use explicit casts or check the exact conversion behavior for the types you use.

---

## 13. Extra keywords

In addition to Java-like keywords, Groovy has **as**, **def**, **in**, **trait**; **it** is implicit inside closures. **var** (Groovy 3+) is allowed as in Java 10+. Some keywords can appear in limited contexts (e.g. **var var = [def: 1, as: 2]** compiles) but you should avoid using them as variable or method names for clarity.

---

## Further reading

- [Differences with Java](https://groovy-lang.org/differences.html)
