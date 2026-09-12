# Where YAML is going and adjacent doors

[← Back to YAML](./README.md)

## What this chapter covers

Why YAML **persists**, how it sits beside **JSON** and **HCL**, what you can already do after chapters **01–10** and **12**, and **what to learn next**—for practitioners learning or revising the format.

---

## 1. Concepts

### 1. What this track already owns

| You own now | Chapters |
|-------------|----------|
| Format identity and comparisons | **01** |
| Syntax, scalars, nesting | **02–04** |
| Anchors / merges | **05** |
| Versions and schemas | **06–07** |
| Tooling and validation | **08** |
| Host signposts and roles | **09** |
| Safe load and secrets hygiene | **10** |
| Decode any stranger YAML on sight | **12** |

### 2. Why YAML persists

Human editability, ecosystem defaults (K8s, CI, Ansible), and comment support keep YAML entrenched. Spec work continues to clarify and modernize; **1.2.2** is an informational cleanup of 1.2 with an eye toward healthier evolution. The format’s future is less about flashy syntax and more about **safer implementations and clearer schemas**.

### 3. Where YAML usually goes (today)

| Destination | Door |
|-------------|------|
| Cluster desired state | [Cloud-Native](../../Cloud-Native/README.md) |
| Pipelines as code | [CiCd](../../CiCd/README.md) |
| Automation playbooks | [IAC](../../IAC/README.md) / [Automation](../../Automation/README.md) |
| Strict interchange | [JSON](../JSON/README.md) |
| HashiCorp provisioning | [HCL](../HCL/README.md) |

### 4. YAML path vs JSON path

| Prefer YAML when… | Prefer JSON when… |
|-------------------|-------------------|
| Humans edit weekly | Machines interchange at APIs |
| Host requires YAML | Consumers must agree without schema drama |
| Comments matter | You want minimal grammar |

### 5. The orientation sentence

> **YAML is the human edit surface; the contract is still the host schema. Pin the parser, quote ambiguous scalars, validate after parse, and load safely.**

### 6. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| Indentation, types, anchors | **Yes** | Spec + practice |
| Decode stranger YAML | **Yes** (**12**) | Host docs for field meaning |
| Safe load habits | **Yes** (**10**) | Language library docs for API names |
| Kubernetes fields | **No** | Cloud-Native |
| GitHub Actions keys | **No** | CiCd |
| Terraform blocks | **No** | HCL + IAC/Terraform |

### 7. When to stay on YAML

Stay when the host is YAML-native and the team can maintain quoting/lint discipline. Move work to generators (Helm, Kustomize, CDK) when copy-paste and anchors become the product.

---

## 2. Advanced concepts

### 1. How to choose what to learn next

Pick by **job to be done**, not by “more YAML features.”

### 2. What to learn next

#### A. Cloud-Native (default for cluster work)

Manifests, controllers, Helm values—format skills transfer immediately.

#### B. CiCd

Workflow YAML + secrets + reusable workflows.

#### C. JSON track

Interchange strictness, JSON Schema depth, security parallels.

#### D. HCL track

When the repo’s source of truth is Terraform/Packer—not “YAML with different braces.”

#### E. Policy / schema specialization

JSON Schema, OPA/Gatekeeper-style policy as data—validate intent beyond parse.

#### F. Generators

Helm, Kustomize, Jsonnet, CDK for Kubernetes—emit YAML; review rendered output (**08**).

### 3. Role paths (after this track)

| Role | Next |
|------|------|
| Platform | Cloud-Native + schema gates |
| CI engineer | CiCd + secret hygiene |
| App engineer | JSON APIs + app config patterns |
| Security | **10** depth + host admission policy |
| SE | Org lint/quoting standard |

### 4. Common wrong turns

| Wrong turn | Better move |
|------------|-------------|
| Memorizing every K8s field in this folder | Open Cloud-Native |
| Treating YAML as executable code | Keep data + host logic separate |
| Unsafe load “for convenience” | Safe load + explicit code for objects |
| One mega-file of anchors | Generator or split documents |

---

## 3. Applications and use cases

| Angle | Next-skill use |
|-------|----------------|
| **Application** | JSON APIs + YAML config coexistence |
| **Systems** | GitOps pipelines consuming validated YAML |
| **Security** | Loader audits across languages |
| **Ops** | Pin apply tooling; render-diff PRs |
| **SE** | Format literacy first, then one host deep-dive |

**Whole-engineering picture:** finish format literacy, then go deep on **one host**—that is the career path.

---

## 4. Staff-level review checklist

- Learner can explain YAML vs JSON vs HCL in one minute.
- Next host track is chosen deliberately.
- Parser pin + quoting policy travel with the team to that host.
- Generators are considered before alias graphs become unreviewable.
- Security habits from **10** are not dropped when learning K8s/CI fields.

---

## References

- [YAML home](https://yaml.org/)
- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
- [JSON Schema](https://json-schema.org/)
- [JSON track](../JSON/README.md)
- [HCL track](../HCL/README.md)
- [Cloud-Native](../../Cloud-Native/README.md)
- [CiCd](../../CiCd/README.md)
- [IAC](../../IAC/README.md)
