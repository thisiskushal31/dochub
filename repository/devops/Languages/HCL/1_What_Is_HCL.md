# What is HCL?

HCL (HashiCorp Configuration Language) is a configuration language designed to be human-readable and machine-friendly. It is a declarative DSL: you describe desired state (resources, variables, outputs) rather than steps to get there. It is not a general-purpose programming language; it has no loops in the traditional sense at the syntax level, and control flow is expressed through expressions (conditionals, for expressions) and block structure. HCL is used across several HashiCorp products and by other tools that adopt its syntax.

**What it is.** HCL is built around two core constructs: **arguments** (name–value pairs that assign a value to an identifier) and **blocks** (containers with a type, optional labels, and a body of nested arguments and blocks). Files are UTF-8 encoded and use a small, consistent set of delimiters. The same structural language appears in Terraform (`.tf`), Packer (`.pkr.hcl`), and other tools; each tool defines its own block types and semantics. Terraform’s configuration language is based on HCL; Terraform docs often use “argument” where the underlying HCL spec uses “attribute”—the ideas are the same.

**Why it is used.** Teams and SREs use HCL to write infrastructure-as-code, machine images, secrets policies, job specs, and deployment config in a single, readable format. It supports interpolation and templates so values can be derived from variables and other data. Because the whole HashiCorp stack (Terraform, Packer, Vault, Nomad, Consul, Boundary, Waypoint) uses HCL, learning the language once lets you understand every word you write in any of these tools. Tool-specific behavior (block types, file names, semantics) is defined by each product; the language itself stays consistent.

**How you use it.** You write `.tf`, `.pkr.hcl`, or other tool-specific files in HCL syntax. You run the appropriate CLI (e.g. `terraform plan`, `packer build`) to validate and apply the configuration. No separate “HCL runtime” is required—each tool parses and evaluates HCL as part of its own execution.

**How HCL usually works.** A config file is parsed into a tree of **blocks** and **attributes** (arguments). Each block has a type and optional labels; its body holds attributes and nested blocks. The tool (Terraform, Packer, etc.) does not execute HCL on its own—it reads the structure, resolves references and expressions, and then applies its own semantics (e.g. Terraform builds a resource graph, Packer runs a build pipeline). So: you author HCL; the tool parses it, evaluates expressions, and acts on the resulting configuration. The same syntax can therefore describe different things depending on the tool (e.g. a `variable` block means something different in Terraform vs Packer), but the grammar and the way blocks and attributes nest are shared.

**Use cases.** HCL is used for infrastructure definition (Terraform), image builds (Packer), policy and secrets config (Vault), job and cluster config (Nomad, Consul), and other HashiCorp product configs. Terraform-specific use cases—providers, state, modules, workspaces, remote backends, and use in multi-cloud and CI/CD pipelines—are covered in the handbook under **IAC (Infrastructure as Code)** and **Terraform**, not duplicated here.

---

## Further reading

- [Terraform: Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Packer: HCL syntax reference](https://developer.hashicorp.com/packer/docs/templates/hcl_templates/syntax)
- [HCL native syntax specification (GitHub)](https://github.com/hashicorp/hcl/blob/main/hclsyntax/spec.md)
- [IAC (Infrastructure as Code)](../../IAC/README.md) — Terraform and other IaC tools
- [Terraform (IAC)](../../IAC/Terraform/README.md) — Terraform use cases and coverage
