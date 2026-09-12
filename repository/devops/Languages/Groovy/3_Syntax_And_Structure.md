# Syntax and program structure

[← Back to Groovy](./README.md)

Groovy’s grammar derives from the Java grammar but adds Groovy-specific constructs and allows certain simplifications. This topic covers comments, keywords, identifiers, packages, and imports in enough detail to read and write valid Groovy and to understand how scripts and classes are organized.

---

## 1. Comments

**Single-line comment.** Single-line comments start with **//** and can appear at any position on the line. Everything from **//** to the end of the line is part of the comment.

```groovy
// a standalone single line comment
println "hello" // a comment till the end of the line
```

**Multiline comment.** A multiline comment starts with **/*** and ends at the first ***/**. Newlines are included. Multiline comments can appear at the end of a statement or inside it.

```groovy
/* a standalone multiline comment
   spanning two lines */
println "hello" /* a multiline comment starting
                   at the end of a statement */
println 1 /* one */ + 2 /* two */
```

**Groovydoc comment.** Groovydoc comments are multiline and start with **/** and end with ***/**. Lines after the first can optionally start with **\***. These comments are associated with type definitions (classes, interfaces, enums, annotations), fields and properties, and methods. Place the comment immediately before the construct it describes. Groovydoc uses the same conventions and tags as Javadoc.

```groovy
/**
 * A Class description
 */
class Person {
    /** the name of the person */
    String name

    /**
     * Creates a greeting method for a certain person.
     * @param otherPerson the person to greet
     * @return a greeting message
     */
    String greet(String otherPerson) {
       "Hello ${otherPerson}"
    }
}
```

**Runtime Groovydoc (Groovy 3+).** Groovydoc can be retained at runtime. It is disabled by default; enable it with the JVM option **-Dgroovy.attach.runtime.groovydoc=true**. Runtime Groovydoc starts with **/**@** and ends with ***/**. You can then read it from the class or method at runtime (e.g. **Foo.class.groovydoc.content**).

**Shebang line.** On Unix-like systems, a line starting with **#!** (e.g. **#!/usr/bin/env groovy**) is treated as the script interpreter. The **#** must be the first character of the file; any leading indentation causes a compilation error. After installing Groovy and having **groovy** on **PATH**, you can run the script directly:

```groovy
#!/usr/bin/env groovy
println "Hello from the shebang line"
```

---

## 2. Keywords

**Reserved keywords.** The following are reserved and cannot be used as variable, field, or method names in general: **abstract**, **assert**, **break**, **case**, **catch**, **class**, **const**, **continue**, **def**, **default**, **do**, **else**, **enum**, **extends**, **final**, **finally**, **for**, **goto**, **if**, **implements**, **import**, **instanceof**, **interface**, **native**, **new**, **null**, **non-sealed**, **package**, **public**, **protected**, **private**, **return**, **static**, **strictfp**, **super**, **switch**, **synchronized**, **this**, **threadsafe**, **throw**, **throws**, **transient**, **try**, **while**. Of these, **const**, **goto**, **strictfp**, and **threadsafe** are not currently used by the language.

**Quoted method names.** You can define a method whose name is a reserved keyword by using a quoted name. When calling it, you must qualify with **this.**:

```groovy
def "abstract"() { true }
this.abstract()
```

This is mainly for DSLs and Java integration; avoid keyword method names in normal code.

**Contextual keywords.** The following are keywords only in certain contexts and can be used as variable, field, or method names elsewhere: **as**, **in**, **permits**, **record**, **sealed**, **trait**, **var**, **yields**.

```groovy
def as = true
assert as
def in() { true }
this.in()
```

**Other reserved words.** Primitive type names (**boolean**, **char**, **byte**, **short**, **int**, **long**, **float**, **double**) and the literals **null**, **true**, **false** are also reserved in the same way. The same quoted-name trick can be used for methods (e.g. **def "null"() { true }**) but is not recommended.

---

## 3. Identifiers

**Normal identifiers.** Identifiers start with a letter, **$**, or **_**, and cannot start with a digit. A letter includes ASCII **a–z**, **A–Z**, and Unicode ranges such as **\u00C0**–**\u00D6**, **\u00D8**–**\u00F6**, **\u00F8**–**\u00FF**, **\u0100**–**\uFFFE**. Subsequent characters can be letters or digits.

Valid examples: **name**, **item3**, **with_underscore**, **$dollarStart**. Invalid: **3tier**, **a+b**, **a#b**.

After a dot, keywords are valid as identifiers: **foo.as**, **foo.assert**, **foo.break**.

**Quoted identifiers.** After the dot in a dotted expression you can use a quoted string as the identifier. That allows characters that are illegal in normal identifiers (e.g. space, dash, exclamation). Use **person."name"** or **person.'name'**; any string literal form is allowed (single, double, triple, slashy, dollar-slashy).

```groovy
def map = [:]
map."an identifier with a space and double quotes" = "ALLOWED"
map.'with-dash-signs-and-single-quotes' = "ALLOWED"
assert map."an identifier with a space and double quotes" == "ALLOWED"
```

If the quoted string is a GString, the interpolated value is used to form the identifier:

```groovy
def firstname = "Homer"
map."Simpson-${firstname}" = "Homer Simpson"
assert map.'Simpson-Homer' == "Homer Simpson"
```

---

## 4. Package names

Package names work as in Java. Declare the package at the top of the file before any imports or code. Code without a package declaration is in the default package.

```groovy
package com.example

class MyClass { }
```

To refer to a class in another package you use its fully qualified name or an import.

---

## 5. Imports

**Default imports.** The following are imported by default, so you do not need an explicit **import** for them: **java.lang.\***, **java.util.\***, **java.io.\***, **java.net.\***, **java.time.\***, **groovy.lang.\***, **groovy.util.\***, **java.math.BigInteger**, **java.math.BigDecimal**. That is why **Date**, **List**, **File**, and similar types work without import.

**Simple import.** A simple import gives the full class name: **import groovy.xml.MarkupBuilder**.

**Star import.** **import groovy.xml.\*** imports all types from that package. Useful when using several classes from the same package; be aware of namespace clutter.

**Static import.** **import static java.lang.Math.sin** lets you call **sin(0)** without the **Math.** prefix.

**Static star import.** **import static java.lang.Math.\*** imports all static members of the class.

**Static import aliasing.** **import static Calendar.getInstance as now** lets you call **now()** instead of **getInstance()** for readability.

**Import aliasing.** **import java.sql.Date as SQLDate** lets you use **SQLDate** in the same file as **java.util.Date** without fully qualifying one of them.

```groovy
import java.util.Date
import java.sql.Date as SQLDate
Date utilDate = new Date(1000L)
SQLDate sqlDate = new SQLDate(1000L)
```

**Namespace conflicts.** It is an error to have two imports that resolve to the same simple name, or to declare a type with the same name as an imported type. Inner types can shadow an imported name within their scope.

---

## 6. Scripts versus classes (overview)

A **script** is a file whose top-level statements are compiled into a class that extends **groovy.lang.Script**: the statements are placed in a generated **run** method, and a **main** entry point is generated. A **class** file contains explicit class (or trait, etc.) definitions. A file can contain both a script body and class definitions. Topic 7 describes scripts and classes in detail, including variables, the binding, and **@Field**.

---

## Further reading

- [Syntax](https://groovy-lang.org/syntax.html)
- [Program structure](https://groovy-lang.org/structure.html)
