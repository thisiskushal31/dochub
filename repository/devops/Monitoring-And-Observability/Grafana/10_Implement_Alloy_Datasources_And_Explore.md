# 10 — Implement Alloy, datasources, and Explore

[← Previous](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md) · [README](./README.md) · [Next →](./11_Dashboards_Variables_And_First_Alert.md)

## 1. Concepts — first wire that digs

Goal: **Alloy** ships metrics + logs (optional traces) → backends → **Grafana datasources** with stable UIDs → **Explore** proves the dig. Concepts for Alloy/Explore live in [04](./04_Grafana_Alloy_Concepts.md)–[07](./07_Explore_Correlation_And_Dashboard_Model.md); this chapter is the concrete first path.

```text
App /metrics + logs (+ optional OTLP)
        → Grafana Alloy
        → Mimir/Prometheus + Loki (+ Tempo)
        → Grafana datasources → Explore
```

**Label contract (write before scrape):** `service`, `env`, `cluster` (or equivalent) identical on metrics and logs; add `trace_id` in logs when traces exist ([21](../21_Correlation_And_Dig_Methodology.md)).

**Disconfirm:** Grafana UI with no collector ≠ stack. Datasource UIDs renamed in the UI ≠ durable digs. Skipping Explore before boards ≠ “done.”

**Confirm:** Alloy owns collection? Datasource UIDs pinned? Shared labels visible in Explore for one service?

## 2. Advanced — wiring pitfalls

| Pitfall | Fix |
|---------|-----|
| Green “Test” but empty Explore | Wrong tenant header / URL path; run a real PromQL/LogQL |
| Metrics labels ≠ log labels | Fix Alloy relabel / process before more panels ([06](./06_Topologies_And_Signal_Pipelines.md)) |
| Tempo link opens empty | Derived field / traces-to-logs template wrong; trace never stored |
| Dual scrape Agent + Alloy | One scrape owner ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)) |
| Secrets in datasource JSON | Env/secret store; provision with `$ENV` ([14](./14_Provisioning_As_Code_And_GitOps.md)) |
| Huge first config.alloy | One metrics + one logs pipeline; grow later ([04](./04_Grafana_Alloy_Concepts.md)) |

**Correlation literacy (minimal).** Prometheus/Mimir exemplars → Tempo; Loki derived field on `trace_id` → Tempo; Tempo traces-to-logs template with `${__span.traceId}` ([07](./07_Explore_Correlation_And_Dashboard_Model.md), [Tempo](../Tempo/README.md), [Loki](../Loki/README.md)).

## 3. Applications — step path

### A. Deploy Alloy (greenfield)

1. Install Alloy (VM/systemd, Docker, or K8s Helm/Operator)—**not** Grafana Agent ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)).  
2. Start with official get-started / collect tutorials; open Alloy UI for component health.  
3. Metrics: `prometheus.scrape` (app + node) → relabel label contract → `prometheus.remote_write` to Mimir/Prom or Cloud ([Prometheus](../Prometheus/README.md) · [Mimir](../Mimir/README.md)).  
4. Logs: `loki.source.*` / K8s logs → process → `loki.write` ([Loki](../Loki/README.md)).  
5. Optional week-one traces: `otelcol.receiver.otlp` → export to Tempo ([Tempo](../Tempo/README.md)).  
6. Confirm Alloy export / WAL metrics healthy before touching Grafana.

**Minimal Alloy shape (literacy)**

```alloy
prometheus.scrape "app" {
  targets    = [{"__address__" = "localhost:8080"}]
  forward_to = [prometheus.remote_write.default.receiver]
}

prometheus.remote_write "default" {
  endpoint { url = env("REMOTE_WRITE_URL") }
}
```

### B. Add datasources in Grafana

1. **Connections → Data sources → Add** (or provision YAML—preferred for UIDs).  
2. Add **Prometheus** (or Mimir URL), **Loki**, optional **Tempo**—fixed `uid` values (`prom`, `loki`, `tempo`).  
3. Auth: Cloud API key / basic / headers (`X-Scope-OrgID` if multi-tenant).  
4. On Prometheus DS: enable **exemplars** if Tempo exists.  
5. On Loki DS: derived field → Tempo internal link on `trace_id`.  
6. On Tempo DS: traces-to-logs → Loki; traces-to-metrics → Prometheus.  
7. **Save & test**, then run real Explore queries—not only the green check.

### C. First Explore dig

1. Explore → Prometheus: `up{service="checkout"}` or error-ratio PromQL for one service.  
2. Split → Loki: `{service="checkout", env="staging"}` over the same window.  
3. If Tempo wired: open a linked trace → jump to logs by `trace_id`.  
4. Write the three queries + label names in the team README.  
5. Only then move to a dashboard ([11](./11_Dashboards_Variables_And_First_Alert.md)).

**Cloud shortcut.** Use Grafana Cloud stack endpoints from [09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md); Alloy config from Cloud “send data” instructions; same Explore proof.

**Staff checklist**

- Alloy (not Agent) collecting for this path  
- Metrics + logs in Explore with shared labels  
- Datasource UIDs stable and documented  
- Correlation links tested once (or explicitly deferred)  
- Secrets not in Git; next step is board + one alert ([11](./11_Dashboards_Variables_And_First_Alert.md))  

## References

- [Alloy get started](https://grafana.com/docs/alloy/latest/get-started/) · [Collect OTel](https://grafana.com/docs/alloy/latest/collect/opentelemetry-data/) · [Datasources](https://grafana.com/docs/grafana/latest/datasources/) · [Explore](https://grafana.com/docs/grafana/latest/explore/)  
- [04 Alloy concepts](./04_Grafana_Alloy_Concepts.md) · [07 Dig model](./07_Explore_Correlation_And_Dashboard_Model.md) · [21 Correlation](../21_Correlation_And_Dig_Methodology.md) · [25 LGTM](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
