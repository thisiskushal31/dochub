# 08 — Worked example — Alloy to Grafana

[← Previous](./07_Alerting_OnCall_And_Boundaries.md) · [README](./README.md)

## 1. Concepts — minimal modern path

Ship a thin vertical slice of the **new** setup (not Grafana Agent):

```text
App /metrics + logs (+ optional OTLP traces)
        → Grafana Alloy
        → Mimir (or Prometheus) + Loki (+ Tempo)
        → Grafana datasources + Explore
```

### Steps

1. **Pick backends**  
   - Grafana Cloud endpoints, **or**  
   - Self-managed Mimir/Loki/Tempo (or Prometheus+Loki+Tempo for a smaller start).

2. **Deploy Alloy**  
   - K8s: chart/operator per current [deploy docs](https://grafana.com/docs/alloy/latest/set-up/deploy/).  
   - VM: package/systemd.  
   - **Do not** install new Grafana Agent.

3. **Metrics pipeline**  
   - Component graph: discover/scrape app and node exporters → relabel (label contract) → `remote_write` to Mimir/Prom.  
   - Verify series in Grafana Explore (Prometheus datasource).

4. **Logs pipeline**  
   - Tail pod/journal logs → process → Loki write.  
   - Confirm LogQL by `service` / `env`.

5. **Traces (optional in first week)**  
   - App OTLP → Alloy OTLP receiver → Tempo.  
   - Confirm TraceQL; enable Loki↔Tempo links ([05](./05_Datasources_Explore_And_Correlation.md)).

6. **Grafana UI**  
   - Provision datasources (Mimir, Loki, Tempo).  
   - One overview dashboard from **recorded**/simple PromQL ([06](./06_Dashboards_Provisioning_As_Code.md)).  
   - Dig path drill: metric spike → trace → logs.

7. **Pages**  
   - Choose **one** alert path ([07](./07_Alerting_OnCall_And_Boundaries.md)); test staging.

### Prove it

| Inject | Expect |
|--------|--------|
| Stop app | `up` or scrape gap; logs show restarts |
| Force 5xx | Explore error ratio; optional trace |
| Break Alloy egress | Collector meta-metrics show export failures—not silent success |

**Disconfirm:** Grafana UI with no Alloy/backends ≠ modern stack. Agent + Alloy dual full collect forever ≠ migration.

**Confirm:** Can you name the Alloy components on the metrics path and the Grafana datasource UID they feed?

## 2. Advanced — grow deliberately

| Next | Chapter / door |
|------|----------------|
| Scale scrape | [04](./04_Alloy_Topologies_And_LGTM_Pipelines.md) central vs edge |
| Prom rules depth | [Prometheus/](../Prometheus/README.md) |
| Exporters | [Prometheus/05](../Prometheus/05_Exporters_And_Common_Targets.md) |
| OTel instrumentation | [OpenTelemetry/](../OpenTelemetry/README.md) |

## 3. Applications — definition of done

**Staff checklist**

- Alloy (not Agent) in the diagram  
- Metrics + logs visible in Grafana Explore  
- Label contract held end-to-end  
- One overview board provisioned  
- One tested page path  
- Migration note if Agent still exists elsewhere  

**Good:** boring Alloy config in Git, quiet dig path.  
**Bad:** Cloud trial UI with no collector ownership.

## References

- [Alloy get started](https://grafana.com/docs/alloy/latest/)  
- [Alloy tutorials / scenarios](https://grafana.com/docs/alloy/latest/tutorials/)  
- [02 LGTM](./02_LGTM_Stack_And_Modern_Setup.md) · [03 Alloy](./03_Grafana_Alloy_Collector.md) · [04 Topologies](./04_Alloy_Topologies_And_LGTM_Pipelines.md)
