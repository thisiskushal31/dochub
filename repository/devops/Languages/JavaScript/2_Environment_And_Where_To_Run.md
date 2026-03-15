# Environment and where to run

JavaScript runs in different environments: the browser, Node.js on your machine or a server, or embedded in other applications. This topic covers where you can run code (browser vs Node), how to put script into a web page (inline and external), how to run scripts with Node from the command line, and practical setup: code editors and the developer console. The goal is to get from “zero” to running your first script in at least one environment.

---

## Two main environments: browser and Node.js

**Browser:** JavaScript is built into the browser. You open an HTML file (or a URL) that contains or references a script; the browser loads the page and runs the script. No separate install is needed for the language itself. The script can change the page, react to events, and call browser APIs (e.g. fetch, DOM).

**Node.js:** Node is a JavaScript runtime that runs outside the browser. You install Node on your system, then run a script from the command line (e.g. `node script.js`). Node does not provide the DOM or browser APIs; it provides its own APIs (e.g. file system, network, modules). Node is used for servers, CLI tools, build scripts, and automation—and is common in DevOps and tooling.

For learning the language itself, either environment works. The browser is convenient because you can open an HTML file and see results immediately; Node is convenient for scripts and for running the same code without a browser.

---

## Running JavaScript in the browser

The browser runs JavaScript that is included in the page. There are two main ways to include it.

**Inline script:** Put code inside a `<script>` tag in the HTML. The browser executes that code when it reaches the tag (and when the document is parsed, unless you defer or load it differently).

```html
<!DOCTYPE html>
<html>
<body>
  <p>Before the script...</p>
  <script>
    console.log('Hello, world!');
  </script>
  <p>...After the script.</p>
</body>
</html>
```

**External script:** Put code in a separate file (e.g. `script.js`) and reference it with the `src` attribute. The browser loads and runs that file. One `<script>` tag cannot have both `src` and inline code; if `src` is present, any content inside the tag is ignored.

```html
<script src="script.js"></script>
```

Use external files for anything beyond a few lines: the browser can cache them, and you keep HTML and logic separate. Paths in `src` can be relative (e.g. `script.js`, `js/app.js`) or absolute URLs.

**Script order:** Scripts run in the order they appear in the document. If one script depends on another, the dependency must be included first.

**defer and async.** By default, a `<script>` with `src` is **blocking**: the browser stops parsing the document, downloads and runs the script, then continues. The **defer** attribute makes the script run after the document is parsed, in order with other deferred scripts; **async** allows the script to run as soon as it is downloaded, without waiting for parsing or other scripts. Use `defer` when the script depends on the DOM; use `async` for independent scripts (e.g. analytics). Inline scripts (no `src`) run immediately where they appear; they cannot be deferred or async. **Module scripts** (`<script type="module" src="...">`) are deferred by default and use ES module semantics (import/export, strict mode by default).

**Script load errors.** If an external script fails to load (404, network error), the browser fires an `error` event on the script element; the script’s code does not run. There is no built-in exception from the page’s perspective that you can `try/catch` for "script failed to load"—you handle it with an `onerror` handler on the `<script>` tag or by checking in a later script that a expected global exists. For critical scripts, that pattern is important for robustness.

---

## Running JavaScript with Node.js

With Node.js installed, you run a file from the command line:

```bash
node script.js
```

Node executes the file. There is no DOM or `window`; you have Node’s APIs (e.g. `console`, `require` or `import` for modules, `process`). This is the usual way to run scripts for automation, tooling, or servers. For the rest of the handbook, “run in Node” means: save code in a `.js` file and run it with `node <file>`.

---

## Code editors

You write JavaScript in any text editor. Two common categories:

**IDEs (integrated development environments):** Full-featured editors that work at the project level: many files, navigation, autocomplete across the project, integrated terminal, and often git and debugging. Examples: Visual Studio Code (free, cross-platform), WebStorm (paid). Good for larger projects and when you want one tool for editing, running, and debugging.

**Lightweight editors:** Simpler, often faster to start, good for single files or small tasks. Examples: Sublime Text, Notepad++. Many developers use one lightweight editor and one IDE depending on the task.

Choice is personal and project-dependent. For JavaScript and web development, Visual Studio Code is widely used and supports JavaScript, Node, and the browser out of the box or via extensions.

---

## Developer console (browser)

In the browser, the **developer tools** give you a console where you can see errors and run JavaScript. That is essential for debugging and for trying small snippets.

**Opening the console:** In most browsers (Chrome, Firefox, Edge), press **F12** (or **Cmd+Opt+J** on Mac in Chrome). The tools open, often with the Console tab selected. In Safari, enable the “Develop” menu in preferences first, then use **Cmd+Opt+C** or the menu to open the console.

**What you see:** The console shows messages from your script (e.g. from `console.log`) and **runtime errors** (e.g. a missing variable or a typo in a function name). Clicking the error often jumps to the offending line in the source. Below the messages there is usually a **command line** (prompt) where you can type JavaScript and press Enter to run it. That lets you inspect variables, call functions, or try one-liners without editing the page.

**Multi-line input:** In many consoles, **Shift+Enter** adds a new line instead of running the code, so you can paste or type several lines and then run them together.

**Console methods.** Besides `console.log`, the console provides `console.error`, `console.warn`, `console.info`, and `console.debug` for different severity levels; they often appear with different styling in the console. `console.table` prints arrays or objects as tables. `console.trace()` prints the current call stack. Use these to inspect state and trace execution when debugging. **Strict mode** in the console: some consoles do not enable strict mode by default. To enable it for a snippet, start with `'use strict';` on the first line (e.g. with Shift+Enter for multi-line). **Source maps** allow the console and debugger to map minified or transpiled code back to your original source; they require the build pipeline to emit a source map and the browser to load it.

**Debugging.** Developer tools include a **Sources** (or Debugger) tab where you can set breakpoints, step through code, and inspect variables. When an uncaught exception occurs, the console shows the error and, in many environments, a link to the source location; you can set "pause on exceptions" to stop when any error is thrown. Handling those errors in code is done with `try/catch` and related constructs, covered in the next topic (Syntax and structure, including exception handling).

Using the console and debugger is the standard way to verify that the environment is working and to diagnose script and runtime errors.

---

## Summary

JavaScript can run in the **browser** (via `<script>` inline or with `src` pointing to a file) or in **Node.js** (via `node script.js`). In the browser, scripts run in order and can use the DOM and browser APIs; in Node, they use Node’s APIs and are ideal for scripts and servers. Use a **code editor** (IDE or lightweight) to write code and the browser **developer console** (F12 or equivalent) to see errors and run snippets. Once one of these environments is set up, you can run the examples in the rest of the handbook.

---

## Further reading

- [javascript.info – Hello, world!](https://javascript.info/hello-world)
- [javascript.info – Code editors](https://javascript.info/code-editors)
- [javascript.info – Developer console](https://javascript.info/devtools)
- [W3Schools – JavaScript Where To](https://www.w3schools.com/js/js_whereto.asp)
- [W3Schools – JavaScript Output](https://www.w3schools.com/js/js_output.asp)
- [Node.js – Getting started](https://nodejs.org/en/docs/guides/getting-started-guide/)
