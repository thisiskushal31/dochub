# Scalars and multiline strings

[← Back to YAML](./README.md)

## What this chapter covers

Leaf values: plain and quoted strings, numbers, booleans, null, and **multiline** block scalars (`|` and `>`). This is where most “YAML weirdness” lives—especially unquoted scalars that look like strings but load as other types.

---

## 1. Concepts

### 1. What a scalar is

A **scalar** is a single leaf value: text, a number, a boolean, or null. Collections (maps/lists) contain scalars at the leaves.

### 2. Plain vs quoted

| Form | Example | Notes |
|------|---------|-------|
| **Plain** | `hello`, `3.14`, `true` | Flexible; subject to **type resolution** |
| **Single-quoted** | `'hello'` | Mostly literal; `''` escapes a single quote |
| **Double-quoted** | `"hello\n"` | Escape sequences allowed |

When a value must remain a **string** no matter what (versions, country codes, `yes`/`no` labels), **quote it**.

```yaml
country: "NO"
enabled_flag: "yes"
version: "1.10"
```

### 3. Numbers, floats, and null (intuition)

Under the **1.2 Core** schema (common default recommendation), plain scalars may resolve as:

| Kind | Examples (Core-oriented) |
|------|--------------------------|
| **null** | `null`, `Null`, `NULL`, `~`, empty |
| **bool** | `true` / `false` (and `True`/`FALSE` style variants)—**not** the wider 1.1 word set |
| **int** | decimal; also `0o` octal and `0x` hex |
| **float** | decimals, scientific; also `.inf` / `.nan` family |
| **str** | everything else that does not match |

Exact tables: chapter **07**. Version **1.1** loaders often recognize more boolean-like words (`yes`/`no`/`on`/`off`, …)—that is brownfield, not Core 1.2.

### 4. Multiline: literal `|` vs folded `>`

| Style | Keeps newlines? | Typical use |
|-------|-----------------|-------------|
| **Literal** `\|` | Yes | Certificates, scripts, SSH keys blocks, exact files |
| **Folded** `>` | Folds single newlines to spaces (with rules) | Long prose paragraphs |

```yaml
script: |
  #!/bin/sh
  echo "hello"

bio: >
  This line continues
  as one paragraph.
```

### 5. Chomping (trailing newlines)

Block scalars can control final newlines:

| Indicator | Effect (intuition) |
|-----------|-------------------|
| `|` or `>` (default clip) | Single trailing newline kept as usual |
| `|-` / `>-` (strip) | Strip final newlines |
| `|+` / `>+` (keep) | Keep trailing newlines |

Pick chomping deliberately when embedding scripts or comparing golden strings in tests.

---

## 2. Advanced concepts

### 1. The “Norway problem” and friends (version-accurate)

Under **YAML 1.1**-style implicit typing, bare tokens such as `yes`, `no`, `on`, `off`, and some country-code-like tokens could load as **booleans**. `NO` as Norway is the classic surprise.

Under **YAML 1.2 Core**, boolean resolution is narrower (`true`/`false` family). Teams still quote string labels because (1) many production libraries remain 1.1-flavored, and (2) quoting is the portable defense when the loader pin is unclear.

**Staff habit:** quote anything that is semantically a string label—even if it “looks like” a word.

### 2. Version strings, hex, octal, and leading zeros

| Risk | Why quote or be explicit |
|------|--------------------------|
| `1.10` / `3.0` | May become floats; trailing zeros matter as product strings |
| `01` / zero-padded IDs | Number vs string disagreement across loaders |
| `0xFF` / `0o17` | Core resolves as **int**—fine when you mean integers; quote when you mean codes |
| `+12` | Accepted as number in Core float/int patterns—quote if it is a label |

Prefer quoted strings for versions, IDs, and zero-padded codes.

### 3. Escape literacy (double-quoted vs single-quoted)

| Style | Escapes |
|-------|---------|
| **Double-quoted** | `\n`, `\t`, `\\`, `\"`, Unicode escapes, and other defined escapes |
| **Single-quoted** | Mostly literal; only `''` → one single quote |
| **Plain** | No backslash escapes—backslash is ordinary text |

Do not assume Bash-style escapes work in plain or single-quoted scalars.

### 4. When plain scalars need quotes for syntax (not only types)

Quote when the text would otherwise hit indicators or structure rules: leading/trailing whitespace you must keep, `#` that would start a comment, leading `@`/`\`` in some contexts, or strings that look like flow indicators. If unsure, quote—correctness beats clever plain style.

### 5. Block indentation indicator

When content must start with spaces that would confuse indentation detection, block headers can include an explicit indent digit (e.g. `|2`). Use when embedding indented code; do not sprinkle mysterious digits without need.

### 6. Folded `>` edge intuition

Folded style joins ordinary lines with spaces; blank lines typically become newlines. It is for prose, not for exact scripts—use `|` when byte-for-byte line structure matters.

### 7. Multiline vs sequence of lines

Sometimes a sequence of strings is clearer than one folded scalar—especially for command args:

```yaml
args:
  - --config
  - /etc/app.yaml
```

Choose the shape the **host schema** expects (string vs array).

### 8. Secrets in scalars

Multiline blocks often hold certificates or keys. That is a **secrets management** problem (chapter **10**), not a syntax feature. Syntax only tells you how the text is captured.

---

## 3. Applications and use cases

| Angle | Scalar role |
|-------|-------------|
| **Application** | Feature strings, messages, embedded templates |
| **Systems** | Exact `|` blocks for configs mounted into containers |
| **Security** | Quoting prevents type-confusion bugs; multiline often holds secrets |
| **Ops** | Chomping mistakes break shell scripts in ConfigMaps |
| **SE** | House rule: quote ambiguous tokens; prefer `\|` for scripts |

**Whole-engineering picture:** most “YAML bugs” in production are **scalar typing or multiline whitespace**, not missing curly braces.

---

## 4. Staff-level review checklist

- Ambiguous tokens (`yes`/`no`/`on`/`off`, country codes, versions) are quoted when they must be strings.
- Multiline choice (`|` vs `>`) matches intent; chomping reviewed for scripts.
- Double-quoted escapes are intentional, not copied from shell folklore.
- Host expects string vs list-of-string is verified for command/arg fields.
- No plaintext private keys committed “just for now” in `|` blocks.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML 1.1 specification](https://yaml.org/spec/1.1/)
- [YAML home](https://yaml.org/)
- [JSON track](../JSON/README.md)
