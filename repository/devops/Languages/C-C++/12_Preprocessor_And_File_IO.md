# C / C++ — Preprocessor and file I/O

[← C/C++ README](./README.md)

This topic covers the **preprocessor** (`#include`, `#define`, macros) and **file I/O** in C using the standard library. Each concept is explained in text first, then with code blocks.

---

## Preprocessor overview

The **preprocessor** runs before compilation. It handles lines starting with **`#`**: it **includes** files, **defines** macros, and performs **conditional compilation**. Preprocessor output is still C source (with macros expanded and includes pasted).

---

## #include

**`#include`** inserts the contents of another file (usually a **header**). **`#include <file>`** looks in system include paths; **`#include "file"`** looks in the current directory (and then system paths). Headers declare types and functions so the compiler knows how to check your code.

```c
#include <stdio.h>
#include <stdlib.h>
#include "my_header.h"
```

---

## What each common header provides

Including a header gives you the **declarations** (types and function prototypes) for that part of the C standard library. The linker later finds the actual implementation. Below is what the most used headers provide so you know which **`#include`** to add.

| Header | Purpose | Examples of what you get |
| --- | --- | --- |
| **&lt;stdio.h&gt;** | Standard input/output | **printf**, **scanf**, **getchar**, **putchar**, **fopen**, **fclose**, **fgets**, **fprintf**, **fscanf**, **FILE**, **stdin**, **stdout**, **stderr**, **perror** |
| **&lt;stdlib.h&gt;** | General utilities | **malloc**, **free**, **calloc**, **realloc**, **exit**, **atoi**, **atof**, **rand**, **srand**, **abs** |
| **&lt;string.h&gt;** | String and memory operations | **strlen**, **strcpy**, **strncpy**, **strcmp**, **strcat**, **memset**, **memcpy**, **memmove**, **strerror** |
| **&lt;stddef.h&gt;** | Common definitions | **NULL**, **size_t**, **ptrdiff_t** (often included indirectly by stdio/stdlib) |
| **&lt;errno.h&gt;** | Error codes | **errno** (global), and macros like **EINVAL**, **ENOMEM** |
| **&lt;math.h&gt;** | Math functions | **sin**, **cos**, **sqrt**, **pow**, **exp**, **log**, **fabs**, **ceil**, **floor** |
| **&lt;ctype.h&gt;** | Character classification | **isalpha**, **isdigit**, **isspace**, **toupper**, **tolower** |
| **&lt;stdarg.h&gt;** | Variable arguments | **va_list**, **va_start**, **va_arg**, **va_end** (for variadic functions) |
| **&lt;stdbool.h&gt;** | Boolean type (C99) | **bool**, **true**, **false** (macro for **\_Bool**) |
| **&lt;time.h&gt;** | Date and time | **time**, **clock**, **difftime**; often used with **srand(time(NULL))** |
| **&lt;limits.h&gt;** | Integer limits | **INT_MAX**, **INT_MIN**, **CHAR_BIT**, etc. |

- **&lt;stdio.h&gt;** — Use it whenever you use **printf**, **scanf**, **fopen**, **fgets**, or **FILE ***. Needed for almost every C program that does I/O.
- **&lt;stdlib.h&gt;** — Use it for **malloc**, **free**, **calloc**, **realloc**, **exit**, or numeric conversion (**atoi**, **atof**).
- **&lt;string.h&gt;** — Use it for **strlen**, **strcpy**, **strcmp**, **strcat**, or **strerror** (and **memset** / **memcpy** for raw bytes).
- **&lt;errno.h&gt;** — Use it when you need to read or test **errno** after a failed library call.
- **&lt;math.h&gt;** — Use it for math (e.g. **sqrt**, **sin**). Some compilers require linking with the math library (e.g. **-lm**).
- **&lt;ctype.h&gt;** — Use it when you need to test or convert single characters (e.g. **isalpha**, **toupper**).
- **&lt;stdarg.h&gt;** — Use it for **variadic functions** (variable number of arguments) with **va_list**, **va_start**, **va_arg**, **va_end**.
- **&lt;stdbool.h&gt;** — Use it for **bool**, **true**, **false** (C99).
- **&lt;time.h&gt;** — Use it for **time()** (e.g. seeding **srand**) or date/time operations.
- **&lt;limits.h&gt;** — Use it for **INT_MAX**, **INT_MIN**, and other implementation limits.

You only need to **`#include`** a header if your code uses something declared in it. Including extra headers is harmless but keeps the list clear if you include only what you use.

---

## Using math.h and random numbers (rand)

**&lt;math.h&gt;** provides functions such as **sqrt**, **sin**, **cos**, **pow**, **fabs**. Link with the math library (e.g. **-lm** on Unix). **&lt;stdlib.h&gt;** provides **rand()** (returns a pseudo-random integer in **0** to **RAND_MAX**) and **srand(seed)** to set the seed; call **srand** once (e.g. with **time(NULL)** from **&lt;time.h&gt;**) if you want different sequences per run.

```c
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
   double x = sqrt(2.0);
   printf("sqrt(2) = %f\n", x);

   srand((unsigned)time(NULL));
   int r = rand() % 100;   /* 0..99 */
   printf("random: %d\n", r);
   return 0;
}
```

---

## #define and macros

**`#define name value`** defines a **macro**. Before compilation, every occurrence of **name** is replaced by **value**. Macros are often used for constants or short code snippets. No semicolon after the value unless you want it in the expansion.

```c
#define MAX 100
#define PI 3.14159

int buf[MAX];
double area = PI * r * r;
```

