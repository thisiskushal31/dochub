# 07 — Alerting, OnCall, and boundaries

[← Previous](./06_Dashboards_Provisioning_As_Code.md) · [README](./README.md) · [Next: Worked example →](./08_Worked_Example_Alloy_To_Grafana.md)

## 1. Concepts — one page path per symptom

You can alert from:

| Path | Strength | Risk |
|------|----------|------|
| **Prometheus + Alertmanager** | PromQL-native; battle-tested grouping/inhibit | Another UI to learn |
| **Grafana Alerting** | Multi-datasource rules; unified UI | Easy to duplicate Prom pages |
| **Grafana OnCall** (or PagerDuty) | Schedules, escalations | Not a metrics DB |

**Rule:** each user symptom has **one** pager pipeline. Dual-firing Grafana + Prometheus on the same error ratio → mute culture.

Modern LGTM often: **Mimir/Prometheus rules → Alertmanager or Grafana Alerting → OnCall/PagerDuty**; Grafana remains Explore/dashboards.

**Disconfirm:** “Grafana alerts replace SLOs” ≠ true. OnCall without alert hygiene ≠ SRE ([parent 10](../10_Alert_Hygiene_And_Burn_Rates.md), [32](../32_On_Call_And_Human_Loop_Door.md)).

**Confirm:** Where does checkout error-ratio page come from—exactly one system?

## 2. Advanced

Contact points, notification policies, and silences in Grafana Alerting rhyme with Alertmanager concepts—don’t run both with overlapping rules “just in case.”

Practice depth: [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md) · [PagerDuty](../PagerDuty/README.md).

## 3. Applications

**Staff checklist**

- Written decision: Prom AM vs Grafana Alerting for pages  
- No duplicate rules across systems  
- Runbook links on page alerts  

## References

- [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/)  
- [Prometheus Alertmanager](../Prometheus/08_Alerting_Rules_And_Alertmanager.md)  
- [08 Worked example](./08_Worked_Example_Alloy_To_Grafana.md)
