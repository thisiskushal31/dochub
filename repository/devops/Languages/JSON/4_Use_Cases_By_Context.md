# Use cases by context

JSON appears across the full engineering stack: APIs, configuration, CI/CD, infrastructure, package management, and security. This topic summarizes where and how JSON is used so you can navigate configs, payloads, and tool outputs with confidence. In each context, JSON is chosen because it is a single, well-understood format that tools and languages can parse and validate; knowing the typical shapes helps you read, debug, and automate without guessing.

## APIs and services

REST and GraphQL APIs use JSON for request and response bodies. When you see JSON in this context, the **top-level is usually an object**. Common shapes: a response object with a `data` (or `result`) key holding the payload and sometimes `error`, `message`, or `status`; or a list of resources as an array at top level or under a key like `items` or `results`. Request bodies are typically objects with keys for each parameter or field. OpenAPI (Swagger) describes APIs in JSON or YAML; the schema for request/response bodies is often expressed in JSON Schema. Webhooks and event payloads (e.g. GitHub, Stripe) are typically JSON objects with event type, payload, and metadata. Recognizing that structure—object at top level, named keys for data and errors—helps you navigate any API response or request body.

**Why JSON here.** APIs need a format that every client (browser, mobile, server) can parse and that is easy to debug (readable in logs and network tools). JSON fits both; HTTP typically uses `Content-Type: application/json` and `Accept: application/json`. Validation (e.g. against an OpenAPI schema) ensures clients and servers agree on shape and types.

## Configuration

Many application and tool configs are JSON: `package.json` (Node.js/npm), `tsconfig.json`, `composer.json` (PHP), and app config files. When you see a **config file**, it is almost always a **single top-level object** whose keys are the config sections or options. For example, `package.json` has keys such as `name`, `version`, `description`, `scripts` (object of script name to command string), `dependencies` and `devDependencies` (objects of package name to version range), `main`, `exports`, and so on. Each tool defines its own key set; the structure is always key–value, often with nested objects and arrays. Editors and tooling can use JSON Schema for these formats to provide validation and autocomplete. Config may also be stored in environment-specific JSON files or fetched from a config service that returns JSON. Validate structure where possible and avoid committing secrets into JSON config; use env vars or secret managers and reference them at runtime.

**Why JSON here.** Tools and editors expect a well-defined format; JSON is widely supported and schema-able. Some configs allow comments via JSONC (e.g. `tsconfig.json` in VS Code); the tool strips comments before parsing so the logical format is still JSON.

## CI/CD and pipelines

Pipeline definitions often use JSON or YAML. GitHub Actions workflows are YAML but many internal APIs and job payloads are JSON. When you see JSON in **CI/CD**, it is often: a **job or pipeline config** (top-level object with keys for name, steps, env, artifacts, triggers); **API request/response** from the CI system (e.g. trigger build, get status—again objects with ids, status, logs, timestamps); or **artifact metadata** (lists of files, checksums, URLs). Pipeline status and log metadata are frequently JSON objects with fields like `status`, `started_at`, `finished_at`, `output`, or `logs`. Recognizing these shapes helps you read pipeline config, debug API calls to CI systems, and parse job outputs in scripts.

## Infrastructure and cloud

Terraform state is stored as JSON (or a binary format that can be inspected as JSON). When you open **Terraform state** JSON, the top-level object typically has keys such as `version`, `terraform_version`, `serial`, and `resources` (an array or nested structure of resource objects with type, name, instances, and attributes). Provider schemas and some Terraform config (e.g. `terraform.tfvars.json`) are JSON—again, top-level objects with key–value pairs. **Cloud provider APIs** (AWS, GCP, Azure) use JSON for request and response bodies; responses are usually objects with a mix of metadata and the resource representation. CLI tools often output JSON for scripting (one object per command output). **Kubernetes** manifests are usually YAML but can be JSON; the structure is the same: objects with `apiVersion`, `kind`, `metadata`, `spec`, and sometimes `status`. In DevOps and SRE, recognizing these shapes—version and resource lists in state, apiVersion/kind/metadata/spec in K8s—lets you read and reason about state, plans, and API responses.

**Why JSON here.** State and API responses need a format that scripts and tools can parse reliably; JSON is the common choice. Terraform state is sensitive (resource IDs, sometimes secrets); treat it as confidential and validate before use so automation does not assume a shape that changed.

## Package and dependency management

