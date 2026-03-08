# C / C++ — Operators and expressions

[← C/C++ README](./README.md)

This topic covers **operators** and **expressions** in C: arithmetic, relational, logical, bitwise, assignment, and more. Each is explained in text first, then with code blocks so you can write and read C in an easy format.

---

## Arithmetic operators

Arithmetic operators work on numeric types and produce a value.

| Operator | Meaning | Example |
| --- | --- | --- |
| `+` | Addition | `a + b` |
| `-` | Subtraction | `a - b` |
| `*` | Multiplication | `a * b` |
| `/` | Division | `a / b` (integer division if both operands are integers) |
| `%` | Remainder (modulus) | `a % b` (integer only) |

**Integer division** truncates toward zero: `7 / 2` is `3`, not 3.5. Use floating-point types for fractional results.

```c
int a = 17, b = 5;
printf("%d %d %d %d\n", a + b, a - b, a * b, a / b);  /* 22 12 85 3 */
printf("%d\n", a % b);   /* 2 */

double x = 17.0, y = 5.0;
printf("%f\n", x / y);   /* 3.400000 */
```

---

## Increment and decrement

**`++`** and **`--`** add or subtract 1. They can be **prefix** (`++i`) or **suffix** (`i++`). With prefix, the value used in the expression is the value *after* the increment; with suffix, the value *before*.

```c
int i = 5;
printf("%d\n", ++i);   /* 6; i is now 6 */
printf("%d\n", i++);   /* 6; i is now 7 */

int j = 10;
printf("%d\n", --j);   /* 9 */
printf("%d\n", j--);   /* 9 */
```

---

## Relational and logical operators

**Relational** operators compare two values; result is `1` (true) or `0` (false).

| Operator | Meaning |
| --- | --- |
| `==` | Equal |
| `!=` | Not equal |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |

**Logical** operators combine or negate logical conditions. In C, any non-zero value is “true”; zero is “false”.

| Operator | Meaning |
| --- | --- |
| `&&` | Logical AND (short-circuit) |
| OR (double bar) | Logical OR (short-circuit) |
| `!` | Logical NOT |

```c
int a = 3, b = 7;
printf("%d %d\n", a == b, a < b);   /* 0 1 */

int x = 1, y = 0;
printf("%d %d\n", x && y, x || y);  /* 0 1 */
printf("%d\n", !x);                 /* 0 */
```

---

## Bitwise operators

Bitwise operators work on the **bits** of integers. They are used in low-level code, flags, and embedded systems.

| Operator | Meaning |
| --- | --- |
| `&` | Bitwise AND |
| `\|` | Bitwise OR |
| `^` | Bitwise XOR |
| `~` | Bitwise NOT (one’s complement) |
| `<<` | Left shift |
| `>>` | Right shift |

```c
unsigned int a = 0xF0;   /* 11110000 */
unsigned int b = 0x0F;   /* 00001111 */
printf("%x %x %x\n", a & b, a | b, a ^ b);   /* 0 f0 ff */

unsigned int c = 1;
printf("%u\n", c << 4);   /* 16 (shift left by 4) */
```

---

## Assignment and compound assignment

**`=`** assigns the value on the right to the variable on the left. **Compound assignment** combines an operator with assignment: `a += b` is equivalent to `a = a + b`.

```c
int n = 10;
n += 5;    /* n is 15 */
n *= 2;    /* n is 30 */
n %= 7;    /* n is 2 */
```

---

## Ternary operator and sizeof

**Ternary:** `condition ? value_if_true : value_if_false`. It is an expression that chooses one of two values.

```c
int a = 5, b = 10;
int max = (a > b) ? a : b;
printf("%d\n", max);   /* 10 */
```

**sizeof** returns the size in bytes of a type or expression. It is a compile-time constant (in most uses).

```c
printf("%zu %zu\n", sizeof(int), sizeof(double));
printf("%zu\n", sizeof("hello"));   /* 6: 5 chars + '\0' */
```

---

## Operator precedence (brief)

Operators have **precedence** and **associativity**. Multiplication and division bind tighter than addition and subtraction; parentheses override. When in doubt, use parentheses to make intent clear.

```c
int r = 2 + 3 * 4;      /* 14: 3*4 first */
int s = (2 + 3) * 4;    /* 20 */
```

---

## Further reading

- [C Programming Tutorial — Operators (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_operators.htm)
- [C Programming Tutorial — Arithmetic, Relational, Logical, Bitwise (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_arithmetic_operators.htm)
- [C Programming Tutorial — Operator Precedence (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_operators_precedence.htm)
- [C/C++ README](./README.md) — Topic index.
