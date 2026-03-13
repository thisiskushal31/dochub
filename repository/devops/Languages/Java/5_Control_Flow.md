# Control flow

Control flow statements determine the order in which statements run: conditionals choose between branches, and loops repeat a block. This topic covers decision-making (if, if-else, if-else-if ladder, nested if), the switch statement (including types, fall-through, and default), all loop forms (for, enhanced for, while, do-while), and the loop-control statements break and continue.

---

## Decision making and conditions

Decision-making structures evaluate one or more boolean expressions and execute different code paths depending on the result. The condition must be of type boolean; Java does not treat numbers or references as truthy or falsy. Execution is top-to-bottom: the first condition that evaluates to true runs its block, and the rest are skipped. An optional else runs when no previous condition is true.

---

## The if statement

The if statement has a condition in parentheses and a body (one statement or a block in braces). If the condition is true, the body runs; otherwise it is skipped. Braces are optional when the body is a single statement, but using braces is recommended to avoid mistakes when adding statements later.

```java
if (x < 20) {
    System.out.print("This is if statement");
}
```

---

## The if-else statement

An if can be followed by an else. When the if condition is false, the else block runs. So exactly one of the two blocks runs.

```java
int x = 30;
if (x < 20) {
    System.out.print("This is if statement");
} else {
    System.out.print("This is else statement");  // This runs
}
```

---

## The if-else if-else ladder

You can chain multiple conditions with else if. The conditions are evaluated in order; the first that is true runs its block and the rest are skipped. An optional final else runs when no condition is true. Rules: an if can have at most one else, and it must come after all else ifs; an if can have zero or more else ifs; once one branch is taken, no other branch in the chain is executed.

```java
int x = 30;
if (x == 10) {
    System.out.print("Value of X is 10");
} else if (x == 20) {
    System.out.print("Value of X is 20");
} else if (x == 30) {
    System.out.print("Value of X is 30");  // This runs
} else {
    System.out.print("This is else statement");
}
```

---

## Nested if and if-else

An if or else block can contain another if or if-else. That lets you express “only when condition A is true, also check condition B.” Inner conditions are evaluated only when the outer condition is true.

```java
int x = 10, y = 20, z = 30;
if (x >= y) {
    if (x >= z)
        System.out.println(x + " is the largest.");
    else
        System.out.println(z + " is the largest.");
} else {
    if (y >= z)
        System.out.println(y + " is the largest.");
    else
        System.out.println(z + " is the largest.");  // 30 is the largest.
}
```

---

## Rules for if-else

- The condition must be a boolean expression (true/false).
- Conditions are evaluated top to bottom; the first true condition wins; remaining branches are not evaluated.
- else is optional; an if can stand alone.
- else must immediately follow an if or else if (no “dangling else” ambiguity: else binds to the nearest unmatched if).
- Single-statement bodies may omit braces; multiple statements require a block in `{ }`.
- Nested if and if-else are allowed in any branch.

---

## The switch statement

A switch compares one expression to many constant values and runs the code for the matching case. It is an alternative to long if-else-if chains when the decision is based on a single integral, enum, or String value.

**Syntax:** `switch (expression) { case value1: ... break; case value2: ... break; default: ... }`

**Rules:**

- The switch expression must be one of: byte, short, char, int (and their wrapper types), String (Java 7+), or an enum. Not boolean, long, float, double, or arbitrary objects.
- Each case label is a constant (literal or constant expression), not a variable. The type must match the switch expression.
- When a case matches, execution starts at that case and continues until a break (or return, or end of switch). Without break, execution falls through to the next case (fall-through).
- default is optional and runs when no case matches. It can appear anywhere; by convention it is often last. No break is needed after default if it is last.
- Only one default is allowed.

Fall-through is intentional when multiple cases share the same code; otherwise each case should end with break to avoid running the next case’s code.

```java
char grade = 'C';
switch (grade) {
    case 'A':
        System.out.println("Excellent!");
        break;
    case 'B':
    case 'C':           // fall-through: same behavior for B and C
        System.out.println("Well done");
        break;
    case 'D':
        System.out.println("You passed");
        // no break: falls through to F
    case 'F':
        System.out.println("Better try again");
        break;
    default:
        System.out.println("Invalid grade");
}
System.out.println("Your grade is " + grade);
```

String and int work the same way: the expression is compared to case constants. If no case matches and there is no default, none of the switch bodies run.

```java
String grade = "C";
switch (grade) {
    case "A":
        System.out.println("Excellent!");
        break;
    case "B":
    case "C":
        System.out.println("Well done");
        break;
    default:
        System.out.println("Invalid grade");
}

int month = 13;
switch (month) {
    case 1:  System.out.println("January"); break;
    case 2:  System.out.println("February"); break;
    // ...
    default: System.out.println("Invalid month");  // runs for 13
}
```

