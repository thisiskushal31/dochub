# Prometheus

[← Back to Monitoring & observability](../README.md) · [Concepts: metric types](../6_Metric_Types_And_Aggregation.md) · [Cardinality](../7_Cardinality_And_Label_Contracts.md) · [Grafana](../Grafana/README.md) · [OpenTelemetry](../OpenTelemetry/README.md)

**Prometheus** scrapes HTTP metrics endpoints, stores labeled time series, evaluates **recording** and **alerting** rules, and sends firing alerts to **Alertmanager**. **PromQL** asks questions; Grafana (or the built-in UI) shows answers.

This is a **standalone product track** (Argo CD–style), checked against official Prometheus / Alertmanager / Operator docs. Parent chapters `0–37` teach *jobs* (SLI, RED, pages); this folder teaches *how Prometheus implements them*.

```text
Targets (/metrics) ──scrape──► Prometheus ──PromQL / rules──► Grafana
                                    │
                                    └─ alerting rules ──► Alertmanager ──► PagerDuty / chat / email
```

| | |
|--|--|
| **What for** | Metrics-backed SLOs, golden signals, K8s scrape culture, open exporters |
| **When** | You want PromQL + ownership of the metrics plane |
| **Why not** | Turnkey multi-signal APM with zero metrics ops → SaaS; tiny estate fine on cloud-native metrics only → [Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md); **billing-class 100% accuracy** → not Prometheus |

**Disconfirm:** Prometheus ≠ logs ≠ traces. “Scrape everything” without a label budget ≠ maturity.

### Confusions this track kills early

| Confusion | Truth | Chapter |
|-----------|-------|---------|
| One “metric” | Often **hundreds of series** (labels × instances) | [02](./02_Data_Model_Types_And_Labels.md) |
| Push all the apps | Pushgateway is **narrow**; prefer pull | [03](./03_Architecture_Scrape_And_Pushgateway.md) |
| Alerting = Prometheus email | Rules detect; **Alertmanager** notifies | [08](./08_Alerting_Rules_And_Alertmanager.md) |
| Average the error ratios | **Sum rates, then divide** | [07](./07_Recording_Rules_And_SLIs.md) |
| HA = LB in front of Alertmanager | List **all** AM peers—do not LB | [08](./08_Alerting_Rules_And_Alertmanager.md) |
| “Install exporters” = done | Apps / native / exporters are different paths | [05](./05_Exporters_And_Common_Targets.md) |

### Chapter structure

Each chapter: **Concepts → Advanced → Applications / use cases → References**.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Prometheus_And_When.md)–[02](./02_Data_Model_Types_And_Labels.md) | Fit/non-fit; series identity |
| How it runs | [03](./03_Architecture_Scrape_And_Pushgateway.md)–[05](./05_Exporters_And_Common_Targets.md) (+ [13](./13_Writing_Exporters_And_Native_Metrics.md)) | Pull, config/SD, **exporter ecosystem** |
| Query & SLIs | [06](./06_PromQL_Essentials.md)–[07](./07_Recording_Rules_And_SLIs.md) | PromQL; recordings |
| Pages | [08](./08_Alerting_Rules_And_Alertmanager.md) | Rules → humans |
| Scale | [09](./09_Storage_Remote_Write_Federation_And_HA.md)–[10](./10_Kubernetes_Operator_And_Monitors.md) | Retention/RW; Operator |
| Judgment | [11](./11_Operations_Pitfalls_And_Staff_Checklist.md)–[12](./12_Worked_Example_First_Service.md) | Day-2; first end-to-end |
| Exporter craft | [13](./13_Writing_Exporters_And_Native_Metrics.md) | Native metrics; writing exporters |

**Suggested:** `01 → 12`, with **05 + 13** when you wire dependencies/OS. Learn-by-building: finish **02–04** and **06**, then jump to **12**, return for **07–11**; use **05/13** whenever you choose exporters.

### Fit in the M&O staircase

| Need | Start |
|------|--------|
| Detect vs explain, SLOs, pages | Parent [0](../0_How_To_Read.md)–[10](../10_Alert_Hygiene_And_Burn_Rates.md) |
| Cardinality / types (concept) | [6](../6_Metric_Types_And_Aggregation.md), [7](../7_Cardinality_And_Label_Contracts.md) |
| This product | **01–13** below |
| UI across signals | [Grafana](../Grafana/README.md) (**Alloy** + LGTM: chapters 01–08) |
| Instrumentation layer | [OpenTelemetry](../OpenTelemetry/README.md) |

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Prometheus and when](./01_What_Is_Prometheus_And_When.md) | History, fit/non-fit, ecosystem |
| 02 | [Data model, types, and labels](./02_Data_Model_Types_And_Labels.md) | Series math; naming; cardinality |
| 03 | [Architecture, scrape, Pushgateway](./03_Architecture_Scrape_And_Pushgateway.md) | Pull path; when push is OK |
| 04 | [Configuration, SD, and relabeling](./04_Configuration_Service_Discovery_And_Relabeling.md) | `prometheus.yml`; keep/drop |
| 05 | [Exporter ecosystem and common targets](./05_Exporters_And_Common_Targets.md) | Catalog map; node/blackbox/DB/JMX/bridges |
| 06 | [PromQL essentials](./06_PromQL_Essentials.md) | rate, ratios, quantiles |
| 07 | [Recording rules and SLIs](./07_Recording_Rules_And_SLIs.md) | `level:metric:operations` |
| 08 | [Alerting rules and Alertmanager](./08_Alerting_Rules_And_Alertmanager.md) | `for:`; HA; routing |
| 09 | [Storage, remote write, federation, HA](./09_Storage_Remote_Write_Federation_And_HA.md) | Retention; ~2h drop risk |
| 10 | [Kubernetes Operator and monitors](./10_Kubernetes_Operator_And_Monitors.md) | ServiceMonitor, PrometheusRule |
| 11 | [Operations, pitfalls, staff checklist](./11_Operations_Pitfalls_And_Staff_Checklist.md) | Day-2 failure modes |
| 12 | [Worked example — first service](./12_Worked_Example_First_Service.md) | Instrument → page path |
| 13 | [Writing exporters and native metrics](./13_Writing_Exporters_And_Native_Metrics.md) | Author rules; textfile; native scrape |

## References (hub)

- [Prometheus docs](https://prometheus.io/docs/)  
- [Data model](https://prometheus.io/docs/concepts/data_model/)  
- [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)  
- [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)  
- [Prometheus Operator](https://prometheus-operator.dev/docs/getting-started/introduction/)  
- [Exporters catalog](https://prometheus.io/docs/instrumenting/exporters/)  
- [Grafana + Alloy modern stack](../Grafana/README.md)  
