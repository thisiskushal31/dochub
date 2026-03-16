# Advanced JSON: numbers, Unicode, variants, and interoperability

Beyond the core grammar, several aspects of JSON affect how data is interpreted across systems: number precision, Unicode handling, interoperability profiles (I-JSON), and common variants (JSON5, JSONC, JSON Lines). Understanding these lets you write and consume JSON that behaves predictably and avoids subtle bugs when data crosses language or service boundaries.

**What JSON does not allow.** To avoid ambiguity and keep the format minimal, JSON deliberately omits many features that programming languages have. There are **no comments** (no `//` or `/* */`). There are **no trailing commas** in arrays or objects. **No single-quoted strings**; only double-quoted. **No unquoted keys**; object names must be double-quoted strings. **No hex or octal numbers** (e.g. `0xff`, `0o77`); only decimal. **No** `undefined`, **no** `NaN`, **no** `Infinity`; only `true`, `false`, and `null` as literals. **No** `Date`, **Map**, **Set**, **BigInt**, or function values; dates and other types are represented by convention (strings, numbers). **No object references or identity**—JSON is a tree; there is no way to express "this object appears again here." **Cyclic (circular) structures**—where an object references itself directly or indirectly—cannot be represented. When you try to serialize such a structure to JSON, the operation fails (or must be handled by the producer, e.g. by omitting or replacing the repeated reference). **No** multiple top-level values; one document is one value. **No** invalid escape sequences in strings; only `\"` `\\` `\/` `\b` `\f` `\n` `\r` `\t` and `\uXXXX` are valid (syntax is covered earlier in this section). Extensions (JSON5, JSONC) add some of these for convenience but are not JSON.

## Number precision and interoperability

JSON does not define a range or precision for numbers. In practice, many languages map JSON numbers to **IEEE 754 double-precision** floating point (64-bit). That representation has about 15–17 significant decimal digits. Not every integer is representable: the **safe integer range** is ±(2^53 − 1), i.e. ±9007199254740991 (the interoperable range [−(2^53)+1, (2^53)−1]). The integer 9007199254740992 exists in JSON text but when parsed to a double it may become 9007199254740992 or 9007199254740990 depending on the implementation; 9007199254740993 often rounds to 9007199254740992. So IDs, timestamps, or counts beyond the safe range can change after parse–serialize–parse. Decimals with many digits also lose precision: 0.1 + 0.2 in double is not exactly 0.3, and financial or scientific values that must be exact should not rely on JSON number literals alone.

**Why this matters.** When IDs, timestamps, or financial values cross system boundaries, precision loss can cause wrong lookups, off-by-one bugs, or audit errors. APIs that accept or return large integers (e.g. Twitter-style IDs, blockchain values) often use string representation so every consumer gets the exact value. Financial and scientific applications use strings or agreed decimal formats rather than raw JSON numbers.

**Strategies for exact values:** (1) Send large integers as **strings** (e.g. `"9007199254740993"`) and parse on the receiver into a big-integer type. (2) Use a profile such as **I-JSON** that states receivers need not preserve integers beyond 2^53, so producers use strings for exact values. (3) For decimals, use string representation (e.g. `"123.45"`) or a decimal type and agree on format; some APIs use objects with a decimal representation (e.g. `{"value": "123.45", "scale": 2}`). (4) When generating JSON from application numbers, check whether the value is within the safe range (or is a decimal that must be exact) and serialize accordingly (string or number). This is especially important for APIs used by JavaScript or other double-based runtimes.

## Unicode and encoding in depth

JSON text must be **UTF-8** for interchange. The entire document—including every string value and every key—is a sequence of UTF-8 bytes. No other encoding is mandated for interchange; using UTF-8 ensures that any JSON produced by one system can be read by another without charset negotiation. A **byte order mark (BOM)** at the start (U+FEFF encoded as EF BB BF in UTF-8) is not required; if present, parsers may strip or ignore it so the logical content is unchanged.

