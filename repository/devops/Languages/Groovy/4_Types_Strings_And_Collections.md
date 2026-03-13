# Types, strings, and collections

[← Back to Groovy](./README.md)

Groovy supports both explicit typing (as in Java) and optional typing with **def** or **var** (Groovy 3+). This topic covers strings (including all literal forms and GString interpolation), numbers (integral and decimal, bases, suffixes, math), booleans, lists, arrays, and maps in enough depth to read and write scripts and DSLs correctly.

---

## 1. Strings

**Single-quoted string.** **'...'** is a plain **java.lang.String**. It does not support interpolation.

```groovy
'a single-quoted string'
```

**String concatenation.** All string types support **+** for concatenation: **'a' + 'b'** is **'ab'**.

**Triple-single-quoted string.** **'''...'''** is a plain **String** and may span multiple lines. Indentation and newlines are preserved. To avoid a leading newline, escape it: **'''\\nline one'''**. Use **String#stripIndent()** or **stripMargin()** (GDK) to remove indentation. Escape **'** with **\\'** and **\\** with **\\\\**. Unicode escapes **\\uXXXX** (4 hex digits) are supported.

**Double-quoted string and GString.** **"..."** is a **String** if it contains no interpolation, and **groovy.lang.GString** if it contains **${...}** or **$**-prefixed dotted expressions. GString is an “interpolated string”: placeholders are replaced when the string is evaluated (e.g. when **toString()** is called or when passed to a method expecting **String**).

**Placeholders.** **${expression}** evaluates any Groovy expression (including statements; the last expression’s value is used). For unambiguous dotted expressions you can use **$var** or **$obj.prop** without braces. Only dotted forms like **a.b**, **a.b.c** are valid for **$**; **$number.toString()** is invalid (parsed as **${number.toString}()**). Use **${thing}.x** when **$thing.x** would be ambiguous. Escape **$** in a GString with **\\$** so **\$** and **\${name}** appear literally.

```groovy
def name = 'Guillaume'
def greeting = "Hello ${name}"
assert greeting.toString() == 'Hello Guillaume'
assert "The sum of 2 and 3 equals ${2 + 3}" == 'The sum of 2 and 3 equals 5'
def person = [name: 'Guillaume', age: 36]
assert "$person.name is $person.age years old" == 'Guillaume is 36 years old'
assert '$5' == "\$5"
```

**Lazy interpolation with closures.** **${ -> expr }** (or **${ w -> w << value }** with a **StringWriter** argument) defers evaluation until the GString is converted to String. So when a variable changes, the lazy GString reflects the new value; a normal **${variable}** captures the value at GString creation time.

```groovy
def number = 1
def eagerGString = "value == ${number}"
def lazyGString = "value == ${ -> number }"
assert eagerGString == "value == 1" && lazyGString == "value == 1"
number = 2
assert eagerGString == "value == 1"
assert lazyGString == "value == 2"
```

Only closures with zero or one parameter are allowed in this form.

**Interoperability with Java.** When a method expects **java.lang.String** and receives a **GString**, **toString()** is called automatically. Do not use GString as **Map** keys: GString and String have different **hashCode()**, so **m["${key}": "value"]** and **m["a"]** will not match.

**Triple-double-quoted string.** **"""..."""** behaves like double-quoted strings but is multiline. Single and double quotes inside do not need escaping.

