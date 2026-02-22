# Assets

Images and diagrams for **System-Design-Concepts** notes. All paths are relative to this repo root.

## Structure

- **`assets/`** — Root for all static assets.
- **`assets/<topic>/`** — Per-topic images. `<topic>` matches the concept folder or a clear slug.

| Folder | Use for |
|--------|--------|
| `assets/fundamentals/` | DNS, TCP/HTTP, CDN, load balancers, APIs, microservices, etc. |
| `assets/databases/` | SQL/NoSQL, sharding, replication, storage systems. |
| `assets/storage/` | Indexing, partitioning, materialized views, static hosting. |
| `assets/patterns/` | CQRS, event sourcing, gateways, sidecar, leader election. |
| `assets/caching/` | Cache layers, write-through, cache-aside, TTL. |
| `assets/messaging/` | Queues, pub/sub, backpressure, async flows. |
| `assets/consistency/` | CAP, consistency models, idempotency. |
| `assets/availability/` | Failover, circuit breaker, HA, RPO/RTO. |
| `assets/performance/` | Latency, throughput, antipatterns. |
| `assets/security/` | Auth, valet key, gatekeeper. |
| `assets/observability/` | Logs, metrics, traces, dashboards. |

## Adding images

1. **Download** only if the image is valid and you can save it (e.g. PNG, SVG, JPG).
2. Save under **`assets/`** or **`assets/<topic>/`** (e.g. `assets/fundamentals/dns-flow.png`).
3. In the note, reference **only with a relative path** to the local file (e.g. `../assets/fundamentals/dns-flow.png`). This repo is self-contained; do not reference external image URLs.
4. If the image is **invalid or unavailable**: do not add a file and do not mention external sources; omit the image and keep the note self-contained.

## Copied images

Diagrams from the karanpratapsingh/portfolio system-design course have been downloaded into the topic folders above (e.g. `fundamentals/`, `databases/`, `caching/`, `consistency/`, `messaging/`, `patterns/`, `availability/`, `performance/`, `storage/`). They are referenced from the concept notes with relative paths (e.g. `../assets/databases/sharding.png`). Topic files that use these images include: `fundamentals/3-dns.md`, `fundamentals/4-cdn.md`, `fundamentals/5-load-balancers.md`, `fundamentals/13-api-gateway.md`, `fundamentals/14-proxies-and-websockets.md`, `availability/2-failover.md`, `caching/1-caching-overview.md`, `caching/3-write-through.md`, `databases/4-database-sharding.md`, `databases/5-database-replication.md`, `storage/1-indexing.md`, `consistency/2-cap-theorem.md`, `messaging/1-message-queues.md`, `patterns/4-circuit-breaker.md`, `performance/2-rate-limiting.md`.
