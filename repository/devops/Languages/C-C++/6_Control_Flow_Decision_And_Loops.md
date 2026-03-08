# C / C++ — Decision making and loops

[← C/C++ README](./README.md)

This topic covers **decision making** (`if`, `else`, `switch`) and **loops** (`for`, `while`, `do-while`) in C. Each construct is explained in text first, then with code blocks so you can write clear, readable C.

---

## if and if-else

**`if`** executes a statement or block only when a condition is true (non-zero). **`else`** gives an alternative when the condition is false.

```c
int x = 10;
if (x > 0) {
   printf("positive\n");
} else if (x < 0) {
   printf("negative\n");
} else {
   printf("zero\n");
}
```

You can use a single statement without braces, but blocks with `{ }` are clearer and safer when you add more statements later.

```c
if (x > 5)
   printf("greater than 5\n");
else
   printf("5 or less\n");
```

---

## switch

**`switch`** chooses one of several cases based on the value of an integer (or character) expression. **`break`** exits the switch; without it, execution **falls through** to the next case. C has no “range” syntax for case labels; to handle a range of values, use **fall-through** (e.g. `case 1: case 2: case 3:` for 1–3) or **if-else**.

```c
char grade = 'B';
switch (grade) {
   case 'A':
      printf("Excellent\n");
      break;
   case 'B':
      printf("Good\n");
      break;
   case 'C':
      printf("Fair\n");
      break;
   default:
      printf("Invalid grade\n");
}
```

**Fall-through** is sometimes used on purpose (e.g. several cases doing the same thing), but usually you want `break` after each case.

---

## for loop

**`for`** has three parts: **initialization**, **condition**, and **update**. The body runs while the condition is true.

```c
int i;
for (i = 0; i < 5; i++) {
   printf("%d ", i);
}
printf("\n");   /* 0 1 2 3 4 */
```

All three parts are optional. An **infinite loop** runs until **break** or **return** (e.g. `for (;;) { ... }` or `while (1) { ... }`).

```c
for (int j = 10; j >= 0; j -= 2) {
   printf("%d ", j);
}
/* 10 8 6 4 2 0 */
```

---

## while loop

**`while`** tests the condition **before** each iteration. If the condition is false at the start, the body never runs.

```c
int n = 0;
while (n < 3) {
   printf("n = %d\n", n);
   n++;
}
```

---

## do-while loop

**`do-while`** runs the body at least once, then tests the condition. It is useful when you must execute the body before checking (e.g. reading input).

```c
int k = 0;
do {
   printf("%d ", k);
   k++;
} while (k < 3);
printf("\n");
```

**For vs while:** Use **for** when you have a clear loop variable and init/update; use **while** when the condition is more general or the update is not a simple step. Both are equivalent in power; choose for readability.

---

## break and continue

- **`break`** — Exits the innermost **switch**, **for**, **while**, or **do-while** immediately.
- **`continue`** — Skips the rest of the current iteration and continues the loop with the next iteration.

```c
for (int i = 0; i < 10; i++) {
   if (i == 3) continue;   /* skip 3 */
   if (i == 7) break;      /* stop at 7 */
   printf("%d ", i);
}
printf("\n");   /* 0 1 2 4 5 6 */
```

---

## goto statement

**`goto label;`** jumps to a **label** (an identifier followed by a colon) in the same function. Labels are placed before a statement. **goto** is rarely needed; **break**, **continue**, and structured loops are usually clearer. It is sometimes used to leave nested loops or for centralized cleanup. Use sparingly to keep code readable.

```c
   for (int i = 0; i < n; i++) {
      if (error_condition) goto cleanup;
      /* ... */
   }
cleanup:
   /* release resources */
```

---

## Nested loops

Loops can be **nested**: an inner loop runs fully for each iteration of the outer loop. Typical use: iterating over rows and columns (e.g. a 2D grid).

```c
for (int row = 0; row < 2; row++) {
   for (int col = 0; col < 3; col++) {
      printf("(%d,%d) ", row, col);
   }
   printf("\n");
}
/* (0,0) (0,1) (0,2)
   (1,0) (1,1) (1,2) */
```

---

## Summary

| Construct | Use |
| --- | --- |
| `if` / `else if` / `else` | Branch on conditions |
| `switch` / `case` / `default` | Multi-way branch on integer/char value |
| `for` | Loop with init, condition, update |
| `while` | Loop with condition checked before body |
| `do-while` | Loop with condition checked after body |
| `break` | Exit loop or switch |
| `continue` | Skip to next iteration |
| `goto label` | Jump to label in same function (use sparingly) |
| **Switch range** | Use fall-through `case 1: case 2: case 3:` or if-else (no range syntax in C) |
| **Infinite loop** | `for (;;)` or `while (1)`; exit with break/return |

---

## Further reading

- [C Programming Tutorial — Decision Making (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_decision_making.htm)
- [C Programming Tutorial — if, if-else, switch (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/if_statement_in_c.htm)
- [C Programming Tutorial — Loops, for, while, do-while (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_loops.htm)
- [C/C++ README](./README.md) — Topic index.
