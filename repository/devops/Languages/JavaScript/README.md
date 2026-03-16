# JavaScript

[← Back to Languages](../README.md)

This section is a **deep dive** into JavaScript: factually correct, standalone, and written so you can go from zero knowledge to using the language in real projects. It answers four things: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized as **concepts first, then use cases**. You learn the basics (what JavaScript is, where it runs, syntax, types, control flow), then functions and objects, then **ES6 and modern JavaScript** (let/const, arrow functions, classes, modules, promises, async/await), then DOM and events, Node.js and npm for tooling, and finally where and how JavaScript is used—front-end, Node.js, DevOps, automation, security, and use cases by engineering role (software engineering, DevOps/SRE, security, cybersecurity). Each topic is self-contained and in-depth. For more depth on any topic, use the links in the Further reading section at the end of each file.

---

## How to read this section

Read in **number order** for a single path: **concepts first**, then **use cases**.

- **Very basic:** What JavaScript is, runtimes (browser, Node), where to run code, first program, syntax.
- **Core language:** Variables (let, const, var), data types, operators, type conversion, conditionals, loops, functions.
- **Objects and OOP:** Objects, properties, methods, this, constructors, prototypes; ES6 classes.
- **ES6+ and modern:** Modules, destructuring, spread/rest, Promise, async/await, optional chaining, nullish coalescing; code quality, arrays, iterables, Map/Set, Date, JSON; advanced functions, prototypes, generators, Proxy/Reflect.
- **DOM and browser:** DOM tree, selecting and modifying elements, events, forms, dimensions, coordinates; UI events, forms, loading; Node.js, npm, package.json.
- **Use cases:** Where JavaScript appears in practice—front-end, Node, DevOps/automation, serverless—and use cases by role (software engineering, DevOps/SRE, security/cybersecurity). Implementation topics (21–24) cover DevOps and security, frames and storage, binary and network, animation and Web Components and regex.

---

## Topic index: aligned with documentation

| Documentation area | Handbook topics |
|--------------------|-----------------|
| **Getting started** | What is JavaScript, runtimes, first steps | 1, 2 |
| **Language basics** | Syntax, structure, exception handling, variables, types, operators, control flow | 3, 4, 5 |
| **Functions and objects** | Functions, objects, this, prototypes, ES6 classes | 6, 7 |
| **ES6+ and modern** | Modules, async (Promise, async/await), code quality, data types (arrays, iterables, JSON), advanced functions, descriptors and prototypes, classes and generators, Proxy/Reflect/eval | 8–15 |
| **DOM and Node** | DOM and events, DOM deep dive, UI events/forms/loading, Node.js and npm | 16–19 |
| **Use cases** | By role (software, DevOps/SRE, security, cybersecurity) | 20 |
| **Implementation** | DevOps and security, frames and storage, binary and network, animation and Web Components and regex | 21–24 |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 | Understand what JavaScript is, where it runs, write a first script. |
| **Core language** | 3 → 5 | Use syntax, variables, types, operators, conditionals, loops, and functions. |
| **Objects and OOP** | 6 → 7 | Work with objects, prototypes, and ES6 classes. |
| **ES6+ and modern** | 8 → 15 | Use modules, Promise, async/await, code quality and testing, arrays/iterables/JSON, advanced functions, prototypes, classes and generators, Proxy/Reflect/eval. |
| **DOM and Node** | 16 → 19 | Manipulate the DOM, handle events, work with forms and UI, use Node.js and npm. |
| **Use cases** | 20 | Apply JavaScript in front-end, Node, DevOps, and security; navigate by role. |
| **Implementation** | 21 → 24 | Apply JS: DevOps and security, frames and storage, binary and network, animation and Web Components and regex. |

---

## Topics

**Structure:** Very basic → Core language → Functions and objects → ES6+ and modern → DOM and Node → Use cases → Implementation.

