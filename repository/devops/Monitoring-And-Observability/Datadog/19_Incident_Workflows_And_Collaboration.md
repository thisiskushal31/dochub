# 19 — Incident response, workflows, and collaboration

[← Previous](./18_Profiler_Error_Tracking_Watchdog_And_Events.md) · [README](./README.md) · [Next →](./20_Security_Products.md)

## 1. Concepts — respond next to the telemetry

Paging is useless without a place to **declare**, **timeline**, and **automate enrich** without swivel-chair between chat and twelve browser tabs. Datadog’s collaboration surface sits on the same data plane as monitors and APM.

### Incident Response / Incident Management

Declare incidents with severity, responders, timeline, and postmortem artifacts **beside** the graphs and traces that triggered them. Use for Sev1/Sev2 where coordination cost dominates; keep Sev3/noise in tickets or Slack threads.

Integrate with paging ([PagerDuty](../PagerDuty/README.md) or similar): Datadog Incident is the **investigation home**; the pager is the **wake-up**. Severity model should match org on-call practice ([parent 32](../32_On_Call_And_Human_Loop_Door.md)).

### Workflow Automation & Actions

**Workflow Automation** runs playbooks on monitor/security triggers: enrich context, open Jira, notify channels, call APIs with guardrails. **Actions** are the building blocks (HTTP, cloud, Datadog product actions). Prefer enrich-and-notify over silent production mutation.

### Notebooks, Sheets, Coterm

| Tool | Job |
|------|-----|
| **Notebooks** | Narrative + live graphs for investigations and runbooks |
| **Sheets** | Spreadsheet-like analysis over telemetry |
| **Coterm** | Collaborative terminal patterns when your org uses them (see current docs) |

### Bits AI (ops angle)

Agentic help for alert triage and ops tasks ([23](./23_LLM_Observability_Bits_AI_And_MCP.md)). Still needs a **human owner** of the page; do not let Bits close incidents without review.

**Disconfirm:** Auto-remediation without blast-radius limits. Incident tool without page-routing discipline. Notebooks that nobody updates after the outage.

**Confirm:** Severity model matches Methodologies/on-call? Who can approve workflow actions that change prod? Postmortems stored where the org already looks?

## 2. Advanced — integrations, guardrails, failure modes

**Integrations.** Slack/Teams for war rooms; Jira/ServiceNow for follow-ups; PagerDuty for pages. Map Datadog severities to pager urgencies once — conflicting scales create ignored Sev1s.

**Workflow guardrails.** Require human approval for delete/scale/failover actions. Log every run; use least-privilege app keys ([26](./26_API_Terraform_CLI_And_Account_Admin.md)). Idempotent notify workflows beat clever remediations that double-scale.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Empty incident timelines | People update Slack only; train “declare early” |
| Workflow storms | Monitor flaps trigger actions; debounce / require sustained breach |
| Notebook rot | No owner; link from runbook/Service Catalog instead of tribal memory |
| Duplicate pages | Monitor → PD and Workflow → PD both fire |

**Notebooks as runbooks.** Template: RED metrics + deploy Events ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)) + top traces + “what good looks like.” Pin from IDP/Catalog ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)). Live cells beat screenshots that age out.

**Security incidents.** Route SIEM/AAP signals ([20](./20_Security_Products.md)) to security severity and responders — don’t mix with availability Sev without a dual-hat process.

**Cost.** Workflow runs and Bits AI credits are usage — constrain who can create high-fan-out automations ([11](./11_Cost_Governance_And_Account_Hygiene.md)).

## 3. Applications — use cases and staff checklist

**Use case 1 — Sev1 API outage.** Monitor pages PD → commander declares Datadog Incident → Notebook template opened → timeline captures deploy Event and Watchdog story → postmortem linked from Catalog.

**Use case 2 — Enrich-only workflow.** On monitor alert: Action gathers dashboard deep link, last deploy, top error issue → posts to Slack; **no** auto-restart.

**Use case 3 — Runbook notebook.** One service: SLO graph, dependency map, “rollback” checklist cells; reviewed each quarter.

**Use case 4 — Security vs avail split.** Separate incident types/severities; security workflows notify SecOps channel; avail stays on SRE rotation.

**Staff checklist**

- [ ] Paging path clear: Monitor → PagerDuty (or equivalent)  
- [ ] Datadog Incident used for Sev1/2 with timeline discipline  
- [ ] Severity definitions documented and matched to on-call  
- [ ] At least one enrich-only workflow; mutation actions gated  
- [ ] Investigation notebook template for top SLO service  
- [ ] Postmortem location agreed (Datadog vs wiki)  

**Good:** one timeline next to telemetry; automation that gathers context. **Bad:** auto-remediate without approval; incidents that live only in chat scrollback.

## References

- [Incident Response](https://docs.datadoghq.com/service_management/incident_management/) · [Incident Management](https://docs.datadoghq.com/monitors/incident_management/)  
- [Actions](https://docs.datadoghq.com/actions/) · [Workflow Automation](https://docs.datadoghq.com/service_management/workflows/) · [Notebooks](https://docs.datadoghq.com/notebooks/)  
- [20 Security](./20_Security_Products.md)
