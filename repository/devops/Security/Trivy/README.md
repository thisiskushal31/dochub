# Trivy

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md)

---

## 1. Concepts

**Trivy** (Aqua) scans **container images, filesystems, git repos, and IaC** for known vulnerabilities and misconfigurations.

**Plain language:** One CLI that answers “is this image/full of CVEs?” and “is this Terraform/K8s manifest obviously wrong?”

Jobs: SCA/image scan + light IaC — overlaps [Snyk](../Snyk/README.md) / [Checkov](../Checkov/README.md); pick one primary per gate to avoid alert fatigue.

**Disconfirm:** “No CRITICAL today” is **not** forever—DB updates; rescan digests you still run.

**Confirm:** Do you scan the **digest you promote**, or a different tag rebuild?

---

## 2. Advanced concepts

| Target | Example |
|--------|---------|
| Image | `trivy image repo/app@sha256:…` |
| Fs / repo | Dependencies, secrets-ish configs |
| IaC | Terraform, K8s YAML misconfig |
| SBOM | Generate/consume SBOM; pair with [CiCd/6](../../CiCd/6_Supply_Chain_And_Signing.md) |

Severity policy: fail on HIGH/CRITICAL for prod admit; warn on PR for noisier packs. Pin Trivy version + DB update strategy in CI.

---

## 3. Applications

| Goal | Pattern |
|------|---------|
| After build | Scan pushed digest; block promote |
| IaC PR | `trivy config` on changed Terraform/K8s |
| Runtime drift | Periodic rescan of images still in prod |

**Staff checklist:** scan digests; cache DB responsibly; ignore only with ticket; same digest from staging→prod.

---

## References

- [Trivy documentation](https://aquasecurity.github.io/trivy/)  
- [CiCd/4 Artifacts](../../CiCd/4_Artifacts_And_Registries.md)  
- [Cosign](../Cosign/README.md)  
