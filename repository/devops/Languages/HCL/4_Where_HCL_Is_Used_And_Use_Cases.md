# Where HCL is used and use cases

HCL is the configuration language for the HashiCorp stack. From an SRE perspective you need to understand not only Terraform but Packer, Vault, Nomad, Consul, Boundary, and Waypoint—each uses HCL so that you can read and write config in one language across provisioning, images, secrets, scheduling, mesh, access, and deployments. This topic summarizes where HCL appears and how it fits into SRE workflows. **Topic 5** explains how HCL works in each tool (block types, files, vocabulary) so you understand every word you write.

## SRE perspective: the full stack

SREs operate and automate infrastructure end-to-end. In practice that often means:

- **Provisioning** (Terraform) — infra as code, state, modules, providers.
- **Imaging** (Packer) — machine and container images, pipelines, provisioners.
- **Secrets and identity** (Vault) — policies, auth methods, dynamic secrets.
- **Scheduling** (Nomad) — jobs, task groups, drivers, resources, updates.
- **Discovery and mesh** (Consul) — services, health checks, intentions, mesh config.
- **Access** (Boundary) — targets, scopes, host catalogs, credential stores.
- **Deployments** (Waypoint) — build, deploy, release across platforms.

In every case the config you write is **HCL**. The syntax (arguments, blocks, expressions, types) is the same; only the block types and semantics change per tool. Learning HCL once lets you read and write config for the whole stack. For the exact blocks and arguments you will write in each tool, see **topic 5**.

## Tools that use HCL

| Tool | Role | Typical file / context |
|------|------|------------------------|
| **Terraform** | Infrastructure-as-code: provision and manage cloud and on-prem resources | `.tf` files; providers, resources, variables, outputs, modules |
| **Packer** | Machine and container image builds | `.pkr.hcl` templates; sources, builds, provisioners, post-processors |
| **Vault** | Secrets management, policy, auth methods | `.hcl` policy files; path and capability rules |
| **Nomad** | Job scheduling and cluster orchestration | `.nomad.hcl` / `.hcl` job specs; job, group, task, service, resources |
| **Consul** | Service mesh, service discovery, config | HCL for service definitions and agent/mesh config |
| **Boundary** | Identity-based access to infrastructure | HCL for targets, scopes, host catalogs (or via Terraform provider) |
| **Waypoint** | Deploy and release workflow | `waypoint.hcl`; project, app, build, deploy, release |

In each case, the same HCL syntax (arguments, blocks, expressions, types) is used; the block types and semantics are defined by the tool. Learning HCL once lets you read and write config for all of these.

## Use cases by domain

- **Infrastructure provisioning** — Define cloud and on-prem resources declaratively (Terraform). Use variables, modules, and expressions to keep config DRY and environment-specific.
- **Image and artifact builds** — Define build pipelines and machine images (Packer). Parameterize with variables and use HCL blocks for sources, builds, provisioners, and post-processors.
- **Secrets and policy** — Configure access and policy rules (Vault) in a structured, versionable format.
- **Scheduling and service mesh** — Define jobs and mesh config (Nomad, Consul) in HCL for consistency with the rest of the stack.
- **Security and access** — Describe targets and access (Boundary) in HCL alongside other infra config.
- **Deploy and release** — Define build/deploy/release pipelines (Waypoint) in HCL for consistent app deployment.

Terraform-specific workflow (state, remote backends, modules, workspaces, multi-cloud, CI/CD pipelines) is covered in the handbook under **IAC** and **Terraform**; topic 5 in this section covers how HCL works in Terraform and every other tool in the stack.

## Where to go next

- **Topic 5** — [How HCL works in each tool (SRE perspective)](./5_How_HCL_Works_In_Each_Tool_SRE.md): block types, file conventions, and vocabulary for Terraform, Packer, Vault, Nomad, Consul, Boundary, and Waypoint so you understand every word you write.
- **[IAC (Infrastructure as Code)](../../IAC/README.md)** — IAC concepts, patterns, and tool index.
- **[Terraform](../../IAC/Terraform/README.md)** — Terraform workflow: providers, state, modules, workspaces, remote backends, and use in multi-cloud and pipelines.

---

## Further reading

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
- [Packer documentation](https://developer.hashicorp.com/packer/docs)
- [Vault documentation](https://developer.hashicorp.com/vault/docs)
- [IAC (Infrastructure as Code)](../../IAC/README.md)
- [Terraform (IAC)](../../IAC/Terraform/README.md)
