# 13 — Dependency and peer monitoring

[← Previous](./12_Application_And_Service_Monitoring.md) · [README](./README.md) · [Next →](./14_Batch_Cron_And_Async_Monitoring.md)

## 1. Concepts — the services you call

Most user paths die in **peers**: databases, caches, queues, payment providers, identity, other internal APIs. **Dependency monitoring** tracks those calls as first-class RED (from *your* client side) plus peer-native signals when you own them.

| Peer kind | Client-side signals | Peer-native (if owned) |
|-----------|---------------------|-------------------------|
| Datastore | Query latency, error, pool wait | Connections, slow queries, replication lag |
| Cache | Hit ratio, latency, errors | Evictions, memory |
| Queue | Publish/consume latency, errors | Depth, consumer lag ([14](./14_Batch_Cron_And_Async_Monitoring.md)) |
| HTTP API | Rate/error/duration by peer | Their SLOs / status page |
| Third party | Same + contract SLO | Vendor status; synthetic on their URL |

```text
Your SLI burn
   ├─ your bug / saturation
   └─ peer class failing ──► peer dashboard / vendor status
```

**Ownership:** you always own *client-side* peer SLIs for user paths. You may not own the peer’s internal dashboards—still graph the call.

**Disconfirm:** “DB team will page us” ≠ you have dependency visibility. Ignoring third parties until Twitter ≠ monitoring. Collapsing all peers into one `dependency_error` without names ≠ actionable.

**Confirm:** List peers on the checkout path. Which have client-side RED? Which are third-party?

## 2. Advanced — blast radius, budgets, and classification

**Classify:** hard dependency (user fail if peer down) vs soft (degraded feature). Alert urgency follows class.

**Budget accounting:** peer outages usually spend *your* user-facing budget. Track “burn attributed to peer X” for vendor management and architecture (bulkheads, caches).

**Fan-out:** one request → many peers—trace dig ([18](./18_Distributed_Tracing.md)) finds the slow one faster than metrics alone.

**Failure mode:** Retry storms amplify peer pain and your error rate—monitor retry counts and circuit-breaker state as saturation-adjacent signals.

## 3. Applications

**Staff checklist**

- Client-side RED for each hard dependency on critical paths  
- Runbook links to peer owners / vendor status  
- Bulkhead / timeout settings documented beside dashboards  

**Exercise:** Pick last peer-caused incident. Did your first alert name the peer?

## References

- [Google SRE — Addressing cascading failures](https://sre.google/sre-book/addressing-cascading-failures/)  
- [14 Batch / async](./14_Batch_Cron_And_Async_Monitoring.md) · [18 Tracing](./18_Distributed_Tracing.md)
