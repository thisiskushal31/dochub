# Clojure — Security, pitfalls, and best practices

[← Clojure README](./README.md)

Secure and maintainable Clojure code follows **data-oriented** design, **immutability** where possible, and **explicit** handling of I/O and state. Common pitfalls include **evaluating untrusted data**, **leaking resources**, **concurrency misuse**, and **unsafe Java interop**. This topic summarizes how to prevent these and adopt good practices.

---

## Security

- **Read and eval:** **read-string** and **eval** can execute arbitrary code. Do **not** read or evaluate **untrusted** input. If you must parse data, use a safe format (e.g. **transit**, **JSON**) and avoid **eval** on user input.
- **Injection:** When building SQL, shell commands, or other interpreted strings, use **parameterized** APIs or **sanitization**. Never concatenate user input into executable strings.
- **Secrets:** Do not put secrets in source or in logs. Use **environment variables**, secret managers, or secure config; restrict access in production.
- **Dependencies:** Keep **deps** and **Leiningen** dependencies up to date. Audit for known vulnerabilities and prefer well-maintained libraries.

---

## Pitfalls to avoid

- **Mutable state:** Prefer **immutable** data and **reference types** (atoms, refs, agents) over **def** for mutable globals. Document where state lives and who updates it.
- **Blocking in agents or wrong ref type:** Do not block inside **send** (use **send-off** for blocking work). Use **refs** for coordinated updates and **atoms** for independent updates; mixing patterns can cause deadlocks or inconsistent state.
- **Lazy sequence retention:** Holding the **head** of a large or infinite lazy sequence prevents GC. Use **doall** to realize when needed, or avoid holding the head.
- **Exception swallowing:** Catch only what you handle; **rethrow** or wrap otherwise. Use **ex-info** and **ex-data** for structured errors and log before rethrowing.
- **Java interop performance:** Use **type hints** on hot paths to avoid reflection. Avoid unnecessary Java object creation in tight loops.

---

## Best practices

- **Pure functions:** Prefer **pure** functions and **explicit** side effects. Test pure logic with unit and property-based tests.
- **Spec or validation:** Validate **inputs and outputs** at boundaries (APIs, DB, messages). Use **spec** or similar to document and enforce shape.
- **Namespaces and structure:** Keep namespaces **focused**; require only what you need. Use **aliases** to keep call sites readable.
- **Documentation:** Use **:doc** and **:arglists** for public functions. Document **invariants** and **concurrency** assumptions where they matter.
- **Testing and CI:** Run **tests** in CI; use **property-based** tests for critical paths. Fail the build on test failure or lint issues.

---

## Further reading

- [Clojure — General recommendations](https://clojure.org/guides/faq)
- [Clojure README](./README.md) — Topic index.
