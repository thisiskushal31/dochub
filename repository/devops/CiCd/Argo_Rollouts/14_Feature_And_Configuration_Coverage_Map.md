# 14 — Feature and configuration coverage map

[← Previous](./13_Best_Practices_And_When_Not_To_Use.md) · [README](./README.md) · [Next: Spec catalog →](./15_Rollout_Spec_And_Strategy_Configuration_Catalog.md)

---

## 1. Concepts

Use this chapter to see **which feature classes exist** and **where they are taught** in these notes. Field-level YAML evolves by version — confirm keys in References when implementing. The handbook teaches the product surface; official docs remain the place for exhaustive CLI man pages and long per-provider cookbooks.

---

## 2. Advanced concepts — feature inventory

### A. Core

| Feature | Chapter |
|---------|---------|
| Progressive delivery idea | [01](./01_What_Is_Argo_Rollouts_And_Progressive_Delivery.md) |
| Rollout / Analysis* / Experiment vocabulary | [02](./02_Core_Concepts_Rollout_Analysis_Experiment.md) |
| Controller architecture | [03](./03_Architecture_And_Controller.md) |
| Install (standard / namespace) | [04](./04_Install_Plugin_Dashboard_And_First_Rollout.md) |
| Kubectl plugin | [04](./04_Install_Plugin_Dashboard_And_First_Rollout.md), [11](./11_Notifications_Metrics_And_Kubectl_Plugin.md) |
| Dashboard UI | [04](./04_Install_Plugin_Dashboard_And_First_Rollout.md) |

### B. Strategies

| Strategy / shape | Chapter |
|------------------|-------|
| **Blue-green** (only first-class alternative to canary) | [05](./05_Blue_Green_Strategy.md) |
| **Canary** with steps | [06](./06_Canary_Strategy_And_Steps.md) |
| **Canary + traffic manager** | [06](./06_Canary_Strategy_And_Steps.md) + [07](./07_Traffic_Management.md) |
| **Rolling update** (canary, `steps` omitted) | [06](./06_Canary_Strategy_And_Steps.md) |
| **Recreate** | Not a Rollout strategy — called out in [06](./06_Canary_Strategy_And_Steps.md) |
| Canary **steps**: `setWeight`, `pause`, `setCanaryScale`, `setHeaderRoute`, `setMirrorRoute`, inline `analysis`, inline `experiment`, step `plugin` | [06](./06_Canary_Strategy_And_Steps.md) |
| Background analysis / dynamic scale / maxSurge / pingPong / abort delays / ephemeral metadata | [06](./06_Canary_Strategy_And_Steps.md), [15](./15_Rollout_Spec_And_Strategy_Configuration_Catalog.md) |
| Rollout specification surfaces | [15](./15_Rollout_Spec_And_Strategy_Configuration_Catalog.md) |

### C. Traffic management

| Provider / topic | Chapter |
|------------------|-------|
| Overview + canary/stable Services | [07](./07_Traffic_Management.md) |
| Istio, NGINX, ALB, Ambassador, Traefik, HAProxy, Kong, SMI, APISIX, Google Cloud | [07](./07_Traffic_Management.md) |
| AWS App Mesh (getting-started class) | [07](./07_Traffic_Management.md) |
| Mixed providers | [07](./07_Traffic_Management.md) |
| Header routes / mirror routes / managedRoutes | [06](./06_Canary_Strategy_And_Steps.md), [07](./07_Traffic_Management.md) |
| Traffic router plugins / Gateway API style | [07](./07_Traffic_Management.md) |

### D. Analysis

| Feature | Chapter |
|---------|-------|
| AnalysisTemplate / Run / Cluster template | [08](./08_Analysis_And_Metric_Providers.md) |
| Background / inline / pre-post promotion | [08](./08_Analysis_And_Metric_Providers.md) |
| Dry-run analysis, retention, TTL, delay, secrets | [08](./08_Analysis_And_Metric_Providers.md) |
| Prometheus, Datadog, New Relic, Wavefront, Graphite, InfluxDB, CloudWatch, SkyWalking, Kayenta, Job, Web | [08](./08_Analysis_And_Metric_Providers.md) |
| Analysis plugins | [08](./08_Analysis_And_Metric_Providers.md) |

### E. Extra Rollout features

| Feature | Chapter |
|---------|-------|
| Experiment | [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md) |
| HPA / VPA | [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md) |
| Ephemeral metadata | [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md) |
| Restart / rollback window / scaledown aborted / anti-affinity | [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md) |

### F. Packaging, GitOps, migrate

| Feature | Chapter |
|---------|-------|
| Helm / Kustomize | [10](./10_GitOps_Helm_Kustomize_And_Migrating.md) |
| Migrating Deployment / workloadRef | [10](./10_GitOps_Helm_Kustomize_And_Migrating.md) |
| Argo CD pairing | [10](./10_GitOps_Helm_Kustomize_And_Migrating.md) |

### G. Day-2

| Feature | Chapter |
|---------|-------|
| Notifications (service class) | [11](./11_Notifications_Metrics_And_Kubectl_Plugin.md) |
| Controller metrics | [11](./11_Notifications_Metrics_And_Kubectl_Plugin.md) |
| Best practices / FAQ judgment | [13](./13_Best_Practices_And_When_Not_To_Use.md) |
| Worked canary lab | [12](./12_Worked_Example_Canary_A_Service.md) |
| Troubleshooting | [16](./16_Troubleshooting_And_Staff_Checklist.md) |

### H. Plugins umbrella

| Plugin kind | Chapter |
|-------------|-------|
| Metric / traffic / canary step plugins | [02](./02_Core_Concepts_Rollout_Analysis_Experiment.md), [07](./07_Traffic_Management.md), [08](./08_Analysis_And_Metric_Providers.md), [plugins overview](https://argoproj.github.io/argo-rollouts/plugins/) |

### I. Deeper upstream essays

| Area | Notes |
|------|-------|
| Kubectl plugin man pages | Version-specific generated docs for your release |
| Per-notification-service YAML examples | Same triggers model as [11](./11_Notifications_Metrics_And_Kubectl_Plugin.md); service-specific samples stay upstream |
| Per–traffic-provider getting-started essays | Providers catalogued in [07](./07_Traffic_Management.md); long provider labs stay upstream |
| Security reporting / bug-bounty / signed-release assets | Project security process when choosing images — see upstream security docs |
| CONTRIBUTING / releasing / roadmap / proposals | Contributor process, not day-2 operator literacy |
| Third-party metric plugin catalogs (Honeycomb, Instana, …) | Plugin *class* covered; individual community plugins stay upstream |

---

## 3. Applications and use cases

Walk A–H when designing a platform checklist: use / defer / N/A per row.

---

## References

- [Docs home](https://argoproj.github.io/argo-rollouts/)  
- [Rollout specification](https://argoproj.github.io/argo-rollouts/features/specification/)  
- [Plugins](https://argoproj.github.io/argo-rollouts/plugins/)  
