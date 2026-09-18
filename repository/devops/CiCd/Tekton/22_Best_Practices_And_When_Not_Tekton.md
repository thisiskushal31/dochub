# 22 — Best practices and when not Tekton

[← Previous](./21_Worked_Example_Build_Test_Push.md) · [README](./README.md) · [Next: Coverage map →](./23_Feature_And_Offering_Coverage_Map.md)

## 1. Concepts — defaults that age well

| Do | Don’t |
|----|-------|
| Pin Task/Pipeline/StepAction versions (SHA/digest) | Float `main` / Hub `latest` |
| Least-privilege SA per trust tier | cluster-admin for CI |
| Small Tasks + Catalog/resolvers | 50-step monolith Tasks |
| Prune Runs; archive with Results if needed | Infinite CR growth |
| Promote by digest; verify attestations | Rebuild for “prod”; unsigned `:latest` |
| Isolate untrusted PRs (PAC/Triggers) | Prod push from forks |
| Git as source of truth | Only Dashboard/`tkn start` snowflakes |
| Durable jobs first (build, attest, promote) | Tool fashion without a platform team |

## 2. Advanced — when *not* (or not only) Tekton

| Situation | Better fit |
|-----------|------------|
| No Kubernetes platform team | [GitHub_Actions/](../GitHub_Actions/README.md) / [GitLab_CI/](../GitLab_CI/README.md) |
| Classical VM/WAR / host deploy estates | [Jenkins/](../Jenkins/README.md), [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| Hybrid agents, hosted control plane preference | [Buildkite/](../Buildkite/README.md) |
| Only desired-state sync | [Argo_CD/](../Argo_CD/README.md) / [Flux/](../Flux/README.md) |
| Compose/Swarm / MIG delivery | [CiCd/18](../18_VM_MIG_And_Host_Based_Deploy.md)–[21](../21_Compose_And_Swarm_Delivery.md) |
| Assisted delivery on forge | Still forge CI + policy — Tekton optional ([CiCd/19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)) |

Keep Tekton when **pipelines-as-cluster-API** is the platform bet and you can staff controller ops. Improve RBAC and pins; do not abandon a working forge CI for fashion alone.

Cluster *internals* are not taught here — [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive).

## 3. Applications and use cases

| Decision | Ask |
|----------|-----|
| Adopt Tekton? | Do we already operate Kubernetes well? |
| PAC vs Triggers? | SCM-native CI vs generic events |
| Chains now? | Will CD actually verify attestations? |
| Results? | Do auditors need history after prune? |

**Staff checklist**

- Pins + SA tiers + pruner on every cluster that runs Tekton  
- Spectrum doors documented for classical/forge estates still in the company  
- GitOps handoff path clear for digests ([26](./26_GitOps_Handoff_And_Spectrum.md))  

## References

- [Tekton docs](https://tekton.dev/docs/)  
- [CiCd tools map](../2_CI_CD_Tools.md)  
- [Delivery spectrum](../19_Delivery_Spectrum_Legacy_Through_Modern.md)  
