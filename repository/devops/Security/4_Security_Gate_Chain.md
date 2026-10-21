# CI/CD security gate chain

[← Back to Security](./README.md)

Ordered controls from commit to runtime so delivery stays fast **and** gated. Method names (SAST, DAST, SCA, IAST, and the rest of AST): [6_AST_Methods_And_Tools](./6_AST_Methods_And_Tools.md). CI/CD map (links into this chain): [CiCd/15_Pipeline_Security_And_Gates.md](../CiCd/15_Pipeline_Security_And_Gates.md). Supply chain detail: [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md). Full AppSec program depth: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

## Chain (recommended order)

```text
Design
  Threat model and data class, before a new trust boundary
PR (fast — this is the commit stage)
  1. Secret scan (git history / PR diff)
  2. SAST (fast) + quality gate on new code
  3. SCA + license on the lockfile
  4. Dependency review (packages added or bumped on this change)
  5. IaC / policy-as-code, only when those files change
Build / publish
  6. Image or binary CVE scan, plus secrets and malware in the artifact
  7. SBOM + sign / attest provenance
Preview / staging
  8. Smoke, then DAST (baseline, then authenticated) and API tests for selected apps
Nightly or on a harness
  Deep SAST, fuzz, IAST if tests already reach the code, CIS-class benchmark
Prod admit
  9. Verify signature and provenance, admission policy, approval when the environment requires it
Runtime — controls, not a second test pass
  10. WAF, runtime sensors, CSPM/KSPM, secret broker, cert expiry, patch SLA
Cadence
  Human test in scope (pen test or bounty) when exposure changes
```

Earlier gates should be **faster**; expensive checks parallelize or run on merge/promote paths so the commit stage stays short ([CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md), [CiCd/11](../CiCd/11_Pipeline_As_Code_Runners_Caching_Matrix.md)).

## When each gate runs

| Gate | PR | Main / release | Preview / staging | Prod admit |
|------|----|----------------|-------------------|------------|
| Secret scan | Required | Required | — | — |
| SAST / quality | Required (fast) | Deep scan nightly | — | — |
| SCA + license | Required | Required | — | Re-check on promote if policy says |
| Dependency review | Required on dependency diffs | — | — | — |
| IaC policy | If touched | If touched | — | Admission re-checks the live object |
| Image CVE, secrets, malware | On image build | On image build | — | Block high/critical per policy |
| SBOM / sign | On publish | On publish | Verify optional | Verify required |
| DAST + API tests | — | Authenticated / nightly | Baseline, then authenticated on selected apps | — |
| Fuzz / IAST / benchmark | — | Nightly or on a harness | — | — |
| Smoke / canary | — | — | Required | Required ([CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md)) |
| Posture (CSPM / KSPM) | — | — | — | Continuous on the live account, not the PR |

## Tool → stage → fix owner

| Stage | Tools in this repo | Who fixes findings |
|-------|--------------------|--------------------|
| Secrets in git | [Gitleaks](./Gitleaks/README.md) | Author; rotate if leaked |
| SAST / quality | [Semgrep](./Semgrep/README.md), [CodeQL](./CodeQL/README.md), [SonarQube](./SonarQube/README.md) | Author / team |
| SCA / license / dependency review | [Snyk](./Snyk/README.md), [Trivy](./Trivy/README.md), Dependabot/Renovate | Author + platform for base images |
| IaC policy | [Checkov](./Checkov/README.md), [OPA](./OPA/README.md) | Author of IaC |
| Image CVE, secrets, malware | [Trivy](./Trivy/README.md), [Snyk](./Snyk/README.md) | Author + platform |
| Sign / SBOM | [Cosign](./Cosign/README.md), [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) | Platform pipeline |
| DAST / API tests | [ZAP](./ZAP/README.md) | App team |
| Fuzz / IAST / benchmark | No folder — [6](./6_AST_Methods_And_Tools.md) | App team; platform schedules the job |
| Admission | [Kyverno](../Cloud-Native/Kyverno/README.md), [OPA](./OPA/README.md) | Platform |
| Runtime secrets | [Vault](./Vault/README.md) | Platform + app |
| Runtime sense and posture | [2](./2_Compliance_And_Threat_Mitigation.md) | Platform + security |
| CI cloud identity | [5_OIDC_CI_And_Least_Privilege](./5_OIDC_CI_And_Least_Privilege.md) | Platform |

## Fail closed vs fail open

| Policy | Use |
|--------|-----|
| **Fail closed** | Secrets, critical/high vulns per org threshold, forbidden licenses, unsigned prod images, broken smoke, failed admission |
| **Fail open + track** | New rules in learn mode; low severity with ticket SLA; benchmark and CSPM until the exception register exists |

Write thresholds down. Infinite warnings are not controls.

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