**Strings and code points.** A JSON string is a sequence of Unicode code points. On the wire it is encoded in UTF-8: ASCII (U+0000–U+007F) is one byte per character; code points in the rest of the BMP (U+0080–U+FFFF) are typically two or three bytes; code points above U+FFFF (e.g. many emoji, U+1F600) are encoded as four bytes in UTF-8. Inside the JSON text, such a character can also be written with **escape sequences**: `\uXXXX` (exactly four hex digits) encodes one UTF-16 code unit. Code points above U+FFFF are represented in UTF-16 as a **surrogate pair** (high surrogate U+D800–U+DBFF, low surrogate U+DC00–U+DFFF). In JSON you write them as two consecutive `\u` escapes, e.g. `\uD83D\uDE00` for U+1F600. Some parsers support `\u{1F600}` (one to six hex digits) as an extension; that is not part of the core JSON grammar.

**Normalization.** Unicode defines multiple ways to represent the same character (e.g. precomposed é vs e + combining acute). **NFC** (canonical composition) and **NFD** (canonical decomposition) are the most common normalization forms. JSON does not require or define normalization. Two strings that are canonically equivalent but differently normalized compare as different at the byte level, so hashes, signatures, and string equality can differ across systems. For identifiers, keys, or comparison-sensitive use, normalize (e.g. to NFC) before serialization or after parsing and stick to one form.

**U+2028 and U+2029.** The characters U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR) are valid inside a JSON string and in key names. In older JavaScript, they were not allowed in string literals, so a string containing them could break when passed to `eval`. Strict `JSON.parse()` and modern JavaScript handle them correctly. If you support very old runtimes or non-compliant parsers, be aware; otherwise treat them as normal Unicode.

**Why Unicode and normalization matter.** When JSON is used for identifiers (e.g. usernames, keys in APIs), two strings that look the same but use different Unicode representations (e.g. é as one code point vs e + combining accent) will compare as different and can break lookups or deduplication. For consistency, normalize (e.g. to NFC) before storing or comparing. When generating or parsing JSON that may be signed or hashed, normalization ensures the same logical content produces the same bytes across systems.

## I-JSON

**I-JSON** (Internet JSON) is a restricted profile of JSON for maximum interoperability. It does not change the grammar; it adds constraints on how JSON is used so that implementations (especially across languages and runtimes) get predictable results.

- **Encoding:** UTF-8 only. No other charset; no BOM required.
- **Numbers:** Senders must not expect receivers to preserve exact value for integers whose absolute value exceeds 2^53 − 1 (i.e. 9007199254740991; the interoperable range is [−(2^53)+1, (2^53)−1]). Many runtimes (e.g. JavaScript) use IEEE 754 doubles, so larger integers can round. I-JSON makes this explicit: use strings for exact big integers, or accept possible rounding.
- **Object uniqueness:** Object member names should be unique. Duplicate keys lead to implementation-defined behavior; I-JSON aligns with "unique keys only" so all implementations agree on the mapping.
- **Top-level:** An I-JSON message should be a single **object** or **array**, not a bare number, string, or literal. That allows protocols to add members (e.g. for extensibility or versioning) and receivers to follow a **Must-Ignore** policy: unknown keys are ignored rather than causing failure. Bare primitives do not have "keys," so they do not support that pattern.
- **Dates and times:** I-JSON uses a standard date-time format (e.g. `"2025-03-08T12:00:00Z"`). That avoids locale or format ambiguity and matches common API practice.

Protocols that need reliable cross-language behavior (e.g. security tokens, federation, or multi-implementation APIs) often specify I-JSON or similar constraints. When designing a new protocol that uses JSON, stating "I-JSON" or listing these constraints in the spec reduces interoperability surprises. **When to care:** Use I-JSON (or document the same constraints) when your JSON is consumed by multiple languages or runtimes, when you sign or verify payloads (deterministic parsing matters), or when you need predictable behavior for numbers and keys across the ecosystem.

