# Event Sourcing vs Event Streaming

## What they are

- **Event sourcing** — A **storage and modeling pattern**: the **source of truth** is an **append-only log of events**. Current state is derived by replaying events or from projections. Focus is on **what happened** and **reconstructing state**. See [Event sourcing](1-event-sourcing.md).
- **Event streaming** — A **messaging/infrastructure pattern**: **continuous flow of events** (messages) through a **distributed log** (e.g. Kafka). Focus is on **moving events** between producers and consumers at scale, with **retention and replay**. See [Queues vs streams](../messaging/4-queues-vs-streams.md).

## Comparison

| Aspect | Event sourcing | Event streaming |
|--------|----------------|-----------------|
| **Purpose** | Model state as a sequence of events; audit and replay | Transport and distribute events at scale |
| **Focus** | Domain model; state derivation; audit trail | Throughput, retention, multiple consumers, replay |
| **Typical use** | Aggregate state in one service; CQRS read models | Data pipelines, event-driven systems, analytics |
| **Can use** | Event sourcing often **uses** an event stream or log as the store | Event streaming **carries** events; event sourcing can sit on top |

## How they relate

- **Event sourcing** can be **implemented on top of** event streaming: the event store can be a Kafka topic (or similar); consumers build projections or state.
- **Event streaming** does **not** require event sourcing: you can stream events without making the stream the only source of truth for domain state.
- **Event sourcing** is a **design pattern**; **event streaming** is an **infrastructure capability** (durable log, partitions, consumer groups, replay).

**When to use:** Use **event sourcing** when you want state and audit as a sequence of events and the ability to rebuild state. Use **event streaming** when you need to move high-volume events between services with retention and replay. They are often used together.
