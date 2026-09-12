# Cosign and Sigstore

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Sign container images in CI with cosign
- Verify at deploy (Kubernetes admission, policy)
- Keyless signing with OIDC (GitHub Actions, GitLab)
- Pair with SBOM from Syft ([CiCd/6](../../CiCd/6_Supply_Chain_And_Signing.md))

## Checklist before marking done

- [ ] sign + verify command pair
- [ ] Policy: cluster rejects unsigned images
