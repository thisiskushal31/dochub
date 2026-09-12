# Format-level security and semantics

This topic covers how JSON *behaves* from a security and semantics perspective: parsing and errors, duplicate keys, injection when JSON is interpreted as code, prototype pollution when parsed into JavaScript objects, size and depth, and validation. **Using** JSON in a specific stack (e.g. Node scripts, Python APIs, CI pipelines, Terraform) is covered in the handbook sections for those technologies (CiCd, IAC, Languages/JavaScript, etc.); those sections describe the implementation. Here we focus on the format itself and what to expect when consuming or producing JSON.

**Security and the format.** The JSON format itself does not provide confidentiality, integrity, or authentication. Anyone who can read the channel (e.g. network, file) can read the JSON. Tampering is not detected by the format. Application and transport layers (HTTPS, signatures, auth) are responsible for security. What we cover below is how to *handle* JSON safely: avoid code execution, avoid semantic traps (duplicate keys, depth), and validate untrusted input.

## Parsing and errors

Invalid JSON is a syntax error: the text does not conform to the grammar. Parsers report failure (throw, return error, or set an error state). Always handle parse failures. Unhandled exceptions can crash the process or leak stack traces. When you expose JSON over an API, return a structured error (e.g. 400 Bad Request with a body that describes the problem) rather than a 500 or a raw exception. In scripts and automation, exit with a non-zero code and a clear message so callers and CI know the step failed.

## Duplicate keys and interoperability

Object member names SHOULD be unique; the grammar does not forbid duplicates. Implementations may use last-value-wins, reject the document, or behave differently. When *producing* JSON, use unique keys so all consumers see the same mapping. When *consuming* JSON from others, be aware that duplicate keys can lead to different results across languages and libraries; prefer schema validation that rejects or normalizes duplicates if your validator supports it.

**Why duplicate keys matter for security and reliability.** If an attacker or bug introduces two members with the same key (e.g. `"role": "user"` and later `"role": "admin"`), a last-value-wins parser will expose only the last one. Depending on order of serialization or merge, the effective value can change and lead to privilege confusion or bypass. Conversely, if your application expects last-value-wins and the producer sends duplicate keys with the *same* value for redundancy, a parser that rejects duplicates will fail. For both safety and interoperability, produce and validate for unique keys; when consuming untrusted JSON, treat duplicate keys as a reason to reject or normalize.

## Never parse JSON with eval or equivalent

In JavaScript, passing a string that looks like JSON to `eval()` or `new Function()` is unsafe: the string can contain executable code that runs with your application's privileges. For example, an attacker might send `{"x": 1}; alert(1)` or a payload that includes a function or expression; `eval()` would execute it. Always use the dedicated JSON API (`JSON.parse()` or the language equivalent). The same principle applies elsewhere: use a proper JSON parser, not a generic "execute this text" mechanism. This is a rule for *how* you parse, not a property of the JSON format; it belongs here because misuse leads to code injection when the *content* of the JSON is attacker-controlled.

## Injection and prototype pollution (JavaScript)

If your application merges or copies parsed JSON into existing objects (e.g. with `Object.assign` or a recursive merge), keys such as `__proto__`, `constructor`, or `prototype` can alter the prototype chain and affect every object that inherits from it. An attacker can send JSON like `{"__proto__": {"isAdmin": true}}`; after merge, new objects may inherit `isAdmin`, bypassing checks that only look at "own" properties. That can lead to privilege escalation, bypass of checks, or denial of service. Mitigations:

- Reject or strip dangerous keys (`__proto__`, `constructor`, `prototype`, etc.) before merging or using the object.
- Use schema validation so only allowed properties are accepted.
- Prefer building new objects from the parsed data (whitelist fields) instead of merging untrusted JSON into existing objects.

These concerns apply when JSON is parsed in JavaScript (browser or Node). Other languages have their own deserialization risks; follow their recommended safe patterns.

## Size and depth limits

Very large or deeply nested JSON can exhaust memory or stack. The JSON grammar does not limit size or depth; implementations and policies must. Enforce a **maximum payload size** before parsing when accepting untrusted input so that a single request or file cannot consume all memory. Use parsers that support **depth limits** (maximum nesting level) to avoid **depth bombs**: an attacker sends something like `[[[[[...]]]]]` with thousands of nested arrays, causing the parser to recurse and blow the stack. Similarly, a single huge string or a very long array of numbers can exhaust memory if loaded all at once. Defense in depth: limit size at the gateway or server (e.g. max body size), then use a parser with a depth limit so that even if a large payload is accepted, deep nesting is rejected. For huge files (e.g. state, logs), use streaming or chunked processing where possible; the Advanced topic in this section covers streaming.

## Sensitive data in JSON

Do not log or expose raw request/response bodies that may contain passwords, tokens, or PII. When serializing for logs or debugging, redact sensitive keys (e.g. `password`, `token`, `authorization`, `cookie`). In config, do not store secrets in JSON files in the repo; use environment variables or a secret manager and reference them at runtime. If JSON (or derived data) is reflected in HTML, validate and sanitize to prevent XSS. These are general security practices that apply whenever JSON carries sensitive or user-controlled data. When designing APIs, avoid putting secrets in the URL (use headers or body); in JSON bodies, document which fields are sensitive so that logging and monitoring can redact them.

## Schema validation for untrusted input

When JSON comes from the network, user input, or another service, validate it against a schema (or at least required keys and types) before use. Reject invalid payloads with a clear error. Schema validation reduces the risk of malformed or malicious structure driving logic errors or injection and documents the expected shape for other developers and tooling.

## Implementation in context

How to parse or generate JSON in a given language, how to use it in CI/CD, and how to work with Terraform state or cloud APIs is covered in the handbook sections for those areas. See **Languages/JavaScript** (package.json, `JSON.parse`/`JSON.stringify`), **CiCd** (pipelines, job config), **IAC** (Terraform state, provider config), and **Cloud-Native** (Kubernetes, APIs) for implementation details.

---

## Further reading

- [RFC 8259 – Security Considerations](https://datatracker.ietf.org/doc/html/rfc8259#section-12)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [MDN: JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