---

## The conditional (ternary) operator

The ternary operator `condition ? valueIfTrue : valueIfFalse` chooses one of two expressions based on a boolean condition. The condition is evaluated first; only one of the two branches is evaluated. Often used for short conditionals and initializations.

```java
int a = 10;
int b = (a == 10) ? 20 : 30;   // b is 20
int c = (a == 1) ? 20 : 30;    // c is 30
```

---

## When to use which loop

- **for** — When the number of iterations is known or you have a clear initialization, condition, and update (e.g. index from 0 to length-1).
- **Enhanced for (for-each)** — When you only need to iterate over all elements of an array or Iterable, without an index.
- **while** — When the condition is checked before the first iteration; the body may run zero times.
- **do-while** — When the body must run at least once and the condition is checked after each iteration.

---

## The for loop

The for loop is an entry-controlled loop: the condition is checked before each iteration (including the first). It has three parts in the header: initialization (run once), boolean condition (evaluated before each iteration), and update (run after each iteration). Any of the three can be omitted; omitting the condition is treated as true, which gives an infinite loop unless break is used.

**Execution order:** (1) initialization; (2) condition → if false, exit loop; (3) body; (4) update; then repeat from (2).

```java
for (int x = 10; x < 20; x = x + 1) {
    System.out.println("value of x : " + x);
}
```

Loop variable scope: a variable declared in the initialization is in scope only for the condition, body, and update of that for statement. Nested for loops can reuse the same variable name in inner loops (each has its own scope).

```java
int[] numbers = { 10, 20, 30, 40, 50 };
for (int index = 0; index < numbers.length; index++) {
    System.out.println("value of item : " + numbers[index]);
}
```

Infinite for: use a condition that is always true or omit it (and use semicolons to leave condition empty).

```java
for (;;) {
    System.out.println("value of x : " + x);
    x++;
    if (x == 100) break;
}
```

Nested for loops run the inner loop to completion for each iteration of the outer loop (e.g. for matrices or generating tables).

```java
for (int num = 1; num <= 10; num++) {
    System.out.print("Table of " + num + " is : ");
    for (int i = 1; i <= 10; i++) {
        System.out.print(num * i + " ");
    }
    System.out.println();
}
```

---

## The enhanced for (for-each) loop

The enhanced for loop iterates over an array or any Iterable (e.g. List) without an explicit index. Syntax: `for (ElementType variable : arrayOrIterable) { ... }`. The variable is the current element; it is read-only in the sense that reassigning it does not change the array or collection. Compatible with arrays and types that implement `Iterable`.

```java
int[] numbers = { 10, 20, 30, 40, 50 };
for (int x : numbers) {
    System.out.print(x + ",");
}

String[] names = { "James", "Larry", "Tom", "Lacy" };
for (String name : names) {
    System.out.print(name + ",");
}

List<Integer> list = Arrays.asList(10, 20, 30, 40, 50);
for (Integer x : list) {
    System.out.print(x + ",");
}
```

You cannot use the enhanced for to replace elements by index or to remove/add elements in a collection during iteration; use an index-based for loop or an iterator for that.

---

## The while loop

The while loop is also entry-controlled: the condition is evaluated before each iteration. If the condition is false the first time, the body never runs. The condition must be boolean.

**Execution:** Evaluate condition → if true, run body, then repeat; if false, exit loop.

```java
int x = 10;
while (x < 20) {
    System.out.println("value of x : " + x);
    x++;
}
```

Common pattern for “read until sentinel” or “repeat while condition holds.” Infinite while: `while (true) { ... }` with an exit condition and break inside.

```java
int x = 10;
while (true) {
    System.out.println("value of x : " + x);
    x++;
    if (x == 15) break;
}
```

---

## The do-while loop

The do-while loop is exit-controlled: the body runs first, then the condition is evaluated. So the body runs at least once. The condition is at the end, after the closing brace, followed by a semicolon.

**Execution:** Run body → evaluate condition → if true, repeat; if false, exit.

```java
int x = 10;
do {
    System.out.println("value of x : " + x);
    x++;
} while (x < 20);
```

Use do-while when you need at least one execution (e.g. prompt user at least once, then repeat until valid input).

```java
int index = 0;
int[] numbers = { 10, 20, 30, 40, 50 };
do {
    System.out.println("value of item : " + numbers[index]);
    index++;
} while (index < 5);
```

---

## The break statement

