# Syntax and structure

[← Back to YAML](./README.md)

## What this chapter covers

How a YAML document is laid out on the page: indentation, mappings, sequences, flow vs block styles, comments, and the tokens that make structure legal. After this you should open a `.yaml` / `.yml` file and know what nests under what.

---

## 1. Concepts

### 1. Indentation is structure

YAML uses **indentation** (spaces) to show nesting. Tabs are not valid indentation. Consistency matters: pick a width (commonly **2 spaces** in cloud-native repos) and keep it.

Wrong indent is not a style nit—it changes which parent owns a key, or makes the document ill-formed.

### 2. Mappings (key / value)

A mapping pairs keys with values. In **block** style, each pair is a line `key: value`, and nested values indent under the key:

```yaml
service:
  name: api
  port: 8080
```

Keys are scalars (usually plain strings). Values may be scalars, nested mappings, or sequences.

### 3. Sequences (lists)

Block sequences use a dash and space:

```yaml
ports:
  - 80
  - 443
```

List items at the same indent are siblings. Nested structure under an item indents further.

### 4. Block style vs flow style

| Style | Look | Typical use |
|-------|------|-------------|
| **Block** | Indentation and `-` lines | Human-edited manifests |
| **Flow** | JSON-like `{ }` and `[ ]` | Compact nests, JSON subset |

```yaml
# flow mapping / sequence
labels: { tier: frontend, env: prod }
args: ["--verbose", "--port", "8080"]
```

Flow style is still YAML. Prefer block for deep trees humans review; flow for short inline collections.

### 5. Comments

Comments start with `#` and run to end of line. They are presentation detail—parsers discard them; they do not appear in the loaded data model.

```yaml
replicas: 3  # production baseline
```

### 6. Minimal valid documents

A document can be a single scalar, a single mapping, or a single sequence at the root. Most ops files use a **root mapping**.

```yaml
# root mapping
apiVersion: v1
kind: ConfigMap
```

---

## 2. Advanced concepts

### 1. Spaces that separate vs spaces that indent

YAML distinguishes indentation spaces from separation spaces between tokens. Visually “lined up” content can still be illegal if indicators and indents disagree. When a parser complains about indentation, trust the error position—do not “fix” by random tab conversion mid-file.

### 2. Indicators you will see early

| Indicator | Role |
|-----------|------|
| `-` | Sequence entry |
| `?` | Explicit key |
| `:` | Mapping value |
| `#` | Comment |
| `{` `}` `[` `]` `,` | Flow collections |
| `'` `"` | Quoted scalars (chapter **03**) |
| `|` `>` | Block scalars (chapter **03**) |
| `&` `*` | Anchor / alias (chapter **05**) |
| `!` | Tag (chapter **07**) |
| `%` | Directive (chapter **06**) |
| `---` `...` | Document boundaries (chapter **06**) |
| `@` `` ` `` | Reserved—should not appear as indicators |

For a full “point at any character” decode sheet and stranger-file procedure, see chapter **[12](./12_Reading_Unfamiliar_YAML.md)**.

### 3. Empty values

A key with nothing after `:` often means **null** (schema-dependent). An empty mapping `{}` or empty sequence `[]` is explicit emptiness. Prefer explicit forms when “missing” vs “empty collection” must differ for the host tool.

### 4. Key uniqueness

Duplicate keys in a mapping are a loading failure point in serious processors. Do not rely on “last wins.” Treat duplicates as defects even if a lenient library accepts them.

### 5. File names and encoding

`.yaml` and `.yml` are both common. Prefer **UTF-8**. Byte-order marks and mixed line endings cause intermittent CI failures—normalize in the repo.

### 6. “YAML-ish” templates

Some systems wrap YAML in templating (`{{ }}`, Helm, etc.). The **template** is not pure YAML until rendered. Review both: template syntax and the rendered YAML. This track owns the rendered/format rules; templating hosts own the engine.

### 7. Explicit keys (`?`)

Most mappings use the compact `key: value` form. YAML also allows an **explicit key** marker `?` when the key is complex, multiline, or otherwise awkward as a plain adjacent key:

```yaml
? long key with: colon-ish text
: value
```

Day-to-day K8s/CI files rarely need this. Recognize it so a generator or exotic config is not mistaken for broken syntax. Prefer simple string keys for human-edited infra YAML.

### 8. `a:1` vs `a: 1` (plain scalar colon rule)

In plain scalars, a colon **not** followed by whitespace can appear inside the scalar (URLs, timestamps). A colon **followed by** whitespace starts a mapping value.

| Text | Typical parse |
|------|----------------|
| `url: https://example.com` | key `url`, string value with `://` |
| `a:1` | often a **single plain scalar** `"a:1"`, not key `a` |
| `a: 1` | key `a`, value `1` |

Always put a space after `:` in `key: value` pairs. When a string must contain `: ` (colon + space), quote it.

### 9. Character set and line breaks (enough to debug)

YAML is Unicode. Prefer **UTF-8** files. Line breaks may be normalized during processing; do not rely on mixed CRLF/LF as meaningful data outside quoted/block scalars where you control content. Strip BOMs in CI.

### 10. Presentation vs representation (why two files can “mean the same”)

Different spellings can load to the same data (block vs flow, quoted vs plain string that stays a string). Diff noise is not always semantic change—validate loaded trees when reviewing formatter PRs.

---

## 3. Applications and use cases

| Angle | Syntax role |
|-------|-------------|
| **Application** | Readable nested app config without JSON punctuation fatigue |
| **Systems** | Large trees (workloads, networks) stay reviewable in block style |
| **Security** | Mis-indent can attach a privileged key under the wrong parent—structure review matters |
| **Ops** | Diffs are line-oriented; stable indent keeps PRs readable |
| **SE** | Style guide: spaces width, forbid tabs, root mapping conventions |

**Whole-engineering picture:** syntax mistakes present as “tool rejected the object,” not as compiler stack traces—teach structure so ops and app teams share a vocabulary.

---

## 4. Staff-level review checklist

- Indentation uses spaces only; width is consistent in the file.
- Every `key: value` has a space after `:`; accidental `a:1` style is not used for mappings.
- Mapping vs sequence intent is obvious at each level.
- No duplicate keys in a mapping.
- Flow style is reserved for short inlines, not entire deep trees (unless house style says otherwise).
- Comments do not attempt to “configure” behavior—the data does.
- Templated files are identified as templates, not raw YAML.
- Exotic `?` keys appear only with a clear reason.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML home](https://yaml.org/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