**Slashy string.** **/.../** is a string (or GString if it contains interpolation). Backslashes are not escape characters (except for **/** itself: **\\/**). Useful for regexes. An empty slashy string cannot be **//** (parsed as line comment). **/\\t/** is backslash plus **t**, not tab.

```groovy
def fooPattern = /.*foo.*/
def color = 'blue'
assert /a ${color} car/ == 'a blue car'
```

**Dollar-slashy string.** **$/.../$** is a multiline GString. The escape character is **$**: **$$** is a literal **$**, **$/ ** escapes **/**, **$/$$** escapes the closing **/$**. Use when the string contains many slashes or dollars.

**Characters.** Groovy has no character literal. To get a **Character**: (1) declare the variable as **char** and assign **'A'**; (2) use **'B' as char**; (3) use **(char)'C'**. For multi-character strings, **as char** takes the first character; C-style **(char)** can throw for invalid length.

**String summary.** Single-quoted and triple-single-quoted: no interpolation, escape **\\**. Double and triple-double: interpolation, escape **\\**. Slashy: interpolation, escape only **/**. Dollar-slashy: interpolation, escape **$**.

---

## 2. Numbers

**Integral literals.** Supported types: **byte**, **char**, **short**, **int**, **long**, **java.math.BigInteger**. With **def**, the type is chosen by capacity: up to **Integer.MAX_VALUE** → **Integer**, then **Long**, then **BigInteger** (same for negatives).

**Alternative bases.** Binary: **0b10101111**. Octal: **077**. Hexadecimal: **0x77**. Suffixes **L**, **G**, etc. (see below) apply.

**Decimal literals.** Types: **float**, **double**, **java.math.BigDecimal**. Literals like **1.234** are **BigDecimal** by default. Exponent: **1e3**, **2E4**, **3e+1**, **4E-2**. For **float** or **double** use explicit type, coercion, or suffix.

**Underscore in literals.** Underscores in numeric literals are ignored (e.g. **1_000**, **0xFF_EC_DE_5E**).

**Number type suffixes.** **I** or **i** → Integer; **L** or **l** → Long; **G** or **g** → BigInteger (integral) or BigDecimal (decimal); **F** or **f** → Float; **D** or **d** → Double. Examples: **42I**, **123L**, **456G**, **1.234F**, **1.23E23D**.

**Math operations.** Binary operations between **byte**, **char**, **short**, **int** → **int**. With **long** → **long**. With **BigInteger** → **BigInteger**. With **BigDecimal** and integral types → **BigDecimal**. Between **float**, **double**, **BigDecimal** → **double** (except two **BigDecimal** → **BigDecimal**). Division **/**: if either operand is **float** or **double**, result is **double**; otherwise **BigDecimal** (using **divide()** with appropriate scale). For integer division use **intdiv()**, not **/**. Power **\*\***: result type depends on base and exponent (Integer, Long, BigInteger, BigDecimal, or Double per language rules).

---

## 3. Booleans

**true** and **false** are the two boolean literals. They can be stored in variables or fields. Groovy also applies “Groovy truth” when coercing non-boolean values to boolean (e.g. empty string, empty collection, null).

---

## 4. Lists

Lists use comma-separated values in square brackets: **[1, 2, 3]**. The default type is **java.util.ArrayList**. They implement **java.util.List**. Elements can be heterogeneous.

**Type coercion.** **[2, 3, 4] as LinkedList** or **LinkedList otherLinked = [3, 4, 5]** gives a **LinkedList**.

**Access.** **list[0]** (zero-based). Negative indices: **list[-1]** is last element, **list[-2]** second-to-last. Assignment: **list[2] = 'C'**. Append: **list << 'e'**. Multiple indices: **list[1, 3]** returns **['b', 'd']**. Range: **list[2..4]**.

```groovy
def letters = ['a', 'b', 'c', 'd']
assert letters[0] == 'a' && letters[-1] == 'd'
letters[2] = 'C'
letters << 'e'
assert letters[2..4] == ['C', 'd', 'e']
```

**Multidimensional.** **[[0, 1], [2, 3]]** and **multi[1][0]** for nested access.

---

## 5. Arrays

Groovy uses list notation for array literals; the type must be explicit via declaration or coercion. **{ }** is reserved for closures, so use **[1, 2, 3]** or (Groovy 3+) **new int[] {2, 3, 5, 7}**.

```groovy
String[] arrStr = ['Ananas', 'Banana', 'Kiwi']
def numArr = [1, 2, 3] as int[]
def primes = new int[] {2, 3, 5, 7, 11}
```

Multi-dimensional: **new Integer[3][3]** or **Integer[][] matrix2 = [[1, 2], [3, 4]]**. Element access and assignment use the same **[]** notation as lists.

---

## 6. Maps

Maps use **[:]** for empty and **[key: value, ...]** for entries. Keys and values are separated by **:**, pairs by **,**. Default type is **java.util.LinkedHashMap**. When the key is an unquoted identifier, it becomes a **String** key (e.g. **red** → **"red"**). Access: **map['red']** or **map.red**. Add: **map['pink'] = '#FF00FF'** or **map.yellow = '#FFFF00'**. Missing key returns **null**.

**Variable as key.** **def key = 'name'; def person = [key: 'Guillaume']** puts the literal key **"key"** in the map. To use the variable’s value as key, use parentheses: **[(key): 'Guillaume']**. Quoted strings as keys: **["street-name": "Main street"]**.

```groovy
def key = 'name'
def person = [(key): 'Guillaume']
assert person.containsKey('name')
```

Numeric or other unambiguous expressions as keys are used as-is: **[1: 'one', 2: 'two']**.

---

## 7. Ranges

**..** creates an inclusive range (**1..3** is 1, 2, 3). **..<** (where supported) creates a half-open range. Use with **for**-in and **in** operator: **2 in 1..3** is true.

---

## Further reading

- [Syntax – Strings, Numbers, Lists, Arrays, Maps](https://groovy-lang.org/syntax.html)
- [Semantics](https://groovy-lang.org/semantics.html)
