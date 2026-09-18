# Pipeline security and gates (CI/CD map)

[← Back to CI/CD](./README.md)

Delivery without security gates ships known risk at high speed. This is the **CI/CD map** of where controls sit; tool-by-tool depth and the ordered gate chain live under [Security/](../Security/README.md).

Detailed ordered chain: [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md).  
OIDC / least privilege from CI: [Security/5_OIDC_CI_And_Least_Privilege.md](../Security/5_OIDC_CI_And_Least_Privilege.md).  
Signing/SBOM: [6](./6_Supply_Chain_And_Signing.md).  
Mindset: [Methodologies/14](../Methodologies/14_DevSecOps_Mindset.md).

## Where gates run

```text
Developer laptop / pre-commit (optional)
        │
PR / commit stage ── secret scan, SAST, unit, lint
        │
Build ── SCA (dependencies), IaC policy (if infra in repo)
        │
Package ── image/binary scan, SBOM, sign / attest
        │
Deploy preview / staging ── DAST (as appropriate), smoke
        │
Prod admit ── signature/provenance policy, progressive delivery
        │
Runtime ── WAF/runtime controls (ops) — not a substitute for earlier gates
```

Shift-left: find issues near the author. Shift-right: verify in real environments ([5](./5_Verify_Rollback_And_Synthetic_Tests.md)).

## Gate → handbook home

| Gate | CiCd role | Security folder / topic |
|------|-----------|-------------------------|
| Secrets in git | Block commit/PR | [Gitleaks](../Security/Gitleaks/README.md) |
| SAST / quality | PR + main | [Semgrep](../Security/Semgrep/README.md), [CodeQL](../Security/CodeQL/README.md), [SonarQube](../Security/SonarQube/README.md) |
| SCA / deps | PR + main | [Snyk](../Security/Snyk/README.md), [Trivy](../Security/Trivy/README.md), Dependabot/Renovate |
| IaC / policy as code | When Terraform/K8s manifests change | [Checkov](../Security/Checkov/README.md), [OPA](../Security/OPA/README.md) |
| Image scan | After build, before promote | [Trivy](../Security/Trivy/README.md) |
| Sign / SBOM / provenance | After build | [Cosign](../Security/Cosign/README.md), [6](./6_Supply_Chain_And_Signing.md) |
| DAST | Preview/staging | [ZAP](../Security/ZAP/README.md) |
| Runtime secrets | App deploy | [Vault](../Security/Vault/README.md), [13](./13_Config_Secrets_And_Env_Parity.md) |

## Policy choices

| Mode | Meaning |
|------|---------|
| **Fail closed** | Gate failure blocks merge/promote (release-blocking severities) |
| **Fail open + ticket** | Informational findings tracked — use sparingly for true noise |

Document severity thresholds. “Warn forever” is not a gate.

## CI identity is part of the attack surface

Pipelines that can push to prod registries or clusters are high-value targets:

- Prefer **OIDC** over long-lived cloud keys  
- Scope tokens to environment and repository  
- Lock down self-hosted runners ([11](./11_Pipeline_As_Code_Runners_Caching_Matrix.md))  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Only scanning in prod | Shift-left chain |
| Signing without verify-at-deploy | Admission / CD verify ([6](./6_Supply_Chain_And_Signing.md)) |
| Security team owns every finding alone | Dev + platform shared ownership |
| Gates so slow nobody runs them | Parallelize; tier severities; keep commit stage fast |

## Next

- Full chain prose: [Security/4](../Security/4_Security_Gate_Chain.md)  
- Supply chain: [6](./6_Supply_Chain_And_Signing.md)

## Further reading

- OWASP CI/CD security guidance / Top 10 CI/CD risks (keep current OWASP pages bookmarked)  
- Vendor docs for each scanner you adopt  