## JSON variants and related formats

**JSON5** extends JSON with features that are invalid in strict JSON: **comments** (single-line `//` and block `/* */`), **trailing commas** in arrays and objects, **unquoted object keys** when they are valid identifiers, **single-quoted strings**, **leading decimal point** (e.g. `.5`) and **trailing comma after decimal** (e.g. `1.`), **hex numbers** (`0xff`), and **Infinity** and **NaN**. It is not valid JSON; parsers must be JSON5-aware. Used in config and tooling (e.g. Babel, tsconfig) where human readability matters more than strict interchange. If you send JSON5 over an API that expects strict JSON, it will fail unless the receiver accepts JSON5.

**JSONC** (JSON with Comments) is JSON plus **line** (`//`) and **block** (`/* */`) comments only. Used by VS Code (e.g. `tsconfig.json`, `launch.json`) and other editors. Stripping comments yields valid JSON, so you can preprocess before validation or sending to a strict parser. Not a separate standard; behavior (e.g. whether trailing commas are allowed) is tool-dependent. Often the same as "JSON with comments" in editor docs.

**JSON Lines** (NDJSON, `.jsonl`): a text format where **each line** is a complete, valid JSON value. Lines are separated by newline (`\n`); CRLF is often accepted. The file as a whole is not one JSON document—it is a **sequence of JSON texts**. Empty lines are typically skipped or treated as invalid depending on the tool. Used for logs (one event per line), bulk export (one record per line), streaming (process line-by-line without loading the whole file), and append-only datasets (new lines can be added without rewriting). File extension `.jsonl` is common; `.ndjson` is also used. MIME type `application/jsonl` or `application/x-ndjson` appears in practice but is not yet standardized.

**JSON Text Sequence** is a streaming format where each record is a **UTF-8–encoded JSON text** preceded by the ASCII **record separator** (U+001E, byte 0x1E) and terminated with **line feed** (U+000A, byte 0x0A). Records can be concatenated; the record separator and newline unambiguously delimit them. Used in streaming protocols where multiple JSON values are sent in one byte stream. Unlike JSON Lines, the delimiter is a control character, not newline, so newlines inside JSON values do not break parsing.

**JSONB** (e.g. in PostgreSQL) and similar: **binary or optimized storage** representations of JSON. The logical structure (objects, arrays, primitives) is the same as JSON; the database stores it in a binary or indexed form for efficient querying and storage. They are not a different text format; when you query or export, you typically get back standard JSON. Useful to know when you see "JSONB" in a schema or API: it is still JSON at the value level.

**When to use which.** Use **strict JSON** when you exchange data between systems, use APIs, or need a single standard. Use **JSON5** or **JSONC** when you write config by hand and want comments or trailing commas; ensure your pipeline strips or accepts them before validation or sending to strict consumers. Use **JSON Lines** when you have a sequence of records, need to append without rewriting, or want to stream one record at a time. Use **JSON Text Sequence** when a protocol or tool explicitly requires it for streaming. Do not mix: a JSON Lines file is not a single JSON document; a single JSON document is not multiple values.

## Round-trip and what can be lost

**Round-trip** means: take a value, serialize it to JSON text, then parse that text back into a value. Ideally the result would equal the original. In practice, several kinds of information can be lost or changed.

**Number precision:** Integers beyond the safe range (e.g. in JavaScript, ±(2^53 − 1)) may round when parsed to a double; decimals with many digits lose precision. After parse–serialize–parse, the number may differ. **Key order:** The JSON grammar defines objects as unordered. Many parsers preserve insertion order; serializers may output keys in that order or in an arbitrary order. If you rely on key order (e.g. for signing or diffing), use a serializer that guarantees stable order (e.g. alphabetical) and a parser that preserves it. **Duplicate keys:** If the original had duplicate keys, after parse (e.g. last-wins) and re-serialize you only get one; the others are lost. **Whitespace:** Insignificant whitespace between tokens is not preserved; only the logical value matters. **Circular references:** A structure that references itself (directly or indirectly) cannot be serialized to JSON at all—the serializer would recurse indefinitely. It will throw or hang unless you use a custom replacer that breaks the cycle (e.g. omit repeated references, or substitute a placeholder). **Types:** Values that have no JSON equivalent (e.g. `undefined`, a Date, a function, a Map, a Symbol) must be represented by convention (string, number, or omitted); round-trip then requires custom replacer/reviver logic or a convention like extended JSON (e.g. `{"$date": "2025-03-08T00:00:00Z"}`).

