# 18 — Security SIEM literacy (for observability engineers)

[← Previous](./17_Profiling_And_Network_Topology.md) · [README](./README.md) · [Next →](./19_Observability_AI.md)

## 1. Concepts — adjacent product, different job

**Elastic Security** is its own solution: **SIEM detections**, **Elastic Defend (endpoint)**, **cloud security**, timelines, cases, and response actions. It often shares Elasticsearch/Kibana (or sits in a Security serverless project) with Observability, but it is **not** application SLO monitoring.

| Plane | Question | Owner |
|-------|----------|-------|
| **Observability** | Is the user journey healthy? (RED, SLOs, digs) | SRE / service team |
| **Security** | Is there threat, malware, misconfig, or policy violation? | SecOps / SOC |

### Security solution map (literacy)

| Area | What it is | Obs engineer should know |
|------|------------|--------------------------|
| **Detect and alert (SIEM)** | Prebuilt/custom rules (query, threshold, EQL, indicator match, ML, ES\|QL, …) → alerts, timelines, cases | Noise tuning is SecOps work—not “mute like flappy latency” |
| **Elastic Defend** | Endpoint sensors, isolation, response actions, exception types | High blast radius; Fleet policy under security change control |
| **Cloud security** | CSPM / cloud posture and related cloud threat integrations | Complements—not replaces—cloud-native audit retention |
| **Investigate** | Timeline, Session View, Osquery, visual event analyzer | Different dig glass than APM Applications |
| **Endpoint response** | Isolate host, automated response actions | Platform eng may help Agent rollout only |

Observability engineers need **literacy** so they do not: (1) wire Security alerts into the app on-call by default, (2) treat detection rules as SLIs, (3) assume “we have Elastic” means Defend is deployed.

**Shared substrate.** Same Agent/Fleet can ship both observability integrations and security integrations. Index naming, **spaces**, and RBAC should keep **security indices and response actions** least-privilege ([20](./20_API_Fleet_Automation_And_RBAC.md)). Docs cover Spaces for Elastic Security and Defend FAQ—use separate spaces when multi-team.

**Disconfirm:** Security alert volume ⇒ reliability. CloudTrail in Observability Discover ⇒ SOC coverage. Enabling prebuilt rules org-wide day one without tuning ([14](./14_What_To_Enable_Next_And_When_Not.md)). CSPM green ⇒ runtime safe.

**Confirm:** Separate Security on-call? Cases vs Observability incidents distinguished? App SLOs still defined in Observability ([09](./09_Alerting_SLOs_And_Incident_Management.md))? Cloud audit still retained outside Elastic where required ([31](../31_Cloud_Managed_Sinks_And_Audit_Door.md))?

## 2. Advanced — boundary, shared Agent, RBAC separation

**Boundary table**

| Topic | Observability | Security |
|-------|---------------|----------|
| Primary UI | Applications, Hosts, SLOs, Streams | Alerts, Rules, Timeline, Defend, Cases |
| Success metric | Error budget, dig MTTR | MTTD/MTTR for threats, posture debt |
| Page dest | SRE / service on-call | SecOps / SOC |
| Data retention | Dig windows on hot/warm ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) | Often longer for investigations |
| AI features | Obs AI / Nightshift ([19](./19_Observability_AI.md)) | Security-specific AI / MCP — separate product story |

**Data overlap.** Auth, audit, and VPC flow logs serve **both** threat hunting and (sometimes) ops context. Prefer dual routing with clear retention: long security retention ≠ hot Observability digs ([15](./15_Cloud_Integrations.md)).

**Shared Agent / Fleet.** Label policies `obs` vs `defend` (or dedicated Defend policies). Don’t casually merge endpoint response into the same change ticket as “add nginx logs.” Enrollment tokens and package upgrades need dual review when both teams share hosts.

**Licensing / projects.** Security Serverless feature tiers and Observability projects can be separate. Don’t assume one trial enables both at production depth. Spaces and data views for Security are configured deliberately—viewer ≠ rule admin ≠ Defend policy admin.

