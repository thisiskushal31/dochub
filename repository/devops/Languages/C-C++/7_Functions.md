# C / C++ — Functions

[← C/C++ README](./README.md)

This topic covers **functions** in C: defining them, **prototypes**, **call by value** vs **call by reference** (via pointers), **recursion**, and **main**. Each idea is explained in text first, then with code blocks so you can write clear, modular C.

---

## Why functions?

**Functions** group code into reusable, named units. They take **arguments** (inputs), optionally return a **value**, and help keep programs organized and testable. The C standard library is a set of functions (e.g. `printf`, `malloc`).

---

## Defining a function

A function has a **return type**, a **name**, **parameters** in parentheses, and a **body** in braces. If it does not return a value, use **`void`** as the return type.

```c
int add(int a, int b) {
   return a + b;
}

void greet(void) {
   printf("Hello\n");
}
```

**Return:** `return value;` exits the function and gives the value to the caller. A function with return type `void` can use `return;` with no value, or omit it at the end.

```c
int max(int x, int y) {
   if (x > y) return x;
   return y;
}
```

---

## Function prototype (declaration)

So that the compiler knows a function’s type before it is used, you **declare** it with a **prototype**: return type, name, and parameter types (names optional). The definition can appear later or in another file.

```c
int add(int a, int b);   /* prototype */

int main(void) {
   int sum = add(2, 3);
   printf("%d\n", sum);
   return 0;
}

int add(int a, int b) {
   return a + b;
}
```

---

## The main function

**`main`** is the program entry point. Two common forms:

- **`int main(void)`** — No parameters.
- **`int main(int argc, char *argv[])`** — Command-line arguments: `argc` is the count, `argv[0]` is the program name, `argv[1]` onward are the arguments.

```c
int main(int argc, char *argv[]) {
   printf("Program: %s\n", argv[0]);
   for (int i = 1; i < argc; i++)
      printf("  arg %d: %s\n", i, argv[i]);
   return 0;
}
```

---

## Call by value

By default, C passes arguments **by value**: the function receives a **copy**. Changing the parameter inside the function does not change the original variable in the caller.

```c
void increment(int x) {
   x++;
}

int main(void) {
   int a = 5;
   increment(a);
   printf("%d\n", a);   /* still 5 */
   return 0;
}
```

---

## Call by reference (using pointers)

To let a function modify the caller’s variable, pass a **pointer** to it (address). The function then uses **dereference** (`*p`) to read or write the value at that address. This is often called “call by reference” in C (by passing a pointer).

```c
void swap(int *p, int *q) {
   int t = *p;
   *p = *q;
   *q = t;
}

int main(void) {
   int a = 1, b = 2;
   swap(&a, &b);
   printf("%d %d\n", a, b);   /* 2 1 */
   return 0;
}
```

---

## Recursion

A function can **call itself** (recursion). You need a **base case** that stops the recursion; otherwise you get infinite recursion and eventually stack overflow.

**Example: factorial.** `fact(0) = 1`, `fact(n) = n * fact(n-1)` for n > 0.

```c
int fact(int n) {
   if (n <= 0) return 1;
   return n * fact(n - 1);
}

int main(void) {
   printf("%d\n", fact(5));   /* 120 */
   return 0;
}
```

---

## Variadic functions (variable arguments)

A **variadic function** takes a variable number of arguments. You declare it with **`...`** as the last parameter and use the **`<stdarg.h>`** macros: **`va_list`**, **`va_start`**, **`va_arg`**, **`va_end`**. The function must have at least one named parameter (e.g. a count or format string) so you know how many arguments were passed. **`printf`** is variadic.

```c
#include <stdarg.h>
#include <stdio.h>

int sum(int n, ...) {
   va_list ap;
   va_start(ap, n);
   int total = 0;
   for (int i = 0; i < n; i++)
      total += va_arg(ap, int);
   va_end(ap);
   return total;
}

int main(void) {
   printf("%d\n", sum(3, 10, 20, 30));   /* 60 */
   return 0;
}
```

---

## Nested functions (GCC extension)

Standard C does **not** allow defining a function **inside** another function. **GCC** (and some other compilers) support **nested functions** as an extension: a function defined inside another can use the outer function’s local variables (like a closure). They are **non-portable** and not part of ISO C, so avoid them in new, portable code. You may still see them in legacy or embedded code; knowing they exist helps when reading such code or when maintaining projects that rely on GCC-specific features.

```c
/* GCC extension only; not standard C */
void outer(int x) {
   void nested(void) {
      printf("%d\n", x);   /* captures x from outer */
   }
   nested();
}
```

---

## Summary

- **Functions** have a return type, name, parameters, and body; they are declared with **prototypes** when used before definition.
- **`main`** is the entry point; it can take `(void)` or `(int argc, char *argv[])`.
- **Call by value** passes a copy; **passing a pointer** allows the function to modify the caller’s variable.
- **Recursion** is when a function calls itself; always have a base case.
- **Variadic functions** use **`...`** and **`<stdarg.h>`** (**va_list**, **va_start**, **va_arg**, **va_end**) for a variable number of arguments.
- **Nested functions** (defining a function inside another) are a **GCC extension**, not standard C; useful to know when reading legacy or embedded code.

---

## Further reading

- [C Programming Tutorial — Functions (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_functions.htm)
- [C Programming Tutorial — Function Prototype, Main (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_functions_prototype.htm)
- [C Programming Tutorial — Call by Value, Call by Reference (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_function_call_by_value.htm)
- [C Programming Tutorial — Recursion (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_recursion.htm)
- [C Programming Tutorial — Nested Functions (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_nested_functions.htm)
- [C/C++ README](./README.md) — Topic index.
