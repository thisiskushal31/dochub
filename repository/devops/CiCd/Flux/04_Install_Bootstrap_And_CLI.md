# 04 — Install: CLI bootstrap and Flux Operator

[← Previous](./03_Architecture_And_Controllers.md) · [README](./README.md) · [Next: First reconcile →](./05_First_Reconcile_And_Day1_Loop.md)

---

## 1. Concepts

You need two things:

1. The **`flux` CLI** on your laptop (or CI)  
2. The **controllers** running in the cluster  

First install needs strong cluster rights (cluster-admin or equivalent). Check the [installation](https://fluxcd.io/flux/installation/) page for **current** supported Kubernetes versions — they change.

### Install the CLI

Homebrew, Mise, or binaries from GitHub releases. Then:

```bash
flux check --pre
```

### Path A — Classic bootstrap (most common)

`flux bootstrap` talks to your Git host, commits Flux’s own manifests, installs controllers, and points Flux at a path in that repo (for example `./clusters/my-cluster`).

```bash
export GITHUB_TOKEN=<token>   # prefer a bot + fine-grained scopes at work
export GITHUB_USER=<user>

flux bootstrap github \
  --owner=$GITHUB_USER \
  --repository=fleet-infra \
  --branch=main \
  --path=./clusters/my-cluster \
  --personal
```

In human terms, bootstrap usually:

1. Creates or uses a Git repo  
2. Commits controller manifests + “sync” manifests  
3. Installs Flux in `flux-system`  
4. Sets up a deploy key (or similar) so Flux can read (and often write) Git  
5. Starts reconciling that `--path`  

It is **safe to re-run** (idempotent) — including for many upgrades. Guides exist for GitHub, GitLab, Bitbucket, Azure DevOps, CodeCommit, Gitea, and others — same idea, different login flags.

### Path B — Flux Operator

The **Flux Operator** uses a `FluxInstance` object to install and upgrade Flux declaratively. It can sync from **Git, OCI, or Bucket**, which helps **Gitless** setups where production clusters should not call Git. See [fluxoperator.dev](https://fluxoperator.dev/) and the Flux install index. You can migrate from CLI bootstrap later if you start classic.

---

## 2. Advanced concepts

### Customize bootstrap

After the first run, the fleet repo holds Flux manifests you can patch: extra components, image mirrors, resource limits, multitenancy flags ([16](./16_Scale_Multitenancy_And_Platform_Config.md)).

### Optional components

Image automation and source-watcher are **off** unless you ask (`--components-extra=…` or Operator config).

### Hard environments

Air-gapped mirrors, HTTP proxies, and OpenShift have dedicated guides — follow those; don’t invent offline steps.

### Credentials hygiene

Production: bot identity, minimum token scopes, rotate deploy keys ([12](./12_Security_Identity_And_Air_Gap.md)). Prefer **workload identity** for cloud registries/KMS when available.

### Upgrade and uninstall

Documented flows exist. Test upgrades on staging. Before uninstall, understand prune — Flux may delete managed apps when torn down ([15](./15_Monitoring_Events_Metrics_And_Upgrade.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Try on a laptop | kind + personal GitHub bootstrap |
| Company fleet | Org repo + bot + one Git path per cluster |
| No Git from prod cluster | Operator / OCI sync |
| Shared cluster with teams | Bootstrap + multitenancy patches |

**Good:** the fleet path is reviewable Git; bot owns the deploy key. **Bad:** one human’s PAT forever.

---

## References

- [Installation](https://fluxcd.io/flux/installation/)  
- [Bootstrap](https://fluxcd.io/flux/installation/bootstrap/)  
- [Bootstrap customization](https://fluxcd.io/flux/installation/configuration/bootstrap-customization/)  
- [Optional components](https://fluxcd.io/flux/installation/configuration/optional-components/)  
- [Get started](https://fluxcd.io/flux/get-started/)  
- [Flux Operator](https://fluxoperator.dev/)  
