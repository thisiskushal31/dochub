# 31 — Cloud managed sinks and audit door

[← Previous](./30_Telemetry_Cost_And_FinOps.md) · [README](./README.md) · [Next →](./32_On_Call_And_Human_Loop_Door.md)

## 1. Concepts — this chapter is a door

Cloud providers ship **managed metrics, logs, traces, alarms, and audit trails**. Depth of *which SKU when* lives in **[Cloud/30 — Cloud observability and audit doors](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)**. This chapter only positions the door so you do not re-teach CloudWatch vs Cloud Monitoring here.

```text
Audit / control-plane trail  →  who changed IAM, VPC, buckets
Platform resource signals    →  managed metrics/logs for cloud SKUs
App telemetry                →  OTel → native / managed Prom / SaaS
Paging                       →  cloud alarm → on-call tool
```

| Job | Why it is not optional on cloud |
|-----|----------------------------------|
| Org audit trail | Security RCA; not replaced by APM |
| Native resource metrics | VMs, LBs, managed DBs emit here first |
| App pipeline choice | Native vs managed Prom vs SaaS ([26](./26_OSS_Managed_SaaS_And_Hybrid.md)) |

**Disconfirm:** Pretty APM ≠ CloudTrail/Audit Logs. Skipping native metrics until an outage ≠ strategy. This handbook folder ≠ cloud product catalog.

**Confirm:** Where do IAM changes land on your cloud? Where do app RED metrics land? Open Cloud/30 for the decision table.

## 2. Advanced — shared responsibility

You still design SLOs, labels, and dig paths ([1](./1_Paired_Practice_Monitoring_And_Observability.md)–[21](./21_Correlation_And_Dig_Methodology.md)). The cloud manages undifferentiated plane ops for native sinks—not your symptom definitions.

**Plant / colo telemetry** is another door: Datacenter integration chapters—not duplicated here.

## 3. Applications

**Staff checklist**

- Audit trail enabled org-wide before arguing APM features  
- Explicit choice documented: native vs managed Prom vs SaaS for apps  
- Alarm → page path tested  

**Next read:** [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) end-to-end, then return to [34](./34_Reference_Topologies_End_To_End.md).

## References

- [Cloud/30 — Managed observability on cloud](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  
- [26 OSS/SaaS/hybrid](./26_OSS_Managed_SaaS_And_Hybrid.md) · [32 On-call door](./32_On_Call_And_Human_Loop_Door.md)