Break terminates the innermost enclosing switch, for, while, or do-while and transfers control to the statement immediately after it. In a switch, break prevents fall-through to the next case. In a loop, break exits the loop early.

**Syntax:** `break;` (unlabeled) or `break label;` (labeled, to exit an outer loop or block).

```java
int x = 10;
while (x < 20) {
    if (x == 15) break;
    System.out.println("value of x : " + x);
    x++;
}
// prints 10, 11, 12, 13, 14 then exits
```

```java
int[] numbers = { 10, 20, 30, 40, 50 };
for (int i = 0; i < numbers.length; i++) {
    if (numbers[i] == 30) break;
    System.out.println("value of item : " + numbers[i]);
}
// prints 10, 20 then exits
```

In an infinite loop, break is the usual way to exit on a condition.

```java
int x = 10;
while (true) {
    System.out.println("value of x : " + x);
    x++;
    if (x == 15) break;
}
```

In switch, each case that should not fall through ends with break.

```java
int day = 3;
switch (day) {
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    case 3: System.out.println("Wednesday"); break;  // then exit switch
    default: System.out.println("Invalid day");
}
```

---

## The continue statement

Continue skips the rest of the current iteration and starts the next one. In a for loop, control goes to the update part, then the condition is re-evaluated. In while and do-while, control goes directly to the condition (while) or to the condition at the end (do-while).

**Syntax:** `continue;` (unlabeled) or `continue label;` (labeled, to continue an outer loop).

```java
int x = 10;
while (x < 20) {
    x++;
    if (x == 15) continue;
    System.out.println("value of x : " + x);
}
// prints 11, 12, 13, 14, 16, 17, 18, 19, 20 (skips 15)
```

```java
int[] numbers = { 10, 20, 30, 40, 50 };
for (int i = 0; i < numbers.length; i++) {
    if (numbers[i] == 30) continue;
    System.out.println("value of item : " + numbers[i]);
}
// prints 10, 20, 40, 50
```

Typical uses: skip invalid or unwanted values, skip empty lines when reading input, or filter elements in a collection during iteration.

```java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;  // skip even numbers
    System.out.println(i);
}
```

---

## Labeled break and continue

Labels name a statement (usually a loop). You put a label before the statement followed by a colon (e.g. `outer:`). Then `break label;` exits the labeled statement, and `continue label;` skips to the next iteration of the labeled loop. This is used to exit or continue an outer loop from inside a nested loop, when a plain break or continue would only affect the innermost loop.

```java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break outer;  // exit both loops
        System.out.println("i=" + i + " j=" + j);
    }
}
// Without the label, break would only exit the inner for.
```

```java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) continue outer;  // next i, skip rest of inner loop
        System.out.println("i=" + i + " j=" + j);
    }
}
```

The label must be on a statement that contains the break or continue; you cannot jump to an arbitrary label elsewhere in the method.

---

## Summary table

| Construct      | When condition is checked | Minimum iterations |
|----------------|---------------------------|---------------------|
| if / if-else   | Once, top to bottom       | 0 (no branch)        |
| switch         | Once, match to case       | 0 (default or none)  |
| for            | Before each iteration     | 0                    |
| enhanced for   | Before each iteration     | 0                    |
| while          | Before each iteration     | 0                    |
| do-while       | After each iteration      | 1                    |
| break          | —                         | Exits loop/switch    |
| continue       | —                         | Skips to next iteration |

---

## Further reading

- [TutorialsPoint Java – Decision Making](https://www.tutorialspoint.com/java/java_decision_making.htm)
- [TutorialsPoint Java – if-else Statement](https://www.tutorialspoint.com/java/if_else_statement_in_java.htm)
- [TutorialsPoint Java – switch Statement](https://www.tutorialspoint.com/java/switch_statement_in_java.htm)
- [TutorialsPoint Java – Loop Control](https://www.tutorialspoint.com/java/java_loop_control.htm)
- [TutorialsPoint Java – for Loop](https://www.tutorialspoint.com/java/java_for_loop.htm)
- [TutorialsPoint Java – for-each Loop](https://www.tutorialspoint.com/java/java_foreach_loop.htm)
- [TutorialsPoint Java – while Loop](https://www.tutorialspoint.com/java/java_while_loop.htm)
- [TutorialsPoint Java – do-while Loop](https://www.tutorialspoint.com/java/java_do_while_loop.htm)
- [TutorialsPoint Java – break Statement](https://www.tutorialspoint.com/java/java_break_statement.htm)
- [TutorialsPoint Java – continue Statement](https://www.tutorialspoint.com/java/java_continue_statement.htm)
- [The Java™ Tutorials – Control Flow Statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)
