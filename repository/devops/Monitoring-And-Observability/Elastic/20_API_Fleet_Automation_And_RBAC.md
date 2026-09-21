# 20 — API, Fleet automation, and RBAC

[← Previous](./19_Observability_AI.md) · [README](./README.md) · [Next →](./21_Discover_ESQL_And_Kibana_Digs.md)

## 1. Concepts — automate and govern the estate

Everything earlier becomes unsafe at scale without **API keys**, **Fleet policies as code**, and **RBAC**. This chapter is how you operate Elastic Observability as a platform—not a shared superuser login.

### Keys and identity

| Mechanism | Purpose |
|-----------|---------|
| **Elasticsearch API keys** | Programmatic ES access; scoped privileges |
| **Kibana / project API keys** | Automate Kibana features (e.g. Synthetics project push) |
| **APM agent keys** | Authorize APM/EDOT agents to APM Server / OTLP without over-broad credentials |
| **Fleet enrollment tokens** | Enroll Agents into policies—treat as secrets |
| **Cloud / org API keys** | Manage deployments/projects via Cloud APIs |
| **SSO (SAML/OIDC)** | Humans; not long-lived passwords in chat |

### Observability HTTP APIs (from apis.md)

| API | Job |
|-----|-----|
| **Alerting** | Create/manage rules, alerts, actions |
| **APM agent configuration** | Adjust agent config **without redeploy** (sampling, etc.) |
| **APM agent keys** | Create/manage agent authorization keys |
| **APM annotations** | Mark deploys/events on APM visualizations |
| **APM sourcemaps** | Upload/manage source maps |
| **Cases** | Open/manage cases |
| **Connectors** | Create/manage connectors for rules and cases |
| **Observability AI Assistant** | Programmatic assist interactions |
| **SLOs** | Define/manage/track SLOs |
| **Streams** | Create/manage streams |
| **Synthetics** | Monitors, private locations, parameters |
| **Uptime** | View/update uptime monitoring settings |

Beside these: core Elasticsearch and Kibana APIs, Fleet API, and Cloud APIs. Prefer official clients; paginate; respect rate limits. Stack vs serverless endpoint groups both exist—use the docs for your deploy type ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).

### Fleet as code + RBAC + spaces

Manage **Agent policies**, integrations, outputs, and upgrades via Fleet UI **then** API/IaC—after one path works manually ([04](./04_Agent_Fleet_Beats_And_Logstash.md)). Drift between click-ops and Git is a leading cause of “why did staging Agents stop?”

Kibana **roles/spaces**, Elasticsearch **privileges**, Fleet roles, and Cloud org roles are different layers. Separate: who can create high-ingest integrations, who can manage APM keys, who is cluster/project admin, who is Security platform admin ([18](./18_Security_SIEM_Literacy.md)). Spaces limit blast radius for multi-team Kibana and Security.

**Disconfirm:** Long-lived superuser in CI. Enrollment tokens in chat. Everyone is `superuser`. Terraform without review on paging alerts. APM agent config API changes in prod with no change ticket.

**Confirm:** Break-glass admin documented? SSO for humans? Key inventory quarterly? Fleet policy owners named? Connector admins ≠ every rule editor?

## 2. Advanced — hygiene, CI, connectors, CPS

**APM agent keys + central config.** Create least-privilege agent keys; rotate on leak; don’t reuse a personal API key for fleet APM. **APM agent configuration API** changes sampling and related knobs without redeploy—change-control them like feature flags ([13](./13_Worked_Example_First_Service.md)).

**Fleet API.** Automate policy revisions, enrollment, and monitoring; watch Fleet Server scalability and proxy settings for large estates. Serverless Agent restrictions may differ from Stack—read current Fleet docs. Pair with observe-the-observer Agent offline alerts ([12](./12_Operations_Pitfalls_And_Staff_Checklist.md)).

