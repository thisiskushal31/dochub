# Control flow and loops

Control flow decides which code runs and how often. This topic covers conditionals (`if`, `else`, `else if`, ternary `? :`), the `switch` statement, and loops (`while`, `do...while`, `for`), plus `break`, `continue`, and labels. These constructs are the same in the browser and in Node.js.

---

## Conditionals: if, else, else if

The **if** statement runs a block of code only when a condition is truthy. The condition is evaluated and converted to boolean (see “Truthy and falsy” below).

**Syntax:** `if (condition) { ... }`. For a single statement, braces are optional but recommended for clarity and to avoid mistakes when adding lines later. Use **else** to run code when the condition is falsy. Use **else if** to chain further conditions; the first truthy branch runs and the rest are skipped.

```javascript
let age = 20;
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teen");
} else {
  console.log("Child");
}
```

Any expression can be the condition: comparisons, function calls, or variables. The block runs only when the condition’s value is truthy.

---

## Truthy and falsy

In boolean context (e.g. `if (x)`, `while (x)`, condition of `? :`), values are converted to boolean. **Falsy** values become `false`: `0`, `-0`, `""`, `null`, `undefined`, `NaN`. All other values are **truthy** (e.g. non-zero numbers, non-empty strings, `"0"`, objects, arrays). So `if (count)` is false only when `count` is `0` (or another falsy value); `if (name)` is false when `name` is the empty string. Relying on truthiness is idiomatic but be explicit when you need to distinguish `0` from “not set” (e.g. `if (value !== undefined && value !== null)` or use nullish coalescing).

---

## Ternary operator (conditional ? :)

The **conditional (ternary) operator** chooses one of two expressions by condition. Syntax: `condition ? valueIfTrue : valueIfFalse`. It returns a value, so it is useful for assignments and as part of expressions. Prefer it when both branches are simple expressions; use `if/else` when you need statements or multiple lines for readability.

```javascript
let age = 17;
let status = age >= 18 ? "adult" : "minor";
```

Multiple ternaries can be chained (e.g. `a ? x : b ? y : z`), but deep nesting hurts readability; consider `if/else if` or a lookup instead. Do not put **break** or **continue** inside a ternary—they are statements and cannot be used where an expression is expected.

---

## switch statement

**switch** compares one value to multiple candidates using **strict equality** (`===`). It has one or more **case** labels and an optional **default**. Execution starts at the matching `case` and continues until a **break** (or the end of the `switch`). If you omit `break`, execution **falls through** to the next case, which is useful for grouping several cases that share the same code.

```javascript
let key = "save";
switch (key) {
  case "save":
    console.log("Saving...");
    break;
  case "load":
  case "open":
    console.log("Loading...");
    break;
  default:
    console.log("Unknown action");
}
```

Both `switch` and `case` can use expressions (e.g. `switch (+input)`, `case x + 1`). Type matters: if the value is a string (e.g. from `prompt`), a `case` with a number will never match. Use `break` (or `return`) in each case unless fall-through is intended; add a comment when you deliberately omit `break`. **Reference types:** Comparison is by reference for objects, so `switch (obj)` will only match a `case` that is the same object reference, not a deep-equal object. For discriminating by a property, use `switch (obj.type)` or an `if/else` chain.

---

## while loop

The **while** loop runs a block repeatedly while its condition is truthy. The condition is checked **before** each iteration. If the condition is false at the start, the body never runs. Ensure the condition eventually becomes falsy (or use `break`), or the loop runs forever.

```javascript
let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}
```

Any expression is allowed as the condition; it is converted to boolean. A single-statement body can be written without braces, but braces are usually clearer.

---

## do...while loop

The **do...while** loop runs the body once, then checks the condition. If the condition is truthy, it runs again. So the body runs **at least once**. Use it when the first iteration must run before the condition can be evaluated (e.g. reading input until valid).

```javascript
let n;
do {
  n = Number(prompt("Enter a number > 100", ""));
} while (n <= 100 && n);
```

