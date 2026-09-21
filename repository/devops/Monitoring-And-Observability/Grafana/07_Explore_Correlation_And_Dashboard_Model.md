# 07 — Explore, correlation, and dashboard model

[← Previous](./06_Topologies_And_Signal_Pipelines.md) · [README](./README.md) · [Next →](./08_Alerting_Boundaries_And_Access_Model.md)

## 1. Concepts — how digs work in Grafana

Grafana digs combine **Explore** (ad-hoc), **dashboards** (curated), and **correlation** (jump between signals). Data still lives in backends—Grafana queries them via datasources ([02](./02_Architecture_UI_Datasources_And_Plugins.md)).

**Plain language:** Explore is the incident scratchpad. Boards are runbooks you pin. Correlation only works if IDs and labels agree across [Prometheus](../Prometheus/README.md)/[Mimir](../Mimir/README.md), [Loki](../Loki/README.md), and [Tempo](../Tempo/README.md) ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

| Surface | Job |
|---------|-----|
| **Explore** | PromQL / LogQL / TraceQL (and other DS languages); split compare |
| **Dashboard** | Panels + time range + variables (`service`, `env`, …) |
| **Correlation / derived fields** | Click from log line → trace; metric → logs |
| **Annotations** | Mark deploys/events on graphs |
| **Folders** | Ownership unit so boards have humans ([02](./02_Architecture_UI_Datasources_And_Plugins.md)) |

### Canonical dig path

1. **Symptom** — page, SLO burn, user report.  
2. **Scope** — time range + `service` / `env` / namespace.  
3. **Metrics** — latency/error/saturation in Explore or board.  
4. **Traces** — exemplars or TraceQL for slow/error spans.  
5. **Logs** — LogQL with same identifiers / `trace_id`.  
6. **Action** — fix + alert hygiene ([08](./08_Alerting_Boundaries_And_Access_Model.md)).

Order can reverse (log-first estates)—**write the order**; don’t invent it under page load.

**Disconfirm:** More panels ≠ better digs. Correlation UI ≠ missing label contract. Screenshot archaeology ≠ Explore skill. “We have Tempo” ≠ traces join metrics.

**Confirm:** Which labels are mandatory? Where do you start (metric vs log vs trace)? Who owns the service folder? Exemplars wired?

## 2. Advanced — variables, cardinality, multi-DS traps

**Variables.** Templating makes one board serve many services—over-wide regex variables create query storms and accidental cross-tenant views. Bound them.

**Cardinality in the UI.** Explore timeouts are often backend cardinality or panel refresh abuse—not “Grafana is slow.” Fix at Alloy/relabel and query design ([04](./04_Grafana_Alloy_Concepts.md), [06](./06_Topologies_And_Signal_Pipelines.md)).

**Exemplar / trace links.** Need exemplar support on the metrics path and a matching Tempo datasource—configure intentionally ([10](./10_Implement_Alloy_Datasources_And_Explore.md)).

**Multi-datasource boards.** Useful; fragile when UIDs drift after migrate. Stable datasource UIDs belong in provisioning later ([14](./14_Provisioning_As_Code_And_GitOps.md)).

**Transformations vs queries.** Heavy client-side transforms hide expensive queries; prefer fixing PromQL/LogQL and collector labels.

**Split-pane Explore.** Compare two datasources or time ranges side by side before pinning a board—boards freeze assumptions; Explore tests them.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Split `service` vs `service_name` | Dead correlation clicks |
| Board-only culture | Frozen queries in novel incidents |
| Explore-only culture | No shared operational truth |
| 10s refresh × 40 panels | Melts Prom/Mimir; confuses “outage” |
| Orphan datasource UID | Board red after Cloud/migrate cutover |

## 3. Applications — practice shapes

| Use case | Pattern |
|----------|---------|
| First dig culture | One Explore playbook: metric → log → trace for one service ([12](./12_Worked_Example_First_Grafana_Dig.md)) |
| Shared board | Folder-owned dashboard with `service` + `env` variables ([11](./11_Dashboards_Variables_And_First_Alert.md)) |
| Mixed stack | Prometheus + Loki + Tempo datasources; document join keys |
| Game day | Ban screenshots; require Explore steps in the timeline |
| Brownfield boards | Prune unowned dashboards before building the next twenty |

**Anti-patterns**

- Importing 50 community dashboards with no folder owners.  
- Correlation clicks without a collector contract.  
- Alerting from panels nobody can re-run in Explore.  
- Treating Grafana as if it stored the Prom series ([01](./01_What_Is_Grafana_And_When.md)).

**Join-key examples (pick one vocabulary and stick):** `service` + `env` + `version`; or OTel `service.name` / `deployment.environment` mirrored into Prom labels and Loki streams.

**Staff checklist**

- Dig path written (metric→trace→log or your order)  
- Join keys agreed and emitted by collectors  
- One golden Explore query per critical service  
- Board variables bounded  
- Folder ownership enforced  
- Alert pages link to Explore/board, not tribal memory ([08](./08_Alerting_Boundaries_And_Access_Model.md))

## References

- [Explore](https://grafana.com/docs/grafana/latest/explore/) · [Dashboards](https://grafana.com/docs/grafana/latest/dashboards/) · [Variables](https://grafana.com/docs/grafana/latest/dashboards/variables/) · [Correlations](https://grafana.com/docs/grafana/latest/administration/correlations/) · [Visualizations](https://grafana.com/docs/grafana/latest/visualizations/)  
- [02 Architecture](./02_Architecture_UI_Datasources_And_Plugins.md) · [11 Boards/alerts](./11_Dashboards_Variables_And_First_Alert.md) · [parent 21](../21_Correlation_And_Dig_Methodology.md)
