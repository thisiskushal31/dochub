# 12 — Worked example: sync a simple website with Argo CD

[← Previous](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md) · [Argo CD](./README.md) · [Next: Best practices →](./13_Best_Practices_Topology_And_App_Sizing.md)

---

## 1. Concepts — what we are building

Goal: a person who has never used Argo CD ships a **static website** (nginx serving HTML) the **right** way:

1. App code (or static files) builds to an image **or** ConfigMap of content  
2. Desired Kubernetes state lives in a **GitOps repo**  
3. Argo CD **Application** syncs that state  
4. Change HTML → new commit → Argo syncs → site updates  

This chapter is deliberately concrete. Theory lives in 01–11; catalogs in 14–18.

### Recommended shape (good practice)

```text
website-source/          # optional: Hugo/React/plain HTML → CI builds image
website-gitops/          # manifests only (preferred separate repo)
  apps/website/
    base/
      deployment.yaml
      service.yaml
      ingress.yaml      # or LoadBalancer Service for a lab
    overlays/
      dev/
        kustomization.yaml
      prod/
        kustomization.yaml
  argocd/
    application-website-dev.yaml
    application-website-prod.yaml
    project-websites.yaml
```

**Bad practice for learning-and-keeping:** everything only clicked in the UI with no Git Application CR — you cannot rebuild the control plane story.

---

## 2. Advanced concepts — step-by-step lab

Assume: Kubernetes cluster, `kubectl`, Argo CD already installed ([04](./04_Install_Access_And_First_Application.md)), CLI logged in.

### Step A — GitOps manifests (directory or Kustomize)

Minimal Deployment + Service (pin an image digest in real life; tag shown for readability):

```yaml
# apps/website/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: website
spec:
  replicas: 2
  selector:
    matchLabels:
      app: website
  template:
    metadata:
      labels:
        app: website
    spec:
      containers:
        - name: nginx
          image: nginx:1.27-alpine
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /
              port: 80
---
# apps/website/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: website
spec:
  selector:
    app: website
  ports:
    - port: 80
      targetPort: 80
```

Optional Ingress (cluster must have an ingress controller):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: website
spec:
  rules:
    - host: website.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: website
                port:
                  number: 80
```

Commit to `website-gitops` on `main`.

### Step B — Project (do not leave prod on `default`)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: websites
  namespace: argocd
spec:
  description: Static sites and marketing web apps
  sourceRepos:
    - https://git.example.com/org/website-gitops.git
  destinations:
    - namespace: website-dev
      server: https://kubernetes.default.svc
    - namespace: website-prod
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ''
      kind: Namespace
  namespaceResourceWhitelist:
    - group: 'apps'
      kind: Deployment
    - group: ''
      kind: Service
    - group: networking.k8s.io
      kind: Ingress
```

Tighten further in real orgs (deny wildcards). Apply into `argocd` namespace.

### Step C — Application (DEV, auto-sync)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: website-dev
  namespace: argocd
spec:
  project: websites
  source:
    repoURL: https://git.example.com/org/website-gitops.git
    targetRevision: main
    path: apps/website/overlays/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: website-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 3
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 1m
```

### Step D — Application (PROD, gated)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: website-prod
  namespace: argocd
spec:
  project: websites
  source:
    repoURL: https://git.example.com/org/website-gitops.git
    targetRevision: main
    path: apps/website/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: website-prod
  syncPolicy:
    # manual sync — human or CI token after verify
    syncOptions:
      - CreateNamespace=true
```

Apply both Applications. DEV should become **Synced / Healthy** after auto-sync. PROD waits for Sync in UI/CLI:

```bash
argocd app sync website-prod
argocd app get website-prod
```

### Step E — Change the site the GitOps way

1. Change content (new image digest in Deployment, or ConfigMap volume with HTML).  
2. Commit + push to GitOps repo.  
3. DEV auto-syncs.  
4. Verify (curl Ingress/Service, [CiCd/5](../5_Verify_Rollback_And_Synthetic_Tests.md)).  
5. Sync PROD (or merge a promote commit that only changes prod overlay if you use that pattern).

### Step F — Rollback

```bash
# Prefer Git revert of the bad commit, then sync
# Or sync a previous revision explicitly:
argocd app history website-prod
argocd app rollback website-prod <history-id>
```

Then make Git match what you rolled to — otherwise the next sync re-applies the bad commit.

---

## 3. Applications and use cases — good vs bad for this pattern

| Practice | Verdict |
|----------|---------|
| Separate GitOps repo | **Good** |
| Project limiting repos + namespaces | **Good** |
| DEV auto-sync + self-heal; PROD manual or windowed | **Good** |
| `CreateNamespace=true` for app namespaces | **Good** (or manage Namespace as its own app) |
| Image digests in prod overlay | **Good** |
| Only UI “New App”, never commit Application CR | **Bad** (not rebuildable) |
| `:latest` + hope | **Bad** |
| `kubectl edit deploy` in prod as normal | **Bad** (self-heal undoes or drift wins) |
| One Application for both DEV and PROD paths | **Bad** (blurred promote, shared sync policy) |
| CI `kubectl apply` *and* Argo | **Bad** |

### Variant: Helm chart website

Point `source` at a chart (`chart:` + `helm.valueFiles`) instead of a path. Same Project/Application policy story. See [17](./17_Sources_Private_Repos_And_Parameters.md).

### Variant: OCI-stored manifests

Push rendered YAML to an OCI registry; Application `source` uses OCI. Same sync policies.

---

## References

- [Getting started](https://argo-cd.readthedocs.io/en/stable/getting_started/)  
- [Application specification](https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/)  
- [Best practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)  
- Sizing judgment: [13](./13_Best_Practices_Topology_And_App_Sizing.md)  
