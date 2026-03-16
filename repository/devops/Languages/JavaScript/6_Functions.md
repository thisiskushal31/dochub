# Functions

Functions are the main building blocks of JavaScript: they encapsulate logic, avoid repetition, and can be passed around as values. This topic covers function declarations and expressions, parameters (including defaults), return values, the difference between calling and referencing a function, callbacks, and arrow functions. Understanding when and how functions are created (hoisting, block scope) is essential for debugging and for writing clear, reusable code.

---

## Function declaration

A **function declaration** creates a named function and is a standalone statement. Syntax: `function name(parameter1, parameter2, ...) { body }`. The function can be called by name: `name()`. Variables declared inside the function with `let`, `const`, or `var` are **local** to that function; they are not visible outside. The function can read and modify **outer variables** (variables in the enclosing scope); if a local variable has the same name as an outer one, it shadows the outer variable for the duration of the function.

```javascript
function greet(name) {
  let message = "Hello, " + name;
  return message;
}
console.log(greet("World")); // Hello, World
```

Function declarations are **hoisted**: the engine processes them before running the rest of the code, so a function declared at the bottom of a script can be called from the top. That applies to the scope in which the declaration appears (global or function); in strict mode, a function declaration inside a block is block-scoped and not visible outside that block.

---

## Parameters and arguments

**Parameters** are the names listed in the function definition; **arguments** are the values passed when the function is called. Arguments are assigned to parameters in order. If you pass fewer arguments than parameters, the extra parameters get the value `undefined`. If you pass more, the extra arguments are not assigned to any parameter (but they are available via the `arguments` object in non-arrow functions; in modern code, rest parameters are preferred). Parameters are effectively local variables; reassigning a parameter does not change the value in the caller, but if the value is an object, mutating its properties does affect the original object (reference semantics). The **arguments** object (in non-arrow functions) is an array-like object that holds all arguments passed to the function; it has a `length` property and is iterable but does not support array methods like `push` or `map`. Prefer **rest parameters** (`...rest`) in new code when you need a real array of “all remaining arguments.” Arrow functions do not have their own `arguments`; they use the `arguments` of the enclosing function.

```javascript
function log(a, b) {
  console.log(a, b);
}
log(1);       // 1 undefined
log(1, 2, 3); // 1 2 (3 is not assigned to a parameter)
```

---

## Rest parameters

**Rest parameters** use the `...` syntax to collect the “rest” of the arguments into a single array. The rest parameter must be the last parameter. This gives you a real array (e.g. for `forEach`, `map`, or spreading) and makes the function’s signature clear. Example: `function sum(first, ...rest) { return first + rest.reduce((a, b) => a + b, 0); }`. Rest parameters and default parameters are covered in more detail in the ES6+ topic.

---

## Default parameters

You can give a parameter a **default value** with `=`: `function f(a, b = 10) { ... }`. The default is used when the argument is **missing** or when it is explicitly `undefined`; it is not used for other falsy values like `0` or `""`. Defaults are evaluated at **call time** when needed, so you can use expressions or even call other functions (e.g. `function f(x = getDefault()) { ... }`). Parameters with defaults can appear after required parameters; parameters without defaults that come after ones with defaults are still “required” in the sense that they get `undefined` if not passed.

```javascript
function show(from, text = "no text") {
  console.log(from + ": " + text);
}
show("Ann");           // Ann: no text
show("Ann", undefined); // Ann: no text
show("Ann", "");       // Ann:  (empty string, not default)
```

---

## Return value

A function returns control to the caller when it hits a **return** statement or the end of the function. `return expression` returns that value; `return` with no value (or just `return;`) returns `undefined`. A function that does not execute a return implicitly returns `undefined`. Only one value can be returned; to return multiple values, return an object or array. **Important:** Do not put a newline immediately after `return` if you return an expression—JavaScript will insert a semicolon and the function will return `undefined`. Put the expression on the same line or start it with `(` on the same line.

```javascript
function sum(a, b) {
  return a + b;
}
function noReturn() {
  return; // returns undefined
}
```

---

## Function as value: expressions and callbacks

