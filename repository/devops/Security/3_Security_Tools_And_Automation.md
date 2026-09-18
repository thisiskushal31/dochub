# Security tools and automation (index)

[← Back to Security](./README.md) · [Gate chain](./4_Security_Gate_Chain.md)

---

## 1. Concepts

Tool folders map to **gates**, not brands. Prefer **one primary tool per gate** to keep triage sane.

| Gate | Primary examples here | Folder |
|------|----------------------|--------|
| Secrets in git | Gitleaks | [Gitleaks/](./Gitleaks/README.md) |
| SAST (fast) | Semgrep | [Semgrep/](./Semgrep/README.md) |
| SAST (deep) | CodeQL | [CodeQL/](./CodeQL/README.md) |
| Quality gate | SonarQube | [SonarQube/](./SonarQube/README.md) |
| SCA / image | Trivy, Snyk | [Trivy/](./Trivy/README.md), [Snyk/](./Snyk/README.md) |
| IaC scan | Checkov | [Checkov/](./Checkov/README.md) |
| Policy engine | OPA, Kyverno | [OPA/](./OPA/README.md), [Kyverno](../Cloud-Native/Kyverno/README.md) |
| Sign / verify | Cosign | [Cosign/](./Cosign/README.md) |
| DAST | ZAP | [ZAP/](./ZAP/README.md) |
| Runtime secrets | Vault | [Vault/](./Vault/README.md) |
| Runtime HTTP edge | WAF (open-source + cloud) | [WAF/](./WAF/README.md) |

CI map: [CiCd/15](../CiCd/15_Pipeline_Security_And_Gates.md). OIDC: [5](./5_OIDC_CI_And_Least_Privilege.md).

**Disconfirm:** Installing every scanner is **not** a security program.

**Confirm:** Which tool owns your secret-scan gate today?

---

## 2. Automation patterns

| Pattern | Practice |
|---------|----------|
| PR required checks | Secrets + SAST + SCA |
| Build | Image scan + SBOM + sign |
| Staging | DAST selective + smoke |
| Prod admit | Verify signature / policy |

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| Greenfield | Gitleaks + Semgrep + Trivy + Cosign |
| Enterprise quality | Add SonarQube gate on new code |
| Infra-heavy | Checkov + OPA/Conftest on plans |

Full cyber program: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

---

## References

- [Gate chain](./4_Security_Gate_Chain.md)  
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) (literacy)  
