# Tooling, linting, and validation

[← Back to YAML](./README.md)

## What this chapter covers

How teams keep YAML honest in practice: **parse** vs **validate**, linters, editor support, schema checks, and CI gates. Format rules live in earlier chapters; this chapter is the engineering workflow around them.

---

## 1. Concepts

### 1. Parse ≠ validate

| Step | Question answered |
|------|-------------------|
| **Parse** | Is this well-formed YAML? Can we build a node tree? |
| **Validate** | Does the tree match the **host schema** (K8s type, Action workflow, Ansible structure, JSON Schema)? |

A file can parse and still be useless or dangerous for the product. Always know which gate failed.

### 2. Three layers of tooling

| Layer | Examples of job |
|-------|-----------------|
| **Editor** | Syntax highlight, indent guides, schema-aware completion |
| **Lint** | Style and common pitfalls (line length, truthy plain scalars, key duplicates) |
| **Schema / dry-run** | Host accepts the object (`kubectl` dry-run, CI schema, `ansible-lint`, …) |

### 3. Pin the parser in CI

Laptop editors forgive; production loaders may not. CI should parse with the **same family and major version** as production consumers when feasible.

### 4. JSON Schema bridge

Many validators load YAML into JSON-compatible data and apply **JSON Schema**. That is a strength for shared contracts—and a reason to avoid exotic YAML-only features in schema-gated files. See [JSON Schema](https://json-schema.org/) and the [JSON](../JSON/README.md) track.

### 5. Minimal local loop

1. Edit file.
2. Parse (tool or library).
3. Lint (house rules).
4. Validate against host schema or dry-run.
5. Only then merge.

---

## 2. Advanced concepts

### 1. What linters catch vs miss

Linters excel at style and known footguns (tabs, truthy strings). They do not replace host admission control. Never treat “lint green” as “safe to apply in prod.”

### 2. Generated YAML

When Helm/Kustomize/CDKs emit YAML, gate the **rendered** output in CI, not only the templates. Template lint and render validate are different jobs.

### 3. Multi-doc tooling

Ensure your parser/linter mode matches multi-document files (`---`). Some tools only read the first document unless configured.

### 4. Formatting wars

Auto-formatters that rewrite flow↔block style create noisy diffs. Pick a formatter policy per repo; do not reformat unrelated manifests in drive-by PRs.

### 5. Artifact identity

Store the YAML that was validated (or its digest) with the release. “We validated something that looked like this” is not an audit trail.

### 6. Editor schemas

Schema-associated editing (e.g. Kubernetes resource completion) improves speed but can drift from cluster version. Pin schema versions beside cluster/toolchain pins.

### 7. Implementation variance is normal

YAML has a rich grammar and multiple mature parsers. They can disagree on edge cases (duplicate keys, merge support, 1.1 vs 1.2 bool words, how large aliases expand). The [YAML Test Suite](https://github.com/yaml/yaml-test-suite) exists so implementers can compare behavior.

**Staff habit:** pin **one** parser family in CI and production apply paths; do not mix “whatever the IDE uses” with “whatever the cluster operator image uses” without a parity check.

### 8. Round-trip and canonicalization

Load→dump often changes quoting, flow/block style, and key order. For golden tests, assert on **parsed structures** (or host dry-run output), not always on exact file bytes—unless you adopt a canonical emitter and enforce it.

### 9. Streaming and huge files

DOM-style “load entire file” is the common path. Very large multi-doc streams may need event/streaming APIs your language library provides. Prefer splitting manifests over multi-hundred-MB YAML blobs in Git.

---

## 3. Applications and use cases

| Angle | Tooling role |
|-------|--------------|
| **Application** | Config schema tests in unit CI |
| **Systems** | Admission dry-run in pipeline before apply |
| **Security** | Reject unknown fields where schema allows; lint secrets patterns |
| **Ops** | Same parser in apply image and CI image |
| **SE** | One documented command: lint + validate |

**Whole-engineering picture:** tooling turns format literacy into **merge gates**.

---

## 4. Staff-level review checklist

- CI distinguishes parse failures from schema failures.
- Linter config is checked in; not only on one laptop.
- Rendered YAML is validated for generated paths.
- Parser/toolchain versions are pinned.
- Host dry-run or equivalent exists for production-bound manifests.
- Formatter policy avoids drive-by whole-tree rewrites.

---

## References

- [YAML home](https://yaml.org/)
- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML Test Suite](https://github.com/yaml/yaml-test-suite)
- [JSON Schema](https://json-schema.org/)
- [JSON track](../JSON/README.md)
- [Cloud-Native](../../Cloud-Native/README.md)
- [CiCd](../../CiCd/README.md)
