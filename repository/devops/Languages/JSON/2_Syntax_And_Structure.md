# Syntax and structure

JSON has a small, strict grammar. A valid JSON text is exactly one **value**: an object, an array, or a primitive (string, number, or one of the literals `true`, `false`, `null`). Whitespace may appear only between tokens, not inside strings or numbers. Understanding the full grammar and semantics lets you write valid JSON, interpret parser errors, and reason about edge cases (duplicate keys, ordering, encoding).

## The JSON grammar (overview)

- **JSON text** = optional whitespace + one **value** + optional whitespace. Nothing else. An empty string or a file with only whitespace is **not** valid JSON (there is no value).
- **Value** = `true` | `false` | `null` | **number** | **string** | **object** | **array**.
- **Object** = `{` [ **member** ( `,` **member** )* ] `}`. Each **member** is a **string** `:` **value**. No trailing comma.
- **Array** = `[` [ **value** ( `,` **value** )* ] `]`. No trailing comma.
- **String** = `"` (character or escape)* `"`. Only double quotes. Valid escapes: `\"` `\\` `\/` `\b` `\f` `\n` `\r` `\t` `\uXXXX`.
- **Number** = optional `-` + integer part + optional fraction (`.` + one or more digits) + optional exponent (`e` or `E` + optional `+` or `-` + one or more digits). No leading zero except for the integer `0`. No `+` before a number.
- **Whitespace** = space (U+0020), tab (U+0009), line feed (U+000A), carriage return (U+000D). Only between tokens.

Case matters: `true`, `false`, and `null` are lowercase. `True`, `FALSE`, `Null` are invalid.

## Values

A **value** is one of: `true`, `false`, `null`, a number, a string, an object, or an array. Objects and arrays can nest arbitrarily; the only limit is what parsers and runtimes allow (stack depth, memory). The **top-level** of a JSON text can be any single value—including a bare number (`42`), a bare string (`"hello"`), or `null`. Many APIs use a top-level object `{ ... }`, but the grammar allows a top-level array or primitive too.

## Objects

An object is a set of name/value pairs. It begins with `{` and ends with `}`. Each **member** is a **string** (the name) followed by `:` and a value. Members are separated by `,`. The name must be a **double-quoted string**; unquoted keys (e.g. `{ name: "alice" }`) are invalid. There is no trailing comma after the last member.

```json
{}
{"name": "alice", "count": 42}
{"nested": {"inner": true}}
```

**Duplicate keys.** The JSON grammar does not forbid the same name appearing more than once in an object. Names within an object **SHOULD** be unique. If they are not, behavior is implementation-defined: many parsers use **last value wins** (the later member overwrites the earlier one); some reject the document or report an error. For interoperability, always use unique names. When consuming JSON from others, be aware that duplicate keys can lead to different results across languages and libraries.

**Order of members.** The JSON grammar defines an object as an unordered collection. Parsers may preserve the order in which members appear (e.g. for round-trip or display), but you must not rely on order when interpreting data; treat object access as by name only.

## Arrays

An array is an ordered collection of values. It begins with `[` and ends with `]`. Values are separated by `,`. No trailing comma. Order is significant and must be preserved by parsers.

```json
[]
[1, 2, 3]
["a", "b", "c"]
[true, null, {"id": 1}]
```

## Strings

A string is a sequence of zero or more Unicode characters wrapped in double quotes. **What may appear inside the quotes:** any character except the double quote `"`, the backslash `\`, and control characters (U+0000 through U+001F) may appear unescaped. The double quote and backslash must be escaped as `\"` and `\\`. The solidus `/` may be escaped as `\/` (not required by the grammar but allowed for compatibility). Control characters must be escaped: backspace `\b`, form feed `\f`, newline `\n`, carriage return `\r`, tab `\t`, or `\u` followed by four hex digits for any code point. Any Unicode code point can be written as `\uXXXX` (exactly four hexadecimal digits, e.g. `\u00A9` for ©). For code points above U+FFFF (e.g. many emoji), the grammar allows two consecutive `\u` escapes forming a UTF-16 surrogate pair (high surrogate then low surrogate); some parsers also accept `\u{XXXXXX}` with one to six hex digits—that is an extension, not core JSON. Only double-quoted strings are valid; single-quoted strings are not JSON.

```json
""
"hello"
"line1\nline2"
"quote: \""
"unicode: \u00A9"
```

Raw control characters (U+0000 through U+001F) are not allowed unescaped inside a string; they must be represented with `\u` or the appropriate escape (`\n`, `\r`, etc.). **Only the escape sequences listed above are valid.** Any other backslash sequence is invalid—for example `\'`, `\x41`, `\z`, or `\u` not followed by exactly four hex digits. Strict parsers reject such strings. To include a literal backslash in a string you use `\\`; to include a literal backslash followed by `u` you use `\\\\u` in the JSON text.

## Numbers

A number is written in **decimal only**—no hexadecimal, octal, or other base. Structure: optional minus `-`, then **integer part** (required), then optional **fraction** (`.` followed by one or more digits), then optional **exponent** (`e` or `E`, optional `+` or `-`, then one or more digits). The integer part is either the digit `0` alone, or a nonzero digit (`1`–`9`) followed by zero or more digits (`0`–`9`). So `0` is valid; `01` and `007` are invalid because a nonzero integer cannot start with zero. The fraction, if present, must have at least one digit after the dot (e.g. `1.0`, `.5` is invalid—there must be a digit before or the number is written as `0.5`). A leading `+` is not allowed. **NaN**, **Infinity**, and **-Infinity** are not valid JSON numbers; they have no representation in the grammar. The grammar does not define a range or precision; interoperability (e.g. IEEE 754 double) is covered in the Advanced topic.

