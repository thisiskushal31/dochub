# 14 — Worked example — first service

[← Previous](./13_Operations_License_And_Pitfalls.md) · [README](./README.md) · [Next →](./15_What_To_Enable_Next_And_When_Not.md)

## 1. Concepts — Wizard → agent → load → BT → page

Goal: one service (example name: `checkout`) with **app-server agent**, visible **business transactions**, one **health rule**, and one **page** to a test [PagerDuty](../PagerDuty/README.md) (or chat) action—before EUM, Database Visibility, or Analytics sprawl ([15](./15_What_To_Enable_Next_And_When_Not.md)).

### Lab steps

1. **Tenant** — confirm SaaS URL / on-prem Controller; note **account name** and agent **access key** from secrets manager—not chat ([03](./03_SaaS_Vs_On_Prem_Controller.md), [16](./16_API_Automation_And_RBAC.md)).  
2. **Getting Started Wizard** — Home → Download & Install; pick language (Java is the literacy default); create **Application** / **Tier** / **Node** names deliberately (`Checkout` / `checkout-api` / `checkout-1`) ([04](./04_Install_App_Server_Agents.md), [02](./02_Architecture_Controller_Apps_Tiers_Nodes.md)).  
3. **Agent** — install per wizard (or manual `controller-info`); SSL/host/port correct; restart the app process under the agent.  
4. **Load** — hit a few HTTP routes in staging; wait for the node to report.  
5. **Business transactions** — open Application → Business Transactions; identify golden paths (e.g. `POST /checkout`); exclude static/noise ([05](./05_Business_Transactions.md)).  
6. **Snapshot dig** — force a slow or error; open a transaction snapshot / call graph ([06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md)).  
7. **Health rule** — Alert & Respond → Health Rules → BT error rate or average response on the **golden BT only**; Critical for page, optional Warning for chat ([10](./10_Health_Rules_Policies_And_Alerting.md)).  
8. **Action** — create HTTP Request action from a PagerDuty (or Slack) template; integration key in template variable / vault—not git.  
9. **Policy** — health-rule OPEN_CRITICAL (and optionally resolve) → that action; enable; test template first.  
10. **Drill** — break staging on purpose; page → health rule → BT → snapshot ([parent 21](../21_Correlation_And_Dig_Methodology.md)).  
11. **Optional later** — Machine Agent for the host ([07](./07_Infrastructure_And_Machine_Agents.md)); not EUM/DB/Analytics yet.

### Done when

You can cause a staging failure, get a page, and open the offending BT snapshot in under fifteen minutes without guessing application/tier names.

**Disconfirm:** Enabling EUM + DB Visibility + Analytics in the same lab hour. Shipping to prod before the dig drill works. Dual Datadog agent “just in case.”

**Confirm:** Golden BT named? Page lands with a human owner? Access key not in the repo?

**Plain language:** The lab is done when a stranger on your team can follow the page to the snapshot without asking you which application name you used.

## 2. Advanced — pitfalls during the lab

| Pitfall | Fix |
|---------|-----|
| Agent up, empty app | Wrong account/access key, host, or SSL; check agent logs |
| Huge BT list | Exclude frameworks/static; refine detection rules |
| Health rule never fires | Wrong BT scope; traffic too low; threshold impossible; persistence too strict |
| Storm on first deploy | Rule scoped to all BTs—narrow to golden set |
| Snapshot without useful stacks | Framework not supported / runtime mismatch—check agent compat |
| On-prem Wizard vs custom URL | Align agent Controller URL with real endpoint ([03](./03_SaaS_Vs_On_Prem_Controller.md)) |
| PagerDuty no incident | Template not tested; wrong integration key; policy missing action |
| Resolve never closes PD | Separate resolve / `pd_event_type=resolve` and stable `incident_key` |

**What “good” looks like.** Node green; golden BT has load; one critical health rule; one test page in PagerDuty history; a second engineer can repeat the dig from the runbook.

**Stop conditions.** Abort if dig exceeds 15 minutes twice, BT names are chaos, or pages land on an unnamed channel—fix those before [15](./15_What_To_Enable_Next_And_When_Not.md).

**Teach-back (10 minutes).** Second engineer: find the test page → open the health rule → jump to the golden BT → open a snapshot → name the bad deploy/node. If any hop needs tribal knowledge, the lab is not done.

**Correlation to write down.** Application, tier, node, golden BT names, health rule name, policy name, PagerDuty service, and where the access key lives. Put them in the team README before prod cutover ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**Health-rule → policy wiring tips.** Create and test the HTTP template first; then the Critical health rule on the golden BT only; then the policy that binds OPEN_CRITICAL (and resolve) to that action. If the dig works but PagerDuty is silent, the break is almost always policy scope or missing action—not the agent ([10](./10_Health_Rules_Policies_And_Alerting.md)).

**Prod cutover gate.** Staging dig green; real on-call in the action; license headroom checked; dual APM absent; 7-day usage review on the calendar—then promote. Skip EUM/DB/Analytics until week two ([15](./15_What_To_Enable_Next_And_When_Not.md)).

**Lab spine reminder.** Concepts = the steps; Advanced = pitfalls that fail the 15-minute dig; Applications = language/platform variants of the same loop—not new products bolted on mid-lab.

## 3. Applications — variants

| Variant | Change |
|---------|--------|
| Kubernetes | Same naming; agent as sidecar/init or machine + app agent per platform standard |
| OpenTelemetry | OTel → Collector → AppD instead of (or carefully with) classic agent ([12](./12_OpenTelemetry_To_AppDynamics.md)) |
| .NET / Node | Same Wizard path; language-specific install knobs ([04](./04_Install_App_Server_Agents.md)) |
| Warning + Critical | Warning → Slack digest; Critical → PagerDuty only ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| Production cutover | Same steps; real on-call; license usage check after 7 days ([13](./13_Operations_License_And_Pitfalls.md)) |
| Next enable only | Machine Agent **or** one DB collector after dig works—never both with EUM in one change |

**Staff checklist after the lab**

1. Runbook linked on the action.  
2. BT exclusion list recorded.  
3. Agent upgrade owner named.  
4. Next enable from [15](./15_What_To_Enable_Next_And_When_Not.md) only with owner + kill criteria.  
5. Lab linked in onboarding so the next hire does not rebuild tribal knowledge.

**Done bar reminder:** under fifteen minutes from page to snapshot, twice, with two different engineers.

### Quickstart chooser

| Starting point | Path |
|----------------|------|
| Java on VM | Getting Started Wizard → JVM agent |
| .NET / Node | Wizard for that language ([04](./04_Install_App_Server_Agents.md)) |
| K8s | Same naming; sidecar/init per platform standard |
| OTel-first | Collector → AppD ([12](./12_OpenTelemetry_To_AppDynamics.md))—still one primary path |

Do **one** primary path for the lab; document the second as follow-up, not a parallel experiment.

## References

- [Use the Getting Started Wizard](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/use-the-getting-started-wizard) · [Health Rules](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/health-rules) · [Create a Template for PagerDuty](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/alert-and-respond/actions/http-request-actions-and-templates/create-a-template-for-pagerduty) · [Health Rule API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/alert-and-respond-api/health-rule-api)  
- [15 What to enable next](./15_What_To_Enable_Next_And_When_Not.md) · [PagerDuty](../PagerDuty/README.md) · [10 Health rules](./10_Health_Rules_Policies_And_Alerting.md) · [Elastic first-service lab](../Elastic/13_Worked_Example_First_Service.md)
