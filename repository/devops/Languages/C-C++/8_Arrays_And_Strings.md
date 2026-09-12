# C / C++ — Arrays and strings

[← C/C++ README](./README.md)

This topic covers **arrays** and **strings** in C: declaring and using arrays, **multi-dimensional arrays**, and **strings** as character arrays. Each concept is explained in text first, then with code blocks so you can write clear, easy-to-read C.

---

## Arrays

An **array** is a contiguous sequence of elements of the **same type**. You declare it as `type name[size]`. Elements are indexed from **0** to **size - 1**. C does not check bounds; out-of-range access is undefined behavior (and a common source of bugs and security issues).

```c
int arr[5];
arr[0] = 10;
arr[1] = 20;
arr[4] = 50;
printf("%d %d\n", arr[0], arr[4]);
```

**Initialization:** You can initialize an array when you declare it. Unspecified elements are zero-initialized.

```c
int a[5] = { 1, 2, 3 };
/* a[0]=1, a[1]=2, a[2]=3, a[3]=0, a[4]=0 */

int b[] = { 10, 20, 30 };   /* size 3 inferred */
```

---

## Passing arrays to functions

When you pass an array to a function, it **decays** to a pointer to the first element. So the function receives a pointer, not a copy of the whole array. You typically pass the **length** as a separate argument (C does not store the size in the array).

```c
int sum(int *p, int n) {
   int s = 0;
   for (int i = 0; i < n; i++)
      s += p[i];
   return s;
}

int main(void) {
   int arr[] = { 1, 2, 3, 4, 5 };
   printf("%d\n", sum(arr, 5));   /* 15 */
   return 0;
}
```

**Properties of arrays:** Elements are stored **contiguously**; the array name **decays** to a pointer to the first element; size is **fixed** at declaration (or use VLA/dynamic allocation). **sizeof(arr)** gives total bytes for a true array.

You can write the parameter as `int p[]`; it still means “pointer to int”.

---

## Multi-dimensional arrays

A **2D array** is an “array of arrays”: `type name[rows][cols]`. Elements are accessed as `arr[i][j]`. In memory they are stored row by row.

```c
int grid[2][3] = {
   { 1, 2, 3 },
   { 4, 5, 6 }
};
printf("%d\n", grid[1][2]);   /* 6 */
```

For passing to functions, you must specify all dimensions except the first (which can be omitted), e.g. `void f(int a[][3], int rows)`.

---

## Variable length arrays (VLA)

A **variable length array** has a size that is not a constant; the size is determined at runtime (e.g. **`int a[n];`** where **`n`** is a variable). VLAs are supported in C99; they are allocated on the stack and their size cannot be changed after creation. Some coding standards avoid VLAs; **malloc** is an alternative for dynamic sizing.

```c
int n;
scanf("%d", &n);
int vla[n];
for (int i = 0; i < n; i++) vla[i] = i;
```

---

## Array of strings

An **array of strings** is an array of **`char *`** (each element points to a string) or a 2D **`char`** array **`char arr[N][MAXLEN]`**. With **`char *arr[]`**, each **arr[i]** points to a (possibly read-only) string; with **`char arr[][MAXLEN]`**, each row holds one string with space for **MAXLEN** characters.

```c
const char *names[] = { "Alice", "Bob", "Carol" };
for (int i = 0; i < 3; i++) printf("%s\n", names[i]);
```

---

## Strings as character arrays

In C, a **string** is an array of **`char`** ending with the **null character** `'\0'`. String literals like `"hello"` are such arrays (including the `'\0'`). You can use them to initialize a character array or a pointer to `char`.

```c
char s1[] = "hello";
char s2[6] = { 'h', 'e', 'l', 'l', 'o', '\0' };
/* s1 and s2 are equivalent */
printf("%s\n", s1);
```

**Length:** The number of characters **before** `'\0'`. You can compute it by scanning until `'\0'`, or use **`strlen`** from `<string.h>` (it does not count the null terminator).

```c
#include <string.h>
char msg[] = "C";
printf("%zu\n", strlen(msg));   /* 1 */
```

---

## String functions (standard library)

`<string.h>` provides functions that operate on null-terminated strings. They assume the destination has enough space; misuse leads to buffer overflows.

| Function | Purpose |
| --- | --- |
| `strlen(s)` | Length of `s` (excluding `'\0'`) |
| `strcpy(dest, src)` | Copy `src` to `dest` |
| `strncpy(dest, src, n)` | Copy at most `n` chars |
| `strcat(dest, src)` | Append `src` to `dest` |
| `strcmp(a, b)` | Compare: 0 if equal, &lt;0 or &gt;0 otherwise |

```c
#include <string.h>
char buf[20];
strcpy(buf, "Hello");
strcat(buf, " world");
printf("%s\n", buf);
if (strcmp(buf, "Hello world") == 0)
   printf("equal\n");
```

---

## User input: scanf and getchar

**`scanf`** (from `<stdio.h>`) reads formatted input. You pass a format string and **addresses** of variables (using `&`) so `scanf` can store the read values. **`getchar()`** reads a single character from **stdin**; **`getc(stream)`** reads from any **FILE *** (e.g. **getc(stdin)**). **`getch`** and **`getche`** are **non-standard** (e.g. in `<conio.h>` on some systems) and are not in portable C. Always check return values and ensure buffers are large enough to avoid overflows.

```c
int n;
char c;
printf("Enter a number and a letter: ");
if (scanf("%d %c", &n, &c) == 2)
   printf("Read: %d and %c\n", n, c);

c = getchar();
```

For string input with a length limit, use **`scanf("%99s", buf)`** (limit minus one for `'\0'`) or **`fgets(buf, size, stdin)`** to read a line safely.

---

## Summary

- **Arrays** are fixed-size sequences of the same type; index from 0; no built-in bounds checking. **Properties:** contiguous storage, name decays to pointer, **sizeof** for byte size.
- **Array of strings:** **`char *arr[]`** or **`char arr[][MAXLEN]`**.
- **Passing arrays** passes a pointer to the first element; pass the length separately.
- **Multi-dimensional arrays** are arrays of arrays; use `arr[i][j]` and specify dimensions in function parameters.
- **Variable length arrays (VLA):** size can be a runtime value (e.g. **`int a[n];`**); C99; stack-allocated.
- **Strings** are `char` arrays ending with `'\0'`; use `<string.h>` for length, copy, compare, and concatenate, and ensure buffers are large enough.
- **Input:** **scanf**, **getchar**/ **getc** for stdin; **getch**/ **getche** are non-standard.

---

## Further reading

- [C Programming Tutorial — Arrays (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_arrays.htm)
- [C Programming Tutorial — Multi-dimensional Arrays (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_multi_dimensional_arrays.htm)
- [C Programming Tutorial — Strings (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_strings.htm)
- [C/C++ README](./README.md) — Topic index.
