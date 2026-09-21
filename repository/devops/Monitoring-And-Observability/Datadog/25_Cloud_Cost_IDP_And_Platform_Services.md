# 25 — Cloud Cost, IDP, and platform services

[← Previous](./24_Feature_Flags_Experiments_And_Product_Analytics.md) · [README](./README.md) · [Next →](./26_API_Terraform_CLI_And_Account_Admin.md)

## 1. Concepts — FinOps, portal, and platform glue

Beyond digs and pages, Datadog offers **cost allocation**, an **internal developer portal**, diagramming, query/extend surfaces, and the **integrations** catalog that glues vendors together.

### Cloud Cost Management

Ingest cloud provider bills as metrics; explore spend beside utilization; tag rules for allocation; monitors on cost anomalies. Also surfaces **Datadog** spend as a cost type — so Finance does not confuse the **cloud invoice** with the **Datadog invoice** ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

**When:** shared cloud accounts need chargeback; idle GPU/VM waste is political ([17](./17_Network_USM_And_GPU_Monitoring.md)). **When not:** as a substitute for fixing cardinality — CCM won’t shrink custom metrics.

### Internal Developer Portal (IDP)

Managed portal: live **Catalog**, ownership metadata, **Scorecards**, self-service **Actions**, engineering reports. Powered by telemetry + Teams sync (e.g. GitHub teams). This is where “who owns `checkout`?” should resolve during an incident ([19](./19_Incident_Workflows_And_Collaboration.md)).

### Cloudcraft / architecture diagrams

**Cloudcraft** capability for architecture diagramming tied to real inventory — onboarding, design reviews, and “what talks to what” without stale Visio.

### DDSQL, reference tables, Extend, Mobile

| Surface | Job |
|---------|-----|
| **DDSQL** | SQL-like querying over telemetry where offered |
| **Reference tables** | Enrich joins (CMDB-like mappings) |
| **Extend** | Custom apps/widgets on the Datadog platform |
| **Mobile app** | On-call glance at monitors/incidents |

### Integrations marketplace

800+ integrations — enable what you **run** (cloud, data stores, CI, collaboration). Marketplace/partner integrations can emit **custom metrics** — budget them ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)). Partner/MSP patterns for multi-customer orgs live under account topology ([26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Disconfirm:** IDP without Teams/ownership data. Cloud Cost without tag hygiene. Enabling every Marketplace tile “for completeness.”

**Confirm:** Scorecard standards agreed with platform eng? Cost monitors owned by FinOps + eng? Catalog owners match pager rotations?

## 2. Advanced — tags, scorecards, multi-org

**Tag hygiene is FinOps.** CCM allocation rules fail without consistent `team`/`service`/`env` on resources and telemetry. Fix tagging ([02](./02_Architecture_Agent_And_Data_Plane.md)) before arguing about dashboards.

**Scorecards as policy.** Rules like “unified tags present,” “SLO defined,” “runbook linked” beat PDF standards nobody reads. Start with three rules; enforce via IDP visibility, not surprise pages.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Unallocated spend | Missing tags; rules not covering accounts |
| Catalog ghost services | USM/APM names without owners ([17](./17_Network_USM_And_GPU_Monitoring.md)) |
| Scorecard theater | Rules without remediation owners |
| Integration metric spike | Marketplace tile left on after POC |

**Enterprise topology.** Multi-org / DR / admin isolation — read administrators guides when splitting prod vs security orgs ([26](./26_API_Terraform_CLI_And_Account_Admin.md)). Don’t invent a second Datadog org for every team without a cost model.

**Extend / DDSQL governance.** Custom apps and powerful queries need RBAC; treat Extend like internal software (review, owners, secrets).

**Cloud Cost vs Usage.** Weekly ritual: (1) Cloud Cost top unallocated / idle, (2) Datadog Usage top custom metrics and log indexes ([11](./11_Cost_Governance_And_Account_Hygiene.md)). Different invoices, same meeting — otherwise each org blames the other bill.

**Catalog completeness.** Aim for coverage of SLO services first, not 100% of every USM blip. Empty ownership fields should fail Scorecards. Sync Teams from IdP/GitHub so pager routing and Catalog don’t drift.

**Integrations as attack surface.** Each enabled integration is credentials + data pull. Prefer least-privilege roles; disable tiles after POCs; review Marketplace publishers like you review vendors.

## 3. Applications — use cases and staff checklist

**Use case 1 — Chargeback v1.** Connect one cloud billing account; allocate by `team` tag; share monthly report; fix top untagged spenders.

**Use case 2 — Catalog for top 20.** IDP Catalog entries with owners, Slack, on-call, SLO link, runbook notebook; verify during game day.

**Use case 3 — Scorecard rule.** “Service has `team` tag + SLO”; publish; give teams two sprints before leadership review.

**Use case 4 — Integration cleanup.** Quarterly: disable unused integrations; check custom metric contribution ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

**Staff checklist**

- [ ] Cloud billing linked; allocation tags defined  
- [ ] Datadog Usage and Cloud Cost both understood by FinOps  
- [ ] IDP Catalog for critical services with human owners  
- [ ] Scorecard standards written and owned by platform  
- [ ] Cloudcraft/diagrams used for onboarding where helpful  
- [ ] Marketplace integrations inventoried; unused off  

**Good:** cost + ownership + scorecards on the same Catalog. **Bad:** CCM dashboards with no tags and Catalog with “unknown” owners.

## References

- [Cloud Cost Management](https://docs.datadoghq.com/cloud_cost_management/) · [Internal Developer Portal](https://docs.datadoghq.com/internal_developer_portal/)  
- [Cloudcraft](https://docs.datadoghq.com/cloudcraft/) · [Integrations](https://docs.datadoghq.com/integrations/) · [DDSQL](https://docs.datadoghq.com/ddsql_editor/)  
- [Extend](https://docs.datadoghq.com/extend/) · [Reference Tables](https://docs.datadoghq.com/reference_tables/)  
- [26 API / admin](./26_API_Terraform_CLI_And_Account_Admin.md)
