# Messaging

Message queues, task queues, streams, backpressure, reliability (DLQ), types of message queues, scaling, and why not to use a database as a queue.

## Topics

| Topic | File |
|--------|------|
| Message queues | [1_Message_Queues.md](1_Message_Queues.md) |
| Task queues | [2_Task_Queues.md](2_Task_Queues.md) |
| Backpressure | [3_Backpressure.md](3_Backpressure.md) |
| Queues vs streams | [4_Queues_vs_Streams.md](4_Queues_vs_Streams.md) |
| DLQ and reliability | [5_Dlq_and_Reliability.md](5_Dlq_and_Reliability.md) |
| Types of message queues (point-to-point, pub/sub, routing, prioritization, broker vs streaming) | [6_Types_of_Message_Queues.md](6_Types_of_Message_Queues.md) |
| Scaling message queues | [7_Scaling_Message_Queues.md](7_Scaling_Message_Queues.md) |
| Database as message queue (anti-pattern) | [8_Database_As_Message_Queue_Anti_Pattern.md](8_Database_As_Message_Queue_Anti_Pattern.md) |

## Quick reference

- **Two main styles** — **Point-to-point** (queue; one consumer per message) and **Publish-subscribe** (topic; broadcast to all subscribers). See [Types of message queues](6_Types_of_Message_Queues.md).
- **Message queue** — Decouple producer/consumer; hold and deliver messages; at-most / at-least / exactly-once.
- **Task queue** — Tasks + optional results and scheduling; often on top of a message broker.
- **Queue types/features** — FIFO, delay/schedule, push vs pull, ordering, DLQ, poison pill.
- **Backpressure** — Limit queue size or flow so slow consumers don’t get overwhelmed.
- **Stream** — Log-style; multiple consumers; replay; ordering per partition. **Broker vs event streaming** — Brokers often support both queue and pub/sub; event streaming is pub/sub-style with retention and replay.
- **DLQ** — Move repeatedly failed messages aside (or undeliverable, TTL exceeded, format errors); inspect and republish or discard.
- **Scaling** — Vertical/horizontal scaling, queue partitioning, batch processing, prioritization, monitoring, HA. See [Scaling message queues](7_Scaling_Message_Queues.md).
- **Database as queue** — Avoid; use a dedicated message queue for throughput, latency, and reliability. See [Database as message queue (anti-pattern)](8_Database_As_Message_Queue_Anti_Pattern.md).
