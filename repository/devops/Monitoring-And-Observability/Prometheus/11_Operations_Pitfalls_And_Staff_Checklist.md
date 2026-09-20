# 11 — Operations, pitfalls, and staff checklist

[← Previous](./10_Kubernetes_Operator_And_Monitors.md) · [README](./README.md) · [Next →](./12_Worked_Example_First_Service.md)

## 1. Concepts — day-2 is the product

Prometheus is a **production data plane**. Capacity, upgrades, config-as-code, and on-call for *telemetry* outages matter as much as app pages.

### Failure modes (field-tested × docs-aligned)

| Failure | What you see | Direction |
|---------|--------------|-----------|
| Cardinality spike | OOM, slow queries, huge WAL/head | metric_relabel emergency drop; fix instrumentation ([02](./02_Data_Model_Types_And_Labels.md)) |
| SD / selector break | Targets missing; silent gaps | Targets UI; alert on absent `up` for critical jobs |
| Rule eval overload | Late/missing alerts; slow API | Recording rules; split groups; less heavy alerts ([07](./07_Recording_Rules_And_SLIs.md)) |
| Alert storms | Mute culture | Grouping; symptom alerts; inhibit carefully ([08](./08_Alerting_Rules_And_Alertmanager.md)) |
| Disk full / retention war | Crashes; truncated history | Retention flags; volume alerts |
| Remote write backlog | `samples_pending` climb; eventual **~2h** loss risk | Fix receiver; tune queues ([09](./09_Storage_Remote_Write_Federation_And_HA.md)) |
| AM mis-LB | Missed/duped pages | List all AM peers; no LB ([08](./08_Alerting_Rules_And_Alertmanager.md)) |
| Pushgateway ghosts | Stale series forever | Delete API; prefer textfile for machine batch ([03](./03_Architecture_Scrape_And_Pushgateway.md)) |

**Monitor the monitor:** alert when Prometheus is down, rule evaluations fail, scrapes fail for critical jobs, disks fill, remote write falls behind. A dead-man’s switch (Watchdog alert that must always fire / heartbeat) catches “AM cannot notify.”

**Disconfirm:** Green app dashboards while half the targets show `up=0` ≠ healthy. “We’ll notice if metrics die” ≠ an alert. Skipping `promtool` in CI ≠ safe rule shipping.

**Confirm:** Who pages when Prometheus itself is down? What is the restore path for config + rules?

## 2. Advanced

**Upgrades:** read release notes for PromQL, TSDB, and Operator skew; stage in non-prod.

**Cost:** series × retention × replicas × remote-write fanout ([parent 30](../30_Telemetry_Cost_And_FinOps.md)).

**Security:** scrape credentials, admin APIs (`/-/quit`, lifecycle), UI exposure—bind carefully; prefer SSO at the ingress.

**Capacity:** RAM tracks active series + churn more than “I set 30d retention” alone.

## 3. Applications and use cases

| Scenario | First move |
|----------|------------|
| New team onboarding | Template: metrics + scrape + recordings + one symptom alert |
| Cardinality spike at 2am | metric_relabel drop → page app owners → fix labels |
| “Metrics feel wrong” | Check `up`, rule eval, remote-write pending, AM peers |
| Postmortem: silent outage | Add meta-alert + Watchdog; fix symptom coverage |

**Staff checklist**

- Config + rules in Git; `promtool check config|rules` in CI  
- Label contract + metric_relabel seatbelts  
- AM: all peers listed; routes tested; runbooks on page alerts  
- Retention + remote-write lag story explicit  
- Meta-alerts: Prometheus down, AM down, rule failures, disk, remote-write pending  
- Cardinality review cadence  
- New-service template: `/metrics` + scrape/ServiceMonitor + RED recordings + burn/symptom alert  
- Score against parent [28](../28_Shape_Scorecard_Drills_And_Maturity.md)  

**Good:** opt-in scrapes, recorded SLIs, quiet pages, autonomous dig during outages.  
**Bad:** scrape-all, dashboard-only “alerting,” Pushgateway-for-apps, AM behind a random LB.

## References

- [Management API](https://prometheus.io/docs/prometheus/latest/management_api/)  
- [promtool](https://prometheus.io/docs/prometheus/latest/command-line/promtool/)  
- [12 Worked example](./12_Worked_Example_First_Service.md)
