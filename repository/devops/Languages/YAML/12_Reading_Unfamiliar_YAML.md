# Reading unfamiliar YAML

[← Back to YAML](./README.md)

## What this chapter covers

How to open a **YAML file you did not write**—exported by a cloud console, emitted by a serializer, checked into another repo—and **know what is written there** before you know the product’s field dictionary. Structure and tokens are decoded here; field meanings still belong to the host (Kubernetes, CI, Ansible, …).

Prerequisites: chapters **01–07** for the pieces; this chapter assembles them into a reading habit.

---

## 1. Concepts

### 1. Decode before you debate product fields

When you meet a stranger file, ask in this order:

1. **Is it YAML at all?** (or a template / JSON / something else)
2. **What is the root shape?** (map, sequence, or scalar)
3. **One document or many?** (`---` markers)
4. **Which tokens appear?** (indicators, tags, anchors)
5. **What types will a typical loader invent?** (plain scalars)
6. **Only then:** what do these keys mean for the host product?

Skipping to step 6 is how people misread structure as “API mystery.”

### 2. Five-second root shapes

| What you see at the top | Likely root |
|-------------------------|-------------|
| `key:` lines at column 0 | Mapping |
| `-` items at column 0 | Sequence |
| A single quoted/plain line, or `[...]` / `{...}` only | Scalar or flow collection |
| Starts with `{` or `[` and looks like JSON | JSON-compatible YAML (often entirely flow) |
| `%YAML` / `%TAG` then `---` | Directed document stream |

### 3. Full indicator cheat sheet (recognize on sight)

| Char | Name | Means when you see it |
|------|------|------------------------|
| `-` | Sequence entry | Next list item (needs following space in block style) |
| `?` | Explicit key | Key follows (often complex keys) |
| `:` | Mapping value | Value follows (needs space after `:` in `key: value`) |
| `,` | Flow entry | Separates items inside `[ ]` / `{ }` |
| `[` `]` | Flow sequence | Inline list |
| `{` `}` | Flow mapping | Inline map |
| `#` | Comment | Rest of line ignored by data model |
| `&` | Anchor | Names this node for reuse |
| `*` | Alias | Reuses a named node |
| `!` | Tag | Type label (local or shorthand) |
| `\|` | Literal block | Keep newlines |
| `>` | Folded block | Fold lines (prose) |
| `'` `"` | Quoted scalar | String with defined escape rules |
| `%` | Directive | Stream/document directive (`%YAML`, `%TAG`) |
| `@` `` ` `` | Reserved | Should not appear as indicators in valid modern YAML |

Also: `---` document start, `...` document end (chapter **06**).

### 4. Node properties you will spot together

A node can carry a tag and/or an anchor before its content:

```yaml
items:
  - &anchor !!str visible
  - *anchor
```

Reading order on a line: **tag / anchor markers**, then the value. If you see `!Something` before a map or scalar, that is a **type claim**—stop and ask whether your loader treats it as data or as object construction (chapter **10**).

### 5. Worked decode: mixed stranger file

```yaml
%YAML 1.2
---
# generated: example exporter
apiVersion: "v1"
enabled: true
region: "NO"
retries: 0o3
args: [ "--fast", start ]
nested:
  <<: &defaults
    timeout: 30
  timeout: 60
script: |
  echo hi
---
kind: Extra
```

Decode aloud:

| Piece | Reading |
|-------|---------|
| `%YAML 1.2` | Declares 1.2 intent (loader may still have its own default) |
| First `---` | Document 1 begins |
| `# …` | Comment only |
| `"v1"` / `"NO"` | Forced strings |
| `true` | Boolean under Core/JSON-like rules |
| `0o3` | Octal integer **3** under Core |
| `[ "--fast", start ]` | Flow list; `start` is a plain scalar (string unless typed) |
| `<<: &defaults` | Merge + anchor naming that map |
| `timeout: 60` | Overrides merged `30` in typical merge loaders |
| `\|` block | Exact multiline string |
| Second `---` | Document 2; new root mapping with `kind` |

