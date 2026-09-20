# 01 — What is Prometheus and when

[← README](./README.md) · [Next →](./02_Data_Model_Types_And_Labels.md)

## 1. Concepts

**Prometheus** is an open-source systems monitoring and alerting toolkit, originally built at **SoundCloud** (2012). It is an independent open-source project; it joined the **CNCF in 2016 as the second hosted project** (after Kubernetes).

It collects **numeric time series**: each sample is a timestamped value, identified by a **metric name** plus optional **labels** (key/value dimensions). You query with **PromQL**. Collection is primarily **pull over HTTP**; short-lived jobs may push via a **Pushgateway**. Visualization is commonly **Grafana** (or other API clients); the server also ships a basic expression browser.

**Plain language:** Prometheus reaches out on a schedule, scrapes `/metrics`, stores what it got, runs rules, and tells Alertmanager what is firing—so you can diagnose outages from a system designed to stay up when other things are broken.

### Official feature set (compressed)

| Feature | Meaning in practice |
|---------|---------------------|
| Multi-dimensional model | Series = name + labels; slice by `job`, `instance`, `code`, … |
| PromQL | Ad-hoc and rule-time query language |
| Autonomous server | No required distributed storage; one process can scrape + store + rule-eval |
| Pull model | Server scrapes targets; targets need not know Prometheus’s address |
| Push via gateway | Optional intermediary for jobs that cannot be scraped |
| Service discovery | Static config or dynamic SD (K8s, cloud, file, …) |

### Ecosystem components (many optional)

| Component | Job |
|-----------|-----|
| **Prometheus server** | Scrape, local TSDB, PromQL, rule eval |
| **Client libraries** | Instrument app code (or use OTel → Prometheus) |
| **Pushgateway** | Short-lived / service-level batch only ([03](./03_Architecture_Scrape_And_Pushgateway.md)) |
| **Exporters** | HAProxy, databases, node OS, … ([05](./05_Exporters_And_Common_Targets.md)) |
| **Alertmanager** | Dedupe, group, inhibit, silence, notify ([08](./08_Alerting_Rules_And_Alertmanager.md)) |

Most core components are **Go** static binaries—simple to deploy compared to JVM-heavy stacks.

### When it fits (official + operational)

- Purely **numeric** time series (machine-centric *and* dynamic SOA/microservices).  
- You need a **reliable** diagnostics system during outages: a standalone Prometheus does not depend on network storage or a remote DB to answer “what is broken *now*.”  
- You want **PromQL culture**, open exporters, and K8s-native scrape patterns.

### When it does **not** fit (official)

Prometheus values reliability over perfect completeness. **If you need 100% accuracy—e.g. per-request billing—Prometheus is not a good choice**; samples can be incomplete under failure. Use a billing-grade system for money; use Prometheus for operational monitoring.

Also prefer something else when:

| Situation | Better direction |
|-----------|------------------|
| Traces + logs + APM in one SaaS tomorrow, zero metrics ops | [Datadog](../Datadog/README.md) / similar |
| Tiny estate happy with cloud console metrics only | [Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md) |
| You only need logs/search | [Elastic](../Elastic/README.md) / [Loki](../Loki/README.md)—not Prometheus |

**Disconfirm:** “We installed Prometheus” ≠ monitoring program ([parent 1](../1_Paired_Practice_Monitoring_And_Observability.md)). Prometheus ≠ log store ≠ trace store. Scraping everything without a label budget ≠ maturity ([02](./02_Data_Model_Types_And_Labels.md)).

**Confirm:** Can you state pull vs Pushgateway in one sentence? Name one workload Prometheus is *explicitly* a bad fit for (billing-class completeness).

## 2. Advanced

**Reliability design intent:** during an incident you still want local PromQL on recent data even if remote write, object storage, or the SaaS APM is sick. That is why “autonomous node” is a product principle—not a relic.

**Long-term / global query** is a *separate* job: remote write into Thanos/Mimir/Cortex/Managed Prometheus, or federation of *selected* series ([09](./09_Storage_Remote_Write_Federation_And_HA.md)). Do not confuse “Prometheus the scraper” with “infinite cheap history.”

**OTel coexistence:** instrument with OpenTelemetry or Prometheus clients; still land metrics in a Prom-compatible store if you want PromQL ([OpenTelemetry](../OpenTelemetry/README.md)). OTel does not replace Alertmanager or PromQL by itself.

**Failure mode:** Treating Prometheus as a perfect event ledger → wrong architecture and wrong trust in gaps.

## 3. Applications

**Staff checklist**

- Written decision: Prometheus vs SaaS-only vs cloud-native-only for *this* estate  
- Named owner for the Prometheus + Alertmanager plane  
- Explicit “not for billing” (or similar) so product does not misuse metrics as a ledger  
- Parent-track SLOs exist before inventing dozens of alert rules  

## References

- [Prometheus overview](https://prometheus.io/docs/introduction/overview/) (features, when it fits / does not fit)  
- [02 Data model](./02_Data_Model_Types_And_Labels.md) · [Parent 0](../0_How_To_Read.md)
