# 09 — Database visibility literacy

[← Previous](./08_EUM_Browser_And_Mobile.md) · [README](./README.md) · [Next →](./10_Health_Rules_Policies_And_Alerting.md)

## 1. Concepts — Database Agent vs collectors vs app BT digs

**Database Visibility** is a separate plane from app-server APM. A **Database Agent** hosts one or more **Database Collectors**—each collector pulls performance metrics for a configured database instance/server (waits, top SQL, query-plan stats, sessions, and hardware when configured). App agents already show **remote-service / backend** time on business transactions ([05](./05_Business_Transactions.md), [06](./06_Snapshots_Call_Graphs_And_Troubleshooting.md))—that answers “the BT waited on the DB,” not “which query and lock held the database.”

```text
App-server agent ──► BT exit call / JDBC dig ──► “app waited on DB”
Database Agent   ──► Collector(s) ─────────────► waits / top SQL / sessions
Machine Agent    ──► host beside DB process ───► CPU / disk / mem ([07](./07_Infrastructure_And_Machine_Agents.md))
```

| Signal | What it answers |
|--------|-----------------|
| BT snapshot → JDBC/SQL exit | Which app call burned time; often truncated or driver-level |
| Database Visibility (collector) | Instance wait analysis, top SQL, sessions, collector status |
| Machine / Server Visibility | Host CPU/mem/disk beside the DB process |

**When DB Visibility helps:** DBA + SRE share ownership of a named instance; chronic “DB is slow” pages without query truth; health rules on database metrics, not only BT average response ([10](./10_Health_Rules_Policies_And_Alerting.md)).

**When to stay on BT digs first:** Single noisy endpoint; connection-pool exhaustion in the app tier; bad N+1 in code. Prove the app path before collectors on every shard.

**License literacy.** Controllers need a license for the **total number of databases monitored concurrently**. Transfer = **remove the old collector, then add the new one**. Prefer Database Agent ≥21.2 under infrastructure-based licensing (vendor recommendation on Add Database Licenses).

**Credentials.** Collectors need DB grants appropriate to the vendor. Store passwords in a vault; rotate with DBA change control—never git or chat. Wrong credentials or SSL mismatches look like “agent up, empty Databases UI.”

**Disconfirm:** Database Agent replaces app agents. Empty collectors “until later.” Enabling DB Visibility org-wide on day one of APM ([15](./15_What_To_Enable_Next_And_When_Not.md)). Dual Datadog DBM + AppD DB Visibility on the same instance without a primary ([Datadog](../Datadog/README.md)).

**Confirm:** Unique agent name / host identity per Database Agent? Collectors list the right instances with working grants? Who owns upgrades and collector passwords?

## 2. Advanced — agent, collectors, telemetry, correlation

**Install path.** Prefer Controller **Download & Install**, or install manually with write access to `logs` and `conf`. Verify successful Database Agent start in logs. Container images exist—treat them like any other agent fleet ([04](./04_Install_App_Server_Agents.md)). Use unique agent **name** and **uniqueHostId** so metrics do not collide into one node.

**Collectors.** Add one collector per database you intend to monitor (type, host, credentials, sampling). The collector is the concurrent-license unit. Aggressive sampling on fragile replicas can add load—start with vendor defaults on staging; document `extraProperties` changes you automate via the Database Visibility API ([16](./16_API_Automation_And_RBAC.md)).

**Credentials & grants.** Prefer least-privilege monitor accounts (wait views / performance schema as required). SSL/TLS mismatches and expired passwords present as empty Databases UI with a “healthy” agent—check collector status and agent logs before support tickets.

**Telemetry / DB Agent health.** Enable Database Agent telemetry (Controller account property and/or `-Ddbagent.telemetry.enabled=true`) so you can health-rule the agent itself. Account-level enablement is required for some DB Agent health-rule UIs—agent-only flags may hide the option. Page platform when the agent is sick; page DBA when waits/SQL are sick.

**Oracle snapshot correlation** and similar deep features are optional—enable when a named dig needs them, not by default.

