# 04 — Install, access, and first Application

[← Previous](./03_Architecture_Components_And_Multi_Cluster.md) · [Argo CD](./README.md) · [Next: Sources →](./05_Manifest_Sources_Tracking_And_Immutability.md)

## 1. Concepts

This chapter is the practical path from empty cluster to **Synced + Healthy**. Commands illustrate the flow; pin versions and follow current install notes for production.

### Prerequisites

- A Kubernetes cluster and `kubectl` with a working kubeconfig  
- Network path from Argo CD to your Git (or OCI) host  
- For learning: ability to port-forward or expose the `argocd-server` service  

### Install (evaluation shape)

Create a namespace and apply the multi-tenant install manifests (non-HA is fine for a lab):

```bash
kubectl create namespace argocd
kubectl apply -n argocd --server-side --force-conflicts \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

**Server-side apply** avoids CRD annotation size limits. For anything past a throwaway lab, switch to a **version-pinned** manifest URL (for example a release tag) so upgrades are intentional.

**Production:** prefer the **HA** install set, TLS you trust, SSO, and locked-down Projects ([03](./03_Architecture_Components_And_Multi_Cluster.md), [06](./06_Sync_Policies_Waves_Projects_And_RBAC.md)).

**Core install** omits UI/API — useful for admins driving GitOps headlessly; skip if you want the dashboard.

### CLI

Install the `argocd` CLI from official releases (or package managers such as Homebrew on Mac/Linux). The CLI talks to the API server the same way the UI does.

### Access the API / UI

By default `argocd-server` is not a public LoadBalancer. Common lab access:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Then open `https://localhost:8080` (self-signed cert — browsers complain; CLI often uses `--insecure` in labs). Alternatives: change the Service to `LoadBalancer`, or front it with Ingress and real certificates.

### Initial admin password

The initial `admin` password is stored in a Secret (commonly `argocd-initial-admin-secret`) in the install namespace. Retrieve it with kubectl, log in, then **change the password** and move to SSO for humans as soon as you can. Shared long-lived admin is an incident waiting to happen.

```bash
argocd login localhost:8080 --insecure
# use admin + password from the secret
```

`argocd login --core` uses in-cluster / kubeconfig access and skips the usual login flow — handy for controllers on the management cluster, not a substitute for SSO for people.

### Register a repository

Add the Git (or OCI) repo that holds manifests — via UI **Settings → Repositories**, or CLI. Private repos need a credential (HTTPS token, SSH key, or cloud IAM patterns your install supports). Repo credentials are stored as Kubernetes Secrets managed by Argo CD.

### Create and sync an Application

**UI path:** New App → set name, Project, source repo/path/revision, destination cluster/namespace → Create → Sync.

**Declarative path (preferred long-term):** commit an Application manifest into a bootstrap repo (or apply it once):

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
  syncPolicy:
    syncOptions:
      - CreateNamespace=true
```

Then:

```bash
kubectl apply -n argocd -f application.yaml
argocd app sync guestbook
argocd app get guestbook
```

You want **Synced** and **Healthy**. If Synced but Degraded, debug the workload (image pull, probes, permissions) — not only Git.

### Declarative Argo CD itself

Serious installs manage Argo CD’s own ConfigMaps, Projects, and repo credentials as GitOps (Kustomize overlays on the upstream manifests). Bootstrapping can start imperative; steady state should not depend on click-ops in the UI for control-plane config.

## 2. Advanced concepts

### CreateNamespace and first sync footguns

Without `CreateNamespace=true` (or a pre-created namespace), sync fails when the destination namespace is missing. Pre-creating namespaces as their own Applications is cleaner for multi-tenant platforms.

### Who may create Applications

If only the UI admin can click “New App,” you do not have self-service — you have a ticket queue. Either:

- developers commit Application manifests to a path a root App-of-Apps syncs, or  
- ApplicationSets generate Applications from safe templates ([07](./07_ApplicationSets_App_Of_Apps_And_Scale.md)),  

with Projects enforcing destination limits.

### TLS and `--insecure`

Lab `--insecure` must not become production normal. Terminate TLS at Ingress or configure certificates Argo CD and clients trust.

### Upgrades

Read the version upgrade notes for your from→to pair. CRD changes and SSO/Dex quirks show up at upgrade time. Pin versions; test in a non-prod management cluster first.

### Local override sync

`argocd app sync APP --local ./dir` pushes local manifests — useful for debugging, an anti-pattern for production delivery (breaks the Git source of truth). Requires elevated permissions.

## 3. Applications and use cases

| Goal | Practical path |
|------|----------------|
| Learn on a laptop | Non-HA install, port-forward, example guestbook app, then replace with your GitOps repo |
| Team platform MVP | HA install, SSO, one Project per team, one shared DEV Application path ([8](../8_Environments_Promotion_And_Approvals.md)) |
| Prod hardening after MVP | Pin versions; sync windows or manual sync for prod; remove permissive `default` Project use |
| CI creates apps | Prefer Git commits of Application CRs over CI calling every sync API for routine deploys |

### First-week checklist

- Admin password rotated; SSO planned  
- At least one private repo credential working  
- One real Application Synced/Healthy from *your* Git, not only the example  
- Project created that is tighter than `default` for anything non-lab  
- Document how image digests get into Git after CI  

## References

- [Getting started](https://argo-cd.readthedocs.io/en/stable/getting_started/)  
- [Installation](https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/)  
- [CLI installation](https://argo-cd.readthedocs.io/en/stable/cli_installation/)  
- [Declarative setup](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)  
