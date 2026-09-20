# 34 — Reference topologies end-to-end

[← Previous](./33_Kubernetes_Workload_Observability_Patterns.md) · [README](./README.md)

## 1. Concepts — put the jobs on one diagram

This chapter **assembles** the track. Copy a topology that matches your estate; replace logos with your choices from [25](./25_Named_Stack_Shapes_ELK_PLG_LGTM.md)–[27](./27_Tool_Kinds_By_Job.md).

### Topology A — metrics-first LGTM-ish

```text
Apps (OTel) ──► Collector ──► Prometheus/Mimir
                    │              │
                    ├────────► Loki
                    ├────────► Tempo
                    └────────► Grafana Explore
Cloud audit ──► Cloud trail (door 31)
Alerts ──► Alertmanager ──► Pager (door 32)
Synthetics ──► from user region ──► pages on path fail
```

### Topology B — SaaS APM + cloud audit

```text
Apps (vendor agent or OTel) ──► SaaS APM (metrics/traces/logs UX)
Platform ──► Cloud native metrics for managed SKUs
Audit ──► Cloud trail / SIEM
Pager ◄── SaaS monitors + cloud alarms (inhibit duplicates)
```

### Topology C — Elastic-centric logs + Prom metrics

```text
Logs ──► Elastic stack
Metrics ──► Prometheus
Correlate via trace_id / shared service labels in Grafana or Kibana
```

| Must appear in every topology | Why |
|-------------------------------|-----|
| SLI/SLO + burn pages | Detect |
| Dig path joins | Explain |
| Audit trail | Security RCA |
| Cost/retention owners | Survive scale |
| On-call route | Human loop |

**Disconfirm:** Topology with no black-box ≠ complete. Topology with three page pipes ≠ complete. Skipping doors 31–32 ≠ “done with observability.”

**Confirm:** Draw your live topology. Which box is weakest? Re-score [28](./28_Shape_Scorecard_Drills_And_Maturity.md).

## 2. Advanced — brownfield migration spine

1. Freeze new special-case tools.  
2. Contract labels/fields ([7](./7_Cardinality_And_Label_Contracts.md)).  
3. SLOs on top services ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)).  
4. Collector dual-export if migrating ([22](./22_Instrumentation_Collectors_And_Backends.md)).  
5. Drill dig path ([21](./21_Correlation_And_Dig_Methodology.md), [28](./28_Shape_Scorecard_Drills_And_Maturity.md)).  
6. Only then deepen tool folders.

## 3. Applications

**Staff checklist**

- One canonical topology diagram linked from the team wiki  
- Gaps listed against scorecard  
- README tool gate passed before product deep-dives  

**You are ready for tool folders when:** detect vs explain is crisp, one SLI/SLO exists, dig path works in a drill, and a named shape is chosen.

## References

- [README](./README.md) · [0 How to read](./0_How_To_Read.md)  
- [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md) · [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md)  
- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
