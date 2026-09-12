# Slack — real-time messaging

Design **team chat** like Slack: channels, DMs, presence, search, integrations — real-time with durable history.

*(Stub — fill this case when you write it.)*

## Planned coverage

### Requirements

- Real-time message delivery, channel membership, history, presence (online/away)
- Scale: many concurrent connections, enterprise workspaces

### High-level design

- WebSocket gateway layer; connection sharding
- Message storage and indexing for search
- Fan-out to channel members; presence pub/sub
- Compare/contrast with [Discord](./7_Discord_Messaging.md) and [WhatsApp](./2_Whatsapp.md)

### Key concepts

- [Fundamentals/14_Proxies_and_WebSockets.md](../Fundamentals/14_Proxies_and_WebSockets.md), [Messaging/](../Messaging/README.md)

### Further reading

- [Slack — Real-time messaging](https://slack.engineering/real-time-messaging/)
- [Companies index](./0_Companies_and_Products.md)

## Checklist before marking done

- [ ] WebSocket scaling approach (sticky vs shared state)
- [ ] Failure modes: reconnect storm, message ordering
