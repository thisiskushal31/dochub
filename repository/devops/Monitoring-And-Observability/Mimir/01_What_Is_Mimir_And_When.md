# 01 — What is Mimir and when

[← README](./README.md) · [Next →](./02_Architecture_And_Write_Path.md)

## 1. Concepts

**Mimir** is a **push-based** metrics platform: scrapers (**Prometheus**, **Alloy**) remote-write into Mimir; Mimir stores per-tenant TSDB-style data (often culminating in object storage) and serves **PromQL**.

| Approach | Idea |
|----------|------|
| **Local Prometheus** | Autonomous scrape+TSDB; limited retention/HA story alone ([Prometheus/09](../Prometheus/09_Storage_Remote_Write_Federation_And_HA.md)) |
| **Thanos-style** | Extend existing Proms (sidecar/store) for global query |
| **Mimir** | Central multi-tenant backend you write *into* |

**When Mimir fits:** many writers, long retention, tenant isolation, LGTM with Grafana.  
**When to pause:** single small Prometheus is enough; no appetite for microservices/object-store ops (use Grafana Cloud metrics instead).

**Disconfirm:** Running Mimir without cardinality discipline ≠ scale magic.

**Confirm:** Who remote_writes today? Who owns tenant IDs?

## 2. Advanced

Monolithic mode for labs; microservices for prod. Ingest-storage vs classic architectures exist in recent versions—read current deploy docs for your major.

## 3. Applications

**Staff checklist:** Prometheus-vs-Mimir-vs-Thanos decision written; Grafana datasource points at Mimir query path.

## References

- [About Mimir architecture](https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/)  
- [02 Write path](./02_Architecture_And_Write_Path.md)
