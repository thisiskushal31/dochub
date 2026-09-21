# 25 — Named stack shapes — ELK, PLG, LGTM

[← Previous](./24_APM_As_A_Product_Shape.md) · [README](./README.md) · [Next →](./26_OSS_Managed_SaaS_And_Hybrid.md)

## 1. Concepts — recognizable assemblies

Named stacks are **shortcuts for shapes**, not religions. Learn the jobs inside; logos move.

| Shape | Typical pieces | Center of gravity |
|-------|----------------|-------------------|
| **ELK / Elastic** | Elasticsearch, Logstash/Beats/Agent, Kibana (+ APM optional) | Search-centric logs; analytics ([Elastic](./Elastic/README.md), [23 ELK setup](./Elastic/23_ELK_Classic_Setup_And_Monitoring_Placement.md)) |
| **PLG** | Prometheus, Loki, Grafana | Metrics-first; log streams by labels |
| **LGTM** | Loki, Grafana, Tempo, Mimir/Prometheus + **Grafana Alloy** (collector; not Agent) | Grafana-unified metrics/logs/traces |
| **Cloud native suite** | CloudWatch / Cloud Monitoring / Azure Monitor | Provider-integrated ([31](./31_Cloud_Managed_Sinks_And_Audit_Door.md)) |
| **SaaS APM** | Datadog, New Relic, [AppDynamics](./AppDynamics/README.md), … | Bundled UX ([24](./24_APM_As_A_Product_Shape.md)) |

```text
Choose shape by: query culture (PromQL vs search), ops staff, multi-cloud need, budget
```

**Disconfirm:** Memorizing acronyms ≠ choosing. Running ELK without retention discipline ≠ free search. LGTM without label contracts ≠ cheap.

**Confirm:** Which shape is your primary? What job is weakest in that shape on your estate?

## 2. Advanced — mixing and migration

**Modern LGTM collector:** use **Grafana Alloy** (Grafana Agent is deprecated). Depth: [Grafana/02–04](./Grafana/02_LGTM_Stack_And_Modern_Setup.md). Backends: [Loki](./Loki/README.md) · [Tempo](./Tempo/README.md) · [Mimir](./Mimir/README.md).

**Mixes are normal:** Prometheus metrics + Elastic logs; or Grafana frontend on cloud backends.

**Migration:** OTel collector dual-export; freeze new instrumentation on old path; move dashboards by service.

**Grafana as pane of glass:** can sit on many backends—still need dig keys ([21](./21_Correlation_And_Dig_Methodology.md)).

**Failure mode:** Three “sources of truth” for metrics with divergent labels → arguments instead of digs.

## 3. Applications

**Staff checklist**

- One primary shape documented; exceptions listed  
- Correlation story across pieces (shared labels / trace_id)  
- Tool folders opened only after this chapter  

**Exercise:** Draw your actual boxes on a whiteboard and label each as metrics/logs/traces/paging.

## References

- [Grafana LGTM + Alloy](./Grafana/README.md) · [Loki](./Loki/README.md) · [Tempo](./Tempo/README.md) · [Mimir](./Mimir/README.md)  
- [Elastic Observability](https://www.elastic.co/observability) · [Prometheus](https://prometheus.io/docs/introduction/overview/)  
- [26 OSS/SaaS](./26_OSS_Managed_SaaS_And_Hybrid.md) · [27 Tool kinds](./27_Tool_Kinds_By_Job.md)
