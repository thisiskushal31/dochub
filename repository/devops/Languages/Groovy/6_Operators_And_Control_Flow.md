# Operators and control flow

[← Back to Groovy](./README.md)

This topic covers Groovy’s operators (arithmetic, relational, logical, conditional, safe navigation, spread, regex) and control structures (if/else, switch, for, while, do/while, try/catch/finally) in enough depth to write and read pipeline and build scripts correctly.

---

## 1. Equality and identity

**==** in Groovy means **equality**: for objects it uses **compareTo** (if **Comparable**) or **equals**. It does **not** mean reference identity. For identity use **a.is(b)** or (Groovy 3+) **a === b** and **a !== b**.

```groovy
def a = "hello"
def b = "hello"
assert a == b
assert !a.is(b)
assert a === a
```

---

## 2. Arithmetic operators

Binary: **+**, **-**, **\***, **/**, **%**, **\*\*** (power). Division **/** yields **double** if either operand is float/double, otherwise **BigDecimal**; for integer division use **intdiv()**. Unary: **+**, **-**, **++**, **--** (prefix and postfix). Assignment forms: **+=**, **-=**, **\*=**, **/=**, **%=**, **\*\*=**.

```groovy
assert 1 + 2 == 3 && 3 / 2 == 1.5 && 10 % 3 == 1 && 2 ** 3 == 8
def a = 2; def b = a++ * 3; assert a == 3 && b == 6
```

---

## 3. Relational and logical operators

Relational: **==**, **!=**, **<**, **<=**, **>**, **>=**, **===**, **!==**. Logical: **&&**, **||**, **!**. Precedence: **!** higher than **&&** higher than **||**. **&&** and **||** short-circuit: the right-hand side is not evaluated when the result is already determined.

---

## 4. Conditional operators

**Ternary.** **condition ? valueIfTrue : valueIfFalse**. Works with Groovy truth.

**Elvis ?:.** **expr ?: default** returns **expr** if it is truthy, otherwise **default**. Avoids repeating **expr** (e.g. **user.name ?: 'Anonymous'**).

**Elvis assignment (Groovy 3+).** **field ?= value** assigns **value** only when **field** is false-ish (e.g. **atomicNumber ?= 2**).

**Safe navigation ?.** **obj?.method()** or **obj?.property** returns **null** if **obj** is null, instead of throwing **NullPointerException**.

```groovy
def name = null
assert name?.toUpperCase() == null
assert (null ?: "default") == "default"
```

---

## 5. Object operators

**Direct field access .@** **obj.@field** accesses the field directly instead of the property getter/setter. Use when the getter has side effects or a different meaning.

**Method pointer .&** **obj.&methodName** yields a closure that calls **methodName** on **obj**. See topic 5 (Closures).

---

## 6. Regular expression operators

**Pattern ~** **~/pattern/** or **~"pattern"** creates a **java.util.regex.Pattern**. **=~** creates a **Matcher** (find); **==~** returns a **boolean** (full match). Matcher coerces to boolean via **find()**, so **if (text =~ /pattern/) ** is common.

```groovy
def text = "some text to match"
def m = text =~ /match/
assert m instanceof Matcher
assert 'two words' ==~ /\S+\s+\S+/
```

---

## 7. Spread operator

***.property** invokes the property on each element and returns a list: **cars*.make** is like **cars.collect { it.make }**. Null-safe: null elements yield null. ***.method(args)** works similarly. **function(*list)** spreads list elements as arguments. In list literals **[*items]** inlines **items**; in map literals **[*:map]** inlines **map** entries (later keys override).

```groovy
def list = [1, 2, 3, *[4, 5], 6]
assert list == [1, 2, 3, 4, 5, 6]
def map = [a: 1, *:[b: 2, c: 3], c: 4]
assert map.c == 4
```

---

## 8. Range operator

**..** is inclusive (**0..5** is 0,1,2,3,4,5). **..<** exclusive upper bound; **<..** exclusive lower bound; **<..<** both exclusive. **Range** implements **List**. Any **Comparable** with **next()**/ **previous()** can form a range (e.g. **'a'..'d'**).

---

## 9. Control structures

**if / else.** Same as Java. **if (cond) { } else if (cond2) { } else { }**.

**switch / case.** In Groovy, **switch** can match: (1) equality, (2) **Class** (instanceof), (3) regex (**~/pattern/**), (4) collection (value in list), (5) range (value in range), (6) closure (closure(value) is truthy; **it** is the switch value). Fall-through works; use **break** to avoid it. Switch expressions (Groovy 3+): **def result = switch(x) { case 'a' -> 1; case 'b' -> 2 }**.

```groovy
def x = 1.23
switch (x) {
  case Integer: break
  case Number: assert true; break
  case 12..30: break
  case ~/fo*/: break
  case { it < 0 }: break
  default: break
}
```

**for.** Classic: **for (int i = 0; i < 5; i++) { }**. For-in: **for (i in 0..9) { }**, **for (e in map) { }**, **for (c in 'abc') { }**. Multi-assignment in loop: **for (def (u, v) = ['bar', 42]; v < 45; u++, v++) { }**.

**while / do-while.** **while (cond) { }** and **do { } while (cond)** as in Java.

**try / catch / finally.** Same as Java. Braces required around each block. **try { } catch (Exception e) { } finally { }**.

---

## 10. Multiple assignment

**def (a, b, c) = [10, 20, 'foo']** assigns 10, 20, 'foo' to **a**, **b**, **c**. Overflow: extra left-hand variables get **null**. Underflow: extra right-hand values ignored. Works with **getAt** for destructuring (e.g. **def (la, lo) = coordinates** if **Coordinates** defines **getAt(int)**).

---

## 11. Groovy truth

In boolean contexts (if, while, **!**, **?:**, **&&**, **||**), non-boolean values are coerced: **null**, **false**, **0**, **0.0**, **''**, **[]**, **[:]** are false; non-empty strings, non-zero numbers, non-empty collections are true. **!** and conditionals use this.

---

## Further reading

- [Operators](https://groovy-lang.org/operators.html)
- [Semantics – Control structures](https://groovy-lang.org/semantics.html)