---

## for loop

The **for** loop groups initialization, condition, and update in one place. Syntax: `for (begin; condition; step) { body }`. **begin** runs once before the first iteration. Before each iteration, **condition** is evaluated; if falsy, the loop stops. After each iteration, **step** runs. Declaring the loop variable in **begin** (e.g. `for (let i = 0; i < 10; i++)`) limits its scope to the loop.

```javascript
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
```

Any of the three parts can be omitted. Omitting the condition (e.g. `for (;;)`) gives an infinite loop, which you exit with `break`. The **two semicolons are required** even when parts are omitted (e.g. `for (; i < n;)`). An empty body is valid (e.g. `for (let i = 0; i < arr.length; i++);` runs only the step); use a block with a comment if intent is to delay or iterate for side effects. **Variable scope:** Declaring the loop variable in `begin` with `let` or `const` (e.g. `for (let i = 0; ...)`) confines it to the loop; each iteration gets a fresh binding in the case of `let` in the head, which matters when creating closures (e.g. callbacks) inside the loop.

---

## break and continue

**break** exits the innermost loop (or `switch`) immediately; control goes to the first statement after the loop. Use it to stop when a goal is reached (e.g. “exit when user cancels”) or in a `switch` to avoid fall-through.

**continue** skips the rest of the current iteration and starts the next one. In a `for` loop, the **step** expression still runs after `continue`; in a `while` or `do...while`, ensure the condition will eventually become false or that you do not skip updates (e.g. incrementing a counter) that would cause an infinite loop. Use it to skip certain iterations without deep nesting.

```javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // 1, 3, 5, 7, 9
}
```

`break` and `continue` cannot be used inside a ternary or other expression-only context; they are statements.

---

## Labels for break and continue

A **label** is an identifier followed by a colon, placed before a loop (or block). **break** *label* exits the labeled loop (or block); **continue** *label* jumps to the next iteration of the labeled loop. Labels are mainly used to break out of **nested loops** when an inner loop needs to stop the outer one.

```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    let input = prompt(`Value at (${i},${j})`, "");
    if (!input) break outer;
  }
}
console.log("Done");
```

Without the label, `break` would only exit the inner loop. You cannot jump arbitrarily to a label; `break`/`continue` must be used in the normal control flow of the labeled construct.

---

## Choosing the right construct

- **if/else:** Multiple mutually exclusive conditions or complex branching.
- **Ternary ? ::** Simple “one of two values” based on a condition.
- **switch:** One value compared to many fixed options with strict equality; use `break` or intentional fall-through.
- **while:** Repeat while a condition holds; condition checked before each iteration.
- **do...while:** Same as while but body runs at least once.
- **for:** Counted or index-based loops when you have a clear start, condition, and step.
- **break/continue:** Early exit from a loop or skip to the next iteration; use labels only when breaking out of nested loops.

---

## Summary

**Conditionals:** `if`, `else`, and `else if` run blocks based on truthy conditions. The ternary operator `condition ? a : b` returns one of two values. **Truthy/falsy** conversion applies in conditions; falsy values are `0`, `""`, `null`, `undefined`, `NaN`. **switch** compares with `===` and uses `case`/`default` and `break`. **Loops:** `while` and `do...while` repeat while a condition is truthy; `for (begin; condition; step)` is for counted loops. **break** exits a loop (or switch); **continue** skips to the next iteration. **Labels** let `break`/`continue` target an outer loop. Use the construct that best expresses intent and keeps code readable.

---

## Further reading

- [javascript.info – Conditional branching: if, '?'](https://javascript.info/ifelse)
- [javascript.info – Logical operators](https://javascript.info/logical-operators)
- [javascript.info – Nullish coalescing](https://javascript.info/nullish-coalescing-operator)
- [javascript.info – Loops: while and for](https://javascript.info/while-for)
- [javascript.info – The "switch" statement](https://javascript.info/switch)
- [MDN – Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