You still do not know what `apiVersion` means for a product—but you know the **tree and types**.

---

## 2. Advanced concepts

### 1. Fingerprints of generated YAML

| Look | Likely origin habit |
|------|---------------------|
| Everything double-quoted | Cautious serializer / JSON→YAML dump |
| Entire file one flow `{…}` | JSON emitted through a YAML parser, or “JSON as YAML” |
| Many `!!python/…` / `!ruby/…` / language tags | Language object dump—**unsafe load risk** |
| Dense `&id001` / `*id001` | Auto-generated anchors from a graph dump |
| `%TAG ! example.com,2000:` style | Custom tag handle from a specialized emitter |
| Multi-doc with repeated `kind:` / `apiVersion:` | Manifest bundle (host is often Kubernetes-shaped) |
| Top keys `jobs:` / `on:` / `steps:` | CI workflow-shaped (host = CI product) |
| Top keys `hosts:` / `tasks:` / `- name:` playbook lists | Ansible-shaped |

Fingerprint ≠ proof—confirm with host docs—but it aims your next click.

### 2. Template leftovers (not pure YAML yet)

If you see `{{ .Values.x }}`, `${VAR}`, or similar **before** render, you are reading a **template**. Decode the YAML structure around the holes; do not expect a stock YAML parser to accept the template itself.

### 3. When the file is valid YAML but “wrong”

| Symptom | Format question to ask |
|---------|------------------------|
| Tool says unknown field | Host schema—not YAML grammar |
| Bool flipped / string became number | Schema/version (chapters **03**, **07**) |
| Key landed under wrong parent | Indent (chapter **02**, **04**) |
| Huge memory on load | Anchors/depth (chapters **05**, **10**) |
| Only first resource applied | Multi-doc handling (chapter **06**) |

### 4. Reading algorithm (staff checklist form)

1. Skim for `%`, `---`, `...`.
2. Mark root kind (map/list/scalar/flow).
3. Scan for `&` / `*` / `<<` / `!`.
4. Note every `|` / `>` and whether chomp (`-`/`+`) appears.
5. Mentally type plain scalars that look like bools/numbers/versions.
6. Expand aliases on paper for small files; for large files, jump to each `&name`.
7. Split multi-doc and decode each root separately.
8. Hand remaining key names to the **host** manual.

### 5. What you still will not know from format alone

Product enums, defaulting, admission webhooks, required fields, and whether `image: latest` is allowed. Format literacy ends at **tree + types + reuse + safety of load**. Host literacy begins at **field contracts**.

### 6. Practice drill

Take any exported YAML (cloud console, CI “download config”, Helm `template` output). Without looking at docs, write:

- root shape,
- document count,
- list of anchors/tags,
- three scalars you would quote if they must stay strings,
- one question for the host owner.

If you can fill that card, this track did its job.

---

## 3. Applications and use cases

| Angle | Decode use |
|-------|------------|
| **Application** | Read vendor `config.yaml` samples without guessing braces |
| **Systems** | Diff two rendered manifests by structure, not only text |
| **Security** | Spot language tags and alias density before loading |
| **Ops** | Explain a failing apply as indent vs schema vs multi-doc |
| **SE** | Onboarding: “decode this file aloud” as a bar |

**Whole-engineering picture:** a stranger YAML becomes **readable data** first; then you open the right host section for field meaning.

---

## 4. Staff-level review checklist

- Reader can classify root shape and document count in under a minute.
- Every indicator in the cheat sheet can be named when pointed at.
- Tags/anchors/merges are noticed before product-field debate.
- Plain scalars that look like bools/numbers/versions are called out.
- Template vs rendered YAML is distinguished.
- Language-specific tags trigger a safe-load conversation.
- Unknown keys are routed to host schema—not treated as “invalid YAML” by default.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML home](https://yaml.org/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
- [Chapter 02 — Syntax](./02_Syntax_And_Structure.md)
- [Chapter 07 — Tags and schemas](./07_Tags_Schemas_And_Typing.md)
- [Chapter 10 — Security](./10_Security_Design_And_Review.md)