```json
0
42
-3
0.5
1.5e2
1e-3
```

The grammar does not constrain the range or precision of numbers; interoperability considerations (e.g. IEEE 754 double precision in many languages) are covered in the Advanced topic (number precision).

## Literals

The three literal values are spelled in lowercase: `true`, `false`, `null`. Any other spelling (e.g. `True`, `NULL`, `NONE`) is invalid.

## Whitespace

Whitespace may appear between any two tokens (e.g. after `{`, before a key, after `:`, before a value). The **only** valid whitespace characters are space (U+0020), tab (U+0009), line feed (U+000A), and carriage return (U+000D). Inside a string, whitespace is part of the string value; inside a number, no whitespace is allowed.

## Encoding

JSON text is encoded in **UTF-8** for interchange. JSON exchanged on the Internet should use UTF-8. A byte order mark (BOM) at the start of the text is not required; if present, parsers may strip or ignore it. Other encodings (e.g. UTF-16, UTF-32) may be used in closed environments, but UTF-8 is the interoperable choice for APIs and config files.

## Reading JSON: what you're looking at

When you open a JSON file or see a JSON payload, you can identify structure as follows. A **`{`** starts an object; the next token should be either `"` (a key) or `}` (empty object). A **`[`** starts an array; the next token should be a value or `]` (empty array). A **`"`** starts a string; it continues until the next unescaped `"`. The literals **`true`**, **`false`**, and **`null`** are single tokens. A **number** starts with a digit or `-` followed by a digit (and has no whitespace inside). Between tokens, whitespace (space, tab, newline, carriage return) is allowed. A **comma** separates two members in an object or two values in an array; there is no comma before the first or after the last. A **colon** `:` appears only between a key and its value in an object. If you see something that does not fit these rules (e.g. a comma with nothing after it, or a single quote, or an unquoted word that is not true/false/null), the text is not valid JSON.

**Common mistakes when writing JSON.** (1) Trailing comma: `[1, 2,]` or `{"a": 1,}` — remove the comma after the last element. (2) Unquoted keys: `{name: "alice"}` — use `{"name": "alice"}`. (3) Single-quoted strings: `'hello'` — use `"hello"`. (4) Comments: `// comment` or `/* comment */` — not allowed; strip them or use a format that supports comments and convert before interchange. (5) Invalid number: `01`, `0x1a`, `.5`, `1.` — use decimal only, no leading zero (except `0`), no leading dot (use `0.5`). (6) Literal spelling: `True`, `NULL`, `false` — only lowercase `true`, `false`, `null`. (7) Multiple top-level values: `{} []` — one document is one value; use newline-delimited or record-delimited format for multiple values. Fixing these usually resolves parse errors; when in doubt, validate with a strict parser or schema.

## Why the rules exist

The grammar is strict by design. **Double-quoted keys and strings** remove ambiguity (no need to distinguish identifiers from strings). **No trailing commas** avoid parser and generator disagreements across languages. **No comments** keep the format a pure data representation so that the same bytes always parse to the same value; comments belong in config layers that produce JSON (e.g. templates or JSONC that is stripped before use). **One value per document** gives a clear contract: one parse yields one value; multi-value streams use line-delimited or record-delimited formats (covered in the Advanced topic). **Decimal-only numbers** and **no NaN/Infinity** keep number handling interoperable across languages that map JSON numbers to doubles. Understanding these reasons helps you avoid invalid JSON and explains why extensions (JSON5, JSONC) exist for human-friendly authoring while strict JSON remains the interchange standard.

## Edge cases and invalid text

- **Empty document** — The empty string is not valid JSON; there is no value.
- **Bare values** — `1`, `"hello"`, `true`, `null`, `[1,2]` are valid JSON texts (one value each).
- **Trailing commas** — `[1, 2,]` or `{"a": 1,}` are invalid.
- **Single-quoted strings** — `'hello'` is invalid; use `"hello"`.
- **Unquoted keys** — `{name: "alice"}` is invalid; use `{"name": "alice"}`.
- **Comments** — JSON has no comment syntax; strip them before parsing or use a format that allows comments (e.g. JSONC) if your tooling supports it.
- **JavaScript-only values** — `undefined`, `NaN`, `Infinity`, and function or symbol types have no JSON representation; serialize them to a JSON-safe form (e.g. `null` or a string) if you need to send them.
- **Multiple values** — Two values in a row (e.g. `1 2` or `{} []`) are invalid; a JSON text is exactly one value. For multiple values per line or file, use a format like JSON Lines (one value per line).
- **Empty array and empty object** — `[]` and `{}` are valid; they denote an array with zero elements and an object with zero members. No comma inside: `[,]` and `{,}` are invalid.
- **Hex or octal** — Numbers like `0x1a` or `0o12` are not valid JSON; the format allows only decimal.
- **Invalid escape sequences** — In a string, only `\"` `\\` `\/` `\b` `\f` `\n` `\r` `\t` and `\uXXXX` (four hex digits) are valid. Sequences like `\'`, `\x41`, or `\u12` (too few digits) are invalid and cause parse errors.

---

## Further reading

- [RFC 8259 – JSON Grammar](https://datatracker.ietf.org/doc/html/rfc8259#section-2)
- [Introducing JSON (json.org)](https://www.json.org/json-en.html)
- [MDN: JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
