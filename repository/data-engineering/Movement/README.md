# Movement

[← README](../README.md)

*(Stub — fill this layer when you write it.)*

Buffers, logs, and pipes between capture and transform. A named bus is an instance of a log or queue.

## Topic files

| # | Topic | Status |
|---|--------|--------|
| 1 | [Transport, buffers, replay](./1_Transport_Buffers_Replay.md) | stub |
| 2 | [Backpressure](./2_Backpressure.md) | stub |

## Systems that implement this layer

| System | Role here |
|--------|-----------|
| [Kafka](../Systems/Kafka/README.md) | Durable partitioned log |
| [Pulsar](../Systems/Pulsar/README.md) | Log + queue |
| [NATS](../Systems/NATS/README.md) | Lightweight messaging |
| [Kinesis](../Systems/Kinesis/README.md) | Managed partitioned log |
| [PubSub](../Systems/PubSub/README.md) | Managed push/pull bus |

New bus: add `Systems/<Name>/`, then a row here. Do not create a new layer.

## Checklist before marking done (whole section)

- [ ] All topic files filled (no TBD)
- [ ] Examples of current tools are dated and replaceable
