# DevSecOps mindset (methodology)

[← Back to Methodologies](./README.md)

**DevSecOps** means security is a **shared responsibility across the lifecycle** — not a gate owned only by a separate team at the end. Culture and automation both matter; tools alone are not DevSecOps.

Authoritative framing (same idea across vendors): security from design through runtime; automate gates so security does not become a multi-week queue; developers get fast, usable feedback. See [Red Hat — What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops) and DORA’s **shift-left on security** capability.

---

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

---

## Shared responsibility (RACI sketch)

| Activity | Dev / app team | Platform / DevOps | Security |
|----------|----------------|-------------------|----------|
| Secure coding / dependency choice | Owns | Paved-road libraries | Advises, standards |
| Pipeline gates | Consumes | Builds & maintains | Defines policy bar |
| Threat model for new feature | Owns with Sec | — | Facilitates |
| Prod detection / response | Joins incident | Joins / runs platform | Joins / leads SEV1 security |

Full AppSec program, offensive methods, GRC: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive).  
Pipeline gate order and scanner literacy: [Security/](../Security/README.md) especially [4_Security_Gate_Chain](../Security/4_Security_Gate_Chain.md).

---

## Minimum DevSecOps loop (conceptual)

```text
Design (threats, data class)
  → Code (secure patterns, secrets never committed)
  → PR / CI (secrets scan, SAST, SCA, unit tests)
  → Build (signed artifacts, SBOM when ready — CiCd/6)
  → Deploy (least privilege, policy-as-code)
  → Operate (detect, patch, incident → postmortem)
```

Supply chain (SBOM, signing): [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md) when filled. Do not confuse “we run Trivy once” with a supply-chain program.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Security only as a prod firewall ticket | Design + CI + runtime |
| 40-minute security jobs on every PR | Fast PR checks; deeper scans on main/nightly |
| Blaming developers for missing company paved roads | Platform provides secure defaults |
| Ignoring runtime because “we shifted left” | Observability + patch + IR still required |

## Next

- Gate chain: [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md)  
- DORA capability map: [15_DORA_Capabilities_Map.md](./15_DORA_Capabilities_Map.md)

## Further reading

- [Red Hat — What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops)  
- [DORA capabilities — security / continuous delivery](https://dora.dev/capabilities/)  
