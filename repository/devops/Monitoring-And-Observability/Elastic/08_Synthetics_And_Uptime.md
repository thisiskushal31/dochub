# 08 — Synthetics and uptime

[← Previous](./07_APM_Tracing_And_RUM.md) · [README](./README.md) · [Next →](./09_Alerting_SLOs_And_Incident_Management.md)

## 1. Concepts — outside-in checks

**Synthetic monitoring** periodically probes your services from Elastic’s **managed locations** or your **private locations**, proving availability and critical user journeys **before** (or without) depending on real traffic. Manage monitors in the **Synthetics UI** or as a **Synthetics project** (as-code, Playwright journeys).

| Monitor type | What it proves |
|--------------|----------------|
| **HTTP/S** | Status code, response body asserts, TLS basics |
| **TCP** | Port open / service accepting connections |
| **ICMP** | Host reachable on the network (not app health) |
| **Browser** | Real Chromium journey (login, checkout, …)—Playwright-scriptable |

**Uptime app (legacy):** views Heartbeat-driven lightweight checks configured with traditional `heartbeat.yml`. **Deprecated as of 8.15**; prefer Synthetics. Uptime is **unavailable on Serverless**. The Uptime app may be hidden without recent Heartbeat data—Kibana Advanced Setting `observability:enableLegacyUptimeApp` can force show. Heartbeat/autodiscover or Agent **Uptime Monitors** integration still matter for infra-driven lightweight checks when Synthetics UI autodiscovery is not the path.

**Important:** Synthetics UI does **not** support autodiscovery for infrastructure or Kubernetes monitoring. For dynamic pod/host targets use Heartbeat autodiscover (results → Uptime) or Agent Uptime Monitors—not Synthetics projects alone.

**Plain language:** Synthetics is the canary that clicks like a user. RUM is what real users felt ([07](./07_APM_Tracing_And_RUM.md)). You usually want both for public digital products.

### Where probes run

| Location | Use |
|----------|-----|
| **Elastic managed** | Public endpoints; global vantage points |
| **Private location** | Internal apps, VPC-only URLs, darker networks |

### Projects as code vs UI

| Mode | Prefer when |
|------|-------------|
| **Synthetics UI** | Fast first monitor; lightweight HTTP; small teams |
| **Synthetics project** | Playwright journeys in git; CI promotion; many browser monitors |

Serverless **Logs Essentials** does not include Synthetics—need **Complete** ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).

**Disconfirm:** Green ICMP ≠ healthy checkout. Browser monitor against prod without secrets hygiene ≠ safe. Uptime app empty on Serverless ≠ “Synthetics broken.” Using Synthetics as the only K8s pod liveness strategy ≠ platform engineering.

**Confirm:** Lightweight vs browser for each critical journey? Managed vs private location? Alert destination? Who owns Playwright scripts / project CI? Migration plan off Heartbeat/Uptime?

## 2. Advanced — flakiness, Heartbeat literacy, failure modes

**Flake control.** Strict asserts, stable selectors, and sensible retry/schedule beat noisy pages. Treat Synthetics failures as prod signals—or silence becomes culture.

**Data retention.** Synthetics results and journey screenshots/artifacts have retention settings—align with incident evidence needs ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

**Security.** Params/secrets for auth journeys; MFA/Kerberos support exists for harder apps—do not paste long-lived prod passwords into shared monitors casually. Network security / encryption settings matter for private locations. Grant Synthetics reader/writer/setup roles deliberately ([20](./20_API_Fleet_Automation_And_RBAC.md)).

**Private location ops.** Private locations run Agent-based synthetics workers that must reach both Elastic and the internal target. Scale/architect guidance exists for high monitor counts—undersized private locations look like “app down” when they are actually probe starved.

**Heartbeat literacy (still useful):** lightweight HTTP/TCP/ICMP from your infra; autodiscover for dynamic targets; TLS certificate views and TLS expiry rules historically lived in Uptime. Plan recreation of lightweight monitors in Synthetics when retiring Heartbeat-only ops. Monitor status + TLS certificate rules in Observability alerting replace tribal Heartbeat cron pages ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

**Recorder / scripting.** Synthetics Recorder and Playwright scripts accelerate browser journeys; keep assertions in git via projects for reviewable change.

**Vs Datadog Synthetics.** Same job, different control plane; pick one primary outside-in system for on-call ([Datadog](../Datadog/README.md)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Probe from wrong network | False down (blocked egress) or false up (not testing user path) |
| Cert expiry ignored | Sudden browser/HTTP fails; use TLS rules where appropriate ([09](./09_Alerting_SLOs_And_Incident_Management.md)) |
| Too-aggressive schedule | Cost + origin rate limits |
| Legacy Heartbeat only | Miss browser journeys and richer Synthetics workflow |
| Private location Agent unhealthy | Internal monitors all red while public looks green |
| Essentials tier | Synthetics unavailable |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| Public API / status | Lightweight HTTP from managed locations + monitor status rule |
| Checkout journey | Browser monitor + private location if needed; alert on step fail |
| Internal admin app | Private location; secrets via params |
| Migrate from Uptime | Recreate lightweight monitors in Synthetics; retire Heartbeat-only ops when ready |
| Dynamic K8s targets | Heartbeat autodiscover or Agent Uptime Monitors—not Synthetics UI discovery |
| Cert expiry | TLS certificate rule weeks before `valid_until` |
| Global + internal | Managed location for public status page; private location for admin UI |

**Projects CI sketch:** store Playwright journeys in a Synthetics project; push via `elastic-synthetics` / project tooling in CI; promote staging→prod monitors with the same assert logic. UI-only monitors drift without review.

**Alert linkage.** Create monitor status rules from the Synthetics UI so failed journeys page the same connector as APM/SLO rules—one on-call inbox ([09](./09_Alerting_SLOs_And_Incident_Management.md)).

**Staff checklist:** map top user journeys to browser vs lightweight; private location plan for internal URLs; rules → page destination; script ownership in git (projects); retention reviewed; document Uptime deprecation (`8.15+`) and Serverless Uptime unavailability; do not use Synthetics as the only K8s pod liveness strategy; Complete tier required on Serverless.

## References

- [Synthetic monitoring](https://www.elastic.co/docs/solutions/observability/synthetics) · [Get started](https://www.elastic.co/docs/solutions/observability/synthetics/get-started) · [Create with projects](https://www.elastic.co/docs/solutions/observability/synthetics/create-monitors-with-projects) · [Configure lightweight](https://www.elastic.co/docs/solutions/observability/synthetics/configure-lightweight-monitors) · [Private locations](https://www.elastic.co/docs/solutions/observability/synthetics/monitor-resources-on-private-networks) · [Manage data retention](https://www.elastic.co/docs/solutions/observability/synthetics/manage-data-retention) · [Uptime (deprecated)](https://www.elastic.co/docs/solutions/observability/uptime)  
- [07 APM / RUM](./07_APM_Tracing_And_RUM.md) · [09 Alerting / SLOs](./09_Alerting_SLOs_And_Incident_Management.md)
