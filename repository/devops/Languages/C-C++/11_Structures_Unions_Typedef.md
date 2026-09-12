# C / C++ — Structures, unions, and typedef

[← C/C++ README](./README.md)

This topic covers **structures** (structs), **unions**, and **typedef** in C. They let you define **custom types** that group or share data. Each concept is explained in text first, then with code blocks.

---

## Structures (struct)

A **structure** is a type that groups one or more **members** (fields) of possibly different types. You define it with **`struct name { ... };`**. Use the **dot operator (`.`)** to access members when you have a struct value; use **`->`** when you have a pointer to a struct (`ptr->member` is shorthand for `(*ptr).member`). Structs are used for records, messages, and data that belong together.

```c
struct Point {
   int x;
   int y;
};

struct Point p;
p.x = 3;
p.y = 4;
printf("%d %d\n", p.x, p.y);
```

You can initialize at declaration:

```c
struct Point q = { 1, 2 };
struct Point r = { .x = 10, .y = 20 };
```

---

## Pointers to structures

When you have a **pointer to a struct**, use **`->`** to access members: `ptr->member` is the same as `(*ptr).member`.

```c
struct Point pt = { 5, 6 };
struct Point *ptr = &pt;
printf("%d %d\n", ptr->x, ptr->y);
ptr->x = 7;
```

---

## Structures and functions

You can pass structs **by value** (a copy) or **by pointer** (so the function can modify the original). Passing by pointer is common for large structs or when the function must update fields.

```c
void scale(struct Point *p, int factor) {
   p->x *= factor;
   p->y *= factor;
}

int main(void) {
   struct Point pt = { 2, 3 };
   scale(&pt, 2);
   printf("%d %d\n", pt.x, pt.y);
   return 0;
}
```

---

## Unions

A **union** is a type that holds **one** of its members at a time; all members share the **same memory**. The size of a union is the size of its largest member. Unions are used when a value can be one of several types (e.g. in parsers or message formats).

```c
union Data {
   int i;
   double d;
   char c;
};

union Data u;
u.i = 42;
printf("%d\n", u.i);
u.d = 3.14;
printf("%f\n", u.d);
```

Reading a union member other than the one last written is allowed in C but you must keep track of which member is “active” yourself (or use a tagged union: struct with an enum and a union).

---

## Bit fields

A **bit field** is a struct member that specifies its width in bits. Used for packed flags, hardware registers, or protocol headers. The type must be an integer type; the number after the colon is the width.

```c
struct Flags {
   unsigned int a : 1;
   unsigned int b : 3;
   unsigned int c : 4;
};
struct Flags f;
f.a = 1;
f.b = 5;
```

---

## Structure padding and packing

The compiler may insert **padding** bytes between struct members so that each member is **aligned** for the hardware (e.g. a 4-byte int starts at an address divisible by 4). The total size of a struct can be larger than the sum of its members. **`#pragma pack(n)`** (or compiler-specific attributes) can reduce padding for packed layouts (e.g. network packets); use with care for portability and alignment.

---

## Flexible array member (C99)

A **flexible array member** is a struct member with **incomplete array type** as the **last** member (e.g. **`int arr[];`**). The struct then describes a variable-length record: you allocate **sizeof(struct) + n * sizeof(element)** and use the trailing array. Common in APIs that return variable-sized data.

```c
struct Buffer {
   size_t len;
   char data[];   /* flexible array member */
};
struct Buffer *b = malloc(sizeof(struct Buffer) + 100);
b->len = 100;
```

---

## Self-referential structures

A struct can contain a **pointer** to a struct of the same type. This is used for **linked lists**, trees, and other dynamic data structures. The struct name must be used before the closing **`}`**, so the pointer is declared as **`struct name *next;`**.

```c
struct Node {
   int data;
   struct Node *next;
};
struct Node a = { 1, NULL }, b = { 2, NULL };
a.next = &b;
```

---

## Anonymous structure and union (C11)

C11 allows **anonymous** struct or union members: a member without a name, so its fields are accessed directly in the containing struct. Used to flatten or overlay layout without an extra level of names.

```c
struct Wrapper {
   int tag;
   union {
      int i;
      double d;
   };   /* anonymous union; access as w.i or w.d */
};
struct Wrapper w;
w.i = 42;
```

---

## Lookup tables

A **lookup table** maps a value (e.g. an index or key) to another value or action. In C you often use an **array** (index → value), an **array of function pointers** (index → function to call), or a **switch** with dense **case** labels. Useful for parsers, state machines, and dispatch by type or opcode.

---

## Enumeration (enum)

An **enum** defines a set of named integer constants. By default the first enumerator is 0, and each following one is one greater. You can set values explicitly. Enums are used for **states**, **options**, and **fixed sets of values**.

```c
enum Color { RED, GREEN, BLUE };
enum Status { OK = 0, ERROR = -1 };

enum Color c = GREEN;
printf("%d\n", c);
```

---

## typedef

**typedef** introduces an **alias** for a type. It does not create a new type; it gives a new name to an existing type. Used to shorten names or to emphasize intent.

```c
typedef unsigned long ulong;
typedef struct Point Point;

Point a = { 0, 0 };
ulong n = 100;
```

Combining typedef with struct is common so you can write `Point p` instead of `struct Point p`:

```c
typedef struct {
   int x;
   int y;
} Point;

Point p = { 1, 2 };
```

---

## Summary

- **struct** groups multiple members; access with **`.`** or **`->`** (for pointers).
- **union** holds one member at a time; all share the same storage. **Struct vs union:** struct has storage for every member; union has storage for one (the largest) shared by all.
- **Bit fields** pack integer members with a specified bit width.
- **Structure padding** aligns members; **nested structures** (struct as member); **flexible array member** (last member **`type name[];`**) for variable-length structs; **self-referential** structs (e.g. **struct Node *next**) enable linked lists; **anonymous** struct/union (C11); **lookup tables** (arrays or function pointers for dispatch).
- **enum** defines named integer constants for states or options.
- **typedef** gives a type a new name; often used with structs for shorter, clearer code.

---

## Further reading

- [C Programming Tutorial — Structures (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_structures.htm)
- [C Programming Tutorial — Unions (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_unions.htm)
- [C Programming Tutorial — Typedef (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_typedef.htm)
- [C Programming Tutorial — Enumeration (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_enumeration_or_enum.htm)
- [C/C++ README](./README.md) — Topic index.
