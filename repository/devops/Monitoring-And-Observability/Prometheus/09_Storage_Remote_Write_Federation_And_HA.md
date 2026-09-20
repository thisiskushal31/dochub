# 09 — Storage, remote write, federation, and HA

[← Previous](./08_Alerting_Rules_And_Alertmanager.md) · [README](./README.md) · [Next: Operator →](./10_Kubernetes_Operator_And_Monitors.md)

## 1. Concepts

### Local TSDB

Prometheus stores recent samples on local disk (WAL + compacted blocks). Retention is configured by **time** and/or **size**. This matches the product goal: a **reliable, autonomous** node for incident diagnosis—not infinite warehouse storage by itself.

| Need | Pattern |
|------|---------|
| Days–weeks local | Retention flags + disk alerts |
| Long-term / global query | **remote_write** to Thanos, Mimir, Cortex, VictoriaMetrics, or **Managed Prometheus** ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |
| Hierarchical rollups | **Federation** (`/federate`) of *selected* series |
| Notification HA | Alertmanager cluster ([08](./08_Alerting_Rules_And_Alertmanager.md)) |
| Scrape HA | ≥2 Prometheus replicas scraping the same targets + AM dedupe |

### Remote write (official tuning facts)

Data path: **WAL → sharded in-memory queues → remote endpoint**.

| Fact | Operational meaning |
|------|---------------------|
| Retry while endpoint down | Samples held and retried |
| Endpoint down **> ~2 hours** | WAL compaction can **drop** data not yet sent—monitor lag |
| Memory | Often **~25%** higher with remote write (shape-dependent); series churn hurts (ID→labels cache) |
| `capacity` | Queue per shard before blocking WAL reads; docs suggest **3–10×** `max_samples_per_send` |
| Backoff | `min_backoff` doubles up to `max_backoff` on failures |
| Spec retries | Compatible senders **MUST** retry **5xx**; **MUST NOT** retry most **4xx** (except may retry **429**) |

Watch `prometheus_remote_storage_samples_pending` (and related) for falling behind.

**Staff confuse this constantly:** “We have remote write, so local Prometheus doesn’t matter.” Wrong—local TSDB is still what you dig during warehouse outages. Remote write is *extra*, not a replacement for autonomy.

### Federation

Prometheus can scrape another Prometheus `/federate` with `match[]` selectors. Use for **aggregated** upward views—not blindly federating all raw high-cardinality series. `honor_labels` matters when preserving source labels.

**Disconfirm:** “HA” = two Prometheuses without AM clustering → double pages. Federate-everything → load + cardinality bomb. Assuming remote write is lossless forever → false after long receiver outages.

**Confirm:** Local retention length? Where do queries older than that go? What happens if remote write is down for three hours?

## 2. Advanced

**`external_labels`:** identify `cluster` / `replica` on remote write and federation.

**Sharding scrapes:** Operator / manual sharding splits targets across Prometheus instances for scale ([10](./10_Kubernetes_Operator_And_Monitors.md)).

**Compaction & RAM:** cardinality drives memory harder than “retain 90 days” alone on small series counts.

**Failure mode:** Remote receiver outage unnoticed → two hours later permanent gap in the “source of truth” warehouse while local Prometheus still looks fine for recent digs.

### Mixing with Grafana Alloy

**Modern LGTM:** [Grafana Alloy](../Grafana/README.md) often remote_writes to Mimir (or scrapes instead of a local Prometheus) and ships logs/traces alongside. Prometheus Operator + Alloy coexistence patterns: [Grafana/04](../Grafana/04_Alloy_Topologies_And_LGTM_Pipelines.md). Prefer Alloy over deprecated Grafana Agent for new collectors.

## 3. Applications and use cases

| Scenario | Pattern |
|----------|---------|
| On-call dig for last 2h | Local TSDB retention ≥ incident window |
| 13 months of capacity charts | remote_write → long-term store / managed Prom |
| Two DCs, one overview | Federate **aggregates** or central remote_write—not raw fan-in of everything |
| Page HA | AM cluster + Prometheus lists all peers ([08](./08_Alerting_Rules_And_Alertmanager.md)) |

**Staff checklist**

- Retention + disk alerts documented  
- Remote-write lag alerts; know the **~2h** drop risk  
- `external_labels` set (`cluster`, `replica`)  
- AM peers listed on every Prometheus; no single LB hop  
- Federation matchers reviewed for cardinality  

## References

- [Storage](https://prometheus.io/docs/prometheus/latest/storage/)  
- [Remote write tuning](https://prometheus.io/docs/practices/remote_write/)  
- [Remote-Write 1.0 spec](https://prometheus.io/docs/specs/prw/remote_write_spec/)  
- [Federation](https://prometheus.io/docs/prometheus/latest/federation/)  
- [10 Operator](./10_Kubernetes_Operator_And_Monitors.md)
