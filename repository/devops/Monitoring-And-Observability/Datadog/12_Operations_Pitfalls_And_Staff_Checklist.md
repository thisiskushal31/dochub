# 12 — Operations, pitfalls, and staff checklist

[← Previous](./11_Cost_Governance_And_Account_Hygiene.md) · [README](./README.md) · [Next →](./13_Worked_Example_First_Service.md)

## 1. Concepts — failure modes you will hit

| Failure | What you see | What to do |
|---------|--------------|------------|
| Wrong `site` | API key invalid / no data | Align Agent `site` / `DD_SITE` with app URL region |
| Stale Agents | Missing features, hard support | Fleet Automation / monthly upgrades (Agent 7 line) |
| Tag explosion | Custom metrics bill spike | Allowlist; remove high-card tags ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)) |
| Dual instrumentation | Double traces/metrics | One path: Datadog SDK/SSI **or** OTel ([10](./10_OpenTelemetry_To_Datadog.md)) |
| Monitor spam | On-call ignores pages | Symptom-first; owners; mutes ([08](./08_Monitors_SLOs_And_Dashboards.md)) |
| Logs without scrubbing | PII incident | Scrub at Agent / pipeline / SDS ([05](./05_Logs_Pipelines_And_Indexes.md), [20](./20_Security_Products.md)) |
| No unified tags | Cannot dig across products | Enforce `env`/`service`/`version` ([02](./02_Architecture_Agent_And_Data_Plane.md)) |
| Every product on day 1 | Cost + noise | Phase enables ([14](./14_What_To_Enable_Next_And_When_Not.md)) |
| Datadog as only audit | Compliance gap | Keep cloud audit trails ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)) |

**Disconfirm:** More dashboards ⇒ more reliability. Support tickets without `datadog-agent status` / flare.

**Confirm:** Who is on the hook for Agent upgrades, Usage review, and paging hygiene?

## 2. Advanced — support, DR, multi-org

Use Agent **flares** and status output when opening support tickets. Document expected RPO with the vendor if multi-site DR matters—most teams are single-site.

Multi-org splits reduce blast radius but duplicate monitors and break cross-org digs—decide deliberately ([26](./26_API_Terraform_CLI_And_Account_Admin.md)). Remote configuration / Fleet Automation helps fleets; still change-control majors.

Watchdog and Bits AI can accelerate triage—they do not replace owned monitors and runbooks ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md), [19](./19_Incident_Workflows_And_Collaboration.md)).

## 3. Applications — staff checklist and drills

**Staff checklist**

- [ ] API keys in a secrets manager; rotation owner named  
- [ ] Agent version policy (and Cluster Agent matched on K8s)  
- [ ] Tag taxonomy + weekly custom-metrics review  
- [ ] Log scrubbing + index retention  
- [ ] Monitor ownership + page route  
- [ ] SLO list matches real user journeys  
- [ ] SDK vs OTel decision written down  
- [ ] Cloud audit / IAM logs still enabled  

**Drills:** break staging on purpose ([13](./13_Worked_Example_First_Service.md)); practice flare collection; quarterly delete unused monitors/dashboards.

## References

- [Agent troubleshooting](https://docs.datadoghq.com/agent/troubleshooting/) · [Account management](https://docs.datadoghq.com/account_management/) · [Fleet Automation](https://docs.datadoghq.com/agent/fleet_automation/)  
- [13 Worked example](./13_Worked_Example_First_Service.md)
