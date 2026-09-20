# 05 — Datasources, Explore, and correlation

[← Previous](./04_Alloy_Topologies_And_LGTM_Pipelines.md) · [README](./README.md) · [Next: Dashboards →](./06_Dashboards_Provisioning_As_Code.md)

## 1. Concepts

Grafana becomes powerful when **Explore** can jump **metrics → traces → logs** with shared identity.

| Datasource | Query language | Typical backend |
|------------|----------------|-----------------|
| Prometheus | PromQL | Prometheus / **Mimir** |
| Loki | LogQL | **Loki** |
| Tempo | TraceQL / search | **Tempo** |
| Pyroscope | profile UI | **Pyroscope** |

### Correlation keys

| Key | Where |
|-----|--------|
| `service` / `service_name` | All signals |
| `env`, `cluster` | All signals |
| `trace_id` | Logs ↔ traces |
| Exemplars | Metric → trace (when enabled) |

Alloy/OTel must **propagate** and backends must **store** these—UI cannot invent joins ([parent 19](../19_Context_Propagation_And_Async.md), [21](../21_Correlation_And_Dig_Methodology.md)).

**Incident habit:** Explore first (narrow time + service), dashboard second.

**Disconfirm:** Mixed datasources on a pretty board without shared labels ≠ correlation. Three Grafana folders with three taxonomies ≠ LGTM benefit.

**Confirm:** From a 5xx spike, can you open a trace, then logs for that `trace_id`, without SSH?

## 2. Advanced

**Derived fields / data links:** Loki derived fields → Tempo; Tempo → Loki queries. Configure once in datasource settings.

**Exemplars:** Prometheus/Mimir histograms with exemplars unlock metric→trace clicks.

**RBAC:** Explore can expose sensitive logs—align with log plane ACLs ([parent 17](../17_Log_Planes_Retention_And_Volume.md)).

## 3. Applications

**Staff checklist**

- Datasources provisioned as code  
- Documented dig: PromQL → Trace → LogQL  
- Label contract enforced at Alloy  

## References

- [Grafana Explore](https://grafana.com/docs/grafana/latest/explore/)  
- [06 Dashboards](./06_Dashboards_Provisioning_As_Code.md)
