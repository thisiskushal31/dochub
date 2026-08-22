# Discord — messaging at scale

Design a **chat platform** like Discord: guilds/channels, persistent message history, real-time delivery, trillions of messages stored.

*(Content TBD — stub created August 2026 — priority v1 in [PLANNED_CASES.md](../PLANNED_CASES.md))*

## Planned coverage

### Requirements

- Functional: send/receive messages, channels, history pagination, search (optional)
- Non-functional: low latency delivery, durable storage, horizontal scale

### High-level design

- Message ingest API → queue/stream → storage (wide-column e.g. Cassandra)
- Snowflake / time-sortable IDs; partition key design (channel_id)
- Real-time: WebSockets gateway, pub/sub fan-out
- Hot channel mitigation

### Key concepts

- [messaging/](../messaging/README.md), [databases/4-database-sharding.md](../databases/4-database-sharding.md), [fundamentals/14-proxies-and-websockets.md](../fundamentals/14-proxies-and-websockets.md)

### Failure modes (to fill)

- Hot partition, backlog lag, WebSocket reconnect storms → [failure-modes/](../failure-modes/README.md)

### Further reading

- [Discord — How we store trillions of messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)
- [Companies index](./0-companies-and-products.md)

## Checklist before marking done

- [ ] Requirements + NFR table
- [ ] HLD diagram (Mermaid)
- [ ] Failure modes section
- [ ] Capacity sketch (orders of magnitude)
