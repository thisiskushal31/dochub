# Grafana

[← Back to Monitoring & observability](../README.md) · [Prometheus](../Prometheus/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)

**Grafana** is the **visualization and exploration** UI for metrics, logs, traces, and profiles. In a **modern Grafana stack**, you rarely run “Grafana alone”: you collect with **Grafana Alloy**, store in **Mimir** (or Prometheus), **Loki**, **Tempo**, and optionally **Pyroscope**, then explore in Grafana.

```text
Apps / nodes / exporters
        │
        ▼
 Grafana Alloy  (collect / process / export)   ← successor to Grafana Agent
        │
        ├─ metrics ──► Mimir / Prometheus
        ├─ logs    ──► Loki
        ├─ traces  ──► Tempo
        └─ profiles──► Pyroscope
        │
        ▼
     Grafana  (dashboards, Explore, optional Grafana Alerting)
```

This folder is a **standalone product track**. Parent `0–37` teach jobs (SLI, dig path); [Prometheus/](../Prometheus/README.md) teaches PromQL/TSDB depth. Here: **Grafana UI + Alloy collector + LGTM wiring**.

| | |
|--|--|
| **What for** | One Explore surface across signals; LGTM / Grafana Cloud |
| **When** | You want PromQL + LogQL + TraceQL culture, or Grafana Cloud |
| **Why not** | Single SaaS APM already is the only pane and you refuse a second UI |

**Disconfirm:** Dashboards ≠ SLOs. Grafana ≠ your metrics database. **Grafana Agent is deprecated**—new setups use **Alloy** (Agent LTS ended; EOL expected **2025-11-01** per Grafana Labs).

### Confusions this track kills early

| Confusion | Truth | Chapter |
|-----------|-------|---------|
| Grafana stores Prometheus data | Datasource → remote TSDB (Prom/Mimir) | [01](./01_What_Is_Grafana_And_When.md) |
| Still deploy Grafana Agent | Prefer **Alloy** for new work | [03](./03_Grafana_Alloy_Collector.md) |
| One Alloy config for the world | Components + pipelines; scale topologies | [04](./04_Alloy_Topologies_And_LGTM_Pipelines.md) |
| Alert in Grafana *and* Prometheus forever | Pick **one** page path per symptom | [07](./07_Alerting_OnCall_And_Boundaries.md) |

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Grafana_And_When.md)–[02](./02_LGTM_Stack_And_Modern_Setup.md) | UI job; modern stack shape |
| Collector | [03](./03_Grafana_Alloy_Collector.md)–[04](./04_Alloy_Topologies_And_LGTM_Pipelines.md) | Alloy; DaemonSet vs gateway |
| Use Grafana | [05](./05_Datasources_Explore_And_Correlation.md)–[06](./06_Dashboards_Provisioning_As_Code.md) | Explore; as-code boards |
| Pages & ship | [07](./07_Alerting_OnCall_And_Boundaries.md)–[08](./08_Worked_Example_Alloy_To_Grafana.md) | Alert boundaries; end-to-end |

**Suggested:** `01 → 04 → 08`, then fill `05–07`.

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Grafana and when](./01_What_Is_Grafana_And_When.md) | UI job; Cloud vs OSS |
| 02 | [LGTM stack and modern setup](./02_LGTM_Stack_And_Modern_Setup.md) | Loki, Grafana, Tempo, Mimir (+ Pyroscope) |
| 03 | [Grafana Alloy collector](./03_Grafana_Alloy_Collector.md) | OTel+Prom collector; vs Agent |
| 04 | [Alloy topologies and LGTM pipelines](./04_Alloy_Topologies_And_LGTM_Pipelines.md) | Edge, central, proxy; signal routes |
| 05 | [Datasources, Explore, correlation](./05_Datasources_Explore_And_Correlation.md) | Prom↔Loki↔Tempo joins |
| 06 | [Dashboards and provisioning as code](./06_Dashboards_Provisioning_As_Code.md) | Folders, Git, variables |
| 07 | [Alerting, OnCall, and boundaries](./07_Alerting_OnCall_And_Boundaries.md) | Grafana vs Prometheus AM |
| 08 | [Worked example — Alloy to Grafana](./08_Worked_Example_Alloy_To_Grafana.md) | Minimal modern path |

## References (hub)

- [Grafana docs](https://grafana.com/docs/grafana/latest/)  
- [Grafana Alloy](https://grafana.com/docs/alloy/latest/)  
- [Mimir](https://grafana.com/docs/mimir/latest/) · [Loki](https://grafana.com/docs/loki/latest/) · [Tempo](https://grafana.com/docs/tempo/latest/)  
