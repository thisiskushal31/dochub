# Image supply chain for containers

[← Security advanced](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Trusted registries, digest pinning, avoid `:latest` in prod
- Scan before deploy (Trivy) — link DevOps
- Sign with cosign; verify in admission
- SBOM attach (Syft)
- Distroless / minimal bases recap

## Cross-links

- [DevOps-Handbook CiCd/6](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/CiCd/6_Supply_Chain_And_Signing.md)
- [DevOps-Handbook Security/Cosign](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Security/Cosign/README.md)

## Checklist before marking done

- [ ] Policy: only signed images from org registry
