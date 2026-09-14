# 01 — What is Argo CD and why GitOps

[← Argo CD](./README.md) · [Next: Core concepts →](./02_Core_Concepts_Applications_Sync_And_Health.md)

---

## 1. Concepts

### The delivery problem Argo CD addresses

On Kubernetes, “deploy” used to mean a human or a CI job running `kubectl apply` (or Helm upgrade) against a cluster with standing credentials. That works for a demo. At scale it creates familiar pain:

- **Who changed production?** The audit trail is a CI log or a chat message, not a reviewable history of desired state.
- **Drift.** Someone patched a Deployment in the UI or with kubectl; Git no longer matches the cluster; the next pipeline may or may not notice.
- **Blast radius of credentials.** Every pipeline that can deploy needs cluster admin (or near it). Compromising CI compromises the cluster.
- **Rollback theater.** “Roll back” becomes “find the old YAML on someone’s laptop” instead of “sync a known Git revision.”

**GitOps** answers this with a different contract: the **desired state** of the system lives in version control (or another declarative store such as OCI). A **reconciler** in the cluster **pulls** that state and makes the live system match. Humans and CI change **Git** (or the OCI artifact); they do not need ongoing `kubectl` power into production for routine releases.

**Argo CD** is a widely used GitOps continuous delivery controller for Kubernetes. It watches Applications you define, renders manifests from Git/Helm/Kustomize/OCI (or a plugin), compares **target** vs **live**, and syncs.

### What Argo CD is (and is not)

| It is | It is not |
|-------|-----------|
| A **CD** / GitOps **reconciler** for Kubernetes | A **CI** system (build/test/push stay elsewhere) |
| A place to see **sync** and **health** of apps | A progressive traffic controller ([Argo Rollouts](../Argo_Rollouts/README.md) is separate) |
| Multi-tenant capable (Projects, SSO, RBAC, UI) | Required for every deploy target (VMs, classic hosts use other adapters — [18](../18_VM_MIG_And_Host_Based_Deploy.md), [20](../20_Classical_Jenkins_Host_And_Web_Deploy.md)) |

OpenGitOps principles (declarative, versioned, pulled, continuously reconciled) describe the *posture*; Argo CD is one concrete implementation of that posture on Kubernetes.

### Pull vs push in one picture

```text
                    ┌─────────────┐
   developers / CI  │  Git / OCI  │  desired manifests
                    └──────┬──────┘
                           │ pull / refresh
                    ┌──────▼──────┐
                    │  Argo CD    │  compare + sync
                    └──────┬──────┘
                           │ apply
                    ┌──────▼──────┐
                    │ Kubernetes  │  live state
                    └─────────────┘
```

Contrast with push CD: CI holds kubeconfig and applies after build. With Argo CD, CI’s job after tests is usually **publish an image** and **update a digest in Git** (or let Image Updater do that). Argo CD performs the apply.

### Why teams adopt it

- **Auditability.** Production config changes are Git commits (review, CODEOWNERS, signed commits if you require them).
- **Convergence.** Self-heal can revert kubectl drift back to Git.
- **Separation of duties.** App developers commit to paths their Project allows; platform owns Argo CD, clusters, and destination rules.
- **Multi-cluster from one control plane.** One Argo CD can manage many registered clusters.
- **Rollback.** Sync an older revision; Git is the timeline.

---

## 2. Advanced concepts

### GitOps is a contract, not a product logo

Saying “we do GitOps” only sticks if:

1. Desired state for the managed apps actually lives in Git/OCI (not only in a wiki).  
2. The cluster is not routinely patched outside that path.  
3. Secrets are not forced into plaintext Git (see [08](./08_Secrets_CI_Integration_And_Operations.md)).  
4. CI does not also `kubectl apply` the same objects (two controllers fighting).

Argo CD will happily sync whatever you point it at. Discipline is organizational.

### Companion pieces people confuse with “Argo CD”

| Piece | Relationship |
|-------|----------------|
| **Argo CD** | GitOps sync of desired state |
| **Argo Rollouts** | Progressive delivery CRDs; **separate install** |
| **Argo CD Image Updater** | Companion that writes new image tags/digests into Git (or similar) when registries change |
| **Argo Workflows / Events** | Different products (pipelines / eventing), not required for GitOps CD |

### Brownfield reality

Many orgs run Argo CD for Kubernetes apps while **Jenkins**, host SSH, or cloud VM pipelines still ship other estates ([19](../19_Delivery_Spectrum_Legacy_Through_Modern.md)). That is normal. Argo CD does not need to own everything on day one — it needs a clear boundary: *these namespaces/clusters are GitOps-managed*.

---

## 3. Applications and use cases

| Role | How this chapter lands |
|------|------------------------|
| **Backend / app engineer** | You change GitOps paths or chart values; you watch Synced/Healthy; you do not need cluster-admin for routine releases |
| **Platform / SRE** | You install and harden Argo CD; you own Projects and cluster registration |
| **Security** | You care that prod apply rights leave CI; audit moves to Git; Projects limit destinations |
| **SE learning delivery** | Pair with [CiCd/1](../1_Pipelines_Build_Test_Deploy.md) (loop) then this track (Kubernetes CD mechanism) |

**When not to force Argo CD:** non-Kubernetes primary runtimes; teams that cannot keep desired state in Git; environments where a pull reconciler is forbidden by policy (rare — then document the push path explicitly).

---

## References

- [Argo CD overview](https://argo-cd.readthedocs.io/en/stable/)  
- [OpenGitOps principles](https://opengitops.dev/)  
- [CiCd delivery loop](../1_Pipelines_Build_Test_Deploy.md) · [Tools map](../2_CI_CD_Tools.md)  
