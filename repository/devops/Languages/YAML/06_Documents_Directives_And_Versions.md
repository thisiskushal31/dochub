# Documents, directives, and versions

[← Back to YAML](./README.md)

## What this chapter covers

Document streams (`---` / `...`), `%YAML` / `%TAG` directives, and the practical difference between **YAML 1.2** (default narrative) and **YAML 1.1** (brownfield). Pin for new work: **1.2.2**.

---

## 1. Concepts

### 1. One file, one or more documents

A YAML **stream** may contain multiple **documents**. The document start marker is `---`. Optional end marker is `...`.

```yaml
---
kind: ConfigMap
metadata:
  name: a
---
kind: ConfigMap
metadata:
  name: b
```

Some tools apply multi-doc files as a batch; others accept only one root. Know your host.

### 2. Directives

Directives appear before a document and start with `%`:

| Directive | Role |
|-----------|------|
| `%YAML 1.2` | Declares YAML version for the document |
| `%TAG` | Declares tag shorthand prefixes |

Many hand-written configs omit directives and rely on the parser default—that default is part of your toolchain pin.

### 3. Why versions matter

The same characters can load differently under **1.1** vs **1.2** schemas—especially booleans and sexagesimal/number folklore from older eras. “It parsed” is not “it parsed as we meant.”

### 4. Default narrative

| Line | Habit |
|------|-------|
| **1.2 / 1.2.2** | Prefer for new configs and modern parsers |
| **1.1** | Expect more aggressive implicit typing; quote liberally |

---

## 2. Advanced concepts

### 1. Parser default ≠ file extension

Installing “a YAML library” does not tell you which specification revision and which schema it applies. Record **library + version** in CI the same way you pin compilers for languages.

### 2. JSON as a subset (1.2 goal)

YAML 1.2 aims to treat JSON as a compatible subset. That enables dual pipelines: author YAML, emit JSON, or accept JSON where a YAML parser is used. Dual pipelines still need tests—subset theory does not replace golden fixtures.

### 3. Multi-doc operational patterns

| Pattern | Watch-outs |
|---------|------------|
| Helm / manifest bundles | Order may matter for apply |
| CI matrix fragments | Document boundaries vs list items |
| Mixed resource kinds | RBAC apply order is a host concern |

### 4. `%TAG` literacy (door)

Tag directives remap short handles to URIs. Most app configs never need this; language libraries and advanced serializers do. Chapter **07** covers tags/schemas; treat `%TAG` as advanced presentation.

### 5. Brownfield migration habits

When upgrading parsers 1.1 → 1.2:

1. Snapshot loaded types for critical keys (bool/string/number).
2. Quote ambiguous scalars proactively (`yes`/`no`/`on`/`off`, country codes, versions).
3. Re-run host validation (K8s dry-run, CI schema, Ansible check).
4. Diff behavior, not only text.

### 6. Directives vs library defaults

A missing `%YAML` directive does **not** mean “undefined.” It means “whatever this binary defaults to.” Treat the **library version and its documented default schema** as the real pin. Optional `%YAML 1.2` in files can document intent; it does not override a hard-coded 1.1 loader.

### 7. Document end markers

`...` ends a document explicitly. Useful in streams and some tooling; many files omit it and start the next doc with `---` only. Both patterns appear in production—know which your apply tool expects.

### 8. Empty documents and whitespace-only files

A stream with no nodes / only directives can be a footgun for “apply everything in this path” scripts. Prefer explicit empty mapping `{}` when a placeholder file must exist.

---

## 3. Applications and use cases

| Angle | Version/doc role |
|-------|------------------|
| **Application** | Feature files with clear single-doc roots |
| **Systems** | Multi-doc apply bundles |
| **Security** | Version skew → type confusion → authz bugs |
| **Ops** | Pin parser in the image that applies manifests |
| **SE** | `%YAML 1.2` optional; quoting policy mandatory |

**Whole-engineering picture:** document markers and version pins are **release metadata** for config, not cosmetics.

---

## 4. Staff-level review checklist

- Host accepts single-doc vs multi-doc as used in the file.
- Team knows which YAML revision the loader implements.
- Ambiguous scalars quoted when supporting 1.1-era loaders.
- Parser library version is pinned in CI/CD images.
- Migration from 1.1→1.2 includes type snapshot tests for critical fields.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML 1.1 specification](https://yaml.org/spec/1.1/)
- [YAML home](https://yaml.org/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
