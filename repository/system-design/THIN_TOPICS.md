# Thin topics — deepen next

Files under **~45 lines** (August 2026 audit). Expand to repo style: What → Why → How → Details → Trade-offs → When to use; add Mermaid/ASCII diagrams and failure modes where relevant.

**Priority:** files under **~25 lines** first (marked ⚡).

---

## ⚡ Highest priority (&lt;20 lines)

- [ ] [availability/1-availability-patterns.md](./availability/1-availability-patterns.md) (11)
- [ ] [caching/5-refresh-ahead.md](./caching/5-refresh-ahead.md) (15)
- [ ] [consistency/1-availability-vs-consistency.md](./consistency/1-availability-vs-consistency.md) (15)
- [ ] [fundamentals/9-service-discovery.md](./fundamentals/9-service-discovery.md) (16)
- [ ] [security/1-security-overview.md](./security/1-security-overview.md) (16)
- [ ] [availability/3-replication.md](./availability/3-replication.md) (17)
- [ ] [caching/4-write-behind.md](./caching/4-write-behind.md) (17)
- [ ] [fundamentals/7-application-layer.md](./fundamentals/7-application-layer.md) (17)
- [ ] [patterns/5-bulkhead-and-retry.md](./patterns/5-bulkhead-and-retry.md) (17)

## fundamentals

- [ ] [6-horizontal-scaling.md](./fundamentals/6-horizontal-scaling.md) (18)
- [ ] [8-microservices.md](./fundamentals/8-microservices.md) (21)
- [ ] [2-performance-and-latency.md](./fundamentals/2-performance-and-latency.md) (22)
- [ ] [19-designing-scalable-systems.md](./fundamentals/19-designing-scalable-systems.md) (22)
- [ ] [1-intro-and-approach.md](./fundamentals/1-intro-and-approach.md) (25)

## observability (bulk thin — fill as a batch)

- [ ] [1-monitoring-overview.md](./observability/1-monitoring-overview.md) through [9-distributed-tracing.md](./observability/9-distributed-tracing.md) — all 9 files ~19–31 lines

## security

- [ ] [2-federated-identity.md](./security/2-federated-identity.md) (22)
- [ ] [3-gatekeeper.md](./security/3-gatekeeper.md) (21)
- [ ] [4-valet-key.md](./security/4-valet-key.md) (20)
- [ ] [5-data-backup-and-disaster-recovery.md](./security/5-data-backup-and-disaster-recovery.md) (25)
- [ ] [6-ssl-and-tls.md](./security/6-ssl-and-tls.md) (25) — link [Networks Security](../Networks-Deep-Dive/Security/2_Encryption_Tls.md)

## storage, performance, patterns, messaging

- [ ] [storage/](./storage/README.md) topics 1–5 (~23–27 lines each)
- [ ] [performance/](./performance/README.md) topics 1–4 (~22–29 lines)
- [ ] [patterns/3-leader-election.md](./patterns/3-leader-election.md), [7-serverless.md](./patterns/7-serverless.md), [8-event-sourcing-vs-event-streaming.md](./patterns/8-event-sourcing-vs-event-streaming.md)
- [ ] [messaging/2-task-queues.md](./messaging/2-task-queues.md), [3-backpressure.md](./messaging/3-backpressure.md)

## cases (add sections, not necessarily longer prose)

- [ ] Cases 1–6 — add **Failure modes**, **Capacity sketch**, **What breaks first** (see [PLANNED_CASES.md](./PLANNED_CASES.md))

---

**After thin topics:** fill [failure-modes/](./failure-modes/README.md) and new case stubs in [cases/](./cases/README.md).
