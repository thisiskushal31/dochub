# Infrastructure as Code

IAC concepts, patterns, and tools. **Each tool has its own folder**; add new tools as new folders. *Content is in placeholder form; will be expanded.*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [IAC concepts and patterns](./1_IAC_Tools_And_Patterns.md) | What is IAC; modules, workspaces, versioning; when to use which tool |
| 2 | [State, backends, and idempotency](./2_State_Modules_And_Backends.md) | State management, remote backends, idempotency, testing (concepts) |
| 3 | [Multi-cloud and best practices](./3_Multi_Cloud_And_Best_Practices.md) | Abstraction, provider management, environment parity |

## Tools (one folder per tool)

| Tool | Description |
|------|-------------|
| [**Terraform**](./Terraform/README.md) | HCL, providers, state, modules, multi-cloud |
| [**Ansible**](./Ansible/README.md) | Playbooks, roles, config management |
| [**Puppet**](./Puppet/README.md) | Manifests, modules, agent/master |
| [**Chef**](./Chef/README.md) | Cookbooks, recipes, infrastructure automation |
| [**Crossplane**](./Crossplane/README.md) | Cloud-native control plane, Kubernetes-native infra |
| [**CloudFormation**](./CloudFormation/README.md) | AWS stacks, templates, drift |
| [**Pulumi**](./Pulumi/README.md) | IaC in TypeScript, Python, Go |

To add a new tool: create a folder (e.g. `NewTool/README.md`) and add it to the table above. Community-maintained.

## Scope

- **Covered here:** IAC from a DevOps perspective. No duplicate of cloud provider–specific deep dives.
- **Go deeper:** Provider docs and [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) when touching DB/state backends.
