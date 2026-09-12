# HCL (HashiCorp Configuration Language)

[← Back to Languages](../README.md)

This section is a **deep dive** into HCL as a language so you can **understand every word you write** in config for Terraform, Packer, Vault, Nomad, Consul, Boundary, and Waypoint. It answers: **What is this language?** **Why is it used?** **How can I use it?** **What are the use cases?** The goal is to cover HCL from the **full SRE perspective**—not only Terraform but the whole HashiCorp stack. You learn what HCL is, its syntax and structure (arguments, blocks, identifiers, comments), expressions and types (strings, interpolation, templates), where HCL is used, and **how HCL works in each tool** (block types, files, vocabulary) so you know exactly what you are writing when you use any of these tools. Terraform-specific workflow (state, modules, workspaces, pipelines) is in **IAC/Terraform**; this folder teaches the language and how it is used across the stack. Each topic is self-contained: the body never attributes content to external sources; explanations come first, then code only when it illustrates the idea. For more depth, use the links in the Further reading section at the end of each file.

---

## How to read this section

Read in **number order** for a single path: **language first**, then **where it’s used**.

- **Basics:** What HCL is, why it exists, and how it relates to Terraform, Packer, and other tools.
- **Language:** Syntax and structure (arguments, blocks, identifiers, comments, encoding).
- **Expressions and types:** Values, literals, interpolation, heredocs, and template directives.
- **Use cases:** Where HCL is used across the stack (topic 4) and **how HCL works in each tool** from an SRE perspective—Terraform, Packer, Vault, Nomad, Consul, Boundary, Waypoint—so you understand every word you write (topic 5). Terraform workflow lives in **IAC/Terraform**.

---

## Topic index

| # | Topic | File |
|---|--------|------|
| 1 | What is HCL? | [1_What_Is_HCL.md](./1_What_Is_HCL.md) |
| 2 | Syntax and structure | [2_Syntax_And_Structure.md](./2_Syntax_And_Structure.md) |
| 3 | Expressions and types | [3_Expressions_And_Types.md](./3_Expressions_And_Types.md) |
| 4 | Where HCL is used and use cases | [4_Where_HCL_Is_Used_And_Use_Cases.md](./4_Where_HCL_Is_Used_And_Use_Cases.md) |
| 5 | How HCL works in each tool (SRE perspective) | [5_How_HCL_Works_In_Each_Tool_SRE.md](./5_How_HCL_Works_In_Each_Tool_SRE.md) |

---

## Terraform and IAC: where use cases live

HCL is the configuration language for **Terraform** (`.tf` files). Terraform-specific content—providers, state management, modules, workspaces, remote backends, and use in multi-cloud and CI/CD pipelines—lives in the handbook under **Infrastructure as Code**, not duplicated here:

- **[IAC (Infrastructure as Code)](../../IAC/README.md)** — IAC concepts, patterns, and tool index.
- **[Terraform](../../IAC/Terraform/README.md)** — Terraform: HCL in practice, providers, state, modules, workspaces, pipelines.

Use this HCL section to learn the **language** and **how HCL works in each tool** (topic 5); use IAC/Terraform for **Terraform implementation** and workflow (state, modules, pipelines).

---

## Scope: what’s covered here and what’s elsewhere

**Covered here:** HCL as a language—what it is, why and how to use it, syntax (arguments, blocks, identifiers, comments, encoding), expressions and types (primitives, collections, literals, interpolation, heredocs, templates), where HCL is used, and **how HCL works in each tool** (Terraform, Packer, Vault, Nomad, Consul, Boundary, Waypoint) from an SRE perspective so you understand every word you write. No attribution in the body; further reading at the end of each file.

**Covered under IAC/Terraform:** Terraform providers, state, modules, workspaces, remote backends, multi-cloud patterns, and CI/CD integration. See the links above.

---

## Further reading

- [Terraform: Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Terraform: Expressions](https://developer.hashicorp.com/terraform/language/expressions)
- [Packer: HCL syntax reference](https://developer.hashicorp.com/packer/docs/templates/hcl_templates/syntax)
- [HCL native syntax specification (GitHub)](https://github.com/hashicorp/hcl/blob/main/hclsyntax/spec.md)
- [IAC (Infrastructure as Code)](../../IAC/README.md)
- [Terraform (IAC)](../../IAC/Terraform/README.md)
