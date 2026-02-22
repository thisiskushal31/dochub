# Primary Scalability Bottlenecks

## What they are

**Bottlenecks** are components or resources that limit how much the system can scale. When load grows, the bottleneck saturates first (CPU, I/O, locks, a single service) while other parts are underused.

## Common bottlenecks

| Area | Examples |
|------|----------|
| **Single point** | One DB, one queue, one leader; no horizontal scaling. |
| **CPU** | Heavy computation in one service or one thread. |
| **I/O** | Disk or network bound; slow DB queries, large payloads. |
| **Locks / contention** | Shared state, single writer, or fine-grained locking causing serialization. |
| **Connection limits** | DB connection pool, file descriptors, or downstream connection caps. |
| **Memory** | Large in-memory state, caches, or leaks. |
| **Vertical limit** | One machine can only scale up so far (cost and hardware limits). |

## How to address them

- **Horizontal scaling** — Add more instances behind a load balancer; requires stateless or sharded design. See [Horizontal scaling](6-horizontal-scaling.md).
- **Partitioning / sharding** — Split data or work so multiple nodes share the load. See [Partitioning](../storage/2-partitioning.md), [Sharding](../databases/4-database-sharding.md).
- **Caching** — Reduce read load and latency. See [Caching](../caching/1-caching-overview.md).
- **Async / queues** — Offload work to workers; smooth peaks. See [Message queues](../messaging/1-message-queues.md).
- **Connection pooling / limits** — Tune pools; use connection multiplexing or async I/O where possible.
- **Optimize hot path** — Profile; reduce computation, I/O, or lock scope on the critical path.

**When to use:** During capacity planning and when scaling; identify the bottleneck before adding more of a non-bottleneck resource. See [Designing highly scalable systems](19-designing-scalable-systems.md).
