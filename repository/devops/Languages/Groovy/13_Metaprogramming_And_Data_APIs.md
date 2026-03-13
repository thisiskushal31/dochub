# Metaprogramming and working with data

[← Back to Groovy](./README.md)

This topic gives a short overview of runtime and compile-time metaprogramming in Groovy and of standard data APIs (JSON, XML, YAML, databases, templates). These areas support advanced use cases and the “working with data” scenarios listed in the documentation.

---

## 1. Metaprogramming overview

**Runtime metaprogramming.** Groovy allows changing classes and objects at runtime. **ExpandoMetaClass** (or **metaClass** on a class) lets you add or replace methods, properties, or constructors with closure-based definitions. **methodMissing** and **propertyMissing** on a class can handle unknown method or property calls and are often used in DSLs. **MetaClass** determines how method and property access is resolved; you can swap or customize it per class or per instance. This makes Groovy flexible but has performance and predictability trade-offs; for hot paths, **@CompileStatic** avoids dynamic dispatch.

**Compile-time metaprogramming.** AST (Abstract Syntax Tree) transformations run during compilation. Examples: **@Immutable**, **@EqualsAndHashCode**, **@ToString**, **@TupleConstructor**, **@Slf4j**, **@CompileStatic**. They generate code (fields, methods, or bytecode) so you write less boilerplate or enforce static typing. Compilation customizers can inject imports, alter the AST, or apply transformations to scripts and classes. These are documented under “compile-time metaprogramming” and “AST transformations.”

**When to use.** Runtime metaprogramming is useful for DSLs, mocking, and dynamic behavior; use it where flexibility matters. Compile-time transformations and **@CompileStatic** are better for performance and clarity in large or performance-sensitive code. In Jenkins and Gradle, you mostly use existing DSLs rather than implementing metaprogramming yourself.

---

## 2. Working with JSON

Groovy can parse and produce JSON. **JsonSlurper** parses JSON into Groovy structures (maps, lists). **JsonOutput** or **JsonBuilder** produce JSON from maps, lists, or object graphs. **groovy.json** is the standard package. Useful for REST clients, config, or pipeline input/output.

```groovy
import groovy.json.JsonSlurper
import groovy.json.JsonOutput
def slurper = new JsonSlurper()
def data = slurper.parseText('{"key": "value"}')
assert data.key == 'value'
assert JsonOutput.toJson([a: 1, b: 2]) == '{"a":1,"b":2}'
```

---

## 3. Working with XML

**XmlSlurper** and **XmlParser** parse XML into a GPathResult or Node; you can query with GPath (e.g. **doc.root.children()**, **doc.'**'.find { it.name() == 'tag' }**). **MarkupBuilder** and **StreamingMarkupBuilder** produce XML. The **groovy.xml** package is the main entry. Pipelines and tools often consume or produce XML (e.g. test results, config).

---

## 4. Working with YAML

YAML support is available via **SnakeYAML** or Groovy’s YAML support (e.g. **groovy.yaml** in recent versions). You can load config or pipeline-related YAML and work with the resulting maps and lists.

---

## 5. Working with databases

Groovy can use **Sql** (groovy.sql) for JDBC-based access: **Sql.newInstance(url, user, password, driver)** and **sql.eachRow('SELECT * FROM t') { }**, **sql.execute**, etc. **@Grab** can pull in a JDBC driver; **@GrabConfig(systemClassLoader=true)** is often required for JDBC. This is useful for scripts that need to query or update a database.

---

## 6. Template engines

Groovy has built-in template engines (e.g. **SimpleTemplateEngine**, **GString**-based templates) for generating text from a template and a model (map or binding). Useful for emails, reports, or generated config. Template engines are documented under “Template engines” in the module guides.

---

## 7. Why this matters

Metaprogramming explains how DSLs and dynamic APIs are built; when you see fluent or “magic” APIs in Groovy, they often rely on **delegate**, **methodMissing**, or AST transforms. JSON/XML/YAML and database support are standard “working with data” use cases in scripts and applications. Together they round out the picture from language basics to advanced and data-oriented use.

---

## Further reading

- [Runtime and compile-time metaprogramming](https://groovy-lang.org/metaprogramming.html)
- [Parsing and producing JSON](https://groovy-lang.org/processing-json.html)
- [Processing XML](https://groovy-lang.org/processing-xml.html)
- [Processing YAML](https://groovy-lang.org/processing-yaml.html)
- [Working with a relational database](https://groovy-lang.org/databases.html)
- [Template engines](https://groovy-lang.org/templating.html)
