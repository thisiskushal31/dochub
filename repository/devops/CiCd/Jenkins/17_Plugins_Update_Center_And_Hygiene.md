# 17 — Plugins, Update Center, and hygiene

[← Previous](./16_Security_Folders_RBAC_And_Hardening.md) · [README](./README.md) · [Next: Classical deploy →](./18_Classical_Host_And_Web_Deploy.md)

## 1. Concepts

Almost everything beyond bare Jenkins is a **plugin**: Git, credentials, Pipeline, mailer, Kubernetes, … Manage via **Plugin Manager** / Update Center (or as code).

| Practice | Why |
|----------|-----|
| Prefer **suggested** minimally; add deliberately | Attack surface + upgrade pain |
| **Pin versions** in prod | Reproducible controllers |
| Stage upgrades | Plugin A breaks with core B |
| Read plugin docs for *your* plugins | This track won’t enumerate plugins.jenkins.io |

Pipeline **steps** come from plugins — Snippet Generator lists what’s installed.

## 2. Advanced concepts

### Plugins as code

Many teams store plugin lists (`plugins.txt` for Docker official images, or JCasC/plugin installation managers). Rebuild controllers rather than click-install in prod.

```text
# plugins.txt — pin in real estates (id:version)
git:5.2.0
workflow-aggregator:596.v8c21c963d92c
configuration-as-code:1810.v9b_c30a_249a_4c
credentials-binding:681.vf91669a_32e45
```

Exact versions come from *your* Update Center / lockfile — treat the list above as shape, not a pin recommendation.

### Detached / bundled / deprecated

Core evolves; some plugins detach or retire — follow LTS upgrade notes ([26](./26_Migrate_LTS_Upgrades_And_Extras.md)).

### CVE posture

Subscribe to security advisories; patch controllers like internet-facing apps when exposed.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Cattle controllers | Image with pinned plugins + JCasC |
| Pet controller | Change window + backup + plugin update |
| Air-gap | Vendored Update Center mirror |

**Good:** small plugin set with owners. **Bad:** “Install all” from a blog checklist.

**Upstream-only:** every plugin README on plugins.jenkins.io.

## References

- [Managing plugins](https://www.jenkins.io/doc/book/managing/plugins/)  
- [Plugins index](https://plugins.jenkins.io/)  
- [Security advisories](https://www.jenkins.io/security/advisories/)  
