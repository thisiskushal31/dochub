# JSON

[← Back to Languages](../README.md)

This section is the place to learn **how JSON exactly works**—from the grammar and semantics to validation, format-level security, and advanced behavior (numbers, Unicode, I-JSON, variants). It answers: **What is JSON?** **Why is it used?** **How can I use it?** **What are the use cases?** You learn the full depth of the format: syntax and structure (including duplicate keys, ordering, edge cases), validation and schema (parsing vs validation, JSON Schema in depth), use cases by context, format-level security and semantics, and advanced topics (number precision, Unicode, I-JSON, JSON5/JSONC/JSON Lines, streaming, MIME, JSON Pointer/Patch). **Implementation**—using JSON in a specific stack (JavaScript, Python, CI/CD, Terraform)—lives in the handbook folders for those technologies (Languages/JavaScript, CiCd, IAC, Cloud-Native). Each topic here is self-contained; for more depth, use the Further reading links at the end of each file.

---

## How to read this section

Read in **number order** for a single path: **basics first**, then **validation and tooling**, then **use cases** and **implementation**.

- **Basics:** What JSON is, why it exists, and how it is used; the standard and how this section covers JSON; implementation in context lives elsewhere.
- **Language:** Syntax and structure in full—grammar, values, objects, arrays, strings, numbers, literals, duplicate keys, ordering, encoding, edge cases.
- **Validation and tooling:** Parsing vs validation, JSON Schema in depth, encoding and size, streaming, JSON vs YAML, tooling.
- **Use cases:** Where JSON appears (APIs, config, CI/CD, infra, packages, security) and by role; where implementation lives (CiCd, IAC, JavaScript, Cloud-Native).
- **Format-level security:** Parsing and errors, duplicate keys, no eval, injection and prototype pollution, size/depth, sensitive data, schema validation; implementation in context in other folders.
- **Advanced:** Number precision, Unicode, I-JSON, JSON5/JSONC/JSON Lines, streaming vs DOM, MIME and extension, JSON Pointer, JSON Patch, JSON Merge Patch, JSONPath, binary encodings (BSON, MessagePack), and JSON-based protocols (JSON:API, JSON-LD, JSON-RPC, JWT).

---

## Topic index

| # | Topic | File |
|---|--------|------|
| 1 | What is JSON? | [1_What_Is_JSON.md](./1_What_Is_JSON.md) |
| 2 | Syntax and structure | [2_Syntax_And_Structure.md](./2_Syntax_And_Structure.md) |
| 3 | Validation, schema, and tooling | [3_Validation_Schema_And_Tooling.md](./3_Validation_Schema_And_Tooling.md) |
| 4 | Use cases by context | [4_Use_Cases_By_Context.md](./4_Use_Cases_By_Context.md) |
| 5 | Format-level security and semantics | [5_Implementation_And_Security.md](./5_Implementation_And_Security.md) |
| 6 | Advanced: numbers, Unicode, I-JSON, variants | [6_Advanced_JSON.md](./6_Advanced_JSON.md) |

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Basics** | 1 → 2 | Understand what JSON is, why it is used, and write valid JSON; know the full grammar and edge cases. |
| **Validation and tooling** | 3 | Distinguish parsing vs validation; use JSON Schema in depth; choose tooling; compare JSON vs YAML. |
| **Use cases** | 4 | See where JSON appears (APIs, config, CI/CD, IAC, security) and where implementation lives. |
| **Format-level security** | 5 | Understand parsing errors, duplicate keys, no eval, injection/prototype pollution, size/depth, validation. |
| **Advanced** | 6 | Number precision, Unicode, I-JSON, JSON5/JSONC/JSON Lines, streaming, MIME, JSON Pointer/Patch. |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Software / backend** | APIs, serialization, schema, validation | 1–6. |
| **Software / front-end** | API responses, config, package.json | 1–5; 6 for numbers/Unicode. |
| **DevOps / SRE** | CI config, Terraform state, cloud APIs | 1–5; 6 for streaming/variants. |
| **Security / cybersecurity** | Safe parsing, injection, validation, audit output | 3, 4, 5. |

---

## Scope: what's covered and what's not

**Covered here:** How JSON works in full depth—syntax and structure (grammar, values, objects, arrays, strings, numbers, duplicate keys, ordering, encoding, edge cases, valid escapes), parsing vs validation, JSON Schema in depth (including 2020-12), use cases by context (including JSON:API, JSON-LD, JSON-RPC, JWT, OpenAPI), format-level security and semantics, and advanced topics (number precision, Unicode, I-JSON, JSON5/JSONC/JSON Lines, streaming vs DOM, MIME, JSON Pointer, JSON Patch, JSON Merge Patch, JSONPath, binary encodings, JSON-based protocols). Further reading at the end of each file.

**Implementation in context (by design):** Using JSON in a specific stack—e.g. `JSON.parse`/`JSON.stringify` in JavaScript, JSON in Python or Go, CI pipeline config, Terraform state, Kubernetes—is covered in the handbook sections for those technologies (Languages/JavaScript, CiCd, IAC, Cloud-Native). Language-specific API reference lives in language docs. This section is the single place for how the JSON *format* itself works so you can read and write JSON agnostic of where it is used.

---

## Further reading

- [Introducing JSON (json.org)](https://www.json.org/json-en.html)
- [RFC 8259 – The JSON Data Interchange Format](https://datatracker.ietf.org/doc/html/rfc8259)
- [ECMA-404 – The JSON Data Interchange Standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
- [MDN: JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [JSON Schema](https://json-schema.org/)
