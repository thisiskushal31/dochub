# Load Balancing vs Failover

## What they do

- **Load balancing** — Distributes **ongoing traffic** across **multiple healthy** nodes so no single node is overloaded and throughput is maximized. All nodes are used at the same time.
- **Failover** — Switches traffic **from a failed node to a standby** so the system keeps running when a component fails. Focus is on **availability**, not spreading load.

## Comparison

| Aspect | Load balancing | Failover |
|--------|----------------|----------|
| **Goal** | Spread load; improve throughput and latency | Keep service up when a node fails |
| **When** | All the time (normal operation) | When primary (or active) fails |
| **Nodes** | Multiple active nodes share traffic | Primary + standby (or active-active with LB) |
| **Use together** | LB distributes across active nodes; failover brings standby into play when one fails | Often used together: LB in front of a pool; failover for the pool or for critical single points (e.g. DB leader) |

## How they work together

- Put a **load balancer** in front of several app servers; LB sends each request to one of the servers. If one server is down, LB stops sending to it (health checks).
- For components that cannot be load-balanced (e.g. single primary DB), use **failover**: standby takes over when the primary fails. See [Failover](2-failover.md).
- **Active-active** setups combine both: multiple nodes serve traffic (LB) and failure of one is handled by the others (no separate standby). **Active-passive** is classic failover: one active, one standby.

**When to use:** Use **load balancing** to scale and utilize multiple nodes; use **failover** (or active-active with LB) to remove single points of failure. See [Load balancers](../fundamentals/5-load-balancers.md) and [Failover](2-failover.md).
