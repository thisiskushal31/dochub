# Cosign

[← Back to Security](../README.md) · [CiCd supply chain](../../CiCd/6_Supply_Chain_And_Signing.md) · [Gate chain](../4_Security_Gate_Chain.md)

## 1. Concepts

**Cosign** (Sigstore) **signs and verifies** container images (and other artifacts) so a cluster or promote step can prove the bits came from a trusted identity.

**Plain language:** A wax seal on the image digest. Signing answers authenticity; [SBOM](../../CiCd/6_Supply_Chain_And_Signing.md) answers what’s inside; provenance answers how it was built.

**Disconfirm:** A signature does **not** mean the image is vulnerability-free. Tag mutability can still confuse humans—pin **digests**.

**Confirm:** What identifier should policy verify (tag or digest)?

## 2. Advanced concepts

| Mode | Notes |
|------|-------|
| Keyless (Fulcio + Rekor) | Short-lived certs via OIDC identity; transparency log |
| Key-based | Long-lived keys—protect like production secrets |
| Attach / referrers | Signatures stored alongside image in registry |
| Policy verify | Kyverno/Gatekeeper/admission or CI promote step |

OIDC from CI: [5](../5_OIDC_CI_And_Least_Privilege.md).

## 3. Applications

| Goal | Pattern |
|------|---------|
| Sign on publish | CI: build → push digest → `cosign sign` |
| Admit to prod | Verify signature + identity claims before deploy |
| GitOps | Desired state pins digest; admission verifies cosign |

**Staff checklist:** sign digests; document trusted identities; verify in prod path; rehearse key/identity loss recovery.

## References

- [Cosign](https://docs.sigstore.dev/cosign/signing/overview/)  
- [Sigstore](https://www.sigstore.dev/)  
- [CiCd/6](../../CiCd/6_Supply_Chain_And_Signing.md)  
