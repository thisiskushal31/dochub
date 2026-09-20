# 15 — Capacity and saturation

[← Previous](./14_Batch_Cron_And_Async_Monitoring.md) · [README](./README.md) · [Next →](./16_Structured_Logging.md)

## 1. Concepts — headroom before the cliff

**Saturation** is how close a resource or service is to refusing useful work (queues, pools, disk, CPU, quota). **Capacity** work turns saturation trends into planning: scale, shard, shed load, or buy quota *before* SLO burn.

| Question | Signal family |
|----------|----------------|
| Are we full *now*? | USE; pool wait; queue depth; throttle codes |
| Are we trending full? | Growth of utilization / lag / QPS vs limits |
| What breaks first? | Bottleneck resource per critical path |
| How much headroom? | (limit − peak) / limit with safety margin |

```text
Load ↑ ──► saturation ↑ ──► latency ↑ ──► errors ↑ ──► SLO burn
              ▲
         capacity action should land here
```

**Disconfirm:** Autoscaling without saturation metrics ≠ capacity practice. Annual guesswork spreadsheet ≠ continuous headroom. Only watching average CPU ≠ seeing pool exhaustion.

**Confirm:** What is the first bottleneck on your critical path? What ticket fires before pages?

## 2. Advanced — quotas, multi-tenant, and planning

**Cloud quotas / API limits:** treat provider caps as first-class saturation ([Cloud FinOps / IAM doors](../Cloud/20_FinOps_And_Cost_Controls.md) for cost; visibility here).

**Multi-tenant:** noisy neighbor saturation needs per-tenant fair-share signals ([29](./29_Multi_Env_And_Multi_Tenant_Patterns.md)).

**Load shedding & admission control:** monitor shed rates—shedding is a *feature* that should be visible, not silent “success.”

**Forecasting:** simple trend on weekly peaks often beats unused ML; tie to error budget risk.

**Failure mode:** Scaling on CPU while the real cliff is DB connections → bigger app tier, same outage.

## 3. Applications

**Staff checklist**

- Saturation panels for pools, queues, disk, and cloud quotas on critical paths  
- Ticket thresholds before hard fail  
- Capacity note in postmortems when burn was predicted  

**Exercise:** Name last near-miss. Which saturation signal moved first?

## References

- [Google SRE — Handling overload](https://sre.google/sre-book/handling-overload/)  
- [4 USE / golden](./4_Golden_Signals_RED_And_USE.md) · [11 Host](./11_Infrastructure_And_Host_Monitoring.md)
