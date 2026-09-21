# 03 — LGTM stack and collector generations

[← Previous](./02_Architecture_UI_Datasources_And_Plugins.md) · [README](./README.md) · [Next →](./04_Grafana_Alloy_Concepts.md)

## 1. Concepts — LGTM / PLG and who ships the bits

**LGTM** is the Grafana Labs-shaped stack: **L**oki (logs) + **G**rafana (glass) + **T**empo (traces) + **M**imir or Prometheus (metrics), usually plus **Pyroscope** for profiles. **PLG** is the earlier metrics-first cousin: **P**rometheus + **L**oki + **G**rafana—often without Tempo/Mimir yet. Named-stack literacy: [parent 25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md).

**Plain language:** Grafana is the pane. Loki/Tempo/Mimir (or Prometheus) are the engines. Something must **collect and forward**—today that something should be **Alloy**, not Agent.

```text
Apps · exporters · OTel SDKs · node agents
                 │
                 ▼
        Collector generation
   Alloy (greenfield)  |  Agent Static/Flow/Operator (legacy)
                 │
      ┌──────────┼──────────┬────────────┐
      ▼          ▼          ▼            ▼
   Mimir/Prom   Loki      Tempo     Pyroscope
      └──────────┼──────────┴────────────┘
                 ▼
              Grafana
```

| Layer | Role | Depth elsewhere |
|-------|------|-----------------|
| **Grafana** | Explore, boards, optional alerting | This folder |
| **Mimir / Prometheus** | Metrics store + PromQL | [Mimir](../Mimir/README.md) · [Prometheus](../Prometheus/README.md) |
| **Loki** | Label-cheap log streams + LogQL | [Loki](../Loki/README.md) |
| **Tempo** | Traces + TraceQL | [Tempo](../Tempo/README.md) |
| **Collector** | Scrape / receive / process / export | [04](./04_Grafana_Alloy_Concepts.md)–[06](./06_Topologies_And_Signal_Pipelines.md) |

### Collector generations (overview only)

| Generation | Status | Mental model |
|------------|--------|--------------|
| **Grafana Alloy** | Current; prefer for all new work | OTel Collector distribution + Prometheus pipelines; component config |
| **Grafana Agent — Flow** | Legacy / EOL **2025-11-01** | Component model; Alloy’s direct ancestor |
| **Grafana Agent — Static** | Legacy / EOL | YAML sections (`metrics`, `logs`, `traces`, `integrations`) |
| **Grafana Agent Operator** | Legacy / EOL | K8s CRDs managing Static-mode Agent |

Greenfield: Alloy only. Brownfield: inventory Agent variants, freeze growth, migrate ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)).

**Disconfirm:** “We run Grafana” ≠ LGTM. PLG logos on a slide ≠ Tempo correlation. Agent still scraping ≠ approved architecture after EOL.

**Confirm:** Primary shape PLG or full LGTM? Who owns each backend? Alloy or Agent in each cluster? Shared label / trace-ID contract?

## 2. Advanced — mixes, Cloud, and generation traps

**Cloud vs self-managed LGTM.** Grafana Cloud often hosts the backends and Grafana; you still own collectors at the edge (Alloy agents) and dig culture. Self-managed means you own HA, retention, and upgrades for every box ([09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md)).

**Honest mixes.** Prometheus metrics + Loki logs + Grafana is fine (classic PLG). Adding Tempo later is normal. Mixing Elastic full-text logs with Grafana metrics glass is also common—document the primary dig path so on-call doesn’t thrash ([parent 25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

**Why generations matter.** Config language, Helm charts, and ops runbooks differ. Flow→Alloy is the smallest conceptual jump; Static/Operator need conversion and CRD replacement. Dual-running Agent and Alloy on the same scrapes doubles series and label fights.

**OTel at the edge.** Apps can emit OTLP to Alloy (or OTel Collector). Alloy is itself an OTel Collector distribution with first-class Prometheus/Loki/Pyroscope paths ([OpenTelemetry](../OpenTelemetry/README.md), [04](./04_Grafana_Alloy_Concepts.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| Grafana-only “LGTM” | Empty Explore; no metrics/logs owners |
| Agent + Alloy same targets | Duplicate series; cardinality spikes |
| No correlation contract | Metrics without `service`; traces without log IDs |
| Forever-PLG without decision | Traces “someday”; digs stall at service boundaries |

## 3. Applications — choose shape, freeze collectors

| Use case | Pattern |
|----------|---------|
| Metrics-first startup | PLG: Prom + Loki + Grafana; Alloy scrapes + log ship |
| Full dig culture | LGTM: add Tempo (+ Mimir if Prom HA/long-term needed) |
| Grafana Cloud | Hosted engines + Alloy edge; same Explore habits |
| Inherit Agent fleet | Inventory → freeze → migrate to Alloy ([05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md), [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)) |

**Staff checklist**

- Primary shape named (PLG vs LGTM vs Cloud LGTM)  
- Backend owners listed per signal  
- New collector installs = Alloy only  
- Agent variant inventory started if present  
- Label / `trace_id` contract one-pager drafted  
- Sibling tracks bookmarked for backend depth (not duplicated here)

## References

- [Grafana docs](https://grafana.com/docs/grafana/latest/) · [Alloy introduction](https://grafana.com/docs/alloy/latest/introduction/) · [Agent (legacy)](https://grafana.com/docs/agent/latest/)  
- [Loki](https://grafana.com/docs/loki/latest/) · [Tempo](https://grafana.com/docs/tempo/latest/) · [Mimir](https://grafana.com/docs/mimir/latest/) · [Pyroscope](https://grafana.com/docs/pyroscope/latest/)  
- [04 Alloy concepts](./04_Grafana_Alloy_Concepts.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
