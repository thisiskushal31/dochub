# Security tools and automation (index)

[← Back to Security](./README.md) · [Gate chain](./4_Security_Gate_Chain.md)

## 1. Concepts

Tool folders map to **gates**, not brands. Prefer **one primary tool per gate** to keep triage sane. What SAST, DAST, IAST, SCA, and the rest of **AST** each see: [6_AST_Methods_And_Tools](./6_AST_Methods_And_Tools.md).

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
| DAST / API tests | ZAP | [ZAP/](./ZAP/README.md) |
| Fuzz, IAST, benchmark, malware, license, dependency review | No extra folder | [6](./6_AST_Methods_And_Tools.md) |
| Runtime secrets | Vault | [Vault/](./Vault/README.md) |
| Runtime HTTP edge | WAF (open-source + cloud) | [WAF/](./WAF/README.md) |
| Runtime sense, posture, patch SLA | No folder | [2](./2_Compliance_And_Threat_Mitigation.md) |

CI map: [CiCd/15](../CiCd/15_Pipeline_Security_And_Gates.md). OIDC: [5](./5_OIDC_CI_And_Least_Privilege.md).

**Disconfirm:** Installing every scanner is **not** a security program.

**Confirm:** Which tool owns your secret-scan gate today?

## 2. Automation patterns

| Pattern | Practice |
|---------|----------|
| PR required checks | Secrets + fast SAST + SCA + license + dependency review |
| Build | Image CVE, secrets and malware in the artifact, SBOM, sign |
| Staging | Smoke, DAST baseline, API tests on selected apps |
| Nightly | Deep SAST, fuzz, benchmark |
| Prod admit | Verify signature / provenance + admission |

## 3. Applications

| Goal | Pattern |
|------|---------|
| Greenfield | Gitleaks + Semgrep + Trivy + Cosign |
| Enterprise quality | Add SonarQube gate on new code |
| Infra-heavy | Checkov + OPA/Conftest on plans |

Full cyber program: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

## References

- [Gate chain](./4_Security_Gate_Chain.md)  
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) (literacy)  
