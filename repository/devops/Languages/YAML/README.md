# YAML

[← Back to Languages](../README.md)

**YAML** (YAML Ain’t Markup Language; rhymes with “camel”) is a **human-friendly, Unicode data serialization format**. You write mappings, sequences, and scalars in indented text; parsers load that text into native structures (dicts/maps, lists/arrays, strings/numbers/bools). You do not “run” YAML—tools **parse** it and then act.

YAML is the everyday surface for **Kubernetes** manifests, **CI/CD** pipeline files, **Ansible** playbooks, Helm values, and many cloud and app configs. This track teaches **the format itself**: syntax, typing pitfalls, anchors, versions (1.2 vs 1.1), tooling, and security review habits. It is **not** a Kubernetes encyclopedia, an Ansible course, or a GitHub Actions manual—those workflows live under [Cloud-Native](../../Cloud-Native/README.md), [CiCd](../../CiCd/README.md), [IAC](../../IAC/README.md), and [Automation](../../Automation/README.md). Sibling format tracks: [JSON](../JSON/README.md) and [HCL](../HCL/README.md).

Staff hire YAML fluency for six practical pillars:

1. **Document honesty** — indentation, maps/sequences, block vs flow, comments (chapters **02–04**).
2. **Scalar and type literacy** — quotes, multiline, bool/null surprises, 1.1 vs 1.2 (chapters **03**, **06–07**).
3. **Reuse without traps** — anchors, aliases, merge keys (chapter **05**).
4. **Validation and tooling** — parse vs schema, lint, editor/CI gates (chapter **08**).
5. **Safe load and secrets** — untrusted input, DoS classes, plaintext secrets (chapter **10**).
6. **Decode unfamiliar files** — read any random YAML’s structure and tokens before debating product fields (chapter **12**).

**New to YAML?** Start at chapter **01**, then **02–03**, then **06** before you trust “it looked fine in the editor.” After the spine, use **[12](./12_Reading_Unfamiliar_YAML.md)** as the “open a stranger file” drill.

---

## After this track — what you can write

| You can write / do… | What “done” looks like | Spine chapters |
|---------------------|------------------------|----------------|
| A **valid multi-level config** | Correct indent; maps vs lists clear | **01–04** |
| A **multiline string** without accidental folding | `|` / `>` / chomping chosen deliberately | **03** |
| An **anchor/alias reuse** that reviewers can follow | Named anchors; no surprise cycles | **05** |
| A **1.1 vs 1.2** conversation | Norway/`yes`/`on` pitfalls named | **06–07** |
| A **lint + schema** gate in CI | Parse and validate separated | **08** |
| A **security review** of a YAML loader | Safe load; size/depth; no secrets in VCS | **10** |
| **Read a stranger YAML** from an export or another repo | Root shape, docs, tags/anchors, types named aloud | **12** (+ **02–07**) |
| A **keep YAML vs use JSON/HCL** decision | Host and team skill named | **01**, **09**, **11** |

---

## What to learn next (complement paths)

YAML usually lands inside **another product’s schema**. After this track, pick the next skill by the *host*, not by “more indentation.”

| If your goal is… | Learn next | Start with |
|------------------|------------|------------|
| Kubernetes manifests / Helm / Kustomize | [Cloud-Native](../../Cloud-Native/README.md) | After **02–04**, **08** |
| GitHub Actions / GitLab CI / pipeline YAML | [CiCd](../../CiCd/README.md) | After **02–04**, **10** (secrets) |
| Ansible playbooks / inventory | [IAC](../../IAC/README.md), [Automation](../../Automation/README.md) | After **02–05** |
| Strict interchange / APIs | [JSON](../JSON/README.md) | **01** + JSON subset door in **11** |
| Terraform / Packer language | [HCL](../HCL/README.md) | Different syntax; same “config as code” job |
| Schema-first APIs | [JSON Schema](https://json-schema.org/) + chapter **08** | Validate YAML against JSON Schema where tools allow |

**Suggested order by role**

| Role | After this track |
|------|------------------|
| **Platform / K8s** | **01 → 02–04 → 08 → 10 → 12** → Cloud-Native |
| **CI / release** | **01 → 02–04 → 06 → 10 → 12** → CiCd |
| **Security reviewer** | **01 → 03 → 05–07 → 10 → 12** |
| **App engineer** | **01 → 02–04 → 08 → 12 → 11** (JSON boundary) |

Chapter **[11](./11_Where_YAML_Is_Going_And_Adjacent_Doors.md)** covers what follows.

---

## Versions and brownfield (default narrative)

**Default for new work: YAML 1.2** (spec revision **1.2.2**). Prefer **JSON Schema–friendly** typing (or explicit quotes) so `yes`, `no`, `on`, `off`, and country codes like `NO` do not become booleans. Many production stacks still ship **YAML 1.1–oriented** libraries—treat that as brownfield literacy (chapter **06–07**).

| Pin | Where it shows up | Habit |
|-----|-------------------|-------|
| **1.2 / 1.2.2** | New configs, modern parsers | Default narrative |
| **1.1** | Older libs, some K8s/tooling stacks | Quote ambiguous scalars; know Core schema traps |
| JSON-compatible subset | Dual JSON/YAML pipelines | Prefer flow/JSON-like when interchange matters |
| Multi-document streams (`---`) | Helm, some K8s apply paths | Know document boundaries |

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, gotchas, edge cases)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (six ideas)