**When exact round-trip matters** (e.g. signing, canonicalization, or storing and restoring state), define what is significant: key order, no duplicate keys, big numbers as strings, dates in a fixed string format. Use a serializer and parser that preserve those choices. Some ecosystems define **canonical JSON** or **deterministic serialization** (e.g. sorted keys, fixed number formatting) for signing and comparison. If two systems must produce identical bytes for the same logical value (e.g. for digital signatures or content-addressable storage), they must agree on encoding, key order, number formatting, and handling of optional whitespace.

## Streaming vs DOM-style parsing

**DOM-style** (or tree) parsing reads the entire input and builds an in-memory tree (objects, arrays, primitives). You get random access to any part of the document. Memory use is proportional to **document size**: a 100 MB JSON file typically needs on the order of 100 MB (or more, depending on language and object overhead). Simple and convenient for small or medium documents; for very large or unbounded inputs it can exhaust memory or cause long pauses. Use DOM-style when the document fits in memory and you need to navigate or transform the whole structure.

**Streaming** (or SAX-style, or event-based) parsing reads input incrementally and emits **events** as it goes (e.g. start object, key, value, end object, start array, end array). The application handles each event and can discard or aggregate data without holding the whole document. Memory use is proportional to **nesting depth** and the amount of data the application keeps, not the total document size. For very large or unbounded inputs (e.g. multi-GB logs, bulk export, or a long-lived connection sending many values), streaming avoids out-of-memory failures and can start producing results before the entire input is read. Use streaming when document size is large or unknown, or when you only need to extract or aggregate parts of the document.

**Partial input and chunk boundaries.** JSON is defined on **complete texts**. When parsing from a stream (e.g. network chunks), **partial input** causes parse errors: a UTF-8 multibyte character split across two chunks, or a number or string token cut in the middle, is invalid. Streaming parsers must **buffer** input until a complete token or value is available, then feed it to the grammar. If the stream ends in the middle of a value, the parser should report an error (e.g. "unexpected end of data"). Backpressure (slowing down the producer when the consumer is slow) is an implementation concern; the format does not define it. When you implement or use a streaming JSON parser, ensure it handles chunk boundaries and incomplete UTF-8 sequences correctly.

**When to choose streaming vs DOM.** Use DOM-style when the document fits in memory and you need random access or the full structure (e.g. config, typical API response). Use streaming when the document is large or unbounded (logs, bulk export, long-lived connection), when you only need a subset of the data, or when you must avoid loading the whole payload into memory for security or resource reasons.

## MIME type, charset, and file extension

The standard MIME type for JSON is **`application/json`**. JSON must be UTF-8 for interchange, so the charset is implicit; `application/json; charset=utf-8` is redundant but sometimes used for clarity. When serving JSON over HTTP, **`Content-Type: application/json`** is sufficient. Clients that request JSON (e.g. with **`Accept: application/json`**) can use this to select the representation. Other JSON-based formats use their own media types: **`application/json-patch+json`** for JSON Patch, **`application/merge-patch+json`** for JSON Merge Patch, **`application/vnd.api+json`** for JSON:API. Using the correct media type allows intermediaries and clients to dispatch correctly.

