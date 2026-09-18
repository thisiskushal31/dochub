# 20 — Self-Managed admin literacy

[← Previous](./19_Duo_And_AI_Literacy.md) · [README](./README.md) · [Next: API →](./21_API_Webhooks_And_Integrations.md)

## 1. Concepts

If you run **GitLab Self-Managed**, someone owns install, upgrade, backup, auth, scaling, and runner fleets. This chapter is a **door** into admin docs — not Omnibus/Helm runbooks.

| Path | When |
|------|------|
| Linux package (Omnibus) | Classic VM/bare metal |
| Helm chart / Operator | Kubernetes |
| Docker | Smaller/lab installs |
| Reference architectures | Scale targets (1k–50k users tables) |
| GitLab Dedicated | Single-tenant operated for you |

CI depends on admin choices: runner capacity, object storage for artifacts, container registry backend, outbound network for pulls.

## 2. Advanced concepts

| Topic | Why CI cares |
|-------|----------------|
| Upgrades / zero-downtime | Pipeline downtime windows |
| Geo / DR | Failover literacy |
| LDAP/SAML | Who can merge/run |
| Rate limits | API-triggered pipelines |
| Instance runners | Shared compute governance |

**Upstream-only:** every administration page and every ref-arch BOM.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Enterprise on-prem | Ref-arch + platform SRE owners |
| SaaS-only org | Skim this chapter; focus CI chapters |

**Good:** admin + CI platform as one ownership story. **Bad:** app teams registering privileged runners with no patching owner.

## References

- [Administer GitLab](https://docs.gitlab.com/administration/)  
- [Install GitLab](https://docs.gitlab.com/install/)  
- [Reference architectures](https://docs.gitlab.com/administration/reference_architectures/)  
- [Update GitLab](https://docs.gitlab.com/update/)  
