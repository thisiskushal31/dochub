# Snyk

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

## 1. Concepts

**Snyk** is a commercial (with free tiers) platform for **SCA**, container, and IaC scanning—developer-friendly PR checks and fix PRs for dependency upgrades.

**Plain language:** Watches your lockfiles and images for known CVEs and suggests upgrades. Same *jobs* as [Trivy](../Trivy/README.md); different product UX and licensing.

**Disconfirm:** A Snyk “fix PR” is **not** automatically safe—review breaking changes. Snyk is **not** DAST ([ZAP](../ZAP/README.md)).

**Confirm:** Which artifact does SCA inspect (source lockfile vs built image)?

## 2. Advanced concepts

| Product surface | Job |
|-----------------|-----|
| Open Source | Manifest/lockfile vulns |
| Container | Image layers |
| IaC | Cloud/K8s misconfig |
| Code | SAST-like rules (product-dependent) |

Org policy: fail on severity × reachability; monitor vs gate. Don’t run three SCA tools as hard gates without triage ownership.

## 3. Applications

| Goal | Pattern |
|------|---------|
| PR | Snyk test / GitHub app; block high on changed deps |
| Image | Scan digest after build |
| Fix cadence | Batch Dependabot/Snyk PRs weekly |

**Staff checklist:** one primary SCA gate; license awareness; pin CI orb/action versions.

## References

- [Snyk docs](https://docs.snyk.io/)  
- [Trivy](../Trivy/README.md) · [Gate chain](../4_Security_Gate_Chain.md)  
