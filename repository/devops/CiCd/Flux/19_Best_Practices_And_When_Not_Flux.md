# 19 — Best practices and when not to use Flux

[← Previous](./18_Worked_Example_Bootstrap_And_App.md) · [README](./README.md) · [Next: Coverage map →](./20_Feature_And_Configuration_Coverage_Map.md)

---

## 1. Concepts — defaults that age well

| Do | Don’t |
|----|-------|
| Put desired state in Git/OCI with reviews | Store plaintext secrets in Git |
| Pin digests and chart versions in production | Track mutable `latest` |
| Use `prune` when you understand inventory | Also `kubectl apply` the same objects from CI |
| Let CI build/test; let Flux deploy | Fight Flux with a second apply path |
| Bot credentials + rotation | Shared personal PATs |
| Lock down shared clusters (SAs, no cross-ns) | Leave tenants on cluster-admin controllers |
| Scope drift `ignore` rules (e.g. HPA) | Leave `force: true` on forever |
| Add Flagger only with metrics + a traffic provider | “Canary everything” with no SLOs |

---

## 2. Advanced — when Flux is the wrong tool (for now)

| Situation | Better fit |
|-----------|------------|
| No Kubernetes | Other CD paths ([19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)) |
| Team wants a strong GUI + tenancy model out of the box | Often [Argo_CD/](../Argo_CD/README.md) |
| Throwaway debug cluster | kubectl/Helm is enough |
| You only need canaries; sync is already solved | Flagger or [Argo_Rollouts/](../Argo_Rollouts/README.md) |
| Org already standardized on the other GitOps tool | Don’t run both on the same objects |

Flux vs Argo CD is about **how your platform likes to work**, not which logo is “more GitOps.”

---

## 3. Applications and use cases

| Decision | Ask yourself |
|----------|----------------|
| Adopt Flux? | Will Git/OCI be the only routine change path? |
| Image automation? | Are those tags already CI-tested? |
| Flagger? | Do we have metrics and one traffic standard? |
| Operator? | Do we need declarative OCI/Gitless installs? |

---

## References

- [Security best practices](https://fluxcd.io/flux/security/best-practices/)  
- [FAQ](https://fluxcd.io/flux/faq/)  
- [Argo CD](../Argo_CD/README.md)  
