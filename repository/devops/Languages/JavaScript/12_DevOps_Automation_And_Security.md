# DevOps, automation, and security

JavaScript and Node.js are used for **DevOps** (scripts, CI, tooling), **automation** (file processing, API calls, orchestration), and they introduce **security** concerns in both the browser and on the server. This topic ties the language and runtime to those contexts: how to write scripts that integrate with pipelines, how to handle configuration and failure, and how to mitigate common risks such as XSS, injection, and supply-chain issues.

---

## Scripts and automation with Node

Node is well suited for **automation scripts**: config generation, file transforms, calling external APIs or CLIs, and glue code in CI. Use **process.env** for configuration (e.g. `API_URL`, `NODE_ENV`, `CI`) so the same script works in local and CI without hardcoding. **process.argv** gives command-line arguments; for complex CLI options use a library (e.g. `yargs`, `commander`) or parse `process.argv.slice(2)` for simple cases. Prefer **async/await** and the **fs.promises** API (or **util.promisify**) so scripts do not block and can handle many I/O operations. **process.exit(1)** on error so the process reports failure to the caller (CI, cron, or a parent script); **process.exit(0)** only when the script completed successfully. For scripts that run other programs, prefer **child_process.spawn** or **exec** with an array of arguments (or a single string that is not built from user input); avoid building a command string from variables. Handle **unhandledRejection** if you start async work without awaiting so that promise rejections do not terminate the process silently or with a generic message—at minimum log and exit.

```javascript
const fs = require("fs").promises;
async function main() {
  try {
    const config = process.env.CONFIG_PATH || "./config.json";
    const data = await fs.readFile(config, "utf8");
    // ... use data
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
main();
```

---

## CI and exit codes

In **CI/CD**, Node scripts are often run via **npm run** or directly with **node**. The pipeline interprets the process **exit code**: 0 means success, non-zero means failure. Always exit with a non-zero code when validation fails, tests fail, or a required step errors. Avoid swallowing errors (e.g. empty catch that does not rethrow or exit). Use **npm ci** in CI for installs so dependencies match the lockfile and the build is reproducible. Scripts that run in CI should avoid relying on interactive input; read from **process.env** or config files instead. Common env vars in CI: **CI** (set by many providers), **GITHUB_ACTIONS**, **GITLAB_CI**, etc.; use them to enable stricter checks or skip interactive prompts. Catching at the top level, logging, and then **process.exit(1)** keeps CI logs clear and the pipeline red on failure.

---

## Security: XSS and injection in the browser

**Cross-site scripting (XSS)** occurs when untrusted data is rendered as HTML or script and executed in the user’s browser. Common causes: inserting user input or URL parameters into **innerHTML**, **document.write**, or **eval** without sanitization. **Mitigation**: Prefer **textContent** (or safe text APIs) for user-controlled data. If you must render HTML, use a sanitization library or a framework’s safe templating; never concatenate raw user input into HTML. **Content-Security-Policy (CSP)** headers restrict where scripts and resources can load from and reduce the impact of XSS. Key directives include **script-src** (which script origins are allowed), **default-src** (fallback), and **report-uri** / **report-to** for violation reporting. Strict CSP (e.g. nonce- or hash-based script-src) can block inline scripts and limit the effect of injected HTML. **HttpOnly** and **Secure** cookie flags reduce the chance that stolen cookies are used from script. Avoid **eval**, **new Function** with user input, and inline event handlers (`onclick="..."`) that include unsanitized data.

---

## Security: injection and server-side Node

In **Node.js**, user or external input can lead to **injection** if passed into **eval**, **new Function**, shell commands, or unsanitized SQL. **Mitigation**: Never build code or shell commands by string concatenation with user input. Use parameterized queries for databases; for shell use **child_process.spawn** with an array of arguments (e.g. `spawn('git', ['log', '--', userPath])`) so the runtime does not parse a shell string. If you must use **exec**, do not interpolate user input into the command string. Validate and sanitize all inputs; use allowlists for expected values (e.g. allowed file extensions, action names). Run processes with least privilege; avoid running Node as root. Log and rate-limit sensitive operations to detect abuse.

---

## Security: npm and supply chain

The **npm** ecosystem is a **supply-chain** risk: dependencies (and their transitive dependencies) can be malicious or vulnerable. **Mitigation**: Prefer a minimal dependency set; run **npm audit** and fix (e.g. **npm audit fix**) or document accepted risks. Use **package-lock.json** (or equivalent) and **npm ci** so installs are reproducible and you get the same dependency tree every time. Prefer well-maintained, widely used packages; review critical dependencies (e.g. who publishes them, open issues). In sensitive environments, use private registries or allowlists. Keep Node and npm updated for security fixes. **npm audit** can break the build in CI when run with **--audit-level=high** or similar so new high-severity issues are caught before merge.

---

## Summary

Use **Node** for automation and DevOps scripts: read config from **process.env**, use async I/O and **process.exit(1)** on failure so CI and callers see errors. In the **browser**, avoid XSS by not putting untrusted data into **innerHTML** or **eval**; use **textContent** and CSP. In **Node**, avoid injection by not building code or shell commands from user input; use parameterized queries and safe process spawning. Manage **npm** supply chain with lockfiles, **npm audit**, and minimal, trusted dependencies. These practices apply across front-end, backend, and DevOps use of JavaScript.

---

## Further reading

- [Node.js – Documentation](https://nodejs.org/docs/latest/api/)
- [OWASP – Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- [npm – audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [MDN – Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
