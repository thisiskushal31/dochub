# Cost vs Performance

## What it means

**Performance** (latency, throughput, availability) often comes at a **cost** (hardware, managed services, engineering time). Design and operations involve **trade-offs** between how fast and how reliable the system is and how much you spend.

## Why it matters

- **Budget** — Infinite scale and zero latency are not affordable; you optimize for **acceptable** performance within cost constraints.
- **SLOs** — Define targets (e.g. p99 latency, availability); then choose the **cheapest** design that meets them, or relax targets to reduce cost.

## Trade-off areas

| Levers | Better performance | Higher cost | Lower cost |
|--------|--------------------|------------|------------|
| **Compute** | More / bigger instances, more regions | ✓ | Fewer/smaller instances |
| **Caching** | More cache, longer TTL, more layers | ✓ | Less cache, shorter TTL |
| **Database** | Read replicas, faster storage, more IOPS | ✓ | Single instance, standard storage |
| **CDN / edge** | More PoPs, more caching | ✓ | Fewer PoPs, less edge cache |
| **Replication / DR** | Multi-region, hot standby | ✓ | Single region, cold DR |

## How to balance

- **Measure** — Use latency, throughput, and availability metrics; know current cost per request or per tenant. See [Latency and throughput](3-latency-and-throughput.md), [Availability in numbers](../availability/4-availability-in-numbers.md).
- **Set targets** — SLIs/SLOs and error budgets; avoid over-provisioning for rare spikes unless required.
- **Optimize** — Remove unnecessary work (antipatterns), cache, batch, and scale only what is the bottleneck. See [Performance antipatterns](1-performance-antipatterns.md).
- **Right-size** — Use auto-scaling and spot/preemptible where acceptable to reduce cost while meeting SLOs.

**When to use:** Always consider cost when making performance and availability decisions; optimize for the best performance **within** your cost envelope.
