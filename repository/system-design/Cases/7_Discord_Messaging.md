# Discord — messaging at scale

Design a **chat platform** like Discord: guilds/channels, persistent message history, real-time delivery, trillions of messages stored.

*(Stub — fill this case when you write it.)*

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

- [Messaging/](../Messaging/README.md), [Databases/4_Database_Sharding.md](../Databases/4_Database_Sharding.md), [Fundamentals/14_Proxies_and_WebSockets.md](../Fundamentals/14_Proxies_and_WebSockets.md)

### Failure modes (to fill)

- Hot partition, backlog lag, WebSocket reconnect storms → [Failure-Modes/](../Failure-Modes/README.md)

### Further reading

- [Discord — How we store trillions of messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)
- [Companies index](./0_Companies_and_Products.md)

## Checklist before marking done

- [ ] Requirements + NFR table
- [ ] HLD diagram (Mermaid)
- [ ] Failure modes section
- [ ] Capacity sketch (orders of magnitude)
