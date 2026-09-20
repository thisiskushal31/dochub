# 26 — OSS, managed, SaaS, and hybrid

[← Previous](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [README](./README.md) · [Next →](./27_Tool_Kinds_By_Job.md)

## 1. Concepts — who runs the plane

| Model | You operate | You pay for | Typical fit |
|-------|-------------|-------------|-------------|
| **Self-managed OSS** | Everything | People + machines | Strong platform team; control needs |
| **Managed OSS** | Config / rules | Vendor-run Prometheus/Grafana/… | Want PromQL without etcd pain |
| **SaaS APM / obs** | Agents / instrumentation | Usage + seats | Speed; multi-cloud UX |
| **Cloud native** | Wiring + IAM | Provider meters | Deep into one cloud |
| **Hybrid** | Split by job | Mixed | Common end state |

```text
Ask: Who patches the TSDB at 2am?
     Who owns retention & cost?
     How hard is exit?
```

**Disconfirm:** “OSS is free” ≠ true TCO. “SaaS means no ops” ≠ no instrumentation/SLO work. Hybrid without ownership map ≠ strategy.

**Confirm:** For metrics, logs, traces, paging—each is which model? Who is paged when the *observability plane* dies?

## 2. Advanced — lock-in, data gravity, and compliance

**Lock-in:** proprietary query languages and agents raise exit cost; OTel and PromQL-friendly paths lower it ([22](./22_Instrumentation_Collectors_And_Backends.md)).

**Data gravity:** hot log storage location may dictate region choices for compliance.

**Compliance:** audit completeness may force cloud trail + SIEM even if APM is SaaS ([31](./31_Cloud_Managed_Sinks_And_Audit_Door.md)).

**Failure mode:** Self-hosted stack with no on-call for the stack → observability outage during product outage.

## 3. Applications

**Staff checklist**

- Written model per pillar (metrics/logs/traces/paging)  
- Exit notes for SaaS (export, OTel)  
- Ownership of the observability plane itself  

**Exercise:** Price last month’s telemetry. Which model change would cut 30% without killing dig path?

## References

- [Cloud/30 managed sinks](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  
- [25 Stack shapes](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [30 FinOps](./30_Telemetry_Cost_And_FinOps.md)
