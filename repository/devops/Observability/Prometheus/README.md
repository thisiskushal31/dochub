# Prometheus

[← Back to Observability](../README.md) · [Metrics concepts](../1_Monitoring_And_Metrics.md) · [Grafana](../Grafana/README.md) · [Tools index](../3_Observability_Tools.md)

## 1. Concepts

**Prometheus** is an open-source **metrics** system: it **scrapes** HTTP endpoints, stores time series locally (or remote-writes), evaluates rules, and fires alerts via **Alertmanager**.

**Plain language:** The pull-based scoreboard for your services—PromQL asks questions; Alertmanager decides who gets bothered.

| Piece | Job |
|-------|-----|
| **Prometheus server** | Scrape, store, query, rule eval |
| **Exporters** | Expose metrics for things that don’t natively speak Prometheus (node, blackbox, …) |
| **Service discovery** | Find scrape targets (K8s, file SD, cloud) |
| **Alertmanager** | Dedupe, group, route, silence |
| **PromQL** | Query language |

**What for:** Metrics-backed SLOs, golden signals, recording rules, open ecosystem.  
**When:** You want PromQL culture, K8s-native scraping, OSS stack with Grafana.  
**Why not:** You need turnkey APM UI tomorrow with zero metrics ops → SaaS; you only need cloud console metrics for a tiny estate → [Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md).

**Disconfirm:** Prometheus is **not** a long-term log store. It is **not** a substitute for traces. “We scrape everything” without a label budget is **not** maturity.

**Confirm:** Counter vs gauge for request count? Where do alerts go after Alertmanager?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Pull vs push** | Classic scrape; Pushgateway for short batch jobs only—not for apps |
| **Cardinality** | Bound labels; avoid user/request IDs ([1](../1_Monitoring_And_Metrics.md)) |
| **Recording rules** | Precompute expensive SLI expressions |
| **HA / federation / remote write** | Scale-out and long-term storage patterns—ops cost rises |
| **Managed Prometheus** | Same PromQL, less undifferentiated heavy lifting → Cloud/30 |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Target down / bad SD | Gaps, stale alerts |
| Rule loop overload | Slow UI, missed evals |
| Alert storms | Fatigue; fix grouping/inhibits |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First service | `/metrics` + scrape config + Grafana datasource |
| K8s | Pod/Service annotations or Operator; kube-state-metrics + node exporter |
| Pages | Alertmanager → [PagerDuty](../PagerDuty/README.md) |

**Staff checklist:** scrape intervals sane; retention explicit; Alertmanager routes owned; recording rules for SLO burn.

## References

- [Prometheus docs](https://prometheus.io/docs/)  
- [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)  
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)  
- [Grafana](../Grafana/README.md)  
