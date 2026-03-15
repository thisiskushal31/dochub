# Variables, data types, and operators

This topic covers how to store values (variables and constants), the built-in data types, type conversion, and the operators you use to combine and compare values. Mastery here is essential for writing correct, predictable JavaScript in any environment—browser, Node, or tooling.

---

## Declaring variables: let and const

A **variable** is a named storage for a value. You create one with **let** or **const**.

**let** declares a variable that you can reassign later. You can declare it without a value (it will be `undefined` until assigned) or with an initial value.

```javascript
let message;
message = 'Hello';
message = 'World'; // value changed
```

**const** declares a constant: the binding cannot be reassigned after creation. You must give it an initial value. Use `const` when the value will not change; it makes intent clear and prevents accidental reassignment.

```javascript
const PI = 3.14159;
const config = { env: 'prod' };
// config = {};  // error: cannot reassign
config.env = 'dev'; // allowed: property mutation, not reassignment
```

Declaring the same variable twice with `let` (or `const`) in the same scope is a syntax error. Use one declaration and then refer to the variable by name.

**Naming rules:** Names can contain letters, digits, `$`, and `_`. They must not start with a digit. Reserved words (e.g. `let`, `class`, `return`) cannot be used as names. By convention, multi-word names use **camelCase**. Constants that are known before execution (e.g. config flags) are often written in **UPPER_SNAKE_CASE**; runtime constants (e.g. a computed result that does not change afterward) are usually camelCase.

---

## The old var keyword

**var** is the legacy way to declare variables. It is function-scoped (or global), not block-scoped like `let` and `const`, and it allows redeclaration. In modern code, prefer **let** and **const**; use **var** only when maintaining old code or when you explicitly need its behavior. Strict mode and ES modules improve predictability; `var` is covered in more depth in later topics (e.g. scope and hoisting).

---

## Data types

JavaScript is **dynamically typed**: variables are not bound to a single type; a variable can hold a string and later a number. Every value, however, has a type at runtime. There are eight basic types.

**Primitive types (seven):**

