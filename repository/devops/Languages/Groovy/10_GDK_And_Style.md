# GDK and style

[← Back to Groovy](./README.md)

The Groovy Development Kit (GDK) adds methods and behaviors to standard JDK types (File, String, Collection, etc.) so common tasks need less code. This topic summarizes the GDK and key style and idiom guidelines so you can write readable, idiomatic Groovy.

---

## 1. Groovy Development Kit overview

The GDK extends **java.io.File**, **InputStream**, **OutputStream**, **Reader**, **Writer**, **String**, **Collection**, **Map**, and other types. You do not import a special library; these methods are available whenever you use Groovy.

**File and I/O.** **File** gets **eachLine**, **withReader**, **withWriter**, **withInputStream**, **withOutputStream**, **eachFile**, **eachFileRecurse**, **traverse**, **bytes** (read/write), **text** (read whole file as string). These methods typically accept a closure and manage opening and closing the resource, so you avoid manual **close()** and try/finally. **Path** (NIO) has similar helpers in recent Groovy.

**Collections.** **each**, **collect**, **find**, **findAll**, **every**, **any**, **inject**, **sum**, **join**, **sort**, **unique**, and many more work on lists, sets, and iterables. These take closures and make iterations and transformations concise.

**Strings.** **String** gets **eachLine**, **stripIndent**, **stripMargin**, **padLeft**, **padRight**, and other utilities. GStrings and interpolation are part of the language (topic 4).

**Other.** **Object** gets **with** and **tap** (execute a closure with the object as delegate; **tap** returns the object). **Number** and numeric types get **times**, **upto**, **downto**, and similar. The full list is in the GDK API documentation.

Example of idiomatic file and collection use:

```groovy
new File('haiku.txt').eachLine { line, nb -> println "Line $nb: $line" }
def list = new File('haiku.txt').collect { it }
file.bytes = [66, 22, 11]
def dir = new File('src')
dir.eachFileRecurse(FileType.FILES) { println it.name }
```

---

## 2. Style and idioms

**Semicolons.** Optional in Groovy; omit them for idiomatic code.

**Return.** The last expression in a method or closure is its return value; **return** is optional. Prefer an explicit **return** when it improves readability or when the last expression could be mistaken (e.g. an assignment).

**def and types.** Use either **def** or an explicit type, not both. Prefer explicit types for public APIs and method parameters to document contracts and help tooling. Omit **def** for untyped parameters: **void doSomething(param1, param2) { }**. Do not use **def** on constructors.

**Visibility.** Classes and methods are **public** by default; omit the **public** modifier. Use **@PackageScope** when you need package visibility (Groovy otherwise turns unmodified fields into properties).

**Parentheses.** Top-level method calls can omit parentheses: **println "Hello"**, **list.each { println it }**. When the last argument is a closure, put it outside the parentheses or omit parentheses: **list.each { println it }**. Parentheses are required for nested calls or no-arg calls when ambiguity would result.

**Getters and setters.** In Groovy, **obj.name** and **obj.name = value** call getters/setters. For simple beans (POGOs), declare **String name** and the compiler generates the field and accessors. Use **obj.@name** only when you need direct field access instead of the getter.

**Named parameters and with/tap.** You can construct and initialize with a map: **new Server(name: "Obelix", cluster: aCluster)**. For multiple operations on the same object, use **with { }** (returns last expression) or **tap { }** (returns the object): **server.with { name = application.name; status = status; start() }**.

**== and equals.** Use **==** for logical equality (null-safe); use **a.is(b)** or **===** for reference identity.

**GStrings.** Prefer **"${expr}"** over string concatenation; use **${ -> var }** for lazy evaluation. Use single-quoted strings for constants without interpolation.

**Native structures.** Use **[]** for lists, **[:]** for maps, **..** and **..<** for ranges, **~/pattern/** for regex, **in** for membership, **<<** for append.

**Groovy truth.** Use **if (name)** instead of **if (name != null && name.length() > 0)** where appropriate; empty collections and zero are false.

**Safe navigation.** Use **?.** to avoid null checks: **println order?.customer?.address**.

**Elvis.** Use **expr ?: default** for default values instead of repeating the expression in a ternary.

**Assert.** Groovy **assert** is always enabled and gives “power assert” output (evaluation of subexpressions). Use it for preconditions and tests.

**Optional typing.** Prefer strong typing for public APIs; **def** or untyped parameters are fine for internal or script code when brevity or flexibility matters.

---

## 3. Why this matters

The GDK and these idioms are what make Groovy scripts and Jenkins/Gradle code short and readable. Using **eachLine**, **withReader**, **each**, **collect**, and **?.** in pipelines and build scripts matches how the language is intended to be used and reduces boilerplate.

---

## Further reading

- [The Groovy Development Kit](https://groovy-lang.org/groovy-dev-kit.html)
- [GDK API](https://groovy-lang.org/gdk.html)
- [Style guide](https://groovy-lang.org/style-guide.html)
