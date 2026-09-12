# Validation, schema, and tooling

**Parsing** answers: is this text valid JSON? It checks only grammar: balanced brackets, legal tokens, correct escapes. **Validation** answers: does this JSON document match the shape and constraints my application or API expects? It checks structure (required keys, types, formats) and is separate from parsing. A document can parse successfully but fail validation (e.g. wrong type, missing field). Schema-based validation (e.g. JSON Schema) and tooling (validators, formatters, converters) help you enforce structure and keep configs and API contracts consistent.

## Parsing vs validation

- **Parsing:** Apply the JSON grammar to a string or byte stream. Success means the text is well-formed JSON and can be represented as a value (object, array, string, number, or literal). Failure means a syntax error (e.g. trailing comma, unclosed bracket). Parsers do not enforce uniqueness of object keys or semantic rules; they only build the data structure.
- **Validation:** After (or during) parsing, check the resulting value against a schema or a set of rules: required properties, allowed types, string formats (date-time, uri), min/max, enums, etc. Validation catches "wrong shape" or "wrong type" before business logic runs. For untrusted or external input, parse first, then validate, then use the data.

## Why validate

Raw JSON can be well-formed but wrong: missing required fields, wrong types (e.g. a string where a number is expected), or unexpected keys that might be ignored or misused. In APIs and automation, invalid payloads lead to runtime errors or security issues. Validation fails fast with clear errors instead of failing later in business logic. In DevOps, pipeline configs and Terraform state are JSON (or YAML that converts to similar structures); validating before apply or merge reduces broken runs.

## JSON Schema in depth

JSON Schema is a vocabulary for describing the structure and constraints of JSON data. You write a schema (itself JSON) that defines required properties, types, formats (e.g. date-time, uri), min/max length or range, enums, and nested objects and arrays. Validators take a schema and a document and report whether the document conforms and where it does not.

**Core keywords (common across drafts):**

- **`type`** — `string`, `number`, `integer`, `boolean`, `null`, `object`, `array`. Restricts the kind of value.
- **`properties`** — For objects, declares allowed keys and their subschemas.
- **`required`** — Array of property names that must be present in an object.
- **`additionalProperties`** — `false` to forbid keys not in `properties`; or a schema for extra keys.
- **`items`** — For arrays, the schema for each element (or a tuple of schemas).
- **`enum`** — Array of allowed values.
- **`format`** — Hint for string format (e.g. `date-time`, `uri`, `email`); validation depends on the implementation.
- **`minimum`**, **`maximum`**, **`minLength`**, **`maxLength`** — Numeric and string bounds.
- **`$ref`** — Reference another part of the schema (or an external schema) for reuse and composition. The referenced value is substituted in place; use `$ref` to define reusable fragments (e.g. a "user" object) and reference them from multiple places so one change updates all.
- **`pattern`** — For strings, a regular expression that the value must match.
- **`minItems`**, **`maxItems`** — For arrays, the minimum and maximum number of elements.
- **`oneOf`**, **`anyOf`**, **`allOf`** — Combine subschemas: value must match exactly one of, at least one of, or all of the listed schemas.
- **`not`** — Value must not match the given schema.
- **`const`** — Value must equal the given constant (exact match).

Validators typically report errors with a **path** (e.g. `/items/2/name`) and a **message** (e.g. "must be string"). That tells you where in the document the validation failed. Some validators stop at the first error; others collect all errors. Use the path to fix the data or the schema. Schema **drafts** (e.g. draft-04, draft-07, 2019-09, 2020-12) define which keywords and behaviors are available. **JSON Schema 2020-12** is the current stable release; schemas can declare the dialect with `"$schema": "https://json-schema.org/draft/2020-12/schema"`. Newer drafts add keywords such as `prefixItems` (for tuple-style arrays), `$dynamicRef` and `$dynamicAnchor` (for recursive schemas), and separate format vocabularies. Use a validator that supports the draft your API or tooling expects; check your validator's documentation.

**Strict parsing versus lenient.** A strict JSON parser accepts only text that conforms to the grammar: no comments, no trailing commas, no single-quoted strings, no unquoted keys. Some tools offer a "lenient" or "JSONC" mode that allows comments (and sometimes trailing commas) and then strips them before parsing. For interchange and validation, use strict parsing so that what you validate is what the standard grammar defines. If you need comments in config, use a format that supports them (e.g. JSONC) and ensure the pipeline strips them before validation or use a validator that understands that format.