**This chapter is literacy only**—not every prebuilt rule, MITRE mapping, or Defend exception syntax. Hand those to Security docs and owners. Compare the product-boundary idea to Datadog’s security suite chapter ([Datadog/20](../Datadog/20_Security_Products.md)) without equating SKUs.

## 3. Applications — use cases and staff checklist

| Use case | Moves |
|----------|-------|
| Shared Elastic estate | Spaces/roles: Obs editors ≠ Security platform admins ≠ Defend responders |
| Audit evidence | Keep cloud-native audit too ([31](../31_Cloud_Managed_Sinks_And_Audit_Door.md)) |
| Sev1 page storm | Confirm alert source: APM SLO vs detection rule |
| Agent sprawl | Fleet policies labeled; Defend rollout under security CAB |
| Cloud misconfig | Cloud security findings → SecOps backlog, not SRE SLO burn |

**Staff checklist:** Security product owner named; Observability on-call does **not** own SIEM pages by default; PII rules cover security indices; documentation link: Security is a separate solution; enable only after core Obs loop works ([13](./13_Worked_Example_First_Service.md)); Defend isolation authority documented; spaces/RBAC reviewed quarterly ([20](./20_API_Fleet_Automation_And_RBAC.md)).

**Good:** detect + Defend + cloud security with named SecOps owners beside a healthy Obs loop. **Bad:** enable every Security tile, page SRE for all of it, skip SDS/PII hygiene on shared logs.


**Enable order (literacy, not playbook).** After Obs core loop works: (1) spaces/RBAC separation, (2) ingest security-relevant logs with SDS/PII hygiene, (3) cloud security on primary account if posture is the gap, (4) Defend on a canary fleet under SecOps CAB, (5) detection rules with triage tiers—not “enable all prebuilt.” Obs engineers help Fleet and ILM; they do not own MITRE content.

**Cases vs Observability Cases.** Security cases and Observability cases/incidents can both exist—link them when a Sev1 is both outage and intrusion, but keep severity taxonomies separate so error-budget burn is not confused with threat severity ([09](./09_Alerting_SLOs_And_Incident_Management.md)).


### Shared-Agent do / don’t

| Do | Don’t |
|----|-------|
| Separate Fleet policies for Defend vs Obs integrations | Bolt Defend onto the checkout log policy casually |
| SecOps owns isolation / response actions | Give every SRE host-isolate |
| Dual-route audit logs with clear retention | Assume CloudTrail in Discover = SOC |
| Spaces for Security editors vs Obs editors | One shared `superuser` for both products |

When SecOps and SRE share a cluster, write the RACI once—most “Elastic paging storms” are ownership storms ([12](./12_Operations_Pitfalls_And_Staff_Checklist.md)).


**Detection rule types (names only).** Query, threshold, EQL, indicator match, ML, ES\|QL, and related—each has different noise profiles. Obs engineers should recognize the *category* of alert in the Sev1 storm (“this is EQL malware,” not “this is APM latency”) and hand off. Never “widen threshold” on Defend/malware rules the way you would on a flappy CPU monitor.

**Serverless Security projects.** Security can be a separate serverless project/tier from Observability. Do not assume one Observability project trial unlocks Defend + SIEM at production depth—check feature tiers and billing owners before “just enabling Security.”

Re-read this chapter whenever someone proposes “just page SRE from Security too”—that is the recurring failure mode.

Hand off Defend exception syntax and MITRE mappings to SecOps docs—this chapter stops at the boundary.

## References

- [Elastic Security](https://www.elastic.co/docs/solutions/security) · [Get started](https://www.elastic.co/docs/solutions/security/get-started) · [Detect and alert](https://www.elastic.co/docs/solutions/security/detect-and-alert)  
- [Elastic Defend](https://www.elastic.co/docs/solutions/security/manage-elastic-defend) · [Cloud security get started](https://www.elastic.co/docs/solutions/security/get-started/get-started-cloud-security) · [Spaces](https://www.elastic.co/docs/solutions/security/get-started/spaces-elastic-security)  
- [19 Observability AI](./19_Observability_AI.md)
