# 12 — Operations, pitfalls, and staff checklist

[← Previous](./11_ILM_Data_Tiers_Retention_And_Cost.md) · [README](./README.md) · [Next →](./13_Worked_Example_First_Service.md)

## 1. Concepts — failure modes you will hit

| Failure | What you see | What to do |
|---------|--------------|------------|
| No ILM / stuck policy | Disk full, yellow/red | Fix ILM errors (`_ilm/explain`); capacity before migrate ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) |
| Mapping conflict | Ingest rejects / `_ignored` fields | Fix index template; new data stream; stop dynamic spam ([16](./16_Streams_Processors_And_Data_Quality.md)) |
| Stale Elastic Agents | Missing integrations, hard support | Fleet upgrade policy; pin + canary ([04](./04_Agent_Fleet_Beats_And_Logstash.md)) |
| Fleet policy drift | Staging Agents “stopped working” | Policy as code; freeze click-ops for owned policy ids ([20](./20_API_Fleet_Automation_And_RBAC.md)) |
| Dual ELK + Loki forever | Split digs, double paging | One primary log plane per env ([Loki](../Loki/README.md), [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |
| Dual APM / OTel + native | Double traces, double cost | One path: Elastic APM **or** EDOT/OTel ([10](./10_OpenTelemetry_To_Elastic.md)) |
| Alert spam | On-call ignores pages | Symptom-first SLOs ([09](./09_Alerting_SLOs_And_Incident_Management.md), [parent 10](../10_Alert_Hygiene_And_Burn_Rates.md)) |
| Logs without scrubbing | PII / secret incident | Redact at Agent, ingest pipeline, or Streams ([05](./05_Logs_Ingest_Discover_And_Streams.md)) |
| Every product day one | Cost + noise | Phase enables ([14](./14_What_To_Enable_Next_And_When_Not.md)) |
| Elastic as only audit | Compliance gap | Keep cloud audit trails ([31](../31_Cloud_Managed_Sinks_And_Audit_Door.md)) |
| Unowned enrollment tokens | Silent re-enroll / leak | Secrets manager; rotate; revoke orphans ([20](./20_API_Fleet_Automation_And_RBAC.md)) |
| Observe-the-observer missing | Digs fail mid-Sev1 | Platform SLOs: ingest lag, reject rate, Kibana up |

**Disconfirm:** More Kibana dashboards ⇒ more reliability. Opening support without cluster health, Agent status, and ILM explain. “We indexed it” ⇒ diggable without `service.name` / `trace.id` correlation ([parent 21](../21_Correlation_And_Dig_Methodology.md)). Security detection volume ⇒ app reliability ([18](./18_Security_SIEM_Literacy.md)).

**Confirm:** Who upgrades Agents, owns ILM/DLM, reviews mappings, owns paging hygiene, and owns GenAI connectors ([19](./19_Observability_AI.md))?

## 2. Advanced — dual planes, PII, Fleet, cluster health

**Self-managed / ECK.** Watch disk watermarks, heap, pending tasks, shard counts, and ILM explain. Unequal hardware inside a tier causes hot spotting. Snapshot and restore drills beat hope. Pause ILM only for planned maintenance—document who unpauses.

**Elastic Cloud / serverless.** Project or deployment health in Cloud UI; autoscaling and billing dimensions still need a human owner. Serverless hides node ops—**retention and ingest volume** remain your FinOps levers ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)). CPS (cross-project search) can make Discover volumes disagree with origin-scoped Observability apps—train diggers ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Observe the observer (platform SLO).** Treat the observability estate as a production system:

| Symptom | Signal |
|---------|--------|
| Ingest lag / backlog | Agent output errors, pipeline reject, indexing rate drop |
| Search unavailable | Kibana / ES health, circuit breakers |
| Dig quality collapse | Data set quality Poor %, failure-store growth (**beta**/preview—[16](./16_Streams_Processors_And_Data_Quality.md)) |
| Silent Agent death | Fleet Agent offline %, last check-in |

Page **platform on-call** for these—not every service owner.

**Dual planes.** App RED digs live in Observability. Threat/EDR lives in Elastic Security ([18](./18_Security_SIEM_Literacy.md)). Cloud **audit** (CloudTrail, Activity, GCP Audit) is a compliance door ([15](./15_Cloud_Integrations.md), [31](../31_Cloud_Managed_Sinks_And_Audit_Door.md)). Mixing all three into one PagerDuty service is how Sev1 storms become wallpaper.

