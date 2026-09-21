# 13 — Worked example — first service

[← Previous](./12_Operations_Pitfalls_And_Staff_Checklist.md) · [README](./README.md) · [Next →](./14_What_To_Enable_Next_And_When_Not.md)

## 1. Concepts — run one service end-to-end

Goal: **RED**, **traces**, **logs**, one **SLO**, one **page** for a single service (example name: `checkout`). Prefer the official quickstart paths so UI names match docs.

### Lab steps (concrete UI path)

1. **Deploy** — create or open an **Observability** project / Stack deployment ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)). Note Kibana URL. You need a user with **Admin** (or equivalent) for first onboard.  
2. **Add Data** — in Kibana **Observability** UI click **Add Data**. Under **What do you want to monitor?** pick either **Host** / **Kubernetes** (infra) or **Application** → **OpenTelemetry** (app).  
3. **Shipper** — for hosts: follow **Quickstart: Monitor hosts with Elastic Agent** or **… with OpenTelemetry** (install Elastic Agent via Fleet, or EDOT Collector). Confirm Agent **Healthy** in **Fleet → Agents**. For apps: install the **EDOT SDK** for your language (Java, Node.js, Python, .NET, …) and paste the endpoint / APM key values from the OpenTelemetry tab ([04](./04_Agent_Fleet_Beats_And_Logstash.md), [10](./10_OpenTelemetry_To_Elastic.md)).  
4. **APM agent key** — create an **APM agent key** (not a personal superuser key) for EDOT SDKs / APM agents ([20](./20_API_Fleet_Automation_And_RBAC.md)).  
5. **Service identity** — set `service.name=checkout`, `deployment.environment=staging`, `service.version=<gitsha>` on Agent integrations and EDOT/APM resource attributes ([02](./02_Architecture_Stack_And_Data_Plane.md)).  
6. **Logs** — enable system/container logs or app file path; prefer JSON; scrub secrets. Open **Discover** (or Logs) and filter `service.name: "checkout"` ([05](./05_Logs_Ingest_Discover_And_Streams.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md)).  
7. **APM** — generate traffic; open **Applications** (APM) → service `checkout` → **Transactions** / **Traces**. Confirm spans appear ([07](./07_APM_Tracing_And_RUM.md)).  
8. **Infra metrics** — **Infrastructure** / Hosts view for the host or pod running checkout; confirm CPU/mem ([06](./06_Metrics_Infra_And_Hosts.md)).  
9. **Dashboard** — latency, traffic, errors filtered by `service.name: checkout` (saved search or Lens).  
10. **SLO** — **Observability → SLOs → Create SLO** on availability or latency for `checkout` ([09](./09_Alerting_SLOs_And_Incident_Management.md), [parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).  
11. **Alert** — SLO burn-rate or APM failed-transaction rule → **connector** to Slack/PagerDuty (**test channel first**).  
12. **Drill** — break staging on purpose; page → alert → Applications → span → Discover log with same `trace.id` ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Done when

You can cause a failure in staging, get a page, and reach the offending span and log line in under fifteen minutes without guessing field names.

**Disconfirm:** Skipping `service.name` “until later.” Shipping to prod before the dig drill works. Enabling Security / Profiling / Nightshift / AI on day one of the lab ([14](./14_What_To_Enable_Next_And_When_Not.md)).

**Confirm:** Same `service.name` / `deployment.environment` / version on metrics, traces, and logs? Page lands with a human owner? APM key stored in secrets manager?

## 2. Advanced — pitfalls during the lab

| Pitfall | Fix |
|---------|-----|
| Agent enrolled, no data | Check policy integrations, output, time sync, Fleet Server reachability |
| Traces without logs | Confirm log ship + `trace.id` / ECS correlation fields |
| Empty Applications service list | Generate traffic; filter correct environment; wait for indexing |
| 401/403 from EDOT SDK | Wrong APM agent key or endpoint (Managed OTLP vs APM Server) |
| Mapping conflict on first custom field | Use ECS/OTel names; fix template before replaying |
| Flappy alert | Widen threshold; add for-duration; use staging traffic first |
| Disk spike in “lab” | Short retention on staging data stream ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) |
| Discover shows more than APM | CPS / multi-project scope vs origin-only app ([21](./21_Discover_ESQL_And_Kibana_Digs.md)) |

Optional next (only after dig works): one **Synthetics** monitor on the same journey (**Add Data → Synthetic monitor** or [08](./08_Synthetics_And_Uptime.md)); Universal Profiling on the slowest endpoint ([17](./17_Profiling_And_Network_Topology.md)).

