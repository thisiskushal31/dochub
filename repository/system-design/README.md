# System Design Concepts

Concise, use-case driven notes for system design: core principles, common
building blocks, and when to apply each technique.

## Structure

- `fundamentals/` — requirements, SLIs/SLOs, back-of-the-envelope sizing, APIs.
- `patterns/` — load balancing, sharding, CQRS, event sourcing, leader election.
- `caching/` — cache patterns (CDN, request/response, object), invalidation, TTLs.
- `messaging/` — queues vs streams, ordering, exactly-once patterns, DLQ/parking.
- `storage/` — SQL vs NoSQL, indexing, partitioning, replication, backups/PITR.
- `consistency/` — CAP/PCP trade-offs, quorum, idempotency, saga compensation.
- `availability/` — HA/DR, multi-AZ/region, failover, circuit breakers, retries/backoff.
- `performance/` — latency budgets, concurrency limits, rate limiting, batching.
- `security/` — authn/authz, encryption, secrets, tenant isolation, threat models.
- `observability/` — logging, metrics, tracing, dashboards, on-call runbooks.

## How to use

1) Start with `fundamentals/` to frame the problem (requirements, SLIs/SLOs, sizing).
2) Pick building blocks by constraint: latency → `caching`/`performance`; scale → `patterns`/`messaging`/`storage`; resilience → `availability`/`consistency`.
3) Map each choice to a failure model and mitigation (retries/backoff, idempotency, DLQ, replicas).
4) Validate with back-of-the-envelope math and add observability hooks before launch.

## Contributing

- Keep examples concise and tie each technique to a use case.
- Prefer checklists and diagrams over long prose.
- Note trade-offs (consistency vs availability, latency vs cost) explicitly.
