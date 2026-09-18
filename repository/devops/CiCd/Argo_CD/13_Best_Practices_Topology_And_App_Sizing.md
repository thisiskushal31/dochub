# 13 — Best practices, topology, and how many Applications

[← Previous](./12_Worked_Example_Simple_Website_GitOps.md) · [Argo CD](./README.md) · [Next: Feature map →](./14_Feature_And_Configuration_Coverage_Map.md)

## 1. Concepts — how professionals structure Argo CD

This chapter answers trade questions: what is **good**, what is **bad**, how many Applications, when App-of-Apps, when ApplicationSet, how to manage day-2 without drowning.

### Non-negotiable practices

| Do | Do not |
|----|--------|
| Keep **desired state in Git/OCI** | Treat the live cluster as the source of truth |
| Prefer a **config/GitOps repo** separate from app source | Commit digests into app repos in ways that loop CI forever |
| **Pin** digests, chart versions, remote bases | Track floating `:latest` / unpinned remote `main` bases in prod |
| Use **Projects** with explicit sources + destinations | Leave everything on permissive `default` forever |
| One **apply authority** (Argo) | CI `kubectl apply` fighting Argo on the same objects |
| Secrets via **destination operators** | Plaintext secrets in Git; prefer not render-time injection |
| DEV auto-sync; **prod gated** (manual / windows / reviewers) | Blind auto-prune-allowEmpty on prod |
| Annotation (or annotation+label) **resource tracking** when tools collide | Ignore ownership fights with Helm instance labels |

Official upstream also stresses: leave room for HPA-owned fields (omit `replicas`); make revisions **immutable**.

### Topology patterns that scale

```text
Pattern A — starter (≤ ~15 deployables, 1–2 clusters)
  Hand-written Application CRs in Git
  Optional tiny App-of-Apps root to bootstrap them

Pattern B — growing org (tens–hundreds of apps)
  ApplicationSet (git directories / cluster generators)
  Projects per team
  Root App-of-Apps only for platform bootstrap (Projects, ApplicationSets)

Pattern C — many clusters
  Cluster generator ApplicationSets for add-ons + apps
  Management cluster hosts Argo CD (HA)
```

## 2. Advanced concepts — sizing Applications and App-of-Apps

### What should be one Application?

**One Application ≈ one deployable unit × one environment** (or one tightly coupled unit that always ships together).

| Good Application boundary | Why |
|---------------------------|-----|
| `payments-api` staging | Own sync health, own rollback, own RBAC |
| `payments-api` prod | Different sync policy than staging |
| `payments-worker` + `payments-api` **only if** they must always release as one artifact set | Rare — usually split |

| Bad Application boundary | Why |
|--------------------------|-----|
| Entire company monorepo as one Application | One bad sync / prune blast radius; impossible ownership |
| All envs in one Application with overlays selected by parameters only | Promote and policy become mush |
| Every ConfigMap as its own Application | Noise; sync storms; human overload |
| Platform + product apps in one Application | Different lifecycles and blast radius |

**Rule of thumb:** if two things have different owners, different promote cadence, or different risk, they are **different Applications**.

### How many Applications is “too many”?

Argo CD can manage **thousands** of Applications when the control plane is sized (HA, repo-server CPU, Redis, shard/reconcile tuning). The limit you feel first is usually **human and Git**, not the CRD count:

| Count (order of magnitude) | Typical approach |
|----------------------------|------------------|
| 1–20 | Individual Application manifests; optional App-of-Apps |
| 20–200 | ApplicationSet fan-out; still readable Git |
| 200–2000+ | ApplicationSets + generators; progressive syncs; watch metrics; dedicated platform team |

**Too many hand-maintained Application YAMLs** (copy-paste drift) is the smell — not “we have 400 Applications.” Fix with ApplicationSet, not by merging unrelated apps into one Application.

### App-of-Apps: how many levels?

| Depth | Guidance |
|-------|----------|
| **1 root → children** | **Good default.** Root bootstraps Application/Project/ApplicationSet CRs |
| **2 levels** (root → team roots → apps) | OK for large orgs if each layer has a clear owner |
| **Deep trees (3+)** of App-of-Apps | **Usually bad** — hard to reason sync waves, health, and blast radius |

App-of-Apps is for **bootstrapping and grouping Application CRs**, not for nesting every microservice’s workloads as Applications-of-Applications forever. Workloads themselves are Deployments/Rollouts inside leaf Applications.

**How many children under one parent?** Prefer grouping by **team or domain** (20–50 children) over one mega-root with 500 hand-written children — use ApplicationSet for the 500.

### ApplicationSet vs many individual Applications

| Prefer ApplicationSet when… | Prefer individual Application when… |
|-----------------------------|-------------------------------------|
| Same template, many clusters/paths | One-off platform app with unique policy |
| New cluster should auto-enroll | Pedantic prod app with bespoke sync windows |
| Self-service with locked destinations | Break-glass app owned by security |

### Shared DEV vs many Applications for DEV

Default: **one shared DEV** Application (or few) per product ([CiCd/8](../8_Environments_Promotion_And_Approvals.md)). Extra DEV Applications (per PR, per task) are optional cost — not the default platform.

### Managing Argo CD itself

| Good | Bad |
|------|-----|
| Declarative `argocd-cm`, RBAC, repos, Projects in Git | Only UI click-ops for control plane |
| HA install for shared platforms | Non-HA “eval” manifests in prod |
| Pin Argo CD version; read upgrade notes | Always track floating `stable` with no review |
| SSO + Project tokens for CI | Shared `admin` password forever |
| Alerts on Degraded/OutOfSync | “CI was green so prod is fine” |

### Progressive delivery boundary

Argo CD syncs desired Pods/Rollouts. **Canary weight / analysis** is [Argo Rollouts](../Argo_Rollouts/README.md) (or Flagger). Do not overload Sync hooks as a full progressive delivery system.

## 3. Applications and use cases — decision cheatsheet

**“Should this be a new Application?”**

1. Different Git path or chart lifecycle? → yes  
2. Different destination namespace/cluster? → yes  
3. Different sync policy (auto vs manual)? → yes  
4. Same binary, just more replicas? → **no** (change Git replicas/HPA)  
5. Same app, new PR preview? → optional ApplicationSet PR generator, not a permanent prod Application  

**“Should we add another App-of-Apps layer?”**

1. Are we bootstrapping Projects/ApplicationSets? → one root is enough  
2. Are we only grouping leaf apps? → ApplicationSet or directory in Git, not another App-of-Apps level  
3. Are we nesting to fake multi-tenancy? → use **Projects + RBAC** instead  

**“Is our design healthy?”**

- You can name the owner of every Application in one sentence  
- Prod Applications are not on `default` Project  
- You can rebuild Argo CD from Git + tested backup ([10](./10_Ownership_Diffing_Webhooks_And_Observability.md))  
- Repo-server and controller metrics are boring (no constant reconcile storms)  

## References

- [Best practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)  
- [Cluster bootstrapping](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/)  
- [ApplicationSet use cases](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Use-Cases/)  
- [High availability](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)  