The common **file extension** for a JSON document is **`.json`**. For **JSON Lines**, **`.jsonl`** or **`.ndjson`** is used; MIME type **`application/jsonl`** or **`application/x-ndjson`** appears in practice but is not yet standardized in the IANA registry. For **JSONC** (JSON with comments), some tools use **`.jsonc`**; the content is not valid JSON until comments are stripped. Using the correct media type and extension lets clients, proxies, and tools dispatch correctly (e.g. validate as JSON vs JSON Lines, or strip comments before parse).

## JSON Pointer, JSON Patch, and JSON Merge Patch

### JSON Pointer

**JSON Pointer** is a string syntax for identifying a **single value** inside a JSON document. A pointer is a sequence of **reference tokens** separated by `/`. The **empty string** `""` refers to the whole document. A single **`/`** does not refer to the root—it refers to the member whose name is the empty string (a valid key in JSON). **`/foo`** refers to the value of the member named `foo` in the root object. **`/foo/bar`** refers to the value of `bar` inside the object at `foo`. **`/foo/0`** refers to the first element (index 0) of the array at `foo`. Array indices are zero-based; the token is the decimal representation of the index (e.g. `0`, `1`, `12`). If a member name or a path segment contains **`/`** or **`~`**, they must be **escaped**: `~0` represents `~`, and `~1` represents `/`. Decode in that order (first `~1` → `/`, then `~0` → `~`) so that `~01` is interpreted correctly. JSON Pointer is used by OpenAPI (e.g. `$ref` targets), JSON Patch, and other standards to reference a location in a document. Resolving a pointer that does not exist (e.g. missing key or out-of-range index) is an error; some APIs return 404 or an error code for that.

### JSON Patch

**JSON Patch** describes **changes** to a JSON document as a JSON array of **operation objects**. Each operation has an **`op`** member (the operation type) and a **`path`** member (a JSON Pointer to the target). Operations are applied **in order**; if any operation fails, the entire patch is not applied (all-or-nothing semantics). The six operations:

- **`add`** — Inserts a value at the given path. For an object, adds or replaces a member; for an array, inserts before the given index. The index `-` (as the last path segment) means "append to array." Requires a **`value`** member.
- **`remove`** — Removes the value at the given path (object member or array element).
- **`replace`** — Replaces the value at the path with the given **`value`**. Logically equivalent to remove followed by add at the same path.
- **`move`** — Removes the value at the path specified by **`from`** and adds it at **`path`**. Requires **`from`** (a JSON Pointer).
- **`copy`** — Copies the value at **`from`** to **`path`**. The value at `from` remains. Requires **`from`**.
- **`test`** — Succeeds if the value at **`path`** equals the given **`value`**; otherwise the patch fails. Used for optimistic concurrency (e.g. "apply only if current value is X").

The media type for a JSON Patch document is **`application/json-patch+json`**. Used for partial updates (e.g. PATCH in REST), versioning, and collaborative editing. Implementations must resolve pointers and apply operations atomically with respect to the document.

### JSON Merge Patch

**JSON Merge Patch** is an alternative way to describe changes: the **request body** is a JSON object that is **merged** into the target document. Merge is recursive: for each member in the patch object, if the target has an object at that path, the patch member is merged into it; otherwise the member is added or replaced. A value of **`null`** in the patch means **"remove this member"** from the target. So to delete `foo`, send `{"foo": null}`. Merge Patch **cannot** express: partial array updates (e.g. "replace the second element"); it replaces the entire array. It also cannot distinguish "set to null" from "remove" at the top level. For fine-grained array or conditional updates, use JSON Patch. The media type is **`application/merge-patch+json`**. Simpler to write by hand than a JSON Patch array; use when you are only adding, replacing, or removing object keys and when replacing whole arrays is acceptable.

## JSONPath

**JSONPath** is a standardized query language for **selecting** one or more values from a JSON document (similar in spirit to XPath for XML). A JSONPath expression is a string that describes a **path** or **pattern** through the document; evaluation returns the set of values that match.

