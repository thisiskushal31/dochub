# What YAML is (and is not)

[← Back to YAML](./README.md)

## What this chapter covers

The decision map before the syntax chapters: **what** YAML is, **why** it won config surfaces, how it compares to **JSON**, **XML**, and **HCL**, and when to pick YAML for a file versus another format. Default narrative: **YAML 1.2** (revision **1.2.2**).

---

## 1. Concepts

### 1. What YAML is (plain language)

YAML is a **text format for structured data**. Three primitives cover almost every config you will see:

| Primitive | Everyday name | Typical look |
|-----------|---------------|--------------|
| **Mapping** | Object / dict / map | `key: value` under indent |
| **Sequence** | Array / list | `- item` lines |
| **Scalar** | String, number, bool, null | A single leaf value |

Parsers turn that text into native structures your program or tool already understands. YAML is **Unicode-based** and designed to feel natural next to dynamic languages (Python, Ruby, JavaScript, and peers).

You produce YAML (serialize or hand-edit) or consume it (parse into memory). There is no YAML runtime for business logic—the **host tool** interprets the loaded data.

### 2. Why YAML exists

Config authors wanted something **easier to edit by hand** than JSON (comments, less punctuation) and **lighter** than XML for nested settings. YAML kept mappings and sequences as first-class citizens and added human-oriented features: comments, multiline scalars, anchors for reuse, and optional document streams.

The tradeoff is complexity: the same friendliness that helps humans introduces **typing surprises**, **indent sensitivity**, and **loader security** questions that JSON largely avoids.

### 3. What YAML is good at

| Strength | Why it matters |
|----------|----------------|
| Human editability | Comments, readable nesting, optional quotes |
| Nested config | Natural tree for K8s objects, CI jobs, playbooks |
| Multi-document streams | Several roots in one file (`---`) when tools allow |
| JSON kinship | JSON is largely a subset of YAML 1.2—interop doors exist |

### 4. What YAML is not

| Not this | Reality |
|----------|---------|
| A programming language | No loops/functions in the format itself |
| A schema | Shape rules come from the **host** (K8s API, Action schema, JSON Schema, …) |
| “Just JSON with comments” | Extra features and historical typing make that unsafe as a mental model |
| Guaranteed identical across libraries | 1.1 vs 1.2 and schema choices change loaded types |
| A substitute for secrets management | Plaintext in repo is still plaintext |

### 5. Mental model

> Hand-edited tree of maps, lists, and leaves → parser + schema → native data → tool behavior.

Hold: **indentation is structure**, **typing depends on schema/version**, **validation is separate from parsing**.

---

## 2. Advanced concepts

### 1. YAML vs JSON

| Dimension | YAML | JSON |
|-----------|------|------|
| Comments | Yes (`#`) | No |
| Trailing commas | Not in JSON-compatible subset; YAML has its own rules | Forbidden |
| Quotes | Often optional | Keys and strings require `"` |
| Multiline | First-class (`|`, `>`) | Escapes / arrays of lines by convention |
| Typing | Schema/version dependent | Narrow literal set |
| Interchange strictness | Weaker unless you discipline the subset | Strong default for APIs |

Prefer **JSON** at system boundaries that must be unambiguous. Prefer **YAML** for human-maintained config when the team accepts format literacy. See the [JSON](../JSON/README.md) track for interchange depth.

### 2. YAML vs XML

XML shines for documents with mixed content, namespaces, and heavy schema tooling. YAML wins for **nested settings** that map to dicts and lists. Do not “convert XML thinking” (attributes vs elements) into YAML—model the data as maps and sequences.

### 3. YAML vs HCL

[HCL](../HCL/README.md) is a **configuration language** with expressions, blocks, and tool-specific vocabularies (Terraform, Packer, …). YAML is a **serialization format**. Different jobs: HCL when the HashiCorp toolchain owns the file; YAML when the ecosystem standardized on YAML.

### 4. History literacy (enough to avoid myths)

YAML grew as a serialization language; JSON appeared and was found to be nearly a subset. **1.2** focused on being a strict JSON superset and toning down problematic implicit typing. Many tools still behave with **1.1-era** reflexes—chapter **06–07** own that gap. YAML is not “new” in 2020s terms; what is new is how many platforms made it the default edit surface.

### 5. Decision tree: when to pick YAML for a file

| Question | If yes… |
|----------|---------|
| Does the **host require** YAML (K8s, many CI systems, Ansible)? | Use YAML; learn the host schema next |
| Is the file primarily **machine interchange** between services? | Prefer JSON (or a binary encoding) |
| Do humans edit daily and need **comments**? | YAML is a strong fit |
| Must every consumer agree on types without a schema? | Prefer JSON or quote aggressively in YAML |
| Is the toolchain Terraform/Packer-shaped? | Prefer HCL |

### 6. “Looks like YAML” vs “is YAML”

Editors accept many near-misses. Staff standard: a file is YAML only when a **pinned parser** accepts it and the **host schema** accepts the loaded tree. Pretty indentation is not a certificate.

### 7. Load and dump

YAML conversion has two directions:

| Direction | Informal name | Result |
|-----------|---------------|--------|
| Text → native data | **Load** | In-memory maps/lists/scalars (or app objects if unsafe tags) |
| Native data → text | **Dump** | A presentation (indent style, quotes, anchors) chosen by the dumper |

Two dumps of the same data can look different and still be equivalent. Two loads of “similar-looking” text can disagree if schemas differ. Design reviews around **loaded data + host validation**, not only textual beauty.

### 8. Information model in one sentence

YAML’s model is a **graph of tagged nodes** (with anchors allowing shared structure), presented as a character stream. You do not need the full formal chapters to edit configs—but this explains aliases, tags, and why “same meaning, different spelling” exists.

---

## 3. Applications and use cases

| Angle | How this chapter shows up |
|-------|---------------------------|
| **Application** | App config files, feature flags as data, localization-adjacent structures |
| **Systems** | Service mesh / platform objects authored as YAML trees |
| **Security** | Format choice affects injection and loader risk (chapter **10**) |
| **Ops** | Manifests and pipeline files as the change vehicle |
| **SE** | Onboarding: teach format rules before tool folklore |

**Whole-engineering picture:** YAML is the **edit surface**; the product contract is still the host API or schema.

---

## 4. Staff-level review checklist

- The file’s job is named: human config vs interchange vs tool-required format.
- Team knows this is **data**, not executable YAML “scripts.”
- JSON/HCL alternatives were considered where the host allows choice.
- Readers are pointed to **02+** for syntax and **10** before loading untrusted input.
- Host schema ownership is clear (who defines valid keys)—not “whatever parses.”

---

## References

- [YAML home](https://yaml.org/)
- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
- [JSON track](../JSON/README.md)
- [HCL track](../HCL/README.md)
