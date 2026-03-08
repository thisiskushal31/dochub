# C / C++ — Memory, storage classes, and dynamic allocation

[← C/C++ README](./README.md)

This topic covers **memory layout** in C, **storage classes** (scope and lifetime), and **dynamic allocation** with **`malloc`** and **`free`**. Understanding this is essential for correct and secure C code. Each concept is explained in text first, then with code blocks.

---

## Memory layout and memory address

Every variable and allocation has a **memory address** (you get it with **`&x`**). A C process typically has:

- **Text** — Executable code (read-only).
- **Data** — Global and static variables (initialized).
- **BSS** — Global and static variables that are zero-initialized.
- **Heap** — Dynamically allocated memory (**malloc**, etc.); grows upward; you must **free** it when no longer needed.
- **Stack** — Local variables and function call frames; grows downward; automatically reclaimed when the function returns.

Knowing where data lives helps you understand **lifetime**, **dangling pointers**, and **buffer overflows**.

---

## Scope rules and linkage

**Scope** is where a name is visible: **block scope** (inside **{ }**), **file scope** (outside any function; visible to the end of the file). **Global variables** are declared at file scope; they have **static storage duration** and **external linkage** by default (visible in other files unless you use **static**). **Linkage**: **external** — the same name in different files refers to the same object; **internal** — **static** at file scope limits the name to that file; **none** — local variables have no linkage.

---

## Storage classes

Storage class affects **scope** (where the name is visible) and **lifetime** (how long the object exists).

| Storage class | Scope | Lifetime |
| --- | --- | --- |
| **auto** (default for locals) | Block | Until block ends |
| **static** (local) | Block | Whole program |
| **static** (global) | File | Whole program; internal linkage |
| **extern** | Can be across files | Whole program |
| **register** (hint) | Block | Until block ends |

**Static local** — Variable keeps its value between function calls and is initialized once.

```c
int counter(void) {
   static int count = 0;
   count++;
   return count;
}
int main(void) {
   printf("%d %d %d\n", counter(), counter(), counter());
   return 0;
}
```

Output: `1 2 3`.

---

## Dynamic allocation: malloc and free

**`malloc(size)`** (in `<stdlib.h>`) allocates **size** bytes on the **heap** and returns a **`void *`** to the start. If allocation fails, it returns **NULL**. You **must** call **`free(ptr)`** exactly once for each pointer returned by `malloc` (or related functions) when the memory is no longer needed. Forgetting to free causes **memory leaks**; using memory after free causes **use-after-free** (undefined behavior and security bugs).

```c
#include <stdlib.h>

int *p = (int *)malloc(5 * sizeof(int));
if (p == NULL) {
   /* handle failure */
   return 1;
}
p[0] = 10;
p[1] = 20;
free(p);
/* do not use p after free */
```

**calloc** allocates and zero-initializes: `calloc(n, size)` is like `malloc(n * size)` but bytes are zeroed. **realloc** resizes a previously allocated block (**dynamic array resizing**): `realloc(ptr, new_size)` can grow or shrink the block (it may move it); use the returned pointer from then on and do not use the old pointer after a successful realloc.

---

## Memory leaks and dangling pointers

- **Memory leak** — You allocate with `malloc` but never `free`. Over time the process uses more and more memory.
- **Dangling pointer** — You use a pointer after the object it pointed to is gone (e.g. after `free(p)` or after a local variable’s lifetime ended). Reading or writing through it is undefined behavior.

```c
int *bad(void) {
   int x = 5;
   return &x;
}
/* Caller must not use the returned pointer: x no longer exists. */
```

---

## Summary

- **Memory layout:** Text, data, BSS, heap, stack; heap is for dynamic allocation; stack is for locals and call frames.
- **Storage classes** control scope and lifetime; **static** locals keep value across calls.
- **malloc** allocates on the heap; **free** releases it; use **calloc** for zeroed memory, **realloc** to resize.
- Avoid **leaks** (free when done) and **dangling pointers** (do not use after free or after object lifetime ends).

---

## Further reading

- [C Programming Tutorial — Memory Layout (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_memory_layout.htm)
- [C Programming Tutorial — Memory Management (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_memory_management.htm)
- [C Programming Tutorial — Storage Classes (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_storage_classes.htm)
- [C Programming Tutorial — Memory Leaks (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_memory_leaks.htm)
- [C/C++ README](./README.md) — Topic index.