**Server Visibility integration.** Pair Database Visibility with Machine/Server Visibility on the DB host to separate “query plan bad” from “disk saturated.” Hardware metrics do not appear without that agent path ([07](./07_Infrastructure_And_Machine_Agents.md)).

**Correlation literacy.** Slow BT → remote-service / backend name → collector instance hostname → top SQL / waits for that window. Without a written BT-backend → collector map, SEVs bounce between app and DBA rotas.

**Dig order that scales.** (1) Golden BT slow? (2) Exit call to DB backend? (3) App pool / thread contention? (4) Database Visibility top SQL / waits. Skipping to DB first pages the wrong rota.

**Vs New Relic / Datadog / Elastic.** Pick **one** primary dig plane for SQL truth ([New Relic](../New_Relic/README.md), [Datadog](../Datadog/README.md)). AppD remains BT-centric; DB Visibility is an amplifier. Elastic/APM dependency views answer “is the DB in the path?” without AppD collectors ([Elastic](../Elastic/README.md)).

### Failure modes

| Failure | What you see |
|---------|----------------|
| License exhausted | New collectors silent or refused |
| Same agent name/host id | Metrics merge; confusing health |
| Collector without DB grants | Partial wait data; support thrash |
| BT dig without DB Visibility | “DB slow” with no query list—expected until collectors exist |
| Alert on every wait spike | Storms ([10](./10_Health_Rules_Policies_And_Alerting.md)) |
| Transfer without remove/add | Old instance still consuming entitlement |

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| First collector | Staging OLTP → one collector → top SQL visible → one health rule |
| Correlate with APM | Slow BT → remote service → Database Visibility for that instance |
| Agent hygiene | Telemetry on; health rule on DB Agent; unique host ids |
| Brownfield | Critical OLTP first; defer replicas/analytics DBs |
| Incident | Confirm lock/wait vs app pool before paging DBA and app on-call |
| License move | Remove old collector → add new → verify concurrent count |

**Good:** one OLTP collector, telemetry on, BT dig still first. **Bad:** collectors on every shard before golden BTs page correctly.

**Staff checklist**

1. License headroom before new collectors; transfer = remove then add.  
2. Credential vault for collector passwords (not git).  
3. Unique agent name / uniqueHostId; telemetry enabled.  
4. When BT dig is enough vs when DB Visibility is required.  
5. No dual SaaS DB monitors without owners ([Datadog](../Datadog/README.md)).  
6. DBA + SRE page matrix written; BT-backend → collector map.  
7. Agent version policy aligned with app/machine agents ([13](./13_Operations_License_And_Pitfalls.md)).

**API automation note.** Collector CRUD via Database Visibility API belongs after one UI success—license checks in the same change as create ([16](./16_API_Automation_And_RBAC.md)). Do not script collectors org-wide on day one of APM.

**Health rules on databases.** Prefer wait/CPU/availability rules on the one critical collector; page DBA rota only. Do not clone app-tier storm patterns onto every wait spike ([10](./10_Health_Rules_Policies_And_Alerting.md)).

## References

- [Database Visibility](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0) · [Install the Database Agent](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/administer-the-database-agent/install-the-database-agent) · [Verify installation](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/administer-the-database-agent/verify-the-database-agent-installation) · [Add Database Collectors](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/add-database-collectors) · [Add Database Licenses](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/administer-the-database-agent/add-database-licenses)  
- [Database Agent Telemetry](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/database-agent-telemetry) · [Database Health Rules and Alerts](https://help.splunk.com/en/appdynamics-saas/database-visibility/26.8.0/monitor-databases-and-database-servers/database-health-rules-and-alerts) · [Database Visibility API](https://help.splunk.com/en/appdynamics-saas/extend-splunk-appdynamics/26.8.0/extend-splunk-appdynamics/splunk-appdynamics-apis/database-visibility-api)  
- [10 Health rules](./10_Health_Rules_Policies_And_Alerting.md) · [Datadog](../Datadog/README.md) · [Elastic](../Elastic/README.md) · [New Relic](../New_Relic/README.md)
