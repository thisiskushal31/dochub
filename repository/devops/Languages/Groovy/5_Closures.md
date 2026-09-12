# Closures

[← Back to Groovy](./README.md)

A closure in Groovy is an open, anonymous block of code that can take arguments, return a value, and be assigned to a variable. It may reference variables from its surrounding scope. Closures are instances of **groovy.lang.Closure** and are central to iterations, DSLs, and callbacks. This topic covers syntax, parameters, delegation (this, owner, delegate, resolveStrategy), and common patterns (currying, memoization, composition, method pointers).

---

## 1. Syntax and definition

**Form.** A closure is **{ [closureParameters -> ] statements }**. **closureParameters** is an optional comma-separated list (typed or untyped). When parameters are present, **->** is required to separate them from the body. The body has zero or more statements.

```groovy
{ item++ }
{ -> item++ }
{ println it }
{ it -> println it }
{ name -> println name }
{ String x, int y -> println "hey ${x} the value is ${y}" }
{ reader -> def line = reader.readLine(); line.trim() }
```

**As object.** A closure is an instance of **groovy.lang.Closure**, so it can be assigned to a variable or field. You can type it as **Closure** or **Closure<Boolean>** for a specific return type.

```groovy
def listener = { e -> println "Clicked on $e.source" }
assert listener instanceof Closure
Closure<Boolean> isTextFile = { File it -> it.name.endsWith('.txt') }
```

**Calling.** Call like a method: **closure()** or **closure(args)**. Alternatively **closure.call()** or **closure.call(args)**. A closure always returns a value (last expression or **null**).

```groovy
def code = { 123 }
assert code() == 123 && code.call() == 123
def isOdd = { int i -> i%2 != 0 }
assert isOdd(3) == true && isOdd.call(2) == false
```

---

## 2. Parameters

**Normal parameters.** Same rules as method parameters: optional type, name, optional default value, comma-separated.

```groovy
def closureWithTwoArgAndDefaultValue = { int a, int b=2 -> a+b }
assert closureWithTwoArgAndDefaultValue(1) == 3
```

**Implicit parameter (it).** If you do not declare a parameter list (no **->** before the body), the closure has one implicit parameter named **it**. So **{ "Hello, $it!" }** is the same as **{ it -> "Hello, $it!" }**. To define a closure that accepts no arguments you must use an explicit empty list: **{ -> 42 }**; then **closure(11)** would be invalid.

**Varargs.** The last parameter can be **String... args** or **String[] args**; the closure can then be called with a variable number of arguments.

```groovy
def concat1 = { String... args -> args.join('') }
assert concat1('abc','def') == 'abcdef'
def multiConcat = { int n, String... args -> args.join('')*n }
assert multiConcat(2, 'abc','def') == 'abcdefabcdef'
```

---

## 3. Delegation: this, owner, delegate

**this.** Inside a closure, **this** (or **getThisObject()**) refers to the **enclosing class** where the closure is defined, not the closure itself. For nested closures, **this** still refers to the closest enclosing class. So you can call methods on the enclosing class via **this**.

**owner.** **owner** (or **getOwner()**) is the **direct enclosing object**—either a class or another closure. For a closure defined in a class, **owner** is that class. For a closure defined inside another closure, **owner** is the enclosing closure (unlike **this**, which stays the class).

**delegate.** **delegate** (or **getDelegate()**) is a third-party object used to resolve property and method references when they are not defined on the closure itself. By default **delegate** is set to **owner**. You can set **closure.delegate = someObject** so that unqualified names (e.g. **name**) are resolved on **someObject**. This is how Groovy DSLs work: the script or builder sets **delegate** to a context object.

```groovy
class Person { String name }
class Thing { String name }
def p = new Person(name: 'Norman')
def t = new Thing(name: 'Teapot')
def upperCasedName = { delegate.name.toUpperCase() }
upperCasedName.delegate = p
assert upperCasedName() == 'NORMAN'
upperCasedName.delegate = t
assert upperCasedName() == 'TEAPOT'
```

If you do not prefix with **delegate.**, Groovy still resolves **name** on the delegate when the delegation strategy says so.

---

## 4. Delegation strategy (resolveStrategy)

When a property or method is accessed in a closure without an explicit receiver, resolution uses **resolveStrategy**:

- **Closure.OWNER_FIRST** (default): resolve on **owner**, then **delegate** if not found.
- **Closure.DELEGATE_FIRST**: resolve on **delegate**, then **owner**.
- **Closure.OWNER_ONLY**: only **owner**.
- **Closure.DELEGATE_ONLY**: only **delegate**.
- **Closure.TO_SELF**: for advanced metaprogramming; resolve on the closure class itself.

```groovy
class Person { String name; def pretty = { "My name is $name" } }
class Thing { String name }
def p = new Person(name: 'Sarah')
def t = new Thing(name: 'Teapot')
assert p.pretty() == 'My name is Sarah'
p.pretty.delegate = t
assert p.pretty() == 'My name is Sarah'  // owner first, so still Person.name
p.pretty.resolveStrategy = Closure.DELEGATE_FIRST
assert p.pretty() == 'My name is Teapot'
```

With **DELEGATE_ONLY**, if the delegate does not have the property (or a **propertyMissing** hook), you get **MissingPropertyException**. With **DELEGATE_FIRST**, **propertyMissing** on the delegate can handle “missing” properties.

---

## 5. Closures in GStrings

**Eager vs lazy.** **"x = ${x}"** captures the value of **x** when the GString is created. Changing **x** later does not change the GString’s string representation. For lazy evaluation use **"x = ${ -> x }"**; then each time the GString is converted to String, the closure is called and the current **x** is used. Only closures with zero or one parameter are allowed in GString placeholders.

---

## 6. Currying, memoization, composition

**Currying (partial application).** **curry(value)** fixes the left-most parameter; **rcurry(value)** fixes the right-most; **ncurry(index, value, ...)** fixes parameter(s) at a given index. The result is a new closure with fewer parameters.

```groovy
def nCopies = { int n, String str -> str*n }
def twice = nCopies.curry(2)
assert twice('bla') == 'blabla'
def blah = nCopies.rcurry('bla')
assert blah(2) == 'blabla'
```

**Memoization.** **closure.memoize()** returns a closure that caches results by argument values (useful for expensive or recursive calls). Variants: **memoizeAtMost(n)**, **memoizeAtLeast(n)**, **memoizeBetween(min, max)**. Cache is LRU. Use with care for non-primitive keys (equality matters).

```groovy
def fib
fib = { long n -> n<2 ? n : fib(n-1)+fib(n-2) }.memoize()
assert fib(25) == 75025
```

**Composition.** **closure1 << closure2** creates a new closure that first applies **closure2** then **closure1**. **closure1 >> closure2** is the reverse. So **(plus2 << times3)(3)** is **plus2(times3(3))** (e.g. 11 if plus2 adds 2 and times3 multiplies by 3).

---

## 7. Method pointer operator

**.&methodName** produces a closure that forwards to the given method on the receiver. Useful for passing a method where a closure is expected. Type is **Closure**; arguments are resolved at runtime (multi-methods).

```groovy
def str = 'example'
def fun = str.&toUpperCase
assert fun() == 'EXAMPLE'
```

In Groovy 3+, **BigInteger.&new** gives a constructor reference; **String.&toUpperCase** gives an instance method reference that takes the receiver as first argument when called.

---

## 8. Trampoline (stack-safe recursion)

**closure.trampoline()** wraps the closure so that when it returns another trampolined closure, that is invoked in a loop instead of recursively. This avoids stack overflow for deep recursion. The closure should return **trampoline(args...)** for the recursive call.

```groovy
def factorial
factorial = { int n, def accu = 1G ->
    if (n < 2) return accu
    factorial.trampoline(n - 1, n * accu)
}
factorial = factorial.trampoline()
assert factorial(1000) != null  // large number without StackOverflowError
```

---

## 9. Why this matters for DevOps

Jenkins pipeline steps (e.g. **node { }**, **stage('Build') { }**) and Gradle blocks (e.g. **dependencies { }**) take closures. The **delegate** is set by the runtime so that method calls inside the block (e.g. **implementation '...'**) resolve on the project or dependency handler. Understanding **it**, **delegate**, and **resolveStrategy** helps when writing or debugging Jenkinsfiles and **build.gradle**.

---

## Further reading

- [Closures](https://groovy-lang.org/closures.html)
