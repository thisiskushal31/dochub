# 26 — GitOps handoff and delivery spectrum

[← Previous](./25_Migrate_Versioning_And_Extras.md) · [README](./README.md)

## 1. Concepts

Tekton’s durable job is often **build and attest**. **Promote and sync** frequently belong to GitOps:

```text
Tekton PipelineRun → image@sha256:… (+ attestation)
        ↓
  update manifest repo / OCI desired state
        ↓
  Argo CD or Flux reconciles cluster
```

| Adjacent track | Role |
|----------------|------|
| [Argo_CD/](../Argo_CD/README.md) | GitOps CD |
| [Flux/](../Flux/README.md) | GitOps CD |
| [Argo_Rollouts/](../Argo_Rollouts/README.md) | Progressive delivery |
| [CiCd/6](../6_Supply_Chain_And_Signing.md) | Signing / verify concepts |
| [CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md) | Full delivery spectrum |

### Spectrum honesty (rule 9)

| Estate | Door |
|--------|------|
| Forge-native SaaS CI | [GitHub_Actions/](../GitHub_Actions/README.md), [GitLab_CI/](../GitLab_CI/README.md) |
| Classical automation server | [Jenkins/](../Jenkins/README.md), [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| Hybrid agent CI | [Buildkite/](../Buildkite/README.md) |
| K8s-native CI | **This Tekton track** |
| Compose/Swarm / VM MIG | [CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md)–[21](../21_Compose_And_Swarm_Delivery.md) |
| MLOps / AI system delivery | [CiCd/22](../22_MLOps_And_AI_System_Delivery.md) — Tekton may build images; training loops differ |
| Assisted / AI-era delivery | Same gated loop on forge or Tekton — policy, small batches, revert ([CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)) |

Tekton does not erase those paths — it is one modern control plane when you already run Kubernetes well. **Durable jobs** (build, attest, promote, verify, rollback) outlive any one CI product name.

## 2. Advanced concepts

Write digests into Git (or an OCI registry source) from a final Pipeline Task with a **narrow** SA. CD controllers should **verify** Chains attestations when policy requires it.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| K8s app delivery | Tekton build → Flux/Argo sync |
| Mixed estate | Tekton for container apps; Jenkins for classical WAR |
| Policy gate | Admission verifies signature before sync |

**Good:** one digest, many envs. **Bad:** rebuild per environment with different flags.

## References

- [Tekton docs](https://tekton.dev/docs/)  
- [Chains](https://tekton.dev/docs/chains/)  
- [Delivery spectrum](../19_Delivery_Spectrum_Legacy_Through_Modern.md)  
