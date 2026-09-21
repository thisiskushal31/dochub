# 13 — Operations, license, and pitfalls

[← Previous](./12_OpenTelemetry_To_AppDynamics.md) · [README](./README.md) · [Next →](./14_Worked_Example_First_Service.md)

## 1. Concepts — day-2 failure modes

Operating AppDynamics is mostly **agent hygiene**, **license headroom**, **Controller health** (especially on-prem), and **refusing dual APM**.

| Pitfall | What you see | What to do |
|---------|--------------|------------|
| **BT / license pressure** | Dropped or “all other traffic” buckets; purchase friction | Cap noisy BTs ([05](./05_Business_Transactions.md)); license rules/allocations |
| **Dual APM ban** | Double agents (AppD + Datadog/NR) on one JVM/service | One primary APM ([Datadog](../Datadog/README.md), [New Relic](../New_Relic/README.md), [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| **Stale agents** | Missing features; hard support | Version policy; staged upgrades |
| **On-prem Controller neglect** | Blind APM when Controller/Events Service sick | Capacity, backup, Enterprise Console literacy ([03](./03_SaaS_Vs_On_Prem_Controller.md)) |
| **Alert storms** | On-call ignores AppD | Scope health rules; suppressions ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| **Secret sprawl** | Account name + access keys in git | Secrets manager ([16](./16_API_Automation_And_RBAC.md)) |
| **Every product day one** | Cost + noise | Phase enables ([15](./15_What_To_Enable_Next_And_When_Not.md)) |
| **DB / Analytics meter surprise** | Collectors or custom events refused | Headroom before enable ([09](./09_Database_Visibility_Literacy.md), [11](./11_Analytics_And_Log_Literacy.md)) |

**License literacy.** Observe usage in the Controller; infrastructure-based vs agent-based models change what “a unit” means. Concurrent databases and Analytics events have their own meters. License API exists for automation—still name a human owner. Database Visibility transfer = remove collector then add.

**Agent classes to version together.** App-server agents, Machine Agent, Database Agent, Analytics Agent, and OTel Collector/OTIG pins. Skew across a tier produces “works on node A” digs.

**Disconfirm:** More agents ⇒ more reliability. Support tickets without agent logs / node identity. SaaS Customer Success as your only on-prem runbook. Dual APM “for coverage.”

**Confirm:** Who upgrades agents? Who watches license? Who pages if the Controller is down?

## 2. Advanced — SaaS vs on-prem, upgrades, DR, support hygiene

**SaaS.** You still own agent fleets, BT config, health rules, and RBAC. Track vendor status/incidents; pin agent versions compatible with your Tenant. Controller REST base URI is the same primary host/port agents use (`/controller/rest/...`). License usage UI + License API are your headroom instruments—calendar them.

**On-prem / VA.** Treat Controller + Events Service like a critical database: disk, JVM, HA, backup/restore drills, Enterprise Console upgrades ([AppDynamics On-Premises](https://help.splunk.com/en/appdynamics-on-premises)). Custom Controller URLs and certs break agents silently ([03](./03_SaaS_Vs_On_Prem_Controller.md)). Capacity: metric retention, Events Service disk, snapshot volume—“UI sluggish” is often storage/CPU. Who pages when the Controller is down must be written—APM pages are useless if the Controller is the outage.

**Agent upgrades.** Written cadence. Rebuild container images regularly; do not bake decade-old agents into base images. Stage in non-prod; verify node reporting and golden BT names before fleet roll. Wrong host/port/SSL/access key → agents offline. Align Machine/DB/Analytics Agent calendars with app agents so digs do not span three runtimes.

### License units literacy

Know your model and what consumes units:

| Unit family | Typical consumers |
|-------------|-------------------|
| APM | Tiers / nodes / BT pressure (model-dependent) |
| Database Visibility | Concurrent collectors / databases |
| Analytics | Transaction / log / custom event volume |
| EUM | Browser / mobile app keys and traffic |

Surprise overage usually means a new tier under the wrong application or collectors left on decommissioned shards.

**Dual instrumentation.** Classic agent + OTel is supported in specific patterns ([12](./12_OpenTelemetry_To_AppDynamics.md))—not permission to also run New Relic or Datadog APM on the same process. Enforce in CI templates and platform standards.

**Naming sprawl.** Abandoned applications/tiers after renames still consume attention and sometimes license rules. Quarterly dead-node cleanup is ops work.

**Audit / cloud.** AppD does not replace cloud audit trails ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)). Use Controller Audit History for “who deleted that policy?” ([16](./16_API_Automation_And_RBAC.md)).

**Support hygiene.** Before tickets: agent logs, node name, Controller version/Tenant URL, recent config changes, dual-agent check. Capture language-agent flares/status artifacts as documented.

### Failure modes (ops)

| Symptom | Likely cause |
|---------|----------------|
| Agents offline after upgrade | Wrong host/port/SSL/account access key |
| Sudden BT explosion | Detection rule change / new framework |
| License overage | Wrong app registration; DB collector sprawl |
| UI slow (on-prem) | Controller capacity / retention / Events Service disk |
| Empty DB / Analytics after “enable” | Entitlement exhausted; credentials wrong |
| Split RCA | Dual SaaS APM on one process |

## 3. Applications — staff checklist and drills

**Staff checklist**

- [ ] One primary APM written (dual APM banned in platform standards)  
- [ ] Agent version policy + owners (app, machine, DB, Analytics, Collector/OTIG)  
- [ ] License usage reviewed on a calendar (APM + DB concurrent + Analytics)  
- [ ] BT naming / exclusion contracts  
- [ ] Health-rule → PagerDuty path tested ([10](./10_Health_Rules_Policies_And_Alerting.md))  
- [ ] On-prem: Controller + Events Service backup/restore drill (if applicable)  
- [ ] Secrets: account name, access keys, Analytics keys, OTel keys not in git  
- [ ] OTel vs classic decision recorded where relevant  
- [ ] Quarterly dead-node / unused health-rule cleanup  

**Drills:** break staging ([14](./14_Worked_Example_First_Service.md)); practice collecting agent logs for support; quarterly delete unused health rules and abandoned nodes; license transfer dry-run for a staging DB collector.

**Good:** dual-APM ban enforced; license calendar owned. **Bad:** forever-stale agents and silent Controllers.

**Calendar ops (minimum).** License review monthly; agent version skew review quarterly; dead-node cleanup quarterly; paging-path drill after every major Controllers/agent upgrade. Ops without a calendar becomes tribal memory.

**Vs peer ops chapters.** Same dual-APM ban and agent hygiene story as Datadog/New Relic estates—AppD-specific twist is Controller/Events Service ownership on-prem and concurrent Database Visibility meters ([Elastic ops peer](../Elastic/12_Operations_Pitfalls_And_Staff_Checklist.md)).

**Plain language:** Day-2 AppD reliability is agent + license + Controller health—not more product checkboxes.

## References

- [Using the Controller APIs](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/using-the-controller-apis) · [License API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/license-api) · [Add Database Licenses](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/administer-the-database-agent/add-database-licenses)  
- [AppDynamics On-Premises](https://help.splunk.com/en/appdynamics-on-premises) · [03 SaaS vs on-prem](./03_SaaS_Vs_On_Prem_Controller.md)  
- [14 Worked example](./14_Worked_Example_First_Service.md) · [15 What to enable next](./15_What_To_Enable_Next_And_When_Not.md) · [PagerDuty](../PagerDuty/README.md) · [Datadog](../Datadog/README.md) · [New Relic](../New_Relic/README.md)
