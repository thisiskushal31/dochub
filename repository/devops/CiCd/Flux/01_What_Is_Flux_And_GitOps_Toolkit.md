# 01 — What is Flux and the GitOps Toolkit

[← Flux](./README.md) · [Next: Core concepts →](./02_Core_Concepts_Sources_And_Reconciliation.md)

---

## 1. Concepts

### The everyday problem

Many teams deploy Kubernetes like this: a CI job finishes tests, then runs `kubectl apply` or `helm upgrade` with a powerful cluster credential.

That works for a demo. At scale it hurts:

- **Hard to audit** — “who changed prod?” lives in a CI log, not a reviewable history of desired state.  
- **Drift** — someone patched the cluster by hand; Git no longer matches reality.  
- **Dangerous credentials** — every pipeline that can deploy is a path into the cluster.  
- **Painful rollback** — “find the old YAML” instead of “go back to a known Git commit.”

### GitOps in one sentence

**Desired state** lives in Git (or an OCI registry). A process **inside** the cluster **pulls** that state and makes the live cluster match — continuously.

**Flux** is a CNCF-graduated way to do that on Kubernetes. It ships as the **GitOps Toolkit**: several specialized controllers and APIs you compose. It is not “one big UI app” (that’s closer to Argo CD’s shape).

### What Flux is (and is not)

| It is | It is not |
|-------|-----------|
| Continuous **delivery** for Kubernetes (apply + keep matching) | Continuous **integration** (build/test stay in CI) |
| Controllers that fetch **Sources** and apply via **Kustomization** / **HelmRelease** | Traffic shifting / canaries by itself ([Flagger](./17_Flagger_Progressive_Delivery.md) does that) |
| CLI- and Git-friendly operations | Required for VMs or classic hosts ([18](../18_VM_MIG_And_Host_Based_Deploy.md)) |

### Pull picture

```text
  You / CI change Git or OCI     (desired state)
              │
              │  Flux pulls on a timer or webhook
              ▼
         ┌─────────┐
         │  Flux   │  fetch → package → apply
         └────┬────┘
              ▼
         Kubernetes cluster      (live state)
```

After tests, CI usually **publishes an image** and **updates an image digest in Git** (or lets Flux image automation commit that bump). **Flux** does the apply.

### Why teams use it

- Every change is a Git/OCI revision you can review and revert  
- Flux notices drift and can put the cluster back  
- You assemble only the pieces you need  
- Optional **Gitless GitOps**: the cluster reads OCI artifacts from a registry (humans may still edit Git; CI publishes the artifact)

---

## 2. Advanced concepts

### GitOps is a team contract, not a logo

Flux will sync whatever you point at. It only “works” if:

1. Desired state for managed apps really lives in Git/OCI  
2. People stop routine `kubectl` edits on those objects  
3. Secrets are not plaintext in Git ([11](./11_Secrets_SOPS_And_Sealed_Secrets.md))  
4. CI does **not** also `kubectl apply` the same objects (two bosses fighting)

### Flux vs Argo CD

Same job class. Flux = toolkit CRDs + CLI. Argo CD = Application objects + UI. Progressive delivery companions differ (Flagger vs Argo Rollouts). Details: [README](./README.md), [Argo_CD/](../Argo_CD/README.md).

### Brownfield is normal

You can run Flux for some clusters while Jenkins or host deploys still ship other systems ([19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)). Draw a clear line: *these namespaces are Flux-managed*.

---

## 3. Applications and use cases

| Role | Takeaway |
|------|----------|
| App developer | For routine releases, change Git/OCI — not kubectl |
| Platform | Own install, access, and controller health |
| Staff+ | Pick Flux vs Argo CD on ergonomics, not hype |

**Good:** Git is how production changes. **Bad:** Flux installed, but everyone still kubectl-patches prod.

---

## References

- [Flux documentation](https://fluxcd.io/flux/)  
- [Core concepts](https://fluxcd.io/flux/concepts/)  
- [Get started](https://fluxcd.io/flux/get-started/)  
- [OpenGitOps](https://opengitops.dev/)  
