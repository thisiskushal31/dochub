# What is JavaScript?

JavaScript is a programming language that was created to add behavior to web pages. Programs written in it are called **scripts**: they are delivered and run as plain text and do not require a separate compile step. Today JavaScript runs not only in the browser but on servers, in tooling, and on many devices that have a **JavaScript engine**. This topic answers what the language is, why it exists, where it runs, and how it fits into the broader engineering picture—from basics for someone with no prior exposure to the role it plays in front-end, backend, and DevOps.

---

## What is JavaScript?

JavaScript was designed to make web pages interactive. Scripts are typically embedded in or linked from HTML and run when the page loads (or when events occur). The language is **interpreted**: the engine reads the source and executes it. In practice, modern engines also compile code to machine code for speed, but from the developer’s perspective there is no separate “compile” step; you edit text and the environment runs it.

The name “JavaScript” is historical; the language is not a variant of Java. It has its own standard, **ECMAScript**, which defines the syntax and core behavior. Implementations (browser engines, Node.js) follow this standard and add environment-specific APIs (e.g. DOM in the browser, `fs` in Node). The standard is versioned (ES3, ES5, ES2015/ES6, ES2016–ES2024, etc.); new features are added over time (e.g. `let`/`const`, arrow functions, classes, modules, `async`/`await`). Engines support a certain set of features; "ES6 support" or "ES2020" refers to which part of the standard is implemented. For very old environments you may need to transpile (e.g. Babel) or polyfill.

---

## Scripts and execution

A script is just text. You write it in a file or inside a `<script>` tag in HTML. The engine parses the text, compiles or interprets it, and runs it. That makes iteration fast: change the code, reload (or rerun), and see the result. There is no separate binary to build or ship; the same script can run in any environment that supports the same ECMAScript version and the APIs you use (e.g. DOM, Node modules).

---

## Where JavaScript runs: the engine

JavaScript runs wherever a **JavaScript engine** is available. The engine is the program that reads your script and executes it. Different environments ship different engines:

- **Browsers:** Chrome, Edge, and Opera use **V8**; Firefox uses **SpiderMonkey**; Safari uses **JavaScriptCore** (also called Nitro). The engine is built into the browser; you do not install it separately.
- **Node.js:** Uses V8. It provides a command-line and API so you can run JavaScript on the server or on your machine for scripts and tools.
- **Other:** Many embedded and desktop runtimes (e.g. Electron, some IoT stacks) embed an engine so JavaScript can control the host application.

Knowing the engine name (e.g. V8) helps when reading documentation or compatibility notes: support for a feature is often stated per engine.

**How the engine runs your code.** The engine does not just "interpret" line by line in the naive sense. It **parses** the source into a syntax tree, then **compiles** (often to bytecode or directly to machine code) and **optimizes** hot paths (JIT). So execution is fast; the developer still writes source and runs it without a separate build step. Errors can be **parse-time** (invalid syntax; the script never runs) or **runtime** (valid syntax but something goes wrong during execution, e.g. a missing variable or a thrown exception). Only runtime errors can be caught with `try/catch`; parse-time errors cannot be handled from inside that script.

**Single-threaded execution and the event loop.** JavaScript runs one block of code at a time on a single thread. When you wait for I/O (e.g. a network response, a timer), the engine does not block the thread; it registers a callback and continues. When the I/O completes, the callback is scheduled to run. The **event loop** is the mechanism that takes tasks from a queue and runs them one after another. So asynchronous behavior (timers, fetch, promises) is cooperative: no threads, but non-blocking. That has implications for exception handling (errors in a callback run in that callback’s turn; they are not caught by a `try/catch` that wrapped the call that *scheduled* the callback).

---

## What in-browser JavaScript can do

In the browser, JavaScript can:

- **Change the page:** Add, remove, or modify HTML and CSS; change text, attributes, and styles.
- **React to the user:** Run code in response to clicks, key presses, form input, and other events.
- **Talk to the server:** Send and receive data over the network (e.g. fetch, XMLHttpRequest) so the page can update without a full reload.
- **Remember data on the client:** Use storage APIs (e.g. `localStorage`, `sessionStorage`, cookies) within the limits imposed by the browser.

So in-browser JavaScript is focused on the page, the user, and the server the page came from. It is a “safe” language in the sense that it does not give arbitrary low-level access to the machine; the engine and the browser restrict what scripts can do.

