# Security

Practices, compliance, threat mitigation, and tools. **Each tool has its own folder**; add new tools as new folders. *Stub scaffold August 2026 — see [gate chain](./4_Security_Gate_Chain.md) and [write order](../CONTENT_WRITE_ORDER.md).*

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Security practices and secrets](./1_Security_Practices_And_Secrets.md) | expand — secrets, IAM, zero-trust (DevOps scope) |
| 2 | [Compliance and threat mitigation](./2_Compliance_And_Threat_Mitigation.md) | expand — scanning, WAF, DDoS |
| 3 | [Security tools index](./3_Security_Tools_And_Automation.md) | expand — link all tool folders |
| 4 | [**Security gate chain (overview)**](./4_Security_Gate_Chain.md) | stub — full PR→prod gate order |
| 5 | [OIDC, cloud IAM, and CI least privilege](./5_OIDC_CI_And_Least_Privilege.md) | stub |

## Tools (one folder per tool)

| Tool | Description | Status |
|------|-------------|--------|
| [**Vault**](./Vault/README.md) | Secrets management | expand |
| [**OPA**](./OPA/README.md) | Policy as code | expand |
| [**Checkov**](./Checkov/README.md) | IaC / K8s scan | expand |
| [**Snyk**](./Snyk/README.md) | SCA, containers, IaC | expand |
| [**Trivy**](./Trivy/README.md) | Container / IaC scan | expand |
| [**SonarQube**](./SonarQube/README.md) | SAST / quality gates | stub |
| [**Semgrep**](./Semgrep/README.md) | Fast SAST rules | stub |
| [**CodeQL**](./CodeQL/README.md) | Deep SAST (GitHub) | stub |
| [**ZAP**](./ZAP/README.md) | DAST | stub |
| [**Gitleaks**](./Gitleaks/README.md) | Secrets in git | stub |
| [**Cosign**](./Cosign/README.md) | Sign artifacts | stub |

## Scope

- **Covered here:** Security from a DevOps / delivery perspective (pipelines, secrets, gates).
- **Go deeper:** [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) (network security); [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) (full cyber program).
