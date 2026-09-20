# 10 — Kubernetes Operator and monitors

[← Previous](./09_Storage_Remote_Write_Federation_And_HA.md) · [README](./README.md) · [Next →](./11_Operations_Pitfalls_And_Staff_Checklist.md)

## 1. Concepts

**Prometheus Operator** is a Kubernetes Operator that deploys and manages Prometheus and related components using **CRDs**. Goals (upstream): reduce config effort, automate target discovery via **label selectors** (instead of hand-written scrape jobs), validate rules/AM config, and support scaling patterns (sharding, Thanos sidecar, ThanosRuler).

### CRDs (current Operator set)

| CRD | Role |
|-----|------|
| **Prometheus** | Desired Prometheus instance(s): version, replicas, retention, selectivity of monitors |
| **PrometheusAgent** | Agent-mode deployment patterns (scrape/write focused) |
| **Alertmanager** | AM instances |
| **AlertmanagerConfig** | AM routing/inhibit/receivers as CRDs (namespaced config) |
| **ThanosRuler** | Rule evaluation component in Thanos-style setups |
| **ServiceMonitor** | Discover/scrape **Endpoints** of selected Services |
| **PodMonitor** | Scrape selected Pods directly |
| **Probe** | Blackbox-style probes via Operator |
| **PrometheusRule** | Recording + alerting rules |
| **ScrapeConfig** | Additional scrape jobs as CRDs (static/file/other SD without classic ServiceMonitor) |

```text
ServiceMonitor / PodMonitor / Probe / ScrapeConfig
        │  label selectors
        ▼
Prometheus Operator reconciles
        │
        ▼
prometheus.yml-equivalent + rule files mounted in Prometheus pods
```

**App team contract (typical platform):**

1. Label your workload/Service consistently.  
2. Ship a **ServiceMonitor** (or rely on a platform-wide convention).  
3. Ship **PrometheusRule** for your SLOs—or inherit platform defaults.  
4. Opt-in: Operator `serviceMonitorNamespaceSelector` / `serviceMonitorSelector` must match or nothing is scraped.

**Disconfirm:** “Operator installed” ≠ every namespace scraped. A ServiceMonitor in a namespace the Prometheus CR does not select ≠ loaded. PrometheusRule with wrong labels ≠ evaluated. Greedy selectors scraping all pods ≠ safe.

**Confirm:** How does a new service opt in? Which label selector must match? Where do rules live in GitOps?

## 2. Advanced

**Cross-namespace monitors:** explicitly enabled patterns; RBAC must allow the Operator/Prometheus to read Services/Endpoints/Pods.

**Thanos sidecar / remoteWrite** fields on the Prometheus CR connect to long-term storage ([09](./09_Storage_Remote_Write_Federation_And_HA.md)).

**Shards:** Operator can distribute targets across Prometheus shards for scale—query layer (Thanos/Mimir) becomes more important.

**kube-prometheus / Helm:** common bundles (node exporter, kube-state-metrics, dashboards)—still verify selectors and retention for *your* estate.

**Failure mode:** Two Prometheus CRs both select the same ServiceMonitors with overlapping external labels → duplicate series confusion downstream.

Parent signal jobs on K8s: [33](../33_Kubernetes_Workload_Observability_Patterns.md).

## 3. Applications

**Staff checklist**

- Documented opt-in (selectors + example ServiceMonitor + PrometheusRule)  
- Platform Prometheus CR selectors reviewed after each Operator upgrade  
- kube-state-metrics + node metrics present for cluster USE/object health  
- AlertmanagerConfig ownership clear (platform vs app)  

## References

- [Prometheus Operator introduction](https://prometheus-operator.dev/docs/getting-started/introduction/)  
- [Operator design / API](https://prometheus-operator.dev/docs/api-reference/api/)  
- [kube-prometheus](https://github.com/prometheus-operator/kube-prometheus)  
- [11 Operations](./11_Operations_Pitfalls_And_Staff_Checklist.md)
