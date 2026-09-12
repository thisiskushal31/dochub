# Node.js, npm, and tooling

**Node.js** is a JavaScript runtime built on the V8 engine. It runs outside the browser and provides APIs for the file system, network, and the OS. **npm** (Node Package Manager) is the default package manager for Node: it installs dependencies, runs scripts, and publishes packages. This topic covers running JavaScript with Node, the module system (CommonJS and ES modules), `process` and environment variables, npm and **package.json**, and how Node is used in DevOps, tooling, and automation.

---

## Node.js runtime

Node executes JavaScript in a single process. It is **non-blocking** and **event-driven**: I/O (files, network) is asynchronous, so the thread is not blocked waiting for results. That allows one process to handle many concurrent operations. Node does **not** provide the browser DOM or `window`; it provides **global** objects such as **process** and (in CommonJS) **require**. Use Node for servers, CLI tools, build scripts, and automation. Run a file with **node script.js** (or **node script.mjs** for ES modules). The **Node REPL** (run `node` with no file) lets you type expressions and run them interactively.

---

## Module system: CommonJS and ES modules

Node supports two module systems. **CommonJS**: **require('module')** loads a module; **module.exports** or **exports** defines what is exposed. This is the default for `.js` files when `package.json` does not set `"type": "module"`. **ES modules**: **import** and **export** syntax; use `.mjs` extension or `"type": "module"` in package.json. In ESM, **import** is top-level only; use **import()** for dynamic loading. **__dirname** and **__filename** are available in CommonJS; in ESM use **import.meta.url** and resolve paths from that. When mixing, ESM can `import` from CJS; CJS cannot use `import` (use `require` or dynamic `import()` where supported).

```javascript
// CommonJS
const fs = require("fs");
module.exports = { foo: 1 };

// ESM (file is .mjs or "type": "module")
import fs from "fs";
export const foo = 1;
```

---

## process and environment

The **process** object is global in Node. **process.env** holds environment variables (e.g. **process.env.NODE_ENV**, **process.env.PATH**). **process.argv** is an array of command-line arguments (first two are `node` and the script path). **process.exit(code)** exits the process (0 for success, non-zero for failure); useful for CLI tools and scripts. **process.cwd()** returns the current working directory. Uncaught exceptions and unhandled promise rejections can be handled with **process.on('uncaughtException')** and **process.on('unhandledRejection')** for logging or graceful shutdown—fix the root cause rather than relying on these.

---

## npm and package.json

**npm** comes with Node. In a project directory, run **npm init** to create **package.json** (or use **npm init -y** for defaults). **package.json** defines the project name, version, **scripts** (e.g. `"start": "node index.js"`, `"test": "node test.js"`), and **dependencies**. Run **npm install** to install dependencies; **npm install &lt;pkg&gt;** adds a dependency and records it in **dependencies**. **npm run &lt;script&gt;** runs a script from the **scripts** section. Lifecycle scripts **pre&lt;name&gt;** and **post&lt;name&gt;** run automatically before and after a script (e.g. `pretest`, `posttest`). **npx &lt;pkg&gt;** runs a package binary without installing it globally (downloads to cache if needed); use for one-off tools or pinned versions: `npx eslint .`. **node_modules** holds installed packages; **package-lock.json** (or **yarn.lock**) locks exact versions for reproducible installs—commit lockfiles so CI and production use the same dependency tree. Use **npm install --save-dev &lt;pkg&gt;** for dev-only tools (e.g. linters, test runners); they go in **devDependencies**. **npm ci** installs from the lockfile only (faster and stricter than `npm install`), suitable for CI.

```json
{
  "name": "my-tool",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "node test.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

---

## Common Node APIs for tooling

**fs** (file system): **fs.readFileSync**, **fs.writeFileSync** for synchronous reads/writes; **fs.promises.readFile**, **fs.promises.writeFile** for promise-based async. Use async in servers and scripts to avoid blocking. **path**: **path.join**, **path.resolve**, **path.basename** for cross-platform paths. **child_process**: **exec** / **execSync** run a shell command and buffer output; **spawn** starts a process with streams (stdout/stderr) and is better for long-running or large output. Use **execSync** for simple one-off commands in scripts; for async use **exec** with a callback or the promise-based **util.promisify(require('child_process').exec)**. Pass **env** and **cwd** when you need a specific environment or working directory. In DevOps scripts, always check the exit code (or promise rejection) and call **process.exit(1)** on failure so CI and callers detect errors. **http** / **https**: create servers or make requests; in practice many projects use **fetch** (available in recent Node) or libraries like **axios**. For DevOps and automation, **fs**, **path**, **process**, and **child_process** are used constantly.

---

## Node in DevOps and automation

Node is widely used for **build tooling** (e.g. Webpack, Vite, ESLint), **CLI tools** (Create React App, Angular CLI, custom scripts), **servers** (APIs, BFFs), and **automation** (scripts that read config, call APIs, or run shell commands). Scripts can read **process.env** for configuration (e.g. `NODE_ENV`, `API_URL`), exit with **process.exit(1)** on failure so CI fails the job, and use **fs** and **path** to process files. Keeping dependencies minimal and using **devDependencies** for build-only packages keeps production installs small. Lockfiles and reproducible installs are important for CI and security.

---

## Summary

**Node.js** runs JavaScript outside the browser with APIs for files, network, and the OS. Use **node script.js** to run a file. **CommonJS** (`require`/`module.exports`) and **ES modules** (`import`/`export`) are both supported; choose one per project or use the appropriate file extension. **process** provides **env**, **argv**, **exit**, and **cwd**. **npm** and **package.json** manage dependencies and scripts; use **npm run** for defined scripts. **fs**, **path**, and **child_process** are core for file and shell operations in tooling and automation. Node is a standard choice for DevOps scripts, build pipelines, and server-side JavaScript.

---

## Further reading

- [Node.js – Getting started](https://nodejs.org/en/docs/guides/getting-started-guide)
- [Node.js – API documentation](https://nodejs.org/docs/latest/api/)
- [npm – documentation](https://docs.npmjs.com/)
- [MDN – Node.js](https://developer.mozilla.org/en-US/docs/Glossary/Node.js)
