# Queues vs Streams

Message **queues** and **event streams** both support asynchronous communication but serve different needs: queues for task distribution and single-consumer processing, streams for real-time, replayable event flow and multiple consumers.

---

## Message queue (traditional)

- **Consumption model** — Messages are typically **consumed by one consumer** (competing consumers); once acked, the message is gone.
- **Ordering** — May be best-effort or per-queue; not always strict global order.
- **Replay** — Usually no replay; messages are removed after delivery.
- **Persistence** — Messages stored until consumed or expired.
- **Use cases** — Task distribution, job queues, decoupling; microservices communication; order processing; task scheduling; background jobs (e.g. RabbitMQ, SQS). "Process this once."

**Common implementations:** Amazon SQS, RabbitMQ, Apache ActiveMQ.

---

## Event stream (log-based)

- **Consumption model** — Events stay in an **immutable log**; **multiple consumer groups** can read the same stream; each group has its own offset. Events are **replayable** — not removed after consumption.
- **Ordering** — Often **per partition** or per key; order within a partition; global order not guaranteed.
- **Replay** — **Designed for replay**; events can be re-read from the beginning of the stream (within retention). Supports **event sourcing** — reconstruct state at any point in time.
- **Persistence** — Durable log; time-based or size-based retention.
- **Use cases** — Real-time data processing; event sourcing; fraud detection; log aggregation; real-time analytics; event-driven architectures. "Everyone who needs this event can read it."

**Common implementations:** Apache Kafka, Amazon Kinesis, Apache Pulsar.

---

## Comparison

| Feature | Message queues | Event streams |
|--------|----------------|---------------|
| **Primary use** | Task distribution; asynchronous communication | Real-time processing; event-driven architectures |
| **Delivery** | Often exactly-once or at-least-once per consumer | High throughput; at-least-once or at-most-once common |
| **Ordering** | Order within a queue | Order within partition/stream; not necessarily global |
| **Consumer model** | One consumer per message; message removed after consumption | Multiple subscribers; stream remains; replay possible |
| **Persistence** | Until consumed or TTL | Immutable log; retention window |
| **Replay** | Generally not designed for replay | Built for replay; reprocess from offset |
| **Scaling** | More queues or consumers | Partition stream; distribute partitions across consumers |
| **State** | Often needs separate state/progress tracking | State often built into stream processing |

---

## Choosing

- **Queue** — When you want "one worker processes this message" and don’t need replay or multiple independent consumers.
- **Stream** — When you need ordering, replay, or many consumers reading the same events (e.g. Kafka, Kinesis). Use **dead-letter queues (DLQ)** for messages that fail processing repeatedly so they don’t block the main queue or stream.