**Basic syntax:** **`$`** represents the root. **Dot notation** (e.g. `$.store.book`) navigates into object members. **Bracket notation** (e.g. `$['store']['book']`) is equivalent and required when a member name contains special characters. **`[*]`** or **`[]`** selects all elements of an array (e.g. `$.store.book[*]` gives all books). **`[0]`**, **`[1]`** select by index. **Recursive descent** **`..`** (e.g. `$..author`) selects a member name anywhere in the tree, at any depth. So `$.store.book[*].author` selects the `author` of every book; `$..price` selects every `price` in the document.

**Filters:** JSONPath supports **filter expressions** (e.g. `?(@.price < 20)`) to restrict selections. **`@`** refers to the current node. For example, `$.store.book[?(@.available == true)]` selects books where `available` is true. Implementations may support different comparison and logical operators; a standard set is widely used. **Slice** notation (e.g. `[0:5]`, `[-1]`) for array subsets is also common.

**Use cases:** Extract multiple values in one query (e.g. all IDs, all error messages), filter documents (e.g. "all items where status is pending"), or implement simple queries over JSON config or API responses. The document being queried is standard JSON; JSONPath does not change the JSON grammar. **JSON Pointer** addresses a **single** path; **JSONPath** can return **multiple** nodes and support filters and recursion. Use JSON Pointer when you have a fixed path (e.g. from a ref); use JSONPath when you need search or bulk extraction.

## Binary encodings of JSON-like data

Binary formats encode the same kind of structures as JSON (documents, arrays, strings, numbers, booleans, null) as bytes instead of text. You cannot open them in a text editor or paste them into an API; they are for storage and wire protocols where size or parse speed matters.

### BSON (Binary JSON)

**BSON** is a binary serialization format that extends the JSON document model. It is the native format for **MongoDB** (storage and wire protocol) and is specified at bsonspec.org. Every BSON document is a binary encoding of a single root object; arrays and nested objects map to BSON array and document types. BSON supports all JSON-like types (string, number, boolean, null, array, document) plus types that JSON does not have:

- **Date** — 64-bit integer: milliseconds since Unix epoch (UTC). In JSON you typically represent dates as strings (e.g. ISO 8601 style such as `2025-03-08T00:00:00Z`) or a number; BSON has a native Date type so drivers can round-trip without convention.
- **ObjectId** — 12-byte identifier (often used as `_id` in MongoDB). In JSON you represent it as a 24-character hex string when converting.
- **BinData** — Raw binary data with a subtype (generic, UUID, etc.). JSON has no binary type; conversion usually uses Base64 string or a convention.
- **Timestamp**, **Regex**, **JavaScript**, and other BSON-specific types exist for MongoDB’s use; they do not have a direct JSON equivalent.

**Converting between BSON and JSON.** When you export or send BSON as JSON (e.g. for logs or REST APIs), drivers typically map Date to an ISO string or number, ObjectId to a 24-character hex string, and BinData to Base64. The reverse (JSON → BSON) may require explicit handling for those fields. **Extended JSON** is a convention (used by MongoDB and others) to preserve BSON type information in JSON: e.g. `{"$date": "2025-03-08T00:00:00Z"}` for a Date, `{"$oid": "507f1f77bcf86cd799439011"}` for an ObjectId, `{"$binary": {"base64": "...", "subType": "00"}}` for binary data. **Canonical extended JSON** uses a strict format for interoperability; **relaxed extended JSON** is more human-readable. Round-trip through text JSON without extended JSON is lossy for BSON-only types; with extended JSON, drivers can reconstruct them.

**Where BSON is used.** MongoDB stores documents and communicates with drivers in BSON. The wire format is length-prefixed and type-tagged (each value has a type byte), which allows efficient parsing and indexing. Other databases and tools sometimes use BSON for storage or interchange. When you work with MongoDB or BSON payloads, understanding that it is “JSON-like but binary and with extra types” helps you reason about serialization, indexing, and API boundaries (e.g. converting to JSON at the API layer).

