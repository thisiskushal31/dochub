# C / C++ — Case studies and hands-on examples

[← C/C++ README](./README.md)

This topic gives **hands-on case studies** so you can see C **implementation** from basic to practical. Each example follows the same pattern: **goal** → **approach** → **code** → **expected behavior**. The format is text first, then a code block, so you can write and read C in an easy, consistent way.

---

## Case study 1: Hello World

**Goal:** Print a message to the console and exit successfully.

**Approach:** Include `<stdio.h>` for **`printf`**. Define **`main`** with return type **`int`**; call **`printf`** with a string (use **`\n`** for a newline); **return 0** to indicate success.

```c
#include <stdio.h>

int main(void) {
   printf("Hello, World!\n");
   return 0;
}
```

**Expected behavior:** The program prints `Hello, World!` and a newline, then exits with status 0.

---

## Case study 2: Factorial (recursion)

**Goal:** Compute the factorial of a non-negative integer using a **recursive** function. Fact(0) = 1; Fact(n) = n * Fact(n-1) for n > 0.

**Approach:** Define **`fact(n)`** that returns 1 when n ≤ 0, and otherwise returns **n * fact(n-1)**. The base case stops the recursion.

```c
#include <stdio.h>

int fact(int n) {
   if (n <= 0) return 1;
   return n * fact(n - 1);
}

int main(void) {
   printf("%d\n", fact(5));
   return 0;
}
```

**Expected behavior:** Output is **120** (5!).

---

## Case study 3: Swap with pointers

**Goal:** Swap two integers using a function that modifies the caller’s variables.

**Approach:** Pass **pointers** to the two integers. Inside the function, use a temporary and **dereference** the pointers to read and write the values. This is “call by reference” in C (by passing addresses).

```c
#include <stdio.h>

void swap(int *a, int *b) {
   int t = *a;
   *a = *b;
   *b = t;
}

int main(void) {
   int x = 1, y = 2;
   swap(&x, &y);
   printf("%d %d\n", x, y);
   return 0;
}
```

**Expected behavior:** Output is **2 1**.

---

## Case study 4: Read a file line by line

**Goal:** Open a text file and print each line to the console.

**Approach:** Use **`fopen`** with mode **`"r"`**; check for **NULL**. In a loop, call **`fgets(buf, size, fp)`** until it returns NULL. Print **buf**. Then **`fclose(fp)`**.

```c
#include <stdio.h>

#define LINE_MAX 256

int main(void) {
   FILE *fp = fopen("input.txt", "r");
   if (fp == NULL) {
      perror("fopen");
      return 1;
   }
   char line[LINE_MAX];
   while (fgets(line, sizeof line, fp) != NULL)
      printf("%s", line);
   fclose(fp);
   return 0;
}
```

**Expected behavior:** Each line of `input.txt` is printed. If the file is missing, an error is printed and the program returns 1.

---

## Case study 5: Dynamic array (malloc and free)

**Goal:** Allocate an array of integers on the **heap**, fill it, sum the elements, then **free** the memory.

**Approach:** Use **`malloc(n * sizeof(int))`**; check for **NULL**. Use the pointer like an array; when done, call **`free(ptr)`** and do not use the pointer afterward.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
   int n = 5;
   int *arr = (int *)malloc(n * sizeof(int));
   if (arr == NULL) return 1;
   for (int i = 0; i < n; i++)
      arr[i] = i + 1;
   int sum = 0;
   for (int i = 0; i < n; i++)
      sum += arr[i];
   printf("%d\n", sum);
   free(arr);
   return 0;
}
```

**Expected behavior:** Output is **15** (1+2+3+4+5). No leak: **free** is called once.

---

## Summary

| Case study | Concepts used |
| --- | --- |
| Hello World | main, printf, return |
| Factorial | recursion, base case |
| Swap | pointers, call by reference |
| Read file | fopen, fgets, fclose |
| Dynamic array | malloc, free, pointer as array |

These examples are building blocks for larger programs. The same patterns (functions, pointers, file I/O, dynamic allocation) appear across cybersecurity and engineering codebases.

---

## Further reading

- [C Programming Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/index.htm) — Full course.
- [C/C++ README](./README.md) — Topic index.
