# Backpressure

## What it is

**Backpressure** is the idea that when a **consumer** (or a stage in a pipeline) cannot keep up, it signals "slow down" so that **producers** don’t overwhelm it. Without backpressure, queues grow unbounded, memory fills, and latency or failures spread.

## Why it matters

If the queue grows faster than consumers process:

- Queue size can exceed memory → disk spill, cache misses, slowdowns.
- Latency for items already in the queue increases.
- The system can become unstable (OOM, timeouts).

Backpressure keeps the queue bounded and preserves throughput and latency for work already accepted.

## How to apply it

- **Limit queue size** — When the queue is full, reject or block new work. Clients get "server busy" or HTTP 503 and can **retry later** (e.g. with exponential backoff).
- **Flow control** — In streaming systems, consumers advertise how many more messages they can take; producers send only up to that limit.
- **Dropping or sampling** — In some systems (e.g. metrics), drop or sample when overloaded instead of queuing forever.

**Use case:** Any pipeline or queue where producers can be faster than consumers. Combine with retries and circuit breakers so clients know when to back off. See [Message queues](1-message-queues.md) and [Availability — Background jobs](../availability/5-background-jobs.md).