### MessagePack

**MessagePack** is a compact binary format that encodes JSON-like structures (objects, arrays, primitives) with minimal size. It does not add types like BSON’s Date or ObjectId; it is a direct binary encoding of the same value set as JSON (with optional extensions for binary blobs, etc.). Used in caching, RPC, and low-latency messaging where bandwidth or parse speed matters. Unlike BSON, there is no native “document database” type system; it is format-only.

### When to use which

Use **text JSON** for APIs, config, and debugging. Use **BSON** when you are in the MongoDB ecosystem or need native Date/ObjectId/BinData in a binary document format. Use **MessagePack** when you need a compact, JSON-compatible binary format without extra types. All three share the same logical model of documents and arrays; the choice is encoding and type set.

## JSON-based protocols and formats in use

Beyond the core format, several widely used standards are JSON at the wire level. All produce and consume valid JSON; understanding the grammar and structure (topics 1–2) and validation (topic 3) applies to them.

**JSON:API** (v1.1) defines a convention for REST API request/response shape: responses have **`data`** (the primary resource(s)), **`included`** (related resources), **`errors`** (error objects), **`meta`**, and **`links`**. Requests use a defined structure for creating/updating resources. Media type **`application/vnd.api+json`**. Use when you want a consistent, spec-driven REST API that many clients and tools understand.

**JSON-LD** (JSON for Linking Data) uses JSON with **`@context`** (to define term mappings and types) and **`@id`** (to identify nodes) for linked and structured data on the web. Used for SEO, schema.org-style markup, and knowledge graphs. The document is valid JSON; the semantics come from the context and the graph structure.

**JSON-RPC 2.0** is a request–response RPC protocol. A request is a JSON object with **`jsonrpc`** (`"2.0"`), **`method`** (string), **`params`** (array or object, optional), and **`id`** (request id for matching the response). A response has **`jsonrpc`**, **`id`**, and either **`result`** or **`error`** (object with `code` and `message`). Transport-agnostic (HTTP, WebSocket, etc.). Use for RPC-style APIs where you call named methods with parameters.

**JWT** (JSON Web Token) encodes claims as a compact token: **Header.Payload.Signature**, each part Base64url-encoded. The **header** is JSON (e.g. `{"alg":"HS256","typ":"JWT"}`). The **payload** is JSON (e.g. `{"sub":"user123","exp":1741478400}`). The signature is over the header and payload. JWTs are used for authentication and authorization; the payload is often visible (decode Base64url to inspect), so do not put secrets in it.

**OpenAPI** (Swagger) describes REST APIs in YAML or JSON. Request and response bodies are described using **JSON Schema**. The description document itself is JSON (or YAML); the actual API requests and responses are JSON. Use for documentation, code generation, and validation of API contracts.

---

## Further reading

- [RFC 8259 – JSON](https://datatracker.ietf.org/doc/html/rfc8259)
- [RFC 7464 – JSON Text Sequences](https://datatracker.ietf.org/doc/html/rfc7464)
- [RFC 7493 – I-JSON Message Format](https://datatracker.ietf.org/doc/html/rfc7493)
- [RFC 6901 – JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901)
- [RFC 6902 – JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902)
- [RFC 7396 – JSON Merge Patch](https://datatracker.ietf.org/doc/html/rfc7396)
- [RFC 9535 – JSONPath](https://datatracker.ietf.org/doc/html/rfc9535)
- [RFC 7519 – JWT](https://datatracker.ietf.org/doc/html/rfc7519)
- [JSON Lines](https://jsonlines.org/)
- [JSON5](https://json5.org/)
- [JSON Schema (2020-12)](https://json-schema.org/draft/2020-12/)
- [JSON:API](https://jsonapi.org/)
- [JSON-LD](https://json-ld.org/)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [BSON Specification](https://bsonspec.org/spec.html)
- [MongoDB BSON Types](https://www.mongodb.com/docs/manual/reference/bson-types/)
