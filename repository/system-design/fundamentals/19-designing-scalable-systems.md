# Designing Highly Scalable Systems

## What it means

A **scalable system** can handle **growth** in load (more users, more data, more requests) without a full redesign. Design choices (statelessness, partitioning, caching, async processing) determine how far you can scale horizontally and where bottlenecks appear.

## Principles

1. **Stateless application tier** — No per-request state on app servers; session in shared store (Redis, DB). Any instance can serve any request; scale by adding instances. See [Stateful vs stateless](15-stateful-vs-stateless.md).
2. **Horizontal scaling** — Add more machines; use load balancers to distribute traffic. Prefer over vertical scaling for long-term growth. See [Horizontal scaling](6-horizontal-scaling.md).
3. **Database scaling** — Read replicas for read-heavy workloads; sharding/partitioning when write or data size outgrows one node. See [Replication](../databases/5-database-replication.md), [Sharding](../databases/4-database-sharding.md).
4. **Caching** — Reduce load and latency; cache at multiple layers (app, edge, CDN). See [Caching](../caching/1-caching-overview.md).
5. **Async and queues** — Decouple producers and consumers; absorb spikes and offload work to workers. See [Message queues](../messaging/1-message-queues.md).
6. **Choose the right scalability approach** — Vertical (scale up) for quick wins and small teams; horizontal (scale out) for long-term growth. Identify bottlenecks first. See [Scalability bottlenecks](18-scalability-bottlenecks.md).

## Choosing the right approach

- **Vertical scaling** — Simpler; good when load is moderate and growth is predictable. Limited by single-machine capacity and cost.
- **Horizontal scaling** — Required for very high scale; needs stateless design, partitioning, and operational maturity.
- **Hybrid** — Scale app tier horizontally; scale DB vertically first, then add replicas/sharding when needed.

**When to use:** Apply these principles from the start for new systems that expect growth; refactor existing systems toward statelessness, partitioning, and caching as bottlenecks appear.
