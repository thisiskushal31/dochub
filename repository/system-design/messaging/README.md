# Messaging

Message queues, task queues, streams, backpressure, reliability (DLQ), types of message queues, scaling, and why not to use a database as a queue.

## Topics

| Topic | File |
|--------|------|
| Message queues | [1-message-queues.md](1-message-queues.md) |
| Task queues | [2-task-queues.md](2-task-queues.md) |
| Backpressure | [3-backpressure.md](3-backpressure.md) |
| Queues vs streams | [4-queues-vs-streams.md](4-queues-vs-streams.md) |
| DLQ and reliability | [5-dlq-and-reliability.md](5-dlq-and-reliability.md) |
| Types of message queues (point-to-point, pub/sub, routing, prioritization, broker vs streaming) | [6-types-of-message-queues.md](6-types-of-message-queues.md) |
| Scaling message queues | [7-scaling-message-queues.md](7-scaling-message-queues.md) |
| Database as message queue (anti-pattern) | [8-database-as-message-queue-anti-pattern.md](8-database-as-message-queue-anti-pattern.md) |

## Quick reference

- **Two main styles** — **Point-to-point** (queue; one consumer per message) and **Publish-subscribe** (topic; broadcast to all subscribers). See [Types of message queues](6-types-of-message-queues.md).
- **Message queue** — Decouple producer/consumer; hold and deliver messages; at-most / at-least / exactly-once.
- **Task queue** — Tasks + optional results and scheduling; often on top of a message broker.
- **Queue types/features** — FIFO, delay/schedule, push vs pull, ordering, DLQ, poison pill.
- **Backpressure** — Limit queue size or flow so slow consumers don’t get overwhelmed.
- **Stream** — Log-style; multiple consumers; replay; ordering per partition. **Broker vs event streaming** — Brokers often support both queue and pub/sub; event streaming is pub/sub-style with retention and replay.
- **DLQ** — Move repeatedly failed messages aside (or undeliverable, TTL exceeded, format errors); inspect and republish or discard.
- **Scaling** — Vertical/horizontal scaling, queue partitioning, batch processing, prioritization, monitoring, HA. See [Scaling message queues](7-scaling-message-queues.md).
- **Database as queue** — Avoid; use a dedicated message queue for throughput, latency, and reliability. See [Database as message queue (anti-pattern)](8-database-as-message-queue-anti-pattern.md).
