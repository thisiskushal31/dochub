# CI/CD security gate chain

[← Back to Security](./README.md)

Ordered controls from commit to runtime so delivery stays fast **and** gated. CI/CD map (links into this chain): [CiCd/15_Pipeline_Security_And_Gates.md](../CiCd/15_Pipeline_Security_And_Gates.md). Supply chain detail: [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md). Full AppSec program depth: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

---

## Chain (recommended order)

```text
1. Secret scan (git history / PR diff)
2. SAST + quality gates
3. SCA (dependencies / lockfiles)
4. IaC / policy-as-code (when infra or cluster manifests change)
5. Build artifact
6. Image / binary vulnerability scan
7. SBOM + sign / attest provenance
8. Deploy to preview/staging → smoke (+ DAST when appropriate)
9. Promote / prod admit (verify signature + policy)
10. Runtime controls (WAF, runtime sensors) — complement, not replacement
```

Earlier gates should be **faster**; expensive checks parallelize or run on merge/promote paths so the commit stage stays short ([CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md), [CiCd/11](../CiCd/11_Pipeline_As_Code_Runners_Caching_Matrix.md)).

---

## When each gate runs

| Gate | PR | Main / release | Preview / staging | Prod admit |
|------|----|----------------|-------------------|------------|
| Secret scan | Required | Required | — | — |
| SAST / quality | Required | Required | — | — |
| SCA | Required | Required | — | Re-check on promote if policy says |
| IaC policy | If touched | If touched | — | — |
| Image scan | On image build | On image build | — | Block high/critical per policy |
| SBOM / sign | On publish | On publish | Verify optional | Verify required |
| DAST | — | — | Selected apps | — |
| Smoke / canary | — | — | Required | Required ([CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md)) |

---

## Tool → stage → fix owner

| Stage | Tools in this repo | Who fixes findings |
|-------|--------------------|--------------------|
| Secrets in git | [Gitleaks](./Gitleaks/README.md) | Author; rotate if leaked |
| SAST / quality | [Semgrep](./Semgrep/README.md), [CodeQL](./CodeQL/README.md), [SonarQube](./SonarQube/README.md) | Author / team |
| SCA / deps | [Snyk](./Snyk/README.md), [Trivy](./Trivy/README.md), Dependabot/Renovate | Author + platform for base images |
| IaC policy | [Checkov](./Checkov/README.md), [OPA](./OPA/README.md) | Author of IaC |
| Image scan | [Trivy](./Trivy/README.md), [Snyk](./Snyk/README.md) | Author + platform |
| Sign / SBOM | [Cosign](./Cosign/README.md), [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) | Platform pipeline |
| DAST | [ZAP](./ZAP/README.md) | App team |
| Runtime secrets | [Vault](./Vault/README.md) | Platform + app |
| CI cloud identity | [5_OIDC_CI_And_Least_Privilege](./5_OIDC_CI_And_Least_Privilege.md) | Platform |

---

## Fail closed vs fail open

| Policy | Use |
|--------|-----|
| **Fail closed** | Secrets, critical/high vulns per org threshold, unsigned prod images, broken smoke |
| **Fail open + track** | New rules in learn mode; low severity with ticket SLA |

Write thresholds down. Infinite warnings are not controls.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| One giant scan at the end | Ordered chain; shift-left |
| Scanners without owners | Table above — every finding has a fixer |
| Prod WAF as the only control | Runtime complements build-time gates |
| Gates that take longer than the feature | Parallelize; cache; tier by severity |

## Next

- OIDC from CI: [5](./5_OIDC_CI_And_Least_Privilege.md)  
- Delivery loop: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- OWASP materials on CI/CD security risks (use current OWASP publications)  
- Tool docs linked from each folder above  
