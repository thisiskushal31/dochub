# 12 — Worked example: canary a service

[← Previous](./11_Notifications_Metrics_And_Kubectl_Plugin.md) · [README](./README.md) · [Next: Best practices →](./13_Best_Practices_And_When_Not_To_Use.md)

## 1. Concepts — what we build

Ship a simple HTTP service with a **canary** Rollout (no mesh first), then optionally add Prometheus analysis. Same judgment bar as the Argo CD website lab: Git-owned digests, clear promote/abort.

### Layout (GitOps-friendly)

```text
gitops/apps/demo/
  rollout.yaml
  service-stable.yaml
  service-canary.yaml   # optional until trafficRouting
  analysis-success-rate.yaml
```

## 2. Advanced concepts — steps

### A. Install

Controller + kubectl plugin ([04](./04_Install_Plugin_Dashboard_And_First_Rollout.md)). Pin versions in real envs.

### B. Services + Rollout (coarse canary)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: demo
spec:
  replicas: 10
  selector:
    matchLabels:
      app: demo
  template:
    metadata:
      labels:
        app: demo
    spec:
      containers:
        - name: demo
          image: registry.example.com/demo@sha256:aaaa
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8080
  strategy:
    canary:
      steps:
        - setWeight: 20
        - pause: { duration: 5m }
        - setWeight: 50
        - pause: { duration: 5m }
```

Apply; expose via Service/Ingress on the pods. Change image to `@sha256:bbbb` in Git (or kubectl for lab); watch:

```bash
kubectl argo rollouts get rollout demo --watch
```

At pauses: `kubectl argo rollouts promote demo` or wait for duration. Abort: `kubectl argo rollouts abort demo`.

### C. Add analysis (Prometheus)

Create AnalysisTemplate querying success rate; attach:

```yaml
strategy:
  canary:
    analysis:
      templates:
        - templateName: success-rate
      startingStep: 1
    steps:
      - setWeight: 20
      - pause: { duration: 5m }
      # ...
```

Fail the metric in a bad deploy — confirm **abort** to previous digest.

### D. GitOps

Commit Rollout + template; Argo CD Application syncs; CI only writes new digest ([10](./10_GitOps_Helm_Kustomize_And_Migrating.md)).

### E. Optional trafficRouting

Add stable/canary Services + Istio/NGINX/… per [07](./07_Traffic_Management.md) when you need true percentages.

## 3. Applications and use cases — good vs bad in this lab

| Practice | Verdict |
|----------|---------|
| 10 replicas so 20% is visible | **Good** for lab without mesh |
| Digest pins | **Good** |
| Analysis before trusting auto | **Good** |
| `:latest` + hope | **Bad** |
| Canary without abort path tested | **Bad** |
| kubectl set image as only prod path | **Bad** |

## References

- [Getting started](https://argoproj.github.io/argo-rollouts/getting-started/)  
- [Canary](https://argoproj.github.io/argo-rollouts/features/canary/)  
- [Analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)  
