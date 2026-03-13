# How HCL works in each tool (SRE perspective)

This topic explains how HCL is used in each HashiCorp tool so you can understand every word you write. As an SRE you may use Terraform, Packer, Vault, Nomad, Consul, Boundary, and Waypoint; in every case the syntax is HCL—arguments, blocks, expressions, types—but each tool defines its own block types and file conventions. Knowing the vocabulary (block names, labels, and typical arguments) lets you read and write config confidently across the stack.

---

## Terraform

**Role:** Provision and manage infrastructure (cloud and on-prem). You declare resources, variables, and outputs; Terraform plans and applies changes.

**Files:** `.tf` (and optionally `.tf.json`). Config can be split across many files in a directory; Terraform merges them.

**Main HCL blocks you write:** `terraform` (backend, required_providers), `provider`, `resource`, `data`, `variable`, `output`, `module`, `locals`. Each block type has a fixed number of labels. For example, `resource` has two labels: resource type (e.g. `aws_instance`) and local name (e.g. `example`). Arguments inside depend on the provider or resource type.

**How HCL works here:** You write declarative blocks; Terraform parses them, builds a dependency graph, and applies changes to match desired state. Expressions (references, functions, conditionals, for expressions) let you parameterize and reuse values. State and workflow (plan, apply, modules, workspaces, remote backends) are covered in the IAC section under Terraform.

```
resource "aws_instance" "example" {
  ami           = var.ami_id
  instance_type = "t3.micro"
  tags = {
    Name = "example"
  }
}
```

---

## Packer

**Role:** Build machine images and artifacts (AMIs, container images, Vagrant boxes, etc.). You define sources (builders), provisioners, and post-processors; Packer runs the pipeline to produce an artifact.

**Files:** `.pkr.hcl` (and optionally `.pkr.json`). Often split into `variables.pkr.hcl`, `sources.pkr.hcl`, `build.pkr.hcl`. `packer build <dir>` uses all HCL in that directory.

**Main HCL blocks you write:** `packer` (version constraints), `required_plugins`, `variable`, `locals`, `source`, `build`, `provisioner`, `post-processor`, `data`. A `source` block has two labels: builder type (e.g. `amazon-ebs`) and a local name. A `build` block references one or more sources and attaches provisioners and post-processors. Arguments inside each block follow the plugin schema.

**How HCL works here:** You describe what to build and how; Packer runs builders (which produce an image), then provisioners (which configure it), then post-processors (which transform or export it). Variables and locals let you parameterize; data sources can look up values (e.g. latest AMI) at build time.

```
source "amazon-ebs" "app" {
  ami_name      = "my-app-{{timestamp}}"
  instance_type = "t3.micro"
  source_ami_filter { ... }
}

build {
  sources = ["source.amazon-ebs.app"]
  provisioner "shell" {
    scripts = ["scripts/setup.sh"]
  }
}
```

---

## Vault

**Role:** Secrets management, encryption as a service, and identity-based access. Policies control who can read or write which paths.

**Files:** Policy documents are often `.hcl` (e.g. `policy.hcl`). Vault also uses HCL in configuration files for the server and in some auth method config.

**Main HCL you write:** Policy rules use a path-based block structure. You write `path` blocks (or equivalent) to grant capabilities (`read`, `write`, `list`, `delete`, etc.) on paths. The exact block names and arguments depend on the policy syntax version (ACL vs Sentinel or newer); the idea is path + capabilities expressed in HCL.

**How HCL works here:** Policies are parsed by Vault and enforced when clients request access. Understanding HCL helps you read and write policies, tune path rules, and keep policy files in version control. Secrets and auth methods are configured via API or CLI; HCL is the language of policy definition.

```
path "secret/data/*" {
  capabilities = ["read", "list"]
}

path "secret/data/app/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
```

---

## Nomad

**Role:** Job scheduling and cluster orchestration. You submit job specs that define task groups, tasks, resources, and drivers (Docker, exec, etc.); Nomad places and runs them on clients.

**Files:** Job specs are typically `.nomad.hcl`, `.hcl`, or inline. One job per file is common. Nomad parses HCL and accepts it via CLI or API (often converted to JSON internally).

**Main HCL blocks you write:** `job` (one per file), `group`, `task`, plus nested blocks such as `network`, `service`, `resources`, `config`, `template`, `volume`, `connect`. The `job` block has one label (job name). `group` and `task` each have one label. Driver-specific config goes inside `task` in a `config` block. Service discovery and mesh use `service` and `connect`.

**How HCL works here:** You describe workloads declaratively; Nomad schedules them, handles placement, restarts, and updates. The same HCL grammar (arguments, blocks, expressions) applies; Nomad defines the job schema. SREs use this to define services, resource limits, and rollout behavior.

