# Planned case studies — tracker

Cases with **full writeups** vs **stubs** or **index-only** (August 2026 audit). Tick `- [x]` when a case matches existing case file quality (requirements, HLD, concept links, failure modes, further reading).

## Existing cases (deepen — add Failure modes section)

- [ ] [1 — Google Drive / file sync](./cases/1-google-drive-file-sync.md)
- [ ] [2 — WhatsApp](./cases/2-whatsapp.md)
- [ ] [3 — Twitter / feed](./cases/3-twitter.md)
- [ ] [4 — Uber / geospatial](./cases/4-uber.md)
- [ ] [5 — YouTube / Netflix](./cases/5-youtube-netflix.md)
- [ ] [6 — URL shortener](./cases/6-url-shortener.md)

## New case stubs (fill in order)

| Priority | Case | File | Key concepts |
|----------|------|------|--------------|
| v1 | Discord messaging at scale | [cases/7-discord-messaging.md](./cases/7-discord-messaging.md) | Wide-column/Cassandra, snowflake IDs, hot partitions |
| v1 | Instagram feed / photos | [cases/8-instagram-feed.md](./cases/8-instagram-feed.md) | Sharding, CDN, fan-out, object storage |
| v2 | Stripe / payments API | [cases/9-stripe-payments.md](./cases/9-stripe-payments.md) | Idempotency, ledger, exactly-once, PCI boundaries |
| v2 | Distributed rate limiter | [cases/10-rate-limiter-design.md](./cases/10-rate-limiter-design.md) | Token bucket, Redis, sliding window, edge vs central |
| v3 | Slack real-time messaging | [cases/11-slack-realtime.md](./cases/11-slack-realtime.md) | WebSockets, presence, channel fan-out |
| v2 | Notification system (push/email/SMS) | [cases/12-notification-system.md](./cases/12-notification-system.md) | Queues, fan-out, device tokens, dedup |
| v2 | Email service (Gmail-scale) | [cases/13-email-service.md](./cases/13-email-service.md) | SMTP, storage, search, spam |
| v3 | Ticket / event booking | [cases/14-ticket-booking.md](./cases/14-ticket-booking.md) | Concurrency, locks, overselling |
| v3 | Recommendation engine | [cases/15-recommendation-engine.md](./cases/15-recommendation-engine.md) | Offline/online features, ranking |
| v3 | Distributed cron / scheduler | [cases/16-distributed-scheduler.md](./cases/16-distributed-scheduler.md) | Leader election, exactly-once runs |
| v3 | Web crawler | [cases/17-web-crawler.md](./cases/17-web-crawler.md) | Frontier, politeness, dedup (Bloom) |
| v3 | Pastebin / object-heavy | *(covered in 6)* | Extend case 6 if needed |

**Resource index:** [cases/0-companies-and-products.md](./cases/0-companies-and-products.md) — external links only; convert priority rows into in-repo cases over time.
