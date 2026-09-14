# 02 — Core concepts: Applications, sync, and health

[← Previous](./01_What_Is_Argo_CD_And_Why_GitOps.md) · [Argo CD](./README.md) · [Next: Architecture →](./03_Architecture_Components_And_Multi_Cluster.md)

---

## 1. Concepts

### Application

An **Application** is the central custom resource. It answers four questions:

1. **Where is desired state?** (`spec.source` or `spec.sources`: repo URL, path, chart, OCI, revision)  
2. **Where should it run?** (`spec.destination`: cluster API and namespace)  
3. **Under which tenancy rules?** (`spec.project`)  
4. **How aggressive is reconcile?** (`spec.syncPolicy`)

One Application is typically one deployable unit for one environment path (for example `apps/myapi/staging`). Teams often use **one Application per environment**, not one Application that tries to own every cluster at once (ApplicationSets help when you need fan-out — [07](./07_ApplicationSets_App_Of_Apps_And_Scale.md)).

### Target state vs live state

| Term | Meaning |
|------|---------|
| **Target state** | Manifests Argo CD rendered from the tracked Git/OCI revision (after Helm/Kustomize/plugin) |
| **Live state** | Objects actually present in the destination cluster |
| **Sync status** | Whether live matches target (`Synced` / `OutOfSync`) |
| **Refresh** | Re-fetch/re-render desired state and re-compare (detect drift or new commits) |
| **Sync** | Apply target to the cluster so live converges on desired |

**OutOfSync** does not always mean “broken.” It means “cluster ≠ Git right now.” Automated sync or a manual Sync button closes the gap. **Self-heal** closes the gap when *someone changed the cluster* without changing Git.

### Sync vs health

These are independent axes. Staff confuse them constantly.

| | Sync | Health |
|-|------|--------|
| Question | Does live match Git? | Are resources *working*? |
| Example | Deployment image matches Git digest | Pods Ready; Ingress has an address |
| Bad combo | Synced + **Degraded** | Git applied, but app crashes |
| Bad combo | **OutOfSync** + Healthy | Cluster was patched; app still serves |

Built-in health checks exist for common kinds (Deployments, Services, Ingress, Jobs, PVCs, Pods, and others). Custom resources often need **health customization** in Argo CD config if you want Application health to reflect them.

### Project (`AppProject`)

A **Project** groups Applications and constrains them:

- which **Git/OCI repos** may be used as sources  
- which **clusters and namespaces** may be destinations  
- which **resource kinds** may be created (for example deny cluster-scoped objects for app teams)  
- **roles** for SSO groups and automation tokens  

Every Application belongs to exactly one Project. If you omit it, you get **`default`**.

### App-of-Apps

An Application whose manifests are *other* Application (and Project) manifests. Platform teams use this to bootstrap a catalog of apps from one parent sync. It is a pattern, not a separate product.

### ApplicationSet

A controller that **generates** Applications from **generators** (list of clusters, git directories, pull requests, SCM providers, and more). Use when maintaining dozens of near-identical Applications by hand does not scale ([07](./07_ApplicationSets_App_Of_Apps_And_Scale.md)).

---

## 2. Advanced concepts

### Sync is not “kubectl apply once”

A sync operation can include:

- **Prune** — delete live objects removed from Git  
- **Hooks / waves** — ordered PreSync → Sync → PostSync resources (Jobs, and similar)  
- **Replace / force** options for stubborn objects  
- **Selective sync** — only some resources (hooks may not run the same way)

Failed hooks fail the sync. That is intentional for gates (migrate schema before serving traffic) — still distinct from progressive *traffic* shifting in Rollouts.

### Refresh vs hard refresh

Normal refresh uses caches. When manifests look stuck, operators use a **hard refresh** to invalidate cached rendered manifests. Know it exists before assuming Git is wrong.

### Ignoring differences

Some fields are owned by other controllers (HPA `replicas`, ephemeral status). Argo CD supports **ignoreDifferences** / known types so those fields do not forever mark the app OutOfSync. Leaving `replicas` out of Git when HPA owns scale is the clean design; ignore rules are the escape hatch.

### Resource tracking

Argo CD labels/annotates managed resources so it knows what it owns. Understanding tracking matters when two tools fight over the same object or when you migrate from Helm-release ownership to Argo ownership. Prefer **annotation** tracking when Helm/operators also use `app.kubernetes.io/instance` — full detail in [10](./10_Ownership_Diffing_Webhooks_And_Observability.md).

### Deleting an Application

Application deletion can cascade (finalizers) and **prune** cluster resources depending on policy. It does **not** delete container images from your registry. Treat Application delete as “remove desired state from this cluster,” not “unpublish the artifact.”

---

## 3. Applications and use cases

| Scenario | Concept that matters |
|----------|----------------------|
| Green in Git, red in UI | Health ≠ sync — debug pods/probes, not only Git |
| Someone fixed prod with kubectl | Self-heal vs policy forbidding cluster edits |
| Two teams share one Argo CD | Projects + destinations + SSO groups |
| Bootstrap 40 microservices | App-of-Apps or ApplicationSet, not 40 hand-clicked Applications |
| Preview every PR | ApplicationSet PR generator (optional); shared DEV remains default for day-to-day ([8](../8_Environments_Promotion_And_Approvals.md)) |

### Quick sheet

- **Application** — deployable unit CRD  
- **Project** — tenancy boundary  
- **Sync** — make live = target  
- **Health** — is it serving/ready  
- **Self-heal** — repair cluster drift toward Git  
- **Prune** — delete resources removed from Git  
- **ApplicationSet** — generate many Applications  
- **App-of-Apps** — parent Application of Applications  

---

## References

- [Core concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/)  
- [Projects](https://argo-cd.readthedocs.io/en/stable/user-guide/projects/)  
- [Resource health](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/)  
