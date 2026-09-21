# 04 — Grafana Alloy concepts

[← Previous](./03_LGTM_Stack_And_Collector_Generations.md) · [README](./README.md) · [Next →](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)

## 1. Concepts — programmable collector

**Grafana Alloy** is Grafana Labs’ open-source **telemetry collector**: an **OpenTelemetry Collector distribution** with **built-in Prometheus pipelines** and native paths for Loki, Pyroscope, and related backends. It collects, processes, and exports **metrics, logs, traces, and profiles** in one binary.

**Plain language:** Building blocks you wire into pipelines—from hosts/apps to Mimir/Loki/Tempo. Not the glass; not the database ([03](./03_LGTM_Stack_And_Collector_Generations.md)).

| Idea | Meaning |
|------|---------|
| **Component** | One running block (`prometheus.scrape`, `loki.write`, `otelcol.receiver.otlp`, …) |
| **Label** | Your instance name: `prometheus.scrape "api" { … }` |
| **Arguments / exports** | Inputs you set; outputs other components reference |
| **Pipeline** | Components wired so one export feeds another argument |
| **Config** | Usually `config.alloy` (River-like / Terraform-inspired syntax) |
| **Module** | Reusable snippet of components parameterized for fleets |

### Syntax literacy

```alloy
prometheus.scrape "app" {
  targets    = [{"__address__" = "localhost:8080"}]
  forward_to = [prometheus.remote_write.mimir.receiver]
}

prometheus.remote_write "mimir" {
  endpoint {
    url = "https://mimir.example/api/v1/push"
  }
}
```

Pattern: `COMPONENT_NAME "label" { … }`. Expressions reference other components’ exports ([Components](https://grafana.com/docs/alloy/latest/get-started/components/)).

### Vs OTel Collector and Agent

| Collector | When |
|-----------|------|
| **Alloy** | Prefer for new Grafana/LGTM work; OTel + Prom-native comfort |
| **Upstream OTel Collector** | Org standard is pure otelcol; Alloy optional ([OpenTelemetry](../OpenTelemetry/README.md)) |
| **Grafana Agent** | Legacy only—EOL; migrate ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)) |

**Disconfirm:** Alloy ≠ Grafana storage. One mega-config for the world ≠ operable. Running Agent and Alloy on the same targets ≠ migration. “We installed Alloy” ≠ labels and dig keys exist.

**Confirm:** Signals in scope? Destinations ([Prometheus](../Prometheus/README.md)/[Mimir](../Mimir/README.md)/[Loki](../Loki/README.md)/[Tempo](../Tempo/README.md))? Who owns the config repo? GA-only components in prod?

## 2. Advanced — controller, stability, dual pipelines

**Component controller.** Alloy runs a controller that schedules components and exposes health—use the debug / UI surfaces before guessing scrape failures ([How Alloy works](https://grafana.com/docs/alloy/latest/introduction/how-alloy-works/)).

**OTel + Prom coexistence.** `otelcol.*` and `prometheus.*` can live in one process. Don’t dual-receive the same app on competing receivers without a written primary path.

**Stability levels.** Components are GA / public preview / experimental—pin Alloy version; keep experimental out of prod SLOs.

**Clustering / fleets.** Multi-replica scrapes need clustering literacy so targets aren’t double-scraped; remote config and fleet management are ops scale concerns ([06](./06_Topologies_And_Signal_Pipelines.md), [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)).

**Inheritance from Agent Flow.** Flow users recognize the component model; Static/Operator users need conversion literacy ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)).

**Cardinality and relabel.** Drop/hash high-cardinality labels at the collector—backends feel the pain later ([Prometheus](../Prometheus/README.md)). Relabel is a product decision, not a syntax trick.

**Failure modes that look like “Alloy is broken”**

| Failure | What you see |
|---------|----------------|
| Wrong `forward_to` wiring | Healthy components; empty backends |
| Secrets in git / wrong auth | 401/403 remote_write; silent drop |
| Unbounded debug logging | Collector CPU/disk melt; digs drown |
| Experimental component in prod | Upgrade breaks overnight |

## 3. Applications — concept checklist before install

| Use case | Concept you need |
|----------|------------------|
| First metrics path | scrape → remote_write mental model |
| Logs to Loki | source → process → `loki.write` |
| Traces | OTLP receiver → export to Tempo |
| Profiles | Pyroscope components (optional, later) |
| Replace Agent | Convert/review—not blind cutover ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)) |
| Org standard is otelcol | ADR: Alloy vs upstream; don’t run both on one process |

**Anti-patterns**

- Copy-pasting a 2k-line config before a one-signal canary.  
- Treating Alloy as a second Grafana.  
- Enabling every component “because Cloud docs showed it.”

**Staff checklist**

- Alloy chosen for greenfield  
- Component map drawn (receive → process → export)  
- Stability allowlist (GA-only unless lab)  
- Secrets strategy named (not plaintext in git)  
- Topology choice deferred to [06](./06_Topologies_And_Signal_Pipelines.md)  
- First wire deferred to [10](./10_Implement_Alloy_Datasources_And_Explore.md)

## References

- [Alloy docs](https://grafana.com/docs/alloy/latest/) · [Introduction](https://grafana.com/docs/alloy/latest/introduction/) · [Why Alloy](https://grafana.com/docs/alloy/latest/introduction/why-alloy/) · [How Alloy works](https://grafana.com/docs/alloy/latest/introduction/how-alloy-works/) · [Components](https://grafana.com/docs/alloy/latest/get-started/components/) · [Reference](https://grafana.com/docs/alloy/latest/reference/)  
- [05 Agent](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md) · [06 Topologies](./06_Topologies_And_Signal_Pipelines.md) · [OpenTelemetry](../OpenTelemetry/README.md)