**Macros with parameters** look like functions but are text substitution. Use parentheses around parameters and the whole expansion to avoid precedence bugs.

```c
#define SQUARE(x) ((x) * (x))
int n = SQUARE(5);
```

**Preprocessor operators** inside macros: **`#`** (stringify) turns a parameter into a string literal; **`##`** (concat) pastes two tokens together. Used in advanced macros for debugging or code generation.

```c
#define STR(x) #x
#define JOIN(a, b) a ## b
/* STR(hello) becomes "hello"; JOIN(foo, bar) becomes foobar */
```

---

## Custom header files

You can put declarations (and **inline** or **static** definitions) in a **`.h`** file and **`#include "myfile.h"`** in your **`.c`** files. Use **include guards** (**#ifndef** / **#define** / **#endif**) so the header is only processed once when included from multiple files.

```c
/* mylib.h */
#ifndef MYLIB_H
#define MYLIB_H
int add(int a, int b);
#endif
```

---

## Conditional compilation

**#ifdef**, **#ifndef**, **#endif**, and **#if** / **#else** let you include or exclude code based on macros. Use them for portability, debug builds, or optional features. **#ifdef NAME** is true if **NAME** is defined; **#ifndef** is true if it is not.

```c
#ifdef DEBUG
   printf("debug: x = %d\n", x);
#endif

#ifndef MAX_SIZE
#define MAX_SIZE 256
#endif
```

---

## Pragmas

**#pragma** is a compiler-specific directive. Common uses: **#pragma once** (include guard in one line; many compilers support it), **#pragma pack(n)** (reduce struct padding; see topic 11), and implementation-defined options for warnings or alignment. The preprocessor does not remove **#pragma**; the compiler interprets it. Behavior varies by compiler.

---

## Error handling (errno, perror, strerror)

When a library function fails (e.g. **fopen** returns NULL), it often sets the global **errno**. **perror("message")** prints your message plus the system error string; **strerror(errno)** (from **&lt;string.h&gt;** and **&lt;errno.h&gt;**) returns the error string. Always check return values and use these for diagnostics.

```c
#include <errno.h>
#include <string.h>

FILE *fp = fopen("missing.txt", "r");
if (fp == NULL) {
   perror("fopen");
   fprintf(stderr, "errno %d: %s\n", errno, strerror(errno));
   return 1;
}
```

---

## File I/O (stdio)

File I/O in C uses **FILE *** and functions in **`<stdio.h>`**. You **open** a file with **`fopen`**, read/write with **`fprintf`**, **`fscanf`**, **`fgets`**, **`fread`**, **`fwrite`**, etc., then **close** with **`fclose`**.

**Opening:** `fopen(path, mode)`. Common modes: **`"r"`** read, **`"w"`** write (truncate), **`"a"`** append. Returns **NULL** on failure.

```c
FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
   perror("fopen");
   return 1;
}
```

**Reading lines:** **`fgets(buf, size, fp)`** reads at most `size-1` characters into `buf` and adds `'\0'`. Returns `buf` or NULL on error/EOF.

```c
char line[256];
while (fgets(line, sizeof line, fp) != NULL) {
   printf("%s", line);
}
```

**Writing:** **`fprintf(fp, format, ...)`** writes formatted output to the file.

```c
FILE *out = fopen("out.txt", "w");
if (out) {
   fprintf(out, "value = %d\n", 42);
   fclose(out);
}
```

**Closing:** **`fclose(fp)`** flushes and closes the file. Always close when done; do not use the **FILE *** after closing.

---

## Command execution (system)

The function **`system(command)`** (declared in **&lt;stdlib.h&gt;**) runs a **shell command** given as a string. It returns an implementation-defined status. Use with care: avoid passing user-controlled input without validation (security risk). For portable or safer process control, use platform APIs (e.g. **fork**/ **exec** on Unix).

```c
#include <stdlib.h>
int status = system("ls -l");
```

---

## Summary

- **Preprocessor:** **`#include`** inserts a header file; **`#include <file>`** for system headers, **`#include "file"`** for local ones. Each header declares a part of the library (e.g. **&lt;stdio.h&gt;** for printf/fopen, **&lt;stdlib.h&gt;** for malloc/free, **&lt;string.h&gt;** for strlen/strcpy). **`#define`** for constants and macros; **#** and **##** in macros for stringify and concat; **custom headers** use **.h** and include guards; **#pragma** for compiler-specific options (e.g. **#pragma once**, **#pragma pack**). **#ifdef** / **#ifndef** / **#endif** for conditional compilation; expansion is text-only before compilation.
- **Math and random:** **&lt;math.h&gt;** for **sqrt**, **sin**, **pow**, etc. (link **-lm**); **&lt;stdlib.h&gt;** for **rand** / **srand**.
- **Command execution:** **system(command)** in **&lt;stdlib.h&gt;** runs a shell command; use with care for security.
- **Error handling:** **errno**, **perror**, **strerror** for diagnosing library failures (e.g. failed **fopen**).
- **File I/O:** **`fopen`** / **`fclose`**; **`fgets`**, **`fprintf`**, **`fscanf`** (and **`fread`** / **`fwrite`** for binary). Check return values and close files.

---

## Further reading

- [C Programming Tutorial — Preprocessors (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_preprocessors.htm)
- [C Programming Tutorial — Macros (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_macros.htm)
- [C Programming Tutorial — File I/O, File Operations (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_file_io.htm)
- [C/C++ README](./README.md) — Topic index.
