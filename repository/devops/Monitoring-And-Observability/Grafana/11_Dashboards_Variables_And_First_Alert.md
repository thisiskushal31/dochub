# 11 — Dashboards, variables, and first alert

[← Previous](./10_Implement_Alloy_Datasources_And_Explore.md) · [README](./README.md) · [Next →](./12_Worked_Example_First_Grafana_Dig.md)

## 1. Concepts — one board, one page path

After Explore works ([10](./10_Implement_Alloy_Datasources_And_Explore.md)), save a **scripted dig** (dashboard) and wire **one** pager pipeline. Boards support digs and pages—they are not the SLO ([8](../8_SLI_SLO_SLA_And_Error_Budgets.md), [9](../9_Dashboards_Alerts_And_Pages.md)). Alerting boundaries: [08](./08_Alerting_Boundaries_And_Access_Model.md).

| Piece | Job |
|-------|-----|
| **Folder** | Ownership boundary for the service board |
| **Dashboard + variables** | `$service` / `$env` so one board serves many instances |
| **Panels** | RED/USE (or your golden signals)—few panels that answer the dig |
| **Alert path** | Grafana Alerting **or** Prometheus/Alertmanager—**one** per symptom |
| **Contact point** | Staging Slack first; later IRM / [PagerDuty](../PagerDuty/README.md) |

**Disconfirm:** Forty panels before Explore works. Dual Grafana + Prometheus pages on the same error ratio. Prod PagerDuty before a staging test.

**Confirm:** Overview board filters by `$service`/`$env`? Exactly one system pages? Runbook URL on the alert?

## 2. Advanced — board and alert hygiene

**Query quality before viz polish.** Slow boards are bad PromQL/LogQL, missing recording rules, or unbounded variable combos ([Prometheus/07](../Prometheus/07_Recording_Rules_And_SLIs.md)).

**Variables.** Prefer query variables for label values; chain `env` → `service`. Cap multi-select—every combination multiplies load.

**Grafana-managed vs Prom rules.** Prefer Prometheus/Mimir ruler + Alertmanager when the estate is Prom-shaped and pages must survive Grafana UI outages ([Prometheus/08](../Prometheus/08_Alerting_Rules_And_Alertmanager.md)). Prefer Grafana Alerting for multi-datasource rules or one Alerting UI. Record the choice next to the dig path ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

**Labels on alerts.** `severity=page|ticket`, `service`, `team`—notification policies match these. Annotations carry summary + runbook URL ([10](../10_Alert_Hygiene_And_Burn_Rates.md)).

## 3. Applications — build and page

### A. First service dashboard

1. **Dashboards → New → New dashboard** in folder `checkout` (create folder if needed).  
2. Add variables: `env` (custom or label_values), `service` (label_values filtered by `$env`).  
3. Panel 1 — time series: request rate / error ratio filtered by `$service`, `$env` (PromQL against Mimir/Prom).  
4. Panel 2 — latency p99 or histogram quantile for the same labels.  
5. Panel 3 — logs panel: `{service="$service", env="$env"}` ([Loki](../Loki/README.md)).  
6. Optional: Tempo node graph or trace link via exemplars ([Tempo](../Tempo/README.md)).  
7. Set shared time range; save with a stable UID; note UID for provisioning later ([14](./14_Provisioning_As_Code_And_GitOps.md)).  
8. Add a dashboard link → Explore with the same queries for “unknown” digs ([07](./07_Explore_Correlation_And_Dashboard_Model.md)).

Keep the first board under ~8 panels. Polish viz only after the dig drill in [12](./12_Worked_Example_First_Grafana_Dig.md) works.

### B. First alert (Grafana Alerting path)

1. **Alerting → Alert rules → New alert rule.**  
2. Query the same PromQL as the error-ratio panel; set threshold + pending period (start ≥1–5m).  
3. Labels: `severity=page`, `service=checkout`, `team=…`.  
4. Annotations: short summary + runbook URL.  
5. **Contact points** → staging Slack (or email)—**not** prod PD yet.  
6. **Notification policies** → match `severity=page` → staging contact point; default → ticket Slack.  
7. Fire in staging (inject errors or temporarily lower threshold); confirm **one** notification.  
8. Promote contact point to Grafana IRM or [PagerDuty](../PagerDuty/README.md) only after staging works ([15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)).

### C. Prometheus page path (alternative)

1. Write the rule next to other Prom/Mimir rules.  
2. Route in Alertmanager to staging Slack → later PD.  
3. Grafana stays Explore + board—do **not** also create a Grafana-managed copy of the same symptom.

| Pitfall | Fix |
|---------|-----|
| Flappy pages | Widen threshold; lengthen pending; fix scrape gaps first |
| High-cardinality `sum by` | Fewer labels; recording rules |
| Chat and PD both paging | Chat = ticket; PD/IRM = page |
| Board only in General folder | Move to owned folder; set permissions |


**Ownership.** Put the board in a team folder before sharing the URL. General-folder boards become orphaned theatre. Link the board and the alert from the service runbook so digs start from a known surface ([9](../9_Dashboards_Alerts_And_Pages.md), [21](../21_Correlation_And_Dig_Methodology.md)).

**Refresh and load.** Start at 30s–1m refresh. Aggressive refresh × many LogQL panels melts [Loki](../Loki/README.md)/[Mimir](../Mimir/README.md)—fix queries before adding more panels.

**As-code next.** Click-ops is fine for the first board; graduate UIDs and the paging rule to Git in [14](./14_Provisioning_As_Code_And_GitOps.md) once the dig drill in [12](./12_Worked_Example_First_Grafana_Dig.md) works.

**Staff checklist**

- Folder + overview board with `$service`/`$env`  
- One page path per symptom documented  
- Staging contact point tested once  
- Runbook URL on paging alerts  
- No duplicate Grafana + Prom pages  
- Variables bounded (no `.*` across all prod services)  
- Board linked from the service runbook  

## References

- [Dashboards](https://grafana.com/docs/grafana/latest/dashboards/) · [Variables](https://grafana.com/docs/grafana/latest/dashboards/variables/) · [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/) · [Contact points](https://grafana.com/docs/grafana/latest/alerting/configure-notifications/manage-contact-points/)  
- [08 Boundaries](./08_Alerting_Boundaries_And_Access_Model.md) · [9 Dashboards/alerts/pages](../9_Dashboards_Alerts_And_Pages.md) · [10 Alert hygiene](../10_Alert_Hygiene_And_Burn_Rates.md) · [PagerDuty](../PagerDuty/README.md)
