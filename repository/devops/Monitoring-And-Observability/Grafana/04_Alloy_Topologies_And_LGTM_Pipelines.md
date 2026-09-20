# 04 — Alloy topologies and LGTM pipelines

[← Previous](./03_Grafana_Alloy_Collector.md) · [README](./README.md) · [Next: Explore →](./05_Datasources_Explore_And_Correlation.md)

## 1. Concepts — where Alloy sits

Alloy does not force one topology. Pick by **who generates telemetry** and **where backends live**.

### Pattern A — Node / DaemonSet edge agent

```text
Every node/pod host
  Alloy: scrape local exporters + tail logs (+ optional OTLP)
       → remote_write / Loki / Tempo endpoints
```

**Fit:** Infrastructure metrics/logs; K8s DaemonSet; VM fleet.  
**Watch:** Cardinality × nodes; disk for positions/WAL-like state when scrape-heavy.

### Pattern B — Centralized collectors

```text
Apps expose /metrics or OTLP
  → fewer Alloy instances discover & scrape / receive
  → backends
```

**Fit:** Application telemetry; fewer collectors to operate.  
**Need:** Network reachability + SD. Deploy docs: main predictor for scrape Alloy size ≈ **active series** (~10 KB/series rule of thumb; plan horizontal scale near ~1M series).

### Pattern C — Edge + gateway / proxy layer

```text
Many edge Alloys  →  proxy/aggregation Alloys  →  Mimir / Loki / Tempo
```

**Fit:** Large fleets; consolidate egress; centralize relabel/filter; shield edges from backend URL churn ([proxy docs](https://grafana.com/docs/alloy/latest/configure/proxy/)).  
**Skip if:** Small estate or backends already have gateways and you want simplest path.

### Signal pipelines (LGTM)

| Signal | Typical Alloy role | Backend |
|--------|--------------------|---------|
| Metrics | Prometheus scrape and/or OTLP metrics; relabel; remote_write | **Mimir** / Prometheus |
| Logs | Tail / K8s logs; process; write | **Loki** |
| Traces | OTLP receive; batch; export (loadbalancing when stateful) | **Tempo** |
| Profiles | Native Pyroscope pipelines where configured | **Pyroscope** |

```text
otelcol.receiver.otlp ──► processors  ──► tempo / otlp exporter
prometheus.scrape     ──► relabel     ──► prometheus.remote_write → Mimir
loki.source.*         ──► process     ──► loki.write
```

(Exact component names evolve—follow current [component reference](https://grafana.com/docs/alloy/latest/); learn the *jobs*.)

**Staff confuse this constantly:** DaemonSet Alloy that also receives all cluster OTLP without design → hot spots and lost spans. Traces needing sticky routing use loadbalancing exporters when processors are stateful.

**Disconfirm:** One topology forever ≠ scale. Proxy layer always ≠ required (avoid if unnecessary).

**Confirm:** Edge vs central vs proxy—which are you on? Which binary owns Prometheus scrape today (Prometheus Operator vs Alloy)?

## 2. Advanced

### Mixing Prometheus Operator and Alloy

Common hybrid:

- **Prometheus Operator** scrapes in-cluster, short retention, Alertmanager pages  
- **Alloy** tails logs + receives OTLP traces + optional remote_write to Mimir for long-term  

Or Alloy takes scrape too (Prometheus Agent–style) and Prometheus server is absent—valid, but you must recreate rule/alert ownership ([Prometheus/08](../Prometheus/08_Alerting_Rules_And_Alertmanager.md)).

### Trace scaling

Stateless receivers scale behind ordinary LBs. Stateful trace features (spanmetrics, servicegraph, some processors) need **consistent routing** (e.g. `otelcol.exporter.loadbalancing` by trace ID)—per Alloy deploy docs.

### Meta-telemetry

Watch refused/failed export metrics (e.g. OTel receiver refused spans, exporter send failures) so the collector plane has its own dig path.

**Failure mode:** Edge→Cloud without backoff/limits → spike cost and dropped telemetry.

## 3. Applications

| Estate | Suggested start |
|--------|-----------------|
| Small K8s | One Alloy chart: scrape apps + logs → Grafana Cloud or single LGTM |
| Large K8s | DaemonSet logs/node + Deployment OTLP gateway + optional scrape StatefulSet |
| Classical VMs | Alloy per host or per tier + central proxy |
| Already on Agent | Migrate topology 1:1 to Alloy components first; optimize later |

**Staff checklist**

- Diagram: edge / gateway / backends  
- Resource limits + series estimates for scrape Alloys  
- Explicit decision: who scrapes (Operator vs Alloy)  
- Egress allowlist to Mimir/Loki/Tempo/Cloud  

## References

- [Deploy Alloy](https://grafana.com/docs/alloy/latest/set-up/deploy/)  
- [Alloy as proxy / aggregation](https://grafana.com/docs/alloy/latest/configure/proxy/)  
- Backends: [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md)  
- [05 Explore](./05_Datasources_Explore_And_Correlation.md)
