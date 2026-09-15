# 17 — Chains: supply-chain security

[← Previous](./16_Dashboard.md) · [README](./README.md) · [Next: Results →](./18_Results_And_Pruner.md)

---

## 1. Concepts

**Tekton Chains** watches TaskRuns/PipelineRuns and produces **signatures and attestations** for artifacts (commonly OCI images), often as **SLSA provenance**, integrating with **Sigstore** and verifiers in CD.

Durable jobs: **build → attest → promote-by-digest → verify** ([CiCd/6](../6_Supply_Chain_And_Signing.md), [26](./26_GitOps_Handoff_And_Spectrum.md)).

| Piece | Role |
|-------|------|
| Chains controller | Observes Runs; signs payloads |
| Signing identity | x509, KMS, Sigstore Fulcio, … |
| Provenance predicate | Who/what/how built the artifact (SLSA generations evolve — incl. v2 literacy) |
| Storage | OCI annotations, Rekor transparency log, disk, … |
| Downstream verify | Admission / GitOps / policy engines |

```text
PipelineRun (build-push)
        ↓
  Chains attestation + signature
        ↓
  registry / GitOps desired state
        ↓
  verifier rejects unsigned digests
```

---

## 2. Advanced concepts

| Topic | Literacy |
|-------|----------|
| Signing backends | Keys, KMS, Fulcio — rotate and protect |
| SLSA predicates | Generations change (`v1` / `v2` docs exist) — pin Chains + predicate expectations together |
| OCI encoding | How attestations attach to images |
| Storage backends | OCI / Rekor / others per config docs |
| Authentication | How Chains talks to registries/KMS |
| Performance | Busy CI can overload signing — stage capacity |
| Experimental flags | Pin; do not enable casually in prod |

Install Chains via release or Operator (`TektonChain`). Version-align with Pipelines.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Signed images | Chains on build-push; CD verifies |
| Regulated CI | Provenance retained with Results archive |
| Multi-cluster | Central verify policy; same digests everywhere |

**Staff checklist**

- Signing identity owned and rotated  
- Attestation storage durable  
- CD/admission **verifies** — signing alone is incomplete  
- Unsigned `:latest` banned in prod  

**Good:** sign once at build; verify at deploy. **Bad:** signatures nobody checks.

---

## References

- [Chains](https://tekton.dev/docs/chains/)  
- [Signing](https://tekton.dev/docs/chains/signing/)  
- [SLSA provenance](https://tekton.dev/docs/chains/slsa-provenance/)  
- [Sigstore](https://tekton.dev/docs/chains/sigstore/)  