1. **YAML is data, not code**—until an unsafe loader turns tags into objects.
2. **Indentation is structure**—spaces, not tabs; nest depth is meaning.
3. **Three primitives**—mapping, sequence, scalar—compose everything.
4. **Typing is schema-dependent**—Failsafe / JSON / Core (and 1.1-era loaders) disagree; quote string labels.
5. **Anchors are reuse**—aliases share nodes; `<<` merge is common but not universal.
6. **Parse ≠ validate**—well-formed YAML can still be the wrong shape for the tool.

| Idea | Review smell if missing | Chapters |
|------|-------------------------|----------|
| Indentation honesty | Tab/space mix; `a:1` mappings; misleading nest | **02**, **04** |
| Scalar quoting | Bare labels; version floats; 1.1 bool words | **03**, **07** |
| Schema pin | “Works in my IDE parser” | **06–08** |
| Anchors | Opaque `*ref` webs; assumed merge everywhere | **05** |
| Safe load | `load` on untrusted input; duplicate-key last-wins | **10** |
| Host schema | Valid YAML, invalid Deployment/Workflow | **08–09** |

---

## How to read this section

**Absolute beginners:** **01 → 02 → 03 → 04 → …**  
If you already edit K8s/CI YAML: **01** (identity) → **03** + **07** (typing) → **05** + **10**—do not skip the format traps behind the tool docs.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation** | 01 | Explain YAML vs JSON/HCL and when to use it |
| **Language core** | 02 → 05 | Write nested configs; multiline; anchors |
| **Versions / types** | 06 → 07 | Reason about 1.1 vs 1.2 and schemas |
| **Ship / check** | 08 → 10 | Lint, schema, safe load, secrets |
| **Decode** | **12** | Read any unfamiliar YAML’s structure on sight |
| **Synthesis** | 09, 11 | Host tools + next skills |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 01 | What YAML is (and is not) | [01_What_YAML_Is_And_Is_Not.md](./01_What_YAML_Is_And_Is_Not.md) |
| 02 | Syntax and structure | [02_Syntax_And_Structure.md](./02_Syntax_And_Structure.md) |
| 03 | Scalars and multiline strings | [03_Scalars_And_Multiline.md](./03_Scalars_And_Multiline.md) |
| 04 | Collections and nesting | [04_Collections_And_Nesting.md](./04_Collections_And_Nesting.md) |
| 05 | Anchors, aliases, and merge keys | [05_Anchors_Aliases_And_Merge.md](./05_Anchors_Aliases_And_Merge.md) |
| 06 | Documents, directives, and versions | [06_Documents_Directives_And_Versions.md](./06_Documents_Directives_And_Versions.md) |
| 07 | Tags, schemas, and typing | [07_Tags_Schemas_And_Typing.md](./07_Tags_Schemas_And_Typing.md) |
| 08 | Tooling, linting, and validation | [08_Tooling_Linting_And_Validation.md](./08_Tooling_Linting_And_Validation.md) |
| 09 | Use cases and engineering perspectives | [09_Use_Cases_And_Engineering_Perspectives.md](./09_Use_Cases_And_Engineering_Perspectives.md) |
| 10 | Security design and review | [10_Security_Design_And_Review.md](./10_Security_Design_And_Review.md) |
| 11 | Where YAML is going and adjacent doors | [11_Where_YAML_Is_Going_And_Adjacent_Doors.md](./11_Where_YAML_Is_Going_And_Adjacent_Doors.md) |
| 12 | Reading unfamiliar YAML | [12_Reading_Unfamiliar_YAML.md](./12_Reading_Unfamiliar_YAML.md) |

---

## Further reading

- [YAML home](https://yaml.org/)
- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML 1.1 specification](https://yaml.org/spec/1.1/) (brownfield)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
- [JSON Schema](https://json-schema.org/)
- [JSON track](../JSON/README.md) — sibling interchange format
- [HCL track](../HCL/README.md) — HashiCorp config language
- [Cloud-Native](../../Cloud-Native/README.md) — Kubernetes / Helm surfaces
- [CiCd](../../CiCd/README.md) — pipeline YAML hosts
- [IAC](../../IAC/README.md) — Ansible and related config
