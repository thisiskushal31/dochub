# CI/CD security gate chain (overview)

[← Back to Security](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Full chain in order: secret scan → SAST → SCA → IaC/policy → image scan → sign/SBOM → quality gate → DAST (preview) → WAF/runtime
- Where each gate runs (PR vs main vs post-deploy)
- Fail-open vs fail-closed policy decisions
- Mapping gates to folders in this repo

## Tool index (stubs in this repo)

| Stage | Folder / topic |
|-------|----------------|
| Secrets in git | [Gitleaks](./Gitleaks/README.md) |
| SAST / quality | [SonarQube](./SonarQube/README.md), [Semgrep](./Semgrep/README.md), [CodeQL](./CodeQL/README.md) |
| SCA / deps | [Snyk](./Snyk/README.md), [Trivy](./Trivy/README.md) |
| IaC policy | [Checkov](./Checkov/README.md), [OPA](./OPA/README.md) |
| Sign / SBOM | [Cosign](./Cosign/README.md) · [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) |
| DAST | [ZAP](./ZAP/README.md) |
| Secrets runtime | [Vault](./Vault/README.md) |

## Cross-links

- Delivery loop: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)
- Full cyber depth: [Entry-Points/Cybersecurity_Deep_Dive.md](../Entry-Points/Cybersecurity_Deep_Dive.md)

## Checklist before marking done

- [ ] One ASCII pipeline diagram with all gates labeled
- [ ] Table: tool → when it runs → who owns fixing findings
