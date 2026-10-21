# DevSecOps mindset (methodology)

[← Back to Methodologies](./README.md)

**DevSecOps** means security is a **shared responsibility across the lifecycle** — not a gate owned only by a separate team at the end. Culture and automation both matter; tools alone are not DevSecOps.

Authoritative framing (same idea across vendors): security from design through runtime; automate gates so security does not become a multi-week queue; developers get fast, usable feedback. See [Red Hat — What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops) and DORA’s **shift-left on security** capability.

## What beginners must get right

| Correct | Wrong |
|---------|--------|
| Security requirements and threat thinking start in design / backlog | “Secure it in the pen-test week before launch” |
| Automated checks in CI (secrets, SAST, SCA, image scan, IaC policy) | One annual spreadsheet audit |
| Ops/runtime controls still matter (config, identity, detection) | “Shift-left” means ignore production |
| Security partners with delivery teams | Security is only the team that says no |

**Shift-left** = move security activities earlier (design, code, PR, CI).  
**Shift-right** = keep verifying in pre-prod and prod (DAST, runtime, observability, incident learning).

Red Hat and others describe both. Neither replaces the other.

## Shared responsibility (RACI sketch)

| Activity | Dev / app team | Platform / DevOps | Security |
|----------|----------------|-------------------|----------|
| Secure coding / dependency choice | Owns | Paved-road libraries | Advises, standards |
| Pipeline gates | Consumes | Builds & maintains | Defines policy bar |
| Threat model for new feature | Owns with Sec | — | Facilitates |
| Prod detection / response | Joins incident | Joins / runs platform | Joins / leads SEV1 security |

Full AppSec program, offensive methods, GRC: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).

Every delivery gate, scan, check, and test — not only SAST and DAST — is listed in [Security/6](../Security/6_AST_Methods_And_Tools.md) and ordered in [Security/4](../Security/4_Security_Gate_Chain.md). Tool folders: [Security/](../Security/README.md).

That list is the whole loop:

| When | What runs |
|------|-----------|
| Design | Threat model, data class |
| PR | Secrets, SAST, quality, SCA, license, dependency review, IaC or policy if those files changed |
| Build | Image and binary scan, secrets and malware in the artifact, SBOM, sign and attest |
| Preview | Smoke, DAST, API tests; IAST only when the test suite already hits the code |
| Nightly | Deep SAST, authenticated DAST, fuzz, benchmark (CIS-class) |
| Prod admit | Verify signature and provenance, admission policy, approval when the environment requires it |
| Runtime | WAF, sensors, cloud and cluster posture, secret broker, cert expiry, patch SLA — controls, not a second test pass |
| On a cadence | Human test in scope (pen test or bounty) |

## Minimum DevSecOps loop (conceptual)

```text
Design (threats, data class)
  → Code (secure patterns, secrets never committed)
  → PR / CI (secrets, SAST, SCA, license, dependency review, unit tests)
  → Build (image scan, SBOM, sign — CiCd/6)
  → Preview (smoke, DAST, API tests)
  → Admit (signature, admission policy)
  → Operate (detect, patch, incident → postmortem)
```

The row-by-row set is the table above. This loop is only the shape.

Supply chain (SBOM, signing): [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) when filled. Do not confuse “we run Trivy once” with a supply-chain program.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Security only as a prod firewall ticket | Design + CI + runtime |
| 40-minute security jobs on every PR | Fast PR checks; deeper scans on main/nightly |
| Blaming developers for missing company paved roads | Platform provides secure defaults |
| Ignoring runtime because “we shifted left” | Observability + patch + IR still required |

## Next

- Testing methods (AST, SAST, DAST, and the rest): [Security/6_AST_Methods_And_Tools.md](../Security/6_AST_Methods_And_Tools.md)  
- Gate chain: [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md)  
- DORA capability map: [15_DORA_Capabilities_Map.md](./15_DORA_Capabilities_Map.md)

## Further reading

- [Red Hat — What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops)  
- [DORA capabilities — security / continuous delivery](https://dora.dev/capabilities/)  
