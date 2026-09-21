# 06 — Topologies and signal pipelines

[← Previous](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md) · [README](./README.md) · [Next →](./07_Explore_Correlation_And_Dashboard_Model.md)

## 1. Concepts — where the collector sits

Collector **topology** is *where* Alloy (or legacy Agent) runs relative to apps and backends. **Signal pipelines** are *how* metrics, logs, traces, and profiles flow through components to [Mimir](../Mimir/README.md)/[Prometheus](../Prometheus/README.md), [Loki](../Loki/README.md), [Tempo](../Tempo/README.md).

**Plain language:** Edge agents hug the workloads; gateways sit in the middle and fan in. Pick a spine before you copy Helm values ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)).

| Topology | Pattern | Fit |
|----------|---------|-----|
| **Edge / DaemonSet** | One collector per node (or per pod sidecar) | Node metrics, local logs, low fan-in |
| **Gateway / deployment** | Central Alloy receives OTLP/remote-write | Many apps push; fewer egress points |
| **Hybrid** | Edge scrape/tail → gateway filter/forward | Scale + policy at the center |
| **Per-service sidecar** | Collector next to one app | Strong isolation; higher ops cost |

```text
[Pods/Hosts] ──push/scrape──► Alloy edge ──► (optional gateway) ──► Mimir/Loki/Tempo
                                      │
                                      └──► Grafana queries backends (not Alloy)
```

### Signal route literacy

| Signal | Typical collect | Typical export |
|--------|-----------------|----------------|
| Metrics | Prometheus scrape / OTLP metrics | remote_write → Mimir/Prom / Cloud |
| Logs | file / journal / K8s logs | `loki.write` → Loki |
| Traces | OTLP | Tempo exporter |
| Profiles | eBPF / language | Pyroscope (optional) |

Grafana is **not** on this write path—it queries backends later ([02](./02_Architecture_UI_Datasources_And_Plugins.md)).

**Disconfirm:** One topology for every cluster ≠ design. Gateway without backpressure plan ≠ “simpler.” Sidecar-everywhere ≠ free isolation. Mixing Agent edge + Alloy gateway on the same scrapes ≠ clever HA.

**Confirm:** Push or scrape primary? Egress constraints? Who owns edge vs gateway configs? Per-signal routes named?

## 2. Advanced — fan-in, HA scrape, multi-signal coupling

**Double scrape / double push.** Two edges or edge+gateway both scraping the same targets → cardinality explosion. Clustering and explicit target ownership matter ([04](./04_Grafana_Alloy_Concepts.md)).

**Gateway as policy point.** Sampling, relabel, PII drop, and tenant headers belong where you can enforce once—not only in every app.

**Logs vs metrics placement.** Node-local log tails often stay edge; OTLP traces often prefer gateway for batching. Don’t force one shape for all signals.

**HA and clustering.** Multi-replica Alloy needs a story for who scrapes what; “run three replicas” without clustering is often three copies of every series.

**Cloud vs self-managed backends.** Topology is independent of whether Mimir/Loki/Tempo are Grafana Cloud or self-hosted—egress auth and endpoints change, jobs don’t.

**Failure modes**

| Failure | Symptom |
|---------|---------|
| Edge OOM | Noisy neighbor pods; unbounded log volume |
| Gateway bottleneck | Tail latency; dropped spans |
| Split pipelines | Metrics labels ≠ log labels ≠ trace resource attrs |
| Agent leftover + Alloy | Dual paths ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)) |
| Silent buffer fill | “Healthy” collector; backends starve under burst |

**Correlation coupling.** Topology choices that rewrite labels differently per signal break Explore jumps ([07](./07_Explore_Correlation_And_Dashboard_Model.md), [parent 21](../21_Correlation_And_Dig_Methodology.md)).

## 3. Applications — choose before you implement

| Estate | Starting topology |
|--------|-------------------|
| Small K8s / few services | Single Alloy DaemonSet or Cloud-guided agent install ([10](./10_Implement_Alloy_Datasources_And_Explore.md)) |
| Many namespaces, shared egress | Edge collect + gateway forward |
| Strict network policy | Gateway in an allowed subnet; apps OTLP to gateway only |
| Brownfield Agent DaemonSet | Mirror topology in Alloy; cut over by node pool ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)) |
| Multi-cluster | Per-cluster edge; optional regional gateway; tenant/cluster labels mandatory |

**Anti-patterns**

- Gateway for everything because “central is easier” with no capacity model.  
- Sidecars for every microservice before one DaemonSet dig works.  
- Different `service` label keys on metrics vs logs “for historical reasons.”

**Staff checklist**

- Draw edge vs gateway once for prod  
- Per-signal route named (metrics/logs/traces)  
- Dual-collect forbidden  
- Label/resource attribute contract matches dig model ([07](./07_Explore_Correlation_And_Dashboard_Model.md))  
- Clustering decision recorded if HA scrape  
- Scale/migrate details deferred to [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)

## References

- [Alloy configure](https://grafana.com/docs/alloy/latest/configure/) · [Clustering](https://grafana.com/docs/alloy/latest/configure/clustering/) · [Collect](https://grafana.com/docs/alloy/latest/collect/) · [Estimate resource usage](https://grafana.com/docs/alloy/latest/set-up/estimate-resource-usage/) · [OTLP to LGTM](https://grafana.com/docs/alloy/latest/collect/opentelemetry-to-lgtm-stack/)  
- [04 Alloy](./04_Grafana_Alloy_Concepts.md) · [07 Dig model](./07_Explore_Correlation_And_Dashboard_Model.md) · [13 Scale](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)
