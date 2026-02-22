# WhatsApp (instant messaging)

Design an instant messaging service like WhatsApp, Messenger, or WeChat.

## Requirements

Functional: One-on-one and group chats; text and media; delivery/read receipts; last seen; push notifications. Non-functional: Low latency; high availability; scale to billions of users.

## High-level design

- **Clients**: WebSocket or long-lived HTTP for real-time; push when offline.
- **API gateway**: REST and WebSocket. [API Gateway](../fundamentals/13-api-gateway.md)
- **Chat service**: Send/receive; store messages; message queue for group fan-out. [Message queues](../messaging/1-message-queues.md)
- **Message store**: Shard by chat_id or user_id. [Sharding](../databases/4-database-sharding.md)
- **Presence**: Online and last seen; in-memory or KV with TTL. [Caching](../caching/1-caching-overview.md)
- **Media**: Object storage and CDN. [Storage systems](../databases/3-storage-systems.md), [CDN](../fundamentals/4-cdn.md)
- **Push**: FCM/APNs for offline users.

## Key concepts

Message queues for fan-out; WebSockets for real-time; caching for presence and recent messages; object storage and CDN for media. See [Message queues](../messaging/1-message-queues.md), [API Gateway](../fundamentals/13-api-gateway.md), [Proxies and WebSockets](../fundamentals/14-proxies-and-websockets.md).

## Example: send message

Client sends to API; chat service writes to store and publishes to queue; online users get via WebSocket; offline get push; read receipts update and notify sender.

## Real-world

WhatsApp: Erlang, message queues. See concept links above.

---

## Further reading (how it works in detail)

- **High Scalability:** [The WhatsApp architecture Facebook bought for $19B](http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html) — real architecture breakdown.
- **Slack (similar: real-time chat):** [Real-time messaging at Slack](https://slack.engineering/real-time-messaging/) (Slack Engineering Blog). **Discord:** [How Discord stores trillions of messages](https://discord.com/blog/how-discord-stores-trillions-of-messages) (Discord Blog).
- **YouTube / courses:** [Design WhatsApp](https://algomaster.io/learn/system-design-interviews/design-whatsapp) (AlgoMaster). Newsletter: [WhatsApp system design](https://newsletter.systemdesign.one/p/whatsapp-system-design), [Design a chat system](https://newsletter.systemdesign.one/p/design-a-chat-system).
- **More:** [Companies & products index](0-companies-and-products.md) — WhatsApp, Slack, Discord, Facebook.
