# 08 — Analysis and metric providers

[← Previous](./07_Traffic_Management.md) · [README](./README.md) · [Next: Experiments & extras →](./09_Experiments_HPA_Metadata_Restart_Rollback.md)

---

## 1. Concepts

Analysis answers: **is this canary/blue-green good enough to continue?**

| CRD | Role |
|-----|------|
| **AnalysisTemplate** | How to query, how often, success/fail counts, args |
| **ClusterAnalysisTemplate** | Shared cluster-wide templates |
| **AnalysisRun** | Instantiation bound to a Rollout attempt |

Attach as **background** analysis on canary, **inline** analysis steps, or blue-green **pre-/post-promotion** analysis.

Providers (in-tree; new ones via **plugins**):

| Provider | Use |
|----------|-----|
| Prometheus | Most common HTTP/error/latency queries |
| Datadog | Datadog queries |
| New Relic | NRQL-style checks |
| Wavefront | Wavefront queries |
| Graphite / InfluxDB / CloudWatch / SkyWalking | Metrics backends |
| Kayenta | Statistical canary judgment |
| Job | Run a Kubernetes Job as the check |
| Web | HTTP webhook success/fail |

Metrics are optional — manual promote still works — but **automated** progressive delivery needs KPIs that answer in minutes ([13](./13_Best_Practices_And_When_Not_To_Use.md)).

---

## 2. Advanced concepts

| Idea | Detail |
|------|--------|
| Success/fail conditions | Count consecutive failures; inconclusive handling |
| Args / parameterization | Pass service name, canary hash into queries |
| startingStep / delay | Delay background analysis until weight high enough |
| Dry-run mode | Validate analysis without failing the Rollout — stage templates safely |
| Measurements retention / TTL | How long AnalysisRun history is kept |
| Secrets in analysis | Reference secrets for provider credentials carefully |
| Canary vs stable | Prefer comparative queries, not only global SLO noise |
| Plugins | Mandatory path for brand-new metric systems |

Failed analysis → abort. Do not use flaky global SLOs as the only gate.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| HTTP success rate | Prometheus template on canary Service |
| Business KPI | Datadog/NR + careful thresholds |
| Custom smoke | Analysis Job or Web hook |
| No metrics yet | Manual pause/promote while building Prom |

**Good:** A/A-test analysis in staging. **Bad:** analysis that always passes; analysis that pages on noise.

---

## References

- [Analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)  
- [Prometheus](https://argoproj.github.io/argo-rollouts/analysis/prometheus/) · [Job](https://argoproj.github.io/argo-rollouts/analysis/job/) · [Web](https://argoproj.github.io/argo-rollouts/analysis/web/)  
- [Analysis plugins](https://argoproj.github.io/argo-rollouts/analysis/plugins/)  
