# Supply chain: SBOM, signing, and provenance

[← Back to CI/CD](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- SBOM basics: Syft, Grype — why scan what you ship
- Image/binary signing: cosign, Sigstore — verify at deploy
- SLSA / provenance literacy (levels, not certification chase)
- Where signing sits in pipeline (after build, before promote)
- Policy: reject unsigned or high-CVE artifacts

## Cross-links

- Gate chain overview: [Security/4_Security_Gate_Chain.md](../Security/4_Security_Gate_Chain.md)
- Artifacts: [4_Artifacts_And_Registries.md](./4_Artifacts_And_Registries.md)

## Checklist before marking done

- [ ] End-to-end: build → SBOM → sign → deploy verifies signature
- [ ] Pitfalls: key management for cosign in CI (OIDC preferred)