**Host quickstart detail.** The **Monitor hosts with Elastic Agent** quickstart runs an auto-detect install script, enrolls via Fleet, and lands you on related dashboards for system logs/metrics. Prefer that when `checkout` runs on a VM you control; then layer **Application → OpenTelemetry** for traces. Privileges for onboard typically need cluster `monitor` + `manage_own_api_key` (or Admin on serverless)—do not share a personal `elastic` password with the app team.

**What “good” looks like in the UI.** Applications shows `checkout` under the staging environment filter; Discover returns JSON logs with `service.name` and `trace.id`; Hosts shows the same host/pod; SLO overview shows a non-zero burn window after you inject errors; the test connector delivered one message you can find in Slack/PagerDuty history.

**Correlation fields to write down.** At minimum: `service.name`, `deployment.environment`, `service.version`, `trace.id` / `transaction.id`, and cloud/k8s resource attributes you will filter on. Put them in the team README before prod cutover ([parent 21](../21_Correlation_And_Dig_Methodology.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md)).

## 3. Applications — variants of the same lab

| Variant | Change |
|---------|--------|
| Kubernetes | Quickstart **unified Kubernetes with EDOT**; Fleet DaemonSet / Helm; pod labels → resource attributes; auto-attach annotations where supported |
| OpenTelemetry-first | OTel SDK → EDOT Collector → Elastic; or **Managed OTLP Endpoint** quickstart on Cloud ([10](./10_OpenTelemetry_To_Elastic.md)) |
| AWS Firehose only | **Quickstart: Collect data with AWS Firehose** ([15](./15_Cloud_Integrations.md)) — still add APM/EDOT for the service dig |
| Host metrics first | **Quickstart: Monitor hosts with Elastic Agent**; then layer Application OpenTelemetry for `checkout` |
| Production cutover | Same steps in prod environment; pages to real on-call; ingest/retention review after 7 days |

**Staff checklist after the lab:** runbook linked on the alert; field taxonomy recorded; who upgrades Agents; APM keys inventoried; when to enable the next product from [14](./14_What_To_Enable_Next_And_When_Not.md).


**Stop conditions.** Abort the lab (do not “just enable more”) if: (1) `service.name` differs across signals, (2) dig drill exceeds 15 minutes twice, (3) staging retention already fills disk, or (4) pages land on an unnamed channel. Fix those before [14](./14_What_To_Enable_Next_And_When_Not.md). After success, time-box a 30-minute teach-back so a second engineer can repeat the dig without the first in the room.

**Central configuration (optional).** On serverless/EDOT paths, Central Configuration can tune SDKs from Kibana after the first traces land—treat sampling changes like production releases ([20](./20_API_Fleet_Automation_And_RBAC.md)).


### Quickstart chooser

| Your starting point | Quickstart |
|---------------------|------------|
| VM / bare host, want Agent | Monitor hosts with Elastic Agent |
| Prefer OTel on hosts | Monitor hosts with OpenTelemetry |
| App traces first | Monitor your application performance (EDOT SDKs) |
| Kubernetes | Unified Kubernetes observability with EDOT |
| Cloud OTLP | Elastic Cloud Managed OTLP Endpoint |
| AWS logs only (then add APM) | Collect data with AWS Firehose |
| Blackbox check later | Create a Synthetic monitor ([08](./08_Synthetics_And_Uptime.md)) |

Do **one** primary path for the lab; document the second path as a follow-up, not a parallel experiment.


**Teach-back script (10 minutes).** Second engineer: find the page in the connector history → open the alert → jump to Applications `checkout` → open the failing transaction → copy `trace.id` → Discover filter → name the bad deploy version. If any hop needs tribal knowledge, the lab is not done.

**Prod cutover gate.** Staging dig drill green, retention ≤7d on staging streams, APM keys in secrets manager, real on-call in the connector, and a 7-day ingest review on the calendar—then promote. Skip Nightshift/Security/Profiling until week two ([14](./14_What_To_Enable_Next_And_When_Not.md)).

Link the finished lab in the team onboarding doc so the next hire does not rebuild tribal knowledge.

## References

- [Observability quickstarts](https://www.elastic.co/docs/solutions/observability/get-started/quickstarts) · [Monitor application performance](https://www.elastic.co/docs/solutions/observability/get-started/quickstart-monitor-your-application-performance) · [Hosts with Agent](https://www.elastic.co/docs/solutions/observability/get-started/quickstart-monitor-hosts-with-elastic-agent)  
- [APM](https://www.elastic.co/docs/solutions/observability/apm) · [Fleet](https://www.elastic.co/docs/reference/fleet) · [Create SLO](https://www.elastic.co/docs/solutions/observability/incident-management/create-an-slo)  
- [14 What to enable next](./14_What_To_Enable_Next_And_When_Not.md)
