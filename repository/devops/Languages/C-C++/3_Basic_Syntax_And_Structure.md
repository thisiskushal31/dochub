# C / C++ — Basic syntax and program structure

[← C/C++ README](./README.md)

This topic covers **basic C syntax** and **program structure**: statements, comments, tokens, identifiers, and the form of a typical C program. Each concept is explained in text first, then shown with short code blocks so you can write C in a clear, easy format.

---

## Program structure

A C program is made of:

- **Preprocessor directives** — Lines starting with `#`, e.g. `#include`, `#define`. They are processed before compilation.
- **Function definitions** — At least one function, **`main`**, which is the entry point. Other functions are defined or declared and then called.
- **Statements** — Instructions inside functions, ending with a semicolon `;`.

A minimal structure:

```c
#include <stdio.h>

int main(void) {
   int x = 10;
   printf("%d\n", x);
   return 0;
}
```

Here, **`#include <stdio.h>`** pulls in the standard I/O declarations (e.g. **printf**). For what each common header provides (**&lt;stdlib.h&gt;** for malloc, **&lt;string.h&gt;** for strlen, etc.), see **Preprocessor and file I/O** (topic 12). The `main` function has one statement that prints `x` and one that returns 0.

---

## Statements and semicolons

A **statement** is a complete instruction. In C, statements end with **`;`**. Missing semicolons cause compile errors.

```c
int a = 1;
a = a + 1;
printf("%d\n", a);
```

Multiple statements can be grouped in **blocks** with **`{ }`**. Variables declared inside a block are **local** to that block.

```c
{
   int y = 2;
   printf("%d\n", y);
}
/* y is not visible here */
```

---

## Comments

**Comments** are ignored by the compiler. Use them to document intent.

- **Single-line:** from `//` to the end of the line (C99 and later).
- **Multi-line:** between `/*` and `*/`.

```c
// This is a single-line comment.

/* This is a
   multi-line comment. */

int n = 0;  /* inline comment */
```

---

## Tokens and identifiers

The compiler breaks source code into **tokens**: keywords, identifiers, constants, operators, punctuation.

- **Keywords** — Reserved words (e.g. `int`, `if`, `return`, `while`). They cannot be used as variable or function names.
- **Identifiers** — Names you give to variables, functions, and types. Rules:
  - Must start with a letter or underscore `_`.
  - Can contain letters, digits, and underscores.
  - Case-sensitive: `count` and `Count` are different.

```c
int count;
int _value;
int max_count_2;   /* valid */
/* int 2bad;       invalid: cannot start with digit */
```

---

## The main function

**`main`** is the **entry point** of the program. The host environment calls `main` when the program runs.

- Return type is typically **`int`**. Returning **0** means success; non-zero often indicates an error.
- Parameters: **`int main(void)`** (no arguments) or **`int main(int argc, char *argv[])`** (command-line arguments).

```c
int main(void) {
   return 0;
}
```

```c
int main(int argc, char *argv[]) {
   /* argc = number of arguments; argv[0] is program name */
   return 0;
}
```

---

## printf and format specifiers

**`printf`** (from `<stdio.h>`) prints formatted text. The first argument is a **format string**; **format specifiers** (e.g. `%d`, `%s`, `%f`) are replaced by the values of the following arguments. Common specifiers:

| Specifier | Meaning |
| --- | --- |
| `%d` | Signed decimal int |
| `%u` | Unsigned decimal int |
| `%f` | Double (decimal floating point) |
| `%c` | Single character |
| `%s` | String (null-terminated) |
| `%p` | Pointer (e.g. for addresses) |
| `%%` | Literal `%` |
| `\n` | Newline |

```c
int x = 42;
double d = 3.14;
printf("x = %d, d = %f\n", x, d);
printf("char: %c\n", 'A');
```

---

## Basic syntax rules (summary)

| Element | Rule |
| --- | --- |
| Statements | End with `;` |
| Blocks | Use `{ }` for compound statements and scope |
| Comments | `//` (single-line) or `/* */` (multi-line) |
| Identifiers | Start with letter or `_`; then letters, digits, `_` |
| Case | C is case-sensitive |

These rules apply everywhere in C; the next topics add **data types**, **operators**, and **control flow** using the same syntax.

---

## Further reading

- [C Programming Tutorial — Program Structure (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_program_structure.htm)
- [C Programming Tutorial — Basic Syntax (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_basic_syntax.htm)
- [C Programming Tutorial — Comments (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_comments.htm)
- [C Programming Tutorial — Tokens, Keywords, Identifiers (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_tokens.htm)
- [C/C++ README](./README.md) — Topic index.