- **number** — Numeric values, including integers and decimals. Stored as 64-bit IEEE 754 doubles. Special values: `Infinity`, `-Infinity`, `NaN` (result of invalid math, e.g. `"x" / 2`). Mathematical operations are “safe”: they do not throw; invalid operations yield `NaN`. **Safe integer range:** Only integers in the range ±(2^53 − 1) (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are represented exactly; outside that range, precision can be lost (e.g. `9007199254740992 === 9007199254740993` is `true`). So for exact integer arithmetic beyond that range (e.g. large IDs, timestamps in microseconds), use **BigInt**. **NaN** is the only value that is not equal to itself: `NaN === NaN` is `false`; use `Number.isNaN(x)` or `Object.is(x, NaN)` to test for NaN.
- **bigint** — Arbitrary-length integers (e.g. `123n`). Created with an `n` suffix or `BigInt(value)`. Used when integers exceed the safe range for `number`. You cannot mix `number` and `bigint` in arithmetic without explicit conversion; `1 + 1n` throws.
- **string** — Text. Delimited by single quotes, double quotes, or backticks. Backticks allow **template literals**: `${expression}` is evaluated and inserted into the string.
- **boolean** — `true` or `false`. Comparisons and logical operations produce booleans.
- **null** — Intentional “empty” or “unknown” value; its own type.
- **undefined** — Value of unassigned variables and missing properties; its own type.
- **symbol** — Unique identifiers (used with objects); details come in the Objects topic.

**Non-primitive:**

- **object** — Collections of properties (key–value pairs). Arrays, functions (callable objects), and other built-in types are objects. Covered in later topics.

There is no separate “character” type; a single character is a string of length one.

```javascript
let n = 42;
let s = "hello";
let ok = true;
let empty = null;
let u;
console.log(typeof n);   // "number"
console.log(typeof s);   // "string"
console.log(typeof ok);  // "boolean"
console.log(typeof empty); // "object" (historical quirk; null is not an object)
console.log(typeof u);    // "undefined"
```

---

## Type conversion

Operators and functions often convert values automatically. You can also convert explicitly.

**To string:** `String(value)`. Primitives convert in an obvious way (`null` → `"null"`, `true` → `"true"`). Output (e.g. `console.log`, concatenation with string) triggers string conversion.

**To number:** `Number(value)` or unary `+value`. Rules: `undefined` → `NaN`; `null` → `0`; `true` → `1`, `false` → `0`; strings are parsed (leading/trailing whitespace ignored); invalid string → `NaN`. Empty string `""` → `0`. Other arithmetic operators (e.g. `-`, `*`, `/`) also convert operands to numbers. **parseInt(str, radix)** and **parseFloat(str)** parse strings character-by-character and stop at the first invalid character (e.g. `parseInt("42px")` → `42`, `parseInt("px42")` → `NaN`). Use them when you need to accept inputs like `"42px"`; for strict numeric input, `Number()` or `+` is simpler. **Object.is(a, b)** compares without coercion and correctly treats `Object.is(NaN, NaN)` as `true` and `Object.is(0, -0)` as `false`.

**To boolean:** `Boolean(value)` or double NOT `!!value`. **Falsy** values (convert to `false`): `0`, `-0`, `""`, `null`, `undefined`, `NaN`. All other values are **truthy** (e.g. `"0"`, `" "`, non-zero numbers, non-empty strings, objects).

```javascript
console.log(Number("  123  "));  // 123
console.log(Number(""));         // 0
console.log(Number(undefined));  // NaN
console.log(Boolean("0"));       // true (non-empty string)
console.log(Boolean(0));         // false
```

---

## Arithmetic and assignment operators

**Arithmetic:** `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `%` (remainder), `**` (exponentiation). Operands are converted to numbers when needed. The binary **+** is special: if either operand is a string, the other is converted to string and the result is concatenation. So `1 + "2"` is `"12"`, not `3`. Other arithmetic operators always convert to number. **Remainder `%`:** The result has the sign of the dividend: `-5 % 2` is `-1`, `5 % -2` is `1`. For non-negative modulo (e.g. wrapping an index), use `((n % m) + m) % m` or a helper. **Exponentiation `**`:** Right-associative: `2 ** 3 ** 2` is `2 ** (3 ** 2)` (512), not 64.

**Unary +** converts to number: `+"42"` is `42`. Useful when reading string input that should be numeric.

**Assignment:** `=` assigns a value. It returns the assigned value and has low precedence. **Compound assignment:** `+=`, `-=`, `*=`, `/=`, `%=`, `**=` (e.g. `n += 5` is `n = n + 5`). Chained assignment (`a = b = c = 0`) assigns right-to-left.

**Increment/decrement:** `++` and `--` change a variable by 1. **Prefix** (`++x`): increment first, then the expression evaluates to the new value. **Postfix** (`x++`): the expression evaluates to the old value, then the variable is incremented. They only apply to variables (or assignable expressions), not to literal values.

```javascript
let a = 1;
let b = a++;  // b = 1, a = 2
let c = ++a;  // c = 3, a = 3
```

---

## Comparison operators

Comparisons return a boolean.

**Strict equality:** `===` and `!==` compare value and type. No conversion. Prefer these to avoid surprises: `0 === false` is `false`; `"" === false` is `false`.

**Loose equality:** `==` and `!=` convert types before comparing. `0 == false` and `"" == false` are `true`. `null == undefined` is `true`; they do not equal any other value. Loose equality can be confusing; use strict equality unless you have a clear reason not to.

**Relational:** `<`, `>`, `<=`, `>=`. If types differ, operands are converted to numbers (except for strict equality). Strings are compared **lexicographically** (character by character, Unicode order). When comparing with `null`/`undefined`, be careful: `null` converts to `0` in numeric comparison, so `null >= 0` is `true` but `null > 0` is `false`; `undefined` becomes `NaN`, so comparisons with it are false. Avoid using `>=`, `>`, `<`, `<=` on values that might be `null` or `undefined` unless you handle those cases explicitly.

```javascript
console.log(5 > 4);           // true
console.log("2" > "12");     // true (lexicographic: "2" > "1")
console.log("2" > 12);       // false ("2" → 2, 2 > 12 false)
console.log(null === undefined); // false
console.log(null == undefined);  // true
```

---

## Logical operators

**! (NOT):** Converts to boolean and negates. `!value` is the inverse; `!!value` converts to boolean.

**|| (OR):** Evaluates left to right. Returns the **first truthy** value, or the last value if all are falsy. Short-circuits: stops as soon as a truthy value is found. Used for defaults (e.g. `name || "Anonymous"`), but note that `0` and `""` will trigger the default.

**&& (AND):** Evaluates left to right. Returns the **first falsy** value, or the last value if all are truthy. Short-circuits on first falsy. Precedence of `&&` is higher than `||`, so `a && b || c && d` is like `(a && b) || (c && d)`.

**?? (nullish coalescing):** Returns the first operand if it is not `null` or `undefined`; otherwise the second. Unlike `||`, it does not treat `0` or `""` as “missing.” Use `??` when you want a default only for `null`/`undefined` (e.g. `height ?? 100` keeps `0`). You cannot mix `??` with `||` or `&&` without parentheses; use e.g. `(a && b) ?? c` to be explicit.

```javascript
console.log(null || "default");   // "default"
console.log(0 || 100);            // 100
console.log(0 ?? 100);             // 0
console.log("" ?? "default");     // ""
```

---

## Operator precedence and grouping

Operators have a defined **precedence**. When in doubt, use **parentheses** to make order explicit. Unary operators (e.g. `!`, `+`, `++`) typically have higher precedence than binary ones; multiplication and division higher than addition and subtraction; comparison higher than logical; assignment among the lowest. For example, unary `+` runs before binary `+`, so `+a + +b` converts both to numbers then adds them—a common pattern when summing string inputs.

---

## Summary

Use **let** for reassignable variables and **const** for constants; prefer **const** when the reference will not change. JavaScript has seven primitive types (number, bigint, string, boolean, null, undefined, symbol) and the object type. Type conversion happens implicitly in expressions and can be done explicitly with **String**, **Number**, and **Boolean**. Key operators: arithmetic (with `+` doubling as string concatenation), assignment and compound assignment, increment/decrement, strict (`===`/`!==`) and loose (`==`/`!=`) comparison, and logical **!**, **||**, **&&**, and **??**. Use strict equality and nullish coalescing where appropriate to avoid subtle bugs. Operator precedence matters; use parentheses when it improves clarity.

---

## Comma operator and other edge cases

The **comma operator** `,` evaluates each operand left to right and returns the last value. It has very low precedence (lower than `=`). Example: `let a = (1, 2, 3)` assigns `3` to `a`. It appears in `for` loops (e.g. `for (i = 0, j = 0; i < n; i++, j++)`) and sometimes in minified code; avoid in normal code for readability. **Void operator** `void expression` evaluates the expression and returns `undefined`; rarely needed. **Optional chaining** (`?.`) and **nullish coalescing** (`??`) are covered in the ES6+ topic; they help when dealing with possibly null/undefined values in property access and defaults.

---

## Further reading

- [javascript.info – Variables](https://javascript.info/variables)
- [javascript.info – Data types](https://javascript.info/types)
- [javascript.info – Type conversions](https://javascript.info/type-conversions)
- [javascript.info – Operators](https://javascript.info/operators)
- [javascript.info – Comparisons](https://javascript.info/comparison)
- [javascript.info – Logical operators](https://javascript.info/logical-operators)
- [javascript.info – Nullish coalescing](https://javascript.info/nullish-coalescing-operator)
- [MDN – Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