---

## What in-browser JavaScript cannot do

Browsers restrict JavaScript to protect the user. Common limitations:

- **No arbitrary file access:** Scripts cannot read or write the file system unless the user explicitly chooses a file (e.g. file input or drag-and-drop). They cannot run other programs on the machine.
- **Same-origin policy:** A script from one origin (scheme, host, port) generally cannot access content or data from another. For example, a page from `https://example.com` cannot read the content of a tab open to `https://mail.example.org` unless the two agree (e.g. via CORS or postMessage). This prevents one site from stealing data from another.
- **Cross-origin network:** A page can request its own origin easily; requesting other origins is restricted unless the other server allows it (e.g. with CORS headers).
- **Hardware:** Access to camera, microphone, or other devices requires explicit user permission; scripts cannot turn them on in the background without the user’s consent.

These limits apply to JavaScript running in the browser. In other environments (e.g. Node.js on a server), different rules apply: the process can access the file system and network as allowed by the OS and the program.

**Security from an engineering perspective.** In-browser JavaScript is a common attack surface. **Cross-site scripting (XSS)** occurs when untrusted data is inserted into the page and executed as script; mitigation involves escaping output, Content-Security-Policy headers, and avoiding `eval` or innerHTML with user input. **Injection** (e.g. into `eval`, `new Function`, or DOM APIs) can run arbitrary code. Same-origin policy and CORS constrain cross-origin data and scripts. When you use JavaScript for DevOps tooling or Node backends, the same language rules apply, but the process has OS-level access, so dependency supply chain (npm), input validation, and least privilege matter for security.

---

## What makes JavaScript widely used

Several factors explain its widespread use:

- **Default in browsers:** Major browsers support JavaScript and run it by default. No extra runtime or plugin is needed for basic use.
- **Single language for the page:** HTML structures the page, CSS styles it, and JavaScript controls behavior. For client-side behavior, JavaScript is the standard.
- **One language, many environments:** The same language and much of the same syntax run in the browser, on the server (Node.js), and in many tooling and automation contexts. That reduces context-switching and allows code sharing (e.g. shared validation or utilities).
- **Large ecosystem:** npm and the browser provide a huge set of libraries and frameworks for building UIs, APIs, and tools.

So JavaScript is used for front-end UIs, for server-side and serverless backends, for build and DevOps tooling, and for scripting and automation—all with the same core language.

**When to use browser vs Node.** Use the **browser** when the goal is to drive a web page: UI, user interaction, and talking to your own (or third-party) APIs. Use **Node.js** when the goal is to run scripts on a machine or server: file system, processes, long-running services, or CLI tools. The same language and many of the same patterns (promises, async/await, modules) apply in both; the difference is the set of globals and APIs (e.g. `window` and `document` vs `process` and `require`). Hybrid setups (e.g. Electron, React Native) expose a subset of APIs so one codebase can target different environments.

---

## Languages that compile or transpile to JavaScript

The syntax and semantics of JavaScript do not fit every team or every problem. Many languages **transpile** (compile) to JavaScript so that code runs in the same environments (browser, Node) while the developer writes in another language. Examples:

- **TypeScript:** Adds static types and stricter tooling on top of JavaScript; compiles to JavaScript. Common in large front-end and Node projects.
- **CoffeeScript, Dart, Kotlin/JS, and others:** Offer different syntax or features and compile to JavaScript for the web.

Even when using such a language, understanding JavaScript is important: the runtime is JavaScript, debugging often involves generated JS, and interoperability with existing JavaScript libraries is central.

---

## Summary

JavaScript is a scripting language created for the web and now used in browsers, on servers, and in tooling. Scripts are plain text and are executed by a JavaScript engine (e.g. V8, SpiderMonkey). In the browser, JavaScript can manipulate the page, handle events, and talk to the server, but it is restricted by the same-origin policy and security rules. Its position as the default browser language and its use in Node.js and elsewhere make it relevant across software engineering, DevOps, and security. Other languages that transpile to JavaScript (e.g. TypeScript) rely on this same runtime and ecosystem.

---

## Further reading

- [javascript.info – An Introduction to JavaScript](https://javascript.info/intro)
- [W3Schools – JavaScript Introduction](https://www.w3schools.com/js/js_intro.asp)
- [MDN – JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript specification (TC39)](https://tc39.es/ecma262/)