| # | Topic | File |
|---|--------|------|
| **Very basic** |
| 1 | What is JavaScript? | [1_What_Is_JavaScript.md](./1_What_Is_JavaScript.md) |
| 2 | Environment and where to run | [2_Environment_And_Where_To_Run.md](./2_Environment_And_Where_To_Run.md) |
| 3 | Syntax and structure (including exception handling) | [3_Syntax_And_Structure.md](./3_Syntax_And_Structure.md) |
| 4 | Variables, data types, and operators | [4_Variables_Types_Operators.md](./4_Variables_Types_Operators.md) |
| 5 | Control flow and loops | [5_Control_Flow_And_Loops.md](./5_Control_Flow_And_Loops.md) |
| 6 | Functions | [6_Functions.md](./6_Functions.md) |
| 7 | Objects and ES6 classes | [7_Objects_And_Classes.md](./7_Objects_And_Classes.md) |
| **ES6+ and modern** |
| 8 | ES6+ syntax and modules | [8_ES6_Syntax_And_Modules.md](./8_ES6_Syntax_And_Modules.md) |
| 9 | Async: Promise and async/await | [9_Async_Promise_AsyncAwait.md](./9_Async_Promise_AsyncAwait.md) |
| 10 | Code quality and testing | [10_Code_Quality_And_Testing.md](./10_Code_Quality_And_Testing.md) |
| 11 | Data types: arrays, iterables, Date, JSON | [11_Data_Types_Arrays_Iterables_JSON.md](./11_Data_Types_Arrays_Iterables_JSON.md) |
| 12 | Advanced functions | [12_Advanced_Functions.md](./12_Advanced_Functions.md) |
| 13 | Property descriptors and prototypes | [13_Property_Descriptors_Prototypes.md](./13_Property_Descriptors_Prototypes.md) |
| 14 | Classes (inheritance, mixins) and generators | [14_Classes_Generators.md](./14_Classes_Generators.md) |
| 15 | Proxy, Reflect, Eval, and miscellaneous | [15_Proxy_Reflect_Eval_Misc.md](./15_Proxy_Reflect_Eval_Misc.md) |
| 16 | DOM and events | [16_DOM_And_Events.md](./16_DOM_And_Events.md) |
| 17 | DOM deep dive: walking, properties, dimensions, coordinates | [17_DOM_Deep_Dive.md](./17_DOM_Deep_Dive.md) |
| 18 | UI events, forms, loading, and DOM observers | [18_UI_Events_Forms_Loading.md](./18_UI_Events_Forms_Loading.md) |
| 19 | Node.js, npm, and tooling | [19_Node_NPM_And_Tooling.md](./19_Node_NPM_And_Tooling.md) |
| **Use cases** |
| 20 | Use cases by role | [20_Use_Cases_By_Role.md](./20_Use_Cases_By_Role.md) |
| **Implementation** |
| 21 | DevOps, automation, and security | [21_DevOps_Automation_And_Security.md](./21_DevOps_Automation_And_Security.md) |
| 22 | Frames, windows, and browser storage | [22_Frames_Windows_Storage.md](./22_Frames_Windows_Storage.md) |
| 23 | Binary data and network requests | [23_Binary_Network.md](./23_Binary_Network.md) |
| 24 | Animation, Web Components, and regular expressions | [24_Animation_WebComponents_Regex.md](./24_Animation_WebComponents_Regex.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Software / front-end** | DOM, events, ES6+, UI | 1–19, then 20, 21–24 as needed. |
| **Software / backend (Node)** | Node, npm, modules, async | 1–9, 11, 19, then 20, 21, 23. |
| **DevOps / SRE** | Scripts, npm, automation, tooling | 1–2, 6, 8, 9, 10, 19, then 20, 21. |
| **Security / cybersecurity** | Safe coding, XSS, injection, supply chain | 4, 6, 8, 15, 16, 19, then 20, 21, 22. |

---

## Scope: what's covered and what's not

**Covered:** What JavaScript is, why and how to use it, and where it fits. Syntax, variables, data types, operators, control flow, functions, objects, prototypes, **ES6 and modern JavaScript** (classes, modules, destructuring, spread/rest, Promise, async/await), code quality and testing, arrays and iterables and Map/Set and Date and JSON, advanced functions, property descriptors and prototypes, classes and generators, Proxy/Reflect/eval, DOM and events, UI events and forms and loading, Node.js and npm, and use cases from front-end, backend, DevOps, and security/cybersecurity perspectives. Implementation topics (21–24) cover DevOps and security, frames and storage, binary and network, animation and Web Components and regex. Further reading at the end of each file.

**Not covered in depth here (by design):** Every browser or Node API, and every framework (React, Vue, Angular, etc.), are only introduced or pointed to in Further reading so the section stays focused and navigable.

---

## Further reading

- [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/)
- [The Modern JavaScript Tutorial (javascript.info)](https://javascript.info/)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js documentation](https://nodejs.org/docs/latest/api/)
- [ECMAScript specification (TC39)](https://tc39.es/ecma262/)
