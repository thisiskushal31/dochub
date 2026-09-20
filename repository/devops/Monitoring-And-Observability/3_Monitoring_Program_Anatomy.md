# 3 — Monitoring program anatomy

[← Previous](./2_Mindset_And_Anti_Patterns.md) · [README](./README.md) · [Next →](./4_Golden_Signals_RED_And_USE.md)

## 1. Concepts — what a complete detect layer contains

A **monitoring program** is not “we installed an agent.” It is the set of jobs that make *known* bad states visible and actionable.

| Layer | Job | Examples |
|-------|-----|----------|
| Intent | Define good | SLIs/SLOs ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)) |
| Signals | Measure the right things | Golden/RED/USE ([4](./4_Golden_Signals_RED_And_USE.md)); black/white box ([5](./5_Black_Box_White_Box_And_Synthetics.md)) |
| Data shape | Types and labels | Metric types ([6](./6_Metric_Types_And_Aggregation.md)); cardinality ([7](./7_Cardinality_And_Label_Contracts.md)) |
| Presentation | Explore vs wake | Dashboards vs alerts vs pages ([9](./9_Dashboards_Alerts_And_Pages.md)) |
| Hygiene | Keep pages trustworthy | Burn rates, noise control ([10](./10_Alert_Hygiene_And_Burn_Rates.md)) |
| Scope by workload | Cover what you run | Host ([11](./11_Infrastructure_And_Host_Monitoring.md)), app ([12](./12_Application_And_Service_Monitoring.md)), peers ([13](./13_Dependency_And_Peer_Monitoring.md)), batch ([14](./14_Batch_Cron_And_Async_Monitoring.md)), capacity ([15](./15_Capacity_And_Saturation.md)) |

```text
Intent (SLO)
  → Signals (what)
  → Collection (how often / from where)
  → Evaluation (rules)
  → Notification (who / how urgent)
  → Response (runbook)
  → Review (noise / gaps)
```

**Minimum viable program for one service:** one user-facing SLI, one burn-based page, one overview dashboard, black-box check from outside the cluster, documented dig next step.

**Disconfirm:** Exporters everywhere without SLOs ≠ a program. A single “CPU” board for the company ≠ coverage. Paging email aliases without ownership ≠ notification.

**Confirm:** For one critical service, can you point at each layer in the table? Which layer is empty?

## 2. Advanced — org shape and failure modes

**Central platform + embedded owners:** Platform runs the TSDB, log plane, and alert routing; services define SLIs and own pages. Pure central “we monitor everything” usually produces generic alerts nobody trusts.

**Environments:** Prod pages; staging may alert to tickets; dev rarely pages. Same signal taxonomy, different urgency ([29](./29_Multi_Env_And_Multi_Tenant_Patterns.md)).

**Failure modes**

| Failure | What you see | Likely gap |
|---------|--------------|------------|
| Users report outage first | No external check | Black-box / synthetic missing |
| Pages at 3am for nothing | Mute culture | Cause-based or flappy rules |
| “Everything red” after deploy | No change markers / too wide blast | Events + tighter SLIs |
| Blind async path | HTTP green, data stale | Batch/queue monitoring missing |

## 3. Applications

**Staff checklist**

- Written map: intent → signals → collection → evaluation → notification → response for the top service  
- Every production page has an owner and a runbook link  
- Gap list for peers/batch/capacity exists (not “we’ll notice”)  

**Exercise:** Inventory alerts for one team. Classify each as symptom vs cause. Target: pages are mostly symptom.

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [4 Golden signals](./4_Golden_Signals_RED_And_USE.md) · [8 SLI/SLO](./8_SLI_SLO_SLA_And_Error_Budgets.md)
