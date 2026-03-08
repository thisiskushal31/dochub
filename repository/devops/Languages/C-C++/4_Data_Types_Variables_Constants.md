# C / C++ — Data types, variables, and constants

[← C/C++ README](./README.md)

This topic covers **data types**, **variables**, and **constants** in C. You need these to store and name values. Each concept is explained in text first, then with code blocks so you can write C in an easy, clear format.

---

## Data types

C is **statically typed**: every variable has a **type** that determines size, range, and what operations are allowed. Basic types include:

| Type | Typical size | Use |
| --- | --- | --- |
| `char` | 1 byte | Characters, small integers |
| `int` | 4 bytes (often) | Integers |
| `short` | 2 bytes (often) | Smaller integers |
| `long` | 4 or 8 bytes | Larger integers |
| `long long` | 8 bytes (often) | Very large integers |
| `float` | 4 bytes | Single-precision floating point |
| `double` | 8 bytes | Double-precision floating point |
| `void` | — | No value (e.g. function return “nothing”) |

**Booleans (C99):** Include **&lt;stdbool.h&gt;** to use **bool**, **true**, and **false**. They expand to **\_Bool** and the constants **1** and **0**. Use them for logical flags and conditions.

```c
#include <stdbool.h>
bool flag = true;
if (flag) { /* ... */ }
```

**Signed vs unsigned:** Integer types can be **signed** (default) or **unsigned** (non-negative only). For example, `unsigned int` and `signed int` (or just `int`).

```c
int a = -10;
unsigned int b = 10;
char c = 'A';
double d = 3.14;
```

---

## Declaring and initializing variables

A **variable** is a named storage location. You **declare** it with a type and name; you can **initialize** it at the same time.

**Declaration:** `type name;`  
**Declaration with initializer:** `type name = value;`

```c
int count;
count = 0;

int total = 100;
char grade = 'A';
double pi = 3.14159;
```

Multiple variables of the same type can be declared in one statement:

```c
int x, y, z;
int a = 1, b = 2, c = 3;
```

---

## Constants

**Constants** are values that do not change. In C you can express them in several ways:

- **Literal constants** — Values written directly: `42`, `3.14`, `'x'`, `"hello"`.
- **`const` qualifier** — A variable that must not be modified after initialization.

```c
const int MAX = 100;
const double PI = 3.14159265359;

/* MAX = 200;  invalid: cannot assign to const */
```

- **`#define`** — Preprocessor macro; replaced before compilation (see topic 12).

```c
#define MAX_SIZE 256
int buf[MAX_SIZE];
```

---

## Literals and escape sequences

**Integer literals:** `42` (decimal), `052` (octal), `0x2A` (hexadecimal).

**Floating-point literals:** `3.14`, `2.5e-1` (scientific notation).

**Character literals:** Single quotes, e.g. `'A'`, `'0'`. **Escape sequences** represent special characters:

| Sequence | Meaning |
| --- | --- |
| `\n` | Newline |
| `\t` | Tab |
| `\\` | Backslash |
| `\'` | Single quote |
| `\"` | Double quote |
| `\0` | Null character (end of string) |

**String literals:** Double quotes: `"Hello"`. They are arrays of `char` ending with `'\0'`.

```c
char newline = '\n';
char tab = '\t';
printf("Line1\nLine2\tTabbed\n");
```

---

## Type conversion and casting

When you mix types in an expression, C performs **implicit conversion** (e.g. `int` to `double` in arithmetic). **Integer promotions**: values of type **char**, **short**, and (in C99) **bool** are promoted to **int** (or **unsigned int**) in most expressions before the operation; that is why **character arithmetic** (e.g. `'A' + 1` giving `'B'`, or `c - '0'` to convert a digit character to a number) works. You can force a conversion with a **cast**: `(type) expression`.

```c
int i = 10;
double d = (double) i;   /* explicit cast */
double x = 3.14;
int n = (int) x;         /* n is 3; fractional part discarded */
```

---

## Summary

- **Types** define size and meaning of data; common ones are `int`, `double`, `char`, etc.
- **Variables** are declared with a type and optional initializer; they hold values that can change.
- **Constants** are fixed values: literals, **const**-qualified variables (the **const qualifier** means the value should not be modified), or `#define` macros.
- **Literals** and **escape sequences** let you write numbers, characters, and strings in source code.
- **bool**, **true**, **false** (from **&lt;stdbool.h&gt;**; C99) for logical values.
- **Casting** lets you convert between types explicitly when needed.

---

## Further reading

- [C Programming Tutorial — Data Types (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_data_types.htm)
- [C Programming Tutorial — Variables (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_variables.htm)
- [C Programming Tutorial — Constants (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_constants.htm)
- [C Programming Tutorial — Literals, Escape Sequences (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_literals.htm)
- [C/C++ README](./README.md) — Topic index.
