# ES6+ syntax and modules

Modern JavaScript (ES2015/ES6 and later) adds syntax and features that make code shorter, clearer, and easier to structure. This topic covers **rest and spread**, **destructuring**, **template literals**, **optional chaining** and **nullish coalescing**, and **ES modules** (import/export). These features are supported in current browsers and in Node.js and are the basis for most contemporary codebases and tooling.

---

## Rest parameters and spread syntax

**Rest parameters** gather the “rest” of the function arguments into a single array. Put `...paramName` as the last parameter; it receives all remaining arguments as a real array. That avoids using the legacy `arguments` object and makes the signature explicit.

```javascript
function sum(first, ...rest) {
  return first + rest.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6
```

**Spread syntax** uses the same `...` but in a different context: it “spreads” an iterable (e.g. an array or string) into a list of elements. Use it in function calls to pass array elements as separate arguments, or in array/object literals to copy or merge. Only one rest parameter is allowed, and it must be last; spread can be used multiple times in one expression.

```javascript
let arr = [3, 5, 1];
Math.max(...arr);           // 5
let merged = [0, ...arr, 9]; // [0, 3, 5, 1, 9]
let copy = { ...obj };       // shallow copy of obj
```

---

## Destructuring assignment

**Destructuring** unpacks values from arrays or properties from objects into variables.

**Array destructuring:** `let [a, b, c] = arr` assigns the first three elements to `a`, `b`, `c`. You can skip elements with commas, use defaults with `=`, and collect the rest with `...rest`. The right side can be any iterable.

**Object destructuring:** `let { a, b } = obj` assigns `obj.a` and `obj.b` to variables `a` and `b`. Use `{ prop: varName }` to assign to a different variable name, and `= value` for defaults. Nested patterns mirror the structure of the object. Destructuring in function parameters is common for options objects: `function f({ name, age = 0 }) { ... }`. If the whole parameter might be omitted, use a default: `function f({ name } = {}) { ... }`.

```javascript
let [x, , z] = [1, 2, 3];       // x=1, z=3
let { name, age: a = 0 } = user;
function draw({ width = 100, height = 100 } = {}) { ... }
```

---

## Template literals

**Template literals** use backticks and allow **interpolation** with `${expression}`. The expression is evaluated and converted to string. They support multi-line strings without extra syntax. Use them for dynamic strings, SQL or shell snippets (still sanitize inputs), and messages.

```javascript
let name = "Jane";
console.log(`Hello, ${name}!`);
console.log(`Sum: ${1 + 2}`);
```

---

## Optional chaining and nullish coalescing

**Optional chaining** (`?.`) short-circuits when the value before it is `null` or `undefined`: `obj?.prop`, `obj?.[expr]`, `fn?.()`. If the base is nullish, the whole expression is `undefined` instead of throwing. Use it when a property or method might not exist (e.g. API responses, DOM nodes).

**Nullish coalescing** (`??`) returns the right-hand side only when the left is `null` or `undefined`; it does not treat `0` or `""` as “missing.” Use it for defaults: `port ?? 3000`, `title ?? "Untitled"`. It cannot be mixed with `||` or `&&` without parentheses.

```javascript
let name = user?.profile?.name ?? "Guest";
```

---

## ES modules: export and import

An **ES module** is a file that uses `export` and/or `import`. Each module has its own top-level scope; exports are the public API. Modules are evaluated once; the same import returns the same exported bindings. In the browser, load modules with `<script type="module">`; file must be served over HTTP(S). Node.js supports ES modules when the file has `.mjs` or `"type": "module"` in package.json.

**Exporting:** Name exports with `export` before a declaration or with `export { a, b }`. One **default export** per file: `export default expr`; the name is chosen by the importer. Re-export with `export { x } from './mod'` or `export { default as X } from './mod'`.

**Importing:** Named imports: `import { a, b } from './mod'` or `import { a as x } from './mod'`. Default import: `import Name from './mod'`. Namespace: `import * as ns from './mod'`. Side-effect only: `import './mod'`. Imports are hoisted and must be at top level (no conditional imports). **Dynamic import** `import('./module.js')` returns a Promise that resolves to the module namespace object; use it when you need to load a module conditionally or on demand (e.g. code-splitting, feature flags). The path can be a variable. Named vs default: prefer **named exports** for predictability and refactoring; use **default** when a module has a single main export (e.g. a component or class). Re-exports do not make the re-exported bindings available in the current file—they are forwarded only.

```javascript
// lib.js
export const version = "1.0";
export function greet(name) { return `Hello, ${name}`; }
export default class User { }

// app.js
import User, { version, greet } from './lib.js';

// dynamic: load only when needed
const mod = await import('./heavy.js');
```

---

## Module behavior and tooling

Modules run in **strict mode**. Top-level `this` is `undefined`. In the browser, module scripts are **deferred**: they run after the document is parsed and do not block parsing. Cross-origin module scripts require CORS. In production, **bundlers** (e.g. Webpack, Vite) often bundle modules into one or a few files, resolve bare specifiers, and apply tree-shaking and minification; the runtime may not see raw `import`/`export` in the final script.

---

## Summary

**Rest parameters** (`...rest`) collect remaining arguments into an array; **spread** (`...arr` or `...obj`) expands iterables or copies/merges arrays and objects. **Destructuring** unpacks arrays and objects into variables and is often used for parameters. **Template literals** provide interpolation and multi-line strings. **Optional chaining** (`?.`) and **nullish coalescing** (`??`) simplify access and defaults when values may be nullish. **ES modules** use `export` and `import` for a file-based, strict-mode scope; default and named exports support different usage patterns. Use these features for clearer, maintainable code in both browser and Node.js.

---

## Further reading

- [javascript.info – Rest parameters and spread](https://javascript.info/rest-parameters-spread)
- [javascript.info – Destructuring assignment](https://javascript.info/destructuring-assignment)
- [javascript.info – Modules, introduction](https://javascript.info/modules-intro)
- [javascript.info – Export and Import](https://javascript.info/import-export)
- [MDN – JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
