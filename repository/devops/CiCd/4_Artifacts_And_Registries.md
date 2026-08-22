# Artifacts and container/package registries

[← Back to CI/CD](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Immutable artifacts: why rebuild-per-env is an anti-pattern
- Container registries: GHCR, ECR, GCR/Artifact Registry, Harbor, Artifactory, Nexus
- Package registries (entry level): npm, PyPI, Maven, Go module proxy — link Languages + short CiCd note
- Tagging, digest pinning, promotion between environments
- Retention, garbage collection, vulnerability scan before promote
- CI job pattern: build once → push artifact → deploy same digest everywhere

## Cross-links

- Image scan: [Security/Trivy](../Security/Trivy/README.md)
- Signing: [CiCd/6_Supply_Chain_And_Signing.md](./6_Supply_Chain_And_Signing.md)

## Checklist before marking done

- [ ] Diagram: build → registry → deploy (environments)
- [ ] Copy-paste: push to GHCR or GCR with OIDC (no long-lived keys)
