# Security

Practices, compliance, threat mitigation, and tools. **Each tool has its own folder**; add new tools as new folders. *Content is in placeholder form; will be expanded.*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Security practices and secrets](./1_Security_Practices_And_Secrets.md) | Secrets management, IAM, least privilege, zero-trust (DevOps scope) |
| 2 | [Compliance and threat mitigation](./2_Compliance_And_Threat_Mitigation.md) | Scanning, vulnerability management, policy as code; WAF, DDoS |
| 3 | [Security tools index](./3_Security_Tools_And_Automation.md) | Index of tool folders |

## Tools (one folder per tool)

| Tool | Description |
|------|-------------|
| [**Vault**](./Vault/README.md) | HashiCorp Vault — secrets management |
| [**OPA**](./OPA/README.md) | Open Policy Agent — policy as code |
| [**Checkov**](./Checkov/README.md) | IaC and K8s scanning |
| [**Snyk**](./Snyk/README.md) | Vulnerability scanning (code, deps, containers, IaC) |
| [**Trivy**](./Trivy/README.md) | Container and IaC vulnerability scanning |

To add a new tool: create a folder and add it to the table above. Community-maintained.

## Scope

- **Covered here:** Security from a DevOps perspective (pipelines, secrets, compliance). Deep network security in Networks-Deep-Dive.
- **Go deeper:** [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) for network security and firewalls.