```
job "api" {
  datacenters = ["dc1"]
  type        = "service"

  group "api" {
    count = 3
    network {
      port "http" {}
    }
    task "server" {
      driver = "docker"
      config {
        image = "myapp:latest"
        ports = ["http"]
      }
      resources {
        cpu    = 500
        memory = 256
      }
    }
  }
}
```

---

## Consul

**Role:** Service discovery, health checking, and service mesh. You register services, define intentions, and configure mesh behavior.

**Files:** Service definitions and config can be expressed in HCL (or JSON). Config files and agent config may use HCL; exact file names and layout depend on deployment (agent config, service definitions, or API payloads).

**Main HCL blocks you write:** `service` (with optional `check`, `checks`, or `connect`), and in agent config various top-level blocks. A `service` block has arguments such as `name`, `id`, `port`, `tags`, `address`, and nested `check` or `checks` for health checks.

**How HCL works here:** Consul accepts service definitions and configuration in HCL form. Block types and arguments follow Consul’s schema (e.g. service definitions, mesh config). The same HCL syntax—blocks, attributes, expressions—applies so that config is readable and versionable. SREs use this to define services, checks, and mesh policies in code.

```
service {
  name = "api"
  id   = "api-1"
  port = 8080
  tags = ["http", "v1"]

  check {
    name     = "http"
    http     = "http://127.0.0.1:8080/health"
    interval = "10s"
    timeout  = "2s"
  }
}
```

---

## Boundary

**Role:** Identity-based access to infrastructure (SSH, RDP, databases, etc.) without exposing network details. You define scopes, targets, host catalogs, and credential stores.

**Files:** Boundary config can be written in HCL for resources (e.g. targets, host catalogs). Terraform’s Boundary provider is often used to manage Boundary in HCL as part of Terraform config; standalone Boundary HCL config is also used for resource definitions.

**Main HCL blocks you write:** When using the Terraform Boundary provider, you use Terraform blocks such as `resource "boundary_scope"`, `resource "boundary_target"`, `resource "boundary_host_catalog"`, `resource "boundary_host_set"`, and `resource "boundary_credential_store"`. Each has tool-specific arguments (e.g. scope_id, name, type, address).

**How HCL works here:** You write blocks that represent Boundary objects (scopes, targets, hosts). The language is HCL; the block types and arguments are defined by Boundary (or by the Terraform provider). SREs use this to codify access boundaries and integrate with Terraform and Vault.

```
resource "boundary_target" "ssh" {
  name         = "api-servers"
  type         = "tcp"
  scope_id     = boundary_scope.project.id
  default_port = 22

  host_source_ids = [
    boundary_host_set.servers.id
  ]
}
```

---

## Waypoint

**Role:** Deploy and release workflow (build, deploy, release) with a consistent interface across platforms (Kubernetes, Nomad, AWS, etc.).

**Files:** `waypoint.hcl` in the project root. One project block; app, build, deploy, and release blocks define the pipeline.

**Main HCL blocks you write:** `project`, `app`, `build`, `deploy`, `release`, and optionally `config` blocks. Each stage (build, deploy, release) can have a plugin (e.g. `docker`, `kubernetes`, `nomad`) with plugin-specific arguments.

**How HCL works here:** You describe the application and its build/deploy/release steps in HCL; Waypoint runs the pipeline. The same HCL grammar applies; Waypoint defines the block types. SREs use this to standardize how apps are built and deployed across environments.

```
project = "my-app"

app "web" {
  build {
    use "docker" {}
  }
  deploy {
    use "kubernetes" {
      replicas = 2
    }
  }
}
```

---

## Summary: one language, many vocabularies

Across Terraform, Packer, Vault, Nomad, Consul, Boundary, and Waypoint you always write **HCL**: arguments assign values, blocks group configuration, and expressions produce values. What changes per tool is the **vocabulary**—block type names, labels, and allowed arguments. Learning that vocabulary for each tool (and referring to each tool’s docs for the full schema) lets you understand every word you write. For Terraform-specific workflow (state, modules, workspaces, pipelines), see the IAC and Terraform sections of the handbook.

---

## Further reading

- [Terraform: Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Packer: Built-in blocks](https://developer.hashicorp.com/packer/docs/templates/hcl_templates/blocks)
- [Vault: Policy documentation](https://developer.hashicorp.com/vault/docs/concepts/policies)
- [Nomad: Job specification](https://developer.hashicorp.com/nomad/docs/job-specification)
- [Consul: Configuration](https://developer.hashicorp.com/consul/docs/agent/config)
- [Boundary: Documentation](https://developer.hashicorp.com/boundary/docs)
- [Waypoint: Configuration](https://developer.hashicorp.com/waypoint/docs/waypoint-hcl)
- [IAC (Infrastructure as Code)](../../IAC/README.md) — Terraform and other IaC tools
- [Terraform (IAC)](../../IAC/Terraform/README.md) — Terraform workflow, state, modules, pipelines
