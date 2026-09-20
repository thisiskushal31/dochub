# 14 — Batch, cron, and async monitoring

[← Previous](./13_Dependency_And_Peer_Monitoring.md) · [README](./README.md) · [Next →](./15_Capacity_And_Saturation.md)

## 1. Concepts — work that is not a live HTTP request

Batch jobs, cron, workers, and consumers fail **silently** under HTTP-only monitoring. Detect layer for async work:

| Signal | Meaning |
|--------|---------|
| **Last success** | Timestamp gauge of last good completion (dead man’s snitch pattern) |
| **Duration** | How long the run took vs SLO window (“must finish by 06:00”) |
| **Failure count** | Runs that ended failed |
| **Lag / backlog** | Consumer lag, queue depth growth |
| **Throughput** | Records processed / byte rate |

```text
Schedule / queue
    → worker
    → last_success_unixtime
    → alert if now - last_success > threshold
```

**Freshness SLIs** often matter more than raw success (“data older than 2h”).

**Disconfirm:** “Cron is in the crontab” ≠ monitoring. HTTP green while nightly ETL failed ≠ OK. Queue depth without consumer lag context ≠ enough.

**Confirm:** For one critical nightly job, what is the last-success alert? For one consumer, what lag pages?

## 2. Advanced — windows, backfills, and poison messages

**SLA windows:** “finished by 06:00 local” needs timezone-aware evaluation; burn concepts still apply with time-based freshness SLIs ([8](./8_SLI_SLO_SLA_And_Error_Budgets.md)).

**Backfills / replays:** do not let intentional historical runs look like freshness recovery without marking job type.

**Poison messages:** failure rate with no lag movement → stuck partition; monitor both.

**Idempotency & exactly-once folklore:** monitor duplicates/side effects where business cares—not only consumer ack rate.

**Failure mode:** Alert only on job *start* miss, not completion → long running zombie looks healthy.

## 3. Applications

**Staff checklist**

- Last-success (or freshness) alert per critical batch  
- Lag alert per critical consumer group  
- Runbooks include replay/backfill ownership  

**Exercise:** Mute the worker (staging). How long until someone is notified without a human noticing missing data?

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [13 Dependencies](./13_Dependency_And_Peer_Monitoring.md) · [15 Capacity](./15_Capacity_And_Saturation.md)
