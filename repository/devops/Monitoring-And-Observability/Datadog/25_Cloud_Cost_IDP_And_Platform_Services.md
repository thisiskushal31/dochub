# 25 — Cloud Cost, IDP, and platform services

[← Previous](./24_Feature_Flags_Experiments_And_Product_Analytics.md) · [README](./README.md) · [Next →](./26_API_Terraform_CLI_And_Account_Admin.md)

## 1. Concepts

### Cloud Cost Management

Ingest cloud provider bills as metrics; explore spend beside utilization; tag rules for allocation; monitors on cost anomalies. Also surfaces **Datadog** spend as a cost type—use both so Finance doesn’t confuse cloud invoice vs Datadog invoice ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

### Internal Developer Portal (IDP)

Managed portal: live **Catalog**, ownership metadata, **Scorecards**, self-service **Actions**, engineering reports. Powered by telemetry + Teams sync (e.g. GitHub teams).

### Cloudcraft / architecture diagrams

Datadog’s Cloudcraft capability for architecture diagramming tied to real inventory—use for reviews and onboarding (see Cloudcraft docs).

### DDSQL, reference tables, extend

- **DDSQL** — SQL-like querying over telemetry where offered.  
- **Reference tables** — enrich joins.  
- **Extend** — custom apps/widgets on the Datadog platform.  
- **Mobile** app — on-call glance.

### Integrations marketplace

800+ integrations—enable what you run (cloud, data stores, CI, collaboration). Marketplace/partner integrations can emit custom metrics—budget them ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).

**Disconfirm:** IDP without Teams/ownership data. Cloud Cost without tag hygiene.

**Confirm:** Scorecard standards agreed with platform eng? Cost monitors owned by FinOps + eng?

## 2. Advanced

Disaster recovery / multi-org topology and administrators guides cover enterprise isolation—read when you split prod/security orgs ([26](./26_API_Terraform_CLI_And_Account_Admin.md)).

## 3. Applications — what to do

1. Connect one cloud billing account; allocate by `team` tag.  
2. Stand up IDP Catalog for top 20 services with owners.  
3. One Scorecard rule: unified tags + SLO present.

## References

- [Cloud Cost](https://docs.datadoghq.com/cloud_cost_management/) · [IDP](https://docs.datadoghq.com/internal_developer_portal/) · [Integrations](https://docs.datadoghq.com/integrations/) · [Cloudcraft](https://docs.datadoghq.com/cloudcraft/)  
- [26 API / admin](./26_API_Terraform_CLI_And_Account_Admin.md)