**Connectors.** Alerting and Cases depend on connectors (Slack, PagerDuty, email, webhook, GenAI). Manage as code where possible; GenAI connectors are a security review item ([19](./19_Observability_AI.md)).

**CI/CD.** Synthetics project push and monitor-as-code use project API keys ([08](./08_Synthetics_And_Uptime.md)). Elastic **CI/CD Observability** correlates pipelines via OTel—enable when flaky builds burn you ([22](./22_CI_CD_Observability.md), [14](./14_What_To_Enable_Next_And_When_Not.md)). Deploy annotations via APM annotations API help dig correlation.

**Cross-project search (CPS).** Serverless linked projects need org-level config and careful scope training—Discover vs Observability app scope can disagree ([21](./21_Discover_ESQL_And_Kibana_Digs.md)). API automation should target the correct project credentials.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Agents offline after rotate | Enrollment/output credentials rotated without rollout |
| APM 401/403 | Agent key wrong or privilege missing |
| Sudden sample-rate change | Agent config API / UI edit without review |
| Terraform fights UI | Dual management of same alert/policy |
| Silent privilege creep | No audit of role/space changes |
| GenAI surprise spend | Connector unbounded; no allowlist |

**Audit.** Prefer SSO + audit logging for admin actions. Emergency access bypasses SSO—store offline, alert on use, rotate after each use.

## 3. Applications — use cases and staff checklist

**Use case 1 — Secrets baseline.** ES/Kibana/APM/Fleet/Cloud tokens in secrets manager; inventory quarterly; revoke orphans.

**Use case 2 — Fleet one slice.** Codify one Agent policy (system + checkout logs); PR review; UI freeze for that policy id.

**Use case 3 — SSO + break-glass.** Enforce SAML/OIDC for humans; sealed break-glass; test annually.

**Use case 4 — APM key + config rotation.** Stage new agent key → roll pods/hosts → revoke old; treat agent-config sampling changes like releases.

**Use case 5 — Alerting as code.** Rules + connectors + SLOs via API/Terraform with review; page routes tested in staging.

**Staff checklist**

- [ ] API key types understood (ES, Kibana, APM, Fleet, Cloud)  
- [ ] Observability API surface mapped (alerting, SLO, Streams, Synthetics, APM config/keys, connectors, Cases, AI)  
- [ ] Secrets manager + rotation runbook  
- [ ] SSO enforced for humans  
- [ ] RBAC: admin ≠ everyone; Security roles separated; spaces used  
- [ ] Fleet policies owned; enrollment tokens rotated  
- [ ] APM agent configuration changes under change control  
- [ ] Critical alerts/SLOs as code with review  
- [ ] Break-glass procedure documented and tested  
- [ ] CI/CD Observability considered when pipeline pain warrants ([22](./22_CI_CD_Observability.md))  

**Good:** least-privilege keys, Fleet as code, audited admins, connectors owned. **Bad:** one forever superuser key in CI.

## References

- [Observability APIs](https://www.elastic.co/docs/solutions/observability/apis) · [Elasticsearch API keys](https://www.elastic.co/docs/deploy-manage/api-keys/elasticsearch-api-keys) · [Users and roles](https://www.elastic.co/docs/deploy-manage/users-roles)  
- [Fleet](https://www.elastic.co/docs/reference/fleet) · [Fleet API](https://www.elastic.co/guide/en/fleet/current/fleet-api-docs.html) · [Fleet roles](https://www.elastic.co/docs/reference/fleet/fleet-roles-privileges)  
- [CI/CD Observability](https://www.elastic.co/docs/solutions/observability/cicd) · [CPS](https://www.elastic.co/docs/solutions/observability/cross-project-search)  
- [21 Discover / ES\|QL](./21_Discover_ESQL_And_Kibana_Digs.md) · [22 CI/CD](./22_CI_CD_Observability.md) · [Offering map](./14_What_To_Enable_Next_And_When_Not.md)
