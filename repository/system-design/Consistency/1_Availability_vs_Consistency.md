# Availability vs Consistency

## Definitions

- **Availability** — The system can serve clients even when failures occur. Often measured as uptime (percentage of time the service is up).
- **Consistency** — All clients see the same data at the same time; reads reflect the latest writes.

## The trade-off

In distributed systems you often trade one for the other:

- **Prioritize availability** → System keeps responding; data might be stale or divergent.
- **Prioritize consistency** → All nodes agree on data; some requests may block or fail when nodes are partitioned.

Replication and consensus algorithms are used to balance this. Choosing the right level per operation is a core design decision.
