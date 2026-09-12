# Use cases by role

JavaScript is used in many contexts: front-end, backend, DevOps, and security. This topic maps **roles** to the handbook: what to focus on and in what order, so you can go from zero to effective in your domain.

---

## Front-end and full-stack

**Goal:** Build and maintain browser-based UIs, possibly with a backend in Node.

**Core path:** What JavaScript is and where it runs (1, 2) → syntax, types, operators, control flow (3, 4, 5) → functions and objects (6, 7) → ES6+ and async (8, 9) → **DOM and events** (16). Topics 1–9 give the language; 16 is essential for interacting with the page (selectors, events, delegation, safe content updates). For security (XSS, CSP) and how scripts fit into pipelines, see implementation topic 21. This file (20) ties front-end to other roles.

**Why it matters:** Modern front-ends rely on ES6+ (modules, async/await, optional chaining), the DOM, and events. Understanding types, truthiness, and references (4, 6, 7) avoids subtle bugs; exception handling (3) and async patterns (9) matter for robustness. When debugging, use the browser devtools (2) and strict mode; for production, consider bundling and CSP (21).

---

## Backend and Node.js

**Goal:** Servers, APIs, and server-side logic in Node.

**Core path:** Basics and environment (1, 2) → language core (3–5) → functions and objects (6, 7) → **ES6+ and async** (8, 9) → **Node, npm, tooling** (19). Async (9) and modules (8) are central; 19 covers the runtime, `process`, npm, and common APIs (fs, path, child_process). Implementation topic 21 covers security and automation (input validation, injection, supply chain).

**Why it matters:** Backend code is I/O-heavy; promises and async/await (9) structure that cleanly. Module system (8, 19) and `process.env`/exit codes (19) underpin config and integration with CI and orchestration. For APIs, validate and sanitize input (21); use parameterized queries and avoid building shell or code from user data.

---

## DevOps and SRE

**Goal:** Scripts, CI, tooling, and automation (e.g. config generation, file processing, calling CLIs).

**Core path:** What JavaScript is and where it runs (1, 2) → enough language to read and write scripts: syntax and structure (3), variables and types (4), control flow (5), functions (6). Then **modules and async** (8, 9) and **Node, npm, tooling** (19). **Implementation** topic 21 (DevOps, automation, and security) covers exit codes, env, CI, and safe use of Node and npm.

**Why it matters:** Scripts must fail visibly (exit codes), use env for config, and often call other programs (child_process) or the filesystem (fs, path). Minimal dependencies and lockfiles (19, 21) keep builds reproducible and reduce supply-chain risk. Objects and classes (7) are useful when scripts grow into small tools with config or state; async (9) is needed when calling APIs or doing parallel file work.

---

## Security

**Goal:** Secure coding, review, and understanding attack surfaces in JS and Node.

**Focus:** Data types and type coercion (4) and how they affect validation; functions and scope (6); where user or external data flows. **DOM and events** (16): innerHTML vs textContent, event handlers, and XSS. **Node and npm** (19): process, env, and dependency management. **Implementation** topic 21: XSS, injection, CSP, and npm supply chain.

**Why it matters:** XSS often comes from unsanitized output and unsafe DOM APIs (16); injection from building code or shell from input (21). Supply-chain security (21) ties to how you install and lock dependencies (19). Understanding the language (4, 6) helps spot misuse of eval, Function, or dynamic code (15). Syntax and structure (3) and exception handling help identify paths where errors are swallowed or not reported.

---

## Summary

- **Front-end / full-stack:** Concepts 1–18, use cases 20, implementation 21–24 as needed; DOM and events (16) are central.
- **Backend / Node:** Concepts 1–9, 11, 19; use cases 20; implementation 21, 23; async (9) and Node/npm (19) are central.
- **DevOps / SRE:** Concepts 1–2, 6, 8, 9, 10, 19; use cases 20; implementation 21; Node and automation (19, 21) are central.
- **Security / cybersecurity:** Concepts 4, 6, 8, 15, 16, 19; use cases 20; implementation 21, 22; safe output and input (16, 21) and supply chain (19, 21) are central.

Use the **topic index** in the JavaScript README to jump to a specific concept; use this file to choose a path by role. Structure: **Concepts (1–19)** → **Use cases (20)** → **Implementation (21–24)**. Deepen specific topics via the README and Further reading links.

---

## Further reading

- [javascript.info – Tutorial map](https://javascript.info/tutorial/map)
- [MDN – JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Node.js – Docs](https://nodejs.org/docs/latest/api/)
