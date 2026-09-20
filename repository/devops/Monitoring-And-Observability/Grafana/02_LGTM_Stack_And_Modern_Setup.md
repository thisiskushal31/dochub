# 02 — LGTM stack and modern setup

[← Previous](./01_What_Is_Grafana_And_When.md) · [README](./README.md) · [Next: Alloy →](./03_Grafana_Alloy_Collector.md)

## 1. Concepts — the modern Grafana shape

**LGTM** (common shorthand):

| Letter | Product | Signal | Deep track |
|--------|---------|--------|------------|
| **L** | **Loki** | Logs (label-indexed streams) | [Loki/](../Loki/README.md) |
| **G** | **Grafana** | UI / Explore / dashboards | this folder |
| **T** | **Tempo** | Traces | [Tempo/](../Tempo/README.md) |
| **M** | **Mimir** (or Prometheus) | Metrics (PromQL-compatible at scale) | [Mimir/](../Mimir/README.md) · [Prometheus/](../Prometheus/README.md) |

Often extended with **Pyroscope** (continuous profiles) and collected by **Grafana Alloy**.

This is the **named stack shape** from parent [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)—here we wire the *modern* collector era.

### Layers (official Alloy mental model)

```text
1. Sources     apps, exporters, nodes, OTLP senders
2. Collection  Grafana Alloy (gather / process / export)
3. Storage     Mimir, Loki, Tempo, Pyroscope
4. UI          Grafana
```

**Classic older pattern:** Prometheus scrapes everything; Grafana only queries Prometheus; Agent optional.  
**Modern pattern:** Alloy scrapes / receives OTLP / tails logs → remote-writes or OTLP-exports into Mimir/Loki/Tempo → Grafana datasources point at those backends. Prometheus may still exist as a scrape target source or short-term TSDB.

### Grafana Cloud vs self-managed LGTM

| | Grafana Cloud | Self-managed |
|--|---------------|--------------|
| Collector | Alloy (recommended) | Alloy |
| Backends | Hosted Mimir/Loki/Tempo/… | You run them (or mix) |
| Ops load | Lower undifferentiated | Full plane ownership |
| Exit | OTel/Prom compatibility helps | You already hold the bits |

**Disconfirm:** Installing Grafana OSS alone ≠ LGTM. Mimir ≠ “Prometheus UI.” Alloy ≠ Grafana server.

**Confirm:** Draw your four boxes (collect / metrics / logs / traces / UI). Is Agent still in the diagram? Replace it.

## 2. Advanced

**PLG vs LGTM:** PLG = Prometheus + Loki + Grafana (metrics often plain Prometheus). LGTM upgrades metrics plane toward **Mimir** (HA, long-term, multi-tenant). Many teams run Prometheus at the edge and Mimir centrally.

**Correlation contract:** shared `service`, `env`, `cluster` labels + `trace_id` in logs ([parent 21](../21_Correlation_And_Dig_Methodology.md), [05](./05_Datasources_Explore_And_Correlation.md)).

**Failure mode:** Three teams pick three incompatible label taxonomies → Explore correlation never works.

## 3. Applications

| Goal | Starter |
|------|---------|
| Greenfield K8s | Alloy DaemonSet + central Alloy gateway → Mimir/Loki/Tempo → Grafana |
| Have Prometheus today | Keep Prom; add Alloy for logs/traces; later remote_write to Mimir |
| Grafana Cloud | Alloy → Cloud endpoints; Grafana Cloud UI |

**Staff checklist**

- Named owners for Alloy, each backend, Grafana  
- Label contract written before “turn on everything”  
- Agent→Alloy migration on the backlog if Agent remains  

## References

- [Parent 25 stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md)  
- [Alloy — how it works](https://grafana.com/docs/alloy/latest/introduction/)  
- [03 Alloy](./03_Grafana_Alloy_Collector.md)
