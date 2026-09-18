# Security

Practices, compliance, threat mitigation, and **delivery-pipeline tools**. Tool folders map to the [gate chain](./4_Security_Gate_Chain.md). Full cyber program: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

## Concept overviews

| # | Topic | Description | Status |
|---|--------|-------------|--------|
| 1 | [Security practices and secrets](./1_Security_Practices_And_Secrets.md) | Secrets, IAM, zero-trust (DevOps scope) | expand |
| 2 | [Compliance and threat mitigation](./2_Compliance_And_Threat_Mitigation.md) | Scanning, WAF, DDoS literacy | expand |
| 3 | [Security tools index](./3_Security_Tools_And_Automation.md) | Gate → tool map | **filled** |
| 4 | [Security gate chain](./4_Security_Gate_Chain.md) | Ordered PR→prod controls | **filled** |
| 5 | [OIDC, cloud IAM, and CI least privilege](./5_OIDC_CI_And_Least_Privilege.md) | Federated CI identity | **filled** |

## Tools (one folder per tool)

| Tool | Gate / job | Status |
|------|------------|--------|
| [Gitleaks](./Gitleaks/README.md) | Secrets in git | **filled** |
| [Semgrep](./Semgrep/README.md) | Fast SAST | **filled** |
| [CodeQL](./CodeQL/README.md) | Deep SAST | **filled** |
| [SonarQube](./SonarQube/README.md) | Quality + SAST gate | **filled** |
| [Trivy](./Trivy/README.md) | Image / SCA / IaC scan | **filled** |
| [Snyk](./Snyk/README.md) | SCA / container / IaC | **filled** |
| [Checkov](./Checkov/README.md) | IaC misconfig | **filled** |
| [OPA](./OPA/README.md) | Policy as code | **filled** |
| [Cosign](./Cosign/README.md) | Sign / verify | **filled** |
| [ZAP](./ZAP/README.md) | DAST | **filled** |
| [Vault](./Vault/README.md) | Runtime secrets | **filled** |
| [WAF](./WAF/README.md) | Runtime HTTP edge (open-source + cloud) | literacy |

## Scope

- **Covered here:** DevOps / delivery security (pipelines, secrets, gates, tool literacy).  
- **Go deeper:** [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive); [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).  
