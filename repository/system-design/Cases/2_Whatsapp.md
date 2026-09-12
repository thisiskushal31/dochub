# WhatsApp (instant messaging)

Design an instant messaging service like WhatsApp, Messenger, or WeChat.

## Requirements

Functional: One-on-one and group chats; text and media; delivery/read receipts; last seen; push notifications. Non-functional: Low latency; high availability; scale to billions of users.

## High-level design

- **Clients**: WebSocket or long-lived HTTP for real-time; push when offline.
- **API gateway**: REST and WebSocket. [API Gateway](../Fundamentals/13_API_Gateway.md)
- **Chat service**: Send/receive; store messages; message queue for group fan-out. [Message queues](../Messaging/1_Message_Queues.md)
- **Message store**: Shard by chat_id or user_id. [Sharding](../Databases/4_Database_Sharding.md)
- **Presence**: Online and last seen; in-memory or KV with TTL. [Caching](../Caching/1_Caching_Overview.md)
- **Media**: Object storage and CDN. [Storage systems](../Databases/3_Storage_Systems.md), [CDN](../Fundamentals/4_CDN.md)
- **Push**: FCM/APNs for offline users.

## Key concepts

Message queues for fan-out; WebSockets for real-time; caching for presence and recent messages; object storage and CDN for media. See [Message queues](../Messaging/1_Message_Queues.md), [API Gateway](../Fundamentals/13_API_Gateway.md), [Proxies and WebSockets](../Fundamentals/14_Proxies_and_WebSockets.md).

## Example: send message

Client sends to API; chat service writes to store and publishes to queue; online users get via WebSocket; offline get push; read receipts update and notify sender.

## Real-world

WhatsApp: Erlang, message queues. See concept links above.

---

## Further reading (how it works in detail)

- **High Scalability:** [The WhatsApp architecture Facebook bought for $19B](http://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html) — real architecture breakdown.
- **Slack (similar: real-time chat):** [Real-time messaging at Slack](https://slack.engineering/real-time-messaging/) (Slack Engineering Blog). **Discord:** [How Discord stores trillions of messages](https://discord.com/blog/how-discord-stores-trillions-of-messages) (Discord Blog).
- **YouTube / courses:** [Design WhatsApp](https://algomaster.io/learn/system-design-interviews/design-whatsapp) (AlgoMaster). Newsletter: [WhatsApp system design](https://newsletter.systemdesign.one/p/whatsapp-system-design), [Design a chat system](https://newsletter.systemdesign.one/p/design-a-chat-system).
- **More:** [Companies & products index](0_Companies_and_Products.md) — WhatsApp, Slack, Discord, Facebook.
