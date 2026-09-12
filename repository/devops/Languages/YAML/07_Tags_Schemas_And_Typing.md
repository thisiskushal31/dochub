# Tags, schemas, and typing

[← Back to YAML](./README.md)

## What this chapter covers

How YAML decides **what type** a node is: tags, non-specific tags, and the three **recommended schemas** in YAML 1.2 (Failsafe, JSON, Core)—with enough resolution detail to predict loader behavior. Also: explicit tags, local/application tags, and doors like `!!binary` / timestamps.

---

## 1. Concepts

### 1. Tags are type labels

In the YAML model, nodes carry **tags** that indicate type. Writers may set tags explicitly; more often tags are **resolved** from content and schema rules.

| Form | Example | Role |
|------|---------|------|
| Shorthand | `!!str`, `!!int`, `!!map` | Common global tags (`tag:yaml.org,2002:…`) |
| Verbatim / URI | `!<tag:yaml.org,2002:str>` | Full form |
| Local / app | `!ruby/object:Foo` | Language-specific—avoid in portable infra YAML |

Most hand-edited ops YAML rarely shows tags—but libraries still resolve types behind the scenes.

### 2. Non-specific tags: `!` vs `?`

Untagged nodes carry a non-specific tag that schemas resolve:

| Non-specific | Intuition |
|--------------|-----------|
| `!` | “Resolve by **kind**” → map / seq / str in standard convention |
| `?` | “Resolve from **content**” for plain scalars (and collections by kind in JSON/Core) |

Plain scalars you type without quotes are the `?` case—the schema’s regex table decides the type.

### 3. Three recommended schemas (1.2)

| Schema | Role | Staff bias |
|--------|------|------------|
| **Failsafe** | Only `!!map`, `!!seq`, `!!str` | Safest generic interchange; little magic |
| **JSON** | Failsafe + null/bool/int/float with **strict** plain rules | Closest to JSON files; unknown plains are errors |
| **Core** | JSON tags + **broader** plain resolution; unmatched → **string** | Spec’s recommended default unless told otherwise |

**Schema choice changes meaning.** Two “YAML parsers” can disagree without either being “broken.”

### 4. Practical rule for DevOps files

Assume **hostile typing**: if the value is a string in the product sense, quote it. Do not rely on “everyone uses the same library defaults.”

```yaml
# defensive
region: "no"
debug: "false"
count: "10"   # only when the host expects string; else use number deliberately
```

Use real numbers/bools when the host schema wants numbers/bools—honesty over quoting everything by habit.

---

## 2. Advanced concepts

### 1. Failsafe resolution (minimal)

- `!` → `map` / `seq` / `str` by kind.
- `?` left unresolved in pure Failsafe (application must deal with partial representation)—in practice you use JSON or Core for config files.

### 2. JSON schema plain resolution (strict)

Plain scalars match **first** regex wins. Intuition of the 1.2 table:

| Matches | Becomes |
|---------|---------|
| `null` | null |
| `true` / `false` only (lowercase) | bool |
| JSON-like integers | int |
| JSON-like floats | float |
| Anything else | **error** (not silently a string) |

So `True`, `Null`, `0o7`, `0x3A`, `+12.3` are **invalid** as plains under JSON schema—they are not quietly strings. Portable “JSON-in-YAML” files should look like JSON literals.

### 3. Core schema plain resolution (default recommendation)

Same tags as JSON schema. Broader plains; if nothing matches → **string** (not error).

| Matches (intuition) | Becomes |
|---------------------|---------|
| `null` / `Null` / `NULL` / `~` / empty | null |
| `true`/`True`/`TRUE` / `false`/`False`/`FALSE` | bool |
| Decimal ints; `0o…` octal; `0x…` hex | int |
| Floats; `.inf` / `.nan` family (case variants) | float |
| Everything else | **str** |

**Important:** Core 1.2 does **not** treat `yes` / `no` / `on` / `off` as booleans. That wider set is **YAML 1.1** folklore still alive in many libraries—quote those tokens when they are labels.

### 4. Explicit tags when interop demands it

```yaml
keep_as_string: !!str 2024-01-01
as_int: !!int 3
```

Prefer host-native types when schemas are clear; use explicit tags when automatic resolution fights you and quoting is not enough.

### 5. Other global tags you may see (doors)

| Tag | Literacy |
|-----|----------|
| `!!binary` | Base64-ish binary payload—rare in GitOps; prefer external blobs |
| Timestamps (1.1-era / app schemas) | Often better as quoted strings unless the host defines time types |
| `!!set` / `!!omap` (historical examples) | Spec demos; do not invent for K8s/CI |

### 6. Local tags and application types

Language loaders may map `!Something` to native classes. Useful for trusted app serialization—and the core of **unsafe load** (chapter **10**). Ordinary infra manifests should stay on failsafe/JSON/Core data tags only.

### 7. Merge key heritage

The `<<` merge pattern (chapter **05**) comes from older/optional typing practices—not from “Core 1.2 guarantees merge everywhere.” Confirm loader support; prefer generators when portability matters.

### 8. Validation vs typing

YAML type resolution ≠ Kubernetes/Action/Ansible acceptance. Chapter **08** owns parse vs host schema validation.

### 9. JSON Schema over YAML text

CI often loads YAML → JSON-compatible data → JSON Schema. Design configs to survive that path: avoid relying on YAML-only constructs the bridge drops or rejects.

---

## 3. Applications and use cases

| Angle | Typing role |
|-------|-------------|
| **Application** | Feature flags as real bools; enum strings quoted |
| **Systems** | Numeric ports as numbers; names as strings |
| **Security** | Type confusion can bypass checks that assume strings; local tags expand loader risk |
| **Ops** | Parser upgrade regressions show up as wrong types |
| **SE** | Document quoting policy + schema/parser pin together |

**Whole-engineering picture:** typing is where format literacy meets **product correctness**.

---

## 4. Staff-level review checklist

- Team knows whether the loader behaves like **Core**, **JSON**, or **1.1-flavored** resolution.
- Product string fields that look like bools/numbers are quoted (or `!!str`) as required.
- Real bools/numbers are used where the host schema requires them.
- No custom application tags in ordinary infra manifests.
- Hex/octal/inf/nan plains are intentional integers/floats—or quoted.
- Critical keys have tests or dry-runs that assert loaded types.

---

## References

- [YAML 1.2.2 specification — recommended schemas](https://yaml.org/spec/1.2.2/)
- [YAML 1.1 specification](https://yaml.org/spec/1.1/)
- [YAML home](https://yaml.org/)
- [JSON Schema](https://json-schema.org/)
- [JSON track](../JSON/README.md)
