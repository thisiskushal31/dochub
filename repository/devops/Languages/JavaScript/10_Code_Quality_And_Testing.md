# Code quality and testing

Writing maintainable JavaScript requires consistent **coding style**, clear **comments**, and **debugging** skills. **Automated testing** catches regressions and documents behavior; **polyfills** and **transpilers** let you use modern syntax in older environments. This topic covers debugging in the browser, style and comments, testing with Mocha (and the role of other runners), and polyfills/transpilers.

---

## Debugging in the browser

Use the browser **developer tools** (Elements, Console, Sources, Network). In **Sources**, set **breakpoints** by clicking the line number; the execution pauses and you can inspect variables, the call stack, and step over/into/out. **console.log**, **console.table**, **console.dir** help inspect values; **console.trace()** prints the call stack. **debugger** in code triggers a break when devtools is open. Use **Conditional breakpoints** and **Logpoints** to avoid littering code with logs. **Source maps** map minified/bundled code back to original source so you debug the code you wrote. See topic 2 for opening the console and basic usage.

---

## Coding style

Consistent **style** improves readability and reduces review noise. Conventions: **indentation** (spaces or tabs, one per project), **semicolons** (use them or rely on ASI consistently), **line length** (often 80–120), **naming** (camelCase for variables/functions, PascalCase for constructors/classes, UPPER_SNAKE for constants). Put **opening braces** on the same line as the statement (1TBS) or on the next line (Allman); stick to one. Use **ESLint** (or similar) to enforce rules automatically. Style guides (e.g. Airbnb, Standard) codify choices; adopt one and run the linter in CI.

---

## Comments

**Comments** explain why, not what; the code shows what. Use **//** for single-line and **/* */** for multi-line (no nesting). Document **JSDoc** for public APIs: `@param`, `@returns`, `@throws`. Avoid commented-out code; use version control instead. “Ninja code”—clever, dense one-liners—is hard to maintain; prefer clear, readable code over brevity.

---

## Automated testing with Mocha and others

**Unit tests** run in Node or the browser and assert that functions behave as expected. **Mocha** is a test runner: it provides `describe`, `it`, and hooks (`before`, `after`, `beforeEach`, `afterEach`). You pair it with an **assertion library** (e.g. Node’s `assert`, or **Chai**). Tests live in separate files and run via `npm test`. **TDD** (test-driven development) writes tests first, then implementation. Other runners (Jest, Vitest) offer similar describe/it syntax plus built-in assertions and mocking. In CI, run tests on every commit or PR so regressions are caught early.

```javascript
const assert = require("assert");
describe("sum", function () {
  it("adds two numbers", function () {
    assert.strictEqual(sum(1, 2), 3);
  });
});
```

---

## Polyfills and transpilers

**Polyfills** add missing APIs in older runtimes (e.g. `Promise`, `Array.prototype.includes`) by implementing them in JavaScript. Use **core-js** or **polyfill.io** for broad coverage; include only what you need to limit bundle size. **Transpilers** (e.g. **Babel**) convert modern syntax (e.g. ES6+ classes, async/await) to older ES5 so it runs in legacy browsers. Configure Babel with **presets** (e.g. `@babel/preset-env`) and optionally **targets** (browsers or Node version). In build pipelines, source → transpile + polyfill → bundle → output; source maps map output back to source for debugging.

---

## Summary

Use **browser devtools** and **breakpoints** for debugging; **console** and **source maps** for inspection. Adopt a **coding style** and enforce it with **ESLint**. Write **comments** for intent; use **JSDoc** for APIs. **Automated tests** (e.g. Mocha + assert) document behavior and catch regressions; run them in CI. **Polyfills** and **transpilers** let you use modern JavaScript in older environments while keeping the source readable.

---

## Further reading

- [javascript.info – Debugging in the browser](https://javascript.info/debugging-chrome)
- [javascript.info – Coding Style](https://javascript.info/coding-style)
- [javascript.info – Automated testing with Mocha](https://javascript.info/testing-mocha)
- [javascript.info – Polyfills and transpilers](https://javascript.info/polyfills)
- [Mocha – documentation](https://mochajs.org/)
