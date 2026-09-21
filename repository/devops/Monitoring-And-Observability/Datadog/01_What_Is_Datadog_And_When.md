# 01 — What is Datadog and when

[← README](./README.md) · [Next →](./02_Architecture_Agent_And_Data_Plane.md)

## 1. Concepts — what Datadog is

Datadog is a commercial **observability and security platform**. You send telemetry (usually via the open-source **Datadog Agent**, language SDKs, cloud integrations, or OpenTelemetry). Datadog stores and correlates it. You explore, alert, and page in one SaaS UI.

For reliability work, the spine is:

| Job you already know | Datadog product surface |
|----------------------|-------------------------|
| Host / container health | Agent + Infrastructure |
| App latency, errors, dependencies | APM (tracing) |
| “What did this request log?” | Log Management (tags + `trace_id`) |
| Outside-in probes | Synthetics |
| Real user experience | RUM (+ optional Session Replay) |
| Wake a human | Monitors → Slack / email / [PagerDuty](../PagerDuty/README.md) |
| Track a target | SLOs |
| Threats / posture (later) | Security products ([20](./20_Security_Products.md)) |

Hundreds of **integrations** layer the same UI over AWS, Kubernetes, databases, CI, and more. Products can be bought or enabled separately, but they share tags, Explore, and monitors.

**Plain language:** You rent the glass cockpit. You still own SLIs, tag contracts, and page hygiene ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md), [9](../9_Dashboards_Alerts_And_Pages.md)). Datadog does not invent “good” for your service.

### When it fits / when it does not

| Fit | Usually not |
|-----|-------------|
| One UI across infra + APM + logs quickly | Org mandates PromQL + self-hosted LGTM as the skill path |
| Platform team is thin | Finance will not fund SaaS at your tag/ingest volume |
| Org already standardizes on Datadog | Only hard need is cloud provider audit/compliance logs |

Sibling OSS shape: [Prometheus](../Prometheus/README.md) + [Grafana](../Grafana/README.md). Commercial peer literacy: [New Relic](../New_Relic/README.md).

**Disconfirm:** Buying Datadog ≠ having SLOs. The Datadog UI ≠ CloudTrail / cloud Activity logs ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)). Turning on every product day one ≠ maturity.

**Confirm:** Who pays? Who owns the Agent fleet? Where do pages go? Which **Datadog site** (US1, EU, …) will you use?

## 2. Advanced — site, org shape, product sprawl

**Site selection is a day-zero decision.** API keys and Agent `site` / `DD_SITE` must match the region of `app.datadoghq.com` vs `app.datadoghq.eu` (and other sites). Mismatch shows up as “invalid API key” / silent drop.

**Org topology.** Single-org is simplest. Multi-org isolates prod vs sandbox or business units—but splits digs and duplicates config. Teams + RBAC matter once more than one product group shares billing ([11](./11_Cost_Governance_And_Account_Hygiene.md), [26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Product surface risk.** Security, CI Visibility, LLM Observability, Feature Flags, and Observability Pipelines are real and valuable—and each is a new cost and ownership plane. Enable after the core loop works ([14](./14_What_To_Enable_Next_And_When_Not.md)).

**Exit ramp.** Prefer OpenTelemetry at the instrument layer when lock-in fear is high ([10](./10_OpenTelemetry_To_Datadog.md)); you can still dig in Datadog today.

## 3. Applications — use cases and first moves

| Use case | What “good” looks like |
|----------|------------------------|
| First production service | Agent up → APM + logs → one SLO → one page ([13](./13_Worked_Example_First_Service.md)) |
| Replace three half-wired tools | One dig path metric→trace→log with unified tags |
| Small SRE team | SaaS ops; invest humans in SLIs and tag policy, not TSDB HA |
| Hybrid cloud | Agent on owned compute + cloud integration for managed services ([15](./15_Serverless_And_Cloud_Integrations.md)) |

**Staff checklist**

1. Create account → copy **API key** → note **site**.  
2. Install Agent on one host or a K8s cluster ([03](./03_Install_Host_Container_And_Kubernetes.md)).  
3. Confirm `datadog.agent.running` in Metrics Summary.  
4. Add unified tags; instrument one service ([13](./13_Worked_Example_First_Service.md)).  
5. Write who owns billing, Agents, and pages.

## References

- [Getting started](https://docs.datadoghq.com/getting_started/) · [Datadog sites](https://docs.datadoghq.com/getting_started/site/) · [Product](https://www.datadoghq.com/product/)  
- [02 Architecture](./02_Architecture_Agent_And_Data_Plane.md)
