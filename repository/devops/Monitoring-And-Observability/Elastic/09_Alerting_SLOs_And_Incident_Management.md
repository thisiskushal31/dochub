# 09 — Alerting, SLOs, and incident management

[← Previous](./08_Synthetics_And_Uptime.md) · [README](./README.md) · [Next →](./10_OpenTelemetry_To_Elastic.md)

## 1. Concepts — wake humans on purpose

Elastic Observability **rules** detect conditions across logs, metrics, APM, infrastructure, Synthetics, and more, then fire **actions** through **connectors** (email, Slack, PagerDuty, webhooks, Jira, …). **SLOs** encode reliability targets and **error budgets**; **burn-rate rules** page when budget consumption is too fast. **Cases** track investigation detail beside alerts.

| Building block | Role |
|----------------|------|
| **Rule types** | Detectors for specific signal shapes (table below) |
| **Connectors / actions** | Where the page or message goes |
| **SLO / SLI** | Target on an indicator over a window |
| **Error budget / burn rate** | How fast you may fail; multi-window burn alerts (1h / 6h / 24h / 72h style) |
| **Composite SLO** | Weighted rollup of member SLOs (**preview**: Serverless + Stack **9.5+**) |
| **Cases** | Collaborative incident record ([pointer](https://www.elastic.co/docs/solutions/observability/incident-management/observability-cases)) |
| **Alerts triage privileges** | Separate “ack/snooze” from “edit rules” |

**Plain language:** Rules are detectors; SLOs are promises; burn-rate alerts protect the promise. Dashboards without pages do not wake anyone ([parent 9](../9_Dashboards_Alerts_And_Pages.md), [8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

### Rule types inventory (Observability)

| Domain | Rule type | Detects when… |
|--------|-----------|---------------|
| Logs | Log threshold | Log/Observability data exceeds a value |
| Metrics | Metric threshold / Inventory | Metric or inventory threshold breached |
| Observability | Custom threshold | Cross-signal threshold |
| APM | Latency / Failed transaction rate / Error count | Service latency, fail rate, or error count exceeds threshold |
| APM / AIOps | APM anomaly / Anomaly detection | Abnormal latency, throughput, or fail rate |
| SLO | SLO burn rate | Burn rate above defined thresholds |
| Synthetics / Uptime | Monitor status / TLS certificate / Uptime duration anomaly | Probe down, cert expiry, duration anomalies |
| Stack | Elasticsearch query | Matches found in latest query run |
| Data quality | Degraded docs / Failed docs | Degraded or failed document % exceeds threshold |

Create rules from **Manage Rules** or pre-filled from Services / Traces / Dependencies / SLOs / Synthetics UIs. Serverless needs Editor+ for rule management; Stack needs feature privileges per app (APM, Logs, Infra, Synthetics, ML for anomaly rules).

### SLI → SLO in Elastic

Define SLOs from APM availability/latency or custom KQL (and related sources). Monitor overview → burn rates → budget burndown → linked burn-rate rules. **Composite SLOs** (≤25 members, relative weights) roll up platform health—enable `slo.compositeSloEnabled` on self-managed Kibana when needed.

**License / roles:** stateful SLOs need appropriate license plus Elasticsearch `transform` and `ingest` node roles and configured SLO access. Serverless SLOs require **Complete** (not Logs Essentials).

**Disconfirm:** Creating ten threshold rules ≠ an SLO program. SLO without a page destination ≠ reliability management. Anomaly rule on noisy metrics ≠ automatic root cause. Essentials project ≠ SLOs available.

**Confirm:** Who may create rules? Which connector is paging? Which SLOs are customer-facing vs internal? Runbook linked from the alert? Composite preview acceptable on your version?

## 2. Advanced — noise, aggregation, failure modes

**Alert hygiene.** Prefer SLO burn + a few golden signals over page-on-every-spike. Use inventory/anomaly rules where static thresholds lie. Rate aggregation and suppress/grouping options reduce storms—tune before muting culture ([parent 9](../9_Dashboards_Alerts_And_Pages.md)). Triage threshold and burn-rate breaches with linked runbooks—not only screenshots.

**Rule lifecycle knobs.** From the rule action menu: disable/delete/clone, snooze notifications, run now (without waiting for schedule), update API keys. Rules share one **Rules** page across Observability, Discover, and Stack Monitoring (Stack **9.4+** / Serverless GA).

**RBAC.** Editors creating rules vs responders triaging alerts—assign Observability Alerts privileges (`All` / `Read`) so every on-call engineer is not a rule admin. SLO Editor custom role matters on Serverless for create/manage.

**Machine learning / AIOps.** Rate/pattern analysis and anomaly detection help investigation; they are not a substitute for owned SLIs. Availability depends on tier/license.

**Cases.** Use Observability Cases for investigation notes beside alerts, or standardize on an external incident tool—pick one primary for handoffs.

**Burn-rate windows literacy.** SLO detail views show burn across short/medium windows (commonly 1h / 6h / 24h / 72h). Multi-window burn-rate rules catch both fast meltdown and slow budget bleed—pair a high burn on a short window with a moderate burn on a longer window (Google SRE-style) rather than a single threshold.

**Composite weights.** Member SLO weights are relative (weight 2 counts twice weight 1); filter instances when an SLO is group-by multi-instance. Cap is 25 members—use for platform rollups, not every microservice.

**Vs PagerDuty.** Elastic fires; PagerDuty (or similar) owns escalation policy ([PagerDuty](../PagerDuty/README.md) if in your handbook).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Connector misconfigured | “Fired” in UI, silence in Slack/PD |
| Flapping thresholds | Alert fatigue; ignored pages |
| SLO on bad SLI | Green budget, angry customers |
| Transform/ingest roles missing | SLO UI errors on self-managed |
| Storm without aggregation | Channel flood; people mute |
| Essentials / wrong license | Missing SLO or ML rule types |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| First page | One APM failed-transaction or Synthetics monitor-status rule → PagerDuty/Slack |
| Service reliability | APM-based SLO + multi-window burn-rate rule |
| Platform rollup | Composite SLO (preview) over tier-1 member SLOs |
| Log spike | Log threshold on error signature with suppress/noise controls |
| Infra capacity | Inventory rule on disk/CPU with host context |
| Data quality | Degraded-docs rule after a parse-heavy deploy ([05](./05_Logs_Ingest_Discover_And_Streams.md)) |
| TLS expiry | TLS certificate rule for public endpoints ([08](./08_Synthetics_And_Uptime.md)) |

**Staff checklist:** connector tested end-to-end; severity/routing doc; SLO list with owners; burn-rate pages for tier-1 services; Cases or external incident tool chosen; practice mute/ack/snooze path; Essentials projects: know SLO requires Complete; document composite preview status if used; confirm `transform`+`ingest` roles on self-managed before promising SLOs.

## References

- [Create and manage rules](https://www.elastic.co/docs/solutions/observability/incident-management/create-manage-rules) · [Alerting](https://www.elastic.co/docs/solutions/observability/incident-management/alerting) · [SLOs](https://www.elastic.co/docs/solutions/observability/incident-management/service-level-objectives-slos) · [Create an SLO](https://www.elastic.co/docs/solutions/observability/incident-management/create-an-slo) · [SLO burn rate rule](https://www.elastic.co/docs/solutions/observability/incident-management/create-an-slo-burn-rate-rule) · [Composite SLO](https://www.elastic.co/docs/solutions/observability/incident-management/create-a-composite-slo) · [Cases](https://www.elastic.co/docs/solutions/observability/incident-management/observability-cases) · [Aggregation options](https://www.elastic.co/docs/solutions/observability/incident-management/aggregation-options)  
- [08 Synthetics](./08_Synthetics_And_Uptime.md) · [10 OTel](./10_OpenTelemetry_To_Elastic.md) · [parent 8 SLOs](../8_SLI_SLO_SLA_And_Error_Budgets.md)