In JavaScript, a function is a **value**. You can assign it to a variable, pass it to another function, or return it. A **function expression** is a function created as part of an expression (e.g. on the right side of `=`). It can be anonymous: `let fn = function() { ... };`. Unlike a function declaration, a function expression is **not** hoisted; the variable is hoisted, but the function is created only when execution reaches that line. So you cannot call it before the assignment. Function expressions are used when you need a function as a value (e.g. passing a callback, or assigning different functions conditionally).

```javascript
let sayHi = function() {
  console.log("Hi");
};
sayHi(); // Hi
```

A **callback** is a function passed into another function to be called later. The receiving function invokes the callback when appropriate (e.g. after an async operation, or when a condition is met). Callbacks are central to event handling, array methods (e.g. `forEach`, `map`), and Node.js-style APIs.

```javascript
function ask(question, onYes, onNo) {
  if (confirm(question)) onYes();
  else onNo();
}
ask("Agree?", () => console.log("Yes"), () => console.log("No"));
```

---

## Function declaration vs function expression

- **Function declaration:** `function name() { ... }`. Hoisted in its scope; can be called before the declaration. Must be a statement (e.g. at top level or inside a block).
- **Function expression:** `let name = function() { ... };` (or inside another expression). Created when execution reaches it; the variable is hoisted but is `undefined` until the assignment. Use when you need the function as a value (callbacks, conditionals, assigning to a variable).

Inside a block, a function **declaration** in strict mode is block-scoped: it is visible only inside that block. So you cannot reliably declare two different functions in different branches of an `if` and use them outside; use a function expression and assign to a variable declared outside the block instead.

---

## Arrow functions (basics)

**Arrow functions** are a concise way to write function expressions. Syntax: `(params) => expression` or `(params) => { statements }`. For a single parameter, parentheses can be omitted: `x => x * 2`. For zero parameters, use empty parentheses: `() => value`. When the body is a single expression (no braces), that expression is **returned** automatically; when you use braces, you must use an explicit `return` to return a value. Arrow functions are expressions, so they are not hoisted and are ideal for callbacks and short inline functions.

```javascript
const double = (n) => n * 2;
const greet = () => "Hello";
const add = (a, b) => {
  let sum = a + b;
  return sum;
};
```

Arrow functions have no own `this` (they inherit `this` from the enclosing scope); they also have no `arguments` object. They are covered in more depth in the ES6+ and Objects topics (e.g. use as methods and `this` binding).

---

## Closures and scope (brief)

A function “closes over” the variables of the scope where it was defined. When the function runs, it sees the current value of those variables at the time it is **called** (for variables that can change), not necessarily the value at the time the function was created. That is why creating callbacks inside a loop can be tricky: if the callback uses the loop variable and runs later, it may see the final value of that variable. Use `let` in a `for` loop so each iteration gets its own binding, or pass the value as a parameter to the callback. An **IIFE** (immediately invoked function expression) `(function() { ... })()` creates a new scope so you can encapsulate variables without polluting the outer scope; modern code often uses block scope with `let`/`const` instead.

---

## Naming and design

Name functions with a **verb** that describes the action: `getUser`, `checkPermission`, `createElement`. One function should do one thing; split complex logic into smaller functions. Short, descriptive names improve readability and make the code self-documenting. Functions that return a boolean are often prefixed with `is`, `has`, or `can`. Avoid naming a function so that it suggests a side effect it does not have (e.g. `getX` should not modify state).

---

## Summary

Functions are created with **declarations** (hoisted, statement) or **expressions** (value, created at runtime). Parameters receive arguments by position; **default parameters** use `=` and apply when the argument is missing or `undefined`. Use **return** to send a value back; avoid a newline between `return` and the expression. Functions are values: they can be assigned, passed as **callbacks**, and returned. **Arrow functions** provide a short syntax for function expressions and inherit `this` from the enclosing scope. Prefer descriptive names and single responsibility for each function.

---

## Further reading

- [javascript.info – Functions](https://javascript.info/function-basics)
- [javascript.info – Function expressions](https://javascript.info/function-expressions)
- [javascript.info – Arrow functions, the basics](https://javascript.info/arrow-functions-basics)
- [MDN – Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
