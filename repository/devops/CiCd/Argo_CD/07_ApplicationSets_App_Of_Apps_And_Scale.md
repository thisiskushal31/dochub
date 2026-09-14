# 07 — ApplicationSets, App-of-Apps, and scale

[← Previous](./06_Sync_Policies_Waves_Projects_And_RBAC.md) · [Argo CD](./README.md) · [Next: Secrets and CI →](./08_Secrets_CI_Integration_And_Operations.md)

---

## 1. Concepts

Once you have more than a handful of Applications, click-ops and copy-paste YAML become the bottleneck. Two first-class patterns fix that: **App-of-Apps** and **ApplicationSets**.

### App-of-Apps

A root Application points at a Git path whose manifests are **other Application (and AppProject) manifests**. Syncing the root creates/updates the children. Platform teams use this to bootstrap:

```text
root Application (platform-bootstrap)
  └── renders Applications:
        team-a-dev, team-a-staging, team-a-prod
        team-b-dev, …
```

Children still obey Projects and sync policies. The root is often itself GitOps-managed (chicken-and-egg solved by applying the root once, then managing everything through Git).

### ApplicationSet

An **ApplicationSet** is a CRD plus controller that **templates** Applications. A **generator** produces a list of parameter sets; the **template** fills an Application spec per item.

| Generator (examples) | Produces parameters from… |
|----------------------|---------------------------|
| **List** | Explicit elements in the ApplicationSet |
| **Cluster** | Clusters registered in Argo CD |
| **Git directories** | Folders matching a glob in a repo |
| **Git files** | JSON/YAML metadata files in a repo |
| **Pull Request** | Open PRs on a forge (preview apps) |
| **SCM Provider** | Repos discovered in an org |
| **Matrix / Merge** | Combinations of other generators |
| **Plugin / OCI** | Extensibility |

One ApplicationSet can keep hundreds of Applications consistent: same Project, same sync policy shape, different cluster or path.

### When to use which

| Pattern | Strength |
|---------|----------|
| **App-of-Apps** | Simple, obvious Git layout of Application CRs; great bootstrap |
| **ApplicationSet** | Dynamic membership (new cluster → new apps); less duplicated YAML; safer self-service when template locks dangerous fields |
| **Both** | Root App-of-Apps deploys ApplicationSets and Projects; ApplicationSets spawn team apps |

---

## 2. Advanced concepts

### Official-scale use cases

**Cluster add-ons.** Ops must install Prometheus, cert-manager, or similar on many clusters. ApplicationSets (cluster or git generators) create one Application per cluster per add-on. Adding a cluster registration grows the fleet without editing twenty YAML files by hand.

**Monorepo fan-out.** A single Git repo holds many app directories. A git directory generator creates one Application per directory so a merge updates the right workload.

**Self-service without handing out raw Application power.** Developers should not freely set `destination.server` to production. An ApplicationSet template **fixes** Project, cluster, and namespace; developers only change allowed parameters (for example source path via a `config.json` the git file generator reads). Review still matters; blast radius is smaller than merging unconstrained Application CRs.

**PR previews.** Pull Request generator spins ephemeral Applications per PR. Useful for UI review environments. It is **not** a replacement for shared DEV for everyday integration ([8](../8_Environments_Promotion_And_Approvals.md)). Garbage-collect merged/closed PRs deliberately or you leak namespaces.

### Progressive syncs

ApplicationSets can sync generated Applications in controlled waves (progressive syncs) so a bad template does not simultaneous-break an entire fleet. Use when blast radius of “all clusters at once” is unacceptable.

### Controlling drift on generated Applications

If the controller owns the child Application spec, UI edits to children get overwritten. Design changes in the ApplicationSet. Learn the resource-modification / ignore settings before fighting the controller.

### Template safety

Treat ApplicationSet templates like privileged code: a mistaken `namespace: '{{name}}'` or wrong Project can spray apps across destinations. Start in a non-prod management path; use dry-run / create-only policies while learning.

### App-of-Apps and health

Parent Application health historically interacted awkwardly with child Applications (custom health for `Application` kind may be needed for sync-wave orchestration). If you orchestrate children with waves, verify parent health behavior on your Argo CD version.

---

## 3. Applications and use cases

| Organization shape | Suggested approach |
|--------------------|--------------------|
| 5 apps, 1 cluster | Hand-written Applications or small App-of-Apps |
| 50 apps, 1 cluster | Git directory ApplicationSet or App-of-Apps of Application CRs |
| 10 apps, 30 clusters | Cluster generator ApplicationSet |
| Many teams, one platform | ApplicationSets with locked destinations + Projects per team |
| Ephemeral QA per PR | PR generator **plus** TTL/cleanup discipline |

### Anti-patterns

- Generating Applications that all use the permissive `default` Project  
- PR previews as the *only* DEV strategy  
- Copy-pasting 80 near-identical Application manifests “because ApplicationSets looked scary”  
- Letting every developer merge unrestricted Application CRs into the bootstrap repo  

---

## References

- [ApplicationSet](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/)  
- [ApplicationSet use cases](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Use-Cases/)  
- [Generators](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/)  
- [Cluster bootstrapping / App-of-Apps](https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-bootstrapping/)  
- [Pull Request generator](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators-Pull-Request/)  
