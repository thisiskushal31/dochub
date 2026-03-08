# C / C++ — Pointers

[← C/C++ README](./README.md)

This topic covers **pointers** in C: what they are, **declaration**, **dereference**, **pointer arithmetic**, and the link between **pointers and arrays**. Pointers are central to C’s memory model and to security (e.g. buffer overflows). Each idea is explained in text first, then with code blocks.

---

## What is a pointer?

A **pointer** is a variable that holds the **address** of another variable (or of a function). The type of the pointer indicates the type of the object it points to. You get the address of a variable with **`&`** and access the value at that address with **`*`** (dereference).

```c
int x = 42;
int *p = &x;
printf("%d\n", *p);   /* 42 */
*p = 100;
printf("%d\n", x);    /* 100 */
```

Here, `p` “points to” `x`; `*p` is the value at that address. Changing `*p` changes `x`.

---

## Declaration and initialization

Declare a pointer with **`type *name`**. Always initialize pointers before use (or set them to **`NULL`**). An uninitialized pointer is undefined behavior if dereferenced.

```c
int a = 10;
int *ptr = &a;

int *q = NULL;   /* points to nothing; safe to check before use */
if (q != NULL)
   printf("%d\n", *q);
```

**NULL** is a null pointer constant (defined in `<stddef.h>` or `<stdio.h>`). Dereferencing a null pointer is undefined behavior and often causes crashes or security issues.

---

## Dereference and address-of

- **`&x`** — Address of `x`.
- **`*p`** — Value at the address stored in `p` (dereference).

```c
int n = 7;
int *p = &n;
printf("%p %d\n", (void *)p, *p);
*p = 8;
printf("%d\n", n);
```

Use **`%p`** to print pointer values (cast to `(void *)` for portability).

---

## Pointers and arrays

An **array name** in C often “decays” to a pointer to its first element. So `arr` and `&arr[0]` are related; you can use pointer arithmetic to traverse the array.

```c
int arr[] = { 10, 20, 30 };
int *p = arr;
printf("%d %d %d\n", *p, *(p+1), *(p+2));
printf("%d %d\n", p[0], p[1]);
```

**Pointer arithmetic:** Adding an integer `n` to a pointer `p` advances it by `n * sizeof(*p)` bytes. So `p+1` points to the next element.

```c
int a[] = { 1, 2, 3 };
int *p = a;
for (int i = 0; i < 3; i++)
   printf("%d ", *(p + i));
printf("\n");
```

---

## Pointers and functions

Passing a **pointer** to a function lets the function modify the caller’s variable (call by reference in C terms). This is how you implement “out” or “in-out” parameters.

```c
void set_to_zero(int *p) {
   *p = 0;
}

int main(void) {
   int x = 99;
   set_to_zero(&x);
   printf("%d\n", x);
   return 0;
}
```

**Returning a pointer:** Functions can return pointers (e.g. to **dynamically allocated** memory, to a **static** variable, or to an array element). **Never** return a pointer to a **local** (automatic) variable; the object is destroyed when the function returns (dangling pointer). Returning a pointer to **malloc**’d memory or to **static** storage is valid.

---

## Pointers to pointers

A **pointer to a pointer** (`int **pp`) holds the address of another pointer. Used for 2D arrays built from pointers, or when a function must change the value of a pointer variable in the caller.

```c
int x = 5;
int *p = &x;
int **pp = &p;
printf("%d\n", **pp);
```

---

## Constant pointers and pointer to constant

- **Pointer to constant:** **`const type *p`** — You cannot change the value pointed to (`*p`); the pointer itself can be reassigned. Used when a function should not modify the data it receives.
- **Constant pointer:** **`type *const p`** — The pointer cannot be reassigned; the value at **`*p`** can be changed.
- **Both:** **`const type *const p`** — Neither the pointer nor the pointed-to value may be changed.

```c
int x = 10, y = 20;
const int *pc = &x;   /* cannot do *pc = 5 */
pc = &y;              /* ok */
int *const cp = &x;   /* cannot do cp = &y */
*cp = 5;              /* ok: x is now 5 */
```

---

## void pointer

A **`void *`** pointer is a “generic” pointer: it can hold the address of any object type. You cannot dereference it until you **cast** it to a concrete type. Used for generic APIs (e.g. `qsort`, memory allocators).

```c
int i = 42;
void *vp = &i;
int *ip = (int *)vp;
printf("%d\n", *ip);
```

---

## Function pointers

A **function pointer** holds the address of a function. Its type is the function's signature (return type and parameter types). You can call the function through the pointer; this is used for **callbacks**, **dispatch tables**, and generic code (e.g. `qsort`'s comparison function).

Declare: `return_type (*name)(param_types);`. Assign: `name = &func` or `name = func`. Call: `(*name)(args)` or `name(args)`.

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int main(void) {
   int (*op)(int, int) = add;
   printf("%d\n", op(2, 3));
   op = sub;
   printf("%d\n", op(5, 2));
   return 0;
}
```

---

## Near, far, and huge pointers (legacy)

On **16-bit x86** (and some embedded targets), memory was **segmented**: an address could be **near** (offset within a segment), **far** (segment + offset), or **huge** (far pointer that is **normalized** so the same memory is represented in a unique way). The keywords **`near`**, **`far`**, and **`huge`** were used as pointer modifiers (e.g. **`far char *p`**). They are **legacy** and not part of standard C; modern 32/64-bit flat address spaces make them obsolete. You may still see them in old DOS/Windows code, firmware, or documentation. Knowing what they mean helps when maintaining or reverse-engineering legacy code.

| Modifier | Typical meaning (16-bit context) |
| --- | --- |
| **near** | Offset only; same segment as the current code/data (16-bit offset). |
| **far** | Segment + offset (32-bit address); can point across segments. |
| **huge** | Far pointer that is normalized (segment part adjusted so pointer arithmetic works correctly across segment boundaries). |

---

## Summary

- A **pointer** stores an **address**; **`&`** takes an address, **`*`** dereferences.
- **NULL** means “no object”; always check before dereferencing when a pointer might be null.
- **Pointers and arrays** are closely related; array names decay to pointers; pointer arithmetic moves by elements.
- Passing **pointers** to functions allows modifying the caller’s data; **void *** is for generic pointers.
- **Function pointers** hold the address of a function; used for callbacks and generic APIs.
- **const** with pointers: **pointer to const** (`const T *p`) vs **const pointer** (`T *const p`) control whether the value or the pointer itself can be changed.
- The **restrict** keyword (C99) tells the compiler that a pointer is the only way to access the object it points to in that scope; it allows optimizations. Used in function parameters (e.g. **`void copy(int *restrict dst, const int *restrict src, int n);`**).
- **Near, far, and huge** pointers are **legacy** (16-bit segmented memory); not standard C; useful to know when reading old DOS/Windows or embedded code.

---

## Further reading

- [C Programming Tutorial — Pointers (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_pointers.htm)
- [C Programming Tutorial — Dereference, NULL, void pointer (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_dereference_pointer.htm)
- [C Programming Tutorial — Pointers and Arrays (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_pointers_and_arrays.htm)
- [C Programming Tutorial — Function Pointers (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_function_pointers.htm)
- [C Programming Tutorial — Near, Far and Huge Pointers (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_near_far_and_huge_pointers.htm)
- [C/C++ README](./README.md) — Topic index.