`package.json` defines a Node.js package: a single object with `name`, `version`, `scripts` (object), `dependencies` and `devDependencies` (objects mapping package names to version strings), and other keys. `package-lock.json` (and similar lockfiles) are larger JSON objects that pin exact versions and dependency trees for reproducible installs; they have a `packages` or `dependencies` structure that mirrors the resolved tree. When you see **lockfile** JSON, you are looking at a snapshot of the dependency graph. Other ecosystems have analogous JSON manifests or lockfiles. Security tooling (e.g. `npm audit`) consumes and produces JSON—often an object with `vulnerabilities`, `metadata`, and arrays of findings. Understanding these structures helps you manage dependencies, debug install issues, and automate audits.

**Why JSON here.** Package managers and tooling need a machine-readable, schema-able format; JSON is universal and allows validators and editors to check structure. Lockfiles are large; streaming or incremental parsing is sometimes used for very large lockfiles, but the format is still one JSON value per file.

## JSON-based standards and protocols

Many standards and protocols in use today are built on JSON: the payload is valid JSON with a defined shape. **JSON:API** (v1.1) is a specification for building REST APIs in JSON; responses use a standard structure with `data`, `included`, `errors`, and `meta`; media type `application/vnd.api+json`. **JSON-LD** (JSON for Linking Data) uses JSON with `@context` and `@id` to represent linked data and structured data on the web; common for SEO and semantic markup. **JSON-RPC 2.0** is a remote procedure call protocol: requests and responses are JSON objects with `jsonrpc`, `method`, `params`, and `id` (and `result` or `error` in responses). **JWT** (JSON Web Token) encodes claims as JSON: the token has three Base64url-encoded parts (header, payload, signature); the header and payload are JSON objects (e.g. `alg`, `typ` in header; `sub`, `exp`, `aud` in payload). **OpenAPI** (Swagger) describes REST APIs in YAML or JSON; request and response bodies are described using JSON Schema. When you encounter these names, the underlying data is JSON; understanding the core format (syntax and structure, earlier in this section) lets you read and validate any of them.

## Security, audit, and compliance

Security scanners, policy engines, and audit logs often output JSON. When you see **scanner or audit output**, it is typically an object with keys like `vulnerabilities`, `findings`, or `results` (often arrays of objects with severity, id, path, message); or a **policy result** object with `allowed`, `denied`, and details. Identity provider **claims** and tokens (when decoded to JSON) are objects with standard claims (e.g. `sub`, `aud`, `exp`) and custom keys. Policy-as-code (e.g. OPA policies or policy results) can be JSON—policies as nested objects and arrays, results as objects with boolean and detail fields. In security and compliance workflows, JSON is the common format for machine-readable findings and reports; validating and handling it safely is part of secure implementation; format-level security is covered later in this section.

**Why JSON here.** Scanners and policy engines need to emit structured output that other tools can consume (e.g. CI gates, dashboards). JSON is the lingua franca; schemas allow consistent parsing and integration. Treat scanner and audit output as potentially sensitive (it may reference assets or findings); parse and validate before use.

## By engineering role

- **Software / backend** — APIs, service config, serialization; validation and schema for contracts.
- **Software / front-end** — API responses, app config, package.json and tooling.
- **DevOps / SRE** — CI config and API payloads, Terraform state and provider output, cloud APIs, pipeline automation.
- **Security / cybersecurity** — Scanner and policy output, audit logs, API payload validation and safe parsing.

**Where implementation lives.** How you *use* JSON in a specific stack—parsing and generating in JavaScript, Python, or Go; wiring it into CI pipelines; or reading Terraform state—is covered in the handbook sections for those technologies. This JSON section explains how JSON works (grammar, semantics, validation, security of the format). For implementation in context, see: **CiCd** (pipelines, job config, API payloads), **IAC** (Terraform state, provider config), **Cloud-Native** (Kubernetes, APIs), **Languages/JavaScript** (package.json, `JSON.parse`/`JSON.stringify`, npm). Format-level security and semantics (duplicate keys, injection when parsed, size/depth) and advanced behavior (numbers, Unicode, I-JSON, variants) are covered later in this section.

---

## Further reading

- [CiCd](../../CiCd/README.md) — Pipeline and job configs, API payloads
- [IAC (Infrastructure as Code)](../../IAC/README.md) — Terraform state, provider config
- [Cloud-Native](../../Cloud-Native/README.md) — Kubernetes, API requests/responses
- [Languages/JavaScript](../JavaScript/README.md) — package.json, npm, JSON in JavaScript
- [JSON:API](https://jsonapi.org/) — API specification built on JSON
- [JSON-LD](https://json-ld.org/) — Linked data in JSON
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification) — RPC protocol using JSON
- [RFC 7519 – JWT](https://datatracker.ietf.org/doc/html/rfc7519) — JSON Web Token