**Fleet hygiene.** One policy per role (k8s node, app host, edge); don’t snowflake Agents in UI forever. Enrollment tokens are secrets. Monitor Agent health; canary upgrades before fleet-wide. Label policies `obs` vs `defend` when Security shares the Agent.

**PII and compliance.** Observability indexes often hold tokens, emails, and payloads. Treat Discover like a data store: RBAC by space/index, field-level controls where needed, retention shorter than “legal hold forever.” GenAI connectors process prompts—**not anonymized by default** ([19](./19_Observability_AI.md)).

**Version skew.** Mixed Stack versions break ILM assumptions and Fleet packages. Upgrade order: Elasticsearch → Kibana → Agents (write your own if docs for your version differ); keep a rollback note.

**API key / space sprawl.** Orphan Kibana API keys and shared `superuser` in CI are day-2 incidents waiting ([20](./20_API_Fleet_Automation_And_RBAC.md)).

**Maintenance windows.** Pause ILM only for planned work and document who unpauses. Snapshot before major upgrades. Watch for ILM still advancing on yellow clusters (unallocated shards)—fix allocation rather than assuming policies are “stuck forever.”

**Data quality as ops signal.** Rising **Poor** data-set scores or failure-store growth is an ingest regression, not a Discover bug—route to the stream/processor owner ([16](./16_Streams_Processors_And_Data_Quality.md)). Treat experimental Nightshift rule storms as GenAI+Streams ops, not “more SLOs” ([19](./19_Observability_AI.md)).

**Support packet.** Before opening Elastic support: deployment/project id, Stack versions, `_cluster/health`, Agent Fleet status screenshot, `_ilm/explain` for stuck indices, recent policy/template changes, and whether the path is APM-native vs EDOT.

## 3. Applications — staff checklist and drills

**Staff checklist**

- [ ] Cluster/project health alerts (disk, ingest reject, ILM errors, Kibana up)  
- [ ] Platform SLO defined (observe-the-observer) with named owner  
- [ ] ILM/DLM + snapshot repo tested restore  
- [ ] Fleet Agent version policy; enrollment tokens in secrets manager  
- [ ] Mapping / template change review; data quality thresholds watched  
- [ ] PII scrubbing on common log paths; GenAI allowlist reviewed  
- [ ] One primary log plane per env (Elastic **or** Loki, not both forever)  
- [ ] APM/OTel path written down (single path)  
- [ ] Monitor ownership + page route; SLO list matches journeys  
- [ ] Security vs Observability on-call separated  
- [ ] Cloud audit / IAM logs still enabled outside Elastic  
- [ ] Quarterly: revoke orphan API keys / enrollment tokens; delete unused alerts  

**Drills:** break staging on purpose ([13](./13_Worked_Example_First_Service.md)); practice ILM explain on a stuck index; rotate one enrollment token end-to-end; quarterly delete unused dashboards; revoke a leaked API key and confirm Agents/APM still authenticate.

**Good:** dual-plane clarity, Fleet as code, platform pages for the stack itself. **Bad:** one forever shared admin, dual shippers, Security paging SRE for every detection.


**Weekly ops rhythm.** Monday: Fleet offline Agents + failed upgrades. Midweek: ILM explain / disk watermarks / serverless ingest trend. Friday: alert noise review (ack rates, flapping rules) and revoke any temporary keys from incidents. Keep a living “known dual-plane” list so Sev1 commanders know which page is Obs vs Security vs cloud audit.


### Observe-the-observer starter monitors

| Monitor | Why |
|---------|-----|
| Disk watermark / project storage % | Prevent emergency deletes |
| ILM error count / stuck phase | Catch migrate failures early |
| Fleet Agents offline % | Silent telemetry loss |
| Ingest reject / pipeline failure rate | Mapping explosions |
| Kibana availability / login errors | Dig glass down mid-incident |
| Connector delivery failures | Pages that never leave Kibana |

Wire these to **platform** on-call. Service teams should not own “Elasticsearch is red.”

## References

- [ILM troubleshooting](https://www.elastic.co/docs/troubleshoot/elasticsearch/index-lifecycle-management-errors) · [Fleet](https://www.elastic.co/docs/reference/fleet) · [Observability docs](https://www.elastic.co/docs/solutions/observability)  
- [Deploy-manage users/roles](https://www.elastic.co/docs/deploy-manage/users-roles) · [API keys](https://www.elastic.co/docs/deploy-manage/api-keys)  
- [13 Worked example](./13_Worked_Example_First_Service.md) · [20 API / Fleet / RBAC](./20_API_Fleet_Automation_And_RBAC.md)
