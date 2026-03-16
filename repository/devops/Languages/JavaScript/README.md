# JavaScript

[← Back to Languages](../README.md)

This section is a **deep dive** into JavaScript: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized as **concepts first, then use cases**. You learn the basics (what JavaScript is, where it runs, syntax, types, control flow), then functions and objects, then **ES6 and modern JavaScript** (let/const, arrow functions, classes, modules, promises, async/await), then DOM and events, Node.js and npm for tooling, and finally where and how JavaScript is used—front-end, Node.js, DevOps, automation, and security. Each topic is self-contained and in-depth: the body never attributes content to external sources; explanations come first, then code only when it illustrates the idea. For more depth, use the links in the Further reading section at the end of each file.

**ES6 (ES2015) and later:** Modern JavaScript is covered explicitly—modules, classes, arrow functions, destructuring, spread/rest, Promise, async/await, and related features—so the handbook stays relevant to current practice.

**Sources for scraping:** Links used to build this section are listed in [DevOps-Handbook-Source/Languages/scraped/javascript/javascript_LINKS.md](../../../DevOps-Handbook-Source/Languages/scraped/javascript/javascript_LINKS.md). Primary sources include [W3Schools](https://www.w3schools.com/js/), [javascript.info](https://javascript.info/), [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and [Node.js documentation](https://nodejs.org/docs/latest/api/). Content is added in batches from those sources.

---

## How to read this section

Read in **number order** for a single path: **concepts first**, then **use cases**.

- **Very basic:** What JavaScript is, runtimes (browser, Node), where to run code, first program, syntax.
- **Core language:** Variables (var, let, const), data types, operators, type conversion, conditionals, loops, functions.
- **Objects and OOP:** Objects, properties, methods, `this`, constructors, prototypes; ES6 classes and inheritance.
- **ES6+ and modern:** let/const, arrow functions, template literals, destructuring, spread/rest, modules, Promise, async/await, optional chaining, nullish coalescing, Map/Set, iterators.
- **DOM and runtime:** DOM tree, selecting and modifying elements, events, forms; Node.js, npm, package.json; debugging and tooling.
- **Use cases:** Where JavaScript appears in practice—front-end, Node, DevOps/automation, serverless—and use cases by role (software, DevOps/SRE, security).

---

## Topic index: aligned with documentation

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | What is JavaScript, runtimes, first steps | 1, 2 |
| **Language basics** | Syntax, structure, exception handling (try/catch, throw, custom errors), variables, types, operators, control flow | 3, 4, 5 |
| **Functions and objects** | Functions, objects, this, prototypes, ES6 classes | 6, 7 |
| **ES6+ and modern** | Modules, async (Promise, async/await), destructuring, etc. | 8, 9 |
| **DOM and Node** | DOM, events, Node.js, npm, tooling | 10, 11 |
| **Use cases** | By role, DevOps, security | 12, 13 |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what JavaScript is, where it runs, write a first script. |
| **Core language** | 3 → 5 | Use syntax, variables, types, operators, conditionals, loops, and functions. |
| **Objects and OOP** | 6 → 7 | Work with objects, prototypes, and ES6 classes. |
| **ES6+ and modern** | 8 → 9 | Use modules, Promise, async/await, destructuring, and modern syntax. |
| **DOM and Node** | 10 → 11 | Manipulate the DOM, handle events, use Node.js and npm. |
| **Use cases** | 12 → 13 | Apply JavaScript in front-end, Node, DevOps, and security; navigate by role. |

---

## Topics

**Structure:** Very basic → Core language → Functions and objects → ES6+ and modern → DOM and Node → Use cases. All 13 topics are complete; deepen any topic using the file links and Further reading.

| # | Topic | File |
|---|--------|------|
| **Very basic** |
| 1 | What is JavaScript? | [1_What_Is_JavaScript.md](./1_What_Is_JavaScript.md) |
| 2 | Environment and where to run | [2_Environment_And_Where_To_Run.md](./2_Environment_And_Where_To_Run.md) |
| **Core language** |
| 3 | Syntax and structure (including exception handling) | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Variables, data types, and operators | [4_Variables_Types_Operators.md](./4_Variables_Types_Operators.md) |
| 5 | Control flow and loops | [5_Control_Flow_And_Loops.md](./5_Control_Flow_And_Loops.md) |
| **Functions and objects** |
| 6 | Functions | [6_Functions.md](./6_Functions.md) |
| 7 | Objects and ES6 classes | [7_Objects_And_Classes.md](./7_Objects_And_Classes.md) |
| **ES6+ and modern** |
| 8 | ES6+ syntax and modules | [8_ES6_Syntax_And_Modules.md](./8_ES6_Syntax_And_Modules.md) |
| 9 | Async: Promise and async/await | [9_Async_Promise_AsyncAwait.md](./9_Async_Promise_AsyncAwait.md) |
| **DOM and Node** |
| 10 | DOM and events | [10_DOM_And_Events.md](./10_DOM_And_Events.md) |
| 11 | Node.js, npm, and tooling | [11_Node_NPM_And_Tooling.md](./11_Node_NPM_And_Tooling.md) |
| **Use cases** |
| 12 | DevOps, automation, and security | [12_DevOps_Automation_And_Security.md](./12_DevOps_Automation_And_Security.md) |
| 13 | Use cases by role | [13_Use_Cases_By_Role.md](./13_Use_Cases_By_Role.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Front-end / full-stack** | DOM, events, ES6+, frameworks (concepts) | 1–11, then 12, 13. |
| **Backend / Node** | Node.js, npm, modules, async | 1–9, 11, 12, 13. |
| **DevOps / SRE** | Node for scripts, npm, automation, tooling | 1–2, 6, 8, 9, 11, 12, 13. |
| **Security** | Safe coding, XSS, injection, supply chain (npm) | 4, 6, 8, 10, 11, 12, 13. |

---

## Scope: what's covered and what's not

**Covered:** What JavaScript is, why and how to use it, and where it fits. Syntax, variables, data types, operators, control flow, functions, objects, prototypes, **ES6 and modern JavaScript (classes, modules, destructuring, spread/rest, Promise, async/await)**, DOM and events, Node.js and npm basics, and use cases from front-end, backend, DevOps, and security perspectives. No attribution in the body; further reading at the end of each file.

**Not covered in depth here (by design):** Every browser or Node API, and every framework (React, Vue, Angular, etc.), are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Further reading

- [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)
- [The Modern JavaScript Tutorial (javascript.info)](https://javascript.info/)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [ECMAScript specification (TC39)](https://tc39.es/ecma262/)