A minimal schema that requires an object with a string `name` and a number `count`:

```json
{
  "type": "object",
  "required": ["name", "count"],
  "properties": {
    "name": { "type": "string" },
    "count": { "type": "number" }
  }
}
```

When validation runs, it always runs on the **parsed** value: first the text is parsed into a value (object, array, etc.), then that value is checked against the schema. If parsing fails, there is nothing to validate; if parsing succeeds but validation fails, you get schema error paths and messages. For untrusted input, the usual order is: parse (and handle parse errors), then validate (and handle validation errors), then use the data. Many languages have libraries and CLI tools that validate files against a schema.

**What validation errors look like.** A validator reports one or more errors, each with a **path** (e.g. JSON Pointer like `/users/2/email`) and a **message** (e.g. "must be string" or "required property 'name' missing"). The path tells you exactly where in the document the constraint was violated. Example: if the schema requires `users` to be an array of objects with a string `name` and the document has `"users": [{"name": "alice"}, {"name": 123}]`, the error might be at path `/users/1/name` with message "must be string". Use these to fix the data or to relax the schema if the data shape is intentional. Some validators also support **strict mode** (e.g. reject unknown keywords in the schema or unknown properties in the data) for maximum consistency.

## When and where to validate

Validate at the **boundary** where data enters your system: API request body before business logic, config file on load or in CI, and file or message from another service before processing. Doing it early fails fast and prevents invalid structure from driving logic or persisting. In **CI/CD**, add a step that validates all config files (e.g. `package.json`, pipeline config, Terraform vars) against their schemas so broken structure is caught before merge or deploy. In **APIs**, return a clear validation error (e.g. 400 Bad Request with a body that includes path and message) instead of a generic error or 500. In **editors**, schema-backed validation gives inline errors and autocomplete; the same schema can be used in CI for consistency. Do not skip validation for "trusted" internal sources if the data is generated by code that might change or if multiple teams produce it—schema acts as a contract.

## Validation in practice

- **APIs** — Validate request bodies and optionally response bodies against a schema so clients and servers agree on shape and types. Publish the schema (e.g. OpenAPI with JSON Schema for bodies) so clients can generate code and validate before sending.
- **Config files** — Validate `package.json`, CI config, or app config against a schema before load; editors and CI can use the same schema for autocomplete and checks. Many tools ship or reference a schema (e.g. `$schema` in config); use it.
- **Automation** — Validate Terraform state or provider output before feeding it into scripts; reject malformed or unexpected structure early so scripts do not assume keys or types that are missing.

## Encoding and size

JSON is UTF-8 by default. For very large payloads, consider size limits and **streaming parsers** that consume input incrementally and emit events (or build a stream of values) instead of loading the whole document into memory. Enforcing a maximum size before parsing helps prevent denial-of-service from huge inputs. Binary formats (e.g. MessagePack) are an alternative when bandwidth or parsing cost matters more than human readability. Streaming vs DOM-style parsing is covered in the Advanced topic.

## JSON vs YAML

YAML is a superset of a restricted subset of JSON for many parsers: valid JSON is often valid YAML. YAML adds comments, unquoted strings, and multi-line literals, which is convenient for config. Kubernetes and many CI systems use YAML; the underlying data model (maps, arrays, scalars) is similar. When you need strict interchange or tooling that expects JSON only, use JSON; when you need human-editable config with comments, YAML is common. Conversion between the two is straightforward for compatible structures.

## Tooling

- **Validators** — Check that text is well-formed JSON (parse-only) or that it conforms to a schema.
- **Formatters / beautifiers** — Pretty-print with indentation for readability; useful for diffing and code review.
- **Linters** — Enforce style (e.g. no trailing commas, quoted keys) where the environment allows.
- **CLI tools** — `jq` and similar let you query and transform JSON from the shell; useful in scripts and pipelines.

Using schema validation in CI (e.g. validate all config files or API fixtures against a schema) keeps structure consistent and catches mistakes before deploy.

---

## Further reading

- [JSON Schema (json-schema.org)](https://json-schema.org/)
- [Ajv – JSON schema validator](https://ajv.js.org/)
- [RFC 8259 – I-JSON and interoperability](https://datatracker.ietf.org/doc/html/rfc8259)
