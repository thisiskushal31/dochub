# URL shortener (Bitly / Pastebin)

Design a **URL shortener** (e.g. Bitly) or **paste** service (e.g. Pastebin): user submits a long URL (or block of text); system returns a short link; resolving the short link redirects to the original URL (or shows the paste).

---

## Requirements

### Functional

- **Shorten**: Submit long URL → get short link (e.g. `https://short.com/Ab3xY`).
- **Redirect**: GET short link → 302/301 redirect to original URL (or serve paste content).
- Optional: custom alias, expiration, analytics (click count).

### Non-functional

- **Read-heavy** — Resolves (redirects) dominate; must be very fast.
- High availability; short links are often used in production (emails, SMS).
- Scale to billions of short links and high resolve QPS.

---

## High-level design

1. **API** — Shorten (POST long URL, optional alias, TTL) and resolve (GET short path). [API Gateway](../fundamentals/13-api-gateway.md), [Rate limiting](../performance/2-rate-limiting.md)
2. **Key generation** — Produce unique short id (e.g. 7–8 chars). Options: **random** (collision check), **base62 encode** of auto-increment ID, or **pre-generate** pool (KGS). Uniqueness and collision handling are critical.
3. **Metadata store** — DB or **key-value store**: short_id → long_url, created_at, optional expiry, user_id. Shard by short_id. [Sharding](../databases/4-database-sharding.md)
4. **Cache** — **Critical for resolve path**: short_id → long_url in cache (e.g. Redis). Most traffic is redirect; cache hit avoids DB. [Caching](../caching/1-caching-overview.md)
5. **Pastebin variant** — Store paste *content* in **object storage** or blob store; metadata DB holds short_id → pointer to content. [Storage systems](../databases/3-storage-systems.md)

---

## Key concepts used

| Concept | Where it fits |
|--------|----------------|
| **Caching** | Resolve (redirect) must be fast; cache short_id → long_url; high hit rate. [Caching](../caching/1-caching-overview.md) |
| **Key-value / sharding** | Simple lookup by short_id; shard by id for scale. [Sharding](../databases/4-database-sharding.md) |
| **Object storage** | Pastebin: store large paste body in object store; DB stores only short_id and reference. [Storage systems](../databases/3-storage-systems.md) |
| **Rate limiting** | Limit shorten and resolve per IP/user to prevent abuse. [Rate limiting](../performance/2-rate-limiting.md) |

---

## Example: shorten and resolve flow

**Shorten:** Client POSTs `{ "url": "https://very-long-url.com/..." }`. Server generates unique short_id (e.g. from KGS or base62 of DB id), stores short_id → long_url in DB (and optionally in cache), returns `https://short.com/<short_id>`.

**Resolve:** Client GETs `https://short.com/Ab3xY`. Load balancer → API; lookup Ab3xY in **cache**; on hit return 302 to long_url. On miss, lookup in DB, populate cache, then 302. Analytics can be done asynchronously (e.g. log click, process in batch).

---

## Real-world notes

- **Bitly**, **TinyURL**: Focus on short link generation, redirect, and analytics.
- **Pastebin**: Same idea for text pastes; content stored separately; optional expiration and visibility.

For more: [Caching](../caching/1-caching-overview.md), [Sharding](../databases/4-database-sharding.md), [Rate limiting](../performance/2-rate-limiting.md).

---

## Further reading (how it works in detail)

- **Company blog:** [Bitly Engineering Blog](http://word.bitly.com/) — how Bitly builds and scales.
- **Article:** [Design TinyURL](http://n00tc0d3r.blogspot.com/) (blog). **Course / walkthrough:** [AlgoMaster – Design URL Shortener](https://algomaster.io/learn/system-design-interviews/design-url-shortener).
- **Full solution (step-by-step):** [donnemartin/system-design-primer – Pastebin](https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/pastebin/README.md) — components, trade-offs.
- **More:** [Companies & products index](0-companies-and-products.md) — Bitly and other companies.
