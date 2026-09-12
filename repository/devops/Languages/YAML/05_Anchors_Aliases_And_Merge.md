# Anchors, aliases, and merge keys

[← Back to YAML](./README.md)

## What this chapter covers

Reuse inside a document: **anchors** (`&`), **aliases** (`*`), and the common **merge key** pattern (`<<`). Powerful for DRY configs—dangerous when they hide control flow or explode memory.

---

## 1. Concepts

### 1. Anchors name a node

An anchor marks a node so it can be referenced again:

```yaml
defaults: &defaults
  retries: 3
  timeout: 30

jobs:
  - name: a
    <<: *defaults
  - name: b
    <<: *defaults
    timeout: 60
```

`&defaults` labels the mapping; later aliases refer to it.

### 2. Aliases reference a prior anchor

`*defaults` means “the node anchored as `defaults`.” Aliases are not string interpolation—they reuse the **node** in the representation graph.

### 3. Why teams use them

| Goal | Anchor pattern |
|------|----------------|
| Shared defaults | One anchored map, many merges |
| Repeated nested blocks | Anchor a subsequence or mapping |
| Smaller diffs | Change once at the anchor |

### 4. Merge key (`<<`) literacy

Many configs use `<<: *anchor` (or `<<: [*a, *b]`) to pull keys from other mappings into this one.

| Fact | Implication |
|------|-------------|
| Merge is **widely implemented** in popular loaders | You will see it in the wild |
| It is **not** a guaranteed YAML 1.2 Core feature everywhere | Pin/verify the loader; do not assume every language library merges |
| Heritage is older optional typing (`merge`-style behavior) | Prefer explicit keys or generators when files must be ultra-portable |

Overrides after the merge are normal in typical implementations (local keys win)—**verify** for your loader. For security-sensitive surfaces, expand merges mentally in review (hidden keys).

### 5. Alias without merge

Reuse does not require `<<`. You can alias a whole subtree as a value:

```yaml
base: &base
  image: app:1.2
services:
  api: *base
```

That shares one node. Merge is specifically about **combining mapping keys**.

### 6. Readability rule

If a reviewer cannot find the anchor definition quickly, the alias is a liability. Prefer short, descriptive anchor names.

---

## 2. Advanced concepts

### 1. Anchors are serialization detail

After composition, anchor names need not survive as application data. Do not build product logic that requires remembering the anchor string—build logic on the merged content.

### 2. Cycles

A node that reaches itself through aliases creates cycles. Some loaders reject them; others may loop or exhaust resources. Do not design cyclic YAML for config. Security chapter **10** covers resource exhaustion classes without providing bomb recipes.

### 3. Alias across documents

Multi-document streams (chapter **06**) complicate anchoring expectations. Prefer anchors **within** one document unless your toolchain documents cross-document behavior.

### 4. When not to use anchors

| Smell | Prefer instead |
|-------|----------------|
| One-off reuse | Copy once or generate |
| Cross-file DRY | Shared library chart/module/template host |
| Obscure graph of `*a` `*b` `*c` | Flatten for auditability |
| Security-sensitive overrides | Explicit keys—no hidden merges |

### 5. Generators vs anchors

Helm, Kustomize, Jsonnet, and CDK-style tools often replace mega-anchor files. Anchors remain useful for small local DRY; generators win for fleet-scale reuse.

### 6. Diff and review impact

A one-line change at an anchor can alter many expanded sites. PR description should name the anchor and list consumer jobs/services affected.

### 7. Multiple merge sources

Some loaders allow `<<: [*a, *b]` with defined override order among sources. If you use this, document the order assumption in the file comment and the team style guide—reviewers should not guess.

### 8. Round-trip surprises

Dumping a loaded document may **omit** anchors (inlining) or invent new anchor names. Do not require golden YAML text identity after load/dump unless your tool guarantees canonical form—compare data, not always bytes.

---

## 3. Applications and use cases

| Angle | Reuse role |
|-------|------------|
| **Application** | Shared defaults across environments in one file |
| **Systems** | Repeated sidecar fragments (with caution) |
| **Security** | Hidden merges can sneak privileged keys—expand mentally in review |
| **Ops** | Blast radius of anchor edits |
| **SE** | Style guide: max alias depth; ban cycles; name anchors |

**Whole-engineering picture:** anchors are a **local macro system**. Treat them with the same respect as shared libraries—visibility and blast radius.

---

## 4. Staff-level review checklist

- Every `*` alias resolves to a defined `&` anchor in scope.
- Anchor names are meaningful; alias graphs stay shallow.
- Merges are explicit; overrides after `<<` are intentional.
- No cyclic alias patterns.
- Large blast-radius anchors are called out in the PR.
- Team knows whether the loader supports merge keys as used.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML home](https://yaml.org/)
- [Chapter 10 — Security](./10_Security_Design_And_Review.md)
