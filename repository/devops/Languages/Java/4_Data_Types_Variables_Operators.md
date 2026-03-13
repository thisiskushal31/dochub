# Data types, variables, and operators

Java is statically typed: every variable and expression has a type known at compile time. Types determine the size and layout of values, the range of representable values, and the operations that can be performed. This topic covers primitive and reference types, variable declaration and the three kinds of variables (local, instance, static), type casting, and the full operator set including precedence and associativity.

---

## Primitive data types

Java defines eight primitive types. They are not objects and have no methods; they are stored by value.

**Integer types (signed two's complement):**

- **byte** — 8 bits. Range: -128 (-2⁷) to 127 (2⁷ − 1). Default: 0. Used when memory is at a premium (e.g. large arrays of small integers).
- **short** — 16 bits. Range: -32,768 (-2¹⁵) to 32,767 (2¹⁵ − 1). Default: 0. Half the size of an int.
- **int** — 32 bits. Range: -2,147,483,648 (-2³¹) to 2,147,483,647 (2³¹ − 1). Default: 0. The default type for integer literals and typical choice for whole numbers.
- **long** — 64 bits. Range: -9,223,372,036,854,775,808 (-2⁶³) to 9,223,372,036,854,775,807 (2⁶³ − 1). Default: 0L. Integer literals for long must end with `L` or `l` (e.g. `100000L`).

**Floating-point types (IEEE 754):**

- **float** — 32-bit single precision. Default: 0.0f. Literals require an `f` or `F` suffix (e.g. `234.5f`). Not suitable for exact decimal values (e.g. currency) because of rounding.
- **double** — 64-bit double precision. Default: 0.0d. Default type for floating-point literals; the usual choice for decimals. Also not suitable for exact currency; use `BigDecimal` or similar when precision is critical.

**Other primitives:**

- **boolean** — Represents true or false. Default: false. Only these two values; no numeric conversion in expressions.
- **char** — Single 16-bit Unicode character. Range: `'\u0000'` (0) to `'\uffff'` (65,535). Default: `'\u0000'`. Used for one character, not a string.

Numeric primitive types support arithmetic; boolean supports only logical operations. Integer division truncates toward zero; the remainder operator `%` can produce a negative result when the dividend is negative. Integer arithmetic does not throw on overflow or underflow: results wrap in two's complement (e.g. `Integer.MAX_VALUE + 1` is `Integer.MIN_VALUE`). For precise integer arithmetic with arbitrary range, use `BigInteger`; for exact decimal values (e.g. money), use `BigDecimal` instead of float or double.

```java
byte a = 100;
byte b = -50;

short s = 10000;
int i = 100000;
long L = 100000L;

float f = 234.5f;
double d = 123.4;

boolean flag = true;
char letterA = 'A';

// Integer division: 7 / 2 is 3, not 3.5
int q = 7 / 2;   // 3
int r = 7 % 2;   // 1

// byte + byte is promoted to int; assign back with cast
byte x = 2, y = 4;
byte sum = (byte) (x + y);
```

---

## Reference (object) types

Non-primitive types are reference types: classes (including wrapper classes like `Integer`, `String`), interfaces, arrays, and enums. A variable of reference type holds a reference (pointer) to an object or null. The default value for an uninitialized reference is `null`. Reference types are created with `new` (or via literals/constructors for strings, arrays, etc.); they are stored on the heap, and the variable holds the reference.

```java
String msg = new String("Hello");
int[] arr = { 10, 20, 30 };
// Default for reference: null
String unset;  // unset is null until assigned
```

---

## Variable declaration and initialization

Variables must be declared before use. Syntax: **type** followed by **variable name**, optionally with `= value`. Multiple variables of the same type can be declared in one statement, separated by commas. Each statement ends with a semicolon.

- **Local variables** — Declared inside a method, constructor, or block. They are created when the block is entered and destroyed when it is left. They are not given a default value; the compiler enforces definite assignment: every path that reads the variable must have assigned it first (e.g. in if/else both branches must assign, or the read must be only in branches that did assign). Uninitialized locals cause a compile error. Access modifiers cannot be applied to local variables. They are typically implemented on the stack.
- **Instance variables** — Declared in a class, outside any method or block. A copy exists for each object. They are created when the object is created (`new`) and destroyed when the object is eligible for garbage collection. They have default values: 0 for numeric primitives, false for boolean, `'\u0000'` for char, null for references. They can have access modifiers (public, private, protected, or package-private). They hold state that belongs to the object and is visible to instance methods and constructors; from static methods they must be accessed via an object reference (e.g. `obj.fieldName`).
- **Class (static) variables** — Declared with `static` in a class, outside any method or block. There is one copy per class, shared by all instances. They are created when the class is loaded and live for the lifetime of the application. Default values are the same as for instance variables. They are often used for constants (`public static final`); constant names are conventionally UPPER_SNAKE_CASE.

```java
public class Example {
    // Instance variables: defaults 0, false, null
    private int count;
    private String name;

    // Class variable (constant)
    public static final String DEPARTMENT = "Development";
    private static double sharedTotal;

    public void method() {
        // Local: must be assigned before use
        int age = 0;
        age = age + 7;

        // Compile error if used uninitialized:
        // int x;
        // x = x + 1;  // "variable x might not have been initialized"
    }
}
```

---

## Type casting (conversion)

**Widening (implicit)** — Converting a smaller or more restrictive type to a larger or more general one. The compiler performs this automatically when assigning or when passing arguments. No cast is required. The widening order for numerics is: byte → short → int → long → float → double; char widens to int (and then to long, float, double). No information is lost in numeric widening (though int/long to float/double can lose precision). For example, assigning an int to a double widens automatically.

**Narrowing (explicit)** — Converting a larger or more general type to a smaller one. The programmer must use a cast: `(targetType) expression`. Possible loss of magnitude (e.g. double to int truncates the fractional part) or precision. If the value is out of range for the target type, the result is undefined for integers (in practice, often wraparound). The compiler does not allow implicit narrowing; you get a type mismatch error.

```java
int num1 = 5004;
double num2 = 2.5;
double sum = num1 + num2;   // num1 widened to double; sum is 5006.5

// int sum2 = num1 + num2;  // Error: cannot convert double to int
int sum2 = (int) (num1 + num2);  // Explicit cast; sum2 is 5006

double d = 5004.0;
int n = (int) d;  // n is 5004
```

For expressions mixing byte, short, char: arithmetic operators promote operands to int (or long if a long is present), so the result of `byte + byte` is int; assigning back to byte requires a cast.

---

## Operators

**Arithmetic** — `+`, `-`, `*`, `/`, `%`. Operands are promoted to at least int; if either operand is long, float, or double, the other is promoted to that type and the result is that type. Integer division truncates; `%` returns the remainder (sign follows the dividend in Java). Unary `+` and `-` also apply. **Increment and decrement**: `++` and `--`, prefix (e.g. `++x`: increment then use value) and postfix (e.g. `x++`: use value then increment).

**Assignment** — `=` assigns the right-hand value to the left-hand variable. **Compound assignment**: `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`, `>>>=`. Formally, `a op= b` is equivalent to `a = (type of a) (a op b)`; the cast is implicit, so `byte b = 1; b += 1;` is valid (whereas `b = b + 1` would not compile, because `b + 1` is int).

**Relational** — `==`, `!=`, `<`, `>`, `<=`, `>=`. Compare two values; result is boolean. For primitives, comparison is by value. For references, `==` and `!=` compare references (same object or not), not logical equality; use `.equals()` for object content.

**Logical** — `&&` (conditional AND), `||` (conditional OR), `!` (NOT). Operands must be boolean. Short-circuiting: for `&&`, if the first operand is false, the second is not evaluated; for `||`, if the first is true, the second is not evaluated.

**Bitwise** — Apply to integer types (long, int, short, char, byte); operands are promoted to int or long. `&` (AND), `|` (OR), `^` (XOR), `~` (one's complement, unary). **Shift**: `<<` (left shift), `>>` (signed right shift, sign-extended), `>>>` (unsigned right shift, zero-fill). Right-hand operand is masked so only low 5 bits (for int) or 6 bits (for long) are used.

**Conditional (ternary)** — `condition ? valueIfTrue : valueIfFalse`. The condition must be boolean; one of the two branches is evaluated. Both branches should normally have compatible types so the expression has a well-defined type.

**instanceof** — `objectRef instanceof Type`. Returns true if the object referred to is non-null and is an instance of the given class or implements the given interface (or is a subtype). Used for type checks before casts.

```java
int a = 10, b = 5;
System.out.println(a + b);  // 15
System.out.println(a / b);  // 2 (integer division)
System.out.println(a % b);  // 0

a += 5;   // a is 15
a -= 3;   // a is 12

boolean ok = (a == 12) && (b > 0);  // true

int A = 60, B = 13;  // 0011 1100, 0000 1101
System.out.println(A & B);   // 12  (0000 1100)
System.out.println(A | B);   // 61  (0011 1101)
System.out.println(A ^ B);   // 49  (0011 0001)
System.out.println(~A);      // -61 (two's complement)
System.out.println(A << 2);  // 240 (left shift)
System.out.println(A >> 2); // 15  (signed right shift)
System.out.println(A >>> 2); // 15 (unsigned right shift)

int max = (a > b) ? a : b;
String name = "James";
boolean isString = name instanceof String;  // true
```

---

## Operator precedence and associativity

Precedence determines how expressions are grouped when multiple operators appear. Higher precedence binds tighter. When precedence is equal, associativity (left-to-right or right-to-left) determines order. Use parentheses to override.

From highest to lowest precedence (summary):

- Postfix: `expr++`, `expr--`
- Unary: `++expr`, `--expr`, `+expr`, `-expr`, `~`, `!`
- Multiplicative: `*`, `/`, `%`
- Additive: `+`, `-`
- Shift: `<<`, `>>`, `>>>`
- Relational: `<`, `>`, `<=`, `>=`, `instanceof`
- Equality: `==`, `!=`
- Bitwise AND: `&`
- Bitwise XOR: `^`
- Bitwise OR: `|`
- Logical AND: `&&`
- Logical OR: `||`
- Conditional: `?:` (right-to-left)
- Assignment: `=`, `+=`, `-=`, etc. (right-to-left)

Example: `10 + 5 * 2` is 20 (multiplication first), not 30. `(10 + 5) * 2` is 30. For same precedence, left-to-right: `20 / 4 * 2` is 10; `10 - 3 + 2` is 9.

```java
int result1 = 10 + 5 * 2;    // 20
int result2 = (10 + 5) * 2;  // 30
int result3 = 20 / 4 * 2;    // 10
int result4 = 10 - 3 + 2;    // 9
```

---

## Further reading

- [TutorialsPoint Java – Variable Types](https://www.tutorialspoint.com/java/java_variable_types.htm)
- [TutorialsPoint Java – Data Types](https://www.tutorialspoint.com/java/java_basic_datatypes.htm)
- [TutorialsPoint Java – Type Casting](https://www.tutorialspoint.com/java/java_type_casting.htm)
- [TutorialsPoint Java – Basic Operators](https://www.tutorialspoint.com/java/java_basic_operators.htm)
- [The Java™ Tutorials – Language Basics](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/)
- [Java Language Specification – Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html)
