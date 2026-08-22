# Slack — real-time messaging

Design **team chat** like Slack: channels, DMs, presence, search, integrations — real-time with durable history.

*(Content TBD — stub created August 2026 — priority v3 in [PLANNED_CASES.md](../PLANNED_CASES.md))*

## Planned coverage

### Requirements

- Real-time message delivery, channel membership, history, presence (online/away)
- Scale: many concurrent connections, enterprise workspaces

### High-level design

- WebSocket gateway layer; connection sharding
- Message storage and indexing for search
- Fan-out to channel members; presence pub/sub
- Compare/contrast with [Discord](./7-discord-messaging.md) and [WhatsApp](./2-whatsapp.md)

### Key concepts

- [fundamentals/14-proxies-and-websockets.md](../fundamentals/14-proxies-and-websockets.md), [messaging/](../messaging/README.md)

### Further reading

- [Slack — Real-time messaging](https://slack.engineering/real-time-messaging/)
- [Companies index](./0-companies-and-products.md)

## Checklist before marking done

- [ ] WebSocket scaling approach (sticky vs shared state)
- [ ] Failure modes: reconnect storm, message ordering
